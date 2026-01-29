import { motion } from "framer-motion";

interface PlusMinusIconProps {
    isOpen: boolean;
    size?: number;
    color?: string;
}

export default function PlusMinusIcon({
                                          isOpen,
                                          size = 24,
                                          color = "currentColor",
                                      }: PlusMinusIconProps) {
    const verticalVariants = {
        closed: { scaleY: 1, opacity: 1 },
        open: { scaleY: 0, opacity: 0 },
    };

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            {/* Horizontal line (always visible) */}
            <line x1="5" y1="12" x2="19" y2="12" />

            {/* Vertical line (animates scaleY) */}
            <motion.line
                x1="12"
                y1="5"
                x2="12"
                y2="19"
                variants={verticalVariants}
                initial={false}
                animate={isOpen ? "open" : "closed"}
                transition={{ duration: 0.4, ease: "circInOut" }}
                style={{ originY: "50%" }}
            />
        </svg>
    );
}
