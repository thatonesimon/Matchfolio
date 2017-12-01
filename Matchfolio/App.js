import React, {Component} from 'react';
import { Alert,
         Dimensions,
         StatusBar,
         StyleSheet,
         Image,
         TouchableHighlight,
         TouchableWithoutFeedback } from 'react-native';
import { StackNavigator,
         DrawerNavigator } from 'react-navigation';
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

export const DrawerMainNav = DrawerNavigator({
  home: { screen: Home },
  personal: { screen: Personal },
  Preferences: { screen: Preferences },
  rentalapp: { screen: RentalApp }
});

DrawerMainNav.navigationOptions = {header: null};

export const IntroStackNav = StackNavigator({
  login: { screen: Login },
  signup: { screen: Signup },
  main: { screen: DrawerMainNav },
  propertyInfo: { screen: PropertyInfo },
});

export default class App extends React.Component {
  render() {
    return (
      <IntroStackNav />
    );
  }
}
