import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SearchSidebar from "./components/SearchSidebar"; // path may vary
import {
  FiMenu,
  FiX,
  FiLogIn,
  FiUserPlus,
  FiUser,
  FiMail,
  FiInfo,
  FiHelpCircle,
  FiLogOut,
  FiSearch,
} from "react-icons/fi";
import MapView from "./components/MapView";
import {
  useUser,
  SignInButton,
  SignUpButton,
  SignOutButton,
  useClerk,
  useAuth,
} from "@clerk/clerk-react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { fetchWithRetry } from "./utils/fetchWithRetry"; // adjust path as needed
import VideoPlayer from "./components/video";
<<<<<<< HEAD
import ScrollCard from "./components/scrollcard";
import L from "leaflet";

function getCustomIcon() {
  return L.divIcon({
    className: "", // No default class
    html: `
      <div class="custom-marker">
        <img src="/pin.png" alt="marker base" />
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40], // Keeps the bottom of the pin anchored
  });
}
=======
import ScrollCard from "./components/ScrollCard";
>>>>>>> a55d5c44ede2e808ef69172fa8f01e991dbb506c

interface Project {
  id: number;
  title: string;
  description: string;
  category: "human" | "animal" | "plant";
  status: "lost" | "found";
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

function App() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    28.6139, 77.209,
  ]); // Default: Delhi
  const [markerPosition, setMarkerPosition] = useState<[number, number]>([
    28.6139, 77.209,
  ]);
  const [lat, setLat] = useState<number>(0);
  const [lng, setLng] = useState<number>(0);

  const { openUserProfile } = useClerk();
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<
    "all" | "human" | "animal" | "plant"
  >("all");
  const [selectedStatus, setSelectedStatus] = useState<
    "all" | "lost" | "found"
  >("all");

  const { user, isSignedIn } = useUser();
  const [projects, setProjects] = useState<Project[]>([]);
  const { userId } = useAuth(); // Make sure useAuth is imported from @clerk/clerk-react
  const [showAddProjectForm, setShowAddProjectForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    setLoading(true);

    fetchWithRetry<any[]>("https://lostconnect-backend.onrender.com/projects")
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch((e) => {
        console.error("Backend wake-up failed", e);
        setLoading(false);
      });
  }, []);

  // Simulated auth state (replace with real logic)
  const isUserLoggedIn = userId !== null && userId !== undefined;
  useEffect(() => {
    if (user && userId) {
      fetch("https://lostconnect-backend.onrender.com/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: userId,
          email: user?.primaryEmailAddress?.emailAddress,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("User creation status:", data);
        })
        .catch((err) => console.error("Error creating user:", err));
    }
  }, [user, userId]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!userId || !user) {
      alert("Please log in to add a project.");
      return;
    }

    const fullName =
      user.fullName ||
      `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
      "Unknown";

    const newProject = {
      title,
      description,
      category,
      status,
      lat,
      lng,
      user_id: userId,
      user_email: user.primaryEmailAddress?.emailAddress,
      user_name: fullName, // ✅ use the fallback full name
    };

    console.log("Submitting project:", newProject);

    try {
      const response = await fetch(
        "https://lostconnect-backend.onrender.com/projects",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newProject),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Project added successfully:", result);
        alert("Project added successfully!");
        setTimeout(() => setShowAddProjectForm(false), 300); // small delay

        // ✅ Refetch after success
        fetchWithRetry<Project[]>(
          "https://lostconnect-backend.onrender.com/projects"
        ).then((data) => setProjects(data));
      } else {
        const errorData = await response.json();
        alert(`Failed to add project: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Network error or other issue:", error);
      alert("An error occurred while adding the project.");
    }
  };

  // ... existing code ...

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Empty dependency array means this effect runs once on mount

  const handleLogout = () => {
    console.log("Logging out...");
    setIsMenuOpen(false);
  };
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      setMapCenter([lat, lng]);
      setMarkerPosition([lat, lng]);
      setLat(lat);
      setLng(lng);
    });
  }, []);
  useEffect(() => {
    return () => {
      const containers = document.querySelectorAll(".leaflet-container");
      containers.forEach((container) => {
        const element = container as HTMLElement & { _leaflet_id?: number };
        if (element._leaflet_id) {
          element.remove();
        }
      });
    };
  }, []);
  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <VideoPlayer />
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Navbar */}
      <div className="absolute top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {!isMobile && (
              <div className="flex items-center gap-6 ml-6">
                <div className="flex flex-col items-center">
                  <a href="/">
                    <img
                      src="/logo.svg"
                      alt="logo"
                      width={110}
                      height={10}
                      className="object-contain scale-150"
                    />
                  </a>
                </div>
                <div className="hidden md:block ml-56">
                  <p className=" font-semibold text-lg ml-26">
                    Reconnect with What’s Lost, One Pin at a Time.
                  </p>
                  <p className="text-gray-600 text-sm">
                    Discover and report lost or found items using AI and maps —
                    fast, smart, and community-driven.
                  </p>
                </div>
              </div>
            )}
            {isMobile && (
              <div className="ml-4">
                <a href="/">
                  <img
                    src="/logo.svg"
                    alt="logo"
                    width={110}
                    height={10}
                    className="object-contain scale-125"
                  />
                </a>
              </div>
            )}

            <div className="flex-1 flex justify-end">
              <button
                className="bg-white hover:bg-gray-100 p-2 rounded-full shadow-sm hover:shadow-md transition-all duration-300"
                onClick={() => {
                  setIsMenuOpen(!isMenuOpen);
                }}
              >
                <FiMenu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: 300 }}
            animate={{ x: 0 }}
            exit={{ x: 300 }}
            className="fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50"
          >
            <div className="flex flex-col h-full">
              <div className="p-6 bg-neutral-700 text-white">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Menu</h2>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="text-white hover:bg-gray-500 p-2 rounded-full"
                  >
                    <FiX className="h-6 w-6" />
                  </button>
                </div>
                {isSignedIn ? (
                  <div className="bg-gray-50 p-4 rounded-lg mb-2 text-gray-800">
                    <p className="text-lg font-semibold">{user?.fullName}</p>
                    <p className="text-sm text-gray-600 mb-3">
                      {user?.primaryEmailAddress?.emailAddress || "No email"}
                    </p>

                    <ul className="space-y-2">
                      <li>
                        <button
                          className="w-full flex items-center gap-3 bg-gray-300 text-neutral-900 hover:bg-neutral-400 font-semibold px-4 py-2 rounded-lg transition"
                          onClick={() => openUserProfile()}
                        >
                          <FiUser className="h-5 w-5" />
                          View Profile
                        </button>
                      </li>
                      <li>
                        <SignOutButton>
                          <button
                            className="w-full flex items-center gap-3 bg-red-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-red-700 transition"
                            onClick={() => handleLogout()}
                          >
                            <FiLogOut className="h-5 w-5" />
                            Logout
                          </button>
                        </SignOutButton>
                      </li>
                    </ul>
                  </div>
                ) : (
                  <>
                    <h3 className="font-semibold text-lg">Did My Bit</h3>
                    <p className="text-sm text-blue-100">
                      Make an impact, one bit at a time
                    </p>
                  </>
                )}
              </div>

              <nav className="flex-grow p-6 space-y-3">
                {!isSignedIn && (
                  <ul className="space-y-3">
                    <li>
                      <SignInButton>
                        <button className="w-full flex items-center gap-3 bg-gray-300 text-neutral-900 hover:bg-neutral-400 font-semibold px-4 py-2 rounded-lg">
                          <FiLogIn className="h-5 w-5" />
                          Login
                        </button>
                      </SignInButton>
                    </li>
                    <li>
                      <SignUpButton>
                        <button className="w-full flex items-center gap-3 bg-gray-300 text-neutral-900 hover:bg-neutral-400 font-semibold px-4 py-2 rounded-lg">
                          <FiUserPlus className="h-5 w-5" />
                          Sign Up
                        </button>
                      </SignUpButton>
                    </li>
                  </ul>
                )}

                <div>
                  <h4 className="text-sm font-semibold text-gray-500 mb-2">
                    ABOUT US
                  </h4>
                  <ul className="space-y-3">
                    <li>
                      <button className="w-full flex items-center gap-3 bg-gray-300 text-neutral-900 hover:bg-neutral-400 font-semibold px-4 py-2 rounded-lg">
                        <FiInfo className="h-5 w-5" />
                        About Us
                      </button>
                    </li>
                    <li>
                      <button className="w-full flex items-center gap-3 bg-gray-300 text-neutral-900 hover:bg-neutral-400 font-semibold px-4 py-2 rounded-lg">
                        <FiMail className="h-5 w-5" />
                        Contact Us
                      </button>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-500 mb-2">
                    SUPPORT
                  </h4>
                  <ul className="space-y-3">
                    <li>
                      <button className="w-full flex items-center gap-3 bg-gray-300 text-neutral-900 hover:bg-neutral-400 font-semibold px-4 py-2 rounded-lg">
                        <FiHelpCircle className="h-5 w-5" />
                        Help & FAQ
                      </button>
                    </li>
                  </ul>
                </div>
              </nav>

              <div className="p-6 bg-gray-50 text-center text-sm text-gray-600">
                <p>© 2024 Did My Bit. All rights reserved.</p>
                <p className="text-xs text-blue-600 font-medium mt-1">
                  Making the world better, one bit at a time
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Placeholder */}
      <main>
        {/* filter buttons on top is here: tada */}
        <div className="absolute md:top-24 top-19 left-1/2 transform -translate-x-1/2 z-[9] flex flex-row  items-center gap-0 md:gap-2">
          {/* Category Buttons */}
          <div className="border-2 border-[#2b7cff4e] hover:border-[#2b7cff91]  scale-[0.8] md:scale-[1] bg-white/80 backdrop-blur-md rounded-full shadow-md px-2 py-2 flex gap-2 md:gap-4 -mr-6 md:mr-5">
            {["all", "human", "animal", "plant"].map((type) => {
              const isActive = selectedType === type;
              return (
                <button
                  key={type}
                  onClick={() => setSelectedType(type as any)}
                  className="relative px-3 py-1 rounded-full text-sm font-semibold transition z-10"
                >
                  {isActive && (
                    <motion.div
                      layoutId="type-pill"
                      className="absolute inset-0 bg-[#2b7eff] rounded-full z-[-1]"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className={isActive ? "text-white" : "text-gray-700"}>
                    {type === "human" && (
                      <>
                        👤 <span className="hidden md:inline">Human</span>
                      </>
                    )}
                    {type === "animal" && (
                      <>
                        🐶 <span className="hidden md:inline">Animal</span>
                      </>
                    )}
                    {type === "plant" && (
                      <>
                        👜 <span className="hidden md:inline">Item</span>
                      </>
                    )}
                    {type === "all" && (
                      <>
                        🌐 <span className="hidden md:inline">All</span>
                      </>
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Status Buttons */}
          <div className="border-2 border-[#2b7cff4e] hover:border-[#2b7cff91]  scale-[0.8] md:scale-[1] bg-white/80 backdrop-blur-md rounded-full shadow-md px-2 py-2 flex gap-4">
            {["all", "lost", "found"].map((status) => {
              const isActive = selectedStatus === status;
              return (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status as any)}
                  className="relative px-3 py-1 rounded-full text-sm font-semibold transition z-10"
                >
                  {isActive && (
                    <motion.div
                      layoutId="status-pill"
                      className="absolute inset-0 bg-[#2b7eff] rounded-full z-[-1]"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className={isActive ? "text-white" : "text-gray-700"}>
                    {status === "lost" && (
                      <>
                        ❌ <span className="hidden md:inline">Lost</span>
                      </>
                    )}
                    {status === "found" && (
                      <>
                        ✅ <span className="hidden md:inline">Found</span>
                      </>
                    )}
                    {status === "all" && (
                      <>
                        🌐 <span className="hidden md:inline">All Status</span>
                      </>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="absolute md:top-24 top-30 md:right-0 right-5 transform -translate-x-1/2 z-[9] flex flex-row  items-center gap-0 md:gap-2">
          {/* Category Buttons */}

          <div className="w-[150px] right-0 flex border-2 border-[#2b7cff4e] hover:border-[#2b7cff91] scale-[0.8] md:scale-[1] bg-white/80 backdrop-blur-md rounded-full shadow-md px-4 py-2 text-sm font-semibold text-gray-700">
            Total Projects: {projects.length}
          </div>
        </div>
        <div className="absolute md:top-[30%] left-45 transform -translate-x-1/2 z-[9] hidden md:block ">
          {/* Category Buttons */}

          <ScrollCard projects={projects} />
        </div>

        <MapView
          selectedType={selectedType}
          selectedStatus={selectedStatus}
          projects={projects} // Use the fetched projects state
          selectedProject={selectedProject}
        />
        {loading && (
          <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded shadow z-50">
            <p className="text-gray-700 text-sm">
              Waking up backend... please wait ⏳
            </p>
          </div>
        )}

        {/* Add Project Button at the bottom of the map */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-[9]">
          <>
            {/* Floating Buttons Container */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-[9]">
              <div className="flex flex-row align-center">
                {/* Add Project Button */}
                <button
                  onClick={() => {
                    if (!isUserLoggedIn) {
                      setShowLoginPrompt(true);
                      setTimeout(() => {
                        setShowLoginPrompt(false);
                      }, 4000);
                      return;
                    }
                    setShowAddProjectForm(!showAddProjectForm);
                  }}
                  className="border-2 border-[#ddd] hover:border-[#2b7cff] bg-[#2b7eff] hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-103 w-45"
                >
                  Add LostConnect
                </button>

                {/* Search Button */}
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="border-2 border-[#ddd] hover:border-[#2b7cff] ml-5 flex flex-row align-center bg-[#2b7eff] hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-103"
                >
                  <FiSearch className="h-4 w-4 mt-1 mr-3" />
                  Search
                </button>
              </div>
            </div>
            {/* Login Prompt Modal */}
            <AnimatePresence>
              {showLoginPrompt && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  className="absolute bottom-20 left-1/2 -translate-x-1/2 w-[300px] bg-white rounded-lg shadow-xl p-4 z-50"
                >
                  <button
                    onClick={() => setShowLoginPrompt(false)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                  <p className="text-center text-gray-800 font-medium">
                    Please log in first
                  </p>
                  <p className="text-center text-sm text-gray-500 mt-1">
                    Use the menu &gt; <strong>Login</strong> button
                  </p>
                  <div className="mt-4 h-1 w-full bg-gray-200 overflow-hidden rounded-full">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 4, ease: "linear" }}
                      className="h-full bg-blue-500"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>

          {/* Login Prompt Modal */}
          <AnimatePresence>
            {showLoginPrompt && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="absolute bottom-20 left-1/2 -translate-x-1/2 w-[300px] bg-white rounded-lg shadow-xl p-4 z-50"
              >
                <button
                  onClick={() => setShowLoginPrompt(false)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
                >
                  <FiX className="h-5 w-5" />
                </button>

                <p className="text-center text-gray-800 font-medium">
                  Please log in first
                </p>
                <p className="text-center text-sm text-gray-500 mt-1">
                  Use the menu &gt; <strong>Login</strong> button
                </p>

                {/* Bottom loader */}
                <div className="mt-4 h-1 w-full bg-gray-200 overflow-hidden rounded-full">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 4, ease: "linear" }}
                    className="h-full bg-blue-500"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {showAddProjectForm && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 300 }}
                className="fixed inset-0 z-500 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4 md:p-6 overflow-y-auto"
              >
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.95 }}
                  className="top-[65px] md:top-0 relative w-full max-w-2xl md:max-w-3xl bg-white rounded-2xl shadow-2xl p-6 md:p-10"
                >
                  <button
                    onClick={() => setShowAddProjectForm(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
                  >
                    <FiX className="h-6 w-6" />
                  </button>
                  <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-center text-gray-800">
                    Add New Project
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Title */}
                      <div>
                        <label
                          htmlFor="title"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Title
                        </label>
                        <input
                          type="text"
                          id="title"
                          name="title"
                          onChange={(e) => setTitle(e.target.value)}
                          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="e.g., Lost Dog, Found Wallet"
                          required
                        />
                      </div>

                      {/* Description - now half-width */}
                      <div>
                        <label
                          htmlFor="description"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Description
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          rows={3}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="h-[37.6px] mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm resize-none"
                          placeholder="Provide details about the item or person"
                          required
                        ></textarea>
                      </div>

                      {/* Category */}
                      <div>
                        <label
                          htmlFor="category"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Category
                        </label>
                        <select
                          id="category"
                          name="category"
                          onChange={(e) => setCategory(e.target.value)}
                          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          required
                        >
                          <option value="">Select Category</option>
                          <option value="human">Human</option>
                          <option value="animal">Animal</option>
                          <option value="plant">Item</option>
                        </select>
                      </div>

                      {/* Status */}
                      <div>
                        <label
                          htmlFor="status"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Status
                        </label>
                        <select
                          id="status"
                          name="status"
                          onChange={(e) => setStatus(e.target.value)}
                          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          required
                        >
                          <option value="">Select Status</option>
                          <option value="lost">Lost</option>
                          <option value="found">Found</option>
                        </select>
                      </div>
                    </div>

                    {/* Map */}
                    <div className="h-64 w-full rounded-md overflow-hidden shadow-sm border border-gray-300">
                      <MapContainer
                        key="modal-map"
                        center={mapCenter}
                        zoom={16}
                        style={{ height: "100%", width: "100%" }}
                      >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker
                          icon={getCustomIcon()}
                          draggable={true}
                          position={markerPosition}
                          eventHandlers={{
                            dragend: (e) => {
                              const latlng = e.target.getLatLng();
                              setMarkerPosition([latlng.lat, latlng.lng]);
                              setLat(latlng.lat);
                              setLng(latlng.lng);
                            },
                          }}
                        />
                      </MapContainer>
                    </div>

                    <input type="hidden" name="lat" value={lat} />
                    <input type="hidden" name="lng" value={lng} />

                    {/* Submit Button */}
                    <div className="flex justify-end pt-4">
                      <button
                        type="submit"
                        className="bg-[#2b7eff] hover:bg-blue-600 text-white font-semibold py-2 px-5 rounded-md transition shadow-sm"
                      >
                        Submit Project
                      </button>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {/* 🔥 Move SearchSidebar OUTSIDE here! */}
          {sidebarOpen && (
            <SearchSidebar
              projects={projects}
              onProjectSelect={(project) => {
                setSelectedProject(project);
                setSidebarOpen(false);
                window.dispatchEvent(
                  new CustomEvent("center-map", {
                    detail: {
                      lat: project.lat - 0.001,
                      lng: project.lng,
                    },
                  })
                );
              }}
              onClose={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>
      </main>
    </>
  );
}

export default App;
