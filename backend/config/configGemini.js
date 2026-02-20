const {GoogleGenAI} = require("@google/genai")

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({});

async function gemini(prompt) {
    if (!prompt) {
        return null;
    }
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt.toString(),
  });
  console.log(response.text);
  return response.text;
}

module.exports = gemini