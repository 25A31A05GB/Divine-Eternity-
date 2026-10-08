import React, { useState, useRef, useEffect } from 'react';
import {
  Headphones,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  Clock,
  Sparkles,
  Share2,
  ExternalLink,
  CheckCircle2,
  Send,
  X,
  Radio,
} from 'lucide-react';
import { PODCAST_EPISODES, PodcastEpisodeItem } from '../../data/collectionsData';

export const PodcastSection: React.FC = () => {
  const [currentEpisode, setCurrentEpisode] = useState<PodcastEpisodeItem>(PODCAST_EPISODES[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(25);
  const [volume, setVolume] = useState(80);
  const [isSpeakerModalOpen, setIsSpeakerModalOpen] = useState(false);
  const [pitchName, setPitchName] = useState('');
  const [pitchTopic, setPitchTopic] = useState('');
  const [pitchEmail, setPitchEmail] = useState('');
  const [pitchSubmitted, setPitchSubmitted] = useState(false);

  // Audio timer simulation for UI interactive feel
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const togglePlay = (ep?: PodcastEpisodeItem) => {
    if (ep && ep.id !== currentEpisode.id) {
      setCurrentEpisode(ep);
      setIsPlaying(true);
      setProgress(0);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handlePitchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPitchSubmitted(true);
  };

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* 1. Header Hero */}
      <div className="bg-gradient-to-br from-[#FFF9EB] via-[#FFFDF8] to-[#FFF0F5] border border-[#F3E8E2] rounded-3xl p-6 sm:p-10 text-center relative overflow-hidden shadow-xs">
        <div className="relative z-10 max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#F3E8E2] text-[11px] font-extrabold uppercase tracking-widest text-[#FF2E93] shadow-2xs">
            <Radio className="w-3.5 h-3.5 text-[#FF2E93] animate-pulse" />
            <span>DIVINE’S ETERNITY PODCAST</span>
          </div>

          <h2 className="font-serif-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#211D1C]">
            Conversations That <span className="font-serif italic text-[#FF2E93]">Inspire & Empower</span>
          </h2>

          <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-2xl mx-auto">
            Welcome to the Divine’s Eternity Podcast — where creativity, entrepreneurship, content creation, and real-life journeys come together. Discover inspiring conversations, creator stories, business experiences, and practical insights to help you learn, grow, and dream bigger.
          </p>
        </div>
      </div>

      {/* 2. Featured Episode Interactive Audio Player */}
      <div className="bg-gradient-to-br from-[#211D1C] via-[#2D2426] to-[#1C1717] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-stone-700 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF2E93]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Episode Artwork */}
          <div className="md:col-span-4 aspect-square rounded-2xl overflow-hidden relative shadow-lg group">
            <img
              src={currentEpisode.coverImage}
              alt={currentEpisode.title}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <button
                onClick={() => togglePlay()}
                className="w-16 h-16 rounded-full bg-[#FF2E93] hover:bg-[#E01E7E] text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 cursor-pointer"
              >
                {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
              </button>
            </div>
            <span className="absolute top-3 left-3 bg-[#211D1C]/80 backdrop-blur-xs text-[#FFD94A] text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full">
              Episode {currentEpisode.episodeNumber}
            </span>
          </div>

          {/* Episode Info & Scrub Controls */}
          <div className="md:col-span-8 space-y-5">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-[#FFD94A] text-[10px] font-bold uppercase tracking-wider">
                  {currentEpisode.category}
                </span>
                <span className="text-xs text-stone-400">
                  {currentEpisode.publishedDate} • {currentEpisode.duration}
                </span>
              </div>
              <h3 className="font-serif-heading text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-snug">
                {currentEpisode.title}
              </h3>
              <p className="text-xs text-stone-300">
                Featuring <strong className="text-white">{currentEpisode.guest}</strong> ({currentEpisode.guestRole})
              </p>
            </div>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed line-clamp-2">
              {currentEpisode.summary}
            </p>

            {/* Scrub Progress Bar */}
            <div className="space-y-1.5 pt-2">
              <div className="w-full bg-stone-800 rounded-full h-2 cursor-pointer relative overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#FF2E93] to-[#FFD94A] h-full rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                <span>{Math.floor((progress * 42) / 100)}:15</span>
                <span>{currentEpisode.duration}</span>
              </div>
            </div>

            {/* Audio Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setProgress((p) => Math.max(0, p - 10))}
                  className="p-2 rounded-full hover:bg-white/10 text-stone-300 transition-colors cursor-pointer"
                  title="Rewind 10s"
                >
                  <SkipBack className="w-4 h-4" />
                </button>
                <button
                  onClick={() => togglePlay()}
                  className="px-5 py-2 rounded-full bg-[#FF2E93] hover:bg-[#E01E7E] text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isPlaying ? 'Pause Episode' : 'Play Episode'}</span>
                </button>
                <button
                  onClick={() => setProgress((p) => Math.min(100, p + 10))}
                  className="p-2 rounded-full hover:bg-white/10 text-stone-300 transition-colors cursor-pointer"
                  title="Forward 10s"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>

              {/* Streaming Platforms */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-stone-400 text-[11px] hidden sm:inline">Listen on:</span>
                <span className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold cursor-pointer">
                  Spotify
                </span>
                <span className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold cursor-pointer">
                  Apple Podcasts
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. All Episodes Playlist */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif-heading text-2xl font-bold text-[#211D1C]">
              All Podcast Episodes
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Creator stories, entrepreneurship masterclasses, and design insights
            </p>
          </div>
          <button
            onClick={() => setIsSpeakerModalOpen(true)}
            className="px-4 py-2 rounded-full bg-white border border-[#E7E2DA] hover:border-[#FF2E93] text-[#211D1C] text-xs font-bold transition-colors cursor-pointer"
          >
            ✦ Pitch as a Guest Speaker
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PODCAST_EPISODES.map((ep) => {
            const isCurrent = ep.id === currentEpisode.id;
            return (
              <div
                key={ep.id}
                className={`bg-white rounded-2xl p-5 border transition-all flex flex-col justify-between space-y-4 ${
                  isCurrent
                    ? 'border-[#FF2E93] ring-1 ring-[#FF2E93]/20 shadow-xs'
                    : 'border-[#E7E2DA] hover:border-stone-300'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#FFF9EB] text-[#D97706] text-[10px] font-bold uppercase tracking-wider border border-[#F5E6CE]">
                      {ep.category}
                    </span>
                    <span className="text-xs text-stone-400 font-medium">
                      {ep.duration} • {ep.listenCount} listens
                    </span>
                  </div>

                  <h4 className="font-serif-heading text-lg font-bold text-[#211D1C] leading-snug">
                    {ep.title}
                  </h4>

                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {ep.summary}
                  </p>

                  <div className="text-[11px] text-stone-500 italic">
                    Guest: <strong>{ep.guest}</strong> — {ep.guestRole}
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-stone-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{ep.publishedDate}</span>
                  </div>

                  <button
                    onClick={() => togglePlay(ep)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isCurrent && isPlaying
                        ? 'bg-[#FF2E93] text-white'
                        : 'bg-[#FFF0F5] text-[#FF2E93] hover:bg-[#FF2E93] hover:text-white'
                    }`}
                  >
                    {isCurrent && isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isCurrent && isPlaying ? 'Pause' : 'Listen Now'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Guest Pitch Modal */}
      {isSpeakerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 relative shadow-2xl">
            <button
              onClick={() => setIsSpeakerModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FF2E93]">
                GUEST INVITATION
              </span>
              <h3 className="font-serif-heading text-2xl font-bold text-[#211D1C] mt-1">
                Pitch as a Guest Speaker
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Are you a creator, entrepreneur, artisan, or storyteller? We’d love to record an episode with you.
              </p>
            </div>

            {pitchSubmitted ? (
              <div className="bg-[#FFF9EB] border border-[#F5E6CE] rounded-2xl p-6 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-base text-[#211D1C]">Pitch Submitted!</h4>
                <p className="text-xs text-stone-600">
                  Our podcast host will review your story and contact you to schedule a prep call.
                </p>
                <button
                  onClick={() => setIsSpeakerModalOpen(false)}
                  className="mt-3 px-5 py-2 rounded-full bg-[#211D1C] text-white text-xs font-bold"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handlePitchSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                    Your Full Name & Role *
                  </label>
                  <input
                    type="text"
                    required
                    value={pitchName}
                    onChange={(e) => setPitchName(e.target.value)}
                    placeholder="e.g. Diya Roy, Founder & Content Creator"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E7E2DA] text-xs sm:text-sm bg-[#FFFDF8]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={pitchEmail}
                    onChange={(e) => setPitchEmail(e.target.value)}
                    placeholder="diya@gmail.com"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E7E2DA] text-xs sm:text-sm bg-[#FFFDF8]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                    Topic / Conversation Idea *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={pitchTopic}
                    onChange={(e) => setPitchTopic(e.target.value)}
                    placeholder="What insights or story would you love to share with our creator and entrepreneur audience?"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E7E2DA] text-xs sm:text-sm bg-[#FFFDF8]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-full bg-[#FF2E93] hover:bg-[#E01E7E] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Guest Pitch</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
