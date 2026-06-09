import React, { useState, useEffect } from "react";
import { ChatThread, ContactInfo, ApiKeys, Message } from "./types";
import { initialThreads, initialCompanyInfo } from "./data/initialThreads";
import { Sidebar } from "./components/Sidebar";
import { ChatPane } from "./components/ChatPane";
import { SettingsModal } from "./components/SettingsModal";

/**
 * App is the high-level orchestrator of the workstation. It handles persistent state,
 * triggers real-time communication events via fetch parameters, and propagates state 
 * updates down to pure, decoupled representation layers (subcomponents).
 * 
 * Features 0% local simulation (No mock fallback engines).
 */
export default function App() {
  // --- Core States ---
  const [threads, setThreads] = useState<ChatThread[]>(() => {
    const saved = localStorage.getItem("THREADS_DESIGN");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialThreads;
      }
    }
    return initialThreads;
  });

  const [activeThreadId, setActiveThreadId] = useState<string>(() => {
    return localStorage.getItem("THREADS_ACTIVE_ID") || "thread_1";
  });

  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [errorNotif, setErrorNotif] = useState<string | null>(null);

  // Secure local state for credentials
  const [apiKeys, setApiKeys] = useState<ApiKeys>({
    geminiKey: localStorage.getItem("APP_GEMINI_KEY") || "",
    illustratorToken: localStorage.getItem("APP_ILLUSTRATOR_TOKEN") || "",
    corelDrawToken: localStorage.getItem("APP_CORELDRAW_TOKEN") || "",
    canvaToken: localStorage.getItem("APP_CANVA_TOKEN") || "",
  });

  // Client context for vector personalization
  const [companyInfo, setCompanyInfo] = useState<ContactInfo>(() => {
    const saved = localStorage.getItem("APP_COMPANY_INFO");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialCompanyInfo;
      }
    }
    return initialCompanyInfo;
  });

  const [isCopiedId, setIsCopiedId] = useState<string | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Live keys status verification matrix
  const [keyStatus, setKeyStatus] = useState<{
    gemini: { valid: boolean; message: string };
    illustrator: { configured: boolean };
    canva: { configured: boolean };
    coreldraw: { configured: boolean };
  } | null>(null);
  const [checkingKeys, setCheckingKeys] = useState(false);

  // Derived state from current thread
  const activeThread = threads.find((t) => t.id === activeThreadId) || threads[0];
  const messages = activeThread?.messages || [];
  const activeDesign = activeThread?.activeDesign;

  // Persist State Changes in LocalStorage
  useEffect(() => {
    localStorage.setItem("THREADS_DESIGN", JSON.stringify(threads));
    localStorage.setItem("THREADS_ACTIVE_ID", activeThreadId);
  }, [threads, activeThreadId]);

  // Automated Keys diagnostics check when keys state changes
  const handleCheckKeys = async () => {
    setCheckingKeys(true);
    try {
      const res = await fetch("/api/check-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKeys }),
      });
      if (res.ok) {
        const data = await res.json();
        setKeyStatus(data);
      } else {
        throw new Error("HTTP connection error");
      }
    } catch (e: any) {
      console.error("Core Key Checker Error:", e);
      setKeyStatus({
        gemini: { valid: false, message: `فشل التحقق: ${e.message || e}` },
        illustrator: { configured: !!apiKeys.illustratorToken },
        canva: { configured: !!apiKeys.canvaToken },
        coreldraw: { configured: !!apiKeys.corelDrawToken }
      });
    } finally {
      setCheckingKeys(false);
    }
  };

  useEffect(() => {
    handleCheckKeys();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKeys]);

  const isGeminiKeyMissing = !apiKeys.geminiKey;

  // Sound cue audio synthesizer
  const playAlertSound = () => {
    if (!soundEnabled) return;
    try {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = context.createOscillator();
      const gain = context.createGain();
      osc.connect(gain);
      gain.connect(context.destination);
      osc.frequency.setValueAtTime(880, context.currentTime);
      gain.gain.setValueAtTime(0.01, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.1);
      osc.start();
      osc.stop(context.currentTime + 0.1);
    } catch (e) {
      // Autoplay rules block if no user interaction registered
    }
  };

  // --- Thread Operations ---
  const handleCreateNewThread = () => {
    const newId = `thread_${Date.now()}`;
    const newThread: ChatThread = {
      id: newId,
      title: "محادثة إبداعية جديدة",
      messages: [
        {
          id: `welcome_${Date.now()}`,
          role: "assistant",
          content: `أهلاً بك يا شريكي الإبداعي في وكالة الرياض الفائقة للتصميم الهوّاتي والمطابيع 🇸🇦✨.\n\nأنا جاهز فوراً لمساعدتك في ابتكار الكروت الشخصية الاستثنائية، الرول اب الذكي، ولوحات الموبي الفاخرة للكيان الخاص بك بمدينة الرياض بسياق ثقافي فريد وبدقة لا خطأ فيها.\n\nتفضل بكتابة طلبك أو موضوع التصميم`
        }
      ]
    };
    setThreads((prevThreads) => [newThread, ...prevThreads]);
    setActiveThreadId(newId);
  };

  const handleSelectThread = (id: string) => {
    setActiveThreadId(id);
    playAlertSound();
  };

  const handleDeleteThread = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (threads.length <= 1) {
      setErrorNotif("لا يمكن حذف المحادثة الأخيرة المتبقية! يرجى إنشاء محادثة جديدة أولاً ⚠️");
      return;
    }
    const filtered = threads.filter((t) => t.id !== id);
    setThreads(filtered);
    if (activeThreadId === id) {
      setActiveThreadId(filtered[0].id);
    }
    playAlertSound();
  };

  const handleSaveSettings = (updatedKeys: ApiKeys, updatedInfo: ContactInfo) => {
    setApiKeys(updatedKeys);
    setCompanyInfo(updatedInfo);
    localStorage.setItem("APP_GEMINI_KEY", updatedKeys.geminiKey);
    localStorage.setItem("APP_ILLUSTRATOR_TOKEN", updatedKeys.illustratorToken);
    localStorage.setItem("APP_CORELDRAW_TOKEN", updatedKeys.corelDrawToken);
    localStorage.setItem("APP_CANVA_TOKEN", updatedKeys.canvaToken);
    localStorage.setItem("APP_COMPANY_INFO", JSON.stringify(updatedInfo));
    setIsSettingsOpen(false);
    playAlertSound();
    setErrorNotif("تم حفظ كافة كروت التراخيص ومعلومات الهوية وتوجيه المنفذ بنجاح داخل النظام.");
    setTimeout(() => {
      setErrorNotif((curr) => (curr?.includes("تم حفظ كافة") ? null : curr));
    }, 5000);
  };

  // Send message to actual Gemini API backend
  const handleSendMessage = async (rawText?: string, attachment?: { name: string, mimeType: string, data: string }) => {
    const textToSend = rawText || inputMessage;
    // Allow sending message if there is either text or an attachment
    if (!textToSend.trim() && !attachment) return;

    setErrorNotif(null);
    setInputMessage("");
    playAlertSound();

    const userMsgId = Date.now().toString();
    const userMsg: Message = {
      id: userMsgId,
      role: "user",
      content: textToSend || "تحليل المستند المرفق / التصميم المرفوعة 📁",
      attachment: attachment,
    };

    setThreads((prevThreads) =>
      prevThreads.map((t) => {
        if (t.id === activeThreadId) {
          const title = t.title === "محادثة إبداعية جديدة" ? (textToSend ? textToSend.slice(0, 30) + "..." : "مستند مرفق") : t.title;
          return {
            ...t,
            title,
            messages: [...t.messages, userMsg],
          };
        }
        return t;
      })
    );

    setIsLoading(true);

    try {
      const threadToUpdate = threads.find((t) => t.id === activeThreadId) || activeThread;
      const fullHistory = [...threadToUpdate.messages, userMsg];

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: fullHistory,
          selectedPreset: undefined,
          customCompanyInfo: companyInfo,
          apiKeys: apiKeys,
        }),
      });

      let data;
      if (!response.ok) {
        data = await response.json().catch(() => ({}));
        if (!data.message) {
          throw new Error("HTTP_API_ERROR_500: فشل استدعاء خادم الـ API أو تعذّر التحقق.");
        }
      } else {
        data = await response.json();
      }

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message,
        hasDesign: data.hasDesign,
        designData: data.hasDesign && data.designData ? data.designData : undefined,
        marketingAnalysis: data.marketingAnalysis,
        engineTrace: data.engineTrace,
        suggestedButtons: data.suggestedButtons || (data.hasDesign ? [
          "تعديل المقاس الحركي والنزيف",
          "تضمين كود خصم ترويجي للمواطنين بالرياض",
          "استكشاف الألوان الصالحة للمطبوعات الفاخرة",
          "هل هذا التصميم مناسب للبلدية والمرور بالرياض؟",
        ] : []),
      };

      setThreads((prevThreads) =>
        prevThreads.map((t) => {
          if (t.id === activeThreadId) {
            return {
              ...t,
              messages: [...t.messages, assistantMsg],
              activeDesign: data.hasDesign && data.designData ? data.designData : t.activeDesign,
              activeMarketing: data.marketingAnalysis ? data.marketingAnalysis : t.activeMarketing,
            };
          }
          return t;
        })
      );
    } catch (err: any) {
      console.error(err);
      setErrorNotif(`❌ خطأ اتصال حقيقي: ${err.message || err}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Mockup generation per specific message in history using Imagen on the server
  const handleGenerateMessageMockup = async (messageId: string, promptText: string) => {
    playAlertSound();

    // Set loading state specifically on that historic message
    setThreads((prevThreads) =>
      prevThreads.map((t) => {
        if (t.id === activeThreadId) {
          return {
            ...t,
            messages: t.messages.map((m) => {
              if (m.id === messageId) {
                return { ...m, mockupLoading: true, mockupPrompt: promptText };
              }
              return m;
            }),
          };
        }
        return t;
      })
    );

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptText, apiKeys: apiKeys }),
      });
      const data = await response.json();
      if (data.success && data.imageUrl) {
        setThreads((prevThreads) =>
          prevThreads.map((t) => {
            if (t.id === activeThreadId) {
              return {
                ...t,
                messages: t.messages.map((m) => {
                  if (m.id === messageId) {
                    return { ...m, mockupUrl: data.imageUrl, mockupLoading: false };
                  }
                  return m;
                }),
              };
            }
            return t;
          })
        );
      } else {
        throw new Error(data.error || "فشل توليد المعاينة");
      }
    } catch (err: any) {
      console.error(err);
      setErrorNotif(`❌ خطأ توليد صورة حقيقي: ${err.message || err}`);
      
      // Clear loading state on failure
      setThreads((prevThreads) =>
        prevThreads.map((t) => {
          if (t.id === activeThreadId) {
            return {
              ...t,
              messages: t.messages.map((m) => {
                if (m.id === messageId) {
                  return { ...m, mockupLoading: false };
                }
                return m;
              }),
            };
          }
          return t;
        })
      );
    }
  };

  const handleCopyClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setIsCopiedId(id);
    playAlertSound();
    setTimeout(() => setIsCopiedId(null), 2000);
  };

  const handleApplyPresetType = (type: "business_card" | "rollup" | "mupi") => {
    let presetLabel = "";
    if (type === "business_card") presetLabel = "أريد تطبيق كرت أعمال ذهبي 90×50مم";
    else if (type === "rollup") presetLabel = "أريد تطبيق رول اب عرض 85×200سم";
    else if (type === "mupi") presetLabel = "أريد تطبيق لوحة موبي شارع 120×180سم";
    handleSendMessage(presetLabel);
  };

  return (
    <div className="w-full flex-1 h-full bg-[#FAF9F5] text-[#1E293B] antialiased font-sans flex flex-row relative overflow-hidden" dir="rtl">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-50/40 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] rounded-full bg-amber-50/30 blur-[120px] pointer-events-none" />

      {/* Sidebar Component */}
      <Sidebar
        threads={threads}
        activeThreadId={activeThreadId}
        companyInfo={companyInfo}
        soundEnabled={soundEnabled}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        onCreateNewThread={handleCreateNewThread}
        onSelectThread={handleSelectThread}
        onDeleteThread={handleDeleteThread}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
      />

      {/* Main viewport container */}
      <main className="flex-1 min-w-0 flex flex-col h-full z-15 relative bg-transparent">
        <ChatPane
          messages={messages}
          isLoading={isLoading}
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          onSendMessage={handleSendMessage}
          activeDesign={activeDesign}
          onApplyPresetType={handleApplyPresetType}
          onCopyClipboard={handleCopyClipboard}
          isCopiedId={isCopiedId}
          errorNotif={errorNotif}
          setErrorNotif={setErrorNotif}
          isGeminiKeyMissing={isGeminiKeyMissing}
          onOpenSettings={() => setIsSettingsOpen(true)}
          companyName={companyInfo.name}
          onToggleSidebar={() => setIsMobileSidebarOpen(true)}
          keyStatus={keyStatus}
          checkingKeys={checkingKeys}
          onCheckKeys={handleCheckKeys}
          onGenerateMessageMockup={handleGenerateMessageMockup}
        />
      </main>

      {/* Settings Modal Component */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        initialApiKeys={apiKeys}
        initialCompanyInfo={companyInfo}
        onSave={handleSaveSettings}
      />
    </div>
  );
}
