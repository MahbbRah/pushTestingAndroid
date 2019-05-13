import React from 'react';
import {
    View, TouchableHighlight, DatePickerAndroid, StyleSheet, Text, Image,
    FlatList,
    Alert
} from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNFetchBlob from 'rn-fetch-blob'
// import {
//     Menu,
//     MenuOptions,
//     MenuOption,
//     MenuTrigger,
// } from 'react-native-popup-menu';
import CONST from '../../lib/constants';
import API from '../../lib/api';

let prescriptionTemplate = `
<html>
  <head>
    <style>
      body {
        background: #FFF;
        padding: 17px;
      }
      #header_area{
        margin-bottom: 20%;
      }
      .header_left_wrapper {
        line-height: 5px;
        float: left;
      }
      .header_left_wrapper p{
        color: #2F2B8A
      }
      .header_right_area {
       float: right;
      }
      .dr_name {
        color: #007937;
      }
      #header_bottom{
        border-bottom: 2px solid #2F2B8A;
        border-top: 2px solid #007937;
        padding-left: 1%;
        line-height: 4px;
      }
      .header_bottom_content p{
        display: inline-block;
        padding-left: 7px;
        padding-right: 7px;
      }
      #prescription_data{
        margin-left: 2%;
        margin-bottom: 7%;
      }
      .prescription_content{
        //line-height: 15px;
        line-height: 15px;
        margin-left: 10px;
        display: block;
      }
      .prescription_item_title{
        color: #0057A1
      }
      .prescription_left_part{
        border-right: 2px solid #ddd;
        float: left;
        padding: 10px;
        margin-right: 30px;
        width: 35%;
      }
      .prescription_right_part{
        padding: 15px;
      }
      #footer_area{
        border-top: 2px solid #2F2B8A;
      }
      .footer_mid_content{
        margin-left: 15px;
      }
      .footer_mid_content p {
        color: #007937
      }
      .footer_mid_content p > span {
        color: #2F2B8A;
        font-weight: bold;
      }
    </style>
  </head>
  <body>
    <div id="header_area">
      <div class="header_left_wrapper">
        <h2 class="dr_name">
          {Doctor_Name}
        </h2>
        <p>{DR_SPECIALITY}</p>
        <p>{DOCTOR_TITLE}</p>
        <p> <b>Email: </b> {DR_EMAIL}</p>
      </div>
      <div class="header_right_area">
        <div class="footer_mid_content">
          <p> Mobile: {MOBILE_NUMBER} <br/> <span>(For Emergency Query)               </span>
          </p>
      </div>
      </div>
    </div>
    <div id="header_bottom">
      <div class="header_bottom_content">
        <p> <b>PID: </b> {PATIENT_ID}</p>
        <p> <b>Name: </b> {PATIENT_NAME}</p>
        <p><b>Age: </b> {PT_AGE} Yrs</p>
        <p><b>Sex: </b> {PT_GENDER}</p>
        <p><b>Date: </b> {REG_DATE_PT} </p>
      </div>
    </div>
    <div id="prescription_data">
      <div class="prescription_left_part">
        <div class="prescription_item">
          <h2 class="prescription_item_title">
            Chief Complaints:
          </h2>
          <div class="prescription_content">
            CHEIF_COMPLAIN
          </div>
        </div>
        <div class="prescription_item">
          <h2 class="prescription_item_title">
            Clinical Examinations:
          </h2>
          <div class="prescription_content">
            CLINICAL_EXAMS
          </div>
        </div>
        <div class="prescription_item">
          <h2 class="prescription_item_title">
            Diagonsis:
          </h2>
          <div class="prescription_content">
            DIAGONSIS_PLACEMENT
          </div>
        </div>
        <div class="prescription_item">
          <h2 class="prescription_item_title">
            Medical Histories:
          </h2>
          <div class="prescription_content">
            MEDICAL_HISTORIES
          </div>
        </div>
        
      </div>

      <div class="prescription_right_part">
        <div class="prescription_item">
          <h2 class="prescription_item_title">
            RX History
          </h2>
          <div class="prescription_content">
            RX_HISTORIES
          </div>
        </div>
        <div class="prescription_item">
          <h2 class="prescription_item_title">
            Advices:
          </h2>
          <div class="prescription_content">
            ADVICES_LIST
          </div>
        </div>
        <div class="prescription_item">
          <h2 class="prescription_item_title">
            Investigations: 
          </h2>
          <div class="prescription_content">
            <p> INVESTIGATION_LIST </p>
          </div>
        </div>
        <div class="prescription_item">
          <h2 class="prescription_item_title">
            Follow-up : 
          </h2>
          <div class="prescription_content">
            <p> NEXT_VISIT </p>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
`;

