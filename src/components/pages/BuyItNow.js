import React, { Component } from 'react';
import {
    Platform,
    ToastAndroid,
    View,
    Alert,
    AsyncStorage,
    Image,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    StatusBar, Animated,
    ActivityIndicator,
    Picker,
    BackHandler,
    Linking,
    WebView,
    KeyboardAvoidingView,
    Switch
} from 'react-native';
import { connect } from 'react-redux';
import { CardItem, Card, Input, InputGroup, Icon, Radio, CheckBox } from 'native-base'
import styles, { fonts, colors, fontSize } from '../../styles';
import { Button } from 'react-native-elements';
import { Modal, TouchableHighlight, FlatList } from 'react-native';
import { PlusButton } from '../common/PlusButton'
import CustomPicker from '../common/CustomPicker';
import { updateBasketCount, setFooterVisibility, setDarkFooter, updateRouteList } from '../../actions';
import { consts, dateFormat, dateFormatTemplate, getBasketCount, validateMobileNumber, validateEnglishCharacter, backAndroid, clearBasket, getCitiesList, convertMiladiToShamsi, getBasketItems } from '../../utility';
import Header from '../common/Header';
import { screenNames, deviceWidth, deviceHeight, apiServer, nodeApiServer } from '../../utility/consts';
let getDiscounyCode = null;
const list = [];

