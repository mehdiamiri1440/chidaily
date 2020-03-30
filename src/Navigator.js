import 'react-native-gesture-handler'
import React, { Component } from 'react'
import { View, StatusBar, BackHandler, Image, Dimensions, Text, Animated, Easing } from "react-native";
import { connect } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { addNavigationHelpers, NavigationActions } from 'react-navigation'
import {
  createReduxContainer,
  createReactNavigationReduxMiddleware
} from "react-navigation-redux-helpers";

//import { colors } from "./utility/consts";
import { screenNames } from "./utility/consts";
import SplashScreen from "./components/pages/SplashScreen";
import Introduction from './components/pages/Introduction';
import CMS from './components/pages/CMS';
import AdvertimentCMS from './components/pages/AdvertimentCMS';
import ContactUs from './components/pages/ContactUs';
import Product from './components/pages/Product';
import Category from './components/pages/Category';
import ProductGallery from './components/pages/ProductGallery';
import BuyItNow from './components/pages/BuyItNow';
import ItemDetails from './components/pages/ItemDetails';
import Agents from './components/pages/Agents';
import Basket from './components/pages/Basket';
import Postman from './components/pages/Postman';
import Login from './components/pages/Login';
import SignUp from './components/pages/SignUp';
import ShowDetail from './components/pages/ShowDetail';
import BasketPurchaseResult from './components/pages/BasketPurchaseResult';
import Profile from './components/pages/Profile';
import Stores from './components/pages/Stores';
import UserBaskets from './components/pages/UserBaskets';
import IntroducerInfo from './components/pages/IntroducerInfo';
import RegisterUserAccountInfo from './components/pages/RegisterUserAccountInfo';
import RegisterMarketerQuota from './components/pages/RegisterMarketerQuota';
import ViewQoutaDetails from './components/pages/ViewQoutaDetails';
import RedirectionHandler from './components/pages/RedirectionHandler';
import styles, { colors, fonts } from './styles';
import Footer from './components/common/Footer';
import AboutUs from './components/pages/AboutUs';

export const middleware = createReactNavigationReduxMiddleware(
  "root",
  state => state.navigation
);
const addListener = createReduxContainer("root");
const transitionConfig = () => {
  return {
    transitionSpec: {
      duration: 750,
      easing: Easing.out(Easing.poly(4)),
      timing: Animated.timing,
      useNativeDriver: true,
    },
    screenInterpolator: sceneProps => {
      const { layout, position, scene } = sceneProps
      const thisSceneIndex = scene.index
      const width = layout.initWidth
      const translateX = position.interpolate({
        inputRange: [thisSceneIndex - 1, thisSceneIndex],
        outputRange: [width, 0],
      })

      return { transform: [{ translateX }] }
    },
  }
}
const Stack = createStackNavigator()
// {
//   [screenNames.SPLASH_SCREEN]: { screen: SplashScreen },
//   [screenNames.INTRODUCTION]: { screen: Introduction },
//   [screenNames.CMS]: { screen: CMS },
//   [screenNames.ADVERTIMENT_CMS]: { screen: AdvertimentCMS },
//   [screenNames.CONTACT_US]: { screen: ContactUs },
//   [screenNames.PRODUCT]: { screen: Product },
//   [screenNames.CATEGORY]: { screen: Category },
//   [screenNames.PRODUCT_GALLERY]: { screen: ProductGallery },
//   [screenNames.BUY_IT_NOW]: { screen: BuyItNow },
//   [screenNames.ITEM_DETAILS]: { screen: ItemDetails },
//   [screenNames.AGENTS]: { screen: Agents },
//   [screenNames.BASKET]: { screen: Basket },
//   [screenNames.POSTMAN]: { screen: Postman },
//   [screenNames.LOGIN]: { screen: Login },
//   [screenNames.SIGN_UP]: { screen: SignUp },
//   [screenNames.SHOW_DETAIL]: { screen: ShowDetail },
//   [screenNames.BASKET_PURCHASE_RESULT]: { screen: BasketPurchaseResult },
//   [screenNames.PROFILE]: { screen: Profile },
//   [screenNames.STORES]: { screen: Stores },
//   [screenNames.BASKETPAYMENT]: { screen: BasketPurchaseResult },
//   [screenNames.USERBASKET]: { screen: UserBaskets },
//   [screenNames.INTRODUCER_INFO]: { screen: IntroducerInfo },
//   [screenNames.REGISTER_USER_ACCOUNT_INFO]: { screen: RegisterUserAccountInfo },
//   [screenNames.REGISTER_MARKETER_QUOTA]: { screen: RegisterMarketerQuota },
//   [screenNames.VIEW_QOUTA_DETAILS]: { screen: ViewQoutaDetails },
//   [screenNames.ABOUT_US]: { screen: AboutUs },
//   [screenNames.REDIRECTION_HANDLER]: { screen: RedirectionHandler },
// },
// {
//   initialRouteName: screenNames.SPLASH_SCREEN,
//     transitionConfig
//   // navigationOptions: {
//   //   headerTitleStyle: {
//   //     fontWeight: 'normal',
//   //     fontFamily: fonts.BYekan,
//   //     color: colors.textPrimary,
//   //     alignSelf: 'center',
//   //     textAlign: 'center'
//   //   }
//   // },
// }

