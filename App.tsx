import React from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
//import PanGesture from './src/animationItems/panGesture';
//import AnimatedScrollView from './src/animationItems/animatedScrollView';
//import DeletePage from './src/animationItems/deletePage';
//import SplashScreen from './src/animationItems/splashScreen';
//import OnBoardingScreen from './src/animationItems/onBoardingScreen';
//import DeletePage from './src/animationItems/deletePage';
import SliderScreen from './src/animationItems/sliderScreen';

const App = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SliderScreen />
    </GestureHandlerRootView>
  );
};

export default App;
