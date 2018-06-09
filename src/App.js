import React, { Component } from 'react';
import firebase from './config/fire'
import Login from './Login/login'
import Home from './Homepage/home'
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
    }
    this.authListener = this.authListener.bind(this)
  }

  componentDidMount() {
    this.authListener();
  }

  authListener() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user })
      }
      else {
        this.setState({ user: null})
      }
    })
  }

  render() {
    return (
      <div className="App">
        {this.state.user ? <Home /> : <Login />}
      </div>
    );
  }
}

export default App;
