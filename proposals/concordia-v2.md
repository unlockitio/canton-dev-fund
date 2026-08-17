## Development Fund Proposal

**Author:** Unlockit (luis.marado@unlockit.io)
**Status:** Draft
**Created:** 2026-08-05
**Label:** financial-workflows-composability, onchain-governance
**Champion:** TBD

---

## Abstract

Concordia V1 made multi-party decisions reusable. Concordia V2 makes the financial obligations produced by those decisions reusable over time.

Concordia V2 extends **Canton Allocation Primitives (CAP)**, the open-source reference implementation established by Concordia V1 for privacy-preserving multi-party allocation and decision workflows on Canton. CAP provides shared submission, resolution, outcome-execution, and expiry mechanics, with governance and auctions as its initial proving domains.

This proposal adds recurring allocations governed by scheduled or continuous rules. Authorized governance actions can initialize, amend, suspend, terminate, or finalize these allocations and produce subsequent or final outcomes through the existing CAP execution model.

The reference application is also extended with a reusable governance and workflow microfrontend that wallet providers, validator operators, and application developers can adopt, embed, and extend. Existing contracts, authorization rules, signing flows, and Canton asset infrastructure remain authoritative.

The proposal is additive. It does not replace, reopen, or alter the governance, auction, delivery, or adoption commitments established in Concordia V1.

---

## Specification

### 1. Objective

Extend the reusable CAP V1 reference implementation so developers can model, execute, and evaluate allocations governed by recurring rules without rebuilding the same authorization, time-calculation, lifecycle, and outcome structure from scratch.

V2 proposes applying Concordia/CAP primitives to the existing Splice governance process and incorporating `cap-dapp` into the Splice Validator Wallet, while preserving CAP's core concepts and canonical signing authority.

V2 should cover a narrow but meaningful class of recurring allocation rules:

- initialization from an authorized agreement or decision
- scheduled recurrence and continuous accrual
- deterministic calculation over an agreed schedule or effective interval
- governance actions that amend, suspend, terminate, or finalize an active recurring allocation
- production of subsequent or final allocations for settlement through existing Canton infrastructure

The intended outcome is that a Canton team can use the shared CAP foundation to build recurring allocation workflows for employment compensation, rent, subscriptions, revenue sharing, vesting, recurring obligations, and treasury distributions. Domain-specific governance determines which participants can act, which routes are available, and how each authorized action affects the recurring allocation and any resulting allocations.

V2 also extends the reference application layer with a reusable governance and workflow microfrontend that Canton ecosystem teams, including wallet providers, validator operators, and application developers, can adopt, embed, and extend.

This proposal extends CAP V1's shared submission, resolution, outcome execution, and expiry mechanics. It does not replace, reopen, or alter V1 governance, auction, delivery, or adoption commitments.

### 2. Implementation Mechanics

The project extends the CAP V1 implementation with recurring allocations and a reusable reference application.

The descriptions of `cap-core`, `cap-governance`, `cap-recurrence`, and `cap-dapp` below cover V2's active scope. `cap-auctions` remains a V1 reference module with no V2 implementation work planned.

The implementation preserves the modular structure established in V1:

- `cap-core` provides submission, resolution, outcome execution, and expiry mechanics
- `cap-governance` remains the V1 governance-oriented reference implementation, providing proposals, voting, approval rules, and authorized execution
- `cap-auctions` remains the V1 reference proving domain for auctions
- `cap-recurrence` adds allocations governed by recurring rules
- `cap-dapp` provides the open-source reference application for interacting with supported CAP workflows

The names `cap-recurrence` and `cap-dapp` describe proposed logical components. Their final implementation boundaries will be determined during technical design.

#### Core Layer: `cap-core`

The core captures the common structure of allocation workflows on Canton.

**Submission workflow**
Each participant submits through a privacy-preserving invite, submit, and close lifecycle. Submissions remain visible only to the submitter and the parties that need to see them. Workflows have deadlines, expired invitations can be reclaimed, and the model remains non-blocking if a participant goes offline.

**Resolution rules**
The core exposes pluggable resolution hooks that process collected submissions into an outcome. Domain modules implement their own rules, including auction winner selection, governance approval, and recurring allocation calculations.

**Outcome execution**
The workflow produces an executable outcome carrying the authority collected during the workflow. Where the required parties have authorized the resulting action, the outcome can be exercised atomically.

Outcome execution may initialize or modify governance state, produce subsequent or final allocations, invoke settlement through existing Canton infrastructure, or trigger another authorized downstream action.

**Expiry handling**
Deadlines, notice periods, and effective intervals are modeled explicitly. Expired participation paths can be released or reclaimed without changing completed outcomes.

#### Governance Module: `cap-governance`

The governance module remains the governance-oriented reference implementation built on `cap-core`, unless `cap-recurrence` integration identifies a need to extend an existing interface.

Authorized governance actions initialize, amend, suspend, resume, terminate, or finalize a recurring rule. Each action follows the approval rules defined by the applicable workflow and may produce subsequent or final allocations through `cap-core` outcome execution.

It covers:

- proposal creation
- ballot submission
- quorum and approval threshold checks
- weighted voting
- downstream execution after approval

Authorized governance actions on recurring allocations are exercised by `cap-governance` only through `cap-core` interfaces, without redefining existing approval, voting, or execution semantics.

The governance module does not create domain-specific rights. Employment, rental, subscription, or other policies determine who may act, which governance routes are available, and what outcome each route produces.

#### Recurrence Module: `cap-recurrence`

`cap-recurrence` represents CAP allocations governed by recurring rules.

It supports:

- scheduled recurrence and continuous accrual
- agreed rates or schedules
- effective start and end times
- deterministic calculation and rounding
- amendment, suspension, and resumption
- termination and finalization
- subsequent and final allocations

A recurring rule determines how an allocation evolves over time. Governance determines which participants may modify that rule and what outcomes each authorized action produces. Each authorized action follows the approval rules defined by the applicable workflow and produces subsequent or final allocations through `cap-core` outcome execution.

Recurrence does not create domain-specific rights. Employment, rental, subscription, or other policies determine who may act, which governance routes are available, and what outcome each route produces.

Calculated and settled amounts are recorded independently so settlement timing does not change what has already accrued. The module does not introduce a separate token, transfer, or settlement standard.

#### Reference Application: Concordia Dapp (`cap-dapp`)

