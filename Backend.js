import firebase from "firebase";
const GLOBAL = require('./Global');
class Backend {
    uid = GLOBAL.user_id;
    messagesRef = null;
    // initialize Firebase Backend
    constructor() {
        firebase.initializeApp({
            apiKey: "AIzaSyARtB8dultqw4YYFhvkYc0PWTO9xUGsGok",
            authDomain: "easemymed-1e584.firebaseapp.com",
            databaseURL: "https://easemymed-1e584.firebaseio.com",
            projectId: "easemymed-1e584",
            storageBucket: "gs://easemymed-1e584.appspot.com",
        });

        state:{
            imageUrl:''
        }
    }
    setUid(value) {
        this.uid = value;
    }
    getUid() {
        return this.uid;
    }
    // retrieve the messages from the Backend
    loadMessages(callback) {
        this.messagesRef =  firebase.database().ref().child("chat/" + GLOBAL.chat_g_id + '200');


        this.messagesRef.off(); //Detaches a callback previously attached with on()
        const onReceive = data => {
            const message = data.val();
            callback({
                _id: data.key,
                text: message.text,
                //createdAt: new Date(message.createdAt),
                createdAt: message.createdAt,
                // sent: true,
                // received: false,
                // pending: message.pending,
                user: {
                    _id: message.user._id,
                    name: message.user.name
                },
                image: message.image
            });
        };

        var d = this.getLimit();
        console.log(d);
        //Generates a new Query object limited to the last specific number of children.
        //this.messagesRef.limitToLast(10).on("child_added", onReceive);
        this.messagesRef
            .orderByChild("createdAt")
            //.startAt(d)
            //.endAt("2017-11-27T06:51:47.851Z")
            .on("child_added", onReceive);
    }


        sendImage(image){
        //     console.log(image)
        //     var id ="chat/" + '200'
        //     const url = GLOBAL.BASE_URL + "image_attchment_for_chat";
        //     const data = new FormData();
        //     data.append('bridge_id', id);
        //     data.append('flag', 1);
        //     // you can append anyone.
        //     data.append('image', {
        //         uri: image,
        //         type: 'image/jpeg', // or photo.type
        //         name: 'image.png'
        //     });
        //    console.log(JSON.stringify(data))
        //     fetch(url, {
        //         method: 'post',
        //         body: data,
        //         headers: {
        //             'Content-Type': 'multipart/form-data',
        //         }
        //     }).then((response) => response.json())
        //         .then((responseJson) => {
        //         console.log(JSON.stringify(responseJson))
        //         if (responseJson.status == true) {
        //             this.setState({imageUrl: responseJson.images})
        //         }else{

        //         }
        //         })
        //   .catch((error) => {
        //   // this.hideLoading()
        //   console.error(error);

        // });


      // //  const ext = image.split('.').pop(); // Extract image extension
      //   const filename = `${1}.png`; // Generate unique name

      //   firebase.storage().ref().bucket

      //   firebase
      //       .storage()
      //       .ref(`tutorials/images/${filename}`)
      //       .putString(image, 'base64')
      //       .on(
      //           firebase.storage.TaskEvent.STATE_CHANGED,
      //           snapshot => {
      //               let state = {};
      //               state = {
      //                   ...state,
      //                   progress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100 // Calculate progress percentage
      //               };
      //               if (snapshot.state === firebase.storage.TaskState.SUCCESS) {
      //                   const allImages = this.state.images;
      //                   allImages.push(snapshot.downloadURL);
      //                   state = {
      //                       ...state,
      //                       uploading: false,
      //                       imgSource: '',
      //                       imageUri: '',
      //                       progress: 0,
      //                       images: allImages
      //                   };

      //               }
      //               this.setState(state);
      //           },
      //           error => {
      //               unsubscribe();
      //               alert('Sorry, Try again.');
      //           }
      //       );
    }

    // send the message to the Backend
    sendMessage(message) {
//        console.log(JSON.stringify(message))
        console.log(new Date(firebase.database.ServerValue.TIMESTAMP));
        var today = new Date();
        /* today.setDate(today.getDate() - 30);
        var timestamp = new Date(today).toISOString(); */
        var timestamp = today.toISOString();
        for (let i = 0; i < message.length; i++) {

          var z = "";
                        var k = message[i].hasOwnProperty('image')
                             if (k == true){
                               z = message[i].image;


                             } else {
                               z = "";

                             }

            this.messagesRef.push({

                text: message[i].text,
                // sent: true,
                // received: true,
                // pending: false,
                user: message[i].user,
                createdAt: timestamp,
                image: z
            });
        }
    }
    // close the connection to the Backend
    closeChat() {
        if (this.messagesRef) {
            this.messagesRef.off();
        }
    }

    getLimit() {
        var today = new Date();
        //var milliseconds = Date.parse(today);
        //var changed = milliseconds - 86400000; //10 minutes (- 900000) -  86400000 1 day
        today.setDate(today.getDate() - 31); // last 30 Days
        //console.log(today);
        var changedISODate = new Date(today).toISOString();
        //var changedISODate = today.toISOString();
        console.log(changedISODate);
        return changedISODate;
    }
}

export default new Backend();
