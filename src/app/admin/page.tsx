"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, Briefcase, Search, ShieldCheck, LogOut, Eye, Check, X, 
  Building2, Phone, Mail, Trash2, ExternalLink, Lock, Loader2, 
  Sparkles, AlertCircle, RefreshCw, GraduationCap, MapPin, Globe, 
  KeyRound, UserPlus, ShieldAlert, CheckCircle2, Sliders, Edit3,
  Copy, Send, Download, MessageCircle, Upload, FileText, Save, Menu
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
  edevletDocUrl?: string;
  status: "Bekliyor" | "Onaylandı" | "Reddedildi";
  studentUsername?: string;
  studentPassword?: string;
  welcomeEmailSentAt?: string;
  rating: number;
  createdAt: string;
}

interface ApprovalModalData {
  student: Student;
  credentials: {
    username: string;
    password: string;
    emailContent: {
      to: string;
      subject: string;
      body: string;
    };
  };
  emailDelivery?: {
    success: boolean;
    message: string;
  };
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

  const [activeTab, setActiveTab] = useState<"talepler" | "ogrenciler" | "vitrin" | "yoneticiler" | "guvenlik" | "eposta">("talepler");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [smtpConfig, setSmtpConfig] = useState({
    host: "",
    port: 465,
    secure: true,
    user: "",
    pass: "",
    hasPass: false,
    fromName: "Ubuntu Network",
    fromEmail: "",
    resendApiKey: "",
    hasResendApiKey: false,
    provider: "smtp" as "smtp" | "resend",
    autoSendOnApproval: true,
  });
  const [smtpLoading, setSmtpLoading] = useState(false);
  const [smtpMsg, setSmtpMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [testEmailTarget, setTestEmailTarget] = useState("");
  const [testEmailLoading, setTestEmailLoading] = useState(false);
  const [testEmailMsg, setTestEmailMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [resendingMail, setResendingMail] = useState(false);
  const [resendMailMsg, setResendMailMsg] = useState<string | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [adminUsers, setAdminUsers] = useState<CurrentAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Öğrenci Detay Modalı
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Mevcut Üyeyi Vitrine Ekleme Modalı
  const [showAddVitrinModal, setShowAddVitrinModal] = useState(false);
  const [vitrinSearchTerm, setVitrinSearchTerm] = useState("");

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

  // Öğrenci Onay ve Giriş Bilgileri Modalı
  const [approvalModalData, setApprovalModalData] = useState<ApprovalModalData | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);

  const handleViewDoc = (docUrl?: string, docName?: string) => {
    if (!docUrl) {
      alert("Bu başvuru için yüklenmiş belge içeriği bulunmamaktadır.");
      return;
    }
    if (docUrl.startsWith("data:")) {
      try {
        const arr = docUrl.split(",");
        const mimeMatch = arr[0].match(/:(.*?);/);
        const mime = mimeMatch ? mimeMatch[1] : "application/octet-stream";
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        const blob = new Blob([u8arr], { type: mime });
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, "_blank");
      } catch (e) {
        window.open(docUrl, "_blank");
      }
    } else {
      window.open(docUrl, "_blank");
    }
  };

