import React, {Component} from 'react';
import { StyleSheet,Text, View,Image ,Alert,Dimensions ,ScrollView,TouchableOpacity} from 'react-native';
import Button from 'react-native-button';
const window = Dimensions.get('window');
const GLOBAL = require('./Global');
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import CheckBox from 'react-native-check-box'
import NetInfo, {NetInfoSubscription} from "@react-native-community/netinfo";
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-community/async-storage';
import CustomBack from './CustomBack'
// get all required values of device
let uniqueId = DeviceInfo.getUniqueId();
let hasNotch = DeviceInfo.hasNotch();
// console.log(RNLocalize.getCountry());

var deviceNetinfo = NetInfo.fetch().then(state => {
  GLOBAL.deviceIp = state.details.ipAddress
  console.log(JSON.stringify(state))
  console.log("Connection type", state.details.ipAddress);
  console.log("Is connected?", state.isConnected);
});

//alert(GLOBAL.deviceIp)
DeviceInfo.getManufacturer().then(manufacturer => {
  GLOBAL.deviceManuf = manufacturer
});

DeviceInfo.getCarrier().then(carrier => {
  GLOBAL.deviceCarrier = carrier
});

let model = DeviceInfo.getModel();


export default class Term extends Component {
   static navigationOptions = ({ navigation }) => {
    return {
       header: () => null,
    }
}

 constructor(props) {
    super(props)
    this.state = {
      isChecked:false,
    }

  }



  componentDidMount(){

  }

  accept=()=>{
var loginType = "mobile"
    if(this.state.isChecked){
    this.props.navigation.navigate('Signup', {params:{ login_Type: loginType }})

    }else{
      alert('Please accept the user agreement.')

    }


  }



  render() {
    return (
      <View style={styles.container}>


         <View style={{flexDirection:'column',flex:1, alignItems:'center',}}>


         <View style={{width:wp('100%'), marginTop:hp('0%'),}}>

         <CustomBack headTitle={'Back'}
         navigation={this.props.navigation}/>
  <ScrollView style = {{height:window.height}}>
         <Image style = {{width:80, height:80, alignSelf:'center',resizeMode:'contain', marginTop:hp('1%'),}} source={require('./resources/logo.png')}/>
          <Text style = {{color:'#1976D2',fontSize: 22,fontFamily:'AvenirLTStd-Heavy',alignSelf:'center',textAlign:'center',marginTop:hp('2%'), }}>
          easeMymed</Text>

          <Text style = {{color:'gray',fontSize: 18,fontFamily:'AvenirLTStd-Heavy',alignSelf:'center',textAlign:'center',marginTop:hp('2%'), }}>
          TERMS & CONDITION</Text>

          <Text style = {{color:'gray',margin:25,fontSize: 15,fontFamily:'Avenir Roman',alignSelf:'center',textAlign:'justify',marginTop:hp('3%'),lineHeight:22 }}>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages release of Letraset sheets containing Lorem Ipsum passages,, and more recently wi
          </Text>

          </ScrollView>





     </View>

      </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#fafafa'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },

});
