import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingOverlay() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for 3 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 flex items-center justify-center bg-white z-50"
          >
            {/* You can customize loader here */}
            <motion.div
              className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.5 }}
              transition={{
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1], // nice ease
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Content */}
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-4xl font-bold">Page Content</h1>
      </div>
    </>
  );
}
