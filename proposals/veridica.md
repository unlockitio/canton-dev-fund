## Development Fund Proposal

**Author:** Unlockit (luis.marado@unlockit.io)
**Status:** Draft
**Created:** TBD
**Champion:** TBD

> This draft is provided for discussion. It does not create a funding, delivery, governance, adoption, endorsement, or Foundation commitment.

---

## Abstract

Veridica provides inspectable confidence in information through versioned contributions, supporting evidence, mechanical validation, and governed participation. Matching and aggregation validate information mechanically under applicable standards and policies. Eligible independent Verifiers may provide external evidence when the policy recognizes it, without replacing mechanical validation or always gating aggregation.

Selective access and controlled reuse let applications share information on a need-to-know basis while governing who may access, verify, use, or further share it. A traceable history preserves how information was submitted, validated, optionally verified, corrected or replaced, shared, and used, together with previous versions, evidence, checks, and reasons. Each application can choose policies and acceptance thresholds suited to its purpose and risk.

For priced use, a Consumer selects data, accepts a time-bound quote, and locks the Consumer token in Escrow. The Data Provider prepares the selected data and sends the applicable allocation inputs. The Settlement Allocator allocates the value of the locked Consumer token as rewards to Contributors and Verifiers according to the configured allocation and recipient routes. Escrow verifies the allocation instructions, and the final settlement, including delivery of the selected data to the Consumer, completes atomically.

---

## Specification

### 1. Objective

Veridica’s objective is to provide shared Canton application primitives for information that can be contributed, mechanically validated, optionally verified, used on a need-to-know basis, and rewarded. It aims to move oracle use beyond relying mainly on a provider’s reputation toward confidence that applications can assess from evidence, policy-governed matching and aggregation, mechanical validation, optional external verification, and history.

Veridica must enable applications to:

- accept information and supporting evidence from one or more contributors
- match, validate, and aggregate information mechanically under clear, versioned standards and policies
- record optional external verification by eligible independent Verifiers, whether performed manually or through automation on their behalf
- preserve evidence, corrections, supersession, previous versions, and the reasons for changes
- control selective disclosure and permitted use through normal Canton stakeholder visibility or Daml Explicit Contract Disclosure, without weakening Daml authorization
- set acceptance rules and confidence thresholds suited to each application’s purpose and risk
- trace how accepted information and recognized verification work lead to policy-approved reward allocations for eligible contributors and Verifiers
- reuse common, provider-neutral primitives across different applications instead of depending on one provider-specific product

Success means an independent Canton team can use the shared primitives to build a workflow in which information is contributed, mechanically assessed, optionally supported by external verification, selectively used, corrected or superseded with its history intact, and connected to an authorized reward decision. Veridica does not guarantee truth or data quality, make rewards automatic, or replace the governance and authorization rules chosen by each application.

### 2. Implementation Mechanics

Veridica will provide reusable Daml contracts, interfaces, application components, APIs, and reference flows organized as composable contracts and linked records with distinct responsibilities. These components support governed information contribution, evidence, validation, access, reuse, priced use, reward allocation, settlement, and delivery. Matching and aggregation perform mechanical validation under the applicable standards and policies. Independent verification is optional external evidence, provided manually or through automation on behalf of an eligible Verifier, that may strengthen, qualify, or challenge confidence without replacing mechanical validation.

#### Governed identifiers, standards, and policies

Each sharing context will use named and versioned configuration maintained by an operator, consortium, governed service, or another authorized authority. The configuration may include:

- an **Identifier Scheme** defining how subjects and submissions are identified
- an **Information Standard** defining fields, units, formats, and required metadata
- an **Observation Key Policy** defining which fields identify the same contextual observation
- a **Matching Policy** defining same-observation and governed related-observation matching, exact and semantic methods, mappings, tolerances, and matcher and input eligibility
- an **Aggregation Policy** defining contribution selection, normalization, calculation, publication, and the mechanical validation and confidence inputs produced by aggregation
- a **Verification Policy** defining when external verification is permitted or required, Verifier eligibility and independence, manual and automated modes, and how verification is recognized and weighted in confidence

An **Observation Key** identifies a contextual observation that related contributions may describe. Where an application integrates with an external data-standard interface, the applicable Observation Key Policy may define a mapping between Veridica observation identity and the external datapoint identity, schema version, and contextual fields.

A **Contribution ID** uniquely identifies each submission. Contributions with the same Observation Key remain separate records with separate contributors, evidence, checks, permissions, and histories.

Observation Keys are domain-specific. The following compact examples are illustrative, not universal requirements:

| Example | Illustrative Observation Key fields |
|---|---|
| Equity price | Instrument ticker or stronger governed identifier + market + metric + currency + observation date + adjustment basis |
| Real-estate valuation | Jurisdiction + property identifier + metric + effective date + currency + valuation basis |

A policy may require stronger identifiers, finer timestamps, source categories, or other context. The exact versions of the Identifier Scheme, Information Standard, Observation Key Policy, Matching Policy, and Aggregation Policy used for each record or decision are retained so applications can determine which rules applied. Changes create a new version rather than changing the meaning of an earlier record.

Pricing, reward allocation, settlement routes, and delivery are configured separately for the active priced-use flow. The Consumer accepts the binding quote, the Settlement Allocator applies the configured allocation and recipient routes, and Escrow verifies their execution before final settlement and delivery.

#### Composable information, evidence, and decision records

An information or assertion record will contain submitted information, a reference to a document or dataset held elsewhere, or both. It will carry its **Contribution ID**, identify its sources or contributors, declare the applicable **Information Standard** and version, state its **Observation Key**, and reference the configuration that governs the sharing context.

A contribution may contain one record or a batch of records. Each contribution must declare its standard and version, and each record must remain independently identifiable, comparable under the applicable policies, subject to validation, and traceable through its history. If a submission uses multiple standards, it must place records into explicit standard groups or use separate batches. A batch is only a container for submitted records. It is not an aggregate information product calculated from selected inputs.

