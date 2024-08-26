import React from "react";
import EventCard from "./EventCard";

export default function Events() {
	return (
		<>
			<div className="flex flex-col w-full gap-6">
				<div className="flex flex-col gap-y-8 py-4">
					<h6 className="text-xl text-primaryColor underline decoration-secondaryColor decoration-wavy underline-offset-4 w-fit font-semibold">
						Live Events
					</h6>
					<div className="flex flex-wrap gap-6">
						<EventCard />
					</div>
				</div>
				<div className="flex flex-col gap-y-8 py-4">
					<h6 className="text-xl text-primaryColor underline decoration-secondaryColor decoration-wavy underline-offset-4 w-fit font-semibold">
						Virtual Events
					</h6>
					<div className="flex flex-wrap gap-6">
						<EventCard />
					</div>
				</div>
				<div className="flex flex-col gap-y-8 py-4">
					<h6 className="text-xl text-primaryColor underline decoration-secondaryColor decoration-wavy underline-offset-4 w-fit font-semibold">
						{`Community Events (local)`}
					</h6>
					<div className="flex flex-wrap gap-6">
						<EventCard />
					</div>
				</div>
			</div>
		</>
	);
}
