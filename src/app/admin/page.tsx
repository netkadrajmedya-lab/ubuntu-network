"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, Briefcase, Search, ShieldCheck, LogOut, Eye, Check, X, 
  Building2, Phone, Mail, Trash2, ExternalLink, Lock, Loader2, 
  Sparkles, AlertCircle, RefreshCw, GraduationCap, MapPin, Globe, 
  KeyRound, UserPlus, ShieldAlert, CheckCircle2, Sliders, Edit3 
} from "lucide-react";

interface CurrentAdmin {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: "super_admin" | "operator" | "moderator";
  permissions: {
    canApproveStudents: boolean;
    canViewBudgets: boolean;
    canManageQuotes: boolean;
    canManageAdmins: boolean;
  };
  status: "active" | "inactive";
  lastLogin?: string;
  createdAt: string;
}

interface Student {
  id: string;
  name: string;
  surname?: string;
  fullName?: string;
  birthDate?: string;
  city: string;
  uni: string;
  dept: string;
  year: string;
  category: string;
  skills: string[];
  languages: { lang: string; level: string }[];
  bio: string;
  workType: string;
  expectedBudget: number;
  portfolioUrl?: string;
  phone: string;
  email: string;
  photo?: string;
  edevletDocName?: string;
  status: "Bekliyor" | "Onaylandı" | "Reddedildi";
  rating: number;
  createdAt: string;
}

interface Quote {
  id: string;
  company: string;
  contactName: string;
  phone: string;
  studentId?: string;
  studentName: string;
  budget: number;
  desc: string;
  status: "Yeni" | "İşlemde" | "Onaylandı" | "Reddedildi";
  createdAt: string;
}

