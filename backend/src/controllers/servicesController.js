import Service from '../database/models/Service.js';

export const getAllServices = async (req, res, next) => {
  try {
    const { category, status = 'active' } = req.query;

    const filter = { status };
    if (category) {
      filter.category = category;
    }

    let services = await Service.find(filter).sort({ createdAt: -1 });

    // If no services exist, create sample ones
    if (services.length === 0) {
      console.log('No services found, creating sample services...');
      const sampleServices = [
        {
          title: "Web Development",
          description: "Custom web applications built with modern technologies",
          category: "Development",
          price_range: "$5,000 - $25,000",
          duration: "4-12 weeks",
          features: ["Responsive Design", "SEO Optimized", "Performance Focused"],
          status: "active"
        },
        {
          title: "Mobile App Development", 
          description: "Native and cross-platform mobile applications",
          category: "Development",
          price_range: "$10,000 - $50,000",
          duration: "8-16 weeks",
          features: ["iOS & Android", "Cross-platform", "App Store Deployment"],
          status: "active"
        },
        {
          title: "UI/UX Design",
          description: "User-centered design for digital products",
          category: "Design",
          price_range: "$2,000 - $10,000",
          duration: "2-6 weeks",
          features: ["User Research", "Wireframing", "Prototyping"],
          status: "active"
        }
      ];
      
      try {
        services = await Service.insertMany(sampleServices);
        console.log('Sample services created:', services.length);
      } catch (insertError) {
        console.error('Error creating sample services:', insertError);
        services = [];
      }
    }

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