# SSV Subgraph - Agent Guidelines

## Project Overview

This is a **The Graph** subgraph that indexes the **SSVNetwork** smart contract on Ethereum. It tracks validator, operator, cluster, and DAO-related events for the SSV Network decentralized staking protocol.

- **Language**: AssemblyScript (via `@graphprotocol/graph-ts`)
- **Testing**: Matchstick AS (`matchstick-as`)
- **Graph CLI**: `0.97.1`
- **Graph TS**: `0.38.2`

---

## Build & Test Commands

### Standard Commands

```bash
# Generate TypeScript from schema + ABIs
yarn codegen

# Build the subgraph
yarn build

# Deploy to Subgraph Studio
yarn deploy

# Deploy to local Graph Node (requires docker-compose)
yarn deploy-local

# Run all tests
yarn test
```

### Running a Single Test

To run a single test file, specify the file path:

```bash
# Run specific test file
graph test tests/ssv-network.test.ts

# Run specific test suite name
graph test --grep "Describe entity assertions"
```

For single test functions within a file, modify the test file temporarily or use grep pattern matching.

### Local Development

```bash
# Start local Graph Node (from repo root)
docker-compose up -d

# Create subgraph locally
yarn create-local

# Remove subgraph locally
yarn remove-local

# Access GraphQL Playground
# http://localhost:8000/subgraphs/name/ssv-network/
```

---

## Code Style Guidelines

### File Organization

| File | Purpose |
|------|---------|
| `src/ssv-network.ts` | Main mapping handlers (all event handlers) |
| `tests/*.test.ts` | Test suites using matchstick-as |
| `tests/*-utils.ts` | Test utility functions for creating mock events |
| `schema.graphql` | GraphQL entity definitions |
| `subgraph.yaml` | Subgraph manifest & event handlers config |
| `abis/*.json` | Smart contract ABIs |

---

### Imports

**Order (alphabetical within groups):**
1. External `@graphprotocol/graph-ts` imports
2. Generated event type imports (`../generated/SSVNetwork/SSVNetwork`)
3. Generated entity imports (`../generated/schema`)

```typescript
// ✅ Correct
import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import { ValidatorAdded as ValidatorAddedEvent } from "../generated/SSVNetwork/SSVNetwork";
import { Validator, Cluster, Account } from "../generated/schema";

// ❌ Wrong - wrong order or missing newline separation
import { ValidatorAdded } from "../generated/schema"
import { BigInt } from "@graphprotocol/graph-ts"
```

---

### Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Event handlers | `handle<EventName>` | `handleValidatorAdded` |
| Entities | PascalCase | `Validator`, `ClusterDeposited` |
| Entity IDs | Descriptive or composite | `"0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1"` |
| Constants | SCREAMING_SNAKE_CASE | `VUNITS_PRECISION`, `DEFAULT_BALANCE` |
| Functions | camelCase | `compareSemver(version1, version2)` |
| Variables/parameters | camelCase | `entity`, `eventAddress` |
| Event parameters | `event.params.<name>` | `event.params.publicKey` |

---

### Entity ID Generation Patterns

```typescript
// Event entities: tx-hash + log-index (padded)
`${event.transaction.hash.toHexString()}-${event.logIndex.toString().padStart(5, "0")}`

// Cluster: owner-address + operator-ids
`${event.params.owner.toHexString()}-${event.params.operatorIds.join("-")}`

// Validator: public key (bytes)
event.params.publicKey

// Operator: operator ID as string
event.params.operatorId.toString()

// DAOValues: contract address
event.address
```

---

### Type Annotations

Always declare types explicitly in function signatures:

```typescript
// ✅ Correct
export function handleValidatorAdded(event: ValidatorAddedEvent): void {
  let owner: Account | null = Account.load(event.params.owner)
  let entity: Validator = new Validator(event.params.publicKey)

// ❌ Wrong - no type annotations
export function handleValidatorAdded(event) {
  let owner = Account.load(event.params.owner)
  let entity = new Validator(event.params.publicKey)
```

