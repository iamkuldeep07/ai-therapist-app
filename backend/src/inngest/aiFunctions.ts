import { inngest } from "./index";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { logger } from "../utils/logger";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Function to handle chat message processing
export const processChatMessage = inngest.createFunction(
  {
    id: "process-chat-message",
  },
  { event: "therapy/session.message" },
  async ({ event, step }) => {
    try {
      const {
        message,
        history,
        memory = {
          userProfile: {
            emotionalState: [],
            riskLevel: 0,
            preferences: {},
          },
          sessionContext: {
            conversationThemes: [],
            currentTechnique: null,
          },
        },
        goals = [],
        systemPrompt,
      } = event.data;

      logger.info("Processing chat message:", {
        message,
        historyLength: history?.length,
      });

      const analysis = await step.run("analyze-message", async () => {
        try {
          const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash ",
          });

          const prompt = `Analyze this therapy message and provide insights. Return ONLY a valid JSON object with no markdown formatting or additional text.
            Message: ${message}
            Context: ${JSON.stringify({ memory, goals })}

            Required JSON structure: {
               "emotionalState": "string",
               "themes": ["string"],
               "riskLevel": number,
               "recommendedApproach": "string",
               "progressIndicators": ["string"]
            }`;

          const result = await model.generateContent(prompt);
          const response = await result.response;
          const text = response.text().trim();

          logger.info("Received analysis from Gemini:", { text });

          const cleanText = text.replace(/```json\n|\n```/g, "").trim();
          const parsedAnalysis = JSON.parse(cleanText);

          logger.info("Successfully parsed analysis:", parsedAnalysis);
          return parsedAnalysis;
        } catch (error) {
          logger.error("Error in message analysis:", { error, message });

          return {
            emotionalState: "neutral",
            themes: [],
            riskLevel: 0,
            recommendedApproach: "supportive",
            progressIndicators: [],
          };
        }
      });

      const updateMemory = await step.run("update-memory", async () => {
        if (analysis.emotionalState) {
          memory.userProfile.emotionalState.push(analysis.emotionalState);
        }
        if (analysis.themes) {
          memory.sessionContext.conversationThemes.push(...analysis.themes);
        }
        if (analysis.riskLevel) {
          memory.userProfile.riskLevel = analysis.riskLevel;
        }
        return memory;
      });

      if (analysis.riskLevel > 4) {
        await step.run("trigger-risk-alert", async () => {
          logger.warn("High risk level detected in chat message", {
            message,
            riskLevel: analysis.riskLevel,
          });
        });
      }

      const response = await step.run("generate-response", async () => {
        try {
          const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

          const prompt = `${systemPrompt}

            Based on the following context, generate a therapeutic response:
            Message: ${message}
            Analysis: ${JSON.stringify(analysis)}
            Memory: ${JSON.stringify(memory)}
            Goals: ${JSON.stringify(goals)}

            Provide a response that: 
            1. Addresses the immediate emotional needs
            2. Uses appropriate therapeutic techniques
            3. Shows empathy and understanding
            4. Maintains professional boundaries
            5. Considers safety and well-being`;

          const result = await model.generateContent(prompt);
          const responseText = result.response.text().trim();

          logger.info("Generated response:", { responseText });
          return responseText;
        } catch (error) {
          logger.error("Error generating response:", { error, message });
          return "I'm here to support you. Could you tell me more about what's on your mind?";
        }
      });

      return {
        response,
        analysis,
        updateMemory,
      };
    } catch (error) {
      logger.error("Error in chat message processing:", {
        error,
        message: event.data.message,
      });

      return {
        response:
          "I'm here to support you. Could you tell me more about what's on your mind?",
        analysis: {
          emotionalState: "neutral",
          themes: [],
          riskLevel: 0,
          recommendedApproach: "supportive",
          progressIndicators: [],
        },
        updateMemory: event.data.memory,
      };
    }
  }
);

export const analyzeTherapySession = inngest.createFunction(
  { id: "analyze-therapy-session" },
  { event: "therapy/session.created" },
  async ({ event, step }) => {
    try {
      const sessionContent = await step.run("get-session-content", async () => {
        return event.data.notes || event.data.transcript;
      });

      const analysis = await step.run("analyze-with-gemini", async () => {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `Analyze this therapy session and provide insights: 
                Session Content: ${sessionContent}

                Please provide:
                1. Key themes and topics discussed
                2. Emotional state analysis
                3. Potential areas of concern
                4. Reccomendations for follow-up
                5. Progress indicators

                Format the response as a JSON object.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return JSON.parse(text);
      });

      await step.run("store-analysis", async () => {
        logger.info("Session analysis stored successfully");
        return analysis;
      });

      if (analysis.areasOfConcern?.length > 0) {
        await step.run("trigger-concern-alert", async () => {
          logger.warn("Concerning indicators detected in session analysis", {
            sessionId: event.data.sessionId,
            concerns: analysis.areasOfConcern,
          });
        });
      }

      return {
        message: "Session analysis completed",
        analysis,
      };
    } catch (error) {
      logger.error("Error in therapy session analysis:", error);
      throw error;
    }
  }
);

export const generateActivityRecommendations = inngest.createFunction(
  { id: "generate-activity-recommendations" },
  { event: "mood/updated" },
  async ({ event, step }) => {
    try {
      const userContext = await step.run("get-user-context", async () => {
        return {
          recentMoods: event.data.recentMoods,
          completedActivities: event.data.completedActivities,
          preferences: event.data.preferences,
        };
      });

      const recommendations = await step.run(
        "generate-recommendations",
        async () => {
          const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

          const prompt = `Based on the following user context, generate personalized activity recommendations:
                User Context: ${JSON.stringify(userContext)}
                
                Please provide:
                1. 3-5 personalized activity recommendations
                2. Reasoning for each recommendation
                3. Expected benefits
                4. Difficulty level
                5. Estimated duration

                Format the response as a JSON object.`;

          const result = await model.generateContent(prompt);
          const response = await result.response;
          const text = response.text();

          return JSON.parse(text);
        }
      );

      await step.run("store-recommendations", async () => {
        logger.info("Activity recommendations stored successfully");
        return recommendations;
      });

      return {
        message: "Activity recommendations generated",
        recommendations,
      };
    } catch (error) {
      logger.error("Error generating activity recommendations:", error);
      throw error;
    }
  }
);

export const functions = [
  processChatMessage,
  analyzeTherapySession,
  generateActivityRecommendations,
];
