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

  render() {
    return (
      <ScrollView>
  	    <View style={styles.container}>
          
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

          <Text style={styles.mainInfo}>{property.address_address1 + "\n" + property.address_city + ", " + property.address_country}</Text>
          <View style={styles.horizontalHolder}>
  	        <Text style={styles.leftPropertyInfo}>{"Rent:\n$" + property.market_rent + "/month"}</Text>
            <Text style={styles.propertyInfo}>{"# of Rooms: \n" + property.bedrooms + " Bed/" + property.bathrooms + " Bath"}</Text>
            <Text style={styles.rightPropertyInfo}>{"Square Feet: \n" + property.square_feet + " sq ft." }</Text>
          </View>
  	      <Text style={styles.info}>{"Description: " + property.marketing_description}</Text>
          <Text style={styles.info}>{"Amenities: " + property.amenities}</Text>
          <Text style={styles.phoneNumber}>{"Phone:\n" + property.contact_phone_number}</Text>
  	    </View>
  	  </ScrollView>
    );
  }

}

const styles = StyleSheet.create({
	wrapper: {
    height: 400,
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


var property = {
   "listable_uid": "2aa53a37-1bf1-439e-9c6f-d655997a7a3d",
   "vhost": "utopiamanagement",
   "address_address1": "345 Kellogg Way #10 ",
   "address_address2": "",
   "address_city": "Goleta",
   "address_country": "US",
   "address_latitude": 34.4339842,
   "address_longitude": -119.8222768,
   "address_postal_code": "93117",
   "address_state": "CA",
   "advertised_lease_term": "",
   "amenities": "refrigerator, stove, washer/dryer, garage, dishwasher",
   "application_fee": 45,
   "available_date": "",
   "bathrooms": 2.5,
   "bedroom_type": "",
   "bedrooms": 3,
   "cats": "",
   "contact_phone_number": "(805) 635-8888 Ext. 1022",
   "created_at": "2017-08-08T17:20:40",
   "deposit": 3000,
   "dogs": "",
   "google_map_url": "http://maps.google.com/maps?f=q&amp;source=s_q&amp;hl=en&amp;q=345+Kellogg+Way+Goleta%2C+CA+93117&amp;ie=UTF8&amp;z=14&amp;output=embed&amp;iwloc=A&amp;ll=34.4439842,-119.8222768",
   "market_rent": 3000,
   "marketing_description": "Beautiful craftsman-style townhome in Willow Creek. Rare three bedrooms with two and one-half baths available now. Built in 2008, reflecting granite counters with stainless steel appliances in the kitchen, recessed lighting and stylish upgrades throughout. The Townhome offers a private back patio surrounded by lush landscaped grounds, one-car garage, plus one reserved parking space. It will not last long!",
   "marketing_title": "Goleta townhome 3 bed 2.5 bath ",
   "posted_to_internet_at": "",
   "posted_to_website_at": "2017-10-05T15:19:18",
   "property_type": "Single-Family",
   "property_year_built": null,
   "square_feet": 1550,
   "updated_at": "2017-10-06T21:40:50",
   "image_urls": "utopiamanagement/images/2c8b6e70-83f3-41bf-bfd2-79d3d676681f/large.jpg,utopiamanagement/images/ea8c123f-9405-4cd6-ac30-c70f9645cb93/large.jpg,utopiamanagement/images/fdca1afa-2a95-48d8-99bb-36a0f8967361/large.jpg,utopiamanagement/images/51267923-47a1-48d0-a7dd-7df6f8a97d69/large.jpg,utopiamanagement/images/03298105-21f0-49fb-a692-3858e8495aa3/large.jpg,utopiamanagement/images/64df227b-8465-40a0-9833-3e9129578488/large.jpg,utopiamanagement/images/0056632a-b263-4f54-95a9-f0d478cec8aa/large.jpg,utopiamanagement/images/d2ef29c3-19f9-420d-8d10-b197a6ac6e63/large.jpg,utopiamanagement/images/49c3fbde-6fc5-43c5-868e-63ef362e7ae1/large.jpg,utopiamanagement/images/803a035a-3e15-4ad8-a6d3-1ad789f62dac/large.jpg,utopiamanagement/images/1d647ca2-c1a7-4e5f-841d-fe15ad5723f3/large.jpg,utopiamanagement/images/31d8a9c4-51bd-4574-a402-ce2cb691fdbd/large.jpg,utopiamanagement/images/5489287b-c63f-427d-aa0d-48c9702645da/large.jpg,utopiamanagement/images/61ea5910-7f1f-4825-9758-9b0daaafdfae/large.jpg,utopiamanagement/images/4514e5be-f74f-468c-a801-72c9f9f90348/large.jpg"
 };