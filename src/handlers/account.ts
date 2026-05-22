import { log } from "@graphprotocol/graph-ts";
import { FeeRecipientAddressUpdated as FeeRecipientAddressUpdatedEvent } from "../../generated/SSVNetwork/SSVNetwork";
import { Account, FeeRecipientAddressUpdated } from "../../generated/schema";
import { buildEventEntityId } from "../helpers/ids";

export function handleFeeRecipientAddressUpdated(
  event: FeeRecipientAddressUpdatedEvent,
): void {
  let entity = new FeeRecipientAddressUpdated(
    buildEventEntityId(event.transaction.hash, event.logIndex),
  );
  entity.owner = event.params.owner;
  entity.recipientAddress = event.params.recipientAddress;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let owner = Account.load(event.params.owner);
  if (!owner) {
    log.error(
      `Attemping to update Account with address ${event.params.owner}, but it cannot be created at this time.`,
      [],
    );
    return;
  }
  owner.feeRecipient = event.params.recipientAddress;
  owner.save();
}
