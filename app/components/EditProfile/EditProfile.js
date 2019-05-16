import React from 'react';
import { View, TouchableHighlight, Text, StyleSheet, Image, Dimensions, TextInput, ScrollView, Alert, PermissionsAndroid } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import { Dropdown } from 'react-native-material-dropdown';
import MultiSelect from 'react-native-multiple-select';
import { CheckBox } from 'react-native-elements'

import Ionicons from 'react-native-vector-icons/Ionicons';

import CONST from '../../lib/constants';
import API from '../../lib/api';

const { width } = Dimensions.get('window');

export default class EditProfile extends React.Component {
    constructor(props) {
        super(props);


        this.checkIfPhoneNumberThere = () => {
            try {
                return this.props.navigation.state.params.phone && true;
            } catch (error) {
                // console.log(error);
                return false;
            }
        }

        this.state = {
            enabledConsulting: false,
            newProfilePic: null,
            currentProfilePic: null,
            firstName: '',
            lastName: '',
            emailAddr: '',
            phoneNumber: this.checkIfPhoneNumberThere() ? this.props.navigation.state.params.phone.number : '',
            doctorTitle: '',
            userInfo: null,
            profileImgBase64: '',
            doctorSpeciality: '',
            gender: '',
            doctorsSpecialityNew: [],
            age: '',
            selectedItems: [],
            generalPractitioner: true,
            specialPractitioner: false,
        }
        this.API = new API();

    }

    async componentDidMount() {

        let userInfo = await this.API._retrieveData('userInfo');

        // Retrieve doctors speciality list from server
        let doctorsSpecialitiesUri = CONST.BASE_URL + CONST.APIS.GET_DOCTORS_SPECIALITIES;

        const getSpecialities = await this.API.GET(doctorsSpecialitiesUri);


        const buildAsNewDropDownItem = getSpecialities.data.map((value, key) => {

            return { name: value.speciality_name, id: `${key}` }
        });

        this.setState({
            doctorsSpecialityNew: buildAsNewDropDownItem

        });

        if (userInfo !== null) {

            let parsedUserInfo = JSON.parse(userInfo);

            let firstName, lastName;
            let fullName = parsedUserInfo.fullName.split('|');
            if (fullName.length > 0) {
                firstName = fullName[0];
                lastName = fullName[1];
            }

            

            // console.log(`Dr Speciality List: `, buildAsNewDropDownItem)


            let speciality_list = parsedUserInfo.speciality_list.map(v => v.id);
            // console.log(`Speciality List: `, speciality_list)
            
            //setting a timeout here as this is throwing error if setting on loads;
            setTimeout(() => {
                this.setState({ selectedItems: speciality_list})
            }, 1000);

            this.setState({
                userInfo: userInfo,
                firstName: firstName,
                lastName: lastName,
                emailAddr: parsedUserInfo.emailAddress,
                phoneNumber: parsedUserInfo.doctor_mobile,
                doctorTitle: parsedUserInfo.doctor_title,
                gender: parsedUserInfo.otherProfileMeta ? parsedUserInfo.otherProfileMeta.gender : '', // later on you can remove if else..
                doctorSpeciality: parsedUserInfo.otherProfileMeta ? parsedUserInfo.otherProfileMeta.doctorSpeciality : '', // later on you can remove if else..
                age: parsedUserInfo.otherProfileMeta ? parsedUserInfo.otherProfileMeta.age : '', // later on you can remove if else..
                currentProfilePic: parsedUserInfo.profilePic,
                specialPractitioner: speciality_list.length !== 0 ? true : false,
                generalPractitioner: speciality_list.length !== 0 ? false : true,
            })
        }


    }

    checkIfNeededToDisableBack = () => {
        if (this.checkRouteState()) {
            return true;
        } else {
            return false;
        }
    }

