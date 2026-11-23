import { test, expect } from '@playwright/test';
import path from 'path';
import orderFlowData from '../test-data/orderFlowData.json';
import { CataloguePage } from '../pages/CataloguePage';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { OrderHistoryPage } from '../pages/OrderHistoryPage';
import { SellerProductsPage } from '../pages/SellerProductsPage';
import { writeFile } from 'fs/promises';

function storageState(role: 'buyer1'): string {
  return path.resolve(__dirname, '..', '.auth', `${role}.json`);
}

test('Create One Sample Order from Buyer1 for the Seller1 Product (SKU) To Be Reusable For Other Order Flow Test Cases @CREATE', async ({ browser }) => {
  const buyerContext = await browser.newContext({ storageState: storageState('buyer1') });
  const sellerContext = await browser.newContext({
    storageState: path.resolve(__dirname, '..', '.auth', 'seller1.json'),
  });
  try {
    const product = orderFlowData.products[0];
    const sellerProducts = new SellerProductsPage(await sellerContext.newPage(), 'WholeCart Direct');
    await sellerProducts.open();
    const initialStockPieces = await sellerProducts.getProductStockPieces(product.sku);

    const page = await buyerContext.newPage();
    const catalogue = new CataloguePage(page);
    await catalogue.open();
    await catalogue.searchBySku(product.sku);
    await catalogue.openProduct(product.name);

    const productDetail = new ProductDetailPage(page);
    await productDetail.expectSku(product.sku);
    if (product.unit !== 'case' && product.unit !== 'piece') {
      throw new Error(`Unsupported ordering unit: ${product.unit}`);
    }
    await productDetail.addToCart(product.unit, product.quantity);

    const cart = new CartPage(page);
    await cart.open();
    await expect(page.getByRole('row').filter({ hasText: product.name })).toBeVisible();
    await cart.proceedToCheckout();

    const checkout = new CheckoutPage(page);
    await checkout.placeOrder(orderFlowData.delivery.dateOffsetDays, orderFlowData.delivery.slotStart);

    const history = new OrderHistoryPage(page);
    await history.open();
    await expect(history.orderNumberCellAt(0)).toHaveText(/^WC-\d+-1$/);
    const orderNumber = await history.orderNumberCellAt(0).innerText();
    await writeFile(
      path.resolve(__dirname, '..', '.auth', 'tc2-1-order.json'),
      JSON.stringify({ orderNumber: orderNumber.trim(), initialStockPieces }, null, 2),
    );
  } finally {
    await buyerContext.close();
    await sellerContext.close();
  }
});
