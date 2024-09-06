async function main() {
  const nexusEventGateContract = await hre.ethers.getContractFactory(
    "NexusEventGate"
  );
  console.log("Deploying NexusEventGate Contract...");

  const NexusEventGateContract = await nexusEventGateContract.deploy({
    gasLimit: 8000000,
  });

  await NexusEventGateContract.waitForDeployment();
  const nexusEventGateAddress = await NexusEventGateContract.getAddress();
  console.log("NexusEventGate Contract Address:", nexusEventGateAddress);
  console.log("----------------------------------------------------------");

  // Verify NexusEventGate Contract
  console.log("Verifying NexusEventGate...");
  await run("verify:verify", {
    address: nexusEventGateAddress,
    constructorArguments: [],
  });
  console.log("----------------------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// yarn hardhat run scripts/deployNexusEventGate.js --network chilizSpicy
// yarn hardhat verify --network chilizSpicy DEPLOYED_CONTRACT_ADDRESS
