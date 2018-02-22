import React, { Component } from 'react';
import {AsyncStorage, Platform, StyleSheet, TextInput, Alert, Image} from 'react-native';
import { Drawer,
         Container,
         Header,
         View,
         DeckSwiper,
         Card,
         CardItem,
         Thumbnail,
         Text,
         Left,
         Right,
         Body,
         Title,
         Button,
         Content,
         Footer,
         FooterTab,
         Icon,
         Spinner } from 'native-base';
import { NavigationActions } from 'react-navigation';
import * as firebase from 'firebase';


var config = {
    apiKey: "AIzaSyBoPA-hJksEC7PY-OprZR7z9vuV0sqj_-4",
    authDomain: "matchfolio-3ad17.firebaseapp.com",
    databaseURL: "https://matchfolio-3ad17.firebaseio.com",
    projectId: "matchfolio-3ad17",
    storageBucket: "matchfolio-3ad17.appspot.com",
    messagingSenderId: "506540295492"
  };
  firebase.initializeApp(config);

const emailsuffix = "@matchfolio.com"
const baseUrl = 'http://pa.cdn.appfolio.com/';

const resetAction = NavigationActions.reset({
  index: 0,
  actions: [
    NavigationActions.navigate({routeName: 'main'})
  ]
})

/*              code to write properites to uuid !!!!!!!!!!!!!!!!!!!          do not delete
p = require('../res/property-info_clean.json');
var fb = firebase.database().ref();
for(i = 0; i < p.length; i++){
    fb.child('properties_new/' + p[i].listable_uid).set(p[i])
}
*/


export class Login extends Component<{}> {
  static navigationOptions = {
    title: 'Login',
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = { username: '', password: ''};
    this._onLoginButtonPress = this._onLoginButtonPress.bind(this);
    this._onSignupButtonPress = this._onSignupButtonPress.bind(this);
    //this.checkUserLoggedIn = this.checkUserLoggedIn.bind(this);

  }

  async componentWillMount() {
    await Expo.Font.loadAsync({
      'Ionicons': require('native-base/Fonts/Ionicons.ttf'),
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
    });
    this.setState({done: true});
  }

  componentDidMount()
  {
    //_signupListener();
  }

  async _signupListener(){
    while(!global.signupUsername);
    this.setState({username: global.signupUsername});
  }

  async _onLoginButtonPress(){


    //for testing:
     // this.state.username = "useme";
     // this.state.password = "password1";

    if(!this.state.username || !this.state.password){
      Alert.alert("Please enter a username and password");
      return;
    }

    var navi = this.props.navigation;    //using navi because can't use 'this' inside function

    async function _onSuccessfulSignIn(success) {
      var user = firebase.auth().currentUser;
      var fb = firebase.database().ref();
      var completeListing;
      var interest = [];
      var noInterest= [];
      var savedMatches = [];
      await fb.child("properties_new").once('value').then(function(dataSnapshot) {
        completeListing = dataSnapshot.val();
        //Make sure this function callback does not happen after the checking of the state params below
        //which should hold precedence for assigning remainingInfos
      }, function(error){
        console.log(error.message)
      })

      //var score;
      await fb.child("users/"+user.uid+"/interested").once("value").then(function(snapshot){
          snapshot.forEach(function(childsnap){
              interest.push(childsnap.key);
              savedMatches.push(completeListing[childsnap.key])
          });
      })
      await fb.child("users/"+user.uid+"/uninterested").once("value").then(function(snapshot){
          snapshot.forEach(function(childsnap){
              noInterest.push(childsnap.key);
          });
      })
      /*
      await fb.child("users/"+user.uid+"/userScore").once("value").then(function(snapshot){
          score = snapshot.val();
      })
      */

      console.log("interest: ", interest);
      console.log("interest: ", typeof(interest));
      var seen = interest.concat(noInterest);
      var j = 0;
      var filtered =[];
      // var prefetches = [];
      for(var i in completeListing){
          if(!seen.includes(i)){
              filtered.push(completeListing[i]);

              // imageurls = completeListing[i].image_urls.split(',');
              // for(i=0; i<10 && i<imageurls.length; i++) {
              //   prefetches.push(Image.prefetch(baseUrl + imageurls[i]));
              // }
          }
      }

      // for(var i in savedMatches) {
      //   imageurls = savedMatches[i].image_urls.split(',');
      //   for(i=0; i<10 && i<imageurls.length; i++) {
      //     prefetches.push(Image.prefetch(baseUrl + imageurls[i]));
      //   }
      // }
      //
      // await Promise.all(prefetches);

      global.UserPropertyListing = filtered.slice();
      global.matched = savedMatches.slice();

      if(global.justSignedUp)
        navi.navigate('personal');
      else
        navi.dispatch(resetAction);


/*
      userScore: score,
      interested: [],
      uninterested: []

*/
      //query
     }

    function _onFailedSignIn(error) {
      Alert.alert("Error: ", error.message);
      console.log(error.message);
      this.setState({loading: false})
     }

     _onSuccessfulSignIn = _onSuccessfulSignIn.bind(this);
     _onFailedSignIn = _onFailedSignIn.bind(this);


     //to allow username or email to be entered
     if(this.state.username.endsWith(emailsuffix)){
       this.state.username = this.state.username.replace(emailsuffix, '');
     }

     this.setState({loading: true})
     firebase.auth().signInWithEmailAndPassword(this.state.username + emailsuffix, this.state.password).then(_onSuccessfulSignIn, _onFailedSignIn);
  }

