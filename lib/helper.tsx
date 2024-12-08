import { FaTelegram, FaXTwitter, FaInstagram } from "react-icons/fa6"
import { Box, GitCompareArrows, Home, Network, Pickaxe } from "lucide-react"
import { BLOCKCHAIN_NAME } from "rubic-sdk"

var SI_SYMBOL = ["", "k", "M", "G", "T", "P", "E"]
var VALUE = ["", "Thousand", "Million", "Billion", "Trillion", "Quadrillion", "Quintillion", "Sextillion", "Septillion"]

export function getSidebarIcons(id: string, className?: string) {
    if (id === "home") {
        return <img className={`icon-mask ${className}`} src={`/assets/images/icon.png`} />
    }
	if (id === "dashboard") {
        return <Home className={className} />
    }
    if (id === "swap") {
        return <GitCompareArrows className={className} />
    }
    if (id === "bridge") {
        return <Box className={className} />
    }
    if (id === "stake") {
        return <Pickaxe className={className} />
    }
    if (id === "launchpad") {
        return <Network className={className} />
    }
    return null
}

export function getSocialIcons(id: string, className?: string) {
    if (id === "telegram") {
        return <FaTelegram className={className} />
    }
    if (id === "x") {
        return <FaXTwitter className={className} />
    }
    if (id === "instagram") {
        return <FaInstagram className={className} />
    }
    return null
}

export const shortenAddress = (address: string, pre: number, suf: number) => {
    const prefix = address.slice(0, pre)
    const suffix = address.slice(suf)
    return `${prefix}...${suffix}`
}

export const nFormatter = (number: number, decimals: number, fixed?: number, useSI?: boolean) => {
    var tier = Math.log10(Math.abs(number)) / 3 | 0

    if (tier < 0) {
        const exponent = Math.abs(tier) * 3
        const coefficient = (number * Math.pow(10, exponent + decimals)).toFixed(0)
        const value = number.toExponential().split("e")[0].replace(".", "")
        const amount = value.length < decimals ? value.toString() : coefficient
        return (
            <div>
                0.0
                <sub>
                    <sub className="text-xs p-0.5 text-foreground group-hover:text-primary">{`${exponent}`}</sub>
                </sub>
                {`${amount}`}
            </div>
        )
    }

    if(tier <= 0) return Number(number).toFixed(decimals)
    
    var suffix = useSI ? SI_SYMBOL[tier] : VALUE[tier]
    var scale = Math.pow(10, tier * 3)

    var scaled = number / scale

    if(fixed > 0) return scaled.toFixed(fixed) + " " + suffix

    return scaled.toFixed(3) + " " + suffix
}

export const getNetwork = (id: string) => {
    if (id === "eth")
        return BLOCKCHAIN_NAME.ETHEREUM
    if (id === "polygon_pos")
        return BLOCKCHAIN_NAME.POLYGON
    if (id === "bsc")
        return BLOCKCHAIN_NAME.BINANCE_SMART_CHAIN
}