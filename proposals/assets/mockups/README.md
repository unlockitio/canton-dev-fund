# Open Source Reference Wallet mockup

This directory is a self-contained, static browser demonstration of the Open Source Reference Wallet experience. It uses mocked balances, parties, offers, preapprovals, allocations, and transaction history. No backend, Wallet Gateway, ledger, signing, or approval request is connected.

## Two presentation modes

- **Baseline wallet mode:** Agentic UX is off by default. The familiar wallet tabs remain available as ordinary static pages with mocked forms, review notices, and informational actions.
- **Agentic UX mode:** Turn on **Agentic UX** in Settings. Selecting a wallet tab then opens a ChatGPT-like wallet assistant grounded in that tab context while keeping the Reference Wallet navigation bar visible beside the assistant shell. The assistant streams responses locally, renders user answers, offers selectable cards, collects transfer details, and builds reviewable drafts through guided multi-turn journeys. Every completed response and page-specific journey presents visible follow-up choices, including return and navigation controls. The **Open wallet assistant** button also starts a general landing conversation.

The assistant covers dashboard offers and action-required items, assets, transfers, transaction history, allocations, preapprovals, and FAQ guidance. Return to the wallet at any time with **Return to wallet**. Agentic mode is presentation-only: it does not autonomously sign, approve, submit, execute, mutate balances, or contact a service. Every action stops at review or explanation.

## Run locally

Open `index.html` directly in a browser. The mockup uses only local HTML, CSS, and JavaScript with no dependencies or network requests. Agentic mode preference is stored in `localStorage` when the browser permits it.
