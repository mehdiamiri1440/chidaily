import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Modal, Image, TextInput } from 'react-native';
import { connect } from 'react-redux';
import { Icon } from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles, { fonts, colors, fontSize } from '../../styles';
import { deviceHeight, deviceWidth, screenNames } from '../../utility/consts';
import Menu from './Menu';
const headerHeight = deviceHeight * 0.09
class Header extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showSearchModal: false
        }
        this.textColor = colors.primaryText
        this.iconColor = colors.primaryText
    }
    navigate = (type, param) => {
        const { navigation } = this.props
        if (type == 'back')
            navigation.goBack()
        else {
            // const resetAction = NavigationActions.reset({
            //     index: 0,
            //     actions: [
            //         NavigationActions.navigate({ routeName: screenNames.BARTERS, params:param })
            //     ]
            // })
            // navigation.dispatch(resetAction)
            if (type == 'search')
                navigation.navigate(screenNames.BARTERS, param)
            else
                navigation.navigate(type, param)

        }
    }
    onDrawerRowClick = () => {
        this.setState({ showSearchModal: false })
    }
    renderBasketCounter() {
        if (this.props.basketItemsCount > 0) {
            return (
                <Text
                    allowFontScaling={false}
                    style={[{
                        textAlignVertical: 'center', fontSize: fontSize.small,
                        position: 'absolute', textAlign: 'center', borderRadius: 20,
                        left: 36, top: 0, width: fontSize.large, height: fontSize.large,
                        color: 'white', backgroundColor: colors.secondary,
                        fontFamily: fonts.BYekan
                    }]}>{this.props.basketItemsCount}</Text>
            )
        }
    }
    renderButton(type) {
        if (type == 'menu')
            return (
                <TouchableOpacity
                    onPress={() => {
                        this.setState({ showSearchModal: true })
                    }}
                    style={{
                        //paddingLeft: '5%',
                        width: '20%'
                    }}>
                    <Icon name="menu"
                        //onPress={() => this.navigate('back')}
                        style={{
                            fontSize: deviceWidth * 0.07,
                            color: this.iconColor
                        }} />

                </TouchableOpacity>
            )
        if (type == 'cart')
            return (
                <TouchableOpacity
                    onPress={() => {
                        this.navigate(screenNames.BASKET)
                    }}
                    style={{
                        paddingLeft: '5%',
                        width: '20%'
                    }}>
                    <MaterialIcons name="shopping-cart"
                        //onPress={() => this.navigate('back')}
                        style={{
                            fontSize: deviceWidth * 0.07,
                            color: this.iconColor
                        }} />
                    {this.renderBasketCounter()}
                </TouchableOpacity>
            )
        if (type == 'search')
            return (
                <Ionicons name="ios-search"
                    onPress={this.onSearchClicked}
                    style={{
                        width: '10%',
                        fontSize: deviceWidth * 0.07,
                        color: this.iconColor
                    }} />
            )
        if (type == 'profile')
            return (
                <Icon name="person"
                    onPress={() => {
                        if (this.props.initial.isUserLogin)
                            this.navigate(screenNames.PROFILE)
                        else
                            this.navigate(screenNames.LOGIN)
                    }}
                    style={{
                        width: '10%',
                        fontSize: fontSize.large,
                        color: this.props.dark ? 'white' : this.iconColor
                    }} />
            )
        if (type == 'share')
            return (
                <Ionicons name="md-share"
                    style={{
                        width: '10%',
                        fontSize: deviceWidth * 0.07,
                        color: this.iconColor
                    }} />
            )
        if (type == 'nothing')
            return null
    }
    renderTitle() {
        return (
            <Text style={[styles.fontFamily, {
                width: '60%',
                fontSize: fontSize.normal,
                //fontSize: this.props.title.length > 20 ? deviceWidth * 0.04 : deviceWidth * 0.05,
                textAlign: 'center',
                textAlignVertical: 'center',
                color: this.props.dark ? 'white' : this.textColor
                //color: this.props.dark ? 'white' : colors.secondaryText,
            }]}>
                {this.props.title ? this.props.title : ''}
            </Text>
            // <Text
            //     allowFontScaling={false}
            //     style={{
            //         //flex: 7,
            //         //fontFamily: fonts.BYekan,
            //         //fontSize: fontSize.normal,
            //         //color: this.props.dark ? 'white' : colors.secondaryText,
            //         //textAlignVertical: 'center', textAlign: 'center'
            //     }}>{this.props.title}</Text>

        )
    }
    renderModal() {
        return (
            <Modal
                animationType='slide'
                hardwareAccelerated
                transparent={true}
                visible={this.state.showSearchModal}
                onRequestClose={() => {
                    this.setState({ showSearchModal: false })
                }}
            >
                <TouchableOpacity
                    onPress={() => this.setState({ showSearchModal: false })}
                    style={{
                        flex: 1,
                        width: deviceWidth,
                        height: deviceHeight,
                        //justifyContent: "center",
                        alignItems: "flex-end",
                        backgroundColor: "rgba(0,0,0,0.8)"
                    }}
                >
                    <Menu navigation={this.props.navigation} onSelect={this.onDrawerRowClick} />
                    {/* <View
                        style={{
                            //position: 'absolute',
                            //top: 0,
                            backgroundColor: "#fff",
                            width: deviceWidth,
                            height: deviceHeight * 0.1,
                            elevation: 16,
                            flexDirection: 'row-reverse',
                            alignItems: 'center'
                        }}>
                        <TextInput
                            underlineColorAndroid={colors.white}
                            placeholder="جستجو"
                            //value={this.state.searchText}
                            onChangeText={phrase => this.setState({ phrase })}
                            style={[
                                {
                                    paddingHorizontal: 16,
                                    width: "80%",
                                    height: '100%',
                                    textAlign: "right",
                                    direction: "rtl",
                                    fontSize: 14,
                                },
                                styles.fontFamily
                            ]}
                            onSubmitEditing={this.submitSearch}
                            blurOnSubmit
                        />
                        <TouchableOpacity
                            onPress={() => this.setState({ showSearchModal: false })}
                            style={{ width: '20%' }}>
                            <Text
                                style={[
                                    styles.fontFamily,
                                    {
                                        textAlign: "center",
                                        color: colors.primaryDark,
                                    }
                                ]}>بستن</Text>
                        </TouchableOpacity>

                    </View>
               */}
                </TouchableOpacity>
            </Modal>

        );
    }
    render() {
        return (
            <View style={{ position: 'relative' }}>
                <View style={{
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    width: '100%',
                    flexDirection: 'row',
                    height: headerHeight,
                    position: 'relative',
                    elevation: 2,
                    backgroundColor: this.props.hasImage ? 'rgba(255, 152, 17,0.8)' : 'white',
                    //paddingTop: deviceHeight * 0.038
                }}>
                    {this.renderButton('cart')}
                    {this.renderTitle()}
                    {this.props.buttonOne ? this.renderButton(this.props.buttonOne) : this.renderButton('profile')}
                    {this.props.buttonTwo ? this.renderButton(this.props.buttonTwo) : this.renderButton('menu')}

                </View>
                {this.renderModal()}
            </View>
        )
    }

}
const mapStateToProps = state => {
    return {
        user: state.initial.user,
        initial: state.initial,
        basketItemsCount: state.initial.basketItemsCount,
    }
}
export default connect(mapStateToProps, {})(Header)