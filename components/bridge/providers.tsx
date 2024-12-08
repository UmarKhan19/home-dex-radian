"use client"

import { Dialog, DialogContent, DialogClose, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion"
import { ButtonBase } from "../button"

import BridgeInfo from "./info"

import general from "../../data/lang/en/general.json"

const terms = general["terms"]

export default function BridgeProviders({
    swapping,
    providers,
    gasSymbol
}) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div
                    className={`flex gap-1 justify-center text-xs text-center cursor-pointer`}
                >
                    {`${terms.other_providers}?`}
                </div>
            </DialogTrigger>
            <DialogContent className={`box-glow border-[1px] border-primary gradient-swap py-6 rounded-2xl min-w-full max-w-[450px] lg:min-w-[400px]`}>
                <DialogHeader className={`text-center mx-auto items-center justify-center`}>
                    <DialogTitle className={`font-avenixel text-4xl text-gradient`}>
                        {`${terms.other_providers}`}
                    </DialogTitle>
                    <DialogDescription>
                        {`${terms.other_providers_description}`}
                    </DialogDescription>
                </DialogHeader>
                <div className={`my-2 grid gap-4`}>
                    <Accordion type="single" collapsible className="w-full">
                        {providers.slice(1).map((item, index) => (
                            <AccordionItem value={`provider-${index}`} key={`item-${index}`}>
                                <AccordionTrigger key={`trigger-${index}`}>
                                    {item.tradeType}
                                </AccordionTrigger>
                                <AccordionContent className={`grid gap-4`} key={`content-${index}`}>
                                    <BridgeInfo
                                        providerInfo={item}
                                        key={`info-${index}`}
                                        gasSymbol={gasSymbol}
                                    />
                                    <DialogClose className={`w-full`} key={`close-${index}`}>
                                        <ButtonBase
                                            key={`button-${index}`}
                                            title={(
                                                <div className={`flex gap-2 items-center`}>
                                                    {`${terms.swap}`}
                                                </div>
                                            )}
                                            borderClass={`button-shape gradient-border rounded-[6px] p-[2px] -my-[2px] mx-auto`}
                                            buttonClass={`gradient-button-primary button-shape`}                            
                                            onClick={() => swapping(item)}
                                        />
                                    </DialogClose>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
                {/* <DialogFooter>
                    
                </DialogFooter> */}
            </DialogContent>
        </Dialog>
    )
}