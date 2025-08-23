import CalculatorSubmission from '../database/models/CalculatorSubmission.js';
import { ProjectType, Feature, DesignOption, TimelineOption } from '../database/models/CalculatorConfig.js';
import { generatePDF } from '../utils/pdfGenerator.js';
import { logger } from '../utils/logger.js';

// CALCULATOR SUBMISSIONS
export const getCalculatorSubmissions = async (req, res, next) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;

    const filter = {};
    if (status && status !== 'All') {
      filter.status = status;
    }

    const submissions = await CalculatorSubmission.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset));

    const total = await CalculatorSubmission.countDocuments(filter);

    res.json({
      success: true,
      data: {
        submissions,
        total,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const viewCalculatorSubmission = async (req, res, next) => {
  try {
    const { id } = req.params;

    const submission = await CalculatorSubmission.findById(id);
    if (!submission) {
      return res.status(404).send(`
        <html>
          <head><title>Submission Not Found</title></head>
          <body style="font-family: Arial, sans-serif; padding: 40px; text-align: center;">
            <h1>Submission Not Found</h1>
            <p>The requested submission could not be found.</p>
          </body>
        </html>
      `);
    }

    // Generate HTML view of the submission
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Calculator Submission - ${submission.contactInfo.name}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
          }
          .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #1e40af;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 28px;
            font-weight: bold;
            color: #1e40af;
            margin-bottom: 10px;
          }
          .section {
            margin-bottom: 25px;
          }
          .section h3 {
            color: #1e40af;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 5px;
            margin-bottom: 15px;
          }
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 15px;
          }
          .info-item {
            padding: 10px;
            background: #f8fafc;
            border-radius: 5px;
          }
          .info-label {
            font-weight: bold;
            color: #374151;
            margin-bottom: 5px;
          }
          .info-value {
            color: #6b7280;
          }
          .features-list {
            list-style: none;
            padding: 0;
          }
          .features-list li {
            padding: 8px 15px;
            margin: 5px 0;
            background: #f0f9ff;
            border-left: 4px solid #0ea5e9;
            display: flex;
            justify-content: space-between;
          }
          .total-cost {
            text-align: center;
            background: #059669;
            color: white;
            padding: 20px;
            border-radius: 10px;
            font-size: 24px;
            font-weight: bold;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
          }
          .print-btn {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #1e40af;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
          }
          .print-btn:hover {
            background: #1d4ed8;
          }
          @media print {
            .print-btn { display: none; }
            body { background: white; }
            .container { box-shadow: none; }
          }
        </style>
      </head>
      <body>
        <button class="print-btn" onclick="window.print()">Print / Save as PDF</button>
        
        <div class="container">
          <div class="header">
            <div class="logo">PIXELORIA</div>
            <h2>Project Cost Estimate</h2>
            <p>Submission ID: ${submission._id}</p>
            <p>Date: ${new Date(submission.createdAt).toLocaleDateString()}</p>
          </div>

          <div class="section">
            <h3>Contact Information</h3>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Name</div>
                <div class="info-value">${submission.contactInfo.name}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Email</div>
                <div class="info-value">${submission.contactInfo.email}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Phone</div>
                <div class="info-value">${submission.contactInfo.phone || 'Not provided'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Company</div>
                <div class="info-value">${submission.contactInfo.company || 'Not provided'}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <h3>Project Details</h3>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Project Type</div>
                <div class="info-value">${submission.projectDetails?.projectType || 'N/A'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Budget Range</div>
                <div class="info-value">${submission.projectDetails?.budgetRange || 'N/A'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Timeline</div>
                <div class="info-value">${submission.projectDetails?.timeline || 'N/A'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Status</div>
                <div class="info-value">${submission.status}</div>
              </div>
            </div>
            ${submission.projectDetails?.description ? `
              <div class="info-item" style="grid-column: 1 / -1;">
                <div class="info-label">Project Description</div>
                <div class="info-value">${submission.projectDetails.description}</div>
              </div>
            ` : ''}
          </div>

          <div class="section">
            <h3>Selected Features</h3>
            <ul class="features-list">
              ${submission.selectedFeatures?.map(feature => `
                <li>
                  <span>${feature.name}</span>
                  <span>$${feature.price?.toLocaleString() || '0'}</span>
                </li>
              `).join('') || '<li>No features selected</li>'}
            </ul>
          </div>

          <div class="total-cost">
            Total Estimated Cost: $${submission.estimate?.totalCost?.toLocaleString() || '0'}
          </div>

          <div class="footer">
            <p><strong>Pixeloria - Digital Solutions</strong></p>
            <p>Email: hello@pixeloria.com | Phone: (415) 555-0123</p>
            <p style="margin-top: 20px; font-size: 12px;">
              This estimate is based on the information provided and may vary depending on specific requirements.
              Final pricing will be confirmed after detailed project consultation.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    res.send(html);
  } catch (error) {
    next(error);
  }
};

export const updateCalculatorSubmissionStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['new', 'contacted', 'converted', 'closed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status',
      });
    }

    const submission = await CalculatorSubmission.findByIdAndUpdate(
      id, 
      { status }, 
      { new: true }
    );

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found',
      });
    }

    res.json({
      success: true,
      message: 'Submission status updated successfully',
      data: { submission },
    });
  } catch (error) {
    next(error);
  }
};

