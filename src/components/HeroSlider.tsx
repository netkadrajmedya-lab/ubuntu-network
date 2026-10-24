"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Search, ShieldCheck } from "lucide-react";
import Link from "next/link";

const slides = [
  {
    id: 1,
    badge: "İŞVERENLER İÇİN",
    title: "Türkiye'nin En Yetenekli Üniversite Öğrencileri",
    subtitle: "Yabancı dil bilen, vizyoner ve alanında uzmanlaşmış genç yetenekleri premium vitrinimizde keşfedin. Projeleriniz için en doğru adayı bulun ve hemen teklif isteyin.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2850&q=80",
    primaryButton: { text: "Yetenekleri Keşfet", href: "#vitrin", icon: <Search className="w-5 h-5" /> },
    secondaryButton: { text: "Nasıl Çalışır?", href: "#nasil-calisir" }
  },
  {
    id: 2,
    badge: "ÖĞRENCİLER İÇİN",
    title: "Kariyerini Bugünden İnşa Etmeye Başla",
    subtitle: "Sadece bir özgeçmiş değil, senin vitrinin. Yeteneklerini ve bildiğin dilleri kurumsal şirketlere göster, doğru projelerle eşleş ve geleceğini şekillendir.",
    image: "https://images.unsplash.com/photo-1515169067868-5387ec356754?ixlib=rb-4.0.3&auto=format&fit=crop&w=2850&q=80",
    primaryButton: { text: "Premium Vitrin'e Katıl", href: "/kayit", icon: <ArrowRight className="w-5 h-5" /> },
    secondaryButton: { text: "Platformu İncele", href: "#vitrin" }
  },
  {
    id: 3,
    badge: "GÜVENLİ & KURUMSAL",
    title: "Bağlantı • Fırsat • Gelecek",
    subtitle: "Ubuntu Network, işverenler ile öğrenciler arasındaki köprüdür. İletişim bilgileri gizli tutulur, süreç profesyonel yöneticilerimiz tarafından güvenle yönetilir.",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=2850&q=80",
    primaryButton: { text: "Sistemi İncele", href: "#nasil-calisir", icon: <ShieldCheck className="w-5 h-5" /> },
    secondaryButton: { text: "Öğrenci Kayıt", href: "/kayit" }
  }
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 7000);
    return () => clearInterval(timer);
  }, []);

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
              <p className="text-lg md:text-2xl text-gray-300 mb-10 leading-relaxed font-light max-w-2xl">
                {slides[current].subtitle}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-5">
                <Link href={slides[current].primaryButton.href} className="group flex items-center justify-center gap-3 bg-[#2E5A27] text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#3A6B35] transition-all duration-300 shadow-[0_0_20px_rgba(46,90,39,0.4)] hover:shadow-[0_0_30px_rgba(46,90,39,0.6)] hover:-translate-y-1">
                  {slides[current].primaryButton.text}
                  <span className="group-hover:translate-x-1 transition-transform">
                    {slides[current].primaryButton.icon}
                  </span>
                </Link>
                <Link href={slides[current].secondaryButton.href} className="flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/20 hover:border-white/40 transition-all duration-300">
                  {slides[current].secondaryButton.text}
                </Link>
              </div>

              {/* Güven Barları / Quick Stats (sadece ilk slaytta animasyonlu gelsin diye veya statik kalabilir) */}
              <div className="mt-16 grid grid-cols-3 gap-4 border-t border-white/10 pt-8 max-w-2xl">
                <div>
                  <div className="text-3xl font-bold text-white mb-1">200+</div>
                  <div className="text-sm text-gray-400 font-medium">Üniversite Ağı</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#D97725] mb-1">%100</div>
                  <div className="text-sm text-gray-400 font-medium">Onaylı Profiller</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#2E5A27] mb-1">7/24</div>
                  <div className="text-sm text-gray-400 font-medium">Kurumsal İletişim</div>
                </div>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Slider Indicators */}
      <div className="absolute bottom-10 left-0 right-0 z-20 flex justify-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-16 h-1.5 rounded-full transition-all duration-500 ${
              current === index ? "bg-[#D97725]" : "bg-white/20 hover:bg-white/40"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
