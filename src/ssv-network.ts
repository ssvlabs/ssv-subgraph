import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import {
  ClusterBalanceUpdated as ClusterBalanceUpdatedEvent,
  ClusterMigratedToETH as ClusterMigratedToETHEvent,
  ClusterDeposited as ClusterDepositedEvent,
  ClusterLiquidated as ClusterLiquidatedEvent,
  ClusterReactivated as ClusterReactivatedEvent,
  ClusterWithdrawn as ClusterWithdrawnEvent,
  DeclareOperatorFeePeriodUpdated as DeclareOperatorFeePeriodUpdatedEvent,
  ExecuteOperatorFeePeriodUpdated as ExecuteOperatorFeePeriodUpdatedEvent,
  ERC20Rescued as ERC20RescuedEvent,
  FeeRecipientAddressUpdated as FeeRecipientAddressUpdatedEvent,
  FeesSynced as FeesSyncedEvent,
  LiquidationThresholdPeriodUpdated as LiquidationThresholdPeriodUpdatedEvent,
  LiquidationThresholdPeriodSSVUpdated as LiquidationThresholdPeriodSSVUpdatedEvent,
  MinimumLiquidationCollateralUpdated as MinimumLiquidationCollateralUpdatedEvent,
  MinimumLiquidationCollateralSSVUpdated as MinimumLiquidationCollateralSSVUpdatedEvent,
  NetworkEarningsWithdrawn as NetworkEarningsWithdrawnEvent,
  NetworkFeeUpdated as NetworkFeeUpdatedEvent,
  OperatorAdded as OperatorAddedEvent,
  OperatorFeeDeclarationCancelled as OperatorFeeDeclarationCancelledEvent,
  OperatorFeeDeclared as OperatorFeeDeclaredEvent,
  OperatorFeeExecuted as OperatorFeeExecutedEvent,
  OperatorFeeIncreaseLimitUpdated as OperatorFeeIncreaseLimitUpdatedEvent,
  OperatorMaximumFeeUpdated as OperatorMaximumFeeUpdatedEvent,
  OperatorRemoved as OperatorRemovedEvent,
  OperatorWhitelistingContractUpdated as OperatorWhitelistingContractUpdatedEvent,
  OperatorWhitelistUpdated as OperatorWhitelistUpdatedEvent,
  OperatorMultipleWhitelistRemoved as OperatorMultipleWhitelistRemovedEvent,
  OperatorMultipleWhitelistUpdated as OperatorMultipleWhitelistUpdatedEvent,
  OperatorPrivacyStatusUpdated as OperatorPrivacyStatusUpdatedEvent,
  OperatorWithdrawn as OperatorWithdrawnEvent,
  OracleReplaced as OracleReplacedEvent,
  QuorumUpdated as QuorumUpdatedEvent,
  RewardsClaimed as RewardsClaimedEvent,
  RewardsSettled as RewardsSettledEvent,
  RootCommitted as RootCommittedEvent,
  Staked as StakedEvent,
  SSVNetworkUpgradeBlock as SSVNetworkUpgradeBlockEvent,
  UnstakeRequested as UnstakeRequestedEvent,
  UnstakedWithdrawn as UnstakedWithdrawnEvent,
  ValidatorAdded as ValidatorAddedEvent,
  ValidatorRemoved as ValidatorRemovedEvent,
  WeightedRootProposed as WeightedRootProposedEvent,
} from "../generated/SSVNetwork/SSVNetwork";
import {
  Validator,
  Cluster,
  Operator,
  Account,
  ClusterDeposited,
  ClusterLiquidated,
  ClusterReactivated,
  ClusterWithdrawn,
  DeclareOperatorFeePeriodUpdated,
  DelegationUpdated,
  ERC20Rescued,
  ExecuteOperatorFeePeriodUpdated,
  FeeRecipientAddressUpdated,
  FeesSynced,
  LiquidationThresholdPeriodUpdated,
  LiquidationThresholdPeriodSSVUpdated,
  MinimumLiquidationCollateralUpdated,
  MinimumLiquidationCollateralSSVUpdated,
  NetworkEarningsWithdrawn,
  NetworkFeeUpdated,
  NetworkFeeUpdatedSSV,
  OperatorAdded,
  OperatorFeeDeclarationCancelled,
  OperatorFeeDeclared,
  OperatorFeeExecuted,
  OperatorFeeIncreaseLimitUpdated,
  OperatorMaximumFeeUpdated,
  OperatorRemoved,
  OperatorWhitelistUpdated,
  OperatorMultipleWhitelistUpdated,
  OperatorMultipleWhitelistRemoved,
  OperatorWhitelistingContractUpdated,
  OperatorPrivacyStatusUpdated,
  OperatorWithdrawn,
  OracleReplaced,
  QuorumUpdated,
  RewardsClaimed,
  RewardsSettled,
  RootCommitted,
  RootProposed,
  Staked,
  SSVNetworkUpgradeBlock,
  UnstakeRequested,
  UnstakedWithdrawn,
  ValidatorAdded,
  ValidatorRemoved,
  DAOValues,
  ClusterBalanceUpdated,
  ClusterMigratedToETH,
  WeightedRootProposed,
  Oracle,
} from "../generated/schema";
import { log } from "matchstick-as";

const VUNITS_PRECISION = BigInt.fromI32(100000);
const DEFAULT_BALANCE = BigInt.fromI32(32);
const SSV_STAKING_UPDATE_BLOCK_NUMBER = BigInt.fromI32(2219331);
const DEFAULT_OPERATOR_ETH_FEE = BigInt.fromI32(1_770_000_000);

// ###### DAO Events ######

export function handleDeclareOperatorFeePeriodUpdated(
  event: DeclareOperatorFeePeriodUpdatedEvent,
): void {
  let entity = new DeclareOperatorFeePeriodUpdated(
    `${event.transaction.hash.toHexString()}-${event.logIndex
      .toString()
      .padStart(5, "0")}`,
  );
  entity.value = event.params.value;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let dao = DAOValues.load(event.address);
  if (!dao) {
    log.error(
      `New DAO Event, DAO values store with ID ${event.address.toHexString()} does not exist on the database, creating it. Update type: DECLARE_OPERATOR_FEE_PERIOD`,
      [],
    );
    dao = new DAOValues(event.address);
    dao.networkFee = BigInt.zero();
    dao.networkFeeIndex = BigInt.zero();
    dao.networkFeeIndexBlockNumber = BigInt.zero();
    dao.liquidationThreshold = BigInt.fromI32(214800);
    dao.minimumLiquidationCollateral = BigInt.fromString("1000000000000000000");
    dao.networkFeeSSV = BigInt.zero();
    dao.networkFeeIndexSSV = BigInt.zero();
    dao.networkFeeIndexBlockNumberSSV = BigInt.zero();
    dao.liquidationThresholdSSV = BigInt.fromI32(214800);
    dao.minimumLiquidationCollateralSSV = BigInt.fromString(
      "1000000000000000000",
    );
    dao.operatorFeeIncreaseLimit = BigInt.fromI32(1000);
    dao.declareOperatorFeePeriod = BigInt.fromI32(604800);
    dao.executeOperatorFeePeriod = BigInt.fromI32(604800);
    dao.operatorMaximumFee = BigInt.zero();
    dao.operatorMaximumFeeSSV = BigInt.zero();
    dao.validatorsPerOperatorLimit = BigInt.fromI32(3000);
    dao.accEthPerShare = BigInt.zero();
    dao.newFeesWei = BigInt.zero();
    dao.quorum = 0;
    dao.version = "";
    dao.latestMerkleRoot = Bytes.empty();
    dao.totalAccounts = BigInt.zero();
    dao.totalOperators = BigInt.zero();
    dao.totalValidators = BigInt.zero();
    dao.totalEffectiveBalance = BigInt.zero();
    dao.validatorsAdded = BigInt.zero();
    dao.validatorsRemoved = BigInt.zero();
    dao.operatorsAdded = BigInt.zero();
    dao.operatorsRemoved = BigInt.zero();
  }
  dao.updateType = "DECLARE_OPERATOR_FEE_PERIOD";
  dao.declareOperatorFeePeriod = event.params.value;
  dao.lastUpdateBlockNumber = event.block.number;
  dao.lastUpdateBlockTimestamp = event.block.timestamp;
  dao.lastUpdateTransactionHash = event.transaction.hash;
  dao.save();
}

export function handleExecuteOperatorFeePeriodUpdated(
  event: ExecuteOperatorFeePeriodUpdatedEvent,
): void {
  let entity = new ExecuteOperatorFeePeriodUpdated(
    `${event.transaction.hash.toHexString()}-${event.logIndex
      .toString()
      .padStart(5, "0")}`,
  );
  entity.value = event.params.value;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let dao = DAOValues.load(event.address);
  if (!dao) {
    log.error(
      `New DAO Event, DAO values store with ID ${event.address.toHexString()} does not exist on the database, creating it. Update type: EXECUTE_OPERATOR_FEE_PERIOD`,
      [],
    );
    dao = new DAOValues(event.address);
    dao.networkFee = BigInt.zero();
    dao.networkFeeIndex = BigInt.zero();
    dao.networkFeeIndexBlockNumber = BigInt.zero();
    dao.liquidationThreshold = BigInt.fromI32(214800);
    dao.minimumLiquidationCollateral = BigInt.fromString("1000000000000000000");
    dao.networkFeeSSV = BigInt.zero();
    dao.networkFeeIndexSSV = BigInt.zero();
    dao.networkFeeIndexBlockNumberSSV = BigInt.zero();
    dao.liquidationThresholdSSV = BigInt.fromI32(214800);
    dao.minimumLiquidationCollateralSSV = BigInt.fromString(
      "1000000000000000000",
    );
    dao.operatorFeeIncreaseLimit = BigInt.fromI32(1000);
    dao.declareOperatorFeePeriod = BigInt.fromI32(604800);
    dao.executeOperatorFeePeriod = BigInt.fromI32(604800);
    dao.operatorMaximumFee = BigInt.zero();
    dao.operatorMaximumFeeSSV = BigInt.zero();
    dao.validatorsPerOperatorLimit = BigInt.fromI32(3000);
    dao.accEthPerShare = BigInt.zero();
    dao.newFeesWei = BigInt.zero();
    dao.quorum = 0;
    dao.version = "";
    dao.latestMerkleRoot = Bytes.empty();
    dao.totalAccounts = BigInt.zero();
    dao.totalOperators = BigInt.zero();
    dao.totalValidators = BigInt.zero();
    dao.totalEffectiveBalance = BigInt.zero();
    dao.validatorsAdded = BigInt.zero();
    dao.validatorsRemoved = BigInt.zero();
    dao.operatorsAdded = BigInt.zero();
    dao.operatorsRemoved = BigInt.zero();
  }
  dao.updateType = "EXECUTE_OPERATOR_FEE_PERIOD";
  dao.executeOperatorFeePeriod = event.params.value;
  dao.lastUpdateBlockNumber = event.block.number;
  dao.lastUpdateBlockTimestamp = event.block.timestamp;
  dao.lastUpdateTransactionHash = event.transaction.hash;
  dao.save();
}

export function handleFeeRecipientAddressUpdated(
  event: FeeRecipientAddressUpdatedEvent,
): void {
  let entity = new FeeRecipientAddressUpdated(
    `${event.transaction.hash.toHexString()}-${event.logIndex
      .toString()
      .padStart(5, "0")}`,
  );
  entity.owner = event.params.owner;
  entity.recipientAddress = event.params.recipientAddress;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let owner = Account.load(event.params.owner);
  if (!owner) {
    owner = new Account(event.params.owner);
    owner.nonce = BigInt.zero();
    owner.validatorCount = BigInt.zero();
    owner.feeRecipient = event.params.recipientAddress;
    owner.stakedAmount = BigInt.zero();
    owner.unstakePendingAmount = BigInt.zero();
    owner.save();
  } else {
    owner.feeRecipient = event.params.recipientAddress;
    owner.save();
  }
}

