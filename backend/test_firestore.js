import { db } from './config/firebase.js';

async function test() {
  try {
    const snapshot = await db.collection('products').get();
    console.log('Success! Found docs:', snapshot.docs.length);
  } catch (err) {
    console.error('Firestore Error:', err);
  }
}
test();
