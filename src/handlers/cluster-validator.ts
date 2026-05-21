import { BigInt, log } from "@graphprotocol/graph-ts";
import {
  ClusterDeposited as ClusterDepositedEvent,
  ClusterBalanceUpdated as ClusterBalanceUpdatedEvent,
  ClusterLiquidated as ClusterLiquidatedEvent,
  ClusterMigratedToETH as ClusterMigratedToETHEvent,
  ClusterReactivated as ClusterReactivatedEvent,
  ClusterWithdrawn as ClusterWithdrawnEvent,
  ValidatorAdded as ValidatorAddedEvent,
  ValidatorRemoved as ValidatorRemovedEvent,
} from "../../generated/SSVNetwork/SSVNetwork";
import {
  Cluster,
  ClusterBalanceUpdated,
  ClusterDeposited,
  ClusterLiquidated,
  ClusterMigratedToETH,
  ClusterReactivated,
  ClusterWithdrawn,
  DAOValues,
  Operator,
  Validator,
  ValidatorAdded,
  ValidatorRemoved,
} from "../../generated/schema";
import {
  applyOwnerValidatorAdded,
  applyOwnerValidatorRemoved,
  loadOrCreateValidatorOwnerAccount,
  loadRequiredClusterOwnerAccount,
} from "../helpers/account";
import {
  assignClusterMembership,
  assignClusterSnapshot,
  clusterUsesEthFees,
  loadRequiredLifecycleCluster,
} from "../helpers/cluster";
import {
  ETH_FEE_ASSET,
  SSV_FEE_ASSET,
  getInitialClusterFeeAsset,
} from "../helpers/dao";
import { buildClusterId, buildEventEntityId } from "../helpers/ids";
import { stampUpdate } from "../helpers/metadata";
import { loadLoopOperatorOrLog } from "../helpers/operator";

const VUNITS_PRECISION = BigInt.fromI32(100000);
const DEFAULT_BALANCE = BigInt.fromI32(32);

export function handleClusterBalanceUpdatedImplementation(
  event: ClusterBalanceUpdatedEvent,
): void {
  let entity = new ClusterBalanceUpdated(
    buildEventEntityId(event.transaction.hash, event.logIndex),
  );
  entity.owner = event.params.owner;
  entity.operatorIds = event.params.operatorIds;
  entity.effectiveBalance = event.params.effectiveBalance;
  entity.cluster_validatorCount = event.params.cluster.validatorCount;
  entity.cluster_networkFeeIndex = event.params.cluster.networkFeeIndex;
  entity.cluster_index = event.params.cluster.index;
  entity.cluster_active = event.params.cluster.active;
  entity.cluster_balance = event.params.cluster.balance;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let clusterId = buildClusterId(event.params.owner, event.params.operatorIds);
  let cluster = Cluster.load(clusterId);
  if (!cluster) {
    log.error(
      `Cluster ${clusterId} is being deposited, but it does not exist on the database`,
      [],
    );
    cluster = new Cluster(clusterId);
    cluster.effectiveBalance = DEFAULT_BALANCE;
    cluster.feeAsset = SSV_FEE_ASSET;
  }

  let owner = loadRequiredClusterOwnerAccount(event.params.owner);
  if (!owner) {
    return;
  }
  owner.effectiveBalance = owner.effectiveBalance
    .minus(cluster.effectiveBalance)
    .plus(event.params.effectiveBalance);

  assignClusterMembership(
    cluster,
    owner,
    event.params.operatorIds,
    event.params.cluster.validatorCount,
  );
  log.info(
    `Set validator count of cluster ${cluster.id} to ${event.params.cluster.validatorCount}`,
    [],
  );
  let clusterPreviousBalance = cluster.effectiveBalance;
  cluster.effectiveBalance = event.params.effectiveBalance;
  cluster.vUnits = cluster.effectiveBalance
    .times(VUNITS_PRECISION)
    .div(DEFAULT_BALANCE);
  assignClusterSnapshot(
    cluster,
    event.params.cluster.networkFeeIndex,
    event.params.cluster.index,
    event.params.cluster.active,
    event.params.cluster.balance,
  );
  stampUpdate(
    cluster,
    event.block.number,
    event.block.timestamp,
    event.transaction.hash,
  );
  cluster.save();

  let dao = DAOValues.load(event.address);
  if (!dao) {
    log.error(
      `New DAO Event, DAO values store with ID ${event.address.toHexString()} does not exist on the database and cannot be created. Update type: DECLARE_OPERATOR_FEE_PERIOD`,
      [],
    );
    return;
  }

  dao.updateType = "CLUSTER_BALANCE_UPDATED";
  dao.totalEffectiveBalance = dao.totalEffectiveBalance
    .minus(clusterPreviousBalance)
    .plus(cluster.effectiveBalance);
  if (clusterUsesEthFees(cluster)) {
    dao.effectiveBalanceETH = dao.effectiveBalanceETH
      .minus(clusterPreviousBalance)
      .plus(cluster.effectiveBalance);
  }
  dao.save();
}

