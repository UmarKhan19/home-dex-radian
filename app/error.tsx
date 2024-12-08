"use client"

import { ErrorView } from "../components/view/error"

import WebLayout from "../components/layout/web"
 
export default function Error({
    error,
    reset,
} : {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
		<WebLayout>
			<ErrorView
                error={error}
                reset={reset}
            />
		</WebLayout>
    )
}