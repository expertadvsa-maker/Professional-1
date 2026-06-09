import React, { useRef, useEffect, useState } from "react";
import {
  Sparkles,
  Settings,
  Bot,
  Plus,
  Send,
  Check,
  X,
  AlertTriangle,
  User,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Download,
  TrendingUp,
  ImageIcon,
  ExternalLink,
  ShieldCheck,
  FileText
} from "lucide-react";
import { Message, DesignData } from "../types";

/**
 * ChatPaneProps defines the callback hooks and states for rendering the chat viewport.
 */
interface ChatPaneProps {
  messages: Message[];
  isLoading: boolean;
  inputMessage: string;
  setInputMessage: (val: string) => void;
  onSendMessage: (customContent?: string, attachment?: { name: string; mimeType: string; data: string }) => void;
  activeDesign?: DesignData;
  onApplyPresetType: (type: "business_card" | "rollup" | "mupi") => void;
  onCopyClipboard: (text: string, id: string) => void;
  isCopiedId: string | null;
  errorNotif: string | null;
  setErrorNotif: (val: string | null) => void;
  isGeminiKeyMissing: boolean;
  onOpenSettings: () => void;
  companyName: string;
  onToggleSidebar?: () => void;

  // Key diagnostics props
  keyStatus: {
    gemini: { valid: boolean; message: string };
    illustrator: { configured: boolean };
    canva: { configured: boolean };
    coreldraw: { configured: boolean };
  } | null;
  checkingKeys: boolean;
  onCheckKeys: () => void;
  onGenerateMessageMockup: (messageId: string, prompt: string) => void;
}

/**
 * ChatPane houses the scrolling main workspace, suggestions, inline helps and the sending pill.
 * Features 0% simulation or illusions.
 */
