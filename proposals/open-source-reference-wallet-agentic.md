# Development Fund Proposal: Open Source Reference Wallet Agentic Extension

| Field | Value |
| :---- | :---- |
| Author | Unlockit |
| Org | Unlockit |
| Status | Draft |
| Created | 2026-08-18 |
| Champion | TBD |
| Primary repository | [Current wallet repository](https://github.com/canton-network/wallet) (implementation context) |
| Related proposal | [Approved Open Source Reference Wallet proposal](https://github.com/canton-foundation/canton-dev-fund/blob/main/proposals/2026-03-DA-proposal-open-source-reference-wallet.md) |
| Proposal name | Open Source Reference Wallet Agentic Extension |

---

## Abstract

This proposal requests Development Fund support for **Open Source Reference Wallet Agentic Extension**, an open-source extension to the Open Source Reference Wallet described in the [approved Open Source Reference Wallet proposal](https://github.com/canton-foundation/canton-dev-fund/blob/main/proposals/2026-03-DA-proposal-open-source-reference-wallet.md). The work adds an agentic user experience that helps a user understand the wallet, discover supported actions, and complete journeys without changing the wallet's existing authority model.

The agent will explain what the user can do, surface relevant portfolio and workflow context, guide the user through supported journeys, and prepare actions for review. A prepared action is non-binding. The user must explicitly approve it through the existing wallet approval and signing boundary before any binding execution occurs. The implementation will use the Open Source Reference Wallet's existing application structure, dApp SDK, Wallet Gateway, APIs, and test conventions as documented by the approved reference-wallet proposal and its implementation repository, rather than creating a parallel wallet or signing path.

The proposal does not fund autonomous signing, bypassing the Wallet Gateway, custody or ledger primitives, settlement primitives, SV governance reimplementation, or deprecated Validator Wallet work. It is a reference implementation and reusable UX pattern for wallet providers, dApp developers, and Canton ecosystem teams.

---

## Specification

### 1. Objective

Deliver an open-source, provider-agnostic agentic UX extension for the Open Source Reference Wallet described in the [approved Open Source Reference Wallet proposal](https://github.com/canton-foundation/canton-dev-fund/blob/main/proposals/2026-03-DA-proposal-open-source-reference-wallet.md). The [current wallet repository](https://github.com/canton-network/wallet) is implementation context, not the subject or owner of this proposal, with clear, testable boundaries between explanation, preparation, approval, signing, and execution.

The first release should enable a user to:

- understand portfolio state and the supported actions available in the current context
- ask questions about wallet concepts, balances, assets, transaction history, and action requirements
- receive guided, step-by-step assistance through supported Open Source Reference Wallet journeys
- prepare a supported action, including the inputs and expected consequences, for user review
- inspect a reviewable action summary before it is submitted to the existing approval/signing flow
- approve or reject the prepared action explicitly through the wallet's existing human-controlled boundary
- recover safely from missing information, stale state, denied approval, unsupported requests, or Wallet Gateway errors

The first release must not:

- sign autonomously or hold, derive, export, or manage user keys
- submit or execute a binding action without explicit human approval
- call ledger or signing endpoints by bypassing the Wallet Gateway or established dApp SDK route
- introduce custody, ledger, settlement, token, or authorization primitives
- reimplement SV governance
- revive, extend, or depend on deprecated Validator Wallet work
- claim support for a workflow, endpoint, or package interface until it is demonstrated against the current repository and tests

The intended outcome is a cloneable reference implementation that shows wallet providers and dApp developers how an agent can improve discoverability and task completion while preserving Canton authorization, Wallet Gateway, and signing boundaries.

### 2. Implementation Mechanics

The project will add an agentic interaction layer to the Open Source Reference Wallet described in the approved reference-wallet proposal. It will reuse the current wallet repository's application structure, dApp SDK integration, Wallet Gateway boundary, existing approval/signing components, and test harness as implementation context. Exact package names and interfaces will be confirmed against the repository at implementation start and recorded with the delivered code.

The implementation is organized around four responsibilities:

- **Context and explanation:** expose only the wallet and workflow context the user is permitted to see, and explain available actions and required inputs.
- **Journey guidance:** help the user navigate existing Open Source Reference Wallet screens and supported dApp journeys without inventing authority or changing contract semantics.
- **Action preparation:** construct a non-binding, reviewable representation of an existing supported wallet action.
- **Approval and execution handoff:** pass the prepared action to the existing Wallet Gateway and approval/signing route, requiring explicit human approval before binding execution.

The agent is an interaction and presentation layer. Existing wallet contracts, party authority, dApp SDK contracts, Wallet Gateway behavior, approval policy, signing mechanism, and ledger outcomes remain authoritative.

#### Core Layer: `cap-core`

No new ledger or custody core is proposed. The reference implementation will use the current wallet and dApp SDK contracts as the source of truth. A small client-side domain adapter may normalize permitted read context and prepared-action metadata for the agent, but it will not create a competing contract model or signing API.

The adapter will:

- identify the current Open Source Reference Wallet context and supported action types
- preserve identifiers, amounts, parties, assets, recipients, and other fields supplied by the existing wallet route
- label data as current, unavailable, stale, or requiring user confirmation
- produce a deterministic review model for an action already supported by the wallet
- reject unsupported or ambiguous requests instead of fabricating an action

The adapter will not authorize, sign, submit, settle, or mutate Canton state.

#### Governance Module: `cap-governance`

No governance module is proposed. The agent may explain an existing approval requirement shown by the Open Source Reference Wallet or Wallet Gateway and may guide a user to the applicable approval step, but it will not implement SV governance, vote, change governance state, or replace governance-owned interfaces.

Any approval prompt must make the distinction between:

- an agent-generated explanation or draft
- a wallet action prepared for review
- the user's explicit approval
- the canonical Wallet Gateway and signing/execution result

#### Recurrence Module: `cap-recurrence`

No recurrence module is proposed. Recurring transfers, schedules, subscriptions, or other future financial obligations are out of scope unless the current wallet already exposes a supported journey and the implementation merely explains or guides that journey without adding new semantics. The project will not introduce scheduling, accrual, payment-stream, or settlement primitives.

#### Reference Application: Open Source Reference Wallet Agentic Extension (`cap-dapp`)

This proposal does not deliver the Concordia Dapp, `cap-dapp`, CAP modules, or Concordia V2. The reference application is the **Open Source Reference Wallet described in the approved Open Source Reference Wallet proposal**, extended with an agentic UX. The current [wallet repository](https://github.com/canton-network/wallet) is cited only as implementation context for that approved reference-wallet work.

The implementation will be grounded in repository evidence, including as applicable:

- `examples/portfolio/` for the existing Open Source Reference Wallet and its user journeys
- the repository's dApp SDK packages and examples for supported wallet-to-dApp interaction
- Wallet Gateway clients, routes, and configuration used by the Open Source Reference Wallet
- existing approval and signing components, which remain the only route to binding execution
- unit, component, integration, and end-to-end tests already covering these surfaces

The exact file-level inventory will be included in the release documentation and milestone evidence. It will distinguish existing code from new code and will not describe unverified implementation status as complete.

The agent may use a configured model or deterministic local interaction logic, but model selection is an implementation decision subject to privacy, reproducibility, and operational review. The baseline behavior must remain understandable and testable without granting the model authority. Sensitive context must be minimized and must follow the wallet's existing visibility and user-consent boundaries.

#### Illustrative Execution Flows

**Open Source Reference Wallet discovery and explanation**

1. The user opens the existing Open Source Reference Wallet and asks what is available.
2. The agent reads permitted current Open Source Reference Wallet context through existing application state and supported SDK/API reads.
3. The agent explains available assets, relevant status, and supported next actions, distinguishing observed facts from guidance.
4. The user selects a supported journey or continues through the existing UI.

**Prepare an action for review**

1. The user asks for help with a supported action exposed by the Open Source Reference Wallet.
2. The agent asks for missing inputs and validates them against the existing UI and SDK constraints.
3. The agent prepares a non-binding action representation using the existing action route.
4. The UI presents the recipient, asset, amount, party/account context, fees or other applicable fields, and a clear explanation of what will happen.
5. The user edits, rejects, or explicitly approves the prepared action.
6. Only after explicit approval does the existing Wallet Gateway and approval/signing route process the binding request.
7. The UI reports the resulting status from the canonical route, including rejection, cancellation, timeout, or failure.

**dApp-guided journey**

1. A supported dApp requests a wallet interaction through the existing dApp SDK boundary.
2. The agent explains the request in user terms and identifies the relevant Open Source Reference Wallet action.
3. The agent may prepare a reviewable response or transaction request using the SDK's existing shape.
4. The user reviews and explicitly approves or rejects it.
5. The Wallet Gateway and existing signing boundary remain responsible for authorization and execution.

The agent cannot turn a read-only request into a binding action, cannot approve its own preparation, and cannot retry a rejected binding action without a new explicit user decision.

#### Proposed Splice Work

No new Splice governance or deprecated Validator Wallet implementation is proposed. The work will integrate only with current, documented, and testable wallet interfaces in the current reference wallet repository. Where the Open Source Reference Wallet uses the Wallet Gateway or dApp SDK, the agent will compose with those surfaces rather than replace them.

The proposal explicitly excludes:

- autonomous signing or unattended transaction execution
- bypassing, replacing, or weakening the Wallet Gateway
- new custody, ledger, token, or settlement primitives
- SV governance reimplementation or changes to governance authority
- deprecated Validator Wallet work

Any upstream change needed in the wallet repository remains contingent on maintainer review and normal contribution processes. This proposal does not assert maintainer approval, partnership, or completed implementation.

### 3. Architectural Alignment

Open Source Reference Wallet Agentic Extension is application-layer public infrastructure that extends the Open Source Reference Wallet described in the approved Open Source Reference Wallet proposal. It aligns with Canton by preserving multi-party authorization, privacy-aware visibility, explicit party authority, dApp SDK boundaries, Wallet Gateway mediation, and canonical approval/signing behavior.

The architecture separates:

- Open Source Reference Wallet reads and permitted context
- agent explanation and guidance
- non-binding action preparation
- explicit user approval
- Wallet Gateway authorization and signing
- ledger and settlement outcomes already provided by existing Canton infrastructure

The agent does not create authority. It can only present actions already available through the current wallet integration and hand an approved action to the existing canonical route. Compatibility claims will be made only for interfaces demonstrated by repository tests.

#### Architectural Views

The architectural views for this proposal are expressed through the existing repository structure and its documented runtime boundaries. A release may add diagrams if they improve reviewability, but diagrams will describe the implemented Open Source Reference Wallet integration rather than imply new wallet infrastructure.

##### System Context

The system context includes the end user, the existing Open Source Reference Wallet, the agentic interaction layer, the dApp SDK, the Wallet Gateway, existing approval/signing mechanisms, Canton services, and supported dApps.

The agent receives permitted context from the Open Source Reference Wallet and dApp SDK, provides explanations and prepared drafts back to the user, and sends only explicitly approved actions to the existing Wallet Gateway and signing boundary. Canton services and ledger outcomes remain outside the agent's authority.

###### System Context Box Catalog

| Box | Role | Relationship to the proposal | Status or authority boundary |
| --- | --- | --- | --- |
| End Users | Inspect wallet state and approve or reject actions | Use the Open Source Reference Wallet and agentic UX | Sole source of explicit human approval |
| Open Source Reference Wallet | Open Source Reference Wallet described in the approved reference-wallet proposal | Hosts the agentic UX and existing journeys | Existing application surface; the approved proposal and implementation repository define the boundary |
| Agentic UX | Explains, guides, and prepares non-binding actions | New application-layer reference capability | No signing, custody, governance, ledger, or settlement authority |
| dApp SDK | Existing dApp interaction boundary | Supplies and receives supported dApp requests | Existing SDK contracts and tests remain authoritative |
| Wallet Gateway | Existing wallet mediation and authorization route | Receives approved actions through established integration | Must not be bypassed or replaced |
| Approval and signing boundary | Existing user-controlled binding step | Final human-controlled gate before execution | Explicit approval required; agent cannot satisfy it |
| Canton services and ledger | Execute existing authorized Canton operations | Receive effects through existing wallet routes | No new primitive is introduced |
| Supported dApps | Request supported wallet interactions | Integrate through the existing dApp SDK | Adoption and compatibility require demonstrated interfaces |

##### Container Diagram

The container view contains the existing Open Source Reference Wallet, the agent context and guidance layer, the action preparation/review layer, the existing dApp SDK integration, the existing Wallet Gateway integration, and the existing approval/signing boundary.

###### Container Responsibility Catalog

| Box | Responsibility | Dependencies or outputs | Explicit boundary |
| --- | --- | --- | --- |
| Open Source Reference Wallet | Displays balances, assets, history, supported actions, and review screens | Existing wallet repository and APIs | Does not delegate approval to the agent |
| Agent Context Adapter | Selects and normalizes permitted current context | Open Source Reference Wallet state, existing SDK/API reads | Read and presentation context only |
| Guidance Layer | Explains state, actions, requirements, and errors | Context adapter and documented action catalog | No authority and no binding side effects |
| Action Preparation and Review | Collects inputs and creates a reviewable draft | Existing supported action schemas | Draft is non-binding until user approval |
| dApp SDK Integration | Handles supported dApp requests | Existing dApp SDK | No alternate signing route |
| Wallet Gateway Integration | Sends explicitly approved requests through the current gateway | Existing Wallet Gateway | Gateway cannot be bypassed |
| Approval and Signing Boundary | Obtains explicit user approval and invokes existing signing behavior | Current wallet implementation | Agent cannot approve, sign, or execute |
| Existing Canton Services | Process authorized operations and report outcomes | Current wallet and Canton infrastructure | No new ledger or settlement primitive |

### 4. Backward Compatibility

No protocol-level backward compatibility impact is expected. The proposal is an additive application-layer capability for the existing Open Source Reference Wallet and does not change Canton protocol behavior, ledger models, custody, settlement, governance, or signing primitives.

Existing Open Source Reference Wallet journeys must remain usable without the agent. Existing dApp SDK and Wallet Gateway integrations remain the compatibility boundary. The agent will be feature-gated where appropriate, will fail closed for unsupported requests, and will document any UI or configuration changes. Any unavoidable interface change will include migration and rollback guidance and will be validated against the current repository tests.

---

## Milestones and Deliverables

Each milestone advances the existing Open Source Reference Wallet agentic experience while preserving the current wallet boundaries. Exact calendar dates and funding amounts require committee agreement and are intentionally left open pending scope recalculation.

### Milestone 1: Discovery, Design, and Prototypes

- **Estimated Delivery:** Month 1
- **Focus:** Confirm current wallet surfaces and define the bounded agentic UX.
- **Deliverables / Value Metrics:**
  - repository evidence inventory covering `examples/portfolio/`, dApp SDK integration, Wallet Gateway integration, approval/signing boundaries, and relevant tests
  - interaction design for explanation, guidance, action preparation, explicit approval, rejection, and recovery
  - threat model and data-minimization plan for agent context
  - documented in-scope and out-of-scope action catalog
  - clickable or runnable Open Source Reference Wallet prototype that demonstrates a prepared action without binding execution
  - tests for context filtering, unsupported requests, and the approval boundary

### Milestone 2: First Runtime Slices in Open Source Reference Wallet and dApp Journeys

- **Estimated Delivery:** Month 2
- **Focus:** Validate the extension in two bounded interaction contexts: Open Source Reference Wallet actions and dApp-requested actions. It does not deliver Concordia V2 or CAP modules.
- **Deliverables / Value Metrics:**
  - Open Source Reference Wallet flow that explains current state and prepares at least one existing supported action for review
  - dApp SDK flow that explains a supported request and prepares the corresponding review state
  - explicit approval, rejection, cancellation, stale-state, and Wallet Gateway error paths
  - unit/component tests for both flows and the no-autonomous-signing invariant
  - integration or sandbox evidence using the current repository's supported wallet test setup

### Milestone 3: Runtime Reference Flows and Boundary Documentation

- **Estimated Delivery:** Month 3
- **Focus:** Harden reference flows and document integration boundaries with adjacent wallet infrastructure and SV governance.
- **Deliverables / Value Metrics:**
  - end-to-end Open Source Reference Wallet journeys using the existing Wallet Gateway and signing route
  - dApp SDK interoperability evidence for supported requests
  - documentation confirming that no SV governance or deprecated Validator Wallet implementation is included
  - test evidence that agent output cannot approve, sign, submit, or execute a binding request
  - maintainer and upstream dependency record for any required wallet repository contribution; no approval is claimed before it exists

### Milestone 4: End-to-End Composition and Release Readiness

- **Estimated Delivery:** Month 4
- **Focus:** Publish a cloneable, documented reference implementation.
- **Deliverables / Value Metrics:**
  - open-source implementation in the wallet repository or an agreed companion repository, under a compatible public license
  - concrete source paths for the Open Source Reference Wallet agent components, action catalog, context adapter, review UI, and tests
  - setup and run instructions for the existing Open Source Reference Wallet example and agentic flows
  - unit, component, integration, and end-to-end test evidence appropriate to the current repository
  - security and privacy review focused on prompt/context handling, injection resistance, data minimization, approval integrity, and fail-closed behavior
  - release notes that distinguish delivered code, existing reused code, assumptions, and known limitations

### Milestone 5: External Adoption Validation

- **Estimated Delivery:** Up to 12 months after Milestone 4 acceptance
- **Focus:** Validate reuse by independent wallet or dApp teams.
- **Deliverables / Value Metrics:**
  - at least 2 qualified independent teams evaluating or integrating the agentic Open Source Reference Wallet patterns in a pilot or production application
  - adopter confirmation to the Tech & Ops Committee
  - documented evidence of substantive reuse or adaptation of the delivered action preparation, review, or boundary patterns
  - letters of intent may support evaluation but do not satisfy this milestone
  - exact adoption evidence and funding qualification remain open decisions

### Milestone 6: Extended External Adoption

- **Estimated Delivery:** Up to 24 months after Milestone 4 acceptance
- **Focus:** Reward additional external adoption beyond Milestone 5.
- **Deliverables / Value Metrics:**
  - additional qualified teams using the reference UX or adapting its documented integration patterns
  - evidence of use in pilot or production applications
  - adopter confirmation and traceability to delivered artifacts
  - any per-team payments, breadth premiums, and total cap require recalculation and committee approval after the core scope and funding are agreed

---

## Acceptance Criteria

The Tech & Ops Committee will evaluate completion based on:

- deliverables completed as specified for each milestone
- a working agentic UX integrated with the existing Open Source Reference Wallet
- accurate explanation of supported actions and current permitted context
- reviewable non-binding preparation for supported Open Source Reference Wallet and dApp SDK journeys
- explicit human approval before any binding Wallet Gateway/signing request
- no autonomous signing, custody, ledger, settlement, SV governance, or deprecated Validator Wallet work
- documentation sufficient for another team to build, run, inspect, and extend the reference implementation

Project validation:

- **Working implementation.** The existing Open Source Reference Wallet runs with the agentic UX enabled and remains usable with it disabled.
- **Boundary preservation.** Tests demonstrate that agent output alone cannot approve, sign, submit, or execute a binding operation and that approved operations still use the existing Wallet Gateway and signing route.
- **Supported journeys.** Open Source Reference Wallet and dApp SDK flows are demonstrated only for action types present in the current wallet repository.
- **Passing test suite.** Relevant repository unit, component, integration, sandbox, and end-to-end tests pass, including new tests for approval, rejection, stale state, errors, and unsupported requests.
- **Open-source release.** Source, setup instructions, test commands, and limitations are public and reproducible.
- **Security and privacy.** Context access, prompt handling, data minimization, and fail-closed behavior are documented and reviewed.
- **External adoption.** Adoption milestones require documented evidence and adopter confirmation; letters of intent alone do not satisfy acceptance.

---

## Funding

**Base Funding Request:** Open decision; current Concordia-derived amounts must not be copied without recalculation.

**Adoption-Linked Additional Funding:** Open decision.

**Total Funding Cap:** Open decision.

The funding request is intentionally left open because this proposal narrows the scope to an agentic Open Source Reference Wallet and its existing integration boundaries, while excluding the Concordia V2/CAP, governance, recurrence, custody, ledger, settlement, and deprecated Validator Wallet work. The committee should approve a recalculated budget against the milestones above before submission or acceptance. Any amount shown in a later revision must identify engineering, security/privacy review, documentation, and external adoption components separately.

### Payment Breakdown by Milestone

- Milestone 1 _(Discovery, Design, and Prototypes)_: Open funding decision
- Milestone 2 _(First Runtime Slices in Both V2 Proving Domains)_: Open funding decision
- Milestone 3 _(Runtime Reference Flows and Splice SV Governance Integration)_: Open funding decision
- Milestone 4 _(End-to-End Composition and Release Readiness)_: Open funding decision
- Milestone 5 _(External Adoption Validation)_: Open funding decision
- Milestone 6 _(Extended External Adoption)_: Open funding decision

### Timeline Accountability

Any delay treatment, acceptance evidence, and return of unearned funds should be agreed with the Foundation and Tech & Ops Committee when the dates and amounts are set. Committee-requested scope changes, Wallet Gateway or dApp SDK dependency changes, and upstream maintainer decisions should be handled through explicit milestone replanning rather than treated automatically as proposer delay.

### Volatility Stipulation

The proposal is denominated in CC only after the funding decision is approved. If delivery or adoption extends beyond the core implementation period, any treatment of material CC volatility must be prospective, transparent, approved through the applicable process, and must not create an automatic top-up or alter an earned milestone.

### Open Funding Decisions

- total funding and per-milestone CC amounts
- exact calendar dates
- acceptable security/privacy review evidence
- adoption qualification and payment caps
- maintenance expectations after release
- whether any companion repository is preferable to changes in the wallet repository

### Funding Locking

No funding-locking commitment is proposed in this draft. Any retention or post-grant funding condition is an open committee decision and must not be inferred from this proposal.

### Cross-Proposal Adoption Stacking

No cross-proposal adoption rule is proposed in this draft. If adoption-linked funding is retained, the Foundation should define non-stacking treatment with related wallet, dApp SDK, Wallet Gateway, and reference implementation proposals before approval.

---

## Co-Marketing

Subject to Foundation agreement, Unlockit will support:

- a coordinated announcement describing the agentic reference UX and its explicit human approval boundary
- an architecture article showing Open Source Reference Wallet, dApp SDK, Wallet Gateway, preparation, approval, and signing responsibilities
- a recorded technical walkthrough of discovery, guided action preparation, review, approval, rejection, and recovery
- a clone-and-run developer tutorial using `examples/portfolio/`
- publication of test evidence, limitations, and integration guidance for wallet providers and dApp developers

Commercial product marketing and customer-specific integrations remain outside grant scope.

---

## Motivation

The current Canton wallet repository already provides an open-source Open Source Reference Wallet, dApp SDK integration, Wallet Gateway, and approval/signing boundaries. Those building blocks are valuable, but users and dApp developers still need to understand which action is available, what information it requires, and what will happen before they reach the approval step.

An agentic UX can reduce this friction without changing the security model. It can make existing capabilities discoverable, guide users through supported journeys, and turn a natural-language request into a transparent draft for review. The reference implementation gives the ecosystem a concrete example of how to add this experience while keeping authorization and signing explicit and inspectable.

The common-good value is the boundary discipline: the agent is useful before approval and powerless to bind an action without the user and the existing wallet route.

---

## Rationale

**Why extend the existing Open Source Reference Wallet.** The Open Source Reference Wallet, dApp SDK, Wallet Gateway, approval routes, and tests are already the relevant integration surfaces. Extending them avoids a parallel wallet and makes the result directly useful to teams studying the current reference implementation.

**Why preparation rather than autonomy.** Users need assistance with complexity, but Canton actions remain authorization-sensitive. A reviewable draft provides convenience while preserving explicit human responsibility for binding execution.

**Why this is shared infrastructure.** Wallet providers and dApp teams can reuse the interaction patterns, action catalog, context boundaries, review components, and tests rather than independently designing an agent that may accidentally bypass the canonical wallet path.

**Why exclude new primitives.** Custody, ledger, settlement, token, governance, and signing primitives have independent ownership and security implications. They are not required to demonstrate the proposed UX and would make the proposal's public-good boundary less clear.

**Why adoption evidence.** Independent teams using or adapting the reference flows is stronger evidence of ecosystem value than model demos or stated interest. The exact adoption target and funding remain open until the implementation budget is recalculated.

---

## Maintenance

Unlockit will maintain the proposal's contributed reference implementation during the agreed grant period and will document ownership, issue handling, security disclosure, and release practices. Post-grant duration, staffing, response expectations, and funding remain open decisions. Maintenance will not imply a commitment to operate hosted agent services or to maintain customer-specific integrations.

---

## Governance and Open Decisions

The proposal champion remains **TBD**. Material scope, milestone, funding, licensing, model, privacy, or integration changes must follow the applicable Development Fund governance process. Technical decisions and interface evidence will be recorded publicly. Any upstream wallet repository contribution remains subject to its normal maintainer review.

Open decisions before submission:

- champion and responsible maintainers
- final repository location and contribution plan
- model/provider policy, if an LLM is used, and supported local/deterministic fallback
- security and privacy review scope
- total funding, CC amounts, percentages, dates, and adoption terms
- post-grant maintenance expectations
- exact current wallet paths and test commands to be cited in the final release record

---

## Related Projects and Standards

- [Current wallet repository](https://github.com/canton-network/wallet), especially `examples/portfolio/`, the dApp SDK, Wallet Gateway integration, approval/signing boundaries, and repository tests. This is implementation context for the Open Source Reference Wallet described in the [approved Open Source Reference Wallet proposal](https://github.com/canton-foundation/canton-dev-fund/blob/main/proposals/2026-03-DA-proposal-open-source-reference-wallet.md), not the scope or ownership boundary of this proposal.
- [CIP-0056 Token Standard](https://github.com/canton-foundation/cips/blob/main/cip-0056/cip-0056.md). The agent may explain supported asset actions exposed by the current wallet, but does not implement a token or settlement primitive.
- [CIP-0103 dApp Standard](https://github.com/canton-foundation/cips/blob/main/cip-0103/cip-0103.md). dApp interactions remain on the existing dApp SDK boundary and require explicit human approval before binding execution.
- [Splice](https://github.com/canton-network/splice) and its Wallet Gateway-related work. The proposal composes with current interfaces only and does not reimplement SV governance or deprecated Validator Wallet work.
- Existing reference wallet and Wallet Gateway Development Fund proposals. This proposal should be reviewed for overlap and should claim only the incremental agentic UX and its tests.

Where adjacent work changes an interface, implementation will validate the version actually used and update the compatibility record rather than assuming support.

---

## Risks

- **Autonomy confusion:** Users may mistake generated guidance for authorization. The UI must label drafts, require explicit approval, and test that the agent cannot cross the signing boundary.
- **Prompt or context injection:** Untrusted wallet or dApp content may influence explanations. Context must be minimized, treated as data, and tested against injection and malformed inputs.
- **Stale state:** A prepared action may no longer reflect current Open Source Reference Wallet state. The review route must revalidate or reject stale drafts before approval.
- **Unsupported actions:** Natural-language requests may exceed the wallet's supported action catalog. The agent must explain the limitation and fail closed.
- **Privacy:** Open Source Reference Wallet and party context may be sensitive. The implementation must follow existing visibility and consent boundaries and document any external model processing.
- **Gateway dependency:** Wallet Gateway or dApp SDK changes may affect the integration. Compatibility claims require versioned tests and explicit dependency tracking.
- **Scope expansion:** Autonomous execution, custody, governance, settlement, and new wallet primitives could turn this into a different project. They remain explicitly out of scope.
- **Adoption evidence:** Independent adoption is outside the proposer’s control. The Foundation should agree acceptable equivalent evidence before adoption-linked funding is included.
- **Maintenance:** Model providers, security expectations, and wallet interfaces may change. The release must document supported versions, fallback behavior, and ownership.
- **Funding and volatility:** Funding amounts, dates, and adoption terms remain open and require recalculation before approval.
