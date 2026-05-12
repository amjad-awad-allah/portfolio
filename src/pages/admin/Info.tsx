
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

const AdminPersonalInfo = () => {
  const [info, setInfo] = useState<Partial<PersonalInfo> | null>(null);
  const [bubbles, setBubbles] = useState<Record<string, BubbleState>>({
    engineer_label: { text: "AI Engineer", show: true },
    machine_learning_label: { text: "Machine Learning", show: true },
    developer_label: { text: "Full Stack Developer", show: true },
    architect_label: { text: "Software Architect", show: true },
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

      // Fetch Bubbles (static_content)
      const { data: staticData, error: staticError } = await supabase
        .from("static_content")
        .select("*")
        .eq("section", "hero");

      if (staticError) throw staticError;

      if (staticData) {
        const newBubbles = { ...bubbles };
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
          }
        });

        // Clean up duplicates if any
        if (duplicates.length > 0) {
          console.log("Cleaning up duplicate bubble keys:", duplicates);
          await supabase.from('static_content').delete().in('id', duplicates);
        }

        setBubbles(newBubbles);
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
