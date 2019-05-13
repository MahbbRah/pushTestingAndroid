import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TouchableHighlight } from 'react-native';
import { widthPercentageToDP as percentageWidth, heightPercentageToDP as percentageHeight } from 'react-native-responsive-screen';

// import PushNotification from 'react-native-push-notification';


import CONST from '../lib/constants';
import API from '../lib/api';

const imgCommonHeight = percentageHeight('10.8%');
const imgCommonWidth = percentageWidth('17.8%');

export default class Home extends React.Component{

    constructor(props) {
        super(props);
        this.state = { userProfile: null, pushToken: ''};
        this.API = new API();
        this.backBtnPressCounter = 0;

        this.initRegInfo = () => {

            let regInfo;
            try {
                regInfo = this.props.navigation.state.params.initRegInfo;
            } catch (error) {
                regInfo = false;
            }
            return regInfo;
        }
    }

    async componentDidMount() {

        let userInfo = await this.API._retrieveData('userInfo');

        const pushToken = await this.API._retrieveData('pushToken');

        if (pushToken !== '') {
            this.setState({
                pushToken
            })
        }

        //Testing Loggging informations
        // console.log('doctorInformations: ',userInfo, pushToken);

        // await this.API._removeItem('userInfo');
        if (userInfo !== null) {

            let parsedUserInfo = JSON.parse(userInfo);

            let fullName = parsedUserInfo.fullName;

            let profile = {
                fullName,
                emailAddr: parsedUserInfo.emailAddress,
                phoneNumber: parsedUserInfo.doctor_mobile,
                doctorTitle: parsedUserInfo.doctor_title,
                profilePic: `data:image/png;base64,${parsedUserInfo.profilePic}`,
                doctor_id: parsedUserInfo.doctor_id,
                balance: parsedUserInfo.balance
            };
            this.setState({userProfile: {...profile}});

        } else {
            this.props.navigation.navigate('FirstPage');
        }

        // this.EnablePushToken();

    }

    componentWillReceiveProps() {

        console.log(`Check to see if back button Pressed: `);
    }

    // EnablePushToken = () => {
    //     var newThis = this;

    //     if (this.state.pushToken !== '') {

    //         PushNotification.configure({

    //             // (optional) Called when Token is generated (iOS and Android)
    //             onRegister: async (token) =>  {
    //                 // console.log('TOKEN:', token);
    //                 await newThis.API._storeData('pushToken', token.token);
    //             },

    //             // (required) Called when a remote or local notification is opened or received
    //             onNotification: (notification) => {
    //                 console.log('NOTIFICATION:', notification);

    //                 if (notification.pushType === 'appointment_queue') {
    //                     newThis.props.navigation.navigate("AcceptPatientRequestPush")
    //                 }
                    

    //             },

    //             senderID: CONST.DATA.SENDER_ID,

    //             // IOS ONLY (optional): default: all - Permissions to register.
    //             permissions: {
    //                 alert: true,
    //                 badge: true,
    //                 sound: true
    //             },

    //             // Should the initial notification be popped automatically
    //             // default: true
    //             popInitialNotification: true,

    //         });
    //     }


    // }

    // _handleNotification = async(notifications) => {

    //     // alert(JSON.stringify(notifications.data));

    //     let getOnlineStatus = await this.API._retrieveData("is_online");

    //     console.log(getOnlineStatus)
    //     if (getOnlineStatus && getOnlineStatus === 'yes') {
            
    //         this.props.navigation.navigate("AcceptPatientRequestPush", { data: notifications.data});
    //     }
    // }
    

    // exitAppOnbackButtonPressed = () => {
    //     console.log('On home Route Back Button Pressed', this.backBtnPressCounter)
    //     this.backBtnPressCounter += 1;
    //     if (this.backBtnPressCounter === 2) {
    //         BackHandler.exitApp();
    //         this.backBtnPressCounter = 0;
    //     } else {
    //         return true;
    //     }

    // }

