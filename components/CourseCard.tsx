
import React from 'react';
import { Course, Lesson } from '../types';

interface CourseCardProps {
  course: Course;
  onSelect: (courseId: string) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onSelect }) => {
  const calculateTotalDuration = (lessons: Lesson[]) => {
    let totalMinutes = 0;
    lessons.forEach(l => {
      const parts = l.duration.split(':');
      if (parts.length === 2) {
        totalMinutes += parseInt(parts[0]) + (parseInt(parts[1]) / 60);
      }
    });
    const h = Math.floor(totalMinutes / 60);
    const m = Math.round(totalMinutes % 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  return (
    <div 
      className="bg-white rounded-[40px] overflow-hidden border border-slate-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_-20px_rgba(79,70,229,0.15)] transition-all duration-500 group cursor-pointer hover:translate-y-[-8px]"
      onClick={() => onSelect(course.id)}
    >
      <div className="relative h-60 overflow-hidden">
        <img 
          src={course.thumbnail} 
          alt={course.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        
        <div className="absolute top-6 left-6 flex flex-col gap-2">
          <span className="px-4 py-1.5 bg-white/95 backdrop-blur-md rounded-xl text-[10px] font-black text-indigo-700 shadow-xl uppercase tracking-widest border border-white/20">
            {course.category}
          </span>
          <div className="flex gap-2">
            {course.isFree ? (
              <span className="px-4 py-1.5 bg-emerald-500 text-white rounded-xl text-[10px] font-black shadow-xl uppercase tracking-widest">
                Gratuit
              </span>
            ) : (
              <span className="px-4 py-1.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black shadow-xl uppercase tracking-widest">
                {course.price}€
              </span>
            )}
          </div>
        </div>

        <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
           <span className="flex items-center gap-2 text-white font-black text-[10px] uppercase tracking-widest">
             <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
             Démarrer le module
           </span>
        </div>
      </div>
      
      <div className="p-10">
        <div className="flex items-center gap-4 mb-5">
          <div className="flex items-center gap-1.5">
             <div className="flex text-amber-400">
               <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
             </div>
             <span className="text-xs font-black text-slate-900">{course.rating}</span>
          </div>
          <span className="h-4 w-px bg-slate-200"></span>
          <span className={`text-[10px] font-black uppercase tracking-widest ${
            course.level === 'Débutant' ? 'text-emerald-600' : 
            course.level === 'Intermédiaire' ? 'text-amber-600' : 'text-rose-600'
          }`}>
            {course.level}
          </span>
          <span className="h-4 w-px bg-slate-200 ml-auto"></span>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {calculateTotalDuration(course.lessons)}
          </span>
        </div>
        
        <h3 className="text-2xl font-black text-slate-900 mb-4 line-clamp-2 tracking-tight leading-tight group-hover:text-indigo-600 transition-colors">
          {course.title}
        </h3>
        
        <p className="text-sm text-slate-500 line-clamp-2 mb-10 leading-relaxed font-medium">
          {course.description}
        </p>
        
        <div className="flex items-center justify-between pt-8 border-t border-slate-50">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img src={`https://i.pravatar.cc/150?u=${course.instructor}`} className="w-10 h-10 rounded-2xl border-2 border-white shadow-md" alt={course.instructor} />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-indigo-500 rounded-full border-2 border-white flex items-center justify-center">
                 <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
            </div>
            <span className="text-xs font-black text-slate-800 uppercase tracking-tight">{course.instructor}</span>
          </div>
          <div className="flex -space-x-3 group-hover:-space-x-2 transition-all">
             {[1,2,3].map(i => (
               <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center overflow-hidden">
                 <img src={`https://i.pravatar.cc/100?u=stud${i+course.id}`} alt="student" />
               </div>
             ))}
             <div className="w-8 h-8 rounded-full border-2 border-white bg-indigo-600 flex items-center justify-center text-[8px] font-black text-white">
               +{Math.floor(course.studentsCount / 100)}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
