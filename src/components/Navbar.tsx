"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Globe } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="fixed top-0 w-full bg-[#FAF9F6]/80 backdrop-blur-md z-50 border-b border-[#2E5A27]/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <Globe className="h-8 w-8 text-[#2E5A27] group-hover:text-[#D97725] transition-colors duration-500" />
              <div className="flex flex-col">
                <span className="font-bold text-2xl tracking-widest text-[#1A1A1A] leading-none uppercase">Ubuntu</span>
                <span className="text-[10px] tracking-[0.2em] text-[#D97725] font-semibold mt-1">BAĞLANTI • FIRSAT • GELECEK</span>
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-8 items-center">
            <Link href="#nasil-calisir" className="text-sm font-medium text-[#1A1A1A] hover:text-[#2E5A27] transition-colors relative group">
              Nasıl Çalışır?
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#2E5A27] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="#vitrin" className="text-sm font-medium text-[#1A1A1A] hover:text-[#2E5A27] transition-colors relative group">
              Vitrin
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#2E5A27] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/kayit" className="text-sm font-medium px-4 py-2 text-[#2E5A27] border border-[#2E5A27] rounded-full hover:bg-[#2E5A27] hover:text-white transition-all duration-300">
              Öğrenci Kayıt
            </Link>
            <Link href="/giris" className="text-sm font-medium px-5 py-2.5 bg-[#D97725] text-white rounded-full hover:bg-[#c36a21] shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
              Giriş Yap
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu} className="text-[#1A1A1A] hover:text-[#2E5A27] focus:outline-none">
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
            className="md:hidden bg-white border-b border-[#2E5A27]/10 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-4 flex flex-col">
              <Link href="#nasil-calisir" onClick={toggleMenu} className="block text-base font-medium text-[#1A1A1A] hover:text-[#2E5A27]">Nasıl Çalışır?</Link>
              <Link href="#vitrin" onClick={toggleMenu} className="block text-base font-medium text-[#1A1A1A] hover:text-[#2E5A27]">Vitrin</Link>
              <div className="h-px bg-gray-200 w-full my-2"></div>
              <Link href="/kayit" onClick={toggleMenu} className="block text-center text-base font-medium px-4 py-2 text-[#2E5A27] border border-[#2E5A27] rounded-full">Öğrenci Kayıt</Link>
              <Link href="/giris" onClick={toggleMenu} className="block text-center text-base font-medium px-4 py-2 bg-[#D97725] text-white rounded-full">Giriş Yap</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
