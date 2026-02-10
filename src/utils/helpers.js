const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --- MATHS UTILS ---
const getFibonacci = (n) => {
    if (typeof n !== 'number' || n < 0) return [];
    if (n === 0) return [];
    if (n === 1) return [0];
    let seq = [0, 1];
    while (seq.length < n) {
        let nextVal = seq[seq.length - 1] + seq[seq.length - 2];
        if (nextVal > Number.MAX_SAFE_INTEGER) break;
        seq.push(nextVal);
    }
    return seq;
};

const isPrime = (num) => {
    if (typeof num !== 'number' || num <= 1) return false;
    if (!Number.isInteger(num)) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
};

const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));

const lcm = (a, b) => {
    if (a === 0 || b === 0) return 0;
    return Math.abs((a * b) / gcd(a, b));
};

// --- AI UTIL ---
const getAIResponse = async (query) => {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error('API Key Missing');
    }

    const modelName = process.env.AI_MODEL || 'gemini-2.5-flash';

    try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const prompt = `Answer with EXACTLY one word. No punctuation. Question: "${query}"`;

        const result = await model.generateContent(prompt);

        let text = '';
        try {
            if (result && result.response && typeof result.response.text === 'function') {
                text = (await result.response.text()).trim();
            } else if (result && result.response && typeof result.response === 'string') {
                text = result.response.trim();
            } else if (result && typeof result === 'string') {
                text = result.trim();
            } else {
                text = JSON.stringify(result);
            }
        } catch (e) {
            text = String(result);
        }

        const firstWord = text.split(/\s+/)[0] || '';
        return firstWord;
    } catch (error) {
        const msg = error && error.message ? error.message : String(error);
        console.error('AI API Error:', msg);

        if (msg.includes('is not found') || msg.includes('Not Found') || msg.includes('404')) {
            throw new Error('AI_SERVICE_ERROR: model not found or API version mismatch. Run `node listModels.js` to list available models and set AI_MODEL in your .env to a supported model.');
        }

        throw new Error('AI_SERVICE_ERROR: failed to fetch response from AI provider. ' + msg);
    }
};

module.exports = { getFibonacci, isPrime, lcm, gcd, getAIResponse };