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
            <Sparkles className="w-4 h-4" /> KÜRESEL VİZYON & ORTAK DEĞERLER
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-8 leading-tight"
          >
            Geleceği İnşa Eden <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D97725] via-amber-200 to-[#2E5A27]">
              Sınırları Aşan Bir Hareketiz
            </span>
          </motion.h1>

          {/* Kullanıcının İstediği Özel Tanıtım Metni */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-8 sm:p-12 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl relative shadow-2xl"
          >
            <Quote className="w-12 h-12 text-[#D97725]/30 absolute top-4 left-6 -rotate-12" />
            <p className="text-lg sm:text-2xl font-light text-gray-200 leading-relaxed italic relative z-10">
              &quot;Biz, sınırları aşan bir vizyonla bir araya gelmiş genç liderler, öğrenciler ve üreticileriz. Farklı coğrafyalardan gelen zenginliğimizi birleştirerek sadece bir araya gelen bir topluluk değil; ortak değerler inşa eden ve geleceğe yön veren aktif bir hareketiz.&quot;
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. DEĞERLER & UBUNTU FELSEFESİ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2E5A27]/10 text-[#2E5A27] text-xs font-bold uppercase tracking-wider mb-3">
            UBUNTU FELSEFESİ
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A1A]">
            &quot;Ben, Biz Olduğumuz İçin Varım&quot;
          </h2>
          <p className="text-gray-600 mt-4 text-base leading-relaxed">
            Ubuntu Network; Afrika&apos;nın kadim dayanışma felsefesini modern dünya standartları, küresel diplomasi ve B2B iş dünyasıyla birleştirir.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-gray-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
            <div className="w-14 h-14 bg-[#2E5A27]/10 text-[#2E5A27] rounded-2xl flex items-center justify-center mb-6">
              <Globe className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">Kıtalararası Köprü</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Türkiye ve dünya üniversitelerinde yetişen çok dilli, vizyoner yetenekleri kurumsal iş dünyası ve uluslararası ticaretle doğrudan buluşturuyoruz.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
            <div className="w-14 h-14 bg-[#D97725]/10 text-[#D97725] rounded-2xl flex items-center justify-center mb-6">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">Liyakat ve Güven</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Platformdaki her aday E-Devlet belgeleri, dil yeterlilikleri ve akademik başarılarıyla bizzat teyit edilir. Süreç profesyonelce yönetilir.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
            <div className="w-14 h-14 bg-[#2E5A27]/10 text-[#2E5A27] rounded-2xl flex items-center justify-center mb-6">
              <HeartHandshake className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">Ortak Büyüme</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Sadece bir eşleştirme platformu değil; gençlerin diplomasi, B2B ticaret ve networking alanlarında aktif liderlere dönüştüğü sürdürülebilir bir ekosistemiz.
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
              LİDERLİK & VİZYON
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Kurucumuz ile Tanışın
            </h2>
          </div>

          <div className="bg-[#1A1A1A] border border-white/10 rounded-3xl p-8 sm:p-12 lg:p-16 shadow-2xl flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            
            {/* Kurucu Fotoğrafı & Prestij Kartı */}
            <div className="w-full lg:w-5/12 flex flex-col items-center">
              <div className="relative group">
                {/* Glow Efekti */}
                <div className="absolute -inset-2 bg-gradient-to-r from-[#2E5A27] to-[#D97725] rounded-3xl blur-xl opacity-50 group-hover:opacity-80 transition duration-700"></div>

                <div className="relative w-64 h-80 sm:w-72 sm:h-96 rounded-3xl overflow-hidden border-2 border-white/20 bg-gray-900 shadow-2xl">
                  {/* Fotoğraf (founder.jpg varsa gösterir, yoksa şık portre görseli) */}
                  <img 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
                    alt="Muhammed Mansour Say"
                    onError={(e: any) => {
                      e.target.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80";
                    }}
                    className="w-full h-full object-cover object-top filter grayscale contrast-110 group-hover:grayscale-0 transition-all duration-700"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>

                  <div className="absolute bottom-4 left-4 right-4 text-center">
                    <span className="bg-[#2E5A27] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      Kurucu & Başkan
                    </span>
                  </div>
                </div>
              </div>

              {/* Bilgi Notu */}
              <p className="text-[11px] text-gray-500 mt-4 text-center italic">
                * Kendi orijinal fotoğrafınızı public/founder.jpg yoluna ekleyerek kolayca güncelleyebilirsiniz.
              </p>
            </div>

            {/* Kurucu Biyografi ve Başarı Detayı */}
            <div className="w-full lg:w-7/12 space-y-6">
              <div>
                <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  Muhammed Mansour Say
                </h3>
                <p className="text-[#D97725] font-bold text-sm sm:text-base mt-1 tracking-wide">
                  Ubuntu Network Kurucusu & Uluslararası İlişkiler ve B2B Koordinatörü
                </p>
              </div>

              {/* Kullanıcının Verdiği Birebir Metin */}
              <div className="space-y-4 text-gray-300 text-sm sm:text-base leading-relaxed font-light">
                <p className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                  &quot;Ubuntu Network’ün kurucusuyum. Aslen Senegalliyim ve Bursa Uludağ Üniversitesi İlahiyat Fakültesi mezunuyum.&quot;
                </p>

                <p className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                  &quot;Sivil toplum çalışmalarında aktif rol alarak Bursa Afrika Öğrencileri Topluluğu’nda başkanlık yürüttüm. Genç Diplomat programları ve Bursa Tanıtma Birliği iş birliğiyle gerçekleştirilen B2B projelerinde yer aldım. İngilizce, Arapça, Fransızca ve Türkçe olmak üzere dört dili ileri düzeyde biliyorum.&quot;
                </p>

                <p className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                  &quot;Akademik altyapımı uluslararası ticaret, saha tecrübeleri ve geniş iletişim ağımla birleştirerek, gençlerin uyum, gelişim ve networking süreçlerine öncülük ediyorum.&quot;
                </p>
              </div>

              {/* 4 DİL ROZETLERİ */}
              <div className="pt-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Languages className="w-4 h-4 text-[#D97725]" /> İleri Düzeyde Bildiği Diller:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-black/40 border border-white/10 rounded-2xl text-center">
                    <span className="text-xl block mb-1">🇹🇷</span>
                    <span className="text-xs font-bold text-white block">Türkçe</span>
                    <span className="text-[10px] text-emerald-400 font-semibold">İleri Düzey (C2)</span>
                  </div>
                  <div className="p-3 bg-black/40 border border-white/10 rounded-2xl text-center">
                    <span className="text-xl block mb-1">🇬🇧</span>
                    <span className="text-xs font-bold text-white block">İngilizce</span>
                    <span className="text-[10px] text-emerald-400 font-semibold">İleri Düzey (C2)</span>
                  </div>
                  <div className="p-3 bg-black/40 border border-white/10 rounded-2xl text-center">
                    <span className="text-xl block mb-1">🇫🇷</span>
                    <span className="text-xs font-bold text-white block">Fransızca</span>
                    <span className="text-[10px] text-emerald-400 font-semibold">İleri Düzey (C2)</span>
                  </div>
                  <div className="p-3 bg-black/40 border border-white/10 rounded-2xl text-center">
                    <span className="text-xl block mb-1">🇸🇦</span>
                    <span className="text-xs font-bold text-white block">Arapça</span>
                    <span className="text-[10px] text-emerald-400 font-semibold">İleri Düzey (C2)</span>
                  </div>
                </div>
              </div>

              {/* Kurumsal Başarı Kartları */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 text-xs text-gray-300">
                  <GraduationCap className="w-5 h-5 text-[#2E5A27] shrink-0" />
                  <span>Bursa Uludağ Üniv. İlahiyat Fakültesi Mezunu</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 text-xs text-gray-300">
                  <Award className="w-5 h-5 text-[#D97725] shrink-0" />
                  <span>Bursa Afrika Öğrencileri Topluluğu Eski Bşk.</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 4. ÇAĞRI (CALL TO ACTION) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="bg-gradient-to-r from-[#2E5A27] to-[#1A3816] rounded-3xl p-10 sm:p-14 text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h3 className="text-3xl sm:text-4xl font-extrabold mb-4">
              Bu Küresel Ağın Bir Parçası Olun
            </h3>
            <p className="text-gray-200 text-sm sm:text-base mb-8 font-light leading-relaxed">
              İster çok dilli vizyoner bir üniversite öğrencisi olun, ister kurumsal projeniz için seçkin bir yetenek arayan bir şirket; Ubuntu Network sizin için tasarlandı.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/kayit" 
                className="w-full sm:w-auto px-8 py-4 bg-[#D97725] hover:bg-[#c36a21] text-white rounded-full font-bold text-sm shadow-lg transition-all uppercase tracking-wider"
              >
                Öğrenci Olarak Başvur
              </Link>
              <Link 
                href="/#vitrin" 
                className="w-full sm:w-auto px-8 py-4 bg-white text-[#1A1A1A] hover:bg-gray-100 rounded-full font-bold text-sm shadow-lg transition-all uppercase tracking-wider"
              >
                Vitrini Keşfet
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
