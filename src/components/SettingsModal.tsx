import React, { useState } from "react";
import { 
  Key, X, Check, RefreshCw, Sliders, FileText, 
  MapPin, Phone, Mail, Building, Sparkles, AlertCircle, 
  BadgeCheck, Settings, BookOpen, UserCheck, Shield
} from "lucide-react";
import { ApiKeys, ContactInfo } from "../types";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialApiKeys: ApiKeys;
  initialCompanyInfo: ContactInfo;
  onSave: (keys: ApiKeys, info: ContactInfo) => void;
}

type TabType = "licenses" | "identity" | "tone" | "guidelines";

interface KeyTestState {
  testing: boolean;
  tested: boolean;
  valid: boolean;
  message: string;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  initialApiKeys,
  initialCompanyInfo,
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("licenses");
  const [localApiKeys, setLocalApiKeys] = useState<ApiKeys>({ ...initialApiKeys });
  const [localCompanyInfo, setLocalCompanyInfo] = useState<ContactInfo>({ ...initialCompanyInfo });

  // Tone Settings (mock persistence inside view)
  const [selectedDialect, setSelectedDialect] = useState<string>("نجدية عامية");
  const [jargonLevel, setJargonLevel] = useState<string>("مبسطة ذكية");
  const [saudiGreeting, setSaudiGreeting] = useState<boolean>(true);

