import React, { Component } from 'react';
import { View, Text, Image, ScrollView, BackHandler, Easing, Animated, TouchableOpacity, Dimensions, Linking } from 'react-native';
import { connect } from 'react-redux';
import {
    setFooterVisibility, updateBasketCount, updateBasketCatalogList,
    updateRouteList, setDarkFooter, updateSupplierId, aboutUs
} from '../../actions';

import { Button } from 'react-native-elements';
import { Card, Icon } from 'native-base';

import styles, { fonts, colors, fontSize } from '../../styles';
import Header from '../common/Header';
import { deviceWidth, deviceHeight } from '../../utility/consts';
const animationFirstForCategory = 0;
const animationSecondForCategory = 0;
class AboutUs extends Component {
    static navigationOptions = ({ navigation }) => ({
        header: <Header title='درباره ما' navigation={navigation} />
    })
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    componentDidMount() {
    }
    goCheegel = (url) => {
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            }
        });
    };
    render() {
        return (
            <View>
                <ScrollView style={{ padding: 8 }}>
                    <Card style={{ paddingBottom: 40, borderRadius: 4, paddingHorizontal: 12, height: deviceHeight * 0.75 }}>
                        <View>
                            <Image
                                style={{
                                    alignSelf: 'center',
                                    width: deviceWidth * 0.48,
                                    height: deviceHeight * 0.2,
                                    resizeMode: 'contain',
                                    marginTop: 8
                                }}
                                source={require('../../../assets/Image/aboutus/chidaily-red-logo.jpg')} />
                            <Text
                                allowFontScaling={false}
                                style={{ lineHeight: 40, writingDirection: 'rtl', paddingBottom: 12, paddingHorizontal: 4, textAlign: 'center', fontFamily: fonts.BYekan, fontSize: fontSize.normal }}>
                                فروشگاه زیر مجموعه تجارت الکترونیک چیگل
                        </Text>
                            <TouchableOpacity onPress={() => { this.goCheegel('https://www.cheegel.com') }}>
                                <Text
                                    allowFontScaling={false}
                                    style={{ lineHeight: 40, writingDirection: 'rtl', paddingBottom: 12, paddingHorizontal: 4, textAlign: 'center', fontFamily: fonts.BYekan, fontSize: fontSize.normal }}>
                                    https://www.cheegel.com
                                </Text>
                            </TouchableOpacity>
                            <Image style={{ alignSelf: 'center', width: deviceWidth * 0.30, height: deviceHeight * 0.2, resizeMode: 'contain', marginTop: 4 }} source={require('../../../assets/Image/aboutus/postarm.png')} />
                            <Text
                                allowFontScaling={false}
                                style={{ lineHeight: 40, writingDirection: 'rtl', paddingBottom: 12, paddingHorizontal: 4, textAlign: 'center', fontFamily: fonts.BYekan, fontSize: fontSize.normal }}>
                                با همکاری اداره کل پست استان فارس
                        </Text>
                            <Text allowFontScaling={false} style={{ lineHeight: 40, writingDirection: 'rtl', paddingBottom: 12, paddingHorizontal: 4, textAlign: 'center', fontFamily: fonts.BYekan, fontSize: fontSize.normal }}>
                                با خدمات ویژه پست پیک
                        </Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row-reverse' }}>
                            <Text
                                allowFontScaling={false}
                                style={{ paddingHorizontal: 4, fontFamily: fonts.BYekan, fontSize: fontSize.small }}> تاریخ راه اندازی چیگل :</Text>
                            <Text
                                allowFontScaling={false}
                                style={[{ color: colors.primary }, { fontFamily: fonts.BYekan, fontSize: fontSize.small }]}>
                                1 تیر 1395
                        </Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row-reverse' }}>
                            <Text
                                allowFontScaling={false}
                                style={{ paddingHorizontal: 4, fontFamily: fonts.BYekan, fontSize: fontSize.small }}> تاریخ راه اندازی چی دیلی :</Text>
                            <Text
                                allowFontScaling={false}
                                style={[{ color: colors.primary }, { fontFamily: fonts.BYekan, fontSize: fontSize.small }]}>
                                27 اردیبهشت 1397
                        </Text>
                        </View>
                    </Card>
                    <Card style={{ paddingBottom: 40, borderRadius: 4, paddingHorizontal: 12, height: deviceHeight * 0.18 }}>
                        <View style={{ flex: 1, flexDirection: 'row-reverse', paddingVertical: 16 }}>
                            <Text
                                allowFontScaling={false}
                                style={{ paddingHorizontal: 4, fontFamily: fonts.BYekan, fontSize: fontSize.small }}> تاریخ راه اندازی چیگل :</Text>
                            <Text
                                allowFontScaling={false}
                                style={[{ color: colors.primary }, { fontFamily: fonts.BYekan, fontSize: fontSize.small }]}>
                                1 تیر 1395
                        </Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row-reverse' }}>
                            <Text
                                allowFontScaling={false}
                                style={{ paddingHorizontal: 4, fontFamily: fonts.BYekan, fontSize: fontSize.small }}> تاریخ راه اندازی چی دیلی :</Text>
                            <Text
                                allowFontScaling={false}
                                style={[{ color: colors.primary }, { fontFamily: fonts.BYekan, fontSize: fontSize.small }]}>
                                27 اردیبهشت 1397
                        </Text>
                        </View>
                    </Card>
                    <Card style={{ borderRadius: 4, paddingHorizontal: 16, height: deviceHeight * 0.25 }}>
                        <View style={{ flex: 1, flexDirection: 'column', paddingTop: 16, paddingBottom: 36 }}>
                            <Text
                                allowFontScaling={false}
                                style={{ color: colors.primary, paddingHorizontal: 4, fontFamily: fonts.BYekan, fontSize: fontSize.normal, textAlign: 'center' }}>
                                شماره های تماس
                        </Text>
                            <Text
                                allowFontScaling={false}
                                style={{ textAlign: 'center', fontFamily: fonts.BYekan, fontSize: fontSize.small }}>
                                (+98) 71  36359364</Text>
                            <Text
                                allowFontScaling={false}
                                style={{ textAlign: 'center', fontFamily: fonts.BYekan, fontSize: fontSize.small }}>
                                (+98) 71  36242701</Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'column', paddingBottom: 24 }}>
                            <Text
                                allowFontScaling={false}
                                style={{ color: colors.primary, paddingHorizontal: 4, fontFamily: fonts.BYekan, fontSize: fontSize.normal, textAlign: 'center' }}>
                                شماره اختصاصی مدیریت صدای مشتری
                        </Text>
                            <Text
                                allowFontScaling={false}
                                style={{ textAlign: 'center', fontFamily: fonts.BYekan, fontSize: fontSize.small }}>
                                (+98) 71  36364359</Text>
                        </View>
                    </Card>
                    <Card style={{ borderRadius: 4, paddingHorizontal: 16, height: deviceHeight * 0.3, marginBottom: 85 }}>
                        <View style={{ flex: 1, flexDirection: 'column', paddingTop: 16 }}>
                            <Text
                                allowFontScaling={false}
                                style={{ color: colors.primary, paddingHorizontal: 4, fontFamily: fonts.BYekan, fontSize: fontSize.normal, textAlign: 'center' }}>
                                ارتباط با تامین کنندگان
                        </Text>
                            <Text
                                allowFontScaling={false}
                                style={{ textAlign: 'center', fontFamily: fonts.BYekan, fontSize: fontSize.small }}>
                                srm@cheegel.com
                        </Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'column' }}>
                            <Text
                                allowFontScaling={false}
                                style={{ color: colors.primary, paddingHorizontal: 4, fontFamily: fonts.BYekan, fontSize: fontSize.normal, textAlign: 'center' }}>
                                ارتباط با مشتریان
                        </Text>
                            <Text
                                allowFontScaling={false}
                                style={{ textAlign: 'center', fontFamily: fonts.BYekan, fontSize: fontSize.small }}>
                                crm@cheegel.com</Text>
                        </View>
                        <View
                            allowFontScaling={false}
                            style={{ flex: 1, flexDirection: 'column' }}>
                            <Text style={{ color: colors.primary, paddingHorizontal: 4, fontFamily: fonts.BYekan, fontSize: fontSize.normal, textAlign: 'center' }}>
                                درخواست های عمومی
                        </Text>
                            <Text
                                allowFontScaling={false}
                                style={{ textAlign: 'center', fontFamily: fonts.BYekan, fontSize: fontSize.small }}>
                                info@cheegel.com
                            </Text>
                        </View>
                    </Card>
                </ScrollView >
            </View>
        )

    }
}
const mapStateToProps = state => {
    return {
        deviceDimensions: state.initial.deviceDimensions,
        ...state.navigation.routes.filter(x => x.params.active)[0].params
    }
}

export default connect(mapStateToProps, { setDarkFooter, setFooterVisibility, updateRouteList })(AboutUs)
