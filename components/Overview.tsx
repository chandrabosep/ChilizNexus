import { LucideLink, User2Icon } from "lucide-react";
import Image from "next/image";
import React from "react";

export default function Overview({ data }: any) {
	return (
		<>
			<div className="flex flex-col gap-y-8 py-4">
				<div className="">
					<h2 className="text-2xl font-bold mb-4">
						About {data.name}
					</h2>
					<p className="text-muted-foreground">{data.description}</p>
				</div>
				<div className="flex flex-col gap-y-3 h-fit">
					<h6 className="text-xl font-bold text-black/80">Socials</h6>
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
				<div className="flex flex-col gap-y-3 h-fit py-3">
					<h6 className="text-xl font-bold text-black/80">
						Officials
					</h6>
					<div className="flex divide-x-2 py-4">
						{[
							"Jedi smith",
							"Luke Skywalker",
							"Darth Ghram",
							"Ben walker",
						].map((official) => (
							<div
								key={official}
								className="flex items-center gap-2 px-10"
							>
								<User2Icon className="text-muted-foreground size-7" />

								<div>
									<div className="text-base font-medium">
										{official}
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</>
	);
}
