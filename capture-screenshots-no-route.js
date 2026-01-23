import puppeteer from 'puppeteer';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { mkdirSync } from 'fs';

// Ensure screenshots directory path is absolute and correct
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const SCREENSHOT_DIR = join(__dirname, 'screenshots');

// Ensure screenshots directory exists
try {
  mkdirSync(SCREENSHOT_DIR, { recursive: true });
  console.log(`📁 Screenshots will be saved to: ${SCREENSHOT_DIR}`);
} catch (error) {
  console.warn(`Warning: Could not create screenshots directory: ${error.message}`);
}

const VIEWPORT_WIDTH = 1440;
const VIEWPORT_HEIGHT = 900;
const BASE_URL = 'http://localhost:10003/?demo=liming&version=v4';

async function waitForRender(page, timeout = 2000) {
  // Wait for specified timeout
  await new Promise(resolve => setTimeout(resolve, timeout));
  // Wait for React to finish rendering
  await page.evaluate(() => {
    return new Promise((resolve) => {
      if (document.readyState === 'complete') {
        setTimeout(resolve, 500);
      } else {
        window.addEventListener('load', () => setTimeout(resolve, 500));
      }
    });
  });
}

// Helper function to click element by text using Puppeteer's text selector
async function clickByText(page, text) {
  try {
    // Use Puppeteer's ::-p-text() selector via locator API
    const locator = page.locator(`::-p-text("${text}")`);
    await locator.click();
    return true;
  } catch (error) {
    console.warn(`Failed to click element with text "${text}":`, error.message);
    return false;
  }
}

// Helper function to find and click button by text (more specific)
async function clickButtonByText(page, text) {
  try {
    // Try button-specific selector first
    const buttonLocator = page.locator(`button ::-p-text("${text}")`);
    await buttonLocator.click();
    return true;
  } catch (error) {
    // Fallback to general text selector
    return await clickByText(page, text);
  }
}

async function captureNoRouteScreenshots() {
  console.log('Launching browser for "No" route screenshots...');
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--window-size=1600,1000'],
  });

  try {
    const page = await browser.newPage();
    
    // Set viewport to ensure exactly 1440px width with high DPI
    await page.setViewport({
      width: VIEWPORT_WIDTH,
      height: VIEWPORT_HEIGHT,
      deviceScaleFactor: 2, // 2x scale for high-resolution screenshots
    });

    console.log('Navigating to page...');
    await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
    await waitForRender(page, 3000);

    // Stage 1: Initial History Gates
    console.log('📸 Capturing Stage 1: Initial History Gates...');
    await page.screenshot({
      path: join(SCREENSHOT_DIR, 'no-route-stage-1-initial-history-gates-1440px.png'),
      fullPage: true,
      type: 'png',
    });

    // Stage 2: Click "No" button
    console.log('Clicking "No" button...');
    const noClicked = await clickButtonByText(page, 'No');
    if (noClicked) {
      await waitForRender(page, 2000);

      // Stage 3: Confirmation Dialog
      console.log('📸 Capturing Stage 2: No Liming Confirmation Dialog...');
      await page.screenshot({
        path: join(SCREENSHOT_DIR, 'no-route-stage-2-confirmation-dialog-1440px.png'),
        fullPage: true,
        type: 'png',
      });

      // Stage 4: Click "Yes, Confirm" in dialog
      console.log('Clicking "Yes, Confirm" in dialog...');
      const confirmClicked = await clickButtonByText(page, 'Yes, Confirm');
      if (confirmClicked) {
        await waitForRender(page, 2000);

        // Stage 5: "No liming plans required" message
        console.log('📸 Capturing Stage 3: No Liming Plans Required Message...');
        await page.screenshot({
          path: join(SCREENSHOT_DIR, 'no-route-stage-3-no-liming-required-1440px.png'),
          fullPage: true,
          type: 'png',
        });
      } else {
        console.warn('Could not find "Yes, Confirm" button');
      }
    } else {
      console.warn('Could not click "No" button');
    }

    console.log('\n✅ All "No" route screenshots captured successfully!');
    console.log(`📁 Screenshots saved to: ${SCREENSHOT_DIR}`);

  } catch (error) {
    console.error('❌ Error capturing screenshots:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

captureNoRouteScreenshots().catch(console.error);
