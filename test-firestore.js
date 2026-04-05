const admin = require('firebase-admin');

// Initialize Firebase Admin
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: privateKey,
  }),
});

const db = admin.firestore();

async function testFirestore() {
  try {
    console.log('🔍 Testing Firestore connection via Admin SDK...');
    
    // Try to write a test document
    const testDoc = {
      test: true,
      timestamp: new Date(),
      message: 'Test document from Admin SDK',
    };
    
    const docRef = await db.collection('test_connection').add(testDoc);
    console.log('✅ Write successful! Document ID:', docRef.id);
    
    // Try to read it back
    const docSnap = await docRef.get();
    console.log('✅ Read successful! Data:', docSnap.data());
    
    // Clean up
    await docRef.delete();
    console.log('✅ Cleanup successful!');
    
    // List all users
    console.log('\n👥 Checking users collection...');
    const usersSnap = await db.collection('users').get();
    console.log(`Found ${usersSnap.size} user documents`);
    
    usersSnap.forEach(doc => {
      const data = doc.data();
      console.log(`\nUser: ${doc.id}`);
      console.log(`  Email: ${data.email}`);
      console.log(`  Credits: ${data.credits}`);
      console.log(`  Total Generations: ${data.totalGenerations}`);
      console.log(`  Favorite Model: ${data.favoriteModel || 'none'}`);
      console.log(`  Model Usage:`, data.modelUsage || {});
      
      // Check subcollections
      db.collection('users').doc(doc.id).collection('spending_history').get().then(snap => {
        console.log(`  Spending History: ${snap.size} transactions`);
        if (snap.size > 0) {
          snap.forEach(tx => {
            console.log(`    - ${tx.data().model}: ${tx.data().spent} credits, ${tx.data().duration}ms`);
          });
        }
      });
    });
    
    console.log('\n🎉 Firestore is working correctly via Admin SDK!');
    
  } catch (error) {
    console.error('❌ Firestore test failed:', error.message);
    console.error('Full error:', error);
  }
}

testFirestore();