The Concordia Dapp (`cap-dapp`) is the open-source reference application for interacting with supported CAP workflows.

It provides one reusable governance and workflow microfrontend that wallet providers, validator operators, and application developers can adopt, embed, and extend.

The application:

- presents supported governance and allocation workflows
- shows current state and relevant history
- allows participants to prepare actions available to them
- hands approved actions to the applicable authorization and signing route
- supports `cap-governance`, `cap-recurrence`, and future compatible CAP modules

`cap-dapp` supports two main modes of presentation and interaction:

- **Traditional interaction:** participants inspect governance and allocation activity, receive relevant updates, and initiate or respond to actions through the user interface. The application supports both pull-based access, where participants review current activity, and push-based notifications for proposals, deadlines, state changes, and actions requiring attention.
- **Optional LLM-guided interaction:** participants may choose to enable an LLM-assisted presentation and interaction mode in the Concordia Dapp. When enabled, each participating entity may connect its own LLM and configure its own policies, privacy controls, and operational boundaries. The assistant can summarize activity, explain proposals, compare changes, identify pending actions, and prepare non-binding actions for participant review. This is an optional presentation and interaction mode within the Concordia Dapp; it is not a separately funded workstream and does not alter the canonical authorization or signing boundary.

Both modes use the same CAP workflows and authorization boundaries. Optional LLM-guided interaction does not vote, sign, submit, allocate, or execute on behalf of a participant. Binding actions remain subject to explicit approval and the canonical authorization and signing route.

Contracts, participant authority, approval rules, and signing mechanisms remain authoritative. `cap-dapp` does not grant authority or execute actions on behalf of a participant.

Integration with existing Splice and wallet governance work will be coordinated with the responsible maintainers. The implementation will extend or reuse existing components where agreed rather than assume ownership of those systems.

#### Illustrative Execution Flows

**Conceptual sequence: CAP V2 allocation lifecycle**

The allocation lifecycle is illustrated in BPMN at [`assets/01-concordia-recurrent-allocation-and-governance.bpmn`](assets/01-concordia-recurrent-allocation-and-governance.bpmn). It is illustrative and does not claim implementation, payment execution, or signing authority. Side controls (amend, suspend, resume, terminate) are part of the authorized governance surface described in `cap-recurrence`.

**Employment**

1. An employer and worker provide bilateral unanimous approval of an employment agreement.
2. Approval initializes a recurring salary allocation with its rate or schedule, effective date, asset reference, and applicable policy.
3. Salary accrues according to the agreed recurring rule.
4. Authorized governance actions may amend or suspend future accrual.
5. The agreement may end by mutual approval or through a policy-authorized unilateral route.
6. The selected route stops future accrual and may produce final allocations for earned salary, notice, leave, bonus, or severance.
7. Outcome execution invokes settlement through existing Canton infrastructure.

The reference workflow demonstrates configurable mechanics. It does not encode universal employment law or create termination rights independently of the agreement and applicable policy.

**Rental**

1. A landlord and tenant approve an agreement containing its start date and recurring rent terms.
2. Approval initializes the recurring rent allocation.
3. Authorized amendments may change future terms without rewriting settled history.
4. A valid end-of-tenancy route stops future rent accrual.
5. Finalization may produce allocations for outstanding rent and explicitly authorized adjustments.
6. Outcome execution invokes settlement through existing Canton infrastructure.

Deposit handling and disputes remain separate policy workflows unless explicitly implemented by an adopter.

#### Proposed Splice Work

Concordia V2 intends to improve and extend the existing Splice SV governance process and Splice Validator Wallet by leveraging CAP governance and allocation primitives and integrating `cap-dapp` into the Validator Wallet. The work first confirms the existing SV governance procedures for proposal initiation and preparation, proposal review, voting, lifecycle, status and attribution, and allocation-governance lifecycle. Any external upstream work and the exact procedure implementation remain contingent on Splice maintainer review, FCS and Avro coordination, and applicable governance agreement; this proposal does not assert a partnership, approval, or completed implementation.

**FCS coordination and dependency.** Other teams, including Avro and the FCS Splice SV UI/UX improvements grant, are already delivering relevant Splice governance UI/UX work. Concordia V2 will support, build on, and carry forward compatible outcomes, and will involve those teams in its proposed work to avoid duplication or ownership claims. Concordia does not duplicate FCS or Avro-owned work. This does not imply that any of that work is complete, or that maintainers or those teams have agreed to integrations.

**Governance package migration.** If adoption of a new SV governance package is required as part of this proposed Splice work, a migration path will be provided as needed for SV operators and integrators. This remains contingent on Splice maintainer review and applicable governance agreement, and does not assert approval or completion.

### 3. Architectural Alignment

Concordia V2 is application-layer public infrastructure built on Canton and Daml strengths in multi-party authorization, privacy-aware workflows, deterministic contract state, and auditable lifecycle transitions.

Separating authorization, domain policy, recurring allocation, and settlement keeps each concern replaceable. A bilateral employment agreement can use the same allocation mechanics as a governed treasury distribution while retaining different approval and termination rules. Existing Canton Token Standards remain the settlement boundary.

Concordia V2 defines strict, reusable primitives and documented interfaces while leaving concrete implementation choices to implementors. This common-good approach provides shared, interoperable building blocks without prescribing application-specific workflow implementations; employment and rental remain reference use cases, `cap-core` and `cap-dapp` retain their stated scopes, and proposed Splice work remains contingent on its stated coordination and governance processes.

The project aligns with the Development Fund's support for reusable reference implementations and common-good developer infrastructure. Relevant CIPs and ecosystem projects will be reviewed during discovery, but compatibility will be claimed only for interfaces demonstrated by tests.

#### Architectural Views

These diagrams show Concordia V2 at ecosystem and container levels. The catalogs record detailed responsibilities and authority boundaries.

##### System Context

The System Context shows Concordia V2 in its surrounding ecosystem. Readers see end users, external systems, CAP / Concordia V1 and V2, the LLM, and the relationships among them.

