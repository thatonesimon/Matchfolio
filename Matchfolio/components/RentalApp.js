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
	}

	render() {
		return (
			<ScrollView>
				<Header
					style= {{backgroundColor: 'transparent',
					borderBottomWidth: 0}}>
					<Left>
						<Button transparent
						onPress={() => this.props.navigation.navigate('DrawerToggle')}>
							<Icon name='menu' />
						</Button>
					</Left>
          <Body style={{flex: 3, alignItems: 'center', justifyContent: 'center'}}>
           <Text style={styles.header}><Ionicons name="ios-list-box-outline" size={30} color="skyblue" padding = {40}/> Rental Application</Text>
          </Body>
          <Right style={{flex: 1}} />
				</Header>
        <Content>
          <Form>
            <Item floatingLabel>
              <Label>Previous Address (1st line)</Label>
            </Item>
            <Item floatingLabel>
              <Label>Previous Address (2nd line)</Label>
            </Item>
            <Item floatingLabel>
              <Label>Previous Rent</Label>
            </Item>
            <Item floatingLabel>
              <Label>Annualized Salary</Label>
            </Item>
            <Item floatingLabel>
              <Label>Occupation</Label>
            </Item>
            <Item floatingLabel>
              <Label>Employer</Label>
            </Item>
	    <Item floatingLabel>
              <Label>Vehicle Make, Model, Year</Label>
            </Item>
            <Item floatingLabel>
              <Label>Savings Account Balance</Label>
            </Item>
            <Item floatingLabel>
              <Label>Checking Account Balance</Label>
            </Item>
            <Item floatingLabel>
              <Label>Credit Card Debt and Loan Balance</Label>
            </Item>
          </Form>
          <Button bordered block onPress={() => this.props.navigation.navigate('backgroundcheck')} style={styles.button} >
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
