import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
  private readonly heading: Locator;
  private readonly deliveryDateInput: Locator;
  private readonly showSlotsButton: Locator;
  private readonly placeOrderButton: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Checkout' });
    this.deliveryDateInput = page.getByLabel('Delivery date');
    this.showSlotsButton = page.getByRole('button', { name: 'Show slots' });
    this.placeOrderButton = page.getByTestId('place-order');
  }

  async open(): Promise<void> {
    await this.goto('/checkout');
    await expect(this.heading).toBeVisible();
  }

  async placeOrder(dateOffsetDays: number, slotStart: string): Promise<void> {
    const currentDate = await this.deliveryDateInput.inputValue();
    const deliveryDate = new Date(`${currentDate}T00:00:00Z`);
    deliveryDate.setUTCDate(deliveryDate.getUTCDate() + dateOffsetDays);
    await this.deliveryDateInput.fill(deliveryDate.toISOString().slice(0, 10));
    await this.showSlotsButton.click();
    await this.page.locator(`input[name="slot_start"][value="${slotStart}"]`).check();
    await this.placeOrderButton.click();
  }
}