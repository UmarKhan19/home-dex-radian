"use client"

import { useState } from "react"
import { Pencil } from "lucide-react"
import { Dialog, DialogContent, DialogClose, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Input } from "../ui/input"
import { ButtonBase } from "../button"

import general from "../../data/lang/en/general.json"

const terms = general["terms"]

export default function SwapSlippage({
    updateSlippage
}) {
    const [percentage, setPercentage] = useState("0.5")

    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className={`group cursor-pointer w-full grid grid-cols-2 gap-2 px-4 my-2 text-xs`}>
                    <div className="w-full flex justify-start gap-1 items-center">
                        {`${terms.slippage}`}
                        <Pencil className={`w-3 h-3 group-hover:scale-125 group-hover:text-primary`} />
                    </div>
                    <div className={`w-full opacity-80 text-right text-foreground justify-end items-center flex gap-2`}>
                        {`${percentage} %`}
                    </div>
                </div>
            </DialogTrigger>
            <DialogContent className={`box-glow border-[1px] border-primary gradient-swap py-6 rounded-2xl min-w-full max-w-[450px] lg:min-w-[400px]`}>
                <DialogHeader className={`text-center mx-auto items-center justify-center`}>
                    <DialogTitle className={`font-avenixel text-4xl text-gradient`}>
                        {`${terms.enter_slippage}`}
                    </DialogTitle>
                    <DialogDescription>
                        {`${terms.slippage_description}`}
                    </DialogDescription>
                </DialogHeader>
                <div className={`my-2 grid gap-4`}>
                    <div className={`p-[1px] gradient-border rounded-md`}>
                        <Input
                            type="number"
                            placeholder={terms.enter_slippage}
                            value={percentage}
                            min={0.05}
                            max={49.00}
                            onChange={(e) => setPercentage(e.target.value.toString())}
                            className={`rounded-md gradient-background font-bold border-none text-sm`}
                        />
                    </div>
                    <DialogClose className={`w-fit mx-auto`}>
                        <ButtonBase
                            title={(
                                <div className={`flex gap-2 items-center`}>
                                    {`${terms.update_slippage}`}
                                </div>
                            )}
                            borderClass={`button-shape gradient-border rounded-[6px] p-[2px] -my-[2px] mx-auto`}
                            buttonClass={`gradient-button-primary button-shape`}                            
                            onClick={() => updateSlippage((Number(percentage) / Number(100)).toString())}
                        />
                    </DialogClose>
                </div>
                {/* <DialogFooter>
                    
                </DialogFooter> */}
            </DialogContent>
        </Dialog>
    )
}