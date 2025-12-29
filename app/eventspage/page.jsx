"use client";

import { useState, useEffect } from "react";
import { CalendarDays, Plus, X, ExternalLink, User } from "lucide-react";
import ProtectedRoute from "@/Components/ProtectedRoute";

export default function EventsPage() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [token, setToken] = useState(null);
    const [userId, setUserId] = useState(null);

    const [newEvent, setNewEvent] = useState({
        title: "",
        date: "",
        time: "",
        description: "",
        link: "",
    });

    useEffect(() => {
        const role = localStorage.getItem("userRole-edunet");
        const t = localStorage.getItem("token-edunet");
        const id = localStorage.getItem("userId-edunet");
        setUserRole(role);
        setToken(t);
        setUserId(id);
    }, []);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/events");
            const data = await res.json();
            if (res.ok) {
                setEvents(data);
            }
        } catch (err) {
            console.error("Error fetching events:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddEvent = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/events", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(newEvent),
            });
            const data = await res.json();
            if (res.ok) {
                setEvents([data, ...events]);
                setNewEvent({ title: "", date: "", time: "", description: "", link: "" });
                setIsAddModalOpen(false);
                // toast.success("Event created!");
            } else {
                alert(data.error || "Failed to create event");
            }
        } catch (err) {
            alert("Error creating event");
        } finally {
            setLoading(false);
        }
    };

    const handleRSVP = async (eventId) => {
        try {
            const res = await fetch("/api/events/rsvp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ eventId }),
            });
            const data = await res.json();
            if (res.ok) {
                // Update local state
                setEvents(events.map(event => {
                    if (event._id === eventId) {
                        const newAttendees = data.rsvp
                            ? [...event.attendees, userId]
                            : event.attendees.filter(id => id !== userId);
                        return { ...event, attendees: newAttendees };
                    }
                    return event;
                }));
            }
        } catch (err) {
            console.error("RSVP Error:", err);
        }
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-black text-white relative font-sans pt-16">
                {/* Hero Section */}
                <section className="relative min-h-[50vh] flex flex-col justify-center items-center overflow-hidden border-b border-white/10">
                    {/* Abstract background */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] -mr-48 -mt-48 animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-600/10 rounded-full blur-[120px] -ml-48 -mb-48"></div>

                    <div className="relative z-10 w-full max-w-4xl px-6 text-center">
                        <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-white to-amber-400 drop-shadow-lg p-2 mb-4">
                            Events & Webinars
                        </h1>
                        <p className="text-gray-300 max-w-2xl mx-auto text-xl md:text-2xl leading-relaxed">
                            Join, connect, and learn from the best in tech.
                        </p>
                        {userRole === "Alumni" && (
                            <div className="flex justify-center mt-8">
                                <button
                                    onClick={() => setIsAddModalOpen(true)}
                                    className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-bold transition flex items-center gap-2 shadow-lg shadow-purple-600/20"
                                >
                                    <PlusCircle size={20} />
                                    Post Event
                                </button>
                            </div>
                        )}
                    </div>
                </section>

                {/* Events Section */}
                <section className="bg-black py-20 px-6 relative overflow-hidden">
                    {/* Background decorations */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-600/10 rounded-full blur-[100px]"></div>

                    <div className="relative z-10 max-w-7xl mx-auto">
                        <div className="flex items-center justify-between mb-12">
                            <h2 className="text-3xl font-bold text-white flex items-center gap-4">
                                <span className="w-2 h-10 bg-purple-600 rounded-full"></span>
                                Upcoming Events
                            </h2>
                        </div>

                        {loading && events.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <div className="w-12 h-12 border-4 border-t-transparent border-purple-500 rounded-full animate-spin mb-4"></div>
                                <p className="text-gray-500">Fetching events...</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {events.map((event) => {
                                    const isGoing = event.attendees.includes(userId);
                                    return (
                                        <div
                                            key={event._id}
                                            className="group bg-gray-900/40 border border-white/5 rounded-3xl p-8 hover:bg-gray-900/60 transition-all duration-300 hover:border-purple-500/50 hover:-translate-y-2 flex flex-col h-full"
                                        >
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="p-4 bg-purple-600/10 text-purple-400 rounded-2xl group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                                    <CalendarDays size={28} />
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 bg-amber-600/20 text-amber-500 rounded-lg">
                                                        {event.time}
                                                    </span>
                                                    <span className="text-gray-500 text-xs mt-2 font-medium">{event.date}</span>
                                                </div>
                                            </div>

                                            <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-purple-400 transition-colors">
                                                {event.title}
                                            </h3>
                                            <p className="text-gray-400 text-sm leading-relaxed mb-8 flex-grow">
                                                {event.description}
                                            </p>

                                            <div className="mt-auto pt-6 border-t border-white/5">
                                                <div className="flex gap-4">
                                                    <a
                                                        href={event.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 rounded-2xl transition flex items-center justify-center gap-2 text-sm"
                                                    >
                                                        <ExternalLink size={16} /> Join
                                                    </a>
                                                    <button
                                                        onClick={() => handleRSVP(event._id)}
                                                        className={`flex-1 font-bold py-3 rounded-2xl transition-all duration-300 text-sm ${isGoing
                                                            ? "bg-green-600/20 text-green-400 border border-green-500/30"
                                                            : "bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-600/20"
                                                            }`}
                                                    >
                                                        {isGoing ? "Going" : "RSVP"}
                                                    </button>
                                                </div>
                                                <div className="mt-4 flex items-center gap-2">
                                                    <div className="flex -space-x-2">
                                                        {[...Array(Math.min(event.attendees.length, 3))].map((_, i) => (
                                                            <div key={i} className="w-6 h-6 rounded-full bg-gray-700 border-2 border-gray-900 flex items-center justify-center overflow-hidden">
                                                                <User size={12} className="text-gray-400" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <p className="text-[10px] text-gray-500 font-medium">
                                                        {event.attendees.length} people registered
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {!loading && events.length === 0 && (
                            <div className="text-center py-20 text-gray-500">
                                <CalendarDays size={48} className="mx-auto mb-4 opacity-20" />
                                <p className="text-xl">No events scheduled at the moment.</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Add Event Modal */}
                {isAddModalOpen && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-4">
                        <div className="bg-gray-950 rounded-3xl max-w-lg w-full p-8 relative border border-white/10 shadow-2xl animate-in fade-in zoom-in duration-300">
                            <button
                                onClick={() => setIsAddModalOpen(false)}
                                className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>
                            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-amber-400 mb-2">
                                Schedule Event
                            </h2>
                            <p className="text-gray-500 text-sm mb-8">Share your knowledge with the community.</p>

                            <form className="space-y-5" onSubmit={handleAddEvent}>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Event Title</label>
                                    <input
                                        type="text"
                                        placeholder="Web Development Deep Dive"
                                        className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-purple-500/50 transition-all"
                                        value={newEvent.title}
                                        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Date</label>
                                        <input
                                            type="date"
                                            className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-purple-500/50 transition-all"
                                            value={newEvent.date}
                                            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Time</label>
                                        <input
                                            type="time"
                                            className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-purple-500/50 transition-all"
                                            value={newEvent.time}
                                            onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Description</label>
                                    <textarea
                                        placeholder="What will students learn?"
                                        rows="3"
                                        className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-purple-500/50 transition-all resize-none"
                                        value={newEvent.description}
                                        onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                                        required
                                    ></textarea>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Meeting Link</label>
                                    <input
                                        type="url"
                                        placeholder="https://meet.google.com/..."
                                        className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-purple-500/50 transition-all"
                                        value={newEvent.link}
                                        onChange={(e) => setNewEvent({ ...newEvent, link: e.target.value })}
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-purple-600 to-purple-800 text-white font-bold py-4 rounded-2xl transition hover:opacity-90 shadow-xl shadow-purple-600/20 mt-4 disabled:opacity-50"
                                >
                                    {loading ? "Creating..." : "Add Event"}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
}
