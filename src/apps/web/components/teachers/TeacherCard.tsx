import Link from 'next/link';

export default function TeacherCard({ teacher }: { teacher: any }) {
  return (
    <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col h-full w-56">
      {/* taller image area to make the card longer while keeping it narrow */}
      <div className="h-52 w-full overflow-hidden rounded-t-2xl bg-gray-100">
        <img
          src={teacher.image}
          alt={teacher.name}
          className="w-full h-full object-cover"
        />
      </div>

<div className="flex flex-col flex-1 p-4">
        <h3 className="text-sm font-semibold mb-2">{teacher.name}</h3>

        <ul className="text-sm text-gray-600 space-y-2 mb-3">
          {teacher.badges?.map((b: string, i: number) => (
            <li key={i} className="flex items-start gap-3">
              <span className="flex-shrink-0 mt-1.5 inline-block w-2 h-2 rounded-full bg-yellow-500" />
              <span className="">{b}</span>
            </li>
          ))}
        </ul>

        {/* ensure button stays at bottom */}
        {/* <div className="mt-auto">
          <Link
            href={`/teachers/${teacher.id}`}
            className="block text-center w-full bg-blue-600 text-white py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition"
          >
            Tìm hiểu thêm
          </Link>
        </div> */}
      </div>
    </article>
  );
}