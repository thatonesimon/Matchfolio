import React, {Component} from 'react';
import { Alert,
         Dimensions,
         StatusBar,
         StyleSheet,
         Image,
         Platform,
         TouchableHighlight,
         TouchableWithoutFeedback } from 'react-native';
import { StackNavigator,
         DrawerNavigator,
         TabNavigator } from 'react-navigation';
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
import { Login,
         Signup } from './components/Login_Signup';
import Personal from "./components/Personal";
import Preferences from "./components/Preferences";
import { CardSwiper as Home } from './components/Home';
import { default as RentalApp } from './components/RentalApp';
import PropertyInfo from './components/PropertyInfo';
import Matches from './components/Matches';
import Splash from './components/Splash';
import BackgroundCheckLoading from './components/BackgroundCheckLoading';
import * as firebase from 'firebase';

/*export const HomeTabNav = TabNavigator({
  find: { screen: Home },
  matches: { screen: Matches },
}, {
  swipeEnabled: false,
  animationEnabled: false,
  lazy: false,
})*/
global.flag = 0;

export const DrawerMainNav = DrawerNavigator({
  home: { screen: Home },
  matches: {screen: Matches},
  personal: { screen: Personal },
  Preferences: { screen: Preferences },
  rentalapp: { screen: RentalApp },
});

DrawerMainNav.navigationOptions = {header: null};

export const IntroStackNav = StackNavigator({
  splash: { screen: Splash },
  login: { screen: Login },
  signup: { screen: Signup },
  personal: { screen: Personal },
  preferences: { screen: Preferences },
  rentalapp: { screen: RentalApp },
  backgroundcheck: { screen: BackgroundCheckLoading },
  main: { screen: DrawerMainNav },
  propertyInfo: { screen: PropertyInfo },
},
{ cardStyle: {
      paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight
  },
});

export default class App extends React.Component {
  componentWillUnmount(){
    console.log("main app unmounting");
  }
  render() {
    return (
      <IntroStackNav />
    );
  }
}