  _onSignupButtonPress(){
    this.props.navigation.navigate('signup', {username: this.state.username, password: this.state.password});
  }

  render() {
    if(this.state.loading){
      return (
          <View style ={styles.containerSpin}>
            <Spinner color='#006eff'/>
          </View>
      )

    }
    else {

    return (
      <View style={styles.container}>
    <Text style={{height:40}} />
    <Text style={{color: 'steelblue', fontSize: 40, textAlign: 'center', fontWeight: 'bold'}}>
      {'MatchFolio'}
    </Text>
        <View style={styles.buttonContainer}>
      <TextInput
        placeholder="Username"
        onChangeText={(text) => this.setState({ username: text })}
      />
      <Text style={{height:5}} />
      <TextInput
        placeholder="Password"
        onChangeText={(text) => this.setState({ password: text })}
        secureTextEntry={true}
      />
      <Text style={{height:25}}>
      </Text>
      <Button bordered block
        onPress={this._onLoginButtonPress}
      ><Text>Log In</Text></Button>
      <Text style={{height:35}}>
      </Text>
      <Text style={{textAlign: 'center'}}>
        {'Don\'t have an account? '}
        <Text style={{  //fontWeight: 'bold',
                color: 'blue'}}
            onPress={this._onSignupButtonPress}>
          {'Sign up'}
          </Text>
          </Text>
        </View>
      </View>
    ); }
  }
}


export class Signup extends Component<{}> {

  static navigationOptions = {
    title: 'Signup',
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {username: "", password: ""};
    this._onSignupButtonPress = this._onSignupButtonPress.bind(this);
  }

  _onSignupButtonPress(){
    //for testing
    // this.state.username = "useme";
    // this.state.password = "password1";

    if(!this.state.username || !this.state.password) {
      Alert.alert("Please enter a username and password");
      return;
    }

    //TODO: validate username and password first

      function writeUserData(userId, name) {
        score = Math.floor(Math.random()*10);
        firebase.database().ref('users/' + userId).set({
            username: name.replace(emailsuffix, ''),
            userScore: score,
            interested: "",
            uninterested: ""
        });
      }

    var navi = this.props.navigation;    //using navi because can't use 'this' inside function

    function _onSuccessfulSignUp(success) {
       var user = firebase.auth().currentUser;
       writeUserData(user.uid, user.email);
       global.justSignedUp = true;
       Alert.alert('Registered!', "",
       [{text: 'OK', onPress: () => navi.goBack() }]);
     }

     function _onFailedSignUp(error) {
       Alert.alert("Error: ", error.message);
       console.log(error.message);
     }

     if(this.state.username.endsWith(emailsuffix)){
       this.state.username = this.state.username.replace(emailsuffix, '');
     }

     _onSuccessfulSignUp = _onSuccessfulSignUp.bind(this);
     _onFailedSignUp = _onFailedSignUp.bind(this);

     firebase.auth().createUserWithEmailAndPassword(this.state.username + emailsuffix, this.state.password).then(_onSuccessfulSignUp, _onFailedSignUp);

    //TODO: get and use returned user data from sign up process ("returns firebase.Promise containing non-null firebase.User")
    //also note that sign up auto logs user in
  }

  componentWillMount(){
    uname = this.props.navigation.state.params.username;
    pword = this.props.navigation.state.params.password;

    if(!uname)
        uname = "";
    if(!pword)
        pword = "";

    this.setState({username: uname, password: pword});
  }

  render() {
    return (
    <View style={styles.container}>
      <Text style={{height:40}} />
      <Text style={{color: 'steelblue', fontSize: 40, textAlign: 'center', fontWeight: 'bold'}}>
      {'MatchFolio'}
    </Text>
        <View style={styles.buttonContainer}>
      <TextInput
        placeholder="Username"
        onChangeText={(text) => this.setState({username: text})}
        value={this.state.username}
      />
      <Text style={{height:5}} />
      <TextInput
        placeholder="Password"
        onChangeText={(text) => this.setState({password: text})}
        secureTextEntry={true}
        value={this.state.password}
      />
      <TextInput
        placeholder="Verify Password"
        onChangeText={(text) => this.setState({ password: text })}
        secureTextEntry={true}
      />
      <Text style={{height:25}}>
      </Text>
      <Button bordered block
        onPress={this._onSignupButtonPress}
      ><Text>Sign up</Text></Button>
        </View>
      </View>
    );
  }
}

export default class App extends Component<{}> {
  render() {
    return <MainScreen />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  //backgroundColor: 'skyblue'
  },
  containerSpin: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
  buttonContainer: {
  flex: 2,
  justifyContent: 'center',
  margin: 20,
  }

});