```plantuml
@startuml
!include <C4/C4_Context>

title CAP / Concordia V2 - Proposed System Context

LAYOUT_TOP_DOWN()
skinparam ranksep 180
skinparam nodesep 20

Person(endUsers, "End Users", "Consume governance and allocation workflows")

System_Ext(walletApps, "Wallet Provider Apps", "Provide participant applications that embed or integrate CAP capabilities")
System_Ext(otherThirdPartyProjects, "Other Third-Party Projects", "Provide ecosystem applications that reuse governance, auction, or recurrence capabilities")
System_Ext(devFundGrants, "Canton Dev Fund Grants", "Provide funded ecosystem applications including Avro, DecMan, SyncVotes, and Zebec")
System_Ext(splice, "Splice", "Provides SV governance and Validator Wallet capabilities; proposed V2 work is contingent")

System_Ext(entityLlm, "LLM", "Provides contextual guidance and draft action text from permitted CAP workflow context")
System(cap, "CAP / Concordia V2", "Provides reusable governance, allocation, recurrence, outcome execution, and participant application capabilities")
System(v1, "CAP / Concordia V1", "Provides established CAP primitives reused by V2")

' Layout-only edges establish the external peer row and the LLM/V2/V1 order.
walletApps -[hidden]right- otherThirdPartyProjects
otherThirdPartyProjects -[hidden]right- devFundGrants
devFundGrants -[hidden]right- splice
entityLlm -[hidden]right- cap
cap -[hidden]right- v1

Rel_D(endUsers, walletApps, "Uses")
Rel_D(endUsers, otherThirdPartyProjects, "Uses")
Rel_D(endUsers, devFundGrants, "Uses")
Rel_D(walletApps, cap, "Embeds")
Rel_D(otherThirdPartyProjects, cap, "Leverages")
Rel_D(devFundGrants, cap, "CAP Reuse Opportunity")
Rel_R(cap, v1, "Extends")
Rel_U(cap, splice, "Leverages Code")
Rel_D(splice, cap, "Leverages Primitives")
Rel_L(cap, entityLlm, "Leverages LLM Guidance")

SHOW_LEGEND()
@enduml
```

This context view distinguishes CAP's present reuse of external Splice code from the proposed V2 work in Splice's governance process and wallet app that may reuse CAP primitives. The catalog records the authority and maintainer-agreement limits on that contingent work alongside each system's role.

###### System Context Box Catalog

This catalog identifies the systems and records their roles, relationships to Concordia V2, and relevant authority boundaries.

| Box | Role | Relationship to Concordia V2 | Status or authority boundary |
| --- | --- | --- | --- |
| End Users | Consume governance and allocation workflows | Use wallet provider apps, third-party projects, and Canton Dev Fund Grants | No direct relationship to CAP V1 or V2 |
| Wallet Provider Apps | Provide participant applications that embed or integrate CAP capabilities | Embed CAP | Potential adopters or integrators |
| Other Third-Party Projects | Provide ecosystem applications that reuse governance, auction, or recurrence capabilities | Leverage CAP | Potential adopters or integrators; unconfirmed |
| Canton Dev Fund Grants | Provide funded ecosystem applications including Avro, DecMan, SyncVotes, and Zebec; the in-flight FCS Splice SV UI/UX improvements grant is coordinated with, not duplicated by, Concordia V2 (see Related Projects and Standards) | CAP reuse opportunity | Proposed reuse opportunity; no confirmed adoption or partnership |
| Splice | Provides SV governance and Validator Wallet capabilities | CAP leverages Splice code; Concordia V2 proposes to extend/iterate the Splice governance process and Splice Validator Wallet to leverage CAP primitives and incorporate `cap-dapp` | Proposed upstream changes remain contingent on Splice maintainer review and applicable governance agreement; external contracts, authority, and signing remain canonical |
| CAP / Concordia V2 | Provides reusable governance, allocation, recurrence, outcome execution, and participant application capabilities | Extends V1 and provides primitives that contingent Splice work may leverage | Proposed additive system; no Splice implementation commitment is implied |
| CAP / Concordia V1 | Provides established CAP primitives reused by V2 | Foundation extended by V2 | Existing CAP foundation, not a third party |
| LLM | Provides contextual guidance and draft action text from permitted CAP workflow context | CAP leverages LLM guidance through `cap-dapp` | No autonomous or binding actions; `cap-core` supports execution, and participant approval and signing are required |

##### Container Diagram

The Container Diagram shows the deployable and logical CAP containers within Concordia V2 and its external peer integrations. It focuses on each container's responsibilities and the integration relationships between them.

```plantuml
@startuml
!include <C4/C4_Container>

title CAP / Concordia V2 - Proposed Container View

LAYOUT_TOP_DOWN()
skinparam ranksep 90
skinparam nodesep 60

System_Boundary(capBoundary, "CAP / Concordia") {
    together {
        Container(capDapp, "cap-dapp [V2]", "Reusable web microfrontend", "Provides participant interaction with supported CAP workflows.")
        Container(capCore, "cap-core [V1]", "Daml", "Provides governance and allocation primitives.")
    }
    Container(capGovernance, "cap-governance [V1]", "Daml", "Provides proposals, voting, approval rules, and authorized lifecycle actions.")
    Container(capAuctions, "cap-auctions [V1]", "Daml", "Provides auction workflows.")
    Container(capRecurrence, "cap-recurrence [V2]", "Daml", "Provides scheduled recurrence, continuous accrual, and recurring-allocation lifecycles.")

    ' Layout-only edge keeps the V2 primary surface left of the V1 primary surface.
    capDapp -[hidden]right- capCore

    Rel_R(capDapp, capCore, "Composes")
    Rel_U(capGovernance, capCore, "Implements")
    Rel_U(capAuctions, capCore, "Implements")
    Rel_U(capRecurrence, capCore, "Implements")
}

System_Boundary(externalBoundary, "External Peer Systems and Integrations") {
    together {
        System_Ext(walletApps, "Wallet Provider Apps", "Provide participant applications that embed cap-dapp.")
        System_Ext(thirdPartyProjects, "Third-Party Projects", "Provide ecosystem applications that leverage cap-core or embed cap-dapp.")
        System_Ext(splice, "Splice", "Provides SV governance and Validator Wallet capabilities; proposed V2 work is contingent.")
    }
}

System_Ext(entityLlm, "LLM", "Provides contextual guidance and draft action text to cap-dapp from permitted smart-contract and workflow context.")

' Layout-only ordering keeps external peers above CAP and the LLM left of cap-dapp.
walletApps -[hidden]right- thirdPartyProjects
thirdPartyProjects -[hidden]right- splice
walletApps -[hidden]down- entityLlm
entityLlm -[hidden]right- capDapp

Rel_D(walletApps, capDapp, "Embeds")
Rel_D(thirdPartyProjects, capCore, "Leverages")
Rel_D(thirdPartyProjects, capDapp, "Embeds")
Rel_U(capCore, splice, "Leverages Code")
Rel_D(splice, capCore, "Leverages Primitives")
Rel_L(capDapp, entityLlm, "Leverages LLM Guidance")

SHOW_LEGEND()
@enduml
```

