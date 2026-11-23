import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class OperatorSettingsPage extends BasePage {
  private readonly heading: Locator;
  private readonly cutoffTimeInput: Locator;
  private readonly cancellationWindowInput: Locator;
  private readonly slotCapacityInput: Locator;
  private readonly minimumOrderInput: Locator;
  private readonly freeDeliveryInput: Locator;
  private readonly deliveryFeeInput: Locator;
  private readonly realTimeRadio: Locator;
  private readonly saveButton: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Marketplace settings' });
    this.cutoffTimeInput = page.getByLabel('Same-day cut-off time');
    this.cancellationWindowInput = page.getByLabel('Cancellation window (minutes)');
    this.slotCapacityInput = page.getByLabel('Orders per delivery slot');
    this.minimumOrderInput = page.getByLabel('Minimum order per seller (₹)');
    this.freeDeliveryInput = page.getByLabel('Free delivery from (₹)');
    this.deliveryFeeInput = page.getByLabel('Delivery fee (₹, before tax)');
    this.realTimeRadio = page.getByRole('radio', { name: 'Real time' });
    this.saveButton = page.getByRole('button', { name: 'Save settings' });
  }

  async open(): Promise<void> {
    await this.goto('/operator/settings');
    await expect(this.heading).toBeVisible();
  }

  async setDefaults(settings: {
    cutoffTime: string;
    cancellationWindowMinutes: number;
    ordersPerSlot: number;
    minimumOrder: number;
    freeDeliveryFrom: number;
    deliveryFee: number;
  }): Promise<void> {
    await this.cutoffTimeInput.fill(settings.cutoffTime);
    await this.cancellationWindowInput.fill(String(settings.cancellationWindowMinutes));
    await this.slotCapacityInput.fill(String(settings.ordersPerSlot));
    await this.minimumOrderInput.fill(String(settings.minimumOrder));
    await this.freeDeliveryInput.fill(String(settings.freeDeliveryFrom));
    await this.deliveryFeeInput.fill(String(settings.deliveryFee));
    await this.realTimeRadio.check();
    await this.saveButton.click();
  }
}
