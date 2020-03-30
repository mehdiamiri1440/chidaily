import React, { Component } from 'react';
import {
    View,
    Image,
    TextInput,
    Text
} from 'react-native';
import styles from '../../styles';
export default class Captcha extends Component {
    constructor(props) {
        super(props)
        this.state = {
            myCaptcha: 'https://cheegel.com/apis/Handlers/CapchaGenerator.ashx?',
            counter: 0,
        }
        this.createCaptcha()
    }
    createCaptcha() {
        fetch(`https://www.cheegel.com/apis/api/user/CreateCaptcha`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json; charset=utf-8',
                'Content-Type': 'application/json; charset=utf-8',
            },
        }).then(response => {
            this.setState({ myCaptcha: "https://cheegel.com/apis/Handlers/CapchaGenerator.ashx?" + new Date().getTime() })
        })
    }
    componentDidUpdate() {
        if (this.props.counter != this.state.counter) {
            this.setState({ counter: this.props.counter })
            this.createCaptcha()
        }
    }
    renderImage() {
        if (this.state.myCaptcha)
            return (<Image source={{ uri: this.state.myCaptcha }} style={{ flex: 1, maxWidth: "100%", height: 80, resizeMode: 'contain' }}></Image>)
        else
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size={56} />
                </View>
            )
    }
    render() {
        return (
            <View style={{
                width: "80%",
                alignSelf: 'center',
                display: 'flex',
                flexDirection: 'row',
            }}>
                <View style={{ flex: 1, width: "50%", alignSelf: 'center', overflow: 'hidden' }}>
                    {this.renderImage()}
                </View>
                <TextInput
                    style={[styles.fontFamily, {
                        flex: 1,
                        marginTop: 20,
                        height: 60,
                        color: this.props.hasError ? 'red' : 'white',
                        fontSize: 20,
                        borderBottomColor: 'white',
                        textAlign: this.props.value ? 'left' : 'right'
                    }]}
                    underlineColorAndroid={this.props.hasError ? 'red' : 'white'}
                    keyboardType={'default'}
                    placeholder={"تصویر امنیتی"}
                    placeholderTextColor={this.props.hasError ? 'red' : 'white'}
                    onChangeText={this.props.onChangeText}
                    value={this.props.value}
                ></TextInput>
            </View>
        )
    }
}