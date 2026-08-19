import type { Variants } from 'framer-motion';

export const smoothEase = [0.22, 1, 0.36, 1] as const;

export const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.65,
            ease: smoothEase,
            staggerChildren: 0.1,
        },
    },
};

export const cardVariants: Variants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.55, ease: smoothEase },
    },
};