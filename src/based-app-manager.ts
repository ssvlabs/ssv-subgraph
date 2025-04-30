import { Address, BigInt, Bytes, log, store } from "@graphprotocol/graph-ts";
import {
  AccountMetadataURIUpdated as AccountMetadataURIUpdatedEvent,
  BAppMetadataURIUpdated as BAppMetadataURIUpdatedEvent,
  BAppOptedInByStrategy as BAppOptedInByStrategyEvent,
  BAppRegistered as BAppRegisteredEvent,
  BAppTokensUpdated as BAppTokensUpdatedEvent,
  DelegationCreated as DelegationCreatedEvent,
  DelegationRemoved as DelegationRemovedEvent,
  DelegationUpdated as DelegationUpdatedEvent,
  Initialized as InitializedEvent,
  FeeExpireTimeUpdated as FeeExpireTimeUpdatedEvent,
  FeeTimelockPeriodUpdated as FeeTimelockPeriodUpdatedEvent,
  ObligationExpireTimeUpdated as ObligationExpireTimeUpdatedEvent,
  ObligationTimelockPeriodUpdated as ObligationTimelockPeriodUpdatedEvent,
  StrategyMaxFeeIncrementUpdated as StrategyMaxFeeIncrementUpdatedEvent,
  StrategyMaxSharesUpdated as StrategyMaxSharesUpdatedEvent,
  WithdrawalTimelockPeriodUpdated as WithdrawalTimelockPeriodUpdatedEvent,
  WithdrawalExpireTimeUpdated as WithdrawalExpireTimeUpdatedEvent,
  SlashingFundWithdrawn as SlashingFundWithdrawnEvent,
  MaxFeeIncrementSet as MaxFeeIncrementSetEvent,
  ObligationCreated as ObligationCreatedEvent,
  ObligationUpdateProposed as ObligationUpdateProposedEvent,
  ObligationUpdated as ObligationUpdatedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  StrategyCreated as StrategyCreatedEvent,
  StrategyDeposit as StrategyDepositEvent,
  StrategyFeeUpdateProposed as StrategyFeeUpdateProposedEvent,
  StrategyFeeUpdated as StrategyFeeUpdatedEvent,
  StrategySlashed as StrategySlashedEvent,
  StrategyMetadataURIUpdated as StrategyMetadataURIUpdatedEvent,
  StrategyWithdrawal as StrategyWithdrawalEvent,
  StrategyWithdrawalProposed as StrategyWithdrawalProposedEvent,
} from "../generated/BasedAppManager/BasedAppManager";
import {
  Account,
  AccountMetadataURIUpdated,
  BApp,
  BAppConstants,
  BAppMetadataURIUpdated,
  BAppOptedInByStrategy,
  BAppRegistered,
  BAppTokensUpdated,
  Delegation,
  DelegationCreated,
  DelegationRemoved,
  DelegationUpdated,
  Initialized,
  MaxFeeIncrementSet,
  Obligation,
  ObligationCreated,
  ObligationUpdateProposed,
  ObligationUpdated,
  OwnershipTransferred,
  BAppToken,
  Strategy,
  StrategyBAppOptIn,
  StrategyCreated,
  StrategyDeposit,
  StrategyFeeUpdateProposed,
  StrategyFeeUpdated,
  StrategyUserBalance,
  StrategyMetadataURIUpdated,
  StrategyWithdrawal,
  StrategyWithdrawalProposed,
  StrategyTokenBalance,
  FeeExpireTimeUpdated,
  FeeTimelockPeriodUpdated,
  ObligationExpireTimeUpdated,
  ObligationTimelockPeriodUpdated,
  StrategyMaxFeeIncrementUpdated,
  StrategyMaxSharesUpdated,
  WithdrawalTimelockPeriodUpdated,
  WithdrawalExpireTimeUpdated,
  SlashingFundWithdrawn,
  StrategySlashed,
} from "../generated/schema";

// export function handleInitialize(call: InitializeCall): void {
//   let proxyContract = call.from;
//   if (
//     !proxyContract
//       .toHexString()
//       .toLowerCase()
//       .includes("0x1bd6ceb98daf7ffeb590236b720f81b65213836a")
//   ) {
//     log.error(
//       `Caller is ${proxyContract.toHexString()}, but we only expect 0x1bd6ceb98daf7ffeb590236b720f81b65213836a`,
//       []
//     );
//     return;
//   }

//   log.info(
//     `New contract ${call.to.toHexString()} Initialized, Bapp Constant values stored with ID ${proxyContract.toHexString()} Updating maxFeeIncrement constant`,
//     []
//   );

//   let bAppConstants = BAppConstants.load(proxyContract);
//   if (!bAppConstants) {

//     log.warning(
//       `Contract ${call.to.toHexString()} is a new implementation, but the Bapp Constant values with ID ${proxyContract.toHexString()} does not exist on the database, creating it`,
//       []
//     );

//     bAppConstants = new BAppConstants(proxyContract);
//     bAppConstants.totalAccounts = BigInt.zero();
//     bAppConstants.totalBApps = BigInt.zero();
//     bAppConstants.totalStrategies = BigInt.zero();
//   }

//   bAppConstants._maxFeeIncrement = call.inputs._maxFeeIncrement;

//   bAppConstants.save();
// }

export function handleFeeExpireTimeUpdated(
  event: FeeExpireTimeUpdatedEvent
): void {
  let entity = new FeeExpireTimeUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.feeExpireTime = event.params.feeExpireTime;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let bAppConstants = BAppConstants.load(event.address);
  if (!bAppConstants) {
    log.error(
      "Trying to adjust total Accounts, but constant entry does not exist, and cannot be created",
      []
    );
    bAppConstants = new BAppConstants(event.address);
    bAppConstants._feeExpireTime = BigInt.fromI32(1);
    bAppConstants._feeTimelockPeriod = BigInt.fromI32(7);
    bAppConstants._obligationExpireTime = BigInt.fromI32(3);
    bAppConstants._obligationTimelockPeriod = BigInt.fromI32(14);
    bAppConstants._strategyMaxFeeIncrement = BigInt.fromI32(500);
    bAppConstants._strategyMaxShares = BigInt.fromI32(10000);
    bAppConstants._withdrawalExpireTime = BigInt.fromI32(3);
    bAppConstants._withdrawalTimelockPeriod = BigInt.fromI32(14);
    bAppConstants.totalAccounts = BigInt.zero();
    bAppConstants.totalBApps = BigInt.zero();
    bAppConstants.totalStrategies = BigInt.zero();
  }
  bAppConstants._feeExpireTime = event.params.feeExpireTime;
  bAppConstants.save();
}

export function handleFeeTimelockPeriodUpdated(
  event: FeeTimelockPeriodUpdatedEvent
): void {
  let entity = new FeeTimelockPeriodUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.feeTimelockPeriod = event.params.feeTimelockPeriod;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let bAppConstants = BAppConstants.load(event.address);
  if (!bAppConstants) {
    log.error(
      "Trying to adjust total Accounts, but constant entry does not exist, and cannot be created",
      []
    );
    bAppConstants = new BAppConstants(event.address);
    bAppConstants._feeExpireTime = BigInt.fromI32(1);
    bAppConstants._feeTimelockPeriod = BigInt.fromI32(7);
    bAppConstants._obligationExpireTime = BigInt.fromI32(3);
    bAppConstants._obligationTimelockPeriod = BigInt.fromI32(14);
    bAppConstants._strategyMaxFeeIncrement = BigInt.fromI32(500);
    bAppConstants._strategyMaxShares = BigInt.fromI32(10000);
    bAppConstants._withdrawalExpireTime = BigInt.fromI32(3);
    bAppConstants._withdrawalTimelockPeriod = BigInt.fromI32(14);
    bAppConstants.totalAccounts = BigInt.zero();
    bAppConstants.totalBApps = BigInt.zero();
    bAppConstants.totalStrategies = BigInt.zero();
  }
  bAppConstants._feeTimelockPeriod = event.params.feeTimelockPeriod;
  bAppConstants.save();
}

