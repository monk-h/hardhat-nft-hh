const { network } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
const fs = require("fs")

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deployer } = await getNamedAccounts()
    const { deploy, log } = deployments
    let priceFeedAddress

    if (developmentChains.includes(network.name)) {
        // priceFeedAddress = await deployments.get("MockV3Aggregator")
        const EthUsdAggregator = await deployments.get("MockV3Aggregator")
        priceFeedAddress = EthUsdAggregator.address
    } else {
        priceFeedAddress = networkConfig[network.config.chainId].ethUsdPriceFeed
    }

    const lowSvg = fs.readFileSync("./images/dynamicNft/frown.svg", { encoding: "utf8" })
    const highSvg = fs.readFileSync("./images/dynamicNft/happy.svg", { encoding: "utf8" })
    const args = [priceFeedAddress, lowSvg, highSvg]
    log("----------------------------------------------------")
    const dynamicNft = await deploy("DynamicSvgNft", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfimations || 1,
    })

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(basicNft.address, args)
    }
}
module.exports.tags = ["all", "dynamic", "main"]
