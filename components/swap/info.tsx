import { formatUnits } from "viem"
import { nFormatter } from "../../lib/helper"

import general from "../../data/lang/en/general.json"
import { ChevronRight } from "lucide-react"

const terms = general["terms"]

export default function SwapInfo({
    providerInfo
}) {
    const gas = nFormatter(Number(providerInfo["trade"]["gasFeeInfo"]?.gasFeeInEth), 3)
    const price = nFormatter(Number(providerInfo["trade"]["gasFeeInfo"]?.gasFeeInUsd), 3)
    const path = providerInfo["trade"]?.path
    const slippage = providerInfo["trade"]?.slippageTolerance
    const impact = providerInfo["trade"]?.priceImpact
    const decimals = providerInfo["trade"]["to"]?.decimals
    const newAmount = Number(providerInfo["trade"]["to"]?.weiAmount as bigint) / Number(decimals)
    const minimum = newAmount * (1 - slippage)

    return (
        <div className={`rounded-lg py-2 gradient-header m-4 mb-0 border border-primary`}>
            <div className={`w-full grid grid-cols-2 gap-2 px-4 my-2 text-xs`}>
                <div className="w-full opacity-80 flex justify-start gap-2 items-center">
                    {`${terms.minimum_received}`}
                </div>
                <div className={`w-full text-right justify-end items-center flex gap-2`}>
                    {minimum}
                </div>
            </div>
            <div className={`w-full grid grid-cols-2 gap-2 px-4 my-2 text-xs`}>
                <div className="w-full opacity-80 flex justify-start gap-2 items-center">
                    {`${terms.price_impact}`}
                </div>
                <div className={`w-full text-right justify-end items-center flex gap-2`}>
                    {impact} %
                </div>
            </div>
            {providerInfo["trade"].gasFeeInfo && (
                <div className={`w-full grid grid-cols-2 gap-2 px-4 my-2 text-xs`}>
                    <div className="w-full opacity-80 flex justify-start gap-2 items-center">
                        {`${terms.trading_fee}`}
                    </div>
                    <div className={`w-full text-right justify-end items-center flex gap-1`}>
                        {gas} BNB ~ ${price}
                    </div>
                </div>
            )}
            <div className={`w-full grid grid-cols-2 gap-2 px-4 my-2 text-xs`}>
                <div className="w-full opacity-80 flex justify-start gap-2 items-center">
                    {`${terms.available_route}`}
                </div>
                <div className={`w-full text-right justify-end items-center flex gap-2`}>
                    {path.map((item, index) => (
                        <div key={`route-${index}`} className={`gap-2 flex items-center`}>
                            {`${item.symbol}`} {index < path.length - 1 && <ChevronRight key={`chevron-${index}`} className={`w-2 h-2`} /> }
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}