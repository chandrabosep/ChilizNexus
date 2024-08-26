import React from "react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import Link from "next/link";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { BellIcon } from "lucide-react";

export default function ClubSub() {
	const showNotification = true;
	return (
		<div>
			{" "}
			<section className="bg-background py-12 md:py-16 lg:py-20">
				<div className="container">
					<div className="mx-auto max-w-2xl text-center">
						{showNotification ? (
							<>
								<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
									Official updates
								</h2>
								<Alert className="mt-6">
									<BellIcon className="h-5 w-5" />
									<AlertDescription className="text-left ml-4">
										A new version of our product is now
										available. Please update to the latest
										version to enjoy the new features.
									</AlertDescription>
								</Alert>
							</>
						) : (
							<div className="mt-6 flex flex-col gap-y-4">
								<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
									Subscribe to get official updates
								</h2>
								<form className="flex items-center justify-center gap-2 ">
									{/* <Input
										type="email"
										placeholder="Enter your email"
										className="flex-1"
									/> */}
									<Button type="submit">Subscribe</Button>
								</form>
								<p className="mt-2 text-sm text-muted-foreground">
									{`We'll never share your email. Read our`}
									<Link
										href="#"
										className="underline"
										prefetch={false}
									>
										privacy policy
									</Link>
									.
								</p>
							</div>
						)}
					</div>
				</div>
			</section>
		</div>
	);
}
