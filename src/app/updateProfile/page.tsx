'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthActions } from '@/app/auth/utils';
import { toast } from 'sonner'; // Import your toast library

interface User {
  // ... other user properties
  id?: number;
  phone_number?: string;
  location?: string;
  experience_level?: string;
  interested_topics?: string[];
  
}

interface Topic {
  id: number;
  name: string;
}

const UpdateProfile = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [interested_topics, setInterested_topics] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false);
  const { getToken } = AuthActions();
  const [topics, setTopics] = useState<Topic[]>([]);
  

  // ... (useEffect hook to fetch user data as before)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getToken('access');
        const userEmail = localStorage.getItem('userEmail');
        if (!userEmail){
          console.error('User email not found');
          return;
        }
        const response = await fetch(`https://zero-to-one-4.onrender.com/api/profileUserDetails/?email=${userEmail}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Error fetching topics:', error);
      }
    };
  
    fetchData();
  }, [getToken]);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await fetch('https://zero-to-one-4.onrender.com/topics/', {
          method: "GET",
        });
        const data = await response.json();
        setTopics(data);
      } catch (error) {
        console.error('Error fetching topics:', error);
      }
    };
  
    fetchTopics();
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



  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const token = getToken('access');
      const response = await fetch('http://localhost:8000/profile/', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user), 

      });

      if (!response.ok) {
        throw new Error('Failed to update user profile');
      }

      toast.success('Profile updated successfully!');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('An error occurred while updating your profile.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="px-4 py-4 bg-green-200 text-gray-900 antialiased items-center">
      <form className="flex w-full max-w-lg items-center" onSubmit={handleSubmit}>
        <div className="mx-auto max-w-xl divide-y py-12 md:max-w-4xl">
          <div className="py-8 bg-green-300 rounded-2xl">
            <div className="py-12 items-center justify-center px-8">
              <h2 className="text-3xl font-bold text-white mb-2 items-center justify-center">
                Update Your Profile
              </h2>
  
              <div className="mt-8 max-w-md">
                <div className="grid grid-cols-1 gap-6">
                  <label className="block">
                    <span className="text-gray-700 font-bold">Phone Number</span>
                    <input
                      type="text"
                      name="phone_number"
                      className="mt-1 block w-full rounded-md border-transparent bg-gray-100 focus:border-gray-500 focus:bg-white focus:ring-0   
   px-2"
                      placeholder=""
                      value={user?.phone_number || ''}
                      onChange={(e) => setUser({ ...user, phone_number: e.target.value })}
                    />
                  </label>
  
                  <label className="block">
                    <span className="text-gray-700 font-bold">Location</span>
                    <input
                      type="text"
                      name="location"
                      className="mt-1 block w-full rounded-md border-transparent bg-gray-100 focus:border-gray-500 focus:bg-white focus:ring-0   
   px-2"
                      placeholder=""
                      value={user?.location || ''}
                      onChange={(e) => setUser({ ...user, location: e.target.value })}
                    />
                  </label>
  
                  <label className="block">
                    <span className="text-gray-700 font-bold">Experience Level</span>
                    <select
                      className="mt-1 block w-full rounded-md border-transparent bg-gray-100 focus:border-gray-500 focus:bg-white focus:ring-0"   
  
                      value={user?.experience_level || ''}
                      name="experience_level"
                      onChange={(e) => setUser({ ...user, experience_level: e.target.value })}
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Experienced">Experienced</option>   
  
                    </select>   
  
                  </label>
  
                  <label className="block">
                    <span className="text-gray-700 font-bold">Interested Topics</span>
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
                                      value={topic.id}
                                      // checked={user?.interested_topics?.includes(topic.name) || false}
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
  
                  <button
                    type="submit"
                    className="border-2 border-green-600 rounded-full px-8 py-2 inline-block font-semibold hover:bg-green-600 hover:text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Updating Profile...' : 'Update Profile'}
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

export default UpdateProfile;
