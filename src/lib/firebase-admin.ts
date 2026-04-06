import * as admin from 'firebase-admin';

console.log('Initializing Firebase Admin...');
console.log('FIREBASE_ADMIN_PROJECT_ID:', process.env.FIREBASE_ADMIN_PROJECT_ID ? 'SET' : 'NOT SET');
console.log('FIREBASE_ADMIN_CLIENT_EMAIL:', process.env.FIREBASE_ADMIN_CLIENT_EMAIL ? 'SET' : 'NOT SET');
console.log('FIREBASE_ADMIN_PRIVATE_KEY:', process.env.FIREBASE_ADMIN_PRIVATE_KEY ? 'SET (length: ' + process.env.FIREBASE_ADMIN_PRIVATE_KEY.length + ')' : 'NOT SET');

if (!admin.apps.length) {
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');
  
  if (!process.env.FIREBASE_ADMIN_PROJECT_ID || !process.env.FIREBASE_ADMIN_CLIENT_EMAIL || !privateKey) {
    console.error('Firebase Admin credentials are missing!');
    throw new Error('Firebase Admin credentials are not configured');
  }
  
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
  });
  console.log('Firebase Admin initialized successfully');
} else {
  console.log('Firebase Admin already initialized');
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();

console.log('Firebase Admin exports ready');

export default admin;
