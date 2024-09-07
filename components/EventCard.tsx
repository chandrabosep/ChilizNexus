"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { CalendarIcon, ClockIcon, MapPinIcon } from "lucide-react";
import Image from "next/image";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { EventGateAbi } from "@/contracts/EventGate";
import { formatEther, parseEther } from "viem";
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
import Link from "next/link";
import ShareButtons from "./ShareBtn";

const eventGateContract = {
	address: EventGateAbi.address as `0x${string}`,
	abi: EventGateAbi.abi,
} as const;

export default function EventCard({ data }: any) {
	const [flipped, setFlipped] = useState(false);
	const { toast } = useToast();
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [accessLevelsAndPrices, setAccessLevelsAndPrices] = useState<{
		accessLevel: any;
		ticketPrice: any;
		tokenId: any;
	}>();
	const [fundAmt, setFundAmt] = useState(0);
	const handleCardClick = () => {
		setFlipped(!flipped);
	};
	const { address } = useAccount();
	const { writeContract: writeContractMint, isSuccess: mintSuccess } =
		useWriteContract();
	const { writeContract, isSuccess } = useWriteContract();

	const handleFundClick = async (e: React.MouseEvent) => {
		e.stopPropagation();
		writeContract({
			...eventGateContract,
			functionName: "nexusDrop",
			args: [data.eventId],
			value: parseEther(fundAmt.toString()),
		});
	};

	const handelInput = (e: any) => {
		e.stopPropagation();
		setFundAmt(parseInt(e.target.value));
	};

	const { data: getAccessLevel } = useReadContract({
		...eventGateContract,
		functionName: "getAccessLevelsFromEventId",
		args: [data.eventId],
	});

	const { data: getTokenIds } = useReadContract({
		...eventGateContract,
		functionName: "getTokenIdsFromEventId",
		args: [data.eventId],
	});

	const { data: getTicketPrice } = useReadContract({
		...eventGateContract,
		functionName: "getTicketPricesFromEventId",
		args: [data.eventId],
	});

	const { data: getCollectedAmt } = useReadContract({
		...eventGateContract,
		functionName: "getCollectedAmountForEventId",
		args: [data.eventId],
	});

	//@ts-ignore
	const combinedArray =
		getAccessLevel &&
		getTokenIds &&
		getTicketPrice &&
		//@ts-ignore
		getAccessLevel?.map((level: any, index: number) => ({
			accessLevel: level,
			//@ts-ignore
			tokenId: getTokenIds && getTokenIds[index],
			//@ts-ignore
			ticketPrice: formatEther(getTicketPrice && getTicketPrice[index]),
		}));

	const selectTokenId = async (
		e: React.MouseEvent,
		accessLevel: any,
		ticketPrice: any,
		tokenId: any
	) => {
		e.stopPropagation();
		setAccessLevelsAndPrices({
			accessLevel: accessLevel,
			ticketPrice: ticketPrice,
			tokenId: tokenId,
		});
	};
	const handleBuyTicket = async (e: React.MouseEvent) => {
		e.stopPropagation();
		writeContractMint({
			abi: EventGateAbi.abi,
			address: EventGateAbi.address as `0x${string}`,
			functionName: "mintLiveTicket",
			args: [data?.eventId, accessLevelsAndPrices?.tokenId, address],
			value: parseEther(accessLevelsAndPrices?.ticketPrice),
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
			<Card className="flex rounded-lg overflow-hidden shadow-lg h-[23rem] w-[43rem]">
				<div className="relative h-full w-1/2">
					<Image
						src="/eve.jpg"
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
									{data.name}
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
								<MapPinIcon className="size-6" />
								<span className="line-clamp-1">
									{data.address.slice(0, 30) + "..."}
								</span>
							</div>
							<div className="prose text-muted-foreground">
								<p className="line-clamp-4">
									{data.description}
								</p>
							</div>
						</div>
					) : (
						<div className="h-full flex flex-col gap-y-2">
							<div className="grid grid-cols-2 border-b-2 border-secondaryColor pb-2">
								<div className="flex flex-col items-center gap-4">
									<p className="text-base font-medium">
										Fans Registered:
									</p>
									<span className="text-lg font-bold">
										{(
											parseFloat(
												formatEther(
													getCollectedAmt &&
														typeof getCollectedAmt ===
															"bigint"
														? getCollectedAmt
														: BigInt(0) // Ensure it's a bigint
												)
											) / 2.5
										).toFixed(2)}
									</span>
								</div>
								<div className="flex flex-col items-center gap-4">
									<p className="text-base font-medium">
										Collected Amount:
									</p>
									<span className="text-lg font-bold">
										{formatEther(
											typeof getCollectedAmt === "bigint"
												? getCollectedAmt
												: typeof getCollectedAmt ===
														"number" ||
												  typeof getCollectedAmt ===
														"string"
												? BigInt(getCollectedAmt)
												: BigInt(0) // Fallback to BigInt(0) if it's not a valid number or string
										)}{" "}
										<span className="text-sm font-semibold">
											CHZ
										</span>
									</span>
								</div>
							</div>

							<div className="h-full flex flex-col gap-y-2 pt-2">
								<h6 className="text-lg font-semibold text-primaryColor underline decoration-wavy decoration-secondaryColor">
									Tickets
								</h6>
								<div className="pt-3">
									<div className={`grid grid-cols-3 ite`}>
										{combinedArray &&
											combinedArray?.map(
												({
													accessLevel,
													ticketPrice,
													tokenId,
												}: any) => (
													<div
														key={accessLevel}
														className={`text-center py-2 rounded-md ${
															accessLevelsAndPrices?.accessLevel ===
															accessLevel
																? "bg-primaryColor/30"
																: ""
														}`}
														onClick={(e) => {
															selectTokenId(
																e,
																accessLevel,
																ticketPrice,
																tokenId
															);
														}}
													>
														<h6 className="text-base font-medium mx-auto">
															{accessLevel}
														</h6>
														<p className="text-lg font-semibold mx-auto">
															{ticketPrice}{" "}
															<span className="text-sm font-semibold">
																CHZ
															</span>
														</p>
													</div>
												)
											)}
									</div>
								</div>
							</div>
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
					)}
					<Button
						onClick={(e) => handleBuyTicket(e)}
						className="flex items-end mt-auto w-full bg-primaryColor hover:bg-primaryColor h-fit"
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
