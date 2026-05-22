import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import {
  DeclareOperatorFeePeriodUpdated as DeclareOperatorFeePeriodUpdatedEvent,
  ExecuteOperatorFeePeriodUpdated as ExecuteOperatorFeePeriodUpdatedEvent,
  LiquidationThresholdPeriodUpdated as LiquidationThresholdPeriodUpdatedEvent,
  LiquidationThresholdPeriodSSVUpdated as LiquidationThresholdPeriodSSVUpdatedEvent,
  MinimumLiquidationCollateralUpdated as MinimumLiquidationCollateralUpdatedEvent,
  MinimumLiquidationCollateralSSVUpdated as MinimumLiquidationCollateralSSVUpdatedEvent,
  NetworkFeeUpdated as NetworkFeeUpdatedEvent,
  OperatorFeeIncreaseLimitUpdated as OperatorFeeIncreaseLimitUpdatedEvent,
  OperatorMaximumFeeUpdated as OperatorMaximumFeeUpdatedEvent,
  QuorumUpdated as QuorumUpdatedEvent,
  SSVNetworkUpgradeBlock as SSVNetworkUpgradeBlockEvent,
} from "../../generated/SSVNetwork/SSVNetwork";
import {
  DAOValues,
  DeclareOperatorFeePeriodUpdated,
  ExecuteOperatorFeePeriodUpdated,
  LiquidationThresholdPeriodUpdated,
  LiquidationThresholdPeriodSSVUpdated,
  MinimumLiquidationCollateralUpdated,
  MinimumLiquidationCollateralSSVUpdated,
  NetworkFeeUpdated,
  NetworkFeeUpdatedSSV,
  OperatorFeeIncreaseLimitUpdated,
  OperatorMaximumFeeUpdated,
  QuorumUpdated,
  SSVNetworkUpgradeBlock,
} from "../../generated/schema";
import {
  buildEventEntityId,
  createDefaultDAOValues,
  legacyDaoFeeEventTargetsPrimaryFields,
  stampUpdate,
  usesEthFeeRegime,
} from "../helpers";

const SSV_STAKING_UPDATE_BLOCK_NUMBER = BigInt.fromI32(2442571);

function loadOrCreateDAOValuesWithWarning(
  address: Address,
  blockNumber: BigInt,
  blockTimestamp: BigInt,
  transactionHash: Bytes,
  updateType: string,
): DAOValues {
  let dao = DAOValues.load(address);
  if (!dao) {
    log.warning(
      `New DAO Event, DAO values store with ID ${address.toHexString()} does not exist on the database, creating it. Update type: ${updateType}`,
      [],
    );
    dao = createDefaultDAOValues(
      address,
      blockNumber,
      blockTimestamp,
      transactionHash,
    );
  }

  return dao;
}

export function handleDeclareOperatorFeePeriodUpdated(
  event: DeclareOperatorFeePeriodUpdatedEvent,
): void {
  let entity = new DeclareOperatorFeePeriodUpdated(
    buildEventEntityId(event.transaction.hash, event.logIndex),
  );
  entity.value = event.params.value;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let dao = loadOrCreateDAOValuesWithWarning(
    event.address,
    event.block.number,
    event.block.timestamp,
    event.transaction.hash,
    "OPERATOR_MAX_FEE",
  );
  dao.updateType = "DECLARE_OPERATOR_FEE_PERIOD";
  dao.declareOperatorFeePeriod = event.params.value;
  stampUpdate(
    dao,
    event.block.number,
    event.block.timestamp,
    event.transaction.hash,
  );
  dao.save();
}

