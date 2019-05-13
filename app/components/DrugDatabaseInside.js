import React from 'react';
import { View, TouchableHighlight, Text, StyleSheet, FlatList, Image, ScrollView, KeyboardAvoidingView, Keyboard } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import {heightPercentageToDP as percentageHeight } from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';


import CONST from '../lib/constants'
import { SearchBar } from 'react-native-elements'
import API from '../lib/api';


const tradeName = 1;
const generic = 2;
const indication = 3;
let searchTimer;

let db;

let newThis;

export default class DrugDatabaseInside extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            search: '',
            activeIndex: 1,
            isLoading: true,
            drugs: [],
            isGenericByDrugEnabled: false,
            generic_id: null,
            genericResults: [],
            genericID: null,
            drugBrand: {},
            therapiticGeneric: {},
            therapitic: {},
            drugGeneric: {},
            pregCategory: {},
            indicationResults: [],
            isContentLoaded: false,
            isDetailedInformationNotFound: false,
            fromOtherBrands: false, // took this state to controlling the drug list header bar
            keyboardShown: false,

        }
        this.API = new API();
    }

 

    /* collecting Keyboard Event for the cross bar to increase or decrease height */
    componentWillMount() {

        newThis = this;
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidShow = () => {
        this.setState({
            keyboardShown: true
        });
    }

    _keyboardDidHide = () => {
        this.setState({
            keyboardShown: false
        });
    }
    /* End of the collecting tab bar. */

    async componentDidMount(){


        if (!db) {

            db = SQLite.openDatabase({ name: "drugDatabase", createFromLocation: "~/drugDatabase.db" })
        }

        db.transaction(tx => {
            tx.executeSql(`SELECT * FROM "z_drug_brand" LIMIT 20`, [], (tx, results) => {

                let totalResCount = results.rows.length;
                let totalResults = [];

                for (let i = 0; i < totalResCount; i++) {
                    totalResults.push(results.rows.item(i));
                }

                this.setState({
                    isLoading: false,
                    drugs: totalResults
                }, function () { })
            });
        }, (err) => console.log(err));
    }

    getResultByGeneric = async (id) => {

        db.transaction(tx => {
            tx.executeSql(`SELECT * FROM "z_drug_brand" WHERE generic_id="${id}"`, [], (tx, results) => {

                let totalResCount = results.rows.length;
                let totalResults = [];

                for (let i = 0; i < totalResCount; i++) {
                    totalResults.push(results.rows.item(i));
                }

                this.setState({
                    genericResults: totalResults.slice(0, 60),
                    isLoading: false,
                })
            });
        });
    }

    searchDrugs(text) {
        if (text.length >= 2) {
            clearTimeout(searchTimer);
            searchTimer = setTimeout(async () => {
                if (this.state.activeIndex === 1) {

                    db.transaction(tx => {
                        tx.executeSql(`SELECT * FROM "z_drug_brand" WHERE "brand_name" LIKE "${text}%"`, [], (tx, results) => {

                            let totalResCount = results.rows.length;
                            let totalResults = [];

                            for (let i = 0; i < totalResCount; i++) {
                                totalResults.push(results.rows.item(i));
                            }

                            this.setState({
                                isLoading: false,
                                drugs: totalResults,
                                genericResults: []
                            }, function () { })
                        });
                    });
                }
                if (this.state.activeIndex === 2) {

                    db.transaction(tx => {
                        tx.executeSql(`SELECT * FROM "z_drug_generic" WHERE "generic_name" LIKE "${text}%"`, [], (tx, results) => {

                            let totalResCount = results.rows.length;
                            let totalResults = [];

                            for (let i = 0; i < totalResCount; i++) {
                                totalResults.push(results.rows.item(i));
                            }

                            this.setState({
                                isLoading: false,
                                drugs: totalResults.slice(0, 60),
                                genericResults: []
                            }, function () { })
                        });
                    });
                }
                if (this.state.activeIndex === 3) {
                    db.transaction(tx => {
                        tx.executeSql(`SELECT * FROM "z_indication" where indication_name LIKE "%${text}%"`, [], (tx, results) => {

                            let totalResCount = results.rows.length;
                            let totalResults = [];

                            for (let i = 0; i < totalResCount; i++) {
                                totalResults.push(results.rows.item(i));
                            }

                            this.setState({
                                drugs: totalResults.slice(0, 60),
                                genericResults: [],
                                indicationResults: [],
                            }, function () { })
                        });
                    });
                }
            }, 50);
        } else {
            this.setState({
                drugs: []
            }, function () { })
        }
        
        if (text === '') {
            this.setState({
                indicationResults: [],
                genericResults: [],
                search: text
            })
        } else {
            this.setState({
                search: text
            });
        }
    }

    setDrugByGenericId = () => {

        let id = this.state.generic_id;

        if (id) {

            db.transaction(tx => {
                tx.executeSql(`SELECT * FROM "z_drug_brand" WHERE generic_id="${id}"`, [], (tx, results) => {
                    
                    let totalResCount = results.rows.length;
                    let totalResults = [];

                    for (let i = 0; i < totalResCount; i++) {
                        totalResults.push(results.rows.item(i));
                    }

                    this.setState({
                        isLoading: false,
                        drugs: totalResults.slice(0, 60)
                    }, function () { })
                });
            });
        }



    }

    
    getMedicineIcon = (type='') => {

        type =  type.toLowerCase();
        const icons = {
            powder: require('../assets/powder.png'),
            drop: require('../assets/drops.png'),
            tablet: require('../assets/item-1.png'),
            syringe: require('../assets/syringe.png'),
            capsule: require('../assets/capsule.png'),
            spray: require('../assets/spray.png'),
            cream: require('../assets/ointment.png'),
            transfusion: require('../assets/transfusion.png'),
            syrup: require('../assets/syrup.png'),
            drug: require('../assets/item-3.png'),
            suspension: require('../assets/suspension.png'),
            suppository: require('../assets/suppository.png'),
        };


        if(type.includes('tablet')) {
            return icons.tablet;
        }
        if (type.includes('solution')) {
            return icons.drug;
        }
        if (type.includes('capsule')) {
            return icons.capsule;
        }
        if (type.includes('drop')) {
            return icons.drop;
        }
        if (type.includes('gel')) {
            return icons.spray;
        }
        if (type.includes('ointment')) {
            return icons.cream;
        }
        if (type.includes('cream')) {
            return icons.cream;
        }
        if (type.includes('syrup')) {
            return icons.syrup;
        }
        if (type.includes('injection')) {
            return icons.syringe;
        }
        if (type.includes('powder')) {
            return icons.powder;
        }
        if (type.includes('spray')) {
            return icons.spray;
        }
        if (type.includes('suspension')) {
            return icons.suspension;
        }
        if (type.includes('suppository')) {
            return icons.suppository;
        }

        return icons.drug;
    }

    getRandomInt = (max) =>  {
        return Math.floor(Math.random() * Math.floor(max));
    }

    // enableDisableGenericView = (id) => {

    //     this.setState({ generic_id: id, drugs: [] })
    // }

    /* get drug detail information by using these methods */

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

    

    showDrugDetail = async(id) => {

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
                genericID: getDataByDrugBrand.generic_id,
                isContentLoaded: true,
            });
        } catch (error) {
            console.log('Not found all Data', error);
            this.setState({ isDetailedInformationNotFound: true });
        }
    }

    removeDetailView = () => {

        this.setState({
            isContentLoaded: false,
            isDetailedInformationNotFound: false
        });
    }


    removeGenericResult = () => {

        this.setState({
            genericResults: [],
            indicationResults: [],
            drugs: this.state.fromOtherBrands ? [] : this.state.drugs,
            fromOtherBrands: false,
        })
    }

    navigateToBrands = () => {

        db.transaction(tx => {
            tx.executeSql(`SELECT * FROM "z_drug_brand" WHERE generic_id="${this.state.genericID}"`, [], (tx, results) => {

                let totalResCount = results.rows.length;
                let totalResults = [];

                for (let i = 0; i < totalResCount; i++) {
                    totalResults.push(results.rows.item(i));
                }
                this.setState({
                    isContentLoaded: false,
                    isDetailedInformationNotFound: false,
                    drugs: totalResults.slice(0, 60),
                    activeIndex: 1,
                    genericResults: [],
                    therapiticGeneric: [],
                    fromOtherBrands: true,
                })
            });
        });
        // this.setState({
        //     isContentLoaded: false,
        //     isDetailedInformationNotFound: false
        // })
    }

    getResultByIndication = async(id) => {

        let getGenericIds =  () => {
            return new Promise((resolve, reject) => {
                db.transaction(
                    tx => {

                        tx.executeSql(`SELECT * FROM "z_indication_generic_index" WHERE indication_id=?`, [`${id}`], (tx, results) => {

                            let totalResCount = results.rows.length;
                            let totalResults = [];

                            for (let i = 0; i < totalResCount; i++) {
                                //bit of hacks to quoting with double quotes for doing the query properly.
                                totalResults.push(`"${results.rows.item(i).generic_id}"`);
                            }

                            resolve(totalResults);
                        });

                    }, null, null);
            });
        }
        let getOtherDetails =  () => {
            return new Promise((resolve, reject) => {
                db.transaction(
                    tx => {
                        

                        tx.executeSql(`SELECT * FROM z_drug_brand WHERE generic_id IN(${genericResult.join(",")})`, [], (tx, otherDetailResults) => {

                            let totalResCount = otherDetailResults.rows.length;
                            let totalResults = [];

                            for (let i = 0; i < totalResCount; i++) {
                                totalResults.push(otherDetailResults.rows.item(i));
                            }
                            resolve(totalResults);
                        });

                    }, null, null);
            });
        }
        let genericResult = await getGenericIds();

        let getOtherDetail = await getOtherDetails();
        this.setState({
            indicationResults: getOtherDetail.slice(0, 60),
        })
    }


    render(){

        renderGenericBackButton = (
            <TouchableHighlight
                style={[styles.renderingBtnWrapper, { height: (this.state.genericResults.length > 0 || this.state.indicationResults.length > 0) && this.state.keyboardShown ? '20%' : '8%' }]}
                underlayColor={CONST.COLORS.THEME_COLOR}
                onPress={this.removeGenericResult}>
                <View style={{ flexDirection: 'row', flex: 1 }}>
                    <Text style={{ marginLeft: 5, color: '#FFF', fontWeight: 'bold', flex: .9 }}>Drug List</Text>
                    <MaterialIcons name="backspace" size={25} color='#fff' style={{ flex: .1, marginTop: -2 }} />
                </View>
            </TouchableHighlight>
        );

        let indicationRes = this.state.indicationResults;
        let genericRes = this.state.genericResults;
        let drugsToRender = genericRes.length > 0 ? genericRes : (indicationRes.length > 0 ? indicationRes : this.state.drugs)

        if(this.state.isContentLoaded) {
            return (
                <RenderDescription {...this.state}></RenderDescription>
            )
        } else {
            if (this.state.generic_id === null) {
                return (
                    <View style={{ flex: 1, backgroundColor: CONST.COLORS.THEME_COLOR }}>
                        <SearchBar
                            lightTheme
                            clearIcon={{ color: CONST.COLORS.THEME_COLOR }}
                            searchIcon={true}
                            placeholder='Type to Search'
                            containerStyle={{ backgroundColor: CONST.COLORS.THEME_COLOR, borderTopColor: CONST.COLORS.THEME_COLOR, borderBottomColor: CONST.COLORS.THEME_COLOR }}
                            inputStyle={{ backgroundColor: CONST.COLORS.WHITE, color: '#000' }}
                            value={this.state.search}
                            onChangeText={text => this.searchDrugs(text)}
                        />
                        <View style={styles.tabView}>
                            <TouchableHighlight
                                style={[styles.tabItems, (this.state.activeIndex == tradeName) && styles.tabItemsActive]}
                                onPress={() => this.setState({ activeIndex: tradeName, drugs: [] })}
                                underlayColor={CONST.COLORS.WHITE}>
                                <Text style={[{ color: CONST.COLORS.INACTIVE_COLOR }, (this.state.activeIndex == tradeName) && styles.tabItemsActiveText]}>TRADE NAME</Text>
                            </TouchableHighlight>

                            <TouchableHighlight
                                style={[styles.tabItems, (this.state.activeIndex == generic) && styles.tabItemsActive]}
                                onPress={() => this.setState({ activeIndex: generic, drugs: [] })}
                                underlayColor={CONST.COLORS.WHITE}>
                                <Text style={[{ color: CONST.COLORS.INACTIVE_COLOR }, (this.state.activeIndex == generic) && styles.tabItemsActiveText]}>GENERIC</Text>
                            </TouchableHighlight>

                            <TouchableHighlight
                                style={[styles.tabItems, (this.state.activeIndex == indication) && styles.tabItemsActive]}
                                onPress={() => this.setState({ activeIndex: indication, drugs: [] })}
                                underlayColor={CONST.COLORS.WHITE}>
                                <Text style={[{ color: CONST.COLORS.INACTIVE_COLOR }, (this.state.activeIndex == indication) && styles.tabItemsActiveText]}>INDICATION</Text>
                            </TouchableHighlight>
                        </View>
                        <KeyboardAvoidingView style={styles.container}>
                            {genericRes.length > 0 || indicationRes.length > 0 ? renderGenericBackButton : null}
                            <FlatList
                                keyboardShouldPersistTaps="always"
                                data={drugsToRender}
                                renderItem={({ item, index }) => {
                                    let DrugIcon = this.getMedicineIcon(item.form);
                                    if (this.state.activeIndex === 2) {

                                        if (this.state.genericResults.length > 0) {
                                            return (<View>
                                                <TouchableHighlight onPress={() => { this.props.ModalExecuter(item); }} key={item.id} underlayColor={CONST.COLORS.UNDERLAY_COLOR} style={styles.item}>
                                                    <View style={{flexDirection: 'row'}}>
                                                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: .9 }}>
                                                            <Image style={{ height: 64, width: 64 }} source={DrugIcon} />
                                                            <View style={{ flexDirection: 'column', paddingLeft: 10 }}>
                                                                <Text>
                                                                    <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{item.brand_name}</Text>
                                                                    {' '}
                                                                    <Text style={{ color: CONST.COLORS.INACTIVE_COLOR, fontSize: 16 }}>{item.strength}</Text>
                                                                </Text>
                                                                <Text style={{ fontSize: 12, color: '#CCC' }}>{item.company_name}</Text>
                                                                <Text style={{ color: CONST.COLORS.INACTIVE_COLOR, fontSize: 15 }}>{item.form}</Text>
                                                                <Text style={{ color: CONST.COLORS.THEME_COLOR, fontSize: 16 }}>{item.generic_name.length > 20 ? item.generic_name.substring(0, 45) + '..' : item.generic_name}</Text>
                                                            </View>
                                                        </View>
                                                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: .1 }}>
                                                            <TouchableHighlight
                                                                underlayColor="transparent"
                                                                onPress={() => this.showDrugDetail(item.brand_id)}
                                                            >
                                                                <Entypo
                                                                    name="info-with-circle"
                                                                    size={27} style={{ color: CONST.COLORS.THEME_COLOR }}
                                                                />
                                                            </TouchableHighlight>
                                                        </View>
                                                    </View>
                                                </TouchableHighlight>
                                            </View>);
                                        } else {
                                            return (<TouchableHighlight onPress={() => this.getResultByGeneric(item.generic_id)} key={item.id} underlayColor={CONST.COLORS.UNDERLAY_COLOR} style={styles.item}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <View style={{ flexDirection: 'column', paddingLeft: 10, padding: 7 }}>
                                                        <Text>
                                                            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{item.generic_name}</Text>
                                                        </Text>
                                                    </View>
                                                </View>
                                            </TouchableHighlight>);
                                        }

                                    }

                                    if (this.state.activeIndex === 3) {

                                        if (this.state.indicationResults.length > 0) {
                                            return (<View>
                                                <TouchableHighlight onPress={() => { this.props.ModalExecuter(item); }} key={item.id} underlayColor={CONST.COLORS.UNDERLAY_COLOR} style={styles.item}>
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: .9 }}>
                                                            <Image style={{ height: 64, width: 64 }} source={DrugIcon} />
                                                            <View style={{ flexDirection: 'column', paddingLeft: 10 }}>
                                                                <Text>
                                                                    <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{item.brand_name}</Text>
                                                                    {' '}
                                                                    <Text style={{ color: CONST.COLORS.INACTIVE_COLOR, fontSize: 16 }}>{item.strength}</Text>
                                                                </Text>
                                                                <Text style={{ fontSize: 12, color: '#CCC' }}>{item.company_name}</Text>
                                                                <Text style={{ color: CONST.COLORS.INACTIVE_COLOR, fontSize: 15 }}>{item.form}</Text>
                                                                <Text style={{ color: CONST.COLORS.THEME_COLOR, fontSize: 16 }}>{item.generic_name.length > 20 ? item.generic_name.substring(0, 45) + '..' : item.generic_name}</Text>
                                                            </View>
                                                        </View>
                                                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: .1 }}>
                                                            <TouchableHighlight
                                                                underlayColor="transparent"
                                                                onPress={() => this.showDrugDetail(item.brand_id)}
                                                            >
                                                                <Entypo
                                                                    name="info-with-circle"
                                                                    size={27} style={{ color: CONST.COLORS.THEME_COLOR }}
                                                                />
                                                            </TouchableHighlight>
                                                        </View>
                                                    </View>
                                                </TouchableHighlight>
                                            </View>);
                                        } else {
                                            return (<TouchableHighlight onPress={() => this.getResultByIndication(item.indication_id)} key={item.id} underlayColor={CONST.COLORS.UNDERLAY_COLOR} style={styles.item}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <View style={{ flexDirection: 'column', paddingLeft: 10, padding: 7 }}>
                                                        <Text>
                                                            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{item.indication_name}</Text>
                                                        </Text>
                                                    </View>
                                                </View>
                                            </TouchableHighlight>);
                                        }

                                    }

                                    else {
                                        return (<TouchableHighlight onPress={() => { this.props.ModalExecuter(item); }} key={item.id} underlayColor={CONST.COLORS.UNDERLAY_COLOR} style={styles.item}>
                                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', flex: .9 }}>
                                                    <Image style={{ height: 64, width: 64 }} source={DrugIcon} />
                                                    <View style={{ flexDirection: 'column', paddingLeft: 10 }}>
                                                        <Text>
                                                            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{item.brand_name}</Text>
                                                            {' '}
                                                            <Text style={{ color: CONST.COLORS.INACTIVE_COLOR, fontSize: 16 }}>{item.strength}</Text>
                                                        </Text>
                                                        <Text style={{ fontSize: 12, color: '#CCC' }}>{item.company_name}</Text>
                                                        <Text style={{ color: CONST.COLORS.INACTIVE_COLOR, fontSize: 15 }}>{item.form}</Text>
                                                        <Text style={{ color: CONST.COLORS.THEME_COLOR, fontSize: 16 }}>{item.generic_name.length > 20 ? item.generic_name.substring(0, 45) + '..' : item.generic_name}</Text>
                                                    </View>
                                                </View>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', flex: .1 }}>
                                                    <TouchableHighlight
                                                        underlayColor="transparent"
                                                        onPress={() => this.showDrugDetail(item.brand_id)}
                                                    >
                                                        <Entypo
                                                            name="info-with-circle"
                                                            size={27} style={{ color: CONST.COLORS.THEME_COLOR }}
                                                        />
                                                    </TouchableHighlight>
                                                </View>
                                            </View>
                                        </TouchableHighlight>);
                                    }

                                }}
                                keyExtractor={(item) => this.getRandomInt(item.id) + item.id + this.getRandomInt(item.id)}
                            />
                        </KeyboardAvoidingView>
                    </View>
                )
            } else {
                this.setDrugByGenericId();
                if (this.state.drugs.length === 0) {
                    return (
                        <View style={{ flex: 1, backgroundColor: CONST.COLORS.THEME_COLOR }}>
                            <View style={styles.container}>
                                <ScrollView keyboardShouldPersistTaps="always">
                                    <Text>Please wait, Drugs loading...</Text>
                                </ScrollView>
                            </View>
                        </View>
                    )
                } else {

                    let drugItem = this.state.drugs.map(item => {
                        let DrugIcon = this.getMedicineIcon(item.form);

                        return (
                            <TouchableHighlight onPress={() => this.props.ModalExecuter(item)} key={item.id} underlayColor={CONST.COLORS.UNDERLAY_COLOR} style={styles.item}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                                    <Image style={{ height: 64, width: 64 }} source={DrugIcon} />
                                    <View style={{ flexDirection: 'column', paddingLeft: 10 }}>
                                        <Text>
                                            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{item.brand_name}</Text>
                                            {' '}
                                            <Text style={{ color: CONST.COLORS.INACTIVE_COLOR, fontSize: 16 }}>{item.strength}</Text>
                                        </Text>
                                        <Text style={{ fontSize: 12, color: '#CCC' }}>{item.company_name}</Text>
                                        <Text style={{ color: CONST.COLORS.INACTIVE_COLOR, fontSize: 16 }}>{item.form}</Text>
                                        <Text style={{ color: CONST.COLORS.THEME_COLOR, fontSize: 16 }}>{item.generic_name.length > 20 ? item.generic_name.substring(0, 45) + '..' : item.generic_name}</Text>
                                    </View>
                                </View>
                            </TouchableHighlight>
                        );

                    });
                    return (
                        <View style={{ flex: 1, backgroundColor: CONST.COLORS.THEME_COLOR }}>
                            <View style={styles.container}>
                                <ScrollView keyboardShouldPersistTaps="always">
                                    {drugItem}
                                </ScrollView>
                            </View>
                        </View>
                    )
                }

            }
        }
        
    }
}