Separate provenance and evidence records will link a contribution to its sources, supporting documents, transformations, and earlier versions. A **Mechanical Validation Record** will identify the rules and inputs used, the result and limitations, the applicable policy versions, and an execution receipt. A separate **Verification Record** will identify the Verifier, the basis for eligibility and independence, the manual or automated method and any tool used, the evidence considered, the result, limitations or conflicts, and the Verifier’s attestation. Separate decision records may retain policy decisions without imposing a universal status model. Usage, reuse, reward eligibility, and allocation records will remain separate and linked to the relevant contribution, record, or aggregate product.

Information may also have an explicit relationship to an earlier contribution, including `supports`, `contradicts`, `corrects`, `replaces`, `enriches`, `derives_from`, or `duplicates`. These relationships record how one item is claimed to relate to another. They do not by themselves prove that either item is true, accurate, or independent. The relationships remain subject to the applicable matching, mechanical validation, and optional verification policies, while preserving the history of both records.

The ledger will hold the contracts and state needed to govern these records and their permitted use. Larger documents or sensitive evidence may remain outside the ledger and be delivered through an authorized channel. A ledger reference records the relationship between that material and the contribution, but does not by itself prove that the material is correct, available, authentic, or unchanged.

#### Discovery, matching, validation, and confidence

A privacy-safe discovery or catalog record may signal that information exists for a governed subject and type without exposing protected values, evidence, unnecessary contributor identity, or contributor counts. Policies may also support optional invitations for eligible contributors and Verifiers.

An authorized matcher applies a named and versioned Matching Policy to determine whether records describe the same governed observation, a governed related observation, are comparable, and, where applicable, have a governed content relationship. **Exact matching** compares governed Observation Key fields directly. **Semantic matching** applies stated normalization, mappings, tolerances, or contextual rules. Comparison is an internal matching activity that evaluates relevant records under the policy, rather than a standalone primitive. Matching does not by itself prove truth, quality, agreement, or independence.

Matching and aggregation perform mechanical validation under the applicable Information Standards and policies. Their records preserve the rules, inputs, results, limitations, policy versions, and execution receipts used. Independent verification is optional external evidence from an eligible independent Verifier, performed manually or through automation on the Verifier’s behalf. It may occur before, during, or after aggregation and may strengthen, qualify, or challenge confidence where the policy recognizes it, without replacing mechanical validation or always gating aggregation.

Corrections and supersession retain prior versions, mechanical results, verification evidence, and reasons. Confidence is policy-derived from mechanical results, aggregation, evidence quality, and verification where the policy recognizes it. Each application chooses the policies, confidence measures, and acceptance thresholds suited to its purpose and risk.

#### Aggregation and information products

An aggregation pipeline creates a distinct information product from eligible source records. It will identify authorized inputs, normalize them under a named and versioned Information Standard and Aggregation Policy, handle outliers and missing data, apply recency rules, require any minimum number of independent inputs, and record mechanical validation outputs, evidence, and the inputs used by the applicable confidence policy.

Publication controls define who may receive or use the aggregate product. Pricing and licensing rules apply independently to the aggregate and its source records. Reward rules may recognize eligible contribution, matching, verification, aggregation, or adjudication work. Every aggregate remains traceable to the input versions, policies, methods, decisions, and evidence used to create it.

An application may offer only aggregate products without selling or exposing source contributions, subject to the applicable permissions. This does not make aggregation a truth guarantee, and a minimum input count does not replace quality, independence, or conflict checks.

#### Need-to-know access and controlled reuse

Veridica will support two complementary Canton visibility paths across its contracts and records. Under normal Daml stakeholder or observer visibility, relevant parties see contract data and their participant nodes retain and synchronize the contract data those parties are entitled to see. For command-specific use by a non-stakeholder, a stakeholder may send an authenticated contract copy through an off-ledger channel using Daml Explicit Contract Disclosure. The recipient can attach that copy to a command, and the ledger validates it during transaction processing. This relaxes visibility for that command; it does not add the contract to the recipient's normal visible contract set or change Daml authorization.

Policies state who may receive information or evidence, for which purpose it may be used, whether it may be shared or reused, and when permission expires. Separate usage and reuse records link an authorized workflow to the source or aggregate product, policy, permission, and version used. Revocation cannot make a party forget information already received.

#### Pricing, rewards, and distributed operation

Pricing and licensing may be configured at a macro level for a sharing context or at a micro level for a subject, information type, contribution, aggregate product, or permitted use. Accepted work may create separate reward-eligibility records identifying the recognized contribution, matching, verification, aggregation, or adjudication work, eligible parties, evidence, policy, and authorized allocation route. Eligibility does not create an automatic payment or entitlement.

Where validated interfaces fit, Veridica intends to reuse Concordia's Canton Allocation Primitives for optional governance of macro or micro pricing and policy decisions, and for reward allocation or settlement handoffs. Current CAP is not assumed to implement Veridica's complete evidence, pricing, or reward model. Asset representation and final settlement remain separate from Veridica's information and eligibility records.

The operating model is configurable and distributed. Multiple matchers, verifiers, aggregators, or adjudicators may issue assessments under different named policies. There is no globally canonical result by default. Applications choose recognized policies, operators, authorities, and thresholds. An operator, consortium, or another authorized governance body may maintain each configuration without forcing every application into one decentralization model.

#### Application integration and reference workflow

Versioned Daml interfaces, an SDK, reusable UI components, and reference adapters will let applications submit records or batches, follow provenance and evidence, discover available information safely, inspect matching and lifecycle decisions, apply acceptance policies, request permitted use, create aggregate products, and inspect pricing and reward state. These components prepare or submit actions only through authorized routes; they do not grant contract authority.

A reference workflow will demonstrate:

1. an authorized party publishes named and versioned identifier, information, observation-key, matching, and optional aggregation policies
2. optional invitations identify eligible contributors or verifiers
3. one or more contributors submit independent records or a relation to a prior contribution, each with a Contribution ID, Observation Key, standard version, provenance, and evidence
4. the catalog signals availability without revealing protected content or unnecessary contributor activity
5. an authorized matcher applies exact or semantic matching and routes ambiguous cases for review
6. mechanical validation, optional independent Verification, challenges, and application policy produce the evidence and inputs from which the application policy derives a confidence assessment and lifecycle decision
7. an authorized application either uses an accepted record directly or creates and uses a traceable aggregate product
8. normal Daml visibility or Explicit Contract Disclosure supplies the contract input needed for the authorized workflow
9. pricing and licensing are applied, usage is recorded, and recognized work may produce eligibility for an authorized reward-allocation decision
10. corrections, replacements, challenges, and expiry feed back into later decisions while preserving history