class BuyItNow extends Component {
    static navigationOptions = ({ navigation }) => ({
        header: <Header title='ثبت سفارش' navigation={navigation} />
    })
    constructor(props) {
        super(props)
        this.state = {
            FirstName: '',
            LastName: '',
            Phone: '',
            LanguageCulture: 'FA',
            PaymentTypeCode: 5,
            MoneyUnitName: 'IRR',
            Code: this.props.detailCode,
            Count: 1,
            DiscountCode: null,
            UserOrderMasterID: this.props.masterCode,
            IsVerification: false,
            UserID: null,
            MasterCode: this.props.masterCode,
            Description: null,
            IsMobileApp: true,
            isBuyItNowClicked: false,
            IsCheckDiscountCode: false,
            IntroducerInfo: "",
            modalVisible: false,
            ProductServiceMasterCode: this.props.masterCode,
            CityID: 0,
            Cities: [],
            basketTotalPrice: 0,
            basketTotalShippingPrice: 0,
            basketOriginalShippingPrice: 0,
            basketTotalPriceWithShipping: 0,
            basketTotalPriceWithoutShipping: 0,
            discountPercent: 0,
            CorrectDiscountCode: null,
            loading: true,
            modalPickerCity: false,
            userCreditRemain: 0,
            shippingRateError: false,
            deliveryDate: '',
            IsCOD: false,
            CheegelExtraPrice: 0,
            BasketTotalOriginalPrice: 0,
            IsCreditPayment: false,
            CreditPaymentCode: 0
        }
        getDiscounyCode = '';


    }
    componentDidMount() {
        fetch('http://www.cheegel.com/apis/api/user/GetUserCredit/1', {
            method: 'GET',
            headers: {
                'Accept': 'application/json; charset=utf-8',
                'Content-Type': 'application/json; charset=utf-8',
            }
        }).then(response => response.json().then(result => {
            Linking.addEventListener('url', e => this.handleOpenURL(e, this));
            this.getUserInformation(null);
            getCitiesList().then(response => {
                this.setState({ CityID: response[0].ID, Cities: response });
                this.calcCatalogPrice(this.props.masterCode, response[0].ID);
                this.setState({ userCreditRemain: Math.ceil(result.Table[0].CreditValue) });
            });
        }));
    }
    handleContentSizeChange = ({ nativeEvent }) => {
        const { height } = nativeEvent.contentSize
        this.setState({
            inputHeight: height > fontSize.large ? fontSize.large : height
        })
    }
    creaditPayment = () => {
        let getIsCredit = this.state.IsCreditPayment;
        this.setState({ IsCreditPayment: !getIsCredit });
        if (this.state.PaymentTypeCode == 5 && !getIsCredit)
            this.setState({ CreditPaymentCode: 6 });
        else if (this.state.PaymentTypeCode == 2 && !getIsCredit)
            this.setState({ CreditPaymentCode: 7 });
        else
            this.setState({ CreditPaymentCode: 0 });
    }
    renderCreditRemain() {
        if (parseInt(this.state.userCreditRemain) > 0) {
            return (
                <View style={{ flexDirection: 'row-reverse' }}>
                    <Text
                        allowFontScaling={false}
                        style={{ fontFamily: fonts.BYekan, fontSize: fontSize.small }}>اعتبار باقی مانده شما در چی دیلی : </Text>
                    <Text
                        allowFontScaling={false}
                        style={{ fontFamily: fonts.BYekan, fontSize: fontSize.small, color: colors.primary }}>{Math.ceil(parseInt(this.state.userCreditRemain) / 10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} تومان</Text>
                </View>
            )
        }
    }
    renderUserCredit() {
        return (
            <View style={{ paddingVertical: 8 }}>
                {this.renderCreditRemain()}
                <View style={{ flexDirection: 'row-reverse' }}>
                    <Text
                        allowFontScaling={false}
                        style={{ fontFamily: fonts.BYekan }}>استفاده از اعتبار در صورت وجود داشتن</Text>
                    <Switch value={this.state.IsCreditPayment} onValueChange={this.creaditPayment} />
                </View>
            </View>
        )
    }
    handleOpenURL(event, that) {
        AsyncStorage.getItem("BasketTrackingCode").then(trackingCode => {
            AsyncStorage.getItem(consts.userStorage).then(user => {
                getBasketItems().then(bsketItems => {
                    let userInfo = JSON.parse(user);
                    const route = event.url.replace(/.*?:\/\//g, '');
                    if (route.toString().split('/')[1] == "0") {
                        AsyncStorage.removeItem("BasketSupplierID").then(() => {
                            AsyncStorage.removeItem("BasketTrackingCode");
                            this.props.navigation.navigate(screenNames.PRODUCT_GALLERY)
                        });
                    }
                    else if (route.toString().split('/')[1] == "1") {
                        AsyncStorage.getItem("BasketSupplierID").then(supplierId => {
                            clearBasket(supplierId, false).then(d => {
                                AsyncStorage.removeItem("BasketSupplierID").then(() => {
                                    AsyncStorage.removeItem("BasketTrackingCode");
                                    if (d && d.length > 0) {
                                        this.props.updateBasketCount(d.length);
                                        this.props.navigation.navigate(screenNames.PRODUCT_GALLERY, {})
                                    }
                                    else {
                                        this.props.updateBasketCount(0);
                                        this.props.navigation.navigate(screenNames.PRODUCT_GALLERY, {})
                                    }
                                });
                            });
                        });
                    }
                });
            });
        });
    }
    getUserInformation(param) {
        try {
            fetch(apiServer + 'api/shoppingBasket/GetUserInformationForSimpleBasket/' + (param == null ? null : param), {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                }
            }).then(res => {
                res.text().then(x => {
                    if (x) {
                        let info = JSON.parse(x);
                        if (info.Table && info.Table.length) {
                            if (param)
                                info.Table[0].PhoneNumber = param
                            this.setState({ FirstName: info.Table[0].FirstName, LastName: info.Table[0].LastName, Phone: info.Table[0].PhoneNumber });
                        }
                    }
                })
            }).catch(err => {

            });
        }
        catch (e) {

        }
    }
    // comment for test 
    calcCatalogPrice = (masterCode, cityId) => {
        fetch(nodeApiServer + 'simplebasketshippingandprice/' + masterCode + '/' + cityId, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(res => {
            this.setState({ loading: false });
            res.text().then(x => {
                let info = JSON.parse(x);
                if (info[2] == 0)
                    this.setState({
                        BasketTotalOriginalPrice: parseInt(info[0]),
                        basketTotalPrice: parseInt(info[0]),
                        basketTotalShippingPrice: parseInt(info[1]),
                        basketOriginalShippingPrice: parseInt(info[1]),
                        basketTotalPriceWithShipping: parseInt(info[0]) + parseInt(info[1]),
                        shippingRateError: info[2] == 1 ? true : false,
                        deliveryDate: convertMiladiToShamsi(info[3], dateFormat.longFormat), IsCOD: info[4] == 1 ? true : false,
                        PaymentTypeCode: info[4] == 1 ? 5 : 2,
                        CheegelExtraPrice: parseInt(info[5])
                    });
                else
                    ToastAndroid.showWithGravity('امکان خرید برای شهر انتخابی شما وجود ندارد',
                        ToastAndroid.LONG,
                        ToastAndroid.CENTER);
            })
        }).catch(err => {
            this.setState({ loading: false });
        });
    }
    CheckUserReagentCode = () => {
        if (this.state.DiscountCode && this.state.DiscountCode.toString().length > 0) {
            getDiscounyCode = this.state.DiscountCode;
            this.setState({ IsCheckDiscountCode: true });
            fetch(apiServer + 'api/user/CheckUserReagentCode/' + getDiscounyCode, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                }
            }).then(res => {
                this.setState({ IsCheckDiscountCode: false });
                res.text().then(x => {
                    console.warn(JSON.parse(x));
                    let introducerResult = JSON.parse(x)[0];
                    if (introducerResult.HasExists == false) {
                        ToastAndroid.showWithGravity('کد معرف وارد شده صحیح نمی باشد',
                            ToastAndroid.SHORT,
                            ToastAndroid.CENTER);
                    }
                    else {
                        if (introducerResult.DiscountPercent > 0) {
                            let getBasketTotalPrice = this.state.basketTotalPriceWithoutShipping == 0 ? this.state.basketTotalPrice : this.state.basketTotalPriceWithoutShipping;
                            let shippingPrice = this.state.basketTotalShippingPrice;
                            getBasketTotalPrice = getBasketTotalPrice - (getBasketTotalPrice * (introducerResult.DiscountPercent / 100));
                            this.setState({ discountPercent: introducerResult.DiscountPercent, basketTotalPriceWithShipping: getBasketTotalPrice + shippingPrice, CorrectDiscountCode: getDiscounyCode, DiscountCode: null });
                        }
                        else
                            this.setState({ CorrectDiscountCode: getDiscounyCode, DiscountCode: null });

                        this.setModalVisible(!this.state.modalVisible);
                        this.setState({ IntroducerInfo: "معرف شما : " + introducerResult.FirstName + " " + introducerResult.LastName });
                        ToastAndroid.showWithGravity("کد معرف صحیح می باشد",
                            ToastAndroid.SHORT,
                            ToastAndroid.CENTER);
                    }

                })
            }).catch(err => {
                this.setState({ IsCheckDiscountCode: false });
            })
        }
        else
            ToastAndroid.showWithGravity("کد معرف را وارد نمایید",
                ToastAndroid.SHORT,
                ToastAndroid.CENTER);
    }
    setmodalPickerCity(item) {
        this.setState({ modalPickerCity: item })
    }
    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }
    renderDiscountCodeChecking = () => {
        if (!this.state.IsCheckDiscountCode)
            return (
                <View style={{ flexDirection: 'row' }}>
                    <TouchableHighlight
                        onPress={() => {
                            this.setModalVisible(!this.state.modalVisible);
                        }}
                        style={{ paddingRight: 10 }}>
                        <View style={{ backgroundColor: '#f44242', width: deviceWidth * 0.2, borderRadius: 3, height: 40 }}>
                            <Text
                                allowFontScaling={false}
                                style={[styles.fontFamily, { fontSize: fontSize.small, color: '#fff', paddingVertical: 5, textAlign: 'center' }]}>انصراف</Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableOpacity onPress={() => { this.CheckUserReagentCode() }}>
                        <View style={{ backgroundColor: colors.primary, width: deviceWidth * 0.3, borderRadius: 3, height: 40 }}>
                            <Text
                                allowFontScaling={false}
                                style={[styles.fontFamily, { fontSize: fontSize.small, color: '#fff', paddingVertical: 5, textAlign: 'center' }]}>اعمال کد تخفیف</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            )
        else
            return (
                <ActivityIndicator size={50} />
            )
    }
    renderBuyItNowBtn = () => {
        if (this.state.shippingRateError == false) {
            if (!this.state.isBuyItNowClicked)
                return (
                    <View style={{ flex: 1, paddingBottom: 70 }}>
                        <TouchableOpacity onPress={() => this.saveOrder()} style={{ backgroundColor: colors.secondary, width: deviceWidth * 0.95, borderRadius: 5, height: 55, justifyContent: 'center' }}>
                            <Text
                                allowFontScaling={false}
                                style={[styles.fontFamily, { fontSize: fontSize.normal, color: '#fff', textAlign: 'center', textAlignVertical: 'center' }]}>ثبت سفارش</Text>
                        </TouchableOpacity>
                    </View>
                )
            else
                return (
                    <ActivityIndicator size={50} style={{ paddingBottom: 70 }} />
                )
        }
    }
    validateOrderInputs() {
        return new Promise((fullFill, eject) => {
            let paramFirstName = this.state.FirstName;
            let paramLastName = this.state.LastName;
            let paramPhone = this.state.Phone;

            if (paramPhone == null || paramPhone == '') {
                ToastAndroid.showWithGravity('شماره موبایل وارد نشده است',
                    ToastAndroid.SHORT,
                    ToastAndroid.CENTER);
                fullFill(false);
            }
            else if (paramPhone != '' && paramPhone != null && validateMobileNumber(paramPhone).length == 0) {
                ToastAndroid.showWithGravity('شماره موبایل وارد شده صحیح نمی باشد',
                    ToastAndroid.SHORT,
                    ToastAndroid.CENTER);
                fullFill(false);
            }
            else if (paramPhone.length > 12) {
                ToastAndroid.showWithGravity('شماره موبایل وارد شده بیش از 12 رقم است',
                    ToastAndroid.SHORT,
                    ToastAndroid.CENTER);
                fullFill(false);
            }
            else if (paramFirstName == null || paramFirstName == '') {
                ToastAndroid.showWithGravity('نام خود را وارد نمایید',
                    ToastAndroid.SHORT,
                    ToastAndroid.CENTER);
                fullFill(false);
            }
            else if (paramLastName == null || paramLastName == '') {
                ToastAndroid.showWithGravity('نام خانوادگی خود را وارد نمایید',
                    ToastAndroid.SHORT,
                    ToastAndroid.CENTER);
                fullFill(false);
            }
            else
                fullFill(true);
        });
    }
    goBank = (url) => {
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            }
        });
    };
    emptyBasket(paymentTypecode, dataResult) {
        let _that = this;
        clearBasket(_that.props.selectedSupplierID, false).then(d => {
            if (d && d.length > 0) {
                _that.props.updateBasketCount(d.length);
                _that.props.navigation.navigate(screenNames.BASKET_PURCHASE_RESULT, { trackingCode: dataResult.data[1] })

            }
            else {
                _that.props.updateBasketCount(0);
                _that.props.navigation.navigate(screenNames.BASKET_PURCHASE_RESULT, { trackingCode: dataResult.data[1] })
            }

        });
    }
    saveOrder() {
        this.validateOrderInputs().then(validationResult => {
            if (validationResult) {
                this.setState({ isBuyItNowClicked: true });
                fetch(apiServer + 'api/shoppingBasket/InsertUserOrderMasterSimpleBasket', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        "FirstName": this.state.FirstName,
                        "LastName": this.state.LastName,
                        "Phone": this.state.Phone,
                        "LanguageCulture": this.state.LanguageCulture,
                        "PaymentTypeCode": this.state.CreditPaymentCode > 0 ? this.state.CreditPaymentCode : this.state.PaymentTypeCode,
                        "MoneyUnitName": this.state.MoneyUnitName,
                        "Count": this.state.Count,
                        "MarketerCode": this.state.CorrectDiscountCode,
                        "UserID": this.state.UserID,
                        "ProductServiceMasterCode": this.state.ProductServiceMasterCode,
                        "Description": this.state.Description,
                        "IsMobileApp": this.state.IsMobileApp,
                        "CityID": this.state.CityID
                    })
                }).then(res => {
                    res.text().then(result => {
                        let dataResult = JSON.parse(result);
                        console.warn("dataResult", dataResult);
                        if (dataResult.Status == "success") {
                            if (dataResult.data[2].toString().toLowerCase() == 'cash') {
                                if (dataResult.data[0].toString().toLowerCase() == '100') {
                                    AsyncStorage.setItem("BasketTrackingCode", dataResult.data[1]);
                                    this.goBank("https://cheegel.com/Views/Payment/BehpardakhtMobilePayment.html?refid=" + dataResult.data[1]);
                                }
                                //User Payment Online But All Basket Price Pay As Credit
                                else if (dataResult.data[0].toString().toLowerCase() == 'creditsuccess')
                                    this.emptyBasket(7, dataResult);
                            }
                            else if (dataResult.data[2].toString().toLowerCase() == 'cod') {
                                this.setState({ isBuyItNowClicked: false });
                                if (dataResult.data[0].toString().toLowerCase() == '100')
                                    this.emptyBasket(5, dataResult);
                                //User Payment COD But All Basket Price Pay As Credit
                                else if (dataResult.data[0].toString().toLowerCase() == 'creditsuccess')
                                    this.emptyBasket(6, dataResult);
                            }
                            else {
                                this.setState({ isBuyItNowClicked: false });
                                ToastAndroid.showWithGravity('امکان خرید در حال حاظر وجود ندارد',
                                    ToastAndroid.SHORT,
                                    ToastAndroid.CENTER);
                            }

                        } else {
                            this.setState({ isBuyItNowClicked: false });
                            ToastAndroid.showWithGravity('در حال حاظر خرید امکان پذیر نمی باشد دوباره سعی نمایید',
                                ToastAndroid.SHORT,
                                ToastAndroid.CENTER);
                        }
                    });
                }).catch(err => {
                    this.setState({ isBuyItNowClicked: false });
                    ToastAndroid.showWithGravity('در حال حاظر امکان خرید وجود ندارد',
                        ToastAndroid.SHORT,
                        ToastAndroid.CENTER);
                })
            }
        })
    }
    renderPriceWhenCatalogHaveDiscount() {
        let getBasketTotalPrice = this.state.basketTotalPrice;
        let discountPercent = this.state.discountPercent;
        if (discountPercent > 0) {
            getBasketTotalPrice = getBasketTotalPrice - (getBasketTotalPrice * (discountPercent / 100));
            return (
                <Text
                    allowFontScaling={false}
                    style={{ fontFamily: fonts.BYekan, fontSize: fontSize.small, color: colors.primary, paddingHorizontal: 5 }}>
                    {Math.ceil(getBasketTotalPrice).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
            )
        }
    }
    removeDiscountCode = () => {
        getDiscounyCode = null
        this.setState({ IntroducerInfo: "", DiscountCode: null, discountPercent: 0, CorrectDiscountCode: null });
        this.updateBasketTotalPrice(this.state.Count, true);
        ToastAndroid.showWithGravity("کد معرف شما حذف گردید",
            ToastAndroid.SHORT,
            ToastAndroid.CENTER);
    }
    updateBasketTotalPrice(qty, isRemoveDiscount) {
        this.setState({ Count: qty });
        let originalPrice = this.state.basketOriginalShippingPrice;
        let discountPercent = isRemoveDiscount ? 0 : this.state.discountPercent;
        let getBasketTotalPrice = this.state.basketTotalPrice;
        let getBasketOriginalPrice = this.state.BasketTotalOriginalPrice;
        let shippingPrice = this.state.basketTotalShippingPrice;
        let calcPrice = parseInt(getBasketOriginalPrice) * parseInt(qty);
        if (discountPercent > 0)
            calcPrice = calcPrice - (calcPrice * (discountPercent / 100));
        this.setState({ basketTotalPriceWithoutShipping: calcPrice, basketTotalPriceWithShipping: calcPrice + shippingPrice, basketTotalPrice: calcPrice });
    }
    renderQuantity = () => {
        return (
            <View style={{
                flex: 2,
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 4,
                paddingTop: 5,
                paddingBottom: 5
            }}>
                <View style={{ flex: 1, justifyContent: 'center', paddingTop: 2 }}>
                    <PlusButton isMinimize onPress={() => { this.changeQuantity('min') }} />
                </View>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontFamily: fonts.BYekan }}>
                        تعداد
                    </Text>
                    <Text
                        allowFontScaling={false}
                        style={[{ fontSize: fontSize.large, textAlignVertical: 'center', color: '#333', fontFamily: fonts.BYekan }]}>{this.state.Count}</Text>
                </View>
                <View style={{ flex: 1, justifyContent: 'center', paddingTop: 2 }}>
                    <PlusButton onPress={() => { this.changeQuantity('add') }} />
                </View>
            </View>
        )
    }
    changeQuantity = type => {
        let qty = this.state.Count;
        if (type == 'add' && qty < 20)
            this.updateBasketTotalPrice(qty + 1, false);
        else if (type == 'min' && qty > 1)
            this.updateBasketTotalPrice(qty - 1, false);
    }
    renderDateOfDeloivery() {
        if (this.state.deliveryDate != 'error')
            return (
                <View style={{ paddingVertical: 8, paddingRight: 10, flexDirection: 'row-reverse', alignItems: 'center' }}>
                    <Icon name='calendar' style={{ color: colors.primary, fontSize: fontSize.normal }} />
                    <Text
                        allowFontScaling={false}
                        style={{ fontFamily: fonts.BYekan, color: colors.primary, paddingHorizontal: 5, fontSize: fontSize.small }}>زمان تحویل : </Text>
                    <Text
                        allowFontScaling={false}
                        style={{ fontSize: fontSize.small, fontFamily: fonts.BYekan }}>{this.state.deliveryDate}</Text>
                </View >
            )
    }
    renderPaymentType() {
        if (this.state.IsCOD)
            return (
                <View style={{ paddingVertical: 8, paddingRight: 10, flexDirection: 'row-reverse', alignItems: 'center' }}>
                    <View style={{ flex: 2, paddingVertical: 8 }}>
                        <Text
                            allowFontScaling={false}
                            style={{ fontFamily: fonts.BYekan, fontSize: fontSize.small, color: colors.secondaryText, paddingHorizontal: 5 }}>
                            نوع پرداخت :
                                    </Text>
                    </View>
                    <View style={{ flex: 5, paddingVertical: 8 }}>
                        <View style={{ flexDirection: 'row-reverse' }}>

                            <TouchableOpacity onPress={() => { this.state.CreditPaymentCode > 0 ? this.setState({ CreditPaymentCode: 6, PaymentTypeCode: 5 }) : this.setState({ PaymentTypeCode: 5, CreditPaymentCode: 0 }) }}>
                                <View style={{ flexDirection: 'row-reverse' }}>
                                    <Text
                                        allowFontScaling={false}
                                        style={[this.state.PaymentTypeCode == 5 ? styles.buyitnowselectedbtn : styles.buyitnowunselectedbtn, styles.fontFamily, {
                                            textAlignVertical: 'center', fontSize: fontSize.small,
                                            textAlign: 'center', borderRadius: 20,
                                            width: fontSize.large, height: fontSize.large,
                                            color: 'white'
                                        }]}></Text>
                                    <Text
                                        allowFontScaling={false}
                                        style={{ fontFamily: fonts.BYekan, fontSize: fontSize.small, paddingHorizontal: 8 }}>
                                        در محل
                                                    </Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => { this.state.CreditPaymentCode > 0 ? this.setState({ CreditPaymentCode: 7, PaymentTypeCode: 2 }) : this.setState({ PaymentTypeCode: 2, CreditPaymentCode: 0 }) }}>
                                <View style={{ flexDirection: 'row-reverse' }}>
                                    <Text
                                        allowFontScaling={false}
                                        style={[this.state.PaymentTypeCode == 2 ? styles.buyitnowselectedbtn : styles.buyitnowunselectedbtn, styles.fontFamily, {
                                            textAlignVertical: 'center', fontSize: fontSize.small,
                                            textAlign: 'center', borderRadius: 20,
                                            width: fontSize.large, height: fontSize.large,
                                            color: 'white'
                                        }]}></Text>
                                    <Text
                                        allowFontScaling={false}
                                        style={{ fontFamily: fonts.BYekan, fontSize: fontSize.small, paddingHorizontal: 8 }}>
                                        آنلاین
                                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )
        else
            return (
                <View style={{ paddingVertical: 8, paddingRight: 10, flexDirection: 'row-reverse', alignItems: 'center' }}>
                    <View style={{ flex: 2, paddingVertical: 8 }}>
                        <Text
                            allowFontScaling={false}
                            style={{ fontFamily: fonts.BYekan, fontSize: fontSize.small, color: colors.secondaryText, paddingHorizontal: 5 }}>
                            نوع پرداخت :
                                </Text>
                    </View>
                    <View style={{ flex: 5, paddingVertical: 8 }}>
                        <Text
                            allowFontScaling={false}
                            style={{ fontFamily: fonts.BYekan, fontSize: fontSize.small, paddingHorizontal: 8 }}>آنلاین</Text>
                    </View>
                </View>
            )
    }
    renderPage = () => {
        if (!this.state.loading)
            return (
                <ScrollView keyboardShouldPersistTaps={'always'} style={{ backgroundColor: '#e8ebef', padding: 8 }}>
                    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled>
                        <Card>
                            <View style={{ backgroundColor: colors.primary, paddingVertical: 8 }}>
                                <Text
                                    allowFontScaling={false}
                                    style={{ fontFamily: fonts.BYekan, textAlign: 'center', color: 'white', fontSize: fontSize.normal }}>اطلاعات مشتری</Text>
                            </View>
                            <View style={{ paddingBottom: 32, borderRadius: 4, paddingHorizontal: 16, height: deviceHeight * 0.60 }}>
                                <InputGroup borderType='underline' style={{ paddingVertical: 8 }}>
                                    <Input
                                        style={{ fontFamily: fonts.BYekan, color: colors.secondaryText }}
                                        value={this.state.Phone}
                                        onChangeText={Phone => this.setState({ Phone })}
                                        keyboardType='phone-pad'
                                        placeholder='شماره همراه'
                                        onContentSizeChange={this.handleContentSizeChange} />
                                </InputGroup>
                                <InputGroup borderType='underline' style={{ paddingVertical: 8 }}>
                                    <Input
                                        style={{ fontFamily: fonts.BYekan, color: colors.secondaryText }}
                                        value={this.state.FirstName}
                                        onChangeText={FirstName => this.setState({ FirstName })}
                                        placeholder='نام'
                                        onContentSizeChange={this.handleContentSizeChange} />
                                </InputGroup>
                                <InputGroup borderType='underline' style={{ paddingVertical: 8 }}>
                                    <Input
                                        style={{ fontFamily: fonts.BYekan, color: colors.secondaryText }}
                                        value={this.state.LastName}
                                        onChangeText={LastName => this.setState({ LastName })}
                                        placeholder='نام خانوادگی'
                                        onContentSizeChange={this.handleContentSizeChange} />
                                </InputGroup>
                                {/* <View style={{ flex: 1, paddingTop: 16 }}>
                                    {this.renderQuantity()}
                                </View> */}
                                <CustomPicker
                                    label={'شهر خود را انتخاب نمایید'}
                                    list={this.state.Cities}
                                    displayField={'Name'}
                                    ValueField={'ID'}
                                    result={this.state.CityID}
                                    onPress={this.cityClicked.bind(this)} />
                                <View style={{ flex: 1, position: 'relative' }}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setModalVisible(true);
                                        }}>
                                        <Text style={{ fontFamily: fonts.BYekan, fontSize: fontSize.small, color: colors.primary, padding: 10 }}>برای استفاده از تخفیف کد معرف خود را وارد نمایید</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flexDirection: 'row-reverse' }}>
                                    <Text style={{ fontFamily: fonts.BYekan, fontSize: fontSize.small, color: colors.primary, padding: 10 }}>
                                        {this.state.IntroducerInfo}
                                    </Text>
                                    <TouchableOpacity onPress={() => { this.removeDiscountCode() }}>
                                        <Text style={{ color: colors.red, fontFamily: fonts.BYekan, fontSize: fontSize.small, padding: 10 }}>{getDiscounyCode != null && getDiscounyCode != '' ? 'حذف معرف' : ''}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Card>
                        <Card>
                            <View style={{ backgroundColor: colors.primary, paddingVertical: 8 }}>
                                <Text
                                    allowFontScaling={false}
                                    style={{ fontFamily: fonts.BYekan, textAlign: 'center', color: 'white', fontSize: fontSize.normal }}>اطلاعات خرید</Text>
                            </View>
                            <View style={{ paddingBottom: 4, borderRadius: 4, paddingHorizontal: 16, height: deviceHeight * 0.70 }}>
                                <View style={{ flex: 1, flexDirection: 'row-reverse', paddingVertical: 10 }}>
                                    <Text
                                        allowFontScaling={false}
                                        style={{ fontFamily: fonts.BYekan, fontSize: fontSize.small }}>
                                        قیمت سبد انتخابی شما :
                                    </Text>
                                    <Text
                                        allowFontScaling={false}
                                        style={[
                                            this.state.discountPercent > 0 ? { textDecorationLine: 'line-through', color: 'red' } : { color: colors.primary },
                                            { fontFamily: fonts.BYekan, fontSize: fontSize.small, paddingHorizontal: 5 }
                                        ]}>
                                        {Math.ceil(this.state.basketTotalPrice).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                    </Text>
                                    {this.renderPriceWhenCatalogHaveDiscount()}
                                    <Text style={{ fontFamily: fonts.BYekan, fontSize: fontSize.small, color: colors.secondaryText, paddingHorizontal: 5, paddingTop: 5 }}>
                                        تومان
                                    </Text>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'row-reverse', paddingVertical: 10, paddingRight: 10 }}>
                                    <Text
                                        allowFontScaling={false}
                                        style={{ fontFamily: fonts.BYekan, fontSize: fontSize.small }}>
                                        هزینه ارسال :
                                    </Text>
                                    <Text
                                        allowFontScaling={false}
                                        style={{ fontFamily: fonts.BYekan, fontSize: fontSize.small, color: colors.primary, paddingHorizontal: 5 }}>
                                        {this.state.basketTotalShippingPrice == 0 ? 'رایگان' : this.state.basketTotalShippingPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                    </Text>
                                    <Text
                                        allowFontScaling={false}
                                        style={{ fontFamily: fonts.BYekan, fontSize: fontSize.small, color: colors.secondaryText, paddingHorizontal: 5, paddingTop: 5 }}>
                                        {this.state.basketTotalShippingPrice == 0 ? '' : 'تومان'}
                                    </Text>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'row-reverse', paddingVertical: 10, paddingRight: 10, borderBottomWidth: 1, borderBottomColor: colors.secondaryText }}>
                                    <Text
                                        allowFontScaling={false}
                                        style={{ fontFamily: fonts.BYekan, fontSize: fontSize.small }}>
                                        خدمات ارزش افزوده چی دیلی :
                                    </Text>
                                    <Text
                                        allowFontScaling={false}
                                        style={{ fontFamily: fonts.BYekan, fontSize: fontSize.small, color: colors.primary, paddingHorizontal: 5 }}>
                                        {(Math.ceil(this.state.CheegelExtraPrice) / 10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                    </Text>
                                    <Text
                                        allowFontScaling={false}
                                        style={{ fontFamily: fonts.BYekan, fontSize: fontSize.small, color: colors.secondaryText, paddingHorizontal: 5, paddingTop: 5 }}>
                                        {this.state.basketTotalShippingPrice == 0 ? '' : 'تومان'}
                                    </Text>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'row-reverse', paddingVertical: 10, paddingRight: 10 }}>
                                    <Text
                                        allowFontScaling={false}
                                        style={{ fontFamily: fonts.BYekan, fontSize: fontSize.small }}>
                                        قیمت نهایی برای پرداخت :
                                    </Text>
                                    <Text
                                        allowFontScaling={false}
                                        style={{ fontFamily: fonts.BYekan, fontSize: fontSize.small, color: colors.primary, paddingHorizontal: 5 }}>
                                        {Math.ceil(this.state.basketTotalPriceWithShipping + (Math.ceil(this.state.CheegelExtraPrice) / 10)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                    </Text>
                                    <Text
                                        allowFontScaling={false}
                                        style={{ fontFamily: fonts.BYekan, fontSize: fontSize.small, color: colors.secondaryText, paddingHorizontal: 5, paddingTop: 5 }}>
                                        تومان
                                    </Text>
                                </View>
                                {this.renderUserCredit()}
                                {this.renderDateOfDeloivery()}
                                {this.renderPaymentType()}
                            </View>
                        </Card>
                        <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 20 }}>
                            {this.renderBuyItNowBtn()}
                        </View>
                        <View style={{ marginTop: 22 }}>
                            <Modal
                                animationType="fade"
                                transparent={true}
                                visible={this.state.modalVisible}
                                onRequestClose={() => {
                                    alert('Modal has been closed.');
                                }}>
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <View style={styles.modalContent}>
                                        <InputGroup borderType='underline' style={{ paddingVertical: 8 }}>
                                            <Input
                                                style={{ fontFamily: fonts.BYekan, color: colors.secondaryText }}
                                                value={this.state.DiscountCode}
                                                onChangeText={DiscountCode => this.setState({ DiscountCode })}
                                                placeholder='کد معرف' />
                                        </InputGroup>
                                        <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 20 }}>
                                            {this.renderDiscountCodeChecking()}
                                        </View>
                                    </View>
                                </View>
                            </Modal>
                        </View>
                    </KeyboardAvoidingView>
                </ScrollView >
            )
        else
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size={50} />
                </View>
            )
    }
    cityClicked(id) {
        if (id != this.state.CityID) {
            this.setState({ CityID: id });
            this.calcCatalogPrice(this.props.masterCode, id);
        }
    }
    render() {
        return this.renderPage();
    }
}
const mapStateToProps = state => {
    return {
        routeList: state.initial.routeList,
        deviceDimensions: state.initial.deviceDimensions,
        supplierId: state.initial.supplierId,
        ...state.navigation.routes.filter(x => x.params.active)[0].params
    }
}

export default connect(mapStateToProps, { updateBasketCount, setFooterVisibility, setDarkFooter, updateRouteList })(BuyItNow)