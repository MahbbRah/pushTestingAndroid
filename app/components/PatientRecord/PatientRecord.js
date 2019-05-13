import React from 'react';
import { View, TouchableHighlight, StyleSheet, Text, Image } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import API from '../../lib/api';
import CONSTANTS from '../../lib/constants';


export default class PatientRecord extends React.Component {

    constructor(props) {
        super(props);

        this.currentState = this.props.navigation.state.params.state;
        this.state = {
            openSetSchedule: false,
            patientInformation: this.currentState
        };

        this.API = new API();

    }

    handleSetSchedule = () => {
        this.setState({
            openSetSchedule: this.state.openSetSchedule ? false : true
        })
    }

    render() {

        let { age, gender, patientID, patientName, registeredDate, profilePicUri } = this.state.patientInformation.patientInformation;
        profilePicUri = !profilePicUri.includes("undefined") ? { uri: CONSTANTS.PROFILE_PIC_BASE + profilePicUri } : require('../../assets/doctor.jpg');

        return (
            <View style={{
                flex: 1,
            }}>
                <View style={{
                    flex: .42,
                    marginTop: 12,
                    marginLeft: 20,
                    marginRight: 20,
                }}>
                    {this.state.patientInformation && (
                        <View style={styles.headerBox}>
                            <Image source={profilePicUri} style={{
                                width: 50,
                                height: 50,
                                borderRadius: 25,
                                marginBottom: 7,
                            }} />
                            <Text style={{ fontWeight: '400', color: '#000', marginBottom: 5 }}>{this.API.formatUserName(patientName)}</Text>
                            <Text style={{ fontWeight: '200', color: '#91949B', fontSize: 10, marginBottom: 5 }}>Member since: {new Date(registeredDate).toDateString()}</Text>

                            <View style={{ flexDirection: 'row', marginTop: 15, marginBottom: 5 }}>
                                <View style={{ flex: .33, flexDirection: 'column', paddingLeft: 15 }}>
                                    <Text style={{ fontWeight: '400', color: '#000', fontSize: 9  }}> {age} </Text>
                                    <Text style={{ color: '#91949B', fontSize: 11, fontWeight: '300' }}>Age</Text>
                                </View>
                                <View style={{ flex: .33, flexDirection: 'column', paddingLeft: 15 }}>
                                    <Text style={{ fontWeight: '400', color: '#000', fontSize: 9  }}>{gender}</Text>
                                    <Text style={{ color: '#91949B', fontSize: 11, fontWeight: '300' }}> Gender </Text>
                                </View>
                                <View style={{ flex: .34, flexDirection: 'column', paddingLeft: 15, marginTop: -8 }}>
                                    <Text style={{ fontWeight: '400', color: '#000', fontSize: 9 }}> {patientID} </Text>
                                    <Text style={{ color: '#91949B', fontSize: 9, fontWeight: '300', textAlign: 'center' }}> ID </Text>
                                </View>
                            </View>
                        </View>
                    )}
                </View>
                <View style={{
                    flex: .3,
                    marginTop: 10,
                    marginLeft: 20,
                    marginRight: 20,
                }}>
                    <View style={{ flex: 1, flexDirection: 'row'}}>
                        <TouchableHighlight style={[styles.bottomItem, { marginRight: 5 }]} underlayColor="transparent" onPress={ () => 
                            this.props.navigation.navigate('TreatmentRecords', { patientInformation: this.state.patientInformation.patientInformation})}>
                            <View style={{ 
                                alignItems: 'center',
                                marginTop: 12
                            }}>
                                <FontAwesome name="shopping-basket" size={30} style={[styles.commonIconColor, { color: '#00B9FC', backgroundColor: '#E1F5FF'}]} />
                                <Text style={{ color: '#91949B', fontSize: 13, marginTop: 15}}>Treatment Record</Text>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight style={styles.bottomItem} underlayColor="transparent" onPress={() => 
                            this.props.navigation.navigate('PresExistingIllnessHistory', { patientID })}>
                            <View style={{
                                alignItems: 'center',
                                marginTop: 12
                            }}>
                                <MaterialCommunityIcons name="clipboard-plus" size={30} style={[styles.commonIconColor, { color: '#0047F7', backgroundColor: '#E1E4FD'}]} />
                                <Text style={styles.bottomItemText}>Pre Existing Illness</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                </View>
                <View style={{
                    flex: .3,
                    marginTop: 10,
                    marginLeft: 20,
                    marginRight: 20,
                    marginBottom: 10,
                }}>
                    <View style={{ flex: 1, flexDirection: 'row'}}>
                        <TouchableHighlight style={[styles.bottomItem, { marginRight: 5 }]} underlayColor="transparent" onPress={() => 
                            this.props.navigation.navigate('MedicalHistories', { patientID })}>
                            <View style={{ 
                                alignItems: 'center',
                                marginTop: 12
                            }}>
                                <MaterialIcons name="restore" size={30} style={[styles.commonIconColor ,{ color: '#00C367', backgroundColor: '#DDF7E9'}]} />
                                <Text style={styles.bottomItemText}>Medical History</Text>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight style={styles.bottomItem} underlayColor="transparent" onPress={() => 
                            this.props.navigation.navigate('LabInvestigationReports', { patientID })}>
                            <View style={{
                                alignItems: 'center',
                                marginTop: 12
                            }}>
                                <MaterialCommunityIcons name="view-list" size={30} style={[styles.commonIconColor, { color: '#5FAD38', backgroundColor: '#E8F3E0'}]} />
                                <Text style={styles.bottomItemText}>Lab Investigation {'\n'} Record</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    headerBox: {
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#fff',
        elevation: 2,
        backgroundColor: '#FFF',
        borderRadius: 3,
        paddingLeft: 40,
        paddingRight: 40,
        paddingTop: 20,
        paddingBottom: 20,
    },
    availableMoneySection: {
        flex: 1,
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#fff',
        paddingTop: 8,
        borderRadius: 3,
        paddingBottom: 8,
        elevation: 2,
        backgroundColor: '#FFF',
    },
    bottomItem: { 
        flex: .5, 
        backgroundColor: '#FFF', 
        borderRadius: 3, 
        borderColor: '#FFF', 
        borderWidth: 1, 
        elevation: 2, 
        // marginRight: 5,
     },
     commonIconColor: {
         padding: 12, 
         borderRadius: 50, 
         marginTop: 10
     },
    bottomItemText: { 
        color: '#91949B', 
        textAlign: 'center',
        fontSize: 13, 
        marginTop: 15
    }
});
