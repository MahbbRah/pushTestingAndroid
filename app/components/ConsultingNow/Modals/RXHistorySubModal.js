import React from 'react';
import { View, TouchableHighlight, StyleSheet, Text, TextInput, ScrollView, Dimensions} from 'react-native';
import Modal from "react-native-modal";
import { Dropdown } from 'react-native-material-dropdown';
import API from '../../../lib/api';
import CONST from '../../../lib/constants';

import { CheckBox } from 'react-native-elements';

const { width } = Dimensions.get('window');
var initialState = {
    field1: '',
    field2: '',
    field3: '',
    field4: '',
    field5: '',
    field6: '',
    durationEntry: '',
    beforeMeal: false,
    afterMeal: false,
    beforeSleep: false,
    checkDuration: true,
    checkContinue: false,
    medicineName: '',
    genericName: '',
    strength: '',
    form: '',
    isEditing: false,
    editingKey: null
};

export default class RXHistorySubModal extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            ...initialState
        };
        this.API = new API();
    }

    async componentWillReceiveProps() {

        let RxHistoryEditingKey = await this.API._retrieveData("RxEditingKey");
        if(RxHistoryEditingKey) {

            let selectedItem = this.props.getRx.filter((v, k) => k === parseInt(RxHistoryEditingKey))[0];

            let newState = {
                field1: '',
                field2: '',
                field3: '',
                field4: '',
                field5: '',
                field6: '',
                durationEntry: selectedItem.durationEntry,
                beforeMeal: selectedItem.beforeMeal,
                afterMeal: selectedItem.afterMeal,
                beforeSleep: selectedItem.beforeSleep,
                checkDuration: selectedItem.checkDuration,
                checkContinue: selectedItem.checkContinue,
                isEditing: true,
                medicineName: selectedItem.name,
                strength: selectedItem.strength,
                form: selectedItem.medicineType,
                genericName: selectedItem.genericName,
                editingKey: RxHistoryEditingKey
            };
            selectedItem.doses.map((v, k) => newState[`field${k+1}`] = v);

            this.setState({...newState});

            await this.API._removeItem("RxEditingKey");
        }


    }


    InvokeOKClick = () => {

        if(this.props.selectedDrug) {

            this.addNewRx();
            this.props.invokeModalClosing();
        } else {
            alert('Please select a drug first!');
        }
    }

    addNewRx = () => {
        let medicineName = this.state.medicineName !== '' ? this.state.medicineName : this.props.selectedDrug.brand_name;
        let genericName = this.state.genericName !== '' ? this.state.genericName : this.props.selectedDrug.generic_name;
        let medicineType = this.state.form !== '' ? this.state.form : this.props.selectedDrug.form;
        let strength = this.state.strength !== '' ? this.state.strength : this.props.selectedDrug.strength;
        

        let { field1, field2, field3, field4, field5, field6 } = this.state;
        let doses = [field1, field2, field3, field4, field5, field6];
        doses = doses.filter(v => v !== '');
        let key = this.state.editingKey;

        this.setState({...initialState});

        let { durationEntry, beforeMeal, afterMeal, beforeSleep, checkContinue, checkDuration } = this.state;
        let ItemArr = {
            name: medicineName,
            medicineType,
            genericName,
            strength,
            doses: doses,
            durationEntry,
            beforeMeal,
            afterMeal,
            beforeSleep,
            checkContinue,
            checkDuration
        };

        // do something like editing but ultimately not like that
        let oldItems = this.props.getRx;
        // console.log('Items: ', oldItems, " the Key: ", key);
        if (key) {
            // oldItems.splice(key, 1)
            oldItems[key] = ItemArr;
            this.props.setRx(oldItems);
        } else {
            this.props.setRx(oldItems.concat(ItemArr));
        }
        
    }

    checkContinue = (type) => {
        if(type === 'duration') {
            this.setState({
                checkDuration: this.state.checkDuration ? false : true,
                checkContinue: this.state.checkContinue ? false : true,
            });
        }
        if(type === 'continue') {
            this.setState({
                checkContinue: this.state.checkContinue ? false : true,
                checkDuration: this.state.checkDuration ? false : true,
                durationEntry: '',
            });
        }
    }

    changeSelection = (itemName, changedText) => {
        this.setState({ [itemName]: changedText });

    }

    markDirectionType = (type='') => {

        switch (type) {
            case 'beforeMeal':
                this.setState({
                    beforeMeal: true,
                    afterMeal: false,
                    beforeSleep: false,
                });
                break;
            case 'beforeSleep':
                if (this.checkIfDrugPrescribedMoreThanOnce()) {
                    this.setState({
                        beforeMeal: false,
                        afterMeal: false,
                        beforeSleep: true,
                    });
                }
                break;
            case 'afterMeal':
                this.setState({
                    beforeMeal: false,
                    afterMeal: true,
                    beforeSleep: false,
                });
                break;
        
            default:
                break;
        }
    }

    checkIfDrugPrescribedMoreThanOnce = () => {

        let itemCounter = 0;

        for(i=1; i<=6; i++) {
            let item =  'field' + i;
            if (this.state[item] !== '' && this.state[item] !== '0') {
                itemCounter += 1;
            }
        }
        return itemCounter === 1;
    }



    render(){


        let PickerItem = (itemName, styleProp) => {

            return (
                <View style={{
                    borderWidth: 1,
                    borderColor: '#DDD',
                    marginRight: 5,
                    ...styleProp
                }}>
                    <Dropdown
                        placeholder="-"
                        fontSize={12}
                        labelFontSize={16}
                        value={this.state[itemName]}
                        data={itemList}
                        renderAccessory={() => null}
                        onChangeText={(changedText) => this.changeSelection(itemName, changedText)}
                        containerStyle={{
                            paddingLeft: 3,
                            width: width/8.4,
                        }}
                    />
                </View>
            );
        }
        return(
            <Modal
                isVisible={this.props.modalVisible}
                style={{
                    backgroundColor: '#FFF',
                }}
                onBackButtonPress={this.props.invokeModalClosing}
            >
                <ScrollView style={{
                    flex: 1,
                    flexDirection: 'column'
                }}>
                    <View
                        style={{
                            flex: .10,
                            flexDirection: 'column',
                            backgroundColor: '#00B9FC',
                            paddingTop: 6,
                        }}
                    >
                        <Text style={{ color: '#FFF', textAlign: 'center' }}>Medicine</Text>
                        <Text style={{ color: '#ddd', textAlign: 'center', fontSize: 11 }}>Add attributes</Text>
                    </View>

                    <View style={{
                        flex: .80
                    }}>

                        {this.props.selectedDrug && (
                            <View style={{
                                marginLeft: 30,
                                marginTop: 15
                            }}>

                                <View style={{width: '100%', flexDirection: 'row'}}>
                                    <TextInput
                                        placeholder="Drug Name"
                                        // onChangeText={(Text) => this.setState({ medicineName: Text })}
                                        defaultValue={this.state.isEditing ? `${this.state.medicineName}` :
                                            `${this.props.selectedDrug.brand_name}`
                                        }
                                        editable={false}
                                        underlineColorAndroid="transparent"
                                        multiline={false}
                                        style={{ borderBottomColor: '#DDD', borderBottomWidth: .5, width: '70%' }}

                                    />
                                    <Text style={{ width: '40%', color: '#B3B5C0' }}>{this.state.isEditing ? this.state.strength : this.props.selectedDrug.strength}</Text>
                                </View>
                                
                                <View style={{ width: '100%', flexDirection: 'row' }}>
                                    <TextInput
                                        placeholder="Generic Name"
                                        // onChangeText={(Text) => this.setState({ genericName: Text })}
                                        editable={false}
                                        defaultValue={
                                            this.state.isEditing ? `${this.state.genericName}` :
                                                `${this.props.selectedDrug.generic_name}`
                                        }
                                        underlineColorAndroid="transparent"
                                        multiline={false}
                                        style={{ borderBottomColor: '#DDD', borderBottomWidth: .5, width: '70%' }}

                                    />
                                    <Text style={{ width: '40%', color: '#B3B5C0' }}>{this.state.isEditing ? this.state.form : this.props.selectedDrug.form}</Text>
                                </View>
                            </View>
                        )}

                        <View style={{
                            marginLeft: 15,
                            marginTop: 20,
                            marginRight: 15
                        }}>

                            <View style={{
                                flexDirection: 'row'
                            }}>
                                <Text style={{ width: '16%', marginTop: 7, color: '#B3B5C0' }}>Dose</Text>
                                <Text style={{ width: '84%', borderBottomWidth: 1, borderBottomColor: '#ddd', marginBottom: 20 }}>&nbsp;</Text>
                            </View>
                            <View style={{
                                flexDirection: 'row',
                                marginTop: 7
                            }}>
                                {PickerItem('field1')}
                                {PickerItem('field2')}
                                {PickerItem('field3')}
                                {PickerItem('field4')}
                                {PickerItem('field5')}
                                {PickerItem('field6')}
                            </View>
                        </View>
                        <View style={{
                            marginLeft: 15,
                            marginTop: 20,
                            marginRight: 15
                        }}>

                            <View style={{
                                flexDirection: 'row'
                            }}>
                                <Text style={{ width: '21%', marginTop: 7, color: '#B3B5C0' }}>Direction</Text>
                                <Text style={{ width: '79%', borderBottomWidth: 1, borderBottomColor: '#ddd', marginBottom: 20 }}>&nbsp;</Text>
                            </View>
                            <View style={{
                                flexDirection: 'row'
                            }}>
                                <TouchableHighlight
                                    style={[styles.directionBtns, { backgroundColor: this.state.beforeMeal ? '#00B9FC' : '#fff' }]}
                                    underlayColor="transparent"
                                    onPress={() => this.markDirectionType('beforeMeal')}
                                >
                                    <Text style={[styles.directionBtnText, { color: this.state.beforeMeal ? '#fff' : '#60636D' }]}>Before Meal</Text>
                                </TouchableHighlight>
                                <TouchableHighlight
                                    style={[styles.directionBtns, { backgroundColor: this.state.afterMeal ? '#00B9FC' : '#fff' }]}
                                    underlayColor="transparent"
                                    onPress={() => this.markDirectionType('afterMeal')}
                                >
                                    <Text style={[styles.directionBtnText, { color: this.state.afterMeal ? '#fff' : '#60636D' }]}>After Meal</Text>
                                </TouchableHighlight>
                                <TouchableHighlight
                                    style={[styles.directionBtns, { backgroundColor: this.state.beforeSleep ? '#00B9FC' : '#fff' }]}
                                    underlayColor="transparent"
                                    onPress={() => this.markDirectionType('beforeSleep')}
                                >
                                    <Text style={[styles.directionBtnText, { color: this.state.beforeSleep ? '#fff' : '#60636D' }]}>Before Sleep</Text>
                                </TouchableHighlight>
                            </View>
                        </View>

                        <View style={{
                            marginLeft: 15,
                            marginTop: 20,
                        }}>

                            <View style={{
                                flexDirection: 'row'
                            }}>
                                <Text style={{ width: '21%', marginTop: 7, color: '#B3B5C0' }}>Duration</Text>
                            </View>
                            <View style={{
                                flexDirection: 'column',
                                marginTop: 8,
                            }}>
                                <View style={{
                                    flexDirection: 'row',
                                }}>
                                    <CheckBox
                                        checkedColor="#00B9FC"
                                        checkedIcon='dot-circle-o'
                                        uncheckedIcon='circle-o'
                                        checked={this.state.checkDuration}
                                        onPress={() => this.checkContinue('duration')}
                                        containerStyle={styles.checkboxStyle}
                                    />
                                    <TextInput
                                        placeholder="Enter Days"
                                        onChangeText={(Text) => this.setState({ durationEntry: Text })}
                                        value={this.state.durationEntry}
                                        underlineColorAndroid="transparent"
                                        multiline={false}
                                        style={[styles.enterDaysInputBox]}
                                        keyboardType="numeric"

                                    />
                                    <Text style={{ color: '#B3B5C0', marginLeft: 5, marginTop: 7 }}>
                                        Days
                                    </Text>
                                </View>
                                <View style={{
                                    flexDirection: 'row'
                                }}>
                                    <CheckBox
                                        checkedColor="#00B9FC"
                                        checkedIcon='dot-circle-o'
                                        uncheckedIcon='circle-o'
                                        checked={this.state.checkContinue}
                                        onPress={() => this.checkContinue('continue')}
                                        containerStyle={styles.checkboxStyle}
                                    />
                                    <TouchableHighlight
                                        style={{ marginLeft: -16 }}
                                        underlayColor="transparent"
                                        onPress={() => null}
                                    >
                                        <Text style={{ borderWidth: 1, color: '#60636D', borderColor: '#DDD', padding: 7 }}>Continue</Text>
                                    </TouchableHighlight>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={{
                        flex: 0.10,
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        paddingBottom: 6,
                        marginTop: -12
                    }}>
                        <TouchableHighlight underlayColor="transparent" onPress={this.props.invokeModalClosing}>
                            <Text style={styles.bottomBtn}>CANCEL</Text>
                        </TouchableHighlight>
                        <TouchableHighlight underlayColor="transparent" onPress={this.InvokeOKClick}>
                            <Text style={styles.bottomBtn}>OK</Text>
                        </TouchableHighlight>
                    </View>
                </ScrollView>
            </Modal>
        );
    }
}

