import fs from 'fs';
import { initialArtists } from './src/seedData.js';

let allOk = true;
initialArtists.forEach(a => {
    if (!fs.existsSync('public/assets/cantanti/' + a.immagine)) {
        console.log('Missing:', a.immagine);
        allOk = false;
    } else {
        console.log('Found:', a.immagine);
    }
});
if (allOk) {
    console.log('ALL IMAGES FOUND!');
}
