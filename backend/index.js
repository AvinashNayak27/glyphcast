const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

app.get('/get-meta-tags', async (req, res) => {
    const url = req.query.url;
    if (!url) {
        return res.status(400).json({ message: 'URL parameter is required' });
    }

    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const metaTags = {};
        $('meta').each((i, elem) => {
          const property = $(elem).attr('property');
          const content = $(elem).attr('content');
          if (property && content) {
            metaTags[property] = content;
          }
        });
        res.json(metaTags);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching URL' });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
