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
var TABLE_SIZE = 1;
var DYNAMICTOP_PTR = 0;

var memory, table, instance;
var malloc, free, memset;

var global = {
  NaN: NaN,
  Infinity: Infinity
};

function initNativeBase(module) {
  function nop(msg) {
    console.log("NOP: " + msg);
  }
  function enlargeMemory(size) {
    return memory.grow(size); // TODO check size units
  }
  function getTotalMemory() {
    return memory.buffer.byteLength;
  }

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
  var env = {
    gb: staticBase,
    fb: 0,
    STACKTOP: stackTop,
    STACK_MAX: stackMax,
    DYNAMICTOP_PTR: DYNAMICTOP_PTR,
    ABORT: 0,
    tempDoublePtr: 0,
    enlargeMemory: enlargeMemory,
    getTotalMemory: getTotalMemory,
    abortOnCannotGrowMemory: nop.bind(null, "abortOnCannotGrowMemory"),
    _abort: nop.bind(null, "_abort"),
    abort: nop.bind(null, "abort"),
    _emscripten_memcpy_big: nop.bind(null, "_emscripten_memcpy_big"),
    ___setErrNo: nop.bind(null, "___setErrNo"),
    memory: memory,
    table: table,
    memoryBase: staticBase,
    tableBase: 0
  };
  instance = new WebAssembly.Instance(module, {env: env, global: global});
  runPostInit(instance);
  malloc = instance.exports._malloc;
  free = instance.exports._free;
  memset = instance.exports._memset;
  return instance;
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
  var staticSize = (options && options.staticSize) | 1024;
  var stackSize = (options && options.stackSize) | 1024;
  var moduleMemorySize = staticSize + stackSize;

  var moduleBase = malloc(moduleMemorySize);
  if (!moduleBase)
    throw new Error('Unable to allocate memory for module');

  var stackTop = moduleBase + staticSize;
  let stackMax = stackTop + stackSize;
  let staticBase = moduleBase;

  var env = Object.create(imports);
  env._malloc = malloc;
  env.__Znwj = malloc;
  env.__Znaj = malloc;
  env._free = free;
  env.__ZdlPv = free;
  env.__ZdaPv = free;
  env._memset = memset;
  env.memory = memory;
  env.table = table;
  env.staticBase = moduleBase;
  env.STACKTOP = moduleBase + staticSize;
  env.STACK_MAX = stackTop + stackSize;
  env.memoryBase = moduleBase;
  env.memoryBase = 0;
  env.tableBase = 0;
  var instance = new WebAssembly.Instance(module, {env: env, global: global});
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