export function handleLiquidationThresholdPeriodUpdated(
  event: LiquidationThresholdPeriodUpdatedEvent,
): void {
  let entity = new LiquidationThresholdPeriodUpdated(
    `${event.transaction.hash.toHexString()}-${event.logIndex
      .toString()
      .padStart(5, "0")}`,
  );
  entity.value = event.params.value;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let dao = DAOValues.load(event.address);
  if (!dao) {
    log.error(
      `New DAO Event, DAO values store with ID ${event.address.toHexString()} does not exist on the database, creating it. Update type: LIQUIDATION_THRESHOLD`,
      [],
    );
    dao = new DAOValues(event.address);
    dao.networkFee = BigInt.zero();
    dao.networkFeeIndex = BigInt.zero();
    dao.networkFeeIndexBlockNumber = BigInt.zero();
    dao.liquidationThreshold = BigInt.fromI32(214800);
    dao.minimumLiquidationCollateral = BigInt.fromString("1000000000000000000");
    dao.networkFeeSSV = BigInt.zero();
    dao.networkFeeIndexSSV = BigInt.zero();
    dao.networkFeeIndexBlockNumberSSV = BigInt.zero();
    dao.liquidationThresholdSSV = BigInt.fromI32(214800);
    dao.minimumLiquidationCollateralSSV = BigInt.fromString(
      "1000000000000000000",
    );
    dao.operatorFeeIncreaseLimit = BigInt.fromI32(1000);
    dao.declareOperatorFeePeriod = BigInt.fromI32(604800);
    dao.executeOperatorFeePeriod = BigInt.fromI32(604800);
    dao.operatorMaximumFee = BigInt.zero();
    dao.operatorMaximumFeeSSV = BigInt.zero();
    dao.validatorsPerOperatorLimit = BigInt.fromI32(3000);
    dao.accEthPerShare = BigInt.zero();
    dao.newFeesWei = BigInt.zero();
    dao.quorum = 0;
    dao.version = "";
    dao.latestMerkleRoot = Bytes.empty();
    dao.totalAccounts = BigInt.zero();
    dao.totalOperators = BigInt.zero();
    dao.totalValidators = BigInt.zero();
    dao.totalEffectiveBalance = BigInt.zero();
    dao.validatorsAdded = BigInt.zero();
    dao.validatorsRemoved = BigInt.zero();
    dao.operatorsAdded = BigInt.zero();
    dao.operatorsRemoved = BigInt.zero();
  }
  dao.updateType = "LIQUIDATION_THRESHOLD";
  dao.liquidationThreshold = event.params.value;
  dao.lastUpdateBlockNumber = event.block.number;
  dao.lastUpdateBlockTimestamp = event.block.timestamp;
  dao.lastUpdateTransactionHash = event.transaction.hash;
  dao.save();
}
export function handleLiquidationThresholdPeriodSSVUpdated(
  event: LiquidationThresholdPeriodSSVUpdatedEvent,
): void {
  let entity = new LiquidationThresholdPeriodSSVUpdated(
    `${event.transaction.hash.toHexString()}-${event.logIndex
      .toString()
      .padStart(5, "0")}`,
  );
  entity.value = event.params.value;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let dao = DAOValues.load(event.address);
  if (!dao) {
    log.error(
      `New DAO Event, DAO values store with ID ${event.address.toHexString()} does not exist on the database, creating it. Update type: LIQUIDATION_THRESHOLD`,
      [],
    );
    dao = new DAOValues(event.address);
    dao.networkFee = BigInt.zero();
    dao.networkFeeIndex = BigInt.zero();
    dao.networkFeeIndexBlockNumber = BigInt.zero();
    dao.liquidationThreshold = BigInt.fromI32(214800);
    dao.minimumLiquidationCollateral = BigInt.fromString("1000000000000000000");
    dao.networkFeeSSV = BigInt.zero();
    dao.networkFeeIndexSSV = BigInt.zero();
    dao.networkFeeIndexBlockNumberSSV = BigInt.zero();
    dao.liquidationThresholdSSV = BigInt.fromI32(214800);
    dao.minimumLiquidationCollateralSSV = BigInt.fromString(
      "1000000000000000000",
    );
    dao.operatorFeeIncreaseLimit = BigInt.fromI32(1000);
    dao.declareOperatorFeePeriod = BigInt.fromI32(604800);
    dao.executeOperatorFeePeriod = BigInt.fromI32(604800);
    dao.operatorMaximumFee = BigInt.zero();
    dao.operatorMaximumFeeSSV = BigInt.zero();
    dao.validatorsPerOperatorLimit = BigInt.fromI32(3000);
    dao.accEthPerShare = BigInt.zero();
    dao.newFeesWei = BigInt.zero();
    dao.quorum = 0;
    dao.version = "";
    dao.latestMerkleRoot = Bytes.empty();
    dao.totalAccounts = BigInt.zero();
    dao.totalOperators = BigInt.zero();
    dao.totalValidators = BigInt.zero();
    dao.totalEffectiveBalance = BigInt.zero();
    dao.validatorsAdded = BigInt.zero();
    dao.validatorsRemoved = BigInt.zero();
    dao.operatorsAdded = BigInt.zero();
    dao.operatorsRemoved = BigInt.zero();
  }
  dao.updateType = "LIQUIDATION_THRESHOLD_SSV";
  dao.liquidationThreshold = event.params.value;
  dao.lastUpdateBlockNumber = event.block.number;
  dao.lastUpdateBlockTimestamp = event.block.timestamp;
  dao.lastUpdateTransactionHash = event.transaction.hash;
  dao.save();
}

export function handleMinimumLiquidationCollateralUpdated(
  event: MinimumLiquidationCollateralUpdatedEvent,
): void {
  let entity = new MinimumLiquidationCollateralUpdated(
    `${event.transaction.hash.toHexString()}-${event.logIndex
      .toString()
      .padStart(5, "0")}`,
  );
  entity.value = event.params.value;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let dao = DAOValues.load(event.address);
  if (!dao) {
    log.error(
      `New DAO Event, DAO values store with ID ${event.address.toHexString()} does not exist on the database, creating it. Update type: MIN_LIQUIDATION_COLLATERAL`,
      [],
    );
    dao = new DAOValues(event.address);
    dao.networkFee = BigInt.zero();
    dao.networkFeeIndex = BigInt.zero();
    dao.networkFeeIndexBlockNumber = BigInt.zero();
    dao.liquidationThreshold = BigInt.fromI32(214800);
    dao.minimumLiquidationCollateral = BigInt.fromString("1000000000000000000");
    dao.networkFeeSSV = BigInt.zero();
    dao.networkFeeIndexSSV = BigInt.zero();
    dao.networkFeeIndexBlockNumberSSV = BigInt.zero();
    dao.liquidationThresholdSSV = BigInt.fromI32(214800);
    dao.minimumLiquidationCollateralSSV = BigInt.fromString(
      "1000000000000000000",
    );
    dao.operatorFeeIncreaseLimit = BigInt.fromI32(1000);
    dao.declareOperatorFeePeriod = BigInt.fromI32(604800);
    dao.executeOperatorFeePeriod = BigInt.fromI32(604800);
    dao.operatorMaximumFee = BigInt.zero();
    dao.operatorMaximumFeeSSV = BigInt.zero();
    dao.validatorsPerOperatorLimit = BigInt.fromI32(3000);
    dao.accEthPerShare = BigInt.zero();
    dao.newFeesWei = BigInt.zero();
    dao.quorum = 0;
    dao.version = "";
    dao.latestMerkleRoot = Bytes.empty();
    dao.totalAccounts = BigInt.zero();
    dao.totalOperators = BigInt.zero();
    dao.totalValidators = BigInt.zero();
    dao.totalEffectiveBalance = BigInt.zero();
    dao.validatorsAdded = BigInt.zero();
    dao.validatorsRemoved = BigInt.zero();
    dao.operatorsAdded = BigInt.zero();
    dao.operatorsRemoved = BigInt.zero();
  }
  dao.updateType = "MIN_LIQUIDATION_COLLATERAL";
  dao.minimumLiquidationCollateral = event.params.value;
  dao.lastUpdateBlockNumber = event.block.number;
  dao.lastUpdateBlockTimestamp = event.block.timestamp;
  dao.lastUpdateTransactionHash = event.transaction.hash;
  dao.save();
}

export function handleMinimumLiquidationCollateralSSVUpdated(
  event: MinimumLiquidationCollateralSSVUpdatedEvent,
): void {
  let entity = new MinimumLiquidationCollateralSSVUpdated(
    `${event.transaction.hash.toHexString()}-${event.logIndex
      .toString()
      .padStart(5, "0")}`,
  );
  entity.value = event.params.value;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let dao = DAOValues.load(event.address);
  if (!dao) {
    log.error(
      `New DAO Event, DAO values store with ID ${event.address.toHexString()} does not exist on the database, creating it. Update type: MIN_LIQUIDATION_COLLATERAL`,
      [],
    );
    dao = new DAOValues(event.address);
    dao.networkFee = BigInt.zero();
    dao.networkFeeIndex = BigInt.zero();
    dao.networkFeeIndexBlockNumber = BigInt.zero();
    dao.liquidationThreshold = BigInt.fromI32(214800);
    dao.minimumLiquidationCollateral = BigInt.fromString("1000000000000000000");
    dao.networkFeeSSV = BigInt.zero();
    dao.networkFeeIndexSSV = BigInt.zero();
    dao.networkFeeIndexBlockNumberSSV = BigInt.zero();
    dao.liquidationThresholdSSV = BigInt.fromI32(214800);
    dao.minimumLiquidationCollateralSSV = BigInt.fromString(
      "1000000000000000000",
    );
    dao.operatorFeeIncreaseLimit = BigInt.fromI32(1000);
    dao.declareOperatorFeePeriod = BigInt.fromI32(604800);
    dao.executeOperatorFeePeriod = BigInt.fromI32(604800);
    dao.operatorMaximumFee = BigInt.zero();
    dao.operatorMaximumFeeSSV = BigInt.zero();
    dao.validatorsPerOperatorLimit = BigInt.fromI32(3000);
    dao.accEthPerShare = BigInt.zero();
    dao.newFeesWei = BigInt.zero();
    dao.quorum = 0;
    dao.version = "";
    dao.latestMerkleRoot = Bytes.empty();
    dao.totalAccounts = BigInt.zero();
    dao.totalOperators = BigInt.zero();
    dao.totalValidators = BigInt.zero();
    dao.totalEffectiveBalance = BigInt.zero();
    dao.validatorsAdded = BigInt.zero();
    dao.validatorsRemoved = BigInt.zero();
    dao.operatorsAdded = BigInt.zero();
    dao.operatorsRemoved = BigInt.zero();
  }
  dao.updateType = "MIN_LIQUIDATION_COLLATERAL_SSV";
  dao.minimumLiquidationCollateral = event.params.value;
  dao.lastUpdateBlockNumber = event.block.number;
  dao.lastUpdateBlockTimestamp = event.block.timestamp;
  dao.lastUpdateTransactionHash = event.transaction.hash;
  dao.save();
}

