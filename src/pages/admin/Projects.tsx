
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
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  Loader2,
  Plus,
  Pencil,
  Trash2,
  ArrowLeft,
  ExternalLink,
  ImageIcon
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { Project } from "@/types/database";
import { Badge } from "@/components/ui/badge";

const AdminProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("display_order", { ascending: true })
      .order("id", { ascending: false });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setProjects(data || []);
    }
    setIsLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    setIsSaving(true);

    try {
      if (editingProject.id) {
        // Update
        const { error } = await supabase
          .from("projects")
          .update({
            project_name: editingProject.project_name,
            description_en: editingProject.description_en,
            description_de: editingProject.description_de,
            description_url: editingProject.description_url,
            image_url: editingProject.image_url,
            technologies_used: editingProject.technologies_used,
            is_visible: editingProject.is_visible ?? true,
            display_order: Number(editingProject.display_order) || 0,
          })
          .eq("id", editingProject.id);
        if (error) throw error;
        toast({ title: "Updated", description: "Project updated successfully" });
      } else {
        // Create
        const { error } = await supabase
          .from("projects")
          .insert([editingProject]);
        if (error) throw error;
        toast({ title: "Created", description: "Project created successfully" });
      }
      setEditingProject(null);
      fetchProjects();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    
    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Deleted", description: "Project deleted successfully" });
      fetchProjects();
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Button variant="ghost" size="sm" onClick={() => navigate("/admin/dashboard")} className="mb-2 -ml-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold">Manage Projects</h1>
            <p className="text-muted-foreground mt-1">Add, edit or remove projects from your portfolio.</p>
          </div>
          <Button onClick={() => setEditingProject({ 
            project_name: "", 
            description_en: "", 
            description_de: "", 
            technologies_used: [],
            achievements: [],
            is_visible: true,
            display_order: 0
          })}>
            <Plus className="mr-2 h-4 w-4" /> Add Project
          </Button>
        </div>

        <Dialog open={!!editingProject} onOpenChange={(open) => !open && setEditingProject(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProject?.id ? "Edit Project" : "Add New Project"}</DialogTitle>
            </DialogHeader>
            
            {editingProject && (
              <form onSubmit={handleSave} className="space-y-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="project_name" className="text-sm font-medium">Project Name</label>
                    <Input 
                      id="project_name"
                      value={editingProject?.project_name || ""} 
                      onChange={e => setEditingProject({...editingProject!, project_name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="description_url" className="text-sm font-medium">Live URL</label>
                    <Input 
                      id="description_url"
                      value={editingProject?.description_url || ""} 
                      onChange={e => setEditingProject({...editingProject!, description_url: e.target.value})}
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="description_en" className="text-sm font-medium">Description (English)</label>
                  <textarea 
                    id="description_en"
                    className="w-full min-h-[100px] p-2 rounded-md border border-input bg-transparent text-sm"
                    value={editingProject?.description_en || ""} 
                    onChange={e => setEditingProject({...editingProject!, description_en: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="description_de" className="text-sm font-medium">Description (German)</label>
                  <textarea 
                    id="description_de"
                    className="w-full min-h-[100px] p-2 rounded-md border border-input bg-transparent text-sm"
                    value={editingProject?.description_de || ""} 
                    onChange={e => setEditingProject({...editingProject!, description_de: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="image_url" className="text-sm font-medium">Image URL</label>
                  <Input 
                    id="image_url"
                    value={editingProject?.image_url || ""} 
                    onChange={e => setEditingProject({...editingProject!, image_url: e.target.value})}
                    placeholder="https://..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="is_visible" 
                      checked={editingProject?.is_visible !== false} 
                      onCheckedChange={(checked) => setEditingProject({...editingProject!, is_visible: checked as boolean})}
                    />
                    <label htmlFor="is_visible" className="text-sm font-medium leading-none cursor-pointer">
                      Visible in Portfolio
                    </label>
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="display_order" className="text-xs font-medium">Display Order (Lower first)</label>
                    <Input 
                      id="display_order"
                      type="number"
                      value={editingProject?.display_order || 0} 
                      onChange={e => setEditingProject({...editingProject!, display_order: parseInt(e.target.value) || 0})}
                      className="h-8"
                    />
                  </div>
                </div>

                <DialogFooter className="pt-4">
                  <Button type="button" variant="outline" onClick={() => setEditingProject(null)}>Cancel</Button>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save Project
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>

        <div className="glass-card rounded-xl overflow-hidden border border-primary/5">
          {isLoading ? (
            <div className="p-12 flex flex-col items-center justify-center gap-4 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p>Loading projects...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Image</TableHead>
                  <TableHead>Project Name</TableHead>
                  <TableHead className="hidden md:table-cell">Order</TableHead>
                  <TableHead className="hidden md:table-cell">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                      No projects found. Add your first project!
                    </TableCell>
                  </TableRow>
                ) : (
                  projects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell>
                        <div className="w-12 h-12 rounded bg-muted overflow-hidden flex items-center justify-center">
                          {project.image_url ? (
                            <img src={project.image_url} alt={project.project_name} className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{project.project_name}</span>
                          {project.description_url && (
                            <a href={project.description_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary flex items-center gap-1 mt-1 hover:underline">
                              <ExternalLink className="h-3 w-3" /> View Live
                            </a>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="outline">{project.display_order || 0}</Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {project.is_visible !== false ? (
                          <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Visible</Badge>
                        ) : (
                          <Badge variant="secondary" className="opacity-50">Hidden</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => setEditingProject(project)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(project.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
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

// Internal icon component for the button since it's not imported
const Save = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
);

export default AdminProjects;
