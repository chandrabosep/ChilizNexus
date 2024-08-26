import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeftRightIcon } from "lucide-react";
import React from "react";

export default function Bridge() {
	return (
		<div className="flex flex-col py-20 gap-y-10 w-full h-full max-w-screen-2xl">
			<div className="flex items-center justify-between">
				<h2
					className={`text-3xl text-secondaryColor font-semibold mx-auto`}
				>
					{`Bridge any fan tokens(CAP20) to Nexus tokens(CAP223)`}
				</h2>
			</div>
			<div className="max-w-screen-md mx-auto flex flex-col gap-y-10">
				<div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 ">
					<div className="space-y-2">
						<Label htmlFor="from">From</Label>
						<Input id="from" placeholder="0.0" />
					</div>
					<div className="flex items-center justify-center">
						<ArrowLeftRightIcon className="h-6 w-6 text-muted-foreground" />
					</div>
					<div className="space-y-2">
						<Label htmlFor="to">To</Label>
						<Input id="to" placeholder="0.0" />
					</div>
				</div>
				<Button className="w-full bg-primaryColor hover:bg-primaryColor/90">
					Convert
				</Button>
				<div className="space-y-2 text-center">
					<h3 className="text-lg font-medium">Supported fan Tokens</h3>
					<p className="text-muted-foreground">BAR, PSG, JUV</p>
				</div>
			</div>
		</div>
	);
}
