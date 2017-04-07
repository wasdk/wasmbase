#ifndef __wasmbase_h
#define __wasmbase_h

#include <cstddef>
#include <memory>
#include <string>

namespace wasmbase {

class StringBox : public std::shared_ptr<const std::wstring>
{
  public:
    StringBox() : std::shared_ptr<const std::wstring>() {}
    StringBox(size_t size) : std::shared_ptr<const std::wstring>(new std::wstring(size, 0)) {}
    StringBox(const std::wstring* initializer) : std::shared_ptr<const std::wstring>(initializer) {}
  protected:
    static long get_size();
    static void reset(StringBox& box);
    static const wchar_t* reset(StringBox& box, long size);
    static bool get_content(const StringBox& box, long* use_count, const wchar_t** s, long* length);
    static void clear(StringBox& box);
};

}

#endif // __wasmbase_h