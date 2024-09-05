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
import { useWriteContract, useAccount } from "wagmi";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import { BAR, JUV, NexusToken, PSG } from "@/utils/constants";
import { NexusTokenAbi } from "@/contracts/NexusToken";
import { FanTokenAbi } from "@/contracts/FanToken";
import Balance from "@/components/Balance";
import Link from "next/link";

export default function Bridge() {
	const [fromAmount, setFromAmount] = useState("");
	const [fromToken, setFromToken] = useState(BAR);
	const [showDialog, setShowDialog] = useState(false);
	const { writeContract, isSuccess, error } = useWriteContract();

	const handleConvertClick = async () => {
		setShowDialog(true);
	};

	const mint = async () => {
		try {
			console.log("mint");
			writeContract({
				abi: NexusTokenAbi.abi,
				address: NexusTokenAbi.address as `0x${string}`,
				functionName: "mintToken",
				args: [fromToken, fromAmount],
			});
		} catch (error) {
			console.error("Minting failed:", error);
		}
	};

	const handleConfirm = async () => {
		try {
			writeContract({
				abi: FanTokenAbi,
				address: (fromToken as `0x${string}`) || BAR,
				functionName: "approve",
				args: [NexusToken, fromAmount],
			});

			console.log(isSuccess && "approval success");
			isSuccess && (await mint());
		} catch (error) {
			console.error("Approval or minting failed:", error);
		} finally {
			setShowDialog(false);
		}
	};

	const handleRedeem = () => {
		writeContract({
			abi: NexusTokenAbi.abi,
			address: NexusTokenAbi.address as `0x${string}`,
			functionName: "redeemToken",
			args: [fromToken, fromAmount],
		});
	};

	const handleCancel = () => {
		setShowDialog(false);
	};

	return (
		<div className="flex flex-col py-20 gap-y-16 w-full h-full max-w-screen-2xl">
			<div className="flex flex-col gap-y-2 items-center justify-between">
				<h2
					className={`text-3xl text-secondaryColor font-semibold mx-auto`}
				>
					{`Bridge any fan tokens(CAP20) to Nexus tokens(CAP223)`}
				</h2>
				<p className="text-muted-foreground font-medium text-sm">
					CAP223 tokens are interoperable mint from supported fan
					tokens and in future it is pegged to 1$ using chiliz
				</p>
			</div>
			<Balance />
			<div className="max-w-screen-md mx-auto flex flex-col gap-y-16">
				<div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
					<div className="flex items-center mt-auto gap-x-2">
						<div className="flex flex-col gap-y-2">
							<Label htmlFor="from">FAN TOKEN</Label>
							<Input
								id="from"
								placeholder="0.0"
								value={fromAmount}
								onChange={(e) => setFromAmount(e.target.value)}
							/>
						</div>
						<Select
							onValueChange={(value) => setFromToken(value)}
							defaultValue={BAR}
						>
							<SelectTrigger className="w-fit mt-6">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value={BAR}>BAR</SelectItem>
								<SelectItem value={JUV}>JUV</SelectItem>
								<SelectItem value={PSG}>PSG</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="flex items-center justify-center">
						<ArrowLeftRightIcon className="h-6 w-6 text-muted-foreground" />
					</div>
					<div className="space-y-2">
						<Label htmlFor="to">NEXUS TOKEN</Label>
						<Input
							id="to"
							value={`${fromAmount} NEXUS TOKEN`}
							disabled
						/>
					</div>
				</div>
				<div className="flex w-full gap-x-4">
					<Button
						className="w-full bg-primaryColor hover:bg-primaryColor/90"
						onClick={handleConvertClick}
					>
						Mint
					</Button>
					<Button
						className="w-full bg-primaryColor hover:bg-primaryColor/90"
						onClick={handleRedeem}
					>
						Redeem
					</Button>
				</div>

				<div className="w-full flex flex-col gap-y-8">
					<h2 className="text-3xl text-secondaryColor font-semibold mx-auto">
						Get FAN Tokens for testing
					</h2>
					<div className="flex flex-col gap-y-4 items-center">
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
							<div
								key={title}
								className="flex items-center gap-x-6"
							>
								<h4 className="text-xl font-semibold">
									{title}:
								</h4>
								<Link href={link} className="underline text-lg">
									{link}
								</Link>
							</div>
						))}
					</div>
				</div>
				<div className="space-y-2 text-center">
					<h3 className="text-lg font-medium">
						Supported fan Tokens
					</h3>
					<p className="text-muted-foreground">BAR, PSG, JUV</p>
				</div>
			</div>

			{showDialog && (
				<Dialog open={showDialog} onOpenChange={setShowDialog}>
					<DialogContent>
						<DialogTitle>Confirm Transaction</DialogTitle>
						<DialogDescription>
							You are about to bridge {fromAmount}{" "}
							{fromToken.toUpperCase()} to Nexus tokens. Do you
							want to proceed?
						</DialogDescription>
						<DialogFooter>
							<Button
								onClick={handleConfirm}
								className="bg-primaryColor hover:bg-primaryColor/90"
							>
								Confirm
							</Button>
							<Button onClick={handleCancel} variant="secondary">
								Cancel
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			)}
		</div>
	);
}
