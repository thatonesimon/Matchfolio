import React, { Component } from 'react';
import { Alert, 
         Button, 
         Dimensions, 
         Image, 
         StyleSheet,
         TouchableOpacity,
         Text, 
         View } from 'react-native';
         
export default class Main extends Component {
  
  constructor(props) {
    super(props);

    this._onNotInterestedPressButton = this._onNotInterestedPressButton.bind(this);
    this._onMoreInfoPressButton = this._onMoreInfoPressButton.bind(this);
    this._onInterestedPressButton = this._onInterestedPressButton.bind(this);
    this._onPropertyPress = this._onPropertyPress.bind(this);
  }
  
  state = {
    propertyNumber: "1",
    pAddress: "123 Fake Road",
    pRent: '$1300',
    pNumRooms: '3 Bed/2 Bath',
  }
  
  _onNotInterestedPressButton() {
    //Alert.alert('Gross property');
    this._nextProperty();
  }

  _onMoreInfoPressButton() {
    Alert.alert('Give me more info.');
  }
  
  _onInterestedPressButton() {
    //Alert.alert('Cool property.');
    this._nextProperty();
  }

  _onPropertyPress() {
    Alert.alert('Open property info card with something');
  }
  
  _nextProperty() {
    this.setState({ pAddress: propertyAddress[index] });
    this.setState({ pRent: propertyCost[index] });
    this.setState({ pNumRooms: propertyRooms[index] });
    if(index == 3) {
      index = 0;
    } else {
      index++;
    }
  }
  
  render() {
    return (
      <View style={styles.container}>

        <Text style={styles.header}>MatchFolio</Text>
        <Text>This is some house info</Text>

        <View style={styles.horizontalHolder}>
          <Text style={styles.propertyInfo}>{"Address: \n" + this.state.pAddress}</Text>
          <Text style={styles.propertyInfo}>{"Rent: \n" + this.state.pRent + "/month"}</Text>
          <Text style={styles.propertyInfo}>{"# of Rooms: \n" + this.state.pNumRooms}</Text>
        </View>

        <Text>Amenities</Text>

        <TouchableOpacity onPress={this._onPropertyPress}>
          <Image
            onPress={this._onNotInterestedPressButton}
            style={{borderRadius: 10, width: 400, height: 400}}
            // source = {{uri: "http://pa.cdn.appfolio.com/utopiamanagement/images/2c8b6e70-83f3-41bf-bfd2-79d3d676681f/large.jpg"}}
            source={randomImages[index]} 
            />
        </TouchableOpacity>

        <View style={styles.horizontalHolder}>
          <Button 
            color="#EC7063"
            title='Not Interested'
            onPress={this._onNotInterestedPressButton} />
          <Button 
            color="#5DADE2"
            title='More Info'
            onPress={this._onMoreInfoPressButton} />
          <Button 
            color="#58D68D"
            title='Interested'
            onPress={this._onInterestedPressButton} />
        </View>

      </View>
    );
  }
}

// const property = [
//   { address: '123 Del Playa', rent: "$150/month", numRooms: "3 Bed/2 Bath"},
//   { address: '234 Sabado Tarde', rent: "$150/month", numRooms: "3 Bed/2 Bath"},
//   { address: '123 Trigo', rent: "$150/month", numRooms: "3 Bed/2 Bath"},
//   { address: '234 Sueno', rent: "$150/month", numRooms: "3 Bed/2 Bath"},
// ];

const baseURL = "http://pa.cdn.appfolio.com/utopiamanagement/";

const index = 0;
const propertyAddress = ['123 Del Playa', '234 Pasado', '123 Trigo', '234 Sueno'];
const propertyCost = ["$1000", "$1", "$625", "$3999"];
const propertyRooms = ['4 Bed/2 Bath', '1/2 Bed/0 Bath', '2 Bed/2 Bath', '1 Bed/1 Bath'];
const propertyPicture = ['./res/house.jpg'];

const randomImages = [require("./res/house.jpg"), require("./res/house2.jpg"), require("./res/house3.jpg"), require("./res/house4.jpg")];

const propertyInfo = require("./res/property-info.json");

// <Text style={styles.propertyInfo}>{propertyInfo[0].vhost}</Text>


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  horizontalHolder: {
    width: Dimensions.get('window').width,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  header: {
    color: 'powderblue',
    fontSize: 40,
  },
  propertyInfo: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
  },
});
