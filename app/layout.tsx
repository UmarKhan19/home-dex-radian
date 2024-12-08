import { cookieToInitialState } from "wagmi"
import { ReactNode } from "react"
import { headers } from "next/headers"
import { Toaster } from "../components/ui/sonner"
import { ThemeProvider } from "../components/theme-provider"
import { config } from "../config"

import Web3ModalProvider from "../context"

import "./globals.css"

export default function RootLayout({
	children,
}: {
	children: ReactNode
}) {
	const initialState = cookieToInitialState(config, headers().get("cookie"))

	return (
		<html lang="en" suppressHydrationWarning>
			<head />
			<body>
				<ThemeProvider
					attribute="class"
					defaultTheme="dark"
					enableSystem
					disableTransitionOnChange
				>
					<Web3ModalProvider initialState={initialState}>
						{children}
					</Web3ModalProvider>
				</ThemeProvider>
				<Toaster />
			</body>
		</html>	  
	)
}