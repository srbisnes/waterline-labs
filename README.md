# Waterline Labs

Waterline Labs is an omnichain commodities trade operating system for Argentina, focused on Web3 real-world assets (RWA), AI-assisted operations, and tokenization workflows for agriculture, lithium, and energy markets.

> **Goal:** provide a production-ready blueprint for moving from commodity origination to settlement with strong controls, auditability, and operational resilience.

## Problem

Commodity trade in Argentina is operationally complex: counterparties, logistics providers, exporters, financiers, insurers, custodians, and regulators all need trustworthy data at different stages of the transaction. Manual reconciliation, fragmented documentation, and opaque settlement flows increase the probability of delays, fraud, duplicated financing, and compliance gaps.

## Proposed solution

Waterline Labs should be built as a modular trade OS with five core layers:

1. **Origination layer** — captures supply, demand, pricing terms, counterparties, and asset provenance.
2. **Verification layer** — validates documents, inspections, custody events, invoices, sanctions status, and regulatory requirements.
3. **Tokenization layer** — represents verified claims or inventories as permissioned RWA tokens with lifecycle controls.
4. **Settlement layer** — coordinates fiat, stablecoin, escrow, delivery-versus-payment, and reconciliation flows.
5. **Intelligence layer** — uses AI agents to monitor exceptions, summarize documents, flag risks, and support operators without replacing human approvals.

## Supported commodity verticals

| Vertical | Example assets | Critical controls |
| --- | --- | --- |
| Agriculture | soy, corn, wheat, oilseed byproducts | warehouse receipts, quality certificates, SENASA/export documentation, custody chain |
| Lithium | brine, carbonate, hydroxide, offtake contracts | mine/operator validation, assay reports, export permits, ESG documentation |
| Energy | natural gas, power contracts, renewable attributes | metering data, delivery confirmations, market/operator records, contract compliance |

## Parametric insurance automation

Waterline Labs can also power **“insurance that pays itself”** for commodity logistics and other real-world risks. The legal policy remains the source of contractual rights, while a blockchain smart contract automates the execution of predefined, verifiable payout conditions.

### How it works

- **Automates claim execution:** moves repetitive claim handling into a smart contract that executes policy terms on-chain.
- **Defines clear conditions:** examples include “if the vessel is delayed by more than 48 hours” or “if the cargo sensor detects excess humidity.”
- **Connects with oracles:** receives trusted external data such as weather, GPS location, container IoT readings, port records, and logistics milestones.
- **Executes automatic payouts:** when the condition is met and validated, the contract releases payment in stablecoins such as USDT or USDC within pre-approved policy limits.
- **Creates auditable transparency:** every policy state, trigger, validation, and payout is recorded on-chain or linked to tamper-evident evidence, reducing fraud, disputes, and bureaucracy.

### Practical example

| Field | Example |
| --- | --- |
| Use case | Maritime cargo insurance |
| Condition | IoT sensor detects humidity above 70% inside the container |
| Action | The smart contract validates the oracle data and pays the covered amount to the cargo owner in USDT |
| Benefit | The insured party can receive funds in minutes when the event is objectively verified |

### Human value

- **Accessible and fast:** helps people and companies that currently suffer from slow, expensive insurance processes.
- **Fair and transparent:** reduces dependency on opaque intermediaries by making objective triggers, evidence, and payout rules auditable.
- **Scalable:** can be extended to health, transportation, agriculture, renewable energy, and other parametric insurance markets.

In short, this module turns Waterline Labs into an automated insurance layer where blockchain and oracles execute approved indemnity payments when the insured event is objectively verified.

## Mobile accessibility and inclusive access

Waterline Labs should eventually provide its own mobile app so operators, cargo owners, insurers, and beneficiaries can access critical workflows from a phone. The app must be designed for inclusive access from the start, including people who are deaf or hard of hearing, people with speech disabilities, and people who are blind or have low vision.

### Accessibility requirements

