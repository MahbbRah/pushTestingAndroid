import React from 'react';
import { View, TouchableHighlight, Modal, StyleSheet, Text, ScrollView, Picker} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import CONST from '../../../lib/constants';
// import API from '../../../lib/api';
import { CommonButton } from '../../../lib/SharedElements';
import Entypo from 'react-native-vector-icons/Entypo';

import SearchAndReturnItem from './SearchAndReturnItem';


export default class DiagonsisModal extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            selectedDiagonsis: '',
            enableAddingElem: false,
            enableDisableAddingItem: false,
        };
    }

    deleteSelected = (key) => {

        let newItems = this.props.getDiagonsis.filter((v, k) => k !== key);
        this.props.setDiagonsis('', newItems);
    }
    enableDisableSearchAndReturn = () => {

        this.setState({ enableDisableAddingItem: this.state.enableDisableAddingItem ? false : true });
    }

    closeThisModal = () => {
        this.props.ModalExecuter();
        this.setState({ enableAddingElem: false });
    }

    render(){
        let diagonsisItems = this.props.getDiagonsis.map((item, key) => {
            return <View style={styles.complainItem} key={key}>
                <Text style={styles.complainItemName}>{item}</Text>
                <TouchableHighlight style={styles.compalainDelBtnWrapper} underlayColor="transparent" onPress={() => this.deleteSelected(key)}>
                    <Entypo name="minus" size={25} style={styles.compalinBtnDel} />
                </TouchableHighlight>
            </View>
        });
        return(
            <Modal
                animationType={this.props.animationType}
                transparent={false}
                onRequestClose={this.closeThisModal}
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
                        <SearchAndReturnItem
                            isVisible={this.state.enableDisableAddingItem}
                            modalExecutor={this.enableDisableSearchAndReturn}
                            getItems={this.props.getDiagonsis}
                            setItems={this.props.setDiagonsis}
                            testType="Chief Complain"
                            testName="Chief Complain"
                        />

                        <View style={{ flexDirection: 'row' }}>
                            <TouchableHighlight underlayColor="transparent" onPress={this.closeThisModal} style={{ paddingRight: 15, marginLeft: 10, marginTop: 3 }}>
                                <Ionicons name="md-close" size={25} style={{ color: "#FFF", fontWeight: 'bold' }} />
                            </TouchableHighlight>
                            <View>
                                <Text style={{ color: "#FFF", fontSize: 17 }}>Diagonsis</Text>
                            </View>
                        </View>

                        <View style={{ marginRight: 10 }}>
                            <Text style={{ color: "#FFFFFF", fontSize: 10, fontWeight: 'bold', textAlign: 'right' }}>00:12:59</Text>
                            <Text style={{ color: "#DBDBDB", fontWeight: "200", fontSize: 10 }}>time elapsed</Text>
                        </View>
                    </View>
                    <View style={{ flex: .1, backgroundColor: "#F7F8F9", paddingTop: 7 }}>
                        <CommonButton
                            onPressFunction={this.enableDisableSearchAndReturn}
                            buttonText="+ Add Diagonsis"
                        />
                    </View>
                    <ScrollView style={{ paddingTop: 22, flex: .7, flexDirection: 'column', backgroundColor: "#F7F8F9", paddingTop: -20 }}>
                        
                        <View style={{
                            flex: 0.8,
                            alignSelf: 'auto',
                            marginTop: 20,
                            marginLeft: 20

                        }}>
                            {diagonsisItems}
                            
                            

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
    },
    inputFieldStyle: {
        flexDirection: 'row',
        marginRight: 10,
        backgroundColor: '#FFF',
        borderColor: '#ddd',
        borderWidth: .7,
        padding: 12,
        color: '#B2B6BE',
    },
});