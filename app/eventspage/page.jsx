"use client";

import { useState, useEffect } from "react";
import { CalendarDays, Plus, X, ExternalLink } from "lucide-react";

export default function EventsPage() {
    const [events, setEvents] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newEvent, setNewEvent] = useState({
        title: "",
        date: "",
        time: "",
        description: "",
        link: "",
    });

    // Load events from localStorage or default
    useEffect(() => {
        const storedEvents = typeof window !== "undefined" ? localStorage.getItem("events") : null;
        if (storedEvents && JSON.parse(storedEvents).length > 0) {
            setEvents(JSON.parse(storedEvents));
        } else {
            const defaultEvents = [
                {
                    id: 1,
                    title: "Web Development Webinar",
                    date: "2025-07-20",
                    time: "5:00 PM",
                    description: "Learn the latest trends in web development and frameworks.",
                    link: "https://meet.google.com/example-link",
                    rsvp: false,
                },
                {
                    id: 2,
                    title: "Networking Session",
                    date: "2025-07-25",
                    time: "6:30 PM",
                    description: "Connect with professionals in the IT industry.",
                    link: "https://meet.google.com/network-session",
                    rsvp: false,
                },
            ];
            setEvents(defaultEvents);
            localStorage.setItem("events", JSON.stringify(defaultEvents));
        }
    }, []);


    // Save events to localStorage
    useEffect(() => {
        localStorage.setItem("events", JSON.stringify(events));
    }, [events]);

    const handleAddEvent = (e) => {
        e.preventDefault();
        const newEventData = {
            id: Date.now(),
            ...newEvent,
            rsvp: false,
        };
        setEvents([...events, newEventData]);
        setNewEvent({ title: "", date: "", time: "", description: "", link: "" });
        setIsAddModalOpen(false);
    };

    const handleRSVP = (id) => {
        setEvents(events.map(event =>
            event.id === id ? { ...event, rsvp: !event.rsvp } : event
        ));
    };

    return (
        <div className="min-h-screen bg-black text-white relative font-sans pt-16">
            {/* Hero Section */}
            <div className="relative w-full h-[100vh]">
                <img
                    src="/assets/img/event.jpeg"
                    alt="Event Background"
                    className="absolute inset-0 w-full h-full object-cover "
                />
                <div className="absolute inset-0 bg-gradient-to-tl from-black via-gray-950/90 to-black opacity-80 backdrop-blur-md"></div>

                <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
                    <h1 className="text-4xl md:text-5xl font-sans text-with-secondary-outline drop-shadow-lg">
                        Upcoming Events & Webinars
                    </h1>
                    <p className="text-gray-200 mt-3 max-w-2xl text-lg">
                        Join, connect, and learn from the best in tech.
                    </p>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="btn btn-gradient-secondary rounded-xl my-4"
                    >
                        <Plus size={18} className="inline mr-2" />
                        Add Event
                    </button>
                </div>
            </div>

            {/* Events Section */}
            <section className="bg-gradient-to-tr to-purple-950 via-black from-black">

                <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 ">
                    <h2 className="text-3xl font-bold text-with-primary-outline mb-8 flex items-center gap-3">
                        <CalendarDays size={30} /> Events Calendar
                    </h2>

                    {/* Event Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {events.map((event) => (
                            <div
                                key={event.id}
                                className="box-shadow-secondary transition transform hover:translate-y-2 duration-300 ease-in"
                            >
                                <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                                <p className="text-gray-400 text-sm">{event.date} • {event.time}</p>
                                <p className="text-gray-500 text-sm mt-3">{event.description}</p>

                                <div className="flex gap-3 mt-6">
                                    <a
                                        href={event.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-gradient-primary rounded-lg"
                                    >
                                        <ExternalLink size={16} className="inline mr-1" /> Join
                                    </a>
                                    <button
                                        onClick={() => handleRSVP(event.id)}
                                        className={`flex-1 py-2 rounded-lg font-bold transition-all duration-300 ${event.rsvp
                                            ? "bg-amber-500 border border-amber-100 text-black hover:scale-103"
                                            : "bg-transparent text-amber-500 border border-amber-900 hover:bg-[#1f1f1f]"
                                            }`}
                                    >
                                        {event.rsvp ? "Going" : "RSVP"}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </section>

            {/* Add Event Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-950 rounded-2xl max-w-lg w-full p-6 relative border border-gray-700 shadow-xl">
                        <button
                            onClick={() => setIsAddModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white"
                        >
                            <X size={24} />
                        </button>
                        <h2 className="text-2xl font-bold text-with-secondary-outline mb-6">Add New Event</h2>
                        <form className="space-y-4" onSubmit={handleAddEvent}>
                            <input
                                type="text"
                                placeholder="Event Title"
                                className="input-control"
                                value={newEvent.title}
                                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                required
                            />
                            <input
                                type="date"
                                className="input-control"
                                value={newEvent.date}
                                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                                required
                            />
                            <input
                                type="time"
                                className="input-control"
                                value={newEvent.time}
                                onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                                required
                            />
                            <textarea
                                placeholder="Description"
                                rows="3"
                                className="input-control"
                                value={newEvent.description}
                                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                                required
                            ></textarea>
                            <input
                                type="url"
                                placeholder="Google Meet Link"
                                className="input-control"
                                value={newEvent.link}
                                onChange={(e) => setNewEvent({ ...newEvent, link: e.target.value })}
                                required
                            />
                            <button
                                type="submit"
                                className="btn btn-full btn-gradient-secondary rounded-lg"
                            >
                                Add Event
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
