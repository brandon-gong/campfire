// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js';

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

let emailElt = document.getElementById("email");
let passElt = document.getElementById("password");
let errorMsg = document.getElementById("error-message");
function attemptCreate() {
	if (!emailElt.value) {
		// TODO add css class
		emailElt.classList.add("input-error");
		errorMsg.innerHTML = "Email field cannot be blank."
	} else if (!passElt.value) {
		passElt.classList.add("input-error");
		errorMsg.innerHTML = "Password field cannot be blank."
	} else {
		createUserWithEmailAndPassword(auth, emailElt.value, passElt.value)
			.then((userCredential) => {
				// Signed in
				let user = userCredential.user;
				window.location.href = "/index.html";
			})
			.catch((error) => {
				emailElt.classList.add("input-error");
				passElt.classList.add("input-error");
				errorMsg.innerHTML = error.message;
			});
	}
}
//document.getElementById("create-btn").addEventListener("click", attemptCreate);
emailElt.addEventListener("keypress", (e) => {
	if (e.key === "Enter") {
		e.preventDefault();
		passElt.focus();
	}
})
passElt.addEventListener("keypress", (e) => {
	if (e.key === "Enter") {
		e.preventDefault();
		attemptCreate();
	}
})

document.getElementById("create").addEventListener("click", attemptCreate);
