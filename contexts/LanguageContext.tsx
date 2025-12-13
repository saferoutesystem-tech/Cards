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

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    home: "Home",

    // Search and Filters
    "search.placeholder": "Search by name, location, or category...",
    filters: "Filters",
    "clear.all": "Clear All",
    "filter.cities": "Cities",
    "filter.categories": "Categories",
    "filter.discount": "Discount Range",
    "filter.priority": "Priority",
    "priority.featured": "Featured",
    "priority.level": "Level",
    "results.found": "results found",
    "no.results": "No results found",
    "try.different": "Try adjusting your search or filters",

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

    // Upload Photo
    "upload.photo": "Upload Photo",
    "upload.instructions": "Click on the image to upload a new photo",
    "upload.requirements": "Max 5MB • JPG, PNG, GIF",
    "upload.error.type": "Please select an image file",
    "upload.error.size": "Image must be less than 5MB",
    "upload.error.generic": "Upload failed. Please try again.",
    expires: "Expires",

    // Profile
    "card.holder.profile": "Card Holder Profile",
    "verified.member": "Verified Member Information",
    active: "ACTIVE",
    inactive: "INACTIVE",
    expired: "EXPIRED",
    "member.id": "Member ID",
    "contact.number": "Contact Number",
    residence: "Residence",
    "account.status": "Account Status",
    "active.verified": "Active & Verified",
    "inactive.account": "Inactive Account",
    "card.expired": "Card Expired",
    "card.expired.message":
      "This card has expired. Please contact support to renew.",
    "full.access": "This member has full access to all benefits and services.",
    "contact.support.activate":
      "Please contact support to activate this account.",
    "activated.on": "Activated On",
    "expires.on": "Expires On",
    "expired.on": "Expired On",
    "expiring.soon": "Expiring Soon",
    "days.remaining": "days remaining",
    "expires.today": "Expires today",
    "loading.member": "Loading Member Profile...",
    "access.denied": "Access Denied",
    "verification.failed": "Card verification failed. Please contact support.",
    "secured.verified": "Secured & Verified • Cardly Business Services",

    // Expired Card Screen
    "card.expired.title": "Card Expired",
    "card.expired.subtitle": "This discount card has expired and needs renewal",
    "card.id": "Card ID",
    "renewal.required": "Renewal Required",
    "expired.card.message":
      "Your discount card has expired. To continue enjoying exclusive benefits and discounts, please contact our support team to renew your membership.",
    "contact.support.renewal": "Contact Support to Renew",
    "call.support": "Call Support",
    "email.support": "Email Support",
    "renewal.process.info":
      "Our support team will help you renew your card quickly. The renewal process typically takes 1-2 business days.",
    questions: "Have questions?",

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
    // Navigation
    home: "الرئيسية",

    // Search and Filters
    "search.placeholder": "البحث بالاسم أو الموقع أو الفئة...",
    filters: "التصفية",
    "clear.all": "مسح الكل",
    "filter.cities": "المدن",
    "filter.categories": "الفئات",
    "filter.discount": "نطاق الخصم",
    "filter.priority": "الأولوية",
    "priority.featured": "مميز",
    "priority.level": "المستوى",
    "results.found": "نتيجة",
    "no.results": "لا توجد نتائج",
    "try.different": "حاول تعديل البحث أو التصفية",

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

    // Upload Photo
    "upload.photo": "رفع صورة",
    "upload.instructions": "انقر على الصورة لرفع صورة جديدة",
    "upload.requirements": "الحد الأقصى 5 ميجابايت • JPG، PNG، GIF",
    "upload.error.type": "يرجى اختيار ملف صورة",
    "upload.error.size": "يجب أن تكون الصورة أقل من 5 ميجابايت",
    "upload.error.generic": "فشل الرفع. يرجى المحاولة مرة أخرى.",
    expires: "تنتهي صلاحيتها",

    // Profile
    "card.holder.profile": "ملف حامل البطاقة",
    "verified.member": "معلومات العضو الموثق",
    active: "نشط",
    inactive: "غير نشط",
    expired: "منتهي الصلاحية",
    "member.id": "معرف العضو",
    "contact.number": "رقم الاتصال",
    residence: "السكن",
    "account.status": "حالة الحساب",
    "active.verified": "نشط وموثق",
    "inactive.account": "حساب غير نشط",
    "card.expired": "البطاقة منتهية الصلاحية",
    "card.expired.message":
      "انتهت صلاحية هذه البطاقة. يرجى الاتصال بالدعم للتجديد.",
    "full.access": "هذا العضو لديه وصول كامل إلى جميع المزايا والخدمات.",
    "contact.support.activate": "يرجى الاتصال بالدعم لتفعيل هذا الحساب.",
    "activated.on": "تم التفعيل في",
    "expires.on": "تنتهي في",
    "expired.on": "انتهت في",
    "expiring.soon": "تنتهي قريباً",
    "days.remaining": "يوم متبقي",
    "expires.today": "تنتهي اليوم",
    "loading.member": "جاري تحميل ملف العضو...",
    "access.denied": "تم رفض الوصول",
    "verification.failed": "فشل التحقق من البطاقة. يرجى الاتصال بالدعم.",
    "secured.verified": "آمن وموثق • خدمات كاردلي للأعمال",

    // Expired Card Screen
    "card.expired.title": "البطاقة منتهية الصلاحية",
    "card.expired.subtitle": "انتهت صلاحية بطاقة الخصم هذه وتحتاج إلى تجديد",
    "card.id": "رقم البطاقة",
    "renewal.required": "التجديد مطلوب",
    "expired.card.message":
      "انتهت صلاحية بطاقة الخصم الخاصة بك. للاستمرار في الاستمتاع بالمزايا والخصومات الحصرية، يرجى الاتصال بفريق الدعم لتجديد عضويتك.",
    "contact.support.renewal": "اتصل بالدعم للتجديد",
    "call.support": "اتصل بالدعم",
    "email.support": "البريد الإلكتروني للدعم",
    "renewal.process.info":
      "سيساعدك فريق الدعم لدينا على تجديد بطاقتك بسرعة. تستغرق عملية التجديد عادةً من يوم إلى يومي عمل.",
    questions: "لديك أسئلة؟",

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
    // Navigation
    home: "سەرەتا",

    // Search and Filters
    "search.placeholder": "گەڕان بە ناو، شوێن، یان جۆر...",
    filters: "پاڵاوتن",
    "clear.all": "پاککردنەوەی هەموو",
    "filter.cities": "شارەکان",
    "filter.categories": "جۆرەکان",
    "filter.discount": "بواری داشکاندن",
    "filter.priority": "پێشینە",
    "priority.featured": "تایبەت",
    "priority.level": "ئاست",
    "results.found": "ئەنجام دۆزرایەوە",
    "no.results": "هیچ ئەنجامێک نەدۆزرایەوە",
    "try.different": "هەوڵبدە گەڕان یان پاڵاوتن بگۆڕیت",

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

    // Upload Photo
    "upload.photo": "وەرگرتنی وێنە",
    "upload.instructions": "کلیک لەسەر وێنە بکە بۆ وەرگرتنی وێنەیەکی نوێ",
    "upload.requirements": "زۆرترین قەبارە 5MB • JPG، PNG، GIF",
    "upload.error.type": "تکایە فایلێکی وێنە هەڵبژێرە",
    "upload.error.size": "وێنەکە دەبێت کەمتر بێت لە 5MB",
    "upload.error.generic": "وەرگرتن سەرکەوتوو نەبوو. تکایە دووبارە هەوڵبدە.",
    expires: "دەرچوون",

    // Profile
    "card.holder.profile": "پرۆفایلی هەڵگری کارت",
    "verified.member": "زانیاری ئەندامی پشتڕاستکراو",
    active: "چالاک",
    inactive: "ناچالاک",
    expired: "بەسەرچووە",
    "member.id": "ناسنامەی ئەندام",
    "contact.number": "ژمارەی پەیوەندی",
    residence: "نیشتەجێبوون",
    "account.status": "دۆخی هەژمار",
    "active.verified": "چالاک و پشتڕاستکراو",
    "inactive.account": "هەژماری ناچالاک",
    "card.expired": "کارت بەسەرچووە",
    "card.expired.message":
      "ئەم کارتە بەسەرچووە. تکایە پەیوەندی بە پشتگیری بکە بۆ نوێکردنەوە.",
    "full.access":
      "ئەم ئەندامە دەستگەیشتنی تەواوی هەیە بۆ هەموو سوود و خزمەتگوزارییەکان.",
    "contact.support.activate":
      "تکایە پەیوەندی بە پشتگیری بکە بۆ چالاککردنی ئەم هەژمارە.",
    "activated.on": "چالاککرا لە",
    "expires.on": "بەسەردەچێت لە",
    "expired.on": "بەسەرچوو لە",
    "expiring.soon": "بەم زووانە بەسەردەچێت",
    "days.remaining": "ڕۆژ ماوە",
    "expires.today": "ئەمڕۆ بەسەردەچێت",
    "loading.member": "بارکردنی پرۆفایلی ئەندام...",
    "access.denied": "دەستگەیشتن ڕەتکرایەوە",
    "verification.failed":
      "پشتڕاستکردنەوەی کارت سەرکەوتوو نەبوو. تکایە پەیوەندی بە پشتگیری بکە.",
    "secured.verified":
      "پارێزراو و پشتڕاستکراو • خزمەتگوزارییەکانی بازرگانی کاردلی",

    // Expired Card Screen
    "card.expired.title": "کارت بەسەرچووە",
    "card.expired.subtitle":
      "ئەم کارتە داشکاندنە بەسەرچووە و پێویستی بە نوێکردنەوەیە",
    "card.id": "ژمارەی کارت",
    "renewal.required": "نوێکردنەوە پێویستە",
    "expired.card.message":
      "کارتی داشکاندنەکەت بەسەرچووە. بۆ بەردەوامبوون لە چێژوەرگرتن لە سوود و داشکاندنە تایبەتەکان، تکایە پەیوەندی بە تیمی پشتگیریمان بکە بۆ نوێکردنەوەی ئەندامێتیت.",
    "contact.support.renewal": "پەیوەندی بە پشتگیری بکە بۆ نوێکردنەوە",
    "call.support": "پەیوەندی بە پشتگیری",
    "email.support": "ئیمەیڵی پشتگیری",
    "renewal.process.info":
      "تیمی پشتگیریمان یارمەتیت دەدات بە خێرایی کارتەکەت نوێ بکەیتەوە. پرۆسەی نوێکردنەوە بە شێوەیەکی ئاسایی ١-٢ ڕۆژی کار دەخایەنێت.",
    questions: "پرسیارت هەیە؟",

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
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("language") as Language;
      if (saved && ["en", "ar", "ku"].includes(saved)) {
        return saved;
      }
    }
    return "en";
  });

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
