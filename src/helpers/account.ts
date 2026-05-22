import { Address, BigInt, log } from "@graphprotocol/graph-ts";
import { Account, DAOValues } from "../../generated/schema";

const DEFAULT_BALANCE = BigInt.fromI32(32);

export function createDefaultAccount(address: Address): Account {
  let account = new Account(address);

  account.nonce = BigInt.zero();
  account.validatorCount = BigInt.zero();
  account.feeRecipient = address;
  account.stakedAmount = BigInt.zero();
  account.unstakePendingAmount = BigInt.zero();
  account.effectiveBalance = BigInt.zero();

  return account;
}

export function loadOrCreateAccount(address: Address): Account {
  let account = Account.load(address);
  if (!account) {
    account = createDefaultAccount(address);
  }

  return account;
}

export function loadOrCreateValidatorOwnerAccount(
  ownerAddress: Address,
  dao: DAOValues,
): Account {
  let owner = Account.load(ownerAddress);
  if (!owner) {
    owner = createDefaultAccount(ownerAddress);
    log.info(
      `New Address ${owner.id.toHexString()} is adding a validator, creating new Account`,
      [],
    );
    dao.totalAccounts = dao.totalAccounts.plus(BigInt.fromI32(1));
  }

  return owner;
}

export function loadRequiredClusterOwnerAccount(
  ownerAddress: Address,
): Account | null {
  let owner = Account.load(ownerAddress);
  if (!owner) {
    log.error(
      `Trying to update cluster or validator owner account ${ownerAddress.toHexString()}, but it does not exist on the database`,
      [],
    );
    return null;
  }

  return owner;
}

export function loadRequiredOperatorOwnerAccount(
  ownerAddress: Address,
  operatorId: BigInt,
  action: string,
): Account | null {
  let owner = Account.load(ownerAddress);
  if (!owner) {
    log.error(
      `${action} for Operator ${operatorId}, but Owner ${ownerAddress.toHexString()} did not exist on the database`,
      [],
    );
    return null;
  }

  return owner;
}

export function loadRequiredStakingAccount(
  userAddress: Address,
  action: string,
): Account | null {
  let user = Account.load(userAddress);
  if (!user) {
    log.error(
      `${action} for User ${userAddress.toHexString()}, but the account does not exist on the database`,
      [],
    );
    return null;
  }

  return user;
}

export function applyOwnerValidatorAdded(owner: Account): void {
  log.info(`Old nonce of Account ${owner.id.toHexString()}: ${owner.nonce}`, []);
  owner.nonce = owner.nonce.plus(BigInt.fromI32(1));
  log.info(
    `Increased nonce of Account ${owner.id.toHexString()} to ${owner.nonce}`,
    [],
  );
  owner.validatorCount = owner.validatorCount.plus(BigInt.fromI32(1));
  owner.effectiveBalance = owner.effectiveBalance.plus(DEFAULT_BALANCE);
}

export function applyOwnerValidatorRemoved(owner: Account): void {
  owner.validatorCount = owner.validatorCount.minus(BigInt.fromI32(1));
  owner.effectiveBalance = owner.effectiveBalance.minus(DEFAULT_BALANCE);
}
