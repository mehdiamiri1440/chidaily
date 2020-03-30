import React, { Component } from 'react';
import {
  Text,
  StyleSheet,
  Animated
} from 'react-native';
import { Router } from 'react-native-router-flux';
import { createStore, applyMiddleware } from 'redux';
import { connect, Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk'
import configureStore from './store/configureStore';
import Footer from './components/common/Footer';
import { Icon } from 'native-base';
import scenes from './scenes'
//import reducers from './reducers';
const store = configureStore()
//const store = createStore(reducers, {}, applyMiddleware(ReduxThunk))
//const store = createStore(reducers, {}, applyMiddleware(ReduxThunk))

const RouterWithRedux = connect()(Router);


let animatedPaddingBottomForFooter = new Animated.Value(0);
let appUpdateProgress = 0
//pages
import Agents from './components/pages/Agents'
import Postman from './components/pages/Postman'
import ItemDetails from './components/pages/ItemDetails';
import Basket from './components/pages/Basket'
import Profile from './components/pages/Profile'
import BasketPurchaseResult from './components/pages/BasketPurchaseResult';
import BuyItNow from './components/pages/BuyItNow';
import Product from './components/pages/Product';
import Category from './components/pages/Category';
import Login from './components/pages/Login';
import ProductGallery from './components/pages/ProductGallery';
import SignUp from './components/pages/SignUp';
import SplashScreen from './components/pages/SplashScreen'
import ContactUs from './components/pages/ContactUs'
import AboutUs from './components/pages/AboutUs'
import Introduction from './components/pages/Introduction'

//components
import Header from './components/common/Header';
import Menu from './components/common/Menu';
import ShowDetail from './components/pages/ShowDetail';
import styles, { colors, fonts } from './styles';
const headerMenuDarkMode = (<Icon name='menu' style={{ color: '#e5e3e9', fontSize: 32 }} />)
const headerMenu = (<Icon name='menu' style={{ color: colors.secondaryText, fontSize: 32 }} />)
const navigationBarStyle = { backgroundColor: '#4d3e67', borderBottomColor: '#4d3e67' }
const paddingAnimation = animatedPaddingBottomForFooter.interpolate({
  inputRange: [0, 1],
  outputRange: [0, 60]
})
export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      animatedPaddingBottomForFooter: new Animated.Value(0),
      appUpdateProgress: 0
    };
  }
  render() {
    const paddingAnimation = this.state.animatedPaddingBottomForFooter.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 60]
    })
    return (
      <Provider store={store}>
        <Animated.View style={{ flex: 1, paddingBottom: paddingAnimation }}>
          <RouterWithRedux>
            <Stack key="root">
              <Scene
                drawer
                key="menu"
                contentComponent={Menu}
                drawerWidth={300}
                drawerPosition="right"
                navTransparent={1}
                type={ActionConst.RESET}
              >
                <Scene key="splashScreen"
                  component={SplashScreen}
                  hideNavBar
                  type={ActionConst.RESET}
                />
                <Scene key="introduction"
                  component={Introduction}
                  hideNavBar
                  type={ActionConst.REPLACE}
                />
                <Scene key="aboutUs"
                  component={AboutUs}
                  drawerIcon={headerMenu}
                  renderTitle={<Header title='درباره ما' />}
                />
                <Scene key="ContactUs"
                  component={ContactUs}
                  drawerIcon={headerMenu}
                  renderTitle={<Header title='تماس با ما' />}
                  type={ActionConst.REPLACE}
                />
                <Scene key="product"
                  component={Product}
                  drawerIcon={headerMenu}
                  renderTitle={<Header title='پیشنهادهای چی دیلی' />}
                  type={ActionConst.REPLACE}
                />
                <Scene key="category"
                  component={Category}
                  navigationBarStyle={navigationBarStyle}
                  drawerIcon={headerMenuDarkMode}
                  renderTitle={<Header dark title='دسته بندی' />}
                  type={ActionConst.REPLACE}
                />
                <Scene key="productGallery"
                  component={ProductGallery}
                  drawerIcon={headerMenu}
                  renderTitle={<Header title='محصولات' />}
                  type={ActionConst.REPLACE}
                />
                <Scene key="buyItNow"
                  component={BuyItNow}
                  drawerIcon={headerMenu}
                  renderTitle={<Header title='ثبت سفارش' />}
                  type={ActionConst.REPLACE}
                />
                <Scene key="itemDetails"
                  component={ItemDetails}
                  renderTitle={<Header title='جزییات محصول' />}
                  drawerIcon={headerMenu}
                  type={ActionConst.REPLACE}
                />
                <Scene key="agents"
                  component={Agents}
                  renderTitle={<Header title='وظایف من' />}
                  drawerIcon={headerMenu}
                  type={ActionConst.REPLACE}

                />
                <Scene key="postman"
                  component={Postman}
                  renderTitle={<Header title='وظایف من' />}
                  drawerIcon={headerMenu}
                  type={ActionConst.REPLACE}
                />
                <Scene key="basket"
                  component={Basket}
                  renderTitle={<Header title='سبد من' />}
                  drawerIcon={headerMenu}
                  type={ActionConst.REPLACE}

                />
                <Scene key="login"
                  component={Login}
                  renderTitle={<Header dark title='ورود' />}
                  navigationBarStyle={navigationBarStyle}
                  drawerIcon={headerMenuDarkMode}
                  type={ActionConst.REPLACE}
                />

                <Scene key="signUp"
                  component={SignUp}
                  renderTitle={<Header dark title='ثبت نام' />}
                  navigationBarStyle={navigationBarStyle}
                  drawerIcon={headerMenuDarkMode}
                />
                <Scene key="showDetail"
                  component={ShowDetail}
                  renderTitle={<Header title='نمایش جزییات' />}
                  drawerIcon={headerMenu}
                />
                <Scene key="basketPurchaseResult"
                  component={BasketPurchaseResult}
                  direction="vertical"
                  hideNavBar
                />
                <Scene key="profile"
                  component={Profile}
                  renderTitle={<Header dark title='حساب کاربری' />}
                  navigationBarStyle={navigationBarStyle}
                  drawerIcon={headerMenuDarkMode}
                />
              </Scene>
            </Stack>
          </RouterWithRedux>
          <Footer />
        </Animated.View>
      </Provider>
    )
  }
}
