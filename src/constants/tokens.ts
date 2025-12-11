import { mainnet, polygon, arbitrum, base, optimism, bsc, avalanche, gnosis, fantom, zksync, sepolia } from 'wagmi/chains';
type ERC20Token = {
  chainId: number
  symbol: string
  name?: string
  address: `0x${string}`
  decimals: number
};
export const ERC20_TOKENS: ERC20Token[] = [
  { chainId: mainnet.id, symbol: 'USDC', name: 'USD Coin', address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', decimals: 6 },
  { chainId: mainnet.id, symbol: 'USDT', name: 'Tether', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', decimals: 6 },
  { chainId: mainnet.id, symbol: 'DAI', address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', decimals: 18 },
  { chainId: mainnet.id, symbol: 'WBTC', name: 'Wrapped BTC', address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', decimals: 8 },
  { chainId: mainnet.id, symbol: 'WETH', name: 'Wrapped ETH', address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', decimals: 18 },
  { chainId: mainnet.id, symbol: 'LINK', address: '0x514910771AF9Ca656af840dff83E8264EcF986CA', decimals: 18 },
  { chainId: mainnet.id, symbol: 'UNI', address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', decimals: 18 },
  { chainId: mainnet.id, symbol: 'AAVE', address: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9', decimals: 18 },
  { chainId: mainnet.id, symbol: 'MKR', address: '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2', decimals: 18 },
  { chainId: mainnet.id, symbol: 'LDO', address: '0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32', decimals: 18 },

  { chainId: sepolia.id, symbol: 'WETH', address: '0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9', decimals: 18 }, // todo remove

  { chainId: polygon.id, symbol: 'USDC', name: 'USD Coin', address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', decimals: 6 },
  { chainId: polygon.id, symbol: 'USDT', name: 'Tether', address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', decimals: 6 },
  { chainId: polygon.id, symbol: 'DAI', address: '0x8f3Cf7ad23Cd3CaDb8A5F034B7f4D7A5C4C4D4C4', decimals: 18 },
  { chainId: polygon.id, symbol: 'WETH', name: 'Wrapped ETH', address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619', decimals: 18 },
  { chainId: polygon.id, symbol: 'WBTC', name: 'Wrapped BTC', address: '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6', decimals: 8 },
  { chainId: polygon.id, symbol: 'POL', name: 'Polygon', address: '0x455e53cbb86018ac2b8092fdcd39d8444affc3f6', decimals: 8 },

  { chainId: arbitrum.id, symbol: 'USDC', name: 'USD Coin', address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', decimals: 6 },
  { chainId: arbitrum.id, symbol: 'USDT', name: 'Tether', address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', decimals: 6 },
  { chainId: arbitrum.id, symbol: 'WETH', name: 'Wrapped ETH', address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', decimals: 18 },
  { chainId: arbitrum.id, symbol: 'ARB', name: 'Wrapped ETH', address: '0x912CE59144191C1204E64559FE8253a0e49E6548', decimals: 18 },

  { chainId: base.id, symbol: 'USDC', name: 'USD Coin', address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', decimals: 6 },
  { chainId: base.id, symbol: 'BASE', address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', decimals: 6 },

  { chainId: optimism.id, symbol: 'USDC', name: 'USD Coin', address: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85', decimals: 6 },
  { chainId: optimism.id, symbol: 'USDT', name: 'Tether', address: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58', decimals: 6 },
  { chainId: optimism.id, symbol: 'OP', name: 'Optimism', address: '0x4200000000000000000000000000000000000042', decimals: 18 },

  { chainId: bsc.id, symbol: 'USDC', name: 'USD Coin', address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580', decimals: 18 },
  { chainId: bsc.id, symbol: 'USDT', name: 'Tether', address: '0x55d398326f99059fF775485246999027B3197955', decimals: 18 },

  { chainId: avalanche.id, symbol: 'USDC', name: 'USD Coin', address: '0xB97EF9Ef8734c71904D8002F8b6Bc66Dd9c48a6', decimals: 6 },
  { chainId: avalanche.id, symbol: 'USDT', name: 'Tether', address: '0x9702230A8Ea53601f5cD2dc00d457491C2E7E4', decimals: 6 },

  { chainId: fantom.id, symbol: 'USDC', name: 'USD Coin', address: '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75', decimals: 6 },

  { chainId: zksync.id, symbol: 'USDC', name: 'USD Coin', address: '0x3355df6D4c9c3035724Fd0e3914dE96A5a83aaf4', decimals: 6 },

  { chainId: gnosis.id, symbol: 'USDC', name: 'USD Coin', address: '0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83', decimals: 6 },
];
