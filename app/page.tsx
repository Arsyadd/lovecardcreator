"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "next-themes";
import {
  Heart,
  Palette,
  Share2,
  Sparkles,
  Moon,
  Sun,
  Music,
  Image as ImageIcon,
  Calendar,
  Star,
  Upload,
  RefreshCw,
  Volume2,
  VolumeX,
} from "lucide-react";
import QRCode from "qrcode.react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import useSound from "use-sound";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

const themes = [
  {
    id: "romantic",
    name: "Romantic",
    bgLight: "bg-gradient-to-r from-rose-100 to-pink-100",
    bgDark: "dark:bg-gradient-to-r dark:from-rose-950 dark:to-pink-950",
    textLight: "text-rose-800",
    textDark: "dark:text-rose-200",
    pattern: "bg-[url('https://www.transparenttextures.com/patterns/hearts.png')]",
  },
  {
    id: "dreamy",
    name: "Dreamy",
    bgLight: "bg-gradient-to-r from-purple-100 to-blue-100",
    bgDark: "dark:bg-gradient-to-r dark:from-purple-950 dark:to-blue-950",
    textLight: "text-purple-800",
    textDark: "dark:text-purple-200",
    pattern: "bg-[url('https://www.transparenttextures.com/patterns/stars.png')]",
  },
  {
    id: "cute",
    name: "Cute",
    bgLight: "bg-gradient-to-r from-pink-100 to-orange-100",
    bgDark: "dark:bg-gradient-to-r dark:from-pink-950 dark:to-orange-950",
    textLight: "text-pink-800",
    textDark: "dark:text-pink-200",
    pattern: "bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]",
  },
  {
    id: "elegant",
    name: "Elegant",
    bgLight: "bg-gradient-to-r from-slate-100 to-gray-100",
    bgDark: "dark:bg-gradient-to-r dark:from-slate-950 dark:to-gray-950",
    textLight: "text-slate-800",
    textDark: "dark:text-slate-200",
    pattern: "bg-[url('https://www.transparenttextures.com/patterns/diamond-upholstery.png')]",
  },
];

const occasions = [
  {
    id: "anniversary",
    name: "Anniversary",
    templates: [
      "Another year of loving you has been the greatest gift of all. Happy Anniversary!",
      "Every moment with you feels like a beautiful dream come true. Here's to many more years together!",
      "Through all of life's ups and downs, I'm so grateful to have you by my side. Happy Anniversary, my love!",
    ],
  },
  {
    id: "birthday",
    name: "Birthday",
    templates: [
      "Happy Birthday to the one who makes my heart skip a beat! May your day be as special as you are.",
      "To my favorite person in the world: Happy Birthday! You make every day feel like a celebration.",
      "Wishing the happiest of birthdays to my love, my best friend, my everything!",
    ],
  },
  {
    id: "valentines",
    name: "Valentine's Day",
    templates: [
      "You're the missing piece to my puzzle, the rhythm to my song, the love of my life. Happy Valentine's Day!",
      "Every day feels like Valentine's Day when I'm with you, but today is extra special because I get to celebrate our love.",
      "My heart beats for you, today and always. Happy Valentine's Day, my love!",
    ],
  },
  {
    id: "justBecause",
    name: "Just Because",
    templates: [
      "No special occasion needed to tell you how much you mean to me. You're my everything!",
      "Just wanted to remind you that you're the best thing that's ever happened to me.",
      "Sometimes I look at you and wonder how I got so lucky. I love you!",
    ],
  },
  {
    id: "missingYou",
    name: "Missing You",
    templates: [
      "Distance means so little when someone means so much. Missing you more with each passing day.",
      "Every song I hear, every sunset I see, reminds me of you. Can't wait to be together again.",
      "My heart feels incomplete when you're not here. Missing you terribly!",
    ],
  },
];

const backgrounds = [
  {
    url: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800",
    name: "Romantic Sunset",
  },
  {
    url: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800",
    name: "Abstract Love",
  },
  {
    url: "https://images.unsplash.com/photo-1518893494013-481c1d8ed3fd?w=800",
    name: "Heart Bokeh",
  },
  {
    url: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800",
    name: "Flower Garden",
  },
  {
    url: "https://images.unsplash.com/photo-1501139083538-0139583c060f?w=800",
    name: "Starry Night",
  },
  {
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
    name: "Beach Sunset",
  },
];

const musicTracks = [
  {
    id: "romantic",
    name: "Romantic Piano",
    url: "https://example.com/romantic-piano.mp3",
  },
  {
    id: "dreamy",
    name: "Dreamy Melody",
    url: "https://example.com/dreamy-melody.mp3",
  },
  {
    id: "cheerful",
    name: "Cheerful Acoustic",
    url: "https://example.com/cheerful-acoustic.mp3",
  },
];

