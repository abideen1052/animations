import {Dimensions, StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

type RangeSliderProps = {
  cHeight?: number;
  cWidth?: number;
  cThumbSize?: number;
  cSliderColor?: string;
  cThumbColor?: string;
  cTrackColor?: string;
  minLimit?: number;
  maxLimit?: number;
  initialValue?: number;
  initialEndValue?: number;
  steps?: number;
  onValueChange?: (start: number, end: number) => void;
};

const RangeSlider = ({
  cHeight,
  cWidth,
  cThumbSize,
  cSliderColor,
  cThumbColor,
  cTrackColor,
  minLimit,
  maxLimit,
  initialValue,
  initialEndValue,
  steps = 1,
  onValueChange,
}: RangeSliderProps) => {
  const SLIDER_HEIGHT = cHeight || 10;
  const SLIDER_WIDTH = cWidth || SCREEN_WIDTH * 0.85;
  const THUMB_SIZE = cThumbSize || 25;
  const MAX_TRANSLATE_FIRST_X = SLIDER_WIDTH - THUMB_SIZE;
  const MAX_TRANSLATE_SECOND_X = SLIDER_WIDTH - THUMB_SIZE * 2;
  const MIN_LIMIT = minLimit || 0;
  const MAX_LIMIT = maxLimit || 100;
  const INITIAL_VALUE = initialValue || 0;
  const INITIAL_END_VALUE = initialEndValue || 50;

  const initialStartTranslationX = useSharedValue(INITIAL_VALUE);
  const initialEndTranslationX = useSharedValue(INITIAL_END_VALUE);
  const translateFirstX = useSharedValue(INITIAL_VALUE);
  const translateSecondX = useSharedValue(INITIAL_END_VALUE);
  const start = useSharedValue(INITIAL_VALUE);
  const end = useSharedValue(INITIAL_END_VALUE);

  useEffect(() => {
    translateFirstX.value =
      (((initialValue || MIN_LIMIT) - MIN_LIMIT) / (MAX_LIMIT - MIN_LIMIT)) *
      MAX_TRANSLATE_FIRST_X;

    translateSecondX.value =
      (((initialEndValue || MAX_LIMIT) - MIN_LIMIT) / (MAX_LIMIT - MIN_LIMIT)) *
      MAX_TRANSLATE_SECOND_X;

    if (onValueChange) {
      onValueChange(initialValue || MIN_LIMIT, initialEndValue || MAX_LIMIT);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const firstThumbGesture = Gesture.Pan()
    .onStart(() => {
      initialStartTranslationX.value =
        ((start.value - MIN_LIMIT) / (MAX_LIMIT - MIN_LIMIT)) *
        MAX_TRANSLATE_FIRST_X;
    })
    .onUpdate(event => {
      translateFirstX.value = Math.max(
        0,
        Math.min(
          event.translationX + initialStartTranslationX.value,
          translateSecondX.value,
        ),
      );
      let rawValue =
        MIN_LIMIT +
        (translateFirstX.value / MAX_TRANSLATE_FIRST_X) *
          (MAX_LIMIT - MIN_LIMIT);

      start.value = Math.round(rawValue / steps) * steps;

      if (onValueChange) {
        runOnJS(onValueChange)(start.value, end.value);
      }
    });

  const secondThumbGesture = Gesture.Pan()
    .onStart(() => {
      initialEndTranslationX.value =
        ((end.value - MIN_LIMIT) / (MAX_LIMIT - MIN_LIMIT)) *
        MAX_TRANSLATE_SECOND_X;
    })
    .onUpdate(event => {
      translateSecondX.value = Math.max(
        translateFirstX.value,
        Math.min(
          event.translationX + initialEndTranslationX.value,
          MAX_TRANSLATE_SECOND_X,
        ),
      );
      let rawValue =
        MIN_LIMIT +
        (translateSecondX.value / MAX_TRANSLATE_SECOND_X) *
          (MAX_LIMIT - MIN_LIMIT);

      end.value = Math.round(rawValue / steps) * steps;

      if (onValueChange) {
        runOnJS(onValueChange)(start.value, end.value);
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
      transform: [{translateX: translateFirstX.value + THUMB_SIZE - 3}],
      width: translateSecondX.value - translateFirstX.value + 5,
      height: SLIDER_HEIGHT,
      backgroundColor: cTrackColor,
      borderRadius: SLIDER_HEIGHT / 2,
    };
  });

  const animatedFirstThumb = useAnimatedStyle(() => {
    return {
      transform: [{translateX: translateFirstX.value}],
      height: THUMB_SIZE,
      width: THUMB_SIZE,
      borderRadius: THUMB_SIZE / 2,
      backgroundColor: cThumbColor || 'green',
    };
  });
  const animatedSecondThumb = useAnimatedStyle(() => {
    return {
      transform: [{translateX: translateSecondX.value}],
      height: THUMB_SIZE,
      width: THUMB_SIZE,
      borderRadius: THUMB_SIZE / 2,
      backgroundColor: cThumbColor || 'blue',
    };
  });

  return (
    <>
      <Animated.View style={[styles.container, animatedContainer]}>
        <GestureDetector gesture={firstThumbGesture}>
          <Animated.View style={[styles.thumb, animatedFirstThumb]} />
        </GestureDetector>
        {cTrackColor && (
          <Animated.View style={[animatedTrack, styles.tracked]} />
        )}
        <GestureDetector gesture={secondThumbGesture}>
          <Animated.View style={[styles.thumb, animatedSecondThumb]} />
        </GestureDetector>
      </Animated.View>
    </>
  );
};

export default RangeSlider;

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  thumb: {},
  tracked: {position: 'absolute', borderRadius: 30, zIndex: -1},
});
