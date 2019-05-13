import React from 'react';
import { View, TouchableHighlight, TextInput, StyleSheet, Text, Image, ScrollView } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

import API from '../../lib/api';
import CONSTANTS from '../../lib/constants';

export default class SearchPatientRecord extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
            prescriptionList: null,
            FilteredList: null,
        };
        this.API = new API();
    }

    async componentDidMount() {

        let url = CONSTANTS.BASE_URL + CONSTANTS.APIS.GET_PRESCRIPTION_BY_DOCTOR;


        let doctorID = this.props.navigation.state.params.doctor_id;

        let payload = {
            doctor_id: doctorID
        };
        let getSearchResult = await this.API.POST(url, payload);

        this.setState({
            prescriptionList: getSearchResult.data,
            FilteredList: getSearchResult.data
        })

        // console.log(getSearchResult, doctorID);
    }

    searchPrescription(searchText) {

        if(this.state.prescriptionList) {

            let getFilteredPatients =  this.state.prescriptionList.map(v => {

                let parsedPrescription = JSON.parse(v.prescription_meta);
                let checkIfMatches = parsedPrescription.patientInformation.patientName.includes(searchText) ||
                    parsedPrescription.patientInformation.patientID.includes(searchText) ? true : false;

                if(checkIfMatches) {

                    return v;
                }
            });

            let filteredData =  getFilteredPatients.filter(v => v !== undefined);
            this.setState({
                searchText: searchText,
                FilteredList: filteredData
            });
        }
    }

    handleSelectingPatient = (newPatient) => {
        

        let oldPatients = this.props.getReferredDoctors;

        //check if the doctor already been selected, If selected then throw error otherwise complete the action
        let isSelected = false;
        oldPatients.filter(v => {
            if(v.id === newPatient.id) {
                isSelected = true;
            }
        });
        if(isSelected) {
            alert('Error: The Doctor has been already referrred');
        } else {
            oldPatients.push(newPatient);
            this.props.setReferredDoctors(oldPatients);
            this.props.ModalExecuter();
        }
    }

    render() {

        let PatientList = this.state.FilteredList && this.state.FilteredList.map((item, key) => { 
            
            let parsedData = JSON.parse(item.prescription_meta);

            let { patientName, patientID, profilePicUri } = parsedData.patientInformation;

            profilePicUri = !profilePicUri.includes("undefined") ? { uri: CONSTANTS.PROFILE_PIC_BASE + profilePicUri} : require('../../assets/man.png');
            
            return (
                <TouchableHighlight key={key} onPress={() => this.props.navigation.navigate('PatientRecord', { state: parsedData})}>
                <View style={{
                    flexDirection: 'row',
                    padding: 11,
                    borderBottomWidth: 1,
                    borderBottomColor: '#ddd',
                    backgroundColor: '#FFF'
                }}>
                    <Image
                        source={profilePicUri}
                        style={{ height: 30, width: 30, borderRadius: 20, marginTop: 8 }}
                    />
                    <View style={{
                        flexDirection: 'column',
                        marginLeft: 20
                    }}>
                            <Text>{this.API.formatUserName(patientName)}</Text>
                            <Text style={{ color: '#B6B6B6' }}>#{patientID}, DOR: {this.API.formatDate(new Date(item.timestamp))}</Text>
                    </View>
                    <Feather name="chevron-right" size={24} style={{ color: '#ddd', marginLeft: '25%', marginTop: '4%' }} />

                </View>
            </TouchableHighlight>
        );});

        return (
            <View
                style={{flex: 1}}
            >
                <View
                    style={{ flex: 1, flexDirection: 'column', backgroundColor: "#F7F8F9", height: '100%', width: '100%' }}
                >

                    <View
                        style={{
                            flexDirection: 'row',
                            height: '12%',
                            backgroundColor: '#FFF',
                            paddingBottom: 12,
                            borderBottomWidth: 1,
                            borderBottomColor: '#ddd',
                            shadowOffset: { width: 0, height: 5 },
                            shadowOpacity: 0.3,
                            shadowRadius: 6,
                            elevation: 1,
                        }}
                    >
                        <TextInput
                            style={{
                                borderRadius: 30,
                                marginTop: '3%',
                                width: '100%',
                                paddingLeft: 15,
                                paddingTop: 5,
                                paddingBottom: 13,
                                borderBottomColor: '#fff'
                            }}
                            underlineColorAndroid="transparent"
                            multiline={false}
                            placeholder="Search by Name or ID"
                            value={this.state.searchText}
                            onChangeText={(text) => this.searchPrescription(text)}
                        />
                    </View>
                    <ScrollView>
                        <View>
                            {PatientList}
                        </View>
                    </ScrollView>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    
});