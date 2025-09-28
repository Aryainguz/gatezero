import { create } from 'zustand';

export interface Gateway {
  id: string;
  name: string;
  url: string;
  baseUrl?: string;
  basePath?: string;
  status: 'healthy' | 'warning' | 'error';
  description?: string;
  version?: string;
  lastChecked: Date;
  responseTime?: number;
  uptime?: number;
}

export interface LookupResult {
  id: string;
  name: string;
  type: 'api' | 'service' | 'endpoint';
  url: string;
  status: 'active' | 'inactive' | 'deprecated';
  tags: string[];
  description?: string;
}

interface AppState {
  // Gateway Management
  gateways: Gateway[];
  selectedGateway: Gateway | null;
  isCreateGatewayModalOpen: boolean;
  isEditGatewayModalOpen: boolean;
  
  // Search & Lookup
  searchQuery: string;
  lookupResults: LookupResult[];
  isSearching: boolean;
  
  // UI State
  sidebarCollapsed: boolean;
  currentPage: string;
  
  // Actions
  setGateways: (gateways: Gateway[]) => void;
  addGateway: (gateway: Gateway) => void;
  updateGateway: (id: string, updates: Partial<Gateway>) => void;
  deleteGateway: (id: string) => void;
  setSelectedGateway: (gateway: Gateway | null) => void;
  setCreateGatewayModalOpen: (open: boolean) => void;
  setEditGatewayModalOpen: (open: boolean) => void;
  
  setSearchQuery: (query: string) => void;
  setLookupResults: (results: LookupResult[]) => void;
  setIsSearching: (searching: boolean) => void;
  
  setSidebarCollapsed: (collapsed: boolean) => void;
  setCurrentPage: (page: string) => void;
}

// Mock data for demonstration
const mockGateways: Gateway[] = [
  {
    id: '1',
    name: 'User API Gateway',
    url: 'https://api.users.gatezero.com',
    baseUrl: 'https://internal-user-api.company.com',
    basePath: '/api/v2/users',
    status: 'healthy',
    description: 'Main user authentication and profile management API',
    version: 'v2.1.0',
    lastChecked: new Date(),
    responseTime: 156,
    uptime: 99.9
  },
  {
    id: '2',
    name: 'Payment Gateway',
    url: 'https://api.payments.gatezero.com',
    baseUrl: 'https://payments.stripe.com',
    basePath: '/v1/payments',
    status: 'warning',
    description: 'Payment processing and billing API',
    version: 'v1.8.3',
    lastChecked: new Date(Date.now() - 300000),
    responseTime: 324,
    uptime: 98.7
  },
  {
    id: '3',
    name: 'Analytics Gateway',
    url: 'https://api.analytics.gatezero.com',
    baseUrl: 'https://analytics-internal.company.com',
    basePath: '/api/v1/analytics',
    status: 'error',
    description: 'Analytics and reporting API',
    version: 'v1.5.2',
    lastChecked: new Date(Date.now() - 600000),
    responseTime: 0,
    uptime: 0
  }
];

const mockLookupResults: LookupResult[] = [
  {
    id: '1',
    name: 'User Authentication',
    type: 'api',
    url: '/auth/login',
    status: 'active',
    tags: ['authentication', 'security', 'oauth'],
    description: 'OAuth 2.0 authentication endpoint'
  },
  {
    id: '2',
    name: 'Payment Processing',
    type: 'service',
    url: '/payments/process',
    status: 'active',
    tags: ['payments', 'stripe', 'billing'],
    description: 'Process payment transactions'
  },
  {
    id: '3',
    name: 'Analytics Reporting',
    type: 'endpoint',
    url: '/analytics/reports',
    status: 'deprecated',
    tags: ['analytics', 'reports', 'legacy'],
    description: 'Legacy analytics reporting endpoint'
  }
];

export const useStore = create<AppState>((set, get) => ({
  // Initial state
  gateways: mockGateways,
  selectedGateway: null,
  isCreateGatewayModalOpen: false,
  isEditGatewayModalOpen: false,
  
  searchQuery: '',
  lookupResults: [],
  isSearching: false,
  
  sidebarCollapsed: false,
  currentPage: 'dashboard',
  
  // Gateway actions
  setGateways: (gateways) => set({ gateways }),
  
  addGateway: (gateway) => set((state) => ({
    gateways: [...state.gateways, gateway]
  })),
  
  updateGateway: (id, updates) => set((state) => ({
    gateways: state.gateways.map(gateway => 
      gateway.id === id ? { ...gateway, ...updates } : gateway
    )
  })),
  
  deleteGateway: (id) => set((state) => ({
    gateways: state.gateways.filter(gateway => gateway.id !== id)
  })),
  
  setSelectedGateway: (gateway) => set({ selectedGateway: gateway }),
  setCreateGatewayModalOpen: (open) => set({ isCreateGatewayModalOpen: open }),
  setEditGatewayModalOpen: (open) => set({ isEditGatewayModalOpen: open }),
  
  // Search actions
  setSearchQuery: (query) => {
    set({ searchQuery: query });
    
    // Simulate search
    if (query.trim()) {
      set({ isSearching: true });
      setTimeout(() => {
        const filtered = mockLookupResults.filter(result =>
          result.name.toLowerCase().includes(query.toLowerCase()) ||
          result.description?.toLowerCase().includes(query.toLowerCase()) ||
          result.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        );
        set({ lookupResults: filtered, isSearching: false });
      }, 800);
    } else {
      set({ lookupResults: [], isSearching: false });
    }
  },
  
  setLookupResults: (results) => set({ lookupResults: results }),
  setIsSearching: (searching) => set({ isSearching: searching }),
  
  // UI actions
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setCurrentPage: (page) => set({ currentPage: page }),
}));