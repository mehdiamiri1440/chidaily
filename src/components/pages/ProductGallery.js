import React, { Component } from 'react';
import {
    View, Image, Text, TouchableOpacity, FlatList, BackHandler
} from 'react-native';
import { Icon, Card } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import {
    updateBasketCount, showFooter
} from '../../actions';
import { SearchBar } from 'react-native-elements';
import styles, { colors, fontSize, fonts } from '../../styles';
import { addToBasket, getBasketCount, numberWithCommas, consts, backAndroid } from '../../utility';
import Product from './Product';
import { screenNames, deviceWidth, deviceHeight } from '../../utility/consts';
import Header from '../common/Header';
let skip, take, totalCount, columns, productGallery, productGalleryIndex, categoryCode, supplierId, tag;

const initiateInitials = () => {
    skip = 0
    take = 40
    totalCount = 0
    columns = 2
    productGallery = []
    productGalleryIndex = 0
}
const renderPrice = (_this, product) => {
    let mxPrice = Math.round(product.MaxPrice / 10);
    let mnPrice = Math.round(product.MinPrice / 10);
    if (product.BuyItNowPercent) {
        return (
            <View style={{ paddingHorizontal: 8, flexDirection: 'row-reverse' }}>
                <View style={{ alignItems: 'stretch', width: '40%', justifyContent: 'center' }}>
                    <Text allowFontScaling={false} style={[{
                        fontSize: product.MaxPrice == product.MinPrice ? fontSize.normal : fontSize.small,
                        textDecorationLine: 'line-through',
                        color: colors.red,
                        textAlign: 'right',
                        fontFamily: fonts.BYekan,
                        lineHeight: product.MaxPrice == product.MinPrice ? fontSize.normal : fontSize.small,
                    }]}>
                        {product.MaxPrice == product.MinPrice ? numberWithCommas(Math.round(product.MaxPrice / 10)) : (Math.round(product.MaxPrice / 10) + " - " + Math.round(product.MinPrice / 10)).toString().replace(/\B(?=(?:\d{3})+(?!\d))/g, ',')}
                    </Text>
                </View>
                <View style={{ alignItems: 'stretch', width: '60%' }}>
                    <Text allowFontScaling={false} style={[{ textAlign: 'left', color: colors.primary }]}>
                        <Text allowFontScaling={false} style={{
                            fontSize: product.MaxPrice == product.MinPrice ? fontSize.normal : fontSize.small,
                            fontFamily: fonts.BYekan,
                            lineHeight: product.MaxPrice == product.MinPrice ? fontSize.normal : fontSize.small,
                        }}>
                            {product.MaxPrice == product.MinPrice ? numberWithCommas(Math.round(mxPrice - (mxPrice * (product.BuyItNowPercent / 100)))) : (Math.round(mxPrice - (mxPrice * (product.BuyItNowPercent / 100))) + " - " + Math.round(mnPrice - (mnPrice * (product.BuyItNowPercent / 100)))).toString().replace(/\B(?=(?:\d{3})+(?!\d))/g, ',')}
                        </Text>
                        <Text allowFontScaling={false} style={{ fontSize: fontSize.smaller }}>&nbsp; تومان</Text>
                    </Text>
                </View>
            </View >

        )
    }
    else {
        return (
            <View style={{ paddingHorizontal: 8, flexDirection: 'row-reverse' }}>
                <Text allowFontScaling={false} style={[{ textAlign: 'left', color: colors.primary, width: '100%' }]}>
                    <Text allowFontScaling={false} style={{
                        fontSize: product.MaxPrice == product.MinPrice ? fontSize.normal : fontSize.small,
                        fontFamily: fonts.BYekan,
                        lineHeight: product.MaxPrice == product.MinPrice ? fontSize.normal : fontSize.small,
                    }}>
                        {product.MaxPrice == product.MinPrice ? numberWithCommas(mxPrice - (mxPrice * (product.BuyItNowPercent / 100))) : (Math.round(mxPrice - (mxPrice * (product.BuyItNowPercent / 100))) + " - " + Math.round(mnPrice - (mnPrice * (product.BuyItNowPercent / 100)))).toString().replace(/\B(?=(?:\d{3})+(?!\d))/g, ',')}
                    </Text>
                    <Text allowFontScaling={false} style={{ fontSize: fontSize.smaller }}>&nbsp; تومان</Text>
                </Text>
            </View>
        )
    }
}
const renderProductGallery = (_this, itemIndx) => {
    const item = productGallery[itemIndx]
    // if (item.Title && item.LocalTitle) {
    return (
        <View style={{ width: deviceWidth * 0.5, paddingVertical: 4, paddingHorizontal: 4 }}>
            <TouchableOpacity onPress={() => { _this.callShowDetail(item.ItemID) }}
                style={{
                    elevation: 2,
                    backgroundColor: '#fffeff',
                    borderRadius: 4,
                    paddingTop: 8,
                    height: deviceHeight * 0.40,
                    position: 'relative',
                    alignItems: 'stretch'
                }}>
                {/* <Text>{itemIndx}</Text> */}
                {_this.renderProductDiscount(item.BuyItNowPercent)}
                <View style={{ position: 'relative', width: '100%', height: '45%' }}>
                    {_this.renderProductImage(item)}
                </View>
                <View style={{
                    // width: deviceWidth * 0.48,
                    height: deviceHeight * 0.4 * 0.3,
                    backgroundColor: 'white', borderRadius: 10
                }}>
                    <View style={{ position: 'relative' }}>
                        <Text
                            allowFontScaling={false}
                            lineBreakMode='tail'
                            numberOfLines={1}
                            style={[styles.fontFamily, {
                                color: colors.secondaryText, fontSize: fontSize.small,
                                paddingHorizontal: 8, paddingVertical: 2, textAlign: 'right'
                            }]} >{item.LocalTitle}</Text>
                        <Text allowFontScaling={false} style={[styles.fontFamily, {
                            color: '#a8a8a8',
                            fontSize: fontSize.smaller,
                            paddingHorizontal: 8,
                            paddingVertical: 2, textAlign: 'right'
                        }]} >{item.Brand.LocalName ? item.Brand.LocalName : ' '}</Text>
                        {renderPrice(_this, item)}
                    </View>
                </View>
                <TouchableOpacity
                    onPress={() => { _this.addToBasketClicked(item) }}
                    style={{
                        elevation: 4,
                        position: 'absolute',
                        borderBottomLeftRadius: 4,
                        borderBottomRightRadius: 4,
                        backgroundColor: colors.primary,
                        bottom: 0,
                        width: '100%'
                    }}>
                    <Text allowFontScaling={false} style={[styles.fontFamily, { padding: 10, textAlign: 'center', color: 'white' }]}>
                        افزودن به سبد
            </Text>
                </TouchableOpacity>
            </TouchableOpacity>
        </View>
    )
    // }
}

