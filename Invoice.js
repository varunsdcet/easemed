import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Alert,
    Modal,
    FlatList,
    Dimensions,
    TouchableOpacity,
    TextInput
} from 'react-native';
import Button from 'react-native-button';
const window = Dimensions.get('window');
const GLOBAL = require('./Global');
import CustomBack from './CustomBack'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import IndicatorCustom from './IndicatorCustom'
import {
  PulseIndicator,
} from 'react-native-indicators';

export default class Invoice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            doctorsList:[
                  {
                    id: '1',
                    title: 'Dr. Jordan',
                    exp: '5 years exp',
                    degree: 'MBBS, MD',
                    cat: 'Physician',
                    speaks: 'English, Hindi',
                    artwork: require('./resources/doc.png'),
                    loc: 'Rohini, New Delhi',
                    fee: 'Rs. 200',
                  },
                  {
                    id: '1',
                    title: 'Dr. Jordan',
                    exp: '5 years exp',
                    degree: 'MBBS, MD',
                    cat: 'Physician',
                    speaks: 'English, Hindi',
                    artwork: require('./resources/doc.png'),
                    loc: 'Rohini, New Delhi',
                    fee: 'Rs. 200',
                  },
                  {
                    id: '1',
                    title: 'Dr. Jordan',
                    exp: '5 years exp',
                    degree: 'MBBS, MD',
                    cat: 'Physician',
                    speaks: 'English, Hindi',
                    artwork: require('./resources/doc.png'),
                    loc: 'Rohini, New Delhi',
                    fee: 'Rs. 200',
                  },
                  {
                    id: '1',
                    title: 'Dr. Jordan',
                    exp: '5 years exp',
                    degree: 'MBBS, MD',
                    cat: 'Physician',
                    speaks: 'English, Hindi',
                    artwork: require('./resources/doc.png'),
                    loc: 'Rohini, New Delhi',
                    fee: 'Rs. 200',
                  },
            ]
        };

    }

    componentWillUnmount() {

    }


    static navigationOptions = ({ navigation }) => {
        return {
               header: () => null,

        }
    }



    showLoading() {
        this.setState({loading: true})
    }


    hideLoading() {
        this.setState({loading: false})
    }

    _handleStateChange = (state) => {

    }

    componentDidMount(){
        this.props.navigation.addListener('focus',this._handleStateChange);

    }

    getDoctors=()=>{
        const url = GLOBAL.BASE_URL +  'fetch_nearest_doctor'
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "user_id": GLOBAL.user_id,
                "doctor_condition":"online",
                "type":"",
                "departments_filter":"",
                "specialty":"",
                "symptoms":"",
                "hospital_filter":"",
                "price_range_min":"",
                "price_range_max":"",
                "is_favrouite":""
            }),
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log(JSON.stringify(responseJson))

                if (responseJson.status == true) {
                    this.setState({ doctorsList : responseJson.doctor_list_s})
                }
            })
            .catch((error) => {
                console.error(error);
              //   this.hideLoading()
            });
    }

    onSelect=(item, index)=>{

    }

    consult=(item, index)=>{
        GLOBAL.doc_item = item
        this.props.navigation.navigate('Summary')
    }

     capitalizeFirstLetter=(string)=> {
       return string.charAt(0).toUpperCase() + string.slice(1);
    }

    _renderItems=({item, index})=>{



        return(

          <View style = {{margin:5,justifyContent:'space-between',width:window.width - 10 ,elevation:5,marginBottom:10,height:80,backgroundColor:'white',flexDirection:'row'}}>
<View style = {{flexDirection:'row'}}>
<Image style={{width:50, height:50,marginLeft:10,marginTop:10, resizeMode:'contain'}}
source={require('./resources/medical.png')}/>

<View>
<Text style = {{fontSize:16,marginLeft:16,marginTop:8,fontFamily:'AvenirLTStd-Heavy',color:'#1976D2',textAlign:'left'}}>
Invoice #23456
</Text>

<Text style = {{fontSize:14,marginLeft:16,fontFamily:'AvenirLTStd-Medium',color:'#1E1F20',textAlign:'left',marginTop:5}}>
06 May 2020
</Text>

</View>


</View>
<Text style = {{fontSize:13,marginRight:16,marginTop:30,fontFamily:'AvenirLTStd-Medium',textDecorationLine: 'underline' ,color:'#1976D2',textAlign:'left'}}>
View
</Text>

          </View>

        )
    }

    render() {

        if(this.state.loading){
            return(
                <IndicatorCustom/>
            )
        }
        return (

      <View style={styles.container}>
         <CustomBack headTitle={'My Invoices'}
         navigation={this.props.navigation}/>

        <View style={{width:wp('100%'), backgroundColor:'white',flexDirection:'column',
        alignSelf:'center'}}>





        <FlatList style= {{flexGrow:0,marginTop:hp(1), marginBottom:hp(14)}}
                  data={this.state.doctorsList}
                  horizontal={false}
                  keyExtractor = { (item, index) => index.toString() }
                  renderItem={this._renderItems}
                  extraData={this.state}
        />

        </View>


        </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor :'#f5f5f5',
    },

})