// CALCULATOR CONFIGURATION
export const getCalculatorConfig = async (req, res, next) => {
  try {
    const [projectTypes, features, designOptions, timelineOptions] = await Promise.all([
      ProjectType.find({ status: 'active' }).sort({ order: 1 }),
      Feature.find({ status: 'active' }).sort({ order: 1 }),
      DesignOption.find({ status: 'active' }).sort({ order: 1 }),
      TimelineOption.find({ status: 'active' }).sort({ order: 1 })
    ]);

    res.json({
      success: true,
      data: {
        projectTypes,
        features,
        designOptions,
        timelineOptions,
      },
    });
  } catch (error) {
    next(error);
  }
};

// PROJECT TYPES
export const createProjectType = async (req, res, next) => {
  try {
    const projectType = new ProjectType(req.body);
    await projectType.save();

    res.status(201).json({
      success: true,
      message: 'Project type created successfully',
      data: { projectType },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProjectType = async (req, res, next) => {
  try {
    const { id } = req.params;
    const projectType = await ProjectType.findByIdAndUpdate(id, req.body, { new: true });

    if (!projectType) {
      return res.status(404).json({
        success: false,
        message: 'Project type not found',
      });
    }

    res.json({
      success: true,
      message: 'Project type updated successfully',
      data: { projectType },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProjectType = async (req, res, next) => {
  try {
    const { id } = req.params;
    const projectType = await ProjectType.findByIdAndDelete(id);

    if (!projectType) {
      return res.status(404).json({
        success: false,
        message: 'Project type not found',
      });
    }

    res.json({
      success: true,
      message: 'Project type deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// FEATURES
export const createFeature = async (req, res, next) => {
  try {
    const feature = new Feature(req.body);
    await feature.save();

    res.status(201).json({
      success: true,
      message: 'Feature created successfully',
      data: { feature },
    });
  } catch (error) {
    next(error);
  }
};

export const updateFeature = async (req, res, next) => {
  try {
    const { id } = req.params;
    const feature = await Feature.findByIdAndUpdate(id, req.body, { new: true });

    if (!feature) {
      return res.status(404).json({
        success: false,
        message: 'Feature not found',
      });
    }

    res.json({
      success: true,
      message: 'Feature updated successfully',
      data: { feature },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteFeature = async (req, res, next) => {
  try {
    const { id } = req.params;
    const feature = await Feature.findByIdAndDelete(id);

    if (!feature) {
      return res.status(404).json({
        success: false,
        message: 'Feature not found',
      });
    }

    res.json({
      success: true,
      message: 'Feature deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// DESIGN OPTIONS
export const createDesignOption = async (req, res, next) => {
  try {
    const designOption = new DesignOption(req.body);
    await designOption.save();

    res.status(201).json({
      success: true,
      message: 'Design option created successfully',
      data: { designOption },
    });
  } catch (error) {
    next(error);
  }
};

export const updateDesignOption = async (req, res, next) => {
  try {
    const { id } = req.params;
    const designOption = await DesignOption.findByIdAndUpdate(id, req.body, { new: true });

    if (!designOption) {
      return res.status(404).json({
        success: false,
        message: 'Design option not found',
      });
    }

    res.json({
      success: true,
      message: 'Design option updated successfully',
      data: { designOption },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteDesignOption = async (req, res, next) => {
  try {
    const { id } = req.params;
    const designOption = await DesignOption.findByIdAndDelete(id);

    if (!designOption) {
      return res.status(404).json({
        success: false,
        message: 'Design option not found',
      });
    }

    res.json({
      success: true,
      message: 'Design option deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// TIMELINE OPTIONS
export const createTimelineOption = async (req, res, next) => {
  try {
    const timelineOption = new TimelineOption(req.body);
    await timelineOption.save();

    res.status(201).json({
      success: true,
      message: 'Timeline option created successfully',
      data: { timelineOption },
    });
  } catch (error) {
    next(error);
  }
};

export const updateTimelineOption = async (req, res, next) => {
  try {
    const { id } = req.params;
    const timelineOption = await TimelineOption.findByIdAndUpdate(id, req.body, { new: true });

    if (!timelineOption) {
      return res.status(404).json({
        success: false,
        message: 'Timeline option not found',
      });
    }

    res.json({
      success: true,
      message: 'Timeline option updated successfully',
      data: { timelineOption },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTimelineOption = async (req, res, next) => {
  try {
    const { id } = req.params;
    const timelineOption = await TimelineOption.findByIdAndDelete(id);

    if (!timelineOption) {
      return res.status(404).json({
        success: false,
        message: 'Timeline option not found',
      });
    }

    res.json({
      success: true,
      message: 'Timeline option deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};