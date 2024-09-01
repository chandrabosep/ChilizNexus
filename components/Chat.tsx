import React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { SendIcon, XIcon } from "lucide-react";

export default function Chat() {
	return (
		<div>
			<div className="flex flex-col h-[40vh]">
				<div className="flex-1 overflow-auto p-4 space-y-4">
					<div className="flex items-start gap-3">
						<div className="size-6 bg-primaryColor/50 p-1 rounded-full"></div>

						<div className="bg-muted rounded-lg p-3 max-w-[75%]">
							<p>{`Chiliz is the best network?`}</p>
							<p className="text-xs text-muted-foreground mt-1">
								10:30 AM
							</p>
						</div>
					</div>
					<div className="flex items-start gap-3 justify-end">
						<div className="bg-primary rounded-lg p-3 min-w-[10rem] max-w-[75%] text-primary-foreground">
							<p>{`I agree `}</p>
							<p className="text-xs text-primary-foreground/80 mt-1">
								10:31 AM
							</p>
						</div>
						<div className="size-6 bg-primary p-1 rounded-full"></div>
					</div>
				</div>
				<div className="bg-background border-t px-4 py-3 flex items-center gap-2">
					<Input
						type="text"
						placeholder="Type your message..."
						className="flex-1"
					/>
					<Button type="submit" className="bg-primaryColor">
						<SendIcon className="w-4 h-4" />
						<span className="sr-only">Send</span>
					</Button>
				</div>
			</div>
		</div>
	);
}
