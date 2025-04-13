async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const Election = await ethers.getContractFactory("Election");
  const election = await Election.deploy();

  // Attendre que la transaction soit confirmée
  await election.deployed();

  console.log("Election contract deployed to:", election.address);
  return election.address; // Retourner l'adresse du contrat
}

main()
  .then((address) => {
      console.log("Contract deployed to:", address);
      process.exit(0); // Assurez-vous que le processus se termine correctement
  })
  .catch((error) => {
      console.error("Error during deployment:", error);
      process.exit(1); // Termine le processus avec un code d'erreur en cas d'échec
  });
