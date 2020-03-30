import React, { Component } from 'react';
import {
    WebView
} from 'react-native';
import { connect } from 'react-redux';
import { updateBasketCount, setFooterVisibility, setDarkFooter, updateRouteList } from '../../actions';
import { deviceHeight } from '../../utility/consts';

class BankPayment extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (<WebView
            source={{ uri: this.props.url }}
            style={{ height: deviceHeight }}
        />
        )
    }
}
const mapStateToProps = state => {
    return {
        routeList: state.initial.routeList,
        deviceDimensions: state.initial.deviceDimensions,
        ...state.navigation.routes.filter(x => x.params.active)[0].params
    }
}

export default connect(mapStateToProps, { updateBasketCount, setFooterVisibility, setDarkFooter, updateRouteList })(BankPayment)