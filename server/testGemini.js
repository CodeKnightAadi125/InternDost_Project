require('dotenv').config({ path: 'C:/Users/adity/Desktop/Main Project(React+Node)/server/.env' });
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
    try {
        console.log("Key:", process.env.GEMINI_API_KEY ? "Found" : "Missing");
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Say hello");
        console.log("Success:", result.response.text());
    } catch (e) {
        console.error("Failed:", e.message);
    }
}
testGemini();
