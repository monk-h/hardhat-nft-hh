const { deployments, ethers, getNamedAccounts, network } = require("hardhat")
const { assert, expect } = require("chai")
const { developmentChains } = require("../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("RandomIpfsNft", async function () {
          let deployer, randomIpfsNft, mintFee
          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              await deployments.fixture(["all"])
              randomIpfsNft = await ethers.getContract("RandomIpfsNft", deployer)
              mintFee = await randomIpfsNft.getMintFee()
              vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer)

              // mockV3Aggregator = await ethers.getContract("")
          })

          describe("constructor", async () => {
              it("s_tokenCounter should be zero", async () => {
                  const tokenCounter = await randomIpfsNft.getTokenCounter()
                  assert.equal(tokenCounter.toString(), "0")
              })
          })
          describe("requestNft", async () => {
              it("reverts when you don't pay enough", async () => {
                  await expect(randomIpfsNft.requestNft()).to.be.revertedWith(
                      "RandomIpfsNft__NeedMoreETHSent"
                  )
              })

              it("emits an event and kicks off a random word request", async function () {
                  await expect(randomIpfsNft.requestNft({ value: mintFee.toString() })).to.emit(
                      randomIpfsNft,
                      "NftRequested"
                  )
              })
          })

          describe("fulfillRandomWords", async () => {
              it("mints NFT after random number is returned", async () => {
                  await new Promise(async (resolve, reject) => {
                      randomIpfsNft.once("NftMinted", async () => {
                          try {
                              const tokenCounter = await randomIpfsNft.getTokenCounter()
                              assert.equal(tokenCounter.toString(), "1")
                              resolve()
                          } catch (error) {
                              console.log(e)
                              reject(e)
                          }
                      })

                      try {
                          const requestNtfResponse = await randomIpfsNft.requestNft({
                              value: mintFee.toString(),
                          })
                          const requestNftReceipt = await requestNtfResponse.wait(1)
                          await vrfCoordinatorV2Mock.fulfillRandomWords(
                              requestNftReceipt.events[1].args.requestId,
                              randomIpfsNft.address
                          )
                      } catch (error) {
                          console.log(e)
                          reject(e)
                      }
                  })
              })
          })
      })
