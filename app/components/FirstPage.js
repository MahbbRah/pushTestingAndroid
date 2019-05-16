import React from 'react';
import { View, TouchableHighlight, Text, StyleSheet, Image } from 'react-native';
import { PermissionsAndroid } from 'react-native';
import firebase from 'react-native-firebase';

import Entypo from 'react-native-vector-icons/Entypo';

import CONST from '../lib/constants';
import API from '../lib/api';
import splash_screen_img from '../assets/splash_screen_img.png';



export default class FirstPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // emailAddr: '',
            // password: '',
            userInfo: null,
            pushToken: ''
        }
        this.API = new API();

    }

    async componentDidMount() {

        const userInfo = await this.API._retrieveData('userInfo');
        const pushToken = await this.API._retrieveData('pushToken');
        console.log('Stored Token: ',pushToken);
        if (pushToken) {
            this.setState({
                pushToken
            })
        } else {
            const fcmToken = await firebase.messaging().getToken();

            console.log(`FCM Token Log: `, fcmToken);
            if (fcmToken) {
                await this.API._storeData("pushToken", fcmToken);

                const enabled = await firebase.messaging().hasPermission();
                if (enabled) {
                    // user has permissions
                } else {
                    try {
                        await firebase.messaging().requestPermission();
                        // User has authorised
                    } catch (errObj) {
                        // User has rejected permissions
                        console.log(`User has rejected permissions`, errObj)
                    }
                }
            }

        }
        
        if(userInfo !== null) {
            this.setState({ userInfo });
            this.props.navigation.navigate('Home');
        }

        // BackHandler.addEventListener('hardwareBackPress', () => {

        //     if (routeName === 'firstPage') {
        //         console.log('Back Button Pressed');

        //         // return true;
        //         // BackHandler.exitApp();
        //     }
        //     return true;

        // });


    }

    registerDeviceAndPush = async () => {

        const getPermission = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.CAMERA,
        ]);

        var ifPermissionDenied = true;
        for (var permission in getPermission) {
            if (getPermission[permission] != 'granted') {
                ifPermissionDenied = false;
            }
        }

        console.log(getPermission);
        return ifPermissionDenied;
    }


    goForRegistration = async() => {

        if (this.registerDeviceAndPush()) {

            this.props.navigation.navigate("LoginPage");
            // this.props.navigation.navigate("NotificationsView");
        } else {
            alert("You must need to enable this permission to continue");
        }
        // return false;

        
    }

    render() {
        

        return (
            <View style={{ flex: 1, flexDirection: 'column' }}>
                <View style={{
                    flex: .08,
                    backgroundColor: '#008FC1',
                    alignItems: 'center',
                }}>
                </View>
                <View style={{ flex: .92, backgroundColor: CONST.COLORS.THEME_COLOR}}>
                    <View style={{
                        flex: .60,
                        alignItems: 'center',
                        marginTop: 60,
                    }}>
                        <Image source={splash_screen_img} style={{}} />
                    </View>
                    <View style={{flex: .20, alignItems: 'center'}}>
                        <Text style={styles.txtStyleDoctor}>
                            Best online assistant app for Doctors
                        </Text>
                    </View>
                    <View style={{flex: .20}}> 
                        <TouchableHighlight style={styles.fbBtnWrapper} underlayColor="transparent" onPress={this.goForRegistration}>
                            <View style={styles.subBtnView}>
                                <Text style={{ color: '#355C95', marginTop: 5}}>SIGN UP WITH</Text>
                                <Entypo name="old-mobile" size={30} color='#355C95'/>
                            </View>
                        </TouchableHighlight>
                    </View>
                </View>
            </View>
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
        paddingLeft: 8,
        fontSize: 12, 
        borderRadius: 5 
    },
    inputFieldsWrapper: {
        flexDirection: 'row', 
        marginTop: 30 
    },

    fbBtnWrapper: { 
        backgroundColor: '#FFFFFF', 
        elevation: 4, 
        borderRadius: 30, 
        marginLeft: 50, 
        marginRight: 50 
    },
    subBtnView: { 
        flexDirection: 'row', 
        paddingTop: 6, 
        paddingBottom: 6, 
        paddingLeft: 25, 
        paddingRight: 10 ,
        alignSelf: 'center'
    },
    txtStyleDoctor: { 
        fontSize: 20, 
        fontWeight: 'bold', 
        color: '#FFF', 
        paddingLeft: 60, 
        paddingRight: 60, 
        textAlign: 'center' 
    },



})