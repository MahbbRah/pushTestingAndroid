import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'react-native-firebase';


const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
    android:
        'Double tap R on your keyboard to reload,\n' +
        'Shake or press menu button for dev menu',
});

export default class App extends Component {


    async componentDidMount() {
        let getToken = await AsyncStorage.getItem("pushToken");
        console.log(`Token: `, getToken)
        if (!getToken) {
            const fcmToken = await firebase.messaging().getToken();

            // console.log(`FCM Token Log: `, fcmToken);
            if (fcmToken) {
                await AsyncStorage.setItem("pushToken", fcmToken);

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

            this.createNotificationListeners();

        }

    }

    createNotificationListeners = async () => {
        /*
        * Triggered when a particular notification has been received in foreground
        * */
        // firebase.notifications().onNotification((notification) => {
        //     const { title, body } = notification;
        //     // this.showAlert(title, body);
        //     console.log(`Notification: `,notification);
        //     // alert("Notification pops up!")
        // });

        /*
        * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
        * */
        // firebase.notifications().onNotificationOpened((notificationOpen) => {
        //     const { title, body } = notificationOpen.notification;
        //     this.showAlert(title, body);
        // });

        /*
        * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
        * */
        // const notificationOpen = await firebase.notifications().getInitialNotification();
        // if (notificationOpen) {

        //     const { title, body } = notificationOpen.notification;
        //     this.showAlert(title, body);
        // }
        /*
        * Triggered for data only payload in foreground
        * */
        firebase.messaging().onMessage((message) => {
            //process data message
            console.log(JSON.stringify(message));
        });
        // firebase.messaging()
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>Welcome to React Native!</Text>
                <Text style={styles.instructions}>To get started, edit App.js</Text>
                <Text style={styles.instructions}>{instructions}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});


// import React, { Component } from 'react';
// import { StyleSheet, Text, View, NativeModules, Button } from 'react-native';

// export default class App extends Component {
//     constructor(props) {
//         super(props);
//         this.state = { isOn: false };
//         this.updateStatus();
//     }
//     turnOn = () => {
//         NativeModules.Bulb.turnOn();
//         this.updateStatus()
//     }
//     turnOff = () => {
//         NativeModules.Bulb.turnOff();
//         this.updateStatus()
//     }
//     updateStatus = () => {
//         NativeModules.Bulb.getStatus((error, isOn) => {
//             this.setState({ isOn: isOn });
//         })
//     }
//     render() {
//         return (
//             <View style={styles.container}>
//                 <Text style={styles.welcome}>Welcome to Light App!!</Text>
//                 <Text style={styles.welcome}>{NativeModules.Bulb.ShowMessage("Mahbub Rahman")}</Text>
//                 <Text> Bulb is {this.state.isOn ? "ON" : "OFF"}</Text>
//                 {!this.state.isOn ? <Button
//                     onPress={this.turnOn}
//                     title="Turn ON "
//                     color="#FF6347"
//                 /> :
//                     <Button
//                         onPress={this.turnOff}
//                         title="Turn OFF "
//                         color="#FF6347"
//                     />}
//             </View>
//         );
//     }
// }
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#F5FCFF',
//     },
// });