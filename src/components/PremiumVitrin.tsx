"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, ChevronRight, Star, ShieldCheck, MapPin, Sparkles, 
  Filter, X, Send, Briefcase, Search, User, Loader2, ArrowRight 
} from "lucide-react";
import { UNIVERSITIES } from "@/data/constants";
import { useLanguage } from "@/context/LanguageContext";

const CATEGORIES = ["Tümü", "Yazılım & IT", "Yabancı Dil & Çeviri", "Tasarım & Kreatif", "Pazarlama", "Mühendislik"];

const CITIES = [
  "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya", "Ankara", "Antalya", "Artvin", "Aydın", "Balıkesir", "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli", "Diyarbakır", "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari", "Hatay", "Isparta", "Mersin", "İstanbul", "İzmir", "Kars", "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir", "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa", "Kahramanmaraş", "Mardin", "Muğla", "Muş", "Nevşehir", "Niğde", "Ordu", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Tekirdağ", "Tokat", "Trabzon", "Tunceli", "Şanlıurfa", "Uşak", "Van", "Yozgat", "Zonguldak", "Aksaray", "Bayburt", "Karaman", "Kırıkkale", "Batman", "Şırnak", "Bartın", "Ardahan", "Iğdır", "Yalova", "Karabük", "Kilis", "Osmaniye", "Düzce"
].sort((a, b) => a.localeCompare(b, 'tr'));

export interface StudentItem {
  id: string;
  name: string;
  surname?: string;
  fullName?: string;
  category: string;
  department: string;
  dept?: string;
  uni: string;
  year?: string;
  city: string;
  workType: string;
  photo?: string;
  image?: string;
  skills: string[];
  languages: any[];
  status: string;
  rating: number;
}

