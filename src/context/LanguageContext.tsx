"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "tr" | "en" | "fr" | "es" | "ar" | "sw";

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: "tr", name: "Türkçe", nativeName: "Türkçe", flag: "🇹🇷" },
  { code: "en", name: "İngilizce", nativeName: "English", flag: "🇬🇧" },
  { code: "fr", name: "Fransızca", nativeName: "Français", flag: "🇫🇷" },
  { code: "es", name: "İspanyolca", nativeName: "Español", flag: "🇪🇸" },
  { code: "ar", name: "Arapça", nativeName: "العربية", flag: "🇸🇦" },
  { code: "sw", name: "Afrika Dili (Swahili)", nativeName: "Kiswahili", flag: "🌍" },
];

export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  tr: {
    nav_how_it_works: "Nasıl Çalışır?",
    nav_vitrin: "Vitrin",
    nav_about: "Hakkımızda",
    nav_register: "Öğrenci Kayıt",
    nav_login: "Giriş Yap",
    hero_badge: "ÖĞRENCİLER İÇİN UBUNTU NETWORK",
    hero_title: "Kariyerini Bugünden İnşa Etmeye Başla",
    hero_desc: "Sadece bir özgeçmiş değil, senin vitrinin. Yeteneklerini ve bildiğin dilleri kurumsal şirketlere göster, doğru projelerle eşleş ve gelir kazanmaya başla.",
    hero_cta_register: "Premium Vitrin'e Katıl",
    hero_cta_explore: "Platformu İncele",
    stat_unis: "Üniversite Ağı",
    stat_verified: "Onaylı Profiller",
    stat_support: "Kurumsal İletişim",
    about_hero_title: "Biz Kimiz?",
    about_hero_desc: "Biz, sınırları aşan bir vizyonla bir araya gelmiş genç liderler, öğrenciler ve üreticileriz. Farklı coğrafyalardan gelen zenginliğimizi birleştirerek sadece bir araya gelen bir topluluk değil; ortak değerler inşa eden ve geleceğe yön veren aktif bir hareketiz.",
    founder_title: "Kurucumuz",
    founder_role: "Ubuntu Network Kurucusu & Uluslararası İlişkiler Koordinatörü",
  },
  en: {
    nav_how_it_works: "How It Works",
    nav_vitrin: "Showcase",
    nav_about: "About Us",
    nav_register: "Student Registration",
    nav_login: "Login",
    hero_badge: "UBUNTU NETWORK FOR STUDENTS",
    hero_title: "Start Building Your Global Career Today",
    hero_desc: "Not just a resume, but your elite showcase. Present your talents and languages to leading companies, match with ideal projects, and start earning.",
    hero_cta_register: "Join the Premium Showcase",
    hero_cta_explore: "Explore Platform",
    stat_unis: "University Network",
    stat_verified: "Verified Profiles",
    stat_support: "Corporate Support",
    about_hero_title: "Who We Are",
    about_hero_desc: "We are young leaders, students, and creators united by a vision that transcends boundaries. By combining our diverse geographical heritage, we are not merely a community that convenes; we are an active movement building shared values and shaping the future.",
    founder_title: "Our Founder",
    founder_role: "Founder of Ubuntu Network & International Relations Coordinator",
  },
  fr: {
    nav_how_it_works: "Comment ça marche",
    nav_vitrin: "Vitrine",
    nav_about: "À Propos",
    nav_register: "Inscription Étudiant",
    nav_login: "Connexion",
    hero_badge: "UBUNTU NETWORK POUR ÉTUDIANTS",
    hero_title: "Construisez votre carrière dès aujourd'hui",
    hero_desc: "Pas seulement un CV, mais votre vitrine d'élite. Présentez vos compétences et vos langues aux entreprises prestigieuses et participez à des projets d'envergure.",
    hero_cta_register: "Rejoindre la Vitrine",
    hero_cta_explore: "Découvrir la plateforme",
    stat_unis: "Réseau Universitaire",
    stat_verified: "Profils Vérifiés",
    stat_support: "Communication Dédiée",
    about_hero_title: "Qui Sommes-Nous ?",
    about_hero_desc: "Nous sommes de jeunes leaders, étudiants et créateurs unis par une vision qui dépasse les frontières. En unissant la richesse de nos horizons divers, nous ne sommes pas simplement une communauté réunie ; nous sommes un mouvement actif qui bâtit des valeurs partagées et façonne l'avenir.",
    founder_title: "Notre Fondateur",
    founder_role: "Fondateur d'Ubuntu Network & Coordinateur des Relations Internationales",
  },
  es: {
    nav_how_it_works: "Cómo Funciona",
    nav_vitrin: "Escaparate",
    nav_about: "Sobre Nosotros",
    nav_register: "Registro de Estudiantes",
    nav_login: "Iniciar Sesión",
    hero_badge: "UBUNTU NETWORK PARA ESTUDIANTES",
    hero_title: "Comienza a construir tu carrera hoy",
    hero_desc: "No es solo un currículum, es tu escaparate de élite. Muestra tus talentos e idiomas a empresas líderes, conéctate con proyectos y genera ingresos.",
    hero_cta_register: "Únete al Escaparate",
    hero_cta_explore: "Explorar Plataforma",
    stat_unis: "Red Universitaria",
    stat_verified: "Perfiles Verificados",
    stat_support: "Soporte Corporativo",
    about_hero_title: "¿Quiénes Somos?",
    about_hero_desc: "Somos jóvenes líderes, estudiantes y creadores unidos por una visión que trasciende fronteras. Al combinar la riqueza de nuestros diversos orígenes, no somos solo una comunidad reunida; somos un movimiento activo que construye valores compartidos y lidera el futuro.",
    founder_title: "Nuestro Fundador",
    founder_role: "Fundador de Ubuntu Network y Coordinador de Relaciones Internacionales",
  },
  ar: {
    nav_how_it_works: "كيف يعمل؟",
    nav_vitrin: "معرض المواهب",
    nav_about: "من نحن",
    nav_register: "تسجيل الطلاب",
    nav_login: "تسجيل الدخول",
    hero_badge: "شبكة أوبونتو للطلاب",
    hero_title: "ابدأ في بناء مسيرتك المهنية اليوم",
    hero_desc: "ليست مجرد سيرة ذاتية، بل هي واجهتك المتميزة. أظهر مواهبك واللغات التي تتقنها للشركات العالمية وابدأ في كسب الدخل من مشاريع نوعية.",
    hero_cta_register: "انضم للمعرض المتميز",
    hero_cta_explore: "استكشف المنصة",
    stat_unis: "شبكة الجامعات",
    stat_verified: "ملفات معتمدة",
    stat_support: "دعم مؤسسي متواصل",
    about_hero_title: "من نحن؟",
    about_hero_desc: "نحن قادة شباب، طلاب وصناع تغيير جمعتنا رؤية تتجاوز الحدود الجغرافية. ومن خلال دمج تنوعنا الثقافي، لا نعتبر أنفسنا مجرد مجتمع يلتقي؛ بل حركة فاعلة تبني قيمًا مشتركة وتصنع المستقبل.",
    founder_title: "مؤسس الشبكة",
    founder_role: "مؤسس شبكة أوبونتو ومنسق العلاقات الدولية",
  },
  sw: {
    nav_how_it_works: "Jinsi Inavyofanya Kazi",
    nav_vitrin: "Uwanja wa Vipaji",
    nav_about: "Kuhusu Sisi",
    nav_register: "Usajili wa Wanafunzi",
    nav_login: "Ingia",
    hero_badge: "UBUNTU NETWORK KWA WANAFUNZI",
    hero_title: "Anza Kujenga Ajira Yako Leo",
    hero_desc: "Sio wasifu tu, bali ni jukwaa lako maalum. Onyesha vipaji na lugha zako kwa makampuni mashuhuri na uanze kushiriki kwenye miradi yenye thamani.",
    hero_cta_register: "Jiunge na Vitrin",
    hero_cta_explore: "Chunguza Mfumo",
    stat_unis: "Mtandao wa Vyuo Vikuu",
    stat_verified: "Wasifu Uliothibitishwa",
    stat_support: "Mawasiliano ya Kibiashara",
    about_hero_title: "Sisi Ni Nani?",
    about_hero_desc: "Sisi ni viongozi vijana, wanafunzi na wabunifu tuliounganishwa na maono yanayovuka mipaka. Kwa kuunganisha utajiri wa asili zetu tofauti, sisi si jamii inayokutana tu; ni vuguvugu linalojenga maadili ya pamoja na kuongoza siku zijazo.",
    founder_title: "Mwanzilishi Wetu",
    founder_role: "Mwanzilishi wa Ubuntu Network & Mratibu wa Uhusiano wa Kimataifa",
  },
};

interface LanguageContextType {
  currentLang: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRtl: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  currentLang: "tr",
  setLanguage: () => {},
  t: (key: string) => key,
  isRtl: false,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLang, setCurrentLang] = useState<Language>("tr");

  useEffect(() => {
    const saved = localStorage.getItem("ubuntu_lang") as Language;
    if (saved && TRANSLATIONS[saved]) {
      setCurrentLang(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setCurrentLang(lang);
    localStorage.setItem("ubuntu_lang", lang);
    if (lang === "ar") {
      document.documentElement.dir = "rtl";
    } else {
      document.documentElement.dir = "ltr";
    }
  };

  const t = (key: string): string => {
    return TRANSLATIONS[currentLang]?.[key] || TRANSLATIONS["tr"]?.[key] || key;
  };

  const isRtl = currentLang === "ar";

  return (
    <LanguageContext.Provider value={{ currentLang, setLanguage, t, isRtl }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
