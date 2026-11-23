import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CataloguePage extends BasePage {
  private readonly heading: Locator;
  private readonly searchInput: Locator;
  private readonly searchButton: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Catalogue' });
    this.searchInput = page.getByTestId('search');
    this.searchButton = page.getByRole('button', { name: 'Search', exact: true });
  }

  async open(): Promise<void> {
    await this.goto('/catalogue');
    await expect(this.heading).toBeVisible();
  }

  async searchBySku(sku: string): Promise<void> {
    await this.searchInput.fill(sku);
    await this.searchButton.click();
    await expect(this.page.getByText(sku, { exact: true })).toBeVisible();
  }

  async openProduct(name: string): Promise<void> {
    await this.page.getByRole('link', { name, exact: true }).click();
  }
}