class Nav extends Component {
  constructor(props) {
    super(props);
  }

  navigator = React.createRef();
  navigate = (route, params) => {
    const { dispatch } = this.props;
    dispatch(
      NavigationActions.navigate({
        type: "Navigate",
        routeName: route,
        params: params
      })
    );
  }
  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
  }

  onBackPress = () => {
    const { dispatch, navigation } = this.props;
    if (navigation.index === 0) return false;
    dispatch(NavigationActions.back());
    return true;
  };
  renderStatusBar = () => {
    let activeRoute = this.props.navigation.routes.filter(
      x => x.params.active
    )[0].routeName;
    let hideStatusBarScreens = [
      screenNames.SPLASH_SCREEN,
      screenNames.INTRODUCTION
    ];
    let statusBarColor = {
      // [screenNames.VERIFICATION_GET_PHONE_NUMBER]: {
      //   color: colors.primary,
      //   content: "light-content"
      // },
      // [screenNames.VERIFICATION_GET_VERIFICATION_CODE]: {
      //   color: colors.primary,
      //   content: "light-content"
      // },
      // [screenNames.VERIFICATION_USER_INFO]: {
      //   color: colors.primary,
      //   content: "light-content"
      // },

    };
    let hideStatusBarCondition =
      hideStatusBarScreens.indexOf(activeRoute) != -1;
    return (
      <StatusBar
        hidden={hideStatusBarCondition}
        animated={true}
        backgroundColor={
          //statusBarColor[activeRoute]? 
          //statusBarColor[activeRoute].color: 
          colors.primary
        }
        showHideTransition="fade"
        //translucent={true}
        barStyle={
          //statusBarColor[activeRoute]? 
          //statusBarColor[activeRoute].content: 
          "light-content"
        }
      />
    );
  }
  renderFooter = () => {
    let activeRoute = this.props.navigation.routes.filter(
      x => x.params.active
    )[0].routeName;
    let hideFooterScreens = [
      screenNames.SPLASH_SCREEN,
      screenNames.INTRODUCTION,
      screenNames.BASKET_PURCHASE_RESULT,
      screenNames.LOGIN,
      screenNames.SIGN_UP,
      screenNames.BASKET,
      screenNames.ITEM_DETAILS
    ];
    let darkFooterScreens = [
      screenNames.CATEGORY,
      screenNames.PROFILE,
    ];
    let hideFooterCondition = hideFooterScreens.indexOf(activeRoute) == -1;
    let darkFooterCondition = darkFooterScreens.indexOf(activeRoute) != -1;
    if (hideFooterCondition)
      return <Footer navigate={this.navigate} darkFooter={darkFooterCondition} />;
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <NavigationContainer>

          <Stack.Navigator
            ref={this.navigator}
            navigation={addNavigationHelpers({
              dispatch: this.props.dispatch,
              state: this.props.navigation,
              addListener
            })}
          >
            <Stack.Screen
              name='SplashScreen'
              component={SplashScreen}
            />
          </Stack.Navigator>
          {this.renderFooter()}
          {this.renderStatusBar()}
        </NavigationContainer>
      </View >
    );
  }
}

const mapStateToProps = state => ({
  navigation: state.navigation,
  initial: state.initial,
  dispatch: state.dispatch
});
export default connect(mapStateToProps)(Nav);
