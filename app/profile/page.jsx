"use client";

import { useState } from "react";
import { Edit3, Mail, Phone, Linkedin, MapPin, X, Plus } from "lucide-react";
import ProtectedRoute from "@/Components/ProtectedRoute";

export default function ProfilePage() {
    const [isEditOpen, setIsEditOpen] = useState(false);

    const [user, setUser] = useState({
        name: "John Doe",
        designation: "Software Engineer",
        company: "Google",
        location: "San Francisco, USA",
        bio: "Passionate about building scalable web applications and helping the community grow.",
        graduationYear: "2018",
        department: "Computer Science",
        email: "john.doe@example.com",
        phone: "+1 234 567 890",
        linkedin: "https://linkedin.com/in/johndoe",
        education: [
            { year: "2014 - 2018", degree: "B.Tech in Computer Science", institution: "ABC University" },
        ],
        work: [
            { year: "2019 - Present", position: "Software Engineer", company: "Google" },
            { year: "2018 - 2019", position: "Frontend Developer", company: "Startup XYZ" },
        ],
    });

    const [editData, setEditData] = useState(user);

    const handleSave = () => {
        setUser(editData);
        setIsEditOpen(false);
    };

    const addEducation = () => {
        setEditData({
            ...editData,
            education: [...editData.education, { year: "", degree: "", institution: "" }],
        });
    };

    const addWork = () => {
        setEditData({
            ...editData,
            work: [...editData.work, { year: "", position: "", company: "" }],
        });
    };

    return (
        <ProtectedRoute>
            <div className="bg-black text-white min-h-screen pt-16 pb-4 px-2 sm:px-6">
                {/* Profile Header */}
                <div className="relative w-full h-48 sm:h-64 bg-gradient-to-r from-gray-800 to-gray-900 mt-0">
                    <img
                        src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
                        alt="Cover"
                        className="absolute inset-0 w-full h-full object-cover opacity-30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
                </div>


                {/* Profile Content */}
                <div className="max-w-5xl mx-auto relative -mt-20">
                    {/* Profile Card */}
                    <div className="bg-gray-950 border border-gray-600 rounded-xl shadow-lg p-6 sm:p-8 text-center relative">
                        {/* Profile Picture */}
                        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
                            <img
                                src="https://randomuser.me/api/portraits/men/75.jpg"
                                alt="Profile"
                                className="w-32 h-32 rounded-full border-4 border-amber-600 object-cover"
                            />
                        </div>

                        <div className="mt-16">
                            <h1 className="text-2xl sm:text-3xl font-bold">{user.name}</h1>
                            <p className="text-gray-400 text-sm sm:text-base mt-1">
                                {user.designation} at {user.company}
                            </p>
                            <p className="text-gray-500 text-xs sm:text-sm flex items-center justify-center gap-2 mt-2">
                                <MapPin size={16} /> {user.location}
                            </p>
                        </div>

                        {/* Edit Button */}
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
                        <h2 className="text-xl font-bold text-with-secondary-outline mb-4">About</h2>
                        <p className="text-gray-300 mb-4">{user.bio}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-400">
                            <p><strong>Graduation Year:</strong> {user.graduationYear}</p>
                            <p><strong>Department:</strong> {user.department}</p>
                            <p><strong>Current Role:</strong> {user.designation}</p>
                            <p><strong>Company:</strong> {user.company}</p>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="bg-gray-950 border border-gray-600 rounded-xl mt-8 p-6 shadow-lg">
                        <h2 className="text-xl font-bold text-with-secondary-outline mb-4">Contact Information</h2>
                        <div className="space-y-3 text-gray-400">
                            <p className="flex items-center gap-3"><Mail size={18} /> {user.email}</p>
                            <p className="flex items-center gap-3"><Phone size={18} /> {user.phone}</p>
                            <a
                                href={user.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 hover:text-with-secondary-outline"
                            >
                                <Linkedin size={18} /> LinkedIn Profile
                            </a>
                        </div>
                    </div>

                    {/* Timeline Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                        {/* Education */}
                        <div className="bg-gray-950 border border-gray-600 rounded-xl p-6 shadow-lg">
                            <h2 className="text-xl font-bold text-with-secondary-outline mb-4">Education</h2>
                            <div className="space-y-3">
                                {user.education.map((edu, idx) => (
                                    <div key={idx} className="border-l-4 border-purple-600 pl-4">
                                        <p className="text-sm text-gray-500">{edu.year}</p>
                                        <p className="font-semibold">{edu.degree}</p>
                                        <p className="text-gray-400">{edu.institution}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Work */}
                        <div className="bg-gray-950 border border-gray-600 rounded-xl p-6 shadow-lg">
                            <h2 className="text-xl font-bold text-with-secondary-outline mb-4">Work Experience</h2>
                            <div className="space-y-3">
                                {user.work.map((job, idx) => (
                                    <div key={idx} className="border-l-4 border-purple-600 pl-4">
                                        <p className="text-sm text-gray-500">{job.year}</p>
                                        <p className="font-semibold">{job.position}</p>
                                        <p className="text-gray-400">{job.company}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>


                {/* Edit Profile Modal */}
                {isEditOpen && (
                    <section className="py-1">
                        <div className="fixed inset-0 bg-black bg-opacity-80 z-50">
                            {/* Modal container with fixed top 70px and bottom 0 */}
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
                                        {["name", "designation", "company", "location", "bio", "graduationYear", "department", "email", "phone", "linkedin"].map((field) => (
                                            <input
                                                key={field}
                                                type="text"
                                                placeholder={field.replace(/([A-Z])/g, " $1")}
                                                value={editData[field]}
                                                onChange={(e) => setEditData({ ...editData, [field]: e.target.value })}
                                                className="input-control"
                                            />
                                        ))}

                                        {/* Education */}
                                        <h3 className="text-lg text-with-secondary-outline mt-4">Education</h3>
                                        {editData.education.map((edu, idx) => (
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
                                        {editData.work.map((job, idx) => (
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
