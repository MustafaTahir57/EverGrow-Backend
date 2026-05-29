const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

const TOKEN_URL =
    "https://api.geckoterminal.com/api/v2/networks/bsc/tokens/0xc3CC4dBF23055af2b87b5E2C85d3c197d04D9E72";

let cachedPrice = null;
let lastFetched = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 mins

app.get("/api/egc-price", async (req, res) => {
    console.log('📌 /api/egc-price called');

    // Return cached price if still fresh
    if (cachedPrice && lastFetched && (Date.now() - lastFetched < CACHE_DURATION)) {
        console.log('✅ Returning cached price');
        return res.json({ price: cachedPrice, cached: true });
    }

    try {
        const response = await axios.get(TOKEN_URL, {
            headers: { Accept: "application/json" }
        });

        const price = response.data?.data?.attributes?.price_usd;

        // Update cache
        cachedPrice = price || 0;
        lastFetched = Date.now();

        res.json({ price: cachedPrice, cached: false });
    } catch (err) {
        console.error("❌ Error:", err.message);

        // Handle rate limit
        if (err.response?.status === 429) {
            console.log("⚠️ Rate limited");

            return res.json({
                price: cachedPrice || 0,
                cached: true,
                stale: true
            });
        }

        res.status(500).json({
            error: err.message
        });
    }
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});