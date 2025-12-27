import React from 'react';

interface TeacherCardProps {
  teacher: any;
  onSelect: (teacher: any) => void; // Thêm prop để báo cho cha biết khi được click
}

export default function TeacherCard({ teacher, onSelect }: TeacherCardProps) {
  return (
    <article 
      className="bg-white rounded-2xl overflow-hidden shadow-sm flex flex-col h-full w-56 
      transition-all duration-300 ease-out 
      hover:shadow-xl hover:-translate-y-2 hover:border-blue-200 border border-transparent"
    >
      {/* Image Area */}
      <div className="h-52 w-full overflow-hidden rounded-t-2xl bg-gray-100 relative group">
        <img
          src={teacher.image}
          alt={teacher.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Overlay effect on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </div>

      <div className="flex flex-col flex-1 p-4">
        <h3 className="text-sm font-bold text-gray-900 mb-2 line-clamp-1" title={teacher.name}>
          {teacher.name}
        </h3>

        <ul className="text-xs text-gray-600 space-y-2 mb-3">
          {teacher.badges?.map((b: string, i: number) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-yellow-500 flex-shrink-0" />
              <span className="text-gray-700 font-medium leading-tight">{b}</span>
            </li>
          ))}
        </ul>

        {/* Action Button */}
        <div className="mt-auto pt-2">
          <button
            onClick={() => onSelect(teacher)}
            className="block text-center w-full bg-blue-600 text-white py-2 rounded-full text-sm font-semibold 
            hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 active:scale-95 transition-all duration-200"
          >
            Tìm hiểu thêm
          </button>
        </div>
      </div>
    </article>
  );
}