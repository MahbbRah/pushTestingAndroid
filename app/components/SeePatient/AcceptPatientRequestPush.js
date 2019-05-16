import React from 'react';
import { View, TouchableHighlight, Text, StyleSheet, Image} from 'react-native';
import InCallManager from 'react-native-incall-manager';

import CONST from '../../lib/constants';
import API from '../../lib/api';

export default class AcceptPatientRequestPush extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //
        }
        this.API = new API();
    }

    handleAccept = () => {


        //remove this screen from stack
        this.props.navigation.pop();
        this.stopCallSound();
        this.props.navigation.navigate("PatientProfile");
    }

    handleReject = () => {

        //remove this screen from stack.
        this.props.navigation.pop();
        this.stopCallSound()

    }

    stopCallSound = () => {
        InCallManager.stopRingtone();
    } 


    render() {

        let patientName = "Mahbub rahman --";

        if(!patientName) {
            return <Text style={{marginTop: 50, fontSize: 20, fontWeight: 'bold', marginLeft: 10}}>Something Went Wrong...</Text>
        } else {
            return (
                <View style={{ flex: 1, backgroundColor: CONST.COLORS.THEME_COLOR, flexDirection: 'column' }}>
                    <View style={{flex: .25}}></View>

                    <View style={{flex: .5, flexDirection: 'column', alignItems: 'center'}}>
                        <Image source={require('../../assets/add_icon.png')} style={{height: 70, width: 70, marginLeft: -20, marginBottom: 10}} />
                        <View style={{flexDirection: 'column'}}>
                            <Text style={{fontSize: 25, color: '#FFF'}}>New Patient Request</Text>

                            <View style={{marginLeft: 25}}>
                                <View style={{ flexDirection: 'row' }}>
                                    <TouchableHighlight style={styles.actionBtnReject} underlayColor="#A3212E" onPress={this.handleReject}>
                                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Got it!</Text>
                                    </TouchableHighlight>
                                    <TouchableHighlight style={styles.actionBtnAccept} underlayColor="#2DB2BC" onPress={this.handleAccept}>
                                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Start seeing Patient</Text>
                                    </TouchableHighlight>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            )
        }
    }
}

const styles = StyleSheet.create({
    actionBtnAccept: { 
        margin: 7, 
        padding: 7, 
        paddingLeft: 16, 
        paddingRight: 16, 
        backgroundColor: '#2DB2BC', 
        borderRadius: 5 
    },
    actionBtnReject: { 
        marginLeft: 0, 
        margin: 7, 
        padding: 7, 
        paddingLeft: 16, 
        paddingRight: 16, 
        backgroundColor: '#A3212E', 
        borderRadius: 5 
    }
})