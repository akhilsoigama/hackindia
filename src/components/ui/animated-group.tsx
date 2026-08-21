import * as React from "react"
import { motion, HTMLMotionProps, Variants } from "framer-motion"

import { cn } from "@/utils/utils"

interface AnimatedGroupProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode
  className?: string
  staggerDelay?: number
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: (staggerDelay: number = 0.1) => ({
    opacity: 1,
    transition: {
      staggerChildren: staggerDelay,
    },
  }),
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
}

export function AnimatedGroup({
  children,
  className,
  staggerDelay = 0.1,
  ...props
}: AnimatedGroupProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-50px" }}
      custom={staggerDelay}
      className={cn("flex", className)}
      {...props}
    >
      {React.Children.map(children, (child) => (
        <motion.div variants={itemVariants}>{child}</motion.div>
      ))}
    </motion.div>
  )
}
