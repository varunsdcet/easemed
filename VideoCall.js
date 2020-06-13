import React, {Component, PureComponent} from 'react'
import {
    StyleSheet, Text, View, TouchableOpacity,
    Dimensions, Modal, NativeModules, Image
} from 'react-native'

import {Surface, ActivityIndicator} from 'react-native-paper'
const window = Dimensions.get('window');
import {Stopwatch} from "react-native-stopwatch-timer";
import {RtcEngine, AgoraView} from 'react-native-agora'
import MyChat from './MyChat.js';
import {APPID} from './videosettings'
const GLOBAL = require('./Global');
const options = {
    container: {
        backgroundColor: 'transparent',
    },
    text: {
        fontSize: 12,
        color: '#fff',
    }
};
const {Agora} = NativeModules
console.log(Agora)

if (!Agora) {
    throw new Error("Agora load failed in react-native, please check ur compiler environments")
}

const {
    FPS30,
    AudioProfileDefault,
    AudioScenarioDefault,
    Host,
    Adaptative
} = Agora

const BtnEndCall = () => require('./resources/btn_endcall.png')
const BtnMute = () => require('./resources/btn_mute.png')
const BtnSwitchCamera = () => require('./resources/btn_switch_camera.png')
const IconMuted = () => require('./resources/icon_muted.png')

const {width} = Dimensions.get('window')

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F4F4'
    },
    absView: {
        position: 'absolute',
        top: 70,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'space-between',
    },
    absViews: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width:window.width,
        height:80,
        justifyContent: 'space-between',
    },
    videoView: {
        padding: 5,
        flexWrap: 'wrap',
        flexDirection: 'row',
        zIndex: 100
    },
    localView: {
        flex: 1
    },
    duration: {
      position: 'absolute',
      top: 130,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
  },
    remoteView: {
        width: (width - 40) / 3,
        height: (width - 40) / 3,
        margin: 5,
        backgroundColor:'red'
    },
    bottomView: {
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-around'
    }
})

class OperateButton extends PureComponent {
    render() {
        const {onPress, source, style, imgStyle = {width: 50, height: 50}} = this.props
        return (
            <TouchableOpacity
                style={style}
                onPress={onPress}
                activeOpacity={.7}
            >
                <Image
                    style={imgStyle}
                    source={source}
                />
            </TouchableOpacity>
        )
    }
}

type Props = {
    channelProfile: Number,
    channelName: String,
    clientRole: Number,
    onCancel: Function,
    uid: Number,
}

class VideoCall extends Component<Props> {
    state = {
        peerIds: [],
        joinSucceed: false,
        isMute: false,
        hideButton: false,
        visible: false,
        selectedUid: undefined,
        animating: true,
        connectionState: 'connecting',
    stopwatchStart: false,
    stopwatchReset: false,
    }

    componentWillMount () {
       this.setState({stopwatchStart:true})

        // const options = {
        //     appid: 'ef38b64215ed49d2acc3c6d8e20439f4',
        //     channelProfile: 1,
        //     videoProfile: 40,
        //     clientRole: 1,
        //     swapWidthAndHeight: true
        // };
        // RtcEngine.init(options);


        const config = {
            appid: APPID,
            channelProfile: this.props.channelProfile,
            clientRole: this.props.clientRole,
            videoEncoderConfig: {
                width: 360,
                height: 480,
                bitrate: 1,
                frameRate: FPS30,
                orientationMode: Adaptative,
            },
            swapWidthAndHeight:true,
            audioProfile: AudioProfileDefault,
            audioScenario: AudioScenarioDefault
        }
        console.log("[CONFIG]", JSON.stringify(config));
        console.log("[CONFIG.encoderConfig", config.videoEncoderConfig);
        RtcEngine.on('videoSizeChanged', (data) => {
            console.log("[RtcEngine] videoSizeChanged ", data)
        })
        RtcEngine.on('remoteVideoStateChanged', (data) => {
            console.log('[RtcEngine] `remoteVideoStateChanged`', data);
        })
        RtcEngine.on('userJoined', (data) => {
            console.log('[RtcEngine] onUserJoined', data);
            const {peerIds} = this.state;
            if (peerIds.indexOf(data.uid) === -1) {
                this.setState({
                    peerIds: [...peerIds, data.uid]
                })
            }
        })
        RtcEngine.on('userOffline', (data) => {
            console.log('[RtcEngine] onUserOffline', data);
            this.setState({
                peerIds: this.state.peerIds.filter(uid => uid !== data.uid)
            })
            console.log('peerIds', this.state.peerIds, 'data.uid ', data.uid)
        })
        RtcEngine.on('joinChannelSuccess', (data) => {
            console.log('[RtcEngine] onJoinChannelSuccess', data);
            RtcEngine.startPreview().then(_ => {
                this.setState({
                    joinSucceed: true,
                    animating: false
                })
            })
        })
        RtcEngine.on('audioVolumeIndication', (data) => {
            console.log('[RtcEngine] onAudioVolumeIndication', data);
        })
        RtcEngine.on('clientRoleChanged', (data) => {
            console.log("[RtcEngine] onClientRoleChanged", data);
        })
        RtcEngine.on('videoSizeChanged', (data) => {
            console.log("[RtcEngine] videoSizeChanged", data);
        })
        RtcEngine.on('error', (data) => {
            console.log('[RtcEngine] onError', data);
            if (data.error === 17) {
                RtcEngine.leaveChannel().then(_ => {
                    this.setState({
                        joinSucceed: false
                    })
                    const { state, goBack } = this.props.navigation;
                    this.props.onCancel(data);
                    goBack();
                })
            }
        })
        RtcEngine.init(config);
    }