The container view locates reusable governance and allocation primitives in `cap-core`, while `cap-dapp` remains the participant-facing integration surface. It separates CAP's use of Splice code from the contingent governance-process and wallet-app implementation work that may reuse those primitives, subject to maintainer and governance agreement.

###### Container Responsibility Catalog

This catalog records the containers, their responsibilities, and their integration boundaries.

| Box | Responsibility | Dependencies or outputs | Explicit boundary |
| --- | --- | --- | --- |
| External Peer Systems and Integrations | Groups external systems that provide capabilities to CAP or consume CAP capabilities | Contains Splice, wallet provider apps, and third-party projects | Grouping boundary, not a runtime system or authority |
| Splice | Provides SV governance and Validator Wallet capabilities | `cap-core` leverages Splice code; Concordia V2 proposes to extend/iterate the Splice governance process and Splice Validator Wallet to leverage CAP primitives and incorporate `cap-dapp` | Proposed upstream changes remain contingent on Splice maintainer review and applicable governance agreement; no approval, partnership, or completed implementation is claimed |
| Wallet Provider Apps | Provide participant applications | Embed `cap-dapp` | External application; exactly one CAP relationship, to `cap-dapp` |
| Third-Party Projects | Provide ecosystem applications that reuse CAP capabilities; examples include Avro SV Governance dApp, Decentralization Manager, SyncVotes, and Zebec Streaming Payroll and Programmable Payments | Leverage `cap-core` and embed `cap-dapp` | Exactly two CAP relationships; identified projects are potential or unconfirmed candidates, not confirmed integrations or partners |
| CAP / Concordia | Provides reusable governance, allocation, recurrence, auction, and participant application capabilities | Contains the V1 foundation and V2 additions | Domain policies define rights and governance routes |
| Primary Integration Surfaces (`cap-core`, `cap-dapp`) | Provide CAP's direct integration surfaces | `cap-dapp` composes with `cap-core`; external adopters integrate through these two containers | Primary integration surface pairing |
| `cap-core` | Provides governance and allocation primitives | Supports shared submission, resolution, expiry, authorized outcome execution, and settlement handoff for CAP modules and adopters; leverages Splice code where applicable | Settlement and outcome execution remain in `cap-core`; Daml models privacy, signatories, observers, and authorization explicitly |
| `cap-governance` | Provides proposals, voting, approval rules, and authorized lifecycle actions | Implements `cap-core` workflow and outcome interfaces | Existing V1 Daml domain module; external governance contracts and signing remain authoritative |
| `cap-auctions` | Provides auction workflows | Implements `cap-core` workflow and outcome interfaces | Existing V1 Daml domain module |
| `cap-recurrence` | Provides scheduled recurrence, continuous accrual, and recurring-allocation lifecycles | Implements `cap-core` interfaces; authorized governance actions can initialize, amend, suspend, terminate, or finalize recurring allocations using `cap-core` outcome mechanics | V2 Daml domain module; domain policies define rights and routes |
| `cap-dapp` | Provides participant interaction with supported CAP workflows | Composes with `cap-core` and presents approved actions to canonical authorization and signing routes; may support contingent Splice wallet-app work | V2 application/microfrontend; only embeddable CAP container; no direct presentation edge to individual reference modules |
| LLM | Provides contextual guidance and draft action text to `cap-dapp` from permitted smart-contract and workflow context | `cap-dapp` leverages LLM guidance; generated text returns within that interaction | No autonomous or binding actions; `cap-core` supports execution, and participant approval and signing are required |


### 4. Backward Compatibility

Concordia V2 will strive to maintain backward compatibility with V1. Because V2 extends V1, any unavoidable impact or change will include a clear migration path.

No protocol-level backward compatibility impact is expected. Concordia V2 is a new application-layer library and set of reference workflows. Existing Canton applications and protocol behavior remain unchanged.

Package boundaries and migration paths from Concordia and CAP require confirmation. Integration compatibility with Canton Token Standards and related projects will be versioned, tested, and documented. No unresolved interface will be presented as supported.

---

## Milestones and Deliverables

Each one-month milestone advances the recurrence, governance, Concordia Dapp, and proposed Splice tracks together as dependencies allow. Exact calendar dates will be set or updated upon approval. Review and payment are based on achieved evidence and remain subject to applicable governance and funding approval.

### Milestone 1: Discovery, Design, and Prototypes

- **Estimated Delivery:** Month 1
- **Focus:** Establish first-release discovery, design, and usable prototypes for recurrence, governance, the Concordia Dapp, and proposed Splice integration.
- **Deliverables / Value Metrics:**
  - **Design**
    - Iterate a recurrence-first `cap-core` design document with concrete first-release scope and explicit in-scope and out-of-scope boundaries.
    - Define strict interfaces and extension points that `cap-recurrence`, `cap-governance`, and, where relevant, `cap-auctions` implement without expanding the shared core unnecessarily.
    - Analyze compatibility and migration implications for the first release, including a migration approach for supported consumers.
    - Assess material impact on existing governance and auction interfaces only where identified; `cap-auctions` remains reference-only unless that analysis identifies material shared-`cap-core` impact.
  - **Concordia as Daml**
    - Deliver a first usable `cap-recurrence` prototype over `cap-core`.
    - Define and exercise the core interface contracts that `cap-recurrence` implements, with local examples and a test harness.
    - Establish the public repository workflow for the prototype without claiming a governance reference-interface implementation at this stage.
  - **Concordia as Dapp**
    - First usable Concordia Dapp (`cap-dapp`) mockup or prototype for governance and allocation interactions, including advisory participant flows and explicit human approval/signing boundaries.
    - Governance interaction prototype showing advisory participant views and preparation of a supported action.
    - Allocation interaction prototype showing advisory participant views and preparation of a supported allocation action.
    - Explicit handoff from prepared actions to the applicable human approval and signing route.
  - **Splice-related work**
    - Splice SV governance and Validator Wallet integration discovery and architecture approach, including FCS and Avro coordination, procedure confirmation, and documented read/write, authorization, and upstream-dependency boundaries.
    - Procedure and integration inventory for the confirmed or proposed SV governance and Validator Wallet touchpoints.
    - Coordination record identifying FCS and Avro ownership boundaries and work that Concordia does not duplicate.
    - Read/write, authorization, signing, and upstream-dependency evidence for each evaluated integration path.

