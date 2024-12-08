import { formatUnits } from "viem"
import { nFormatter } from "../../lib/helper"
import { ChevronRight } from "lucide-react"

import general from "../../data/lang/en/general.json"
import whitelist from "../../data/whitelist.json"

const terms = general["terms"]
const networks = whitelist["network"]

export default function BridgeInfo({
    providerInfo,
    gasSymbol
}) {
    const gas = nFormatter(Number(providerInfo["gasFeeInfo"]?.gasFeeInEth), 3)
    const price = nFormatter(Number(providerInfo["gasFeeInfo"]?.gasFeeInUsd), 3)
    const path = providerInfo?.routePath
    const slippage = providerInfo?.slippage
    const impact = providerInfo?.priceImpact
    const decimals = providerInfo["to"]?.decimals
    const newAmount = Number(providerInfo["to"]?.weiAmount as bigint) / Number(decimals)
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
            {providerInfo["gasFeeInfo"] && (
                <div className={`w-full grid grid-cols-2 gap-2 px-4 my-2 text-xs`}>
                    <div className="w-full opacity-80 flex justify-start gap-2 items-center">
                        {`${terms.trading_fee}`}
                    </div>
                    <div className={`w-full text-right justify-end items-center flex gap-1`}>
                        {gas} {gasSymbol} ~ ${price}
                    </div>
                </div>
            )}
            <div className={`w-full grid grid-cols-2 gap-2 px-4 my-2 text-xs`}>
                <div className="w-full opacity-80 flex justify-start gap-2 items-center">
                    {`${terms.available_route}`}
                </div>
                <div className={`w-full text-right justify-end items-center flex gap-2`}>
                    {path && path.map((item, index) => (
                        <div key={`route-${index}`} className={`gap-2 flex items-center`}>
                            {item.path && item.path.map((itm, idx) => (
                                index < path.length - 1 ? (
                                    idx === 0 ? (
                                        <div key={`path-${index}=${idx}`} className={`flex gap-2`}>
                                            {`${itm.symbol}`} <img className={`max-w-4 max-h-4`} src={itm.symbol === "BSC" ? networks.bsc.icon : itm.symbol === "ETH" ? networks.eth.icon : networks.polygon_pos.icon} /> {idx < itm.length - 1 && <ChevronRight key={`chevron-${index}-${idx}`} className={`w-2 h-2`} /> }
                                        </div>
                                    ) : null
                                ) : (
                                    idx !== 0 ? (
                                        <div key={`path-${index}=${idx}`} className={`flex gap-2`}>
                                            {`${itm.symbol}`} <img className={`max-w-4 max-h-4`} src={itm.symbol === "BSC" ? networks.bsc.icon : itm.symbol === "ETH" ? networks.eth.icon : networks.polygon_pos.icon} /> {idx < itm.length - 1 && <ChevronRight key={`chevron-${index}-${idx}`} className={`w-2 h-2`} /> }
                                        </div>
                                    ) : null
                                )
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}