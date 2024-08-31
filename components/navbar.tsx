"use client";
import React from "react";
import Link from "next/link";
import { useAccount } from "wagmi";
import Image from "next/image";

const links = ["clubs", "events", "bridge", "fun"];

export default function Navbar() {
	const { address, isConnected } = useAccount();

	return (
		<div className="flex items-center justify-between py-4 border-2 border-primaryColor rounded-full px-6 mt-4">
			<Link
				href="/"
				className={`text-2xl font-bold flex items-center gap-x-3 text-secondaryColor`}
			>
				<Image
					src="/logo.svg"
					alt="logo"
					width={100}
					height={100}
					className="w-5"
				/>
				ChilizNexus
			</Link>
			<div
				className={`hidden md:flex gap-10 text-lg font-medium tracking-wide`}
			>
				{isConnected && (
					<>
						{links.map((link) => (
							<Link
								key={link}
								href={`/${link.toLowerCase()}`}
								className="capitalize"
							>
								{link}
							</Link>
						))}
					</>
				)}
			</div>
			<w3m-button balance="hide" />
		</div>
	);
}
