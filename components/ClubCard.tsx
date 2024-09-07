"use client";
import Image from "next/image";
import React, { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { LucideLink, SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { urlFor } from "@/lib/sanity";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export default function ClubCard({ data }: any) {
	const router = useRouter();

	const [flipped, setFlipped] = useState(false);
	console.log();

	const handleCardClick = () => {
		setFlipped(!flipped);
	};

	const handleInputClick = (e: React.MouseEvent) => {
		e.stopPropagation();
	};

	const handleFundClick = async (e: React.MouseEvent) => {
		e.stopPropagation();
	};

	return (
		<Card
			className="w-full max-w-md h-full min-h-[410px] min-w-[28rem]"
			onClick={handleCardClick}
		>
			{!flipped && (
				<Image
					src={urlFor(data.image)?.url() || "/placeholder.jpg"}
					alt={"Project Image"}
					width={400}
					height={200}
					className="object-cover w-full rounded-t-lg"
					priority
					style={{
						aspectRatio: "400/200",
						objectFit: "cover",
					}}
				/>
			)}

			<CardContent className="p-4 space-y-2 border-t h-full">
				{!flipped ? (
					<>
						<div className="flex items-center justify-between">
							<h3 className="text-xl font-bold">{data.name}</h3>
							<Link href={`/clubs/${data.slug.current}`}>
								<SquareArrowOutUpRight className="w-4 h-4 text-primaryColor" />
							</Link>
						</div>
						<p className="text-muted-foreground line-clamp-4 leading-7 min-h-20">
							{data.description}
						</p>
					</>
				) : (
					<div className="flex flex-col gap-y-4 justify-between h-full">
						<div className="flex flex-col gap-y-2 h-fit">
							<p className="font-semibold pt-1 px-2 bg-primaryColor text-white w-fit rounded">
								ERC20
							</p>
							<h3 className="text-xl font-bold pt-4">
								{data.name}
							</h3>

							<div className="grid grid-cols-2 items-center justify-between py-8">
								<div className="mx-auto text-center">
									<h6 className="text-xl font-bold">Fans</h6>
									<p className="text-muted-foreground text-3xl">
										{data.fans}M+
									</p>
								</div>
								<div className="mx-auto text-center">
									<h6 className="text-xl font-bold">
										Holders
									</h6>
									<p className="text-muted-foreground text-3xl">
										{data.holders}M+
									</p>
								</div>
							</div>
						</div>
						<div className="flex flex-col gap-y-2 h-fit">
							<h6 className="text-xl font-bold">Socials</h6>
							<div className="flex items-center gap-x-6 brightness-0">
								<LucideLink
									strokeWidth={3}
									className="w-6 h-6"
								/>
								{["x.svg", "farcaster.svg", "discord.svg"].map(
									(social) => (
										<Image
											key={social}
											src={`/${social}`}
											alt={social}
											width={32}
											height={32}
											className="w-6 h-6"
										/>
									)
								)}
							</div>
						</div>
						{/* <div className="flex items-center gap-x-2 pt-5">
							<Input
								placeholder="Fund"
								onClick={handleFundClick}
							/>
							<Button onClick={handleFundClick} className="">
								Fund
							</Button>
						</div> */}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
