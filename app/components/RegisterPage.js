import React from 'react';
import { View, TouchableHighlight, Text, StyleSheet, TextInput, ScrollView, Alert, KeyboardAvoidingView } from 'react-native';
import { Permissions, Notifications } from 'expo';
import CONST from '../lib/constants';
import API from '../lib/api';


export default class RegisterPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            enabledConsulting: false,
            newProfilePic: null,
            firstName: '',
            lastName: '',
            emailAddr: '',
            doctorTitle: '',
            pushToken: '',
            doctor_id: '',
        }
        this.API = new API();

    }

    componentDidMount() {

        Notifications.addListener(this._handleNotification);
    }

    _handleNotification = (notifications) => {

        alert(JSON.stringify(notifications.data));
    }

    registerDeviceAndPush = async() => {

        // alert('Registration.. processing')
        const { status: existingStatus } = await Permissions.getAsync(
            Permissions.NOTIFICATIONS
        );
        let finalStatus = existingStatus;

        // only ask if permissions have not already been determined, because
        // iOS won't necessarily prompt the user a second time.
        if (existingStatus !== 'granted') {
            // Android remote notification permissions are granted during the app
            // install, so this will only ask on iOS
            const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            finalStatus = status;
        }

        // Stop here if the user did not grant permissions
        if (finalStatus !== 'granted') {
            return;
        }

        try{

            // Get the token that uniquely identifies this device
            let token = await Notifications.getExpoPushTokenAsync();

            if(token) {

                await this.API._storeData("pushToken", token);
                let saveTokenUrl = CONST.BASE_URL + CONST.APIS.UPDATE_PROFILE_META;

                let saveTokenPayload = {
                    userID: '594503409',
                    userType: 'patient',
                    profileMeta: JSON.stringify({
                        pushToken: token
                    })
                }

                this.setState({
                    pushToken: token
                });

                let saveToken = await this.API.POST(saveTokenUrl, saveTokenPayload);

                alert(JSON.stringify(saveToken));
            } else {
                alert("Something went wrong while generating token..");
            }

            // console.log(token);
            // alert(JSON.stringify(token));
        } catch(Err) {
            alert(JSON.stringify(Err));
        }
        

    }

    sendPushNotification = async() => {

        let doctor_id = this.state.doctor_id;

        // let getTokenFromStorage = await this.API._retrieveData("pushToken");

        if (doctor_id !== '') {

            // if (this.state.pushToken) {

                let getDoctorByIdUrl = CONST.BASE_URL + CONST.APIS.GET_DOCTOR_BY_ID;

                let getDoctor = await this.API.POST(getDoctorByIdUrl, {
                    doctor_id
                })

                try {
                    if (getDoctor.profile_meta) {

                        let sendPushNotificationUrl = CONST.BASE_URL + CONST.APIS.SEND_PUSH;

                        // let DoctorPushToken = JSON.parse(getDoctor.profile_meta).pushToken;
                        // console.log(DoctorPushToken)
                        let payload = {
                            pushToken: JSON.parse(getDoctor.profile_meta).pushToken,
                        };

                        const sendPushRequest = await this.API.POST(sendPushNotificationUrl, payload);

                        if (sendPushRequest.status === 'success') {

                            alert(sendPushRequest.message);
                        } else {
                            alert(sendPushRequest.message);
                            alert("Response sattus isa JSON so not working");
                        }
                    } else {
                        alert('Invalid Doctor ID provided');
                    }


                } catch (error) {
                    console.log('error on sending push: ', error)
                }

                
            // }
        } else {
            alert('You must need to enter a valid doctor ID, to Send Push.');
        }
        
    }
    
    render() {


        return (
            <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={75} style={{flex: 1, flexDirection: 'column'}}>
                <ScrollView style={{ flex: 1, backgroundColor: "#FFFFFF", flexDirection: 'column' }} keyboardShouldPersistTaps="always">
                    <View style={{ flex: .7 }}>
                        <View style={[styles.inputFieldsWrapper, { marginBottom: 20 }]}>
                            <View style={[styles.inputItemFull, { marginLeft: 20, alignContent: 'center', alignSelf: 'center', alignItems: 'center' }]}>
                                <TouchableHighlight onPress={this.registerDeviceAndPush} underlayColor="transparent" style={{ backgroundColor: CONST.COLORS.THEME_COLOR, elevation: 2, borderRadius: 7 }}>
                                    <Text style={{ padding: 8, color: '#FFF', fontWeight: '400' }}>
                                        Register Device & Push
                                </Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                        <View style={[styles.inputFieldsWrapper, { marginBottom: 20 }]}>
                            <View style={[styles.inputItemFull, { marginLeft: 20, alignContent: 'center', alignSelf: 'center', alignItems: 'center' }]}>
                                <TextInput
                                    placeholder="Enter doctor ID to send push Notifcation"
                                    defaultValue={this.state.doctor_id}
                                    onChangeText={(doctor_id) => this.setState({doctor_id})}
                                    style={{width: '100%', marginBottom: 15, marginLeft: 30}}
                                    underlineColorAndroid="transparent"
                                />
                                <TouchableHighlight onPress={this.sendPushNotification} underlayColor="transparent" style={{ backgroundColor: CONST.COLORS.THEME_COLOR, elevation: 2, borderRadius: 7 }}>
                                    <Text style={{ padding: 8, color: '#FFF', fontWeight: '400' }}>
                                        Send Push Notification
                                </Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
    inputItem: { 
        flexDirection: 'column',
        flex: .5, 
        marginRight: 13
    },
    inputItemFull: { 
        flexDirection: 'column',
        flex: 1, 
        marginRight: 13
    },
    inputItemTitle: { 
        color: '#AEAFB1',
        fontWeight: '400',
        marginBottom: 10
    },
    inputItemText: {
        borderColor: '#EEEEEE', 
        borderWidth: 2, 
        padding: 4, 
        fontSize: 12, 
        borderRadius: 5 
    },
    inputFieldsWrapper: {
        flexDirection: 'row', 
        marginTop: 30 
    },


})