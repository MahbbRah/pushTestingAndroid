import React from 'react';
import { View, TouchableHighlight, StyleSheet, Text, Image } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import SetSchedule from './SetSchedule';
import CONST from '../../lib/constants';
import API from '../../lib/api';

export default class MyProfile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            openSetSchedule: false,
            userProfile: null,
        };
        this.API = new API();

    }

    async componentDidMount() {

        let userInfo = await this.API._retrieveData('userInfo');


        if (userInfo !== null) {

            let parsedUserInfo = JSON.parse(userInfo);


            let fullName = parsedUserInfo.fullName;

            let profile = {
                fullName,
                emailAddress: parsedUserInfo.emailAddress,
                doctor_mobile: parsedUserInfo.doctor_mobile,
                doctor_title: parsedUserInfo.doctor_title,
                profilePic: `data:image/png;base64,${parsedUserInfo.profilePic}`,
                doctor_id: parsedUserInfo.doctor_id,
                balance: parsedUserInfo.balance,
                otherProfileMeta: parsedUserInfo.otherProfileMeta
            };
            this.setState({ userProfile: { ...profile } });

        } else {
            this.props.navigation.navigate('FirstPage');
        }

    }

    async componentWillReceiveProps() {

        let userInfo = await this.API._retrieveData('userInfo');


        if (userInfo !== null) {

            let parsedUserInfo = JSON.parse(userInfo);


            let fullName = parsedUserInfo.fullName;

            let profile = {
                fullName,
                emailAddress: parsedUserInfo.emailAddress,
                doctor_mobile: parsedUserInfo.doctor_mobile,
                doctor_title: parsedUserInfo.doctor_title,
                profilePic: `data:image/png;base64,${parsedUserInfo.profilePic}`,
                doctor_id: parsedUserInfo.doctor_id,
                balance: parsedUserInfo.balance,
                otherProfileMeta: parsedUserInfo.otherProfileMeta
            };
            this.setState({ userProfile: { ...profile } });

        }
    }

    

    handleSetSchedule = () => {
        this.setState({
            openSetSchedule: this.state.openSetSchedule ? false : true
        })
    }

    handleLogOut = async() => {

        await this.API._removeItem('userInfo');

        this.props.navigation.navigate('LoginPage');
    }

    render() {

        let userProfiles = this.state.userProfile;
        let emailAddr, phoneNumber, fullName, doctorTitle, profilePic, created, balance=1;
        if (userProfiles) {
            emailAddr = userProfiles.emailAddress;
            phoneNumber = userProfiles.phoneNumber;
            doctorTitle = userProfiles.doctor_title;
            profilePic = userProfiles.profilePic;
            balance = userProfiles.balance;
            fullName = userProfiles.fullName;
            created = userProfiles.created;
        }
        return (
            <View style={{
                flex: 1,
            }}>
                <View style={{
                    flex: .30,
                    marginTop: 12,
                    marginLeft: 20,
                    marginRight: 20,
                }}>
                    <View style={styles.headerBox}>
                        <Image source={{uri: profilePic}}  style={{
                            width: 50,
                            height: 50,
                            borderRadius: 25,
                            marginBottom: 7,
                        }}/>
                        <Text style={{ fontWeight: 'bold', color: '#000', marginBottom: 5 }}>{this.API.formatUserName(fullName)}</Text>
                        <Text style={{ fontWeight: '200', color: '#91949B', fontSize: 10, marginBottom: 5}}>{doctorTitle}</Text>
                    </View>
                </View>
                <View style={{
                    flex: .12,
                    marginTop: 15,
                    marginLeft: 20,
                    marginRight: 20,
                }}>
                    <View style={styles.availableMoneySection}>
                        <View style={{ flex: .90, flexDirection: 'column', paddingLeft: 15}}>
                            <Text style={{ fontWeight: 'bold', color: '#000'}}>
                                {balance} TK
                            </Text>
                            <Text style={{ color: '#91949B', fontSize: 10, fontWeight: '200'}}>
                                Available Balance
                            </Text>
                        </View>
                        <View style={{ flex: .1, flexDirection: 'column', paddingTop: 5}}>
                            <TouchableHighlight underlayColor="transparent" onPress={() => alert('Balance details > coming soon')}>
                                <MaterialIcons name="keyboard-arrow-right" size={24} style={{ color: '#C1C5CA' }} />
                            </TouchableHighlight>
                        </View>
                    </View>
                </View>
                <View style={{
                    flex: .3,
                    marginTop: 10,
                    marginLeft: 20,
                    marginRight: 20,
                }}>
                    <View style={{ flex: 1, flexDirection: 'row'}}>
                        <TouchableHighlight style={[styles.bottomItem, { marginRight: 5 }]}>
                            <View style={{ 
                                alignItems: 'center',
                                marginTop: 12
                            }}>
                                <MaterialIcons name="restore" size={30} color='#00B9FC' backgroundColor='#E1F5FF' padding={7} borderRadius={50} 
                                marginTop={10}  />
                                <Text style={{ color: '#91949B', fontSize: 13, marginTop: 15}}>Treatment History</Text>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight style={styles.bottomItem} underlayColor="transparent" onPress={this.handleSetSchedule}>
                            <View style={{
                                alignItems: 'center',
                                marginTop: 12
                            }}>
                                <SetSchedule animationType="slide" ModalExecuter={this.handleSetSchedule} modalVisible={this.state.openSetSchedule} />
                                <Entypo name="clock" size={30} padding={7} borderRadius={50}
                                    marginTop={10} color='#0047F7' backgroundColor='#E1E4FD' />
                                <Text style={styles.bottomItemText}>Set Schedule</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                </View>
                <View style={{
                    flex: .3,
                    marginTop: 10,
                    marginLeft: 20,
                    marginRight: 20,
                    marginBottom: 10,
                }}>
                    <View style={{ flex: 1, flexDirection: 'row'}}>
                        <TouchableHighlight style={[styles.bottomItem, { marginRight: 5 }]} underlayColor="transparent" onPress={() => this.props.navigation.navigate('EditProfile')}>
                            <View style={{ 
                                alignItems: 'center',
                                marginTop: 12
                            }}>
                                <MaterialCommunityIcons name="pencil-box-outline" size={30}
                                    padding={7} borderRadius={50} marginTop={10} color='#00C367' backgroundColor='#DDF7E9'
                                />
                                <Text style={styles.bottomItemText}>Edit Profile</Text>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight style={styles.bottomItem} underlayColor="transparent" onPress={this.handleLogOut}>
                            <View style={{
                                alignItems: 'center',
                                marginTop: 12
                            }}>
                                <MaterialCommunityIcons name="logout" size={30}
                                    padding={7} borderRadius={50} marginTop={10} color='#FF343F' backgroundColor='#FFE2E2'
                                />
                                <Text style={styles.bottomItemText}>Logout</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    headerBox: {
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#fff',
        elevation: 2,
        backgroundColor: '#FFF',
        borderRadius: 3,
        paddingLeft: 40,
        paddingRight: 40,
        paddingTop: 20,
        paddingBottom: 20,
    },
    availableMoneySection: {
        flex: 1,
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#fff',
        paddingTop: 8,
        borderRadius: 3,
        paddingBottom: 8,
        elevation: 2,
        backgroundColor: '#FFF',
    },
    bottomItem: { 
        flex: .5, 
        backgroundColor: '#FFF', 
        borderRadius: 3, 
        borderColor: '#FFF', 
        borderWidth: 1, 
        elevation: 2, 
        // marginRight: 5,
     },
    bottomItemText: { 
        color: '#91949B', 
        fontSize: 13, 
        marginTop: 15
    }
});
