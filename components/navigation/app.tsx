"use client"

import { usePathname, useRouter } from "next/navigation"
import { Menu, X } from "lucide-react"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet"
import { getSidebarIcons } from "../../lib/helper"

import general from "../../data/lang/en/general.json"

const terms = general["terms"]
const sidebar = general["menu"]["sidebar"]

export function AppNavigation() {
	const router = useRouter()
	const pathname = usePathname()

	return (
		<div className={`flex gap-3 items-center w-fit cursor-pointer visible lg:hidden`}>
			<Sheet>
				<SheetTrigger asChild>
                    <Menu className={`min-h-10 min-w-10 hover:scale-105`} />
				</SheetTrigger>
				<SheetContent side={`left`} className={`w-300px max-w-[60vw] gradient-background`}>
					<SheetHeader>
						<SheetTitle>
							<div className={`flex gap-3 items-center`}>
								<SheetClose>
									<X className={`min-h-10 min-w-10 hover:scale-105`} />
								</SheetClose>
								<img
									src={`/assets/images/dexraiden.png`}
									alt={`${general.project_name}`}
									className={`max-h-6 hover:scale-105`}
									onClick={() => router.push(`/app/`)}
								/>
							</div>
						</SheetTitle>
						<SheetDescription>
							
						</SheetDescription>
					</SheetHeader>
					<div className="grid gap-4 py-4">
						<p
							onClick={() => router.push("/")}
							className={`${pathname === "/" ? "font-bold opacity-100" : "opacity-60"} flex items-center gap-3 my-4 cursor-pointer hover:font-bold hover:opacity-100`}
						>
							{getSidebarIcons("home", `max-w-6 max-h-6 -mt-1`)}
							{`${terms.home}`}
						</p>
						{sidebar.map((item, index) => (
							item.type === "internal" ? (
								<p
									onClick={() => router.push(item.link)}
									key={`sidebar-item-${index}`}
									className={`${pathname === item.link ? "font-bold opacity-100" : "opacity-60"} flex items-center gap-3 my-4 cursor-pointer hover:font-bold hover:opacity-100`}
								>
									{getSidebarIcons(item.id, `max-w-6 max-h-6 -mt-1`)}
									{`${item.title}`}
								</p>
							) : (
								item.type === "external" ?  (
									<a
										href={`${item.link}`}
										target="_blank"
										key={`sidebar-item-${index}`}
										className={`${pathname === item.link ? "font-bold opacity-100" : "opacity-60"} flex items-center gap-3 my-4 cursor-pointer hover:font-bold hover:opacity-100`}
									>
										{getSidebarIcons(item.id, `max-w-6 max-h-6 -mt-1`)}
										{`${item.title}`}
									</a>
								) : (
									null
								)
							)
						))}
					</div>
				</SheetContent>
			</Sheet>
            <img
				src={`/assets/images/dexraiden.png`}
				alt={`${general.project_name}`}
				className={`hidden md:block max-h-6 hover:scale-105`}
				onClick={() => router.push(`/app/`)}
			/>
            <img
				src={`/assets/images/icon.png`}
				alt={`${general.project_name}`}
				className={`block md:hidden max-h-6 hover:scale-105`}
				onClick={() => router.push(`/app/`)}
			/>
        </div>
	)
}
