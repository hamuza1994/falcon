import { GoogleGenAI, Type } from "@google/genai";

const GEMINI_API_KEY = process.env.API_KEY;
const PRO_MODEL = "gemini-2.0-flash";
const FLASH_MODEL = "gemini-2.0-flash";


export async function performRiskCorrelation(employeeData: any) {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: PRO_MODEL,
      contents: `Perform a deep security risk assessment for the following government employee data. 
      Analyze for anomalies like sudden wealth, suspicious travel, relationship flags, or ideological dissent.
      Return a risk score (0-100) and a summary of findings.
      Employee Data: ${JSON.stringify(employeeData)}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskScore: { type: Type.NUMBER },
            riskLevel: { type: Type.STRING },
            findings: { type: Type.ARRAY, items: { type: Type.STRING } },
            summary: { type: Type.STRING }
          },
          required: ["riskScore", "riskLevel", "findings", "summary"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("ICE Analysis Error:", error);
    throw error;
  }
}

/**
 * BIOMETRIC FACIAL RECOGNITION (RECONCILIATION)
 * Scans an image and correlates features with the National Identity Database.
 */
export async function performBiometricMatch(base64Image: string, knownSubjects: any[]) {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const imagePart = {
      inlineData: {
        mimeType: 'image/jpeg',
        data: base64Image,
      },
    };
    
    const textPart = {
      text: `ACT AS A STATE FORENSIC FACIAL RECOGNITION SYSTEM (FALCON-RECON). 
      Analyze the provided visual input (CCTV frame, ID photo, or live capture). 
      You MUST identify the closest match from this secure national subject database: 
      ${JSON.stringify(knownSubjects.map(s => ({ 
        id: s.nationalId || s.nspid, 
        name: s.fullName, 
        type: s.nspid ? 'GOVERNMENT_EMPLOYEE' : 'PUBLIC_CITIZEN',
        rank: s.rank || 'N/A',
        occupation: s.occupation || 'N/A'
      })))}.

      FORENSIC TASK:
      1. Map the facial geometry (inter-ocular distance, nasal bridge width, jawline curvature).
      2. Compare against the provided database ID records.
      3. Determine if the subject is a Government Employee (Sovereign Personnel) or a Public Citizen.
      
      Return ONLY a raw JSON object with this schema:
      {
        "matchId": "The EXACT National ID or NSPID from the database",
        "confidence": 0-100,
        "isStaff": boolean,
        "biometricAnalysis": {
          "geometryMatch": "Description of matching facial markers",
          "structuralIntegrity": "High/Medium/Low",
          "forensicDossierSummary": "A concise expert narrative explaining the match and subject background."
        }
      }
      If NO match is reasonably close (confidence < 40%), return matchId: null.`
    };

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",

      contents: { parts: [imagePart, textPart] },
    });
    
    const text = (response.text || "{}").replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(text);
  } catch (error: any) {
    if (error.message?.includes("Requested entity was not found.")) {
       if (window.aistudio) await window.aistudio.openSelectKey();
    }
    console.error("Biometric Scanner Error:", error);
    throw error;
  }
}

export async function analyzePublicSentiment(context: string) {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: FLASH_MODEL,
      contents: `Perform NLP sentiment analysis on the following Ugandan public discourse context: "${context}".
      Identify key political hashtags, sentiment polarities (Supportive vs Dissent), and potential rally points.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sentimentScore: { type: Type.NUMBER },
            trendingKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            dissentProbability: { type: Type.NUMBER },
            summary: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Sentiment Analysis Error:", error);
    throw error;
  }
}

export async function generateContainmentStrategy(incident: any, subject: any) {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: PRO_MODEL,
      contents: `ACT AS A NATIONAL SECURITY COMMANDER.
      A security incident has occurred: ${JSON.stringify(incident)}.
      The subject is: ${JSON.stringify(subject)}.
      Generate a multi-step containment strategy.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            priority: { type: Type.STRING },
            steps: { type: Type.ARRAY, items: { type: Type.STRING } },
            legalJustification: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Containment Generation Error:", error);
    throw error;
  }
}

export async function simulatePolicyImpact(proposal: string) {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: PRO_MODEL,
      contents: `ACT AS A PRESIDENTIAL POLICY ADVISOR.
      Analyze the following policy proposal for Uganda: "${proposal}".
      
      Predict the impact in the following areas:
      1. Public Sentiment (0-100 score where 100 is very positive, and trend 'UP'/'DOWN')
      2. Economic Impact (GDP, Inflation, Revenue projections)
      3. Political Risk (Low/Medium/High and description)
      4. Key Stakeholder Reactions (Parliament, Donors, Civil Society)
      
      Return JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sentimentScore: { type: Type.NUMBER },
            sentimentTrend: { type: Type.STRING },
            economicImpact: { type: Type.STRING },
            politicalRisk: { type: Type.STRING },
            stakeholderReactions: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendation: { type: Type.STRING }
          },
          required: ["sentimentScore", "sentimentTrend", "economicImpact", "politicalRisk", "stakeholderReactions", "recommendation"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Policy Sim Error:", error);
    throw error;
  }
}


function getAI() {
  if (!GEMINI_API_KEY) {
    throw new Error("Gemini API key not configured. Set VITE_GEMINI_API_KEY in your .env file.");
  }
  return new GoogleGenAI({ apiKey: GEMINI_API_KEY });
}

export async function generateIntelReport(
  input: string,
  mediaFiles: { mimeType: string; data: string }[] = []
) {
  try {
    const ai = getAI(); // ← use the helper, never hardcode
    
    const parts: any[] = [
      { 
        text: `ACT AS A SENIOR INTELLIGENCE ANALYST (FALCON COMMAND).
        Analyze the following raw field notes, scenario, and any provided forensic attachments.
        
        Raw Input: "${input}"
        
        Generate a Formal Situation Report (SITREP):
        1. Classification (TOP SECRET / SECRET / CONFIDENTIAL)
        2. Threat Level (LOW / MEDIUM / HIGH / CRITICAL)
        3. Executive Summary
        4. Threat Assessment
        5. Strategic Implications
        6. Recommended Actions
        
        Return JSON.` 
      }
    ];

    mediaFiles.forEach(file => {
      parts.push({ inlineData: { mimeType: file.mimeType, data: file.data } });
    });

    const response = await ai.models.generateContent({
      model: PRO_MODEL,
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            classification:       { type: Type.STRING },
            threatLevel:          { type: Type.STRING },
            executiveSummary:     { type: Type.STRING },
            threatAssessment:     { type: Type.STRING },
            strategicImplications:{ type: Type.STRING },
            recommendedActions:   { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: [
            "classification", "threatLevel", "executiveSummary",
            "threatAssessment", "strategicImplications", "recommendedActions"
          ]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Intel Report Error:", error);
    throw error;
  }
}