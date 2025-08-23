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

export const exportCalculatorPDF = async (req, res, next) => {
  try {
    const { id } = req.params;

    const submission = await CalculatorSubmission.findById(id);
    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found',
      });
    }

    const pdfPath = await generatePDF(submission);

    res.json({
      success: true,
      data: {
        pdfUrl: pdfPath,
      },
    });
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