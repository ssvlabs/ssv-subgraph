import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import {
  AdminChanged,
  BeaconUpgraded,
  ClusterDeposited,
  ClusterLiquidated,
  ClusterReactivated,
  ClusterWithdrawn,
  DeclareOperatorFeePeriodUpdated,
  ExecuteOperatorFeePeriodUpdated,
  FeeRecipientAddressUpdated,
  Initialized,
  LiquidationThresholdPeriodUpdated,
  MinimumLiquidationCollateralUpdated,
  ModuleUpgraded,
  NetworkEarningsWithdrawn,
  NetworkFeeUpdated,
  OperatorAdded,
  OperatorFeeDeclarationCancelled,
  OperatorFeeDeclared,
  OperatorFeeExecuted,
  OperatorFeeIncreaseLimitUpdated,
  OperatorMaximumFeeUpdated,
  OperatorWhitelistUpdated,
  OperatorMultipleWhitelistRemoved,
  OperatorMultipleWhitelistUpdated,
  OperatorPrivacyStatusUpdated,
  OperatorRemoved,
  OperatorWhitelistingContractUpdated,
  OperatorWithdrawn,
  OwnershipTransferStarted,
  OwnershipTransferred,
  Upgraded,
  ValidatorAdded,
  ValidatorExited,
  ValidatorRemoved
} from "../generated/SSVNetwork/SSVNetwork"

export function createAdminChangedEvent(
  previousAdmin: Address,
  newAdmin: Address
): AdminChanged {
  let adminChangedEvent = changetype<AdminChanged>(newMockEvent())

  adminChangedEvent.parameters = new Array()

  adminChangedEvent.parameters.push(
    new ethereum.EventParam(
      "previousAdmin",
      ethereum.Value.fromAddress(previousAdmin)
    )
  )
  adminChangedEvent.parameters.push(
    new ethereum.EventParam("newAdmin", ethereum.Value.fromAddress(newAdmin))
  )

  return adminChangedEvent
}

export function createBeaconUpgradedEvent(beacon: Address): BeaconUpgraded {
  let beaconUpgradedEvent = changetype<BeaconUpgraded>(newMockEvent())

  beaconUpgradedEvent.parameters = new Array()

  beaconUpgradedEvent.parameters.push(
    new ethereum.EventParam("beacon", ethereum.Value.fromAddress(beacon))
  )

  return beaconUpgradedEvent
}

export function createClusterDepositedEvent(
  owner: Address,
  operatorIds: Array<BigInt>,
  value: BigInt,
  cluster: ethereum.Tuple
): ClusterDeposited {
  let clusterDepositedEvent = changetype<ClusterDeposited>(newMockEvent())

  clusterDepositedEvent.parameters = new Array()

  clusterDepositedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  clusterDepositedEvent.parameters.push(
    new ethereum.EventParam(
      "operatorIds",
      ethereum.Value.fromUnsignedBigIntArray(operatorIds)
    )
  )
  clusterDepositedEvent.parameters.push(
    new ethereum.EventParam("value", ethereum.Value.fromUnsignedBigInt(value))
  )
  clusterDepositedEvent.parameters.push(
    new ethereum.EventParam("cluster", ethereum.Value.fromTuple(cluster))
  )

  return clusterDepositedEvent
}

export function createClusterLiquidatedEvent(
  owner: Address,
  operatorIds: Array<BigInt>,
  cluster: ethereum.Tuple
): ClusterLiquidated {
  let clusterLiquidatedEvent = changetype<ClusterLiquidated>(newMockEvent())

  clusterLiquidatedEvent.parameters = new Array()

  clusterLiquidatedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  clusterLiquidatedEvent.parameters.push(
    new ethereum.EventParam(
      "operatorIds",
      ethereum.Value.fromUnsignedBigIntArray(operatorIds)
    )
  )
  clusterLiquidatedEvent.parameters.push(
    new ethereum.EventParam("cluster", ethereum.Value.fromTuple(cluster))
  )

  return clusterLiquidatedEvent
}

