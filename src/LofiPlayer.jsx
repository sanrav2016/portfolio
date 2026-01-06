import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import profile from "../assets/img/profile.png";
import { FaPlay, FaPause } from "react-icons/fa";
import { useLofi } from './LofiProvider'

export default function LofiPlayer() {
    const { playing, loading, toggle, bannerVisible } = useLofi();

    const showOverlay = !playing && !loading && !bannerVisible;

    return (
        <motion.div
            initial={{ scale: 0.5, rotate: 20, opacity: 0 }}
            whileInView={{ rotate: 0, scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="hero-image-container"
        >
            <div
                onClick={toggle}
                style={{
                    cursor: "pointer",
                    display: "inline-block",
                    position: "relative",
                }}
            >
                <div className="hero-image-wrapper" />
                <div className="hero-image border-black dark:border-white">
                    <img src={profile} alt="Lofi Radio" />
                </div>

                <AnimatePresence>
                    {showOverlay && (
                        <OverlayIcon key="play">
                            <PlayIcon />
                        </OverlayIcon>
                    )}

                    {loading && (
                        <OverlayIcon key="loading" hoverDisabled>
                            <Spinner />
                        </OverlayIcon>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}

function OverlayIcon({
    children,
    hoverDisabled = false,
}) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            whileHover={hoverDisabled ? undefined : { scale: 1.2 }}
            whileTap={hoverDisabled ? undefined : { scale: 1.1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            style={{
                position: "absolute",
                inset: 0,
                display: "grid",
                placeItems: "center",
            }}
        >
            {children}
        </motion.div>
    );
}

function PlayIcon() {
    return (
        <motion.span
            initial={{ scale: 0.6 }}
            animate={{ scale: [1, 1.05, 1] }}
            whileHover={{ scale: 1.15 }}
            transition={{
                rotate: { type: "spring", stiffness: 400, damping: 18 },
                scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
            }}
            style={{ fontSize: 72, color: "white" }}
        >
            <FaPlay />
        </motion.span>
    );
}

function Spinner() {
    const radius = 30;
    const stroke = 15;
    const circumference = 2 * Math.PI * radius;
    const dashLength = circumference * 0.5;

    return (
        <motion.svg
            width={radius * 2 + stroke * 2}
            height={radius * 2 + stroke * 2}
            style={{ display: "block" }}
        >
            <motion.circle
                cx={radius + stroke}
                cy={radius + stroke}
                r={radius}
                fill="transparent"
                stroke="white"
                strokeWidth={stroke}
                strokeLinecap="round"
                strokeDasharray={`${dashLength} ${circumference}`}
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                style={{ originX: "50%", originY: "50%" }}
            />
        </motion.svg>
    );
}
