import { Ref, useImperativeHandle, useRef } from 'react';
import { WebView as RNWebView } from 'react-native-webview';
import { BackHandler, Platform, StyleSheet, ToastAndroid, View } from 'react-native'
import clientMethod from '../common/postJsCode.js';

const patchPostMessageJsCode = `(${String(clientMethod)})(); true;`;

export function StaticWebView(
  props: {
    url: string;
    refresh?: boolean;
    onMessage?(data: string): void;
    ignore?: boolean;
    injectedJavaScriptCode?: string;
  },
  ref: Ref<{ postMessage?(message: any): void }>,
) {
  const { url, refresh, ignore = false, injectedJavaScriptCode} = props;

  const webViewRefs = useRef<RNWebView | null>(null);


  const sourceUrl = url;

  let hardwareBackPressCount = 0
  let lastBackPressed = 0;

  console.log(sourceUrl);
  return (
    <View style={styles.container}>
      {hardwareBackPressCount}
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
        scalesPageToFit={false}
        source={{
          uri: `${Platform.OS === 'android' ? 'file:///android_asset/' : ''}webview/${url}`
        }}
        /** 这个属性让 webview 尽量与浏览器的标准相近 */
        mixedContentMode={'compatibility'}
        /** 引用本地的地址的webview 这个一定要加上 不然只能读到js 不能读到其他的资源 */
        allowUniversalAccessFromFileURLs={true}
        /** Ios 默认需要用户操作才可以播放音乐和视频 加上这个属性可以忽略掉这个 */
        mediaPlaybackRequiresUserAction={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
})