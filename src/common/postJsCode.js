/***
 * postJsCode.js
 * 预注入webview javascript code
 * H5web中使用以下方法以获取RN-APP返回值
 * window.APP.invokeClientMethod('getUser', { name: '王者荣耀', age: 29 }, callback);
 * * */
export default function clientMethod() {
  const APP = {
    __GLOBAL_FUNC_INDEX__: 0,
    invokeClientMethod: function (type, params, callback) {
      let callbackName;
      if (typeof callback === 'function') {
        callbackName = '__CALLBACK__' + (APP.__GLOBAL_FUNC_INDEX__++);
        APP[callbackName] = callback;
      }
      window.ReactNativeWebView.postMessage(JSON.stringify({type, params, callbackName: callbackName}));
    },
    // 接受app消息
    invokeWebMethod: function (callbackName, args) {
      if (typeof callbackName === 'string') {
        const func = APP[callbackName];
        if (typeof func === 'function') {
          setTimeout(function () {
            func.call(this, args);
          }, 0);
        }
      }
    },
  };
  window.APP = APP;
  window.webviewCallback = function(data) {
    window.APP['invokeWebMethod'](data.callback, data.args);
  };
}
