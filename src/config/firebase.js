// import { initializeApp } from "firebase/app";

import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signOut} from 'firebase/auth'
import { collection, doc, getDocs, getFirestore, query, setDoc, where } from 'firebase/firestore'
import { toast } from "react-toastify";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBoxHLo_AQ78vMelPzZBJG7z5qH8I3XZuw",
  authDomain: "chat-app-gs-56c04.firebaseapp.com",
  projectId: "chat-app-gs-56c04",
  storageBucket: "chat-app-gs-56c04.appspot.com",
  messagingSenderId: "792802642292",
  appId: "1:792802642292:web:cf05914f85f030002dc421"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// const firebaseConfig = {
//   apiKey: "YOUR_API_KEY",
//   authDomain: "YOUR_AUTH_DOMAIN",
//   projectId: "YOUR_PROJECT_ID",
//   storageBucket: "YOUR_STORAGE_BUCKET",
//   messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
//   appId: "YOUR_APP_ID"
// };

// const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signup = async (username, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    console.log("User creation response:", res); // Debugging log
    const user = res.user;
    console.log("User ID:", user.uid); // Debugging log

    await setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      username: username.toLowerCase(),
      email,
      name: "",
      avatar: "",
      bio: "Hey there, I am using CHAT-APP",
      lastSeen: Date.now()
    });

    await setDoc(doc(db, "chats", user.uid), {
      chatsData: []
    });

    console.log("User data added to Firestore successfully.");
  } catch (error) {
    console.error("Error:", error);
    toast.error(error.code.split('/')[1].split('-').join(" "));
  }
};

const login=async (email,password)=>{
    try {
        await signInWithEmailAndPassword(auth,email,password);
    } catch (error) {
        console.error(error);
        toast.error(error.code.split('/')[1].split('-').join(" "));
        
    }
}

const logout= async ()=>{
    try {
        await signOut(auth);
    } catch (error) {
        console.error(error);
        toast.error(error.code.split('/')[1].split('-').join(" "));
        
    }
    // await signOut(auth)
}

const resetPass = async (email) => {
    if (!email) {
        toast.error("Enter your email")
        return null
    }
    try {
        const userRef = collection(db, "users")
        const q = query(userRef, where("email", "==", email))
        const querySnap = await getDocs(q)
        if (!querySnap.empty) {
            await sendPasswordResetEmail(auth,email)
            toast.success("Reset Email Sent")
        }
        else {
            toast.error("Email doesn't exists")
        }
    } catch (error) {
        console.error(error)
        toast.error(error.message)
    }
   
}

export { signup ,login,logout,auth,db ,resetPass};
