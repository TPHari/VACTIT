import Image from "next/image";

export default function ViewerPane({ pages, zoom }: { pages: string[]; zoom: number }) {
  const baseHeight = "160vh"
  return (
    <div className="w-full bg-gray-100 rounded-md p-4 border border-gray-300">
      {/* make viewer pane the scroll container: fixed max-height and overflow-auto */}
      <div
        className="flex flex-col px-2 items-center overflow-auto w-full max-h-screen"
      >
        {pages.length === 0 ? (
          <div className="text-gray-500">No tests found.</div>
        ) : (
          pages.map((src, idx) => (
            <Image
              key={idx}
              width={800}
              height={1280}
              src={src}
              alt={`Exam page ${idx + 1}`}
              loading="lazy"
              style={{
                transform: `scale(100%)`,
                transformOrigin: 'top center',
              }}
              className={`my-2 shadow-md bg-white`}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}