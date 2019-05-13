import React from 'react';
import { StyleSheet, View, TouchableHighlight, Text } from 'react-native';


export const CommonButton = (props) => {

    return (
        <TouchableHighlight
            onPress={props.onPressFunction}
            style={styles.doneBtnWrapper}
            underlayColor="transparent"
        >
            <Text style={styles.doneBtnText}>{props.buttonText}</Text>
        </TouchableHighlight>
    );
}




const styles =  StyleSheet.create({

    doneBtnWrapper: { 
        alignSelf: 'center', 
        backgroundColor: '#00B9FC', 
        width: '70%', 
        padding: 7, 
        borderRadius: 25 
    },
    doneBtnText: { 
        textAlign: 'center', 
        color: '#FFF', 
        fontWeight: 'bold' 
    }
});