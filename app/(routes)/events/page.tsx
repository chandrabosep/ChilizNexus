import EventCard from "@/components/EventCard";
import Events from "@/components/Events";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import React from "react";

export default function Marketplace() {
	return (
		<div className="flex flex-col py-10 gap-y-8 w-full max-w-screen-2xl">
			<div className="flex items-center justify-between">
				<h2 className={`text-3xl text-secondaryColor font-semibold`}>
					Events Marketplace
				</h2>
				<div className="flex items-center w-1/3 border pl-2 rounded-lg">
					<Search className="text-primaryColor" />
					<Input
						placeholder="Search Events"
						className="border-none ring-none placeholder:ring-none focus-visible:ring-none w-full pt-3"
					/>
				</div>
			</div>
			<Events />
		</div>
	);
}
