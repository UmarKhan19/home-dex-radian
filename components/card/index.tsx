import { Button } from "../ui/button"

export function CardBase({
    content,
    button,
    onClick,
    disabled,
    borderClass,
    cardClass,
    contentClass,
    buttonClass
} : {
    content?: any
    button?: any
    onClick?: any
    disabled?: boolean
    borderClass?: string
    cardClass?: string
    contentClass?: string
    buttonClass?: string
}) {
	return (
        <div className={`card-shape rounded-lg gradient-border p-[2px] ${borderClass}`}>
            <div className={`gradient-background-glass card-shape rounded-lg h-full grid grid-rows-[1fr_auto] ${cardClass}`}>
                <div className={`p-4 ${contentClass}`}>
                    {content}
                </div>
                <Button variant="ghost" onClick={onClick} className={`w-full rounded-b-lg gradient-button-primary px-4 py-2 ${buttonClass}`} disabled={disabled}>
                    {button}
                </Button>
            </div>
        </div>
    )
}