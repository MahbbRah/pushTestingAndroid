import React from 'react';
import { StyleSheet, Text, View, Image,  ScrollView } from 'react-native';
import CONST from '../lib/constants';

export default class NotificationsView extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                
                <ScrollView>
                    <View>
                        <View style={{ flexDirection: 'row', paddingLeft: 20, backgroundColor: '#FFFFFF', paddingTop: 20, paddingBottom: 20 }}>
                            <View style={{marginRight: 15, marginTop: 4}}>
                                <Image source={require('../assets/timerIcon_notification.png')}/>
                            </View>
                            <View style={{ flexDirection: 'column', marginRight: 25 }}>
                                <Text style={{ paddingRight: 20, fontWeight: 'bold'}}>A request from patient <Text style={{ color: '#2571fb', fontWeight: '500'}}>Mainul Hasan</Text></Text>
                                <Text style={{ color: '#a3a7af'}}>1 min ago</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', paddingLeft: 20, backgroundColor: '#F7F8F9', paddingTop: 20, paddingBottom: 20 }}>
                            <View style={{marginRight: 15, marginTop: 10}}>
                                <Image source={require('../assets/creditIn_notification.png')}/>
                            </View>
                            <View style={{ flexDirection: 'column', marginRight: 25 }}>
                                <Text style={{ paddingRight: 20, fontWeight: 'bold'}}>Your pending payment <Text style={{ color: '#2571fb', fontWeight: '500'}}>100$</Text> added to your account</Text>
                                <Text style={{ color: '#a3a7af'}}>1 Hour Ago</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', paddingLeft: 20, backgroundColor: '#FFFFFF', paddingTop: 20, paddingBottom: 20, }}>
                            <View style={{marginRight: 15, marginTop: 10}}>
                                <Image source={require('../assets/requestAccept_icon_notification.png')}/>
                            </View>
                            <View style={{ flexDirection: 'column', marginRight: 25 }}>
                                <Text style={{ paddingRight: 20, fontWeight: 'bold'}}>Counter request of <Text style={{ color: '#2571fb', fontWeight: '500'}}>Ali hasan</Text> has been accepted</Text>
                                <Text style={{ color: '#a3a7af'}}>Yesterday, 10 min ago</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', paddingLeft: 20, backgroundColor: '#F7F8F9', paddingTop: 20, paddingBottom: 20 }}>
                            <View style={{ marginRight: 15, marginTop: 4 }}>
                                <Image source={require('../assets/timerIcon_notification.png')} />
                            </View>
                            <View style={{ flexDirection: 'column', marginRight: 25 }}>
                                <Text style={{ paddingRight: 20, fontWeight: 'bold' }}>A request from patient <Text style={{ color: '#2571fb', fontWeight: '500' }}>Mainul Hasan</Text> 
                                Would love to take help from you</Text>
                                <Text style={{ color: '#a3a7af' }}>1 min ago</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', paddingLeft: 20, backgroundColor: '#FFF', paddingTop: 20, paddingBottom: 20 }}>
                            <View style={{ marginRight: 15, marginTop: 10 }}>
                                <Image source={require('../assets/creditIn_notification.png')} />
                            </View>
                            <View style={{ flexDirection: 'column', marginRight: 25 }}>
                                <Text style={{ paddingRight: 20, fontWeight: 'bold' }}>Your pending payment <Text style={{ color: '#2571fb', fontWeight: '500' }}>100$</Text> added to your account</Text>
                                <Text style={{ color: '#a3a7af' }}>1 min ago</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', paddingLeft: 20, backgroundColor: '#F7F8F9', paddingTop: 20, paddingBottom: 20, }}>
                            <View style={{ marginRight: 15, marginTop: 10 }}>
                                <Image source={require('../assets/requestAccept_icon_notification.png')} />
                            </View>
                            <View style={{ flexDirection: 'column', marginRight: 25 }}>
                                <Text style={{ paddingRight: 20, fontWeight: 'bold' }}>Counter request of <Text style={{ color: '#2571fb', fontWeight: '500' }}>Ali hasan</Text> has been accepted</Text>
                                <Text style={{ color: '#a3a7af' }}>Yesterday, 10 min ago</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
