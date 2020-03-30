import React, { Component } from 'react';
import {
    View, Alert, AsyncStorage, Image, ScrollView,
    TextInput, StatusBar, Animated, TouchableOpacity, Dimensions
} from 'react-native';
import { connect } from 'react-redux';
import { Text, Icon } from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Button } from 'react-native-elements';
import styles, { colors, fontSize, fonts } from '../../styles';
import { consts, isUserLogin, logOut } from '../../utility';
import { updateUser, updateUserLogin, updateDeviceDimensions } from '../../actions';
import { screenNames, deviceWidth, deviceHeight } from '../../utility/consts';
class Menu extends Component {
    constructor(props) {
        super(props);
        let _that = this
        this.state = {
            menu: [
                {
                    Name: 'پروفایل',
                    Icon: 'person',
                    Route: 'profile',
                    Action: screenNames.PROFILE,
                    ActionObject: {}
                },
                {
                    Name: 'سبد های من',
                    Icon: 'shopping-cart',
                    iconType: MaterialIcons,
                    Route: 'userbasket',
                    Action: screenNames.USERBASKET,
                    ActionObject: {}
                },
                {
                    Name: 'نماینده چیگل',
                    Icon: 'verified-user',
                    iconType: MaterialIcons,
                    Route: 'agents',
                    Action: screenNames.AGENTS,
                    ActionObject: {}
                },
                {
                    Name: 'پستچی',
                    Icon: 'mail',
                    iconType: MaterialIcons,
                    Route: 'postman',
                    Action: screenNames.POSTMAN,
                    ActionObject: {}
                },
                {
                    Name: 'اطلاعات معرفین',
                    iconType: MaterialIcons,
                    Icon: 'people',
                    Route: 'introducerInfo',
                    Action: screenNames.INTRODUCER_INFO,
                    ActionObject: {}
                },
                {
                    Name: 'تماس با ما',
                    Icon: 'call',
                    Route: 'contactUs',
                    Action: screenNames.CONTACT_US,
                    ActionObject: {}
                },
                {
                    Name: 'درباره ما',
                    Icon: 'ios-information-circle-outline',
                    Route: 'aboutUs',
                    Action: screenNames.ABOUT_US,
                    ActionObject: {}
                },
                {
                    Name: 'خروج',
                    Icon: 'exit-to-app',
                    iconType: MaterialIcons,
                    Route: 'exit',
                    Action: 'exit',
                    ActionObject: {},
                    condition: this.props.isUserLogin
                }
            ]
        }
        Dimensions.addEventListener('change', (dimensions) => {
            let x = {
                ...dimensions.window,
                oriention: dimensions.window.width >= dimensions.window.height ? 'horizontal' : 'vertical',
            }
            this.props.updateDeviceDimensions(x)
        });
    };

    componentDidMount() {

    }

