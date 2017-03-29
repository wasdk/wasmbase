var wasmbase = require('../lib/wasmbase.js');

function invokeCallback(p, args) {
  var callback = _callbacks[p];
  return callback(args);
}
function registerObject(p, typeid) {
  _objects[p] = {type: typeid, obj: null};
}
function unregisterObject(p, typeid) {
  delete _objects[p];
}
function ptrOrNull(obj) {
  return obj === null ? NullPtr : obj._ptr;
}
function stackPush(size) {
  return _memory.malloc(size);
}
function stackPop(size, p) {
  _memory.free(p);
}

var _module;
exports.ready = wasmbase.ready.then(function () {
  var path = require.resolve('./test.wasm');
  return wasmbase.getInstance(path, {
    _registerObject: registerObject,
    _unregisterObject: unregisterObject,
    _invokeCallback: invokeCallback,
  });
}).then(function (instance) {
  _module = instance;
})

var _memory = wasmbase.Memory;
var _callbacks = Object.create(null);
var _objects = Object.create(null);
const NullPtr = 0;

// Test class wrapper
class Test {
  static get _typeid() { return 0; }
  static createAndFill(size, fill) {
    var _data = new DataView(_memory.buffer, 0);
    var _stack = stackPush(4);
    var success = _module.exports.__ZN4Test4Test13createAndFillEjhPj(size, fill, _stack + 0);
    var result = _data.getUint32(_stack + 0, true);
    stackPop(4, _stack);
    if (!success)
      throw new Error("call Test createAndFill");
    return result;
  }
  static destroy(ptr) {
    var success = _module.exports.__ZN4Test4Test7destroyEj(ptr);
    if (!success)
      throw new Error("call Test destroy");
  }
}
exports.Test = Test;
function lookupObject_Test(p) {
  if (p === NullPtr) return null;
  var entry = _objects[p];
  if (!entry.obj) {
    entry.obj = new Test();
    entry.obj._ptr = p;
  }
  return entry.obj;
}
// end of Test class wrapper
