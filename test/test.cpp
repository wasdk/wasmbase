#include <cstddef>
#include "test.h"

extern "C" {
  bool invokeCallback(void*, void*);
  void registerObject(void*, int);
  void unregisterObject(void*, int);
}

using namespace Test;
// Test class members

int Test::_typeid = 0;

Test::Test()
{
  registerObject(this, _typeid);
}

Test::~Test()
{
  unregisterObject(this, _typeid);
}

void Test::Destroy()
{
  delete this;
}

/* static */ bool Test::createAndFill(unsigned int size, unsigned char fill, unsigned int* result)
{
  unsigned char* buffer = new unsigned char[size];
  for (int i = 0; i < size; i++)
    buffer[i] = fill;
  *result = (unsigned int)(void*)buffer;
  return true;
}

/* static */ bool Test::destroy(unsigned int ptr)
{
  unsigned char* buffer = (unsigned char*)(void*)ptr;
  delete[] buffer;
  return true;
}

extern "C" void printNum(long n);

/* static */ bool Test::flip(const wasmbase::StringBox& s, wasmbase::StringBox* result)
{
  size_t size = s->length();
  if (size < 2) {
    *result = s;
    return true;
  }
  std::unique_ptr<std::wstring> str =
    std::make_unique<std::wstring>(size, 0);
  for (int i = 0; i < size; i++)
    str->at(i) = s->at(size - 1 - i);
  *result = str.release();
  return true;
}
// end of Test class members
} // namespace Test