import { ReactNode } from "react"
import { ScrollArea } from "../ui/scroll-area"

import WebHeader from "../header/web"
import WebFooter from "../footer/web"

export default function WebLayout({
	children,
}: {
	children: ReactNode
}) {
	return (
        <div>
            <div className={`bg-no-repeat bg-cover opacity-30 h-screen w-screen fixed bg-blurred`} />
            <div className={`bg-no-repeat bg-cover opacity-15 h-screen w-screen fixed bg-top lg:bg-left-top bg-ronin`} />
            <main className={`grid grid-rows-[auto_1fr_auto] min-h-screen min-w-screen`}>
                <WebHeader />
                <ScrollArea className={`px-10 py-6`}>
                    {children}
                </ScrollArea>
                <WebFooter />
            </main>
        </div>
    )
}