  const handleDownloadDoc = (docUrl?: string, docName?: string) => {
    if (!docUrl) return;
    const a = document.createElement("a");
    a.href = docUrl;
    a.download = docName || "ogrenci_belgesi.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleAdminAttachDoc = async (e: React.ChangeEvent<HTMLInputElement>, studentId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      alert("Belge boyutu 8MB'dan küçük olmalıdır.");
      return;
    }
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target?.result as string;
      try {
        const fallbackStudent = selectedStudent?.id === studentId ? selectedStudent : students.find(s => s.id === studentId);
        const payload = {
          id: studentId,
          edevletDocName: file.name,
          edevletDocUrl: dataUrl,
          student: fallbackStudent,
        };
        let res = await fetch(`/api/students/${studentId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.status === 404) {
          res = await fetch("/api/students", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
        }
        const data = await res.json();
        if (data.success) {
          setStudents(prev => {
            const nextList = prev.map(s => s.id === studentId ? { ...s, edevletDocName: file.name, edevletDocUrl: dataUrl } : s);
            try { localStorage.setItem("UBUNTU_STUDENTS_CACHE", JSON.stringify(nextList)); } catch (e) {}
            return nextList;
          });
          if (selectedStudent?.id === studentId) {
            setSelectedStudent(prev => prev ? { ...prev, edevletDocName: file.name, edevletDocUrl: dataUrl } : null);
          }
          alert("Öğrenci belgesi başarıyla sisteme kaydedildi!");
        } else {
          alert("Belge kaydedilemedi: " + (data.error || "Bilinmeyen hata."));
        }
      } catch (err: any) {
        alert("Bağlantı hatası: " + err.message);
      }
    };
    reader.readAsDataURL(file);
  };

  // Oturum Kontrolü ve Başlangıç Önbellek Yüklemesi
  useEffect(() => {
    const savedUser = sessionStorage.getItem("ubuntu_admin_user");
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        sessionStorage.removeItem("ubuntu_admin_user");
      }
    }
    // Önbellekteki yöneticileri anında yükle (sayfa yenilendiğinde kaybolmaması için)
    try {
      const cached = localStorage.getItem("UBUNTU_ADMINS_CACHE");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setAdminUsers(parsed);
        }
      }
    } catch (e) {}

    // Önbellekteki öğrencileri anında yükle (sayfa yenilendiğinde kaybolmaması için)
    try {
      const cachedStudents = localStorage.getItem("UBUNTU_STUDENTS_CACHE");
      if (cachedStudents) {
        const parsed = JSON.parse(cachedStudents);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setStudents(parsed);
        }
      }
    } catch (e) {}
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
      const cacheBust = `?t=${Date.now()}`;
      const [resStudents, resQuotes, resAdmins] = await Promise.all([
        fetch(`/api/students${cacheBust}`, { cache: "no-store" }),
        fetch(`/api/quotes${cacheBust}`, { cache: "no-store" }),
        fetch(`/api/admin/users${cacheBust}`, { cache: "no-store" }),
      ]);
      const dataStudents = await resStudents.json();
      const dataQuotes = await resQuotes.json();
      const dataAdmins = await resAdmins.json();

      if (dataStudents.success) {
        let serverStudents: Student[] = Array.isArray(dataStudents.students) ? dataStudents.students : [];
        let cachedStudents: Student[] = [];

        try {
          const cached = localStorage.getItem("UBUNTU_STUDENTS_CACHE");
          if (cached) {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed) && parsed.length > 0) {
              cachedStudents = parsed;
            }
          }
        } catch (e) {}

        const serverStudentIds = new Set(serverStudents.map(s => String(s.id).trim()));
        const missingOnServer = cachedStudents.filter(c => c.id && !serverStudentIds.has(String(c.id).trim()));

        if (missingOnServer.length > 0) {
          try {
            const syncRes = await fetch("/api/students", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ action: "sync", students: cachedStudents }),
            });
            const syncData = await syncRes.json();
            if (syncData.success && Array.isArray(syncData.students)) {
              serverStudents = syncData.students;
            } else {
              serverStudents = [...serverStudents, ...missingOnServer];
            }
          } catch {
            serverStudents = [...serverStudents, ...missingOnServer];
          }
        }

        const finalStudents = serverStudents.length > 0 ? serverStudents : cachedStudents;
        setStudents(finalStudents);
        try {
          if (finalStudents.length > 0) {
            localStorage.setItem("UBUNTU_STUDENTS_CACHE", JSON.stringify(finalStudents));
          }
        } catch (e) {}
      }
      if (dataQuotes.success) setQuotes(dataQuotes.quotes || []);

      // YÖNETİCİLERİ SENKRONİZE ET VE KALICI TUT
      let serverAdmins: CurrentAdmin[] = dataAdmins.success && Array.isArray(dataAdmins.admins) ? dataAdmins.admins : [];
      let cachedAdmins: CurrentAdmin[] = [];
      let storedPasswords: Record<string, string> = {};

      try {
        const cached = localStorage.getItem("UBUNTU_ADMINS_CACHE");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            cachedAdmins = parsed;
          }
        }
        const pwData = localStorage.getItem("UBUNTU_ADMIN_PASSWORDS");
        if (pwData) {
          storedPasswords = JSON.parse(pwData);
        }
      } catch (e) {}

      // Eğer tarayıcı önbelleğinde sunucuda olmayan yöneticiler varsa (örneğin sunucusuz cold start)
      const serverUsernames = new Set(serverAdmins.map((a: CurrentAdmin) => a.username?.toLowerCase()));
      const missingOnServer = cachedAdmins.filter((c: CurrentAdmin) => c.username && !serverUsernames.has(c.username.toLowerCase()));

      if (missingOnServer.length > 0) {
        try {
          const adminsToSync = cachedAdmins.map(adm => ({
            ...adm,
            passwordHash: storedPasswords[adm.username.toLowerCase()] || "ubuntu2026",
          }));
          const syncRes = await fetch("/api/admin/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "sync", admins: adminsToSync }),
          });
          const syncData = await syncRes.json();
          if (syncData.success && Array.isArray(syncData.admins)) {
            serverAdmins = syncData.admins;
          } else {
            serverAdmins = [...serverAdmins, ...missingOnServer];
          }
        } catch {
          serverAdmins = [...serverAdmins, ...missingOnServer];
        }
      }

      const finalAdmins = serverAdmins.length > 0 ? serverAdmins : cachedAdmins;
      setAdminUsers(finalAdmins);
      try {
        if (finalAdmins.length > 0) {
          localStorage.setItem("UBUNTU_ADMINS_CACHE", JSON.stringify(finalAdmins));
        }
      } catch (e) {}
    } catch (err) {
      console.error("Veri yüklenirken hata:", err);
      try {
        const cached = localStorage.getItem("UBUNTU_ADMINS_CACHE");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setAdminUsers(parsed);
          }
        }
      } catch (e) {}

      try {
        const cachedStudents = localStorage.getItem("UBUNTU_STUDENTS_CACHE");
        if (cachedStudents) {
          const parsed = JSON.parse(cachedStudents);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setStudents(parsed);
          }
        }
      } catch (e) {}
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
    const canApprove = currentUser?.role === "super_admin" || currentUser?.permissions?.canApproveStudents;
    if (!canApprove) {
      alert("Bu işlem için öğrenci onaylama yetkiniz bulunmamaktadır.");
      return;
    }

    const currentStudentObj = selectedStudent?.id === id 
      ? selectedStudent 
      : students.find(s => s.id === id);

    try {
      setStatusUpdatingId(id);

      const payload = {
        id,
        status,
        student: currentStudentObj,
      };

      // 1. Önce /api/students/${id} endpoint'ini çağır
      let res = await fetch(`/api/students/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // 2. Farklı serverless lambda konteyneri olması durumunda /api/students fallback'i
      if (res.status === 404) {
        res = await fetch("/api/students", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Öğrenci durumu güncellenemedi.");
      }

      const updated = data.student || (currentStudentObj ? { ...currentStudentObj, status } : { id, status });
      setStudents(prev => {
        const nextList = prev.map(s => s.id === id ? { ...s, ...updated } : s);
        try { localStorage.setItem("UBUNTU_STUDENTS_CACHE", JSON.stringify(nextList)); } catch (e) {}
        return nextList;
      });
      if (selectedStudent?.id === id) {
        setSelectedStudent(prev => prev ? { ...prev, ...updated } : null);
      }

      if (status === "Onaylandı" && data.generatedCredentials) {
        const creds = {
          username: data.generatedCredentials.username,
          password: data.generatedCredentials.password,
          emailContent: data.generatedCredentials.emailContent || {
            to: data.student?.email || currentStudentObj?.email || "",
            subject: "Ubuntu Network - Başvurunuz Onaylandı! Giriş Bilgileriniz",
            body: data.generatedCredentials.emailText || "",
          },
        };
        setApprovalModalData({
          student: data.student || updated,
          credentials: creds,
          emailDelivery: data.emailDelivery,
        });
      }
    } catch (err: any) {
      alert("Hata: " + (err.message || "Öğrenci durumu güncellenemedi."));
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const fetchSmtpConfig = async () => {
    try {
      setSmtpLoading(true);
      const res = await fetch("/api/admin/settings/email");
      const data = await res.json();
      if (data.success && data.config) {
        setSmtpConfig(prev => ({ ...prev, ...data.config }));
      }
    } catch (err) {
      console.error("SMTP config fetch error:", err);
    } finally {
      setSmtpLoading(false);
    }
  };

  const handleSaveSmtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSmtpMsg(null);
    try {
      setSmtpLoading(true);
      const res = await fetch("/api/admin/settings/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(smtpConfig),
      });
      const data = await res.json();
      if (data.success) {
        setSmtpMsg({ type: "success", text: "E-posta ayarları başarıyla kaydedildi!" });
      } else {
        setSmtpMsg({ type: "error", text: data.error || "Ayarlar kaydedilemedi." });
      }
    } catch (err: any) {
      setSmtpMsg({ type: "error", text: err.message || "Bağlantı hatası oluştu." });
    } finally {
      setSmtpLoading(false);
    }
  };

  const handleSendTestEmail = async () => {
    if (!testEmailTarget) {
      alert("Lütfen test e-postasının gönderileceği bir adres yazın.");
      return;
    }
    setTestEmailMsg(null);
    setTestEmailLoading(true);
    try {
      const res = await fetch("/api/admin/settings/email", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetEmail: testEmailTarget,
          config: smtpConfig,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTestEmailMsg({ type: "success", text: data.message || "Test e-postası başarıyla gönderildi!" });
      } else {
        setTestEmailMsg({ type: "error", text: data.message || data.error || "Test gönderimi başarısız oldu." });
      }
    } catch (err: any) {
      setTestEmailMsg({ type: "error", text: err.message || "Bağlantı hatası." });
    } finally {
      setTestEmailLoading(false);
    }
  };

  const handleResendApprovalEmail = async (student: Student, creds: any) => {
    setResendingMail(true);
    setResendMailMsg(null);
    try {
      const res = await fetch(`/api/students/${student.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "Onaylandı",
          student,
        }),
      });
      const data = await res.json();
      if (data.emailDelivery?.success) {
        setResendMailMsg("✓ E-posta başarıyla iletildi!");
      } else {
        setResendMailMsg("⚠️ " + (data.emailDelivery?.message || "E-posta gönderilemedi."));
      }
    } catch (err: any) {
      setResendMailMsg("Hata: " + err.message);
    } finally {
      setResendingMail(false);
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

      const createdAdmin = data.admin;
      const nextAdmins = [...adminUsers.filter(a => a.id !== createdAdmin.id), createdAdmin];
      setAdminUsers(nextAdmins);

      // Tarayıcı önbelleğinde ve şifre haritasında kalıcı olarak sakla
      try {
        localStorage.setItem("UBUNTU_ADMINS_CACHE", JSON.stringify(nextAdmins));
        let pwMap: Record<string, string> = {};
        const stored = localStorage.getItem("UBUNTU_ADMIN_PASSWORDS");
        if (stored) pwMap = JSON.parse(stored);
        pwMap[createdAdmin.username.toLowerCase()] = newAdminPassword;
        localStorage.setItem("UBUNTU_ADMIN_PASSWORDS", JSON.stringify(pwMap));
      } catch (e) {}

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
    const newStatus: "active" | "inactive" = admin.status === "active" ? "inactive" : "active";
    try {
      const res = await fetch(`/api/admin/users/${admin.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        const nextAdmins = adminUsers.map(a => a.id === admin.id ? { ...a, status: newStatus } : a);
        setAdminUsers(nextAdmins);
        try {
          localStorage.setItem("UBUNTU_ADMINS_CACHE", JSON.stringify(nextAdmins));
        } catch (e) {}
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
        const nextAdmins = adminUsers.filter(a => a.id !== adminId);
        setAdminUsers(nextAdmins);
        try {
          localStorage.setItem("UBUNTU_ADMINS_CACHE", JSON.stringify(nextAdmins));
        } catch (e) {}
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
        try {
          let pwMap: Record<string, string> = {};
          const stored = localStorage.getItem("UBUNTU_ADMIN_PASSWORDS");
          if (stored) pwMap = JSON.parse(stored);
          pwMap[adminUsername.toLowerCase()] = newPassword;
          localStorage.setItem("UBUNTU_ADMIN_PASSWORDS", JSON.stringify(pwMap));
        } catch (e) {}
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
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Mobile Top Header (Screens < 1024px) */}
      <div className="lg:hidden h-16 bg-[#1A1A1A] text-white flex items-center justify-between px-4 border-b border-white/10 shrink-0 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-white hover:bg-white/10 rounded-xl transition-colors"
            aria-label="Menüyü Aç"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <div>
            <h1 className="text-lg font-extrabold tracking-widest text-[#2E5A27] leading-none">UBUNTU</h1>
            <p className="text-[#D97725] text-[9px] tracking-widest font-bold uppercase mt-0.5">Yönetim Portalı</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={fetchData} 
            className="p-2 text-gray-300 hover:text-white rounded-xl transition-colors"
            title="Yenile"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <div className="w-8 h-8 rounded-lg bg-[#2E5A27] text-white font-bold flex items-center justify-center text-xs">
            {currentUser.username[0].toUpperCase()}
          </div>
        </div>
      </div>

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
        />
      )}

      {/* Sidebar (Desktop static, Mobile slide-over drawer) */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-[#1A1A1A] text-white flex flex-col h-screen transform transition-transform duration-300 ease-in-out
        lg:static lg:translate-x-0 lg:w-64 lg:h-screen lg:shrink-0
        ${mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-widest text-[#2E5A27]">UBUNTU</h1>
            <p className="text-[#D97725] text-[10px] tracking-widest font-bold mt-1 uppercase">Yönetim & Yetkilendirme</p>
          </div>
          <button 
            onClick={() => setMobileMenuOpen(false)} 
            className="lg:hidden p-2 text-gray-400 hover:text-white rounded-xl"
            aria-label="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <button 
            onClick={() => { setActiveTab("talepler"); setMobileMenuOpen(false); }}
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
            onClick={() => { setActiveTab("ogrenciler"); setMobileMenuOpen(false); }}
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
            onClick={() => { setActiveTab("vitrin"); setMobileMenuOpen(false); }}
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
            onClick={() => { setActiveTab("yoneticiler"); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm ${activeTab === 'yoneticiler' ? 'bg-[#2E5A27] text-white font-bold shadow-md' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <KeyRound className="w-4 h-4 shrink-0 text-[#D97725]" /> Yöneticiler & Yetkiler
            <span className="ml-auto text-xs bg-white/10 px-2 py-0.5 rounded font-mono">
              {adminUsers.length}
            </span>
          </button>

          <button 
            onClick={() => { setActiveTab("guvenlik"); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm ${activeTab === 'guvenlik' ? 'bg-[#2E5A27] text-white font-bold shadow-md' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <Sliders className="w-4 h-4 shrink-0" /> Şifre & Güvenlik
          </button>

          <button 
            onClick={() => { setActiveTab("eposta"); fetchSmtpConfig(); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm ${activeTab === 'eposta' ? 'bg-[#2E5A27] text-white font-bold shadow-md' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <Mail className="w-4 h-4 shrink-0 text-[#D97725]" /> Otomatik E-Posta (SMTP)
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
      <main className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        {/* Header */}
        <header className="h-16 sm:h-20 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-8 shrink-0 gap-3">
          <div className="flex items-center gap-4 flex-1 max-w-xs sm:max-w-md">
            <div className="relative w-full">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Öğrenci, şirket veya telefon ara..." 
                className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 bg-gray-100 rounded-full text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#2E5A27]/50" 
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <button 
              onClick={fetchData} 
              className="p-2 text-gray-500 hover:text-[#2E5A27] hover:bg-gray-100 rounded-full transition-colors hidden sm:block"
              title="Yenile"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <a 
              href="/" 
              target="_blank" 
              className="flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-[#2E5A27] bg-gray-100 px-3 py-2 rounded-xl transition-colors"
            >
              <span className="hidden sm:inline">Vitrine Git</span> <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-gray-200">
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
        <div className="flex-1 overflow-auto p-3 sm:p-6 lg:p-8">
          
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
                      <table className="w-full text-left min-w-[720px]">
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
                                  
                                  {(currentUser.role === "super_admin" || currentUser.permissions.canApproveStudents) && (
                                    <>
                                      {student.status !== "Onaylandı" ? (
                                        <button 
                                          disabled={statusUpdatingId === student.id}
                                          onClick={() => handleStudentStatus(student.id, "Onaylandı")}
                                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors font-bold disabled:opacity-50" 
                                          title="Vitrine Al & Onayla"
                                        >
                                          {statusUpdatingId === student.id ? <Loader2 className="w-4 h-4 animate-spin text-emerald-600" /> : <Sparkles className="w-4 h-4" />}
                                        </button>
                                      ) : (
                                        <button 
                                          disabled={statusUpdatingId === student.id}
                                          onClick={() => handleStudentStatus(student.id, "Bekliyor")}
                                          className="p-2 text-emerald-700 bg-emerald-50 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors font-bold disabled:opacity-50" 
                                          title="Vitrinde Yayında (Tıklayarak Vitrinden Kaldır)"
                                        >
                                          {statusUpdatingId === student.id ? <Loader2 className="w-4 h-4 animate-spin text-orange-600" /> : <ShieldCheck className="w-4 h-4" />}
                                        </button>
                                      )}

                                      {student.status !== "Reddedildi" && (
                                        <button 
                                          disabled={statusUpdatingId === student.id}
                                          onClick={() => handleStudentStatus(student.id, "Reddedildi")}
                                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50" 
                                          title="Reddet"
                                        >
                                          {statusUpdatingId === student.id ? <Loader2 className="w-4 h-4 animate-spin text-red-500" /> : <X className="w-4 h-4" />}
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-[#1A1A1A]">Yayındaki Vitrin Profilleri</h2>
                    <p className="text-gray-500 text-sm mt-1">
                      Şu anda ana sayfada işverenlerin görebildiği ve teklif isteyebildiği aktif yetenekler.
                    </p>
                  </div>

                  {(currentUser.role === "super_admin" || currentUser.permissions.canApproveStudents) && (
                    <button 
                      onClick={() => { setShowAddVitrinModal(true); setVitrinSearchTerm(""); }}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2E5A27] hover:bg-[#386d30] text-white rounded-xl font-bold text-sm shadow-md transition-all shrink-0"
                    >
                      <Sparkles className="w-4 h-4" /> Mevcut Üyeyi Vitrine Al
                    </button>
                  )}
                </div>

                {students.filter(s => s.status === "Onaylandı").length === 0 ? (
                  <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                    <Sparkles className="w-12 h-12 text-[#2E5A27]/40 mx-auto mb-3" />
                    <h3 className="text-gray-800 font-bold text-lg mb-1">Şu Anda Vitrinde Gösterilen Üye Yok</h3>
                    <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
                      Kayıtlı mevcut adaylar arasından dilediğinizi vitrine çıkararak ana sayfada işverenlere sergileyebilirsiniz.
                    </p>
                    {(currentUser.role === "super_admin" || currentUser.permissions.canApproveStudents) && (
                      <button 
                        onClick={() => { setShowAddVitrinModal(true); setVitrinSearchTerm(""); }}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#2E5A27] hover:bg-[#386d30] text-white rounded-xl font-bold text-sm shadow-lg transition-all"
                      >
                        <Sparkles className="w-4 h-4" /> Mevcut Üyeyi Vitrine Al
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {students.filter(s => s.status === "Onaylandı").map(student => (
                      <div key={student.id} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
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
                          <button
                            onClick={() => setSelectedStudent(student)}
                            className="text-xs text-gray-600 hover:text-blue-600 font-bold flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" /> Detaylar
                          </button>
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
                )}
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

            {/* 6. SEKME: OTOMATİK E-POSTA & SMTP AYARLARI */}
            {activeTab === 'eposta' && (
              <motion.div key="eposta" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-[#1A1A1A] flex items-center gap-2">
                      <Mail className="w-6 h-6 text-[#2E5A27]" /> Otomatik E-Posta & SMTP Yapılandırması
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                      Öğrenci başvurusu onaylandığı saniyede şifre ve giriş bilgilerini arka planda otomatik iletmek için e-posta sunucunuzu bağlayın.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-3.5 py-1.5 rounded-full text-xs font-bold border flex items-center gap-2 ${
                      smtpConfig.host && smtpConfig.user && smtpConfig.hasPass
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${smtpConfig.host && smtpConfig.user && smtpConfig.hasPass ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
                      {smtpConfig.host && smtpConfig.user && smtpConfig.hasPass ? "SMTP Bağlantısı Hazır" : "Yapılandırma Bekleniyor"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* SMTP Ayar Formu */}
                  <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
                    <h3 className="text-lg font-bold text-[#1A1A1A] mb-6 flex items-center gap-2 border-b pb-4">
                      <Sliders className="w-5 h-5 text-[#D97725]" /> Sunucu İletişim Ayarları
                    </h3>

                    {smtpMsg && (
                      <div className={`p-4 rounded-xl text-xs mb-6 flex items-center gap-2 ${
                        smtpMsg.type === "success" ? "bg-emerald-50 border border-emerald-200 text-emerald-800" : "bg-red-50 border border-red-200 text-red-700"
                      }`}>
                        {smtpMsg.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                        <span>{smtpMsg.text}</span>
                      </div>
                    )}

                    <form onSubmit={handleSaveSmtp} className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
                          Gönderim Altyapısı
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => setSmtpConfig({ ...smtpConfig, provider: "smtp" })}
                            className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                              smtpConfig.provider === "smtp"
                                ? "border-[#2E5A27] bg-[#2E5A27]/5 text-[#2E5A27]"
                                : "border-gray-200 text-gray-600 hover:bg-gray-50"
                            }`}
                          >
                            <span className="block text-sm">Kurumsal SMTP Sunucusu</span>
                            <span className="text-[11px] font-normal text-gray-500">cPanel, Yandex, Natro, Gmail vb.</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setSmtpConfig({ ...smtpConfig, provider: "resend" })}
                            className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                              smtpConfig.provider === "resend"
                                ? "border-[#D97725] bg-[#D97725]/5 text-[#D97725]"
                                : "border-gray-200 text-gray-600 hover:bg-gray-50"
                            }`}
                          >
                            <span className="block text-sm">Resend API</span>
                            <span className="text-[11px] font-normal text-gray-500">Geliştirici e-posta servisi</span>
                          </button>
                        </div>
                      </div>

                      {smtpConfig.provider === "smtp" ? (
                        <>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="sm:col-span-2">
                              <label className="text-xs font-bold text-gray-700 block mb-1">
                                SMTP Sunucu Adresi (Host) *
                              </label>
                              <input
                                type="text"
                                required
                                value={smtpConfig.host}
                                onChange={(e) => setSmtpConfig({ ...smtpConfig, host: e.target.value })}
                                placeholder="Örn: mail.ubuntunetwork.com.tr veya smtp.gmail.com"
                                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2E5A27]"
                              />
                            </div>

                            <div>
                              <label className="text-xs font-bold text-gray-700 block mb-1">
                                Port *
                              </label>
                              <input
                                type="number"
                                required
                                value={smtpConfig.port}
                                onChange={(e) => setSmtpConfig({ ...smtpConfig, port: Number(e.target.value) })}
                                placeholder="465 veya 587"
                                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2E5A27]"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs font-bold text-gray-700 block mb-1">
                                E-Posta / Kullanıcı Adı *
                              </label>
                              <input
                                type="text"
                                required
                                value={smtpConfig.user}
                                onChange={(e) => setSmtpConfig({ ...smtpConfig, user: e.target.value })}
                                placeholder="Örn: bilgi@ubuntunetwork.com.tr"
                                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2E5A27]"
                              />
                            </div>

                            <div>
                              <label className="text-xs font-bold text-gray-700 block mb-1">
                                E-Posta Şifresi *
                              </label>
                              <input
                                type="password"
                                value={smtpConfig.pass}
                                onChange={(e) => setSmtpConfig({ ...smtpConfig, pass: e.target.value })}
                                placeholder={smtpConfig.hasPass ? "•••••••• (Kayıtlı Şifre)" : "Şifrenizi yazın"}
                                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2E5A27]"
                              />
                            </div>
                          </div>
                        </>
                      ) : (
                        <div>
                          <label className="text-xs font-bold text-gray-700 block mb-1">
                            Resend API Anahtarı (API Key) *
                          </label>
                          <input
                            type="password"
                            value={smtpConfig.resendApiKey}
                            onChange={(e) => setSmtpConfig({ ...smtpConfig, resendApiKey: e.target.value })}
                            placeholder={smtpConfig.hasResendApiKey ? "•••••••• (Kayıtlı Anahtar)" : "re_123456789..."}
                            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#D97725]"
                          />
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <div>
                          <label className="text-xs font-bold text-gray-700 block mb-1">
                            Gönderen Adı
                          </label>
                          <input
                            type="text"
                            value={smtpConfig.fromName}
                            onChange={(e) => setSmtpConfig({ ...smtpConfig, fromName: e.target.value })}
                            placeholder="Örn: Ubuntu Network"
                            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2E5A27]"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold text-gray-700 block mb-1">
                            Gönderen E-Posta Adresi
                          </label>
                          <input
                            type="email"
                            value={smtpConfig.fromEmail}
                            onChange={(e) => setSmtpConfig({ ...smtpConfig, fromEmail: e.target.value })}
                            placeholder="Örn: bilgi@ubuntunetwork.com.tr"
                            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2E5A27]"
                          />
                        </div>
                      </div>

                      <div className="pt-3 border-t border-gray-100">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={smtpConfig.autoSendOnApproval}
                            onChange={(e) => setSmtpConfig({ ...smtpConfig, autoSendOnApproval: e.target.checked })}
                            className="w-4 h-4 text-[#2E5A27] rounded focus:ring-[#2E5A27]"
                          />
                          <span className="text-xs font-bold text-gray-700">
                            Öğrenci onaylandığı anda kurumsal hoş geldin e-postası ve şifresi otomatik olarak gönderilsin
                          </span>
                        </label>
                      </div>

                      <div className="pt-4 flex justify-end">
                        <button
                          type="submit"
                          disabled={smtpLoading}
                          className="px-6 py-3 bg-[#2E5A27] hover:bg-[#386d30] text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center gap-2 disabled:opacity-70"
                        >
                          {smtpLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                          E-Posta Ayarlarını Kaydet
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Test ve Bilgilendirme Kartı */}
                  <div className="lg:col-span-5 space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                      <h4 className="font-bold text-[#1A1A1A] flex items-center gap-2 mb-3 text-sm">
                        <Send className="w-4 h-4 text-[#2E5A27]" /> E-Posta Gönderim Testi
                      </h4>
                      <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                        Ayarlarınızı kaydettikten sonra aşağıdaki alana kendi e-posta adresinizi yazarak anında test maili gönderebilirsiniz.
                      </p>

                      <div className="space-y-3">
                        <input
                          type="email"
                          value={testEmailTarget}
                          onChange={(e) => setTestEmailTarget(e.target.value)}
                          placeholder="Testin gideceği e-posta (Örn: sizin@mailiniz.com)"
                          className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#2E5A27]"
                        />

                        {testEmailMsg && (
                          <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                            testEmailMsg.type === "success" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"
                          }`}>
                            {testEmailMsg.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" /> : <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />}
                            <span>{testEmailMsg.text}</span>
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={handleSendTestEmail}
                          disabled={testEmailLoading}
                          className="w-full py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl font-bold text-xs shadow transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                          {testEmailLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" /> Test Maili İletiliyor...
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4" /> Test E-Postası Gönder
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="bg-[#FAF9F6] rounded-2xl border border-gray-200 p-5 space-y-3 text-xs">
                      <h5 className="font-bold text-[#1A1A1A] flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-[#D97725]" /> Yaygın Sunucu Bilgileri
                      </h5>
                      <div className="space-y-2 text-gray-600">
                        <div className="p-2.5 bg-white rounded-xl border border-gray-200">
                          <strong className="text-gray-900 block mb-0.5">Yandex Kurumsal:</strong>
                          <span>Host: <code>smtp.yandex.com</code> • Port: <code>465</code> (SSL)</span>
                        </div>
                        <div className="p-2.5 bg-white rounded-xl border border-gray-200">
                          <strong className="text-gray-900 block mb-0.5">Gmail:</strong>
                          <span>Host: <code>smtp.gmail.com</code> • Port: <code>465</code> (SSL) • <em>Google Uygulama Şifresi gereklidir.</em></span>
                        </div>
                        <div className="p-2.5 bg-white rounded-xl border border-gray-200">
                          <strong className="text-gray-900 block mb-0.5">cPanel / Turhost / Natro:</strong>
                          <span>Host: <code>mail.ubuntunetwork.com.tr</code> • Port: <code>465</code> (SSL) veya <code>587</code></span>
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

      {/* MEVCUT ÜYEYİ VİTRİNE EKLEME MODALI */}
      <AnimatePresence>
        {showAddVitrinModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] shadow-2xl relative flex flex-col my-auto overflow-hidden"
            >
              <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#2E5A27] flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-[#1A1A1A]">Mevcut Üyeyi Vitrine Al</h3>
                    <p className="text-xs text-gray-500">Kayıtlı adaylar arasından seçim yaparak ana sayfa vitrininde yayınlayın.</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowAddVitrinModal(false)}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  aria-label="Kapat"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Arama Inputu */}
              <div className="p-4 bg-gray-50 border-b border-gray-100">
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text"
                    value={vitrinSearchTerm}
                    onChange={(e) => setVitrinSearchTerm(e.target.value)}
                    placeholder="Aday adı, soyadı, üniversite, bölüm veya şehir ile ara..."
                    className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2E5A27]"
                  />
                </div>
              </div>

              {/* Üye Listesi */}
              <div className="p-4 overflow-y-auto flex-1 space-y-3 max-h-[55vh]">
                {(() => {
                  const eligible = students.filter(s => {
                    if (!vitrinSearchTerm) return true;
                    const q = vitrinSearchTerm.toLowerCase();
                    return (
                      (s.fullName || s.name || "").toLowerCase().includes(q) ||
                      (s.surname || "").toLowerCase().includes(q) ||
                      (s.uni || "").toLowerCase().includes(q) ||
                      (s.dept || "").toLowerCase().includes(q) ||
                      (s.city || "").toLowerCase().includes(q) ||
                      (s.category || "").toLowerCase().includes(q)
                    );
                  });

                  if (eligible.length === 0) {
                    return (
                      <div className="py-12 text-center text-gray-400">
                        <Users className="w-10 h-10 mx-auto mb-2 opacity-40" />
                        <p className="text-sm font-semibold">Aramanıza uygun aday bulunamadı.</p>
                      </div>
                    );
                  }

                  return eligible.map(candidate => {
                    const isAlreadyInVitrin = candidate.status === "Onaylandı";
                    return (
                      <div 
                        key={candidate.id}
                        className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                          isAlreadyInVitrin ? 'bg-emerald-50/50 border-emerald-200' : 'bg-white border-gray-200 hover:border-[#2E5A27]/50'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-11 h-11 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                            {candidate.photo ? (
                              <img src={candidate.photo} alt={candidate.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center font-bold text-gray-500 text-sm">
                                {candidate.name[0]}
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-[#1A1A1A] text-sm truncate">
                              {candidate.fullName || `${candidate.name} ${candidate.surname || ''}`.trim()}
                            </h4>
                            <p className="text-xs text-gray-500 truncate">
                              {candidate.uni} • {candidate.dept}
                            </p>
                            <p className="text-[11px] text-[#D97725] font-semibold mt-0.5">
                              {candidate.category} • {candidate.city}
                            </p>
                          </div>
                        </div>

                        <div className="shrink-0 flex items-center gap-2">
                          {isAlreadyInVitrin ? (
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Vitrinde
                              </span>
                              <button
                                disabled={statusUpdatingId === candidate.id}
                                onClick={async () => {
                                  await handleStudentStatus(candidate.id, "Bekliyor");
                                }}
                                className="text-xs text-orange-600 hover:text-orange-800 font-bold px-2 py-1 hover:bg-orange-50 rounded-lg transition-colors"
                              >
                                Kaldır
                              </button>
                            </div>
                          ) : (
                            <button
                              disabled={statusUpdatingId === candidate.id}
                              onClick={async () => {
                                await handleStudentStatus(candidate.id, "Onaylandı");
                              }}
                              className="px-4 py-2 bg-[#2E5A27] hover:bg-[#386d30] text-white rounded-xl text-xs font-bold shadow transition-all flex items-center gap-1.5 disabled:opacity-50"
                            >
                              {statusUpdatingId === candidate.id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Sparkles className="w-3.5 h-3.5" />
                              )}
                              Vitrine Al
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>

              <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  Toplam {students.length} adayın {students.filter(s => s.status === "Onaylandı").length} tanesi vitrinde.
                </span>
                <button
                  onClick={() => setShowAddVitrinModal(false)}
                  className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl text-xs font-bold transition-colors"
                >
                  Kapat
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* YENİ YÖNETİCİ EKLEME MODALI */}
      <AnimatePresence>
        {showAddAdminModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl w-full max-w-xl max-h-[92vh] overflow-y-auto shadow-2xl relative p-5 sm:p-8 my-auto"
            >
              <button 
                onClick={() => setShowAddAdminModal(false)} 
                className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                aria-label="Kapat"
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl relative p-5 sm:p-8 my-auto"
            >
              <button 
                onClick={() => setSelectedStudent(null)} 
                className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                aria-label="Kapat"
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
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className="text-xs font-semibold text-gray-800 bg-white border border-gray-300 px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm max-w-[200px] truncate" title={selectedStudent.edevletDocName || "ogrenci_belgesi.pdf"}>
                        <FileText className="w-3.5 h-3.5 text-[#2E5A27] shrink-0" />
                        <span className="truncate">{selectedStudent.edevletDocName || "ogrenci_belgesi.pdf"}</span>
                      </span>

                      {selectedStudent.edevletDocUrl ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleViewDoc(selectedStudent.edevletDocUrl, selectedStudent.edevletDocName)}
                            className="px-3 py-1.5 bg-[#2E5A27] hover:bg-[#386d30] text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                            title="Belgeyi Yeni Sekmede Görüntüle"
                          >
                            <Eye className="w-3.5 h-3.5" /> Görüntüle
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDownloadDoc(selectedStudent.edevletDocUrl, selectedStudent.edevletDocName)}
                            className="px-3 py-1.5 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                            title="Belgeyi Bilgisayara İndir"
                          >
                            <Download className="w-3.5 h-3.5" /> İndir
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-wrap items-center gap-1.5">
                          <label className="px-2.5 py-1.5 bg-[#D97725] hover:bg-[#c36a21] text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-sm">
                            <Upload className="w-3.5 h-3.5" /> Belge Yükle
                            <input
                              type="file"
                              accept=".pdf, image/*"
                              className="hidden"
                              onChange={(e) => handleAdminAttachDoc(e, selectedStudent.id)}
                            />
                          </label>
                          <a
                            href={`https://wa.me/${selectedStudent.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Merhaba ${selectedStudent.fullName || selectedStudent.name}, Ubuntu Network başvurunuzun onaylanması için lütfen e-Devlet güncel öğrenci belgenizi bu mesaja yanıt olarak iletiniz.`)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2.5 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 shadow-sm"
                            title="Adaya WhatsApp'tan Belge İsteme Mesajı Gönder"
                          >
                            <MessageCircle className="w-3.5 h-3.5" /> WhatsApp&apos;tan İste
                          </a>
                        </div>
                      )}
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

                {selectedStudent.studentUsername && (
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <KeyRound className="w-4 h-4 text-[#2E5A27]" /> Öğrenci Portalı Giriş Bilgileri
                    </h4>
                    <div className="bg-emerald-50/60 border border-emerald-200/80 p-4 rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-gray-500">Kullanıcı Adı</span>
                        <div className="font-mono font-bold text-gray-900 text-sm mt-0.5">
                          {selectedStudent.studentUsername}
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-gray-500">Parola Durumu</span>
                        <div className="font-mono font-bold text-gray-900 text-sm mt-0.5">
                          {selectedStudent.studentPassword ? selectedStudent.studentPassword : "•••••••• (Öğrenci Tarafından Değiştirildi)"}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Aksiyon Butonları */}
              <div className="pt-6 border-t border-gray-200 flex justify-end gap-3">
                <button 
                  onClick={() => setSelectedStudent(null)}
                  className="px-5 py-2.5 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors"
                >
                  Kapat
                </button>
                {(currentUser.role === "super_admin" || currentUser.permissions.canApproveStudents) && (
                  <>
                    {selectedStudent.status !== "Reddedildi" && (
                      <button 
                        disabled={statusUpdatingId === selectedStudent.id}
                        onClick={() => handleStudentStatus(selectedStudent.id, "Reddedildi")}
                        className="px-5 py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-xl font-bold text-sm hover:bg-red-600 hover:text-white transition-colors flex items-center gap-1.5 disabled:opacity-50"
                      >
                        {statusUpdatingId === selectedStudent.id ? <Loader2 className="w-4 h-4 animate-spin text-red-600" /> : null}
                        Reddet
                      </button>
                    )}
                    {selectedStudent.status === "Onaylandı" ? (
                      <button 
                        disabled={statusUpdatingId === selectedStudent.id}
                        onClick={() => handleStudentStatus(selectedStudent.id, "Bekliyor")}
                        className="px-6 py-2.5 bg-orange-50 text-orange-700 border border-orange-200 rounded-xl font-bold text-sm hover:bg-orange-100 transition-colors flex items-center gap-2 disabled:opacity-50"
                      >
                        {statusUpdatingId === selectedStudent.id ? <Loader2 className="w-4 h-4 animate-spin text-orange-700" /> : <X className="w-4 h-4" />}
                        Vitrinden Kaldır
                      </button>
                    ) : (
                      <button 
                        disabled={statusUpdatingId === selectedStudent.id}
                        onClick={() => handleStudentStatus(selectedStudent.id, "Onaylandı")}
                        className="px-6 py-2.5 bg-[#2E5A27] text-white rounded-xl font-bold text-sm hover:bg-[#386d30] shadow-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                      >
                        {statusUpdatingId === selectedStudent.id ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <Sparkles className="w-4 h-4" />}
                        Vitrine Al & Onayla
                      </button>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ÖĞRENCİ ONAYLANDI & GİRİŞ BİLGİLERİ MODALI */}
      <AnimatePresence>
        {approvalModalData && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl relative p-5 sm:p-8 border border-emerald-100 my-auto"
            >
              <button 
                onClick={() => setApprovalModalData(null)} 
                className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                aria-label="Kapat"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-[#1A1A1A]">Öğrenci Onaylandı!</h3>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Öğrenci vitrine çıkarıldı ve öğrenci paneli giriş hesabı oluşturuldu.
                  </p>
                </div>
              </div>

              {/* Aday Bilgisi & Bilgiler */}
              <div className="bg-[#1A1A1A] text-white p-5 rounded-2xl mb-5 space-y-4 shadow-inner">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400">Aday</span>
                    <p className="font-bold text-white text-base">
                      {approvalModalData.student.fullName || approvalModalData.student.name}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                    ✓ Aktif Öğrenci Hesabı
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white/5 border border-white/10 p-3 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400">Kullanıcı Adı</span>
                      <p className="font-mono font-bold text-[#D97725] text-sm sm:text-base">
                        {approvalModalData.credentials.username}
                      </p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(approvalModalData.credentials.username, "uname")}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                      title="Kopyala"
                    >
                      {copiedField === "uname" ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="bg-white/5 border border-white/10 p-3 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400">Geçici Şifre</span>
                      <p className="font-mono font-bold text-emerald-400 text-sm sm:text-base">
                        {approvalModalData.credentials.password}
                      </p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(approvalModalData.credentials.password, "pwd")}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                      title="Kopyala"
                    >
                      {copiedField === "pwd" ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="text-xs text-gray-400 flex items-center justify-between pt-1">
                  <span>Öğrenci Giriş Linki: <strong className="text-gray-200">/giris</strong></span>
                  <button
                    onClick={() => copyToClipboard(`Kullanıcı Adı: ${approvalModalData.credentials.username}\nŞifre: ${approvalModalData.credentials.password}\nGiriş: https://www.ubuntunetwork.com.tr/giris`, "both")}
                    className="text-xs font-bold text-[#D97725] hover:underline flex items-center gap-1"
                  >
                    {copiedField === "both" ? "Kopyalandı!" : "Tüm Giriş Bilgilerini Kopyala"}
                  </button>
                </div>
              </div>

              {/* Otomatik E-Posta İletim Durumu */}
              {approvalModalData.emailDelivery && (
                <div className={`p-4 rounded-2xl mb-5 text-xs flex items-center justify-between gap-3 ${
                  approvalModalData.emailDelivery.success
                    ? "bg-emerald-50 border border-emerald-200 text-emerald-900"
                    : "bg-amber-50 border border-amber-200 text-amber-900"
                }`}>
                  <div className="flex items-center gap-3">
                    {approvalModalData.emailDelivery.success ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-6 h-6 text-amber-600 shrink-0" />
                    )}
                    <div>
                      <p className="font-bold text-sm">
                        {approvalModalData.emailDelivery.success
                          ? "✓ Kurumsal E-Posta Arka Planda Otomatik Gönderildi!"
                          : "⚠️ Otomatik E-Posta Gönderilemedi"}
                      </p>
                      <p className="text-[11px] opacity-80 mt-0.5">
                        {approvalModalData.emailDelivery.success
                          ? `Öğrencinin kayıtlı adresi (${approvalModalData.credentials.emailContent.to}) üzerine giriş bilgileri başarıyla iletilmiştir.`
                          : approvalModalData.emailDelivery.message}
                      </p>
                    </div>
                  </div>

                  {!approvalModalData.emailDelivery.success && (
                    <button
                      type="button"
                      onClick={() => {
                        setApprovalModalData(null);
                        setActiveTab("eposta");
                        fetchSmtpConfig();
                      }}
                      className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs transition-colors shrink-0"
                    >
                      SMTP Ayarla
                    </button>
                  )}
                </div>
              )}

              {resendMailMsg && (
                <div className="p-3 bg-blue-50 border border-blue-200 text-blue-800 rounded-xl text-xs mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{resendMailMsg}</span>
                </div>
              )}

              {/* Kurumsal E-Posta Önizlemesi */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-500">
                    Öğrenciye Hazırlanan Kurumsal E-Posta Metni
                  </h4>
                  <span className="text-[11px] text-gray-400">{approvalModalData.credentials.emailContent.to}</span>
                </div>
                <div className="bg-gray-50 border border-gray-200 p-4 rounded-2xl text-xs font-mono text-gray-800 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                  {approvalModalData.credentials.emailContent.body}
                </div>
              </div>

              {/* Hızlı Aksiyon Butonları */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <button
                  type="button"
                  disabled={resendingMail}
                  onClick={() => handleResendApprovalEmail(approvalModalData.student, approvalModalData.credentials)}
                  className="py-3 px-3 bg-[#2E5A27] text-white rounded-xl font-bold text-xs hover:bg-[#386d30] shadow flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                  title="Sunucudan otomatik e-posta gönder"
                >
                  {resendingMail ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                  Otomatik E-Posta Gönder
                </button>

                {approvalModalData.student.phone && (
                  <a
                    href={`https://api.whatsapp.com/send?phone=${approvalModalData.student.phone.replace(/[^0-9]/g, '')}&text=${encodeURIComponent(
                      `Merhaba ${approvalModalData.student.fullName || approvalModalData.student.name},\n\nUbuntu Network yetenek ağına yapmış olduğunuz başvurunuz onaylanmıştır! 🎉\n\nÖğrenci Portalı Giriş Bilgileriniz:\n🔗 https://www.ubuntunetwork.com.tr/giris\n👤 Kullanıcı Adı: ${approvalModalData.credentials.username}\n🔑 Geçici Şifre: ${approvalModalData.credentials.password}\n\nUbuntu Network ailesine hoş geldiniz!`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-3 bg-[#25D366] text-white rounded-xl font-bold text-xs hover:bg-[#20ba59] shadow flex items-center justify-center gap-1.5 transition-all"
                  >
                    <MessageCircle className="w-4 h-4" /> WhatsApp ile Gönder
                  </a>
                )}

                <a
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(approvalModalData.credentials.emailContent.to)}&su=${encodeURIComponent(approvalModalData.credentials.emailContent.subject)}&body=${encodeURIComponent(approvalModalData.credentials.emailContent.body)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-3 bg-red-600 text-white rounded-xl font-bold text-xs hover:bg-red-700 shadow flex items-center justify-center gap-1.5 transition-all"
                >
                  <Mail className="w-4 h-4" /> Gmail'de Aç
                </a>

                <button
                  type="button"
                  onClick={() => copyToClipboard(approvalModalData.credentials.emailContent.body, "mailbody")}
                  className="py-3 px-3 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Copy className="w-4 h-4" />
                  {copiedField === "mailbody" ? "Kopyalandı!" : "Metni Kopyala"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
