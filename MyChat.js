import React, {Component} from 'react';
import { StyleSheet, Text, View, Button,Image, Dimensions,TouchableOpacity } from 'react-native';
import Backend from "./Backend.js";
import { GiftedChat, InputToolbar,Send } from 'react-native-gifted-chat'
const GLOBAL = require('./Global');
const window = Dimensions.get('window');


type Props = {};
export default class MyChat extends Component<Props> {
    state = {
        messages: []
    };



    renderSend(props) {
        return (
            <Send
                {...props}
            >
                <View style={{backgroundColor:'transparent'}}>
                    <Image source={require('./chat-btn.png')}
                    style = {{height:38,width:38,resizeMode:'contain',backgroundColor:'transparent'}}/>
                </View>
            </Send>
        );
    }


    renderInputToolbar (props) {
        //Add the extra styles via containerStyle
        return <InputToolbar {...props}

                             textInputStyle={{ color: "#fff" }}
                             containerStyle={{backgroundColor:'rgba(0,0,0,0.6)',margin:10,borderRadius:20,borderWidth:0,color:'white',marginBottom:0}} />
    }
    renderMessages = (msg) => {

  let message = msg.currentMessage
  var ColorCode = 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')';

  console.log("single message", message)
  return (
    <View>
      {/* <Text>{item.message}</Text> */}
      {message.user.user_id === GLOBAL.user_id?
        <View style={styles.left_bubble}>
          {/* <Text>{message.user.name}</Text> */}
          <View style = {{backgroundColor:'rgba(0,0,0,0.6)',borderRadius:12,marginBottom:6,borderColor:'#979797',borderWidth:0,flexDirection:'row',marginLeft:6,}}>
              <Text style={{color:'#7BAAED',fontFamily:GLOBAL.medium,fontSize:12,margin:4,marginLeft:8}}>{message.user.name} :</Text>
              <Text style={{color:'white',fontFamily:GLOBAL.medium,fontSize:12,margin:4,marginRight:8}}>{message.text}</Text>

          </View>

        </View>
        :
        <View style = {{backgroundColor:'rgba(0,0,0,0.4)',borderRadius:12,marginBottom:6,borderColor:'#979797',borderWidth:0,flexDirection:'row',marginLeft:14,width:window.width - 108}}>


  {message.user_id == GLOBAL.user_id && (
    <View style = {{flexDirection:'row'}}>
            <Text style={{color:'white',fontFamily:GLOBAL.medium,fontSize:12,margin:4,marginLeft:8,padding:1,lineHeight:16}}>{message.user.name}:  </Text>
    <Text style={{color:'#7BAAED',fontFamily:GLOBAL.medium,fontSize:12,margin:4,marginLeft:1,padding:1,lineHeight:16}}> {message.text}</Text>
    </View>

)}

  {message.user_id != GLOBAL.user_id && (
    <View style = {{flexDirection:'row'}}>
            <Text style={{color:'white',fontFamily:GLOBAL.medium,fontSize:12,margin:4,marginLeft:8,padding:1,lineHeight:16}}>{message.user.name}:  </Text>
<Text style={{color:'#7BAAED',fontFamily:GLOBAL.medium,fontSize:12,margin:4,marginLeft:1,padding:1,lineHeight:16}}> {message.text}</Text>
</View>
)}

        </View>
      }
    </View>
  )}


    renderBubble(props) {


        return (
                <TouchableOpacity onPress= {()=> EventRegister.emit('myCustomEvent', props.currentMessage)}>
            <View style = {{backgroundColor:'rgba(0,0,0,0.5)',borderRadius:12,marginBottom:6,borderColor:'#979797',borderWidth:1,flexDirection:'row',marginRight:3,width:window.width - 142}}>


                <Text style={{color:'#7BAAED',fontFamily:GLOBAL.medium,fontSize:12,margin:4}}>{props.currentMessage.user.name} :</Text>

                <Text style={{color:'white',fontFamily:GLOBAL.medium,fontSize:12,margin:4}}>{props.currentMessage.text}</Text>

            </View>
            </TouchableOpacity>
        );
    }
    componentWillMount() {

    }
    render() {
        if (GLOBAL.user_id == "" || GLOBAL.user_id == "0" ){
            return(
                <View style={{flex:1}}>
                    <Text style = {{color:'black',fontSize:22,alignSelf:'center',marginTop:window.height/2,textAlign:'center'}}>
                        Please Login First to Join Chat.
                    </Text>
                </View>
            )
        }

        return (
            <GiftedChat
                renderUsernameOnMessage = {false}
                messages={this.state.messages}
                renderInputToolbar={this.renderInputToolbar}
                renderBubble={this.renderBubble}
                renderSend = {this.renderSend}
                renderMessage={(message) => this.renderMessages(message)}
                onInputTextChanged = {text =>{
                //  Backend.updateTyping(text)

                  // alert(text)

              }

              }
                onSend={message => {
                    Backend.sendMessage(message);
                }}

                user={{
                    _id: GLOBAL.user_id,
                    name: GLOBAL.doctorName
                }}
            />
        );
    }


    componentDidMount() {
        Backend.loadMessages(message => {
            this.setState(previousState => {
                return {
                    messages: GiftedChat.append(previousState.messages, message)
                };
            });
        });
    }
    componentWillUnmount() {
        Backend.closeChat();
    }
}
