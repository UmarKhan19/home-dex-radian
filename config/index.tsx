import { defaultWagmiConfig } from "@web3modal/wagmi/react/config"
import { bsc, mainnet, polygon } from "wagmi/chains"

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID

if (!projectId) throw new Error("Project ID is not defined")

const metadata = {
	name: "DexRaiden",
	description: "DexRaiden",
	url: "https://web3modal.com",
	icons: [
		"https://avatars.githubusercontent.com/u/37784886"
	]
}

const chains = [mainnet, polygon, bsc] as const

export const config = defaultWagmiConfig({
	chains,
	projectId,
	metadata,
	ssr: true,
	// storage: createStorage({
	// 	storage: cookieStorage
	// }),
})