    toggleStopwatch = () => {
        this.setState({stopwatchStart: !this.state.stopwatchStart, stopwatchReset: false});
    };
    resetStopwatch() {
        this.setState({stopwatchStart: false, stopwatchReset: true});
    }
    getFormattedTime(time) {
        this.currentTime = time;
    }
    getlog = ()=>{


      const url = GLOBAL.BASE_URL +  'online_counsult_timer'
                     fetch(url, {
                         method: 'POST',
                         headers: {
                             'Content-Type': 'application/json',
                         },
                         body: JSON.stringify({
                             booking_id : GLOBAL.booking_id,
                         }),
                     }).then((response) => response.json())
                         .then((responseJson) => {

                             if (responseJson.status == true) {


                               if (responseJson.start_or_end == 1){
                                    this.getlog() 
                               }else{

                                alert('Your Session Expired')
                                this.props.navigation.goBack()
                               }




                             }else {
                                 alert('An error occurred while starting session')
                             }
                         })
                         .catch((error) => {
                             console.error(error);
                         });

    }

    componentDidMount () {
        // this.getlog()
        RtcEngine.getSdkVersion((version) => {
            console.log('[RtcEngine] getSdkVersion', version);
        })

        console.log('[joinChannel] ' + this.props.channelName);
        RtcEngine.joinChannel(this.props.channelName, this.props.uid)
            .then(result => {
                /**
                 * ADD the code snippet after join channel success.
                 */
            });
        RtcEngine.enableAudioVolumeIndication(500, 3,true)
     }

    shouldComponentUpdate(nextProps) {
        return nextProps.navigation.isFocused();
    }


    componentWillUnmount () {
        if (this.state.joinSucceed) {
            RtcEngine.leaveChannel().then(res => {
                RtcEngine.destroy()
            }).catch(err => {
                RtcEngine.destroy()
                console.log("leave channel failed", err);
            })
        } else {
            RtcEngine.destroy()
        }
    }

    handleCancel = () => {
        const { goBack } = this.props.navigation;
        RtcEngine.leaveChannel().then(_ => {
            this.setState({
                joinSucceed: false
            })
            goBack()
        }).catch(err => {
            console.log("[agora]: err", err)
        })
    }

    switchCamera = () => {
        RtcEngine.switchCamera();
    }

    toggleAllRemoteAudioStreams = () => {
        this.setState({
            isMute: !this.state.isMute
        }, () => {
            RtcEngine.muteAllRemoteAudioStreams(this.state.isMute).then(_ => {
                /**
                 * ADD the code snippet after muteAllRemoteAudioStreams success.
                 */
            })
        })
    }

    toggleHideButtons = () => {
        this.setState({
            hideButton: !this.state.hideButton
        })
    }

    onPressVideo = (uid) => {
        this.setState({
            selectedUid: uid
        }, () => {
            this.setState({
                visible: true
            })
        })
    }

    toolBar = ({hideButton, isMute}) => {
        if (!hideButton) {
            return (
                <View>
                    <View style={styles.bottomView}>
                        <OperateButton
                            onPress={this.toggleAllRemoteAudioStreams}
                            source={isMute ? IconMuted() : BtnMute()}
                        />
                        <OperateButton
                            style={{alignSelf: 'center', marginBottom: -10}}
                            onPress={this.handleCancel}
                            imgStyle={{width: 60, height: 60}}
                            source={BtnEndCall()}
                        />
                        <OperateButton
                            onPress={this.switchCamera}
                            source={BtnSwitchCamera()}
                        />
                    </View>
                </View>)
        }
    }

