import { Copyright } from "lucide-react"
import { Separator } from "../ui/separator"
import { getSocialIcons } from "../../lib/helper"

import general from "../../data/lang/en/general.json"

const terms = general["terms"]
const socials = general["socials"]
const development = general["development"]

export default function WebFooter() {
	return (
        <div className={`px-4`}>
            <Separator className={`h-[2px] mt-4 gradient-line`} />
            <footer className={`gradient-footer rounded-md mb-4 py-2 px-4`}>
                <section className={`grid grid-cols-[1fr_auto] items-center m-2`}>
                    <div className={`flex-row gap-1 items-center justify-center lg:flex lg:justify-start`}>
                        <div className={`flex gap-1 items-center justify-center`}>
                            <Copyright className={`w-4 h-4 opacity-65`} />
                            <span className={`opacity-65`}>
                                {`${development.development_year} ${general.project_name} — ${terms.copyright}`}
                            </span>
                        </div>
                    </div>
                    <div className={`flex gap-3`}>
                        {socials.map((item, index) => (
                            <a key={`social-${index}`} className={`p-[6px] rounded-full bg-[#1C62EFFF] text-foreground border-[1px] border-transparent hover:border-foreground hover:scale-110`} href={item.link} target="_blank">
                                {getSocialIcons(item.id, `w-4 h-4`)}
                            </a>
                        ))}
                    </div>
                </section>
            </footer>
        </div>
    )
}