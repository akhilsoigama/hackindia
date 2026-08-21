import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTheme } from "@/theme/AppThemeProvider";

export function AboutSection() {
  const { mode } = useTheme();
  const isDark = mode === "dark";

  return (
    <section
      id="about"
      className={`relative py-28 sm:py-36 lg:py-44 overflow-hidden transition-colors duration-300 ${
        isDark ? "bg-slate-950" : "bg-white"
      }`}
    >
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.21, 0.45, 0.27, 1] }}
          >
            <div className="inline-flex items-center gap-2 mb-6">
              <div className={`h-px w-8 rounded-full bg-slate-500`} />
              <span className={`text-xs font-semibold tracking-[0.2em] uppercase ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Our Mission
              </span>
              <div className={`h-px w-8 rounded-full bg-slate-500`} />
            </div>

            <h2 className={`text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.2] ${
              isDark ? "text-white" : "text-slate-900"
            }`}>
              Bridging the
              <span className={`block mt-2 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                digital divide
              </span>
              in education.
            </h2>

            <p className={`text-lg mb-10 leading-relaxed ${
              isDark ? "text-slate-300" : "text-slate-600"
            }`}>
              RuralSpark is an AI-Powered Learning Management System conceptualized to revolutionize 
              the educational process in schools, colleges, coaching centers, and rural educational institutions. 
              Our mission is to make high-quality digital education accessible even in areas with poor internet connectivity.
            </p>

            <motion.button
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className={`group inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                isDark 
                  ? "text-slate-300 hover:text-white hover:bg-white/10" 
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              Learn more about our impact
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.21, 0.45, 0.27, 1] }}
            className="relative"
          >
            <div className={`relative rounded-3xl overflow-hidden backdrop-blur-sm transition-all duration-500 ${
              isDark 
                ? "bg-slate-950/70 border border-slate-700 shadow-2xl" 
                : "bg-white border border-slate-200 shadow-xl"
            }`}>
              <div className="relative aspect-4/3 overflow-hidden">
                <img
                  src="https://leadschool.in/wp-content/uploads/2024/05/Banner.png"
                  alt="Students learning together with digital tools"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                
                <div className={`absolute inset-0 bg-linear-to-t ${
                  isDark 
                    ? "from-slate-950 via-transparent to-transparent" 
                    : "from-white/60 via-transparent to-transparent"
                }`} />
                
              </div>

             
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}