import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    Image,
    Alert,
    Modal,
    Linking,

    FlatList,
    Dimensions,
    TouchableOpacity,
    ActivityIndicator,

    AsyncStorage
} from 'react-native';
import Button from 'react-native-button';
import {AppState} from 'react-native'
const window = Dimensions.get('window');


const GLOBAL = require('./Global');

type Props = {};
var dict = {};
let customDatesStyles = [];

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


export default class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            recognized: '',
             appState: AppState.currentState,
            started: '',
            text :'',
            department :[],
            speciality :[],
            hospital:[],
            price:[],
            type :'',
            results: [],


        };

    }

    componentWillUnmount() {

    }
    call = () => {
  var phoneNumber = `tel:${'7724000070'}`;
    Linking.openURL(phoneNumber);
}

    addBookmark = (id) =>{

      this.showLoading()
      const url =  GLOBAL.BASE_URL  + 'add_patient_doc_bookmark'

      fetch(url, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },


          body: JSON.stringify({
              "user_id":GLOBAL.user_id,
              "doctor_id":id





          }),
      }).then((response) => response.json())
          .then((responseJson) => {


    this.hideLoading()


              if (responseJson.status == true) {
                alert('Bookmark Added Successfully')
              }else{

              }
          })
          .catch((error) => {
              console.error(error);
              this.hideLoading()
          });

    }

    deleteBookmark = (id) =>{
      this.showLoading()
      const url =  GLOBAL.BASE_URL  + 'delete_bookmark_patient'

      fetch(url, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },


          body: JSON.stringify({
              "user_id":GLOBAL.user_id,
              "doctor_id":id





          }),
      }).then((response) => response.json())
          .then((responseJson) => {


    this.hideLoading()


              if (responseJson.status == true) {
                alert('Bookmark Delete Successfully')
              }else{

              }
          })
          .catch((error) => {
              console.error(error);
              this.hideLoading()
          });
    }

    bookmark = (item,index) => {

      if (item.is_bookmark == "0"){
        this.addBookmark(item.id)
        var a = this.state.results[index]
        a.is_bookmark = "1"
        this.state.results[index] = a
        this.setState({results:this.state.results})

      }else{
        this.deleteBookmark(item.id)
        var a = this.state.results[index]
        a.is_bookmark = "0"
        this.state.results[index] = a
          this.setState({results:this.state.results})
      }


    }



    fetchSpeciality = (res,type,depart) => {
        var myArray = [];
        var speciality = '';
        if (res == null || res.length == 0) {
            this.fetchHospital(res,type,depart,'')
        } else {
            var array = res.array
            for (var i = 0; i < array.length; i++) {
                if (array[i].selected == "Y") {
                    speciality = speciality + array[i].id + ','
                    myArray.push(array[i])

                }
            }
            speciality = speciality.slice(0, -1);

            store.get('hospital')
                .then((res) =>
                    //  alert(JSON.stringify(res))
                    this.fetchHospital(res,type,depart,speciality)
                )

        }
        this.setState({speciality:myArray})

    }
    fetchHospital = (res,type,depart,speciality) =>{
        var myArray = [];
        var hospital = '';
        if (res == null || res.length == 0) {
            this.setState({hospital:[]})

        } else {
            var array = res.array
            for (var i = 0; i < array.length; i++) {
                if (array[i].selected == "Y") {
                    hospital = hospital + array[i].id + ','
                    myArray.push(array[i])
                }
            }
            this.setState({hospital: myArray})
            hospital = hospital.slice(0, -1);
        }

        const url =  GLOBAL.BASE_URL  + 'fetch_nearest_doctor'

        fetch(url, {
                method: 'POST',
                    timeoutInterval: 90000, // milliseconds
                sslPinning: {
                certs: ['anytimedoc_in']
                  },
            headers: {
                'Content-Type': 'application/json',
            },


            body: JSON.stringify({
                "user_id":GLOBAL.user_id,
                "lat":GLOBAL.lat,
                "long":GLOBAL.long,
                "doctor_condition":'offline',
                "type":type,
                "departments_filter":depart,
                "hospital_filter":hospital,
                "price_range_min":"",
                "price_range_max":"",
                "is_favrouite":"",
                "specialty":speciality,




            }),
        }).then((response) => response.json())
            .then((responseJson) => {

              //  alert(JSON.stringify(responseJson))


                if (responseJson.status == true) {
                    this.setState({results:responseJson.doctor_list_s})
//                    alert(JSON.stringify(responseJson.doctor_list_s))


                }else{
                    this.setState({results:[]})
                }
            })
            .catch((error) => {
                console.error(error);
                this.hideLoading()
            });


    }

    fetchDepartment = (res,type) => {
        var myarray = [];
        var depart = '';
        if (res == null || res.length == 0) {
            this.fetchSpeciality(res,type,'')
        } else {
            var array = res.array
            for (var i = 0; i < array.length; i++) {
                if (array[i].selected == "Y") {
                    depart = depart + array[i].id + ','
                    myarray.push(array[i])

                }
            }
            depart = depart.slice(0, -1);
//            alert(depart)

            store.get('speciality')
                .then((res) =>
                    //  alert(JSON.stringify(res))
                    this.fetchSpeciality(res,type,depart)
                )
        }
        this.setState({department:myarray})


    }

    getApicall(type)
    {

        store.get('departments')
            .then((res) =>
                //  alert(JSON.stringify(res))
                this.fetchDepartment(res,type)
            )



    }

    top=(get)=>{
        GLOBAL.appointmentArray = dict

        if (get == "Online") {
            GLOBAL.type = "4"
            GLOBAL.price = dict.online_consult_video_price
            GLOBAL.type = "4"

            this.props.navigation.navigate('OnlineBooking')

        }
        else {

            GLOBAL.price = dict.normal_appointment_price
            GLOBAL.type = "5"
            GLOBAL.onlinetype = "normal"


                this.props.navigation.navigate('BookingAppointmentDetail')



        }

    }

    setModalVisible=(visible,get)=> {


        this.setState({modalVisible : visible})

        this.timeoutCheck = setTimeout(() => {

            this.top(get)
        }, 400);



    }


    static navigationOptions = ({ navigation }) => {
        return {
            //   header: () => null,
            title: 'SEARCH',
            headerTitleStyle :{textAlign: 'center',alignSelf:'center',color :'white'},
            headerStyle:{
                backgroundColor:'#D90000',
            },
            headerTintColor :'white',
            animations: {
                setRoot: {
                    waitForRender: false
                }
            }
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
  //    AppState.addEventListener('change', this._handleAppStateChange);
      //  this.props.navigation.addListener('willFocus',this._handleStateChange);


    }
    _handleAppStateChange = (nextAppState) => {
        if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
          console.log('App has come to the foreground!')
        }
        this.setState({appState: nextAppState});
      }

    login = (s,item) => {

        dict = item


        GLOBAL.appointmentArray = item
        GLOBAL.speciality = s
        if (item.online_consult == "4" && item.normal_appointment == "1" ){
            this.setState({modalVisible:true})

        } else if (item.online_consult == "4") {
            GLOBAL.type = "4"
            GLOBAL.price = item.online_consult_video_price
            GLOBAL.type = "4"
            this.props.navigation.navigate('OnlineBooking')
        }
        else if (item.normal_appointment == "1") {

            GLOBAL.price = item.normal_appointment_price
            GLOBAL.type = "5"
            GLOBAL.onlinetype = "normal"
            this.props.navigation.navigate('BookingAppointmentDetail')
        }



       //
    }

    check = () => {
        this.setState({isSecure :!this.state.isSecure})
    }

    selectedFirst = (item) => {


        if (item.type != "speciality") {

                GLOBAL.doc_id = item.id
                this.props.navigation.navigate('DoctorDetails')
        } else {
           GLOBAL.searchSpeciality = item.name
            this.props.navigation.navigate('SearchSpeciality')
        }

    }
    selectedFirstsd = (item,speciality) => {


            GLOBAL.searchSpeciality = item.specialty_name
            this.props.navigation.navigate('SearchSpeciality')


    }
    selectedFirsts = () => {

        if (item.type != "speciality") {
          GLOBAL.doc_id = item.id
          this.props.navigation.navigate('DoctorDetails')
        } else {
            GLOBAL.searchSpeciality = item.specialty_name
            this.props.navigation.navigate('SearchSpeciality')
        }

    }
    getIndex = (index) => {

        this.setState({email:this.state.data[index].id})
    }

    _renderDepartmentss =  ({item,index}) => {
        return (
            <View style = {{backgroundColor:'white',borderRadius:12 ,margin :2}}>

                <Text style = {{color:'black',fontFamily:GLOBAL.regular,margin:4,fontSize:10}}>
                    {item.name}

                </Text>


            </View>




        )


    }
    _renderDepartments =  ({item,index}) => {
        return (
            <View style = {{backgroundColor:'white',borderRadius:12 ,margin :2}}>

                <Text style = {{color:'black',fontFamily:GLOBAL.regular,margin:4,fontSize:10}}>
                    {item.name}

                </Text>


            </View>




        )


    }
    _renderDepartment =  ({item,index}) => {
        return (
            <View style = {{backgroundColor:'white',borderRadius:12 ,margin :2}}>

                <Text style = {{color:'black',fontFamily:GLOBAL.regular,margin:4,fontSize:10}}>
                    {item.name}

                </Text>


            </View>




        )


    }

    _renderItems2 = ({item,index}) => {







        return (

            <TouchableOpacity onPress={() => this.selectedFirst(item)
            }>
                <View style={{ flex: 1 ,marginLeft : 0,width:window.width , backgroundColor: 'white',marginTop: 10,height:40,borderRadius:10}}>






                <Text style={{marginLeft : 5,fontSize : 14,color :'#1E1F20',fontFamily:GLOBAL.semi,width :'70%',marginTop:8}}>

                    {item.specialty_name}
                </Text>
    </View>




            </TouchableOpacity>
        )
    }
    _renderItems = ({item,index}) => {




        return (

            <TouchableOpacity onPress={() => this.selectedFirst(item)
            }>
                <View style={{ flex: 1 ,marginLeft : 0,width:window.width , backgroundColor: 'white'}}>

       {item.type == "speciality" && (

      <View style = {{flexDirection:'row',width:'100%',justifyContent:'space-between'}}>

      <Text style = {{fontSize:15,color:'grey',margin:5,width:window.width - 150,marginTop:12}}>
      {item.name}

      </Text>

      <Text style = {{fontSize:15,color:'grey',marginRight:35,marginTop:17}}>
      Speciality

      </Text>

      </View>


       )}
   {item.type != "speciality" && (

     <View style = {{flexDirection:'row'}}>

     <Image style = {{width:50,height:50,resizeMode:'contain',margin:6}}
     source={{uri:item.image_url}} />

     <View>

     <Text style = {{fontSize:15,color:'grey',margin:5,width:window.width - 150,marginTop:12}}>
     {item.name}

     </Text>

          <Text style = {{fontSize:15,color:'grey',margin:5,width:window.width - 150,marginTop:1}}>
     {item.speciality}

     </Text>
     </View>



     </View>

   )}


<View style = {{height:1,backgroundColor:'#f1f1f1',width:'100%'}}>


</View>

                </View>





            </TouchableOpacity>
        )
    }

    SearchFilterFunction(text){
        console.log(GLOBAL.user_id+'----'+ GLOBAL.lat+'----'+GLOBAL.long+'----'+text)

        const url =  'http://139.59.76.223/easeMymed/api/search_doctor_n_speciality'

        fetch(url, {
                method: 'POST',

            headers: {
                'Content-Type': 'application/json',
            },


            body: JSON.stringify({

                "search":text,





            }),
        }).then((response) => response.json())
            .then((responseJson) => {
              console.log(responseJson)




                if (responseJson.status == true) {


                    this.setState({results:responseJson.rows})



                }else{
                    this.setState({results:[]})
                }
            })
            .catch((error) => {
                console.error(error);
                this.hideLoading()
            });


    }

    render() {

        if(this.state.loading){
            return(
                <View style={styles.container}>
                    <ActivityIndicator style = {styles.loading}

                                       size="large" color='#006FA5' />
                </View>
            )
        }
        return (

                <View style={styles.container}>

                    <View style = {{margin :10,width:window.width - 20 ,height:45,borderRadius:20,flexDirection:'row',backgroundColor:'white',}}>



                        <TextInput style={{marginLeft:10 ,width:window.width - 100, height:45}}
                                   placeholderTextColor='rgba(0, 0, 0, 0.4)'
                                   onChangeText={(text) => this.SearchFilterFunction(text)}
                                   value={this.state.height}

                                    placeholder={"Search Doctor By Name/Speciality"}/>





                    </View>






                    <FlatList style= {{flexGrow:0,margin:8,height:window.height - 60}}
                              data={this.state.results}
                              numColumns={1}
                              keyExtractor = { (item, index) => index.toString() }
                              renderItem={this._renderItems}
                    />












                </View>

        );
    }
}

const styles = StyleSheet.create({
    wrapper: {
    },
    container: {
        flex:1,
        backgroundColor :'#f1f1f1',

    },
    loading: {
        position: 'absolute',
        left: window.width/2 - 30,

        top: window.height/2,

        opacity: 0.5,

        justifyContent: 'center',
        alignItems: 'center'
    },
    slide1: {

        marginLeft : 50,

        width: window.width - 50,
        height:300,
        resizeMode:'contain',
        marginTop : window.height/2 - 200


    },
    slide2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    slide3: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#92BBD9',
    },
    text: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold',
    },
    account :{
        marginTop : 20,
        textAlign : 'center',
        fontSize: 17,
        justifyContent:'center',
        color : '#262628',
        fontFamily:GLOBAL.regular,


    } ,
    createaccount :{
        marginLeft : 5,
        fontSize: 17,
        textAlign : 'center',
        marginTop : 30,
        color : '#7BAAED',




    } ,

    createaccounts :{
        marginLeft : 5,
        fontSize: 17,
        textAlign : 'center',
        marginTop : 30,
        color : '#7BAAED',
        textDecorationLine: 'underline',



    } ,
    transcript: {
        textAlign: 'center',
        color: 'red',

    },
})
