import React from 'react';
import { View, TouchableHighlight, Modal, StyleSheet, Text, ImageBackground, Image} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import API from '../../../lib/api';

export default class VideoChatModal extends React.Component {

    constructor(props){
        super(props);
        this.state = {};
        this.API = new API();
    }

    render(){

        return(
            <Modal
                animationType={this.props.animationType}
                transparent={false}
                onRequestClose={() => {}}
                visible={this.props.modalVisible}>
                    <ImageBackground 
                        style={{ paddingTop: 22, flex: 1, flexDirection: 'column', backgroundColor: "#F7F8F9", paddingTop: -20, height: '100%', width: '100%' }}
                        source={require('../../../assets/doctorVideoScreen.jpg')}    
                    >
                        
                        <Image  source={require('../../../assets/doctor.jpg')} style={{
                            borderRadius: 30,
                            height: 50,
                            width: 50,
                            marginLeft: '80%',
                            marginTop: '5%'
                        }}/>

                        <View style={{
                            marginTop: '85%',
                            flex: 1
                        }}>
                            <View style={{ marginTop: '15%', alignSelf: 'center'}}>
                                {/* <Text style={{ color: '#fff', fontWeight: 'bold'}}>Saidul Islam</Text> */}
                                <Text style={{ color: '#FFF', marginLeft: 12}}>00:12:59</Text>
                            </View>
                            <View style={{
                                flexDirection: 'row',
                                marginLeft: '5%',
                                marginRight: '5%',
                                marginTop: '7%'
                            }}>
                                <TouchableHighlight style={styles.bottomActionBtn}>
                                    <MaterialCommunityIcons  name="camera-switch" size={23} style={{ color: '#FFF', marginLeft: 2}}/>
                                </TouchableHighlight>
                                <TouchableHighlight style={styles.bottomActionBtn}>
                                    <MaterialCommunityIcons name="arrow-collapse-all" size={23} style={{ color: '#FFF', marginLeft:2 }} />
                                </TouchableHighlight>
                                <TouchableHighlight style={styles.bottomActionBtn}>
                                    <MaterialCommunityIcons name="video-off" size={23} style={{ color: '#FFF', marginLeft: 2 }} />
                                </TouchableHighlight>
                            </View>
                        </View>

                    </ImageBackground>
            </Modal>
        );
    }
}

const styles =  StyleSheet.create({
    bottomActionBtn: {
        marginLeft: '15%', 
        backgroundColor: 'rgba(30, 32, 37, 0.5)', 
        padding: 10, 
        borderRadius: 50, 
        height: 45, 
        width: 45
    }
});