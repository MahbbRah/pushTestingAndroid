import React from 'react';
import { View, TouchableHighlight, StyleSheet, Text, Picker, TextInput, Alert, ScrollView } from 'react-native';
import Modal from "react-native-modal";
import CONST from '../../../lib/constants';

export default class SetAppointmentDate extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            interval: 'days',
            amount: '',
        };
        // this.API = new API();
    }

    updateDate = () => {
        
        if(this.state.amount !== '') {
            let calculateDayByInterval;

            if (this.state.interval === 'days') {
                calculateDayByInterval = parseInt(this.state.amount);
            }
            if (this.state.interval === 'weeks') {
                calculateDayByInterval = parseInt(this.state.amount) * 7;
            }
            if (this.state.interval === 'months') {
                calculateDayByInterval = parseInt(this.state.amount) * 30;
            }

            let currentDate = new Date();

            //Update the date by adding new days in the current date.
            currentDate.setDate(currentDate.getDate() + calculateDayByInterval);

            // console.log(this.props);
            this.props.setNextAppointDate(currentDate.toLocaleDateString());

            this.setState({
                amount: ''
            })

            this.props.invokeModalClosing();
        } else{
            Alert.alert('Please enter a valid Day/Month/Year');
        }
    }

    render() {

        return (
            <Modal
                isVisible={this.props.modalVisible}
                transparent={true}
                backdropOpacity={0.30}
                style={{
                    backgroundColor: '#FFF',
                    alignSelf: 'center',
                    height: 400
                }}
            >
            
                <ScrollView style={{
                    flex: 1,
                    flexDirection: 'column',
                    width: '80%',
                }}>
                    <View style={{flex: .30, backgroundColor: CONST.COLORS.THEME_COLOR, alignItems: 'center', marginBottom: 15}}>
                        <Text style={{marginTop: 30, fontSize: 23, fontWeight: 'bold', color: '#FFF', marginBottom: 30}}>Set Appointment Date</Text>
                    </View>

                    <View style={{
                        flex: .70
                    }}>


                        <View style={{marginLeft: 10, marginRight: 10}}>
                            <Text style={{fontSize: 11, color: CONST.COLORS.FONT_BLACK}}>Please enter the appoint date by day/week/month</Text>
                            <TextInput
                                placeholder="Enter Number of Days/Week/Month"
                                value={this.state.amount}
                                onChangeText={(Text) => this.setState({ amount: Text })}
                                multiline={false}
                                style={{width: '70%', fontSize: 12}}
                                underlineColorAndroid="transparent"
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={{ borderColor: CONST.COLORS.THEME_COLOR, borderWidth: 1.5, margin: 4, width: '60%', elevation: 2 }}>
                            <Picker
                                selectedValue={this.state.interval}
                                style={{ height: 50, width: 150, }}
                                itemStyle={{fontSize: 10}}
                                onValueChange={(itemValue, itemIndex) => this.setState({ interval: itemValue })}>
                                <Picker.Item label="Days" value="days" />
                                <Picker.Item label="Weeks" value="weeks" />
                                <Picker.Item label="Months" value="months" />
                            </Picker>
                        </View>
                    </View>

                    <View style={{
                        flex: 0.12,
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        marginTop: 10,
                    }}>
                        <TouchableHighlight underlayColor="transparent" onPress={this.props.invokeModalClosing}>
                            <Text style={styles.bottomBtn}>CANCEL</Text>
                        </TouchableHighlight>
                        <TouchableHighlight underlayColor="transparent" onPress={this.updateDate}>
                            <Text style={styles.bottomBtn}>OK</Text>
                        </TouchableHighlight>
                    </View>
                </ScrollView>
            </Modal>
        );
    }
}

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
        // width: '18%',
        marginLeft: 3
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
        width: '23%',
        padding: 4,
        marginBottom: 6,
        fontSize: 12,
    }
});