export function createClusterReactivatedEvent(
  owner: Address,
  operatorIds: Array<BigInt>,
  cluster: ethereum.Tuple
): ClusterReactivated {
  let clusterReactivatedEvent = changetype<ClusterReactivated>(newMockEvent())

  clusterReactivatedEvent.parameters = new Array()

  clusterReactivatedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  clusterReactivatedEvent.parameters.push(
    new ethereum.EventParam(
      "operatorIds",
      ethereum.Value.fromUnsignedBigIntArray(operatorIds)
    )
  )
  clusterReactivatedEvent.parameters.push(
    new ethereum.EventParam("cluster", ethereum.Value.fromTuple(cluster))
  )

  return clusterReactivatedEvent
}

export function createClusterWithdrawnEvent(
  owner: Address,
  operatorIds: Array<BigInt>,
  value: BigInt,
  cluster: ethereum.Tuple
): ClusterWithdrawn {
  let clusterWithdrawnEvent = changetype<ClusterWithdrawn>(newMockEvent())

  clusterWithdrawnEvent.parameters = new Array()

  clusterWithdrawnEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  clusterWithdrawnEvent.parameters.push(
    new ethereum.EventParam(
      "operatorIds",
      ethereum.Value.fromUnsignedBigIntArray(operatorIds)
    )
  )
  clusterWithdrawnEvent.parameters.push(
    new ethereum.EventParam("value", ethereum.Value.fromUnsignedBigInt(value))
  )
  clusterWithdrawnEvent.parameters.push(
    new ethereum.EventParam("cluster", ethereum.Value.fromTuple(cluster))
  )

  return clusterWithdrawnEvent
}

export function createDeclareOperatorFeePeriodUpdatedEvent(
  value: BigInt
): DeclareOperatorFeePeriodUpdated {
  let declareOperatorFeePeriodUpdatedEvent =
    changetype<DeclareOperatorFeePeriodUpdated>(newMockEvent())

  declareOperatorFeePeriodUpdatedEvent.parameters = new Array()

  declareOperatorFeePeriodUpdatedEvent.parameters.push(
    new ethereum.EventParam("value", ethereum.Value.fromUnsignedBigInt(value))
  )

  return declareOperatorFeePeriodUpdatedEvent
}

export function createExecuteOperatorFeePeriodUpdatedEvent(
  value: BigInt
): ExecuteOperatorFeePeriodUpdated {
  let executeOperatorFeePeriodUpdatedEvent =
    changetype<ExecuteOperatorFeePeriodUpdated>(newMockEvent())

  executeOperatorFeePeriodUpdatedEvent.parameters = new Array()

  executeOperatorFeePeriodUpdatedEvent.parameters.push(
    new ethereum.EventParam("value", ethereum.Value.fromUnsignedBigInt(value))
  )

  return executeOperatorFeePeriodUpdatedEvent
}

export function createFeeRecipientAddressUpdatedEvent(
  owner: Address,
  recipientAddress: Address
): FeeRecipientAddressUpdated {
  let feeRecipientAddressUpdatedEvent =
    changetype<FeeRecipientAddressUpdated>(newMockEvent())

  feeRecipientAddressUpdatedEvent.parameters = new Array()

  feeRecipientAddressUpdatedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  feeRecipientAddressUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "recipientAddress",
      ethereum.Value.fromAddress(recipientAddress)
    )
  )

  return feeRecipientAddressUpdatedEvent
}

export function createInitializedEvent(version: i32): Initialized {
  let initializedEvent = changetype<Initialized>(newMockEvent())

  initializedEvent.parameters = new Array()

  initializedEvent.parameters.push(
    new ethereum.EventParam(
      "version",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(version))
    )
  )

  return initializedEvent
}