- **Screen-reader first:** support iOS VoiceOver and Android TalkBack with semantic labels, logical focus order, accessible forms, and clear error messages.
- **Voice and audio support:** provide text-to-speech for transaction status, policy terms, payout confirmations, and urgent alerts.
- **Non-voice workflows:** allow users to complete onboarding, identity checks, support requests, approvals, and claim reviews without requiring a phone call or spoken interaction.
- **Captions and transcripts:** include captions, transcripts, and visual summaries for every audio or video instruction.
- **Visual and haptic alerts:** notify users through vibration, push notifications, high-contrast visual states, and persistent in-app banners.
- **Readable interface:** support large text, high contrast, reduced motion, simple language, and Spanish/English localization.
- **Accessible documents:** convert uploaded policies, certificates, invoices, and inspection documents into readable, searchable, screen-reader-compatible summaries.
- **Assisted verification:** provide guided flows for blind or low-vision users when capturing documents, wallet confirmations, or identity evidence with a phone camera.
- **Human support alternatives:** offer chat, email, and accessible ticketing so users who cannot speak or hear can still resolve urgent issues.

### Mobile app roadmap

- Start with a read-only mobile companion for alerts, deal status, policy status, payout status, and document review.
- Add secure approvals with biometric unlock, passkeys, device binding, and step-up verification for sensitive actions.
- Add accessible claim and incident flows for parametric insurance, including oracle evidence explanations in plain language.
- Test each release with assistive technologies and, when possible, with users who rely on screen readers, captions, keyboard navigation, haptics, or non-voice support.
- Track accessibility defects as production blockers, not cosmetic issues.

## Reliability principles

No platform can honestly guarantee “zero failures,” but the system can be designed so failures are rare, contained, observable, and recoverable. Waterline Labs should follow these principles from day one:

- **Fail closed for money movement and token issuance:** if verification is incomplete, settlement and minting must stop automatically.
- **Human approval for irreversible actions:** token minting, burning, non-parametric settlement release, counterparty onboarding, and insurance policy activation require auditable human sign-off.
- **Idempotent workflows:** retries must not duplicate payments, tokens, invoices, or custody events.
- **Immutable audit trail:** every material event must be timestamped, signed, and traceable to the actor or system that produced it.
- **Separation of duties:** users who originate deals should not be the only approvers for settlement or token lifecycle actions.
- **Least-privilege access:** operators, agents, APIs, and smart contracts only receive the permissions required for their role.
- **Progressive decentralization:** start with permissioned controls and expand automation only after operational evidence supports it.

## Minimum viable architecture

```text
[Web app / Ops console]
          |
          v
[API gateway + auth + RBAC]
          |
          +--> [Trade workflow service]
          +--> [Document verification service]
          +--> [Risk and compliance service]
          +--> [Tokenization service]
          +--> [Settlement service]
          +--> [Parametric insurance service]
          +--> [Oracle ingestion service]
          +--> [AI agent orchestration]
          |
          v
[PostgreSQL ledger DB] + [Object storage] + [Event log]
          |
          v
[Permissioned smart contracts] + [Custody/settlement integrations]
```

## Required production controls

### Security

- Multi-factor authentication for all privileged users.
- Role-based access control for operators, approvers, auditors, and integrators.
- Hardware-backed key management for signing and treasury actions.
- Smart-contract allowlists for issuers, custodians, bridges, and settlement agents.
- Dependency scanning, secret scanning, and signed releases in CI/CD.

### Compliance

- Counterparty KYC/KYB before deal activation.
- Sanctions and politically exposed person screening before settlement.
- Jurisdiction-specific legal review before issuing any tokenized commodity instrument.
- Export, tax, and customs evidence attached to each transaction before final settlement.
- Retention policy for documents, approvals, and audit logs.

### Data quality

- Source-of-truth mapping for every field used in settlement or token issuance.
- Validation rules for quantities, units, grades, timestamps, and duplicate documents.
- Reconciliation jobs between invoices, custody records, token balances, and settlement records.
- Manual exception queues for mismatched or low-confidence AI outputs.

### AI agent guardrails

- AI agents can draft, summarize, classify, and recommend; they cannot approve settlement or mint tokens alone.
- Every AI output that affects risk scoring must store model name, prompt version, source documents, confidence, and reviewer decision.
- Low-confidence outputs must route to a human queue.
- Prompt and policy changes must be versioned and tested against regression examples.

