"use client"

import { Play } from "lucide-react"
import { Dialog, DialogContent, DialogClose, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"

import general from "../../data/lang/en/general.json"
import whitelist from "../../data/whitelist.json"

const terms = general["terms"]
const networks = whitelist["network"]

export default function BridgeNetworkSeletor({
    networkIcon,
    networkName,
    updateNetworkInfo
}) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className={`cursor-pointer hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 p-0`}>
                    <div className={`flex gap-2 items-center w-fit`}>
                        <img src={`${networkIcon}`} alt={`${networkName}`} className={`max-w-6 max-h-6`} />
                        <div className={`flex-row gap-2`}>
                            <span className={`text-xs`}>
                                {`Network`}
                            </span>
                            <span className={`flex gap-1 items-center font-bold`}>
                                {`${networkName}`}
                                <Play className={`w-2 h-2 rotate-90`} />
                            </span>
                        </div>
                    </div>
                </div>
            </DialogTrigger>
            <DialogContent className={`box-glow border-[1px] border-primary gradient-swap py-6 rounded-2xl min-w-full max-w-[450px] lg:min-w-[400px]`}>
                <DialogHeader className={`text-center mx-auto items-center justify-center`}>
                    <DialogTitle className={`font-avenixel text-4xl text-gradient`}>
                        {`${terms.select_token}`}
                    </DialogTitle>
                    <DialogDescription>
                        
                    </DialogDescription>
                </DialogHeader>
                <div className={`my-2 grid gap-4`}>
                    <div className={`font-bold text-xs`}>
                        {`${terms.network_list}`}
                        <div className={`py-2 flex-row gap-2 w-full`}>
                            {Object.keys(networks).length > 0 ? (
                                Object.keys(networks).map((net, idx) => (
                                    <DialogClose key={`item-${idx}`} className={`w-full p-2`}>
                                        <div
                                            key={`token-${idx}`}
                                            className={`grid grid-cols-[auto_1fr] gap-4 items-center`}
                                            onClick={() => updateNetworkInfo(net, networks[net].name, networks[net].icon)}
                                        >
                                            <img key={`token-icon-${idx}`} src={`${networks[net].icon}`} alt={`${networks[net].name}`} className={`w-8 h-8`} />
                                            <div key={`token-info-${idx}`} className={`grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 items-center`}>
                                                <div key={`token-meta-${idx}`} className={`text-left justify-start grid grid-cols-1`}>
                                                    <div key={`token-symbol-${idx}`} className={`font-bold text-xl`}>
                                                        {`${networks[net]["nativeCurrency"].symbol}`}
                                                    </div>
                                                    <div key={`token-name-${idx}`} className={`font-normal opacity-80 text-sm`}>
                                                        {`${networks[net].name}`}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </DialogClose>                                    
                                ))
                            ) : (
                                <div className={`text-center w-fit mx-auto`}>
                                    {`${terms.network_not_found}`}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}