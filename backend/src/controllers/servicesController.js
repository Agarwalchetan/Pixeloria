import Service from '../database/models/Service.js';

export const getAllServices = async (req, res, next) => {
  try {
    const { category, status = 'active' } = req.query;

    const filter = { status };
    if (category) {
      filter.category = category;
    }

    const services = await Service.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        services,
        total: services.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getServiceById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }

    res.json({
      success: true,
      data: { service },
    });
  } catch (error) {
    next(error);
  }
};

export const createService = async (req, res, next) => {
  try {
    const {
      title,
      description,
      features,
      price_range,
      duration,
      category,
      status = 'active'
    } = req.body;

    const service = new Service({
      title,
      description,
      features,
      price_range,
      duration,
      category,
      status
    });

    await service.save();

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: { service },
    });
  } catch (error) {
    next(error);
  }
};

export const updateService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const service = await Service.findByIdAndUpdate(id, updates, { new: true });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }

    res.json({
      success: true,
      message: 'Service updated successfully',
      data: { service },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteService = async (req, res, next) => {
  try {
    const { id } = req.params;

    const service = await Service.findByIdAndDelete(id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }

    res.json({
      success: true,
      message: 'Service deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};