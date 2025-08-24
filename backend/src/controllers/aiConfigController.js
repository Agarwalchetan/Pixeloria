import AIConfig from '../database/models/AIConfig.js';
import crypto from 'crypto';
import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';

// Encryption key for API keys (in production, use environment variable)
const ENCRYPTION_KEY = process.env.AI_ENCRYPTION_KEY || 'pixeloria-ai-key-32-chars-long!!';
const ALGORITHM = 'aes-256-cbc';

// Encrypt API key
const encrypt = (text) => {
  try {
    const iv = crypto.randomBytes(16);
    const key = crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
  } catch (error) {
    logger.error('Encryption error:', error);
    throw new Error('Failed to encrypt API key');
  }
};

// Decrypt API key
const decrypt = (text) => {
  try {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = textParts.join(':');
    const key = crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32);
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    logger.error('Decryption error:', error);
    return '';
  }
};

// Test AI model API key
export const testAIModel = async (modelId, apiKey) => {
  try {
    let testUrl, testHeaders;

    switch (modelId) {
      case 'openai':
        testUrl = 'https://api.openai.com/v1/models';
        testHeaders = {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        };
        break;

      case 'groq':
        testUrl = 'https://api.groq.com/openai/v1/models';
        testHeaders = {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        };
        break;

      case 'deepseek':
        testUrl = 'https://api.deepseek.com/v1/models';
        testHeaders = {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        };
        break;

      case 'gemini':
        testUrl = `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`;
        testHeaders = {
          'Content-Type': 'application/json'
        };
        break;

      default:
        throw new Error('Unsupported AI model');
    }

    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(testUrl, {
      method: 'GET',
      headers: testHeaders,
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    
    logger.info(`API test for ${modelId}: ${response.status} ${response.statusText}`);
    return response.ok;
  } catch (error) {
    logger.error(`Error testing ${modelId}:`, error.message);
    return false;
  }
};

// Get AI configuration
export const getAIConfig = async (req, res) => {
  try {
    const aiModels = await AIConfig.find({});

    // Mask API keys for admin view (show only last 4 characters of decrypted key)
    const modelsWithMaskedKeys = aiModels.map(model => {
      let maskedKey = '';
      if (model.apiKey) {
        try {
          const decryptedKey = decrypt(model.apiKey);
          maskedKey = decryptedKey ? '••••••••••••' + decryptedKey.slice(-4) : '';
        } catch (error) {
          logger.error(`Error decrypting API key for model ${model.id}:`, error);
          maskedKey = '••••••••••••';
        }
      }
      
      return {
        ...model.toObject(),
        apiKey: maskedKey
      };
    });

    res.json({
      success: true,
      data: {
        aiModels: modelsWithMaskedKeys
      }
    });
  } catch (error) {
    logger.error('Error fetching AI config:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch AI configuration'
    });
  }
};

// Save/Update AI model configuration
export const saveAIModel = async (req, res) => {
  try {
    const { id, name, description, icon, color, apiKey, modelName, isEnabled } = req.body;

    logger.info(`Attempting to save AI model: ${id}`);

    if (!id || !name || !apiKey) {
      logger.warn(`Missing required fields for AI model: ${id}`);
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: id, name, and apiKey are required'
      });
    }

    // Check if model exists to preserve status
    const existingModel = await AIConfig.findOne({ id });
    
    // Encrypt the API key
    logger.info(`Encrypting API key for model: ${id}`);
    const encryptedApiKey = encrypt(apiKey);

    // Test the API key before saving
    logger.info(`Testing API key for model: ${id}`);
    const isApiKeyValid = await testAIModel(id, apiKey);
    
    const modelData = {
      id,
      name,
      description,
      icon,
      color,
      apiKey: encryptedApiKey,
      modelName: modelName || '',
      isEnabled: Boolean(isEnabled),
      status: isApiKeyValid ? 'active' : 'error',
      lastTested: isApiKeyValid ? new Date() : existingModel?.lastTested
    };

    // Only add updatedBy if user exists and has valid ObjectId
    if (req.user?.id && mongoose.Types.ObjectId.isValid(req.user.id)) {
      modelData.updatedBy = req.user.id;
    }

    logger.info(`Model data prepared for ${id}:`, { ...modelData, apiKey: '[ENCRYPTED]' });

    if (existingModel) {
      logger.info(`Updating existing AI model: ${id}`);
      await AIConfig.updateOne({ id }, modelData);
    } else {
      logger.info(`Creating new AI model: ${id}`);
      await AIConfig.create(modelData);
    }

    logger.info(`AI model ${id} saved successfully with status: ${modelData.status}`);
    
    // Ensure response is sent properly
    return res.status(200).json({
      success: true,
      message: `AI model configuration saved successfully. API key is ${isApiKeyValid ? 'valid and active' : 'invalid - please check your key'}`,
      data: {
        status: modelData.status,
        isValid: isApiKeyValid
      }
    });
  } catch (error) {
    logger.error('Error saving AI model:', error.message);
    logger.error('Stack trace:', error.stack);
    
    // Ensure error response is sent properly
    return res.status(500).json({
      success: false,
      message: 'Failed to save AI model configuration',
      error: error.message
    });
  }
};


// Get enabled AI models for public use (for chat widget)
export const getEnabledAIModels = async (req, res) => {
  try {
    const enabledModels = await AIConfig.find({ 
      isEnabled: true,
      status: 'active'
    });

    // Return models without API keys for security
    const publicModels = enabledModels.map(model => ({
      id: model.id,
      name: model.name,
      description: model.description,
      icon: model.icon,
      color: model.color,
      status: model.status
    }));

    res.json({
      success: true,
      data: {
        aiModels: publicModels
      }
    });
  } catch (error) {
    logger.error('Error fetching enabled AI models:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch available AI models'
    });
  }
};

// Get decrypted API key for internal use (chat processing)
export const getAIModelKey = async (modelId) => {
  try {
    const model = await AIConfig.findOne({ 
      id: modelId,
      isEnabled: true,
      status: 'active'
    });

    if (!model || !model.apiKey) {
      return null;
    }

    return {
      apiKey: decrypt(model.apiKey),
      modelName: model.modelName
    };
  } catch (error) {
    logger.error('Error getting AI model key:', error);
    return null;
  }
};

// Test AI model endpoint
export const testAIModelKey = async (req, res) => {
  try {
    const { modelId, apiKey } = req.body;

    if (!modelId || !apiKey) {
      return res.status(400).json({
        success: false,
        message: 'Model ID and API key are required'
      });
    }

    const isValid = await testAIModel(modelId, apiKey);
    
    if (isValid) {
      // Update model status in database
      await AIConfig.findOneAndUpdate(
        { id: modelId },
        { 
          status: 'active',
          lastTested: new Date()
        }
      );

      res.json({
        success: true,
        message: 'API key is valid and working'
      });
    } else {
      // Update model status to error
      await AIConfig.findOneAndUpdate(
        { id: modelId },
        { status: 'error' }
      );

      res.json({
        success: false,
        message: 'API key validation failed'
      });
    }
  } catch (error) {
    logger.error('Error testing AI model key:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to test API key'
    });
  }
};

// Delete AI model configuration
export const deleteAIModel = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await AIConfig.deleteOne({ id });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'AI model not found'
      });
    }

    res.json({
      success: true,
      message: 'AI model configuration deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting AI model:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete AI model configuration'
    });
  }
};
