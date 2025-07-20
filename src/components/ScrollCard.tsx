interface Project {
  id: number;
  title: string; // this is used as "City"
  description: string;
  status: "lost" | "found";
  category: "human" | "animal" | "plant";
  lat: number;
  lng: number;
  image_url?: string;
  date?: string;
  user_id: string;
  creator: {
    id: string;
    name: string;
    email: string;
  };
}

interface Props {
  projects: Project[];
}

export default function ScrollCard({ projects }: Props) {
  return (
    <div className="w-70 h-[50vh] bg-white/95 backdrop-blur-sm shadow-2xl rounded-3xl border-2 border-white overflow-hidden relative z-10">
      {/* Header */}
      <div className="relative p-4 pl-6 h-20 bg-[#7E57C2] text-white rounded-t-2xl">
        <h1 className="text-lg font-bold relative z-10">LostConnect Records</h1>
        <h3 className="text-sm text-[#ececec] relative z-10">
          Real-time statistics
        </h3>
      </div>

      {/* Icon Row */}
      <div className="grid grid-cols-4 gap-2 px-6 py-2 bg-gray-50/80 border-b border-blue-100 font-medium text-sm">
        <div className="text-gray-600 mt-1">City</div>
        <div className="text-gray-600 mt-1 ml-[100px]">Category</div>{" "}
        {/* Replaced top icons with text */}
      </div>

      {/* Scrollable Content */}
      <div className=" bg-white relative overflow-hidden">
        <div
          className="flex flex-col animate-scroll"
          style={{
            animation: "scroll 20s linear infinite",
          }}
        >
          {projects.map((project) => (
            <div
              key={project.id}
              className=" w-full max-w-full  border-b border-gray-100"
            >
              <div className="flex flex-col bg-white hover:bg-[#f7faff]">
                <div className="p-4 border-b border-gray-300 flex justify-between">
                  <div>
                    <h2 className="text-sm font-semibold">{project.title}</h2>
                  </div>

                  <div className="text-2xl mr-7">
                    {project.category === "human" && <span>👤</span>}
                    {project.category === "animal" && <span>🐶</span>}
                    {project.category === "plant" && <span>👜</span>}
                    {/* Add more mappings as needed */}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
