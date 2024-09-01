"use client";
import {
	CalendarIcon,
	LucideLink,
	MountainIcon,
	StarIcon,
	UsersIcon,
} from "lucide-react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Overview from "@/components/Overview";
import ClubSub from "@/components/ClubSub";
import ClubEvents from "@/components/ClubEvents";
import { useEffect, useState } from "react";
import { client } from "@/lib/sanity";
import { useParams } from "next/navigation";
import Admin from "@/components/Admin";
import { useAccount } from "wagmi";
import Proposals from "@/components/Proposals";

export default function ClubInfo() {
	const { address } = useAccount();
	const adminAddresses = [
		"0x02C8345B2DF9Ff6122b0bE7B79cB219d956bd701",
		"0x709d29dc073F42feF70B6aa751A8D186425b2750",
	];

	const slug = useParams();
	const [data, setData] = useState<any>([]);

	useEffect(() => {
		async function getProjects() {
			const query = `*[_type == "club" && slug.current == "${slug.slug}"]{
							...,
							events[]->,
							communityEvents[]->,
							notifications[]->,
							proposals[]->
							}[0]`;
			const data = await client.fetch(query);
			setData(data);
		}
		getProjects();
	}, [slug,address]);
	return (
		<div>
			<div className="flex flex-col justify-center gap-10 w-full py-12 md:py-16 lg:py-20">
				<div className="flex flex-col  gap-6">
					<div className="flex justify-between w-full">
						<div className="flex  gap-5">
							<MountainIcon
								fill="#FF1256"
								className="h-8 w-8 text-primaryColor"
							/>
							<h1 className="text-3xl font-bold text-primaryColor">
								{data?.name}
							</h1>
						</div>
						<div className="flex items-center gap-x-6 brightness-0">
							<LucideLink strokeWidth={3} className="size-5" />
							{["x.svg", "farcaster.svg", "discord.svg"].map(
								(social) => (
									<Image
										key={social}
										src={`/${social}`}
										alt={social}
										width={32}
										height={32}
										className="size-5"
									/>
								)
							)}
						</div>
					</div>
					<p className="text-muted-foreground max-w-[700px]">
						{data?.description}
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
					<div className="flex gap-10">
						<div className="flex  gap-3">
							<UsersIcon className="h-5 w-5 text-muted-foreground" />
							<span className="text-muted-foreground">
								{data?.fans}M+ Fans
							</span>
						</div>
						<div className="flex  gap-3">
							<StarIcon className="h-5 w-5 text-muted-foreground" />
							<span className="text-muted-foreground">
								{data?.holders}M+ Holders
							</span>
						</div>
						<div className="flex  gap-3">
							<CalendarIcon className="h-5 w-5 text-muted-foreground" />
							<span className="text-muted-foreground">
								Founded in 2024
							</span>
						</div>
					</div>
				</div>
				<div className="w-full mt-12">
					<Tabs defaultValue="overview">
						<TabsList className="border-b w-fit bg-primaryColor/60 text-white/80 h-11">
							<TabsTrigger
								value="overview"
								className="data-[state=active]:bg-primaryColor data-[state=active]:text-white"
							>
								Overview
							</TabsTrigger>
							<TabsTrigger
								value="events"
								className="data-[state=active]:bg-primaryColor data-[state=active]:text-white"
							>
								Events
							</TabsTrigger>
							<TabsTrigger
								value="subscribe"
								className="data-[state=active]:bg-primaryColor data-[state=active]:text-white"
							>
								Subscription
							</TabsTrigger>
							<TabsTrigger
								value="proposals"
								className="data-[state=active]:bg-primaryColor data-[state=active]:text-white"
							>
								Proposals
							</TabsTrigger>
							<TabsTrigger
								value="chat"
								className="data-[state=active]:bg-primaryColor data-[state=active]:text-white"
							>
								Chat
							</TabsTrigger>
							{/* @ts-ignore */}
							{adminAddresses.includes(address) && (
								<TabsTrigger
									value="admin"
									className="data-[state=active]:bg-primaryColor data-[state=active]:text-white"
								>
									Admin
								</TabsTrigger>
							)}
						</TabsList>
						<TabsContent
							value="overview"
							className="border rounded-xl p-4 px-5 mt-5"
						>
							<Overview data={data} />
						</TabsContent>
						<TabsContent
							value="subscribe"
							className="border rounded-xl p-4 px-5 mt-5"
						>
							<ClubSub data={data} />
						</TabsContent>
						<TabsContent
							value="chat"
							className="border rounded-xl p-4 px-5 mt-5"
						>
							<div className="flex items-center justify-center  min-h-[300px] w-full text-3xl font-medium">
								Coming Soon
							</div>
						</TabsContent>
						<TabsContent
							value="events"
							className="border rounded-xl p-4 px-5 mt-5"
						>
							<ClubEvents data={data} />
						</TabsContent>
						<TabsContent
							value="admin"
							className="border rounded-xl p-4 px-5 mt-5"
						>
							<Admin data={data} />
						</TabsContent>
						<TabsContent
							value="proposals"
							className="border rounded-xl p-4 px-5 mt-5"
						>
							<Proposals data={data} />
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</div>
	);
}
