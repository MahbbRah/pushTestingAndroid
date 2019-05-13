import React from 'react';
import { View, TouchableHighlight, Modal, StyleSheet, Text, ScrollView, TextInput } from 'react-native';
import { CheckBox } from 'react-native-elements'

import Ionicons from 'react-native-vector-icons/Ionicons';

import CONST from '../../../lib/constants';

let initialState = {
    checkedYesChildHoodIllness: true,
    checkedNoChildHoodIllness: false,
    childhoodIllnessHistory: '',
    transfusionYes: false,
    transfusionNo: true,
    adultHoodIllnessNo: true,
    adultHoodIllnessYes: false,
    adultHoodIllnessHistory: '',
    accidentInjuriesYes: false,
    accidentInjuriesNo: true,
    accidentInjuriesHistory: '',
    transfusionHistory: '',
    hospitalisationsYes: false,
    hospitalisationsNo: true,
    hospitalisationsHistory: '',
    operationsOrInterventionYes: false,
    operationsOrInterventionNo: true,
    operationsOrInterventionHistory: '',
    psychiatricIllnessNo: true,
    psychiatricIllnessYes: false,
    psychiatricIllnessHistory: '',
    otherHistoryYes: false,
    otherHistoryNo: true,
    otherHistoryInfo: '',
    DM: false,
    HTN: false,
    stroke: false,
    IHD: false,
    arthritis: false,
    asthma: false,
    allergies: false,
    epilepsy: false,
    dyslipidaemia: false,
    others: false,
    additionalHistory: ''
}

