import { Settings as SettingsIcon, Bell, Shield, Database, Users, Key } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Settings() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Configure your GateZero portal preferences and security settings
        </p>
      </div>

      {/* Settings Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="azure-card hover:azure-glow transition-all duration-300">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-primary" />
              <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>
              Configure alerts and notification preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Email alerts, webhook notifications, and monitoring thresholds</div>
              <Button variant="outline" size="sm" className="w-full">
                Configure
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="azure-card hover:azure-glow transition-all duration-300">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle>Security</CardTitle>
            </div>
            <CardDescription>
              Access control and authentication settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Two-factor authentication, API keys, and access policies</div>
              <Button variant="outline" size="sm" className="w-full">
                Manage
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="azure-card hover:azure-glow transition-all duration-300">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Key className="h-5 w-5 text-primary" />
              <CardTitle>API Keys</CardTitle>
            </div>
            <CardDescription>
              Manage API keys and access tokens
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Create, rotate, and revoke API access keys</div>
              <Button variant="outline" size="sm" className="w-full">
                View Keys
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="azure-card hover:azure-glow transition-all duration-300">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-primary" />
              <CardTitle>Data & Backup</CardTitle>
            </div>
            <CardDescription>
              Data retention and backup policies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Configure data retention, export options, and backup schedules</div>
              <Button variant="outline" size="sm" className="w-full">
                Configure
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="azure-card hover:azure-glow transition-all duration-300">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-primary" />
              <CardTitle>Team & Access</CardTitle>
            </div>
            <CardDescription>
              User management and permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Invite team members, assign roles, and manage permissions</div>
              <Button variant="outline" size="sm" className="w-full">
                Manage Team
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="azure-card hover:azure-glow transition-all duration-300">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <SettingsIcon className="h-5 w-5 text-primary" />
              <CardTitle>General</CardTitle>
            </div>
            <CardDescription>
              Portal preferences and display settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Theme preferences, timezone, and interface customizations</div>
              <Button variant="outline" size="sm" className="w-full">
                Customize
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Information */}
      <Card className="azure-card">
        <CardHeader>
          <CardTitle>System Information</CardTitle>
          <CardDescription>
            Current system status and version information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Version</div>
              <div className="text-lg font-semibold">GateZero v2.1.0</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Status</div>
              <div className="flex items-center space-x-2">
                <Badge className="azure-status-healthy">Operational</Badge>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Last Updated</div>
              <div className="text-lg font-semibold">2 hours ago</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}