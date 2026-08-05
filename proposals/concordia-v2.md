## Development Fund Proposal

**Author:** Unlockit (luis.marado@unlockit.io)
**Status:** Draft
**Created:** 2026-08-05
**Label:** financial-workflows-composability
**Champion:** IntellectEU

> This initial proposal is provided for discussion. It does not create a funding commitment, contractual claim, delivery commitment, or Foundation obligation.

---

## Abstract

Concordia V2 extends [Concordia](https://github.com/unlockitio/concordia) and Canton Allocation Primitives (CAP) with reusable recurring allocation and payment workflows, and adds a common participant-facing application layer for composing ecosystem workflows. It will provide shared Daml primitives, reference policies, contract projections and view models, reusable frontend components, a generic independently runnable reference UI, and integration guidance for obligations or entitlements over time, including employment compensation, rent, subscriptions, revenue sharing, vesting, recurring obligations, and treasury distributions.

Concordia V2 is additive to Concordia V1 and CAP; it does not replace, reopen, or alter V1 governance or auction commitments.

The implementation separates authorization, domain policy, time-based allocation, and settlement. Existing Canton Token Standards remain responsible for asset representation and transfer. The Development Fund would support this common application layer and the underlying public, Apache-2.0 infrastructure as a grant-funded shared asset available to any Canton ecosystem team. Unlockit's product frontend, product-specific integrations, commercial user interfaces, customer work, hosting, sales, and go-to-market activity remain privately funded by Unlockit.

Funding amounts, milestone percentages, delivery dates, maintenance terms, and the adopter incentive mechanism remain subject to confirmation.

---

## Specification

### 1. Objective

Recurring financial workflows commonly bind authorization, business rules, time calculations, and asset movement into one application. That coupling makes components harder to reuse, review, test, and combine with other Canton projects.

Concordia and CAP already address reusable multi-party decision and allocation mechanics. Concordia V2 will apply that foundation to recurring allocations and payments so that an authorized agreement can establish an entitlement or obligation, calculate amounts over time, support policy-controlled amendment and termination, produce final allocations, and hand settlement instructions to existing Canton Token Standards.

The umbrella includes two distinct timing models: scheduled recurring payments create discrete obligations at agreed dates, while continuous accrual calculates an amount across an effective interval even when settlement occurs on a separate cadence. A domain policy selects and constrains the appropriate model.

The objective is an Apache-2.0 reference implementation that allows Canton developers to:

- initialize a recurring allocation or payment obligation from an authorized decision or agreement
- calculate amounts deterministically over an agreed schedule or interval
- amend, suspend, terminate, or finalize an active obligation under explicit domain policy
- produce route-specific final allocations when an obligation ends
- hand settlement instructions to existing Canton Token Standards
- reuse the same core across at least two materially different domains
- integrate through documented APIs, adapters, examples, automated tests, and a common participant-facing application layer

Success means that an independent ecosystem team can evaluate, run, and integrate the public artifacts without relying on an Unlockit product or hosted service.

#### Public-good scope funded by the Development Fund

- shared Apache-2.0 Daml primitives for recurring allocations, payment schedules, time-based calculations, and lifecycle transitions
- reusable agreement, amendment, suspension, termination, calculation, and final-allocation workflows
- domain-policy interfaces and bounded reference policies for multiple workflow families
- standards-aligned settlement adapters or integration examples using existing Canton Token Standards
- a common participant-facing application layer with reusable frontend components and a generic, independently runnable reference UI sufficient to inspect and exercise the public workflows through authorized routes
- developer documentation, architecture guidance, integration guides, examples, automated tests, and tooling
- interoperability work that benefits any Canton ecosystem team
- public development and public release from the start

#### Unlockit-funded exclusions

The grant does not fund:

- Unlockit-specific integrations
- an Unlockit commercial frontend or other product-specific user interface work
- Unlockit branding or product design
- customer-specific workflows or customization
- hosted operations, production support, or managed infrastructure
- sales, business development, customer acquisition, commercial packaging, or Unlockit go-to-market execution

Unlockit will fund these activities separately. No Unlockit product-specific integration or frontend work is included in the funding request.

### 2. Implementation Mechanics

The implementation composes five replaceable layers: canonical governance and authorization, CAP decision and domain workflows, recurring-allocation primitives, token-standard settlement, and a common participant-facing application layer.

#### Layer 1: Canonical governance and authorization

Existing governance infrastructure remains canonical wherever a workflow already uses it. Splice governance is existing infrastructure with authoritative contracts, identities, roles, signatures, and authorized submission routes; it is not a deployment or implementation of Concordia or CAP. Concordia and CAP may compose with that infrastructure by projecting state, discovering actions available to an authenticated role, and scaffolding submissions through canonical authorized routes. Concordia cannot vote, allocate, sign, or submit on behalf of an SV or the Development Fund Manager.

For workflows that do not already have canonical governance, Concordia supplies reusable authorization and decision mechanics. A decision records who may establish, amend, suspend, or end an agreement and which approvals are required. A domain may use bilateral agreement, role-based authorization, threshold governance, or another explicit mechanism.

#### Layer 2: CAP decision and domain workflows

A domain policy defines valid terms and lifecycle routes. It governs start and end conditions, schedules or rate changes, notice periods, suspension, unilateral rights, final adjustments, and the parties required to authorize each transition. Domain-specific legal and commercial rules remain outside generic time and allocation calculations.

#### Layer 3: Recurring allocation and payment primitives

The shared primitives represent an agreed rate or schedule, calculated quantity, claimed or settled quantity, effective periods, and lifecycle state. They will provide deterministic calculations, bounded rounding rules, idempotent transition handling, and explicit finalization without assuming a particular asset or settlement cadence.

#### Layer 4: Token-standard settlement

The core produces allocations or settlement instructions. Existing Canton Token Standards remain responsible for asset representation and transfer. The implementation will document supported interfaces, versions, and unresolved dependencies rather than introduce a parallel token or payment standard.

#### Layer 5: Common participant application layer

The shared application layer projects source contracts into participant-facing view models, renders role-aware workflow state and available actions, and scaffolds authorized submissions without granting authority. API adapters will use public or read APIs where suitable and will submit writes only through validated canonical authorized routes. Existing contracts, identities, roles, signatories, and signatures remain authoritative.

Privacy, signatories, observers, and authorization will be modeled explicitly in Daml. Automated tests will cover lifecycle transitions, time boundaries, amendment, suspension where applicable, termination, final allocation, and settlement handoff. Generic reference components will expose states and actions without Unlockit-specific user experience or integration assumptions.

#### Employment reference workflow

1. An employer and worker review an employment agreement and provide **bilateral unanimous approval**. This is an agreement workflow, not an election.
2. Approval initializes recurring salary terms under the agreement's effective date, rate or schedule, currency or asset reference, and domain policy.
3. Earned salary is recorded independently from settlement timing.
4. Prospective amendment requires the approvals specified by the agreement, including for salary or schedule changes.
5. The agreement may end through mutual termination or a policy-authorized unilateral route.
6. Every termination route stops future amounts at its effective time.
7. Finalization creates only the separate final allocations authorized for that route, potentially including earned salary, notice, accrued leave, bonus, and severance.
8. Existing Canton Token Standards handle settlement of those allocations.

The reference implementation demonstrates mechanics and configurable policy boundaries. It does not encode universal employment law, grant termination rights by itself, or replace jurisdiction-specific legal review.

#### Non-employment reference workflow: rental agreement

1. A landlord and tenant approve an agreement containing a start date, recurring rent terms, and any separately modeled deposit obligation.
2. Approval initializes the rent schedule or time-based rent terms, with settlement on the agreed cadence.
3. A jointly authorized amendment may change future terms without rewriting settled history.
4. A valid end-of-tenancy route stops future rent amounts at its effective time.
5. Finalization may create allocations for rent due and explicitly authorized adjustments. Disputes and deposit handling remain separate policy workflows unless an adopter implements them.
6. Existing Canton Token Standards handle settlement.

This workflow proves that the core is independent of employment policy. Revenue sharing will also be used as a design test, with the source and recognition of revenue supplied as domain inputs.

#### Operational approach

- development occurs publicly from the first milestone
- interfaces and material design decisions are documented in the public repository
- security assumptions and a threat model are reviewed before final release
- package versions, migrations, and support boundaries are documented
- verified interoperability is distinguished from proposed or unresolved alignment
- issue triage, contribution, disclosure, and release procedures are established before final acceptance

#### Governance Composition with Foundation and Splice

Concordia V2 explicitly builds on governance already used by the Canton Foundation Development Fund and Canton Foundation SV/Splice. Composition means reading or projecting authoritative lifecycle state, mapping it to role-aware view models, discovering actions exposed to the current authenticated role, preparing the required payload and signing context, and handing submission to a canonical authorized route. Action discovery communicates what an existing authority may do; it never creates, transfers, or expands that authority.

A conservative primary-source anchor is Splice `DsoRules`: its vote-request, vote-cast, and close lifecycle can be projected through public/read APIs where suitable. Development Fund integration will likewise project the allocation and coupon lifecycle and expose manager-authorized routes only to the Development Fund Manager's existing authorized context. Write compatibility will not be promised until the relevant interface, version, identity, signing, and submission route have been validated.

The minimal governance reference demonstration will read an existing SV/Splice vote lifecycle, render the request, casts, status, and close outcome, then scaffold one authorized action for the authenticated SV context. The demonstration stops before execution or delegates submission to the canonical route; Concordia does not execute as the governed actor. Employment and rental remain bilateral/domain workflows and do not require SV governance.

#### Common Participant Application Layer

The grant-funded shared application layer includes:

- shared contract projections and view models with provenance links to source Daml contracts and API versions
- role-aware workflow state and action discovery that reflects, but never grants, contract authority
- lifecycle rendering for proposal, vote, agreement, allocation, accrual, amendment, termination, and settlement states
- reusable accessible frontend components and API adapters
- a generic, independently runnable reference UI with no Unlockit product branding or dependency
- adapter documentation that distinguishes read/projection support from validated authorized write routes
- accessibility guidance and checks, developer documentation, examples, and automated component, adapter, and lifecycle tests

The same application layer is intended for governance, Development Fund, agreement, recurring-allocation, and settlement workflows so ecosystem teams do not need to rebuild common participant-facing mechanics. Unlockit's product frontend remains excluded from grant scope.

### 3. Architectural Alignment

Concordia V2 is application-layer public infrastructure built on Canton and Daml strengths in multi-party authorization, privacy-aware workflows, deterministic contract state, and auditable lifecycle transitions.

Separating authorization, domain policy, recurring allocation, and settlement keeps each concern replaceable. A bilateral employment agreement can use the same allocation mechanics as a governed treasury distribution while retaining different approval and termination rules. Existing Canton Token Standards remain the settlement boundary.

The project aligns with the Development Fund's support for reusable reference implementations and common-good developer infrastructure. Relevant CIPs and ecosystem projects will be reviewed during discovery, but compatibility will be claimed only for interfaces demonstrated by tests.

### 4. Backward Compatibility

No protocol-level backward compatibility impact is expected. Concordia V2 is a new application-layer library and set of reference workflows. Existing Canton applications and protocol behavior remain unchanged.

Package boundaries and migration paths from Concordia and CAP require confirmation. Integration compatibility with Canton Token Standards and related projects will be versioned, tested, and documented. No unresolved interface will be presented as supported.

---

## Milestones and Deliverables

Project start, delivery dates, funding amounts, and percentages remain **TBD** pending scope, governance, and funding confirmation.

### Milestone 1: Architecture, Governance Composition, and Executable Core

- **Estimated Delivery:** TBD
- **Funding:** TBD CC
- **Percentage:** TBD
- **Focus:** Establish the five-layer architecture, validate canonical governance composition boundaries, and deliver an executable recurring-allocation core.
- **Deliverables / Value Metrics:**
  - public architecture and threat-model documentation for canonical governance/authorization, CAP decision/domain workflows, recurring allocation, token-standard settlement, and the common application layer
  - initial Apache-2.0 Daml packages for agreement authorization and recurring allocation lifecycle
  - deterministic calculation, amendment, stop, and finalization behavior
  - documented settlement-interface assumptions for existing Canton Token Standards
  - test harness, local examples, and public repository workflow
  - interface review of the related projects and CIPs listed below
  - documented Splice `DsoRules` vote request/cast/close projections and Development Fund allocation/coupon lifecycle anchors, including read/write support boundaries
- **Acceptance Criteria:**
  - **M1-AC1 Core lifecycle:** A reviewer can run agreement approval, amount calculation, amendment, termination, final allocation, and settlement handoff using published instructions.
  - **M1-AC2 Lifecycle tests:** Automated tests pass for time boundaries, prospective amendment, mutual termination, authorized unilateral termination, and duplicate or invalid transition rejection.
  - **M1-AC3 Public-good boundary:** Package interfaces contain no Unlockit branding, customer data, hosted-service dependency, or product-specific code.
  - **M1-AC4 Interface evidence:** Supported settlement behavior is backed by tests; assumptions and unresolved interfaces are explicitly documented.
  - **M1-AC5 Governance boundary:** Tests and documentation show that projected state and discovered actions preserve existing identities, roles, signatures, and canonical submission routes; Concordia does not act for an SV or the Development Fund Manager.
  - **M1-AC6 License and access:** All grant-funded artifacts are publicly available under Apache-2.0 from the start.

### Milestone 2: Reference Workflows and Common Application Layer

- **Estimated Delivery:** TBD
- **Funding:** TBD CC
- **Percentage:** TBD
- **Focus:** Prove reuse across employment and non-employment domains and deliver the common participant-facing application layer.
- **Deliverables / Value Metrics:**
  - bilateral unanimous employment agreement approval and recurring salary initialization
  - amendment, mutual termination, and policy-authorized unilateral termination examples
  - route-specific final allocations for applicable earned salary, notice, leave, bonus, and severance
  - rental agreement and recurring rent reference workflow
  - shared projections, role-aware workflow state, action discovery, reusable frontend components, and API adapters for proposal, vote, agreement, allocation, accrual, amendment, termination, and settlement lifecycles
  - accessible, documented, tested, independently runnable generic reference UI for inspecting and scaffolding authorized actions
  - workflow documentation and automated tests
- **Acceptance Criteria:**
  - **M2-AC1 Employment approval:** The employment example requires bilateral unanimous approval when establishing the agreement.
  - **M2-AC2 Termination routes:** Every demonstrated route stops future amounts at its effective time and produces only allocations authorized for that route.
  - **M2-AC3 Domain separation:** The rental workflow imports the shared core without importing employment policy.
  - **M2-AC4 Common application layer:** The generic reference UI runs independently; reusable components and adapters preserve source-contract provenance, expose role-aware state, and contain no Unlockit product frontend work.
  - **M2-AC5 Governance demonstration:** The reference UI projects an existing Splice `DsoRules` vote request/cast/close lifecycle and scaffolds an authorized action without executing as an SV; tests confirm action discovery does not grant authority.
  - **M2-AC6 End-to-end evidence:** Automated tests and runnable documentation cover both workflows through the settlement boundary.

### Milestone 3: Generalization, Interoperability, and Adopter Readiness

- **Estimated Delivery:** TBD
- **Funding:** TBD CC
- **Percentage:** TBD
- **Focus:** Prepare extension points, interoperability evidence, and independent adoption.
- **Deliverables / Value Metrics:**
  - reusable policy extension points for subscriptions, revenue sharing, vesting, recurring obligations, and treasury distributions
  - at least one additional executable reference slice, preferably revenue sharing
  - hardened APIs, migration and versioning guidance, test utilities, and integration tooling
  - documented interoperability results against confirmed related-project interfaces
  - adopter guide, public technical walkthrough, and adopter-bounty process subject to approval
  - maintenance and contribution guidance
- **Acceptance Criteria:**
  - **M3-AC1 Extensibility:** An independent team can implement a new domain policy without modifying the shared core.
  - **M3-AC2 Additional domain:** The additional reference slice runs with automated tests and uses the same shared packages as Milestone 2.
  - **M3-AC3 Adoption evidence:** At least one third-party team completes a documented technical evaluation, reproducible prototype, or integration attempt, or provides equivalent evidence accepted by the Foundation.
  - **M3-AC4 Interoperability evidence:** Documentation separates verified behavior from proposed or unresolved alignment and identifies tested interface versions.
  - **M3-AC5 Adopter documentation:** Public documentation covers setup, extension, testing, settlement handoff, application-layer projections and adapters, accessibility, limitations, privacy, and security assumptions.
  - **M3-AC6 Scope separation:** Release artifacts remain free of Unlockit-specific integrations, branding, customer customization, hosted operations, sales, and go-to-market work.

---

## Acceptance Criteria

The Tech & Ops Committee will evaluate each milestone only against its identified deliverables and acceptance criteria. Evidence must be available in the public repository or linked from the milestone submission.

Project-wide acceptance requires:

- **P-AC1 Build:** A developer can clone, build, and run the documented examples using published instructions.
- **P-AC2 Tests:** The delivered Daml and integration test suites pass for supported workflows and interface versions.
- **P-AC3 Reuse:** Employment, rental, and the additional reference slice use the same recurring allocation and payment core.
- **P-AC4 Authorization:** Tests demonstrate required approval, invalid transition rejection, and each supported termination route.
- **P-AC5 Final allocations:** Tests demonstrate that route-specific finalization includes only policy-authorized allocation categories and stops future amounts at the effective time.
- **P-AC6 Settlement boundary:** Asset representation and transfer use documented Canton Token Standards interfaces rather than a new settlement layer.
- **P-AC7 Common application layer:** The independently runnable reference UI, reusable components, view models, and API adapters render the specified lifecycles accessibly, retain provenance to source contracts, and contain no Unlockit product branding or customer-specific behavior.
- **P-AC8 Governance composition:** A minimal demonstration projects the existing Splice `DsoRules` vote request/cast/close lifecycle and scaffolds an authenticated role's authorized action without voting, signing, allocating, or submitting on behalf of an SV or Development Fund Manager.
- **P-AC9 Authority preservation:** Action discovery never grants authority; write support is claimed only for validated canonical authorized routes, with underlying contracts, identities, roles, and signatures remaining authoritative.
- **P-AC10 Open source:** All grant-funded source and documentation are publicly released under Apache-2.0.
- **P-AC11 Documentation:** Architecture, setup, APIs, extension points, migrations, support boundaries, limitations, and security assumptions are documented.
- **P-AC12 Public-good boundary:** Grant reporting identifies public deliverables separately from Unlockit-funded product, customer, commercial, and operational work.

---

## Funding

**Total Funding Request:** TBD CC
**Milestone Percentages:** TBD

Each milestone is earned only after its deliverables, acceptance criteria, and required evidence are accepted through the applicable Development Fund process.

### Payment Breakdown by Milestone

- Milestone 1 _(Architecture, Governance Composition, and Executable Core)_: TBD CC upon committee acceptance
- Milestone 2 _(Reference Workflows and Common Application Layer)_: TBD CC upon committee acceptance
- Milestone 3 _(Generalization, Interoperability, and Adopter Readiness)_: TBD CC upon final release and committee acceptance

### Adopter Bounty

Unlockit proposes a transparent bounty for eligible third-party technical evaluation or integration. The bounty is paid by Unlockit only after the corresponding Development Fund milestone funds have been earned and received by Unlockit. Eligibility, evidence requirements, amounts or calculation rules, conflict disclosures, payment records, taxes, sanctions, procurement, and payment responsibility must be published before launch.

The mechanism remains subject to Foundation governance and legal confirmation. It does not redirect or split Foundation payments, promise payment, bind the Foundation, grant adopter rights, or create a contractual claim. If it is not approved, the parties must agree on a compliant alternative before any bounty is represented as active.

### Volatility Stipulation

Funding amounts and the delivery duration remain TBD. If delivery exceeds six months, the final proposal must define how material CC volatility affects unearned and undisbursed milestones. Any treatment must be prospective, transparent, and approved through the applicable governance and legal process. It may not retroactively change an earned milestone or imply an automatic Foundation top-up, discount, repricing, or obligation.

### Open Funding Decisions

- total funding request and CC amount per milestone
- milestone percentages and exact delivery dates
- evidence and approval requirements for each payout
- compliant adopter-bounty terms
- treatment of material CC volatility

---

## Co-Marketing

Subject to Foundation agreement, Unlockit will support:

- a coordinated public announcement
- an architecture article explaining the reusable layers and public-good boundary
- a recorded technical walkthrough covering employment and non-employment workflows
- an ecosystem demonstration or workshop for potential adopters
- publication of adoption evidence and interoperability findings

Public development begins with Milestone 1 rather than waiting for final release. Unlockit commercial marketing remains outside grant scope and is privately funded by Unlockit.

---

## Motivation

Canton provides privacy-aware multi-party authorization, deterministic contract state, and auditable lifecycle transitions, but ecosystem teams still need reusable application-layer mechanics for recurring allocations and payments. Payroll, rent, subscriptions, revenue sharing, vesting, and treasury distributions differ in policy but repeatedly need authorization, time or schedule calculations, amendment, termination, finalization, and settlement handoff.

Implementing those mechanics once as public infrastructure can reduce duplicate work and make boundaries clearer between governance, domain rules, and existing token and transfer standards. Using employment and rental as proving domains tests both sensitive bilateral workflows and materially different non-employment policy without turning either reference implementation into a complete vertical product.

The proposal also extends the reuse goals of Concordia and CAP. Concordia provides decision and authority mechanics; Concordia V2 turns authorized agreements and decisions into reusable recurring financial workflows while preserving domain-specific policy.

The quantitative estimate of ecosystem benefit is TBD pending adopter validation. Benefits will be measured through independent integrations, the number and variety of workflow families implemented, demonstrated adapter and component reuse, and verified interoperability against documented interface versions.

---

## Rationale

**Why five layers.** Canonical governance and authorization, CAP decision and domain workflows, recurring amount calculation, token-standard settlement, and the common application layer evolve for different reasons. Separate interfaces make each replaceable, testable, and reviewable without forcing adopters into one governance model, legal policy, asset, or frontend.

**Why employment and rental.** Employment requires explicit bilateral unanimous agreement, policy-controlled unilateral and mutual termination routes, and carefully separated final allocations. Rental proves that the shared core can support a non-employment workflow without importing employment assumptions.

**Why a common participant application layer.** Shared projections, role-aware state, action discovery, components, and adapters make lifecycle behavior inspectable and reusable across ecosystem workflows. The independently runnable reference UI demonstrates composition while keeping Unlockit's product frontend and customer work outside the grant. Interface actions reflect authority established by source contracts; they do not grant it.

**Why use existing settlement standards.** Concordia V2 determines obligations and allocations. Existing Canton Token Standards are the proper boundary for asset representation and transfer, avoiding a competing payment or token layer.

**Why adoption evidence.** Independent evaluation or integration is stronger evidence of reuse than stated interest. Because adopter availability is outside Unlockit's control, the Foundation must confirm acceptable equivalent evidence before final submission.

---

## Maintenance

Unlockit proposes to maintain the shared packages, tests, documentation, security reporting, and issue triage for a **TBD** period after final acceptance. Before final release, the proposal or milestone evidence will define:

- supported package and interface versions
- response expectations and security-disclosure routes
- release ownership and signing
- contribution and review procedures
- public backlog and deprecation policy
- succession or handoff if Unlockit can no longer maintain the project

Maintenance of Unlockit-specific integrations, commercial user interfaces, customer customizations, hosted operations, and managed services remains outside grant scope.

---

## Governance and Open Decisions

IntellectEU is the proposal champion. The proposal uses the `financial-workflows-composability` SIG label.

Material scope, milestone, funding, licensing, or adopter-bounty changes must follow the applicable Development Fund governance process. Technical design decisions will be recorded publicly. Maintainer authority, contribution review, release signing, dispute handling, and security disclosure procedures will be documented before final release.

Open decisions before submission:

- total funding, CC amounts, percentages, and exact dates
- Foundation milestone-evidence and payout-approval requirements
- adopter-bounty governance and legal confirmation
- interfaces with related token, governance, payroll, and settlement projects
- maintenance term and service expectations
- volatility treatment if the project runs beyond six months

---

## Related Projects and Standards

- [Concordia proposal, PR #184](https://github.com/canton-foundation/canton-dev-fund/pull/184) and [Concordia repository](https://github.com/unlockitio/concordia). Concordia V2 extends its reusable decision and allocation direction into recurring and time-based allocations. Package boundaries and migration paths require confirmation.
- [Decentralization Manager Phase 2, PR #530](https://github.com/canton-foundation/canton-dev-fund/pull/530) and [Decentralization Manager repository](https://github.com/DLC-link/decentralization-manager). Governed parties, membership, and reward routing may complement authorization or treasury workflows. Shared authority and reward interfaces remain unresolved.
- [Zebec payroll proposal, PR #416](https://github.com/canton-foundation/canton-dev-fund/pull/416) and [Zebec Canton payroll repository](https://github.com/Zebec-protocol/zebec-canton-payroll). Zebec addresses a payroll application and operating path, while Concordia V2 proposes reusable cross-domain primitives and policy separation. Overlap, reuse, and settlement interfaces require direct alignment.
- [OpenFluid](https://openfluid.xyz/). OpenFluid is relevant adjacent work in programmable financial flows. The precise technical relationship and reusable interfaces have not been confirmed and must be resolved during discovery.
- [CIP-0056](https://github.com/canton-foundation/cips/blob/main/cip-0056/cip-0056.md). Its requirements will be reviewed for standards alignment. Any claimed interface support must be demonstrated.
- [CIP-0112](https://github.com/canton-foundation/cips/blob/main/cip-0112/cip-0112.md). Its requirements will be reviewed for standards alignment. Any claimed interface support must be demonstrated.
- [Splice canonical repository and code](https://github.com/canton-network/splice) and [Splice application-development documentation](https://docs.sync.global/app_dev/overview/index.html). Relevant primary-source anchors include the `DsoRules` vote request/cast/close workflow, suitable public/read APIs, and the Development Fund allocation/coupon lifecycle and manager-authorized routes. Composition and write support remain subject to interface validation.
- [SV Governance dApp proposal #223](https://github.com/canton-foundation/canton-dev-fund/issues/223) and its milestone issues [#286](https://github.com/canton-foundation/canton-dev-fund/issues/286), [#287](https://github.com/canton-foundation/canton-dev-fund/issues/287), [#288](https://github.com/canton-foundation/canton-dev-fund/issues/288), and [#289](https://github.com/canton-foundation/canton-dev-fund/issues/289). Concordia V2 will seek reuse and avoid presenting its common application layer as replacement governance infrastructure.
- [CIP-0082](https://github.com/canton-foundation/cips/blob/main/cip-0082/cip-0082.md) and [CIP-0100](https://github.com/canton-foundation/cips/blob/main/cip-0100/cip-0100.md). These define Development Fund allocation and governance context.

These references are potentially complementary, not confirmed dependencies or endorsements. The project will avoid duplicate implementation where a stable reusable interface exists. Interface alignment remains unresolved until maintainer review and tests confirm it.

---

## Risks

- **Scope expansion:** Employment, rental, subscriptions, revenue sharing, vesting, and treasury policy can become separate products. The grant funds a shared core, bounded reference policies, and extension points rather than complete vertical applications.
- **Legal-policy confusion:** Employment and rental examples may be mistaken for legal templates. Documentation will identify configurable mechanics and require adopters to supply jurisdiction-specific policy and review.
- **Settlement assumptions:** Canton Token Standards and related interfaces may evolve. Adapters and compatibility claims need versioned tests and explicit support boundaries.
- **Overlap:** Concordia V2 may overlap with Zebec, OpenFluid, Decentralization Manager, or later ecosystem work. Maintainer review and interface discovery should precede irreversible design decisions.
- **Privacy and observability:** Parties may require different visibility into agreements, calculated values, and settlement. Disclosure models and operator roles require review for every reference workflow.
- **Time and rounding semantics:** Effective time, clock assumptions, precision, rounding, pauses, corrections, and schedules require deterministic definitions and tests.
- **Termination authority:** Authorized unilateral routes are domain-sensitive. The core executes supplied policy and does not invent legal rights.
- **Adoption evidence:** A third-party prototype is stronger than stated interest, but adopter availability is outside Unlockit's control. The Foundation must confirm acceptable equivalent evidence.
- **Adopter bounty:** Governance, legal, tax, sanctions, procurement, conflicts, and payment mechanics remain unresolved. No bounty will be advertised as active before approval.
- **Maintenance:** Duration, funding, response expectations, and succession remain TBD.
- **Funding and volatility:** CC amounts, percentages, dates, and treatment beyond six months remain open.
