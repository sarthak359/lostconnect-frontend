import {
  MapContainer,
  TileLayer,
  Marker,
  Tooltip,
  useMap,
} from "react-leaflet";
import { AnimatePresence, motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import BookingCard from "./card";
import LocationPopup from "./LocationPopup";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
const customIcon = new L.Icon({
  iconUrl: "/pin.png", // this is in public/
  iconSize: [32, 32], // or whatever fits your design
  iconAnchor: [16, 32], // point of the icon which corresponds to marker's location
  popupAnchor: [0, -32], // popup placement relative to the icon
});

const MapInstanceSetter = ({
  mapRef,
}: {
  mapRef: React.MutableRefObject<any>;
}) => {
  const map = useMap();

  useEffect(() => {
    mapRef.current = map;
  }, [map]);

  return null;
};

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

interface MapViewProps {
  projects: Project[];
  selectedType: "all" | "human" | "animal" | "plant";
  selectedStatus: "all" | "lost" | "found";
  selectedProject?: Project | null; // new prop
}
//web visit animation to zoom
const AnimatedZoom = () => {
  const map = useMap();

  useEffect(() => {
    map.setView([27.4, 78.0], 3);
    const timeout = setTimeout(() => {
      map.flyTo([27.4, 78.0], 5.5, { duration: 3 });
    }, 1000);

    return () => clearTimeout(timeout);
  }, [map]);

  return null;
};

const MapCenterListener = () => {
  const map = useMap();

  useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { lat, lng } = customEvent.detail;

      // Step 1: Zoom out (optional)
      map.setZoom(10, { animate: true });

      // Step 2: Fly to new location
      setTimeout(() => {
        map.flyTo([lat, lng], 16, {
          animate: true,
          duration: 1.5,
        });
      }, 500);
    };

    // ✅ Fix the type error by explicitly casting to EventListener
    window.addEventListener("center-map", handler as EventListener);

    return () => {
      window.removeEventListener("center-map", handler as EventListener);
    };
  }, [map]);

  return null;
};

export default function MapView({
  projects,
  selectedType,
  selectedStatus,
  selectedProject,
}: MapViewProps) {
  const filteredProjects = projects
    .filter((p) => selectedType === "all" || p.category === selectedType)
    .filter((p) => selectedStatus === "all" || p.status === selectedStatus);

  const [selectedMapProject, setSelectedMapProject] = useState<Project | null>(
    null
  );
  const drawerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  useEffect(() => {
    const handleUnzoom = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { lat, lng } = customEvent.detail;

      // Step 1: Zoom out
      mapRef.current?.flyTo([lat, lng], 4.5, {
        animate: true,
        duration: 2.5,
      });

      // Step 2: Fly to same marker location (or wherever)
      setTimeout(() => {
        mapRef.current?.flyTo([lat, lng], 5, {
          animate: true,
          duration: 2,
        });
      }, 600);
    };

    window.addEventListener("unzoom-map", handleUnzoom as EventListener);

    return () => {
      window.removeEventListener("unzoom-map", handleUnzoom as EventListener);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        drawerRef.current &&
        !drawerRef.current.contains(event.target as Node)
      ) {
        setSelectedMapProject(null);
      }
    };

    if (selectedMapProject) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedMapProject]);
  useEffect(() => {
    if (selectedProject && mapRef.current) {
      mapRef.current.flyTo(
        [selectedProject.lat - 0.001, selectedProject.lng],
        16,
        {
          animate: true,
          duration: 2,
        }
      );
    }
  }, [selectedProject]);

  return (
    <>
      <MapContainer
        key="main-map"
        center={[27.4, 78.0]}
        zoom={5}
        className="h-screen z-0"
        scrollWheelZoom={true}
      >
        <MapInstanceSetter mapRef={mapRef} /> {/* 👈 Add this line here */}
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <AnimatedZoom />
        <MapCenterListener />
        {filteredProjects.map((project) => (
          <Marker
            icon={customIcon}
            key={project.id}
            position={[project.lat, project.lng]}
            eventHandlers={{
              click: () => {
                setSelectedMapProject(project);
                window.dispatchEvent(
                  new CustomEvent("center-map", {
                    detail: { lat: project.lat - 0.001, lng: project.lng },
                  })
                );
              },
            }}
          >
            <Tooltip className="custom-tooltip">
              <div className="text-card-foreground relative w-55 bg-white/95 backdrop-blur-md group hover:scale-105 transition-all duration-300 ease-in-out rounded-xl shadow-lg border border-blue-100 hover:shadow-xl hover:border-blue-200">
                <div className="flex flex-col space-y-1.5 p-3 pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h3 className="tracking-tight text-sm font-bold text-gray-800 line-clamp-2 leading-tight mb-1 ">
                        {project.title}
                      </h3>
                      <div className="flex items-center gap-1.5">
                        <div className="inline-flex items-center border transition-colors px-1.5 py-0 bg-blue-50 border-blue-200 text-blue-600 rounded-full text-[9px] font-medium">
                          {project.category === "animal" && "🐶 Animal"}
                          {project.category === "human" && "🧑 Human"}
                          {project.category === "plant" && "📦 Item"}
                        </div>
                      </div>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center">
                      <span className="text-lg">
                        {project.category === "animal" && "🐶"}
                        {project.category === "human" && "🧑"}
                        {project.category === "plant" && "📦"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3 pt-1 space-y-2">
                  <div>
                    <p className="text-[11px] font-medium text-gray-500 -mb-0.5">
                      Description
                    </p>
                    <p className="text-xs text-gray-700 line-clamp-2 leading-snug">
                      {project.description}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-gray-500 -mb-0.5 -ml-0.5 flex items-center gap-1">
                      📍 Location
                    </p>
                    <p className="w-40 max-w-full break-words text-xs text-gray-600 line-clamp-2 leading-snug">
                      <LocationPopup lat={project.lat} lng={project.lng} />
                    </p>
                  </div>
                </div>

                <div className="absolute bottom-2 right-2 opacity-100 group-hover:opacity-100 transition-opacity duration-200">
                  <button className="relative text-gray-600 hover:text-red-600 transition-colors duration-200">
                    ❤️
                  </button>
                </div>
              </div>
            </Tooltip>
          </Marker>
        ))}
      </MapContainer>

      {/* Sidebar Drawer for Marker Details */}
      <AnimatePresence>
        {selectedMapProject && (
          <motion.div
            key="project-sidebar"
            ref={drawerRef}
            initial={{ x: 300 }}
            animate={{ x: -20 }}
            exit={{ x: 300 }}
            className="fixed top-70 right-0 z-50"
          >
            <BookingCard
              project={selectedMapProject}
              onClose={() => setSelectedMapProject(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
