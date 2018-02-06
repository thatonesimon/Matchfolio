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

export default class Matches extends Component {

	static navigationOptions = {
		header: null,
		drawerLabel: EmptyDrawerItem
	}

	constructor(props){
		super(props);
		this._onRenderRow = this._onRenderRow.bind(this);

        var data = []
        var remainingInfos = null
        if (this.props.navigation.state.params)
        {
           if (this.props.navigation.state.params.matches)
              data = this.props.navigation.state.params.matches;
           if (this.props.navigation.state.params.remainingInfos)
              remainingInfos = this.props.navigation.state.params.remainingInfos;
        }

        var markers = [{
            key: "appfolio",
            title: "Appfolio",
            description: "Come visit Appfolio!",
            coordinates: {
              latitude: 34.434248,
              longitude: -119.863704
            },
          },
          {
            key: "simons",
            title: "Simon's Place",
            description: "Lit",
            coordinates: {
              latitude: 34.4107502,
              longitude: -119.8666063
            },
        }];

        // apparently foreach is much slower
        for(var i = 0; i < data.length; i++) {
            var property = data[i];
            var newMarker = { key: property.listable_uid,
                              title: property.address_address1,
                              description: property.marketing_title,
                              coordinates: {
                                  latitude: property.address_latitude,
                                  longitude: property.address_longitude
                              },
                          };
            markers.push(newMarker);
        }

        // start with map
        this.state= {listView: false, data: data, remainingInfos: remainingInfos,
                    markers: markers};
	}

   componentWillMount(){
      //this.checkMatchedProperties();
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

   _onRenderRow(item)
   {
      if(item == null)
         return null;
      else
         return (
      <ListItem button onPress={()=>this.props.navigation.navigate('propertyInfo', {item: item})}>
         <Thumbnail square size={80} source={{uri: baseUrl + item.image_urls.split(',')[0]}} />
         <Body>
            <Text>{item.address_address1}</Text>
            <Text note>{"Rent: $" + item.market_rent}</Text>
         </Body>
      </ListItem>);
   }

   render() {
      if(this.state.listView) {
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
               <List dataArray={this.state.data}
                  renderRow={this._onRenderRow} />
              </Content>
              <ActionButton
                buttonColor="#3179cd"
                onPress={() => { this.setState({listView: !this.state.listView})}}
                position="right"
                style={styles.button}
              />
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
                    initialRegion={{
                      latitude: 34.434248,
                      longitude: -119.863704,
                      latitudeDelta: 0.0922,
                      longitudeDelta: 0.0421,
                    }}
                    style={styles.map}
                >
                    {this.state.markers.map(marker => (
                        <MapView.Marker
                          key={marker.key}
                          coordinate={marker.coordinates}
                          title={marker.title}
                          description={marker.description}
                        />
                    ))}
                </MapView>
                </Content>
                <ActionButton
                  buttonColor="#3179cd"
                  onPress={() => { this.setState({listView: !this.state.listView})}}
                  position="right"
                  style={styles.button}
                />
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
        height: Dimensions.get('window').height,
        flex: 1,
        marginBottom: 10,
        borderRadius: 5,
    },
    button: {
        marginBottom: 50,
    }
});
