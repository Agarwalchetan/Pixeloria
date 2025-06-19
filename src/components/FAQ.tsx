import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const FAQ: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How long does a typical project take?",
      answer: "Project timelines vary based on complexity. A simple website might take 4-6 weeks, while a complex web application could take 3-6 months. We'll provide a detailed timeline during our initial consultation."
    },
    {
      question: "What is your development process?",
      answer: "We follow an agile methodology with regular client check-ins. Our process includes discovery, design, development, testing, and launch phases, ensuring quality and alignment with your goals throughout."
    },
    {
      question: "Do you provide ongoing support?",
      answer: "Yes, we offer various maintenance plans to keep your site secure, up-to-date, and performing optimally. This includes regular updates, security patches, and technical support."
    },
    {
      question: "Can we update the content ourselves?",
      answer: "Absolutely! We build sites with user-friendly content management systems (CMS) and provide training so you can easily update content without technical expertise."
    },
    {
      question: "What technologies do you use?",
      answer: "We use modern, proven technologies like React, Next.js, Node.js, and various databases. The specific stack is chosen based on your project's requirements to ensure the best performance and scalability."
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom max-w-4xl">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <button
                className="w-full px-6 py-4 text-left flex items-center justify-between"
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
              >
                <span className="font-semibold text-gray-900">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transition-transform ${
                    activeIndex === index ? 'transform rotate-180' : ''
                  }`}
                />
              </button>
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-4 text-gray-600">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;