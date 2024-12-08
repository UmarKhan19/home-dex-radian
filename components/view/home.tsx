"use client"

import { useRouter } from "next/navigation"
import { useAccount } from "wagmi"
import { Wallet } from "lucide-react"
import { ButtonBase } from "../button"
import { CardBase } from "../card"

import home from "../../data/lang/en/home.json"
import general from "../../data/lang/en/general.json"

const terms = general["terms"]
const cards = home["cards"]
const section_1 = home["section_1"]

export default function Home() {
    const router = useRouter()
    const { isConnected } = useAccount()

    return (
        <section className={`flex-row text-center justify-center items-center min-h-[60vh]`}>
            <div className={`grid gap-4 md:gap-8 grid-cols-1 lg:grid-cols-2 my-8`}>
                <div className={`flex lg:hidden h-[50vh] max-h-[240px]`}>

                </div>
                <div className={`w-full grid grid-cols-1 gap-8 mt-8 mb-10 justify-center lg:justify-start`}>
                    {section_1.map((item, index) => (
                        sectionOneProcessor({item, index})
                    ))}
                    <ButtonBase
                        title={(
                            isConnected ? (
                                <div className={`flex gap-2 items-center text-lg`}>
                                    <img src={`/assets/images/icon.png`} alt={general.project_name} className="w-6 h-6"/> {`${terms.open} ${terms.dapp}`}
                                </div>
                            ) : (
                                <div className={`flex gap-2 items-center text-lg`}>
                                    <Wallet className="w-6 h-6"/> {`${terms.connect}`}
                                </div>
                            )
                        )}
                        onClick={isConnected ? () => router.push("/app") : () => open()}
                        borderClass={`button-shape gradient-border rounded-[6px] p-[2px] -my-[2px] -mr-[2px]`}
                        buttonClass={`gradient-button-primary button-shape p-6`}                        
                    />
                </div>
            </div>
            <div className={`grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 my-8`}>
                {cards.map((item, index) => (
                    <CardBase
                        key={`card-${index}`}
                        content={cardProcessor(item)}
                        onClick={() => router.push(item.link)}
                        button={item.button}
                    />
                ))}
            </div>
        </section>
    )
}

function sectionOneProcessor({item, index}) {
    return (
        item.type === "header" ? (
            <div
                key={`header-${index}`}
                className={`font-avenixel text-headline-web text-left`}
            >
                {item.content.map((header, idx) => (
                    header.type === "underline" ? (
                        <span key={`header-${index}-${idx}`} className={`mr-1 gradient-underline`}>
                            {`${header.content}`}
                        </span>
                    ) : (
                        <span key={`header-${index}-${idx}`} className={`mr-1`}>
                            {`${header.content}`}
                        </span>
                    )
                ))}
            </div>
        ) : (
            <p
                key={`text-${index}`}
                className={`text-xl text-left`}
            >
                {item.content.map((header, idx) => (
                    header.type === "underline" ? (
                        <span key={`header-${index}-${idx}`} className={`mr-1 gradient-underline`}>
                            {`${header.content}`}
                        </span>
                    ) : (
                        <span key={`header-${index}-${idx}`} className={`mr-1`}>
                            {`${header.content}`}
                        </span>
                    )
                ))}
            </p>
        )
    )
}

function cardProcessor(item) {
    return (
        <div className={`grid grid-cols-1 gap-2 justify-center items-center h-full`}>
            <div className={`mx-auto`}>
                <img src={item.icon} alt={item.headline} />
            </div>
            <div className={`items-center grid grid-cols-[1fr_2fr] gap-4 w-fit mx-auto`}>
                <div className={`text-4xl font-bold items-center pt-2`}>
                    {item.counter}
                </div>
                <div className={`text-left uppercase`}>
                    <div className={`text-lg font-bold`}>
                        {item.headline}
                    </div>
                    <div className={`text-xs`}>
                        {item.subheadline}
                    </div>
                </div>
            </div>
        </div>
    )
}