---

### Null Handling

Use conditional checks, not optional chaining:

```typescript
// ✅ Correct
if (!dao) {
  dao = new DAOValues(event.address)
  // ... initialize fields
}
dao.updateType = "NETWORK_FEE"
dao.save()

// ❌ Wrong - don't assume entity exists
dao.updateType = "NETWORK_FEE"
dao.save()
```

---

### Error Handling

```typescript
// Use log.error for critical issues that should stop processing
log.error("Attempting to update Account with address {}, but it does not exist.", [
  event.params.owner.toHexString(),
])

// Use log.warning for non-critical issues (entity created on-the-fly)
log.warning("New DAO Event, DAO values store with ID {} does not exist, creating it.", [
  event.address.toHexString(),
])

// Use log.info for informational messages
log.info("Validator added with public key {} at block {}", [
  publicKey.toHexString(),
  event.block.number.toString(),
])
```

**Log parameters**: Array of strings matching `{}` placeholders - use `.toHexString()` or `.toString()` on all values.

---

### Constants

Define at module level (top of file):

```typescript
const VUNITS_PRECISION = BigInt.fromI32(100000)
const DEFAULT_BALANCE = BigInt.fromI32(32)
const SSV_STAKING_UPDATE_BLOCK_NUMBER = BigInt.fromI32(2442571)
const DEFAULT_OPERATOR_ETH_FEE = BigInt.fromI32(1_778_800_000)
```

**BigInt literals**: Use underscore separators for readability (`1_778_800_000`).

---

### Entity Creation Patterns

```typescript
let entity = new EntityName(entityId)
// Set entity fields
entity.field1 = value
entity.field2 = event.params.value
// Common fields
entity.blockNumber = event.block.number
entity.blockTimestamp = event.block.timestamp
entity.transactionHash = event.transaction.hash
entity.save()
```

---

### GraphQL Schema Conventions

- **Entity fields**: Follow Soliditity types (`BigInt!` for `uint256`, `Int!` for `int`)
- **Immutable entities**: Use `@entity(immutable: true)` for event-log entities
- **Derived fields**: Use `@derivedFrom(field: "name")` for reverse relations
- **Enums**: UPPER_SNAKE_CASE

---

### Testing Patterns

```typescript
import { assert, describe, test, clearStore, beforeAll, afterAll } from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { handleValidatorAdded } from "../src/ssv-network"
import { createValidatorAddedEvent } from "./ssv-network-utils"

describe("ValidatorAdded events", () => {
  beforeAll(() => {
    let event = createValidatorAddedEvent(...)
    handleValidatorAdded(event)
  })

  afterAll(() => {
    clearStore()
  })

  test("Validator created and stored", () => {
    assert.entityCount("Validator", 1)
    assert.fieldEquals("Validator", "id", "owner", "0x...")
  })
})
```

---

### Version Handling

Use `compareSemver()` for version-aware logic:

```typescript
function compareSemver(v1: String, v2: String): i32 {
  // Returns: -1 if v1 < v2, 0 if equal, 1 if v1 > v2
}

// Usage
if (compareSemver(dao.version, "v2.0.0") >= 0) {
  // Handle post-upgrade logic
}
```

---

### Key Files Reference

| File | Lines | Purpose |
|------|-------|---------|
| `src/ssv-network.ts` | 3031 | All 50+ event handlers |
| `schema.graphql` | 636 | Entity definitions |
| `subgraph.yaml` | 155 | Manifest & handler config |
| `tests/ssv-network-utils.ts` | 792 | Mock event creators |

---

### Smart Contract Reference

- **Mainnet Contract**: `0xDD9BC35aE942eF0cFa76930954a156B3fF30a4E1`
- **ABI Location**: `abis/SSVNetwork.json`
- **Start Block**: 17507480