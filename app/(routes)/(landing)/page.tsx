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
						Interoperable platform for global fan engagement and uniting sports fans from around the
						world.
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
					<div className="grid gap-6 lg:grid-cols-2 lg:gap-20">
						<div className="space-y-4 max-w-2xl">
							<div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
								Engage in Events
							</div>
							<h2 className="text-3xl font-bold tracking-tighter sm:text-3xl md:text-4xl">
								Participate in Exciting Fan Activities
							</h2>
							<p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
								Participate in live events hosted by your
								favorite teams, join purely{" "}
								<span className="text-white bg-primaryColor/70 p-1 px-2 rounded-full">
									onchain
								</span>{" "}
								virtual or community events organized by fans,
								and connect with other passionate supporters.
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
										Participate in community & virtual
										events
									</p>
								</div>
							</div>
						</div>

						<div className="space-y-4 max-w-2xl">
							<div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
								Earn and Use Tokens
							</div>
							<h2 className="text-3xl font-bold tracking-tighter sm:text-3xl md:text-4xl">
								NexusToken & Rewards
							</h2>
							<p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
								{`Bridge Fan Tokens to receive Nexus Tokens `}{" "}
								<span className="text-white bg-primaryColor/70 p-1 px-2 rounded-full">
									CAP223
								</span>{" "}
								{`, or earn Nexus Tokens by participating in events, staking through the FAN Vault, or submitting proposals as rewards.`}
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
										Get Interactive Rewards
									</p>
								</div>
							</div>
						</div>
						<div className="space-y-4 max-w-2xl">
							<div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
								Showcase Your Participation
							</div>
							<h2 className="text-3xl font-bold tracking-tighter sm:text-3xl md:text-4xl">
								Secure Your Memories (SBTs)
							</h2>
							<p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
								Receive non-transferable Soulbound Tokens{" "}
								<span className="text-white bg-primaryColor/70 p-1 px-2 rounded-full">
									ERC1155
								</span>{" "}
								as proof of your participation in events, and
								share your ticket on socials.
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
						<div className="space-y-4 max-w-2xl">
							<div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
								Transparent Tracking
							</div>
							<h2 className="text-3xl font-bold tracking-tighter sm:text-3xl md:text-4xl">
								Secure Event Participation via Attestation
							</h2>
							<p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
								Implement an on-chain{" "}
								<span className="text-white bg-primaryColor/70 p-1 px-2.5 rounded-full">
									sign protocol
								</span>{" "}
								for attestations, enabling secure, transparent,
								and decentralized tracking of events, while also
								facilitating the creation of an event
								marketplace.
							</p>
							<div className="grid gap-2">
								<div className="flex items-center gap-2">
									<CheckIcon className="h-5 w-5 text-green-500" />
									<p className="text-sm text-muted-foreground">
										Verify event with on-chain attestations
									</p>
								</div>
								<div className="flex items-center gap-2">
									<CheckIcon className="h-5 w-5 text-green-500" />
									<p className="text-sm text-muted-foreground">
										Ensure transparency and security for
										every event
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
								"ChilizNexus enables fans to participate in live, virtual, and community events, enhancing fan engagement with their favorite teams.",
							icon: <Gem />,
						},
						{
							title: "Tokenized Rewards",
							description:
								"Bridge Fan Tokens to receive Nexus Tokens, or earn them by participating in events, staking in the FAN Vault, or submitting proposals.",
							icon: <Users />,
						},
						{
							title: "Secure Ticketing",
							description:
								" Non-transferable Soulbound Tokens (SBTs) serve as event tickets, preserving each fan's unique experience as a permanent on-chain memory.",
							icon: <Vault />,
						},
						{
							title: "On-Chain Attestations",
							description:
								"All events are recorded as on-chain attestations via the Sign protocol, with fan interactions enabled by Chiliz, ensuring transparency and verifiable participation.",
							icon: <LinkIcon />,
						},
						{
							title: "TokenDrops & Incentives",
							description:
								"Fans holding event tickets are eligible for TokenDrops on both Chiliz and Base, receiving additional rewards for their active engagement in the ChilizNexus ecosystem.",
							icon: <Gift />,
						},
						{
							title: "Subscriptions & Notifications",
							description:
								"Stay informed with real-time updates on club activities, events, and exclusive content, enhancing fan interaction through a robust subscription system.",
							icon: <ScrollText />,
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
