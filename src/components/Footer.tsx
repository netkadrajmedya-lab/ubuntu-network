"use client";

import Link from "next/link";
import { Globe2, Globe } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="w-full bg-[#0D0D0D] text-white py-16 border-t border-white/10 relative overflow-hidden">
      {/* Hafif Arka Plan Parıltısı */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-[#2E5A27]/10 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center">
        {/* Logo & Marka */}
        <div className="flex items-center gap-2 mb-3">
          <Globe2 className="h-10 w-10 text-[#2E5A27]" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-widest uppercase">
          Ubuntu
        </h2>
        <p className="text-[#D97725] text-xs sm:text-sm tracking-[0.3em] font-semibold mt-1 mb-8 uppercase">
          {t("footer_slogan")}
        </p>

        {/* Hızlı Gezinme Linkleri */}
        <div className="flex flex-wrap justify-center gap-6 sm:gap-8 mb-10 text-sm">
          <Link href="/#nasil-calisir" className="text-gray-400 hover:text-white transition-colors">
            {t("nav_how_it_works")}
          </Link>
          <Link href="/#vitrin" className="text-gray-400 hover:text-white transition-colors">
            {t("nav_vitrin")}
          </Link>
          <Link href="/hakkimizda" className="text-gray-400 hover:text-white transition-colors">
            {t("nav_about")}
          </Link>
          <Link href="/kayit" className="text-gray-400 hover:text-white transition-colors">
            {t("nav_register")}
          </Link>
          <Link href="/giris" className="text-gray-400 hover:text-white transition-colors">
            {t("nav_login")}
          </Link>
        </div>

        {/* Ayırıcı ve Premium İmza Bölümü */}
        <div className="w-full pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          {/* Telif Hakkı */}
          <p className="order-2 md:order-1 text-center md:text-left text-gray-500">
            &copy; {new Date().getFullYear()} {t("footer_rights")}
          </p>

          {/* Developed by Net Kadraj Medya Rozeti */}
          <div className="order-1 md:order-2 flex flex-wrap items-center justify-center gap-2.5 bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 hover:border-[#D97725]/40 px-4 py-2 rounded-full shadow-lg transition-all duration-300">
            <span className="text-gray-400 font-medium">Developed by</span>
            <a
              href="https://www.netkadraj.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-white hover:text-[#D97725] transition-colors"
              title="Net Kadraj Medya Web Sitesi"
            >
              Net Kadraj Medya
            </a>
            <span className="text-gray-600 select-none">•</span>
            <a
              href="https://www.instagram.com/netkadraj"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-gray-300 hover:text-[#E1306C] transition-colors font-medium group"
              title="Net Kadraj Medya Instagram: @netkadraj"
            >
              <svg 
                className="w-3.5 h-3.5 text-[#E1306C] group-hover:scale-110 transition-transform" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
              <span className="text-[#D97725] group-hover:text-[#E1306C] font-semibold transition-colors">@netkadraj</span>
            </a>
            <span className="text-gray-600 select-none hidden sm:inline">•</span>
            <a
              href="https://www.netkadraj.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1 text-gray-400 hover:text-[#2E5A27] transition-colors font-medium group"
              title="www.netkadraj.com"
            >
              <Globe className="w-3.5 h-3.5 text-[#2E5A27] group-hover:scale-110 transition-transform" />
              <span className="hover:underline">www.netkadraj.com</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
