"use client";

import { useState } from "react";
import { Search, MapPin, Briefcase, X, Upload, Menu, PlusCircle } from "lucide-react";
import { useDropzone } from "react-dropzone";
import Link from "next/link";

export default function JobsPage() {
    const [jobsData, setJobsData] = useState([
        {
            id: 1,
            title: "Frontend Developer",
            company: "Tech Innovators",
            location: "Remote",
            type: "Full-Time",
            description:
                "We are looking for a skilled Frontend Developer to join our team and work on cutting-edge web applications.",
            requirements: ["React.js", "JavaScript", "Tailwind CSS", "API Integration"],
            tech: ["React", "Next.js", "TailwindCSS"],
        },
        {
            id: 2,
            title: "React Intern",
            company: "Code Labs",
            location: "Mumbai",
            type: "Internship",
            description:
                "An opportunity for students to gain hands-on experience in React development.",
            requirements: ["Basic React knowledge", "JavaScript", "HTML/CSS"],
            tech: ["React", "JavaScript", "Git"],
        },
    ]);

    const [selectedJob, setSelectedJob] = useState(null);
    const [isApplyOpen, setIsApplyOpen] = useState(false);
    const [isPostJobOpen, setIsPostJobOpen] = useState(false);
    const [resumeFile, setResumeFile] = useState(null);
    const [logoFile, setLogoFile] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [newJob, setNewJob] = useState({
        title: "",
        company: "",
        location: "",
        type: "",
        description: "",
        requirements: "",
        tech: "",
    });

    // Drag & Drop for Resume
    const { getRootProps: getResumeRootProps, getInputProps: getResumeInputProps } =
        useDropzone({
            onDrop: (acceptedFiles) => setResumeFile(acceptedFiles[0]),
            accept: { "application/pdf": [".pdf"], "application/msword": [".doc", ".docx"] },
        });

    // Drag & Drop for Logo
    const { getRootProps: getLogoRootProps, getInputProps: getLogoInputProps } =
        useDropzone({
            onDrop: (acceptedFiles) => setLogoFile(acceptedFiles[0]),
            accept: { "image/*": [] },
        });

    // Handle Post Job
    const postJob = () => {
        if (!newJob.title || !newJob.company || !newJob.location || !newJob.type) return;
        const job = {
            ...newJob,
            id: jobsData.length + 1,
            requirements: newJob.requirements.split(","),
            tech: newJob.tech.split(","),
        };
        setJobsData([...jobsData, job]);
        setNewJob({
            title: "",
            company: "",
            location: "",
            type: "",
            description: "",
            requirements: "",
            tech: "",
        });
        setIsPostJobOpen(false);
    };

    return (
        <div className="min-h-screen bg-black text-gray-100 relative">
            {/* Fixed Navbar */}
            <nav className="fixed top-0 left-0 w-full bg-gray-900 border-b border-gray-800 shadow-lg z-50">
                <div className="max-w-7xl mx-auto flex justify-between items-center px-6 h-16">
                    {/* Logo */}
                    <div className="text-[#32a8a8] font-bold text-lg">
                        <Link href="/" className="hover:text-[#32a8a8] transition"> EduNet Jobs <span className="text-gray-400 text-sm">| Find Your Next Opportunity</span></Link>
                    </div>

                    {/* Links - Desktop */}
                    <div className="hidden md:flex gap-6">
                        <Link href="/directory" className="hover:text-[#32a8a8] transition">Directory</Link>
                        <Link href="/eventspage" className="hover:text-[#32a8a8] transition">Events</Link>
                        <Link href="/forum" className="hover:text-[#32a8a8] transition">Forum</Link>
                    </div>

                </div>
            </nav>

            {/* Background */}
            <div className="absolute inset-0">
                <img
                    src="https://images.unsplash.com/photo-1581090700227-4c4f50b6fc63"
                    alt="Professionals working"
                    className="w-full h-full object-cover opacity-20"
                />
                <div className="absolute inset-0 bg-black bg-opacity-70"></div>
            </div>

            {/* Spacing for Navbar */}
            <div className="h-16"></div>

            {/* ✅ Hero Section */}
            <section className="text-center bg-gradient-to-r from-black via-gray-900 to-black py-14 px-6 relative">
                <h1 className="text-3xl md:text-4xl font-bold text-[#32a8a8]">
                    Find Your Next Opportunity
                </h1>
                <p className="text-gray-400 mt-3 max-w-2xl mx-auto">
                    Explore jobs, internships, and career opportunities.
                </p>
            </section>

            {/* Search */}
            <div className="relative z-10 max-w-5xl mx-auto px-4 py-4">
                <div className="bg-gray-900 rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-center shadow-lg">
                    <div className="flex items-center gap-2 bg-black px-3 py-2 rounded-lg w-full sm:w-1/3">
                        <Search size={20} className="text-[#32a8a8]" />
                        <input
                            type="text"
                            placeholder="Job title"
                            className="bg-transparent w-full outline-none text-gray-300"
                        />
                    </div>
                    <div className="flex items-center gap-2 bg-black px-3 py-2 rounded-lg w-full sm:w-1/3">
                        <Briefcase size={20} className="text-[#32a8a8]" />
                        <input
                            type="text"
                            placeholder="Company"
                            className="bg-transparent w-full outline-none text-gray-300"
                        />
                    </div>
                    <div className="flex items-center gap-2 bg-black px-3 py-2 rounded-lg w-full sm:w-1/3">
                        <MapPin size={20} className="text-[#32a8a8]" />
                        <input
                            type="text"
                            placeholder="Location"
                            className="bg-transparent w-full outline-none text-gray-300"
                        />
                    </div>
                </div>
            </div>

            {/* Jobs List */}
            <section className="relative z-10 max-w-6xl mx-auto px-4 py-10">
                <h2 className="text-2xl font-bold text-[#32a8a8] mb-6">
                    Latest Jobs & Internships
                </h2>

                {/* Buttons */}
                <div className="flex gap-3 items-center mb-10">
                    <button
                        onClick={() => setIsPostJobOpen(true)}
                        className="bg-[#32a8a8] text-black text-sm px-4 py-2 rounded-lg font-semibold hover:bg-[#2b9494]"
                    >
                        <PlusCircle size={12} className="inline-block mr-1" />
                        Post Job
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobsData.map((job) => (
                        <div
                            key={job.id}
                            className="bg-gray-900 border border-gray-700 rounded-xl p-6 shadow hover:shadow-xl hover:border-[#32a8a8] transition cursor-pointer"
                        >
                            <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                            <p className="text-gray-400">{job.company}</p>
                            <p className="text-gray-500 text-sm mt-1">
                                {job.location} • {job.type}
                            </p>
                            <button
                                onClick={() => setSelectedJob(job)}
                                className="mt-4 w-full bg-[#32a8a8] text-black font-semibold py-2 rounded-lg hover:bg-[#2b9494] transition"
                            >
                                View Details
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Job Details Modal */}
            {selectedJob && (
                <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 rounded-xl max-w-2xl w-full p-6 relative border border-gray-700">
                        <button
                            onClick={() => setSelectedJob(null)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white"
                        >
                            <X size={24} />
                        </button>

                        <h2 className="text-2xl font-bold text-[#32a8a8] mb-2">
                            {selectedJob.title}
                        </h2>
                        <p className="text-gray-400 mb-1">{selectedJob.company}</p>
                        <p className="text-gray-500 mb-4">
                            {selectedJob.location} • {selectedJob.type}
                        </p>

                        <h3 className="text-lg font-semibold text-white mb-2">
                            Description:
                        </h3>
                        <p className="text-gray-400 mb-4">{selectedJob.description}</p>

                        <h3 className="text-lg font-semibold text-white mb-2">
                            Requirements:
                        </h3>
                        <ul className="list-disc list-inside text-gray-400 mb-4">
                            {selectedJob.requirements.map((req, idx) => (
                                <li key={idx}>{req}</li>
                            ))}
                        </ul>

                        <h3 className="text-lg font-semibold text-white mb-2">Tech:</h3>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {selectedJob.tech.map((t, idx) => (
                                <span
                                    key={idx}
                                    className="text-xs bg-[#1a1a1a] border border-[#32a8a8] px-2 py-1 rounded"
                                >
                                    {t}
                                </span>
                            ))}
                        </div>

                        <button
                            onClick={() => setIsApplyOpen(true)}
                            className="w-full bg-[#32a8a8] text-black font-bold py-3 rounded-lg hover:bg-[#2b9494] transition"
                        >
                            Apply Now
                        </button>
                    </div>
                </div>
            )}

            {/* Apply Modal */}
            {isApplyOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 rounded-xl max-w-lg w-full p-6 relative border border-gray-700">
                        <button
                            onClick={() => setIsApplyOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white"
                        >
                            <X size={24} />
                        </button>

                        <h2 className="text-2xl font-bold text-[#32a8a8] mb-4">
                            Apply for {selectedJob?.title}
                        </h2>

                        <form className="space-y-4">
                            <input
                                type="text"
                                placeholder="Full Name"
                                className="w-full px-4 py-3 rounded-lg bg-[#1a1a1a] text-white border border-gray-700 focus:ring-2 focus:ring-[#32a8a8]"
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                className="w-full px-4 py-3 rounded-lg bg-[#1a1a1a] text-white border border-gray-700 focus:ring-2 focus:ring-[#32a8a8]"
                            />

                            {/* Resume Upload */}
                            <div
                                {...getResumeRootProps()}
                                className="w-full border-2 border-dashed border-gray-600 p-6 rounded-lg text-center cursor-pointer hover:border-[#32a8a8]"
                            >
                                <input {...getResumeInputProps()} />
                                {resumeFile ? (
                                    <p className="text-green-400">Uploaded: {resumeFile.name}</p>
                                ) : (
                                    <p className="text-gray-400 flex flex-col items-center">
                                        <Upload size={32} className="text-[#32a8a8] mb-2" />
                                        Drag & drop Resume or click to upload
                                    </p>
                                )}
                            </div>

                            <textarea
                                placeholder="Cover Letter (optional)"
                                rows="4"
                                className="w-full px-4 py-3 rounded-lg bg-[#1a1a1a] text-white border border-gray-700 focus:ring-2 focus:ring-[#32a8a8]"
                            ></textarea>
                            <button
                                type="submit"
                                className="w-full bg-[#32a8a8] text-black font-bold py-3 rounded-lg hover:bg-[#2b9494] transition"
                            >
                                Submit Application
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Post Job Modal */}
            {isPostJobOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 rounded-xl max-w-lg w-full p-6 relative border border-gray-700">
                        <button
                            onClick={() => setIsPostJobOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white"
                        >
                            <X size={24} />
                        </button>
                        <h2 className="text-2xl font-bold text-[#32a8a8] mb-4">
                            Post a Job
                        </h2>

                        <form className="space-y-4">
                            <input
                                type="text"
                                placeholder="Job Title"
                                value={newJob.title}
                                onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg bg-[#1a1a1a] text-white border border-gray-700 focus:ring-2 focus:ring-[#32a8a8]"
                            />
                            <input
                                type="text"
                                placeholder="Company"
                                value={newJob.company}
                                onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg bg-[#1a1a1a] text-white border border-gray-700 focus:ring-2 focus:ring-[#32a8a8]"
                            />
                            <input
                                type="text"
                                placeholder="Location"
                                value={newJob.location}
                                onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg bg-[#1a1a1a] text-white border border-gray-700 focus:ring-2 focus:ring-[#32a8a8]"
                            />
                            <input
                                type="text"
                                placeholder="Type (Full-Time / Internship)"
                                value={newJob.type}
                                onChange={(e) => setNewJob({ ...newJob, type: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg bg-[#1a1a1a] text-white border border-gray-700 focus:ring-2 focus:ring-[#32a8a8]"
                            />
                            <textarea
                                placeholder="Description"
                                rows="3"
                                value={newJob.description}
                                onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg bg-[#1a1a1a] text-white border border-gray-700 focus:ring-2 focus:ring-[#32a8a8]"
                            ></textarea>
                            <input
                                type="text"
                                placeholder="Requirements (comma separated)"
                                value={newJob.requirements}
                                onChange={(e) => setNewJob({ ...newJob, requirements: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg bg-[#1a1a1a] text-white border border-gray-700 focus:ring-2 focus:ring-[#32a8a8]"
                            />
                            <input
                                type="text"
                                placeholder="Tech Stack (comma separated)"
                                value={newJob.tech}
                                onChange={(e) => setNewJob({ ...newJob, tech: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg bg-[#1a1a1a] text-white border border-gray-700 focus:ring-2 focus:ring-[#32a8a8]"
                            />

                            <button
                                type="button"
                                onClick={postJob}
                                className="w-full bg-[#32a8a8] text-black font-bold py-3 rounded-lg hover:bg-[#2b9494] transition"
                            >
                                Post Job
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
