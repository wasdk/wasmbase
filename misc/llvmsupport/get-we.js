#!/usr/bin/env node

var stdin = process.stdin,
    stdout = process.stdout,
    inputChunks = [];

stdin.resume();
stdin.setEncoding('utf8');

stdin.on('data', function (chunk) {
    inputChunks.push(chunk);
});

stdin.on('end', function () {
    var input = inputChunks.join();

    var buffer = [];
    var exports = [];
    buffer.push('target datalayout = "e-p:32:32-i64:64-v128:32:128-n32-S128"');
    buffer.push('target triple = "asmjs-unknown-emscripten"');
    buffer.push('');
    var m, re;
    re = /^define [^@]*@(\w+)/gm;
    while((m = re.exec(input))) {
      exports.push('_' + m[1]);
    }
    re = /^@(\w+)\s=\s(?:unnamed_addr\s)?constant\s(.*)$/gm;
    while((m = re.exec(input))) {
      var name = m[1], c = m[2];
      var level = 0, i = 0;
      while (i < c.length && (level > 0 || c[i] != ' ')) {
        switch (c[i]) {
          case '{': case '[': level++; break;
          case '}': case ']': level--; break;
        }
        i++;
      }
      var type = c.substring(0, i);
      buffer.push('@' + name + ' = external constant ' + type);
      buffer.push('define i8* @_WP' + name + '() unnamed_addr {');
      buffer.push('entry:');
      buffer.push('  %ptr = bitcast ' + type + '* @' + name + ' to i8*');
      buffer.push('  ret i8* %ptr');
      buffer.push('}');
      buffer.push('');
      exports.push('__WP' + name);
    }
// @_ZNSt3__219__shared_weak_countD2Ev = alias void (%"class.std::__2::__shared_weak_count"*), bitcast (void (%"class.std::__2::__shared_count"*)* @_ZNSt3__214__shared_countD2Ev to void (%"class.std::__2::__shared_weak_count"*)*)
    re = /^@(\w+)\s=\s(?:weak_odr\s(?:hidden\s)?)?alias\s[^@]*@(\w+)/gm;
    while((m = re.exec(input))) {
      var name = m[1], target = m[2];
      var type = '[' + (target.length + 2) + ' x i8]';
      buffer.push('@.str_' + name + ' = private unnamed_addr constant ' + type + ' c"_' + target + '\\00", align 1');
      buffer.push('define i8* @_WA' + name + '() unnamed_addr {');
      buffer.push('entry:');
      buffer.push('  %ptr = getelementptr inbounds ' + type + ', ' + type + '* @.str_' + name + ', i32 0, i32 0');
      buffer.push('  ret i8* %ptr');
      buffer.push('}');
      buffer.push('');
      exports.push('__WA' + name);
    }
    buffer.push('; exports: "' + exports.join("\", \"") + '",');
    stdout.write(buffer.join('\n'));
    stdout.write('\n');
});

