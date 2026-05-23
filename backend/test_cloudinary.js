import cloudinary from './config/cloudinary.js';

async function test() {
  console.log('Cloudinary Config:', {
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    has_secret: !!process.env.CLOUDINARY_API_SECRET
  });
  
  if (!process.env.CLOUD_NAME) {
    console.error('Error: CLOUD_NAME is not set in .env');
    return;
  }

  try {
    console.log('Attempting to upload a test image to Cloudinary...');
    const result = await cloudinary.uploader.upload('https://picsum.photos/200');
    console.log('Upload Success! Image URL:', result.secure_url);
    console.log('Deleting uploaded test image...');
    await cloudinary.uploader.destroy(result.public_id);
    console.log('Delete Success!');
  } catch (err) {
    console.error('Cloudinary Error:', err.message || err);
  }
}
test();
