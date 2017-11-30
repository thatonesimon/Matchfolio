import React, {Component} from 'react';
import { StyleSheet, StatusBar, Image } from 'react-native';
import { StackNavigator, DrawerNavigator } from 'react-navigation';
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

const propertyInfo = require('../res/property-info.json');
const baseUrl = 'http://pa.cdn.appfolio.com/';
var propertyPictures;

export class CardSwiper extends React.Component {

  static navigationOptions = {
    header: null,
    drawerLabel: 'Home',
    drawerLockMode: 'locked-closed'
  }

  constructor(props)
  {
    super(props);
    this.state = {loading: true};
    this._nextProperty = this._nextProperty.bind(this);
  }

  state = {
    currentProperty: 0,
    loading: true,
    pictureURL: "utopiamanagement/images/2c8b6e70-83f3-41bf-bfd2-79d3d676681f/large.jpg",
  }

  async componentWillMount() {
    await Expo.Font.loadAsync({
      'Ionicons': require('native-base/Fonts/Ionicons.ttf'),
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
    });
    //StatusBar.setHidden(true);
    this.setState({loading: false});
  }

  _nextProperty() {
    var propertyNumber = this.state.currentProperty;
    this.setState({currentProperty: propertyNumber+1});
    this._updatePropertyImages(this.state.currentProperty);
  }

  _onNotInterestedButton() {
    this._deckSwiper._root.swipeLeft();
    this._onNotInterested();
  }

  _onNotInterested() {
    // [maybe] save info to ensure property isn't displayed again
    console.log("Not interested in property");

    // go on to next property

  }

  _onMoreInfo() {
    // redirect to property details page

  }

  _onInterestedButton() {
    this._deckSwiper._root.swipeRight();
    this._onInterested();
  }

  _onInterested() {
    // save info to display on matched properties page
    console.log("Interested in property");

    // go on to next property
  }

  _updatePropertyImages(index) {

    // propertyPictures = propertyInfo[index].image_urls.split(",");
    // this.setState({ pictureURL: propertyPictures[0] });
  }

  render() {
    if (this.state.loading) {
      return <Spinner />;
    }
    else {
      this._updatePropertyImages(this.state.currentProperty);
      return (
        <Container>
          <Header>
            <Left>
              <Button transparent
              onPress={()=> this.props.navigation.navigate('DrawerToggle')}>
                <Icon name='menu' />
              </Button>
            </Left>
            <Body>
              <Title>MatchFolio</Title>
            </Body>
            <Right />
          </Header>
          <View>
            <DeckSwiper
              onSwipeLeft={this._onNotInterested}
              onSwipeRight={this._onInterested}
              looping={false}
              ref={(c) => this._deckSwiper = c}
              dataSource={propertyInfo}
              renderEmpty={ () => <View style={{ alignSelf: "center" }}>
                                    <Text>Over</Text>
                                  </View>
                          }
              renderItem={item =>
              					<Card style={{ elevation: 3 }}>
                                    <CardItem>
                                      <Left>
                                        <Thumbnail source={{uri: baseUrl + item.image_urls.split(',')[1]}} />
                                        <Body>
                                          <Text style={styles.header}>{item.address_address1}</Text>
                                          <Text note>{item.address_city}</Text>
                                        </Body>
                                      </Left>
                                    </CardItem>
                                      <CardItem cardBody>
                                        <Image style={{ height: 300, flex: 1 }} source={{uri: 'http://pa.cdn.appfolio.com/' + item.image_urls.split(',')[0]}} />
                                      </CardItem>
                                    <CardItem>
                                      <View style={styles.horizontalHolder}>
                                        <Text style={styles.propertyInfo}>{"Square Feet: \n" + item.square_feet + " sq ft." }</Text>
                                        <Text style={styles.propertyInfo}>{"Rent: \n$" + item.market_rent}</Text>
                                        <Text style={styles.propertyInfo}>{"# of Rooms: \n" + item.bedrooms + " Bed/" + item.bathrooms + " Bath"}</Text>
                                      </View>
                                    </CardItem>
                                    <CardItem>
                                      <Text>{"Amenities: " + item.amenities}</Text>
                                    </CardItem>
                                    <CardItem>
                                      <View style={styles.horizontalHolder}>
                                        <Text style={styles.phoneNumber}>{item.contact_phone_number}</Text>
                                      </View>
                                    </CardItem>
                                  </Card>
                          }
            />
          </View>
          <View style={{ flexDirection: "column", flex: 1, position: "absolute", bottom: 0, left: 0, right: 0, justifyContent: 'space-around'}}>
            <View style={styles.horizontalHolder}>
              <Button rounded danger onPress={() => this._onNotInterestedButton() } >
                <Text>Not Interested</Text>
              </Button>
              <Button rounded info onPress={() => this._onMoreInfo() } >
                <Text>More Info</Text>
              </Button>
              <Button rounded success onPress={() => this._onInterestedButton() } >
                <Text>Interested</Text>
              </Button>
            </View>
            <Footer>
              <FooterTab>
                <Button vertical active>
                  <Icon active name="search" />
                  <Text>Find Properties</Text>
                </Button>
                <Button vertical>
                  <Icon name="home" />
                  <Text>Matched Properties</Text>
                </Button>
              </FooterTab>
            </Footer>
          </View>
        </Container>
      );
    }
  }

}
const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    horizontalHolder: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 10,
    },
    propertyInfo: {
      flex: 1,
      textAlign: 'center',
      fontSize: 15,
    },
    header: {
      fontSize: 20,
    },
    phoneNumber: {
      flex: 1,
      textAlign: 'center',
      color: '#aaa',
    },
  });
