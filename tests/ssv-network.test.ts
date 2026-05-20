import { assert, clearStore, describe, test } from "matchstick-as/assembly/index"
import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import {
  handleNetworkFeeUpdated,
  handleOperatorAdded,
  handleOperatorWhitelistUpdated,
  handleOperatorWhitelistingContractUpdated,
  handleSSVNetworkUpgradeBlock,
  handleValidatorAdded,
} from "../src/ssv-network"
import {
  createClusterSnapshot,
  createNetworkFeeUpdatedEvent,
  createOperatorAddedEvent,
  createOperatorWhitelistUpdatedEvent,
  createOperatorWhitelistingContractUpdatedEvent,
  createSSVNetworkUpgradeBlockEvent,
  createValidatorAddedEvent,
  setEventMetadata,
} from "./ssv-network-utils"

const NETWORK_ADDRESS = Address.fromString(
  "0x1000000000000000000000000000000000000001",
)
const OPERATOR_OWNER = Address.fromString(
  "0x2000000000000000000000000000000000000001",
)
const VALIDATOR_OWNER = Address.fromString(
  "0x3000000000000000000000000000000000000001",
)
const WHITELISTED_ADDRESS = Address.fromString(
  "0x4000000000000000000000000000000000000001",
)
const WHITELISTING_CONTRACT = Address.fromString(
  "0x5000000000000000000000000000000000000001",
)
const ZERO_ADDRESS = Address.fromString(
  "0x0000000000000000000000000000000000000000",
)

const OPERATOR_ONE_ID = BigInt.fromI32(1)
const OPERATOR_TWO_ID = BigInt.fromI32(2)
const OPERATOR_FEE = BigInt.fromI32(42)
const DEFAULT_OPERATOR_ETH_FEE = BigInt.fromI32(1778800000)
const THIRTY_TWO_ETH = BigInt.fromI32(32)
const CLUSTER_VUNITS = BigInt.fromI32(100000)
const NETWORK_FEE_OLD = BigInt.fromI32(10)
const NETWORK_FEE_NEW = BigInt.fromI32(15)

const OPERATOR_PUBLIC_KEY = Bytes.fromHexString("0x01020304") as Bytes
const SECOND_OPERATOR_PUBLIC_KEY = Bytes.fromHexString("0x01020305") as Bytes
const VALIDATOR_PUBLIC_KEY = Bytes.fromHexString("0x11121314") as Bytes
const VALIDATOR_SHARES = Bytes.fromHexString("0x22232425") as Bytes

function operatorAddedEventId(logIndex: string, txHash: string): string {
  return `${txHash}-${logIndex}`
}

function addOperator(
  operatorId: BigInt,
  publicKey: Bytes,
  logIndex: i32,
  txHash: string,
): void {
  let event = createOperatorAddedEvent(
    operatorId,
    OPERATOR_OWNER,
    publicKey,
    OPERATOR_FEE,
  )
  setEventMetadata(event, NETWORK_ADDRESS, 100 + logIndex, 1_000 + logIndex, logIndex, txHash)
  handleOperatorAdded(event)
}

