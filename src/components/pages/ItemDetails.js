import React, { Component } from 'react';
import {
    ScrollView, Image, View, Text, FlatList,
    TouchableOpacity, ActivityIndicator, BackHandler
} from 'react-native';
import { connect } from 'react-redux';
import { updateBasketCount, showFooter } from '../../actions';
import { Card, CardItem, Icon } from 'native-base';
import styles, { colors, fontSize, fonts } from '../../styles';
import { addToBasket, getBasketCount, backAndroid, numberWithCommas } from '../../utility';
import { PlusButton } from '../common/PlusButton'
import { screenNames, deviceWidth, deviceHeight, nodeApiServer, imageServerSize2, imageServerSize4 } from '../../utility/consts';
import Header from '../common/Header';

class ItemDetails extends Component {
    static navigationOptions = ({ navigation }) => ({
        header: <Header title={navigation.state.params.code ? navigation.state.params.code : 'جزییات محصول'} navigation={navigation} />
    })
    constructor(props) {
        super(props)
        this.state = {
            title: '',
            brand: '',
            price: 0,
            categoryCode: null,
            discount: {
                Percent: 0,
                StartDate: '',
                EndDate: ''
            },
            code: this.props.code ? this.props.code : 'CHE-041FCDBB',
            properties: [],
            quantity: 1,
            imageList: [],
            defaultImage: '',
            remainQuantity: 1,
            supplierID: 0,
            details: [],
            similarProducts: []
        }
    }
    componentDidMount() {
        fetch(`${nodeApiServer}productserviceecatalog/${this.state.code}`).then(response => {
            response.json().then(resultArray => {
                //console.warn(resultArray[1][0].CategorySiteMap.split('@')[1].split('^')[0])
                this.setState({
                    title: resultArray[0].filter(prop => prop.PropertyName == 'Title')[0].LocalValue,
                    brand: resultArray[0].filter(prop => prop.PropertyName == 'Brand')[0].LocalValue,
                    price: resultArray[1][0].MinPrice,
                    properties: resultArray[0],
                    imageList: resultArray[2],
                    defaultImage: resultArray[2].filter(x => x.IsDefualt)[0].GUID ? resultArray[2].filter(x => x.IsDefualt)[0].GUID : resultArray[2][0].GUID,
                    remainQuantity: resultArray[1][0].RemainQuantity,
                    supplierID: resultArray[1][0].SupplierID,
                    categoryCode: resultArray[1][0].CategorySiteMap.split('@')[1].split('^')[0]
                })
                fetch(`${nodeApiServer}getProductServicesEcatalogMasterRelation/${this.state.code}`).then(response => {
                    response.json().then(details => {
                        if (details && details.length)
                            this.setState({ details: details })
                    })
                })
                let similarProductsFilter = {
                    "sort": 3,
                    "property": [],
                    "pageIndex": 1,
                    "totalCount": 0,
                    "productType": 0,
                    "categoryCode": this.state.categoryCode.toString(),
                    "freeShipping": false,
                    "discount": false,
                    "brand": "0",
                    "tag": "0",
                    "supplierID": "0",
                    "minPrice": 0,
                    "maxPrice": 0,
                    "skip": 0,
                    "take": 8,
                    "moneyUnit": "IRR",
                    "language": "FA",
                    "isFamilyBasket": false
                }
                fetch(`${nodeApiServer}products`, {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(similarProductsFilter)
                }).then(response => {
                    response.json().then(similarProducts => {
                        if (similarProducts.Products && similarProducts.Products.length) {
                            // console.warn(similarProducts.Products[0])
                            this.setState({ similarProducts: similarProducts.Products })
                        }

                    })
                })
            })
        })
        fetch(`${nodeApiServer}getProductDiscount/${this.state.code}`).then(response => {
            response.json().then(discountResult => {
                if (discountResult && discountResult.length && discountResult[0].HaveDiscount) {
                    let maxPercentIndx = 0
                    discountResult.map((x, ind) => {
                        if (x.Percent > discountResult[maxPercentIndx].Percent)
                            maxPercentIndx = ind
                    })
                    if (discountResult[maxPercentIndx].Percent)
                        this.setState({ discount: discountResult[maxPercentIndx] })
                }

            })
        })
    }
    changeQuantity = type => {
        if (type == 'add' && this.state.quantity < 10)
            this.setState({ quantity: this.state.quantity + 1 })
        else if (type == 'min' && this.state.quantity > 1)
            this.setState({ quantity: this.state.quantity - 1 })
    }
    showPrice(type) {
        if (type == 'original')
            return Math.ceil(this.state.price / 10).toString().replace(/\B(?=(?:\d{3})+(?!\d))/g, ',')
        else
            return Math.ceil((this.state.price * (100 - this.state.discount.Percent) / 100) / 10).toString().replace(/\B(?=(?:\d{3})+(?!\d))/g, ',')
    }
    addToBasketClicked = () => {
        let item = {
            ItemID: this.state.code + '-1',
            TitleLocal: this.state.title,
            BrandLocal: this.state.brand,
            Image: this.state.defaultImage,
            Qty: this.state.quantity,
            MinQty: 1,
            MaxQty: 1000,
            UnitOriginalPrice: this.state.price,
            TotalPrice: this.state.price * this.state.quantity,
            SupplierID: this.state.supplierID,
            DiscountPercent: this.state.discount.Percent,
            DiscountStartDate: this.state.discount.StartDate,
            DiscountEndDate: this.state.discount.EndDate
        }
        addToBasket(item, "itemdetail", this.state.categoryCode, null).then(res => {
            getBasketCount().then(count => {
                this.props.updateBasketCount(count)
            })
        })
    }
    renderImages = () => {
        return (
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                height: deviceWidth
            }}>
                <Image
                    style={{
                        width: '100%',
                        height: '100%'

                    }}
                    resizeMode='contain'
                    source={{
                        uri: `${imageServerSize4}${this.state.defaultImage}.png`
                        //uri: 'https://www.cheegel.com/apis/Handlers/FileHandler.ashx?type=4&id=' + this.state.defaultImage
                    }}
                />
            </View>

        )
    }
    renderBrandAndCodeRow = () => {
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                {this.renderProductCode()}
                {this.renderBrand()}
            </View>
        )
    }
    renderTitle = () => {
        return (
            <Text
                allowFontScaling={false}
                style={[styles.fontFamily, {
                    paddingVertical: 4,
                    fontSize: 16,
                    color: colors.textPrimary
                }]}>{this.state.title}</Text>
        )
    }
    renderProductCode = () => {
        return (
            <Text
                allowFontScaling={false}
                style={{
                    fontSize: 14,
                    color: colors.secondaryText
                }}>
                <Text
                    allowFontScaling={false}
                    style={styles.fontFamily}>کد کالا:</Text>&nbsp;
                <Text
                    allowFontScaling={false}
                    style={{ fontWeight: 'bold' }}>{this.state.code}</Text>
            </Text>
        )
    }
    renderBrand = () => {
        return (
            <Text
                allowFontScaling={false}
                style={[styles.fontFamily, {
                    fontSize: 16,
                    color: colors.secondaryText
                }]}>{this.state.brand}</Text>
        )
    }
    renderTitleAndBrand = () => {
        return (
            <View style={{
                alignItems: 'stretch',
                paddingVertical: 8,
            }}>
                {this.renderTitle()}
                {this.renderBrandAndCodeRow()}

            </View>
        )
    }
    renderOriginalPrice() {
        if (this.state.discount.Percent)
            return (
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <Text
                        allowFontScaling={false}
                        style={[styles.fontFamily, {
                            flex: 1,
                            color: colors.red,
                            textAlign: 'left',
                            textDecorationLine: 'line-through',
                            textDecorationStyle: 'double'
                        }]}>
                        <Text
                            allowFontScaling={false}
                            style={{
                                fontSize: fontSize.small,
                                fontFamily: fonts.BYekan
                            }}>
                            {this.showPrice('original')}
                        </Text>
                        <Text
                            allowFontScaling={false}
                            style={{
                                fontSize: fontSize.smaller,
                            }}>&nbsp;تومان
                        </Text>
                    </Text>
                </View>
            )
    }
    renderPrice = () => {
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <Text
                    allowFontScaling={false}
                    style={[styles.fontFamily, {
                        flex: 1,
                        color: colors.primary,
                        textAlign: 'left'
                    }]}>
                    <Text
                        allowFontScaling={false}
                        style={{
                            fontSize: 32,
                            fontFamily: fonts.BYekan
                        }}>
                        {this.showPrice()}
                    </Text>
                    <Text
                        allowFontScaling={false}
                        style={{
                            fontSize: 24,
                        }}>&nbsp;
                        تومان
                </Text>
                </Text>
            </View>
        )

    }
    renderMainCard = () => {
        return (
            <Card style={[styles.card, { paddingBottom: 16 }]}>
                {this.renderImages()}
                {this.renderTitleAndBrand()}
                {this.renderOriginalPrice()}
                {this.renderPrice()}
            </Card>
        )
    }
    renderDetails = () => {
        if (this.state.details && this.state.details.length)
            return (
                <Card style={{ flex: 1, padding: 8, borderRadius: 8 }}>
                    {this.state.details.map((d, j) => {
                        return (
                            <View style={{ display: 'flex', flexDirection: 'row-reverse', paddingLeft: 5, paddingRight: 5, marginBottom: 10, marginTop: 10 }} key={j}>
                                <View style={{ flex: 1 }}>
                                    <Image
                                        style={{
                                            alignSelf: 'flex-start',
                                            height: 50,
                                            width: 50,
                                            resizeMode: 'contain',
                                            borderRadius: 50
                                        }}
                                        source={{
                                            uri: `${imageServerSize2}${d.MasterImage}.png`
                                            //uri: `http://www.cheegel.com/apis/Handlers/FileHandler.ashx?type=4&id=${d.MasterImage}`
                                        }}
                                    />
                                </View>
                                <View style={{ flex: 2, padding: 2 }}>
                                    <Text
                                        allowFontScaling={false}
                                        numberOfLines={1} ellipsizeMode="tail" style={[styles.fontFamily, { height: 50, textAlignVertical: 'center', textAlign: 'right', color: colors.textPrimary, fontSize: 14, paddingRight: 12 }]}>{d.TranslateValue}</Text>
                                </View>
                                <View style={{ flex: 1, padding: 2 }}>
                                    <Text
                                        allowFontScaling={false}
                                        style={[styles.fontFamily, { height: 50, textAlignVertical: 'center', textAlign: 'right', color: colors.textPrimary, fontSize: 14, paddingRight: 12 }]}>{d.Count} </Text>
                                </View>
                                <View style={{ flex: 1, padding: 2 }}>
                                    <Text
                                        allowFontScaling={false}
                                        style={[styles.fontFamily, { height: 50, textAlignVertical: 'center', textAlign: 'left', color: colors.textPrimary, fontSize: 14 }]}>{((d.Price / 10) + "").replace(/\B(?=(?:\d{3})+(?!\d))/g, ',')}</Text>
                                </View>
                            </View>
                        )
                    })}
                </Card>
            )
    }
    renderQuantity = () => {
        return (
            <View style={{
                flex: 2,
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 4
            }}>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <PlusButton isMinimize onPress={() => { this.changeQuantity('min') }} />
                </View>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text
                        allowFontScaling={false}
                        style={[{ fontSize: 24, textAlignVertical: 'center', color: '#333', fontFamily: fonts.BYekan }]}>{this.state.quantity}</Text>
                </View>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <PlusButton onPress={() => { this.changeQuantity('add') }} />
                </View>
            </View>
        )
    }
    renderAddToBasketButton = () => {

        return (
            <View style={{ alignItems: 'stretch', flex: 3 }}>
                <TouchableOpacity style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                    backgroundColor: colors.primary,
                    paddingVertical: 8,
                    borderRadius: 4
                }}
                    onPress={() => { this.addToBasketClicked() }}>
                    <Text
                        allowFontScaling={false}
                        style={[styles.fontFamily, { fontSize: fontSize.small, paddingHorizontal: 8, color: 'white' }]}>اضافه کردن به سبد خرید</Text>
                    <Icon
                        allowFontScaling={false}
                        name='md-basket' fontSize={24} style={{ color: 'white' }} />
                </TouchableOpacity>
            </View>
        )

    }
    renderBasketArea = () => {
        if (!this.state.details || !this.state.details.length)
            return (
                <Card style={styles.card}>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingVertical: 8
                    }}>
                        {this.renderQuantity()}
                        {this.renderAddToBasketButton()}
                    </View>

                </Card>
            )
        else
            return (
                <Card style={[styles.card]}>
                    <View style={{ alignItems: 'stretch', flex: 3, padding: 32 }}>
                        <TouchableOpacity style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'row',
                            backgroundColor: colors.primary,
                            paddingVertical: 8,
                            borderRadius: 4
                        }}
                            onPress={() => {
                                this.props.navigation.navigate(screenNames.BUY_IT_NOW, { masterCode: this.state.code, detailCode: 0 })
                            }}>
                            <Text
                                allowFontScaling={false}
                                style={[
                                    styles.fontFamily, {
                                        fontSize: 16, paddingHorizontal: 8, color: 'white'
                                    }
                                ]}>الان بخرید</Text>
                            <Icon
                                allowFontScaling={false}
                                name='md-basket' fontSize={24} style={{ color: 'white' }} />
                        </TouchableOpacity>
                    </View>
                </Card>
            )
    }
    renderShippingPrice = () => {
        return (
            <Card style={styles.card}>
                <View style={{ paddingVertical: 8 }}>
                    <View style={{ paddingVertical: 4 }}>
                        <Text allowFontScaling={false} style={[styles.fontFamily, { fontSize: 16 }]}>
                            <Text
                                allowFontScaling={false}
                            >ارسال در کمتر از</Text>&nbsp;
                            <Text
                                allowFontScaling={false}
                                style={{ fontWeight: 'bold' }}>2 ساعت</Text>&nbsp;
                            <Text
                                allowFontScaling={false}
                            >با قیمت</Text>&nbsp;
                            <Text
                                allowFontScaling={false}
                                style={{ fontWeight: 'bold' }}>4,000 تومان</Text>
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row-reverse', alignItems: 'center', paddingVertical: 4 }}>
                        <Icon
                            allowFontScaling={false}
                            name='md-information-circle' style={{ paddingHorizontal: 4, color: colors.primary }} />
                        <Text
                            allowFontScaling={false}
                            style={{ fontSize: 12, paddingVertical: 8, color: colors.primary }}>
                            <Text
                                allowFontScaling={false}
                            >هزینه ارسال سبدهای بالای</Text>&nbsp;
                            <Text
                                allowFontScaling={false}
                                style={{ fontWeight: 'bold' }}>50,000 تومان</Text>&nbsp;
                            <Text
                                allowFontScaling={false}
                                style={{ fontWeight: 'bold' }}>رایگان</Text>
                            <Text>میباشد.</Text>
                        </Text>
                    </View>
                </View>
            </Card>
        )
    }
    renderDescription = () => {
        return (
            <Card style={styles.card}>
                <View style={{ paddingVertical: 8 }}>
                    {this.state.properties.filter(prop => prop.PropertyName.toLowerCase() != 'producing country').map(p =>
                        <View key={p.ID} style={{ paddingVertical: 4 }}>
                            <Text style={[styles.fontFamily, styles.descriptionRow]}>
                                <Text
                                    allowFontScaling={false}
                                    style={{ fontWeight: 'bold' }}>{p.LocalPropertyName}:</Text>
                                <Text>&nbsp;{p.LocalValue ? p.LocalValue : p.TextValue}</Text>
                            </Text>
                        </View>
                    )}
                </View>

            </Card>
        )
    }
    renderProduct() {
        if (this.state.title)
            return (
                <View style={{ flex: 1 }}>
                    <ScrollView style={{}}>
                        {this.renderMainCard()}
                        {this.renderDetails()}
                        {/* {this.renderShippingPrice()} */}
                        {this.renderBasketArea()}
                        {this.renderSimilarProducts()}
                        {this.renderDescription()}
                    </ScrollView>
                </View>
            )
        else
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size={64} />
                </View>
            )
    }
    renderSimilarProducts() {
        const header = () => {
            return (<Text
                lineBreakMode='tail'
                numberOfLines={1}
                style={[
                    styles.fontFamily,
                    {
                        textAlign: 'right',
                        color: colors.secondaryText,
                        fontSize: fontSize.small, paddingHorizontal: 8
                    }
                ]} >
                کالاهای مشابه
            </Text>)
        }
        const productImage = (item) => {
            return (
                <View style={{ position: 'relative', width: '100%', height: '70%' }}>
                    <Image resizeMode='contain'
                        style={{
                            width: '100%', height: '100%'
                        }}
                        source={{ uri: `${imageServerSize2}${item.Images[0]}.png` }} />

                </View>
            )
        }
        const renderTitleAndPrice = (item) => {
            return (
                <View style={{
                    backgroundColor: 'white', borderRadius: 10, height: '30%'
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
                                    fontSize: fontSize.smaller,
                                    paddingHorizontal: 4
                                }
                            ]} >
                            {item.LocalTitle}
                        </Text>

                        <Text style={[styles.fontFamily,
                        { color: colors.primary, paddingHorizontal: 4, textAlign: 'left' }]} >
                            <Text
                                allowFontScaling={false}
                                style={{ fontSize: fontSize.small, fontFamily: fonts.BYekan }}>
                                {numberWithCommas(Math.round(item.MaxPrice / 10))}
                            </Text>&nbsp;
                            <Text
                                allowFontScaling={false}
                                style={{ fontSize: fontSize.smaller }}>
                                تومان
                            </Text>
                        </Text>
                    </View>
                </View>
            )
        }
        const similarProducts = (item) => {
            // console.warn("item.MasterCode", item);
            return (
                <View style={{ width: deviceWidth * 0.40, paddingHorizontal: 4, paddingVertical: 16 }}>
                    <TouchableOpacity onPress={() => {
                        this.props.navigation.navigate(screenNames.ITEM_DETAILS, { code: item.ItemID })
                    }}
                        style={{
                            elevation: 5,
                            backgroundColor: '#fffeff',
                            height: deviceHeight * 0.24,
                            borderRadius: 4
                        }}>
                        {productImage(item)}
                        {renderTitleAndPrice(item)}
                    </TouchableOpacity>
                </View>
            )
        }

        return (
            <View>
                {header()}
                <FlatList
                    //refreshing={this.state.loading}
                    inverted={true}
                    data={this.state.similarProducts}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => similarProducts(item)}
                />
            </View>
        )
    }
    render() {
        return this.renderProduct()
    }
}
const mapStateToProps = state => {
    // let params = {}
    // console.warn(state.navigation.routes.filter(x => x.params.active)[0].params)
    // if (state.navigation && state.navigation.state && state.navigation.state.params)
    //     params = state.navigation.state.params
    return {
        ...state.navigation.routes.filter(x => x.params.active)[0].params
    }
}
export default connect(mapStateToProps, { updateBasketCount, showFooter })(ItemDetails)