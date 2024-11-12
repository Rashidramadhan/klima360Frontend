
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
  const [interested_topics, setInterested_topics] = useState([]);
  const { getToken } = AuthActions()
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getToken('access')
        const response = await fetch('https://zero-to-one-4.onrender.com/dashboard/', {
          method: "GET",
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        const data = await response.json();
        setTrainings(data.available_trainings);
        setInterested_topics(data.training_schedules)
        console.log(data, '************************')
        
      } catch (error) {
        console.error('Error fetching training schedules:', error);
      }
    };
  
    fetchData();
  }, [getToken]);

  

  const handleTrainingClick = (trainingId: string | undefined) => {
    router.push(`/dashboard/${trainingId}`);
  };
  
  return (
    <div className="container grid-rows-2 grid-flow-row bg-green-200 border-separate">
      <div className="bg-emerald-200 py-1 px-1 ">
      <h2 className="text-3xl font-bold text-sky-900 items-center mb-2">
                      My Intrested Topics
                  </h2>
      {interested_topics.map((interested_topic: {
                        id: string | undefined; topic: string, title: string, description: string, start_time: string

}) => (
  <div key={interested_topic.id} className="max-w-sm w-full lg:max-w-full lg:flex bg-green-300">
  <div className="rounded-b lg:rounded-b-none lg:rounded-r p-4 justify-between">
    <div className="grid grid-cols-3 border-green-400 auto-cols-fr mb-1">
      {/* <h2 className="text-lg font-semibold text-white uppercase dark:text-white">
        { interested_topic.topic }
      </h2> */}
      <div className="text-green-900 font-bold text-xl mb-2">{ interested_topic.title}</div>
      <p className="text-green-700 text-base mb-2 line-clamp-6">{ interested_topic.description }</p>
      <div className="flex items-center mb-2 px-2 py-2">
      <div className="text-sm font-bold">
      <p className="text-red-400 mb-2">Start Date: { interested_topic.start_time }</p>
        <button className="border-2 border-green-600 rounded-full px-8 py-2 inline-block font-semibold hover:bg-green-600
                     hover:text-white text-green-900" onClick={() => handleTrainingClick(interested_topic.id)}>Enroll Training</button>
        
      </div>
    </div>
    </div>
    
  </div>
</div>
))}
      </div>
          <div className="bg-teal-300 py-1 px-1">
          <h2 className="text-3xl font-bold text-sky-950 mb-2">
                      Available Topics
                  </h2>
      {trainings.map((training: {
                        id: string | undefined; topic: string, title: string, description: string, start_time: string

}) => (
  <div key={training.id} className="max-w-sm w-full lg:max-w-full lg:flex">
  <div className="rounded-b lg:rounded-b-none lg:rounded-r p-4 justify-between">
    <div className="grid grid-cols-3 border-green-400 auto-cols-fr mb-1">
      {/* <h2 className="text-lg font-semibold text-white uppercase dark:text-white">
        { interested_topic.topic }
      </h2> */}
      <div className="text-green-900 font-bold text-xl mb-2">{ training.title}</div>
      {/* <p className="text-green-700 text-base mb-2 line-clamp-1">{ training.description }</p> */}
      <div className="flex items-center mb-2 px-4 py-2">
      <div className="text-sm font-bold">
      <p className="text-red-400 mb-2">Start Date: { training.start_time }</p>
        <button className="border-2 border-green-600 rounded-full px-8 py-2 inline-block font-semibold hover:bg-green-600
                     hover:text-white text-green-900" onClick={() => handleTrainingClick(training.id)}>Enroll Training</button>
        
      </div>
    </div>
    </div>
    
  </div>
</div>
))}
          </div>
</div>
  );
};
