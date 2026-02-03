"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProductGalleryProps {
  productName: string;
  mainImage: string;
}

export function ProductGallery({ productName, mainImage }: ProductGalleryProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  // Generate 9 images (main + 8 variations)
  const images = [
    mainImage,
    mainImage,
    mainImage,
    mainImage,
    mainImage,
    mainImage,
    mainImage,
    mainImage,
    mainImage,
  ];

  return (
    <>
      <div className="space-y-4">
        {/* Header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-6 rounded-[2rem] bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-xl bg-gradient-purple-pink flex items-center justify-center text-white">
              <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="text-left">
              <h3 className="text-base font-black uppercase italic tracking-tighter">
                Galería de Imágenes
              </h3>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                9 fotos del producto
              </p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown size={24} className="text-slate-400" />
          </motion.div>
        </button>

        {/* Gallery Grid */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-3 gap-3 p-4 bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className="relative aspect-square rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 hover:border-primary transition-all group"
                  >
                    <Image
                      src={img}
                      alt={`${productName} - Imagen ${index + 1}`}
                      fill
                      className="object-contain p-2 group-hover:scale-110 transition-transform duration-300"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Fullscreen Image Modal */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 size-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-all"
            >
              <X size={24} />
            </button>

            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative w-full max-w-2xl aspect-square"
            >
              <Image
                src={images[selectedImage]}
                alt={`${productName} - Imagen ${selectedImage + 1}`}
                fill
                className="object-contain"
                unoptimized
              />
            </motion.div>

            {/* Image Counter */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
              <span className="text-white font-black text-sm">
                {selectedImage + 1} / {images.length}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
