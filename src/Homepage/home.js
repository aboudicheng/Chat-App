import React, { Component } from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Delete from 'material-ui/svg-icons/action/delete';
import CircularProgress from 'material-ui/CircularProgress';
//import ContentSend from 'material-ui/svg-icons/content/send';
import firebase from '../config/fire'

class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            messages: [],
            open: false,
            isLoading: true,
            user: "",
        };

        this.onAddMessage = this.onAddMessage.bind(this);
        this.deleteMessage = this.deleteMessage.bind(this);
        this.deleteAll = this.deleteAll.bind(this);
        this.focusText = this.focusText.bind(this);
        this.Logout = this.Logout.bind(this)
    }

    //open <Dialog />
    handleOpen = () => {
        this.setState({ open: true });
    };

    //close <Dialog />
    handleClose = () => {
        this.setState({ open: false });
    };

    Logout() {
        firebase.auth().signOut();
    }

    componentDidMount() {
        this.scrollToBot();
        //change user in the state to display user email
        firebase.auth().onAuthStateChanged((user) => {
            this.setState({ user: user.email })
        })
    }

    componentWillMount() {
        const messagesRef = firebase.database().ref('messages')
            .orderByKey()
            .limitToLast(100);

        let message

        //if there's nothing in the database, then do not show the loading icon
        messagesRef.on('value', snapshot => {
            if (!snapshot.exists()) {
                this.setState({
                    isLoading: false,
                })
            }
        })

        //load all previous conversations from the database
        messagesRef.on('child_added', snapshot => {
            if (typeof snapshot.val() === 'object') {
                message = { text: snapshot.val().text, user: snapshot.val().user, id: snapshot.key };

                this.setState(prevState => ({
                    messages: [...prevState.messages, message],
                    isLoading: false,
                }));
            }
        });

        //add new messages when added
        messagesRef.on('child_changed', snapshot => {
            message = { text: snapshot.val().text, user: snapshot.val().user, id: snapshot.key };
            this.setState(prevState => ({
                messages: [...prevState.messages, message],
            }));
        })

    }

    componentDidUpdate() {
        this.scrollToBot();
    }

    //scroll to bottom of the chatroom
    scrollToBot() {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    }

    onAddMessage(event) {
        event.preventDefault();
        const input = this.input.value
        const messagesRef = firebase.database().ref('messages')

        let message
        const key = messagesRef.push(input).key

        if (input !== "") {
            messagesRef.on("child_added", snapshot => {
                if (snapshot.key === key) {
                    //update the database
                    messagesRef.child(key).set({ text: input, user: firebase.auth().currentUser.email })
                    //variable for updating the state
                    message = { text: snapshot.val(), user: firebase.auth().currentUser.email, id: snapshot.key };
                }
            }, function (errorObject) {
                console.log("The read failed: " + errorObject.code);
            });

            //somehow there appears to be an extra empty element in the array
            //so update the state without including the last element
            this.setState(prevState => ({
                messages: [...prevState.messages.slice(0, -1), message],
            }));

            //clear input
            this.input.value = '';
        }
    }

    deleteMessage(e) {
        const newState = this.state.messages.filter((item) => {
            return item.id !== e
        })
        this.setState({ messages: newState })
        firebase.database().ref('messages').child(e).remove();
    }

    deleteAll() {
        //clear state
        this.setState({ messages: [] });
        firebase.database().ref('messages').remove();
        this.handleClose();
    }

    focusText() {
        this.input.focus();
    }

    render() {
        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onClick={this.handleClose}
            />,
            <FlatButton
                label="Yes"
                primary={true}
                onClick={this.deleteAll}
            />,
        ];

        let side;
        const { isLoading } = this.state

        return (
            <div>
                <h3>Home</h3>
                <h4>Logged in as: {this.state.user}</h4>
                <h4><MuiThemeProvider><FlatButton className="logout" backgroundColor="#a4c639" label="Logout" secondary={true} onClick={this.Logout} /></MuiThemeProvider></h4>
                <div className="chatroom">
                    <h3>Ping's Chat App <MuiThemeProvider><Delete className="delete" onClick={this.handleOpen} /></MuiThemeProvider>
                        <MuiThemeProvider>
                            <Dialog
                                actions={actions}
                                modal={false}
                                open={this.state.open}
                                contentStyle={{ width: "30%" }}
                                onRequestClose={this.handleClose}
                            >
                                Delete every message?
                            </Dialog>
                        </MuiThemeProvider>
                    </h3>
                    <ul className="chats" ref="chats">
                        <MuiThemeProvider>{isLoading ? <CircularProgress size={50} thickness={4} /> : <div></div>}</MuiThemeProvider>
                        {this.state.messages.map(message =>
                            <div>
                                <div style={{ display: "none" }}>{message.user === firebase.auth().currentUser.email ? side = "right" : side = "left"}</div>
                                <li className={`chat ${side}`} key={message.id} onClick={() => this.deleteMessage(message.id)}><p style={{ fontWeight: "bold" }}>{message.user}</p><br /><div className="text">{message.text}</div></li>
                            </div>
                        )}
                        <div style={{ float: "left", clear: "both" }}
                            ref={(el) => { this.messagesEnd = el; }}>
                        </div>
                    </ul>
                    <form onSubmit={this.onAddMessage} className="input">
                        <input className="message_input" autoFocus type="text" ref={node => this.input = node} />
                        {/* <input type="submit" onClick={this.focusText} /> */}
                    </form>
                </div>
            </div>
        )
    }
}

export default Home;