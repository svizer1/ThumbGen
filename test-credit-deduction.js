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
const { FieldValue } = require('firebase-admin/firestore');

async function testCreditDeduction() {
  try {
    console.log('🔍 Testing credit deduction via Admin SDK...\n');
    
    // Get first user
    const usersSnap = await db.collection('users').get();
    if (usersSnap.empty) {
      console.log('❌ No users found!');
      return;
    }
    
    const firstUser = usersSnap.docs[0];
    const userData = firstUser.data();
    const userId = firstUser.id;
    
    console.log(`👤 User: ${userId}`);
    console.log(`   Email: ${userData.email}`);
    console.log(`   Current Credits: ${userData.credits}`);
    console.log(`   Total Generations: ${userData.totalGenerations}\n`);
    
    // Simulate credit deduction
    console.log('💳 Simulating credit deduction...');
    const userRef = db.collection('users').doc(userId);
    
    const updateData = {
      totalGenerations: FieldValue.increment(1),
      credits: FieldValue.increment(-1),
      [`modelUsage.test-model`]: FieldValue.increment(1),
    };
    
    await userRef.update(updateData);
    console.log('✅ Update successful!\n');
    
    // Read back
    const updatedDoc = await userRef.get();
    const updatedData = updatedDoc.data();
    
    console.log('📊 Updated User Data:');
    console.log(`   Credits: ${updatedData.credits}`);
    console.log(`   Total Generations: ${updatedData.totalGenerations}`);
    console.log(`   Model Usage:`, updatedData.modelUsage);
    
    // Calculate favorite model
    if (updatedData.modelUsage && Object.keys(updatedData.modelUsage).length > 0) {
      const favoriteModel = Object.entries(updatedData.modelUsage).reduce((a, b) => 
        updatedData.modelUsage[a[0]] > updatedData.modelUsage[b[0]] ? a : b
      )[0];
      
      await userRef.update({ favoriteModel });
      console.log(`   Favorite Model: ${favoriteModel}`);
    }
    
    // Add spending transaction
    console.log('\n💰 Adding spending transaction...');
    await db.collection('users').doc(userId).collection('spending_history').add({
      timestamp: new Date(),
      model: 'test-model',
      source: 'test',
      tokens: 0,
      duration: 5000,
      spent: 1,
      currency: 'credits',
      requestId: 'test-123',
      status: 'success',
    });
    console.log('✅ Transaction added!\n');
    
    // Read spending history
    const spendingSnap = await db.collection('users').doc(userId).collection('spending_history').get();
    console.log(`📈 Spending History: ${spendingSnap.size} transactions`);
    spendingSnap.forEach(doc => {
      const data = doc.data();
      console.log(`   - ${data.model}: ${data.spent} credits, ${data.duration}ms`);
    });
    
    console.log('\n🎉 Credit deduction test successful!');
    console.log('⚠️  If this works but the API does not, the issue is in the API route.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Full error:', error);
  }
}

testCreditDeduction();
