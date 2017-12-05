import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View,
  Image
} from 'react-native';

import * as Progress from 'react-native-progress';

var timer;

export default class BackgroundCheckLoading extends Component {
	constructor(props) {
	super(props);

	this.state = {
	  progress: 0,
	  indeterminate: true,
	  text: "Background check in progress...",
	};

	this.componentDidMount = this.componentDidMount.bind(this);
	this.redirectToMain = this.redirectToMain.bind(this);

	}

	componentDidMount() {
		this.animate();
	}

  	redirectToMain() {
		this.props.navigation.navigate('main');
	}


	animate() {
	    let progress = 0;
	    this.setState({ progress });
	    setTimeout(() => {
	    	if(progress == 1) {
	    		return;
	    	}

			this.setState({ indeterminate: false });
			timer = setInterval(() => {
			progress += Math.random() / 5;
			if (progress > 1) {
			 	progress = 1;
			 	this.setState({ text: "Background check complete!"});
				setTimeout((this.redirectToMain), 1000);
				clearInterval(timer);
			}
	        this.setState({ progress });
	      	}, 500);
	    }, 1500);
	}

  render() {

    return (
      <View style={styles.container}>
		<Progress.Circle
          style={styles.progress}
          progress={this.state.progress}
          indeterminate={this.state.indeterminate}
          color="#3179cd"
          showsText={true}
          size={100}
        />
        <Text style={styles.welcome}>{this.state.text}</Text>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 20,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  progress: {
    margin: 10,
  },
});