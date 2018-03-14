import React, { Component } from 'react';
import { Alert, Dimensions, Image, ScrollView, StyleSheet, ListView } from 'react-native';
import { Button,
         Drawer,
         Container,
         Header,
         View,
         DeckSwiper,
         Card,
         CardItem,
         Thumbnail,
         Text,
         Spinner, } from 'native-base';
import Swiper from 'react-native-swiper';
import Communications from 'react-native-communications';
import MapView from 'react-native-maps';
import * as firebase from 'firebase';
import Feather from 'react-native-vector-icons/Feather'

const baseUrl = 'http://pa.cdn.appfolio.com/';
const { width } = Dimensions.get('window')

const Slide = props => {
  return (<View style={styles.slide}>
    <Image onLoad={props.loadHandle.bind(null, props.i)} style={styles.image} source={{uri: props.uri}} />
    {
      !props.loaded && <View style={styles.loadingView}>
        <Spinner color='#006eff'/>
      </View>
    }
  </View>)
}

export default class PropertyInfo extends Component {

  constructor(props) {
    super(props);
    if(this.props.navigation.state.params) {
      property = this.props.navigation.state.params.item;
    }
    const images_old = property.image_urls.split(',');
    const images = [];
    var loadQ = [];
    for (i=0; i<images_old.length && i<10; i++)
    {
      images.push(baseUrl + images_old[i]);
      loadQ.push(0)
    }
    if(this.props.navigation.state.params.showApply) {
        if(global.applied[property.listable_uid])
        {
            applyButton = <View>
                      <View style={{flexDirection: 'row', flex: 1}}>
                          <Button disabled style={{flex: 1, marginBottom: 10}} >
                              <Feather name='check-circle' size={24} color='white' style={{marginLeft: 10, flex: 1}} />
                              <Text style={{flex: 5, textAlign: 'center'}}>Applied</Text>
                              <Text style={{flex: 1}} />
                          </Button>
                      </View>
                      <View style={{flexDirection: 'row', flex: 1}}>
                          <Button danger style={{flex: 1}} onPress={() => this._unmatch() } >
                              <Feather name='x-circle' size={26} color='white' style={{marginLeft: 10, flex: 1}} />
                              <Text style={{flex: 5, textAlign: 'center'}}>Unmatch from property</Text>
                              <Text style={{flex: 1}} />
                          </Button>
                      </View>
                      </View>;
        }
        else {
            applyButton = <View>
                      <View style={{flexDirection: 'row', flex: 1}}>
                          <Button success style={{flex: 1, marginTop:10, marginBottom: 10}} onPress={() => this._apply() } >
                              <Feather name='mail' size={24} color='white' style={{marginLeft: 10, flex: 1}} />
                              <Text style={{flex: 5, textAlign: 'center'}}>Apply to property</Text>
                              <Text style={{flex: 1}} />
                          </Button>
                      </View>
                      <View style={{flexDirection: 'row', flex: 1}}>
                          <Button danger style={{flex: 1}} onPress={() => this._unmatch() } >
                              <Feather name='x-circle' size={26} color='white' style={{marginLeft: 10, flex: 1}} />
                              <Text style={{flex: 5, textAlign: 'center'}}>Unmatch from property</Text>
                              <Text style={{flex: 1}} />
                          </Button>
                      </View>
                      </View>;
        }
    } else {
        applyButton = <View style={{flexDirection: 'row', flex: 1}}/>;
    }

    var propertyMarker = [
        {
            latitude: property.address_latitude,
            longitude: property.address_longitude,
            title: property.address_address1,
            subtitle: 'Test'
        }
    ]
    this.state = {imgList: images, loadQueue: loadQ, marker: propertyMarker}
    this.loadHandle = this.loadHandle.bind(this)
  }

    loadHandle (i) {
    let loadQueue = this.state.loadQueue
    loadQueue[i] = 1
    this.setState({
      loadQueue
    })
  }

  _callNumber(number) {
      // hacky, needs updating (just get number without extension)
      // this is assuming "(xxx) xxx-xxxx" format
      phoneNumber = number.substring(0, 14);
      Communications.phonecall(phoneNumber, false);
  }

  async _apply() {

      if(property.additional_questions) {
          console.log("additional questions");
          this.props.navigation.navigate('additionalQuestions', {questions: property.additional_questions});
      }
      global.applied[property.listable_uid] = 1;
      //Alert.alert("Your application has been sent to " + property.vhost + "!");
      await this.props.navigation.goBack();
      firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/applied/' + property.listable_uid).set(1);
          // this.props.navigation.navigate('additionalQuestions', {questions: ["Do you like cows?", "How many cows do you have?"]});
  }

