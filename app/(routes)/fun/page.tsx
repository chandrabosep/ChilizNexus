import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import React from "react";

export default function Page() {
	const events = [
		{
			id: 1,
			team1: "Portugal",
			team2: "Scotland",
			team1Odds: 2.5,
			team2Odds: 1.8,
			dateTime: "2024-09-09T15:00:00",
			sport: "Football - UFA League",
			color: "bg-primaryColor/70",
		},
		{
			id: 2,
			team1: "Croatia",
			team2: "Poland",
			team1Odds: 1.9,
			team2Odds: 2.1,
			dateTime: "2024-09-09T15:00:00",
			sport: "Football - UFA League",
			color: "bg-blue-600",
		},
		{
			id: 3,
			player1: "Switzerland",
			player2: "Spain",
			player1Odds: 1.6,
			player2Odds: 2.4,
			dateTime: "2024-09-09T15:00:00",
			sport: "Football - UFA League",
			color: "bg-cyan-500",
		},
		{
			id: 4,
			team1: "Sweden",
			team2: "Estonia",
			team1Odds: 2.3,
			team2Odds: 1.7,
			dateTime: "2024-09-09T15:00:00",
			sport: "Football - UFA League",
			color: "bg-emerald-500",
		},
	];

	return (
		<div className="flex flex-col py-10 gap-y-10 w-full h-full max-w-screen-2xl">
			<div className="flex flex-col gap-y-2">
				<h2 className={`text-3xl text-secondaryColor font-semibold`}>
					Fun
				</h2>
			</div>
			<div className="flex-1 grid grid-cols-[280px_1fr] gap-8">
				<div className="bg-background rounded-lg shadow-lg p-6 space-y-6">
					<div>
						<h3 className="text-lg font-semibold mb-2">Filters</h3>
						<div className="space-y-2">
							<div>
								<Label
									htmlFor="sport"
									className="font-semibold"
								>
									Sport
								</Label>
								<Select>
									<option value="">All Sports</option>
									<option value="football">Football</option>
									<option value="basketball">
										Basketball
									</option>
									<option value="tennis">Tennis</option>
									<option value="baseball">Baseball</option>
								</Select>
							</div>
							<div>
								<Label
									htmlFor="league"
									className="font-semibold"
								>
									League
								</Label>
								<Select>
									<option value="">All Leagues</option>
									<option value="premier-league">
										Premier League
									</option>
									<option value="nba">NBA</option>
									<option value="nfl">NFL</option>
									<option value="mlb">MLB</option>
								</Select>
							</div>
							<div>
								<Label htmlFor="date" className="font-semibold">
									Date
								</Label>
								<Input
									type="date"
									id="date"
									className="w-full"
								/>
							</div>
						</div>
					</div>
					<div>
						<h3 className="text-lg font-semibold mb-2">
							Bet History
						</h3>
						<div className="space-y-2">
							<BetHistory
								match="Barcelona vs Real Madrid"
								sport="Football"
								amount="$20"
								status="Won"
							/>
							<BetHistory
								match="Golden State vs Lakers"
								sport="Basketball"
								amount="$10"
								status="Lost"
							/>
							<BetHistory
								match="Federer vs Nadal"
								sport="Tennis"
								amount="$15"
								status="Won"
							/>
						</div>
					</div>
				</div>
				<div>
					<div className="mb-6">
						<h2 className="text-2xl font-bold mb-2">
							Upcoming Events
						</h2>
						<p className="text-muted-foreground">
							Check out the latest events and place your bets.
						</p>
					</div>
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
						{events.map((event) => (
							<EventCard key={event.id} {...event} />
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

function EventCard({
	team1,
	team2,
	player1,
	player2,
	team1Odds,
	team2Odds,
	player1Odds,
	player2Odds,
	dateTime,
	sport,
	color,
}: {
	team1?: string;
	team2?: string;
	player1?: string;
	player2?: string;
	team1Odds?: number;
	team2Odds?: number;
	player1Odds?: number;
	player2Odds?: number;
	dateTime: string;
	sport: string;
	color?: string;
}) {
	return (
		<Card>
			<CardContent>
				<div className="flex items-center justify-between mt-4 mb-2">
					<div className="flex items-center gap-2">
						<div
							className={`size-6 rounded-full ${color} p-2`}
						></div>
						<span className="font-medium">{team1 || player1}</span>
					</div>
					<div className="flex items-center gap-2">
						<span className="font-medium">
							{team1Odds || player1Odds}
						</span>
						<ArrowUpIcon className="w-4 h-4 text-green-500" />
					</div>
				</div>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<div
							className={`size-6 rounded-full ${color} p-2`}
						></div>
						<span className="font-medium">{team2 || player2}</span>
					</div>
					<div className="flex items-center gap-2">
						<span className="font-medium">
							{team2Odds || player2Odds}
						</span>
						<ArrowDownIcon className="w-4 h-4 text-red-500" />
					</div>
				</div>
				<div className="mt-4 text-center">
					<p className="text-sm text-muted-foreground">{sport}</p>
					<p className="font-medium">
						<time dateTime={dateTime}>
							{new Date(dateTime).toLocaleString("en-US", {
								month: "short",
								day: "numeric",
								hour: "numeric",
								minute: "numeric",
								hour12: true,
							})}
						</time>
					</p>
				</div>
			</CardContent>
			<CardFooter>
				<Button className="w-full bg-primaryColor hover:bg-primaryColor/90">Bet Now</Button>
			</CardFooter>
		</Card>
	);
}

function BetHistory({
	match,
	sport,
	amount,
	status,
}: {
	match: string;
	sport: string;
	amount: string;
	status: string;
}) {
	return (
		<div className="flex items-center justify-between">
			<div>
				<p className="font-medium">{match}</p>
				<p className="text-sm text-muted-foreground">{sport}</p>
			</div>
			<div className="text-right">
				<p className="font-medium">{amount}</p>
				<p className="text-sm text-muted-foreground">{status}</p>
			</div>
		</div>
	);
}
