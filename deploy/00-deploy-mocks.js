const { network, ethers } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const BASE_FEE = ethers.utils.parseEther("0.25") //0.25 is the premium,It costs 0.25 link.
const GAS_PRICE_LINK = 1e9 //1000000000

const DECIMALS = "18"
const INITIAL_PRICE = ethers.utils.parseUnits("2000", "ether")

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const args = [BASE_FEE, GAS_PRICE_LINK]

    if (developmentChains.includes(network.name)) {
        log("Local network detected! Deploying mocks...")
        //deploy a mock vrfcoordinator
        await deploy("VRFCoordinatorV2Mock", {
            from: deployer,
            log: true,
            args: args,
        })
        log("Mock Deployed!")
        await deploy("MockV3Aggregator", {
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_PRICE],
        })
        log("------------------------------------------")
    }
}

module.exports.tags = ["all", "mocks"]
