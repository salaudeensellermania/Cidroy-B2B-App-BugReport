import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductDetailPage extends BasePage {
  private readonly unitSelect: Locator;
  private readonly quantityInput: Locator;
  private readonly addToCartButton: Locator;
  private readonly main: Locator;

  constructor(page: Page) {
    super(page);
    this.unitSelect = page.getByTestId('unit');
    this.quantityInput = page.getByTestId('qty');
    this.addToCartButton = page.getByTestId('add-to-cart');
    this.main = page.locator('main');
  }

  async addToCart(unit: 'case' | 'piece', quantity: number): Promise<void> {
    await this.unitSelect.selectOption(unit);
    await this.quantityInput.fill(String(quantity));
    await this.addToCartButton.click();
  }

  async expectSku(sku: string): Promise<void> {
    await expect(this.main).toContainText(sku);
  }
}