### Smart-contract safety

- Use audited, upgrade-controlled contracts with emergency pause functionality.
- Separate token admin, pauser, minter, burner, and treasury roles.
- Enforce supply caps and proof-of-reserve checks before minting.
- Run testnet rehearsals for mint, transfer, bridge, redeem, pause, and recovery flows.
- Publish incident playbooks for compromised keys, bridge failures, and incorrect minting.

### Parametric insurance safety

- Treat oracle data as critical infrastructure: require source authentication, replay protection, timestamp checks, and anomaly detection.
- Use multiple data sources for high-value payouts when possible, such as combining IoT, GPS, port records, and weather feeds.
- Encode policy conditions in plain-language documentation and executable tests before deploying the smart contract.
- Add payout limits, dispute windows when the product requires them, and emergency pause controls for catastrophic oracle failures or sensor manipulation.
- Keep an auditable link between the policy, oracle evidence, payout transaction, insured asset, and beneficiary wallet.

## Failure-mode checklist

Before launching any feature, explicitly test the following cases:

- Duplicate API request or webhook replay.
- Missing document, invalid signature, expired certificate, or contradictory inspection report.
- Counterparty fails KYC/KYB after a deal has been drafted.
- Quantity mismatch between invoice, warehouse receipt, and token amount.
- Oracle, bridge, RPC provider, custody provider, or bank API outage.
- AI agent returns a hallucinated summary or cites the wrong source document.
- Oracle reports a false positive, stale reading, missing GPS update, or manipulated IoT sensor value.
- Parametric insurance trigger fires correctly but the stablecoin payout transaction fails or exceeds policy limits.
- User tries to approve an action outside their role.
- Private key rotation, loss, or suspected compromise.
- Partial settlement, failed transaction, or chain reorganization.
- Emergency pause and post-incident recovery.

## Suggested development roadmap

### Phase 1 — Foundations

- Define legal entity roles: issuer, platform operator, custodian, verifier, settlement agent, and token holder.
- Build trade, counterparty, document, and approval data models.
- Add authentication, RBAC, audit logs, and document storage.
- Create manual workflows for origination, verification, approval, and settlement tracking.

### Phase 2 — Controlled tokenization

- Implement permissioned token contracts in a testnet environment.
- Link each token mint to verified inventory or contractual claims.
- Add proof-of-reserve and redemption workflows.
- Run internal tabletop exercises for operational and security incidents.
- Prototype parametric insurance contracts for delayed vessels, humidity events, and other oracle-triggered payouts.

### Phase 3 — AI-assisted operations

- Add document extraction and summarization for invoices, certificates, contracts, and custody records.
- Route low-confidence or high-risk outputs to manual review.
- Build an exception dashboard for mismatches, stale documents, and pending approvals.
- Measure false positives, false negatives, review times, and operator overrides.

### Phase 4 — Production integrations

- Integrate custody, payment, compliance, logistics, and market-data providers.
- Add monitoring, alerting, disaster recovery, and service-level objectives.
- Complete security audit, smart-contract audit, and legal review before production launch.

## Operational metrics

Track these metrics continuously:

- Deal cycle time from origination to settlement.
- Percentage of deals requiring manual exception handling.
- Document extraction accuracy by document type.
- Reconciliation breaks by severity and age.
- Failed settlement attempts and retry outcomes.
- Token supply versus verified reserves or claims.
- Mean time to detect and resolve incidents.

## Definition of done for production features

A feature is not production-ready until it has:

- Clear owner and rollback plan.
- Unit, integration, and end-to-end tests where applicable.
- Permission checks for every sensitive action.
- Audit events for every state transition.
- Monitoring dashboards and actionable alerts.
- Documented failure modes and recovery steps.
- Legal, compliance, and security review when it touches assets, counterparties, or settlement.

## What still needs to be developed

The current repository defines the product direction, but the following work is still needed to turn Waterline Labs into a complete production system:

### Product and UX

