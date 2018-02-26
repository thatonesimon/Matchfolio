import React, { Component } from 'react';
import {
  AppRegistry,
  Alert,
  Dimensions,
  FlatList,
  Image,
  Picker,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  View,
} from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { Container, Header, Left, Right, Button, Content, ListItem, Icon, CheckBox, Text, Body } from 'native-base';
import { Ionicons } from '@expo/vector-icons'; // 6.1.0
import { NavigationActions } from 'react-navigation';


export default class Preferences extends React.Component {
  _onButtonPress() {
    Alert.alert('You tapped the button!');
  }

  rentState = {
    multiSliderValue:[1500, 5000]
  };

  sqftState = {
    multiSliderValue:[2000, 3000]
  };

  sliderValuesChangeStart = () => {
    this.setState({
      sliderOneChanging: true,
    });
  }

  sliderValuesChangeFinish = () => {
    this.setState({
      sliderOneChanging: false,
    });
  }

  multiSliderValuesChange = (values) => {
    this.multiSliderValue = values;
  }

  static navigationOptions = {
    drawerIcon: ({ tintColor }) => (<Icon name="ios-color-filter-outline" size={15} style={{ color: tintColor }} />),
    header: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      value: false,
      switchValue: true
    };
  }

  render() {
    return (
      <ScrollView backgroundColor='white'>
        <Header style= {{backgroundColor: 'transparent', borderBottomWidth: 0}}>
          <Left style={{flex: 1}}>
            <Button transparent onPress={() => this.props.navigation.navigate('DrawerToggle')}>
              <Icon name='menu' />
            </Button>
          </Left>
          <Body style={{flex: 4, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={styles.header}><Ionicons name="ios-cog" size={40} color="skyblue" padding = {40}/> Preferences</Text>
          </Body>
          <Right style={{flex: 1}} />
        </Header>

        <Text style={styles.blacktext}>Rent</Text>
        <View style={styles.slider}><Text>Min: ${this.rentState.multiSliderValue[0]}</Text><Text>Max: ${this.rentState.multiSliderValue[1]}</Text></View>
        <View style={styles.slider}>
          <MultiSlider
            values={[this.rentState.multiSliderValue[0], this.rentState.multiSliderValue[1]]}
            sliderLength={280}
            onValuesChange={this.multiSliderValuesChange}
            min={500}
            max={10000}
            step={100}
            snapped
            />
        </View>

        <Text style={styles.blacktext}>Square Feet</Text>
        <View style={styles.slider}><Text>Min: {this.sqftState.multiSliderValue[0]}</Text><Text>Max: {this.sqftState.multiSliderValue[1]}</Text></View>

        <View style={styles.slider}>
          <MultiSlider
            values={[this.sqftState.multiSliderValue[0], this.sqftState.multiSliderValue[1]]}
            sliderLength={280}
            onValuesChange={this.multiSliderValuesChange}
            min={500}
            max={7500}
            step={250}
            snapped
            />
        </View>

        <Text style={styles.blacktext}>Bed</Text>
        <Picker style={{ width: 100 }}
          mode = 'dropdown'
          selectedValue={this.state.bedlanguage}
          onValueChange={(bedVal, itemIndex) =>this.setState({ bedlanguage: bedVal })}>
          <Picker.Item label="1" value="bed_one" />
          <Picker.Item label="2" value="bed_two" />
          <Picker.Item label="3" value="bed_three" />
          <Picker.Item label="4" value="bed_four" />
          <Picker.Item label="5+" value="bed_five" />
        </Picker>

        <Text style={styles.blacktext}>Baths</Text>
        <Picker style={{ width: 100 }}
          mode = 'dropdown'
          selectedValue={this.state.bathlanguage}
          onValueChange={(bathValue, itemIndex) =>this.setState({ bathlanguage: bathValue })}>
          <Picker.Item label="1" value="bath_one" />
          <Picker.Item label="2" value="bath_two" />
          <Picker.Item label="3" value="bath_three" />
          <Picker.Item label="4" value="bath_four" />
          <Picker.Item label="5+" value="bath_five" />
        </Picker>

        <Text style={styles.blacktext}>Amenities Included</Text>
        <ListItem>
          <CheckBox checked={this.state.laundry} onPress={()=>this.setState({laundry: !this.state.laundry})}/>
          <Body>
            <Text>Laundry</Text>
          </Body>
        </ListItem>
        <ListItem>
          <CheckBox checked={this.state.dish} onPress={()=>this.setState({dish: !this.state.dish})}/>
          <Body>
            <Text>Dishwasher</Text>
          </Body>
        </ListItem>
        <ListItem>
          <CheckBox checked={this.state.air} onPress={()=>this.setState({air: !this.state.air})}/>
          <Body>
            <Text>Air-Conditioning</Text>
          </Body>
        </ListItem>
        <ListItem>
          <CheckBox checked={this.state.park} onPress={()=>this.setState({park: !this.state.park})}/>
          <Body>
            <Text>Parking</Text>
          </Body>
        </ListItem>
        <ListItem>
          <CheckBox checked={this.state.dogs} onPress={()=>this.setState({dogs: !this.state.dogs})}/>
          <Body>
            <Text>Dogs Allowed</Text>
          </Body>
        </ListItem>
        <ListItem>
          <CheckBox checked={this.state.cats} onPress={()=>this.setState({cats: !this.state.cats})}/>
          <Body>
            <Text>Cats Allowed</Text>
          </Body>
        </ListItem>


        <Text style={styles.blacktext}>Property Type</Text>
        <ListItem>
          <CheckBox checked={this.state.house}
            onPress={()=>this.setState({house: !this.state.house})} />
          <Body>
            <Text>House</Text>
          </Body>
        </ListItem>
        <ListItem>
          <CheckBox checked={this.state.condo}
            onPress={()=>this.setState({condo: !this.state.condo})} />
          <Body>
            <Text>Condo</Text>
          </Body>
        </ListItem>
        <ListItem>
          <CheckBox checked={this.state.apartment}
            onPress={()=>this.setState({apartment: !this.state.apartment})} />
          <Body>
            <Text>Apartment</Text>
          </Body>
        </ListItem>
        <ListItem>
          <CheckBox checked={this.state.town}
            onPress={()=>this.setState({town: !this.state.town})} />
          <Body>
            <Text>Townhouse</Text>
          </Body>
        </ListItem>

        <View style={{justifyContent: 'center', alignItems: 'center', alignSelf: 'center'}}>
          <Button bordered onPress={() => {this.props.navigation.navigate('rentalapp')} } >
            <Text> Save </Text>
          </Button>
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
  },
  buttonHolder: {
    width: Dimensions.get('window').width,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
  },
  header: {
    textAlign: 'center',
    textAlignVertical: 'center',
    color: 'skyblue',
    fontSize: 24,
  },
  item: {
    padding: 10,
    fontSize: 14,
    height: 44,
  },
  margin: {
    margin: 10,
  },
  slider: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10
  },
});
