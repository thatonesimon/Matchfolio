import React, { Component } from 'react';
import { AsyncStorage, Dimensions, StyleSheet, ListView } from 'react-native'
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
import SLIcon from 'react-native-vector-icons/SimpleLineIcons';
import EVIcon from 'react-native-vector-icons/EvilIcons';
import ENIcon from 'react-native-vector-icons/Entypo';
import FAIcon from 'react-native-vector-icons/FontAwesome'
import IOIcon from 'react-native-vector-icons/Ionicons'
import * as firebase from 'firebase';

const baseUrl = 'http://pa.cdn.appfolio.com/';
var userDB_interested, userDB_uninterested;

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
    this._renderRightRemoveField = this._renderRightRemoveField.bind(this);
    this._renderLeftApplyField = this._renderLeftApplyField.bind(this);
    this._deleteRow = this._deleteRow.bind(this);
    this.onDbInterestedDataChanged = this.onDbInterestedDataChanged.bind(this);
    this.zoomToNext = this.zoomToNext.bind(this);

    userDB_interested = firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/interested/');
    userDB_uninterested = firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/uninterested/');
    userDB_applied = firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/applied/');

    userDB_interested.on('child_removed', this.onDbInterestedDataChanged);
    userDB_applied.on('child_added', this.onDbInterestedDataChanged);
    userDB_applied.on('child_changed', this.onDbInterestedDataChanged);

    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
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
    this.state= {listView: true,
                data: data,
                remainingInfos: remainingInfos,
                latitude: 34.41560,
                longitude: -119.84192};
	}

  componentWillMount(){
    this._mounted = true;
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
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

  componentWillUnmount() {
    this._mounted = false;
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

  onDbInterestedDataChanged(dataSnapshot) {
    if(this._mounted) {
      const newData = this.state.data.filter(item => item.listable_uid != global.removedPropertyId);
      this.setState({data: newData});
    }
  }

  zoomToNext() {
    console.log("Zoom to next property." + this.state.data.length);
    if(this.state.data.length < 1) {
        return;
    }
    if(currentMarker < this.state.data.length) {
        var coordinates = {
            latitude: this.state.data[currentMarker].address_latitude,
            longitude: this.state.data[currentMarker].address_longitude,
        }
        this._map.animateToCoordinate(coordinates, 500);
        currentMarker++;
    } else {
        currentMarker = 0;
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
      else if(global.applied[item.listable_uid])
          return (
       <ListItem button onPress={()=>this.props.navigation.navigate('propertyInfo', {item: item, showApply: true})}>
          <Thumbnail square style={{marginLeft: 15}} size={80} source={{uri: baseUrl + item.image_urls.split(',')[0]}} />
          <Body>
             <Text>{item.address_address1}</Text>
             <Text note>{"Rent: $" + item.market_rent}</Text>
          </Body>
          <Icon name="ios-checkmark-circle-outline" size={30} style={{color:"#0097ef"}}/>

       </ListItem>);
      else
         return (
      <ListItem button onPress={()=>this.props.navigation.navigate('propertyInfo', {item: item, showApply: true})}>
         <Thumbnail square style={{marginLeft: 15}} size={80} source={{uri: baseUrl + item.image_urls.split(',')[0]}} />
         <Body>
            <Text>{item.address_address1}</Text>
            <Text note>{"Rent: $" + item.market_rent}</Text>
         </Body>

      </ListItem>);
   }

   _renderRightRemoveField(data, secId, rowId, rowMap) {
    return (
      <Button full danger onPress={_ => this._deleteRow(secId, rowId, rowMap)}>
       <IOIcon active size={40} name='ios-trash' color='white'/>
      </Button>
    );
   }

   _renderLeftApplyField(property) {

     function applyToProperty() {
       global.applied[property.listable_uid] = 1;
       //Alert.alert("Your application has been sent to " + property.vhost + "!");
       firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/applied/' + property.listable_uid).set(1);
     }
     applyToProperty = applyToProperty.bind(this);

     if (global.applied[property.listable_uid]) {
       return (
        <Button full disabled onPress={ applyToProperty }>
         <IOIcon active size={35} name='md-send' color='white'/>
        </Button>
      );
     }
     return (
      <Button full success onPress={ applyToProperty }>
       <IOIcon active size={35} name='md-send' color='white'/>
      </Button>
    );
   }

   _deleteRow(secId, rowId, rowMap) {
     rowMap[`${secId}${rowId}`].props.closeRow();
     const uid_to_remove = this.state.data[rowId].listable_uid;
     global.removedPropertyId = uid_to_remove;
     userDB_interested.child(uid_to_remove).remove();
     userDB_uninterested.child(uid_to_remove).set(1);
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
             list = <List dataSource={this.ds.cloneWithRows(this.state.data)}
                          renderRow={this._onRenderRow}
                          renderRightHiddenRow={this._renderRightRemoveField}
                          renderLeftHiddenRow={this._renderLeftApplyField}
                          disableRightSwipe={false}
                          rightOpenValue={-75}
                          leftOpenValue={75} />;
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
                 buttonColor="#0097ef"
                 onPress={() => { this.setState({listView: !this.state.listView})}}
                 position="right"
                 style={styles.button}
                 renderIcon={() => {return <ENIcon name="map" size={24} color="white" />}} />
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
                           image={require('../res/blue-pin.png')}
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
                   buttonColor="#0097ef"
                   onPress={() => this.zoomToNext()}
                   position="left"
                   style={styles.button}
                   renderIcon={() => {return <ENIcon name="arrow-right" color="white" size={28} />}} />
                 <ActionButton
                   buttonColor="#0097ef"
                   onPress={() => { this.setState({listView: !this.state.listView})}}
                   position="right"
                   style={styles.button}
                   renderIcon={() => {return <ENIcon name="list" color="white" size={28} />}} />
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
