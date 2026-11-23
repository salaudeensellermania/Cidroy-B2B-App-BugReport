import { test } from '@playwright/test';
import path from 'path';
import { SellerProductsPage } from '../pages/SellerProductsPage';

const sellers = [
  { role: 'seller1', file: 'seller1-seed.csv', skus: ['AUTO-STOCK-SKU-1', 'AUTO-STOCK-SKU-3'] },
  { role: 'seller2', file: 'seller2-seed.csv', skus: ['AUTO-STOCK-SKU-2'] },
] as const;

test('seed deterministic seller products from CSV @INVUP', async ({ browser }) => {
  for (const seller of sellers) {
    const context = await browser.newContext({
      storageState: path.resolve(__dirname, '..', '.auth', `${seller.role}.json`),
    });
    try {
      const page = await context.newPage();
      const productsPage = new SellerProductsPage(page);
      await productsPage.open();
      await productsPage.uploadCsv(path.resolve(__dirname, '..', 'test-data', seller.file));
    } finally {
      await context.close();
    }
  }
});