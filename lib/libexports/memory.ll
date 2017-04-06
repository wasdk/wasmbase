target datalayout = "e-p:32:32-i64:64-v128:32:128-n32-S128"
target triple = "asmjs-unknown-emscripten"

@_ZTVNSt3__214__shared_countE = external constant { [5 x i8*] }
define i8* @_WP_ZTVNSt3__214__shared_countE() unnamed_addr {
entry:
  %ptr = bitcast { [5 x i8*] }* @_ZTVNSt3__214__shared_countE to i8*
  ret i8* %ptr
}

@_ZTSNSt3__214__shared_countE = external constant [25 x i8]
define i8* @_WP_ZTSNSt3__214__shared_countE() unnamed_addr {
entry:
  %ptr = bitcast [25 x i8]* @_ZTSNSt3__214__shared_countE to i8*
  ret i8* %ptr
}

@_ZTINSt3__214__shared_countE = external constant { i8*, i8* }
define i8* @_WP_ZTINSt3__214__shared_countE() unnamed_addr {
entry:
  %ptr = bitcast { i8*, i8* }* @_ZTINSt3__214__shared_countE to i8*
  ret i8* %ptr
}

@_ZTVNSt3__219__shared_weak_countE = external constant { [7 x i8*] }
define i8* @_WP_ZTVNSt3__219__shared_weak_countE() unnamed_addr {
entry:
  %ptr = bitcast { [7 x i8*] }* @_ZTVNSt3__219__shared_weak_countE to i8*
  ret i8* %ptr
}

@_ZTSNSt3__219__shared_weak_countE = external constant [30 x i8]
define i8* @_WP_ZTSNSt3__219__shared_weak_countE() unnamed_addr {
entry:
  %ptr = bitcast [30 x i8]* @_ZTSNSt3__219__shared_weak_countE to i8*
  ret i8* %ptr
}

@_ZTINSt3__219__shared_weak_countE = external constant { i8*, i8*, i32, i32, i8*, i32 }
define i8* @_WP_ZTINSt3__219__shared_weak_countE() unnamed_addr {
entry:
  %ptr = bitcast { i8*, i8*, i32, i32, i8*, i32 }* @_ZTINSt3__219__shared_weak_countE to i8*
  ret i8* %ptr
}

@_ZTVNSt3__212bad_weak_ptrE = external constant { [5 x i8*] }
define i8* @_WP_ZTVNSt3__212bad_weak_ptrE() unnamed_addr {
entry:
  %ptr = bitcast { [5 x i8*] }* @_ZTVNSt3__212bad_weak_ptrE to i8*
  ret i8* %ptr
}

@_ZTSNSt3__212bad_weak_ptrE = external constant [23 x i8]
define i8* @_WP_ZTSNSt3__212bad_weak_ptrE() unnamed_addr {
entry:
  %ptr = bitcast [23 x i8]* @_ZTSNSt3__212bad_weak_ptrE to i8*
  ret i8* %ptr
}

@_ZTINSt3__212bad_weak_ptrE = external constant { i8*, i8*, i8* }
define i8* @_WP_ZTINSt3__212bad_weak_ptrE() unnamed_addr {
entry:
  %ptr = bitcast { i8*, i8*, i8* }* @_ZTINSt3__212bad_weak_ptrE to i8*
  ret i8* %ptr
}

@.str__ZNSt3__212bad_weak_ptrD1Ev = private unnamed_addr constant [29 x i8] c"__ZNSt3__212bad_weak_ptrD2Ev\00", align 1
define i8* @_WA_ZNSt3__212bad_weak_ptrD1Ev() unnamed_addr {
entry:
  %ptr = getelementptr inbounds [29 x i8], [29 x i8]* @.str__ZNSt3__212bad_weak_ptrD1Ev, i32 0, i32 0
  ret i8* %ptr
}

