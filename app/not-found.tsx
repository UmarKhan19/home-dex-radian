import { NotFoundView } from "../components/view/error"

import WebLayout from "../components/layout/web"
 
export default function NotFound() {
    return (
		<WebLayout>
			<NotFoundView />
		</WebLayout>
    )
}