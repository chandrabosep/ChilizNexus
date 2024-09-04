async function main() {
  // BAR Contract Deployment
  const cnBarContract = await hre.ethers.getContractFactory("CNFCBarcelona");
  console.log("Deploying CNFCBarcelona Contract...");

  const CNBarContract = await cnBarContract.deploy({
    gasLimit: 5000000,
  });

  await CNBarContract.waitForDeployment();
  const cnBarAddress = await CNBarContract.getAddress();
  console.log("CNFCBarcelona Contract Address:", cnBarAddress);
  console.log("----------------------------------------------------------");

  // PSG Contract Deployment
  const cnPsgContract = await hre.ethers.getContractFactory(
    "CNParisSaintGermai"
  );
  console.log("Deploying CNParisSaintGermai Contract...");

  const CNPsgContract = await cnPsgContract.deploy({
    gasLimit: 5000000,
  });

  await CNPsgContract.waitForDeployment();
  const cnPsgAddress = await CNPsgContract.getAddress();
  console.log("CNParisSaintGermai Contract Address:", cnPsgAddress);
  console.log("----------------------------------------------------------");

  // JUV Contract Deployment
  const cnJuvContract = await hre.ethers.getContractFactory("CNJuventus");
  console.log("Deploying CNJuventus Contract...");

  const CNJuvContract = await cnJuvContract.deploy({
    gasLimit: 5000000,
  });

  await CNJuvContract.waitForDeployment();
  const cnJuvAddress = await CNJuvContract.getAddress();
  console.log("CNJuventus Contract Address:", cnJuvAddress);
  console.log("----------------------------------------------------------");

  // Verify CNFCBarcelona Contract
  console.log("Verifying CNFCBarcelona...");
  await run("verify:verify", {
    address: cnBarAddress,
    constructorArguments: [],
  });
  console.log("----------------------------------------------------------");

  // Verify CNParisSaintGermai Contract
  console.log("Verifying CNParisSaintGermai...");
  await run("verify:verify", {
    address: cnPsgAddress,
    constructorArguments: [],
  });
  console.log("----------------------------------------------------------");

  // Verify CNJuventus Contract
  console.log("Verifying CNJuventus...");
  await run("verify:verify", {
    address: cnJuvAddress,
    constructorArguments: [],
  });
  console.log("----------------------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// To run this script:
// yarn hardhat run scripts/deployFanTokens.js --network chilizSpicy
// To verify contracts:
// yarn hardhat verify --network chilizSpicy DEPLOYED_CONTRACT_ADDRESS
