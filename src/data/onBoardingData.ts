import {AnimationObject} from 'lottie-react-native';

export interface OnboardingData {
  id: number;
  animation: AnimationObject;
  text: string;
  textColor: string;
  backgroundColor: string;
}

const data: OnboardingData[] = [
  {
    id: 1,
    animation: require('../assets/animations/Lottie1.json'),
    text: 'We will take care',
    textColor: 'black',
    backgroundColor: '#F2C13E',
  },
  {
    id: 2,
    animation: require('../assets//animations/Lottie2.json'),
    text: 'Relax & Enjoy',
    textColor: 'black',
    backgroundColor: '#7FD1D9',
  },
  {
    id: 3,
    animation: require('../assets//animations/Lottie3.json'),
    text: 'Flexible Payment',
    textColor: 'black',
    backgroundColor: '#F0CBD7',
  },
];

export default data;