export function handleObligationExpireTimeUpdated(
  event: ObligationExpireTimeUpdatedEvent
): void {
  let entity = new ObligationExpireTimeUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.obligationExpireTime = event.params.obligationExpireTime;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let bAppConstants = BAppConstants.load(event.address);
  if (!bAppConstants) {
    log.error(
      "Trying to adjust total Accounts, but constant entry does not exist, and cannot be created",
      []
    );
    bAppConstants = new BAppConstants(event.address);
    bAppConstants._feeExpireTime = BigInt.fromI32(1);
    bAppConstants._feeTimelockPeriod = BigInt.fromI32(7);
    bAppConstants._obligationExpireTime = BigInt.fromI32(3);
    bAppConstants._obligationTimelockPeriod = BigInt.fromI32(14);
    bAppConstants._strategyMaxFeeIncrement = BigInt.fromI32(500);
    bAppConstants._strategyMaxShares = BigInt.fromI32(10000);
    bAppConstants._withdrawalExpireTime = BigInt.fromI32(3);
    bAppConstants._withdrawalTimelockPeriod = BigInt.fromI32(14);
    bAppConstants.totalAccounts = BigInt.zero();
    bAppConstants.totalBApps = BigInt.zero();
    bAppConstants.totalStrategies = BigInt.zero();
  }
  bAppConstants._obligationExpireTime = event.params.obligationExpireTime;
  bAppConstants.save();
}

export function handleObligationTimelockPeriodUpdated(
  event: ObligationTimelockPeriodUpdatedEvent
): void {
  let entity = new ObligationTimelockPeriodUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.obligationTimelockPeriod = event.params.obligationTimelockPeriod;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let bAppConstants = BAppConstants.load(event.address);
  if (!bAppConstants) {
    log.error(
      "Trying to adjust total Accounts, but constant entry does not exist, and cannot be created",
      []
    );
    bAppConstants = new BAppConstants(event.address);
    bAppConstants._feeExpireTime = BigInt.fromI32(1);
    bAppConstants._feeTimelockPeriod = BigInt.fromI32(7);
    bAppConstants._obligationExpireTime = BigInt.fromI32(3);
    bAppConstants._obligationTimelockPeriod = BigInt.fromI32(14);
    bAppConstants._strategyMaxFeeIncrement = BigInt.fromI32(500);
    bAppConstants._strategyMaxShares = BigInt.fromI32(10000);
    bAppConstants._withdrawalExpireTime = BigInt.fromI32(3);
    bAppConstants._withdrawalTimelockPeriod = BigInt.fromI32(14);
    bAppConstants.totalAccounts = BigInt.zero();
    bAppConstants.totalBApps = BigInt.zero();
    bAppConstants.totalStrategies = BigInt.zero();
  }
  bAppConstants._obligationTimelockPeriod =
    event.params.obligationTimelockPeriod;
  bAppConstants.save();
}

export function handleStrategyMaxFeeIncrementUpdated(
  event: StrategyMaxFeeIncrementUpdatedEvent
): void {
  let entity = new StrategyMaxFeeIncrementUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.strategyMaxFeeIncrement = event.params.maxFeeIncrement;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let bAppConstants = BAppConstants.load(event.address);
  if (!bAppConstants) {
    log.error(
      "Trying to adjust total Accounts, but constant entry does not exist, and cannot be created",
      []
    );
    bAppConstants = new BAppConstants(event.address);
    bAppConstants._feeExpireTime = BigInt.fromI32(1);
    bAppConstants._feeTimelockPeriod = BigInt.fromI32(7);
    bAppConstants._obligationExpireTime = BigInt.fromI32(3);
    bAppConstants._obligationTimelockPeriod = BigInt.fromI32(14);
    bAppConstants._strategyMaxFeeIncrement = BigInt.fromI32(500);
    bAppConstants._strategyMaxShares = BigInt.fromI32(10000);
    bAppConstants._withdrawalExpireTime = BigInt.fromI32(3);
    bAppConstants._withdrawalTimelockPeriod = BigInt.fromI32(14);
    bAppConstants.totalAccounts = BigInt.zero();
    bAppConstants.totalBApps = BigInt.zero();
    bAppConstants.totalStrategies = BigInt.zero();
  }
  bAppConstants._strategyMaxFeeIncrement = event.params.maxFeeIncrement;
  bAppConstants.save();
}

export function handleStrategyMaxSharesUpdated(
  event: StrategyMaxSharesUpdatedEvent
): void {
  let entity = new StrategyMaxSharesUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.strategyMaxShares = event.params.maxShares;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let bAppConstants = BAppConstants.load(event.address);
  if (!bAppConstants) {
    log.error(
      "Trying to adjust total Accounts, but constant entry does not exist, and cannot be created",
      []
    );
    bAppConstants = new BAppConstants(event.address);
    bAppConstants._feeExpireTime = BigInt.fromI32(1);
    bAppConstants._feeTimelockPeriod = BigInt.fromI32(7);
    bAppConstants._obligationExpireTime = BigInt.fromI32(3);
    bAppConstants._obligationTimelockPeriod = BigInt.fromI32(14);
    bAppConstants._strategyMaxFeeIncrement = BigInt.fromI32(500);
    bAppConstants._strategyMaxShares = BigInt.fromI32(10000);
    bAppConstants._withdrawalExpireTime = BigInt.fromI32(3);
    bAppConstants._withdrawalTimelockPeriod = BigInt.fromI32(14);
    bAppConstants.totalAccounts = BigInt.zero();
    bAppConstants.totalBApps = BigInt.zero();
    bAppConstants.totalStrategies = BigInt.zero();
  }
  bAppConstants._strategyMaxShares = event.params.maxShares;
  bAppConstants.save();
}

export function handleWithdrawalTimelockPeriodUpdated(
  event: WithdrawalTimelockPeriodUpdatedEvent
): void {
  let entity = new WithdrawalTimelockPeriodUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.withdrawalTimelockPeriod = event.params.withdrawalTimelockPeriod;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let bAppConstants = BAppConstants.load(event.address);
  if (!bAppConstants) {
    log.error(
      "Trying to adjust total Accounts, but constant entry does not exist, and cannot be created",
      []
    );
    bAppConstants = new BAppConstants(event.address);
    bAppConstants._feeExpireTime = BigInt.fromI32(1);
    bAppConstants._feeTimelockPeriod = BigInt.fromI32(7);
    bAppConstants._obligationExpireTime = BigInt.fromI32(3);
    bAppConstants._obligationTimelockPeriod = BigInt.fromI32(14);
    bAppConstants._strategyMaxFeeIncrement = BigInt.fromI32(500);
    bAppConstants._strategyMaxShares = BigInt.fromI32(10000);
    bAppConstants._withdrawalExpireTime = BigInt.fromI32(3);
    bAppConstants._withdrawalTimelockPeriod = BigInt.fromI32(14);
    bAppConstants.totalAccounts = BigInt.zero();
    bAppConstants.totalBApps = BigInt.zero();
    bAppConstants.totalStrategies = BigInt.zero();
  }
  bAppConstants._withdrawalTimelockPeriod =
    event.params.withdrawalTimelockPeriod;
  bAppConstants.save();
}

