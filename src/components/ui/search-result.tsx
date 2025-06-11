interface SearchResultProps {
  name: string;
  role: string;
  imageUrl: string;
  onClick: (name: string) => void;
}

export default function SearchResult({
  name,
  role,
  imageUrl,
  onClick,
}: SearchResultProps) {
  return (
    <div
      className="flex items-center gap-4 bg-white px-4 min-h-[72px] py-2 transition-colors duration-200 hover:bg-gray-100 cursor-pointer"
      onClick={() => onClick(name)}
    >
      <div
        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-14 w-14 transition-transform duration-200 hover:scale-105"
        style={{ backgroundImage: `url("${imageUrl}")` }}
      />
      <div className="flex flex-col">
        <p className="text-[#121416] text-base font-medium leading-normal line-clamp-1 text-left group-hover:text-blue-600 transition-colors duration-200">
          {name}
        </p>
        <p className="text-[#6a7581] text-sm font-normal leading-normal line-clamp-2 text-left">
          {role}
        </p>
      </div>
    </div>
  );
}
