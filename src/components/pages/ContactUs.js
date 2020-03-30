import React, { Component } from 'react';
import { View, ScrollView, Text, BackHandler, ToastAndroid } from 'react-native';
import { CustomeTextInput, CustomeButton } from '../common/CustomeInputs';
import Captcha from '../common/Captcha';
import styles, { colors, fontSize } from '../../styles';
import { connect } from 'react-redux';
import { Button, Card } from 'react-native-elements';
import { setFooterVisibility, setDarkFooter, updateUserLogin, updateRouteList } from '../../actions';
import { consts, isUserLogin, EmailValidation, backAndroid, getUserContactInfo, } from '../../utility'
import Header from '../common/Header';
class ContactUs extends Component {
    static navigationOptions = ({ navigation }) => ({
        header: <Header title='ارتباط با ما' navigation={navigation} />
    })
    constructor(props) {
        super(props)
        this.state = {
            FullName: this.props.user.FullName,
            Email: this.props.user.Email,
            Title: '',
            Phone: this.props.user.Phone,
            Description: '',
            EmailError: false,
            PhoneError: false,
            DescriptionError: false,
            loading: false
        }



    }
    componentDidMount() {
        isUserLogin().then(res => {

            if (res)
                getUserContactInfo().then(result => {
                    ContactInfo = result.Table.filter(el => { return el.ContactTypeName.toLowerCase() == 'mobile' })[0]
                    this.setState({ Phone: 0 + ContactInfo.AreaCode + ContactInfo.Contact })
                })
        })
    }
    handleinput(type, value) {
        switch (type) {
            case "FullName":
                this.setState({ FirstName: value })
                break;
            case "Email":
                this.setState({ Email: value, EmailError: false })
                break;
            case "Title":
                this.setState({ Title: value })
                break;
            case "Phone":
                this.setState({ Phone: value.toString().replace(/[^\d]/g, '').toString(), PhoneError: false })
                break;
            case "Description":
                this.setState({ Description: value, DescriptionError: false })
                break;
            default:
                break;
        }
    }
    Send() {
        if ((!this.state.Email || !EmailValidation(this.state.Email)) && !this.state.Phone) {
            this.setState({ EmailError: true, PhoneError: true })
            ToastAndroid.showWithGravity('لطفا شماره تلفن یا ایمیل خود را وارد نمایید',
                ToastAndroid.SHORT,
                ToastAndroid.CENTER);
        }
        if (!this.state.Description)
            this.setState({ DescriptionError: true })
        if (((this.state.Email && EmailValidation(this.state.Email)) || this.state.Phone) && this.state.Description) {
            this.setState({ loading: true })
            this.SendMessage().then(() => {
                this.setState({ Description: '', Title: '', loading: false })
                ToastAndroid.showWithGravity('پیام شما با موفقیت ارسال گردید',
                    ToastAndroid.SHORT,
                    ToastAndroid.CENTER);
            })
        }
    }
    SendMessage() {
        return new Promise((fullFill, eject) => {
            fetch(`https://www.cheegel.com/apis/api/contactusform/Save`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json; charset=utf-8',
                    'Content-Type': 'application/json; charset=utf-8',
                },
                body: JSON.stringify({
                    ID: 0,
                    UserID: null,
                    IsView: false,
                    FullName: this.state.FullName,
                    EmailAddress: this.state.Email,
                    Title: this.state.Title,
                    Description: this.state.Description,
                    Tel: this.state.Phone
                })
            }).then(fullFill)
        })
    }
    render() {
        return (
            <View style={{ display: 'flex', flex: 1, paddingBottom: 60 }}>
                <ScrollView style={{ flex: 1, marginBottom: 10 }}>
                    <Card style={{ display: 'flex', flex: 1, backgroundColor: '#fff', position: 'relative' }}>
                        <CustomeTextInput
                            value={this.state.FullName}
                            placeholder="نام کامل"
                            onChangeText={(Value) => this.handleinput("FullName", Value)}
                        ></CustomeTextInput>
                        <CustomeTextInput
                            value={this.state.Email}
                            hasError={this.state.EmailError}
                            placeholder="پست الکترونیکی"
                            isLeftAlign={true}
                            onChangeText={(Value) => this.handleinput("Email", Value)}
                        ></CustomeTextInput>
                        <CustomeTextInput
                            value={this.state.Title}
                            placeholder="موضوع"
                            onChangeText={(Value) => this.handleinput("Title", Value)}
                        ></CustomeTextInput>
                        <CustomeTextInput
                            value={this.state.Phone}
                            hasError={this.state.PhoneError}
                            placeholder="موبایل"
                            isLeftAlign={true}
                            onChangeText={(Value) => this.handleinput("Phone", Value)}
                        ></CustomeTextInput>
                        <CustomeTextInput
                            value={this.state.Description}
                            hasError={this.state.DescriptionError}
                            multiline={true}
                            placeholder="توضیحات"
                            onChangeText={(Value) => this.handleinput("Description", Value)}
                        ></CustomeTextInput>
                        <CustomeButton
                            title="ارسال"
                            onPress={() => this.Send()}
                            loading={this.state.loading}
                        >
                        </CustomeButton>
                    </Card>
                </ScrollView>
            </View>
        )
    }
}
const mapStateToProps = state => {
    return {
        routeList: state.initial.routeList,
        user: state.initial.user,
        isUserLogin: state.initial.isUserLogin,
        ...state.navigation.routes.filter(x => x.params.active)[0].params
    }
}

export default connect(mapStateToProps, { setFooterVisibility, setDarkFooter, updateUserLogin, updateRouteList })(ContactUs)