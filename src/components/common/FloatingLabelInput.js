import React, { Component } from 'react';
import {
    View,
    TextInput,
    Animated
} from 'react-native';
export default class FloatingLabelInput extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isFocused: false,
            value: this.props.value,
            resualtSave: ''
        };
    }
    componentDidMount() {
         this._animatedIsFocused = new Animated.Value(!this.state.value ? 0 : 1);
    }
   
    componentDidUpdate() {
        Animated.timing(this._animatedIsFocused, {
            toValue: (this.state.isFocused || this.state.value) ? 1 : 0,
            duration: 200,
        }).start();
    }
    handleFocus = () => this.setState({ isFocused: true });
    handleBlur = () => this.setState({ isFocused: false });
    setInputState(smc, label) {
        this.props.func(smc, label)
    }
    render() {
        const { label, keyboardtype, ...props } = this.props;
        const { isFocused } = this.state;
        const inputStyle = {
            height: 40,
            fontSize: 16,
            color: colors.secondaryText
        }
        const labelStyle = {
            position: 'absolute',
            right: 10,
            fontFamily: fonts.BYekan,
            top: this._animatedIsFocused.interpolate({
                inputRange: [0, 1],
                outputRange: [18, 0]
            }),
            fontSize: this._animatedIsFocused.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 16]
            }),
            color: this._animatedIsFocused.interpolate({
                inputRange: [0, 1],
                outputRange: [colors.secondaryText, colors.primary]
            }),

        }

        return (
            <View style={{ paddingTop: 18 }}>
                <Animated.Text style={labelStyle}>
                    {label}
                </Animated.Text>
                <TextInput
                    underlineColorAndroid={'#c1c1c1'}
                    onFocus={this.handleFocus}
                    keyboardType={keyboardtype ? keyboardtype : 'default'}
                    onBlur={() => {
                        this.handleBlur();
                        this.setInputState(this.state.value, label);
                        if (this.props.updateBasketPrice)
                            this.props.updateBasketPrice();
                    }}
                    style={inputStyle}
                    onChangeText={(value) => {
                        this.setState({ value });
                    }}
                />
            </View>
        )
    }

}
