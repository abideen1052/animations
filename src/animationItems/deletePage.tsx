import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
} from 'react-native';
import React from 'react';
import SlideToDelete from '../components/slideToDelete';

const DATA: string[] = [
  'Slide 1',
  'Slide 2',
  'Slide 3',
  'Slide 4',
  'Slide 5',
  'Slide 6',
  'Slide 7',
  'Slide 8',
  'Slide 9',
  'Slide 10',
];
const DeletePage = () => {
  const onDelete = (item: string) => {
    console.log(`${item} deleted`);
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <Text style={styles.title}>Slides</Text>
      <ScrollView style={{flex: 1}}>
        {DATA.map((tittle, index) => (
          <SlideToDelete key={index} item={tittle} onDelete={onDelete} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default DeletePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 40,
    marginVertical: 20,
    paddingLeft: '5%',
  },
});
