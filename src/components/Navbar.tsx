"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Globe, ChevronDown, Check } from "lucide-react";
import { useLanguage, LANGUAGES } from "@/context/LanguageContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const { currentLang, setLanguage, t } = useLanguage();

  const activeLangObj = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="fixed top-0 w-full bg-[#FAF9F6]/85 backdrop-blur-md z-50 border-b border-[#2E5A27]/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2.5 group">
              <Globe className="h-8 w-8 text-[#2E5A27] group-hover:text-[#D97725] transition-colors duration-500" />
              <div className="flex flex-col">
                <span className="font-extrabold text-2xl tracking-widest text-[#1A1A1A] leading-none uppercase">Ubuntu</span>
                <span className="text-[9px] tracking-[0.25em] text-[#D97725] font-bold mt-1">BAĞLANTI • FIRSAT • GELECEK</span>
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex space-x-7 items-center">
            <Link href="/#nasil-calisir" className="text-sm font-semibold text-[#1A1A1A] hover:text-[#2E5A27] transition-colors relative group">
              {t("nav_how_it_works")}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#2E5A27] transition-all duration-300 group-hover:w-full"></span>
            </Link>

            <Link href="/#vitrin" className="text-sm font-semibold text-[#1A1A1A] hover:text-[#2E5A27] transition-colors relative group">
              {t("nav_vitrin")}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#2E5A27] transition-all duration-300 group-hover:w-full"></span>
            </Link>

            <Link href="/hakkimizda" className="text-sm font-semibold text-[#1A1A1A] hover:text-[#2E5A27] transition-colors relative group">
              {t("nav_about")}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#2E5A27] transition-all duration-300 group-hover:w-full"></span>
            </Link>

            {/* Çoklu Dil Seçici Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 bg-white hover:border-[#2E5A27] text-xs font-bold text-gray-800 transition-all shadow-sm"
              >
                <span>{activeLangObj.flag}</span>
                <span className="uppercase">{activeLangObj.code}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isLangOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 overflow-hidden"
                  >
                    <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-gray-400 border-b border-gray-100 mb-1">
                      Dil Seçimi / Language
                    </div>
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setIsLangOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-semibold hover:bg-gray-50 transition-colors ${
                          currentLang === lang.code ? 'text-[#2E5A27] font-bold bg-[#2E5A27]/5' : 'text-gray-700'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-base">{lang.flag}</span>
                          <span>{lang.nativeName}</span>
                          <span className="text-[10px] text-gray-400 font-normal">({lang.name})</span>
                        </span>
                        {currentLang === lang.code && <Check className="w-3.5 h-3.5 text-[#2E5A27]" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/kayit" className="text-sm font-bold px-4 py-2 text-[#2E5A27] border-2 border-[#2E5A27] rounded-full hover:bg-[#2E5A27] hover:text-white transition-all duration-300">
              {t("nav_register")}
            </Link>

            <Link href="/giris" className="text-sm font-bold px-5 py-2.5 bg-[#D97725] text-white rounded-full hover:bg-[#c36a21] shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
              {t("nav_login")}
            </Link>
          </nav>

          {/* Mobile menu and mobile lang button */}
          <div className="lg:hidden flex items-center gap-2">
            {/* Mobile Lang Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsLangOpen(!isLangOpen);
                  if (isOpen) setIsOpen(false);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 bg-white text-xs font-bold shadow-sm active:scale-95 transition-transform"
                aria-label="Dil Seçimi"
              >
                <span>{activeLangObj.flag}</span>
                <span className="uppercase">{activeLangObj.code}</span>
                <ChevronDown className={`w-3 h-3 text-gray-500 transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isLangOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 overflow-hidden"
                  >
                    <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-gray-400 border-b border-gray-100 mb-1">
                      Dil Seçimi / Language
                    </div>
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => {
                          setLanguage(lang.code);
                          setIsLangOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold hover:bg-gray-50 transition-colors ${
                          currentLang === lang.code ? 'text-[#2E5A27] font-bold bg-[#2E5A27]/5' : 'text-gray-700'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-base">{lang.flag}</span>
                          <span>{lang.nativeName}</span>
                          <span className="text-[10px] text-gray-400 font-normal">({lang.name})</span>
                        </span>
                        {currentLang === lang.code && <Check className="w-3.5 h-3.5 text-[#2E5A27]" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button 
              type="button"
              onClick={() => {
                toggleMenu();
                if (isLangOpen) setIsLangOpen(false);
              }} 
              className="text-[#1A1A1A] hover:text-[#2E5A27] focus:outline-none p-2 rounded-xl hover:bg-gray-100 transition-colors"
              aria-label="Menüyü Aç/Kapat"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white/95 backdrop-blur-xl border-b border-[#2E5A27]/10 overflow-hidden shadow-xl"
          >
            <div className="px-5 pt-3 pb-6 space-y-3.5 flex flex-col">
              <Link href="/#nasil-calisir" onClick={toggleMenu} className="block py-2 text-base font-semibold text-[#1A1A1A] hover:text-[#2E5A27]">
                {t("nav_how_it_works")}
              </Link>
              <Link href="/#vitrin" onClick={toggleMenu} className="block py-2 text-base font-semibold text-[#1A1A1A] hover:text-[#2E5A27]">
                {t("nav_vitrin")}
              </Link>
              <Link href="/hakkimizda" onClick={toggleMenu} className="block py-2 text-base font-semibold text-[#1A1A1A] hover:text-[#2E5A27]">
                {t("nav_about")}
              </Link>
              
              <div className="h-px bg-gray-100 w-full my-1"></div>
              
              {/* Mobil Dil Seçimi Butonları */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">Dil Seçimi / Language</p>
                <div className="grid grid-cols-2 gap-2">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsOpen(false);
                      }}
                      className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all ${
                        currentLang === lang.code ? 'bg-[#2E5A27] text-white border-[#2E5A27] shadow-sm' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <span>{lang.flag}</span> <span>{lang.nativeName}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-px bg-gray-100 w-full my-1"></div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <Link href="/kayit" onClick={toggleMenu} className="block text-center text-sm font-bold px-4 py-3 text-[#2E5A27] border-2 border-[#2E5A27] rounded-full hover:bg-[#2E5A27] hover:text-white transition-all">
                  {t("nav_register")}
                </Link>
                <Link href="/giris" onClick={toggleMenu} className="block text-center text-sm font-bold px-4 py-3 bg-[#D97725] text-white rounded-full hover:bg-[#c36a21] shadow-md transition-all">
                  {t("nav_login")}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
