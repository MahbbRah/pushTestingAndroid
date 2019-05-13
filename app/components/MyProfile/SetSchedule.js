import React from 'react';
import { View, TouchableHighlight, Modal, StyleSheet, Text, ScrollView } from 'react-native';
import SetDateTimeRange from './SetDateTimeRange';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';

import CONST from '../../lib/constants';
// import API from '../../../lib/api';

export default class SetSchedule extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            setDateTimeRange: false,
        };
        // this.API = new API();
    }

    enableDisableSetDateTimeRange = () => {

        this.setState({
            setDateTimeRange: this.state.setDateTimeRange ? false : true
        });
    }

    render() {

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
                                <Ionicons name="md-arrow-back" size={25}
                                    color="#FFF" fontWeight="bold"
                                />
                            </TouchableHighlight>
                            <View>
                                <Text style={{ color: "#FFF", fontSize: 17, marginTop: 5 }}>Set Schedule</Text>
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
                            alignSelf: 'center',
                            marginTop: 20,
                            marginLeft: 20

                        }}>
                            <View style={styles.complainItem}>
                                <View style={[styles.tabletName]}>
                                    <View style={styles.dateItemSelection}>
                                        <Text style={styles.dateAndTimeFontSize}>20/12/2018</Text>
                                    </View>
                                    <View style={styles.timeRangSelection}>
                                        <Text style={styles.dateAndTimeFontSize}>11:00 am - 12:30 pm</Text>
                                    </View>
                                </View>
                                <TouchableHighlight style={styles.compalainDelBtnWrapper}>
                                    <Entypo name="minus" size={25}
                                        color='#FFF' paddingLeft={3} paddingTop={1.5} backgroundColor="#F62834" borderRadius={25} width={30} height={30}
                                    />
                                </TouchableHighlight>
                            </View>
                            <View style={styles.complainItem}>
                                <View style={[styles.tabletName]}>
                                    <View style={styles.dateItemSelection}>
                                        <Text style={styles.dateAndTimeFontSize}>20/12/2018</Text>
                                    </View>
                                    <View style={styles.timeRangSelection}>
                                        <Text style={styles.dateAndTimeFontSize}>11:00 am - 12:30 pm</Text>
                                    </View>
                                </View>
                                <TouchableHighlight style={styles.compalainDelBtnWrapper}>
                                    <Entypo name="minus" size={25}
                                        color='#FFF' paddingLeft={3} paddingTop={1.5} backgroundColor="#F62834" borderRadius={25} width={30} height={30}
                                    />
                                </TouchableHighlight>
                            </View>
                            <View style={styles.complainItem}>
                                <View style={[styles.tabletName]}>
                                    <View style={styles.dateItemSelection}>
                                        <Text style={styles.dateAndTimeFontSize}>20/12/2018</Text>
                                    </View>
                                    <View style={styles.timeRangSelection}>
                                        <Text style={styles.dateAndTimeFontSize}>11:00 am - 12:30 pm</Text>
                                    </View>
                                </View>
                                <TouchableHighlight style={styles.compalainDelBtnWrapper}>
                                    <Entypo name="minus" size={25}
                                        color='#FFF' paddingLeft={3} paddingTop={1.5} backgroundColor="#F62834" borderRadius={25} width={30} height={30}
                                    />
                                </TouchableHighlight>
                            </View>
                            <View style={styles.complainItem}>
                                <View style={[styles.tabletName]}>
                                    <View style={styles.dateItemSelection}>
                                        <Text style={styles.dateAndTimeFontSize}>20/12/2018</Text>
                                    </View>
                                    <View style={styles.timeRangSelection}>
                                        <Text style={styles.dateAndTimeFontSize}>11:00 am - 12:30 pm</Text>
                                    </View>
                                </View>
                                <TouchableHighlight style={styles.compalainDelBtnWrapper}>
                                    <Entypo name="minus" size={25}
                                        color='#FFF' paddingLeft={3} paddingTop={1.5} backgroundColor="#F62834" borderRadius={25} width={30} height={30}
                                    />
                                </TouchableHighlight>
                            </View>
                            <View style={styles.complainItem}>
                                <View style={[styles.tabletName]}>
                                    <View style={styles.dateItemSelection}>
                                        <Text style={styles.dateAndTimeFontSize}>20/12/2018</Text>
                                    </View>
                                    <View style={styles.timeRangSelection}>
                                        <Text style={styles.dateAndTimeFontSize}>11:00 am - 12:30 pm</Text>
                                    </View>
                                </View>
                                <TouchableHighlight style={styles.compalainDelBtnWrapper}>
                                    <Entypo name="minus" size={25}
                                        color='#FFF' paddingLeft={3} paddingTop={1.5} backgroundColor="#F62834" borderRadius={25} width={30} height={30}
                                    />
                                </TouchableHighlight>
                            </View>
                            <TouchableHighlight underlayColor="transparent" onPress={this.enableDisableSetDateTimeRange}>
                                <View>
                                    <SetDateTimeRange modalVisible={this.state.setDateTimeRange} ModalExecuter={this.enableDisableSetDateTimeRange} animationType="slide" />
                                    <Text style={styles.inputFieldStyle}> + Add Date and Time range</Text>
                                </View>
                            </TouchableHighlight>
                            <View style={{ flexDirection: 'row', marginRight: 30, marginTop: 10}}>
                                <Text style={{ color: '#91949B', fontSize: 11, lineHeight: 15}}>You can add/delete date and time range to make work schedule.
                                     You also can edit them by tapping on the box
                                </Text>
                            </View>

                        </View>

                    </ScrollView>
                    <View style={{
                        flex: .15,
                        backgroundColor: '#F7F8F9',
                        width: '100%'
                    }}>
                        <TouchableHighlight style={{ alignSelf: 'center', backgroundColor: '#fff', width: '40%', borderColor: '#00B9FC', borderWidth: 1, padding: 7, borderRadius: 25 }}>
                            <View style={{ flexDirection: 'row'}}>
                                <Ionicons name="ios-calendar" size={22} 
                                    color='#00B9FC' marginRight={10} marginLeft={5} 
                                />
                                <Text style={{ textAlign: 'center', color: '#00B9FC', }}>Calendar View</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    complainItem: {
        flexDirection: 'row',
        marginBottom: 10
    },
    tabletName: {
        flexDirection: 'row',
        width: '85%',
        borderRadius: 1
    },
    tabletType: {
        color: '#B2B6BE',
        fontSize: 12,
    },
    tabRoutineCount: {
        color: '#00A4FB',
        marginTop: 4,
    },
    compalinBtnDel: {
        color: '#FFF',
        paddingLeft: 3,
        paddingTop: 1.5,
        backgroundColor: "#F62834",
        borderRadius: 25,
        width: 30,
        height: 30
    },
    inputFieldStyle: {
        flexDirection: 'row',
        marginRight: 20,
        backgroundColor: '#FFF',
        borderBottomColor: '#ddd',
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        borderLeftColor: '#DDD',
        borderRightColor: '#DDD',
        borderRightWidth: 1,
        fontSize: 11,
        padding: 7,
        color: '#91949B',
    },
    dateItemSelection: {
        flex: .35, 
        marginRight: 8, 
        backgroundColor: '#FFF', 
        padding: 8, 
        borderWidth: .3, 
        borderColor: '#D1D1D1',
     },
    dateAndTimeFontSize: {
        fontSize: 12,
    },
    timeRangSelection: { 
        flex: .55, 
        backgroundColor: '#FFF', 
        padding: 8, 
        borderWidth: .3, 
        borderColor: '#D1D1D1',
    },
});