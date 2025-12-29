"use client";

import { useEffect, useState } from "react";
import { Search, MapPin, Briefcase, X, FileText, PlusCircle, ExternalLink, User, Mail, ClipboardList, Check } from "lucide-react";
import ProtectedRoute from "@/Components/ProtectedRoute";
import { toast, Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function JobsPage() {
    const router = useRouter();
    const [jobsData, setJobsData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [isApplyOpen, setIsApplyOpen] = useState(false);
    const [isPostJobOpen, setIsPostJobOpen] = useState(false);
    const [isViewAppsOpen, setIsViewAppsOpen] = useState(false);
    const [applications, setApplications] = useState([]);
    const [searchTitle, setSearchTitle] = useState("");
    const [searchCompany, setSearchCompany] = useState("");
    const [searchLocation, setSearchLocation] = useState("");

    const [applyFormData, setApplyFormData] = useState({
        fullName: "",
        email: "",
        resumeContent: "",
        coverLetter: "",
    });

    const [newJob, setNewJob] = useState({
        title: "",
        company: "",
        location: "",
        type: "",
        description: "",
        requirements: "",
        tech: "",
    });

    // Client-side user info
    const [userRole, setUserRole] = useState(null);
    const [token, setToken] = useState(null);
    const [userId, setUserId] = useState(null);
    const [activeTab, setActiveTab] = useState("all"); // "all" or "my-posts"
    const [appliedJobIds, setAppliedJobIds] = useState(new Set());

    useEffect(() => {
        const role = localStorage.getItem("userRole-edunet");
        setUserRole(role);
        const t = localStorage.getItem("token-edunet");
        setToken(t);
        const id = localStorage.getItem("userId-edunet");
        setUserId(id);

        // If alumni, default to showing their own jobs based on user request
        if (role === "Alumni") {
            setActiveTab("my-posts");
        }

        if (t) {
            fetchUserApplications(t);
        }
    }, []);

    // Fetch jobs from API
    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchUserApplications = async (authToken) => {
        try {
            const res = await fetch("/api/jobs/apply", {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            const data = await res.json();
            if (res.ok) {
                const ids = new Set(data.map(app => app.jobId));
                setAppliedJobIds(ids);
            }
        } catch (err) {
            console.error("Error fetching user applications:", err);
        }
    };

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/jobs");
            const data = await res.json();
            setJobsData(data || []);
        } catch {
            toast.error("Error fetching jobs");
        } finally {
            setLoading(false);
        }
    };

    const fetchApplications = async (jobId) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/jobs/applications/${jobId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setApplications(data);
                setIsViewAppsOpen(true);
            } else {
                toast.error(data.error || "Failed to fetch applications");
            }
        } catch (err) {
            toast.error("Error fetching applications");
        } finally {
            setLoading(false);
        }
    };

    // Filter jobs
    const filteredJobs = jobsData.filter((job) => {
        const matchesSearch =
            job.title.toLowerCase().includes(searchTitle.toLowerCase()) &&
            job.company.toLowerCase().includes(searchCompany.toLowerCase()) &&
            job.location.toLowerCase().includes(searchLocation.toLowerCase());

        if (activeTab === "my-posts") {
            return matchesSearch && (job.postedBy?._id === userId || job.postedBy === userId);
        }
        return matchesSearch;
    });

    // Post Job
    const postJob = async () => {
        if (userRole !== "Alumni") return toast.error("Only alumni can post jobs");
        if (!newJob.title || !newJob.company || !newJob.location || !newJob.type)
            return toast.error("Please fill all required fields");

        const jobPayload = {
            ...newJob,
            requirements: newJob.requirements.split(",").map((r) => r.trim()),
            tech: newJob.tech.split(",").map((t) => t.trim()),
        };

        setLoading(true);
        try {
            const res = await fetch("/api/jobs", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(jobPayload),
            });
            if (!res.ok) throw new Error("Failed to post job");

            fetchJobs();
            setNewJob({ title: "", company: "", location: "", type: "", description: "", requirements: "", tech: "" });
            setIsPostJobOpen(false);
            toast.success("Job posted successfully!");
            setActiveTab("my-posts"); // Switch to my posts after posting
        } catch (err) {
            toast.error(err.message || "Failed to post job");
        } finally {
            setLoading(false);
        }
    };

    // Apply Job
    const applyJob = async (e) => {
        e.preventDefault();
        if (!selectedJob || !applyFormData.resumeContent) return toast.error("Please provide your resume content");

        setLoading(true);
        try {
            const res = await fetch("/api/jobs/apply", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    jobId: selectedJob._id,
                    ...applyFormData
                }),
            });

            const data = await res.json();
            if (res.ok) {
                toast.success("Application submitted successfully!");
                setAppliedJobIds(prev => new Set(prev).add(selectedJob._id));
                setIsApplyOpen(false);
                setSelectedJob(null);
                setApplyFormData({ fullName: "", email: "", resumeContent: "", coverLetter: "" });
            } else {
                throw new Error(data.error || "Failed to apply");
            }
        } catch (err) {
            toast.error(err.message || "Error submitting application");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProtectedRoute>
            <Toaster position="bottom-right" reverseOrder={false} />
            <div className="min-h-screen bg-gradient-to-l to-black via-gray-950/90 from-black text-gray-100 relative">

                {/* Hero Section */}
                <div className="relative min-h-[60vh] flex flex-col justify-center items-center">
                    <img src="/assets/img/Job.jpg" alt="Professionals working" className="absolute inset-0 w-full h-full object-cover opacity-20" />
                    <div className="absolute inset-0 bg-gradient-to-l from-black/90 via-black/30 to-black/90"></div>
                    <div className="relative z-10 w-full max-w-6xl">
                        <div className="h-16"></div>
                        <section className="text-center py-14 px-6">
                            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-amber-400">
                                Career Opportunities
                            </h1>
                            <p className="text-gray-400 mt-4 max-w-2xl mx-auto text-lg">
                                Connect with your network and find your next milestone.
                            </p>
                            <div className="flex justify-center mt-8 gap-4">
                                {userRole === "Alumni" && (
                                    <button
                                        onClick={() => setIsPostJobOpen(true)}
                                        className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-bold transition flex items-center gap-2 shadow-lg shadow-purple-600/20"
                                    >
                                        <PlusCircle size={20} />
                                        Post a Job
                                    </button>
                                )}
                            </div>
                        </section>
                        {/* Search */}
                        <div className="max-w-4xl mx-auto px-4 pb-12">
                            <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-2 flex flex-col md:flex-row gap-2 border border-white/10 shadow-2xl">
                                <div className="flex items-center gap-2 bg-black/50 px-4 py-3 rounded-xl flex-1 border border-transparent focus-within:border-purple-500/50 transition">
                                    <Search size={20} className="text-purple-500" />
                                    <input type="text" placeholder="Job title" value={searchTitle} onChange={(e) => setSearchTitle(e.target.value)} className="bg-transparent w-full outline-none text-gray-300 text-sm" />
                                </div>
                                <div className="flex items-center gap-2 bg-black/50 px-4 py-3 rounded-xl flex-1 border border-transparent focus-within:border-purple-500/50 transition">
                                    <Briefcase size={20} className="text-purple-500" />
                                    <input type="text" placeholder="Company" value={searchCompany} onChange={(e) => setSearchCompany(e.target.value)} className="bg-transparent w-full outline-none text-gray-300 text-sm" />
                                </div>
                                <div className="flex items-center gap-2 bg-black/50 px-4 py-3 rounded-xl flex-1 border border-transparent focus-within:border-purple-500/50 transition">
                                    <MapPin size={20} className="text-purple-500" />
                                    <input type="text" placeholder="Location" value={searchLocation} onChange={(e) => setSearchLocation(e.target.value)} className="bg-transparent w-full outline-none text-gray-300 text-sm" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Jobs List Section */}
                <section className="max-w-6xl mx-auto px-4 py-16">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                            <span className="w-2 h-8 bg-purple-600 rounded-full"></span>
                            {activeTab === "all" ? "Latest Openings" : "My Posted Jobs"}
                        </h2>

                        {/* Tab Switcher for Alumni */}
                        {userRole === "Alumni" && (
                            <div className="flex bg-gray-900/50 p-1.5 rounded-2xl border border-white/10">
                                <button
                                    onClick={() => setActiveTab("all")}
                                    className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === "all" ? "bg-purple-600 text-white shadow-lg" : "text-gray-400 hover:text-white"}`}
                                >
                                    Explore Jobs
                                </button>
                                <button
                                    onClick={() => setActiveTab("my-posts")}
                                    className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === "my-posts" ? "bg-purple-600 text-white shadow-lg" : "text-gray-400 hover:text-white"}`}
                                >
                                    My Postings
                                </button>
                            </div>
                        )}
                    </div>

                    {loading && jobsData.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="w-12 h-12 border-4 border-t-transparent border-purple-500 rounded-full animate-spin mb-4"></div>
                            <p className="text-gray-500">Searching for opportunities...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredJobs.length > 0 ? (
                                filteredJobs.map((job) => {
                                    const isOwner = job.postedBy?._id === userId || job.postedBy === userId;
                                    return (
                                        <div
                                            key={job._id}
                                            className="group bg-gray-900/40 border border-white/5 rounded-2xl p-6 hover:bg-gray-900/60 transition-all duration-300 hover:border-purple-500/50 hover:-translate-y-2 flex flex-col h-full"
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="p-3 bg-purple-600/10 text-purple-400 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                                    <Briefcase size={24} />
                                                </div>
                                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-gray-800 rounded-lg text-gray-400">
                                                    {job.type}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors">{job.title}</h3>
                                            <p className="text-gray-400 font-medium mb-4">{job.company}</p>

                                            <div className="flex items-center text-gray-500 text-sm gap-4 mb-6">
                                                <span className="flex items-center gap-1.5">
                                                    <MapPin size={14} /> {job.location}
                                                </span>
                                            </div>

                                            <div className="mt-auto flex flex-col gap-2">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => setSelectedJob(job)}
                                                        className={`bg-gray-800 hover:bg-gray-700 text-white font-bold py-2.5 rounded-xl transition text-sm flex items-center justify-center gap-2 ${isOwner ? 'w-full' : 'flex-1'}`}
                                                    >
                                                        Details
                                                    </button>
                                                    {!isOwner && (
                                                        appliedJobIds.has(job._id) ? (
                                                            <button
                                                                className="flex-1 bg-green-600/20 text-green-400 border border-green-500/30 font-bold py-2.5 rounded-xl transition text-sm flex items-center justify-center gap-2 cursor-default"
                                                            >
                                                                <Check size={16} />
                                                                Applied
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedJob(job);
                                                                    setIsApplyOpen(true);
                                                                }}
                                                                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 rounded-xl transition text-sm shadow-lg shadow-purple-600/10"
                                                            >
                                                                Apply
                                                            </button>
                                                        )
                                                    )}
                                                </div>

                                                {/* Show applications button ONLY if it's user's post */}
                                                {isOwner && (
                                                    <button
                                                        onClick={() => fetchApplications(job._id)}
                                                        className="w-full bg-gradient-to-r from-purple-600 to-amber-500 text-white py-3 rounded-xl text-sm font-bold hover:scale-[1.02] transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20"
                                                    >
                                                        <ClipboardList size={18} />
                                                        View Applications
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="col-span-full py-20 text-center text-gray-500">
                                    <p className="text-xl">
                                        {activeTab === "my-posts"
                                            ? "You haven't posted any jobs yet."
                                            : "No jobs found matching your criteria"}
                                    </p>
                                    {activeTab === "my-posts" && (
                                        <button
                                            onClick={() => setIsPostJobOpen(true)}
                                            className="mt-4 text-purple-500 hover:underline font-bold"
                                        >
                                            Post your first job opening
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    )
                    }
                </section>

                {/* Job Details Modal */}
                {selectedJob && !isApplyOpen && !isViewAppsOpen && (
                    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-50 p-4 animate-fadeIn">
                        <div className="bg-gray-950 rounded-3xl max-w-2xl w-full p-8 relative border border-white/10 shadow-3xl">
                            <button onClick={() => setSelectedJob(null)} className="absolute top-6 right-6 p-2 hover:bg-gray-900 rounded-full text-gray-400 transition">
                                <X size={24} />
                            </button>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-4 bg-purple-600 rounded-2xl shadow-lg shadow-purple-600/20">
                                    <Briefcase size={32} className="text-white" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold text-white">{selectedJob.title}</h2>
                                    <p className="text-purple-400 font-semibold">{selectedJob.company}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="bg-gray-900/50 p-4 rounded-2xl border border-white/5">
                                    <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Type</p>
                                    <p className="text-gray-200">{selectedJob.type}</p>
                                </div>
                                <div className="bg-gray-900/50 p-4 rounded-2xl border border-white/5">
                                    <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Location</p>
                                    <p className="text-gray-200">{selectedJob.location}</p>
                                </div>
                            </div>

                            <div className="space-y-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                                <div>
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-2">
                                        <FileText size={16} className="text-purple-500" />
                                        Job Description
                                    </h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">{selectedJob.description}</p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">Requirements</h3>
                                    <ul className="space-y-2">
                                        {selectedJob.requirements?.map((req, idx) => (
                                            <li key={idx} className="flex gap-3 text-sm text-gray-400">
                                                <span className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2 flex-shrink-0"></span>
                                                {req}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">Tech Stack</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedJob.tech?.map((t, idx) => (
                                            <span key={idx} className="px-3 py-1 bg-gray-900 border border-purple-500/30 text-purple-400 text-xs font-bold rounded-lg uppercase tracking-tight">
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsApplyOpen(true)}
                                className="w-full mt-8 bg-gradient-to-r from-purple-600 to-purple-800 hover:scale-[1.02] text-white font-bold py-4 rounded-2xl transition shadow-xl shadow-purple-900/20 active:scale-95 flex items-center justify-center gap-2"
                            >
                                <ExternalLink size={20} />
                                Apply for this Position
                            </button>
                        </div>
                    </div>
                )}

                {/* Apple Modal */}
                {isApplyOpen && (
                    <div className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center z-[60] p-4 animate-scaleIn">
                        <div className="bg-gray-950 rounded-3xl max-w-lg w-full p-8 relative border border-white/10 shadow-3xl">
                            <button onClick={() => setIsApplyOpen(false)} className="absolute top-6 right-6 p-2 hover:bg-gray-900 rounded-full text-gray-400 transition"><X size={24} /></button>
                            <h2 className="text-2xl font-bold text-white mb-2">Apply Now</h2>
                            <p className="text-gray-500 text-sm mb-8">Role: <span className="text-purple-400 font-bold">{selectedJob?.title}</span> at {selectedJob?.company}</p>

                            <form className="space-y-5" onSubmit={applyJob}>
                                <div className="space-y-4">
                                    <div className="bg-gray-900/50 rounded-2xl p-4 border border-white/5 focus-within:border-purple-600/50 transition">
                                        <input
                                            type="text"
                                            placeholder="Full Name"
                                            required
                                            value={applyFormData.fullName}
                                            onChange={(e) => setApplyFormData({ ...applyFormData, fullName: e.target.value })}
                                            className="bg-transparent w-full outline-none text-white text-sm"
                                        />
                                    </div>
                                    <div className="bg-gray-900/50 rounded-2xl p-4 border border-white/5 focus-within:border-purple-600/50 transition">
                                        <input
                                            type="email"
                                            placeholder="Email Address"
                                            required
                                            value={applyFormData.email}
                                            onChange={(e) => setApplyFormData({ ...applyFormData, email: e.target.value })}
                                            className="bg-transparent w-full outline-none text-white text-sm"
                                        />
                                    </div>
                                    <div className="bg-gray-900/50 rounded-2xl p-4 border border-white/5 focus-within:border-purple-600/50 transition">
                                        <textarea
                                            placeholder="Resume Content (Write your skills, experience, and education here...)"
                                            rows="6"
                                            required
                                            value={applyFormData.resumeContent}
                                            onChange={(e) => setApplyFormData({ ...applyFormData, resumeContent: e.target.value })}
                                            className="bg-transparent w-full outline-none text-white text-sm resize-none custom-scrollbar"
                                        />
                                    </div>
                                    <div className="bg-gray-900/50 rounded-2xl p-4 border border-white/5 focus-within:border-purple-600/50 transition">
                                        <textarea
                                            placeholder="Cover Letter (Optional)"
                                            rows="3"
                                            value={applyFormData.coverLetter}
                                            onChange={(e) => setApplyFormData({ ...applyFormData, coverLetter: e.target.value })}
                                            className="bg-transparent w-full outline-none text-white text-sm resize-none"
                                        />
                                    </div>
                                </div>
                                <button type="submit" disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-2xl transition shadow-xl shadow-purple-600/20 disabled:opacity-50 disabled:cursor-not-allowed">
                                    {loading ? "Submitting..." : "Submit Application"}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* View Applications Modal */}
                {isViewAppsOpen && (
                    <div className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center z-[60] p-4 animate-scaleIn">
                        <div className="bg-gray-950 rounded-3xl max-w-3xl w-full p-8 relative border border-white/10 shadow-3xl">
                            <button onClick={() => setIsViewAppsOpen(false)} className="absolute top-6 right-6 p-2 hover:bg-gray-900 rounded-full text-gray-400 transition"><X size={24} /></button>
                            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                                <ClipboardList className="text-purple-500" />
                                Applications Received
                            </h2>

                            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar text-left">
                                {applications.length > 0 ? (
                                    applications.map((app) => (
                                        <div key={app._id} className="bg-gray-900/50 rounded-2xl p-6 border border-white/5">
                                            <div className="flex items-center gap-4 mb-4">
                                                <img
                                                    src={app.applicantId?.profilePic || "/assets/img/placeholder-profile.avif"}
                                                    className="w-12 h-12 rounded-full ring-2 ring-purple-600/30"
                                                    alt=""
                                                />
                                                <div>
                                                    <h3 className="font-bold text-gray-200">{app.fullName}</h3>
                                                    <p className="text-xs text-gray-500 flex items-center gap-2">
                                                        <Mail size={12} /> {app.email}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div>
                                                    <p className="text-[10px] uppercase font-bold text-purple-400 tracking-widest mb-1">Resume Content</p>
                                                    <div className="bg-black/40 p-3 rounded-xl border border-white/5 text-sm text-gray-400 whitespace-pre-wrap">
                                                        {app.resumeContent}
                                                    </div>
                                                </div>
                                                {app.coverLetter && (
                                                    <div>
                                                        <p className="text-[10px] uppercase font-bold text-amber-400 tracking-widest mb-1">Cover Letter</p>
                                                        <div className="bg-black/40 p-3 rounded-xl border border-white/5 text-sm text-gray-400 italic">
                                                            {app.coverLetter}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-20 text-center text-gray-500">
                                        <p>No applications received yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Post Job Modal */}
                {isPostJobOpen && (
                    <div className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center z-[60] p-4 animate-scaleIn">
                        <div className="bg-gray-950 rounded-3xl max-w-lg w-full p-8 relative border border-white/10 shadow-3xl">
                            <button onClick={() => setIsPostJobOpen(false)} className="absolute top-6 right-6 p-2 hover:bg-gray-900 rounded-full text-gray-400 transition"><X size={24} /></button>
                            <h2 className="text-2xl font-bold text-white mb-8">Post a New Opportunity</h2>

                            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); postJob(); }}>
                                <div className="space-y-3">
                                    <div className="bg-gray-900/50 rounded-2xl p-4 border border-white/5 focus-within:border-purple-600/50 transition">
                                        <input type="text" placeholder="Job Title" value={newJob.title} onChange={(e) => setNewJob({ ...newJob, title: e.target.value })} className="bg-transparent w-full outline-none text-white text-sm" />
                                    </div>
                                    <div className="bg-gray-900/50 rounded-2xl p-4 border border-white/5 focus-within:border-purple-600/50 transition">
                                        <input type="text" placeholder="Company Name" value={newJob.company} onChange={(e) => setNewJob({ ...newJob, company: e.target.value })} className="bg-transparent w-full outline-none text-white text-sm" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-gray-900/50 rounded-2xl p-4 border border-white/5 focus-within:border-purple-600/50 transition">
                                            <input type="text" placeholder="Location" value={newJob.location} onChange={(e) => setNewJob({ ...newJob, location: e.target.value })} className="bg-transparent w-full outline-none text-white text-sm" />
                                        </div>
                                        <div className="bg-gray-900/50 rounded-2xl p-4 border border-white/5 focus-within:border-purple-600/50 transition">
                                            <select
                                                value={newJob.type}
                                                onChange={(e) => setNewJob({ ...newJob, type: e.target.value })}
                                                className="bg-transparent w-full outline-none text-white text-sm"
                                            >
                                                <option value="" className="bg-gray-950">Select Type</option>
                                                <option value="Full-Time" className="bg-gray-950">Full-Time</option>
                                                <option value="Internship" className="bg-gray-950">Internship</option>
                                                <option value="Contract" className="bg-gray-950">Contract</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="bg-gray-900/50 rounded-2xl p-4 border border-white/5 focus-within:border-purple-600/50 transition">
                                        <textarea placeholder="Job Description" rows="4" value={newJob.description} onChange={(e) => setNewJob({ ...newJob, description: e.target.value })} className="bg-transparent w-full outline-none text-white text-sm resize-none"></textarea>
                                    </div>
                                    <div className="bg-gray-900/50 rounded-2xl p-4 border border-white/5 focus-within:border-purple-600/50 transition">
                                        <input type="text" placeholder="Requirements (comma separated)" value={newJob.requirements} onChange={(e) => setNewJob({ ...newJob, requirements: e.target.value })} className="bg-transparent w-full outline-none text-white text-sm" />
                                    </div>
                                    <div className="bg-gray-900/50 rounded-2xl p-4 border border-white/5 focus-within:border-purple-600/50 transition">
                                        <input type="text" placeholder="Tech Stack (comma separated)" value={newJob.tech} onChange={(e) => setNewJob({ ...newJob, tech: e.target.value })} className="bg-transparent w-full outline-none text-white text-sm" />
                                    </div>
                                </div>
                                <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-purple-600 to-amber-500 text-white font-bold py-4 rounded-2xl transition shadow-xl shadow-purple-600/20 active:scale-95 disabled:opacity-50">
                                    {loading ? "Posting..." : "Create Job Posting"}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
}
