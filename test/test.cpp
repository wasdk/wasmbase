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
// end of Test class members
} // namespace Test