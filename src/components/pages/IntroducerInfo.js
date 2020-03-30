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
import { getBasketCount, backAndroid, numberWithCommas, addToBasket, getCMS, } from '../../utility';
import { deviceHeight } from '../../utility/consts';
import Header from '../common/Header';
let introducerList, skip, take, totalCount;
class IntroducerInfo extends Component {
    static navigationOptions = ({ navigation }) => ({
        header: <Header title='' navigation={navigation} />
    })
    constructor(props) {
        super(props)
        this.state = {
            loading: false
        };




        introducerList = [];
        skip = 0;
        totalCount = 0;
        take = 10;
    }
    componentDidMount() {
        this.getIntroducerInfo();
    }
    getIntroducerInfo() {
        if (!this.state.loading && (skip <= totalCount || totalCount == 0)) {
            this.setState({ loading: true })
            fetch('http://www.cheegel.com/apis/api/user/GetIntroducedUsersByUserID/' + skip + '/' + take, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json; charset=utf-8',
                    'Content-Type': 'application/json; charset=utf-8',
                }
            }).then(res => {
                res.json().then(result => {
                    if (result && result.Table && result.Table.length) {
                        totalCount = result.Table[0].TotalCount;
                        skip = introducerList.length + take
                        introducerList = [...introducerList, ...result.Table];
                    }
                    else {
                        totalCount = 0;
                        introducerList - [];
                    }
                    this.setState({ loading: false });
                })
            }).catch(err => {
                totalCount = 0;
                introducerList - [];
                this.setState({ loading: false });
            })
        }
        else
            this.setState({ loading: false });
    }
    renderItem(itemIndx) {
        const item = introducerList[itemIndx]
        return (
            <View style={{ paddingVertical: 4, width: '100%', paddingHorizontal: 8 }}>
                <View
                    style={{
                        elevation: 2,
                        backgroundColor: '#fffeff',
                        paddingTop: 2,
                    }}>
                    <View style={{ backgroundColor: '#ffffff', padding: 5 }}>
                        <View style={{ flexDirection: 'row-reverse' }}>
                            <View style={{ flex: 1, alignItems: 'center', borderLeftWidth: 1, borderLeftColor: colors.secondaryText }}>
                                <Text
                                    allowFontScaling={false}
                                    style={{
                                        textAlignVertical: 'center', fontSize: fontSize.small,
                                        textAlign: 'center',
                                        width: fontSize.large,
                                        color: colors.secondaryText,
                                        fontFamily: fonts.BYekan
                                    }}>{itemIndx + 1}</Text>
                            </View>
                            <Text
                                allowFontScaling={false}
                                style={{ flex: 5, fontSize: fontSize.normal, fontFamily: fonts.BYekan, fontSize: fontSize.small, color: colors.blue, textAlign: 'center', color: colors.textPrimary }}>{item.FirstName}</Text>
                            <Text
                                allowFontScaling={false}
                                style={{ flex: 5, fontSize: fontSize.normal, fontFamily: fonts.BYekan, fontSize: fontSize.small, color: colors.blue, textAlign: 'center', color: colors.textPrimary }}>{item.LastName}</Text>
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
                    <Text
                        allowFontScaling={false}
                        style={{ fontSize: fontSize.normal, fontFamily: fonts.BYekan, fontSize: fontSize.small, color: colors.textPrimary, textAlign: 'center', textAlign: 'center' }}>
                        لیست کابرانی که شما معرف آنها می باشید
                    </Text>
                </View>
                <FlatList
                    data={introducerList}
                    numColumns={1}
                    horizontal={false}
                    refreshing={this.state.loading}
                    onRefresh={() => {
                        skip = 0;
                        totalCount = 0;
                        introducerList = [];
                        this.getIntroducerInfo();
                    }}
                    onEndReached={() => {
                        this.getIntroducerInfo();
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
                    extraData={[this.state.loading, introducerList]}
                    onScrollToIndexFailed={() => { }}
                />
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
})(IntroducerInfo)