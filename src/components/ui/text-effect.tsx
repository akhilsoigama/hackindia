import * as React from "react"
import { motion, Variants } from "framer-motion"
import { cn } from "@/utils/utils"

interface TextEffectProps {
  text: string
  className?: string
  as?: React.ElementType
  preset?: "fade" | "blur"
}

export function TextEffect({
  text,
  className,
  as: Component = "p",
  preset = "blur",
}: TextEffectProps) {
  const words = text.split(" ")

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.04 * i },
    }),
  }

  const childVariants: Record<string, Variants> = {
    fade: {
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          type: "spring",
          damping: 12,
          stiffness: 100,
        },
      },
      hidden: {
        opacity: 0,
        y: 20,
        transition: {
          type: "spring",
          damping: 12,
          stiffness: 100,
        },
      },
    },
    blur: {
      visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: {
          type: "spring",
          damping: 12,
          stiffness: 100,
        },
      },
      hidden: {
        opacity: 0,
        y: 20,
        filter: "blur(10px)",
        transition: {
          type: "spring",
          damping: 12,
          stiffness: 100,
        },
      },
    },
  }

  const selectedVariants = childVariants[preset]

  return (
    <Component className={cn("inline-block", className)}>
      <motion.span
        style={{ display: "inline-flex", flexWrap: "wrap" }}
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {words.map((word, index) => (
          <motion.span
            variants={selectedVariants}
            style={{ marginRight: "0.25em" }}
            key={index}
          >
            {word}
          </motion.span>
        ))}
      </motion.span>
    </Component>
  )
}
