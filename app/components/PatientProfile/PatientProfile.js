import React from 'react';
import { View, TouchableHighlight, Text, StyleSheet, Image } from 'react-native';
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

import CONST from '../../lib/constants';
import API from '../../lib/api';



let socket = null;
let container = null;
let pc = null;
const configuration = { "iceServers": [{ "url": "stun:stun.l.google.com:19302" }] };
let incomingOffer = null;
const signalingServer = 'http://da_webrtc.clientdemo.club';

let doctorId = null;
let patientId = null;
let iconMaximize = require('../../assets/icons/expand.png');
let iconMinimize = require('../../assets/icons/contract.png');

function sendMessage(event, message) {
    console.log('emitting socket event: ' + event + ', with payload: ', message);
    socket.emit(event, message);
}

function callPeer() {
    // InCallManager.start({ media: 'video', ringback: '_DTMF_' });
    container.setState({ outGoingCall: true });
    pc.createOffer().then(offerCreated).catch(function () {
        console.log('error: can\'t create offer')
    });
}
function startWebRTC() {

    pc = new RTCPeerConnection(configuration);

    pc.onicecandidate = event => {
        if (event.candidate) {
            console.log('webrtc event: on icecandidate');
            sendMessage('icecandidate', { 'candidate': event.candidate, 'sent_for': patientId });
        }
    };

    pc.ontrack = event => {
        console.log('webrtc event: ontrack');
    };

    pc.onaddstream = function (event) {
        console.log('webrtc event: onaddstream');

        //when callee answered, you MUST stop ringback explicitly:
        // InCallManager.stopRingback();

        container.setState({ remoteStream: event.stream.toURL() });
    };

    pc.oniceconnectionstatechange = function (event) {
        console.log('webrtc event: onconnectionstatechange, state: ' + pc.iceConnectionState);
        container.setState({ pcConnectionState: pc.iceConnectionState });
    };


    getUserMedia({
        audio: true,
        // video: false
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
        callPeer();
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
            sendMessage('offer', { 'sdp': pc.localDescription, 'sent_for': patientId, 'sent_by': doctorId })
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
            socket.emit('answer', { 'sdp': pc.localDescription, 'sent_for': patientId });
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
        if (parseInt(message.sent_for) === doctorId) {
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


    socket.on('answer', (message) => {
        if (parseInt(message.sent_for) === doctorId) {
            console.log('got answer');
            console.log('signaling state: ', pc.signalingState);
            container.setState({
                outGoingCall: false
            })
            pc.setRemoteDescription(new RTCSessionDescription(message.sdp), () => {
                console.log('set answer as remote desc');
            },
                (error) => {
                    console.log('error: cant set answer as remote desc', error);
                }
            );
        }
    });

    socket.on("closed_remote", (response) => {

        var parseResponse = JSON.parse(response);

        if (parseResponse.remoteID == doctorId) {

            pc.close();
            container.setState({
                remoteStream: null
            })
            startWebRTC();
            console.log(response)
        }
    });

    socket.on('command', async (message) => {
        console.log('socket event: ', message);
        if (parseInt(message.sent_for) === doctorId) {
            if (message.event === 'end_call') {
                await container.API._removeItem('prescriptionData');
                pc.close();
                container.setState({
                    remoteStream: null
                })
                container.props.navigation.navigate("SeePatient");
                alert("Call ended by patient");
            }
        }
    });
}

export default class SeePatient extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            patientInformation: {
                patientName: 'N/A', 
                registeredDate: new Date(),
                age: '30',
                gender: 'Male',
                patientID: '303094',
                appointment_type: '',
                profilePicUri: null,
            },
            currentProfilePic: require('../../assets/man.png'),
            isprofileLoadingError: false,
        }
        this.API = new API();
    }

    async componentDidMount() {

        let getNextPatientUrl = CONST.BASE_URL + CONST.APIS.GET_NEXT_PATIENT;

        // If we are testing the app without calling, use a dummy patient instead of fetching from server
        // let getNextPatient = {
        //     message: "successfully retrieved next patient",
        //     response: [
        //         {
        //             id: 47,
        //             patient_id: "XL2JWO",
        //             patient_mobile: "+8801755345949",
        //             patient_name: "Mahbub Rahman",
        //             profile_meta: '{"image_uri":"profile_XL2JWO.jpg","balance":0,"pushToken":"NO_PUSH_TOKEN_FOUND","age":"22","gender":"Male"}',
        //             queue_status: "active",
        //             queue_type: "special",
        //             timestamp: "2019-02-06T09:22:41.000Z"
        //         }
        //     ],
        //     status: "success"
        // };

        // if testing app with calling, uncomment this line & comment previous line
        let getNextPatient = await this.API.GET(getNextPatientUrl);

        let userInfo = await this.API._retrieveData('userInfo');

        let parsedDoctorInfo = JSON.parse(userInfo);

        /* Modifiying here a little bit to see if there is no patient then add a dummy one instead. */
        if (getNextPatient.status === 'success') {

            let patient;
            if (getNextPatient.response.length > 0) {

                patient = getNextPatient.response[0];
            } else {
                patient = {
                    id: 47,
                    patient_id: "XL2JWO",
                    patient_mobile: "+8801755345949",
                    patient_name: "Mahbub Rahman",
                    profile_meta: '{"image_uri":"profile_XL2JWO.jpg","balance":0,"pushToken":"NO_PUSH_TOKEN_FOUND","age":"22","gender":"Male"}',
                    queue_status: "active",
                    queue_type: "special",
                    timestamp: "2019-02-06T09:22:41.000Z"
                };
            }

             
            let patientInformation = {};

            let profileMeta = JSON.parse(patient.profile_meta);
            patientInformation.patientName = patient.patient_name;
            patientInformation.registeredDate = new Date(patient.timestamp);
            patientInformation.patientID = patient.patient_id;
            patientInformation.gender = profileMeta.gender ? profileMeta.gender : 'N/A';
            patientInformation.age = profileMeta.age ? profileMeta.age : 'N/A';
            patientInformation.appointment_type = patient.appointment_type;
            patientInformation.profilePicUri = profileMeta.image_uri;
            this.setState({
                patientInformation
            });

            /* Initiate call */

            container = this;
            const { navigation } = this.props;
            doctorId = parseInt(parsedDoctorInfo.doctor_id);
            patientId = parseInt(patient.patient_id);
            socket = io(signalingServer, { query: "clientId=" + doctorId });
        } else {

            // if(getNextPatient.length > 0) {
                alert("No Patient currently in the queue!");
                this.props.navigation.navigate("SeePatient");
            // }
        }
    }

    prescribingStart = async() => {

        await this.API._storeData('patientInfo', JSON.stringify(this.state.patientInformation));

        let userInfo = await this.API._retrieveData('userInfo');
        userInfo = JSON.parse(userInfo);

        let uriToUpdatePatientQueue = CONST.BASE_URL + CONST.APIS.UPDATE_PATIENT_QUEUUE;

        let payload =  {
            doctor_id: userInfo.doctor_id,
            patient_id: this.state.patientInformation.patientID,
            appointment_type: 'general', // later on update this with right appointmnet type
            queue_status: 'active',
        }

        this.props.navigation.navigate('ConsultingNow', { doctorId: userInfo.doctor_id, patientId: this.state.patientInformation.patientID });

        // let doQueueUpdatingProcess =  await this.API.POST(uriToUpdatePatientQueue, payload);

        // if(doQueueUpdatingProcess.status === 'success') {

        //     this.props.navigation.navigate('ConsultingNow', {doctorId: userInfo.doctor_id, patientId: this.state.patientInformation.patientID});
        // } else {
        //     alert(doQueueUpdatingProcess.message);
        // }

    }

    render() {

        
        const {patientName, registeredDate, age, gender, patientID, profilePicUri } = this.state.patientInformation;

        //check if there is profile picture uri then fetch. then if image not there load a dummy image fron onError Func of Image.
        let profilePicImg = !profilePicUri ? require('../../assets/man.png') : { uri: CONST.PROFILE_PIC_BASE + profilePicUri };
        profilePicImg = this.state.isprofileLoadingError ? this.state.currentProfilePic : profilePicImg;

        return (
            <View style={{ flex: 1, backgroundColor: CONST.COLORS.THEME_COLOR, flexDirection: 'column', }}>
                <View
                    style={{
                        backgroundColor: "#FFFFFF",
                        borderTopLeftRadius: 9,
                        borderTopRightRadius: 9,
                        marginLeft: 20,
                        marginRight: 20,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 35
                    }}
                >
                    <Image 
                        source={profilePicImg}
                        style={{height: 50, width: 50, marginBottom: 15, marginTop: 40}}
                        onError={() => this.setState({ isprofileLoadingError: true})}
                    />
                    <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 3, color: '#28292C' }}>{patientName.replace("|", " ")}</Text>
                    <Text style={{ fontWeight: '200', color: '#7C8389', marginBottom: 20, fontSize: 9 }}>Member since: {registeredDate.toDateString()}</Text>
                    <View
                        style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40, marginTop: 30 }}
                    >
                        <View style={styles.ProfileInfoItem}>
                            <Text style={styles.ProfileInfoItemTop}>{age}</Text>
                            <Text style={styles.ProfileInfoItemBottom}>Age</Text>
                        </View>
                        <View style={[styles.ProfileInfoItem, { marginRight: 25 }]}>
                            <Text style={styles.ProfileInfoItemTop}>{gender}</Text>
                            <Text style={styles.ProfileInfoItemBottom}>Gender</Text>
                        </View>
                        <View style={styles.ProfileInfoItem}>
                            <Text style={styles.ProfileInfoItemTop}>{patientID}</Text>
                            <Text style={styles.ProfileInfoItemBottom}>ID</Text>
                        </View>
                    </View>
                </View>
                <View style={{
                    backgroundColor: "#F7F8F9",
                    marginLeft: 20,
                    marginRight: 20,
                    paddingTop: 30,
                    borderBottomLeftRadius: 9,
                    borderBottomRightRadius: 9,
                    paddingBottom: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <View>
                        <TouchableHighlight onPress={() => this.prescribingStart()} underlayColor="transparent">
                            <Text style={{
                                color: '#FFF',
                                backgroundColor: "#00B9FC",
                                paddingTop: 8,
                                paddingBottom: 8,
                                paddingRight: 80,
                                paddingLeft: 80,
                                borderRadius: 25
                            }}>Start Prescribing</Text>
                        </TouchableHighlight>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        marginTop: 15,
                        justifyContent: 'space-between'
                    }}>
                        <TouchableHighlight style={{ flex: .5, marginLeft: '9%'}}>
                            <Text style={styles.doctorCallBtn}>Call Operator</Text>
                        </TouchableHighlight>
                        <TouchableHighlight style={{ flex: .5, marginLeft: '3%', marginRight: '8%'}}>
                            <Text style={[styles.doctorCallBtn, ]}>Call Assistant</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    ProfileInfoItem: {
        marginLeft: 12,
        flex: 1/3,
        justifyContent: 'center',
        alignItems: 'center'
    },
    ProfileInfoItemTop: {
        color: '#000',
        fontSize: 12,
        marginBottom: -3,
    },
    ProfileInfoItemBottom: {
        marginTop: 0,
        color: '#7C8389',
        fontSize: 12,
    },
    doctorCallBtn: {
        color: '#7C8389',
        textAlign: 'center',
        backgroundColor: "#FFF",
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 12,
        paddingRight: 12,
        borderRadius: 17,
        borderWidth: 1,
        borderColor: '#ddd',
        fontSize: 11
    }
})