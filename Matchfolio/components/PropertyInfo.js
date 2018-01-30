import React, { Component } from 'react';
import { Alert, Dimensions, Image, ScrollView, StyleSheet, } from 'react-native';
import { Drawer,
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
import MapMarker from 'react-native-maps';

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

    this.state = {imgList: images, loadQueue: loadQ}
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

  render() {
    return (
      <ScrollView>
  	    <View style={styles.container}>

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

        <MapView
            initialRegion={{
              latitude: property.address_latitude,
              longitude: property.address_longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            style={styles.map}
        >
            <MapMarker
              coordinate={{latitude: property.address_latitude, longitude: property.address_longitude}}
              title={"Test"}
              description={"Test"}
              />

        </MapView>

          <Text style={styles.mainInfo}>{property.address_address1 + "\n" + property.address_city + ", " + property.address_country}</Text>
          <View style={styles.horizontalHolder}>
  	        <Text style={styles.leftPropertyInfo}>{"Rent:\n$" + property.market_rent + "/month"}</Text>
            <Text style={styles.propertyInfo}>{"# of Rooms: \n" + property.bedrooms + " Bed/" + property.bathrooms + " Bath"}</Text>
            <Text style={styles.rightPropertyInfo}>{"Square Feet: \n" + property.square_feet + " sq ft." }</Text>
          </View>
  	      <Text style={styles.info}>{"Description: " + property.marketing_description}</Text>
          <Text style={styles.info}>{"Amenities: " + property.amenities}</Text>
          <Text style={styles.phoneNumber} onPress={() => this._callNumber(property.contact_phone_number)} >{"Phone:\n" + property.contact_phone_number}</Text>

        </View>
  	  </ScrollView>
    );
  }

}

const styles = StyleSheet.create({
	wrapper: {
    height: 400,
  },

  map: {
      height: 240,
      top: 10,
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
  },
  info: {
  	fontSize: 15,
  	padding: 10,
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
    borderBottomColor: 'black',
    borderBottomWidth: 1,
  },
});
