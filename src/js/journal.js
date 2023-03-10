// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js';
import { getFirestore, collection, addDoc, query, orderBy, limit, getDocs } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "<REDACTED>",
	authDomain: "ember-d1df3.firebaseapp.com",
	projectId: "ember-d1df3",
	storageBucket: "ember-d1df3.appspot.com",
	messagingSenderId: "769175463067",
	appId: "1:769175463067:web:ec900d28d33c3f62d6523e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

onAuthStateChanged(auth, (user) => {
	if (user) {
		console.log("user logged in");
		// User is signed in, see docs for a list of available properties
		// https://firebase.google.com/docs/reference/js/firebase.User
		const uid = user.uid;
		initJournal(user.uid);
	} else {
		window.location.href = "/login.html";
	}
});

document.getElementById("logout").addEventListener("click", () => {
	signOut(auth).then(() => {
		window.location.href = "/login.html";
	}).catch((error) => {
		console.log("error");
	});
});

let uid = null;

function textareaValue(e) {
	e.preventDefault();
	let get = document.getElementById("new_journal_entry").value;

	// document.getElementById("new_journal_entry").value = "";

	let time = Date.now();

	// TODO add to db
	try {
		addDoc(collection(db, uid), {
			text: get,
			date: time, //MM-DD-YYYY
			sa_score: []
		});
	} catch (e) {
		console.error("Error adding document: ", e);
	}

	document.getElementById("history").innerHTML = `<div class="row">
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">${new Date(time).toDateString()}</h5>
                  <p id = "card_two" class="card-text">${get}</p>
                </div>
              </div>
            </div>`  + document.getElementById("history").innerHTML;

}

document.getElementById("saveentry").addEventListener("click", textareaValue);

function initJournal(u) {
	uid = u;
	let postsRef = collection(db, uid)
	let queryRef = query(postsRef, orderBy("date", "desc"), limit(5));
	console.log(queryRef);
	getDocs(queryRef).then((qdocs) => {
		let ih = "";
		qdocs.forEach((doc) => {
			// doc.id
			// deleteNote(id to delete)
			// <div class="row" id="entry-${doc.id}">
			// onclick="deleteNote(" + doc.id + ")">
			ih += `
              <div class="card" id="entry-${doc.id}">
                <div class="card-body">
                  <h5 class="card-title">${new Date(doc.data().date).toDateString()}</h5>
                  <p id = "card_two" class="card-text">${doc.data().text}</p>
                </div>
              </div>
            </div>`
		});
		document.getElementById("history").innerHTML = ih;
	}, (err) => {
		console.log(error);
	})
}