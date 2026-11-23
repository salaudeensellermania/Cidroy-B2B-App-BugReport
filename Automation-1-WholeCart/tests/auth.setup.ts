import { test } from '@playwright/test';
import { mkdir } from 'fs/promises';
import path from 'path';
import { LoginPage } from '../pages/LoginPage';

const roles = ['buyer1', 'buyer2', 'seller1', 'seller2', 'operator'] as const;

test('authenticate all roles for storage-state reuse @Auth', async ({ browser }) => {
  const authDirectory = path.resolve(__dirname, '..', '.auth');
  await mkdir(authDirectory, { recursive: true });

  for (const role of roles) {
    const prefix = role.toUpperCase();
    const username = process.env[`${prefix}_USER`];
    const password = process.env[`${prefix}_PASS`];
    if (!username || !password) {
      throw new Error(`Missing credentials for ${role}`);
    }

    const context = await browser.newContext();
    try {
      const page = await context.newPage();
      await new LoginPage(page).login(username, password);
      await context.storageState({ path: path.join(authDirectory, `${role}.json`) });
    } finally {
      await context.close();
    }
  }
});