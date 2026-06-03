"use client";

import { useState, useEffect } from "react";
import { Calendar, User, Tag, ChevronRight, Bell, Star, Gift, Swords, TrendingUp } from "lucide-react";

interface Announcement {
  id: number;
  title: string;
  content: string;
  type: "event" | "update" | "maintenance" | "promotion";
  imageUrl: string;
  author: string;
  createdAt: string;
  isPinned: boolean;
  startDate?: string;
  endDate?: string;
}

const announcementTypes = {
  event: { label: "Event", color: "bg-purple-500/20 text-purple-400 border-purple-500/30", icon: Star },
  update: { label: "Update", color: "bg-blue-500/20 text-blue-400 border-blue-500/30", icon: TrendingUp },
  maintenance: { label: "Maintenance", color: "bg-red-500/20 text-red-400 border-red-500/30", icon: Swords },
  promotion: { label: "Promotion", color: "bg-amber-500/20 text-amber-400 border-amber-500/30", icon: Gift },
};

export default function AnnouncementPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>("all");

  useEffect(() => {
    const mockData: Announcement[] = [
      {
        id: 1,
        title: "🎉 Summer Festival Event 2024",
        content: "Join us for the biggest summer festival event! Collect exclusive summer-themed items, participate in special quests, and win amazing rewards. The festival features limited-time dungeons, daily login bonuses, and a special gacha pool with rare items.",
        type: "event",
        imageUrl: "/images/announcements/summer-festival.jpg",
        author: "Game Master",
        createdAt: "2024-06-01",
        isPinned: true,
        startDate: "2024-06-01",
        endDate: "2024-06-30",
      },
      {
        id: 2,
        title: "⚔️ New Character Class: Shadow Knight",
        content: "A new character class has arrived! Introducing the Shadow Knight - a powerful melee fighter with dark abilities. Unlock this class at level 30 and discover unique skills that combine offense and defense.",
        type: "update",
        imageUrl: "/images/announcements/shadow-knight.jpg",
        author: "Dev Team",
        createdAt: "2024-05-28",
        isPinned: true,
      },
      {
        id: 3,
        title: "🔧 Scheduled Server Maintenance",
        content: "Server maintenance will be performed on June 5th from 02:00 to 06:00 UTC. During this time, the game will be unavailable. We're implementing new features and fixing reported issues.",
        type: "maintenance",
        imageUrl: "/images/announcements/maintenance.jpg",
        author: "System",
        createdAt: "2024-05-30",
        isPinned: false,
      },
      {
        id: 4,
        title: "💎 Double Gem Bonus for First Purchase",
        content: "For a limited time, all first-time gem purchasers will receive double gems! This is the perfect opportunity to stock up on gems for the upcoming summer event.",
        type: "promotion",
        imageUrl: "/images/announcements/double-gems.jpg",
        author: "Admin",
        createdAt: "2024-05-25",
        isPinned: false,
        startDate: "2024-05-25",
        endDate: "2024-06-15",
      },
      {
        id: 5,
        title: "🏰 New Dungeon: Crystal Caverns",
        content: "Explore the new Crystal Caverns dungeon! This challenging new content features crystal-themed monsters, exclusive equipment drops, and a special boss fight against the Crystal Guardian.",
        type: "update",
        imageUrl: "/images/announcements/crystal-caverns.jpg",
        author: "Dev Team",
        createdAt: "2024-05-20",
        isPinned: false,
      },
      {
        id: 6,
        title: "🎊 Anniversary Celebration",
        content: "Mystic Journey is turning 1 year old! Celebrate with us through special anniversary events, login rewards, and exclusive anniversary items. Don't miss out on this historic celebration!",
        type: "event",
        imageUrl: "/images/announcements/anniversary.jpg",
        author: "Game Master",
        createdAt: "2024-05-15",
        isPinned: false,
        startDate: "2024-05-15",
        endDate: "2024-06-15",
      },
      {
        id: 7,
        title: "🛒 Limited Time Shop Items",
        content: "New items have arrived in the shop! Limited edition weapons and armor sets are available for a short period. These items won't return for a long time, so act fast!",
        type: "promotion",
        imageUrl: "/images/announcements/limited-items.jpg",
        author: "Shop Manager",
        createdAt: "2024-05-10",
        isPinned: false,
        endDate: "2024-05-31",
      },
      {
        id: 8,
        title: "⚡ Performance Optimization Update",
        content: "We've improved game performance significantly. Loading times have been reduced by 40%, and frame rates are now more stable on all devices. Enjoy a smoother gaming experience!",
        type: "update",
        imageUrl: "/images/announcements/optimization.jpg",
        author: "Tech Team",
        createdAt: "2024-05-05",
        isPinned: false,
      },
    ];

    setTimeout(() => {
      setAnnouncements(mockData);
      setLoading(false);
    }, 500);
  }, []);

  const filteredAnnouncements = announcements.filter((ann) => {
    if (selectedType === "all") return true;
    return ann.type === selectedType;
  });

  const pinnedAnnouncements = filteredAnnouncements.filter((a) => a.isPinned);
  const regularAnnouncements = filteredAnnouncements.filter((a) => !a.isPinned);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#ffc032]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#ffc032]/10 to-transparent py-16">
        <div className="absolute inset-0 bg-[url('/images/patterns/grid.svg')] opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#ffc032]/20 rounded-full mb-6">
              <Bell className="w-5 h-5 text-[#ffc032]" />
              <span className="text-[#ffc032] font-medium">Latest News</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Announcements
            </h1>
            <p className="text-white/70 text-lg">
              Stay updated with the latest news, events, and updates from the Mystic Journey team
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <button
            onClick={() => setSelectedType("all")}
            className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 cursor-pointer ${
              selectedType === "all"
                ? "bg-[#ffc032] text-black shadow-lg shadow-[#ffc032]/20"
                : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10"
            }`}
          >
            All
          </button>
          {Object.entries(announcementTypes).map(([key, { label }]) => (
            <button
              key={key}
              onClick={() => setSelectedType(key)}
              className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 cursor-pointer ${
                selectedType === key
                  ? "bg-[#ffc032] text-black shadow-lg shadow-[#ffc032]/20"
                  : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Pinned Announcements */}
        {pinnedAnnouncements.length > 0 && (
          <div className="mb-10">
            <h2 className="text-lg font-semibold text-white/80 mb-4 flex items-center gap-2">
              <Tag className="w-5 h-5 text-[#ffc032]" />
              Pinned Announcements
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {pinnedAnnouncements.map((ann) => (
                <AnnouncementCard key={ann.id} announcement={ann} isPinned />
              ))}
            </div>
          </div>
        )}

        {/* Regular Announcements */}
        <div>
          {pinnedAnnouncements.length > 0 && (
            <h2 className="text-lg font-semibold text-white/80 mb-4">Recent Updates</h2>
          )}
          <div className="space-y-4">
            {regularAnnouncements.map((ann) => (
              <AnnouncementCard key={ann.id} announcement={ann} />
            ))}
          </div>
        </div>

        {/* Empty State */}
        {filteredAnnouncements.length === 0 && (
          <div className="text-center py-20">
            <Bell className="w-20 h-20 text-white/20 mx-auto mb-4" />
            <p className="text-white/50 text-lg">No announcements found</p>
          </div>
        )}
      </div>
    </div>
  );
}

function AnnouncementCard({ announcement, isPinned = false }: { announcement: Announcement; isPinned?: boolean }) {
  const typeConfig = announcementTypes[announcement.type];
  const TypeIcon = typeConfig.icon;

  return (
    <div
      className={`group relative bg-gradient-to-br from-white/5 to-white/10 border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:border-[#ffc032]/30 hover:shadow-xl hover:shadow-[#ffc032]/5 ${
        isPinned ? "ring-2 ring-[#ffc032]/30" : ""
      }`}
    >
      {/* Pinned Badge */}
      {isPinned && (
        <div className="absolute top-4 right-4 z-10">
          <span className="px-3 py-1 bg-[#ffc032] text-black text-xs font-bold rounded-full flex items-center gap-1">
            <Star className="w-3 h-3" /> PINNED
          </span>
        </div>
      )}

      {/* Image Section */}
      <div className="relative h-40 bg-gradient-to-br from-[#ffc032]/20 to-[#ca831f]/20">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 backdrop-blur-sm">
            <TypeIcon className="w-8 h-8 text-[#ffc032]" />
          </div>
        </div>
        {/* Type Badge */}
        <div className="absolute bottom-4 left-4">
          <span className={`px-3 py-1 ${typeConfig.color} border rounded-full text-xs font-medium flex items-center gap-1.5`}>
            <TypeIcon className="w-3.5 h-3.5" />
            {typeConfig.label}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#ffc032] transition-colors">
          {announcement.title}
        </h3>
        <p className="text-white/60 text-sm mb-4 line-clamp-3">
          {announcement.content}
        </p>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-white/50 mb-4">
          <div className="flex items-center gap-1.5">
            <User className="w-4 h-4" />
            <span>{announcement.author}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <span>{announcement.createdAt}</span>
          </div>
          {announcement.startDate && (
            <div className="flex items-center gap-1.5">
              <span className="text-[#ffc032]">Start:</span>
              <span>{announcement.startDate}</span>
            </div>
          )}
          {announcement.endDate && (
            <div className="flex items-center gap-1.5">
              <span className="text-red-400">End:</span>
              <span>{announcement.endDate}</span>
            </div>
          )}
        </div>

        {/* Read More Button */}
        <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-[#ffc032]/20 text-white/70 hover:text-[#ffc032] rounded-xl transition-all duration-300 font-medium cursor-pointer">
          Read More
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
