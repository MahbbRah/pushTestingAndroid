import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableHighlight, Alert } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';

import CONST from '../../lib/constants';
import API from '../../lib/api';

export default class GeneratePrescription extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            prescriptionData: null,
            patientProfile: {
                patientName: 'Saidul Islam',
                registeredDate: new Date(),
                age: '28',
                gender: 'Male',
                patientID: '65757575',
                profilePicUri: '',
            },
            userInfo: null,
            isPatientFromTreatmentHistory: false,
        }
        this.API = new API();
    }


    // async componentDidMount() {
    async componentWillMount() {

        let userInfo = await this.API._retrieveData('userInfo');
        let patientProfile = await this.API._retrieveData('patientInfo');
        let newState = {userInfo: JSON.parse(userInfo) }
        if(patientProfile) {

            patientProfile = JSON.parse(patientProfile);
            newState.patientProfile = patientProfile
        }
        
        // console.log(patientProfile);
        this.setState(newState);


        let dataFromNav = this.props.navigation.state.params;

        if(dataFromNav) {

            let patientInfo = dataFromNav.patientInformation;
            this.setState({
                // prescriptionData: !dataFromNav.fromTreatMentHistory ? dataFromNav : dataFromNav.dataFromNav,
                prescriptionData: dataFromNav,
                // patientProfile: patientInfo, // using patient info from local storage that has been fetched above
                isPatientFromTreatmentHistory: dataFromNav.fromTreatMentHistory && true,
            });
        }

    }

    handleEditPres = () => {

        this.props.navigation.goBack();
    }

    preventUploadingAndGeneratingPRes = () => {

        let diagonsisItems = this.state.prescriptionData.diagonsisItems.length === 0;
        let rxHistories = this.state.prescriptionData.rxHistories.length === 0;

        if (diagonsisItems || rxHistories) {
            Alert.alert("Not Allowed", `Followings must need to be filled out to preview or complete prescription: 
                ${diagonsisItems ? "Diagonsis" : ''} ${rxHistories ? 'RX ' : ''}`);
            return true;
        }
        return false;
    }

    handlePresUploading = () => {

        if (this.preventUploadingAndGeneratingPRes()) {
            return;
        }

        Alert.alert(
            'Are you sure you want upload this prescription to server?',
            'Once you clicked on Upload, the prescription will be uploaded to server',
            [
                { text: 'Cancel' },
                { text: 'Upload', onPress: this.uploadPrescriptionToServer }
            ]
        );
    }

    uploadPrescriptionToServer = async () => {

        let dataFromNav = this.props.navigation.state.params;

        let doctorInfos = await this.API._retrieveData('userInfo');
        let doctorInfosParsed = JSON.parse(doctorInfos);
        delete doctorInfosParsed.profilePic;

        let patientInformations = await this.API._retrieveData('patientInfo');
        let patientInformationsParsed = JSON.parse(patientInformations);

        let url = CONST.BASE_URL + CONST.APIS.SAVE_PRESCRIPTION;
        let payload = {
            doctor_id: doctorInfosParsed.doctor_id,
            prescription_meta: JSON.stringify({ ...dataFromNav, patientInformation: patientInformationsParsed, doctorInformation: doctorInfosParsed }),
            patient_id: patientInformationsParsed.patientID
        };
        const sendUploadingRequest = await this.API.POST(url, payload);

        if (sendUploadingRequest.status === 'success') {
            Alert.alert("success", sendUploadingRequest.message);

            //Remove Data From Storage
            await this.API._removeItem('prescriptionData');
        } else {
            Alert.alert("Error", 'Something went wrong while uploading prescription to server');
        }
    }

    render() {

        let chiefComplains, diagonsisList, advicesList, RxHistories, clinicalExamination, medicalHistories, preExistingIllnesses, 
            investigations, differenceByDays, diffMonths;

        if(this.state.prescriptionData) {
            chiefComplains = this.state.prescriptionData.cheifComplains && this.state.prescriptionData.cheifComplains.map((item, key) => {
                
                return <Text style={styles.selectedItem} key={key}> - {item}</Text>
            });
            diagonsisList = this.state.prescriptionData.diagonsisItems && this.state.prescriptionData.diagonsisItems.map((item, key) => {
                
                return <Text style={styles.selectedItem} key={key}> - {item}</Text>
            });
            advicesList = this.state.prescriptionData.advices && this.state.prescriptionData.advices.map((item, key) => {
                
                return <Text style={styles.selectedItem} key={key}> - {item}</Text>
            });
            RxHistories = this.state.prescriptionData.rxHistories && this.state.prescriptionData.rxHistories.map((item, key) => {
                let isToAddTsf = item.medicineType === 'Syrup' || item.medicineType === 'Suspension' ? ' TSF ' : ' ';
                return <Text style={styles.selectedItem} key={key}> - {item.medicineType} {item.name} {item.strength}
                    {'\n' + item.doses.join("+") + isToAddTsf}
                    {item.beforeMeal ? '(Before Meal)' : ' '}
                    {item.afterMeal ? '(After Meal)' : ' '}
                    {item.beforeSleep ? '(Before sleep)' : ' '}
                    {(item.checkDuration && item.durationEntry != "" ? ', ' + item.durationEntry + ' Days' : ', Duration: Continue')}
                </Text>
            });
            clinicalExamination = this.state.prescriptionData.clinicalExamination && this.state.prescriptionData.clinicalExamination.map((item, key) => {
                let clinicalItemSelectedList = ['Anemia', 'Jaundice', 'Dehydration'];
                
                return <Text style={styles.selectedItem} key={key}> - {item.examinationType} {clinicalItemSelectedList.includes(item.examinationType) ? ':' : '-'} {item.examData}</Text>
            });
            medicalHistories = this.state.prescriptionData.medicalHistories && this.state.prescriptionData.medicalHistories.map((item, key) => {
                
                return <Text style={styles.selectedItem} key={key}> - {item.historyName} {'\n History: ' + (item.history === '' ? 'YES' : item.history)}</Text>
            });
            preExistingIllnesses = this.state.prescriptionData.preExistingIllnesses && this.state.prescriptionData.preExistingIllnesses.map((item, key) => {
                
                return <Text style={styles.selectedItem} key={key}> - {item.testType} {item.selectedTests.join(',')}</Text>
            });
            investigations = this.state.prescriptionData.investigations && this.state.prescriptionData.investigations.map((item, key) => {
                return <Text style={styles.selectedItem} key={key}> - {item} </Text>
            });

            //Get Remaining Month and Day between a future date and current Date.
            const _MS_PER_DAY = 1000 * 60 * 60 * 24;
            function dateDiffInDays(a, b) {
                // Discard the time and time-zone information.
                const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
                const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

                return Math.floor((utc2 - utc1) / _MS_PER_DAY);
            }
            differenceByDays = dateDiffInDays(new Date(), new Date(this.state.prescriptionData.nextAppointmentDate));
            diffMonths = parseInt(differenceByDays / 30);
            if (diffMonths) {
                differenceByDays = differenceByDays - (diffMonths * 30);
            }
        } 
        const { patientName, registeredDate, age, gender, patientID, profilePicUri } = this.state.patientProfile;

        let drProfileImg = this.state.userInfo ? { uri: CONST.PROFILE_PIC_BASE + this.state.userInfo.fileName } : require('../../assets/doctor.jpg');
        return (
            <View style={{ flex: 1, flexDirection: 'column', backgroundColor: "#F3F3F3", }}>
                <ScrollView>
                    <View style={{ flexDirection: 'row', marginTop: 13 }}>
                        <View style={{ flex: .7, flexDirection: 'column', marginLeft: 8, }}>
                            <Text>{this.state.userInfo ? this.state.userInfo.fullName.replace("|", " ") : 'N/A'}</Text>
                            <Text style={{ color: '#B3B7BD', fontSize: 11 }}>{this.state.userInfo ? this.state.userInfo.doctor_title : 'N/A'}</Text>
                        </View>
                        <View style={{ flex: .3, marginRight: 8 }}>

                            <View style={{
                                position: 'absolute',
                                right: 15,
                            }}>
                                {/* <Image source={{ uri: this.state.userInfo ? this.state.userInfo.profilePic : 'https://ssl.gstatic.com/ui/v1/icons/mail/rfr/logo_gmail_lockup_default_1x.png'}} style={{ height: 40, width: 40, marginTop: -5, borderRadius: 20 }} /> */}
                                <Image source={drProfileImg} style={{ height: 40, width: 40, marginTop: -5, borderRadius: 20 }} />
                            </View>
                            
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', marginLeft: 8, marginTop: 8, marginBottom: 5 }}>
                        <View style={[styles.patientInfoElement, { flex: .70 }]}>
                            <Text style={{
                                color: '#A1A6AD',
                                fontSize: 11
                            }}>Patient's Name</Text>
                            <Text style={{ fontSize: 11 }}>{this.API.formatUserName(patientName)}</Text>
                        </View>
                        <View style={[styles.patientInfoElement, { flex: .30 }]}>
                            <Text style={{
                                color: '#A1A6AD',
                                fontSize: 11
                            }}>Date</Text>
                            <Text style={{ fontSize: 11 }}>{new Date(registeredDate).toLocaleDateString()}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', marginLeft: 8 }}>
                        <View style={[styles.patientInfoElement, { flex: .333 }]}>
                            <Text style={{
                                color: '#A1A6AD',
                                fontSize: 11
                            }}>Sex</Text>
                            <Text style={{ fontSize: 11 }}>{gender}</Text>
                        </View>
                        <View style={[styles.patientInfoElement, { flex: .333 }]}>
                            <Text style={{
                                color: '#A1A6AD',
                                fontSize: 11
                            }}>Age</Text>
                            <Text style={{ fontSize: 11 }}>{age}</Text>
                        </View>
                        <View style={[styles.patientInfoElement, { flex: .333, marginLeft: 10 }]}>
                            <Text style={{
                                color: '#A1A6AD',
                                fontSize: 11
                            }}>ID</Text>
                            <Text style={{ fontSize: 11 }}>{patientID}</Text>
                        </View>
                    </View>
                    <View style={{ flex: .8, flexDirection: 'row', marginTop: 5, marginRight: 8, marginLeft: 8, }}>
                        <ScrollView style={{
                            width: "35%",
                            marginRight: 5,
                        }}>
                            <View style={[styles.consulting_item, { backgroundColor: "#E0E2E4" }]}>
                                <Text style={styles.item_header}>Chief Complain</Text>
                                <View>
                                    {chiefComplains}
                                </View>
                            </View>
                            <View style={[styles.consulting_item, { backgroundColor: "#F8F8F9", borderWidth: 1, borderColor: "#DADADB" }]}>
                                <Text style={styles.item_header}>Clinical Examination</Text>
                                <View>
                                    {clinicalExamination}
                                </View>
                            </View>
                            <View style={[styles.consulting_item, { backgroundColor: "#E0E2E4" }]}>
                                <Text style={styles.item_header}>Pre existing illness</Text>
                                <View>
                                    {preExistingIllnesses}
                                </View>
                            </View>

                            <View style={[styles.consulting_item, { backgroundColor: "#F8F8F9" }]}>
                                <Text style={styles.item_header}>Investigation</Text>
                                <View>
                                    {investigations}
                                </View>
                            </View>
                            <View style={[styles.consulting_item, { backgroundColor: "#E0E2E4" }]}>
                                <Text style={styles.item_header}>Medical History</Text>
                                <View>
                                    {medicalHistories}
                                </View>
                            </View>
                        </ScrollView>
                        <ScrollView style={{
                            width: "65%"
                        }}>
                            <View style={[styles.consulting_item, { backgroundColor: "#E0E2E4" }]}>
                                <Text style={styles.item_header}>Diagnosis</Text>
                                <View>
                                    {diagonsisList}
                                </View>
                            </View>
                            <View style={[styles.consulting_item, { backgroundColor: "#F8F8F9", borderWidth: 1, borderColor: "#f8f8f8", minHeight: 145 }]}>
                                <Text style={styles.item_header}>RX</Text>
                                <View>
                                    {RxHistories}
                                </View>
                            </View>
                            <View style={[styles.consulting_item, { backgroundColor: "#F8F8F9" }]}>
                                <Text style={styles.item_header}>Advice</Text>
                                <View>
                                    {advicesList}
                                </View>
                            </View>
                            <View style={[{ backgroundColor: "#E0E2E4", flexDirection: 'row', paddingTop: 13, paddingBottom: 16, paddingLeft: 7, }]}>
                                <View style={[{ width: "85%" }]}>
                                    <Text style={styles.item_header}>Follow-up in</Text>
                                    <View>
                                        <Text style={styles.selectedItem}>{` ${diffMonths} Months and ${differenceByDays} Days`}</Text>
                                    </View>
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                    {!this.state.isPatientFromTreatmentHistory && (
                        <View style={{ flexDirection: 'row', alignSelf: 'center', alignItems: 'center', marginTop: 6 }}>
                            <TouchableHighlight style={[styles.btn_wrapper_icon]} onPress={this.handleEditPres} underlayColor="transparent">
                                <View style={{ flexDirection: 'row', backgroundColor: "#00B9FC", padding: 7, borderRadius: 2 }}>
                                    <FontAwesome
                                        name="pencil"
                                        size={15}
                                        style={[styles.box_element_common_pres, { color: "#FFF", marginTop: 2 }]}
                                    />
                                    <Text style={{ color: "#FFF" }}>Edit Prescription</Text>
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight style={[styles.btn_wrapper_icon]} onPress={this.handlePresUploading} underlayColor="transparent">
                                <View style={{ flexDirection: 'row', backgroundColor: "#00C36A", padding: 7, borderRadius: 2 }}>
                                    <Feather
                                        name="upload"
                                        size={15}
                                        style={[styles.box_element_common_pres, { color: "#FFF", marginTop: 2 }]}
                                    />
                                    <Text style={{ color: "#FFF" }}>Send Prescription</Text>
                                </View>
                            </TouchableHighlight>
                        </View>
                    )}
                    
                    <View style={{
                        marginTop: 10,
                        marginBottom: 10,
                        marginLeft: 10,
                        marginRight: 10,
                        backgroundColor: '#FFF',
                        borderWidth: .7,
                        borderColor: '#ddd'
                    }}>
                        <Text style={{
                            marginTop: 10,
                            marginBottom: 15,
                            marginLeft: 7,
                            marginRight: 10,
                            color: '#A1A6AD',
                            fontSize: 11
                        }}>
                            This is an electronically generated prescription that doesn't require any stamp or signature
                        </Text>
                    </View>
                </ScrollView>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    consulting_item: {
        padding: 12,
        borderRadius: 7,
        marginBottom: 6,
    },
    item_header: {
        color: 'gray',
        fontSize: 10
    },
    selectedItem: {
        fontSize: 11,
        lineHeight: 15
    },
    box_element_common_pres: {
        marginRight: 5
    },
    btn_wrapper_icon: {
        marginLeft: 10,
    },
    consulting_btm_btn: {
        paddingTop: 5,
        paddingBottom: 5,
        alignSelf: 'center'
    },
    consulting_btm_btn_txt: {
        color: "gray",
        fontSize: 10
    },
    consulting_btn_style: {
        color: "#FFF",
        borderRadius: 50,
        padding: 9,
        width: 40,
        textAlign: 'center',
        alignSelf: "center"

    },
    patientInfoElement: { 
        flexDirection: 'column', 
        backgroundColor: '#FFF', 
        borderWidth: .7, 
        borderColor: '#ddd', 
        marginRight: 10, 
        borderRadius: 2, 
        padding: 5 
    }
});