"use client"

import { useWeb3Modal } from "@web3modal/wagmi/react"
import { useAccount } from "wagmi"
import { usePathname, useRouter } from "next/navigation"
import { Wallet } from "lucide-react"
import { ButtonDouble } from "../button"
import { Separator } from "../ui/separator"

import general from "../../data/lang/en/general.json"
import { WebNavigation } from "../navigation/web"

const terms = general["terms"]
const header = general["menu"]["header"]

export default function WebHeader() {
	const router = useRouter()
	const pathname = usePathname()

    const { isConnected } = useAccount()
    const { open } = useWeb3Modal()

    return (
        <header className={`gradient-header items-center`}>
            <section className={`grid grid-cols-[1fr_auto] items-center px-10 mt-4`}>
                <div className={`grid grid-cols-[auto_1fr] items-center gap-8`}>
                    <div
                        onClick={() => router.push(`/`)}
                    >
                        <img
                            src={`/assets/images/dexraiden.png`}
                            alt={general.project_name}
                            className={`max-h-[30px] hover:scale-105 cursor-pointer`}
                        />
                    </div>
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
                </div>
                <ButtonDouble
                    title1={(
                        <div className={`flex gap-2 items-center`}>
                            <img className={`icon-mask max-w-4 max-h-4 -mt-1`} src={`/assets/images/icon.png`} /> {`${terms.buy} ${terms.dxr}`}
                        </div>
                    )}
                    onClick1={() => router.push(`/app/swap`)}
                    borderClass1={`p-0`}
                    title2={isConnected ? (
                        <div className={`flex gap-2 items-center`}>
                            <img src={`/assets/images/icon.png`} alt={general.project_name} className="w-4 h-4"/> {`${terms.open} ${terms.dapp}`}
                        </div>
                    ) : (
                        <div className={`flex gap-2 items-center`}>
                            <Wallet className="w-4 h-4"/> {`${terms.connect}`}
                        </div>
                    )}
                    onClick2={isConnected ? (() => router.push("/app")) : (() => open())}
                    borderClass2={`button-shape gradient-border rounded-[6px] p-[2px] -my-[2px] -mr-[2px]`}
                    buttonClass2={`gradient-button-primary button-shape`}
                    borderClassMain={`hidden lg:flex gradient-border button-shape p-[2px] rounded-[6px] w-fit`}
                    buttonClassMain={`flex button-shape gradient-background`}
                />
                <WebNavigation />
            </section>
            <Separator className={`h-[2px] mt-4 gradient-line`} />
        </header>
    )
}