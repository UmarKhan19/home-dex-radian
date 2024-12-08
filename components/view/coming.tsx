"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { ButtonBase } from "../button"
import { Separator } from "../ui/separator"

import general from "../../data/lang/en/general.json"

const terms = general["terms"]

export default function ComingSoon() {
    const router = useRouter()

    return (
        <section className={`flex text-center justify-center items-center min-h-[60vh]`}>
            <div className={`m-auto`}>
                <h1 className={`font-avenixel text-headline`}>
                    {`${terms.coming_soon}`}
                </h1>
                <Separator className={`h-[2px] mb-8 gradient-line`} />
                <p className={``}>
                    {`${terms.under_development}`}
                </p>
                <div className={`mx-auto justify-center items-center w-fit mt-8`}>
                    <ButtonBase
                        title={(
                            <div className={`flex gap-2 items-center`}>
                                <ArrowLeft className={`w-4 h-4`} />
                                {`${terms.go_back}`}
                            </div>
                        )}
                        onClick={() => router.back()}
                        borderClass={`button-shape gradient-border rounded-[6px] p-[3px] -my-[3px] -mr-[3px]`}
                        buttonClass={`gradient-button-primary button-shape`}
                    />
                </div>
            </div>
        </section>
    )
}