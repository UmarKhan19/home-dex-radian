import SwapModule from "../swap"

import general from "../../data/lang/en/general.json"

const terms = general["terms"]

export default function Swap() {
    return (
        <section className={`flex justify-center items-center min-h-[60vh] p-2 pt-10`}>
            <SwapModule />
        </section>
    )
}