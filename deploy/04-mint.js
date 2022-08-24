const { network, ethers } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deployer } = await getNamedAccounts()
    //Basic NFT
    const basicNft = await ethers.getContract("BasicNft", deployer)
    const basicMintTx = await basicNft.mintNft()
    await basicMintTx.wait(1)
    console.log(`Basic NFT index 0 tokenURI:${await basicNft.tokenURI(0)}`)

    //Random NFT
    const randomNft = await ethers.getContract("RandomIpfsNft", deployer)
    const mintFee = await randomNft.getMintFee()
    const randomMintTx = await randomNft.requestNft({ value: mintFee.toString() })
    const randomMintTxReceipt = await randomMintTx.wait(1)

    //Need to listen for response
    await new Promise(async (resolve, reject) => {
        setTimeout(() => reject("Timeout:'NFTMinted' event did not fire"), 300000) //5 minute timeout time
        //setup listener for our event
        randomNft.once("NftMinted", async () => {
            resolve()
        })

        if (developmentChains.includes(network.name)) {
            const requestId = randomMintTxReceipt.events[1].args.requestId.toString()
            const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer)
            vrfCoordinatorV2Mock.fulfillRandomWords(requestId, randomNft.address)
        }
    })

    console.log(`Random IPFS NFT index 0 tokenURI ${await randomNft.tokenURI(0)}`)

    //Dynamic SVG NFT
    const dynamicSvgNft = await ethers.getContract("DynamicSvgNft", deployer)
    const dynamicSvgNftMintTx = await dynamicSvgNft.mintNft(ethers.utils.parseEther("1"))
    const dynamicSvgNftMintTxReceipt = await dynamicSvgNftMintTx.wait(1)
    console.log(`Dynamic SVG NFT index 0 tokenURI:${await dynamicSvgNft.tokenURI(0)}`)
}

module.exports.tags = ["all", "mint"]
