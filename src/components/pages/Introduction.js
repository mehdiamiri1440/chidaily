import React, { Component } from 'react';
import {
    BackHandler,
    View,
    FlatList,
    Text,
    Image,
    Animated,
    Easing,
    TouchableOpacity, AsyncStorage
} from "react-native";
import { connect } from 'react-redux';
import { setFooterVisibility, updateBasketCount, updateBasketCatalogList, updateRouteList, updateShowTutorial } from '../../actions';
import styles, { fontSize } from '../../styles';
import { getBasketCalatogs, getBasketCount, consts, backAndroid, } from '../../utility';
import { screenNames, deviceWidth, deviceHeight } from '../../utility/consts';
// var PushNotification = require('react-native-push-notification');
class Introduction extends Component {
    static navigationOptions = () => ({
        header: null
    })
    constructor(props) {
        super(props)
        this.state = {
            listOfIntroduction: [
                {
                    HeaderText: "آسون و راحت ",
                    CommentText: "در هوای خنک خانه بشینید و آنلاین خرید کنید",
                    Image: require('../../../assets/Image/Introduction/First.png'),

                },
                {
                    HeaderText: "تنوع قلم کالا",
                    CommentText: "از بین فروشگاه های متنوع ما راحت تر خرید کنید",
                    Image: require('../../../assets/Image/Introduction/Second.png'),
                },
                {
                    HeaderText: "پست رایگان",
                    CommentText: "خرید های سنگینتون رو حمل نکنید،پست میاره",
                    Image: require('../../../assets/Image/Introduction/Third.png'),
                },

            ],
            animatedHeaderText: new Animated.Value(0),
            animatedCommentText: new Animated.Value(0),
            animatedImage: new Animated.Value(0),
            animateColor: new Animated.Value(0),
            indexSelected: 0
        };


        getBasketCount().then(count => {
            this.props.updateBasketCount(count)
        })
    }
    componentDidMount() {
        this.animate();
    }

