// firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, push } from "firebase/database";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD7CttbGSu0wkn7p1OyKGNkvy_gHbGkSKc",
  authDomain: "gymchat-5da9c.firebaseapp.com",
  databaseURL: "https://gymchat-5da9c-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "gymchat-5da9c",
  storageBucket: "gymchat-5da9c.firebasestorage.app",
  messagingSenderId: "501318419025",
  appId: "1:501318419025:web:f73e8998a20215683a6e70",
  measurementId: "G-BEQZCE60MD"
};


const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Sửa lại hàm getData để trả về Promise
const getData = (path) => {
  return new Promise((resolve, reject) => {
    const dataRef = ref(db, path);
    onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      resolve(JSON.stringify(data));  // Trả về dữ liệu khi đã lấy xong
    }, (error) => {
      reject("Error fetching data: " + error);  // Xử lý lỗi nếu có
    });
  });
};

const addDataToFirebase = async (refPath, value) => {
  const dbRef = ref(db, refPath);
  try {
    await push(dbRef, value);
  } catch (error) {
    console.error("Error adding data:", error);
  }
};

export { app, db, getData, addDataToFirebase };
