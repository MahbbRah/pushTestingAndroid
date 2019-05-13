import React from 'react';
import { View, TouchableHighlight, Modal, StyleSheet, Text, ScrollView } from 'react-native';
import { CheckBox } from 'react-native-elements'

import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';

import CONST from '../../../lib/constants';
import PresExistingIllnessSubModal from './PresExistingIllnessSubModal';
import PrescriptionEntries from '../../../lib/test_prescription_data.json';

import API from '../../../lib/api';

export default class PresExistingIllnessModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            preExistingIllness: false,
            currentTest: '',
            tests: returnPrescriptionListAsObject('Pre Existing Illness'),
        };
        this.API = new API();
    }

    async componentDidMount() {
        let getOtherData = await this.API._retrieveData('Pre Existing Illness_key');
        if(getOtherData) {
            
            getOtherData = JSON.parse(getOtherData);
            this.setState({
                otherItems: getOtherData
            });

        }
    }

    componentWillReceiveProps() {

        //Check to see if there is pre existing illness already if then map through and add the existing ones with the list to make visible
        if (this.props.getPrexistingIllness.length > 0) {
            let newTests =  this.state.tests.map( (test, testKey) => {

                let selectCurrentIllness =  this.props.getPrexistingIllness.find(illness => {
                    return illness.testType === test.testType;
                });
                
                if (selectCurrentIllness) {
                    return selectCurrentIllness;
                } else {
                    return test;
                }
            });
            this.setState({
                tests: newTests
            })
        }
    }

    searchArrAndReturnAsObj = (arrayList, SearchKeyWord) => {

        let selectedItem;
        let itemIndex;
        for (let i = 0; i <= arrayList.length; i++) {
            let itemObj = Object(arrayList[i]);
            if (itemObj.testType === SearchKeyWord) {
                selectedItem = itemObj;
                itemIndex = i;
            }
        }

        if (selectedItem) {
            return { ...selectedItem, itemIndex };
        } else {
            return false;
        }
    }

    enableDisableSubModal = (testType = '') => {
        this.setState({
            preExistingIllness: this.state.preExistingIllness ? false : true,
            currentTest: testType
        });

        if (!this.state.preExistingIllness) {
            this.returnCheckBoxTrueOrFalse(testType, true);
        }
    }

    returnCheckBoxTrueOrFalse = (testType, isAlwaysTrue = false) => {
        let selectedItem = this.searchArrAndReturnAsObj(this.state.tests, testType);
        let tests = this.state.tests;


        if (isAlwaysTrue) {

            tests[selectedItem.itemIndex].isChecked = true;
        } else {
            tests[selectedItem.itemIndex].isChecked = tests[selectedItem.itemIndex].isChecked ? false : true;
        }
        this.setState({ tests });
    }

    setNewTests = (testType = '', newTests) => {

        let targetedTest = this.searchArrAndReturnAsObj(this.state.tests, testType);
        let tests = this.state.tests;
        tests[targetedTest.itemIndex].selectedTests = newTests;

        this.setState({
            tests
        });
    }

    donePrexistingIllness = () => {
        let tests = this.state.tests.filter(v => v.isChecked === true);
        this.props.setPrexistingIllnesses(tests);
        this.props.ModalExecuter();
    }


    render() {

        let generateViewOfIllness = this.state.tests.map((v, k) => {

            return (
                <View style={styles.investigationItemWrapper} key={k}>
                    <View style={{
                        flex: .15
                    }}>
                        <CheckBox
                            iconType="MaterialCommunityIcons"
                            uncheckedIcon="check-box-outline-blank"
                            uncheckedColor="#00B9FC"
                            checkedColor="#00B9FC"
                            checkedIcon="check-box"
                            checked={this.state.tests[k].isChecked}
                            onPress={() => {
                                this.returnCheckBoxTrueOrFalse(this.state.tests[k].testType);
                            }}
                            containerStyle={styles.checkBoxCustomStyle}
                        />
                    </View>
                    <View style={{
                        flex: .60
                    }}>
                        {this.state.currentTest === v.testType && (
                            <PresExistingIllnessSubModal
                                modalVisible={this.state.preExistingIllness}
                                invokeModalClosing={this.enableDisableSubModal}
                                setTests={this.setNewTests}
                                getTests={this.state.tests[k].selectedTests}
                                getType={this.state.currentTest}
                            />
                        )}
                        <TouchableHighlight underlayColor="transparent" onPress={() => this.enableDisableSubModal(v.testType)} >
                            <Text style={styles.investigationTitle}>{v.testType}</Text>
                        </TouchableHighlight>
                        <Text style={styles.SelectedInvestigations}>{this.state.tests[k].selectedTests.join(', ')}</Text>
                    </View>
                    <View style={{
                        flex: .07,
                        marginTop: 8,
                    }}>
                        <TouchableHighlight underlayColor="transparent" onPress={() => this.enableDisableSubModal(v.testType)} >
                            <Entypo name="dots-three-horizontal" size={22} style={styles.dotIcon} />
                        </TouchableHighlight>
                    </View>
                </View>
            );
        });

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
                            <TouchableHighlight underlayColor="transparent" onPress={() => { this.props.ModalExecuter(); }} style={{ paddingRight: 15, marginLeft: 10, marginTop: 3 }}>
                                <Ionicons name="md-close" size={25} style={{ color: "#FFF", fontWeight: 'bold' }} />
                            </TouchableHighlight>
                            <View>
                                <Text style={{ color: "#FFF", fontSize: 17 }}>Pre existing illness</Text>
                                {/* <Text style={{ color: "#DBDBDB", fontSize: 12, fontWeight: '200' }}>Saidul Islam</Text> */}
                            </View>
                        </View>

                        <View style={{ marginRight: 10 }}>
                            <Text style={{ color: "#FFFFFF", fontSize: 10, fontWeight: 'bold', textAlign: 'right' }}>00:12:59</Text>
                            <Text style={{ color: "#DBDBDB", fontWeight: "200", fontSize: 10 }}>time elapsed</Text>
                        </View>
                    </View>
                    <ScrollView style={{ paddingTop: 22, flex: .8, flexDirection: 'column', backgroundColor: "#F7F8F9", paddingTop: -20 }}>

                        <View>

                            <Text style={{ color: '#60636D', fontSize: 10, marginTop: 10, marginBottom: 10, marginLeft: 17 }}>Add test name</Text>
                            {generateViewOfIllness}
                        </View>

                    </ScrollView>
                    <View style={{
                        flex: .12,
                        backgroundColor: '#F7F8F9',
                        width: '100%'
                    }}>
                        <TouchableHighlight underlayColor="transparent" onPress={this.donePrexistingIllness} style={{ alignSelf: 'center', backgroundColor: '#00B9FC', width: '70%', padding: 7, borderRadius: 25, marginTop: 7 }}>
                            <Text style={{ textAlign: 'center', color: '#FFF', fontWeight: 'bold' }}>DONE</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>
        );
    }
}

// little bit of modification added on this function as the data format is different
function returnPrescriptionListAsObject(testType) {

    let investigationData = PrescriptionEntries.filter(v => v.testType == testType)[0];
    if (investigationData) {
        let investigationItems = investigationData.testData[0].testItems.map(v => {

            return {
                testType: v.itemName,
                timestamp: v.timestamp,
                isChecked: false,
                selectedTests: [],
            }
        });

        if (investigationItems) {
            return investigationItems;
        } else {
            return false;
        }

    } else {
        return false;
    }
}

const styles = StyleSheet.create({
    investigationItemWrapper: {
        flexDirection: 'row',
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        paddingBottom: 10,
        paddingTop: 10,
    },
    checkBoxCustomStyle: {
        borderWidth: 0,
        backgroundColor: '#F7F8F9',
        padding: 0,
        margin: 0,
    },
    investigationTitle: {},
    SelectedInvestigations: {
        fontSize: 9,
        marginTop: 5,
        color: '#00B9FC',
    },
    
    dotIcon: {
        color: '#00B9FC'
    },

    
});