import dotenv from 'dotenv';
import mongoose from 'mongoose';
import AIConfig from './src/database/models/AIConfig.js';

// Load environment variables
dotenv.config();

const updateAIModels = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Update Groq model configuration
    const groqUpdate = await AIConfig.findOneAndUpdate(
      { id: 'groq' },
      {
        id: 'groq',
        name: 'Groq',
        description: 'Fast inference with GPT OSS 20B model',
        icon: '⚡',
        color: 'from-orange-500 to-red-500',
        apiKey: '', // Will be set by admin
        isEnabled: false,
        status: 'inactive'
      },
      { 
        upsert: true, 
        new: true,
        setDefaultsOnInsert: true
      }
    );

    console.log('✅ Updated Groq model configuration:', groqUpdate.name);

    // Ensure other default models exist
    const defaultModels = [
      {
        id: 'openai',
        name: 'OpenAI',
        description: 'ChatGPT 3.5 Turbo and GPT-4',
        icon: '🤖',
        color: 'from-green-500 to-emerald-500'
      },
      {
        id: 'deepseek',
        name: 'DeepSeek',
        description: 'Advanced reasoning and code generation',
        icon: '🧠',
        color: 'from-purple-500 to-indigo-500'
      },
      {
        id: 'gemini',
        name: 'Gemini',
        description: 'Google\'s multimodal AI model',
        icon: '✨',
        color: 'from-blue-500 to-cyan-500'
      }
    ];

    for (const model of defaultModels) {
      await AIConfig.findOneAndUpdate(
        { id: model.id },
        {
          ...model,
          apiKey: '',
          isEnabled: false,
          status: 'inactive'
        },
        { 
          upsert: true, 
          new: true,
          setDefaultsOnInsert: true
        }
      );
      console.log(`✅ Ensured ${model.name} model exists`);
    }

    console.log('✅ AI models update completed successfully!');
    console.log('Now you can configure API keys in /admin/dashboard/ai-config');
    
  } catch (error) {
    console.error('❌ Error updating AI models:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

updateAIModels();
