import Snackbar from 'react-native-snackbar';

export const PALETTE = {
  white: '#FBFCFC',
  white1: '#FBFAFA',
  cultured: '#EFF4F6',
  snow: '#F6F0F0',
  gainsboro: '#E0D8D9',
  blackShadows: '#C8BABC',
  blackShadowsDark: '#B7AFB9',
  lightSkyBlue: '#8EC7EC',
  silverMetallic: '#B6B0B9',
  oldLavender: '#786972',
  darkPurple: '#331B2D',
  nickle: '#687777',
  roseRed: '#C03762',
  greenPantone: '#4AB755',
  vividSkyBlue: '#48c7ef',
  outerSpaceCrayola: '#1B3133',
  ashGray: '#AFB8B6',
  indianRed: '#E15155',
  middlePurple: '#E37FB4',
};

const COLORS = {
  mainBg: PALETTE.white,
  primary: PALETTE.lightSkyBlue,
  inputTabBarBg: PALETTE.cultured,
  textCommentCal: PALETTE.oldLavender,
  textLight: PALETTE.ashGray,
  textDark: PALETTE.outerSpaceCrayola,
  error: PALETTE.roseRed,
  success: PALETTE.greenPantone,
  borderLinkBtn: PALETTE.vividSkyBlue,
  icon: PALETTE.blackShadowsDark,
  white: PALETTE.white,
  cardBg: PALETTE.white1,
  periodDay: PALETTE.indianRed,
  calPink: PALETTE.middlePurple,
  lightPink: '#FAEDF4',
  darkYellow: '#FFCC00',
  red: '#FE024E',
  red1: '#FFC2D4',
  rossoCorsa: '#D30706',
  lightRed: '#fca09f',
  darkRed: '#D40707',
  orange: '#F9741B',
  lightBlue: '#d7ebf7',
  lightWhite: 'rgba(220,220,220, 0.9)',
  grey: '#ACAFBC',
  lightGrey: 'rgba(240, 240, 240, 1)',
  dark: '#707070',
  yellow: '#ebda21',
  green: '#00c951',
  welcomeBg: '#12263A',
  expSympTitle: '#8F7879',
  expSympReadMore: '#B7AFB9',
  tabBarBg: '#F4EDED',
  plusIconBg: '#E27FB4',
  pmsCircle: '#9A8AC2',
};

const SCROLL_VIEW_CONTAINER = {
  justifyContent: 'center',
  alignItems: 'center',
};

const SNACKBAR_OPTIONS = {
  duration: Snackbar.LENGTH_LONG,
  rtl: true,
  fontFamily: 'Qs_Iranyekan_bold',
  backgroundColor: COLORS.red,
};

const ICON_SIZE = { width: 25, height: 25 };

const TAB_BIG_ICON_SIZE = { width: 25, height: 25 };
const TAB_SMALL_ICON_SIZE = { width: 25, height: 25 };

export {
  SCROLL_VIEW_CONTAINER,
  COLORS,
  SNACKBAR_OPTIONS,
  ICON_SIZE,
  TAB_BIG_ICON_SIZE,
  TAB_SMALL_ICON_SIZE,
};
