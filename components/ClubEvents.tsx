"use client";
import EventCard from "./EventCard";
import CommunityCard from "./CommunityCard";
import { Plus } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import CreateCommEvent from "./CreateCommEvent";

export default function ClubEvents({ data }: any) {
	return (
		<>
			<div className="flex flex-col w-full gap-6">
				<div className="flex flex-col gap-y-8 py-4 w-full">
					<h6 className="text-xl text-primaryColor underline decoration-secondaryColor decoration-wavy underline-offset-4 w-fit font-semibold">
						Live Events
					</h6>
					<div className="flex flex-wrap gap-6 w-full">
						{data.events?.map((event: any, index: number) => (
							<div key={index} className="w-full">
								<EventCard data={event} />
							</div>
						))}
					</div>
				</div>
				<div className="flex flex-col gap-y-8 py-4 w-full">
					<div className="flex justify-between items-center">
						<h6 className="text-xl text-primaryColor underline decoration-secondaryColor decoration-wavy underline-offset-4 w-fit font-semibold">
							{`Community Events (local)`}
						</h6>

						<Dialog>
							<DialogTrigger>
								<div className="bg-primaryColor size-8 flex items-center justify-center rounded-full">
									<Plus className="w-5 h-5 text-white" />
								</div>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>
										Create Community Event
									</DialogTitle>
									<DialogDescription className="py-4">
										<CreateCommEvent data={data} />
									</DialogDescription>
								</DialogHeader>
							</DialogContent>
						</Dialog>
					</div>
					<div className="flex flex-wrap gap-6 w-full">
						{data.communityEvents?.map(
							(event: any, index: number) => (
								<div key={index} className="w-1/2 max-w-fit">
									<CommunityCard key={index} data={event} />
								</div>
							)
						)}
					</div>
				</div>
			</div>
		</>
	);
}