- Define the first user persona to serve: exporter, cargo owner, insurer, custodian, verifier, or operations team.
- Design the operator console for trades, documents, insurance policies, alerts, approvals, and settlement status.
- Create onboarding flows for counterparties, assets, wallets, policy beneficiaries, and document upload.
- Add Spanish and English copy for operators, auditors, and external counterparties.
- Define accessibility requirements for deaf or hard-of-hearing users, users with speech disabilities, and blind or low-vision users.

### Application foundation

- Scaffold the frontend, mobile app foundation, backend API, database schema, test suite, and local development environment.
- Implement authentication, organization management, role-based access control, and audit logging before adding asset workflows.
- Build core data models for counterparties, trades, commodities, documents, approvals, wallets, policies, oracle events, payouts, and incidents.
- Add CI checks for formatting, linting, tests, dependency scanning, and secret scanning.

### Trade and document workflows

- Implement deal creation, document upload, document status, approval queues, and exception handling.
- Add validation rules for commodity type, quantity, unit, grade, origin, custody evidence, and settlement instructions.
- Build reconciliation screens that compare invoices, custody records, token balances, policy status, and payout records.
- Store every workflow transition in an immutable audit event table.

### Tokenization and smart contracts

- Select the initial blockchain environment, wallet custody model, stablecoin rails, and permissioning approach.
- Implement permissioned token contracts with minter, burner, pauser, admin, and auditor roles.
- Add proof-of-reserve checks before minting and redemption checks before burning.
- Create testnet scripts for mint, transfer, pause, redeem, payout, and recovery scenarios.
- Complete independent smart-contract review before any production deployment.

### Parametric insurance and oracle layer

- Define the first insurance product, such as maritime delay, container humidity, agricultural weather event, or renewable energy shortfall.
- Specify the exact trigger formula, payout amount, cap, deductible, data freshness requirement, and dispute rule for each policy.
- Integrate oracle feeds for GPS, IoT sensors, weather, port records, and logistics events.
- Add oracle confidence scoring, duplicate-event detection, replay protection, and manual review for suspicious readings.
- Build payout simulation tools so operators can test policy behavior before activation.

### AI and automation

- Implement document extraction for invoices, inspection certificates, custody records, policies, and shipping documents.
- Add AI review queues where humans can accept, reject, or correct model outputs.
- Version prompts and evaluation datasets so model changes can be regression-tested.
- Prevent AI agents from directly approving minting, settlement, or policy activation.

### Compliance, legal, and risk

- Confirm the legal structure for tokenized commodity claims and parametric insurance in each target jurisdiction.
- Add KYC/KYB, sanctions screening, beneficial ownership checks, and counterparty risk scoring.
- Define data retention, privacy, incident response, and audit evidence policies.
- Create legal templates for policy terms, platform terms, counterparty agreements, custody agreements, and disclosure documents.

### Operations and resilience

- Add monitoring, alerting, logs, traces, service-level objectives, and an on-call incident process.
- Implement backup, restore, disaster recovery, and key-rotation procedures.
- Create runbooks for failed payouts, stale oracle data, compromised keys, bridge failures, and incorrect token issuance.
- Run tabletop exercises before production launch and after every major workflow change.

### Go-to-market and validation

- Choose one narrow pilot market instead of launching all commodities at once.
- Recruit one logistics/data partner, one insurer or risk-capital partner, and one commodity operator for the pilot.
- Measure whether the product reduces claim time, reconciliation time, fraud risk, and operational cost.
- Use pilot results to decide which integrations and automated workflows should be built next.

## Additional parts to define before production

These areas are not implementation details only; they are product, business, and governance decisions that must be resolved before Waterline Labs can safely scale.

### User roles and permissions

| Role | Main responsibility | Sensitive permissions |
| --- | --- | --- |
| Platform admin | Configure organizations, integrations, and policies | Manage roles, pause workflows, rotate keys |
| Operator | Create trades, upload documents, and manage exceptions | Draft deals, request reviews, update non-final data |
| Verifier | Review documents, custody evidence, and oracle exceptions | Approve or reject verification steps |
| Approver | Authorize settlement, token lifecycle actions, and policy activation | Sign irreversible approvals with step-up authentication |
| Auditor | Inspect records, evidence, and reports | Read-only access to audit trails and exports |
| Beneficiary | Track policy status, claim status, and payout status | View own records and manage payout wallet details |