export function handleClusterMigratedToETHImplementation(
  event: ClusterMigratedToETHEvent,
): void {
  let entity = new ClusterMigratedToETH(
    buildEventEntityId(event.transaction.hash, event.logIndex),
  );
  entity.owner = event.params.owner;
  entity.operatorIds = event.params.operatorIds;
  entity.ethDeposited = event.params.ethDeposited;
  entity.ssvRefunded = event.params.ssvRefunded;
  entity.effectiveBalance = event.params.effectiveBalance;
  entity.cluster_validatorCount = event.params.cluster.validatorCount;
  entity.cluster_networkFeeIndex = event.params.cluster.networkFeeIndex;
  entity.cluster_index = event.params.cluster.index;
  entity.cluster_active = event.params.cluster.active;
  entity.cluster_balance = event.params.cluster.balance;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  let owner = loadRequiredClusterOwnerAccount(event.params.owner);
  if (!owner) {
    return;
  }

  let clusterId = buildClusterId(event.params.owner, event.params.operatorIds);
  let cluster = Cluster.load(clusterId);
  if (!cluster) {
    log.error(
      `Cluster ${clusterId} is being deposited, but it does not exist on the database`,
      [],
    );
    cluster = new Cluster(clusterId);
  }

  entity.cluster = cluster.id;
  entity.save();

  assignClusterMembership(
    cluster,
    owner,
    event.params.operatorIds,
    event.params.cluster.validatorCount,
  );
  log.info(
    `Set validator count of cluster ${cluster.id} to ${event.params.cluster.validatorCount}`,
    [],
  );
  cluster.feeAsset = ETH_FEE_ASSET;
  cluster.effectiveBalance = event.params.effectiveBalance;
  cluster.vUnits = cluster.effectiveBalance
    .times(VUNITS_PRECISION)
    .div(DEFAULT_BALANCE);
  assignClusterSnapshot(
    cluster,
    event.params.cluster.networkFeeIndex,
    event.params.cluster.index,
    event.params.cluster.active,
    event.params.cluster.balance,
  );
  stampUpdate(
    cluster,
    event.block.number,
    event.block.timestamp,
    event.transaction.hash,
  );
  cluster.save();

  for (let i = 0; i < event.params.operatorIds.length; i++) {
    let operator = loadLoopOperatorOrLog(
      event.params.operatorIds[i],
      `Cluster is migrated to ETH, but Operator ${event.params.operatorIds[i]} does not exist on the database`,
      "information",
    );
    if (!operator) {
      continue;
    }

    stampUpdate(
      operator,
      event.block.number,
      event.block.timestamp,
      event.transaction.hash,
    );
    operator.save();
  }
}

export function handleClusterDepositedImplementation(
  event: ClusterDepositedEvent,
): void {
  let entity = new ClusterDeposited(
    buildEventEntityId(event.transaction.hash, event.logIndex),
  );
  entity.owner = event.params.owner;
  entity.operatorIds = event.params.operatorIds;
  entity.value = event.params.value;
  entity.cluster_validatorCount = event.params.cluster.validatorCount;
  entity.cluster_networkFeeIndex = event.params.cluster.networkFeeIndex;
  entity.cluster_index = event.params.cluster.index;
  entity.cluster_active = event.params.cluster.active;
  entity.cluster_balance = event.params.cluster.balance;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let owner = loadRequiredClusterOwnerAccount(event.params.owner);
  if (!owner) {
    return;
  }

  let clusterId = buildClusterId(event.params.owner, event.params.operatorIds);
  let cluster = loadRequiredLifecycleCluster(clusterId, "deposited");
  if (!cluster) {
    return;
  }

  assignClusterMembership(
    cluster,
    owner,
    event.params.operatorIds,
    event.params.cluster.validatorCount,
  );
  assignClusterSnapshot(
    cluster,
    event.params.cluster.networkFeeIndex,
    event.params.cluster.index,
    event.params.cluster.active,
    event.params.cluster.balance,
  );
  stampUpdate(
    cluster,
    event.block.number,
    event.block.timestamp,
    event.transaction.hash,
  );
  cluster.save();
}