export default class TreatmentRecords extends React.Component {

    constructor(props) {
        super(props);

        this.currentState = this.props.navigation.state.params.patientInformation;
        this.state = {
            patientRecord: this.currentState,
            prescriptionInfos: null,
        };

        this.API = new API();
    }


    async componentDidMount() {

        let url = CONST.BASE_URL + CONST.APIS.GET_PRESCRIPTION_BY_PATIENT;

        let payload = {
            patient_id: this.state.patientRecord.patientID
        };

        let retrievePrescriptionsByPatient = await this.API.POST(url, payload);

        if (retrievePrescriptionsByPatient.status == 'success') {

            this.setState({
                prescriptionInfos: retrievePrescriptionsByPatient.data
            });
        }
    }

    /*  TODO:: NEED TO ADD IOS DATE PICKER AS WELL */

    handleDatePicker = async () => {
        try {
            const { action, year, month, day } = await DatePickerAndroid.open({
                // Use `new Date()` for current date.
                // May 25 2020. Month 0 is January.
                date: new Date()
            });
            if (action === DatePickerAndroid.dateSetAction) {
                // Alert.alert(` Year: ${year}, Month: ${month}, Day: ${day}`);

            }
        } catch ({ code, message }) {
            console.warn('Cannot open date picker', message);
        }

    }

