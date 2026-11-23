import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class OrderDetailPage extends BasePage {
  private readonly heading: Locator;
  private readonly firstTable: Locator;
  private readonly invoiceLinkLocator: Locator;
  private readonly cancelButton: Locator;
  private readonly cancellationMessage: Locator;
  private readonly redeliveryDateInput: Locator;
  private readonly redeliverySlotSelect: Locator;
  private readonly changeSlotButton: Locator;
  private readonly requestRedeliveryButton: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: /^Order WC-/ });
    this.firstTable = page.getByRole('table').first();
    this.invoiceLinkLocator = page.getByRole('link', { name: 'Invoice', exact: true });
    this.cancelButton = page.getByRole('button', { name: 'Cancel order', exact: true });
    this.cancellationMessage = page.getByText('Order cancelled', { exact: true });
    this.redeliveryDateInput = page.locator('input[name="slot_date"]');
    this.redeliverySlotSelect = page.locator('select[name="slot_start"]');
    this.changeSlotButton = page.getByRole('button', { name: 'Change slot' });
    this.requestRedeliveryButton = page.getByRole('button', { name: 'Request redelivery' });
  }

  async open(route: string): Promise<void> {
    await this.goto(route.replace(/^\/c\/[^/]+/, ''));
    await expect(this.heading).toBeVisible();
  }

  private getStatus(status: string): Locator {
    return this.page.getByText(new RegExp(`Status: ${status}(?:\\s|$)`));
  }

  private getItemRow(productName: string): Locator {
    return this.firstTable.getByRole('row').filter({ hasText: productName });
  }

  status(status: string): Locator {
    return this.getStatus(status);
  }

  itemRow(productName: string): Locator {
    return this.getItemRow(productName);
  }

  invoiceLink(): Locator {
    return this.invoiceLinkLocator;
  }

  async cancelOrder(): Promise<void> {
    await this.cancelButton.click();
    await expect(this.cancellationMessage).toBeVisible();
  }

  async changeRedeliverySlot(date: string, slot: string): Promise<void> {
    await this.redeliveryDateInput.fill(date);
    await this.redeliverySlotSelect.selectOption(slot);
    await this.changeSlotButton.click();
  }

  async changeDeliverySlot(dateOffsetDays: number, slotStart: string): Promise<void> {
    const currentDate = await this.redeliveryDateInput.inputValue();
    const deliveryDate = new Date(`${currentDate}T00:00:00Z`);
    deliveryDate.setUTCDate(deliveryDate.getUTCDate() + dateOffsetDays);
    await this.redeliveryDateInput.fill(deliveryDate.toISOString().slice(0, 10));
    await this.redeliverySlotSelect.selectOption(slotStart);
    await this.changeSlotButton.click();
  }

  async requestRedelivery(): Promise<void> {
    await this.requestRedeliveryButton.click();
  }
}