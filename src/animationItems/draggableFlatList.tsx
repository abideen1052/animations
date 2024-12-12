import React, {useEffect, useRef, useState} from 'react';
import {findNodeHandle, FlatList, StyleSheet, Text, View} from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';

const ITEM_HEIGHT = 60;

const DraggableItem = ({item, reorderData}: any) => {
  const translateY = useSharedValue(0);
  const passingIndex = useSharedValue(0);
  const itemSize = useSharedValue(1);
  const viewRef = useRef<View>(null);
  const [itemViewPosition, setItemViewPosition] = useState<any>([]);

  console.log(itemViewPosition);
  useEffect(() => {
    if (viewRef.current) {
      const handle = findNodeHandle(viewRef.current);

      if (handle) {
        viewRef.current.measure((fx, fy, width, height, px, py) => {
          setItemViewPosition((prevState: any) => ({
            ...prevState,
            [item.id]: py + ITEM_HEIGHT,
          }));
        });
      } else {
        console.warn('Unable to find node handle for measurement');
      }
    } else {
      console.warn('viewRef is not set');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const itemGesture = Gesture.Pan()
    .onBegin(() => {
      itemSize.value = 1.05;
    })
    .onStart(() => {})
    .onUpdate(event => {
      translateY.value = event.translationY;
      console.log('position', itemViewPosition[item.id]);
      console.log('translateY.value ', translateY.value);
      const newIndex = Math.floor(translateY.value / ITEM_HEIGHT);
      if (newIndex < 0) {
        passingIndex.value = newIndex + 1;
      } else {
        passingIndex.value = newIndex;
      }
    })
    .onEnd(() => {
      translateY.value = 0;
      itemSize.value = 1;
      runOnJS(reorderData)(item.id, passingIndex.value);
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: translateY.value}, {scale: itemSize.value}],
    };
  });

  return (
    <GestureDetector gesture={itemGesture}>
      <Animated.View ref={viewRef} style={[styles.item, animatedStyle]}>
        <Text style={styles.title}>{item.title}</Text>
      </Animated.View>
    </GestureDetector>
  );
};

const DraggableFlatList = () => {
  const [data, setData] = useState([
    {id: '1', title: 'Item 1'},
    {id: '2', title: 'Item 2'},
    {id: '3', title: 'Item 3'},
    {id: '4', title: 'Item 4'},
    {id: '5', title: 'Item 5'},
  ]);

  const reorderData = (id: string, indexChange: number) => {
    const currentIndex = data.findIndex(item => item.id === id); // Find the current index of the item
    if (currentIndex === -1) {
      setData(data);
    } // If the item doesn't exist, return the current data

    let newIndex = currentIndex + indexChange;

    // Ensure the new index is within bounds
    if (newIndex < 0) {
      newIndex = 0;
    }
    if (newIndex >= data.length) {
      newIndex = data.length - 1;
    }

    // Remove the item from its current position
    const [movedItem] = data.splice(currentIndex, 1);

    // Insert the moved item at the new position
    data.splice(newIndex, 0, movedItem);
    setData([...data]); // Return the updated data
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={({item}: any) => (
          <DraggableItem item={item} reorderData={reorderData} />
        )}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

export default DraggableFlatList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    padding: 20,
    height: ITEM_HEIGHT,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: '#f9c2ff',
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
  },
});
