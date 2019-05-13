import React from 'react';
import { View, TouchableHighlight, Modal, StyleSheet, Text, ScrollView} from 'react-native';
import CONST from '../../../lib/constants';
import API from '../../../lib/api';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';

import SearchDoctorForReferring from './SearchDoctorForReferring';

export default class ReferDoctorModal extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            searchingDoctorModal: false,
            referredDoctors: [],
        };
        this.API = new API();

    }

    enableDisableSearchingDoctor = () => {
        this.setState({
            searchingDoctorModal: this.state.searchingDoctorModal ? false : true
        })
    }

    setReferredDoctors = (referredDoctors) => {

        this.setState({
            referredDoctors
        });
    }

    deleteReferredDoctor = (id) => {

        let newDoctors = this.state.referredDoctors.filter(v => v.doctor_id !== id);
        this.setState({
            referredDoctors: newDoctors
        });
    };

    completedReferring = () => {
        
        this.props.setReferredDoctors(this.state.referredDoctors);
        this.props.ModalExecuter();
    }

    cancelOpenModal = () => {

        this.setState({ referredDoctors: [] }); 
        this.props.ModalExecuter();
    }

    render(){

        let referredDoctors =  this.state.referredDoctors.map((v, k) => (
            <View style={styles.complainItem} key={k}>
                <Text style={styles.complainItemName}>{this.API.formatUserName(v.doctor_name)}</Text>
                <TouchableHighlight underlayColor="transparent" style={styles.compalainDelBtnWrapper} onPress={() => this.deleteReferredDoctor(v.doctor_id)}>
                    <Entypo name="minus" size={25} style={styles.compalinBtnDel} />
                </TouchableHighlight>
            </View>
        ));

        return(
            <Modal
                animationType={this.props.animationType}
                transparent={false}
                onRequestClose={this.cancelOpenModal}
                visible={this.props.modalVisible}>
                <View style={{ flex: 1}}>
                    <View style={{
                        flex: .1,
                        flexDirection: "row",
                        justifyContent: 'space-between',
                        backgroundColor: CONST.COLORS.THEME_COLOR,
                        paddingTop: 15,
                        paddingBottom: 11,
                        borderBottomWidth: 1,
                        borderBottomColor: '#ccc'
                    }}>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableHighlight underlayColor="transparent" 
                            onPress={this.cancelOpenModal} 
                            style={{ paddingRight: 15, marginLeft: 10, marginTop: 3 }}>
                                <Ionicons name="md-close" size={25} style={{ color: "#FFF", fontWeight: 'bold' }} />
                            </TouchableHighlight>
                            <View>
                                <Text style={{ color: "#FFF", fontSize: 17 }}>Refer</Text>
                                {/* <Text style={{ color: "#DBDBDB", fontSize: 12, fontWeight: '200' }}>Saidul Islam</Text> */}
                            </View>
                        </View>

                        <View style={{ marginRight: 10 }}>
                            <Text style={{ color: "#FFFFFF", fontSize: 10, fontWeight: 'bold', textAlign: 'right' }}>00:12:59</Text>
                            <Text style={{ color: "#DBDBDB", fontWeight: "200", fontSize: 10 }}>time elapsed</Text>
                        </View>
                    </View>
                    <ScrollView style={{ paddingTop: 22, flex: .8, flexDirection: 'column', backgroundColor: "#F7F8F9", paddingTop: -20 }}>
                        
                        <View style={{
                            flex: 0.8,
                            alignSelf: 'center',
                            marginTop: 20,
                            marginLeft: 20

                        }}>
                            <TouchableHighlight
                                onPress={this.enableDisableSearchingDoctor}
                                underlayColor="transparent"
                            >
                                <View 
                                    style={{
                                        alignSelf: 'center', 
                                        borderColor: '#ddd', 
                                        borderTopWidth: 1, 
                                        borderRightWidth: 1, 
                                        backgroundColor: '#FFF',
                                        padding: 7,
                                        width: '95%',
                                        marginRight: 30,
                                        marginBottom: 10
                                    }}
                                >   
                                    <SearchDoctorForReferring 
                                        animationType="fade" 
                                        setReferredDoctors={this.setReferredDoctors} 
                                        getReferredDoctors={this.state.referredDoctors} 
                                        modalVisible={this.state.searchingDoctorModal} 
                                        ModalExecuter={this.enableDisableSearchingDoctor}
                                    />
                                    <Text style={{ color: '#B2B6BE', fontWeight: 'bold', paddingLeft: 10}}>Search by Doctor or ID...</Text>
                                </View>
                            </TouchableHighlight>
                            {referredDoctors}

                            <View>
                                <Text style={{ 
                                    color: "#86888C", 
                                    marginLeft: 5, 
                                    marginRight: 25, 
                                    fontWeight: '200', 
                                    fontSize: 12
                                }}>
                                    You can refer this patient to other doctor or you can skip referring
                                </Text>
                            </View>
                        </View>

                    </ScrollView>
                    <View style={{
                        flex: .1,
                        backgroundColor: '#F7F8F9',
                        width: '100%'
                    }}>
                        <TouchableHighlight underlayColor="transparent" onPress={this.completedReferring} style={{ alignSelf: 'center', backgroundColor: '#00B9FC', width: '70%', padding: 7, borderRadius: 25 }}>
                            <Text style={{textAlign: 'center', color: '#FFF', fontWeight: 'bold' }}>DONE</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>
        );
    }
}

const styles =  StyleSheet.create({
    complainItem: {
        flexDirection: 'row',
        marginBottom: 10
    },
    complainItemName: {
        backgroundColor: "#fff",
        padding: 8,
        width: '85%',
        borderWidth: .3,
        borderColor: '#D1D1D1',
        borderRadius: 1
    },
    compalainDelBtnWrapper: {
        marginLeft: 15,
        marginTop: 5,
    },
    compalinBtnDel: {
        color: '#FFF',
        backgroundColor: "#F62834",
        borderRadius: 40
    }
});