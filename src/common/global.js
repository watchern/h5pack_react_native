import { Dimensions, Platform , PixelRatio } from "react-native";

const OS = Platform.OS
const { width, height } = Dimensions.get('window');

const setGlobal = () => {

  global.gMainColor = '#353F5B'
  global.gDevice = OS
  global.gScreen = {
    screen_width: width,
    screen_height: height,
    onePixelRatio: 1 / PixelRatio.get(),
  }

  //全局域名
  global.gBaseUrl = ''
}

export default setGlobal