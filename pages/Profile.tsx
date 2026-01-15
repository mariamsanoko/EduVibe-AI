
import React from 'react';
import { COURSES } from '../data/courses';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ProfileProps {
  onSelectCourse: (id: string) => void;
}

const Profile: React.FC<ProfileProps> = ({ onSelectCourse }) => {
  const data = [
    { name: 'Mon', hours: 2.5 },
    { name: 'Tue', hours: 3.8 },
    { name: 'Wed', hours: 1.2 },
    { name: 'Thu', hours: 4.5 },
    { name: 'Fri', hours: 2.8 },
    { name: 'Sat', hours: 5.2 },
    { name: 'Sun', hours: 1.5 },
  ];

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Left Side: Stats & Info */}
        <div className="w-full md:w-1/3 space-y-8">
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm text-center">
            <div className="relative w-32 h-32 mx-auto mb-6">
              <img 
                src="https://i.pravatar.cc/300?u=current-user" 
                alt="User Avatar" 
                className="w-full h-full rounded-full object-cover border-4 border-indigo-50"
              />
              <div className="absolute bottom-1 right-1 w-8 h-8 bg-emerald-500 border-4 border-white rounded-full"></div>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">John Doe</h2>
            <p className="text-slate-500 mb-6">Premium Student Since 2023</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl">
                <span className="block text-2xl font-black text-indigo-600">12</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Courses</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl">
                <span className="block text-2xl font-black text-indigo-600">84h</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Learning</span>
              </div>
            </div>
          </div>

          <div className="bg-indigo-600 p-8 rounded-[32px] text-white shadow-xl shadow-indigo-100">
            <h3 className="text-lg font-bold mb-4">Learning Activity</h3>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <Bar dataKey="hours" fill="rgba(255,255,255,0.8)" radius={[4, 4, 0, 0]} />
                  <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.1)'}}
                    contentStyle={{ borderRadius: '12px', border: 'none', fontSize: '12px' }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-indigo-200 mt-4 text-center">You studied 15% more this week!</p>
          </div>
        </div>

        {/* Right Side: Courses */}
        <div className="flex-1 space-y-8">
          <h2 className="text-2xl font-bold text-slate-900">In Progress</h2>
          <div className="grid grid-cols-1 gap-6">
            {COURSES.slice(0, 2).map(course => (
              <div key={course.id} className="bg-white p-6 rounded-2xl border border-slate-100 flex flex-col sm:flex-row gap-6 hover:shadow-lg transition-all group">
                <div className="w-full sm:w-48 h-32 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-800 mb-2">{course.title}</h3>
                  <p className="text-sm text-slate-500 mb-4 line-clamp-1">{course.instructor} • {course.category}</p>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500" style={{ width: '45%' }}></div>
                    </div>
                    <span className="text-xs font-bold text-slate-400">45%</span>
                  </div>
                  
                  <button 
                    onClick={() => onSelectCourse(course.id)}
                    className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1"
                  >
                    Continue Learning
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-slate-900 pt-8">Completed Courses</h2>
          <div className="grid grid-cols-1 gap-6 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
             <div className="bg-white p-6 rounded-2xl border border-slate-100 flex flex-col sm:flex-row gap-6">
                <div className="w-full sm:w-48 h-32 rounded-xl overflow-hidden flex-shrink-0 bg-slate-200">
                  <img src="https://picsum.photos/seed/complete/400/200" alt="Completed" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 py-2">
                  <h3 className="text-lg font-bold text-slate-800 mb-2">Introduction to Digital Marketing</h3>
                  <p className="text-sm text-slate-500 mb-4">Completed on March 12, 2024</p>
                  <button className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">
                    View Certificate
                  </button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;
