import React, { Component } from 'react';
import { Alert,
         Dimensions,
         Image,
         ScrollView,
         TextInput,
         StyleSheet, } from 'react-native';

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


class InputField extends Component{
  constructor(props) {
    super(props);
    this.state = { text: '' };
  }
  static navigationOptions = {
    header: null,
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
         <Body>
         <Text style={styles.header}>Personal Info</Text>
         </Body>

         <Right />
         </Header>
         <InputField name='Name'></InputField>
         <InputField name='Email'></InputField>
         <InputField name='Personal'></InputField>
         <View style={styles.buttonHolder}>
          <Button
            color="#5DADE2"
            title='Save'
            onPress={() => {Alert.alert("must fill out name")}} />
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
    width: Dimensions.get('window').width,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
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
