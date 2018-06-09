import React, { Component } from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Delete from 'material-ui/svg-icons/action/delete';
import firebase from '../config/fire'

class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            messages: [],
            open: false
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
    }

    componentWillMount() {
        const messagesRef = firebase.database().ref('messages')
            .orderByKey()
            .limitToLast(100);

        messagesRef.on('child_added', snapshot => {
            const message = { text: snapshot.val().text, user: snapshot.val().user, id: snapshot.key };

            this.setState(prevState => ({
                messages: [...prevState.messages, message],
            }));
        });

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
        const messageRef = firebase.database().ref('messages')

        //messageRef.push(input)
        const key = messageRef.push(input).key

        if (input !== "") {
            messageRef.on("child_added", function (snapshot) {
                if (snapshot.key === key) {
                    messageRef.child(key).set({ text: input, user: firebase.auth().currentUser.email })
                    //const message = { text: snapshot.val().text, user: snapshot.val().user, id: snapshot.key };
                }
            }, function (errorObject) {
                console.log("The read failed: " + errorObject.code);
            });

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

        return (
            <div>
                <h3>Home</h3>
                <h4><MuiThemeProvider><FlatButton className="logout" backgroundColor="#a4c639" label="Logout" primary={true} onClick={this.Logout} /></MuiThemeProvider></h4>
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
                        {this.state.messages.map(message =>
                            <li className="chat right" key={message.id} onClick={() => this.deleteMessage(message.id)}><p>{message.user}</p><br />{message.text}</li>
                        )}
                        <div style={{ float: "left", clear: "both" }}
                            ref={(el) => { this.messagesEnd = el; }}>
                        </div>
                    </ul>
                    <form onSubmit={this.onAddMessage} className="input">
                        <input autoFocus type="text" ref={node => this.input = node} />
                        <input type="submit" onClick={this.focusText} />
                    </form>
                </div>
            </div>
        )
    }
}

export default Home;