const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5432
const puppeteer = require('puppeteer-extra');
var data = require('./Data/Citations.json');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
require("dotenv").config();

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
  
puppeteer.use(StealthPlugin());
  
(async () => {

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox','--disable-setuid-sandbox'],
    executablePath: './node_modules/puppeteer/.local-chromium/linux-950341/chrome-linux/chrome'
  });
  const page = await browser.newPage();
  await page.setViewport({width: 1200, height: 1500});
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36');
  await page.goto('https://www.instagram.com/', {
    waitUntil: 'networkidle2'}),
  
  await page.click('._1XyCr > button');
  await page.type("[name=username]", process.env.IDENTIFIANT,{
    delay: 100});
  await page.type("[name=password]", process.env.MDP,{
    delay: 100});

  await Promise.all([
    page.click('button[type=submit]'),
  ]); 
  var job = setInterval(async function fun() {
    n = Math.floor((Math.random() * 44) + 1);
    var a = new Date().toLocaleDateString("fr-FR", {weekday: "long", year: "numeric", month: "long", day: "2-digit"})
    var b = new Date().getHours() + "h" + new Date().getMinutes();
    String(a, b);

    await page.goto('https://www.instagram.com/accounts/edit/', {waitUntil: 'networkidle2'});
    await page.waitForSelector('#pepBio')
    await page.click("#pepBio")
    await page.keyboard.down('Control');    await page.keyboard.press('KeyA');    await page.keyboard.up('Control'); await page.keyboard.press('Backspace');
    await page.type("#pepBio", `[57#🇨🇵] nous somme ${a} et il est ${b}\n${String(data.PHR.citation[n])}`, {preselect: true}, {delay: 100});
    await page.click('.fi8zo > button')
    console.log('time update')
  }, 60000);
  page.waitForNavigation({waitUntil: 'networkidle2'}).then(fun());
  //clearInterval(unabonnement);message
  debugger;
  /*await page.pdf({ path: 'hn.pdf', format: 'a4' });*/

})().catch(err => {
  console.log(err.message)
});
