import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    Button,
    ScrollView,
    AsyncStorage,
    StatusBar,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Animated,
    Easing
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Icon } from 'native-base'
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux';
import styles, { colors, fontSize, fonts } from '../../styles'
import { screenNames, deviceHeight } from '../../utility/consts';
class Footer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            footerMenu: [],
            footerMenuClicked: "",
            BottomForFooter: new Animated.Value(0),

        }
    }
    componentDidMount() {
        let footerMenuItems = [
            {
                "ID": 1,
                "IconName": "ios-home",
                "ClassName": "footerIcons2",
                "RouterKey": screenNames.CMS,
                "Title": "خانه"
            },
            {
                "ID": 2,
                "IconName": "md-list",
                "ClassName": "footerIcons2",
                "RouterKey": screenNames.CATEGORY,
                "Title": "گروه کالاها"
            },
            {
                "ID": 3,
                "IconName": "md-apps",
                "ClassName": "footerIcons2",
                "RouterKey": screenNames.PRODUCT_GALLERY,
                "Title": "محصولات",
                params: {
                    CategoryCode: '0',
                    tag: ''
                }
            },
            {
                "ID": 4,
                "IconName": "ios-basket",
                "ClassName": "footerIcons2",
                "RouterKey": screenNames.ADVERTIMENT_CMS,
                "Title": "پیشنهاد ها"
            },
            {
                "ID": 5,
                "IconName": "ios-albums",
                "ClassName": "footerIcons2",
                "RouterKey": screenNames.STORES,
                "Title": "فروشگاه ها"
            }
        ];
        this.setState({ footerMenu: footerMenuItems });
        this.setState({ footerMenuClicked: "ios-home" });
        this.animate();
    }
    animate() {
        this.state.BottomForFooter.setValue(0);
        const createAnimation = function (value, duration, easing, delay = 0) {
            return Animated.timing(
                value,
                {
                    toValue: 1,
                    duration,
                    easing,
                    delay
                }
            )
        }
        Animated.parallel([
            createAnimation(this.state.BottomForFooter, 400, Easing.ease, 1500)
        ]).start()
    }
    iconClicked = (item) => {
        const { navigate } = this.props;
        //this.setState({ footerMenuClicked: item.IconName });
        navigate(item.RouterKey, item.params ? item.params : {});
    }
    renderBasketCounter(item) {
        if (item.RouterKey == 'basket' && this.props.basketItemsCount > 0)
            return (
                <Text style={[styles.fontFamily, {
                    textAlignVertical: 'center', fontSize: fontSize.small,
                    position: 'absolute', textAlign: 'center', borderRadius: 20,
                    right: 16, top: 0, width: fontSize.large, height: fontSize.large,
                    color: 'white', backgroundColor: 'red'
                }]}>{this.props.basketItemsCount}</Text>
            )
    }

    renderFooter() {
        const paddingAnimation = this.state.BottomForFooter.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 60]
        })
        const activeRoute = this.props.navigation.routes.filter(r => r.params.active)[0].routeName
        return (
            <Animatable.View
                delay={0}
                animation={this.props.showFooter ? 'slideInUp' : 'slideOutDown'}
                duration={300}
                useNativeDriver={true}
                style={{
                    height: deviceHeight * 0.1, width: '100%', borderTopWidth: 1, borderTopColor: this.props.darkFooter ? colors.purple : '#eaedf3',
                    elevation: 25, alignItems: 'center', justifyContent: 'center',
                    flexDirection: 'row', backgroundColor: this.props.darkFooter ? colors.purple : '#fafafa', position: 'absolute', bottom: 0
                }}>
                {/* <StatusBar backgroundColor={this.props.darkFooter ? colors.purple : 'white'} showHideTransition='fade' barStyle={this.props.darkFooter ? 'light-content' : 'dark-content'} /> */}
                {
                    this.state.footerMenu.map((item, indx) => {
                        return (
                            <TouchableOpacity
                                style={{ flex: 1, height: '100%', position: 'relative', alignItems: 'center', justifyContent: 'center' }}
                                key={item.ID}
                                onPress={() => {
                                    if (activeRoute != item.RouterKey)
                                        this.iconClicked(item)
                                }}>
                                <View style={{ alignItems: 'center' }}>
                                    <Ionicons name={item.IconName} style={
                                        activeRoute == item.RouterKey ?
                                            (styles.footerIconsSelected) :
                                            (this.props.darkFooter ? {
                                                color: 'white',
                                                fontSize: fontSize.xxLarge
                                            } : styles[item.ClassName])
                                    } />
                                    <Text
                                        allowFontScaling={false}
                                        style={activeRoute == item.RouterKey ? ({ color: colors.primary, fontFamily: fonts.BYekan }) : (this.props.darkFooter ? { color: 'white', fontFamily: fonts.BYekan } : { color: '#888', fontFamily: fonts.BYekan })
                                        }>{item.Title}</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    })
                }
            </Animatable.View>
        )
    }
    render() {
        return this.renderFooter()
    }
}
const mapStateToProps = state => {
    return {
        basketItemsCount: state.initial.basketItemsCount,
        showFooter: state.initial.showFooter,
        //darkFooter: state.initial.darkFooter,
        navigation: state.navigation,
        deviceDimensions: state.initial.deviceDimensions
    }
}
export default connect(mapStateToProps, {})(Footer)
