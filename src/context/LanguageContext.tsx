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
    // Nav & Genel
    nav_how_it_works: "Nasıl Çalışır?",
    nav_vitrin: "Vitrin",
    nav_about: "Hakkımızda",
    nav_register: "Öğrenci Kayıt",
    nav_login: "Giriş Yap",
    footer_slogan: "BAĞLANTI • FIRSAT • GELECEK",
    footer_rights: "Ubuntu Network. Tüm hakları saklıdır.",

    // Hero Slider
    slide1_badge: "İŞVERENLER İÇİN",
    slide1_title: "Türkiye'nin En Yetenekli Üniversite Öğrencileri",
    slide1_subtitle: "Yabancı dil bilen, vizyoner ve alanında uzmanlaşmış genç yetenekleri premium vitrinimizde keşfedin. Projeleriniz için en doğru adayı bulun ve hemen teklif isteyin.",
    slide1_btn_primary: "Yetenekleri Keşfet",
    slide1_btn_secondary: "Nasıl Çalışır?",

    slide2_badge: "ÖĞRENCİLER İÇİN",
    slide2_title: "Kariyerini Bugünden İnşa Etmeye Başla",
    slide2_subtitle: "Sadece bir özgeçmiş değil, senin vitrinin. Yeteneklerini ve bildiğin dilleri kurumsal şirketlere göster, doğru projelerle eşleş ve geleceğini şekillendir.",
    slide2_btn_primary: "Premium Vitrin'e Katıl",
    slide2_btn_secondary: "Platformu İncele",

    slide3_badge: "GÜVENLİ & KURUMSAL",
    slide3_title: "Bağlantı • Fırsat • Gelecek",
    slide3_subtitle: "Ubuntu Network, işverenler ile öğrenciler arasındaki köprüdür. İletişim bilgileri gizli tutulur, süreç profesyonel yöneticilerimiz tarafından güvenle yönetilir.",
    slide3_btn_primary: "Sistemi İncele",
    slide3_btn_secondary: "Öğrenci Kayıt",

    // Kategoriler
    cat_title: "Hangi alanda yeteneğe ihtiyacınız var?",
    cat_it_name: "Yazılım & IT",
    cat_it_desc: "Geliştiriciler, Analistler",
    cat_design_name: "Tasarım & Kreatif",
    cat_design_desc: "UI/UX, Grafik, Video",
    cat_lang_name: "Çeviri & Dil",
    cat_lang_desc: "Çok dilli öğrenciler",
    cat_marketing_name: "Pazarlama & İş",
    cat_marketing_desc: "Dijital pazarlama, SEO",

    // Nasıl Çalışır
    how_badge: "SİSTEM NASIL İŞLİYOR?",
    how_title: "Kurumsal, Şeffaf ve Güvenli",
    how_desc: "İletişim bilgisi karmaşası yok, doğrudan pazarlık stresi yok. Süreci sizin için profesyonelce yönetiyoruz.",
    how_step1_title: "1. Filtrele & Keşfet",
    how_step1_desc: "Platformumuzda ihtiyacınız olan departman, yabancı dil ve yeteneklere göre arama yapın.",
    how_step2_title: "2. Talep Oluştur",
    how_step2_desc: "Uygun bulduğunuz öğrenci için 'Teklif İste' formunu doldurun. Talebiniz doğrudan yöneticimize ulaşsın.",
    how_step3_title: "3. Güvenle Çalış",
    how_step3_desc: "Yöneticimiz süreci onaylar, bütçeyi netleştirir ve profesyonel işbirliğinizi başlatır.",

    // CTA
    cta_emp_badge: "İŞVERENLER",
    cta_emp_title: "Ekibinize Taze Kan Katın",
    cta_emp_desc: "Projeniz için dil bilen, modern teknolojilere hakim ve enerjik bir ekip arkadaşı mı arıyorsunuz?",
    cta_emp_btn: "Vitrini Keşfet",
    cta_stu_badge: "ÖĞRENCİLER",
    cta_stu_title: "Vitrininde Yerini Al",
    cta_stu_desc: "Yeteneklerini doğru kurumlarla buluştur. Ücretsiz kayıt ol, onay sürecinden geç ve seçkin projelere dahil ol.",
    cta_stu_btn: "Hemen Başvur",

    // Vitrin
    vitrin_badge: "UBUNTU PREMİUM VİTRİN",
    vitrin_title: "Öne Çıkan Üniversite Yetenekleri",
    vitrin_desc: "Yetenekleri, bildikleri dilleri ve akademik başarılarıyla onaylanmış geleceğin liderleri.",
    vitrin_tab_all: "Tümü",
    vitrin_filter_btn: "Gelişmiş Filtreleme",
    vitrin_request_quote: "Teklif İste",
    vitrin_details: "Profili İncele",
    vitrin_verified: "Onaylı Profil",
    vitrin_modal_title: "İş Teklifi & Talep Formu",
    vitrin_modal_desc: "Öğrenciyle doğrudan iletişime geçmek ve bütçe teklifi sunmak için formu doldurun.",
    vitrin_modal_company: "Şirket Adı",
    vitrin_modal_contact: "Yetkili Adı Soyadı",
    vitrin_modal_phone: "Telefon Numarası",
    vitrin_modal_budget: "Teklif Bütçesi (₺)",
    vitrin_modal_desc_label: "Proje veya Görev Detayları",
    vitrin_modal_submit: "Talebi Gönder",
    vitrin_modal_success: "Talebiniz Başarıyla Alındı!",
    vitrin_modal_success_desc: "Yöneticilerimiz en kısa sürede sizinle iletişime geçecektir.",

    // Hakkımızda
    about_hero_badge: "KÜRESEL VİZYON & ORTAK DEĞERLER",
    about_hero_title: "Geleceği İnşa Eden Sınırları Aşan Bir Hareketiz",
    about_hero_desc: "Biz, sınırları aşan bir vizyonla bir araya gelmiş genç liderler, öğrenciler ve üreticileriz. Farklı coğrafyalardan gelen zenginliğimizi birleştirerek sadece bir araya gelen bir topluluk değil; ortak değerler inşa eden ve geleceğe yön veren aktif bir hareketiz.",
    about_philosophy_badge: "UBUNTU FELSEFESİ",
    about_philosophy_title: "“Ben, Biz Olduğumuz İçin Varım”",
    about_philosophy_desc: "Ubuntu Network; Afrika'nın kadim dayanışma felsefesini modern dünya standartları, küresel diplomasi ve B2B iş dünyasıyla birleştirir.",
    about_card1_title: "Kıtalararası Köprü",
    about_card1_desc: "Türkiye ve dünya üniversitelerinde yetişen çok dilli, vizyoner yetenekleri kurumsal iş dünyası ve uluslararası ticaretle doğrudan buluşturuyoruz.",
    about_card2_title: "Liyakat ve Güven",
    about_card2_desc: "Platformdaki her aday E-Devlet belgeleri, dil yeterlilikleri ve akademik başarılarıyla bizzat teyit edilir. Süreç profesyonelce yönetilir.",
    about_card3_title: "Ortak Büyüme",
    about_card3_desc: "Sadece bir eşleştirme platformu değil; gençlerin diplomasi, B2B ticaret ve networking alanlarında aktif liderlere dönüştüğü sürdürülebilir bir ekosistemiz.",
    founder_section_badge: "LİDERLİK & VİZYON",
    founder_section_title: "Kurucumuz ile Tanışın",
    founder_name: "Muhammed Mansour Say",
    founder_role: "Ubuntu Network Kurucusu & Uluslararası İlişkiler ve B2B Koordinatörü",
    founder_bio_1: "Ubuntu Network’ün kurucusuyum. Aslen Senegalliyim ve Bursa Uludağ Üniversitesi İlahiyat Fakültesi mezunuyum.",
    founder_bio_2: "Sivil toplum çalışmalarında aktif rol alarak Bursa Afrika Öğrencileri Topluluğu’nda başkanlık yürüttüm. Genç Diplomat programları ve Bursa Tanıtma Birliği iş birliğiyle gerçekleştirilen B2B projelerinde yer aldım. İngilizce, Arapça, Fransızca ve Türkçe olmak üzere dört dili ileri düzeyde biliyorum.",
    founder_bio_3: "Akademik altyapımı uluslararası ticaret, saha tecrübeleri ve geniş iletişim ağımla birleştirerek, gençlerin uyum, gelişim ve networking süreçlerine öncülük ediyorum.",
    founder_langs_title: "İleri Düzeyde Bildiği Diller:",
    founder_badge_c2: "İleri Düzey (C2)",
    founder_cred_uni: "Bursa Uludağ Üniv. İlahiyat Fakültesi Mezunu",
    founder_cred_pres: "Bursa Afrika Öğrencileri Topluluğu Eski Bşk.",
  },

  en: {
    // Nav & General
    nav_how_it_works: "How It Works",
    nav_vitrin: "Showcase",
    nav_about: "About Us",
    nav_register: "Student Registration",
    nav_login: "Login",
    footer_slogan: "CONNECTION • OPPORTUNITY • FUTURE",
    footer_rights: "Ubuntu Network. All rights reserved.",

    // Hero Slider
    slide1_badge: "FOR EMPLOYERS",
    slide1_title: "Turkey's Most Talented University Students",
    slide1_subtitle: "Discover multilingual, visionary, and specialized young talents in our premium showcase. Find the ideal candidate for your projects and request a quote immediately.",
    slide1_btn_primary: "Explore Talents",
    slide1_btn_secondary: "How It Works",

    slide2_badge: "FOR STUDENTS",
    slide2_title: "Start Building Your Career Today",
    slide2_subtitle: "Not just a resume, but your elite showcase. Present your talents and languages to global corporations, match with ideal projects, and shape your future.",
    slide2_btn_primary: "Join Premium Showcase",
    slide2_btn_secondary: "Explore Platform",

    slide3_badge: "SECURE & CORPORATE",
    slide3_title: "Connection • Opportunity • Future",
    slide3_subtitle: "Ubuntu Network bridges the gap between employers and students. Contact details remain confidential, managed safely by our professional team.",
    slide3_btn_primary: "Review the System",
    slide3_btn_secondary: "Student Registration",

    // Categories
    cat_title: "Which field of talent do you need?",
    cat_it_name: "Software & IT",
    cat_it_desc: "Developers, Analysts",
    cat_design_name: "Design & Creative",
    cat_design_desc: "UI/UX, Graphics, Video",
    cat_lang_name: "Translation & Languages",
    cat_lang_desc: "Multilingual Students",
    cat_marketing_name: "Marketing & Business",
    cat_marketing_desc: "Digital Marketing, SEO",

    // How it works
    how_badge: "HOW IT WORKS?",
    how_title: "Corporate, Transparent, and Secure",
    how_desc: "No contact chaos, no direct negotiation stress. We manage the process professionally on your behalf.",
    how_step1_title: "1. Filter & Discover",
    how_step1_desc: "Search based on department, foreign language, and skills needed for your projects.",
    how_step2_title: "2. Request a Quote",
    how_step2_desc: "Fill in the 'Request Quote' form for the candidate you choose. Your request reaches our directors directly.",
    how_step3_title: "3. Work with Confidence",
    how_step3_desc: "Our directors approve the workflow, clarify budgets, and initiate your professional collaboration.",

    // CTA
    cta_emp_badge: "EMPLOYERS",
    cta_emp_title: "Add Fresh Talent to Your Team",
    cta_emp_desc: "Are you looking for an energetic, multilingual teammate proficient in modern technologies?",
    cta_emp_btn: "Explore Showcase",
    cta_stu_badge: "STUDENTS",
    cta_stu_title: "Take Your Place in the Showcase",
    cta_stu_desc: "Connect your talents with leading institutions. Register for free, get verified, and take part in prestigious projects.",
    cta_stu_btn: "Apply Now",

    // Vitrin
    vitrin_badge: "UBUNTU PREMIUM SHOWCASE",
    vitrin_title: "Featured University Talents",
    vitrin_desc: "Future leaders verified by their skills, multilingual capabilities, and academic excellence.",
    vitrin_tab_all: "All",
    vitrin_filter_btn: "Advanced Filters",
    vitrin_request_quote: "Request Quote",
    vitrin_details: "View Profile",
    vitrin_verified: "Verified Profile",
    vitrin_modal_title: "Job Offer & Quote Form",
    vitrin_modal_desc: "Submit your details to offer a project and budget proposal to this candidate.",
    vitrin_modal_company: "Company Name",
    vitrin_modal_contact: "Authorized Contact Name",
    vitrin_modal_phone: "Phone Number",
    vitrin_modal_budget: "Proposal Budget (₺)",
    vitrin_modal_desc_label: "Project or Task Details",
    vitrin_modal_submit: "Submit Proposal",
    vitrin_modal_success: "Your Request Was Received!",
    vitrin_modal_success_desc: "Our management team will get in touch with you shortly.",

    // About Page
    about_hero_badge: "GLOBAL VISION & SHARED VALUES",
    about_hero_title: "A Movement Transcending Borders and Building the Future",
    about_hero_desc: "We are young leaders, students, and creators united by a vision that transcends boundaries. By combining our diverse geographical heritage, we are not merely a community that convenes; we are an active movement building shared values and shaping the future.",
    about_philosophy_badge: "UBUNTU PHILOSOPHY",
    about_philosophy_title: "“I am because we are”",
    about_philosophy_desc: "Ubuntu Network combines Africa's ancient philosophy of solidarity with modern world standards, international diplomacy, and B2B global commerce.",
    about_card1_title: "Intercontinental Bridge",
    about_card1_desc: "We connect multilingual, visionary talents emerging from universities across Turkey and the world directly with corporate business and global trade.",
    about_card2_title: "Merit & Trust",
    about_card2_desc: "Every candidate on the platform is personally verified through official government transcripts, language certificates, and academic honors.",
    about_card3_title: "Mutual Growth",
    about_card3_desc: "More than a matching directory; a sustainable ecosystem where youth evolve into active leaders in diplomacy, international trade, and networking.",
    founder_section_badge: "LEADERSHIP & VISION",
    founder_section_title: "Meet Our Founder",
    founder_name: "Muhammed Mansour Say",
    founder_role: "Founder of Ubuntu Network & International Relations & B2B Coordinator",
    founder_bio_1: "I am the founder of Ubuntu Network. Originally from Senegal, I graduated from Bursa Uludağ University Faculty of Theology.",
    founder_bio_2: "Taking active leadership in civil society, I served as the President of the Bursa African Students Community. I participated in B2B projects and Young Diplomat programs in partnership with the Bursa Promotion Association. I speak four languages fluently: English, Arabic, French, and Turkish.",
    founder_bio_3: "Combining my academic foundation with international trade, field experiences, and an extensive global network, I pioneer youth integration, leadership, and networking.",
    founder_langs_title: "Fluent Languages:",
    founder_badge_c2: "Fluent (C2)",
    founder_cred_uni: "Graduate of Bursa Uludağ Univ. Faculty of Theology",
    founder_cred_pres: "Former President of Bursa African Students Community",
  },

  fr: {
    // Nav & General
    nav_how_it_works: "Comment ça marche",
    nav_vitrin: "Vitrine",
    nav_about: "À Propos",
    nav_register: "Inscription Étudiant",
    nav_login: "Connexion",
    footer_slogan: "CONNEXION • OPPORTUNITÉ • AVENIR",
    footer_rights: "Ubuntu Network. Tous droits réservés.",

    // Hero Slider
    slide1_badge: "POUR LES EMPLOYEURS",
    slide1_title: "Les Étudiants Universitaires les Plus Talencieux",
    slide1_subtitle: "Découvrez des jeunes talents multilingues et visionnaires dans notre vitrine premium. Trouvez le candidat idéal pour vos projets et demandez un devis.",
    slide1_btn_primary: "Explorer les Talents",
    slide1_btn_secondary: "Comment ça marche",

    slide2_badge: "POUR LES ÉTUDIANTS",
    slide2_title: "Construisez votre carrière dès aujourd'hui",
    slide2_subtitle: "Pas seulement un CV, mais votre vitrine d'élite. Présentez vos talents et vos langues aux entreprises mondiales et façonnez votre avenir.",
    slide2_btn_primary: "Rejoindre la Vitrine",
    slide2_btn_secondary: "Explorer la plateforme",

    slide3_badge: "SÉCURISÉ & PROFESSIONNEL",
    slide3_title: "Connexion • Opportunité • Avenir",
    slide3_subtitle: "Ubuntu Network est le pont entre employeurs et étudiants. Les coordonnées restent confidentielles et gérées par notre équipe.",
    slide3_btn_primary: "Examiner le Système",
    slide3_btn_secondary: "Inscription Étudiant",

    // Categories
    cat_title: "De quel domaine de talent avez-vous besoin ?",
    cat_it_name: "Logiciel & IT",
    cat_it_desc: "Développeurs, Analystes",
    cat_design_name: "Design & Créatif",
    cat_design_desc: "UI/UX, Graphisme, Vidéo",
    cat_lang_name: "Traduction & Langues",
    cat_lang_desc: "Étudiants multilingues",
    cat_marketing_name: "Marketing & Affaires",
    cat_marketing_desc: "Marketing digital, SEO",

    // How it works
    how_badge: "COMMENT ÇA MARCHE ?",
    how_title: "Professionnel, Transparent et Sécurisé",
    how_desc: "Aucune confusion de contact, aucun stress de négociation directe. Nous gérons le processus pour vous.",
    how_step1_title: "1. Filtrez & Découvrez",
    how_step1_desc: "Recherchez selon le département, la langue étrangère et les compétences requises.",
    how_step2_title: "2. Créez une Demande",
    how_step2_desc: "Remplissez le formulaire 'Demander un Devis'. Votre demande parvient directement à notre direction.",
    how_step3_title: "3. Travaillez en Confiance",
    how_step3_desc: "Notre équipe valide le processus, clarifie le budget et lance votre collaboration professionnelle.",

    // CTA
    cta_emp_badge: "EMPLOYEURS",
    cta_emp_title: "Apportez une Nouvelle Énergie à Votre Équipe",
    cta_emp_desc: "Vous recherchez un collaborateur multilingue, énergique et maîtrisant les technologies modernes ?",
    cta_emp_btn: "Découvrir la Vitrine",
    cta_stu_badge: "ÉTUDIANTS",
    cta_stu_title: "Prenez Place dans la Vitrine",
    cta_stu_desc: "Associez vos talents aux grandes entreprises. Inscrivez-vous gratuitement et participez à des projets d'élite.",
    cta_stu_btn: "Postuler Maintenant",

    // Vitrin
    vitrin_badge: "VITRINE UBUNTU PREMIUM",
    vitrin_title: "Talents Universitaires en Vedette",
    vitrin_desc: "De futurs leaders certifiés par leurs compétences, leurs langues et leur excellence académique.",
    vitrin_tab_all: "Tous",
    vitrin_filter_btn: "Filtres Avancés",
    vitrin_request_quote: "Demander un Devis",
    vitrin_details: "Voir le Profil",
    vitrin_verified: "Profil Vérifié",
    vitrin_modal_title: "Offre d'Emploi & Formulaire",
    vitrin_modal_desc: "Remplissez le formulaire pour proposer un projet et un budget à cet étudiant.",
    vitrin_modal_company: "Nom de l'Entreprise",
    vitrin_modal_contact: "Nom du Responsable",
    vitrin_modal_phone: "Numéro de Téléphone",
    vitrin_modal_budget: "Budget Proposé (₺)",
    vitrin_modal_desc_label: "Détails du Projet",
    vitrin_modal_submit: "Envoyer la Demande",
    vitrin_modal_success: "Votre Demande a été Reçue !",
    vitrin_modal_success_desc: "Notre équipe vous contactera dans les plus brefs délais.",

    // About Page
    about_hero_badge: "VISION MONDIALE & VALEURS PARTAGÉES",
    about_hero_title: "Un Mouvement Qui Dépasse les Frontières pour Bâtir l'Avenir",
    about_hero_desc: "Nous sommes de jeunes leaders, étudiants et créateurs unis par une vision qui dépasse les frontières. En unissant la richesse de nos horizons divers, nous ne sommes pas simplement une communauté réunie ; nous sommes un mouvement actif qui bâtit des valeurs partagées et façonne l'avenir.",
    about_philosophy_badge: "PHILOSOPHIE UBUNTU",
    about_philosophy_title: "« Je suis parce que nous sommes »",
    about_philosophy_desc: "Ubuntu Network allie la philosophie ancestrale de solidarité africaine aux normes internationales, à la diplomatie et au commerce B2B mondial.",
    about_card1_title: "Pont Intercontinental",
    about_card1_desc: "Nous connectons les talents multilingues formés dans les universités turques et mondiales directement au monde des affaires et au commerce international.",
    about_card2_title: "Mérite et Confiance",
    about_card2_desc: "Chaque candidat est vérifié par ses documents officiels, ses certifications linguistiques et ses réussites académiques.",
    about_card3_title: "Croissance Mutuelle",
    about_card3_desc: "Bien plus qu'un annuaire : un écosystème où les jeunes deviennent des leaders actifs dans la diplomatie, le commerce B2B et le réseautage.",
    founder_section_badge: "LEADERSHIP & VISION",
    founder_section_title: "Rencontrez Notre Fondateur",
    founder_name: "Muhammed Mansour Say",
    founder_role: "Fondateur d'Ubuntu Network & Coordinateur des Relations Internationales et B2B",
    founder_bio_1: "Je suis le fondateur d'Ubuntu Network. Originaire du Sénégal, je suis diplômé de la Faculté de Théologie de l'Université Bursa Uludağ.",
    founder_bio_2: "Très actif dans la société civile, j'ai été président de la Communauté des Étudiants Africains de Bursa. J'ai pris part à des programmes de Jeunes Diplomates et à des projets B2B en partenariat avec l'Association de Promotion de Bursa. Je maîtrise quatre langues : l'anglais, l'arabe, le français et le turc.",
    founder_bio_3: "En associant mon socle académique au commerce international, à mes expériences de terrain et à un vaste réseau relationnel, je guide les jeunes vers le leadership et le networking.",
    founder_langs_title: "Langues Maîtrisées :",
    founder_badge_c2: "Niveau Supérieur (C2)",
    founder_cred_uni: "Diplômé de la Faculté de Théologie de l'Univ. Bursa Uludağ",
    founder_cred_pres: "Ancien Président de la Communauté des Étudiants Africains de Bursa",
  },

  es: {
    // Nav & General
    nav_how_it_works: "Cómo Funciona",
    nav_vitrin: "Escaparate",
    nav_about: "Sobre Nosotros",
    nav_register: "Registro de Estudiantes",
    nav_login: "Iniciar Sesión",
    footer_slogan: "CONEXIÓN • OPORTUNIDAD • FUTURO",
    footer_rights: "Ubuntu Network. Todos los derechos reservados.",

    // Hero Slider
    slide1_badge: "PARA EMPLEADORES",
    slide1_title: "Los Estudiantes Universitarios Más Talentosos",
    slide1_subtitle: "Descubra talentos jóvenes, multilingües y visionarios en nuestro escaparate premium. Encuentre al candidato ideal y solicite una propuesta al instante.",
    slide1_btn_primary: "Explorar Talentos",
    slide1_btn_secondary: "Cómo Funciona",

    slide2_badge: "PARA ESTUDIANTES",
    slide2_title: "Comience a Construir su Carrera Hoy",
    slide2_subtitle: "No es solo un currículum, es su escaparate de élite. Muestre sus talentos e idiomas a empresas líderes y dé forma a su futuro.",
    slide2_btn_primary: "Unirse al Escaparate",
    slide2_btn_secondary: "Explorar Plataforma",

    slide3_badge: "SEGURO & CORPORATIVO",
    slide3_title: "Conexión • Oportunidad • Futuro",
    slide3_subtitle: "Ubuntu Network es el puente entre empleadores y estudiantes. La información permanece confidencial y gestionada por nuestro equipo.",
    slide3_btn_primary: "Examinar el Sistema",
    slide3_btn_secondary: "Registro de Estudiantes",

    // Categories
    cat_title: "¿En qué área de talento necesita apoyo?",
    cat_it_name: "Software & TI",
    cat_it_desc: "Desarrolladores, Analistas",
    cat_design_name: "Diseño & Creatividad",
    cat_design_desc: "UI/UX, Gráficos, Video",
    cat_lang_name: "Traducción & Idiomas",
    cat_lang_desc: "Estudiantes multilingües",
    cat_marketing_name: "Marketing & Negocios",
    cat_marketing_desc: "Marketing digital, SEO",

    // How it works
    how_badge: "¿CÓMO FUNCIONA?",
    how_title: "Corporativo, Transparente y Seguro",
    how_desc: "Sin caos de contactos ni estrés de negociación directa. Gestionamos todo el proceso para usted.",
    how_step1_title: "1. Filtre & Descubra",
    how_step1_desc: "Busque según el departamento, idioma extranjero y habilidades requeridas.",
    how_step2_title: "2. Solicite una Propuesta",
    how_step2_desc: "Complete el formulario 'Solicitar Presupuesto'. Su solicitud llega directamente a nuestra dirección.",
    how_step3_title: "3. Trabaje con Confianza",
    how_step3_desc: "Nuestro equipo valida el flujo, define los presupuestos e inicia su colaboración profesional.",

    // CTA
    cta_emp_badge: "EMPLEADORES",
    cta_emp_title: "Incorpore Nueva Energía a su Equipo",
    cta_emp_desc: "¿Busca un compañero multilingüe, enérgico y con dominio de las tecnologías modernas?",
    cta_emp_btn: "Explorar Escaparate",
    cta_stu_badge: "ESTUDIANTES",
    cta_stu_title: "Ocupe su Lugar en el Escaparate",
    cta_stu_desc: "Conecte sus talentos con grandes instituciones. Regístrese gratis y participe en proyectos selectos.",
    cta_stu_btn: "Postularse Ahora",

    // Vitrin
    vitrin_badge: "ESCAPARATE UBUNTU PREMIUM",
    vitrin_title: "Talentos Universitarios Destacados",
    vitrin_desc: "Futuros líderes certificados por sus habilidades, idiomas y trayectoria académica.",
    vitrin_tab_all: "Todos",
    vitrin_filter_btn: "Filtros Avanzados",
    vitrin_request_quote: "Pedir Presupuesto",
    vitrin_details: "Ver Perfil",
    vitrin_verified: "Perfil Verificado",
    vitrin_modal_title: "Propuesta de Trabajo & Formulario",
    vitrin_modal_desc: "Complete el formulario para proponer un proyecto y presupuesto a este estudiante.",
    vitrin_modal_company: "Nombre de la Empresa",
    vitrin_modal_contact: "Nombre del Responsable",
    vitrin_modal_phone: "Número de Teléfono",
    vitrin_modal_budget: "Presupuesto Propuesto (₺)",
    vitrin_modal_desc_label: "Detalles del Proyecto",
    vitrin_modal_submit: "Enviar Solicitud",
    vitrin_modal_success: "¡Su Solicitud ha sido Recibida!",
    vitrin_modal_success_desc: "Nuestro equipo se comunicará con usted en breve.",

    // About Page
    about_hero_badge: "VISIÓN GLOBAL & VALORES COMPARTIDOS",
    about_hero_title: "Un Movimiento que Trasciende Fronteras para Construir el Futuro",
    about_hero_desc: "Somos jóvenes líderes, estudiantes y creadores unidos por una visión que trasciende fronteras. Al combinar la riqueza de nuestros diversos orígenes, no somos solo una comunidad reunida; somos un movimiento activo que construye valores compartidos y lidera el futuro.",
    about_philosophy_badge: "FILOSOFÍA UBUNTU",
    about_philosophy_title: "“Yo soy porque nosotros somos”",
    about_philosophy_desc: "Ubuntu Network combina la antigua filosofía de solidaridad africana con los estándares mundiales, la diplomacia y el comercio B2B internacional.",
    about_card1_title: "Puente Intercontinental",
    about_card1_desc: "Conectamos los talentos multilingües formados en universidades turcas y globales directamente con el mundo empresarial y el comercio internacional.",
    about_card2_title: "Mérito y Confianza",
    about_card2_desc: "Cada candidato es verificado a través de documentos oficiales, certificaciones de idiomas y méritos académicos.",
    about_card3_title: "Crecimiento Mutuo",
    about_card3_desc: "Más que un directorio: un ecosistema donde los jóvenes se convierten en líderes activos de la diplomacia, el comercio B2B y el networking.",
    founder_section_badge: "LIDERAZGO & VISIÓN",
    founder_section_title: "Conozca a Nuestro Fundador",
    founder_name: "Muhammed Mansour Say",
    founder_role: "Fundador de Ubuntu Network y Coordinador de Relaciones Internacionales y B2B",
    founder_bio_1: "Soy el fundador de Ubuntu Network. Originario de Senegal, me gradué de la Facultad de Teología de la Universidad Bursa Uludağ.",
    founder_bio_2: "Muy activo en la sociedad civil, presidí la Comunidad de Estudiantes Africanos de Bursa. Participé en proyectos B2B y programas de Jóvenes Diplomáticos con la Asociación de Promoción de Bursa. Domino cuatro idiomas: inglés, árabe, francés y turco.",
    founder_bio_3: "Uniendo mi formación académica con el comercio internacional, experiencias de campo y una amplia red de contactos, lidero la integración y el networking de los jóvenes.",
    founder_langs_title: "Idiomas con Dominio Avanzado:",
    founder_badge_c2: "Nivel Avanzado (C2)",
    founder_cred_uni: "Graduado de la Fac. de Teología de la Univ. Bursa Uludağ",
    founder_cred_pres: "Ex Presidente de la Comunidad de Estudiantes Africanos de Bursa",
  },

  ar: {
    // Nav & General
    nav_how_it_works: "كيف يعمل؟",
    nav_vitrin: "معرض المواهب",
    nav_about: "من نحن",
    nav_register: "تسجيل الطلاب",
    nav_login: "تسجيل الدخول",
    footer_slogan: "اتصال • فرصة • مستقبل",
    footer_rights: "شبكة أوبونتو. جميع الحقوق محفوظة.",

    // Hero Slider
    slide1_badge: "لأصحاب الأعمال",
    slide1_title: "أكثر طلاب الجامعات تميزاً وموهبة في تركيا",
    slide1_subtitle: "اكتشف الكفاءات الشابة متعددة اللغات وصاحبة الرؤية في معرضنا المميز. اعثر على المرشح المثالي لمشاريعك واطلب عرض سعر الآن.",
    slide1_btn_primary: "اكتشف المواهب",
    slide1_btn_secondary: "كيف يعمل؟",

    slide2_badge: "للطلاب",
    slide2_title: "ابدأ في بناء مسيرتك المهنية اليوم",
    slide2_subtitle: "ليست مجرد سيرة ذاتية، بل واجهتك المرموقة. أظهر مواهبك ولغاتك للشركات العالمية وتناغم مع مشاريع نوعية تصنع مستقبلك.",
    slide2_btn_primary: "انضم للمعرض المتميز",
    slide2_btn_secondary: "استكشف المنصة",

    slide3_badge: "آمن ومؤسسي",
    slide3_title: "اتصال • فرصة • مستقبل",
    slide3_subtitle: "شبكة أوبونتو هي الجسر بين أصحاب الأعمال والطلاب. تبقى بيانات الاتصال سرية وتُدار العملية باحترافية من قبل إدارتنا.",
    slide3_btn_primary: "راجع النظام",
    slide3_btn_secondary: "تسجيل الطلاب",

    // Categories
    cat_title: "في أي مجال تبحث عن كفاءات ومواهب؟",
    cat_it_name: "البرمجيات وتكنولوجيا المعلومات",
    cat_it_desc: "مطورون ومحللون",
    cat_design_name: "التصميم والإبداع",
    cat_design_desc: "تصميم الواجهات، الجرافيك، الفيديو",
    cat_lang_name: "الترجمة واللغات",
    cat_lang_desc: "طلاب يتقنون لغات متعددة",
    cat_marketing_name: "التسويق وإدارة الأعمال",
    cat_marketing_desc: "تسويق رقمي، تحسين محركات البحث",

    // How it works
    how_badge: "كيف يعمل النظام؟",
    how_title: "مؤسسي، شفاف وآمن تماماً",
    how_desc: "لا فوضى في أرقام الاتصال ولا ضغوط تفاوض مباشر. نحن ندير العملية باحترافية كاملة نيابة عنك.",
    how_step1_title: "1. تصفح واكتشف",
    how_step1_desc: "ابحث بحسب التخصص، اللغات الأجنبية والمهارات المطلوبة لمشروعك.",
    how_step2_title: "2. أنشئ طلباً",
    how_step2_desc: "املأ نموذج 'طلب عرض سعر' للمرشح المختار لتصل تفاصيل طلبك مباشرة لإدارتنا.",
    how_step3_title: "3. اعمل بثقة وأمان",
    how_step3_desc: "تعتمد إدارتنا التوافق، تحدد الميزانية وتطلق التعاون المهني السليم.",

    // CTA
    cta_emp_badge: "أصحاب الشركات",
    cta_emp_title: "أضف دماء جديدة وطاقات واعدة لفريقك",
    cta_emp_desc: "هل تبحث عن زميل عمل متعدد اللغات، مفعم بالطاقة ومتقن للتقنيات الحديثة؟",
    cta_emp_btn: "تصفح المعرض",
    cta_stu_badge: "الطلاب",
    cta_stu_title: "احجز مكانك في المعرض المتميز",
    cta_stu_desc: "اربط مهاراتك مع كبرى المؤسسات. سجّل مجاناً، اجتز التوثيق وشارك في مشاريع نوعية.",
    cta_stu_btn: "قدّم الآن",

    // Vitrin
    vitrin_badge: "معرض أوبونتو بريميوم",
    vitrin_title: "نخبة المواهب الجامعية المتألقة",
    vitrin_desc: "قادة المستقبل المعتمدون بمهاراتهم، لغاتهم وتفوقهم الأكاديمي.",
    vitrin_tab_all: "الكل",
    vitrin_filter_btn: "تصفية متقدمة",
    vitrin_request_quote: "طلب عرض سعر",
    vitrin_details: "عرض الملف",
    vitrin_verified: "ملف موثق",
    vitrin_modal_title: "عرض عمل ونموذج الطلب",
    vitrin_modal_desc: "املأ النموذج لتقديم عرض عمل وميزانية مقترحة لهذا الطالب.",
    vitrin_modal_company: "اسم الشركة",
    vitrin_modal_contact: "اسم المسؤول",
    vitrin_modal_phone: "رقم الهاتف",
    vitrin_modal_budget: "الميزانية المقترحة (₺)",
    vitrin_modal_desc_label: "تفاصيل المشروع أو المهمة",
    vitrin_modal_submit: "إرسال الطلب",
    vitrin_modal_success: "تم استلام طلبكم بنجاح!",
    vitrin_modal_success_desc: "سيتواصل معكم فريق الإدارة في أقرب وقت.",

    // About Page
    about_hero_badge: "رؤية عالمية وقيم مشتركة",
    about_hero_title: "حركة تصنع المستقبل وتتجاوز كل الحدود",
    about_hero_desc: "نحن قادة شباب، طلاب وصناع تغيير جمعتنا رؤية تتجاوز الحدود الجغرافية. ومن خلال دمج تنوعنا الثقافي، لا نعتبر أنفسنا مجرد مجتمع يلتقي؛ بل حركة فاعلة تبني قيماً مشتركة وتصنع المستقبل.",
    about_philosophy_badge: "فلسفة أوبونتو",
    about_philosophy_title: "«أنا موجود لأننا موجودون معاً»",
    about_philosophy_desc: "تجمع شبكة أوبونتو فلسفة التضامن الإفريقية العريقة مع المعايير العالمية المعاصرة، الدبلوماسية والتجارة الدولية بين الشركات B2B.",
    about_card1_title: "جسر عابر للقارات",
    about_card1_desc: "نربط الكفاءات متعددة اللغات المتخرجة من الجامعات التركية والعالمية مباشرة ببيئة الأعمال والتجارة الدولية.",
    about_card2_title: "الجدارة والثقة",
    about_card2_desc: "يتم التحقق من كل مرشح شخصياً عبر الوثائق الرسمية، شهادات إتقان اللغات والتميز الأكاديمي.",
    about_card3_title: "النمو المشترك",
    about_card3_desc: "أكثر من مجرد منصة ربط؛ بل بيئة مستدامة يتحول فيها الشباب إلى قادة فاعلين في الدبلوماسية والتجارة وبناء الشبكات.",
    founder_section_badge: "القيادة والرؤية",
    founder_section_title: "تعرف على مؤسس الشبكة",
    founder_name: "محمد منصور صاي (Muhammed Mansour Say)",
    founder_role: "مؤسس شبكة أوبونتو ومنسق العلاقات الدولية ومشاريع B2B",
    founder_bio_1: "أنا مؤسس شبكة أوبونتو. من أصول سنغالية وتخرجت من كلية الإلهيات بجامعة بورصة أولوداغ.",
    founder_bio_2: "شاركت بفاعلية في منظمات المجتمع المدني وشغلت منصب رئيس رابطة طلاب إفريقيا في بورصة. شاركت في برامج الدبلوماسيين الشباب ومشاريع B2B بالتعاون مع اتحاد ترويج بورصة. أتقن أربع لغات بمستوى متقدم: الإنجليزية، العربية، الفرنسية والتركية.",
    founder_bio_3: "ومن خلال دمج خلفيتي الأكاديمية مع التجارة الدولية، الخبرات الميدانية وشبكة علاقاتي الواسعة، أقود مسارات التكيف والتطوير والتواصل للشباب.",
    founder_langs_title: "اللغات المتقنة بطلاقة:",
    founder_badge_c2: "مستوى متقدم (C2)",
    founder_cred_uni: "خريج كلية الإلهيات بجامعة بورصة أولوداغ",
    founder_cred_pres: "رئيس سابق لرابطة طلاب إفريقيا في بورصة",
    founder_photo_note: "* يمكنك تحديث هذه الصورة بسهولة عبر وضع public/founder.jpg داخل مجلد المشروع.",
  },

  sw: {
    // Nav & General
    nav_how_it_works: "Jinsi Inavyofanya Kazi",
    nav_vitrin: "Uwanja wa Vipaji",
    nav_about: "Kuhusu Sisi",
    nav_register: "Usajili wa Wanafunzi",
    nav_login: "Ingia",
    footer_slogan: "MUUNGANO • FURSA • MAISHA YA BAADAYE",
    footer_rights: "Ubuntu Network. Haki zote zimehifadhiwa.",

    // Hero Slider
    slide1_badge: "KWA WAAJIRI",
    slide1_title: "Wanafunzi wa Vyuo Vikuu Wenye Vipaji Bora",
    slide1_subtitle: "Gundua vijana wenye vipaji vya hali ya juu na lugha mbalimbali kwenye uwanja wetu maalum. Tafuta mtahiniwa sahihi na uombe ofa sasa.",
    slide1_btn_primary: "Chunguza Vipaji",
    slide1_btn_secondary: "Jinsi Inavyofanya Kazi",

    slide2_badge: "KWA WANAFUNZI",
    slide2_title: "Anza Kujenga Ajira Yako Leo",
    slide2_subtitle: "Sio wasifu tu, bali ni jukwaa lako maalum la kujitangaza. Onyesha vipaji na lugha zako kwa makampuni ya kimataifa na ujenge maisha yako ya baadaye.",
    slide2_btn_primary: "Jiunge na Vitrin Maalum",
    slide2_btn_secondary: "Chunguza Mfumo",

    slide3_badge: "SALAMA NA WA KIKORPORETI",
    slide3_title: "Muungano • Fursa • Baadaye",
    slide3_subtitle: "Ubuntu Network ndio daraja kati ya waajiri na wanafunzi. Mawasiliano hubaki kuwa siri na kusimamiwa kitaalamu na uongozi wetu.",
    slide3_btn_primary: "Kagua Mfumo",
    slide3_btn_secondary: "Usajili wa Wanafunzi",

    // Categories
    cat_title: "Unahitaji vipaji katika nyanja gani?",
    cat_it_name: "Programu & Tehama",
    cat_it_desc: "Waendelezaji, Wachambuzi",
    cat_design_name: "Ubunifu & Sanaa",
    cat_design_desc: "UI/UX, Picha, Video",
    cat_lang_name: "Tafsiri & Lugha",
    cat_lang_desc: "Wanafunzi wenye lugha nyingi",
    cat_marketing_name: "Masoko & Biashara",
    cat_marketing_desc: "Masoko ya Dijitali, SEO",

    // How it works
    how_badge: "MFUMO UNAFANYAJE KAZI?",
    how_title: "Wa Kitaalamu, Uwazi na Salama",
    how_desc: "Hakuna mkanganyiko wa namba za simu au shinikizo la mazungumzo ya moja kwa moja. Tunakusimamia kitaalamu.",
    how_step1_title: "1. Chuja & Gundua",
    how_step1_desc: "Tafuta kulingana na idara, lugha ya kigeni na ujuzi unaohitajika kwa mradi wako.",
    how_step2_title: "2. Tuma Ombi",
    how_step2_desc: "Jaza fomu ya 'Omba Ofa' kwa mwanafunzi uliyemchagua. Ombi lako litamfikia msimamizi moja kwa moja.",
    how_step3_title: "3. Fanya Kazi kwa Amani",
    how_step3_desc: "Uongozi wetu unathibitisha mchakato, unaweka wazi bajeti na kuanzisha ushirikiano bora.",

    // CTA
    cta_emp_badge: "WAAJIRI",
    cta_emp_title: "Ongeza Nguvu Mpya Kwenye Timu Yako",
    cta_emp_desc: "Je, unatafuta mfanyakazi mwenye nguvu, anayejua lugha nyingi na teknolojia za kisasa?",
    cta_emp_btn: "Chunguza Vitrin",
    cta_stu_badge: "WANAFUNZI",
    cta_stu_title: "Chukua Nafasi Yako Kwenye Vitrin",
    cta_stu_desc: "Unganisha vipaji vyako na taasisi kubwa. Jisajili bure, thibitishwa na ushiriki miradi maalum.",
    cta_stu_btn: "Omba Sasa",

    // Vitrin
    vitrin_badge: "UBUNTU PREMIUM VITRIN",
    vitrin_title: "Vipaji Bora vya Vyuo Vikuu",
    vitrin_desc: "Viongozi wa baadaye waliothibitishwa kwa ujuzi, lugha nyingi na mafanikio ya kimasomo.",
    vitrin_tab_all: "Wote",
    vitrin_filter_btn: "Vichungi vya Kina",
    vitrin_request_quote: "Omba Ofa",
    vitrin_details: "Tazama Wasifu",
    vitrin_verified: "Wasifu Uliothibitishwa",
    vitrin_modal_title: "Ofa ya Kazi & Fomu ya Ombi",
    vitrin_modal_desc: "Jaza fomu ili kupendekeza mradi na bajeti kwa mwanafunzi huyu.",
    vitrin_modal_company: "Jina la Kampuni",
    vitrin_modal_contact: "Jina la Mwakilishi",
    vitrin_modal_phone: "Nambari ya Simu",
    vitrin_modal_budget: "Bajeti Iliyopendekezwa (₺)",
    vitrin_modal_desc_label: "Maelezo ya Mradi au Kazi",
    vitrin_modal_submit: "Tuma Ombi",
    vitrin_modal_success: "Ombi Lako Limepokelewa!",
    vitrin_modal_success_desc: "Uongozi wetu utawasiliana nawe hivi karibuni.",

    // About Page
    about_hero_badge: "MAONO YA KIMATAIFA NA MAADILI YA PAMOJA",
    about_hero_title: "Harakati Inayovuka Mipaka na Kujenga Siku Zijazo",
    about_hero_desc: "Sisi ni viongozi vijana, wanafunzi na wabunifu tuliounganishwa na maono yanayovuka mipaka. Kwa kuunganisha utajiri wa asili zetu tofauti, sisi si jamii inayokutana tu; ni vuguvugu linalojenga maadili ya pamoja na kuongoza siku zijazo.",
    about_philosophy_badge: "FALSAFA YA UBUNTU",
    about_philosophy_title: "“Mimi ni kwa sababu sisi tuko”",
    about_philosophy_desc: "Ubuntu Network inaunganisha falsafa ya kale ya mshikamano wa Kiafrika na viwango vya kisasa vya kimataifa, diplomasia na biashara ya kimataifa ya B2B.",
    about_card1_title: "Daraja la Mabara",
    about_card1_desc: "Tunaunganisha vipaji vya lugha nyingi vinavyotoka vyuo vikuu vya Uturuki na ulimwenguni kote moja kwa moja na sekta ya biashara na biashara ya kimataifa.",
    about_card2_title: "Uwezo na Uaminifu",
    about_card2_desc: "Kila mtahiniwa anathibitishwa binafsi kupitia hati rasmi za serikali, vyeti vya lugha na mafanikio ya kielimu.",
    about_card3_title: "Ukuaji wa Pamoja",
    about_card3_desc: "Zaidi ya mfumo wa kuunganisha tu: mfumo ikolojia ambapo vijana wanakuwa viongozi hai katika diplomasia, biashara ya B2B na mitandao.",
    founder_section_badge: "UONGOZI NA MAONO",
    founder_section_title: "Kutana na Mwanzilishi Wetu",
    founder_name: "Muhammed Mansour Say",
    founder_role: "Mwanzilishi wa Ubuntu Network & Mratibu wa Uhusiano wa Kimataifa na B2B",
    founder_bio_1: "Mimi ndiye mwanzilishi wa Ubuntu Network. Asili yangu ni Senegal na nimehitimu kutoka Kitivo cha Theolojia cha Chuo Kikuu cha Bursa Uludağ.",
    founder_bio_2: "Nikishiriki kikamilifu katika mashirika ya kiraia, nilikuwa Rais wa Jumuiya ya Wanafunzi wa Kiafrika wa Bursa. Nilishiriki katika programu za Wanadiplomasia Vijana na miradi ya B2B kwa ushirikiano na Jumuiya ya Utangazaji ya Bursa. Ninajua lugha nne kwa kiwango cha juu: Kiingereza, Kiarabu, Kifaransa na Kituruki.",
    founder_bio_3: "Kwa kuchanganya msingi wangu wa kitaaluma na biashara ya kimataifa, uzoefu wa nyanjani na mtandao mpana wa mawasiliano, ninaongoza michakato ya maendeleo na mtandao kwa vijana.",
    founder_langs_title: "Lugha Zinazozungumzwa kwa Ufasaha:",
    founder_badge_c2: "Kiwango cha Juu (C2)",
    founder_cred_uni: "Mhitimu wa Kitivo cha Theolojia, Chuo Kikuu cha Bursa Uludağ",
    founder_cred_pres: "Rais wa Zamani wa Jumuiya ya Wanafunzi wa Kiafrika wa Bursa",
    founder_photo_note: "* Unaweza kusasisha picha hii kwa kuongeza public/founder.jpg kwenye folda yako.",
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
      if (saved === "ar") {
        document.documentElement.dir = "rtl";
      } else {
        document.documentElement.dir = "ltr";
      }
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
