
import React from 'react';
import { Course } from '../types';

interface CourseCardProps {
  course: Course;
  onSelect: (courseId: string) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onSelect }) => {
  return (
    <div 
      className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer"
      onClick={() => onSelect(course.id)}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={course.thumbnail} 
          alt={course.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-indigo-700 shadow-sm">
            {course.category}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
            course.level === 'Beginner' ? 'bg-emerald-100 text-emerald-700' : 
            course.level === 'Intermediate' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
          }`}>
            {course.level}
          </span>
          <div className="flex items-center gap-1 text-xs text-slate-500 font-medium ml-auto">
            <svg className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
            {course.rating}
          </div>
        </div>
        
        <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors">
          {course.title}
        </h3>
        
        <p className="text-sm text-slate-500 line-clamp-2 mb-4">
          {course.description}
        </p>
        
        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white overflow-hidden">
              <img src={`https://i.pravatar.cc/150?u=${course.instructor}`} alt={course.instructor} />
            </div>
            <span className="text-xs font-medium text-slate-600">{course.instructor}</span>
          </div>
          <span className="text-xs font-bold text-slate-400">
            {course.lessons.length} lessons
          </span>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
