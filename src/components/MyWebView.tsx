import React, { Ref, useImperativeHandle, useRef } from 'react';
import { WebView as RNWebView } from 'react-native-webview';

function MyWebView(
  props: {
    url: string;
    refresh?: boolean;
    onMessage?(data: string): void;
    ignore?: boolean;
    injectedJavaScript?: string;
  },
  ref: Ref<{ postMessage?(message: any): void }>,
) {
  const {url, refresh, onMessage, ignore = false, injectedJavaScript} = props;

  const webViewRefs = useRef<RNWebView | null>(null);

  useImperativeHandle(ref, () => {
    return {postMessage: webViewRefs.current?.postMessage};
  });

  const uri = url;

  console.log(uri);

  return (
    <RNWebView
      ref={webViewRefs}
      cacheEnabled={false}
      cacheMode="LOAD_NO_CACHE"
      contentMode="desktop"
      androidLayerType="hardware"
      javaScriptEnabled={true}
      domStorageEnabled={true}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      originWhitelist={['*']}
      textZoom={100}
      /*webview加载完成后执行的js代码*/
      injectedJavaScript={injectedJavaScript}
      /*onMessage必须添加，否则IOS无法触发 injectedJavaScript*/
      onMessage={(e: any) => {
        onMessage?.(e.nativeEvent.data);
      }}
      source={{
        uri: uri,
      }}
      mixedContentMode="compatibility"
    />
  );
}

export default React.forwardRef(MyWebView);
