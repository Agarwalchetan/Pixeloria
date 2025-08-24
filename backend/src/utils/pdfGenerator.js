import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';
import { logger } from './logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generatePDF = async (submission) => {
  try {
    // Ensure PDF directory exists
    const pdfDir = path.join('uploads/pdfs');
    if (!fs.existsSync(pdfDir)) {
      fs.mkdirSync(pdfDir, { recursive: true });
    }

    // Create HTML content for PDF generation
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Project Estimate - ${submission.contactInfo.name}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #3B82F6;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 28px;
            font-weight: bold;
            color: #3B82F6;
            margin-bottom: 10px;
          }
          .estimate-total {
            background: linear-gradient(135deg, #3B82F6, #8B5CF6);
            color: white;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            margin: 20px 0;
          }
          .breakdown {
            background: #F8FAFC;
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
          }
          .breakdown-item {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #E2E8F0;
          }
          .features-list {
            background: #F0F9FF;
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
          }
          .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #E2E8F0;
            color: #64748B;
          }
          .contact-info {
            background: #F1F5F9;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
          }
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">Pixeloria</div>
          <h1>Project Cost Estimate</h1>
          <p>Professional Web Development Services</p>
        </div>

        <div class="contact-info">
          <h2>Project Details</h2>
          <p><strong>Client:</strong> ${submission.contactInfo.name}</p>
          <p><strong>Email:</strong> ${submission.contactInfo.email}</p>
          ${submission.contactInfo.company ? `<p><strong>Company:</strong> ${submission.contactInfo.company}</p>` : ''}
          <p><strong>Date:</strong> ${new Date(submission.createdAt).toLocaleDateString()}</p>
        </div>

        <div class="estimate-total">
          <h2 style="margin: 0 0 10px 0;">Total Project Estimate</h2>
          <div style="font-size: 36px; font-weight: bold;">$${submission.estimate.totalCost.toLocaleString()}</div>
          <p style="margin: 10px 0 0 0;">Estimated Timeline: ${submission.estimate.timeline}</p>
        </div>

        <div class="breakdown">
          <h3>Cost Breakdown</h3>
          ${submission.estimate.breakdown.map(item => `
            <div class="breakdown-item">
              <span>${item.label}</span>
              <span><strong>$${item.cost.toLocaleString()}</strong></span>
            </div>
          `).join('')}
        </div>

        <div>
          <h3>Project Specifications</h3>
          <p><strong>Project Type:</strong> ${submission.projectType}</p>
          <p><strong>Number of Pages:</strong> ${submission.pages}</p>
          <p><strong>Design Complexity:</strong> ${submission.designComplexity}</p>
          <p><strong>Timeline Preference:</strong> ${submission.timeline}</p>
        </div>

        ${submission.features.length > 0 ? `
          <div class="features-list">
            <h3>Selected Features</h3>
            <ul>
              ${submission.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        <div class="footer">
          <p><strong>Next Steps:</strong></p>
          <p>This estimate is valid for 30 days. To proceed with your project, please contact us at:</p>
          <p>Email: hello@pixeloria.com | Phone: (415) 555-0123</p>
          <p style="margin-top: 20px; font-size: 12px;">
            This estimate is based on the information provided and may vary depending on specific requirements.
            Final pricing will be confirmed after detailed project consultation.
          </p>
        </div>
      </body>
      </html>
    `;

    // Generate actual PDF using Puppeteer
    const fileName = `estimate_${submission._id}_${Date.now()}.pdf`;
    const filePath = path.join(pdfDir, fileName);
    
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    await page.pdf({
      path: filePath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });
    
    await browser.close();
    
    logger.info('PDF generated successfully:', fileName);
    return filePath;

  } catch (error) {
    logger.error('PDF generation failed:', error);
    throw error;
  }
};

