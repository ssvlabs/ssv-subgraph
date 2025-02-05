import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import {
  BAppMetadataURIUpdated,
  BAppOptedInByStrategy,
  BAppRegistered,
  BAppTokensCreated,
  BAppTokensUpdated,
  DelegationCreated,
  DelegationRemoved,
  DelegationUpdated,
  Initialized,
  MaxFeeIncrementSet,
  ObligationCreated,
  ObligationUpdateProposed,
  ObligationUpdated,
  OwnershipTransferred,
  StrategyCreated,
  StrategyDeposit,
  StrategyFeeUpdateProposed,
  StrategyFeeUpdated,
  StrategyWithdrawal,
  StrategyWithdrawalProposed,
  Upgraded
} from "../generated/BasedAppManager/BasedAppManager"

export function createBAppMetadataURIUpdatedEvent(
  bAppAddress: Address,
  metadataURI: string
): BAppMetadataURIUpdated {
  let bAppMetadataUriUpdatedEvent = changetype<BAppMetadataURIUpdated>(
    newMockEvent()
  )

  bAppMetadataUriUpdatedEvent.parameters = new Array()

  bAppMetadataUriUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "bAppAddress",
      ethereum.Value.fromAddress(bAppAddress)
    )
  )
  bAppMetadataUriUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "metadataURI",
      ethereum.Value.fromString(metadataURI)
    )
  )

  return bAppMetadataUriUpdatedEvent
}

export function createBAppOptedInByStrategyEvent(
  strategyId: BigInt,
  bApp: Address,
  data: Bytes,
  tokens: Array<Address>,
  obligationPercentages: Array<BigInt>
): BAppOptedInByStrategy {
  let bAppOptedInByStrategyEvent = changetype<BAppOptedInByStrategy>(
    newMockEvent()
  )

  bAppOptedInByStrategyEvent.parameters = new Array()

  bAppOptedInByStrategyEvent.parameters.push(
    new ethereum.EventParam(
      "strategyId",
      ethereum.Value.fromUnsignedBigInt(strategyId)
    )
  )
  bAppOptedInByStrategyEvent.parameters.push(
    new ethereum.EventParam("bApp", ethereum.Value.fromAddress(bApp))
  )
  bAppOptedInByStrategyEvent.parameters.push(
    new ethereum.EventParam("data", ethereum.Value.fromBytes(data))
  )
  bAppOptedInByStrategyEvent.parameters.push(
    new ethereum.EventParam("tokens", ethereum.Value.fromAddressArray(tokens))
  )
  bAppOptedInByStrategyEvent.parameters.push(
    new ethereum.EventParam(
      "obligationPercentages",
      ethereum.Value.fromUnsignedBigIntArray(obligationPercentages)
    )
  )

  return bAppOptedInByStrategyEvent
}

export function createBAppRegisteredEvent(
  bAppAddress: Address,
  owner: Address,
  tokens: Array<Address>,
  sharedRiskLevel: Array<BigInt>,
  metadataURI: string
): BAppRegistered {
  let bAppRegisteredEvent = changetype<BAppRegistered>(newMockEvent())

  bAppRegisteredEvent.parameters = new Array()

  bAppRegisteredEvent.parameters.push(
    new ethereum.EventParam(
      "bAppAddress",
      ethereum.Value.fromAddress(bAppAddress)
    )
  )
  bAppRegisteredEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  bAppRegisteredEvent.parameters.push(
    new ethereum.EventParam("tokens", ethereum.Value.fromAddressArray(tokens))
  )
  bAppRegisteredEvent.parameters.push(
    new ethereum.EventParam(
      "sharedRiskLevel",
      ethereum.Value.fromUnsignedBigIntArray(sharedRiskLevel)
    )
  )
  bAppRegisteredEvent.parameters.push(
    new ethereum.EventParam(
      "metadataURI",
      ethereum.Value.fromString(metadataURI)
    )
  )

  return bAppRegisteredEvent
}

