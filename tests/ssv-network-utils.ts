import { newMockEvent } from "matchstick-as"
import { Address, BigInt, Bytes, ethereum } from "@graphprotocol/graph-ts"
import {
  NetworkFeeUpdated,
  OperatorAdded,
  OperatorWhitelistUpdated,
  OperatorWhitelistingContractUpdated,
  SSVNetworkUpgradeBlock,
  ValidatorAdded,
} from "../generated/SSVNetwork/SSVNetwork"

export function setEventMetadata(
  event: ethereum.Event,
  address: Address,
  blockNumber: i32,
  blockTimestamp: i32,
  logIndex: i32,
  transactionHash: string,
): void {
  event.address = address
  event.block.number = BigInt.fromI32(blockNumber)
  event.block.timestamp = BigInt.fromI32(blockTimestamp)
  event.logIndex = BigInt.fromI32(logIndex)
  event.transaction.hash = Bytes.fromHexString(transactionHash) as Bytes
}

export function createClusterSnapshot(
  validatorCount: BigInt,
  networkFeeIndex: BigInt,
  index: BigInt,
  active: boolean,
  balance: BigInt,
): ethereum.Tuple {
  let cluster = new ethereum.Tuple()

  cluster.push(ethereum.Value.fromUnsignedBigInt(validatorCount))
  cluster.push(ethereum.Value.fromUnsignedBigInt(networkFeeIndex))
  cluster.push(ethereum.Value.fromUnsignedBigInt(index))
  cluster.push(ethereum.Value.fromBoolean(active))
  cluster.push(ethereum.Value.fromUnsignedBigInt(balance))

  return cluster
}

export function createNetworkFeeUpdatedEvent(
  oldFee: BigInt,
  newFee: BigInt,
): NetworkFeeUpdated {
  let event = changetype<NetworkFeeUpdated>(newMockEvent())

  event.parameters = new Array()
  event.parameters.push(
    new ethereum.EventParam("oldFee", ethereum.Value.fromUnsignedBigInt(oldFee)),
  )
  event.parameters.push(
    new ethereum.EventParam("newFee", ethereum.Value.fromUnsignedBigInt(newFee)),
  )

  return event
}

export function createOperatorAddedEvent(
  operatorId: BigInt,
  owner: Address,
  publicKey: Bytes,
  fee: BigInt,
): OperatorAdded {
  let event = changetype<OperatorAdded>(newMockEvent())

  event.parameters = new Array()
  event.parameters.push(
    new ethereum.EventParam(
      "operatorId",
      ethereum.Value.fromUnsignedBigInt(operatorId),
    ),
  )
  event.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner)),
  )
  event.parameters.push(
    new ethereum.EventParam("publicKey", ethereum.Value.fromBytes(publicKey)),
  )
  event.parameters.push(
    new ethereum.EventParam("fee", ethereum.Value.fromUnsignedBigInt(fee)),
  )

  return event
}

export function createOperatorWhitelistUpdatedEvent(
  operatorId: BigInt,
  whitelisted: Address,
): OperatorWhitelistUpdated {
  let event = changetype<OperatorWhitelistUpdated>(newMockEvent())

  event.parameters = new Array()
  event.parameters.push(
    new ethereum.EventParam(
      "operatorId",
      ethereum.Value.fromUnsignedBigInt(operatorId),
    ),
  )
  event.parameters.push(
    new ethereum.EventParam(
      "whitelisted",
      ethereum.Value.fromAddress(whitelisted),
    ),
  )

  return event
}

export function createOperatorWhitelistingContractUpdatedEvent(
  operatorIds: BigInt[],
  whitelistingContract: Address,
): OperatorWhitelistingContractUpdated {
  let event = changetype<OperatorWhitelistingContractUpdated>(newMockEvent())

  event.parameters = new Array()
  event.parameters.push(
    new ethereum.EventParam(
      "operatorIds",
      ethereum.Value.fromUnsignedBigIntArray(operatorIds),
    ),
  )
  event.parameters.push(
    new ethereum.EventParam(
      "whitelistingContract",
      ethereum.Value.fromAddress(whitelistingContract),
    ),
  )

  return event
}

export function createSSVNetworkUpgradeBlockEvent(
  version: string,
  blockNumber: BigInt,
): SSVNetworkUpgradeBlock {
  let event = changetype<SSVNetworkUpgradeBlock>(newMockEvent())

  event.parameters = new Array()
  event.parameters.push(
    new ethereum.EventParam("version", ethereum.Value.fromString(version)),
  )
  event.parameters.push(
    new ethereum.EventParam(
      "blockNumber",
      ethereum.Value.fromUnsignedBigInt(blockNumber),
    ),
  )

  return event
}

export function createValidatorAddedEvent(
  owner: Address,
  operatorIds: BigInt[],
  publicKey: Bytes,
  shares: Bytes,
  cluster: ethereum.Tuple,
): ValidatorAdded {
  let event = changetype<ValidatorAdded>(newMockEvent())

  event.parameters = new Array()
  event.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner)),
  )
  event.parameters.push(
    new ethereum.EventParam(
      "operatorIds",
      ethereum.Value.fromUnsignedBigIntArray(operatorIds),
    ),
  )
  event.parameters.push(
    new ethereum.EventParam("publicKey", ethereum.Value.fromBytes(publicKey)),
  )
  event.parameters.push(
    new ethereum.EventParam("shares", ethereum.Value.fromBytes(shares)),
  )
  event.parameters.push(
    new ethereum.EventParam("cluster", ethereum.Value.fromTuple(cluster)),
  )

  return event
}