### Milestone 2: First Runtime Slices in Both V2 Proving Domains

- **Estimated Delivery:** Month 2
- **Focus:** Validate `cap-core` early in governance and allocation, including recurrent allocation.
- **Deliverables / Value Metrics:**
  - **Concordia as Daml**
    - Demonstrate governance reference runtime behavior through `cap-core` interfaces implemented by the V1 `cap-governance`, applied to allocation and recurrent-allocation runtime slices where relevant.
    - Deliver allocation and recurrent-allocation reference runtime slices built on `cap-core` interfaces implemented by `cap-recurrence` where relevant.
    - Demonstrate the explicit authorization and signing boundary for both runtime slices.
    - Provide Daml script and sandbox integration tests for both slices.
  - **Concordia as Dapp**
    - Initial Concordia Dapp (`cap-dapp`) governance and allocation flow iteration.
    - Governance flow rendering the core reference slice and its available action preparation.
    - Allocation and recurrent-allocation flow rendering the core reference slice and its available action preparation.
    - Explicit approval and signing handoff for both prepared flows.
    - Dapp flow test evidence aligned with the Daml script and sandbox slices.
  - **Splice-related work**
    - Refine the confirmed Splice SV governance and Validator Wallet integration inventory against the M2 runtime slices.
    - Maintain documented FCS and Avro ownership, authorization, signing, and upstream-dependency boundaries for evaluated integration paths.

### Milestone 3: Runtime Reference Flows and Splice SV Governance Integration

- **Estimated Delivery:** Month 3
- **Focus:** Extend runtime governance and allocation reference flows and integrate confirmed Splice SV governance procedures where approved or available.
- **Deliverables / Value Metrics:**
  - **Concordia as Daml**
    - Complete and integrate governance and allocation-governance lifecycle reference flows built on `cap-core` interfaces implemented by `cap-governance` and `cap-recurrence` where relevant.
    - Complete the allocation-governance lifecycle integration slice built on `cap-core`.
    - Confirm and integrate approved or available Splice SV governance procedures for proposal initiation and preparation, review, voting, lifecycle, status, and attribution.
    - Provide Daml script and sandbox integration tests and integration evidence for supported reference and Splice slices.
    - Deliver an SV governance package migration path where a new package is required.
  - **Concordia as Dapp**
    - First approved or available Validator Wallet embedding slice for Concordia Dapp (`cap-dapp`) where viable.
    - `cap-dapp` SV procedure views for the confirmed governance integration slices.
    - Validator Wallet embedding integration evidence where approved and available.
    - Standalone `cap-dapp` fallback verification where embedding is not available.
    - Integration tests and migration evidence for the supported Dapp and SV governance paths.
  - **Splice-related work**
    - Confirmed Splice SV governance integration slices for the supported proposal procedures, with test evidence.
    - Document the FCS and Avro coordination boundary without duplicating their work.
    - Coordinate the SV governance package migration path where a new package is required.

### Milestone 4: End-to-End Composition and Release Readiness

- **Estimated Delivery:** Month 4
- **Focus:** Deliver release-ready end-to-end governance, allocation, and recurrent-allocation flows.
- **Deliverables / Value Metrics:**
  - **Concordia as Daml**
    - Provide tested end-to-end governance, allocation, and recurrent-allocation flows built on `cap-core` interfaces implemented by `cap-governance` and `cap-recurrence` where relevant.
    - Demonstrate participant approval and signing handoff for supported flows.
    - Produce hardening integration evidence, including recovery, observability, migration, and rollback procedures for supported flows.
    - Deliver release-ready Daml integration documentation and Daml script and sandbox test evidence for end-to-end flows.
  - **Concordia as Dapp**
    - Concordia Dapp (`cap-dapp`) and Validator Wallet integration completed where upstream is available; standalone `cap-dapp` fallback otherwise.
    - End-to-end governance, allocation, and recurrent-allocation flow presentation and action preparation.
    - Explicit participant approval and signing handoff evidence for each supported end-to-end flow.
    - Validator Wallet embedding release evidence where upstream is available, or standalone `cap-dapp` fallback release evidence otherwise.
    - Supported-flow integration, migration, and rollback test evidence.
  - **Splice-related work**
    - Complete release-readiness integration evidence for confirmed Splice SV governance procedures and Validator Wallet touchpoints where upstream is available.
    - Document recovery, observability, migration, and rollback evidence for supported Splice integration paths.
    - Preserve the standalone `cap-dapp` fallback evidence where embedding is unavailable.

### Milestone 5: External Adoption Validation

- **Estimated Delivery:** Up to 12 months after Milestone 4 acceptance
- **Focus:** Validate external adoption through at least 2 qualified independent external teams using CAP-v2 in pilot or production applications.
- **Deliverables / Value Metrics:**
  - at least 2 qualified independent external teams adopting either the Concordia Dapp (`cap-dapp`) or the new `cap-core` recurrence-related primitives and reference use case connected to governance primitives from deliverables completed through Milestone 4 in a pilot or production application
  - qualified adoption of the Concordia Dapp (`cap-dapp`) earns 50,000 CC per qualified team
  - qualified adoption of the new `cap-core` recurrence-related primitives and reference use case connected to governance primitives earns 35,000 CC per qualified team
  - each qualified team receives one mutually exclusive, non-stacking adoption payment: 50,000 CC for `cap-dapp` or 35,000 CC for the `cap-core` recurrence-related primitives and reference use case; payments are per qualified team and do not stack
  - M5 funding is capped at 100,000 CC: 100,000 CC for two `cap-dapp` adopters, 85,000 CC for one adopter of each track, or 70,000 CC for two adopters of the `cap-core` recurrence-related primitives and reference use case
  - confirmation from each adopting team to the Tech & Ops Committee
  - documentation showing substantive reuse, adaptation, or extension of the adopted Concordia deliverables where applicable
  - letters of intent may support evaluation but do not satisfy this milestone
  - validation is based on documented evidence of use, traceability to the adopted deliverables, and adopter confirmation; strict binary package traceability is not required

