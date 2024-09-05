"use client";
import React, { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import Link from "next/link";
import { Button } from "./ui/button";
import { BellIcon } from "lucide-react";

export default function ClubSub({ data }: any) {
	const [updated, setUpdated] = useState(false);
	const isSubscribed = localStorage.getItem(`${data._id}`);
	const showNotification = isSubscribed ? JSON.parse(isSubscribed) : false;
 useEffect(() => {
	 
 },[updated])
	return (
		<div>
			<section className="bg-background py-12 md:py-16 lg:py-20">
				<div className="container">
					<div className="mx-auto max-w-2xl text-center">
						{showNotification ? (
							<>
								<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
									Official updates
								</h2>
								{data.notifications &&
								data.notifications.length > 0 ? (
									data.notifications
										?.reverse()
										?.map((notification: any) => (
											<Alert
												key={notification.id}
												className="mt-6"
											>
												<BellIcon className="h-5 w-5" />
												<div className="ml-4 text-left">
													<AlertTitle>
														{notification.name}
													</AlertTitle>
													<AlertDescription>
														{
															notification.description
														}
													</AlertDescription>
												</div>
											</Alert>
										))
								) : (
									<p className="mt-6 text-lg">
										No notifications yet
									</p>
								)}
							</>
						) : (
							<div className="mt-6 flex flex-col gap-y-8">
								<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
									Subscribe to get official updates
								</h2>
								<Button
									type="submit"
									className="w-fit mx-auto bg-primaryColor hover:bg-primaryColor/90"
									onClick={() => {
										localStorage.setItem(
											`${data._id}`,
											JSON.stringify(true)
										);
										setUpdated(true);
									}}
								>
									Subscribe
								</Button>
								<p className="mt-2 text-sm text-secondaryColor/60">
									{`We'll never share your email. Read our `}
									Fully onchain subscription by XMTP
								</p>
							</div>
						)}
					</div>
				</div>
			</section>
		</div>
	);
}
