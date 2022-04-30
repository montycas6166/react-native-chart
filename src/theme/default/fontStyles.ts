import {Platform} from 'react-native';
const isIOS = Platform.OS === 'ios';

export const fontStyles: {
  Inter_Bold: any;
  Inter_Medium: any;
  Inter_SemiBold: any;
} = {
  Inter_Bold: {
    fontFamily: isIOS ? 'Inter' : 'Inter-Bold',
    fontWeight: '700',
  },
  Inter_Medium: {
    fontFamily: isIOS ? 'Inter' : 'Inter-Medium',
    fontWeight: '500',
  },
  Inter_SemiBold: {
    fontFamily: isIOS ? 'Inter' : 'Inter-SemiBold',
    fontWeight: '600',
  },
};
