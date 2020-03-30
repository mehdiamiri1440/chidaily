import React, { Component } from 'react';
import { connect } from 'react-redux';

import { updateRouteList } from '../../actions';
import {
    View, BackHandler
} from 'react-native';
import { screenNames } from '../../utility/consts';

class RedirectionHandler extends Component {
    constructor(props) {
        super(props)
        this.props.navigation.navigate(screenNames.ITEM_DETAILS,{ code: props.MasterCode })
    }
    render() {
        return (
            <View>
            </View>
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

export default connect(mapStateToProps, { updateRouteList })(RedirectionHandler)