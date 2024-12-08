import { getBalance } from "@wagmi/core"
import { getAddress } from "viem"
import { NextResponse, NextRequest } from "next/server"
import { config } from "../../../config"

import general from "../../../data/lang/en/general.json"
import whitelist from "../../../data/whitelist.json"

export const dynamic = "force-dynamic"

const terms = general["terms"]
const networks = whitelist["network"]
const api = process.env.NEXT_PUBLIC_PROJECT_ID
const requestCounts: Map<string, number> = new Map()

export async function GET(request: NextRequest) {
    try{
        const { searchParams } = new URL(request.url)
        
        const apiKey = request.headers.get("API-Key")
        const expectedApiKey = api
        const requestCount = requestCounts.get(apiKey) || 0
        
        const addressUser = searchParams.get("addressUser").toLowerCase()
        const addressFrom = searchParams.get("addressFrom").toLowerCase()
        const addressTo = searchParams.get("addressTo").toLowerCase()
        const networkFrom = searchParams.get("networkFrom")
        const networkTo = searchParams.get("networkTo")
        
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
        
        let nativeBalanceFrom = 0
        let nativeBalanceTo = 0
        let tokenBalanceFrom = 0
        let tokenBalanceTo = 0

        const resultFrom = await getBalance(config, {
            address: getAddress(addressUser),
            chainId: networks[networkFrom ? networkFrom : "bsc"].id
        })

        const resultTo = await getBalance(config, {
            address: getAddress(addressUser),
            chainId: networks[networkTo ? networkTo : "bsc"].id
        })

        nativeBalanceFrom = (Number(resultFrom?.value) / Math.pow(10, resultFrom?.decimals))
        nativeBalanceTo = (Number(resultTo?.value) / Math.pow(10, resultTo?.decimals))
        
        if (addressFrom && addressFrom !== "0x0000000000000000000000000000000000000000") {
            const result = await getBalance(config, {
                address: getAddress(addressUser),
                token: getAddress(addressFrom),
                chainId: networks[networkFrom ? networkFrom : "bsc"].id
            })

            tokenBalanceFrom = (Number(result?.value) / Math.pow(10, result?.decimals))
        }

        if (networkTo && addressTo && addressTo !== "0x0000000000000000000000000000000000000000") {
            const result = await getBalance(config, {
                address: getAddress(addressUser),
                token: getAddress(addressTo),
                chainId: networks[networkTo ? networkTo : "bsc"].id
            })

            tokenBalanceTo = (Number(result.value) / Math.pow(10, result.decimals))
        }

        return NextResponse.json({
            status: true,
            message: `${terms.balance_retrieve_successful}`,
            tokenBalanceFrom: addressFrom === "0x0000000000000000000000000000000000000000" ? nativeBalanceFrom : tokenBalanceFrom,
            tokenBalanceTo: addressTo === "0x0000000000000000000000000000000000000000" ? nativeBalanceTo : tokenBalanceTo,
        })
    } catch (err) {
        return NextResponse.json({
            status: false,
            message: err,
            tokenBalanceFrom: 0,
            tokenBalanceTo: 0
        })
    }
}
