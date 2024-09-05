"use client";
import React, { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { CalendarIcon, ClockIcon, MapPinIcon } from "lucide-react";
import Image from "next/image";
import { Button } from "./ui/button";

export default function EventCard({ data }: any) {
	const [flipped, setFlipped] = useState(false);
	const handleCardClick = () => {
		setFlipped(!flipped);
	};

	return (
		<>
			<Card
				onClick={handleCardClick}
				className="flex rounded-lg overflow-hidden shadow-lg h-[20rem] w-[43rem]"
			>
				<div className="relative h-full w-1/2">
					<Image
						src="/eve.jpg"
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
						<div className="h-full flex flex-col">
							<div className="flex items-center gap-x-4">
								<p className="text-xl font-medium">
									Total Fans Registered:
								</p>
								<span className="text-xl font-bold">24</span>
							</div>
							<div className="h-full flex flex-col gap-y-2 py-4">
								<h6 className="text-lg font-semibold text-primaryColor underline decoration-wavy decoration-secondaryColor">
									Tickets
								</h6>
								<div className="grid grid-cols-2 gap-2 gap-y-4 pt-3">
									<div className="flex flex-col items-center gap-y-1">
										<h6 className="text-lg font-semibold">
											VIP
										</h6>
										<p className="text-xl font-bold">
											$100
										</p>
									</div>
									
								</div>
							</div>
							<Button className="flex items-end mt-auto w-full bg-primaryColor hover:bg-primaryColor h-fit">
								Register Now
							</Button>
						</div>
					)}
				</div>
			</Card>
		</>
	);
}
