import React from 'react';
import {StyleSheet, View} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import {Gesture, GestureDetector} from 'react-native-gesture-handler';

const SIZE = 90;
const CIRCLE_RADIUS = SIZE * 2;

function PanGesture() {
  const initialTranslationX = useSharedValue(0);
  const initialTranslationY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const panGestureEvent = Gesture.Pan()
    .onStart(() => {
      initialTranslationX.value = translateX.value;
      initialTranslationY.value = translateY.value;
    })
    .onChange(event => {
      translateX.value = event.translationX + initialTranslationX.value;
      translateY.value = event.translationY + initialTranslationY.value;
    })
    .onEnd(() => {
      const distance = Math.sqrt(translateX.value ** 2 + translateY.value ** 2);

      if (distance < CIRCLE_RADIUS + SIZE / 2) {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translateX.value,
        },
        {
          translateY: translateY.value,
        },
      ],
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.circle}>
        <GestureDetector gesture={panGestureEvent}>
          <Animated.View style={[styles.square, rStyle]} />
        </GestureDetector>
      </View>
    </View>
  );
}

export default PanGesture;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  square: {
    width: SIZE,
    height: SIZE,
    backgroundColor: 'rgba(0, 0, 256, 0.5)',
    borderRadius: 20,
  },
  circle: {
    width: CIRCLE_RADIUS * 2,
    height: CIRCLE_RADIUS * 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: CIRCLE_RADIUS,
    borderWidth: 5,
    borderColor: 'rgba(0, 0, 256, 0.5)',
  },
});