// Generate chat PDF
export const generateChatPDF = async (chat) => {
  try {
    // Ensure PDF directory exists
    const pdfDir = path.join('uploads/pdfs');
    if (!fs.existsSync(pdfDir)) {
      fs.mkdirSync(pdfDir, { recursive: true });
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Chat History - ${chat.user_info.name}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #3B82F6;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 28px;
            font-weight: bold;
            color: #3B82F6;
            margin-bottom: 10px;
          }
          .message {
            margin: 15px 0;
            padding: 15px;
            border-radius: 12px;
            border-left: 4px solid;
          }
          .user-message {
            background: #EBF8FF;
            border-left-color: #3B82F6;
            margin-left: 20%;
          }
          .admin-message {
            background: #F0FDF4;
            border-left-color: #10B981;
            margin-right: 20%;
          }
          .ai-message {
            background: #FEF3C7;
            border-left-color: #F59E0B;
            margin-right: 20%;
          }
          .timestamp {
            font-size: 12px;
            color: #6B7280;
            margin-top: 8px;
          }
          .user-info {
            background: #F8FAFC;
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 30px;
          }
          .chat-stats {
            background: #F1F5F9;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">Pixeloria</div>
          <h1>Chat History Export</h1>
          <p>Professional Support Conversation</p>
        </div>

        <div class="user-info">
          <h3>User Information</h3>
          <p><strong>Name:</strong> ${chat.user_info.name}</p>
          <p><strong>Email:</strong> ${chat.user_info.email}</p>
          <p><strong>Country:</strong> ${chat.user_info.country}</p>
          <p><strong>Chat Type:</strong> ${chat.chat_type.toUpperCase()}</p>
          <p><strong>Session ID:</strong> ${chat.session_id}</p>
        </div>

        <div class="chat-stats">
          <h3>Chat Statistics</h3>
          <p><strong>Total Messages:</strong> ${chat.messages.length}</p>
          <p><strong>Started:</strong> ${new Date(chat.created_at).toLocaleString()}</p>
          <p><strong>Last Activity:</strong> ${new Date(chat.last_activity).toLocaleString()}</p>
          <p><strong>Status:</strong> ${chat.status.toUpperCase()}</p>
          ${chat.ai_config?.selected_model ? `<p><strong>AI Model:</strong> ${chat.ai_config.selected_model.toUpperCase()}</p>` : ''}
        </div>

        <div class="messages">
          <h3>Conversation History</h3>
          ${chat.messages.map(msg => `
            <div class="message ${msg.sender}-message">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <strong style="color: ${
                  msg.sender === 'user' ? '#1E40AF' : 
                  msg.sender === 'ai' ? '#7C3AED' : '#059669'
                };">
                  ${msg.sender.toUpperCase()}${msg.ai_model ? ` (${msg.ai_model.toUpperCase()})` : ''}
                </strong>
                <span style="font-size: 11px; color: #6B7280;">
                  ${new Date(msg.timestamp).toLocaleString()}
                </span>
              </div>
              <p style="margin: 0; line-height: 1.5;">${msg.content}</p>
            </div>
          `).join('')}
        </div>

        <div style="margin-top: 40px; text-align: center; color: #6B7280; font-size: 14px; border-top: 1px solid #E5E7EB; padding-top: 20px;">
          <p><strong>Pixeloria Support Team</strong></p>
          <p>Email: hello@pixeloria.com | Phone: (415) 555-0123</p>
          <p style="margin-top: 15px; font-size: 12px;">
            This chat history was exported on ${new Date().toLocaleString()}
          </p>
        </div>
      </body>
      </html>
    `;

    const fileName = `chat_${chat.session_id}_${Date.now()}.pdf`;
    const filePath = path.join(pdfDir, fileName);
    
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    await page.pdf({
      path: filePath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });
    
    await browser.close();
    
    logger.info('Chat PDF generated successfully:', fileName);
    return filePath;

  } catch (error) {
    logger.error('Chat PDF generation failed:', error);
    throw error;
  }
};