const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const fs = require('fs');
const path = require('path');

module.exports = buildModule("NFTModule", (m) => {
  const nft = m.contract("NFT");

  m.then(async (module) => {
    const nftAddress = nft.getAddress();

    // Save the contract address to a JSON file in the artifacts directory
    const artifactsPath = path.join(__dirname, '../../artifacts');
    const deploymentsPath = path.join(artifactsPath, 'deployments');

    if (!fs.existsSync(deploymentsPath)) {
      fs.mkdirSync(deploymentsPath, { recursive: true });
    }

    const deploymentInfo = {
      address: await nftAddress,
      network: "localhost"
    };

    fs.writeFileSync(
      path.join(deploymentsPath, 'nft-address.json'),
      JSON.stringify(deploymentInfo, null, 2)
    );

    console.log("Deployment address saved to artifacts/deployments/nft-address.json");
  });

  return { nft };
});
