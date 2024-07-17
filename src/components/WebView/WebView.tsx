import React, {Ref, useImperativeHandle, useRef} from 'react';
import {WebView as SnowWebView} from 'react-native-webview';

function WebView(
  props: {
    url: string;
    refresh?: boolean;
    onMessage?(data: string): void;
    ignore?: boolean;
    injectedJavaScript?: string;
  },
  ref: Ref<{postMessage?(message: any): void}>,
) {
  const {url, refresh, onMessage, ignore = false, injectedJavaScript} = props;

  const webViewRefs = useRef<SnowWebView | null>(null);

  useImperativeHandle(ref, () => {
    return {postMessage: webViewRefs.current?.postMessage};
  });

  const uri = url;

  console.log(uri);

  return (
    <SnowWebView
      ref={webViewRefs}
      cacheEnabled={false}
      cacheMode="LOAD_NO_CACHE"
      contentMode="desktop"
      mixedContentMode="compatibility"
      androidLayerType="hardware"
      javaScriptEnabled={true}
      domStorageEnabled={true}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      injectedJavaScript={injectedJavaScript}
      originWhitelist={['*']}
      textZoom={100}
      onMessage={(e: any) => {
        onMessage?.(e.nativeEvent.data);
      }}
      source={{
        uri: uri,
      }}
    />
  );
}

export default React.forwardRef(WebView);
