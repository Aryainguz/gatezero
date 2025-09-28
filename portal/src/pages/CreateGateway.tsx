import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useStore } from "@/store/useStore";
import { useToast } from "@/hooks/use-toast";

export default function CreateGateway() {
  const navigate = useNavigate();
  const { addGateway } = useStore();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    url: "",
    baseUrl: "",
    basePath: "",
    description: "",
    version: "v1.0.0"
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleCreateGateway = () => {
    if (!formData.name || !formData.url) {
      toast({
        title: "Validation Error",
        description: "Name and URL are required fields.",
        variant: "destructive",
      });
      return;
    }

    const newGateway = {
      id: Date.now().toString(),
      name: formData.name,
      url: formData.url,
      baseUrl: formData.baseUrl,
      basePath: formData.basePath,
      description: formData.description,
      version: formData.version,
      status: 'healthy' as const,
      lastChecked: new Date(),
      responseTime: Math.floor(Math.random() * 500) + 100,
      uptime: 99.9
    };

    addGateway(newGateway);
    navigate('/gateways');
    
    toast({
      title: "Gateway Created",
      description: `${newGateway.name} has been successfully created.`,
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['application/json', 'text/yaml', 'application/x-yaml', 'text/yml'];
      const isValidType = validTypes.includes(file.type) || 
                         file.name.endsWith('.json') || 
                         file.name.endsWith('.yaml') || 
                         file.name.endsWith('.yml');
      
      if (!isValidType) {
        toast({
          title: "Invalid File Type",
          description: "Please upload a JSON, YAML, or YML file.",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "File size must be less than 5MB.",
          variant: "destructive",
        });
        return;
      }

      setUploadedFile(file);
      toast({
        title: "File Uploaded",
        description: `${file.name} is ready for processing.`,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate('/gateways')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Gateway</h1>
          <p className="text-muted-foreground">
            Add a new API gateway endpoint to your portal
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl">
        <Card className="azure-card">
          <CardHeader>
            <CardTitle>Gateway Configuration</CardTitle>
            <CardDescription>
              Configure your API gateway settings and upload specification files
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., User Authentication API"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="version">Version</Label>
                <Input
                  id="version"
                  placeholder="v1.0.0"
                  value={formData.version}
                  onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">GateZero URL *</Label>
              <Input
                id="url"
                placeholder="https://api.gatezero.com/your-gateway"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="baseUrl">Base URL</Label>
                <Input
                  id="baseUrl"
                  placeholder="https://your-internal-api.com"
                  value={formData.baseUrl}
                  onChange={(e) => setFormData({ ...formData, baseUrl: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="basePath">Base Path</Label>
                <Input
                  id="basePath"
                  placeholder="/api/v1"
                  value={formData.basePath}
                  onChange={(e) => setFormData({ ...formData, basePath: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of the API gateway..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            {/* File Upload Section */}
            <div className="space-y-2">
              <Label htmlFor="file-upload">API Specification File (Optional)</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                <input
                  id="file-upload"
                  type="file"
                  accept=".json,.yaml,.yml"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center space-y-3">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <div className="text-sm">
                      {uploadedFile ? (
                        <div className="flex items-center space-x-2">
                          <span className="text-primary font-medium">{uploadedFile.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {(uploadedFile.size / 1024).toFixed(1)}KB
                          </Badge>
                        </div>
                      ) : (
                        <div>
                          <div className="text-muted-foreground">Click to upload OpenAPI/Swagger file</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Supports JSON, YAML, YML files (max 5MB)
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/gateways')}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreateGateway} 
                className="azure-button-primary"
              >
                Create Gateway
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}