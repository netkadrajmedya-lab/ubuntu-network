"use client";

import HeroSlider from "@/components/HeroSlider";
import PremiumVitrin from "@/components/PremiumVitrin";
import Footer from "@/components/Footer";
import { CheckCircle2, ShieldCheck, Zap, Users, Code, PenTool, Globe2, Briefcase, ChevronRight, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function Home() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-[#FAF9F6]">
      <HeroSlider />
      
      {/* Kategori Barı */}
      <section className="bg-white py-12 border-b border-gray-100 shadow-sm relative z-20 -mt-6 rounded-t-3xl max-w-[96%] mx-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h3 className="text-sm font-bold tracking-widest text-gray-400 uppercase">
              {t("cat_title")}
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: t("cat_it_name"), icon: <Code className="w-6 h-6 text-[#2E5A27]" />, desc: t("cat_it_desc") },
              { name: t("cat_design_name"), icon: <PenTool className="w-6 h-6 text-[#D97725]" />, desc: t("cat_design_desc") },
              { name: t("cat_lang_name"), icon: <Globe2 className="w-6 h-6 text-[#2E5A27]" />, desc: t("cat_lang_desc") },
              { name: t("cat_marketing_name"), icon: <Briefcase className="w-6 h-6 text-[#D97725]" />, desc: t("cat_marketing_desc") },
            ].map((cat, i) => (
              <a href="#vitrin" key={i} className="group flex flex-col items-center justify-center p-6 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-xl hover:shadow-[#2E5A27]/10 transition-all duration-300 border border-gray-100 hover:border-[#2E5A27]/30 hover:-translate-y-1">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                  {cat.icon}
                </div>
                <h4 className="text-lg font-bold text-[#1A1A1A] mb-1">{cat.name}</h4>
                <p className="text-xs text-gray-500 font-medium">{cat.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Yeni Ultra Premium Vitrin Bileşeni */}
      <PremiumVitrin />

      {/* Nasıl Çalışır Section */}
      <section id="nasil-calisir" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-[#2E5A27] font-bold tracking-widest text-sm mb-3 block">
              {t("how_badge")}
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#1A1A1A] mb-6 leading-tight">
              {t("how_title")}
            </h2>
            <p className="text-xl text-gray-600 font-light">
              {t("how_desc")}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Aradaki bağlantı çizgisi (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-[#2E5A27]/20 via-[#D97725]/20 to-[#2E5A27]/20 z-0"></div>

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-white rounded-2xl border-2 border-[#2E5A27] shadow-[0_0_30px_rgba(46,90,39,0.15)] flex items-center justify-center mb-8 rotate-3 hover:rotate-0 transition-transform">
                <Search className="w-10 h-10 text-[#2E5A27]" />
              </div>
              <h3 className="text-2xl font-bold text-[#1A1A1A] mb-4">
                {t("how_step1_title")}
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                {t("how_step1_desc")}
              </p>
            </div>
            
            <div className="relative z-10 flex flex-col items-center text-center mt-8 md:mt-0">
              <div className="w-24 h-24 bg-[#D97725] rounded-2xl shadow-[0_0_30px_rgba(217,119,37,0.3)] flex items-center justify-center mb-8 -rotate-3 hover:rotate-0 transition-transform">
                <Briefcase className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#1A1A1A] mb-4">
                {t("how_step2_title")}
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                {t("how_step2_desc")}
              </p>
            </div>
            
            <div className="relative z-10 flex flex-col items-center text-center mt-8 md:mt-0">
              <div className="w-24 h-24 bg-white rounded-2xl border-2 border-[#2E5A27] shadow-[0_0_30px_rgba(46,90,39,0.15)] flex items-center justify-center mb-8 rotate-3 hover:rotate-0 transition-transform">
                <ShieldCheck className="w-10 h-10 text-[#2E5A27]" />
              </div>
              <h3 className="text-2xl font-bold text-[#1A1A1A] mb-4">
                {t("how_step3_title")}
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                {t("how_step3_desc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* İki Yönlü CTA Section */}
      <section className="bg-gray-50 py-20 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-12 rounded-3xl shadow-xl border border-[#2E5A27]/10 flex flex-col items-start hover:border-[#2E5A27]/50 transition-colors">
              <span className="bg-[#2E5A27]/10 text-[#2E5A27] px-4 py-2 rounded-full text-sm font-bold mb-6">
                {t("cta_emp_badge")}
              </span>
              <h3 className="text-3xl font-extrabold text-[#1A1A1A] mb-4">
                {t("cta_emp_title")}
              </h3>
              <p className="text-gray-600 mb-8 text-lg">
                {t("cta_emp_desc")}
              </p>
              <Link href="#vitrin" className="mt-auto px-8 py-4 bg-[#1A1A1A] text-white rounded-full font-bold hover:bg-[#2E5A27] transition-colors inline-flex items-center gap-2">
                {t("cta_emp_btn")} <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            
            <div className="bg-[#2E5A27] p-12 rounded-3xl shadow-xl border border-[#2E5A27] flex flex-col items-start relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-[50px] pointer-events-none"></div>
              <span className="bg-white/20 text-white px-4 py-2 rounded-full text-sm font-bold mb-6 backdrop-blur-sm">
                {t("cta_stu_badge")}
              </span>
              <h3 className="text-3xl font-extrabold text-white mb-4">
                {t("cta_stu_title")}
              </h3>
              <p className="text-green-100 mb-8 text-lg">
                {t("cta_stu_desc")}
              </p>
              <Link href="/kayit" className="mt-auto px-8 py-4 bg-white text-[#2E5A27] rounded-full font-bold hover:bg-[#D97725] hover:text-white transition-colors inline-flex items-center gap-2 shadow-lg">
                {t("cta_stu_btn")} <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}

function Search(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
}
