import React, { Component } from 'react';
import {
    StyleSheet, Platform, ToastAndroid, View, Alert,
    AsyncStorage, Image, ScrollView, TextInput, ActivityIndicator, BackHandler
} from 'react-native';
import { connect } from 'react-redux';
import { basketPurchaseResult, setFooterVisibility, updateRouteList } from '../../actions';
import {
    Container, Title, Content, Footer, FooterTab, Left, Right, Subtitle, Body, Text,
} from 'native-base';
import { Button } from 'react-native-elements';
import { fonts, colors, fontSize } from '../../styles'
import { backAndroid, clearBasket } from '../../utility'
import { screenNames, deviceWidth, deviceHeight } from '../../utility/consts';
class BasketPurchaseResult extends Component {
    constructor(props) {
        super(props)
        this.state = {
            basketTrackingCode: props.trackingCode
        }
    }

    componentDidMount() {

    }
    openProduct() {
        this.props.navigation.navigate(screenNames.CMS)
    }
    renderCreditCondition() {
        return (
            <Text
                allowFontScaling={false}
                style={{ color: 'white', fontSize: fontSize.large, fontFamily: fonts.BYekan }}>
                خرید شما با موفقیت ثبت گردید
            </Text>
        )
    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#27ae60' }}>
                <View style={{ flex: 5 }}>
                    <View style={{
                        flex: 1,
                        position: 'absolute',
                        top: Math.ceil(deviceHeight * 0.016),
                        left: Math.ceil(deviceWidth * 0.2),
                        width: Math.ceil(deviceWidth * 0.59),
                        height: Math.ceil(deviceWidth * 0.59),
                        borderRadius: Math.ceil(deviceWidth * 0.59 * 0.5),
                        borderWidth: 1,
                        borderColor: 'white',

                    }}>
                        <View style={{
                            position: 'absolute',
                            top: Math.ceil(deviceWidth * 0.04),
                            left: Math.ceil(deviceWidth * 0.05),
                            width: Math.ceil(deviceWidth * 0.5),
                            height: Math.ceil(deviceWidth * 0.5),
                            borderRadius: Math.ceil(deviceWidth * 0.25),
                            borderWidth: 1,
                            borderColor: 'white',
                        }}>
                            <View style={{
                                position: 'absolute',
                                top: deviceWidth * 0.05,
                                left: deviceWidth * 0.05,
                                width: Math.ceil(deviceWidth * 0.4),
                                height: Math.ceil(deviceWidth * 0.4),
                                borderRadius: Math.ceil(deviceWidth * 0.2),
                                borderWidth: 1,
                                borderColor: 'white',
                            }}>
                                <View style={{
                                    position: 'absolute',
                                    top: Math.ceil(deviceWidth * 0.05),
                                    left: Math.ceil(deviceWidth * 0.05),
                                    width: Math.ceil(deviceWidth * 0.3),
                                    height: Math.ceil(deviceWidth * 0.3),
                                    borderRadius: Math.ceil(deviceWidth * 0.15),
                                    backgroundColor: 'white',

                                }}>
                                    <Image
                                        style={{
                                            position: 'absolute',
                                            width: deviceWidth * 0.2,
                                            height: deviceWidth * 0.2,
                                            top: deviceHeight * 0.03,
                                            left: deviceWidth * 0.06
                                        }}
                                        source={require('../../assets/images/tick.png')} />
                                </View>
                            </View>
                        </View>
                    </View>

                </View>
                <View style={{ flex: 5, alignItems: 'center', paddingTop: 40 }}>
                    {this.renderCreditCondition()}
                    <Text
                        allowFontScaling={false}
                        style={{ color: 'white', fontSize: fontSize.large, fontFamily: fonts.BYekan, paddingTop: 10 }}>
                        شماره پیگیری :{this.state.basketTrackingCode.toString().split('-')[1]}
                    </Text>
                    <Text
                        allowFontScaling={false}
                        style={{ color: 'white', fontSize: fontSize.normal, fontFamily: fonts.BYekan, paddingTop: 10, textAlign: 'center', paddingHorizontal: 10 }}>
                        کارشناسان ما به زودی با شما تماس خواهند گرفت
                    </Text>
                    <Button
                        title="بازگشت"
                        color="#f7ecfd"
                        fontFamily={fonts.BYekan}
                        onPress={() => this.openProduct()}
                        titleStyle={{ fontWeight: "800" }}
                        buttonStyle={{
                            backgroundColor: "#575294",
                            width: deviceWidth,
                            marginTop: 50
                        }}
                    />
                </View>
                {/* <View style={{flex:1,alignItems:'center',paddingTop:60}}>

                </View> */}
            </View>
        )
    }
}

const mapStateToProps = state => {
    return {
        routeList: state.initial.routeList,
        deviceDimensions: state.initial.deviceDimensions,
        ...state.navigation.routes.filter(x => x.params.active)[0].params
    }
}

export default connect(mapStateToProps, { basketPurchaseResult, setFooterVisibility, updateRouteList })(BasketPurchaseResult)