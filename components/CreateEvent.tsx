//@ts-nocheck
"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { client } from "@/lib/sanity";
import { v4 as uuidv4 } from "uuid";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { useAccount, useSwitchChain, useWriteContract } from "wagmi";
import { SignProtocolClient, SpMode, EvmChains } from "@ethsign/sp-sdk";
import { parseEther } from "viem";
import { EventGateAbi } from "@/contracts/EventGate";
import { useToast } from "@/hooks/use-toast";

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
});

export default function CreateEvent({ data }: any) {
	const { chains, switchChain } = useSwitchChain<any>();
	const { address: ConnectedAddress } = useAccount<any>();
	const fanToken = data?.fanTokenAddress;
	const [components, setComponents] = useState([
		{
			id: 1,
			title: "Attendees",
			price: "1",
		},
	]);
	const { writeContract, isSuccess, error } = useWriteContract();
	const [parseId, setParseId] = useState<any>();
	const [values, setValues] = useState();
	const [disabled, setDisabled] = useState(true);
	const SignClient = new SignProtocolClient(SpMode.OnChain, {
		chain: EvmChains.baseSepolia,
	});
	const { toast } = useToast();

	const addComponent = () => {
		const newComponent = {
			id: components.length + 1,
			title: ``,
			price: "",
		};
		setComponents([...components, newComponent]);
	};

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
				functionName: "registerLiveEvent",
				args: [
					parseId,
					fanToken,
					ConnectedAddress as `0x${string}`,
					//@ts-ignore
					new Date(values?.date || "1729123200")
						.getTime()
						.toString()
						.slice(0, 10),
					components.map((component) =>
						component.title.toUpperCase()
					),
					components.map((component) => parseEther(component.price)),
					components.map(() => `250`),
				],
			});

			const eventDoc = {
				_type: "events",
				name: values?.name,
				description: values?.description,
				date: values?.date,
				from: values?.from,
				to: values?.to,
				address: values?.address,
				price: Number(values?.price),
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
					.setIfMissing({ events: [] })
					.insert("after", "events[-1]", [
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
						new Promise((resolve) => setTimeout(resolve, 3000));
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
				eventType: 0,
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
	};
	return (
		<div>
			<div className="border-r-4 border-x-gray-200 pr-8 w-full">
				<h1 className="text-2xl font-bold mb-4 w-full">
					Create Live Event
				</h1>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex flex-col gap-y-6 w-full"
					>
						<div className="w-full">
							<div className="flex flex-col gap-y-6">
								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Name</FormLabel>
											<FormControl>
												<Input
													placeholder="Event Name"
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
											<FormLabel>Description</FormLabel>
											<FormControl>
												<Textarea
													rows={6}
													placeholder="What is the event about?"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="address"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Address</FormLabel>
											<FormControl>
												<Textarea
													rows={6}
													placeholder="Address of event"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<div className="flex flex-col gap-y-6 w-full">
								<FormField
									control={form.control}
									name="date"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Date</FormLabel>
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
								<div className="grid grid-cols-2 gap-x-4">
									<FormField
										control={form.control}
										name="from"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Time From</FormLabel>
												<FormControl>
													<Input
														placeholder="10:00 AM"
														{...field}
													/>
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
												<FormLabel>Time To</FormLabel>
												<FormControl>
													<Input
														placeholder="11:00 PM"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<div className="w-full flex flex-col gap-y-4">
									<h4 className="text-lg font-medium">
										Tickets
									</h4>
									{components.map((component) => (
										<div
											key={component.id}
											className="flex items-center justify-between gap-x-4"
										>
											<div className="flex gap-x-2 w-full">
												<Input
													type="text"
													value={component.title}
													className="w-full"
													onChange={(e) =>
														setComponents(
															components.map(
																(c) =>
																	c.id ===
																	component.id
																		? {
																				...c,
																				title: e
																					.target
																					.value,
																		  }
																		: c
															)
														)
													}
												/>
												<Input
													type="text"
													value={component.price}
													className="w-full"
													onChange={(e) =>
														setComponents(
															components.map(
																(c) =>
																	c.id ===
																	component.id
																		? {
																				...c,
																				price: e
																					.target
																					.value,
																		  }
																		: c
															)
														)
													}
												/>
											</div>
											<Button
												variant="outline"
												size="icon"
												type="button"
												className="text-primary hover:bg-primary hover:text-primary-foreground"
												onClick={addComponent}
											>
												<PlusIcon className="w-5 h-5" />
											</Button>
										</div>
									))}
								</div>
							</div>
						</div>
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
		</div>
	);
}
