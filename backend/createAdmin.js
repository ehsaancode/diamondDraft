import { admin } from './config/firebase.js';

const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.log('Usage: node createAdmin.js <email> <password>');
  process.exit(1);
}

const createAdminUser = async () => {
  try {
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      displayName: 'Admin User',
    });
    console.log(`Successfully created new admin user with UID: ${userRecord.uid}`);
    process.exit(0);
  } catch (error) {
    console.error('Error creating new user:', error.message || error);
    process.exit(1);
  }
};

createAdminUser();
