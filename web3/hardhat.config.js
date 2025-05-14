/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: '0.8.9',
    // defaultNetwork: 'goerli',
    // defaultNetwork: 'holesky',
    defaultNetwork: 'sepolia',
    networks: {
      hardhat: {},
      // goerli: {
      //   url: 'https://rpc.ankr.com/eth_goerli',
      //   accounts: [`0x${process.env.PRIVATE_KEY}`]
      // }
      // holesky: {
      //   url: 'https://ethereum-holesky.publicnode.com',
      //   accounts: [`0x${process.env.PRIVATE_KEY}`],
      // },
      sepolia: {
        url: 'https://ethereum-sepolia.publicnode.com',
        accounts: [`0x${process.env.PRIVATE_KEY}`],
      },
    },
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
