import React, {Component} from 'react';
import { Alert,
         Dimensions,
         StatusBar,
         StyleSheet,
         Image,
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

/*export const HomeTabNav = TabNavigator({
  find: { screen: Home },
  matches: { screen: Matches },
}, {
  swipeEnabled: false,
  animationEnabled: false,
  lazy: false,
})*/

export const DrawerMainNav = DrawerNavigator({
  home: { screen: Home },
  matches: {screen: Matches},
  personal: { screen: Personal },
  Preferences: { screen: Preferences },
  rentalapp: { screen: RentalApp },
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
