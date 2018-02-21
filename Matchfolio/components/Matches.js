import React, { Component } from 'react';
import { AsyncStorage, Dimensions, StyleSheet } from 'react-native'
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
         Spinner,
         List,
         ListItem } from 'native-base';
import ActionButton from 'react-native-action-button';
import MapView from 'react-native-maps';

const baseUrl = 'http://pa.cdn.appfolio.com/';

class EmptyDrawerItem extends Component {
	render(){
		return null
	}
}
var currentMarker = 0;

export default class Matches extends Component {

	static navigationOptions = {
		header: null,
		drawerLabel: EmptyDrawerItem
	}

	constructor(props){
		super(props);
		this._onRenderRow = this._onRenderRow.bind(this);
        this.zoomToNext = this.zoomToNext.bind(this);

        var data = []
        var remainingInfos = null
        if (this.props.navigation.state.params)
        {
           if (this.props.navigation.state.params.matches)
              data = this.props.navigation.state.params.matches;
           if (this.props.navigation.state.params.remainingInfos)
              remainingInfos = this.props.navigation.state.params.remainingInfos;
        }
        // if you want appfolio's pin on there
        // var appfolio = {
        //     listable_uid: "appfolio",
        //     address_address1: "Appfolio",
        //     marketing_title: "Come visit Appfolio!",
        //     address_latitude: 34.434248,
        //     address_longitude: -119.863704
        // };
        //
        // data.push(appfolio);

        // start with map
        this.state= {listView: false,
                    data: data,
                    remainingInfos: remainingInfos,
                    latitude: 34.41560,
                    longitude: -119.84192};
        this.markers = [];
	}

    componentWillMount(){
      //this.checkMatchedProperties();
    }

