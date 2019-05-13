import React from 'react';
import { View, TouchableHighlight, Text, StyleSheet, Image, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';


import CONST from '../../lib/constants';
import API from '../../lib/api';

const { height, width } = Dimensions.get('window');

export default class SeePatient extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            enabledConsulting: false,
            queueItems: {
                generalItems: '00',
                specialItems: '00'
            }
        }
        this.API = new API();
    }

    async componentDidMount() {
        // const url = CONST.BASE_URL + CONST.APIS.GET_CURRENT_QUEUE;

        // console.log("Height: ", height, "Width: ", width);

        let getOnlineStatus = await this.API._retrieveData("is_online");

        // console.log(getOnlineStatus)
        if(getOnlineStatus) {
            this.setState({
                enabledConsulting: getOnlineStatus === 'yes' ? true : false
            })
        }

        this.getCurrentQueue();
        
    }

    getCurrentQueue = async() => {

        const url = CONST.BASE_URL + CONST.APIS.GET_CURRENT_QUEUE;
        const getCurrentQueue = await this.API.GET(url);

        if (getCurrentQueue.response) {

            let generalItems = getCurrentQueue.response.filter(v => v.queue_type === 'general');
            let specialItems = getCurrentQueue.response.filter(v => v.queue_type === 'special');

            // console.log(generalItems, specialItems);
            generalItems = generalItems.length;
            specialItems = specialItems.length;
            this.setState({
                queueItems: {
                    generalItems: generalItems <= 9 ? '0' + generalItems : generalItems,
                    specialItems: specialItems <= 9 ? '0' + specialItems : specialItems
                }
            })
        }
    }

    enableDisablePatientBtn = async() => {

        let updateDoctorStatusUri =  CONST.BASE_URL + CONST.APIS.UPDATE_DOCTOR_STATUS;

        let getDoctor = await this.API._retrieveData("userInfo");
        let doctor_id = JSON.parse(getDoctor).doctor_id;


        let payload = {
            doctor_id,
            type: this.state.enabledConsulting ? 'no' : 'yes'
        }

        let updateDoctorStatus =  await this.API.POST(updateDoctorStatusUri, payload);

        if (updateDoctorStatus.status === 'success') {
            
            this.setState({
                enabledConsulting: this.state.enabledConsulting ? false : true
            });

            await this.API._storeData("is_online", this.state.enabledConsulting ? 'yes' : 'no');
        }
        
    }

    render() {

        let btnIcon = this.state.enabledConsulting ? require('../../assets/switch-up.png') : require('../../assets/switch-down.png');
        // console.log(btnIcon)

        return (
            <View style={{ flex: 1, backgroundColor: "#FFFFFF", flexDirection: 'column' }}>
                <View style={styles.PatientQueueWrapper}>
                    <View style={styles.PatientQueueItem}>
                        <View style={[styles.PatientQueueItemCircle, { backgroundColor: "#BFC4CF" }]}>
                            <Text style={{ color: "#FFF"}}>00</Text>
                        </View>
                        <Text style={{marginLeft: 5}}>Seen</Text>
                        <Text style={{color: '#A4A8AB'}}>Patient</Text>
                    </View>
                    <View style={styles.PatientQueueItem}>
                        <View style={[styles.PatientQueueItemCircle, { backgroundColor: "#00A3FB" }]}>
                            <Text style={{ color: "#FFF"}}>{this.state.queueItems.specialItems}</Text>
                        </View>
                        <Text>Special</Text>
                        <Text style={{color: '#A4A8AB'}}>Patient</Text>
                    </View>
                    <View style={styles.PatientQueueItem}>
                        <View style={[styles.PatientQueueItemCircle, { backgroundColor: "#00C46B" }]}>
                            <Text style={{ color: "#FFF" }}>{this.state.queueItems.generalItems}</Text>
                        </View>
                        <Text>General</Text>
                        <Text style={{color: '#A4A8AB'}}>Patient</Text>
                    </View>
                </View>
                <View style={styles.consultingBtnWrapper}>
                    <View style={{ flex: .15}}></View>
                    <TouchableHighlight 
                        style={{ height: '85%', width: '19%', borderRadius: 32, backgroundColor: this.state.enabledConsulting ? "#00BAFB" : '#BFC4CF', marginBottom: 20, flex: .32,}} 
                        onPress={this.enableDisablePatientBtn}
                        underlayColor="#ddd"
                    >
                            <Image
                                source={btnIcon}
                                style={{ height: parseInt(height / 5.5), width: parseInt(width / 5.8), marginTop: parseInt(width / 55), marginLeft: 3,}}
                            />
                    </TouchableHighlight>
                    { this.state.enabledConsulting ?  

                        <View style={{ alignSelf: 'center', alignItems: 'center', flex: .4 }}>
                            <Text style={{ fontWeight: 'bold', color: "#000", fontSize: 16 }}>Stop Consulting</Text>
                            <Text style={{ color: "#A4A8AB", fontSize: 16, marginBottom: 12, marginTop: 12 }}>OR</Text>
                            <TouchableHighlight underlayColor="#fff" onPress={() => this.props.navigation.navigate('PatientProfile')}>
                                <View
                                    style={{
                                        backgroundColor: "#FFFFFF",
                                        borderWidth: 1,
                                        borderColor: "#ddd",
                                        borderRadius: 25,
                                        paddingTop: 9,
                                        paddingBottom: 9,
                                        paddingRight: 14,
                                        paddingLeft: 14
                                    }}
                                >
                                    <Text style={{ color: "#7C8389", }}>Next Patient <Ionicons name="md-arrow-forward" size={13} color="gray" /></Text>

                                </View>
                            </TouchableHighlight>
                        </View>
                    
                    : 
                        <View style={{alignSelf: 'center', alignItems: 'center', flex: .4}}>
                            <Text style={{ fontWeight: 'bold', color: "#000", fontSize: 16 }}>Start Consulting</Text>
                            <Text style={{ color: '#A4A8AB', textAlign: 'center', width: width / 1.5, fontSize: 13 }}>You can see General patient after consulting Special Patient</Text>
                        </View>
                    }

                    

                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    PatientQueueWrapper: {
       flex: .2, 
       backgroundColor: "#FFFFFF", 
       flexDirection: 'row', 
       marginTop: 25,
       borderBottomWidth: 1,
       borderBottomColor: "#DDDDDD"
       
    },
    PatientQueueItem: {
        flexDirection: 'column',
        flex: .33,
        marginLeft: 30,
    },
    PatientQueueItemCircle: { 
        width: 35, 
        height: 35, 
        borderRadius: 50, 
        paddingTop: 8, 
        paddingLeft: 8,
        marginLeft: 4 
    },
    consultingBtnWrapper: { 
        flex: .8,
        flexDirection: 'column', 
        backgroundColor: "#F4F9FC",
        justifyContent: 'center',
        alignItems: 'center'
    }
})