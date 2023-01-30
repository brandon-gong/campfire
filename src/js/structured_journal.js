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
	let new_text = document.getElementById("prompts-carousel").textContent;
	new_text += ": " + get;

	let time = Date.now();

	try {
		addDoc(collection(db, uid), {
			text: new_text,
			date: time, //MM-DD-YYYY
		});
		document.getElementById("success").innerHTML = "Your log was successfully uploaded! Feel free to get another prompt or review past entries."
	} catch (e) {
		console.error("Error adding document: ", e);
	}

	//   document.getElementById("history").innerHTML = `<div class="row">
	//               <div class="card">
	//                 <div class="card-body">
	//                   <h5 class="card-title">${new Date(time).toDateString()}</h5>
	//                   <p id = "card_two" class="card-text">${get}</p>
	//                 </div>
	//               </div>
	//             </div>`  + document.getElementById("history").innerHTML;

}

// This is to display a randomly selected prompt
let prompts = [
	"Tell me about your day",
	"What are 3 good things that happened today?",
	"What are some things you want to work on tomorrow?",
	"What's one long term goal, and how are you working towards it?",
	"Tell me about what emotions you're experiencing and why?",
	"What is something you want to learn more about?",
	"What or who is something you're grateful for?",
	"What's the best compliment you've ever gotten?",
	"Write me a short story :)",
	"How are you practicing setting your boundaries?"
];


var countDownDate = new Date().getTime() + 122000;

function changePrompt() {
	countDownDate = new Date().getTime() + 122000;
	let quotesCarousel = document.getElementById("prompts-carousel");
	// quotesCarousel.classList.add("transparentquote");
	// delay(1000).then(() => {
	quotesCarousel.innerHTML = prompts[Math.floor(Math.random() * prompts.length)];
	// quotesCarousel.classList.remove("transparentquote");
	// });
	document.getElementById("success").innerHTML = "";
}
// changePrompt();

// This is to display a countdown timer

// Set the date we're counting down to
changePrompt();

// Update the count down every 1 second
var x = setInterval(function () {

	// Get today's date and time
	var now = new Date().getTime();

	// Find the distance between now and the count down date
	var distance = countDownDate - now;

	// Time calculations for days, hours, minutes and seconds
	//   var days = Math.floor(distance / (1000 * 60 * 60 * 24));
	//   var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
	var seconds = Math.floor((distance % (1000 * 60)) / 1000);

	// Display the result in the element with id="demo"
	document.getElementById("demo").innerHTML = minutes + "m " + seconds + "s ";

	// If the count down is finished, write some text
	if (distance < 0) {
		clearInterval(x);
		document.getElementById("demo").innerHTML = "Press save your entry! If you want a new prompt, click on 'Generate New Prompt'."
	}
}, 1000);

document.getElementById("newprompt").addEventListener("click", changePrompt);

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
                <button onclick = "deleteNote(${doc.id})">Delete</button>
                <div class="card-body">
                  <h5 class="card-title">${new Date(doc.data().date).toDateString()}</h5>
                  <p id = "card_two" class="card-text">${doc.data().text}</p>
                </div>
              </div>
            </div>`
		});
		//   document.getElementById("history").innerHTML = ih;
	}, (err) => {
		console.log(error);
	})
}