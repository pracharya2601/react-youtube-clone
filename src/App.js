import React, { Component } from 'react';
import './App.css';
import { _signUp, _login } from './components/AuthService';
import Chat from './components/Chat.js'
import Youtube from './components/Youtube.js'


// import { Route, BrowserRouter } from "react-router-dom";


// import Signup from './Signup';

// function App() {
//   return (
//     <Signup />
//   )
// }

class App extends Component {
  constructor() {
    super();

    this.state = {

    }

  }

  getToken = () => {
    return localStorage.getItem('token');
  }


  signUp = (event) => {
    event.preventDefault();

    let inputs = event.target.children;
    // let firstname = input[0].value;
    // let lastname = input[1].value;
    let username = inputs[0].value;
    let password = inputs[1].value;
    let passwordConf = inputs[2].value;

    if (password == passwordConf){

      return _signUp(username, password).then(res => {
        console.log(res);
        alert(res.message)
      });

    }else{
      alert('your password and password confirmation have to match!')
    }

  }

  login = (event) => {
    event.preventDefault();

    let inputs = event.target.children;

    let username = inputs[0].value;
    let password = inputs[1].value;

    return _login(username, password).then(res => {
      if (res.token){
        this.setState({logged_in: true}, function(){
          localStorage.setItem('token', res.token);
        });
      }else{
        alert('you were not logged in')
      }
    });
  }

  logout = (event) => {
    event.preventDefault();
    
    this.setState({logged_in: false}, function(){
      localStorage.removeItem('token');
    });
  }


  render() {
    return (
      <div className="App">
        <header>
          <h1>{ this.state.name }</h1>

          {!this.state.logged_in && 
          
          <div className="container">
            <h1>Welcome</h1>
            <h2>Sign Up</h2>
            <form>
            <input class="form-input" type="text" name="firstname" placeholder="First Name" />
              <input class="form-input" type="text" name="lastname" placeholder="Last Name" />
            </form>
            <form id="signUpForm" onSubmit={this.signUp}>
              <input class="form-input" type="text" name="username" placeholder="put in a username" />
              <input class="form-input" type="password" name="password" placeholder="put in a password" />
              <input class="form-input" type="password" name="password" placeholder="confirm your password" />

              <button class="submitButton">Sign Up</button>
              {/* <a href='/login' >have an account</a> */}
            </form>
            {/* < signin /> */}
            <h2>Log In</h2>

            <form id="logInForm" onSubmit={this.login}>
              <input class="form-input" type="text" name="username" placeholder="put in a username" />
              <input class="form-input" type="password" name="password" placeholder="put in a password" />

              <button class="submitButton">Log In</button>
            </form>

            <br /><br /><br />
          </div>}

          {this.state.logged_in && 
            // < home />
          <div>
            <div id="youtube-logo">
              uTUBE
            </div>
            <div>
            <form id="logOutForm" onSubmit={this.logout}>
              <button class="logoutButton">Log Out</button>
            </form>
            </div>
            <div>
            <Youtube />
            </div>

            <div>
            <Chat />
            </div>


          </div>
          }

        </header>
      </div>
    );
  }
}

export default App


// import React from 'react';
// import './App.css';
// import Chat from './components/Chat.js'
// import Youtube from './components/Youtube.js'



// function App() {
//   return (
//     <div>
//     <Chat />
//     <Youtube />
//     </div>
//   )
// }

// export default App;

