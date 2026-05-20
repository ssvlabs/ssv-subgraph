import { BigInt, log } from "@graphprotocol/graph-ts";
import { Account, Cluster } from "../../generated/schema";
import { ETH_FEE_ASSET } from "./dao";

export function assignClusterMembership(
  cluster: Cluster,
  owner: Account,
  operatorIds: BigInt[],
  validatorCount: BigInt,
): void {
  cluster.owner = owner.id;
  cluster.operatorIds = operatorIds;
  cluster.validatorCount = validatorCount;
}

export function assignClusterSnapshot(
  cluster: Cluster,
  networkFeeIndex: BigInt,
  index: BigInt,
  active: boolean,
  balance: BigInt,
): void {
  cluster.networkFeeIndex = networkFeeIndex;
  cluster.index = index;
  cluster.active = active;
  cluster.balance = balance;
}

export function clusterUsesEthFees(cluster: Cluster): bool {
  return cluster.feeAsset == ETH_FEE_ASSET;
}

export function loadRequiredLifecycleCluster(
  clusterId: string,
  action: string,
): Cluster | null {
  let cluster = Cluster.load(clusterId);
  if (!cluster) {
    log.error(
      `Cluster ${clusterId} is being ${action}, but it does not exist on the database`,
      [],
    );
    return null;
  }

  return cluster;
}
