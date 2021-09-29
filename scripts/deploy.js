const main = async () => {
	// to learn more about signers visit: https://docs.ethers.io/v5/api/signer/#Signer
	const [deployer] = await hre.ethers.getSigners();
	const accountBalance = await deployer.getBalance();

	console.log(`Deploying contracts with account: ${deployer.address}`)
	console.log(`Account balance: ${accountBalance}`)

	const Token = await hre.ethers.getContractFactory("WavePortal");
	const portal = await Token.deploy();

	console.log(`WavePortal address ${portal.address}`)
};

const runMain = async () => {
	try {
		await main();
		process.exit(0);
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
};

runMain();