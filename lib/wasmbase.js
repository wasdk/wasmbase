/* Copyright 2017 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var INITIAL_MEMORY = 16 * 1024 * 1024;
var MAXIMUM_MEMORY = 32 * 1024 * 1024;
var WASM_PAGE_SIZE = 64 * 1024;
var TABLE_SIZE = 120;
var DYNAMICTOP_PTR = 0;
var EXCLUDED_BASE_EXPORTS = [
  "memoryBase",
  "tableBase",
  "_registerObject",
  "_unregisterObject",
  "memory",
  "table",
];

var memory, table
var malloc, free, memset;
var baseInstance;
var baseExports = [];

var global = {
  NaN: NaN,
  Infinity: Infinity
};
var asm2wasm = {
  "f64-to-int": function (f) { return f|0; /* ??? */ }
};

function readExports(module) {
  var result = [];
  WebAssembly.Module.exports(module).forEach(function (e) {
    if (EXCLUDED_BASE_EXPORTS.indexOf(e.name) >= 0)
      return;
    if (e.name[0] == '_' && e.name[1] == '_' && e.name[2] == 'W') {
      switch (e.name[3]) {
        case 'A':
          result.push({type: 'alias', name: '_' + e.name.substring(4), from: e.name});
          break;
        case 'P':
          result.push({type: 'ptr', name: 'g$_' + e.name.substring(4), from: e.name});
          break;
      }
    } else {
      result.push({type: 'export', name: e.name});
    }
  });
  return result;
}

function createEnv() {
  function nop(msg) {
    console.log("NOP: " + msg);
  }
  function enlargeMemory(size) {
    return memory.grow(size); // TODO check size units
  }
  function getTotalMemory() {
    return memory.buffer.byteLength;
  }
  function _memmove(dest, src, num) {
    new Uint8Array(Memory.buffer).set(new Uint8Array(Memory.buffer, src, num), dest);
    return dest;
  }
  function _memcpy(dest, src, num) {
    return _memmove(dest, src, num);
  }
  function _emscripten_memcpy_big(dest, src, num) {
    return _memmove(dest, src, num);
  }
  function ___cxa_pure_virtual() {
    throw new Error("___cxa_pure_virtual");
  }

/*
function ___assert_fail(condition, filen
function _sched_yield() {
function _pthread_mutex_lock(x) {
function _abort() {
function _pthread_mutex_unlock(x) {
function _pthread_mutex_trylock(x) {
function _sbrk(increment) {
function ___setErrNo(value) {
function _llvm_bswap_i32(x) {
function ___syscall6(which, varargs) {
function ___syscall140(which, varargs) {
function ___syscall146(which, varargs) {
*/
  return {
    enlargeMemory: enlargeMemory,
    getTotalMemory: getTotalMemory,
    _memmove: _memmove,
    _memcpy: _memcpy,
    _emscripten_memcpy_big: _emscripten_memcpy_big,
    abortOnCannotGrowMemory: nop.bind(null, "abortOnCannotGrowMemory"),
    abort: nop.bind(null, "abort"),
    _pthread_getspecific: nop.bind(null, "_pthread_getspecific"),
    _pthread_setspecific: nop.bind(null, "_pthread_setspecific"),
    _pthread_key_create: nop.bind(null, "_pthread_key_create"),
    _pthread_mutex_lock: nop.bind(null, "_pthread_mutex_lock"),
    _pthread_mutex_unlock: nop.bind(null, "_pthread_mutex_unlock"),
    _pthread_mutex_trylock: nop.bind(null, "_pthread_mutex_trylock"),
    _pthread_once: nop.bind(null, "_pthread_once"),
    _sbrk: nop.bind(null, "_sbrk"),
    _abort: nop.bind(null, "_abort"),
    ___setErrNo: nop.bind(null, "___setErrNo"),
    ___syscall6: nop.bind(null, "___syscall6"),
    ___syscall140: nop.bind(null, "___syscall140"),
    ___syscall146: nop.bind(null, "___syscall146"),
    ___cxa_throw: nop.bind(null, "___cxa_throw"),
    ___cxa_begin_catch: nop.bind(null, "___cxa_begin_catch"),
    ___cxa_allocate_exception: nop.bind(null, "___cxa_allocate_exception"),
    ___cxa_pure_virtual: ___cxa_pure_virtual,
    ___assert_fail: nop.bind(null, "___assert_fail"),
    _sched_yield: nop.bind(null, "_sched_yield"),
    _llvm_bswap_i32: nop.bind(null, "_llvm_bswap_i32"),
    _llvm_nacl_atomic_cmpxchg_i32: nop.bind(null, "_llvm_nacl_atomic_cmpxchg_i32"),
  };
}

