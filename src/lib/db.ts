import fs from "fs/promises";
import path from "path";

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

const STORAGE_DIR = path.join(process.cwd(), "src", "data", "storage");
const STUDENTS_FILE = path.join(STORAGE_DIR, "students.json");
const QUOTES_FILE = path.join(STORAGE_DIR, "quotes.json");
const ADMINS_FILE = path.join(STORAGE_DIR, "admins.json");

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
    try {
      await fs.access(STUDENTS_FILE);
    } catch {
      await fs.writeFile(STUDENTS_FILE, JSON.stringify([], null, 2), "utf-8");
    }
    try {
      await fs.access(QUOTES_FILE);
    } catch {
      await fs.writeFile(QUOTES_FILE, JSON.stringify([], null, 2), "utf-8");
    }
    try {
      await fs.access(ADMINS_FILE);
    } catch {
      await fs.writeFile(ADMINS_FILE, JSON.stringify([DEFAULT_ADMIN], null, 2), "utf-8");
    }
  } catch (err) {
    console.error("Storage initialization error:", err);
  }
}

// STUDENTS OPERATIONS
export async function getStudents(): Promise<StudentRecord[]> {
  await ensureStorage();
  try {
    const data = await fs.readFile(STUDENTS_FILE, "utf-8");
    return JSON.parse(data) || [];
  } catch (err) {
    console.error("Error reading students:", err);
    return [];
  }
}

export async function saveStudents(students: StudentRecord[]): Promise<void> {
  await ensureStorage();
  await fs.writeFile(STUDENTS_FILE, JSON.stringify(students, null, 2), "utf-8");
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

export async function updateStudent(id: string, updates: Partial<StudentRecord>): Promise<StudentRecord | null> {
  const students = await getStudents();
  const index = students.findIndex((s) => s.id === id);
  if (index === -1) return null;

  students[index] = { ...students[index], ...updates };
  await saveStudents(students);
  return students[index];
}

export async function approveStudentWithCredentials(id: string): Promise<{ student: StudentRecord; generatedCredentials: { username: string; password: string; emailText: string } } | null> {
  const students = await getStudents();
  const index = students.findIndex((s) => s.id === id);
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
  try {
    const data = await fs.readFile(QUOTES_FILE, "utf-8");
    return JSON.parse(data) || [];
  } catch (err) {
    console.error("Error reading quotes:", err);
    return [];
  }
}

export async function saveQuotes(quotes: QuoteRecord[]): Promise<void> {
  await ensureStorage();
  await fs.writeFile(QUOTES_FILE, JSON.stringify(quotes, null, 2), "utf-8");
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
  try {
    const data = await fs.readFile(ADMINS_FILE, "utf-8");
    const list = JSON.parse(data) || [];
    if (list.length === 0) {
      await fs.writeFile(ADMINS_FILE, JSON.stringify([DEFAULT_ADMIN], null, 2), "utf-8");
      return [DEFAULT_ADMIN];
    }
    return list;
  } catch (err) {
    console.error("Error reading admin users:", err);
    return [DEFAULT_ADMIN];
  }
}

export async function saveAdminUsers(admins: AdminUserRecord[]): Promise<void> {
  await ensureStorage();
  await fs.writeFile(ADMINS_FILE, JSON.stringify(admins, null, 2), "utf-8");
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
