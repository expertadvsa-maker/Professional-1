export interface ContactInfo {
  name: string;
  field: string;
  phone: string;
  email: string;
  address: string;
}

export interface DesignData {
  type: string;
  title: string;
  svgCode: string;
  dimensions: string;
  safeZone: string;
  bleed: string;
  colorMode: string;
  materials: string;
}

export interface MarketingAnalysis {
  targetAudience: string;
  psychologyOfColors: string;
  advertisingImpact: string;
  localVibeMatch: string;
}

export interface EngineTrace {
  selectedModel: string;
  attemptedModels: { name: string; status: "success" | "skipped" | "failed"; error?: string; latencyMs: number }[];
  cmykSafetyAudit: { passed: boolean; message: string; details: string };
  bleedCalculation: { bleedMm: number; safetyMarginMm: number; checkResult: string };
  svgTagAudit: { rawLength: number; elementCount: number; isValidSvg: boolean; warningCount: number };
  systemStatus: { memoryUsage: string; speedMs: number; provider: string; apiProtocol: string };
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  hasDesign?: boolean;
  designData?: DesignData;
  marketingAnalysis?: MarketingAnalysis;
  suggestedButtons?: string[];
  mockupPrompt?: string;
  mockupUrl?: string;
  mockupLoading?: boolean;
  attachment?: {
    name: string;
    mimeType: string;
    data: string; // base64 encoded data
  };
  engineTrace?: EngineTrace;
}

export interface ChatThread {
  id: string;
  title: string;
  messages: Message[];
  activeDesign?: DesignData;
  activeMarketing?: MarketingAnalysis;
}

export interface ApiKeys {
  geminiKey: string;
  illustratorToken: string;
  corelDrawToken: string;
  canvaToken: string;
}
