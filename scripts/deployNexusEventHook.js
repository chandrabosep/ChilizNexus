async function main() {
  const nexusEventHookContract = await hre.ethers.getContractFactory(
    "NexusEventHook"
  );
  console.log("Deploying NexusEventHook Contract...");

  const NexusEventHookContract = await nexusEventHookContract.deploy({
    gasLimit: 50000000,
  });

  await NexusEventHookContract.waitForDeployment();
  const nexusEventHookAddress = await NexusEventHookContract.getAddress();
  console.log("NexusEventHook Contract Address:", nexusEventHookAddress);
  console.log("----------------------------------------------------------");

  // Verify NexusEventHook Contract
  console.log("Verifying NexusEventHook...");
  await run("verify:verify", {
    address: nexusEventHookAddress,
    constructorArguments: [],
  });
  console.log("----------------------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// yarn hardhat run scripts/deployNexusEventHook.js --network chilizSpicy
// yarn hardhat verify --network chilizSpicy DEPLOYED_CONTRACT_ADDRESS
