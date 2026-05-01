import React from 'react';
import {ImageBackground, StyleSheet, View} from 'react-native';
import {WebView} from 'react-native-webview';
import {images} from '../assets/images';

const html = `
<!doctype html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
html, body {
  margin: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: transparent;
}
body {
  display: grid;
  place-items: center;
}
.scene {
  width: 190px;
  height: 190px;
  position: relative;
  filter: drop-shadow(0 24px 45px rgba(92, 184, 31, 0.28));
}
.soil {
  position: absolute;
  left: 38px;
  right: 38px;
  bottom: 24px;
  height: 30px;
  border-radius: 50%;
  background: radial-gradient(circle at 50% 50%, #294216 0, #14250d 52%, rgba(20, 37, 13, 0) 72%);
}
.stem {
  position: absolute;
  left: 91px;
  bottom: 42px;
  width: 9px;
  height: 102px;
  border-radius: 99px;
  background: linear-gradient(#b8ed20, #58bd25 55%, #286f20);
  transform-origin: bottom center;
  animation: breathe 2.8s ease-in-out infinite;
}
.leaf {
  position: absolute;
  width: 82px;
  height: 48px;
  background: linear-gradient(135deg, #d3f10a, #66c923 70%, #245f1d);
  border-radius: 80% 0 80% 0;
  transform-origin: 8% 88%;
}
.leaf:after {
  content: "";
  position: absolute;
  left: 12px;
  top: 25px;
  width: 62px;
  height: 2px;
  background: rgba(3, 8, 7, 0.55);
  transform: rotate(-24deg);
}
.leaf.left {
  left: 24px;
  top: 76px;
  transform: rotate(-30deg) scale(0.96);
  animation: left 3s ease-in-out infinite;
}
.leaf.right {
  right: 19px;
  top: 82px;
  transform: rotate(66deg) scale(0.92);
  animation: right 3.2s ease-in-out infinite;
}
.leaf.top {
  left: 63px;
  top: 24px;
  width: 74px;
  height: 58px;
  transform: rotate(42deg);
  animation: top 3.4s ease-in-out infinite;
}
.drop {
  position: absolute;
  width: 8px;
  height: 13px;
  border-radius: 50% 50% 60% 60%;
  background: #78d6ff;
  left: 54px;
  top: 26px;
  opacity: 0;
  animation: drop 2.8s ease-in-out infinite;
}
.drop.two {
  left: 136px;
  top: 46px;
  animation-delay: .65s;
}
@keyframes breathe {
  0%, 100% { transform: rotate(-1deg) scaleY(.96); }
  50% { transform: rotate(1.5deg) scaleY(1.04); }
}
@keyframes left {
  0%, 100% { transform: rotate(-32deg) scale(.94); }
  50% { transform: rotate(-24deg) scale(1.02); }
}
@keyframes right {
  0%, 100% { transform: rotate(66deg) scale(.9); }
  50% { transform: rotate(58deg) scale(1); }
}
@keyframes top {
  0%, 100% { transform: rotate(42deg) translateY(2px); }
  50% { transform: rotate(38deg) translateY(-2px); }
}
@keyframes drop {
  0% { transform: translateY(-18px); opacity: 0; }
  18% { opacity: .9; }
  74% { transform: translateY(104px); opacity: .9; }
  100% { transform: translateY(122px); opacity: 0; }
}
</style>
</head>
<body>
<div class="scene">
  <div class="drop"></div>
  <div class="drop two"></div>
  <div class="stem"></div>
  <div class="leaf top"></div>
  <div class="leaf left"></div>
  <div class="leaf right"></div>
  <div class="soil"></div>
</div>
</body>
</html>
`;

export function LoaderScreen(): React.JSX.Element {
  return (
    <ImageBackground source={images.loader} style={styles.root}>
      <View style={styles.webWrap}>
        <WebView
          automaticallyAdjustContentInsets={false}
          bounces={false}
          originWhitelist={['*']}
          scrollEnabled={false}
          source={{html}}
          style={styles.webView}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#030807',
  },
  webWrap: {
    width: 230,
    height: 230,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  webView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