  async _unmatch() {
      // Alert.alert("You have been unmatched from this property.");
      // TODO: remove this property from user's matched properties...
      uid_to_remove = property.listable_uid;
      global.removedPropertyId = uid_to_remove;
      await this.props.navigation.goBack();
      firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/uninterested/' + uid_to_remove).set(1);
      firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/interested/' + uid_to_remove).remove();
  }

  render() {
    return (
      <ScrollView style={{backgroundColor: '#FFFFFF'}}>
  	    <View style={styles.margin}>
        <MapView
            initialRegion={{
              latitude: property.address_latitude,
              longitude: property.address_longitude,
              latitudeDelta: 0.0472,
              longitudeDelta: 0.0221,
            }}
            style={styles.map}
        >
            <MapView.Marker
              image={require('../res/blue-pin.png')}
              coordinate={{latitude: property.address_latitude, longitude: property.address_longitude}}>
              <MapView.Callout>
                <View>
                  <Text style={{textAlign: "center", fontSize: 15}}>{property.address_address1}</Text>
                  <Text style={{textAlign: "center", fontSize: 12}}>{property.marketing_title}</Text>
                </View>
              </MapView.Callout>
            </MapView.Marker>

        </MapView>
        <View style={{borderRadius: 5}}>
          <Swiper loadMinimal loadMinimalSize={1} style={styles.wrapper} loop={true}>
            {
              this.state.imgList.map((item, i) => <Slide
                loadHandle={this.loadHandle}
                loaded={this.state.loadQueue[i]}
                uri={item}
                i={i}
                key={i} />)
            }
          </Swiper>
        </View>
          <View style={styles.line}>
            <Text style={styles.mainInfo}>{property.address_address1 + "\n" + property.address_city + ", " + property.address_country}</Text>
          </View>
          <View style={styles.horizontalHolder}>
  	        <Text style={styles.leftPropertyInfo}>{"Rent:\n$" + property.market_rent + "/month"}</Text>
            <Text style={styles.propertyInfo}>{"# of Rooms: \n" + property.bedrooms + " Bed/" + property.bathrooms + " Bath"}</Text>
            <Text style={styles.rightPropertyInfo}>{"Square Feet: \n" + property.square_feet + " sq ft." }</Text>
          </View>
          <View style={styles.line}>
    	      <Text style={styles.info}>{"Description: " + property.marketing_description}</Text>
          </View>
            <Text style={styles.info}>{"Amenities: " + property.amenities}</Text>

          <View style={{flexDirection: 'row', flex: 1}}>
              <Button info style={{flex: 1}} onPress={() => this._callNumber(property.contact_phone_number) } >
                <Feather name='phone' size={24} color='white' style={{marginLeft: 10, flex: 1}} />
                <Text style={{flex: 5, textAlign: 'center'}}>Contact Owner</Text>
                <Text style={{flex: 1}} />
              </Button>
          </View>
          {applyButton}
        </View>
  	  </ScrollView>
    );
  }

}

const styles = StyleSheet.create({
	wrapper: {
    height: 300,
    borderRadius: 5,
  },

  map: {
      height: 240,
      marginBottom: 10,
      backgroundColor: '#FFFFFF',
      borderRadius: 5,
  },

  slide: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  image: {
    flex: 1,
    backgroundColor: 'transparent'
  },

  loadingView: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,.5)'
  },

  loadingImage: {
    width: 60,
    height: 60
  },

  container: {
	  padding: 10,
	},
	gallery: {
	  height: 400,
	  flex: 1,
	  padding: 10,
    borderColor: 'black',
    borderBottomWidth: 1,
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
	propertyInfo: {
    flex: 1,
    textAlign: 'center',
    fontSize: 15,
    borderBottomColor: 'black',
    borderBottomWidth: 1,
  },
  mainInfo: {
    fontSize: 20,
    padding: 10,
    textAlign: 'center',
    marginTop: 10,
  },
  info: {
    fontSize: 15,
    padding: 10,
  },
  line: {
    borderBottomColor: '#9aa1ad',
    borderBottomWidth: 1,
  },
  phoneNumber: {
    flex: 1,
    textAlign: 'center',
    color: '#aaa',
  },
  margin:{
    margin: 15,
  },
  horizontalHolder: {
    flexDirection: 'row',
    borderBottomColor: '#9aa1ad',
    borderBottomWidth: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
});
