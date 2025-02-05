import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import { BAppMetadataURIUpdated } from "../generated/schema"
import { BAppMetadataURIUpdated as BAppMetadataURIUpdatedEvent } from "../generated/BasedAppManager/BasedAppManager"
import { handleBAppMetadataURIUpdated } from "../src/based-app-manager"
import { createBAppMetadataURIUpdatedEvent } from "./based-app-manager-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let bAppAddress = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let metadataURI = "Example string value"
    let newBAppMetadataURIUpdatedEvent = createBAppMetadataURIUpdatedEvent(
      bAppAddress,
      metadataURI
    )
    handleBAppMetadataURIUpdated(newBAppMetadataURIUpdatedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("BAppMetadataURIUpdated created and stored", () => {
    assert.entityCount("BAppMetadataURIUpdated", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "BAppMetadataURIUpdated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "bAppAddress",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "BAppMetadataURIUpdated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "metadataURI",
      "Example string value"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
