import React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import CONST from '../../lib/constants';
import API from '../../lib/api';


export default class LabInvestigationReports extends React.Component {

    constructor(props) {
        super(props);
        // this.currentState = this.props.navigation.state.params.state;
        this.state = {
            // investigations: this.props.navigation.state.params.investigations,
        };
        // this.API = new API();
    }


    render() {

        // let investigations = this.state.investigations;

        // let investigationss = investigations.map((item, key) => {

        //     return <View style={styles.investigationItemWrapper} key={key}>
        //         <View style={{
        //             flex: .60
        //         }}>
        //             <Text style={styles.investigationTitle}>{item.testType}</Text>
        //             <Text style={styles.SelectedInvestigations}>{item.selectedTests.join(',  ')}</Text>
        //         </View>
        //     </View>
        // });

        return (
            <View style={{ flex: 1 }}>
                <ScrollView style={{ paddingTop: 22, flex: .8, flexDirection: 'column', backgroundColor: "#F7F8F9", paddingTop: -20 }}>

                    <View style={{ marginLeft: 20}}>
                        {/* {investigationss} */}
                    </View>

                    {/* {investigations.length > 0 ? (
                        <View style={{ marginLeft: 20 }}>

                            {investigationss}
                        </View>
                    ) :

                        (<Text style={{ alignItems: 'center', alignSelf: 'center', marginTop: 50, color: '#91949B', fontSize: 12 }}>No Lab Investigation informations...</Text>)

                    } */}

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