# Bank Liquidity Manager

Vue 3 / Express / Drizzle monorepo for tracking treasury yields and placing
liquidity orders. See `claude_docs/` for deeper guides on specific topics below

## Style Guide

If you need the UI style guide (colors, fonts, buttons, cards,
alert banners, etc.), see `claude_docs/styleguide.md`.

## API Calls

Any time the client needs to call the API, wrap it in the appropriate
function in `client/src/lib/api.ts` rather than calling `fetch` directly —
see `claude_docs/api-conventions.md`.


