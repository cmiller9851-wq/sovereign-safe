# SOVEREIGN SAFE — Canonical Data Contracts

This document outlines the canonical data models and interfaces that define the interactions within the SOVEREIGN SAFE system.

---

## 1. Transaction Intent

The data structure representing a user's intention to initiate a transaction.

```json
{
  "chain": "ETH | BTC | SOL | ...",
  "from": "string",
  "to": "string",
  "asset": {
    "type": "NATIVE | TOKEN",
    "identifier": "string"
  },
  "amount": "decimal",
  "memo": "optional string"
}
```

---

## 2. Fee Quote

The data structure that represents the estimated fees associated with a transaction.

```json
{
  "feeAsset": "string",
  "amount": "decimal",
  "speed": "slow | standard | fast"
}
```

---

## 3. Transaction Status

The data structure that represents the current status of a transaction.

```json
{
  "txHash": "string",
  "state": "PENDING | CONFIRMED | FAILED",
  "confirmations": "number",
  "finalized": "boolean"
}
```

---

## Immutability

These contracts are immutable for v1.x and serve as the standard data formats across the SOVEREIGN SAFE ecosystem.
```