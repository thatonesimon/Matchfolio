import React, { Component } from 'react';
import { Alert, Dimensions, Image, ScrollView, StyleSheet, } from 'react-native';
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

  _apply() {
      if(property.additional_questions) {
          console.log("additional questions");
          this.props.navigation.navigate('additionalQuestions', {questions: property.additional_questions});
      } else {
          //Alert.alert("Your application has been sent to " + property.vhost + "!");
          this.props.navigation.navigate('additionalQuestions', {questions: ["Do you like cows?", "How many cows do you have?"]});
      }
  }

  render() {
    return (
      <ScrollView>
  	    <View style={styles.container}>
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
              coordinate={{latitude: property.address_latitude, longitude: property.address_longitude}}
              title={property.address_address1}
              description={property.marketing_title}
              />

        </MapView>

        <Swiper loadMinimal loadMinimalSize={1} style={styles.wrapper} loop={false}>
          {
            this.state.imgList.map((item, i) => <Slide
              loadHandle={this.loadHandle}
              loaded={this.state.loadQueue[i]}
              uri={item}
              i={i}
              key={i} />)
          }
        </Swiper>

          <Text style={styles.mainInfo}>{property.address_address1 + "\n" + property.address_city + ", " + property.address_country}</Text>
          <View style={styles.horizontalHolder}>
  	        <Text style={styles.leftPropertyInfo}>{"Rent:\n$" + property.market_rent + "/month"}</Text>
            <Text style={styles.propertyInfo}>{"# of Rooms: \n" + property.bedrooms + " Bed/" + property.bathrooms + " Bath"}</Text>
            <Text style={styles.rightPropertyInfo}>{"Square Feet: \n" + property.square_feet + " sq ft." }</Text>
          </View>
  	      <Text style={styles.info}>{"Description: " + property.marketing_description}</Text>
          <Text style={styles.info}>{"Amenities: " + property.amenities}</Text>
          <View style={{flexDirection: 'row', flex: 1, marginBottom: 10}}>
              <Button info style={{flex: 1}} onPress={() => this._callNumber(property.contact_phone_number) } >
                <Text style={{textAlign: 'center'}}>Contact Owner</Text>
              </Button>
          </View>
          <View style={{flexDirection: 'row', flex: 1}}>
              <Button success style={{flex: 1}} onPress={() => this._apply() } >
                <Text style={{textAlign: 'center'}}>Apply to Property</Text>
              </Button>
          </View>
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
  },
  mainInfo: {
    fontSize: 20,
    padding: 10,
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    textAlign: 'center',
    borderWidth: 1,
    backgroundColor: '#eef8fd',
    borderRadius: 5,
    marginBottom: 10,
    marginTop: 10,
  },
  info: {
  	fontSize: 15,
  	padding: 10,
    borderColor: 'black',
    borderWidth: 1,
    backgroundColor: '#eef8fd',
    borderRadius: 5,
    marginBottom: 10,
  },
  phoneNumber: {
    flex: 1,
    textAlign: 'center',
    color: '#aaa',
  },
  horizontalHolder: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderColor: 'black',
    borderWidth: 1,
    backgroundColor: '#eef8fd',
    borderRadius: 5,
    marginBottom: 10,
  },
});
