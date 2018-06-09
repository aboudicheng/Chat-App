import React, { Component } from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import firebase from '../config/fire'

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            error: ""
        }
        this.handleChange = this.handleChange.bind(this)
        this.Login = this.Login.bind(this)
        this.Signup = this.Signup.bind(this)
    }

    Login(e) {
        e.preventDefault();
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then((u) => {
        }).catch((error) => {
            this.setState({ error: error.message })
        })
    }

    Signup(e) {
        e.preventDefault();
        firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then((u) => {
        }).catch((error) => {
            this.setState({ error: error.message })
        })
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {
        const { error } = this.state
        return (
            <div>
                <div className="Login">
                    <MuiThemeProvider>
                        <TextField
                            floatingLabelText="E-mail"
                            value={this.state.email}
                            onChange={this.handleChange}
                            type="email"
                            name="email"
                        />
                    </MuiThemeProvider><br />
                    <MuiThemeProvider>
                        <TextField 
                            floatingLabelText="Password"
                            value={this.state.password}
                            onChange={this.handleChange}
                            type="password"
                            name="password"
                        />
                    </MuiThemeProvider><br />
                    <MuiThemeProvider><FlatButton type="submit" label="Login" onClick={this.Login} /></MuiThemeProvider>
                    <MuiThemeProvider><FlatButton type="submit" label="Sign Up" onClick={this.Signup} secondary={true} /></MuiThemeProvider>
                    <br />

                    <p>{error}</p>

                </div>
            </div>
        )
    }
}

export default Login;