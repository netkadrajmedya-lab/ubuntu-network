"use client";

import { motion } from "framer-motion";
import { 
  Globe, Sparkles, Award, GraduationCap, Briefcase, Languages, 
  ShieldCheck, HeartHandshake, CheckCircle2, ArrowRight, Quote, 
  MapPin, Send 
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function HakkimizdaPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1A1A1A] pt-28 pb-20 overflow-hidden">
      
      {/* 1. HERO & MANİFESTO BÖLÜMÜ */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#0A0A0A] text-white">
        <div className="absolute top-[-20%] left-[-10%] w-[45rem] h-[45rem] bg-[#2E5A27] rounded-full blur-[220px] opacity-25 pointer-events-none"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[45rem] h-[45rem] bg-[#D97725] rounded-full blur-[220px] opacity-20 pointer-events-none"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[#D97725] text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4" /> {t("about_hero_badge")}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-8 leading-tight"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D97725] via-amber-200 to-[#2E5A27]">
              {t("about_hero_title")}
            </span>
          </motion.h1>

          {/* Kullanıcının İstediği Özel Tanıtım Metni */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-8 sm:p-12 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl relative shadow-2xl text-left"
          >
            <Quote className="w-12 h-12 text-[#D97725]/30 absolute top-4 left-6 -rotate-12" />
            <p className="text-lg sm:text-2xl font-light text-gray-200 leading-relaxed italic relative z-10 pl-6">
              &quot;{t("about_hero_desc")}&quot;
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. DEĞERLER & UBUNTU FELSEFESİ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2E5A27]/10 text-[#2E5A27] text-xs font-bold uppercase tracking-wider mb-3">
            {t("about_philosophy_badge")}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A1A]">
            {t("about_philosophy_title")}
          </h2>
          <p className="text-gray-600 mt-4 text-base leading-relaxed">
            {t("about_philosophy_desc")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-gray-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
            <div className="w-14 h-14 bg-[#2E5A27]/10 text-[#2E5A27] rounded-2xl flex items-center justify-center mb-6">
              <Globe className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">{t("about_card1_title")}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {t("about_card1_desc")}
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
            <div className="w-14 h-14 bg-[#D97725]/10 text-[#D97725] rounded-2xl flex items-center justify-center mb-6">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">{t("about_card2_title")}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {t("about_card2_desc")}
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
            <div className="w-14 h-14 bg-[#2E5A27]/10 text-[#2E5A27] rounded-2xl flex items-center justify-center mb-6">
              <HeartHandshake className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">{t("about_card3_title")}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {t("about_card3_desc")}
            </p>
          </div>
        </div>
      </section>

      {/* 3. KURUCUMUZ BÖLÜMÜ (MUHAMMED MANSOUR SAY) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#111111] text-white relative overflow-hidden my-12">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#2E5A27_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D97725]/10 border border-[#D97725]/20 text-[#D97725] text-xs font-bold uppercase tracking-wider mb-3">
              {t("founder_section_badge")}
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              {t("founder_section_title")}
            </h2>
          </div>

          <div className="bg-[#1A1A1A] border border-white/10 rounded-3xl p-8 sm:p-12 lg:p-16 shadow-2xl flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            
            {/* Kurucu Fotoğrafı & Prestij Kartı */}
            <div className="w-full lg:w-5/12 flex flex-col items-center">
              <div className="relative group">
                {/* Glow Efekti */}
                <div className="absolute -inset-2 bg-gradient-to-r from-[#2E5A27] to-[#D97725] rounded-3xl blur-xl opacity-50 group-hover:opacity-80 transition duration-700"></div>

                <div className="relative w-64 h-80 sm:w-72 sm:h-96 rounded-3xl overflow-hidden border-2 border-white/20 bg-gray-900 shadow-2xl">
                  {/* Fotoğraf (Önce /founder.jpg denenir, yoksa /founder.png, yoksa zarif portre görseli) */}
                  <img 
                    src="/founder.jpg"
                    alt="Muhammed Mansour Say"
                    onError={(e: any) => {
                      if (e.currentTarget.src.indexOf('/founder.png') === -1 && e.currentTarget.src.indexOf('unsplash') === -1) {
                        e.currentTarget.src = '/founder.png';
                      } else {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80";
                      }
                    }}
                    className="w-full h-full object-cover object-top filter contrast-105 group-hover:scale-105 transition-all duration-700"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>

                  <div className="absolute bottom-4 left-4 right-4 text-center">
                    <span className="bg-[#2E5A27] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {t("founder_name")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bilgi Notu */}
              <p className="text-[11px] text-gray-500 mt-4 text-center italic">
                {t("founder_photo_note")}
              </p>
            </div>

            {/* Kurucu Biyografi ve Başarı Detayı */}
            <div className="w-full lg:w-7/12 space-y-6">
              <div>
                <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {t("founder_name")}
                </h3>
                <p className="text-[#D97725] font-bold text-sm sm:text-base mt-1 tracking-wide">
                  {t("founder_role")}
                </p>
              </div>

              {/* Kullanıcının Verdiği Birebir Metinler */}
              <div className="space-y-4 text-gray-300 text-sm sm:text-base leading-relaxed font-light">
                <p className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                  &quot;{t("founder_bio_1")}&quot;
                </p>

                <p className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                  &quot;{t("founder_bio_2")}&quot;
                </p>

                <p className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                  &quot;{t("founder_bio_3")}&quot;
                </p>
              </div>

              {/* 4 DİL ROZETLERİ */}
              <div className="pt-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Languages className="w-4 h-4 text-[#D97725]" /> {t("founder_langs_title")}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-black/40 border border-white/10 rounded-2xl text-center">
                    <span className="text-xl block mb-1">🇹🇷</span>
                    <span className="text-xs font-bold text-white block">Türkçe</span>
                    <span className="text-[10px] text-emerald-400 font-semibold">{t("founder_badge_c2")}</span>
                  </div>
                  <div className="p-3 bg-black/40 border border-white/10 rounded-2xl text-center">
                    <span className="text-xl block mb-1">🇬🇧</span>
                    <span className="text-xs font-bold text-white block">English</span>
                    <span className="text-[10px] text-emerald-400 font-semibold">{t("founder_badge_c2")}</span>
                  </div>
                  <div className="p-3 bg-black/40 border border-white/10 rounded-2xl text-center">
                    <span className="text-xl block mb-1">🇫🇷</span>
                    <span className="text-xs font-bold text-white block">Français</span>
                    <span className="text-[10px] text-emerald-400 font-semibold">{t("founder_badge_c2")}</span>
                  </div>
                  <div className="p-3 bg-black/40 border border-white/10 rounded-2xl text-center">
                    <span className="text-xl block mb-1">🇸🇦</span>
                    <span className="text-xs font-bold text-white block">العربية</span>
                    <span className="text-[10px] text-emerald-400 font-semibold">{t("founder_badge_c2")}</span>
                  </div>
                </div>
              </div>

              {/* Kurumsal Başarı Kartları */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 text-xs text-gray-300">
                  <GraduationCap className="w-5 h-5 text-[#2E5A27] shrink-0" />
                  <span>{t("founder_cred_uni")}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 text-xs text-gray-300">
                  <Award className="w-5 h-5 text-[#D97725] shrink-0" />
                  <span>{t("founder_cred_pres")}</span>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/#vitrin"
                  className="px-6 py-3.5 rounded-full bg-[#2E5A27] text-white font-bold text-sm hover:bg-[#396e31] transition-all text-center flex items-center justify-center gap-2 shadow-lg"
                >
                  {t("nav_vitrin")} <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/kayit"
                  className="px-6 py-3.5 rounded-full bg-[#D97725] text-white font-bold text-sm hover:bg-[#c36a21] transition-all text-center flex items-center justify-center gap-2 shadow-lg"
                >
                  {t("nav_register")}
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#111111] py-16 border-t border-white/10 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <Globe className="h-12 w-12 text-[#2E5A27] mb-4" />
          <h2 className="text-3xl font-bold text-white mb-2 tracking-widest uppercase">Ubuntu</h2>
          <p className="text-[#D97725] text-sm tracking-[0.3em] font-semibold mb-10">
            {t("footer_slogan")}
          </p>
          
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <Link href="/#nasil-calisir" className="text-gray-400 hover:text-white transition-colors">
              {t("nav_how_it_works")}
            </Link>
            <Link href="/#vitrin" className="text-gray-400 hover:text-white transition-colors">
              {t("nav_vitrin")}
            </Link>
            <Link href="/kayit" className="text-gray-400 hover:text-white transition-colors">
              {t("nav_register")}
            </Link>
            <Link href="/giris" className="text-gray-400 hover:text-white transition-colors">
              {t("nav_login")}
            </Link>
          </div>

          <p className="text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} {t("footer_rights")}
          </p>
        </div>
      </footer>
    </div>
  );
}
