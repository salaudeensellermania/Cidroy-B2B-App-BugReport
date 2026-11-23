import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class SellerOrdersPage extends BasePage {
  private readonly heading: Locator;
  private readonly rows: Locator;
  private readonly cancellationMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Orders' });
    this.rows = page.getByRole('row');
    this.cancellationMessage = page.getByText('Order updated: cancel', { exact: true });
  }

  async open(): Promise<void> {
    await this.goto('/seller/orders');
    await expect(this.heading).toBeVisible();
  }

  private getOrderRow(orderNumber: string): Locator {
    return this.rows.filter({ hasText: orderNumber });
  }

  orderRow(orderNumber: string): Locator {
    return this.getOrderRow(orderNumber);
  }

  async transition(orderNumber: string, action: string, nextStatus: string): Promise<void> {
    const row = this.getOrderRow(orderNumber);
    await row.getByRole('button', { name: action, exact: true }).click();
    await expect(row).toContainText(nextStatus);
  }

  async cancelOrder(orderNumber: string): Promise<void> {
    const row = this.getOrderRow(orderNumber);
    await row.getByRole('button', { name: 'Cancel', exact: true }).click();
    await expect(this.cancellationMessage).toBeVisible();
  }
}