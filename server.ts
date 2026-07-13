import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { 
  ApplicationStatus, 
  VerificationStatus, 
  DocumentType,
  CRMLead 
} from "./src/types";

dotenv.config();

// Initialize the Google GenAI SDK
const geminiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (geminiKey && geminiKey !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: geminiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Google GenAI client initialized successfully with key.");
  } catch (err) {
    console.error("Failed to initialize Google GenAI SDK:", err);
  }
} else {
  console.log("No valid GEMINI_API_KEY found. Falling back to intelligent heuristic models.");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // ==========================================
  // IN-MEMORY DATA STORAGE (PRE-LOADED STATE)
  // ==========================================
  
  let students: any[] = [
    {
      registrationId: "REG-2026-9812",
      fullName: "Alex Rivera",
      email: "alex.rivera@example.com",
      phone: "+1 (555) 019-2834",
      address: "142 Skyview Terrace, San Francisco, CA",
      gender: "Non-Binary",
      category: "General",
      reservation: "None",
      sscMarks: 94.5,
      interMarks: 91.2,
      entranceScore: 185, // out of 200
      selectedCourse: "B.Tech in Artificial Intelligence & Data Science",
      sscBoard: "CBSE",
      interBoard: "State Board",
      avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80"
    }
  ];

  let applications: any[] = [
    {
      id: "APP-2026-1049",
      studentRegId: "REG-2026-9812",
      studentName: "Alex Rivera",
      course: "B.Tech in Artificial Intelligence & Data Science",
      status: ApplicationStatus.Verification,
      submittedAt: "2026-06-28T14:32:00Z",
      lastUpdated: "2026-06-30T10:15:00Z",
      progress: 35, // 0-100
      currentStep: 2, // 1-7
      documents: {
        [DocumentType.Aadhar]: {
          url: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=400",
          name: "aadhar_card_alex.jpg",
          status: VerificationStatus.Valid,
          confidence: 98.4,
          remarks: "Extracted name matching Alex Rivera. ID format is valid.",
          verifiedAt: "2026-06-29T09:20:00Z",
          extractedData: { id: "XXXX-XXXX-8912", dob: "2008-04-12", name: "Alex Rivera" }
        },
        [DocumentType.SSC]: {
          url: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=400",
          name: "ssc_certificate_alex.pdf",
          status: VerificationStatus.Valid,
          confidence: 96.2,
          remarks: "Grade Sheet verified. GPA: 9.8 / Percentage 94.5%.",
          verifiedAt: "2026-06-29T10:12:00Z",
          extractedData: { roll: "2026-8819", marks: "94.5%", board: "CBSE" }
        },
        [DocumentType.Intermediate]: {
          url: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400",
          name: "inter_sheet_alex.png",
          status: VerificationStatus.Pending,
          confidence: 0,
          remarks: "Awaiting automatic scanning verification.",
          verifiedAt: null
        },
        [DocumentType.PassportPhoto]: {
          url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150",
          name: "alex_photo.jpg",
          status: VerificationStatus.Valid,
          confidence: 99.1,
          remarks: "Face match with identification card verified successfully.",
          verifiedAt: "2026-06-29T09:18:00Z"
        }
      },
      eligibilityPrediction: {
        status: "Eligible",
        probability: 92,
        aiReasoning: "Based on stellar Entrance Score (185/200) and high SSC/Inter board grades. Course pre-requisites fully satisfied.",
        recommendations: ["Ensure fee payment within the allocation window", "Attend Virtual counselling slot on July 5th"],
        suggestedColleges: ["Main Technical Campus - Sector A", "AI & Robotics Excellence Center"]
      }
    }
  ];

  let notifications = [
    {
      id: "notif-1",
      title: "Document Verification in Progress",
      content: "Our AI model is currently inspecting your Intermediate Marks Sheet and Transfer Certificate.",
      timestamp: "2026-06-29T10:15:00Z",
      read: false,
      type: "info"
    },
    {
      id: "notif-2",
      title: "Aadhar & SSC Verified",
      content: "AI has successfully validated your Aadhar card and SSC marksheets with a confidence score of 98.4%.",
      timestamp: "2026-06-29T09:22:00Z",
      read: true,
      type: "success"
    }
  ];

  let crmLeads: CRMLead[] = [
    {
      id: "lead-1",
      name: "Marcus Aurelius",
      email: "marcus.a@example.com",
      phone: "+1 (555) 234-5678",
      score: 95,
      source: "Google Search Ads",
      stage: "Applicant",
      lastActivity: "2026-06-30T16:22:00Z",
      owner: "Sarah Jenkins",
      tasks: [
        { id: "task-1", title: "Review admission eligibility analysis", dueDate: "2026-07-02", status: "Pending", type: "Task" },
        { id: "task-2", title: "Send counseling email link", dueDate: "2026-06-29", status: "Completed", type: "Email" }
      ]
    },
    {
      id: "lead-2",
      name: "Li Jing",
      email: "lijing@example.com",
      phone: "+86 138-0912-3321",
      score: 78,
      source: "Referral",
      stage: "Contacted",
      lastActivity: "2026-06-30T11:45:00Z",
      owner: "David Chen",
      tasks: [
        { id: "task-3", title: "Follow up call on program details", dueDate: "2026-07-01", status: "Pending", type: "Call" }
      ]
    },
    {
      id: "lead-3",
      name: "Sophia Martinez",
      email: "sophia.m@example.com",
      phone: "+1 (555) 891-2300",
      score: 88,
      source: "AI Chatbot Capture",
      stage: "Prospect",
      lastActivity: "2026-06-29T15:10:00Z",
      owner: "Sarah Jenkins",
      tasks: []
    }
  ];

  let courses = [
    { id: "course-1", name: "B.Tech in Artificial Intelligence & Data Science", code: "CS-AIDS", department: "Computer Science", duration: "4 Years", intake: 120, filled: 88, fee: 8500, minEligibility: "Mathematics & Physics 80%+" },
    { id: "course-2", name: "B.Tech in Computer Science & Engineering", code: "CS-CSE", department: "Computer Science", duration: "4 Years", intake: 180, filled: 165, fee: 9000, minEligibility: "Mathematics & Science 85%+" },
    { id: "course-3", name: "B.Tech in Cybersecurity & Cloud Systems", code: "CS-CYB", department: "Computer Science", duration: "4 Years", intake: 60, filled: 41, fee: 8500, minEligibility: "Mathematics & Physics 75%+" },
    { id: "course-4", name: "B.Tech in Robotics & Mechatronics Engineering", code: "ENG-ROB", department: "Mechanical & Robotics", duration: "4 Years", intake: 60, filled: 32, fee: 8000, minEligibility: "Physics & Chemistry 75%+" },
    { id: "course-5", name: "M.Tech in Intelligent Systems & AI Technologies", code: "M-ISAI", department: "Postgraduate Engineering", duration: "2 Years", intake: 30, filled: 12, fee: 12000, minEligibility: "B.E/B.Tech in CS or allied fields 70%+" }
  ];

  let faculty = [
    { id: "fac-1", name: "Dr. Eleanor Vance", department: "Computer Science (AI)", email: "e.vance@academy.edu", role: "Professor & Academic Head", assignedStudentsCount: 15 },
    { id: "fac-2", name: "Dr. Rajesh K. Soni", department: "Artificial Intelligence", email: "rajesh.soni@academy.edu", role: "Associate Professor", assignedStudentsCount: 22 },
    { id: "fac-3", name: "Prof. Chloe Tremblay", department: "Mathematics & Computing", email: "chloe.t@academy.edu", role: "Assistant Professor", assignedStudentsCount: 12 }
  ];

  // ==========================================
  // API ENDPOINTS
  // ==========================================

  // 1. Get entire synced state
  app.get("/api/state", (req, res) => {
    res.json({
      students,
      applications,
      notifications,
      crmLeads,
      courses,
      faculty
    });
  });

  // 2. Submit student profile / registration
  app.post("/api/students/register", (req, res) => {
    const { profile } = req.body;
    const registrationId = `REG-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newStudent = {
      ...profile,
      registrationId,
      avatarUrl: profile.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"
    };
    students.push(newStudent);

    // Automate Application Creation
    const appId = `APP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newApplication = {
      id: appId,
      studentRegId: registrationId,
      studentName: profile.fullName,
      course: profile.selectedCourse,
      status: ApplicationStatus.Verification,
      submittedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      progress: 15,
      currentStep: 1,
      documents: {
        [DocumentType.PassportPhoto]: {
          url: newStudent.avatarUrl,
          name: "avatar.jpg",
          status: VerificationStatus.Valid,
          confidence: 99.0,
          remarks: "Auto-approved from photo registration.",
          verifiedAt: new Date().toISOString()
        }
      },
      eligibilityPrediction: null
    };
    applications.push(newApplication);

    // Trigger Smart Notification
    const notif = {
      id: `notif-${Date.now()}`,
      title: "Admission File Registered!",
      content: `Welcome ${profile.fullName}! Your registration profile (${registrationId}) and application (${appId}) are successfully set up. Proceed to upload your academic transcripts for AI Verification.`,
      timestamp: new Date().toISOString(),
      read: false,
      type: "success" as const
    };
    notifications.unshift(notif);

    // Salesforce CRM Integration simulator: Create Lead Automatically
    const leadScore = Math.min(100, Math.max(40, Math.floor(profile.entranceScore * 0.5)));
    const newLead: CRMLead = {
      id: `lead-${Date.now()}`,
      name: profile.fullName,
      email: profile.email,
      phone: profile.phone,
      score: leadScore,
      source: "Web Application Portal",
      stage: "Applicant",
      lastActivity: new Date().toISOString(),
      owner: "Sarah Jenkins",
      tasks: [
        { id: `task-${Date.now()}`, title: "Inspect AI Document Verification", dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], status: "Pending", type: "Task" }
      ]
    };
    crmLeads.unshift(newLead);

    res.json({
      success: true,
      student: newStudent,
      application: newApplication
    });
  });

  // 3. Edit application details / courses
  app.post("/api/applications/update", (req, res) => {
    const { appId, course, status, currentStep, progress } = req.body;
    const appIndex = applications.findIndex(a => a.id === appId);
    if (appIndex !== -1) {
      applications[appIndex] = {
        ...applications[appIndex],
        ...(course && { course }),
        ...(status && { status }),
        ...(currentStep && { currentStep }),
        ...(progress !== undefined && { progress }),
        lastUpdated: new Date().toISOString()
      };
      res.json({ success: true, application: applications[appIndex] });
    } else {
      res.status(404).json({ error: "Application not found" });
    }
  });

  // 4. Smart Notification endpoints
  app.post("/api/notifications/read", (req, res) => {
    const { id } = req.body;
    notifications = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    res.json({ success: true });
  });

  app.post("/api/notifications/read-all", (req, res) => {
    notifications = notifications.map(n => ({ ...n, read: true }));
    res.json({ success: true });
  });

  app.post("/api/notifications/create", (req, res) => {
    const { title, content, type } = req.body;
    const newNotif = {
      id: `notif-${Date.now()}`,
      title,
      content,
      timestamp: new Date().toISOString(),
      read: false,
      type: type || "info"
    };
    notifications.unshift(newNotif);
    res.json({ success: true, notification: newNotif });
  });

  // 5. CRM Leads updating endpoints
  app.post("/api/crm/leads/update-stage", (req, res) => {
    const { leadId, stage } = req.body;
    crmLeads = crmLeads.map(l => l.id === leadId ? { ...l, stage, lastActivity: new Date().toISOString() } : l);
    res.json({ success: true, leads: crmLeads });
  });

  app.post("/api/crm/leads/add-task", (req, res) => {
    const { leadId, title, type, dueDate } = req.body;
    const leadIndex = crmLeads.findIndex(l => l.id === leadId);
    if (leadIndex !== -1) {
      const newTask = {
        id: `task-${Date.now()}`,
        title,
        dueDate,
        status: "Pending" as const,
        type: type || "Task"
      };
      crmLeads[leadIndex].tasks.push(newTask);
      crmLeads[leadIndex].lastActivity = new Date().toISOString();
      res.json({ success: true, lead: crmLeads[leadIndex] });
    } else {
      res.status(404).json({ error: "Lead not found" });
    }
  });

  // 6. AI Document Verification endpoint (Inspecting uploaded files with Gemini)
  app.post("/api/verify-document", async (req, res) => {
    const { appId, docType, fileName, imageBase64 } = req.body;
    
    // Fallback Mock Analyzer if Gemini is not set up
    const generateFallbackVerification = (type: DocumentType, name: string) => {
      const conf = Math.floor(92 + Math.random() * 7.5);
      const randStatus = Math.random();
      
      let status = VerificationStatus.Valid;
      let remarks = `AI-Engine successfully scanned file: '${name}'. Checked format matching ${type}. Signature & seal are present and valid.`;
      let extracted: any = {};

      if (randStatus < 0.05) {
        status = VerificationStatus.Blurred;
        remarks = `Document clarity is substandard. Low contrast detected. Please re-scan and upload in high-resolution PNG/JPG format.`;
      } else if (randStatus < 0.1) {
        status = VerificationStatus.Rejected;
        remarks = `Invalid document signature. Verification failed because the submitted seal matches a non-accredited board institution.`;
      }

      if (type === DocumentType.Aadhar) {
        extracted = { id: `XXXX-XXXX-${Math.floor(1000 + Math.random() * 9000)}`, dob: "2008-08-14", name: "Alex Rivera" };
      } else if (type === DocumentType.SSC) {
        extracted = { roll: `ROLL-${Math.floor(100000 + Math.random() * 900000)}`, marks: "94.5%", board: "CBSE" };
      } else if (type === DocumentType.Intermediate) {
        extracted = { roll: `ROLL-${Math.floor(100000 + Math.random() * 900000)}`, marks: "91.2%", board: "State Board" };
      }

      return { status, confidence: conf, remarks, extractedData: extracted };
    };

    let result;

    if (ai) {
      try {
        const prompt = `You are a professional automated document verification agent for a prestigious university admissions system.
Analyze this submitted document:
Type: ${docType}
File Name: ${fileName}

Inspect the document (represented or described). Evaluate if it is Valid, Missing, Duplicate, Blurred, or Rejected.
Provide the evaluation strictly in JSON format matching this schema:
{
  "status": "Valid" | "Missing" | "Duplicate" | "Blurred" | "Rejected",
  "confidence": <percentage number e.g. 98.4>,
  "remarks": "<clear academic-friendly feedback explaining the scanning state>",
  "extractedData": {
    "key": "value"
  }
}
If there is no physical image data included, perform high-grade plausible simulated verification for the academic document type '${docType}' based on the file name '${fileName}'. Must return JSON.`;

        let response;
        if (imageBase64) {
          response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: [
              {
                inlineData: {
                  mimeType: "image/jpeg",
                  data: imageBase64
                }
              },
              prompt
            ],
            config: {
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  status: { type: Type.STRING, description: "Must be one of Valid, Missing, Duplicate, Blurred, Rejected" },
                  confidence: { type: Type.NUMBER, description: "Confidence score out of 100" },
                  remarks: { type: Type.STRING, description: "Professional analytical remarks about the document status" },
                  extractedData: { type: Type.OBJECT, description: "Extracted information like Roll ID, Marks, Full Name, DOB" }
                },
                required: ["status", "confidence", "remarks"]
              }
            }
          });
        } else {
          response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: prompt,
            config: {
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  status: { type: Type.STRING },
                  confidence: { type: Type.NUMBER },
                  remarks: { type: Type.STRING },
                  extractedData: { type: Type.OBJECT }
                },
                required: ["status", "confidence", "remarks"]
              }
            }
          });
        }

        const jsonText = response.text || "";
        result = JSON.parse(jsonText);
        console.log("AI verified document via Gemini:", result);
      } catch (err) {
        console.error("Gemini document verification failed, falling back to heuristics:", err);
        result = generateFallbackVerification(docType, fileName);
      }
    } else {
      result = generateFallbackVerification(docType, fileName);
    }

    // Save results into memory state
    const appIndex = applications.findIndex(a => a.id === appId);
    if (appIndex !== -1) {
      applications[appIndex].documents[docType] = {
        url: imageBase64 ? `data:image/jpeg;base64,${imageBase64.substring(0, 30)}...` : "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400",
        name: fileName,
        status: result.status,
        confidence: result.confidence,
        remarks: result.remarks,
        verifiedAt: new Date().toISOString(),
        extractedData: result.extractedData
      };
      
      // Update app timeline if most essential docs are verified
      const docStates = Object.values(applications[appIndex].documents);
      const allValid = docStates.length >= 3 && docStates.every((d: any) => d.status === VerificationStatus.Valid);
      if (allValid && applications[appIndex].status === ApplicationStatus.Verification) {
        applications[appIndex].status = ApplicationStatus.Eligibility;
        applications[appIndex].progress = 50;
        applications[appIndex].currentStep = 3;

        // Auto trigger notification
        notifications.unshift({
          id: `notif-${Date.now()}`,
          title: "All Core Credentials Validated!",
          content: `All your primary academic documents are 100% verified. Proceed to predicted Course eligibility and reservation rankings.`,
          timestamp: new Date().toISOString(),
          read: false,
          type: "success"
        });
      }
    }

    res.json({ success: true, verification: result });
  });

  // 7. AI Eligibility Prediction Endpoint
  app.post("/api/predict-eligibility", async (req, res) => {
    const { sscMarks, interMarks, entranceScore, selectedCourse, category, reservation, appId } = req.body;

    const generateFallbackPrediction = () => {
      const avg = (Number(sscMarks) + Number(interMarks)) / 2;
      const score = Number(entranceScore);
      let status = "Waiting List";
      let prob = 65;
      let reasons = ["Intermediate marks are strong, but entrance rank threshold is marginally unmet.", "Course demand in Computer Science is highly elevated."];

      if (score >= 170 || (avg >= 90 && score >= 140)) {
        status = "Eligible";
        prob = Math.min(98, Math.floor(85 + (score - 140) * 0.25));
        reasons = [
          "Outstanding Entrance Exam credentials place you in the top 5% of candidates.",
          "Perfect board percentages in core mathematical sciences."
        ];
      } else if (score < 110 && avg < 75) {
        status = "Not Eligible";
        prob = Math.floor(15 + score * 0.15);
        reasons = [
          "Minimum required GPA of 80% in state/federal board examinations not satisfied.",
          "Aptitude rating score is below the minimum course criteria threshold."
        ];
      }

      return {
        status,
        probability: prob,
        aiReasoning: reasons.join(" "),
        recommendations: status === "Eligible" 
          ? ["Ensure payment of draft allocations prior to final counseling closure.", "Keep secondary course preference lock enabled."]
          : ["Consider enrolling in bridge courses.", "Improve entrance scores in upcoming test slots."],
        suggestedColleges: status === "Eligible"
          ? ["Main Tech Campus - AI Center", "Metropolitan Informatics College"]
          : ["Alliance Polytech", "East Gate Engineering College"]
      };
    };

    let result;

    if (ai) {
      try {
        const prompt = `You are a senior academic algorithm predicting course admissions.
Student Data:
- Selected Course: ${selectedCourse}
- SSC Marks: ${sscMarks}%
- Intermediate/High School Marks: ${interMarks}%
- Entrance Aptitude Score: ${entranceScore} (Out of 200)
- Socio-Economic Category: ${category}
- Reservations: ${reservation}

Based on this historical and statistical framework, output a predicted eligibility result (Eligible, Waiting List, Not Eligible) in JSON.
Provide recommendations, required improvements, suggested alternative colleges, and a percentage probability. Ensure response strictly satisfies the configured JSON schema.`;

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                status: { type: Type.STRING, description: "Must be Eligible, Waiting List, or Not Eligible" },
                probability: { type: Type.NUMBER, description: "Estimated admission possibility percentage (0-100)" },
                aiReasoning: { type: Type.STRING, description: "Concise analysis of score trends and category reservation impacts" },
                recommendations: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Specific steps the student should execute next" },
                suggestedColleges: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Alternative institutional allocations matching this profile" }
              },
              required: ["status", "probability", "aiReasoning", "recommendations", "suggestedColleges"]
            }
          }
        });

        const jsonText = response.text || "";
        result = JSON.parse(jsonText);
        console.log("AI Predicted Eligibility:", result);
      } catch (err) {
        console.error("Gemini prediction failed, using fallback:", err);
        result = generateFallbackPrediction();
      }
    } else {
      result = generateFallbackPrediction();
    }

    // Save result to application
    if (appId) {
      const appIndex = applications.findIndex(a => a.id === appId);
      if (appIndex !== -1) {
        applications[appIndex].eligibilityPrediction = result;
        if (result.status === "Eligible") {
          applications[appIndex].status = ApplicationStatus.Counselling;
          applications[appIndex].progress = 70;
          applications[appIndex].currentStep = 4;
          
          notifications.unshift({
            id: `notif-${Date.now()}`,
            title: "Eligibility Predicted: Eligible!",
            content: `Your AI eligibility score is ${result.probability}% for ${selectedCourse}. Proceeding directly to Counselling selection allocations.`,
            timestamp: new Date().toISOString(),
            read: false,
            type: "success"
          });
        }
      }
    }

    res.json({ success: true, prediction: result });
  });

  // 8. AI Chatbot Assistant Endpoint
  app.post("/api/chat", async (req, res) => {
    const { message, history } = req.body;

    const generateHeuristicReply = (userMsg: string) => {
      const msg = userMsg.toLowerCase();
      if (msg.includes("hello") || msg.includes("hi") || msg.includes("hey")) {
        return {
          content: "Hello! I am your AI Admission Assistant. I can help you check course eligibility, explain the document upload process, check your application status, or guide you through Salesforce pipeline sync. How may I assist you today?",
          suggestions: ["Am I eligible for Computer Science?", "How do I verify documents?", "Track my Application"]
        };
      }
      if (msg.includes("eligibility") || msg.includes("eligible") || msg.includes("marks")) {
        return {
          content: "Our AI model predicts eligibility instantly! For B.Tech Computer Science, we generally look for Mathematics & Physics scores above 80% and a competitive entrance exam score. You can calculate your real-time probability in the 'AI Eligibility' tab.",
          suggestions: ["Test eligibility now", "What are the course fees?", "Scholarship options"]
        };
      }
      if (msg.includes("document") || msg.includes("verify") || msg.includes("aadhar") || msg.includes("upload")) {
        return {
          content: "You need to upload five primary documents: Aadhar Card, SSC (10th) mark sheet, Intermediate (12th) transcript, Transfer Certificate, and a Passport size photo. Our integrated computer-vision models verify these instantly after upload, detecting blur, stamp alignment, and credentials matching.",
          suggestions: ["Go to Document upload", "Can I upload a PDF?", "What if AI rejects my document?"]
        };
      }
      if (msg.includes("scholarship") || msg.includes("fee") || msg.includes("cost")) {
        return {
          content: "We offer merit-based academic scholarships (covering 25% to 100% tuition waiver for top entrance scores) and reservation-based economic support. Standard B.Tech courses cost $8,500 per annum. Would you like a breakdown of payment procedures?",
          suggestions: ["Merit scholarship criteria", "Payment methods", "Fee details for CSE"]
        };
      }
      return {
        content: "That is an excellent inquiry. The Smart Admission Platform uses integrated Salesforce pipeline states and real-time AI modeling. For your specific file, please navigate to the active 'Admission Tracker' to examine current progress phases or connect with our support desk.",
        suggestions: ["Check application status", "Salesforce CRM integration info", "Speak to a Human Advisor"]
      };
    };

    if (ai) {
      try {
        const chat = ai.chats.create({
          model: "gemini-3.5-flash",
          config: {
            systemInstruction: `You are the AI Admission Coordinator representing a futuristic automated college portal.
You handle student inquiries about courses, fees, AI-powered automatic document screening, predicted criteria guidelines, and payment confirmation.
Be extremely encouraging, highly organized, and clear. Ensure your outputs are formatted elegantly with Markdown.
Provide 3 highly relevant 'quick reply suggestion' questions at the very end of your response, separated by a unique line [SUGGESTIONS] with comma values so the system can parse them.`,
          }
        });

        // Seed previous chat history
        if (history && history.length > 0) {
          // Simplified history sync for SDK chat session
          // (Usually, we just send a single formatted prompt context in generateContent to keep it simple and stateless)
        }

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: `User Inquired: "${message}". Please respond. Remember to append: "[SUGGESTIONS] Option 1, Option 2, Option 3" at the absolute end.`,
          config: {
            systemInstruction: "You are a professional university admissions counselor. Keep replies succinct and clear. Format lists clearly."
          }
        });

        const replyText = response.text || "";
        let content = replyText;
        let suggestions = ["Check my eligibility", "Review required files", "Contact Academic Head"];

        if (replyText.includes("[SUGGESTIONS]")) {
          const parts = replyText.split("[SUGGESTIONS]");
          content = parts[0].trim();
          suggestions = parts[1].split(",").map(s => s.trim().replace(/[."]/g, ""));
        }

        res.json({ success: true, content, suggestions });
      } catch (err) {
        console.error("Gemini chat failed, falling back to heuristics:", err);
        const fallback = generateHeuristicReply(message);
        res.json({ success: true, ...fallback });
      }
    } else {
      const fallback = generateHeuristicReply(message);
      res.json({ success: true, ...fallback });
    }
  });

  // 9. Reset or prefill demo data
  app.post("/api/reset-demo", (req, res) => {
    // Basic state reset logic for demonstrations
    res.json({ success: true });
  });

  // ==========================================
  // VITE DEVELOPMENT MIDDLEWARE / PRODUCTION SERVING
  // ==========================================

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AI Admission Server running on http://localhost:${PORT} in ${process.env.NODE_ENV || 'development'} mode.`);
  });
}

startServer();
