"use client";
import ClubCard from "@/components/ClubCard";
import { client } from "@/lib/sanity";
import React, { useEffect, useState } from "react";

const Clubs = () => {
	const [clubs, setClubs] = useState([]);

	useEffect(() => {
		async function getProjects() {
			const query = `*[_type == "club" && allow == true]`;
			const data = await client.fetch(query);
			setClubs(data);
		}
		getProjects();
	}, []);

	return (
		<div className="flex flex-col py-10 gap-y-10 w-full h-full max-w-screen-2xl">
			<div className="flex items-center justify-between">
				<h2 className={`text-3xl text-secondaryColor font-semibold`}>
					Clubs
				</h2>
			</div>
			<div className="flex flex-wrap items-center w-full gap-6 h-fit">
				{clubs.map((club, index) => (
					<ClubCard key={index} data={club} />
				))}
			</div>
		</div>
	);
};

export default Clubs;
