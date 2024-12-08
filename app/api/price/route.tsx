import { NextResponse, NextRequest } from "next/server"

import general from "../../../data/lang/en/general.json"

export const dynamic = "force-dynamic"

const terms = general["terms"]
const api = process.env.NEXT_PUBLIC_PROJECT_ID
const eth_api = process.env.ETH_API
const polygon_api = process.env.POLYGON_API
const bsc_api = process.env.BSC_API
const requestCounts: Map<string, number> = new Map()

export async function GET(request: NextRequest) {
    try{
        const { searchParams } = new URL(request.url)
        
        const apiKey = request.headers.get("API-Key")
        const baseUrl = "https://api.geckoterminal.com/api/v2"
        const expectedApiKey = api
        const requestCount = requestCounts.get(apiKey) || 0
        
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
        
        const resFrom = await fetch(`${baseUrl}/simple/networks/${networkFrom ? networkFrom : "bsc"}/token_price/${addressFrom}`, {
            next: { revalidate: 60 } 
        })
        const resTo = await fetch(`${baseUrl}/simple/networks/${networkTo ? networkTo : "bsc"}/token_price/${addressTo}`, {
            next: { revalidate: 60 } 
        })
        const resultFrom = await resFrom.json()
        const resultTo = await resTo.json()
        const reseth = await fetch(`https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${eth_api}`, {
            next: { revalidate: 60 } 
        })
        const resulteth = await reseth.json()
        const respolygon = await fetch(`https://api.polygonscan.com/api?module=stats&action=maticprice&apikey=${polygon_api}`, {
            next: { revalidate: 60 } 
        })
        const resultpolygon = await respolygon.json()
        const resbnb = await fetch(`https://api.bscscan.com/api?module=stats&action=bnbprice&apikey=${bsc_api}`, {
            next: { revalidate: 60 } 
        })
        const resultbnb = await resbnb.json()

        return NextResponse.json({
            status: true,
            message: `${terms.price_retrieve_successful}`,
            tokenPriceFrom: addressFrom === "0x0000000000000000000000000000000000000000" ? (
                networkFrom === "eth" ? resulteth["result"].ethusd :
                    networkFrom === "polygon_pos" ? resultpolygon["result"].maticusd : resultbnb["result"].ethusd
            ) : resultFrom["data"]["attributes"]["token_prices"][addressFrom],
            tokenPriceTo: addressTo === "0x0000000000000000000000000000000000000000" ? (
                networkTo === "eth" ? resulteth["result"].ethusd :
                    networkTo === "polygon_pos" ? resultpolygon["result"].maticusd : resultbnb["result"].ethusd
            ) : resultTo["data"]["attributes"]["token_prices"][addressTo],
        })
    } catch (err) {
        return NextResponse.json({
            status: false,
            message: err,
            tokenPriceFrom: 0,
            tokenPriceTo: 0
        })
    }
}
