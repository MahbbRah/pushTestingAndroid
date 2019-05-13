import React from 'react';
import { View, TouchableHighlight, Modal, StyleSheet, Text, ScrollView, TextInput } from 'react-native';
import { CheckBox } from 'react-native-elements'
import Ionicons from 'react-native-vector-icons/Ionicons';

import CONST from '../../../lib/constants';

export default class ClinicalExaminationModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            checkedYesIllness: false,
            checkedNoIllness: false,
            childhoodIllness: false,
            childhoodIllnessHistory: null,
            transfusion: false,
            transfusionHistory: null,
            isbloodPressureChecked: false,
            systole: '',
            diastole: '',
            // isBloodSugarChecked: false,
            // sugarInfo: '',
            isTemperatureChecked: false,
            temperatureInfo: '',
            isPulseEnabled: false,
            pulseInfo: '',
            isOxygenSaturationEnabled: false,
            oxygenInfo: '',
            anemia: false,
            Jaundice: false,
            dehydration: false,
        };
        // this.API = new API();
    }

    checkedIllness = () => {
        
        this.setState({
            checkedYesIllness: this.state.checkedYesIllness ? false : true,
            checkedNoIllness: this.state.checkedNoIllness ? false : true,
        })
    }

    setClinicalExamination = () => {
        let isbloodPressureChecked = this.state.isbloodPressureChecked ? { examinationType: 'BP', examData: ` ${this.state.systole}/${this.state.diastole} mm hg`} : ''
        let isTemperatureChecked = this.state.isTemperatureChecked ? { examinationType: 'Temp', examData: this.state.temperatureInfo + ' °F'} : ''
        let isPulseEnabled = this.state.isPulseEnabled ? { examinationType: 'Pulse', examData: ` ${this.state.pulseInfo} b/min`} : ''
        let isOxygenSaturationEnabled = this.state.isOxygenSaturationEnabled ? { examinationType: 'O₂ Sat', examData: ` ${this.state.oxygenInfo} %`} : ''
        let anemia = this.state.anemia ? { examinationType: 'Anemia', examData: ' +' } : ''
        let Jaundice = this.state.Jaundice ? { examinationType: 'Jaundice', examData: ' +' } : ''
        let dehydration = this.state.dehydration ? { examinationType: 'Dehydration', examData: ' +'} : ''

        let data = [
            isbloodPressureChecked, isTemperatureChecked, isPulseEnabled, isOxygenSaturationEnabled, anemia, Jaundice, dehydration
        ];
        data = data.filter(v => v !== '');

        this.props.setClinicalExamination(data);
        this.props.ModalExecuter();
    }

    //Input validation of textboxes
    validateInput = (stateName, Text) => {

        let entryVal = parseInt(Text);

        if (stateName === 'systole' || stateName === 'diastole'){

            if(entryVal > 250) {
                alert('Error: Invalid Entry, The range is: 0-250')
                return;
            }
        }

        if (stateName === 'temperatureInfo') {


            if (entryVal > 110){
                alert('Error: Invalid Entry, The range is: 80-110')
                return;
            }

            //If starts with 1 then open a timeout to check if the value stays less than 80.
            // you can reduce/increase time as needed.
            let timerValue = 2000;
            if (Text.startsWith("1")) {
                clearTimeout(valChecker);
                var valChecker = setTimeout(() => {
                    if (parseInt(this.state.temperatureInfo) < 80) {
                        alert('Error: Invalid Entry, The range is: 80-110');
                        this.setState({
                            temperatureInfo: ''
                        });
                    }
                }, timerValue);
            }
            
            let blockedNumbers = [2, 3, 4, 5, 6, 7, 0];

            if (Text.length === 1 && blockedNumbers.includes(entryVal)) {
                alert('Error: Invalid Entry, The range is: 80-110')
                return;
            }

        }

        if (stateName === 'pulseInfo') {

            if (entryVal > 200) {
                alert('Error: Invalid Entry, The range is: 0-200')
                return;
            }


        }

        if (stateName === 'oxygenInfo') {


            if (entryVal > 100) {
                alert('Error: Invalid Entry, The range is: 20-100')
                return;
            }

            //If starts with 1 then open a timeout to check if the value stays less than 80.
            // you can reduce/increase time as needed.
            let timerValue = 2000;
            if (Text.startsWith("1")) {
                clearTimeout(valChecker);
                var valChecker = setTimeout(() => {
                    let oxygenVal = parseInt(this.state.oxygenInfo);
                    if (oxygenVal !== 100) {
                        alert('Error: Invalid Entry, The range is: 20-100');
                        this.setState({
                            oxygenInfo: ''
                        });
                    }
                }, timerValue);
            } else {
                clearTimeout(valChecker);
                var valChecker = setTimeout(() => {
                    let oxygenVal = parseInt(this.state.oxygenInfo);
                    if (oxygenVal < 20) {
                        alert('Error: Invalid Entry, The range is: 20-100');
                        this.setState({
                            oxygenInfo: ''
                        });
                    }
                }, timerValue);

            }

            // if (Text.length === 1 && entryVal < 2) {
            //     alert('Error: Invalid Entry, The range is: 20-100')
            //     return;
            // }

        }

        if (isNaN(Text)) {
            alert('Error: Invalid Entry, Please try Again')
        } else {
            this.setState({ [stateName]: Text });
        }
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
                                <Text style={{ color: "#FFF", fontSize: 17 }}>Clinical Examination</Text>
                                {/* <Text style={{ color: "#f7f8f9", fontSize: 12, fontWeight: '200' }}>Saidul Islam</Text> */}
                            </View>
                        </View>

                        <View style={{ marginRight: 10 }}>
                            <Text style={{ color: "#FFFFFF", fontSize: 10, fontWeight: 'bold', textAlign: 'right' }}>00:12:59</Text>
                            <Text style={{ color: "#f7f8f9", fontWeight: "200", fontSize: 10 }}>time elapsed</Text>
                        </View>
                    </View>
                    <ScrollView style={{ paddingTop: 22, flex: .8, flexDirection: 'column', backgroundColor: "#F7F8F9", paddingTop: -20 }} keyboardShouldPersistTaps="always">

                        <View style={{
                            marginTop: 13,
                            marginLeft: 20

                        }}>
                            <View style={{
                                flexDirection: 'row'
                            }}>
                                <Text style={{ width: '18%', marginTop: 7, color: '#B3B5C0'}}>Select</Text>
                                <Text style={{width: '82%', borderBottomWidth: 1, borderBottomColor: '#ddd', marginBottom: 25}}>&nbsp;</Text>
                            </View>
                            
                            <View style={{marginBottom: 10}}>
                                <View style={{
                                    flexDirection: 'row',
                                    marginBottom: 8
                                }}>
                                    <CheckBox
                                        title="Blood Pressure"
                                        checkedColor="#00B9FC"
                                        checked={this.state.isbloodPressureChecked}
                                        onPress={() => this.setState({ isbloodPressureChecked: this.state.isbloodPressureChecked ? false : true})}
                                        containerStyle={styles.checkboxStyleSquare}
                                    />
                                </View>
                                {this.state.isbloodPressureChecked && (
                                    <View style={{ flexDirection: 'row', marginTop: 5, marginBottom: 10 }}>
                                        <TextInput
                                            placeholder="Enter Systole"
                                            placeholderTextColor="#b4b7c0"
                                            underlineColorAndroid="transparent"
                                            onChangeText={(Text) => { 
                                                this.validateInput('systole', Text);
                                            }}
                                            value={this.state.systole}
                                            maxLength={4}
                                            keyboardType="numeric"
                                            style={[styles.dualInputBoxCommon, { marginRight: 10, paddingRight: 20, }]}
                                        />
                                        <TextInput
                                            placeholder="Enter Diastole"
                                            placeholderTextColor="#b4b7c0"
                                            underlineColorAndroid="transparent"
                                            onChangeText={(Text) => {
                                                this.validateInput('diastole', Text);
                                            }}
                                            value={this.state.diastole}
                                            maxLength={5}
                                            keyboardType="numeric"
                                            style={[styles.dualInputBoxCommon, { marginRight: 20, }]}
                                        />
                                    </View>
                                )}
                            </View>
                            <View style={{marginBottom: 10}}>
                                <View style={{
                                    flexDirection: 'row',
                                    marginBottom: 8
                                }}>
                                    <CheckBox
                                        title="Temperature"
                                        checkedColor="#00B9FC"
                                        checked={this.state.isTemperatureChecked}
                                        onPress={() => this.setState({ isTemperatureChecked: this.state.isTemperatureChecked ? false : true })}
                                        containerStyle={styles.checkboxStyleSquare}
                                    />
                                </View>
                                {this.state.isTemperatureChecked && (
                                    <View style={{ flexDirection: 'row', marginTop: 5, marginBottom: 10 }}>
                                        <TextInput
                                            placeholder="Enter temperature"
                                            placeholderTextColor="#b4b7c0"
                                            underlineColorAndroid="transparent"
                                            onChangeText={(Text) => {
                                                this.validateInput('temperatureInfo', Text);
                                            }}
                                            value={this.state.temperatureInfo}
                                            maxLength={5}
                                            keyboardType="numeric"
                                            style={styles.singleRowInputBox}
                                        />
                                    </View>
                                )}
                            </View>
                            <View style={{marginBottom: 10}}>
                                <View style={{
                                    flexDirection: 'row',
                                    marginBottom: 8
                                }}>
                                    <CheckBox
                                        title="Pulse Rate"
                                        checkedColor="#00B9FC"
                                        checked={this.state.isPulseEnabled}
                                        onPress={() => this.setState({ isPulseEnabled: this.state.isPulseEnabled ? false : true})}
                                        containerStyle={styles.checkboxStyleSquare}
                                    />
                                </View>
                                {this.state.isPulseEnabled && (
                                    <View style={{ flexDirection: 'row', marginTop: 5, marginBottom: 10 }}>
                                        <TextInput
                                            placeholder="Pulse rate"
                                            placeholderTextColor="#b4b7c0"
                                            underlineColorAndroid="transparent"
                                            onChangeText={(Text) => {
                                                this.validateInput('pulseInfo', Text);
                                            }}
                                            value={this.state.pulseInfo}
                                            maxLength={5}
                                            keyboardType="numeric"
                                            style={styles.singleRowInputBox}
                                        />
                                    </View>
                                )}
                            </View>
                            <View style={{marginBottom: 10}}>
                                <View style={{
                                    flexDirection: 'row',
                                    marginBottom: 8
                                }}>
                                    <CheckBox
                                        title="Oxygen Saturation"
                                        checkedColor="#00B9FC"
                                        checked={this.state.isOxygenSaturationEnabled}
                                        onPress={() => this.setState({ isOxygenSaturationEnabled: this.state.isOxygenSaturationEnabled ? false : true })}
                                        containerStyle={styles.checkboxStyleSquare}
                                    />
                                </View>
                                {this.state.isOxygenSaturationEnabled && (
                                    <View style={{ flexDirection: 'row', marginTop: 5, marginBottom: 10 }}>
                                        <TextInput
                                            placeholder="Enter Oxygen Saturation in %"
                                            placeholderTextColor="#b4b7c0"
                                            underlineColorAndroid="transparent"
                                            onChangeText={(Text) => {
                                                this.validateInput('oxygenInfo', Text);
                                            }}
                                            value={this.state.oxygenInfo}
                                            maxLength={3}
                                            keyboardType="numeric"
                                            style={styles.singleRowInputBox}
                                        />
                                    </View>
                                )}
                            </View>
                            <View style={{
                                flexDirection: 'row'
                            }}>
                                <Text style={{ width: '18%', marginTop: 7, color: '#B3B5C0' }}>Select</Text>
                                <Text style={{ width: '82%', borderBottomWidth: 1, borderBottomColor: '#ddd', marginBottom: 25 }}>&nbsp;</Text>
                            </View>

                            <View style={{
                                flexDirection: 'row',
                            }}>
                                <CheckBox
                                    title="Anemia"
                                    checkedColor="#00B9FC"
                                    checked={this.state.anemia}
                                    onPress={() => this.setState({ anemia: this.state.anemia ? false : true})}
                                    containerStyle={styles.checkboxStyleSquare}
                                />
                                <CheckBox
                                    title="Jaundice"
                                    checkedColor="#00B9FC"
                                    checked={this.state.Jaundice}
                                    onPress={() => this.setState({ Jaundice: this.state.Jaundice ? false : true })}
                                    containerStyle={styles.checkboxStyleSquare}
                                />

                            </View>
                            <View style={{
                                flexDirection: 'row',
                                marginTop: 15
                            }}>
                                <CheckBox
                                    title="Dehydration"
                                    checkedColor="#00B9FC"
                                    checked={this.state.dehydration}
                                    onPress={() => this.setState({ dehydration: this.state.dehydration ? false : true })}
                                    containerStyle={styles.checkboxStyleSquare}
                                />

                            </View>

                        </View>

                        <View style={{
                            backgroundColor: '#F7F8F9',
                            width: '100%',
                            marginBottom: 30,
                            marginTop: 20
                        }}>
                            <TouchableHighlight underlayColor="transparent" onPress={this.setClinicalExamination} style={{ alignSelf: 'center', backgroundColor: '#00B9FC', width: '70%', padding: 7, borderRadius: 25 }}>
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
        backgroundColor: '#fff',
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
    singleRowInputBox: {
        paddingTop: 10,
        paddingBottom: 10,
        borderWidth: .7,
        borderColor: '#ddd',
        borderRadius: 5,
        paddingLeft: 15,
        paddingRight: 20,
        marginRight: 20,
        backgroundColor: '#FFF',
        flex: 1
    },
    dualInputBoxCommon: {
        paddingTop: 10,
        paddingBottom: 10,
        borderWidth: .7,
        flex: .5,
        borderColor: '#ddd',
        borderRadius: 5,
        paddingLeft: 15,
        backgroundColor: '#FFF',
    },
});