    componentDidMount() {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // this.setState({
          //   latitude: position.coords.latitude,
          //   longitude: position.coords.longitude,
          // });
          var coordinates = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
          }
          this._map.animateToCoordinate(coordinates, 500);
          console.log("lat: " + position.coords.latitude + " lon: " + position.coords.longitude);
        },
        (error) => console.log(error.message),
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
      );
    }

	async checkMatchedProperties(){
		try {
			var matches = await AsyncStorage.getItem('matched-properties');

			if (value !== null){
				this.setState({matches: JSON.parse(matches)});
			}
			else{
				console.log("No matched properties data file!");
			}
		}

		catch (error){
			console.log(error);
		}
	}

    zoomToNext() {
        console.log("Zoom to next property." + this.state.data.length);
        if(this.state.data.length < 1) {
            return;
        }
        if(currentMarker < this.state.data.length) {
            // this.setState({
            //   latitude: this.state.data[currentMarker].address_latitude,
            //   longitude: this.state.data[currentMarker].address_longitude,
            // });
            // this.markers[currentMarker].onPress();
            var coordinates = {
                latitude: this.state.data[currentMarker].address_latitude,
                longitude: this.state.data[currentMarker].address_longitude,
            }
            this._map.animateToCoordinate(coordinates, 500);
            currentMarker++;
        } else {
            currentMarker = 0;
            // this.setState({
            //   latitude: this.state.data[currentMarker].address_latitude,
            //   longitude: this.state.data[currentMarker].address_longitude,
            // });
            var coordinates = {
                latitude: this.state.data[currentMarker].address_latitude,
                longitude: this.state.data[currentMarker].address_longitude,
            }
            this._map.animateToCoordinate(coordinates, 500);

            currentMarker++;
        }
    }

   _onRenderRow(item)
   {
      if(item == null)
         return null;
      else
         return (
      <ListItem button onPress={()=>this.props.navigation.navigate('propertyInfo', {item: item, showApply: true})}>
         <Thumbnail square size={80} source={{uri: baseUrl + item.image_urls.split(',')[0]}} />
         <Body>
            <Text>{item.address_address1}</Text>
            <Text note>{"Rent: $" + item.market_rent}</Text>
         </Body>
      </ListItem>);
   }

   render() {
       console.log("Rendering with lat: " + this.state.latitude + " lon: " + this.state.longitude);
       if(this.state.listView) {
           let list = null;
           if(this.state.data.length == 0) {
               list = <View style={{flex: 1, margin: 10, justifyContent: "center"}}>
                        <Text style={{textAlign: "center"}}>{"You have not matched with any properties yet!\n"}</Text>
                        <Text style={{textAlign: "center"}}>Go to "Find Properties" to discover new properties!</Text>
                      </View>;
           } else {
               list = <List dataArray={this.state.data}
                            renderRow={this._onRenderRow} />;
           }
           return (
             <Container backgroundColor='white'>
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
               <Content>
                 {list}
               </Content>
               <ActionButton
                 buttonColor="#3179cd"
                 onPress={() => { this.setState({listView: !this.state.listView})}}
                 position="right"
                 style={styles.button}
                 renderIcon={() => {return <Icon name="ios-map-outline" />}} />
                   <Footer>
                     <FooterTab>
                       <Button vertical onPress={()=>this.props.navigation.navigate('home', {homeSavedMatches: this.state.data, remainingInfos: this.state.remainingInfos})}>
                         <Icon name="search" />
                         <Text>Find Properties</Text>
                       </Button>
                       <Button vertical active>
                         <Icon active name="home" />
                         <Text>Matched Properties</Text>
                       </Button>
                     </FooterTab>
                   </Footer>
             </Container>

           );
       }
       else {
           return (

               <Container backgroundColor='white'>
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
                 <Content style={{flexDirection:"column"}}>
                 <MapView
                    ref={map => this._map = map}
                     initialRegion={{
                       latitude: this.state.latitude,
                       longitude: this.state.longitude,
                       latitudeDelta: 0.09,
                       longitudeDelta: 0.04,
                     }}
                     showsUserLocation = {true}
                     style={styles.map}
                 >

                     {this.state.data.map(marker => (
                         <MapView.Marker
                           ref={thisMarker => this.markers.concat(thisMarker)}
                           key={marker.listable_uid}
                           coordinate={{
                               latitude: marker.address_latitude,
                               longitude: marker.address_longitude
                           }}>

                           <MapView.Callout
                             onPress={()=>this.props.navigation.navigate('propertyInfo', {item: marker, showApply: true})}>
                             <View>
                               <Text style={{textAlign: "center", fontSize: 15}}>{marker.address_address1}</Text>
                               <Text style={{textAlign: "center", fontSize: 12}}>{marker.marketing_title}</Text>
                             </View>
                           </MapView.Callout>
                         </MapView.Marker>
                     ))}
                 </MapView>
                 </Content>
                 <ActionButton
                   buttonColor="#3179cd"
                   onPress={() => this.zoomToNext()}
                   position="left"
                   style={styles.button}
                   renderIcon={() => {return <Icon name="ios-arrow-round-forward" />}} />
                 <ActionButton
                   buttonColor="#3179cd"
                   onPress={() => { this.setState({listView: !this.state.listView})}}
                   position="right"
                   style={styles.button}
                   renderIcon={() => {return <Icon name="ios-list" />}} />
                     <Footer>
                       <FooterTab>
                         <Button vertical onPress={()=>this.props.navigation.navigate('home', {homeSavedMatches: this.state.data, remainingInfos: this.state.remainingInfos})}>
                           <Icon name="search" />
                           <Text>Find Properties</Text>
                         </Button>
                         <Button vertical active>
                           <Icon active name="home" />
                           <Text>Matched Properties</Text>
                         </Button>
                       </FooterTab>
                     </Footer>
               </Container>

           );
       }

  }
}

const styles = StyleSheet.create({
    map: {
        height: Dimensions.get('window').height-117,
        flex: 1,
        marginBottom: 10,
        borderRadius: 5,
    },
    button: {
        marginBottom: 50,
    }
});