const getItemLayout = (that, data, index) => {
    let height = that.props.deviceDimensions.height * 0.5
    return {
        length: height,
        offset: height * index,
        index
    }
}
initiateInitials()

class ProductGallery extends Component {
    static navigationOptions = ({ navigation }) => ({
        header: <Header title={navigation.state.params.catName ? navigation.state.params.catName : 'محصولات'} navigation={navigation} />
    })
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            searchText: ''
        }
        if ((categoryCode != this.props.CategoryCode) || (supplierId != this.props.supplierId) || (tag != this.props.tag))
            initiateInitials()
    }
    componentDidMount() {
        if ((this.props.CategoryCode != categoryCode) || (supplierId != this.props.supplierId) || (tag != this.props.tag)) {
            this.getProductGallery();
            categoryCode = this.props.CategoryCode
            supplierId = this.props.supplierId
            tag = this.props.tag
        }
    }
    scrollToIndex() {
        //console.warn(this.props.productGalleryIndex)
        // this.flatListRef.scrollToOffset({ index: this.props.productGalleryIndex / 2 });

    }
    renderProductDiscount(discountPercent) {
        if (discountPercent > 0)
            return (
                <View style={{ position: 'absolute', backgroundColor: '#e80707', top: 10, width: deviceWidth * 0.1, borderBottomRightRadius: 4, borderTopRightRadius: 4, zIndex: 100 }}>
                    <Text style={[styles.fontFamily, { color: '#FFF', fontSize: fontSize.small, textAlign: 'center' }]}>{Math.ceil(discountPercent) + '%'}</Text>
                </View>
            )
    }
    getProductGallery(searchMode) {
        return new Promise((fullFill, eject) => {
            if (!this.state.loading && (skip <= totalCount || totalCount == 0)) {
                this.setState({ loading: true })
                let _this = this;
                let test = {
                    "sort": 3,
                    "property": [],
                    "pageIndex": 1,
                    "totalCount": 0,
                    "productType": 0,
                    "categoryCode": searchMode || !this.props.CategoryCode ? '0' : this.props.CategoryCode,
                    "freeShipping": false,
                    "discount": false,
                    "brand": 0,
                    "tag": this.state.searchText ? this.state.searchText : (this.props.tag ? this.props.tag : '0'),
                    "supplierID": this.props.supplierId,
                    "minPrice": 0,
                    "maxPrice": 0,
                    "skip": skip,
                    "take": take,
                    "moneyUnit": "IRR",
                    "language": "FA",
                    "coord": [
                        null,
                        null
                    ],
                    "isFamilyBasket": false
                };
                fetch('http://185.129.169.61:3004/api/products/', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(test)
                }).then(response => {
                    response.json().then(function (x) {
                        let products = x.Products;
                        if (skip == 0)
                            productGallery = []
                        if (products && products.length) {
                            totalCount = products[0].TotalCount;
                            skip = productGallery.length + take
                            totalCount = products[0].TotalCount
                            productGallery = [...productGallery, ...products]
                        }
                        else {
                            totalCount = 0;
                            productGallery = []
                        }
                        _this.setState({ loading: false })
                        fullFill(true);
                    })
                })

            }
            else {
                this.setState({ loading: false })
                fullFill(true);
            }
        })
    }
    callShowDetail(ItemID) {
        this.props.navigation.navigate(screenNames.ITEM_DETAILS, { code: ItemID })
    }
    renderProductImage(product) {
        if (product.Images && product.Images[0] && product.Images[0][0])
            return (
                <Image resizeMode='contain' style={{
                    width: '100%', height: '100%',
                    borderTopLeftRadius: 5, borderRadius: 4
                }}
                    source={{ uri: `https://www.cheegel.com/apis/UploadedFiles/CheegelCacheImages/SizeType2/${product.Images[0][0]}.png` }} />
            )
        else
            return (
                <Image resizeMode='contain' style={{
                    width: '100%', height: '100%', borderRadius: 4
                }}
                    source={{ uri: `https://www.cheegel.com/apis/UploadedFiles/CheegelCacheImages/None/purplelist-image-not-available.png` }} />
            )
    }
    addToBasketClicked(product) {
        let item = {
            ItemID: product.ItemID + '-1',
            TitleLocal: product.LocalTitle,
            BrandLocal: product.Brand.LocalName,
            Image: product.Images[0][0],
            Qty: 1,
            MinQty: 1,
            MaxQty: 1000,
            UnitOriginalPrice: product.MaxPrice,
            TotalPrice: product.MaxPrice,
            SupplierID: this.props.supplierId,
            DiscountPercent: product.Discount.Percent,
            DiscountStartDate: product.Discount.StartDate,
            DiscountEndDate: product.Discount.EndDate
        }
        addToBasket(item, "productgallery").then(res => {
            getBasketCount().then(count => {
                this.props.updateBasketCount(count)
            })
        })
    }
    onScroll = e => {
        let elemHeight = parseInt(deviceHeight * 0.5)
        let x = e.nativeEvent
        let contentOffset = e.nativeEvent.contentOffset;
        let viewSize = e.nativeEvent.layoutMeasurement.height;
        let index = (parseInt(contentOffset.y / elemHeight));
        productGalleryIndex = index

        if (this.props.cmsList < 3) return false;
        if (e.nativeEvent.contentOffset.y < 60) {
            this.props.showFooter(true);
        } else if (e.nativeEvent.velocity.y > 0) {
            if (this.props.initial.showFooter) this.props.showFooter(false);
        } else {
            if (!this.props.initial.showFooter) this.props.showFooter(true);
        }
    };
    onSubmitEditingSearch = (item) => {
        let that = this;
        skip = 0;
        take = 50;
        if (item == 0)
            this.setState({ searchText: '' });
        setTimeout(function () {
            that.getProductGallery(true)
        }, 20);

    }
    renderHeader = () => {
        let that = this;
        return (
            <View style={{ flexDirection: 'row-reverse', alignItems: 'center' }}>
                <View style={{ width: deviceWidth * 0.9 }}>
                    <SearchBar placeholder="جستجو"
                        inputStyle={{ direction: 'rtl', textAlign: 'right', height: 48, backgroundColor: 'white' }}
                        noIcon
                        autoCorrect={false}
                        clearIcon={{ name: 'clear', style: { fontSize: 24 } }}
                        onClearText={() => that.onSubmitEditingSearch(0)}
                        onSubmitEditing={() => that.onSubmitEditingSearch(1)}
                        onChangeText={(text) => { that.setState({ searchText: text }) }}
                        value={that.state.searchText}
                        lightTheme />
                </View>
                <TouchableOpacity onPress={() => {
                    this.props.navigation.navigate(screenNames.CATEGORY, {})
                }}>
                    <View style={{ width: deviceWidth * 0.1, alignItems: 'center' }}>
                        <Ionicons name='md-list' style={{ color: colors.secondaryText, fontSize: 24 }} />
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                <FlatList
                    //ref={(ref) => { this.flatListRef = ref; }}
                    windowSize={10}
                    ListHeaderComponent={this.renderHeader}
                    data={productGallery}
                    numColumns={columns}
                    horizontal={false}
                    refreshing={this.state.loading}
                    onRefresh={() => {
                        skip = 0;
                        totalCount = 0;
                        this.getProductGallery();
                    }}
                    onEndReached={() => {
                        this.getProductGallery();
                    }}
                    // initialNumToRender={productGalleryIndex ? productGalleryIndex : 10}
                    // initialScrollIndex={productGalleryIndex}
                    onEndReachedThreshold={8}
                    keyExtractor={(item, index) => index.toString()}
                    // getItemLayout={(data, index) => getItemLayout(this, data, index)}
                    renderItem={({ item, index }) => renderProductGallery(this, index)}
                    onScroll={this.onScroll}
                    onScrollToIndexFailed={() => { }}
                // onViewableItemsChanged={({ viewableItems, changed }) => {
                //     //console.warn("Visible items are", viewableItems.length);
                //     //console.warn("Changed in this iteration", changed.length);
                //   }}
                //   viewabilityConfig={{
                //     itemVisiblePercentThreshold: 50
                //   }}
                //initialNumToRender={5}
                //getItemLayout={(data, index) => getItemLayout(this, data, index)}
                />
            </View>

        );

    }
}
const mapStateToProps = state => {
    return {
        initial: state.initial,
        supplierId: state.initial.supplierId,
        ...state.navigation.routes.filter(x => x.params.active)[0].params

    }
}

export default connect(mapStateToProps, { updateBasketCount, showFooter })(ProductGallery)
