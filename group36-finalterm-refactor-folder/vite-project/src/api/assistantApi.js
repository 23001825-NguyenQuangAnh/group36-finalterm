import aiAxios from "./aiAxios";

export const chatWithAssistant = (message, userId) =>
    aiAxios.post("/ai/assistant", {
        message,
        userId,
    });