    agoraPeerViews = ({visible, peerIds}) => {
        return (visible ?
            <View style={styles.videoView} /> :
            <View style={styles.videoView}>{
                peerIds.map((uid, key) => (
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => this.onPressVideo(uid)}
                        key={key}>
                        <Text>uid: {uid}</Text>
                        <AgoraView
                            mode={1}
                            key={uid}
                            style={styles.remoteView}
                            zOrderMediaOverlay={true}
                            remoteUid={uid}
                        />
                    </TouchableOpacity>
                ))
            }</View>)
    }

    selectedView = ({visible}) => {
        return (
            <Modal
                visible={visible}
                presentationStyle={'fullScreen'}
                animationType={'slide'}
                onRequestClose={() => {}}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    style={{flex: 1}}
                    onPress={() => this.setState({
                        visible: false
                    })} >
                    <AgoraView
                        mode={1}
                        style={{flex: 1}}
                        zOrderMediaOverlay={true}
                        remoteUid={this.state.selectedUid}
                    />
                </TouchableOpacity>
            </Modal>)
    }

    render () {
        if (!this.state.joinSucceed) {
            return (
                <View style={{flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center'}}>
                    <ActivityIndicator animating={this.state.animating} />
                </View>
            )
        }

        return (
            <Surface
                activeOpacity={1}
                onPress={this.toggleHideButtons}
                style={styles.container}
            >
            {this.state.peerIds.length == 0 && (
                               <AgoraView style={styles.localView} showLocalVideo={true} mode={1} />
            )}
            {this.state.peerIds.length != 0 && (
                               <AgoraView style={styles.localView} remoteUid={this.state.peerIds[0]}showLocalVideo={false} mode={1} />
            )}

                 <View style = {styles.absViews}>
                 <View style = {{flexDirection:'row',width:window.width,height:80,marginLeft:12,justifyContent:'space-between',marginTop:6}}>

<View style = {{flexDirection:'row'}}>
<Image   source={require('./resources/logo.png')}
         style  = {{width:30, height:30,borderRadius:15,borderWidth:2,borderColor:'white'
       }}/>

       <View style = {{marginTop:1,height:30,marginLeft:-20}}>

       <View style = {{flexDirection:'row',width:window.width - 25 ,justifyContent:'space-between'}}>

       <Text style={{fontFamily:GLOBAL.heavy,fontSize:16,marginTop:2,color:'white',marginLeft:20,textAlign:'center'}}>
         {GLOBAL.doctorName}

       </Text>


       <TouchableOpacity
           activeOpacity ={0.99} onPress= {()=>this.handleCancel()}>

       <Image
           source={require('./close.png')}
           style={{width: 12, height: 12,margin:14,resizeMode:'contain'}}


       />
      </TouchableOpacity>
       </View>
       <View style = {{flexDirection:'row',marginLeft:25,marginTop:-20}}>

       <View style = {{flexDirection:'row',height:30}}>
       <Image
           source={require('./clock.png')}
           style={{width: 10, height: 10,marginLeft:1,marginTop:5,resizeMode:'contain'}}


       />
       <View style = {{marginTop:1,marginLeft:5}}>
       <Stopwatch
           laps
           start={this.state.stopwatchStart}
           reset={this.state.stopwatchReset}
           options={options}
           getTime={this.getFormattedTime}
       />
       </View>
       </View>
          </View>
             </View>
 </View>
  </View>


                 </View>


        <View style={styles.absView}>
  {this.state.peerIds.length != 0 && (
        <AgoraView
    mode={1}
    style={{width: (width - 40) / 3,height:  (width - 40) / 3,margin:5,borderWidth:6,borderColor:'white',backgroundColor:'red'}}
    zOrderMediaOverlay={true}
    showLocalVideo={true}
/>
)}


                    <View style={{flex:2,flexDirection:'row',backgroundColor:'transparent',width:window.width - 30,position:'absolute',bottom:10,height:250}}>

                                       <MyChat>

                                       </MyChat>
                                       </View>

                </View>


            </Surface>
        )
    }
}

export default function AgoraRTCViewContainer(props) {
    console.log(JSON.stringify(props))
    const  navigation  = props.route.params

    const channelProfile = navigation.channelProfile
    const clientRole = navigation.clientRole
    const channelName = navigation.channelName
    const uid = navigation.uid
    const onCancel = navigation.onCancel

    return (<VideoCall
        channelProfile={channelProfile}
        channelName={channelName}
        clientRole={clientRole}
        uid={uid}
        onCancel={onCancel}
        {...props}
    ></VideoCall>)
}
