# Contributing

## Dev setup

```bash
git clone git@github.com:naufalfalah/id-phone-utils.git
cd id-phone-utils
npm install
```

Requires Node.js >= 14 (see `engines` in `package.json`).

## Scripts

- `npm test` — run the test suite (Vitest)
- `npm run lint` / `npm run lint:fix` — ESLint over `src`
- `npm run format` — Prettier, writes in place
- `npm run build` — bundle `src/index.ts` to `dist` (CJS + ESM + `.d.ts`) via tsup

Before opening a PR, make sure `npm test` and `npm run lint` both pass. CI runs the same two checks on every push and pull request.

## Coding style

- Formatting is enforced by Prettier (`.prettierrc`) and surfaced through ESLint (`prettier/prettier: error`) — run `npm run format` rather than hand-formatting.
- TypeScript strict typing: avoid `any` (`no-explicit-any` is a warning, not an error, but treat it as one), and give exported functions explicit return types.
- Keep the library zero-dependency. If a change would require a runtime dependency, discuss it in an issue first — see the "Key Technical Decisions" section in the README for why this project stays dependency-free.

## How releases are cut

1. Update code and add/adjust tests under `tests/`.
2. Bump `version` in `package.json` (semver) and add an entry to `CHANGELOG.md`.
3. Commit and push to `main`; confirm CI is green.
4. Publish: `npm publish`.
5. Tag and push the tag: `git tag vX.Y.Z && git push --tags`.
6. Create a matching GitHub release: `gh release create vX.Y.Z --notes-file CHANGELOG.md` (trim notes to the relevant section).

Keep `package.json` version, the latest npm-published version, and the latest GitHub release tag in sync at all times — don't bump `package.json` ahead of an actual publish.

## Reporting issues / proposing changes

Open a GitHub issue describing the bug or the phone-number format/carrier-prefix case that isn't handled. For carrier prefix changes, please link a source (operator announcement, regulator listing) since the prefix table is maintained by hand.
