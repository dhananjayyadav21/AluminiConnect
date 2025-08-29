"use client";

import { useEffect, useState } from "react";
import { Edit3, Mail, Phone, Linkedin, MapPin, X, Plus } from "lucide-react";
import ProtectedRoute from "@/Components/ProtectedRoute";
import toast, { Toaster } from "react-hot-toast";

export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editData, setEditData] = useState({});

    // Fetch profile data
    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token-edunet");
                if (!token) throw new Error("Please login first");

                const res = await fetch("/api/user/profile", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Failed to fetch profile");

                setUser(data);
                setEditData(data);
            } catch (err) {
                console.error(err);
                toast.error(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const handleSave = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token-edunet");
            const res = await fetch("/api/user/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(editData),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to update profile");

            setUser(data);
            setEditData(data);
            setIsEditOpen(false);
            toast.success("Profile updated successfully!");
        } catch (err) {
            console.error(err);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const addEducation = () => {
        setEditData({
            ...editData,
            education: [...(editData.education || []), { year: "", degree: "", institution: "" }],
        });
    };

    const addWork = () => {
        setEditData({
            ...editData,
            work: [...(editData.work || []), { year: "", position: "", company: "" }],
        });
    };

    if (loading)
        return (<div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999]">
            <div className="w-12 h-12 border-4 border-t-transparent border-purple-500 rounded-full animate-spin"></div>
        </div>);

    if (!user)
        return (
            <ProtectedRoute>
                <div className="text-center pt-50 text-gray-400">User not found</div>
            </ProtectedRoute>
        );

    return (
        <ProtectedRoute>
            <div className="min-h-screen pt-16 pb-4 px-2 sm:px-6 bg-black text-white">
                {/* Profile Header */}
                <div className="relative w-full h-48 sm:h-64 bg-gradient-to-r from-gray-800 to-gray-900">
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
                </div>

                {/* Profile Card */}
                <div className="max-w-5xl mx-auto relative -mt-20">
                    <div className="bg-gray-950 border border-gray-600 rounded-xl shadow-lg p-6 sm:p-8 text-center relative">
                        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
                            <img
                                src={user?.profilePic || "https://via.placeholder.com/150"}
                                alt={user?.fullName || "User"}
                                className="w-32 h-32 rounded-full border-4 border-amber-600 object-cover"
                            />
                        </div>

                        <div className="mt-16">
                            <h1 className="text-2xl sm:text-3xl font-bold">{user?.fullName || ""}</h1>
                            <p className="text-gray-400 text-sm sm:text-base mt-1">
                                {user?.position || ""} at {user?.company || ""}
                            </p>
                            <p className="text-gray-500 text-xs sm:text-sm flex items-center justify-center gap-2 mt-2">
                                <MapPin size={16} /> {user?.location || ""}
                            </p>
                        </div>

                        <div className="absolute top-4 right-4">
                            <button
                                onClick={() => setIsEditOpen(true)}
                                className="flex items-center gap-2 btn btn-gradient-secondary"
                            >
                                <Edit3 size={18} /> Edit Profile
                            </button>
                        </div>
                    </div>

                    {/* About Section */}
                    <div className="bg-gray-950 border border-gray-600 rounded-xl mt-8 p-6 shadow-lg">
                        <h2 className="text-xl font-bold mb-4">About</h2>
                        <p className="text-gray-300 mb-4">{user?.bio || ""}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-400">
                            <p>
                                <strong>Graduation Year:</strong> {user?.batch || ""}
                            </p>
                            <p>
                                <strong>Department:</strong> {user?.department || ""}
                            </p>
                            <p>
                                <strong>Current Role:</strong> {user?.position || ""}
                            </p>
                            <p>
                                <strong>Company:</strong> {user?.company || ""}
                            </p>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="bg-gray-950 border border-gray-600 rounded-xl mt-8 p-6 shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Contact Information</h2>
                        <div className="space-y-3 text-gray-400">
                            <p className="flex items-center gap-3">
                                <Mail size={18} /> {user?.email || ""}
                            </p>
                            <p className="flex items-center gap-3">
                                <Phone size={18} /> {user?.phone || ""}
                            </p>
                            {user?.linkedin && (
                                <a
                                    href={user.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 hover:text-white"
                                >
                                    <Linkedin size={18} /> LinkedIn Profile
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Timeline: Education & Work */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                        {/* Education */}
                        <div className="bg-gray-950 border border-gray-600 rounded-xl p-6 shadow-lg">
                            <h2 className="text-xl font-bold mb-4">Education</h2>
                            <div className="space-y-3">
                                {user?.education?.map((edu, idx) => (
                                    <div key={idx} className="border-l-4 border-purple-600 pl-4">
                                        <p className="text-sm text-gray-500">{edu?.year || ""}</p>
                                        <p className="font-semibold">{edu?.degree || ""}</p>
                                        <p className="text-gray-400">{edu?.institution || ""}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Work */}
                        <div className="bg-gray-950 border border-gray-600 rounded-xl p-6 shadow-lg">
                            <h2 className="text-xl font-bold mb-4">Work Experience</h2>
                            <div className="space-y-3">
                                {user?.work?.map((job, idx) => (
                                    <div key={idx} className="border-l-4 border-purple-600 pl-4">
                                        <p className="text-sm text-gray-500">{job?.year || ""}</p>
                                        <p className="font-semibold">{job?.position || ""}</p>
                                        <p className="text-gray-400">{job?.company || ""}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Edit Modal */}
                {/* Edit Profile Modal */}
                {isEditOpen && (
                    <section className="py-1">
                        <div className="fixed inset-0 bg-black bg-opacity-80 z-50">
                            <div className="fixed top-[70px] bottom-0 left-0 right-0 flex items-start justify-center overflow-y-auto p-4">
                                <div className="bg-gray-950 border border-gray-600 rounded-xl max-w-2xl w-full p-6 relative">
                                    <button
                                        onClick={() => setIsEditOpen(false)}
                                        className="absolute top-4 right-4 text-gray-400 hover:text-white"
                                    >
                                        <X size={24} />
                                    </button>
                                    <h2 className="text-xl font-bold text-with-secondary-outline my-4">
                                        Edit Profile
                                    </h2>

                                    {/* Form Fields */}
                                    <div className="space-y-3">
                                        {["fullName", "position", "company", "location", "bio", "batch", "department", "email", "phone", "linkedin"].map((field) => (
                                            <input
                                                key={field}
                                                type="text"
                                                placeholder={field.replace(/([A-Z])/g, " $1")}
                                                value={editData[field] || ""}
                                                onChange={(e) => setEditData({ ...editData, [field]: e.target.value })}
                                                className="input-control"
                                            />
                                        ))}

                                        {/* Education */}
                                        <h3 className="text-lg text-with-secondary-outline mt-4">Education</h3>
                                        {editData.education?.map((edu, idx) => (
                                            <div key={idx} className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="Year"
                                                    value={edu.year}
                                                    onChange={(e) => {
                                                        const updatedEdu = [...editData.education];
                                                        updatedEdu[idx].year = e.target.value;
                                                        setEditData({ ...editData, education: updatedEdu });
                                                    }}
                                                    className="input-control"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Degree"
                                                    value={edu.degree}
                                                    onChange={(e) => {
                                                        const updatedEdu = [...editData.education];
                                                        updatedEdu[idx].degree = e.target.value;
                                                        setEditData({ ...editData, education: updatedEdu });
                                                    }}
                                                    className="input-control"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Institution"
                                                    value={edu.institution}
                                                    onChange={(e) => {
                                                        const updatedEdu = [...editData.education];
                                                        updatedEdu[idx].institution = e.target.value;
                                                        setEditData({ ...editData, education: updatedEdu });
                                                    }}
                                                    className="input-control"
                                                />
                                            </div>
                                        ))}
                                        <button
                                            onClick={addEducation}
                                            className="text-with-secondary-outline flex items-center gap-2 mt-2"
                                        >
                                            <Plus size={18} /> Add Education
                                        </button>

                                        {/* Work */}
                                        <h3 className="text-lg text-with-secondary-outline mt-4">Work Experience</h3>
                                        {editData.work?.map((job, idx) => (
                                            <div key={idx} className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="Year"
                                                    value={job.year}
                                                    onChange={(e) => {
                                                        const updatedWork = [...editData.work];
                                                        updatedWork[idx].year = e.target.value;
                                                        setEditData({ ...editData, work: updatedWork });
                                                    }}
                                                    className="input-control"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Position"
                                                    value={job.position}
                                                    onChange={(e) => {
                                                        const updatedWork = [...editData.work];
                                                        updatedWork[idx].position = e.target.value;
                                                        setEditData({ ...editData, work: updatedWork });
                                                    }}
                                                    className="input-control"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Company"
                                                    value={job.company}
                                                    onChange={(e) => {
                                                        const updatedWork = [...editData.work];
                                                        updatedWork[idx].company = e.target.value;
                                                        setEditData({ ...editData, work: updatedWork });
                                                    }}
                                                    className="input-control"
                                                />
                                            </div>
                                        ))}
                                        <button
                                            onClick={addWork}
                                            className="text-with-secondary-outline flex items-center gap-2 mt-2"
                                        >
                                            <Plus size={18} /> Add Work
                                        </button>

                                        <button
                                            onClick={handleSave}
                                            className="btn btn-full btn-gradient-secondary rounded-lg my-5"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )}
            </div>
        </ProtectedRoute>
    );
}
