import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import {
  Cluster,
  DAOValues,
  Operator,
  Oracle,
  Validator,
} from "../../generated/schema";

export function stampDAOUpdate(
  dao: DAOValues,
  blockNumber: BigInt,
  blockTimestamp: BigInt,
  transactionHash: Bytes,
): void {
  dao.lastUpdateBlockNumber = blockNumber;
  dao.lastUpdateBlockTimestamp = blockTimestamp;
  dao.lastUpdateTransactionHash = transactionHash;
}

function stampClusterUpdate(
  cluster: Cluster,
  blockNumber: BigInt,
  blockTimestamp: BigInt,
  transactionHash: Bytes,
): void {
  cluster.lastUpdateBlockNumber = blockNumber;
  cluster.lastUpdateBlockTimestamp = blockTimestamp;
  cluster.lastUpdateTransactionHash = transactionHash;
}

export function saveClusterProjection(
  cluster: Cluster,
  blockNumber: BigInt,
  blockTimestamp: BigInt,
  transactionHash: Bytes,
): void {
  stampClusterUpdate(cluster, blockNumber, blockTimestamp, transactionHash);
  cluster.save();
}

function stampOperatorUpdate(
  operator: Operator,
  blockNumber: BigInt,
  blockTimestamp: BigInt,
  transactionHash: Bytes,
): void {
  operator.lastUpdateBlockNumber = blockNumber;
  operator.lastUpdateBlockTimestamp = blockTimestamp;
  operator.lastUpdateTransactionHash = transactionHash;
}

export function saveOperatorProjection(
  operator: Operator,
  blockNumber: BigInt,
  blockTimestamp: BigInt,
  transactionHash: Bytes,
): void {
  stampOperatorUpdate(operator, blockNumber, blockTimestamp, transactionHash);
  operator.save();
}

function stampValidatorUpdate(
  validator: Validator,
  blockNumber: BigInt,
  blockTimestamp: BigInt,
  transactionHash: Bytes,
): void {
  validator.lastUpdateBlockNumber = blockNumber;
  validator.lastUpdateBlockTimestamp = blockTimestamp;
  validator.lastUpdateTransactionHash = transactionHash;
}

export function saveValidatorProjection(
  validator: Validator,
  blockNumber: BigInt,
  blockTimestamp: BigInt,
  transactionHash: Bytes,
): void {
  stampValidatorUpdate(validator, blockNumber, blockTimestamp, transactionHash);
  validator.save();
}

export function stampOracleUpdate(
  oracle: Oracle,
  blockNumber: BigInt,
  blockTimestamp: BigInt,
  transactionHash: Bytes,
): void {
  oracle.lastUpdateBlockNumber = blockNumber;
  oracle.lastUpdateBlockTimestamp = blockTimestamp;
  oracle.lastUpdateTransactionHash = transactionHash;
}
