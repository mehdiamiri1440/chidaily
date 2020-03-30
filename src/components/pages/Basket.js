import React, { Component } from 'react';

import {
    View,
    Text,
    Image,
    Button,
    ScrollView,
    AsyncStorage,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    ToastAndroid,
    BackHandler,
    FlatList,
    Linking
} from 'react-native';
import { Card, Left } from 'native-base'
import { Icon } from 'native-base'
import { updateBasketCount, setFooterVisibility, setDarkFooter, updateRouteList, updateSupplierId } from '../../actions';
import { connect } from 'react-redux';
import styles, { fonts, colors, fontSize } from '../../styles';
import { consts, getBasketCount, clearBasket, backAndroid, getBasketItems, } from '../../utility'
import { screenNames, deviceHeight, deviceWidth, nodeApiServer, imageServerSize2 } from '../../utility/consts';
import Header from '../common/Header';
class Basket extends Component {
    static navigationOptions = ({ navigation }) => ({
        header: <Header title='سبد خرید' navigation={navigation} />
    })
    constructor(props) {
        super(props)
        this.state = {
            basketItems: [],
            masterCode: '',
            calcTotalBasketItemsPrice: 0,
            isBasketClicked: false,
            basketCount: 1,
            storesList: [],
            selectedSupplierID: 0,
            radioSelected: false,
            basketLoaded: false
        }




    }
    componentDidMount() {
        this.getBasket(0);
    }
    getBasket = (supplierId) => {
        getBasketItems().then(bsketItems => {
            this.setState({ basketLoaded: true });
            if (bsketItems && bsketItems.BasketItems && bsketItems.BasketItems.length) {
                this.setState({ basketItems: bsketItems.BasketItems, basketCount: bsketItems.BasketItems.length, storesList: bsketItems.StoresList, selectedSupplierID: supplierId == 0 ? parseInt(bsketItems.StoresList[0]) : supplierId })
                this.calcTotalBasketItemsPrice();
            }
            else
                this.setState({ basketCount: 0 });
        });
    }
    checkout = (i) => {
        let _that = this;
        this.setState({ isBasketClicked: true });
        let x = this.state.basketItems;
        let DetailInfo = [];
        for (let index = 0; index < x.length; index++) {
            if (x[index].SupplierID == this.state.selectedSupplierID)
                DetailInfo.push({ "DetailCode": x[index].ItemID, "Quantity": x[index].Qty, "SupplierID": this.state.selectedSupplierID });
        }
        fetch(`${nodeApiServer}createCatalogFromBasket`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                DetailInfo
            })
        }).then(res => {
            res.text().then(function (productCode) {
                _that.setState({ isBasketClicked: false });
                let basketTotalPrice = _that.numberWithCommas(Math.ceil(_that.state.calcTotalBasketItemsPrice / 10));
                if (productCode && productCode != null && productCode != '') {
                    AsyncStorage.setItem("BasketSupplierID", _that.state.selectedSupplierID.toString()).then(d => {
                        _that.props.navigation.navigate(screenNames.BUY_IT_NOW, { masterCode: productCode, detailCode: 0, selectedSupplierID: _that.state.selectedSupplierID })
                    })
                }
                else {
                    // console.warn(res);
                    ToastAndroid.showWithGravity('برای ثبت سفارش لطفا دوباره سعی نمایید',
                        ToastAndroid.LONG,
                        ToastAndroid.CENTER);
                }
            });
        }).catch(err => {
            console.warn("Error", err);
            this.setState({ isBasketClicked: false });
        })
    }
    deleteItem = (itemId) => {
        let x = this.state.basketItems
        let indx
        x.map((element, index) => {
            if (element.ItemID == itemId)
                indx = index
        })
        x.splice(indx, 1);
        this.setState({
            basketItems: x
        })
        AsyncStorage.setItem(consts.basketItemsStorage, JSON.stringify(x)).then(d => {
            this.calcTotalBasketItemsPrice();
            getBasketCount().then(count => {
                this.props.updateBasketCount(count)
            });
            if (x && x.length == 0)
                this.setState({ basketCount: 0 });
            else {
                let getStores = this.state.storesList;
                if (this.state.basketItems.filter(itm => itm.SupplierID == this.state.selectedSupplierID).length == 0) {
                    getStores = getStores.filter(t => t != parseInt(this.state.selectedSupplierID));
                    this.setState({ storesList: getStores });
                    this.getBasket(parseInt(getStores[0]));
                }
            }
        });
    }
    calcTotalBasketItemsPrice = (selectedSupplierID) => {
        let SID = selectedSupplierID ? selectedSupplierID : this.state.selectedSupplierID;
        let x = this.state.basketItems.filter(b => b.SupplierID == SID)
        let basketTotalPrice = 0;
        let basketTotalPriceWithDiscount = 0;
        for (let index = 0; index < x.length; index++) {
            basketTotalPrice = basketTotalPrice + x[index].TotalPrice;
            basketTotalPriceWithDiscount = x[index].DiscountPercent ? basketTotalPriceWithDiscount + x[index].TotalPrice - (x[index].TotalPrice * (x[index].DiscountPercent / 100)) : basketTotalPriceWithDiscount + x[index].TotalPrice;
            if (index >= (x.length - 1)) {
                this.setState(
                    {
                        calcTotalBasketItemsPrice: basketTotalPrice,
                        calcTotalBasketItemsWithDiscountPrice: basketTotalPriceWithDiscount
                    }
                )
            }
        }
    }
    productCounter = (type, itemId) => {
        let x = this.state.basketItems;
        let indx;
        x.map((element, index) => {
            if (element.ItemID == itemId)
                indx = index
        })

        if (type == 'minus') {
            if ((x[indx].Qty - 1) > 0) {
                x[indx].Qty -= 1
                x[indx].TotalPrice = x[indx].Qty * x[indx].UnitOriginalPrice;
                this.setState({
                    basketItems: x
                })
                AsyncStorage.setItem(consts.basketItemsStorage, JSON.stringify(x)).then(d => {
                    this.calcTotalBasketItemsPrice();
                })
            }
        }
        else {
            x[indx].Qty += 1
            x[indx].TotalPrice = x[indx].Qty * x[indx].UnitOriginalPrice;
            this.setState({
                basketItems: x
            })
            AsyncStorage.setItem(consts.basketItemsStorage, JSON.stringify(x)).then(d => {
                this.calcTotalBasketItemsPrice();
            })
        }
    }
    renderAddToBasketBtn = () => {
        if (!this.state.isBasketClicked)
            return (
                <TouchableOpacity onPress={() => { this.checkout() }}>
                    <View style={{ backgroundColor: colors.secondary, alignItems: 'center', width: deviceWidth }}>
                        <Text
                            allowFontScaling={false}
                            style={[styles.fontFamily, { fontSize: 16, color: '#FFFFFF', paddingVertical: 15 }]}>نهایی کردن خرید</Text>
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
    numberWithCommas = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    renderStoreProperties = (item) => {
        try {
            return (
                <Text
                    allowFontScaling={false}
                    style={this.state.selectedSupplierID != item ? { textAlign: 'center', fontFamily: fonts.BYekan, paddingHorizontal: 4 } : { textAlign: 'center', fontFamily: fonts.BYekan, paddingHorizontal: 4, color: 'white' }}>
                    {
                        this.props.storesList.filter(store => store.SupplierID == item)[0].Name
                    }
                </Text>
            )
        } catch (error) {
            clearBasket(item, true).then(d => {
                if (d && d.length > 0) {
                    this.props.updateBasketCount(d.length);
                    this.getBasket(0);
                }
                else {
                    this.setState({ basketItems: [], basketCount: 0 });
                    this.props.updateBasketCount(0);
                }
            });
        }
    }
    renderStores(item) {
        return (
            <View style={{ paddingVertical: 8, paddingHorizontal: 4 }}>
                <TouchableOpacity style={this.state.selectedSupplierID != item ? { backgroundColor: 'white', padding: 8, borderRadius: 2, flexDirection: 'row-reverse', alignContent: 'center', elevation: 2 } : { backgroundColor: colors.secondary, padding: 8, borderRadius: 2, flexDirection: 'row-reverse', alignContent: 'center', elevation: 2 }}
                    onPress={() => {
                        this.setState({ selectedSupplierID: parseInt(item) });
                        this.calcTotalBasketItemsPrice(parseInt(item));
                    }}>
                    <View style={{ flexDirection: 'row-reverse', alignSelf: 'center' }}>
                        {this.renderStoreProperties(item)}
                        <Text
                            allowFontScaling={false}
                            style={[this.state.selectedSupplierID != item ? {
                                textAlignVertical: 'center', fontSize: fontSize.small,
                                textAlign: 'center', borderRadius: 20,
                                width: fontSize.large, height: fontSize.large,
                                color: 'white', backgroundColor: colors.secondary
                            } :
                                {
                                    textAlignVertical: 'center', fontSize: fontSize.small,
                                    textAlign: 'center', borderRadius: 20,
                                    width: fontSize.large, height: fontSize.large,
                                    color: colors.secondaryText, backgroundColor: 'white',
                                    fontFamily: fonts.BYekan
                                }]}>{this.state.basketItems.filter(x => x.SupplierID == item).length}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
    renderPrice(product) {
        if (product.DiscountPercent && (Date.parse(product.DiscountStartDate) <= Date.now() && Date.parse(product.DiscountEndDate) >= Date.now())) {
            return (
                <View>
                    <View style={{ flexDirection: 'row-reverse' }}>
                        <Text
                            allowFontScaling={false}
                            style={[styles.fontFamily, { fontSize: fontSize.small, color: colors.textPrimary }]}>قیمت : </Text>
                        <Text
                            allowFontScaling={false}
                            style={[{ fontSize: fontSize.small, color: colors.red, textDecorationLine: 'line-through', fontFamily: fonts.BYekan }]}>{this.state.basketItems.length && this.numberWithCommas(Math.ceil(product.TotalPrice / 10))}</Text>
                        <Text
                            allowFontScaling={false}
                            style={[styles.fontFamily, { fontSize: fontSize.small, textAlignVertical: 'center', paddingRight: 10 }]}>تومان</Text>
                    </View>
                    <View style={{ flexDirection: 'row-reverse' }}>
                        <Text
                            allowFontScaling={false}
                            style={[styles.fontFamily, { fontSize: fontSize.small, color: colors.textPrimary }]}>قیمت : </Text>
                        <Text
                            allowFontScaling={false}
                            style={[{ fontSize: fontSize.small, color: '#024b8f', fontFamily: fonts.BYekan }]}>{this.state.basketItems.length && this.numberWithCommas(
                                Math.ceil(
                                    (product.TotalPrice - (product.TotalPrice * (product.DiscountPercent / 100))) / 10))
                            }
                        </Text>
                        <Text
                            allowFontScaling={false}
                            style={[styles.fontFamily, { fontSize: fontSize.small, textAlignVertical: 'center', paddingRight: 10 }]}>تومان</Text>
                    </View>
                </View>
            )
        }
        else
            return (
                <View style={{ flexDirection: 'row-reverse' }}>
                    <Text
                        allowFontScaling={false}
                        style={[styles.fontFamily, { fontSize: fontSize.small, color: colors.textPrimary }]}>قیمت : </Text>
                    <Text
                        allowFontScaling={false}
                        style={[{ fontSize: fontSize.small, color: '#024b8f', fontFamily: fonts.BYekan }]}>{this.state.basketItems.length && this.numberWithCommas(Math.ceil(product.TotalPrice / 10))}</Text>
                    <Text
                        allowFontScaling={false}
                        style={[styles.fontFamily, { fontSize: fontSize.small, textAlignVertical: 'center', paddingRight: 10 }]}>تومان</Text>
                </View>
            )

    }
    renderTotalPrice() {

        if (this.state.basketItems.filter(b => b.SupplierID == this.state.selectedSupplierID && b.DiscountPercent > 0).length > 0)
            return (
                <View>
                    <View>
                        <Text
                            allowFontScaling={false}
                            style={{ fontFamily: fonts.BYekan, flex: 1, textAlign: 'left', paddingVertical: 16, paddingHorizontal: 8 }}>
                            <Text
                                allowFontScaling={false}
                                style={{ color: colors.textPrimary, fontSize: fontSize.small, textAlignVertical: 'center' }}>قیمت کل سبد : </Text>
                            <Text
                                allowFontScaling={false}
                                style={{ fontSize: fontSize.normal, color: colors.red, textAlignVertical: 'center', fontFamily: fonts.BYekan }}>
                                {this.state.basketItems.length && this.numberWithCommas(Math.ceil(this.state.calcTotalBasketItemsPrice / 10))}
                            </Text>
                            &nbsp;&nbsp;
                                       <Text
                                allowFontScaling={false}
                                style={{ fontSize: fontSize.small, textAlignVertical: 'center' }}>تومان</Text>
                        </Text>
                    </View>
                    <View style={{ borderBottomWidth: 1, borderBottomColor: '#cccccc' }}>
                        <Text
                            allowFontScaling={false}
                            style={{ fontFamily: fonts.BYekan, flex: 1, textAlign: 'left', paddingVertical: 16, paddingHorizontal: 8 }}>
                            <Text
                                allowFontScaling={false}
                                style={{ color: colors.textPrimary, fontSize: fontSize.small, textAlignVertical: 'center' }}>میزان تخفیف : </Text>
                            <Text
                                allowFontScaling={false}
                                style={{ fontSize: fontSize.normal, color: '#024b8f', textAlignVertical: 'center', fontFamily: fonts.BYekan }}>
                                {this.state.basketItems.length && this.numberWithCommas(Math.ceil((this.state.calcTotalBasketItemsPrice - this.state.calcTotalBasketItemsWithDiscountPrice) / 10))}
                            </Text>
                            &nbsp;&nbsp;
                                       <Text
                                allowFontScaling={false}
                                style={{ fontSize: fontSize.small, textAlignVertical: 'center' }}>تومان</Text>
                        </Text>
                    </View>
                    <View>
                        <Text
                            allowFontScaling={false}
                            style={{ fontFamily: fonts.BYekan, flex: 1, textAlign: 'left', paddingVertical: 16, paddingHorizontal: 8 }}>
                            <Text
                                allowFontScaling={false}
                                style={{ color: colors.textPrimary, fontSize: fontSize.small, textAlignVertical: 'center' }}>قیمت نهایی برای پرداخت : </Text>
                            <Text
                                allowFontScaling={false}
                                style={{ fontSize: fontSize.normal, color: '#024b8f', textAlignVertical: 'center', fontFamily: fonts.BYekan }}>
                                {this.state.basketItems.length && this.numberWithCommas(Math.ceil(this.state.calcTotalBasketItemsWithDiscountPrice / 10))}
                            </Text>
                            &nbsp;&nbsp;
                                       <Text
                                allowFontScaling={false}
                                style={{ fontSize: fontSize.small, textAlignVertical: 'center' }}>تومان</Text>
                        </Text>
                    </View>
                </View>
            )
        else
            return (
                <View>
                    <Text
                        allowFontScaling={false}
                        style={{ fontFamily: fonts.BYekan, flex: 1, textAlign: 'left', paddingVertical: 16, paddingHorizontal: 8 }}>
                        <Text
                            allowFontScaling={false}
                            style={{ color: colors.textPrimary, fontSize: fontSize.small, textAlignVertical: 'center' }}>قیمت کل سبد : </Text>
                        <Text
                            allowFontScaling={false}
                            style={{ fontSize: fontSize.normal, color: '#024b8f', textAlignVertical: 'center', fontFamily: fonts.BYekan }}>
                            {this.state.basketItems.length && this.numberWithCommas(Math.ceil(this.state.calcTotalBasketItemsPrice / 10))}
                        </Text>
                        &nbsp;&nbsp;
                                   <Text
                            allowFontScaling={false}
                            style={{ fontSize: fontSize.small, textAlignVertical: 'center' }}>تومان</Text>
                    </Text>
                </View>
            )
    }
    renderBasket24HourMessage() {
        if (this.state.basketCount > 0) {
            return (
                <View style={{ alignItems: 'center', paddingTop: 5, paddingBottom: 5, backgroundColor: colors.warning }}>
                    <Text
                        allowFontScaling={false}
                        style={{ fontFamily: fonts.BYekan, fontSize: fontSize.small, color: colors.secondaryText }}>به علت تغییر قیمت , سبد شما نهایتا تا 24 ساعت اعتبار دارد</Text>
                </View>
            )
        }
    }
    renderPage() {
        if (this.state.basketLoaded == true) {
            if (this.state.basketCount > 0) {
                return (
                    <View style={{ flex: 1 }}>
                        {this.renderBasket24HourMessage()}
                        <View style={{ height: deviceHeight * 0.72, padding: 8 }}>
                            <View>
                                <FlatList
                                    inverted={true}
                                    data={this.state.storesList}
                                    horizontal={true}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item }) => this.renderStores(item)}
                                    extraData={[this.state.selectedSupplierID, this.state.basketItems.filter(x => x.SupplierID == this.state.selectedSupplierID).length]} />
                            </View>
                            <TouchableOpacity onPress={() => {
                                clearBasket(this.state.selectedSupplierID, false).then(d => {
                                    if (d && d.length > 0) {
                                        this.props.updateBasketCount(d.length);
                                        this.getBasket(0);
                                    }
                                    else {
                                        this.setState({ basketItems: [], basketCount: 0 });
                                        this.props.updateBasketCount(0);
                                    }
                                });
                            }}>
                                <View style={{ paddingVertical: 10 }}>
                                    <Text allowFontScaling={false} style={{ fontFamily: fonts.BYekan, textAlign: 'left', color: colors.red, paddingLeft: 10 }}>حذف تمامی آیتم ها</Text>
                                </View>
                            </TouchableOpacity>
                            <ScrollView>
                                <Card style={{ borderRadius: 4, height: this.state.deviceHeight * 0.7 * 0.65 }}>
                                    {
                                        this.state.basketItems.filter(x => x.SupplierID == this.state.selectedSupplierID).map((item, indx) => {
                                            return (
                                                <View key={item.ItemID} style={{ backgroundColor: indx == 0 ? '#ffffff' : (indx % 2 == 0 ? '#ffffff' : '#f1f2f6'), flexDirection: 'row-reverse', borderBottomWidth: 1, borderColor: '#d1d1d1', paddingBottom: 10 }}>
                                                    <View style={{ flex: 15 }}>
                                                        <View style={{ flex: 1, flexDirection: 'row-reverse', paddingTop: 10 }}>
                                                            <View style={{ flex: 5, alignItems: 'center' }}>
                                                                <Image
                                                                    resizeMode='contain'
                                                                    style={{ width: '80%', height: '100%', paddingVertical: 2, paddingHorizontal: 6 }}
                                                                    source={{ uri: imageServerSize2 + item.Image + '.png' }}
                                                                />
                                                            </View>
                                                            <View style={{ flex: 8 }}>
                                                                <View style={{ height: this.state.deviceHeight * 0.7 * 0.65 * 0.2 }}>
                                                                    <Text
                                                                        allowFontScaling={false}
                                                                        style={[styles.fontFamily, { fontSize: fontSize.smaller, color: '#686868' }]}>{this.state.basketItems.length && item.TitleLocal}</Text>
                                                                </View>
                                                                <Text
                                                                    allowFontScaling={false}
                                                                    style={[styles.fontFamily, { fontSize: fontSize.smaller, color: '#686868' }]}>{this.state.basketItems.length && item.BrandLocal}</Text>
                                                                <View>
                                                                    {this.renderPrice(item)}
                                                                </View>
                                                                <TouchableOpacity onPress={() => {
                                                                    this.deleteItem(item.ItemID)
                                                                }} style={{ paddingTop: 5 }}>
                                                                    <View style={{ flexDirection: 'row-reverse' }}>
                                                                        <Image
                                                                            style={{ width: 24, height: 24 }}
                                                                            source={require('../../assets/images/trash-9-128.png')}
                                                                        />
                                                                        <Text
                                                                            allowFontScaling={false}
                                                                            style={[styles.fontFamily, { textAlignVertical: 'bottom', fontSize: fontSize.smaller, color: '#848484', paddingHorizontal: 10 }]}>حذف آیتم</Text>
                                                                    </View>
                                                                </TouchableOpacity>
                                                            </View>
                                                        </View>
                                                    </View>
                                                    <View style={{ flex: 2 }}>
                                                        <View style={{ alignItems: 'center', paddingTop: 25 }}>
                                                            <TouchableOpacity onPress={() => { this.productCounter('plus', item.ItemID) }}>
                                                                <Icon
                                                                    allowFontScaling={false}
                                                                    name='ios-add-circle-outline' fontSize={fontSize.large} />
                                                            </TouchableOpacity>
                                                            <Text
                                                                allowFontScaling={false}
                                                                style={[{ fontSize: fontSize.normal, color: '#024b8f', fontFamily: fonts.BYekan }]}>{this.state.basketItems.length && item.Qty}</Text>
                                                            <TouchableOpacity onPress={() => { this.productCounter('minus', item.ItemID) }}>
                                                                <Icon
                                                                    allowFontScaling={false}
                                                                    name='ios-remove-circle-outline' fontSize={fontSize.large} />
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                </View>
                                            )
                                        })
                                    }
                                </Card>
                                <Card style={{ borderRadius: 4 }}>
                                    {this.renderTotalPrice()}
                                </Card>
                            </ScrollView>
                        </View>
                        <View style={{ flex: 1, position: 'absolute', justifyContent: 'center', alignItems: 'center', bottom: 0 }}>
                            {this.renderAddToBasketBtn()}
                        </View>
                    </View >
                )
            }
            else {
                return (
                    <View style={{ flex: 1, backgroundColor: '#FFFFFF', flexDirection: 'row-reverse', justifyContent: 'center', alignItems: 'center' }}>
                        <Image
                            style={{ width: 50, height: 50, paddingVertical: 2, paddingHorizontal: 30 }}
                            source={require('../../assets/images/shopping_basket.png')}
                        />
                        <Text
                            allowFontScaling={false}
                            style={{ textAlignVertical: 'center', fontSize: fontSize.large, fontFamily: fonts.BYekan }}>سبد خرید شما خالی می باشد</Text>
                    </View>
                )
            }
        }
        else
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size={50} />
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
        storesList: state.initial.storesList,
        ...state.navigation.routes.filter(x => x.params.active)[0].params
    }
}
export default connect(mapStateToProps, { updateBasketCount, setFooterVisibility, setDarkFooter, updateRouteList, updateSupplierId })(Basket)