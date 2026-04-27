import { admin, bucket } from './config/firebase.js';

async function test() {
  try {
    const defaultBucket = admin.storage().bucket('gwel-5305d.appspot.com');
    const file = defaultBucket.file('test.txt');
    await file.save('hello world', {
      metadata: { contentType: 'text/plain' }
    });
    console.log('Success!');
  } catch (err) {
    console.error('Storage Error:', err.message);
  }
}
test();
