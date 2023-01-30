// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js';
import { getFirestore, collection, addDoc, query, orderBy, limit, getDocs, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-firestore.js";

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

function deleteNote(reference) {
	console.log("function called properly with id " + reference);
	deleteDoc(doc(db, uid, reference)).then(() => {
		console.log("Deleted successfully");
		let newId = "entry-" + reference;
		let element = document.getElementById(newId);
		element.parentNode.removeChild(element);

		// File deleted successfully

	}).catch((error) => {
		// Uh-oh, an error occurred!
		console.error(error);
	});
}
module.deleteNote = deleteNote;

function textareaValue(e) {
	e.preventDefault();
	let get = document.getElementById("new_journal_entry").value;

	document.getElementById("new_journal_entry").value = "";

	let time = Date.now();

	// TODO add to db
	try {
		addDoc(collection(db, uid), {
			text: get,
			date: time, //MM-DD-YYYY
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

// document.getElementById("saveentry").addEventListener("click", textareaValue);
function initJournal(u) {
	// Delete the file

	uid = u;
	let postsRef = collection(db, uid)
	let queryRef = query(postsRef, orderBy("date", "desc"));
	console.log(queryRef);
	getDocs(queryRef).then((qdocs) => {
		let ih = "";
		let i = 0;
		qdocs.forEach((doc) => {
			ih = `
              <div class="card" id="entry-${doc.id}">
                <button onclick="
                  console.log('hello');
                  module.deleteNote('${doc.id}');
                  return false;
                ">Delete</button>
                <div class="card-body">
                  <h5 class="card-title">${new Date(doc.data().date).toDateString()}</h5>
                  <p id = "card_two" class="card-text">${doc.data().text}</p>
                </div>
              </div>
            `;
			if (i % 3 == 0) {
				document.getElementById("history1").innerHTML += ih;
			}
			else if (i % 3 == 1) {
				document.getElementById("history2").innerHTML += ih;
			}
			else {
				document.getElementById("history3").innerHTML += ih;
			}
			i++;
		});

	}, (err) => {
		console.log(error);
	})
}