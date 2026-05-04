
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
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  ExternalLink, 
  Image as ImageIcon,
  Loader2,
  ArrowLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { Project } from "@/types/database";

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

    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Deleted", description: "Project deleted successfully" });
      fetchProjects();
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
            <h1 className="text-3xl font-bold">Manage Projects</h1>
            <p className="text-muted-foreground mt-1">Add, edit or remove projects from your portfolio.</p>
          </div>

          <Dialog open={!!editingProject} onOpenChange={(open) => !open && setEditingProject(null)}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingProject({ 
                project_name: "", 
                description_en: "", 
                description_de: "", 
                technologies_used: [],
                achievements: [] 
              })} className="gap-2">
                <Plus className="h-4 w-4" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingProject?.id ? "Edit Project" : "Create New Project"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSave} className="space-y-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Project Name</label>
                    <Input 
                      value={editingProject?.project_name || ""} 
                      onChange={e => setEditingProject({...editingProject!, project_name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Live URL</label>
                    <Input 
                      value={editingProject?.description_url || ""} 
                      onChange={e => setEditingProject({...editingProject!, description_url: e.target.value})}
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Description (English)</label>
                  <textarea 
                    className="w-full min-h-[100px] p-2 rounded-md border border-input bg-transparent text-sm"
                    value={editingProject?.description_en || ""} 
                    onChange={e => setEditingProject({...editingProject!, description_en: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Description (German)</label>
                  <textarea 
                    className="w-full min-h-[100px] p-2 rounded-md border border-input bg-transparent text-sm"
                    value={editingProject?.description_de || ""} 
                    onChange={e => setEditingProject({...editingProject!, description_de: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Technologies (comma separated)</label>
                  <Input 
                    value={Array.isArray(editingProject?.technologies_used) ? editingProject?.technologies_used.join(", ") : ""} 
                    onChange={e => setEditingProject({...editingProject!, technologies_used: e.target.value.split(",").map(t => t.trim())})}
                    placeholder="React, TypeScript, Supabase"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Image URL</label>
                  <Input 
                    value={editingProject?.image_url || ""} 
                    onChange={e => setEditingProject({...editingProject!, image_url: e.target.value})}
                    placeholder="https://..."
                  />
                </div>

                <DialogFooter className="pt-4">
                  <Button type="button" variant="ghost" onClick={() => setEditingProject(null)}>Cancel</Button>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Project
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
              <p>Fetching your projects...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Image</TableHead>
                  <TableHead>Project Name</TableHead>
                  <TableHead className="hidden md:table-cell">Technologies</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                      No projects found. Start by adding one!
                    </TableCell>
                  </TableRow>
                ) : (
                  projects.map((project) => (
                    <TableRow key={project.id} className="group hover:bg-primary/5 transition-colors">
                      <TableCell>
                        {project.image_url ? (
                          <img src={project.image_url} alt="" className="w-12 h-12 object-cover rounded-lg shadow-sm" />
                        ) : (
                          <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                            <ImageIcon className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold">{project.project_name}</div>
                        {project.description_url && (
                          <a href={project.description_url} target="_blank" className="text-xs text-primary flex items-center gap-1 hover:underline">
                            <ExternalLink size={10} /> Live Demo
                          </a>
                        )}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {Array.isArray(project.technologies_used) && project.technologies_used.slice(0, 3).map((tech, i) => (
                            <Badge key={i} variant="secondary" className="text-[10px] px-1.5 py-0">
                              {tech}
                            </Badge>
                          ))}
                          {Array.isArray(project.technologies_used) && project.technologies_used.length > 3 && (
                            <span className="text-[10px] text-muted-foreground">+{project.technologies_used.length - 3}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => setEditingProject(project)}
                            className="h-8 w-8 hover:text-blue-500"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDelete(project.id)}
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

export default AdminProjects;
