"use client"

import { useWeb3Modal } from "@web3modal/wagmi/react"
import { getWalletClient } from "@wagmi/core"
import { useAccount, useConnect } from "wagmi"
import { toast } from "sonner"
import { formatUnits } from "viem"
import { useCallback, useEffect, useState } from "react"
import { CHAIN_TYPE, CrossChainTradeType, EvmCrossChainTrade, OnChainTrade, SDK } from "rubic-sdk"
import { ArrowDownUp } from "lucide-react"
import { Separator } from "../ui/separator"
import { Button } from "../ui/button"
import { getNetwork, nFormatter } from "../../lib/helper"
import { configuration } from "../../constant/configuration"
import { config } from "../../config"

import BridgeInputs from "./input"
import BridgeInfo from "./info"
import BridgeSlippage from "./slippage"
import BridgeProviders from "./providers"

import general from "../../data/lang/en/general.json"
import whitelist from "../../data/whitelist.json"

const terms = general["terms"]
const tokensBSC = whitelist["token"]["bsc"]
const networksBSC = whitelist["network"]["bsc"]
const networks = whitelist["network"]
const tokens = whitelist["token"]
const api = process.env.NEXT_PUBLIC_PROJECT_ID

export default function BridgeModule() {
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
    const [tokenAddressFrom, setTokenAddressFrom] = useState(tokensBSC[0].address)
    const [tokenAddressTo, setTokenAddressTo] = useState(tokensBSC[1].address)
    const [tokenSymbolFrom, setTokenSymbolFrom] = useState(tokensBSC[0].symbol)
    const [tokenSymbolTo, setTokenSymbolTo] = useState(tokensBSC[1].symbol)
    const [tokenNameFrom, setTokenNameFrom] = useState(tokensBSC[0].name)
    const [tokenNameTo, setTokenNameTo] = useState(tokensBSC[1].name)
    const [tokenIconFrom, setTokenIconFrom] = useState(tokensBSC[0].icon)
    const [tokenIconTo, setTokenIconTo] = useState(tokensBSC[1].icon)
    const [tokenBalanceFrom, setTokenBalanceFrom] = useState("0")
    const [tokenBalanceTo, setTokenBalanceTo] = useState("0")
    const [tokenPriceFrom, setTokenPriceFrom] = useState("")
    const [tokenPriceTo, setTokenPriceTo] = useState("")
    const [tokenValueFrom, setTokenValueFrom] = useState("")
    const [tokenValueTo, setTokenValueTo] = useState("")
    const [networkIdFrom, setNetworkIdFrom] = useState("bsc")
    const [networkIdTo, setNetworkIdTo] = useState("bsc")
    const [networkNameFrom, setNetworkNameFrom] = useState(networksBSC.name)
    const [networkNameTo, setNetworkNameTo] = useState(networksBSC.name)
    const [networkIconFrom, setNetworkIconFrom] = useState(networksBSC.icon)
    const [networkIconTo, setNetworkIconTo] = useState(networksBSC.icon)
    const [slippage, setSlippage] = useState("0.005")
    const [providers, setProviders] = useState<any>([])
    const [gasSymbolFrom, setGasSymbolFrom] = useState(networksBSC["nativeCurrency"].symbol)
    
    const timer = loaded ? (15 * 1000) : (1500)

    const updateTokenAmountFrom = (amount, price) => {
        setChecked(false)
        setProviders([])
        setTokenAmountTo("")    
        setTokenValueFrom((Number(amount) * Number(price)).toString())
        setTokenAmountFrom(amount)

        setLoaded(false)
        setLoadedBalance(false)
    }
    
    const updateNetworkInfoFrom = (networkTicker: string, networkName: string, networkIcon: string) => {
        setNetworkNameFrom(networkName)
        setNetworkIconFrom(networkIcon)

        setTokenAmountFrom("")
        setGasSymbolFrom(networks[networkTicker]["nativeCurrency"].symbol)
        setNetworkIdFrom(networkTicker)
        setTokenAddressFrom(tokens[networkTicker][0].address)
        setTokenSymbolFrom(tokens[networkTicker][0].symbol)
        setTokenNameFrom(tokens[networkTicker][0].name)
        setTokenIconFrom(tokens[networkTicker][0].icon)
        setTokenBalanceFrom("0")
        setTokenPriceFrom("")
        setTokenValueFrom("")    
        
        setLoaded(false)
        setLoadedBalance(false)
    }

    const updateTokenAddressFrom = (tokenAddress: string, tokenName: string, tokenSymbol: string, tokenIcon: string) => {
        if (tokenAddress === tokenAddressTo) {
            updateExchanging()
        } else {
            setTokenAddressFrom(tokenAddress)
            setTokenNameFrom(tokenName)
            setTokenSymbolFrom(tokenSymbol)
            setTokenIconFrom(tokenIcon)
            console.log(tokenIcon)
            setTokenBalanceFrom("0")
            setTokenPriceFrom("")
            setTokenValueFrom("")
        }

        setLoaded(false)
        setLoadedBalance(false)
    }

    const updateTokenAmountTo = (amount, price) => {
        setTokenValueTo((Number(amount) * Number(price)).toString())
        setTokenAmountTo(amount)
    }
    
    const updateNetworkInfoTo = (networkTicker: string, networkName: string, networkIcon: string) => {
        setNetworkNameTo(networkName)
        setNetworkIconTo(networkIcon)

        setTokenAmountTo("")
        setNetworkIdTo(networkTicker)
        setTokenAddressTo(tokens[networkTicker][0].address)
        setTokenSymbolTo(tokens[networkTicker][0].symbol)
        setTokenNameTo(tokens[networkTicker][0].name)
        setTokenIconTo(tokens[networkTicker][0].icon)
        setTokenBalanceTo("0")
        setTokenPriceTo("")
        setTokenValueTo("")    
        
        setLoaded(false)
        setLoadedBalance(false)
    }

    const updateTokenAddressTo = (tokenAddress: string, tokenName: string, tokenSymbol: string, tokenIcon: string) => {
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
        }

        setLoaded(false)
        setLoadedBalance(false)
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
        const prevNetworkNameFrom = networkNameFrom
        const prevNetworkIconFrom = networkIconFrom
        const prevNetworkIdFrom = networkIdFrom

        const prevTokenBalanceTo = tokenBalanceTo
        const prevTokenPriceTo = tokenPriceTo
        const prevTokenAddressTo = tokenAddressTo
        const prevTokenNameTo = tokenNameTo
        const prevTokenSymbolTo = tokenSymbolTo
        const prevTokenIconTo = tokenIconTo
        const prevNetworkNameTo = networkNameTo
        const prevNetworkIconTo = networkIconTo
        const prevNetworkIdTo = networkIdTo

        setTokenBalanceFrom(prevTokenBalanceTo)
        setTokenPriceFrom(prevTokenPriceTo)
        setTokenAddressFrom(prevTokenAddressTo)
        setTokenNameFrom(prevTokenNameTo)
        setTokenSymbolFrom(prevTokenSymbolTo)
        setTokenIconFrom(prevTokenIconTo)
        setNetworkNameFrom(prevNetworkNameFrom)
        setNetworkIconFrom(prevNetworkIconFrom)
        setNetworkIdFrom(prevNetworkIdFrom)

        setTokenBalanceTo(prevTokenBalanceFrom)
        setTokenPriceTo(prevTokenPriceFrom)
        setTokenAddressTo(prevTokenAddressFrom)
        setTokenNameTo(prevTokenNameFrom)
        setTokenSymbolTo(prevTokenSymbolFrom)
        setTokenIconTo(prevTokenIconFrom)
        setNetworkNameTo(prevNetworkNameTo)
        setNetworkIconTo(prevNetworkIconTo)
        setNetworkIdTo(prevNetworkIdTo)

        updateTokenAmountFrom(prevTokenAddressTo, prevTokenPriceTo)

        if (Number(prevTokenAmountFrom) > 0) {
            quoting(prevNetworkIdTo, prevTokenAddressTo, prevTokenPriceTo, prevTokenAmountFrom, prevNetworkIdFrom, prevTokenAddressFrom, prevTokenPriceFrom)
        }
    }

    const quoting = async (networkFrom, addressFrom, priceFrom, amountFrom, networkTo, addressTo, priceTo) => {
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
    
        const blockchainFrom = getNetwork(networkFrom)
        const fromTokenAddress = addressFrom
        const fromAmount = amountFrom
        const blockchainTo = getNetwork(networkTo)
        const toTokenAddress = addressTo

        const options = {
            slippageTolerance: Number(slippage)
        }
        const wrappedTrades = await sdk.crossChainManager.calculateTrade(
            { blockchain: blockchainFrom, address: fromTokenAddress }, 
            fromAmount,
            { blockchain: blockchainTo, address: toTokenAddress },
            options
        )
        let tradesData = []
        wrappedTrades.forEach((wrappedTrade) => {
            // const tradeType: CrossChainTradeType = wrappedTrade.tradeType;
            const trade = wrappedTrade.trade!;        
            if (trade instanceof EvmCrossChainTrade) {
                tradesData.push(trade)
            }
        
            // if (!wrappedTrade.error && wrappedTrade.trade! instanceof EvmCrossChainTrade) {
            //     // console.log(wrappedTrade.trade!)
            //     tradesData.push(wrappedTrade.trade!)
            // }                    
        })
        setProviders(tradesData)

        if (tradesData.length > 0) {
            // const newAmount = formatUnits(BigInt(tradesData[0]["to"].weiAmount), tradesData[0]["to"].decimals)
            const newAmount = Number(tradesData[0]["to"].weiAmount as bigint) / Math.pow(10, Number(tradesData[0]["to"].decimals))
            updateTokenAmountTo(Number(newAmount), priceTo)
        }

        setChecking(false)
        setChecked(true)
    }

    const swapping = async (tradeInfo) => {
        setTransacting(true)
        console.log(tradeInfo)
        const index = connectors.findIndex((item) => item.id === connector.id)

        const sdk = await SDK.createSDK(configuration)

        const walletClient = getWalletClient(config, {
            account: address,
            connector: connectors[index],
            chainId: networkIdFrom == "eth" ? 1 : networkIdFrom == "matic" ? 137 : 56
        }) 

        const walletProvider = {
            core: (await walletClient),
            address: address
        }

        sdk.updateWalletProviderCore(CHAIN_TYPE.EVM, walletProvider)

        const onConfirm = (hash: string) => console.log(hash)
        try  {
            const receipt = await tradeInfo.swap({
                onConfirm
            }).then(setTransacting(false))
            toast(receipt)
        } catch (err) {
            toast(err?.message)
            setTransacting(false)
        }
    }

    useEffect(useCallback(() => {
        const check = async () => {
            try {
                const resCheck = await fetch(`/api/price?networkFrom=${networkIdFrom}&addressFrom=${tokenAddressFrom}&networkTo=${networkIdTo}&addressTo=${tokenAddressTo}`, {
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
        const dataInterval = setInterval(check, timer)
    
        return () => {
            clearInterval(dataInterval)
        }
    }, [loaded]), [loaded, tokenAddressFrom, tokenAddressTo])

    useEffect(useCallback(() => {
        const checkBalance = async () => {
            try {
                const resBal = await fetch(`/api/balance?networkFrom=${networkIdFrom}&addressFrom=${tokenAddressFrom}&networkTo=${networkIdTo}&addressTo=${tokenAddressTo}&addressUser=${address}`, {
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
                {`${terms.bridge}`}
            </h1>
            <p className={`px-4`}>
                {`${terms.instant_token_trade}`}
            </p>
            <Separator className={`w-full my-6 h-[1px] bg-foreground opacity-15`} />
            <BridgeInputs
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
                networkIcon={networkIconFrom}
                networkName={networkNameFrom}
                updateNetworkInfo={updateNetworkInfoFrom}
            />
            <div
                onClick={!checking && !transacting ? () => updateExchanging() : () => null}
                className={`rounded-full p-[1.5px] w-9 h-9 mx-auto mt-4 mb-6 gradient-line flex items-center justify-center ${!checking && !transacting ? "cursor-pointer hover:rotate-180 opacity-100" : "opacity-75"} duration-300`}
            >
                <ArrowDownUp className={`gradient-header rounded-full w-full h-full p-2`} />
            </div>
            <BridgeInputs
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
                networkIcon={networkIconTo}
                networkName={networkNameTo}
                updateNetworkInfo={updateNetworkInfoTo}
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
                <BridgeSlippage
                    updateSlippage={setSlippage}
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
                                quoting(networkIdFrom, tokenAddressFrom, tokenPriceFrom, tokenAmountFrom, networkIdTo, tokenAddressTo, tokenPriceTo)
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
                    <BridgeProviders
                        providers={providers}
                        swapping={swapping}
                        gasSymbol={gasSymbolFrom}
                    />
                    <BridgeInfo
                        providerInfo={providers[0]}
                        gasSymbol={gasSymbolFrom}
                    />
                </div>
            )}
        </div>
    )
}