export function createLiquidationThresholdPeriodUpdatedEvent(
  value: BigInt
): LiquidationThresholdPeriodUpdated {
  let liquidationThresholdPeriodUpdatedEvent =
    changetype<LiquidationThresholdPeriodUpdated>(newMockEvent())

  liquidationThresholdPeriodUpdatedEvent.parameters = new Array()

  liquidationThresholdPeriodUpdatedEvent.parameters.push(
    new ethereum.EventParam("value", ethereum.Value.fromUnsignedBigInt(value))
  )

  return liquidationThresholdPeriodUpdatedEvent
}

export function createMinimumLiquidationCollateralUpdatedEvent(
  value: BigInt
): MinimumLiquidationCollateralUpdated {
  let minimumLiquidationCollateralUpdatedEvent =
    changetype<MinimumLiquidationCollateralUpdated>(newMockEvent())

  minimumLiquidationCollateralUpdatedEvent.parameters = new Array()

  minimumLiquidationCollateralUpdatedEvent.parameters.push(
    new ethereum.EventParam("value", ethereum.Value.fromUnsignedBigInt(value))
  )

  return minimumLiquidationCollateralUpdatedEvent
}

export function createModuleUpgradedEvent(
  moduleId: i32,
  moduleAddress: Address
): ModuleUpgraded {
  let moduleUpgradedEvent = changetype<ModuleUpgraded>(newMockEvent())

  moduleUpgradedEvent.parameters = new Array()

  moduleUpgradedEvent.parameters.push(
    new ethereum.EventParam(
      "moduleId",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(moduleId))
    )
  )
  moduleUpgradedEvent.parameters.push(
    new ethereum.EventParam(
      "moduleAddress",
      ethereum.Value.fromAddress(moduleAddress)
    )
  )

  return moduleUpgradedEvent
}

export function createNetworkEarningsWithdrawnEvent(
  value: BigInt,
  recipient: Address
): NetworkEarningsWithdrawn {
  let networkEarningsWithdrawnEvent =
    changetype<NetworkEarningsWithdrawn>(newMockEvent())

  networkEarningsWithdrawnEvent.parameters = new Array()

  networkEarningsWithdrawnEvent.parameters.push(
    new ethereum.EventParam("value", ethereum.Value.fromUnsignedBigInt(value))
  )
  networkEarningsWithdrawnEvent.parameters.push(
    new ethereum.EventParam("recipient", ethereum.Value.fromAddress(recipient))
  )

  return networkEarningsWithdrawnEvent
}

export function createNetworkFeeUpdatedEvent(
  oldFee: BigInt,
  newFee: BigInt
): NetworkFeeUpdated {
  let networkFeeUpdatedEvent = changetype<NetworkFeeUpdated>(newMockEvent())

  networkFeeUpdatedEvent.parameters = new Array()

  networkFeeUpdatedEvent.parameters.push(
    new ethereum.EventParam("oldFee", ethereum.Value.fromUnsignedBigInt(oldFee))
  )
  networkFeeUpdatedEvent.parameters.push(
    new ethereum.EventParam("newFee", ethereum.Value.fromUnsignedBigInt(newFee))
  )

  return networkFeeUpdatedEvent
}

export function createOperatorAddedEvent(
  operatorId: BigInt,
  owner: Address,
  publicKey: Bytes,
  fee: BigInt
): OperatorAdded {
  let operatorAddedEvent = changetype<OperatorAdded>(newMockEvent())

  operatorAddedEvent.parameters = new Array()

  operatorAddedEvent.parameters.push(
    new ethereum.EventParam(
      "operatorId",
      ethereum.Value.fromUnsignedBigInt(operatorId)
    )
  )
  operatorAddedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  operatorAddedEvent.parameters.push(
    new ethereum.EventParam("publicKey", ethereum.Value.fromBytes(publicKey))
  )
  operatorAddedEvent.parameters.push(
    new ethereum.EventParam("fee", ethereum.Value.fromUnsignedBigInt(fee))
  )

  return operatorAddedEvent
}

