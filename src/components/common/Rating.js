import React, { Component } from 'react';
import {
    View,
    FlatList,
    Text,
    TouchableOpacity,
    Modal
} from 'react-native';
import { Icon } from 'native-base'
import { connect } from 'react-redux';
import styles, { fonts, colors, fontSize } from '../../styles';
import { deviceWidth, deviceHeight } from '../../utility/consts';
class Rating extends Component {
    constructor(props) {
        super(props)
        this.state = {
            rating: [
                {
                    name: 'md-star',
                    flag: false,
                    color: '#cfcfcf',
                    size: 60
                },
                {
                    name: 'md-star',
                    flag: false,
                    color: '#cfcfcf',
                    size: 60
                },
                {
                    name: 'md-star',
                    flag: false,
                    color: '#cfcfcf',
                    size: 60
                },
                {
                    name: 'md-star',
                    flag: false,
                    color: '#cfcfcf',
                    size: 60
                },
                {
                    name: 'md-star',
                    flag: false,
                    color: '#cfcfcf',
                    size: 60
                }
            ],
            countRate: 0,
        };
    }
    clickRating = (indx) => {
        let rates = this.state.rating;
        if (rates[indx].flag == false)
            for (i = 0; i <= indx; i++) {
                rates[i].name = "md-star";
                rates[i].color = "#21745a";
                rates[i].flag = true;
                rates[i].size = 60
            }
        else {
            for (i = indx + 1; i < rates.length; i++) {
                rates[i].name = "md-star";
                rates[i].color = "#cfcfcf";
                rates[i].flag = false;
                rates[i].size = 60;

            }

        }
        this.setState({ rating: rates })
        this.props.rateChange(indx + 1)
    }

    render() {
        return (
            <View style={{ flex: 1, paddingVertical: 4 }}>
                <View >
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={this.props.isShow}
                        onRequestClose={() => {
                        }}>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <View style={[styles.modalContent, {
                                height: deviceHeight * 0.4,
                                width: deviceWidth * 0.84
                            }]}>
                                <View style={{ position: 'absolute', top: 5, right: deviceWidth * 0.03 }}>
                                    <Text style={{ fontFamily: fonts.BYekan, textAlign: 'right', fontSize: fontSize.normal }}>
                                        {this.props.text}
                                    </Text>
                                    <Text style={{ fontFamily: fonts.BYekan, textAlign: 'center', fontSize: fontSize.normal }}>
                                        {this.props.label}
                                    </Text>
                                </View>
                                <View style={{
                                    position: 'absolute',
                                    left: deviceWidth * 0.1,
                                    top: deviceHeight * 0.12,
                                    flexDirection: 'row'
                                }}>
                                    {this.state.rating.map((item, key) => {
                                        return (
                                            <Icon key={key}
                                                onPress={this.clickRating.bind(this, key)}
                                                name={item.name}
                                                style={{
                                                    color: item.color,
                                                    fontSize: item.size,
                                                }} />
                                        )
                                    })}
                                </View>
                                <View >
                                    <TouchableOpacity
                                        onPress={this.props.insertRating}
                                        style={{
                                            position: 'absolute',
                                            top: deviceHeight * 0.25,
                                            backgroundColor: colors.primary,
                                            borderRadius: 4,
                                            left: deviceWidth * 0.1,
                                            width: deviceWidth * 0.3
                                        }}>
                                        <Text style={{ fontFamily: fonts.BYekan, padding: 10, textAlign: 'center', color: 'white' }}>
                                            ثبت امتیاز
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={this.props.closeFunc}
                                        style={{
                                            position: 'absolute',
                                            top: deviceHeight * 0.25,
                                            backgroundColor: colors.red,
                                            borderRadius: 4,
                                            right: deviceWidth * 0.06,
                                            width: deviceWidth * 0.3
                                        }}>
                                        <Text style={{ fontFamily: fonts.BYekan, padding: 10, textAlign: 'center', color: 'white' }}>
                                            انصراف
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </View>
            </View>
        )
    }
}
const mapStateToProps = state => {
    return {
        deviceDimensions: state.initial.deviceDimensions
    }
}

export default connect(mapStateToProps, {})(Rating)
