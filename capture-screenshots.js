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

async function captureScreenshots() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: false, // Set to true for headless mode
    defaultViewport: null, // Don't set default viewport, we'll set it explicitly
    args: ['--window-size=1600,1000'], // Ensure browser window is wide enough
  });

  try {
    const page = await browser.newPage();
    
    // Set viewport to ensure exactly 1440px width with high DPI (2x scale for retina quality)
    // Note: deviceScaleFactor 2 means screenshots will be 2880px wide (1440 * 2) for high quality
    // If you need exactly 1440px wide files, set deviceScaleFactor to 1
    await page.setViewport({
      width: VIEWPORT_WIDTH,
      height: VIEWPORT_HEIGHT,
      deviceScaleFactor: 2, // 2x scale for high-resolution screenshots
    });

    // Verify viewport was set correctly
    const viewport = page.viewport();
    console.log(`Viewport set to: ${viewport.width}x${viewport.height} (deviceScaleFactor: ${viewport.deviceScaleFactor})`);

    console.log('Navigating to page...');
    await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
    await waitForRender(page, 3000);

    // Verify page dimensions after load
    const pageDimensions = await page.evaluate(() => {
      return {
        width: window.innerWidth,
        height: window.innerHeight,
        documentWidth: document.documentElement.scrollWidth,
        documentHeight: document.documentElement.scrollHeight,
      };
    });
    console.log(`Page dimensions: ${pageDimensions.width}x${pageDimensions.height} (document: ${pageDimensions.documentWidth}x${pageDimensions.documentHeight})`);

    // Stage 1: Initial History Gates
    console.log('📸 Capturing Stage 1: Initial History Gates...');
    const screenshot1 = await page.screenshot({
      path: join(SCREENSHOT_DIR, 'liming-v4-stage-1-initial-history-gates-1440px.png'),
      fullPage: true,
      type: 'png', // PNG for lossless quality
    });
    console.log(`  Screenshot dimensions: ${screenshot1.width}x${screenshot1.height}`);

    // Stage 2: Click "Yes" and wait for year selection
    console.log('Clicking "Yes" button...');
    const yesClicked = await clickButtonByText(page, 'Yes');
    if (yesClicked) {
      await waitForRender(page, 2000);
      
      console.log('📸 Capturing Stage 2: Year Selection...');
      await page.screenshot({
        path: join(SCREENSHOT_DIR, 'liming-v4-stage-2-year-selection-1440px.png'),
        fullPage: true,
        type: 'png',
      });

      // Stage 3: Select a year (2018)
      console.log('Selecting year 2018...');
      const yearSelect = await page.$('[role="combobox"]');
      if (yearSelect) {
        await yearSelect.click();
        await waitForRender(page, 1000);
        
        // Type to filter and select
        await page.keyboard.type('2018');
        await waitForRender(page, 500);
        await page.keyboard.press('Enter');
        await waitForRender(page, 3000);
      }

      // Stage 4: Empty Plan Builder State
      console.log('📸 Capturing Stage 4: Empty Plan Builder State...');
      await page.screenshot({
        path: join(SCREENSHOT_DIR, 'liming-v4-stage-4-empty-plan-builder-1440px.png'),
        fullPage: true,
        type: 'png',
      });

      // Stage 5: Click "Add Plan" or "Create First Plan"
      console.log('Clicking "Add Plan" button...');
      let addPlanClicked = await clickButtonByText(page, 'Add Plan');
      if (!addPlanClicked) {
        addPlanClicked = await clickButtonByText(page, 'Create First Plan');
      }
      if (addPlanClicked) {
        await waitForRender(page, 2000);
      }

      // Stage 6: Plan Details Form (accordion open)
      console.log('📸 Capturing Stage 6: Plan Details Form...');
      await page.screenshot({
        path: join(SCREENSHOT_DIR, 'liming-v4-stage-6-plan-details-open-1440px.png'),
        fullPage: true,
        type: 'png',
      });

      // Screenshot: More menu dropdown open
      console.log('Clicking More menu button...');
      try {
        // Wait for the more menu button - Radix UI DropdownMenu uses button[aria-haspopup="menu"]
        await page.waitForSelector('button[aria-haspopup="menu"]', { timeout: 5000 });
        const moreMenuButtons = await page.$$('button[aria-haspopup="menu"]');
        if (moreMenuButtons.length > 0) {
          const moreMenuButton = moreMenuButtons[0];
          await moreMenuButton.evaluate(el => el.scrollIntoView({ behavior: 'smooth', block: 'center' }));
          await waitForRender(page, 500);
          await moreMenuButton.click();
          await waitForRender(page, 1500); // Wait for dropdown to open
          console.log('📸 Capturing Stage 6b: More Menu Dropdown Open...');
          await page.screenshot({
            path: join(SCREENSHOT_DIR, 'liming-v4-stage-6b-more-menu-dropdown-1440px.png'),
            fullPage: true,
            type: 'png',
          });
          // Close dropdown
          await page.keyboard.press('Escape');
          await waitForRender(page, 1000);
        }
      } catch (error) {
        console.warn('Could not find more menu button:', error.message);
        // Try alternative: look for button with MoreVertical icon (lucide-react)
        try {
          const iconButtons = await page.$$('button[class*="h-8"][class*="w-8"]');
          for (const btn of iconButtons) {
            const hasIcon = await btn.evaluate(el => {
              return el.querySelector('svg') !== null;
            });
            if (hasIcon) {
              await btn.evaluate(el => el.scrollIntoView({ behavior: 'smooth', block: 'center' }));
              await waitForRender(page, 500);
              await btn.click();
              await waitForRender(page, 1500);
              console.log('📸 Capturing Stage 6b: More Menu Dropdown Open (icon fallback)...');
              await page.screenshot({
                path: join(SCREENSHOT_DIR, 'liming-v4-stage-6b-more-menu-dropdown-1440px.png'),
                fullPage: true,
                type: 'png',
              });
              await page.keyboard.press('Escape');
              await waitForRender(page, 1000);
              break;
            }
          }
        } catch (fallbackError) {
          console.warn('Icon fallback also failed:', fallbackError.message);
        }
      }

      // Screenshot: Accordion closed
      console.log('Closing accordion...');
      try {
        // Find accordion trigger button (Radix UI accordion)
        const accordionTriggers = await page.$$('button[data-state="open"]');
        if (accordionTriggers.length > 0) {
          const accordionTrigger = accordionTriggers[0];
          await accordionTrigger.evaluate(el => el.scrollIntoView({ behavior: 'smooth', block: 'center' }));
          await waitForRender(page, 500);
          await accordionTrigger.click();
          await waitForRender(page, 1500);
          console.log('📸 Capturing Stage 6c: Accordion Closed...');
          await page.screenshot({
            path: join(SCREENSHOT_DIR, 'liming-v4-stage-6c-accordion-closed-1440px.png'),
            fullPage: true,
            type: 'png',
          });
          // Reopen accordion
          await accordionTrigger.click();
          await waitForRender(page, 1500);
        } else {
          // Try alternative selector
          const altTriggers = await page.$$('[role="button"][aria-expanded="true"]');
          if (altTriggers.length > 0) {
            await altTriggers[0].click();
            await waitForRender(page, 1500);
            console.log('📸 Capturing Stage 6c: Accordion Closed (alt)...');
            await page.screenshot({
              path: join(SCREENSHOT_DIR, 'liming-v4-stage-6c-accordion-closed-1440px.png'),
              fullPage: true,
              type: 'png',
            });
            await altTriggers[0].click();
            await waitForRender(page, 1500);
          }
        }
      } catch (error) {
        console.warn('Could not close accordion:', error.message);
      }

      // Stage 7: Fill in plan details
      console.log('Filling in plan details...');
      const planNameInput = await page.$('input[placeholder*="Spring Liming"]');
      if (planNameInput) {
        await planNameInput.click();
        // Clear existing text first (select all and delete)
        await page.keyboard.down('Meta'); // Cmd on Mac
        await page.keyboard.press('a');
        await page.keyboard.up('Meta');
        await page.keyboard.press('Backspace');
        await waitForRender(page, 300);
        // Now type the new plan name
        await planNameInput.type('Spring Liming 2018', { delay: 50 });
        await waitForRender(page, 500);
      }

      // Select Material Type - Screenshot dropdown open
      console.log('Opening Material Type dropdown...');
      const materialTypeClicked = await clickButtonByText(page, 'Select material');
      if (materialTypeClicked) {
        await waitForRender(page, 1000);
          console.log('📸 Capturing Stage 7b: Material Type Dropdown Open...');
          await page.screenshot({
            path: join(SCREENSHOT_DIR, 'liming-v4-stage-7b-material-type-dropdown-1440px.png'),
            fullPage: true,
            type: 'png',
          });
        const limestoneClicked = await clickByText(page, 'Limestone');
        if (limestoneClicked) {
          await waitForRender(page, 1000);
        }
      }

      // Screenshot: Plan with Limestone selected
      console.log('📸 Capturing Stage 7c: Plan with Limestone Selected...');
      await page.screenshot({
        path: join(SCREENSHOT_DIR, 'liming-v4-stage-7c-plan-with-limestone-1440px.png'),
        fullPage: true,
        type: 'png',
      });

      // Change to Dolomite for another screenshot
      console.log('Changing to Dolomite...');
      // Find the material type combobox (there should be two comboboxes - year and material type)
      const comboboxes = await page.$$('[role="combobox"]');
      if (comboboxes.length >= 2) {
        // Second combobox should be material type
        await comboboxes[1].click();
        await waitForRender(page, 1000);
        const dolomiteClicked = await clickByText(page, 'Dolomite');
        if (dolomiteClicked) {
          await waitForRender(page, 1000);
          console.log('📸 Capturing Stage 7d: Plan with Dolomite Selected...');
          await page.screenshot({
            path: join(SCREENSHOT_DIR, 'liming-v4-stage-7d-plan-with-dolomite-1440px.png'),
            fullPage: true,
            type: 'png',
          });
          // Change back to Limestone for continuation
          await comboboxes[1].click();
          await waitForRender(page, 1000);
          await clickByText(page, 'Limestone');
          await waitForRender(page, 1000);
        }
      }

      // Enter application rate
      console.log('Entering application rate...');
      const rateInputs = await page.$$('input[type="number"]');
      if (rateInputs.length > 0) {
        const rateInput = rateInputs[rateInputs.length - 1];
        await rateInput.click();
        await rateInput.type('2.5', { delay: 50 });
        await waitForRender(page, 1000);
      }

      // Stage 8: Field Selection Table
      console.log('Scrolling to field selection table...');
      await page.evaluate(() => {
        // Try to find the "Apply to Fields" heading
        const headings = Array.from(document.querySelectorAll('h3'));
        const fieldHeading = headings.find(h => h.textContent.includes('Apply to Fields'));
        if (fieldHeading) {
          fieldHeading.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.scrollTo(0, document.body.scrollHeight / 2);
        }
      });
      await waitForRender(page, 2000);

      console.log('📸 Capturing Stage 8: Field Selection Table (empty)...');
      await page.screenshot({
        path: join(SCREENSHOT_DIR, 'liming-v4-stage-8-field-selection-table-empty-1440px.png'),
        fullPage: true,
        type: 'png',
      });

      // Screenshot: Filter dropdown open
      console.log('Opening filter dropdown...');
      const filterButtonClicked = await clickButtonByText(page, 'Filter by');
      if (filterButtonClicked) {
        await waitForRender(page, 1000);
        console.log('📸 Capturing Stage 8b: Filter Dropdown Open...');
        await page.screenshot({
          path: join(SCREENSHOT_DIR, 'liming-v4-stage-8b-filter-dropdown-open-1440px.png'),
          fullPage: true,
          type: 'png',
        });
        // Close dropdown by clicking outside or pressing Escape
        await page.keyboard.press('Escape');
        await waitForRender(page, 500);
      }

      // Screenshot: Search bar with text
      console.log('Entering search text...');
      const searchInput = await page.$('input[placeholder*="Search field"]');
      if (searchInput) {
        await searchInput.click();
        await searchInput.type('Field', { delay: 50 });
        await waitForRender(page, 1000);
        console.log('📸 Capturing Stage 8c: Search Bar with Text...');
        await page.screenshot({
          path: join(SCREENSHOT_DIR, 'liming-v4-stage-8c-search-bar-with-text-1440px.png'),
          fullPage: true,
          type: 'png',
        });
        // Clear search
        await searchInput.click();
        await page.keyboard.down('Meta');
        await page.keyboard.press('a');
        await page.keyboard.up('Meta');
        await page.keyboard.press('Backspace');
        await waitForRender(page, 1000);
      }

      // Screenshot: Select All checkbox
      console.log('Clicking Select All checkbox...');
      try {
        // Wait for table container to be visible
        await page.waitForSelector('div[class*="rounded-lg"][class*="border"]', { timeout: 5000 });
        // Wait for checkboxes to be visible - Radix UI checkboxes use button[role="checkbox"]
        await page.waitForSelector('button[role="checkbox"]', { timeout: 5000 });
        
        // Find the header checkbox (select all)
        const allCheckboxes = await page.$$('button[role="checkbox"]');
        console.log(`Found ${allCheckboxes.length} checkboxes`);
        
        if (allCheckboxes.length > 0) {
          const selectAllCheckbox = allCheckboxes[0]; // First checkbox is in header
          // Scroll checkbox into view
          await selectAllCheckbox.evaluate(el => el.scrollIntoView({ behavior: 'smooth', block: 'center' }));
          await waitForRender(page, 500);
          
          // Click the checkbox
          await selectAllCheckbox.click();
          await waitForRender(page, 2000); // Wait longer for state to update
          
          console.log('📸 Capturing Stage 8d: Select All Checked...');
          await page.screenshot({
            path: join(SCREENSHOT_DIR, 'liming-v4-stage-8d-select-all-checked-1440px.png'),
            fullPage: true,
            type: 'png',
          });
        }
      } catch (error) {
        console.warn('Could not click select all checkbox:', error.message);
      }

      // Screenshot: Individual field selected
      console.log('Selecting individual fields...');
      try {
        // Wait for checkboxes again
        await page.waitForSelector('button[role="checkbox"]', { timeout: 5000 });
        
        const allCheckboxes = await page.$$('button[role="checkbox"]');
        console.log(`Found ${allCheckboxes.length} checkboxes`);
        
        if (allCheckboxes.length > 1) {
          // Uncheck select all first (click header checkbox)
          if (allCheckboxes[0]) {
            await allCheckboxes[0].evaluate(el => el.scrollIntoView({ behavior: 'smooth', block: 'center' }));
            await waitForRender(page, 500);
            await allCheckboxes[0].click();
            await waitForRender(page, 1500);
          }
          
          // Find table rows - they have cursor-pointer class and border-b
          const tableRows = await page.$$('div[class*="cursor-pointer"][class*="border-b"]');
          console.log(`Found ${tableRows.length} table rows`);
          
          // Click first 3 table rows (they toggle selection)
          for (let i = 0; i < Math.min(3, tableRows.length); i++) {
            const row = tableRows[i];
            await row.evaluate(el => el.scrollIntoView({ behavior: 'smooth', block: 'center' }));
            await waitForRender(page, 500);
            await row.click();
            await waitForRender(page, 800); // Wait longer between clicks for state updates
          }
          
          await waitForRender(page, 2000);
          console.log('📸 Capturing Stage 8e: Multiple Fields Selected...');
          await page.screenshot({
            path: join(SCREENSHOT_DIR, 'liming-v4-stage-8e-multiple-fields-selected-1440px.png'),
            fullPage: true,
            type: 'png',
          });
        }
      } catch (error) {
        console.warn('Could not select individual fields:', error.message);
        // Fallback: try clicking checkboxes directly
        try {
          const allCheckboxes = await page.$$('button[role="checkbox"]');
          if (allCheckboxes.length > 1) {
            for (let i = 1; i <= Math.min(3, allCheckboxes.length - 1); i++) {
              const checkbox = allCheckboxes[i];
              await checkbox.evaluate(el => el.scrollIntoView({ behavior: 'smooth', block: 'center' }));
              await waitForRender(page, 500);
              await checkbox.click();
              await waitForRender(page, 800);
            }
            await waitForRender(page, 1500);
            console.log('📸 Capturing Stage 8e: Multiple Fields Selected (checkbox fallback)...');
            await page.screenshot({
              path: join(SCREENSHOT_DIR, 'liming-v4-stage-8e-multiple-fields-selected-1440px.png'),
              fullPage: true,
              type: 'png',
            });
          }
        } catch (fallbackError) {
          console.warn('Checkbox fallback also failed:', fallbackError.message);
        }
      }

      // Stage 9: Action Buttons
      console.log('Scrolling to action buttons...');
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });
      await waitForRender(page, 2000);

      console.log('📸 Capturing Stage 9: Action Buttons...');
      await page.screenshot({
        path: join(SCREENSHOT_DIR, 'liming-v4-stage-9-action-buttons-1440px.png'),
        fullPage: true,
        type: 'png',
      });

      // Screenshot: Save details clicked (shows "Saved" state)
      console.log('Clicking "Save details" button...');
      const saveDetailsClicked = await clickButtonByText(page, 'Save details');
      if (saveDetailsClicked) {
        await waitForRender(page, 500); // Wait for state to update
        console.log('📸 Capturing Stage 9b: Save Details Success State...');
        await page.screenshot({
          path: join(SCREENSHOT_DIR, 'liming-v4-stage-9b-save-details-success-1440px.png'),
          fullPage: true,
          type: 'png',
        });
        // Wait a bit more to see the saved state
        await waitForRender(page, 1000);
      }

      // Click "Apply plan now"
      console.log('Clicking "Apply plan now"...');
      const applyClicked = await clickButtonByText(page, 'Apply to');
      if (applyClicked) {
        await waitForRender(page, 3000);
      }

      // Stage 10: Success State
      console.log('📸 Capturing Stage 10: Success State...');
      await page.screenshot({
        path: join(SCREENSHOT_DIR, 'liming-v4-stage-10-success-state-1440px.png'),
        fullPage: true,
        type: 'png',
      });
    }

    // Now capture the "No" path
    console.log('\n=== Capturing "No" path ===');
    await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
    await waitForRender(page, 3000);

    // Stage 3 (No path): Click "No"
    console.log('Clicking "No" button...');
    const noClicked = await clickButtonByText(page, 'No');
    if (noClicked) {
      await waitForRender(page, 2000);

      // Stage 3: Confirmation Dialog
      console.log('📸 Capturing Stage 3: No Liming Confirmation Dialog...');
      await page.screenshot({
        path: join(SCREENSHOT_DIR, 'liming-v4-stage-3-no-confirmation-dialog-1440px.png'),
        fullPage: true,
        type: 'png',
      });
    }

    console.log('\n✅ All screenshots captured successfully!');
    console.log(`📁 Screenshots saved to: ${SCREENSHOT_DIR}`);

  } catch (error) {
    console.error('❌ Error capturing screenshots:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

captureScreenshots().catch(console.error);