export function createOperatorFeeDeclarationCancelledEvent(
  owner: Address,
  operatorId: BigInt
): OperatorFeeDeclarationCancelled {
  let operatorFeeDeclarationCancelledEvent =
    changetype<OperatorFeeDeclarationCancelled>(newMockEvent())

  operatorFeeDeclarationCancelledEvent.parameters = new Array()

  operatorFeeDeclarationCancelledEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  operatorFeeDeclarationCancelledEvent.parameters.push(
    new ethereum.EventParam(
      "operatorId",
      ethereum.Value.fromUnsignedBigInt(operatorId)
    )
  )

  return operatorFeeDeclarationCancelledEvent
}

export function createOperatorFeeDeclaredEvent(
  owner: Address,
  operatorId: BigInt,
  blockNumber: BigInt,
  fee: BigInt
): OperatorFeeDeclared {
  let operatorFeeDeclaredEvent = changetype<OperatorFeeDeclared>(newMockEvent())

  operatorFeeDeclaredEvent.parameters = new Array()

  operatorFeeDeclaredEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  operatorFeeDeclaredEvent.parameters.push(
    new ethereum.EventParam(
      "operatorId",
      ethereum.Value.fromUnsignedBigInt(operatorId)
    )
  )
  operatorFeeDeclaredEvent.parameters.push(
    new ethereum.EventParam(
      "blockNumber",
      ethereum.Value.fromUnsignedBigInt(blockNumber)
    )
  )
  operatorFeeDeclaredEvent.parameters.push(
    new ethereum.EventParam("fee", ethereum.Value.fromUnsignedBigInt(fee))
  )

  return operatorFeeDeclaredEvent
}

export function createOperatorFeeExecutedEvent(
  owner: Address,
  operatorId: BigInt,
  blockNumber: BigInt,
  fee: BigInt
): OperatorFeeExecuted {
  let operatorFeeExecutedEvent = changetype<OperatorFeeExecuted>(newMockEvent())

  operatorFeeExecutedEvent.parameters = new Array()

  operatorFeeExecutedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  operatorFeeExecutedEvent.parameters.push(
    new ethereum.EventParam(
      "operatorId",
      ethereum.Value.fromUnsignedBigInt(operatorId)
    )
  )
  operatorFeeExecutedEvent.parameters.push(
    new ethereum.EventParam(
      "blockNumber",
      ethereum.Value.fromUnsignedBigInt(blockNumber)
    )
  )
  operatorFeeExecutedEvent.parameters.push(
    new ethereum.EventParam("fee", ethereum.Value.fromUnsignedBigInt(fee))
  )

  return operatorFeeExecutedEvent
}

export function createOperatorFeeIncreaseLimitUpdatedEvent(
  value: BigInt
): OperatorFeeIncreaseLimitUpdated {
  let operatorFeeIncreaseLimitUpdatedEvent =
    changetype<OperatorFeeIncreaseLimitUpdated>(newMockEvent())

  operatorFeeIncreaseLimitUpdatedEvent.parameters = new Array()

  operatorFeeIncreaseLimitUpdatedEvent.parameters.push(
    new ethereum.EventParam("value", ethereum.Value.fromUnsignedBigInt(value))
  )

  return operatorFeeIncreaseLimitUpdatedEvent
}

export function createOperatorMaximumFeeUpdatedEvent(
  maxFee: BigInt
): OperatorMaximumFeeUpdated {
  let operatorMaximumFeeUpdatedEvent =
    changetype<OperatorMaximumFeeUpdated>(newMockEvent())

  operatorMaximumFeeUpdatedEvent.parameters = new Array()

  operatorMaximumFeeUpdatedEvent.parameters.push(
    new ethereum.EventParam("maxFee", ethereum.Value.fromUnsignedBigInt(maxFee))
  )

  return operatorMaximumFeeUpdatedEvent
}

