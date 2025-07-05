import { Ref, useImperativeHandle, useRef } from 'react';
import { WebView as RNWebView } from 'react-native-webview';
import { BackHandler, Platform, StyleSheet, ToastAndroid, View } from 'react-native'
import clientMethod from '../common/postJsCode.js';

const patchPostMessageJsCode = `(${String(clientMethod)})(); true;`;

export function StaticWebView(
  props: {
    url: string;
    refresh?: boolean;
    // onMessage?(data: string): void;
    ignore?: boolean;
    injectedJavaScriptCode?: string;
  },
  ref: Ref<{ postMessage?(message: any): void }>,
) {
  const {url, refresh, ignore = false, injectedJavaScriptCode} = props;

  const webViewRefs = useRef<RNWebView | null>(null);

  useImperativeHandle(ref, () => {
    return {postMessage: webViewRefs.current?.postMessage};
  });

  const sourceUrl = url;

  let hardwareBackPressCount = 0
  let lastBackPressed = 0;

  console.log(sourceUrl);
  // @ts-ignore
  BackHandler.addEventListener('hardwareBackPress', (e) => {
    hardwareBackPressCount++
    //连按两次退出应用
    if (lastBackPressed && lastBackPressed + 2000 >= Date.now()) {
      //最近2秒内按过back键，可以退出应用。
      return false;
    }
    lastBackPressed = Date.now();
    webViewRefs.current?.goBack()
    ToastAndroid.show('2s内再一次退出应用', ToastAndroid.SHORT);
    return true;
  })

  console.log(global)

  /***
   * 接收H5web发送过来的消息，调用rn中提供的方法
   */
  const onMessage = (event: { nativeEvent: { data: string; }; }) => {
    const data = JSON.parse(event.nativeEvent.data)
    if (!data) {
      return;
    }
    const {type, params, callbackName} = data;
    switch (type) {
      case 'getUser':
        const json = {
          callbackName,
          args: {
            name: '王者荣耀',
            age: params.age,
          }
        };
        webViewRefs.current?.injectJavaScript(`webviewCallback(${JSON.stringify(json)})`);
        break;
      default:
        break;
    }

  }


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
        // 向web注入js代码
        injectedJavaScript={patchPostMessageJsCode}
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
        // 监听 webview 外部发送过来的消息
        onMessage={onMessage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
})