export function handleClusterLiquidatedImplementation(
  event: ClusterLiquidatedEvent,
): void {
  let entity = new ClusterLiquidated(
    buildEventEntityId(event.transaction.hash, event.logIndex),
  );
  entity.owner = event.params.owner;
  entity.operatorIds = event.params.operatorIds;
  entity.cluster_validatorCount = event.params.cluster.validatorCount;
  entity.cluster_networkFeeIndex = event.params.cluster.networkFeeIndex;
  entity.cluster_index = event.params.cluster.index;
  entity.cluster_active = event.params.cluster.active;
  entity.cluster_balance = event.params.cluster.balance;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  let clusterId = buildClusterId(event.params.owner, event.params.operatorIds);
  let cluster = loadRequiredLifecycleCluster(clusterId, "liquidated");
  if (!cluster) {
    return;
  }

  let owner = loadRequiredClusterOwnerAccount(event.params.owner);
  if (!owner) {
    return;
  }
  owner.validatorCount = owner.validatorCount.minus(
    event.params.cluster.validatorCount,
  );
  owner.effectiveBalance = owner.effectiveBalance.minus(
    cluster.effectiveBalance,
  );
  owner.save();

  let dao = DAOValues.load(event.address);
  if (!dao) {
    log.error(
      `New DAO Event, DAO values store with ID ${event.address.toHexString()} does not exist on the database and cannot be created. Update type: DECLARE_OPERATOR_FEE_PERIOD`,
      [],
    );
    return;
  }
  dao.totalValidators = dao.totalValidators.minus(
    event.params.cluster.validatorCount,
  );
  dao.totalEffectiveBalance = dao.totalEffectiveBalance.minus(
    cluster.effectiveBalance,
  );
  if (clusterUsesEthFees(cluster)) {
    dao.effectiveBalanceETH = dao.effectiveBalanceETH.minus(
      cluster.effectiveBalance,
    );
  }
  dao.save();

  assignClusterMembership(
    cluster,
    owner,
    event.params.operatorIds,
    event.params.cluster.validatorCount,
  );
  assignClusterSnapshot(
    cluster,
    event.params.cluster.networkFeeIndex,
    event.params.cluster.index,
    event.params.cluster.active,
    event.params.cluster.balance,
  );
  stampUpdate(
    cluster,
    event.block.number,
    event.block.timestamp,
    event.transaction.hash,
  );
  cluster.save();

  entity.cluster = cluster.id;
  entity.save();

  for (let i = 0; i < event.params.operatorIds.length; i++) {
    let operator = loadLoopOperatorOrLog(
      event.params.operatorIds[i],
      `Removing validator data for Operator ${event.params.operatorIds[i]}, but it does not exist on the database`,
      "owner, publicKey and fee information",
    );
    if (!operator) {
      continue;
    }

    if (!operator.removed) {
      operator.validatorCount = operator.validatorCount.minus(
        event.params.cluster.validatorCount,
      );
      stampUpdate(
        operator,
        event.block.number,
        event.block.timestamp,
        event.transaction.hash,
      );
      operator.save();
    }
  }
}

