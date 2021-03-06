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
  import { FontAwesome, Ionicons, MaterialCommunityIcons, Foundation, Entypo} from '@expo/vector-icons'; // 6.1.0
  import * as firebase from 'firebase';

  var mainDataRef = firebase.database().ref();
  var propertyRef = firebase.database().ref('properties');
  var user = firebase.auth().currentUser;   //assumes login process was successful

  var propertyInfo;
  var remainingInfos;

  propertyRef.once("value")
  .then(function(dataSnapshot){
    propertyInfo = dataSnapshot.val();
  })

  const baseUrl = 'http://pa.cdn.appfolio.com/';
  var propertyPictures;

  export class CardSwiper extends React.Component {

    static navigationOptions = {
      header: null,
      drawerLabel: 'Home',
      drawerLockMode: 'locked-closed',
      drawerIcon: ({ tintColor }) => (<Icon name="home" size={15} style={{ color: tintColor }} />),
    }

    constructor(props){
      super(props);
      this.state = {loading: true, matches: null};
      this._onNotInterested = this._onNotInterested.bind(this);
      this._nextProperty = this._nextProperty.bind(this);
      this._onInterested = this._onInterested.bind(this);
      this._onMoreInfo = this._onMoreInfo.bind(this);
      this._refreshProperties = this._refreshProperties.bind(this);
      this.shouldShow = this.shouldShow.bind(this);
      firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/preferences/').on('value', this._refreshProperties, function(error){console.log(error)});
      this.triedToRefreshWhileUnmounted = null;
      this.state.reload = true;
    }

    async componentWillMount() {
      await Expo.Font.loadAsync({
        'Ionicons': require('native-base/Fonts/Ionicons.ttf'),
        'Roboto': require('native-base/Fonts/Roboto.ttf'),
        'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
      });
      /*
      await propertyRef.once('value').then(function(dataSnapshot) {
      propertyInfo = dataSnapshot.val();
      //Make sure this function callback does not happen after the checking of the state params below
      //which should hold precedence for assigning remainingInfos
      remainingInfos = propertyInfo.slice();
      console.log('propertyinfo init')
      }, function(error){
      console.log(error.message)
      })\*/
      propertyInfo = global.UserPropertyListing;
      remainingInfos = global.UserPropertyListing;

      user = firebase.auth().currentUser;
      userDataRef = firebase.database().ref("users/" + user.uid);

      if(user) {
        console.log("dispname: ", user.displayName);
        console.log("email: ", user.email);
        console.log("uid: ", user.uid);
      }
      else {
        console.log("user data not loaded");
      }
      this.setState({matches: global.matched})
      if (this.props.navigation.state.params) {
        if(this.props.navigation.state.params.homeSavedMatches)
        this.setState({matches: this.props.navigation.state.params.homeSavedMatches});
        if(this.props.navigation.state.params.remainingInfos)
        remainingInfos = this.props.navigation.state.params.remainingInfos;
      }

      this._mounted = true;
      if (this.triedToRefreshWhileUnmounted) {
        await this._refreshProperties(this.triedToRefreshWhileUnmounted)
      }
      else {
        console.log("triedToRefreshWhileUnmounted was not true")
      }
      this.setState({loading: false});
    }

    componentWillUnmount() {
      this._mounted = false;
    }

    shouldShow(listing, prefs) {
      // filter based on preferences
      console.log("In home, shouldShow, prefs: ", prefs)
      if(!prefs)
        return true;
      if (prefs.bed && parseFloat(listing.bedrooms) < parseFloat(prefs.bed[0]))
        return false;
      if (prefs.bath && parseFloat(listing.bathrooms) < parseFloat(prefs.bath[0]))
        return false;
      if (prefs.rentState && listing.market_rent < prefs.rentState[0] || listing.market_rent > prefs.rentState[1])
        return false;
      if (prefs.sqftState && listing.square_feet < prefs.sqftState[0] || listing.square_feet > prefs.sqftState[1])
        return false;

      return true
    }

    async _refreshProperties(snapshot) {

      console.log("refreshProperties callback fired in home");

      if(!this._mounted) {
        this.triedToRefreshWhileUnmounted = snapshot;
        console.log("home was not mounted");
        return;
      }

      this.triedToRefreshWhileUnmounted = null;

      console.log("home was mounted")
      this.setState({loading: true});

      var user = firebase.auth().currentUser;
      var fb = firebase.database().ref();
      var completeListing;
      var interest = [];
      var noInterest= [];
      var savedMatches = [];
      var pref = null;
      if (snapshot) {
        pref = snapshot.val()
      }

      console.log("In home, prefs is: ", pref)

      await fb.child("properties_new").once('value').then(function(dataSnapshot) {
        completeListing = dataSnapshot.val();
      }, function(error){
        console.log(error.message)
      })

      await fb.child("users/"+user.uid+"/applied").once("value").then(function(snapshot){
          snapshot.forEach(function(childsnap){
              //treat applied properties as noInterest (in case they applied then unmatched) so they don't reappear on home screen
              noInterest.push([childsnap.key]);
          });
      })

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

      var seen = interest.concat(noInterest);
      var filtered =[];
      for(var i in completeListing){
          if(!seen.includes(i) && this.shouldShow(completeListing[i], pref)) {
              filtered.push(completeListing[i]);
          }
      }

      global.UserPropertyListing = filtered.slice();
      global.matched = savedMatches.slice();
      remainingInfos = filtered.slice();

      this.setState({loading: false})
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
      if(item!=null){
        this._removeInfoFromRemaining(item);
        userDataRef.child("uninterested").child(item.listable_uid).set(1);
      }
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

      var newArray = [];
      if (this.state.matches!=null)
      {
        //make shallow copy as to not modify original
        newArray = this.state.matches.slice();
      }

      newArray.push(item);
      this.setState({matches: newArray})
      this._removeInfoFromRemaining(item);
      userDataRef.child("interested").child(item.listable_uid).set(1);
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

    _resetProperties() {
        console.log("simon");
        userDataRef.child("interested").remove();
        userDataRef.child("uninterested").remove();
        userDataRef.child("applied").remove();
        userDataRef.child("preferences").remove();

    }

    render() {
      if (this.state.loading || propertyInfo === undefined) {
        return (
          <View style ={styles.containerSpin}>
            <Spinner color='#006eff'/>
          </View>
        )
      }

      else {
        //remainingInfos = propertyInfo.slice();SaveSave
        this._updatePropertyImages(this.state.currentProperty);

        return (
          <Container style={{backgroundColor: 'white'}}>
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
              <Right>
              <Button rounded style={{backgroundColor: "#25B7D300"}} onPress={() => this.setState({reload: !this.state.reload}) }
              delayLongPress={3000} onLongPress={() => this._resetProperties()}>
                <Ionicons color="#0097ef" size={35} name="ios-refresh"/>
              </Button>
              </Right>
            </Header>
            <View>
              <DeckSwiper
                onSwipeLeft={this._onNotInterested}
                onSwipeRight={this._onInterested}
                looping={false}
                ref={(c) => this.deck = c}
                dataSource={remainingInfos}
                renderEmpty={ () => <View style={{ height: 500, flexDirection: 'column', alignSelf: "center", alignItems: "center", justifyContent: "center" }}>
                <Text style={{fontSize: 24, textAlign: 'center', flexDirection: "column", alignSelf: "center", marginRight: 15, marginLeft: 15}}>{'Currently, there are no \navailable properties.\n'}</Text>
                <Image style={{height: 80, width: 80}} source={require('../res/sad.png')}/>
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
                      <Image style={{ height: 325, flex: 1 }} source={{uri: baseUrl + item.image_urls.split(',')[0]}} />
                    </CardItem>
                  </TouchableHighlight>
                  <CardItem>
                    <View style={styles.horizontalHolder}>
                      <Text style={styles.rentPropertyInfo}>{"$" + item.market_rent + "/month"}</Text>
                      <Text style={styles.otherPropertyInfo}><FontAwesome name="bed" size={16} color="gray" />{"\n" + item.bedrooms}</Text>
                      <Text style={styles.otherPropertyInfo}><FontAwesome name="bath" size={16} color="gray" />{"\n" + item.bathrooms}</Text>
                      <Text style={styles.otherPropertyInfo}><Foundation name="arrows-out" size={16} color="gray" />{"\n" + item.square_feet}</Text>
                    </View>
                  </CardItem>

                </Card>
              }
              />
          </View>
          <View style={{ flexDirection: "column", flex: 1, position: "absolute", bottom: 0, left: 0, right: 0, justifyContent: 'space-around'}}>
            <View style={styles.horizontalHolder}>
              <Button rounded style={{backgroundColor: "#25B7D300"}} onPress={() => this._onNotInterestedButton() } >
                <Image style={{height: 50, width: 50}} source={require("../res/close-circular-button-of-a-cross.png")}/>
              </Button>
              <Button rounded style={{backgroundColor: "#25B7D300", justifyContent: "center"}}  onPress={() => this._onMoreInfo() } >
                <Image style={{height: 50, width: 50, alignSelf: "center"}} source={require("../res/exclamation-sign-in-a-circle.png")}/>
              </Button>
              <Button rounded style={{backgroundColor: "#25B7D300"}} onPress={() => this._onInterestedButton() } >
                <Image style={{height: 50, width: 50}} source={require("../res/like-heart-circular-outlined-button.png")}/>
              </Button>
            </View>
            <Footer>
              <FooterTab>
                <Button vertical active>
                  <Icon active name="search" />
                  <Text>Find Properties</Text>
                </Button>
                <Button vertical onPress={()=>{
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
  containerSpin: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
  horizontalHolder: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
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
  rentPropertyInfo: {
    flex: 2,
    textAlign: 'left',
    fontSize: 20,
    borderRightColor: 'black',
    borderRightWidth: 1,
  },
  otherPropertyInfo: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
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
