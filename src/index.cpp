#include <node.h>
#include <nan.h>
#include "./../tmp/headers/ChakraCore.h"
#include <string>
#include <iostream>

void run(const v8::FunctionCallbackInfo<v8::Value> &args) {
  JsRuntimeHandle runtime;
  JsContextRef context;
  JsValueRef result;
  unsigned currentSourceContext = 0;

  v8::Isolate* isolate2 = args.GetIsolate();
  v8::String::Utf8Value str(isolate2, args[0]);
  std::string cppStr(*str);

  std::wstring wsTmp(cppStr.begin(), cppStr.end());
  std::wstring script = wsTmp;

  JsCreateRuntime(JsRuntimeAttributeNone, nullptr, &runtime);
  JsCreateContext(runtime, &context);
  JsSetCurrentContext(context);
  JsRunScript(script.c_str(), currentSourceContext++, L"", &result);

  JsValueRef resultJSString;
  JsConvertValueToString(result, &resultJSString);

  const wchar_t *resultWC;
  size_t stringLength;
  JsStringToPointer(resultJSString, &resultWC, &stringLength);
  std::wstring resultW(resultWC);

  v8::Isolate *isolate = args.GetIsolate();
  auto message = Nan::New<v8::String>(std::string(resultW.begin(), resultW.end())).ToLocalChecked();
  args.GetReturnValue().Set(message);

  // Dispose runtime
  JsSetCurrentContext(JS_INVALID_REFERENCE);
  JsDisposeRuntime(runtime);
}

void Initialize(v8::Local<v8::Object> exports) {
  NODE_SET_METHOD(exports, "run", run);
}

NODE_MODULE(module_name, Initialize)