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

export default function CreateEvent(data: any) {
	const [components, setComponents] = useState([
		{
			id: 1,
			title: "Attendees",
			price: "1",
		},
	]);
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
	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		console.log(components);
		try {
			const eventDoc = {
				_type: "events",
				name: values.name,
				description: values.description,
				date: values.date,
				from: values.from,
				to: values.to,
				address: values.address,
				price: Number(values.price),
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
					});

				console.log("Patch result:", res);
			} else {
				console.error("Failed to create the community event.");
			}
		} catch (e) {
			console.log(e);
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
																	7
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

								{/* <FormField
									control={form.control}
									name="price"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Price</FormLabel>
											<FormControl>
												<Input
													type="number"
													placeholder="Price"
													{...field}
													onChange={(e) =>
														field.onChange(
															Number(
																e.target.value
															)
														)
													}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/> */}
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
												<span className="sr-only">
													Add component
												</span>
											</Button>
										</div>
									))}
								</div>
							</div>
						</div>

						<Button
							type="submit"
							className="w-full bg-primaryColor hover:bg-primaryColor/90"
						>
							Submit
						</Button>
					</form>
				</Form>
			</div>
		</div>
	);
}