export function handleExecuteOperatorFeePeriodUpdated(
  event: ExecuteOperatorFeePeriodUpdatedEvent,
): void {
  let entity = new ExecuteOperatorFeePeriodUpdated(
    buildEventEntityId(event.transaction.hash, event.logIndex),
  );
  entity.value = event.params.value;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let dao = loadOrCreateDAOValuesWithWarning(
    event.address,
    event.block.number,
    event.block.timestamp,
    event.transaction.hash,
    "EXECUTE_OPERATOR_FEE_PERIOD",
  );
  dao.updateType = "EXECUTE_OPERATOR_FEE_PERIOD";
  dao.executeOperatorFeePeriod = event.params.value;
  stampUpdate(
    dao,
    event.block.number,
    event.block.timestamp,
    event.transaction.hash,
  );
  dao.save();
}

export function handleLiquidationThresholdPeriodUpdated(
  event: LiquidationThresholdPeriodUpdatedEvent,
): void {
  let entity = new LiquidationThresholdPeriodUpdated(
    buildEventEntityId(event.transaction.hash, event.logIndex),
  );
  entity.value = event.params.value;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let dao = loadOrCreateDAOValuesWithWarning(
    event.address,
    event.block.number,
    event.block.timestamp,
    event.transaction.hash,
    "LIQUIDATION_THRESHOLD",
  );
  if (legacyDaoFeeEventTargetsPrimaryFields(dao)) {
    log.info(
      `Liquidation Threshold Period for SSV fees updated to ${event.params.value} at block ${event.block.number}`,
      [],
    );
    dao.updateType = "LIQUIDATION_THRESHOLD_SSV";
    dao.liquidationThreshold = event.params.value;
  } else {
    log.error(
      `Liquidation Threshold Period for ETH fees updated to ${event.params.value} at block ${event.block.number}`,
      [],
    );
    dao.updateType = "LIQUIDATION_THRESHOLD";
    dao.liquidationThresholdSSV = event.params.value;
  }
  stampUpdate(
    dao,
    event.block.number,
    event.block.timestamp,
    event.transaction.hash,
  );
  dao.save();
}

export function handleLiquidationThresholdPeriodSSVUpdated(
  event: LiquidationThresholdPeriodSSVUpdatedEvent,
): void {
  let entity = new LiquidationThresholdPeriodSSVUpdated(
    buildEventEntityId(event.transaction.hash, event.logIndex),
  );
  entity.value = event.params.value;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let dao = loadOrCreateDAOValuesWithWarning(
    event.address,
    event.block.number,
    event.block.timestamp,
    event.transaction.hash,
    "LIQUIDATION_THRESHOLD_SSV",
  );
  dao.updateType = "LIQUIDATION_THRESHOLD_SSV";
  dao.liquidationThresholdSSV = event.params.value;
  stampUpdate(
    dao,
    event.block.number,
    event.block.timestamp,
    event.transaction.hash,
  );
  dao.save();
}

export function handleMinimumLiquidationCollateralUpdated(
  event: MinimumLiquidationCollateralUpdatedEvent,
): void {
  let entity = new MinimumLiquidationCollateralUpdated(
    buildEventEntityId(event.transaction.hash, event.logIndex),
  );
  entity.value = event.params.value;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let dao = loadOrCreateDAOValuesWithWarning(
    event.address,
    event.block.number,
    event.block.timestamp,
    event.transaction.hash,
    "MIN_LIQUIDATION_COLLATERAL",
  );

  if (legacyDaoFeeEventTargetsPrimaryFields(dao)) {
    log.info(
      `Minimum Liquidation Collateral for SSV fees updated to ${event.params.value} at block ${event.block.number}`,
      [],
    );
    dao.updateType = "MIN_LIQUIDATION_COLLATERAL";
    dao.minimumLiquidationCollateral = event.params.value;
  } else {
    log.error(
      `Minimum Liquidation Collateral for ETH fees updated to ${event.params.value} at block ${event.block.number}`,
      [],
    );
    dao.updateType = "MIN_LIQUIDATION_COLLATERAL_SSV";
    dao.minimumLiquidationCollateralSSV = event.params.value;
  }
  stampUpdate(
    dao,
    event.block.number,
    event.block.timestamp,
    event.transaction.hash,
  );
  dao.save();
}

