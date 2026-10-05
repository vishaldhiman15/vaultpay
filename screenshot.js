import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto('http://localhost:5173');
  // Wait a bit for React to render and animations to finish
  await new Promise(resolve => setTimeout(resolve, 3000));
  await page.screenshot({ path: '/Users/tourist/Desktop/VaultPay_Screenshot.png', fullPage: true });
  await browser.close();
})();
