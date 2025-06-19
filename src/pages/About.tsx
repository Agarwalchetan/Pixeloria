import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Hero from '../components/Hero';
import SectionHeader from '../components/SectionHeader';
import { Code, Coffee, Heart, Zap, Users, Star, Brain, Globe, Rocket, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "Founder & Lead Developer",
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      bio: "Full-stack developer with 10+ years of experience in building scalable web applications.",
      funFact: "Can code faster with coffee than without ☕",
      skills: ["React", "Node.js", "AWS"],
      social: {
        github: "#",
        linkedin: "#",
        twitter: "#"
      }
    },
    {
      name: "Michael Chen",
      role: "UI/UX Designer",
      image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      bio: "Passionate about creating beautiful and intuitive user experiences.",
      funFact: "Draws inspiration from nature walks 🌿",
      skills: ["Figma", "Adobe XD", "Prototyping"],
      social: {
        github: "#",
        linkedin: "#",
        twitter: "#"
      }
    },
    {
      name: "Emily Rodriguez",
      role: "Technical Lead",
      image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      bio: "Architecture expert specializing in scalable solutions.",
      funFact: "Builds mechanical keyboards for fun ⌨️",
      skills: ["System Design", "Cloud Architecture", "DevOps"],
      social: {
        github: "#",
        linkedin: "#",
        twitter: "#"
      }
    }
  ];

  const values = [
    {
      icon: Heart,
      title: "Passion for Excellence",
      description: "We pour our hearts into every project, ensuring the highest quality in every detail.",
      gradient: "from-pink-400 to-red-400"
    },
    {
      icon: Zap,
      title: "Innovation First",
      description: "Constantly exploring new technologies and approaches to solve complex problems.",
      gradient: "from-yellow-400 to-orange-400"
    },
    {
      icon: Users,
      title: "Client Partnership",
      description: "We work closely with our clients, treating their success as our own.",
      gradient: "from-green-400 to-emerald-400"
    },
    {
      icon: Brain,
      title: "Continuous Learning",
      description: "Staying ahead through constant learning and improvement.",
      gradient: "from-blue-400 to-purple-400"
    }
  ];

  const stats = [
    { number: "50+", label: "Projects Completed" },
    { number: "100%", label: "Client Satisfaction" },
    { number: "24/7", label: "Support" },
    { number: "10+", label: "Expert Team Members" }
  ];

  const milestones = [
    {
      year: "2020",
      title: "Founded Pixeloria",
      description: "Started with a vision to create exceptional digital experiences.",
      icon: Rocket
    },
    {
      year: "2021",
      title: "Team Growth",
      description: "Expanded to a team of 10 talented developers and designers.",
      icon: Users
    },
    {
      year: "2022",
      title: "50+ Projects",
      description: "Successfully delivered over 50 projects for clients worldwide.",
      icon: CheckCircle
    },
    {
      year: "2023",
      title: "Innovation Award",
      description: "Recognized for excellence in web development and design.",
      icon: Star
    }
  ];

  return (
    <div className="bg-gray-900">
      <Hero
        title="Crafting Digital Excellence Since 2020"
        subtitle="We're a team of passionate developers and designers creating exceptional digital experiences that drive real business results."
        buttonText="Meet Our Team"
        buttonLink="#team"
        backgroundImage="https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
      />

      {/* Stats Section */}
      <section className="py-12 relative -mt-20 z-10">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-effect rounded-xl p-6 text-center"
              >
                <h3 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                  {stat.number}
                </h3>
                <p className="text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-purple-500/5 to-transparent"></div>
        <div className="container-custom relative z-10">
          <SectionHeader
            title="Our Story"
            subtitle="Founded in 2020, Pixeloria has grown from a small team of developers to a full-service web development agency."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <p className="text-gray-300">
                At Pixeloria, we believe in the power of technology to transform businesses and create meaningful connections with their audiences. Our journey began with a simple mission: to make exceptional web development accessible to businesses of all sizes.
              </p>
              <p className="text-gray-300">
                Today, we're proud to have helped hundreds of businesses establish their digital presence and achieve their goals. Our team combines technical expertise with creative innovation to deliver solutions that not only look great but drive real business results.
              </p>
              <div className="flex items-center gap-4">
                <Link to="/services" className="btn-primary">
                  Our Services
                </Link>
                <Link to="/portfolio" className="btn-outline">
                  View Portfolio
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/3182781/pexels-photo-3182781.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Team collaboration"
                  className="object-cover transform hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 relative overflow-hidden bg-gradient-to-b from-gray-800 to-gray-900">
        <div className="container-custom relative z-10">
          <SectionHeader
            title="Our Core Values"
            subtitle="The principles that guide everything we do"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card group p-6 hover:bg-gray-800/50 transition-all duration-300"
              >
                <div className="mb-4">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${value.gradient} p-4 transform group-hover:scale-110 transition-transform duration-300`}>
                    <value.icon className="w-full h-full text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-blue-400 transition-colors">
                  {value.title}
                </h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-purple-500/5 to-transparent"></div>
        <div className="container-custom relative z-10">
          <SectionHeader
            title="Meet Our Team"
            subtitle="The talented people behind our success"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card group overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-6 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <h3 className="text-xl font-semibold mb-1 text-white group-hover:text-blue-400 transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-blue-400 mb-3">{member.role}</p>
                    <p className="text-gray-400 mb-4">{member.bio}</p>
                    <div className="space-y-3">
                      <p className="text-sm text-gray-500">
                        <span className="font-medium text-gray-400">Fun fact:</span> {member.funFact}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {member.skills.map((skill, skillIndex) => (
                          <span
                            key={skillIndex}
                            className="text-xs px-2 py-1 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-400"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="py-20 relative overflow-hidden bg-gradient-to-b from-gray-800 to-gray-900">
        <div className="container-custom relative z-10">
          <SectionHeader
            title="Our Journey"
            subtitle="Key milestones in our growth story"
          />
          <div className="max-w-4xl mx-auto">
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative pl-8 pb-12 last:pb-0"
              >
                <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500">
                  <div className="absolute -left-3 top-0 w-7 h-7 rounded-full bg-gray-900 border-2 border-blue-400 flex items-center justify-center">
                    <milestone.icon className="w-4 h-4 text-blue-400" />
                  </div>
                </div>
                <div className="card p-6 ml-8 group hover:bg-gray-800/50 transition-all duration-300">
                  <span className="text-sm font-semibold text-blue-400">{milestone.year}</span>
                  <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-blue-400 transition-colors">
                    {milestone.title}
                  </h3>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                    {milestone.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="container-custom relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Ready to Build Something Amazing?
            </h2>
            <p className="text-gray-300 mb-8">
              Whether you're starting a new project or looking to enhance an existing one, we're here to help bring your vision to life.
            </p>
            <Link
              to="/contact"
              className="btn-primary group relative overflow-hidden inline-flex items-center"
            >
              <span className="relative z-10 flex items-center">
                Start Your Project
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:scale-110 transition-transform duration-500"></div>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;