import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { APP_URL } from "@/lib/constants";

// Animation Constants
const FADE_IN_DURATION = 0.5; // Fade in/out duration in seconds
const TEXT_ANIMATION_DELAY = 0.5; // Initial text animation delay in seconds
const TEXT_SCALE_DURATION = 0.5; // Text scale animation duration in seconds
const TITLE_SLIDE_DELAY = 0.7; // Title slide animation delay in seconds
const TITLE_SLIDE_DURATION = 0.5; // Title slide animation duration in seconds
const SUBTITLE_FADE_DELAY = 0.8; // Subtitle fade delay in seconds
const SUBTITLE_FADE_DURATION = 0.5; // Subtitle fade duration in seconds
const QUOTE_FADE_DELAY = 1.2; // Quote fade delay in seconds
const QUOTE_FADE_DURATION = 0.5; // Quote fade duration in seconds

// Particle System Constants
const NUM_STARS = 50; // Number of stars in the particle system
const MAX_DEPTH = 1500; // Maximum depth for 3D effect
const INITIAL_STAR_SPEED = 50; // Initial acceleration speed (hyperdrive jump)
const CONSTANT_STAR_SPEED = 15; // Constant speed after acceleration
const ACCELERATION_DURATION = 4000; // Duration of acceleration phase in ms
const STAR_PROJECTION_MULTIPLIER = 100; // Multiplier for 3D projection
const STAR_MAX_SIZE = 4; // Maximum size of stars
const TRAIL_OPACITY = 0.05; // Opacity of star trails (lower = longer trails)
const CANVAS_OPACITY = 0.8; // Overall canvas opacity

// Visual Constants
const BITCOIN_ORANGE = "#f08a5d"; // Bitcoin orange color
const OVERLAY_BACKGROUND = "black"; // Overlay background color
const TEXT_GLOW_BLUR = "15px"; // Text glow blur radius
const SUBTITLE_GLOW_BLUR = "8px"; // Subtitle glow blur radius

interface SaylorModeOverlayProps {
  isActive: boolean;
  onComplete: () => void;
}

