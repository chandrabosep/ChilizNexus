"use client";
import React, { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { CalendarIcon, ClockIcon, MapPinIcon } from "lucide-react";
import Image from "next/image";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { EventGateAbi } from "@/contracts/EventGate";
import { useToast } from "@/hooks/use-toast";

export default function CommunityCard({ data, type }: any) {
	const [flipped, setFlipped] = useState(false);
	const { writeContract } = useWriteContract();
	const { address } = useAccount();
	const { toast } = useToast();

	const handleCardClick = () => {
		setFlipped(!flipped);
	};

	const handleFundClick = async (e: React.MouseEvent) => {
		e.stopPropagation();
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
		await writeContract({
			abi: EventGateAbi.abi,
			address: EventGateAbi.address as `0x${string}`,
			functionName: "mintCommunityTicket",
			args: [data?.eventId, tokenId, address],
		}).then(() => {
			new Promise((resolve) => setTimeout(resolve, 3000));
			toast({
				title: "Registered Successfully",
				description: "You have successfully registered for the event.",
			});
		});
	};
	return (
		<>
			<Card
				onClick={handleCardClick}
				className="flex rounded-lg overflow-hidden shadow-lg h-[20rem] w-[43rem]"
			>
				<div className="relative h-full w-1/2">
					<Image
						src={type === "virtual" ? "/vir.jpg" : "/comm.jpg"}
						alt="Event Image"
						layout="fill"
						objectFit="cover"
						className="cover h-full"
					/>
				</div>
				<div className="py-4 pl-4 pr-3 w-1/2 flex flex-col justify-between h-full">
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
								<span className="text-xl font-bold">24</span>
							</div>
							<div>
								<h6 className="text-xl font-medium">
									Fund this event
								</h6>
								<div className="flex items-center gap-x-2 py-2">
									<Input
										placeholder="Fund"
										onClick={handleFundClick}
									/>
									<Button
										onClick={handleFundClick}
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
			</Card>
		</>
	);
}
