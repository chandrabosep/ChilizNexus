"use client";
import Image from "next/image";
import React, { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { SquareArrowOutUpRight, Triangle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ClubCard() {
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
			className="w-full max-w-md h-fit min-h-[410px] min-w-[28rem]"
			onClick={handleCardClick}
		>
			{!flipped && (
				<Image
					src={"/placeholder.jpg"}
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
				<div className="flex items-center justify-between">
					<h3 className="text-xl font-bold">Hyderabad DAO</h3>
					<Link href={`/explore/1`}>
						<SquareArrowOutUpRight className="w-4 h-4 text-primaryColor" />
					</Link>
				</div>
				{!flipped ? (
					<>
						<p className="text-muted-foreground line-clamp-3 leading-7 min-h-20">
							Lorem, ipsum dolor sit amet consectetur adipisicing
							elit. Eos reprehenderit quibusdam dignissimos magni
							facere nulla, iusto architecto corporis quo vitae
							tempora nam natus exercitationem ut libero velit
							commodi consequuntur tenetur.
						</p>
						<div className="flex items-center gap-2 text-sm text-muted-foreground">
							<Triangle className="w-4 h-4 fill-primaryColor" />
							<span>1.2K</span>
							<Triangle className="w-4 h-4 fill-muted rotate-180" />
							<span>200</span>
						</div>
					</>
				) : (
					<></>
				)}
			</CardContent>
		</Card>
	);
}