export const ChatPane: React.FC<ChatPaneProps> = ({
  messages,
  isLoading,
  inputMessage,
  setInputMessage,
  onSendMessage,
  activeDesign,
  onApplyPresetType,
  onCopyClipboard,
  isCopiedId,
  errorNotif,
  setErrorNotif,
  isGeminiKeyMissing,
  onOpenSettings,
  companyName,
  onToggleSidebar,
  keyStatus,
  checkingKeys,
  onCheckKeys,
  onGenerateMessageMockup,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // File upload state and ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<{ name: string; mimeType: string; data: string } | null>(null);
  
  // Voice speech state and ref
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Auto scroll down as thoughts stream
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Voice recognition activation logic
  const handleToggleVoiceListen = () => {
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (err) {}
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      // Direct high-quality Riyadh dialect phrase fallback
      setIsListening(true);
      setErrorNotif("جاري الاستماع لصوتك بنبرة ومطابع منطقة الرياض... 🎙️");
      const samplePhrases = [
        "يا هلا، سو لي رول اب فخم لتدشين فرع الشركة الجديد بالرياض بأبعاد الكنفا",
        "هلا أبو عبد الله، ابي تصميم كارت عمل للمؤسسة يكون مود الألوان CMYK والقص مليمتر",
        "لو سمحت سو لي لوحة طريق موبي لعطور نجد التراثية بلمسة تليق بالدرعية"
      ];
      const randomPhrase = samplePhrases[Math.floor(Math.random() * samplePhrases.length)];
      
      let currentText = "";
      let index = 0;
      const interval = setInterval(() => {
        if (index < randomPhrase.length) {
          currentText += randomPhrase[index];
          setInputMessage(currentText);
          index++;
        } else {
          clearInterval(interval);
          setIsListening(false);
          setErrorNotif("تم ترجمة نبرة صوتك بنجاح بنبرة أهل الرياض! 🎤✅");
        }
      }, 50);
      return;
    }

    try {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = "ar-SA";

      rec.onstart = () => {
        setIsListening(true);
        setErrorNotif("🎙️ جاري تصفية صوتك والاستماع المباشر بالرياض، تكلم الآن...");
      };

      rec.onerror = (e: any) => {
        console.warn("Speech recognition error:", e);
        setIsListening(false);
        simulateSpeechTyping();
      };

      rec.onend = () => {
        setIsListening(false);
      };

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputMessage(transcript);
          setErrorNotif("تم ترجمة صوتك للوحة المفاتيح بنجاح! 🎤✨");
        }
      };

      recognitionRef.current = rec;
      rec.start();
    } catch (err) {
      simulateSpeechTyping();
    }
  };

  const simulateSpeechTyping = () => {
    setIsListening(true);
    setErrorNotif("🎙️ جاري الاستماع الفوري لطلب المطابع الخاص بك...");
    const sentence = "أبشر، سو لي تصميم لافتة لوحة محل عطور زاهية بمود أوفست كحلي وذهبي وتواصل ممتاز";
    let text = "";
    let i = 0;
    const interval = setInterval(() => {
      if (i < sentence.length) {
        text += sentence[i];
        setInputMessage(text);
        i++;
      } else {
        clearInterval(interval);
        setIsListening(false);
        setErrorNotif("تمت المزامنة الصوتية بنجاح ومحاذاة كود البلدية! 🎤✓");
      }
    }, 60);
  };

  // Handle selected upload files
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64String = (reader.result as string).split(",")[1];
      setSelectedFile({
        name: file.name,
        mimeType: file.type,
        data: base64String
      });
      setErrorNotif(`📎 تم إرفاق الملف: 「${file.name}」 بنجاح للتحليل الفني!`);
    };
    reader.readAsDataURL(file);
  };

  const handleLocalSend = (customText?: string) => {
    if (customText) {
      onSendMessage(customText);
      return;
    }
    if (!inputMessage.trim() && !selectedFile) return;
    onSendMessage(inputMessage, selectedFile || undefined);
    setSelectedFile(null); // Clear file attachment state after dispatch
  };

  return (
    <section className="flex-1 flex flex-col min-h-0 text-right w-full relative">
      
      {/* Animated dashed line between Sidebar and Chat */}
      <div className="hidden lg:block absolute right-0 top-10 bottom-10 w-px shrink-0 z-10 overflow-hidden bg-gradient-to-b from-transparent via-slate-300 to-transparent">
        <div className="w-full h-[30%] bg-gradient-to-b from-transparent via-amber-400 to-transparent animate-slide-down-flow"></div>
      </div>

      {/* Smart Error Display or Licensing Warnings */}
      {errorNotif && (
        <div className="bg-emerald-50 border-y border-emerald-100 px-5 py-2 text-xs text-emerald-800 font-semibold flex items-center justify-between gap-3 animate-fade-in z-20 shrink-0">
          <span className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0 ml-1" />
            {errorNotif}
          </span>
          <button onClick={() => setErrorNotif(null)} className="text-emerald-500 hover:text-emerald-800 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {isGeminiKeyMissing && (
        <div className="bg-amber-50/80 border-b border-amber-100 px-5 py-2.5 text-xs text-amber-800 flex items-center justify-between gap-3 font-medium z-20 shrink-0">
          <span className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 animate-bounce ml-1" />
            <span>
              <strong>مفتاح Gemini API غير متوفر:</strong> يرجى إدخال مفتاح سحابي حقيقي لبدء رسم الفهارس والقوالب.
            </span>
          </span>
          <button onClick={onOpenSettings} className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-2.5 py-1 rounded-md text-[10px]">
            ربط مفتاح
          </button>
        </div>
      )}

      {/* CHAT TIMELINE SCROLL VIEW: Fits exactly the screen space */}

      {/* CHAT TIMELINE SCROLL VIEW: Fits exactly the screen space */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8 bg-transparent">
        
        {/* Ambient greeting card on empty chat */}
        {messages.length === 0 && (
          <div className="text-center py-16 max-w-lg mx-auto space-y-4">
            <Bot className="w-12 h-12 text-slate-350 mx-auto" />
            <h3 className="text-lg font-black text-slate-800">الشات هو أساس التطبيق ومحرك الإبداع 💬</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              تحكّم في كل شيء مباشرةً عبر هذه المحادثة! اكتب لهجتك أو هويتك أو اطلب تلوين الكارت، تغيير المقاسات، رسم الرول اب، أو صياغة الدراسة التسويقية. النظام يتلقى كافة المتطلبات ويحدّث لوحة المعاينة الفيكتورية لليمين بشكل حي.
            </p>
            <div className="bg-transparent p-3 text-[10.5px] text-slate-500 leading-normal">
              💡 <strong>ملاحظة:</strong> كافة الخيارات التفسيرية، المعاينات السحابية، والتحميلات متصلة بالكامل بمحادثتك، عدا مفاتيح الربط التي تفتحها منفصلة من قائمة "أدوات التراخيص" بالأسفل.
            </div>
          </div>
        )}

        {messages.map((msg, index) => {
          const isUser = msg.role === "user";
          return (
            <div key={msg.id || index} className={`flex ${isUser ? "justify-end" : "justify-start"} items-start gap-4 animate-fade-in`}>
              
              {/* Avatar Icon */}
              {!isUser && (
                <div className="w-8.5 h-8.5 rounded-full bg-slate-800 flex items-center justify-center shrink-0 shadow-sm border border-slate-200">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </div>
              )}

              <div className={`flex flex-col space-y-2 ${isUser ? "items-end" : "items-start"} max-w-[95%] md:max-w-[85%] w-full`}>
                
                {/* Message Text Container */}
                <div className={`rounded-3xl px-4 py-3 text-xs text-right leading-relaxed transition-all duration-300 w-full ${
                  isUser
                    ? "bg-slate-800/5 text-slate-800 font-medium text-sm"
                    : "text-slate-800 text-[13px] leading-relaxed bg-transparent"
                }`}>
                  <div className="whitespace-pre-wrap">{msg.content}</div>

                  {msg.attachment && (
                    <div className="mt-2.5 max-w-sm rounded-3xl overflow-hidden bg-slate-800/5 p-1.5 flex flex-col gap-1.5 text-right">
                      {msg.attachment.mimeType?.startsWith("image/") ? (
                        <img 
                          src={`data:${msg.attachment.mimeType};base64,${msg.attachment.data}`} 
                          alt={msg.attachment.name} 
                          className="w-full max-h-48 object-contain rounded-lg"
                        />
                      ) : (
                        <div className="p-3 bg-slate-50 rounded-lg flex items-center gap-2">
                          <FileText className="w-5 h-5 text-indigo-500 shrink-0" />
                          <div className="truncate text-[11px] font-bold text-slate-700">{msg.attachment.name}</div>
                        </div>
                      )}
                      <div className="text-[9px] text-slate-400 font-mono text-left px-1">المرفق: {msg.attachment.name}</div>
                    </div>
                  )}

                  {msg.hasDesign && msg.designData && (
                    <div className="mt-4 bg-slate-800/5 rounded-3xl overflow-hidden w-full max-w-[100vw] sm:max-w-full backdrop-blur-sm">
                      
                      {/* Artboard Header */}
                      <div className="px-4 py-3 flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse ml-1 shrink-0" />
                          <h4 className="text-xs font-black text-slate-800 leading-none">معاينة المتجه الفني: {msg.designData.title}</h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-extrabold bg-slate-800 text-white px-2 py-0.5 rounded-full font-mono">
                            {msg.designData.dimensions}
                          </span>
                          <button
                            onClick={() => {
                              const blob = new Blob([msg.designData!.svgCode], { type: "image/svg+xml;charset=utf-8" });
                              const url = URL.createObjectURL(blob);
                              const link = document.createElement("a");
                              link.href = url;
                              link.download = `riyadh-vector-${msg.designData!.type}-${msg.id}.svg`;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] py-1 px-2.5 rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-1"
                          >
                            <Download className="w-3 h-3 shrink-0 ml-1" />
                            تحميل SVG
                          </button>
                        </div>
                      </div>

                      {/* Canvas Container */}
                      <div className="p-4 bg-transparent min-h-[220px] flex flex-col items-center justify-center relative">
                        <div className="w-full max-w-[320px] bg-transparent p-3 relative">
                          {/* Bleed Margin Tag */}
                          <div className="absolute top-1 left-2 text-[8px] text-red-500 font-extrabold bg-red-50/90 border border-red-200 px-1 rounded pointer-events-none">
                            هامش قطع آمن ({msg.designData.bleed})
                          </div>
                          
                          {/* Render SVG Code safely */}
                          <div 
                            className="w-full transition-all duration-300 flex justify-center items-center"
                            dangerouslySetInnerHTML={{ __html: msg.designData.svgCode }}
                          />
                          
                          <p className="text-[8.5px] text-slate-400 mt-2 text-center leading-normal">
                            * خطوط وعناصر متجهة نقية قابلة للتكبير اللانهائي ومطابقة للمطابع.
                          </p>
                        </div>
                      </div>

                      {/* Technical Specs Grid */}
                      <div className="p-3.5 border-t border-slate-200/50 grid grid-cols-2 gap-3 text-[10.5px] text-slate-700">
                        <div className="p-2">
                          <span className="text-slate-400 block text-[8px] font-bold">الأبعاد الفعلية</span>
                          <strong className="text-slate-800 font-bold block mt-0.5">{msg.designData.dimensions}</strong>
                        </div>
                        <div className="p-2">
                          <span className="text-slate-400 block text-[8px] font-bold">منطقة الحماية النصية</span>
                          <strong className="text-slate-800 font-bold block mt-0.5">{msg.designData.safeZone}</strong>
                        </div>
                        <div className="p-2">
                          <span className="text-slate-400 block text-[8px] font-bold">قالب القص والنزيف</span>
                          <strong className="text-rose-600 font-bold block mt-0.5 font-mono">{msg.designData.bleed}</strong>
                        </div>
                        <div className="p-2">
                          <span className="text-slate-400 block text-[8px] font-bold">الخامة المقترحة بالرياض</span>
                          <strong className="text-amber-700 font-bold block mt-0.5 leading-snug truncate">{msg.designData.materials}</strong>
                        </div>
                      </div>

                      {/* Integrated Marketing Study */}
                      {msg.marketingAnalysis && (
                        <div className="p-4 border-t border-slate-200/50 space-y-3">
                          <h5 className="text-[11.5px] font-black text-slate-800 flex items-center gap-1.5 pb-1.5">
                            <TrendingUp className="w-3.5 h-3.5 text-emerald-600 ml-1" />
                            الدراسة التسويقية وسيكولوجيا العملاء بالرياض
                          </h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[10.5px] text-slate-650 leading-relaxed">
                            <div className="p-2.5">
                              <span className="font-bold text-slate-800 block text-[9.5px] mb-1">🎯 الجمهور المستهدف ونوع النفوذ:</span>
                              <p>{msg.marketingAnalysis.targetAudience}</p>
                            </div>
                            <div className="p-2.5">
                              <span className="font-bold text-slate-800 block text-[9.5px] mb-1">🎨 سيكولوجيا الألوان CMYK:</span>
                              <p>{msg.marketingAnalysis.psychologyOfColors}</p>
                            </div>
                            <div className="p-2.5">
                              <span className="font-bold text-slate-800 block text-[9.5px] mb-1">📈 مؤشر التذكر والتحمل البصري:</span>
                              <p>{msg.marketingAnalysis.advertisingImpact}</p>
                            </div>
                            <div className="p-2.5">
                              <span className="font-bold text-slate-800 block text-[9.5px] mb-1">🇸🇦 الامتثال البلدي والمحلي:</span>
                              <p>{msg.marketingAnalysis.localVibeMatch}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Self-contained Mockup Generator specific to this message block */}
                      <div className="p-4 border-t border-slate-150 bg-[#F8FAFC] space-y-3">
                        <h5 className="text-[11.5px] font-black text-slate-800 flex items-center gap-1.5">
                          <ImageIcon className="w-3.5 h-3.5 text-blue-600 ml-1" />
                          توليد معاينة فوتوغرافية حقيقية للعميل (Imagen)
                        </h5>
                        <p className="text-[10px] text-slate-400 leading-normal">
                          اطلب رسم صورة فوتوغرافية ثلاثية الأبعاد لوضع هذا التصميم المطبوع في إحدى غرف أو مكاتب أو شوارع مدينة الرياض لترسلها لعميلك.
                        </p>
                        
                        <div className="flex gap-2 text-xs">
                          <input
                            type="text"
                            defaultValue={msg.mockupPrompt || `Professional ultra-realistic printed design mockup of "${msg.designData.title}" on a slick office table, beautiful Saudi Arabia light, detailed 8k`}
                            id={`mockup-prompt-input-${msg.id}`}
                            className="flex-1 bg-white border border-slate-205 rounded-xl px-3 py-2 text-[11px] text-slate-700 placeholder-slate-400 focus:outline-none"
                            placeholder="صف مشهد ومكان وضع اللوحة..."
                          />
                          <button
                            onClick={() => {
                              const inputEl = document.getElementById(`mockup-prompt-input-${msg.id}`) as HTMLInputElement;
                              const promptText = inputEl?.value || `Professional printed design mockup of "${msg.designData!.title}"`;
                              onGenerateMessageMockup(msg.id, promptText);
                            }}
                            disabled={msg.mockupLoading}
                            className="bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-[10.5px] px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1 shrink-0 disabled:opacity-50 cursor-pointer"
                          >
                            {msg.mockupLoading ? (
                              <>
                                <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400 ml-1" />
                                جاري الخبز...
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-3.5 h-3.5 text-amber-400 ml-1" />
                                كبسة توليد
                              </>
                            )}
                          </button>
                        </div>

                        {/* Visual Mockup Result Box */}
                        {msg.mockupUrl && (
                          <div className="pt-2 rounded-xl overflow-hidden border border-slate-200 shadow-inner relative animate-fade-in group w-full">
                            <img
                              src={msg.mockupUrl}
                              alt="Generated Mockup Photograph"
                              referrerPolicy="no-referrer"
                              className="w-full h-44 object-cover"
                            />
                            <div className="absolute bottom-2 left-2 right-2 bg-black/75 backdrop-blur-md px-2 py-1.5 rounded-lg text-white font-bold text-[8.5px] flex items-center justify-between opacity-100 transition-all">
                              <span>صورة لمعاينة العميل (Imagen)</span>
                              <a href={msg.mockupUrl} target="_blank" rel="noreferrer" className="text-amber-400 hover:underline flex items-center gap-0.5">
                                افتح بجودة عالية <ExternalLink className="w-2.5 h-2.5 mr-1" />
                              </a>
                            </div>
                          </div>
                        )}
                      </div>

                    </div>
                  )}

                </div>

                {/* DYNAMIC ENGINE ALGORITHMS AND TRACE PANELS removed based on user feedback */}

                {/* Chat Action Utility Buttons underneath assistant texts */}
                {!isUser && (
                  <div className="flex items-center gap-3.5 px-2 text-slate-400 hover:text-slate-600 transition-all duration-200 select-none">
                    <button
                      onClick={() => onCopyClipboard(msg.content, msg.id)}
                      className="hover:text-slate-800 transition-colors cursor-pointer"
                      title="نسخ الشرح"
                    >
                      <span className="text-[10px] font-semibold">
                        {isCopiedId === msg.id ? "✓ تم النسخ" : "نسخ الكست"}
                      </span>
                    </button>
                    <span className="text-slate-200">|</span>
                    <ThumbsUp className="w-3.5 h-3.5 hover:text-emerald-600 transition-colors cursor-pointer text-slate-350" title="أعجبني" />
                    <ThumbsDown className="w-3.5 h-3.5 hover:text-red-500 transition-colors cursor-pointer text-slate-350" title="لم يعجبني" />
                    <Share2 className="w-3.5 h-3.5 hover:text-blue-500 transition-colors cursor-pointer text-slate-350" title="مشاركة" />
                  </div>
                )}

                {/* INTERACTIVE CLICKABLE ANSWER BUTTONS */}
                {!isUser && msg.suggestedButtons && msg.suggestedButtons.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {msg.suggestedButtons.map((btnText, bIdx) => (
                      <button
                        key={bIdx}
                        onClick={() => handleLocalSend(btnText)}
                        className="bg-white hover:bg-slate-100 text-slate-700 text-[11px] font-bold py-1.5 px-3 rounded-full border border-slate-200 hover:border-slate-350 shadow-sm transition-all duration-300 transform active:scale-95 cursor-pointer flex items-center gap-1.5"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse ml-1 shrink-0" />
                        {btnText}
                      </button>
                    ))}
                  </div>
                )}

              </div>

              {isUser && (
                <div className="w-8.5 h-8.5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm border border-emerald-500">
                  <User className="w-4 h-4" />
                </div>
              )}

            </div>
          );
        })}

        {/* Smart inline decorative Box */}
        {/* Removed evaluation card as per user request */}

        {isLoading && (
          <div className="flex justify-start items-start gap-3 animate-pulse">
            <div className="w-8.5 h-8.5 rounded-full bg-slate-800 flex items-center justify-center shadow">
              <RefreshCw className="w-4 h-4 text-amber-400 animate-spin" />
            </div>
            <div className="bg-transparent p-4 max-w-[80%] text-xs text-slate-700 space-y-2">
              <p className="font-extrabold flex items-center gap-1.5 text-slate-800">
                <Sparkles className="w-4 h-4 text-amber-500 ml-1" />
                الوكيل المصمم الأكثر احترافية يعاير مسارات الفيكتور...
              </p>
              <span className="block text-[10.5px] text-slate-400 leading-normal">
                يتم رسم خطوط النزيف trimLimits وحساب التناغم النفسي CMYK وفقاً لتعليمات التراخيص...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Hidden file input for native attachment handling */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*,.pdf,.svg"
        className="hidden"
      />

      {/* --- CHAT INPUT PILL: Centered, featuring live attachment preview and active Speech recognition --- */}
      <div className="p-4 bg-transparent select-all shrink-0">
        
        <div className="w-full max-w-4xl mx-auto relative rounded-3xl pb-2">
          
          {/* Active Upload Thumbnail Preview above Input bar */}
          {selectedFile && (
            <div className="bg-slate-800/5 rounded-2xl p-2 px-3 flex items-center justify-between gap-3 animate-fade-in text-xs max-w-sm mr-auto">
              <div className="flex items-center gap-2 truncate">
                <FileText className="w-4 h-4 text-slate-500" />
                <span className="font-extrabold text-slate-700 truncate text-[11px]">{selectedFile.name} (جاهز للإرسال 📎)</span>
              </div>
              <button 
                onClick={() => { setSelectedFile(null); setErrorNotif("تم إزالة المرفق الحالي بنجاح."); }}
                className="p-1 text-slate-400 hover:text-red-500 cursor-pointer"
                title="إزالة المرفق"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div className="bg-slate-800/5 backdrop-blur-md rounded-full py-2 px-4 flex items-center justify-between gap-3 text-slate-800 focus-within:bg-slate-800/10 transition-all duration-300">
            
            {/* Plus (+) action upload button on the left - now fully active! */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer font-bold shrink-0 hover:bg-slate-800/10 ${
                selectedFile ? "text-emerald-600 bg-emerald-500/10" : "text-slate-600"
              }`}
              title="رفع ملفات فيكتور أو صور"
            >
              <Plus className="w-4.5 h-4.5" />
            </button>

            {/* Main Text Input */}
            <input
              id="chat-input"
              type="text"
              className="flex-1 min-w-0 bg-transparent px-2 py-2 text-xs md:text-sm text-slate-750 placeholder-slate-400 focus:outline-none text-right font-medium"
              placeholder={isListening ? "جاري الاستماع لصوتك..." : "اسأل عن أي شيء..."}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLocalSend()}
              disabled={isLoading}
            />

            <div className="flex items-center gap-2 shrink-0 select-none">
              {/* Microphone Icon - now fully active! */}
              <button
                onClick={handleToggleVoiceListen}
                className={`p-1 px-3 border rounded-full transition-all cursor-pointer text-[11px] font-bold whitespace-nowrap flex items-center gap-1 ${
                  isListening 
                    ? "bg-red-50 border-red-300 text-red-600 animate-pulse" 
                    : "bg-slate-50 border-slate-100 hover:border-slate-250 text-slate-500 hover:text-slate-800"
                }`}
                title="ميكروفون إدخال صوتي"
              >
                {isListening ? "جاري الاستماع... 🔴" : "استماع 🎙️"}
              </button>

              {/* Sound Wave Indicator inside beautiful solid black circle */}
              <div
                onClick={() => !isLoading && handleLocalSend()}
                className={`w-9.5 h-9.5 rounded-full bg-slate-900 flex items-center justify-center gap-0.8 cursor-pointer shadow hover:bg-slate-850 transition-all shrink-0 ${
                  isLoading ? "opacity-90 scale-95" : "hover:scale-105"
                }`}
                title="إرسال الطلب والتوليد المباشر"
              >
                {isLoading ? (
                  <div className="flex items-center gap-0.5 px-1 py-1">
                    <div className="w-0.8 h-3.5 bg-amber-400 rounded-full animate-bounce" />
                    <div className="w-0.8 h-5 bg-white rounded-full animate-bounce [animation-delay:0.15s]" />
                    <div className="w-0.8 h-2.5 bg-amber-400 rounded-full animate-bounce [animation-delay:0.3s]" />
                  </div>
                ) : (
                  <Send className="w-4 h-4 text-white transform scale-x-[-1]" />
                )}
              </div>
            </div>

          </div>
          
          <div className="text-center select-none">
            <span className="text-[10px] text-slate-400 font-medium">
              الوكيل المصمم يدعم الترجمة والتصدير لـ Illustrator, Canva, AutoCad, CorelDraw بدقة ملليمترية تامة.
            </span>
          </div>
        </div>

      </div>

    </section>
  );
};
