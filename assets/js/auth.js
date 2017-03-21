// Initialize Firebase
var config = {
    apiKey: 'AIzaSyC4sIDrmu-pRTkiQM7oIZSXaadzSm_q6Kk',
    authDomain: 'smart-mirror-a2978.firebaseapp.com',
    databaseURL: "https://smart-mirror-a2978.firebaseio.com",
    storageBucket: "smart-mirror-a2978.appspot.com",
    messagingSenderId: "993274322267"
};
var gUser, fireBaseAuth, database;

// Client ID and API key from the Developer Console
var CLIENT_ID = '993274322267-hbj9vaa6g3mian4nerttlk259qj28e1h.apps.googleusercontent.com';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = '' +
    ' https://mail.google.com/ ' +
    ' https://www.googleapis.com/auth/gmail.readonly ' +
	' https://www.googleapis.com/auth/plus.login ' +
        ' https://www.googleapis.com/auth/gmail.modify ' +
	' https://www.googleapis.com/auth/calendar.readonly ' +
	// ' https://www.googleapis.com/auth/gmail.metadata ' +
	' https://www.googleapis.com/auth/user.addresses.read ';

firebase.initializeApp(config);
fireBaseAuth = firebase.auth();
database = firebase.database();

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
	gapi.load('client:auth2', initClient);
}

/**
 * Initializes the API client library and sets up sign-in state listeners.
 */
function initClient() {
	gapi.client.init({
	discoveryDocs : DISCOVERY_DOCS,
		clientId : CLIENT_ID,
		scope : SCOPES,
        fetch_basic_profile : true
	}).then(function() {
		//Listen for sign-in state changes.
		gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

		//Handle the initial sign-in state
		updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
	});
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
	console.log(isSignedIn);
    if (isSignedIn) {

        fireBaseAuth.onAuthStateChanged(function(user) {
            if (user) {
                $("#logCheck").html("Hello " + user.displayName);
                console.log(user);
                gUser = user;
            }
        });


        /**
         * MAKE API CALLS HERE
         */
        getIdList('me', false, 'INBOX', 10);
    } else {
        var btn = $("<button>").text("Login");
        $("#logCheck").html(btn);
        $("#logCheck").on("click", handleAuthClick);
    }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
}

$("#logOut").html($("<button>").text("Log Off")).on("click", handleSignoutClick);