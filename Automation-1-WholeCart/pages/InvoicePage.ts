import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class InvoicePage extends BasePage {
  private readonly mainContent: Locator;
  private readonly invoiceTable: Locator;

  constructor(page: Page) {
    super(page);
    this.mainContent = page.locator('main');
    this.invoiceTable = page.getByRole('table');
  }

  async open(route: string): Promise<void> {
    await this.goto(route.replace(/^\/c\/[^/]+/, ''));
  }

  get main(): Locator {
    return this.mainContent;
  }

  private getItemRow(itemName: string): Locator {
    return this.invoiceTable.getByRole('row').filter({ hasText: itemName });
  }

  itemRow(itemName: string): Locator {
    return this.getItemRow(itemName);
  }

  getSummary(net: string, tax: string, total: string): Locator {
    return this.mainContent.getByText(`Net ${net} · Tax ${tax} · Total ${total}`, { exact: true });
  }

  get gstinEntries(): Locator {
    return this.mainContent.getByText(/GSTIN/);
  }

  deliveryFeeRow(): Locator {
    return this.invoiceTable.getByRole('row').filter({ hasText: /delivery/i });
  }
}