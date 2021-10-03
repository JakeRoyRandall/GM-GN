const main = async () => {
	const GM_ContractFactory = await hre.ethers.getContractFactory('GM_Contract');
	const GN_ContractFactory = await hre.ethers.getContractFactory('GN_Contract');

	const GM_Contract = await GM_ContractFactory.deploy(); await GM_Contract.deployed(); 
	console.log('GM Contract addy:', GM_Contract.address);

	const GN_Contract = await GN_ContractFactory.deploy(); await GN_Contract.deployed(); 
	console.log('GN Contract addy:', GN_Contract.address);
	
	const GM_Txn = await GM_Contract.gm('gm'); await GM_Txn.wait();
	const GN_Txn = await GN_Contract.gn('gn'); await GN_Txn.wait();

	const getAllGMs = await GM_Contract.getAllGMs(); console.log(getAllGMs);
	const getAllGNs = await GN_Contract.getAllGNs(); console.log(getAllGNs);
};
  
const runMain = async () => {
	try { await main(); process.exit(0); } 
	catch (error) { console.log(error); process.exit(1); }
};

runMain();