import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    Animated
} from 'react-native';
import { Router } from 'react-native-router-flux';
import { connect, Provider } from 'react-redux';
import scenes from './scenes'

const RouterWithRedux = connect()(Router);



export default RouterComponent = () => {
    return (
        <RouterWithRedux scenes={scenes} />
    )
}
