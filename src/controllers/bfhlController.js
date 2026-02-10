const { getFibonacci, isPrime, lcm, gcd, getAIResponse } = require('../utils/helpers');

const OFFICIAL_EMAIL = process.env.OFFICIAL_EMAIL || "ojasvita0756.be23@chitkara.edu.in";

const operations = {
    fibonacci: (data) => {
        const n = parseInt(data);
        if (isNaN(n)) throw new Error("Invalid Number");
        return getFibonacci(n);
    },
    
    prime: (data) => {
        if (!Array.isArray(data)) throw new Error("Array Required");
        return data.filter(num => typeof num === 'number' && isPrime(num));
    },
    
    lcm: (data) => {
        if (!Array.isArray(data)) throw new Error("Array Required");
        const arr = data.filter(n => typeof n === 'number');
        if (arr.length === 0) throw new Error("Array empty");
        return arr.reduce((acc, curr) => lcm(acc, curr));
    },
    
    hcf: (data) => {
        if (!Array.isArray(data)) throw new Error("Array Required");
        const arr = data.filter(n => typeof n === 'number');
        if (arr.length === 0) throw new Error("Array empty");
        return arr.reduce((acc, curr) => gcd(acc, curr));
    },
    
    AI: (data) => getAIResponse(data)
};

exports.handleBFHL = async (req, res) => {
    try {
        const body = req.body;
        
        if (!body || Object.keys(body).length === 0) {
            return res.status(400).json({ is_success: false, message: "Empty Body" });
        }

        const operation = Object.keys(body)[0];
        if (!operations[operation]) {
            return res.status(400).json({ is_success: false, message: "Invalid Key" });
        }

        const resultData = await operations[operation](body[operation]);

        res.json({
            is_success: true,
            official_email: OFFICIAL_EMAIL,
            data: resultData
        });

    } catch (error) {
        // Treat AI/service related errors and API key issues as server errors (500)
        const msg = error && error.message ? error.message : String(error);
        const isServerError = msg.includes('AI_SERVICE_ERROR') || msg.toLowerCase().includes('api key');
        const status = isServerError ? 500 : 400;
        res.status(status).json({
            is_success: false,
            official_email: OFFICIAL_EMAIL,
            message: msg
        });
    }
};

exports.handleHealth = (req, res) => {
    res.status(200).json({
        is_success: true,
        official_email: OFFICIAL_EMAIL
    });
};