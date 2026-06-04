import { motion } from "framer-motion";
import { Award, Users } from "lucide-react";

interface Skill {
  name: string;
  level: number;
}

interface AboutData {
  heading: string;
  content: string[];
  image?: string;
  stats: Array<{ label: string; value: string; icon?: string }>;
  skills: Skill[];
}

interface AboutProps {
  data: AboutData;
}

const iconMap: { [key: string]: typeof Award } = {
  award: Award,
  users: Users,
};

export default function About({ data }: AboutProps) {
  const getIcon = (iconName?: string) => {
    if (!iconName) return null;
    return iconMap[iconName] || Award;
  };

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Content - Text and Stats */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-6">
              About Me
            </h2>

            {/* Description */}
            <div className="space-y-4 mb-8">
              {data.content.map((paragraph, idx) => (
                <p
                  key={idx}
                  className={`${
                    idx === 0 ? "text-lg" : "text-base"
                  } text-gray-600 leading-relaxed`}
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-8 mb-12">
              {data.stats.map((stat, idx) => {
                const IconComponent = getIcon(stat.icon);
                return (
                  <div key={idx}>
                    {IconComponent && (
                      <div className="mb-3 inline-flex items-center justify-center w-10 h-10 bg-blue-50 rounded-lg">
                        <IconComponent className="w-6 h-6 text-blue-600" />
                      </div>
                    )}
                    <p className="text-3xl font-semibold text-gray-900">
                      {stat.value}
                    </p>
                    <p className="text-gray-600">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Right Content - Image and Skills */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            {/* Smaller Profile Picture */}
            <div className="flex justify-center">
              <div className="rounded-2xl overflow-hidden shadow-lg bg-gray-300 w-64 h-64">
                {data.image ? (
                  <img
                    src={data.image}
                    alt="Uros Korene - Full-Stack Developer and Designer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-pink-400 flex items-center justify-center text-white text-4xl font-bold">
                    Profile
                  </div>
                )}
              </div>
            </div>

            {/* Technical Skills with Rounded Styling */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                Technical Skills
              </h3>
              <div className="space-y-5">
                {data.skills.map((skill, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between mb-2 items-center">
                      <span className="font-medium text-gray-900">
                        {skill.name}
                      </span>
                      <span className="text-sm text-gray-600">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        transition={{ duration: 1, delay: 0.2 * idx }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-r from-blue-600 to-blue-500 h-full rounded-full"
                      ></motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