export default function AdminDashboard() {
  const [currentUser, setCurrentUser] = useState<CurrentAdmin | null>(null);
  const [loginUsername, setLoginUsername] = useState("admin");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const [activeTab, setActiveTab] = useState<"talepler" | "ogrenciler" | "vitrin" | "yoneticiler" | "guvenlik">("talepler");
  const [students, setStudents] = useState<Student[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [adminUsers, setAdminUsers] = useState<CurrentAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Öğrenci Detay Modalı
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Yeni Yönetici Ekleme Modalı
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [newAdminUsername, setNewAdminUsername] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [newAdminFullName, setNewAdminFullName] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminRole, setNewAdminRole] = useState<"super_admin" | "operator" | "moderator">("operator");
  const [newAdminPerms, setNewAdminPerms] = useState({
    canApproveStudents: true,
    canViewBudgets: true,
    canManageQuotes: true,
    canManageAdmins: false,
  });
  const [adminFormError, setAdminFormError] = useState("");

  // Şifre Değiştirme Formu
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [newPwdConfirm, setNewPwdConfirm] = useState("");
  const [pwdMsg, setPwdMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [pwdLoading, setPwdLoading] = useState(false);

  // Oturum Kontrolü
  useEffect(() => {
    const savedUser = sessionStorage.getItem("ubuntu_admin_user");
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        sessionStorage.removeItem("ubuntu_admin_user");
      }
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: loginUsername, password: loginPassword }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Giriş başarısız.");
      }

      setCurrentUser(data.user);
      sessionStorage.setItem("ubuntu_admin_user", JSON.stringify(data.user));
    } catch (err: any) {
      setLoginError(err.message || "Bağlantı hatası.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("ubuntu_admin_user");
    setCurrentUser(null);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resStudents, resQuotes, resAdmins] = await Promise.all([
        fetch("/api/students"),
        fetch("/api/quotes"),
        fetch("/api/admin/users"),
      ]);
      const dataStudents = await resStudents.json();
      const dataQuotes = await resQuotes.json();
      const dataAdmins = await resAdmins.json();

      if (dataStudents.success) setStudents(dataStudents.students || []);
      if (dataQuotes.success) setQuotes(dataQuotes.quotes || []);
      if (dataAdmins.success) setAdminUsers(dataAdmins.admins || []);
    } catch (err) {
      console.error("Veri yüklenirken hata:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchData();
    }
  }, [currentUser]);

  // Öğrenci Durum Güncelle
  const handleStudentStatus = async (id: string, status: "Onaylandı" | "Reddedildi" | "Bekliyor") => {
    if (!currentUser?.permissions.canApproveStudents) {
      alert("Bu işlem için öğrenci onaylama yetkiniz bulunmamaktadır.");
      return;
    }
    try {
      const res = await fetch(`/api/students/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        setStudents(students.map(s => s.id === id ? { ...s, status } : s));
        if (selectedStudent?.id === id) {
          setSelectedStudent({ ...selectedStudent, status });
        }
      }
    } catch (err) {
      alert("Öğrenci durumu güncellenemedi.");
    }
  };

  // Öğrenci Sil
  const handleDeleteStudent = async (id: string) => {
    if (!currentUser?.permissions.canApproveStudents) {
      alert("Yetkiniz bulunmamaktadır.");
      return;
    }
    if (!confirm("Bu öğrenci başvurusunu kalıcı olarak silmek istediğinizden emin misiniz?")) return;
    try {
      const res = await fetch(`/api/students/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setStudents(students.filter(s => s.id !== id));
        if (selectedStudent?.id === id) setSelectedStudent(null);
      }
    } catch (err) {
      alert("Silme işlemi başarısız.");
    }
  };

  // Talep Durum Güncelle
  const handleQuoteStatus = async (id: string, status: "Yeni" | "İşlemde" | "Onaylandı" | "Reddedildi") => {
    if (!currentUser?.permissions.canManageQuotes) {
      alert("Yetkiniz bulunmamaktadır.");
      return;
    }
    try {
      const res = await fetch(`/api/quotes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        setQuotes(quotes.map(q => q.id === id ? { ...q, status } : q));
      }
    } catch (err) {
      alert("Talep durumu güncellenemedi.");
    }
  };

  // Talep Sil
  const handleDeleteQuote = async (id: string) => {
    if (!currentUser?.permissions.canManageQuotes) {
      alert("Yetkiniz bulunmamaktadır.");
      return;
    }
    if (!confirm("Bu işveren teklif talebini silmek istediğinizden emin misiniz?")) return;
    try {
      const res = await fetch(`/api/quotes/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setQuotes(quotes.filter(q => q.id !== id));
      }
    } catch (err) {
      alert("Talep silinemedi.");
    }
  };

  // Yeni Yönetici Oluştur
  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminFormError("");

    if (!currentUser?.permissions.canManageAdmins && currentUser?.role !== "super_admin") {
      setAdminFormError("Yönetici ekleme yetkiniz bulunmuyor.");
      return;
    }

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: newAdminUsername,
          password: newAdminPassword,
          fullName: newAdminFullName,
          email: newAdminEmail,
          role: newAdminRole,
          permissions: newAdminPerms,
          status: "active",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Yönetici eklenemedi.");
      }

      setAdminUsers([...adminUsers, data.admin]);
      setShowAddAdminModal(false);
      setNewAdminUsername("");
      setNewAdminPassword("");
      setNewAdminFullName("");
      setNewAdminEmail("");
      alert("Yeni yönetici başarıyla oluşturuldu.");
    } catch (err: any) {
      setAdminFormError(err.message);
    }
  };

  // Yönetici Durumunu Değiştir (Aktif / Pasif)
  const handleToggleAdminStatus = async (admin: CurrentAdmin) => {
    if (admin.id === currentUser?.id) {
      alert("Kendi hesabınızı pasife alamazsınız.");
      return;
    }
    const newStatus = admin.status === "active" ? "inactive" : "active";
    try {
      const res = await fetch(`/api/admin/users/${admin.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setAdminUsers(adminUsers.map(a => a.id === admin.id ? { ...a, status: newStatus } : a));
      }
    } catch (err) {
      alert("Durum güncellenemedi.");
    }
  };

  // Yönetici Sil
  const handleDeleteAdmin = async (adminId: string) => {
    if (adminId === currentUser?.id) {
      alert("Kendi hesabınızı silemezsiniz.");
      return;
    }
    if (!confirm("Bu yönetici hesabını silmek istediğinizden emin misiniz?")) return;

    try {
      const res = await fetch(`/api/admin/users/${adminId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setAdminUsers(adminUsers.filter(a => a.id !== adminId));
        alert("Yönetici hesabı silindi.");
      } else {
        alert(data.error || "Yönetici silinemedi.");
      }
    } catch (err: any) {
      alert("Silme işlemi sırasında hata oluştu.");
    }
  };

  // Yönetici Şifre Sıfırlama
  const handleResetAdminPassword = async (adminId: string, adminUsername: string) => {
    const newPassword = prompt(`"${adminUsername}" için yeni şifre belirleyin:`);
    if (!newPassword || newPassword.length < 6) {
      alert("Şifre en az 6 karakter olmalıdır.");
      return;
    }

    try {
      const res = await fetch(`/api/admin/users/${adminId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        alert(`"${adminUsername}" kullanıcısının şifresi başarıyla güncellendi.`);
      }
    } catch (err) {
      alert("Şifre sıfırlanamadı.");
    }
  };

  // Kendi Şifresini Değiştirme
  const handleChangeMyPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdMsg(null);

    if (newPwd !== newPwdConfirm) {
      setPwdMsg({ type: "error", text: "Yeni şifreler eşleşmiyor." });
      return;
    }

    setPwdLoading(true);
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminId: currentUser?.id,
          currentPassword: currentPwd,
          newPassword: newPwd,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Şifre güncellenemedi.");
      }

      setPwdMsg({ type: "success", text: "Şifreniz başarıyla değiştirildi!" });
      setCurrentPwd("");
      setNewPwd("");
      setNewPwdConfirm("");
    } catch (err: any) {
      setPwdMsg({ type: "error", text: err.message });
    } finally {
      setPwdLoading(false);
    }
  };

  // Rol Seçilince Yetkileri Otomatik Doldur
  const handleRoleChange = (role: "super_admin" | "operator" | "moderator") => {
    setNewAdminRole(role);
    if (role === "super_admin") {
      setNewAdminPerms({
        canApproveStudents: true,
        canViewBudgets: true,
        canManageQuotes: true,
        canManageAdmins: true,
      });
    } else if (role === "operator") {
      setNewAdminPerms({
        canApproveStudents: true,
        canViewBudgets: true,
        canManageQuotes: true,
        canManageAdmins: false,
      });
    } else {
      setNewAdminPerms({
        canApproveStudents: true,
        canViewBudgets: false,
        canManageQuotes: false,
        canManageAdmins: false,
      });
    }
  };

  // Filtreleme
  const filteredStudents = students.filter(s => {
    const query = searchTerm.toLowerCase();
    const fullName = s.fullName || `${s.name} ${s.surname || ''}`;
    return (
      fullName.toLowerCase().includes(query) ||
      s.uni.toLowerCase().includes(query) ||
      s.dept.toLowerCase().includes(query) ||
      s.city.toLowerCase().includes(query) ||
      s.phone.includes(query)
    );
  });

  const filteredQuotes = quotes.filter(q => {
    const query = searchTerm.toLowerCase();
    return (
      q.company.toLowerCase().includes(query) ||
      q.contactName.toLowerCase().includes(query) ||
      q.studentName.toLowerCase().includes(query) ||
      q.phone.includes(query)
    );
  });

  // Giriş Ekranı (Kullanıcı Adı & Şifre)
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[35rem] h-[35rem] bg-[#2E5A27] rounded-full blur-[180px] opacity-20 pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[35rem] h-[35rem] bg-[#D97725] rounded-full blur-[180px] opacity-15 pointer-events-none"></div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="max-w-md w-full bg-[#1A1A1A] border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10"
        >
          <div className="w-16 h-16 bg-[#2E5A27]/20 border border-[#2E5A27]/40 text-[#2E5A27] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8" />
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-extrabold text-white tracking-wide">Yönetici Girişi</h1>
            <p className="text-gray-400 text-xs mt-1">Ubuntu Network Yetkili Yönetim Portalı</p>
          </div>

          {loginError && (
            <div className="mb-5 p-3.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                Kullanıcı Adı
              </label>
              <input 
                type="text"
                required
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="Örn: admin"
                className="w-full px-4 py-3 bg-black/40 border border-white/15 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#2E5A27] transition-all text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                Şifre
              </label>
              <input 
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-black/40 border border-white/15 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#2E5A27] transition-all text-sm"
              />
            </div>

            <button 
              type="submit"
              disabled={loginLoading}
              className="w-full py-3.5 bg-[#2E5A27] hover:bg-[#386d30] text-white rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
            >
              {loginLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sisteme Giriş Yap"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-gray-500 text-xs">
              İlk Kurulum Hesabı: <code className="text-[#D97725] font-bold">admin</code> / <code className="text-[#D97725] font-bold">ubuntu2026</code>
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1A1A1A] text-white flex flex-col h-screen sticky top-0 shrink-0">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-2xl font-extrabold tracking-widest text-[#2E5A27]">UBUNTU</h1>
          <p className="text-[#D97725] text-[10px] tracking-widest font-bold mt-1 uppercase">Yönetim & Yetkilendirme</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <button 
            onClick={() => setActiveTab("talepler")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm ${activeTab === 'talepler' ? 'bg-[#2E5A27] text-white font-bold shadow-md' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <Briefcase className="w-4 h-4 shrink-0" /> İşveren Talepleri
            {quotes.filter(q => q.status === "Yeni").length > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {quotes.filter(q => q.status === "Yeni").length}
              </span>
            )}
          </button>
          
          <button 
            onClick={() => setActiveTab("ogrenciler")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm ${activeTab === 'ogrenciler' ? 'bg-[#2E5A27] text-white font-bold shadow-md' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <Users className="w-4 h-4 shrink-0" /> Öğrenci Başvuruları
            {students.filter(s => s.status === "Bekliyor").length > 0 && (
              <span className="ml-auto bg-[#D97725] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {students.filter(s => s.status === "Bekliyor").length}
              </span>
            )}
          </button>
          
          <button 
            onClick={() => setActiveTab("vitrin")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm ${activeTab === 'vitrin' ? 'bg-[#2E5A27] text-white font-bold shadow-md' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <ShieldCheck className="w-4 h-4 shrink-0" /> Yayındaki Vitrin
            <span className="ml-auto bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {students.filter(s => s.status === "Onaylandı").length}
            </span>
          </button>

          <div className="pt-4 pb-2">
            <p className="px-4 text-[10px] uppercase font-extrabold tracking-wider text-gray-500">Yetkilendirme</p>
          </div>

          <button 
            onClick={() => setActiveTab("yoneticiler")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm ${activeTab === 'yoneticiler' ? 'bg-[#2E5A27] text-white font-bold shadow-md' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <KeyRound className="w-4 h-4 shrink-0 text-[#D97725]" /> Yöneticiler & Yetkiler
            <span className="ml-auto text-xs bg-white/10 px-2 py-0.5 rounded font-mono">
              {adminUsers.length}
            </span>
          </button>

          <button 
            onClick={() => setActiveTab("guvenlik")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm ${activeTab === 'guvenlik' ? 'bg-[#2E5A27] text-white font-bold shadow-md' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <Sliders className="w-4 h-4 shrink-0" /> Şifre & Güvenlik
          </button>
        </nav>

        {/* Alt Kullanıcı Bilgisi & Çıkış */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-9 h-9 rounded-xl bg-[#2E5A27] text-white font-bold flex items-center justify-center text-sm">
              {currentUser.fullName ? currentUser.fullName[0] : "A"}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold truncate text-white">{currentUser.fullName}</p>
              <p className="text-[10px] text-[#D97725] font-semibold truncate capitalize">
                {currentUser.role === "super_admin" ? "Süper Yönetici" : currentUser.role === "operator" ? "Operatör" : "Moderatör"}
              </p>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors font-bold"
          >
            <LogOut className="w-3.5 h-3.5" /> Güvenli Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4 w-96">
            <div className="relative w-full">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Öğrenci, şirket, yönetici veya telefon ara..." 
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#2E5A27]/50" 
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={fetchData} 
              className="p-2 text-gray-500 hover:text-[#2E5A27] hover:bg-gray-100 rounded-full transition-colors"
              title="Yenile"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <a 
              href="/" 
              target="_blank" 
              className="flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-[#2E5A27] bg-gray-100 px-3 py-2 rounded-xl transition-colors"
            >
              Vitrine Git <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="w-9 h-9 bg-[#2E5A27] text-white rounded-full flex items-center justify-center font-bold text-sm">
                {currentUser.username[0].toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#1A1A1A]">{currentUser.username}</span>
                <span className="text-[10px] text-emerald-600 font-semibold">Aktif Oturum</span>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto p-8">
          
          <AnimatePresence mode="wait">
            
            {/* 1. SEKME: İŞVEREN TALEPLERİ */}
            {activeTab === 'talepler' && (
              <motion.div key="talepler" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-[#1A1A1A]">İşveren Talepleri</h2>
                    <p className="text-gray-500 text-sm mt-1">
                      Şirketlerden gelen teklifler ve bütçe aralıkları.
                    </p>
                  </div>
                </div>

                {filteredQuotes.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                    <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600 font-bold text-lg">Henüz işveren teklifi bulunmuyor.</p>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {filteredQuotes.map(req => {
                      const matchedStudent = students.find(s => s.id === req.studentId || (s.fullName || s.name) === req.studentName);
                      const studentMinBudget = matchedStudent?.expectedBudget || 0;
                      const commissionSpread = req.budget > studentMinBudget ? (req.budget - studentMinBudget) : 0;

                      return (
                        <div key={req.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col md:flex-row hover:border-[#2E5A27]/40 transition-all">
                          <div className="p-6 md:w-1/3 bg-gray-50 border-r border-gray-100 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                  req.status === 'Yeni' ? 'bg-red-100 text-red-600' :
                                  req.status === 'İşlemde' ? 'bg-blue-100 text-blue-600' :
                                  req.status === 'Onaylandı' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                                }`}>
                                  {req.status}
                                </span>
                                <span className="text-xs text-gray-400">
                                  {new Date(req.createdAt).toLocaleDateString("tr-TR", { day: "numeric", month: "long" })}
                                </span>
                              </div>
                              <h3 className="text-xl font-bold text-[#1A1A1A] mb-1 flex items-center gap-2">
                                <Building2 className="w-5 h-5 text-[#2E5A27] shrink-0" /> {req.company}
                              </h3>
                              <p className="text-sm text-gray-700 font-medium">{req.contactName}</p>
                              <a href={`tel:${req.phone}`} className="inline-flex items-center gap-2 mt-3 text-sm text-[#D97725] font-bold hover:underline">
                                <Phone className="w-4 h-4" /> {req.phone}
                              </a>
                            </div>

                            {currentUser.permissions.canManageQuotes && (
                              <div className="mt-4 pt-4 border-t border-gray-200/60">
                                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Durum:</p>
                                <div className="flex gap-1.5 mt-2">
                                  {["Yeni", "İşlemde", "Onaylandı", "Reddedildi"].map((st) => (
                                    <button
                                      key={st}
                                      onClick={() => handleQuoteStatus(req.id, st as any)}
                                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                                        req.status === st ? 'bg-[#1A1A1A] text-white shadow' : 'bg-white border text-gray-600 hover:bg-gray-100'
                                      }`}
                                    >
                                      {st}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div className="p-6 md:w-2/3 flex flex-col justify-between">
                            <div>
                              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                                <div>
                                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Talep Edilen Öğrenci</p>
                                  <div className="text-lg font-bold text-[#D97725]">
                                    {req.studentName}
                                  </div>
                                </div>
                                <div className="text-left sm:text-right bg-emerald-50/60 border border-emerald-100 p-3 rounded-xl">
                                  <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">İşveren Teklif Bütçesi</p>
                                  <div className="text-2xl font-extrabold text-[#2E5A27]">
                                    {currentUser.permissions.canViewBudgets ? `${req.budget.toLocaleString('tr-TR')} ₺` : "•••••• ₺"}
                                  </div>
                                  {currentUser.permissions.canViewBudgets && studentMinBudget > 0 && (
                                    <p className="text-[11px] text-gray-500 mt-1">
                                      Komisyon Farkı: <strong className="text-emerald-700">{commissionSpread.toLocaleString('tr-TR')} ₺</strong>
                                    </p>
                                  )}
                                </div>
                              </div>
                              <p className="text-gray-700 bg-gray-50 p-4 rounded-xl text-sm border border-gray-100 leading-relaxed">
                                &quot;{req.desc}&quot;
                              </p>
                            </div>
                            
                            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                              {currentUser.permissions.canManageQuotes ? (
                                <button 
                                  onClick={() => handleDeleteQuote(req.id)}
                                  className="text-xs text-red-500 hover:text-red-700 font-bold flex items-center gap-1.5"
                                >
                                  <Trash2 className="w-4 h-4" /> Sil
                                </button>
                              ) : <div></div>}

                              <div className="flex gap-2">
                                {matchedStudent && (
                                  <a 
                                    href={`tel:${matchedStudent.phone}`}
                                    className="px-4 py-2 bg-[#D97725] text-white rounded-lg text-xs font-bold hover:bg-[#c36a21] transition-colors shadow flex items-center gap-1.5"
                                  >
                                    <Phone className="w-3.5 h-3.5" /> Öğrenciyi Ara
                                  </a>
                                )}
                                <a 
                                  href={`tel:${req.phone}`}
                                  className="px-4 py-2 bg-[#2E5A27] text-white rounded-lg text-xs font-bold hover:bg-[#386d30] transition-colors shadow flex items-center gap-1.5"
                                >
                                  <Phone className="w-3.5 h-3.5" /> İşvereni Ara
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {/* 2. SEKME: ÖĞRENCİ BAŞVURULARI */}
            {activeTab === 'ogrenciler' && (
              <motion.div key="ogrenciler" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-[#1A1A1A]">Öğrenci Başvuruları</h2>
                    <p className="text-gray-500 text-sm mt-1">
                      Kayıt formunu dolduran tüm adaylar ve onay durumları.
                    </p>
                  </div>
                </div>

                {filteredStudents.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600 font-bold text-lg">Henüz öğrenci başvurusu bulunmuyor.</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Aday Bilgisi</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Üniversite / Bölüm</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Şehir / Çalışma</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Gizli Asgari Bütçe</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Durum</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">İşlemler</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {filteredStudents.map(student => {
                            const displayName = student.fullName || `${student.name} ${student.surname || ''}`.trim();
                            return (
                              <tr key={student.id} className="hover:bg-gray-50/80 transition-colors">
                                <td className="p-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0">
                                      {student.photo ? (
                                        <img src={student.photo} alt={displayName} className="w-full h-full object-cover" />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center font-bold text-gray-600">
                                          {student.name[0]}
                                        </div>
                                      )}
                                    </div>
                                    <div>
                                      <div className="font-bold text-[#1A1A1A]">{displayName}</div>
                                      <div className="text-xs text-gray-500">{student.phone}</div>
                                    </div>
                                  </div>
                                </td>

                                <td className="p-4 text-sm">
                                  <div className="font-semibold text-gray-800">{student.uni}</div>
                                  <div className="text-xs text-gray-500">{student.dept} ({student.year})</div>
                                </td>

                                <td className="p-4 text-sm text-gray-600">
                                  <div>{student.city}</div>
                                  <div className="text-xs text-gray-400">{student.workType}</div>
                                </td>

                                <td className="p-4">
                                  {currentUser.permissions.canViewBudgets ? (
                                    <span className="bg-[#D97725]/10 text-[#D97725] px-3 py-1 rounded-lg font-bold text-sm">
                                      {student.expectedBudget ? `${student.expectedBudget.toLocaleString('tr-TR')} ₺` : 'Belirtilmemiş'}
                                    </span>
                                  ) : (
                                    <span className="text-gray-400 text-xs italic">Yetki Yok</span>
                                  )}
                                </td>

                                <td className="p-4">
                                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                    student.status === 'Onaylandı' ? 'bg-green-100 text-green-700' :
                                    student.status === 'Bekliyor' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                                  }`}>
                                    {student.status}
                                  </span>
                                </td>

                                <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                                  <button 
                                    onClick={() => setSelectedStudent(student)}
                                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
                                    title="Tüm Detayları Gör"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  
                                  {currentUser.permissions.canApproveStudents && (
                                    <>
                                      {student.status !== "Onaylandı" && (
                                        <button 
                                          onClick={() => handleStudentStatus(student.id, "Onaylandı")}
                                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors font-bold" 
                                          title="Onayla ve Vitrine Çıkar"
                                        >
                                          <Check className="w-4 h-4" />
                                        </button>
                                      )}

                                      {student.status !== "Reddedildi" && (
                                        <button 
                                          onClick={() => handleStudentStatus(student.id, "Reddedildi")}
                                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" 
                                          title="Reddet"
                                        >
                                          <X className="w-4 h-4" />
                                        </button>
                                      )}

                                      <button 
                                        onClick={() => handleDeleteStudent(student.id)}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                                        title="Başvuruyu Sil"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* 3. SEKME: YAYINDAKİ VİTRİN */}
            {activeTab === 'vitrin' && (
              <motion.div key="vitrin" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-[#1A1A1A]">Yayındaki Vitrin Profilleri</h2>
                    <p className="text-gray-500 text-sm mt-1">
                      Şu anda ana sayfada işverenlerin görebildiği ve teklif isteyebildiği aktif yetenekler.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {students.filter(s => s.status === "Onaylandı").map(student => (
                    <div key={student.id} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-14 h-14 rounded-2xl bg-gray-200 overflow-hidden shrink-0">
                            {student.photo ? (
                              <img src={student.photo} alt={student.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center font-bold text-gray-500">
                                {student.name[0]}
                              </div>
                            )}
                          </div>
                          <div>
                            <h4 className="font-bold text-[#1A1A1A] text-lg">{student.fullName || student.name}</h4>
                            <p className="text-xs text-[#D97725] font-semibold">{student.category}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{student.city} • {student.workType}</p>
                          </div>
                        </div>

                        <p className="text-xs text-gray-600 line-clamp-3 bg-gray-50 p-3 rounded-xl mb-4">
                          {student.bio}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-xs font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
                          Vitrinde Aktif
                        </span>
                        {currentUser.permissions.canApproveStudents && (
                          <button 
                            onClick={() => handleStudentStatus(student.id, "Bekliyor")}
                            className="text-xs text-orange-600 hover:text-orange-800 font-bold hover:underline"
                          >
                            Vitrinden Kaldır
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* 4. SEKME: YÖNETİCİLER & YETKİLENDİRME (Kullanıcının İstediği Özel Modül) */}
            {activeTab === 'yoneticiler' && (
              <motion.div key="yoneticiler" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-[#1A1A1A]">Yöneticiler ve Kullanıcı Yetkilendirme</h2>
                    <p className="text-gray-500 text-sm mt-1">
                      Ubuntu Network paneline erişebilecek personelleri yönetin, rollere göre yetki sınırları belirleyin.
                    </p>
                  </div>
                  
                  {(currentUser.permissions.canManageAdmins || currentUser.role === "super_admin") && (
                    <button 
                      onClick={() => setShowAddAdminModal(true)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2E5A27] hover:bg-[#386d30] text-white rounded-xl font-bold text-sm shadow-md transition-all shrink-0"
                    >
                      <UserPlus className="w-4 h-4" /> Yeni Yönetici Ekle
                    </button>
                  )}
                </div>

                <div className="grid gap-5">
                  {adminUsers.map((admin) => (
                    <div key={admin.id} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                      
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-[#1A1A1A] text-white font-extrabold text-xl flex items-center justify-center shrink-0 border border-white/10">
                          {admin.username[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-bold text-[#1A1A1A]">{admin.fullName}</h3>
                            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase ${
                              admin.role === "super_admin" ? "bg-purple-100 text-purple-700" :
                              admin.role === "operator" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"
                            }`}>
                              {admin.role === "super_admin" ? "Süper Yönetici" : admin.role === "operator" ? "Operatör" : "Moderatör"}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${admin.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                              {admin.status === "active" ? "Aktif" : "Pasif"}
                            </span>
                          </div>

                          <p className="text-xs text-gray-500 mt-1">
                            Kullanıcı Adı: <code className="font-mono text-gray-800 font-bold">@{admin.username}</code> • {admin.email || "E-posta yok"}
                          </p>

                          {/* Yetki Rozetleri */}
                          <div className="flex flex-wrap gap-2 mt-3">
                            <span className={`text-[11px] font-medium px-2 py-0.5 rounded border ${admin.permissions.canApproveStudents ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-50 text-gray-400 border-gray-200 line-through'}`}>
                              Öğrenci Onaylama
                            </span>
                            <span className={`text-[11px] font-medium px-2 py-0.5 rounded border ${admin.permissions.canViewBudgets ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-50 text-gray-400 border-gray-200 line-through'}`}>
                              Bütçe / Komisyon Görme
                            </span>
                            <span className={`text-[11px] font-medium px-2 py-0.5 rounded border ${admin.permissions.canManageQuotes ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-50 text-gray-400 border-gray-200 line-through'}`}>
                              İşveren Talepleri
                            </span>
                            <span className={`text-[11px] font-medium px-2 py-0.5 rounded border ${admin.permissions.canManageAdmins ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-gray-50 text-gray-400 border-gray-200 line-through'}`}>
                              Yönetici Ekleme/Silme
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* İşlem Butonları */}
                      {(currentUser.permissions.canManageAdmins || currentUser.role === "super_admin") && (
                        <div className="flex flex-wrap items-center gap-2 self-end lg:self-center">
                          <button 
                            onClick={() => handleResetAdminPassword(admin.id, admin.username)}
                            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                          >
                            <KeyRound className="w-3.5 h-3.5 text-[#D97725]" /> Şifre Belirle
                          </button>

                          {admin.id !== currentUser.id && (
                            <>
                              <button 
                                onClick={() => handleToggleAdminStatus(admin)}
                                className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                                  admin.status === "active" ? "bg-amber-50 text-amber-700 hover:bg-amber-100" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                }`}
                              >
                                {admin.status === "active" ? "Hesabı Dondur" : "Aktifleştir"}
                              </button>

                              <button 
                                onClick={() => handleDeleteAdmin(admin.id)}
                                className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                                title="Yöneticiyi Sil"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* 5. SEKME: ŞİFRE & GÜVENLİK AYARLARI */}
            {activeTab === 'guvenlik' && (
              <motion.div key="guvenlik" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-[#1A1A1A]">Güvenlik ve Şifre Ayarları</h2>
                  <p className="text-gray-500 text-sm mt-1">
                    Kendi yönetici giriş şifrenizi güncelleyin ve sistem güvenlik durumunu inceleyin.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Şifre Değiştir Formu */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                    <h3 className="text-lg font-bold text-[#1A1A1A] mb-1 flex items-center gap-2">
                      <Lock className="w-5 h-5 text-[#2E5A27]" /> Giriş Şifremi Değiştir
                    </h3>
                    <p className="text-xs text-gray-500 mb-6">
                      Hesabınızı güvene almak için en az 6 karakterli güçlü bir şifre belirleyin.
                    </p>

                    {pwdMsg && (
                      <div className={`p-4 rounded-xl text-xs font-semibold mb-6 flex items-center gap-2 ${
                        pwdMsg.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
                      }`}>
                        {pwdMsg.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                        <span>{pwdMsg.text}</span>
                      </div>
                    )}

                    <form onSubmit={handleChangeMyPassword} className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block mb-1">Mevcut Şifreniz</label>
                        <input 
                          type="password" 
                          required
                          value={currentPwd}
                          onChange={(e) => setCurrentPwd(e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2E5A27] transition-all"
                          placeholder="Mevcut şifrenizi girin"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block mb-1">Yeni Şifreniz</label>
                        <input 
                          type="password" 
                          required
                          minLength={6}
                          value={newPwd}
                          onChange={(e) => setNewPwd(e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2E5A27] transition-all"
                          placeholder="En az 6 karakter"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block mb-1">Yeni Şifreniz (Tekrar)</label>
                        <input 
                          type="password" 
                          required
                          minLength={6}
                          value={newPwdConfirm}
                          onChange={(e) => setNewPwdConfirm(e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2E5A27] transition-all"
                          placeholder="Yeni şifrenizi doğrulayın"
                        />
                      </div>

                      <button 
                        type="submit" 
                        disabled={pwdLoading}
                        className="w-full py-3.5 bg-[#2E5A27] hover:bg-[#386d30] text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-4"
                      >
                        {pwdLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Yeni Şifreyi Kaydet"}
                      </button>
                    </form>
                  </div>

                  {/* Sistem Güvenlik Bilgileri */}
                  <div className="space-y-6">
                    <div className="bg-[#FAF9F6] border border-gray-200 rounded-2xl p-6">
                      <h4 className="font-bold text-[#1A1A1A] flex items-center gap-2 mb-2 text-sm">
                        <ShieldAlert className="w-4 h-4 text-[#D97725]" /> Güvenlik Mimarisi
                      </h4>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Ubuntu Network, veri güvenliği için <strong>Çift Katmanlı İletişim Bariyeri</strong> kullanır. İşverenler öğrencilerin telefon ve e-posta adreslerini asla göremez; tüm görüşmeler ve bütçe mutabakatları panel üzerinden sizlerin aracılığı ile yürütülür.
                      </p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
                      <h4 className="font-bold text-[#1A1A1A] text-sm border-b pb-3">Oturum Detayları</h4>
                      <div className="text-xs space-y-2 text-gray-600">
                        <div className="flex justify-between">
                          <span className="font-semibold text-gray-500">Giriş Yapan:</span>
                          <span className="font-mono text-[#1A1A1A] font-bold">{currentUser.username} ({currentUser.fullName})</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-semibold text-gray-500">Yetki Seviyesi:</span>
                          <span className="text-emerald-700 font-bold uppercase">{currentUser.role}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-semibold text-gray-500">KVKK & Belge Uyumluluğu:</span>
                          <span className="text-green-600 font-bold">Aktif / Şifreli Depolama</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

        </div>
      </main>

      {/* YENİ YÖNETİCİ EKLEME MODALI */}
      <AnimatePresence>
        {showAddAdminModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl relative p-8"
            >
              <button 
                onClick={() => setShowAddAdminModal(false)} 
                className="absolute top-5 right-5 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>

              <h3 className="text-2xl font-bold text-[#1A1A1A] mb-2 flex items-center gap-2">
                <UserPlus className="w-6 h-6 text-[#2E5A27]" /> Yeni Yönetici Yetkilendir
              </h3>
              <p className="text-xs text-gray-500 mb-6">
                Panele giriş yapabilecek yeni bir ekip üyesi tanımlayın ve yetkilerini seçin.
              </p>

              {adminFormError && (
                <div className="p-3 mb-4 bg-red-50 text-red-600 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{adminFormError}</span>
                </div>
              )}

              <form onSubmit={handleCreateAdmin} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block mb-1">Kullanıcı Adı</label>
                    <input 
                      type="text" 
                      required
                      value={newAdminUsername}
                      onChange={(e) => setNewAdminUsername(e.target.value)}
                      placeholder="Örn: ahmet" 
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2E5A27]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block mb-1">Giriş Şifresi</label>
                    <input 
                      type="password" 
                      required
                      minLength={6}
                      value={newAdminPassword}
                      onChange={(e) => setNewAdminPassword(e.target.value)}
                      placeholder="En az 6 karakter" 
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2E5A27]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block mb-1">Ad Soyad</label>
                    <input 
                      type="text" 
                      required
                      value={newAdminFullName}
                      onChange={(e) => setNewAdminFullName(e.target.value)}
                      placeholder="Örn: Ahmet Yılmaz" 
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2E5A27]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block mb-1">E-Posta (İsteğe Bağlı)</label>
                    <input 
                      type="email" 
                      value={newAdminEmail}
                      onChange={(e) => setNewAdminEmail(e.target.value)}
                      placeholder="ahmet@sirket.com" 
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2E5A27]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block mb-1">Yönetici Rolü</label>
                  <select 
                    value={newAdminRole}
                    onChange={(e) => handleRoleChange(e.target.value as any)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2E5A27]"
                  >
                    <option value="operator">Eşleştirme Operatörü (Talepler & Bütçeler)</option>
                    <option value="super_admin">Süper Yönetici (Tüm Yetkiler Dahil)</option>
                    <option value="moderator">Moderatör (Sadece Öğrenci Başvuru Kontrolü)</option>
                  </select>
                </div>

                {/* Özel Yetki Kutucukları */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2.5">
                  <p className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Özel Yetkiler:</p>
                  
                  <label className="flex items-center gap-2.5 cursor-pointer text-xs text-gray-700">
                    <input 
                      type="checkbox"
                      checked={newAdminPerms.canApproveStudents}
                      onChange={(e) => setNewAdminPerms({ ...newAdminPerms, canApproveStudents: e.target.checked })}
                      className="w-4 h-4 rounded text-[#2E5A27] focus:ring-[#2E5A27]"
                    />
                    <span>Öğrenci Başvurularını Onaylama ve Reddetme</span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer text-xs text-gray-700">
                    <input 
                      type="checkbox"
                      checked={newAdminPerms.canViewBudgets}
                      onChange={(e) => setNewAdminPerms({ ...newAdminPerms, canViewBudgets: e.target.checked })}
                      className="w-4 h-4 rounded text-[#2E5A27] focus:ring-[#2E5A27]"
                    />
                    <span>Gizli Bütçeleri ve Komisyon Rakamlarını Görme</span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer text-xs text-gray-700">
                    <input 
                      type="checkbox"
                      checked={newAdminPerms.canManageQuotes}
                      onChange={(e) => setNewAdminPerms({ ...newAdminPerms, canManageQuotes: e.target.checked })}
                      className="w-4 h-4 rounded text-[#2E5A27] focus:ring-[#2E5A27]"
                    />
                    <span>İşveren Tekliflerini Yönetme ve Durum Güncelleme</span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer text-xs text-gray-700">
                    <input 
                      type="checkbox"
                      checked={newAdminPerms.canManageAdmins}
                      onChange={(e) => setNewAdminPerms({ ...newAdminPerms, canManageAdmins: e.target.checked })}
                      className="w-4 h-4 rounded text-[#2E5A27] focus:ring-[#2E5A27]"
                    />
                    <span>Başka Yönetici Ekleme, Şifre Değiştirme ve Silme</span>
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button 
                    type="button"
                    onClick={() => setShowAddAdminModal(false)}
                    className="px-5 py-2.5 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-200"
                  >
                    İptal
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-2.5 bg-[#2E5A27] text-white rounded-xl font-bold text-sm hover:bg-[#386d30] shadow"
                  >
                    Yöneticiyi Oluştur
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ÖĞRENCİ DETAY MODALI */}
      <AnimatePresence>
        {selectedStudent && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl relative p-8"
            >
              <button 
                onClick={() => setSelectedStudent(null)} 
                className="absolute top-5 right-5 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>

              <div className="flex flex-col sm:flex-row gap-6 items-start pb-6 border-b border-gray-200">
                <div className="w-24 h-24 rounded-2xl bg-gray-100 overflow-hidden shrink-0 border-2 border-gray-200 shadow-sm">
                  {selectedStudent.photo ? (
                    <img src={selectedStudent.photo} alt={selectedStudent.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-gray-400 text-2xl">
                      {selectedStudent.name[0]}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-extrabold text-[#1A1A1A]">
                      {selectedStudent.fullName || `${selectedStudent.name} ${selectedStudent.surname || ''}`}
                    </h3>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      selectedStudent.status === 'Onaylandı' ? 'bg-green-100 text-green-700' :
                      selectedStudent.status === 'Bekliyor' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {selectedStudent.status}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-[#D97725] mt-1">{selectedStudent.category}</p>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 text-xs text-gray-600">
                    <div className="flex items-center gap-1.5"><GraduationCap className="w-4 h-4 text-gray-400" /> {selectedStudent.uni}</div>
                    <div className="flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-gray-400" /> {selectedStudent.dept} ({selectedStudent.year})</div>
                    <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-gray-400" /> {selectedStudent.city}</div>
                  </div>
                </div>
              </div>

              {/* Detay Bilgileri */}
              <div className="py-6 space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Öğrenci Tanıtım Yazısı</h4>
                  <p className="text-sm text-gray-800 bg-gray-50 p-4 rounded-2xl border border-gray-100 leading-relaxed">
                    {selectedStudent.bio}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Bildiği Diller</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedStudent.languages?.map((l, idx) => (
                        <span key={idx} className="px-3 py-1.5 rounded-xl bg-gray-100 border border-gray-200 text-xs font-semibold text-gray-800">
                          {typeof l === "string" ? l : `${l.lang} - ${l.level}`}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Uzmanlıklar</h4>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(selectedStudent.skills) && selectedStudent.skills.map((skill, sIdx) => (
                        <span key={sIdx} className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#FAF9F6] p-5 rounded-2xl border border-gray-200">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold">Gizli Asgari Bütçe Beklentisi</p>
                    <p className="text-xl font-extrabold text-[#D97725] mt-1">
                      {currentUser.permissions.canViewBudgets ? (
                        selectedStudent.expectedBudget ? `${selectedStudent.expectedBudget.toLocaleString('tr-TR')} ₺` : 'Belirtilmedi'
                      ) : "•••••• ₺ (Yetkiniz Yok)"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold">E-Devlet Öğrenci Belgesi</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs font-semibold text-gray-700 bg-white border px-3 py-1.5 rounded-lg">
                        📄 {selectedStudent.edevletDocName || "ogrenci_belgesi.pdf"}
                      </span>
                      <span className="text-xs text-green-700 font-bold bg-green-100 px-2.5 py-1 rounded-md">
                        Doğrulandı
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">İletişim Bilgileri</h4>
                  <div className="flex flex-wrap gap-4">
                    <a href={`tel:${selectedStudent.phone}`} className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-sm font-bold transition-colors">
                      <Phone className="w-4 h-4 text-[#2E5A27]" /> {selectedStudent.phone}
                    </a>
                    <a href={`mailto:${selectedStudent.email}`} className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-sm font-bold transition-colors">
                      <Mail className="w-4 h-4 text-[#D97725]" /> {selectedStudent.email}
                    </a>
                    {selectedStudent.portfolioUrl && (
                      <a href={selectedStudent.portfolioUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-blue-600 rounded-xl text-sm font-bold transition-colors">
                        <Globe className="w-4 h-4" /> Portfolyo / Link
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Aksiyon Butonları */}
              <div className="pt-6 border-t border-gray-200 flex justify-end gap-3">
                <button 
                  onClick={() => setSelectedStudent(null)}
                  className="px-5 py-2.5 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors"
                >
                  Kapat
                </button>
                {currentUser.permissions.canApproveStudents && (
                  <>
                    {selectedStudent.status !== "Reddedildi" && (
                      <button 
                        onClick={() => handleStudentStatus(selectedStudent.id, "Reddedildi")}
                        className="px-5 py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-xl font-bold text-sm hover:bg-red-600 hover:text-white transition-colors"
                      >
                        Reddet
                      </button>
                    )}
                    {selectedStudent.status !== "Onaylandı" && (
                      <button 
                        onClick={() => handleStudentStatus(selectedStudent.id, "Onaylandı")}
                        className="px-6 py-2.5 bg-[#2E5A27] text-white rounded-xl font-bold text-sm hover:bg-[#386d30] shadow-lg transition-colors flex items-center gap-2"
                      >
                        <Check className="w-4 h-4" /> Onayla ve Vitrine Çıkar
                      </button>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
