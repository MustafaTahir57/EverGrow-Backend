const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

const TOKEN_URL =
    "https://api.geckoterminal.com/api/v2/networks/bsc/tokens/0xc3CC4dBF23055af2b87b5E2C85d3c197d04D9E72";

app.get("/api/egc-price", async (req, res) => {
    console.log('📌 /api/egc-price called');
    try {
        const response = await axios.get(TOKEN_URL, {
            headers: {
                Accept: "application/json",
            },
        });

        console.log("response status:", response.status);

        const price = response.data?.data?.attributes?.price_usd;
        console.log("price:", price); // ✅ was "data" before (undefined variable)

        res.json({
            price: price || 0,
            raw: response.data,
        });
    } catch (err) {
        console.error("❌ Error:", err.message, err); // ✅ was crossOriginIsolated.err (doesn't exist)
        res.status(500).json({
            error: "Failed to fetch price",
        });
    }
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});