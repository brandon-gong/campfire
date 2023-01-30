// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js';
import { getFirestore, collection, doc, addDoc, query, orderBy, limit, getDocs, updateDoc } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-firestore.js";

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
		init(user.uid);
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
let unscored = [];
let scored = [];
let scores = [];

function init(u) {
	unscored = [];
	scored = [];
	scores = [];
	uid = u;

	let postsRef = collection(db, uid)
	let queryRef = query(postsRef, orderBy("date", "desc"));
	console.log(queryRef);
	getDocs(queryRef).then((qdocs) => {
		let ih = "";

		qdocs.forEach((doc) => {
			if (!doc.data().sa_score || doc.data().sa_score.length === 0) unscored.push(doc);
			else {
				scored.push(doc);
				scores.push([doc.data().date, doc.data().sa_score[0]]);
			}
		});
		setupUI();
	}, (err) => {
		console.log(error);
	})
}

function setupUI() {
	let ue = document.getElementById("unscored-entries");
	let se = document.getElementById("scored-entries");
	ue.innerHTML = "";
	se.innerHTML = "";
	for (const unscoredDoc of unscored) {
		ue.innerHTML += `<div class="row">
							<div class="card">
								<div class="card-body">
									<h5 class="card-title">${new Date(unscoredDoc.data().date).toDateString()}</h5>
									<p id = "card_two" class="card-text">${unscoredDoc.data().text}</p>
								</div>
							</div>
						</div>`;
	}
	for (const scoredDoc of scored) {
		se.innerHTML += `<div class="row">
							<div class="card">
								<div class="card-body">
									<h5 class="card-title">${new Date(scoredDoc.data().date).toDateString()}</h5>
									<p id = "card_two" class="card-text">${scoredDoc.data().sa_score[0]}</p>
								</div>
							</div>
						</div>`;
	}

	doplot();
}

document.getElementById("analyzebtn").addEventListener("click", (e) => {
	e.preventDefault();
	for (const unscoredDoc of unscored) {
		fetch(`http://macbook-pro-284.devices.brown.edu:5000/w/${btoa(unscoredDoc.data().text)}`)
			.then((res) => res.json())
			.then((json) => {
				try {
					updateDoc(doc(db, uid, unscoredDoc.id), { sa_score: [parseFloat(json["sentiment"])] });
					scores.push([unscoredDoc.data().date, parseFloat(json["sentiment"])]);
				} catch (e) {
					console.log(e);
				}
			});
	}
	init(uid);
})
// [[12351325324, 0.5], [3532535326, 0.8]]
function doplot() {
	console.log(scores);
	let xc = []
	let yc = []
	for (const pair of scores) {
		xc.push(pair[0])
		yc.push(pair[1])
	}
	// let x_range = Math.max(xc)
	// let y_range = Math.max(yc)
	console.log(xc)
	console.log(yc)

	let TESTER = document.getElementById('tester');

	Plotly.newPlot(TESTER, [{
		x: xc,
		y: yc
	}], {
		margin: { t: 0 }, xaxis: {
			showticklabels: false
		}, yaxis: {
			showticklabels: false
		}
	});

}