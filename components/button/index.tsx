import { Button } from "../ui/button"

export function ButtonBase({
    title,
    onClick,
    disabled,
    borderClass,
    buttonClass
} : {
    title: any
    onClick?: any
    disabled?: boolean
    borderClass?: string
    buttonClass?: string
}) {
	return (
        <div className={`w-fit ${borderClass}`} onClick={onClick}>
            <Button variant="ghost" className={`${buttonClass}`} disabled={disabled}>
                {title}
            </Button>
        </div>
    )
}

export function ButtonDouble({
    title1,
    onClick1,
    disabled1,
    borderClass1,
    buttonClass1,
    title2,
    onClick2,
    disabled2,
    borderClass2,
    buttonClass2,
    borderClassMain,
    buttonClassMain
} : {
    title1: any
    onClick1?: any
    disabled1?: boolean
    borderClass1?: string
    buttonClass1?: string
    title2: any
    onClick2?: any
    disabled2?: boolean
    borderClass2?: string
    buttonClass2?: string
    borderClassMain?: string
    buttonClassMain?: string
}) {
	return (
        <div className={borderClassMain}>
            <div className={buttonClassMain}>
                <ButtonBase
                    title={title1}
                    onClick={onClick1}
                    disabled={disabled1}
                    borderClass={borderClass1}
                    buttonClass={buttonClass1}
                />
                <ButtonBase
                    title={title2}
                    onClick={onClick2}
                    disabled={disabled2}
                    borderClass={borderClass2}
                    buttonClass={buttonClass2}
                />
            </div>
        </div>
    )
}

