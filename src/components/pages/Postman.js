import React, { Component } from 'react';
import {
    ScrollView, Image, ActivityIndicator,
    View, Text, TouchableOpacity, Modal, BackHandler
} from 'react-native';
import { Card, Icon } from 'native-base';
import { connect } from 'react-redux';
import styles, { colors, fonts } from '../../styles';
import { numberWithCommas, backAndroid, } from '../../utility';
import { setFooterVisibility, setDarkFooter, updateRouteList } from '../../actions';
import Header from '../common/Header';

class Postman extends Component {
    static navigationOptions = ({ navigation }) => ({
        header: <Header title='وظایف من' navigation={navigation} />
    })
    constructor(props) {
        super(props)
        this.state = {
            statusList: [],
            agentTaskList: [],
            username: this.props.user && this.props.user.UserName ? this.props.user.UserName : 'sasanabbasi1'//'pourdad.daneshmand'
        }
    }
    componentDidMount() {
        this.getStatusList().then(res => {
            this.getPostmanTasks()
        })
    }
    getStatusList() {
        return new Promise((fullFill, eject) => {
            fetch('http://www.cheegel.com:3004/api/getStatusList/').then(responce => {
                responce.json().then(statusList => {
                    this.setState({
                        statusList: statusList
                    })
                    fullFill(true)
                })
            })
        })
    }
    getPostmanTasks() {
        return new Promise((fullFill, eject) => {
            fetch(`http://www.cheegel.com:3004/api/getPostmanTasks/${this.state.username}`).then(responce => {
                responce.json().then(result => {
                    this.setState({ agentTaskList: result })
                    fullFill(true);
                })
            })
        })
    }

