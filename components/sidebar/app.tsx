"use client"

import { usePathname, useRouter } from "next/navigation"
import { Separator } from "../ui/separator"
import { getSidebarIcons } from "../../lib/helper"

import general from "../../data/lang/en/general.json"

const sidebar = general["menu"]["sidebar"]

export default function AppSidebar() {
    const router = useRouter()
    const pathname = usePathname()

	return (
        <aside className={`p-4 min-w-[150px] h-[100%] rounded-lg gradient-sidebar`}>
            <div
                className={`py-1 cursor-pointer`}
                onClick={() => router.push(`/app`)}
            >
                    <img
                        src={`/assets/images/dexraiden.png`}
                        alt={general.project_name}
                        className={`max-h-[30px] hover:scale-105 cursor-pointer`}
                    />
            </div>
            <Separator className={`h-[2px] my-4 gradient-line`} />
            {sidebar.map((item, index) => (
                item.type === "internal" ? (
                    <p
                        onClick={() => router.push(item.link)}
                        key={`sidebar-item-${index}`}
                        className={`${pathname === item.link ? "font-bold opacity-100" : "opacity-60"} flex items-center gap-3 my-6 cursor-pointer hover:font-bold hover:opacity-100`}
                    >
                        {getSidebarIcons(item.id, `max-w-6 max-h-6 -mt-1`)}
                        {`${item.title}`}
                    </p>
                ) : (
                    item.type === "internal" ?  (
                        <a
                            href={`${item.link}`}
                            target="_blank"
                            key={`sidebar-item-${index}`}
                            className={`${pathname === item.link ? "font-bold opacity-100" : "opacity-60"} my-2 cursor-pointer hover:font-bold hover:opacity-100`}
                        >
                            {`${item.title}`}
                        </a>
                    ) : (
                        null
                    )
                )
            ))}
        </aside>
    )
}