    logout() {
        let _that = this;
        let getUserInfo = _that.props.user.UserName;
        logOut().then(data => {
            _that.props.updateUserLogin(false);
            _that.props.updateUser({});
            _that.props.navigation.navigate(screenNames.CMS);
        })
    }
    menuClick(isExist, menuItem) {
        if (isExist)
            this.logout();
        else
            this.props.navigation.navigate(menuItem.Action, menuItem.ActionObject)
    }
    renderLoggedInHeader() {
        if (this.props.user && this.props.isUserLogin) {
            return (
                <View>
                    <View style={{
                        width: deviceWidth * 0.9,
                        height: deviceHeight * 0.099,
                        position: 'absolute',
                        top: 0, right: 0, backgroundColor: colors.secondary
                    }}>
                        <Text style={[styles.fontFamily,
                        {
                            color: 'white', paddingVertical: 22,
                            paddingHorizontal: 24,
                            fontSize: fontSize.normal,
                            position: 'absolute', top: 0, right: deviceWidth * 0.01
                        }
                        ]}>
                            {this.props.user.FullName}
                        </Text>
                        <Image
                            style={{
                                flex: 1,
                                width: deviceWidth * 0.12,
                                height: deviceWidth * 0.12,
                                position: 'absolute',
                                top: 5,
                                left: deviceWidth * 0.24,
                                resizeMode: 'contain',
                            }}
                            source={require('../../../assets/Icon/SplashScreen/icon.png')} />
                    </View>
                    <View style={{
                        flexDirection: 'row-reverse',
                        padding: 16, marginTop: deviceWidth * 0.1
                    }}>
                        {/* <View style={{
                            width: deviceWidth * 0.1,
                            height: deviceWidth * 0.1, padding: 6
                        }}>
                            <Image
                                style={{ flex: 1, width: null, height: null, resizeMode: 'contain', top: 10 }}
                                source={this.props.user.ProfileImage ?
                                    ({ uri: `https://cheegel.com/apis/Handlers/FileHandler.ashx?type=2&id=${this.props.user.ProfileImage}` })
                                    : (require('../../assets/images/guest-64.png'))} />
                        </View>
                        <Text style={[styles.fontFamily, {
                            color: '#2b507a',
                            textAlignVertical: 'center', fontSize: fontSize.large
                        }]}>
                            {this.props.user.FullName}
                        </Text> */}
                    </View>
                </View>
            )
        }
    }
    renderFooterMenu() {
        return (
            <View style={{ flexDirection: 'row-reverse', padding: 20 }}>
                <View style={{ width: 70, height: 70, paddingHorizontal: 8, paddingVertical: 8 }}>
                    <Image
                        style={{ flex: 1, width: null, height: null, resizeMode: 'contain' }}
                        source={this.props.user.ProfileImage ? ({ uri: `https://cheegel.com/apis/Handlers/FileHandler.ashx?type=2&id=${this.props.user.ProfileImage}` }) : (require('../../assets/images/guest-64.png'))} />
                </View>
                <Text style={[styles.fontFamily, { paddingHorizontal: 8, paddingVertical: 8, color: 'red', textAlignVertical: 'center', fontSize: 20 }]}>
                    {this.props.user.FullName}
                </Text>
            </View>
        )
    }
    renderSignUpHeader() {
        if (!this.props.isUserLogin) {
            return (
                <View style={{ flexDirection: 'row-reverse', padding: 16, marginTop: deviceWidth * 0.08 }}>
                    <View style={{
                        width: deviceWidth * 0.9,
                        height: deviceHeight * 0.11, position: 'absolute',
                        top: -40, right: 0, backgroundColor: colors.secondary
                    }}>
                        <Text
                            style={[
                                styles.fontFamily,
                                {
                                    color: 'white',
                                    paddingVertical: 22,
                                    paddingHorizontal: 24,
                                    fontSize: fontSize.normal,
                                    position: 'absolute',
                                    right: deviceWidth * 0.20
                                }]}>چی دیلی</Text>
                        <Image
                            style={{
                                flex: 1, width: deviceWidth * 0.16, height: deviceWidth * 0.16,
                                resizeMode: 'contain',
                                left: 5
                            }}
                            source={require('../../../assets/Icon/SplashScreen/icon.png')} />
                    </View>
                    <View style={{
                        flexDirection: 'row-reverse',
                        paddingTop: 40
                    }}>
                        <TouchableOpacity onPress={() => {
                            this.props.onSelect()
                            this.props.navigation.navigate(screenNames.LOGIN)
                        }} style={{ marginHorizontal: deviceWidth * 0.04 }}>
                            <View style={{ borderRadius: 4, borderWidth: 2, borderColor: colors.secondary, backgroundColor: 'white', width: deviceWidth * 0.22, alignItems: 'center' }}>
                                <Text style={[styles.fontFamily, { color: colors.secondary, paddingVertical: 8 }]}>ورود</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            this.props.onSelect()
                            this.props.navigation.navigate(screenNames.SIGN_UP)
                        }} style={{ marginHorizontal: deviceWidth * 0.04 }}>
                            <View style={{ borderRadius: 4, borderWidth: 2, borderColor: colors.secondary, backgroundColor: colors.secondary, width: deviceWidth * 0.22, alignItems: 'center' }}>
                                <Text style={[styles.fontFamily, { color: 'white', paddingVertical: 8 }]}>ثبت نام</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }
    }
    renderMenuItem(menuItem, indx) {
        if (
            (menuItem.Route == 'profile' && this.props.isUserLogin) ||
            (menuItem.Route == 'userbasket' && this.props.isUserLogin) ||
            (menuItem.Route == 'agents' && this.props.isUserLogin && this.props.user.Roles && this.props.user.Roles.indexOf('SupplierAgent') != -1) ||
            (menuItem.Route == 'postman' && this.props.isUserLogin && this.props.user.Roles && this.props.user.Roles.indexOf('postman') != -1) ||
            (menuItem.Route == 'advertimentCMS' && true) ||
            (menuItem.Route == 'basket' && true) ||
            (menuItem.Route == 'aboutUs' && true) ||
            (menuItem.Route == 'productGallery' && true) ||
            (menuItem.Route == 'category' && true) ||
            (menuItem.Route == 'introducerInfo' && this.props.isUserLogin && true) ||
            (menuItem.Route == 'contactUs' && true) ||
            (menuItem.Route == 'exit' && this.props.isUserLogin)
        )
            return (
                <TouchableOpacity key={indx}
                    style={{
                        width: deviceWidth * 0.7,
                        flexDirection: 'row-reverse',
                        padding: 16,
                        borderBottomColor: '#f0f0f0',
                        borderBottomWidth: 1
                    }}
                    onPress={() => {
                        this.props.onSelect()
                        this.menuClick(menuItem.Action == 'exit' ? true : false, menuItem);
                    }}
                >
                    <View style={{ width: deviceWidth * 0.08, height: deviceWidth * 0.06 }}>
                        {menuItem.iconType ?
                            <menuItem.iconType name={menuItem.Icon}
                                style={{ color: '#7a7c7b', fontSize: 26 }} /> :
                            <Icon name={menuItem.Icon}
                                style={{ color: '#7a7c7b', fontSize: 26 }} />
                        }
                    </View>
                    <Text
                        allowFontScaling={false}
                        style={[styles.fontFamily, {
                            paddingHorizontal: 16,
                            textAlignVertical: 'center',
                            color: colors.secondaryText,
                            fontSize: fontSize.small
                        }]}>
                        {menuItem.Name}
                    </Text>
                </TouchableOpacity>
            )
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={{
                    height: '100%',
                    backgroundColor: '#fff'
                }}>
                    {this.props.user && this.props.isUserLogin ?
                        this.renderLoggedInHeader() :
                        this.renderSignUpHeader()}
                    {(this.props.isUserLogin || !this.props.isUserLogin) && this.state.menu.map((d, j) => {
                        return this.renderMenuItem(d, j)
                    })}
                </View>
            </View>


        );
    }
}
const mapStateToProps = state => {
    return {
        user: state.initial.user,
        isUserLogin: state.initial.isUserLogin,
        deviceDimensions: state.initial.deviceDimensions
    }
}

export default connect(mapStateToProps, { updateUser, updateUserLogin, updateDeviceDimensions })(Menu)
