const puppeteer = require('puppeteer')
const fs = require('fs')
const { exit } = require('process')

const launchArgs = ['--no-sandbox', '--disable-dev-shm-usage']


async function determine(){
        const browser = await puppeteer.launch({
            args: launchArgs        })
            // headless: false        })
        
        const page = await browser.newPage()
        await page.goto('http://127.0.0.1:5500/image.html', { waitUntil: 'load' })
        // const container = await page.waitForSelector('.container');
        const info = await page.evaluate(() => {
            const container = document.querySelectorAll('.container')[0].offsetHeight
            const element = document.querySelectorAll('.text')[0]
            const isOverflown = ({el}) => el.offsetHeight > container
            const maxSize = 512
            const unit = "px"
            let i = 1
            const step = 1
            let size = 0
            let overflow = false
            while (!overflow && i < maxSize) {
                element.style.fontSize = `${i}${unit}`
                overflow = isOverflown({el:element})
            
                if (!overflow) i += step
            }
            size = `${i - step}${unit}`
            element.style.fontSize = size
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