    __Pick_image = async () => {

        const options = {
            title: 'Select Profile',
            customButtons: [{ name: 'fb', title: 'Choose profile picture' }],
            storageOptions: {
                skipBackup: true,
            },
            maxWidth: 400,
            maxHeight: 400
        };

        // let askPermissionForCamera = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
        //     title: "Permission for using our camera",
        //     message: "If you allow then you'll get a lot of stuffs~!",
        //     buttonNeutral: "Ask Me Later",
        //     buttonNegative: "deny",
        //     buttonPositive: "Allow!"
        // })

        // console.log("Camera PErmission Result", askPermissionForCamera);

        ImagePicker.launchImageLibrary(options, (response) => {

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {

                // You can also display the image using data:
                // const source = { uri: 'data:image/jpeg;base64,' + response.data };

                this.setState({ newProfilePic: response.uri, profileImgBase64: response.data });

            }
        });

    }

    checkRouteState = () => {

        try {
            let state = this.props.navigation.state.params.currentState;
            return state;
        } catch (error) {
            return false;
        }
    }

    editProfileUser = async() => {
        
        const { firstName, lastName, emailAddr, phoneNumber, doctorTitle, profileImgBase64, doctorSpeciality, gender, age } = this.state;
        
        let changingUri = CONST.BASE_URL + CONST.APIS.UPDATE_DOCTOR;
        
        let userInfo  = this.state.userInfo;

        let checkDoctorTypeSelection = this.state.generalPractitioner || this.state.specialPractitioner && true;

        checkDoctorTypeSelection = this.state.specialPractitioner ? this.state.selectedItems.length !== 0 : checkDoctorTypeSelection;

        if (userInfo && checkDoctorTypeSelection) {

            userInfo = JSON.parse(userInfo);

            userInfo.otherProfileMeta.doctorSpeciality = doctorSpeciality;
            userInfo.otherProfileMeta.age = age;
            userInfo.otherProfileMeta.gender = gender;
            userInfo.fullName = `${firstName}|${lastName}`;
            userInfo.emailAddress = emailAddr;
            userInfo.doctor_title = doctorTitle;
            userInfo.profilePic = this.state.currentProfilePic ? this.state.currentProfilePic : profileImgBase64;

            let speciality_list = this.state.doctorsSpecialityNew.filter(v => this.state.selectedItems.includes(v.id));
            userInfo.speciality_list = speciality_list;
            
        }

        let payload = {
            profile_meta: JSON.stringify({ ...userInfo.otherProfileMeta }),
            doctor_id: userInfo.doctor_id,
            doctor_title: doctorTitle,
            doctor_name: `${firstName}|${lastName}`,
            doctor_email: emailAddr,
            profilePic: profileImgBase64,
            is_gp: this.state.generalPractitioner,
        };

        if(this.state.specialPractitioner) {
            let speciality_list = this.state.doctorsSpecialityNew.filter(v => this.state.selectedItems.includes(v.id));

            payload.sp_list = speciality_list
        }

        let tryUpdatingProfile = await this.API.POST(changingUri, payload);
        if (tryUpdatingProfile.status === 'success') {

            if (tryUpdatingProfile.fileName) {
                userInfo.otherProfileMeta.image_uri = tryUpdatingProfile.fileName;
            }
            await this.API._storeData('userInfo', JSON.stringify(userInfo));
            this.props.navigation.navigate("MyProfile", { fakeState: 'FakeState'});
            Alert.alert("Succes", "Your Profile Has been Updated Successfully!");
        } else {
            Alert.alert("Error", "Something went wrong while updating your profile!");
        }
    }


