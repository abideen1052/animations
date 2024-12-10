import React from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
//import PanGesture from './src/animationItems/panGesture';
//import AnimatedScrollView from './src/animationItems/animatedScrollView';
//import DeletePage from './src/animationItems/deletePage';
//import SplashScreen from './src/animationItems/splashScreen';
import OnBoardingScreen from './src/animationItems/onBoardingScreen';

const App = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <OnBoardingScreen />
    </GestureHandlerRootView>
  );
};

export default App;
