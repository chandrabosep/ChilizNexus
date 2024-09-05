"use client";
import React, { useEffect, useState } from "react";
import EventCard from "./EventCard";
import { client } from "@/lib/sanity";
import CommunityCard from "./CommunityCard";

export default function Events() {
	const [events, setEvents] = useState([]);
	const [commEventsOffline, setCommEventsOffline] = useState([]);
	const [commEventsVirtual, setCommEventsVirtual] = useState([]);

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

			const offlineCommEvents = allCommEvents.filter(
				(event: any) => event.type === "offline"
			);
			const virtualCommEvents = allCommEvents.filter(
				(event: any) => event.type === "virtual"
			);

			setEvents(allEvents);
			setCommEventsOffline(offlineCommEvents);
			setCommEventsVirtual(virtualCommEvents);
		}
		getEvents();
	}, []);
	console.log(events, commEventsOffline, commEventsVirtual);
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
						{`Community Events`}
					</h6>
					<div className="flex flex-wrap gap-6">
						{commEventsOffline.map((event, index) => (
							<div key={index}>
								<CommunityCard data={event} type="offline" />
							</div>
						))}
					</div>
				</div>
				<div className="flex flex-col gap-y-8 py-4">
					<h6 className="text-xl text-primaryColor underline decoration-secondaryColor decoration-wavy underline-offset-4 w-fit font-semibold">
						{`Virtual Events`}
					</h6>
					<div className="flex flex-wrap gap-6">
						{commEventsVirtual.map((event, index) => (
							<div key={index}>
								<CommunityCard data={event} type="virtual" />
							</div>
						))}
					</div>
				</div>
			</div>
		</>
	);
}
