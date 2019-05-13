import React from 'react';
import { View, TouchableHighlight, StyleSheet, Modal, TextInput, Text } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import { CommonButton } from '../../../lib/SharedElements';

import CONST from '../../../lib/constants';
import API from '../../../lib/api';
import DrugDatabaseInside from '../../DrugDatabaseInside';

export default class InvestigationSubModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
            search: '',
            drugs: [],
            isLoading: true,
            otherText: '',
            otherItems: [],
        };
        this.API = new API();
    }

    setDrugs = (drug = {}) => {

        let illnessType = this.props.getType;
        let OldDrugs = this.props.getTests;
        let itemToSet = illnessType === 'OTHERs' ? this.state.otherText : drug.brand_name;
        OldDrugs.push(itemToSet);
        this.props.setTests(illnessType, OldDrugs);
        this.props.invokeModalClosing();
    }

    setMorePre_existing = async() => {

        let pastOtherIllness = this.state.otherItems;

        if(this.state.otherText.length > 1) {
            let newOtherIllness = pastOtherIllness.push(this.state.otherText);
            console.log(`NewOtherItems: `, newOtherIllness)
            this.setState({otherItems: newOtherIllness, otherText: ''});
            await this.API._storeData(JSON.stringify(newOtherIllness));
        } else {
            alert("Error: Please type something to add as new Illness");
        }
    }

    deleteSelected = (key) => {


    }

    render() {

        let getOtherData = this.state.otherItems && this.state.otherItems.map((v, key) => {
            return <View style={styles.complainItem} key={key}>
                <Text style={styles.complainItemName}>{v}</Text>
                <TouchableHighlight style={styles.compalainDelBtnWrapper} underlayColor="transparent" onPress={() => this.deleteSelected(key)}>
                    <Entypo name="minus" size={25} style={styles.compalinBtnDel} />
                </TouchableHighlight>
            </View>
        })

        return (
            <Modal
                visible={this.props.modalVisible}
                transparent={false}
                onRequestClose={this.props.invokeModalClosing}
                style={{
                    backgroundColor: '#FFF',
                    alignSelf: 'center',

                }}
            >
                <View
                    style={{ paddingTop: 22, flex: 1, flexDirection: 'column', backgroundColor: "#F7F8F9", paddingTop: -20, height: '100%', width: '100%' }}

                >
                    <View style={{ flexDirection: 'row', backgroundColor: CONST.COLORS.THEME_COLOR }}>
                        <TouchableHighlight
                            style={{ width: '10%', marginTop: '3%' }}
                            onPress={this.props.invokeModalClosing}
                        >
                            <Feather name="arrow-left" size={24} style={{ color: '#fff', marginLeft: 10 }} />
                        </TouchableHighlight>
                    </View>
                    <View style={styles.container}>
                        {this.props.getType === 'OTHERs' ? (
                            <View style={{ marginTop: 40, marginLeft: 9, marginRight: 9 }}>
                                <TextInput
                                    placeholder="Type your illness information"
                                    value={this.state.otherText}
                                    onChangeText={(text) => this.setState({ otherText: text })}
                                    multiline={false}
                                    underlineColorAndroid="transparent"
                                    style={styles.inputItemText}

                                />

                                <View style={{ marginTop: 7 }}>
                                    <CommonButton
                                        onPressFunction={this.setMorePre_existing}
                                        buttonText="Save To Other "
                                    />
                                </View>
                                <View style={{ marginTop: 7 }}>
                                    {getOtherData}
                                </View>
                                
                            </View>
                        ) : (
                                <DrugDatabaseInside ModalExecuter={this.setDrugs} />
                            )}

                    </View>
                </View>

            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: CONST.COLORS.WHITE
    },
    inputItemText: {
        borderColor: '#EEEEEE',
        borderWidth: 1,
        margin: 5,
        padding: 8,
        fontSize: 12,
        borderRadius: 5
    },
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
        borderRadius: 40,
        marginLeft: 4,
    },
});