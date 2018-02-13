import React, { Component } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';
import { Button, Container, Text, Form, Item, Label, View } from 'native-base';


export default class AdditionalQuestions extends Component {

    constructor(props) {
        super(props);
        if(this.props.navigation.state.params) {
          questions = this.props.navigation.state.params.questions.split("~");
        }
        additionalQuestions = "This property has additional questions on it's application!";
    }

    _apply() {
        Alert.alert("Your application has been completed!");
        this.props.navigation.navigate('main');
    }

    render() {
        return (
            <ScrollView style={styles.holder}>
                <Text>{additionalQuestions}</Text>
                <Form style={styles.form}>
                {questions.map(question => (
                    <Item floatingLabel key={question}>
                      <Label>{question}</Label>
                    </Item>
                ))}
                </Form>
                <View style={{flexDirection: 'row', flex: 1}}>
                    <Button success style={{flex: 1}} onPress={() => this._apply() } >
                      <Text style={{textAlign: 'center'}}>Apply to Property</Text>
                    </Button>
                </View>
            </ScrollView>

        );
    }
}

const styles = StyleSheet.create({
    holder: {
        flex: 1,
        margin: 10,
    },
    form: {
        marginTop: 10,
        marginBottom: 10,
        borderWidth: 1,
        backgroundColor: '#eef8fd',
        borderRadius: 5,
        paddingBottom: 10,
        paddingRight: 10,
    },
});
