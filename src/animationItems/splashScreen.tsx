import {Dimensions, Image, StyleSheet, View} from 'react-native';
import React, {useEffect} from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const {height, width} = Dimensions.get('window');
const SplashScreen = () => {
  const bottomHeight = useSharedValue(0);
  const cupPosition = useSharedValue(-height);
  const circlePosition = useSharedValue(20);
  const circleOpacity = useSharedValue(0);
  const circleSize = useSharedValue(20);
  const circleBottom = useSharedValue(height * 0.3);
  //const cupRotation = useSharedValue(0);

  useEffect(() => {
    bottomHeight.value = withSpring(height * 0.3);
    cupPosition.value = withSpring(
      30,
      {
        overshootClamping: true,
      },
      () => {
        cupPosition.value = withSpring(
          -100,
          {
            overshootClamping: true,
          },
          () => {
            circleOpacity.value = withSpring(1);
            circlePosition.value = withTiming(-150, {duration: 500});
            cupPosition.value = withTiming(30, {duration: 500}, () => {
              bottomHeight.value = withSpring(0);
              circleSize.value = withTiming(width * width, {duration: 2000});
              circleBottom.value = withTiming(height * 0.6, {
                duration: 500,
              });
            });
          },
        );
      },
    );
    //cupRotation.value = withTiming(360, {duration: 500});
  });

  const rBottomContainerStyle = useAnimatedStyle(() => {
    return {
      height: bottomHeight.value,
    };
  });
  const rCupContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {translateY: cupPosition.value},
        //{rotate: `${cupRotation.value}deg`},
      ],
    };
  });
  const rAnimatedContainerStyle = useAnimatedStyle(() => {
    return {
      bottom: circleBottom.value,
    };
  });
  const rCircleStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: circlePosition.value}],
      opacity: circleOpacity.value,
      height: circleSize.value,
      width: circleSize.value,
      borderRadius: circleSize.value / 2,
    };
  });
  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.animatedContainer, rAnimatedContainerStyle]}>
        <Animated.View style={[styles.cupContainer, rCupContainerStyle]}>
          <Animated.View style={[styles.circle, rCircleStyle]} />
          <Image
            source={require('../resources/gifs/cup.gif')}
            style={styles.gif}
          />
        </Animated.View>
      </Animated.View>
      <Animated.View style={[styles.bottomContainer, rBottomContainerStyle]} />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e3ca91',
    justifyContent: 'flex-end',
  },
  animatedContainer: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: height * 0.3,
  },
  circle: {
    backgroundColor: '#3E201E',
    borderRadius: 10,
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 2,
  },
  cupContainer: {
    height: 150,
    width: 150,
    alignSelf: 'center',
    padding: 20,
  },
  gif: {
    height: '100%',
    width: '100%',
  },
  bottomContainer: {
    backgroundColor: '#b38d55',
  },
});
