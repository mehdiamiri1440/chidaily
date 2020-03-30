import React, { Component } from 'react';
import { Text, TouchableOpacity } from 'react-native';


export const PlusButton = (props) => {
    return (
        <TouchableOpacity style={{ backgroundColor: '#0097A7', alignItems: 'center', padding: 4, borderRadius: 4 }} onPress={props.onPress}>
            <Text style={{ fontSize: 24, color: 'white' }}>{!props.isMinimize ? '+' : '-'}</Text>
        </TouchableOpacity>
    )
}