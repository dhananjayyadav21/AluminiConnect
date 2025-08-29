"use client";

import { useEffect, useState } from "react";
import { Search, MapPin, Briefcase, X, Upload, PlusCircle } from "lucide-react";
import { useDropzone } from "react-dropzone";
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
    const [resumeFile, setResumeFile] = useState(null);
    const [searchTitle, setSearchTitle] = useState("");
    const [searchCompany, setSearchCompany] = useState("");
    const [searchLocation, setSearchLocation] = useState("");
    const [newJob, setNewJob] = useState({
        title: "",
        company: "",
        location: "",
        type: "",
        description: "",
        requirements: "",
        tech: "",
    });

    const userRole = localStorage.getItem("userRole-edunet");
    const token = localStorage.getItem("token-edunet");

    // Drag & Drop for Resume
    const { getRootProps: getResumeRootProps, getInputProps: getResumeInputProps } = useDropzone({
        onDrop: (files) => setResumeFile(files[0]),
        accept: { "application/pdf": [".pdf"], "application/msword": [".doc", ".docx"] },
    });

    // Fetch jobs from API
    useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true);
            try {
                const res = await fetch("/api/jobs");
                const data = await res.json();
                setJobsData(data);
            } catch {
                toast.error("Error fetching jobs");
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    // Filter jobs
    const filteredJobs = jobsData.filter((job) =>
        job.title.toLowerCase().includes(searchTitle.toLowerCase()) &&
        job.company.toLowerCase().includes(searchCompany.toLowerCase()) &&
        job.location.toLowerCase().includes(searchLocation.toLowerCase())
    );

    // Post Job
    const postJob = async () => {
        const userRole = localStorage.getItem("userRole-edunet");
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

            const savedJob = await res.json();
            setJobsData((prev) => [...prev, savedJob]);
            setNewJob({ title: "", company: "", location: "", type: "", description: "", requirements: "", tech: "" });
            setIsPostJobOpen(false);
            toast.success("Job posted successfully!");
        } catch (err) {
            toast.error(err.message || "Failed to post job");
        } finally {
            setLoading(false);
        }
    };

    // Apply Job
    const applyJob = async (e) => {
        e.preventDefault();
        if (!selectedJob || !resumeFile) return toast.error("Please select a job and upload your resume");

        const formData = new FormData();
        formData.append("jobId", selectedJob.id);
        formData.append("resume", resumeFile);
        formData.append("fullName", e.target[0].value);
        formData.append("email", e.target[1].value);
        formData.append("coverLetter", e.target[2].value);

        setLoading(true);
        try {
            router.back();
            // const res = await fetch("/api/apply", { method: "POST", body: formData });
            // if (!res.ok) throw new Error("Failed to apply");

            // toast.success("Application submitted successfully!");
            // setIsApplyOpen(false);
            // setResumeFile(null);
        } catch (err) {
            // toast.error(err.message || "Error submitting application");
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
                    <div className="relative z-10">
                        <div className="h-16"></div>
                        <section className="text-center py-14 px-6">
                            <h1 className="text-3xl md:text-4xl font-bold text-with-primary-outline">
                                Find Your Next Opportunity
                            </h1>
                            <p className="text-gray-400 mt-3 max-w-2xl mx-auto">
                                Explore jobs, internships, and career opportunities.
                            </p>
                        </section>
                        {/* Search */}
                        <div className="max-w-5xl mx-auto px-4 pb-6">
                            <div className="bg-gray-950 rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-center border border-purple-500">
                                <div className="flex items-center gap-2 bg-black px-3 py-2 rounded-lg w-full sm:w-1/3">
                                    <Search size={20} className="text-primary" />
                                    <input type="text" placeholder="Job title" value={searchTitle} onChange={(e) => setSearchTitle(e.target.value)} className="bg-transparent w-full outline-none text-gray-300" />
                                </div>
                                <div className="flex items-center gap-2 bg-black px-3 py-2 rounded-lg w-full sm:w-1/3">
                                    <Briefcase size={20} className="text-primary" />
                                    <input type="text" placeholder="Company" value={searchCompany} onChange={(e) => setSearchCompany(e.target.value)} className="bg-transparent w-full outline-none text-gray-300" />
                                </div>
                                <div className="flex items-center gap-2 bg-black px-3 py-2 rounded-lg w-full sm:w-1/3">
                                    <MapPin size={20} className="text-primary" />
                                    <input type="text" placeholder="Location" value={searchLocation} onChange={(e) => setSearchLocation(e.target.value)} className="bg-transparent w-full outline-none text-gray-300" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Jobs List Section */}
                <section className="max-w-6xl mx-auto px-4 py-10">
                    <h2 className="text-2xl md:text-3xl font-bold text-with-secondary-outline mb-6">
                        Latest Jobs & Internships
                    </h2>

                    {loading ? (
                        <div className="flex items-center justify-center z-[9999] mt-10">
                            <div className="w-10 h-10 border-4 border-t-transparent border-purple-500 rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <>
                            <div className="flex gap-3 items-center mb-10">
                                {userRole === "Alumni" && (
                                    <button onClick={() => setIsPostJobOpen(true)} className="btn bg-purple-700 rounded-md border border-purple-400 hover:bg-purple-800">
                                        <PlusCircle size={12} className="inline-block mr-1" />
                                        Post Job
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredJobs.map((job) => (
                                    <div key={job.id} className="bg-gray-950 border border-gray-700 rounded-xl p-6 shadow hover:shadow-xl hover:border-purple-500 transition cursor-pointer">
                                        <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                                        <p className="text-gray-400">{job.company}</p>
                                        <p className="text-gray-500 text-sm mt-1">{job.location} • {job.type}</p>
                                        <button onClick={() => setSelectedJob(job)} className="my-2 btn rounded-md btn-gradient-primary transition">
                                            View Details
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </section>

                {/* Job Details Modal */}
                {selectedJob && (
                    <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-start justify-center z-50 overflow-auto py-20 sm:py-24 px-4">
                        <div className="bg-gray-950 rounded-xl max-w-2xl w-full p-6 relative border border-gray-700">
                            <button onClick={() => setSelectedJob(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={24} /></button>
                            <h2 className="text-2xl font-bold text-with-secondary-outline mb-2">{selectedJob.title}</h2>
                            <p className="text-gray-400 mb-1">{selectedJob.company}</p>
                            <p className="text-gray-500 mb-4">{selectedJob.location} • {selectedJob.type}</p>

                            <h3 className="text-lg font-semibold text-white mb-2">Description:</h3>
                            <p className="text-gray-400 mb-4">{selectedJob.description}</p>

                            <h3 className="text-lg font-semibold text-white mb-2">Requirements:</h3>
                            <ul className="list-disc list-inside text-gray-400 mb-4">{selectedJob.requirements?.map((req, idx) => <li key={idx}>{req}</li>)}</ul>

                            <h3 className="text-lg font-semibold text-white mb-2">Tech:</h3>
                            <div className="flex flex-wrap gap-2 mb-4">{selectedJob.tech?.map((t, idx) => <span key={idx} className="text-xs bg-[#1a1a1a] border border-amber-500 px-2 py-1 rounded">{t}</span>)}</div>

                            <button onClick={() => setIsApplyOpen(true)} className="btn btn-full btn-gradient-secondary rounded-lg">Apply Now</button>
                        </div>
                    </div>
                )}

                {/* Apply Modal */}
                {isApplyOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-start justify-center z-50 overflow-auto py-20 sm:py-24 px-4">
                        <div className="bg-gray-900 rounded-xl max-w-lg w-full p-6 relative border border-gray-700">
                            <button onClick={() => setIsApplyOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={24} /></button>
                            <h2 className="text-2xl font-bold text-with-secondary-outline mb-4">Apply for {selectedJob?.title}</h2>
                            <form className="space-y-4" onSubmit={applyJob}>
                                <input type="text" placeholder="Full Name" className="input-control" />
                                <input type="email" placeholder="Email" className="input-control" />
                                <div {...getResumeRootProps()} className="w-full border-2 border-dashed border-gray-600 p-6 rounded-lg text-center cursor-pointer hover:border-amber-600">
                                    <input {...getResumeInputProps()} />
                                    {resumeFile ? <p className="text-green-400">Uploaded: {resumeFile.name}</p> : <p className="text-gray-400 flex flex-col items-center"><Upload size={32} className="text-amber-600 mb-2" />Drag & drop Resume or click to upload</p>}
                                </div>
                                <textarea placeholder="Cover Letter (optional)" rows="4" className="input-control"></textarea>
                                <button type="submit" className="btn btn-full btn-gradient-secondary rounded-lg">Submit Application</button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Post Job Modal */}
                {isPostJobOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-start justify-center z-50 overflow-auto py-20 sm:py-24 px-4">
                        <div className="bg-gray-950 rounded-xl max-w-lg w-full p-6 relative border border-gray-700">
                            <button onClick={() => setIsPostJobOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={24} /></button>
                            <h2 className="text-2xl font-bold text-with-secondary-outline mb-4">Post a Job</h2>
                            <form className="space-y-4">
                                <input type="text" placeholder="Job Title" value={newJob.title} onChange={(e) => setNewJob({ ...newJob, title: e.target.value })} className="input-control" />
                                <input type="text" placeholder="Company" value={newJob.company} onChange={(e) => setNewJob({ ...newJob, company: e.target.value })} className="input-control" />
                                <input type="text" placeholder="Location" value={newJob.location} onChange={(e) => setNewJob({ ...newJob, location: e.target.value })} className="input-control" />
                                <input type="text" placeholder="Type (Full-Time / Internship)" value={newJob.type} onChange={(e) => setNewJob({ ...newJob, type: e.target.value })} className="input-control" />
                                <textarea placeholder="Description" rows="3" value={newJob.description} onChange={(e) => setNewJob({ ...newJob, description: e.target.value })} className="input-control"></textarea>
                                <input type="text" placeholder="Requirements (comma separated)" value={newJob.requirements} onChange={(e) => setNewJob({ ...newJob, requirements: e.target.value })} className="input-control" />
                                <input type="text" placeholder="Tech Stack (comma separated)" value={newJob.tech} onChange={(e) => setNewJob({ ...newJob, tech: e.target.value })} className="input-control" />
                                <button type="button" onClick={postJob} className="btn btn-full rounded-lg btn-gradient-secondary">Post Job</button>
                            </form>
                        </div>
                    </div>
                )}


            </div>
        </ProtectedRoute>
    );
}
