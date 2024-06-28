import {Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');
const fonts = {
  bold: 'IBMPlexSans-Bold',
  regular: 'IBMPlexSans-Regular',
  medium: 'IBMPlexSans-Medium',
  semiBold: 'IBMPlexSans-SemiBold',
};

const matrix = {
  screenWidth: width < height ? width : height,
  screenHeigh: width < height ? height : width,
};
const BASE_WIDTH = 365;

const fontSize = {
  font12: matrix.screenWidth * (12 / BASE_WIDTH),
  font14: matrix.screenWidth * (14 / BASE_WIDTH),
  font16: matrix.screenWidth * (16 / BASE_WIDTH),
  font18: matrix.screenWidth * (18 / BASE_WIDTH),
  font20: matrix.screenWidth * (20 / BASE_WIDTH),
};

export {fonts, fontSize};