export function handleClusterReactivatedImplementation(
  event: ClusterReactivatedEvent,
): void {
  let entity = new ClusterReactivated(
    buildEventEntityId(event.transaction.hash, event.logIndex),
  );
  entity.owner = event.params.owner;
  entity.operatorIds = event.params.operatorIds;
  entity.cluster_validatorCount = event.params.cluster.validatorCount;
  entity.cluster_networkFeeIndex = event.params.cluster.networkFeeIndex;
  entity.cluster_index = event.params.cluster.index;
  entity.cluster_active = event.params.cluster.active;
  entity.cluster_balance = event.params.cluster.balance;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  let clusterId = buildClusterId(event.params.owner, event.params.operatorIds);
  let cluster = loadRequiredLifecycleCluster(clusterId, "reactivated");
  if (!cluster) {
    return;
  }

  let owner = loadRequiredClusterOwnerAccount(event.params.owner);
  if (!owner) {
    return;
  }
  owner.validatorCount = owner.validatorCount.plus(
    event.params.cluster.validatorCount,
  );
  owner.effectiveBalance = owner.effectiveBalance.plus(
    cluster.effectiveBalance,
  );
  owner.save();

  let dao = DAOValues.load(event.address);
  if (!dao) {
    log.error(
      `New DAO Event, DAO values store with ID ${event.address.toHexString()} does not exist on the database and cannot be created. Update type: DECLARE_OPERATOR_FEE_PERIOD`,
      [],
    );
    return;
  }
  dao.totalValidators = dao.totalValidators.plus(
    event.params.cluster.validatorCount,
  );
  dao.totalEffectiveBalance = dao.totalEffectiveBalance.plus(
    cluster.effectiveBalance,
  );
  if (clusterUsesEthFees(cluster)) {
    dao.effectiveBalanceETH = dao.effectiveBalanceETH.plus(
      cluster.effectiveBalance,
    );
  }
  dao.save();

  assignClusterMembership(
    cluster,
    owner,
    event.params.operatorIds,
    event.params.cluster.validatorCount,
  );
  log.info(
    `Set validator count of cluster ${cluster.id} to ${event.params.cluster.validatorCount}`,
    [],
  );
  assignClusterSnapshot(
    cluster,
    event.params.cluster.networkFeeIndex,
    event.params.cluster.index,
    event.params.cluster.active,
    event.params.cluster.balance,
  );
  stampUpdate(
    cluster,
    event.block.number,
    event.block.timestamp,
    event.transaction.hash,
  );
  cluster.save();

  entity.cluster = cluster.id;
  entity.save();

  for (let i = 0; i < event.params.operatorIds.length; i++) {
    let operator = loadLoopOperatorOrLog(
      event.params.operatorIds[i],
      `Adding validator data for Operator ${event.params.operatorIds[i]}, but it does not exist on the database`,
      "owner, publicKey and fee information",
    );
    if (!operator) {
      continue;
    }

    if (!operator.removed) {
      operator.validatorCount = operator.validatorCount.plus(
        event.params.cluster.validatorCount,
      );
      stampUpdate(
        operator,
        event.block.number,
        event.block.timestamp,
        event.transaction.hash,
      );
      operator.save();
    }
  }
}

export function handleClusterWithdrawnImplementation(
  event: ClusterWithdrawnEvent,
): void {
  let entity = new ClusterWithdrawn(
    buildEventEntityId(event.transaction.hash, event.logIndex),
  );
  entity.owner = event.params.owner;
  entity.operatorIds = event.params.operatorIds;
  entity.value = event.params.value;
  entity.cluster_validatorCount = event.params.cluster.validatorCount;
  entity.cluster_networkFeeIndex = event.params.cluster.networkFeeIndex;
  entity.cluster_index = event.params.cluster.index;
  entity.cluster_active = event.params.cluster.active;
  entity.cluster_balance = event.params.cluster.balance;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let owner = loadRequiredClusterOwnerAccount(event.params.owner);
  if (!owner) {
    return;
  }

  let clusterId = buildClusterId(event.params.owner, event.params.operatorIds);
  let cluster = loadRequiredLifecycleCluster(clusterId, "withdrawn");
  if (!cluster) {
    return;
  }

  assignClusterMembership(
    cluster,
    owner,
    event.params.operatorIds,
    event.params.cluster.validatorCount,
  );
  log.info(
    `Set validator count of cluster ${cluster.id} to ${event.params.cluster.validatorCount}`,
    [],
  );
  assignClusterSnapshot(
    cluster,
    event.params.cluster.networkFeeIndex,
    event.params.cluster.index,
    event.params.cluster.active,
    event.params.cluster.balance,
  );
  stampUpdate(
    cluster,
    event.block.number,
    event.block.timestamp,
    event.transaction.hash,
  );
  cluster.save();
}

