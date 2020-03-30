import React, { Component } from 'react';
import {
    View,
    AsyncStorage,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    DatePickerAndroid,
    Picker,
    ToastAndroid,
    ActivityIndicator, BackHandler
} from 'react-native';
import { CustomeTextInput, CustomeButton } from '../common/CustomeInputs';
import styles, { colors, fontSize, fonts } from '../../styles';
import { connect } from 'react-redux';
import { Button } from 'react-native-elements';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

import { Icon, Switch } from 'native-base';
import { consts, isUserLogin, logOut, backAndroid, numberValidation, EmailValidation, validateMobileNumber } from '../../utility'
import { setFooterVisibility, setDarkFooter, updateRouteList, updateUser } from '../../actions';
import { screenNames, deviceHeight } from '../../utility/consts';
var User = {},
    ContactInfo = [],
    UserTransactionInfo = [],
    UserIntroducedCount = 0,
    IsUserTransactionLoaded = false,
    PhoneInfo = {};
class Profile extends Component {
    static navigationOptions = () => ({
        header: null
    })
    constructor(props) {
        super(props)
        this.state = {
            ProfileMenu: [
                { "IconName": "person", "TabName": "MyCheegel", "TabTitle": "اطلاعات فردی" },
                { "IconName": "chart", "iconType": SimpleLineIcons, "TabName": "IntroducerInfo", "TabTitle": "آمار فروش" },
                { "IconName": "md-chatbubbles", "TabName": "Messages", "TabTitle": "تیکت" },
                { "IconName": "cart", "TabName": "UserBaskets", "TabTitle": "سبد های من" },
            ],
            Image: '',
            FirstName: '',
            LastName: '',
            Email: '',
            IsMale: '',
            IsMarketer: '',
            Phone: 0,
            FirstNameError: false,
            LastNameError: false,
            PhoneError: false,
            SelectedTab: 'MyCheegel',
            loading: false,
            flag: false,
            userCreditRemain: 0
        }




        ContactInfo = [];
        PhoneInfo = {};
        UserTransactionInfo = [];
        UserIntroducedCount = 0;
        IsUserTransactionLoaded = false;
    }
    componentDidMount() {
        isUserLogin().then(data => {
            if (data)
                this.loadUserData()
            else
                this.props.navigation.navigate(screenNames.LOGIN)
        })
    }
    setTab(tab) {
        if (tab == 'IntroducerInfo') {
            this.getUserTransactionInfo().then(x => {
                this.setState({ SelectedTab: tab })
            })
        }
        else {
            this.setState({ SelectedTab: tab })
        }
    }
    renderProfileTab(tab) {
        switch (this.state.SelectedTab) {
            case "MyCheegel":
                return this.renderMyCheegel()
                break;
            case "IntroducerInfo":
                return this.renderIntroducerInfo();
                break;
            case "Messages":
                this.props.navigation.navigate(screenNames.CONTACT_US)
                break;
            case "UserBaskets":
                this.props.navigation.navigate(screenNames.USERBASKET)
                break;
            default:
                return this.renderError()
                break;
        }
    }
    handleinput(type, value) {
        switch (type) {
            case "FirstName":
                this.setState({ FirstName: value, FirstNameError: false })
                break;
            case "LastName":
                this.setState({ LastName: value, LastNameError: false })
                break;
            case "Email":
                this.setState({ Email: value, EmailError: false })
                break;
            case "Phone":
                this.setState({ Phone: numberValidation(value), PhoneError: false })
                break;
            case "IsMale":
                this.setState({ IsMale: value })
                break;
            case "IsMarketer":
                this.setState({ IsMarketer: value })
                break;
            default:
                break;
        }
    }
    //#region myCheegel
    renderMyCheegel() {
        return (
            <View style={{ display: 'flex', paddingBottom: 50 }}>
                <CustomeTextInput
                    placeholder="نام"
                    value={this.state.FirstName}
                    hasError={this.state.FirstNameError}
                    onChangeText={(Value) => this.handleinput("FirstName", Value)}
                ></CustomeTextInput>
                <CustomeTextInput
                    placeholder="نام خانوادگی"
                    value={this.state.LastName}
                    hasError={this.state.LastNameError}
                    onChangeText={(Value) => this.handleinput("LastName", Value)}
                ></CustomeTextInput>
                <CustomeTextInput
                    placeholder="ایمیل"
                    value={this.state.Email}
                    hasError={this.state.EmailError}
                    isLeftAlign={true}
                    onChangeText={(Value) => this.handleinput("Email", Value)}
                ></CustomeTextInput>
                <CustomeTextInput
                    placeholder="موبایل"
                    value={this.state.Phone}
                    hasError={this.state.PhoneError}
                    maxLength={11}
                    isLeftAlign={true}
                    onChangeText={(Value) => this.handleinput("Phone", Value)}
                ></CustomeTextInput>
                {/* <TouchableOpacity
                    onPress={() => this.openUpPicker()}
                >
                    <Text>تاریخ تولد</Text>
                </TouchableOpacity> */}
                <Text style={[styles.fontFamily, {
                    width: "90%",
                    marginTop: 20,
                    fontSize: fontSize.small,
                    color: 'black'
                }]}>جنسیت :</Text>
                <Picker
                    selectedValue={this.state.IsMale}
                    style={{
                        width: "80%",
                        alignSelf: "center",
                    }}
                    onValueChange={(Value) => this.handleinput("IsMale", Value)}>
                    <Picker.Item label="مرد" value={true} />
                    <Picker.Item label="زن" value={false} />
                </Picker>
                <Text style={[styles.fontFamily, {
                    width: "90%",
                    marginTop: 20,
                    fontSize: fontSize.small,
                    color: 'black'
                }]}>آیا مایل به همکاری با چیگل در نقش بازاریاب هستید ؟</Text>
                <Picker
                    selectedValue={this.state.IsMarketer}
                    style={{
                        width: "80%",
                        alignSelf: "center",
                    }}
                    onValueChange={(Value) => this.handleinput("IsMarketer", Value)}>
                    <Picker.Item label="بلی" value={true} />
                    <Picker.Item label="خیر" value={false} />
                </Picker>
                <CustomeButton
                    title="ذخیره اطلاعات"
                    onPress={() => this.saveUserInfo()}
                    loading={this.state.loading}
                ></CustomeButton>
            </View>
        )
    }
    getUserTransactionInfo() {
        return new Promise((fullFill, eject) => {
            if (IsUserTransactionLoaded == false) {
                IsUserTransactionLoaded = true;
                fetch('http://www.cheegel.com/apis/api/pointtransaction/GetMarketerQuota', {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json; charset=utf-8',
                        'Content-Type': 'application/json; charset=utf-8',
                    }
                }).then(response => response.json().then(result => {
                    if (result && result.Table && result.Table.length) {
                        UserTransactionInfo = result.Table;
                    }
                    fetch('http://www.cheegel.com/apis/api/user/GetIntroducedUsersByUserID/' + 0 + '/' + 2, {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json; charset=utf-8',
                            'Content-Type': 'application/json; charset=utf-8',
                        }
                    }).then(responses => responses.json().then(results => {
                        if (results && results.Table && results.Table.length) {
                            UserIntroducedCount = results.Table[0].TotalCount;
                            this.setState({ flag: !this.state.flag });
                        }
                    }));
                    fullFill(true);
                })).catch(err => {
                    UserIntroducedCount = 0;
                    this.setState({ flag: !this.state.flag });
                    fullFill(true);
                });
            }
            else
                fullFill(true);
        })
    }
    loadUserData() {
        let _that = this;
        fetch('http://www.cheegel.com/apis/api/user/GetUserCredit/1', {
            method: 'GET',
            headers: {
                'Accept': 'application/json; charset=utf-8',
                'Content-Type': 'application/json; charset=utf-8',
            }
        }).then(response => response.json().then(result => {
            this.getUserForProfile().then(response => {
                this.setState({
                    Image: response.GUID,
                    FirstName: response.FirstName,
                    LastName: response.LastName,
                    Email: response.Email,
                    IsMale: response.IsMale,
                    IsMarketer: response.IsMarketer,
                    userCreditRemain: Math.ceil(result.Table[0].CreditValue)
                })
                this.props.updateUser({
                    ...this.props.user,
                    ProfileImage: response.GUID,
                    FirstName: response.FirstName,
                    LastName: response.LastName,
                    FullName: response.FirstName + ' ' + response.LastName,
                    Email: response.Email,
                    IsMale: response.IsMale,
                    IsMarketer: response.IsMarketer
                })
            })
            this.getUserContactInfo().then(result => {
                ContactInfo = result.Table;
                PhoneInfo = ContactInfo.filter(el => { return el.ContactTypeName.toLowerCase() == 'mobile' }).length > 0 ? ContactInfo.filter(el => { return el.ContactTypeName.toLowerCase() == 'mobile' })[0] : 0
                this.setState({ Phone: 0 + PhoneInfo.AreaCode + PhoneInfo.Contact })
                if (_that.props.selectedTab && _that.props.selectedTab == 'IntroducerInfo') {
                    _that.getUserTransactionInfo().then(x => {
                        this.setTab('IntroducerInfo');
                    })
                }
            })
        }));
    }
    saveUserInfo() {
        if (!this.state.FirstName)
            this.setState({ FirstNameError: true })
        if (!this.state.LastName)
            this.setState({ LastNameError: true })
        if (!this.state.Email)
            this.setState({ EmailError: true })
        else if (!EmailValidation(this.state.Email)) {
            this.setState({ EmailError: true })
            ToastAndroid.showWithGravity('ایمیل وارد شده معتبر نمیابشد', ToastAndroid.SHORT, ToastAndroid.CENTER);
        }
        if (!this.state.Phone || this.state.Phone.length < 11)
            this.setState({ PhoneError: true })
        else if (validateMobileNumber(this.state.Phone).length == 0) {
            this.setState({ PhoneError: true })
            ToastAndroid.showWithGravity('شماره تلفن وارد شده معتبر نمیابشد', ToastAndroid.SHORT, ToastAndroid.CENTER);
        }
        if (this.state.FirstName && this.state.LastName && this.state.Email && EmailValidation(this.state.Email) && this.state.Phone && validateMobileNumber(this.state.Phone).length > 0) {
            this.setState({ loading: true })
            User.FirstName = this.state.FirstName;
            User.LastName = this.state.LastName;
            User.Email = this.state.Email;
            User.IsMale = this.state.IsMale;
            User.IsMarketer = this.state.IsMarketer;
            PhoneInfo.AreaCode = validateMobileNumber(this.state.Phone)[0].slice(1, 4)
            PhoneInfo.Contact = validateMobileNumber(this.state.Phone)[0].slice(4, 11)
            ContactInfo.filter(el => { return el.ContactTypeName.toLowerCase() == 'mobile' })[0] = PhoneInfo
            this.insertUserContactInfo().then(result => {
                this.insertUserInfo().then(result => {
                    this.setState({ loading: false })
                    if (result > 0) {
                        alert('اطلاعات با موفقیت ذخیره گردید');
                        this.loadUserData()
                    }
                    else if (result == -2)
                        noticeService.alert('ابن پست الکترونیکی قبلا ثبت گردیده است');
                    else
                        noticeService.alert('خطا در ذخیره سازی');
                })
            })
        }
    }
    getUserForProfile() {
        return new Promise((fullFill, eject) => {
            fetch(`https://www.cheegel.com/apis/api/user/GetUserForProfile`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json; charset=utf-8',
                    'Content-Type': 'application/json; charset=utf-8',
                }
            }).then(response => response.text().then(result => fullFill(JSON.parse(result))))
        })
    }
    getUserContactInfo() {
        return new Promise((fullFill, eject) => {
            fetch(`https://www.cheegel.com/apis/api/user/GetUserContactByUserID`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json; charset=utf-8',
                    'Content-Type': 'application/json; charset=utf-8',
                }
            }).then(response => response.text().then(result => fullFill(JSON.parse(result))))
        })
    }
    insertUserContactInfo() {
        return new Promise((fullFill, eject) => {
            fetch(`https://www.cheegel.com/apis/api/user/InsertUpdateUserContact`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json; charset=utf-8',
                    'Content-Type': 'application/json; charset=utf-8',
                },
                body: JSON.stringify(ContactInfo)
            }).then(response => response.text().then(result => fullFill(JSON.parse(result))))
        })
    }
    insertUserInfo() {
        return new Promise((fullFill, eject) => {
            fetch(`https://www.cheegel.com/apis/api/user/ChangeProfileInfo`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json; charset=utf-8',
                    'Content-Type': 'application/json; charset=utf-8',
                },
                body: JSON.stringify(User)
            }).then(response => response.text().then(result => fullFill(JSON.parse(result))))
        })
    }
    //#endregion

    //#region userBasket
    renderUserBaskets() {
        return (
            <View><Text>4</Text></View>
        )
    }
    //#endregion


    openUpPicker() {
        try {
            const { action, year, month, day } = DatePickerAndroid.open({
                // Use `new Date()` for current date.
                // May 25 2020. Month 0 is January.
                date: new Date(2020, 4, 25)
            });
            if (action !== DatePickerAndroid.dismissedAction) {
                // Selected year, month (0-11), day
            }
        } catch ({ code, message }) {

        }
    }
    renderShowMoreUserIntroduced() {
        if (UserIntroducedCount > 0)
            return (
                <TouchableOpacity onPress={() => {
                    this.props.navigation.navigate(screenNames.INTRODUCER_INFO)
                }} style={{ paddingRight: 2 }}>
                    <View style={{ borderRadius: 5, padding: 5, backgroundColor: colors.primary, flexDirection: 'row-reverse' }}>
                        <Icon name="md-arrow-dropleft-circle" style={{ color: '#FFF', textAlignVertical: 'center' }} />
                        <Text style={{ color: '#FFF', fontFamily: fonts.BYekan, paddingRight: 5, textAlignVertical: 'center', fontSize: fontSize.smaller }}>اطلاعات بیشتر</Text>
                    </View>
                </TouchableOpacity>
            )
    }
    renderMarketerInfo() {
        if (UserTransactionInfo[0].MarketerCode != null)
            return (
                <View style={{ padding: 10 }}>
                    <View style={{ flexDirection: 'row-reverse', padding: 10 }}>
                        <Text style={{ fontFamily: fonts.BYekan, fontSize: fontSize.normal }}>کد معرف شما : </Text>
                        <Text style={{ color: '#024b8f', fontSize: fontSize.normal }}>{UserTransactionInfo[0].MarketerCode}</Text>
                    </View>
                    <View style={{ flexDirection: 'row-reverse', paddingTop: 10 }}>
                        <View style={{ padding: 5, flexDirection: 'row-reverse' }}>
                            <Icon name="ios-people" style={{ color: colors.secondaryText, textAlignVertical: 'center' }} />
                            <Text style={{ color: colors.secondaryText, fontFamily: fonts.BYekan, textAlignVertical: 'center', paddingRight: 5, fontSize: fontSize.smaller }}>تعداد کاربرانی که شما معرفشان هستید</Text>
                            <Text style={{ color: colors.secondaryText, textAlignVertical: 'center', fontSize: fontSize.smaller }}>({UserIntroducedCount == 0 ? '0' : UserIntroducedCount + ' نفر '})</Text>
                        </View>
                        {this.renderShowMoreUserIntroduced()}
                    </View>
                </View>
            )
        else
            return (
                <View style={{ padding: 10 }}>
                    <Text style={{ fontFamily: fonts.BYekan, fontSize: fontSize.small }}>کد معرفی برای شما تعیین نشده است</Text>
                </View>
            )
    }
    renderMarketingInfo() {
        if (UserTransactionInfo[0].MarketerCode != null)
            return (
                <View style={{ paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.secondaryText }}>
                    <View style={{ flexDirection: 'row-reverse', padding: 10 }}>
                        <Text style={{ fontSize: fontSize.normal, fontFamily: fonts.BYekan, fontSize: fontSize.small, color: colors.blue, textAlign: 'right', color: colors.secondaryText }}>سهم بازاریابی شما در چی دیلی : </Text>
                        <Text style={{ color: colors.textPrimary }}>{UserTransactionInfo[0].SaleCost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' ريال '}</Text>
                    </View>
                    <View style={{ flexDirection: 'row-reverse', padding: 10 }}>
                        <Text style={{ fontSize: fontSize.normal, fontFamily: fonts.BYekan, fontSize: fontSize.small, color: colors.blue, textAlign: 'right', color: colors.secondaryText }}>میزان برداشت شده : </Text>
                        <Text style={{ color: colors.textPrimary }}>{UserTransactionInfo[0].SaleCostPayed.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' ريال '}</Text>
                    </View>
                    <View style={{ flexDirection: 'row-reverse', padding: 10 }}>
                        <Text style={{ fontSize: fontSize.normal, fontFamily: fonts.BYekan, fontSize: fontSize.small, color: colors.blue, textAlign: 'right', color: colors.secondaryText }}>باقیمانده : </Text>
                        <Text style={{ color: colors.textPrimary }}>{UserTransactionInfo[0].Remain.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' ريال '}</Text>
                    </View>
                    <View style={{ flexDirection: 'row-reverse', padding: 10 }}>
                        <TouchableOpacity onPress={() => {
                            this.props.navigation.navigate(screenNames.VIEW_QOUTA_DETAILS)
                        }} style={{ paddingRight: 2 }}>
                            <Text style={{ fontSize: fontSize.normal, fontFamily: fonts.BYekan, fontSize: fontSize.small, color: colors.blue, textAlign: 'right', color: colors.blue }}>مشاهده خرید هایی که با کد معرف شما انجام شده است</Text>
                        </TouchableOpacity>
                    </View>
                    {this.renderGetWithdrawButton()}
                </View>
            )
    }
    renderGetWithdrawButton() {
        if (parseInt(UserTransactionInfo[0].Remain) > 0 && UserTransactionInfo[0].IsPaymentEnabled) {
            return (
                <View style={{ flexDirection: 'row-reverse', padding: 10 }}>
                    <TouchableOpacity onPress={() => {
                        this.props.navigation.navigate(screenNames.REGISTER_MARKETER_QUOTA)
                    }} style={{ paddingRight: 2 }}>
                        <View style={{ borderRadius: 5, padding: 5, backgroundColor: colors.primary, flexDirection: 'row-reverse' }}>
                            <Icon name="md-arrow-dropleft-circle" style={{ color: '#FFF', textAlignVertical: 'center' }} />
                            <Text style={{ color: '#FFF', fontFamily: fonts.BYekan, paddingRight: 5, textAlignVertical: 'center' }}>درخواست برداشت</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            )
        }
        else {
            return (
                <View style={{ padding: 10 }}>
                    <View style={{ flexDirection: 'row-reverse', width: '100%' }}>
                        <Text style={{ flex: 1, fontSize: fontSize.normal, fontFamily: fonts.BYekan, fontSize: fontSize.small, color: colors.blue, textAlign: 'right', color: colors.red }}>توجه : </Text>
                        <Text style={{ flex: 5, fontSize: fontSize.normal, fontFamily: fonts.BYekan, fontSize: fontSize.small, color: colors.blue, justifyContent: 'center', color: colors.textPrimary }}>
                            {parseInt(UserTransactionInfo[0].Remain) == 0 && UserTransactionInfo[0].IsPaymentEnabled ? 'در حال حاظر به دلیل صفر بودن سهم بازاریابی امکان برداشت پول وجود ندارد' : (parseInt(UserTransactionInfo[0].Remain) > 0 && UserTransactionInfo[0].IsPaymentEnabled == false ? 'شما یک درخواست برداشت در حال بررسی دارید , پس از تایید می توانید درخواست خود را ثبت نمایید' : '')}
                        </Text>
                    </View>
                </View>
            )
        }
    }
    renderIntroducerInfo() {
        return (
            <View>
                {this.renderMarketerInfo()}
                {this.renderMarketingInfo()}
            </View >
        )
    }
    renderMessages() {
        return (
            <View><Text>3</Text></View>
        )
    }

    renderError() {
        return (
            <View><Text>5</Text></View>
        )
    }
    renderProfileMenu() {
        return (
            this.state.ProfileMenu.map((item, index) => {
                return (
                    <TouchableOpacity style={{ flex: 1, height: '100%', position: 'relative', alignItems: 'center', justifyContent: 'center', borderBottomWidth: 3, borderBottomColor: item.TabName == this.state.SelectedTab ? colors.purple : 'transparent' }} key={index} onPress={() => { this.setTab(item.TabName) }}>
                        <View style={{ alignItems: 'center' }}>
                            {item.iconType ?
                                <SimpleLineIcons
                                    allowFontScaling={false}
                                    name={item.IconName} style={{ color: item.TabName == this.state.SelectedTab ? colors.purple : '#a8a8a8', fontSize: fontSize.small }} /> :

                                <Icon
                                    allowFontScaling={false}
                                    name={item.IconName} style={{ color: item.TabName == this.state.SelectedTab ? colors.purple : '#a8a8a8', fontSize: fontSize.small }} />}
                            <Text
                                allowFontScaling={false}
                                style={{ fontFamily: fonts.BYekan, fontSize: fontSize.small, textAlign: 'center' }}>{item.TabTitle}</Text>
                        </View>
                    </TouchableOpacity>
                )
            })
        )
    }
    render() {
        return (
            <ScrollView style={{ display: 'flex', flex: 1, backgroundColor: '#fff', position: 'relative' }}>
                <View style={{ backgroundColor: colors.purple, padding: deviceHeight * 0.02 }}>
                    <View style={{ height: 85, width: 85, alignSelf: 'center', overflow: 'hidden', marginBottom: 5, borderWidth: 2, borderColor: '#fff', borderRadius: 42.5, backgroundColor: '#fff' }}>
                        <Image source={User.ProfileImage ? ({ uri: `https://cheegel.com/apis/Handlers/FileHandler.ashx?type=2&id=${User.ProfileImage}` }) : (require('../../assets/images/guest-64.png'))} style={{ flex: 1, width: null, height: null, resizeMode: 'contain' }} />
                    </View>
                    <View style={{ flexDirection: 'row-reverse', paddingTop: 10, justifyContent: 'center' }}>
                        <Text
                            allowFontScaling={false}
                            style={{ color: 'white', fontFamily: fonts.BYekan, fontSize: fontSize.normal }}>اعتبار باقی مانده در چی دیلی : </Text>
                        <Text
                            allowFontScaling={false}
                            style={{ color: 'white', fontFamily: fonts.BYekan, fontSize: fontSize.normal }}>{Math.ceil(parseInt(this.state.userCreditRemain) / 10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                        <Text
                            allowFontScaling={false}
                            style={{ color: 'white', fontFamily: fonts.BYekan, fontSize: fontSize.normal }}>تومان</Text>
                    </View>
                    <Text style={[styles.fontFamily, { fontSize: fontSize.normal, textAlign: 'center', color: '#fff' }]}>{User.FullName}</Text>
                </View>
                <View style={{ flexDirection: 'row-reverse', height: deviceHeight * 0.1 }}>
                    {this.renderProfileMenu()}
                </View>
                <View style={{ paddingBottom: deviceHeight * 0.1 }}>
                    {this.renderProfileTab()}

                </View>
            </ScrollView>
        )
    }
}
const mapStateToProps = state => {
    return {
        user: state.initial.user,
        routeList: state.initial.routeList,
        deviceDimensions: state.initial.deviceDimensions,
        ...state.navigation.routes.filter(x => x.params.active)[0].params
    }
}

export default connect(mapStateToProps, { setFooterVisibility, setDarkFooter, updateRouteList, updateUser })(Profile)