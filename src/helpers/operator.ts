import { BigInt, log } from "@graphprotocol/graph-ts";
import { Operator } from "../../generated/schema";

export function loadLoopOperatorOrLog(
  operatorId: BigInt,
  missingMessage: string,
  missingInformation: string,
): Operator | null {
  let operator = Operator.load(operatorId.toString());
  if (!operator) {
    log.error(missingMessage, []);
    log.error(
      `Could not create ${operatorId.toString()} on the database, because of missing ${missingInformation}`,
      [],
    );
    return null;
  }

  return operator;
}
