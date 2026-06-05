"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Calendar, User, Tag, ArrowLeft, Star, Gift, Swords, TrendingUp, Share2, Bookmark, Clock } from "lucide-react";

interface ContentDetail {
  id: number;
  title: string;
  content: string;
  type: "event" | "update" | "maintenance" | "promotion";
  imageUrl: string;
  author: string;
  createdAt: string;
  updatedAt?: string;
  isPinned: boolean;
  startDate?: string;
  endDate?: string;
  fullContent: string;
}

const contentTypes = {
  event: { label: "Event", color: "bg-purple-500/20 text-purple-400 border-purple-500/30", icon: Star },
  update: { label: "Update", color: "bg-blue-500/20 text-blue-400 border-blue-500/30", icon: TrendingUp },
  maintenance: { label: "Maintenance", color: "bg-red-500/20 text-red-400 border-red-500/30", icon: Swords },
  promotion: { label: "Promotion", color: "bg-amber-500/20 text-amber-400 border-amber-500/30", icon: Gift },
};

export default function ContentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [content, setContent] = useState<ContentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedContents, setRelatedContents] = useState<ContentDetail[]>([]);

  useEffect(() => {
    const mockData: ContentDetail[] = [
      {
        id: 1,
        title: "🎉 Summer Festival Event 2024",
        content: "Join us for the biggest summer festival event!",
        fullContent: `Join us for the biggest summer festival event the game has ever seen! This year's Summer Festival brings an exciting array of activities and rewards.

## Festival Highlights

**🌴 Limited-Time Dungeons**
Explore the new Summer Island dungeon, featuring water-themed enemies and exclusive summer equipment. Complete daily challenges to earn festival tokens.

**🎁 Daily Login Bonuses**
Log in every day during the event to receive increasing rewards. Day 7 grants you a special Summer Mount!

**🎰 Special Gacha Pool**
A limited gacha pool featuring summer-themed items including costumes, weapons, and companion pets. Rates are boosted for rare items!

**🏆 Festival Quests**
Complete special quests to earn the Festival Title "Summer Champion" and exclusive rewards.

Don't miss out on this celebration of summer fun in Mystic Journey!`,
        type: "event",
        imageUrl: "/images/announcements/summer-festival.jpg",
        author: "Game Master",
        createdAt: "2024-06-01",
        updatedAt: "2024-06-02",
        isPinned: true,
        startDate: "2024-06-01",
        endDate: "2024-06-30",
      },
      {
        id: 2,
        title: "⚔️ New Character Class: Shadow Knight",
        content: "A new character class has arrived!",
        fullContent: `A powerful new character class has arrived in Mystic Journey! Introducing the **Shadow Knight** - a devastating melee fighter who harnesses the power of darkness.

## Class Overview

The Shadow Knight excels in both offense and defense, making them a versatile choice for all game modes.

### Unique Skills

**Shadow Strike** - Teleport behind enemies and deal massive damage
**Dark Shield** - Absorb incoming damage for a short duration  
**Void Cleave** - A powerful AoE attack that weakens enemies
**Death Sentence** - Mark an enemy for guaranteed critical hits

### Unlock Requirements
- Character Level 30
- Complete the "Dark Forest" questline
- 100,000 Gold

### Equipment Focus
Shadow Knights benefit most from:
- Heavy Armor
- Dual-wielding swords
- Shadow-infused weapons

Become the darkness itself and dominate the battlefield!`,
        type: "update",
        imageUrl: "/images/announcements/shadow-knight.jpg",
        author: "Dev Team",
        createdAt: "2024-05-28",
        updatedAt: "2024-05-29",
        isPinned: true,
      },
      {
        id: 3,
        title: "🔧 Scheduled Server Maintenance",
        content: "Server maintenance will be performed on June 5th",
        fullContent: `Dear players,

Server maintenance will be performed on **June 5th, 2024** from **02:00 to 06:00 UTC**.

## Maintenance Details

**Duration:** 4 hours
**Start Time:** 02:00 UTC
**End Time:** 06:00 UTC

### What's Being Updated

- Performance optimizations for smoother gameplay
- Bug fixes for reported issues
- New content preparation
- Security updates

### Important Notes

During maintenance, all game servers will be unavailable. Please log out before the maintenance window to avoid any data loss.

We appreciate your patience and understanding. See you after the update!

**Mystic Journey Team**`,
        type: "maintenance",
        imageUrl: "/images/announcements/maintenance.jpg",
        author: "System",
        createdAt: "2024-05-30",
        isPinned: false,
      },
      {
        id: 4,
        title: "💎 Double Gem Bonus for First Purchase",
        content: "For a limited time, all first-time gem purchasers will receive double gems!",
        fullContent: `🎉 **SPECIAL OFFER FOR NEW PLAYERS** 🎉

For a limited time, all first-time gem purchasers will receive **DOUBLE GEMS**!

### How It Works
1. Make your first gem purchase of any amount
2. Receive 100% bonus gems on top
3. Example: Purchase 100 gems → Get 200 gems!

### Perfect Timing
This offer is perfect for stocking up on gems for the upcoming Summer Event. Use your gems for:
- Premium gacha pulls
- Exclusive costumes
- Convenience items
- And more!

### Offer Ends
**June 15th, 2024**

Don't miss this opportunity to maximize your first purchase value!`,
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
        content: "Explore the new Crystal Caverns dungeon!",
        fullContent: `A new challenging dungeon has opened its doors to adventurers!

## Crystal Caverns Dungeon

### Overview
The Crystal Caverns are a treacherous network of caves filled with crystal-themed monsters and valuable treasures.

### Difficulty Levels
- **Normal:** For players level 20+
- **Hard:** For players level 40+
- **Nightmare:** For players level 60+ (Coming Soon)

### Boss: The Crystal Guardian
Face the mighty Crystal Guardian, a massive golem that controls the caverns. Defeating it grants:
- Crystal equipment set
- Exclusive "Cave Delver" title
- Rare crafting materials

### Dungeon Mechanics
- Crystal debuffs: Watch your mana consumption
- Hidden treasure rooms: Find them for bonus loot
- Daily resets at midnight server time

Gather your party and explore the depths!`,
        type: "update",
        imageUrl: "/images/announcements/crystal-caverns.jpg",
        author: "Dev Team",
        createdAt: "2024-05-20",
        updatedAt: "2024-05-21",
        isPinned: false,
      },
      {
        id: 6,
        title: "🎊 Anniversary Celebration",
        content: "Mystic Journey is turning 1 year old!",
        fullContent: `🎊 **HAPPY 1ST ANNIVERSARY, MYSTIC JOURNEY!** 🎊

Mystic Journey has officially turned 1 year old, and we're celebrating with YOU!

## Anniversary Events

### Login Rewards (May 15 - June 15)
- Day 1: 100 Gems
- Day 2: Anniversary Ticket x5
- Day 3: Exclusive Pet "Party Popper"
- Day 4: 200 Gems
- Day 5: Legendary Equipment Box
- Day 6: 300 Gems
- Day 7: Anniversary Mount "Eternal Star"

### Anniversary Quests
Complete special anniversary quests to earn:
- Anniversary Title: "First Year Hero"
- Exclusive costume pieces
- Gems and resources

### Limited Items
Anniversary shop items available for a limited time:
- Anniversary Costume Set
- Celebration Weapon Skins
- Party Furniture for Housing

Thank you for being part of our journey! Here's to many more years of adventure together!`,
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
        content: "New items have arrived in the shop!",
        fullContent: `The shop has been restocked with exclusive limited-time items!

## Limited Edition Weapons & Armor

### Weapon Sets
- **Phoenix Blade** - Fire-themed greatsword with particle effects
- **Frost Staff** - Ice magic staff with frozen orb projectile
- **Shadow Daggers** - Dual daggers with stealth bonuses

### Armor Sets
- **Dragon Scale Armor** - High defense with dragon resistance
- **Mystic Robe Set** - Magic-focused with mana regeneration
- **Assassin Leather Set** - Critical hit bonuses and evasion

### Limited Quantities
Each item has limited stock and won't return for a long time.

**Restock Timer:** 7 days

Act fast before these items sell out!`,
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
        content: "We've improved game performance significantly.",
        fullContent: `A major performance update has been deployed!

## Performance Improvements

### Loading Times
- Initial load: **40% faster**
- Zone transitions: **50% faster**
- Inventory opening: **60% faster**

### Frame Rate
- More stable FPS on all devices
- Reduced stuttering during combat
- Better performance on lower-end hardware

### Memory Usage
- Reduced RAM consumption by 30%
- Better memory management
- Fewer crashes related to memory

### Mobile Optimization
- Improved battery efficiency
- Reduced heat generation
- Touch response improvements

Enjoy a much smoother gaming experience across all platforms!`,
        type: "update",
        imageUrl: "/images/announcements/optimization.jpg",
        author: "Tech Team",
        createdAt: "2024-05-05",
        updatedAt: "2024-05-05",
        isPinned: false,
      },
    ];

    const id = Number(params.id);
    const foundContent = mockData.find((c) => c.id === id) || mockData[0];
    setContent(foundContent);

    const related = mockData.filter((c) => c.id !== id && c.type === foundContent.type).slice(0, 3);
    setRelatedContents(related.length > 0 ? related : mockData.filter((c) => c.id !== id).slice(0, 3));

    setTimeout(() => setLoading(false), 300);
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#ffc032]"></div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <p className="text-white/50 text-lg">Content not found</p>
          <button
            onClick={() => router.push("/content")}
            className="mt-4 px-6 py-2 bg-[#ffc032] text-black rounded-xl font-medium hover:bg-[#e6ad2d] transition-colors cursor-pointer"
          >
            Back to Contents
          </button>
        </div>
      </div>
    );
  }

  const typeConfig = contentTypes[content.type];
  const TypeIcon = typeConfig.icon;

  return (
    <div className="min-h-screen pt-20 pb-12">
      {/* Back Button */}
      <div className="container mx-auto px-4 pt-6">
        <button
          onClick={() => router.push("/content")}
          className="flex items-center gap-2 text-white/70 hover:text-[#ffc032] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Contents
        </button>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden py-16">
        <div className="absolute inset-0 bg-[url('/images/patterns/grid.svg')] opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className={`px-4 py-2 ${typeConfig.color} border rounded-full text-sm font-medium flex items-center gap-2`}>
                <TypeIcon className="w-4 h-4" />
                {typeConfig.label}
              </span>
              {content.isPinned && (
                <span className="px-4 py-2 bg-[#ffc032] text-black text-sm font-bold rounded-full flex items-center gap-1">
                  <Star className="w-4 h-4" /> PINNED
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              {content.title}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{content.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{content.createdAt}</span>
              </div>
              {content.updatedAt && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Updated: {content.updatedAt}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-8 justify-center">
            <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white rounded-xl transition-all cursor-pointer">
              <Share2 className="w-4 h-4" />
              Share
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white rounded-xl transition-all cursor-pointer">
              <Bookmark className="w-4 h-4" />
              Bookmark
            </button>
          </div>

          {/* Content Card */}
          <div className="bg-gradient-to-br from-white/5 to-white/10 border border-white/10 rounded-2xl overflow-hidden mb-12">
            {/* Banner Image */}
            <div className="relative h-64 md:h-80 bg-gradient-to-br from-[#ffc032]/20 to-[#ca831f]/20">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <TypeIcon className="w-12 h-12 text-[#ffc032]" />
                </div>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 md:p-10">
              <div className="prose prose-invert prose-lg max-w-none">
                <div className="text-white/70 whitespace-pre-wrap leading-relaxed">
                  {content.fullContent}
                </div>
              </div>

              {/* Date Info */}
              {(content.startDate || content.endDate) && (
                <div className="mt-8 pt-6 border-t border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Tag className="w-5 h-5 text-[#ffc032]" />
                    Event Period
                  </h3>
                  <div className="flex flex-wrap gap-4 text-sm">
                    {content.startDate && (
                      <div className="flex items-center gap-2 text-white/70">
                        <span className="text-[#ffc032] font-medium">Start:</span>
                        <span>{content.startDate}</span>
                      </div>
                    )}
                    {content.endDate && (
                      <div className="flex items-center gap-2 text-white/70">
                        <span className="text-red-400 font-medium">End:</span>
                        <span>{content.endDate}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related Contents */}
          {relatedContents.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Related Contents</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedContents.map((related) => {
                  const relatedTypeConfig = contentTypes[related.type];
                  const RelatedIcon = relatedTypeConfig.icon;

                  return (
                    <button
                      key={related.id}
                      onClick={() => router.push(`/content/${related.id}`)}
                      className="group text-left bg-gradient-to-br from-white/5 to-white/10 border border-white/10 rounded-xl overflow-hidden transition-all duration-300 hover:border-[#ffc032]/30 hover:shadow-xl hover:shadow-[#ffc032]/5 cursor-pointer"
                    >
                      <div className="relative h-32 bg-gradient-to-br from-[#ffc032]/20 to-[#ca831f]/20">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <RelatedIcon className="w-10 h-10 text-[#ffc032]" />
                        </div>
                      </div>
                      <div className="p-4">
                        <span className={`inline-block px-2 py-1 ${relatedTypeConfig.color} border rounded-full text-xs font-medium mb-2`}>
                          {relatedTypeConfig.label}
                        </span>
                        <h3 className="text-white font-semibold group-hover:text-[#ffc032] transition-colors line-clamp-2">
                          {related.title}
                        </h3>
                        <p className="text-white/50 text-xs mt-2">{related.createdAt}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