export function handleWithdrawalExpireTimeUpdated(
  event: WithdrawalExpireTimeUpdatedEvent
): void {
  let entity = new WithdrawalExpireTimeUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.withdrawalExpireTime = event.params.withdrawalExpireTime;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let bAppConstants = BAppConstants.load(event.address);
  if (!bAppConstants) {
    log.error(
      "Trying to adjust total Accounts, but constant entry does not exist, and cannot be created",
      []
    );
    bAppConstants = new BAppConstants(event.address);
    bAppConstants._feeExpireTime = BigInt.fromI32(1);
    bAppConstants._feeTimelockPeriod = BigInt.fromI32(7);
    bAppConstants._obligationExpireTime = BigInt.fromI32(3);
    bAppConstants._obligationTimelockPeriod = BigInt.fromI32(14);
    bAppConstants._strategyMaxFeeIncrement = BigInt.fromI32(500);
    bAppConstants._strategyMaxShares = BigInt.fromI32(10000);
    bAppConstants._withdrawalExpireTime = BigInt.fromI32(3);
    bAppConstants._withdrawalTimelockPeriod = BigInt.fromI32(14);
    bAppConstants.totalAccounts = BigInt.zero();
    bAppConstants.totalBApps = BigInt.zero();
    bAppConstants.totalStrategies = BigInt.zero();
  }
  bAppConstants._withdrawalExpireTime = event.params.withdrawalExpireTime;
  bAppConstants.save();
}

export function handleBAppMetadataURIUpdated(
  event: BAppMetadataURIUpdatedEvent
): void {
  let entity = new BAppMetadataURIUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.bAppAddress = event.params.bApp;
  entity.metadataURI = event.params.metadataURI;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let bApp = BApp.load(event.params.bApp);
  if (!bApp) {
    log.error(
      `New BApp Event, BApp address ${event.params.bApp.toHexString()} does not exist on the database, and it can't be created`,
      []
    );
  } else {
    bApp.metadataURI = event.params.metadataURI;
    bApp.save();
  }
}

