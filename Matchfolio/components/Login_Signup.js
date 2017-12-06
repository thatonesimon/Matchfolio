import React, { Component } from 'react';
import {AsyncStorage, Platform, StyleSheet, TextInput, Alert} from 'react-native';
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

const resetAction = NavigationActions.reset({
  index: 0,
  actions: [
    NavigationActions.navigate({routeName: 'main'})
  ]
})

export class Login extends Component<{}> {
  static navigationOptions = {
    title: 'Login',
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = { username: '', password: '' };
    this._onLoginButtonPress = this._onLoginButtonPress.bind(this);
    this._onSignupButtonPress = this._onSignupButtonPress.bind(this);
    this.checkUserLoggedIn = this.checkUserLoggedIn.bind(this);
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
      //this.checkUserLoggedIn();
  }

  async checkUserLoggedIn()
  {
    try {
      var value = await AsyncStorage.getItem('userData');
      if (value !== null)
      {
        this.setState(JSON.parse(value));
        this._onLoginButtonPress();
      }
    }
  catch (error)
  {
    console.log(error);
  }

  }

  async _onLoginButtonPress(){

      /*try {
        await AsyncStorage.setItem('userData', JSON.stringify(this.state));
      }
      catch (error) {
        console.log(error);
      }*/

  this.props.navigation.dispatch(resetAction);
  }

  _onSignupButtonPress(){
    this.props.navigation.navigate('signup', {username: this.state.username, password: this.state.password});
  }

  render() {
    if(this.state.done){
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
      );
    } else {
      return(<View />);
    }
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
    Alert.alert('Registered!', "",
    [{text: 'OK', onPress: () => this.props.navigation.navigate('personal') }]);
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
  buttonContainer: {
  flex: 2,
  justifyContent: 'center',
  margin: 20,
  }

});
