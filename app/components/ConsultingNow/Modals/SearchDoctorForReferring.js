import React from 'react';
import { View, TouchableHighlight, TextInput, StyleSheet, Text, ImageBackground, Image, Modal, ScrollView, KeyboardAvoidingView } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

import CONSTANTS from '../../../lib/constants';
import API from '../../../lib/api';

let searchTimer;

export default class SearchDoctorForReferring extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
            doctorsList: null,
        };
        this.API = new API();

        
    }

    async componentDidMount() {


        this.getAllDoctors();

    }


    getAllDoctors = async() =>  {

        let url = CONSTANTS.BASE_URL + CONSTANTS.APIS.GET_DOCTOR_LIST;

        let payload =  {
            searchQuery: ''
        };
        let getSearchResult = await this.API.POST(url, payload);

        this.setState({
            doctorsList: getSearchResult.data,
            originalList: getSearchResult.data,
        })
    }

    searchDoctorsLocally = async(searchQuery) => {

        clearTimeout(searchTimer);
        searchTimer = setTimeout(async () => {

            let ListOfDoctors = this.state.originalList.filter( ( dataValue, dataKey) => {
                searchQuery = searchQuery.toLowerCase();
                let profileMeta =  JSON.parse(dataValue.profile_meta);

                let doctorSpeciality = profileMeta.doctorSpeciality ? profileMeta.doctorSpeciality.toLowerCase() : '';

                let doctorName =  dataValue.doctor_name.toLowerCase();
                let doctor_title = dataValue.doctor_title.toLowerCase();

                if (doctorSpeciality.includes(searchQuery) || doctorName.includes(searchQuery) || doctor_title.includes(searchQuery)) {
                    return dataValue;
                }

            });

            this.setState({
                doctorsList: ListOfDoctors,
            })
        }, 50);

        this.setState({
            searchText: searchQuery,
        })

    }

    handleSelectingDoctor = (newDoctor) => {
    

        let oldDoctors = newDoctor;

        this.props.setReferredDoctors([oldDoctors]);
        this.props.ModalExecuter();
        // }
    }

    render() {


        let DoctorsList = this.state.doctorsList && this.state.doctorsList.map((item, key) => {
            
            let baseProfileUri = CONSTANTS.BASE_URL.replace("api", "profiles/");
            let profilePicName = JSON.parse(item.profile_meta).image_uri;
            profilePicName = baseProfileUri + profilePicName;
            return (
                <TouchableHighlight key={key} onPress={() => this.handleSelectingDoctor(item)}>
                    <View style={{
                        flexDirection: 'row',
                        padding: 11,
                        borderBottomWidth: 1,
                        borderBottomColor: '#ddd',
                        backgroundColor: '#FFF'
                    }}>
                        <Image
                            source={{ uri: profilePicName}}
                            style={{ height: 30, width: 30, borderRadius: 20, marginTop: 8 }}
                        />
                        <View style={{
                            flexDirection: 'column',
                            marginLeft: 20
                        }}>
                            <Text>{item.doctor_name.replace("|", " ")}</Text>
                            <Text style={{ color: '#B6B6B6' }}>#{item.doctor_id}, DOB: {new Date(item.timestamp).toLocaleDateString()}</Text>
                        </View>
                        <Feather name="chevron-right" size={24} style={{ color: '#ddd', marginLeft: '25%', marginTop: '4%' }} />

                    </View>
                </TouchableHighlight>
            );
        });

        return (
            <Modal
                animationType={this.props.animationType}
                transparent={false}
                onRequestClose={this.props.ModalExecuter}
                visible={this.props.modalVisible}>
                <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column' }} behavior="height" enabled>
                    <ImageBackground
                        style={{ paddingTop: 22, backgroundColor: "#F7F8F9", paddingTop: -20, height: '100%', width: '100%' }}
                        source={require('../../../assets/doctorRefScreenBgPhoto.jpg')}
                    >

                        <View
                            style={{
                                flexDirection: 'row',
                                // height: '10%',
                                
                                minHeight: 40,
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
                            <TouchableHighlight
                                style={{ width: '10%', marginTop: '3%' }}
                                onPress={this.props.ModalExecuter}
                            >
                                <Feather name="arrow-left" size={24} style={{ color: '#000', marginLeft: 10 }} />
                            </TouchableHighlight>
                            <TextInput
                                style={{
                                    borderRadius: 30,
                                    marginTop: '3%',
                                    width: '80%',
                                    paddingLeft: 15,
                                    paddingTop: 5,
                                    // paddingBottom: 13,
                                    borderBottomColor: '#fff'
                                }}
                                underlineColorAndroid="transparent"
                                multiline={false}
                                placeholder="Search by Name or ID"
                                value={this.state.searchText}
                                onChangeText={(text) => this.searchDoctorsLocally(text)}
                            />
                        </View>
                        <ScrollView style={{flex: .88}}>
                            <View>
                                {DoctorsList}
                            </View>
                        </ScrollView>
                    </ImageBackground>
                </KeyboardAvoidingView>
                
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    
});