### Milestone 6: Extended External Adoption

- **Estimated Delivery:** Up to 24 months after Milestone 4 acceptance
- **Focus:** Reward additional external adoption beyond Milestone 5.
- **Deliverables / Value Metrics:**
  - up to 10 additional qualified independent external teams beyond Milestone 5 adopting `cap-dapp` or `cap-core`/Concordia primitives from deliverables completed through Milestone 4 in a pilot or production application
  - qualified adoption of the embedded Concordia microfrontend/Concordia Dapp (`cap-dapp`) in a pilot application earns 20,000 CC per qualifying external team
  - qualified adoption of the embedded Concordia microfrontend/Concordia Dapp (`cap-dapp`) in a production application earns 40,000 CC per qualifying external team
  - for the `cap-dapp` track, a qualifying external team is eligible for one adoption payment: either pilot (20,000 CC) or production (40,000 CC); the same team cannot stack pilot and production `cap-dapp` payments within Milestone 6, and the same-team cap across the `cap-dapp` pilot and production payments combined during Milestone 6 is 40,000 CC
  - qualified adoption of `cap-core`/Concordia primitives only in a pilot application earns 15,000 CC per qualifying external team
  - qualified adoption of `cap-core`/Concordia primitives only in a production application earns 30,000 CC per qualifying external team
  - for the `cap-core`/Concordia-primitives-only track, a qualifying external team is eligible for one adoption payment: either pilot (15,000 CC) or production (30,000 CC); the same team cannot stack pilot and production `cap-core`/Concordia-primitives-only payments within Milestone 6, and the same-team cap across the `cap-core`/Concordia-primitives-only pilot and production payments combined during Milestone 6 is 30,000 CC
  - the four adoption tracks (`cap-dapp` pilot, `cap-dapp` production, `cap-core`/Concordia-primitives-only pilot, `cap-core`/Concordia-primitives-only production) are mutually exclusive per team: a qualifying external team earns adoption payment under at most one of the four tracks in Milestone 6
  - portfolio breadth premium of 50,000 CC if at least 5 additional qualified external teams are accepted by the end of the milestone period
  - additional portfolio breadth premium of 50,000 CC if 10 additional qualified external teams are accepted by the end of the milestone period
  - the breadth premiums are separate, non-duplicative portfolio incentives: each is paid once for the accepted M6 cohort, is not a per-adopter award, and does not replace any mutually exclusive individual adoption track; acceptance of 10 additional teams earns both breadth premiums, for 100,000 CC in total breadth premiums
  - total Milestone 6 funding is capped at 500,000 CC, inclusive of the portfolio breadth premiums (i.e., the 100,000 CC of breadth premiums at 10 accepted teams counts toward the 500,000 CC cap, not in addition to it)
  - each accepted additional team must provide confirmation to the Tech & Ops Committee and substantive documentation of reuse, adaptation, or extension of the adopted Concordia deliverables where applicable
  - letters of intent may support evaluation but do not satisfy this milestone
  - validation is based on documented evidence of use, traceability to the adopted deliverables, and adopter confirmation; strict binary package traceability is not required


---

## Acceptance Criteria

The Tech & Ops Committee will evaluate completion based on:

- Deliverables completed as specified for each milestone
- Demonstrated functionality or operational readiness
- Documentation and knowledge transfer provided
- Alignment with stated value metrics

Project validation:

- **Working implementation.** A working `cap-core` provides the relevant recurrence, governance, allocation, executable-outcome, and expiry primitives.
- **Reference modules.** Working `cap-governance`, `cap-auctions`, and `cap-recurrence` are built on the shared `cap-core` interfaces; V2 changes preserve the existing reference modules outside its active implementation scope.
- **End-to-end flows.** Governance, allocation, and recurrent-allocation flows are delivered end-to-end on a Canton sandbox and pass the applicable Daml script and sandbox tests.
- **Shared core.** The reference modules use the shared `cap-core` packages rather than duplicating core interfaces.
- **SV Governance path.** The delivered integration or package is coordinated with the relevant Splice maintainers, FCS, and Avro without claiming a separate governance system. Where use requires SV approval or acceptance, evidence that the applicable approval or acceptance has been obtained is required; code completion alone does not represent external approval.
- **Dapp and Validator Wallet outcome.** The Concordia Dapp preserves binding human approval and signing boundaries and provides either approved and available Validator Wallet embedding or a standalone Dapp fallback. The fallback is a standalone outcome and does not constitute successful upstream integration.
- **Migration.** Any unavoidable impact on supported flows preserves backward compatibility where possible and provides a clear migration and rollback path.
- **Documentation and release.** Documentation is sufficient for another team to build, run, understand, and extend Concordia V2. Source and open-release conditions are met where applicable.
- **External adoption.** Qualified independent external teams provide adopter confirmation and substantive documented reuse, adaptation, or extension of completed Concordia V2 deliverables in pilot or production applications. Letters of intent alone do not satisfy acceptance.
- **Adoption funding qualification.** M5 and M6 adoption-linked funding is accepted only when the milestone's qualified-team eligibility, documented evidence and traceability, mutually exclusive non-stacking adoption tracks, funding caps, and portfolio-breadth conditions are satisfied.

---

## Funding

**Base Funding Request:** 630,000 CC
**Adoption-Linked Additional Funding:** up to 600,000 CC
**Total Funding Cap:** 1,230,000 CC

Each milestone is earned only after its deliverables, acceptance criteria, and required evidence are accepted through the applicable Development Fund process.

Compared with V1, V2 requires a parallelized effort across Splice and Concordia workstreams. At the time of this proposal, CC is priced at approximately USD 0.09, compared with approximately USD 0.14–0.15 at the time of the initial V1 proposal. V2 adoption-linked funding is reduced because V2 materially focuses on building Splice-related activity, which may not be straightforward to leverage as independent external adoption; it acts in addition to, rather than as a replacement for, V1 adoption funding.

Adoption-linked funding under Milestones 5 and 6 differentiates pilot and production tiers within Milestone 6, with pilot and production non-stacking for the same team on the same track and different tracks mutually exclusive for the same team. Cross-proposal non-stacking with Concordia V1 Milestones 7 and 8 is defined separately under Cross-Proposal Adoption Stacking.

### Payment Breakdown by Milestone

