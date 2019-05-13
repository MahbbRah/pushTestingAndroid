import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, FlatList, TouchableHighlight, KeyboardAvoidingView } from 'react-native';
import { SearchBar } from 'react-native-elements'
import { widthPercentageToDP as percentageWidth, heightPercentageToDP as percentageHeight } from 'react-native-responsive-screen';

import Modal from 'react-native-modal';

import PrescriptionEntries from '../../../lib/test_prescription_data.json';
import LoaderImg from '../../../assets/loader_image.gif';
import API from '../../../lib/api';
import CONST from '../../../lib/constants';
import Feather from 'react-native-vector-icons/Feather';

let timerForLoader;

export default class SearchAndReturnItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            searchTerm: '',
            isloading: false,
            originalContents: [],
            filteredContents: [],
            renderItems: false,
        };
        this.API = new API();

    }

    componentDidMount() {

        this.setLoaderWithItems();
    }

    setLoaderWithItems = async() => {

        let filteredContents = await this.getListofItems()

        this.setState({
            // filteredContents,
            originalContents: filteredContents
        })

        //rendering timer initially to show a loader based on the item size{Length}
        let generateLoadingTime = filteredContents.length * 3
        if (!this.state.renderItems) {
            clearTimeout(timerForLoader);
            timerForLoader = setTimeout(() => this.setState({ renderItems: true }), generateLoadingTime)
        }


    }


    getListofItems = async() => {

        let testType = this.props.testType;
        let testName = this.props.testName;

        if (testType && testName) {

            let prescriptionTypeData = PrescriptionEntries.filter(v => v.testType == testName)[0];
            // return prescriptionTypeData;
            let dataByTestName;
            if (prescriptionTypeData.testData) {
                // console.log('we got you covered!', prescriptionTypeData.testData)
                for (let i = 0; i <= prescriptionTypeData.testData.length; i++) {

                    let testNameFromFile;
                    try {
                        testNameFromFile = prescriptionTypeData.testData[i].testName
                    } catch (error) {
                        console.log(error);
                    }

                    if (testNameFromFile == testType) {
                        dataByTestName = prescriptionTypeData.testData[i];
                        break;
                    }
                }
            }

            if (dataByTestName) {
                // let testItemAsObj = {};
                let testItemAsObj = dataByTestName.testItems.map(v => {
                    return { subject: v.itemName, timestamp: v.timestamp }
                });
                
                //Get saved data from localStorage and then push to result
                let getSavedData = await this.API._retrieveData(testType);
                // console.log("get Saved data ", getSavedData)
                if(getSavedData) {
                    let parseSavedData = JSON.parse(getSavedData);

                    testItemAsObj.push(...parseSavedData);

                }

                return testItemAsObj;
            }
            return false;

        }
        return false;
    };


    searchUpdated(term) {

        try {
            let getUpdatedSearchItems = this.state.originalContents.filter((value, key) => {

                term = term.toLowerCase();
                let fromSearch = value.subject.toLowerCase();
                if (fromSearch.includes(term)) {
                    return value;
                }
            });


            this.setState({
                searchTerm: term,
                filteredContents: this.state.searchTerm.length == 0 ? this.state.originalContents : getUpdatedSearchItems
            })
        } catch (error) {
            alert(error)
        }

        
    }

    saveAndCloseModal = async(entryValue, isNew) => {

        let testType = this.props.testType;

        if (entryValue.length === 0) {
            alert('Error: Please Enter something to save');
            return;
        }
        let newItemToSave = { subject: entryValue, timestamp: new Date() };
        if(isNew) {
            let getOldData = await this.API._retrieveData(testType);

            let parsedOldData = getOldData ? JSON.parse(getOldData) : [];
            parsedOldData.push(newItemToSave);
            await this.API._storeData( testType, JSON.stringify(parsedOldData) );
        }

        let getOldData = this.props.getItems;
        if(getOldData.includes(entryValue)) {
            alert('Error: The element has already been selected');
        } else {

            let originalContents =  this.state.originalContents;
            //Push the new element to array and save this new elem to state. and close modal as well. 
            getOldData.push(entryValue);
            this.props.setItems(testType, getOldData);
            this.setState({ searchTerm: '', filteredContents: [], originalContents: isNew ? [...originalContents, newItemToSave] : originalContents});
            this.props.modalExecutor();
        }
        
    }

    cancelOpenedModal = () => {

        this.setState({
            filteredContents: [],
            searchTerm: '',
        });
        
        this.props.modalExecutor();
    }

    renderHeaderSearchBar = () => {

        return (
            <View style={{flexDirection: 'row', flex: 1}}>
                <View style={{flex: .85}}>
                    <SearchBar
                        lightTheme
                        clearIcon={{ color: CONST.COLORS.THEME_COLOR }}
                        // onClearText={() => console.log(`on Clear Method fired!`)}
                        searchIcon={false}
                        placeholder='Input text'
                        inputStyle={{ backgroundColor: CONST.COLORS.WHITE, paddingLeft: percentageWidth("9%"), paddingTop: 10 }}
                        onChangeText={text => this.searchUpdated(text)}
                        rightIconContainerStyle={{padding: 10}}
                    />
                </View>
                <View style={{ flex: .15, backgroundColor: '#E1E8EE'}}>
                    <TouchableHighlight underlayColor={CONST.COLORS.THEME_COLOR} onPress={() => this.saveAndCloseModal(this.state.searchTerm, true)}>
                        <Feather name="check" size={25} color={CONST.COLORS.THEME_COLOR} style={styles.headerSaveBtn} />
                    </TouchableHighlight>
                </View>
            </View>
        );

    }

    render() {

        return (
            <Modal isVisible={this.props.isVisible} onBackButtonPress={this.cancelOpenedModal}>
                <View style={{ flex: 1}}>
                    <View style={styles.container}>
                        <ScrollView keyboardShouldPersistTaps='always'>
                            {this.state.renderItems ?
                                <FlatList
                                    ListHeaderComponent={this.renderHeaderSearchBar}
                                    data={this.state.filteredContents}
                                    renderItem={({ item, index }) => {
                                        return (<TouchableHighlight onPress={() => this.saveAndCloseModal(item.subject)} key={index} underlayColor={CONST.COLORS.UNDERLAY_COLOR} style={styles.item}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <View style={{ flexDirection: 'column', paddingLeft: 10 }}>
                                                        <Text>
                                                            <Text style={{ fontSize: 17, color: '#000' }}>{item.subject}</Text>
                                                        </Text>
                                                    </View>
                                                </View>
                                            </TouchableHighlight>);
                                        }
                                    }
                                    onScrollToIndexFailed={() => null}
                                    keyExtractor={(item, index) => `${index}`}
                                    initialNumToRender={50}
                                    initialScrollIndex={this.state.filteredContents.length > 100 ? 50 : 0}
                                />
                            :
                            
                            <View style={{alignSelf: 'center', alignItems: 'center', marginTop: 20}}>
                                <Image source={LoaderImg} style={{height: 150, width: 150}} />
                            </View>}
                            {(this.state.searchTerm === "" && this.state.filteredContents.length === 0 ) && (
                                <View style={styles.item}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <View style={{ flexDirection: 'column', paddingLeft: 10 }}>
                                            <Text>
                                                <Text style={{ fontSize: 17, color: '#000' }}>Type to search</Text>
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            )}
                        </ScrollView>
                    </View>
                    <View style={{flex: .2}}>
                        <TouchableOpacity onPress={this.cancelOpenedModal} style={{ backgroundColor: '#F7F8F9' }}>
                            <Text style={{ backgroundColor: '#ccc', color: '#FFF', fontWeight: 'bold', padding: 10, width: '100%', textAlign: 'center' }}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: .8,
        backgroundColor: '#fff',
        justifyContent: 'flex-start'
    },
    item: {
        borderBottomColor: '#DDD',
        borderBottomWidth: .5,
        padding: 5,
        paddingBottom: 8,
        elevation: .5
    },
    headerSaveBtn: { 
        marginTop: 9, 
        elevation: .5, 
        marginRight: 6, 
        padding: 7, 
        textAlign: 'center' 
    }
});