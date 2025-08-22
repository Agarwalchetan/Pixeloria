import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { LucideProps, ArrowRight } from "lucide-react";
import SectionHeader from "../SectionHeader";

// --- Types ---
interface Metric {
  number: number | string;
  label: string;
  suffix: string;
}

interface WhyChooseUsItem {
  id: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  title: string;
  tagline: string;
  description: string;
  metric: string;
  metricLabel: string;
  color: string;
}

interface ClientLogo {
  name: string;
  logo: string;
}

interface PixeloriaEdgeProps {
  homeSettings: any; // Use a more specific type if available
  whyChooseUsData: WhyChooseUsItem[];
  clientLogos: ClientLogo[];
}

// --- Helper Functions ---
const getDefaultTrustMetrics = (): Metric[] => [
  { number: 50, label: "Projects Delivered", suffix: "+" },
  { number: 4.9, label: "Average Rating", suffix: "/5" },
  { number: 99, label: "Project Success Rate", suffix: "%" },
  { number: 24, label: "Support Hours", suffix: "/7" },
];

const getMetricsFromSettings = (settings: any): Metric[] => {
  if (settings?.edge_numbers) {
    return [
      { number: settings.edge_numbers.projects_delivered || 50, label: "Projects Delivered", suffix: "+" },
      { number: settings.edge_numbers.client_satisfaction || 99, label: "Client Satisfaction", suffix: "%" },
      { number: settings.edge_numbers.users_reached || 1000, label: "Users Reached", suffix: "" },
      { number: settings.edge_numbers.support_hours || 24, label: "Support", suffix: "/7" },
    ];
  }
  return getDefaultTrustMetrics();
};

export const PixeloriaEdge: React.FC<PixeloriaEdgeProps> = ({
  homeSettings,
  whyChooseUsData,
  clientLogos,
}) => {
  const [counts, setCounts] = useState<number[]>([]);
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, amount: 0.5 });
  
  const currentMetrics = getMetricsFromSettings(homeSettings);

  useEffect(() => {
    if (statsInView) {
      const timers: NodeJS.Timeout[] = [];
      setCounts(new Array(currentMetrics.length).fill(0));

      currentMetrics.forEach((metric, index) => {
        let start = 0;
        const end = typeof metric.number === 'string' ? parseFloat(metric.number) : metric.number;
        if (isNaN(end)) return;
        
        const duration = 2000;
        const frameRate = 1000 / 60; // 60fps
        const totalFrames = duration / frameRate;
        const increment = end / totalFrames;

        const timer = setInterval(() => {
          start += increment;
          if (start >= end) {
            setCounts(prev => {
              const newCounts = [...prev];
              newCounts[index] = end;
              return newCounts;
            });
            clearInterval(timer);
          } else {
            setCounts(prev => {
              const newCounts = [...prev];
              newCounts[index] = start;
              return newCounts;
            });
          }
        }, frameRate);
        timers.push(timer);
      });

      return () => timers.forEach(clearInterval);
    }
  }, [statsInView, currentMetrics]); // Rerun if metrics change (e.g., from API)

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-50/50 via-purple-50/50 to-transparent"></div>
      <div className="container-custom relative z-10">
        <SectionHeader
          title="The Pixeloria Edge"
          subtitle="What sets us apart in the competitive world of web development."
        />
        <motion.div
          ref={statsRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
        >
          {currentMetrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                {metric.suffix === "/5"
                  ? (counts[index] || 0).toFixed(1)
                  : Math.round(counts[index] || 0)}
                {metric.suffix}
              </div>
              <div className="text-gray-600 font-medium">{metric.label}</div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {whyChooseUsData.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <motion.div
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 h-full relative overflow-hidden cursor-pointer"
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                  />
                  <motion.div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} p-4 mb-6 shadow-lg relative z-10`}
                    whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <item.icon className="w-full h-full text-white" />
                  </motion.div>
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-2 text-gray-900">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{item.description}</p>
                    <div className="flex items-center justify-between mt-4">
                       <div>
                        <div className={`text-2xl font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
                          {item.metric}
                        </div>
                        <div className="text-sm text-gray-500">
                          {item.metricLabel}
                        </div>
                      </div>
                      <motion.div
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        whileHover={{ scale: 1.2 }}
                      >
                        <ArrowRight size={20} className="text-gray-400" />
                      </motion.div>
                    </div>
                  </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-8">
            Trusted by innovative companies
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {clientLogos.map((client, index) => (
              <motion.div
                key={client.name}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.1 }}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
              >
                <span className="text-2xl">{client.logo}</span>
                <span className="font-medium">{client.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};