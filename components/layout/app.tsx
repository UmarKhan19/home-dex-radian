import { ReactNode } from "react"
import { ScrollArea } from "../ui/scroll-area"

import AppHeader from "../header/app"
import AppSidebar from "../sidebar/app"
import AppFooter from "../footer/app"

export default function AppLayout({
	children,
}: {
	children: ReactNode
}) {
	return (
        <div>
            <div className={`bg-no-repeat bg-cover opacity-30 h-screen w-screen fixed bg-blurred`} />
            <div className={`bg-no-repeat bg-cover opacity-15 h-screen w-screen fixed bg-top lg:bg-left-top bg-ronin`} />
            <main className={`grid grid-cols-1 lg:grid-cols-[auto_1fr] min-h-screen min-w-screen`}>
                <section className={`py-4 pl-4 min-h-screen hidden lg:block`}>
                    <AppSidebar />
                </section>
                <section className={`px-4 grid grid-rows-[auto_1fr_auto] min-h-screen lg:max-h-screen`}>
                    <AppHeader />
                    <ScrollArea className={`px-4`}>
                        {children}
                    </ScrollArea>
                    <AppFooter />
                </section>
            </main>
        </div>
    )
}