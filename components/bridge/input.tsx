"use client"

import { useAccount } from "wagmi"
import { useCallback } from "react"
import { Copy } from "lucide-react"
import { Input } from "../ui/input"
import { Separator } from "../ui/separator"

import BridgeTokenSeletor from "./token"
import BridgeNetworkSeletor from "./network"

import copy from "copy-to-clipboard"
import general from "../../data/lang/en/general.json"

const terms = general["terms"]

export default function BridgeInputs({
    tokenAmount,
    tokenPrice,
    tokenBalance,
    tokenValue,
    updateTokenAmount,
    tokenAddress,
    tokenIcon,
    tokenName,
    tokenSymbol,
    networkIcon,
    networkName,
    updateTokenAddress,
    updateNetworkInfo,
    inputReadOnly,
    placeholder
}) {
    const { isConnected } = useAccount()
    
	const handleCopy = useCallback(() => {
		copy(tokenAddress)
	}, [tokenAddress])

    return (
        <section className={`w-full`}>
            {isConnected && !inputReadOnly && (
                <div className={`w-full px-4 opacity-80 text-sm text-right text-primary justify-end items-center flex gap-2`}>
                    {`${terms.balance}:`} {tokenBalance}
                </div>
            )}
            <Separator className={`w-full h-[0.5px] gradient-border`} />
            <div className={`w-full grid grid-cols-[1fr_auto_1fr] gap-2 px-4 gradient-header`}>
                <div className="w-full flex justify-start py-2 gap-2 items-center">
                    <BridgeTokenSeletor
                        tokenAddress={tokenAddress}
                        tokenIcon={tokenIcon}
                        tokenName={tokenName}
                        tokenSymbol={tokenSymbol}        
                        updateTokenAddress={updateTokenAddress}
                    />
                    <Copy onClick={() => handleCopy()} className={`${tokenAddress === "0x0000000000000000000000000000000000000000" && "hidden"} cursor-pointer w-4 h-4 hover:scale-125 hover:text-primary`} />
                </div>
                <Separator className={`w-[1px] h-full mx-2 gradient-border`} />
                <div className="w-full flex justify-start py-2 gap-2 items-center">
                    <BridgeNetworkSeletor
                        networkIcon={networkIcon}
                        networkName={networkName}
                        updateNetworkInfo={updateNetworkInfo}
                    />
                </div>
            </div>
            <Separator className={`w-full h-[0.5px] gradient-border`} />
            <div className={`p-4 grid grid-cols-2 gap-2`}>
                <Input
                    type="number"
                    readOnly={inputReadOnly}
                    placeholder={placeholder}
                    value={tokenAmount}
                    onChange={(e) => updateTokenAmount(e.target.value, tokenPrice)}
                    className={`font-bold border-none text-lg text-left [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                />
                {/* {inputReadOnly ? ( */}
                    <div className={`grid grid-cols-1`}>
                        <div className={`border-none opacity-45 text-xs text-right m-0 h-fit px-3`}>
                            {tokenValue && tokenAmount ? `Value` : ``}
                        </div>
                        <Input
                            type="text"
                            readOnly
                            value={tokenValue ? (tokenAmount && `~ ${tokenValue} USD`) : ``}
                            className={`border-none opacity-45 text-xs text-right m-0 h-fit`}
                        />
                    </div>
                {/* ) : (
                    null
                )} */}
            </div>
            <Separator className={`w-full h-[0.5px] gradient-border`} />
        </section>
    )
}