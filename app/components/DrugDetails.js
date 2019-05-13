import React from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableHighlight } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CONST from '../lib/constants';
import API from '../lib/api'; 

let db;
export default class DrugDetails extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            drugBrand: {},
            therapiticGeneric: {},
            therapitic: {},
            drugGeneric: {},
            pregCategory: {},
            genericID: null,
            isContentLoaded: false,
            isDetailedInformationNotFound: false

        }
        
        this.API = new API();
    }

    getDataByDrugBrand = (id) => {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(`SELECT * FROM "z_drug_brand" WHERE "brand_id"=?`, [`${id}`], (tx, results) => {


                    resolve(results.rows.item(0));
                });

            }, null, null)
        })
    }

    getTherapiticGeneric = (id) => {
        
        return new Promise((resolve, reject) => {
            db.transaction(
                tx => {

                    tx.executeSql(`SELECT * FROM "z_therapitic_generic" WHERE "generic_id"=?`, [`${id}`], (tx, results) => {

                        resolve(results.rows.item(0));
                    });

                }, null, null);
        });
    }

    getTherapitic = (id) => {
        
        return new Promise((resolve, reject) => {
            db.transaction(
                tx => {

                    tx.executeSql(`SELECT * FROM "z_therapitic" WHERE "therapitic_id"=?`, [`${id}`], (tx, results) => {

                        resolve(results.rows.item(0));
                    });

                }, null, null);
        });
    }
    getDrugGeneric = (id) => {
        
        return new Promise((resolve, reject) => {
            db.transaction(
                tx => {

                    tx.executeSql(`SELECT * FROM "z_drug_generic" WHERE "generic_id"=?`, [`${id}`], (tx, results) => {

                        resolve(results.rows.item(0));
                    });

                }, null, null);
        });
    }
    getPregCategory = (id) => {
        
        return new Promise((resolve, reject) => {
            db.transaction(
                tx => {

                    tx.executeSql(`SELECT * FROM "z_pregnancy_category" WHERE "pregnancy_id"=?`, [`${id}`], (tx, results) => {

                        resolve(results.rows.item(0));
                    });

                }, null, null);
        });
    }

    async componentDidMount(){

        
        let id = this.props.navigation.state.params.id;
        if(!db){
            db = SQLite.openDatabase({ name: "drugDatabase", createFromLocation: "~/drugDatabase.db" });
        }
        
        try {
            let getDataByDrugBrand = await this.getDataByDrugBrand(id);
            let getTherapiticGeneric = await this.getTherapiticGeneric(getDataByDrugBrand.generic_id);
            let getTherapitic = await this.getTherapitic(getTherapiticGeneric.therapitic_id);
            let getDrugGeneric = await this.getDrugGeneric(getDataByDrugBrand.generic_id);
            let getPregCategory = await this.getPregCategory(getDrugGeneric.pregnancy_category_id);

            this.setState({
                drugBrand: getDataByDrugBrand,
                therapiticGeneric: getTherapiticGeneric,
                therapitic: getTherapitic,
                drugGeneric: getDrugGeneric,
                pregCategory: getPregCategory,
                isContentLoaded: true,
                genericID: getDataByDrugBrand.generic_id,
            });
        } catch (error) {
            console.log('Not found all Data',error);
            this.setState({ isDetailedInformationNotFound: true });
        }
        
    }

    navigateToBrands = async() => {
        await this.API._storeData("genericID", this.state.genericID);
        this.props.navigation.navigate("DrugDatabase", { genericID: this.state.genericID});
    }

    render(){
        let state = this.state;
        if (state.isContentLoaded) {
            return (
                <View style={{ flex: 1, backgroundColor: CONST.COLORS.WHITE }}>
                    <View style={styles.headerWrapper}>
                        <View style={{ marginBottom: 5 }}>
                            <Text><Text style={styles.header}>{state.drugBrand.brand_name}</Text>{' '}<Text style={styles.headerSuf}>{state.drugBrand.strength}</Text></Text>
                            <Text style={styles.subHeader}>{state.drugBrand.form}</Text>
                            <Text style={styles.subHeader}>{state.drugBrand.generic_name}</Text>
                            <Text style={styles.subHeader}>{state.drugBrand.company_name}</Text>
                        </View>
                        <TouchableHighlight underlayColor={CONST.COLORS.THEME_COLOR} onPress={this.navigateToBrands}>
                            <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: CONST.COLORS.UNDERLAY_COLOR, padding: 3, elevation: 2, width: '40%' }}>
                                <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Other Brands</Text>
                                <AntDesign name="arrowright" size={20} color="#FFF" />
                            </View>
                        </TouchableHighlight>
                    </View>
                    <View style={{ flex: 1 }}>
                        <ScrollView style={styles.description}>
                            <Text style={styles.descriptionItemWrapper}>
                                <Text style={styles.descriptionItemTitle}>Pack Sizess:</Text>{' '}
                                <Text style={styles.descriptionItemContent}>{state.drugBrand.packsize}</Text>
                            </Text>
                            <Text style={styles.descriptionItemWrapper}>
                                <Text style={styles.descriptionItemTitle}>Price:</Text>{' '}
                                <Text style={styles.descriptionItemContent}>{state.drugBrand.price}</Text>
                            </Text>
                            <Text style={styles.descriptionItemWrapper}>
                                <Text style={styles.descriptionItemTitle}>Drug Class:</Text>{' '}
                                <Text style={styles.descriptionItemContent}>{state.therapitic.therapitic_name}</Text>
                            </Text>
                            <Text style={styles.descriptionItemWrapper}>
                                <Text style={styles.descriptionItemTitle}>Adult Dose:</Text>{' '}
                                <Text style={styles.descriptionItemContent}>{state.drugGeneric.adult_dose}</Text>
                            </Text>
                            <Text style={styles.descriptionItemWrapper}>
                                <Text style={styles.descriptionItemTitle}>Child Dose:</Text>{' '}
                                <Text style={styles.descriptionItemContent}>{state.drugGeneric.child_dose}</Text>
                            </Text>
                            <Text style={styles.descriptionItemWrapper}>
                                <Text style={styles.descriptionItemTitle}>Renal Dose:</Text>{' '}
                                <Text style={styles.descriptionItemContent}>{state.drugGeneric.renal_dose}</Text>
                            </Text>
                            <Text style={styles.descriptionItemWrapper}>
                                <Text style={styles.descriptionItemTitle}>Administration:</Text>{' '}
                                <Text style={styles.descriptionItemContent}>{state.drugGeneric.administration}</Text>
                            </Text>
                            <Text style={styles.descriptionItemWrapper}>
                                <Text style={styles.descriptionItemTitle}>Indication:</Text>{' '}
                                <Text style={styles.descriptionItemContent}>{state.drugGeneric.indication}</Text>
                            </Text>
                            <Text style={styles.descriptionItemWrapper}>
                                <Text style={styles.descriptionItemTitle}>Contraindiction:</Text>{' '}
                                <Text style={styles.descriptionItemContent}>{state.drugGeneric.contra_indication}</Text>
                            </Text>
                            <Text style={styles.descriptionItemWrapper}>
                                <Text style={styles.descriptionItemTitle}>Side Effect:</Text>{' '}
                                <Text style={styles.descriptionItemContent}>{state.drugGeneric.side_effect}</Text>
                            </Text>
                            <Text style={styles.descriptionItemWrapper}>
                                <Text style={styles.descriptionItemTitle}>Pregnancy Category:</Text>{' '}
                                <Text style={styles.descriptionItemContent}>{state.pregCategory.pregnancy_name + '\n\n' + state.pregCategory.pregnancy_description}</Text>
                            </Text>
                            <Text style={styles.descriptionItemWrapper}>
                                <Text style={styles.descriptionItemTitle}>Mode of Action:</Text>{' '}
                                <Text style={styles.descriptionItemContent}>{state.drugGeneric.mode_of_action}</Text>
                            </Text>
                            <Text style={[styles.descriptionItemWrapper, { paddingBottom: 10 }]}>
                                <Text style={styles.descriptionItemTitle}>Interaction:</Text>{' '}
                                <Text style={styles.descriptionItemContent}>{state.drugGeneric.interaction}</Text>
                            </Text>
                        </ScrollView>
                    </View>
                </View>
            )
        }
        else {

            if (state.isDetailedInformationNotFound) {

                return (
                    <ScrollView style={styles.description}>
                        <View style={{
                            padding: 10,
                            marginTop: 20
                        }}>
                            <Text>Sorry, But we do not found any detailed information for this drug</Text>
                        </View>
                    </ScrollView>
                );
            } else {
                return (
                    <ScrollView style={styles.description}>
                        <View style={{
                            padding: 10,
                            marginTop: 20
                        }}>
                            <Text>Please Wait, Drug informations are loading...</Text>
                        </View>
                    </ScrollView>
                );
            }

        }
    }
}

const styles = StyleSheet.create({
    headerWrapper: {
        backgroundColor: CONST.COLORS.THEME_COLOR,
        padding: 20,
        paddingTop: 0
    },
    header: {
        color: CONST.COLORS.WHITE,
        fontSize: 22,
        fontWeight: 'bold'
    },
    headerSuf: {
        color: CONST.COLORS.WHITE,
        fontSize: 18
    },
    subHeader: {
        color: CONST.COLORS.WHITE,
        fontSize: 18
    },
    description: {
        flex: 1,
        backgroundColor: CONST.COLORS.WHITE
    },
    descriptionItemWrapper: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10
    }, 
    descriptionItemTitle: {
        fontWeight: 'bold'
    },
    descriptionItemContent: {

    }
})