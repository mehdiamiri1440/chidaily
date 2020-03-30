import React, { Component } from 'react';
import {
    BackHandler,
    View,
    FlatList,
    Text,
    Image,
    ActivityIndicator,
    Linking,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Picker,
    ScrollView,
    ToastAndroid
} from "react-native";
import { connect } from 'react-redux';
import { Card, Input, InputGroup, Icon } from 'native-base'
import {
    setFooterVisibility, updateBasketCount, updateBasketCatalogList,
    updateRouteList, setDarkFooter, updateSupplierId
} from '../../actions';

import styles, { colors, fontSize, fonts } from '../../styles';
import { backAndroid } from '../../utility';
import { screenNames, deviceWidth, deviceHeight } from '../../utility/consts';
class RegisterMarketerQuota extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            UserAccountList: [],
            IsUserHaveAccount: true,
            UserTransactionInfo: {},
            AccountID: 0,
            MoneyUnitID: 0,
            Description: "",
            IsInsertPaymentRequestClicked: false
        };




    }
    getAllUserAccountInfo() {
        return new Promise((fullFill, eject) => {
            fetch('https://www.cheegel.com/apis/api/useraccountinfo/GetAllUserAccountInfo', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json; charset=utf-8',
                    'Content-Type': 'application/json; charset=utf-8',
                }
            }).then(response => response.json().then(result => {
                if (!(result && result.Table && result.Table.length)) {
                    this.setState({ IsUserHaveAccount: false })
                }
                else {
                    this.setState({ UserAccountList: result.Table, AccountID: result.Table[0].ID });
                }
                fullFill(true);
            }));
        })
    }
    getMarketerQoutaRemain() {
        return new Promise((fullFill, eject) => {
            fetch('http://www.cheegel.com/apis/api/pointtransaction/GetMarketerQuota', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json; charset=utf-8',
                    'Content-Type': 'application/json; charset=utf-8',
                }
            }).then(response => response.json().then(result => {
                if (result && result.Table && result.Table.length) {
                    if (parseInt(result.Table[0].Remain) > 0) {
                        this.setState({ UserTransactionInfo: result.Table[0] })
                    }
                    else {
                        ToastAndroid.showWithGravity('مبلغی برای برداشت موجود نمی باشد',
                            ToastAndroid.LONG,
                            ToastAndroid.CENTER);
                        setTimeout(() => {
                            this.props.navigation.navigate(screenNames.PROFILE, { selectedTab: "IntroducerInfo" })
                        }, 2500);
                    }
                }
                else {
                    ToastAndroid.showWithGravity('.مبلغی برای برداشت موجود نمی باشد',
                        ToastAndroid.SHORT,
                        ToastAndroid.CENTER);
                    setTimeout(() => {
                        this.props.navigation.navigate(screenNames.PROFILE, { selectedTab: "IntroducerInfo" })
                    }, 1500);
                }
                fullFill(true);
            }));
        });
    }
    componentDidMount() {
        let _that = this;
        _that.setState({ loading: true });
        _that.getAllUserAccountInfo().then(acRes => {
            if (_that.state.IsUserHaveAccount) {
                _that.getMarketerQoutaRemain().then(mrRes => {
                    _that.fetchMoneyUnits().then(muRes => {
                        _that.setState({ loading: false });
                    })
                })
            }
            else
                _that.setState({ loading: false });
        })
    }
    fetchMoneyUnits() {
        return new Promise((fullFill, eject) => {
            fetch('http://www.cheegel.com/apis/api/moneyunit', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json; charset=utf-8',
                    'Content-Type': 'application/json; charset=utf-8',
                }
            }).then(response => response.json().then(result => {

                if (result && result.length) {
                    this.setState({ MoneyUnitID: result.filter(x => x.MoneyUnitName == 'IRR')[0].ID });
                }
                fullFill(true);
            }));
        });
    }
    insertPaymentRequest() {
        this.setState({ IsInsertPaymentRequestClicked: true });
        fetch('http://www.cheegel.com/apis/api/paymentrequests/InsertPaymentRequest/' + this.state.UserTransactionInfo.Remain + '/' + this.state.MoneyUnitID + '/' + this.state.AccountID + '/' + this.state.Description, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(responses => responses.json().then(results => {
            if (results) {
                ToastAndroid.showWithGravity('درخواست شما با موفقیت ثبت گردید , کارشناسان ما بررسی خواهند کرد و وضعیت درخواست شما را اطلاع رسانی خواهند کرد ',
                    ToastAndroid.SHORT,
                    ToastAndroid.CENTER);
                setTimeout(() => {
                    this.props.navigation.navigate(screenNames.PROFILE, { selectedTab: "IntroducerInfo" })
                }, 1500);
            }
            this.setState({ IsInsertPaymentRequestClicked: false });
        })).catch(err => {
            this.setState({ IsInsertPaymentRequestClicked: false });
            ToastAndroid.showWithGravity('امکان ثبت درخواست برداشت در حال حاظر وجود ندارد',
                ToastAndroid.SHORT,
                ToastAndroid.CENTER);
        })
    }
    renderInsertPaymentRequest = () => {
        if (!this.state.IsInsertPaymentRequestClicked)
            return (
                <TouchableOpacity onPress={() => { this.insertPaymentRequest() }} style={{ paddingTop: 20 }}>
                    <View style={{ backgroundColor: '#024b8f', alignItems: 'center', width: deviceWidth, borderRadius: 5 }}>
                        <Text style={[styles.fontFamily, { fontSize: 16, color: '#FFFFFF', paddingVertical: 15 }]}>ثبت اطلاعات</Text>
                    </View>
                </TouchableOpacity>
            )
        else
            return (
                <View style={{ flex: 1, alignItems: 'center', width: deviceWidth }}>
                    <ActivityIndicator size={50} />
                </View>
            )
    }
    renderPage() {
        if (!this.state.loading) {
            if (this.state.IsUserHaveAccount) {
                if (this.state.UserTransactionInfo && this.state.UserTransactionInfo.Remain && parseInt(this.state.UserTransactionInfo.Remain) > 0) {
                    return (
                        <ScrollView keyboardShouldPersistTaps={'always'} style={{ backgroundColor: '#e8ebef', padding: 8 }}>
                            <View style={{ flex: 1, height: deviceHeight * 0.99 }}>
                                <View style={{ padding: 5, flexDirection: 'row-reverse' }}>
                                    <Text style={{ fontSize: fontSize.normal, fontFamily: fonts.BYekan, fontSize: fontSize.small, padding: 5 }}>میزان مبلغ برداشتی : </Text>
                                    <Text style={{ fontSize: fontSize.normal, fontFamily: fonts.BYekan, fontSize: fontSize.small, padding: 5 }}>{this.state.UserTransactionInfo.Remain.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' ريال '}</Text>
                                </View>
                                <View style={{ padding: 5 }}>
                                    <View style={{ flexDirection: 'row-reverse', padding: 5 }}>
                                        <Text style={{ fontSize: fontSize.normal, fontFamily: fonts.BYekan, fontSize: fontSize.small }}>انتخاب حساب : </Text>
                                        <TouchableOpacity onPress={() => {
                                            this.props.navigation.navigate(screenNames.REGISTER_USER_ACCOUNT_INFO, { "url": "fromregisterqouta" })
                                        }}>
                                            <Text style={{ fontSize: fontSize.normal, fontFamily: fonts.BYekan, fontSize: fontSize.small, color: '#024b8f' }}>+ ایجاد حساب</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <Picker
                                        onValueChange={(itemValue, itemIndex) => { this.setState({ AccountID: itemValue }) }}
                                        selectedValue={this.state.AccountID}>
                                        {this.state.UserAccountList.map((item, key) => (
                                            <Picker.Item color={colors.primary} label={item.Name + ' - ' + item.BranchName + ' - ' + ' - ' + item.CartNo} value={item.ID} key={item.ID} fontFamily={fonts.BYekan} />)
                                        )}

                                    </Picker>
                                </View>
                                <View style={{ padding: 5, height: deviceHeight * 0.15 }}>
                                    <Text style={{ fontSize: fontSize.normal, fontFamily: fonts.BYekan, fontSize: fontSize.small, padding: 5 }}>توضیحات : </Text>
                                    <Input
                                        style={{ fontFamily: fonts.BYekan, color: colors.secondaryText, borderWidth: 1, borderColor: colors.secondaryText, backgroundColor: '#FFF', borderRadius: 5 }}
                                        value={this.state.Description}
                                        onChangeText={Description => this.setState({ Description })} />
                                </View>
                                <View style={{ padding: 5, height: deviceHeight * 0.15 }}>
                                    {this.renderInsertPaymentRequest()}
                                </View>
                            </View>
                        </ScrollView>
                    )
                }
                else {
                    return (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <ActivityIndicator size={50} />
                        </View>
                    )
                }
            }
            else {
                return (
                    <View style={{ paddingTop: 50 }}>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ fontSize: fontSize.large, fontFamily: fonts.BYekan, fontSize: fontSize.small, padding: 10 }}>
                                برای برداشت از سهم بازاریابی خود از چی دیلی , ابتدا باید اطلاعات حساب بانکی مثل شماره کارت و یا شماره حساب خود را ثبت نمایید تا کارشناسان ما پس از بررسی های لازم نسبت به واریز وجه اقدام نمایند
                </Text>
                        </View>
                        <TouchableOpacity onPress={() => {
                            this.props.navigation.navigate(screenNames.REGISTER_USER_ACCOUNT_INFO)
                        }} style={{ paddingTop: 20 }}>
                            <View style={{ backgroundColor: '#024b8f', alignItems: 'center', width: deviceWidth, borderRadius: 3 }}>
                                <Text style={[styles.fontFamily, { fontSize: 16, color: '#FFFFFF', paddingVertical: 15 }]}>ایجاد حساب</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                )
            }
        }
        else {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size={50} />
                </View>
            )
        }
    }
    render() {
        return this.renderPage();
    }
}
const mapStateToProps = state => {
    return {
        router: state.router,
        routeList: state.initial.routeList,
        deviceDimensions: state.initial.deviceDimensions,
        ...state.navigation.routes.filter(x => x.params.active)[0].params
    }
}
export default connect(mapStateToProps, {
    setFooterVisibility, setDarkFooter, updateBasketCount,
    updateSupplierId, updateBasketCatalogList, updateRouteList
})(RegisterMarketerQuota)