export function createOperatorWhitelistUpdatedEvent(
  operatorId: BigInt,
  whitelisted: Address
): OperatorWhitelistUpdated {
  let operatorWhitelistUpdatedEvent =
    changetype<OperatorWhitelistUpdated>(newMockEvent())

  operatorWhitelistUpdatedEvent.parameters = new Array()

  operatorWhitelistUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "operatorId",
      ethereum.Value.fromUnsignedBigInt(operatorId)
    )
  )
  operatorWhitelistUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "whitelisted",
      ethereum.Value.fromAddress(whitelisted)
    )
  )

  return operatorWhitelistUpdatedEvent
}

export function createOperatorMultipleWhitelistRemovedEvent(
  operatorIds: Array<BigInt>,
  whitelistAddresses: Array<Address>
): OperatorMultipleWhitelistRemoved {
  let operatorMultipleWhitelistRemovedEvent =
    changetype<OperatorMultipleWhitelistRemoved>(newMockEvent())

  operatorMultipleWhitelistRemovedEvent.parameters = new Array()

  operatorMultipleWhitelistRemovedEvent.parameters.push(
    new ethereum.EventParam(
      "operatorIds",
      ethereum.Value.fromUnsignedBigIntArray(operatorIds)
    )
  )
  operatorMultipleWhitelistRemovedEvent.parameters.push(
    new ethereum.EventParam(
      "whitelistAddresses",
      ethereum.Value.fromAddressArray(whitelistAddresses)
    )
  )

  return operatorMultipleWhitelistRemovedEvent
}

export function createOperatorMultipleWhitelistUpdatedEvent(
  operatorIds: Array<BigInt>,
  whitelistAddresses: Array<Address>
): OperatorMultipleWhitelistUpdated {
  let operatorMultipleWhitelistUpdatedEvent =
    changetype<OperatorMultipleWhitelistUpdated>(newMockEvent())

  operatorMultipleWhitelistUpdatedEvent.parameters = new Array()

  operatorMultipleWhitelistUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "operatorIds",
      ethereum.Value.fromUnsignedBigIntArray(operatorIds)
    )
  )
  operatorMultipleWhitelistUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "whitelistAddresses",
      ethereum.Value.fromAddressArray(whitelistAddresses)
    )
  )

  return operatorMultipleWhitelistUpdatedEvent
}

export function createOperatorPrivacyStatusUpdatedEvent(
  operatorIds: Array<BigInt>,
  toPrivate: boolean
): OperatorPrivacyStatusUpdated {
  let operatorPrivacyStatusUpdatedEvent =
    changetype<OperatorPrivacyStatusUpdated>(newMockEvent())

  operatorPrivacyStatusUpdatedEvent.parameters = new Array()

  operatorPrivacyStatusUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "operatorIds",
      ethereum.Value.fromUnsignedBigIntArray(operatorIds)
    )
  )
  operatorPrivacyStatusUpdatedEvent.parameters.push(
    new ethereum.EventParam("toPrivate", ethereum.Value.fromBoolean(toPrivate))
  )

  return operatorPrivacyStatusUpdatedEvent
}

export function createOperatorRemovedEvent(
  operatorId: BigInt
): OperatorRemoved {
  let operatorRemovedEvent = changetype<OperatorRemoved>(newMockEvent())

  operatorRemovedEvent.parameters = new Array()

  operatorRemovedEvent.parameters.push(
    new ethereum.EventParam(
      "operatorId",
      ethereum.Value.fromUnsignedBigInt(operatorId)
    )
  )

  return operatorRemovedEvent
}

export function createOperatorWhitelistingContractUpdatedEvent(
  operatorIds: Array<BigInt>,
  whitelistingContract: Address
): OperatorWhitelistingContractUpdated {
  let operatorWhitelistingContractUpdatedEvent =
    changetype<OperatorWhitelistingContractUpdated>(newMockEvent())

  operatorWhitelistingContractUpdatedEvent.parameters = new Array()

  operatorWhitelistingContractUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "operatorIds",
      ethereum.Value.fromUnsignedBigIntArray(operatorIds)
    )
  )
  operatorWhitelistingContractUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "whitelistingContract",
      ethereum.Value.fromAddress(whitelistingContract)
    )
  )

  return operatorWhitelistingContractUpdatedEvent
}

