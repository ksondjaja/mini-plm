import * as React from 'react';
import {
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import Nav from "./Nav";
import Login from './Login';

export class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};

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
        <Nav/>

        <Routes>
          <Route path="/" element={(<Navigate to="/login"/>)} />
          <Route
            exact path="/login"
            element={
              <Login
                state={this.state}
                handleStateChange = {this.handleStateChange.bind(this)}
              />
            }
          />
        </Routes>
      </>
    )
  }
};

export default App;
