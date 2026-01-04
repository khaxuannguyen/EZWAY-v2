const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Enable CORS so your React Frontend (port 5173/3000) can call this server
app.use(cors());

app.get('/api/tracking', async (req, res) => {
    const { code } = req.query;

    if (!code) {
        return res.status(400).json({ error: 'Vui lòng cung cấp mã vận đơn (code)' });
    }

    try {
        // 1. Call KSN Post securely from the server side
        const url = `https://ksnpost.com/?code=${code}&lang=vi`;
        const { data: html } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        // 2. Load HTML into Cheerio for parsing
        const $ = cheerio.load(html);

        // 3. Check if tracking exists (Basic check: if we can't find the Tracking ID in the body)
        // Adjust this selector based on how KSN shows "Not Found"
        const pageText = $('body').text();
        if (pageText.includes('Không tìm thấy') || pageText.includes('Invalid tracking')) {
            return res.status(404).json({ error: 'Không tìm thấy mã vận đơn này.' });
        }

        // 4. Scrape Data (Selectors based on standard bootstrap/table structures seen in KSN)
        
        // -- Status Section --
        // Assuming status is often in a specific header or div
        let statusLabel = $('b:contains("Tình trạng giao hàng")').parent().next().text().trim() || 
                          $('.label-success').first().text().trim() || 
                          "In Transit";
        
        // -- General Info (From, To, Dates) --
        // We use :contains to find the label, then look at the next element or sibling
        const fromLoc = $('td:contains("Từ"), th:contains("Từ")').next().text().trim() || "N/A";
        const toLoc = $('td:contains("Đến"), th:contains("Đến")').next().text().trim() || "USA";
        const totalPackages = $('td:contains("Tổng kiện hàng")').next().text().trim() || "1";
        const packing = $('td:contains("Đóng gói")').next().text().trim() || "Carton";
        
        // -- Service & Term --
        // Looking for text patterns "Dịch vụ"
        const service = $('div:contains("Dịch vụ")').find('span, b, div').filter((i, el) => $(el).text().includes('KSN')).first().text().trim().replace('Dịch vụ', '').trim() || "Standard Shipping";
        const term = $('div:contains("TERM")').text().replace('TERM', '').trim() || "N/A";

        // -- Sub Packages --
        const subPackages = [];
        // Look for the "Chi tiết kiện hàng phụ" section
        $('div:contains("Chi tiết kiện hàng phụ")').parent().find('a').each((i, el) => {
             const subCode = $(el).text().trim();
             if (subCode && subCode !== code) {
                 subPackages.push(subCode);
             }
        });

        // -- Timeline / Events --
        const events = [];
        // Assuming events are in a timeline list or table rows
        // Strategy: Look for rows that contain date-like strings
        $('.timeline li, table.table-striped tr').each((i, el) => {
            const rowText = $(el).text();
            // Basic check to see if row has date content
            if (rowText.includes('2024') || rowText.includes('2025')) {
                const dateRaw = $(el).find('.date, td:nth-child(1)').text().trim(); // Adjust selector
                const statusRaw = $(el).find('.status, td:nth-child(2)').text().trim();
                const locationRaw = $(el).find('.location, td:nth-child(3)').text().trim();
                
                if (dateRaw) {
                    // Split date and time if combined
                    const parts = dateRaw.split(' ');
                    const date = parts[0];
                    const time = parts.length > 1 ? parts[1] : '';

                    events.push({
                        date: date,
                        time: time,
                        description: statusRaw || "Processing",
                        location: locationRaw || "Hub",
                        status: i === 0 ? 'current' : 'completed' // First item is usually latest
                    });
                }
            }
        });

        // Fallback if scraping timeline failed (to ensure UI doesn't break)
        if (events.length === 0) {
            events.push({
                date: new Date().toISOString().split('T')[0],
                time: "00:00",
                description: statusLabel,
                location: fromLoc,
                status: 'current'
            });
        }

        // 5. Construct Final JSON
        const responseData = {
            id: code,
            status: statusLabel.toLowerCase().includes('delivered') ? 'delivered' : 'in_transit',
            statusLabel: statusLabel,
            from: fromLoc,
            to: toLoc,
            estimatedDelivery: "Đang cập nhật", // Usually not scraped easily
            service: service,
            term: term,
            weight: "Đang cập nhật",
            packing: packing,
            totalPackages: totalPackages,
            progress: events.length > 2 ? 60 : 30, // Rough estimate
            subPackages: subPackages,
            events: events
        };

        res.json(responseData);

    } catch (error) {
        console.error('Proxy Error:', error.message);
        res.status(500).json({ error: 'Lỗi kết nối đến hệ thống tra cứu. Vui lòng thử lại sau.' });
    }
});

app.listen(PORT, () => {
    console.log(`EZWAY Tracking Proxy running on http://localhost:${PORT}`);
});