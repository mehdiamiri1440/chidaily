import { Dimensions } from 'react-native';

export const deviceWidth = Dimensions.get("window").width
export const deviceHeight = Dimensions.get("window").height

export const screenNames = {
  SPLASH_SCREEN: 'splashScreen',
  INTRODUCTION: 'introduction',
  CMS: 'cms',
  ADVERTIMENT_CMS: 'advertimentCMS',
  ABOUT_US: 'aboutUs',
  CONTACT_US: 'contactUs',
  PRODUCT: 'product',
  CATEGORY: 'category',
  PRODUCT_GALLERY: 'productGallery',
  BUY_IT_NOW: 'buyItNow',
  ITEM_DETAILS: 'itemDetails',
  AGENTS: 'agents',
  BASKET: 'basket',
  POSTMAN: 'postman',
  LOGIN: 'login',
  SIGN_UP: 'signUp',
  SHOW_DETAIL: 'showDetail',
  BASKET_PURCHASE_RESULT: 'basketPurchaseResult',
  PROFILE: 'profile',
  STORES: 'stores',
  BASKETPAYMENT: 'basketpayment',
  USERBASKET: 'userbasket',
  INTRODUCER_INFO: 'introducerInfo',
  REGISTER_USER_ACCOUNT_INFO: 'registerUserAccountInfo',
  REGISTER_MARKETER_QUOTA: 'registerMarketerQuota',
  VIEW_QOUTA_DETAILS: 'viewQoutaDetails',
  REDIRECTION_HANDLER: 'redirectionHandler',
}

//export const serverAddress = 'http://192.168.1.123:8889/api/';
export const serverAddress = "http://185.129.169.61:3005/api/";
export const siteServer = `http://www.cheegel.com/`;
export const apiServer = `http://www.cheegel.com/apis/`;
export const nodeApiServer = 'http://185.129.169.61:3004/api/';

export const imageServerSize1 = `http://www.cheegel.com/apis/UploadedFiles/CheegelCacheImages/SizeType1/`;
export const imageServerSize2 = `http://www.cheegel.com/apis/UploadedFiles/CheegelCacheImages/SizeType2/`;
export const imageServerSize3 = `http://www.cheegel.com/apis/UploadedFiles/CheegelCacheImages/SizeType3/`;
export const imageServerSize4 = `http://www.cheegel.com/apis/UploadedFiles/CheegelCacheImages/SizeType4/`;

export const storageNames = {
  USER: "user",
  SELECTED_CITY_CODE: "selectedCityCode",
  IS_TUTORIAL_VIEWED: "isTutorialViewed"
};

export const colors = {
  background: '#f5f5f5',
  background2: '#dcdcdc',
  //primary: '#ff3d00',
  primary: '#ff6411',
  primaryDark: '#e85b10',
  primaryLight: '#e87c10',
  secondary: '#3b277e',
  secondaryLight: '#6b51ae',
  secondaryDark: '#000051',
  white: 'white',
  // primary: '#e8401f',
  //primary: '#fe7013',
  // primary: 'rgb(155,39,234)',
  divider: '#d2d2d2',
  accept: '#009688',
  primaryText: '#646464',
  secondaryText: '#616161',
  purple: '#473B68',
  red: '#ED1C24',
  blue: '#024b8f',
}
