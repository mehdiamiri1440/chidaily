import React, { Component } from 'react';
import { Input, InputGroup } from 'native-base'
import { TextInput, View, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import { Button } from 'react-native-elements';
import styles, { colors, fontSize } from '../../styles';
export class CustomeTextInput extends Component {
    handleContentSizeChange = ({ nativeEvent }) => {
        const { height } = nativeEvent.contentSize
        this.setState({
            inputHeight: height > fontSize.large ? fontSize.large : height
        })
    }
    render() {
        return (
            <View style={{ paddingVertical: this.props.paddingVertical ? this.props.paddingVertical : 10 }}>
                <Input
                    style={[styles.fontFamily, {
                        width: "80%",
                        alignSelf: "center",
                        height: this.props.height ? this.props.height : 60,
                        color: this.props.hasError ? 'red' : this.props.color ? this.props.color : colors.textPrimary,
                        fontSize: this.props.fontSize ? this.props.fontSize : fontSize.small,
                        textAlign: this.props.isLeftAlign ? this.props.value ? 'left' : 'right' : this.props.textAlign ? this.props.textAlign : 'right'
                    }]}
                    maxLength={this.props.maxLength ? this.props.maxLength : 500}
                    value={this.props.value ? this.props.value : ''}
                    multiline={this.props.multiline ? this.props.multiline : false}
                    underlineColorAndroid={this.props.hasError ? 'red' : this.props.underlineColorAndroid ? this.props.underlineColorAndroid : this.props.color ? this.props.color : colors.textPrimary}
                    keyboardType={this.props.keyboardType ? this.props.keyboardType : 'default'}
                    placeholder={this.props.placeholder}
                    hasError={this.props.hasError ? this.props.hasError : false}
                    placeholderTextColor={this.props.hasError ? 'red' : this.props.placeholderTextColor ? this.props.placeholderTextColor : this.props.color ? this.props.color : colors.textPrimary}
                    onChangeText={this.props.onChangeText}
                    onBlur={this.props.onBlur ? this.props.onBlur : () => { }}
                    secureTextEntry={this.props.secureTextEntry ? this.props.secureTextEntry : false}
                    autoCapitalize={this.props.autoCapitalize ? this.props.autoCapitalize : 'sentences'}
                    onContentSizeChange={this.handleContentSizeChange}
                />
            </View>
        )
    }
}
export class CustomeButton extends Component {
    render() {
        if (this.props.loading ? this.props.loading : false)
            return (
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size={56} />
                </View>
            )
        else
            return (
                <Button
                    title={this.props.title ? this.props.title : 'ذخیره'}
                    color={this.props.color ? this.props.color : '#fff'}
                    onPress={this.props.onPress}
                    fontFamily='byekan'
                    fontSize={this.props.fontSize ? this.props.fontSize : fontSize.normal}
                    buttonStyle={{
                        borderRadius: 4,
                        marginTop: 10,
                        alignSelf: "center",
                        width: this.props.width ? this.props.width : '80%',
                        backgroundColor: this.props.backgroundColor ? this.props.backgroundColor : colors.primary,
                        paddingVertical: this.props.paddingVertical ? this.props.paddingVertical : 8,
                        marginTop: this.props.marginTop ? this.props.marginTop : 0,
                    }}
                />
            )
    }
}