import React from 'react';
import { View, Text, } from 'react-native'
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { MenuProvider } from 'react-native-popup-menu';
import NavigationService from './app/lib/NavigationService';
import LoginPage from './app/components/LoginPage';
// import PdfTesting from './app/components/PdfTesting';
import FirstPage from './app/components/FirstPage';
import Home from './app/components/Home';
import NotificationsView from './app/components/NotificationsView';
import DrugDatabase from './app/components/DrugDatabase';
import ViewGenericList from './app/components/ViewGenericList';
import DrugDetails from './app/components/DrugDetails';
import SeePatient from './app/components/SeePatient/SeePatient';
import AcceptPatientRequestPush from './app/components/SeePatient/AcceptPatientRequestPush';
import PatientProfile from './app/components/PatientProfile/PatientProfile';
import ConsultingNow from './app/components/ConsultingNow/ConsultingNow';
import GeneratePrescription from './app/components/ConsultingNow/GeneratePrescription';
import Appointment from './app/components/Appointment/Appointment';
import MyProfile from './app/components/MyProfile/MyProfile';
import PatientRecord from './app/components/PatientRecord/PatientRecord';
import SearchPatientRecord from './app/components/PatientRecord/SearchPatientRecord';
import TreatmentRecords from './app/components/PatientRecord/TreatmentRecords';
import PresExistingIllnessHistory from './app/components/PatientRecord/PreExistingIllness';
import MedicalHistories from './app/components/PatientRecord/MedicalHistories';
import LabInvestigationReports from './app/components/PatientRecord/LabInvestigationReports';
import EditProfile from './app/components/EditProfile/EditProfile';
import VideoCall from './app/components/VideoCall';
import CONST from './app/lib/constants'
import API from './app/lib/api'


export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userInfo: null,
        }
        this.API = new API();
    }

    render() {
        return (
            <RootStackContainer
                ref={navSelector => NavigationService.setTopLevelNavigator(navSelector)}
            />
        );
    }
}

const HeaderRightTopView =
    <View style={{ marginRight: 10 }}>
        <Text style={{ color: "#FFFFFF", fontSize: 10, fontWeight: 'bold', textAlign: 'right' }}>00:12:59</Text>
        <Text style={{ color: "#f7f8f9", fontWeight: "200", fontSize: 10 }}>time elapsed</Text>
    </View>;

const headerOptions = {
    headerStyle: {
        backgroundColor: CONST.COLORS.THEME_COLOR,
    },
    headerTintColor: '#FFF',
    headerTitleStyle: {
        fontWeight: 'bold',
        color: '#FFF'
    },
}

const RootStack = createStackNavigator({
    FirstPage: {
        screen: FirstPage,
        navigationOptions: {
            title: 'Login',
            header: null
        }
    },
    LoginPage: {
        screen: LoginPage,
        navigationOptions: {
            title: 'Login',
            header: null
        }
    },
    Home: {
        screen: Home,
        navigationOptions: {
            title: 'Home',
            header: null
        }
    },
    DrugDatabase: {
        screen: DrugDatabase,
        navigationOptions: {
            title: 'Drug Database',
            ...headerOptions
        }
    },
    DrugDetails: {
        screen: DrugDetails,
        navigationOptions: {
            title: 'Drug Details',
            ...headerOptions
        }
    },
    SeePatient: {
        screen: SeePatient,
        navigationOptions: {
            title: 'See Patient',
            headerRight: HeaderRightTopView,
            ...headerOptions
        }
    },
    PatientProfile: {
        screen: PatientProfile,
        navigationOptions: {
            title: 'Patient Profile',
            headerRight: HeaderRightTopView,
            ...headerOptions
        }
    },
    ConsultingNow: {
        screen: ConsultingNow,
        navigationOptions: {
            title: 'Consulting Now',
            headerRight: HeaderRightTopView,
            ...headerOptions
        }
    },
    GeneratePrescription: {
        screen: GeneratePrescription,
        navigationOptions: {
            title: 'Prescription',
            headerRight: HeaderRightTopView,
            ...headerOptions
        }
    },
    Appointment: {
        screen: Appointment,
        navigationOptions: {
            title: 'Appointment',
            headerRight: HeaderRightTopView,
            ...headerOptions
        }
    },
    MyProfile: {
        screen: MyProfile,
        navigationOptions: {
            title: 'My Account',
            headerRight: HeaderRightTopView,
            ...headerOptions
        }
    },
    PatientRecord: {
        screen: PatientRecord,
        navigationOptions: {
            title: 'Patient Record',
            headerRight: HeaderRightTopView,
            ...headerOptions
        }
    },
    TreatmentRecords: {
        screen: TreatmentRecords,
        navigationOptions: {
            title: 'Treatment Records',
            headerRight: HeaderRightTopView,
            ...headerOptions
        }
    },
    PresExistingIllnessHistory: {
        screen: PresExistingIllnessHistory,
        navigationOptions: {
            title: 'Pre Existing Illness',
            headerRight: HeaderRightTopView,
            ...headerOptions
        }
    },
    MedicalHistories: {
        screen: MedicalHistories,
        navigationOptions: {
            title: 'Medical Histories',
            headerRight: HeaderRightTopView,
            ...headerOptions
        }
    },
    LabInvestigationReports: {
        screen: LabInvestigationReports,
        navigationOptions: {
            title: 'Lab Inv. Records',
            headerRight: HeaderRightTopView,
            ...headerOptions
        }
    },
    NotificationsView: {
        screen: NotificationsView,
        navigationOptions: {
            title: 'Notifications',
            headerRight: HeaderRightTopView,
            ...headerOptions
        }
    },
    SearchPatientRecord: {
        screen: SearchPatientRecord,
        navigationOptions: {
            title: 'Search Patient',
            headerRight: HeaderRightTopView,
            ...headerOptions
        }
    },
    EditProfile: {
        screen: EditProfile,
        navigationOptions: {
            title: 'Edit Profile',
            headerRight: HeaderRightTopView,
            ...headerOptions
        }
    },
    ViewGenericList: {

        screen: ViewGenericList,
        navigationOptions: {
            title: 'Drugs By Generic',
            headerRight: HeaderRightTopView,
            ...headerOptions
        }
    },
    AcceptPatientRequestPush: {
        screen: AcceptPatientRequestPush,
        navigationOptions: {
            // title: 'Accept Patient Request',
            // headerRight: HeaderRightTopView,
            // ...headerOptions
            header: null
        }
    },
    VideoCall: {
        screen: VideoCall,
        navigationOptions: {
            header: null
        }
    }
}, {
        // initialRouteName: 'ConsultingNow'
        // initialRouteName: 'SearchPatientRecord'
        // initialRouteName: 'LoginPage'
        // initialRouteName: 'SeePatient'
        // initialRouteName: 'VideoCall'
        // initialRouteName: 'FirstPage'
        initialRouteName: 'Home'
        // initialRouteName: 'EditProfile'
        // initialRouteName: 'AcceptPatientRequestPush'
        // initialRouteName: 'PdfTesting'
        // initialRouteName: 'DrugDatabase'
        // initialRouteName: RouteName
        // initialRouteName: 'EditProfile'
        // initialRouteName: 'PatientProfile'
        // initialRouteName: 'PatientRecord'
    });

const RootStackContainer = createAppContainer(RootStack);
