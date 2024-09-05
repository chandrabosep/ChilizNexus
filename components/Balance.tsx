//@ts-nocheck
"use clent";
import { FanTokenAbi } from "@/contracts/FanToken";
import { NexusTokenAbi } from "@/contracts/NexusToken";
import { BAR, JUV, PSG } from "@/utils/constants";
import React, { useEffect, useState } from "react";
import { formatEther, parseEther } from "viem";
import { useAccount, useReadContract } from "wagmi";

export default function Balance() {
	const [balance, setBalance] = useState();
	const [BARbalance, setBARBalance] = useState();
	const [JUVbalance, setJUVBalance] = useState();
	const [PSGbalance, setPSGBalance] = useState();

	const { address } = useAccount();
	const {
		data: balanceNexus,
		isError,
		isLoading,
	} = useReadContract({
		abi: NexusTokenAbi.abi,
		address: NexusTokenAbi.address as `0x${string}`,
		functionName: "balanceOf",
		args: [address],
	});
	const { data: balanceBAR } = useReadContract({
		abi: FanTokenAbi,
		address: BAR as `0x${string}`,
		functionName: "balanceOf",
		args: [address],
	});
	const { data: balanceJUV } = useReadContract({
		abi: FanTokenAbi,
		address: JUV as `0x${string}`,
		functionName: "balanceOf",
		args: [address],
	});
	const { data: balancePSG } = useReadContract({
		abi: FanTokenAbi,
		address: PSG as `0x${string}`,
		functionName: "balanceOf",
		args: [address],
	});
	useEffect(() => {
		if (!isLoading && balanceNexus) {
			setBalance(balanceNexus.toString());
		}
		setBARBalance(balanceBAR?.toString());
		setJUVBalance(balanceJUV?.toString());
		setPSGBalance(balancePSG?.toString());
	}, [balanceNexus, isLoading, balanceBAR, balanceJUV, balancePSG]);
	return (
		<>
			<div className="grid grid-cols-4 gap-2 w-full max-w-3xl mx-auto">
				<div className="p-4 flex flex-col items-center gap-x-2">
					<h3 className="text-xl font-bold mb-2">Nexus Token</h3>
					<p className="text-2xl font-semibold text-gray-700">
						{balance || 0}
					</p>
				</div>
				<div className="p-4 flex flex-col items-center gap-x-2">
					<h3 className="text-xl font-bold mb-2">BAR Token</h3>
					<p className="text-2xl font-semibold text-gray-700">
						{BARbalance || 0}
					</p>
				</div>
				<div className="p-4 flex flex-col items-center gap-x-2">
					<h3 className="text-xl font-bold mb-2">JUV Token</h3>
					<p className="text-2xl font-semibold text-gray-700">
						{JUVbalance || 0}
					</p>
				</div>
				<div className="p-4 flex flex-col items-center gap-x-2">
					<h3 className="text-xl font-bold mb-2">PSG Token</h3>
					<p className="text-2xl font-semibold text-gray-700">
						{PSGbalance || 0}
					</p>
				</div>
			</div>
		</>
	);
}
