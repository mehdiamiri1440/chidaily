import React, { Component } from 'react';
import {
    ScrollView, Image, ActivityIndicator,
    View, Text, TouchableOpacity, Modal, BackHandler,
    TextInput
} from 'react-native';
import { Card, Icon, Input, InputGroup } from 'native-base';
import { connect } from 'react-redux';
import styles, { colors, fonts, fontSize } from '../../styles';
import { numberWithCommas, backAndroid, } from '../../utility';
import { setFooterVisibility, setDarkFooter, updateRouteList } from '../../actions';
import RNFetchBlob from 'react-native-fetch-blob'
import Barcode from 'react-native-barcode-builder';
import { deviceWidth, deviceHeight, apiServer, nodeApiServer } from '../../utility/consts';
import Header from '../common/Header';
const ImagePicker = require('react-native-image-picker');

const headerText = [styles.fontFamily, { flex: 1, fontSize: 16, color: colors.textPrimary }]
//const headerText2 = [styles.fontFamily, { flex: 1, fontSize: 16, color: colors.secondaryText }]
const typicalText = [styles.fontFamily, { flex: 1, fontSize: 14, paddingVertical: 4, paddingVertical: 4, color: colors.secondaryText, textAlignVertical: 'center' }]
const btnStyle = { alignItems: 'center', backgroundColor: colors.primary, paddingVertical: 8, borderRadius: 4 }
const textStyle = [styles.fontFamily, { fontSize: fontSize.small, color: 'white' }]

