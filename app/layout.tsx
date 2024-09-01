import type { Metadata } from "next";
import localfont from "next/font/local";
import "./globals.css";
import Web3ModalProvider from "@/context";
import { cookieToInitialState } from "wagmi";
import { config } from "@/config";
import { headers } from "next/headers";
import Header from "@/components/Header";

const ppmori = localfont({
	src: [
		{
			path: "../public/fonts/PPMori.otf",
			weight: "400",
			style: "normal",
		},
	],
});

export const metadata: Metadata = {
	title: "ChiliZ Nexus",
	description:
		"ChilizNexus: Transforming the way crypto communities interact.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const initialState = cookieToInitialState(config, headers().get("cookie"));
	return (
		<html lang="en">
			<body className={ppmori.className}>
				<Web3ModalProvider initialState={initialState}>
					<Header />
					<div>{children}</div>
				</Web3ModalProvider>
			</body>
		</html>
	);
}
