import React, { Component } from 'react';
import {
    View,
    AsyncStorage,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    ToastAndroid,
    BackHandler,
    KeyboardAvoidingView
} from 'react-native';
import { CustomeTextInput, CustomeButton } from '../common/CustomeInputs';
import Captcha from '../common/Captcha';
import styles, { colors, fontSize } from '../../styles';
import { connect } from 'react-redux';
import { Button } from 'react-native-elements';
import { setFooterVisibility, setDarkFooter, updateUserLogin, updateUser, updateRouteList } from '../../actions';
import {
    consts, login, isUserLogin, isCaptchaRequired,
    getUserRolesByUserName, validateEnglishCharacter, backAndroid, userNameValidation, passwordValidation
} from '../../utility'
import { screenNames, deviceHeight } from '../../utility/consts';
class Login extends Component {
    static navigationOptions = () => ({
        header: null
    })
    constructor(props) {
        super(props)
        this.state = {
            UserName: '',
            Password: '',
            Captcha: '',
            counter: 0,
            IsCaptchaRequired: false,
            UserNameError: false,
            PasswordError: false,
            loading: false,
            IsUserLoggedIn: false
        }




    }
    componentDidMount() {
        //isUserLogin().then(data => {
        // if (data) {
        //     this.setState({ IsUserLoggedIn: true });
        //     this.props.navigation.navigate(screenNames.PROFILE)
        // }
        // else {
        //this.setState({ IsUserLoggedIn: false });
        isCaptchaRequired().then(result => {
            this.setState({ IsCaptchaRequired: result })
        })
        //}
        //})
    }
    handleinput(type, value) {
        switch (type) {
            case "UserName":
                if (value == null) {
                    this.setState({ UserName: value, UserNameError: true, PasswordError: false })
                    ToastAndroid.showWithGravity('نام کاربری وارد نشده است', ToastAndroid.SHORT, ToastAndroid.CENTER);
                }
                else if (userNameValidation(value) == null && value != '')
                    ToastAndroid.showWithGravity('حروف مجاز برای نام کاربری فقط حروف انگلیسی و اعداد میباشند', ToastAndroid.SHORT, ToastAndroid.CENTER);
                else
                    this.setState({ UserName: value, UserNameError: false, PasswordError: false })
                break;
            case "Password":
                if (value == null) {
                    this.setState({ Password: value, UserNameError: false, PasswordError: true })
                    ToastAndroid.showWithGravity('رمز عبور را وارد نمایید', ToastAndroid.SHORT, ToastAndroid.CENTER);
                }
                else if (passwordValidation(value) == null && value != '')
                    ToastAndroid.showWithGravity('لطفا از کارکتر های مجاز برای رمز عبور استفاده نمایید', ToastAndroid.SHORT, ToastAndroid.CENTER);
                else
                    this.setState({ Password: value, UserNameError: false, PasswordError: false })
                break;
            case "Captcha":
                if (value == null) {
                    this.setState({ Captcha: value, CaptchaError: true })
                    ToastAndroid.showWithGravity('کلمه امنیتی را وارد نمایید', ToastAndroid.SHORT, ToastAndroid.CENTER);
                }
                else if (validateEnglishCharacter(value) == null)
                    ToastAndroid.showWithGravity('کیبورد خود را در حالت انگلیسی قرار دهید', ToastAndroid.SHORT, ToastAndroid.CENTER);
                else
                    this.setState({ Captcha: value, CaptchaError: false })
                break;
            default:
                break;
        }
    }

