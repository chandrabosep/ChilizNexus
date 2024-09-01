import React from "react";
import { Button } from "./ui/button";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import { Triangle } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import CreateProposal from "./CreateProposal";

export default function Proposals({ data }: any) {
	return (
		<div className="flex flex-col py-4 h-full">
			<div className="flex items-center justify-between mb-8">
				<h2 className="text-2xl font-bold">Proposals</h2>

				<Dialog>
					<DialogTrigger>
						<Button className="bg-primaryColor hover:bg-primaryColor/90">
							Create Proposal
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Create Community Event</DialogTitle>
							<DialogDescription className="py-4">
								<CreateProposal data={data} />
							</DialogDescription>
						</DialogHeader>
					</DialogContent>
				</Dialog>
			</div>
			<div className="grid gap-6 h-full">
				{data?.proposals?.map((proposal: any, index: number) => (
					<Card
						key={index}
						className="flex items-center justify-between h-full"
					>
						<CardHeader>
							<CardTitle>{proposal?.title}</CardTitle>
							<CardDescription>
								{proposal?.description}
							</CardDescription>
						</CardHeader>
						<CardContent className="h-full">
							<div className="flex items-center justify-center h-full gap-4 mt-auto">
								<div className="flex items-center">
									<Button variant="ghost" size="icon">
										<Triangle className="size-7 fill-primaryColor text-primaryColor" />
									</Button>
									{/* <span>{proposal?.upvote || 0}</span> */}
								</div>
								<div className="flex items-center">
									<Button variant="ghost" size="icon">
										<Triangle className="size-7 rotate-180 fill-[#555555] text-[#555555]" />
									</Button>
									{/* <span>{proposal?.downvote || 0}</span> */}
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
