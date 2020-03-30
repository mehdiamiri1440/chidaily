import React, { Component } from 'react';
import {
    BackHandler,
    View,
    FlatList,
    Text,
    Image,
    Linking,
    TouchableOpacity,
    TouchableWithoutFeedback,
    ActivityIndicator
} from "react-native";
import { connect } from 'react-redux';
import { SearchBar } from 'react-native-elements';
import {
    setFooterVisibility, updateBasketCount, updateBasketCatalogList,
    updateRouteList, setDarkFooter, updateSupplierId
} from '../../actions';

import styles, { colors, fontSize, fonts } from '../../styles';
import { getBasketCount, consts, backAndroid, numberWithCommas, addToBasket, getCMS, } from '../../utility';
import { screenNames, deviceWidth, deviceHeight } from '../../utility/consts';
import Header from '../common/Header';
class AdvertimentCMS extends Component {
    static navigationOptions = ({ navigation }) => ({
        header: <Header title='پیشنهاد های ویژه' navigation={navigation} />
    })
    constructor(props) {
        super(props)
        this.state = {
            cmsList: [],
            selectBannerIndex: 0,
            cmsSearch: '',
            loading: true,
        };



        getBasketCount().then(count => {
            this.props.updateBasketCount(count)
        })
    }
    submitSearch() {
        this.props.navigation.navigate(screenNames.PRODUCT_GALLERY, { CategoryCode: '0', tag: this.state.cmsSearch })
    }
    componentDidMount() {
        //specialOffers
        getCMS(this, 'specialOffers').then(x => {
            this.setState({ cmsList: x, loading: false });
        });
    }
    // getCMS() {
    //     fetch(`http://185.129.169.61:3004/api/GetMobileAppCMS/cms`)
    //         .then(res => {
    //             return res.json();
    //         }).then(data => {
    //             this.setState({ cmsList: data })
    //         })
    //     // fetch(`${nodeApiServer}GetMobileAppCMS`)
    //     //     .then(res => {
    //     //         return res.json();
    //     //     }).then(data => {
    //     //         console.warn(data);
    //     //         this.setState({ cmsList: data })
    //     //     })
    // }
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
            SupplierID: supplierId
        }
        addToBasket(item, "specialoffer", null, null).then(res => {
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
                    <Text style={[styles.fontFamily, { paddingVertical: 8, textAlign: 'center', color: 'white' }]}>
                        افزودن به سبد
                    </Text>
                </TouchableOpacity>
            )
    }
    renderBanner(item, index) {
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
                // source={{ uri: `localhost:27013/apis/UploadedFiles/MobileCMS/SizeType3/${item.GUID}.png` }}
                />
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
    renderCMSRow(cmsRow, indx) {
        if (cmsRow.Type == "Banner") {
            if (cmsRow.Children && cmsRow.Children.length > 0) {
                return (
                    <View>
                        <FlatList
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
                                this.renderBanner(item, index)
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
                        data={cmsRow.Children}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) =>
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
                        }
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
                            <Text
                                allowFontScaling={false}
                                style={[styles.fontFamily, { width: '50%', textAlign: 'left', fontSize: fontSize.small }]}  >
                                مشاهده همه
                            </Text>
                            <Text style={[styles.fontFamily, { width: '50%', textAlign: 'right', fontSize: fontSize.small }]}>{cmsRow.Title}</Text>
                        </TouchableOpacity>
                        <FlatList
                            data={cmsRow.Children}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) =>
                                // <View style={{ padding: 8 }}>
                                //     <View style={{ borderRadius: 4, elevation: 4, position: 'relative', backgroundColor: 'white', width: deviceWidth * 0.5, padding: 4, justifyContent: 'flex-start' }}>
                                //         <Image
                                //             style={{ resizeMode: 'contain', top: 0, position: 'absolute', width: deviceWidth * 0.5, height: deviceHeight * 0.35 }}
                                //             source={{
                                //                 //uri:`https://www.cheegel.com/apis/UploadedFiles/CheegelCacheImages/SizeType3/${item.GUID}.png` 
                                //                 uri: `https://www.cheegel.com/apis/UploadedFiles/CheegelCacheImages/None/purplelist-image-not-available.png`
                                //             }} />
                                //         <Text>{item.TitleName}</Text>
                                //     </View>

                                // </View>
                                <View style={{ width: deviceWidth * 0.34, padding: 8 }}>
                                    <TouchableOpacity onPress={() => {
                                        this.props.navigation.navigate(screenNames.ITEM_DETAILS, { code: item.Code })
                                    }}
                                        style={{
                                            elevation: 5,
                                            backgroundColor: '#fffeff',
                                            height: deviceHeight * 0.30,
                                            borderRadius: 12
                                        }}>
                                        {/* <Text>{itemIndx}</Text> */}
                                        <View style={{ position: 'relative', width: '100%', height: '48%' }}>
                                            {this.renderProductImage(item)}
                                        </View>
                                        <View style={{
                                            backgroundColor: 'white', borderRadius: 10
                                        }}>
                                            <View style={{ position: 'relative', alignItems: 'stretch' }}>
                                                <Text
                                                    allowFontScaling={false}
                                                    lineBreakMode={false}
                                                    style={[
                                                        styles.fontFamily,
                                                        {
                                                            textAlign: 'right',
                                                            color: colors.secondaryText,
                                                            fontSize: fontSize.smaller, paddingHorizontal: 8
                                                        }
                                                    ]} >
                                                    {item.TitleName.length > 18 ? (((item.TitleName).substring(0, 18 - 3)) + '...') : item.TitleName}
                                                </Text>
                                                <Text
                                                    allowFontScaling={false}
                                                    style={[
                                                        , {
                                                            color: colors.red,
                                                            textDecorationLine: 'line-through',
                                                            fontSize: fontSize.smaller,
                                                            textAlign: 'left',
                                                            paddingHorizontal: 4,
                                                            fontFamily: fonts.BYekan
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
                            }
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
        let that = this;
        return <SearchBar placeholder="جستجو"
            inputStyle={{ direction: 'rtl', textAlign: 'right', height: 48, backgroundColor: 'white' }}
            noIcon
            autoCorrect={false}
            clearIcon={{ name: 'clear', style: { fontSize: 24 } }}
            onClearText={() => { this.setState({ cmsSearch: '' }) }}
            onSubmitEditing={() => { this.submitSearch() }}
            onChangeText={(text) =>
                this.setState({ cmsSearch: text })
            }
            value={this.state.cmsSearch}
            lightTheme />;
    }
    render() {
        if (!this.state.loading)
            return (
                <View style={{ paddingBottom: deviceHeight * 0.1 }}>
                    <FlatList
                        ListHeaderComponent={this.renderHeader}
                        data={this.state.cmsList}
                        horizontal={false}
                        showsHorizontalScrollIndicator={false}
                        pagingEnabled={true}
                        extraData={[this.state.cmsSearch]}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) =>
                            <View key={index} style={{ paddingVertical: 8 }}>
                                {this.renderCMSRow(item, index)}
                            </View>
                        }
                    />
                </View>
            );
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
        router: state.router,
        routeList: state.initial.routeList,
        deviceDimensions: state.initial.deviceDimensions,
        ...state.navigation.routes.filter(x => x.params.active)[0].params

        //setFooterVisibility, updateBasketCount, updateBasketCatalogList
    }
}
//export default connect(mapStateToProps)(SplashScreen)
export default connect(mapStateToProps, {
    setFooterVisibility, setDarkFooter, updateBasketCount,
    updateSupplierId, updateBasketCatalogList, updateRouteList
})(AdvertimentCMS)
