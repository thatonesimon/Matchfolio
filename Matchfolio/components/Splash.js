import React, { Component } from 'react';
import { Alert,
         Dimensions,
         Image,
         ScrollView,
         StyleSheet, } from 'react-native';
import { View,
         Spinner, } from 'native-base';
import { NavigationActions } from 'react-navigation';

export default class Splash extends Component {

	constructor(props) {
    	super(props);
    	this.redirectToLogin = this.redirectToLogin.bind(this);
    }

	redirectToLogin() {
		this.props.navigation.navigate('login');
	}

	render() {
		setTimeout((this.redirectToLogin), 2000);
		return (
			<View style={styles.container} >
				<Image style={styles.logo} source={ require('../res/logo.png') } />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		padding: 10,
		flex: 1,
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
	},
	logo: {
		justifyContent: 'center',
		height: 100,
		width: 100,
	}
});
