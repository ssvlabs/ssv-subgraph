import { log } from "@graphprotocol/graph-ts";
import {
  ERC20Rescued as ERC20RescuedEvent,
  FeesSynced as FeesSyncedEvent,
  NetworkEarningsWithdrawn as NetworkEarningsWithdrawnEvent,
  RewardsClaimed as RewardsClaimedEvent,
  RewardsSettled as RewardsSettledEvent,
  Staked as StakedEvent,
  UnstakeRequested as UnstakeRequestedEvent,
  UnstakedWithdrawn as UnstakedWithdrawnEvent,
} from "../../generated/SSVNetwork/SSVNetwork";
import {
  DAOValues,
  ERC20Rescued,
  FeesSynced,
  NetworkEarningsWithdrawn,
  RewardsClaimed,
  RewardsSettled,
  Staked,
  UnstakeRequested,
  UnstakedWithdrawn,
} from "../../generated/schema";
import {
  loadOrCreateAccount,
  loadRequiredStakingAccount,
} from "../helpers/account";
import { buildEventEntityId } from "../helpers/ids";
import { stampDAOUpdate } from "../helpers/metadata";

export function handleERC20RescuedImplementation(
  event: ERC20RescuedEvent,
): void {
  let entity = new ERC20Rescued(
    buildEventEntityId(event.transaction.hash, event.logIndex),
  );
  entity.token = event.params.token;
  entity.to = event.params.to;
  entity.amount = event.params.amount;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleFeesSyncedImplementation(
  event: FeesSyncedEvent,
): void {
  log.info(
    `New feesWei: ${event.params.newFeesWei}, accEthPerShare: ${event.params.accEthPerShare}`,
    [],
  );

  let entity = new FeesSynced(
    buildEventEntityId(event.transaction.hash, event.logIndex),
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
      `New DAO Event, DAO values store with ID ${event.address.toHexString()} does not exist on the database and cannot be created. Update type: QUORUM_UPDATED`,
      [],
    );
    return;
  }

  dao.updateType = "FEES_SYNCED";
  dao.accEthPerShare = event.params.accEthPerShare;
  dao.newFeesWei = event.params.newFeesWei;
  stampDAOUpdate(dao, event.block.number, event.block.timestamp, event.transaction.hash);

  log.info(
    `Dao Values update type: ${dao.updateType}, new ETH per share: ${dao.accEthPerShare}, new fees wei: ${dao.newFeesWei}`,
    [],
  );
  dao.save();
}

export function handleNetworkEarningsWithdrawnImplementation(
  event: NetworkEarningsWithdrawnEvent,
): void {
  let entity = new NetworkEarningsWithdrawn(
    buildEventEntityId(event.transaction.hash, event.logIndex),
  );
  entity.value = event.params.value;
  entity.recipient = event.params.recipient;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleRewardsClaimedImplementation(
  event: RewardsClaimedEvent,
): void {
  let entity = new RewardsClaimed(
    buildEventEntityId(event.transaction.hash, event.logIndex),
  );
  entity.user = event.params.user;
  entity.amount = event.params.amount;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleRewardsSettledImplementation(
  event: RewardsSettledEvent,
): void {
  let entity = new RewardsSettled(
    buildEventEntityId(event.transaction.hash, event.logIndex),
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

export function handleStakedImplementation(event: StakedEvent): void {
  let entity = new Staked(
    buildEventEntityId(event.transaction.hash, event.logIndex),
  );
  entity.user = event.params.user;
  entity.amount = event.params.amount;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let user = loadOrCreateAccount(event.params.user);
  user.stakedAmount = user.stakedAmount.plus(event.params.amount);
  user.save();
}

export function handleUnstakeRequestedImplementation(
  event: UnstakeRequestedEvent,
): void {
  let entity = new UnstakeRequested(
    buildEventEntityId(event.transaction.hash, event.logIndex),
  );
  entity.user = event.params.user;
  entity.amount = event.params.amount;
  entity.unlockTime = event.params.unlockTime;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let user = loadRequiredStakingAccount(event.params.user, "Unstake requested");
  if (!user) {
    return;
  }
  user.unstakePendingAmount = user.unstakePendingAmount.plus(
    event.params.amount,
  );
  user.stakedAmount = user.stakedAmount.minus(event.params.amount);
  user.save();
}

export function handleUnstakedWithdrawnImplementation(
  event: UnstakedWithdrawnEvent,
): void {
  let entity = new UnstakedWithdrawn(
    buildEventEntityId(event.transaction.hash, event.logIndex),
  );
  entity.user = event.params.user;
  entity.amount = event.params.amount;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let user = loadRequiredStakingAccount(event.params.user, "Unstake withdrawn");
  if (!user) {
    return;
  }
  user.unstakePendingAmount = user.unstakePendingAmount.minus(
    event.params.amount,
  );
  user.save();
}
