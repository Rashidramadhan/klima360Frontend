'use client';
import { AuthActions } from "@/app/auth/utils";
import { useEffect, useState } from "react";

interface Training {
    title: string;
}

interface TrainingResource {
    id: string;
    title: string;
    description: string;
    link: string;
}

export default function TrainingDetails({
    params,
}: {
    params: { trainingId: string }
}) {
    const [training, setTraining] = useState<Training | null>(null); // Store the training schedule
    const [resources, setResources] = useState<TrainingResource[]>([]); // Store the related resources
    const { getToken } = AuthActions();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = getToken('access');
                if (!token) {
                    console.error('Token is not available');
                    return; // Handle token error
                }

                const response = await fetch(`https://zero-to-one-4.onrender.com/training-resources/${params.trainingId}/`, {
                    method: "GET",
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });

                if (!response.ok) {
                    console.log('Data not received from API');
                    return;
                }

                const data = await response.json();
                console.log('Fetched data:', data); // Debugging log

                setTraining({ title: data.training }); // Set the training title
                setResources(data.resources); // Set the list of resources
            } catch (error) {
                console.error('Error fetching Resources:', error);
            }
        };

        fetchData();
    }, [params.trainingId]);

    if (!training) return <p>Loading...</p>;

    return (
        <div className="container mx-auto bg-green-300 py-1 px-1">
            <h2 className="text-lg font-semibold text-white uppercase dark:text-white">
                {training.title || "No training schedule available"}
            </h2>

            {resources.length > 0 ? (
                resources.map(resource => (
                    <div key={resource.id} className="max-w-sm w-full lg:max-w-full lg:flex">
                        <div className="border-r border-b border-l border-gray-0 lg:border-l-0 lg:border-t lg:border-gray-0 bg-green-300 rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
                            <div className="mb-8">
                                <div className="text-green-900 font-bold text-xl mb-2">
                                    {resource.title || "No title available"}
                                </div>
                                <p className="text-green-700 text-base">
                                    {resource.description || "No description available"}
                                </p>
                            </div>
                            <div className="flex items-center">
                                <div className="text-sm">
                                    <p className="text-green-800">
                                        Video Link: <a href={resource.link} target="_blank" rel="noopener noreferrer">{resource.link || "No link available"}</a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <p>No resources available for this training.</p>
            )}
        </div>
    );
}
