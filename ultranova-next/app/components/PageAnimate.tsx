'use client'

import { motion, type Variants } from 'framer-motion'
import { ReactNode } from 'react'

const variants: Variants = {
    hidden: { opacity: 0, scale: 0.98 },
    enter: { 
        opacity: 1, 
        scale: 1,
        transition: { duration: 0.6, ease: "easeOut" }
    }
}

export default function PageAnimate({ children }: { children: ReactNode }) {
    return (
        <motion.div
            initial="hidden"
            animate="enter"
            variants={variants}
            style={{ position: 'relative', width: '100%' }}
        >
            {children}
        </motion.div>
    )
}

export const StaggerContainer = ({ children }: { children: ReactNode }) => (
    <div style={{ width: '100%' }}>{children}</div>
)

export const StaggerItem = ({ children }: { children: ReactNode }) => (
    <div style={{ width: '100%' }}>{children}</div>
)
