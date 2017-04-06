# Support libraries to extract libcxx exports

## Emscript environment

Install and set enviroment for emsdk.

```
source $EMSDK/emsdk_env.sh
```

Compile simple script to create cached object files:

```
echo "#include <memory>" > simple.cpp
echo "int main() { return *std::make_shared<int>(1); }" >> simple.cpp
emcc -s BINARYEN=1 -O3 --std=c++11 simple.cpp -o simple.js
```

## Getting object files from libcxx

List content of the libcxx archive:

```
llvm-ar t ~/.emscripten_cache/asmjs/libcxx_noexcept.a
```

Extract needed items of the archive, e.g.:

```
llvm-ar x ~/.emscripten_cache/asmjs/libcxx_noexcept.a memory_0ca0789c.cpp.o
```

## Get supplemental export files

For every needed file get LLVM source file and create supplemental file for
wasmbase compilation, e.g.:

```
llvm-dis memory_0ca0789c.cpp.o -o - | node get-we.js > ../../lib/libexports/memory.ll
```

Create .bc files, e.g.:

```
llvm-as ../../lib/libexports/memory.ll
```

The .ll files contain the list of the exports to be pasted to the wasmbase.json.
