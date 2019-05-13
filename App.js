import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'react-native-firebase';
import { createStackNavigator, createAppContainer } from "react-navigation";

import SecondPageApp from './SecondPageApp';



const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
    android:
        'Double tap R on your keyboard to reload,\n' +
        'Shake or press menu button for dev menu',
});

class App extends Component {


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
                <TouchableHighlight onPress={() => this.props.navigation.navigate("SecondScreen")}>
                    <Text>Go and ROck</Text>
                </TouchableHighlight>
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

const AppNavigator = createStackNavigator({
    Home: {
        screen: App
    },
    SecondScreen: {
        screen: SecondPageApp
    },
}, {
    initialRouteName: 'Home'
});

export default createAppContainer(AppNavigator);


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


