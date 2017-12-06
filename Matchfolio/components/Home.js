import React, {Component} from 'react';
import { StyleSheet, StatusBar, Image, AsyncStorage, TouchableHighlight } from 'react-native';
import { StackNavigator, DrawerNavigator, NavigationActions } from 'react-navigation';
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

var propertyInfo = require('../res/property-info.json');
import { Ionicons } from '@expo/vector-icons'; // 6.1.0
var remainingInfos = propertyInfo.slice();
const baseUrl = 'http://pa.cdn.appfolio.com/';
var propertyPictures;

export class CardSwiper extends React.Component {

  static navigationOptions = {
    header: null,
    drawerLabel: 'Home',
    drawerLockMode: 'locked-closed',
    drawerIcon: ({ tintColor }) => (<Icon name="home" size={15} style={{ color: tintColor }} />),
  }

  constructor(props)
  {
    super(props);
    this.state = {loading: true, matches: null};
    this._onNotInterested = this._onNotInterested.bind(this);
    this._nextProperty = this._nextProperty.bind(this);
    this._onInterested = this._onInterested.bind(this);
    this._onMoreInfo = this._onMoreInfo.bind(this);
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
    /*var matches_data = await AsyncStorage.getItem('matched-properties');
    if (matches_data!=null)
    {
      this.setState({matches: JSON.parse(matches_data)});
    }*/
    //StatusBar.setHidden(true);
    if (this.props.navigation.state.params != undefined && this.props.navigation.state.params.homeSavedMatches!=null)
      {
         this.setState({matches: this.props.navigation.state.params.homeSavedMatches});
         remainingInfos = this.props.navigation.state.params.remainingInfos;
      }

    this.setState({loading: false});
  }

  async componentWillUnmountX()
  {
    try {
        await AsyncStorage.setItem('matched-properties', JSON.stringify(this.state.matches));
      }
      catch (error) {
        console.log(error);
      }
  }

  _nextProperty() {
    var propertyNumber = this.state.currentProperty;
    this.setState({currentProperty: propertyNumber+1});
    this._updatePropertyImages(this.state.currentProperty);
  }

  _onNotInterestedButton() {
    this.deck._root.swipeLeft();
    this._onNotInterested(this.deck._root.state.selectedItem);
  }

  _onNotInterested(item) {
    // [maybe] save info to ensure property isn't displayed again
    //console.log("Not interested in property: " + this.deck._root.state.selectedItem.address_address1);
    if(item!=null) this._removeInfoFromRemaining(item);
  }

  _onMoreInfo() {
    if(this.deck._root.state.selectedItem!=null && remainingInfos.length>0)
      this.props.navigation.navigate('propertyInfo', {item: this.deck._root.state.selectedItem});
  }

  _onInterestedButton() {
    this.deck._root.swipeRight();
    this._onInterested(this.deck._root.state.selectedItem);
  }

  _onInterested(item) {
    if(item == null || remainingInfos.length<1)
      return;

    console.log(item);
    var newArray = [];
    if (this.state.matches!=null)
    {
      console.log('state.matches size: ' + this.state.matches.length);
      newArray = this.state.matches.slice();
    }
    else
    {
      console.log('state.matches : null');
    }

    newArray.push(item);
    this.setState({matches: newArray})
    this._removeInfoFromRemaining(item);

    // go on to next property
  }

  _updatePropertyImages(index) {

    // propertyPictures = propertyInfo[index].image_urls.split(",");
    // this.setState({ pictureURL: propertyPictures[0] });
  }

  _removeInfoFromRemaining(item) {
    const index = remainingInfos.indexOf(item);

    if (index !== -1) {
        remainingInfos.splice(index, 1);
    }
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
              ref={(c) => this.deck = c}
              dataSource={remainingInfos}
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
                                    <TouchableHighlight onPress={this._onMoreInfo}>
                                      <CardItem cardBody>
                                        <Image style={{ height: 300, flex: 1 }} source={{uri: baseUrl + item.image_urls.split(',')[0]}} />
                                      </CardItem>
                                    </TouchableHighlight>
                                    <CardItem>
                                      <View style={styles.horizontalHolder}>
                                        <Text style={styles.leftPropertyInfo}>{"Rent:\n$" + item.market_rent + "/month"}</Text>
                                        <Text style={styles.propertyInfo}>{"# of Rooms: \n" + item.bedrooms + " Bed/" + item.bathrooms + " Bath"}</Text>
                                        <Text style={styles.rightPropertyInfo}>{"Square Feet: \n" + item.square_feet + " sq ft." }</Text>
                                      </View>
                                    </CardItem>
                                    <CardItem>
                                      <Text style={styles.propertyDescription}>{item.marketing_title}</Text>
                                    </CardItem>
                                    <CardItem>
                                      <View style={styles.horizontalHolder}>
                                        <Text style={styles.phoneNumber}>{"Phone:\n" + item.contact_phone_number}</Text>
                                      </View>
                                    </CardItem>
                                  </Card>
                          }
            />
          </View>
          <View style={{ flexDirection: "column", flex: 1, position: "absolute", bottom: 0, left: 0, right: 0, justifyContent: 'space-around'}}>
            <View style={styles.horizontalHolder}>
              <Button>
              </Button>
              <Button bordered rounded danger onPress={() => this._onNotInterestedButton() } >
                <Icon name="md-close" size={40} color="red"/>
              </Button>
              <Button rounded bordered onPress={() => this._onMoreInfo() } >
                <Text>More Info</Text>
              </Button>
              <Button bordered rounded success onPress={() => this._onInterestedButton() } >
                <Icon name="md-heart-outline" size={30} color="green"/>
              </Button>
              <Button>
              </Button>
            </View>
            <Footer>
              <FooterTab>
                <Button vertical active>
                  <Icon active name="search" />
                  <Text>Find Properties</Text>
                </Button>
                <Button vertical onPress={()=>
                  {
                    this.props.navigation.navigate('matches', {matches: this.state.matches, remainingInfos: remainingInfos});
                  }
                }>
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
    leftPropertyInfo: {
      flex: 1,
      textAlign: 'center',
      fontSize: 15,
      borderRightColor: 'black',
      borderRightWidth: 1,
    },
    rightPropertyInfo: {
      flex: 1,
      textAlign: 'center',
      fontSize: 15,
      borderLeftColor: 'black',
      borderLeftWidth: 1,
    },
    propertyDescription: {
      flex: 1,
      textAlign: 'center',
      fontSize: 20,
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
