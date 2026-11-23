import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class SellerProductsPage extends BasePage {
  private readonly heading: Locator;
  private readonly importInput: Locator;
  private readonly uploadButton: Locator;
  private readonly importCompleteText: Locator;
  private readonly table: Locator;
  private readonly nextLink: Locator;
  private readonly sellerName: Locator;

  constructor(page: Page, private readonly expectedSellerName?: string) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'My products' });
    this.importInput = page.getByLabel('Import products (CSV)');
    this.uploadButton = page.getByRole('button', { name: 'Upload', exact: true });
    this.importCompleteText = page.getByText(/^Import complete:/);
    this.table = page.getByRole('table');
    this.nextLink = page.getByRole('link', { name: 'Next', exact: true });
    this.sellerName = page.locator('header');
  }

  async open(): Promise<void> {
    await this.goto('/seller/products');
    await expect(this.heading).toBeVisible();
    if (this.expectedSellerName) {
      await expect(this.sellerName).toContainText(this.expectedSellerName);
    }
  }

  async uploadCsv(filePath: string): Promise<void> {
    await this.importInput.setInputFiles(filePath);
    await this.uploadButton.click();
    await expect(this.importCompleteText).toBeVisible();
  }

  private getProductRowBySku(sku: string): Locator {
    return this.table.getByRole('row').filter({ hasText: sku });
  }

  private getStockCell(row: Locator): Locator {
    return row.getByRole('cell').nth(6);
  }

  private async findProductRow(sku: string): Promise<Locator> {
    for (let pageNumber = 1; pageNumber <= 20; pageNumber += 1) {
      await this.goto(pageNumber === 1
        ? '/seller/products'
        : `/seller/products?page=${pageNumber}`);
      await expect(this.heading).toBeVisible();
      await expect(this.table).toBeVisible();

      const row = this.getProductRowBySku(sku);
      if (await row.count()) {
        await expect(row).toBeVisible();
        return row;
      }
    }

    const sellerIdentity = (await this.sellerName.innerText()).trim();
    throw new Error(`Product SKU ${sku} was not found after 20 Seller Products pages. Seller: ${sellerIdentity}; URL: ${this.page.url()}`);
  }

  async getProductStockPieces(sku: string): Promise<number> {
    const row = await this.findProductRow(sku);
    const text = (await this.getStockCell(row).innerText()).trim();
    const stock = Number.parseInt(text, 10);
    if (!Number.isInteger(stock)) {
      throw new Error(`Invalid Stock (pieces) value for SKU ${sku}: ${text}`);
    }
    return stock;
  }

  async getProductCaseSize(sku: string): Promise<number> {
    const row = await this.findProductRow(sku);
    const caseText = (await row.getByRole('cell').nth(4).innerText()).trim();
    const match = /^([1-9]\d*)\s*×/.exec(caseText);
    if (!match) {
      throw new Error(`Invalid Case value for SKU ${sku}: ${caseText}`);
    }
    return Number.parseInt(match[1], 10);
  }

  productRow(sku: string): Locator {
    return this.getProductRowBySku(sku);
  }
}