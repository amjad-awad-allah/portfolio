
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Loader2,
  ArrowLeft,
  Users,
  Eye,
  Trash2,
  Settings
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const AdminAnalytics = () => {
  const [visits, setVisits] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExcluded, setIsExcluded] = useState(localStorage.getItem("exclude_analytics") === "true");
  const navigate = useNavigate();

  useEffect(() => {
    fetchVisits();
  }, []);

  const markVisitsAsSeen = async (unseenIds: any[]) => {
    if (!unseenIds || unseenIds.length === 0) return;
    
    console.log("Marking visits as seen:", unseenIds);
    const { error } = await supabase
      .from("site_visits")
      .update({ is_seen: true })
      .in("id", unseenIds);
      
    if (error) {
      console.error("Error marking visits as seen:", error);
      // We don't show a toast here to avoid annoying the user on every page load
    }
  };

  const fetchVisits = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("site_visits")
        .select("*")
        .order("visited_at", { ascending: false })
        .limit(100);

      if (error) throw error;

      setVisits(data || []);
      
      // Mark unseen visits as seen
      const unseenIds = data?.filter(v => v.is_seen === false || v.is_seen === null).map(v => v.id) || [];
      if (unseenIds.length > 0) {
        await markVisitsAsSeen(unseenIds);
      }
    } catch (error: any) {
      console.error("Fetch error:", error);
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExclusion = () => {
    const newValue = !isExcluded;
    localStorage.setItem("exclude_analytics", newValue.toString());
    setIsExcluded(newValue);
    toast({ 
      title: newValue ? "Device Excluded" : "Device Included", 
      description: newValue ? "Your visits will no longer be tracked." : "Your visits will now be tracked." 
    });
  };

  const clearVisits = async () => {
    if (!confirm("Are you sure you want to clear all visit history?")) return;
    
    setIsLoading(true);
    const { error } = await supabase
      .from("site_visits")
      .delete()
      .lte("visited_at", new Date().toISOString());
      
    if (error) {
      console.error("Delete error:", error);
      toast({ 
        title: "Error", 
        description: error.message || "Could not clear history. This might be a permission issue.", 
        variant: "destructive" 
      });
    } else {
      toast({ title: "Success", description: "History cleared" });
      setVisits([]);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <Button variant="ghost" size="sm" onClick={() => navigate("/admin/dashboard")} className="mb-2 -ml-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              Visitor Analytics
            </h1>
            <p className="text-muted-foreground mt-1">Track who visits your portfolio and when.</p>
          </div>

          <div className="flex gap-2">
            <Button 
              variant={isExcluded ? "default" : "outline"} 
              size="sm" 
              onClick={toggleExclusion}
              className="gap-2"
            >
              <Settings className="h-4 w-4" />
              {isExcluded ? "Un-exclude this device" : "Exclude this device"}
            </Button>
            <Button variant="destructive" size="sm" onClick={clearVisits}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear History
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-card p-6 rounded-2xl border border-primary/5">
            <div className="flex items-center gap-3 mb-2">
              <Eye className="h-5 w-5 text-blue-500" />
              <h3 className="font-medium">Total Visits</h3>
            </div>
            <p className="text-4xl font-bold">{visits.length}{visits.length >= 100 ? "+" : ""}</p>
          </div>
          <div className="glass-card p-6 rounded-2xl border border-primary/5">
            <div className="flex items-center gap-3 mb-2">
              <Users className="h-5 w-5 text-green-500" />
              <h3 className="font-medium">Recent Visitors (Last 24h)</h3>
            </div>
            <p className="text-4xl font-bold">
              {visits.filter(v => new Date(v.visited_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)).length}
            </p>
          </div>
          <div className="glass-card p-6 rounded-2xl border border-primary/5">
            <div className="flex items-center gap-3 mb-2">
              <Settings className="h-5 w-5 text-orange-500" />
              <h3 className="font-medium">Tracking Status</h3>
            </div>
            <p className={`text-xl font-bold ${isExcluded ? "text-destructive" : "text-green-500"}`}>
              {isExcluded ? "Not Tracking You" : "Tracking All"}
            </p>
          </div>
        </div>

        <div className="glass-card rounded-xl overflow-hidden border border-primary/5">
          {isLoading ? (
            <div className="p-12 flex flex-col items-center justify-center gap-4 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p>Loading analytics data...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Device</TableHead>
                  <TableHead className="hidden md:table-cell">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visits.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                      No visits recorded yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  visits.map((visit) => (
                    <TableRow 
                      key={visit.id} 
                      className={`transition-colors ${visit.is_seen === false || visit.is_seen === null ? "bg-primary/10 hover:bg-primary/15 font-medium" : "hover:bg-primary/5"}`}
                    >
                      <TableCell className="font-mono text-xs">
                        <div className="flex items-center gap-2">
                          {(visit.is_seen === false || visit.is_seen === null) && (
                            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                          )}
                          {format(new Date(visit.visited_at), "MMM d, HH:mm")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold">{visit.country || "Unknown"}</span>
                          <span className="text-[10px] text-muted-foreground">{visit.city || "Unknown"} ({visit.ip_address || "no-ip"})</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-[10px] uppercase">
                          {visit.device_type || "Unknown"}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex flex-col text-[10px] text-muted-foreground">
                          <span>Lang: {visit.language || "N/A"}</span>
                          <span>Res: {visit.screen_resolution || "N/A"}</span>
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

export default AdminAnalytics;
