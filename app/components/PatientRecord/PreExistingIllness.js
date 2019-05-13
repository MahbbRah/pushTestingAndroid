import React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import CONST from '../../lib/constants';
import API from '../../lib/api';


export default class PresExistingIllnessHistory extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            preExistingIllnesses: [],
            isLoadedInfo: false,
        };
        this.API = new API();
    }

    async componentDidMount() {

        const uri =  CONST.BASE_URL + CONST.APIS.GET_PATIENT_OTHER_HISTORY;
        const payload = {
            patient_id: this.props.navigation.state.params.patientID
        };

        const getHistories = await this.API.POST(uri, payload);

        if(getHistories.status === 'success') {

            this.setState({
                preExistingIllnesses: JSON.parse(getHistories.response.patient_histories).preExistingIllnesses,
                isLoadedInfo: true,
            });
        } else {
            this.setState({
                isLoadedInfo: true,
            })
        }
    }


    render() {
        let preExistingIllness = this.state.preExistingIllnesses;

        let preExistingIllnesses = preExistingIllness && preExistingIllness.map((item, key) => {

            return  <View style={styles.investigationItemWrapper} key={key}>
                        <View style={{
                            flex: .60
                        }}>
                            <Text style={styles.investigationTitle}>{item.testType}</Text>
                            <Text style={styles.SelectedInvestigations}>{item.selectedTests.join( ',  ')}</Text>
                        </View>
                    </View>
        });
        return (
            <View style={{ flex: 1 }}>
                <ScrollView style={{ paddingTop: 22, flex: .8, flexDirection: 'column', backgroundColor: "#F7F8F9", paddingTop: -20 }}>

                    
                    {this.state.isLoadedInfo ?
                        preExistingIllness.length > 0 ? (
                            <View style={{ marginLeft: 20 }}>
                                {preExistingIllnesses}
                            </View>) 
                            :
                            (<Text style={{ alignItems: 'center', alignSelf: 'center', marginTop: 50, color: '#91949B', fontSize: 12 }}>No Pre-existing illness informations...</Text>)
                        : 
                        (<Text style={{ alignItems: 'center', alignSelf: 'center', marginTop: 50, color: '#91949B', fontSize: 12 }}>Pre Existing informations are loading!</Text>)
                    }

                </ScrollView>
            </View>
        );
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
    SelectedInvestigations: {
        fontSize: 9,
        marginTop: 5,
        color: '#00B9FC',
    },
});