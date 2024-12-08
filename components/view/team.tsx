/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { CardBase } from "../card";
const home = {
	cards: [
		{
			button: "LinkedIn",
			image: "/assets/images/team/CEO.png",
			link: "https://www.linkedin.com/",
			position: "CEO - DEX Raiden",
			name: "Fábio Cavagnoli",
		},
		{
			button: "LinkedIn",
			image: "/assets/images/team/CTO.png",
			link: "https://www.linkedin.com/",
			position: "CTO - DEX Raiden",
			name: "Walter Aragão",
		},
		{
			button: "LinkedIn",
			position: "CMO - DEX Raiden",
			link: "https://www.linkedin.com/",
			image: "/assets/images/team/CMO.png",
			name: "Lucas Silva",
		},
	],
};
const cards = home["cards"];

const Team = () => {
	const router = useRouter();
	return (
		<div className="flex flex-col justify-center gap-6 px-4 items-center w-full">
			<div className="lg:w-[60%] md:w-[70%]   text-center">
				<h1
					className="text-4xl font-semibold !font-avenixel mb-6"
					style={{ fontSize: "63.18px" }}
				>
					Team
				</h1>
				<p
					className="px-4 md:px-20 lg:px-36 text-sm text-left font-avenixel  text-white"
					style={{ fontSize: "23.18px" }}
				>
					For <span className="gradient-underline font-nunito">success</span>,
					everything comes down to a focused team with market knowledge, get to know{" "}
					<span className="gradient-underline">our team!</span>
				</p>
			</div>
			<div className="grid gap-8 grid-cols-1 md:grid-cols-3 lg:grid-cols-3 ">
				{cards.map((item, index) => (
					<CardBase
						key={`card-${index}`}
						content={cardProcessor(item)}
						onClick={() => item.link && router.push(item.link)}
						button={item.button}
					/>
				))}
			</div>
		</div>
	);
};

export default Team;
function cardProcessor(item: {
	position?: any;
	name?: string;
	image?: string;
}) {
	return (
		<div className="w-[12rem] h-[17rem] rounded-lg">
			<img
				src={item.image}
				alt="Team"
				className=" w-[120%]"
			></img>
			<div className=" gradient-border  text-center py-2 px-2">
				<p className="text-white font-semibold text-sm">{item.position}</p>
				<p className="text-white  text-sm">{item.name}</p>
			</div>
		</div>
	);
}
