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
    setFooterVisibility, updateBasketCount, updateBasketCatalogList,
    updateRouteList, setDarkFooter, updateSupplierId
} from '../../actions';

import styles, { colors, fontSize } from '../../styles';
import { numberWithCommas } from '../../utility';
import { screenNames, deviceWidth, deviceHeight } from '../../utility/consts';

class ProductsInRow extends Component {
    constructor() {

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
    render() {
        return (
            <View>
                <TouchableOpacity
                    style={{
                        padding: 8,
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}
                    onPress={() => {
                        this.props.updateSupplierId(cmsRow.SupplierID)
                        this.props.navigation.navigate(screenNames.PRODUCT_GALLERY,{ CategoryCode: '0', tag: '' })
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
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) =>
                                    <View style={{ width: deviceWidth * 0.34, padding: 8 }}>
                                        <TouchableOpacity onPress={() => {
                                            this.props.navigation.navigate(screenNames.ITEM_DETAILS,{ code: item.Code })
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
                                                    <Text style={[
                                                        styles.fontFamily, {
                                                            color: colors.red,
                                                            textDecorationLine: item.DiscountPercent ? 'line-through' : 'none',
                                                            fontSize: fontSize.smaller,
                                                            textAlign: 'left',
                                                            paddingHorizontal: 4
                                                        }]} >
                                                        {item.DiscountPercent ? numberWithCommas(Math.round(item.Price / 10)) + '  تومان' : '  '}&nbsp;
    
                                                    </Text>
                                                    <Text style={[styles.fontFamily, { color: '#0097A7', paddingHorizontal: 4, textAlign: 'left' }]} >
                                                        <Text style={{ fontSize: fontSize.small, fontWeight: 'bold' }}>
                                                            {numberWithCommas(Math.round(item.Price * (100 - item.DiscountPercent) / 100 / 10))}
                                                        </Text>&nbsp;
                                                        <Text style={{ fontSize: fontSize.smaller }}>
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
const mapStateToProps = state => {
    return {
        router: state.router,
        routeList: state.initial.routeList,
        deviceDimensions: state.initial.deviceDimensions,
    }
}
export default connect(mapStateToProps, {
    setFooterVisibility, setDarkFooter, updateBasketCount,
    updateSupplierId, updateBasketCatalogList, updateRouteList
})(ProductsInRow)