    checkUserInfo() {
        this.setState({ loading: true })
        if (this.state.UserName && this.state.Password && (!this.state.IsCaptchaRequired || this.state.Captcha)) {
            login(this.state.UserName, this.state.Password, this.state.Captcha).then(result => {
                this.setState({ counter: this.state.counter + 1, Captcha: '' })
                if (result.IsValid && result.IsActive) {
                    var User = result;
                    if (!User.UserName)
                        User.UserName = this.state.UserName
                    getUserRolesByUserName(this.state.UserName).then(result => {
                        User.Roles = result.map(x => x.RoleName)
                        AsyncStorage.setItem(consts.userStorage, JSON.stringify(User)).then(() => {
                            this.props.updateUser(User)
                            this.props.updateUserLogin(true)
                            ToastAndroid.show('با موفقیت وارد شدید.', ToastAndroid.LONG);
                            this.setState({ loading: false })
                            this.props.navigation.navigate(screenNames.CMS)
                        })
                    })
                }
                else {
                    this.setState({ loading: false })
                    isCaptchaRequired().then(result => {
                        this.setState({ IsCaptchaRequired: result })
                    })
                    switch (result.Message) {
                        case "EmptyCaptcha":
                            this.setState({ CaptchaError: true })
                            ToastAndroid.showWithGravity('کد امنیتی وارد شده صحیح نمیباشد', ToastAndroid.LONG, ToastAndroid.CENTER);
                            break;
                        case "WrongCaptcha":
                            this.setState({ CaptchaError: true })
                            ToastAndroid.showWithGravity('کد امنیتی وارد شده صحیح نمیباشد', ToastAndroid.LONG, ToastAndroid.CENTER);
                            break;
                        case "Login_Alert_1":
                        case "LoginUserWrongUserNamePassword":
                            ToastAndroid.showWithGravity('نام کاربری یا کلمه عبور اشتباه می باشد', ToastAndroid.LONG, ToastAndroid.CENTER);
                            this.setState({ UserNameError: true, PasswordError: true })
                            break;
                        case "LoginSupplierUserIsNotApprove":
                            ToastAndroid.showWithGravity('کاربر محترم وضعیت کاربری شما در حال بررسی است برای اطلاعات بیشتر با شماره های موجود در منوی درباره ما تماس حاصل فرمایید', ToastAndroid.LONG, ToastAndroid.CENTER);
                            break;
                        case "LoginUserIsNotActive":
                            ToastAndroid.showWithGravity('کاربر محترم وضعیت کاربری شما غیر فعال شده است برای اطلاعات بیشتر با شماره های موجود در منوی درباره ما تماس حاصل فرمایید', ToastAndroid.LONG, ToastAndroid.CENTER);
                            break;
                        case "UserPasswordEmptyError":
                            ToastAndroid.showWithGravity('برای ورود وارد نمودن نام کاربری و رمز عبور الزامی می باشد', ToastAndroid.LONG, ToastAndroid.CENTER);
                            this.setState({ UserNameError: true, PasswordError: true })
                            break;
                        default:
                            break;
                    }
                }
            })
        }
        else {
            this.setState({ loading: false })
            if (this.state.UserNameError == false && this.state.PasswordError == false) {
                ToastAndroid.showWithGravity('برای ورود وارد نمودن نام کاربری و رمز عبور الزامی می باشد', ToastAndroid.LONG, ToastAndroid.BOTTOM);
                this.setState({ UserNameError: true, PasswordError: true })
            }
        }
    }

    signUp() {
        this.props.navigation.navigate(screenNames.SIGN_UP)
    }
    render() {
        if (this.state.IsUserLoggedIn == false) {
            return (
                <View style={{ flex: 1, backgroundColor: colors.purple, position: 'relative', }}>
                    <ScrollView contentContainerStyle={{ flexGrow: 2, paddingTop: 4 }} keyboardShouldPersistTaps={'always'}>
                        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled>
                            <View style={{ paddingTop: 24, height: 125, width: 125, alignSelf: 'center', overflow: 'hidden' }}>
                                <Image source={require('../../assets/images/Chidaily.png')} style={{ flex: 1, width: null, height: null, resizeMode: 'contain' }} />
                            </View>
                            <View style={{ flex: 1, paddingTop: deviceHeight * 0.1 }}>
                                <CustomeTextInput
                                    placeholder="نام کاربری/ایمیل"
                                    value={this.state.UserName}
                                    hasError={this.state.UserNameError}
                                    onChangeText={(Value) => this.handleinput("UserName", Value)}
                                    isLeftAlign={true}
                                    color='white'
                                    fontSize={fontSize.normal}
                                ></CustomeTextInput>
                                <CustomeTextInput
                                    placeholder="رمز عبور"
                                    value={this.state.Password}
                                    hasError={this.state.PasswordError}
                                    autoCapitalize='none'
                                    onChangeText={(Value) => this.handleinput("Password", Value)}
                                    secureTextEntry={true}
                                    isLeftAlign={true}
                                    color='white'
                                    fontSize={fontSize.normal}
                                ></CustomeTextInput>
                                {this.state.IsCaptchaRequired && <Captcha
                                    value={this.state.Captcha}
                                    counter={this.state.counter}
                                    hasError={this.state.CaptchaError}
                                    onChangeText={(Value) => this.handleinput("Captcha", Value)} />}
                                <CustomeButton
                                    title="ورود"
                                    onPress={() => this.checkUserInfo()}
                                    loading={this.state.loading}
                                    backgroundColor='white'
                                    color={colors.purple}
                                    fontSize={fontSize.normal}
                                    marginTop={deviceHeight * 0.045}
                                ></CustomeButton>
                                <TouchableOpacity onPress={() => this.signUp()} style={{ paddingVertical: 16, display: 'flex', flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={[styles.fontFamily, { fontSize: fontSize.small, color: 'white' }]}>در صورت نداشتن حساب کاربری </Text>
                                    <Text style={[styles.fontFamily, { fontSize: fontSize.normal, color: 'white', textDecorationLine: "underline", paddingHorizontal: 8 }]}>ثبت نام</Text>
                                    <Text style={[styles.fontFamily, { fontSize: fontSize.small, color: 'white' }]}> فرمایید</Text>
                                </TouchableOpacity>
                            </View>
                        </KeyboardAvoidingView>
                    </ScrollView>
                </View>
            )
        }
        else {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size={56} />
                </View>
            )
        }
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

export default connect(mapStateToProps, { setFooterVisibility, setDarkFooter, updateUserLogin, updateUser, updateRouteList })(Login)