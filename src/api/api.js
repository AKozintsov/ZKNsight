import axios from "axios"
import { KRIYA_POOLS_TOKEN, TOKEN_API_KEY, ZETTABLOCK_X_API_KEY } from "../../constants"

const query = `query MyQuery {
    records {
      categories
      project_image_url
      project_name
    }
  }`    

export const api = {
    getCoins: async (walletId) => {
        return await axios.get(`https://api.blockeden.xyz/sui-indexer/67nCBdZQSH9z3YqDDjdm/account/coins?account=${walletId}`)
    },
    getNFTs: async (walletId) => {
        return await axios.get(`https://api.blockeden.xyz/sui-indexer/67nCBdZQSH9z3YqDDjdm/account/nfts?account=${walletId}`)
    },
    getEvents: async (walletId) => {
        return await axios.get(`https://api.blockeden.xyz/sui-indexer/jBQLBdEWG4xk6fmaWshS/nft/accountCollection?owner=${walletId}&pageSize=50`)
    },
    getPortfolios: async () => {
        return await axios.post('https://api.zettablock.com/api/v1/dataset/sq_fef80ff0abd7431298553e933f8de34b/graphql', {query}, {
            headers: {
                'X-API-KEY': ZETTABLOCK_X_API_KEY
            }
        })
    },
    getCetusPools: async () => {
        return await axios.get('https://api-sui.cetus.zone/v2/sui/swap/count')
    },
    getTankAprs: async () => {
        return await axios.get('https://legacy.bucketprotocol.io/api/tank-apr')
    },
    getTokenInfo: async (tokenName) => {
        return await axios.get(`https://data-api.cryptocompare.com/asset/v1/data/by/symbol?asset_symbol=${tokenName}&api_key=${TOKEN_API_KEY}`)
    },
    getKriyaPools: async () => {
        return await axios.get('https://xd0ljetd33.execute-api.ap-southeast-1.amazonaws.com/release/pools', { headers: {'x-api-key': KRIYA_POOLS_TOKEN} })
    },
}