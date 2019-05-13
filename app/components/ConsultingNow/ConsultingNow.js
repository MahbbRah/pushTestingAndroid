import React from 'react';
import { View, TouchableHighlight, Text, StyleSheet, Image, ScrollView, Alert, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


import ChiefComplain from './Modals/ChiefComplain';
import DiagonsisModal from './Modals/DiagonsisModal';
import VideoChatModal from './Modals/VideoChatModal';
import ReferDoctorModal from './Modals/ReferDoctorModal';
import MedicalHistoryModal from './Modals/MedicalHistoryModal';
import RXHistoryModal from './Modals/RXHistoryModal';
import InvestigationModal from './Modals/InvestigationModal';
import PresExistingIllnessModal from './Modals/PreExistingIllnessModal';
import ClinicalExaminationModal from './Modals/ClinicalExaminationModal';
import AdviceModal from './Modals/AdviceModal';

//TODO: work on setting the apointment date.
import SetAppointmentDate from './Modals/SetAppointmentDate';

import CONST from '../../lib/constants';
import API from '../../lib/api';

const { height, width } = Dimensions.get('window');
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
import Entypo from 'react-native-vector-icons/Entypo';

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
            sendMessage('offer', { 'sdp': pc.localDescription, 'sent_for': patientId, 'sent_by': doctorId})
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

        if(parseResponse.remoteID == doctorId) {

            pc.close();
            container.setState({
                remoteStream: null
            })
            startWebRTC();
            console.log(response)
        }
    });

    socket.on('command', async (message) =>  {
        console.log('socket event: ', message);
        if(parseInt(message.sent_for) === doctorId){
            if(message.event === 'end_call'){
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
            chiefComplainModal: false,
            cheifComplains: [],
            DiagonsisModal: false,
            diagonsisItems: [],
            openVideoModal: false,
            referDoctorModal: false,
            medicalHistoryModal: false,
            medicalHistories: [],
            rxHistoryModal: false,
            rxHistories: [],
            investigationModal: false,
            investigations: [],
            preExistingModal: false,
            preExistingIllnesses: [],
            clinicalExaminationModal: false,
            clinicalExamination: [],
            adviceModal: false,
            advices: [],
            nextAppointmentDate: new Date(),
            referredDoctors: [],
            appointmentDateString: '',
            nextAppointmentState: false,

            myStream: null,
            remoteStream: null,
            incomingCall: false,
            pcConnectionState: '',
            isSpeakerInLoud: true,
            outGoingCall: false,
            isVideoEnabled: false,
            isVideoFullscreen: false,
            patientInformations: null,
            videoExpandIcon: null
        };
        this.API = new API();

    }

    //this event hooked up when state changes, so by using this event we can store our updates for prescription on localstorage
    async componentWillUpdate(nextProps, nextState) {
        
        delete nextState.webrtc;
        // console.log("nextState: ", nextState);

        if (nextState) {
            let prescriptionData = JSON.stringify(nextState);
            this.API._storeData('prescriptionData', prescriptionData);
        }
        

    }

    async componentDidMount() {

        await this.API._removeItem('prescriptionData');

        //check if there is old prescription data. if then update the whole state
        let oldPresData = await this.API._retrieveData('prescriptionData');

        if(oldPresData !== null) {
            let parsedData = JSON.parse(oldPresData);

            // now populate old datas to state. and it will automtically do the rest :)
            this.setState({
                cheifComplains: parsedData.cheifComplains,
                diagonsisItems: parsedData.diagonsisItems,
                medicalHistories: parsedData.medicalHistories,
                rxHistories: parsedData.rxHistories,
                investigations: parsedData.investigations,
                preExistingIllnesses: parsedData.preExistingIllnesses,
                clinicalExamination: parsedData.clinicalExamination,
                advices: parsedData.advices,
                referredDoctors: parsedData.referredDoctors,
                nextAppointmentDate: new Date(parsedData.nextAppointmentDate),
            });

            //If there is no Medical or preExisting History then populate from user patient saved one
            if(parsedData.medicalHistories.length === 0 && parsedData.preExistingIllnesses.length === 0) {
                await this.retreivePatientOtherHistory();
            }
        }

        container = this;
        const { navigation } = this.props;
        doctorId = parseInt(navigation.getParam('doctorId'));
        patientId = parseInt(navigation.getParam('patientId'));
        socket = io(signalingServer, { query: "clientId=" + doctorId });

        /*initSocketListeners();
        startWebRTC();*/

        // Initially setting speaker to force loud mode
        // InCallManager.setForceSpeakerphoneOn(this.state.isSpeakerInLoud);
    }

    async componentWillMount() {

        let patientInformations = await this.API._retrieveData('patientInfo');
        if (patientInformations) {

            // patient Object with { patientID, patientName }
            this.setState({
                patientInformations: JSON.parse(patientInformations)
            })
        }
    }

    retreivePatientOtherHistory = async () => {

        const uri = CONST.BASE_URL + CONST.APIS.GET_PATIENT_OTHER_HISTORY;
        const payload = {
            patient_id: this.state.patientInformations.patientID
        };

        const getHistories = await this.API.POST(uri, payload);

        if (getHistories.status === 'success') {
            let histories = JSON.parse(getHistories.response.patient_histories);
            // console.log(`History from func: `, histories)
            this.setState({
                medicalHistories: histories.medicalHistories,
                preExistingIllnesses: histories.preExistingIllnesses
            });
        }
    }


    expandOrContractVideo() {
        this.setState({
            isVideoFullscreen: !this.state.isVideoFullscreen
        });
    }

    enableDisableCheifComplain = () => {

        this.setState({
            chiefComplainModal: this.state.chiefComplainModal ? false : true
        })
    }
    setChiefComplains = (testType='', newComplain) => {


        this.setState({
            cheifComplains: newComplain
        })
    }
    setDiagonsis = (testType='', newDiagonsis) => {


        this.setState({
            diagonsisItems: newDiagonsis
        })
    }
    enableDisableDiagonsisModal = () => {

        this.setState({
            DiagonsisModal: this.state.DiagonsisModal ? false : true
        })
    }
    enableDisableVideoModal = () => {

        this.setState({
            // openVideoModal: this.state.openVideoModal ? false : true
            isVideoEnabled: !this.state.isVideoEnabled
        });
        let event = this.state.isVideoEnabled ? 'disable_video' : 'enable_video';
        socket.emit('command', {event: event, "sent_for": patientId});
    }

    enableDisableReferDocModal = () => {
        this.setState({
            referDoctorModal: this.state.referDoctorModal ? false : true
        })
    }
    enableDisableMedicalHist = () => {
        this.setState({
            medicalHistoryModal: this.state.medicalHistoryModal ? false : true
        })
    }

    setMedicalHistories = (medicalHistories) => {
        this.setState({
            medicalHistories: medicalHistories
        });
    }

    enableDisableRX = () => {
        this.setState({
            rxHistoryModal: this.state.rxHistoryModal ? false : true
        })
    }
    setRxHistories = (RxHistories) => {
        this.setState({
            rxHistories: RxHistories
        });
    }
    enableDisableInvModal = () => {
        this.setState({
            investigationModal: this.state.investigationModal ? false : true
        })
    }
    setInvestigations = (investigations) => {
        this.setState({
            investigations: investigations
        });
    }
    enableDisblePreExisting = () => {
        this.setState({
            preExistingModal: this.state.preExistingModal ? false : true
        })
    }
    setPrexistingIllnesses = (illness) => {
        this.setState({
            preExistingIllnesses: illness
        });
    }
    enableDisableClinicalExaminationModal = () => {
        this.setState({
            clinicalExaminationModal: this.state.clinicalExaminationModal ? false : true
        })
    }
    setClinicalExaminations =  (clinicalExamination) => {
        this.setState({
            clinicalExamination
        })
    }
    enableDisableAdviceModal = () => {
        this.setState({
            adviceModal: this.state.adviceModal ? false : true
        })
    }

    setAdvices = (testType='', newAdvices) => {

        this.setState({
            advices: newAdvices
        })
    }

    setReferredDoctors = (referredDoctors) => {
        this.setState({
            referredDoctors
        });
    }

    handleDatePicker = () => {

        this.setState({ nextAppointmentState: this.state.nextAppointmentState ? false : true });
    }

    setNextAppointDates = (newDate) => {

        this.setState({
            nextAppointmentDate: new Date(newDate)
        });
    }

    preventUploadingAndGeneratingPRes = () => {

        let diagonsisItems = this.state.diagonsisItems.length === 0;
        let rxHistories = this.state.rxHistories.length === 0;

        if (diagonsisItems || rxHistories) {
            Alert.alert("Not Allowed", `Followings must need to be filled out to preview or complete prescription: 
                ${diagonsisItems ? "Diagonsis" : ''} ${rxHistories ? 'RX ' : ''}`);
            return true;
        }
        return false;
    }

    handleGeneratePres = () => {

        if(this.preventUploadingAndGeneratingPRes()) {
            return;
        }
        
        this.props.navigation.navigate('GeneratePrescription', { ...this.state });
    }


    handleCallEnd = async() => {

        await this.API._removeItem('prescriptionData');

        //Check first if there is available websocket and all that stuff
        if (pc) {

            pc.close();

            InCallManager.stop();
            InCallManager.stopRingtone();

            //TODO: Maybe need to create a new socket event for rjeect call. Right now the event using is for hangup!
            var closedRemoteInfos = {
                remoteID: 11,
                status: 'closed',
                message: "Dummpy Message!"
            }
            // sendMessage("closed_remote", JSON.stringify(closedRemoteInfos));
            this.setState({
                remoteStream: null
            })
        }
        
        this.props.navigation.navigate('SeePatient');
    }

    render() {

        let chiefComplains = this.state.cheifComplains.map((item, key) => {
            if(key <  2) {
                return <Text style={styles.selectedItem} key={key}> - {item}</Text>
            }
        });

        let diagonsisList = this.state.diagonsisItems.map((item, key) => {
            if(key <  2) {
                return <Text style={styles.selectedItem} key={key}> - {item}</Text>
            }
        });
        let advicesList = this.state.advices.map((item, key) => {
            if(key <  2) {
                return <Text style={styles.selectedItem} key={key}> - {item}</Text>
            }
        });
        let RxHistories = this.state.rxHistories.map((item, key) => {

            let isToAddTsf = item.medicineType === 'Syrup' || item.medicineType === 'Suspension' ? ' TSF ' : ' ';
            return <Text style={styles.selectedItem} key={key}> - {item.medicineType} {item.name} {item.strength} 
                    {'\n' + item.doses.join("+") + isToAddTsf} 
                    {item.beforeMeal ? '(Before Meal)' : ' '}
                    {item.afterMeal ? '(After Meal)' : ' '}
                    {item.beforeSleep ? '(Before sleep)' : ' '}
                    {  (item.checkDuration && item.durationEntry != "" ? ', ' + item.durationEntry + ' Days' : ', Duration: Continue')}
                </Text>
        });
        let clinicalExamination = this.state.clinicalExamination.map( (item, key) => {
            let clinicalItemSelectedList = ['Anemia', 'Jaundice', 'Dehydration'];
            if (key < 2) {
                return <Text style={styles.selectedItem} key={key}> - {item.examinationType} {clinicalItemSelectedList.includes(item.examinationType) ? ':' : '-'} {item.examData}</Text>
            }
        });
        let medicalHistories = this.state.medicalHistories.map( (item, key) => {
            if (key < 2) {
                return <Text style={styles.selectedItem} key={key}> - {item.historyName}</Text>
            }
        });
        let preExistingIllnesses = this.state.preExistingIllnesses.map( (item, key) => {
            if (key < 2) {
                return <Text style={styles.selectedItem} key={key}> - {item.testType}</Text>
            }
        });
        let investigations = this.state.investigations.map( (item, key) => {
            if (key < 2) {
                return <Text style={styles.selectedItem} key={key}> - {item}</Text>
            }
        });

        //Get Remaining Month and Day between a future date and current Date.
        const _MS_PER_DAY = 1000 * 60 * 60 * 24;
        function dateDiffInDays(a, b) {
            // Discard the time and time-zone information.
            const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
            const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

            return Math.floor((utc2 - utc1) / _MS_PER_DAY);
        }
        let differenceByDays = dateDiffInDays( new Date(), this.state.nextAppointmentDate );
        let diffMonths = parseInt(differenceByDays / 30);
        if(diffMonths){
            differenceByDays = differenceByDays - (diffMonths * 30);
        }

        return (
            <View style={{ flex: 1, flexDirection: 'column', backgroundColor: "#F3F3F3",}}>
                
                <View style={{ flex: 1, flexDirection: 'row', marginTop: 13, marginRight: 8, marginLeft: 8, }}>
                    <ScrollView style={{
                        width: "35%",
                        marginRight: 5,
                    }}>
                        <TouchableHighlight underlayColor="transparent" onPress={this.enableDisableCheifComplain}>
                            <View style={[styles.consulting_item, { backgroundColor: "#E0E2E4" }]}>
                                <ChiefComplain animationType="fade" modalVisible={this.state.chiefComplainModal} ModalExecuter={this.enableDisableCheifComplain}
                                    setComplains={this.setChiefComplains}
                                    getComplains={this.state.cheifComplains}
                                />
                                <Text style={styles.item_header}>Chief Complain</Text>
                                <View>
                                    {chiefComplains}
                                    {this.state.cheifComplains.length > 2 && (
                                            <Text style={[styles.item_header, { fontWeight: 'bold', fontSize: 14, marginTop: -7, marginLeft: 6}]}>..</Text>
                                    )}
                                    { this.state.cheifComplains.length === 0 && (
                                        <Text style={{ fontSize: 7, color: '#000'}}>.....</Text>
                                    )}
                                </View>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight underlayColor="transparent" onPress={this.enableDisableClinicalExaminationModal}>
                            <View style={[styles.consulting_item, { backgroundColor: "#F8F8F9", borderWidth: 1, borderColor: "#DADADB" }]}>
                                <ClinicalExaminationModal animationType="fade" modalVisible={this.state.clinicalExaminationModal} ModalExecuter={this.enableDisableClinicalExaminationModal}
                                setClinicalExamination={this.setClinicalExaminations} getClinicalExamination={this.state.clinicalExamination} />
                                <Text style={styles.item_header}>Clinical Examination</Text>
                                <View>
                                    {clinicalExamination}
                                    {this.state.clinicalExamination.length > 2 && (
                                        <Text style={[styles.item_header, { fontWeight: 'bold', fontSize: 14, marginTop: -7, marginLeft: 6 }]}>..</Text>
                                    )}
                                    {this.state.clinicalExamination.length === 0 && (
                                        <Text style={{ fontSize: 7, color: '#000' }}>.....</Text>
                                    )}
                                </View>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight underlayColor="transparent" onPress={this.enableDisblePreExisting}>
                            <View style={[styles.consulting_item, { backgroundColor: "#E0E2E4" }]}>
                                <PresExistingIllnessModal
                                    modalVisible={this.state.preExistingModal}
                                    ModalExecuter={this.enableDisblePreExisting}
                                    setPrexistingIllnesses={this.setPrexistingIllnesses}
                                    getPrexistingIllness={this.state.preExistingIllnesses}
                                    navigation={this.props.navigation}
                                />
                                <Text style={styles.item_header}>Pre existing illness</Text>
                                <View>
                                    {preExistingIllnesses}
                                    {this.state.preExistingIllnesses.length > 2 && (
                                        <Text style={[styles.item_header, { fontWeight: 'bold', fontSize: 14, marginTop: -7, marginLeft: 6 }]}>..</Text>
                                    )}
                                    {this.state.preExistingIllnesses.length === 0 && (
                                        <Text style={{ fontSize: 7, color: '#000' }}>.....</Text>
                                    )}
                                </View>
                            </View>
                        </TouchableHighlight>
                        
                        <TouchableHighlight underlayColor="transparent" onPress={this.enableDisableInvModal}>
                            <View style={[styles.consulting_item, { backgroundColor: "#F8F8F9" }]}>
                                <InvestigationModal
                                    modalVisible={this.state.investigationModal}
                                    ModalExecuter={this.enableDisableInvModal}
                                    setInvestigations={this.setInvestigations}
                                    getInvestigations={this.state.investigations}
                                />
                                <Text style={styles.item_header}>Investigation</Text>
                                <View>
                                    {investigations}
                                    {this.state.investigations.length > 2 && (
                                        <Text style={[styles.item_header, { fontWeight: 'bold', fontSize: 14, marginTop: -7, marginLeft: 6 }]}>..</Text>
                                    )}
                                    {this.state.investigations.length === 0 && (
                                        <Text style={{ fontSize: 7, color: '#000' }}>.....</Text>
                                    )}
                                </View>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight underlayColor="transparent" onPress={this.enableDisableMedicalHist}>
                            <View style={[styles.consulting_item, { backgroundColor: "#E0E2E4" }]}>
                                <MedicalHistoryModal modalVisible={this.state.medicalHistoryModal} ModalExecuter={this.enableDisableMedicalHist}
                                    setMedicalHistory={this.setMedicalHistories}
                                    getMedicalHistory={this.state.medicalHistories}
                                />
                                <Text style={styles.item_header}>Medical History</Text>
                                <View>
                                    {medicalHistories}
                                    {this.state.medicalHistories.length > 2 && (
                                        <Text style={[styles.item_header, { fontWeight: 'bold', fontSize: 14, marginTop: -7, marginLeft: 6 }]}>..</Text>
                                    )}
                                    {this.state.medicalHistories.length === 0 && (
                                        <Text style={{ fontSize: 7, color: '#000' }}>.....</Text>
                                    )}
                                </View>
                            </View>
                        </TouchableHighlight>
                        
                    </ScrollView>
                    <ScrollView style={{
                        width: "65%"
                    }}>
                        <TouchableHighlight underlayColor="transparent" onPress={this.enableDisableDiagonsisModal} animationType="slide">
                            <View style={[styles.consulting_item, { backgroundColor: "#E0E2E4" }]}>
                                <DiagonsisModal animationType="fade" modalVisible={this.state.DiagonsisModal} ModalExecuter={this.enableDisableDiagonsisModal}
                                    setDiagonsis={this.setDiagonsis}
                                    getDiagonsis={this.state.diagonsisItems}
                                />
                                <Text style={styles.item_header}>Diagnosis</Text>
                                <View>
                                    {diagonsisList}
                                    {this.state.diagonsisItems.length > 2 && (
                                        <Text style={[styles.item_header, { fontWeight: 'bold', fontSize: 14, marginTop: -7, marginLeft: 6 }]}>..</Text>
                                    )}
                                    {this.state.diagonsisItems.length === 0 && (
                                        <Text style={{ fontSize: 7, color: '#000' }}>.....</Text>
                                    )}
                                </View>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight style={{ marginBottom: 10}} underlayColor="transparent" onPress={this.enableDisableRX} animationType="slide">
                            <View style={[styles.consulting_item, { backgroundColor: "#F8F8F9", borderWidth: 1, borderColor: "#f8f8f8", height: 120 }]}>
                                <RXHistoryModal animationType="fade" modalVisible={this.state.rxHistoryModal} ModalExecuter={this.enableDisableRX}
                                    setRx={this.setRxHistories}
                                    getRx={this.state.rxHistories}
                                />
                                <Text style={styles.item_header}>RX</Text>
                                <View>
                                    {RxHistories}
                                    {this.state.rxHistories.length > 2 && (
                                        <Text style={[styles.item_header, { fontWeight: 'bold', fontSize: 14, marginTop: -7, marginLeft: 6 }]}>..</Text>
                                    )}
                                    {this.state.rxHistories.length === 0 && (
                                        <Text style={{ fontSize: 7, color: '#000' }}>.....</Text>
                                    )}
                                </View>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight underlayColor="transparent" onPress={this.enableDisableAdviceModal} animationType="fade">
                            <View style={[styles.consulting_item, { backgroundColor: "#F8F8F9", height: 101 }]}>
                                <Text style={styles.item_header}>Advice</Text>
                                <AdviceModal 
                                    animationType="fade" 
                                    modalVisible={this.state.adviceModal} 
                                    ModalExecuter={this.enableDisableAdviceModal}
                                    setAdvices={this.setAdvices}
                                    getAdvice={this.state.advices}
                                />
                                <View>
                                    {advicesList}
                                    {this.state.advices.length > 2 && (
                                        <Text style={[styles.item_header, { fontWeight: 'bold', fontSize: 14, marginTop: -7, marginLeft: 6 }]}>..</Text>
                                    )}
                                    {this.state.advices.length === 0 && (
                                        <Text style={{ fontSize: 7, color: '#000' }}>.....</Text>
                                    )}
                                </View>
                            </View>
                        </TouchableHighlight>
                        <SetAppointmentDate
                            modalVisible={this.state.nextAppointmentState}
                            invokeModalClosing={this.handleDatePicker}
                            setNextAppointDate={this.setNextAppointDates}
                        />
                        <TouchableHighlight underlayColor="transparent" onPress={this.handleDatePicker}
                            >
                            <View style={[{ backgroundColor: "#E0E2E4", flexDirection: 'row', paddingTop: 13, paddingBottom: 16, paddingLeft: 7, }]}>
                                <View style={[{ width: "85%" }]}>
                                    <Text style={styles.item_header}>Follow-up in</Text>
                                    <View>
                                        <Text style={styles.selectedItem}>{` ${diffMonths} Months and ${differenceByDays} Days`}</Text>
                                        
                                    </View>
                                </View>
                                <View style={[{ width: "15%" }]}>
                                    <View>
                                        <Ionicons
                                            name="md-calendar"
                                            size={28}
                                            style={{ color: "#00A3FB" }}
                                        />
                                    </View>
                                </View>
                            </View>
                        </TouchableHighlight>
                    </ScrollView>
                </View>
                <View style={{
                    flex: .12,
                    flexDirection: 'row',
                    marginTop: 5
                }}>
                    <TouchableHighlight style={[styles.btn_wrapper_icon]} onPress={this.handleGeneratePres} underlayColor="transparent">
                        <View style={{ flexDirection: 'row', backgroundColor: "#00B9FC", padding: 7, borderRadius: 2}}>
                            <FontAwesome 
                                name="pencil"
                                size={15}
                                style={[styles.box_element_common_pres, { color: "#FFF", marginTop: 2}]}
                            />
                            <Text style={{ color: "#FFF"}}>Preview Prescription</Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight style={{ width: "48%", marginLeft: 5 }} onPress={this.enableDisableReferDocModal} underlayColor="transparent">
                        <View style={{ flexDirection: 'row', backgroundColor: "#FFF", padding: 7, borderRadius: 2}}>
                            <ReferDoctorModal setReferredDoctors={this.setReferredDoctors} animationType="fade" modalVisible={this.state.referDoctorModal} ModalExecuter={this.enableDisableReferDocModal} />
                            <Image 
                                source={require('../../assets/btn_doc_icon.png')}
                                style={[styles.box_element_common_pres, { height: 20}]}
                            />
                            <Text style={{fontWeight: '300'}}>Refer Doctor</Text>
                        </View>
                    </TouchableHighlight>
                </View>
                { this.state.isVideoEnabled &&
                    <View style={[
                        {
                            backgroundColor: '#000',
                            position: 'absolute',
                            bottom: 80,
                            right: 20,
                            zIndex: 200,
                            width: 150,
                            height: 200,
                        },
                        this.state.isVideoFullscreen &&
                        {
                            bottom: 0,
                            right: 0,
                            width: '100%',
                            height: '100%',
                        }
                    ]}>
                        <RTCView streamURL={this.state.remoteStream} style={{width: '100%', height: '100%'}} objectFit={'cover'} />
                        {/*<RTCView streamURL={this.state.myStream} style={{width: 100, height: 150}} />*/}
                        <View style={{alignSelf: 'center', position: 'absolute', bottom: 15}}>
                            <TouchableHighlight onPress={this.expandOrContractVideo.bind(this)} underlayColor="transparent">
                                <Image source={ this.state.isVideoFullscreen ? iconMinimize : iconMaximize} />
                            </TouchableHighlight>
                        </View>
                    </View>
                }
                <View style={{
                    flex: .17,
                    flexDirection: 'row',
                    marginTop: 5,
                    justifyContent: 'space-between',
                    backgroundColor: "#FFF",
                    paddingRight: 7,
                    paddingLeft: 7,
                    borderTopWidth: 1,
                    borderTopColor: "#ddd"
                    
                }}>
                    <TouchableHighlight onPress={this.enableDisableVideoModal} underlayColor="transparent">
                        <View style={[styles.consulting_btm_btn]}>
                            <VideoChatModal animationType="fade" modalVisible={this.state.openVideoModal} ModalExecuter={this.enableDisableVideoModal} />
                            <Ionicons
                                name="ios-videocam"
                                size={22}
                                style={[styles.consulting_btn_style, { backgroundColor: "#00B9FC" }]}
                            />
                            <Text style={[styles.consulting_btm_btn_txt]}>{this.state.isVideoEnabled ? 'Disable Video' : 'Enable Video'}</Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight onPress={() => this.props.navigation.navigate('PatientRecord', { state: { patientInformation: this.state.patientInformations }})} underlayColor="transparent">
                        <View style={[styles.consulting_btm_btn]}>
                            <FontAwesome
                                name="history"
                                size={22}
                                style={[styles.consulting_btn_style, { backgroundColor: "#00C36A" }]}
                            />
                            <Text style={[styles.consulting_btm_btn_txt]}>Patient Records</Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight onPress={() => Alert.alert("Action", "Operator Call")} underlayColor="transparent">
                        <View style={[styles.consulting_btm_btn]}>
                            <MaterialCommunityIcons
                                name="headphones"
                                size={22}
                                style={[styles.consulting_btn_style, { backgroundColor: "#B3B5C0" }]}
                            />
                            <Text style={[styles.consulting_btm_btn_txt]}>Operator Call</Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight onPress={this.handleCallEnd} underlayColor="transparent">
                        <View style={[styles.consulting_btm_btn]}>
                            <MaterialIcons
                                name="call-end"
                                size={23}
                                style={[styles.consulting_btn_style, { backgroundColor: "#F62834" }]}
                            />
                            <Text style={[styles.consulting_btm_btn_txt]}>End Call</Text>
                        </View>
                    </TouchableHighlight>
                </View>
                
            </View>
        )
    }
}

const styles = StyleSheet.create({
    consulting_item: {
        padding: 12,
        borderRadius: 7,
        marginBottom: 6,
        height: height/9,
    },
    item_header: {
        color: 'gray',
        fontSize: 10
    },
    selectedItem: {
        fontSize: 11,
        lineHeight: 15,
        marginLeft: 4
    },
    box_element_common_pres: {
        marginRight: 5
    },
    btn_wrapper_icon: {
        marginLeft: 10,
    },
    consulting_btm_btn: {
        paddingTop: 5,
        paddingBottom: 5,
        alignSelf: 'center'
    },
    consulting_btm_btn_txt: {
        color: "gray",
        fontSize: 10
    },
    consulting_btn_style: {
        color: "#FFF",
        borderRadius: 35,
        padding: 9,
        // width: "40%",
        width: 40,
        textAlign: 'center',
        alignSelf: "center"

    }
});