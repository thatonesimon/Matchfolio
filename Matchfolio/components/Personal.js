import React, { Component } from 'react';
import { Alert, Dimensions, Image, ScrollView, TextInput, StyleSheet} from 'react-native';
import { Drawer,
        Container,
        Header,
        View,
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
        Form,
        Item,
        Input,
        Label, } from 'native-base';
import { Ionicons } from '@expo/vector-icons'; // 6.1.0
import { NavigationActions } from 'react-navigation';


class InputField extends Component{
	constructor(props) {
		super(props);
		this.state = { text: '' };
	}
	render() {
		return (
			<View style={styles.inputField}>
				<Text style= {styles.inputHead}> {this.props.name} </Text>
				<TextInput
					style={styles.textInput}
					onChangeText={(text) => this.setState({text})}
					value={this.state.text}
				/>
			</View>
		);
	}
}

export default class Personal extends React.Component {
	static navigationOptions = {
		header: null,
		drawerLabel: 'Personal',
		drawerIcon: ({ tintColor }) => (<Icon name="ios-contact-outline" size={15} style={{ color: tintColor }} />),
	}
	render() {
		return (
			<Container>
        <Header style= {{backgroundColor: 'transparent', borderBottomWidth: 0}}>
           <Left style={{flex: 1}}>
             <Button transparent
             onPress={() => this.props.navigation.navigate('DrawerToggle')}>
                     <Icon name='menu' />
             </Button>
             </Left>
                 <Body style={{flex: 3, alignItems: 'center', justifyContent: 'center'}}>
                  <Text style={styles.header}><Ionicons name="ios-contact" size={40} color="skyblue" padding = {40}/> Personal</Text>
                 </Body>
                 <Right style={{flex: 1}} />
         </Header>
        <Content>
          <Form>
            <Item floatingLabel>
              <Label>First Name</Label>
            </Item>
            <Item floatingLabel>
              <Label>Last Name</Label>
            </Item>
            <Item floatingLabel>
              <Label>Social Security #</Label>
            </Item>
            <Item floatingLabel>
              <Label>Birthday</Label>
            </Item>
            <Item />
          </Form>
          <Button bordered block onPress={() => this.props.navigation.navigate('rentalapp')} style={styles.button} >
            <Text>Save</Text>
          </Button>
        </Content>
      </Container>
		);
	}
}

const styles = StyleSheet.create({
  inputField: {margin:10},
  textInput: {fontSize:20, height: 30, width:Dimensions.get('window').width-20, borderColor: 'gray', borderWidth: 1},
  inputHead: {fontSize:20, fontWeight: 'bold'},
  buttonHolder: {
    textAlign: 'center'
  },
  header: {
    textAlign: 'center',
    color: 'skyblue',
    fontSize: 30,
  },
  margin: {
    margin: 10,
  },
  button: {
    padding: 10,
    margin: 20,
  },
});
