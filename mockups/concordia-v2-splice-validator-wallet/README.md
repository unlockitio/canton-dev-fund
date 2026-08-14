# Concordia V2 Splice Validator Wallet advisory mockup

A self-contained static HTML demonstration of a proposed Concordia V2 advisory participant experience. It reproduces the current Splice Wallet navigation information architecture and header behavior while keeping the advisory assistant explicitly demo-only. It uses no dependencies, network calls, wallet connection, or confirmed upstream integration.

## Run

Open `index.html` in a browser.

## Canonical Splice Wallet source attribution

Navigation and wallet-shell behavior were derived from the upstream `canton-network/splice` repository at commit [`e6db4632965691cd835771d79dbfeafb040f0ff0`](https://github.com/canton-network/splice/tree/e6db4632965691cd835771d79dbfeafb040f0ff0):

- [`apps/wallet/frontend/src/components/Layout.tsx`](https://github.com/canton-network/splice/blob/e6db4632965691cd835771d79dbfeafb040f0ff0/apps/wallet/frontend/src/components/Layout.tsx): exact navigation order and labels, authenticated header composition, and Development Fund hero suppression.
- [`apps/wallet/frontend/src/App.tsx`](https://github.com/canton-network/splice/blob/e6db4632965691cd835771d79dbfeafb040f0ff0/apps/wallet/frontend/src/App.tsx): wallet route inventory, including `/` and `/transactions` both resolving to Transactions.
- [`apps/common/frontend/src/components/Header.tsx`](https://github.com/canton-network/splice/blob/e6db4632965691cd835771d79dbfeafb040f0ff0/apps/common/frontend/src/components/Header.tsx): horizontal header navigation and active-link underline behavior.
- [`apps/wallet/frontend/src/components/CurrentUser.tsx`](https://github.com/canton-network/splice/blob/e6db4632965691cd835771d79dbfeafb040f0ff0/apps/wallet/frontend/src/components/CurrentUser.tsx), [`LogoutButton.tsx`](https://github.com/canton-network/splice/blob/e6db4632965691cd835771d79dbfeafb040f0ff0/apps/wallet/frontend/src/components/LogoutButton.tsx), and [`TransferPreapproval.tsx`](https://github.com/canton-network/splice/blob/e6db4632965691cd835771d79dbfeafb040f0ff0/apps/wallet/frontend/src/components/TransferPreapproval.tsx): the current-user, logout, and preapproval header affordances.

The mockup reproduces the source logic, not upstream source code. Its seven canonical navigation entries are, in order: **Transactions**, **Transfer**, **Allocations**, **Subscriptions**, **Development Fund**, **Delegations**, and **FAQs**. Hash routes keep this static file navigable, with the matching link underlined. The actual wallet header has no hamburger or drawer behavior, so this demo likewise keeps the horizontal navigation and permits horizontal scrolling on narrow screens.

## Proposed Concordia route/tab deviation

There is no Concordia route or entry in the current Splice Wallet source. This mockup preserves the seven canonical navigation entries above in their exact upstream order and labels, then adds one trailing **Concordia** entry at `#/concordia`. This entry is an explicit proposed/demo deviation, not an existing Splice feature, route, partnership, or upstream acceptance.

The proposed Concordia route contains the `CONCORDIA` advisory microfrontend demonstration. It is separate from the canonical **Development Fund** route, which returns to a wallet-faithful static page with no Concordia branding or embedded chat. Concordia may include use cases such as Canton Dev Fund and SV Governance, among others; those examples do not limit its possible scope.

The in-page `CONCORDIA` wordmark and `Proposed Concordia microfrontend` descriptor make the proposed/demo status explicit. The wallet-balance hero is suppressed on this route using the same pattern as Development Fund.

## Theme palette

The static mockup uses Splice palette values as a visual reference from [`apps/common/frontend/src/theme/index.ts`](https://github.com/canton-network/splice/blob/e6db4632965691cd835771d79dbfeafb040f0ff0/apps/common/frontend/src/theme/index.ts). This is a visual reference only and does not claim official integration.

## Concrete demo paths

1. **SV Governance voting**: select **Vote on a pending proposal**, choose an illustrative pending Splice SV governance proposal, choose a draft vote, then review the non-binding handoff to the authoritative Splice/CAP review, approval, and signing journey.
2. **SV Governance proposal/change**: select **Propose a governance change**, select an existing illustrative governance mechanism/configuration, select a bounded change intent, then review a draft proposal and canonical proposal/approval handoff. The demo does not invent protocol rules.
3. **Canton Dev Fund recurring allocations**: select **Review recurring allocations**, inspect illustrative allocation statuses, then prepare an amend, suspend, terminate/finalize, or upcoming-execution action. Prepared changes are handed off for authoritative approval and signing.

These are illustrative potential Concordia use cases, not an exhaustive scope definition.

Each completed path streams a recap and offers relevant next actions or a return to the summary.

## Interaction implementation

The conversation adapts the streaming approach from Brani's `features/003-transactions/002-detail/transaction-detail-mockup.html`:

- `appendMessage`, `appendStreamingMessage`, and `streamBubbleContent` helpers append and scroll chat turns.
- A `STREAMING_PROFILE`, typing indicator, character-by-character text tasks, `.is-streaming`, and `.stream-pending` provide the streamed/typewriter assistant response.
- `renderChoices` uses uniquely named radio follow-ups and a disabled-until-selected continue action, following the reference mockup's bounded follow-up rendering pattern.
- A stream token prevents overlapping streams. `prefers-reduced-motion: reduce` renders responses immediately.

User triggers and selections are written as visible user turns in the central scrollable transcript.

## Authority boundary

The assistant only explains and prepares non-binding drafts. It never votes, proposes, submits, approves, signs, allocates, settles, or executes. Every draft handoff states that the participant must use the authoritative Splice/CAP journey, where `cap-core` supports the authoritative action path.

## Scope note

All proposal IDs, allocation names, dates, statuses, inputs, and values shown in this mockup are illustrative demo data. This file is a static demonstration, not an integrated wallet or production flow.
