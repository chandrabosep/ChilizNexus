import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import Image from "next/image";
import React from "react";

export default function page() {
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
								<Select id="sport" className="w-full">
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
								<Select id="league" className="w-full">
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
							<div className="flex items-center justify-between">
								<div>
									<p className="font-medium">
										Barcelona vs Real Madrid
									</p>
									<p className="text-sm text-muted-foreground">
										Football
									</p>
								</div>
								<div className="text-right">
									<p className="font-medium">$20</p>
									<p className="text-sm text-muted-foreground">
										Won
									</p>
								</div>
							</div>
							<div className="flex items-center justify-between">
								<div>
									<p className="font-medium">
										Golden State vs Lakers
									</p>
									<p className="text-sm text-muted-foreground">
										Basketball
									</p>
								</div>
								<div className="text-right">
									<p className="font-medium">$10</p>
									<p className="text-sm text-muted-foreground">
										Lost
									</p>
								</div>
							</div>
							<div className="flex items-center justify-between">
								<div>
									<p className="font-medium">
										Federer vs Nadal
									</p>
									<p className="text-sm text-muted-foreground">
										Tennis
									</p>
								</div>
								<div className="text-right">
									<p className="font-medium">$15</p>
									<p className="text-sm text-muted-foreground">
										Won
									</p>
								</div>
							</div>
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
						<Card>
							<CardContent>
								<div className="flex items-center justify-between mt-4 mb-2">
									<div className="flex items-center gap-2">
										<div className="size-6 rounded-full bg-secondaryColor p-2"></div>

										<span className="font-medium">
											Team 1
										</span>
									</div>
									<div className="flex items-center gap-2">
										<span className="font-medium">2.5</span>
										<ArrowUpIcon className="w-4 h-4 text-green-500" />
									</div>
								</div>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<div className="size-6 rounded-full bg-secondaryColor p-2"></div>
										<span className="font-medium">
											Team 2
										</span>
									</div>
									<div className="flex items-center gap-2">
										<span className="font-medium">1.8</span>
										<ArrowDownIcon className="w-4 h-4 text-red-500" />
									</div>
								</div>
								<div className="mt-4 text-center">
									<p className="text-sm text-muted-foreground">
										Football - Premier League
									</p>
									<p className="font-medium">
										<time dateTime="2023-05-01T15:00:00">
											Nov 1, 3:00 PM
										</time>
									</p>
								</div>
							</CardContent>
							<CardFooter>
								<Button className="w-full bg-primaryColor">
									Bet Now
								</Button>
							</CardFooter>
						</Card>
						<Card>
							<CardContent>
								<div className="flex items-center justify-between mt-4 mb-2">
									<div className="flex items-center gap-2">
										<div className="size-6 rounded-full bg-secondaryColor p-2"></div>
										<span className="font-medium">
											Team 3
										</span>
									</div>
									<div className="flex items-center gap-2">
										<span className="font-medium">1.9</span>
										<ArrowUpIcon className="w-4 h-4 text-green-500" />
									</div>
								</div>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<div className="size-6 rounded-full bg-secondaryColor p-2"></div>

										<span className="font-medium">
											Team 4
										</span>
									</div>
									<div className="flex items-center gap-2">
										<span className="font-medium">2.1</span>
										<ArrowDownIcon className="w-4 h-4 text-red-500" />
									</div>
								</div>
								<div className="mt-4 text-center">
									<p className="text-sm text-muted-foreground">
										Basketball - NBA
									</p>
									<p className="font-medium">
										<time dateTime="2023-05-02T19:30:00">
											Nov 2, 7:30 PM
										</time>
									</p>
								</div>
							</CardContent>
							<CardFooter>
								<Button className="w-full bg-primaryColor">
									Bet Now
								</Button>
							</CardFooter>
						</Card>
						<Card>
							<CardContent>
								<div className="flex items-center justify-between mt-4 mb-2">
									<div className="flex items-center gap-2">
										<div className="size-6 rounded-full bg-secondaryColor p-2"></div>

										<span className="font-medium">
											Player 1
										</span>
									</div>
									<div className="flex items-center gap-2">
										<span className="font-medium">1.6</span>
										<ArrowUpIcon className="w-4 h-4 text-green-500" />
									</div>
								</div>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<div className="size-6 rounded-full bg-secondaryColor p-2"></div>

										<span className="font-medium">
											Player 2
										</span>
									</div>
									<div className="flex items-center gap-2">
										<span className="font-medium">2.4</span>
										<ArrowDownIcon className="w-4 h-4 text-red-500" />
									</div>
								</div>
								<div className="mt-4 text-center">
									<p className="text-sm text-muted-foreground">
										Tennis - ATP
									</p>
									<p className="font-medium">
										<time dateTime="2023-05-03T11:00:00">
											Nov 3, 11:00 AM
										</time>
									</p>
								</div>
							</CardContent>
							<CardFooter>
								<Button className="w-full bg-primaryColor">
									Bet Now
								</Button>
							</CardFooter>
						</Card>
						<Card>
							<CardContent>
								<div className="flex items-center justify-between mt-4 mb-2">
									<div className="flex items-center gap-2">
										<div className="size-6 rounded-full bg-secondaryColor p-2"></div>
										<span className="font-medium">
											Team 5
										</span>
									</div>
									<div className="flex items-center gap-2">
										<span className="font-medium">2.3</span>
										<ArrowUpIcon className="w-4 h-4 text-green-500" />
									</div>
								</div>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<div className="size-6 rounded-full bg-secondaryColor p-2"></div>

										<span className="font-medium">
											Team 6
										</span>
									</div>
									<div className="flex items-center gap-2">
										<span className="font-medium">1.7</span>
										<ArrowDownIcon className="w-4 h-4 text-red-500" />
									</div>
								</div>
								<div className="mt-4 text-center">
									<p className="text-sm text-muted-foreground">
										Baseball - MLB
									</p>
									<p className="font-medium">
										<time dateTime="2023-05-04T14:00:00">
											Nov 4, 2:00 PM
										</time>
									</p>
								</div>
							</CardContent>
							<CardFooter>
								<Button className="w-full bg-primaryColor">
									Bet Now
								</Button>
							</CardFooter>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
