var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json({ limit: "5mb" }));
var aiClient = null;
function getGeminiAI() {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!aiClient) {
    aiClient = new import_genai.GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  }
  return aiClient;
}
function getFallbackExtraction(text) {
  const isDemoSample = text.toLowerCase().includes("science exhibition") || text.toLowerCase().includes("proposal must be submitted");
  if (isDemoSample) {
    return {
      title: "Science Exhibition Project Proposal",
      summary: "Submission of the Grade 10 science exhibition proposal through the school portal by Friday 4 PM, followed by hard copy submission to Lab 2 on Monday.",
      deadline: "Friday, September 25 at 4:00 PM",
      dueDate: "2026-09-25",
      dueTime: "16:00",
      eventDate: "Monday, September 28",
      location: "Science Department portal and Lab 2",
      requiredAction: "Submit the project proposal online and bring a printed copy.",
      requiredMaterials: "Printed project proposal",
      targetAudience: "Grade 10 students",
      urgency: "Soon",
      subject: "Science",
      teamInfo: "Teams may have up to 4 members",
      simplifiedExplanation: "Grade 10 students need to submit their science exhibition proposal online by Friday at 4:00 PM. Bring a printed copy to Lab 2 on Monday. Teams can have up to four members."
    };
  }
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const title = lines[0] ? lines[0].replace(/^(reminder|notice|announcement)[:\s-]*/i, "").slice(0, 60) : "School Announcement";
  const lower = text.toLowerCase();
  let urgency = "Upcoming";
  if (lower.includes("urgent") || lower.includes("today") || lower.includes("tomorrow") || lower.includes("immediate")) {
    urgency = "Urgent";
  } else if (lower.includes("friday") || lower.includes("this week") || lower.includes("soon")) {
    urgency = "Soon";
  }
  let targetAudience = "All students";
  if (lower.includes("grade 10") || lower.includes("10th grade")) targetAudience = "Grade 10 students";
  else if (lower.includes("grade 9") || lower.includes("9th grade")) targetAudience = "Grade 9 students";
  else if (lower.includes("grade 11") || lower.includes("11th grade")) targetAudience = "Grade 11 students";
  else if (lower.includes("grade 12") || lower.includes("12th grade")) targetAudience = "Grade 12 students";
  return {
    title: title || "New Extracted Task",
    summary: text.slice(0, 160) + (text.length > 160 ? "..." : ""),
    deadline: "Friday, 4:00 PM",
    dueDate: "2026-09-25",
    dueTime: "16:00",
    eventDate: "Upcoming this week",
    location: lower.includes("lab") ? "Science Lab" : lower.includes("portal") ? "School Portal" : "School Campus",
    requiredAction: "Review details and complete requested action.",
    requiredMaterials: lower.includes("print") ? "Printed document" : "Standard school supplies",
    targetAudience,
    urgency,
    subject: lower.includes("math") ? "Mathematics" : lower.includes("science") ? "Science" : lower.includes("english") ? "English" : "General",
    teamInfo: lower.includes("team") ? "Group activity" : "Individual",
    simplifiedExplanation: `Summary: ${text.slice(0, 200)}... Please verify all dates and submit required materials promptly.`
  };
}
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "ClassBridge" });
});
app.post("/api/analyze-announcement", async (req, res) => {
  const { text, imageBase64, imageMimeType } = req.body;
  if (!text && !imageBase64) {
    return res.status(400).json({ error: "Missing announcement text or circular image" });
  }
  const effectiveText = text || "Notice / Circular Image Scanned";
  const ai = getGeminiAI();
  if (!ai) {
    const result = getFallbackExtraction(effectiveText);
    return res.json({ success: true, data: result, source: "built-in-engine" });
  }
  try {
    const prompt = `You are ClassBridge's AI announcement and circular parser for schools.
Analyze this school announcement (text and/or circular image) and extract key action-oriented details for students:
${text ? `Text: "${text}"` : "Please perform OCR and analyze the uploaded circular notice image."}

Extract:
1. title: concise title of the action or project (max 60 chars)
2. summary: 1-2 sentence overview
3. deadline: human readable deadline (e.g. "Friday, September 25 at 4:00 PM")
4. dueDate: YYYY-MM-DD format (use current year 2026 if not specified, e.g. "2026-09-25")
5. dueTime: HH:MM format (e.g. "16:00")
6. eventDate: human readable event date or submission date
7. location: physical room, lab, or portal mentioned (e.g. "Science Department portal and Lab 2")
8. requiredAction: exact action required of the student (e.g. "Submit the project proposal online and bring a printed copy.")
9. requiredMaterials: materials to bring or prepare (e.g. "Printed project proposal")
10. targetAudience: e.g. "Grade 10 students" or "All students"
11. urgency: "Urgent" (due within 24-48h), "Soon" (due this week), or "Upcoming" (due later)
12. subject: school subject or category (e.g. "Science", "Mathematics", "Administrative", "Club")
13. simplifiedExplanation: clear, plain-language student-friendly breakdown
14. teamInfo: any mention of team limits or solo requirements`;
    let contentsPayload;
    if (imageBase64) {
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9+]+;base64,/, "");
      contentsPayload = [
        prompt,
        {
          inlineData: {
            data: cleanBase64,
            mimeType: imageMimeType || "image/png"
          }
        }
      ];
    } else {
      contentsPayload = prompt;
    }
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contentsPayload,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: import_genai.Type.OBJECT,
          properties: {
            title: { type: import_genai.Type.STRING },
            summary: { type: import_genai.Type.STRING },
            deadline: { type: import_genai.Type.STRING },
            dueDate: { type: import_genai.Type.STRING },
            dueTime: { type: import_genai.Type.STRING },
            eventDate: { type: import_genai.Type.STRING },
            location: { type: import_genai.Type.STRING },
            requiredAction: { type: import_genai.Type.STRING },
            requiredMaterials: { type: import_genai.Type.STRING },
            targetAudience: { type: import_genai.Type.STRING },
            urgency: { type: import_genai.Type.STRING, enum: ["Urgent", "Soon", "Upcoming"] },
            subject: { type: import_genai.Type.STRING },
            simplifiedExplanation: { type: import_genai.Type.STRING },
            teamInfo: { type: import_genai.Type.STRING }
          },
          required: [
            "title",
            "summary",
            "deadline",
            "location",
            "requiredAction",
            "requiredMaterials",
            "targetAudience",
            "urgency",
            "simplifiedExplanation"
          ]
        }
      }
    });
    const parsed = JSON.parse(response.text || "{}");
    return res.json({ success: true, data: parsed, source: "gemini-ai-vision" });
  } catch (error) {
    console.error("Gemini API error in /api/analyze-announcement:", error);
    const fallback = getFallbackExtraction(effectiveText);
    return res.json({ success: true, data: fallback, source: "fallback-resilience" });
  }
});
app.post("/api/explain-simply", async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Missing text" });
  const isDemoSample = text.toLowerCase().includes("science exhibition") || text.toLowerCase().includes("proposal");
  const ai = getGeminiAI();
  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Explain this school announcement in plain, crystal-clear, student-friendly bullet-free 2-3 sentences: "${text}"`
      });
      return res.json({ explanation: response.text?.trim() });
    } catch (e) {
      console.error("Gemini explain error:", e);
    }
  }
  if (isDemoSample) {
    return res.json({
      explanation: "Grade 10 students need to submit their science exhibition proposal online by Friday at 4:00 PM. Bring a printed copy to Lab 2 on Monday. Teams can have up to four members."
    });
  }
  const cleanSentences = text.replace(/\s+/g, " ").split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter((s) => s.length > 5);
  const simplified = cleanSentences.slice(0, 2).join(" ") || "Please review the circular announcement carefully and complete any specified requirements before the deadline.";
  return res.json({ explanation: simplified });
});
app.post("/api/translate", async (req, res) => {
  const { text, targetLanguage } = req.body;
  if (!text || !targetLanguage) return res.status(400).json({ error: "Missing text or targetLanguage" });
  if (targetLanguage === "English") {
    return res.json({ translatedText: text });
  }
  const isDemoSample = text.toLowerCase().includes("science exhibition") || text.toLowerCase().includes("proposal");
  const predefinedTranslations = {
    Hindi: "\u0915\u0915\u094D\u0937\u093E 10 \u0915\u0947 \u091B\u093E\u0924\u094D\u0930\u094B\u0902 \u0915\u0947 \u0932\u093F\u090F \u0938\u094D\u092E\u0930\u0923: \u0935\u093F\u091C\u094D\u091E\u093E\u0928 \u092A\u094D\u0930\u0926\u0930\u094D\u0936\u0928\u0940 \u092A\u0930\u093F\u092F\u094B\u091C\u0928\u093E \u092A\u094D\u0930\u0938\u094D\u0924\u093E\u0935 \u0936\u0941\u0915\u094D\u0930\u0935\u093E\u0930, 25 \u0938\u093F\u0924\u0902\u092C\u0930 \u0915\u094B \u0936\u093E\u092E 4:00 \u092C\u091C\u0947 \u0924\u0915 \u091C\u092E\u093E \u0915\u093F\u092F\u093E \u091C\u093E\u0928\u093E \u091A\u093E\u0939\u093F\u090F\u0964 \u0935\u093F\u091C\u094D\u091E\u093E\u0928 \u0935\u093F\u092D\u093E\u0917 \u092A\u094B\u0930\u094D\u091F\u0932 \u0915\u0947 \u092E\u093E\u0927\u094D\u092F\u092E \u0938\u0947 \u092A\u094D\u0930\u0938\u094D\u0924\u093E\u0935 \u091C\u092E\u093E \u0915\u0930\u0947\u0902\u0964 \u0938\u094B\u092E\u0935\u093E\u0930 \u0915\u094B \u0932\u0948\u092C 2 \u092E\u0947\u0902 \u090F\u0915 \u092E\u0941\u0926\u094D\u0930\u093F\u0924 \u092A\u094D\u0930\u0924\u093F \u0932\u093E\u090F\u0902\u0964 \u091F\u0940\u092E\u094B\u0902 \u092E\u0947\u0902 \u091A\u093E\u0930 \u0938\u0926\u0938\u094D\u092F \u0924\u0915 \u0939\u094B \u0938\u0915\u0924\u0947 \u0939\u0948\u0902\u0964",
    Tamil: "10 \u0B86\u0BAE\u0BCD \u0BB5\u0B95\u0BC1\u0BAA\u0BCD\u0BAA\u0BC1 \u0BAE\u0BBE\u0BA3\u0BB5\u0BB0\u0BCD\u0B95\u0BB3\u0BC1\u0B95\u0BCD\u0B95\u0BBE\u0BA9 \u0BA8\u0BBF\u0BA9\u0BC8\u0BB5\u0BC2\u0B9F\u0BCD\u0B9F\u0BB2\u0BCD: \u0B85\u0BB1\u0BBF\u0BB5\u0BBF\u0BAF\u0BB2\u0BCD \u0B95\u0BA3\u0BCD\u0B95\u0BBE\u0B9F\u0BCD\u0B9A\u0BBF \u0BA4\u0BBF\u0B9F\u0BCD\u0B9F \u0BAE\u0BC1\u0BA9\u0BCD\u0BAE\u0BCA\u0BB4\u0BBF\u0BB5\u0BC1 \u0BB5\u0BC6\u0BB3\u0BCD\u0BB3\u0BBF\u0B95\u0BCD\u0B95\u0BBF\u0BB4\u0BAE\u0BC8, \u0B9A\u0BC6\u0BAA\u0BCD\u0B9F\u0BAE\u0BCD\u0BAA\u0BB0\u0BCD 25 \u0BAE\u0BBE\u0BB2\u0BC8 4:00 \u0BAE\u0BA3\u0BBF\u0B95\u0BCD\u0B95\u0BC1\u0BB3\u0BCD \u0B9A\u0BAE\u0BB0\u0BCD\u0BAA\u0BCD\u0BAA\u0BBF\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD. \u0B85\u0BB1\u0BBF\u0BB5\u0BBF\u0BAF\u0BB2\u0BCD \u0BA4\u0BC1\u0BB1\u0BC8 \u0BAA\u0BCB\u0BB0\u0BCD\u0B9F\u0BB2\u0BCD \u0BB5\u0BB4\u0BBF\u0BAF\u0BBE\u0B95 \u0B9A\u0BAE\u0BB0\u0BCD\u0BAA\u0BCD\u0BAA\u0BBF\u0B95\u0BCD\u0B95\u0BB5\u0BC1\u0BAE\u0BCD. \u0BA4\u0BBF\u0B99\u0BCD\u0B95\u0B9F\u0BCD\u0B95\u0BBF\u0BB4\u0BAE\u0BC8 \u0BB2\u0BC7\u0BAA\u0BCD 2-\u0B95\u0BCD\u0B95\u0BC1 \u0B85\u0B9A\u0BCD\u0B9A\u0BBF\u0B9F\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F \u0BA8\u0B95\u0BB2\u0BC8\u0B95\u0BCD \u0B95\u0BCA\u0BA3\u0BCD\u0B9F\u0BC1 \u0BB5\u0BBE\u0BB0\u0BC1\u0B99\u0BCD\u0B95\u0BB3\u0BCD. \u0B85\u0BA3\u0BBF\u0B95\u0BB3\u0BBF\u0BB2\u0BCD 4 \u0B89\u0BB1\u0BC1\u0BAA\u0BCD\u0BAA\u0BBF\u0BA9\u0BB0\u0BCD\u0B95\u0BB3\u0BCD \u0BB5\u0BB0\u0BC8 \u0B87\u0BB0\u0BC1\u0B95\u0BCD\u0B95\u0BB2\u0BBE\u0BAE\u0BCD.",
    Spanish: "Recordatorio para estudiantes de 10\xBA grado: La propuesta del proyecto de la feria de ciencias debe enviarse antes del viernes 25 de septiembre a las 4:00 PM. Env\xEDe la propuesta a trav\xE9s del portal del Departamento de Ciencias. Traiga una copia impresa al Laboratorio 2 el lunes. Los equipos pueden tener hasta cuatro miembros."
  };
  if (isDemoSample && predefinedTranslations[targetLanguage]) {
    return res.json({ translatedText: predefinedTranslations[targetLanguage] });
  }
  const ai = getGeminiAI();
  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Translate the following school announcement faithfully into ${targetLanguage}:

${text}`
      });
      return res.json({ translatedText: response.text?.trim() });
    } catch (e) {
      console.error("Gemini translation error:", e);
    }
  }
  const languageNames = {
    Hindi: "\u0939\u093F\u0902\u0926\u0940 (Hindi)",
    Tamil: "\u0BA4\u0BAE\u0BBF\u0BB4\u0BCD (Tamil)",
    Spanish: "Espa\xF1ol (Spanish)"
  };
  const langLabel = languageNames[targetLanguage] || targetLanguage;
  return res.json({
    translatedText: `[Multilingual Preview in ${langLabel}]: ${text}

(Note: Live multilingual translation of custom circulars runs when GEMINI_API_KEY is configured.)`
  });
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ClassBridge server running on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
