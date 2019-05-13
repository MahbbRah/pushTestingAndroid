import React from 'react';
import { View, TouchableHighlight, Modal, StyleSheet, Text, ScrollView, Picker, DatePickerAndroid } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import CONST from '../../lib/constants';
// import API from '../../../lib/api';

export default class SetDateTimeRange extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            fromTime: '',
            toTime: '',
        };
        // this.API = new API();
    }

    handleDatePicker = async () => {
        try {
            const { action, year, month, day } = await DatePickerAndroid.open({
                // Use `new Date()` for current date.
                // May 25 2020. Month 0 is January.
                date: new Date()
            });

            if (action === DatePickerAndroid.dateSetAction) {
                // Alert.alert(` Year: ${year}, Month: ${month}, Day: ${day}`);


            }
        } catch ({ code, message }) {
            console.warn('Cannot open date picker', message);
        }

    }

    render() {

        let pickerItems = CONST.TIMES_LIST.map((time, i) => <Picker.Item key={i} label={time} value={time} />);
        return (
            <Modal
                animationType={this.props.animationType}
                transparent={false}
                onRequestClose={() => { }}
                visible={this.props.modalVisible}>
                <View style={{ flex: 1 }}>
                    <View style={{
                        flex: .07,
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
                                <Ionicons name="md-close" size={25} color="#fff" fontWeight="bold"/>
                            </TouchableHighlight>
                            <View>
                                <Text style={{ color: "#FFF", fontSize: 17, marginTop: 5 }}>Set DateTime Range</Text>
                            </View>
                        </View>

                        <View style={{ marginRight: 10 }}>
                            <Text style={{ color: "#FFFFFF", fontSize: 10, fontWeight: 'bold', textAlign: 'right' }}>00:12:59</Text>
                            <Text style={{ color: "#ddd", fontWeight: "200", fontSize: 10 }}>Current Login</Text>
                        </View>
                    </View>
                    <ScrollView style={{ paddingTop: 22, flex: .8, flexDirection: 'column', backgroundColor: "#F7F8F9", paddingTop: -20 }}>

                        <View style={{
                            flex: 0.7,
                            marginTop: 20,
                            marginLeft: 20

                        }}>
                            
                            <View>
                                <View style={{
                                    flexDirection: 'row'
                                }}>
                                    <Text style={{ width: '35%', marginTop: 7, color: '#B3B5C0' }}>Select From Time</Text>
                                    <Text style={{ width: '65%', borderBottomWidth: 1, borderBottomColor: '#ddd', marginBottom: 5 }}>&nbsp;</Text>
                                </View>
                                <View style={{ borderBottomWidth: 1, borderBottomColor: '#ddd'}}>
                                    <Picker
                                        onValueChange={ ( fromTime, index) => this.setState({fromTime})}>
                                        {pickerItems}
                                    </Picker>
                                </View>
                            </View>
                            <View>
                                <View style={{
                                    flexDirection: 'row'
                                }}>
                                    <Text style={{ width: '32%', marginTop: 15, color: '#B3B5C0' }}>Select to Time</Text>
                                    <Text style={{ width: '68%', borderBottomWidth: 1, borderBottomColor: '#ddd', marginBottom: 5 }}>&nbsp;</Text>
                                </View>
                                <View style={{ borderBottomWidth: 1, borderBottomColor: '#ddd'}}>
                                    <Picker
                                        onValueChange={(toTime, index) => this.setState({toTime})}>
                                        {pickerItems}
                                    </Picker>
                                </View>
                            </View>
                            <View>
                                <View style={{
                                    flexDirection: 'row'
                                }}>
                                    <Text style={{ width: '25%', marginTop: 15, color: '#B3B5C0' }}>Select Date</Text>
                                    <Text style={{ width: '75%',  marginBottom: 12 }}>&nbsp;</Text>
                                </View>
                                <View style={{ marginRight: 20}}>
                                    <TouchableHighlight underlayColor="transparent" onPress={this.handleDatePicker}>
                                        <View style={{ flexDirection: "row", borderWidth: 1, borderColor: '#DDD', padding: 7 }}>
                                            <Ionicons name="md-time" size={23} color="#00B9FC" marginRight={5}/>
                                            <Text>Pick a Date</Text>
                                        </View>
                                    </TouchableHighlight>
                                </View>
                            </View>

                        </View>

                    </ScrollView>
                    <View style={{
                        flex: .15,
                        backgroundColor: '#F7F8F9',
                        width: '100%'
                    }}>
                        <TouchableHighlight style={styles.addBtn}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                <Ionicons name="md-add" size={22} color="#FFF" marginRight={10}  marginLeft={5} />
                                <Text style={{ textAlign: 'center', color: '#fff', }}>Add</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    addBtn: {
        alignSelf: 'center', 
        backgroundColor: '#00B9FC', 
        width: '25%', 
        borderColor: '#00B9FC', 
        borderWidth: 1, 
        padding: 7, 
        borderRadius: 25
    }
});