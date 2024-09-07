"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeftRightIcon, Terminal } from "lucide-react";
import React, { useState } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { BAR, JUV, PSG } from "@/utils/constants";
import Balance from "@/components/Balance";
import Link from "next/link";

export default function Vault() {
	const [fromAmount, setFromAmount] = useState("");

	return (
		<div className="flex flex-col pt-20 gap-y-16 w-full h-full max-w-screen-2xl">
			<div className="flex flex-col gap-y-2 items-center justify-between">
				<h2
					className={`text-2xl text-secondaryColor font-semibold mx-auto`}
				>
					{`Deposit Fan Token (CAP20) and Get Rewarded in Nexus Token (CAP223)`}
				</h2>
				<p className="text-muted-foreground font-medium text-sm">
					Nexus tokens are interoperable utility token for secure transfer
					and in future it is pegged to 1$ using chiliz & basket of fan tokens.
				</p>
			</div>
			<Balance />
			<div className="max-w-lg w-full mx-auto flex flex-col gap-y-4">
				<div className="flex items-center mt-auto gap-x-2 w-full">
					<div className="flex flex-col gap-y-2 w-full">
						<Label htmlFor="from" className="font-medium">
							FAN TOKEN
						</Label>
						<Input
							id="from"
							placeholder="0.0"
							value={fromAmount}
							onChange={(e) => setFromAmount(e.target.value)}
						/>
					</div>
					<Select
						// @ts-ignore
						onValueChange={(value) => setFromToken(value)}
						defaultValue={BAR}
					>
						<SelectTrigger className="w-fit mt-6">
							<SelectValue />
						</SelectTrigger>
						<SelectContent className="w-fit">
							<SelectItem value={BAR}>BAR</SelectItem>
							<SelectItem value={JUV}>JUV</SelectItem>
							<SelectItem value={PSG}>PSG</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div className="flex w-full gap-x-4">
					<Button className="w-full bg-primaryColor hover:bg-primaryColor/90">
						Stake
					</Button>
				</div>
			</div>
			<div className="max-w-4xl w-full mx-auto  flex flex-col gap-y-4">
				<div className="grid grid-cols-5 w-full divide-x-2">
					{[
						{ fan: 1, nexus: 0.016 },
						{ fan: 10, nexus: 0.16 },
						{ fan: 50, nexus: 0.8 },
						{ fan: 100, nexus: 1.6 },
						{ fan: 500, nexus: 8.0 },
					].map(({ fan, nexus }) => (
						<div
							key={fan}
							className="flex flex-col gap-y-2 w-full text-center text-lg"
						>
							<p className="text-secondaryColor font-semibold text-center">
								{`${fan} FT = ${nexus} NT`}
							</p>
						</div>
					))}
				</div>
                <p className="text- font-semibold text-lg mx-auto">{`( FT = Fan Token, NT = Nexus Token )`}</p>
			</div>
			<div className="w-full flex flex-col gap-y-8">
				<h2 className="text-3xl text-secondaryColor font-semibold mx-auto">
					Get FAN Tokens for testing
				</h2>
				<div className="flex gap-4 items-center justify-center w-full">
					{[
						{
							title: "BAR",
							link: "https://testnet.chiliscan.com/address/0xE2E39B1A5eFe07743F9E0E8408F1B7aAB6B7f832/contract/88882/writeContract",
						},
						{
							title: "JUV",
							link: "https://testnet.chiliscan.com/address/0xA4e42B23B86DF349c91a5F87701C4c575b58DBD5/contract/88882/writeContract",
						},
						{
							title: "PSG",
							link: "https://testnet.chiliscan.com/address/0x5E36A22751f56aECE9A970beac728De684E7Bd1E/contract/88882/writeContract",
						},
					].map(({ title, link }) => (
						<Link
							key={title}
							href={link}
							target="_blank"
							className="text-lg p-2 bg-primaryColor text-white px-8 rounded-lg flex"
						>
							{title}
						</Link>
					))}
				</div>
			</div>
		</div>
	);
}
