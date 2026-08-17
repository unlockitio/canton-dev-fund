## Development Fund Proposal

**Author:** Unlockit (luis.marado@unlockit.io)
**Status:** Draft
**Created:** TBD
**Champion:** TBD

> This draft is provided for discussion. It does not create a funding, delivery, governance, adoption, endorsement, or Foundation commitment.

---

## Abstract

Veridica evolves conventional oracles from relying mainly on trusted third-party providers toward stronger, inspectable confidence in information. One or more contributors can provide information and evidence, and independent verifiers can check it when appropriate. Validation rules, supporting evidence, challenges, and past checks help applications assess confidence without treating a provider, a contract, or the ledger as a guarantee of truth.

Selective disclosure and controlled reuse are central to Veridica. It manages access and permitted use on a need-to-know basis through two complementary paths. Under normal Canton contract visibility, stakeholders see contract data, while participant or validator nodes host parties and retain and synchronize contract data according to those parties’ stakeholder visibility. When a non-stakeholder needs a contract for a specific workflow, a stakeholder can send an authenticated contract copy off-ledger for attachment to that workflow’s command. This permits workflow use without making the recipient a stakeholder, adding the contract to its normal visible contract set, or changing Daml authorization.

A traceable history shows how information was submitted, checked, corrected or replaced, shared, and used while retaining previous versions, evidence, checks, and reasons. Each application can choose acceptance thresholds based on its purpose and risk. Policies can control who may access, verify, use, or further share information and can allocate rewards to eligible contributors and verifiers based on the information and validation work the application recognizes.

---

## Specification

### 1. Objective

Veridica’s objective is to provide shared Canton application primitives for information that can be contributed, checked, used on a need-to-know basis, and rewarded. It aims to move oracle use beyond relying mainly on a provider’s reputation toward confidence that applications can assess from evidence, validation, independent checks, and history.

Veridica must enable applications to:

- accept information and supporting evidence from one or more contributors
- apply clear validation rules and, when appropriate, record checks by independent verifiers
- preserve evidence, challenges, corrections, previous versions, and the reasons for changes
- control selective disclosure and permitted use through normal Canton stakeholder visibility or Daml Explicit Contract Disclosure, without weakening Daml authorization
- set acceptance rules and confidence thresholds suited to each application’s purpose and risk
- trace how accepted information and verification work lead to policy-approved reward allocations for eligible contributors and verifiers
- reuse common, provider-neutral primitives across different applications instead of depending on one provider-specific product

Success means an independent Canton team can use the shared primitives to build a workflow in which information is contributed, assessed, selectively used, updated with its history intact, and connected to an authorized reward decision. Veridica does not guarantee truth or data quality, make rewards automatic, or replace the governance and authorization rules chosen by each application.

### 2. Implementation Mechanics

Veridica will provide reusable Daml contracts, interfaces, application components, and reference flows. Its model will use composable contracts and linked records with separate responsibilities rather than one contract that represents the whole system. The exact contract, package, and interface decomposition will be validated during implementation.

#### Governed identifiers, standards, and policies

Each sharing context will use named and versioned configuration maintained by an operator, consortium, governed service, or another authorized authority. The configuration may include:

- an **Identifier Scheme** defining how subjects and submissions are identified
- an **Information Standard** defining fields, units, formats, and required metadata
- an **Observation Key Policy** defining which fields identify the same contextual observation
- a **Matching Policy** defining exact and semantic comparison, eligible matchers, tolerances, and review routes
- an **Aggregation Policy** defining eligible inputs, normalization, calculation, publication, pricing, and reward rules

An **Observation Key** identifies a contextual observation that related contributions may describe. A **Contribution ID** uniquely identifies each submission. Contributions with the same Observation Key remain separate records with separate contributors, evidence, checks, permissions, and histories.

Observation Keys are domain-specific. The following compact examples are illustrative, not universal requirements:

| Example | Illustrative Observation Key fields |
|---|---|
| Equity price | Instrument ticker or stronger governed identifier + market + metric + currency + observation date + adjustment basis |
| Real-estate valuation | Jurisdiction + property identifier + metric + effective date + currency + valuation basis |

A policy may require stronger identifiers, finer timestamps, source categories, or other context. Changes to a scheme, standard, or policy create a new version so applications can identify exactly which rules were used.

#### Composable information, evidence, and decision records

An information or assertion contract will contain submitted information or a reference to a document or dataset held elsewhere. It will carry its Contribution ID, identify one or more sources or contributors, declare the governed Information Standard and version, state its Observation Key under the applicable policy, and reference the configuration governing its sharing context.

A contribution may contain one record or a batch. Every contribution declares its standard and version, and every record remains independently identifiable, matchable, validatable, and traceable. A submission using multiple standards must place records in explicit standard groups or use separate batches. A batch is only a submission container; it is distinct from an aggregate information product calculated from selected inputs.

Separate provenance and evidence records will link a contribution to sources, supporting documents, transformations, and earlier versions. Validation and verification records will identify the contribution and record checked, method used, evidence considered, result, limitations, responsible party, and declared conflicts. Lifecycle or decision records may separately record whether a version is pending, accepted, rejected, disputed, expired, corrected, or replaced. Usage, reuse, reward-eligibility, and allocation records will remain separate and linked.

