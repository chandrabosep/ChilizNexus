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
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { client } from "@/lib/sanity";
import { v4 as uuidv4 } from "uuid";

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

export default function Admin({ data }: any) {
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
		<div className="flex flex-col gap-y-6 py-4">
			<div>
				<h1 className="text-2xl font-bold mb-4">Add New Entry</h1>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex flex-col gap-y-6"
					>
						<div className="grid md:grid-cols-2 gap-x-10">
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
							<div className="flex flex-col gap-y-6">
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
												<FormLabel>From</FormLabel>
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
												<FormLabel>To</FormLabel>
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

								<FormField
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
								/>
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
			<div className="mt-8">
				<h2 className="text-xl font-bold mb-4">Entries</h2>
				<div className="w-full bg-card rounded-lg shadow-sm mb-4">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Name</TableHead>
								<TableHead>Date</TableHead>
								<TableHead>From</TableHead>
								<TableHead>To</TableHead>
								<TableHead>Address</TableHead>
								<TableHead className="text-right">
									Price
								</TableHead>
								{/* <TableHead>Description</TableHead> */}
							</TableRow>
						</TableHeader>
						{data.events ? (
							<p className="py-6 flex items-center justify-center h-fit text-black">
								No events found
							</p>
						) : (
							<TableBody className="w-full">
								{data.events &&
									data.events?.map(
										(event: any, index: number) => (
											<TableRow key={index}>
												<TableCell className="font-medium">
													{event.name}
												</TableCell>
												<TableCell>
													{event.date}
												</TableCell>
												<TableCell>
													{event.from}
												</TableCell>
												<TableCell>
													{event.to || "N/A"}
												</TableCell>
												<TableCell>
													{event.address}
												</TableCell>
												<TableCell className="text-right">
													${event.price.toFixed(2)}
												</TableCell>
												{/* <TableCell>{event.description}</TableCell> */}
											</TableRow>
										)
									)}
							</TableBody>
						)}
					</Table>
				</div>
			</div>
		</div>
	);
}