    createAndSavePDF = async (prescription) => {

        prescription = JSON.parse(prescription);
        // console.log(`Prescription logs:`, prescription);
        // return;
        if (prescription.nextAppointmentDate) {
            prescription.nextAppointmentDate = new Date(Date.parse(prescription.nextAppointmentDate));
        }

        let chiefComplains = prescription.cheifComplains.map((item, key) => {

            return `
                <p> => ${item} <br/></p>
            `;
        });
        let diagonsisItems = prescription.diagonsisItems.map((item, key) => {

            return `
                <p> => ${item} <br/></p>
            `;
        });

        let advicesList = prescription.advices.map((item, key) => {

            return `
                <p> => ${item} <br/></p>
            `;
        });

        let rxHistories = prescription.rxHistories.map((item, key) => {

            let isToAddTsf = item.medicineType === 'Syrup' || item.medicineType === 'Suspension' ? ' TSF ' : ' ';
            return `
                <p> • ${item.medicineType} ${item.name} ${item.strength} <br/>${item.doses.join("+")} ${isToAddTsf}   
                    ${item.beforeMeal ? '(Before Meal)' : ' '}
                    ${item.afterMeal ? '(After Meal)' : ' '}
                    ${item.beforeSleep ? '(Before sleep)' : ' '}
                    ${item.checkDuration && item.durationEntry != "" ? ', '
                    + item.durationEntry + ' Days' : ', Continue'} <br/></p>
            `;
        });

        let clinicalExamination = prescription.clinicalExamination.map((item, key) => {

            let clinicalItemSelectedList = ['Anemia', 'Jaundice', 'Dehydration'];
            return `<p> • ${item.examinationType} ${clinicalItemSelectedList.includes(item.examinationType) ? ':' : '-'} ${item.examData} <br/></p>`
        });

        let medicalHistories = prescription.medicalHistories.map((item, key) => {

            return `<p> • ${item.historyName} : ${item.history === '' ? 'YES' : item.history} <br/></p>`
        });

        let preExistingIllnesses = prescription.preExistingIllnesses.map((item, key) => {
            return `<p> • ${item.testType} : ${item.selectedTests.join(',')} <br/></p>`
        });

        let investigations = prescription.investigations.map((item, key) => {

            return `<p> • ${item} <br/></p>`
        });

        const { patientName, registeredDate, age, gender, patientID } = prescription.patientInformation;
        const { fullName, doctor_mobile, doctor_title, otherProfileMeta, emailAddress } = prescription.doctorInformation;

        let parsedProfileMeta = otherProfileMeta;
        let newTemplateForPDF = prescriptionTemplate;

        //Get Remaining Month and Day between a future date and current Date.
        const _MS_PER_DAY = 1000 * 60 * 60 * 24;
        function dateDiffInDays(a, b) {
            // Discard the time and time-zone information.
            const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
            const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

            return Math.floor((utc2 - utc1) / _MS_PER_DAY);
        }
        let differenceByDays = '';
        if(prescription.nextAppointmentDate) {
          let nextVisitDate = new Date(prescription.nextAppointmentDate);
          let differenceByDays = dateDiffInDays(new Date(), nextVisitDate);
          let diffMonths = parseInt(differenceByDays / 30);
          if (diffMonths) {
            differenceByDays = differenceByDays - (diffMonths * 30);
          }
        }
        

        newTemplateForPDF = newTemplateForPDF.replace("CHEIF_COMPLAIN", chiefComplains.join(""));
        newTemplateForPDF = newTemplateForPDF.replace("DIAGONSIS_PLACEMENT", diagonsisItems.join(""));
        newTemplateForPDF = newTemplateForPDF.replace("ADVICES_LIST", advicesList.join(""));
        newTemplateForPDF = newTemplateForPDF.replace("RX_HISTORIES", rxHistories.join(""));
        newTemplateForPDF = newTemplateForPDF.replace("NEXT_VISIT", differenceByDays);
        newTemplateForPDF = newTemplateForPDF.replace("CLINICAL_EXAMS", clinicalExamination.join(""));
        newTemplateForPDF = newTemplateForPDF.replace("MEDICAL_HISTORIES", medicalHistories.join(""));
        newTemplateForPDF = newTemplateForPDF.replace("PRE_EXSITING_ILNESS", preExistingIllnesses.join(""));
        newTemplateForPDF = newTemplateForPDF.replace("INVESTIGATION_LIST", investigations.join(""));
        newTemplateForPDF = newTemplateForPDF.replace("{MOBILE_NUMBER}", doctor_mobile);
        newTemplateForPDF = newTemplateForPDF.replace("{Doctor_Name}", fullName.replace("|", " "));
        newTemplateForPDF = newTemplateForPDF.replace("{DOCTOR_TITLE}", doctor_title);
        newTemplateForPDF = newTemplateForPDF.replace("{DR_EMAIL}", emailAddress ? emailAddress : 'N/A');
        newTemplateForPDF = newTemplateForPDF.replace("{DR_SPECIALITY}", parsedProfileMeta.doctorSpeciality);
        newTemplateForPDF = newTemplateForPDF.replace("{PATIENT_ID}", patientID);
        newTemplateForPDF = newTemplateForPDF.replace("{PATIENT_NAME}", patientName.replace("|", " "));
        newTemplateForPDF = newTemplateForPDF.replace("{PT_AGE}", age);
        newTemplateForPDF = newTemplateForPDF.replace("{PT_GENDER}", gender);
        newTemplateForPDF = newTemplateForPDF.replace("{REG_DATE_PT}", new Date(registeredDate).toLocaleDateString());

        let options = {
            html: newTemplateForPDF,
            fileName: 'test',
            directory: 'Download',
            base64: true
        };


        // console.log(`data: `, options);
        // return;
        let file = await RNHTMLtoPDF.convert(options);
        let currentTimeStamp = new Date().getTime();
        let filePath = RNFetchBlob.fs.dirs.DownloadDir + `/${currentTimeStamp}_${fullName.replace("|", "_")}_prescription.pdf`;

        RNFetchBlob.fs.writeFile(filePath, file.base64, 'base64')
            .then(response => {
                console.log('Success Log: ', response)
                Alert.alert("Success", "Prescription has been generated successfully, Check download folder in your internal storage")
            })
            .catch(errors => {
                console.log(" Error Log: ", errors);
            })

    }

    _viewPrescription = (item) => {
        let prescriptionData = JSON.parse(item.prescription_meta);
        if (prescriptionData.nextAppointmentDate) {
            prescriptionData.nextAppointmentDate = new Date(Date.parse(prescriptionData.nextAppointmentDate));
        }
        // console.log(`Prescription meta from dr: `, prescriptionData)
        this.props.navigation.navigate('GeneratePrescription', { ...prescriptionData, fromTreatMentHistory: true });
    }

