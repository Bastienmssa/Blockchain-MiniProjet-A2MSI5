require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.24",
  networks: {
    sepolia: {
      url: "https://sepolia.infura.io/v3/376a160e0db64ca599dd51f0d30f535c", //URL Infura
      accounts: ["77fb206d60adc16d575f9ffa237635226691b27149916b5b84ae142210872c26"] //Clé privée
    }
  }
};
