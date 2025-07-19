import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Project {
  id: number;
  title: string;
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
  onProjectSelect: (project: Project) => void;
  onClose: () => void;
}

export default function SearchSidebar({
  projects,
  onProjectSelect,
  onClose,
}: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filtered, setFiltered] = useState<Project[]>(projects);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const results = projects.filter(
      (p) =>
        p.title.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
    );
    setFiltered(results);
  }, [searchTerm, projects]);

  return (
    <motion.div
      initial={{ x: 600 }}
      animate={{ x: 0 }}
      exit={{ x: 600 }}
      className="fixed top-40 right-4 bg-white shadow-lg z-[5000] rounded-3xl overflow-hidden max-w-[600px] w-[93%] md:w-[33%] h-[calc(100%-12rem)] md:h-[calc(100%-15rem)]"
    >
      {/* Header */}
      <div className="sticky top-0 bg-[#2b7eff] text-white flex items-center justify-between px-4 py-3 shadow-sm">
        <h2 className="text-lg font-semibold">Find LostConnect</h2>
        <button onClick={onClose}>
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            stroke="currentColor"
            fill="none"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>

      {/* Search Input */}
      <div className="sticky top-0 z-10 bg-white px-4 py-3 border-b border-gray-100">
        <div className="relative">
          <input
            type="text"
            className="w-full pl-12 pr-10 py-3 text-sm border border-gray-200 rounded-full shadow-sm bg-gray-50/50"
            placeholder="Search by Name or Description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4"
            viewBox="0 0 24 24"
            stroke="currentColor"
            fill="none"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>
      </div>

      {/* Results List */}
      <div className="h-[74%] mr-2 overflow-y-auto px-2 py-2">
        <ul className="space-y-1">
          {filtered.map((project) => (
            <li key={project.id}>
              <button
                onClick={() => onProjectSelect(project)}
                className="w-full text-left hover:bg-blue-50 rounded-lg p-3"
              >
                <p className="text-blue-600 font-medium mb-0.5">
                  {project.title}
                </p>
                <div className="text-xs text-gray-600 truncate">
                  {project.description}
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