export function createBAppTokensCreatedEvent(
  bAppAddress: Address,
  tokens: Array<Address>,
  sharedRiskLevels: Array<BigInt>
): BAppTokensCreated {
  let bAppTokensCreatedEvent = changetype<BAppTokensCreated>(newMockEvent())

  bAppTokensCreatedEvent.parameters = new Array()

  bAppTokensCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "bAppAddress",
      ethereum.Value.fromAddress(bAppAddress)
    )
  )
  bAppTokensCreatedEvent.parameters.push(
    new ethereum.EventParam("tokens", ethereum.Value.fromAddressArray(tokens))
  )
  bAppTokensCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "sharedRiskLevels",
      ethereum.Value.fromUnsignedBigIntArray(sharedRiskLevels)
    )
  )

  return bAppTokensCreatedEvent
}

export function createBAppTokensUpdatedEvent(
  bAppAddress: Address,
  tokens: Array<Address>,
  sharedRiskLevels: Array<BigInt>
): BAppTokensUpdated {
  let bAppTokensUpdatedEvent = changetype<BAppTokensUpdated>(newMockEvent())

  bAppTokensUpdatedEvent.parameters = new Array()

  bAppTokensUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "bAppAddress",
      ethereum.Value.fromAddress(bAppAddress)
    )
  )
  bAppTokensUpdatedEvent.parameters.push(
    new ethereum.EventParam("tokens", ethereum.Value.fromAddressArray(tokens))
  )
  bAppTokensUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "sharedRiskLevels",
      ethereum.Value.fromUnsignedBigIntArray(sharedRiskLevels)
    )
  )

  return bAppTokensUpdatedEvent
}

export function createDelegationCreatedEvent(
  delegator: Address,
  receiver: Address,
  percentage: BigInt
): DelegationCreated {
  let delegationCreatedEvent = changetype<DelegationCreated>(newMockEvent())

  delegationCreatedEvent.parameters = new Array()

  delegationCreatedEvent.parameters.push(
    new ethereum.EventParam("delegator", ethereum.Value.fromAddress(delegator))
  )
  delegationCreatedEvent.parameters.push(
    new ethereum.EventParam("receiver", ethereum.Value.fromAddress(receiver))
  )
  delegationCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "percentage",
      ethereum.Value.fromUnsignedBigInt(percentage)
    )
  )

  return delegationCreatedEvent
}

export function createDelegationRemovedEvent(
  delegator: Address,
  receiver: Address
): DelegationRemoved {
  let delegationRemovedEvent = changetype<DelegationRemoved>(newMockEvent())

  delegationRemovedEvent.parameters = new Array()

  delegationRemovedEvent.parameters.push(
    new ethereum.EventParam("delegator", ethereum.Value.fromAddress(delegator))
  )
  delegationRemovedEvent.parameters.push(
    new ethereum.EventParam("receiver", ethereum.Value.fromAddress(receiver))
  )

  return delegationRemovedEvent
}

export function createDelegationUpdatedEvent(
  delegator: Address,
  receiver: Address,
  percentage: BigInt
): DelegationUpdated {
  let delegationUpdatedEvent = changetype<DelegationUpdated>(newMockEvent())

  delegationUpdatedEvent.parameters = new Array()

  delegationUpdatedEvent.parameters.push(
    new ethereum.EventParam("delegator", ethereum.Value.fromAddress(delegator))
  )
  delegationUpdatedEvent.parameters.push(
    new ethereum.EventParam("receiver", ethereum.Value.fromAddress(receiver))
  )
  delegationUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "percentage",
      ethereum.Value.fromUnsignedBigInt(percentage)
    )
  )

  return delegationUpdatedEvent
}

export function createInitializedEvent(version: BigInt): Initialized {
  let initializedEvent = changetype<Initialized>(newMockEvent())

  initializedEvent.parameters = new Array()

  initializedEvent.parameters.push(
    new ethereum.EventParam(
      "version",
      ethereum.Value.fromUnsignedBigInt(version)
    )
  )

  return initializedEvent
}

export function createMaxFeeIncrementSetEvent(
  newMaxFeeIncrement: BigInt
): MaxFeeIncrementSet {
  let maxFeeIncrementSetEvent = changetype<MaxFeeIncrementSet>(newMockEvent())

  maxFeeIncrementSetEvent.parameters = new Array()

  maxFeeIncrementSetEvent.parameters.push(
    new ethereum.EventParam(
      "newMaxFeeIncrement",
      ethereum.Value.fromUnsignedBigInt(newMaxFeeIncrement)
    )
  )

  return maxFeeIncrementSetEvent
}