Information may also relate explicitly to an earlier contribution through `supports`, `contradicts`, `corrects`, `replaces`, `enriches`, `derives_from`, or `duplicates`. These relations are claims, not proof. They remain subject to matching, validation, verification, and challenge, and they preserve the history of both records.

The ledger will hold contracts and state needed by the workflow. Larger documents or sensitive evidence may remain off-ledger and be delivered through an authorized channel. A ledger reference records their relationship to a contribution but does not by itself prove that the referenced material is correct, available, or unchanged.

#### Discovery, matching, validation, and confidence

A privacy-safe discovery or catalog record may signal that information exists for a governed subject and type without exposing protected values, evidence, unnecessary contributor identity, or contributor counts. Policies may also support optional invitations for eligible contributors and verifiers.

A matching engine or authorized matcher first applies a named and versioned Matching Policy. **Exact matching** compares governed Observation Key fields directly. **Semantic matching** applies stated normalization, mappings, tolerances, or contextual rules. Outcomes are matched, ambiguous and sent for manual review, or not matched. Matching only decides whether records may be compared; it does not prove truth, quality, agreement, or independence.

Only matched and comparable records proceed to comparison. A comparison may conclude that records corroborate, contradict, remain incomparable, or provide insufficient evidence. Independent submissions against the same Observation Key and explicit relations to prior contributions are both supported. An extra or duplicate contribution does not validate another record merely because it exists.

Applications select validation rules and eligible independent verifiers through their policy. Where independence is required, a contributor cannot verify its own contribution. Conflict and role rules apply to matchers, verifiers, aggregators, and adjudicators. Verifiers may attest, request evidence, or raise a challenge. Corrections and replacements retain prior versions, checks, evidence, challenges, and reasons.

Confidence is policy-based, not a raw vote or contribution count. It may consider evidence quality, method, operator and verifier independence, recency, unresolved disputes, corroboration, contradiction, and possible duplicate, Sybil, or collusive behavior. Each application chooses the policies, operators, verifiers, confidence measures, and acceptance thresholds it recognizes for its purpose and risk.

#### Aggregation and information products

An aggregation pipeline creates a distinct information product from eligible source records. It will identify authorized inputs, normalize them under a named and versioned Information Standard and Aggregation Policy, handle outliers and missing data, apply recency rules, require any minimum number of independent inputs, and record supporting confidence and evidence.

Publication controls define who may receive or use the aggregate product. Pricing and licensing rules apply independently to the aggregate and its source records. Reward rules may recognize eligible contribution, matching, verification, aggregation, or adjudication work. Every aggregate remains traceable to the input versions, policies, methods, decisions, and evidence used to create it.

An application may offer only aggregate products without selling or exposing source contributions, subject to the applicable permissions. This does not make aggregation a truth guarantee, and a minimum input count does not replace quality, independence, or conflict checks.

#### Need-to-know access and controlled reuse

Veridica will support two complementary Canton visibility paths across its contracts and records. Under normal Daml stakeholder or observer visibility, relevant parties see contract data and their participant nodes retain and synchronize the contract data those parties are entitled to see. For command-specific use by a non-stakeholder, a stakeholder may send an authenticated contract copy through an off-ledger channel using Daml Explicit Contract Disclosure. The recipient can attach that copy to a command, and the ledger validates it during transaction processing. This relaxes visibility for that command; it does not add the contract to the recipient's normal visible contract set or change Daml authorization.

Policies state who may receive information or evidence, for which purpose it may be used, whether it may be shared or reused, and when permission expires. Separate usage and reuse records link an authorized workflow to the source or aggregate product, policy, permission, and version used. Revocation cannot make a party forget information already received.