export function handleValidatorAddedImplementation(
  event: ValidatorAddedEvent,
): void {
  let entity = new ValidatorAdded(
    buildEventEntityId(event.transaction.hash, event.logIndex),
  );
  entity.owner = event.params.owner;
  entity.operatorIds = event.params.operatorIds;
  entity.publicKey = event.params.publicKey;
  entity.shares = event.params.shares;
  entity.cluster_validatorCount = event.params.cluster.validatorCount;
  entity.cluster_networkFeeIndex = event.params.cluster.networkFeeIndex;
  entity.cluster_index = event.params.cluster.index;
  entity.cluster_active = event.params.cluster.active;
  entity.cluster_balance = event.params.cluster.balance;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  let dao = DAOValues.load(event.address);
  if (!dao) {
    log.error(
      `New DAO Event, DAO values store with ID ${event.address.toHexString()} does not exist on the database and cannot be created. Update type: DECLARE_OPERATOR_FEE_PERIOD`,
      [],
    );
    return;
  }
  dao.updateType = "VALIDATOR_ADDED";
  dao.totalEffectiveBalance = dao.totalEffectiveBalance.plus(DEFAULT_BALANCE);
  dao.validatorsAdded = dao.validatorsAdded.plus(BigInt.fromI32(1));
  dao.totalValidators = dao.totalValidators.plus(BigInt.fromI32(1));

  let owner = loadOrCreateValidatorOwnerAccount(event.params.owner, dao);
  applyOwnerValidatorAdded(owner);
  owner.save();

  let clusterId = buildClusterId(event.params.owner, event.params.operatorIds);
  let cluster = Cluster.load(clusterId);
  if (!cluster) {
    log.info(
      `Validator ${event.params.publicKey.toHexString()} is being added to new Cluster ${clusterId}`,
      [],
    );
    cluster = new Cluster(clusterId);
    cluster.effectiveBalance = BigInt.fromI32(0);
    cluster.feeAsset = getInitialClusterFeeAsset(dao);
  }

  assignClusterMembership(
    cluster,
    owner,
    event.params.operatorIds,
    event.params.cluster.validatorCount,
  );
  log.info(
    `Set validator count of cluster ${cluster.id} to ${event.params.cluster.validatorCount}`,
    [],
  );
  cluster.effectiveBalance = cluster.effectiveBalance.plus(DEFAULT_BALANCE);
  cluster.vUnits = cluster.effectiveBalance
    .times(VUNITS_PRECISION)
    .div(DEFAULT_BALANCE);
  assignClusterSnapshot(
    cluster,
    event.params.cluster.networkFeeIndex,
    event.params.cluster.index,
    event.params.cluster.active,
    event.params.cluster.balance,
  );
  stampUpdate(
    cluster,
    event.block.number,
    event.block.timestamp,
    event.transaction.hash,
  );
  cluster.save();

  entity.cluster = cluster.id;
  entity.save();

  let validatorId = event.params.publicKey;
  let validator = Validator.load(validatorId);
  if (!validator) {
    log.info(
      `new Validator ${event.params.publicKey.toHexString()} being added to Cluster ${clusterId}`,
      [],
    );
    validator = new Validator(validatorId);
  }

  validator.owner = owner.id;
  validator.operators = event.params.operatorIds.map<string>((id: BigInt) =>
    id.toString(),
  );
  validator.cluster = cluster.id;
  validator.removed = false;
  validator.shares = event.params.shares;
  stampUpdate(
    validator,
    event.block.number,
    event.block.timestamp,
    event.transaction.hash,
  );
  validator.save();

  for (let i = 0; i < event.params.operatorIds.length; i++) {
    let operatorId = event.params.operatorIds[i].toString();
    let operator = Operator.load(operatorId);
    if (!operator) {
      log.error(
        `Adding validator data for Operator ${event.params.operatorIds[i]}, but it does not exist on the database`,
        [],
      );
      log.error(
        `Could not create ${operatorId} on the database, because of missing owner, publicKey and fee information`,
        [],
      );
      return;
    }
    operator.operatorId = event.params.operatorIds[i];
    operator.validatorCount = operator.validatorCount.plus(BigInt.fromI32(1));

    stampUpdate(
      operator,
      event.block.number,
      event.block.timestamp,
      event.transaction.hash,
    );
    operator.save();
  }

  log.info(
    `Dao Values update type: ${dao.updateType}, validator count: ${dao.totalValidators}`,
    [],
  );
  if (clusterUsesEthFees(cluster)) {
    dao.effectiveBalanceETH = dao.effectiveBalanceETH.plus(
      cluster.effectiveBalance,
    );
  }
  dao.save();
}

