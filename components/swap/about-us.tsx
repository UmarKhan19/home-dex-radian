import React from "react";

export const About = () => {
	return (
		<div className="flex  items-center w-full py-24">
			<div className=" text-center">
				<h1 className="text-4xl font-semibold mb-6 font-avenixel">About Us</h1>
				<p className="md:w-[80%] lg:w-[65%] px-4 md:px-20 lg:px-36 text-sm text-left mt-8 font-avenixel text-white">
					<span className="gradient-underline">DEX Raiden</span> is a pioneering
					decentralized platform revolutionizing payments by offering efficient,
					transparent, and accessible digital asset exchange. Our system eliminates
					intermediaries, reducing costs and bridging traditional finance with
					decentralized technology.
					<br />
					<br />
					Users benefit from swift, secure transactions, enhanced privacy, and global
					accessibility. We prioritize user empowerment, ensuring asset security
					through blockchain technology and adhering to Web 3.0 principles of
					interoperability and{" "}
					<span className="gradient-underline">decentralized governance.</span>
				</p>
			</div>
		</div>
	);
};
