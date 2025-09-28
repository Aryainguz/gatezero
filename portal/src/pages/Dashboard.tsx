import { useState } from "react";
import { Plus, Search, Filter, MoreHorizontal, Activity, Clock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useStore } from "@/store/useStore";

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

const formatLastChecked = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
  return `${Math.floor(minutes / 1440)}d ago`;
};

export default function Dashboard() {
  const { gateways, setSelectedGateway, setEditGatewayModalOpen } = useStore();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredGateways = gateways.filter(gateway => 
    gateway.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    gateway.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const healthyCount = gateways.filter(g => g.status === 'healthy').length;
  const warningCount = gateways.filter(g => g.status === 'warning').length;
  const errorCount = gateways.filter(g => g.status === 'error').length;
  const avgUptime = gateways.reduce((acc, g) => acc + (g.uptime || 0), 0) / gateways.length;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="azure-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Gateways</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{gateways.length}</div>
            <p className="text-xs text-muted-foreground">
              Active API gateways
            </p>
          </CardContent>
        </Card>

        <Card className="azure-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Healthy</CardTitle>
            <div className="h-3 w-3 bg-success rounded-full" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{healthyCount}</div>
            <p className="text-xs text-muted-foreground">
              Operating normally
            </p>
          </CardContent>
        </Card>

        <Card className="azure-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{warningCount + errorCount}</div>
            <p className="text-xs text-muted-foreground">
              Requires attention
            </p>
          </CardContent>
        </Card>

        <Card className="azure-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Uptime</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgUptime.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gateway Management Section */}
      <Card className="azure-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>API Gateways</CardTitle>
              <CardDescription>
                Manage and monitor your API gateway endpoints
              </CardDescription>
            </div>
            <Button className="azure-button-primary">
              <Plus className="mr-2 h-4 w-4" />
              Add Gateway
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search gateways..."
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

          {/* Gateways Table */}
          <div className="rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-muted/50">
                  <TableHead>Name</TableHead>
                  <TableHead>Base URL</TableHead>
                  <TableHead>GateZero URL</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Response Time</TableHead>
                  <TableHead>Uptime</TableHead>
                  <TableHead>Last Checked</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGateways.map((gateway) => (
                  <TableRow key={gateway.id} className="hover:bg-muted/20">
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-semibold">{gateway.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {gateway.version}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <code className="relative rounded bg-muted px-2 py-1 text-sm block">
                          {gateway.baseUrl || 'N/A'}
                        </code>
                        {gateway.basePath && (
                          <div className="text-xs text-muted-foreground">
                            Path: {gateway.basePath}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="relative rounded bg-muted px-2 py-1 text-sm">
                        {gateway.url}
                      </code>
                    </TableCell>
                    <TableCell>{getStatusBadge(gateway.status)}</TableCell>
                    <TableCell>
                      {gateway.responseTime ? `${gateway.responseTime}ms` : '-'}
                    </TableCell>
                    <TableCell>
                      {gateway.uptime ? `${gateway.uptime}%` : '-'}
                    </TableCell>
                    <TableCell>{formatLastChecked(gateway.lastChecked)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedGateway(gateway);
                              setEditGatewayModalOpen(true);
                            }}
                          >
                            Edit gateway
                          </DropdownMenuItem>
                          <DropdownMenuItem>View details</DropdownMenuItem>
                          <DropdownMenuItem>Test endpoint</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            Delete gateway
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredGateways.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No gateways found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}