export function handleValidatorRemovedImplementation(
  event: ValidatorRemovedEvent,
): void {
  let entity = new ValidatorRemoved(
    buildEventEntityId(event.transaction.hash, event.logIndex),
  );
  entity.owner = event.params.owner;
  entity.operatorIds = event.params.operatorIds;
  entity.publicKey = event.params.publicKey;
  entity.cluster_validatorCount = event.params.cluster.validatorCount;
  entity.cluster_networkFeeIndex = event.params.cluster.networkFeeIndex;
  entity.cluster_index = event.params.cluster.index;
  entity.cluster_active = event.params.cluster.active;
  entity.cluster_balance = event.params.cluster.balance;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  let dao = DAOValues.load(event.address);
  if (!dao) {
    log.error(
      `New DAO Event, DAO values store with ID ${event.address.toHexString()} does not exist on the database and cannot be created. Update type: DECLARE_OPERATOR_FEE_PERIOD`,
      [],
    );
    return;
  }
  dao.updateType = "VALIDATOR_REMOVED";
  dao.totalEffectiveBalance = dao.totalEffectiveBalance.minus(DEFAULT_BALANCE);
  dao.validatorsRemoved = dao.validatorsRemoved.plus(BigInt.fromI32(1));
  dao.totalValidators = dao.totalValidators.minus(BigInt.fromI32(1));

  let owner = loadRequiredClusterOwnerAccount(event.params.owner);
  if (!owner) {
    return;
  }
  if (event.params.cluster.active) {
    applyOwnerValidatorRemoved(owner);
  }
  owner.save();

  let clusterId = buildClusterId(event.params.owner, event.params.operatorIds);
  let cluster = Cluster.load(clusterId);
  if (!cluster) {
    log.error(
      `Validator ${event.params.publicKey.toHexString()} is being removed from Cluster ${clusterId} which does not exist on DB`,
      [],
    );
    return;
  }

  assignClusterMembership(
    cluster,
    owner,
    event.params.operatorIds,
    event.params.cluster.validatorCount,
  );
  log.info(
    `Set validator count of cluster ${cluster.id} to ${event.params.cluster.validatorCount}`,
    [],
  );
  cluster.effectiveBalance = cluster.effectiveBalance.minus(DEFAULT_BALANCE);
  cluster.vUnits = cluster.effectiveBalance
    .times(VUNITS_PRECISION)
    .div(DEFAULT_BALANCE);
  assignClusterSnapshot(
    cluster,
    event.params.cluster.networkFeeIndex,
    event.params.cluster.index,
    event.params.cluster.active,
    event.params.cluster.balance,
  );
  stampUpdate(
    cluster,
    event.block.number,
    event.block.timestamp,
    event.transaction.hash,
  );
  cluster.save();

  entity.cluster = cluster.id;
  entity.save();

  let validatorId = event.params.publicKey;
  let validator = Validator.load(validatorId);
  if (!validator) {
    log.info(
      `new Validator ${event.params.publicKey.toHexString()} being added to Cluster ${clusterId}`,
      [],
    );
    log.error(
      `Could not create ${event.params.publicKey.toHexString()} on the database, because of missing shares information`,
      [],
    );
  } else {
    validator.operators = event.params.operatorIds.map<string>((id: BigInt) =>
      id.toString(),
    );
    validator.owner = owner.id;
    validator.removed = true;
    stampUpdate(
      validator,
      event.block.number,
      event.block.timestamp,
      event.transaction.hash,
    );
    validator.save();
  }

  for (let i = 0; i < event.params.operatorIds.length; i++) {
    let operator = loadLoopOperatorOrLog(
      event.params.operatorIds[i],
      `Removing validator data for Operator ${event.params.operatorIds[i]}, but it does not exist on the database`,
      "owner, publicKey and fee information",
    );
    if (!operator) {
      continue;
    }

    if (!operator.removed && cluster.active) {
      operator.operatorId = event.params.operatorIds[i];
      operator.validatorCount = operator.validatorCount.minus(
        BigInt.fromI32(1),
      );
      stampUpdate(
        operator,
        event.block.number,
        event.block.timestamp,
        event.transaction.hash,
      );
      operator.save();
    }
  }

  log.info(
    `Dao Values update type: ${dao.updateType}, validator count: ${dao.totalValidators}`,
    [],
  );
  if (clusterUsesEthFees(cluster)) {
    dao.effectiveBalanceETH = dao.effectiveBalanceETH.minus(
      cluster.effectiveBalance,
    );
  }
  dao.save();
}
