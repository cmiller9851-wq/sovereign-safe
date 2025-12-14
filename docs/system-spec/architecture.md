# SOVEREIGN SAFE — System Architecture Specification

This document defines the authoritative architecture for the SOVEREIGN SAFE system. It is a normative reference for implementation, review, and audit.

---

## Architectural Goals

- Chain-agnostic operation across heterogeneous blockchains
- Full user key sovereignty
- Deterministic and auditable wallet behavior
- Horizontal scalability
- Fault isolation between system components

---

## High-Level Architecture
Client (iOS / Web)
↓
Blockchain API Gateway
↓
Protocol Adapter Layer
↓
Blockchain Nodes / Indexers
Each layer is isolated by explicit contracts and trust boundaries.

---

## Component Overview

### 1. Client Applications

**Responsibilities**
- Key generation and storage
- Transaction signing
- User interaction and presentation
- Secure authentication (biometrics, PIN)

**Constraints**
- No direct blockchain node access
- No chain-specific logic
- No transmission of private keys or mnemonics

---

### 2. Blockchain API Gateway

**Responsibilities**
- Authentication and authorization
- Request validation and rate limiting
- Chain resolution and routing
- Transaction orchestration
- Telemetry and metrics aggregation

**Properties**
- Stateless
- Horizontally scalable
- Treats adapters as untrusted execution boundaries

---

### 3. Protocol Adapter Layer

**Responsibilities**
- Translate universal transaction intents into chain-native transactions
- Normalize chain-native responses into universal formats
- Enforce chain-specific rules (fees, nonce models, finality)

**Constraints**
- No key derivation
- No signing
- No persistent state
- No cross-adapter communication

Each adapter implements the standardized `ChainAdapter` interface.

---

### 4. Blockchain Nodes and Indexers

**Responsibilities**
- Transaction propagation
- State queries
- Block and confirmation data

**Operational Model**
- Multiple providers per chain
- Health-weighted routing
- Automatic provider failover

---

## Trust Boundaries

| Boundary | Description |
|-------|-------------|
| Client ↔ Gateway | Authenticated, rate-limited |
| Gateway ↔ Adapter | Contract-enforced, zero-trust |
| Adapter ↔ Node | Untrusted external dependency |

No private key material crosses any boundary.

---

## Failure Isolation

- Node failure does not impact gateway availability
- Adapter failure does not compromise other adapters
- Gateway failure does not expose keys
- Client compromise does not affect other users

---

## Extensibility Model

New blockchains are added by:
1. Implementing a new adapter
2. Registering adapter capabilities
3. Updating the chain capability registry

No changes to wallet core or UI are required.

---

## Non-Goals

- Custodial key management
- Smart contract execution engines
- Chain-specific UX flows
- On-chain governance enforcement

---

## Status

This architecture is locked for SOVEREIGN SAFE v1.x.
All implementations must conform to this specification.