import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import CreateUpdate from "./CreateUpdate";
import CreateEvent from "./CreateEvent";

export default function Admin({ data }: any) {
	console.log(data.events);
	return (
		<div className="flex flex-col gap-y-6 py-4">
			<div className="grid md:grid-cols-2 gap-x-10">
				<CreateEvent data={data} />
				<div>
					<h2 className="text-xl font-bold mb-4">Updates</h2>
					<CreateUpdate data={data} />
				</div>
			</div>
			<div className="mt-8">
				<h2 className="text-xl font-bold mb-4">Events</h2>
				<div className="w-full bg-card rounded-lg shadow-sm mb-4">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Name</TableHead>
								<TableHead>Date</TableHead>
								<TableHead>From</TableHead>
								<TableHead>To</TableHead>
								<TableHead>Address</TableHead>
								{/* <TableHead className="text-right">
									Price
								</TableHead> */}
								{/* <TableHead>Description</TableHead> */}
							</TableRow>
						</TableHeader>
						{!data.events ? (
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
												{/* <TableCell className="text-right">
													${event.price.toFixed(2)}
												</TableCell> */}
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