export function handleMinimumLiquidationCollateralSSVUpdated(
  event: MinimumLiquidationCollateralSSVUpdatedEvent,
): void {
  let entity = new MinimumLiquidationCollateralSSVUpdated(
    buildEventEntityId(event.transaction.hash, event.logIndex),
  );
  entity.value = event.params.value;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let dao = loadOrCreateDAOValuesWithWarning(
    event.address,
    event.block.number,
    event.block.timestamp,
    event.transaction.hash,
    "MIN_LIQUIDATION_COLLATERAL_SSV",
  );
  dao.updateType = "MIN_LIQUIDATION_COLLATERAL_SSV";
  dao.minimumLiquidationCollateralSSV = event.params.value;
  stampUpdate(
    dao,
    event.block.number,
    event.block.timestamp,
    event.transaction.hash,
  );
  dao.save();
}

export function handleNetworkFeeUpdated(event: NetworkFeeUpdatedEvent): void {
  let entity = new NetworkFeeUpdated(
    buildEventEntityId(event.transaction.hash, event.logIndex),
  );
  entity.oldFee = event.params.oldFee;
  entity.newFee = event.params.newFee;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
  log.info(
    `New DAO Event, Update type: NETWORK_FEE. New fee: ${event.params.newFee.toString()}. Old fee: ${event.params.oldFee.toString()}. Block number: ${event.block.number.toString()}`,
    [],
  );

  let dao = loadOrCreateDAOValuesWithWarning(
    event.address,
    event.block.number,
    event.block.timestamp,
    event.transaction.hash,
    "NETWORK_FEE",
  );
  dao.updateType = "NETWORK_FEE";

  if (usesEthFeeRegime(dao)) {
    log.info(
      `Network fee updated event block number ${event.block.number.toString()} is after SSV staking update block number ${SSV_STAKING_UPDATE_BLOCK_NUMBER.toString()}, updating ETH network fee`,
      [],
    );

    dao.networkFeeIndex = dao.networkFeeIndex.plus(
      event.block.number
        .minus(dao.networkFeeIndexBlockNumber)
        .times(dao.networkFee),
    );
    dao.networkFeeIndexBlockNumber = event.block.number;
    dao.networkFee = event.params.newFee;
  } else {
    log.info(
      `Network fee updated event block number ${event.block.number.toString()} is before SSV staking update block number ${SSV_STAKING_UPDATE_BLOCK_NUMBER.toString()}, updating SSV network fee`,
      [],
    );
    dao.networkFeeIndexSSV = dao.networkFeeIndexSSV.plus(
      event.block.number
        .minus(dao.networkFeeIndexBlockNumberSSV)
        .times(dao.networkFeeSSV),
    );
    dao.networkFeeIndexBlockNumberSSV = event.block.number;
    dao.networkFeeSSV = event.params.newFee;
  }
  stampUpdate(
    dao,
    event.block.number,
    event.block.timestamp,
    event.transaction.hash,
  );
  dao.save();
}

export function handleNetworkFeeUpdatedSSV(
  event: NetworkFeeUpdatedEvent,
): void {
  let entity = new NetworkFeeUpdatedSSV(
    buildEventEntityId(event.transaction.hash, event.logIndex),
  );
  entity.oldFee = event.params.oldFee;
  entity.newFee = event.params.newFee;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let dao = loadOrCreateDAOValuesWithWarning(
    event.address,
    event.block.number,
    event.block.timestamp,
    event.transaction.hash,
    "NETWORK_FEE_SSV",
  );
  dao.updateType = "NETWORK_FEE_SSV";
  dao.networkFeeIndexSSV = dao.networkFeeIndexSSV.plus(
    event.block.number
      .minus(dao.networkFeeIndexBlockNumberSSV)
      .times(dao.networkFeeSSV),
  );
  dao.networkFeeIndexBlockNumberSSV = event.block.number;
  dao.networkFeeSSV = event.params.newFee;
  stampUpdate(
    dao,
    event.block.number,
    event.block.timestamp,
    event.transaction.hash,
  );
  dao.save();
}

