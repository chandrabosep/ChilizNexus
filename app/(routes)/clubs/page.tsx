import ClubCard from "@/components/ClubCard";
import React from "react";

const Clubs = () => {
	return (
		<div className="flex flex-col py-6 gap-y-10 w-full h-full max-w-screen-2xl">
			<div className="flex items-center justify-between">
				<h2 className={`text-3xl text-secondaryColor font-semibold`}>
					Clubs
				</h2>
			</div>
			<div className="flex flex-wrap items-center w-full gap-6 h-fit">
				{[
					{
						title: "FC Barcelona",
						img: "/fcb.jpeg",
						desc: "Join the on-chain community of FC Barcelona fans, where the spirit of the Blaugrana lives on the blockchain. Connect with fellow supporters, participate in exclusive digital events, and engage in decentralized voting on club decisions. Whether it's celebrating victories or influencing future projects, this is the ultimate digital hub for true Barça enthusiasts",
					},
					{
						title: "Paris Saint-Germain",
						img: "/par.jpg",
						desc: "Step into the world of Paris Saint-Germain on the blockchain. As a member of this on-chain club, you can participate in unique NFT drops, vote on club initiatives, and be part of a global network of PSG fans. From virtual meetups to fan-driven content, experience the magic of Les Parisiens in the digital era",
					},
					{
						title: "Juventus F.C",
						img: "/juv.jpg",
						desc: "Welcome to the Juventus on-chain club, where Bianconeri fans converge in the digital realm. Take part in decentralized decision-making, access exclusive content, and showcase your passion with Juventus-themed NFTs. This is where tradition meets technology, allowing you to play an active role in the future of your beloved club",
					},
				].map((club, index) => (
					<ClubCard key={index} data={club} />
				))}
			</div>
		</div>
	);
};

export default Clubs;
