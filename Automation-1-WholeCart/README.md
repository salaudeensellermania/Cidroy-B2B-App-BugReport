# WholeCart E2E Automation

Playwright end-to-end tests for the WholeCart application, written in TypeScript. The test setup authenticates buyer, seller, and operator accounts, then uploads seller product data before Chromium tests run.

## Requirements

- Git, to clone the repository.
- Node.js 20 LTS or newer, which includes npm.
- Access to a WholeCart test tenant and valid credentials for all five roles: buyer1, buyer2, seller1, seller2, and operator.
- Chromium and its required system libraries, installed in the setup steps below.

Check that Node.js and npm are installed:

```bash
node --version
npm --version
```

## Installation

1. Clone the repository and enter its directory:

	```bash
	git clone <repository-url>
	cd <repository-directory>
	```

2. Install project dependencies:

	```bash
	npm install
	```

3. Install Playwright's Chromium browser and Linux system dependencies:

	```bash
	npx playwright install --with-deps chromium
	```

	On Windows or macOS, install Chromium without the Linux dependency option:

	```bash
	npx playwright install chromium
	```

4. Create a local environment file from the template:

	```bash
	cp .env.example .env
	```

	On Windows Command Prompt:

	```cmd
	copy .env.example .env
	```

5. Edit `.env` and set `BASE_URL` to the WholeCart tenant login URL. Add valid credentials for all five test roles:

	```dotenv
	BASE_URL=https://your-wholecart-tenant.example/c/tenant/login
	BUYER1_USER=buyer1
	BUYER1_PASS=replace-me
	BUYER2_USER=buyer2
	BUYER2_PASS=replace-me
	SELLER1_USER=seller1
	SELLER1_PASS=replace-me
	SELLER2_USER=seller2
	SELLER2_PASS=replace-me
	OPERATOR_USER=operator
	OPERATOR_PASS=replace-me
	```

	Replace the example URL and placeholder credentials with values for your test environment. Keep `.env` private; it is excluded from Git.

## Running Tests

Run the TC 1 tests in Chromium:

```bash
npm run test:tc1
```

Run all test files in Chromium:

```bash
npx playwright test --project=chromium
```

The Chromium project automatically runs the setup project first. Setup signs in with each role and saves browser sessions under `.auth/`, then uploads the seller CSV fixtures. These generated local files are excluded from Git.

Run a specific group by title, for example:

```bash
npx playwright test -g "TC 4" --project=chromium
```

## Test Reports

Open the HTML report after a test run:

```bash
npx playwright show-report
```

Playwright is configured to collect traces on the first retry and retain screenshots and video when a test fails.

## Defect Notes

- TC 1.1 confirms the invoice currently displays the buyer GSTIN but omits the seller GSTIN. The specification assertion requiring both GSTIN entries remains in the test; execution therefore reports this application defect rather than weakening the requirement.

- TC 3.1 confirms the bug that for Seller cancelled products, the cancellation status is not reflected in the buyer order page.

- TC 4.1 confirms the bug that not able to select the slot during redelivery request by the buyer
