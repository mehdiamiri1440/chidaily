import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    ActivityIndicator,
    TouchableWithoutFeedback,
    ListView,
    FlatList, BackHandler
} from 'react-native';
import { connect } from 'react-redux';
import { updateBasketCount, setFooterVisibility, setDarkFooter, updateRouteList } from '../../actions';
import styles, { colors, fonts, fontSize } from '../../styles';
import {
    consts, getBasketCount, getBasketCalatogs,
    getBasket, LoadedBasket, backAndroid
} from '../../utility';
import { Card } from 'native-base'
import { List, ListItem, Avatar, Icon, Overlay, SearchBar, Button } from 'react-native-elements';
import { screenNames, deviceHeight, nodeApiServer } from '../../utility/consts';
import Header from '../common/Header';
let skip, take, loading, totalCount;
let basketCalatogList = []

class Product extends Component {
    static navigationOptions = ({ navigation }) => ({
        header: <Header title='پیشنهاد های ویژه' navigation={navigation} />
    })
    constructor(props) {
        super(props)
        this.state = {
            basket: this.props.basketCatalogList ? this.props.basketCatalogList : [],
            loading: false
        }
        
        getBasketCount().then(count => {
            this.props.updateBasketCount(count)
        })
        
       
        
    }
    componentDidMount() {
        skip = this.props.basketCatalogList ? this.props.basketCatalogList.length : 0, take = 10, loading = false, totalCount = 0;
        if (!this.state.basket.length)
            this.getBasket()
    }
    getBasket = () => {
        return new Promise((fullFill, eject) => {
            if (!this.state.loading && (skip <= totalCount || totalCount == 0)) {
                this.setState({ loading: true })
                getBasketCalatogs(nodeApiServer, skip, take).then(basketCalatogList => {
                    if (basketCalatogList) {
                        skip += take
                        let x = this.state.basket.concat(basketCalatogList)

                        this.setState({ loading: false, basket: x })
                        if (totalCount)
                            totalCount = basketCalatogList[0].TotalCount;
                    }
                    fullFill(true)
                })
            }
            else {
                this.setState({ loading: false });
                fullFill([])
            }
        })
    }
    callShowBuyItNow(masterCode) {
        this.props.navigation.navigate(screenNames.BUY_IT_NOW,{ masterCode: masterCode, detailCode: 0 })
    }
    callShowDetail(code) {
        this.props.navigation.navigate(screenNames.ITEM_DETAILS,{code })
    }
    render() {
        //if (this.state.basket.length > 0)
        return (
            <View style={{ flex: 1, paddingBottom: deviceHeight * 0.1 }}>
                <FlatList
                    data={this.state.basket}
                    refreshing={this.state.loading}
                    onRefresh={() => {
                        totalCount = 0;
                        skip = 0;
                        this.getBasket();
                    }
                    }
                    onEndReached={() => {
                        this.getBasket();
                    }}
                    onEndReachedThreshold={0.5}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) =>
                        <TouchableWithoutFeedback onPress={
                            () => {
                                this.callShowDetail(item.MasterCode)
                            }}
                            style={{ flex: 1, paddingHorizontal: 8 }}>
                            <View style={{ paddingHorizontal: 8, paddingVertical: 16 }}>
                                <Card style={{ backgroundColor: 'white', flex: 1, padding: 16, borderRadius: 8 }}>
                                    <View style={{ width: "100%", height: 300 }}>
                                        <Image
                                            style={{ flex: 1, width: null, height: null, resizeMode: "contain" }}
                                            source={{ uri: `http://www.cheegel.com/apis/UploadedFiles/CheegelCacheImages/SizeType3/${item.ProductImage}.png` }}
                                        />
                                    </View>
                                    <Text style={[styles.fontFamily, { fontSize: 24, color: 'black' }]}>{item.Title}</Text>
                                    <View style={{ display: 'flex', flexDirection: 'row' }}>
                                        <Text style={[styles.fontFamily, { fontSize: 17, color: colors.primary, textAlignVertical: "center" }]}> تومان</Text>
                                        <Text style={[styles.fontFamily, { fontSize: 35, color: colors.primary }]}>
                                            <Text style={{ fontWeight: "bold" }}>{((item.Price / 10) + "").replace(/\B(?=(?:\d{3})+(?!\d))/g, ',')}</Text>
                                        </Text>
                                    </View>
                                    <View style={{ flexDirection: 'column' }}>
                                        <Text style={[styles.fontFamily, { flex: 1, color: colors.textPrimary, textAlign: 'right', fontWeight: "bold", marginTop: 5, fontSize: 17 }]}>
                                            سبد شامل اقلام زیر :
                                    </Text>
                                        {item.details.map((d, j) => {
                                            return (
                                                <View style={{ display: 'flex', flexDirection: 'row-reverse', paddingLeft: 5, paddingRight: 5 }} key={j}>
                                                    <View style={{ flex: 3, padding: 2 }}>
                                                        <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.fontFamily, { textAlign: 'right', color: colors.textPrimary, fontSize: 16 }]}>{d.Title}</Text>
                                                    </View>
                                                    <View style={{ flex: 2, padding: 2 }}>
                                                        <Text style={[styles.fontFamily, { textAlign: 'right', color: colors.textPrimary, fontSize: 14, paddingRight: 24 }]}>{d.Quantity + ' ' + (d.Unit == null ? 'عدد' : d.Unit)}</Text>
                                                    </View>
                                                    <View style={{ flex: 1, padding: 2 }}>
                                                        <Text style={[styles.fontFamily, { textAlign: 'left', color: colors.textPrimary, fontSize: 17 }]}>{((d.Price * d.Quantity / 10) + "").replace(/\B(?=(?:\d{3})+(?!\d))/g, ',')}</Text>
                                                    </View>
                                                </View>
                                            )
                                        })}
                                    </View>
                                    <View style={{ width: "100%", alignItems: 'center', paddingTop: 15 }}>
                                        <Button
                                            onPress={() => this.callShowBuyItNow(item.MasterCode)}
                                            title="الان بخرید"
                                            color={'white'}
                                            fontFamily={fonts.BYekan}
                                            buttonStyle={{
                                                backgroundColor: colors.primary,
                                                width: 250,
                                                borderRadius: 4,
                                                paddingVertical: 8
                                            }}
                                        />
                                    </View>
                                </Card>
                            </View>
                        </TouchableWithoutFeedback>
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
        ...state.navigation.routes.filter(x => x.params.active)[0].params
    }
}

//export default connect(mapStateToProps)(Product)
export default connect(mapStateToProps, { updateBasketCount, setFooterVisibility, setDarkFooter, updateRouteList })(Product)