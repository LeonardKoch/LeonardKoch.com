# TODO: Upgrade to Vite 8 and unpin TanStack Start

**Status:** open · noted 2026-10-19

## Background

A deploy flagged `@tanstack/react-start@1.147.1` for an XSS vulnerability
(CVE-2026-102989), fixed in 1.168.60. Commit `775cd98` upgraded to
**1.168.61** and pinned it with `~1.168.61` in `package.json`.

## Why it's pinned

From **1.169.0** on, `@tanstack/react-start` and
`@tanstack/start-plugin-core` require `vite >= 8.0.0`. This project is on
Vite 7.3.1. With 1.169.3 installed on Vite 7, the build fails with:

```
Could not resolve entry module "index.html".
```

Nothing points to the cause: the plugin import still resolves, and the only
sign is an `invalid` peer dependency warning in `npm ls vite`. Vite falls
back to a plain SPA build because the Start plugin doesn't set up the
client entry.

The 1.168.x line still accepts `vite >= 7.0.0` and includes the fix, so the
`~` pin keeps `bun install` from moving to 1.169+.

## What the upgrade involves

- [ ] Upgrade `vite` to `^8` (8.3.4 was the latest on 2026-10-19).
- [ ] Upgrade `@vitejs/plugin-react` to `^6`, which requires Vite 8. Check
      its new peer dependencies (`oxc-transform-react`,
      `@rolldown/plugin-babel`) and whether the `include` regex for
      `.mdx` in `vite.config.ts` still works.
- [ ] Confirm the other Vite plugins accept Vite 8: `@tailwindcss/vite` and
      `@tanstack/devtools-vite` do. Check `@mdx-js/rollup` (used with
      `enforce: 'pre'`), `vite-tsconfig-paths`, `nitro` (currently
      `latest`), and the local plugins in `scripts/`.
- [ ] Upgrade `vitest` if needed (v3 is installed; v5 supports Vite 8).
- [ ] Change `@tanstack/react-start` from `~1.168.61` back to a caret range
      (`^1.169.x` or later).
- [ ] Run `bun run build` and check that post pages render with SSR and
      Shiki highlighting, and that MDX hot reload still works in `bun run dev`.

## Related

- `bun run test` fails with "No test files found" because the project has
  no tests. That isn't caused by this upgrade, but it means the build is the
  only automated check.
- `nitro` is set to `latest` (a beta at the moment), so a fresh install can
  pick up breaking changes. Consider pinning it while doing this upgrade.
