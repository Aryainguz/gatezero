import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Filter, Edit, Trash2, TestTube, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useStore } from "@/store/useStore";
import { useToast } from "@/hooks/use-toast";

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'healthy':
      return <Badge className="azure-status-healthy">Healthy</Badge>;
    case 'warning':
      return <Badge className="azure-status-warning">Warning</Badge>;
    case 'error':
      return <Badge className="azure-status-error">Error</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export default function Gateways() {
  const navigate = useNavigate();
  const { 
    gateways, 
    updateGateway, 
    deleteGateway,
    selectedGateway,
    setSelectedGateway,
    isEditGatewayModalOpen,
    setEditGatewayModalOpen
  } = useStore();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    baseUrl: "",
    basePath: "",
    description: "",
    version: "v1.0.0"
  });

  const filteredGateways = gateways.filter(gateway => 
    gateway.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    gateway.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
    gateway.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      name: "",
      url: "",
      baseUrl: "",
      basePath: "",
      description: "",
      version: "v1.0.0"
    });
  };


  const handleEditGateway = () => {
    if (!selectedGateway || !formData.name || !formData.url) {
      toast({
        title: "Validation Error",
        description: "Name and URL are required fields.",
        variant: "destructive",
      });
      return;
    }

    updateGateway(selectedGateway.id, {
      name: formData.name,
      url: formData.url,
      baseUrl: formData.baseUrl,
      basePath: formData.basePath,
      description: formData.description,
      version: formData.version,
    });

    setEditGatewayModalOpen(false);
    setSelectedGateway(null);
    resetForm();
    
    toast({
      title: "Gateway Updated",
      description: `${formData.name} has been successfully updated.`,
    });
  };

  const handleDeleteGateway = (gateway: any) => {
    deleteGateway(gateway.id);
    
    toast({
      title: "Gateway Deleted",
      description: `${gateway.name} has been removed.`,
    });
  };


  const openEditModal = (gateway: any) => {
    setFormData({
      name: gateway.name,
      url: gateway.url,
      baseUrl: gateway.baseUrl || "",
      basePath: gateway.basePath || "",
      description: gateway.description || "",
      version: gateway.version || "v1.0.0"
    });
    setSelectedGateway(gateway);
    setEditGatewayModalOpen(true);
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">API Gateways</h1>
          <p className="text-muted-foreground">
            Manage your API gateway endpoints and configurations
          </p>
        </div>
        <Button onClick={() => navigate('/gateways/create')} className="azure-button-primary">
          <Plus className="mr-2 h-4 w-4" />
          Create Gateway
        </Button>
      </div>

      {/* Search and Filter */}
      <Card className="azure-card">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search gateways by name, URL, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Gateways Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGateways.map((gateway) => (
          <Card key={gateway.id} className="azure-card hover:azure-glow transition-all duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getStatusBadge(gateway.status)}
                  <Badge variant="outline" className="text-xs">
                    {gateway.version}
                  </Badge>
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => openEditModal(gateway)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => handleDeleteGateway(gateway)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardTitle className="text-lg">{gateway.name}</CardTitle>
              <CardDescription className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="text-xs text-muted-foreground">GateZero:</div>
                  <code className="relative rounded bg-muted px-2 py-1 text-xs">
                    {gateway.url}
                  </code>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
                {gateway.baseUrl && (
                  <div className="flex items-center space-x-2">
                    <div className="text-xs text-muted-foreground">Base:</div>
                    <code className="relative rounded bg-muted px-2 py-1 text-xs">
                      {gateway.baseUrl}
                    </code>
                  </div>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {gateway.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {gateway.description}
                  </p>
                )}
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Response Time</span>
                    <div className="font-medium">
                      {gateway.responseTime ? `${gateway.responseTime}ms` : '-'}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Uptime</span>
                    <div className="font-medium">
                      {gateway.uptime ? `${gateway.uptime}%` : '-'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <TestTube className="mr-2 h-4 w-4" />
                    Test
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredGateways.length === 0 && (
        <Card className="azure-card">
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground text-lg">No gateways found</p>
            <p className="text-muted-foreground text-sm mt-2">
              {searchTerm ? "Try adjusting your search terms" : "Create your first gateway to get started"}
            </p>
            {!searchTerm && (
              <Button onClick={() => navigate('/gateways/create')} className="mt-4 azure-button-primary">
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Gateway
              </Button>
            )}
          </CardContent>
        </Card>
      )}


      {/* Edit Gateway Modal */}
      <Dialog open={isEditGatewayModalOpen} onOpenChange={setEditGatewayModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Gateway</DialogTitle>
            <DialogDescription>
              Update the gateway configuration.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-url">GateZero URL</Label>
              <Input
                id="edit-url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-baseUrl">Base URL</Label>
              <Input
                id="edit-baseUrl"
                value={formData.baseUrl}
                onChange={(e) => setFormData({ ...formData, baseUrl: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-basePath">Base Path</Label>
              <Input
                id="edit-basePath"
                value={formData.basePath}
                onChange={(e) => setFormData({ ...formData, basePath: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-version">Version</Label>
              <Input
                id="edit-version"
                value={formData.version}
                onChange={(e) => setFormData({ ...formData, version: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditGatewayModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditGateway} className="azure-button-primary">
              Update Gateway
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}