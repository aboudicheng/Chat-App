import firebase from 'firebase'

const config = {
    apiKey: "AIzaSyCXHhQOO8ZRRBan69nNLNdP0qN03VbaJpQ",
    authDomain: "chatapp-7970c.firebaseapp.com",
    databaseURL: "https://chatapp-7970c.firebaseio.com",
    projectId: "chatapp-7970c",
    storageBucket: "",
    messagingSenderId: "842926739051"
};

const Fire = firebase.initializeApp(config);

export default Fire;