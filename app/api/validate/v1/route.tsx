import { readContract } from "@wagmi/core"
import { NextResponse, NextRequest } from "next/server"
import { getAddress } from "viem"
import { bsc } from "viem/chains"
import { config } from "../../../../config"
import { tokenAbi } from "../../../../data/abi/tokenABI"

import general from "../../../../data/lang/en/general.json"

export const dynamic = "force-dynamic"

const terms = general["terms"]
const api = process.env.NEXT_PUBLIC_PROJECT_ID
const requestCounts: Map<string, number> = new Map()

export async function GET(request: NextRequest) {
    try{
        const { searchParams } = new URL(request.url)
        
        const apiKey = request.headers.get("API-Key")
        const baseUrl = "https://api.geckoterminal.com/api/v2"
        const expectedApiKey = api
        const requestCount = requestCounts.get(apiKey) || 0
        
        const address = searchParams.get("address")
        const network = searchParams.get("network")

        if (apiKey !== expectedApiKey) {
            return new Response(terms.unauthorized, { status: 401 })
        }

        if (requestCount >= 60) {
            return new Response(terms.rate_limit, { status: 429 })
        }

        requestCounts.set(apiKey, requestCount + 1)

        setTimeout(() => {
            requestCounts.delete(apiKey)
        }, 60000)
        
        const tokenNameRes = readContract(config, {
            chainId: bsc.id, 
            abi: tokenAbi,
            address: getAddress(address),
            functionName: "name"
        })
        
        const tokenSymbolRes = readContract(config, {
            chainId: bsc.id, 
            abi: tokenAbi,
            address: getAddress(address),
            functionName: "symbol"
        })
        
        const tokenDecimalsRes = readContract(config, {
            chainId: bsc.id, 
            abi: tokenAbi,
            address: getAddress(address),
            functionName: "decimals"
        })

        const res = await fetch(`${baseUrl}/networks/${network ? network : "bsc"}/tokens/${address}`, {
            next: { revalidate: 60 } 
        })
        const result = await res.json()

        const name = await tokenNameRes
        const symbol = await tokenSymbolRes
        const decimals = await tokenDecimalsRes
        return NextResponse.json({ status: true, message: "This is token", info: [{title: name, ticker: symbol, decimal: decimals, address: address, img: result["data"]["attributes"]["image_url"]}] });
    } catch (err) {
        return NextResponse.json({ status: false, message: err, info: [] })
    }
}
