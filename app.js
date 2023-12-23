
import app from './firebase_config.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup  } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, query, where} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js'
// import { getAuth, createUserWithEmailAndPassword } from "./";

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);


provider.addScope('https://www.googleapis.com/auth/contacts.readonly');


const loginForm = document.getElementById('login_page');
const signupForm = document.getElementById('signup_form');


const changePageToLogin = (event) => {
  event.preventDefault();
  if (signupForm.style.display = 'block') {
    signupForm.style.display = 'none';
    loginForm.style.display = 'block';
  }
}

const changePageToSignUp = (event) => {
  event.preventDefault();
  if (loginForm.style.display = 'block') {
    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
  }
}


document.getElementById('toLogin').addEventListener('click', changePageToLogin);
document.getElementById('toSignUp').addEventListener('click', changePageToSignUp);


// SIGNUP SECTION //


const signUp = (event) => {
  event.preventDefault();
  console.log("user is getting registered!")

  const caEmailValue = document.getElementById('inputEmail4').value;
  const caPassValue = document.getElementById('inputPassword4').value;
  const confirmPass = document.getElementById('confirmInputPassword4').value;
  const userName = document.getElementById('firstName').value;


  if (caPassValue == confirmPass) {
    createUserWithEmailAndPassword(auth, caEmailValue, caPassValue, userName)
      .then((userCredential) => {
        // Signed up 
        const user = userCredential.user;
        console.log(user);

        // alert

        Swal.fire({
          icon: "success",
          title: "Successfully Registered",
          text: "You are successfully Registered!"
        });
        // ...
        // create user in firestore database //

        try {
          const docRef = addDoc(collection(db, "users"), {
            first: user.displayName,
            userId: user.uid,
            email: user.email
          });
          console.log("Document written with ID: ", docRef.id);
        } catch (e) {
          console.error("Error adding document: ", e);
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        Swal.fire({
          icon: "error",
          title: errorCode,
          text: errorMessage,
          footer: '<a id="toLogin" href="#">Already Registered? login Here</a>'
        });
        // ..

        
      });
  }
  else {
    alert("Confirm Password must be same!");
  }
}

document.getElementById('createAccount').addEventListener('click', signUp);


  // logIN Section

const logIn =  (event) => {
  event.preventDefault();
  console.log("user is getting loggedIn!")

  const loginEmail = document.getElementById('loginInputEmail4').value;
  const loginPass = document.getElementById('loginInputPassword4').value;

  signInWithEmailAndPassword(auth, loginEmail, loginPass)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    const uId = user.uid;
    // checkIfUserExists(uId);
    console.log(user);
    // Alert
    Swal.fire({
      icon: "success",
      title: "Logged In",
      text: "You are successfully Logged In "
    });
    // ...
    // Getting User // 

    getAllUsers(uId);

        }

    // const querySnapshot = getDocs(collection(db, "users"));
    
//     querySnapshot.forEach((user) => {
//     console.log(`${user.id} => ${user.data()}`);
// });
  )
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode, errorMessage);
    
    Swal.fire({
      icon: "error",
      title: errorCode,
      text: errorMessage,
      footer: "<a id='toSignup' href='#'>Don't Have account? Create Here</a>"
    });
  });
}
document.getElementById('logIn_btn').addEventListener('click', logIn);


//  Getting Current User after Login //

const usersCollection = collection(db, 'users');

async function getAllUsers(uid) {
  try {
    const querySnapshot = await getDocs(usersCollection);

    // Extract data from the query snapshot
    const usersData = querySnapshot.docs.map(doc => doc.data());

    // Log or use the entire collection
    // console.log('All users:', usersData);

    const currentUser = usersData.find((uid) => uid == uid)
    console.log(currentUser);

    return currentUser;
  } catch (error) {
    console.error('Error getting collection:', error);
    throw error;
  }
}



//  Google Login 

const logInWithGoogle = (event) => {

  event.preventDefault();
signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    console.log(token);
    const user = result.user;
    console.log(user);
    // IdP data available using getAdditionalUserInfo(result)
    // ...
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    console.log(errorCode, errorMessage, email, credential);
    // ...
  });

}

document.getElementById('google_login').addEventListener('click', logInWithGoogle);
