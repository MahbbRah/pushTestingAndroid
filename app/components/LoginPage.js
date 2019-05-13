import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import RNAccountKit from 'react-native-facebook-account-kit'
import Axios from 'axios';

import CONST from '../lib/constants';

export default class LoginPage extends Component {
    state = {
        authToken: null,
        loggedAccount: null
    };

    async onLogin(token) {
        // console.log('Token Code: ', token);
        var getDetails = await this.sendRequestForPhoneNumber(token.code);

        this.props.navigation.navigate('EditProfile', { currentState: 'FIRST_REGISTRATION', phone: getDetails.phone });
    }

    sendRequestForPhoneNumber = async (token) => {

        try {
            // The app ID, and (App secret from account kit)
            var access_token_data = ['AA', '921844898203331', '44fd21778a32c2975d13d2079eda80da']

            var access_token = access_token_data.join('|');

            var token_exchange_url = `https://graph.accountkit.com/v1.1/access_token?grant_type=authorization_code&code=${token}&access_token=${access_token}`;
            let getTokens = await Axios(token_exchange_url);
            let getDetailsUrl = `https://graph.accountkit.com/v1.1/me?access_token=${getTokens.data.access_token}`;

            let getDetailsUser = await Axios(getDetailsUrl);
            return getDetailsUser.data;
        } catch (error) {
            console.log('from the catch block: ', error);
        }
    }

    onLoginError(e) {
        console.log("Failed to login", e);
    }

    render() {

        RNAccountKit.configure({
            responseType: 'code',
            initialPhoneCountryPrefix: "+880",
        });

        RNAccountKit.loginWithPhone()
        .then((token) => {
            if (!token) {
                console.log('Login cancelled');
                this.onLoginError(token);
            } else {
                console.log(`Logged with phone. Token: ${token}`);
                this.onLogin(token);
            }
        })

        return null;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5FCFF"
    },
    button: {
        height: 50,
        width: 300,
        backgroundColor: CONST.COLORS.THEME_COLOR,
        marginBottom: 10
    },
    buttonText: {
        fontSize: 20,
        textAlign: "center",
        margin: 10,
        color: '#FFF'
    },
    label: {
        fontSize: 20,
        textAlign: "center",
        fontWeight: "bold",
        marginTop: 20
    },
    text: {
        fontSize: 20,
        textAlign: "center",
        margin: 10
    }
});

