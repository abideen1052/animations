import {Dimensions, StyleSheet, Text} from 'react-native';
import React from 'react';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import LottieView from 'lottie-react-native';

interface SlideItemProps {
  item: string;
  onDelete?: (item: string) => void;
}
const {width: SCREEN_WIDTH} = Dimensions.get('window');
const TRANSLATE_X_THRESHOLD = -SCREEN_WIDTH * 0.2;
const LIST_ITEM_HEIGHT = 70;
const SlideToDelete = ({item, onDelete}: SlideItemProps) => {
  const translateX = useSharedValue(0);
  const itemHeight = useSharedValue(LIST_ITEM_HEIGHT);
  const marginVertical = useSharedValue(5);
  const opacity = useSharedValue(1);

  const slideGestureEvent = Gesture.Pan()
    .onUpdate(event => {
      translateX.value = event.translationX;
    })
    .onEnd(() => {
      const shouldBeDismissed = translateX.value < TRANSLATE_X_THRESHOLD;
      if (shouldBeDismissed) {
        translateX.value = withTiming(-SCREEN_WIDTH);
        itemHeight.value = withTiming(0);
        marginVertical.value = withTiming(0);
        opacity.value = withTiming(0, undefined, () => {
          if (onDelete) {
            runOnJS(onDelete)(item);
          }
        });
      } else {
        translateX.value = withTiming(0);
      }
    });

  const animatedSliderContainer = useAnimatedStyle(() => {
    return {
      height: itemHeight.value,
      marginVertical: marginVertical.value,
      opacity: opacity.value,
    };
  });

  const animatedItem = useAnimatedStyle(() => {
    return {
      transform: [{translateX: translateX.value}],
    };
  });
  return (
    <Animated.View style={[styles.slideContainer, animatedSliderContainer]}>
      <Animated.View style={[styles.iconContainer]}>
        {/* Replace with Svg or png if needed */}
        <LottieView
          source={require('../assets/animations/deleteIcon.json')}
          style={{
            width: LIST_ITEM_HEIGHT * 0.6,
            height: LIST_ITEM_HEIGHT * 0.6,
          }}
          //autoPlay
          //loop
        />
      </Animated.View>
      <GestureDetector gesture={slideGestureEvent}>
        <Animated.View style={[styles.item, animatedItem]}>
          <Text style={styles.itemText}>{item}</Text>
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
};

export default SlideToDelete;

const styles = StyleSheet.create({
  slideContainer: {
    width: '100%',
    alignItems: 'center',
  },
  item: {
    width: '90%',
    justifyContent: 'center',
    paddingLeft: 20,
    height: LIST_ITEM_HEIGHT,
    backgroundColor: 'white',
    borderRadius: 10,
    // Shadow for iOS
    shadowOpacity: 0.08,
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowRadius: 10,
    // Shadow for Android
    elevation: 5,
  },
  itemText: {
    fontSize: 16,
    color: 'black',
  },
  iconContainer: {
    height: LIST_ITEM_HEIGHT,
    width: LIST_ITEM_HEIGHT,
    position: 'absolute',
    right: '5%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