At proposal level, controls include role and conflict policies, duplicate and replay handling, stale and archived-state handling for disclosed contracts, explicit expiry, separation of duties where required, and an audit trail linking material actions to actors, policies, evidence, and prior state.

#### Consortium authority, execution, and hosting models

Veridica separates four concerns that implementations must not collapse:

- **Governance authority** is the consortium body entitled to adopt governance policy and authorize bounded changes.
- **Governor** receives committed Governance Proposals and distributes each Governance Proposal + Ballot Request to every policy-defined relevant stakeholder. The Governor is a separate logical role, not the source of governance authority.
- **Resolver** evaluates the applicable ballots under the active governance policy and resolves the proposal. The Resolver is a separate logical role.
- **Execution Model and execution identity** define which Daml party or parties may carry out an authorized outcome, under which versioned controls. The executor set is a separate logical role from Governor and Resolver. Governor and Resolver may be assigned to the same Party or configuration, but that assignment neither merges roles nor changes the governance workflow.
- **Participant hosting or custody** determines where those parties are hosted and how keys or operational control are held. Hosting or custody does not itself grant governance authority, Governor status, or business authorization.

Consortium formation is a one-time bootstrap process. The Consortium Lead acts as Genesis **Proposer** and commits the closed immutable Candidate electorate when proposing the Consortium. The formation workflow intentionally scopes only to that formation trigger and the visible execution-identity prerequisite; it does not represent all current policy decisions.

The successful **Consortium formed** outcome establishes the formation result; `VRejected` and `VExpired` do not. Detailed rules for selecting and activating a Genesis Governor, Resolver, and Execution Model belong to the approved proposal, Initial Charter, and implementation specifications rather than the visual workflow. The selected model may be a distributed M-of-N operator-party arrangement, a single execution party controlled by a consortium legal entity, an optional DecMan-backed Canton Decentralized Party using supported open-source components, or a compatible future model. DecMan and Canton Decentralized Party are options, not requirements. DecMan supplies an execution mechanism, not the business policy engine; the approved proposal and charter definitions determine business authorization.

After genesis, reusable consortium governance follows CAP terminology and mechanics. A Proposer eligible under the active governance policy prepares a proposal carrying the requested action, commitments, and timing. Eligible stakeholders handle their ballots, and the Resolver evaluates the proposal. Approved outcomes may proceed to the Executor set; **Rejected** or **Expired** decisions do not execute. Operators may be eligible under the initial policy but are not the only possible Proposers, and the Execution Model does not determine proposer eligibility. Policy, reward, membership, rules, execution-model, and other supported changes are proposal action types rather than separate setup workflows.

Detailed policy and implementation rules define proposal timing, committed targets, withdrawal and ballot changes, executor authorization, drift handling, expiry, and audit records. A revised proposal starts a new decision cycle rather than reopening the current one. These rules constrain implementations but are not claimed as separate behavior in the current visual workflow.

Reward governance is separate from governance voting weight. Macro rules may divide an approved reward amount into **X% for contributors, Y% for verifiers, and Z% for operators**, with any additional eligible roles explicitly defined. The policy must validate that all pools total 100%. Within each pool, micro allocation may use eligible credentials, role, recognized activity, quality, or other governed weights. Governance weights do not automatically become reward weights. Veridica will seek to leverage, and may extend, Concordia/CAP where necessary and appropriate, subject to validated interfaces and explicit boundary assessment.

#### BPMN Workflow Index

These diagrams focus on the people and organizations that act, the order of their work, their decisions, and their handoffs. Contracts, policies, credentials, proposals, approvals, Governor mechanisms, and records appear as information used or produced during that work.

| Seq. | Workflow | Preview (SVG) | Authoritative BPMN 2.0 source | Scope and handoff | Status |
| --- | --- | --- | --- | --- | --- |
| 01A | Consortium Formation and Genesis Election | [SVG](assets/01a-veridica-consortium-formation.svg) | [BPMN](assets/01a-veridica-consortium-formation.bpmn) | Establishes the consortium context and genesis election outcome used by subsequent governance. | Defined |
| 01B | Consortium Governance | [SVG](assets/01b-veridica-consortium-governance.svg) | [BPMN](assets/01b-veridica-consortium-governance.bpmn) | Governs proposals, review, stakeholder ballots, resolution, and execution. | Defined |
| 02 | Veridica Access Lifecycle | [SVG](assets/02-veridica-access-lifecycle.svg) | [BPMN](assets/02-veridica-access-lifecycle.bpmn) | Governs admission, capabilities, revocation, and renunciation for participant roles. | Defined |
| 03 | Data Producer Actions | [SVG](assets/03-veridica-data-producer-actions.svg) | [BPMN](assets/03-veridica-data-producer-actions.bpmn) | Covers contribution, matching, mechanical validation, correction, aggregation, and optional independent verification. Produces information or products that may be used in priced use. | Defined |
| 04 | Consumer Actions | [SVG](assets/04-veridica-consumer-actions.svg) | [BPMN](assets/04-veridica-consumer-actions.bpmn) | Covers selected-data pricing, Consumer token lock, configured reward instructions for Contributors and Verifiers, final settlement, and atomic data delivery. | Defined |

"Open" discovery or registration means that parties can find the process and apply. Formal roles, workflow actions, and information access remain subject to credentials, election or approval, policy, and Daml authorization.

#### 01A. Consortium Formation and Genesis Election

The **Consortium Lead** is the Genesis **Proposer**. The Lead first decides whether the execution identity requires Party setup; either creates or registers the required DecMan Governor Party or single Consortium Party, or uses the committed Proposer + Candidate Party set; then proposes the Consortium. That proposal uses the Party Setup result to define and commit the selected execution identity/model, configured decision-policy fields, and fixed, closed Candidate electorate.