export function handleOperatorFeeIncreaseLimitUpdated(
  event: OperatorFeeIncreaseLimitUpdatedEvent,
): void {
  let entity = new OperatorFeeIncreaseLimitUpdated(
    buildEventEntityId(event.transaction.hash, event.logIndex),
  );
  entity.value = event.params.value;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let dao = loadOrCreateDAOValuesWithWarning(
    event.address,
    event.block.number,
    event.block.timestamp,
    event.transaction.hash,
    "OPERATOR_FEE_INCREASE_LIMIT",
  );
  dao.updateType = "OPERATOR_FEE_INCREASE_LIMIT";
  dao.operatorFeeIncreaseLimit = event.params.value;
  stampUpdate(
    dao,
    event.block.number,
    event.block.timestamp,
    event.transaction.hash,
  );
  dao.save();
}

export function handleOperatorMaximumFeeUpdated(
  event: OperatorMaximumFeeUpdatedEvent,
): void {
  let entity = new OperatorMaximumFeeUpdated(
    buildEventEntityId(event.transaction.hash, event.logIndex),
  );
  entity.maxFee = event.params.maxFee;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let dao = loadOrCreateDAOValuesWithWarning(
    event.address,
    event.block.number,
    event.block.timestamp,
    event.transaction.hash,
    "DECLARE_OPERATOR_FEE_PERIOD",
  );
  dao.updateType = "OPERATOR_MAX_FEE";
  dao.operatorMaximumFee = event.params.maxFee;
  stampUpdate(
    dao,
    event.block.number,
    event.block.timestamp,
    event.transaction.hash,
  );
  dao.save();
}

export function handleQuorumUpdated(event: QuorumUpdatedEvent): void {
  let entity = new QuorumUpdated(
    buildEventEntityId(event.transaction.hash, event.logIndex),
  );
  entity.newQuorum = event.params.newQuorum;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
  let dao = DAOValues.load(event.address);
  if (!dao) {
    log.error(
      `New DAO Event, DAO values store with ID ${event.address.toHexString()} does not exist on the database and cannot be created. Update type: QUORUM_UPDATED`,
      [],
    );
    return;
  }

  dao.updateType = "QUORUM_UPDATED";
  dao.quorum = event.params.newQuorum;
  stampUpdate(
    dao,
    event.block.number,
    event.block.timestamp,
    event.transaction.hash,
  );

  log.info(
    `Dao Values update type: ${dao.updateType}, new quorum: ${dao.quorum}`,
    [],
  );
  dao.save();
}

export function handleSSVNetworkUpgradeBlock(
  event: SSVNetworkUpgradeBlockEvent,
): void {
  let entity = new SSVNetworkUpgradeBlock(
    buildEventEntityId(event.transaction.hash, event.logIndex),
  );

  entity.version = event.params.version;
  entity.blockNumber = event.params.blockNumber;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let dao = DAOValues.load(event.address);
  if (!dao) {
    log.error(
      `New DAO Event, DAO values store with ID ${event.address.toHexString()} does not exist on the database and cannot be created. Update type: SSV_NETWORK_UPGRADE`,
      [],
    );
    return;
  }
  dao.updateType = "SSV_NETWORK_UPGRADE";
  dao.version = event.params.version;
  if (usesEthFeeRegime(dao)) {
    dao.networkFeeIndex = BigInt.zero();
    dao.networkFeeIndexBlockNumber = event.params.blockNumber;
  }
  stampUpdate(
    dao,
    event.block.number,
    event.block.timestamp,
    event.transaction.hash,
  );

  log.info(
    `Dao Values update type: ${dao.updateType}, contract upgraded to version ${dao.version}`,
    [],
  );
  dao.save();
}
