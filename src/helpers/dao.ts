import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import { DAOValues } from "../../generated/schema";
import { stampDAOUpdate } from "./metadata";

export const ETH_FEE_ASSET = "ETH";
export const SSV_FEE_ASSET = "SSV";

export function createDefaultDAOValues(
  address: Address,
  blockNumber: BigInt,
  blockTimestamp: BigInt,
  transactionHash: Bytes,
): DAOValues {
  let dao = new DAOValues(address);

  dao.networkFee = BigInt.zero();
  dao.networkFeeIndex = BigInt.zero();
  dao.networkFeeIndexBlockNumber = BigInt.zero();
  dao.liquidationThreshold = BigInt.zero();
  dao.minimumLiquidationCollateral = BigInt.zero();
  dao.networkFeeSSV = BigInt.zero();
  dao.networkFeeIndexSSV = BigInt.zero();
  dao.networkFeeIndexBlockNumberSSV = BigInt.zero();
  dao.liquidationThresholdSSV = BigInt.fromI32(214800);
  dao.minimumLiquidationCollateralSSV = BigInt.fromString("1000000000000000000");
  dao.operatorFeeIncreaseLimit = BigInt.zero();
  dao.declareOperatorFeePeriod = BigInt.zero();
  dao.executeOperatorFeePeriod = BigInt.zero();
  dao.operatorMaximumFee = BigInt.zero();
  dao.operatorMaximumFeeSSV = BigInt.zero();
  dao.validatorsPerOperatorLimit = BigInt.fromI32(3000);
  dao.accEthPerShare = BigInt.zero();
  dao.newFeesWei = BigInt.zero();
  dao.quorum = 0;
  dao.version = "v1.2.0";
  dao.latestMerkleRoot = Bytes.empty();
  dao.totalAccounts = BigInt.zero();
  dao.totalOperators = BigInt.zero();
  dao.totalValidators = BigInt.zero();
  dao.totalEffectiveBalance = BigInt.zero();
  dao.effectiveBalanceETH = BigInt.zero();
  dao.validatorsAdded = BigInt.zero();
  dao.validatorsRemoved = BigInt.zero();
  dao.operatorsAdded = BigInt.zero();
  dao.operatorsRemoved = BigInt.zero();
  stampDAOUpdate(dao, blockNumber, blockTimestamp, transactionHash);

  return dao;
}

export function usesEthFeeRegime(dao: DAOValues): bool {
  return compareSemver(dao.version, "v2.0.0") >= 0;
}

export function getInitialClusterFeeAsset(dao: DAOValues): string {
  return usesEthFeeRegime(dao) ? ETH_FEE_ASSET : SSV_FEE_ASSET;
}

export function legacyDaoFeeEventTargetsPrimaryFields(dao: DAOValues): bool {
  // After v2.0.0, the legacy event names still map to the primary fee fields.
  return usesEthFeeRegime(dao);
}

function compareSemver(version1: string, version2: string): number {
  const components1 = version1.split(".");
  const components2 = version2.split(".");

  const major1 = parseInt(components1[0].replace("v", ""));
  const major2 = parseInt(components2[0].replace("v", ""));
  const minor1 = parseInt(components1[0]);
  const minor2 = parseInt(components2[0]);
  const patch1 = parseInt(components1[0]);
  const patch2 = parseInt(components2[0]);

  if (major1 > major2) return 1;
  if (major1 < major2) return -1;
  if (minor1 > minor2) return 1;
  if (minor1 < minor2) return -1;
  if (patch1 > patch2) return 1;
  if (patch1 < patch2) return -1;
  return 0;
}