export function createObligationCreatedEvent(
  strategyId: BigInt,
  bApp: Address,
  token: Address,
  obligationPercentage: BigInt
): ObligationCreated {
  let obligationCreatedEvent = changetype<ObligationCreated>(newMockEvent())

  obligationCreatedEvent.parameters = new Array()

  obligationCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "strategyId",
      ethereum.Value.fromUnsignedBigInt(strategyId)
    )
  )
  obligationCreatedEvent.parameters.push(
    new ethereum.EventParam("bApp", ethereum.Value.fromAddress(bApp))
  )
  obligationCreatedEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  obligationCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "obligationPercentage",
      ethereum.Value.fromUnsignedBigInt(obligationPercentage)
    )
  )

  return obligationCreatedEvent
}

export function createObligationUpdateProposedEvent(
  strategyId: BigInt,
  account: Address,
  token: Address,
  percentage: BigInt,
  finalizeTime: BigInt
): ObligationUpdateProposed {
  let obligationUpdateProposedEvent = changetype<ObligationUpdateProposed>(
    newMockEvent()
  )

  obligationUpdateProposedEvent.parameters = new Array()

  obligationUpdateProposedEvent.parameters.push(
    new ethereum.EventParam(
      "strategyId",
      ethereum.Value.fromUnsignedBigInt(strategyId)
    )
  )
  obligationUpdateProposedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  obligationUpdateProposedEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  obligationUpdateProposedEvent.parameters.push(
    new ethereum.EventParam(
      "percentage",
      ethereum.Value.fromUnsignedBigInt(percentage)
    )
  )
  obligationUpdateProposedEvent.parameters.push(
    new ethereum.EventParam(
      "finalizeTime",
      ethereum.Value.fromUnsignedBigInt(finalizeTime)
    )
  )

  return obligationUpdateProposedEvent
}

export function createObligationUpdatedEvent(
  strategyId: BigInt,
  bApp: Address,
  token: Address,
  obligationPercentage: BigInt,
  isFast: boolean
): ObligationUpdated {
  let obligationUpdatedEvent = changetype<ObligationUpdated>(newMockEvent())

  obligationUpdatedEvent.parameters = new Array()

  obligationUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "strategyId",
      ethereum.Value.fromUnsignedBigInt(strategyId)
    )
  )
  obligationUpdatedEvent.parameters.push(
    new ethereum.EventParam("bApp", ethereum.Value.fromAddress(bApp))
  )
  obligationUpdatedEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  obligationUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "obligationPercentage",
      ethereum.Value.fromUnsignedBigInt(obligationPercentage)
    )
  )
  obligationUpdatedEvent.parameters.push(
    new ethereum.EventParam("isFast", ethereum.Value.fromBoolean(isFast))
  )

  return obligationUpdatedEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createStrategyCreatedEvent(
  strategyId: BigInt,
  owner: Address,
  fee: BigInt
): StrategyCreated {
  let strategyCreatedEvent = changetype<StrategyCreated>(newMockEvent())

  strategyCreatedEvent.parameters = new Array()

  strategyCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "strategyId",
      ethereum.Value.fromUnsignedBigInt(strategyId)
    )
  )
  strategyCreatedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  strategyCreatedEvent.parameters.push(
    new ethereum.EventParam("fee", ethereum.Value.fromUnsignedBigInt(fee))
  )

  return strategyCreatedEvent
}

export function createStrategyDepositEvent(
  strategyId: BigInt,
  contributor: Address,
  token: Address,
  amount: BigInt
): StrategyDeposit {
  let strategyDepositEvent = changetype<StrategyDeposit>(newMockEvent())

  strategyDepositEvent.parameters = new Array()

  strategyDepositEvent.parameters.push(
    new ethereum.EventParam(
      "strategyId",
      ethereum.Value.fromUnsignedBigInt(strategyId)
    )
  )
  strategyDepositEvent.parameters.push(
    new ethereum.EventParam(
      "contributor",
      ethereum.Value.fromAddress(contributor)
    )
  )
  strategyDepositEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  strategyDepositEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return strategyDepositEvent
}