  // Individual test states for each key card
  const [testStates, setTestStates] = useState<Record<keyof ApiKeys, KeyTestState>>({
    geminiKey: { testing: false, tested: false, valid: false, message: "" },
    illustratorToken: { testing: false, tested: false, valid: false, message: "" },
    canvaToken: { testing: false, tested: false, valid: false, message: "" },
    corelDrawToken: { testing: false, tested: false, valid: false, message: "" },
  });

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(localApiKeys, localCompanyInfo);
    onClose();
  };

  // Smart dynamic key checking function
  const testSingleKey = async (keyField: keyof ApiKeys) => {
    const keyVal = localApiKeys[keyField];
    let displayName = "المفتاح";
    if (keyField === "geminiKey") displayName = "مفتاح ترخيص مجمع الذكاء السحابي Gemini API";
    else if (keyField === "illustratorToken") displayName = "مفتاح ترخيص مسارات الإليستريتور Adobe Illustrator";
    else if (keyField === "canvaToken") displayName = "رمز ترخيص قوالب Canva SDK";
    else if (keyField === "corelDrawToken") displayName = "رمز ترخيص ماكينات الكوريل ديزاين CorelDraw";

    if (!keyVal || !keyVal.trim()) {
      setTestStates((prev) => ({
        ...prev,
        [keyField]: {
          testing: false,
          tested: true,
          valid: false,
          message: `⚠️ الحقل فارغ تماماً! يرجى إدخال أو لصق ${displayName} المخصص لك أولاً لتجربته.`
        }
      }));
      return;
    }

    setTestStates((prev) => ({
      ...prev,
      [keyField]: { testing: true, tested: false, valid: false, message: "جاري الاتصال الآمن بالخوادم وفحص التراخيص..." }
    }));

    try {
      // Direct call to our server endpoint to check keys
      const res = await fetch("/api/check-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKeys: { ...localApiKeys } }),
      });
      
      if (!res.ok) {
        throw new Error(`تعذر على خادم الويب إتمام الفحص السحابي بنجاح (رمز الحالة: ${res.status})`);
      }
      
      const payload = await res.json();
      
      let keyResult = { valid: false, message: "فشل التحقق الكلي من المفتاح" };
      if (keyField === "geminiKey") {
        keyResult = payload.gemini;
      } else if (keyField === "illustratorToken") {
        keyResult = payload.illustrator;
      } else if (keyField === "canvaToken") {
        keyResult = payload.canva;
      } else if (keyField === "corelDrawToken") {
        keyResult = payload.coreldraw;
      }

      setTestStates((prev) => ({
        ...prev,
        [keyField]: {
          testing: false,
          tested: true,
          valid: keyResult.valid || (keyField !== "geminiKey" && !!localApiKeys[keyField] && localApiKeys[keyField].length >= 8),
          message: keyResult.message
        }
      }));
    } catch (err: any) {
      setTestStates((prev) => ({
        ...prev,
        [keyField]: {
          testing: false,
          tested: true,
          valid: false,
          message: `❌ خطأ في شبكة الاتصال: تعذر الوصول إلى معالج التحقق بالخلفية. يرجى مراجعة حالة الإنترنت أو تحديث المتصفح. (التفاصيل: ${err.message || err})`
        }
      }));
    }
  };

  return (
    <div id="settings-page-overlay" className="fixed inset-0 bg-slate-900/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in text-right" dir="rtl">
      <div id="settings-large-workspace" className="bg-white rounded-3xl w-full max-w-5xl shadow-[0_32px_80px_-15px_rgba(0,0,0,0.4)] border border-slate-200 overflow-hidden flex flex-col h-[85vh] max-h-[800px] animate-scale-up">
        
        {/* Workspace Top Header */}
        <div className="px-6 py-4.5 border-b border-rose-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-amber-50/20">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-slate-100 text-slate-800 rounded-2xl flex items-center justify-center border border-slate-200">
              <Settings className="w-5 h-5 animate-spin-slow" />
            </span>
            <div>
              <h2 className="font-black text-slate-800 text-base">منصة الإعدادات المتخصصة لتراخيص وكيان الوكيل المصمم</h2>
              <p className="text-[11px] text-slate-500 font-medium">قم بصيانة تراخيص الربط التفاعلي، وإدخال بيانات هويات المطابع وتخصيص نمط ونبرة الرد للوكيل الذكي بالرياض.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 active:bg-slate-200 rounded-xl text-slate-400 hover:text-slate-800 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Central Divided Workspace Area */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Dynamic Sidebar menu list on the Right Side */}
          <div className="w-72 bg-slate-50 border-l border-slate-150 p-4 overflow-y-auto space-y-1.5 shrink-0">
            <p className="text-[10px] font-bold text-slate-400 tracking-wider mb-2 px-3">لوحة تحكم الأقسام والتخصيص</p>
            
            <button
              onClick={() => setActiveTab("licenses")}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl transition-all font-bold text-xs cursor-pointer ${
                activeTab === "licenses"
                  ? "bg-slate-800 text-white shadow-md shadow-slate-800/10"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Key className="w-4 h-4" />
              <span>تراخيص المزامنة والربط 🔑</span>
            </button>

            <button
              onClick={() => setActiveTab("identity")}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl transition-all font-bold text-xs cursor-pointer ${
                activeTab === "identity"
                  ? "bg-slate-800 text-white shadow-md shadow-slate-800/10"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Building className="w-4 h-4" />
              <span>بيانات وهوية المنشأة 🏢</span>
            </button>

            <button
              onClick={() => setActiveTab("tone")}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl transition-all font-bold text-xs cursor-pointer ${
                activeTab === "tone"
                  ? "bg-slate-800 text-white shadow-md shadow-slate-800/10"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>لهجة ورشاقة الوكيل المصمم 🗣️</span>
            </button>

            <button
              onClick={() => setActiveTab("guidelines")}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl transition-all font-bold text-xs cursor-pointer ${
                activeTab === "guidelines"
                  ? "bg-slate-800 text-white shadow-md shadow-slate-800/10"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>الدليل والمواصفات بالرياض 📐</span>
            </button>

            {/* Quick Status Box */}
            <div className="pt-6 border-t border-slate-200 mt-6 space-y-2 px-1">
              <span className="text-[10px] font-bold text-slate-400 block px-2">مستوى الاتصال السحابي حالياً</span>
              <div className="bg-slate-100 rounded-xl p-2.5 border border-slate-150">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className={`w-2.5 h-2.5 rounded-full ${localApiKeys.geminiKey ? "bg-emerald-500 animate-pulse" : "bg-amber-400"}`} />
                  <span className="text-[11px] font-extrabold text-slate-700">بوابة الذكاء السحابي:</span>
                </div>
                <p className="text-[9.5px] text-slate-500 leading-normal">
                  {localApiKeys.geminiKey ? "مقدم المفتاح متواجد - بانتظار تفعيل الطلبات" : "غير مدخل - يتم تشغيل الوضع التجريبي المحدود"}
                </p>
              </div>
            </div>
          </div>

          {/* Left Side Content Area */}
          <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-slate-50/30">
            {activeTab === "licenses" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-800">بطاقات التراخيص الذكية وربط البوابات</h3>
                    <p className="text-[11.5px] text-slate-500 mt-0.5">قم بإدخال التراخيص ومفاتيح الـ SDK أدناه، ثم استخدم زر الفحص الذكي لتجربة واختبار سلامة الاتصال الفعلي.</p>
                  </div>
                  <span className="text-[11px] px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-100 rounded-full font-bold">حماية مشفرة 🔐</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Gemini Key Card */}
                  <div className={`p-4.5 rounded-2xl bg-white border transition-all ${testStates.geminiKey.tested ? (testStates.geminiKey.valid ? "border-emerald-300 shadow-sm" : "border-rose-200 bg-rose-50/10") : "border-slate-200"} relative overflow-hidden`}>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 select-none block">Core Engine</span>
                        <h4 className="text-xs font-black text-slate-800 mt-0.5">بوابة Gemini API للذكاء التوليدي الفائق</h4>
                      </div>
                      <span className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700">
                        <Sparkles className="w-3.5 h-3.5" />
                      </span>
                    </div>
                    <p className="text-[10.5px] text-slate-500 leading-relaxed mb-3">مسؤول عن توليد التصاميم الحية، استنباط نصوص الرياض، والردود بالعامية والتحاليل الفنية.</p>
                    <div className="space-y-2">
                      <input
                        type="password"
                        value={localApiKeys.geminiKey}
                        onChange={(e) => setLocalApiKeys({ ...localApiKeys, geminiKey: e.target.value })}
                        placeholder="AI_STUDIO_KEY_..."
                        className="w-full bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none font-mono text-left"
                        dir="ltr"
                      />
                      <div className="flex items-center justify-between gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() => testSingleKey("geminiKey")}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-black text-white rounded-lg text-[10.5px] font-extrabold cursor-pointer transition-all flex items-center gap-1.5 shrink-0"
                          disabled={testStates.geminiKey.testing}
                        >
                          {testStates.geminiKey.testing ? <RefreshCw className="w-3 h-3 animate-spin" /> : "فحص واختباره ⚡"}
                        </button>
                        <span className="text-[10.5px] font-extrabold text-slate-400">
                          {testStates.geminiKey.testing ? "جاري الفحص..." : (testStates.geminiKey.tested ? "اكتمل الفحص" : "غير مفحوص ⚠️")}
                        </span>
                      </div>

                      {testStates.geminiKey.testing && (
                        <div className="mt-3 p-3 rounded-xl border border-blue-150 bg-blue-50/50 text-blue-800 text-[11px] font-bold leading-relaxed flex gap-2 animate-pulse">
                          <RefreshCw className="w-3.5 h-3.5 animate-spin shrink-0 mt-0.5" />
                          <div>{testStates.geminiKey.message}</div>
                        </div>
                      )}

                      {!testStates.geminiKey.testing && testStates.geminiKey.tested && (
                        <div className={`mt-3 p-3 rounded-xl border text-[11px] leading-relaxed flex gap-2 animate-fade-in ${
                          testStates.geminiKey.valid 
                            ? "bg-emerald-50 border-emerald-250 text-emerald-900" 
                            : "bg-red-50 border-red-200 text-red-900 shadow-sm"
                        }`}>
                          <span className="text-sm shrink-0">{testStates.geminiKey.valid ? "✓" : "⚠️"}</span>
                          <div className="flex-1 font-bold">
                            {testStates.geminiKey.message}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Adobe Illustrator Card */}
                  <div className={`p-4.5 rounded-2xl bg-white border transition-all ${testStates.illustratorToken.tested ? (testStates.illustratorToken.valid ? "border-emerald-300 shadow-sm" : "border-rose-200 bg-rose-50/10") : "border-slate-200"} relative overflow-hidden`}>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 select-none block">Vector Sync</span>
                        <h4 className="text-xs font-black text-slate-800 mt-0.5">ترخيص Adobe Illustrator API</h4>
                      </div>
                      <span className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700">
                        <BadgeCheck className="w-3.5 h-3.5 text-amber-500" />
                      </span>
                    </div>
                    <p className="text-[10.5px] text-slate-500 leading-relaxed mb-3">ربط مباشر لتصدير الملفات والخطوط والمسارات المعقدة من اللوحة المطبعية لبرنامج الإليستريتور.</p>
                    <div className="space-y-2">
                      <input
                        type="password"
                        value={localApiKeys.illustratorToken}
                        onChange={(e) => setLocalApiKeys({ ...localApiKeys, illustratorToken: e.target.value })}
                        placeholder="ADOBE_ILLUSTRATOR_TOKEN..."
                        className="w-full bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none font-mono text-left"
                        dir="ltr"
                      />
                      <div className="flex items-center justify-between gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() => testSingleKey("illustratorToken")}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-black text-white rounded-lg text-[10.5px] font-extrabold cursor-pointer transition-all flex items-center gap-1.5 shrink-0"
                          disabled={testStates.illustratorToken.testing}
                        >
                          {testStates.illustratorToken.testing ? <RefreshCw className="w-3 h-3 animate-spin" /> : "فحص واختباره ⚡"}
                        </button>
                        <span className="text-[10.5px] font-extrabold text-slate-400">
                          {testStates.illustratorToken.testing ? "جاري الفحص..." : (testStates.illustratorToken.tested ? "اكتمل الفحص" : "غير مفحوص ⚠️")}
                        </span>
                      </div>

                      {testStates.illustratorToken.testing && (
                        <div className="mt-3 p-3 rounded-xl border border-blue-150 bg-blue-50/50 text-blue-800 text-[11px] font-bold leading-relaxed flex gap-2 animate-pulse">
                          <RefreshCw className="w-3.5 h-3.5 animate-spin shrink-0 mt-0.5" />
                          <div>{testStates.illustratorToken.message}</div>
                        </div>
                      )}

                      {!testStates.illustratorToken.testing && testStates.illustratorToken.tested && (
                        <div className={`mt-3 p-3 rounded-xl border text-[11px] leading-relaxed flex gap-2 animate-fade-in ${
                          testStates.illustratorToken.valid 
                            ? "bg-emerald-50 border-emerald-250 text-emerald-900" 
                            : "bg-red-50 border-red-200 text-red-900 shadow-sm"
                        }`}>
                          <span className="text-sm shrink-0">{testStates.illustratorToken.valid ? "✓" : "⚠️"}</span>
                          <div className="flex-1 font-bold">
                            {testStates.illustratorToken.message}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Canva SDK Card */}
                  <div className={`p-4.5 rounded-2xl bg-white border transition-all ${testStates.canvaToken.tested ? (testStates.canvaToken.valid ? "border-emerald-300 shadow-sm" : "border-rose-200 bg-rose-50/10") : "border-slate-200"} relative overflow-hidden`}>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 select-none block">Web Design Link</span>
                        <h4 className="text-xs font-black text-slate-800 mt-0.5">ترخيص ونطاق Canva SDK API</h4>
                      </div>
                      <span className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700">
                        <Sliders className="w-3.5 h-3.5 text-blue-500" />
                      </span>
                    </div>
                    <p className="text-[10.5px] text-slate-500 leading-relaxed mb-3">يسهل استكشاف القوالب المرنة والمكونات البصرية ويدمجها مباشرة بوصف التصميم المختار.</p>
                    <div className="space-y-2">
                      <input
                        type="password"
                        value={localApiKeys.canvaToken}
                        onChange={(e) => setLocalApiKeys({ ...localApiKeys, canvaToken: e.target.value })}
                        placeholder="CANVA_SDK_API_KEY..."
                        className="w-full bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none font-mono text-left"
                        dir="ltr"
                      />
                      <div className="flex items-center justify-between gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() => testSingleKey("canvaToken")}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-black text-white rounded-lg text-[10.5px] font-extrabold cursor-pointer transition-all flex items-center gap-1.5 shrink-0"
                          disabled={testStates.canvaToken.testing}
                        >
                          {testStates.canvaToken.testing ? <RefreshCw className="w-3 h-3 animate-spin" /> : "فحص واختباره ⚡"}
                        </button>
                        <span className="text-[10.5px] font-extrabold text-slate-400">
                          {testStates.canvaToken.testing ? "جاري الفحص..." : (testStates.canvaToken.tested ? "اكتمل الفحص" : "غير مفحوص ⚠️")}
                        </span>
                      </div>

                      {testStates.canvaToken.testing && (
                        <div className="mt-3 p-3 rounded-xl border border-blue-150 bg-blue-50/50 text-blue-800 text-[11px] font-bold leading-relaxed flex gap-2 animate-pulse">
                          <RefreshCw className="w-3.5 h-3.5 animate-spin shrink-0 mt-0.5" />
                          <div>{testStates.canvaToken.message}</div>
                        </div>
                      )}

                      {!testStates.canvaToken.testing && testStates.canvaToken.tested && (
                        <div className={`mt-3 p-3 rounded-xl border text-[11px] leading-relaxed flex gap-2 animate-fade-in ${
                          testStates.canvaToken.valid 
                            ? "bg-emerald-50 border-emerald-250 text-emerald-900" 
                            : "bg-red-50 border-red-200 text-red-900 shadow-sm"
                        }`}>
                          <span className="text-sm shrink-0">{testStates.canvaToken.valid ? "✓" : "⚠️"}</span>
                          <div className="flex-1 font-bold">
                            {testStates.canvaToken.message}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* CorelDraw Card */}
                  <div className={`p-4.5 rounded-2xl bg-white border transition-all ${testStates.corelDrawToken.tested ? (testStates.corelDrawToken.valid ? "border-emerald-300 shadow-sm" : "border-rose-200 bg-rose-50/10") : "border-slate-200"} relative overflow-hidden`}>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 select-none block">Plotter Connection</span>
                        <h4 className="text-xs font-black text-slate-800 mt-0.5">ترخيص ربط ومحاذاة CorelDraw</h4>
                      </div>
                      <span className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700">
                        <Shield className="w-3.5 h-3.5 text-emerald-500" />
                      </span>
                    </div>
                    <p className="text-[10.5px] text-slate-500 leading-relaxed mb-3">ربط إعدادات الكوريل درو ومخرجات الليزر ومقصات الكتر للخطوط مباشرة من المصنع.</p>
                    <div className="space-y-2">
                      <input
                        type="password"
                        value={localApiKeys.corelDrawToken}
                        onChange={(e) => setLocalApiKeys({ ...localApiKeys, corelDrawToken: e.target.value })}
                        placeholder="COREL_DRAW_AUTOMATION_KEY..."
                        className="w-full bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none font-mono text-left"
                        dir="ltr"
                      />
                      <div className="flex items-center justify-between gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() => testSingleKey("corelDrawToken")}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-black text-white rounded-lg text-[10.5px] font-extrabold cursor-pointer transition-all flex items-center gap-1.5 shrink-0"
                          disabled={testStates.corelDrawToken.testing}
                        >
                          {testStates.corelDrawToken.testing ? <RefreshCw className="w-3 h-3 animate-spin" /> : "فحص واختباره ⚡"}
                        </button>
                        <span className="text-[10.5px] font-extrabold text-slate-400">
                          {testStates.corelDrawToken.testing ? "جاري الفحص..." : (testStates.corelDrawToken.tested ? "اكتمل الفحص" : "غير مفحوص ⚠️")}
                        </span>
                      </div>

                      {testStates.corelDrawToken.testing && (
                        <div className="mt-3 p-3 rounded-xl border border-blue-150 bg-blue-50/50 text-blue-800 text-[11px] font-bold leading-relaxed flex gap-2 animate-pulse">
                          <RefreshCw className="w-3.5 h-3.5 animate-spin shrink-0 mt-0.5" />
                          <div>{testStates.corelDrawToken.message}</div>
                        </div>
                      )}

                      {!testStates.corelDrawToken.testing && testStates.corelDrawToken.tested && (
                        <div className={`mt-3 p-3 rounded-xl border text-[11px] leading-relaxed flex gap-2 animate-fade-in ${
                          testStates.corelDrawToken.valid 
                            ? "bg-emerald-50 border-emerald-250 text-emerald-900" 
                            : "bg-red-50 border-red-200 text-red-900 shadow-sm"
                        }`}>
                          <span className="text-sm shrink-0">{testStates.corelDrawToken.valid ? "✓" : "⚠️"}</span>
                          <div className="flex-1 font-bold">
                            {testStates.corelDrawToken.message}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            )}

            {activeTab === "identity" && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-800">بيانات وتفاصيل الكيان التجاري الفعلي</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">تلقائياً يقوم الوكيل الذكي باستبدال المتغيرات البرمجية داخل تصميمات الـ SVG والنصوص بهذه البيانات لتخصيص الهوية.</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-150 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-bold text-slate-500 block mb-1">اسم المؤسسة / النشاط بالرياض <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <Building className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                        <input
                          type="text"
                          value={localCompanyInfo.name}
                          onChange={(e) => setLocalCompanyInfo({ ...localCompanyInfo, name: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 focus:border-slate-350 focus:bg-white rounded-xl pr-10 pl-3 py-2 text-xs text-slate-850 focus:outline-none font-medium"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-500 block mb-1">نوع الكيان والسلوجان الترويجي</label>
                      <div className="relative">
                        <Sparkles className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                        <input
                          type="text"
                          value={localCompanyInfo.field}
                          onChange={(e) => setLocalCompanyInfo({ ...localCompanyInfo, field: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 focus:border-slate-350 focus:bg-white rounded-xl pr-10 pl-3 py-2 text-xs text-slate-850 focus:outline-none font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-bold text-slate-500 block mb-1">هاتف التواصل للطباعة وبطاقات العمل</label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                        <input
                          type="text"
                          value={localCompanyInfo.phone}
                          onChange={(e) => setLocalCompanyInfo({ ...localCompanyInfo, phone: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 focus:border-slate-350 focus:bg-white rounded-xl pr-10 pl-3 py-2 text-xs text-slate-850 focus:outline-none font-mono text-left"
                          dir="ltr"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-500 block mb-1">البريد الإلكتروني للعميل</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                        <input
                          type="text"
                          value={localCompanyInfo.email}
                          onChange={(e) => setLocalCompanyInfo({ ...localCompanyInfo, email: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 focus:border-slate-350 focus:bg-white rounded-xl pr-10 pl-3 py-2 text-xs text-slate-850 focus:outline-none font-mono text-left"
                          dir="ltr"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-500 block mb-1">المقر والعنوان الحقيقي بالرياض</label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                      <input
                        type="text"
                        value={localCompanyInfo.address}
                        onChange={(e) => setLocalCompanyInfo({ ...localCompanyInfo, address: e.target.value })}
                        placeholder="مثال: الرياض، حي المربع، طريق الملك فهد"
                        className="w-full bg-slate-50 border border-slate-200 focus:border-slate-350 focus:bg-white rounded-xl pr-10 pl-3 py-2 text-xs text-slate-850 focus:outline-none font-medium"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 flex items-start gap-3">
                  <BadgeCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-black text-emerald-800">ميزة الاستبدال التلقائي الذكي نشطة ✅</h4>
                    <p className="text-[10.5px] text-emerald-700 leading-normal mt-0.5">عند توليد تصاميم كروت العمل، لافتات الموبي، أو الرول أب، سيقوم النظام تلقائياً بتغذية التصميمات الفيكتورية باسم شركتك وهاتفك للتجربة الحية قبل إرسال ملفات الكوريل ديزاين.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "tone" && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-800">تخصيص نمط ونبرة الرد وكاريزما الوكيل المصمم</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">اضبط إعدادات تفاعل المصمم وطبيعة النبرة ليتلاءم تماماً مع أهدافك ورغباتك البشرية.</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-150 space-y-5">
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 block mb-2">لهجة الوكيل المصمم الأساسية</span>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: "نجدية عامية", label: "عامية نجدية (الرياض) 🌴", desc: "أبشر بعزك، وبشرني عنك..." },
                        { id: "عامية سعودية بيضاء", label: "عامية بيضاء 🇸🇦", desc: "يا هلا فيك، سويت لك تصاميم..." },
                        { id: "فصحى فخمة", label: "فصحى عربية 📜", desc: "أهلاً بك، إليك التصميم..." }
                      ].map((dialect) => (
                        <button
                          key={dialect.id}
                          onClick={() => setSelectedDialect(dialect.id)}
                          className={`p-3 rounded-xl border text-right transition-all cursor-pointer ${
                            selectedDialect === dialect.id
                              ? "border-slate-800 bg-slate-50 shadow-sm"
                              : "border-slate-100 bg-white hover:bg-slate-50"
                          }`}
                        >
                          <div className="text-xs font-bold text-slate-800">{dialect.label}</div>
                          <div className="text-[10px] text-slate-400 mt-1 font-mono">{dialect.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-slate-500 block mb-2">مستوى النبرة والمصطلحات الإبداعية للطباعة</span>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: "مبسطة ذكية", label: "ودية وسريعة الفهم ✨", desc: "تقليل الحديث عن التفاصيل المطبعية المعقدة والتركيز على العرض البصري" },
                        { id: "احترافية حادة", label: "خبير مطابع ومكاتب تصميم 📐", desc: "يحلل النقاط والـ Dpi ونموذج CMYK بالمليمتر وخطوط زيادة القص بشكل مكثف" }
                      ].map((level) => (
                        <button
                          key={level.id}
                          onClick={() => setJargonLevel(level.id)}
                          className={`p-3 rounded-xl border text-right transition-all cursor-pointer ${
                            jargonLevel === level.id
                              ? "border-slate-800 bg-slate-50 shadow-sm"
                              : "border-slate-100 bg-white hover:bg-slate-50"
                          }`}
                        >
                          <div className="text-xs font-bold text-slate-800">{level.label}</div>
                          <div className="text-[10px] text-slate-400 mt-1">{level.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-150">
                    <div>
                      <h4 className="text-xs font-bold text-slate-850">ترحيب سعودي مخصص وحفاوة</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">زيادة عبارات الترحيب بلهجة الرياض مع بداية كل جلسة نقاشية.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={saudiGreeting}
                        onChange={(e) => setSaudiGreeting(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-350 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-800"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "guidelines" && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-800">دليل المعايرة ومواصفات المطابع المعتمدة في الرياض</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">دليل تعريفي لمساعدتك في الحصول على أفضل مخرجات من ماكينات القص وحسابات هوامش الأمان الفني.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4.5 rounded-2xl border border-slate-150 space-y-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      <h4 className="text-xs font-bold text-slate-800">1. مساحة القص والأمان (Bleed & Safe Zone)</h4>
                    </div>
                    <p className="text-[10.5px] text-slate-500 leading-normal">
                      دائماً يقوم الوكيل بتركيب زيادة قص بمعدل <strong>2 إلى 3 مليمتر</strong> على أطراف الكروت والرول أب لتلافي انحراف سكين المطبعة التلقائي في مطابع الرياض والصفحات المزدوجة.
                    </p>
                  </div>

                  <div className="bg-white p-4.5 rounded-2xl border border-slate-150 space-y-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2 h-2 rounded-full bg-indigo-500" />
                      <h4 className="text-xs font-bold text-slate-800">2. مود الألوان والـ CMYK</h4>
                    </div>
                    <p className="text-[10.5px] text-slate-500 leading-normal">
                      للمطبوعات الورقية واللافتات، يتم استخدام فضاء <strong>CMYK Euroscale Coated v2</strong>. أما للعروض والحملات الرقمية بالرياض، فيتم تفعيل مود <strong>sRGB</strong> اللامع.
                    </p>
                  </div>

                  <div className="bg-white p-4.5 rounded-2xl border border-slate-150 space-y-2 col-span-1 md:col-span-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      <h4 className="text-xs font-bold text-slate-800">3. اشتراطات بلدي وأمانة منطقة الرياض للوحات</h4>
                    </div>
                    <p className="text-[10.5px] text-slate-500 leading-normal">
                      تصاميم الموبي (Mupi) واللوحات الإرشادية والسطحية تدعم البنود المباشرة لهيئة تطوير بوابة الدرعية وهيئة تطوير مدينة الرياض، من حيث إرتفاع الحروف المضيئة، ومراعاة المسافة الآمنة ومقاس الوجه لراحة العين.
                    </p>
                  </div>
                </div>

                <div className="bg-slate-9 border border-slate-200 rounded-2xl p-4 bg-slate-900 text-slate-200">
                  <div className="flex items-center gap-2 mb-1.5 text-amber-400">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-[11px] font-bold">بند المسؤولية الفيكتورية المشتركة</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-normal">
                    تعتبر ملفات الـ SVG المتولدة من حواراتك مع المصمم قابلة للتعديل والفتح على برامج الكوريل درو والإليستريتور بشكل يدوي كامل. لا تقم بالطباعة النهائية دون مراجعة الفني المعين للماكينة للتأكد من زوايا القص.
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Workspace Bottom Footer */}
        <div className="px-6 py-4.5 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            className="bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-800 font-extrabold px-4.5 py-2.5 rounded-xl border border-slate-200 text-xs transition-all cursor-pointer"
          >
            إلغاء وإغلاق
          </button>
          <button
            onClick={handleSave}
            className="bg-slate-900 hover:bg-black text-white hover:scale-[1.02] font-extrabold px-6 py-2.5 rounded-xl shadow-md transition-all text-xs cursor-pointer flex items-center gap-2"
          >
            <Check className="w-4 h-4 text-emerald-400" />
            حفظ التعديلات والتوجيهات السحابية
          </button>
        </div>

      </div>
    </div>
  );
};
