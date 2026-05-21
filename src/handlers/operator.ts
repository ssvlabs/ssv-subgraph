import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import {
  OperatorAdded as OperatorAddedEvent,
  OperatorFeeDeclarationCancelled as OperatorFeeDeclarationCancelledEvent,
  OperatorFeeDeclared as OperatorFeeDeclaredEvent,
  OperatorFeeExecuted as OperatorFeeExecutedEvent,
  OperatorMultipleWhitelistRemoved as OperatorMultipleWhitelistRemovedEvent,
  OperatorMultipleWhitelistUpdated as OperatorMultipleWhitelistUpdatedEvent,
  OperatorPrivacyStatusUpdated as OperatorPrivacyStatusUpdatedEvent,
  OperatorRemoved as OperatorRemovedEvent,
  OperatorWhitelistingContractUpdated as OperatorWhitelistingContractUpdatedEvent,
  OperatorWhitelistUpdated as OperatorWhitelistUpdatedEvent,
  OperatorWithdrawn as OperatorWithdrawnEvent,
  OperatorWithdrawnSSV as OperatorWithdrawnSSVEvent,
} from "../../generated/SSVNetwork/SSVNetwork";
import {
  Account,
  DAOValues,
  Operator,
  OperatorAdded,
  OperatorFeeDeclarationCancelled,
  OperatorFeeDeclared,
  OperatorFeeExecuted,
  OperatorMultipleWhitelistRemoved,
  OperatorMultipleWhitelistUpdated,
  OperatorPrivacyStatusUpdated,
  OperatorRemoved,
  OperatorWhitelistingContractUpdated,
  OperatorWhitelistUpdated,
  OperatorWithdrawn,
  OperatorWithdrawnSSV,
} from "../../generated/schema";
import {
  loadOrCreateAccount,
  loadRequiredOperatorOwnerAccount,
} from "../helpers/account";
import { createDefaultDAOValues, usesEthFeeRegime } from "../helpers/dao";
import { buildEventEntityId } from "../helpers/ids";
import { stampUpdate } from "../helpers/metadata";
import { loadLoopOperatorOrLog } from "../helpers/operator";

const SSV_STAKING_UPDATE_BLOCK_NUMBER = BigInt.fromI32(2442571);
const DEFAULT_OPERATOR_ETH_FEE = BigInt.fromI32(1_778_800_000);

export function handleOperatorAddedImplementation(
  event: OperatorAddedEvent,
): void {
  let entity = new OperatorAdded(
    buildEventEntityId(event.transaction.hash, event.logIndex),
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
      `New DAO Event, DAO values store with ID ${event.address.toHexString()} does not exist on the database and cannot be created. Update type: DECLARE_OPERATOR_FEE_PERIOD`,
      [],
    );

    dao = createDefaultDAOValues(
      event.address,
      event.block.number,
      event.block.timestamp,
      event.transaction.hash,
    );
  }
  dao.updateType = "OPERATOR_ADDED";
  dao.operatorsAdded = dao.operatorsAdded.plus(BigInt.fromI32(1));

  let owner = Account.load(event.params.owner);
  if (!owner) {
    owner = loadOrCreateAccount(event.params.owner);
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
    if (usesEthFeeRegime(dao)) {
      log.info(
        `Operator added event block number ${event.block.number.toString()} is after SSV staking update block number ${SSV_STAKING_UPDATE_BLOCK_NUMBER.toString()}, updating ETH operator fee`,
        [],
      );
      operator.fee = event.params.fee;
      operator.feeIndexBlockNumber = event.block.number;
      operator.feeSSV = BigInt.zero();
      operator.feeIndexBlockNumberSSV = BigInt.zero();
    } else {
      log.info(
        `Operator added event block number ${event.block.number.toString()} is after SSV staking update block number ${SSV_STAKING_UPDATE_BLOCK_NUMBER.toString()}, updating SSV network fee`,
        [],
      );
      // set the operator's fee to the default fee for ETH clusters, if the operator has declared a non-zero fee for SSV clusters
      operator.fee =
        event.params.fee == BigInt.zero()
          ? BigInt.zero()
          : DEFAULT_OPERATOR_ETH_FEE;
      operator.feeIndexBlockNumber = BigInt.zero();
      operator.feeSSV = event.params.fee;
      operator.feeIndexBlockNumberSSV = event.block.number;
    }
    operator.feeIndex = BigInt.zero();
    operator.declaredFee = BigInt.zero();
    operator.feeIndexSSV = BigInt.zero();
    operator.totalEffectiveBalance = BigInt.zero();
    operator.declaredSSVFee = BigInt.zero();
    operator.whitelisted = [];
    operator.isPrivate = false;
    operator.whitelistedContract = Address.fromString(
      "0x0000000000000000000000000000000000000000",
    );
    operator.totalWithdrawn = BigInt.zero();
    operator.totalWithdrawnSSV = BigInt.zero();
    operator.validatorCount = BigInt.zero();

    // if it's a new operator, also increase total counter
    dao.totalOperators = dao.totalOperators.plus(BigInt.fromI32(1));
  }

  stampUpdate(
    operator,
    event.block.number,
    event.block.timestamp,
    event.transaction.hash,
  );
  operator.save();

  log.info(
    `Dao Values update type: ${dao.updateType}, operator count: ${dao.totalOperators}`,
    [],
  );
  dao.save();
}

