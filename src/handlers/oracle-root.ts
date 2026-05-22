import { log } from "@graphprotocol/graph-ts";
import {
  OracleReplaced as OracleReplacedEvent,
  RootCommitted as RootCommittedEvent,
  WeightedRootProposed as WeightedRootProposedEvent,
} from "../../generated/SSVNetwork/SSVNetwork";
import {
  DAOValues,
  Oracle,
  OracleReplaced,
  RootCommitted,
  WeightedRootProposed,
} from "../../generated/schema";
import { buildEventEntityId, stampUpdate } from "../helpers";

export function handleRootCommittedImplementation(
  event: RootCommittedEvent,
): void {
  let entity = new RootCommitted(
    buildEventEntityId(event.transaction.hash, event.logIndex),
  );
  entity.merkleRoot = event.params.merkleRoot;
  entity.sender = event.transaction.from;
  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let dao = DAOValues.load(event.address);
  if (!dao) {
    log.error(
      `New DAO Event, DAO values store with ID ${event.address.toHexString()} does not exist on the database and cannot be created. Update type: ROOT_COMMITTED`,
      [],
    );
    return;
  }
  dao.updateType = "ROOT_COMMITTED";
  dao.latestMerkleRoot = event.params.merkleRoot;
  stampUpdate(dao, event.block.number, event.block.timestamp, event.transaction.hash);

  log.info(
    `Dao Values update type: ${dao.updateType}, new latest merkle root: ${dao.latestMerkleRoot.toHexString()}`,
    [],
  );
  dao.save();
}

export function handleOracleReplacedImplementation(
  event: OracleReplacedEvent,
): void {
  let entity = new OracleReplaced(
    buildEventEntityId(event.transaction.hash, event.logIndex),
  );
  entity.oracleId = event.params.oracleId;
  entity.oldOracle = event.params.oldOracle;
  entity.newOracle = event.params.newOracle;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let oracleId = event.params.oracleId.toString();
  let oracle = Oracle.load(oracleId);
  if (!oracle) {
    oracle = new Oracle(oracleId);
    oracle.oracleId = event.params.oracleId;
    stampUpdate(
      oracle,
      event.block.number,
      event.block.timestamp,
      event.transaction.hash,
    );
  }
  oracle.oracleAddress = event.params.newOracle;
  oracle.save();
}

export function handleWeightedRootProposedImplementation(
  event: WeightedRootProposedEvent,
): void {
  let entity = new WeightedRootProposed(
    buildEventEntityId(event.transaction.hash, event.logIndex),
  );
  entity.merkleRoot = event.params.merkleRoot;
  entity.accumulatedWeight = event.params.accumulatedWeight;
  entity.quorum = event.params.quorum;
  entity.oracleId = event.params.oracleId;
  entity.oracle = event.params.oracle;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}