    postmanStatusButtonClicked(taskIndx, status) {
        let taskList = this.state.agentTaskList
        taskList[taskIndx].loading = true
        this.setState({ agentTaskList: taskList })
        fetch('http://www.cheegel.com:3004/api/updateOrderStatus/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json; charset=utf-8',
                'Content-Type': 'application/json; charset=utf-8',
            },
            body: JSON.stringify({
                userName: this.state.username,
                trackingCode: taskList[taskIndx].TrackingCode,
                statusCode: status.Code
            })
        }).then(responce => {
            responce.json().then(result => {
                taskList[taskIndx].loading = false
                this.getPostmanTasks()
                //this.setState({ agentTaskList: taskList })
            })
        })

    }
    renderTaskStatusArea(taskIndx) {
        let task = this.state.agentTaskList[taskIndx]
        if (task.loading)
            return (
                <View style={{ paddingVertical: 16 }}>
                    <ActivityIndicator size={32} />
                </View>
            )
        else
            return (
                <View style={{ paddingTop: 16 }}>
                    {this.state.statusList.filter(x => x.Code.toString() == '73').map(status => {
                        return (
                            <View key={status.Code} style={{ padding: 4 }}>
                                <TouchableOpacity
                                    style={{
                                        flex: 1, elevation: 2, paddingVertical: 16, borderRadius: 4,
                                        backgroundColor: colors.primary, alignItems: 'stretch'
                                    }}
                                    onPress={() => { this.postmanStatusButtonClicked(taskIndx, status) }}>
                                    <Text style={[styles.fontFamily, { textAlign: 'center', fontSize: 14, color: 'white' }]}>{status.LocalName}</Text>
                                </TouchableOpacity>
                            </View>
                        )
                    })}
                    <View style={{ flexDirection: 'row' }}>
                        {this.state.statusList.filter(x => x.StatusTypeCode.toString() == '11' && x.Code.toString() != '72' && x.Code.toString() != '73').map(status => {
                            return (
                                <View key={status.Code} style={{ flex: 1, padding: 4 }}>
                                    <TouchableOpacity
                                        style={{
                                            flex: 1, elevation: 2, paddingVertical: 12, borderRadius: 4,
                                            backgroundColor: '#c1c1c1', alignItems: 'stretch'
                                        }}
                                        onPress={() => { this.postmanStatusButtonClicked(taskIndx, status) }}>
                                        <Text style={[styles.fontFamily, { textAlign: 'center', fontSize: 14 }]}>{status.LocalName}</Text>
                                    </TouchableOpacity>
                                </View>
                            )
                        })}
                    </View>

                </View>
            )
    }
    renderMain() {
        return (
            <View style={{ flex: 1, paddingHorizontal: 8 }}>
                <ScrollView>
                    {this.state.agentTaskList.map((task, taskIndx) => {
                        return (
                            <Card key={task.TrackingCode} style={[styles.card, { position: 'relative', paddingTop: 36, paddingBottom: 16 }]}>
                                <Text style={{ position: 'absolute', top: 8, right: 0, paddingHorizontal: 16, paddingVertical: 4, backgroundColor: colors.primary, color: 'white', textAlignVertical: 'center', borderTopLeftRadius: 4, borderBottomLeftRadius: 4 }}>
                                    <Text style={[styles.fontFamily, { fontSize: 16 }]}>سفارش شماره: </Text>&nbsp;
                                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{task.TrackingCode}</Text>
                                </Text>
                                <Text style={{ paddingVertical: 8, textAlignVertical: 'center' }}>
                                    <Text style={[styles.fontFamily, { fontSize: 16, color: colors.textPrimary }]}>آدرس فرستنده: </Text>&nbsp;
                                        <Text style={[styles.fontFamily, { fontSize: 14, color: colors.secondaryText }]}>{task.SenderAddress}</Text>
                                </Text>
                                <Text style={{ paddingVertical: 8, textAlignVertical: 'center' }}>
                                    <Text style={[styles.fontFamily, { fontSize: 16, color: colors.textPrimary }]}>آدرس گیرنده: </Text>&nbsp;
                                        <Text style={[styles.fontFamily, { fontSize: 14, color: colors.secondaryText }]}>{task.RecieverAddress}</Text>
                                </Text>
                                <Text style={{ paddingVertical: 4, textAlignVertical: 'center' }}>
                                    <Text style={[styles.fontFamily, { fontSize: 16, color: colors.textPrimary }]}>نام گیرنده: </Text>&nbsp;
                                        <Text style={[styles.fontFamily, { fontSize: 14 }]}>{task.RecieverName}</Text>
                                </Text>
                                <Text style={{ paddingVertical: 8, textAlignVertical: 'center' }}>
                                    <Text style={[styles.fontFamily, { fontSize: 16, color: colors.textPrimary }]}>تلفن گیرنده: </Text>&nbsp;
                                        <Text style={[styles.fontFamily, { fontSize: 14 }]}>{task.RecieverCellphone}</Text>
                                </Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 16 }}>
                                    <Text style={[styles.fontFamily, { textAlignVertical: 'center', color: colors.primary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 4 }]}>
                                        {/* <Text style={[styles.fontFamily]}>قیمت: </Text>&nbsp; */}
                                        <Text style={{ fontSize: 22 }}>{numberWithCommas(Math.ceil(task.Price / 10))}</Text>&nbsp;
                                            <Text>تومان</Text>
                                    </Text>
                                    <Text style={[styles.fontFamily, { textAlignVertical: 'center', paddingVertical: 8, paddingHorizontal: 16, borderColor: 'red', color: 'red', borderWidth: 1, fontSize: 16, borderRadius: 4 }]}>
                                        {/* <Text style={[styles.fontFamily, { fontSize: 16, color: colors.textPrimary }]}>نوع پرداخت: </Text> */}
                                        <Text>{task.PaymentTypeName}</Text>
                                    </Text>
                                </View>
                                {this.renderTaskStatusArea(taskIndx)}
                            </Card>
                        )
                    })}
                </ScrollView>
            </View>
        )
    }
    render() {
        return (
            this.renderMain()
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
export default connect(mapStateToProps, { setFooterVisibility, setDarkFooter, updateRouteList })(Postman)