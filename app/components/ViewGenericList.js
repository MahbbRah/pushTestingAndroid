import React from 'react';
import { View, TouchableHighlight, Text, StyleSheet, FlatList, Image } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import { SearchBar } from 'react-native-elements'
import CONST from '../lib/constants'
import API from '../lib/api';

const tradeName = 1;
const generic = 2;
const indication = 3;
let searchTimer;

let db;

export default class ViewGenericList extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            search: '',
            activeIndex: 1,
            isLoading: true,
            drugs: [],
            originialDB: []
        }
        this.API = new API();
    }

    async componentDidMount(){

        let id = this.props.navigation.state.params.id;

        db = SQLite.openDatabase({ name: "drugDatabase", createFromLocation: "~/drugDatabase.db" })

        db.transaction(tx => {
            tx.executeSql(`SELECT * FROM "z_drug_brand" WHERE generic_id="${id}"`, [], (tx, results) => {

                let totalResCount = results.rows.length;
                let totalResults = [];

                for (let i = 0; i < totalResCount; i++) {
                    totalResults.push(results.rows.item(i));
                }

                this.setState({
                    isLoading: false,
                    drugs: totalResults,
                    originialDB: totalResults
                })
            });
        });
    }

    getMedicineIcon = (type = '') => {

        type = type.toLowerCase();
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


        if (type.includes('tablet')) {
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

    getRandomInt = (max) => {
        return Math.floor(Math.random() * Math.floor(max));
    }
    /* Failed atttempt on searching via drugs.. too distracting mind! Will do later. */
    searchDrugs = (text) =>  {
        if (text.length >= 2) {
            clearTimeout(searchTimer);
            searchTimer = setTimeout(async () => {
                
                let newSearchResults = this.state.originialDB.filter((vals, key) => {

                    vals.brand_name = vals.brand_name.toLowerCase();
                    text = text.toLowerCase();
                    if (vals.brand_name.includes(text)) {
                        return vals;
                    }
                });
                this.setState({
                    drugs: newSearchResults,
                })
                
            }, 50);
        } else {
            this.setState({
                drugs: this.state.originialDB,
            }, function () { })
        }

        this.setState({
            search: text
        });
    }
    
    renderHeaderSearchBar = () => {
        return (
            <SearchBar
                lightTheme
                clearIcon={{ color: CONST.COLORS.THEME_COLOR }}
                searchIcon={true}
                placeholder='Search text'
                inputStyle={{ backgroundColor: CONST.COLORS.WHITE, color: '#000' }}
                onChangeText={text => this.searchDrugs(text)}
            />
        );
    }

    render(){

        return(
            <View style={{flex:1, backgroundColor: CONST.COLORS.THEME_COLOR}}>
                <View style={styles.container}>
                    <FlatList
                        ListHeaderComponent={this.renderHeaderSearchBar}
                        data={this.state.drugs} 
                        renderItem={({item, index}) => {
                            let DrugIcon = this.getMedicineIcon(item.form);

                            return (<TouchableHighlight onPress={() => this.props.navigation.navigate('DrugDetails', { id: item.brand_id })} key={item.id} underlayColor={CONST.COLORS.UNDERLAY_COLOR} style={styles.item}>
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
                                        <Text style={{ fontSize: 16 }}>{item.genericName}</Text>
                                        <Text style={{ color: CONST.COLORS.THEME_COLOR, fontSize: 16 }}>{item.generic_name.length > 20 ? item.generic_name.substring(0, 45) + '..' : item.generic_name}</Text>
                                    </View>
                                </View>
                            </TouchableHighlight>);
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
        paddingTop: 10,
        backgroundColor: CONST.COLORS.WHITE
    },
    item: {
        borderBottomColor: '#DDD',
        borderBottomWidth: .5,
        paddingBottom: 8,
    }
    
})