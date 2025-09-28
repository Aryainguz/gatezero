import { RefreshCw, Activity, Clock, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useStore } from "@/store/useStore";

const getStatusColor = (status: string) => {
  switch (status) {
    case 'healthy':
      return 'text-success';
    case 'warning':
      return 'text-warning';
    case 'error':
      return 'text-destructive';
    default:
      return 'text-muted-foreground';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'healthy':
      return <CheckCircle className="h-5 w-5 text-success" />;
    case 'warning':
      return <AlertTriangle className="h-5 w-5 text-warning" />;
    case 'error':
      return <XCircle className="h-5 w-5 text-destructive" />;
    default:
      return <Activity className="h-5 w-5 text-muted-foreground" />;
  }
};

const formatUptime = (uptime: number) => {
  if (uptime >= 99.9) return 'Excellent';
  if (uptime >= 99.0) return 'Good';
  if (uptime >= 95.0) return 'Fair';
  return 'Poor';
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

export default function Status() {
  const { gateways } = useStore();

  const healthyCount = gateways.filter(g => g.status === 'healthy').length;
  const warningCount = gateways.filter(g => g.status === 'warning').length;
  const errorCount = gateways.filter(g => g.status === 'error').length;
  const totalCount = gateways.length;
  
  const overallHealthPercentage = totalCount > 0 ? (healthyCount / totalCount) * 100 : 0;
  const avgResponseTime = gateways.reduce((acc, g) => acc + (g.responseTime || 0), 0) / totalCount;
  const avgUptime = gateways.reduce((acc, g) => acc + (g.uptime || 0), 0) / totalCount;

  const getOverallStatus = () => {
    if (errorCount > 0) return 'error';
    if (warningCount > 0) return 'warning';
    return 'healthy';
  };

  const overallStatus = getOverallStatus();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Status</h1>
          <p className="text-muted-foreground">
            Real-time health monitoring of your API gateway infrastructure
          </p>
        </div>
        <Button variant="outline" className="azure-glow">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh Status
        </Button>
      </div>

      {/* Overall Status */}
      <Card className={`azure-card border-l-4 ${
        overallStatus === 'healthy' ? 'border-l-success' :
        overallStatus === 'warning' ? 'border-l-warning' : 'border-l-destructive'
      }`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getStatusIcon(overallStatus)}
              <div>
                <CardTitle className="text-2xl">
                  System Status: {overallStatus === 'healthy' ? 'All Systems Operational' :
                    overallStatus === 'warning' ? 'Minor Issues Detected' : 'Service Disruption'}
                </CardTitle>
                <CardDescription>
                  Last updated: {formatLastChecked(new Date())}
                </CardDescription>
              </div>
            </div>
            <Badge className={`${
              overallStatus === 'healthy' ? 'azure-status-healthy' :
              overallStatus === 'warning' ? 'azure-status-warning' : 'azure-status-error'
            }`}>
              {overallStatus.toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">System Health</span>
                <span className="text-sm text-muted-foreground">{overallHealthPercentage.toFixed(1)}%</span>
              </div>
              <Progress value={overallHealthPercentage} className="h-2" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{avgResponseTime.toFixed(0)}ms</div>
              <div className="text-sm text-muted-foreground">Avg Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{avgUptime.toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">Avg Uptime</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="azure-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Gateways</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCount}</div>
            <p className="text-xs text-muted-foreground">
              Active endpoints
            </p>
          </CardContent>
        </Card>

        <Card className="azure-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Healthy</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
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
            <CardTitle className="text-sm font-medium">Warning</CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{warningCount}</div>
            <p className="text-xs text-muted-foreground">
              Performance issues
            </p>
          </CardContent>
        </Card>

        <Card className="azure-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error</CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{errorCount}</div>
            <p className="text-xs text-muted-foreground">
              Service unavailable
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gateway Status Details */}
      <Card className="azure-card">
        <CardHeader>
          <CardTitle>Gateway Health Details</CardTitle>
          <CardDescription>
            Individual status information for each API gateway
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {gateways.map((gateway) => (
              <div key={gateway.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/20 transition-colors">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(gateway.status)}
                  <div>
                    <div className="font-medium">{gateway.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {gateway.url} • {gateway.version}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6 text-sm">
                  <div className="text-center">
                    <div className="font-medium">
                      {gateway.responseTime ? `${gateway.responseTime}ms` : '-'}
                    </div>
                    <div className="text-muted-foreground">Response</div>
                  </div>
                  
                  <div className="text-center">
                    <div className={`font-medium ${getStatusColor(gateway.status)}`}>
                      {gateway.uptime ? `${gateway.uptime}%` : '-'}
                    </div>
                    <div className="text-muted-foreground">
                      {gateway.uptime ? formatUptime(gateway.uptime) : 'Unknown'}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="font-medium">
                      {formatLastChecked(gateway.lastChecked)}
                    </div>
                    <div className="text-muted-foreground">Last Check</div>
                  </div>
                  
                  <Badge className={`${
                    gateway.status === 'healthy' ? 'azure-status-healthy' :
                    gateway.status === 'warning' ? 'azure-status-warning' : 'azure-status-error'
                  }`}>
                    {gateway.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          {gateways.length === 0 && (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No gateways configured</h3>
              <p className="text-muted-foreground">
                Add some API gateways to start monitoring their health status
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="azure-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Response Time Trend</span>
            </CardTitle>
            <CardDescription>
              Average response times over the last 24 hours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="text-3xl font-bold">{avgResponseTime.toFixed(0)}ms</div>
              <div className="text-sm text-muted-foreground mt-2">
                Current average response time
              </div>
              <div className="mt-4 text-xs text-muted-foreground">
                Chart visualization would be implemented here
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="azure-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Uptime History</span>
            </CardTitle>
            <CardDescription>
              Service availability over the last 30 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="text-3xl font-bold">{avgUptime.toFixed(2)}%</div>
              <div className="text-sm text-muted-foreground mt-2">
                30-day uptime average
              </div>
              <div className="mt-4 text-xs text-muted-foreground">
                Uptime chart would be implemented here
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}