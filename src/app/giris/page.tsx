"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Lock, User, Search, ShieldCheck, CheckCircle2, Clock, 
  AlertCircle, ArrowRight, Loader2, Sparkles, Phone, Mail, 
  GraduationCap, Globe, Building2, KeyRound 
} from "lucide-react";
import Link from "next/link";

export default function GirisPage() {
  const [activeTab, setActiveTab] = useState<"student" | "admin">("student");

  // Yönetici Giriş State
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState("");

  // Öğrenci Giriş State
  const [studentAuthInput, setStudentAuthInput] = useState("");
  const [studentPassword, setStudentPassword] = useState("");
  const [studentLoginLoading, setStudentLoginLoading] = useState(false);
  const [studentLoginError, setStudentLoginError] = useState("");

  // Öğrenci Durum Sorgu Modal State
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [studentQuery, setStudentQuery] = useState("");
  const [studentLoading, setStudentLoading] = useState(false);
  const [studentError, setStudentError] = useState("");
  const [studentResult, setStudentResult] = useState<any>(null);

  // Yönetici Girişi İşleme
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError("");
    setAdminLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: adminUsername,
          password: adminPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Giriş başarısız. Lütfen bilgilerinizi kontrol edin.");
      }

      sessionStorage.setItem("ubuntu_admin_user", JSON.stringify(data.user));
      window.location.href = "/admin";
    } catch (err: any) {
      setAdminError(err.message || "Bağlantı hatası oluştu.");
    } finally {
      setAdminLoading(false);
    }
  };

  // Öğrenci Girişi İşleme
  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStudentLoginError("");
    setStudentLoginLoading(true);

    try {
      const res = await fetch("/api/student/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usernameOrEmail: studentAuthInput,
          password: studentPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Kullanıcı adı veya şifre hatalı.");
      }

      sessionStorage.setItem("ubuntu_student_user", JSON.stringify(data.student));
      window.location.href = "/ogrenci";
    } catch (err: any) {
      setStudentLoginError(err.message || "Bağlantı hatası.");
    } finally {
      setStudentLoginLoading(false);
    }
  };

  // Öğrenci Durum Sorgulama
  const handleStudentCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setStudentError("");
    setStudentResult(null);
    setStudentLoading(true);

    try {
      const res = await fetch("/api/students/check-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: studentQuery }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Başvuru kaydı bulunamadı.");
      }

      setStudentResult(data.student);
    } catch (err: any) {
      setStudentError(err.message || "Sorgulama sırasında bir hata oluştu.");
    } finally {
      setStudentLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] pt-28 sm:pt-32 pb-16 sm:pb-24 relative overflow-hidden flex items-center justify-center px-3 sm:px-6">
      {/* Arka Plan Glow Efektleri */}
      <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-[#2E5A27] rounded-full blur-[200px] opacity-25 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-[#D97725] rounded-full blur-[200px] opacity-20 pointer-events-none"></div>

      <div className="max-w-xl w-full relative z-10">
        
        {/* Üst Başlık */}
        <div className="text-center mb-6 sm:mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-3 sm:mb-4 group">
            <Globe className="w-7 h-7 sm:w-8 sm:h-8 text-[#2E5A27] group-hover:text-[#D97725] transition-colors" />
            <span className="font-extrabold text-xl sm:text-2xl tracking-widest text-white uppercase">Ubuntu</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-2">
            Giriş & Kullanıcı Portalı
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
            Öğrenci veya yönetici hesabınızla giriş yaparak anlaşmalarınızı ve platformu yönetin.
          </p>
        </div>

        {/* Sekme Butonları */}
        <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1 sm:p-1.5 mb-6 sm:mb-8 backdrop-blur-md">
          <button
            type="button"
            onClick={() => setActiveTab("student")}
            className={`flex-1 py-3 sm:py-3.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 sm:gap-2 transition-all ${
              activeTab === "student"
                ? "bg-[#2E5A27] text-white shadow-lg"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <GraduationCap className="w-4 h-4" /> Öğrenci Girişi
          </button>
          
          <button
            type="button"
            onClick={() => setActiveTab("admin")}
            className={`flex-1 py-3 sm:py-3.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 sm:gap-2 transition-all ${
              activeTab === "admin"
                ? "bg-[#D97725] text-white shadow-lg"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Lock className="w-4 h-4" /> Yönetici Girişi
          </button>
        </div>

        {/* Ana Form Kartı */}
        <motion.div 
          layout
          className="bg-[#1A1A1A] border border-white/10 rounded-3xl p-5 sm:p-8 md:p-10 shadow-2xl backdrop-blur-xl relative"
        >
          <AnimatePresence mode="wait">
            
            {/* 1. SEKME: ÖĞRENCİ GİRİŞİ */}
            {activeTab === "student" && (
              <motion.div
                key="student-login-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-[#2E5A27]" /> Öğrenci Paneli Girişi
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">
                    Onaylanan başvurunuz sonrasında size iletilen kullanıcı adı/e-posta ve şifrenizle giriş yapın.
                  </p>
                </div>

                {studentLoginError && (
                  <div className="mb-5 p-3.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{studentLoginError}</span>
                  </div>
                )}

                <form onSubmit={handleStudentLogin} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                      Kullanıcı Adı veya E-Posta
                    </label>
                    <div className="relative">
                      <User className="w-5 h-5 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input 
                        type="text"
                        required
                        value={studentAuthInput}
                        onChange={(e) => setStudentAuthInput(e.target.value)}
                        placeholder="Örn: ad.soyad veya mail@ornek.com"
                        className="w-full pl-11 pr-4 py-3 bg-black/40 border border-white/15 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#2E5A27] transition-all text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                      Parolanız
                    </label>
                    <div className="relative">
                      <Lock className="w-5 h-5 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input 
                        type="password"
                        required
                        value={studentPassword}
                        onChange={(e) => setStudentPassword(e.target.value)}
                        placeholder="Onay mailinizdeki şifre"
                        className="w-full pl-11 pr-4 py-3 bg-black/40 border border-white/15 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#2E5A27] transition-all text-sm"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={studentLoginLoading}
                    className="w-full py-3.5 bg-[#2E5A27] hover:bg-[#386d30] text-white rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-6"
                  >
                    {studentLoginLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" /> Giriş Yapılıyor...
                      </>
                    ) : (
                      <>
                        Öğrenci Panelime Git <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-8 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <button 
                    type="button"
                    onClick={() => setShowStatusModal(true)}
                    className="text-[#D97725] font-bold hover:underline flex items-center gap-1"
                  >
                    <Search className="w-3.5 h-3.5" /> Başvuru Durumumu Sorgula
                  </button>

                  <Link href="/kayit" className="text-gray-400 hover:text-white transition-colors">
                    Henüz kayıt olmadınız mı? <strong className="text-white underline">Başvuru Yap</strong>
                  </Link>
                </div>
              </motion.div>
            )}

            {/* 2. SEKME: YÖNETİCİ VE EKİP GİRİŞİ */}
            {activeTab === "admin" && (
              <motion.div
                key="admin-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#D97725]" /> Yetkili Yönetim Girişi
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">
                    Öğrenci onayları, işveren teklifleri ve bütçe eşleştirmelerini yönetin.
                  </p>
                </div>

                {adminError && (
                  <div className="mb-5 p-3.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{adminError}</span>
                  </div>
                )}

                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                      Yönetici Kullanıcı Adı
                    </label>
                    <div className="relative">
                      <User className="w-5 h-5 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input 
                        type="text"
                        required
                        value={adminUsername}
                        onChange={(e) => setAdminUsername(e.target.value)}
                        placeholder="Örn: admin"
                        className="w-full pl-11 pr-4 py-3 bg-black/40 border border-white/15 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#D97725] transition-all text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                      Şifre
                    </label>
                    <div className="relative">
                      <Lock className="w-5 h-5 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input 
                        type="password"
                        required
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-11 pr-4 py-3 bg-black/40 border border-white/15 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#D97725] transition-all text-sm"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={adminLoading}
                    className="w-full py-3.5 bg-[#D97725] hover:bg-[#c36a21] text-white rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-6"
                  >
                    {adminLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" /> Doğrulanıyor...
                      </>
                    ) : (
                      <>
                        Yönetim Paneline Git <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            )}

          </AnimatePresence>
        </motion.div>

        {/* Alt Bilgi */}
        <div className="text-center mt-8">
          <Link href="/" className="text-xs text-gray-500 hover:text-white transition-colors">
            ← Ana Sayfaya Geri Dön
          </Link>
        </div>

      </div>

      {/* BAŞVURU SORGULAMA MODALI */}
      <AnimatePresence>
        {showStatusModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 15 }}
              className="bg-[#1A1A1A] border border-white/10 rounded-3xl w-full max-w-lg max-h-[92vh] overflow-y-auto shadow-2xl relative p-5 sm:p-8 my-auto"
            >
              <button 
                onClick={() => { setShowStatusModal(false); setStudentResult(null); setStudentError(""); }}
                className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 sm:w-9 sm:h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                aria-label="Kapat"
              >
                ✕
              </button>

              <h3 className="text-lg sm:text-xl font-bold text-white mb-2 flex items-center gap-2">
                <Search className="w-5 h-5 text-[#D97725]" /> Başvuru Durumunu Sorgula
              </h3>
              <p className="text-xs text-gray-400 mb-5 sm:mb-6">
                Kayıt formunu doldururken kullandığınız telefon numaranızı veya e-postanızı giriniz.
              </p>

              {studentError && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{studentError}</span>
                </div>
              )}

              {!studentResult ? (
                <form onSubmit={handleStudentCheck} className="space-y-4">
                  <input 
                    type="text"
                    required
                    value={studentQuery}
                    onChange={(e) => setStudentQuery(e.target.value)}
                    placeholder="Örn: 0532... veya mail@ornek.com"
                    className="w-full px-4 py-3 bg-black/40 border border-white/15 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#D97725] transition-all text-sm"
                  />

                  <button 
                    type="submit"
                    disabled={studentLoading}
                    className="w-full py-3 bg-[#D97725] hover:bg-[#c36a21] text-white rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-70"
                  >
                    {studentLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sorgula"}
                  </button>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-gray-800 overflow-hidden shrink-0 border border-white/10">
                        {studentResult.photo ? (
                          <img src={studentResult.photo} alt={studentResult.fullName} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-bold text-gray-500 text-lg">
                            {studentResult.fullName[0]}
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-base">{studentResult.fullName}</h4>
                        <p className="text-xs text-[#D97725] font-semibold">{studentResult.category}</p>
                        <p className="text-xs text-gray-400">{studentResult.uni} • {studentResult.dept}</p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/10">
                      {studentResult.status === "Onaylandı" ? (
                        <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 p-3.5 rounded-xl text-xs">
                          <p className="font-bold flex items-center gap-1.5 text-sm mb-1">
                            <CheckCircle2 className="w-4 h-4" /> Başvurunuz Onaylandı!
                          </p>
                          <p className="text-emerald-300/80 leading-relaxed">
                            E-postanıza giriş bilgileriniz iletilmiştir. Yukarıdaki formdan kullanıcı adınız ve şifrenizle öğrenci panelinize giriş yapabilirsiniz.
                          </p>
                        </div>
                      ) : studentResult.status === "Bekliyor" ? (
                        <div className="bg-amber-500/15 border border-amber-500/30 text-amber-300 p-3.5 rounded-xl text-xs">
                          <p className="font-bold flex items-center gap-1.5 text-sm mb-1">
                            <Clock className="w-4 h-4" /> Başvurunuz İncelemede
                          </p>
                          <p className="text-amber-200/80 leading-relaxed">
                            Yöneticimiz E-Devlet belgenizi ve profilinizi inceledikten sonra onay verecektir. Onaylandığında otomatik giriş şifreniz e-postanıza gönderilecektir.
                          </p>
                        </div>
                      ) : (
                        <div className="bg-rose-500/15 border border-rose-500/30 text-rose-400 p-3 rounded-xl text-xs">
                          Başvurunuz onaylanmadı.
                        </div>
                      )}
                    </div>
                  </div>

                  <button 
                    onClick={() => setStudentResult(null)}
                    className="w-full py-2 bg-white/10 hover:bg-white/15 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    Başka Bir Sorgu Yap
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
