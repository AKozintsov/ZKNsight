import axios from "axios"
import { WALLET_ID } from '../../constants'

const query = `query MyQuery {
    records {
      categories
      project_image_url
      project_name
    }
  }`    

export const api = {
    getCoins: async () => {
        return await axios.get(`https://api.blockeden.xyz/sui-indexer/67nCBdZQSH9z3YqDDjdm/account/coins?account=${WALLET_ID}`)
    },
    getNFTs: async () => {
        return await axios.get(`https://api.blockeden.xyz/sui-indexer/67nCBdZQSH9z3YqDDjdm/account/nfts?account=${WALLET_ID}`)
    },
    getPortfolios: async () => {
        return await axios.post('https://api.zettablock.com/api/v1/dataset/sq_fef80ff0abd7431298553e933f8de34b/graphql', {query}, {
            headers: {
                'X-API-KEY': '38a31e3d-d8da-42b5-b6f6-5981b78e334e'
            }
        })
    }
}