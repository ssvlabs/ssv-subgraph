import {
  ClusterDeposited as ClusterDepositedEvent,
  ClusterBalanceUpdated as ClusterBalanceUpdatedEvent,
  ClusterLiquidated as ClusterLiquidatedEvent,
  ClusterMigratedToETH as ClusterMigratedToETHEvent,
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
  OperatorMultipleWhitelistRemoved as OperatorMultipleWhitelistRemovedEvent,
  OperatorMultipleWhitelistUpdated as OperatorMultipleWhitelistUpdatedEvent,
  OperatorPrivacyStatusUpdated as OperatorPrivacyStatusUpdatedEvent,
  OperatorRemoved as OperatorRemovedEvent,
  OperatorWhitelistingContractUpdated as OperatorWhitelistingContractUpdatedEvent,
  OperatorWhitelistUpdated as OperatorWhitelistUpdatedEvent,
  OperatorWithdrawn as OperatorWithdrawnEvent,
  OperatorWithdrawnSSV as OperatorWithdrawnSSVEvent,
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
import { handleFeeRecipientAddressUpdatedImplementation } from "./handlers/account";
import {
  handleClusterBalanceUpdatedImplementation,
  handleClusterDepositedImplementation,
  handleClusterLiquidatedImplementation,
  handleClusterMigratedToETHImplementation,
  handleClusterReactivatedImplementation,
  handleClusterWithdrawnImplementation,
  handleValidatorAddedImplementation,
  handleValidatorRemovedImplementation,
} from "./handlers/cluster-validator";
import {
  handleDeclareOperatorFeePeriodUpdatedImplementation,
  handleExecuteOperatorFeePeriodUpdatedImplementation,
  handleLiquidationThresholdPeriodSSVUpdatedImplementation,
  handleLiquidationThresholdPeriodUpdatedImplementation,
  handleMinimumLiquidationCollateralSSVUpdatedImplementation,
  handleMinimumLiquidationCollateralUpdatedImplementation,
  handleNetworkFeeUpdatedImplementation,
  handleNetworkFeeUpdatedSSVImplementation,
  handleOperatorFeeIncreaseLimitUpdatedImplementation,
  handleOperatorMaximumFeeUpdatedImplementation,
  handleQuorumUpdatedImplementation,
  handleSSVNetworkUpgradeBlockImplementation,
} from "./handlers/dao-governance";
import {
  handleOperatorAddedImplementation,
  handleOperatorFeeDeclarationCancelledImplementation,
  handleOperatorFeeDeclaredImplementation,
  handleOperatorFeeExecutedImplementation,
  handleOperatorMultipleWhitelistRemovedImplementation,
  handleOperatorMultipleWhitelistUpdatedImplementation,
  handleOperatorPrivacyStatusUpdatedImplementation,
  handleOperatorRemovedImplementation,
  handleOperatorWhitelistUpdatedImplementation,
  handleOperatorWhitelistingContractUpdatedImplementation,
  handleOperatorWithdrawnImplementation,
  handleOperatorWithdrawnSSVImplementation,
} from "./handlers/operator";
import {
  handleOracleReplacedImplementation,
  handleRootCommittedImplementation,
  handleWeightedRootProposedImplementation,
} from "./handlers/oracle-root";
import {
  handleERC20RescuedImplementation,
  handleFeesSyncedImplementation,
  handleNetworkEarningsWithdrawnImplementation,
  handleRewardsClaimedImplementation,
  handleRewardsSettledImplementation,
  handleStakedImplementation,
  handleUnstakeRequestedImplementation,
  handleUnstakedWithdrawnImplementation,
} from "./handlers/staking";

// DAO and governance events

export function handleDeclareOperatorFeePeriodUpdated(
  event: DeclareOperatorFeePeriodUpdatedEvent,
): void {
  handleDeclareOperatorFeePeriodUpdatedImplementation(event);
}

export function handleExecuteOperatorFeePeriodUpdated(
  event: ExecuteOperatorFeePeriodUpdatedEvent,
): void {
  handleExecuteOperatorFeePeriodUpdatedImplementation(event);
}

export function handleLiquidationThresholdPeriodUpdated(
  event: LiquidationThresholdPeriodUpdatedEvent,
): void {
  handleLiquidationThresholdPeriodUpdatedImplementation(event);
}

export function handleLiquidationThresholdPeriodSSVUpdated(
  event: LiquidationThresholdPeriodSSVUpdatedEvent,
): void {
  handleLiquidationThresholdPeriodSSVUpdatedImplementation(event);
}

export function handleMinimumLiquidationCollateralUpdated(
  event: MinimumLiquidationCollateralUpdatedEvent,
): void {
  handleMinimumLiquidationCollateralUpdatedImplementation(event);
}

export function handleMinimumLiquidationCollateralSSVUpdated(
  event: MinimumLiquidationCollateralSSVUpdatedEvent,
): void {
  handleMinimumLiquidationCollateralSSVUpdatedImplementation(event);
}

export function handleNetworkFeeUpdated(event: NetworkFeeUpdatedEvent): void {
  handleNetworkFeeUpdatedImplementation(event);
}

export function handleNetworkFeeUpdatedSSV(
  event: NetworkFeeUpdatedEvent,
): void {
  handleNetworkFeeUpdatedSSVImplementation(event);
}

export function handleOperatorFeeIncreaseLimitUpdated(
  event: OperatorFeeIncreaseLimitUpdatedEvent,
): void {
  handleOperatorFeeIncreaseLimitUpdatedImplementation(event);
}

export function handleOperatorMaximumFeeUpdated(
  event: OperatorMaximumFeeUpdatedEvent,
): void {
  handleOperatorMaximumFeeUpdatedImplementation(event);
}

export function handleQuorumUpdated(event: QuorumUpdatedEvent): void {
  handleQuorumUpdatedImplementation(event);
}

export function handleSSVNetworkUpgradeBlock(
  event: SSVNetworkUpgradeBlockEvent,
): void {
  handleSSVNetworkUpgradeBlockImplementation(event);
}

// Account events

export function handleFeeRecipientAddressUpdated(
  event: FeeRecipientAddressUpdatedEvent,
): void {
  handleFeeRecipientAddressUpdatedImplementation(event);
}

// Cluster and validator events

export function handleClusterBalanceUpdated(
  event: ClusterBalanceUpdatedEvent,
): void {
  handleClusterBalanceUpdatedImplementation(event);
}

export function handleClusterMigratedToETH(
  event: ClusterMigratedToETHEvent,
): void {
  handleClusterMigratedToETHImplementation(event);
}

export function handleClusterDeposited(event: ClusterDepositedEvent): void {
  handleClusterDepositedImplementation(event);
}

export function handleClusterLiquidated(event: ClusterLiquidatedEvent): void {
  handleClusterLiquidatedImplementation(event);
}

export function handleClusterReactivated(event: ClusterReactivatedEvent): void {
  handleClusterReactivatedImplementation(event);
}

export function handleClusterWithdrawn(event: ClusterWithdrawnEvent): void {
  handleClusterWithdrawnImplementation(event);
}

export function handleValidatorAdded(event: ValidatorAddedEvent): void {
  handleValidatorAddedImplementation(event);
}

export function handleValidatorRemoved(event: ValidatorRemovedEvent): void {
  handleValidatorRemovedImplementation(event);
}

// Operator events

export function handleOperatorAdded(event: OperatorAddedEvent): void {
  handleOperatorAddedImplementation(event);
}

export function handleOperatorFeeDeclarationCancelled(
  event: OperatorFeeDeclarationCancelledEvent,
): void {
  handleOperatorFeeDeclarationCancelledImplementation(event);
}

export function handleOperatorFeeDeclared(
  event: OperatorFeeDeclaredEvent,
): void {
  handleOperatorFeeDeclaredImplementation(event);
}

export function handleOperatorFeeExecuted(
  event: OperatorFeeExecutedEvent,
): void {
  handleOperatorFeeExecutedImplementation(event);
}

export function handleOperatorRemoved(event: OperatorRemovedEvent): void {
  handleOperatorRemovedImplementation(event);
}

export function handleOperatorWhitelistUpdated(
  event: OperatorWhitelistUpdatedEvent,
): void {
  handleOperatorWhitelistUpdatedImplementation(event);
}

export function handleOperatorMultipleWhitelistUpdated(
  event: OperatorMultipleWhitelistUpdatedEvent,
): void {
  handleOperatorMultipleWhitelistUpdatedImplementation(event);
}

export function handleOperatorMultipleWhitelistRemoved(
  event: OperatorMultipleWhitelistRemovedEvent,
): void {
  handleOperatorMultipleWhitelistRemovedImplementation(event);
}

export function handleOperatorWhitelistingContractUpdated(
  event: OperatorWhitelistingContractUpdatedEvent,
): void {
  handleOperatorWhitelistingContractUpdatedImplementation(event);
}

export function handleOperatorPrivacyStatusUpdated(
  event: OperatorPrivacyStatusUpdatedEvent,
): void {
  handleOperatorPrivacyStatusUpdatedImplementation(event);
}

export function handleOperatorWithdrawn(event: OperatorWithdrawnEvent): void {
  handleOperatorWithdrawnImplementation(event);
}

export function handleOperatorWithdrawnSSV(
  event: OperatorWithdrawnSSVEvent,
): void {
  handleOperatorWithdrawnSSVImplementation(event);
}

// Staking and rewards events

export function handleERC20Rescued(event: ERC20RescuedEvent): void {
  handleERC20RescuedImplementation(event);
}

export function handleFeesSynced(event: FeesSyncedEvent): void {
  handleFeesSyncedImplementation(event);
}

export function handleNetworkEarningsWithdrawn(
  event: NetworkEarningsWithdrawnEvent,
): void {
  handleNetworkEarningsWithdrawnImplementation(event);
}

export function handleRewardsClaimed(event: RewardsClaimedEvent): void {
  handleRewardsClaimedImplementation(event);
}

export function handleRewardsSettled(event: RewardsSettledEvent): void {
  handleRewardsSettledImplementation(event);
}

export function handleStaked(event: StakedEvent): void {
  handleStakedImplementation(event);
}

export function handleUnstakeRequested(event: UnstakeRequestedEvent): void {
  handleUnstakeRequestedImplementation(event);
}

export function handleUnstakedWithdrawn(event: UnstakedWithdrawnEvent): void {
  handleUnstakedWithdrawnImplementation(event);
}

// Oracle and root events

export function handleRootCommitted(event: RootCommittedEvent): void {
  handleRootCommittedImplementation(event);
}

export function handleOracleReplaced(event: OracleReplacedEvent): void {
  handleOracleReplacedImplementation(event);
}

export function handleWeightedRootProposed(
  event: WeightedRootProposedEvent,
): void {
  handleWeightedRootProposedImplementation(event);
}
