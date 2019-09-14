import * as React from 'react';
import { Constants } from 'expo';
import { TextInput as PTextInput } from 'react-native-paper';
import {
  AppRegistry,
  TouchableNativeFeedback,
  Linking,
  FlatList, AsyncStorage
} from 'react-native';
// You can import from local files
import AssetExample from './components/AssetExample';
import  { Component } from "react";
import { Platform, StyleSheet, Text, View, TextInput, Button, Alert } from "react-native";
// or any pure javascript modules available in npm
import { Card, Paragraph, Title, Headline } from 'react-native-paper';
import {  StatusBar } from 'react-native';
import { DrawerLayoutAndroid, ToolbarAndroid } from 'react-native'
import { TouchableHighlight, Image } from 'react-native';
import { DrawerNavigator } from 'react-navigation'; 

let index = 0;

class DescriptionScreen extends Component {

  constructor(props) {
      super(props)
      this.state = {
        TextInputValue: ''
      }
  }

  buttonClickListener = () => {
      AsyncStorage.setItem('currentDesc', this.state.TextInputValue).then(()=>{
        AsyncStorage.getItem('currentVal')
        .then((val) => {
        if(val) {
          AsyncStorage.getItem('currentDesc')
            .then((desc) => {
              if(desc) {
                AsyncStorage.getItem('array').then((arrStr) =>{

                  var arr = JSON.parse(arrStr).array;
                  arr.push({ val: val, desc: desc, date: new Date().toLocaleDateString("en-US") });
                  var arrObj = { array: arr };

                  AsyncStorage.setItem('array', JSON.stringify(arrObj)).catch(e => { alert("OOPSIE") });
                  AsyncStorage.setItem('currentVal', '');
                  AsyncStorage.setItem('currentDesc', '');
                });
              }
            });
        }
      })
      });
      this.props.navigation.navigate('Check');
  }

  updateSize = (height) => {
    this.setState({
      height
    });
  }

  onClick = () => {
    AsyncStorage.setItem('currentDesc', this.state.TextInputValue);
      this.props.navigation.toggleDrawer();
    }

  render() {
    return (
      <View style={{flex:1, marginTop: StatusBar.currentHeight }}>
      <Toolbar onClick={this.onClick}/>
      <View style={styles.container}>
        <Text style={styles.headerText}>
         Enter Transaction Description
        </Text>

        <PTextInput style={{height:56, width: 375}}
          mode="outlined"
          placeholder="Enter transaction description"
          label="Enter description"
          value={this.state.TextInputValue}
          onChangeText={(TextInputValue) => this.setState({TextInputValue})}
        />
        
        

        <View style={[{ width: "93%", margin: 15, backgroundColor: "red" }]}>
          <Button
          onPress={this.buttonClickListener}
          title="Process"
          color="#00B0FF"
          />
        </View>
      </View>
      </View>
    );
  }
}

class Index extends React.Component {

  onClick = () => {
      this.props.navigation.toggleDrawer();
    }

    constructor(props) {
      super(props)
      this.state = {
        TextInputValue: ''
      }

      AsyncStorage.getItem('array').then(arr=>{
        if(!arr) {
AsyncStorage.setItem('array', '{ "array": [] }').catch((e)=>{alert("something went wrong but thats too bad")});
        }
        
      })
      

    }

  buttonClickListener = () =>{
AsyncStorage.setItem('currentVal', this.state.TextInputValue);
      this.props.navigation.navigate('Desc');
  }

  render() {
    return (
      <View style={{flex:1, marginTop: StatusBar.currentHeight }}>
      <Toolbar onClick={this.onClick}/>
      <View style={styles.container}>
        <Text style={styles.headerText}>
         Enter $ Amount Here
        </Text>



        <PTextInput style={{height:56, width: 375}}
          mode="outlined"
          placeholder="Enter $ amount here"
          label="Enter $ amount here"
          keyboardType='decimal-pad'
          value={this.state.TextInputValue}
          onChangeText={(TextInputValue) => this.setState({TextInputValue})}
        />

        <View style={[{ width: "53%", margin: 15, backgroundColor: "red" }]}>
          <Button
          onPress={this.buttonClickListener}
          title="Process"
          color="#00B0FF"
          />
        </View>
      </View>
      </View>
    );
  }
}

class Toolbar extends React.Component {

