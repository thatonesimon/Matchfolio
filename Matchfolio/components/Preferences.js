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
import { Dropdown } from 'react-native-material-dropdown';
import * as firebase from 'firebase';

export default class Preferences extends React.Component {

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

  rentValuesChange = (values) => {

    this.setState({rentState:values});
  }

  sqftValuesChange = (values) => {

    this.setState({sqftState:values});
  }

  bedValueChange = (value) => {
      console.log(value);
      this.setState({bed: value});
  }

  bathValueChange = (value) => {
      console.log(value);
      this.setState({bath: value});
  }

  static navigationOptions = {
    drawerIcon: ({ tintColor }) => (<Icon name="ios-color-filter-outline" size={15} style={{ color: tintColor }} />),
    header: null,
    gesturesEnabled: false,
  }

  constructor(props) {
    super(props);

    // this.bedRef = this.updateRef.bind(this, 'bed');
    // this.bathRef = this.updateRef.bind(this, 'bath');
    this.renderMenuButton = this.renderMenuButton.bind(this);
    this.saveData = this.saveData.bind(this);
    this.loadData = this.loadData.bind(this);
    this.onSaveButtonPress = this.onSaveButtonPress.bind(this);

    this.state = {
      bed: '1',
      bath: '1',
      rentState: [1500, 5000],
      sqftState: [1500, 5000],
    };
  }

  updateRef(name, ref) {
    this[name] = ref;
  }

  componentWillMount() {
      this.loadData();
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

  async componentWillUnmount() {
      console.log("Leaving preferences");
    await this.saveData();
  }

  loadData() {
    user = firebase.auth().currentUser;
    function setData(snapshot) {
      this.setState(snapshot.val())
    }
    setData = setData.bind(this)
    firebase.database().ref('users/' + user.uid + '/preferences').once('value').then(setData)
  }

  async saveData() {
    user = firebase.auth().currentUser;

    params = this.props.navigation.params;
    if(params && params.signup) {
      this.props.navigation.navigate('rentalapp', {signup: true})
    }
    else {
      //Alert.alert("Preferences Updated")
      // const resetAction = NavigationActions.reset({
      //   index: 0,
      //   actions: [
      //     NavigationActions.navigate({routeName: 'main'})
      //   ]
      // })
      // await this.props.navigation.dispatch(resetAction);
    }

    firebase.database().ref('users/' + user.uid + '/preferences').set(this.state)

  }

  onSaveButtonPress() {
      function okay() {
          const resetAction = NavigationActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({routeName: 'main'})
            ]
          })
          this.props.navigation.dispatch(resetAction);
        }
    okay = okay.bind(this);
    Alert.alert("Preferences Updated", "", [{text: 'OK', onPress: okay}])
  }

  render() {
    let {bed, bath} = this.state;
    return (
      <ScrollView backgroundColor='white'>
        <Header style= {{backgroundColor: 'transparent', borderBottomWidth: 0}}>
          <Left style={{flex: 1}}>
            {this.renderMenuButton()}
          </Left>
          <Body style={{flex: 4, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={styles.header}><Ionicons name="ios-cog" size={40} color="skyblue" padding = {40}/> Preferences</Text>
          </Body>
          <Right style={{flex: 1}} />
        </Header>

        <Text style={styles.blacktext}>Rent</Text>
        <View style={styles.slider}><Text>Min: ${this.state.rentState[0]}</Text><Text>Max: ${this.state.rentState[1]}</Text></View>
        <View style={styles.slider}>
          <MultiSlider
            values={[this.state.rentState[0], this.state.rentState[1]]}
            sliderLength={280}
            onValuesChange={this.rentValuesChange}
            min={500}
            max={10000}
            step={100}
            snapped
            />
        </View>

        <View style={styles.separator} />

        <Text style={styles.blacktext}>Square Feet</Text>
        <View style={styles.slider}><Text>Min: {this.state.sqftState[0]}</Text><Text>Max: {this.state.sqftState[1]}</Text></View>

        <View style={styles.slider}>
          <MultiSlider
            values={[this.state.sqftState[0], this.state.sqftState[1]]}
            sliderLength={280}
            onValuesChange={this.sqftValuesChange}
            min={500}
            max={7500}
            step={250}
            snapped
            />
        </View>

        <View style={styles.separator} />

        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1}}>
            <Text style={styles.blacktext}>Bed</Text>
          </View>
          <View style={styles.numPicker}>
            <Dropdown
              ref={this.bedRef}
              value={this.state.bed}
              onChangeText={this.bedValueChange}
              data={bedData}
              label=" "
              />
          </View>
        </View>

        <View style={styles.separator} />

        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1}}>
            <Text style={styles.blacktext}>Bath</Text>
          </View>
          <View style={styles.numPicker}>
            <Dropdown
              ref={this.bathRef}
              value={this.state.bath}
              onChangeText={this.bathValueChange}
              data={bathData}
              label=" "
              />
          </View>
        </View>

        <View style={styles.separator} />

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

        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: 10, marginBottom: 10}}>
          <Button bordered onPress={this.onSaveButtonPress} style={{flex: 1, marginLeft: 10, marginRight: 10}} >
            <Text style={{flex:1, textAlign: 'center'}}> Save </Text>
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
  numPicker: {
    width: 96,
    paddingLeft: 8,
    borderLeftColor: '#000d',
    borderLeftWidth: 0.5,
  },
  separator: {
    borderBottomColor: '#bbb',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  slider: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10
  },
});

const bedData = [
  { value: '1' },
  { value: '2' },
  { value: '3' },
  { value: '4' },
  { value: '5+' },
];

const bathData = [
  { value: '1' },
  { value: '2' },
  { value: '3' },
  { value: '4' },
  { value: '5+' },
];
