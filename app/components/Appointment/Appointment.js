import React from 'react';
import { View, TouchableHighlight, DatePickerAndroid, StyleSheet, Text, ScrollView, Image, Alert } from 'react-native';
import DatePicker from 'react-native-datepicker';

import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';
import Entypo from 'react-native-vector-icons/Entypo';

import CONST from '../../lib/constants';
import API from '../../lib/api';

export default class Appointment extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            scheduledAppointments: null,
            appointRequests: null,
            renderingTab: 2,
            currentScheduleForUpdatingAppointmentDate: null
        };

        this.API = new API();

    }

    async componentDidMount() {

        this.getPatientsByDrAndStatus('pending');
        this.getPatientsByDrAndStatus('accepted');
    }

    getPatientsByDrAndStatus = async(status) => {

        let uri = CONST.BASE_URL + CONST.APIS.GET_PATIENTS_BY_DR;

        let userInfo = await this.API._retrieveData('userInfo');
        let parsedUserInfo = JSON.parse(userInfo);

        delete parsedUserInfo.profilePic;

        if(parsedUserInfo) {

            let payload = {
                doctor_id: parsedUserInfo.doctor_id,
                status
            };

            let getPatients = await this.API.POST(uri, payload);

            if (getPatients.status === 'success') {

                if (status === 'pending') {
                    this.setState({
                        appointRequests: getPatients.response
                    })
                } else {
                    this.setState({
                        scheduledAppointments: getPatients.response
                    })
                }
            } else {
                Alert.alert("Something went wrong while retrieving informations!")
            }
        }
    }

    openDatePicker = (schedule) => {

        this.datePickerRef.onPressDate();
        this.setState({
            currentScheduleForUpdatingAppointmentDate: schedule
        });

    }

    AppointmentRequest = async (appointmentDate) => {

        console.log("appointmentDate: ", appointmentDate);
    }

    changeRenderingTab = (tab) => {

        this.setState({
            renderingTab: tab
        })
    }

    updateAppointmentDate = async (appointmentDate) => {

        let selectedSchedule = this.state.currentScheduleForUpdatingAppointmentDate;
        let uri = CONST.BASE_URL + CONST.APIS.SCHEDULE_UPDATE_TIME;
        let payload = {
            schedule_id: selectedSchedule.schedule_id,
            new_shedule_time: appointmentDate
        };


        let tryUpdatingScheduleTime =  await this.API.POST(uri, payload);

        if(tryUpdatingScheduleTime.status == 'success') {

            selectedSchedule.appointment_date = appointmentDate;

            let newScheduledItems = this.state.scheduledAppointments.map( ( item, key) => {

                if(selectedSchedule.schedule_id === item.schedule_id) {
                    item.appointment_date = appointmentDate;
                    return item;
                }
                return item;
            });

            this.setState({
                scheduledAppointments: newScheduledItems
            })

            Alert.alert(tryUpdatingScheduleTime.status, tryUpdatingScheduleTime.message);
        } else {
            Alert.alert("error", "Something went wrong!");
        }
    }

    cancelAppointmentRequest = async(scheduleItem) => {

        let scheduleUpdatingUri = CONST.BASE_URL + CONST.APIS.SCHEDULE_UPDATE;

        let payload = {
            schedule_id: scheduleItem.schedule_id,
            queue_status: 'cancelled'
        };

        let tryCancelingRequest = await this.API.POST(scheduleUpdatingUri, payload);

        if (tryCancelingRequest.status == 'success') {

            let newAppointmentRequest = await this.state.appointRequests.filter((item, key) => item.schedule_id !== scheduleItem.schedule_id);

            this.setState({
                appointRequests: newAppointmentRequest,
            });
        } else {
            Alert.alert("Error", "Something went wrong while canceling appointment request!");
        }

    }

    acceptPatient = async(scheduleItem) => {

        let scheduleUpdatingUri = CONST.BASE_URL + CONST.APIS.SCHEDULE_UPDATE;

        let payload = {
            schedule_id: scheduleItem.schedule_id,
            queue_status: 'accepted'
        }

        let tryAcceptingRequest = await this.API.POST(scheduleUpdatingUri, payload);
        if (tryAcceptingRequest.status == 'success') {

            //Once the item accepted add this one to  scheduledAppointments state!
            let newScheduledAppointments = this.state.scheduledAppointments;

            newScheduledAppointments.push(scheduleItem);

            //also need to remove the current one from state.
            let newAppointmentRequest =  this.state.appointRequests.filter( (item, key) => item.schedule_id !== scheduleItem.schedule_id);

            this.setState({
                scheduledAppointments: newScheduledAppointments,
                appointRequests: newAppointmentRequest
            })

        } else {
            Alert.alert("Error", tryAcceptingRequest.message ? tryAcceptingRequest.message : 'Something went Wrong!')
        }

    }

    render() {

        let renderSceduledAppointments = this.state.scheduledAppointments && this.state.scheduledAppointments.map((appointment, key) => {

            let profileMeta = JSON.parse(appointment.profile_meta);

            let imageUri = profileMeta.image_uri ? { uri: CONST.PROFILE_PIC_BASE + profileMeta.image_uri } : require('../../assets/man.png')
            return (
                <View style={styles.appointmentsItem} key={key}>
                    <View style={{ flex: .15 }}>
                        <Image
                            source={imageUri}
                            style={[styles.itemImage, { borderColor: '#00C367' }]}
                        />
                    </View>
                    <View style={styles.itemDetailsWrapper}>
                        <Text style={styles.patientName}>{appointment.patient_name.replace("|", " ")}</Text>
                        <Text style={styles.patientSubTitle}>#{appointment.patient_id}, {appointment.appointment_date}</Text>
                    </View>
                    <TouchableHighlight style={styles.editBtn} onPress={() => this.openDatePicker(appointment)} underlayColor="transparent">
                        <Text style={styles.editBtnText}>EDIT</Text>
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.singleItemMenu}>
                        <Menu >
                            <MenuTrigger
                                children={<Entypo name="dots-three-vertical" size={14} style={[styles.grayColor, { marginTop: 5 }]}
                                />} />
                            <MenuOptions>
                                <MenuOption onSelect={() => alert(`Coming Soon.. Hold Tight`)} text='Counter Appointment' />
                            </MenuOptions>
                        </Menu>
                    </TouchableHighlight>
                </View>
            );
        })

        let renderAppointmentsRequest = this.state.appointRequests && this.state.appointRequests.map((appointment, key) => {

            let profileMeta = JSON.parse(appointment.profile_meta);

            return (
                <View style={styles.appointmentsItem} key={key}>
                    <View style={{ flex: .15 }}>
                        <Image
                            source={{ uri: CONST.PROFILE_PIC_BASE + profileMeta.image_uri }}
                            style={[styles.itemImage, { borderColor: '#00C367' }]}
                        />
                    </View>
                    <View style={styles.itemDetailsWrapper}>
                        <Text style={styles.patientName}>{appointment.patient_name.replace("|", " ")}</Text>
                        <Text style={styles.patientSubTitle}>#{appointment.patient_id}, {new Date(appointment.timestamp).toLocaleDateString()}</Text>
                    </View>
                    <TouchableHighlight style={styles.editBtn} onPress={() => this.acceptPatient(appointment)} underlayColor="transparent">
                        <Text style={styles.editBtnText}>Accept</Text>
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.singleItemMenu}>
                        <Menu >
                            <MenuTrigger
                                children={<Entypo name="dots-three-vertical" size={14} style={[styles.grayColor, { marginTop: 5 }]}
                                />} />
                            <MenuOptions>
                                <MenuOption onSelect={() => alert(`Coming Soon.. Hold Tight`)} text='Counter Request' />
                                <MenuOption onSelect={() => this.cancelAppointmentRequest(appointment)} text='Cancel Request' />
                            </MenuOptions>
                        </Menu>
                    </TouchableHighlight>
                </View>
            );
        })

        let renderingTab = this.state.renderingTab;

        return(
            <View style={{
                flex: 1,
            }}>
                <View style={{
                    flex: 0.07,
                    flexDirection: 'row'
                }}>
                    <TouchableHighlight 
                    style={[styles.flexTabWrapper, { borderBottomColor: renderingTab === 1 ? '#3FB9FF' : 'transparent'  }]} 
                    underlayColor={CONST.COLORS.INACTIVE_COLOR} 
                    onPress={() => this.changeRenderingTab(1)}>
                        <Text style={[styles.flexTabTxt, { color: renderingTab === 1 ? '#3FB9FF' : 'transparent' }]}>Scheduled Appointment</Text>
                    </TouchableHighlight>
                    <TouchableHighlight 
                    style={[styles.flexTabWrapper, { borderBottomColor: renderingTab === 2 ? '#3FB9FF' : 'transparent' }]} 
                    onPress={() => this.changeRenderingTab(2)} 
                    underlayColor={CONST.COLORS.INACTIVE_COLOR}>
                        <Text style={[styles.flexTabTxt, { color: renderingTab === 2 ? '#3FB9FF' : 'transparent' }]}>Patient request</Text>
                    </TouchableHighlight>
                </View>

                <View style={{
                    flex: .70,
                    flexDirection: 'column',
                    backgroundColor: '#FFF'
                }}>
                    <ScrollView>
                        <View style={{
                            flexDirection: 'row',
                            marginTop: 8,
                            marginBottom: 8,
                            marginRight: 7,
                        }}>
                            <View style={{ flex: .05}}>
                                <DatePicker
                                    showIcon={false}
                                    hideText={true}
                                    mode="datetime"
                                    is24Hour={false}
                                    ref={(ref) => this.datePickerRef = ref}
                                    onDateChange={this.updateAppointmentDate}
                                />
                            </View>
                            <Text style={[styles.grayColor, { flex: .65}]}>Patient's list</Text>
                            <View style={{ flex: .15, flexDirection: 'row'}}>
                                <Entypo name="dot-single" size={30} style={{ color: '#00C367', marginRight: -7, marginTop: -4}} />
                                <Text style={styles.grayColor}>new</Text>
                            </View>
                            <View style={{ flex: .15, flexDirection: 'row'}}>
                                <Entypo name="dot-single" size={30} style={{ color: '#FF7A25', marginRight: -7, marginTop: -4}} />
                                <Text style={styles.grayColor}>old</Text>
                            </View>
                        </View>

                        <View>
                            {this.state.renderingTab === 2 ? renderAppointmentsRequest : renderSceduledAppointments}

                        </View>
                    </ScrollView>
                </View>
                <View style={{
                    flexDirection: 'row',
                    flex: .23
                }}>
                    <View style={styles.footerArea}>
                        <TouchableHighlight style={styles.btmBtnItem}>
                            <Text style={[styles.btmBtnText, { borderLeftWidth: 1, borderLeftColor: CONST.COLORS.THEME_COLOR, borderTopLeftRadius: 20, borderBottomLeftRadius: 20 }]}>All</Text>
                        </TouchableHighlight>
                        <TouchableHighlight style={styles.btmBtnItem}>
                            <Text style={styles.btmBtnText}>New</Text>
                        </TouchableHighlight>
                        <TouchableHighlight style={[styles.btmBtnItem]}>
                            <Text style={[styles.btmBtnText, { borderRightColor: CONST.COLORS.THEME_COLOR, borderRightWidth: 1, borderTopRightRadius: 20, borderBottomRightRadius: 20}]}>Old</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    
    flexTabWrapper: {
        flex: .5,
        borderBottomWidth: 1,
        borderBottomColor: '#F9F9F9',
        elevation: 1,
        backgroundColor: '#FFF',
    },
    flexTabTxt: {
        color: '#BCBCBD',
        marginTop: 5,
        marginLeft: 7,
    },
    grayColor: {
        color: '#9e9e9e',
    },
    appointmentsItem: {
        flexDirection: 'row',
        borderBottomColor: '#ddd',
        backgroundColor: '#FFF',
        padding: 12,
        borderBottomWidth: 1,
    },
    itemImage: {
        width: 30,
        height: 30,
        borderWidth: 1.2,
        borderRadius: 15,
        borderColor: '#00C367',
        marginTop: 4,
        marginLeft: 10
    },
    itemDetailsWrapper: {
        flexDirection: 'column', 
        flex: .60,
        marginLeft: 12,
    },
    editBtn: {
        flex: .15,
        marginTop: 10,
        
    },
    editBtnText: {
        backgroundColor: '#00B9FC',
        fontWeight: 'bold',
        color: '#FFF',
        textAlign: 'center',
        paddingTop: 3,
        paddingBottom: 3,
        borderRadius: 20,
        fontSize: 10,
    },
    singleItemMenu: {
        flex: .1,
        marginTop: 10,
        marginLeft: 15,
    },
    patientName: {},
    patientSubTitle: {
        color: '#9e9e9e',
        fontSize: 12,
    },
    footerArea: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        paddingTop: 2,
        paddingBottom: 4,
        paddingLeft: 4,
        backgroundColor: '#F8F8F8',
    },
    btmBtnItem: {
        marginTop: '10%',
        
    },
    btmBtnText: {
        color: '#9e9e9e',
        backgroundColor: '#FFF',
        borderTopWidth: 1,
        borderTopColor: CONST.COLORS.THEME_COLOR,
        borderBottomColor: CONST.COLORS.THEME_COLOR,
        borderBottomWidth: 1,
        elevation: 1,
        paddingLeft: 14,
        paddingRight: 14,
        paddingTop: 4,
        paddingBottom: 4,
        fontSize: 11,
    },
    itemText: {
        width: 30,
        height: 30,
        marginLeft: 7,
        textAlign: 'center',
        backgroundColor: '#00B9FC',
        color: '#FFF',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 15,
        paddingTop: 6,
        marginTop: 4,
        borderWidth: 1.2,
        borderColor: '#FF7A25',

    },
});