export function SaylorModeOverlay({ isActive, onComplete }: SaylorModeOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationStartTime = useRef<number>(0);

  useEffect(() => {
    if (!isActive || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Use full viewport dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const stars: Array<{ x: number; y: number; z: number; px: number; py: number }> = [];
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    for (let i = 0; i < NUM_STARS; i++) {
      stars.push({
        x: (Math.random() - 0.5) * 2000,
        y: (Math.random() - 0.5) * 2000,
        z: Math.random() * MAX_DEPTH,
        px: 0,
        py: 0,
      });
    }

    let animationId: number;
    animationStartTime.current = Date.now();

    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - animationStartTime.current;

      // Calculate current speed based on acceleration phase
      let currentSpeed: number;
      if (elapsed < ACCELERATION_DURATION) {
        // Acceleration phase - start fast and slow down to constant speed
        const progress = elapsed / ACCELERATION_DURATION;
        const easeOut = 1 - Math.pow(1 - progress, 3); // Cubic ease-out
        currentSpeed = INITIAL_STAR_SPEED * (1 - easeOut) + CONSTANT_STAR_SPEED * easeOut;
      } else {
        // Constant speed phase
        currentSpeed = CONSTANT_STAR_SPEED;
      }

      ctx.fillStyle = `rgba(0, 0, 0, ${TRAIL_OPACITY})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        star.px = (star.x / star.z) * STAR_PROJECTION_MULTIPLIER + centerX;
        star.py = (star.y / star.z) * STAR_PROJECTION_MULTIPLIER + centerY;

        star.z -= currentSpeed;
        if (star.z <= 0) {
          star.x = (Math.random() - 0.5) * 2000;
          star.y = (Math.random() - 0.5) * 2000;
          star.z = MAX_DEPTH;
        }

        const x = (star.x / star.z) * STAR_PROJECTION_MULTIPLIER + centerX;
        const y = (star.y / star.z) * STAR_PROJECTION_MULTIPLIER + centerY;

        // Only render stars that are within viewport bounds
        if (x < -50 || x > canvas.width + 50 || y < -50 || y > canvas.height + 50) {
          return;
        }

        const size = (1 - star.z / MAX_DEPTH) * STAR_MAX_SIZE;
        const opacity = Math.max(0.1, 1 - star.z / MAX_DEPTH);

        // Only render visible stars with sufficient size
        if (size < 0.1 || opacity < 0.1) {
          return;
        }

        ctx.strokeStyle = `rgba(247, 147, 26, ${opacity})`;
        ctx.lineWidth = Math.max(0.5, size);
        ctx.beginPath();
        ctx.moveTo(star.px, star.py);
        ctx.lineTo(x, y);
        ctx.stroke();

        // Add bright center point
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.8})`;
        ctx.beginPath();
        ctx.arc(x, y, Math.max(0.5, size / 4), 0, Math.PI * 2);
        ctx.fill();

        // Add colored outer glow
        ctx.fillStyle = `rgba(247, 147, 26, ${opacity * 0.6})`;
        ctx.beginPath();
        ctx.arc(x, y, Math.max(1, size / 2), 0, Math.PI * 2);
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isActive]);

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: FADE_IN_DURATION }}
          className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden"
          style={{ backgroundColor: OVERLAY_BACKGROUND }}
          tabIndex={-1}
        >
          <canvas
            ref={canvasRef}
            className="pointer-events-none fixed inset-0 h-full w-full"
            style={{ opacity: CANVAS_OPACITY }}
          />

          <motion.div
            className="relative z-10 px-4 text-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: TEXT_ANIMATION_DELAY, duration: TEXT_SCALE_DURATION }}
          >
            <motion.img
              key="saylor-image"
              src="saylor.jpg"
              alt="Michael Saylor"
              className="mx-auto mb-4 size-10 rounded-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />

            <motion.h1
              key="title"
              className="mb-3 text-4xl font-black tracking-[0.15em]"
              style={{
                fontFamily: "'Orbitron', monospace",
                color: BITCOIN_ORANGE,
                textShadow: `0 0 ${TEXT_GLOW_BLUR} ${BITCOIN_ORANGE}, 0 0 30px ${BITCOIN_ORANGE}`,
              }}
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ delay: TITLE_SLIDE_DELAY, duration: TITLE_SLIDE_DURATION }}
            >
              SAYLOR MODE
            </motion.h1>

            <motion.div
              key="subtitle"
              className="space-y-1.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: SUBTITLE_FADE_DELAY, duration: SUBTITLE_FADE_DURATION }}
            >
              <p
                className="text-base font-medium"
                style={{
                  fontFamily: "'Orbitron', monospace",
                  color: BITCOIN_ORANGE,
                  textShadow: `0 0 ${SUBTITLE_GLOW_BLUR} ${BITCOIN_ORANGE}`,
                }}
              >
                Reprices everything for $21M per bitcoin
              </p>
            </motion.div>

            <motion.div
              key="learn-more"
              className="mt-6 font-medium"
              style={{
                fontFamily: "'Orbitron', monospace",
                color: BITCOIN_ORANGE,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: QUOTE_FADE_DELAY, duration: QUOTE_FADE_DURATION }}
            >
              <motion.a
                href={`${APP_URL}/saylor-mode`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded underline transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-50"
                initial={{ pointerEvents: "none" }}
                animate={{ pointerEvents: "auto" }}
                transition={{ delay: QUOTE_FADE_DELAY + QUOTE_FADE_DURATION }}
              >
                Learn more
              </motion.a>
            </motion.div>

            <motion.button
              key="continue-button"
              onClick={onComplete}
              className="mt-8 rounded-lg border-2 px-8 py-3 font-bold transition-all duration-200 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-75"
              style={{
                fontFamily: "'Orbitron', monospace",
                backgroundColor: BITCOIN_ORANGE,
                borderColor: BITCOIN_ORANGE,
                color: "black",
                boxShadow: `0 0 20px ${BITCOIN_ORANGE}40`,
              }}
              initial={{ opacity: 0, y: 20, pointerEvents: "none" }}
              animate={{ opacity: 1, y: 0, pointerEvents: "auto" }}
              transition={{ delay: QUOTE_FADE_DELAY + 0.3, duration: 0.5 }}
              whileHover={{
                boxShadow: `0 0 30px ${BITCOIN_ORANGE}60`,
              }}
              whileTap={{ scale: 0.95 }}
            >
              CONTINUE
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
