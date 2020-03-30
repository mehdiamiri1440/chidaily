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
import styles, { fontSize } from '../../styles';
import { deviceWidth } from '../../utility/consts';
class CustomPicker extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isVisibleModalPickerCity: false
        };
    }
    componentDidUpdate() {

    }
    setmodalPickerCity(item) {
        this.setState({ isVisibleModalPickerCity: item })
    }
    render() {
        return (
            <View style={{ flex: 1, paddingVertical: 4 }}>
                <View style={{ flexDirection: 'row-reverse' }}>
                    <View style={{ flex: 5 }}  >
                        <View style={{ flexDirection: 'row-reverse' }}>
                            <View style={{
                                width: deviceWidth * 0.45,
                                borderTopRightRadius: 4,
                                borderBottomRightRadius: 4,
                                paddingVertical: 6
                            }}>
                                <Text style={[styles.fontFamily, { fontSize: 14, paddingHorizontal: 4 }]}>
                                    {this.props.label}
                                </Text>
                            </View>
                            <TouchableOpacity onPress={() => {
                                this.setmodalPickerCity(true);
                            }} style={{
                                width: deviceWidth * 0.42,
                                borderLeftWidth: 1,
                                borderTopWidth: 1,
                                borderRightWidth: 1,
                                borderBottomWidth: 1,
                                borderColor: '#c1c1c1',
                                borderRadius: 0,
                                flexDirection: 'row',
                                paddingVertical: 12
                            }}>
                                <Text style={[styles.fontFamily, {
                                    position: 'absolute', right: 4, top: 6,
                                    paddingHorizontal: 4, fontSize: 14
                                }]}>
                                    {this.props.list.filter(x => x[this.props.ValueField] == this.props.result)[0] ?
                                        this.props.list.filter(x => x[this.props.ValueField] == this.props.result)[0][this.props.displayField] :
                                        ''
                                    }
                                </Text>
                                <Icon style={{
                                    position: 'absolute', left: 4, top: 5,
                                    color: '#c1c1c1',
                                    fontSize: fontSize.small
                                }} name="ios-arrow-down-outline" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View >
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={this.state.isVisibleModalPickerCity}
                            onRequestClose={() => {
                                this.setState({ isVisibleModalPickerCity: false })
                            }}>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <View style={styles.modalContent}>
                                    <FlatList
                                        data={this.props.list}
                                        horizontal={false}
                                        showsHorizontalScrollIndicator={false}
                                        pagingEnabled={false}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={({ item, index }) =>
                                            <TouchableOpacity key={index} onPress={() => {
                                                this.setState({ isVisibleModalPickerCity: false })
                                                this.props.onPress(item[this.props.ValueField])
                                            }} style={{ padding: 8 }}>
                                                <Text style={[styles.fontFamily, { fontSize: fontSize.small }]}>
                                                    {item[this.props.displayField]}
                                                </Text>
                                                <View style={{ position: 'absolute', left: 8, top: 6 }} >
                                                    <View style={{ flexDirection: 'row-reverse' }}>
                                                        <Text
                                                            style={[item[this.props.displayField] == this.props.list[0][this.props.displayField] ?
                                                                styles.buyitnowselectedbtn : styles.buyitnowunselectedbtn,
                                                            styles.fontFamily, {
                                                                textAlignVertical: 'center', fontSize: fontSize.small,
                                                                textAlign: 'center', borderRadius: 20,
                                                                width: fontSize.large, height: fontSize.large,
                                                                color: 'white'
                                                            }]}></Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        }
                                    />
                                </View>
                            </View>
                        </Modal>
                    </View>
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

export default connect(mapStateToProps, {})(CustomPicker)