export default class MedicalHistoryModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = initialState;
        // this.API = new API();
    }

    componentWillReceiveProps() {

        //Check to see if there is pre existing illness already if then map through and add the existing ones with the list to make visible
        if (this.props.getMedicalHistory.length > 0) {
            
            // doing jsonify for deep copy!
            let preFormedMedicalHistory =  JSON.parse(JSON.stringify(initialState));

            this.props.getMedicalHistory.filter((history, historyKey) => {

                switch (history.historyName) {
                    case 'Childhood Illness':
                        preFormedMedicalHistory.checkedYesChildHoodIllness = true;
                        preFormedMedicalHistory.checkedNoChildHoodIllness = false;
                        preFormedMedicalHistory.childhoodIllnessHistory = history.history
                        break;
                
                    case 'Transfusion':
                        preFormedMedicalHistory.transfusionYes = true;
                        preFormedMedicalHistory.transfusionNo = false;
                        preFormedMedicalHistory.transfusionHistory = history.history
                        break;
                
                    case 'Adulthood Illness':
                        preFormedMedicalHistory.adultHoodIllnessYes = true;
                        preFormedMedicalHistory.adultHoodIllnessNo = false;
                        preFormedMedicalHistory.adultHoodIllnessHistory = history.history
                        break;
                
                    case 'Accident/Injuries':
                        preFormedMedicalHistory.accidentInjuriesYes = true;
                        preFormedMedicalHistory.accidentInjuriesNo = false;
                        preFormedMedicalHistory.accidentInjuriesHistory = history.history
                        break;
                
                    case 'Hospitalisations':
                        preFormedMedicalHistory.hospitalisationsYes = true;
                        preFormedMedicalHistory.hospitalisationsNo = false;
                        preFormedMedicalHistory.hospitalisationsHistory = history.history
                        break;
                    case 'Operations/Intervention':
                        preFormedMedicalHistory.operationsOrInterventionYes = true;
                        preFormedMedicalHistory.operationsOrInterventionNo = false;
                        preFormedMedicalHistory.operationsOrInterventionHistory = history.history
                        break;
                
                    case 'Psychiatric illness':
                        preFormedMedicalHistory.psychiatricIllnessYes = true;
                        preFormedMedicalHistory.psychiatricIllnessNo = false;
                        preFormedMedicalHistory.psychiatricIllnessHistory = history.history
                        break;
                
                    case 'Additional':
                        preFormedMedicalHistory.additionalHistory = history.history
                        break;
                
                    case 'HTN':
                        preFormedMedicalHistory.HTN = true;
                        break;
                
                    case 'DM':
                        preFormedMedicalHistory.DM = true;
                        break;
                
                    case 'DM':
                        preFormedMedicalHistory.DM = true;
                        break;
                
                    case 'Stroke':
                        preFormedMedicalHistory.stroke = true;
                        break;
                
                    case 'Stroke':
                        preFormedMedicalHistory.stroke = true;
                        break;
                
                    case 'IHD':
                        preFormedMedicalHistory.IHD = true;
                        break;
                    case 'IHD':
                        preFormedMedicalHistory.IHD = true;
                        break;
                
                    case 'Arthritis':
                        preFormedMedicalHistory.arthritis = true;
                        break;
                
                    case 'Arthritis':
                        preFormedMedicalHistory.arthritis = true;
                        break;
                
                    case 'Asthma':
                        preFormedMedicalHistory.asthma = true;
                        break;
                
                    case 'Allergies':
                        preFormedMedicalHistory.allergies = true;
                        break;
                
                    case 'Epilepsy':
                        preFormedMedicalHistory.epilepsy = true;
                        break;
                
                    case 'Epilepsy':
                        preFormedMedicalHistory.epilepsy = true;
                        break;
                
                    case 'Dyslipidaemia':
                        preFormedMedicalHistory.dyslipidaemia = true;
                        break;
                
                    case 'Others':
                        preFormedMedicalHistory.others = true;
                        break;
                
                    case 'Others':
                        preFormedMedicalHistory.others = true;
                        break;
                
                    default:
                        break;
                }

            });

            this.setState(preFormedMedicalHistory);
        }
    }

    checkedIllness = () => {
        
        this.setState({
            checkedYesIllness: this.state.checkedYesIllness ? false : true,
            checkedNoIllness: this.state.checkedNoIllness ? false : true,
        })
    }

    handleChildHoodCheckBox = () => {

        this.setState({
            checkedNoChildHoodIllness: this.state.checkedNoChildHoodIllness ? false : true,
            checkedYesChildHoodIllness: this.state.checkedYesChildHoodIllness ? false : true,
        })
    }
    handleTransfusionCheckbox = () => {

        this.setState({
            transfusionYes: this.state.transfusionYes ? false : true,
            transfusionNo: this.state.transfusionNo ? false : true,
        })
    }
    handleAdultHoodCheckBox = () => {

        this.setState({
            adultHoodIllnessYes: this.state.adultHoodIllnessYes ? false : true,
            adultHoodIllnessNo: this.state.adultHoodIllnessNo ? false : true,
        })
    }
    handleAccidentInjuriesCheckBox = () => {

        this.setState({
            accidentInjuriesYes: this.state.accidentInjuriesYes ? false : true,
            accidentInjuriesNo: this.state.accidentInjuriesNo ? false : true,
        })
    }
    handleHospitalisations = () => {

        this.setState({
            hospitalisationsYes: this.state.hospitalisationsYes ? false : true,
            hospitalisationsNo: this.state.hospitalisationsNo ? false : true,
        })
    }

    handleOperationsOrInterventations = () => {

        this.setState({
            operationsOrInterventionYes: this.state.operationsOrInterventionYes ? false : true,
            operationsOrInterventionNo: this.state.operationsOrInterventionNo ? false : true,
        })
    }
    handlePsychiatricIllness = () => {

        this.setState({
            psychiatricIllnessNo: this.state.psychiatricIllnessNo ? false : true,
            psychiatricIllnessYes: this.state.psychiatricIllnessYes ? false : true,
        })
    }
    handleOtherHistory = () => {

        this.setState({
            otherHistoryNo: this.state.otherHistoryNo ? false : true,
            otherHistoryYes: this.state.otherHistoryYes ? false : true,
        })
    }

    handleDoneBtn = () => {
        let medicalHistories = [];

        this.state.checkedYesChildHoodIllness ? medicalHistories.push({ historyName: 'Childhood Illness', history: this.state.childhoodIllnessHistory}) : '';
        this.state.transfusionYes ? medicalHistories.push({ historyName: 'Transfusion', history: this.state.transfusionHistory}) : '';
        this.state.adultHoodIllnessYes ? medicalHistories.push({historyName: 'Adulthood Illness', history: this.state.adultHoodIllnessHistory}) : '';
        this.state.accidentInjuriesYes ? medicalHistories.push({ historyName: 'Accident/Injuries', history: this.state.accidentInjuriesHistory}) : '';
        this.state.hospitalisationsYes ? medicalHistories.push({ historyName: 'Hospitalisations', history: this.state.hospitalisationsHistory}) : '';
        this.state.operationsOrInterventionYes ? medicalHistories.push({ historyName: 'Operations/Intervention', history: this.state.operationsOrInterventionHistory}) : '';
        this.state.psychiatricIllnessYes ? medicalHistories.push({ historyName: 'Psychiatric illness', history: this.state.psychiatricIllnessHistory}) : '';
        this.state.HTN ? medicalHistories.push({ historyName: 'HTN', history: ''}) : '';
        this.state.DM ? medicalHistories.push({ historyName: 'DM', history: ''}) : '';
        this.state.stroke ? medicalHistories.push({ historyName: 'Stroke', history: ''}) : '';
        this.state.IHD ? medicalHistories.push({ historyName: 'IHD', history: ''}) : '';
        this.state.arthritis ? medicalHistories.push({ historyName: 'Arthritis', history: ''}) : '';
        this.state.asthma ? medicalHistories.push({ historyName: 'Asthma', history: ''}) : '';
        this.state.allergies ? medicalHistories.push({ historyName: 'Allergies', history: ''}) : '';
        this.state.epilepsy ? medicalHistories.push({ historyName: 'Epilepsy', history: ''}) : '';
        this.state.dyslipidaemia ? medicalHistories.push({ historyName: 'Dyslipidaemia', history: ''}) : '';
        this.state.others ? medicalHistories.push({ historyName: 'Others', history: ''}) : '';
        this.state.additionalHistory ? medicalHistories.push({ historyName: 'Additional', history: this.state.additionalHistory}) : '';

        this.props.setMedicalHistory(medicalHistories);

        this.props.ModalExecuter();

    }

    render() {

        return (
            <Modal
                animationType={this.props.animationType}
                transparent={false}
                onRequestClose={this.props.ModalExecuter}
                visible={this.props.modalVisible}>
                <View style={{ flex: 1 }}>
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
                            <TouchableHighlight underlayColor="transparent" onPress={this.props.ModalExecuter} style={{ paddingRight: 15, marginLeft: 10, marginTop: 3 }}>
                                <Ionicons name="md-close" size={25} style={{ color: "#FFF", fontWeight: 'bold' }} />
                            </TouchableHighlight>
                            <View>
                                <Text style={{ color: "#FFF", fontSize: 17 }}>Medical History</Text>
                            </View>
                        </View>

                        <View style={{ marginRight: 10 }}>
                            <Text style={{ color: "#FFFFFF", fontSize: 10, fontWeight: 'bold', textAlign: 'right' }}>00:12:59</Text>
                            <Text style={{ color: "#DBDBDB", fontWeight: "200", fontSize: 10 }}>time elapsed</Text>
                        </View>
                    </View>
                    <ScrollView style={{ paddingTop: 22, flex: .8, flexDirection: 'column', backgroundColor: "#F7F8F9", paddingTop: -20 }}>

                        <View style={{
                            marginTop: 20,
                            marginLeft: 20

                        }}>
                            <View style={{
                                flexDirection: 'row'
                            }}>
                                <Text style={{ width: '18%', marginTop: 7, color: '#B3B5C0'}}>Select</Text>
                                <Text style={{width: '82%', borderBottomWidth: 1, borderBottomColor: '#ddd', marginBottom: 40}}>&nbsp;</Text>
                            </View>
                            
                            <View style={{
                                flexDirection: 'row',
                                marginBottom: 8
                            }}>
                                <Text style={styles.checkBoxTextStyle}>Childhood Illness</Text>
                                <CheckBox
                                    title="Yes"
                                    checkedColor="#00B9FC"
                                    checkedIcon='dot-circle-o'
                                    uncheckedIcon='circle-o'
                                    onPress={this.handleChildHoodCheckBox}
                                    checked={this.state.checkedYesChildHoodIllness}
                                    containerStyle={styles.checkboxStyle}
                                />
                                <CheckBox
                                    title="No"
                                    checkedColor="#00B9FC"
                                    checkedIcon='dot-circle-o'
                                    uncheckedIcon='circle-o'
                                    onPress={this.handleChildHoodCheckBox}
                                    checked={this.state.checkedNoChildHoodIllness}
                                    containerStyle={styles.checkboxStyle}
                                />
                            </View>
                            {this.state.checkedYesChildHoodIllness && (
                                <View style={{
                                    width: '90%',
                                    marginBottom: 15
                                }}>
                                    <TextInput
                                        placeholder="Write History"
                                        onChangeText={(Text) => this.setState({ childhoodIllnessHistory: Text })}
                                        value={this.state.childhoodIllnessHistory}
                                        underlineColorAndroid="transparent"
                                        multiline={true}
                                        style={styles.inputFieldStyle}

                                    />
                                </View>
                            )}
                            <View style={{
                                flexDirection: 'row',
                                marginBottom: 8
                            }}>
                                <Text style={styles.checkBoxTextStyle}>Transfusion </Text>
                                <CheckBox
                                    title="Yes"
                                    checkedColor="#00B9FC"
                                    checkedIcon='dot-circle-o'
                                    uncheckedIcon='circle-o'
                                    onPress={this.handleTransfusionCheckbox}
                                    checked={this.state.transfusionYes}
                                    containerStyle={styles.checkboxStyle}
                                />
                                <CheckBox
                                    title="No"
                                    checkedColor="#00B9FC"
                                    checkedIcon='dot-circle-o'
                                    uncheckedIcon='circle-o'
                                    onPress={this.handleTransfusionCheckbox}
                                    checked={this.state.transfusionNo}
                                    containerStyle={styles.checkboxStyle}
                                />
                            </View>
                            { this.state.transfusionYes && (
                                <View style={{
                                    width: '90%',
                                    marginTop: 15,
                                    marginBottom: 12
                                }}>
                                    <TextInput
                                        placeholder="Write History"
                                        onChangeText={(Text) => this.setState({ transfusionHistory: Text })}
                                        value={this.state.transfusionHistory}
                                        underlineColorAndroid="transparent"
                                        multiline={true}
                                        style={styles.inputFieldStyle}

                                    />
                                </View>
                            )}
                            <View style={{
                                flexDirection: 'row',
                                marginBottom: 8
                            }}>
                                <Text style={styles.checkBoxTextStyle}>Adulthood Illness </Text>
                                <CheckBox
                                    title="Yes"
                                    checkedColor="#00B9FC"
                                    checkedIcon='dot-circle-o'
                                    uncheckedIcon='circle-o'
                                    onPress={this.handleAdultHoodCheckBox}
                                    checked={this.state.adultHoodIllnessYes}
                                    containerStyle={styles.checkboxStyle}
                                />
                                <CheckBox
                                    title="No"
                                    checkedColor="#00B9FC"
                                    checkedIcon='dot-circle-o'
                                    uncheckedIcon='circle-o'
                                    onPress={this.handleAdultHoodCheckBox}
                                    checked={this.state.adultHoodIllnessNo}
                                    containerStyle={styles.checkboxStyle}
                                />
                            </View>
                            {this.state.adultHoodIllnessYes && (
                                <View style={{
                                    width: '90%',
                                    marginTop: 15,
                                    marginBottom: 12
                                }}>
                                    <TextInput
                                        placeholder="Write History"
                                        onChangeText={(Text) => this.setState({ adultHoodIllnessHistory: Text })}
                                        value={this.state.adultHoodIllnessHistory}
                                        underlineColorAndroid="transparent"
                                        multiline={true}
                                        style={styles.inputFieldStyle}

                                    />
                                </View>
                            )}
                            <View style={{
                                flexDirection: 'row',
                                marginBottom: 8
                            }}>
                                <Text style={styles.checkBoxTextStyle}>Accident/Injuries </Text>
                                <CheckBox
                                    title="Yes"
                                    checkedColor="#00B9FC"
                                    checkedIcon='dot-circle-o'
                                    uncheckedIcon='circle-o'
                                    onPress={this.handleAccidentInjuriesCheckBox}
                                    checked={this.state.accidentInjuriesYes}
                                    containerStyle={styles.checkboxStyle}
                                />
                                <CheckBox
                                    title="No"
                                    checkedColor="#00B9FC"
                                    checkedIcon='dot-circle-o'
                                    uncheckedIcon='circle-o'
                                    onPress={this.handleAccidentInjuriesCheckBox}
                                    checked={this.state.accidentInjuriesNo}
                                    containerStyle={styles.checkboxStyle}
                                />
                            </View>
                            {this.state.accidentInjuriesYes && (
                                <View style={{
                                    width: '90%',
                                    marginTop: 15,
                                    marginBottom: 12
                                }}>
                                    <TextInput
                                        placeholder="Write History"
                                        onChangeText={(Text) => this.setState({ accidentInjuriesHistory: Text })}
                                        value={this.state.accidentInjuriesHistory}
                                        underlineColorAndroid="transparent"
                                        multiline={true}
                                        style={styles.inputFieldStyle}

                                    />
                                </View>
                            )}
                            <View style={{
                                flexDirection: 'row',
                                marginBottom: 8
                            }}>
                                <Text style={styles.checkBoxTextStyle}>Hospitalisations</Text>
                                <CheckBox
                                    title="Yes"
                                    checkedColor="#00B9FC"
                                    checkedIcon='dot-circle-o'
                                    uncheckedIcon='circle-o'
                                    onPress={this.handleHospitalisations}
                                    checked={this.state.hospitalisationsYes}
                                    containerStyle={styles.checkboxStyle}
                                />
                                <CheckBox
                                    title="No"
                                    checkedColor="#00B9FC"
                                    checkedIcon='dot-circle-o'
                                    uncheckedIcon='circle-o'
                                    onPress={this.handleHospitalisations}
                                    checked={this.state.hospitalisationsNo}
                                    containerStyle={styles.checkboxStyle}
                                />
                            </View>
                            {this.state.hospitalisationsYes && (
                                <View style={{
                                    width: '90%',
                                    marginTop: 15,
                                    marginBottom: 12
                                }}>
                                    <TextInput
                                        placeholder="Write History"
                                        onChangeText={(Text) => this.setState({ hospitalisationsHistory: Text })}
                                        value={this.state.hospitalisationsHistory}
                                        underlineColorAndroid="transparent"
                                        multiline={true}
                                        style={styles.inputFieldStyle}

                                    />
                                </View>
                            )}
                            <View style={{
                                flexDirection: 'row',
                                marginBottom: 8
                            }}>
                                <Text style={styles.checkBoxTextStyle}>Operations/Intervention</Text>
                                <CheckBox
                                    title="Yes"
                                    checkedColor="#00B9FC"
                                    checkedIcon='dot-circle-o'
                                    uncheckedIcon='circle-o'
                                    onPress={this.handleOperationsOrInterventations}
                                    checked={this.state.operationsOrInterventionYes}
                                    containerStyle={styles.checkboxStyle}
                                />
                                <CheckBox
                                    title="No"
                                    checkedColor="#00B9FC"
                                    checkedIcon='dot-circle-o'
                                    uncheckedIcon='circle-o'
                                    onPress={this.handleOperationsOrInterventations}
                                    checked={this.state.operationsOrInterventionNo}
                                    containerStyle={styles.checkboxStyle}
                                />
                            </View>
                            {this.state.operationsOrInterventionYes && (
                                <View style={{
                                    width: '90%',
                                    marginTop: 15,
                                    marginBottom: 12
                                }}>
                                    <TextInput
                                        placeholder="Write History"
                                        onChangeText={(Text) => this.setState({ operationsOrInterventionHistory: Text })}
                                        value={this.state.operationsOrInterventionHistory}
                                        underlineColorAndroid="transparent"
                                        multiline={true}
                                        style={styles.inputFieldStyle}

                                    />
                                </View>
                            )}
                            <View style={{
                                flexDirection: 'row',
                                marginBottom: 8
                            }}>
                                <Text style={styles.checkBoxTextStyle}>Psychiatric Illness</Text>
                                <CheckBox
                                    title="Yes"
                                    checkedColor="#00B9FC"
                                    checkedIcon='dot-circle-o'
                                    uncheckedIcon='circle-o'
                                    onPress={this.handlePsychiatricIllness}
                                    checked={this.state.psychiatricIllnessYes}
                                    containerStyle={styles.checkboxStyle}
                                />
                                <CheckBox
                                    title="No"
                                    checkedColor="#00B9FC"
                                    checkedIcon='dot-circle-o'
                                    uncheckedIcon='circle-o'
                                    onPress={this.handlePsychiatricIllness}
                                    checked={this.state.psychiatricIllnessNo}
                                    containerStyle={styles.checkboxStyle}
                                />
                            </View>
                            {this.state.psychiatricIllnessYes && (
                                <View style={{
                                    width: '90%',
                                    marginTop: 15,
                                    marginBottom: 12
                                }}>
                                    <TextInput
                                        placeholder="Write History"
                                        onChangeText={(Text) => this.setState({ psychiatricIllnessHistory: Text })}
                                        value={this.state.psychiatricIllnessHistory}
                                        underlineColorAndroid="transparent"
                                        multiline={true}
                                        style={styles.inputFieldStyle}

                                    />
                                </View>
                            )}
                            
                            
                        </View>

                        <View style={{
                            marginTop: 20,
                            marginLeft: 20

                        }}>
                            <View style={{
                                flexDirection: 'row'
                            }}>
                                <Text style={{ marginTop: 7, color: '#B3B5C0' }}>Family History</Text>
                            </View>

                            <View style={{
                                flexDirection: 'row',
                                marginTop: 15
                            }}>
                                <CheckBox
                                    title="HTN"
                                    checkedColor="#00B9FC"
                                    onPress={() => this.setState({ HTN: this.state.HTN ? false : true })}
                                    checked={this.state.HTN}
                                    containerStyle={styles.checkboxStyleSquare}
                                />
                                <CheckBox
                                    title="DM"
                                    checkedColor="#00B9FC"
                                    onPress={() => this.setState({ DM: this.state.DM ? false : true })}
                                    checked={this.state.DM}
                                    containerStyle={styles.checkboxStyleSquare}
                                />
                                <CheckBox
                                    title="Stroke"
                                    checkedColor="#00B9FC"
                                    onPress={() => this.setState({ stroke: this.state.stroke ? false : true })}
                                    checked={this.state.stroke}
                                    containerStyle={styles.checkboxStyleSquare}
                                />
                                <CheckBox
                                    title="IHD"
                                    checkedColor="#00B9FC"
                                    onPress={() => this.setState({ IHD: this.state.IHD ? false : true })}
                                    checked={this.state.IHD}
                                    containerStyle={styles.checkboxStyleSquare}
                                />
                                
                            </View>
                            <View style={{
                                flexDirection: 'row',
                                marginTop: 15
                            }}>
                                <CheckBox
                                    title="Arthritis"
                                    checkedColor="#00B9FC"
                                    onPress={() => this.setState({ arthritis: this.state.arthritis ? false : true})}
                                    checked={this.state.arthritis}
                                    containerStyle={styles.checkboxStyleSquare}
                                />
                                <CheckBox
                                    title="Asthma"
                                    checkedColor="#00B9FC"
                                    onPress={() => this.setState({ asthma: this.state.asthma ? false : true})}
                                    checked={this.state.asthma}
                                    containerStyle={styles.checkboxStyleSquare}
                                />
                                <CheckBox
                                    title="Allergies"
                                    checkedColor="#00B9FC"
                                    onPress={() => this.setState({ allergies: this.state.allergies ? false : true })}
                                    checked={this.state.allergies}
                                    containerStyle={styles.checkboxStyleSquare}
                                />
                            </View>
                            <View style={{
                                flexDirection: 'row',
                                marginTop: 15
                            }}>
                                <CheckBox
                                    title="Epilepsy"
                                    checkedColor="#00B9FC"
                                    onPress={() => this.setState({ epilepsy: this.state.epilepsy ? false : true })}
                                    checked={this.state.epilepsy}
                                    containerStyle={styles.checkboxStyleSquare}
                                />
                                
                                <CheckBox
                                    title="Others"
                                    checkedColor="#00B9FC"
                                    onPress={() => this.setState({ others: this.state.others ? false : true })}
                                    checked={this.state.others}
                                    containerStyle={styles.checkboxStyleSquare}
                                />
                                

                            </View>

                        </View>
                        <View style={{
                            marginTop: 20,
                            marginLeft: 20

                        }}>
                            <View style={{
                                flexDirection: 'row'
                            }}>
                                <Text style={{ marginTop: 7, color: '#B3B5C0' }}>Additional History</Text>
                            </View>

                            <View style={{
                                width: '90%',
                                marginTop: 15
                            }}>
                                <TextInput
                                    placeholder="Write History"
                                    onChangeText={(Text) => this.setState({ additionalHistory: Text })}
                                    value={this.state.additionalHistory}
                                    underlineColorAndroid="transparent"
                                    multiline={true}
                                    style={styles.inputFieldStyle}

                                />
                            </View>

                        </View>

                        <View style={{
                            backgroundColor: '#F7F8F9',
                            width: '100%',
                            marginBottom: 30,
                            marginTop: 20
                        }}>
                            <TouchableHighlight style={styles.doneBtn} onPress={this.handleDoneBtn}>
                                <Text style={{ textAlign: 'center', color: '#FFF', fontWeight: 'bold' }}>DONE</Text>
                            </TouchableHighlight>
                        </View>
                    </ScrollView>
                    
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    checkboxStyle: {
        borderWidth: 0,
        backgroundColor: '#F7F8F9',
        padding: 0,
        marginTop: 0,
        width: '17%'
    },
    checkboxStyleSquare: {
        borderWidth: 0,
        backgroundColor: '#F7F8F9',
        padding: 0,
        marginTop: 0,
        marginRight: -7
    },
    inputFieldStyle: {
        backgroundColor: '#FFF',
        borderBottomColor: '#ddd',
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        borderLeftColor: '#DDD',
        borderRightColor: '#DDD',
        borderRightWidth: 1,
        padding: 12
    },
    checkBoxTextStyle: {
        fontWeight: '300', 
        width: '40%'
    },
    doneBtn: { 
        alignSelf: 'center', 
        backgroundColor: '#00B9FC', 
        width: '70%', 
        padding: 7, 
        borderRadius: 25
    }
});