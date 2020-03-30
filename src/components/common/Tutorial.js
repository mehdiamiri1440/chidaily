
import React, { Component } from 'react';
import { View, Text, Image, ScrollView, BackHandler, Easing, Animated, TouchableOpacity } from 'react-native';

import { Button, Overlay } from 'react-native-elements';
import { Card, Icon } from 'native-base';
import styles, { fonts, colors, fontSize } from '../../styles';
import { updateShowTutorial } from '../../actions';
import { connect } from 'react-redux';
import { deviceWidth, deviceHeight } from '../../utility/consts';
const animationFirstForCategory = 0;
const animationSecondForCategory = 0;
class Tutorial extends Component {
    constructor(props) {
        super(props)
        this.state = {
            animatedValue: new Animated.Value(0),
            animatedValueToturial: new Animated.Value(0),
            countToturial: 1
        }
    }
    componentDidMount() {
        this.animate();
    }
    animate() {
        this.state.animatedValue.setValue(0);
        Animated.timing(
            this.state.animatedValue,
            {
                toValue: 1,
                duration: 2000,
                easing: Easing.linear
            }
        ).start(() => this.animate())
    }
    animationForIcon(state, value, duration, easing, delay) {
        state.setValue(0);
        const createAnimation = function (value, duration, easing, delay = 0) {
            return Animated.timing(
                value,
                {
                    toValue: 1,
                    duration,
                    easing,
                    delay,
                }
            )
        }
        Animated.parallel([
            createAnimation(state, duration, easing, delay)
        ]).start();
    }
    animationChangeState(state, outPutRangeFirst, outPutRangeMiddle, outPutRangeEnd) {
        return state.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [outPutRangeFirst, outPutRangeMiddle, outPutRangeEnd]
        })
        animationFirstForCategory = 0;
        animationSecondForCategory = 0;
    }
    createToturial() {
        // if (this.state.countToturial == 1) {
        //     this.animationForIcon(this.state.animatedValueToturial, 0, 250, Easing.ease, 500);
        //     animationFirstForCategor = this.animationChangeState(this.state.animatedValue, 20, 300, 20);
        //     return (
        //         <TouchableOpacity onPress={() => { this.setState({ countToturial: this.state.countToturial + 1 }) }} style={{
        //             position: 'absolute', opacity: 0.9, top: 0,
        //             width: Math.ceil(deviceWidth),
        //             height: Math.ceil(deviceHeight),
        //             backgroundColor: 'rgba(0, 0, 0, 0.5)',
        //              zIndex: 1000
        //         }}>
        //             <View style={{
        //                 position: 'relative', width: deviceWidth,
        //                 height: deviceHeight
        //             }}>
        //                 <Animated.Image style={{
        //                     width: 80, height: 80, position: 'absolute',
        //                     top: deviceHeight * 0.2, right: animationFirstForCategor
        //                 }}
        //                     source={require('../../../assets/Image/Introduction/rotate.png')} />
        //                 <TouchableOpacity onPress={() => { this.setState({ countToturial: this.state.countToturial + 1 }) }}
        //                     style={{
        //                         position: 'absolute',
        //                         top: deviceHeight * 0.38,
        //                         right: deviceWidth * 0.35
        //                     }}
        //                 >
        //                     <Text style={[styles.fontFamily, { padding: 16, color: '#ecf0f1', fontSize: fontSize.large }]}>
        //                         تاچ و ادامه
        //                     </Text>
        //                 </TouchableOpacity>
        //             </View>
        //         </TouchableOpacity>
        //     )
        // }
        if (this.state.countToturial == 1) {
            this.animationForIcon(this.state.animatedValueToturial, 0, 500, Easing.ease, 150);
            animationFirstForCategor = this.animationChangeState(this.state.animatedValueToturial, -40,
                Math.ceil(deviceHeight * 0.17),
                Math.ceil(deviceHeight * 0.17)
            );
            animationSecondForCategory = this.animationChangeState(this.state.animatedValueToturial,
                Math.ceil(deviceWidth * 0.61),
                Math.ceil(deviceWidth * 0.03),
                Math.ceil(deviceWidth * 0.03));
            return (
                <View style={{
                    position: 'absolute', opacity: 0.9,
                    top: 50,
                    width: Math.ceil(deviceWidth),
                    height: Math.ceil(deviceHeight),
                    backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1000
                }}>
                    <TouchableOpacity style={{
                        position: 'absolute',
                        width: Math.ceil(deviceWidth * 0.73),
                        height: Math.ceil(deviceHeight * 0.44),
                        borderBottomRightRadius: 130, backgroundColor: colors.secondary,
                        left: 0,
                        top: 0
                    }} onPress={() => { this.setState({ countToturial: this.state.countToturial + 1 }) }}>
                        <View style={{
                            position: 'absolute',
                            top: Math.ceil(deviceWidth * 0.29),
                            right: Math.ceil(deviceWidth * 0.14)
                        }}>
                            <Text style={[styles.fontFamily, { color: '#ecf0f1', fontSize: fontSize.large }]}>
                                سبد خرید
                        </Text>
                        </View>
                        <Animated.View style={{ position: 'absolute', top: animationFirstForCategor, right: animationSecondForCategory }}>
                            <Icon name="ios-cart-outline" style={{ fontSize: fontSize.xLarge, color: 'white' }}></Icon>
                            {/* <Image source={require('../../assets/images/online-store.png')} style={{
                                width: Math.ceil(deviceWidth * 0.09),
                                height: Math.ceil(deviceWidth * 0.09)
                            }} /> */}
                        </Animated.View>
                    </TouchableOpacity>

                </View>

            )
        }
        else if (this.state.countToturial == 2) {
            this.animationForIcon(this.state.animatedValueToturial, 0, 500, Easing.ease, 150);
            animationFirstForCategor = this.animationChangeState(this.state.animatedValueToturial, -30,
                Math.ceil(deviceHeight * 0.44 * 0.4),
                Math.ceil(deviceHeight * 0.44 * 0.4));
            return (
                <View style={{
                    position: 'absolute', opacity: 0.9,
                    top: 50,
                    width: Math.ceil(deviceWidth),
                    height: Math.ceil(deviceHeight),
                    backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1000
                }}>
                    <TouchableOpacity style={{
                        position: 'absolute',
                        width: Math.ceil(deviceWidth * 0.73),
                        height: Math.ceil(deviceHeight * 0.44),
                        borderTopLeftRadius: 0, borderBottomLeftRadius: 150,
                        backgroundColor: colors.secondary,
                        right: 0,
                        top: 0,
                    }} onPress={() => { this.setState({ countToturial: this.state.countToturial + 1 }) }}>
                        <View style={{
                            position: 'absolute', top: Math.ceil(deviceHeight * 0.44 * 0.4),
                            right: Math.ceil(deviceWidth * 0.12)
                        }}>
                            <Text style={[styles.fontFamily, { color: '#ecf0f1', fontSize: fontSize.large }]}>منو اصلی برنامه</Text>
                        </View>
                        <Animated.View style={{ position: 'absolute', top: animationFirstForCategor, right: Math.ceil(deviceWidth * 0.03) }}>
                            <Icon name='menu' style={{ color: '#ecf0f1', fontSize: fontSize.xxLarge }} />
                        </Animated.View>
                    </TouchableOpacity>
                </View>

            )
        }
        else if (this.state.countToturial == 5) {
            this.animationForIcon(this.state.animatedValueToturial, 0, 500, Easing.ease, 150);
            animationFirstForCategory = this.animationChangeState(this.state.animatedValueToturial, -30,
                Math.ceil(deviceHeight * 0.16), Math.ceil(deviceHeight * 0.16));
            animationSecondForCategory = this.animationChangeState(this.state.animatedValueToturial,
                Math.ceil(deviceHeight * 0.23), Math.ceil(deviceHeight * 0.02), Math.ceil(deviceHeight * 0.02));
            return (
                <View style={{
                    position: 'absolute',
                    opacity: 0.9,
                    top: 0,
                    width: Math.ceil(deviceWidth),
                    height: Math.ceil(deviceHeight),
                    backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1000
                }}>
                    <TouchableOpacity style={{
                        position: 'absolute',
                        width: Math.ceil(deviceWidth * 0.73),
                        height: Math.ceil(deviceHeight * 0.44),
                        borderTopRightRadius: 130,
                        backgroundColor: colors.secondary,
                        left: 0,
                        bottom: Math.ceil(deviceHeight * 0.12)
                    }} onPress={() => { this.setState({ countToturial: this.state.countToturial + 1 }) }}>
                        <View style={{
                            position: 'absolute',
                            bottom: Math.ceil(deviceHeight * 0.16),
                            right: Math.ceil(deviceWidth * 0.12)
                        }}>
                            <Text style={[styles.fontFamily, { color: '#ecf0f1', fontSize: fontSize.large }]}>
                                گروه کالاها
                            </Text>
                        </View>
                        <Animated.View style={{
                            position: 'absolute', bottom: animationFirstForCategory,
                            right: animationSecondForCategory
                        }}>
                            <Icon name='list' style={{ color: '#ecf0f1', fontSize: fontSize.xxLarge }} />
                        </Animated.View>
                    </TouchableOpacity>

                </View>

            )
        }
        else if (this.state.countToturial == 3) {
            this.animationForIcon(this.state.animatedValueToturial, 0, 500, Easing.ease, 150);
            animationFirstForCategory = this.animationChangeState(this.state.animatedValueToturial, -30,
                Math.ceil(deviceHeight * 0.16), Math.ceil(deviceHeight * 0.16));
            animationSecondForCategory = this.animationChangeState(this.state.animatedValueToturial, Math.ceil(deviceWidth * 0.27),
                Math.ceil(deviceWidth * 0.03), Math.ceil(deviceWidth * 0.03));
            return (
                <View style={{
                    position: 'absolute',
                    opacity: 0.9,
                    top: 0,
                    width: Math.ceil(deviceWidth),
                    height: Math.ceil(deviceHeight),
                    backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1000
                }}>
                    <TouchableOpacity style={{
                        position: 'absolute',
                        width: Math.ceil(deviceWidth * 0.73),
                        height: Math.ceil(deviceHeight * 0.44),
                        borderTopLeftRadius: 130,
                        backgroundColor: colors.secondary,
                        right: 0,
                        bottom: Math.ceil(deviceHeight * 0.12)
                    }} onPress={() => { this.setState({ countToturial: this.state.countToturial + 1 }) }}>
                        <View style={{
                            position: 'absolute',
                            bottom: Math.ceil(deviceHeight * 0.16),
                            right: Math.ceil(deviceWidth * 0.12)
                        }}>
                            <Text style={[styles.fontFamily, { color: '#ecf0f1', fontSize: fontSize.large }]}>
                                پیشنهاد های ویژه چی دیلی
                        </Text>
                        </View>
                        <Animated.View style={{
                            position: 'absolute',
                            bottom: animationFirstForCategory,
                            right: animationSecondForCategory
                        }}>
                            <Icon name='ios-basket-outline' style={{ color: '#ecf0f1', fontSize: fontSize.xLarge }} />
                        </Animated.View>
                    </TouchableOpacity>

                </View>

            )
        }
        else if (this.state.countToturial == 4) {
            this.animationForIcon(this.state.animatedValueToturial, 0, 500, Easing.ease, 150);
            animationFirstForCategory = this.animationChangeState(this.state.animatedValueToturial, -30,
                Math.ceil(deviceHeight * 0.16), Math.ceil(deviceHeight * 0.16));
            animationSecondForCategory = this.animationChangeState(this.state.animatedValueToturial,
                Math.ceil(deviceWidth * 0.22),
                Math.ceil(deviceWidth * 0.03),
                Math.ceil(deviceWidth * 0.03));
            return (
                <View style={{
                    position: 'absolute', opacity: 0.9, top: 0,
                    width: Math.ceil(deviceWidth),
                    height: Math.ceil(deviceHeight),
                    backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1000
                }}>
                    <TouchableOpacity style={{
                        position: 'absolute',
                        width: Math.ceil(deviceWidth * 0.73),
                        height: Math.ceil(deviceHeight * 0.44),
                        borderTopRightRadius: 130,
                        backgroundColor: colors.secondary,
                        left: 0,
                        bottom: Math.ceil(deviceHeight * 0.12)
                    }} onPress={() => { this.setState({ countToturial: this.state.countToturial + 1 }) }}>
                        <View style={{
                            position: 'absolute',
                            bottom: Math.ceil(deviceHeight * 0.16),
                            right: Math.ceil(deviceWidth * 0.12)
                        }}>
                            <Text style={[styles.fontFamily, { color: '#ecf0f1', fontSize: fontSize.large }]}>
                                محصولات موجود
                        </Text>
                        </View>
                        <Animated.View style={{
                            position: 'absolute',
                            bottom: animationFirstForCategory,
                            right: animationSecondForCategory
                        }}>
                            <Icon name='ios-apps-outline' style={{ color: '#ecf0f1', fontSize: fontSize.xLarge }} />
                        </Animated.View>
                    </TouchableOpacity>

                </View>
            )
        }

        else {
            this.props.updateShowTutorial(false);
        }
    }
    render() {
        if (this.props.showTutorial)
            return (
                <View style={{ width: 600, height: 1000, backgroundColor: 'rgba(0,0,0,0.5)', position: 'absolute', top: 0, zIndex: 2000 }}>
                    {this.createToturial()}
                </View>
            )
        else
            return <View />
    }

}
const mapStateToProps = state => {
    return {
        deviceDimensions: state.initial.deviceDimensions,
        showTutorial: state.initial.showTutorial

    }
}

export default connect(mapStateToProps, { updateShowTutorial })(Tutorial)