export function handleOperatorFeeDeclarationCancelledImplementation(
  event: OperatorFeeDeclarationCancelledEvent,
): void {
  let entity = new OperatorFeeDeclarationCancelled(
    buildEventEntityId(event.transaction.hash, event.logIndex),
  );
  entity.owner = event.params.owner;
  entity.operatorId = event.params.operatorId;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let owner = loadRequiredOperatorOwnerAccount(
    event.params.owner,
    event.params.operatorId,
    "Cancelling fee declaration",
  );
  if (!owner) {
    return;
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

    let dao = DAOValues.load(event.address);
    if (!dao) {
      log.error(
        `New DAO Event, DAO values store with ID ${event.address.toHexString()} does not exist on the database and cannot be created. Update type: OPERATOR_FEE_DECLARATION_CANCELLED`,
        [],
      );
      return;
    }
    if (usesEthFeeRegime(dao)) {
      operator.declaredFee = BigInt.zero();
    } else {
      operator.declaredSSVFee = BigInt.zero();
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

export function handleOperatorFeeDeclaredImplementation(
  event: OperatorFeeDeclaredEvent,
): void {
  let entity = new OperatorFeeDeclared(
    buildEventEntityId(event.transaction.hash, event.logIndex),
  );
  entity.owner = event.params.owner;
  entity.operatorId = event.params.operatorId;
  entity.blockNumber = event.params.blockNumber;
  entity.fee = event.params.fee;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let owner = loadRequiredOperatorOwnerAccount(
    event.params.owner,
    event.params.operatorId,
    "Declaring fees",
  );
  if (!owner) {
    return;
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

    let dao = DAOValues.load(event.address);
    if (!dao) {
      log.error(
        `New DAO Event, DAO values store with ID ${event.address.toHexString()} does not exist on the database and cannot be created. Update type: OPERATOR_FEE_DECLARED`,
        [],
      );
      return;
    }
    if (usesEthFeeRegime(dao)) {
      operator.declaredFee = event.params.fee;
    } else {
      operator.declaredSSVFee = event.params.fee;
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

export function handleOperatorFeeExecutedImplementation(
  event: OperatorFeeExecutedEvent,
): void {
  log.warning(
    "OperatorFeeExecuted event received. Transaction hash: {}, block number: {}, operatorId: {}, fee: {}",
    [
      event.transaction.hash.toHexString(),
      event.block.number.toString(),
      event.params.operatorId.toString(),
      event.params.fee.toString(),
    ],
  );
  let entity = new OperatorFeeExecuted(
    buildEventEntityId(event.transaction.hash, event.logIndex),
  );
  entity.owner = event.params.owner;
  entity.operatorId = event.params.operatorId;
  entity.blockNumber = event.params.blockNumber;
  entity.fee = event.params.fee;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let owner = loadRequiredOperatorOwnerAccount(
    event.params.owner,
    event.params.operatorId,
    "Executing fees change",
  );
  if (!owner) {
    return;
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
        `New DAO Event, DAO values store with ID ${event.address.toHexString()} does not exist on the database and cannot be created. Update type: DECLARE_OPERATOR_FEE_PERIOD`,
        [],
      );
      return;
    }
    operator.operatorId = event.params.operatorId;
    operator.owner = owner.id;
    if (usesEthFeeRegime(dao)) {
      log.info(
        `Operator fee executed event block number ${event.block.number.toString()} is after SSV staking update block number ${SSV_STAKING_UPDATE_BLOCK_NUMBER.toString()}, updating ETH operator fee`,
        [],
      );
      if (operator.feeIndexBlockNumber.notEqual(BigInt.zero())) {
        operator.feeIndex = operator.feeIndex.plus(
          event.block.number
            .minus(operator.feeIndexBlockNumber)
            .times(operator.fee),
        );
      }
      operator.feeIndexBlockNumber = event.block.number;
      operator.fee = event.params.fee;
      operator.declaredFee = BigInt.zero();
    } else {
      log.info(
        `Operator fee executed event block number ${event.block.number.toString()} is before SSV staking update block number ${SSV_STAKING_UPDATE_BLOCK_NUMBER.toString()}, updating SSV operator fee`,
        [],
      );
      operator.feeIndexSSV = operator.feeIndexSSV.plus(
        event.block.number
          .minus(operator.feeIndexBlockNumberSSV)
          .times(operator.feeSSV),
      );
      operator.feeIndexBlockNumberSSV = event.block.number;
      operator.feeSSV = event.params.fee;
      operator.declaredSSVFee = BigInt.zero();
      if (event.params.fee.equals(BigInt.zero())) {
        operator.fee = event.params.fee;
      }
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

export function handleOperatorRemovedImplementation(
  event: OperatorRemovedEvent,
): void {
  let entity = new OperatorRemoved(
    buildEventEntityId(event.transaction.hash, event.logIndex),
  );
  entity.operatorId = event.params.operatorId;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let dao = DAOValues.load(event.address);
  if (!dao) {
    log.error(
      `New DAO Event, DAO values store with ID ${event.address.toHexString()} does not exist on the database and cannot be created. Update type: DECLARE_OPERATOR_FEE_PERIOD`,
      [],
    );
    return;
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
    if (usesEthFeeRegime(dao)) {
      log.info(
        `Operator removed event block number ${event.block.number.toString()} is after SSV staking update block number ${SSV_STAKING_UPDATE_BLOCK_NUMBER.toString()}, updating ETH operator fee index and block number`,
        [],
      );
      operator.feeIndex = operator.feeIndex.plus(
        event.block.number
          .minus(operator.feeIndexBlockNumber)
          .times(operator.fee),
      );
      operator.feeIndexBlockNumber = event.block.number;
    }

    operator.fee = new BigInt(0);
    operator.declaredFee = BigInt.zero();
    operator.feeIndexSSV = operator.feeIndexSSV.plus(
      event.block.number
        .minus(operator.feeIndexBlockNumberSSV)
        .times(operator.feeSSV),
    );
    operator.feeIndexBlockNumberSSV = event.block.number;
    operator.feeSSV = new BigInt(0);
    operator.declaredSSVFee = BigInt.zero();

    operator.validatorCount = new BigInt(0);
    stampUpdate(
      operator,
      event.block.number,
      event.block.timestamp,
      event.transaction.hash,
    );
    operator.save();
  }

  log.info(
    `Dao Values update type: ${dao.updateType}, validator count: ${dao.totalOperators}`,
    [],
  );
  dao.save();
}

export function handleOperatorWhitelistUpdatedImplementation(
  event: OperatorWhitelistUpdatedEvent,
): void {
  let entity = new OperatorWhitelistUpdated(
    buildEventEntityId(event.transaction.hash, event.logIndex),
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
    whitelisted = loadOrCreateAccount(event.params.whitelisted);
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
    operator.operatorId = event.params.operatorId;
    if (
      event.params.whitelisted ==
      Address.fromString("0x0000000000000000000000000000000000000000")
    ) {
      operator.isPrivate = false;
      operator.whitelisted = [];
    } else if (whitelisted) {
      operator.isPrivate = true;
      operator.whitelisted = [whitelisted.id];
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

export function handleOperatorMultipleWhitelistUpdatedImplementation(
  event: OperatorMultipleWhitelistUpdatedEvent,
): void {
  let entity = new OperatorMultipleWhitelistUpdated(
    buildEventEntityId(event.transaction.hash, event.logIndex),
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
      whitelisted = loadOrCreateAccount(event.params.whitelistAddresses[i]);
      whitelisted.save();
    }
    whitelistIDList.push(whitelisted.id);
  }

  for (let j = 0; j < event.params.operatorIds.length; j++) {
    let operator = loadLoopOperatorOrLog(
      event.params.operatorIds[j],
      `Executing whitelist additions for Operator ${event.params.operatorIds[j]}, but it does not exist on the database`,
      "owner, publicKey and fee information",
    );
    if (!operator) {
      continue;
    }

    if (!operator.whitelisted) {
      operator.whitelisted = [];
    }
    operator.operatorId = event.params.operatorIds[j];
    operator.whitelisted = operator.whitelisted.concat(whitelistIDList);
    stampUpdate(
      operator,
      event.block.number,
      event.block.timestamp,
      event.transaction.hash,
    );
    operator.save();
  }
}

export function handleOperatorMultipleWhitelistRemovedImplementation(
  event: OperatorMultipleWhitelistRemovedEvent,
): void {
  let entity = new OperatorMultipleWhitelistRemoved(
    buildEventEntityId(event.transaction.hash, event.logIndex),
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
      whitelisted = loadOrCreateAccount(address);
      whitelisted.save();
    }
    whitelistAddressSet.push(whitelisted.id as Bytes);
  }

  for (let j = 0; j < event.params.operatorIds.length; j++) {
    let operator = loadLoopOperatorOrLog(
      event.params.operatorIds[j],
      `Executing whitelist removals for Operator ${event.params.operatorIds[j]}, but it does not exist on the database`,
      "owner, publicKey and fee information",
    );
    if (!operator) {
      continue;
    }

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
    stampUpdate(
      operator,
      event.block.number,
      event.block.timestamp,
      event.transaction.hash,
    );
    operator.save();
  }
}

export function handleOperatorWhitelistingContractUpdatedImplementation(
  event: OperatorWhitelistingContractUpdatedEvent,
): void {
  let entity = new OperatorWhitelistingContractUpdated(
    buildEventEntityId(event.transaction.hash, event.logIndex),
  );

  entity.operatorIds = event.params.operatorIds;
  entity.whitelistingContract = event.params.whitelistingContract;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
  for (var i = 0; i < event.params.operatorIds.length; i++) {
    let operator = loadLoopOperatorOrLog(
      event.params.operatorIds[i],
      `Executing whitelist contract updates for Operator ${event.params.operatorIds[i]}, but it does not exist on the database`,
      "owner, publicKey and fee information",
    );
    if (!operator) {
      continue;
    }

    if (!operator.whitelisted) {
      operator.whitelisted = [];
    }
    operator.operatorId = event.params.operatorIds[i];
    operator.whitelistedContract = event.params.whitelistingContract;
    stampUpdate(
      operator,
      event.block.number,
      event.block.timestamp,
      event.transaction.hash,
    );
    operator.save();
  }
}

export function handleOperatorPrivacyStatusUpdatedImplementation(
  event: OperatorPrivacyStatusUpdatedEvent,
): void {
  let entity = new OperatorPrivacyStatusUpdated(
    buildEventEntityId(event.transaction.hash, event.logIndex),
  );

  entity.operatorIds = event.params.operatorIds;
  entity.toPrivate = event.params.toPrivate;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  for (var i = 0; i < event.params.operatorIds.length; i++) {
    let operator = loadLoopOperatorOrLog(
      event.params.operatorIds[i],
      `Executing privacy status updates for Operator ${event.params.operatorIds[i]}, but it does not exist on the database`,
      "owner, publicKey and fee information",
    );
    if (!operator) {
      continue;
    }

    if (!operator.whitelisted) {
      operator.whitelisted = [];
    }
    operator.operatorId = event.params.operatorIds[i];
    operator.isPrivate = event.params.toPrivate;
    stampUpdate(
      operator,
      event.block.number,
      event.block.timestamp,
      event.transaction.hash,
    );
    operator.save();
  }
}

export function handleOperatorWithdrawnImplementation(
  event: OperatorWithdrawnEvent,
): void {
  let entity = new OperatorWithdrawn(
    buildEventEntityId(event.transaction.hash, event.logIndex),
  );
  entity.owner = event.params.owner;
  entity.operatorId = event.params.operatorId;
  entity.value = event.params.value;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let owner = loadRequiredOperatorOwnerAccount(
    event.params.owner,
    event.params.operatorId,
    "Executing fees change",
  );
  if (!owner) {
    return;
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

    let dao = DAOValues.load(event.address);
    if (!dao) {
      log.error(
        `New DAO Event, DAO values store with ID ${event.address.toHexString()} does not exist on the database and cannot be created. Update type: OPERATOR_WITHDRAWN`,
        [],
      );
      return;
    }
    if (usesEthFeeRegime(dao)) {
      operator.totalWithdrawn = operator.totalWithdrawn.plus(
        event.params.value,
      );
    } else {
      operator.totalWithdrawnSSV = operator.totalWithdrawnSSV.plus(
        event.params.value,
      );
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

export function handleOperatorWithdrawnSSVImplementation(
  event: OperatorWithdrawnSSVEvent,
): void {
  let entity = new OperatorWithdrawnSSV(
    buildEventEntityId(event.transaction.hash, event.logIndex),
  );
  entity.owner = event.params.owner;
  entity.operatorId = event.params.operatorId;
  entity.value = event.params.value;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let owner = loadRequiredOperatorOwnerAccount(
    event.params.owner,
    event.params.operatorId,
    "Executing fees change",
  );
  if (!owner) {
    return;
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
    operator.totalWithdrawnSSV = operator.totalWithdrawnSSV.plus(
      event.params.value,
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
