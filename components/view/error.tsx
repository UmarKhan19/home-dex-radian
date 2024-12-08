"use client"

import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { ButtonBase } from "../button"
import { Separator } from "../ui/separator"

import general from "../../data/lang/en/general.json"

const terms = general["terms"]

export function ErrorView({
    error,
    reset,
} : {
    error: Error & { digest?: string }
    reset: () => void
}) {
    console.log(error)
    
    return (
        <section className={`flex text-center justify-center items-center min-h-[60vh]`}>
            <div className={`m-auto`}>
                <h1 className={`font-avenixel text-headline`}>
                    {`${terms.error} ${terms.found}`}
                </h1>
                <Separator className={`h-[2px] mb-8 gradient-line`} />
                <p className={``}>
                    {`${terms.something_wrong}`}
                </p>
                <div className={`mx-auto justify-center items-center w-fit mt-8`}>
                    <ButtonBase
                        title={(
                            <div className={`flex gap-2 items-center`}>
                                <ArrowLeft className={`w-4 h-4`} />
                                {`${terms.try_again}`}
                            </div>
                        )}
                        onClick = {() => reset()}        
                        borderClass={`button-shape gradient-border rounded-[6px] p-[3px] -my-[3px] -mr-[3px]`}
                        buttonClass={`gradient-button-primary button-shape`}
                    />
                </div>
            </div>
        </section>
    )
}

export function NotFoundView() {
    const router = useRouter()

    return (
        <section className={`flex text-center justify-center items-center min-h-[60vh]`}>
            <div className={`m-auto`}>
                <h1 className={`font-avenixel text-headline`}>
                    {`${terms.not_found}`}
                </h1>
                <Separator className={`h-[2px] mb-8 gradient-line`} />
                <p className={``}>
                    {`${terms.missing_resource}`}
                </p>
                <div className={`mx-auto justify-center items-center w-fit mt-8`}>
                    <ButtonBase
                        title={(
                            <div className={`flex gap-2 items-center`}>
                                <ArrowLeft className={`w-4 h-4`} />
                                {`${terms.go_back}`}
                            </div>
                        )}
                        onClick = {() => router.back()}        
                        borderClass={`button-shape gradient-border rounded-[6px] p-[3px] -my-[3px] -mr-[3px]`}
                        buttonClass={`gradient-button-primary button-shape`}
                    />
                </div>
            </div>
        </section>
    )
}