import fs from "fs/promises";
import path from "path";
import os from "os";

export interface StudentRecord {
  id: string;
  name: string;
  surname: string;
  fullName: string;
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
  photo: string;
  edevletDocName?: string;
  edevletDocUrl?: string;
  status: "Bekliyor" | "Onaylandı" | "Reddedildi";
  rating: number;
  createdAt: string;
  studentUsername?: string;
  studentPassword?: string;
  welcomeEmailSentAt?: string;
}

export interface QuoteRecord {
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

export interface AdminUserRecord {
  id: string;
  username: string;
  passwordHash: string;
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

// Vercel serverless ortamında /var/task dizini salt-okunurdur (read-only).
// Yazılabilir tek dizin /tmp (os.tmpdir()) dizinidir.
const isServerless = 
  process.env.VERCEL === "1" || 
  Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME) || 
  process.cwd().startsWith("/var/task");

const STORAGE_DIR = isServerless
  ? path.join(os.tmpdir(), "ubuntu_storage")
  : path.join(process.cwd(), "src", "data", "storage");

const SEED_STORAGE_DIR = path.join(process.cwd(), "src", "data", "storage");

const STUDENTS_FILE = path.join(STORAGE_DIR, "students.json");
const QUOTES_FILE = path.join(STORAGE_DIR, "quotes.json");
const ADMINS_FILE = path.join(STORAGE_DIR, "admins.json");

const SEED_STUDENTS_FILE = path.join(SEED_STORAGE_DIR, "students.json");
const SEED_QUOTES_FILE = path.join(SEED_STORAGE_DIR, "quotes.json");
const SEED_ADMINS_FILE = path.join(SEED_STORAGE_DIR, "admins.json");

// Sunucusuz fonksiyonlar arasında bellekte canlı tutulan küresel önbellek (Memory Cache)
declare global {
  var __UBUNTU_STUDENTS__: StudentRecord[] | undefined;
  var __UBUNTU_QUOTES__: QuoteRecord[] | undefined;
  var __UBUNTU_ADMINS__: AdminUserRecord[] | undefined;
}

const DEFAULT_ADMIN: AdminUserRecord = {
  id: "admin_super_1",
  username: "admin",
  passwordHash: "ubuntu2026",
  fullName: "Sistem Yöneticisi",
  email: "admin@ubuntunetwork.com.tr",
  role: "super_admin",
  permissions: {
    canApproveStudents: true,
    canViewBudgets: true,
    canManageQuotes: true,
    canManageAdmins: true,
  },
  status: "active",
  createdAt: new Date().toISOString(),
};

async function ensureStorage() {
  try {
    await fs.mkdir(STORAGE_DIR, { recursive: true });
  } catch (err) {
    // Salt-okunur uyarısı alınırsa çökmeden devam et
  }

  // 1. ÖĞRENCİLER
  if (!globalThis.__UBUNTU_STUDENTS__) {
    try {
      const data = await fs.readFile(STUDENTS_FILE, "utf-8");
      globalThis.__UBUNTU_STUDENTS__ = JSON.parse(data);
    } catch {
      try {
        const seedData = await fs.readFile(SEED_STUDENTS_FILE, "utf-8");
        globalThis.__UBUNTU_STUDENTS__ = JSON.parse(seedData);
      } catch {
        globalThis.__UBUNTU_STUDENTS__ = [];
      }
      try {
        await fs.writeFile(STUDENTS_FILE, JSON.stringify(globalThis.__UBUNTU_STUDENTS__, null, 2), "utf-8");
      } catch (e) {
        // Dosya yazılamasa bile bellekte tutulmaya devam eder
      }
    }
  }

  // 2. TALEPLER / İŞVEREN ANLAŞMALARI
  if (!globalThis.__UBUNTU_QUOTES__) {
    try {
      const data = await fs.readFile(QUOTES_FILE, "utf-8");
      globalThis.__UBUNTU_QUOTES__ = JSON.parse(data);
    } catch {
      try {
        const seedData = await fs.readFile(SEED_QUOTES_FILE, "utf-8");
        globalThis.__UBUNTU_QUOTES__ = JSON.parse(seedData);
      } catch {
        globalThis.__UBUNTU_QUOTES__ = [];
      }
      try {
        await fs.writeFile(QUOTES_FILE, JSON.stringify(globalThis.__UBUNTU_QUOTES__, null, 2), "utf-8");
      } catch (e) {}
    }
  }

  // 3. YÖNETİCİLER
  if (!globalThis.__UBUNTU_ADMINS__) {
    try {
      const data = await fs.readFile(ADMINS_FILE, "utf-8");
      const list = JSON.parse(data);
      globalThis.__UBUNTU_ADMINS__ = list.length > 0 ? list : [DEFAULT_ADMIN];
    } catch {
      try {
        const seedData = await fs.readFile(SEED_ADMINS_FILE, "utf-8");
        const list = JSON.parse(seedData);
        globalThis.__UBUNTU_ADMINS__ = list.length > 0 ? list : [DEFAULT_ADMIN];
      } catch {
        globalThis.__UBUNTU_ADMINS__ = [DEFAULT_ADMIN];
      }
      try {
        await fs.writeFile(ADMINS_FILE, JSON.stringify(globalThis.__UBUNTU_ADMINS__, null, 2), "utf-8");
      } catch (e) {}
    }
  }
}

// STUDENTS OPERATIONS
export async function getStudents(): Promise<StudentRecord[]> {
  await ensureStorage();
  if (globalThis.__UBUNTU_STUDENTS__) {
    return [...globalThis.__UBUNTU_STUDENTS__];
  }
  return [];
}

export async function saveStudents(students: StudentRecord[]): Promise<void> {
  globalThis.__UBUNTU_STUDENTS__ = [...students];
  try {
    await fs.mkdir(STORAGE_DIR, { recursive: true });
    await fs.writeFile(STUDENTS_FILE, JSON.stringify(students, null, 2), "utf-8");
  } catch (err) {
    console.warn("Storage write fallback to memory:", err);
  }
}

function slugify(text: string): string {
  const trMap: { [key: string]: string } = {
    ç: "c", Ç: "c", ğ: "g", Ğ: "g", ı: "i", İ: "i", ö: "o", Ö: "o", ş: "s", Ş: "s", ü: "u", Ü: "u"
  };
  return text
    .split("")
    .map(c => trMap[c] || c)
    .join("")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

export async function createStudent(student: Omit<StudentRecord, "id" | "createdAt" | "status" | "rating" | "fullName">): Promise<StudentRecord> {
  const students = await getStudents();
  const id = `std_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const fullName = `${student.name.trim()} ${student.surname.trim()}`;
  
  const newStudent: StudentRecord = {
    ...student,
    id,
    fullName,
    status: "Bekliyor",
    rating: 5.0,
    createdAt: new Date().toISOString(),
  };

  students.unshift(newStudent);
  await saveStudents(students);
  return newStudent;
}

export async function updateStudent(
  id: string, 
  updates: Partial<StudentRecord>, 
  fallbackStudent?: StudentRecord
): Promise<StudentRecord | null> {
  const students = await getStudents();
  const cleanId = decodeURIComponent(String(id || "")).trim();
  
  let index = students.findIndex((s) => String(s.id).trim() === cleanId || s.id === id);

  if (index === -1 && fallbackStudent) {
    if (fallbackStudent.email) {
      index = students.findIndex((s) => (s.email || "").toLowerCase() === fallbackStudent.email.toLowerCase());
    }
  }

  if (index === -1 && fallbackStudent) {
    const restored: StudentRecord = {
      ...fallbackStudent,
      id: cleanId || fallbackStudent.id,
      fullName: fallbackStudent.fullName || `${fallbackStudent.name || ""} ${fallbackStudent.surname || ""}`.trim(),
    };
    students.unshift(restored);
    index = 0;
  }

  if (index === -1) return null;

  students[index] = { ...students[index], ...updates };
  await saveStudents(students);
  return students[index];
}

export async function approveStudentWithCredentials(
  id: string,
  fallbackStudent?: StudentRecord
): Promise<{ 
  student: StudentRecord; 
  generatedCredentials: { 
    username: string; 
    password: string; 
    emailText: string; 
    emailContent: {
      to: string;
      subject: string;
      body: string;
    };
  } 
} | null> {
  const students = await getStudents();
  const cleanId = decodeURIComponent(String(id || "")).trim();
  
  let index = students.findIndex((s) => String(s.id).trim() === cleanId || s.id === id);

  // Eğer mevcut lambda container'ında ID ile bulunamazsa, e-posta veya fallback nesnesiyle kurtar
  if (index === -1 && fallbackStudent) {
    if (fallbackStudent.email) {
      index = students.findIndex((s) => (s.email || "").toLowerCase() === fallbackStudent.email.toLowerCase());
    }
  }

  if (index === -1 && fallbackStudent) {
    const restored: StudentRecord = {
      ...fallbackStudent,
      id: cleanId || fallbackStudent.id,
      fullName: fallbackStudent.fullName || `${fallbackStudent.name || ""} ${fallbackStudent.surname || ""}`.trim(),
    };
    students.unshift(restored);
    index = 0;
  }

  if (index === -1) return null;

  const current = students[index];
  
  // Kullanıcı adı oluştur (örn: elif.yilmaz veya ali.demir24)
  const cleanName = slugify(current.name || "ogrenci");
  const cleanSurname = slugify(current.surname || "aday");
  const randSuffix = Math.floor(100 + Math.random() * 900);
  const username = current.studentUsername || `${cleanName}.${cleanSurname}${randSuffix}`;
  
  // Güvenli rastgele şifre oluştur (örn: Ubn#4921)
  const password = current.studentPassword || `Ubn#${Math.floor(1000 + Math.random() * 9000)}`;

  const welcomeEmailText = `
Sayın ${current.fullName},

Tebrik ederiz! Ubuntu Network yetenek ağına yapmış olduğunuz başvurunuz incelenmiş olup platformumuza kabul edilmiş bulunmaktasınız.

Profiliniz artık "Ubuntu Network Premium Vitrin" üzerinde kurumsal işverenlere ve prestijli projelere sergilenmektedir.

Size özel oluşturulan Öğrenci Paneli giriş bilgileriniz:
--------------------------------------------------
🔗 Giriş Adresi: https://www.ubuntunetwork.com.tr/giris
👤 Kullanıcı Adı: ${username} (veya kayıtlı e-postanız)
🔑 Geçici Parola: ${password}
--------------------------------------------------

Giriş yaptıktan sonra "Hesap Ayarları" bölümünden parolanızı değiştirebilir, gelen proje eşleştirmelerinizi ve anlaşmalarınızı takip edebilirsiniz.

Ubuntu Network Ailesine Hoş Geldiniz!
https://www.ubuntunetwork.com.tr
`.trim();

  students[index] = {
    ...current,
    status: "Onaylandı",
    studentUsername: username,
    studentPassword: password,
    welcomeEmailSentAt: new Date().toISOString(),
  };

  await saveStudents(students);

  return {
    student: students[index],
    generatedCredentials: {
      username,
      password,
      emailText: welcomeEmailText,
      emailContent: {
        to: current.email || "",
        subject: "Ubuntu Network - Başvurunuz Onaylandı! Giriş Bilgileriniz",
        body: welcomeEmailText,
      },
    },
  };
}

export async function findStudentByAuth(usernameOrEmail: string, password: string): Promise<StudentRecord | null> {
  const students = await getStudents();
  const cleanQuery = usernameOrEmail.trim().toLowerCase();
  
  const student = students.find((s) => {
    const matchUsername = (s.studentUsername || "").toLowerCase() === cleanQuery;
    const matchEmail = (s.email || "").toLowerCase() === cleanQuery;
    return (matchUsername || matchEmail) && s.studentPassword === password;
  });

  return student || null;
}

export async function deleteStudent(id: string): Promise<boolean> {
  const students = await getStudents();
  const filtered = students.filter((s) => s.id !== id);
  if (filtered.length === students.length) return false;
  await saveStudents(filtered);
  return true;
}

// QUOTES OPERATIONS
export async function getQuotes(): Promise<QuoteRecord[]> {
  await ensureStorage();
  if (globalThis.__UBUNTU_QUOTES__) {
    return [...globalThis.__UBUNTU_QUOTES__];
  }
  return [];
}

export async function saveQuotes(quotes: QuoteRecord[]): Promise<void> {
  globalThis.__UBUNTU_QUOTES__ = [...quotes];
  try {
    await fs.mkdir(STORAGE_DIR, { recursive: true });
    await fs.writeFile(QUOTES_FILE, JSON.stringify(quotes, null, 2), "utf-8");
  } catch (err) {
    console.warn("Storage write fallback to memory:", err);
  }
}

export async function getStudentDeals(studentId: string, studentName?: string): Promise<QuoteRecord[]> {
  const quotes = await getQuotes();
  return quotes.filter(
    (q) => q.studentId === studentId || (studentName && q.studentName.toLowerCase().includes(studentName.toLowerCase()))
  );
}

export async function createQuote(quote: Omit<QuoteRecord, "id" | "createdAt" | "status">): Promise<QuoteRecord> {
  const quotes = await getQuotes();
  const id = `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  
  const newQuote: QuoteRecord = {
    ...quote,
    id,
    status: "Yeni",
    createdAt: new Date().toISOString(),
  };

  quotes.unshift(newQuote);
  await saveQuotes(quotes);
  return newQuote;
}

export async function updateQuote(id: string, updates: Partial<QuoteRecord>): Promise<QuoteRecord | null> {
  const quotes = await getQuotes();
  const index = quotes.findIndex((q) => q.id === id);
  if (index === -1) return null;

  quotes[index] = { ...quotes[index], ...updates };
  await saveQuotes(quotes);
  return quotes[index];
}

export async function deleteQuote(id: string): Promise<boolean> {
  const quotes = await getQuotes();
  const filtered = quotes.filter((q) => q.id !== id);
  if (filtered.length === quotes.length) return false;
  await saveQuotes(filtered);
  return true;
}

// ADMIN USERS OPERATIONS
export async function getAdminUsers(): Promise<AdminUserRecord[]> {
  await ensureStorage();
  if (globalThis.__UBUNTU_ADMINS__ && globalThis.__UBUNTU_ADMINS__.length > 0) {
    return [...globalThis.__UBUNTU_ADMINS__];
  }
  return [DEFAULT_ADMIN];
}

export async function saveAdminUsers(admins: AdminUserRecord[]): Promise<void> {
  globalThis.__UBUNTU_ADMINS__ = [...admins];
  try {
    await fs.mkdir(STORAGE_DIR, { recursive: true });
    await fs.writeFile(ADMINS_FILE, JSON.stringify(admins, null, 2), "utf-8");
  } catch (err) {
    console.warn("Storage write fallback to memory:", err);
  }
}

export async function findAdminByCredentials(username: string, password: string): Promise<AdminUserRecord | null> {
  const admins = await getAdminUsers();
  const user = admins.find(
    (a) => a.username.toLowerCase() === username.trim().toLowerCase() && a.passwordHash === password
  );
  if (!user || user.status === "inactive") return null;

  user.lastLogin = new Date().toISOString();
  await saveAdminUsers(admins);
  return user;
}

export async function createAdminUser(
  user: Omit<AdminUserRecord, "id" | "createdAt" | "lastLogin">
): Promise<AdminUserRecord> {
  const admins = await getAdminUsers();
  if (admins.some((a) => a.username.toLowerCase() === user.username.trim().toLowerCase())) {
    throw new Error("Bu kullanıcı adı zaten kullanılıyor.");
  }

  const id = `adm_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const newAdmin: AdminUserRecord = {
    ...user,
    id,
    createdAt: new Date().toISOString(),
  };

  admins.push(newAdmin);
  await saveAdminUsers(admins);
  return newAdmin;
}

export async function updateAdminUser(id: string, updates: Partial<AdminUserRecord>): Promise<AdminUserRecord | null> {
  const admins = await getAdminUsers();
  const index = admins.findIndex((a) => a.id === id);
  if (index === -1) return null;

  admins[index] = { ...admins[index], ...updates };
  await saveAdminUsers(admins);
  return admins[index];
}

export async function deleteAdminUser(id: string): Promise<boolean> {
  const admins = await getAdminUsers();
  if (admins.length <= 1) {
    throw new Error("Sistemdeki tek yönetici silinemez.");
  }
  const filtered = admins.filter((a) => a.id !== id);
  if (filtered.length === admins.length) return false;
  await saveAdminUsers(filtered);
  return true;
}
