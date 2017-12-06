import React, { Component } from 'react';
import { AsyncStorage } from 'react-native'
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
      var data = []
      var remainingInfos = null
      if (this.props.navigation.state.params)
      {
         if (this.props.navigation.state.params.matches)
            data = this.props.navigation.state.params.matches;
         if (this.props.navigation.state.params.remainingInfos)
            remainingInfos = this.props.navigation.state.params.remainingInfos;
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
         <List dataArray={data}
            renderRow={this._onRenderRow} /> 
        </Content>
            <Footer>
              <FooterTab>
                <Button vertical onPress={()=>this.props.navigation.navigate('home', {homeSavedMatches: data, remainingInfos: remainingInfos})}>
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