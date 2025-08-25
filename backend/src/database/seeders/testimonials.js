import mongoose from 'mongoose';
import Testimonial from '../models/Testimonial.js';

const sampleTestimonials = [
  {
    name: "Sarah Johnson",
    role: "CEO",
    company: "TechStart Inc.",
    industry: "Technology",
    image_url: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
    quote: "Pixeloria transformed our digital presence completely. The team's attention to detail and innovative approach exceeded our expectations.",
    full_quote: "Working with Pixeloria was a game-changer for our startup. They didn't just build us a website; they crafted a digital experience that truly represents our brand. The team's attention to detail and innovative approach exceeded our expectations. Our conversion rates increased by 300% within the first month of launch.",
    rating: 5,
    project_type: "Web Development",
    results: ["300% increase in conversion rates", "50% reduction in bounce rate", "Improved user engagement"],
    status: "published"
  },
  {
    name: "Michael Chen",
    role: "Marketing Director",
    company: "GrowthCorp",
    industry: "Marketing",
    image_url: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400",
    quote: "The e-commerce platform they built for us is phenomenal. Sales increased by 250% in just 3 months.",
    full_quote: "The e-commerce platform Pixeloria built for us is phenomenal. Not only is it visually stunning, but the user experience is seamless. Our customers love the new shopping experience, and our sales increased by 250% in just 3 months. The team was professional, responsive, and delivered on time.",
    rating: 5,
    project_type: "E-commerce",
    results: ["250% increase in sales", "Improved customer satisfaction", "Mobile-first design"],
    status: "published"
  },
  {
    name: "Emily Rodriguez",
    role: "Founder",
    company: "Creative Studio",
    industry: "Design",
    image_url: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400",
    quote: "Outstanding work! They brought our creative vision to life with pixel-perfect precision.",
    full_quote: "Outstanding work! Pixeloria brought our creative vision to life with pixel-perfect precision. As a design studio, we have high standards, and they exceeded every expectation. The website they created showcases our portfolio beautifully and has helped us attract premium clients.",
    rating: 5,
    project_type: "Portfolio Website",
    results: ["Premium client acquisition", "Enhanced portfolio showcase", "Professional brand image"],
    status: "published"
  },
  {
    name: "David Kim",
    role: "Operations Manager",
    company: "LogiFlow",
    industry: "Logistics",
    image_url: "https://images.pexels.com/photos/927022/pexels-photo-927022.jpeg?auto=compress&cs=tinysrgb&w=400",
    quote: "The custom web application streamlined our operations and saved us countless hours.",
    full_quote: "The custom web application Pixeloria developed for us has streamlined our operations and saved us countless hours. The intuitive interface and powerful features have made our team more productive. It's exactly what we needed to scale our business efficiently.",
    rating: 5,
    project_type: "Web Application",
    results: ["Streamlined operations", "Increased productivity", "Scalable solution"],
    status: "published"
  },
  {
    name: "Lisa Wang",
    role: "Product Manager",
    company: "InnovateLab",
    industry: "Innovation",
    image_url: "https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=400",
    quote: "Professional, reliable, and incredibly talented. Pixeloria is our go-to development partner.",
    full_quote: "Professional, reliable, and incredibly talented. Pixeloria has become our go-to development partner for all digital projects. They understand our vision and consistently deliver high-quality solutions that drive results. We've worked with them on multiple projects, and each one has been a success.",
    rating: 5,
    project_type: "Multiple Projects",
    results: ["Long-term partnership", "Consistent quality", "Multiple successful projects"],
    status: "published"
  }
];

export const seedTestimonials = async () => {
  try {
    console.log('Seeding testimonials...');
    
    // Clear existing testimonials
    await Testimonial.deleteMany({});
    
    // Insert sample testimonials
    const createdTestimonials = await Testimonial.insertMany(sampleTestimonials);
    
    console.log(`Created ${createdTestimonials.length} testimonials`);
    return createdTestimonials;
  } catch (error) {
    console.error('Error seeding testimonials:', error);
    throw error;
  }
};

// Run seeder if called directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pixeloria')
    .then(() => {
      console.log('Connected to MongoDB');
      return seedTestimonials();
    })
    .then(() => {
      console.log('Testimonials seeded successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error:', error);
      process.exit(1);
    });
}
