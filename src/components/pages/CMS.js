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
    TouchableWithoutFeedback
} from "react-native";
import { connect } from 'react-redux';
import { SearchBar } from 'react-native-elements';
import {
    updateBasketCount, updateBasketCatalogList, updateSupplierId, updateCmsList, showFooter
} from '../../actions';

import styles, { colors, fontSize, fonts } from '../../styles';
import Rating from '../common/Rating';
import { getBasketCount, backAndroid, numberWithCommas, addToBasket, getCMS, } from '../../utility';
import { screenNames, deviceWidth, deviceHeight, apiServer } from '../../utility/consts';
import Header from '../common/Header';


class CMS extends Component {
    static navigationOptions = ({ navigation }) => ({
        header: <Header title='چی دیلی' navigation={navigation} />
    })
    constructor(props) {
        super(props)
        this.state = {
            selectBannerIndex: 0,
            loading: true,
            BasketSkip: 0,
            BasketTake: 1,
            BasketType: 2,
            statusCodeUserBasket: 0,
            isShow: false,
            countRate: 0,
            trackingCode: "",
            cmsSearch: ''

        }

    }
    closeModal = () => {
        let _that = this;
        _that.setState({ isShow: false });
        _that.setState({ countRate: -1 });
        setTimeout(function () { _that.saveRatingUser() }, 10);
        // this.setState({ isShow: false, countRate: -1 })
        // this.saveRatingUser()
    }
    saveRatingUser() {
        fetch(apiServer + 'api/usersordermaster/GetUserOrderMasterTrackingForUpdate', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "trackingcode": this.state.trackingCode,
                "rating": this.state.countRate,
            })
        }).then(res => {
            res.text().then(result => {
                let dataResult = JSON.parse(result);

            });
        }).catch(err => {
            console.warn(err);

        })
    }
    rateChange = (rate) => {
        this.setState({ countRate: rate })
    }
    submitSearch = () => {
        this.props.navigation.navigate(screenNames.PRODUCT_GALLERY, { CategoryCode: '0', tag: this.state.cmsSearch })
    }
    insertRating = () => {
        if (this.state.countRate > 0) {
            this.setState({ isShow: false })
            this.saveRatingUser()
        }
    }
    componentDidMount() {
        getBasketCount().then(count => {
            this.props.updateBasketCount(count)
        })
        if (!this.props.cmsList || !this.props.cmsList.length)
            getCMS(this, 'cms').then(cmsList => {
                this.props.updateCmsList(cmsList)
                this.setState({ loading: false })
            });
        else
            this.setState({ loading: false })

    }
    componentWillUnmount() {
        Linking.removeListener('url');
    }
    fetchUserBasket() {
        console.warn("ehsan");
        var _that = this;
        return new Promise((fullFill) => {
            fetch(`https:www.cheegel.com/apis/api/usersordermaster/GetUserBasket/${this.state.BasketSkip}/${this.state.BasketTake}/${this.state.BasketType}/${null}/${null}`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            }).then(response => {
                console.warn(response);
                response.json().then(function (x) {
                    _that.setState({ statusCodeUserBasket: x.Table[0].StatusCode });
                    if (_that.state.statusCodeUserBasket == 73 && (x.Table[0].Rating == null || x.Table[0].Rating != -1))
                        _that.setState({ isShow: true });
                    _that.setState({ trackingCode: x.Table[0].TrackingCode })
                    fullFill(true);
                })
            })
        })
    }
    addToBasketClicked(product, supplierId) {
        let item = {
            ItemID: product.Code + '-1',
            TitleLocal: product.TitleName,
            BrandLocal: product.BrandName,
            Image: product.GUID,
            Qty: 1,
            MinQty: 1,
            MaxQty: 1000,
            UnitOriginalPrice: product.Price,
            TotalPrice: product.Price,
            SupplierID: supplierId,
            DiscountPercent: product.DiscountPercent,
            DiscountStartDate: new Date('2018-06-12'),
            DiscountEndDate: new Date('2018-07-12')
        }
        addToBasket(item, "cms", null, null).then(res => {
            getBasketCount().then(count => {
                this.props.updateBasketCount(count)
            })
        })
    }
    renderAddToBasketBtn(row, item) {
        if (row.Purchaseable)
            return (
                <TouchableOpacity
                    onPress={() => { this.addToBasketClicked(item, row.SupplierID) }}
                    style={{
                        width: '100%',
                        position: 'absolute',
                        bottom: 0,
                        elevation: 8,
                        borderBottomLeftRadius: 4,
                        borderBottomRightRadius: 4,
                        backgroundColor: colors.primary
                    }}>
                    <Text
                        allowFontScaling={false}
                        style={[styles.fontFamily, { paddingVertical: 8, textAlign: 'center', color: 'white' }]}>
                        افزودن به سبد
                    </Text>
                </TouchableOpacity>
            )
    }
    keyExtractor = (item, index) => index.toString();

    renderCMSItem = ({ item, index }) => {
        return (
            <View key={index} style={{ paddingVertical: 8 }}>
                {this.renderCMSRow(item, index)}
            </View>
        )
    }
    renderBrandItem = ({ item, index }) => {
        return (
            <TouchableOpacity onPress={() => this.itemClicked(cmsRow, item)}
                key={index}
                style={{
                    paddingHorizontal: deviceWidth * 0.022,
                    backgroundColor: 'white',
                    borderRadius: 4
                }} >
                <Image
                    style={{
                        resizeMode: 'contain',
                        width: deviceWidth * 0.2,
                        height: deviceWidth * 0.2,
                    }}
                    source={{ uri: `https://www.cheegel.com/apis/UploadedFiles/MobileCMS/SizeType2/${item.GUID}.png` }}
                />
                <Text style={[styles.fontFamily, { fontSize: fontSize.small, width: deviceWidth * 0.2, textAlign: 'center' }]}>{item.Tag} </Text>
            </TouchableOpacity>

        )
    }
    renderProductItem = (item, index, cmsRow) => {
        return (
            <View style={{ width: deviceWidth * 0.34, padding: 4 }}>
                <TouchableOpacity onPress={() => {
                    this.props.navigation.navigate(screenNames.ITEM_DETAILS, { code: item.Code })
                }}
                    style={{
                        elevation: 5,
                        backgroundColor: '#fffeff',
                        height: deviceHeight * 0.30,
                        borderRadius: 4,
                        position: 'relative'
                    }}>
                    {this.renderProductDiscount(item.DiscountPercent)}
                    <View style={{ position: 'relative', width: '100%', height: '48%' }}>
                        {this.renderProductImage(item)}
                    </View>
                    <View style={{
                        backgroundColor: 'white', borderRadius: 4
                    }}>
                        <View style={{ position: 'relative', alignItems: 'stretch' }}>
                            <Text
                                allowFontScaling={false}
                                lineBreakMode='tail'
                                numberOfLines={1}
                                style={[
                                    styles.fontFamily,
                                    {
                                        textAlign: 'right',
                                        color: colors.secondaryText,
                                        fontSize: fontSize.smaller, paddingHorizontal: 8
                                    }
                                ]} >
                                {item.TitleName}
                            </Text>
                            <Text
                                allowFontScaling={false}
                                style={[
                                    {
                                        color: colors.red,
                                        textDecorationLine: item.DiscountPercent ? 'line-through' : 'none',
                                        fontSize: fontSize.smaller,
                                        textAlign: 'left',
                                        fontFamily: fonts.BYekan,
                                        paddingHorizontal: 4
                                    }]} >
                                {item.DiscountPercent ? numberWithCommas(Math.round(item.Price / 10)) + '  تومان' : '  '}&nbsp;

                    </Text>
                            <Text
                                allowFontScaling={false}
                                style={[styles.fontFamily, { color: '#0097A7', paddingHorizontal: 4, textAlign: 'left' }]} >
                                <Text
                                    allowFontScaling={false}
                                    style={{ fontSize: fontSize.small, fontFamily: fonts.BYekan }}>
                                    {numberWithCommas(Math.round(item.Price * (100 - item.DiscountPercent) / 100 / 10))}
                                </Text>&nbsp;
                        <Text
                                    allowFontScaling={false}
                                    style={{ fontSize: fontSize.smaller }}>
                                    تومان
                        </Text>
                            </Text>
                        </View>
                    </View>
                    {this.renderAddToBasketBtn(cmsRow, item)}
                </TouchableOpacity>
            </View>
        )
    }
    renderBanner(item, index, cmsRow) {
        let url = 'https://www.cheegel.com'
        return (
            <TouchableWithoutFeedback key={index}
                style={{
                    paddingTop: 8, paddingBottom: 8,
                }}
                onPress={() => {
                    if (item.Link)
                        Linking.canOpenURL(item.Link).then(supported => {
                            if (supported)
                                Linking.openURL(item.Link);
                        });
                    if (item.Tag) {
                        this.props.updateSupplierId(cmsRow.SupplierID)
                        this.props.navigation.navigate(screenNames.PRODUCT_GALLERY, { CategoryCode: '0', tag: item.Tag })
                    }
                }}>
                <Image style={{
                    borderRadius: 4,
                    resizeMode: 'contain',
                    width: deviceWidth,
                    height: deviceWidth / 2
                }}
                    source={{ uri: `https://www.cheegel.com/apis/UploadedFiles/MobileCMS/SizeType3/${item.GUID}.png` }}

                //source={require('../../../assets/Image/Untitled-7.jpg')}
                />
                {/* <Image style={{ width: deviceWidth, height: deviceHeight * 0.5 }}
                source={{ uri: item.UploadPic }} /> */}
            </TouchableWithoutFeedback>
        )

    }
    itemClicked(cmsRow, item) {
        switch (cmsRow.Type) {
            case 'Banner':

                break;
            case 'Brand':
                if (item.Tag) {
                    this.props.updateSupplierId(cmsRow.SupplierID)
                    this.props.navigation.navigate(screenNames.PRODUCT_GALLERY, { CategoryCode: '0', tag: item.Tag })
                }
                break;
            case 'Product':

                break;
            default:
                break;
        }
    }
    onScroll = e => {
        if (this.props.cmsList < 3) return false;
        if (e.nativeEvent.contentOffset.y < 60) {
            this.props.showFooter(true);
        } else if (e.nativeEvent.velocity.y > 0) {
            if (this.props.initial.showFooter) this.props.showFooter(false);
        } else {
            if (!this.props.initial.showFooter) this.props.showFooter(true);
        }
    };
    renderProductDiscount(discountPercent) {
        if (discountPercent > 0)
            return (
                <View style={{ position: 'absolute', backgroundColor: '#e80707', top: 10, width: (discountPercent > 9 ? deviceWidth * 0.13 : deviceWidth * 0.1), borderBottomRightRadius: 4, borderTopRightRadius: 4, zIndex: 100 }}>
                    <Text style={[styles.fontFamily, { color: '#FFF', fontSize: fontSize.small, textAlign: 'center' }]}>{Math.ceil(discountPercent) + '%'}</Text>
                </View>
            )
    }
    renderCMSRow(cmsRow, indx) {
        if (cmsRow.Type == "Banner") {
            if (cmsRow.Children && cmsRow.Children.length > 0) {
                return (
                    <View>
                        <FlatList
                            refreshing={this.state.loading}
                            inverted={true}
                            onScroll={(event) => {
                                let index = parseInt(event.nativeEvent.contentOffset.x / event.nativeEvent.contentSize.width * cmsRow.Children.length)
                                this.setState({ selectBannerIndex: index });
                            }}
                            data={cmsRow.Children}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            pagingEnabled={true}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) =>
                                this.renderBanner(item, index, cmsRow)
                            }
                        />
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            {cmsRow.Children.length > 1 && cmsRow.Children.map((_, i) => {
                                return (
                                    <View key={i} style={{
                                        width: deviceWidth * 0.015,
                                        height: deviceWidth * 0.015,
                                        borderRadius: deviceWidth * 0.01,
                                        backgroundColor: i == this.state.selectBannerIndex ? colors.secondaryText : colors.secondaryText,
                                        marginHorizontal: 2,
                                        marginVertical: 4
                                    }}>

                                    </View>
                                )
                            })}
                        </View>
                    </View>
                )
            }
        }
        else if (cmsRow.Type == "Brand") {
            if (cmsRow.Children && cmsRow.Children.length > 0) {
                return (
                    <FlatList
                        refreshing={this.state.loading}
                        inverted={true}
                        data={cmsRow.Children}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={this.keyExtractor}
                        renderItem={this.renderBrandItem}
                    />
                )

            }
        }
        else if (cmsRow.Type == "Product") {
            if (cmsRow.Children && cmsRow.Children.length > 0) {
                return (
                    <View>
                        <TouchableOpacity style={{ padding: 8, flexDirection: 'row', alignItems: 'center' }}
                            onPress={() => {
                                this.props.updateSupplierId(cmsRow.SupplierID)
                                this.props.navigation.navigate(screenNames.PRODUCT_GALLERY, { CategoryCode: '0', tag: '' })
                            }}>
                            <Text style={[styles.fontFamily, { width: '50%', textAlign: 'left', fontSize: fontSize.small }]}  >
                                مشاهده همه
                            </Text>
                            <Text style={[styles.fontFamily, { width: '50%', textAlign: 'right', fontSize: fontSize.small }]}>{cmsRow.Title}</Text>
                        </TouchableOpacity>
                        <FlatList
                            refreshing={this.state.loading}
                            inverted={true}
                            data={cmsRow.Children}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={this.keyExtractor}
                            renderItem={({ item, index }) => this.renderProductItem(item, index, cmsRow)}
                        />
                    </View>
                )
            }
        }
    }
    renderProductImage(product) {
        return (
            <Image resizeMode='contain' style={{
                width: '100%', height: '100%'
            }}
                source={{ uri: `https://www.cheegel.com/apis/UploadedFiles/CheegelCacheImages/SizeType2/${product.GUID}.png` }} />
        )
    }
    // that(item) {
    //     console.warn(item);
    // }
    renderHeader = () => {
        return <SearchBar placeholder="جستجو"
            inputStyle={{ direction: 'rtl', textAlign: 'right', height: 48, backgroundColor: 'white' }}
            noIcon
            autoCorrect={false}
            clearIcon={{ name: 'clear', style: { fontSize: 24 } }}
            // onClearText={() => { searchText = ''; }}
            onClearText={() => { this.setState({ cmsSearch: '' }) }}
            onSubmitEditing={() => { this.submitSearch() }}
            onChangeText={(text) =>
                this.setState({ cmsSearch: text })
            }
            value={this.state.cmsSearch}
            // onChangeText={(text) =>
            //     searchText = text
            // }
            // value={searchText}
            lightTheme />;
    }
    render() {
        if (!this.state.loading)
            return (
                <View>
                    <FlatList
                        refreshing={this.state.loading}
                        ListHeaderComponent={this.renderHeader}
                        data={this.props.cmsList}
                        horizontal={false}
                        showsHorizontalScrollIndicator={false}
                        pagingEnabled={true}
                        extraData={[this.state.cmsSearch]}
                        keyExtractor={this.keyExtractor}
                        renderItem={this.renderCMSItem}
                        windowSize={5}
                        onScroll={this.onScroll}

                    />
                    <Rating
                        closeFunc={this.closeModal}
                        insertRating={this.insertRating}
                        isShow={this.state.isShow}
                        rateChange={this.rateChange}
                        label={this.state.trackingCode}
                        text={'ثبت نظر برای سبد خرید با کد پیگیری :'}
                    />
                </View>)
        else
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size={56} />
                </View>
            )
    }
}
const mapStateToProps = state => {
    return {
        initial: state.initial,
        cmsList: state.initial.cmsList,
        isUserLogin: state.initial.isUserLogin,
        ...state.navigation.routes.filter(x => x.params.active)[0].params
    }
}
export default connect(mapStateToProps, {
    updateBasketCount, updateSupplierId, updateBasketCatalogList, updateCmsList, showFooter
})(CMS)
