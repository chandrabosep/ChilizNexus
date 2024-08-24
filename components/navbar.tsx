"use client";
import React from "react";
import Link from "next/link";
import { useAccount } from "wagmi";
import Image from "next/image";

const links = ["clubs", "events", "bridge"];

export default function Navbar() {
	const { address, isConnected } = useAccount();
	const adminAddresses = [
		"0x02C8345B2DF9Ff6122b0bE7B79cB219d956bd701",
		"0x709d29dc073F42feF70B6aa751A8D186425b2750",
		"0xA9ab8933Ff0467D51d13ea2bFECD81504Fc6f15a",
	];

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

				{isConnected && (
					<>
						{adminAddresses
							.map((addr: any) => addr.toLowerCase())
							.includes(address?.toLowerCase()) && (
							<Link href="/admin" className="">
								Admin
							</Link>
						)}
					</>
				)}
			</div>
			<w3m-button balance="hide" />
		</div>
	);
}