    // renderItem({ item, index }) {
    //     return <Text >{item}</Text>;
    // }
    onLoad = () => {
        Animated.timing(this.state.animatedCommentImage, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true
        }).start();
    }
    animate() {
        this.state.animatedHeaderText.setValue(0);
        this.state.animatedCommentText.setValue(0);
        this.state.animatedImage.setValue(0);
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
            createAnimation(this.state.animatedHeaderText, 500, Easing.ease, 250)
        ]).start()
        Animated.parallel([
            createAnimation(this.state.animatedCommentText, 500, Easing.ease, 450)
        ]).start()
        Animated.parallel([
            createAnimation(this.state.animatedImage, 500, Easing.ease, 150)
        ]).start()
    }
    callcms() {
        AsyncStorage.getItem(consts.userInitial).then(userInitialString => {
            let userInitial = {}
            if (userInitialString)
                userInitial = JSON.parse(userInitialString)
            userInitial.isIntroductionViewed = true;
            AsyncStorage.setItem(consts.userInitial, JSON.stringify(userInitial)).then(() => {
                this.props.updateShowTutorial(true);
                this.props.navigation.replace(screenNames.CMS)
            })
        })
    }
    renderBottomButtons(indx) {
        if (indx + 1 == this.state.listOfIntroduction.length)
            return (
                <TouchableOpacity onPress={() => { this.callcms() }} style={{ position: 'absolute', bottom: 6, right: 16 }}>
                    <Text
                        allowFontScaling={false}
                        style={[styles.fontFamily, { fontSize: fontSize.normal, color: '#eaeaea' }]}>
                        انجام شد
            </Text>
                </TouchableOpacity>
            )
        else if (indx + 1 < this.state.listOfIntroduction.length)
            return (
                <TouchableOpacity onPress={() => { this.callcms() }} style={{ position: 'absolute', bottom: 6, left: 16 }}>
                    <Text
                        allowFontScaling={false}
                        style={[styles.fontFamily, { fontSize: fontSize.normal, color: '#eaeaea' }]}>
                        رد کردن
            </Text>
                </TouchableOpacity>
            )
    }
    endOfSlideIntroduction() {
        if (this.state.indexSelected + 1 == this.state.listOfIntroduction.length)
            this.callcms()
    }
    renderIntroduction() {
        const headerTextAnimation = this.state.animatedHeaderText.interpolate({
            inputRange: [0, 1],
            outputRange: [deviceWidth - (deviceWidth * 1.5),
            deviceWidth * 0.27]
        })
        const commentTextAnimation = this.state.animatedCommentText.interpolate({
            inputRange: [0, 1],
            outputRange: [deviceWidth - (deviceWidth * 2),
            deviceWidth * 0.055]
        })
        const imageAnimation = this.state.animatedImage.interpolate({
            inputRange: [0, 1],
            outputRange: [0, deviceWidth * 0.8]
        })
        return (
            <View >
                <FlatList
                    data={this.state.listOfIntroduction}
                    onScroll={(event) => {
                        this.animate()
                        let index = Math.round(event.nativeEvent.contentOffset.x /
                            event.nativeEvent.contentSize.width * this.state.listOfIntroduction.length)
                        this.setState({ indexSelected: index })

                    }}
                    extraData={[this.state.indexSelected]}
                    onTouchMove={() => {
                        this.endOfSlideIntroduction()

                    }}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled={true}
                    keyExtractor={(item, index) => index.toString()}
                    onMomentumScrollBegin={() => {

                    }}
                    renderItem={({ item, index }) =>
                        <View style={{
                            backgroundColor: '#ebb81e', width: deviceWidth,
                            height: deviceHeight
                        }}>
                            <Animated.Image
                                source={item.Image}
                                style={{
                                    resizeMode: 'contain',
                                    position: 'absolute',
                                    top: deviceHeight * 0.3 - deviceWidth * 0.4,
                                    left: deviceWidth * 0.5 - deviceWidth * 0.4 + 8,
                                    width: imageAnimation,
                                    height: deviceWidth * 0.8
                                }}
                            />
                            <Animated.Text style={{
                                position: 'absolute',
                                top: deviceHeight * 0.6,
                                right: headerTextAnimation
                            }}>
                                <Text style={[styles.fontFamily, { color: '#383838', fontSize: fontSize.xxLarge }]}>
                                    {item.HeaderText}
                                </Text>
                            </Animated.Text>
                            <Animated.Text style={{
                                position: 'absolute',
                                top: deviceHeight * 0.7,
                                right: commentTextAnimation,
                            }}>
                                <Text
                                    allowFontScaling={false}
                                    style={[styles.fontFamily, { color: '#383838', fontSize: fontSize.normal }]}>
                                    {item.CommentText}
                                </Text>
                            </Animated.Text>
                            {this.state.listOfIntroduction.map((_, i) => {
                                return (
                                    <View key={i} style={{
                                        width: deviceWidth * 0.02,
                                        height: deviceWidth * 0.02,
                                        borderRadius: deviceWidth * 0.01,
                                        backgroundColor: i == index ? '#eaeaea' : '#b38504',
                                        position: 'absolute',
                                        bottom: 15,
                                        left: deviceWidth * 0.45 + i * 20
                                    }}>

                                    </View>
                                )
                            })}
                            {this.renderBottomButtons(index)}
                        </View>
                    }
                />

            </View>
        );
    }

    render() {
        return (
            this.renderIntroduction()
        )
    }
}

const mapStateToProps = state => {
    return {
        routeList: state.initial.routeList,
        deviceDimensions: state.initial.deviceDimensions,
        ...state.navigation.routes.filter(x => x.params.active)[0].params

        //setFooterVisibility, updateBasketCount, updateBasketCatalogList
    }
}
//export default connect(mapStateToProps)(SplashScreen)
export default connect(mapStateToProps, { setFooterVisibility, updateBasketCount, updateShowTutorial, updateBasketCatalogList, updateRouteList })(Introduction)
