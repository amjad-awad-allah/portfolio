
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Loader2,
  ArrowLeft,
  Briefcase
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { ProfessionalExperience } from "@/types/database";

const AdminExperience = () => {
  const [experiences, setExperiences] = useState<ProfessionalExperience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Partial<ProfessionalExperience> | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("professional_experience")
      .select("*")
      .order("start_date", { ascending: false });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setExperiences(data || []);
    }
    setIsLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExperience) return;
    setIsSaving(true);

    try {
      if (editingExperience.id) {
        const { error } = await supabase
          .from("professional_experience")
          .update({
            company_name: editingExperience.company_name,
            position: editingExperience.position,
            start_date: editingExperience.start_date,
            end_date: editingExperience.end_date,
            description_en: editingExperience.description_en,
            description_de: editingExperience.description_de,
          })
          .eq("id", editingExperience.id);
        if (error) throw error;
        toast({ title: "Updated", description: "Experience updated successfully" });
      } else {
        const { error } = await supabase
          .from("professional_experience")
          .insert([editingExperience]);
        if (error) throw error;
        toast({ title: "Created", description: "Experience created successfully" });
      }
      setEditingExperience(null);
      fetchExperiences();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this experience?")) return;

    const { error } = await supabase.from("professional_experience").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Deleted", description: "Experience deleted successfully" });
      fetchExperiences();
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <Button variant="ghost" size="sm" onClick={() => navigate("/admin/dashboard")} className="mb-2 -ml-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold">Work Experience</h1>
            <p className="text-muted-foreground mt-1">Manage your career history and roles.</p>
          </div>

          <Dialog open={!!editingExperience} onOpenChange={(open) => !open && setEditingExperience(null)}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingExperience({ 
                company_name: "", 
                position: "", 
                start_date: new Date().toISOString().split('T')[0],
                end_date: "",
                description_en: "", 
                description_de: "" 
              })} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Experience
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingExperience?.id ? "Edit Experience" : "Add Experience"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSave} className="space-y-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Company Name</label>
                    <Input 
                      value={editingExperience?.company_name || ""} 
                      onChange={e => setEditingExperience({...editingExperience!, company_name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Position</label>
                    <Input 
                      value={editingExperience?.position || ""} 
                      onChange={e => setEditingExperience({...editingExperience!, position: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Start Date</label>
                    <Input 
                      type="date"
                      value={editingExperience?.start_date || ""} 
                      onChange={e => setEditingExperience({...editingExperience!, start_date: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">End Date (leave empty for 'Present')</label>
                    <Input 
                      type="date"
                      value={editingExperience?.end_date || ""} 
                      onChange={e => setEditingExperience({...editingExperience!, end_date: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Description (English)</label>
                  <textarea 
                    className="w-full min-h-[100px] p-2 rounded-md border border-input bg-transparent text-sm"
                    value={editingExperience?.description_en || ""} 
                    onChange={e => setEditingExperience({...editingExperience!, description_en: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Description (German)</label>
                  <textarea 
                    className="w-full min-h-[100px] p-2 rounded-md border border-input bg-transparent text-sm"
                    value={editingExperience?.description_de || ""} 
                    onChange={e => setEditingExperience({...editingExperience!, description_de: e.target.value})}
                    required
                  />
                </div>

                <DialogFooter className="pt-4">
                  <Button type="button" variant="ghost" onClick={() => setEditingExperience(null)}>Cancel</Button>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Experience
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="glass-card rounded-xl overflow-hidden border border-primary/5">
          {isLoading ? (
            <div className="p-12 flex flex-col items-center justify-center gap-4 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p>Loading history...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company & Position</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {experiences.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-12 text-muted-foreground">
                      No experience found.
                    </TableCell>
                  </TableRow>
                ) : (
                  experiences.map((exp) => (
                    <TableRow key={exp.id} className="group hover:bg-primary/5 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-secondary rounded-lg">
                            <Briefcase className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="font-semibold">{exp.company_name}</div>
                            <div className="text-xs text-muted-foreground">{exp.position}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {exp.start_date} — {exp.end_date || "Present"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => setEditingExperience(exp)}
                            className="h-8 w-8"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDelete(exp.id)}
                            className="h-8 w-8 hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminExperience;
