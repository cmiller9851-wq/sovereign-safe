# Contributing to SOVEREIGN SAFE

Thank you for your interest in contributing to SOVEREIGN SAFE.  
This project follows strict architectural and security principles. Contributions that violate these principles will not be accepted.

---

## Core Architectural Rules (Non-Negotiable)

### Wallet Core
- Must remain fully chain-agnostic
- Must not perform network calls
- Must not contain UI logic
- Must not store private keys persistently
- Must produce deterministic results for identical inputs

### Adapters
- Must implement the standardized ChainAdapter interface
- Must not derive keys or handle mnemonics
- Must not store persistent state
- Must not call other adapters
- Must only translate between universal intents and chain-native formats

### Gateway
- Must remain stateless
- Must not store private keys or signing material
- Must enforce authentication, rate limits, and request validation
- Must treat adapters as untrusted execution boundaries

### Client Applications
- Must sign transactions client-side
- Must use platform-native secure storage (Secure Enclave where available)
- Must never transmit private keys or recovery phrases

---

## Branching Strategy

- `main` — production-ready, protected
- `dev` — integration branch
- `feature/*` — new features or changes
- `fix/*` — bug fixes
- `security/*` — security-related patches

All changes must go through pull requests.

---

## Pull Request Requirements

- Clear description of changes
- Linked issue or rationale
- Passing unit tests
- No breaking changes without approval
- Security-sensitive changes require review

---

## Testing Requirements

- Unit tests for all wallet-core logic
- Unit tests for each adapter
- Contract tests between gateway and adapters
- Deterministic test vectors for key derivation

---

## Code Style

- Follow existing formatting and lint rules
- Favor clarity over cleverness
- No silent failures
- Explicit error handling required

---

## Security Disclosure

If you discover a security issue, do not open a public issue.  
Report it privately according to the instructions in SECURITY.md.

---

## Contributor License

By submitting a contribution, you agree that your work will be licensed under the Apache License, Version 2.0.