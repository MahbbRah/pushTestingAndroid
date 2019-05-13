import React from 'react';
import { StyleSheet, Text, TouchableHighlight, View, Dimensions, Image } from 'react-native';
import InCallManager from 'react-native-incall-manager';
import io from 'socket.io-client';
import {
    RTCPeerConnection,
    RTCIceCandidate,
    RTCSessionDescription,
    RTCView,
    MediaStream,
    MediaStreamTrack,
    getUserMedia,
} from 'react-native-webrtc';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import CONST from '../lib/constants';

const { height, width } = Dimensions.get('window');

let socket = null;
let container = null;
let pc = null;
const configuration = { "iceServers": [{ "url": "stun:stun.l.google.com:19302" }] };
let incomingOffer = null;
let userId = null;
let calleeId = null;
const signalingServer = 'http://da_webrtc.clientdemo.club';


function sendMessage(event, message) {
    console.log('emitting socket event: ' + event);
    socket.emit(event, message);
}

function startWebRTC() {

    pc = new RTCPeerConnection(configuration);

    pc.onicecandidate = event => {
        if (event.candidate) {
            console.log('webrtc event: on icecandidate');
            sendMessage('icecandidate', { 'candidate': event.candidate, 'sent_for': calleeId });
        }
    };

    pc.ontrack = event => {
        console.log('webrtc event: ontrack');
    };

    pc.onaddstream = function (event) {
        console.log('webrtc event: onaddstream');

        //when callee answered, you MUST stop ringback explicitly:
        InCallManager.stopRingback();

        container.setState({ remoteStream: event.stream.toURL() });
    };

    pc.onconnectionstatechange = function (event) {
        console.log('webrtc event: onconnectionstatechange, state: ' + pc.connectionState);
        container.setState({ pcConnectionState: pc.connectionState });
    };


    getUserMedia({
        audio: true,
        video: {
            mandatory: {
                minWidth: width,
                minHeight: height,
                minFrameRate: 40
            },
            facingMode: "user"
        }
    }, function (stream) {
        console.log('got local stream');
        container.setState({
            myStream: stream.toURL()
        });
        pc.addStream(stream);
    }, function (stream) {
        console.error('error: getting local stream', stream);
    });

}

function offerCreated(offer) {
    console.log('success: created offer');
    pc.setLocalDescription(
        offer,
        () => {
            console.log('success: set offer as local desc');
            sendMessage('offer', { 'sdp': pc.localDescription, 'sent_for': calleeId })
        },
        () => {
            console.log('error: failed to set offer as locla desc');
        }
    );
}

function answerCreated(answer) {
    console.log('created answer');
    pc.setLocalDescription(
        answer,
        () => {
            console.log('set answer as local desc');
            socket.emit('answer', { 'sdp': pc.localDescription, 'sent_for': calleeId });
        },
        () => {
            console.log('error: cant set answer as local desc');
        },
    );
}

function initSocketListeners() {

    socket.on('connected', function (data) {
        console.log('connected to socket', data);
    });


    socket.on('icecandidate', (message) => {
        if (message.sent_for === userId) {
            console.log('got socket event: ice candidtate');
            pc.addIceCandidate(
                new RTCIceCandidate(message.candidate)
            )
                .then(() => {
                    console.log('success: add ice candidate');
                })
                .catch(error => {
                    console.log('error: add ice candidate', error);
                });
        }

    });

    socket.on('offer', (data) => {
        if (data.sent_for === userId) {
            console.log('got offer');
            InCallManager.startRingtone('_BUNDLE_');
            container.setState({ incomingCall: true });
            incomingOffer = data;
        }
    });

    socket.on('answer', (message) => {
        if (message.sent_for === userId) {
            console.log('got answer');
            container.setState({
                outGoingCall: false
            })
            pc.setRemoteDescription(new RTCSessionDescription(message.sdp), () => {
                console.log('set answer as remote desc');
            },
                () => {
                    console.log('error: cant set answer as remote desc');
                }
            );
        }
    });

    socket.on("closed_remote", (response) => {

        var parseResponse = JSON.parse(response);

        if(parseResponse.remoteID == userId) {

            pc.close();
            container.setState({
                remoteStream: null
            })
            startWebRTC();
            console.log(response)
        }
    });

}

