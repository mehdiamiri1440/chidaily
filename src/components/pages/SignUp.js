import React, { Component } from 'react';
import {
    View,
    Image,
    ScrollView,
    AsyncStorage,
    ToastAndroid,
    Text,
    ActivityIndicator,
    BackHandler,
    TouchableOpacity,
    KeyboardAvoidingView
} from 'react-native';
import { CustomeTextInput, CustomeButton } from '../common/CustomeInputs';
import Captcha, { RegenrateCaptcha } from '../common/Captcha';
import styles, { colors, fontSize, fonts } from '../../styles';
import { connect } from 'react-redux';
import { Button } from 'react-native-elements';
import { setFooterVisibility, setDarkFooter, updateUser, updateUserLogin, updateRouteList } from '../../actions';
import {
    consts, login, getUserRolesByUserName, isCaptchaRequired,
    validateEnglishCharacter, backAndroid, validateMobileNumber, numberValidation, userNameValidation, passwordValidation
} from '../../utility';
import { screenNames, deviceHeight, apiServer } from '../../utility/consts';
class SignUp extends Component {
    static navigationOptions = () => ({
        header: null
    })
    constructor(props) {
        super(props)
        this.state = {
            FirstName: '',
            LastName: '',
            UserName: '',
            Phone: '',
            IntroducerCode: '',
            Password: '',
            Captcha: '',
            IsCaptchaRequired: false,
            FirstNameError: false,
            LastNameError: false,
            UserNameError: false,
            PhoneError: false,
            IntroducerError: false,
            PasswordError: false,
            CaptchaError: false,
            countryList: [],
            counter: 0,
            loading: false,
            IsValidIntroducerCode: false,
            IntroducerInfo: '',
            IsShowIntroducerInfo: false
        }




    }
    handleFirstName = (text) => {
        this.setState({ FirstName: text, FirstNameError: false })
    }
    handleLastName = (text) => {
        this.setState({ LastName: text, LastNameError: false })
    }
    handleUserName = (text) => {
        if (text && userNameValidation(text) == null)
            ToastAndroid.showWithGravity('حروف مجاز برای نام کاربری فقط حروف انگلیسی و اعداد میباشند', ToastAndroid.SHORT, ToastAndroid.CENTER);
        else
            this.setState({ UserName: text.replace(/ /g, ''), UserNameError: false })
    }
    handlePhone = (text) => {
        this.setState({ Phone: numberValidation(text), PhoneError: false })
    }
    handleIntroducer = (text) => {
        this.setState({ IntroducerCode: text, IntroducerError: false })
        if (text == '' || text == null)
            this.setState({ IntroducerInfo: null, IsValidIntroducerCode: false, IsShowIntroducerInfo: false });
    }
    handlePassword = (text) => {
        if (text && passwordValidation(text) == null)
            ToastAndroid.showWithGravity('لطفا از کارکتر های مجاز برای رمز عبور استفاده نمایید', ToastAndroid.SHORT, ToastAndroid.CENTER);
        else
            this.setState({ Password: text, PasswordError: false })
    }
    handleCaptcha = (text) => {
        this.setState({ Captcha: text, CaptchaError: false })
    }
    validateIntroducer = () => {
        if (this.state.IntroducerCode) {
            fetch(apiServer + 'api/user/CheckUserReagentCode/' + this.state.IntroducerCode, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                }
            }).then(res => {
                res.text().then(x => {
                    let introducerResult = JSON.parse(x)[0];
                    if (introducerResult.HasExists == false) {
                        this.setState({ IntroducerInfo: null, IsValidIntroducerCode: false, IsShowIntroducerInfo: false });
                        ToastAndroid.showWithGravity('کد معرف وارد شده صحیح نمی باشد',
                            ToastAndroid.SHORT,
                            ToastAndroid.CENTER);
                    }
                    else {
                        this.setState({ IntroducerInfo: "معرف شما : " + introducerResult.FirstName + " " + introducerResult.LastName, IsValidIntroducerCode: true, IsShowIntroducerInfo: true });
                        ToastAndroid.showWithGravity("کد معرف صحیح می باشد",
                            ToastAndroid.SHORT,
                            ToastAndroid.CENTER);
                    }

                })
            }).catch(err => {
                this.setState({ IntroducerInfo: null, IsValidIntroducerCode: false, IsShowIntroducerInfo: false });
            })
        }
    }
    checkUserInfo() {
        if (!this.state.FirstName)
            this.setState({ FirstNameError: true })
        if (!this.state.LastName)
            this.setState({ LastNameError: true })
        if (!this.state.Phone)
            this.setState({ PhoneError: true })
        else if (validateMobileNumber(this.state.Phone).length == 0) {
            this.setState({ PhoneError: true })
            ToastAndroid.showWithGravity('شماره تلفن وارد شده معتبر نمیابشد', ToastAndroid.SHORT, ToastAndroid.CENTER);
        }
        if (!this.state.UserName)
            this.setState({ UserNameError: true })
        else if (userNameValidation(this.state.UserName) == null && value != '') {
            this.setState({ UserNameError: true })
            ToastAndroid.showWithGravity('حروف مجاز برای نام کاربری فقط حروف انگلیسی و اعداد میباشند', ToastAndroid.SHORT, ToastAndroid.CENTER);
        }
        else if (this.state.UserName.toString().length < 6) {
            this.setState({ UserNameError: true })
            ToastAndroid.showWithGravity('نام کاربری حداقل باید 6 کاراکتر باشد', ToastAndroid.SHORT, ToastAndroid.CENTER);
        }
        if (!this.state.Password)
            this.setState({ PasswordError: true })
        else if (passwordValidation(this.state.Password) == null && value != '') {
            this.setState({ PasswordError: true })
            ToastAndroid.showWithGravity('لطفا از کارکتر های مجاز برای رمز عبور استفاده نمایید', ToastAndroid.SHORT, ToastAndroid.CENTER);
        }
        else if (this.state.Password.toString().length < 6 || this.state.Password.toString().length > 15) {
            this.setState({ PasswordError: true })
            ToastAndroid.showWithGravity('رمز عبور شما باید بین 6 تا 15 کاراکتر باشد', ToastAndroid.SHORT, ToastAndroid.CENTER);
        }
        if (!this.state.Captcha)
            this.setState({ CaptchaError: true })
        if (this.state.FirstName &&
            this.state.LastName &&
            this.state.Phone &&
            validateMobileNumber(this.state.Phone).length > 0 &&
            this.state.UserName &&
            this.state.UserName.toString().length > 5 &&
            this.state.Password &&
            this.state.Password.toString().length > 5 &&
            this.state.Password.toString().length < 16 &&
            this.state.Captcha) {
            this.setState({ loading: true });
            this.signUp().then(result => {
                this.setState({ counter: this.state.counter + 1, Captcha: '' })
                if (result.ID == 0) {
                    switch (result.ErrorMessage) {
                        case "WrongCaptcha":
                            this.setState({ CaptchaError: true })
                            ToastAndroid.showWithGravity('کد امنیتی وارد شده صحیح نمیباشد',
                                ToastAndroid.LONG,
                                ToastAndroid.CENTER);
                            break;
                        case "UserPasswordValidationError":
                            this.setState({ PasswordError: true })
                            ToastAndroid.showWithGravity('رمز عبور شما باید بین 6 تا 15 کاراکتر باشد',
                                ToastAndroid.LONG,
                                ToastAndroid.CENTER);
                            break;
                        case "UserPasswordEmptyError":
                            this.setState({ PasswordError: true })
                            ToastAndroid.showWithGravity('رمز عبور شما خالی میباشد',
                                ToastAndroid.LONG,
                                ToastAndroid.CENTER);
                            break;
                        case "UserNameDuplicateError|":
                            this.setState({ UserNameError: true })
                            ToastAndroid.showWithGravity('نام کاربری تکراری است',
                                ToastAndroid.LONG,
                                ToastAndroid.CENTER);
                            break;
                        case "UserNameDuplicateError|EmailDuplicateError|":
                            this.setState({ UserNameError: true })
                            ToastAndroid.showWithGravity('نام کاربری و پست الکترونیک تکراری می باشد',
                                ToastAndroid.LONG,
                                ToastAndroid.CENTER);
                            break;
                        case "TelFormatValidationError":
                            this.setState({ PhoneError: true })
                            ToastAndroid.showWithGravity('فرمت شماره همراه شما اشتباه می باشد',
                                ToastAndroid.LONG,
                                ToastAndroid.CENTER);
                            break;
                        case "TelLengthValidationError":
                            this.setState({ PhoneError: true })
                            ToastAndroid.showWithGravity('شماره همراه نمی تواند کمتر از 10 و بیشتر از 15 عدد باشد',
                                ToastAndroid.LONG,
                                ToastAndroid.CENTER);
                            break;
                        default:
                            ToastAndroid.showWithGravity('خطا در اطلاعات ورودی',
                                ToastAndroid.LONG,
                                ToastAndroid.CENTER);
                            break;
                    }
                    this.setState({ loading: false })
                }
                else if (result.ID == 1) {
                    login(this.state.UserName, this.state.Password, this.state.Captcha).then((resultUser) => {
                        var User = resultUser;
                        getUserRolesByUserName(this.state.UserName).then(rolesResult => {
                            User.Roles = rolesResult.map(x => x.RoleName)

                            AsyncStorage.setItem(consts.userStorage, JSON.stringify(User)).then(() => {
                                this.props.updateUser(User)
                                this.props.updateUserLogin(true)
                                ToastAndroid.show('ثبت نام شما با موفقیت انجام گردید.', ToastAndroid.LONG)
                                this.setState({ loading: false })
                                this.props.navigation.navigate(screenNames.CMS)
                            })
                        })
                    })
                }
            })
        }
    }
    signUp() {
        return new Promise((fullFill, eject) => {
            fetch(`https://www.cheegel.com/apis/api/user/SignUp`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json; charset=utf-8',
                    'Content-Type': 'application/json; charset=utf-8',
                },
                body: JSON.stringify({
                    myUser: {
                        FirstName: this.state.FirstName,
                        LastName: this.state.LastName,
                        UserName: this.state.UserName,
                        Password: this.state.Password,
                        Email: this.state.UserName + "@cheegel.com",
                    },
                    Captcha: this.state.Captcha,
                    CountryCode: '98',
                    UserTel: validateMobileNumber(this.state.Phone)[0],
                    UserReagentCode: this.state.IntroducerCode && this.state.IntroducerCode != '' && this.state.IsValidIntroducerCode ? this.state.IntroducerCode : '',
                    IntroductionMethodID: ''
                })
            }).then(response => {
                response.text().then(result => {
                    fullFill(JSON.parse(result))
                })
            })
        })
    }
    renderIntroducerInfo() {
        if (this.state.IsShowIntroducerInfo) {
            return (
                <View style={{ width: "100%", flexDirection: 'row-reverse', alignItems: 'center', paddingVertical: 10 }}>
                    <Text style={{ flex: 3, fontSize: fontSize.small, fontFamily: fonts.BYekan, color: colors.blue, textAlign: 'center', color: '#FFF', alignSelf: 'center' }}>
                        {this.state.IntroducerInfo}
                    </Text>
                    <TouchableOpacity style={{ flex: 2, alignSelf: 'center' }} onPress={() => { this.setState({ IntroducerCode: '', IsValidIntroducerCode: false, IntroducerInfo: null, IsShowIntroducerInfo: false }) }}>
                        <Text style={{ flex: 3, fontSize: fontSize.small, fontFamily: fonts.BYekan, color: colors.blue, textAlign: 'center', color: colors.red, alignSelf: 'center' }}>
                            حذف معرف
                    </Text>
                    </TouchableOpacity>
                </View>
            )
        }
        else
            return <Text></Text>
    }
    render() {
        return (
            <View style={{ display: 'flex', flex: 1, position: 'relative', backgroundColor: colors.purple, }}>
                <ScrollView
                    contentContainerStyle={{ flexGrow: 2, paddingTop: deviceHeight * 0.1, paddingBottom: deviceHeight * 0.2 }}
                    keyboardShouldPersistTaps={'always'}>
                    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled>
                        <View style={{ height: 125, width: 125, alignSelf: 'center', overflow: 'hidden' }}>
                            <Image source={require('../../assets/images/Chidaily.png')} style={{ flex: 1, width: null, height: null, resizeMode: 'contain' }} />
                        </View>
                        <View style={{ flex: 1, paddingTop: deviceHeight * 0.1 }}>
                            <CustomeTextInput
                                placeholder="نام"
                                value={this.state.FirstName}
                                hasError={this.state.FirstNameError}
                                onChangeText={this.handleFirstName}
                                color='white'
                                fontSize={fontSize.normal}
                            ></CustomeTextInput>
                            <CustomeTextInput
                                placeholder="نام خانوادگی"
                                value={this.state.LastName}
                                hasError={this.state.LastNameError}
                                onChangeText={this.handleLastName}
                                color='white'
                                fontSize={fontSize.normal}
                            ></CustomeTextInput>
                            <CustomeTextInput
                                placeholder="نام کاربری"
                                value={this.state.UserName}
                                hasError={this.state.UserNameError}
                                isLeftAlign={true}
                                onChangeText={this.handleUserName}
                                color='white'
                                fontSize={fontSize.normal}
                            ></CustomeTextInput>
                            <CustomeTextInput
                                placeholder="رمز عبور"
                                value={this.state.Password}
                                hasError={this.state.PasswordError}
                                isLeftAlign={true}
                                onChangeText={this.handlePassword}
                                autoCapitalize='none'
                                secureTextEntry={true}
                                color='white'
                                fontSize={fontSize.normal}
                            ></CustomeTextInput>
                            <CustomeTextInput
                                keyboardType='phone-pad'
                                placeholder="موبایل"
                                value={this.state.Phone}
                                hasError={this.state.PhoneError}
                                isLeftAlign={true}
                                onChangeText={this.handlePhone}
                                color='white'
                                fontSize={fontSize.normal}
                            ></CustomeTextInput>
                            <CustomeTextInput
                                placeholder="کد معرف ( پرد کردن این مورد اختیاری است )"
                                value={this.state.IntroducerCode}
                                hasError={this.state.IntroducerError}
                                isLeftAlign={true}
                                onChangeText={this.handleIntroducer}
                                onBlur={() => { this.validateIntroducer() }}
                                color='white'
                                fontSize={fontSize.normal}
                            ></CustomeTextInput>
                            {this.renderIntroducerInfo()}
                            <Captcha
                                value={this.state.Captcha}
                                counter={this.state.counter}
                                hasError={this.state.CaptchaError}
                                onChangeText={this.handleCaptcha}>
                            </Captcha>
                            <CustomeButton
                                title="ثبت نام"
                                onPress={() => this.checkUserInfo()}
                                loading={this.state.loading}
                                backgroundColor='white'
                                color={colors.purple}
                                fontSize={fontSize.normal}
                                marginTop={deviceHeight * 0.045}
                            ></CustomeButton>
                        </View>
                    </KeyboardAvoidingView>
                </ScrollView>
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
export default connect(mapStateToProps, { setFooterVisibility, setDarkFooter, updateUser, updateUserLogin, updateRouteList })(SignUp)