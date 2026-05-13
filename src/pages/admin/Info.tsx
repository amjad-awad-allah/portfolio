
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Loader2,
  ArrowLeft,
  User,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Save,
  Globe
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { PersonalInfo } from "@/types/database";

type BubbleState = {
  text: string;
  show: boolean;
  id?: number;
};

type HobbyState = {
  id?: number;
  content_key: string;
  icon: string;
  en_text: string;
  de_text: string;
  isDeleted?: boolean;
};

const AdminPersonalInfo = () => {
  const [info, setInfo] = useState<Partial<PersonalInfo> | null>(null);
  const [bubbles, setBubbles] = useState<Record<string, BubbleState>>({
    engineer_label: { text: "AI Engineer", show: true },
    machine_learning_label: { text: "Machine Learning", show: true },
    developer_label: { text: "Full Stack Developer", show: true },
    architect_label: { text: "Software Architect", show: true },
  });
  const [hobbies, setHobbies] = useState<HobbyState[]>([]);
  const [aboutTexts, setAboutTexts] = useState<Record<string, { id?: number, en_text: string, de_text: string }>>({
    about_bio: { en_text: "", de_text: "" }
  });
  const [heroTexts, setHeroTexts] = useState<Record<string, { id?: number, en_text: string, de_text: string }>>({
    description: { en_text: "", de_text: "" },
    cta: { en_text: "", de_text: "" },
    downloads_button: { en_text: "", de_text: "" },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch Personal Info
      const { data: infoData, error: infoError } = await supabase
        .from("personal_info")
        .select("*")
        .single();

      if (infoError) throw infoError;
      setInfo(infoData);

      // Fetch Bubbles (static_content hero)
      const { data: staticData, error: staticError } = await supabase
        .from("static_content")
        .select("*")
        .eq("section", "hero");

      if (staticError) throw staticError;

      // Fetch Hobbies (static_content hobbies)
      const { data: hobbiesData, error: hobbiesError } = await supabase
        .from("static_content")
        .select("*")
        .eq("section", "hobbies");

      if (hobbiesError) throw hobbiesError;
      
      if (hobbiesData) {
        setHobbies(hobbiesData.map(h => {
          let iconName = "Star";
          if (h.content_key.startsWith("icon:")) {
            iconName = h.content_key.split("_")[0].replace("icon:", "");
          }
          return {
            id: h.id,
            content_key: h.content_key,
            icon: iconName,
            en_text: h.en_text,
            de_text: h.de_text
          };
        }));
      }

      // Fetch About (static_content about)
      const { data: aboutData, error: aboutError } = await supabase
        .from("static_content")
        .select("*")
        .eq("section", "about");

      if (aboutError) throw aboutError;
      
      if (aboutData) {
        const newAboutTexts = { ...aboutTexts };
        aboutData.forEach(item => {
          newAboutTexts[item.content_key] = {
            id: item.id,
            en_text: item.en_text,
            de_text: item.de_text
          };
        });
        setAboutTexts(newAboutTexts);
      }

      if (staticData) {
        const newBubbles = { ...bubbles };
        const newHeroTexts = { ...heroTexts };
        const keysFound = new Set();
        const duplicates: number[] = [];

        staticData.forEach(item => {
          // If we find a duplicate key for the same section, mark it for deletion
          if (keysFound.has(item.content_key)) {
            duplicates.push(item.id);
            return;
          }

          if (newBubbles[item.content_key]) {
            keysFound.add(item.content_key);
            newBubbles[item.content_key] = {
              text: item.en_text,
              show: item.de_text !== 'false',
              id: item.id
            };
          } else if (newHeroTexts[item.content_key]) {
            keysFound.add(item.content_key);
            newHeroTexts[item.content_key] = {
              id: item.id,
              en_text: item.en_text,
              de_text: item.de_text
            };
          }
        });

        // Clean up duplicates if any
        if (duplicates.length > 0) {
          console.log("Cleaning up duplicate bubble keys:", duplicates);
          await supabase.from('static_content').delete().in('id', duplicates);
        }

        setBubbles(newBubbles);
        setHeroTexts(newHeroTexts);
      }
    } catch (error: any) {
      console.error("Fetch error:", error);
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!info) return;
    setIsSaving(true);

    try {
      // 1. Save Personal Info
      const { error: infoError } = await supabase
        .from("personal_info")
        .update({
          name: info.name,
          current_location: info.current_location,
          email: info.email,
          github_url: info.github_url,
          linkedin_url: info.linkedin_url,
          phone_number: info.phone_number,
          profile_image_url: info.profile_image_url,
          cv_en: info.cv_en,
          cv_de: info.cv_de,
          languages: info.languages,
        })
        .eq("id", info.id);

      if (infoError) throw infoError;

      // 2. Save Bubbles
      const bubblePromises = Object.entries(bubbles).map(async ([key, state]) => {
        if (state.id) {
          return supabase
            .from('static_content')
            .update({ 
              en_text: state.text, 
              de_text: String(state.show),
              section: 'hero'
            })
            .eq('id', state.id);
        } else {
          return supabase
            .from('static_content')
            .insert([{ 
              content_key: key, 
              en_text: state.text, 
              de_text: String(state.show), 
              section: 'hero' 
            }]);
        }
      });

      const results = await Promise.all(bubblePromises);
      const firstError = results.find(r => r.error)?.error;
      if (firstError) throw firstError;

      // 3. Save Hobbies
      const hobbyPromises = hobbies.map(async (hobby) => {
        if (hobby.isDeleted && hobby.id) {
          return supabase.from('static_content').delete().eq('id', hobby.id);
        } else if (!hobby.isDeleted) {
          const newContentKey = `icon:${hobby.icon}_${hobby.id || Date.now()}_${Math.floor(Math.random() * 100)}`;
          if (hobby.id) {
            return supabase.from('static_content').update({
              content_key: newContentKey,
              en_text: hobby.en_text,
              de_text: hobby.de_text
            }).eq('id', hobby.id);
          } else {
            return supabase.from('static_content').insert([{
              section: 'hobbies',
              content_key: newContentKey,
              en_text: hobby.en_text,
              de_text: hobby.de_text
            }]);
          }
        }
        return { error: null }; // for newly created then deleted items
      });

      const hobbyResults = await Promise.all(hobbyPromises);
      const firstHobbyError = hobbyResults.find(r => r.error)?.error;
      if (firstHobbyError) throw firstHobbyError;

      // 4. Save About Texts
      const aboutPromises = Object.entries(aboutTexts).map(async ([key, state]) => {
        if (state.id) {
          return supabase
            .from('static_content')
            .update({ 
              en_text: state.en_text, 
              de_text: state.de_text,
            })
            .eq('id', state.id);
        } else if (state.en_text || state.de_text) {
          return supabase
            .from('static_content')
            .insert([{ 
              content_key: key, 
              en_text: state.en_text, 
              de_text: state.de_text, 
              section: 'about' 
            }]);
        }
        return { error: null };
      });
      const aboutResults = await Promise.all(aboutPromises);
      const firstAboutError = aboutResults.find(r => r.error)?.error;
      if (firstAboutError) throw firstAboutError;

      // 5. Save Hero Texts
      const heroPromises = Object.entries(heroTexts).map(async ([key, state]) => {
        if (state.id) {
          return supabase
            .from('static_content')
            .update({ 
              en_text: state.en_text, 
              de_text: state.de_text,
            })
            .eq('id', state.id);
        } else if (state.en_text || state.de_text) {
          return supabase
            .from('static_content')
            .insert([{ 
              content_key: key, 
              en_text: state.en_text, 
              de_text: state.de_text, 
              section: 'hero' 
            }]);
        }
        return { error: null };
      });
      const heroResults = await Promise.all(heroPromises);
      const firstHeroError = heroResults.find(r => r.error)?.error;
      if (firstHeroError) throw firstHeroError;

      toast({ title: "Saved", description: "All information and bubbles updated successfully" });
      fetchData();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const updateBubble = (key: string, updates: Partial<BubbleState>) => {
    setBubbles(prev => ({
      ...prev,
      [key]: { ...prev[key], ...updates }
    }));
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button variant="ghost" size="sm" onClick={() => navigate("/admin/dashboard")} className="mb-2 -ml-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold">Personal Information</h1>
          <p className="text-muted-foreground mt-1">Update your basic details and social links.</p>
        </div>

        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p>Loading your profile...</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-8">
            <div className="glass-card p-6 rounded-2xl border border-primary/5 space-y-6">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Basic Identity
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <Input 
                    value={info?.name || ""} 
                    onChange={e => setInfo({...info!, name: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Profile Image URL</label>
                  <Input 
                    value={info?.profile_image_url || ""} 
                    onChange={e => setInfo({...info!, profile_image_url: e.target.value})}
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4" /> Location
                  </label>
                  <Input 
                    value={info?.current_location || ""} 
                    onChange={e => setInfo({...info!, current_location: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4" /> Public Email
                  </label>
                  <Input 
                    type="email"
                    value={info?.email || ""} 
                    onChange={e => setInfo({...info!, email: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Languages Section */}
            <div className="glass-card p-6 rounded-2xl border border-primary/5 space-y-6">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                Language Skills
              </h3>
              <p className="text-sm text-muted-foreground">Add your languages and proficiency levels (e.g., Arabic: Native, German: B2).</p>
              
              <div className="space-y-4">
                {Object.entries(info?.languages || {}).map(([lang, level]) => (
                  <div key={lang} className="flex items-center gap-4">
                    <Input 
                      value={lang}
                      disabled
                      className="max-w-[200px]"
                    />
                    <Input 
                      value={level}
                      onChange={(e) => {
                        const newLangs = { ...info?.languages, [lang]: e.target.value };
                        setInfo({ ...info!, languages: newLangs });
                      }}
                      placeholder="Proficiency level..."
                      className="max-w-[200px]"
                    />
                    <Button 
                      variant="destructive" 
                      size="icon"
                      type="button"
                      onClick={() => {
                        const newLangs = { ...info?.languages };
                        delete newLangs[lang];
                        setInfo({ ...info!, languages: newLangs });
                      }}
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"/></svg>
                    </Button>
                  </div>
                ))}
                
                <div className="flex items-center gap-4 pt-2 border-t border-border">
                  <Input 
                    placeholder="New Language (e.g., French)" 
                    className="max-w-[200px]"
                    id="newLangKey"
                  />
                  <Input 
                    placeholder="Level (e.g., Beginner)" 
                    className="max-w-[200px]"
                    id="newLangLevel"
                  />
                  <Button 
                    variant="secondary"
                    type="button"
                    onClick={() => {
                      const keyInput = document.getElementById("newLangKey") as HTMLInputElement;
                      const valInput = document.getElementById("newLangLevel") as HTMLInputElement;
                      if (keyInput.value && valInput.value) {
                        setInfo({ 
                          ...info!, 
                          languages: { ...(info?.languages || {}), [keyInput.value]: valInput.value } 
                        });
                        keyInput.value = "";
                        valInput.value = "";
                      }
                    }}
                  >
                    Add Language
                  </Button>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-primary/5 space-y-6">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                Social Presence & Documents
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Github className="h-4 w-4" /> GitHub URL
                  </label>
                  <Input 
                    value={info?.github_url || ""} 
                    onChange={e => setInfo({...info!, github_url: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Linkedin className="h-4 w-4" /> LinkedIn URL
                  </label>
                  <Input 
                    value={info?.linkedin_url || ""} 
                    onChange={e => setInfo({...info!, linkedin_url: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">CV URL (English)</label>
                  <Input 
                    value={info?.cv_en || ""} 
                    onChange={e => setInfo({...info!, cv_en: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">CV URL (German)</label>
                  <Input 
                    value={info?.cv_de || ""} 
                    onChange={e => setInfo({...info!, cv_de: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* About Me Bio Section */}
            <div className="glass-card p-6 rounded-2xl border border-primary/5 space-y-6">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                About Me (Bio)
              </h3>
              <p className="text-sm text-muted-foreground">Write a compelling introduction about yourself. This appears on the main page under "About Me".</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Bio (English)</label>
                  <textarea 
                    className="flex min-h-[150px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={aboutTexts['about_bio']?.en_text || ""} 
                    onChange={e => setAboutTexts({...aboutTexts, about_bio: {...aboutTexts['about_bio'], en_text: e.target.value}})}
                    placeholder="I am a software developer..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Bio (German)</label>
                  <textarea 
                    className="flex min-h-[150px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={aboutTexts['about_bio']?.de_text || ""} 
                    onChange={e => setAboutTexts({...aboutTexts, about_bio: {...aboutTexts['about_bio'], de_text: e.target.value}})}
                    placeholder="Ich bin ein Softwareentwickler..."
                  />
                </div>
              </div>
            </div>

            {/* Hero Section Texts */}
            <div className="glass-card p-6 rounded-2xl border border-primary/5 space-y-6">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                Hero Section Texts
              </h3>
              <p className="text-sm text-muted-foreground">Manage the job title and button texts in the first section of your website.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Job Title / Subtitle (English)</label>
                  <Input 
                    value={heroTexts['description']?.en_text || ""} 
                    onChange={e => setHeroTexts({...heroTexts, description: {...heroTexts['description'], en_text: e.target.value}})}
                    placeholder="e.g. Software Developer & AI Specialist"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Job Title / Subtitle (German)</label>
                  <Input 
                    value={heroTexts['description']?.de_text || ""} 
                    onChange={e => setHeroTexts({...heroTexts, description: {...heroTexts['description'], de_text: e.target.value}})}
                    placeholder="e.g. Software-Entwickler & KI-Spezialist"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Primary Button (English)</label>
                  <Input 
                    value={heroTexts['cta']?.en_text || ""} 
                    onChange={e => setHeroTexts({...heroTexts, cta: {...heroTexts['cta'], en_text: e.target.value}})}
                    placeholder="e.g. Get in touch"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Primary Button (German)</label>
                  <Input 
                    value={heroTexts['cta']?.de_text || ""} 
                    onChange={e => setHeroTexts({...heroTexts, cta: {...heroTexts['cta'], de_text: e.target.value}})}
                    placeholder="e.g. Kontakt aufnehmen"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Secondary Button (English)</label>
                  <Input 
                    value={heroTexts['downloads_button']?.en_text || ""} 
                    onChange={e => setHeroTexts({...heroTexts, downloads_button: {...heroTexts['downloads_button'], en_text: e.target.value}})}
                    placeholder="e.g. View Downloads"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Secondary Button (German)</label>
                  <Input 
                    value={heroTexts['downloads_button']?.de_text || ""} 
                    onChange={e => setHeroTexts({...heroTexts, downloads_button: {...heroTexts['downloads_button'], de_text: e.target.value}})}
                    placeholder="e.g. Downloads anzeigen"
                  />
                </div>
              </div>
            </div>

            {/* Hero Skills Section */}
            <div className="glass-card p-6 rounded-2xl border border-primary/5 space-y-6">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <div className="bg-primary/20 p-1.5 rounded-lg">
                  <svg className="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
                </div>
                Hero Profile Bubbles (Skills)
              </h3>
              <p className="text-sm text-muted-foreground">Change labels around your image. <span className="text-primary font-medium">Click "Save Changes" below</span> to apply all updates at once.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(bubbles).map(([key, state]) => (
                  <div key={key} className="space-y-2">
                    <label className="text-sm font-medium capitalize">{key.replace('_', ' ')}</label>
                    <div className="flex items-center gap-2">
                      <Input 
                        value={state.text} 
                        onChange={e => updateBubble(key, { text: e.target.value })}
                        placeholder="Skill label..."
                      />
                      <Button
                        type="button"
                        variant={state.show ? "default" : "outline"}
                        size="icon"
                        className="h-10 w-10 shrink-0"
                        onClick={() => updateBubble(key, { show: !state.show })}
                        title={state.show ? "Visible" : "Hidden"}
                      >
                        {state.show ? (
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        ) : (
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hobbies Section */}
            <div className="glass-card p-6 rounded-2xl border border-primary/5 space-y-6">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <div className="bg-primary/20 p-1.5 rounded-lg">
                  <svg className="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                </div>
                Hobbies & Interests
              </h3>
              <p className="text-sm text-muted-foreground">Manage the hobbies displayed on your portfolio. Icons and colors are assigned automatically.</p>
              
              <div className="space-y-4">
                {hobbies.filter(h => !h.isDeleted).map((hobby, index) => (
                  <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border border-border rounded-xl">
                    <div className="w-full sm:w-1/4 space-y-2">
                      <label className="text-xs font-medium text-muted-foreground">Icon</label>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={hobby.icon}
                        onChange={(e) => {
                          const newHobbies = [...hobbies];
                          newHobbies[index].icon = e.target.value;
                          setHobbies(newHobbies);
                        }}
                      >
                        <option value="Star">Star</option>
                        <option value="Gamepad2">Gaming</option>
                        <option value="BookOpen">Reading</option>
                        <option value="Trophy">Sports/Trophy</option>
                        <option value="Compass">Travel</option>
                        <option value="Music">Music</option>
                        <option value="Camera">Photography</option>
                        <option value="Heart">Health/Heart</option>
                        <option value="Zap">Energy/Action</option>
                      </select>
                    </div>
                    <div className="w-full space-y-2">
                      <label className="text-xs font-medium text-muted-foreground">English Name</label>
                      <Input 
                        value={hobby.en_text}
                        onChange={(e) => {
                          const newHobbies = [...hobbies];
                          newHobbies[index].en_text = e.target.value;
                          setHobbies(newHobbies);
                        }}
                        placeholder="e.g. Chess"
                      />
                    </div>
                    <div className="w-full space-y-2">
                      <label className="text-xs font-medium text-muted-foreground">German Name</label>
                      <Input 
                        value={hobby.de_text}
                        onChange={(e) => {
                          const newHobbies = [...hobbies];
                          newHobbies[index].de_text = e.target.value;
                          setHobbies(newHobbies);
                        }}
                        placeholder="z.B. Schach"
                      />
                    </div>
                    <div className="pt-6">
                      <Button 
                        variant="destructive" 
                        size="icon"
                        type="button"
                        onClick={() => {
                          const newHobbies = [...hobbies];
                          newHobbies[index].isDeleted = true;
                          setHobbies(newHobbies);
                        }}
                      >
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"/></svg>
                      </Button>
                    </div>
                  </div>
                ))}
                
                <Button 
                  variant="outline"
                  type="button"
                  className="w-full border-dashed"
                  onClick={() => {
                    setHobbies([
                      ...hobbies,
                      { content_key: `icon:Star_${Date.now()}`, icon: "Star", en_text: "", de_text: "", isDeleted: false }
                    ]);
                  }}
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Add New Hobby
                </Button>
              </div>
            </div>

            <div className="flex justify-end pt-4 pb-12">
              <Button type="submit" size="lg" className="gap-2 min-w-[150px]" disabled={isSaving}>
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Changes
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminPersonalInfo;
