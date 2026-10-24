"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  User, Star, Mail, Phone, GraduationCap, CheckCircle2, ArrowRight, 
  Camera, Upload, X, Image as ImageIcon, Plus, Briefcase, Link as LinkIcon, 
  MapPin, FileCheck, Loader2, AlertCircle 
} from "lucide-react";
import { UNIVERSITIES, DEPARTMENTS } from "@/data/constants";
import Footer from "@/components/Footer";

const COMMON_LANGUAGES = [
  "Türkçe", "İngilizce", "Almanca", "Fransızca", "İspanyolca", "İtalyanca", 
  "Rusça", "Arapça", "Çince", "Japonca", "Korece", "Farsça", 
  "Afrika Dilleri", "Diğer"
];

const LEVELS = ["Başlangıç Seviyesi", "Orta Düzey", "İleri Düzey"];

export default function KayitPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Form Fields State
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [city, setCity] = useState("");
  
  const [selectedUni, setSelectedUni] = useState("");
  const [customUni, setCustomUni] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [customDept, setCustomDept] = useState("");
  const [classYear, setClassYear] = useState("");
  const [edevletDocName, setEdevletDocName] = useState("");
  const [edevletDocUrl, setEdevletDocUrl] = useState("");

  const [category, setCategory] = useState("");
  const [skills, setSkills] = useState("");
  const [languages, setLanguages] = useState<{lang: string, level: string}[]>([]);
  const [currentLang, setCurrentLang] = useState("");
  const [currentLevel, setCurrentLevel] = useState("");
  const [langError, setLangError] = useState("");
  const [introBio, setIntroBio] = useState("");

  const [workType, setWorkType] = useState("");
  const [expectedBudget, setExpectedBudget] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // Fotoğraf State'leri
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string>("");
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);

  // KVKK State
  const [kvkkApproved, setKvkkApproved] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    setPhotoError("");
    setCameraLoading(true);

    if (typeof navigator === "undefined" || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setPhotoError("Tarayıcınız kamera erişimini desteklemiyor veya güvenli bağlantı (HTTPS) gereklidir.");
      setCameraLoading(false);
      return;
    }

    try {
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
      } catch (strictErr) {
        // Ön kamera kısıtlamasını desteklemeyen masaüstü web kameraları için fallback
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      }

      streamRef.current = stream;
      setIsCameraOpen(true);
    } catch (err: any) {
      console.error("Camera access error:", err);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setPhotoError("Kamera izni verilmedi. Lütfen tarayıcınızın adres çubuğundaki kilit simgesine tıklayıp kameraya izin verin veya dosya yükleyin.");
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        setPhotoError("Cihazınızda kullanılabilir bir kamera bulunamadı.");
      } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
        setPhotoError("Kamera şu an başka bir uygulama tarafından kullanılıyor veya kilitli.");
      } else {
        setPhotoError("Kameraya erişilemedi. Lütfen kamera izinlerinizi kontrol edin veya dosya yükleyin.");
      }
    } finally {
      setCameraLoading(false);
    }
  };

  // Kamera açıldığında video elementine akışı bağla ve oynat
  useEffect(() => {
    if (isCameraOpen && streamRef.current && videoRef.current) {
      const video = videoRef.current;
      video.srcObject = streamRef.current;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("Video auto-play warning:", err);
        });
      }
    }
  }, [isCameraOpen]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
    setCameraLoading(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const width = video.videoWidth || 640;
      const height = video.videoHeight || 480;

      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");
      if (context) {
        // Önizleme aynalama ile uyumlu olması için yatay çevirerek çiz
        context.translate(width, 0);
        context.scale(-1, 1);
        context.drawImage(video, 0, 0, width, height);
        const imageDataUrl = canvas.toDataURL("image/jpeg", 0.9);
        setPhoto(imageDataUrl);
        stopCamera();
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhotoError("");
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setPhotoError("Fotoğraf boyutu maksimum 2MB olmalıdır.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setPhoto(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const addLanguage = () => {
    setLangError("");
    if (!currentLang || !currentLevel) {
      setLangError("Lütfen hem dili hem de seviyeyi seçin.");
      return;
    }
    if (languages.some(l => l.lang === currentLang)) {
      setLangError("Bu dil zaten eklenmiş.");
      return;
    }
    setLanguages([...languages, { lang: currentLang, level: currentLevel }]);
    setCurrentLang("");
    setCurrentLevel("");
  };

  const removeLanguage = (langToRemove: string) => {
    setLanguages(languages.filter(l => l.lang !== langToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    if (!photo) {
      setPhotoError("Lütfen profil fotoğrafı ekleyin.");
      document.getElementById('photo-section')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    if (!classYear) {
      alert("Lütfen sınıfınızı seçin.");
      return;
    }

    if (languages.length === 0) {
      setLangError("Lütfen en az bir yabancı dil veya Türkçe ekleyin.");
      document.getElementById('language-section')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    if (introBio.trim().length < 250) {
      alert("Kendinizi tanıttığınız metin en az 250 karakter olmalıdır.");
      return;
    }

    if (!kvkkApproved) {
      alert("Lütfen KVKK metnini onaylayın.");
      return;
    }

    setIsSubmitting(true);

    try {
      const finalUni = selectedUni === "Diğer" ? customUni : selectedUni;
      const finalDept = selectedDept === "Diğer" ? customDept : selectedDept;

      const payload = {
        name,
        surname,
        birthDate,
        city,
        uni: finalUni,
        dept: finalDept,
        year: classYear,
        category,
        skills,
        languages,
        bio: introBio,
        workType,
        expectedBudget: Number(expectedBudget) || 0,
        portfolioUrl,
        phone,
        email,
        photo,
        edevletDocName: edevletDocName || "ogrenci_belgesi.pdf",
        edevletDocUrl: edevletDocUrl || "",
      };

      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Başvuru kaydedilirken bir hata oluştu.");
      }

      if (data.student) {
        try {
          const cached = localStorage.getItem("UBUNTU_STUDENTS_CACHE");
          const arr = cached ? JSON.parse(cached) : [];
          arr.unshift(data.student);
          localStorage.setItem("UBUNTU_STUDENTS_CACHE", JSON.stringify(arr));
        } catch (e) {}
      }

      setIsSubmitted(true);
    } catch (err: any) {
      setSubmitError(err.message || "Bağlantı hatası oluştu, lütfen tekrar deneyin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] pt-32 pb-20 flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full bg-white rounded-3xl p-10 text-center shadow-xl border border-gray-100"
        >
          <div className="w-20 h-20 bg-[#2E5A27]/10 text-[#2E5A27] rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold text-[#1A1A1A] mb-4">Başvurunuz Başarıyla Alındı!</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Harika! Profil ve öğrenci belgesi bilgilerinizi güvenli sistemimize kaydettik. Yöneticimiz başvurunuzu inceleyip onayladığında profiliniz <strong>Ubuntu Network Premium Vitrini</strong>&apos;nde yer alacaktır.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="inline-flex items-center gap-2 bg-[#1A1A1A] text-white px-8 py-3.5 rounded-full font-bold hover:bg-[#2E5A27] transition-all shadow-md"
          >
            Ana Sayfaya Dön <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] pt-28 sm:pt-32 flex flex-col justify-between">
      <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 pb-16 sm:pb-24 w-full">
        
        <div className="text-center mb-8 sm:mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1A1A1A] mb-3 sm:mb-4 tracking-tight"
          >
            Premium Vitrin&apos;e Katıl
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Yeteneklerinizi prestijli projeler ve kurumsal işverenlerle buluşturun. Aşağıdaki formu eksiksiz doldurarak değerlendirme sürecine katılın.
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
        >
          <div className="h-2 w-full bg-gradient-to-r from-[#2E5A27] to-[#D97725]"></div>
          
          <form onSubmit={handleSubmit} className="p-5 sm:p-8 md:p-12 space-y-8 sm:space-y-12">
            
            {submitError && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="text-sm font-medium">{submitError}</p>
              </div>
            )}

            {/* Fotoğraf Yükleme Bölümü */}
            <section id="photo-section">
              <h3 className="text-lg sm:text-xl font-bold text-[#1A1A1A] mb-4 sm:mb-6 flex items-center gap-2 border-b pb-3 sm:pb-4">
                <ImageIcon className="w-5 h-5 text-[#2E5A27]" /> Profil Fotoğrafı (Vesikalık Tarzı)
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mb-5 sm:mb-6 leading-relaxed">
                İşverenlerin sizi daha iyi tanıması için yüzünüzün net çıktığı, kurumsal ve şık bir fotoğraf yükleyin veya kameranızla çekin. (Maks. 2MB)
              </p>

              <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-center sm:items-start">
                <div className="w-36 h-36 sm:w-40 sm:h-40 shrink-0 bg-gray-100 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden relative group shadow-inner mx-auto sm:mx-0">
                  {photo ? (
                    <>
                      <img src={photo} alt="Profil Önizleme" className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => setPhoto(null)}
                        className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center text-white transition-all"
                      >
                        <X className="w-8 h-8" />
                      </button>
                    </>
                  ) : (
                    <User className="w-16 h-16 text-gray-400" />
                  )}
                </div>

                <div className="flex-1 w-full">
                  {!isCameraOpen ? (
                    <div className="flex flex-col gap-3 sm:gap-4">
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 bg-white border-2 border-[#2E5A27] text-[#2E5A27] py-3 px-4 rounded-xl font-bold hover:bg-[#2E5A27]/5 transition-colors text-sm">
                          <Upload className="w-4 h-4 sm:w-5 sm:h-5" /> Dosya Seç (Maks 2MB)
                          <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                        </label>
                        <button 
                          type="button" 
                          onClick={startCamera}
                          disabled={cameraLoading}
                          className="flex-1 flex items-center justify-center gap-2 bg-[#D97725] text-white py-3 px-4 rounded-xl font-bold hover:bg-[#c36a21] transition-colors disabled:opacity-60 shadow-sm text-sm"
                        >
                          {cameraLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" /> Kamera Başlatılıyor...
                            </>
                          ) : (
                            <>
                              <Camera className="w-4 h-4 sm:w-5 sm:h-5" /> Kamerayla Çek
                            </>
                          )}
                        </button>
                      </div>
                      {photoError && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{photoError}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-gray-950 p-4 rounded-2xl relative border border-white/10 shadow-2xl">
                      {/* Canlı Kamera Başlığı ve Kapatma Butonu */}
                      <div className="flex items-center justify-between mb-3 px-1">
                        <span className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                          Kamera Aktif
                        </span>
                        <button 
                          type="button" 
                          onClick={stopCamera}
                          className="bg-white/10 text-white p-1.5 rounded-full hover:bg-white/20 transition-colors"
                          title="Kamerayı Kapat"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Video Önizleme */}
                      <div className="relative rounded-xl overflow-hidden bg-black mb-3 border border-white/10">
                        <video 
                          ref={videoRef} 
                          autoPlay 
                          playsInline 
                          muted 
                          className="w-full h-56 sm:h-64 object-cover transform scale-x-[-1]" 
                        />
                        {/* Çekim Rehberi Çizgisi */}
                        <div className="absolute inset-0 pointer-events-none border-2 border-white/20 rounded-xl m-3 flex items-end justify-center pb-2">
                          <span className="text-[11px] text-white/70 bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-sm">
                            Yüzünüzü ortalayın ve butona basın
                          </span>
                        </div>
                      </div>

                      <canvas ref={canvasRef} className="hidden" />

                      <div className="flex gap-2">
                        <button 
                          type="button" 
                          onClick={stopCamera}
                          className="px-4 py-3 bg-white/10 hover:bg-white/15 text-white rounded-xl font-bold text-xs transition-colors"
                        >
                          Vazgeç
                        </button>
                        <button 
                          type="button" 
                          onClick={capturePhoto}
                          className="flex-1 bg-[#2E5A27] hover:bg-[#386c30] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-colors text-sm"
                        >
                          <Camera className="w-5 h-5" /> Fotoğrafı Çek ve Kaydet
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* 1. Kişisel Bilgiler */}
            <section>
              <h3 className="text-xl font-bold text-[#1A1A1A] mb-6 flex items-center gap-2 border-b pb-4">
                <User className="w-5 h-5 text-[#2E5A27]" /> Kişisel Bilgiler
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Adınız</label>
                  <input 
                    required 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2E5A27]/50 focus:border-[#2E5A27] transition-all" 
                    placeholder="Örn: Elif" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Soyadınız</label>
                  <input 
                    required 
                    type="text" 
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2E5A27]/50 focus:border-[#2E5A27] transition-all" 
                    placeholder="Örn: Yılmaz" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Doğum Tarihi (Gün / Ay / Yıl)</label>
                  <input 
                    required 
                    type="date" 
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2E5A27]/50 focus:border-[#2E5A27] transition-all text-gray-700" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Yaşadığınız Şehir</label>
                  <div className="relative">
                    <MapPin className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input 
                      required 
                      type="text" 
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2E5A27]/50 focus:border-[#2E5A27] transition-all" 
                      placeholder="Örn: Bursa" 
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* 2. Eğitim Bilgileri */}
            <section>
              <h3 className="text-xl font-bold text-[#1A1A1A] mb-6 flex items-center gap-2 border-b pb-4">
                <GraduationCap className="w-5 h-5 text-[#2E5A27]" /> Eğitim Bilgileri
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Üniversite</label>
                  <select 
                    required 
                    value={selectedUni} 
                    onChange={(e) => setSelectedUni(e.target.value)} 
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2E5A27]/50 focus:border-[#2E5A27] transition-all"
                  >
                    <option value="" disabled>Üniversite Seçiniz...</option>
                    {UNIVERSITIES.map((uni) => <option key={uni} value={uni}>{uni}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Bölüm</label>
                  <select 
                    required 
                    value={selectedDept} 
                    onChange={(e) => setSelectedDept(e.target.value)} 
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2E5A27]/50 focus:border-[#2E5A27] transition-all"
                  >
                    <option value="" disabled>Bölüm Seçiniz...</option>
                    {DEPARTMENTS.map((dept) => <option key={dept} value={dept}>{dept}</option>)}
                  </select>
                </div>

                {selectedUni === "Diğer" && (
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold text-gray-700">Üniversite Adını Yazınız</label>
                    <input 
                      required 
                      type="text" 
                      value={customUni}
                      onChange={(e) => setCustomUni(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2E5A27]/50 focus:border-[#2E5A27] transition-all" 
                      placeholder="Örn: Yurtdışı / Özel Üniversite" 
                    />
                  </div>
                )}

                {selectedDept === "Diğer" && (
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold text-gray-700">Bölüm Adını Yazınız</label>
                    <input 
                      required 
                      type="text" 
                      value={customDept}
                      onChange={(e) => setCustomDept(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2E5A27]/50 focus:border-[#2E5A27] transition-all" 
                      placeholder="Örn: Özel Bir Bölüm" 
                    />
                  </div>
                )}

                <div className="space-y-2 md:col-span-2 mt-4">
                  <label className="text-sm font-semibold text-gray-700">Sınıf</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 sm:gap-3">
                    {['Hazırlık', '1. Sınıf', '2. Sınıf', '3. Sınıf', '4. Sınıf', '5. Sınıf', '6. Sınıf'].map((cls) => (
                      <label key={cls} className={`flex items-center justify-center px-2 py-2.5 sm:px-3 sm:py-3 border rounded-xl cursor-pointer transition-all ${classYear === cls ? 'bg-[#2E5A27] text-white border-[#2E5A27] font-bold shadow-md' : 'border-gray-200 hover:bg-[#2E5A27]/5 hover:border-[#2E5A27]'}`}>
                        <input 
                          type="radio" 
                          name="sinif" 
                          value={cls} 
                          checked={classYear === cls}
                          onChange={(e) => setClassYear(e.target.value)}
                          className="sr-only" 
                          required 
                        />
                        <span className="text-xs sm:text-sm font-medium text-center">{cls}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2 mt-6 p-4 sm:p-6 bg-[#2E5A27]/5 border-2 border-dashed border-[#2E5A27]/30 rounded-2xl">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                    <FileCheck className="w-5 h-5 text-[#2E5A27]" /> 
                    E-Devlet Öğrenci Belgesi <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Zorunlu</span>
                  </label>
                  <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                    Güvenli ve doğrulanmış bir platform olmamız için lütfen <strong>e-Devlet</strong> üzerinden alınmış <strong>güncel tarihli</strong> öğrenci belgenizi PDF veya JPEG formatında yükleyiniz. (Bu belge sadece yönetici tarafından teyit amaçlı kullanılacak olup, hiçbir yerde yayınlanmaz.)
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
                    <input 
                      id="edevlet-doc"
                      required 
                      type="file" 
                      accept=".pdf, image/jpeg, image/jpg, image/png" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 8 * 1024 * 1024) {
                            alert("Öğrenci belgesi boyutu maksimum 8MB olmalıdır.");
                            return;
                          }
                          setEdevletDocName(file.name);
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            setEdevletDocUrl(event.target?.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="flex-1 w-full text-xs sm:text-sm text-gray-500 file:mr-3 sm:file:mr-4 file:py-2.5 sm:file:py-3 file:px-4 sm:file:px-6 file:rounded-xl file:border-0 file:text-xs sm:file:text-sm file:font-bold file:bg-white file:border-2 file:border-[#2E5A27] file:text-[#2E5A27] hover:file:bg-[#2E5A27]/5 transition-all cursor-pointer bg-white border border-gray-200 rounded-xl"
                    />
                    <button 
                      id="doc-btn"
                      type="button"
                      onClick={() => document.getElementById('edevlet-doc')?.click()}
                      className={`w-full sm:w-auto px-6 sm:px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shrink-0 shadow-md text-white text-sm ${edevletDocName ? 'bg-green-600 hover:bg-green-700' : 'bg-[#D97725] hover:bg-[#c36a21]'}`}
                    >
                      {edevletDocName ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" /> Yüklendi
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" /> Belgeyi Yükle
                        </>
                      )}
                    </button>
                  </div>
                  {edevletDocName && (
                    <p className="text-xs text-green-700 font-semibold mt-2">
                      Seçilen Belge: {edevletDocName}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* 3. Yetenek & Yabancı Dil */}
            <section id="language-section">
              <h3 className="text-xl font-bold text-[#1A1A1A] mb-6 flex items-center gap-2 border-b pb-4">
                <Star className="w-5 h-5 text-[#2E5A27]" /> Yetenekler ve Diller
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Ana Yetenek Alanınız</label>
                  <select 
                    required 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2E5A27]/50 focus:border-[#2E5A27] transition-all"
                  >
                    <option value="" disabled>Seçiniz...</option>
                    <option value="Yazılım & IT">Yazılım & IT</option>
                    <option value="Tasarım & Kreatif">Tasarım & Kreatif</option>
                    <option value="Pazarlama">Dijital Pazarlama</option>
                    <option value="Yabancı Dil & Çeviri">Çeviri & Dil Hizmetleri</option>
                    <option value="İletişim & Halkla İlişkiler">İletişim & Halkla İlişkiler</option>
                    <option value="Veri Analizi & Finans">Veri Analizi & Finans</option>
                    <option value="Mühendislik">Genel Mühendislik Uygulamaları</option>
                    <option value="Diğer">Diğer</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Uzmanlıklarınız (Virgülle ayırın)</label>
                  <input 
                    required 
                    type="text" 
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2E5A27]/50 focus:border-[#2E5A27] transition-all" 
                    placeholder="Örn: AutoCAD, Python, SEO, İçerik Üretimi" 
                  />
                </div>
                
                <div className="space-y-4 md:col-span-2 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                  <label className="text-sm font-bold text-gray-800">Yabancı Dil Bilgileriniz</label>
                  {languages.length > 0 && (
                    <div className="flex flex-wrap gap-3 mb-4">
                      {languages.map((item) => (
                        <div key={item.lang} className="flex items-center gap-2 bg-white border border-gray-200 pl-4 pr-2 py-2 rounded-xl shadow-sm">
                          <div>
                            <span className="font-bold text-[#1A1A1A]">{item.lang}</span>
                            <span className="text-gray-400 mx-2">|</span>
                            <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                              item.level === 'Başlangıç Seviyesi' ? 'bg-orange-100 text-orange-700' :
                              item.level === 'Orta Düzey' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                            }`}>{item.level}</span>
                          </div>
                          <button type="button" onClick={() => removeLanguage(item.lang)} className="ml-2 w-6 h-6 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 flex items-center justify-center transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="w-full md:w-5/12 space-y-2">
                      <label className="text-xs text-gray-500 font-medium">Dil Seçin</label>
                      <select value={currentLang} onChange={(e) => setCurrentLang(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2E5A27]/50 focus:border-[#2E5A27] transition-all">
                        <option value="" disabled>Seçiniz...</option>
                        {COMMON_LANGUAGES.map(lang => <option key={lang} value={lang}>{lang}</option>)}
                      </select>
                    </div>
                    
                    <div className="w-full md:w-5/12 space-y-2">
                      <label className="text-xs text-gray-500 font-medium">Seviye Belirleyin</label>
                      <select value={currentLevel} onChange={(e) => setCurrentLevel(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2E5A27]/50 focus:border-[#2E5A27] transition-all">
                        <option value="" disabled>Seçiniz...</option>
                        {LEVELS.map(level => <option key={level} value={level}>{level}</option>)}
                      </select>
                    </div>

                    <button type="button" onClick={addLanguage} className="w-full md:w-2/12 bg-[#2E5A27]/10 text-[#2E5A27] border border-[#2E5A27]/20 hover:bg-[#2E5A27] hover:text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-1 h-[50px]">
                      <Plus className="w-5 h-5" /> Ekle
                    </button>
                  </div>
                  {langError && <p className="text-red-500 text-sm font-medium mt-2">{langError}</p>}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <div className="flex justify-between items-end">
                    <label className="text-sm font-semibold text-gray-700">Kendinizi Detaylıca Tanıtın</label>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded transition-colors ${
                      introBio.length >= 250 ? 'bg-green-100 text-green-700' : 'bg-[#D97725]/10 text-[#D97725]'
                    }`}>
                      {introBio.length} / 250 karakter {introBio.length >= 250 ? '✓' : '(Zorunlu)'}
                    </span>
                  </div>
                  <textarea 
                    required 
                    minLength={250}
                    rows={5} 
                    value={introBio}
                    onChange={(e) => setIntroBio(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2E5A27]/50 focus:border-[#2E5A27] transition-all resize-none" 
                    placeholder="İşverenlere sizi neden seçmeleri gerektiğini anlatan, tecrübelerinizden ve hedeflerinizden bahseden profesyonel bir metin yazın. (Minimum 250 karakter)"
                  ></textarea>
                </div>
              </div>
            </section>

            {/* 4. Kariyer Beklentileri ve Bağlantılar */}
            <section>
              <h3 className="text-xl font-bold text-[#1A1A1A] mb-6 flex items-center gap-2 border-b pb-4">
                <Briefcase className="w-5 h-5 text-[#2E5A27]" /> Kariyer ve Bağlantılar
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Çalışma Şekli Tercihi</label>
                  <select 
                    required 
                    value={workType}
                    onChange={(e) => setWorkType(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2E5A27]/50 focus:border-[#2E5A27] transition-all"
                  >
                    <option value="" disabled>Seçiniz...</option>
                    <option value="Uzaktan">Uzaktan (Remote) / Freelance</option>
                    <option value="Yarı Zamanlı">Yarı Zamanlı (Part-Time) / Ofis</option>
                    <option value="Tam Zamanlı">Tam Zamanlı (Mezunlar İçin)</option>
                    <option value="Fark Etmez">Fark Etmez / Projeye Göre</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center justify-between">
                    Minimum Gelir Beklentisi
                    <span className="text-[10px] font-bold bg-[#D97725]/10 text-[#D97725] px-2 py-0.5 rounded uppercase">Sadece Yönetici Görebilir</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₺</span>
                    <input 
                      required 
                      type="number" 
                      step="500" 
                      value={expectedBudget}
                      onChange={(e) => setExpectedBudget(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#D97725]/50 focus:border-[#D97725] transition-all font-semibold" 
                      placeholder="Örn: 10000 (Aylık / Proje Bazlı)" 
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <LinkIcon className="w-4 h-4" /> Portfolyo veya LinkedIn Bağlantınız (İsteğe Bağlı)
                  </label>
                  <input 
                    type="url" 
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2E5A27]/50 focus:border-[#2E5A27] transition-all" 
                    placeholder="https://linkedin.com/in/profiliniz veya GitHub / Behance vb." 
                  />
                </div>
              </div>
            </section>

            {/* 5. İletişim Bilgileri */}
            <section>
              <h3 className="text-xl font-bold text-[#1A1A1A] mb-6 flex items-center gap-2 border-b pb-4">
                <Phone className="w-5 h-5 text-[#D97725]" /> İletişim Bilgileri 
                <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded ml-2 uppercase">İşverenlerden Gizlenir</span>
              </h3>
              <p className="text-sm text-gray-500 mb-6">Bu bilgiler sadece Ubuntu Network yöneticisi tarafından onay ve proje süreçlerinde sizinle iletişime geçmek için kullanılacaktır.</p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Telefon Numaranız</label>
                  <div className="relative">
                    <Phone className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input 
                      required 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#D97725]/50 focus:border-[#D97725] transition-all" 
                      placeholder="05XX XXX XX XX" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">E-Posta Adresiniz</label>
                  <div className="relative">
                    <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input 
                      required 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#D97725]/50 focus:border-[#D97725] transition-all" 
                      placeholder="mail@ornek.com" 
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* KVKK ve Submit */}
            <div className="pt-8 border-t border-gray-200 space-y-6">
              
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center mt-0.5">
                  <input 
                    type="checkbox" 
                    required
                    checked={kvkkApproved}
                    onChange={(e) => setKvkkApproved(e.target.checked)}
                    className="appearance-none w-5 h-5 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#2E5A27] checked:bg-[#2E5A27] checked:border-[#2E5A27] transition-all" 
                  />
                  <CheckCircle2 className={`absolute w-3.5 h-3.5 text-white pointer-events-none transition-opacity ${kvkkApproved ? 'opacity-100' : 'opacity-0'}`} />
                </div>
                <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                  Platform Kullanım Koşullarını ve <a href="#" className="text-[#2E5A27] font-bold underline decoration-[#2E5A27]/30 hover:decoration-[#2E5A27]">KVKK Aydınlatma Metnini</a> okudum, kişisel verilerimin işverenlerle proje eşleştirmesi amacıyla Ubuntu Network yöneticisi tarafından işlenmesini onaylıyorum.
                </span>
              </label>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-[#2E5A27] text-white py-4 rounded-xl text-lg font-bold hover:bg-[#3A6B35] shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Başvurunuz Gönderiliyor...
                  </>
                ) : (
                  <>
                    <FileCheck className="w-5 h-5" /> Başvuruyu Tamamla
                  </>
                )}
              </button>
              <p className="text-center text-sm text-gray-500">
                Başvurunuz incelendikten sonra yöneticimiz sizinle iletişime geçecektir.
              </p>
            </div>
            
          </form>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
