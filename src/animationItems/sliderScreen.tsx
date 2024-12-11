import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import CustomSlider from '../components/customSlider';

const SliderScreen = () => {
  const [sliderValue, setSliderValue] = React.useState(0);
  const showData = (value: number) => {
    setSliderValue(value);
  };
  return (
    <View style={styles.container}>
      <CustomSlider
        onValueChange={showData}
        cSliderColor="pink"
        cThumbColor="red"
        cHeight={20}
        cThumbSize={30}
        maxLimit={100}
        minLimit={10}
        initialValue={25}
        cTrackColor="blue"
      />
      <Text style={styles.valueText}>{sliderValue}</Text>
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
