import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  private readonly heading: Locator;
  private readonly checkoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Cart' });
    this.checkoutButton = page.getByTestId('go-checkout');
  }

  async open(): Promise<void> {
    await this.goto('/cart');
    await expect(this.heading).toBeVisible();
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }
}