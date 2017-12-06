import React, { Component } from 'react';
import { Alert, Dimensions, Image, ScrollView, TextInput, StyleSheet} from 'react-native';
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
        Spinner } from 'native-base';
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
			<View>
				<Header style= {{backgroundColor: 'transparent',
				borderBottomWidth: 0}}>
					<Left>
						<Button transparent
						onPress={() => this.props.navigation.navigate('DrawerToggle')}>
							<Icon name='menu' />
						</Button>
					</Left>
					<Right />
				</Header>
				<Text style={styles.header}><Ionicons name="ios-contact" size={40} color="skyblue" padding = {40}/> Personal</Text>
				<InputField name='Name'></InputField>
				<InputField name='Email'></InputField>
        <View style={{justifyContent: 'center', alignItems: 'center', alignSelf: 'center'}}>
				    <Button bordered onPress={() => {this.props.navigation.navigate('Preferences')} } >
					       <Text> Save </Text>
				    </Button>
        </View>
			</View>
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
    fontSize: 40
  },
  margin: {
    margin: 10,
  },
});
