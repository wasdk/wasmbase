#ifndef __TEST_H
#define __TEST_H

#include "../lib/wasmbase.h"

namespace Test {
class Test;
// Test class definition
class Test
{
    static int _typeid;
  public:
    Test();
    ~Test();
    void Destroy();
    static bool createAndFill(unsigned int size, unsigned char fill, unsigned int* result);
    static bool destroy(unsigned int ptr);
    static bool flip(const wasmbase::StringBox& s, wasmbase::StringBox* result);
// additional Test members
  private:
};
// end of Test class definition
#endif // __TEST_H