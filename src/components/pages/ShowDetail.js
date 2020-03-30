import React, { Component } from 'react';
import {
    View, Image,
    ScrollView, FlatList, Text, Dimensions, BackHandler
} from 'react-native';
import { connect } from 'react-redux';
import { showDetail, updateRouteList } from '../../actions';

import { Button } from 'react-native-elements';
// import { Container, Header, Content, List, ListItem, Left, Body, Right, Thumbnail, Text } from 'native-base';
import styles, { colors } from '../../styles';
import { Card, Content } from 'native-base';
class ShowDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            basket: []
        }
    }
    componentDidMount() {
    }
    render() {
        return (
            <Card style={{ flex: 1, width: "95%", alignSelf: 'center', padding: 8, borderRadius: 8 }}>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 20, color: 'black', textAlign: 'right', padding: 8 }}>
                        این سبد شامل محصولات زیر می باشد :
                    </Text>
                </View>
                {this.state.basket.map((d, j) => {
                    return (
                        <View style={{ display: 'flex', flexDirection: 'row-reverse', paddingLeft: 5, paddingRight: 5, marginBottom: 10, marginTop: 10 }} key={j}>
                            <View style={{ flex: 1 }}>
                                <Image
                                    style={{
                                        alignSelf: 'flex-start',
                                        height: 50,
                                        width: '100%',
                                        resizeMode: 'stretch',
                                    }}
                                    source={{ uri: `http://www.cheegel.com/apis/Handlers/FileHandler.ashx?type=4&id=${d.MasterImage}` }}
                                />
                            </View>
                            <View style={{ flex: 2, padding: 2 }}>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.fontFamily, { height: 50, textAlignVertical: 'center', textAlign: 'right', color: colors.textPrimary, fontSize: 14, paddingRight: 12 }]}>{d.Title}</Text>
                            </View>
                            <View style={{ flex: 1, padding: 2 }}>
                                <Text style={[styles.fontFamily, { height: 50, textAlignVertical: 'center', textAlign: 'right', color: colors.textPrimary, fontSize: 14, paddingRight: 12 }]}>{d.Count} {d.Unit}</Text>
                            </View>
                            <View style={{ flex: 1, padding: 2 }}>
                                <Text style={[styles.fontFamily, { height: 50, textAlignVertical: 'center', textAlign: 'left', color: colors.textPrimary, fontSize: 14 }]}>{((d.Price / 10) + "").replace(/\B(?=(?:\d{3})+(?!\d))/g, ',')}</Text>
                            </View>
                        </View>
                    )
                })}
            </Card>
        )

    }
}
const mapStateToProps = state => {
    return {
        routeList: state.initial.routeList,
        deviceDimensions: state.initial.deviceDimensions,
        ...state.navigation.routes.filter(x => x.params.active)[0].params
    }
}

export default connect(mapStateToProps, { showDetail, updateRouteList })(ShowDetail)