import React, { Component } from 'react';
import { createStore, applyMiddleware } from 'redux';
import { ToastAndroid, View, Animated, Easing, AsyncStorage, NativeModules, YellowBox } from 'react-native';
import { Provider } from 'react-redux';
import { Root } from 'native-base';
import logger from 'redux-logger'
import { NavigationActions } from 'react-navigation'
import Nav, { Navigator, middleware } from './Navigator';
import reducers from './reducers';
const store = createStore(reducers, applyMiddleware(logger, middleware))


//import Router from './router'
//import configureStore from './store/configureStore';
import styles, { colors } from './styles';
import Footer from './components/common/Footer';
import Tutorial from './components/common/Tutorial';

import AppUpdate from 'react-native-appupdate';
import { consts } from './utility'

import DeviceInfo from 'react-native-device-info'
import { screenNames } from './utility/consts';
// var PushNotification = require('react-native-push-notification');


export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      animatedPaddingBottomForFooter: new Animated.Value(0),
      appUpdateProgress: 0
    };
  }
  navigate = (route, params) => {
    const { dispatch } = store;
    dispatch(
      NavigationActions.navigate({
        type: "Navigate",
        routeName: route,
        params: params
      })
    );
  }
  componentDidMount() {
    /*this.landingPages = {};
    if (__DEV__) {
      firebase.config().enableDeveloperMode();
    }
    firebase.config().setDefaults({
      landingPages: "",
    });
    firebase.config().fetch(0)
      .then(() => {
        return firebase.config().activateFetched();
      })
      .then((activated) => {
        return firebase.config().getValue('landingPages');
      })
      .then((snapshot) => {
        this.landingPages = snapshot.val();
      })
      .catch(console.error);*/

  }
  componentWillUnmount() {

    //BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid.bind(this));
  }

  // onBackAndroid(e) {
  //   alert('wrwerwer')
  // }
  animate() {
    this.state.animatedPaddingBottomForFooter.setValue(0);
    const createAnimation = function (value, duration, easing, delay = 0) {
      return Animated.timing(
        value,
        {
          toValue: 1,
          duration,
          easing,
          delay
        }
      )
    }
    Animated.parallel([
      createAnimation(this.state.animatedPaddingBottomForFooter, 100, Easing.ease, 4000)
    ]).start()
  }
  render() {
    const paddingAnimation = this.state.animatedPaddingBottomForFooter.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 60]
    })
    //const store = configureStore()
    //const store = createStore(reducers, {}, applyMiddleware(ReduxThunk))
    return (
      // <Provider store={store}>
      //   <Animated.View style={{ flex: 1, paddingBottom: paddingAnimation }}>
      //     <Router />
      //     <Footer />
      //     <Tutorial />
      //   </Animated.View>
      // </Provider>
      <Provider store={store}>
        <View style={{ flex: 1, position: 'relative' }}>
          <Root>
            <Nav />
          </Root>
        </View>
      </Provider>
    );
  }


}