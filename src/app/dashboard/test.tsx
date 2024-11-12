
"use client";
// import Image from "next/image";
// import farming from "@/app/farming.jpeg";
// import Link from "next/link";
import React, { useEffect, useState } from "react";
import { AuthActions } from '@/app/auth/utils'
import { useRouter } from "next/navigation";
// import useSWR from "swr";
// import { fetcher } from "@/app/fetcher";
// import { useRouter } from "next/navigation";

export default function Dashboard() {
  // const router = useRouter();

  // const { data: user } = useSWR("/auth/users/me", fetcher);
  const [trainings, setTrainings] = useState([]);
  const { getToken } = AuthActions()
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getToken('access')
        const response = await fetch('http://localhost:8000/dashboard/', {
          method: "GET",
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        const data = await response.json();
        setTrainings(data);
        console.log(data)
        
      } catch (error) {
        console.error('Error fetching training schedules:', error);
      }
    };
  
    fetchData();
  }, [getToken]);
  console.log(trainings,'---------------------')
  console.log(typeof(trainings))

  const handleTrainingClick = (trainingId: string | undefined) => {
    router.push(`/dashboard/${trainingId}`);
  };
  
  return (
    <div className="container mx-auto bg-green-300 py-1 px-1">
      {trainings.map((training: {
                        id: string | undefined; topic: string, title: string, description: string, start_time: string

}) => (
  <div key={training.id} className="max-w-sm w-full lg:max-w-full lg:flex">
  <div className="bg-green-300 rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-white uppercase dark:text-white">
        { training.topic }
      </h2>
      <div className="text-green-900 font-bold text-xl mb-2">{ training.title}</div>
      <p className="text-green-700 text-base">{ training.description }</p>
    </div>
    <div className="flex items-center">
      <div className="text-sm">
        <button className="border-2 border-green-600 rounded-full px-8 py-2 inline-block font-semibold hover:bg-green-600
                     hover:text-white text-green-900" onClick={() => handleTrainingClick(training.id)}>Enroll Training</button>
        <p className="text-green-800">Start Date: { training.start_time }</p>
      </div>
    </div>
  </div>
</div>
))}
</div>
  );
};
