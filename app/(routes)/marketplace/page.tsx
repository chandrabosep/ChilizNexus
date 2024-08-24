import EventCard from "@/components/EventCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import React from "react";

export default function Marketplace() {
	return (
		<div className="flex flex-col py-10 gap-y-8 w-full max-w-screen-2xl">
			<div className="flex items-center justify-between">
				<h2
					className={`text-3xl text-primaryColor underline decoration-secondaryColor decoration-wavy font-semibold`}
				>
					Events Hub
				</h2>
                <div className="flex items-center w-1/3 border pl-2 rounded-lg">
                <Search className="text-primaryColor" />
				<Input
					placeholder="Search Events"
					className="border-none ring-none placeholder:ring-none focus-visible:ring-none w-full pt-3"
				/>
                </div>
			</div>
			<div className="flex flex-col w-full gap-6">
				<div className="flex flex-col gap-y-8 py-4">
					<h6 className="text-xl text-primaryColor border-b-2 border-secondaryColor w-fit font-semibold">
						Live Events
					</h6>
					<div className="flex flex-wrap gap-6">
						<EventCard />
					</div>
				</div>
				<div className="flex flex-col gap-y-8 py-4">
					<h6 className="text-xl text-primaryColor border-b-2 border-secondaryColor w-fit font-semibold">
						Virtual Events
					</h6>
					<div className="flex flex-wrap gap-6">
						<EventCard />
					</div>
				</div>
				<div className="flex flex-col gap-y-8 py-4">
					<h6 className="text-xl text-primaryColor border-b-2 border-secondaryColor w-fit font-semibold">
						{`Community Events (local)`}
					</h6>
					<div className="flex flex-wrap gap-6">
						<EventCard />
					</div>
				</div>
			</div>
		</div>
	);
}
