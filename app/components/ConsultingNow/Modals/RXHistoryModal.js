import React from 'react';
import { View, TouchableHighlight, Modal, StyleSheet, Text, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';

import CONST from '../../../lib/constants';
import RXHistorySubModal from './RXHistorySubModal';
import SearchAndSelectDrug from './SearchAndSelectDrug';
import { CommonButton } from '../../../lib/SharedElements';
import API from '../../../lib/api';
export default class RXHistoryModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            rxHistorySubModal: false,
            searchAndSelectDrug: false,
            selectedDrug: null,
            isToDisableBack: false,
        };
        this.API = new API();
    }


    editRxHistory = (key) => {

        this.API._storeData("RxEditingKey", `${key}`);
        
        this.enableDisableRXHistorySubModal();
    }

    enableDisableRXHistorySubModal = () => {

        this.setState({
            rxHistorySubModal: this.state.rxHistorySubModal ? false : true
        });
    }
    enableDisableSearchAndSelectDrug = (selectedDrug = null) => {

        if (selectedDrug) {

                this.setState({
                    searchAndSelectDrug: this.state.searchAndSelectDrug ? false : true,
                    selectedDrug
                });
            
            this.enableDisableRXHistorySubModal();
        } else {
            this.setState({
                searchAndSelectDrug: this.state.searchAndSelectDrug ? false : true,
            });
        }
    }

    deleteSelected = (key) => {

        let newItems = this.props.getRx.filter((v, k) => k !== key);
        this.props.setRx(newItems);
    }

    cancelOpenModal = () => {

        this.props.ModalExecuter();
        this.props.setRx([]);
    }


    render() {

        let RXItems = this.props.getRx.map((item, key) => {

            let isToAddTsf = item.medicineType === 'Syrup' || item.medicineType === 'Suspension' ? ' TSF ' : ' ';
            return (<View style={styles.complainItem} key={key}>
                <TouchableHighlight style={[styles.tabletName]} onPress={() => this.editRxHistory(key)} underlayColor="transparent">
                    <View style={{flexDirection: 'row', flex: 1}}>
                        <View style={{ flex: .9 }}>
                            <Text>{item.name} - {item.strength}</Text>
                            <Text style={styles.tabletType}>{item.medicineType} - {item.genericName}</Text>
                        </View>
                        <View style={{ flex: .3 }}>
                            <Text style={styles.tabRoutineCount}>{item.doses.join('+')} {isToAddTsf}</Text>
                        </View>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight style={styles.compalainDelBtnWrapper} onPress={() => this.deleteSelected(key)}>
                    <Entypo name="minus" size={25} style={styles.compalinBtnDel} />
                </TouchableHighlight>
            </View>);
        });

        return (
            <Modal
                animationType={this.props.animationType}
                transparent={false}
                onRequestClose={this.cancelOpenModal}
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
                            <TouchableHighlight underlayColor="transparent" onPress={this.cancelOpenModal} style={{ paddingRight: 15, marginLeft: 10, marginTop: 3 }}>
                                <Ionicons name="md-close" size={25} style={{ color: "#FFF", fontWeight: 'bold' }} />
                            </TouchableHighlight>
                            <View>
                                <Text style={{ color: "#FFF", fontSize: 17 }}>RX</Text>
                            </View>
                        </View>

                        <View style={{ marginRight: 10 }}>
                            <Text style={{ color: "#FFFFFF", fontSize: 10, fontWeight: 'bold', textAlign: 'right' }}>00:12:59</Text>
                            <Text style={{ color: "#DBDBDB", fontWeight: "200", fontSize: 10 }}>time elapsed</Text>
                        </View>
                    </View>
                    <View style={{ flex: .1, backgroundColor: "#F7F8F9", paddingTop: 7 }}>
                        <TouchableHighlight underlayColor="transparent" onPress={() => this.enableDisableSearchAndSelectDrug()} style={{ alignSelf: 'center', backgroundColor: '#00B9FC', width: '70%', padding: 7, borderRadius: 25 }}>
                            <Text style={{ textAlign: 'center', color: '#FFF', fontWeight: 'bold' }}>+ Add Medicine</Text>
                        </TouchableHighlight>
                    </View>
                    <ScrollView style={{ paddingTop: 22, flex: .7, flexDirection: 'column', backgroundColor: "#F7F8F9", paddingTop: -20 }}>

                        <View style={{
                            flex: 0.8,
                            marginTop: 20,
                            marginLeft: 20

                        }}>
                            {RXItems}
                            <RXHistorySubModal
                                selectedDrug={this.state.selectedDrug}
                                modalVisible={this.state.rxHistorySubModal}
                                invokeModalClosing={this.enableDisableRXHistorySubModal}
                                setRx={this.props.setRx}
                                getRx={this.props.getRx}

                            />
                            <SearchAndSelectDrug
                                modalVisible={this.state.searchAndSelectDrug}
                                ModalExecuter={this.enableDisableSearchAndSelectDrug}
                                isDisableBack={this.state.isToDisableBack}
                            />


                        </View>

                    </ScrollView>
                    <View style={{
                        flex: .1,
                        backgroundColor: '#F7F8F9',
                        width: '100%'
                    }}>
                        <CommonButton
                            onPressFunction={this.props.ModalExecuter}
                            buttonText="DONE"
                        />
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
        backgroundColor: "#fff",
        flexDirection: 'row',
        padding: 8,
        width: '85%',
        borderWidth: .3,
        borderColor: '#D1D1D1',
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
    compalainDelBtnWrapper: {
        marginLeft: 15,
        marginTop: 8,
    },
    compalinBtnDel: {
        color: '#FFF',
        backgroundColor: "#F62834",
        borderRadius: 40
    },
    compalinBtnEdit: {
        color: '#FFF',
        backgroundColor: CONST.COLORS.THEME_COLOR,
        borderRadius: 30,
        padding: 4
    },
    inputFieldStyle: {
        flexDirection: 'row',
        marginRight: 10,
        backgroundColor: '#FFF',
        borderBottomColor: '#ddd',
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        borderLeftColor: '#DDD',
        borderRightColor: '#DDD',
        borderRightWidth: 1,
        padding: 12,
        color: '#B2B6BE',
    },
});