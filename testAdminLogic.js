import 'dotenv/config';
import { db } from './backend/config/firebase.js';
import { doc, getDoc, getDocs, collection, query, where, setDoc } from 'firebase/firestore';

async function test() {
  const q = await getDocs(collection(db, "users"));
  q.forEach(doc => console.log("User:", doc.id, doc.data().email));
  process.exit(0);
}
test();
