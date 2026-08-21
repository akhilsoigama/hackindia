import { motion, useReducedMotion } from "framer-motion";

interface RuralSparkLogoProps {
  isDark?: boolean;
  className?: string;
  showSubtitle?: boolean;
  showFrame?: boolean;
  iconClassName?: string;
  imageScaleClassName?: string;
}

const RuralSparkLogo = ({
  isDark = false,
  className = "",
  showSubtitle = true,
  showFrame = true,
  iconClassName = "h-12 w-12 sm:h-14 sm:w-14",
  imageScaleClassName = "scale-150",
}: RuralSparkLogoProps) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className={`flex min-w-0 items-center gap-2 sm:gap-3 ${className}`}
      aria-label="RuralSpark logo"
      initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      whileHover={prefersReducedMotion ? undefined : { scale: 1.02 }}
      style={{ willChange: "transform" }}
    >
      <motion.div
        className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-xl ${iconClassName} ${
          showFrame
            ? isDark
              ? "bg-transparent"
              : "border-transparent "
            : "bg-transparent"
        }`}
        animate={
          prefersReducedMotion
            ? undefined
            : {
                y: [-1, 1.5, -1],
                boxShadow: isDark
                  ? [
                      "0 10px 24px -18px rgba(37,99,235,0.9)",
                      "0 12px 28px -16px rgba(249,115,22,0.45)",
                      "0 10px 24px -18px rgba(37,99,235,0.9)",
                    ]
                  : [
                      "0 10px 24px -18px rgba(15,23,42,0.45)",
                      "0 12px 28px -16px rgba(249,115,22,0.25)",
                      "0 10px 24px -18px rgba(15,23,42,0.45)",
                    ],
              }
        }
        transition={prefersReducedMotion ? undefined : { duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <img
          src="/ruralspark.png"
          alt="RuralSpark logo"
          className={`h-full w-full object-cover ${imageScaleClassName}`}
          loading="eager"
        />
      </motion.div>

      <div className="hidden min-w-0 leading-tight sm:block">
        <h1 className="truncate text-base font-extrabold tracking-tight sm:text-xl lg:text-2xl">
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)" }}
          >
            Rural
          </span>
          <span
            className="bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(249,115,22,0.28)]"
            style={{ backgroundImage: "linear-gradient(135deg, #F97316 0%, #F59E0B 100%)" }}
          >
            Spark
          </span>
          <motion.span
            aria-hidden="true"
            className="ml-0.5 align-top text-[10px] text-orange-400 sm:text-xs"
            animate={prefersReducedMotion ? undefined : { opacity: [0.45, 1, 0.5, 1], scale: [0.92, 1.07, 0.95, 1.07] }}
            transition={prefersReducedMotion ? undefined : { duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            ✶
          </motion.span>
        </h1>
        {showSubtitle && (
          <span
            className={`hidden text-[10px] font-semibold tracking-wide min-[420px]:block sm:text-xs ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            AI-Powered Learning
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default RuralSparkLogo;