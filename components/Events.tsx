"use client";
import React, { useEffect, useState } from "react";
import EventCard from "./EventCard";
import { client } from "@/lib/sanity";
import CommunityCard from "./CommunityCard";

export default function Events() {
	const [events, setEvents] = useState([]);
	const [commEvents, setCommEvents] = useState([]);

	useEffect(() => {
		async function getEvents() {
			const query = `*[_type == "club"]{
							events[]->,communityEvents[]->
							}`;
			const data = await client.fetch(query);

			const allEvents = data
				.map((club: any) => club.events)
				.flat()
				.filter(Boolean);
			const allCommEvents = data
				.map((club: any) => club.communityEvents)
				.flat()
				.filter(Boolean);

			setEvents(allEvents);
			setCommEvents(allCommEvents);
		}
		getEvents();
	}, []);
	console.log(commEvents, events);
	return (
		<>
			<div className="flex flex-col w-full gap-6">
				<div className="flex flex-col gap-y-8 py-4">
					<h6 className="text-xl text-primaryColor underline decoration-secondaryColor decoration-wavy underline-offset-4 w-fit font-semibold">
						Live Events
					</h6>
					<div className="flex flex-wrap gap-6">
						{events.map((event, index) => (
							<div key={index}>
								<EventCard data={event} />
							</div>
						))}
					</div>
				</div>
				<div className="flex flex-col gap-y-8 py-4">
					<h6 className="text-xl text-primaryColor underline decoration-secondaryColor decoration-wavy underline-offset-4 w-fit font-semibold">
						{`Community Events (local)`}
					</h6>
					<div className="flex flex-wrap gap-6">
					{commEvents.map((event, index) => (
							<div key={index}>
								<CommunityCard data={event} />
							</div>
						))}
					</div>
				</div>
			</div>
		</>
	);
}
