import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const fixChatIndex = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('chats');

    // Drop the problematic index
    try {
      await collection.dropIndex('messages.message_id_1');
      console.log('✅ Dropped problematic messages.message_id_1 index');
    } catch (error) {
      if (error.code === 27) {
        console.log('ℹ️ Index messages.message_id_1 does not exist (already dropped)');
      } else {
        console.log('⚠️ Error dropping index:', error.message);
      }
    }

    // Clear any existing chat documents with null message_id values
    const result = await collection.updateMany(
      { 'messages.message_id': null },
      { $pull: { messages: { message_id: null } } }
    );
    
    if (result.modifiedCount > 0) {
      console.log(`✅ Cleaned up ${result.modifiedCount} documents with null message_id`);
    } else {
      console.log('ℹ️ No documents with null message_id found');
    }

    console.log('✅ Chat index fix completed successfully!');
    
  } catch (error) {
    console.error('❌ Error fixing chat index:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

fixChatIndex();
