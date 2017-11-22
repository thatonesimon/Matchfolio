import React, {Component} from 'react';
import { StyleSheet, Image } from 'react-native';
import { StackNavigator, DrawerNavigator } from 'react-navigation';
import { Drawer, Container, Header, View, DeckSwiper, Card, CardItem, Thumbnail, Text, Left, Right, Body, Title, Button, Content, Footer, FooterTab, Icon, Spinner } from 'native-base';
import { Login, Signup } from './components/Login_Signup';
import Personal from "./components/Personal";
import Preferences from "./components/Preferences";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const cards = require('./res/property-info.json');

export class CardSwiper extends React.Component {

  static navigationOptions = {
    header: null
  }

  constructor(props)
  {
    super(props);
    this.state = {loading: true}
  }

  async componentWillMount() {
  await Expo.Font.loadAsync({
    'Ionicons': require('native-base/Fonts/Ionicons.ttf'),
    'Roboto': require('native-base/Fonts/Roboto.ttf'),
    'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
  });
  this.setState({loading: false})
}

    render() {
      if (this.state.loading)
        return <Spinner />;
      else
      {
        return (
            <Container>
            <Header>
            <Left>
            <Button transparent>
              <Icon name='menu' />
            </Button>
          </Left>
          <Body>
            <Title>Swipe!</Title>
          </Body>
          <Right />
          </Header>
            <View>
              <DeckSwiper
                //onSwipeRight={item => alert(item.text)}
                looping={false}
                ref={(c) => this._deckSwiper = c}
                dataSource={cards}
                renderEmpty={() =>
                  <View style={{ alignSelf: "center" }}>
                    <Text>Over</Text>
                  </View>}
                renderItem={item =>
                  <Card style={{ elevation: 3 }}>
                    <CardItem>
                      <Left>
                        <Thumbnail source={
                        {uri: 'http://pa.cdn.appfolio.com/' + item.image_urls.split(',')[1]}} />
                        <Body>
                          <Text>{item.marketing_title}</Text>
                          <Text note>{item.property_type}</Text>
                        </Body>
                      </Left>
                    </CardItem>
                    <CardItem cardBody>
                      <Image style={{ height: 300, flex: 1 }} source={{uri: 'http://pa.cdn.appfolio.com/' + item.image_urls.split(',')[0]}} />
                    </CardItem>
                    <CardItem>
                      <Text>{item.address_address1}</Text>
                    </CardItem>
                  </Card>
                }
              />
            </View>
            <View style={{ flexDirection: "column", flex: 1, position: "absolute", bottom: 0, left: 0, right: 0, justifyContent: 'space-between'}}>
            <Footer>
              <FooterTab>
                <Button vertical active>
                  <Icon active name="navigate" />
                  <Text>Navigate</Text>
                </Button>
                <Button vertical>
                  <Icon name="person" />
                  <Text>Contact</Text>
                </Button>
              </FooterTab>
            </Footer>
            </View>
          </Container>
        );
      }
    }
}

export const Matchfolio = StackNavigator({
  login: { screen: Login },
  signup: { screen: Signup},
  personal: { screen: Personal },
  preferences: { screen: Preferences },
  main: { screen: CardSwiper }
});

export default class App extends React.Component {

  render() {
    return (
      <Matchfolio />
    );
  }
}
