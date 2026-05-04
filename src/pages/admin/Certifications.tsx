
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
  Loader2,
  ArrowLeft,
  Award,
  ExternalLink,
  CheckCircle2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { Certification } from "@/types/database";

const AdminCertifications = () => {
  const [certs, setCerts] = useState<Certification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingCert, setEditingCert] = useState<Partial<Certification> | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCerts();
  }, []);

  const fetchCerts = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("certifications")
      .select("*")
      .order("date_obtained", { ascending: false });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setCerts(data || []);
    }
    setIsLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCert) return;
    setIsSaving(true);

    try {
      if (editingCert.id) {
        const { error } = await supabase
          .from("certifications")
          .update({
            certification_name_en: editingCert.certification_name_en,
            certification_name_de: editingCert.certification_name_de,
            issuing_organization: editingCert.issuing_organization,
            date_obtained: editingCert.date_obtained,
            certificate_url: editingCert.certificate_url,
            badge_image_url: editingCert.badge_image_url,
            credly_url: editingCert.credly_url,
            is_featured: editingCert.is_featured,
          })
          .eq("id", editingCert.id);
        if (error) throw error;
        toast({ title: "Updated", description: "Certificate updated successfully" });
      } else {
        const { error } = await supabase
          .from("certifications")
          .insert([editingCert]);
        if (error) throw error;
        toast({ title: "Created", description: "Certificate added successfully" });
      }
      setEditingCert(null);
      fetchCerts();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure?")) return;

    const { error } = await supabase.from("certifications").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Deleted", description: "Certificate removed" });
      fetchCerts();
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
            <h1 className="text-3xl font-bold">Certifications</h1>
            <p className="text-muted-foreground mt-1">Manage your professional credentials and badges.</p>
          </div>

          <Dialog open={!!editingCert} onOpenChange={(open) => !open && setEditingCert(null)}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingCert({ 
                certification_name_en: "", 
                certification_name_de: "", 
                issuing_organization: "",
                date_obtained: new Date().toISOString().split('T')[0],
                is_featured: false
              })} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Certificate
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingCert?.id ? "Edit Certificate" : "Add Certificate"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSave} className="space-y-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Name (EN)</label>
                    <Input 
                      value={editingCert?.certification_name_en || ""} 
                      onChange={e => setEditingCert({...editingCert!, certification_name_en: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Name (DE)</label>
                    <Input 
                      value={editingCert?.certification_name_de || ""} 
                      onChange={e => setEditingCert({...editingCert!, certification_name_de: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Issuing Org</label>
                    <Input 
                      value={editingCert?.issuing_organization || ""} 
                      onChange={e => setEditingCert({...editingCert!, issuing_organization: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date Obtained</label>
                    <Input 
                      type="date"
                      value={editingCert?.date_obtained || ""} 
                      onChange={e => setEditingCert({...editingCert!, date_obtained: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Badge Image URL</label>
                    <Input 
                      value={editingCert?.badge_image_url || ""} 
                      onChange={e => setEditingCert({...editingCert!, badge_image_url: e.target.value})}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Verify URL (Credly/Link)</label>
                    <Input 
                      value={editingCert?.certificate_url || editingCert?.credly_url || ""} 
                      onChange={e => setEditingCert({...editingCert!, certificate_url: e.target.value})}
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="featured"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    checked={editingCert?.is_featured || false}
                    onChange={e => setEditingCert({...editingCert!, is_featured: e.target.checked})}
                  />
                  <label htmlFor="featured" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Feature this certificate on the home page
                  </label>
                </div>

                <DialogFooter className="pt-4">
                  <Button type="button" variant="ghost" onClick={() => setEditingCert(null)}>Cancel</Button>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Certificate
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
              <p>Loading certificates...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Certificate</TableHead>
                  <TableHead>Organization</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {certs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-12 text-muted-foreground">
                      No certificates found.
                    </TableCell>
                  </TableRow>
                ) : (
                  certs.map((cert) => (
                    <TableRow key={cert.id} className="group hover:bg-primary/5 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            {cert.badge_image_url ? (
                              <img src={cert.badge_image_url} alt="" className="w-10 h-10 object-contain p-1 bg-white rounded-md shadow-sm" />
                            ) : (
                              <div className="w-10 h-10 bg-secondary rounded-md flex items-center justify-center">
                                <Award className="h-5 w-5 text-primary" />
                              </div>
                            )}
                            {cert.is_featured && (
                              <CheckCircle2 className="absolute -top-1 -right-1 h-3.5 w-3.5 text-green-500 fill-white" />
                            )}
                          </div>
                          <div>
                            <div className="font-semibold">{cert.certification_name_en}</div>
                            <div className="text-xs text-muted-foreground">{cert.date_obtained}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {cert.issuing_organization}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => setEditingCert(cert)}
                            className="h-8 w-8"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDelete(cert.id)}
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

export default AdminCertifications;