Where compatible interfaces become available, Veridica may interoperate with privacy and lineage primitives proposed by [CAPS in PR #497](https://github.com/canton-foundation/canton-dev-fund/pull/497). This is optional composition subject to interface review and tests, not a dependency on that proposal being approved.

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
6. validation, independent verification, challenges, and application policy produce a confidence assessment and lifecycle decision
7. an authorized application either uses an accepted record directly or creates and uses a traceable aggregate product
8. normal Daml visibility or Explicit Contract Disclosure supplies the contract input needed for the authorized workflow
9. pricing and licensing are applied, usage is recorded, and recognized work may produce eligibility for an authorized reward-allocation decision
10. corrections, replacements, challenges, and expiry feed back into later decisions while preserving history

At proposal level, controls include role and conflict policies, duplicate and replay handling, stale and archived-state handling for disclosed contracts, explicit expiry, separation of duties where required, and an audit trail linking material actions to actors, policies, evidence, and prior state.

#### Consortium authority, execution, and hosting models

Veridica separates four concerns that implementations must not collapse:

- **Governance authority** is the consortium body entitled to adopt governance policy and authorize bounded changes.
- **Governor** receives committed Governance Proposals and distributes each Governance Proposal + Ballot Request to every policy-defined relevant stakeholder. The Governor is a separate logical role, not the source of governance authority.
- **Resolver** performs `Governor Resolve` when accepted by `Resolution.isResolver`, evaluating all live Ballots under the active governance policy. Resolution atomically performs `admit → tally → Verdict`, issues a `GovernanceOutcome` only for `VApproved`, and then invokes `onResolved`. Resolver is a separate logical role.
- **Execution Model and execution identity** define which Daml party or parties may carry out an authorized outcome, under which versioned controls. The executor set is a separate logical role from Governor and Resolver. Governor and Resolver may be assigned to the same Party or configuration, but that assignment neither merges roles nor changes the governance workflow.
- **Participant hosting or custody** determines where those parties are hosted and how keys or operational control are held. Hosting or custody does not itself grant governance authority, Governor status, or business authorization.

Consortium formation is a one-time bootstrap process. The Consortium Lead acts as Genesis **Proposer** and commits the closed immutable Candidate electorate when proposing the Consortium. 01A intentionally scopes only to that formation trigger and the visible execution-identity prerequisite; it does not represent all current policy decisions.

Only `VApproved` finalization establishes the selected Genesis Governor or Resolver and versioned active Execution Model from the approved proposal and Initial Charter definitions. `VRejected` and `VExpired` establish neither. The selected model may be a distributed M-of-N operator-party arrangement, a single execution party controlled by a consortium legal entity, an optional DecMan-backed Canton Decentralized Party using supported open-source components, or a compatible future model. DecMan and Canton Decentralized Party are options, not requirements. DecMan supplies an execution mechanism, not the business policy engine; the approved proposal and charter definitions determine business authorization.

After genesis, reusable consortium governance follows CAP terminology and mechanics: a **Proposer** eligible under the active governance policy opens a Governor/decision carrying its `Action`, commitments, and submission/expiry window; eligible voters cast all live **Ballots** through `Ballot_Cast`; and a resolver accepted by `Resolution.isResolver` invokes atomic **Governor Resolve**. Resolution performs `admit → tally → Verdict`, issues a **GovernanceOutcome** only for `VApproved`, and invokes `onResolved`. `VRejected` and `VLapsed` end without a GovernanceOutcome and cannot reach **GovernanceOutcome Execute**. Operators are likely eligible under the initial policy but are not hard-coded as the only Proposers, and the Execution Model does not determine proposer eligibility. Policy, reward, membership, rules, execution-model, and other supported changes are Proposal `Action` types rather than separate setup workflows.

For a consortium action, proposal opening creates the Governor/decision and records `submissionOpensAt`, `submissionClosesAt`, and `expiresAt`. It carries the exact `Action (AA_Native | AA_Extension) — policy / rewards / membership / rules / execution-model` and records `Committed Targets` as `ForTarget (authorities + id) + optional stateToken` through `Action_buildRefs`. Before resolve, the proposer may use `Governor_Withdraw` only when `withdrawAllowed`; Ballot recast, when supported, is another `Ballot_Cast` before resolve. A revised proposal starts a new Governor and decision cycle rather than looping or resubmitting in the current cycle. `GovernanceOutcome Execute` takes the Committed Targets and active Execution Model as inputs, checks the execute window, `isExecutor(actors)`, and committed-target key match, then applies the declared drift policy and effect. The active Execution Model is read only at execution as the executor set and does not gate proposer eligibility or proposal opening. An execution-model proposal acts on `ExecutionModel` as a Committed Target; it does not produce the model as generic output. Rejected or lapsed decisions issue no outcome and never execute; an approved outcome may also expire unexecuted through `Outcome_Expire` when `executeUntil` applies. Execution records Mutated Targets and a Veridica audit receipt.

Reward governance is separate from governance voting weight. Macro rules may divide an approved reward amount into **X% for contributors, Y% for verifiers, and Z% for operators**, with any additional eligible roles explicitly defined. The policy must validate that all pools total 100%. Within each pool, micro allocation may use eligible credentials, role, recognized activity, quality, or other governed weights. Governance weights do not automatically become reward weights. Optional Concordia/CAP allocation or settlement interfaces may be used where validated interfaces fit; a non-CAP allocation path remains supported.

#### BPMN Workflow Index

The BPMN models use pools and lanes only for real actors. Contracts, policies, credentials, proposals, approvals, Governor mechanisms, and records appear as data used or produced by actor tasks. Sequence flows model lifecycle order within a process; message flows connect separate participant processes when the workflow uses multiple pools.

| Workflow | GitHub view | Canonical BPMN 2.0 source | Purpose |
|---|---|---|---|
| 01A. Consortium formation and genesis election | [SVG](assets/01a-veridica-consortium-formation.svg) | [BPMN](assets/01a-veridica-consortium-formation.bpmn) | Forms the Consortium through a genesis election: first complete any required Party setup, then propose the Consortium by defining the proposal details and committing the fixed Candidate electorate, deliver the proposal and ballot request, collect Candidate ballots, then resolve the outcome. |
| 01B. Consortium governance | [SVG](assets/01b-veridica-consortium-governance.svg) | [BPMN](assets/01b-veridica-consortium-governance.bpmn) | Runs reusable CAP governance from policy-derived proposer eligibility and live Ballots through atomic resolution; only approved outcomes may execute using the active Execution Model as the executor set. |
| 2. Ongoing Veridica participant lifecycle | [SVG](assets/02-veridica-participant-lifecycle.svg) | [BPMN](assets/02-veridica-participant-lifecycle.bpmn) | The Veridica Platform chassis governs admission, role assignment, suspension, removal, and credential rotation for each role party. Candidate participants apply or respond to invitations. Role-party pool instances are instantiated by role-binding authorization issued by 01B governance; cross-pool delivery from the Veridica Platform is modeled as intermediate message catch events; one boundary message catch handles governance-mandated interruption. |
| 02A. Contributor actions | [SVG](assets/02a-veridica-contributor-actions.svg) | [BPMN](assets/02a-veridica-contributor-actions.bpmn) | The Contributor Party (multiplicity 1..999) starts on Contributor_Authorized issued by the 02 chassis after admission. The contributor selects standard version and Observation Key policy, submits a contribution (Contribution_Submit), and responds to Evidence_Request, Challenge, or Correction through one task that handles both initial and correction responses via the contract version of the submission. |
| 02B. Aggregator actions | [SVG](assets/02b-veridica-aggregator-actions.svg) | [BPMN](assets/02b-veridica-aggregator-actions.bpmn) | The Aggregator Party (multiplicity 1..999) starts on Aggregator_Authorized. It publishes the privacy-safe availability record, applies exact or semantic matching, does manual review, invites the 02c verifier (mutually exclusive role), assesses confidence, selects eligible authorized input versions from input Contributors (multiplicity 1..999), normalizes under a named versioned method, handles outliers, calculates aggregate confidence and traceability, excludes or revises, waits for Review_Complete or Correction_Received from the 02c verifier, and publishes the aggregate. No message flow reaches 06. |
| 02C. Verifier actions | [SVG](assets/02c-veridica-verifier-actions.svg) | [BPMN](assets/02c-veridica-verifier-actions.bpmn) | The Verifier Party (multiplicity 1..999, mutually exclusive with 02B aggregator) starts on Verifier_Authorized. It waits via an event-based gateway for Evidence_Resubmitted (from 02A contributor) or Verification_Request (from 02B aggregator), then either checks evidence and attests with limitations or challenges, or validates method and aggregate-attestation attests with limitations or challenges method or input. |
| 02D. Consumer actions | [SVG](assets/02d-veridica-consumer-actions.svg) | [BPMN](assets/02d-veridica-consumer-actions.bpmn) | The Consumer Party (single instance) starts on Consumer_Authorized. The consumer discovers the privacy-safe catalog (published by Contributor or Product Publisher, multiplicity 1..999), selects a direct or aggregate product, submits credential, purpose, and access request, then routes through the AC_C_Result and AC_C_Path presentation-layer exclusive gateways. |
| 6. Reward allocation | [SVG](assets/06-veridica-reward-allocation.svg) | [BPMN](assets/06-veridica-reward-allocation.bpmn) | Actors validate macro pools and micro weights before optional CAP or baseline effectuation and audited receipts. |

"Open" discovery or registration means that parties can find the process and apply. Formal roles, workflow actions, and information access remain subject to credentials, election or approval, policy, and Daml authorization.

#### 01A. Consortium Formation and Genesis Election

The **Consortium Lead** is the Genesis **Proposer**. The sequence is: Start; decide whether the execution identity requires Party setup; either create or register the required DecMan Governor Party or single Consortium Party, or use the committed Proposer + Candidate Party set; then **Propose Consortium**. The one substantive **Propose Consortium** task uses the Party Setup result to define and commit the selected execution identity/model, configured decision-policy fields, and fixed, closed Candidate electorate.

After proposing, the Proposer sends the Genesis Proposal and Ballot Request to every fixed Candidate. Each Candidate individually submits its ballot to the Genesis Resolver. The Genesis Resolver evaluates and resolves the genesis election, ending in **Consortium formed**, **VRejected**, or **VExpired**. Candidate membership, privacy, deadlines, rejection, and replacement remain configured in the proposal rather than being represented as branch machinery.

![01A. Veridica consortium formation and genesis election BPMN](assets/01a-veridica-consortium-formation.svg)

Canonical source: [01A Veridica consortium formation and genesis election BPMN 2.0](assets/01a-veridica-consortium-formation.bpmn).

#### 01B. Consortium Governance

Each reusable governance cycle derives Proposer eligibility from the **active governance policy**; operators are likely eligible initially, but eligibility remains configurable and is not read from the Execution Model. The Proposer validates capacity, defines Governance Proposal details carrying its Action, commitments, and submission/expiry window, commits it, and delivers the committed proposal to the Governor. The Governor receives the committed proposal as an intermediate message catch event, reviews it, then either distributes the Governance Proposal + Ballot Request to every policy-defined relevant stakeholder or ends that proposal and sends a revision request. A revision request starts a distinct Proposer message-start process that validates capacity, defines, commits, and delivers a **new** Governance Proposal cycle. It is not a sequence-flow loop or a reopened ballot.

Every cross-pool receipt is modeled as an intermediate message catch event. Each Relevant Stakeholder pool instance receives the Governance Proposal + Ballot Request and submits its own Ballot through `Ballot_Cast` to the Resolver. The Resolver receives stakeholder ballots, evaluates and atomically resolves the Governance Proposal: `admit → tally → Verdict; issue only VApproved; onResolved`. The `Verdict?` branch creates a GovernanceOutcome and notifies the Executor set only for `VApproved`; `VRejected` and `VLapsed` terminate with no outcome and no execution. While Governor review is pending, the Proposer may send `Governor_Withdraw`; its message interrupts that review and ends the proposal. GovernanceOutcome Execute is performed by the executor set. It receives the approved outcome, validates executable outcome using the active Execution Model and Committed Targets only at execution, then routes to execution or expiry. Execution checks the execute window, `isExecutor(actors)`, and committed-target key match before applying the declared drift policy and effect. It records Mutated Targets and a Veridica audit receipt.

Governor, Resolver, and Executor remain separate logical roles. They may be assigned to the same Party or configuration, but the BPMN does not merge, fix, default, or branch on that assignment. A Governor single Party/set and DecMan-managed/non-DecMan remain configuration choices, not BPMN branches.

Policies, rewards, membership, rules, execution-model updates, and compatible future changes are Proposal action types. They are not separate governance/reward setup phases. CAP supplies the governance vocabulary and proposal-resolution mechanics; DecMan or a Canton Decentralized Party may supply an execution option but is not the business policy engine.

![01B. Veridica consortium governance BPMN](assets/01b-veridica-consortium-governance.svg)

Canonical source: [01B Veridica consortium governance BPMN 2.0](assets/01b-veridica-consortium-governance.bpmn).

The dependency is: **01A forms the Consortium through its genesis election → 01B governs reusable consortium decisions after formation**. 01A uses only the fixed genesis Candidate electorate; 01B does not replace or broaden that formation election.

#### 2. Ongoing Veridica Participant Lifecycle

The reusable 01B consortium governance process owns future participant onboarding and lifecycle decisions. Consortium members propose and approve admission, role assignment, suspension, removal, and credential or key rotation. Candidate participants apply or respond to invitations and supply credentials and conflict disclosures. Rejected, expired, challenged, revoked, or insufficient-quorum proposals produce no execution authority. The Veridica Platform pool owns the chassis that executes those governance decisions across the Contributor, Aggregator, Verifier, and Consumer role-party pools. Each role-party pool instance is instantiated by a role-binding authorization issued by 01B governance; cross-pool delivery from the Veridica Platform is modeled as intermediate message catch events, and one boundary message catch handles governance-mandated interruption (suspension, rotation, decommission). The 02B Aggregator and 02C Verifier are mutually exclusive roles: the same Party cannot be both an aggregator and a verifier for the same product. The downstream 06 reward-allocation workflow is independent of the participant lifecycle: it consumes the versioned participation and reward policy that the participant lifecycle records produce and does not redefine it.

The active Execution Model may use distributed M-of-N operator-party execution, a single execution party controlled by a consortium entity, a DecMan-backed Canton Decentralized Party, or a compatible future model. Governance authority, the Governor or resolver, execution identity, and participant hosting or custody remain distinct. A Daml party does not intrinsically contain member identities. Participant hosting or custody is an operational and topology concern described by policy and audit records, not a substitute for member approval or execution authorization.

![2. Veridica participant lifecycle BPMN](assets/02-veridica-participant-lifecycle.svg)

##### 2.1 Contributor Actions

The Contributor Party (multiplicity 1..999) starts on Contributor_Authorized issued by the 02 chassis after admission. The contributor selects the standard version and Observation Key policy, submits a contribution (Contribution_Submit to the Veridica Platform), then waits via an event-based gateway for Evidence_Request, Challenge, or Correction. A single respond task handles both initial and correction responses via the contract version of the submission it receives; no exclusive gateway branches initial versus correction. One boundary message catch handles governance suspension or rotation arriving mid-submission.

![2A. Veridica contributor actions BPMN](assets/02a-veridica-contributor-actions.svg)

##### 2.2 Aggregator Actions

The Aggregator Party (multiplicity 1..999) starts on Aggregator_Authorized. The aggregator publishes the privacy-safe availability record, applies exact or semantic matching, does manual review, invites the eligible 02C Verifier (mutually exclusive role), assesses confidence, selects eligible authorized input versions from input Contributors (multiplicity 1..999), normalizes under a named versioned method, handles outliers and missing data, calculates aggregate confidence and traceability, excludes or revises, waits via an event-based gateway for Review_Complete or Correction_Received from the 02C Verifier, and publishes the aggregate under access, pricing, and licensing controls. Message flows that would otherwise call a verifier pool direct exclusively to the 02C Verifier Party pool. No message flow reaches 06 reward allocation or Process_AllocationEffector.

![2B. Veridica aggregator actions BPMN](assets/02b-veridica-aggregator-actions.svg)

##### 2.3 Verifier Actions

The Verifier Party (multiplicity 1..999, mutually exclusive with 02B aggregator) starts on Verifier_Authorized. The verifier waits via an event-based gateway for Evidence_Resubmitted (from 02A contributor) or Verification_Request (from 02B aggregator), then either checks evidence (validation rules, independence, and conflicts) and attests with limitations or challenges, or validates the method (inputs, independence, evidence, and confidence) and aggregate-attestation attests with limitations or aggregate-attestation challenges the method or input. One boundary message catch handles governance suspension mid-verification.

![2C. Veridica verifier actions BPMN](assets/02c-veridica-verifier-actions.svg)

##### 2.4 Consumer Actions

The Consumer Party (single instance) starts on Consumer_Authorized. The consumer discovers the privacy-safe catalog (published by the Contributor or Product Publisher, multiplicity 1..999), selects a direct or aggregate product, submits credential, purpose, and access request to the Veridica Platform, then routes through the AC_C_Result exclusive gateway (presentation-layer path) and the AC_C_Path exclusive gateway (presentation-layer path) which selects normal Daml stakeholder or observer visibility or Explicit Contract Disclosure. One boundary message catch handles governance suspension mid-use.

![2D. Veridica consumer actions BPMN](assets/02d-veridica-consumer-actions.svg)

##### 2.5 Trust-weight admission and weighting

Participation in the Veridica Platform is not a single binary decision. The 02 chassis assigns each admitted participant a trust weight that conditions how their role-binding authorization translates into governance and effectuation influence. The weight is the same primitive used at admission, during continuous monitoring, and on dynamic reassessment, and the model is intended to iterate as policy, evidence, and observed behavior justify revision.

A trust weight combines four dimensions:

- **Actor type**: the structural role the participant is authorized to play (Contributor, Aggregator, Verifier, Consumer), with the role-binding authorization constraining which capabilities are eligible.
- **Reputation**: externally recognizable standing, including prior verified contributions, attested independence, and absence of unresolved disputes.
- **History**: the on-ledger record of accepted work, challenges, corrections, suspensions, and re-admissions for the same or related contexts.
- **Certifications**: credentials, conflict disclosures, and policy-defined attestations that the participant has supplied and that remain within their stated validity.

The weight has two concrete effects. It first sets a relative quota in decisions, so a higher-weight participant carries more influence per role before outcome aggregation. It also acts as an eligibility filter for sensitive roles such as Aggregator or Verifier, where a minimum weight is required before role-binding authorization can be granted or retained.

Weight is also conditioned by capability. Contributors, Verifiers, Aggregators, and Consumers are weighted differently because each capability affects downstream confidence, reuse, and reward differently. Contributors are weighted more than Consumers precisely because consumer flows are the least affected by lower trust, while contributions directly shape evidence, confidence, and downstream reward allocation. Aggregator and Verifier weights sit between the two and are bounded by the mutually exclusive role rule already present in the 02B and 02C workflows.

Weight is evaluated at admission, continuously throughout the lifecycle, and dynamically when a material change (correction, challenge, suspension, credential rotation, or expired eligibility) is recorded. The model is intended to iterate: policy may revise the four dimensions, the quota curve, the eligibility thresholds, and the dynamic reassessment triggers as implementation evidence and governed decisions accumulate, without requiring a BPMN redesign of the 02 chassis.

#### 6. Reward Allocation

The downstream reward workflow is independent of the participant lifecycle above: it consumes the active versioned participation and reward policy that the 02 chassis and 02A-02D role-party actions record and does not redefine it ad hoc. It validates the configured macro pools and applies the approved credential, role, quality, independence, activity, usage, cap, and floor rules within each pool. Governance voting weights do not automatically equal participation, confidence, or reward weights. Approved allocations may use optional Concordia/CAP interfaces where they fit or a baseline authorized route, followed by receipts and audit records. No message flow from the 02 participant-lifecycle or 02A-02D role-party actions reaches 06; 06 reads only the versioned participation and reward policy it is authorized to consume.

![6. Veridica reward-allocation BPMN](assets/06-veridica-reward-allocation.svg)

### 3. Architectural Alignment

Veridica aligns with Canton strengths in privacy-aware multi-party workflows, explicit authorization, deterministic contract state, and auditable lifecycle transitions. It separates content from provenance, verification from governance, access from reuse permission, reward eligibility from settlement, and user-interface action discovery from authority.

The project is complementary to [CAPS PR #497](https://github.com/canton-foundation/canton-dev-fund/pull/497). CAPS proposes the Canton Access and Privacy Standard and a privacy-preserving push-oracle model for selectively visible signed records. Veridica can reuse validated CAPS access and privacy patterns while addressing a wider contribution lifecycle: multiple evidence sources, independent verification, confidence, challenge, transformations, controlled reuse, and rewards. This broader scope does not diminish CAPS's common-good value or prejudge its interfaces.

CAP means Canton Allocation Primitives and is separate from CAPS. CAP/Concordia is relevant to governed decisions, allocations, and reward routing. Veridica will claim compatibility with CAPS or CAP/Concordia only where public interfaces, versions, and tests demonstrate it.

### 4. Backward Compatibility

No protocol-level backward compatibility impact is expected. Veridica is a new application-layer library and reference implementation. Existing applications, CAPS, CAP/Concordia, Canton Token Standards, and Development Fund processes remain unchanged.

Adapters will be versioned, and unresolved interfaces will be documented rather than presented as supported.

---

## Milestones and Deliverables

Delivery dates, CC amounts, and exact percentages are **TBD**. Milestones are separated into core implementation and measurable adoption. Core implementation milestones together may receive **less than 50%** of the total requested allocation. Adoption milestones together must receive **strictly more than 50%** of the total requested allocation. The final arithmetic must satisfy those constraints before submission.

### Milestone 1: Interfaces and Executable Core

- **Estimated Delivery:** TBD
- **Funding:** TBD CC
- **Allocation Category:** Core implementation
- **Focus:** Define the bounded architecture and deliver executable contribution, provenance, verification, confidence, disclosure, reuse, and reward-eligibility primitives.
- **Deliverables / Value Metrics:**
  - public architecture, authorization model, threat model, and scope boundaries
  - versioned Daml interfaces and an executable reference package
  - SDK clients, fixtures, and policy adapter examples
  - automated lifecycle and authorization tests
  - documented interface assessment for CAPS, CAP/Concordia, and Canton Token Standards
- **Acceptance Criteria:**
  - a reviewer can run contribution, independent verification, challenge, confidence update, bounded disclosure, permitted derivation, and reward-eligibility flows using published instructions
  - tests reject unauthorized disclosure, verification, reuse, reward allocation, and invalid lifecycle transitions
  - provenance remains linked across the demonstrated derivation flow
  - no compatibility claim is made without a tested interface and identified version
  - all funded artifacts delivered in this milestone are publicly available under a **TBD** open-source license acceptable to the Foundation

### Milestone 2: Reusable UI and Reference Governance Composition

- **Estimated Delivery:** TBD
- **Funding:** TBD CC
- **Allocation Category:** Core implementation
- **Focus:** Deliver reusable UI components, reference workflows, and a bounded CAP/Concordia-backed Development Fund governance demonstration.
- **Deliverables / Value Metrics:**
  - independently runnable generic UI and reusable accessible components
  - governed contribution, verification, controlled reuse, and rewards reference workflows
  - CAP/Concordia-backed UI demonstrations for a Development Fund proposal vote and milestone-acceptance decision
  - explicit CIP-0100 authority labeling and effectuation handoff documentation
  - integration, accessibility, and end-to-end test suites
- **Acceptance Criteria:**
  - the UI displays source provenance, verification method and outcome, confidence basis, disclosure scope, reuse limits, and reward state from authoritative contracts
  - action discovery does not grant authority and submissions use only documented authorized routes
  - the Development Fund demonstrations display proposal evidence, votes, thresholds, outcome, and milestone evidence without describing the demonstration as authoritative governance
  - tests and UI copy state that `DevelopmentFundCoupon` effectuation does not itself move CIP-0100 authority on-ledger
  - documentation identifies the approvals, CIP/process changes, identities, and implementation work that would be required before authoritative on-ledger governance could be claimed

### Milestone 3: Independent Technical Adoption

- **Estimated Delivery:** TBD
- **Funding:** TBD CC
- **Allocation Category:** Measurable adoption
- **Focus:** Demonstrate that an independent ecosystem team can evaluate and reuse Veridica.
- **Deliverables / Value Metrics:**
  - at least one qualified independent team completes a reproducible technical evaluation, pilot, or integration using the public artifacts
  - adopter-provided confirmation and a public or committee-reviewable evidence package
  - documented setup findings, interface reuse, defects, and resulting improvements
- **Acceptance Criteria:**
  - the Tech & Ops Committee receives evidence that the team ran the software and exercised contribution, verification, provenance, and controlled disclosure or reuse
  - evidence identifies which Veridica interfaces were reused or adapted and the tested versions
  - an endorsement, letter of intent, meeting, or internal Unlockit use alone does not satisfy the milestone
  - any confidential evidence route is agreed with the Committee before acceptance and still demonstrates substantive use

### Milestone 4: Measured Ecosystem Reuse

- **Estimated Delivery:** TBD
- **Funding:** TBD CC
- **Allocation Category:** Measurable adoption
- **Focus:** Validate reuse across more than one domain or organization and publish adoption evidence.
- **Deliverables / Value Metrics:**
  - a **TBD** bounded number of additional qualified independent pilots or production integrations
  - use across at least two materially different workflow domains in total
  - public adoption report covering reusable interfaces, integration effort, limitations, and maintained versions
  - technical walkthrough and adopter guidance incorporating observed integration needs
- **Acceptance Criteria:**
  - each counted adopter supplies evidence of a running pilot or production integration and substantive reuse of identified Veridica interfaces
  - duplicate deployments by the same controlling organization do not count as separate adopters unless the Committee approves a documented reason
  - prospective adopters, endorsements, and unexecuted agreements do not count
  - the Committee accepts the bounded adopter count, evidence method, and per-adoption funding arithmetic before final proposal approval

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

- Milestone 1 _(Interfaces and Executable Core)_: TBD CC upon committee acceptance
- Milestone 2 _(Reusable UI and Reference Governance Composition)_: TBD CC upon committee acceptance
- Milestone 3 _(Independent Technical Adoption)_: TBD CC upon committee acceptance of adoption evidence
- Milestone 4 _(Measured Ecosystem Reuse)_: TBD CC according to a bounded, committee-approved adoption schedule

No funding arithmetic is final in this draft. Before submission, milestone amounts must sum exactly to the total request, core implementation must remain below 50%, and measurable adoption must remain strictly above 50%. Adoption funding is earned only for accepted evidence and cannot be reclassified as core implementation without an approved proposal change that preserves the strictly-more-than-50% adoption requirement.

### Volatility Stipulation

The schedule is TBD. If any milestone is expected six months or more in the future, the final proposal must specify a prospective CC volatility treatment approved by the Tech & Ops Committee. This draft creates no automatic repricing, top-up, or payment right.

### Funding Locking

Unlockit will retain at least 25% of the funding received for non-adoption milestones M1-M2 through the full grant period, and at least 50% of adoption-linked funding received for M3-M4 for one additional year after grant closure. Unlockit may retain more than these minimum amounts. This is a funding-retention commitment, not escrow, third-party custody, or on-ledger locking.

For this commitment, the grant period runs from approval/start through final milestone closure; grant closure follows final milestone acceptance.

---

## Co-Marketing

Subject to Foundation agreement, Unlockit proposes a public technical walkthrough, architecture article, independently runnable demonstration, and publication of accepted adoption evidence. Exact commitments are TBD. Commercial Unlockit marketing remains outside the shared implementation scope.

---

## Motivation

Canton applications can benefit from a shared layer between raw data and downstream decisions. A provenance record without independent verification may be insufficient; verification without disclosure controls may reveal too much; access without reuse policy may leave downstream rights unclear; and a reward mechanism without governed evidence may reward volume rather than utility.

Veridica addresses these concerns as composable primitives rather than one vertical data marketplace. Its common-good value is measured by independent reuse. For that reason, strictly more than half of requested funding is reserved for measurable adoption rather than delivery alone.

CAPS provides relevant and constructive groundwork for selective access and signed records. Veridica broadens the application model around that work, while CAP/Concordia provides potentially reusable governance and allocation mechanics. Keeping those projects distinct makes their composition reviewable and avoids turning any one interface into an unsupported universal standard.

---

## Rationale

**Why separate contribution, verification, and confidence.** A contributor supplies an assertion; a verifier records an independently accountable assessment; a policy interprets evidence into a confidence state. Separate contracts and interfaces preserve who said what and why.

**Why separate disclosure from reuse.** Seeing data for one purpose does not necessarily authorize redistribution, derivation, or monetization. Explicit grants make those boundaries inspectable while acknowledging that ledger revocation cannot erase information already learned.

**Why support rewards without embedding settlement.** Contribution and verification policies can determine eligibility or allocation. Existing Canton Token Standards should remain responsible for asset representation and transfer.

**Why demonstrate CAP/Concordia governance.** Proposal and milestone decisions are useful proving workflows for evidence-backed governance UI. The demonstration can test reusable decision and allocation mechanics while accurately preserving current CIP-0100 authority and the distinction between governance and effectuation.

**Why weight funding toward adoption.** Public code publication alone does not demonstrate ecosystem utility. Independent, evidenced reuse tests whether the interfaces are understandable, portable, and valuable outside Unlockit.

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
- What bounded adopter count, evidence standard, confidentiality route, and per-adoption amount should Milestones 3 and 4 use?
- What Foundation approvals, CIP/process changes, identities, signatures, and canonical submission routes would be required for authoritative on-ledger Development Fund governance?
- What maintenance period, supported versions, security disclosure process, and succession plan should apply?
- How should the operator-versus-role separation be reconciled with the new 02B Aggregator and 02C Verifier mutually-exclusive clause, and with the Veridica Platform chassis owning admission, role assignment, suspension, removal, and credential rotation? In particular, the Execution Model may use a distributed M-of-N operator-party arrangement, a single execution party, a DecMan-backed Canton Decentralized Party, or a compatible future model; the 02B Aggregator and 02C Verifier role-party pools are independent of the Execution Model and the same Party cannot be both an aggregator and a verifier for the same product, but the operator/role terminology overlap across Concordia, the Execution Model, and the participant-lifecycle role-party pools still needs an explicit glossary and governance test before submission.

---

## Related Projects and Standards

- [RedStone CAPS proposal, PR #497](https://github.com/canton-foundation/canton-dev-fund/pull/497): proposes the Canton Access and Privacy Standard and privacy-preserving push-oracle patterns. It is potentially complementary, not an endorsement or confirmed dependency.
- [Concordia](https://github.com/unlockitio/concordia): develops reusable decision workflows and Canton Allocation Primitives (CAP). CAP is distinct from CAPS.
- [CIP-0100](https://github.com/canton-foundation/cips/blob/main/cip-0100/cip-0100.md): defines current Development Fund governance and implementation mechanics.
- [Canton Network Splice](https://github.com/canton-network/splice): contains current Development Fund effectuation contracts and related infrastructure; exact supported interfaces require validation.

These references identify possible composition points. They do not represent adopter commitments, endorsements, approved governance changes, or guaranteed interface compatibility.

## Maintenance

Unlockit will maintain this work throughout the grant period. After grant finalization, continued maintenance is tied to Unlockit's continued product use in the Real Estate vertical, where governance and allocation problems are foreseen or already applicable. Unlockit is open to maintaining the work jointly with other interested stakeholders. This does not commit to a fixed post-grant duration, SLA, staffing level, funding, or roadmap.
