import BridgeModule from "../bridge"

import general from "../../data/lang/en/general.json"

const terms = general["terms"]

export default function Bridge() {
    return (
        <section className={`flex justify-center items-center min-h-[60vh] p-2 pt-10`}>
            <BridgeModule />
        </section>
    )
}