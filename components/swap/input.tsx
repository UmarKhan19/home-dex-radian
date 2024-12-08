"use client"

import { useAccount } from "wagmi"
import { useCallback } from "react"
import { Copy } from "lucide-react"
import { Input } from "../ui/input"
import { Separator } from "../ui/separator"
import { Button } from "../ui/button"

import SwapSeletor from "./selector"

import copy from "copy-to-clipboard"
import general from "../../data/lang/en/general.json"

const terms = general["terms"]

export default function SwapInputs({
    tokenAmount,
    tokenPrice,
    tokenBalance,
    tokenValue,
    updateTokenAmount,
    tokenAddress,
    tokenIcon,
    tokenName,
    tokenSymbol,
    updateTokenAddress,
    inputReadOnly,
    placeholder,
    setMaxAmount,
    useMaxAmount,
    checked
}) {
    const { isConnected } = useAccount()
    
	const handleCopy = useCallback(() => {
		copy(tokenAddress)
	}, [tokenAddress])

    return (
        <section className={`w-full`}>
            <div className={`w-full grid grid-cols-2 gap-2 px-4 my-2`}>
                <div className="w-full flex justify-start gap-2 items-center">
                    <SwapSeletor
                        tokenAddress={tokenAddress}
                        tokenIcon={tokenIcon}
                        tokenName={tokenName}
                        tokenSymbol={tokenSymbol}
                        tokenPrice={tokenPrice}
                        updateTokenAddress={updateTokenAddress}
                    />
                    <Copy onClick={() => handleCopy()} className={`${tokenAddress === "0x0000000000000000000000000000000000000000" && "hidden"} cursor-pointer w-4 h-4 hover:scale-125 hover:text-primary`} />
                </div>
                {isConnected && (
                    <div className={`w-full opacity-80 text-sm text-right text-primary justify-end items-center flex gap-2`}>
                        {`${terms.balance}:`} {tokenBalance}
                    </div>
                )}
            </div>
            <Separator className={`w-full h-[0.5px] gradient-border`} />
            <div className={`p-4 gradient-header`}>
                <div className={`grid ${useMaxAmount ? "grid-cols-[auto_1fr]" : "grid-cols-1"} gap-2`}>
                    {useMaxAmount && <Button
                        variant="ghost"
                        onClick={setMaxAmount}
                        className={`w-full rounded-b-lg gradient-button-primary px-4 py-2`}
                    >
                        {`${terms.max}`}
                    </Button>}
                    <Input
                        type="number"
                        readOnly={inputReadOnly}
                        placeholder={placeholder}
                        value={tokenAmount}
                        onChange={(e) => updateTokenAmount(e.target.value, tokenPrice)}
                        className={`font-bold border-none text-lg text-right [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                    />
                </div>
                <Input
                    type="text"
                    readOnly
                    value={tokenValue ? (tokenAmount && `~ ${tokenValue} USD`) : ``}
                    className={`border-none opacity-45 text-xs text-right m-0 h-fit`}
                />
            </div>
            <Separator className={`w-full h-[0.5px] gradient-border`} />
        </section>
    )
}