// contexts/LanguageContext.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export type Language = "en" | "ar" | "ku";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  dir: "ltr" | "rtl";
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

const translations = {
  en: {
    // Header
    "featured.projects": "Featured Projects",
    loading: "Loading...",
    "error.loading": "Error Loading Projects",
    "no.projects": "No Projects Found",
    "check.back": "Check back later for new projects.",

    // Card
    "verified.partner": "Verified partner",
    "tap.details": "Tap for details",
    featured: "Featured",
    more: "more",
    home: "Home",
    lostCard: "In case of lost card keep your ID safe",

    // Modal
    location: "Location",
    phone: "Phone",
    "project.location": "Project Location",

    // Activation
    "activate.card": "Activate Your Card",
    "activate.subtitle":
      "Complete your profile to start enjoying exclusive discounts",
    "full.name": "Full Name",
    "enter.full.name": "Enter your full name",
    characters: "characters",
    "phone.number": "Phone Number",
    "phone.placeholder": "07xxxxxxxxx",
    "phone.hint": "Iraqi mobile number (07xxxxxxxxx or +9647xxxxxxxxx)",
    "location.label": "Location",
    "location.placeholder": "City, neighborhood, or area",
    "location.hint": "Where do you live? (e.g., Erbil - Dream City)",
    "activate.button": "Activate Card",
    activating: "Activating...",
    "need.help": "Need help?",
    "contact.support": "Contact Support",
    terms: "Terms of Service",
    privacy: "Privacy Policy",
    "agree.text": "By activating your card, you agree to our",
    and: "and",

    // Profile
    "card.holder.profile": "Card Holder Profile",
    "verified.member": "Verified Member Information",
    active: "ACTIVE",
    inactive: "INACTIVE",
    "member.id": "Member ID",
    "contact.number": "Contact Number",
    residence: "Residence",
    "account.status": "Account Status",
    "active.verified": "Active & Verified",
    "inactive.account": "Inactive Account",
    // "full.access": "This member has full access to all benefits and services."
    "full.access":
      "Congratulations! You are a Cardly member.",
    "contact.support.activate":
      "Please contact support to activate this account.",
    "loading.member": "Loading Member Profile...",
    "access.denied": "Access Denied",
    "verification.failed": "Card verification failed. Please contact support.",
    "secured.verified": "Secured & Verified • Cardly Business Services",

    // Validation messages
    "validation.name.empty":
      "Name must not be empty and must be less than or equal to 120 characters.",
    "validation.phone.invalid":
      "Invalid Iraq phone number format. Use: 07xxxxxxxxx or +9647xxxxxxxxx",
    "validation.location.empty":
      "Location must not be empty and must be less than 200 characters.",
    "activation.failed":
      "Activation failed. Please try again or contact support.",
    "activation.success": "Card activated successfully! Redirecting...",
  },
  ar: {
    // Header
    "featured.projects": "المشاريع المميزة",
    loading: "جاري التحميل...",
    "error.loading": "خطأ في تحميل المشاريع",
    "no.projects": "لا توجد مشاريع",
    "check.back": "تحقق لاحقًا للمشاريع الجديدة.",

    // Card
    "verified.partner": "شريك موثق",
    "tap.details": "اضغط للتفاصيل",
    featured: "مميز",
    more: "المزيد",
    home: "الصفحة الرئيسية",
    lostCard: "في حال فقدان البطاقة احفظ ال ID الخاص بك",

    // Modal
    location: "الموقع",
    phone: "الهاتف",
    "project.location": "موقع المشروع",

    // Activation
    "activate.card": "تفعيل بطاقتك",
    "activate.subtitle":
      "أكمل ملفك الشخصي للبدء في الاستمتاع بالخصومات الحصرية",
    "full.name": "الاسم الكامل",
    "enter.full.name": "أدخل اسمك الكامل",
    characters: "حرف",
    "phone.number": "رقم الهاتف",
    "phone.placeholder": "07xxxxxxxxx",
    "phone.hint": "رقم الهاتف المحمول العراقي (07xxxxxxxxx أو +9647xxxxxxxxx)",
    "location.label": "الموقع",
    "location.placeholder": "المدينة، الحي، أو المنطقة",
    "location.hint": "أين تسكن؟ (مثال: أربيل - مدينة الأحلام)",
    "activate.button": "تفعيل البطاقة",
    activating: "جاري التفعيل...",
    "need.help": "تحتاج مساعدة؟",
    "contact.support": "اتصل بالدعم",
    terms: "شروط الخدمة",
    privacy: "سياسة الخصوصية",
    "agree.text": "بتفعيل بطاقتك، فإنك توافق على",
    and: "و",

    // Profile
    "card.holder.profile": "ملف حامل البطاقة",
    "verified.member": "معلومات العضو الموثق",
    active: "نشط",
    inactive: "غير نشط",
    "member.id": "معرف العضو",
    "contact.number": "رقم الاتصال",
    residence: "السكن",
    "account.status": "حالة الحساب",
    "active.verified": "نشط وموثق",
    "inactive.account": "حساب غير نشط",
    // "full.access": "هذا العضو لديه وصول كامل إلى جميع المزايا والخدمات.",
    "full.access": "تهانينا! أنت عضو في كاردلي.",
    "contact.support.activate": "يرجى الاتصال بالدعم لتفعيل هذا الحساب.",
    "loading.member": "جاري تحميل ملف العضو...",
    "access.denied": "تم رفض الوصول",
    "verification.failed": "فشل التحقق من البطاقة. يرجى الاتصال بالدعم.",
    "secured.verified": "آمن وموثق • خدمات كاردلي للأعمال",

    // Validation messages
    "validation.name.empty":
      "يجب ألا يكون الاسم فارغًا ويجب أن يكون أقل من أو يساوي 120 حرفًا.",
    "validation.phone.invalid":
      "تنسيق رقم الهاتف العراقي غير صحيح. استخدم: 07xxxxxxxxx أو +9647xxxxxxxxx",
    "validation.location.empty":
      "يجب ألا يكون الموقع فارغًا ويجب أن يكون أقل من 200 حرف.",
    "activation.failed":
      "فشل التفعيل. يرجى المحاولة مرة أخرى أو الاتصال بالدعم.",
    "activation.success": "تم تفعيل البطاقة بنجاح! جاري إعادة التوجيه...",
  },
  ku: {
    // Header
    "featured.projects": "پرۆژە تایبەتەکان",
    loading: "بارکردن...",
    "error.loading": "هەڵە لە بارکردنی پرۆژەکان",
    "no.projects": "هیچ پرۆژەیەک نەدۆزرایەوە",
    "check.back": "دواتر بگەڕێوە بۆ پرۆژە نوێیەکان.",

    // Card
    "verified.partner": "هاوبەشی پشتڕاستکراو",
    "tap.details": "دەست لێبدە بۆ وردەکاری",
    featured: "تایبەت",
    more: "زیاتر",
    home: "پەڕەی سەرەکی",
    lostCard: "لە هەر حالەتێکی ون بوون id ناو بپارەێزد",

    // Modal
    location: "شوێن",
    phone: "تەلەفۆن",
    "project.location": "شوێنی پرۆژە",

    // Activation
    "activate.card": "چالاککردنی کارتەکەت",
    "activate.subtitle":
      "پرۆفایلەکەت تەواو بکە بۆ دەستپێکردنی چێژوەرگرتن لە داشکاندنە تایبەتەکان",
    "full.name": "ناوی تەواو",
    "enter.full.name": "ناوی تەواوت بنووسە",
    characters: "پیت",
    "phone.number": "ژمارەی تەلەفۆن",
    "phone.placeholder": "07xxxxxxxxx",
    "phone.hint": "ژمارەی مۆبایلی عێراقی (07xxxxxxxxx یان +9647xxxxxxxxx)",
    "location.label": "شوێن",
    "location.placeholder": "شار، گەڕەک، یان ناوچە",
    "location.hint": "لە کوێ دەژیت؟ (نموونە: هەولێر - شاری خەونەکان)",
    "activate.button": "چالاککردنی کارت",
    activating: "چالاککردن...",
    "need.help": "پێویستت بە یارمەتی هەیە؟",
    "contact.support": "پەیوەندی بە پشتگیری بکە",
    terms: "مەرجەکانی خزمەتگوزاری",
    privacy: "سیاسەتی تایبەتێتی",
    "agree.text": "بە چالاککردنی کارتەکەت، ڕازی دەبیت بە",
    and: "و",

    // Profile
    "card.holder.profile": "پرۆفایلی خاوەن داشکاندن",
    "verified.member": "زانیاری ئەندامی پشتڕاستکراو",
    active: "چالاک",
    inactive: "ناچالاک",
    "member.id": "ناسنامەی ئەندام",
    "contact.number": "ژمارەی پەیوەندی",
    residence: "نیشتەجێبوون",
    "account.status": "دۆخی هەژمار",
    "active.verified": "چالاک و پشتڕاستکراو",
    "inactive.account": "هەژماری ناچالاک",
    "full.access": "پیرۆزە بوویت بە ئەندامی کاردلی",
    // "full.access": "ئەم ئەندامە دەستگەیشتنی تەواوی هەیە بۆ هەموو سوود و خزمەتگوزارییەکان.",
    "contact.support.activate":
      "تکایە پەیوەندی بە پشتگیری بکە بۆ چالاککردنی ئەم هەژمارە.",
    "loading.member": "بارکردنی پرۆفایلی ئەندام...",
    "access.denied": "دەستگەیشتن ڕەتکرایەوە",
    "verification.failed":
      "پشتڕاستکردنەوەی کارت سەرکەوتوو نەبوو. تکایە پەیوەندی بە پشتگیری بکە.",
    "secured.verified":
      "پارێزراو و پشتڕاستکراو • خزمەتگوزارییەکانی بازرگانی کاردلی",

    // Validation messages
    "validation.name.empty":
      "ناو نابێت بەتاڵ بێت و دەبێت کەمتر یان یەکسان بێت لەگەڵ 120 پیت.",
    "validation.phone.invalid":
      "شێوەی ژمارەی تەلەفۆنی عێراقی نادروستە. بەکاربهێنە: 07xxxxxxxxx یان +9647xxxxxxxxx",
    "validation.location.empty":
      "شوێن نابێت بەتاڵ بێت و دەبێت کەمتر بێت لە 200 پیت.",
    "activation.failed":
      "چالاککردن سەرکەوتوو نەبوو. تکایە دووبارە هەوڵ بدەوە یان پەیوەندی بە پشتگیری بکە.",
    "activation.success": "کارت بە سەرکەوتوویی چالاک کرا! ئاراستەکردنەوە...",
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    // Load saved language from localStorage
    const savedLang = localStorage.getItem("language") as Language;
    if (savedLang && ["en", "ar", "ku"].includes(savedLang)) {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
    // Update document direction
    document.documentElement.dir =
      lang === "ar" || lang === "ku" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  };

  const dir = language === "ar" || language === "ku" ? "rtl" : "ltr";

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  // Set initial direction
  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [dir, language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, dir, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
