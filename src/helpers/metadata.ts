import { BigInt, Bytes, Entity, Value } from "@graphprotocol/graph-ts";

export function stampUpdate(
  entity: Entity,
  blockNumber: BigInt,
  blockTimestamp: BigInt,
  transactionHash: Bytes,
): void {
  entity.set("lastUpdateBlockNumber", Value.fromBigInt(blockNumber));
  entity.set("lastUpdateBlockTimestamp", Value.fromBigInt(blockTimestamp));
  entity.set("lastUpdateTransactionHash", Value.fromBytes(transactionHash));
}
