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

import styles, { colors, fontSize, fonts } from '../../styles';
import { getBasketCount, backAndroid, numberWithCommas, addToBasket, getCMS } from '../../utility';
import { deviceHeight } from '../../utility/consts';
let transactionList, skip, take, totalCount, totalCostPaied, totalCostNotPaied;
class ViewQoutaDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false
        };


        skip = 0;
        totalCount = 0;
        take = 10;
        totalCostPaied = 0;
        totalCostNotPaied = 0;
        transactionList = [];
    }
    componentDidMount() {
        this.getMarketerQoutaDetails();
    }
    getMarketerQoutaDetails() {
        if (!this.state.loading && (skip <= totalCount || totalCount == 0)) {
            this.setState({ loading: true })
            fetch('http://www.cheegel.com/apis/api/user/GetMarketerQoutaDetails/' + take + '/' + skip, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json; charset=utf-8',
                    'Content-Type': 'application/json; charset=utf-8',
                }
            }).then(res => {
                res.json().then(result => {
                    if (result && result.Table) {
                        totalCount = result.Table[0].TotalCount;
                        totalCostPaied = result.Table[0].TotalPaied ? result.Table[0].TotalPaied : 0;
                        totalCostNotPaied = result.Table[0].TotalNotPaied ? result.Table[0].TotalNotPaied : 0;
                        skip = transactionList.length + take
                        transactionList = [...transactionList, ...result.Table];
                    }
                    else {
                        totalCount = 0;
                        transactionList - [];
                    }
                    this.setState({ loading: false });
                })
            }).catch(err => {
                totalCount = 0;
                transactionList - [];
                this.setState({ loading: false });
            })
        }
        else
            this.setState({ loading: false });
    }
    renderItem(itemIndx) {
        const item = transactionList[itemIndx]
        return (
            <View style={{ paddingVertical: 4, width: '100%', paddingHorizontal: 8 }}>
                <View
                    style={{
                        elevation: 2,
                        backgroundColor: '#fffeff',
                        paddingTop: 2,
                    }}>
                    <View style={{ backgroundColor: '#ffffff', padding: 5 }}>
                        <View style={{ flexDirection: 'row-reverse', alignItems: 'center' }}>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderLeftWidth: 1, borderLeftColor: colors.secondaryText }}>
                                <Text style={{
                                    textAlignVertical: 'center', fontSize: fontSize.small,
                                    textAlign: 'center',
                                    width: fontSize.large,
                                    color: colors.secondaryText,
                                    fontFamily: fonts.BYekan
                                }}>{itemIndx + 1}</Text>
                            </View>
                            <Text style={{ flex: 3, fontFamily: fonts.BYekan, fontSize: fontSize.smaller, color: colors.blue, textAlign: 'center', color: colors.textPrimary }}>{item.TrackingCode}</Text>
                            <Text style={{ flex: 4, fontFamily: fonts.BYekan, fontSize: fontSize.smaller, color: colors.blue, textAlign: 'center', color: colors.textPrimary }}>{item.RegisterShamsiDate}</Text>
                            <Text style={{ flex: 5, fontFamily: fonts.BYekan, fontSize: fontSize.small, color: colors.blue, textAlign: 'center', color: colors.textPrimary }}>{item.Cost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' ريال '}</Text>
                            <Text style={{ flex: 6, fontFamily: fonts.BYekan, fontSize: fontSize.small, color: colors.blue, textAlign: 'center', color: item.IsPay ? colors.primary : '#e5162b' }}>{item.IsPay ? 'پرداخت شده' : 'پرداخت نشده'}</Text>
                        </View>
                    </View>
                </View>
            </View >
        )
    }
    renderPage() {
        return (
            <View style={{ flex: 1, paddingBottom: deviceHeight * 0.1 }}>
                <View style={{ alignItems: 'center', paddingVertical: 20 }}>
                    <Text style={{ fontSize: fontSize.normal, fontFamily: fonts.BYekan, fontSize: fontSize.small, color: colors.textPrimary, textAlign: 'center', textAlign: 'center' }}>
                        لیست خرید هایی که با کد معرف شما انجام شده است
                    </Text>
                </View>
                <FlatList
                    data={transactionList}
                    numColumns={1}
                    horizontal={false}
                    refreshing={this.state.loading}
                    onRefresh={() => {
                        skip = 0;
                        totalCount = 0;
                        transactionList = [];
                        this.getMarketerQoutaDetails();
                    }}
                    onEndReached={() => {
                        this.getMarketerQoutaDetails();
                    }}
                    onEndReachedThreshold={9}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => this.renderItem(index)}
                    onScroll={(e) => {
                        let elemHeight = parseInt(deviceHeight * 0.5)
                        let x = e.nativeEvent
                        let contentOffset = e.nativeEvent.contentOffset;
                        let viewSize = e.nativeEvent.layoutMeasurement.height;
                        let index = (parseInt(contentOffset.y / elemHeight));
                    }}
                    extraData={[this.state.loading, transactionList]}
                    onScrollToIndexFailed={() => { }}
                />
                <View style={{ paddingBottom: 20, borderTopWidth: 1, borderTopColor: colors.secondaryText }}>
                    <View style={{ flexDirection: 'row-reverse' }}>
                        <Text style={{ flex: 3, fontFamily: fonts.BYekan, fontSize: fontSize.small, color: colors.blue, textAlign: 'center', color: colors.textPrimary }}>مجموع مبلغ پرداخت شده : </Text>
                        <Text style={{ flex: 3, fontFamily: fonts.BYekan, fontSize: fontSize.small, color: colors.blue, textAlign: 'center', color: colors.textPrimary }}>{totalCostPaied.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' ريال '}</Text>
                    </View>
                    <View style={{ flexDirection: 'row-reverse' }}>
                        <Text style={{ flex: 3, fontFamily: fonts.BYekan, fontSize: fontSize.small, color: colors.blue, textAlign: 'center', color: colors.textPrimary }}>مجموع مبلغ پرداخت نشده : </Text>
                        <Text style={{ flex: 3, fontFamily: fonts.BYekan, fontSize: fontSize.small, color: colors.blue, textAlign: 'center', color: colors.textPrimary }}>{totalCostNotPaied.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' ريال '}</Text>
                    </View>
                </View>
            </View>
        )
    }
    render() {
        return this.renderPage();
    }
}
const mapStateToProps = state => {
    return {
        router: state.router,
        routeList: state.initial.routeList,
        deviceDimensions: state.initial.deviceDimensions,
        ...state.navigation.routes.filter(x => x.params.active)[0].params
    }
}
export default connect(mapStateToProps, {
    setFooterVisibility, setDarkFooter, updateBasketCount,
    updateSupplierId, updateBasketCatalogList, updateRouteList
})(ViewQoutaDetails)