After proposing, the Proposer sends the Genesis Proposal and Ballot Request to every fixed Candidate. Each Candidate handles its own ballot. Once the ballots are available for resolution, the Genesis Resolver evaluates and resolves the election, ending in **Consortium formed**, **Rejected**, or **Expired**. Detailed privacy, deadline, rejection, and replacement rules belong to external policy or implementation specifications; they are not shown as workflow steps here.

![01A. Veridica consortium formation and genesis election BPMN](assets/01a-veridica-consortium-formation.svg)

Canonical source: [01A Veridica consortium formation and genesis election BPMN 2.0](assets/01a-veridica-consortium-formation.bpmn).

#### 01B. Consortium Governance

Each reusable governance cycle begins when an action is requested of a Proposer, who prepares a Governance Proposal and delivers it to the Governor. The Governor reviews it, then either distributes the proposal for stakeholder consideration or requests a revision. A revision begins a new proposal cycle rather than reopening the existing ballot.

The applicable stakeholders then handle their own ballots under the governance process. Once the applicable governance condition is satisfied, the Resolver evaluates the proposal. An approved outcome goes to the Executor set for validation and either execution or expiry; **Rejected** and **Expired** proposals end without execution. The diagram also shows a separate Proposer withdrawal request, but does not show that request interrupting the Governor's review.

Detailed rules for proposer eligibility, ballot admission and tallying, withdrawal timing, execution windows, executor authorization, committed targets, drift handling, and audit records belong to the governing policy and implementation specifications. They are not shown as separate workflow behavior here.

Governor, Resolver, and Executor remain separate logical roles. They may be assigned to the same Party or configuration, but the current workflow does not prescribe that assignment. A Governor single Party/set and DecMan-managed/non-DecMan remain configuration choices rather than separate workflow choices.

Policies, rewards, membership, rules, execution-model updates, and compatible future changes are Proposal action types. They are not separate governance/reward setup phases. CAP supplies the governance vocabulary and proposal-resolution mechanics; DecMan or a Canton Decentralized Party may supply an execution option but is not the business policy engine.

![01B. Veridica consortium governance BPMN](assets/01b-veridica-consortium-governance.svg)

Canonical source: [01B Veridica consortium governance BPMN 2.0](assets/01b-veridica-consortium-governance.bpmn).

The dependency is: **01A forms the Consortium through its genesis election → 01B governs reusable consortium decisions after formation**. 01A uses only the fixed genesis Candidate electorate; 01B does not replace or broaden that formation election.

#### 02. Veridica Access Lifecycle

Workflow 02 separates the Governor or Consortium Member, Prospective Participant, active Veridica Participant, and Veridica Operator. Admission, capability, governed revocation, and unilateral renunciation requests go to the Operator. A Governor or Consortium Member may sponsor, offer, or request admission; a Prospective Participant may submit its own admission request; and an active Veridica Participant may request more role or credential capabilities or unilaterally renounce a specifically named held role capability.

Contributor, Aggregator, Verifier, and Consumer are functional role capabilities held by a Veridica Participant. For admission and additional capabilities, the Operator validates the request and eligibility policy, then uses **Obtain governed outcome from 01B**. Workflow 02 keeps that reusable governance work within 01B instead of repeating its participants and decisions.

An approved admission or capability outcome identifies the accepted role capabilities. The Operator records and activates each accepted capability and its scoped credentials; these records may be completed independently for the accepted capabilities. A **Rejected** or **Expired** outcome is recorded without activation. Governed revocation also uses 01B and removes only the named access or capabilities when approved. By contrast, unilateral self-renunciation verifies participant control and removes the named held capability and its scoped credentials without governance approval, preserving unrelated capabilities.

Detailed eligibility constraints, including whether Aggregator and Verifier capabilities may be combined for the same product, belong to the governed access policy rather than the visual workflow. Reward eligibility and priced-use reward allocation are handled by the active application and settlement flow.

![2. Veridica access lifecycle BPMN](assets/02-veridica-access-lifecycle.svg)

#### 03. Data Producer Actions

Workflow 03 has separate Contributor, Aggregator, and Verifier participants. Participant lifecycle and technical Platform behavior remain outside this workflow. The Contributor submits a versioned contribution with its provenance and evidence, sending the same version to both the Aggregator and the Verifier. The Verifier independently assesses the received contribution and evidence as optional external evidence. That assessment does not gate or alter the Aggregator's matching or aggregation.

The Aggregator receives and matches contributions, then evaluates **Correction needed?** If correction is needed, the Aggregator sends a request to the Contributor. The Contributor resolves or corrects the contribution and submits a superseding version to both the Aggregator and the Verifier for fresh mechanical validation and, where performed, fresh independent Verification. The prior version remains visible as not current, with its prior mechanical validation and any Verification history retained.

When no correction is needed, the Aggregator prepares a consolidated contribution and sends it to the Verifier. The Verifier receives it through the same external-verification path used for other versions, recording the Verification without assessing the Aggregator's performance or method.

Detailed independence, matching, aggregation, validation, and quality rules belong to the applicable policies and standards unless shown as a step or decision here. Reward eligibility and priced-use reward allocation are handled by the active application and settlement flow rather than a standalone workflow.

![3. Veridica data producer actions BPMN](assets/03-veridica-data-producer-actions.svg)

#### 04. Consumer Actions

Workflow 04 is the full priced-use real-time settlement continuation across exactly four participants: **Consumer, Data Provider, Settlement Allocator, and Escrow**. There is no Platform role. The Consumer selects either a direct data point or an aggregation and requests a binding time-bound quote. The Data Provider returns that quote; once accepted, the Consumer sends the accepted quote and token-lock instruction to Escrow. Escrow secures the amount and sends **Escrow locked** to the Data Provider.

The Data Provider then prepares the selected data and sends Allocation inputs containing the data or product reference, secured funds reference, quote, and policy version to the Settlement Allocator. The Settlement Allocator generates immutable N-recipient settlement instructions, iterates every instruction, selects and performs each Contributor or Verifier recipient's configured route, and records each execution. The three per-instruction route classes are stablecoin, same-standard internal-token credit, or fiat rail. A fiat execution record requires confirmation from the configured connector and rail; it does not assert ultimate bank irrevocability. Escrow then verifies that every N instruction was executed and recorded and atomically completes final settlement with delivery of the selected data to the Consumer.

