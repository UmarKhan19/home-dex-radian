"use client"

import { useWeb3Modal } from "@web3modal/wagmi/react"
import { getWalletClient } from "@wagmi/core"
import { useAccount, useConnect } from "wagmi"
import { toast } from "sonner"
import { formatUnits } from "viem"
import { useCallback, useEffect, useState } from "react"
import { BLOCKCHAIN_NAME, CHAIN_TYPE, OnChainTrade, SDK } from "rubic-sdk"
import { ArrowDownUp } from "lucide-react"
import { Separator } from "../ui/separator"
import { Button } from "../ui/button"
import { nFormatter } from "../../lib/helper"
import { configuration } from "../../constant/configuration"
import { config } from "../../config"

import SwapInputs from "./input"
import SwapInfo from "./info"
import SwapSlippage from "./slippage"

import general from "../../data/lang/en/general.json"
import whitelist from "../../data/whitelist.json"
import SwapProviders from "./providers"

const terms = general["terms"]
const tokens = whitelist["token"]["bsc"]
const api = process.env.NEXT_PUBLIC_PROJECT_ID

export default function SwapModule() {
    const { address, connector, isConnected } = useAccount()
    const { connectors } = useConnect()
    const { open } = useWeb3Modal()

    const [loaded, setLoaded] = useState(false)
    const [loadedBalance, setLoadedBalance] = useState(false)
    const [checking, setChecking] = useState(false)
    const [checked, setChecked] = useState(false)
    const [transacting, setTransacting] = useState(false)
    const [tokenAmountFrom, setTokenAmountFrom] = useState("")
    const [tokenAmountTo, setTokenAmountTo] = useState("")
    const [tokenAddressFrom, setTokenAddressFrom] = useState(tokens[0].address)
    const [tokenAddressTo, setTokenAddressTo] = useState(tokens[1].address)
    const [tokenSymbolFrom, setTokenSymbolFrom] = useState(tokens[0].symbol)
    const [tokenSymbolTo, setTokenSymbolTo] = useState(tokens[1].symbol)
    const [tokenNameFrom, setTokenNameFrom] = useState(tokens[0].name)
    const [tokenNameTo, setTokenNameTo] = useState(tokens[1].name)
    const [tokenIconFrom, setTokenIconFrom] = useState(tokens[0].icon)
    const [tokenIconTo, setTokenIconTo] = useState(tokens[1].icon)
    const [tokenBalanceFrom, setTokenBalanceFrom] = useState("0")
    const [tokenBalanceTo, setTokenBalanceTo] = useState("0")
    const [tokenPriceFrom, setTokenPriceFrom] = useState("")
    const [tokenPriceTo, setTokenPriceTo] = useState("")
    const [tokenValueFrom, setTokenValueFrom] = useState("")
    const [tokenValueTo, setTokenValueTo] = useState("")
    const [slippage, setSlippage] = useState("0.005")
    const [providers, setProviders] = useState<any>([])

    const timer = loaded ? (15 * 1000) : (1500)

    const updateTokenAmountFrom = (amount, price) => {
        setChecked(false)
        setProviders([])
        setTokenAmountTo("")    
        setTokenValueFrom((Number(amount) * Number(price)).toString())
        setTokenAmountFrom(amount)
    }

    const updateTokenAddressFrom = async (tokenPrice, tokenAddress: string, tokenName: string, tokenSymbol: string, tokenIcon: string) => {
        if (tokenAddress === tokenAddressTo) {
            updateExchanging()
        } else {
            setTokenAddressFrom(tokenAddress)
            setTokenNameFrom(tokenName)
            setTokenSymbolFrom(tokenSymbol)
            setTokenIconFrom(tokenIcon)
            setTokenBalanceFrom("0")
            setTokenPriceFrom("")
            setTokenValueFrom("")
            await checkPrice()
            await checkBalance()
            await quoting(tokenAddress, tokenPrice, tokenAmountFrom, tokenAddressTo, tokenPriceTo, slippage)
        }
    }

    const updateTokenAmountTo = (amount, price) => {
        setTokenValueTo((Number(amount) * Number(price)).toString())
        setTokenAmountTo(amount)
    }

    const updateTokenAddressTo = async (tokenPrice, tokenAddress: string, tokenName: string, tokenSymbol: string, tokenIcon: string) => {
        if (tokenAddress === tokenAddressFrom) {
            updateExchanging()
        } else {
            setTokenAddressTo(tokenAddress)
            setTokenNameTo(tokenName)
            setTokenSymbolTo(tokenSymbol)
            setTokenIconTo(tokenIcon)
            setTokenBalanceTo("0")
            setTokenPriceTo("")
            setTokenValueTo("")
            await checkPrice()
            await checkBalance()
            await quoting(tokenAddressFrom, tokenPriceFrom, tokenAmountFrom, tokenAddress, tokenPrice, slippage)
        }
        
    }

    const updateExchanging = async () => {
        setChecked(false)
        
        const prevTokenAmountFrom = tokenAmountFrom
        const prevTokenBalanceFrom = tokenBalanceFrom
        const prevTokenPriceFrom = tokenPriceFrom
        const prevTokenAddressFrom = tokenAddressFrom
        const prevTokenNameFrom = tokenNameFrom
        const prevTokenSymbolFrom = tokenSymbolFrom
        const prevTokenIconFrom = tokenIconFrom

        const prevTokenBalanceTo = tokenBalanceTo
        const prevTokenPriceTo = tokenPriceTo
        const prevTokenAddressTo = tokenAddressTo
        const prevTokenNameTo = tokenNameTo
        const prevTokenSymbolTo = tokenSymbolTo
        const prevTokenIconTo = tokenIconTo

        setTokenBalanceFrom(prevTokenBalanceTo)
        setTokenPriceFrom(prevTokenPriceTo)
        setTokenAddressFrom(prevTokenAddressTo)
        setTokenNameFrom(prevTokenNameTo)
        setTokenSymbolFrom(prevTokenSymbolTo)
        setTokenIconFrom(prevTokenIconTo)

        setTokenBalanceTo(prevTokenBalanceFrom)
        setTokenPriceTo(prevTokenPriceFrom)
        setTokenAddressTo(prevTokenAddressFrom)
        setTokenNameTo(prevTokenNameFrom)
        setTokenSymbolTo(prevTokenSymbolFrom)
        setTokenIconTo(prevTokenIconFrom)

        updateTokenAmountFrom(prevTokenAddressTo, prevTokenPriceTo)

        await checkPrice()
        await checkBalance()
        
        if (Number(prevTokenAmountFrom) > 0) {
            quoting(prevTokenAddressTo, prevTokenPriceTo, prevTokenAmountFrom, prevTokenAddressFrom, prevTokenPriceFrom, slippage)
        }
    }

    const quoting = async (addressFrom, priceFrom, amountFrom, addressTo, priceTo, newSlippage) => {
        setChecking(true)
        updateTokenAmountFrom(amountFrom, priceFrom)
    
        const sdk = await SDK.createSDK(configuration)
    
        if (isConnected) {
            const index = connectors.findIndex((item) => item.id === connector.id)
            const walletProvider = {
                core: connectors[index].getProvider({
                    chainId: 56
                }),
                address: address
            }
        
            sdk.updateWalletProviderCore(CHAIN_TYPE.EVM, walletProvider)
        }
    
        const blockchainFrom = BLOCKCHAIN_NAME.BINANCE_SMART_CHAIN
        const fromTokenAddress = addressFrom
        const fromAmount = amountFrom
        const toTokenAddress = addressTo

        const options = {
            slippageTolerance: Number(newSlippage)
        }
        const tradesOn = await sdk.onChainManager.calculateTrade(
            { blockchain: blockchainFrom, address: fromTokenAddress }, 
            fromAmount,
            toTokenAddress,
            options
        )
        let tradesData = []
        tradesOn.forEach((trade) => {
            if (trade.trade instanceof OnChainTrade) {
                tradesData.push(trade)
            }                    
        })
        setProviders(tradesData)
        
        if (tradesData.length > 0) {
            // const newAmount = formatUnits(BigInt((tradesData[0]["trade"]["to"].weiAmount.c).toString().replace(/,/g, "")), Number(tradesData[0]["trade"]["to"].decimals))
            const newAmount = Number(tradesData[0]["trade"]["to"].weiAmount as bigint) / Math.pow(10, Number(tradesData[0]["trade"]["to"].decimals))
            updateTokenAmountTo(Number(newAmount), priceTo)
        }

        setChecking(false)
        setChecked(true)
    }

    const setMaxAmount = () => {
        setTokenAmountFrom(tokenBalanceFrom)
    }

    const updateSlippage = (val) => {
        setSlippage(val)
        quoting(tokenAddressFrom, tokenPriceFrom, tokenAmountFrom, tokenAddressTo, tokenPriceTo, val)
    }

    const swapping = async (tradeInfo) => {
        setTransacting(true)
        const index = connectors.findIndex((item) => item.id === connector.id)

        const sdk = await SDK.createSDK(configuration)

        const walletClient = getWalletClient(config, {
            account: address,
            connector: connectors[index],
            chainId: 56
        }) 

        const walletProvider = {
            core: (await walletClient),
            address: address
        }

        sdk.updateWalletProviderCore(CHAIN_TYPE.EVM, walletProvider)

        const onConfirm = (hash: string) => console.log(hash)
        try  {
            const receipt = await tradeInfo["trade"].swap({
                onConfirm
            }).then(setTransacting(false))
            toast(receipt)
        } catch (err) {
            toast(err?.message ? err?.message : "ERROR")
            console.log(err)
            setTransacting(false)
        }
    }

    const checkPrice = async () => {
        try {
            const resCheck = await fetch(`/api/price?addressFrom=${tokenAddressFrom}&addressTo=${tokenAddressTo}`, {
                cache: 'no-store',
                next: {
                    revalidate: 15
                },
                headers: {
                    "API-Key": api,
                }
            })
            const result = await resCheck.json()
            setTokenPriceFrom(result.tokenPriceFrom)
            setTokenPriceTo(result.tokenPriceTo)
        } catch (error) {
            console.log(error)
        }

        if (!loaded) {
            setLoaded(true)
        }
    }

    useEffect(useCallback(() => {
        const dataInterval = setInterval(checkPrice, timer)
    
        return () => {
            clearInterval(dataInterval)
        }
    }, [loaded]), [loaded, tokenAddressFrom, tokenAddressTo])

    const checkBalance = async () => {
        try {
            const resBal = await fetch(`/api/balance?networkFrom=${"bsc"}&networkTo=${"bsc"}&addressFrom=${tokenAddressFrom}&addressTo=${tokenAddressTo}&addressUser=${address}`, {
                cache: 'no-store',
                next: {
                    revalidate: 15
                },
                headers: {
                    "API-Key": api,
                }
            })
            const resultBal = await resBal.json()
            setTokenBalanceFrom(resultBal.tokenBalanceFrom.toString())
            setTokenBalanceTo(resultBal.tokenBalanceTo.toString())
        } catch (error) {
            console.log(error)
        }

        if (!loadedBalance) {
            setLoadedBalance(true)
        }
    }

    useEffect(useCallback(() => {
        if (!loadedBalance && isConnected) {
            const dataInterval = setInterval(checkBalance, 1500)

            return () => {
                clearInterval(dataInterval)
            }
        }
    }, [loadedBalance, isConnected]), [loadedBalance, tokenAddressFrom, tokenAddressTo, address, isConnected])

    return (
        <div className={`box-glow gradient-swap py-4 rounded-2xl min-w-full max-w-[600px] lg:min-w-[450px]`}>
            <h1 className={`text-gradient font-avenixel text-4xl px-4`}>
                {`${terms.swap}`}
            </h1>
            <p className={`px-4`}>
                {`${terms.instant_token_trade}`}
            </p>
            <Separator className={`w-full my-6 h-[1px] bg-foreground opacity-15`} />
            <SwapInputs
                tokenAmount={tokenAmountFrom}
                tokenPrice={tokenPriceFrom}
                tokenBalance={Number(tokenBalanceFrom) === 0 ? tokenBalanceFrom : nFormatter(Number(tokenBalanceFrom), 6)}
                tokenValue={Number(tokenValueFrom).toFixed(5)}
                updateTokenAmount={updateTokenAmountFrom}
                tokenAddress={tokenAddressFrom}
                tokenIcon={tokenIconFrom}
                tokenName={tokenNameFrom}
                tokenSymbol={tokenSymbolFrom}
                updateTokenAddress={updateTokenAddressFrom}
                placeholder={`0.0`}
                inputReadOnly={transacting || checking}
                setMaxAmount={() => setMaxAmount()}
                useMaxAmount={true}
                checked={checked}
            />
            <div
                onClick={!checking && !transacting ? () => updateExchanging() : () => null}
                className={`rounded-full p-[1.5px] w-9 h-9 mx-auto mt-4 mb-2 gradient-line flex items-center justify-center ${!checking && !transacting ? "cursor-pointer hover:rotate-180 opacity-100" : "opacity-75"} duration-300`}
            >
                <ArrowDownUp className={`gradient-header rounded-full w-full h-full p-2`} />
            </div>
            <SwapInputs
                tokenAmount={tokenAmountTo}
                tokenPrice={tokenPriceTo}
                tokenBalance={Number(tokenBalanceTo) === 0 ? tokenBalanceTo : nFormatter(Number(tokenBalanceTo), 6)}
                tokenValue={Number(tokenValueTo).toFixed(5)}
                updateTokenAmount={updateTokenAmountTo}
                tokenAddress={tokenAddressTo}
                tokenIcon={tokenIconTo}
                tokenName={tokenNameTo}
                tokenSymbol={tokenSymbolTo}
                updateTokenAddress={updateTokenAddressTo}
                placeholder={checking ? `${terms.loading}...` : `0.0`}
                inputReadOnly={true}
                setMaxAmount={() => null}
                useMaxAmount={false}
                checked={checked}
            />
            <div className={`my-4`}>
                <div className={`${(!checked || checking) && "hidden"} w-full grid grid-cols-2 gap-2 px-4 my-2 text-xs`}>
                    <div className="w-full flex justify-start gap-2 items-center">
                        {`${terms.price}`}
                    </div>
                    <div className={`w-full opacity-80 text-right text-foreground justify-end items-center flex gap-2`}>
                        {`1 ${tokenSymbolFrom} ~ ${nFormatter(Number(tokenAmountTo) / Number(tokenAmountFrom), 3)} ${tokenSymbolTo}`}
                    </div>
                </div>
                <SwapSlippage
                    updateSlippage={updateSlippage}
                />
                {/* <div className={`group cursor-pointer w-full grid grid-cols-2 gap-2 px-4 my-2 text-xs`}>
                    <div className="w-full flex justify-start gap-1 items-center">
                        {`${terms.slippage}`}
                        <Pencil className={`w-3 h-3 group-hover:scale-125 group-hover:text-primary`} />
                    </div>
                    <div className={`w-full opacity-80 text-right text-foreground justify-end items-center flex gap-2`}>
                        {`${Number(slippage) * 100} %`}
                    </div>
                </div> */}
            </div>
            <div className={`${!checked && "pt-4"} px-4 pb-4`}>
                <div className={`p-[1.5px] mt-2 ${!((isConnected && tokenAmountFrom === "") || checking || (isConnected && checked && (Number(tokenBalanceFrom) <= 0 || Number(tokenBalanceFrom) < Number(tokenAmountFrom)))) && "gradient-border"} rounded-md`}>
                    <Button
                        onClick={() => !isConnected ? (
                            open()
                        ) : (
                            checked ? (
                                providers.length > 0 && swapping(providers[0])
                            ) : (
                                quoting(tokenAddressFrom, tokenPriceFrom, tokenAmountFrom, tokenAddressTo, tokenPriceTo, slippage)
                            )
                        )}
                        variant={(isConnected && tokenAmountFrom === "") || transacting || checking || (isConnected && checked && (Number(tokenBalanceFrom) <= 0 || Number(tokenBalanceFrom) < Number(tokenAmountFrom))) ?  "outline" : "default"}
                        className={`w-full ${(isConnected && tokenAmountFrom === "") || transacting || checking || (isConnected && checked && (Number(tokenBalanceFrom) <= 0 || Number(tokenBalanceFrom) < Number(tokenAmountFrom))) ? "bg-transparent" : "gradient-button-primary"}`}
                        disabled={(isConnected && tokenAmountFrom === "") || transacting || checking || (isConnected && checked && (Number(tokenBalanceFrom) <= 0 || Number(tokenBalanceFrom) < Number(tokenAmountFrom)))}
                    >
                        {transacting ? (
                            `${terms.swapping}...`
                        ) : (
                            checking ? (
                                `${terms.loading}...`
                            ) : (
                                isConnected ? (
                                    checked ? (
                                        Number(tokenBalanceFrom) <= 0 || Number(tokenBalanceFrom) < Number(tokenAmountFrom) ? (
                                            `${terms.insufficient_fund}`
                                        ) : (
                                            `${terms.swap}`
                                        )
                                    ) : (
                                        `${terms.get_quote}`
                                    )
                                ) : `${terms.connect} ${terms.wallet}`
                            )
                        )}
                    </Button>
                </div>
            </div>
            {!checking && isConnected && tokenAddressFrom === "0x0000000000000000000000000000000000000000" && (Number(tokenBalanceFrom) <= 0 || Number(tokenBalanceFrom) < Number(tokenAmountFrom)) && (
                <div
                    className={`flex gap-1 justify-center text-xs text-center`}
                >
                    {`${terms.insufficient_fund}?`}
                    <span 
                        onClick={() => open({ view: "OnRampProviders" })}
                        className={`text-primary hover:text-foreground cursor-pointer font-bold`}
                    >
                        {`${terms.buy_crypto_here}.`}
                    </span>
                </div>
            )}
            {!checking && checked && providers.length > 0 && (
                <div>
                    <SwapProviders
                        providers={providers}
                        swapping={swapping}
                    />
                    <SwapInfo
                        providerInfo={providers[0]}
                    />
                </div>
            )}
        </div>
    )
}