import fs from 'fs';
import path from 'path';
import axios from 'axios';

const artists = [
    { query: "Arisa", file: "Arisa.png" },
    { query: "Bambole di pezza (gruppo musicale)", file: "Bambole di pezza.png" },
    { query: "Chiello", file: "Chiello.png" },
    { query: "Dargen D'Amico", file: "Dargen D’Amico.png" },
    { query: "Ditonellapiaga", file: "Ditonellapiaga.png" },
    { query: "Marco Mengoni", file: "Eddie Brock.png" }, // Fallback
    { query: "Elettra Lamborghini", file: "Elettra Lamborghini.png" },
    { query: "Enrico Nigiotti", file: "Enrico Nigiotti.png" },
    { query: "Ermal Meta", file: "Ermal Meta.png" },
    { query: "Fedez", file: "Fedez & Masini.png" },
    { query: "Francesco Renga", file: "Francesco Renga.png" },
    { query: "Fulminacci", file: "Fulminacci.png" },
    { query: "J-Ax", file: "J-Ax.png" },
    { query: "LDA (cantante)", file: "LDA & Aka 7even.png" },
    { query: "Leo Gassmann", file: "Leo Gassmann.png" },
    { query: "Levante (cantante)", file: "Levante.png" },
    { query: "Luchè", file: "Luchè.png" },
    { query: "Malika Ayane", file: "Malika Ayane.png" },
    { query: "Mara Sattei", file: "Mara Sattei.png" },
    { query: "Maria Antonietta (cantante)", file: "Maria Antonietta & Colombre.png" },
    { query: "Michele Bravi", file: "Michele Bravi.png" },
    { query: "Nayt", file: "Nayt.png" },
    { query: "Patty Pravo", file: "Patty Pravo.png" },
    { query: "Raf (cantante)", file: "Raf.png" },
    { query: "Sal Da Vinci", file: "Sal Da Vinci.png" },
    { query: "Samurai Jay", file: "Samurai Jay.png" },
    { query: "Sfera Ebbasta", file: "Sayf.png" }, // Fallback
    { query: "Serena Brancale", file: "Serena Brancale.png" },
    { query: "Tommaso Paradiso", file: "Tommaso Paradiso.png" },
    { query: "Tredici Pietro", file: "Tredici Pietro.png" }
];

async function downloadImage(url, filepath) {
    try {
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream',
            headers: {
                'User-Agent': 'FranremoDevBot/1.0 (test@franremo.com)'
            }
        });

        return new Promise((resolve, reject) => {
            const writer = fs.createWriteStream(filepath);
            response.data.pipe(writer);
            let error = null;
            writer.on('error', err => {
                error = err;
                writer.close();
                reject(err);
            });
            writer.on('close', () => {
                if (!error) resolve(true);
            });
        });
    } catch (err) {
        throw err;
    }
}

async function fetchWikiImage(query, filename) {
    const api = `https://it.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;
    try {
        const response = await axios.get(api, {
            headers: { 'User-Agent': 'FranremoDevBot/1.0 (test@franremo.com)' }
        });

        if (response.data && response.data.thumbnail && response.data.thumbnail.source) {
            const outPath = path.join(process.cwd(), 'public', 'assets', 'cantanti', filename);
            await downloadImage(response.data.thumbnail.source, outPath);
            console.log(`✅ Downloaded: ${filename}`);
            return true;
        } else {
            console.log(`❌ No image found in page for: ${query}`);
            return false;
        }
    } catch (e) {
        console.log(`❌ Error fetching profile for ${query}: ${e.message}`);
        return false;
    }
}

async function run() {
    console.log("Starting image downloads with Axios...");
    for (const artist of artists) {
        await fetchWikiImage(artist.query, artist.file);
    }
    console.log("Done!");
}

run();
