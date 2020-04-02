import React, { Component } from 'react';
import {
    Modal, NetInfo, StyleSheet, Text, View, Animated, Image, TouchableHighlight,
    Easing, NativeModules, AsyncStorage, BackHandler, Alert, ToastAndroid, ActivityIndicator, Dimensions
} from "react-native";
import { connect } from 'react-redux';
import {
    setFooterVisibility, updateBasketCount, updateBasketCatalogList,
    updateRouteList, updateStoresList, updateCategoriesList, updateSupplierId, updateCityId, updateUserLogin, updateUser
} from '../../actions';

import styles, { colors, fontSize } from '../../styles';
import {
    getBasketCount, consts, backAndroid, getStoresList, getMobileAppCategories,
    isUserLogin
} from '../../utility';
import AppUpdate from 'react-native-appupdate';
import DeviceInfo from 'react-native-device-info';
import { screenNames, deviceWidth, deviceHeight } from '../../utility/consts';
// var PushNotification = require('react-native-push-notification');
class SplashScreen extends Component {
    static navigationOptions = () => ({
        header: null
    })

    constructor(props) {
        super(props)
        this.state = {
            opacity: new Animated.Value(0),
            animatedValue3: new Animated.Value(0),
            springVal: new Animated.Value(0.8),
            fadeVal: new Animated.Value(1),
            flag: false,
            isUserOnilne: false,
            modalVisible: false,
            downloadingUpdate: false,
            appUpdateProgress: 0

        };
        getBasketCount().then(count => {
            this.props.updateBasketCount(count)
        })
        const appUpdate = new AppUpdate({
            //iosAppId: '123456',
            apkVersionUrl: 'http://www.cheegel.com/content/mobilesoftware/mobileversion.json',
            needUpdateApp: (needUpdate) => {
                Alert.alert(
                    'بروز رسانی',
                    'نسخه جدید موجود می باشد. آیا مایل به بروز رسانی برنامه می باشید؟',
                    [
                        { text: 'انصراف', onPress: () => { this.gotoNextPage() } },
                        { text: 'به روز رسانی', onPress: () => needUpdate(true) }
                    ]
                );
            },
            // forceUpdateApp: () => {
            //   console.warn("Force update will start")
            // },
            notNeedUpdateApp: () => {
                this.animate();
                setTimeout(() => {
                    this.gotoNextPage()
                }, 2500);
            },
            downloadApkStart: () => { this.setState({ downloadingUpdate: true }) },
            downloadApkProgress: (progress) => {
                this.setState({ appUpdateProgress: progress })
            },
            downloadApkEnd: () => {
                this.setState({ downloadingUpdate: false })
                this.gotoNextPage()
            },
            onError: () => {
                ToastAndroid.show('خطا در دانلود...', ToastAndroid.LONG)
                this.gotoNextPage()
            }
        });
        // {
        //   "versionName":"1.0.0",
        //   "apkUrl":"http://www.cheegel.com/content/mobilesoftware/chidaily.apk",
        //   "forceUpdate": false
        // }
        if (!__DEV__) {
            appUpdate.checkUpdate();
        }
        else {
            this.gotoNextPage()
        }

    }
    setDefaultCityIdAndSupplierId() {
        let _that = this;
        return new Promise((fullFill, eject) => {
            AsyncStorage.getItem(consts.userInitial).then(userInitialString => {
                let userInitial = {}
                if (userInitialString)
                    userInitial = JSON.parse(userInitialString)
                userInitial.SupplierID = 15682;
                userInitial.CityID = 1173;
                getMobileAppCategories(_that)
                AsyncStorage.setItem(consts.userInitial, JSON.stringify(userInitial)).then(() => {
                    fullFill(true)
                })
            })
        })
    }
    getUserInfo() {
        AsyncStorage.getItem(consts.userStorage).then(user => {
            if (user) {
                this.props.updateUser(JSON.parse(user))
            }
        })

    }
    gotoNextPage() {

        AsyncStorage.getItem("BasketActiveDuration").then(duration => {
            if (duration) {
                if (new Date().getDay() > new Date(duration).getDay())
                    AsyncStorage.setItem(consts.basketItemsStorage, JSON.stringify([]));
                AsyncStorage.removeItem("BasketActiveDuration");
            }
            this.setDefaultCityIdAndSupplierId().then(() => {
                AsyncStorage.getItem(consts.userInitial).then(userInfo => {
                    let getUserInfo = JSON.parse(userInfo);
                    if (getUserInfo) {
                        this.props.updateSupplierId(parseInt(getUserInfo.SupplierID));
                        this.props.updateCityId(parseInt(getUserInfo.CityID));
                        getStoresList(this, parseInt(getUserInfo.CityID)).then(stores => {
                            console.warn('before call user login')
                            isUserLogin().then(result => {
                                console.warn('user login true')
                                this.props.updateUserLogin(result)
                                if (result)
                                    this.getUserInfo()
                                if (getUserInfo.isIntroductionViewed) {
                                    this.props.navigation.replace(screenNames.CMS)

                                }
                                else {
                                    this.props.navigation.replace(screenNames.INTRODUCTION)
                                }
                            }).catch(() => {
                                console.warn('user login false')
                                return this.navigate(screenNames.LOGIN);
                            })
                        });
                    }
                    else {
                        this.animate();
                        this.props.navigation.replace(screenNames.INTRODUCTION)
                    }
                });
            })
        });
    }
    componentDidMount() {
        // NetInfo.isConnected.addEventListener('connectionChange', (isOnline) => {
        //     this.setState({ isUserOnilne: isOnline, modalVisible: !isOnline });
        //     if (isOnline) {
        //     } else {
        //         this.setState({ modalVisible: true });
        //     }
        // })
    }
    renderAppUpdateProgress() {
        if (this.state.downloadingUpdate)
            return (
                <View style={{
                    position: 'absolute',
                    bottom: deviceHeight * 0.5,
                    paddingHorizontal: 2,
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%'
                }}>
                    <View style={{
                        width: '80%',
                        padding: 2,
                        backgroundColor: 'white',
                        borderRadius: 8
                    }}>
                        <View style={{
                            elevation: 4,
                            height: 8,
                            borderRadius: 4,
                            //borderTopRightRadius: 4,
                            //borderBottomRightRadius: 4,
                            backgroundColor: colors.primary,
                            width: `${this.state.appUpdateProgress}%`,
                            alignItems: 'flex-end'
                        }} />
                    </View>
                    <View style={{ flexDirection: 'row-reverse', justifyContent: 'center', paddingVertical: 4 }}>
                        <ActivityIndicator size={12} color={'white'} />
                        <Text style={{ color: 'white', paddingHorizontal: 8 }}>در حال بروز رسانی...</Text>
                    </View>
                </View>
            )
        else
            return (
                <View style={{
                    position: 'absolute',
                    bottom: deviceHeight * 0.5,
                    paddingHorizontal: 2,
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%'
                }}>
                    <ActivityIndicator size={32} color={'white'} />
                </View>
            )
    }
    renderDiscountCodeChecking = () => {
        return (
            <View style={{ flexDirection: 'row' }}>
                <TouchableHighlight
                    onPress={() => {
                        this.setState({ modalVisible: false });
                    }}
                    style={{ paddingRight: 10 }}>
                    <View style={{
                        backgroundColor: '#f44242',
                        width: deviceWidth * 0.2,
                        borderRadius: 3, height: 40
                    }}>
                        <Text style={[styles.fontFamily,
                        {
                            fontSize: 16, color: '#fff',
                            paddingVertical: 5,
                            textAlign: 'center'
                        }]}>انصراف</Text>
                    </View>
                </TouchableHighlight>
            </View>
        )
    }
    showModal() {
        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => { }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={styles.modalContent}>
                        <Text style={{ textAlign: 'center' }}>
                            اتصال به اینترنت قطع میباشد
                        </Text>
                        <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 20 }}>
                            {this.renderDiscountCodeChecking()}
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }
    onLoad = () => {
        Animated.timing(this.state.opacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true
        }).start();
    }
    animate() {
        this.state.animatedValue3.setValue(0);
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
            createAnimation(this.state.animatedValue3, 250, Easing.ease, 500)
        ]).start()
    }
    render() {
        const introButton = this.state.animatedValue3.interpolate({
            inputRange: [0, 1],
            outputRange: [-140, deviceHeight * 0.02]
        })
        const introText = this.state.animatedValue3.interpolate({
            inputRange: [0, 1],
            outputRange: [-140, deviceHeight * 0.06]
        })
        const introImage = this.state.animatedValue3.interpolate({
            inputRange: [0, 1],
            outputRange: [-140, deviceHeight * 0.01]
        })
        const styleImageFalse = {
            opacity: this.state.opacity,
            transform: [{
                scale: this.state.opacity.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1.20]
                }),
            }]
        }
        const styleImageTrue = {
            opacity: this.state.fadeVal,
            transform: [{ scale: this.state.springVal }]
        }
        return (
            <View style={{ flex: 1, backgroundColor: colors.secondary }}>
                <View>
                    {this.showModal()}
                </View>
                <Animated.Text
                    style={{
                        width: deviceWidth, textAlign: 'center',
                        bottom: introText, position: 'absolute',
                        right: 16
                    }}>
                    <Text
                        style={[styles.fontFamily, { color: 'white', fontSize: fontSize.normal }]}>
                        با همکاری اداره کل پست استان فارس
                    </Text>
                </Animated.Text>
                <Animated.Image source={require('../../../assets/Image/SplashScreen/postLogo.png')} style={{
                    width: deviceWidth * 0.17,
                    height: deviceHeight * 0.12,
                    bottom: introImage, position: 'absolute', right: 4,
                }} />
                <Animated.Text
                    style={{ width: deviceWidth, textAlign: 'center', bottom: introButton, position: 'absolute' }}>
                    <Text
                        style={[styles.fontFamily, { color: 'white', fontSize: fontSize.normal }]}>
                        با خدمات ویژه پست پیک
                    </Text>
                </Animated.Text>
                {this.renderAppUpdateProgress()}
                <Text style={[styles.fontFamily, { paddingVertical: 8, color: 'white', width: deviceWidth, textAlign: 'center', bottom: deviceHeight * 0.38, position: 'absolute' }]}>
                    <Text style={{ fontSize: fontSize.large, fontWeight: "600" }}>چی دیلی دوست خانواده ها</Text>
                </Text>
                {/* <Text style={[styles.fontFamily, { paddingVertical: 8, paddingRight: 16, color: 'white', width: deviceWidth, textAlign: 'center', bottom: deviceHeight * 0.33, position: 'absolute' }]}>
                    <Text style={{ fontSize: fontSize.large }}>تحویل 2 ساعته در تمامی نقاط شیراز</Text>
                </Text>
                <Text style={[styles.fontFamily, { paddingVertical: 8, color: 'white', width: deviceWidth, textAlign: 'center', bottom: deviceHeight * 0.28, position: 'absolute' }]}>
                    <Text style={{ fontSize: fontSize.normal }}>کمتر از 3 ساعت</Text>
                </Text> */}
                <Animated.Image
                    source={require('../../../assets/Icon/SplashScreen/icon.png')}
                    onLoad={this.onLoad()}
                    {...this.props}
                    style={[
                        this.state.flag ? styleImageTrue : styleImageFalse
                        , {

                            position: 'absolute',
                            left: this.props.deviceDimensions.oriention ? (deviceWidth * 0.5 - deviceWidth * 0.2 + 15) : (deviceWidth * 0.5 - deviceWidth * 0.24 + 15),
                            top: this.props.deviceDimensions.oriention ? (deviceHeight * 0.3 - deviceWidth * 0.3) : (deviceHeight * 0.3 - deviceWidth * 0.24),
                            width: this.props.deviceDimensions.oriention ? deviceWidth * 0.4 : deviceWidth * 0.48,
                            height: this.props.deviceDimensions.oriention ? deviceWidth * 0.4 : deviceWidth * 0.48
                        }]}
                />
            </View>
        )
    }
}

const mapStateToProps = state => {
    return {
        router: state.router,
        routeList: state.initial.routeList,
        deviceDimensions: state.initial.deviceDimensions,
        user: state.initial.user,
        isUserLogin: state.initial.isUserLogin,
        supplierId: state.initial.supplierId,
        cityId: state.initial.cityId,
        ...state.navigation.routes.filter(x => x.params.active)[0].params
    }
}
//export default connect(mapStateToProps)(SplashScreen)
export default connect(mapStateToProps, {
    setFooterVisibility, updateBasketCount, updateBasketCatalogList, updateRouteList, updateStoresList, updateCategoriesList,
    updateSupplierId, updateCityId, updateUserLogin, updateUser
})(SplashScreen)