class Agents extends Component {
    static navigationOptions = ({ navigation }) => ({
        header: <Header title='سفارشات چی دیلی' navigation={navigation} />
    })
    constructor(props) {
        super(props)
        this.state = {
            statusList: [],
            basketList: [],
            showStatusListModal: false,
            activeBasketIndx: null,
            username: this.props.user && this.props.user.UserName ? this.props.user.UserName : 'pourdad.daneshmand',
            historyMode: false,
            loading: false,
            showBarcodes: false,
            unavailableProductModal: false,
            selectedUnavailableProduct: {},
            Alteration: {
                Description: '',
                ImageList: ['', '', '', '']
            },
            showFactorNoDesign: false,
            factorNo: '',
            factorNoRegistrationProgress: false

        }




        this.getStatusList().then(res => {
            this.getAgentTasks()
        })
    }
    componentDidMount() {
        // var options = {
        //     title: 'Select Avatar',
        //     customButtons: [
        //       {name: 'fb', title: 'Choose Photo from Facebook'},
        //     ],
        //     storageOptions: {
        //       skipBackup: true,
        //       path: 'images'
        //     }
        //   };
        //   ImagePicker.showImagePicker(options, (response) => {
        //     console.log('Response = ', response);

        //     if (response.didCancel) {
        //       console.log('User cancelled image picker');
        //     }
        //     else if (response.error) {
        //       console.log('ImagePicker Error: ', response.error);
        //     }
        //     else if (response.customButton) {
        //       console.log('User tapped custom button: ', response.customButton);
        //     }
        //     else {
        //       let source = { uri: response.uri };

        //       // You can also display the image using data:
        //       // let source = { uri: 'data:image/jpeg;base64,' + response.data };

        //       this.setState({
        //         avatarSource: source
        //       });
        //     }
        //   });   
    }
    getStatusList() {
        return new Promise((fullFill, eject) => {
            fetch(`${nodeApiServer}getStatusList/`).then(responce => {
                responce.json().then(statusList => {
                    this.setState({
                        statusList: statusList
                    })
                    fullFill(true)
                })
            })
        })
    }
    getAgentTasks() {
        return new Promise((fullFill, eject) => {
            this.setState({ loading: true })
            fetch(`${nodeApiServer}getAgentTasks/${this.state.username}/${this.state.historyMode ? '1' : ''}`).then(responce => {
                responce.json().then(result => {
                    let basketList = [];
                    result.map(dataRow => {
                        let parsedBasketDescription = JSON.parse(dataRow.BasketDescription);
                        let basket = parsedBasketDescription.filter(e => e.ProductType == 'Master')[0];
                        basket.details = parsedBasketDescription.filter(e => e.ProductType == 'Detail');
                        basket.BasketDescription = parsedBasketDescription
                        basketList.push(basket)
                    })
                    this.setState({
                        loading: false,
                        basketList: basketList
                    })
                    fullFill(true);
                })
            })
        })
    }
    updateUserOrderMasterFactorNo() {
        this.setState({ factorNoRegistrationProgress: true });
        let trackingCode = this.state.basketList[this.state.activeBasketIndx].TrackingCode;
        fetch(`${nodeApiServer}updateuserordermasterfactornobytrackingCode/${trackingCode}/${this.state.factorNo}`).then(responce => {
            responce.json().then(result => {
                this.getAgentTasks();
                this.setState({
                    showStatusListModal: false,
                    factorNoRegistrationProgress: false
                })
            })
        })
    }
    viewPdf(trackingcode) {
        return new Promise((fullFill, eject) => {
            let pdfUrl = `${apiServer}Handlers/FileHandler.ashx?type=userordermasterpdf&trackingcode=${trackingcode}`
            let fs = RNFetchBlob.fs
            let dirs = fs.dirs
            let targetpath = `${dirs.DownloadDir}/chidaily/pdf/${trackingcode}.pdf`
            let android = RNFetchBlob.android
            fs.exists(targetpath).then(isFileExist => {
                if (!isFileExist)
                    RNFetchBlob.config({
                        fileCache: true,
                        path: targetpath
                    }).fetch('GET', pdfUrl).then((res) => {
                        android.actionViewIntent(res.path(), 'application/pdf')
                    })
                else
                    android.actionViewIntent(targetpath, 'application/pdf')
            })

        })
    }
    statusButtonClicked(basketIndx, status) {
        let basketList = [];
        this.state.basketList.map(b => {
            basketList.push(b)
        })
        basketList[basketIndx].loading = true
        let basketDescription = [];

        // for (let index = 0; index < basketList[basketIndx].BasketDescription.length; index++) {
        //     let element = basketList[basketIndx].BasketDescription[index];
        //     if (element.ProductType == 'Master') {
        //         element.StatusCode = status.Code
        //         basketList[basketIndx].StatusCode = status.Code
        //     }
        //     basketDescription.push(element)
        // }

        //basketList[basketIndx].BasketDescription = basketDescription
        //let x = JSON.stringify(basketDescription)
        // basketList[basketIndx].BasketDescription.map(x => {
        //     if (x.ProductType == 'Master') {
        //         x.StatusCode = status.Code
        //         basketList[basketIndx].StatusCode = status.Code
        //     }
        // })
        fetch('http://www.cheegel.com:3004/api/updateOrderStatus/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json; charset=utf-8',
                'Content-Type': 'application/json; charset=utf-8',
            },
            body: JSON.stringify({
                userName: this.state.username,
                trackingCode: basketList[basketIndx].TrackingCode,
                //basketDescription: basketDescription,
                statusCode: status.Code
            })
        }).then(responce => {
            responce.json().then(result => {
                if (status.Code == 68)
                    this.setState({ showFactorNoDesign: true, basketList: basketList })
                else {
                    this.getAgentTasks();
                    this.setState({
                        showStatusListModal: false,
                        basketList: basketList
                    })
                }
                // if (result)
                //     basketList[basketIndx].loading = false
                // this.setState({
                //     basketList: basketList
                // })
            })
        })

    }
    taskTypeBtnPress(type) {
        this.setState({
            historyMode: type == 'current' ? false : true
        });
        setTimeout(() => {
            this.getAgentTasks()
        }, 1000);
    }
    renderFactorNoRegistrationBtn() {
        if (this.state.factorNoRegistrationProgress == false)
            return (
                <TouchableOpacity onPress={() => { this.updateUserOrderMasterFactorNo() }} style={{ marginTop: 8 }}>
                    <View style={{ backgroundColor: colors.primary, width: deviceWidth * 0.3, borderRadius: 3, height: 40 }}>
                        <Text
                            allowFontScaling={false}
                            style={[styles.fontFamily, { fontSize: fontSize.small, color: '#fff', paddingVertical: 5, textAlign: 'center' }]}>ثبت شماره</Text>
                    </View>
                </TouchableOpacity>
            )
        else
            return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 24 }}>
                    <ActivityIndicator size={50} />
                </View>
            )

    }
    cameraIconClick(indx) {
        ImagePicker.showImagePicker({
            title: 'انتخاب محصول جایگزین',
            maxHeight: 480,
            maxWidth: 480,
            customButtons: [
                // {
                //     name: 'fb',
                //     title: 'Choose Photo from Facebook'
                // },
            ],
            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        }, (response) => {
            //console.warn('Response = ', response);
            if (response.didCancel) {
                //console.warn('User cancelled image picker');
            }
            else if (response.error) {
                //console.warn('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                //console.warn('User tapped custom button: ', response.customButton);
            }
            else {
                let source = { uri: response.uri };
                //console.warn('source: ', source);
                // let source = { uri: 'data:image/jpeg;base64,' + response.data };
                let ImageList = this.state.Alteration.ImageList
                ImageList[indx] = source
                let Alteration = {
                    ...this.state.Alteration,
                    ImageList
                }
                this.setState({
                    Alteration
                });
            }
        });
    }
    closeUnavailableProductModal() {
        this.setState({
            Alteration: { Description: '', ImageList: ['', '', '', ''] },
            unavailableProductModal: false,
            selectedUnavailableProduct: {}
        })
    }
    saveUnavailableProduct() {
        if (this.state.Alteration && (this.state.Alteration.Description || this.state.Alteration.ImageList.filter(x => x).length)) {
            let detail = this.state.basketList[this.state.selectedUnavailableProduct.basketIndex].details[this.state.selectedUnavailableProduct.detailIndex]
            detail.Alteration = this.state.Alteration
            let basketList = this.state.basketList
            basketList[this.state.selectedUnavailableProduct.basketIndex].details[this.state.selectedUnavailableProduct.detailIndex] = detail
            this.setState({
                basketList,
                Alteration: { Description: '', ImageList: ['', '', '', ''] },
                unavailableProductModal: false,
                selectedUnavailableProduct: {}
            })
            //console.warn(this.state.Alteration)
        }
        else
            this.closeUnavailableProductModal()
    }
    renderTaskTypeButtons() {
        return (
            <View style={{ flex: 1, flexDirection: 'row-reverse', justifyContent: 'center' }}>
                <View style={{ flex: 1, padding: 8 }}>
                    <TouchableOpacity
                        style={btnStyle}
                        onPress={() => this.taskTypeBtnPress('current')}>
                        <Text
                            allowFontScaling={false}
                            style={textStyle}>در حال انجام</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1, padding: 8 }}>
                    <TouchableOpacity style={btnStyle}
                        onPress={() => this.taskTypeBtnPress('history')}>
                        <Text
                            allowFontScaling={false}
                            style={textStyle}>تاریخچه</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
    renderBarcodesButton() {
        return (
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <View style={{ flex: 1, padding: 4 }}>
                    <TouchableOpacity style={[{
                        //backgroundColor: this.state.showBarcodes ? colors.primary : '#c1c1c1', 
                        flexDirection: 'row-reverse',
                        alignItems: 'center'
                    }]}
                        onPress={() => this.setState({ showBarcodes: !this.state.showBarcodes })}>
                        <Icon
                            allowFontScaling={false}
                            name={this.state.showBarcodes ? 'ios-stats' : 'ios-stats-outline'} style={{
                                fontSize: 32, color: this.state.showBarcodes ? colors.primary : colors.secondaryText
                            }} />
                        <Text
                            allowFontScaling={false}
                            style={[styles.fontFamily, {
                                paddingHorizontal: 8,
                                color: this.state.showBarcodes ? colors.primary : colors.secondaryText,
                                fontSize: fontSize.small
                            }]}>نمایش بارکد</Text>
                    </TouchableOpacity>
                </View>

            </View>

        )
    }
    renderBasketList() {
        if (!this.state.loading)
            return (
                <View>
                    {this.state.basketList.map((basket, basketIndx) => this.renderBasket(basketIndx))}
                </View>
            )
        else
            return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 24 }}>
                    <ActivityIndicator size={50} />
                </View>
            )
    }
    renderBasket(basketIndx) {
        let basket = this.state.basketList[basketIndx]
        return (
            <View key={basket.Code} style={{ paddingVertical: 8 }}>
                <Card style={[styles.card, { paddingHorizontal: 0, paddingBottom: 16 }]}>
                    {this.renderBasketImage(basketIndx)}
                    {this.renderBasketTitle(basketIndx)}
                    {this.renderBasketDetails(basketIndx)}
                    {this.renderBasketCurrentStatus(basketIndx)}
                    {this.renderBasketStatusArea(basketIndx)}
                    {this.renderPdfButton(basketIndx)}
                </Card>
            </View>

        )
    }
    renderBasketImage(basketIndx) {
        let basket = this.state.basketList[basketIndx]
        return (
            <View style={{
                flex: 1,
                justifyContent: 'flex-start',
                alignItems: 'center',
                height: deviceHeight * 0.4,
                width: '100%',
                position: 'relative'
            }}>
                <Image
                    style={{
                        width: '100%',
                        height: deviceHeight * 0.4,
                        position: 'absolute',
                        borderTopLeftRadius: 4,
                        borderTopRightRadius: 4,
                        top: -8

                    }}
                    resizeMode='contain'
                    source={{
                        uri: `https://www.cheegel.com/apis/UploadedFiles/CheegelCacheImages/SizeType4/${basket.ProductImage}.png`
                    }}
                />
            </View>
        )
    }
    renderBasketTitle(basketIndx) {
        let basket = this.state.basketList[basketIndx]
        return (
            <View style={{ paddingHorizontal: 16 }}>
                <Text
                    allowFontScaling={false}
                    style={headerText}>{basket.Title}</Text>
                <Text
                    allowFontScaling={false}
                >
                    <Text
                        allowFontScaling={false}
                        style={headerText}>سفارش شماره</Text>
                    <Text
                        allowFontScaling={false}
                        style={{ color: colors.secondaryText, fontSize: 14, fontWeight: 'bold' }}>&nbsp;&nbsp;{basket.TrackingCode} </Text>
                </Text>
            </View>
        )
    }
    renderBasketDetails(basketIndx) {
        let basket = this.state.basketList[basketIndx]
        if (basket.details.length)
            return (
                <View>
                    <Text
                        allowFontScaling={false}
                        style={[styles.fontFamily, { flex: 1, fontSize: 16, color: colors.secondaryText, paddingHorizontal: 16 }]}>اقلامی که میبایست ارسال گردند:</Text>
                    <View style={{ paddingVertical: 8 }}>
                        {basket.details.map((detail, indx) => {
                            return (
                                <TouchableOpacity key={indx}
                                    onPress={() => {
                                        this.setState({
                                            Alteration: detail.Alteration ? detail.Alteration : { Description: '', ImageList: ['', '', '', ''] },
                                            selectedUnavailableProduct: {
                                                basketIndex: basketIndx,
                                                detailIndex: indx
                                            },
                                            unavailableProductModal: true,
                                        })
                                    }}
                                    style={{ borderBottomWidth: 1, borderBottomColor: '#c1c1c1', paddingVertical: 16 }}>
                                    <View style={{ flexDirection: 'row-reverse', alignItems: 'center' }}>
                                        <View style={{ flex: 1, padding: 4, alignItems: 'center' }}>
                                            <Text
                                                allowFontScaling={false}
                                                style={typicalText}>{indx + 1}</Text>
                                        </View>
                                        <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
                                            <Image
                                                style={{ width: 64, height: 64, borderRadius: 64 }}
                                                resizeMode='contain'
                                                source={{
                                                    uri: `https://www.cheegel.com/apis/UploadedFiles/CheegelCacheImages/SizeType4/${detail.ProductImage}.png`
                                                }}
                                            />
                                        </View>
                                        <View style={{ flex: 8, paddingHorizontal: 16 }}>
                                            <Text
                                                allowFontScaling={false}
                                                style={typicalText}>{detail.Title}</Text>
                                            <Text
                                                allowFontScaling={false}
                                                style={typicalText}>{detail.Brand}</Text>
                                        </View>
                                        <View style={{ flex: 2, alignItems: 'center' }}>
                                            <Text
                                                allowFontScaling={false}
                                                style={typicalText}>{detail.Quantity} عدد</Text>
                                        </View>
                                    </View>
                                    {this.renderDetailBarcode(detail)}
                                </TouchableOpacity>

                            )
                        })}
                    </View>
                </View >
            )
    }
    renderDetailBarcode(detail) {
        if (this.state.showBarcodes)
            return (
                <View style={{ alignItems: 'center' }}>
                    <Barcode style={{ paddingVertical: 16 }} value={detail.Barcode} height={50} format="CODE128" />
                    <Text
                        allowFontScaling={false}
                    >{detail.Barcode}</Text>
                </View>

            )
    }
    renderPdfButton(basketIndx) {
        let basket = this.state.basketList[basketIndx]
        return (
            <View style={{ paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity
                    style={{ paddingVertical: 8, paddingHorizontal: 16, borderRadius: 4, backgroundColor: colors.purple }}
                    onPress={() => { this.viewPdf(basket.TrackingCode) }}>
                    <Text
                        allowFontScaling={false}
                        style={[styles.fontFamily, { color: 'white' }]}>مشاهده فاکتور</Text>
                </TouchableOpacity>
            </View>
        )
    }
    renderBasketCurrentStatus(basketIndx) {
        let basket = this.state.basketList[basketIndx]
        let status = this.state.statusList.filter(s => s.Code == basket.StatusCode)[0]
        return (
            <View style={{ alignItems: 'stretch', paddingVertical: 8, paddingHorizontal: 16 }}>
                <Text
                    allowFontScaling={false}
                    style={[styles.fontFamily, { fontSize: 14, textAlign: 'right', color: colors.secondaryText }]}>وضعیت فعلی سبد: {status.LocalName}</Text>
            </View>
        )
    }
    renderBasketStatusArea(basketIndx) {
        if (!this.state.historyMode) {
            let basket = this.state.basketList[basketIndx]
            let status = this.state.statusList.filter(s => s.Code == basket.StatusCode)[0]
            if (status.Code.toString() == '70')
                status = this.state.statusList.filter(s => s.Code.toString() == '66')[0]
            else if (status.Code.toString() == '66')
                status = this.state.statusList.filter(s => s.Code.toString() == '67')[0]
            else if (status.Code.toString() == '67')
                status = this.state.statusList.filter(s => s.Code.toString() == '68')[0]
            if (!basket.loading)
                return (
                    <View style={{ padding: 8 }}>
                        <View key={status.ID} style={{ flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-around', padding: 8 }}>
                            <TouchableOpacity
                                style={{ flex: 1, alignItems: 'center' }}
                                onPress={() => {
                                    this.setState({
                                        activeBasketIndx: basketIndx,
                                        showStatusListModal: true
                                    })
                                }}>
                                <Icon
                                    allowFontScaling={false}
                                    name='md-more' style={{ fontSize: 24, color: colors.secondaryText }} />
                            </TouchableOpacity>
                            {this.renderStatusButton(status, basketIndx, true)}
                        </View>

                    </View>
                )

            else
                return (
                    <View style={{ paddingVertical: 8 }}>
                        <ActivityIndicator size={32} />
                    </View>
                )
        }

    }
    renderStatusButton(status, basketIndx, selected) {
        let basket = this.state.basketList[basketIndx]
        if (selected)
            return (
                <TouchableOpacity
                    style={{
                        flex: 6, backgroundColor: colors.primary, paddingVertical: 16,
                        elevation: 2,
                        paddingHorizontal: 4, borderRadius: 4
                    }}
                    onPress={() => {
                        this.statusButtonClicked(basketIndx, status)
                    }}>
                    <Text
                        allowFontScaling={false}
                        style={[styles.fontFamily, { flex: 1, textAlign: 'center', color: 'white', fontSize: 14 }]}>{status.LocalName}</Text>
                </TouchableOpacity>
            )
        else
            return (
                <View key={status.ID} style={{ flex: 1, alignItems: 'stretch', justifyContent: 'center', paddingVertical: 8 }}>
                    <TouchableOpacity style={{ flex: 1, borderColor: '#ddd', borderWidth: 1, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 4, alignItems: 'center' }}
                        onPress={() => { this.statusButtonClicked(basketIndx, status) }}>
                        <Text
                            allowFontScaling={false}
                            style={[styles.fontFamily, { color: colors.secondaryText, fontSize: 14 }]}>{status.LocalName}</Text>
                    </TouchableOpacity>
                </View>
            )
    }
    renderNoTaskAvailable() {
        if (!this.state.basketList.length && !this.state.loading)
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 16 }}>
                    <Text
                        allowFontScaling={false}
                        style={[styles.fontFamil, { fontSize: fontSize.small }]}>
                        در حال حاضر هیچ وظیفه ای وجود ندارد.
                </Text>
                </View>
            )
    }
    renderStatusListAreaDesign() {
        if (this.state.showFactorNoDesign == false)
            return (
                <View style={{ width: deviceWidth * 0.8, backgroundColor: 'white', elevation: 16, borderRadius: 4, paddingVertical: 16, paddingHorizontal: 16 }}>
                    <View style={{ alignItems: 'flex-end' }}>
                        <TouchableOpacity
                            style={{ paddingBottom: 8, borderRadius: 4, alignItems: 'center' }}
                            onPress={() => {
                                this.setState({ showStatusListModal: false })
                            }}>
                            <Icon
                                allowFontScaling={false}
                                name='close' style={{ fontSize: 20, color: colors.secondaryText }} />
                        </TouchableOpacity>
                    </View>
                    <ScrollView>
                        {
                            this.state.statusList.filter(x => x.StatusTypeCode.toString() == '10').map(status => {
                                return this.renderStatusButton(status, this.state.activeBasketIndx)
                            })
                        }
                    </ScrollView>
                </View>
            )
        else
            return (
                <View style={{ height: deviceHeight * 0.3, width: deviceWidth * 0.8, backgroundColor: 'white', elevation: 16, borderRadius: 4, paddingVertical: 16, paddingHorizontal: 16, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ alignItems: 'flex-end' }}>
                        <InputGroup borderType='regular' style={{ paddingVertical: 8 }}>
                            <Input
                                style={{ fontFamily: fonts.BYekan, color: colors.secondaryText }}
                                value={this.state.factorNo}
                                onChangeText={factorNo => this.setState({ factorNo })}
                                placeholder='لطفا شماره فاکتور فروشگاه را وارد نمایید' />
                        </InputGroup>
                    </View>
                    {this.renderFactorNoRegistrationBtn()}
                </View>
            )
    }
    renderStatusListModal() {
        return (
            <Modal transparent={true}
                animationType='fade'
                visible={this.state.showStatusListModal}
                onRequestClose={() => { this.setState({ activeBasketIndx: null }) }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    {this.renderStatusListAreaDesign()}
                </View>
            </Modal >
        )
    }
    renderAlternationImage(indx) {
        if (this.state.Alteration && this.state.Alteration.ImageList[indx])
            return (
                <Image source={this.state.Alteration.ImageList[indx]}
                    style={{
                        width: deviceWidth * 0.15,
                        height: deviceWidth * 0.15
                    }}
                    resizeMode='contain' />
            )
        else
            return (
                <Icon name='camera' style={{ fontSize: 32, color: colors.secondaryText }} />
            )
    }
    renderAlternationImages() {
        return (
            <View style={{ paddingVertical: 8, alignItems: 'stretch' }}>
                <Text style={{ paddingBottom: 16 }}>در صورت نیاز از محصولات مشابه عکس بگیرید</Text>
                <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between' }}>
                    {this.state.Alteration.ImageList.map((img, indx) => {
                        return (
                            <View key={indx}>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.cameraIconClick(indx)
                                    }}
                                    style={{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        width: deviceWidth * 0.15,
                                        height: deviceWidth * 0.15,
                                        backgroundColor: '#ddd',
                                        borderRadius: 4
                                    }}>
                                    <View>
                                        {this.renderAlternationImage(indx)}
                                    </View>

                                </TouchableOpacity>
                            </View>)
                    })}
                </View>
            </View>
        )
    }
    renderUnavailableProductModal() {
        if (this.state.unavailableProductModal) {
            let detail = this.state.basketList[this.state.selectedUnavailableProduct.basketIndex].details[this.state.selectedUnavailableProduct.detailIndex]
            return (
                <Modal transparent={true}
                    animationType='fade'
                    visible={this.state.unavailableProductModal}
                    onRequestClose={() => {
                        this.closeUnavailableProductModal()
                    }}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <View style={{
                            width: deviceWidth * 0.9,
                            backgroundColor: 'white', elevation: 16,
                            borderRadius: 4, paddingVertical: 16,
                            paddingHorizontal: 16
                        }}>
                            <View style={{ alignItems: 'flex-end' }}>
                                <TouchableOpacity
                                    style={{ paddingBottom: 8, borderRadius: 4, alignItems: 'center' }}
                                    onPress={() => {
                                        this.closeUnavailableProductModal()
                                    }}>
                                    <Icon
                                        allowFontScaling={false}
                                        name='close' style={{ fontSize: 20, color: colors.secondaryText }} />
                                </TouchableOpacity>
                            </View>
                            <View>
                                <View style={{ flexDirection: 'row-reverse' }}>
                                    <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
                                        <Image
                                            style={{ width: 64, height: 64, borderRadius: 64 }}
                                            resizeMode='contain'
                                            source={{
                                                uri: `https://www.cheegel.com/apis/UploadedFiles/CheegelCacheImages/SizeType4/${detail.ProductImage}.png`
                                            }}
                                        />
                                    </View>
                                    <View style={{ flex: 8, paddingHorizontal: 16 }}>
                                        <Text
                                            allowFontScaling={false}
                                            lineBreakMode='tail'
                                            numberOfLines={1}
                                            style={typicalText}>{detail.Title}</Text>
                                        <Text style={typicalText}>{detail.Brand}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={{ paddingVertical: 8, alignItems: 'stretch' }}>
                                <Text
                                    allowFontScaling={false}
                                    style={{ padding: 8 }}>در صورت ناموجود بودن این کالا، کالاهای جایگزین را همراه با قیمت وارد نمایید</Text>
                                <TextInput multiline
                                    direction='rtl'
                                    placeholder={'توضیحات'}
                                    maxHeight={deviceHeight * 0.5}
                                    style={{
                                        borderWidth: 1, borderColor: '#ddd',
                                        borderRadius: 4,
                                        textDecorationLine: 'none'
                                    }} />
                            </View>
                            <View style={{ paddingVertical: 8, alignItems: 'stretch' }}>
                                <Text
                                    allowFontScaling={false}
                                    style={{ paddingBottom: 16 }}>در صورت نیاز از محصولات مشابه عکس بگیرید</Text>
                                <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between' }}>
                                    <View>
                                        <TouchableOpacity style={{
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            width: deviceWidth * 0.15,
                                            height: deviceWidth * 0.15,
                                            backgroundColor: '#ddd',
                                            borderRadius: 4
                                        }}>
                                            <Icon name='camera' style={{ fontSize: 32, color: colors.secondaryText }} />
                                        </TouchableOpacity>
                                    </View>
                                    <View>
                                        <TouchableOpacity style={{
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            width: deviceWidth * 0.15,
                                            height: deviceWidth * 0.15,
                                            backgroundColor: '#ddd',
                                            borderRadius: 4
                                        }}>
                                            <Icon name='camera' style={{ fontSize: 32, color: colors.secondaryText }} />
                                        </TouchableOpacity>
                                    </View>
                                    <View>
                                        <TouchableOpacity style={{
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            width: deviceWidth * 0.15,
                                            height: deviceWidth * 0.15,
                                            backgroundColor: '#ddd',
                                            borderRadius: 4
                                        }}>
                                            <Icon name='camera' style={{ fontSize: 32, color: colors.secondaryText }} />
                                        </TouchableOpacity>
                                    </View>
                                    <View>
                                        <TouchableOpacity style={{
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            width: deviceWidth * 0.15,
                                            height: deviceWidth * 0.15,
                                            backgroundColor: '#ddd',
                                            borderRadius: 4
                                        }}>
                                            <Icon name='camera' style={{ fontSize: 32, color: colors.secondaryText }} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                            <View style={{ alignItems: 'center', paddingVertical: 16 }}>
                                <TouchableOpacity style={{ backgroundColor: colors.primary, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 4 }}>
                                    <Text
                                        allowFontScaling={false}
                                        style={[styles.fontFamily, { color: 'white', fontSize: fontSize.small }]}>ذخیره</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal >
            )
        }

    }
    render() {
        return (
            <View style={{ flex: 1, width: '100%', paddingBottom: deviceHeight * 0.12 }}>
                <ScrollView style={{ flex: 8, paddingHorizontal: 8 }}>
                    {this.renderTaskTypeButtons()}
                    {this.renderBarcodesButton()}
                    {this.renderBasketList()}
                    {this.renderNoTaskAvailable()}
                    {this.renderStatusListModal()}
                    {this.renderUnavailableProductModal()}
                </ScrollView>
            </View>

        )
    }
}
const mapStateToProps = state => {
    return {
        user: state.initial.user,
        routeList: state.initial.routeList,
        deviceDimensions: state.initial.deviceDimensions,
        ...state.navigation.routes.filter(x => x.params.active)[0].params

    }
}
export default connect(mapStateToProps, { setFooterVisibility, setDarkFooter, updateRouteList })(Agents)