const decorations = {
  romantic: {
    elements: ["❤️", "💕", "💝"],
    className: "text-rose-500",
  },
  dreamy: {
    elements: ["✨", "🌟", "⭐"],
    className: "text-purple-500",
  },
  cute: {
    elements: ["🎀", "🌸", "🍬"],
    className: "text-pink-500",
  },
  elegant: {
    elements: ["💫", "✨", "💎"],
    className: "text-slate-500",
  },
};

export default function Home() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();
  const [play, { stop }] = useSound("/path-to-sound.mp3", { volume: 0.5 });

  const [cardData, setCardData] = useState({
    to: "",
    from: "",
    message: "",
    theme: "romantic",
    occasion: "anniversary",
    background: backgrounds[0].url,
    date: new Date().toISOString().split("T")[0],
    customBackground: "",
    musicTrack: "",
    decorations: true,
  });

  const [showQR, setShowQR] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  const activeTheme = themes.find((t) => t.id === cardData.theme) || themes[0];
  const activeOccasion = occasions.find((o) => o.id === cardData.occasion) || occasions[0];

  const [bars, setBars] = useState(Array(10).fill(5));
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setBars(bars.map(() => Math.random() * 20));
      }, 200);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  const DecorationElements = () => {
    const activeDecoration = decorations[cardData.theme as keyof typeof decorations];
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {activeDecoration.elements.map((element, index) => (
          <motion.div
            key={index}
            className={`decoration ${activeDecoration.className} text-2xl`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: 1,
              scale: 1,
              x: Math.random() * width,
              y: Math.random() * height,
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              delay: index * 0.2,
            }}
          >
            {element}
          </motion.div>
        ))}
      </div>
    );
  };

  const handleShare = () => {
    const cardId = btoa(JSON.stringify(cardData));
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
    setShowQR(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCardData({ ...cardData, customBackground: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTemplateSelect = (template: string) => {
    setCardData({ ...cardData, message: template });
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b from-rose-50 to-purple-50 dark:from-gray-950 dark:to-purple-950 py-12 px-4 transition-colors duration-300 relative`}>
      {showConfetti && <Confetti width={width} height={height} recycle={false} />}
      {cardData.decorations && <DecorationElements />}

      <div className="max-w-6xl mx-auto">
        <div className="flex justify-end mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>

        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="text-rose-500 animate-pulse" />
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-purple-500">
              Love Card Creator
            </h1>
            <Sparkles className="text-purple-500 animate-bounce" />
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Create a beautiful, personalized card for your special someone
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card className="backdrop-blur-sm bg-white/50 dark:bg-gray-900/50">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="occasion" className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Occasion
                    </Label>
                    <select
                      id="occasion"
                      value={cardData.occasion}
                      onChange={(e) =>
                        setCardData({ ...cardData, occasion: e.target.value })
                      }
                      className="w-full mt-1 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                    >
                      {occasions.map((occasion) => (
                        <option key={occasion.id} value={occasion.id}>
                          {occasion.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="to" className="flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      To
                    </Label>
                    <Input
                      id="to"
                      value={cardData.to}
                      onChange={(e) =>
                        setCardData({ ...cardData, to: e.target.value })
                      }
                      placeholder="Your partner's name"
                      className="backdrop-blur-sm bg-white/50 dark:bg-gray-900/50"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message" className="flex items-center gap-2 mb-2">
                      Message
                    </Label>
                    <div className="mb-2 space-y-2">
                      {activeOccasion.templates.map((template, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="w-full text-left h-auto whitespace-normal"
                          onClick={() => handleTemplateSelect(template)}
                        >
                          {template}
                        </Button>
                      ))}
                    </div>
                    <Textarea
                      id="message"
                      value={cardData.message}
                      onChange={(e) =>
                        setCardData({ ...cardData, message: e.target.value })
                      }
                      placeholder="Write your heartfelt message..."
                      className="min-h-[150px] backdrop-blur-sm bg-white/50 dark:bg-gray-900/50"
                    />
                  </div>

                  <div>
                    <Label htmlFor="from">From</Label>
                    <Input
                      id="from"
                      value={cardData.from}
                      onChange={(e) =>
                        setCardData({ ...cardData, from: e.target.value })
                      }
                      placeholder="Your name"
                      className="backdrop-blur-sm bg-white/50 dark:bg-gray-900/50"
                    />
                  </div>

                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                      type="date"
                      id="date"
                      value={cardData.date}
                      onChange={(e) =>
                        setCardData({ ...cardData, date: e.target.value })
                      }
                      className="backdrop-blur-sm bg-white/50 dark:bg-gray-900/50"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-white/50 dark:bg-gray-900/50">
              <CardContent className="pt-6">
                <Label className="flex items-center gap-2 mb-4">
                  <Palette className="w-4 h-4" />
                  Choose Theme
                </Label>
                <Tabs
                  value={cardData.theme}
                  onValueChange={(value) =>
                    setCardData({ ...cardData, theme: value })
                  }
                >
                  <TabsList className="grid grid-cols-2 lg:grid-cols-4 w-full gap-2">
                    {themes.map((theme) => (
                      <TabsTrigger
                        key={theme.id}
                        value={theme.id}
                        className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                      >
                        {theme.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>

                <div className="mt-6">
                  <Label className="flex items-center gap-2 mb-4">
                    <ImageIcon className="w-4 h-4" />
                    Background Image
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    {backgrounds.map((bg) => (
                      <button
                        key={bg.url}
                        onClick={() =>
                          setCardData({ ...cardData, background: bg.url, customBackground: "" })
                        }
                        className={`relative aspect-video rounded-lg overflow-hidden group ${
                          cardData.background === bg.url && !cardData.customBackground
                            ? "ring-2 ring-primary"
                            : ""
                        }`}
                      >
                        <img
                          src={bg.url}
                          alt={bg.name}
                          className="object-cover w-full h-full"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white text-sm">{bg.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                  
                  <div className="mt-4">
                    <Label className="flex items-center gap-2 mb-2">
                      <Upload className="w-4 h-4" />
                      Upload Custom Background
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        variant="outline"
                        className="w-full"
                      >
                        Choose Image
                      </Button>
                      {cardData.customBackground && (
                        <Button
                          variant="outline"
                          onClick={() => setCardData({ ...cardData, customBackground: "" })}
                        >
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    {cardData.customBackground && (
                      <div className="mt-2 relative aspect-video rounded-lg overflow-hidden">
                        <img
                          src={cardData.customBackground}
                          alt="Custom background"
                          className="object-cover w-full h-full"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-white/50 dark:bg-gray-900/50">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <Label className="flex items-center gap-2 mb-4">
                      <Music className="w-4 h-4" />
                      Background Music
                    </Label>
                    <div className="space-y-2">
                      <select
                        value={cardData.musicTrack}
                        onChange={(e) =>
                          setCardData({ ...cardData, musicTrack: e.target.value })
                        }
                        className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                      >
                        <option value="">No music</option>
                        {musicTracks.map((track) => (
                          <option key={track.id} value={track.id}>
                            {track.name}
                          </option>
                        ))}
                      </select>
                      
                      {cardData.musicTrack && (
                        <div className="flex items-center gap-4">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setIsPlaying(!isPlaying)}
                          >
                            {isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                          </Button>
                          <div className="music-visualizer">
                            {bars.map((height, index) => (
                              <div
                                key={index}
                                className="music-bar"
                                style={{ height: `${height}px` }}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Decorative Elements
                    </Label>
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="checkbox"
                        checked={cardData.decorations}
                        onChange={(e) =>
                          setCardData({ ...cardData, decorations: e.target.checked })
                        }
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        Add floating decorative elements
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card
                className={`relative overflow-hidden ${
                  activeTheme.bgLight
                } ${activeTheme.bgDark} ${activeTheme.pattern}`}
                style={{
                  backgroundImage: `url(${cardData.customBackground || cardData.background})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/90 to-white/50 dark:from-black/90 dark:to-black/50" />
                <CardContent className="relative p-8">
                  <div
                    className={`space-y-6 ${activeTheme.textLight} ${activeTheme.textDark}`}
                  >
                    <div className="text-right text-sm">{cardData.date}</div>
                    <div className="text-2xl font-serif mb-2">
                      Dear {cardData.to || "..."}
                    </div>
                    <div className="min-h-[150px] text-lg font-medium break-words leading-relaxed">
                      {cardData.message || "Your message will appear here..."}
                    </div>
                    <div className="text-right space-y-2">
                      <div>With love,</div>
                      <div className="font-serif text-xl">
                        {cardData.from || "..."}
                      </div>
                    </div>
                    <div className="text-sm italic text-center mt-4">
                      {activeOccasion.name}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <div className="flex gap-4">
              <Button
                onClick={() => setIsPreview(!isPreview)}
                className="flex-1"
                variant="outline"
              >
                {isPreview ? "Edit" : "Preview"}
              </Button>
              <Button
                onClick={handleShare}
                className="flex-1"
                disabled={!cardData.to || !cardData.from || !cardData.message}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>

            {showQR && (
              <Card className="backdrop-blur-sm bg-white/50 dark:bg-gray-900/50">
                <CardContent className="pt-6 text-center">
                  <QRCode
                    value={`${window.location.origin}/preview/${btoa(JSON.stringify(cardData))}`}
                    size={200}
                    level="H"
                    className="mx-auto"
                  />
                  <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                    Scan this QR code to share your love card
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}