describe("SSVNetwork mappings", () => {
  test("handleOperatorAdded bootstraps DAO, owner account, and legacy SSV operator fee state", () => {
    clearStore()

    let event = createOperatorAddedEvent(
      OPERATOR_ONE_ID,
      OPERATOR_OWNER,
      OPERATOR_PUBLIC_KEY,
      OPERATOR_FEE,
    )
    setEventMetadata(
      event,
      NETWORK_ADDRESS,
      101,
      1_001,
      7,
      "0x1111111111111111111111111111111111111111111111111111111111111111",
    )

    handleOperatorAdded(event)

    assert.entityCount("OperatorAdded", 1)
    assert.entityCount("DAOValues", 1)
    assert.entityCount("Account", 1)
    assert.entityCount("Operator", 1)

    assert.fieldEquals(
      "OperatorAdded",
      operatorAddedEventId(
        "00007",
        "0x1111111111111111111111111111111111111111111111111111111111111111",
      ),
      "operatorId",
      "1",
    )

    assert.fieldEquals("DAOValues", NETWORK_ADDRESS.toHexString(), "updateType", "OPERATOR_ADDED")
    assert.fieldEquals("DAOValues", NETWORK_ADDRESS.toHexString(), "totalAccounts", "1")
    assert.fieldEquals("DAOValues", NETWORK_ADDRESS.toHexString(), "totalOperators", "1")
    assert.fieldEquals("DAOValues", NETWORK_ADDRESS.toHexString(), "operatorsAdded", "1")
    assert.fieldEquals("DAOValues", NETWORK_ADDRESS.toHexString(), "version", "v1.2.0")

    assert.fieldEquals("Account", OPERATOR_OWNER.toHexString(), "feeRecipient", OPERATOR_OWNER.toHexString())
    assert.fieldEquals("Account", OPERATOR_OWNER.toHexString(), "validatorCount", "0")
    assert.fieldEquals("Account", OPERATOR_OWNER.toHexString(), "effectiveBalance", "0")

    assert.fieldEquals("Operator", "1", "owner", OPERATOR_OWNER.toHexString())
    assert.fieldEquals("Operator", "1", "fee", DEFAULT_OPERATOR_ETH_FEE.toString())
    assert.fieldEquals("Operator", "1", "feeSSV", OPERATOR_FEE.toString())
    assert.fieldEquals("Operator", "1", "feeIndexBlockNumber", "0")
    assert.fieldEquals("Operator", "1", "feeIndexBlockNumberSSV", "101")
    assert.fieldEquals("Operator", "1", "validatorCount", "0")

    clearStore()
  })

  test("handleValidatorAdded creates the validator owner account and cluster projection", () => {
    clearStore()

    addOperator(
      OPERATOR_ONE_ID,
      OPERATOR_PUBLIC_KEY,
      1,
      "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    )
    addOperator(
      OPERATOR_TWO_ID,
      SECOND_OPERATOR_PUBLIC_KEY,
      2,
      "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    )

    let event = createValidatorAddedEvent(
      VALIDATOR_OWNER,
      [OPERATOR_ONE_ID, OPERATOR_TWO_ID],
      VALIDATOR_PUBLIC_KEY,
      VALIDATOR_SHARES,
      createClusterSnapshot(
        BigInt.fromI32(1),
        BigInt.zero(),
        BigInt.fromI32(5),
        true,
        BigInt.fromI32(64),
      ),
    )
    setEventMetadata(
      event,
      NETWORK_ADDRESS,
      200,
      2_000,
      9,
      "0x2222222222222222222222222222222222222222222222222222222222222222",
    )

    handleValidatorAdded(event)

    let clusterId = `${VALIDATOR_OWNER.toHexString()}-1-2`

    assert.entityCount("ValidatorAdded", 1)
    assert.entityCount("Validator", 1)
    assert.entityCount("Cluster", 1)
    assert.entityCount("Account", 2)

    assert.fieldEquals(
      "ValidatorAdded",
      operatorAddedEventId(
        "00009",
        "0x2222222222222222222222222222222222222222222222222222222222222222",
      ),
      "cluster",
      clusterId,
    )

    assert.fieldEquals("DAOValues", NETWORK_ADDRESS.toHexString(), "updateType", "VALIDATOR_ADDED")
    assert.fieldEquals("DAOValues", NETWORK_ADDRESS.toHexString(), "totalAccounts", "2")
    assert.fieldEquals("DAOValues", NETWORK_ADDRESS.toHexString(), "totalValidators", "1")
    assert.fieldEquals("DAOValues", NETWORK_ADDRESS.toHexString(), "totalEffectiveBalance", "32")
    assert.fieldEquals("DAOValues", NETWORK_ADDRESS.toHexString(), "effectiveBalanceETH", "0")

    assert.fieldEquals("Account", VALIDATOR_OWNER.toHexString(), "nonce", "1")
    assert.fieldEquals("Account", VALIDATOR_OWNER.toHexString(), "validatorCount", "1")
    assert.fieldEquals("Account", VALIDATOR_OWNER.toHexString(), "effectiveBalance", THIRTY_TWO_ETH.toString())
    assert.fieldEquals("Account", VALIDATOR_OWNER.toHexString(), "feeRecipient", VALIDATOR_OWNER.toHexString())

    assert.fieldEquals("Cluster", clusterId, "owner", VALIDATOR_OWNER.toHexString())
    assert.fieldEquals("Cluster", clusterId, "validatorCount", "1")
    assert.fieldEquals("Cluster", clusterId, "effectiveBalance", THIRTY_TWO_ETH.toString())
    assert.fieldEquals("Cluster", clusterId, "vUnits", CLUSTER_VUNITS.toString())
    assert.fieldEquals("Cluster", clusterId, "feeAsset", "SSV")
    assert.fieldEquals("Cluster", clusterId, "index", "5")
    assert.fieldEquals("Cluster", clusterId, "balance", "64")

    assert.fieldEquals("Validator", VALIDATOR_PUBLIC_KEY.toHexString(), "owner", VALIDATOR_OWNER.toHexString())
    assert.fieldEquals("Validator", VALIDATOR_PUBLIC_KEY.toHexString(), "cluster", clusterId)
    assert.fieldEquals("Validator", VALIDATOR_PUBLIC_KEY.toHexString(), "removed", "false")

    assert.fieldEquals("Operator", "1", "validatorCount", "1")
    assert.fieldEquals("Operator", "2", "validatorCount", "1")

    clearStore()
  })

  test("upgrade and network fee update switch DAO fee writes to ETH fields", () => {
    clearStore()

    addOperator(
      OPERATOR_ONE_ID,
      OPERATOR_PUBLIC_KEY,
      1,
      "0xcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc",
    )

    let upgradeEvent = createSSVNetworkUpgradeBlockEvent(
      "v2.0.0",
      BigInt.fromI32(150),
    )
    setEventMetadata(
      upgradeEvent,
      NETWORK_ADDRESS,
      150,
      1_500,
      3,
      "0x3333333333333333333333333333333333333333333333333333333333333333",
    )
    handleSSVNetworkUpgradeBlock(upgradeEvent)

    let feeEvent = createNetworkFeeUpdatedEvent(NETWORK_FEE_OLD, NETWORK_FEE_NEW)
    setEventMetadata(
      feeEvent,
      NETWORK_ADDRESS,
      160,
      1_600,
      4,
      "0x4444444444444444444444444444444444444444444444444444444444444444",
    )
    handleNetworkFeeUpdated(feeEvent)

    assert.entityCount("SSVNetworkUpgradeBlock", 1)
    assert.entityCount("NetworkFeeUpdated", 1)

    assert.fieldEquals("DAOValues", NETWORK_ADDRESS.toHexString(), "version", "v2.0.0")
    assert.fieldEquals("DAOValues", NETWORK_ADDRESS.toHexString(), "updateType", "NETWORK_FEE")
    assert.fieldEquals("DAOValues", NETWORK_ADDRESS.toHexString(), "networkFee", NETWORK_FEE_NEW.toString())
    assert.fieldEquals("DAOValues", NETWORK_ADDRESS.toHexString(), "networkFeeIndex", "0")
    assert.fieldEquals("DAOValues", NETWORK_ADDRESS.toHexString(), "networkFeeIndexBlockNumber", "160")
    assert.fieldEquals("DAOValues", NETWORK_ADDRESS.toHexString(), "networkFeeSSV", "0")
    assert.fieldEquals("DAOValues", NETWORK_ADDRESS.toHexString(), "networkFeeIndexBlockNumberSSV", "0")

    clearStore()
  })

  test("whitelist handlers create accounts and update operator access controls", () => {
    clearStore()

    addOperator(
      OPERATOR_ONE_ID,
      OPERATOR_PUBLIC_KEY,
      1,
      "0xdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd",
    )

    let whitelistEvent = createOperatorWhitelistUpdatedEvent(
      OPERATOR_ONE_ID,
      WHITELISTED_ADDRESS,
    )
    setEventMetadata(
      whitelistEvent,
      NETWORK_ADDRESS,
      170,
      1_700,
      5,
      "0x5555555555555555555555555555555555555555555555555555555555555555",
    )
    handleOperatorWhitelistUpdated(whitelistEvent)

    let contractEvent = createOperatorWhitelistingContractUpdatedEvent(
      [OPERATOR_ONE_ID],
      WHITELISTING_CONTRACT,
    )
    setEventMetadata(
      contractEvent,
      NETWORK_ADDRESS,
      171,
      1_701,
      6,
      "0x6666666666666666666666666666666666666666666666666666666666666666",
    )
    handleOperatorWhitelistingContractUpdated(contractEvent)

    let removeWhitelistEvent = createOperatorWhitelistUpdatedEvent(
      OPERATOR_ONE_ID,
      ZERO_ADDRESS,
    )
    setEventMetadata(
      removeWhitelistEvent,
      NETWORK_ADDRESS,
      172,
      1_702,
      7,
      "0x7777777777777777777777777777777777777777777777777777777777777777",
    )
    handleOperatorWhitelistUpdated(removeWhitelistEvent)

    assert.entityCount("OperatorWhitelistUpdated", 2)
    assert.entityCount("OperatorWhitelistingContractUpdated", 1)
    assert.entityCount("Account", 2)

    assert.fieldEquals(
      "OperatorWhitelistUpdated",
      operatorAddedEventId(
        "00005",
        "0x5555555555555555555555555555555555555555555555555555555555555555",
      ),
      "whitelisted",
      WHITELISTED_ADDRESS.toHexString(),
    )
    assert.fieldEquals(
      "OperatorWhitelistingContractUpdated",
      operatorAddedEventId(
        "00006",
        "0x6666666666666666666666666666666666666666666666666666666666666666",
      ),
      "whitelistingContract",
      WHITELISTING_CONTRACT.toHexString(),
    )

    assert.fieldEquals("Operator", "1", "whitelistedContract", WHITELISTING_CONTRACT.toHexString())
    assert.fieldEquals("Operator", "1", "isPrivate", "false")
    assert.fieldEquals("Account", WHITELISTED_ADDRESS.toHexString(), "feeRecipient", WHITELISTED_ADDRESS.toHexString())

    clearStore()
  })
})
