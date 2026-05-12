
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
  Save
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { PersonalInfo } from "@/types/database";

const AdminPersonalInfo = () => {
  const [info, setInfo] = useState<Partial<PersonalInfo> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInfo();
  }, []);

  const fetchInfo = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("personal_info")
      .select("*")
      .single();

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setInfo(data);
    }
    setIsLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!info) return;
    setIsSaving(true);

    try {
      const { error } = await supabase
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

      if (error) throw error;
      toast({ title: "Saved", description: "Personal information updated" });
      fetchInfo();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
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
              <p className="text-sm text-muted-foreground">Change labels around your image. <span className="text-primary font-medium">Changes are saved automatically</span> when you finish typing or toggle visibility.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Bubble 1 (Top Left)</label>
                  <HeroSkillInput 
                    keyName="engineer_label" 
                    defaultValue="AI Engineer"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Bubble 2 (Bottom)</label>
                  <HeroSkillInput 
                    keyName="machine_learning_label" 
                    defaultValue="Machine Learning"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Bubble 3 (Top Right)</label>
                  <HeroSkillInput 
                    keyName="developer_label" 
                    defaultValue="Full Stack Developer"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Bubble 4 (Far Right)</label>
                  <HeroSkillInput 
                    keyName="architect_label" 
                    defaultValue="Software Architect"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" size="lg" className="gap-2" disabled={isSaving}>
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

// Simple Globe icon since I forgot to import it
const Globe = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
  </svg>
);

// Individual Input for Hero Skills that saves to static_content table
const HeroSkillInput = ({ keyName, defaultValue }: { keyName: string, defaultValue: string }) => {
  const [text, setText] = useState("");
  const [show, setShow] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Initial fetch for the key
    const fetchValue = async () => {
      const { data } = await supabase
        .from('static_content')
        .select('en_text, de_text') // de_text will store visibility
        .eq('content_key', keyName)
        .maybeSingle();
      
      if (data) {
        setText(data.en_text);
        setShow(data.de_text !== 'false'); // default to true
      } else {
        setText(defaultValue);
        setShow(true);
      }
    };
    fetchValue();
  }, [keyName, defaultValue]);

  const handleBlur = async () => {
    if (!text) return;
    saveData(text, show);
  };

  const toggleVisibility = () => {
    const nextShow = !show;
    setShow(nextShow);
    saveData(text, nextShow);
  };

  const saveData = async (newText: string, newShow: boolean) => {
    setIsUpdating(true);
    try {
      const { data: existing } = await supabase
        .from('static_content')
        .select('id')
        .eq('content_key', keyName)
        .maybeSingle();

      if (existing) {
        await supabase
          .from('static_content')
          .update({ 
            en_text: newText, 
            de_text: String(newShow),
            section: 'hero' // Force section to hero to ensure it's found by the frontend
          })
          .eq('id', existing.id);
      } else {
        await supabase
          .from('static_content')
          .insert([{ 
            content_key: keyName, 
            en_text: newText, 
            de_text: String(newShow), 
            section: 'hero' 
          }]);
      }
      toast({ title: "Updated", description: `"${newText}" bubble updated successfully.` });
    } catch (err) {
      console.error("Save error:", err);
      toast({ title: "Error", description: "Could not save changes.", variant: "destructive" });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-grow">
        <Input 
          value={text} 
          onChange={e => setText(e.target.value)} 
          onBlur={handleBlur}
          className={isUpdating ? "opacity-50" : ""}
        />
        {isUpdating && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="h-3 w-3 animate-spin text-primary" />
          </div>
        )}
      </div>
      <Button
        type="button"
        variant={show ? "default" : "outline"}
        size="icon"
        className="h-10 w-10 shrink-0"
        onClick={toggleVisibility}
        title={show ? "Visible" : "Hidden"}
      >
        <div className="flex flex-col items-center">
          {show ? (
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          ) : (
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
          )}
        </div>
      </Button>
    </div>
  );
};

export default AdminPersonalInfo;
