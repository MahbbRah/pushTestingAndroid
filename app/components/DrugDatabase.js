import React from 'react';
import { View, TouchableHighlight, Text, StyleSheet, FlatList, Image, Keyboard } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import CONST from '../lib/constants'
import { SearchBar } from 'react-native-elements'
import API from '../lib/api';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const tradeName = 1;
const generic = 2;
const indication = 3;
let searchTimer;

let db;

export default class DrugDatabase extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            search: '',
            activeIndex: 1,
            isLoading: true,
            drugs: [],
            genericResults: [],
            indicationResults: [],
            keyboardShown: false,
        }
        this.API = new API();
    }

    async componentDidMount(){

        db = SQLite.openDatabase({ name: "drugDatabase", createFromLocation: "~/drugDatabase.db" },
         (successmsg) => console.log(successmsg), (errormsg) => console.log(errormsg));

        db.transaction(tx => {
            tx.executeSql(`SELECT * FROM "z_drug_brand" LIMIT 20`, [], (tx, results) => {

                let totalResCount = results.rows.length;
                let totalResults = [];

                for (let i = 0; i < totalResCount; i++) {
                    totalResults.push(results.rows.item(i));
                }

                this.setState({
                    drugs: totalResults
                }, function () { })
            });
        }, (err) => console.log(err));

    }

    /* collecting Keyboard Event for the cross bar to increase or decrease height */
    componentWillMount() {
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

    async componentWillReceiveProps() {

        let genericID;
        try {
            genericID = this.props.navigation.state.params.genericID;
        } catch (error) {
            console.log('generic id Error: ', error)
        }
        //As initial navigating to drugdatabase the generic id doesn't show, so did a little bit of hack to store and use via localStorage for the f time.
        if(!genericID) {
            try {
                genericID = await this.API._retrieveData("genericID");
                await this.API._removeItem("genericID");
            } catch (error) {}

        }


        if (genericID) {

            db.transaction(tx => {
                tx.executeSql(`SELECT * FROM "z_drug_brand" WHERE generic_id="${genericID}"`, [], (tx, results) => {

                    let totalResCount = results.rows.length;
                    let totalResults = [];

                    for (let i = 0; i < totalResCount; i++) {
                        totalResults.push(results.rows.item(i));
                    }

                    this.setState({
                        drugs: totalResults.slice(0, 60),
                    })
                });
            });
            return;
        }
    }

    getResultByGeneric = async(id) => {

        db.transaction(tx => {
            tx.executeSql(`SELECT * FROM "z_drug_brand" WHERE generic_id="${id}"`, [], (tx, results) => {

                let totalResCount = results.rows.length;
                let totalResults = [];

                for (let i = 0; i < totalResCount; i++) {
                    totalResults.push(results.rows.item(i));
                }

                this.setState({
                    genericResults: totalResults.slice(0, 60),
                    indicationResults: [],
                })
            });
        });
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
            genericResults: [],
        })

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
                                drugs: totalResults.slice(0, 60),
                                genericResults: [],
                                indicationResults: [],
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
                                drugs: totalResults.slice(0, 60),
                                genericResults: [],
                                indicationResults: [],
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
        
        if(text === '') {
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

    removeGenericResult = () => {

        let isRemoveDrugs = this.props.navigation.state.params !== undefined ? true : false;
        
        this.setState({
            genericResults: [],
            indicationResults: [],
            drugs: isRemoveDrugs ? [] : this.state.drugs,
        })
    }

    render(){
        
        let indicationRes = this.state.indicationResults;
        let genericRes = this.state.genericResults;
        let drugData = genericRes.length > 0 ? genericRes : (indicationRes.length > 0 ? indicationRes : this.state.drugs)

        renderGenericBackButton = (
        <TouchableHighlight
            underlayColor={CONST.COLORS.THEME_COLOR}
            style={[styles.renderingBtnWrapper, { height: (genericRes.length > 0 || indicationRes.length > 0) && this.state.keyboardShown  ? '15%' : '8%'}]} 
            onPress={this.removeGenericResult}>
            <View style={{flexDirection: 'row', flex: 1}}>
                <Text style={{ marginLeft: 5, color: '#FFF', fontWeight: 'bold', flex: .9 }}>Drug List</Text>
                <MaterialIcons name="backspace" size={25} color='#fff' style={{flex: .1, marginTop: -2}} />
            </View>
        </TouchableHighlight>
        );

        return(
            <View style={{flex:1, backgroundColor: CONST.COLORS.THEME_COLOR}}>
                <SearchBar
                    lightTheme
                    clearIcon={{ color: CONST.COLORS.THEME_COLOR }}
                    searchIcon={true} 
                    placeholder='Type to Search' 
                    containerStyle={{backgroundColor: CONST.COLORS.THEME_COLOR, borderTopColor: CONST.COLORS.THEME_COLOR, borderBottomColor: CONST.COLORS.THEME_COLOR}} 
                    inputStyle={{backgroundColor: CONST.COLORS.WHITE, color: '#000', fontSize: 12}}
                    value={this.state.search} 
                    onChangeText={ text => this.searchDrugs(text)}
                    />
                <View style={styles.tabView}> 
                    <TouchableHighlight 
                    style={[styles.tabItems, (this.state.activeIndex == tradeName) && styles.tabItemsActive]} 
                        onPress={() => this.setState({ activeIndex: tradeName, drugs: []})} 
                    underlayColor={CONST.COLORS.WHITE}>
                        <Text style={[{color: CONST.COLORS.INACTIVE_COLOR}, (this.state.activeIndex == tradeName) && styles.tabItemsActiveText]}>TRADE NAME</Text>
                    </TouchableHighlight>
                    
                    <TouchableHighlight 
                    style={[styles.tabItems, (this.state.activeIndex == generic) && styles.tabItemsActive]} 
                    onPress={()=> this.setState({activeIndex: generic, drugs: []})} 
                    underlayColor={CONST.COLORS.WHITE}>
                        <Text style={[{color: CONST.COLORS.INACTIVE_COLOR}, (this.state.activeIndex == generic) && styles.tabItemsActiveText]}>GENERIC</Text>
                    </TouchableHighlight> 

                    <TouchableHighlight 
                    style={[styles.tabItems, (this.state.activeIndex == indication) && styles.tabItemsActive]} 
                        onPress={() => this.setState({ activeIndex: indication, drugs: []})} 
                    underlayColor={CONST.COLORS.WHITE}>
                        <Text style={[{color: CONST.COLORS.INACTIVE_COLOR}, (this.state.activeIndex == indication) && styles.tabItemsActiveText]}>INDICATION</Text>
                    </TouchableHighlight> 
                </View>
                {genericRes.length > 0 || indicationRes.length > 0 ? renderGenericBackButton : null}
                <View style={styles.container}>
                    <FlatList
                        keyboardShouldPersistTaps="always"
                        initialNumToRender={10}
                        data={drugData}
                        extraData={drugData}
                        renderItem={({item, index}) => {
                            let DrugIcon =  this.getMedicineIcon(item.form);
                            if (this.state.activeIndex === 2) {

                                if(this.state.genericResults.length > 0) {
                                    return (<View>
                                        <TouchableHighlight onPress={() => this.props.navigation.navigate('DrugDetails', { id: item.brand_id })} key={item.id} underlayColor={CONST.COLORS.UNDERLAY_COLOR} style={styles.item}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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

                                if(this.state.indicationResults.length > 0) {
                                    return (<View>
                                        <TouchableHighlight onPress={() => this.props.navigation.navigate('DrugDetails', { id: item.brand_id })} key={item.id} underlayColor={CONST.COLORS.UNDERLAY_COLOR} style={styles.item}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 4 }}>
                                                <Image style={{ height: 64, width: 64, }} source={DrugIcon} />
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
                                
                            } else {
                                return (<TouchableHighlight onPress={() => this.props.navigation.navigate('DrugDetails', { id: item.brand_id })} key={item.id} underlayColor={CONST.COLORS.UNDERLAY_COLOR} style={styles.item}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 4 }}>
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
                                </TouchableHighlight>);
                            }
                            
                        }}
                        keyExtractor={(item) => this.getRandomInt(item.id) + item.id + this.getRandomInt(item.id)} 
                    />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
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
    item: {
        borderBottomColor: '#DDD',
        borderBottomWidth: .5,
        paddingBottom: 8,
    },
    renderingBtnWrapper: {
        backgroundColor: CONST.COLORS.THEME_COLOR,
        marginTop: 0,
        marginBottom: 1,
        paddingTop: 5,
        paddingBottom: 5,
        height: '8%',
    }
    
})