- Milestone 1 _(Discovery, Design, and Prototypes)_: 150,000 CC upon committee acceptance
- Milestone 2 _(First Runtime Slices in Both V2 Proving Domains)_: 180,000 CC upon committee acceptance
- Milestone 3 _(Runtime Reference Flows and Splice SV Governance Integration)_: 180,000 CC upon committee acceptance
- Milestone 4 _(End-to-End Composition and Release Readiness)_: 120,000 CC upon committee acceptance
- Milestone 5 _(External Adoption Validation, up to 12 months after Milestone 4 acceptance)_: up to 100,000 CC upon committee acceptance for at least 2 qualified independent external teams. Each qualified team receives one mutually exclusive, non-stacking payment: 50,000 CC for `cap-dapp` adoption or 35,000 CC for adoption of the new `cap-core` recurrence-related primitives and reference use case connected to governance primitives.
- Milestone 6 _(Extended External Adoption, up to 24 months after Milestone 4 acceptance)_: up to 500,000 CC, inclusive of premiums, upon committee acceptance for up to 10 additional qualified independent external teams beyond Milestone 5: per-adopter payments are mutually exclusive across the four pilot/production tracks (20,000 CC `cap-dapp` pilot, 40,000 CC `cap-dapp` production, 15,000 CC `cap-core`/Concordia-primitives-only pilot, 30,000 CC `cap-core`/Concordia-primitives-only production), with same-team caps of 40,000 CC within `cap-dapp` and 30,000 CC within `cap-core`/Concordia-primitives-only across pilot then production during Milestone 6, plus a separate 50,000 CC portfolio breadth premium at at least 5 accepted additional qualified external teams and an additional 50,000 CC portfolio breadth premium at 10 accepted additional qualified external teams, with the 500,000 CC cap inclusive of both breadth premiums (100,000 CC total when both trigger)

### Timeline Accountability

If a milestone from Milestones 1 through 4 is delayed beyond its stated delivery month for reasons under the proposer's control, the payout for that milestone should be reduced by **10% for each additional 2-week delay**, capped at **20%** for that milestone. After the capped delay penalty has been exhausted, if delays continue for reasons under the proposer's control, become unreasonable, or result in non-delivery, the Foundation or Tech & Ops Committee may refuse acceptance and close the affected milestone, and reserved funds for that milestone return to the Dev Fund pool. If two milestones are closed for those reasons, the Foundation or Tech & Ops Committee may terminate the full proposal, and any remaining reserved funds return to the Dev Fund pool.

Delays caused by Committee-requested scope changes or dependency changes imposed by the Canton ecosystem should not trigger this penalty automatically and should instead be handled through explicit milestone re-planning.

For Milestones 5 and 6, unaccepted or unearned reserved adoption funds return to the Dev Fund pool at their respective milestone deadlines.

### Volatility Stipulation

Funding amounts and estimated delivery months are defined; material scope changes may require funding review/revision subject to applicable governance and funding approval. Exact calendar dates will be set or updated upon approval. If delivery exceeds six months, the final proposal must define how material CC volatility affects unearned and undisbursed milestones. Any treatment must be prospective, transparent, and approved through the applicable governance and legal process. It may not retroactively change an earned milestone or imply an automatic Foundation top-up, discount, repricing, or obligation.

### Open Funding Decisions

- exact calendar delivery dates
- evidence and approval requirements for each payout
- treatment of material CC volatility

### Funding Locking

Unlockit will retain at least 25% of the funding received for non-adoption milestones M1-M4 through the full grant period, and at least 50% of adoption-linked funding received for M5/M6 for one additional year after grant closure. Unlockit may retain more than these minimum amounts. This is a funding-retention commitment, not escrow, third-party custody, or on-ledger locking.

For this commitment, the grant period runs from approval/start through final milestone closure; grant closure follows final milestone acceptance.

### Cross-Proposal Adoption Stacking

Adoption-linked funding under this proposal's Milestones 5 and 6 is non-stacking with adoption-linked funding under Concordia V1 Milestones 7 and 8 for the same adopting legal entity on the same adopted deliverable. An adopting legal entity may qualify for adoption payments across both proposals only where the adopted Concordia deliverables are materially distinct: for this proposal, materially distinct deliverables mean V2-only deliverables such as `cap-recurrence` primitives, the recurrence-related reference use case connected to governance primitives, or `cap-dapp` introduced by V2; for V1, materially distinct deliverables mean V1-only deliverables such as `cap-core` allocation primitives, `cap-governance`, or `cap-auctions` as established by V1. Adopters confirming adoption under both proposals must identify which deliverable and which proposal the adoption evidence applies to.

If the same adopting legal entity is accepted under both proposals for the same deliverable, the adopting entity selects one proposal's milestone to claim for that adoption; the other proposal's milestone for the same adoption is then unearned for that entity. The selection is documented in the adopter confirmation letter.

This rule does not prevent the same adopting entity from qualifying under both proposals for materially distinct deliverables, nor does it cap the total number of adopting entities across both proposals.

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

Concordia V2 addresses recurring financial-workflow problems relevant to grant-funded initiatives and workflows involving substantial currency values, creating potential for a broad range of use cases. Meaningful benefits must be measured through actual independent integrations, workflow-family breadth, demonstrated adapter and component reuse, and verified interoperability against documented interface versions.

The boundary with the Zebec payroll and programmable-payments proposal is detailed in Related Projects and Standards.

---

## Rationale

**Why five layers.** Canonical governance and authorization, CAP decision and domain workflows, recurring amount calculation, token-standard settlement, and the common application layer evolve for different reasons. Separate interfaces make each replaceable, testable, and reviewable without forcing adopters into one governance model, legal policy, asset, or frontend.

**Why employment and rental.** Employment requires explicit bilateral unanimous agreement, policy-controlled unilateral and mutual termination routes, and carefully separated final allocations. Rental proves that the shared core can support a non-employment workflow without importing employment assumptions.

**Why a common participant application layer.** Shared projections, role-aware state, action discovery, components, and adapters make lifecycle behavior inspectable and reusable across ecosystem workflows. The independently runnable reference UI demonstrates composition while keeping Unlockit's product frontend and customer work outside the grant. Interface actions reflect authority established by source contracts; they do not grant it.

**Why use existing settlement standards.** Concordia V2 determines obligations and allocations. Existing Canton Token Standards are the proper boundary for asset representation and transfer, avoiding a competing payment or token layer.

