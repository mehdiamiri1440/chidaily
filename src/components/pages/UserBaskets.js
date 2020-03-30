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
    WebView
} from 'react-native';
import { connect } from 'react-redux';
import { Card, Input, InputGroup, Icon } from 'native-base'
import styles, { fonts, colors, fontSize } from '../../styles';
import FloatingLabelInput from '../common/FloatingLabelInput'
import { Button, SearchBar } from 'react-native-elements';
import { Modal, TouchableHighlight, FlatList } from 'react-native';
import { PlusButton } from '../common/PlusButton';
import Rating from '../common/Rating';

import { updateBasketCount, setFooterVisibility, setDarkFooter, updateRouteList } from '../../actions';
import { consts, getBasketCount, validateMobileNumber, validateEnglishCharacter, backAndroid, clearBasket, getCitiesList } from '../../utility'
import { screenNames, deviceWidth, deviceHeight, apiServer, nodeApiServer } from '../../utility/consts';
import Header from '../common/Header';
let BasketSkip, BasketTake, BasketTotalCount, UserBasketIndex, basket;
const typicalText = [styles.fontFamily, { flex: 1, fontSize: 14, paddingVertical: 4, paddingVertical: 4, color: colors.secondaryText, textAlignVertical: 'center' }]

const initiateInitials = () => {
    basket = [];
    UserBasketIndex = 0;
    BasketSkip = 0;
    BasketTake = 10;
    BasketTotalCount = 0;
}
initiateInitials()
class UserBasket extends Component {
    static navigationOptions = ({ navigation }) => ({
        header: <Header title='سبد های خریداری شده' navigation={navigation} />
    })
    constructor(props) {
        super(props)
        this.state = {
            BasketType: 2,
            BasketTrackingCode: null,
            BasketPurchaseDate: null,
            loading: false,
            flag: false,
            basketLoaded: false,
            isShow: false,
            countRate: 0,
            trackingCode: "",
        }
        this.closeModal = this.closeModal.bind(this)
        this.rateChange = this.rateChange.bind(this)
        this.clickButtonInsert = this.clickButtonInsert.bind(this)
    }
    componentDidMount() {
        this.getUserBaskets();
    }
    applyState() {
        this.setState({ flag: !this.state.flag })
    }
    getUserBaskets() {
        if (!this.state.loading && (BasketSkip <= BasketTotalCount || BasketTotalCount == 0)) {
            this.setState({ loading: true })
            this.fetchUserBasket().then(userBasketList => {
                this.setState({ basketLoaded: true });
                if (BasketSkip == 0)
                    this.setState({ basket: [] });
                if (userBasketList && userBasketList.length) {
                    BasketSkip = userBasketList.length + BasketTake
                    BasketTotalCount = userBasketList[0].Count;
                    userBasketList = userBasketList.map(x => ({
                        ...x,
                        details: JSON.parse(x.BasketDescription).filter(e => e.ProductType == 'Detail'),
                        master: JSON.parse(x.BasketDescription).filter(e => e.ProductType == 'Master')
                    }))
                    basket = [...basket, ...userBasketList];
                }
                else {
                    BasketTotalCount = 0;
                    basket = [];
                }
                this.setState({ loading: false });
            })
        }
        else
            this.setState({ loading: false });
    }
    fetchUserBasket() {
        return new Promise((fullFill, eject) => {
            fetch(`https://www.cheegel.com/apis/api/usersordermaster/GetUserBasket/${BasketSkip}/${BasketTake}/${this.state.BasketType}/${this.state.BasketPurchaseDate}/${this.state.BasketTrackingCode ? this.state.BasketTrackingCode.toString().toUpperCase() : null}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json; charset=utf-8',
                    'Content-Type': 'application/json; charset=utf-8',
                }
            }).then(response => response.json().then(
                result => fullFill(result.Table)
            ))
        })
    }
    renderBasketItemDetail(itemIndx) {
        const item = basket[itemIndx]
        if (item && item.IsSelected == true) {
            return (
                <View key={basket.Code} style={{ paddingVertical: 8 }}>
                    <Card style={[styles.card, { paddingHorizontal: 0, paddingBottom: 16 }]}>
                        {this.renderBasketDetails(item)}
                    </Card>
                </View>
            )
        }
    }
    renderItemDiscount(detail) {
        if (detail.DiscountPercent) {
            return (
                <View style={{ flex: 3, paddingHorizontal: 4 }}>
                    <View style={{ flexDirection: 'row-reverse' }}>
                        <View style={{ flex: 2 }}>
                            <Text allowFontScaling={false} style={typicalText}>{detail.Quantity} عدد</Text>
                        </View>
                        <View style={{ flex: 2, padding: 4, alignItems: 'center' }}>
                            <Text allowFontScaling={false} style={[typicalText, { color: colors.red }]}>{detail.DiscountPercent + '% تخفیف '}</Text>
                        </View>
                    </View>
                </View>
            )
        }
        else
            return (
                <View>
                    <View style={{ flex: 2 }}>
                        <Text style={typicalText}>{detail.Quantity} عدد</Text>
                    </View>
                </View>
            )
    }
    renderBasketDetails(item) {
        if (item.details.length)
            return (
                <View>
                    <View style={{ paddingVertical: 8 }}>
                        {item.details.map((detail, indx) => {
                            return (
                                <View key={indx} style={{ flexDirection: 'row-reverse', alignItems: 'center', borderBottomWidth: (indx < (item.details.length - 1) ? 1 : 0), borderBottomColor: '#c1c1c1' }}>
                                    <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
                                        <Image
                                            allowFontScaling={false}
                                            style={{ width: 64, height: 50, borderRadius: 50 }}
                                            resizeMode='contain'
                                            source={{
                                                // uri: testImageUrl 
                                                uri: `https://www.cheegel.com/apis/UploadedFiles/CheegelCacheImages/SizeType4/${detail.ProductImage}.png`
                                            }}
                                        />
                                    </View>
                                    <View style={{ flex: 3, paddingHorizontal: 4 }}>
                                        <Text allowFontScaling={false} style={typicalText}>{detail.Title}</Text>
                                        <Text allowFontScaling={false} style={typicalText}>{detail.Brand}</Text>
                                    </View>
                                    {this.renderItemDiscount(detail)}
                                    <View style={{ flex: 3, padding: 4, alignItems: 'center' }}>
                                        <Text allowFontScaling={false} style={typicalText}>{detail.DiscountPercent ? Math.ceil(detail.Price - (detail.Price * detail.DiscountPercent / 100)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : Math.ceil(detail.Price / 10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} تومان</Text>
                                    </View>
                                </View>
                            )
                        })}
                    </View>
                </View>
            )
    }
    renderIconShowMore(itemIndx) {
        const item = basket[itemIndx]
        if (item && item.IsSelected == true) {
            return (
                <Icon name="ios-arrow-dropup" style={{ padding: 5, color: colors.primary }} />
            )
        }
        return (
            <Icon name="ios-arrow-dropdown-outline" style={{ padding: 5 }} />
        )
    }
    buyThisProductAgainButton = (item) => {
        if (!item.isBuyThisProductAgainClicked) {
            return (
                <View style={{ padding: 8, borderRadius: 5, backgroundColor: colors.primary }}>
                    <TouchableOpacity
                        onPress={() => this.buyThisProductAgain(item)}>
                        <Text allowFontScaling={false} style={{ fontSize: fontSize.normal, fontFamily: fonts.BYekan, fontSize: fontSize.small, color: colors.blue, textAlign: 'center', color: '#FFF' }}>خرید مجدد این سبد</Text>
                    </TouchableOpacity>
                </View>
            )
        }
        else
            return (
                <ActivityIndicator size={25} style={{ flex: 1, padding: 8 }} />
            )
    }
    buyThisProductAgain(item) {
        let _that = this;
        item.isBuyThisProductAgainClicked = true;
        this.applyState();
        ToastAndroid.showWithGravity('احتمال تغییر قیمت در موقع خرید وجود دارد',
            ToastAndroid.LONG,
            ToastAndroid.CENTER);
        setTimeout(() => {
            let DetailInfo = [];
            fetch(nodeApiServer + `getProductServiceEcatalogSupplier/${item.details[0].Code}/false`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json; charset=utf-8',
                    'Content-Type': 'application/json; charset=utf-8',
                }
            }).then(res => {
                res.json().then(supplier => {
                    for (let index = 0; index < item.details.length; index++) {
                        DetailInfo.push({ "DetailCode": item.details[index].Code, "Quantity": item.details[index].Quantity, "SupplierID": supplier.SupplierID });
                        if (index >= (item.details.length - 1)) {
                            fetch(`${nodeApiServer}createCatalogFromBasket`, {
                                method: 'POST',
                                headers: {
                                    Accept: 'application/json',
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    DetailInfo
                                })
                            }).then(result => {
                                result.text().then(function (productCode) {
                                    item.isBuyThisProductAgainClicked = false;
                                    _that.applyState();
                                    _that.props.navigation.navigate(screenNames.BUY_IT_NOW, { masterCode: productCode, detailCode: 0, supplierId: supplier.SupplierID })
                                });
                            }).catch(err => {
                                item.isBuyThisProductAgainClicked = false;
                                this.applyState();
                                ToastAndroid.showWithGravity('امکان خرید مجدد این سبد در حال حاظر وجود ندارد',
                                    ToastAndroid.SHORT,
                                    ToastAndroid.CENTER);
                            })
                        }
                    }
                });
            })
        }, 1000);
    }
    clickRatingOnThisBasketButton = (show, item) => {
        this.setState({ isShow: show, trackingCode: item.TrackingCode });

    }
    closeModal = () => {
        let _that = this;
        _that.setState({ isShow: false });
        _that.setState({ countRate: -1 });
        setTimeout(function () { _that.saveRatingUser() }, 10);

    }
    rateChange(rate) {
        this.setState({ countRate: rate })

    }
    clickButtonInsert() {
        if (this.state.countRate > 0) {
            this.setState({ isShow: false })
            this.saveRatingUser();
        }

    }
    saveRatingUser() {
        // console.warn(apiServer + 'api/usersordermaster/GetUserOrderMasterTrackingForUpdate/' + this.state.trackingCode + '/' + this.state.countRate);
        fetch(apiServer + 'api/usersordermaster/GetUserOrderMasterTrackingForUpdate/' + this.state.trackingCode + '/' + this.state.countRate, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(res => {
            console.warn(res);
            // res.text().then(result => {
            //     let dataResult = JSON.parse(result);
            // });

        }).catch(err => {
            console.warn(err);

        })
    }

    renderRegisterBasketScore(item) {
        if (item.StatusCode == 73 && (item.Rating == null || item.Rating == -1)) {
            return (
                <View style={{ padding: 8, borderRadius: 5, backgroundColor: colors.blue, }}>
                    <TouchableOpacity
                        onPress={() => this.clickRatingOnThisBasketButton(true, item)}>
                        <Text
                            allowFontScaling={false}
                            style={{
                                fontFamily: fonts.BYekan,
                                fontSize: fontSize.small,
                                textAlign: 'center',
                                color: '#FFF'
                            }}>
                            امتیاز دهی به این سبد
                        </Text>
                    </TouchableOpacity>
                </View>
                // <View style={{ padding: 8, borderRadius: 5, backgroundColor: colors.primary }}>
                //     <TouchableOpacity
                //         onPress={() => this.taskTypeBtnPress('current')}>
                //         <Text style={{ fontSize: fontSize.normal, fontFamily: fonts.BYekan, fontSize: fontSize.small, color: colors.blue, textAlign: 'center', color: '#FFF' }}>امتیاز دهی به این سبد</Text>
                //     </TouchableOpacity>
                // </View>
            )
        }
        else
            return (
                <View style={{ padding: 8 }}>
                </View>
            )
    }
    renderUserBasketItems(itemIndx) {
        const item = basket[itemIndx];
        let _that = this;
        return (
            <View style={{ paddingVertical: 4, width: '100%', paddingHorizontal: 8 }}>
                <View
                    style={{
                        elevation: 5,
                        backgroundColor: '#fffeff',
                        paddingTop: 8,
                        height: deviceHeight * 0.30
                    }}>
                    <View style={{ backgroundColor: '#ffffff', padding: 10 }}>
                        <View style={{ flexDirection: 'row-reverse' }}>
                            <View>
                                <Icon name="cart" style={{ padding: 5 }} />
                            </View>
                            <View style={{ flexDirection: 'row-reverse', paddingRight: 5 }}>
                                <View>
                                    <View style={{ flexDirection: 'row-reverse' }}>
                                        <Text
                                            allowFontScaling={false}
                                            style={{ fontSize: fontSize.normal, fontFamily: fonts.BYekan, fontSize: fontSize.small, color: colors.blue }}>کد رهگیری : </Text>
                                        <Text
                                            allowFontScaling={false}
                                            style={{ fontSize: fontSize.normal, fontFamily: fonts.BYekan, fontSize: fontSize.small, fontWeight: 'bold' }}>
                                            {item.TrackingCode}
                                        </Text>
                                    </View>
                                    <View style={{ flexDirection: 'row-reverse' }}>
                                        <Text
                                            allowFontScaling={false}
                                            style={{ fontSize: fontSize.normal, fontFamily: fonts.BYekan, fontSize: fontSize.small, color: colors.blue }}>مبلغ کل : </Text>
                                        <Text
                                            allowFontScaling={false}
                                            style={{ fontSize: fontSize.normal, fontFamily: fonts.BYekan, fontSize: fontSize.small }}>
                                            {Math.ceil(item.Price / 10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' ' + 'تومان'}
                                        </Text>
                                    </View>
                                </View>
                                <View style={{ paddingRight: 5 }}>
                                    <View style={{ flexDirection: 'row-reverse' }}>
                                        <Text
                                            allowFontScaling={false}
                                            style={{ fontSize: fontSize.normal, fontFamily: fonts.BYekan, fontSize: fontSize.small, color: colors.blue }}>تاریخ خرید : </Text>
                                        <Text
                                            allowFontScaling={false}
                                            style={{ fontSize: fontSize.normal, fontFamily: fonts.BYekan, fontSize: fontSize.small }}>
                                            {item.ShamsiDate}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row-reverse', paddingVertical: 10 }}>
                            <Text
                                allowFontScaling={false}
                                style={{ fontSize: fontSize.normal, fontFamily: fonts.BYekan, fontSize: fontSize.small, color: colors.blue }}>وضعیت : </Text>
                            <View>
                                <Text
                                    allowFontScaling={false}
                                    style={{ fontSize: fontSize.normal, fontFamily: fonts.BYekan, fontSize: fontSize.small }}>
                                    {item.StatusLocalName}
                                </Text>
                            </View>
                        </View>
                        <View style={{ alignItems: 'center', flexDirection: 'row-reverse', justifyContent: 'space-between' }}>
                            {this.renderRegisterBasketScore(item)}
                            {this.buyThisProductAgainButton(item)}
                        </View>
                        <View style={{ alignItems: 'center' }}>
                            <TouchableOpacity onPress={() => {
                                basket[itemIndx].IsSelected ? basket[itemIndx].IsSelected = !basket[itemIndx].IsSelected : basket[itemIndx].IsSelected = true;
                                this.setState({ flag: !this.state.flag });
                            }}>
                                {this.renderIconShowMore(itemIndx)}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View>
                    {this.renderBasketItemDetail(itemIndx)}
                </View>
                <Rating
                    closeFunc={this.closeModal}
                    insertRating={this.clickButtonInsert}
                    isShow={_that.state.isShow}
                    rateChange={this.rateChange}
                    label={''}
                    text={''}
                />
            </View >
        )
    }
    onClearText() {
        let that = this;
        BasketSkip = 0;
        BasketTake = 10;
        basket = [];
        this.setState({ BasketTrackingCode: null });
        setTimeout(() => {
            that.getUserBaskets();
        }, 700);
    }
    onSubmitEditingSearch() {
        let that = this;
        BasketSkip = 0;
        BasketTake = 10;
        basket = [];
        setTimeout(() => {
            that.getUserBaskets();
        }, 400);
    }
    renderHeader = () => {
        let that = this;
        return (
            <View style={{ flexDirection: 'row-reverse', alignItems: 'center' }}>
                <View style={{ width: deviceWidth }}>
                    <SearchBar placeholder="جست جو بر اساس کد رهگیری"
                        inputStyle={{ direction: 'rtl', textAlign: 'right', height: 48, backgroundColor: 'white', fontFamily: fonts.BYekan }}
                        noIcon
                        autoCorrect={false}
                        clearIcon={{ name: 'clear', style: { fontSize: 24 } }}
                        onClearText={() => that.onClearText()}
                        onSubmitEditing={() => that.onSubmitEditingSearch()}
                        value={that.state.BasketTrackingCode}
                        onChangeText={(text) => that.setState({ BasketTrackingCode: text })}
                        lightTheme />
                </View>
            </View>
        )
    }
    renderPage() {
        return (
            <View style={{ flex: 1, paddingBottom: deviceHeight * 0.1 }}>
                <FlatList
                    ListHeaderComponent={this.renderHeader}
                    data={basket}
                    numColumns={1}
                    horizontal={false}
                    refreshing={this.state.loading}
                    onRefresh={() => {
                        BasketSkip = 0;
                        BasketTotalCount = 0;
                        this.getUserBaskets();
                    }}
                    onEndReached={() => {
                        this.getUserBaskets();
                    }}
                    onEndReachedThreshold={4}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => this.renderUserBasketItems(index)}
                    onScroll={(e) => {
                        let elemHeight = parseInt(deviceHeight * 0.5)
                        let x = e.nativeEvent
                        let contentOffset = e.nativeEvent.contentOffset;
                        let viewSize = e.nativeEvent.layoutMeasurement.height;
                        let index = (parseInt(contentOffset.y / elemHeight));
                        UserBasketIndex = index
                    }}
                    extraData={[this.state.loading, basket, this.state.flag]}
                    onScrollToIndexFailed={() => { }}
                />
                {this.renderMessage()}
            </View>
        )
    }
    renderMessage() {
        if (!basket.length && this.state.basketLoaded)
            return (
                <View style={{ flex: 1, backgroundColor: '#FFFFFF', flexDirection: 'row-reverse', justifyContent: 'center', alignItems: 'center' }}>
                    <Image
                        style={{ width: 50, height: 50, paddingVertical: 2, paddingHorizontal: 30 }}
                        source={require('../../assets/images/shopping_basket.png')}
                    />
                    <Text style={{ textAlignVertical: 'center', fontSize: fontSize.large, fontFamily: fonts.BYekan }}>هیچ سبدی موجود نمی باشد</Text>
                </View>
            )
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

export default connect(mapStateToProps, { updateBasketCount, setFooterVisibility, setDarkFooter, updateRouteList })(UserBasket)