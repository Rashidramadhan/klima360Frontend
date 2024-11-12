
"use client";
import React, { useEffect, useState } from "react";
// import useSWR from "swr";
// import { fetcher } from "@/app/fetcher";
import { useRouter } from "next/navigation";
import { AuthActions } from '@/app/auth/utils'
import { toast } from "sonner";

interface Topic {
  id: number;
  name: string;
}
export default function Profile() {
const router = useRouter()


  const [phone_number, setPhone_number] = useState('')
  const [location, setLocation] = useState('')
  const [experience_level, setExperience_level] = useState('Beginner')
  const [interested_topics, setInterested_topics] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const [topics, setTopics] = useState<Topic[]>([]);
  const { getToken } = AuthActions()
 
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://zero-to-one-4.onrender.com/topics/', {
          method: "GET",
        });
        const data = await response.json();
        setTopics(data);
        console.log(data,'-----------------')
      } catch (error) {
        console.error('Error fetching topics:', error);
      }
    };
  
    fetchData();
  }, [getToken]);
  
  const handleChange = (event:React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    const newTopics = [...interested_topics];
    if (isChecked){
      newTopics.push(event.target.id);
    }
    else{
      const index = newTopics.indexOf(event.target.id);
      newTopics.splice(index,1);
    }
    setInterested_topics(newTopics)
  };


  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault()
    setIsLoading(true)
    const email = localStorage.getItem("userEmail");
    const user_profile = {
      phone_number, location, experience_level, interested_topics, email
    }
    // const { getToken } = AuthActions()
    // const token = getToken('access')
    console.log(user_profile, '-------------------------')
    const res = await fetch('http://localhost:8000/profile/', {
      method: "POST",
      headers: {
        // "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"},
      body: JSON.stringify(user_profile)
    })

    if (res.status === 200) {
      const data = await res.json();
      const { first_time_profile } = data;
      // alert("Profile Updated successfully");
      toast.success("Profile Updated Successfully!");
      if (first_time_profile) {
        toast.success("Profile Created Successfully!");
        router.push("/");  // Redirect to home page if it's the first time
      }
      router.push('dashboard');
    }
    console.log(user_profile);
  };
  
  
    // const { data: user } = useSWR("/auth/users/me", fetcher);
 
    
    return(
        <div className="px-4 py-4 bg-green-200 text-gray-900 antialiased items-center">
        <form className="flex w-full max-w-lg items-center" onSubmit={handleSubmit}>
          <div className="mx-auto max-w-xl  divide-y py-12 md:max-w-4xl">
            <div className="py-8 bg-green-300 rounded-2xl">
              <div className="py-12 items-center justify-center px-8">
                <h2 className="text-3xl font-bold text-white mb-2 items-center justify-center">
                                    <span className="text-green-800">Complete</span> Your Profile
                                </h2>
                                
                <div className="mt-8 max-w-md">
                  <div className="grid grid-cols-1 gap-6">
                    <label className="block">
                      <span className="text-gray-700 font-bold">Phone Number</span>
                      <input type="text" name = "phone_number" className="mt-1 block w-full rounded-md border-transparent   
                       bg-gray-100 focus:border-gray-500 focus:bg-white focus:ring-0 px-2"placeholder="" 
                        onChange={(e) => setPhone_number(e.target.value)} value={phone_number}/>
                    </label>
                    <label className="block">
                      <span className="text-gray-700 font-bold">Location</span>
                      <input type="text" name= "location"className="mt-1 block w-full rounded-md border-transparent   
                        bg-gray-100 focus:border-gray-500 focus:bg-white focus:ring-0 px-2"placeholder=""
                        onChange={(e) => setLocation(e.target.value)} value={location}/>
                    </label>
                    <label className="block">
                      <span className="text-gray-700 font-bold">Experience Level</span>
                      <select
                        className="mt-1 block w-full rounded-md border-transparent bg-gray-100 focus:border-gray-500 focus:bg-white focus:ring-0"
                        onChange={(e) => setExperience_level(e.target.value)} value={experience_level} name="experience_level">
                        <option id="1" value="beginner" className="font-bold">Beginner</option>
                        <option id="2" value="intermidiate" className="font-bold">Intermediate</option>
                        <option id="3" value="experienced" className="font-bold">Experienced</option>   
                      </select>
                    </label>
                    <label className="block">
                    <span className="text-gray-700 font-bold">Interested topics</span> 
                    <nav className="flex min-w-[100px] flex-row gap-1 p-2">
                    {topics.length > 0 ? (
                        topics.map((topic: Topic) => {
                          // Log each topic during rendering
                          return (
                            <div
                              key={topic.id}
                              role="button"
                              className="flex w-full items-center rounded-lg p-0 transition-all hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100"
                            >
                              <label className="block">
                                <div className="inline-flex items-center">
                                  <label className="flex items-center cursor-pointer relative">
                                    <input
                                      type="checkbox"
                                      className="peer h-5 w-5 cursor-pointer"
                                      id={topic.id.toString()}
                                      name="interested_topics"
                                      value={topic.name}
                                      onChange={handleChange}
                                    />
                                  </label>
                                  <label className="cursor-pointer ml-2 text-slate-900 text-sm">
                                    {topic.name}
                                  </label>
                                </div>
                              </label>
                            </div>
                          );
                        })
                      ) : (
                        <p>No topics available</p> // Fallback in case no topics are available
                      )}
                        </nav> 

                    </label>
                    <button className="border-2 border-green-600 rounded-full px-8 py-2 inline-block font-semibold hover:bg-green-600
                     hover:text-white" disabled={isLoading}>
                      {isLoading && <span>Creating Profile...</span>}
                      {!isLoading && <span>Create Profile</span>}
                                    </button>
                </div>
            </div>
        </div>
        </div>
        </div>
      </form>
</div>
      
    );
  };
  