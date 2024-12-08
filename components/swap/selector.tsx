"use client"

import { useState } from "react"
import { isAddress } from "viem"
import { Play } from "lucide-react"
import { Dialog, DialogContent, DialogClose, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Input } from "../ui/input"

import general from "../../data/lang/en/general.json"
import whitelist from "../../data/whitelist.json"

const terms = general["terms"]
const tokens = whitelist["token"]
const api = process.env.NEXT_PUBLIC_PROJECT_ID

export default function SwapSeletor({
    tokenAddress,
    tokenIcon,
    tokenPrice,
    tokenName,
    tokenSymbol,
    updateTokenAddress
}) {
    const [checking, setChecking] = useState(false)
    const [token, setToken] = useState("")
    const [data, setData] = useState<any>()

    const searchToken = async (val: string) => {
        setToken(val)
        if (val.length === 42 && isAddress(val)) {
            setChecking(true)
            try {
                const resBal = await fetch(`/api/validate?address=${val}`, {
                    next: {
                        revalidate: 15
                    },
                    headers: {
                        "API-Key": api,
                    }
                })
                const resultBal = await resBal.json()
                setData(resultBal.info)
            } catch (error) {
                console.log(error)
            }
            setChecking(false)
        }
    }

    const updateToken = (val: string) => {
        const tokenInfo = tokens["bsc"].find((item) => item.address === val)
        const name = tokenInfo.name
        const symbol = tokenInfo.symbol
        const icon = tokenInfo.icon
        updateTokenAddress(tokenPrice, val, name, symbol, icon)
        setToken("")
    }

    const updateTokenWhitelist = (val: string, title: string, ticker: string, img: string) => {
        setToken(val)
        const name = title
        const symbol = ticker
        const icon = img
        updateTokenAddress(tokenPrice, val, title, ticker, img)
        setToken("")
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className={`cursor-pointer hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 p-0`}>
                    <div className={`flex gap-1 items-center w-fit`}>
                        {tokenIcon === "missing.png" ? (
                            <div className={`max-w-4 max-h-4 rounded-full flex items-center justify-center`}>
                                {tokenName.charAt(0)}
                            </div>
                        ) : (
                            <img src={`${tokenIcon}`} alt={`${tokenName}`} className={`max-w-4 max-h-4`} />
                        )}
                        <span className={`flex gap-1 items-center`}>
                            {`${tokenSymbol}`}
                            <Play className={`w-2 h-2 rotate-90`} />
                        </span>
                    </div>
                </div>
            </DialogTrigger>
            <DialogContent className={`box-glow border-[1px] border-primary gradient-swap py-6 rounded-2xl min-w-full max-w-[450px] lg:min-w-[400px]`}>
                <DialogHeader className={`text-center mx-auto items-center justify-center`}>
                    <DialogTitle className={`font-avenixel text-4xl text-gradient`}>
                        {`${terms.select_token}`}
                    </DialogTitle>
                    <DialogDescription>
                        
                    </DialogDescription>
                </DialogHeader>
                <div className={`my-2 grid gap-4`}>
                    <div className={`p-[1px] gradient-border rounded-md`}>
                        <Input
                            type="text"
                            placeholder={terms.search_paste_address}
                            value={token}
                            minLength={42}
                            maxLength={42}
                            onChange={(e) => searchToken(e.target.value)}
                            className={`rounded-md gradient-background font-bold border-none text-sm`}
                        />
                    </div>
                    <div className={`font-bold text-xs`}>
                        {`${terms.common_bases}`}
                        <div className={`py-2 flex gap-2`}>
                            {tokens["bsc"].map((item, index) => (
                                <DialogClose key={`item-${index}`}>
                                    <div
                                        key={`token-${index}`}
                                        className={`${tokenAddress === item.address ? "opacity-50 cursor-not-allowed" : ""} h-8 px-3 hover:bg-accent hover:text-accent-foreground items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 flex gap-2 text-md gradient-header rounded-full border-primary border-[1px] hover:scale-105`}
                                        onClick={() => updateToken(item.address)}
                                    >
                                        <img
                                            key={`icon-${index}`}
                                            src={`${item.icon}`}
                                            alt={`${item.name}`}
                                            className={`w-4 h-4`}
                                        />
                                        {`${item.symbol}`}
                                    </div>
                                </DialogClose>
                            ))}
                        </div>
                    </div>
                    <div className={`font-bold text-xs`}>
                        {`${terms.token_list}`}
                        <div className={`py-2 flex-row gap-2 w-full`}>
                            {token !== "" && token !== undefined && token !== null && token ? (
                                checking ? (
                                    <div className={`text-center w-fit mx-auto`}>
                                        {`${terms.searching}...`}
                                    </div>
                                ) : (
                                    data.length > 0 ? (
                                        data.map((token, idx) => (
                                            <DialogClose key={`item-${idx}`} className={`w-full p-2`}>
                                                <div
                                                    key={`token-${idx}`}
                                                    className={`grid grid-cols-[auto_1fr] gap-4 items-center`}
                                                    onClick={() => updateTokenWhitelist(token.address, token.title, token.ticker, token.img)}
                                                >
                                                    <img key={`token-icon-${idx}`} src={`${token.img}`} alt={`${token.title}`} className={`w-8 h-8`} />
                                                    <div key={`token-info-${idx}`} className={`grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 items-center`}>
                                                        <div key={`token-meta-${idx}`} className={`text-left justify-start grid grid-cols-1`}>
                                                            <div key={`token-symbol-${idx}`} className={`font-bold text-xl`}>
                                                                {`${token.ticker}`}
                                                            </div>
                                                            <div key={`token-name-${idx}`} className={`font-normal opacity-80 text-sm`}>
                                                                {`${token.title}`}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </DialogClose>                                    
                                        ))
                                    ) : (
                                        <div className={`text-center w-fit mx-auto`}>
                                            {`${terms.token_not_found}`}
                                        </div>
                                    )
                                )
                            ) : (
                                tokens["bsc"].map((item, index) => (
                                    <DialogClose key={`item-${index}`} className={`w-full p-2`}>
                                        <div
                                            key={`token-${index}`}
                                            className={`grid grid-cols-[auto_1fr] gap-4 items-center`}
                                            onClick={() => updateToken(item.address)}
                                        >
                                            <img key={`token-icon-${index}`} src={`${item.icon}`} alt={`${item.name}`} className={`w-8 h-8`} />
                                            <div key={`token-info-${index}`} className={`grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 items-center`}>
                                                <div key={`token-meta-${index}`} className={`text-left justify-start grid grid-cols-1`}>
                                                    <div key={`token-symbol-${index}`} className={`font-bold text-xl`}>
                                                        {`${item.symbol}`}
                                                    </div>
                                                    <div key={`token-name-${index}`} className={`font-normal opacity-80 text-sm`}>
                                                        {`${item.name}`}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </DialogClose>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}