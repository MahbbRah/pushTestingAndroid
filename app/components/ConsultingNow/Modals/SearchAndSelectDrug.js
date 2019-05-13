import React from 'react';
import { View, TouchableHighlight, Modal } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import CONST from '../../../lib/constants';
import DrugDatabaseInside from '../../DrugDatabaseInside';

export default class SearchAndSelectDrug extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
            search: '',
            drugs: [],
            isLoading: true,
            rxHistorySubModal: false,
        };
    }

    cancelOpenModal = () => {
        this.props.ModalExecuter(null); 
        this.setState({ search: '', drugs: [] });
    }

    render() {

        return (
            <Modal
                animationType={this.props.animationType}
                transparent={false}
                onRequestClose={() => { }}
                visible={this.props.modalVisible}>
                <View
                    style={{ paddingTop: 22, flex: 1, flexDirection: 'column', backgroundColor: "#F7F8F9", paddingTop: -20, height: '100%', width: '100%' }}
                    
                >
                    {!this.props.isDisableBack && (
                        <View style={{ flexDirection: 'row', backgroundColor: CONST.COLORS.THEME_COLOR }}>
                            <TouchableHighlight
                                style={{ width: '10%', marginTop: '3%', marginBottom: 13 }}
                                onPress={this.cancelOpenModal}
                            >
                                <Feather name="arrow-left" size={24} style={{ color: '#fff', marginLeft: 10 }} />
                            </TouchableHighlight>
                        </View>
                    )}
                    <DrugDatabaseInside ModalExecuter={this.props.ModalExecuter} />
                </View>
            </Modal>
        );
    }
}
