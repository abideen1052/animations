import {Dimensions, StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

type SliderProps = {
  cHeight?: number;
  cWidth?: number;
  cThumbSize?: number;
  cSliderColor?: string;
  cThumbColor?: string;
  cTrackColor?: string;
  minLimit?: number;
  maxLimit?: number;
  initialValue?: number;
  steps?: number;
  onValueChange?: (value: number) => void;
};

const CustomSlider = ({
  cHeight,
  cWidth,
  cThumbSize,
  cSliderColor,
  cThumbColor,
  cTrackColor,
  minLimit,
  maxLimit,
  initialValue,
  steps = 1,
  onValueChange,
}: SliderProps) => {
  const SLIDER_HEIGHT = cHeight || 10;
  const SLIDER_WIDTH = cWidth || SCREEN_WIDTH * 0.85;
  const THUMB_SIZE = cThumbSize || 25;
  const MAX_TRANSLATE_X = SLIDER_WIDTH - THUMB_SIZE;
  const MIN_LIMIT = minLimit || 0;
  const MAX_LIMIT = maxLimit || 100;

  // can use the minTranslateX if the slider thumb should be from the min point.
  // const minTranslateX = (MIN_LIMIT / MAX_LIMIT) * MAX_TRANSLATE_X;

  const initialTranslationX = useSharedValue(0);
  const translateX = useSharedValue(initialValue || 0);

  useEffect(() => {
    if (onValueChange) {
      onValueChange(initialValue || MIN_LIMIT);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const thumbGesture = Gesture.Pan()
    .onStart(() => {
      initialTranslationX.value = translateX.value;
    })
    .onUpdate(event => {
      translateX.value = Math.max(
        0,
        Math.min(
          event.translationX + initialTranslationX.value,
          MAX_TRANSLATE_X,
        ),
      );
      let rawValue =
        MIN_LIMIT +
        (translateX.value / MAX_TRANSLATE_X) * (MAX_LIMIT - MIN_LIMIT);

      const value = Math.round(rawValue / steps) * steps;

      if (onValueChange) {
        runOnJS(onValueChange)(value);
      }
    });

  const animatedContainer = useAnimatedStyle(() => {
    return {
      width: SLIDER_WIDTH,
      height: SLIDER_HEIGHT,
      backgroundColor: cSliderColor || 'red',
      borderRadius: SLIDER_HEIGHT / 2,
    };
  });

  const animatedTrack = useAnimatedStyle(() => {
    return {
      width: translateX.value + THUMB_SIZE / 2,
      height: SLIDER_HEIGHT,
      backgroundColor: cTrackColor,
      borderRadius: SLIDER_HEIGHT / 2,
    };
  });

  const animatedThumb = useAnimatedStyle(() => {
    return {
      transform: [{translateX: translateX.value}],
      height: THUMB_SIZE,
      width: THUMB_SIZE,
      borderRadius: THUMB_SIZE / 2,
      backgroundColor: cThumbColor || 'green',
    };
  });

  return (
    <>
      <Animated.View style={[styles.container, animatedContainer]}>
        {cTrackColor && (
          <Animated.View style={[animatedTrack, styles.tracked]} />
        )}
        <GestureDetector gesture={thumbGesture}>
          <Animated.View style={[styles.thumb, animatedThumb]} />
        </GestureDetector>
      </Animated.View>
    </>
  );
};

export default CustomSlider;

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',

    justifyContent: 'center',
  },
  thumb: {},
  tracked: {position: 'absolute', borderRadius: 30},
});
