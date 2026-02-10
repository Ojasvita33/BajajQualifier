require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bfhlRoutes = require('./src/routes/bfhlRoutes');

const app = express();

app.use(express.json());
app.use(cors());

app.use('/', bfhlRoutes);

app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        is_success: false,
        official_email: "ojasvita0756.be23@chitkara.edu.in",
        message: "Internal Server Error"
    });
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});