### Core records to model

- **Organization:** legal entity, jurisdiction, risk rating, KYC/KYB status, and authorized users.
- **Counterparty:** buyer, seller, custodian, insurer, verifier, logistics provider, or beneficiary.
- **Commodity asset:** commodity type, quantity, unit, grade, origin, custody location, and reserve evidence.
- **Trade:** commercial terms, price, delivery terms, documents, approvals, settlement state, and reconciliation state.
- **Document:** file metadata, source, hash, extracted fields, reviewer decisions, and retention policy.
- **Policy:** insured asset, trigger formula, oracle sources, payout rules, limits, deductible, beneficiary, and activation status.
- **Oracle event:** source, timestamp, signature, confidence score, raw payload, normalized value, and validation result.
- **Token event:** mint, burn, transfer, pause, redemption, supply check, proof-of-reserve link, and signer.
- **Payout:** policy, trigger evidence, stablecoin, amount, destination wallet, transaction hash, and failure/retry state.
- **Audit event:** actor, action, entity, previous state, next state, timestamp, IP/device context, and reason.

### APIs and integrations

- KYC/KYB and sanctions providers for onboarding and ongoing monitoring.
- Custody and wallet providers for treasury, policy payouts, token admin keys, and user wallets.
- Stablecoin and payment rails for USDT, USDC, fiat settlement, escrow, and reconciliation.
- Blockchain RPC, indexers, and block explorers for token events and transaction monitoring.
- Logistics, GPS, AIS vessel tracking, IoT sensors, port systems, and weather feeds for oracle evidence.
- Accounting, ERP, and data warehouse exports for finance, audits, and management reporting.
- Support tooling for accessible tickets, incident communication, and customer operations.

### Business model and economics

- Platform subscription for operators that need trade, document, and settlement workflow management.
- Per-transaction fee for settlement, token issuance, redemption, or reconciliation workflows.
- Parametric insurance automation fee based on policy activation, payout execution, or monitored assets.
- Integration and onboarding fees for custom oracle feeds, custody providers, or enterprise reporting.
- Clear fee disclosure so beneficiaries and counterparties understand costs before accepting a policy or payout.

### Governance and change management

- Maintain a change log for smart contracts, policy templates, oracle formulas, AI prompts, and approval rules.
- Require multi-party approval for contract upgrades, treasury changes, oracle source changes, and payout-rule changes.
- Use staged environments for development, testnet, pilot, and production with separate keys and data.
- Define an emergency governance process for pausing payouts, freezing token actions, or disabling compromised integrations.
- Publish post-incident reviews when failures affect counterparties, payouts, token supply, or audit integrity.

### Launch readiness checklist

- Legal review completed for the first jurisdiction, asset type, token structure, and insurance product.
- Security review completed for authentication, RBAC, custody, smart contracts, APIs, and mobile access.
- Accessibility review completed for web and mobile flows, including screen readers, captions, haptics, and non-voice support.
- Pilot partners signed: one commodity operator, one data/oracle partner, one settlement/custody partner, and one insurance/risk partner.
- Operational runbooks tested for failed payout, stale oracle data, wrong document extraction, key rotation, and emergency pause.
- Monitoring dashboards live for API health, oracle freshness, payout latency, token supply, reconciliation breaks, and incidents.
- User support process ready in Spanish and English with accessible channels for users who cannot hear, speak, or see.

## Next implementation step

The repository currently contains the product foundation and operating blueprint. The next technical step is to scaffold the application with:

- a typed web frontend for the operator console,
- a mobile app plan with accessibility requirements for screen readers, captions, haptics, and non-voice workflows,
- an API service with authentication and RBAC,
- a relational schema for trades, counterparties, documents, approvals, and audit events,
- automated tests and CI checks,
- a local development environment with deterministic seed data.
