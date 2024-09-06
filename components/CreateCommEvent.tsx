//@ts-nocheck
"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "./ui/input";
import { client } from "@/lib/sanity";
import { Textarea } from "./ui/textarea";
import { v4 as uuidv4 } from "uuid";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";
import { EvmChains, SignProtocolClient, SpMode } from "@ethsign/sp-sdk";
import { useAccount, useSwitchChain, useWriteContract } from "wagmi";
import { useToast } from "@/hooks/use-toast";
import { EventGateAbi } from "@/contracts/EventGate";

const formSchema = z.object({
	name: z.string().min(1, { message: "Name is required" }),
	description: z.string().min(1, { message: "Description is required" }),
	date: z.string().refine((val) => !isNaN(Date.parse(val)), {
		message: "Invalid date format",
	}),
	from: z.string().min(1, { message: "From is required" }),
	to: z.string().min(1, { message: "To is required" }),
	address: z.string().min(1, { message: "Address is required" }),
	price: z.number(),
	wallet: z.string().min(1, { message: "Wallet is required" }),
	type: z.string().min(1, { message: "Type is required" }),
});
export default function CreateCommEvent({ data }: any) {
	const { chains, switchChain } = useSwitchChain<any>();
	const { address: ConnectedAddress } = useAccount<any>();
	const fanToken = data?.fanTokenAddress;
	const { writeContract, isSuccess, error } = useWriteContract();
	const [parseId, setParseId] = useState<any>();
	const [values, setValues] = useState();
	const [disabled, setDisabled] = useState(true);
	const SignClient = new SignProtocolClient(SpMode.OnChain, {
		chain: EvmChains.baseSepolia,
	});
	const { toast } = useToast();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			description: "",
			date: new Date().toISOString().split("T")[0],
			from: "",
			to: "",
			address: "",
			price: 0,
			wallet: "",
			type: "",
		},
	});

	async function createEventAttestation(contractDetails: any) {
		try {
			const res = await SignClient.createAttestation({
				schemaId: "0x1dc",
				data: contractDetails,
				indexingValue: ConnectedAddress?.toLowerCase() as `0x${string}`,
			});
			console.log(res);
			return res;
		} catch (error) {
			console.error("Error during attestation creation: ", error);
		}
	}

	async function eventCreate() {
		try {
			writeContract({
				abi: EventGateAbi.abi,
				address: EventGateAbi.address as `0x${string}`,
				functionName: "registerCommunityEvent",
				args: [
					parseId,
					fanToken,
					ConnectedAddress as `0x${string}`,
					//@ts-ignore
					new Date(values?.date || "1729123200")
						.getTime()
						.toString()
						.slice(0, 10),
					`250`,
				],
			});
			const eventDoc = {
				_type: "communityEvents",
				name: values.name,
				description: values.description,
				date: values.date,
				from: values.from,
				to: values.to,
				address: values.address,
				price: Number(values.price),
				wallet: values.wallet,
				type: values.type,
				eventId: parseId,
			};
			const createdEvent = await client.create(eventDoc, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${process.env.NEXT_PUBLIC_SANITY_TOKEN}`,
				},
			});
			if (createdEvent._id) {
				const res = await client
					.patch(data._id)
					.setIfMissing({ communityEvents: [] })
					.insert("after", "communityEvents[-1]", [
						{
							_key: uuidv4(),
							_type: "reference",
							_ref: createdEvent._id,
						},
					])
					.commit({
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${process.env.NEXT_PUBLIC_SANITY_TOKEN}`,
						},
					})
					.then(() => {
						new promise((resolve) => setTimeout(resolve, 3000));
						toast({
							title: "Event created successfully",
							description:
								"You can now view it in the events tab",
						});
					});
			} else {
				toast({
					title: "Failed to create event",
					variant: "destructive",
				});
			}
		} catch (error) {
			console.error("Error in eventCreate:", error);
		}
	}

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		// @ts-ignore
		setValues(values);
		try {
			switchChain({ chainId: 84532 });

			const attestValues = {
				fanTokenAddress: fanToken,
				eventName: values.name,
				eventType: values.type === "offline" ? 2 : 1,
				eventLocation: values.address.slice(0, 20),
				eventTimestamp: Math.floor(
					new Date(values.date).getTime() / 1000
				),
				ticketLimit: "250",
				metadata: values.description,
			};

			const res = await createEventAttestation(attestValues);
			console.log("createEventAttestation response:", res);

			if (!res || !res.attestationId) {
				throw new Error("attestationId not found in response");
			}

			const { attestationId } = res;
			// @ts-ignore
			const id = parseInt(attestationId);
			console.log("attestationId:", id);
			setParseId(id?.toString());
			setDisabled(false);

			await new Promise((resolve) => setTimeout(resolve, 3000));
			switchChain({ chainId: 88882 });
		} catch (error) {
			console.error("Error in onSubmit:", error);
		}

		// try {
		// 	const eventDoc = {
		// 		_type: "communityEvents",
		// 		name: values.name,
		// 		description: values.description,
		// 		date: values.date,
		// 		from: values.from,
		// 		to: values.to,
		// 		address: values.address,
		// 		price: Number(values.price),
		// 		wallet: values.wallet,
		// 		type: values.type,
		// 	};
		// 	const createdEvent = await client.create(eventDoc, {
		// 		headers: {
		// 			"Content-Type": "application/json",
		// 			Authorization: `Bearer ${process.env.NEXT_PUBLIC_SANITY_TOKEN}`,
		// 		},
		// 	});
		// 	if (createdEvent._id) {
		// 		const res = await client
		// 			.patch(data._id)
		// 			.setIfMissing({ communityEvents: [] })
		// 			.insert("after", "communityEvents[-1]", [
		// 				{
		// 					_key: uuidv4(),
		// 					_type: "reference",
		// 					_ref: createdEvent._id,
		// 				},
		// 			])
		// 			.commit({
		// 				headers: {
		// 					"Content-Type": "application/json",
		// 					Authorization: `Bearer ${process.env.NEXT_PUBLIC_SANITY_TOKEN}`,
		// 				},
		// 			});

		// 		console.log("Patch result:", res);
		// 	} else {
		// 		console.error("Failed to create the community event.");
		// 	}
		// } catch (e) {
		// 	console.log(e);
		// }
	};

	return (
		<div>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-8"
				>
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input
										placeholder="Name your event"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="description"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Textarea
										placeholder="Description"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="flex items-center w-full gap-x-6">
						<FormField
							control={form.control}
							name="date"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											type="date"
											placeholder="Date of event"
											{...field}
											min={
												new Date(
													new Date().setDate(
														new Date().getDate() +
															30
													)
												)
													.toISOString()
													.split("T")[0]
											}
											className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="type"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Select
											onValueChange={(value) =>
												field.onChange(value)
											}
											value={field.value}
										>
											<SelectTrigger className="min-w-[18rem]">
												<SelectValue placeholder="Event Type" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="offline">
													Community
												</SelectItem>
												<SelectItem value="virtual">
													Virtual
												</SelectItem>
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<div className="flex items-center justify-between">
						<FormField
							control={form.control}
							name="from"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input placeholder="From" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="to"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input placeholder="To" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<FormField
						control={form.control}
						name="address"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input placeholder="Address" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="price"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input
										type="number"
										placeholder="Price"
										{...field}
										onChange={(e) =>
											field.onChange(
												Number(e.target.value)
											)
										}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="wallet"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input
										placeholder="Wallet Address"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="flex items-center gap-x-4">
						<Button
							type="submit"
							className={`w-full ${
								!disabled
									? "cursor-not-allowed bg-primaryColor/70 hover:bg-primaryColor/70"
									: "bg-primaryColor hover:bg-primaryColor"
							}`}
						>
							Attest Event onchain
						</Button>
						<Button
							type="button"
							onClick={() => eventCreate()}
							disabled={disabled}
							className={`w-full ${
								disabled
									? "cursor-not-allowed bg-primaryColor/70 "
									: "bg-primaryColor hover:bg-primaryColor"
							}`}
						>
							Create Event
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}
