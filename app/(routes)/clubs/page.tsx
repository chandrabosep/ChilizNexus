import ClubCard from "@/components/ClubCard";
import React from "react";

const Clubs = () => {
	return (
		<div className="flex flex-col py-6 gap-y-10 w-full max-w-screen-2xl">
			<div className="flex items-center justify-between">
				<h2 className={`text-3xl text-secondaryColor font-semibold`}>
					Clubs
				</h2>
			</div>
			<div className="flex flex-wrap items-center w-full gap-6">
				<ClubCard />
			</div>
		</div>
	);
};

export default Clubs;
