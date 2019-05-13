import React from 'react';
import { View, TouchableHighlight, Text, StyleSheet, Image } from 'react-native';

import CONST from '../../lib/constants';
import API from '../../lib/api';

import io from "socket.io-client";
import {RTCIceCandidate, RTCSessionDescription} from "react-native-webrtc";
import InCallManager from "react-native-incall-manager";

let socket = null;
const signalingServer = 'http://da_webrtc.clientdemo.club';

export default class SocketManager {

    connectSocket(userId){
        socket = io(signalingServer, {query: "clientId=" + userId});
    }

    getInstance(){
        if (socket === null) {
            socket = io(signalingServer, {query: "clientId=" + userId});
        }
        return socket;
    }
}