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
      this.props.navigation.navigate('rentalapp', {signup: true})
    }
  }

	render() {
		return (
			<Container>
        <Header style= {{backgroundColor: 'transparent', borderBottomWidth: 0}}>
           <Left style={{flex: 1}}>
             {this.renderMenuButton()}
             </Left>
                 <Body style={{flex: 3, alignItems: 'center', justifyContent: 'center'}}>
                  <Text style={styles.header}><Ionicons name="ios-contact" size={40} color="skyblue" padding = {40}/> Personal</Text>
                 </Body>
                 <Right style={{flex: 1}} />
         </Header>
        <Content>
          <Form>
            <Text style={{marginLeft: 10, marginRight: 10}}>Personal Information</Text>
            <View style={styles.info}>
                <Item style={{marginBottom: 10}} floatingLabel>
                  <Input value="Mr."/>
                  <Label>First Name</Label>
                </Item>
                <Item style={{marginBottom: 10}} floatingLabel>
                <Input value="Meeseeks"/>
                  <Label>Last Name</Label>
                </Item>
                <Item style={{marginBottom: 10}} floatingLabel>
                <Input value="123-45-6789"/>
                  <Label>Social Security #</Label>
                </Item>
                <Item style={{marginBottom: 10}} floatingLabel>
                <Input value="A12345678"/>
                  <Label>Driver License Number</Label>
                </Item>
                <Item style={{marginBottom: 10}} floatingLabel>
                <Input value="01/01/1990"/>
                  <Label>Birthday</Label>
                </Item>
            </View>
            <Text style={{marginLeft: 10, marginTop: 10}}>Contact Information</Text>
            <View style={styles.info}>
                <Item style={{marginBottom: 10}} floatingLabel>
                <Input value="(123)-456-7890"/>
                  <Label>Phone Number</Label>
                </Item>
                <Item style={{marginBottom: 10}} floatingLabel>
                <Input value="immrmeeseeks@lookatme.com"/>
                  <Label>Email</Label>
                </Item>
            </View>
          </Form>
          <Button bordered block onPress={this.saveData} style={styles.button} >
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
    textAlignVertical: 'center',
    color: 'skyblue',
    fontSize: 24,
  },
  margin: {
    margin: 10,
  },
  button: {
    padding: 10,
    margin: 10,
  },
  info: {
    padding: 10,
    borderColor: '#888888',
    borderWidth: 1,
    backgroundColor: '#ffffff',
    // borderRadius: 5,
    marginTop: 10,
    // marginBottom: 0,
  }
});
