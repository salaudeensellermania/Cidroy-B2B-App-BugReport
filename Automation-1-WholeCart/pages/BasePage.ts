import type { Page } from '@playwright/test';

export class BasePage {
  constructor(protected readonly page: Page) {}

  protected get tenantRoot(): string {
    const baseUrl = process.env.BASE_URL;
    if (!baseUrl) {
      throw new Error('BASE_URL is required');
    }
    return baseUrl.replace(/\/login$/, '');
  }

  async goto(route: string): Promise<void> {
    await this.page.goto(`${this.tenantRoot}${route}`);
  }
}