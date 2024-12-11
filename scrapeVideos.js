import axios from 'axios';
import puppeteer from 'puppeteer';
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';
import { MongoClient } from 'mongodb';

dotenv.config();

const cloneVideos = async (url, filepath) => {
    try {
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream',
        });
        return new Promise((resolve, reject) => {
            const writer = fs.createWriteStream(filepath);
            response.data.pipe(writer);
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    } catch (error) {
        console.error(`Failed to download ${url}:`, error.message);
    }
};

(async () => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--ignore-certificate-errors'],
    });
    const page = await browser.newPage();

    try {
        await page.goto('https://www.thomoz.in/', { waitUntil: 'networkidle2' });
    } catch (error) {
        console.error('Error navigating to the page:', error);
        await browser.close();
        return;
    }

    const links = await page.evaluate(() => {
        const buttons = document.querySelectorAll('button');
        const srcLinks = [];

        buttons.forEach(button => {
            const onclickAttr = button.getAttribute('onclick');
            if (onclickAttr) {
                const match = onclickAttr.match(/src='([^']+)'/);
                if (match && match[1]) {
                    srcLinks.push(match[1]);
                }
            }
        });
        return srcLinks;
    });
    console.log(links);

    const today = new Date();
    const folderName = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;

    const client = new MongoClient(process.env.DATABASE_URI);

    try {
        await client.connect();
        const db = client.db('dgclub88');
        const videosCollection = db.collection('videos');
        const categoriesCollection = db.collection('categories');

        for (const src of links) {
            const exists = await videosCollection.findOne({ original_link: src });
            if (exists) {
                console.log(`Skipping download: ${src} already exists in the database.`);
                continue;
            }

            const match = src.match(/cpc\d+/);
            if (match) {
                const cpcFolder = match[0];
                const specificFolderPath = path.join(process.cwd(), 'public', 'media', 'videos', cpcFolder);

                if (!fs.existsSync(specificFolderPath)) {
                    fs.mkdirSync(specificFolderPath, { recursive: true });
                }

                const filesInFolder = fs.readdirSync(specificFolderPath);
                const nextIndex = filesInFolder.length + 1;

                const filename = `${cpcFolder}_${folderName}_${nextIndex}.mp4`;
                const filePath = path.join(specificFolderPath, filename);
                await cloneVideos(src, filePath);
                console.log(`Downloaded and saved ${filePath}`);

                const cate = cpcFolder;
                const relativeFilePath = filePath.replace(path.join(process.cwd(), 'public'), '').replace(/\\/g, '/');

                let category = await categoriesCollection.findOne({ title: cate });
                if (!category) {
                    const insertCategoryResult = await categoriesCollection.insertOne({ title: cate });
                    category = { _id: insertCategoryResult.insertedId, title: cate };
                }

                if (fs.existsSync(filePath) && fs.statSync(filePath).size > 0) {
                    await videosCollection.insertOne({
                        title: `Video ${cpcFolder}_${nextIndex}`,
                        videoUrl: relativeFilePath,
                        is_public: false,
                        original_link: src,
                        category: category._id,
                    });
                } else {
                    console.log(`Failed to download: ${relativeFilePath} is invalid or empty`);
                }
            }
        }
    } catch (error) {
        console.log('Error interacting with MongoDB:', error);
    } finally {
        await client.close();
    }

    await browser.close();
})();
