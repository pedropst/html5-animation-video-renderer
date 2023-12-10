const puppeteer = require('puppeteer')
const fs = require('fs')
const { exit } = require('process')

const launchArgs = ['--no-sandbox', '--disable-dev-shm-usage']


async function determine(){
        const browser = await puppeteer.launch({
            args: launchArgs,
          })
        
        const page = await browser.newPage()
        await page.goto('http://127.0.0.1:5500/template_03.html', { waitUntil: 'load' })      
        const info = await page.evaluate(() => {
            let size = 0;
            const isOverflown = ({el}) => el.scrollHeight > 90
            const resizeText = ({element, minSize = 10, maxSize = 512, step = 1, unit = 'px' }) => {
                let i = minSize
                let overflow = false
                                    
                while (!overflow && i < maxSize) {
                    element.style.fontSize = `${i}${unit}`
                    overflow = isOverflown({el:element})
                
                if (!overflow) i += step
                }
    
                // revert to last state where no overflow happened
                size = `${i - step}${unit}`
            }
            resizeText({
                element: document.querySelectorAll('.text')[0],
                step: 1
            })
            return Promise.resolve(size);
        })
        fs.writeFile('/home/pedro/PERSONAL/painel/settings.json', info, err => {
        if (err) {
            console.log(err.message);
        
            throw err;
        }
            console.log('data written to file');
            exit()
        });
}

determine()