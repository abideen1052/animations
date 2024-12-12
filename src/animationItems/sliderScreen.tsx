import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
//import CustomSlider from '../components/customSlider';
import RangeSlider from '../components/rangeSlider';

const SliderScreen = () => {
  //const [sliderValue, setSliderValue] = React.useState(0);
  const [startRange, setStartRange] = React.useState(0);
  const [endRange, setEndRange] = React.useState(0);
  // const showData = (value: number) => {
  //   setSliderValue(value);
  // };
  const setRange = (start: number, end: number) => {
    setStartRange(start);
    setEndRange(end);
  };
  return (
    <View style={styles.container}>
      {/* <CustomSlider
        onValueChange={showData}
        cSliderColor="pink"
        cThumbColor="red"
        cHeight={20}
        cThumbSize={30}
        maxLimit={100}
        minLimit={10}
        initialValue={25}
        cTrackColor="blue"
      /> */}
      <RangeSlider
        initialValue={10}
        onValueChange={setRange}
        initialEndValue={30}
        cTrackColor="pink"
        //steps={5}
      />
      <Text style={styles.valueText}>
        Start {startRange} End {endRange}
      </Text>
    </View>
  );
};

export default SliderScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 300,
  },

  valueText: {
    alignSelf: 'center',
    marginTop: 50,
    fontSize: 20,
  },
});
