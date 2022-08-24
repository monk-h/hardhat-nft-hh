const { deployments, ethers, getNamedAccounts, network } = require("hardhat")
const { assert, expect } = require("chai")
const { developmentChains } = require("../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("BasicNft", async function () {
          let deployer, basicNft, mockV3Aggregator
          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              await deployments.fixture(["all"])
              basicNft = await ethers.getContract("BasicNft", deployer)
              // mockV3Aggregator = await ethers.getContract("")
          })

          describe("constructor", async () => {
              it("s_tokenCounter should be zero", async () => {
                  const tokenCounter = await basicNft.getTokenCounter()
                  assert.equal(tokenCounter.toString(), "0")
              })
          })
          describe("function", async () => {
              it("mintNft && token_uri", async () => {
                  const txResponse = await basicNft.mintNft()
                  await txResponse.wait(1)
                  const tokenCounter = await basicNft.getTokenCounter()
                  const tokenURI = await basicNft.tokenURI(0)

                  assert.equal(tokenCounter.toString(), "1")
                  assert.equal(tokenURI, await basicNft.TOKEN_URI())
              })
          })
      })
