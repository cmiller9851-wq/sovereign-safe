# Security Policy — SOVEREIGN SAFE

Security is foundational to SOVEREIGN SAFE. This document defines mandatory security requirements, reporting procedures, and enforcement boundaries for all components of the system.

---

## Security Principles

- Users retain full sovereignty over their private keys
- Private keys and recovery phrases are never transmitted
- Cryptographic operations must be deterministic and auditable
- All components are treated as zero-trust by default
- Failures must be explicit and safe

---

## Client-Side Security (iOS)

### Mandatory Requirements
- Private keys stored only using platform-secure storage
- Biometric authentication required for sensitive actions
- Secure Enclave usage where available
- Recovery phrase displayed only once during creation
- Memory containing sensitive data must be zeroed after use

### Prohibited
- Clipboard storage of recovery phrases
- Screenshot capture during seed display
- Background screenshots of sensitive screens
- Transmission of private keys or mnemonics

---

## Wallet Core Security

- Deterministic key derivation only
- Curve isolation enforced per chain
- No reuse of keys across incompatible curves
- No network or IO access
- Offline reproducibility tests required

---

## Gateway Security

- Stateless execution
- Strict request validation
- Rate limiting and abuse detection
- Adapter sandboxing
- Replay attack prevention
- No signing or key material handling

---

## Adapter Security

- Strict address validation
- Fee manipulation protection
- Reorg and double-spend awareness
- Malformed transaction rejection
- Dust and spam mitigation

---

## Infrastructure Security

- Secrets managed via secure vaults
- TLS enforced on all endpoints
- RPC credentials isolated per provider
- Immutable audit logs
- Least-privilege access policies

---

## Dependency Management

- Dependencies must be actively maintained
- Vulnerability scans required in CI
- Cryptographic libraries must be industry-reviewed

---

## Reporting a Vulnerability

Security issues must be reported privately.

Do **not** open public issues or pull requests for security vulnerabilities.

Contact details for private disclosure will be provided through project maintainers.

---

## Disclosure Policy

- Issues are evaluated promptly
- Fixes are developed privately
- Public disclosure occurs only after remediation