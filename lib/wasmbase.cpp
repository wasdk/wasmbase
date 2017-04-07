#include "wasmbase.h"

using namespace wasmbase;

// _ZN8wasmbase9StringBox8get_sizeEv
/* static */ long
StringBox::get_size()
{
    return sizeof(StringBox);
}

// _ZN8wasmbase9StringBox5resetERS0_
/* static */ void
StringBox::reset(StringBox& box)
{
    new (&box) StringBox();
}

// _ZN8wasmbase9StringBox5resetERS0_l
/* static */ const wchar_t*
StringBox::reset(StringBox& box, long size)
{
    new (&box) StringBox(new std::wstring(size, 0));
    return &box->front();
}

// _ZN8wasmbase9StringBox11get_contentERKS0_PlPPKwS3_
/* static */ bool
StringBox::get_content(const StringBox& box, long* use_count, const wchar_t** s, long* length)
{
    *use_count = box.use_count();
    if (*use_count == 0) {
        *s = nullptr;
        *length = 0;
        return false;
    }
    *s = &box->front();
    *length = box->length();
    return true;
}

// _ZN8wasmbase9StringBox5clearERS0_
/* static */ void
StringBox::clear(StringBox& box)
{
  box.~StringBox();
}