@.str__ZNSt3__214__shared_countD1Ev = private unnamed_addr constant [31 x i8] c"__ZNSt3__214__shared_countD2Ev\00", align 1
define i8* @_WA_ZNSt3__214__shared_countD1Ev() unnamed_addr {
entry:
  %ptr = getelementptr inbounds [31 x i8], [31 x i8]* @.str__ZNSt3__214__shared_countD1Ev, i32 0, i32 0
  ret i8* %ptr
}

@.str__ZNSt3__219__shared_weak_countD2Ev = private unnamed_addr constant [31 x i8] c"__ZNSt3__214__shared_countD2Ev\00", align 1
define i8* @_WA_ZNSt3__219__shared_weak_countD2Ev() unnamed_addr {
entry:
  %ptr = getelementptr inbounds [31 x i8], [31 x i8]* @.str__ZNSt3__219__shared_weak_countD2Ev, i32 0, i32 0
  ret i8* %ptr
}

@.str__ZNSt3__219__shared_weak_countD1Ev = private unnamed_addr constant [31 x i8] c"__ZNSt3__214__shared_countD2Ev\00", align 1
define i8* @_WA_ZNSt3__219__shared_weak_countD1Ev() unnamed_addr {
entry:
  %ptr = getelementptr inbounds [31 x i8], [31 x i8]* @.str__ZNSt3__219__shared_weak_countD1Ev, i32 0, i32 0
  ret i8* %ptr
}

; exports: "__ZNSt3__212bad_weak_ptrD2Ev", "__ZNSt3__212bad_weak_ptrD0Ev", "__ZNKSt3__212bad_weak_ptr4whatEv", "__ZNSt3__214__shared_countD2Ev", "__ZNSt3__214__shared_countD0Ev", "__ZNSt3__214__shared_count12__add_sharedEv", "__ZNSt3__212_GLOBAL__N_19incrementIlEET_RS2_", "__ZNSt3__214__shared_count16__release_sharedEv", "__ZNSt3__212_GLOBAL__N_19decrementIlEET_RS2_", "__ZNSt3__219__shared_weak_countD0Ev", "__ZNSt3__219__shared_weak_count12__add_sharedEv", "__ZNSt3__219__shared_weak_count10__add_weakEv", "__ZNSt3__219__shared_weak_count16__release_sharedEv", "__ZNSt3__219__shared_weak_count14__release_weakEv", "__ZNSt3__219__shared_weak_count4lockEv", "__ZNKSt3__219__shared_weak_count13__get_deleterERKSt9type_info", "__ZNSt3__28__sp_mut4lockEv", "__ZNSt3__28__sp_mut6unlockEv", "__ZNSt3__212__get_sp_mutEPKv", "__ZNSt3__28__sp_mutC2EPv", "__ZNSt3__217declare_reachableEPv", "__ZNSt3__219declare_no_pointersEPcj", "__ZNSt3__221undeclare_no_pointersEPcj", "__ZNSt3__218get_pointer_safetyEv", "__ZNSt3__221__undeclare_reachableEPv", "__ZNSt3__25alignEjjRPvRj", "__ZNSt3__221__murmur2_or_cityhashIjLj32EEclEPKvj", "__WP_ZTVNSt3__214__shared_countE", "__WP_ZTSNSt3__214__shared_countE", "__WP_ZTINSt3__214__shared_countE", "__WP_ZTVNSt3__219__shared_weak_countE", "__WP_ZTSNSt3__219__shared_weak_countE", "__WP_ZTINSt3__219__shared_weak_countE", "__WP_ZTVNSt3__212bad_weak_ptrE", "__WP_ZTSNSt3__212bad_weak_ptrE", "__WP_ZTINSt3__212bad_weak_ptrE", "__WA_ZNSt3__212bad_weak_ptrD1Ev", "__WA_ZNSt3__214__shared_countD1Ev", "__WA_ZNSt3__219__shared_weak_countD2Ev", "__WA_ZNSt3__219__shared_weak_countD1Ev",
