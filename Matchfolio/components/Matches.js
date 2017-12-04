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
    tabBarVisible: false,
    drawerLabel: EmptyDrawerItem
  }

   constructor(props)
   {
      super(props);
   }

   componentWillMount()
   {
      //this.checkMatchedProperties();
   }

   async checkMatchedProperties()
   {
      try 
      {
         var matches = await AsyncStorage.getItem('matched-properties');
         if (value !== null)
         {
            this.setState({matches: JSON.parse(matches)});
         }
         else
         {
            console.log("No matched properties data file!")
         }
      }
      catch (error)
      {
         console.log(error);
      }
   }

   render() {
      var data = []
      if (this.props.navigation.state.params != undefined && this.props.navigation.state.params.matches!=null)
      {
         data = this.props.navigation.state.params.matches;
      }
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
        <Content>
         <List dataArray={data}
            renderRow={(item) =>
            <ListItem button onPress={()=>this.props.navigation.navigate('propertyInfo', {item: item})}>
              <Thumbnail square size={80} source={{uri: baseUrl + item.image_urls.split(',')[1]}} />
              <Body>
                <Text>{item.address_address1}</Text>
                <Text note>{"Rent: $" + item.market_rent}</Text>
              </Body>
            </ListItem>}
          />
        </Content>
            <Footer>
              <FooterTab>
                <Button vertical onPress={()=>this.props.navigation.navigate('home')}>
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