export function handleBAppOptedInByStrategy(
  event: BAppOptedInByStrategyEvent
): void {
  let entity = new BAppOptedInByStrategy(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.strategyId = event.params.strategyId;
  entity.bApp = event.params.bApp;
  entity.data = event.params.data;
  entity.tokens = changetype<Bytes[]>(event.params.tokens);
  entity.obligationPercentages = event.params.obligationPercentages;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  // Generating the many-to-many entity that serves as the mapping table
  let strategyBAppOptInId = event.params.strategyId
    .toString()
    .concat(event.params.bApp.toHexString());
  let strategyBAppOptIn = StrategyBAppOptIn.load(strategyBAppOptInId);
  if (!strategyBAppOptIn) {
    strategyBAppOptIn = new StrategyBAppOptIn(strategyBAppOptInId);
    log.info(
      `New StrategyBAppOptIn created ${strategyBAppOptInId} as Strategy ${
        event.params.strategyId
      } has opted in to BApp ${event.params.bApp.toHexString()}`,
      []
    );
  }
  // Generating the list of obligation IDs (the actual objects are created via separate event)
  let obligationsList: string[] = [];
  for (var i = 0; i < event.params.tokens.length; i++) {
    let token = event.params.tokens[i];
    let obligationId = strategyBAppOptInId.concat(token.toHexString());
    obligationsList.push(obligationId);
  }
  strategyBAppOptIn.bApp = event.params.bApp;
  strategyBAppOptIn.strategy = event.params.strategyId.toString();
  strategyBAppOptIn.save();

  let strategyId = event.params.strategyId.toString();
  for (let i = 0; i < event.params.tokens.length; i++){

    let token = event.params.tokens[i];
    let percentage = event.params.obligationPercentages[i];
    let obligationId = strategyBAppOptInId.concat(token.toHexString());
    let obligation = Obligation.load(obligationId);
    if (!obligation) {
      log.info(
        `New Obligation created ${obligationId} as Strategy ${strategyId} has opted in to BApp ${event.params.bApp.toHexString()}`,
        []
      );
      obligation = new Obligation(obligationId);
      obligation.percentageProposedTimestamp = BigInt.zero();
      obligation.obligatedBalance = BigInt.zero();
    }
  
    const strategyTokenBalanceId = strategyId.concat(token.toHexString());
    let strategyTokenBalance = StrategyTokenBalance.load(strategyTokenBalanceId);
    if (!strategyTokenBalance) {
      log.info(
        `Trying to update the balance for token ${token.toHexString()} on Strategy ${strategyId}, but the StrategyTokenBalance entity does not exist, creating it.`,
        []
      );
      strategyTokenBalance = new StrategyTokenBalance(strategyTokenBalanceId);
      strategyTokenBalance.strategy = strategyId;
      strategyTokenBalance.token = token;
      strategyTokenBalance.balance = BigInt.zero();
      strategyTokenBalance.riskValue = BigInt.zero();
    }
    // update the risk value for this token by adding the % of this obligation
    strategyTokenBalance.riskValue =
      strategyTokenBalance.riskValue.plus(percentage);
    strategyTokenBalance.save();
  
    let obligatedBalance = strategyTokenBalance.balance.times(percentage);
  
    let bAppToken = BAppToken.load(
      event.params.bApp.toHexString().concat(token.toHexString())
    );
    if (!bAppToken) {
      log.error(
        `Trying to update the total balance obligated to BApp ${event.params.bApp.toHexString()} but the related token entity does not exist, and it can't be created`,
        []
      );
      return;
    }
    // new obligation created, add new obligated balance
    bAppToken.totalObligatedBalance =
      bAppToken.totalObligatedBalance.plus(obligatedBalance);
    bAppToken.save();
  
    // update obligated balance, along other things
    obligation.obligatedBalance = obligatedBalance;
    obligation.strategyBAppOptIn = strategyBAppOptInId;
    obligation.token = token;
    obligation.percentage = percentage;
    obligation.percentageProposed = percentage;
    obligation.save();
  }
}

export function handleBAppRegistered(event: BAppRegisteredEvent): void {
  let entity = new BAppRegistered(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.bAppAddress = event.params.bApp;
  entity.tokens = changetype<Bytes[]>(event.params.tokens);
  entity.sharedRiskLevel = event.params.sharedRiskLevel;
  entity.metadataURI = event.params.metadataURI;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let bApp = BApp.load(event.params.bApp);
  if (!bApp) {
    bApp = new BApp(event.params.bApp);
    log.info(
      `New BApp Event, BApp address ${event.params.bApp.toHexString()} does not exist on the database, creating a new entity`,
      []
    );
  }

  bApp.metadataURI = event.params.metadataURI;
  for (var i = 0; i < event.params.tokens.length; i++) {
    let token = event.params.tokens[i];
    let sharedRiskLevelValue = event.params.sharedRiskLevel[i];
    let sharedRiskLevelId = bApp.id.toHexString().concat(token.toHexString());
    let bAppToken = BAppToken.load(sharedRiskLevelId);
    if (!bAppToken) {
      log.info(
        `New BAppToken created ${sharedRiskLevelId} as BApp ${event.params.bApp.toHexString()} is created, and supports token ${token.toHexString()}`,
        []
      );
      bAppToken = new BAppToken(sharedRiskLevelId);
      bAppToken.totalObligatedBalance = BigInt.zero();
    }
    bAppToken.token = token;
    bAppToken.sharedRiskLevel = sharedRiskLevelValue;
    bAppToken.bApp = bApp.id;
    bAppToken.save();
  }
  bApp.save();

  let bAppConstants = BAppConstants.load(event.address);
  if (!bAppConstants) {
    log.error(
      "Trying to adjust total Accounts, but constant entry does not exist, and cannot be created",
      []
    );
    bAppConstants = new BAppConstants(event.address);
    bAppConstants._feeExpireTime = BigInt.fromI32(1);
    bAppConstants._feeTimelockPeriod = BigInt.fromI32(7);
    bAppConstants._obligationExpireTime = BigInt.fromI32(3);
    bAppConstants._obligationTimelockPeriod = BigInt.fromI32(14);
    bAppConstants._strategyMaxFeeIncrement = BigInt.fromI32(500);
    bAppConstants._strategyMaxShares = BigInt.fromI32(10000);
    bAppConstants._withdrawalExpireTime = BigInt.fromI32(3);
    bAppConstants._withdrawalTimelockPeriod = BigInt.fromI32(14);
    bAppConstants.totalAccounts = BigInt.zero();
    bAppConstants.totalBApps = BigInt.zero();
    bAppConstants.totalStrategies = BigInt.zero();
  }
  bAppConstants.totalBApps = bAppConstants.totalBApps.plus(BigInt.fromI32(1));
  bAppConstants.save();
}

export function handleBAppTokensUpdated(event: BAppTokensUpdatedEvent): void {
  let entity = new BAppTokensUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.bAppAddress = event.params.bApp;
  entity.tokens = changetype<Bytes[]>(
    event.params.tokenConfigs.map<Address>((tokenConfig) => tokenConfig.token)
  );
  entity.sharedRiskLevels = event.params.tokenConfigs.map<BigInt>(
    (tokenConfig) => tokenConfig.sharedRiskLevel
  );

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let newTokensAddresses = new Set<Bytes>();

  for (var i = 0; i < event.params.tokenConfigs.length; i++) {
    let token = event.params.tokenConfigs[i].token;
    newTokensAddresses.add(token);
    let sharedRiskLevelValue = event.params.tokenConfigs[i].sharedRiskLevel;
    let bAppTokenId = event.params.bApp
      .toHexString()
      .concat(token.toHexString());
    let bAppToken = BAppToken.load(bAppTokenId);
    if (!bAppToken) {
      log.info(
        `New BAppToken created ${bAppTokenId} as new token ${token.toHexString()} is supported by BApp ${event.params.bApp.toHexString()}`,
        []
      );
      bAppToken = new BAppToken(bAppTokenId);
      bAppToken.totalObligatedBalance = BigInt.zero();
    }
    bAppToken.bApp = event.params.bApp;
    bAppToken.token = token;
    bAppToken.sharedRiskLevel = sharedRiskLevelValue;
    bAppToken.save();
  }

  let bApp = BApp.load(event.params.bApp);
  if (!bApp) {
    log.error(
      `Trying to adjust the list of tokens accepted by BApp ${event.params.bApp}, but the enitity does not exist`,
      []
    );
    return;
  }
  
  // // remove the representation of the token (and risk) for this bapp, no longer needed.
  let bAppTokens = bApp.bAppTokens.load();
  if (!bAppTokens) {
    log.info(
      `Trying to adjust the list of tokens accepted by BApp ${event.params.bApp}, but the list is empty`,
      []
    );
    return;
  }

  for (var j = 0; j < bAppTokens.length; j++) {
    let bappToken = bAppTokens[j];
    if (!newTokensAddresses.has(bappToken.token)) {
      store.remove(
        "BAppToken",
        event.params.bApp.toHexString().concat(bappToken.token.toHexString())
      );
    }
  }
}

export function handleDelegationCreated(event: DelegationCreatedEvent): void {
  let entity = new DelegationCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.delegator = event.params.delegator;
  entity.receiver = event.params.receiver;
  entity.percentage = event.params.percentage;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let newAccountsCount = 0;
  let delegator = Account.load(event.params.delegator);
  if (!delegator) {
    log.info(
      `Trying to create new Delegation but delegator account ${event.params.delegator.toHexString()} does not exist, creating it`,
      []
    );
    delegator = new Account(event.params.delegator);
    delegator.nonce = BigInt.zero();
    delegator.validatorCount = BigInt.zero();
    delegator.feeRecipient = event.params.delegator;
    delegator.totalDelegatedPercentage = BigInt.zero();
    newAccountsCount += 1;
  }
  delegator.totalDelegatedPercentage = delegator.totalDelegatedPercentage.plus(
    event.params.percentage
  );
  delegator.save();

  let receiver = Account.load(event.params.receiver);
  if (!receiver) {
    log.info(
      `Trying to create new Delegation but receiver account ${event.params.delegator.toHexString()} does not exist, creating it`,
      []
    );
    receiver = new Account(event.params.receiver);
    receiver.nonce = BigInt.zero();
    receiver.validatorCount = BigInt.zero();
    receiver.feeRecipient = event.params.receiver;
    receiver.totalDelegatedPercentage = BigInt.zero();
    receiver.save();
    newAccountsCount += 1;
  }

  let bAppConstants = BAppConstants.load(event.address);
  if (!bAppConstants) {
    log.error(
      "Trying to adjust total Accounts, but constant entry does not exist, and cannot be created",
      []
    );
    bAppConstants = new BAppConstants(event.address);
    bAppConstants._feeExpireTime = BigInt.fromI32(1);
    bAppConstants._feeTimelockPeriod = BigInt.fromI32(7);
    bAppConstants._obligationExpireTime = BigInt.fromI32(3);
    bAppConstants._obligationTimelockPeriod = BigInt.fromI32(14);
    bAppConstants._strategyMaxFeeIncrement = BigInt.fromI32(500);
    bAppConstants._strategyMaxShares = BigInt.fromI32(10000);
    bAppConstants._withdrawalExpireTime = BigInt.fromI32(3);
    bAppConstants._withdrawalTimelockPeriod = BigInt.fromI32(14);
    bAppConstants.totalAccounts = BigInt.zero();
    bAppConstants.totalBApps = BigInt.zero();
    bAppConstants.totalStrategies = BigInt.zero();
  }
  bAppConstants.totalAccounts = bAppConstants.totalAccounts.plus(
    BigInt.fromI32(newAccountsCount)
  );
  bAppConstants.save();

  let delegationId = event.params.delegator
    .toHexString()
    .concat(event.params.receiver.toHexString());
  let delegation = Delegation.load(delegationId);
  if (!delegation) {
    log.info(
      `New Delegation created ${delegationId} as account ${event.params.delegator.toHexString()} is delegating ${
        event.params.percentage
      } of their validator balance to ${event.params.receiver.toHexString()}`,
      []
    );
    delegation = new Delegation(delegationId);
  }
  delegation.delegator = delegator.id;
  delegation.receiver = receiver.id;
  delegation.percentage = event.params.percentage;
  delegation.save();
}

export function handleDelegationRemoved(event: DelegationRemovedEvent): void {
  let entity = new DelegationRemoved(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.delegator = event.params.delegator;
  entity.receiver = event.params.receiver;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let delegator = Account.load(event.params.delegator);
  if (!delegator) {
    log.error(
      `Trying to remove Delegation but delegator account ${event.params.delegator.toHexString()} does not exist, and cannot be created`,
      []
    );
    return;
  }
  let existingPercentage = delegator.totalDelegatedPercentage;
  delegator.totalDelegatedPercentage =
    delegator.totalDelegatedPercentage.minus(existingPercentage);
  delegator.save();

  let receiver = Account.load(event.params.receiver);
  if (!receiver) {
    log.info(
      `Trying to remove Delegation but receiver account ${event.params.delegator.toHexString()} does not exist, and cannot be created`,
      []
    );
    return;
  }
  receiver.nonce = BigInt.zero();
  receiver.validatorCount = BigInt.zero();
  receiver.feeRecipient = event.params.receiver;
  receiver.save();

  let delegationId = event.params.delegator
    .toHexString()
    .concat(event.params.receiver.toHexString());
  let delegation = Delegation.load(delegationId);
  if (!delegation) {
    log.error(
      `Trying to remove delegated balance from Delegation ${delegationId}, but it does not exist and cannot be created`,
      []
    );
  } else {
    delegation.delegator = delegator.id;
    delegation.receiver = receiver.id;
    delegation.percentage = BigInt.zero();
    delegation.save();
  }
}

export function handleDelegationUpdated(event: DelegationUpdatedEvent): void {
  let entity = new DelegationUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.delegator = event.params.delegator;
  entity.receiver = event.params.receiver;
  entity.percentage = event.params.percentage;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let delegator = Account.load(event.params.delegator);
  if (!delegator) {
    log.error(
      `Trying to update Delegation but delegator account ${event.params.delegator.toHexString()} does not exist, and cannot be created`,
      []
    );
    return;
  }
  let existingPercentage = delegator.totalDelegatedPercentage;
  delegator.totalDelegatedPercentage = delegator.totalDelegatedPercentage
    .minus(existingPercentage)
    .plus(event.params.percentage);
  delegator.save();

  let receiver = Account.load(event.params.receiver);
  if (!receiver) {
    log.info(
      `Trying to update Delegation but receiver account ${event.params.receiver.toHexString()} does not exist, and cannot be created`,
      []
    );
    return;
  }

  let delegationId = event.params.delegator
    .toHexString()
    .concat(event.params.receiver.toHexString());
  let delegation = Delegation.load(delegationId);
  if (!delegation) {
    log.error(
      `Trying to update delegated balance from Delegation ${delegationId}, but it does not exist and cannot be created`,
      []
    );
  } else {
    delegation.delegator = delegator.id;
    delegation.receiver = receiver.id;
    delegation.percentage = event.params.percentage;
    delegation.save();
  }
}

export function handleInitialized(event: InitializedEvent): void {
  let entity = new Initialized(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.version = event.params.version;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleMaxFeeIncrementSet(event: MaxFeeIncrementSetEvent): void {
  let entity = new MaxFeeIncrementSet(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.newMaxFeeIncrement = event.params.newMaxFeeIncrement;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleObligationCreated(event: ObligationCreatedEvent): void {
  let entity = new ObligationCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.strategyId = event.params.strategyId;
  entity.bApp = event.params.bApp;
  entity.token = event.params.token;
  entity.obligationPercentage = event.params.percentage;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  // Creating the Obligation itself
  let strategyId = event.params.strategyId.toString();
  let token = event.params.token;
  let percentage = event.params.percentage;
  let strategyBAppOptInId = strategyId
    .toString()
    .concat(event.params.bApp.toHexString());
  let obligationId = strategyBAppOptInId.concat(token.toHexString());
  let obligation = Obligation.load(obligationId);
  if (!obligation) {
    log.info(
      `New Obligation created ${obligationId} as Strategy ${strategyId} has opted in to BApp ${event.params.bApp.toHexString()}`,
      []
    );
    obligation = new Obligation(obligationId);
    obligation.percentageProposedTimestamp = BigInt.zero();
    obligation.obligatedBalance = BigInt.zero();
  }

  const strategyTokenBalanceId = strategyId.concat(token.toHexString());
  let strategyTokenBalance = StrategyTokenBalance.load(strategyTokenBalanceId);
  if (!strategyTokenBalance) {
    log.info(
      `Trying to update the balance for token ${token.toHexString()} on Strategy ${strategyId}, but the StrategyTokenBalance entity does not exist, creating it.`,
      []
    );
    strategyTokenBalance = new StrategyTokenBalance(strategyTokenBalanceId);
    strategyTokenBalance.strategy = strategyId;
    strategyTokenBalance.token = token;
    strategyTokenBalance.balance = BigInt.zero();
    strategyTokenBalance.riskValue = BigInt.zero();
  }
  // update the risk value for this token by adding the % of this obligation
  strategyTokenBalance.riskValue =
    strategyTokenBalance.riskValue.plus(percentage);
  strategyTokenBalance.save();

  let obligatedBalance = strategyTokenBalance.balance.times(percentage);

  let bAppToken = BAppToken.load(
    event.params.bApp.toHexString().concat(token.toHexString())
  );
  if (!bAppToken) {
    log.error(
      `Trying to update the total balance obligated to BApp ${event.params.bApp.toHexString()} but the related token entity does not exist, and it can't be created`,
      []
    );
    return;
  }
  // new obligation created, add new obligated balance
  bAppToken.totalObligatedBalance =
    bAppToken.totalObligatedBalance.plus(obligatedBalance);
  bAppToken.save();

  // update obligated balance, along other things
  obligation.obligatedBalance = obligatedBalance;
  obligation.strategyBAppOptIn = strategyBAppOptInId;
  obligation.token = token;
  obligation.percentage = percentage;
  obligation.percentageProposed = percentage;
  obligation.save();
}

export function handleObligationUpdateProposed(
  event: ObligationUpdateProposedEvent
): void {
  let entity = new ObligationUpdateProposed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.strategyId = event.params.strategyId;
  entity.bApp = event.params.bApp;
  entity.token = event.params.token;
  entity.percentage = event.params.percentage;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let token = event.params.token;
  let strategyBAppOptInId = event.params.strategyId
    .toString()
    .concat(event.params.bApp.toHexString());
  let obligationId = strategyBAppOptInId.concat(token.toHexString());
  let obligation = Obligation.load(obligationId);
  if (!obligation) {
    log.error(
      `Obligation ${obligationId} is being updated but it does not exist, and it can't be created`,
      []
    );
    return;
  }
  obligation.token = token;
  obligation.percentageProposed = event.params.percentage;
  obligation.percentageProposedTimestamp = event.block.timestamp;
  obligation.percentage = obligation.percentageProposed;
  obligation.save();
}

export function handleObligationUpdated(event: ObligationUpdatedEvent): void {
  let entity = new ObligationUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.strategyId = event.params.strategyId;
  entity.bApp = event.params.bApp;
  entity.token = event.params.token;
  entity.percentage = event.params.percentage;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let strategyId = event.params.strategyId.toString();
  let percentage = event.params.percentage;
  let token = event.params.token;

  // need to copy the percentage from `percentageProposed`
  let strategyBAppOptInId = event.params.strategyId
    .toString()
    .concat(event.params.bApp.toHexString());
  let obligationId = strategyBAppOptInId.concat(token.toHexString());
  let obligation = Obligation.load(obligationId);
  if (!obligation) {
    log.error(
      `Obligation ${obligationId} is being updated but it does not exist, and it can't be created`,
      []
    );
    return;
  }

  let strategyTokenBalance = StrategyTokenBalance.load(
    strategyId.concat(token.toHexString())
  );
  if (!strategyTokenBalance) {
    log.error(
      `Transaction ${event.transaction.hash.toHexString()} is updating Obligation. Trying to update the balance for token ${token.toHexString()} on Strategy ${strategyId}, but the balance does not exist, and it cannot be created.`,
      []
    );
    return;
  }
  // update the risk value for this token by adding the % of this obligation
  strategyTokenBalance.riskValue =
    strategyTokenBalance.riskValue.plus(percentage);
  strategyTokenBalance.save();

  let obligatedBalance = strategyTokenBalance.balance.times(percentage);

  let bAppToken = BAppToken.load(
    event.params.bApp.toHexString().concat(token.toHexString())
  );
  if (!bAppToken) {
    log.error(
      `Trying to update the total balance obligated to BApp ${event.params.bApp.toHexString()} but the BAppToken entity does not exist, and it can't be created`,
      []
    );
    return;
  }
  // subtract old obligated balance, add new obligated balance
  bAppToken.totalObligatedBalance = bAppToken.totalObligatedBalance
    .minus(obligation.obligatedBalance)
    .plus(obligatedBalance);
  bAppToken.save();

  // update obligated balance, along other things
  // no need to do .minus().plus() since the token balance in the strategy has not changed
  // and the event has the new percentage, so it's just an overwrite
  obligation.obligatedBalance = obligatedBalance;
  obligation.token = token;
  obligation.percentage = percentage;
  obligation.percentageProposed = percentage;
  obligation.save();
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.previousOwner = event.params.previousOwner;
  entity.newOwner = event.params.newOwner;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleSlashingFundWithdrawn(
  event: SlashingFundWithdrawnEvent
): void {
  let entity = new SlashingFundWithdrawn(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.token = event.params.token;
  entity.amount = event.params.amount;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleStrategyCreated(event: StrategyCreatedEvent): void {
  let entity = new StrategyCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.strategyId = event.params.strategyId;
  entity.owner = event.params.owner;
  entity.fee = event.params.fee;
  entity.metadataURI = event.params.metadataURI;
  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let newAccountsCount = 0;
  let owner = Account.load(event.params.owner);
  if (!owner) {
    log.info(
      `Trying to create new Strategy but owner account ${event.params.owner.toHexString()} does not exist, creating it`,
      []
    );
    owner = new Account(event.params.owner);
    owner.nonce = BigInt.zero();
    owner.validatorCount = BigInt.zero();
    owner.feeRecipient = event.params.owner;
    owner.totalDelegatedPercentage = BigInt.zero();
    newAccountsCount += 1;
  }
  owner.save();

  let strategyId = event.params.strategyId.toString();
  let strategy = Strategy.load(strategyId);
  if (!strategy) {
    log.info(`New Strategy created ${strategyId}`, []);
    strategy = new Strategy(strategyId);
  }
  strategy.owner = event.params.owner;
  strategy.strategyId = event.params.strategyId;
  strategy.fee = event.params.fee;
  strategy.metadataURI = event.params.metadataURI;
  strategy.feeProposed = event.params.fee;
  strategy.feeProposedTimestamp = event.block.timestamp;
  strategy.save();

  let bAppConstants = BAppConstants.load(event.address);
  if (!bAppConstants) {
    log.error(
      "Trying to adjust total Accounts, but constant entry does not exist, and cannot be created",
      []
    );
    bAppConstants = new BAppConstants(event.address);
    bAppConstants._feeExpireTime = BigInt.fromI32(1);
    bAppConstants._feeTimelockPeriod = BigInt.fromI32(7);
    bAppConstants._obligationExpireTime = BigInt.fromI32(3);
    bAppConstants._obligationTimelockPeriod = BigInt.fromI32(14);
    bAppConstants._strategyMaxFeeIncrement = BigInt.fromI32(500);
    bAppConstants._strategyMaxShares = BigInt.fromI32(10000);
    bAppConstants._withdrawalExpireTime = BigInt.fromI32(3);
    bAppConstants._withdrawalTimelockPeriod = BigInt.fromI32(14);
    bAppConstants.totalAccounts = BigInt.zero();
    bAppConstants.totalBApps = BigInt.zero();
    bAppConstants.totalStrategies = BigInt.zero();
  }
  bAppConstants.totalAccounts = bAppConstants.totalAccounts.plus(
    BigInt.fromI32(newAccountsCount)
  );
  bAppConstants.totalStrategies = bAppConstants.totalStrategies.plus(
    BigInt.fromI32(1)
  );
  bAppConstants.save();
}

export function handleStrategyDeposit(event: StrategyDepositEvent): void {
  let entity = new StrategyDeposit(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.strategyId = event.params.strategyId;
  entity.contributor = event.params.account;
  entity.token = event.params.token;
  entity.amount = event.params.amount;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let newAccountsCount = 0;
  let contributor = Account.load(event.params.account);
  if (!contributor) {
    log.info(
      `Trying to create new StrategyUserBalance but owner account ${event.params.account.toHexString()} does not exist, creating it`,
      []
    );
    contributor = new Account(event.params.account);
    contributor.nonce = BigInt.zero();
    contributor.validatorCount = BigInt.zero();
    contributor.feeRecipient = event.params.account;
    contributor.totalDelegatedPercentage = BigInt.zero();
    newAccountsCount += 1;
  }
  contributor.save();

  let bAppConstants = BAppConstants.load(event.address);
  if (!bAppConstants) {
    log.error(
      "Trying to adjust total Accounts, but constant entry does not exist, and cannot be created",
      []
    );
    bAppConstants = new BAppConstants(event.address);
    bAppConstants._feeExpireTime = BigInt.fromI32(1);
    bAppConstants._feeTimelockPeriod = BigInt.fromI32(7);
    bAppConstants._obligationExpireTime = BigInt.fromI32(3);
    bAppConstants._obligationTimelockPeriod = BigInt.fromI32(14);
    bAppConstants._strategyMaxFeeIncrement = BigInt.fromI32(500);
    bAppConstants._strategyMaxShares = BigInt.fromI32(10000);
    bAppConstants._withdrawalExpireTime = BigInt.fromI32(3);
    bAppConstants._withdrawalTimelockPeriod = BigInt.fromI32(14);
    bAppConstants.totalAccounts = BigInt.zero();
    bAppConstants.totalBApps = BigInt.zero();
    bAppConstants.totalStrategies = BigInt.zero();
  }
  bAppConstants.totalAccounts = bAppConstants.totalAccounts.plus(
    BigInt.fromI32(newAccountsCount)
  );
  bAppConstants.save();

  let strategy = Strategy.load(event.params.strategyId.toString());
  if (!strategy) {
    log.error(
      `Trying to create StrategyUserBalance but receiving Strategy ${event.params.strategyId} does not exist, and cannot be created`,
      []
    );
    return;
  }

  let token = event.params.token;
  let strategyUserBalanceId = strategy.id.concat(
    contributor.id.toHexString().concat(token.toHexString())
  );
  let strategyUserBalance = StrategyUserBalance.load(strategyUserBalanceId);
  if (!strategyUserBalance) {
    log.info(
      `Strategy ${
        strategy.id
      } is receiving a deposit of token ${token.toHexString()} by address ${contributor.id.toHexString()}, but the StrategyUserBalance entity does not exist, creating it`,
      []
    );
    strategyUserBalance = new StrategyUserBalance(strategyUserBalanceId);
    strategyUserBalance.depositAmount = BigInt.zero();
    strategyUserBalance.contributor = contributor.id;
    strategyUserBalance.strategy = strategy.id;
    strategyUserBalance.token = token;
    strategyUserBalance.proposedWithdrawal = BigInt.zero();
    strategyUserBalance.proposedWithdrawalTimestamp = BigInt.zero();
  }
  strategyUserBalance.depositAmount = strategyUserBalance.depositAmount.plus(
    event.params.amount
  );
  strategyUserBalance.save();

  let strategyBAppOptIns = strategy.bApps.load();

  let strategyTokenBalanceId = strategy.id.concat(token.toHexString());
  let strategyTokenBalance = StrategyTokenBalance.load(strategyTokenBalanceId);
  if (!strategyTokenBalance) {
    log.info(
      `Strategy ${
        strategy.id
      } is receiving a deposit of token ${token.toHexString()} by address ${contributor.id.toHexString()}, but the StrategyTokenBalance entity does not exist, creating it`,
      []
    );
    strategyTokenBalance = new StrategyTokenBalance(strategyTokenBalanceId);
    strategyTokenBalance.strategy = strategy.id;
    strategyTokenBalance.token = token;
    strategyTokenBalance.balance = BigInt.zero();
    strategyTokenBalance.riskValue = BigInt.zero();
  }
  strategyTokenBalance.balance = strategyTokenBalance.balance.plus(
    event.params.amount
  );
  strategyTokenBalance.save();

  for (var i = 0; i < strategyBAppOptIns.length; i++) {
    let strategyBAppOptIn = strategyBAppOptIns[i];
    let obligations = strategyBAppOptIn.obligations.load();

    let obligatedBalanceDelta = BigInt.zero();
    for (let j = 0; j < obligations.length; j++) {
      let obligation = obligations[j];
      if (obligation.token == token) {
        obligatedBalanceDelta = event.params.amount.times(
          obligation.percentage
        );
        obligation.obligatedBalance = obligation.obligatedBalance.plus(
          obligatedBalanceDelta
        );
        obligation.save();
      }
    }

    let bAppToken = BAppToken.load(
      strategyBAppOptIn.bApp.toHexString().concat(token.toHexString())
    );
    if (!bAppToken) {
      log.info(
        `Strategy ${
          strategy.id
        } is receiving a deposit of token ${token.toHexString()} by address ${contributor.id.toHexString()}. Trying to update the total balance obligated to BApp ${strategyBAppOptIn.bApp.toHexString()} but the BAppToken entity ${strategyBAppOptIn.bApp
          .toHexString()
          .concat(
            token.toHexString()
          )} does not exist. Likely means this token is not accepted by the BApp, so skipping it`,
        []
      );
      return;
    }
    let oldValue = bAppToken.totalObligatedBalance;
    let newValue = oldValue.plus(obligatedBalanceDelta);
    log.info(
      `updating the BAppToken entity ${strategyBAppOptIn.bApp
        .toHexString()
        .concat(
          token.toHexString()
        )}. Old value: ${oldValue}, new value: ${newValue}`,
      []
    );
    bAppToken.totalObligatedBalance = bAppToken.totalObligatedBalance.plus(
      obligatedBalanceDelta
    );
    bAppToken.save();
  }
}

export function handleStrategyFeeUpdateProposed(
  event: StrategyFeeUpdateProposedEvent
): void {
  let entity = new StrategyFeeUpdateProposed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.strategyId = event.params.strategyId;
  entity.owner = event.params.owner;
  entity.proposedFee = event.params.proposedFee;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let strategyId = event.params.strategyId.toString();
  let strategy = Strategy.load(strategyId);
  if (!strategy) {
    log.error(
      `Strategy ${strategyId} is being updated but it does not exist, and it can't be created`,
      []
    );
    return;
  }
  strategy.feeProposed = event.params.proposedFee;
  strategy.feeProposedTimestamp = event.block.timestamp;
  strategy.save();
}

export function handleStrategyFeeUpdated(event: StrategyFeeUpdatedEvent): void {
  let entity = new StrategyFeeUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.strategyId = event.params.strategyId;
  entity.owner = event.params.owner;
  entity.fee = event.params.newFee;
  entity.isFast = event.params.isFast;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let strategyId = event.params.strategyId.toString();
  let strategy = Strategy.load(strategyId);
  if (!strategy) {
    log.error(
      `Strategy ${strategyId} is being updated but it does not exist, and it can't be created`,
      []
    );
    return;
  }
  strategy.fee = event.params.newFee;
  strategy.feeProposed = event.params.newFee;
  strategy.feeProposedTimestamp = BigInt.zero();
  strategy.save();
}

export function handleStrategySlashed(event: StrategySlashedEvent): void {
  let entity = new StrategySlashed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.strategyId = event.params.strategyId;
  entity.percentage = event.params.percentage;
  entity.bAppAddress = event.params.bApp;
  entity.token = event.params.token;
  entity.receiver = event.params.receiver;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let strategy = Strategy.load(event.params.strategyId.toString());
  if (!strategy) {
    log.error(
      `Trying to withdraw from StrategyUserBalance but receiving Strategy ${event.params.strategyId} does not exist, and cannot be created`,
      []
    );
    return;
  }

  let token = event.params.token;

  let strategyBAppOptIns = strategy.bApps.load();

  let strategyTokenBalanceId = strategy.id.concat(token.toHexString());
  let strategyTokenBalance = StrategyTokenBalance.load(strategyTokenBalanceId);
  if (!strategyTokenBalance) {
    log.error(
      `Strategy ${strategy.id} is being slashed of ${
        event.params.percentage
      } % of token ${token.toHexString()} by BApp ${
        event.params.bApp
      }, but the StrategyTokenBalance entity does not exist, and can't be created`,
      []
    );
    return;
  }
  const slashedStrategyTokenBalance = event.params.percentage.times(
    strategyTokenBalance.balance
  );
  strategyTokenBalance.balance = strategyTokenBalance.balance.minus(
    slashedStrategyTokenBalance
  );
  strategyTokenBalance.save();

  // Iterate through all the BApps this strategy has opted in
  for (var i = 0; i < strategyBAppOptIns.length; i++) {
    let strategyBAppOptIn = strategyBAppOptIns[i];
    // find all of its obligations
    let obligations = strategyBAppOptIn.obligations.load();

    for (let j = 0; j < obligations.length; j++) {
      let obligation = obligations[j];
      // find the obligations that use the same token
      if (obligation.token == token) {
        // update the obligated balance by keeping the same %, but using the new token balance for this strategy
        obligation.obligatedBalance = strategyTokenBalance.balance.times(
          obligation.percentage
        );
        obligation.save();
      }
    }

    let bAppToken = BAppToken.load(
      strategyBAppOptIn.bApp.toHexString().concat(token.toHexString())
    );
    if (!bAppToken) {
      log.info(
        `Strategy ${strategy.id} is being slashed of ${
          event.params.percentage
        } tokens ${token.toHexString()} by BApp ${
          event.params.bApp
        }. Trying to update the total balance obligated to BApp ${strategyBAppOptIn.bApp.toHexString()} but the BAppToken entity ${strategyBAppOptIn.bApp
          .toHexString()
          .concat(
            token.toHexString()
          )} does not exist. Likely means this token is not accepted by the BApp, so skipping it`,
        []
      );
      return;
    }
    let oldValue = bAppToken.totalObligatedBalance;
    let newValue = oldValue.minus(slashedStrategyTokenBalance);
    log.info(
      `updating the BAppToken entity ${strategyBAppOptIn.bApp
        .toHexString()
        .concat(
          token.toHexString()
        )}. Old value: ${oldValue}, new value: ${newValue}`,
      []
    );
    bAppToken.totalObligatedBalance = bAppToken.totalObligatedBalance.minus(
      slashedStrategyTokenBalance
    );
    bAppToken.save();
  }
}

export function handleStrategyWithdrawal(event: StrategyWithdrawalEvent): void {
  let entity = new StrategyWithdrawal(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.strategyId = event.params.strategyId;
  entity.contributor = event.params.account;
  entity.token = event.params.token;
  entity.amount = event.params.amount;
  entity.isFast = event.params.isFast;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let contributor = Account.load(event.params.account);
  if (!contributor) {
    log.error(
      `Trying to withdraw from StrategyUserBalance but contributor Account ${event.params.account.toHexString()} does not exist, and cannot be created`,
      []
    );
    return;
  }

  let strategy = Strategy.load(event.params.strategyId.toString());
  if (!strategy) {
    log.error(
      `Trying to withdraw from StrategyUserBalance but receiving Strategy ${event.params.strategyId} does not exist, and cannot be created`,
      []
    );
    return;
  }

  let token = event.params.token;
  let strategyUserBalanceId = strategy.id.concat(
    contributor.id.toHexString().concat(token.toHexString())
  );
  let strategyUserBalance = StrategyUserBalance.load(strategyUserBalanceId);
  if (!strategyUserBalance) {
    log.error(
      `Strategy ${
        strategy.id
      } is being withdrawn of token ${token.toHexString()} by address ${contributor.id.toHexString()}, but the entity does not exist, and it can't be created`,
      []
    );
    return;
  }
  strategyUserBalance.contributor = contributor.id;
  strategyUserBalance.strategy = strategy.id;
  strategyUserBalance.token = token;
  strategyUserBalance.depositAmount.minus(event.params.amount);
  strategyUserBalance.proposedWithdrawal = BigInt.zero();
  strategyUserBalance.proposedWithdrawalTimestamp = BigInt.zero();
  strategyUserBalance.save();

  let strategyTokenBalanceId = strategy.id.concat(token.toHexString());
  let strategyTokenBalance = StrategyTokenBalance.load(strategyTokenBalanceId);
  if (!strategyTokenBalance) {
    log.error(
      `Strategy ${
        strategy.id
      } is receiving withdrawn of token ${token.toHexString()} by address ${contributor.id.toHexString()}, but the entity does not exist, and it can't be created`,
      []
    );
    return;
  }
  strategyTokenBalance.balance = strategyTokenBalance.balance.minus(
    event.params.amount
  );
  strategyTokenBalance.save();

  let strategyBAppOptIns = strategy.bApps.load();

  for (var i = 0; i < strategyBAppOptIns.length; i++) {
    let strategyBAppOptIn = strategyBAppOptIns[i];
    let obligations = strategyBAppOptIn.obligations.load();

    let obligatedBalanceDelta = BigInt.zero();
    for (let j = 0; j < obligations.length; j++) {
      let obligation = obligations[j];
      if (obligation.token == token) {
        obligatedBalanceDelta = event.params.amount.times(
          obligation.percentage
        );
        obligation.obligatedBalance = obligation.obligatedBalance.minus(
          obligatedBalanceDelta
        );
        obligation.save();
      }
    }

    let bAppToken = BAppToken.load(
      strategyBAppOptIn.bApp.toHexString().concat(token.toHexString())
    );
    if (!bAppToken) {
      log.info(
        `Strategy ${
          strategy.id
        } is being withdrawn of token ${token.toHexString()} by address ${contributor.id.toHexString()}. Trying to update the total balance obligated to BApp ${strategyBAppOptIn.bApp.toHexString()} but the related token entity  ${strategyBAppOptIn.bApp
          .toHexString()
          .concat(
            token.toHexString()
          )} does not exist. Likely means this token is not accepted by the BApp, so skipping it`,
        []
      );
      return;
    }
    bAppToken.totalObligatedBalance.minus(obligatedBalanceDelta);
    bAppToken.save();
  }
}

export function handleStrategyWithdrawalProposed(
  event: StrategyWithdrawalProposedEvent
): void {
  let entity = new StrategyWithdrawalProposed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.strategyId = event.params.strategyId;
  entity.account = event.params.account;
  entity.token = event.params.token;
  entity.amount = event.params.amount;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let contributor = Account.load(event.params.account);
  if (!contributor) {
    log.error(
      `Strategy ${event.params.strategyId} is being withdrawn of token ${
        event.params.token
      } but contributor Account ${event.params.account.toHexString()} does not exist, and cannot be created`,
      []
    );
    return;
  }

  let strategy = Strategy.load(event.params.strategyId.toString());
  if (!strategy) {
    log.error(
      `Trying to withdraw from Strategy but receiving Strategy ${event.params.strategyId} does not exist, and cannot be created`,
      []
    );
    return;
  }

  let token = event.params.token;
  let strategyTokenBalanceId = strategy.id.concat(
    contributor.id.toHexString().concat(token.toHexString())
  );
  let strategyTokenBalance = StrategyUserBalance.load(strategyTokenBalanceId);
  if (!strategyTokenBalance) {
    log.error(
      `Strategy ${
        strategy.id
      } is being withdrawn of token ${token.toHexString()} by address ${contributor.id.toHexString()}, but the StrategyUserBalance ${strategyTokenBalanceId} does not exist, and it can't be created`,
      []
    );
    return;
  }
  strategyTokenBalance.contributor = contributor.id;
  strategyTokenBalance.strategy = strategy.id;
  strategyTokenBalance.token = token;
  strategyTokenBalance.proposedWithdrawal = event.params.amount;
  strategyTokenBalance.proposedWithdrawalTimestamp = event.block.timestamp;
  strategyTokenBalance.save();
}

export function handleAccountMetadataURIUpdated(
  event: AccountMetadataURIUpdatedEvent
): void {
  let entity = new AccountMetadataURIUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.account = event.params.account;
  entity.metadataURI = event.params.metadataURI;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let account = Account.load(event.params.account);
  if (!account) {
    log.error(
      `New account Event, Account address ${event.params.account.toHexString()} does not exist on the database, and it can't be created`,
      []
    );
  } else {
    account.metadataURI = event.params.metadataURI;
    account.save();
  }
}

export function handlStrategyMetadataURIUpdated(
  event: StrategyMetadataURIUpdatedEvent
): void {
  let entity = new StrategyMetadataURIUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.strategyId = event.params.strategyId;
  entity.metadataURI = event.params.metadataURI;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let strategy = Strategy.load(event.params.strategyId.toString());
  if (!strategy) {
    log.error(
      `New Strategy Event, Strategy ID ${event.params.strategyId} does not exist on the database, and it can't be created`,
      []
    );
  } else {
    strategy.metadataURI = event.params.metadataURI;
    strategy.save();
  }
}
