import React, { Component } from 'react';
import {AppRegistry, Alert, CheckBox, Dimensions, FlatList, Image, Picker, ScrollView, StyleSheet, Switch, TextInput} from 'react-native';
  import { Drawer,
          Container,
          Header,
          View,
          Form,
          Item,
          Input,
          Label,
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
import { NavigationActions } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons'; // 6.1.0

const instructions =
  "We'll use this information to run a\n" + "background check so we can make sure you\n" + "qualify for every property we show you.\n";

class TextInputWithTitle extends Component {
	static navigationOptions = {
		header: null,
	}
	render() {
		return (
			<View style={{flex: 1, flexDirection: 'row'}}>
				<Text style={{flex: 1, textAlign: 'center', fontSize: 20}}>{this.props.title}</Text>
				<TextInput style={{flex: 1, textAlign: 'center', fontSize: 20}} placeholder={this.props.placeholder}/>
			</View>
		);
	}
}

function onPressSubmit() {
  {this.props.navigation.navigate('backgroundcheck')};
  return;
}

export default class App extends Component<{}> {
	static navigationOptions = {
		header: null,
		drawerLabel: 'Rental App',
		drawerIcon: ({ tintColor }) => (<Icon name="ios-list-box-outline" size={15} style={{ color: tintColor }} />),
    gesturesEnabled: false,
	}


  constructor(props) {
    super(props)
    this.saveData = this.saveData.bind(this)
    this.renderMenuButton = this.renderMenuButton.bind(this)
  }

renderMenuButton() {
  params = this.props.navigation.state.params
  if(!params || !params.signup) {
    return (
      <Button transparent onPress={() => this.props.navigation.navigate('DrawerToggle')}>
        <Icon name='menu' />
      </Button>
    )
  }
  else {
    return null
  }
}

  saveData() {
    params = this.props.navigation.state.params
    if(params && params.signup) {
      this.props.navigation.navigate('backgroundcheck', {signup: true})
    }
  }

	render() {
		return (
			<ScrollView>
				<Header
					style= {{backgroundColor: 'transparent',
					borderBottomWidth: 0}}>
					<Left>
						{this.renderMenuButton()}
					</Left>
          <Body style={{flex: 3, alignItems: 'center', justifyContent: 'center'}}>
           <Text style={styles.header}><Ionicons name="ios-list-box-outline" size={30} color="skyblue" padding = {40}/> Rental Application</Text>
          </Body>
          <Right style={{flex: 1}} />
				</Header>
        <Content>
          <Form style={{marginRight: 10}}>
            <Item floatingLabel>
                <Input value="123 Street Dr."/>
                <Label>Previous Address (1st line)</Label>
            </Item>
            <Item floatingLabel>
              <Input value="New York, NY 13579"/>
              <Label>Previous Address (2nd line)</Label>
            </Item>
            <Item floatingLabel>
              <Input value="$700"/>
              <Label>Previous Rent</Label>
            </Item>
            <Item floatingLabel>
              <Input value="$27000"/>
              <Label>Annualized Salary</Label>
            </Item>
            <Item floatingLabel>
              <Input value="Barista"/>
              <Label>Occupation</Label>
            </Item>
            <Item floatingLabel>
              <Input value="Starbucks"/>
              <Label>Employer</Label>
            </Item>
	    <Item floatingLabel>
            <Input value="Chevy Maliby 2006"/>
              <Label>Vehicle Make, Model, Year</Label>
            </Item>
            <Item floatingLabel>
            <Input value="$8000"/>
              <Label>Savings Account Balance</Label>
            </Item>
            <Item floatingLabel>
            <Input value="$400"/>
              <Label>Checking Account Balance</Label>
            </Item>
            <Item floatingLabel>
            <Input value="$2700"/>
              <Label>Credit Card Debt and Loan Balance</Label>
            </Item>
          </Form>
          <Button bordered block onPress={this.saveData} style={styles.button} >
            <Text>Submit</Text>
          </Button>
        </Content>
			</ScrollView>
		);
	}
}

const styles = StyleSheet.create({
  fields: {
    flex: 5
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  header: {
    textAlign: 'center',
    textAlignVertical: 'center',
    color: 'skyblue',
    fontSize: 20,
  },
  button: {
    padding: 10,
    margin: 20,
  },
});
