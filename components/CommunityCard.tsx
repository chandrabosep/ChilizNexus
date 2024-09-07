"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { CalendarIcon, ClockIcon, MapPinIcon } from "lucide-react";
import Image from "next/image";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { EventGateAbi } from "@/contracts/EventGate";
import { useToast } from "@/hooks/use-toast";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import ShareButtons from "./ShareBtn";
import Link from "next/link";
import { parseEther } from "viem";

export default function CommunityCard({ data, type }: any) {
	const [flipped, setFlipped] = useState(false);
	const { writeContract: writeContractMint, isSuccess: mintSuccess } =
		useWriteContract();
	const { writeContract, isSuccess } = useWriteContract();
	const { address } = useAccount();
	const { toast } = useToast();
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [fundAmt, setFundAmt] = useState(0);

	const handleCardClick = () => {
		setFlipped(!flipped);
	};

	const handelInput = (e: any) => {
		e.stopPropagation();
		setFundAmt(parseInt(e.target.value));
	};

	const handleFundClick = async (e: React.MouseEvent) => {
		e.stopPropagation();
		writeContract({
			address: EventGateAbi.address as `0x${string}`,
			abi: EventGateAbi.abi,
			functionName: "nexusDrop",
			args: [data.eventId],
			value: parseEther(fundAmt.toString()),
		});
	};

	const { data: tokenId, error } = useReadContract({
		abi: EventGateAbi.abi,
		address: EventGateAbi.address as `0x${string}`,
		functionName: "getTokenIdOfAnEventManager",
		args: [data?.eventId],
	});
	console.log(tokenId, error);

	const register = async (e: React.MouseEvent) => {
		e.stopPropagation();
		writeContractMint({
			abi: EventGateAbi.abi,
			address: EventGateAbi.address as `0x${string}`,
			functionName: "mintCommunityTicket",
			args: [data?.eventId, tokenId, address],
		});
	};
	useEffect(() => {
		if (mintSuccess) {
			toast({
				title: "Registered Successfully",
				description: "You have successfully registered for the event.",
			});
			setIsDialogOpen(true);
		}
		if (isSuccess) {
			toast({
				title: "Fund Successful",
				description: "You have successfully funded for the event.",
			});
		}
	}, [mintSuccess]);

	return (
		<>
			<Card className="flex rounded-lg overflow-hidden shadow-lg h-[20rem] w-[43rem]">
				<div className="relative h-full w-1/2">
					<Image
						src={type === "virtual" ? "/vir.jpg" : "/comm.jpg"}
						alt="Event Image"
						layout="fill"
						objectFit="cover"
						className="cover h-full"
					/>
				</div>
				<div
					onClick={handleCardClick}
					className="py-4 pl-4 pr-3 w-1/2 flex flex-col justify-between h-full"
				>
					{!flipped ? (
						<div className="space-y-4 h-fit">
							<div>
								<h2 className="text-xl font-bold pb-2">
									{data?.name}
								</h2>
								<div className="flex items-center gap-2 text-muted-foreground">
									<CalendarIcon className="w-5 h-5" />
									<span>
										{new Date(data.date).toDateString()}
									</span>
								</div>
							</div>
							<div className="flex items-center gap-2 text-muted-foreground">
								<ClockIcon className="w-5 h-5" />
								<span>
									{data.from} - {data.to || "TBD"}
								</span>
							</div>
							<div className="flex items-center gap-2 text-muted-foreground">
								<MapPinIcon className="size-5" />
								<span className="line-clamp-1">
									{data.address}
								</span>
							</div>
							<div className="prose text-muted-foreground">
								<p className="line-clamp-3">
									{data.description}
								</p>
							</div>
						</div>
					) : (
						<div className="h-full flex flex-col justify-between">
							<div className="flex items-center gap-x-4">
								<p className="text-xl font-medium">
									Total Fans Registered:
								</p>
								<span className="text-xl font-bold">0</span>
							</div>
							<div>
								<h6 className="text-xl font-medium">
									Fund this event
								</h6>
								<div className="flex items-center gap-x-2 py-2">
									<Input
										placeholder="Fund"
										onChange={(e) => handelInput(e)}
										onClick={(e) => e.stopPropagation()}
										onFocus={(e) => e.stopPropagation()}
									/>
									<Button
										onClick={(e) => handleFundClick(e)}
										className=""
									>
										Fund
									</Button>
								</div>
							</div>

							<div></div>
						</div>
					)}
					<Button
						onClick={(e) => register(e)}
						className="flex items-end w-full bg-primaryColor hover:bg-primaryColor h-fit"
					>
						Register Now
					</Button>
				</div>
				<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
					<DialogContent className="max-w-xl">
						<DialogHeader>
							<DialogTitle className="text-xl text-primaryColor underline decoration-secondaryColor decoration-2 underline-offset-4">{`Ticket ERC 1155 SBT (Soul token) has been minted on Chiliz`}</DialogTitle>
							<div className="flex flex-col gap-y-3 items-center justify-center pt-7 py-5">
								<Image
									src="/nft1.png"
									alt="Chiliz"
									width={1000}
									height={1000}
									className="w-2/3 rounded-xl"
								/>
								<ShareButtons />
							</div>
						</DialogHeader>
						<DialogFooter>
							<Link
								href={`https://testnet.chiliscan.com/address/0x996eFcF698c4a15C7CA48b55d280D0849C658Da2`}
								target="_blank"
								className="border border-primaryColor bg-transparent text-primaryColor w-1/2 flex rounded"
							>
								<Button className="bg-transparent hover:bg-transparent mx-auto w-fit text-primaryColor">
									View Ticket
								</Button>
							</Link>

							<Button
								className="bg-primaryColor hover:bg-primaryColor w-1/2 rounded"
								onClick={() => setIsDialogOpen(false)}
							>
								Cool
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</Card>
		</>
	);
}