const itemList =  [
    {
        label: '0',
        value: "0"
    },
    {
        label: '0.25',
        value: "0.25"
    },
    {
        label: '0.50',
        value: "0.50"
    },
    {
        label: '0.75',
        value: "0.75"
    },
    {
        label: '1',
        value: "1"
    },
    {
        label: '2',
        value: "2"
    },
    {
        label: '3',
        value: "3"
    },
    {
        label: '4',
        value: "4"
    },
    {
        label: '5',
        value: "5"
    },
    {
        label: '6',
        value: "6"
    },
    {
        label: '7',
        value: "7"
    },
    {
        label: '8',
        value: "8"
    },
];

const styles = StyleSheet.create({
    doseInputFieldStyle: {
        width: '12%',
        marginRight: 5,
        borderColor: '#ddd',
        borderWidth: 1,
        padding: 4,
        color: '#60636D',
        textAlign: 'center'
    },
    bottomBtn: {
        color: '#00B9FC',
        marginRight: 15,
        marginTop: 20,
    },
    directionBtns: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#DDD',
        padding: 7,
        width: '25%',
        marginLeft: 10
    },
    directionBtnText: {
        fontSize: 12,
    },
    checkboxStyle: {
        padding: 0,
        backgroundColor: '#fff',
        borderWidth: 0,
        marginLeft: -2
    },
    enterDaysInputBox: {
        marginLeft: -16,
        color: '#60636D',
        borderWidth: 1, 
        borderColor: '#DDD', 
        // width: '23%', 
        padding: 4, 
        marginBottom: 6,
        fontSize: 12,
    }
});