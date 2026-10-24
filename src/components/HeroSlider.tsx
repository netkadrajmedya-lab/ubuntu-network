"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Search, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const { t } = useLanguage();

  const slides = [
    {
      id: 1,
      badge: t("slide1_badge"),
      title: t("slide1_title"),
      subtitle: t("slide1_subtitle"),
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2850&q=80",
      primaryButton: { text: t("slide1_btn_primary"), href: "#vitrin", icon: <Search className="w-5 h-5" /> },
      secondaryButton: { text: t("slide1_btn_secondary"), href: "#nasil-calisir" }
    },
    {
      id: 2,
      badge: t("slide2_badge"),
      title: t("slide2_title"),
      subtitle: t("slide2_subtitle"),
      image: "https://images.unsplash.com/photo-1515169067868-5387ec356754?ixlib=rb-4.0.3&auto=format&fit=crop&w=2850&q=80",
      primaryButton: { text: t("slide2_btn_primary"), href: "/kayit", icon: <ArrowRight className="w-5 h-5" /> },
      secondaryButton: { text: t("slide2_btn_secondary"), href: "#vitrin" }
    },
    {
      id: 3,
      badge: t("slide3_badge"),
      title: t("slide3_title"),
      subtitle: t("slide3_subtitle"),
      image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=2850&q=80",
      primaryButton: { text: t("slide3_btn_primary"), href: "#nasil-calisir", icon: <ShieldCheck className="w-5 h-5" /> },
      secondaryButton: { text: t("slide3_btn_secondary"), href: "/kayit" }
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 7000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative h-screen min-h-[700px] w-full overflow-hidden bg-[#1A1A1A]">
      <AnimatePresence initial={false}>
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slides[current].image})` }}
          />
          {/* Kaliteli, daha koyu bir gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/20" />
          <div className="absolute inset-0 bg-[#2E5A27]/20 mix-blend-multiply" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="max-w-3xl"
            >
              <div className="flex items-center gap-4 mb-6">
                <motion.span 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#D97725] text-white text-xs font-bold tracking-widest shadow-[0_0_15px_rgba(217,119,37,0.5)] uppercase"
                >
                  {slides[current].badge}
                </motion.span>
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="text-gray-300 text-sm font-medium tracking-widest uppercase hidden sm:block"
                >
                  UBUNTU NETWORK
                </motion.span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-[1.1] tracking-tight">
                {slides[current].title}
              </h1>

              <p className="text-lg sm:text-xl text-gray-200 mb-10 leading-relaxed font-light">
                {slides[current].subtitle}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href={slides[current].primaryButton.href}
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#2E5A27] text-white font-bold text-base hover:bg-[#3d7734] shadow-[0_4px_20px_rgba(46,90,39,0.4)] transition-all duration-300 hover:scale-105"
                >
                  {slides[current].primaryButton.text}
                  {slides[current].primaryButton.icon}
                </Link>

                <Link
                  href={slides[current].secondaryButton.href}
                  className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-base backdrop-blur-md border border-white/20 transition-all duration-300 hover:scale-105"
                >
                  {slides[current].secondaryButton.text}
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Slider Kontrolleri */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2.5 rounded-full transition-all duration-500 ${
              current === index ? "w-10 bg-[#D97725]" : "w-2.5 bg-white/40 hover:bg-white/70"
            }`}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
