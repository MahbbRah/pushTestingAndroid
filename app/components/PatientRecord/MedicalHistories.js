import React from 'react';
import { View, StyleSheet, Text, ScrollView} from 'react-native';
import CONST from '../../lib/constants';
import API from '../../lib/api';



export default class MedicalHistories extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            medicalHistories: [],
            isLoadedInfo: false
        };
        this.API = new API();
    }

    async componentDidMount() {

        const uri = CONST.BASE_URL + CONST.APIS.GET_PATIENT_OTHER_HISTORY;
        const payload = {
            patient_id: this.props.navigation.state.params.patientID
        };

        const getHistories = await this.API.POST(uri, payload);

        if (getHistories.status === 'success') {

            this.setState({
                medicalHistories: JSON.parse(getHistories.response.patient_histories).medicalHistories,
                isLoadedInfo: true,
            });
        } else {
            this.setState({
                isLoadedInfo: true,
            })
        }
    }


    render() {

        let medicalHistory = this.state.medicalHistories;

        let medicalHistories = medicalHistory && medicalHistory.map((item, key) => {

            let familyHistoryItems = ['HTN', 'DM', 'Stroke', 'IHD', 'Kidney disease', 'Arthritis', 'Asthma', 'Allergies', 'Epilepsy', 'Dyslipidaemia', 'Others']

            return <View style={styles.itemWrapper} key={key}>
                        <View style={{
                            flexDirection: 'row',
                        }}>
                    <Text style={styles.checkBoxTextStyle}>{item.historyName}</Text>
                    <Text style={styles.checkboxStyle}>YES</Text>
                        </View>
                        {!familyHistoryItems.includes(item.historyName) &&
                            (<View style={{
                                width: '90%',
                                marginBottom: 5
                            }}>
                                <Text style={styles.SideNodesHeading}>Notes: </Text>
                                <Text style={styles.inputFieldStyle}>
                                    {item.history}
                                </Text>
                            </View>)
                        }
                    </View>
        });
        return (
            <View style={{ flex: 1 }}>
                <ScrollView style={{ paddingTop: 22, flex: .8, flexDirection: 'column', backgroundColor: "#F7F8F9", paddingTop: -20 }}>

                    <View style={{
                        marginTop: 20,
                        marginLeft: 20

                    }}>
                        {this.state.isLoadedInfo ?
                            medicalHistory.length > 0 ? (
                                <View style={{ marginLeft: 20 }}>
                                    {medicalHistories}
                                </View>)
                                :
                                (<Text style={{ alignItems: 'center', alignSelf: 'center', marginTop: 50, color: '#91949B', fontSize: 12 }}>No medical history informations...</Text>)
                            :
                            (<Text style={{ alignItems: 'center', alignSelf: 'center', marginTop: 50, color: '#91949B', fontSize: 12 }}>Medical informations are loading!</Text>)
                        }
                        
                    </View>
                </ScrollView>
                
            </View>
        );
    }
}

const styles = StyleSheet.create({
    checkboxStyle: {
        borderWidth: 1,
        borderColor: '#B3B5C0',
        backgroundColor: '#F7F8F9',
        padding: 5,
        marginTop: 0,
        fontSize: 11,
        fontWeight: '200',
        color: '#B3B5C0'
    },
    checkboxStyleSquare: {
        borderWidth: 0,
        backgroundColor: '#F7F8F9',
        padding: 0,
        marginTop: 0,
        marginRight: -7
    },
    inputFieldStyle: {
        backgroundColor: '#FFF',
        borderBottomColor: '#ddd',
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        borderLeftColor: '#DDD',
        borderRightColor: '#DDD',
        borderRightWidth: 1,
        padding: 12,
        fontSize: 12,
    },
    checkBoxTextStyle: {
        fontWeight: '300', 
        width: '40%'
    },
    SideNodesHeading: {
        color: '#B3B5C0',
        fontSize: 11,
        marginBottom: 5,
    },
    itemWrapper: { 
        marginBottom: 20, 
    }
});