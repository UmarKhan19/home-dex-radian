"use client"

import { useWeb3Modal } from "@web3modal/wagmi/react"
import { useAccount } from "wagmi"
import { usePathname, useRouter } from "next/navigation"
import { Menu, Wallet, X } from "lucide-react"
import { ButtonDouble } from "../button"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet"

import general from "../../data/lang/en/general.json"

const terms = general["terms"]
const header = general["menu"]["header"]

export function WebNavigation() {
	const router = useRouter()
	const pathname = usePathname()

	const { isConnected } = useAccount()
	const { open } = useWeb3Modal()

	return (
		<div className={`flex gap-3 items-center w-fit cursor-pointer visible lg:hidden`}>
			<Sheet>
				<SheetTrigger asChild>
                    <Menu className={`min-h-10 min-w-10 hover:scale-105`} />
				</SheetTrigger>
				<SheetContent side={`top`} className={`min-h-[100vh] gradient-header items-center`}>
					<SheetHeader>
						<SheetTitle>
							<div className={`flex gap-3 items-center w-fit mx-auto`}>
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
					<div className="grid gap-4 py-4 mx-auto w-fit">
						{header.map((item, index) => (
							item.type === "internal" ? (
								<p
									onClick={() => router.push(item.link)}
									key={`header-item-${index}`}
									className={`${pathname === item.link ? "font-bold opacity-100 underline" : "opacity-60"} justify-center text-center text-2xl flex items-center gap-3 my-4 cursor-pointer hover:font-bold hover:opacity-100 hover:underline decoration-2 underline-offset-4`}
								>
									{`${item.title}`}
								</p>
							) : (
								item.type === "external" ?  (
									<a
										href={`${item.link}`}
										target="_blank"
										key={`header-item-${index}`}
										className={`${pathname === item.link ? "font-bold opacity-100 underline" : "opacity-60"} justify-center text-center text-2xl flex items-center gap-3 my-4 cursor-pointer hover:font-bold hover:opacity-100 hover:underline decoration-2 underline-offset-4`}
									>
										{`${item.title}`}
									</a>
								) : (
									null
								)
							)
						))}
						 <ButtonDouble
          title1={
            <div className={`flex items-center`}>
              <img
                className={`icon-mask max-w-4 mr-2 max-h-4 mt-1`}
                src={`/images/home/icon.png`}
              />
              {`${terms.buy} ${terms.dxr}`}
            </div>
          }
          onClick1={() => {}}
          borderClass1={`p-0`}
          title2={
            <a
              href="https://raiden-dex.vercel.app/?chain=ethereum"
              target="_blank"
              className={`flex text-[#1e1b1b] font-[500] items-center`}
            >
              <img
                src={`/images/home/icon.png`}
                alt={general.project_name}
                className="w-4 h-4 mr-2"
              />
              {`Launch App`}
            </a>
          }
          onClick2={() => router.push("https://raiden-dex.vercel.app/")}
          borderClass2={`button-shape gradient-border rounded-[6px] p-[2px] -my-[2px] -mr-[2px]`}
          borderClassMain={`hidden lg:flex gradient-border button-shape p-[2px] rounded-[6px] w-fit`}
          buttonClassMain={`flex button-shape  gradient-background`}
        />
					</div>
				</SheetContent>
			</Sheet>
        </div>
	)
}