 render() {
    return (
      <ToolbarAndroid
        title="Flow"
        titleColor="#fff"
        style={ { shadowColor: 'black', shadowOffset: { width: 10, height: 10 }, elevation: 5, height: 56, backgroundColor: "#3949ab" }}
        navIcon={require('./assets/baseline_menu_white_24dp.png')}
        onIconClicked={ this.props.onClick }
        />
    )
  }
}

const ImagesExample = () => (
  <Image
    source={{
      uri:
        'https://www.3dprint-uk.co.uk/wp-content/uploads/2017/11/check-tick-icon-14141.jpg',
    }}
    style={{ width: 340, height: 300 }}
    
  />
);

class CheckScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      titleText: 'Added Successfully',
      justifyContent: 'center',
    };
  }

  onClick =()=> {
    this.props.navigation.toggleDrawer();
  }

  onPress = () => {
    this.props.navigation.navigate('Home');
  }

  render() {
    return (
      <View style={{flex:1, marginTop: StatusBar.currentHeight }}>
      <Toolbar onClick={this.onClick}/>
      <View style={styles.container}>
      
      <ImagesExample />
        <View style={styles.titleContainer}>
          <Text style={styles.baseText}>
            <Text style={styles.titleText}>
              {this.state.titleText}
              {'\n'}
              {'\n'}
            </Text>
          </Text>
        </View>
        <View style={styles.button2Container}>
          <View style={styles.button}>
            <Button onPress={this.onPress} title="Add Another" />
          </View>
        </View>
      </View></View>
    );
  }
}

class ListScreen extends Component {

  constructor(props) {
    super(props);

    this.state = {
      array: [],
      sum: 0
    }
  }

  onClick = () => {
    this.props.navigation.toggleDrawer();
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener("didFocus", this.updateList);
  }

  componentWillUnmount() {
    this.focusListener.remove();
  }

  updateList = () => { 
    
    AsyncStorage.getItem('array').then((arrStr) => {
        var localArr = JSON.parse(arrStr).array;
        var sum = 0;

        for(var i = 0; i < localArr.length; i++) {
          sum += Number(localArr[i].val);
        }


        this.setState({
          array: JSON.parse(arrStr).array,
          sum: sum
        })
      }
    );
  }

  renderItem = (item) => {
    return (
      <Card style={{margin:16, elevation: 3, width: 375}}>
        <Card.Content>
            <Title>{item.desc}</Title>
            <Paragraph>
              ${item.val}
            </Paragraph>
            <Paragraph>{item.date}</Paragraph>
          </Card.Content>
      </Card>
    );
  }

  render() {

    //get data from storage and put it into array

    return(
    <View style={{flex:1, marginTop: StatusBar.currentHeight }}>
      <Toolbar onClick={this.onClick}/>
      <View style={styles.container}>
        <Card style={{margin:16, elevation: 3, width: 375}}>
        <Card.Content>
            <Title>Total</Title>
            <Paragraph>
              ${this.state.sum}
            </Paragraph>
          </Card.Content>
      </Card>

        <Headline>History</Headline>
        <FlatList 
          data={this.state.array}
          renderItem={({item}) => { return this.renderItem(item) }}
        />
      </View>
    </View>
    );
    
  }
}

class Hidden extends React.Component {
  render() {
    return null;
  }
}

export default DrawerNavigator (
  {
    Home: {
      screen: Index,
    },
    History: {
      screen: ListScreen,

    },
    Desc: {
      screen: DescriptionScreen,
      navigationOptions: {
        drawerLabel: <Hidden />
      }
    },
    Check: {
      screen: CheckScreen,
      navigationOptions: {
        drawerLabel: <Hidden/>
      }
    }
  },
  {
    initialRouteName: 'Home',
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#ffffff"
  },
  headerText: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
    fontWeight: "bold"
  },

  button2Container: {
    flex: 1,
    alignItems: 'center',
    margin: 0,
  },

  titleContainer: {
    marginTop: 40,
    marginBottom: 40,
    justifyContent: 'center',
    alignSelf: 'center',
    alignText: 'center',
  },

  baseText: {
    fontFamily: 'Roboto',
  },

  titleText: {
    fontSize: 30,
    fontWeight: 'bold',
  },

  button: {
    width: '60%',
    height: 40,
  },

});

