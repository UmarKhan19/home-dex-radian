"use client"

import { useWeb3Modal } from "@web3modal/wagmi/react"
import { useAccount } from "wagmi"
import { usePathname, useRouter } from "next/navigation"
import { Wallet } from "lucide-react"
import { ButtonDouble } from "../button"
import { Separator } from "../ui/separator"
import { shortenAddress } from "../../lib/helper"
import { AppNavigation } from "../navigation/app"

import general from "../../data/lang/en/general.json"

const terms = general["terms"]
const header = general["menu"]["header"]

export default function AppHeader() {
	const router = useRouter()
    const pathname = usePathname()

    const { isConnected, address } = useAccount()
    const { open } = useWeb3Modal()

    return (
        <header className={`items-center px-4 mt-4`}>
            <section className={`grid grid-cols-[1fr_auto] items-center m-2`}>
                <AppNavigation />
                <div className={`gap-8 hidden lg:flex`}>
                    {header.map((item, index) => (
                        item.type === "internal" ? (
                            <p
                                onClick={() => router.push(item.link)}
                                key={`header-item-${index}`}
                                className={`${pathname === item.link ? "font-bold opacity-100" : "opacity-60"} cursor-pointer hover:font-bold hover:opacity-100`}
                            >
                                {`${item.title}`}
                            </p>
                        ) : (
                            item.type === "external" ? (
                                <a
                                    href={`${item.link}`}
                                    target="_blank"
                                    key={`header-item-${index}`}
                                    className={`${pathname === item.link ? "font-bold opacity-100" : "text-foreground font-normal opacity-60"} cursor-pointer hover:font-bold hover:opacity-100`}
                                >
                                    {`${item.title}`}
                                </a>
                            ) : (
                                null
                            )
                        )
                    ))}
                </div>
                <ButtonDouble
                    title1={(
                        <div className={`flex gap-2 items-center`}>
                            <img className={`icon-mask max-w-4 max-h-4 -mt-1`} src={`/assets/images/icon.png`} /> {`${terms.buy}`}
                        </div>
                    )}
                    onClick1={() => router.push(`/app/swap`)}
                    borderClass1={`p-0`}
                    title2={(
                        <div className={`flex gap-2 items-center`}>
                            <Wallet className="w-4 h-4"/> {isConnected ? `${shortenAddress(address, 4, 38)}` : `${terms.connect}`}
                        </div>
                    )}
                    onClick2={() => open()}
                    borderClass2={`button-shape gradient-border rounded-[6px] p-[2px] -my-[2px] -mr-[2px]`}
                    buttonClass2={`gradient-button-primary button-shape`}
                    borderClassMain={`flex gradient-border button-shape p-[2px] rounded-[6px] w-fit`}
                    buttonClassMain={`flex button-shape gradient-background`}
                />
            </section>
            <Separator className={`h-[2px] my-4 gradient-line`} />
        </header>
    )
}