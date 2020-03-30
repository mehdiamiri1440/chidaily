import React, { Component } from 'react';
import { View, TouchableOpacity, Image, Text, BackHandler, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { setDarkFooter, setFooterVisibility, updateRouteList, showFooter } from '../../actions';
import styles, { colors, fontSize } from '../../styles';
import { backAndroid, } from '../../utility'
import { screenNames, deviceWidth, deviceHeight } from '../../utility/consts';

class Category extends Component {
    static navigationOptions = () => ({
        header: null
    })
    constructor(props) {
        super(props);
        this.state = {
            listCategory: []
        }
        this.props.showFooter(true)
    }

    componentDidMount() {
        this.setState({
            listCategory: this.props.categoriesList
                .filter(x => x.SupplierID.indexOf(this.props.supplierId) != -1)
        })
    }
    renderCategory = (categoryName, icon, categoryCode, supplierID) => {
        return (
            <View style={{ padding: 12 }}>
                <TouchableOpacity onPress={() => { this.callProductGallery(categoryCode, supplierID, categoryName) }} style={{ display: 'flex', width: deviceWidth * 0.44, backgroundColor: colors.purple, borderColor: 'white', borderWidth: 1, borderRadius: 12, height: deviceWidth * 0.44 }}>
                    <View style={{ position: 'relative', width: '100%' }}>
                        <Image resizeMode='contain' style={{ position: 'absolute', top: deviceWidth * 0.20 - deviceWidth * 0.1, width: '100%', height: deviceWidth * 0.2 }} source={{ uri: 'http://www.cheegel.com/Content/Images//MobileCategoryImages/' + icon, cache: 'only-if-cached', }} />
                    </View>
                    <View style={{ width: '100%', position: 'absolute', bottom: 0, alignItems: 'center' }}>
                        <Text
                            allowFontScaling={false}
                            style={[styles.fontFamily, { position: 'absolute', bottom: 10, fontSize: fontSize.normal, color: '#e5e4ea' }]}>{categoryName}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
    callRenderCategry = (itemIndx) => {
        const item = this.state.listCategory[itemIndx]
        return this.renderCategory(item.LocalName, item.Name, item.CategoryCode, this.props.supplierId)
    }
    callProductGallery(categoryCode, supplierID, categoryName) {
        this.props.navigation.navigate(screenNames.PRODUCT_GALLERY, { CategoryCode: categoryCode, SupplierID: supplierID, tag: '', catName: categoryName })
    }
    render() {
        return (
            <View style={{ flex: 1, paddingBottom: deviceHeight * 0.1, backgroundColor: colors.purple }}>
                <FlatList
                    data={this.state.listCategory}
                    extraData={[]}
                    numColumns={2}
                    horizontal={false}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => this.callRenderCategry(index)}
                />
            </View>
        );
    }
}
const mapStateToProps = state => {
    return {
        routeList: state.initial.routeList,
        deviceDimensions: state.initial.deviceDimensions,
        categoriesList: state.initial.categoriesList,
        supplierId: state.initial.supplierId,
        ...state.navigation.routes.filter(x => x.params.active)[0].params
    }
}

export default connect(mapStateToProps, { setDarkFooter, setFooterVisibility, updateRouteList, showFooter })(Category)