import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export type OrderHistoryEntry = {
  orderNumber: string;
  href: string;
};

export class OrderHistoryPage extends BasePage {
  private readonly heading: Locator;
  private readonly table: Locator;
  private readonly rows: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Order history' });
    this.table = page.getByRole('table');
    this.rows = this.table.getByRole('row');
  }

  async open(): Promise<void> {
    await this.goto('/orders');
    await expect(this.heading).toBeVisible();
  }

  async latestOrders(limit: number): Promise<OrderHistoryEntry[]> {
    const orders: OrderHistoryEntry[] = [];
    for (let index = 1; index <= limit; index += 1) {
      const row = this.rows.nth(index);
      orders.push({
        orderNumber: (await row.getByRole('cell').nth(0).innerText()).trim(),
        href: (await row.getByRole('link', { name: 'View' }).getAttribute('href')) ?? '',
      });
    }
    return orders;
  }

  private getOrderNumberCell(orderNumber: string): Locator {
    return this.page.getByRole('cell', { name: orderNumber, exact: true });
  }

  private getOrderNumberCellAt(index: number): Locator {
    return this.rows.nth(index + 1).getByRole('cell').nth(0);
  }

  orderNumberCell(orderNumber: string): Locator {
    return this.getOrderNumberCell(orderNumber);
  }

  orderNumberCellAt(index: number): Locator {
    return this.getOrderNumberCellAt(index);
  }
}