import React, { Component } from 'react'
import firebase from '../config/fire'

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
        }
        this.handleChange = this.handleChange.bind(this)
        this.Login = this.Login.bind(this)
        this.Signup = this.Signup.bind(this)
    }

    Login(e) {
        e.preventDefault();
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then((u) => {
        }).catch((error) => {
            console.log(error)
        })
    }

    Signup(e) {
        e.preventDefault();
        firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then((u) => {
        }).catch((error) => {
            console.log(error)
        })
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {
        return (
            <div>
                <div className="Login">
                    <input value={this.state.email} onChange={this.handleChange} type="email" name="email" placeholder="Enter your email" />
                    <input value={this.state.password} onChange={this.handleChange} type="password" name="password" placeholder="Enter your password" />
                    <button type="submit" onClick={this.Login}>Login</button>
                    <button type="submit" onClick={this.Signup}>Sign Up</button>
                </div>
            </div>
        )
    }
}

export default Login;