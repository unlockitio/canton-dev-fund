# Concordia focused areas mockup

A self-contained static HTML demonstration of a proposed Concordia V2 advisory participant experience. The focused navigation contains four areas:

- `#/core`: CAP lifecycle, participant roles, status and review, and the authority boundary.
- `#/governance`: proposal review, voting explanations, governance-change draft preparation, and proposal comparison.
- `#/auctions`: auction lifecycle, state review, and an illustrative review draft flow.
- `#/recurrence`: scheduled recurrence, accrual, upcoming executions, and amend, suspend, or finalize explanations.

The assistant keeps one continuous transcript while navigating between areas. Existing messages remain visible across route changes, while new user and assistant messages identify and use the currently selected area. Unknown hash routes fall back to `#/core`. Its actions explain concepts and prepare non-binding illustrative drafts relevant to that area. It does not vote, submit, approve, sign, allocate, settle, or execute.

## Run

Open `index.html` in a browser. The mockup has no dependencies or build step.

## Static demo boundary

All IDs, roles, statuses, dates, schedules, rates, terms, and allocation examples are illustrative static data. There are no network calls, wallet connections, wallet providers, signing actions, upstream integrations, or production data. Every authoritative handoff is a non-functional label that states this static demo boundary. Contracts, participant authority, approval rules, and signing mechanisms remain authoritative outside this mockup.

The styling is Unlockit branded. Current BPMN and PlantUML assets are separate proposal materials and are not modified by this mockup.

## Interaction behavior

The conversation uses a self-contained streaming transcript:

- Assistant responses use a typing indicator and character-by-character streaming.
- A stream token cancels an earlier response before a new one starts, including when the newer action follows a route change.
- Follow-up actions are rendered only for the selected area while the shared transcript remains intact.
- `prefers-reduced-motion: reduce` disables the streaming animation and smooth scrolling, rendering responses immediately.
- Hash routing updates the visible page, active `aria-current="page"`, area label, and area-specific assistant actions.

The four area handoff labels are **Open authoritative CAP review**, **Open authoritative governance review**, **Open authoritative auction review**, and **Open authoritative recurrence review**. Each remains non-functional and directs the participant to the relevant authoritative review boundary outside this static demonstration.