    _renderPrescriptionItem = ({ item }) => {

        let doctorInformation = JSON.parse(item.prescription_meta).doctorInformation

        let profilePicUri = !doctorInformation.fileName.includes("undefined") ? { uri: CONST.PROFILE_PIC_BASE + doctorInformation.fileName } : require('../../assets/man.png');

        return (
            <View style={styles.appointmentsItem}>
                <View style={{ marginLeft: 15 }}>
                    <Image
                        source={profilePicUri}
                        style={styles.itemImage}
                        onLoadEnd={() => this.dads}
                    />
                </View>
                <View style={styles.itemDetailsWrapper}>
                    <Text style={styles.patientName}>{this.API.formatUserName(doctorInformation.fullName)}</Text>
                    <Text style={styles.patientSubTitle}>{new Date(Date.parse(item.timestamp)).toLocaleDateString()}</Text>
                </View>
                <View style={{ flexDirection: 'column', flex: .24, marginTop: -8 }}>
                    <TouchableHighlight style={styles.viewPrescriptionBtn} onPress={() => this.createAndSavePDF(item.prescription_meta)} underlayColor="transparent">
                        <View>
                            <Text style={styles.editBtnText}>DOWNLOAD</Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.viewPrescriptionBtn} onPress={() => this._viewPrescription(item)} underlayColor="transparent">
                        <View>
                            <Text style={styles.editBtnText}>VIEW</Text>
                        </View>
                    </TouchableHighlight>
                </View>
            </View>
        )
    }

    render() {

        let { patientID, patientName } = this.state.patientRecord;
        return (
            <View style={{
                flex: 1,
            }}>
                <View style={{
                    flex: .15,
                    flexDirection: 'row',
                    paddingTop: 25,
                    backgroundColor: '#FFF',
                    borderBottomWidth: 1,
                    borderBottomColor: '#ddd',
                    elevation: 2
                }}>
                    <View style={{ flex: .70, flexDirection: 'row', marginLeft: 15, }}>
                        <Image source={require('../../assets/man.png')} style={{
                            height: 40,
                            width: 40,
                            borderRadius: 20
                        }} />
                        <View style={{
                            flexDirection: 'column',
                            marginLeft: 10,

                        }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 16, }}> {this.API.formatUserName(patientName)}</Text>
                            <Text style={[styles.grayColor, { fontSize: 12, marginTop: 2 }]}> ID: {patientID}</Text>
                        </View>
                    </View>
                    <TouchableHighlight style={{
                        flex: .3,
                        marginRight: 15
                    }}>
                        <Text style={{ color: '#FFF', fontSize: 12, backgroundColor: '#00B9FC', padding: 8, textAlign: 'center', borderRadius: 3 }}> Dates filter</Text>
                    </TouchableHighlight>
                </View>

                <View style={{
                    flex: .85,
                    flexDirection: 'column',
                    backgroundColor: '#FFF'
                }}>
                    <Text style={[styles.grayColor, { marginLeft: 20, marginTop: 10, marginBottom: 15, fontSize: 11 }]}>Treatments Records Below</Text>
                    <FlatList
                        data={this.state.prescriptionInfos}
                        renderItem={this._renderPrescriptionItem}
                        keyExtractor={(item, id) => `${id}`}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({

    grayColor: {
        color: '#9e9e9e',
    },
    appointmentsItem: {
        flexDirection: 'row',
        borderBottomColor: '#ddd',
        backgroundColor: '#FFF',
        padding: 6,
        borderBottomWidth: 1,
    },
    itemImage: {
        height: 35, width: 35, borderRadius: 21, marginTop: 8
    },
    itemText: {
        width: 35,
        height: 35,
        marginLeft: 7,
        textAlign: 'center',
        backgroundColor: '#00B9FC',
        color: '#FFF',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 30,
        paddingTop: 6,
        marginTop: 4,
    },
    itemDetailsWrapper: {
        flexDirection: 'column',
        flex: .60,
        marginLeft: 12,
    },
    editBtn: {
        flex: .16,
        marginTop: 10,

    },
    viewPrescriptionBtn: {
        flex: .5,
        marginTop: 10,
    },
    editBtnText: {
        backgroundColor: '#00B9FC',
        fontWeight: 'bold',
        color: '#FFF',
        textAlign: 'center',
        paddingTop: 3,
        paddingBottom: 3,
        borderRadius: 20,
        fontSize: 10,
    },
    patientSubTitle: {
        color: '#9e9e9e',
        fontSize: 12,
    },
    footerArea: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        paddingTop: 2,
        paddingBottom: 4,
        paddingLeft: 4,
        backgroundColor: '#F8F8F8',
    },
    btmBtnItem: {
        marginTop: '10%',

    },
    btmBtnText: {
        color: '#9e9e9e',
        backgroundColor: '#FFF',
        borderTopWidth: 1,
        borderTopColor: CONST.COLORS.THEME_COLOR,
        borderBottomColor: CONST.COLORS.THEME_COLOR,
        borderBottomWidth: 1,
        elevation: 1,
        paddingLeft: 14,
        paddingRight: 14,
        paddingTop: 4,
        paddingBottom: 4,
        fontSize: 11,
    },
});
