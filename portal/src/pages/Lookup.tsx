import { useState } from "react";
import { Search, Hash, Filter, ExternalLink, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useStore } from "@/store/useStore";

const getTypeBadge = (type: string) => {
  switch (type) {
    case 'api':
      return <Badge className="bg-primary/20 text-primary border-primary/30">API</Badge>;
    case 'service':
      return <Badge className="bg-secondary/20 text-secondary-foreground border-secondary/30">Service</Badge>;
    case 'endpoint':
      return <Badge className="bg-accent/20 text-accent-foreground border-accent/30">Endpoint</Badge>;
    default:
      return <Badge variant="outline">{type}</Badge>;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'active':
      return <Badge className="azure-status-healthy">Active</Badge>;
    case 'inactive':
      return <Badge className="azure-status-warning">Inactive</Badge>;
    case 'deprecated':
      return <Badge className="azure-status-error">Deprecated</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export default function Lookup() {
  const { 
    searchQuery, 
    setSearchQuery, 
    lookupResults, 
    isSearching 
  } = useStore();

  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredResults = lookupResults.filter(result => {
    const matchesType = filterType === "all" || result.type === filterType;
    const matchesStatus = filterStatus === "all" || result.status === filterStatus;
    return matchesType && matchesStatus;
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">API Lookup</h1>
        <p className="text-muted-foreground">
          Search and discover APIs, services, and endpoints across your gateway infrastructure
        </p>
      </div>

      {/* Search Section */}
      <Card className="azure-card">
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Main Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search APIs, services, endpoints, or tags..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 text-base h-12"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Type:</span>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="api">API</SelectItem>
                    <SelectItem value="service">Service</SelectItem>
                    <SelectItem value="endpoint">Endpoint</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Status:</span>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="deprecated">Deprecated</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Advanced
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      <div>
        {/* Results Header */}
        {(searchQuery || isSearching) && (
          <div className="mb-4">
            {isSearching ? (
              <p className="text-muted-foreground">Searching...</p>
            ) : (
              <p className="text-muted-foreground">
                {filteredResults.length} result{filteredResults.length !== 1 ? 's' : ''} 
                {searchQuery && ` for "${searchQuery}"`}
              </p>
            )}
          </div>
        )}

        {/* Loading State */}
        {isSearching && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="azure-card">
                <CardHeader>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Results */}
        {!isSearching && filteredResults.length > 0 && (
          <div className="space-y-4">
            {filteredResults.map((result) => (
              <Card key={result.id} className="azure-card hover:azure-glow transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <CardTitle className="text-lg">{result.name}</CardTitle>
                        {getTypeBadge(result.type)}
                        {getStatusBadge(result.status)}
                      </div>
                      <CardDescription className="flex items-center space-x-2">
                        <Hash className="h-4 w-4" />
                        <code className="relative rounded bg-muted px-2 py-1 text-sm">
                          {result.url}
                        </code>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {result.description && (
                      <p className="text-muted-foreground">{result.description}</p>
                    )}
                    
                    {result.tags.length > 0 && (
                      <div className="flex items-center space-x-2">
                        <Tag className="h-4 w-4 text-muted-foreground" />
                        <div className="flex flex-wrap gap-1">
                          {result.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center space-x-2 pt-2">
                      <Button variant="outline" size="sm">
                        View Documentation
                      </Button>
                      <Button variant="outline" size="sm">
                        Test Endpoint
                      </Button>
                      <Button variant="outline" size="sm">
                        Copy URL
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* No Results */}
        {!isSearching && searchQuery && filteredResults.length === 0 && (
          <Card className="azure-card">
            <CardContent className="text-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No results found</h3>
              <p className="text-muted-foreground mb-4">
                We couldn't find any APIs, services, or endpoints matching "{searchQuery}"
              </p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Try adjusting your search:</p>
                <ul className="space-y-1">
                  <li>• Check for typos or misspellings</li>
                  <li>• Use broader search terms</li>
                  <li>• Try searching by tags or categories</li>
                  <li>• Remove filters to see more results</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!isSearching && !searchQuery && (
          <Card className="azure-card">
            <CardContent className="text-center py-12">
              <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Start your search</h3>
              <p className="text-muted-foreground mb-6">
                Enter keywords to find APIs, services, and endpoints across your gateway infrastructure
              </p>
              
              {/* Quick Search Suggestions */}
              <div className="space-y-3">
                <p className="text-sm font-medium">Popular searches:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {['authentication', 'payment', 'user', 'analytics', 'oauth'].map((term) => (
                    <Button
                      key={term}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSearch(term)}
                      className="text-xs"
                    >
                      {term}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}