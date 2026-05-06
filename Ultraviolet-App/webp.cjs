const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const dir = '../public/assets/';

fs.readdirSync(dir).forEach(file => {
    const ext = path.extname(file).toLowerCase();
    const base = path.basename(file, ext);
    const fullInput = path.join(dir, file);
    const fullOutput = path.join(dir, `${base}.webp`);

    if (['.png', '.jpg', '.jpeg'].includes(ext)) {
        sharp(fullInput)
            .webp({ quality: 80 })
            .toFile(fullOutput)
            .then(() => {
                console.log(`converted ${file} -> ${base}.webp`);
                fs.unlink(fullInput, err => {
                    if (err) console.error(`error deleting ${file}`, err);
                    else console.log(`deleted ${file}`);
                });
            })
            .catch(err => console.error(`error converting ${file}`, err));
    }
});

// yes, this file only exists to convert the images to webps