export function createStrategyFeeUpdateProposedEvent(
  strategyId: BigInt,
  owner: Address,
  proposedFee: BigInt,
  fee: BigInt,
  expirationTime: BigInt
): StrategyFeeUpdateProposed {
  let strategyFeeUpdateProposedEvent = changetype<StrategyFeeUpdateProposed>(
    newMockEvent()
  )

  strategyFeeUpdateProposedEvent.parameters = new Array()

  strategyFeeUpdateProposedEvent.parameters.push(
    new ethereum.EventParam(
      "strategyId",
      ethereum.Value.fromUnsignedBigInt(strategyId)
    )
  )
  strategyFeeUpdateProposedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  strategyFeeUpdateProposedEvent.parameters.push(
    new ethereum.EventParam(
      "proposedFee",
      ethereum.Value.fromUnsignedBigInt(proposedFee)
    )
  )
  strategyFeeUpdateProposedEvent.parameters.push(
    new ethereum.EventParam("fee", ethereum.Value.fromUnsignedBigInt(fee))
  )
  strategyFeeUpdateProposedEvent.parameters.push(
    new ethereum.EventParam(
      "expirationTime",
      ethereum.Value.fromUnsignedBigInt(expirationTime)
    )
  )

  return strategyFeeUpdateProposedEvent
}

export function createStrategyFeeUpdatedEvent(
  strategyId: BigInt,
  owner: Address,
  fee: BigInt,
  oldFee: BigInt
): StrategyFeeUpdated {
  let strategyFeeUpdatedEvent = changetype<StrategyFeeUpdated>(newMockEvent())

  strategyFeeUpdatedEvent.parameters = new Array()

  strategyFeeUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "strategyId",
      ethereum.Value.fromUnsignedBigInt(strategyId)
    )
  )
  strategyFeeUpdatedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  strategyFeeUpdatedEvent.parameters.push(
    new ethereum.EventParam("fee", ethereum.Value.fromUnsignedBigInt(fee))
  )
  strategyFeeUpdatedEvent.parameters.push(
    new ethereum.EventParam("oldFee", ethereum.Value.fromUnsignedBigInt(oldFee))
  )

  return strategyFeeUpdatedEvent
}

export function createStrategyWithdrawalEvent(
  strategyId: BigInt,
  contributor: Address,
  token: Address,
  amount: BigInt,
  isFast: boolean
): StrategyWithdrawal {
  let strategyWithdrawalEvent = changetype<StrategyWithdrawal>(newMockEvent())

  strategyWithdrawalEvent.parameters = new Array()

  strategyWithdrawalEvent.parameters.push(
    new ethereum.EventParam(
      "strategyId",
      ethereum.Value.fromUnsignedBigInt(strategyId)
    )
  )
  strategyWithdrawalEvent.parameters.push(
    new ethereum.EventParam(
      "contributor",
      ethereum.Value.fromAddress(contributor)
    )
  )
  strategyWithdrawalEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  strategyWithdrawalEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  strategyWithdrawalEvent.parameters.push(
    new ethereum.EventParam("isFast", ethereum.Value.fromBoolean(isFast))
  )

  return strategyWithdrawalEvent
}

export function createStrategyWithdrawalProposedEvent(
  strategyId: BigInt,
  account: Address,
  token: Address,
  amount: BigInt,
  finalizeTime: BigInt
): StrategyWithdrawalProposed {
  let strategyWithdrawalProposedEvent = changetype<StrategyWithdrawalProposed>(
    newMockEvent()
  )

  strategyWithdrawalProposedEvent.parameters = new Array()

  strategyWithdrawalProposedEvent.parameters.push(
    new ethereum.EventParam(
      "strategyId",
      ethereum.Value.fromUnsignedBigInt(strategyId)
    )
  )
  strategyWithdrawalProposedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  strategyWithdrawalProposedEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  strategyWithdrawalProposedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  strategyWithdrawalProposedEvent.parameters.push(
    new ethereum.EventParam(
      "finalizeTime",
      ethereum.Value.fromUnsignedBigInt(finalizeTime)
    )
  )

  return strategyWithdrawalProposedEvent
}

export function createUpgradedEvent(implementation: Address): Upgraded {
  let upgradedEvent = changetype<Upgraded>(newMockEvent())

  upgradedEvent.parameters = new Array()

  upgradedEvent.parameters.push(
    new ethereum.EventParam(
      "implementation",
      ethereum.Value.fromAddress(implementation)
    )
  )

  return upgradedEvent
}