function RenderDescription(state) {

    let renderBackButtonOnDetailPage = (
        <View style={{ flexDirection: 'row', backgroundColor: CONST.COLORS.THEME_COLOR }}>
            <TouchableHighlight
                style={{ width: '10%', marginTop: '3%', marginBottom: 13 }}
                onPress={newThis.removeDetailView}
            >
                <Feather name="arrow-left" size={24} style={{ color: '#fff', marginLeft: 10 }} />
            </TouchableHighlight>

        </View>
    );
    if (state.isContentLoaded) {
        return (
            <View style={{ flex: 1, backgroundColor: '#DDD', marginTop: -percentageHeight("7.6%") }}>
                {renderBackButtonOnDetailPage}
                <View style={styles.headerWrapper}>
                    <View style={{ marginBottom: 5 }}>
                        <Text><Text style={styles.header}>{state.drugBrand.brand_name}</Text>{' '}<Text style={styles.headerSuf}>{state.drugBrand.strength}</Text></Text>
                        <Text style={styles.subHeader}>{state.drugBrand.form}</Text>
                        <Text style={styles.subHeader}>{state.drugBrand.generic_name}</Text>
                        <Text style={styles.subHeader}>{state.drugBrand.company_name}</Text>
                    </View>
                    <TouchableHighlight underlayColor={CONST.COLORS.THEME_COLOR} onPress={newThis.navigateToBrands}>
                        <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: CONST.COLORS.UNDERLAY_COLOR, padding: 3, elevation: 2, width: '40%' }}>
                            <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Other Brands</Text>
                            <AntDesign name="arrowright" size={20} color="#FFF" />
                        </View>
                    </TouchableHighlight>
                </View>
                <View style={{ flex: 1 }}>
                    <ScrollView style={styles.description}>
                        <Text style={styles.descriptionItemWrapper}>
                            <Text style={styles.descriptionItemTitle}>Pack Size:</Text>{' '}
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
    tabView: {
        backgroundColor: CONST.COLORS.WHITE,
        flexDirection: 'row',
        elevation: 2
    },
    tabItems: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 15,
        paddingBottom: 15
    },
    tabItemsActive: {
        borderBottomWidth: 1,
        borderBottomColor: CONST.COLORS.THEME_COLOR
    },
    tabItemsActiveText: {
        color: CONST.COLORS.THEME_COLOR
    },
    container: {
        flex: 1,
        paddingTop: 2,
        backgroundColor: CONST.COLORS.WHITE
    },
    container2: {
        flex: 1,
        backgroundColor: CONST.COLORS.WHITE
    },
    item: {
        borderBottomColor: '#DDD',
        borderBottomWidth: .5,
        paddingBottom: 8,
    },
    renderingBtnWrapper: {
        backgroundColor: CONST.COLORS.THEME_COLOR,
        marginTop: 0,
        marginBottom: 7,
        paddingTop: 5,
        paddingBottom: 5,
        height: '8%',
    }
    
})