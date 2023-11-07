import * as React from 'react';
import {
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import Nav from "./Nav";
import Login from './Login';
import Home from './Home';

export class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: false,
    };

    this.logIn = event => {
      const state = this.state

      this.setState({
        ...state,
        loggedIn: true
      });
    }

    this.logOut = event => {
      const state = this.state

      this.setState({
        ...state,
        loggedIn: false
      });
    }

    this.handleStateChange = event => {
      const state = this.state
      const value = event.target.value;

      this.setState({
        ...state,
        [event.target.name]: value
      });
    }
  }

  render(){
    return (
      <>
        <Nav
          state={this.state}
          logOut = {this.logOut.bind(this)}
        />

        <Routes>
          <Route path="/"
            element={
                this.state.loggedIn ?
                  <Navigate to="/home"/>
                : 
                  <Navigate to="/login"/>
              }
          />

          <Route
            exact path="/login"
            element={
              this.state.loggedIn?
                <Navigate to="/home"/>
              :
                <Login
                  state={this.state}
                  logIn = {this.logIn.bind(this)}
                  handleStateChange = {this.handleStateChange.bind(this)}
                />
            }
          />

          <Route
            exact path="/home"
            element={
              this.state.loggedIn ?
                <Home
                  state={this.state}
                  handleStateChange = {this.handleStateChange.bind(this)}
                />
              :
                <Navigate to="/login"/>
            }
          />
        </Routes>
      </>
    )
  }
};

export default App;
