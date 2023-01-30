// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js';

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

onAuthStateChanged(auth, (user) => {
	if (user) {
		console.log("user logged in");
		// User is signed in, see docs for a list of available properties
		// https://firebase.google.com/docs/reference/js/firebase.User
		const uid = user.uid;
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

let quotes = [
	"Take a moment to find a comfortable position.",
	"Notice how your body is feeling in this moment.",
	"Allow any thoughts to flow through your mind. Just let everything be there.",
	"Take a deep breath...",
	"See if you can feel the contact with what's supporting your body right now.",
	"Thoughts or worries might be coming up, and that is totally okay. Allow your awareness to rest back towards your body.",
	"Continue to notice the inhale and exhale.",
	"Take a moment to express gratitude towards yourself for taking time to cultivate this practice.",
	"“When you give joy to other people, you get more joy in return. You should give a good thought to happiness that you can give out.”— Eleanor Roosevelt.",
	"“Success is not final; failure is not fatal: It is the courage to continue that counts.” — Winston S. Churchill.",
	"“Don’t let yesterday take up too much of today.” — Will Rogers",
	"“If you are working on something that you really care about, you don’t have to be pushed. The vision pulls you.” — Steve Jobs.",
	"“Setting goals is the first step in turning the invisible into the visible.” — Tony Robbins.",
	"Get a nice gentle stretch through your neck, spine, and hips.",
	"Bring your focus to your breath.",
	"Let your shoulders relax.",
	"Take a moment to pause and ground yourself. What are three things you can see around you? Two things you can hear? One thing you can touch?",
	"Drop your gaze or close your eyes.",
	"Feel gravity pulling you down, rooting the body, and connecting it to the Earth.",
	"Soften the spine and feel your arms get heavy.",
	"Deepen your breath.",
	"You will be okay.",
	"I believe in you.",
	"Make sure to take a break.",
	"Drink some water!"
];

// set interval function -- callback, interval
// in the callback, fade out old quote, pick random quote, fade back in
// document.getelementByid(...).innerHTMl = aseraewf
setInterval(changeQuote, 10000);

function delay(time) {
	return new Promise(resolve => setTimeout(resolve, time));
}

function changeQuote() {
	// element.innerHTML = "";
	quotesCarousel = document.getElementById("quotes-carousel");
	quotesCarousel.classList.add("transparentquote");
	delay(1000).then(() => {
		quotesCarousel.innerHTML = quotes[Math.floor(Math.random() * quotes.length)];
		quotesCarousel.classList.remove("transparentquote");
	});
}
changeQuote();