export default class VideoCall extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            myStream: null,
            remoteStream: null,
            incomingCall: false,
            pcConnectionState: '',
            isSpeakerInLoud: true,
            outGoingCall: false,
        };
        

    }

    async componentDidMount() {
        container = this;
        userId = 22; // TODO hardcoded
        calleeId = 11; // TODO hardcoded
        socket = io(signalingServer, { query: "clientId=" + userId });

        initSocketListeners();
        startWebRTC();

        // Initially setting speaker to force loud mode
        InCallManager.setForceSpeakerphoneOn(this.state.isSpeakerInLoud);
        
    }

    callPeer() {

        InCallManager.start({ media: 'video', ringback: '_DTMF_' });
        container.setState({ outGoingCall: true });
        pc.createOffer().then(offerCreated).catch(function () {
            console.log('error: can\'t create offer')
        });
    }

    answerIncomingCall() {
        console.log('answered incoming call');
        container.setState({ incomingCall: false });
        InCallManager.stopRingtone();
        InCallManager.start();
        if (incomingOffer !== null && incomingOffer.sdp) {
            pc.setRemoteDescription(new RTCSessionDescription(incomingOffer.sdp), () => {
                console.log('set offer as remote desc');
                if (pc.remoteDescription.type === 'offer') {
                    pc.createAnswer().then(answerCreated).catch(function () {
                        console.log('error: create answer');
                    });
                }
            }, function () {
                console.log('error: set offer as remote desc');
            });
        }
    }

    hangUpCall = () => {

        
        console.log("About to hang up the call by call end button press");
        pc.close();

        //send this event when hang up the call to remote!
        var closedRemoteInfos = {
            remoteID: 11,
            status: 'closed',
            message: "Dummpy Message!"
        }
        sendMessage("closed_remote", JSON.stringify(closedRemoteInfos));
        this.setState({
            remoteStream: null
        })
        startWebRTC();
        
    }

    rejectCall = () => {

        pc.close();

        InCallManager.stop();
        InCallManager.stopRingtone();

        //TODO: Maybe need to create a new socket event for rjeect call. Right now the event using is for hangup!
        var closedRemoteInfos = {
            remoteID: 11,
            status: 'closed',
            message: "Dummpy Message!"
        }
        sendMessage("closed_remote", JSON.stringify(closedRemoteInfos));
        this.setState({
            remoteStream: null
        })
        startWebRTC();
        
    }

    // Disable Video for Remote
    // disableRemoeVideo = ()

    /* Set Microphone Speaker On or Off */
    setMicrophoneSpeakerOnOrOff = () => {

        console.log("speaker Status: ", this.state.isSpeakerInLoud);
        var checkAndGenerateSpeakerMode = this.state.isSpeakerInLoud ? false : true;
        InCallManager.setForceSpeakerphoneOn(checkAndGenerateSpeakerMode);
        this.setState({ isSpeakerInLoud: checkAndGenerateSpeakerMode});

    }

    _renderIncomingCallView() {
        if (this.state.incomingCall) {
            return (
                <View>
                    <Text>Someone is calling....</Text>
                    <TouchableHighlight onPress={this.answerIncomingCall} underlayColor="transparent" style={{ backgroundColor: 'blue', elevation: 2, borderRadius: 7 }}>
                        <Text style={{ padding: 8, color: '#FFF', fontWeight: '400' }}>
                            Answer
                        </Text>
                    </TouchableHighlight>
                </View>
            );
        } else {
            return null;
        }
    }

    renderInCall = () => {

        return (
            <View style={{ marginTop: -40, backgroundColor: CONST.COLORS.THEME_COLOR, flex: 1 }}>
                <RTCView streamURL={this.state.remoteStream} style={styles.selfView} />

                <View style={{ position: 'absolute', right: 10, top: 60 }}>
                    <View style={{ height: 70, width: 70, backgroundColor: CONST.COLORS.THEME_COLOR, marginBottom: 30 }}>
                        <RTCView streamURL={this.state.myStream} style={[styles.remoteView]} />
                    </View>
                </View>

                <View style={{
                    flexDirection: 'row',
                    marginLeft: '5%',
                    marginRight: '5%',
                    marginTop: '2%'
                }}>
                    <TouchableHighlight style={[styles.bottomActionBtn, { backgroundColor: this.state.isSpeakerInLoud ? 'rgba(30, 32, 37, 0.5)' : 'rgba(56, 97, 199, 0.9)' }]} onPress={this.setMicrophoneSpeakerOnOrOff}>
                        <Entypo name="sound-mute" size={23} color='#FFF' marginLeft={2} />
                    </TouchableHighlight>
                    {/* <TouchableHighlight style={styles.bottomActionBtn}>
                        <MaterialCommunityIcons name="camera-switch" size={23} color='#FFF' marginLeft={2} />
                    </TouchableHighlight> */}
                    <TouchableHighlight style={styles.bottomActionBtn}>
                        <MaterialCommunityIcons name="video-off" size={23} color='#FFF' marginLeft={2} />
                    </TouchableHighlight>
                    <TouchableHighlight style={[styles.bottomActionBtn, { backgroundColor: 'red' }]} onPress={this.hangUpCall}>
                        <MaterialIcons name="call-end" size={23} color='#FFF' marginLeft={2} />
                    </TouchableHighlight>

                </View>

            </View>
        )
    }

    renderIncomingCallScreen = () => {

        return (
            <View style={{ flex: 1, backgroundColor: CONST.COLORS.THEME_COLOR, flexDirection: 'column' }}>
                <View style={{ flex: .25 }}></View>

                <View style={{ flex: .5, flexDirection: 'column', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'column', }}>
                        {this.state.incomingCall && (
                            <View>
                                <Text style={{ fontSize: 25, color: '#FFF', textAlign: 'center' }}>New Incoming call..</Text>

                                <View style={{ marginLeft: 25, marginTop: 20 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <TouchableHighlight style={styles.actionBtnReject} underlayColor="#A3212E" onPress={this.rejectCall}>
                                            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Hangup</Text>
                                        </TouchableHighlight>
                                        <TouchableHighlight style={styles.actionBtnAccept} underlayColor="#2DB2BC" onPress={this.answerIncomingCall}>
                                            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Accept</Text>
                                        </TouchableHighlight>
                                    </View>
                                </View>
                            </View>
                        )}

                        {(!this.state.incomingCall && !this.state.outGoingCall) && (
                            <TouchableHighlight style={styles.actionBtnAccept} underlayColor="#2DB2BC" onPress={this.callPeer}>
                                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Make New Call</Text>
                            </TouchableHighlight>
                        )}

                        {this.state.outGoingCall && (
                            <View>
                                <Text style={{ fontSize: 25, color: '#FFF', textAlign: 'center' }}>Calling...</Text>

                                <View style={{ marginLeft: 25, marginTop: 20 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <TouchableHighlight style={styles.actionBtnReject} underlayColor="#A3212E" onPress={this.rejectCall}>
                                            <Text style={{ color: '#fff', fontWeight: 'bold' }}>End Call</Text>
                                        </TouchableHighlight>
                                    </View>
                                </View>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        );
    }

    render() {

        return this.state.remoteStream ? this.renderInCall() : this.renderIncomingCallScreen()
    }
}

const styles = StyleSheet.create({
    selfView: {
        width: width,
        height: height / 1.1,
    },
    remoteView: {
        width: 50,
        height: 50,
        marginTop: 20
    },
    bottomActionBtn: {
        marginLeft: '15%',
        backgroundColor: 'rgba(30, 32, 37, 0.5)',
        padding: 10,
        borderRadius: 50,
        height: 45,
        width: 45
    },
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
});