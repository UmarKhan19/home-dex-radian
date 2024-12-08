import { ReactNode } from "react"

import AppLayout from "../../components/layout/app"

import general from "../../data/lang/en/general.json"

const site_url = process.env.SITE_URL

export async function generateMetadata() {
    return {
        metadataBase: new URL(`${site_url}`),
        title: {
            template: `%s | ${general.project_name}`,
            default: general.project_name,
        },
        description: general.project_description,
        alternates: {
            canonical: `${site_url}`,
        },
        other: {
            tech_support: "Zack <zack@revoluzion.io> (https://revoluzion.io)",
			developer: "Nizar Syahmi bin Nazlan <nizarsyahmi37@revoluzion.io> (https://nizarsyahmi37.com/)",
			support: "Revoluzion <support@revoluzion.io> (https://revoluzion.io/)",		
        }
    }
}

export default function RootLayout({
	children,
}: {
	children: ReactNode
}) {
	return (
		<AppLayout>
			{children}
		</AppLayout>
	)
}