export function handleNetworkEarningsWithdrawn(
  event: NetworkEarningsWithdrawnEvent,
): void {
  let entity = new NetworkEarningsWithdrawn(
    `${event.transaction.hash.toHexString()}-${event.logIndex
      .toString()
      .padStart(5, "0")}`,
  );
  entity.value = event.params.value;
  entity.recipient = event.params.recipient;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleNetworkFeeUpdated(event: NetworkFeeUpdatedEvent): void {
  let entity = new NetworkFeeUpdated(
    `${event.transaction.hash.toHexString()}-${event.logIndex
      .toString()
      .padStart(5, "0")}`,
  );
  entity.oldFee = event.params.oldFee;
  entity.newFee = event.params.newFee;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let dao = DAOValues.load(event.address);
  if (!dao) {
    log.error(
      `New DAO Event, DAO values store with ID ${event.address.toHexString()} does not exist on the database, creating it. Update type: NETWORK_FEE`,
      [],
    );
    dao = new DAOValues(event.address);
    dao.networkFee = BigInt.zero();
    dao.networkFeeIndex = BigInt.zero();
    dao.networkFeeIndexBlockNumber = BigInt.zero();
    dao.liquidationThreshold = BigInt.fromI32(214800);
    dao.minimumLiquidationCollateral = BigInt.fromString("1000000000000000000");
    dao.networkFeeSSV = BigInt.zero();
    dao.networkFeeIndexSSV = BigInt.zero();
    dao.networkFeeIndexBlockNumberSSV = BigInt.zero();
    dao.liquidationThresholdSSV = BigInt.fromI32(214800);
    dao.minimumLiquidationCollateralSSV = BigInt.fromString(
      "1000000000000000000",
    );
    dao.operatorFeeIncreaseLimit = BigInt.fromI32(1000);
    dao.declareOperatorFeePeriod = BigInt.fromI32(604800);
    dao.executeOperatorFeePeriod = BigInt.fromI32(604800);
    dao.operatorMaximumFee = BigInt.zero();
    dao.operatorMaximumFeeSSV = BigInt.zero();
    dao.validatorsPerOperatorLimit = BigInt.fromI32(3000);
    dao.accEthPerShare = BigInt.zero();
    dao.newFeesWei = BigInt.zero();
    dao.quorum = 0;
    dao.version = "";
    dao.latestMerkleRoot = Bytes.empty();
    dao.totalAccounts = BigInt.zero();
    dao.totalOperators = BigInt.zero();
    dao.totalValidators = BigInt.zero();
    dao.totalEffectiveBalance = BigInt.zero();
    dao.validatorsAdded = BigInt.zero();
    dao.validatorsRemoved = BigInt.zero();
    dao.operatorsAdded = BigInt.zero();
    dao.operatorsRemoved = BigInt.zero();
  }
  dao.updateType = "NETWORK_FEE";

  // if (dao.version == "v.2.0") {
  if (event.block.number >= SSV_STAKING_UPDATE_BLOCK_NUMBER) {
    // update the index first, because it's using "old" fee, and "old" feeIndexBlockNumber values
    dao.networkFeeIndex = dao.networkFeeIndex.plus(
      event.block.number
        .minus(dao.networkFeeIndexBlockNumber)
        .times(dao.networkFee),
    );
    dao.networkFeeIndexBlockNumber = event.block.number;
    dao.networkFee = event.params.newFee;
  } else {
    // update the index first, because it's using "old" fee, and "old" feeIndexBlockNumber values
    dao.networkFeeIndexSSV = dao.networkFeeIndexSSV.plus(
      event.block.number
        .minus(dao.networkFeeIndexBlockNumberSSV)
        .times(dao.networkFeeSSV),
    );
    dao.networkFeeIndexBlockNumberSSV = event.block.number;
    dao.networkFeeSSV = event.params.newFee;
  }
  dao.lastUpdateBlockNumber = event.block.number;
  dao.lastUpdateBlockTimestamp = event.block.timestamp;
  dao.lastUpdateTransactionHash = event.transaction.hash;
  dao.save();
}

export function handleNetworkFeeUpdatedSSV(
  event: NetworkFeeUpdatedEvent,
): void {
  let entity = new NetworkFeeUpdatedSSV(
    `${event.transaction.hash.toHexString()}-${event.logIndex
      .toString()
      .padStart(5, "0")}`,
  );
  entity.oldFee = event.params.oldFee;
  entity.newFee = event.params.newFee;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let dao = DAOValues.load(event.address);
  if (!dao) {
    log.error(
      `New DAO Event, DAO values store with ID ${event.address.toHexString()} does not exist on the database, creating it. Update type: NETWORK_FEE`,
      [],
    );
    dao = new DAOValues(event.address);
    dao.networkFee = BigInt.zero();
    dao.networkFeeIndex = BigInt.zero();
    dao.networkFeeIndexBlockNumber = BigInt.zero();
    dao.liquidationThreshold = BigInt.fromI32(214800);
    dao.minimumLiquidationCollateral = BigInt.fromString("1000000000000000000");
    dao.networkFeeSSV = BigInt.zero();
    dao.networkFeeIndexSSV = BigInt.zero();
    dao.networkFeeIndexBlockNumberSSV = BigInt.zero();
    dao.liquidationThresholdSSV = BigInt.fromI32(214800);
    dao.minimumLiquidationCollateralSSV = BigInt.fromString(
      "1000000000000000000",
    );
    dao.operatorFeeIncreaseLimit = BigInt.fromI32(1000);
    dao.declareOperatorFeePeriod = BigInt.fromI32(604800);
    dao.executeOperatorFeePeriod = BigInt.fromI32(604800);
    dao.operatorMaximumFee = BigInt.zero();
    dao.operatorMaximumFeeSSV = BigInt.zero();
    dao.validatorsPerOperatorLimit = BigInt.fromI32(3000);
    dao.accEthPerShare = BigInt.zero();
    dao.newFeesWei = BigInt.zero();
    dao.quorum = 0;
    dao.version = "";
    dao.latestMerkleRoot = Bytes.empty();
    dao.totalAccounts = BigInt.zero();
    dao.totalOperators = BigInt.zero();
    dao.totalValidators = BigInt.zero();
    dao.totalEffectiveBalance = BigInt.zero();
    dao.validatorsAdded = BigInt.zero();
    dao.validatorsRemoved = BigInt.zero();
    dao.operatorsAdded = BigInt.zero();
    dao.operatorsRemoved = BigInt.zero();
  }
  dao.updateType = "NETWORK_FEE_SSV";
  // update the index first, because it's using "old" fee, and "old" feeIndexBlockNumber values
  dao.networkFeeIndexSSV = dao.networkFeeIndexSSV.plus(
    event.block.number
      .minus(dao.networkFeeIndexBlockNumberSSV)
      .times(dao.networkFeeSSV),
  );
  dao.networkFeeIndexBlockNumberSSV = event.block.number;
  dao.networkFeeSSV = event.params.newFee;
  dao.lastUpdateBlockNumber = event.block.number;
  dao.lastUpdateBlockTimestamp = event.block.timestamp;
  dao.lastUpdateTransactionHash = event.transaction.hash;
  dao.save();
}

export function handleOperatorFeeIncreaseLimitUpdated(
  event: OperatorFeeIncreaseLimitUpdatedEvent,
): void {
  let entity = new OperatorFeeIncreaseLimitUpdated(
    `${event.transaction.hash.toHexString()}-${event.logIndex
      .toString()
      .padStart(5, "0")}`,
  );
  entity.value = event.params.value;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let dao = DAOValues.load(event.address);
  if (!dao) {
    log.error(
      `New DAO Event, DAO values store with ID ${event.address.toHexString()} does not exist on the database, creating it. Update type: OPERATOR_FEE_INCREASE_LIMIT`,
      [],
    );
    dao = new DAOValues(event.address);
    dao.networkFee = BigInt.zero();
    dao.networkFeeIndex = BigInt.zero();
    dao.networkFeeIndexBlockNumber = BigInt.zero();
    dao.liquidationThreshold = BigInt.fromI32(214800);
    dao.minimumLiquidationCollateral = BigInt.fromString("1000000000000000000");
    dao.networkFeeSSV = BigInt.zero();
    dao.networkFeeIndexSSV = BigInt.zero();
    dao.networkFeeIndexBlockNumberSSV = BigInt.zero();
    dao.liquidationThresholdSSV = BigInt.fromI32(214800);
    dao.minimumLiquidationCollateralSSV = BigInt.fromString(
      "1000000000000000000",
    );
    dao.operatorFeeIncreaseLimit = BigInt.fromI32(1000);
    dao.declareOperatorFeePeriod = BigInt.fromI32(604800);
    dao.executeOperatorFeePeriod = BigInt.fromI32(604800);
    dao.operatorMaximumFee = BigInt.zero();
    dao.operatorMaximumFeeSSV = BigInt.zero();
    dao.validatorsPerOperatorLimit = BigInt.fromI32(3000);
    dao.accEthPerShare = BigInt.zero();
    dao.newFeesWei = BigInt.zero();
    dao.quorum = 0;
    dao.version = "";
    dao.latestMerkleRoot = Bytes.empty();
    dao.totalAccounts = BigInt.zero();
    dao.totalOperators = BigInt.zero();
    dao.totalValidators = BigInt.zero();
    dao.totalEffectiveBalance = BigInt.zero();
    dao.validatorsAdded = BigInt.zero();
    dao.validatorsRemoved = BigInt.zero();
    dao.operatorsAdded = BigInt.zero();
    dao.operatorsRemoved = BigInt.zero();
  }
  dao.updateType = "OPERATOR_FEE_INCREASE_LIMIT";
  dao.operatorFeeIncreaseLimit = event.params.value;
  dao.lastUpdateBlockNumber = event.block.number;
  dao.lastUpdateBlockTimestamp = event.block.timestamp;
  dao.lastUpdateTransactionHash = event.transaction.hash;
  dao.save();
}

export function handleOperatorMaximumFeeUpdated(
  event: OperatorMaximumFeeUpdatedEvent,
): void {
  let entity = new OperatorMaximumFeeUpdated(
    `${event.transaction.hash.toHexString()}-${event.logIndex
      .toString()
      .padStart(5, "0")}`,
  );
  entity.maxFee = event.params.maxFee;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let dao = DAOValues.load(event.address);
  if (!dao) {
    log.error(
      `New DAO Event, DAO values store with ID ${event.address.toHexString()} does not exist on the database, creating it. Update type: DECLARE_OPERATOR_FEE_PERIOD`,
      [],
    );
    dao = new DAOValues(event.address);
    dao.networkFee = BigInt.zero();
    dao.networkFeeIndex = BigInt.zero();
    dao.networkFeeIndexBlockNumber = BigInt.zero();
    dao.liquidationThreshold = BigInt.fromI32(214800);
    dao.minimumLiquidationCollateral = BigInt.fromString("1000000000000000000");
    dao.networkFeeSSV = BigInt.zero();
    dao.networkFeeIndexSSV = BigInt.zero();
    dao.networkFeeIndexBlockNumberSSV = BigInt.zero();
    dao.liquidationThresholdSSV = BigInt.fromI32(214800);
    dao.minimumLiquidationCollateralSSV = BigInt.fromString(
      "1000000000000000000",
    );
    dao.operatorFeeIncreaseLimit = BigInt.fromI32(1000);
    dao.declareOperatorFeePeriod = BigInt.fromI32(604800);
    dao.executeOperatorFeePeriod = BigInt.fromI32(604800);
    dao.operatorMaximumFee = BigInt.zero();
    dao.operatorMaximumFeeSSV = BigInt.zero();
    dao.validatorsPerOperatorLimit = BigInt.fromI32(3000);
    dao.accEthPerShare = BigInt.zero();
    dao.newFeesWei = BigInt.zero();
    dao.quorum = 0;
    dao.version = "";
    dao.latestMerkleRoot = Bytes.empty();
    dao.totalAccounts = BigInt.zero();
    dao.totalOperators = BigInt.zero();
    dao.totalValidators = BigInt.zero();
    dao.totalEffectiveBalance = BigInt.zero();
    dao.validatorsAdded = BigInt.zero();
    dao.validatorsRemoved = BigInt.zero();
    dao.operatorsAdded = BigInt.zero();
    dao.operatorsRemoved = BigInt.zero();
  }
  dao.updateType = "OPERATOR_MAX_FEE";
  dao.operatorMaximumFee = event.params.maxFee;
  dao.lastUpdateBlockNumber = event.block.number;
  dao.lastUpdateBlockTimestamp = event.block.timestamp;
  dao.lastUpdateTransactionHash = event.transaction.hash;
  dao.save();
}

// ###### Cluster Events ######

export function handleClusterBalanceUpdated(
  event: ClusterBalanceUpdatedEvent,
): void {
  let entity = new ClusterBalanceUpdated(
    `${event.transaction.hash.toHexString()}-${event.logIndex
      .toString()
      .padStart(5, "0")}`,
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

  let owner = Account.load(event.params.owner);
  if (!owner) {
    owner = new Account(event.params.owner);
    owner.nonce = BigInt.zero();
    owner.validatorCount = BigInt.zero();
    owner.feeRecipient = event.params.owner;
    owner.stakedAmount = BigInt.zero();
    owner.unstakePendingAmount = BigInt.zero();
    owner.save();
  }

  let clusterId = `${event.params.owner.toHexString()}-${event.params.operatorIds.join(
    "-",
  )}`;
  let cluster = Cluster.load(clusterId);
  if (!cluster) {
    log.error(
      `Cluster ${clusterId} is being deposited, but it does not exist on the database`,
      [],
    );
    cluster = new Cluster(clusterId);
    cluster.effectiveBalance = DEFAULT_BALANCE;
    cluster.feeAsset = "SSV";
  }

  cluster.owner = owner.id;
  cluster.operatorIds = event.params.operatorIds;
  cluster.validatorCount = event.params.cluster.validatorCount;
  log.info(
    `Set validator count of cluster ${cluster.id} to ${event.params.cluster.validatorCount}`,
    [],
  );
  let clusterPreviousBalance = cluster.effectiveBalance;
  cluster.effectiveBalance = event.params.effectiveBalance;
  cluster.vUnits = cluster.effectiveBalance
    .div(DEFAULT_BALANCE)
    .times(VUNITS_PRECISION);
  cluster.networkFeeIndex = event.params.cluster.networkFeeIndex;
  cluster.index = event.params.cluster.index;
  cluster.active = event.params.cluster.active;
  cluster.balance = event.params.cluster.balance;
  cluster.lastUpdateBlockNumber = event.block.number;
  cluster.lastUpdateBlockTimestamp = event.block.timestamp;
  cluster.lastUpdateTransactionHash = event.transaction.hash;
  cluster.save();

  let dao = DAOValues.load(event.address);
  if (!dao) {
    log.error(
      `New DAO Event, DAO values store with ID ${event.address.toHexString()} does not exist on the database, creating it. Update type: DECLARE_OPERATOR_FEE_PERIOD`,
      [],
    );
    dao = new DAOValues(event.address);

    dao.networkFee = BigInt.zero();
    dao.networkFeeIndex = BigInt.zero();
    dao.networkFeeIndexBlockNumber = BigInt.zero();
    dao.liquidationThreshold = BigInt.zero();
    dao.minimumLiquidationCollateral = BigInt.zero();
    dao.networkFeeSSV = BigInt.zero();
    dao.networkFeeIndexSSV = BigInt.zero();
    dao.networkFeeIndexBlockNumberSSV = BigInt.zero();
    dao.liquidationThresholdSSV = BigInt.fromI32(214800);
    dao.minimumLiquidationCollateralSSV = BigInt.fromString(
      "1000000000000000000",
    );
    dao.operatorFeeIncreaseLimit = BigInt.zero();
    dao.declareOperatorFeePeriod = BigInt.zero();
    dao.executeOperatorFeePeriod = BigInt.zero();
    dao.operatorMaximumFee = BigInt.zero();
    dao.operatorMaximumFeeSSV = BigInt.zero();
    dao.validatorsPerOperatorLimit = BigInt.fromI32(3000);
    dao.accEthPerShare = BigInt.zero();
    dao.newFeesWei = BigInt.zero();
    dao.quorum = 0;
    dao.version = "";
    dao.latestMerkleRoot = Bytes.empty();
    dao.totalAccounts = BigInt.zero();
    dao.totalOperators = BigInt.zero();
    dao.totalValidators = BigInt.zero();
    dao.totalEffectiveBalance = BigInt.zero();
    dao.validatorsAdded = BigInt.zero();
    dao.validatorsRemoved = BigInt.zero();
    dao.operatorsAdded = BigInt.zero();
    dao.operatorsRemoved = BigInt.zero();
    dao.lastUpdateBlockNumber = event.block.number;
    dao.lastUpdateBlockTimestamp = event.block.timestamp;
    dao.lastUpdateTransactionHash = event.transaction.hash;
  }

  dao.updateType = "CLUSTER_BALANCE_UPDATED";
  dao.totalEffectiveBalance = dao.totalEffectiveBalance
    .minus(clusterPreviousBalance)
    .plus(cluster.effectiveBalance);
  dao.save();
}

export function handleClusterMigratedToETH(
  event: ClusterMigratedToETHEvent,
): void {
  let entity = new ClusterMigratedToETH(
    `${event.transaction.hash.toHexString()}-${event.logIndex
      .toString()
      .padStart(5, "0")}`,
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

  entity.save();

  let owner = Account.load(event.params.owner);
  if (!owner) {
    owner = new Account(event.params.owner);
    owner.nonce = BigInt.zero();
    owner.validatorCount = BigInt.zero();
    owner.feeRecipient = event.params.owner;
    owner.stakedAmount = BigInt.zero();
    owner.unstakePendingAmount = BigInt.zero();
    owner.save();
  }

  let clusterId = `${event.params.owner.toHexString()}-${event.params.operatorIds.join(
    "-",
  )}`;
  let cluster = Cluster.load(clusterId);
  if (!cluster) {
    log.error(
      `Cluster ${clusterId} is being deposited, but it does not exist on the database`,
      [],
    );
    cluster = new Cluster(clusterId);
  }

  cluster.owner = owner.id;
  cluster.operatorIds = event.params.operatorIds;
  cluster.validatorCount = event.params.cluster.validatorCount;
  log.info(
    `Set validator count of cluster ${cluster.id} to ${event.params.cluster.validatorCount}`,
    [],
  );
  cluster.feeAsset = "ETH";
  cluster.effectiveBalance = event.params.effectiveBalance;
  cluster.vUnits = cluster.effectiveBalance
    .div(DEFAULT_BALANCE)
    .times(VUNITS_PRECISION);
  cluster.networkFeeIndex = event.params.cluster.networkFeeIndex;
  cluster.index = event.params.cluster.index;
  cluster.active = event.params.cluster.active;
  cluster.balance = event.params.cluster.balance;
  cluster.lastUpdateBlockNumber = event.block.number;
  cluster.lastUpdateBlockTimestamp = event.block.timestamp;
  cluster.lastUpdateTransactionHash = event.transaction.hash;
  cluster.save();

  for (var i = 0; i < event.params.operatorIds.length; i++) {
    let operatorId = event.params.operatorIds[i].toString();
    let operator = Operator.load(operatorId);
    if (!operator) {
      log.error(
        `Cluster is migrated to ETH, but Operator ${event.params.operatorIds[i]} does not exist on the database`,
        [],
      );
      log.error(
        `Could not create ${operatorId} on the database, because of missing information`,
        [],
      );
    } else {
      operator.fee = DEFAULT_OPERATOR_ETH_FEE;
      operator.totalEffectiveBalance = operator.totalEffectiveBalance.plus(
        cluster.effectiveBalance,
      );
      operator.lastUpdateBlockNumber = event.block.number;
      operator.lastUpdateBlockTimestamp = event.block.timestamp;
      operator.lastUpdateTransactionHash = event.transaction.hash;
      operator.save();
    }
  }
}

export function handleClusterDeposited(event: ClusterDepositedEvent): void {
  let entity = new ClusterDeposited(
    `${event.transaction.hash.toHexString()}-${event.logIndex
      .toString()
      .padStart(5, "0")}`,
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

  let owner = Account.load(event.params.owner);
  if (!owner) {
    owner = new Account(event.params.owner);
    owner.nonce = BigInt.zero();
    owner.validatorCount = BigInt.zero();
    owner.feeRecipient = event.params.owner;
    owner.stakedAmount = BigInt.zero();
    owner.unstakePendingAmount = BigInt.zero();
    owner.save();
  }

  let clusterId = `${event.params.owner.toHexString()}-${event.params.operatorIds.join(
    "-",
  )}`;
  let cluster = Cluster.load(clusterId);
  if (!cluster) {
    log.error(
      `Cluster ${clusterId} is being deposited, but it does not exist on the database`,
      [],
    );
    cluster = new Cluster(clusterId);
    cluster.feeAsset = "SSV";
    cluster.effectiveBalance = DEFAULT_BALANCE;
    cluster.vUnits = BigInt.fromI32(100);
  }

  cluster.owner = owner.id;
  cluster.operatorIds = event.params.operatorIds;
  cluster.validatorCount = event.params.cluster.validatorCount;
  log.info(
    `Set validator count of cluster ${cluster.id} to ${event.params.cluster.validatorCount}`,
    [],
  );
  cluster.networkFeeIndex = event.params.cluster.networkFeeIndex;
  cluster.index = event.params.cluster.index;
  cluster.active = event.params.cluster.active;
  cluster.balance = event.params.cluster.balance;
  cluster.lastUpdateBlockNumber = event.block.number;
  cluster.lastUpdateBlockTimestamp = event.block.timestamp;
  cluster.lastUpdateTransactionHash = event.transaction.hash;
  cluster.save();
}

export function handleClusterLiquidated(event: ClusterLiquidatedEvent): void {
  let entity = new ClusterLiquidated(
    `${event.transaction.hash.toHexString()}-${event.logIndex
      .toString()
      .padStart(5, "0")}`,
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

  entity.save();

  let owner = Account.load(event.params.owner);
  if (!owner) {
    owner = new Account(event.params.owner);
    owner.nonce = BigInt.zero();
    owner.validatorCount = BigInt.zero();
    owner.feeRecipient = event.params.owner;
    owner.stakedAmount = BigInt.zero();
    owner.unstakePendingAmount = BigInt.zero();
  }
  owner.validatorCount = owner.validatorCount.minus(
    event.params.cluster.validatorCount,
  );
  owner.save();

  let clusterId = `${event.params.owner.toHexString()}-${event.params.operatorIds.join(
    "-",
  )}`;
  let cluster = Cluster.load(clusterId);
  if (!cluster) {
    log.error(
      `Cluster ${clusterId} is being liquidated, but it does not exist on the database`,
      [],
    );
    cluster = new Cluster(clusterId);
    cluster.feeAsset = "SSV";
    cluster.effectiveBalance = DEFAULT_BALANCE;
    cluster.vUnits = BigInt.fromI32(100);
  }

  cluster.owner = owner.id;
  cluster.operatorIds = event.params.operatorIds;
  cluster.validatorCount = event.params.cluster.validatorCount;
  log.info(
    `Set validator count of cluster ${cluster.id} to ${event.params.cluster.validatorCount}`,
    [],
  );
  cluster.networkFeeIndex = event.params.cluster.networkFeeIndex;
  cluster.index = event.params.cluster.index;
  cluster.active = event.params.cluster.active;
  cluster.balance = event.params.cluster.balance;
  cluster.lastUpdateBlockNumber = event.block.number;
  cluster.lastUpdateBlockTimestamp = event.block.timestamp;
  cluster.lastUpdateTransactionHash = event.transaction.hash;
  cluster.save();

  for (var i = 0; i < event.params.operatorIds.length; i++) {
    let operatorId = event.params.operatorIds[i].toString();
    let operator = Operator.load(operatorId);
    if (!operator) {
      log.error(
        `Removing validator data for Operator ${event.params.operatorIds[i]}, but it does not exist on the database`,
        [],
      );
      log.error(
        `Could not create ${operatorId} on the database, because of missing owner, publicKey and fee information`,
        [],
      );
    } else {
      operator.operatorId = event.params.operatorIds[i];
      operator.validatorCount = operator.validatorCount.minus(
        event.params.cluster.validatorCount,
      );
      operator.lastUpdateBlockNumber = event.block.number;
      operator.lastUpdateBlockTimestamp = event.block.timestamp;
      operator.lastUpdateTransactionHash = event.transaction.hash;
      operator.save();
    }
  }
}

export function handleClusterReactivated(event: ClusterReactivatedEvent): void {
  let entity = new ClusterReactivated(
    `${event.transaction.hash.toHexString()}-${event.logIndex
      .toString()
      .padStart(5, "0")}`,
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

  entity.save();

  let owner = Account.load(event.params.owner);
  if (!owner) {
    owner = new Account(event.params.owner);
    owner.nonce = BigInt.zero();
    owner.validatorCount = BigInt.zero();
    owner.feeRecipient = event.params.owner;
    owner.stakedAmount = BigInt.zero();
    owner.unstakePendingAmount = BigInt.zero();
  }
  owner.validatorCount = owner.validatorCount.plus(
    event.params.cluster.validatorCount,
  );
  owner.save();

  let clusterId = `${event.params.owner.toHexString()}-${event.params.operatorIds.join(
    "-",
  )}`;
  let cluster = Cluster.load(clusterId);
  if (!cluster) {
    log.error(
      `Cluster ${clusterId} is being reactivated, but it does not exist on the database`,
      [],
    );
    cluster = new Cluster(clusterId);
    cluster.feeAsset = "SSV";
    cluster.effectiveBalance = DEFAULT_BALANCE;
    cluster.vUnits = BigInt.fromI32(100);
  }

  cluster.owner = owner.id;
  cluster.operatorIds = event.params.operatorIds;
  cluster.validatorCount = event.params.cluster.validatorCount;
  log.info(
    `Set validator count of cluster ${cluster.id} to ${event.params.cluster.validatorCount}`,
    [],
  );
  cluster.networkFeeIndex = event.params.cluster.networkFeeIndex;
  cluster.index = event.params.cluster.index;
  cluster.active = event.params.cluster.active;
  cluster.balance = event.params.cluster.balance;
  cluster.lastUpdateBlockNumber = event.block.number;
  cluster.lastUpdateBlockTimestamp = event.block.timestamp;
  cluster.lastUpdateTransactionHash = event.transaction.hash;
  cluster.save();

  for (var i = 0; i < event.params.operatorIds.length; i++) {
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
    } else {
      operator.operatorId = event.params.operatorIds[i];
      operator.validatorCount = operator.validatorCount.plus(
        event.params.cluster.validatorCount,
      );
      operator.lastUpdateBlockNumber = event.block.number;
      operator.lastUpdateBlockTimestamp = event.block.timestamp;
      operator.lastUpdateTransactionHash = event.transaction.hash;
      operator.save();
    }
  }
}

export function handleClusterWithdrawn(event: ClusterWithdrawnEvent): void {
  let entity = new ClusterWithdrawn(
    `${event.transaction.hash.toHexString()}-${event.logIndex
      .toString()
      .padStart(5, "0")}`,
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

  let owner = Account.load(event.params.owner);
  if (!owner) {
    owner = new Account(event.params.owner);
    owner.nonce = BigInt.zero();
    owner.validatorCount = BigInt.zero();
    owner.feeRecipient = event.params.owner;
    owner.stakedAmount = BigInt.zero();
    owner.unstakePendingAmount = BigInt.zero();
    owner.save();
  }

  let clusterId = `${event.params.owner.toHexString()}-${event.params.operatorIds.join(
    "-",
  )}`;
  let cluster = Cluster.load(clusterId);
  if (!cluster) {
    log.error(
      `Cluster ${clusterId} is being withdrawn, but it does not exist on the database`,
      [],
    );
    cluster = new Cluster(clusterId);
    cluster.feeAsset = "SSV";
    cluster.effectiveBalance = DEFAULT_BALANCE;
    cluster.vUnits = BigInt.fromI32(100);
  }

  cluster.owner = owner.id;
  cluster.operatorIds = event.params.operatorIds;
  cluster.validatorCount = event.params.cluster.validatorCount;
  log.info(
    `Set validator count of cluster ${cluster.id} to ${event.params.cluster.validatorCount}`,
    [],
  );
  cluster.networkFeeIndex = event.params.cluster.networkFeeIndex;
  cluster.index = event.params.cluster.index;
  cluster.active = event.params.cluster.active;
  cluster.balance = event.params.cluster.balance;
  cluster.lastUpdateBlockNumber = event.block.number;
  cluster.lastUpdateBlockTimestamp = event.block.timestamp;
  cluster.lastUpdateTransactionHash = event.transaction.hash;
  cluster.save();
}

export function handleValidatorAdded(event: ValidatorAddedEvent): void {
  let entity = new ValidatorAdded(
    `${event.transaction.hash.toHexString()}-${event.logIndex
      .toString()
      .padStart(5, "0")}`,
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

  entity.save();

  let dao = DAOValues.load(event.address);
  if (!dao) {
    log.error(
      `New DAO Event, DAO values store with ID ${event.address.toHexString()} does not exist on the database, creating it. Update type: DECLARE_OPERATOR_FEE_PERIOD`,
      [],
    );
    dao = new DAOValues(event.address);

    dao.networkFee = BigInt.zero();
    dao.networkFeeIndex = BigInt.zero();
    dao.networkFeeIndexBlockNumber = BigInt.zero();
    dao.liquidationThreshold = BigInt.zero();
    dao.minimumLiquidationCollateral = BigInt.zero();
    dao.networkFeeSSV = BigInt.zero();
    dao.networkFeeIndexSSV = BigInt.zero();
    dao.networkFeeIndexBlockNumberSSV = BigInt.zero();
    dao.liquidationThresholdSSV = BigInt.fromI32(214800);
    dao.minimumLiquidationCollateralSSV = BigInt.fromString(
      "1000000000000000000",
    );
    dao.operatorFeeIncreaseLimit = BigInt.zero();
    dao.declareOperatorFeePeriod = BigInt.zero();
    dao.executeOperatorFeePeriod = BigInt.zero();
    dao.operatorMaximumFee = BigInt.zero();
    dao.operatorMaximumFeeSSV = BigInt.zero();
    dao.validatorsPerOperatorLimit = BigInt.fromI32(3000);
    dao.accEthPerShare = BigInt.zero();
    dao.newFeesWei = BigInt.zero();
    dao.quorum = 0;
    dao.version = "";
    dao.latestMerkleRoot = Bytes.empty();
    dao.totalAccounts = BigInt.zero();
    dao.totalOperators = BigInt.zero();
    dao.totalValidators = BigInt.zero();
    dao.totalEffectiveBalance = BigInt.zero();
    dao.validatorsAdded = BigInt.zero();
    dao.validatorsRemoved = BigInt.zero();
    dao.operatorsAdded = BigInt.zero();
    dao.operatorsRemoved = BigInt.zero();
    dao.lastUpdateBlockNumber = event.block.number;
    dao.lastUpdateBlockTimestamp = event.block.timestamp;
    dao.lastUpdateTransactionHash = event.transaction.hash;
  }
  dao.updateType = "VALIDATOR_ADDED";
  dao.totalEffectiveBalance = dao.totalEffectiveBalance.plus(DEFAULT_BALANCE);
  dao.save();
  dao.validatorsAdded = dao.validatorsAdded.plus(BigInt.fromI32(1));
  dao.totalValidators = dao.totalValidators.plus(BigInt.fromI32(1));

  let owner = Account.load(event.params.owner);
  if (!owner) {
    owner = new Account(event.params.owner);
    log.info(
      `New Address ${owner.id.toHexString()} is adding a validator, creating new Account`,
      [],
    );
    owner.nonce = BigInt.zero();
    owner.validatorCount = BigInt.zero();
    owner.feeRecipient = event.params.owner;
    owner.stakedAmount = BigInt.zero();
    owner.unstakePendingAmount = BigInt.zero();
    // if it's a new account, also increase total counter
    dao.totalAccounts = dao.totalAccounts.plus(BigInt.fromI32(1));
  }
  log.info(
    `Old nonce of Account ${owner.id.toHexString()}: ${owner.nonce}`,
    [],
  );
  owner.nonce = owner.nonce.plus(BigInt.fromI32(1));
  log.info(
    `Increased nonce of Account ${owner.id.toHexString()} to ${owner.nonce}`,
    [],
  );
  owner.validatorCount = owner.validatorCount.plus(BigInt.fromI32(1));
  owner.save();

  let clusterId = `${event.params.owner.toHexString()}-${event.params.operatorIds.join(
    "-",
  )}`;
  let cluster = Cluster.load(clusterId);
  if (!cluster) {
    log.info(
      `Validator ${event.params.publicKey.toHexString()} is being added to new Cluster ${clusterId}`,
      [],
    );
    cluster = new Cluster(clusterId);
    cluster.effectiveBalance = BigInt.fromI32(0);
    // if (compareSemver(dao.version, "v2.0.0") >=0){
    if (event.block.number >= SSV_STAKING_UPDATE_BLOCK_NUMBER){
      cluster.feeAsset = "ETH";
    } else {
      cluster.feeAsset = "SSV";
    }
  }
  
  cluster.owner = owner.id;
  cluster.operatorIds = event.params.operatorIds;
  cluster.validatorCount = event.params.cluster.validatorCount;
  log.info(
    `Set validator count of cluster ${cluster.id} to ${event.params.cluster.validatorCount}`,
    [],
  );
  cluster.effectiveBalance = cluster.effectiveBalance.plus(DEFAULT_BALANCE);
  cluster.vUnits = cluster.effectiveBalance
    .div(DEFAULT_BALANCE)
    .times(VUNITS_PRECISION);
  cluster.networkFeeIndex = event.params.cluster.networkFeeIndex;
  cluster.index = event.params.cluster.index;
  cluster.active = event.params.cluster.active;
  cluster.balance = event.params.cluster.balance;
  cluster.lastUpdateBlockNumber = event.block.number;
  cluster.lastUpdateBlockTimestamp = event.block.timestamp;
  cluster.lastUpdateTransactionHash = event.transaction.hash;
  cluster.save();

  let validatorId = event.params.publicKey;
  let validator = Validator.load(validatorId);
  if (!validator) {
    log.info(
      `new Validator ${event.params.publicKey.toHexString()} being added to Cluster ${clusterId}`,
      [],
    );
    validator = new Validator(validatorId);
  }

  validator.owner = owner.id; // this does not sound right 🧐
  validator.operators = event.params.operatorIds.map<string>((id: BigInt) =>
    id.toString(),
  );
  validator.cluster = cluster.id; // this does not sound right 🧐
  validator.removed = false;
  validator.shares = event.params.shares;
  validator.lastUpdateBlockNumber = event.block.number;
  validator.lastUpdateBlockTimestamp = event.block.timestamp;
  validator.lastUpdateTransactionHash = event.transaction.hash;
  validator.save();

  for (var i = 0; i < event.params.operatorIds.length; i++) {
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
    } else {
      operator.operatorId = event.params.operatorIds[i];
      operator.validatorCount = operator.validatorCount.plus(BigInt.fromI32(1));
      operator.lastUpdateBlockNumber = event.block.number;
      operator.lastUpdateBlockTimestamp = event.block.timestamp;
      operator.lastUpdateTransactionHash = event.transaction.hash;
      operator.save();
    }
  }
  // always save dao counters
  log.info(
    `Dao Values update type: ${dao.updateType}, validator count: ${dao.totalValidators}`,
    [],
  );
  dao.save();
}

export function handleValidatorRemoved(event: ValidatorRemovedEvent): void {
  let entity = new ValidatorRemoved(
    `${event.transaction.hash.toHexString()}-${event.logIndex
      .toString()
      .padStart(5, "0")}`,
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

  entity.save();

  let dao = DAOValues.load(event.address);
  if (!dao) {
    log.error(
      `New DAO Event, DAO values store with ID ${event.address.toHexString()} does not exist on the database, creating it. Update type: DECLARE_OPERATOR_FEE_PERIOD`,
      [],
    );
    dao = new DAOValues(event.address);

    dao.networkFee = BigInt.zero();
    dao.networkFeeIndex = BigInt.zero();
    dao.networkFeeIndexBlockNumber = BigInt.zero();
    dao.liquidationThreshold = BigInt.zero();
    dao.minimumLiquidationCollateral = BigInt.zero();
    dao.networkFeeSSV = BigInt.zero();
    dao.networkFeeIndexSSV = BigInt.zero();
    dao.networkFeeIndexBlockNumberSSV = BigInt.zero();
    dao.liquidationThresholdSSV = BigInt.fromI32(214800);
    dao.minimumLiquidationCollateralSSV = BigInt.fromString(
      "1000000000000000000",
    );
    dao.operatorFeeIncreaseLimit = BigInt.zero();
    dao.declareOperatorFeePeriod = BigInt.zero();
    dao.executeOperatorFeePeriod = BigInt.zero();
    dao.operatorMaximumFee = BigInt.zero();
    dao.operatorMaximumFeeSSV = BigInt.zero();
    dao.validatorsPerOperatorLimit = BigInt.fromI32(3000);
    dao.accEthPerShare = BigInt.zero();
    dao.newFeesWei = BigInt.zero();
    dao.quorum = 0;
    dao.version = "";
    dao.latestMerkleRoot = Bytes.empty();
    dao.totalAccounts = BigInt.zero();
    dao.totalOperators = BigInt.zero();
    dao.totalValidators = BigInt.zero();
    dao.totalEffectiveBalance = BigInt.zero();
    dao.validatorsAdded = BigInt.zero();
    dao.validatorsRemoved = BigInt.zero();
    dao.operatorsAdded = BigInt.zero();
    dao.operatorsRemoved = BigInt.zero();
    dao.lastUpdateBlockNumber = event.block.number;
    dao.lastUpdateBlockTimestamp = event.block.timestamp;
    dao.lastUpdateTransactionHash = event.transaction.hash;
  }
  dao.updateType = "VALIDATOR_REMOVED";
  dao.totalEffectiveBalance = dao.totalEffectiveBalance.minus(DEFAULT_BALANCE);
  dao.validatorsRemoved = dao.validatorsRemoved.plus(BigInt.fromI32(1));
  dao.totalValidators = dao.totalValidators.minus(BigInt.fromI32(1));

  let owner = Account.load(event.params.owner);
  if (!owner) {
    owner = new Account(event.params.owner);
    owner.nonce = BigInt.zero();
    owner.validatorCount = BigInt.zero();
    owner.feeRecipient = event.params.owner;
    owner.stakedAmount = BigInt.zero();
    owner.unstakePendingAmount = BigInt.zero();
  }
  // update owner validator count if the cluster is active
  // (avoid double counting if already liquidated/inactive)
  if (event.params.cluster.active) {
    owner.validatorCount = owner.validatorCount.minus(BigInt.fromI32(1));
  }
  owner.save();

  let clusterId = `${event.params.owner.toHexString()}-${event.params.operatorIds.join(
    "-",
  )}`;
  let cluster = Cluster.load(clusterId);
  if (!cluster) {
    log.error(
      `Validator ${event.params.publicKey.toHexString()} is being removed from Cluster ${clusterId} which does not exist on DB`,
      [],
    );
    cluster = new Cluster(clusterId);
    cluster.feeAsset = "SSV";
    // this is a bit of a trick: initialize with 32, then subtract 32 (~10 lines below here)
    // But this line of code should technically NEVER happen:
    // how can you remove validators from a cluster that does not exist?!
    cluster.effectiveBalance = DEFAULT_BALANCE;
  }

  cluster.owner = owner.id;
  cluster.operatorIds = event.params.operatorIds;
  cluster.validatorCount = event.params.cluster.validatorCount;
  log.info(
    `Set validator count of cluster ${cluster.id} to ${event.params.cluster.validatorCount}`,
    [],
  );
  cluster.effectiveBalance = cluster.effectiveBalance.minus(DEFAULT_BALANCE);
  cluster.vUnits = cluster.effectiveBalance
    .div(DEFAULT_BALANCE)
    .times(VUNITS_PRECISION);
  cluster.networkFeeIndex = event.params.cluster.networkFeeIndex;
  cluster.index = event.params.cluster.index;
  cluster.active = event.params.cluster.active;
  cluster.balance = event.params.cluster.balance;
  cluster.lastUpdateBlockNumber = event.block.number;
  cluster.lastUpdateBlockTimestamp = event.block.timestamp;
  cluster.lastUpdateTransactionHash = event.transaction.hash;
  cluster.save();

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
    validator.owner = owner.id; // this does not sound right 🧐
    validator.removed = true;
    validator.lastUpdateBlockNumber = event.block.number;
    validator.lastUpdateBlockTimestamp = event.block.timestamp;
    validator.lastUpdateTransactionHash = event.transaction.hash;
    validator.save();
  }

  for (var i = 0; i < event.params.operatorIds.length; i++) {
    let operatorId = event.params.operatorIds[i].toString();
    let operator = Operator.load(operatorId);
    if (!operator) {
      log.error(
        `Removing validator data for Operator ${event.params.operatorIds[i]}, but it does not exist on the database`,
        [],
      );
      log.error(
        `Could not create ${operatorId} on the database, because of missing owner, publicKey and fee information`,
        [],
      );
    } else {
      // We only want to amend the validator details for this cluster if it is active
      // This keeps the data in line when liquidations/reactivation events are parsed
      if (cluster.active) {
        operator.operatorId = event.params.operatorIds[i];
        operator.validatorCount = operator.validatorCount.minus(
          BigInt.fromI32(1),
        );
        operator.lastUpdateBlockNumber = event.block.number;
        operator.lastUpdateBlockTimestamp = event.block.timestamp;
        operator.lastUpdateTransactionHash = event.transaction.hash;
        operator.save();
      }
    }
  }
  // always save dao totals counter
  log.info(
    `Dao Values update type: ${dao.updateType}, validator count: ${dao.totalValidators}`,
    [],
  );
  dao.save();
}

// ###### Operator Events ######

export function handleOperatorAdded(event: OperatorAddedEvent): void {
  let entity = new OperatorAdded(
    `${event.transaction.hash.toHexString()}-${event.logIndex
      .toString()
      .padStart(5, "0")}`,
  );
  entity.operatorId = event.params.operatorId;
  entity.owner = event.params.owner;
  entity.publicKey = event.params.publicKey;
  entity.fee = event.params.fee;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let dao = DAOValues.load(event.address);
  if (!dao) {
    log.error(
      `New DAO Event, DAO values store with ID ${event.address.toHexString()} does not exist on the database, creating it. Update type: DECLARE_OPERATOR_FEE_PERIOD`,
      [],
    );
    dao = new DAOValues(event.address);

    dao.networkFee = BigInt.zero();
    dao.networkFeeIndex = BigInt.zero();
    dao.networkFeeIndexBlockNumber = BigInt.zero();
    dao.liquidationThreshold = BigInt.zero();
    dao.minimumLiquidationCollateral = BigInt.zero();
    dao.networkFeeSSV = BigInt.zero();
    dao.networkFeeIndexSSV = BigInt.zero();
    dao.networkFeeIndexBlockNumberSSV = BigInt.zero();
    dao.liquidationThresholdSSV = BigInt.fromI32(214800);
    dao.minimumLiquidationCollateralSSV = BigInt.fromString(
      "1000000000000000000",
    );
    dao.operatorFeeIncreaseLimit = BigInt.zero();
    dao.declareOperatorFeePeriod = BigInt.zero();
    dao.executeOperatorFeePeriod = BigInt.zero();
    dao.operatorMaximumFee = BigInt.zero();
    dao.operatorMaximumFeeSSV = BigInt.zero();
    dao.validatorsPerOperatorLimit = BigInt.fromI32(3000);
    dao.accEthPerShare = BigInt.zero();
    dao.newFeesWei = BigInt.zero();
    dao.quorum = 0;
    dao.version = "";
    dao.latestMerkleRoot = Bytes.empty();
    dao.totalAccounts = BigInt.zero();
    dao.totalOperators = BigInt.zero();
    dao.totalValidators = BigInt.zero();
    dao.totalEffectiveBalance = BigInt.zero();
    dao.validatorsAdded = BigInt.zero();
    dao.validatorsRemoved = BigInt.zero();
    dao.operatorsAdded = BigInt.zero();
    dao.operatorsRemoved = BigInt.zero();
    dao.lastUpdateBlockNumber = event.block.number;
    dao.lastUpdateBlockTimestamp = event.block.timestamp;
    dao.lastUpdateTransactionHash = event.transaction.hash;
  }
  dao.updateType = "OPERATOR_ADDED";
  dao.operatorsAdded = dao.operatorsAdded.plus(BigInt.fromI32(1));

  let owner = Account.load(event.params.owner);
  if (!owner) {
    owner = new Account(event.params.owner);
    owner.nonce = BigInt.zero();
    owner.validatorCount = BigInt.zero();
    owner.feeRecipient = event.params.owner;
    owner.stakedAmount = BigInt.zero();
    owner.unstakePendingAmount = BigInt.zero();
    owner.save();
    // if it's a new account, also update total counter
    dao.totalAccounts = dao.totalAccounts.plus(BigInt.fromI32(1));
  }

  let operatorId = event.params.operatorId.toString();
  let operator = Operator.load(operatorId);
  if (!operator) {
    operator = new Operator(operatorId);
    operator.operatorId = event.params.operatorId;
    operator.owner = owner.id;
    operator.publicKey = event.params.publicKey;
    operator.removed = false;
    // if (dao.version == "v.2.0") {
    if (event.block.number >= SSV_STAKING_UPDATE_BLOCK_NUMBER) {
      operator.fee = event.params.fee;
      operator.ssvFee = BigInt.zero();
    } else {
      operator.fee = BigInt.zero();
      operator.ssvFee = event.params.fee;
    }
    operator.feeIndex = BigInt.zero();
    operator.feeIndexBlockNumber = event.block.number;
    operator.declaredFee = BigInt.zero();
    operator.ssvFeeIndex = BigInt.zero();
    operator.ssvFeeIndexBlockNumber = event.block.number;
    operator.totalEffectiveBalance = BigInt.zero();
    operator.declaredSSVFee = BigInt.zero();
    operator.whitelisted = [];
    operator.isPrivate = false;
    operator.whitelistedContract = Address.fromString(
      "0x0000000000000000000000000000000000000000",
    );
    operator.totalWithdrawn = BigInt.zero();
    operator.validatorCount = BigInt.zero();

    // if it's a new operator, also increase total counter
    dao.totalOperators = dao.totalOperators.plus(BigInt.fromI32(1));
  }

  operator.lastUpdateBlockNumber = event.block.number;
  operator.lastUpdateBlockTimestamp = event.block.timestamp;
  operator.lastUpdateTransactionHash = event.transaction.hash;
  operator.save();

  log.info(
    `Dao Values update type: ${dao.updateType}, operator count: ${dao.totalOperators}`,
    [],
  );
  dao.save();
}

export function handleOperatorFeeDeclarationCancelled(
  event: OperatorFeeDeclarationCancelledEvent,
): void {
  let entity = new OperatorFeeDeclarationCancelled(
    `${event.transaction.hash.toHexString()}-${event.logIndex
      .toString()
      .padStart(5, "0")}`,
  );
  entity.owner = event.params.owner;
  entity.operatorId = event.params.operatorId;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let owner = Account.load(event.params.owner);
  if (!owner) {
    log.error(
      `Cancelling fee declaration for Operator ${
        event.params.operatorId
      }, but Owner ${event.params.owner.toHexString()} did not exist on the database`,
      [],
    );
    owner = new Account(event.params.owner);
    owner.nonce = BigInt.zero();
    owner.validatorCount = BigInt.zero();
    owner.feeRecipient = event.params.owner;
    owner.stakedAmount = BigInt.zero();
    owner.unstakePendingAmount = BigInt.zero();
    owner.save();
  }

  let operatorId = event.params.operatorId.toString();
  let operator = Operator.load(operatorId);
  if (!operator) {
    log.error(
      `Cancelling fee declaration for Operator ${event.params.operatorId}, but it does not exist on the database`,
      [],
    );
    log.error(
      `Could not create ${operatorId} on the database, because of missing publicKey and fee information`,
      [],
    );
  } else {
    operator.operatorId = event.params.operatorId;
    operator.owner = owner.id;
    if (event.block.number < SSV_STAKING_UPDATE_BLOCK_NUMBER) {
      operator.declaredSSVFee = BigInt.zero();
    } else {
      operator.declaredFee = BigInt.zero(); // reset declared fee, as fee change was cancelled
    }
    operator.lastUpdateBlockNumber = event.block.number;
    operator.lastUpdateBlockTimestamp = event.block.timestamp;
    operator.lastUpdateTransactionHash = event.transaction.hash;
    operator.save();
  }
}

export function handleOperatorFeeDeclared(
  event: OperatorFeeDeclaredEvent,
): void {
  let entity = new OperatorFeeDeclared(
    `${event.transaction.hash.toHexString()}-${event.logIndex
      .toString()
      .padStart(5, "0")}`,
  );
  entity.owner = event.params.owner;
  entity.operatorId = event.params.operatorId;
  entity.blockNumber = event.params.blockNumber;
  entity.fee = event.params.fee;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let owner = Account.load(event.params.owner);
  if (!owner) {
    log.error(
      `Declaring fees for Operator ${
        event.params.operatorId
      }, but Owner ${event.params.owner.toHexString()} did not exist on the database`,
      [],
    );
    owner = new Account(event.params.owner);
    owner.nonce = BigInt.zero();
    owner.validatorCount = BigInt.zero();
    owner.feeRecipient = event.params.owner;
    owner.stakedAmount = BigInt.zero();
    owner.unstakePendingAmount = BigInt.zero();
    owner.save();
  }

  let operatorId = event.params.operatorId.toString();
  let operator = Operator.load(operatorId);
  if (!operator) {
    log.error(
      `Declaring fees for Operator ${event.params.operatorId}, but it does not exist on the database`,
      [],
    );
    log.error(
      `Could not create ${operatorId} on the database, because of missing publicKey and fee information`,
      [],
    );
  } else {
    operator.operatorId = event.params.operatorId;
    operator.owner = owner.id;
    if (event.block.number < SSV_STAKING_UPDATE_BLOCK_NUMBER) {
      operator.declaredSSVFee = event.params.fee; // storing declared fee, in case fee change gets cancelled
    } else {
      operator.declaredFee = event.params.fee; // storing declared fee, in case fee change gets cancelled
    }
    operator.lastUpdateBlockNumber = event.block.number;
    operator.lastUpdateBlockTimestamp = event.block.timestamp;
    operator.lastUpdateTransactionHash = event.transaction.hash;
    operator.save();
  }
}

export function handleOperatorFeeExecuted(
  event: OperatorFeeExecutedEvent,
): void {
  let entity = new OperatorFeeExecuted(
    `${event.transaction.hash.toHexString()}-${event.logIndex
      .toString()
      .padStart(5, "0")}`,
  );
  entity.owner = event.params.owner;
  entity.operatorId = event.params.operatorId;
  entity.blockNumber = event.params.blockNumber;
  entity.fee = event.params.fee;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let owner = Account.load(event.params.owner);
  if (!owner) {
    log.error(
      `Executing fees change for Operator ${
        event.params.operatorId
      }, but Owner ${event.params.owner.toHexString()} did not exist on the database`,
      [],
    );
    owner = new Account(event.params.owner);
    owner.nonce = BigInt.zero();
    owner.validatorCount = BigInt.zero();
    owner.feeRecipient = event.params.owner;
    owner.stakedAmount = BigInt.zero();
    owner.unstakePendingAmount = BigInt.zero();
    owner.save();
  }

  let operatorId = event.params.operatorId.toString();
  let operator = Operator.load(operatorId);
  if (!operator) {
    log.error(
      `Executing fees change for Operator ${event.params.operatorId}, but it does not exist on the database`,
      [],
    );
    log.error(
      `Could not create ${operatorId} on the database, because of missing publicKey information`,
      [],
    );
  } else {
    let dao = DAOValues.load(event.address);
    if (!dao) {
      log.error(
        `New DAO Event, DAO values store with ID ${event.address.toHexString()} does not exist on the database, creating it. Update type: DECLARE_OPERATOR_FEE_PERIOD`,
        [],
      );
      return;
    }
    operator.operatorId = event.params.operatorId;
    operator.owner = owner.id;
    // if (dao.version == "v.2.0") {
    if (event.block.number >= SSV_STAKING_UPDATE_BLOCK_NUMBER) {
      // update the index first, because it's using "old" fee, and "old" feeIndexBlockNumber values
      operator.feeIndex = operator.feeIndex.plus(
        event.block.number
          .minus(operator.feeIndexBlockNumber)
          .times(operator.fee),
      );
      operator.feeIndexBlockNumber = event.block.number;
      operator.fee = event.params.fee;
      operator.declaredFee = BigInt.zero(); // reset declared fee, as fee change was executed
    } else {
      // update the index first, because it's using "old" fee, and "old" feeIndexBlockNumber values
      operator.ssvFeeIndex = operator.feeIndex.plus(
        event.block.number
          .minus(operator.ssvFeeIndexBlockNumber)
          .times(operator.ssvFee),
      );
      operator.ssvFeeIndexBlockNumber = event.block.number;
      operator.ssvFee = event.params.fee;
      operator.declaredSSVFee = BigInt.zero(); // reset declared fee, as fee change was executed
    }
    operator.lastUpdateBlockNumber = event.block.number;
    operator.lastUpdateBlockTimestamp = event.block.timestamp;
    operator.lastUpdateTransactionHash = event.transaction.hash;
    operator.save();
  }
}

export function handleOperatorRemoved(event: OperatorRemovedEvent): void {
  let entity = new OperatorRemoved(
    `${event.transaction.hash.toHexString()}-${event.logIndex
      .toString()
      .padStart(5, "0")}`,
  );
  entity.operatorId = event.params.operatorId;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let dao = DAOValues.load(event.address);
  if (!dao) {
    log.error(
      `New DAO Event, DAO values store with ID ${event.address.toHexString()} does not exist on the database, creating it. Update type: DECLARE_OPERATOR_FEE_PERIOD`,
      [],
    );
    dao = new DAOValues(event.address);

    dao.networkFee = BigInt.zero();
    dao.networkFeeIndex = BigInt.zero();
    dao.networkFeeIndexBlockNumber = BigInt.zero();
    dao.liquidationThreshold = BigInt.zero();
    dao.minimumLiquidationCollateral = BigInt.zero();
    dao.networkFeeSSV = BigInt.zero();
    dao.networkFeeIndexSSV = BigInt.zero();
    dao.networkFeeIndexBlockNumberSSV = BigInt.zero();
    dao.liquidationThresholdSSV = BigInt.fromI32(214800);
    dao.minimumLiquidationCollateralSSV = BigInt.fromString(
      "1000000000000000000",
    );
    dao.operatorFeeIncreaseLimit = BigInt.zero();
    dao.declareOperatorFeePeriod = BigInt.zero();
    dao.executeOperatorFeePeriod = BigInt.zero();
    dao.operatorMaximumFee = BigInt.zero();
    dao.operatorMaximumFeeSSV = BigInt.zero();
    dao.validatorsPerOperatorLimit = BigInt.fromI32(3000);
    dao.accEthPerShare = BigInt.zero();
    dao.newFeesWei = BigInt.zero();
    dao.quorum = 0;
    dao.version = "";
    dao.latestMerkleRoot = Bytes.empty();
    dao.totalAccounts = BigInt.zero();
    dao.totalOperators = BigInt.zero();
    dao.totalValidators = BigInt.zero();
    dao.totalEffectiveBalance = BigInt.zero();
    dao.validatorsAdded = BigInt.zero();
    dao.validatorsRemoved = BigInt.zero();
    dao.operatorsAdded = BigInt.zero();
    dao.operatorsRemoved = BigInt.zero();
    dao.lastUpdateBlockNumber = event.block.number;
    dao.lastUpdateBlockTimestamp = event.block.timestamp;
    dao.lastUpdateTransactionHash = event.transaction.hash;
  }
  dao.updateType = "OPERATOR_REMOVED";
  dao.operatorsRemoved = dao.operatorsRemoved.plus(BigInt.fromI32(1));
  dao.totalOperators = dao.totalOperators.minus(BigInt.fromI32(1));

  let operatorId = event.params.operatorId.toString();
  let operator = Operator.load(operatorId);
  if (!operator) {
    log.error(
      `Operator ${operatorId} is being removed, but it does not exist on the database`,
      [],
    );
    log.error(
      `Could not create ${operatorId} on the database, because of missing owner information`,
      [],
    );
  } else {
    operator.operatorId = event.params.operatorId;
    operator.removed = true;
    operator.feeIndex = operator.feeIndex.plus(
      event.block.number
        .minus(operator.feeIndexBlockNumber)
        .times(operator.fee),
    );
    operator.feeIndexBlockNumber = event.block.number;
    operator.fee = new BigInt(0);
    operator.ssvFeeIndex = operator.ssvFeeIndex.plus(
      event.block.number
        .minus(operator.ssvFeeIndexBlockNumber)
        .times(operator.ssvFee),
    );
    operator.ssvFeeIndexBlockNumber = event.block.number;
    operator.ssvFee = new BigInt(0);
    operator.lastUpdateBlockNumber = event.block.number;
    operator.validatorCount = new BigInt(0);
    operator.lastUpdateBlockTimestamp = event.block.timestamp;
    operator.lastUpdateTransactionHash = event.transaction.hash;
    operator.save();
  }

  log.info(
    `Dao Values update type: ${dao.updateType}, validator count: ${dao.totalOperators}`,
    [],
  );
  dao.save();
}

export function handleOperatorWhitelistUpdated(
  event: OperatorWhitelistUpdatedEvent,
): void {
  let entity = new OperatorWhitelistUpdated(
    `${event.transaction.hash.toHexString()}-${event.logIndex
      .toString()
      .padStart(5, "0")}`,
  );
  entity.operatorId = event.params.operatorId;
  entity.whitelisted = event.params.whitelisted;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let whitelisted = Account.load(event.params.whitelisted);
  if (
    !whitelisted &&
    event.params.whitelisted !=
      Address.fromString("0x0000000000000000000000000000000000000000")
  ) {
    log.info(
      `Adding new whitelisted address ${event.params.whitelisted.toHexString()} to Operator ${
        event.params.operatorId
      }, this is a new Account`,
      [],
    );
    whitelisted = new Account(event.params.whitelisted);
    whitelisted.nonce = BigInt.zero();
    whitelisted.validatorCount = BigInt.zero();
    whitelisted.feeRecipient = event.params.whitelisted;
    whitelisted.stakedAmount = BigInt.zero();
    whitelisted.unstakePendingAmount = BigInt.zero();
    whitelisted.save();
  }
  let operatorId = event.params.operatorId.toString();
  let operator = Operator.load(operatorId);
  if (!operator) {
    log.error(
      `Executing fees change for Operator ${event.params.operatorId}, but it does not exist on the database`,
      [],
    );
    log.error(
      `Could not create ${operatorId} on the database, because of missing owner, publicKey and fee information`,
      [],
    );
  } else {
    if (whitelisted) {
      operator.operatorId = event.params.operatorId;
      if (
        event.params.whitelisted ==
        Address.fromString("0x0000000000000000000000000000000000000000")
      ) {
        operator.isPrivate = false;
        operator.whitelisted = [];
      } else {
        operator.isPrivate = true;
        operator.whitelisted = [whitelisted.id];
      }
    }
    operator.lastUpdateBlockNumber = event.block.number;
    operator.lastUpdateBlockTimestamp = event.block.timestamp;
    operator.lastUpdateTransactionHash = event.transaction.hash;
    operator.save();
  }
}

export function handleOperatorMultipleWhitelistUpdated(
  event: OperatorMultipleWhitelistUpdatedEvent,
): void {
  let entity = new OperatorMultipleWhitelistUpdated(
    `${event.transaction.hash.toHexString()}-${event.logIndex
      .toString()
      .padStart(5, "0")}`,
  );

  entity.operatorIds = event.params.operatorIds;
  entity.whitelistAddresses = changetype<Bytes[]>(
    event.params.whitelistAddresses,
  );

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let whitelistIDList: Bytes[] = [];
  for (var i = 0; i < event.params.whitelistAddresses.length; i++) {
    let whitelisted = Account.load(event.params.whitelistAddresses[i]);
    if (!whitelisted) {
      log.info(
        `Adding new whitelisted address ${event.params.whitelistAddresses[
          i
        ].toHexString()} to Multiple Operators: ${
          event.params.operatorIds
        }}, this is a new Account`,
        [],
      );
      whitelisted = new Account(event.params.whitelistAddresses[i]);
      whitelisted.nonce = BigInt.zero();
      whitelisted.validatorCount = BigInt.zero();
      whitelisted.feeRecipient = event.params.whitelistAddresses[i];
      whitelisted.stakedAmount = BigInt.zero();
      whitelisted.unstakePendingAmount = BigInt.zero();
      whitelisted.save();
    }
    whitelistIDList.push(whitelisted.id);
  }

  for (let j = 0; j < event.params.operatorIds.length; j++) {
    let operatorId = event.params.operatorIds[j].toString();
    let operator = Operator.load(operatorId);
    if (!operator) {
      log.error(
        `Executing whitelist additions for Operator ${event.params.operatorIds[j]}, but it does not exist on the database`,
        [],
      );
      log.error(
        `Could not create ${operatorId} on the database, because of missing owner, publicKey and fee information`,
        [],
      );
    } else {
      if (!operator.whitelisted) {
        operator.whitelisted = [];
      }
      operator.operatorId = event.params.operatorIds[j];
      operator.whitelisted = operator.whitelisted.concat(whitelistIDList);
      operator.lastUpdateBlockNumber = event.block.number;
      operator.lastUpdateBlockTimestamp = event.block.timestamp;
      operator.lastUpdateTransactionHash = event.transaction.hash;
      operator.save();
    }
  }
}

export function handleOperatorMultipleWhitelistRemoved(
  event: OperatorMultipleWhitelistRemovedEvent,
): void {
  let entity = new OperatorMultipleWhitelistRemoved(
    `${event.transaction.hash.toHexString()}-${event.logIndex
      .toString()
      .padStart(5, "0")}`,
  );
  entity.operatorIds = event.params.operatorIds;
  entity.whitelistAddresses = changetype<Bytes[]>(
    event.params.whitelistAddresses,
  );

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let whitelistAddressSet: Bytes[] = [];
  for (let i = 0; i < event.params.whitelistAddresses.length; i++) {
    let address = event.params.whitelistAddresses[i];
    let whitelisted = Account.load(address);
    if (!whitelisted) {
      log.info(
        `Removing whitelisted address ${address.toHexString()} to Multiple Operators: ${
          event.params.operatorIds
        }, this is a new Account`,
        [],
      );
      whitelisted = new Account(address);
      whitelisted.nonce = BigInt.zero();
      whitelisted.validatorCount = BigInt.zero();
      whitelisted.feeRecipient = whitelisted.id;
      whitelisted.stakedAmount = BigInt.zero();
      whitelisted.unstakePendingAmount = BigInt.zero();
      whitelisted.save();
    }
    whitelistAddressSet.push(whitelisted.id as Bytes);
  }

  for (let j = 0; j < event.params.operatorIds.length; j++) {
    let operatorId = event.params.operatorIds[j].toString();
    let operator = Operator.load(operatorId);
    if (!operator) {
      log.error(
        `Executing whitelist removals for Operator ${event.params.operatorIds[j]}, but it does not exist on the database`,
        [],
      );
      log.error(
        `Could not create ${operatorId} on the database, because of missing owner, publicKey and fee information`,
        [],
      );
    } else {
      if (!operator.whitelisted) {
        operator.whitelisted = [];
      }

      operator.operatorId = event.params.operatorIds[j];

      let whitelistArray = operator.whitelisted;
      let indexesToRemove: i32[] = [];
      for (let k = whitelistArray.length - 1; k >= 0; k--) {
        for (let l = 0; l < whitelistAddressSet.length; l++) {
          if (whitelistAddressSet[l] == whitelistArray[k]) {
            indexesToRemove.push(k);
          }
        }
      }

      for (let m = 0; m < indexesToRemove.length; m++) {
        whitelistArray.splice(indexesToRemove[m], 1);
      }

      operator.whitelisted = whitelistArray;
      operator.lastUpdateBlockNumber = event.block.number;
      operator.lastUpdateBlockTimestamp = event.block.timestamp;
      operator.lastUpdateTransactionHash = event.transaction.hash;
      operator.save();
    }
  }
}

export function handleOperatorWhitelistingContractUpdated(
  event: OperatorWhitelistingContractUpdatedEvent,
): void {
  let entity = new OperatorWhitelistingContractUpdated(
    `${event.transaction.hash.toHexString()}-${event.logIndex
      .toString()
      .padStart(5, "0")}`,
  );

  entity.operatorIds = event.params.operatorIds;
  entity.whitelistingContract = event.params.whitelistingContract;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
  for (var i = 0; i < event.params.operatorIds.length; i++) {
    let operatorId = event.params.operatorIds[i].toString();
    let operator = Operator.load(operatorId);
    if (!operator) {
      log.error(
        `Executing whitelist contract updates for Operator ${event.params.operatorIds[i]}, but it does not exist on the database`,
        [],
      );
      log.error(
        `Could not create ${operatorId} on the database, because of missing owner, publicKey and fee information`,
        [],
      );
    } else {
      if (!operator.whitelisted) {
        operator.whitelisted = [];
      }
      operator.operatorId = event.params.operatorIds[i];
      operator.whitelistedContract = event.params.whitelistingContract;
      operator.lastUpdateBlockNumber = event.block.number;
      operator.lastUpdateBlockTimestamp = event.block.timestamp;
      operator.lastUpdateTransactionHash = event.transaction.hash;
      operator.save();
    }
  }
}

export function handleOperatorPrivacyStatusUpdated(
  event: OperatorPrivacyStatusUpdatedEvent,
): void {
  let entity = new OperatorPrivacyStatusUpdated(
    `${event.transaction.hash.toHexString()}-${event.logIndex
      .toString()
      .padStart(5, "0")}`,
  );

  entity.operatorIds = event.params.operatorIds;
  entity.toPrivate = event.params.toPrivate;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  for (var i = 0; i < event.params.operatorIds.length; i++) {
    let operatorId = event.params.operatorIds[i].toString();
    let operator = Operator.load(operatorId);
    if (!operator) {
      log.error(
        `Executing privacy status updates for Operator ${event.params.operatorIds[i]}, but it does not exist on the database`,
        [],
      );
      log.error(
        `Could not create ${operatorId} on the database, because of missing owner, publicKey and fee information`,
        [],
      );
    } else {
      if (!operator.whitelisted) {
        operator.whitelisted = [];
      }
      operator.operatorId = event.params.operatorIds[i];
      operator.isPrivate = event.params.toPrivate;
      operator.lastUpdateBlockNumber = event.block.number;
      operator.lastUpdateBlockTimestamp = event.block.timestamp;
      operator.lastUpdateTransactionHash = event.transaction.hash;
      operator.save();
    }
  }
}

export function handleOperatorWithdrawn(event: OperatorWithdrawnEvent): void {
  let entity = new OperatorWithdrawn(
    `${event.transaction.hash.toHexString()}-${event.logIndex
      .toString()
      .padStart(5, "0")}`,
  );
  entity.owner = event.params.owner;
  entity.operatorId = event.params.operatorId;
  entity.value = event.params.value;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let owner = Account.load(event.params.owner);
  if (!owner) {
    log.error(
      `Executing fees change for Operator ${
        event.params.operatorId
      }, but Owner ${event.params.owner.toHexString()} did not exist on the database`,
      [],
    );
    owner = new Account(event.params.owner);
    owner.nonce = BigInt.zero();
    owner.validatorCount = BigInt.zero();
    owner.feeRecipient = event.params.owner;
    owner.stakedAmount = BigInt.zero();
    owner.unstakePendingAmount = BigInt.zero();
    owner.save();
  }

  let operatorId = event.params.operatorId.toString();
  let operator = Operator.load(operatorId);
  if (!operator) {
    log.error(
      `Executing fees change for Operator ${event.params.operatorId}, but it does not exist on the database`,
      [],
    );
    log.error(
      `Could not create ${operatorId} on the database, because of missing publicKey and fee information`,
      [],
    );
  } else {
    operator.operatorId = event.params.operatorId;
    operator.totalWithdrawn.minus(event.params.value);
    operator.lastUpdateBlockNumber = event.block.number;
    operator.lastUpdateBlockTimestamp = event.block.timestamp;
    operator.lastUpdateTransactionHash = event.transaction.hash;
    operator.save();
  }
}

// Staking Events

export function handleERC20Rescued(event: ERC20RescuedEvent): void {
  let entity = new ERC20Rescued(
    `${event.transaction.hash.toHexString()}-${event.logIndex
      .toString()
      .padStart(5, "0")}`,
  );
  entity.token = event.params.token;
  entity.to = event.params.to;
  entity.amount = event.params.amount;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleFeesSynced(event: FeesSyncedEvent): void {
  log.info(
    `New feesWei: ${event.params.newFeesWei}, accEthPerShare: ${event.params.accEthPerShare}`,
    [],
  );

  let entity = new FeesSynced(
    `${event.transaction.hash.toHexString()}-${event.logIndex
      .toString()
      .padStart(5, "0")}`,
  );
  entity.newFeesWei = event.params.newFeesWei;
  entity.accEthPerShare = event.params.accEthPerShare;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
  let dao = DAOValues.load(event.address);
  if (!dao) {
    log.error(
      `New DAO Event, DAO values store with ID ${event.address.toHexString()} does not exist on the database, creating it. Update type: QUORUM_UPDATED`,
      [],
    );
  } else {
    dao.updateType = "FEES_SYNCED";
    dao.accEthPerShare = event.params.accEthPerShare;
    dao.newFeesWei = event.params.newFeesWei;
    dao.lastUpdateBlockNumber = event.block.number;
    dao.lastUpdateBlockTimestamp = event.block.timestamp;
    dao.lastUpdateTransactionHash = event.transaction.hash;

    log.info(
      `Dao Values update type: ${dao.updateType}, new ETH per share: ${dao.accEthPerShare}, new fees wei: ${dao.newFeesWei}`,
      [],
    );
    dao.save();
  }
}

export function handleRewardsClaimed(event: RewardsClaimedEvent): void {
  let entity = new RewardsClaimed(
    `${event.transaction.hash.toHexString()}-${event.logIndex
      .toString()
      .padStart(5, "0")}`,
  );
  entity.user = event.params.user;
  entity.amount = event.params.amount;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleRewardsSettled(event: RewardsSettledEvent): void {
  let entity = new RewardsSettled(
    `${event.transaction.hash.toHexString()}-${event.logIndex
      .toString()
      .padStart(5, "0")}`,
  );
  entity.user = event.params.user;
  entity.accrued = event.params.accrued;
  entity.pending = event.params.pending;
  entity.userIndex = event.params.userIndex;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleStaked(event: StakedEvent): void {
  let entity = new Staked(
    `${event.transaction.hash.toHexString()}-${event.logIndex
      .toString()
      .padStart(5, "0")}`,
  );
  entity.user = event.params.user;
  entity.amount = event.params.amount;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let user = Account.load(event.params.user);
  if (!user) {
    user = new Account(event.params.user);
    user.nonce = BigInt.zero();
    user.validatorCount = BigInt.zero();
    user.feeRecipient = event.params.user;
    user.stakedAmount = BigInt.zero();
    user.unstakePendingAmount = BigInt.zero();
  }
  user.stakedAmount = user.stakedAmount.plus(event.params.amount);
  user.save();
}

export function handleUnstakeRequested(event: UnstakeRequestedEvent): void {
  let entity = new UnstakeRequested(
    `${event.transaction.hash.toHexString()}-${event.logIndex
      .toString()
      .padStart(5, "0")}`,
  );
  entity.user = event.params.user;
  entity.amount = event.params.amount;
  entity.unlockTime = event.params.unlockTime;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let user = Account.load(event.params.user);
  if (!user) {
    log.error(
      `Unstake requested for User ${event.params.user.toHexString()}, but the account does not exist on the database`,
      [],
    );
  } else {
    user.unstakePendingAmount = user.unstakePendingAmount.plus(
      event.params.amount,
    );
    user.stakedAmount = user.stakedAmount.minus(event.params.amount);
    user.save();
  }
}

export function handleUnstakedWithdrawn(event: UnstakedWithdrawnEvent): void {
  let entity = new UnstakedWithdrawn(
    `${event.transaction.hash.toHexString()}-${event.logIndex
      .toString()
      .padStart(5, "0")}`,
  );
  entity.user = event.params.user;
  entity.amount = event.params.amount;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let user = Account.load(event.params.user);
  if (!user) {
    log.error(
      `Unstake withdrawn for User ${event.params.user.toHexString()}, but the account does not exist on the database`,
      [],
    );
  } else {
    user.unstakePendingAmount = user.unstakePendingAmount.minus(
      event.params.amount,
    );
    user.save();
  }
}

// Oracles events

export function handleRootCommitted(event: RootCommittedEvent): void {
  let entity = new RootCommitted(
    `${event.transaction.hash.toHexString()}-${event.logIndex
      .toString()
      .padStart(5, "0")}`,
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
      `New DAO Event, DAO values store with ID ${event.address.toHexString()} does not exist on the database, creating it. Update type: ROOT_COMMITTED`,
      [],
    );
    dao = new DAOValues(event.address);
    return;
  }
  dao.updateType = "ROOT_COMMITTED";
  dao.latestMerkleRoot = event.params.merkleRoot;
  dao.lastUpdateBlockNumber = event.block.number;
  dao.lastUpdateBlockTimestamp = event.block.timestamp;
  dao.lastUpdateTransactionHash = event.transaction.hash;

  log.info(
    `Dao Values update type: ${dao.updateType}, new latest merkle root: ${dao.latestMerkleRoot.toHexString()}`,
    [],
  );
  dao.save();
}

// export function handleDelegationUpdated(event: DelegationUpdatedEvent): void {
//   let entity = new DelegationUpdated(
//     `${event.transaction.hash.toHexString()}-${event.logIndex
//       .toString()
//       .padStart(5, "0")}`,
//   );
//   entity.user = event.params.user;
//   entity.oracleIds = event.params.oracleIds;
//   entity.amounts = event.params.amounts;

//   entity.blockNumber = event.block.number;
//   entity.blockTimestamp = event.block.timestamp;
//   entity.transactionHash = event.transaction.hash;

//   entity.save();

//   let user = Account.load(event.params.user);
//   if (!user) {
//     user = new Account(event.params.user);
//     user.nonce = BigInt.zero();
//     user.validatorCount = BigInt.zero();
//     user.feeRecipient = event.params.user;
//     user.stakedAmount = BigInt.zero();
//     user.unstakePendingAmount = BigInt.zero();
//     user.save();
//   }

//   for (let i = 0; i < event.params.oracleIds.length; i++) {
//     let oracle = Oracle.load(event.params.oracleIds[i].toString());
//     if (!oracle) {
//       oracle = new Oracle(event.params.oracleIds[i].toString());
//       oracle.oracleId = event.params.oracleIds[i];
//       oracle.totalDelegatedAmount = BigInt.zero();
//       oracle.oracleAddress = Bytes.empty();
//       oracle.lastUpdateBlockNumber = event.block.number;
//       oracle.lastUpdateBlockTimestamp = event.block.timestamp;
//       oracle.lastUpdateTransactionHash = event.transaction.hash;
//     }
//     oracle.totalDelegatedAmount = oracle.totalDelegatedAmount.plus(
//       event.params.amounts[i],
//     );
//     oracle.save();

//     let oracleDelegationId = `${user.id.toHexString()}-${oracle.id}`;
//     let oracleDelegation = OracleDelegation.load(oracleDelegationId);
//     if (!oracleDelegation) {
//       oracleDelegation = new OracleDelegation(oracleDelegationId);
//       oracleDelegation.delegator = user.id;
//       oracleDelegation.delegatedOracle = oracle.id;
//       oracleDelegation.amount = BigInt.zero();
//     }
//     oracleDelegation.amount = oracleDelegation.amount.plus(
//       event.params.amounts[i],
//     );
//     oracleDelegation.save();
//   }
// }

export function handleOracleReplaced(event: OracleReplacedEvent): void {
  let entity = new OracleReplaced(
    `${event.transaction.hash.toHexString()}-${event.logIndex
      .toString()
      .padStart(5, "0")}`,
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
    // oracle.totalDelegatedAmount = BigInt.zero();
    oracle.lastUpdateBlockNumber = event.block.number;
    oracle.lastUpdateBlockTimestamp = event.block.timestamp;
    oracle.lastUpdateTransactionHash = event.transaction.hash;
  }
  oracle.oracleAddress = event.params.newOracle;
  oracle.save();
}

export function handleQuorumUpdated(event: QuorumUpdatedEvent): void {
  let entity = new QuorumUpdated(
    `${event.transaction.hash.toHexString()}-${event.logIndex
      .toString()
      .padStart(5, "0")}`,
  );
  entity.newQuorum = event.params.newQuorum;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
  let dao = DAOValues.load(event.address);
  if (!dao) {
    log.error(
      `New DAO Event, DAO values store with ID ${event.address.toHexString()} does not exist on the database, creating it. Update type: QUORUM_UPDATED`,
      [],
    );
  } else {
    dao.updateType = "QUORUM_UPDATED";
    dao.quorum = event.params.newQuorum;
    dao.lastUpdateBlockNumber = event.block.number;
    dao.lastUpdateBlockTimestamp = event.block.timestamp;
    dao.lastUpdateTransactionHash = event.transaction.hash;

    log.info(
      `Dao Values update type: ${dao.updateType}, new quorum: ${dao.quorum}`,
      [],
    );
    dao.save();
  }
}

export function handleWeightedRootProposed(
  event: WeightedRootProposedEvent,
): void {
  let entity = new WeightedRootProposed(
    `${event.transaction.hash.toHexString()}-${event.logIndex
      .toString()
      .padStart(5, "0")}`,
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

export function handleSSVNetworkUpgradeBlock(
  event: SSVNetworkUpgradeBlockEvent,
): void {
  let entity = new SSVNetworkUpgradeBlock(
    `${event.transaction.hash.toHexString()}-${event.logIndex
      .toString()
      .padStart(5, "0")}`,
  );

  entity.version = event.params.version;
  entity.blockNumber = event.params.blockNumber;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let dao = DAOValues.load(event.address);
  if (!dao) {
    log.error(
      `New DAO Event, DAO values store with ID ${event.address.toHexString()} does not exist on the database, creating it. Update type: QUORUM_UPDATED`,
      [],
    );
  } else {
    dao.updateType = "SSV_NETWORK_UPGRADE";
    dao.version = event.params.version;
    if (compareSemver(dao.version, "v2.0.0") >= 0) {
    // if (event.block.number >= SSV_STAKING_UPDATE_BLOCK_NUMBER) {
      dao.networkFeeIndex = BigInt.zero();
      dao.networkFeeIndexBlockNumber = event.params.blockNumber;
    }
    dao.lastUpdateBlockNumber = event.block.number;
    dao.lastUpdateBlockTimestamp = event.block.timestamp;
    dao.lastUpdateTransactionHash = event.transaction.hash;

    log.info(
      `Dao Values update type: ${dao.updateType}, contract upgraded to version ${dao.version}`,
      [],
    );
    dao.save();
  }
}

function compareSemver(version1:string, version2: string): number {
  const components1 = version1.split(".")
  const components2 = version2.split(".")

  const major1 = parseInt(components1[0].replace("v", ""))
  const major2 = parseInt(components2[0].replace("v", ""))
  const minor1 = parseInt(components1[0])
  const minor2 = parseInt(components2[0])
  const patch1 = parseInt(components1[0])
  const patch2 = parseInt(components2[0])

  if (major1 > major2) return 1
  if (major1 < major2) return -1
  if (minor1 > minor2) return 1
  if (minor1 < minor2) return -1
  if (patch1 > patch2) return 1
  if (patch1 < patch2) return -1
  return 0
}
