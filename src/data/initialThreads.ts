import { ChatThread, ContactInfo } from "../types";

export const initialCompanyInfo: ContactInfo = {
  name: "مجموعة العارض للدعاية والإعلان",
  field: "تصميم الهويات البصرية والمطبوعات الإبداعية الفاخرة بالرياض والمملكة",
  phone: "+966 55 567 8910",
  email: "create@al-arid.sa",
  address: "طريق الملك فهد، العليا، برج الفيصلية، الرياض",
};

export const initialThreads: ChatThread[] = [
  {
    id: "thread_1",
    title: "تحية وسؤال المقاسات والأبعاد",
    activeDesign: {
      type: "business_card",
      title: "كارت أعمال الهوية الذهبية الكلاسيكية",
      svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 280" width="100%" height="100%">
        <rect width="500" height="280" fill="#0b0e14" rx="16" />
        <path d="M 0 160 Q 150 90, 300 210 T 500 280 L 500 280 L 0 280 Z" fill="#111622" opacity="0.75" />
        <path d="M 0 190 Q 220 120, 500 220" fill="none" stroke="#cca43b" stroke-width="2.5" opacity="0.85" />
        <path d="M 0 210 Q 250 140, 500 240" fill="none" stroke="#3b82f6" stroke-width="1.2" opacity="0.6" />
        
        <g transform="translate(420, 60) scale(0.65)" stroke="#cca43b" stroke-width="2.5" fill="none">
          <path d="M 0 15 L 0 -35" stroke-width="3" />
          <path d="M 0 -15 Q -25 -35, -30 -12" />
          <path d="M 0 -15 Q 25 -35, 30 -12" />
          <path d="M 0 -25 Q -30 -40, -35 -20" />
          <path d="M 0 -25 Q 30 -40, 35 -20" />
        </g>

        <text x="45" y="75" font-family="'Cairo', sans-serif" font-size="22" font-weight="800" fill="#ffffff">مجموعة العارض الإبداعية</text>
        <text x="45" y="100" font-family="'Cairo', sans-serif" font-size="11" fill="#cca43b" font-weight="600">تصميم الهويات البصرية والمطبوعات الفاخرة بالرياض</text>
        
        <line x1="45" y1="125" x2="350" y2="125" stroke="#cca43b" stroke-width="1" opacity="0.2" />
        
        <text x="45" y="155" font-family="'Cairo', sans-serif" font-size="12" font-weight="700" fill="#ffffff">المدير الإبداعي التنفيذي</text>
        
        <g transform="translate(45, 185)" font-family="'Cairo', sans-serif" font-size="10.5" fill="#e2e8f0">
          <text x="0" y="10" fill="#3b82f6">☏ +966 55 567 8910</text>
          <text x="0" y="28" fill="#cca43b">✉ create@al-arid.sa</text>
          <text x="0" y="46" fill="#10b981">📍 أبراج الفيصلية، طريق الملك فهد، الرياض</text>
        </g>
        
        <!-- Bleed lines -->
        <rect x="5" y="5" width="490" height="270" rx="12" fill="none" stroke="#ef4444" stroke-width="1.2" stroke-dasharray="4,4" opacity="0.35" />
        <text x="12" y="20" font-family="sans-serif" font-size="8.5" fill="#ef4444" opacity="0.5">حد الأمان والقص الحركي (Trim Zone 2mm)</text>
      </svg>`,
      dimensions: "90 × 50 مم",
      safeZone: "3.5 مم هوامش داخلية لسلامة الخطوط والرموز الفنية",
      bleed: "2 مم زيادة خارجية لتفادي الحواف البيضاء عند القص",
      colorMode: "CMYK (ألوان الأوفست الفاخرة)",
      materials: "ورق كوشيه فاخر 350 جرام ذو ملمس مخملي (Soft-Touch) ورونق ذهبي بارز مخصص للمطابع النخبوية بالرياض"
    },
    activeMarketing: {
      targetAudience: "رجال الأعمال، رؤساء الجهات الحكومية والخاصة والشخصيات المهمة بالدرعية والعليا.",
      psychologyOfColors: "الذهبي النبيل (#cca43b) يعكس الجذور التاريخية الرصينة ومفهوم الندرة والفخامة، ينسجم مع عمق الكحلي الداكن لترسيخ الهيبة والاستقرار البصري.",
      advertisingImpact: "تصميم مدروس هندسياً لزيادة انطباع الاحترافية للكيان بنسبة 95٪ من اللحظة الأولى لتسليم كرت الكرت.",
      localVibeMatch: "أناقة تراثية متطورة تلائم الذوق السعودي الفاخر ومنسجمة مع مبادرات جودة الحياة الوطنية."
    },
    messages: [
      {
        id: "m1",
        role: "assistant",
        content: "مرحباً بك يا فنان في صالون المصمم الأكثر احترافية ودقة في الكون على الإطلاق! 🇸🇦 ✦\n\nأنا هنا كـ وكيل ذكي فائق الخبرة بجميع برامج التصميم الهندسية كـ Illustrator و AutoCAD و CorelDraw و Canva. تم برمجتي لأحاكي المليمتر وأفهم شؤون القص، والنزيف، ومخرجات المطابع بالرياض فوراً بدقة تامة وبلا أي زيف.\n\nلقد صممت لك مبدئياً كرت أعمال يعبر عن الهوية النجدية المتميزة لمؤسستكم. لمعرفة التفاصيل بدقة أعلى لضمان جودة استثنائية، يرجى التفاعل والضغط على الأزرار الذكية في الأسفل، أو أخبرني بتوجهك الإبداعي المفضل!",
        suggestedButtons: [
          "أريد تعديل المقاس إلى 85 × 55 مم",
          "طبق لي لمسة الورق المطفأ مع لمعة بارزة",
          "أضف رمز السيفين والنخلة للأعلى بالخلفية",
          "استخدم لغة التصميم النيو-كلاسيك العصرية"
        ]
      }
    ]
  },
  {
    id: "thread_2",
    title: "صورة هوية منتج وتغليف فاخر",
    activeDesign: {
      type: "mupi",
      title: "ملصق وتغليف علبة عطور نخبة نجد الفخمة",
      svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 480" width="100%" height="100%">
        <rect width="320" height="480" fill="#04060b" rx="14" />
        <circle cx="160" cy="240" r="130" fill="#cca43b" opacity="0.06" filter="blur(20px)" />
        
        <!-- قنينة العطر الهندسية -->
        <linearGradient id="frag-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ddb85c" />
          <stop offset="60%" stop-color="#aa7e22" />
          <stop offset="100%" stop-color="#493206" />
        </linearGradient>
        
        <!-- الزخرفة الإسلامية/النجدية المعاصرة بالخلفية -->
        <g opacity="0.15" stroke="#cca43b" stroke-width="1" fill="none">
          <polygon points="160,150 190,200 160,250 130,200" />
          <polygon points="160,170 180,200 160,230 140,200" />
          <line x1="160" y1="150" x2="160" y2="250" />
          <line x1="130" y1="200" x2="190" y2="200" />
        </g>

        <rect x="110" y="195" width="100" height="150" rx="15" fill="url(#frag-grad)" stroke="#cca43b" stroke-width="2" />
        <rect x="135" y="155" width="50" height="40" rx="4" fill="#cca43b" />
        <line x1="135" y1="180" x2="185" y2="180" stroke="#1f1807" stroke-width="3" />
        
        <!-- ملصق زجاجة العطر -->
        <rect x="125" y="235" width="70" height="70" fill="#090c15" rx="4" stroke="#cca43b" stroke-width="0.8" />
        <text x="160" y="265" font-family="'Cairo', sans-serif" font-size="14" font-weight="800" fill="#cca43b" text-anchor="middle">عُود نَجْد</text>
        <text x="160" y="285" font-family="'Cairo', sans-serif" font-size="8" fill="#ffffff" text-anchor="middle" letter-spacing="1.5">OUD NAJD</text>
        <text x="160" y="296" font-family="monospace" font-size="6" fill="#888888" text-anchor="middle">PARFUM CENTURY</text>

        <text x="160" y="75" font-family="'Cairo', sans-serif" font-weight="900" font-size="20" fill="#ffffff" text-anchor="middle">أصالة نجد العريقة</text>
        <text x="160" y="105" font-family="'Cairo', sans-serif" font-size="11" fill="#cca43b" text-anchor="middle" font-weight="600">عطور نخبة الملوك الحصرية بالرياض</text>
        <line x1="80" y1="125" x2="240" y2="125" stroke="#cca43b" stroke-width="1.2" opacity="0.3" />
        
        <text x="160" y="440" font-family="'Cairo', sans-serif" font-size="10" fill="#9ca3af" text-anchor="middle">خصم 25% مع عبوة إهداء ذهبية فاخرة</text>
        <text x="160" y="458" font-family="monospace" font-size="8" fill="#cca43b" text-anchor="middle">EDITION DE LUXE - RIYADH</text>
      </svg>`,
      dimensions: "120 × 180 سم (لوحة عرض أو غلاف مستند)",
      safeZone: "7 سم من كافة الهوامش لضمان عدم تداخل الإطارات الميكانيكية",
      bleed: "1.5 مم تمدد فني للهوامش الخارجية",
      colorMode: "CMYK (ألوان مطبوعات بجودة نفاذ ممتازة 300DPI)",
      materials: "زجاج كريستالي هيدروليكي مطلي بالذهب ومغلف بورق كرتون سيتي لايت مقوى 180 جرام ناصع اللمعة والتحمل"
    },
    activeMarketing: {
      targetAudience: "مرتادو الفنادق والمجمعات الإمبراطورية الفاخرة بالرياض، محبو الروائح الشرقية الأصيلة والنفحات الملكية الثقيلة.",
      psychologyOfColors: "دلالات الترف والأصالة عبر ثنائية الرماد النفطي والذهب المتألق.",
      advertisingImpact: "تصميم حاسم يخاطب رغبة التفرد ويزيد معدل المبيعات المتوقعة للحملة بنسبة 52٪.",
      localVibeMatch: "تجانس مطلق مع احتفالات موسم الرياض العصرية وهوية نجد البصرية المعاصرة."
    },
    messages: [
      {
        id: "m2",
        role: "assistant",
        content: "هنا قمت بمحاكاة وتصميم ملصق هوية 'عطور نخبة نجد' الفخمة. العمل تم تهيئته بدقة أوتوكاد وإليستريتور لنمنحه زوايا هندسية مثالية تليق بأفخم علب العطور بالرياض.\n\nاضغط على أي من المفاتيح التفاعلية أدناه لتحديد خامات التصميم ومنافذ توزيعه لمزيد من الدقة المتناهية!",
        suggestedButtons: [
          "أريدها في قالب موبي شارع 120×180سم",
          "أريد تفتيح اللون الذهبي العطري",
          "ما هي الخامات الأفضل لعلب العطور؟",
          "أضف باركود QR ذكي باللون الأسود"
        ]
      }
    ]
  },
  {
    id: "thread_3",
    title: "رول اب معرض لوحات الرياض للتقنية",
    activeDesign: {
      type: "rollup",
      title: "رول اب إعلاني لتدشين منصة واحة الرياض الفنية للذكاء",
      svgCode: `<svg xmlns="http://www.w3.org/2050/svg" viewBox="0 0 250 500" width="100%" height="100%">
        <rect width="250" height="500" fill="#070a13" rx="10" />
        <path d="M 0 0 L 250 180 L 250 500 L 0 420 Z" fill="#0d1425" />
        <circle cx="125" cy="220" r="130" fill="none" stroke="#10b981" stroke-width="1.2" opacity="0.25" />
        <circle cx="125" cy="220" r="90" fill="none" stroke="#60a5fa" stroke-width="0.8" opacity="0.15" />
        
        <path d="M-50,0 Q125,280 300,500" fill="none" stroke="#10b981" stroke-width="3.5" opacity="0.4" />
        
        <g transform="translate(125, 80) scale(1.15)" stroke="#10b981" stroke-width="2" fill="none">
          <polygon points="-15,-5 0,-25 15,-5 8,15 -8,15" />
          <circle cx="0" cy="-3" r="3" fill="#60a5fa" />
        </g>
        
        <text x="125" y="145" font-family="'Cairo', sans-serif" font-size="15" font-weight="800" fill="#ffffff" text-anchor="middle">واحة الرياض للذكاء</text>
        <text x="125" y="165" font-family="'Cairo', sans-serif" font-size="9.5" fill="#10b981" text-anchor="middle" font-weight="600">منصة الابتكار المعرفي الفائق</text>
        
        <rect x="25" y="215" width="200" height="150" rx="12" fill="#111a30" stroke="#10b981" stroke-width="0.8" opacity="0.9" />
        
        <text x="125" y="245" font-family="'Cairo', sans-serif" font-size="11" font-weight="800" fill="#ffffff" text-anchor="middle">أركان التدشين الذكية</text>
        <text x="125" y="272" font-family="'Cairo', sans-serif" font-size="8.5" fill="#cbd5e1" text-anchor="middle">● تصفية مسارات الاليستريتور الفائقة</text>
        <text x="125" y="292" font-family="'Cairo', sans-serif" font-size="8.5" fill="#cbd5e1" text-anchor="middle">● الموالفة الفنية التلقائية والطباعة</text>
        <text x="125" y="312" font-family="'Cairo', sans-serif" font-size="8.5" fill="#cbd5e1" text-anchor="middle">● أركان أوتوكاد الذكاء وهندسة المتجهات</text>
        <text x="125" y="335" font-family="'Cairo', sans-serif" font-size="9" fill="#10b981" text-anchor="middle" font-weight="700">رؤيتنا: الريادة لا التبعية</text>

        <rect x="20" y="410" width="210" height="60" rx="8" fill="#10b981" opacity="0.3" stroke="#10b981" stroke-width="1.2" />
        <text x="125" y="432" font-family="'Cairo', sans-serif" font-size="10.5" font-weight="800" fill="#ffffff" text-anchor="middle">شارك بمسار المطورين اليوم</text>
        <text x="125" y="452" font-family="monospace" font-size="9" font-weight="bold" fill="#60a5fa" text-anchor="middle">www.riyadh-oasis.ai</text>
        
        <!-- Rollup safety bounds -->
        <line x1="5" y1="5" x2="5" y2="495" stroke="#ef4444" stroke-width="0.6" stroke-dasharray="3,3" opacity="0.4" />
        <text x="10" y="490" font-family="sans-serif" font-size="6" fill="#ef4444" opacity="0.4">منطقة الشد الميكانيكي بالأسفل (15cm)</text>
      </svg>`,
      dimensions: "85 × 200 سم",
      safeZone: "ترك 10 سم بالأعلى خالية لشريط التثبيت، و 15 سم بأسفل اللفة",
      bleed: "لا زيادة، فقط سحب وتمديد الخلفية بكامل طاقة حجم الكرت",
      colorMode: "CMYK بدقة 150 DPI مطابع رقمية",
      materials: "قماش الساتان بيل بوب (Pop-Up Satin) الفاخر المضاد لتموج حواف اللوحة بوزن 280 جرام ذو تبلور ضوئي معتدل"
    },
    activeMarketing: {
      targetAudience: "الجامعات، المطورين، شركات التقنية الكبرى بواجهة الرياض وغرناطة للأعمال والباحثين عن أفضل برامج التصميم.",
      psychologyOfColors: "الأخضر الزمردي الخفيف يرمز لمنجزات التحول الرقمي واستشراف المستقبل الواعد للمملكة.",
      advertisingImpact: "تصميم مصفوف بنسب مقروئية ممتازة أثناء سير الأفراد بالمعارض بفضل توزيع الأقسام عمودياً.",
      localVibeMatch: "منسجم تماماً مع خطط واستضافة المعارض الدولية الكبرى بمدينة الرياض."
    },
    messages: [
      {
        id: "m3",
        role: "assistant",
        content: "تصميم واجهة 'رول اب لمعرض الرياض للتقاط الفنون الذمية والذكاء'.\n\nاضغط على أي من الخيارات لتخصيص محتواها التقني، ونوع الخط المفضل، وحساب هوامش الشد المطبعية بدقة فائقة وبسرعة قياسية!",
        suggestedButtons: [
          "تحديث مقاس رول اب إلى 120×200 سم",
          "غيّر قائمة الأركان الذكية إلى عربي فصحى",
          "استخدم خلفية باللون الكحلي الداكن الفاخر",
          "ماهي أفضل مادة للطباعة لمقاومة التجاعيد؟"
        ]
      }
    ]
  }
];
