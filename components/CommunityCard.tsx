import React from "react";
import { Card, CardContent } from "./ui/card";
import { CalendarIcon, ClockIcon, MapPinIcon } from "lucide-react";
import Image from "next/image";
import { Button } from "./ui/button";

export default function CommunityCard({ data }: any) {
	return (
		<>
			<Card className="flex rounded-lg overflow-hidden shadow-lg h-[20rem] w-1/2 min-w-[40rem]">
				<div className="relative h-full w-1/2">
					<Image
						src="/comm.jpg"
						alt="Event Image"
						layout="fill"
						objectFit="cover"
						className="cover h-full"
					/>
				</div>
				<div className="py-4 pl-4 pr-3 w-1/2 flex flex-col justify-between">
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
							<span className="line-clamp-1">{data.address}</span>
						</div>
						<div className="prose text-muted-foreground">
							<p className="line-clamp-3">{data.description}</p>
						</div>
					</div>
					<Button className="flex items-end w-full bg-primaryColor hover:bg-primaryColor h-fit">
						Register Now
					</Button>
				</div>
			</Card>
		</>
	);
}