    render() {

        let userData = this.initRegInfo() ? this.initRegInfo() : this.state.userProfile;

        let fullName, doctor_title, profilePic, userBalance;

        if(this.state.userProfile !== null){
            fullName = userData.fullName.replace("|", " ");
            doctor_title =  userData.doctorTitle;
            profilePic = userData.profilePic;
            userBalance = userData.balance;
        }
        if (this.initRegInfo()) {

            fullName = userData.fullName.replace("|", " ");
            doctor_title = userData.doctor_title;
            profilePic = `data:image/png;base64,${userData.profilePic}`;
            userBalance =  userData.balance;
        }

        return (
          <View style={styles.container}>
            <View style={styles.header}>
                    <View style={styles.flexOne}>
                        <Image source={profilePic ? { uri: profilePic } : require('../assets/doctor_icon.png')} style={styles.avatar} />
                    </View>
                    <View style={styles.centerCol}>
                        <Text style={styles.name}>{`${fullName ? fullName : 'N/A'}`}</Text>
                        <Text style={styles.specialty}>{doctor_title ? doctor_title : 'N/A'}</Text>
                        <TouchableOpacity style={styles.eyeTouchable}>
                            <View style={styles.eyeWrapper}>
                                <Text style={styles.name}>{userBalance}৳</Text>
                                <Image style={styles.eye} source={require('../assets/view.png')} />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.flexOne}>
                        <TouchableOpacity style={styles.floatRight} underlayColor={CONST.COLORS.UNDERLAY_COLOR} onPress={() => this.props.navigation.navigate('NotificationsView')}>
                            <Image style={styles.notification} source={require('../assets/notification.png')} />
                        </TouchableOpacity>
                    </View>
            </View>
            <View style={styles.content}>
                <TouchableHighlight style={styles.buttonTop} onPress={() => this.props.navigation.navigate('SeePatient')} underlayColor={CONST.COLORS.UNDERLAY_COLOR}>
                    <View style={styles.buttonTopWrapper}>
                        <Image style={styles.buttonTopIcon} source={require('../assets/stethoscope.png')} />
                        <Text style={styles.buttonTopText}>See Patient</Text>
                    </View>
                </TouchableHighlight>
                <View style={{flex: 5}}>
                    <View style={styles.buttonRow}>
                        <TouchableHighlight style={styles.buttonLeft} onPress={() => this.props.navigation.navigate('DrugDatabase')} underlayColor={CONST.COLORS.UNDERLAY_COLOR}>
                            <View>
                                <Image style={styles.menuButtonIcon} source={require('../assets/drugs.png')} />
                                <Text style={styles.menuButtonText}>Drug Database</Text>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight style={styles.buttonRight} underlayColor={CONST.COLORS.UNDERLAY_COLOR}>
                            <View>
                                <Image style={styles.menuButtonIcon} source={require('../assets/forum.png')} />
                                <Text style={styles.menuButtonText}>Forum</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                    <View style={styles.buttonRow}>
                            <TouchableHighlight style={styles.buttonLeft} underlayColor={CONST.COLORS.UNDERLAY_COLOR} onPress={() => this.props.navigation.navigate('Appointment')}>
                            {/* <TouchableHighlight style={styles.buttonLeft} underlayColor={CONST.COLORS.UNDERLAY_COLOR} onPress={() => null}> */}
                            <View>
                                <Image style={styles.menuButtonIcon} source={require('../assets/appointment.png')} />
                                <Text style={styles.menuButtonText}>Appointment</Text>
                            </View>
                        </TouchableHighlight>
                            <TouchableHighlight style={styles.buttonRight} underlayColor={CONST.COLORS.UNDERLAY_COLOR} onPress={() => 
                                this.props.navigation.navigate('SearchPatientRecord', { doctor_id: userData.doctor_id})}>
                            <View>
                                <Image style={styles.menuButtonIcon} source={require('../assets/folder.png')} />
                                <Text style={styles.menuButtonText}>Patient's Record</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                    <View style={styles.buttonRow}>
                            <TouchableHighlight style={styles.buttonLeft} onPress={() => this.props.navigation.navigate('MyProfile', { userProfile: userData})} underlayColor={CONST.COLORS.UNDERLAY_COLOR}>
                            <View>
                                <Image style={styles.menuButtonIcon} source={require('../assets/man.png')} />
                                <Text style={styles.menuButtonText}>My Profile</Text>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight style={styles.buttonRight} underlayColor={CONST.COLORS.UNDERLAY_COLOR}>
                            <View>
                                <Image style={styles.menuButtonIcon} source={require('../assets/settings.png')} />
                                <Text style={styles.menuButtonText}>Settings</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                </View>
            </View>
          </View>
        );
      }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        backgroundColor: CONST.COLORS.THEME_COLOR,
        flexDirection: 'row',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 15,
        paddingRight: 15
    },
    avatar: {
        height: 40,
        width: 40,
        borderRadius: 5
    },
    content: {
        flex: 1,
        backgroundColor: '#f7f8f9',
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 10,
        paddingBottom: 10
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: CONST.COLORS.WHITE
    },
    specialty: {
        fontSize: 16,
        color: CONST.COLORS.WHITE
    },
    notification: {
        marginTop: 5,
        height: 24,
        width: 24
    },
    flexOne: {
        flex: 1
    },
    centerCol: {
        flex: 5,
        paddingLeft: 10
    },
    eyeTouchable: {
        borderColor: CONST.COLORS.WHITE,
        borderRadius: 15,
        borderWidth: 1,
        marginTop: 5,
        width: 100
    },
    eyeWrapper: {
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 10,
        paddingRight: 10,
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    eye: {
        width: 18,
        height: 18,
        alignSelf: 'flex-end'
    },
    floatRight: {
        alignSelf: 'flex-end'
    },
    buttonRow: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 10
    },
    buttonTop: {
        flex: 1,
        borderRadius: 10,
        justifyContent: 'center',
        elevation: 4,
        position: 'relative',
        backgroundColor: CONST.COLORS.WHITE
    },
    buttonTopWrapper: {
        flexDirection: 'row'
    },
    buttonTopText: {
        paddingLeft: 25,
        fontSize: 20,
        color: CONST.COLORS.FONT_BLACK,
        alignSelf: 'center'
    },
    buttonTopIcon: {
        marginLeft: 25,
        width: imgCommonWidth,
        height: imgCommonHeight,
    },
    buttonLeft: {
        flex: 1,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 5,
        elevation: 4,
        position: 'relative',
        backgroundColor: CONST.COLORS.WHITE
    },
    buttonRight: {
        flex: 1,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 5,
        elevation: 4,
        position: 'relative',
        backgroundColor: CONST.COLORS.WHITE
    },
    menuButtonText: {
        paddingTop: 15,
        textAlign: 'center'
    },
    menuButtonIcon: {
        alignSelf: 'center',
        height: imgCommonHeight,
        width: imgCommonWidth
    }
});