export default function PremiumVitrin() {
  const { t } = useLanguage();
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Tümü");
  
  // Gelişmiş Filtre State'leri
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filterCity, setFilterCity] = useState("");
  const [filterWorkType, setFilterWorkType] = useState("");
  const [filterLanguage, setFilterLanguage] = useState("");
  const [filterUni, setFilterUni] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [filterSkill, setFilterSkill] = useState("");
  
  // Modal State
  const [quoteStudent, setQuoteStudent] = useState<StudentItem | null>(null);
  const [quoteSubmitting, setQuoteSubmitting] = useState(false);
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);
  const [quoteError, setQuoteError] = useState("");

  // Modal Form Inputs
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [budget, setBudget] = useState("");

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/students?status=onaylandı");
      const data = await res.json();
      if (data.success) {
        setStudents(data.students || []);
      }
    } catch (err) {
      console.error("Vitrin verisi yüklenirken hata:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = students.filter(s => {
    const studentCategory = s.category || "";
    if (activeTab !== "Tümü" && studentCategory.toLowerCase() !== activeTab.toLowerCase()) {
      return false;
    }
    if (filterCity && s.city !== filterCity) return false;
    if (filterWorkType && s.workType !== filterWorkType && s.workType !== "Fark Etmez") return false;
    
    // Dil Filtresi
    if (filterLanguage) {
      const langs = Array.isArray(s.languages) 
        ? s.languages.map(l => (typeof l === "string" ? l : `${l.lang || ""} ${l.level || ""}`)).join(" ")
        : "";
      if (!langs.toLowerCase().includes(filterLanguage.toLowerCase())) return false;
    }
    
    // Üniversite Filtresi
    if (filterUni && !s.uni?.toLowerCase().includes(filterUni.toLowerCase())) return false;
    
    // Bölüm Filtresi
    const dept = s.dept || s.department || "";
    if (filterDept && !dept.toLowerCase().includes(filterDept.toLowerCase())) return false;
    
    // Uzmanlık Alanı Akıllı Filtreleme
    if (filterSkill) {
      const searchTerms = filterSkill.toLowerCase().split(',').map(t => t.trim()).filter(t => t);
      const skillsArray = Array.isArray(s.skills) ? s.skills : [];
      const hasSkill = searchTerms.some(term => 
        skillsArray.some(skill => skill.toLowerCase().includes(term)) ||
        studentCategory.toLowerCase().includes(term) ||
        dept.toLowerCase().includes(term)
      );
      if (!hasSkill) return false;
    }

    return true;
  });

  const clearFilters = () => {
    setFilterCity("");
    setFilterWorkType("");
    setFilterLanguage("");
    setFilterUni("");
    setFilterDept("");
    setFilterSkill("");
    setActiveTab("Tümü");
  };

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteStudent) return;
    
    setQuoteError("");
    setQuoteSubmitting(true);

    try {
      const payload = {
        company: companyName,
        contactName,
        phone,
        studentId: quoteStudent.id,
        studentName: quoteStudent.fullName || quoteStudent.name,
        budget: Number(budget) || 0,
        desc: projectDesc,
      };

      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Teklif talebi gönderilemedi.");
      }

      setQuoteSubmitted(true);
      setTimeout(() => {
        setQuoteStudent(null);
        setQuoteSubmitted(false);
        setCompanyName("");
        setContactName("");
        setPhone("");
        setProjectDesc("");
        setBudget("");
      }, 4000);
    } catch (err: any) {
      setQuoteError(err.message || "İşlem sırasında bir hata oluştu.");
    } finally {
      setQuoteSubmitting(false);
    }
  };

  return (
    <section id="vitrin" className="py-24 bg-[#0A0A0A] relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-[#2E5A27] rounded-full blur-[200px] opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-[#D97725] rounded-full blur-[200px] opacity-15 pointer-events-none"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none"></div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="flex flex-col items-center text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[#D97725] text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-md">
            <Sparkles className="w-4 h-4" /> {t("vitrin_badge")}
          </div>
          <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
            {t("vitrin_title")}
          </h2>
          <p className="text-gray-400 text-lg md:text-xl max-w-3xl font-light">
            {t("vitrin_desc")}
          </p>
        </div>

        {/* Gelişmiş Filtreleme Alanı */}
        <div className="mb-12 bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md max-w-5xl mx-auto transition-all">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-2">
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                    activeTab === cat ? "bg-white text-[#0A0A0A]" : "text-gray-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {cat === "Tümü" ? t("vitrin_tab_all") : cat}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`flex items-center gap-2 text-sm font-bold px-5 py-2 rounded-full transition-all ml-auto ${
                showAdvancedFilters ? "bg-[#D97725] text-white" : "text-white bg-white/10 hover:bg-white/20"
              }`}
            >
              <Filter className="w-4 h-4" /> {t("vitrin_filter_btn")}
              <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${showAdvancedFilters ? 'rotate-90' : ''}`} />
            </button>
          </div>

          <AnimatePresence>
            {showAdvancedFilters && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-6 mt-4 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Yabancı Dil</label>
                    <select 
                      value={filterLanguage} onChange={(e) => setFilterLanguage(e.target.value)}
                      className="w-full bg-[#1A1A1A] border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#2E5A27] transition-colors"
                    >
                      <option value="">Tüm Diller</option>
                      <option value="Türkçe">Türkçe</option>
                      <option value="İngilizce">İngilizce</option>
                      <option value="Almanca">Almanca</option>
                      <option value="İspanyolca">İspanyolca</option>
                      <option value="Rusça">Rusça</option>
                      <option value="Fransızca">Fransızca</option>
                      <option value="Arapça">Arapça</option>
                      <option value="Afrika">Afrika Dilleri</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Üniversite</label>
                    <select 
                      value={filterUni} onChange={(e) => setFilterUni(e.target.value)}
                      className="w-full bg-[#1A1A1A] border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#2E5A27] transition-colors"
                    >
                      <option value="">Tüm Üniversiteler</option>
                      {UNIVERSITIES.map(uni => (
                        <option key={uni} value={uni}>{uni}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Bölüm</label>
                    <input 
                      type="text" 
                      placeholder="Örn: Bilgisayar, İşletme..." 
                      value={filterDept} onChange={(e) => setFilterDept(e.target.value)}
                      className="w-full bg-[#1A1A1A] border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#2E5A27] transition-colors"
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs text-[#D97725] font-bold uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Akıllı Uzmanlık Arama
                    </label>
                    <input 
                      type="text" 
                      placeholder="Ne arıyorsunuz? (Örn: React, SEO, Çeviri, AutoCAD...)" 
                      value={filterSkill} onChange={(e) => setFilterSkill(e.target.value)}
                      className="w-full bg-[#1A1A1A] border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#D97725] transition-colors"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 items-end">
                    <div className="space-y-2">
                      <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Şehir</label>
                      <select 
                        value={filterCity} onChange={(e) => setFilterCity(e.target.value)}
                        className="w-full bg-[#1A1A1A] border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#2E5A27] transition-colors"
                      >
                        <option value="">Tüm Şehirler</option>
                        {CITIES.map(city => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>
                    
                    <button 
                      onClick={clearFilters}
                      className="w-full bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl px-4 py-3 font-bold hover:bg-red-500 hover:text-white transition-colors"
                    >
                      Temizle
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Yükleniyor Durumu */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(idx => (
              <div key={idx} className="h-[480px] rounded-3xl bg-white/5 animate-pulse border border-white/10 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-gray-600 animate-spin" />
              </div>
            ))}
          </div>
        )}

        {/* Vitrin Kartları Grid */}
        {!loading && (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredStudents.map((student) => {
                const displayName = student.fullName || `${student.name || ''} ${student.surname || ''}`.trim() || student.name;
                const photoSrc = student.photo || student.image || "";
                const deptName = student.dept || student.department || "";
                const skillsArray = Array.isArray(student.skills) ? student.skills : [];

                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    key={student.id}
                    className="group relative h-[480px] rounded-3xl overflow-hidden cursor-pointer"
                  >
                    {/* Arka Plan Fotoğrafı */}
                    <div className="absolute inset-0 bg-[#1A1A1A]">
                      {photoSrc ? (
                        <img 
                          src={photoSrc} 
                          alt={displayName} 
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1A1A1A] to-[#2E5A27]/40">
                          <User className="w-24 h-24 text-white/20" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>

                    <div className="absolute top-5 left-5 right-5 flex justify-between items-start z-20">
                      <div className="px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 backdrop-blur-md border bg-black/40 text-green-400 border-green-500/30">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        Müsait
                      </div>
                      <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-[#D97725]">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-6 z-20 flex flex-col justify-end h-full">
                      <div className="flex items-center gap-1 mb-2 text-[#D97725]">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-white text-sm font-bold">{student.rating || 5.0}</span>
                      </div>

                      <h3 className="text-2xl font-bold text-white mb-1 drop-shadow-lg">{displayName}</h3>
                      <p className="text-[#D97725] text-sm font-bold tracking-wide mb-3">{student.category}</p>

                      <div className="space-y-1.5 mb-4">
                        <div className="flex items-center gap-2 text-gray-300 text-xs">
                          <GraduationCapIcon className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span className="truncate">{student.uni} {deptName ? `• ${deptName}` : ''}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300 text-xs">
                          <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span>{student.city} • {student.workType || "Fark Etmez"}</span>
                        </div>
                      </div>

                      {skillsArray.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-5">
                          {skillsArray.slice(0, 3).map((skill, sIdx) => (
                            <span key={sIdx} className="px-2.5 py-1 rounded-md bg-white/10 border border-white/10 text-[11px] font-semibold text-gray-200 backdrop-blur-md">
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}

                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setQuoteStudent(student);
                        }}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white text-[#0A0A0A] font-bold text-sm transform translate-y-2 opacity-90 group-hover:translate-y-0 group-hover:opacity-100 group-hover:bg-[#2E5A27] group-hover:text-white transition-all duration-300 shadow-lg"
                      >
                        {t("vitrin_request_quote")} <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Eğer Onaylanmış Öğrenci Yoksa Gösterilecek Canlıya Alma / Başvuru Karşılama Kartı */}
        {!loading && students.length === 0 && (
          <div className="text-center py-16 px-6 bg-gradient-to-b from-white/10 to-white/5 border border-white/15 rounded-3xl backdrop-blur-xl max-w-3xl mx-auto shadow-2xl">
            <div className="w-20 h-20 bg-[#D97725]/10 border border-[#D97725]/30 text-[#D97725] rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10" />
            </div>
            <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
              Premium Vitrin Canlıya Alındı!
            </h3>
            <p className="text-gray-300 text-base md:text-lg max-w-xl mx-auto mb-8 font-light leading-relaxed">
              Öğrenci başvuruları kabul edilmeye başlanmıştır. Yönetici onayından geçen ilk seçkin yetenekler doğrudan bu vitrinde işverenlere sergilenecektir.
            </p>
            <div className="flex justify-center">
              <a 
                href="/kayit" 
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#2E5A27] hover:bg-[#386d30] text-white rounded-full font-bold shadow-lg hover:shadow-green-900/40 transition-all text-sm uppercase tracking-wider"
              >
                Hemen Öğrenci Başvurusu Yap <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}

        {/* Filtreleme Sonucu 0 Kaldığında */}
        {!loading && students.length > 0 && filteredStudents.length === 0 && (
          <div className="text-center py-20 bg-white/5 border border-white/10 rounded-3xl mt-6 backdrop-blur-md">
            <Search className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-300 text-xl font-bold">Bu filtrelere uygun yetenek bulunamadı.</p>
            <p className="text-gray-400 mt-2 text-sm">Lütfen arama kriterlerinizi genişleterek tekrar deneyin.</p>
            <button onClick={clearFilters} className="mt-6 px-6 py-2.5 bg-[#D97725] text-white font-bold rounded-full hover:bg-[#c36a21] transition-colors">
              Filtreleri Temizle
            </button>
          </div>
        )}

      </div>

      {/* İşveren Talep Modal'ı */}
      <AnimatePresence>
        {quoteStudent && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative"
            >
              <button 
                onClick={() => setQuoteStudent(null)} 
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/10 hover:bg-black/20 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-[#1A1A1A]" />
              </button>

              {quoteSubmitted ? (
                <div className="p-16 text-center">
                  <div className="w-20 h-20 bg-[#2E5A27]/10 text-[#2E5A27] rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-3xl font-bold text-[#1A1A1A] mb-4">{t("vitrin_modal_success")}</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {t("vitrin_modal_success_desc")}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-2/5 bg-[#1A1A1A] relative p-8 flex flex-col justify-end min-h-[220px]">
                    {(quoteStudent.photo || quoteStudent.image) ? (
                      <img 
                        src={quoteStudent.photo || quoteStudent.image} 
                        alt={quoteStudent.fullName || quoteStudent.name} 
                        className="absolute inset-0 w-full h-full object-cover opacity-40" 
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
                    <div className="relative z-10">
                      <span className="bg-[#D97725] text-white text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider mb-2 inline-block">Talep Edilen</span>
                      <h3 className="text-2xl font-bold text-white mb-1">{quoteStudent.fullName || quoteStudent.name}</h3>
                      <p className="text-gray-300 text-sm mb-4">{quoteStudent.category}</p>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-gray-400"><MapPin className="w-3 h-3" /> {quoteStudent.city}</div>
                        <div className="flex items-center gap-2 text-xs text-gray-400"><Briefcase className="w-3 h-3" /> {quoteStudent.workType}</div>
                      </div>
                    </div>
                  </div>

                  <div className="w-full md:w-3/5 p-8">
                    <h4 className="text-2xl font-bold text-[#1A1A1A] mb-6 border-b pb-4">{t("vitrin_modal_title")}</h4>
                    
                    {quoteError && (
                      <div className="p-3 mb-4 bg-red-50 text-red-600 rounded-xl text-xs font-semibold">
                        {quoteError}
                      </div>
                    )}

                    <form onSubmit={handleQuoteSubmit} className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t("vitrin_modal_company")}</label>
                        <input 
                          required 
                          type="text" 
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          className="w-full mt-1 border-b-2 border-gray-200 focus:border-[#2E5A27] bg-transparent py-2 px-1 focus:outline-none transition-colors" 
                          placeholder="Örn: ABC Teknoloji A.Ş." 
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t("vitrin_modal_contact")}</label>
                          <input 
                            required 
                            type="text" 
                            value={contactName}
                            onChange={(e) => setContactName(e.target.value)}
                            className="w-full mt-1 border-b-2 border-gray-200 focus:border-[#2E5A27] bg-transparent py-2 px-1 focus:outline-none transition-colors" 
                            placeholder="Adınız Soyadınız" 
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t("vitrin_modal_phone")}</label>
                          <input 
                            required 
                            type="tel" 
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full mt-1 border-b-2 border-gray-200 focus:border-[#2E5A27] bg-transparent py-2 px-1 focus:outline-none transition-colors" 
                            placeholder="05XX XXX XX XX" 
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t("vitrin_modal_desc_label")}</label>
                        <textarea 
                          required 
                          rows={3} 
                          value={projectDesc}
                          onChange={(e) => setProjectDesc(e.target.value)}
                          className="w-full mt-1 border-2 border-gray-200 rounded-xl focus:border-[#2E5A27] bg-gray-50 p-3 focus:outline-none transition-colors resize-none text-sm" 
                          placeholder="Öğrenciden beklentiniz nedir? Süre ve iş kapsamını yazın..." 
                        ></textarea>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Ayırdığınız Tahmini Bütçe (TL)</label>
                        <input 
                          required 
                          type="number" 
                          step="1000" 
                          value={budget}
                          onChange={(e) => setBudget(e.target.value)}
                          className="w-full mt-1 border-b-2 border-gray-200 focus:border-[#D97725] bg-transparent py-2 px-1 focus:outline-none transition-colors font-bold text-[#D97725]" 
                          placeholder="Örn: 25000" 
                        />
                      </div>
                      <button 
                        type="submit" 
                        disabled={quoteSubmitting}
                        className="w-full mt-4 bg-[#1A1A1A] text-white py-4 rounded-xl font-bold hover:bg-[#2E5A27] transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg"
                      >
                        {quoteSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" /> İletiliyor...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" /> Talebi Yöneticiye Gönder
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function GraduationCapIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.42 10.922a2 2 0 0 1-.01 2.833l-7.1 7.1a2 2 0 0 1-2.827 0l-7.1-7.1a2 2 0 0 1-.01-2.833l7.1-7.08a2 2 0 0 1 2.827 0l7.1 7.08z" />
      <path d="M22 10v6" />
      <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
    </svg>
  );
}
