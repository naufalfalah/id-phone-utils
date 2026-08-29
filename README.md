# id-phone-utils

[![npm version](https://img.shields.io/npm/v/id-phone-utils)](https://www.npmjs.com/package/id-phone-utils)
[![CI](https://github.com/naufalfalah/id-phone-utils/actions/workflows/ci.yml/badge.svg)](https://github.com/naufalfalah/id-phone-utils/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> Validate, normalize, and identify Indonesian mobile phone numbers — zero dependencies, full TypeScript support.

## Why

Indonesian phone numbers arrive in a dozen formats: `+62812...`, `62812...`, `0812-3456-7890`, `(0812) 3456 7890`. Before you can validate or store them you have to normalize them, and before you can route or label them you need to know the carrier. This library handles all of that in three static method calls so you don't have to roll your own regex and prefix table.

## Features

- Normalize any common Indonesian number format to the canonical `08xx` local format
- Validate mobile numbers against the correct length and prefix rules
- Detect the carrier (Telkomsel, Indosat, XL, Tri, Smartfren, Axis) from the number prefix
- Strip any non-numeric noise (spaces, dashes, dots, parentheses) while preserving a leading `+`
- Ships as both ESM and CJS — works in Node.js ≥ 14, bundlers, and TypeScript projects out of the box

## Installation

```bash
npm install id-phone-utils
# or
yarn add id-phone-utils
# or
pnpm add id-phone-utils
```

## Usage

```ts
import { IndonesianPhoneValidator } from 'id-phone-utils';

const raw = '+62 812-3456-7890';

IndonesianPhoneValidator.clean(raw); // '+6281234567890'
IndonesianPhoneValidator.normalize(raw); // '081234567890'
IndonesianPhoneValidator.isValid(raw); // true
IndonesianPhoneValidator.getOperator(raw); // 'Telkomsel'
```

## API Reference

All methods are static — no instantiation required.

---

### `normalize(phone: string): string`

Converts any common Indonesian number format to the local `08xx` form. Strips spaces and dashes, then rewrites `+62` or `62` prefixes to `0`.

| Parameter | Type     | Description                              |
| --------- | -------- | ---------------------------------------- |
| `phone`   | `string` | Raw phone number in any supported format |

**Returns** `string` — the normalized number.

```ts
IndonesianPhoneValidator.normalize('+6281234567890'); // '081234567890'
IndonesianPhoneValidator.normalize('6281234567890'); // '081234567890'
IndonesianPhoneValidator.normalize('0812-3456-7890'); // '081234567890'
```

---

### `isValid(phone: string): boolean`

Returns `true` if the number is a valid Indonesian **mobile** number. Normalizes the input first, then checks that it matches the pattern `08[1-9]` followed by 7–11 digits (total length 9–13 digits).

| Parameter | Type     | Description                          |
| --------- | -------- | ------------------------------------ |
| `phone`   | `string` | Phone number in any supported format |

**Returns** `boolean`.

```ts
IndonesianPhoneValidator.isValid('+6281234567890'); // true
IndonesianPhoneValidator.isValid('0812345'); // false  — too short
IndonesianPhoneValidator.isValid('02112345678'); // false  — landline prefix
```

---

### `getOperator(phone: string): string`

Identifies the mobile carrier by matching the normalized number against known Indonesian operator prefixes. Normalizes the input first.

| Parameter | Type     | Description                          |
| --------- | -------- | ------------------------------------ |
| `phone`   | `string` | Phone number in any supported format |

**Returns** `string` — one of `'Telkomsel'`, `'Indosat'`, `'XL'`, `'Tri'`, `'Smartfren'`, `'Axis'`, or `'Unknown Operator'`.

```ts
IndonesianPhoneValidator.getOperator('081234567890'); // 'Telkomsel'
IndonesianPhoneValidator.getOperator('085612345678'); // 'Indosat'
IndonesianPhoneValidator.getOperator('081712345678'); // 'XL'
IndonesianPhoneValidator.getOperator('089512345678'); // 'Tri'
IndonesianPhoneValidator.getOperator('088812345678'); // 'Smartfren'
IndonesianPhoneValidator.getOperator('083112345678'); // 'Axis'
```

**Supported prefixes by operator:**

| Operator  | Prefixes                                             |
| --------- | ---------------------------------------------------- |
| Telkomsel | 0811, 0812, 0813, 0821, 0822, 0823, 0851, 0852, 0853 |
| Indosat   | 0814, 0815, 0816, 0855, 0856, 0857, 0858             |
| XL        | 0817, 0818, 0819, 0859, 0877, 0878                   |
| Tri       | 0895, 0896, 0897, 0898, 0899                         |
| Smartfren | 0881–0889                                            |
| Axis      | 0831, 0832, 0833, 0838                               |

---

### `clean(phone: string): string`

Removes all non-numeric characters from a phone string. Preserves a single leading `+` if present.

| Parameter | Type     | Description                             |
| --------- | -------- | --------------------------------------- |
| `phone`   | `string` | Phone number string with any formatting |

**Returns** `string` — digits only (with optional leading `+`).

```ts
IndonesianPhoneValidator.clean('0812 3456 7890'); // '081234567890'
IndonesianPhoneValidator.clean('0812-3456-7890'); // '081234567890'
IndonesianPhoneValidator.clean('(0812)34567890'); // '081234567890'
IndonesianPhoneValidator.clean('0812.3456.7890'); // '081234567890'
IndonesianPhoneValidator.clean('+62 812-3456-7890'); // '+6281234567890'
```

## Key Technical Decisions

### Static class methods over plain exported functions

**Decision:** All operations live as static methods on `IndonesianPhoneValidator` rather than as individual named exports.

**Why:** One import gives access to everything, and the shared operator-prefix table stays private to the class instead of floating as a module-level constant.

**Trade-off:** Less tree-shakeable — bundlers pull in the whole class even if a consumer only calls `isValid`. It's also a less common shape for modern ESM utility libraries, which usually favor flat function exports.

### Regex + a hand-maintained prefix table, instead of a library like `libphonenumber-js`

**Decision:** Carrier detection uses a hardcoded map of prefixes per operator; validation uses a single regex — no phone-number parsing library.

**Why:** Keeps the package genuinely zero-dependency and tiny, appropriate for a narrow, single-country use case rather than pulling in a large general-purpose phone-number library.

**Trade-off:** The prefix table needs manual updates whenever a regulator reassigns ranges to carriers, and it can't detect number portability — a number ported off its original carrier will still be reported under the old one.

### Never throws — every method returns a best-effort value instead of raising an error

**Decision:** Invalid or malformed input doesn't throw; it returns a sentinel like `'Unknown Operator'` or an unchanged string.

**Why:** Keeps the API safe to use inline in conditionals without try/catch, which matters for a small validation utility typically called on user input at the edges of an app.

**Trade-off:** Failures are silent — a typo'd number doesn't surface as an error, so callers must remember to check the sentinel value explicitly rather than relying on exceptions to catch mistakes.

## Contributing

1. Fork the repository and create a feature branch.
2. Run `npm install` to set up dependencies.
3. Add or update tests in `tests/` — all changes must be covered.
4. Run `npm test` to verify and `npm run lint` to check style.
5. Open a pull request with a clear description of the change.

See [CONTRIBUTING.md](CONTRIBUTING.md) for dev setup, coding style, and the release process.

## License

MIT © [Naufal Falah](https://github.com/naufalfalah)