    // Start from here to create/update profile
    addNewUser = async() => {

        const { firstName, lastName, emailAddr, phoneNumber, doctorTitle, profileImgBase64, doctorSpeciality, gender, age } = this.state;

        let pushToken = await this.API._retrieveData("pushToken");
        pushToken = pushToken ? pushToken : 'NO_PUSH_TOKEN_FOUND';

        let checkDoctorTypeSelection = this.state.generalPractitioner || this.state.specialPractitioner && true;

        checkDoctorTypeSelection = this.state.specialPractitioner ? this.state.selectedItems.length !== 0 : checkDoctorTypeSelection;

        if (firstName !== '' && lastName !== '' && phoneNumber !== '' && doctorTitle !== '' && pushToken !== '' && gender !== '' && checkDoctorTypeSelection) {

            let fullname = `${firstName}|${lastName}`;

            let url = CONST.BASE_URL + CONST.APIS.REGISTER;

            let otherProfileMeta = { doctorSpeciality, gender, age };

            /* TODO: Later on we might need to sending data! */

            let speciality_list = this.state.doctorsSpecialityNew.filter(v => this.state.selectedItems.includes(v.id));

            let payload = {
                speciality_list,
                fullName: fullname,
                doctor_title: doctorTitle,
                doctor_mobile: phoneNumber,
                emailAddress: emailAddr,
                profilePic: profileImgBase64,
                balance: 0,
                pushToken,
                otherProfileMeta: { ...otherProfileMeta }
            };

            let invokeRegistration = await this.API.POST(url, payload);
            
            if(invokeRegistration.status === 'success') {

                let storeLocally = { ...payload, doctor_id: invokeRegistration.doctor_id, fileName: invokeRegistration.fileName, created: new Date() };
                await this.API._storeData('userInfo', JSON.stringify(storeLocally));

                delete storeLocally.profilePic;

                this.props.navigation.navigate("Home", { initRegInfo: { ...payload, doctor_id: storeLocally.doctor_id}});
            } else {
                Alert.alert('Something went wrong! Please contact to administartors');
            }

        } else {
            Alert.alert('You must need to fillout required fields');
        }

        
    }

    saveOrUpdateUser = () => {

        if (this.checkRouteState()) {
        // if (true) {
            this.addNewUser();
        } else {
            // console.log('Not on the first Registration..');
            this.editProfileUser();
        }
    }

    onSelectedItemsChange = selectedItems => {
        this.setState({ selectedItems });
    };

    selectDrCategory = (type) => {

        switch (type) {
            case 'general':
                this.setState({ generalPractitioner: this.state.generalPractitioner ? false : true, specialPractitioner: false, selectedItems: [] })
                break;
            case 'special':
                this.setState({ generalPractitioner: false, specialPractitioner: this.state.specialPractitioner ? false : true })
                break;
        
            default:
                break;
        }
    }

