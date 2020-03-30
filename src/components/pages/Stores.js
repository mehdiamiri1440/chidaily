import React, { Component } from 'react';
import {
    View,
    Text,
    ScrollView,
    BackHandler,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    Picker,
    ToastAndroid,
    AsyncStorage
} from 'react-native';
import { connect } from 'react-redux';
import { Card, Input, InputGroup } from 'native-base'
import { Icon } from 'react-native-elements';
import styles, { fonts, colors, fontSize } from '../../styles';
import { getStoresList, getCitiesList, consts, backAndroid, } from '../../utility'
import { setFooterVisibility, updateRouteList, updateSupplierId, updateStoresList, updateCityId } from '../../actions';
import { screenNames, deviceWidth, deviceHeight } from '../../utility/consts';
import Header from '../common/Header';
class Stores extends Component {
    static navigationOptions = ({ navigation }) => ({
        header: <Header title='سبد های ویژه' navigation={navigation} />
    })
    constructor(props) {
        super(props)
        this.state = {
            storesList: this.props.storesList && this.props.storesList.length > 0 ? this.props.storesList : [],
            Cities: [],
            CityID: 0
        }



    }
    componentDidMount() {
        let that = this;
        getCitiesList().then(response => {
            that.setState({ Cities: response });
            if (response.length == 1) {
                getStoresList(that, response[0].ID).then(res => {
                    that.setState({ storesList: res, CityID: response[0].ID });
                });
            }
        });
    }
    renderStore(cityId) {
        getStoresList(that, cityId).then(res => {
            that.setState({ storesList: res, CityID: cityId });
        });
    }


    selectStore(supplierId) {
        let that = this;
        let selectedStore = this.state.storesList.filter(function (element) { return element.SupplierID == supplierId })[0];
        let selectedCity = that.state.Cities.filter(function (element) { return element.ID == that.state.CityID })[0];
        AsyncStorage.getItem(consts.userInitial).then(userInitialString => {
            let userInitial = {}
            if (userInitialString)
                userInitial = JSON.parse(userInitialString)
            userInitial.SupplierID = supplierId;
            userInitial.CityID = this.props.cityId ? this.props.cityId : this.state.CityID;
            AsyncStorage.setItem(consts.userInitial, JSON.stringify(userInitial)).then(() => {
                this.props.updateSupplierId(supplierId)
                if (!this.props.cityId) {
                    this.props.updateCityId(this.props.cityId ? this.props.cityId : this.state.CityID);
                    this.props.navigation.navigate(screenNames.CMS)
                }
                else {
                    this.props.updateCityId(this.props.cityId ? this.props.cityId : this.state.CityID);
                    this.props.navigation.navigate(screenNames.PRODUCT_GALLERY, { SupplierID: supplierId, CategoryCode: '0', tag: '' })
                }
            })
        })
    }
    renderPage() {
        if (this.props.cityId > 0) {
            return (
                <ScrollView style={{ marginBottom: deviceHeight * 0.11 }}>
                    {
                        this.state.storesList.map((store, indx) => {
                            return (
                                <View key={store.SupplierID} style={{ backgroundColor: indx == 0 ? '#ffffff' : (indx % 2 == 0 ? '#ffffff' : '#f1f2f6'), flexDirection: 'row-reverse', borderBottomWidth: 1, borderColor: '#d1d1d1', padding: 20 }}>
                                    <TouchableOpacity style={{ flexDirection: 'row-reverse' }} onPress={() => { this.selectStore(store.SupplierID) }} >
                                        <Image source={{ uri: store.ImageUrl }} style={{ width: deviceWidth * 0.11, height: deviceWidth * 0.11 }} />
                                        <Text
                                            allowFontScaling={false}
                                            style={{ fontSize: fontSize.normal, fontFamily: fonts.BYekan, color: colors.secondaryText, lineHeight: 37, paddingHorizontal: 8 }}>{store.Name}</Text>
                                    </TouchableOpacity>
                                </View>
                            )
                        })
                    }
                </ScrollView>
            )
        }
        else
            return (
                <ScrollView>
                    <View style={{ flex: 1, paddingVertical: 4 }}>
                        <View style={{ flexDirection: 'row-reverse' }}>
                            <View style={{ flex: 5, paddingTop: 8 }}>
                                <Text style={{ fontFamily: fonts.BYekan, fontSize: fontSize.small, color: colors.secondaryText, paddingRight: 10 }}>شهر خود را انتخاب نمایید</Text>
                            </View>
                            <View style={{ flex: 5 }}>
                                <Picker
                                    onValueChange={(itemValue, itemIndex) => { renderStore(itemValue) }}
                                    selectedValue={this.state.CityID}>
                                    {this.state.Cities.map((item, key) => (
                                        <Picker.Item color={colors.primary} label={item.Name} value={item.ID} key={item.ID} />)
                                    )}

                                </Picker>
                            </View>
                        </View>
                    </View>
                    <Card style={{ borderRadius: 4, height: this.state.deviceHeight * 0.7 * 0.65 }}>
                        <View style={{ paddingVertical: 10 }}>
                            <Text style={{ fontFamily: fonts.BYekan, fontSize: fontSize.small, color: colors.secondaryText, paddingRight: 10, textAlign: 'right' }}>فروشگاه خود را انتخاب نمایید</Text>
                        </View>
                        {
                            this.state.storesList.map((store, indx) => {
                                return (
                                    <View key={store.SupplierID} style={{ backgroundColor: indx == 0 ? '#ffffff' : (indx % 2 == 0 ? '#ffffff' : '#f1f2f6'), flexDirection: 'row-reverse', borderBottomWidth: 1, borderColor: '#d1d1d1', padding: 20 }}>
                                        <TouchableOpacity style={{ flexDirection: 'row-reverse' }} onPress={() => { this.selectStore(store.SupplierID) }} >
                                            <Image source={{ uri: store.ImageUrl }} style={{ width: deviceWidth * 0.11, height: deviceWidth * 0.11 }} />
                                            <Text style={{ fontSize: fontSize.normal, fontFamily: fonts.BYekan, color: colors.secondaryText, lineHeight: 37, paddingHorizontal: 8 }}>{store.Name}</Text>
                                        </TouchableOpacity>
                                    </View>
                                )
                            })
                        }
                    </Card>
                </ScrollView>
            )
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                {this.renderPage()}
            </View>
        )
    }
}
const mapStateToProps = state => {
    return {
        routeList: state.initial.routeList,
        deviceDimensions: state.initial.deviceDimensions,
        storesList: state.initial.storesList,
        cityId: state.initial.cityId,
        ...state.navigation.routes.filter(x => x.params.active)[0].params
    }
}

export default connect(mapStateToProps, { setFooterVisibility, updateRouteList, updateSupplierId, updateStoresList, updateCityId })(Stores)