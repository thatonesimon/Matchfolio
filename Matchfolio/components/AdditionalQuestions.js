import React, { Component } from 'react';
import { Alert, Dimensions, Image, ScrollView, StyleSheet, } from 'react-native';
import { Button,
         Drawer,
         Container,
         Header,
         View,
         DeckSwiper,
         Card,
         CardItem,
         Thumbnail,
         Text,
         Spinner, } from 'native-base';


export default class AdditionalQuestions extends Component {

    constructor(props) {
        super(props);
        if(this.props.navigation.state.params) {
          questions = this.props.navigation.state.params.questions;
        }
    }

    render() {
        return (
            <ScrollView>
                <Text>This property has additional questions on it's application!</Text>
            </ScrollView>

        )
    }



}
