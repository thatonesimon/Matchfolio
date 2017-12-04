import React, { Component } from 'react';
import {
  AppRegistry,
  Alert,
  CheckBox,
  Dimensions,
  FlatList,
  Image,
  Picker,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
} from 'react-native';
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

export default class Preferences extends React.Component {
  _onButtonPress() {
    Alert.alert('You tapped the button!');
  }
  static navigationOptions = {
    header: null,
    drawerLabel: 'Preferences',
    drawerIcon: ({ tintColor }) => (<Icon name="ios-cog" size={15} style={{ color: tintColor }} />),
  }
  constructor(props) {
    super(props);
    this.state = {
      value: false,
      switchValue: true
    };
  }

  _handleToggleSwitch = () => this.setState(state => ({
    switchValue: !state.switchValue
  }));

  render() {
    return (
      <ScrollView>
          <Header style= {{backgroundColor: 'transparent',
               borderBottomWidth: 0}}>
         <Left>
         <Button transparent
           onPress={() => this.props.navigation.navigate('DrawerToggle')}>
           <Icon name='menu' />
         </Button>
         </Left>
         <Body>
         </Body>

         <Right />
         </Header>
        <Text style={styles.header}><Ionicons name="ios-cog" size={40} color="skyblue" padding = {40}/> Preferences</Text>
        <Text style={styles.blacktext}>Rent</Text>

        <View style={{ flexDirection: 'row' }}>
           <TextInput
            style={styles.inputs}
            keyboardType="numeric"
            returnKeyType = {"next"}
            autoFocus = {true}
            placeholder = "Title"
            onSubmitEditing={(event) => {
              this.refs.MaxRent.focus(); }}
            onChangeText={text => this.setState({ text })}
          />
          <Text style={styles.blacktext}>to </Text>
          <TextInput
          ref='MaxRent'
            style={styles.inputs}
            keyboardType="numeric"
            placeholder="Max"
            onChangeText={text => this.setState({ text })}
          />
        </View>
        <Text style={styles.blacktext}>Square Feet</Text>
        <View style={{ flexDirection: 'row' }}>
          <TextInput
            style={styles.inputs}
            keyboardType="numeric"
            returnKeyType = {"next"}
            placeholder = "Title"
            onSubmitEditing={(event) => {
              this.refs.MaxSquare.focus(); }}
            onChangeText={text => this.setState({ text })}
          />
          <Text style={styles.blacktext}>to </Text>
          <TextInput
          ref='MaxSquare'
            style={styles.inputs}
            keyboardType="numeric"
            placeholder="Max"
            onChangeText={text => this.setState({ text })}
          />
        </View>
        <Text style={styles.blacktext}>Bed</Text>
        <Picker
          style={{ width: 100 }}
          selectedValue={this.state.bedlanguage}
          onValueChange={(bedVal, itemIndex) =>
            this.setState({ bedlanguage: bedVal })}>
          <Picker.Item label="1" value="bed_one" />
          <Picker.Item label="2" value="bed_two" />
          <Picker.Item label="3" value="bed_three" />
          <Picker.Item label="4" value="bed_four" />
          <Picker.Item label="5" value="bed_five" />
        </Picker>
        <Text style={styles.blacktext}>Baths</Text>
        <Picker
          style={{ width: 100 }}
          selectedValue={this.state.bathlanguage}
          onValueChange={(bathValue, itemIndex) =>
            this.setState({ bathlanguage: bathValue })}>
          <Picker.Item label="1" value="bath_one" />
          <Picker.Item label="2" value="bath_two" />
          <Picker.Item label="3" value="bath_three" />
          <Picker.Item label="4" value="bath_four" />
          <Picker.Item label="5" value="bath_five" />
        </Picker>
        <Text style={styles.blacktext}>Amenities Included</Text>
        <FlatList
          data={[
            { key: 'Laundry' },
            { key: 'Dishwasher' },
            { key: 'Air Conditioning' },
            { key: 'Furnished' },
            { key: 'Parking' },
            { key: 'Dog-Friendly' },
            { key: 'Cat-Friendly' },
          ]}
          renderItem={({ item }) => <Text style={styles.item}>{item.key}</Text>}
        />

        <Text style={styles.blacktext}>Style</Text>
         <View style={{ flexDirection: 'row' }}><CheckBox
          onValueChange={this._handleToggleSwitch}
          value={this.state.switchValue}
        /><Text> Houses </Text>
        </View>

        <View style={{ flexDirection: 'row' }}><CheckBox
          onValueChange={this._handleToggleSwitch}
          value={this.state.switchValue}
        /><Text> Apartments </Text>
        </View>

        <View style={{ flexDirection: 'row' }}><CheckBox
          onValueChange={this._handleToggleSwitch}
          value={this.state.switchValue}
        /><Text> Condos </Text>
        </View>

        <View style={{ flexDirection: 'row' }}><CheckBox
          onValueChange={this._handleToggleSwitch}
          value={this.state.switchValue}
        /><Text> Townhouses </Text>
        </View>

        <View style={styles.buttonHolder}>
          <Button
            color="#4b9693"
            title="Save"
            onPress={() => {
              Alert.alert('Saved');
            }}
          />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  blacktext: {
    color: 'black',
    padding: 10,
    fontSize: 18,
  },
  inputs: {
    height: 44,
    flex: 1,
    margin: 5,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
  },
  buttonHolder: {
    width: Dimensions.get('window').width,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
  },
  header: {
    textAlign: 'center',
    marginTop: 20,
    color: 'skyblue',
    fontSize: 40,
  },
  item: {
    padding: 10,
    fontSize: 14,
    height: 44,
  },
  margin: {
    margin: 10,
  },
});
