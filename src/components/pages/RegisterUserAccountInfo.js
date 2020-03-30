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
import { screenNames, deviceWidth, deviceHeight } from '../../utility/consts';
class RegisterMarketerQuota extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            BankID: 0,
            BranchName: "",
            AccountNo: "",
            CartNo: "",
            ShebaNo: "",
            IsMainAccount: true,
            IsForeignAccount: false,
            BankList: [],
            IsRegisterAccountClicked: false
        };




    }
    getAllBank() {
        return new Promise((fullFill, eject) => {
            fetch('http://www.cheegel.com:3004/api/getBanksWithLimitedFirlds', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json; charset=utf-8',
                    'Content-Type': 'application/json; charset=utf-8',
                }
            }).then(response => response.json().then(result => {
                this.setState({ BankList: result })
            }));
        })
    }
    componentDidMount() {
        this.getAllBank();
    }
    registerAccount() {
        this.setState({ IsRegisterAccountClicked: true });
        fetch('http://www.cheegel.com/apis/api/useraccountinfo/InsertAccountInfo', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "BankID": this.state.BankID,
                "BranchName": this.state.BranchName,
                "AccountNo": this.state.AccountNo,
                "CartNo": this.state.CartNo,
                "ShebaNo": this.state.ShebaNo,
                "IsMainAccount": this.state.IsMainAccount,
                "IsForeignAccount": this.state.IsForeignAccount
            })
        }).then(responses => responses.json().then(results => {
            if (results) {
                ToastAndroid.showWithGravity('ثبت حساب با موفقیت انجام شد ',
                    ToastAndroid.SHORT,
                    ToastAndroid.CENTER);
                setTimeout(() => {
                    if (this.props.url && this.props.url == 'fromregisterqouta')
                        this.props.navigation.navigate(screenNames.REGISTER_MARKETER_QUOTA)
                    else
                        this.props.navigation.navigate(screenNames.PROFILE, { selectedTab: "IntroducerInfo" })
                }, 1500);
            }
            this.setState({ IsRegisterAccountClicked: false });
        })).catch(err => {
            this.setState({ IsRegisterAccountClicked: false })
            ToastAndroid.showWithGravity('امکان ثبت حساب در حال حاظر وجود ندارد',
                ToastAndroid.SHORT,
                ToastAndroid.CENTER);
        })
    }
    renderRegisterAccounttBtn = () => {
        if (!this.state.IsRegisterAccountClicked)
            return (
                <TouchableOpacity onPress={() => { this.registerAccount() }} style={{ paddingTop: 20 }}>
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
        return (
            <ScrollView keyboardShouldPersistTaps={'always'} style={{ backgroundColor: '#e8ebef', padding: 8 }}>
                <View style={{ flex: 1, height: deviceHeight * 0.99 }}>
                    <View style={{ padding: 5, height: deviceHeight * 0.15 }}>
                        <Text style={{ fontSize: fontSize.normal, fontFamily: fonts.BYekan, fontSize: fontSize.small, padding: 5 }}>شماره حساب</Text>
                        <Input
                            style={{ fontFamily: fonts.BYekan, color: colors.secondaryText, borderWidth: 1, borderColor: colors.secondaryText, backgroundColor: '#FFF', borderRadius: 5 }}
                            value={this.state.AccountNo}
                            onChangeText={AccountNo => this.setState({ AccountNo })} />
                    </View>
                    <View style={{ padding: 5, height: deviceHeight * 0.15 }}>
                        <Text style={{ fontSize: fontSize.normal, fontFamily: fonts.BYekan, fontSize: fontSize.small, padding: 5 }}>شماره کارت</Text>
                        <Input
                            style={{ fontFamily: fonts.BYekan, color: colors.secondaryText, borderWidth: 1, borderColor: colors.secondaryText, backgroundColor: '#FFF', borderRadius: 5 }}
                            value={this.state.CartNo}
                            onChangeText={CartNo => this.setState({ CartNo })} />
                    </View>
                    <View style={{ padding: 5, height: deviceHeight * 0.15 }}>
                        <Text style={{ fontSize: fontSize.normal, fontFamily: fonts.BYekan, fontSize: fontSize.small, padding: 5 }}>شماره شبا</Text>
                        <Input
                            style={{ fontFamily: fonts.BYekan, color: colors.secondaryText, borderWidth: 1, borderColor: colors.secondaryText, backgroundColor: '#FFF', borderRadius: 5 }}
                            value={this.state.ShebaNo}
                            onChangeText={ShebaNo => this.setState({ ShebaNo })} />
                    </View>
                    <View style={{ padding: 5, height: deviceHeight * 0.15 }}>
                        <Text style={{ fontSize: fontSize.normal, fontFamily: fonts.BYekan, fontSize: fontSize.small, padding: 5 }}>نام بانک</Text>
                        <Picker
                            onValueChange={(itemValue, itemIndex) => { this.setState({ BankID: itemValue }) }}
                            selectedValue={this.state.BankID}>
                            {this.state.BankList.map((item, key) => (
                                <Picker.Item color={colors.primary} label={item.LocalName} value={item.ID} key={item.ID} fontFamily={fonts.BYekan} />)
                            )}

                        </Picker>
                    </View>
                    <View style={{ padding: 5, height: deviceHeight * 0.15 }}>
                        <Text style={{ fontSize: fontSize.normal, fontFamily: fonts.BYekan, fontSize: fontSize.small, padding: 5 }}>نام شعبه</Text>
                        <Input
                            style={{ fontFamily: fonts.BYekan, color: colors.secondaryText, borderWidth: 1, borderColor: colors.secondaryText, backgroundColor: '#FFF', borderRadius: 5 }}
                            value={this.state.BranchName}
                            onChangeText={BranchName => this.setState({ BranchName })} />
                    </View>
                    {this.renderRegisterAccounttBtn()}
                </View>
            </ScrollView>
        )
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