    render() {

        let { selectedItems } = this.state;

        let profilePic = this.state.currentProfilePic ? { uri: `data:image/png;base64,${this.state.currentProfilePic}` } : require('../../assets/man.png');
        profilePic = this.state.profileImgBase64 ? { uri: `data:image/png;base64,${this.state.profileImgBase64}` } : profilePic;
        return (
            <View style={{flex: 1, flexDirection: 'column'}}>
                <ScrollView style={{ flex: 1, backgroundColor: "#FFFFFF", flexDirection: 'column' }} keyboardShouldPersistTaps="always">
                    <View style={{
                        flex: .3,
                        backgroundColor: '#181818'
                    }}>
                        <View style={{ alignContent: 'center', alignSelf: 'center', marginTop: 10 }}>
                            <Image source={profilePic} style={{ height: 130, width: width / 2.5, borderRadius: 5 }} />
                            <View style={{ position: 'absolute', bottom: 0 }}>

                                <TouchableHighlight style={{ width: width / 2.5, }} underlayColor="transparent" onPress={this.__Pick_image}>
                                    <View style={{ backgroundColor: 'rgba(39, 39, 40, .5)', flexDirection: 'row', paddingLeft: 20, paddingTop: 4, paddingBottom: 4 }}>
                                        <Ionicons name="md-camera" size={30} style={{ color: '#FFF', fontWeight: 'bold', marginRight: 5 }} />
                                        <Text style={{ color: '#FFF', fontWeight: 'bold', marginTop: 5 }}> EDIT </Text>
                                    </View>

                                </TouchableHighlight>
                            </View>
                        </View>
                    </View>
                    <View style={{ flex: .7 }}>
                        <View style={[styles.inputFieldsWrapper, { marginLeft: 20 }]}>
                            <View style={styles.inputItem}>
                                <Text style={styles.inputItemTitle}>First Name</Text>
                                <TextInput
                                    placeholder="John"
                                    value={this.state.firstName}
                                    onChangeText={(fName) => this.setState({ firstName: fName })}
                                    style={styles.inputItemText}
                                    multiline={false}
                                    underlineColorAndroid="transparent"
                                />
                            </View>
                            <View style={styles.inputItem}>
                                <Text style={styles.inputItemTitle}>Last Name</Text>
                                <TextInput
                                    placeholder="Carter"
                                    value={this.state.lastName}
                                    onChangeText={(lName) => this.setState({ lastName: lName })}
                                    multiline={false}
                                    underlineColorAndroid="transparent"
                                    style={styles.inputItemText}

                                />
                            </View>
                        </View>
                        <View style={styles.inputFieldsWrapper}>
                            <View style={[styles.inputItemFull, { marginLeft: 20 }]}>
                                <Text style={styles.inputItemTitle}>Doctor Title</Text>
                                <TextInput
                                    placeholder="DR. John Dark"
                                    value={this.state.doctorTitle}
                                    onChangeText={(doctorTitle) => this.setState({ doctorTitle })}
                                    style={styles.inputItemText}
                                    multiline={true}
                                    underlineColorAndroid="transparent"
                                />
                            </View>
                        </View>
                        <View style={styles.inputFieldsWrapper}>
                            <View style={[styles.inputItemFull, { marginLeft: 20 }]}>
                                <Text style={styles.inputItemTitle}>Email</Text>
                                <TextInput
                                    placeholder="John@example.com"
                                    value={this.state.emailAddr}
                                    onChangeText={(emailAddr) => this.setState({ emailAddr })}
                                    style={styles.inputItemText}
                                    multiline={false}
                                    underlineColorAndroid="transparent"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>
                        <View style={[styles.inputFieldsWrapper]}>
                            <View style={[styles.inputItemFull, { marginLeft: 20 }]}>
                                <Text style={styles.inputItemTitle}>Select a Doctor category</Text>
                                <CheckBox
                                    title=" General Practitioner"
                                    checkedColor="#00B9FC"
                                    checkedIcon='dot-circle-o'
                                    uncheckedIcon='circle-o'
                                    checked={this.state.generalPractitioner}
                                    onPress={() => this.selectDrCategory('general')}
                                    containerStyle={styles.checkboxStyleSquare}
                                    textStyle={{ fontWeight: 'normal', fontSize: 12 }}
                                />
                                <CheckBox
                                    title=" Specialist Practitioner"
                                    checkedColor="#00B9FC"
                                    checkedIcon='dot-circle-o'
                                    uncheckedIcon='circle-o'
                                    checked={this.state.specialPractitioner}
                                    onPress={() => this.selectDrCategory('special')}
                                    containerStyle={styles.checkboxStyleSquare}
                                    textStyle={{ fontWeight: 'normal', fontSize: 12 }}
                                />
                            </View>
                        </View>
                        <View style={[styles.inputFieldsWrapper, { marginTop: 0}]}>
                            <View style={[styles.inputItemFull, { marginLeft: 20 }]}>
                                {this.state.specialPractitioner && (
                                    <View>
                                        <MultiSelect
                                            hideTags
                                            items={this.state.doctorsSpecialityNew}
                                            uniqueKey="id"
                                            ref={(component) => { this.multiSelect = component }}
                                            onSelectedItemsChange={this.onSelectedItemsChange}
                                            selectedItems={selectedItems}
                                            selectText="Choose Specialities"
                                            searchInputPlaceholderText="Search specialities..."
                                            altFontFamily="ProximaNova-Light"
                                            tagRemoveIconColor="#CCC"
                                            tagBorderColor="#CCC"
                                            tagTextColor={CONST.COLORS.THEME_COLOR}
                                            selectedItemTextColor={CONST.COLORS.THEME_COLOR}
                                            selectedItemIconColor="#CCC"
                                            itemTextColor="#000"
                                            displayKey="name"
                                            searchInputStyle={{ color: '#CCC' }}
                                            submitButtonColor={CONST.COLORS.THEME_COLOR}
                                            hideSubmitButton={true}
                                            submitButtonText="Submit"
                                        />
                                        <View>
                                            {selectedItems.length > 0 && this.multiSelect.getSelectedItemsExt(selectedItems)}
                                        </View>
                                    </View>
                                )}
                                
                            </View>
                        </View>
                        <View style={styles.inputFieldsWrapper}>
                            <View style={[styles.inputItemFull, { marginLeft: 20 }]}>
                                <Text style={styles.inputItemTitle}>How old Are you?</Text>
                                <TextInput
                                    placeholder="Enter Age ex: 25"
                                    value={this.state.age}
                                    onChangeText={(age) => this.setState({ age })}
                                    style={styles.inputItemText}
                                    underlineColorAndroid="transparent"
                                    keyboardType="number-pad"
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>
                        <View style={[styles.inputFieldsWrapper, { marginTop: -5}]}>
                            <View style={[styles.inputItemFull, { marginLeft: 20 }]}>
                                <Dropdown
                                    label='Choose Your Gender'
                                    fontSize={12}
                                    labelFontSize={16}
                                    containerStyle={{margin: 0, padding: 0}}
                                    value={this.state.gender}
                                    data={[ { value: 'Male'}, { value: 'Female'}]}
                                    onChangeText={gender => this.setState({gender})}
                                />
                            </View>
                        </View>
                        <View style={styles.inputFieldsWrapper}>
                            <View style={[styles.inputItemFull, { marginLeft: 20 }]}>
                                <Text style={styles.inputItemTitle}>Phone Number</Text>
                                <TextInput
                                    placeholder="017553455555"
                                    value={this.state.phoneNumber}
                                    onChangeText={(phoneNumber) => this.setState({ phoneNumber })}
                                    style={[styles.inputItemText, { color: '#000'}]}
                                    multiline={false}
                                    editable={this.checkIfPhoneNumberThere() ? false : true}
                                    underlineColorAndroid="transparent"
                                    keyboardType="phone-pad"
                                />
                            </View>
                        </View>
                        <View style={[styles.inputFieldsWrapper, { marginBottom: 20 }]}>
                            <View style={[styles.inputItemFull, { marginLeft: 20, alignContent: 'center', alignSelf: 'center', alignItems: 'center' }]}>
                                <TouchableHighlight onPress={this.saveOrUpdateUser} underlayColor="transparent" style={{ backgroundColor: CONST.COLORS.THEME_COLOR, elevation: 2, borderRadius: 7 }}>
                                    <Text style={{ padding: 8, color: '#FFF', fontWeight: '400' }}>
                                        SAVE UPDATES
                                </Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    inputItem: { 
        flexDirection: 'column',
        flex: .5, 
        marginRight: 13
    },
    checkboxStyleSquare: {
        borderWidth: 0,
        backgroundColor: 'transparent',
        padding: 0,
        marginTop: 0,
        marginLeft: 0
    },
    inputItemFull: { 
        flexDirection: 'column',
        flex: 1, 
        marginRight: 13
    },
    inputItemTitle: { 
        color: '#AEAFB1',
        fontWeight: '400',
        marginBottom: 10
    },
    inputItemText: {
        borderColor: '#EEEEEE', 
        borderWidth: 2, 
        padding: 4, 
        fontSize: 12, 
        borderRadius: 5 
    },
    inputFieldsWrapper: {
        flexDirection: 'row', 
        marginTop: 30 
    },


})