import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";

export function buildEventEntityId(
  transactionHash: Bytes,
  logIndex: BigInt,
): string {
  return `${transactionHash.toHexString()}-${logIndex.toString().padStart(5, "0")}`;
}

export function buildClusterId(owner: Address, operatorIds: BigInt[]): string {
  return `${owner.toHexString()}-${operatorIds.join("-")}`;
}
