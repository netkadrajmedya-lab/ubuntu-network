"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Briefcase, KeyRound, ShieldCheck, CheckCircle2, Clock, 
  AlertCircle, LogOut, Phone, Mail, GraduationCap, MapPin, 
  Star, ExternalLink, Edit3, Loader2, Save, Globe, Building2, 
  MessageSquare, ChevronRight, FileText 
} from "lucide-react";
import Link from "next/link";

interface StudentProfile {
  id: string;
  fullName: string;
  username: string;
  email: string;
  phone: string;
  uni: string;
  dept: string;
  year: string;
  city: string;
  category: string;
  skills: string[];
  languages: any[];
  bio: string;
  workType: string;
  rating: number;
  photo?: string;
  status: string;
}

interface Deal {
  id: string;
  company: string;
  contactName: string;
  studentName: string;
  budget: number;
  desc: string;
  status: "Yeni" | "İşlemde" | "Onaylandı" | "Reddedildi";
  createdAt: string;
}

export default function OgrenciPanelPage() {
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [activeTab, setActiveTab] = useState<"anlasmalar" | "profil" | "guvenlik">("anlasmalar");
  const [loading, setLoading] = useState(true);

  // Profil Düzenleme Formu
  const [bio, setBio] = useState("");
  const [skillsText, setSkillsText] = useState("");
  const [workType, setWorkType] = useState("");
  const [phone, setPhone] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Şifre ve Kullanıcı Adı Formu
  const [username, setUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [pwdSaving, setPwdSaving] = useState(false);
  const [pwdMsg, setPwdMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Oturum Kontrolü
  useEffect(() => {
    const saved = sessionStorage.getItem("ubuntu_student_user");
    if (!saved) {
      window.location.href = "/giris";
      return;
    }

    try {
      const parsed = JSON.parse(saved);
      fetchStudentData(parsed.id);
    } catch (e) {
      window.location.href = "/giris";
    }
  }, []);

  const fetchStudentData = async (id: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/student/profile?id=${id}`);
      const data = await res.json();

      if (data.success && data.student) {
        setStudent(data.student);
        setDeals(data.deals || []);
        
        // Form alanlarını doldur
        setBio(data.student.bio || "");
        setSkillsText(Array.isArray(data.student.skills) ? data.student.skills.join(", ") : "");
        setWorkType(data.student.workType || "Fark Etmez");
        setPhone(data.student.phone || "");
        setUsername(data.student.username || "");
      }
    } catch (err) {
      console.error("Veri yüklenemedi:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("ubuntu_student_user");
    window.location.href = "/giris";
  };

  // Profil Güncelleme
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg(null);
    setProfileSaving(true);

    try {
      const res = await fetch("/api/student/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: student?.id,
          bio,
          skills: skillsText,
          workType,
          phone,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Güncelleme başarısız.");
      }

      setProfileMsg({ type: "success", text: "Profil bilgileriniz başarıyla güncellendi!" });
      if (student) {
        setStudent({
          ...student,
          bio,
          skills: skillsText.split(",").map(s => s.trim()),
          workType,
          phone,
        });
      }
    } catch (err: any) {
      setProfileMsg({ type: "error", text: err.message });
    } finally {
      setProfileSaving(false);
    }
  };

  // Şifre & Kullanıcı Adı Güncelleme
  const handleUpdateSecurity = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdMsg(null);

    if (newPassword && newPassword !== newPasswordConfirm) {
      setPwdMsg({ type: "error", text: "Yeni şifreler birbiriyle eşleşmiyor." });
      return;
    }

    setPwdSaving(true);

    try {
      const res = await fetch("/api/student/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: student?.id,
          username,
          currentPassword: currentPassword || undefined,
          newPassword: newPassword || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Şifre güncellenemedi.");
      }

      setPwdMsg({ type: "success", text: "Giriş ve güvenlik bilgileriniz başarıyla güncellendi!" });
      setCurrentPassword("");
      setNewPassword("");
      setNewPasswordConfirm("");
      if (student) {
        setStudent({ ...student, username });
      }
    } catch (err: any) {
      setPwdMsg({ type: "error", text: err.message });
    } finally {
      setPwdSaving(false);
    }
  };

  if (loading || !student) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#2E5A27] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1A1A1A] flex flex-col">
      {/* Üst Bar */}
      <header className="bg-[#1A1A1A] text-white border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <Globe className="w-7 h-7 text-[#2E5A27] group-hover:text-[#D97725] transition-colors" />
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-widest leading-none">UBUNTU</span>
              <span className="text-[9px] tracking-widest text-[#D97725] font-bold mt-0.5">ÖĞRENCİ PORTALI</span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <Link 
              href="/#vitrin" 
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-gray-300 hover:text-white bg-white/10 px-3.5 py-2 rounded-xl transition-all"
            >
              Vitrindeki Kartım <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <div className="flex items-center gap-3 pl-3 border-l border-white/10">
              <div className="w-9 h-9 rounded-xl bg-[#2E5A27] text-white font-bold flex items-center justify-center text-sm">
                {student.photo ? (
                  <img src={student.photo} alt={student.fullName} className="w-full h-full object-cover rounded-xl" />
                ) : (
                  student.fullName[0]
                )}
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-xs font-bold text-white truncate max-w-[120px]">{student.fullName}</span>
                <span className="text-[10px] text-emerald-400 font-semibold">Vitrinde Yayında</span>
              </div>
            </div>

            <button 
              onClick={handleLogout}
              className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
              title="Çıkış Yap"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Profil Banner */}
      <div className="bg-[#111111] text-white pt-10 pb-16 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#2E5A27] rounded-full blur-[150px] opacity-20 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gray-800 border-2 border-white/20 overflow-hidden shrink-0 shadow-xl">
                {student.photo ? (
                  <img src={student.photo} alt={student.fullName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl font-extrabold text-gray-500">
                    {student.fullName[0]}
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{student.fullName}</h1>
                  <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Onaylı & Yayında
                  </span>
                </div>

                <p className="text-sm text-[#D97725] font-bold mt-1">{student.category}</p>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><GraduationCap className="w-3.5 h-3.5 text-gray-400" /> {student.uni} • {student.dept} ({student.year})</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-gray-400" /> {student.city}</span>
                </div>
              </div>
            </div>

            {/* Hızlı İstatistik Rozetleri */}
            <div className="grid grid-cols-3 gap-3 w-full md:w-auto">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 text-center min-w-[100px]">
                <div className="flex items-center justify-center gap-1 text-[#D97725] font-bold text-lg">
                  <Star className="w-4 h-4 fill-current" /> {student.rating || 5.0}
                </div>
                <div className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-wider font-semibold">Puan</div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 text-center min-w-[100px]">
                <div className="text-white font-extrabold text-lg">
                  {deals.length}
                </div>
                <div className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-wider font-semibold">Anlaşma</div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 text-center min-w-[100px]">
                <div className="text-emerald-400 font-extrabold text-lg">
                  E-Devlet
                </div>
                <div className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-wider font-semibold">Doğrulandı</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menü Sekmeleri */}
      <div className="bg-white border-b border-gray-200 sticky top-20 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-8">
          <button
            onClick={() => setActiveTab("anlasmalar")}
            className={`py-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === "anlasmalar"
                ? "border-[#2E5A27] text-[#2E5A27]"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            <Briefcase className="w-4 h-4" /> Anlaşmalarım & Projelerim
            {deals.length > 0 && (
              <span className="bg-[#D97725] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {deals.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("profil")}
            className={`py-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === "profil"
                ? "border-[#2E5A27] text-[#2E5A27]"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            <Edit3 className="w-4 h-4" /> Profil & Vitrin Bilgilerim
          </button>

          <button
            onClick={() => setActiveTab("guvenlik")}
            className={`py-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === "guvenlik"
                ? "border-[#2E5A27] text-[#2E5A27]"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            <KeyRound className="w-4 h-4" /> Hesap & Şifre Değiştir
          </button>
        </div>
      </div>

      {/* Ana İçerik Alanı */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        <AnimatePresence mode="wait">
          
          {/* 1. SEKME: ANLAŞMALAR & PROJELER */}
          {activeTab === "anlasmalar" && (
            <motion.div
              key="anlasmalar-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-[#1A1A1A]">Proje Eşleşmeleri ve Anlaşmalarınız</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    İşverenlerin vitrinden sizin için gönderdiği ve Ubuntu Network yöneticisinin organize ettiği iş teklifleri.
                  </p>
                </div>
              </div>

              {deals.length === 0 ? (
                <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center shadow-sm max-w-2xl mx-auto my-8">
                  <div className="w-16 h-16 bg-[#2E5A27]/10 text-[#2E5A27] rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Briefcase className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">Henüz Aktif Anlaşmanız Bulunmuyor</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    Profiliniz Premium Vitrin üzerinde yayında! Şirketler profilinizi inceleyip sizin için proje teklifi ilettiğinde ve yöneticimiz ön mutabakatı sağladığında anlaşma detayları burada listelenecektir.
                  </p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                    <Clock className="w-3.5 h-3.5 text-[#D97725]" /> Yeni teklifler geldiğinde SMS ve E-Posta ile de bilgilendirileceksiniz.
                  </div>
                </div>
              ) : (
                <div className="grid gap-6">
                  {deals.map((deal) => (
                    <div 
                      key={deal.id}
                      className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                    >
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            deal.status === "Onaylandı" ? "bg-green-100 text-green-700" :
                            deal.status === "İşlemde" ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"
                          }`}>
                            {deal.status === "Onaylandı" ? "Anlaşma Sağlandı" : deal.status}
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(deal.createdAt).toLocaleDateString("tr-TR", { day: "numeric", month: "long" })}
                          </span>
                        </div>

                        <h3 className="text-xl font-bold text-[#1A1A1A] flex items-center gap-2">
                          <Building2 className="w-5 h-5 text-[#2E5A27]" /> {deal.company}
                        </h3>

                        <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-2xl border border-gray-100 leading-relaxed">
                          &quot;{deal.desc}&quot;
                        </p>

                        <div className="text-xs text-gray-500 flex items-center gap-1.5 pt-1">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          <span>Ubuntu Network güvencesiyle yürütülen kurumsal proje.</span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:items-end gap-3 shrink-0 w-full sm:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-gray-100">
                        <div className="text-left sm:text-right bg-emerald-50 border border-emerald-200/60 p-4 rounded-2xl min-w-[180px]">
                          <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Öğrenci Net Hakediş</p>
                          <p className="text-2xl font-extrabold text-[#2E5A27] mt-0.5">
                            {deal.budget.toLocaleString("tr-TR")} ₺
                          </p>
                          <p className="text-[10px] text-gray-500 mt-1">Platform komisyonu hariç</p>
                        </div>

                        <a 
                          href="https://wa.me/905000000000" 
                          target="_blank"
                          rel="noreferrer"
                          className="w-full sm:w-auto px-5 py-2.5 bg-[#1A1A1A] hover:bg-[#2E5A27] text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow"
                        >
                          <MessageSquare className="w-3.5 h-3.5" /> Yönetici Koordinatörü
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* 2. SEKME: PROFİL & VİTRİN BİLGİLERİM */}
          {activeTab === "profil" && (
            <motion.div
              key="profil-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-3xl mx-auto"
            >
              <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
                <div className="mb-6 pb-4 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-[#1A1A1A]">Profil ve Vitrin Bilgilerinizi Düzenleyin</h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Burada yapacağınız değişiklikler ana sayfadaki Premium Vitrin kartınızda anında güncellenecektir.
                  </p>
                </div>

                {profileMsg && (
                  <div className={`p-4 rounded-2xl text-xs font-semibold mb-6 flex items-center gap-2 ${
                    profileMsg.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
                  }`}>
                    {profileMsg.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                    <span>{profileMsg.text}</span>
                  </div>
                )}

                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div>
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2">
                      Kendinizi Tanıtan Yazı (Biyografi)
                    </label>
                    <textarea 
                      rows={5}
                      required
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#2E5A27] transition-all"
                      placeholder="Tecrübeleriniz ve yeteneklerinizden bahsedin..."
                    ></textarea>
                    <span className="text-[11px] text-gray-400 mt-1 block">
                      Karakter sayısı: {bio.length}
                    </span>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2">
                      Yetenekler ve Uzmanlıklar (Virgülle ayırın)
                    </label>
                    <input 
                      type="text" 
                      value={skillsText}
                      onChange={(e) => setSkillsText(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#2E5A27] transition-all"
                      placeholder="Örn: React, Node.js, Çeviri, AutoCAD"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2">
                        Çalışma Şekli Tercihi
                      </label>
                      <select 
                        value={workType}
                        onChange={(e) => setWorkType(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#2E5A27]"
                      >
                        <option value="Uzaktan">Uzaktan (Remote)</option>
                        <option value="Yarı Zamanlı">Yarı Zamanlı (Part-Time)</option>
                        <option value="Tam Zamanlı">Tam Zamanlı</option>
                        <option value="Fark Etmez">Fark Etmez</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2">
                        Telefon Numarası
                      </label>
                      <input 
                        type="tel" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#2E5A27]"
                        placeholder="05XX XXX XX XX"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex justify-end">
                    <button 
                      type="submit"
                      disabled={profileSaving}
                      className="px-8 py-3.5 bg-[#2E5A27] hover:bg-[#386d30] text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center gap-2 disabled:opacity-70"
                    >
                      {profileSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Değişiklikleri Vitrine Kaydet
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}

          {/* 3. SEKME: HESAP & ŞİFRE DEĞİŞTİRME */}
          {activeTab === "guvenlik" && (
            <motion.div
              key="guvenlik-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
                <div className="mb-6 pb-4 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-[#1A1A1A] flex items-center gap-2">
                    <KeyRound className="w-5 h-5 text-[#D97725]" /> Giriş ve Şifre Güvenliği
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Kendinize özel kullanıcı adınızı veya sisteme giriş parolanızı güncelleyin.
                  </p>
                </div>

                {pwdMsg && (
                  <div className={`p-4 rounded-2xl text-xs font-semibold mb-6 flex items-center gap-2 ${
                    pwdMsg.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
                  }`}>
                    {pwdMsg.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                    <span>{pwdMsg.text}</span>
                  </div>
                )}

                <form onSubmit={handleUpdateSecurity} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1.5">
                      Kullanıcı Adınız
                    </label>
                    <input 
                      type="text" 
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#D97725]"
                    />
                    <p className="text-[11px] text-gray-400 mt-1">
                      Öğrenci paneline giriş yaparken bu kullanıcı adını veya kayıtlı e-postanızı kullanabilirsiniz.
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-xs font-extrabold text-[#D97725] uppercase tracking-wider mb-3">
                      Parolayı Değiştirmek İsterseniz:
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1">
                      Mevcut Parolanız
                    </label>
                    <input 
                      type="password" 
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="İlk verilen veya mevcut şifreniz"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#D97725]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1">
                        Yeni Parola
                      </label>
                      <input 
                        type="password" 
                        minLength={6}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="En az 6 karakter"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#D97725]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1">
                        Yeni Parola (Tekrar)
                      </label>
                      <input 
                        type="password" 
                        minLength={6}
                        value={newPasswordConfirm}
                        onChange={(e) => setNewPasswordConfirm(e.target.value)}
                        placeholder="Yeni şifreyi onaylayın"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#D97725]"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex justify-end">
                    <button 
                      type="submit"
                      disabled={pwdSaving}
                      className="px-8 py-3.5 bg-[#D97725] hover:bg-[#c36a21] text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center gap-2 disabled:opacity-70"
                    >
                      {pwdSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Hesap Bilgilerini Güncelle
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}
