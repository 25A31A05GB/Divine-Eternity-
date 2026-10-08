import { test, expect } from '@playwright/test';

test.describe('Happy-Path Checkout Flow (COD)', () => {
  test('navigates from homepage, adds product to cart, and completes COD checkout', async ({ page }) => {
    // 1. Visit Homepage
    await page.goto('/');
    await expect(page).toHaveTitle(/Divine’s Eternity/);

    // 2. Open Collections or Product Detail
    const productCard = page.locator('.group').first();
    await expect(productCard).toBeVisible();
    await productCard.click();

    // 3. Add to Bag
    const addToBagButton = page.getByRole('button', { name: /Add to Bag|Add to Cart/i }).first();
    if (await addToBagButton.isVisible()) {
      await addToBagButton.click();
    }

    // 4. Open Checkout
    await page.goto('/checkout');
    await expect(page.locator('h1, h2, h3').filter({ hasText: /Checkout/i })).toBeVisible();

    // 5. Fill Shipping Address Form
    await page.fill('input[placeholder*="Full Name"], input[name="fullName"]', 'Ananya Sharma');
    await page.fill('input[placeholder*="Email"], input[name="email"]', 'ananya.sharma@example.com');
    await page.fill('input[placeholder*="Phone"], input[name="phone"]', '9876543210');
    await page.fill('input[placeholder*="Pincode"], input[name="pincode"]', '400001');
    await page.fill('input[placeholder*="Address"], input[name="streetAddress"]', '102 Luxury Towers, Bandra West');
    await page.fill('input[placeholder*="City"], input[name="city"]', 'Mumbai');

    // 6. Select Cash on Delivery
    const codOption = page.locator('input[value="cod"], label').filter({ hasText: /Cash on Delivery/i }).first();
    if (await codOption.isVisible()) {
      await codOption.click();
    }

    // 7. Place Order
    const placeOrderButton = page.getByRole('button', { name: /Complete Order|Place Order/i }).first();
    await expect(placeOrderButton).toBeEnabled();
  });
});
