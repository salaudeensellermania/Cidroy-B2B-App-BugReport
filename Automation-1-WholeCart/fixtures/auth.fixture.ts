import path from 'path';
import { test as base, type BrowserContext, type Page } from '@playwright/test';

type Role = 'buyer1' | 'buyer2' | 'seller1' | 'seller2' | 'operator';

type AuthFixtures = {
  buyer1Context: BrowserContext;
  buyer2Context: BrowserContext;
  seller1Context: BrowserContext;
  seller2Context: BrowserContext;
  operatorContext: BrowserContext;
  buyer1Page: Page;
  buyer2Page: Page;
  seller1Page: Page;
  seller2Page: Page;
  operatorPage: Page;
};

function storageState(role: Role): string {
  return path.resolve(__dirname, '..', '.auth', `${role}.json`);
}

export const test = base.extend<AuthFixtures>({
  buyer1Context: async ({ browser }, use) => {
    const context = await browser.newContext({ storageState: storageState('buyer1') });
    await use(context);
    await context.close();
  },
  buyer2Context: async ({ browser }, use) => {
    const context = await browser.newContext({ storageState: storageState('buyer2') });
    await use(context);
    await context.close();
  },
  seller1Context: async ({ browser }, use) => {
    const context = await browser.newContext({ storageState: storageState('seller1') });
    await use(context);
    await context.close();
  },
  seller2Context: async ({ browser }, use) => {
    const context = await browser.newContext({ storageState: storageState('seller2') });
    await use(context);
    await context.close();
  },
  operatorContext: async ({ browser }, use) => {
    const context = await browser.newContext({ storageState: storageState('operator') });
    await use(context);
    await context.close();
  },
  buyer1Page: async ({ buyer1Context }, use) => use(await buyer1Context.newPage()),
  buyer2Page: async ({ buyer2Context }, use) => use(await buyer2Context.newPage()),
  seller1Page: async ({ seller1Context }, use) => use(await seller1Context.newPage()),
  seller2Page: async ({ seller2Context }, use) => use(await seller2Context.newPage()),
  operatorPage: async ({ operatorContext }, use) => use(await operatorContext.newPage()),
});

export { expect } from '@playwright/test';