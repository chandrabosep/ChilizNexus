import React from "react";
import { Card, CardContent } from "./ui/card";
import {
	Badge,
	CalendarIcon,
	ClockIcon,
	CurrencyIcon,
	MapPinIcon,
	SquareArrowOutUpRight,
	Triangle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

export default function EventCard() {
	return (
		<>
			<Card className="flex rounded-lg overflow-hidden shadow-lg h-[20rem] w-1/2">
				<div className="relative h-full w-1/2">
					<Image
						src="/placeholder.jpg"
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
								Sustainable Design Conference
							</h2>
							<div className="flex items-center gap-2 text-muted-foreground">
								<CalendarIcon className="w-5 h-5" />
								<span>August 15, 2024</span>
							</div>
						</div>
						<div className="flex items-center gap-2 text-muted-foreground">
							<ClockIcon className="w-5 h-5" />
							<span>9:00 AM - 5:00 PM</span>
						</div>
						<div className="flex items-center gap-2 text-muted-foreground">
							<MapPinIcon className="w-5 h-5" />
							<span>123 Main St, Anytown USA</span>
						</div>
						<div className="prose text-muted-foreground">
							<p className="line-clamp-3">
								Join us for a day-long conference exploring the
								latest trends and innovations in sustainable
								design. Hear from industry leaders, participate
								in workshops, and network with like-minded
								professionals.
							</p>
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
