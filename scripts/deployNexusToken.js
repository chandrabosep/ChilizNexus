async function main() {
  const nexusTokenContract = await hre.ethers.getContractFactory("NexusToken");
  console.log("Deploying NexusToken Contract...");

  const NexusTokenContract = await nexusTokenContract.deploy({
    gasLimit: 30000000000,
  });

  await NexusTokenContract.waitForDeployment();
  const NexusTokenAddress = await NexusTokenContract.getAddress();
  console.log("NexusToken Contract Address:", NexusTokenAddress);
  console.log("----------------------------------------------------------");

  // Verify NexusToken Contract
  console.log("Verifying NexusToken...");
  await run("verify:verify", {
    address: NexusTokenAddress,
    constructorArguments: [],
  });
  console.log("----------------------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// yarn hardaht run scripts/deploy.js --network chilizSpicy
// yarn hardhat verify --network chilizSpicy DEPLOYED_CONTRACT_ADDRESS