**Why adoption evidence.** Independent evaluation or integration is stronger evidence of reuse than stated interest. Because adopter availability is outside Unlockit's control, the Foundation must confirm acceptable equivalent evidence before final submission.

**Coordination with existing governance work.** Unlockit will coordinate with Avro, the Canton Foundation, and Splice maintainers to identify reusable components and boundaries for the SV Governance dApp and wallet. Implementation or upstream contribution will follow the responsibilities agreed with those maintainers. If direct integration is not agreed, the standalone application layer will remain reusable.

**Funding boundary.** Development Fund support covers reusable Apache-2.0 primitives, the common application layer, reference workflows, documentation, tests, and interoperability work. Unlockit funds its product frontend, product-specific integrations, customer customization, hosted operations, sales, and go-to-market activity; no grant funding is requested for Unlockit's commercial implementation.

---

## Maintenance

Unlockit will maintain this work throughout the grant period. After grant finalization, continued maintenance is tied to Unlockit's continued product use in the Real Estate vertical, where governance and allocation problems are foreseen or already applicable. Unlockit is open to maintaining the work jointly with other interested stakeholders. This does not commit to a fixed post-grant duration, SLA, staffing level, funding, or roadmap.

---

## Governance and Open Decisions

The proposal champion remains **TBD**. The proposal uses the `financial-workflows-composability` and `onchain-governance` SIG labels.

Material scope, milestone, funding, or licensing changes must follow the applicable Development Fund governance process. Technical design decisions will be recorded publicly. Maintainer authority, contribution review, release signing, dispute handling, and security disclosure procedures will be documented before final release.

Open decisions before submission:

- total funding, CC amounts, percentages, and exact dates
- Foundation milestone-evidence and payout-approval requirements
- interfaces with related token, governance, payroll, and settlement projects
- maintenance term and service expectations
- volatility treatment if the project runs beyond six months

---

## Related Projects and Standards

- [Concordia proposal, PR #184](https://github.com/canton-foundation/canton-dev-fund/pull/184) and [Concordia repository](https://github.com/unlockitio/concordia). Concordia V2 extends its reusable decision and allocation direction into recurring and time-based allocations. Package boundaries and migration paths require confirmation.
- [Decentralization Manager Phase 2, PR #530](https://github.com/canton-foundation/canton-dev-fund/pull/530) and [Decentralization Manager repository](https://github.com/DLC-link/decentralization-manager). Governed parties, membership, and reward routing may complement authorization or treasury workflows. Shared authority and reward interfaces remain unresolved.
- [FCS Splice SV UI/UX improvements grant, PR #444](https://github.com/canton-foundation/canton-dev-fund/pull/444), with per-milestone execution tracked via [issue #529](https://github.com/canton-foundation/canton-dev-fund/issues/529). Coordinated with, not duplicated by, Concordia V2.
- [Zebec payroll proposal, PR #416](https://github.com/canton-foundation/canton-dev-fund/pull/416) and [Zebec Canton payroll repository](https://github.com/Zebec-protocol/zebec-canton-payroll). Zebec is a payroll and programmable payment-stream product addressing a specific application and operating path; Concordia V2 proposes a reusable, cross-domain recurring-allocation primitive with policy separation. Settlement remains an external boundary for both, addressed through existing Canton Token Standards. Overlap, reuse, and settlement interfaces require direct alignment.
- [OpenFluid](https://openfluid.xyz/). OpenFluid is relevant adjacent work in programmable financial flows. The precise technical relationship and reusable interfaces have not been confirmed and must be resolved during discovery.
- [CIP-0056](https://github.com/canton-foundation/cips/blob/main/cip-0056/cip-0056.md). Its requirements will be reviewed for standards alignment. Any claimed interface support must be demonstrated.
- [CIP-0112](https://github.com/canton-foundation/cips/blob/main/cip-0112/cip-0112.md). Its requirements will be reviewed for standards alignment. Any claimed interface support must be demonstrated.
- [Splice canonical repository and code](https://github.com/canton-network/splice) and [Splice application-development documentation](https://docs.sync.global/app_dev/overview/index.html). Relevant primary-source anchors include the `DsoRules` vote request/cast/close workflow, suitable public/read APIs, and the Development Fund allocation/coupon lifecycle and manager-authorized routes. Composition and write support remain subject to interface validation.
- [SV Governance dApp proposal #223](https://github.com/canton-foundation/canton-dev-fund/issues/223) and its milestone issues [#286](https://github.com/canton-foundation/canton-dev-fund/issues/286), [#287](https://github.com/canton-foundation/canton-dev-fund/issues/287), [#288](https://github.com/canton-foundation/canton-dev-fund/issues/288), and [#289](https://github.com/canton-foundation/canton-dev-fund/issues/289). Concordia V2 will seek reuse and avoid presenting its common application layer as replacement governance infrastructure.
- [CIP-0082](https://github.com/canton-foundation/cips/blob/main/cip-0082/cip-0082.md) and [CIP-0100](https://github.com/canton-foundation/cips/blob/main/cip-0100/cip-0100.md). These define Development Fund allocation and governance context.

Concordia V2 proposes shared, reusable primitives and interfaces rather than a competing application. Its priority over adjacent work rests on three points: (a) `cap-core` and `cap-recurrence` are designed as a common substrate that other projects can build on without depending on Concordia product choices; (b) the recurring-allocation lifecycle is anchored in canonical `cap-core` outcome execution, with settlement delegated to existing Canton Token Standards rather than introducing a parallel payment layer; (c) the `cap-dapp` reference UI demonstrates composition and boundary discipline without claiming to replace governance, payroll, or wallet products. Strong points of adjacent work are recognized: Zebec delivers a concrete payroll product with operating depth; Decentralization Manager formalizes governance-membership and reward-routing semantics that may complement Concordia authorization and treasury flows; the SV Governance dApp and FCS Splice SV UI/UX grant hold primary responsibility for the SV governance and Validator Wallet surface that Concordia V2 only proposes to iterate subject to maintainer agreement; CIP-0056, CIP-0082, CIP-0100, and CIP-0112 set the standards and Dev Fund allocation context that any proposal in this space must respect. Where overlap exists, alignment is preferred over duplication; where alignment is not yet established, maintainer review and tests will resolve it.

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
- **Maintenance:** Duration, funding, response expectations, and succession remain TBD.
- **Funding and volatility:** CC amounts, percentages, dates, and treatment beyond six months remain open.
