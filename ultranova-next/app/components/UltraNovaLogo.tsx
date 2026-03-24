'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useTheme } from './ThemeContext'

export default function UltraNovaLogo({ 
    height = 40,
}: { 
    height?: number,
}) {
    const { theme } = useTheme()
    const isDark = theme === 'dark'

    return (
        <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ display: 'flex', alignItems: 'center', height: height }}
        >
            <motion.img 
                src="/logo.svg" 
                alt="UltraNova AI" 
                whileHover={{ 
                    scale: 1.05,
                    filter: isDark
                        ? 'drop-shadow(0 0 25px rgba(108, 59, 255, 0.45)) brightness(1.2)' 
                        : 'invert(1) hue-rotate(180deg) brightness(0.2) contrast(1.3) saturate(1.5)'
                }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                style={{ 
                    height: height, 
                    width: 'auto', 
                    display: 'block',
                    cursor: 'pointer',
                    filter: isDark 
                        ? 'drop-shadow(0 0 15px rgba(108, 59, 255, 0.25)) brightness(1.1)' 
                        : 'invert(1) hue-rotate(180deg) brightness(0.4) contrast(1.15) saturate(1.2)'
                }} 
            />
        </motion.div>
    )
}