function initNativeBase(module) {
  baseExports = readExports(module);

  memory = new WebAssembly.Memory({
    initial: INITIAL_MEMORY / WASM_PAGE_SIZE
  });
  table = new WebAssembly.Table({
    initial: TABLE_SIZE, maximum: TABLE_SIZE, element: 'anyfunc'
  });

  var BASE = 1024, STATIC_SIZE = 1024, STACK_SIZE = 1024;
  var stackTop = BASE + STATIC_SIZE;
  let stackMax = stackTop + STACK_SIZE;
  let staticBase = BASE;
  var env = createEnv();
  env.gb = staticBase;
  env.fb = 0;
  env.STACKTOP = stackTop;
  env.STACK_MAX = stackMax;
  env.DYNAMICTOP_PTR = DYNAMICTOP_PTR;
  env.ABORT = 0;
  env.tempDoublePtr = 0;
  env.memory = memory;
  env.table = table;
  env.memoryBase = staticBase;
  env.tableBase = 0;
  baseInstance = new WebAssembly.Instance(module, {
    env: env,
    asm2wasm: asm2wasm,
    global: global
  });
  runPostInit(baseInstance);
  malloc = baseInstance.exports._malloc;
  free = baseInstance.exports._free;
  memset = baseInstance.exports._memset;
  return baseInstance;
}

function fetchModule(name, base) {
  var url = base ? base + '/' + name : name;
  return fetch(url).then(function (req) {
    return req.arrayBuffer();
  }).then(function (buffer) {
    return WebAssembly.compile(buffer);
  });
}

function runPostInit(instance) {
  if (typeof instance.exports.runPostSets === 'function') {
    instance.exports.runPostSets();
  }
  if (typeof instance.exports.__post_instantiate === 'function') {
    instance.exports.__post_instantiate();
  }
}

function getInstance(module, imports, options) {
  function nyi(importInfo) {
    console.error(`Import ${importInfo.module}::${importInfo.name} was not found`);
    switch (importInfo.kind) {
      case 'global':
        return -1;
      case 'table':
        return new WebAssembly.Table({initial: 1});
      case 'memory':
        return new WebAssembly.Memory({initial: 1});
      default:
        return function () {
          throw new Error(`Not implemented: ${importInfo.module}::${importInfo.name}`);
        };
    }
  }

  var staticSize = (options && options.staticSize) | 1024;
  var stackSize = (options && options.stackSize) | 1024;
  var moduleMemorySize = staticSize + stackSize;

  var moduleBase = malloc(moduleMemorySize);
  if (!moduleBase)
    throw new Error('Unable to allocate memory for module');

  var stackTop = moduleBase + staticSize;
  let stackMax = stackTop + stackSize;
  let staticBase = moduleBase;

  var env = createEnv();
  for (var i in imports)
    env[i] = imports[i];
  // TODO make it on per-need base
  baseExports.forEach(function (e) {
    switch (e.type) {
      case 'alias':
        var namePtr = baseInstance.exports[e.from]();
        var mem = new Uint8Array(Memory.buffer);
        var nameEnd = namePtr; while (mem[nameEnd]) nameEnd++;
        var from = String.fromCharCode.apply(null, mem.subarray(namePtr, nameEnd));
        env[e.name] = baseInstance.exports[from];
        break;
      case 'ptr':
        env[e.name] = baseInstance.exports[e.from];
        break;
      default:
      case 'export':
        env[e.name] = baseInstance.exports[e.name];
        break;
    }
  });

  env.memory = memory;
  env.table = table;
  env.staticBase = moduleBase;
  env.STACKTOP = moduleBase + staticSize;
  env.STACK_MAX = stackTop + stackSize;
  env.memoryBase = moduleBase;
  env.memoryBase = 0;
  env.tableBase = 0;

  var imports = {
    env: env,
    asm2wasm: asm2wasm,
    global: global
  };
  WebAssembly.Module.imports(module).forEach(function (i) {
    if (typeof imports[i.module] === 'undefined')
      imports[i.module] = i.name ? {} : nyi(i);
    if (i.name && typeof imports[i.module][i.name] === 'undefined')
      imports[i.module][i.name] = nyi(i);
  });

  var instance = new WebAssembly.Instance(module, imports);
  runPostInit(instance);
  return instance;
}

var Memory = {
  get buffer() { return memory.buffer; },
  get malloc() { return malloc; },
  get free() { return free; },
  get memset() { return memset; },
};

exports.ready = fetchModule('wasmbase.wasm', __dirname).then(initNativeBase);

exports.waitForReady = function (modules) {
  var readyPromises = modules.map(function (m) {
    return m.ready;
  });
  return Promise.all(readyPromises).then(function () {
    // Instead of returning native modules, returning orignal.
    return modules;
  });
};

exports.fetchModule = fetchModule;
exports.getInstance = getInstance;
exports.Memory = Memory;