export function createOperatorWithdrawnEvent(
  owner: Address,
  operatorId: BigInt,
  value: BigInt
): OperatorWithdrawn {
  let operatorWithdrawnEvent = changetype<OperatorWithdrawn>(newMockEvent())

  operatorWithdrawnEvent.parameters = new Array()

  operatorWithdrawnEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  operatorWithdrawnEvent.parameters.push(
    new ethereum.EventParam(
      "operatorId",
      ethereum.Value.fromUnsignedBigInt(operatorId)
    )
  )
  operatorWithdrawnEvent.parameters.push(
    new ethereum.EventParam("value", ethereum.Value.fromUnsignedBigInt(value))
  )

  return operatorWithdrawnEvent
}

export function createOwnershipTransferStartedEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferStarted {
  let ownershipTransferStartedEvent =
    changetype<OwnershipTransferStarted>(newMockEvent())

  ownershipTransferStartedEvent.parameters = new Array()

  ownershipTransferStartedEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferStartedEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferStartedEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent =
    changetype<OwnershipTransferred>(newMockEvent())

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

export function createValidatorAddedEvent(
  owner: Address,
  operatorIds: Array<BigInt>,
  publicKey: Bytes,
  shares: Bytes,
  cluster: ethereum.Tuple
): ValidatorAdded {
  let validatorAddedEvent = changetype<ValidatorAdded>(newMockEvent())

  validatorAddedEvent.parameters = new Array()

  validatorAddedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  validatorAddedEvent.parameters.push(
    new ethereum.EventParam(
      "operatorIds",
      ethereum.Value.fromUnsignedBigIntArray(operatorIds)
    )
  )
  validatorAddedEvent.parameters.push(
    new ethereum.EventParam("publicKey", ethereum.Value.fromBytes(publicKey))
  )
  validatorAddedEvent.parameters.push(
    new ethereum.EventParam("shares", ethereum.Value.fromBytes(shares))
  )
  validatorAddedEvent.parameters.push(
    new ethereum.EventParam("cluster", ethereum.Value.fromTuple(cluster))
  )

  return validatorAddedEvent
}

export function createValidatorExitedEvent(
  owner: Address,
  operatorIds: Array<BigInt>,
  publicKey: Bytes
): ValidatorExited {
  let validatorExitedEvent = changetype<ValidatorExited>(newMockEvent())

  validatorExitedEvent.parameters = new Array()

  validatorExitedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  validatorExitedEvent.parameters.push(
    new ethereum.EventParam(
      "operatorIds",
      ethereum.Value.fromUnsignedBigIntArray(operatorIds)
    )
  )
  validatorExitedEvent.parameters.push(
    new ethereum.EventParam("publicKey", ethereum.Value.fromBytes(publicKey))
  )

  return validatorExitedEvent
}

export function createValidatorRemovedEvent(
  owner: Address,
  operatorIds: Array<BigInt>,
  publicKey: Bytes,
  cluster: ethereum.Tuple
): ValidatorRemoved {
  let validatorRemovedEvent = changetype<ValidatorRemoved>(newMockEvent())

  validatorRemovedEvent.parameters = new Array()

  validatorRemovedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  validatorRemovedEvent.parameters.push(
    new ethereum.EventParam(
      "operatorIds",
      ethereum.Value.fromUnsignedBigIntArray(operatorIds)
    )
  )
  validatorRemovedEvent.parameters.push(
    new ethereum.EventParam("publicKey", ethereum.Value.fromBytes(publicKey))
  )
  validatorRemovedEvent.parameters.push(
    new ethereum.EventParam("cluster", ethereum.Value.fromTuple(cluster))
  )

  return validatorRemovedEvent
}
