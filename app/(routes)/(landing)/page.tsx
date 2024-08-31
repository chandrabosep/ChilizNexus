import {
	CheckIcon,
	Component,
	Gem,
	Gift,
	Link2,
	LinkIcon,
	PartyPopper,
	ScrollText,
	Users,
	Vault,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import erthonline from "../../../public/erthonline.png";
import blob from "../../../public/blob.svg";
import token from "../../../public/token.gif";
import { Button } from "@/components/ui/button";

export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-10">
			<Image
				src={blob}
				alt="alt"
				className="absolute -z-10 right-0 top-0"
			/>

			<div className="flex flex-row items-center justify-between">
				<div className="py-10 md:py-40 flex flex-col gap-y-10">
					<div
						className={`text-4xl md:text-5xl font-bold space-y-4 text-[#610287]`}
					>
						<h1>
							<span className="relative">
								{/* <Image src="/element.svg" className="w-fit absolute -rotate-90 -top-10 -left-10" alt="alt" width={600} height={600} /> */}
								ChillizNexus:
							</span>{" "}
							Transforming{" "}
						</h1>
						<h1 className="bg-primaryColor/30 w-fit py-1 pt-2 px-6 rounded-full">
							Fan Engagement
						</h1>
					</div>
					<p className={`text-2xl max-w-screen-sm`}>
						Elevate your sports experience with ChilizNexus. Engage,
						interact, and govern—all in one blockchain-powered
						platform.
					</p>
					<Link href="/clubs">
						<Button className="px-10 py-6 bg-primaryColor hover:bg-primaryColor/80 text-white text-lg rounded-full">
							Get Started Now
						</Button>
					</Link>
				</div>
				<Image
					src={token}
					alt="Spaceship"
					className="w-[45%] hidden md:block max-w-[50%]"
				/>
			</div>
			<div>
				<h2
					className={`text-6xl font-bold text-[#610287] underline decoration-wavy decoration-primaryColor decoration-2 underline-offset-8 w-fit`}
				>
					How it Works
				</h2>
				<section className="w-full py-8 md:py-10 lg:py-16">
					<div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-20">
						<div className="space-y-4 max-w-2xl">
							<div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
								Engage in Events
							</div>
							<h2 className="text-3xl font-bold tracking-tighter sm:text-3xl md:text-4xl">
								Participate in Exciting Fan Activities
							</h2>
							<p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
								Join live, virtual, or community events hosted
								by your favorite teams and connect with other
								passionate fans.
							</p>
							<div className="grid gap-2">
								<div className="flex items-center gap-2">
									<CheckIcon className="h-5 w-5 text-green-500" />
									<p className="text-sm text-muted-foreground">
										Attend exclusive live sessions
									</p>
								</div>
								<div className="flex items-center gap-2">
									<CheckIcon className="h-5 w-5 text-green-500" />
									<p className="text-sm text-muted-foreground">
										Participate in global virtual events
									</p>
								</div>
							</div>
						</div>
						<div className="space-y-4 max-w-2xl">
							<div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
								Get Notified
							</div>
							<h2 className="text-3xl font-bold tracking-tighter sm:text-3xl md:text-4xl">
								Stay Connected with Your Club
							</h2>
							<p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
								Opt into notifications to receive real-time
								updates about events, team news, and exclusive
								content directly from your favorite clubs.
							</p>
							<div className="grid gap-2">
								<div className="flex items-center gap-2">
									<CheckIcon className="h-5 w-5 text-green-500" />
									<p className="text-sm text-muted-foreground">
										Subscribe to club alerts
									</p>
								</div>
								<div className="flex items-center gap-2">
									<CheckIcon className="h-5 w-5 text-green-500" />
									<p className="text-sm text-muted-foreground">
										Never miss important updates
									</p>
								</div>
							</div>
						</div>
						<div className="space-y-4 max-w-2xl">
							<div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
								Earn and Use Tokens
							</div>
							<h2 className="text-3xl font-bold tracking-tighter sm:text-3xl md:text-4xl">
								Unlock Rewards and Influence
							</h2>
							<p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
								{`Participate in events to earn NexusTokens, which
								can be used to vote on club decisions, giving
								you a voice in your team's future.`}
							</p>
							<div className="grid gap-2">
								<div className="flex items-center gap-2">
									<CheckIcon className="h-5 w-5 text-green-500" />
									<p className="text-sm text-muted-foreground">
										Earn tokens through participation
									</p>
								</div>
								<div className="flex items-center gap-2">
									<CheckIcon className="h-5 w-5 text-green-500" />
									<p className="text-sm text-muted-foreground">
										Influence club decisions
									</p>
								</div>
							</div>
						</div>
						<div className="space-y-4 max-w-2xl">
							<div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
								Showcase Your Participation
							</div>
							<h2 className="text-3xl font-bold tracking-tighter sm:text-3xl md:text-4xl">
								Secure Your Memories
							</h2>
							<p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
								Receive non-transferable Soulbound Tokens (SBTs)
								as proof of your participation in events, making
								each experience unique and personal.
							</p>
							<div className="grid gap-2">
								<div className="flex items-center gap-2">
									<CheckIcon className="h-5 w-5 text-green-500" />
									<p className="text-sm text-muted-foreground">
										Collect SBTs for each event
									</p>
								</div>
								<div className="flex items-center gap-2">
									<CheckIcon className="h-5 w-5 text-green-500" />
									<p className="text-sm text-muted-foreground">
										Share your event memories online
									</p>
								</div>
							</div>
						</div>
					</div>
				</section>
			</div>
			<div className="w-full flex flex-col gap-y-14 pb-16 pt-6	">
				<h2
					className={`text-6xl font-bold text-[#610287] underline decoration-wavy decoration-primaryColor decoration-2 underline-offset-8  w-fit`}
				>
					Features
				</h2>
				<div className="grid gap-16 lg:grid-cols-2 xl:grid-cols-3">
					{[
						{
							title: "Event Creation & Management",
							description:
								"ChilizNexus enables fans to participate in live, virtual, and community events, enhancing engagement with their favorite teams.",
							icon: <Gem />,
						},
						{
							title: "Subscriptions & Notifications",
							description:
								"Stay updated with real-time club news and event announcements through the platform’s subscription and notification system.",
							icon: <ScrollText />,
						},
						{
							title: "Tokenized Rewards & Governance",
							description:
								"Earn NexusTokens by participating in events and use them to vote on club decisions, fostering community and ownership.",
							icon: <Users />,
						},
						{
							title: "Secure Ticketing",
							description:
								"ChilizNexus issues non-transferable Soulbound Tokens (SBTs) as proof of participation, creating a personal and memorable fan experience.",
							icon: <Vault />,
						},
						{
							title: "On-Chain Attestations",
							description:
								"All events and interactions are recorded on-chain, providing transparent and immutable verification of fan participation.",
							icon: <LinkIcon />,
						},
						{
							title: "TokenDrops & Incentives",
							description:
								"Fans holding event tickets are eligible for token drops, adding extra rewards for active participation in the ChilizNexus ecosystem.",
							icon: <Gift />,
						},

						// {
						// 	title: "Unique NFT for Funders",
						// 	description:
						// 		"Showcase your contributions with unique NFTs received for your total funding, easily shareable on platforms like X and Farcaster.",
						// 	icon: <Component />,
						// },
					].map((feature) => (
						<div key={feature.title} className="grid gap-4">
							<div className="flex items-start gap-4">
								<div className="bg-muted rounded-md p-2 text-primary">
									{feature.icon}
								</div>
								<div className="space-y-1">
									<h3 className="text-2xl font-bold">
										{feature.title}
									</h3>
									<p className="text-muted-foreground text-lg">
										{feature.description}
									</p>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
			<div className="flex items-center justify-between border-t w-full pt-4">
				<div className="flex items-center gap-2">
					<Image
						src={erthonline}
						alt="alt"
						className="size-6 rounded-full"
					/>
					<p className="text-lg font-bold pt-1">
						Built at EthOnline24
					</p>
				</div>
				<div className="flex items-center gap-4 text-lg font-medium">
					Built by{" "}
					<Link
						href={"https://chandrabose.xyz"}
						className="border-b border-primaryColor leading-5"
					>
						Chandra Bose
					</Link>
					&
					<Link
						href={"https://x.com/muja002"}
						className="border-b border-primaryColor leading-5"
					>
						Mujahid
					</Link>
				</div>
			</div>
		</main>
	);
}