Escrow emits the final settlement receipt to the Data Provider and Consumer, and the Consumer receives the selected data as part of the completed atomic flow. This continuation has no batch, deferred, pending, off-ramp, or later token-spending behavior.

![4. Veridica consumer actions BPMN](assets/04-veridica-consumer-actions.svg)

### 3. Architectural Alignment

Veridica aligns with Canton strengths in privacy-aware multi-party workflows, explicit authorization, deterministic contract state, and auditable lifecycle transitions. It separates content from provenance, verification from governance, access from reuse permission, reward eligibility from settlement, and user-interface action discovery from authority.

The project is complementary to [CAPS PR #497](https://github.com/canton-foundation/canton-dev-fund/pull/497). CAPS proposes the Canton Access and Privacy Standard and a privacy-preserving push-oracle model for selectively visible signed records. Veridica can reuse validated CAPS access and privacy patterns while addressing a wider contribution lifecycle: multiple evidence sources, independent verification, confidence, challenge, transformations, controlled reuse, and rewards. This broader scope does not diminish CAPS's common-good value or prejudge its interfaces.

CAP means Canton Allocation Primitives and is separate from CAPS. CAP/Concordia is relevant to governed decisions, allocations, and reward routing. Veridica will claim compatibility with CAPS or CAP/Concordia only where public interfaces, versions, and tests demonstrate it.

### 4. Backward Compatibility

No protocol-level backward compatibility impact is expected. Veridica is a new application-layer library and reference implementation. Existing applications, CAPS, CAP/Concordia, Canton Token Standards, and Development Fund processes remain unchanged.

Adapters will be versioned, and unresolved interfaces will be documented rather than presented as supported.

---

## Milestones and Deliverables

Delivery dates, CC amounts, and exact percentages are **TBD**. Milestones are separated into core implementation and measurable adoption. Core implementation milestones together must receive **less than 50%** of the total requested allocation. The measurable adoption milestone must receive **strictly more than 50%** of the total requested allocation. The final arithmetic must satisfy those constraints before submission.

This proposal commits to approximately one year of delivery across 12 development milestones plus one measurable adoption milestone. Dates, evidence details, and funding are **TBD** and will be finalized before submission.

### Milestone 1: Architecture, Scope, and Threat Model

- **Estimated Delivery:** TBD
- **Funding:** TBD CC
- **Allocation Category:** Core implementation
- **Focus:** Establish bounded architecture, scope boundaries, authorization model, and threat model for the Veridica primitives.
- **Deliverables / Value Metrics:**
  - public architecture, authorization model, threat model, and scope boundaries
  - documented limitations, privacy assumptions, governance boundaries, and security considerations
  - documented interface assessment for CAPS, CAP/Concordia, and Canton Token Standards
- **Acceptance Criteria:**
  - the architecture identifies contracts, off-ledger components, roles, authorization boundaries, and supported interface versions
  - the threat model and scope boundaries are reviewable and preserve the stated limitations
  - no compatibility claim is made without a tested interface and identified version

### Milestone 2: Versioned Daml Interfaces

- **Estimated Delivery:** TBD
- **Funding:** TBD CC
- **Allocation Category:** Core implementation
- **Focus:** Define the versioned Daml interfaces for contribution, provenance, verification, confidence, disclosure, reuse, and reward eligibility.
- **Deliverables / Value Metrics:**
  - versioned Daml interfaces for the core records and policies
  - documented relations for support, contradiction, correction, replacement, enrichment, derivation, and duplication as claims rather than proof
  - interface documentation and versioning guidance
- **Acceptance Criteria:**
  - the interfaces preserve source, method, policy, authorization, and lifecycle state needed by the reference flows
  - supported versions and compatibility boundaries are documented
  - reward eligibility remains policy-controlled and separate from token settlement

### Milestone 3: Executable Reference Package

- **Estimated Delivery:** TBD
- **Funding:** TBD CC
- **Allocation Category:** Core implementation
- **Focus:** Deliver an executable reference package demonstrating the versioned interfaces.
- **Deliverables / Value Metrics:**
  - executable reference package with published setup and run instructions
  - contribution, independent verification, challenge, confidence update, bounded disclosure, permitted derivation, and reward-eligibility examples
  - automated tests for the demonstrated reference flows
- **Acceptance Criteria:**
  - a reviewer can build, run, and exercise the documented reference flows
  - provenance remains linked across the demonstrated derivation flow
  - tests cover the supported interface versions and reject invalid reference-flow states

### Milestone 4: SDK Clients, Fixtures, and Policy Adapters

- **Estimated Delivery:** TBD
- **Funding:** TBD CC
- **Allocation Category:** Core implementation
- **Focus:** Make the interfaces reusable through SDK clients, fixtures, and policy adapter examples.
- **Deliverables / Value Metrics:**
  - SDK clients and fixtures for the reference interfaces
  - policy adapter examples for matching, aggregation, confidence, disclosure, reuse, and reward eligibility
  - documented setup findings and interface reuse guidance
- **Acceptance Criteria:**
  - a developer can use the published clients and fixtures to exercise the reference package
  - policy adapters retain the relevant source, method, and version information
  - examples do not imply unsupported compatibility or automatic truth, quality, or reward guarantees

### Milestone 5: Lifecycle and Authorization Controls

- **Estimated Delivery:** TBD
- **Funding:** TBD CC
- **Allocation Category:** Core implementation
- **Focus:** Implement lifecycle, role separation, and authorization controls for contribution, verification, disclosure, reuse, and rewards.
- **Deliverables / Value Metrics:**
  - automated lifecycle and authorization tests
  - documented contributor, aggregator, verifier, and consumer role boundaries
  - controls for suspension, removal, credential rotation, and invalid lifecycle transitions
- **Acceptance Criteria:**
  - tests reject unauthorized disclosure, verification, reuse, reward allocation, and invalid lifecycle transitions
  - the verifier is independent of the contributor in the reference flow
  - the same party cannot be both aggregator and verifier for the same product

### Milestone 6: Provenance and Derivation

- **Estimated Delivery:** TBD
- **Funding:** TBD CC
- **Allocation Category:** Core implementation
- **Focus:** Preserve inspectable provenance and policy-controlled derivation across information products.
- **Deliverables / Value Metrics:**
  - provenance and evidence records linked to source observations and contribution identifiers
  - derivation examples retaining inputs, policies, methods, and evidence
  - documentation distinguishing provenance from verification and confidence
- **Acceptance Criteria:**
  - provenance remains linked through the tested lifecycle and demonstrated derivation flow
  - derived products identify their inputs, policies, methods, and evidence
  - claims such as supports or contradicts are not represented as proof by themselves

### Milestone 7: Controlled Disclosure and Reuse

- **Estimated Delivery:** TBD
- **Funding:** TBD CC
- **Allocation Category:** Core implementation
- **Focus:** Implement need-to-know disclosure and separately authorized reuse and derivative-use boundaries.
- **Deliverables / Value Metrics:**
  - normal stakeholder visibility and Explicit Contract Disclosure examples
  - policy-controlled disclosure, reuse, redistribution, and derivation examples
  - revocation and learned-information limitations documentation
- **Acceptance Criteria:**
  - disclosure and reuse are separately authorized and visibly bounded
  - tests reject unauthorized disclosure, reuse, and derivation
  - documentation states that revocation cannot erase information already learned

### Milestone 8: Confidence and Reward Eligibility

- **Estimated Delivery:** TBD
- **Funding:** TBD CC
- **Allocation Category:** Core implementation
- **Focus:** Implement policy-based confidence and governed reward-eligibility records without embedding token settlement.
- **Deliverables / Value Metrics:**
  - confidence update and aggregation examples with documented methods
  - reward-eligibility records based on versioned participation and reward policy
  - documented boundary to Canton Token Standards and settlement
- **Acceptance Criteria:**
  - confidence is policy-based and retains its evidence and method
  - reward eligibility is not an automatic settlement or truth guarantee
  - the reward flow is separate from token representation and transfer

### Milestone 9: Reusable UI Components

- **Estimated Delivery:** TBD
- **Funding:** TBD CC
- **Allocation Category:** Core implementation
- **Focus:** Deliver generic, independently runnable, and accessible UI components for the Veridica records and policies.
- **Deliverables / Value Metrics:**
  - reusable accessible components
  - UI views for provenance, verification, confidence, disclosure, reuse, and reward state
  - documented action discovery and authorized submission routes
- **Acceptance Criteria:**
  - the UI displays source provenance, verification method and outcome, confidence basis, disclosure scope, reuse limits, and reward state from authoritative contracts
  - action discovery does not grant authority and submissions use only documented authorized routes
  - accessibility expectations and supported UI behavior are documented and tested

### Milestone 10: Reference Participant Workflows

- **Estimated Delivery:** TBD
- **Funding:** TBD CC
- **Allocation Category:** Core implementation
- **Focus:** Compose reference contributor, aggregator, verifier, and consumer workflows using the shared primitives.
- **Deliverables / Value Metrics:**
  - governed contribution, verification, controlled reuse, and rewards reference workflows
  - participant workflow guidance and runnable demonstrations
  - role-party and execution-model terminology guidance
- **Acceptance Criteria:**
  - a reviewer can run the documented participant workflows end to end
  - contributor, aggregator, verifier, and consumer responsibilities remain distinct
  - the workflows preserve provenance, authorization, confidence, disclosure, reuse, and reward state

### Milestone 11: Development Fund Governance Demonstration

- **Estimated Delivery:** TBD
- **Funding:** TBD CC
- **Allocation Category:** Core implementation
- **Focus:** Demonstrate bounded CAP/Concordia-backed Development Fund governance workflows while preserving the CIP-0100 authority boundary.
- **Deliverables / Value Metrics:**
  - CAP/Concordia-backed UI demonstrations for a Development Fund proposal vote and milestone-acceptance decision
  - explicit CIP-0100 authority labeling and effectuation handoff documentation
  - proposal evidence, vote, threshold, outcome, and milestone-evidence views
- **Acceptance Criteria:**
  - the demonstration displays proposal evidence, votes, thresholds, outcome, and milestone evidence without describing itself as authoritative governance
  - tests and UI copy state that `DevelopmentFundCoupon` effectuation does not itself move CIP-0100 authority on-ledger
  - documentation identifies the approvals, CIP/process changes, identities, and implementation work required before authoritative on-ledger governance could be claimed

### Milestone 12: Integration, Accessibility, and End-to-End Evidence

- **Estimated Delivery:** TBD
- **Funding:** TBD CC
- **Allocation Category:** Core implementation
- **Focus:** Validate the integrated reference package, UI, participant workflows, governance demonstration, accessibility, and end-to-end evidence.
- **Deliverables / Value Metrics:**
  - integration, accessibility, and end-to-end test suites
  - reproducible build, test, and run documentation
  - public evidence package covering supported versions, limitations, privacy, security, and governance boundaries
  - all funded artifacts delivered in this milestone are publicly available under a **TBD** open-source license acceptable to the Foundation
- **Acceptance Criteria:**
  - a developer can clone, build, test, and run the documented reference workflows
  - supported Daml, SDK, UI, authorization, and integration tests pass
  - evidence demonstrates the integrated contribution, verification, provenance, confidence, disclosure, reuse, reward, and governance boundaries

### Milestone 13: Qualified Adoption and Ecosystem Reuse

- **Estimated Delivery:** TBD
- **Funding:** TBD CC
- **Allocation Category:** Measurable adoption
- **Focus:** Demonstrate qualified adoption and measurable reuse across two materially different workflow domains, including substantive internal Unlockit use as the intended implementation path and, additionally, external independent adoption where available.
- **Deliverables / Value Metrics:**
  - at least one qualified internal Unlockit use or qualified external independent team completes a reproducible technical evaluation, pilot, or integration using the delivered Veridica artifacts
  - a **TBD** bounded number of additional qualified internal uses or external independent pilots or production integrations
  - use across at least two materially different workflow domains in total
  - adopter-provided confirmation and a public or committee-reviewable evidence package
  - public adoption report covering reusable interfaces, integration effort, limitations, maintained versions, and observed improvements
  - technical walkthrough and adopter guidance incorporating observed integration needs
- **Acceptance Criteria:**
  - the Tech & Ops Committee receives evidence that each counted internal or external adopter ran the software and substantively exercised the delivered Veridica artifacts, including contribution, verification, provenance, and controlled disclosure or reuse as applicable
  - each counted adoption supplies evidence of a reproducible running pilot or production integration and substantive reuse of identified Veridica interfaces and tested versions
  - internal Unlockit use counts when it satisfies these evidence requirements; software development alone, an internal demo, endorsement, letter of intent, meeting, prospective adopter, unexecuted agreement, or unexecuted plan does not satisfy the milestone
  - duplicate deployments by the same controlling organization do not count as separate adoptions unless the Committee approves a documented reason
  - any confidential evidence route is agreed with the Committee before acceptance and still demonstrates substantive use, contribution, verification, provenance, and controlled disclosure or reuse as applicable
  - the Committee accepts the bounded adoption count, evidence method, and per-adoption funding arithmetic before final proposal approval

### Scale Forecast: Real-Estate Use Cases

One real-estate contributor may generate hundreds of thousands of price data points in a 10M-person country, and the model could scale to millions of records across markets. These are capacity and adoption forecasts, not delivery guarantees, adoption guarantees, acceptance criteria, or a funding basis unless later bounded and evidenced.

---

## Acceptance Criteria

The Tech & Ops Committee will evaluate completion against the milestone-specific criteria and linked evidence. Project-wide acceptance requires:

- a developer can clone, build, test, and run the documented reference workflows
- Daml, SDK, UI, authorization, and integration tests pass for supported versions
- independent verification is performed by a role distinct from the contributor in the reference flow
- provenance and confidence retain their source and method through the tested lifecycle
- disclosure and reuse are separately authorized and visibly bounded
- rewards remain policy-controlled and separate from token settlement
- CAPS and CAP terminology is used consistently and their interfaces are not conflated
- the Development Fund governance demonstration preserves the CIP-0100 off-ledger authority boundary
- strictly more than 50% of requested allocation is assigned to accepted, measurable adoption milestones, with adoption funding separate from core implementation
- all claimed adoption is supported by defined evidence rather than endorsements or intentions
- public documentation states limitations, privacy assumptions, governance boundaries, security considerations, and supported interface versions

---

## Funding

**Total Funding Request:** TBD CC
**Core Implementation Allocation:** TBD CC and TBD%, constrained to less than 50% of the total request
**Measurable Adoption Allocation:** TBD CC and TBD%, constrained to strictly more than 50% of the total request

### Payment Breakdown by Milestone

- Milestone 1 _(Architecture, Scope, and Threat Model)_: TBD CC upon committee acceptance
- Milestone 2 _(Versioned Daml Interfaces)_: TBD CC upon committee acceptance
- Milestone 3 _(Executable Reference Package)_: TBD CC upon committee acceptance
- Milestone 4 _(SDK Clients, Fixtures, and Policy Adapters)_: TBD CC upon committee acceptance
- Milestone 5 _(Lifecycle and Authorization Controls)_: TBD CC upon committee acceptance
- Milestone 6 _(Provenance and Derivation)_: TBD CC upon committee acceptance
- Milestone 7 _(Controlled Disclosure and Reuse)_: TBD CC upon committee acceptance
- Milestone 8 _(Confidence and Reward Eligibility)_: TBD CC upon committee acceptance
- Milestone 9 _(Reusable UI Components)_: TBD CC upon committee acceptance
- Milestone 10 _(Reference Participant Workflows)_: TBD CC upon committee acceptance
- Milestone 11 _(Development Fund Governance Demonstration)_: TBD CC upon committee acceptance
- Milestone 12 _(Integration, Accessibility, and End-to-End Evidence)_: TBD CC upon committee acceptance
- Milestone 13 _(Qualified Adoption and Ecosystem Reuse)_: TBD CC upon committee acceptance of adoption evidence

No funding arithmetic is final in this draft. Before submission, milestone amounts must sum exactly to the total request, core implementation must remain below 50%, and measurable adoption must remain strictly above 50%. Adoption funding is earned only for accepted evidence and cannot be reclassified as core implementation without an approved proposal change that preserves the strictly-more-than-50% adoption requirement.

### Volatility Stipulation

The schedule is TBD. If any milestone is expected six months or more in the future, the final proposal must specify a prospective CC volatility treatment approved by the Tech & Ops Committee. This draft creates no automatic repricing, top-up, or payment right.

### Funding Locking

Unlockit will retain at least 25% of the funding received for core implementation milestones M1-M12 through the full grant period, and at least 50% of adoption-linked funding received for M13 for one additional year after grant closure. Unlockit may retain more than these minimum amounts. This is a funding-retention commitment, not escrow, third-party custody, or on-ledger locking.

For this commitment, the grant period runs from approval/start through final milestone closure; grant closure follows final milestone acceptance.

---

## Co-Marketing

Subject to Foundation agreement, Unlockit proposes a public technical walkthrough, architecture article, independently runnable demonstration, and publication of accepted adoption evidence. Exact commitments are TBD. Commercial Unlockit marketing remains outside the shared implementation scope.

---

## Motivation

Canton applications can benefit from a shared layer between raw data and downstream decisions. A provenance record without independent verification may be insufficient; verification without disclosure controls may reveal too much; access without reuse policy may leave downstream rights unclear; and a reward mechanism without governed evidence may reward volume rather than utility.

Veridica addresses these concerns as composable primitives rather than one vertical data marketplace. Its common-good value is measured by qualified, substantively evidenced reuse, including internal implementation use and external reuse where available. For that reason, strictly more than half of requested funding is reserved for measurable adoption rather than delivery alone.

CAPS provides relevant and constructive groundwork for selective access and signed records. Veridica broadens the application model around that work, while CAP/Concordia provides potentially reusable governance and allocation mechanics. Keeping those projects distinct makes their composition reviewable and avoids turning any one interface into an unsupported universal standard.

---

## Rationale

**Why separate contribution, verification, and confidence.** A contributor supplies an assertion; a verifier records an independently accountable assessment; a policy interprets evidence into a confidence state. Separate contracts and interfaces preserve who said what and why.

**Why separate disclosure from reuse.** Seeing data for one purpose does not necessarily authorize redistribution, derivation, or monetization. Explicit grants make those boundaries inspectable while acknowledging that ledger revocation cannot erase information already learned.

**Why separate reward eligibility records from settlement.** Contribution, matching, aggregation, and Verification policies can provide inputs to eligibility and priced-use reward allocation. The active priced-use flow allocates the locked Consumer token and atomically settles with delivery, while existing Canton Token Standards remain responsible for asset representation and transfer.

**Why demonstrate CAP/Concordia governance.** Proposal and milestone decisions are useful proving workflows for evidence-backed governance UI. The demonstration can test reusable decision and allocation mechanics while accurately preserving current CIP-0100 authority and the distinction between governance and effectuation.

**Why weight funding toward adoption.** Public code publication alone does not demonstrate ecosystem utility. Qualified, evidenced reuse, including external reuse where available, tests whether the interfaces are understandable, portable, and valuable in practice.

---

## Governance and Open Questions

Material changes to scope, funding, adoption evidence, licensing, or governance claims require the applicable Development Fund approval process.

Open questions before submission:

- What total CC funding and milestone amounts are proportionate to the final bounded scope?
- What delivery and adoption schedule should apply?
- Who, if anyone, will champion the proposal?
- Which open-source license will the Foundation accept for all funded artifacts?
- Which CAPS interfaces from PR #497 will be stable and reusable, and how should compatibility be tested?
- Which CAP/Concordia interfaces should govern decisions or reward allocations, and which remain reference-only?
- Which confidence methods and verifier independence criteria should the first release support?
- What disclosure, revocation, retention, and derivative-use semantics can be represented accurately across off-ledger data stores?
- What bounded adopter count, evidence standard, confidentiality route, and per-adoption amount should Milestone 13 use?
- What Foundation approvals, CIP/process changes, identities, signatures, and canonical submission routes would be required for authoritative on-ledger Development Fund governance?
- What maintenance period, supported versions, security disclosure process, and succession plan should apply?
- How should the operator-versus-role separation be reconciled with the new 03a Aggregator and 03b Verifier mutually-exclusive clause, and with the Veridica Platform chassis owning admission, role assignment, suspension, removal, and credential rotation? In particular, the Execution Model may use a distributed M-of-N operator-party arrangement, a single execution party, a DecMan-backed Canton Decentralized Party, or a compatible future model; the 03a Aggregator and 03b Verifier role-party pools are independent of the Execution Model and the same Party cannot be both an aggregator and a verifier for the same product, but the operator/role terminology overlap across Concordia, the Execution Model, and the participant-lifecycle role-party pools still needs an explicit glossary and governance test before submission.

---

## Related Projects and Standards

| Project or standard | Proposal / PR | Repository / source | Relationship to Veridica | Boundary / alignment |
| --- | --- | --- | --- | --- |
| RedStone CAPS | [PR #497](https://github.com/canton-foundation/canton-dev-fund/pull/497) (proposal; approval state not stated) | N/A | Potentially complementary access, privacy, lineage, and privacy-preserving push-oracle patterns. | Optional composition only. No endorsement, dependency, or compatibility claim; interfaces, versions, and tests require validation. |
| Kaiko Data Standard (CDS) | [Dev Fund PR #113](https://github.com/canton-foundation/canton-dev-fund/pull/113) (merged); [CDS PR #14](https://github.com/kaikodata/canton-data-standard/pull/14) (open; review-only, not adopted) | [canton-data-standard repository](https://github.com/kaikodata/canton-data-standard) | Potential reuse for typed datapoints, schema versioning, distributor identity, signatures, and verification audit records. Veridica would assess a version-pinned adapter or import-export boundary, map its Information Standards, Contribution, and Evidence records to selected CDS interfaces, and validate schema/version, signature/audit semantics, and compatibility through tests. | No compatibility or implementation claim. Veridica should not duplicate CDS data-publication or audit primitives; it retains contribution correction/supersession, aggregation, confidence, access/reuse, governance, and reward allocation. CDS PR #14 is not a dependency. |
| Concordia | N/A | [Concordia repository](https://github.com/unlockitio/concordia) | Possible reuse of Canton Allocation Primitives (CAP) for governed decisions, allocations, reward routing, and settlement handoffs. | CAP is distinct from CAPS and is not a complete Veridica evidence, pricing, or reward implementation. |
| CIP-0100 | N/A | [CIP-0100](https://github.com/canton-foundation/cips/blob/main/cip-0100/cip-0100.md) (Active) | Defines Development Fund governance and implementation mechanics relevant to the demonstration boundary. | The demonstration preserves Development Fund authority and does not import CIP governance into the Veridica runtime. |
| Canton Network Splice | N/A | [Canton Network Splice repository](https://github.com/canton-network/splice) | Possible reference for Development Fund effectuation contracts and related infrastructure. | Exact supported interfaces remain unresolved and require validation. |
| Canton Token Standards | N/A | N/A | Potential asset representation and transfer layer outside Veridica records. | Settlement remains outside Veridica; no implementation claim is made. |
| PagFinance Fiat Connector | N/A | [PagFinance Fiat Connector](https://github.com/PagFinance/pagfinance-canton-network/blob/main/pagfinance-fiat-connector.md) | Open-source reference connector for Canton Token Standard/CIP-56 fiat on/off-ramp flows including escrow coordination, external rail confirmation, settlement, expiry, and reconciliation. | Reference only; no claimed integration, dependency, compatibility, or adoption. |
| Daml Explicit Contract Disclosure | N/A | N/A | Supports the command-specific disclosure path. | No documentation or version claim is made without source evidence. |
| DecMan / Canton Decentralized Party | N/A | N/A | Optional execution-model choice. | No dependency, requirement, version, or integration claim is made. |

These references identify possible composition points. They do not represent adopter commitments, endorsements, approved governance changes, or guaranteed interface compatibility.

## Maintenance

Unlockit will maintain this work throughout the grant period. After grant finalization, continued maintenance is tied to Unlockit's continued product use in the Real Estate vertical, where governance and allocation problems are foreseen or already applicable. Unlockit is open to maintaining the work jointly with other interested stakeholders. This does not commit to a fixed post-grant duration, SLA, staffing level, funding, or roadmap.
