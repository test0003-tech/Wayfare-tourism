'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  LayoutDashboard, Package, Globe, Hotel, Plane, Star, MessageSquareQuote,
  Image as ImageIcon, FileText, Video, CalendarDays, Mail, Settings, Rocket,
  Plus, Pencil, Trash2, Search, RefreshCw, ChevronLeft, ChevronRight,
  Menu, X, Loader2, ExternalLink, TrendingUp, DollarSign, Eye,
  CheckCircle2, XCircle, Clock, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle,
  AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction,
} from '@/components/ui/alert-dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from '@/components/ui/sheet';
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from '@/components/ui/tooltip';
import { toast } from 'sonner';

// ─── TYPES ────────────────────────────────────────────────────────────────────

type Section = 'overview' | 'packages' | 'destinations' | 'hotels' | 'flights' | 'reviews' | 'testimonials' | 'gallery' | 'blog' | 'videos' | 'bookings' | 'inquiries' | 'settings' | 'deploy';

interface StatsData {
  counts: Record<string, number>;
  highlights: {
    activePackages: number;
    featuredPackages: number;
    pendingBookings: number;
    confirmedBookings: number;
    newInquiries: number;
    pendingReviews: number;
    revenue: number;
  };
  recentBookings: Array<{
    id: string; name: string; packageName: string; travelers: number; totalPrice: number; status: string; createdAt: string;
  }>;
  recentInquiries: Array<{
    id: string; name: string; email: string; type: string; status: string; createdAt: string;
  }>;
}

interface Destination { id: string; name: string; slug: string; country: string; region: string; image: string; description: string; tagline: string; featured: boolean; status: string; createdAt: string; }
interface PackageItem { id: string; name: string; slug: string; destinationId: string; destination?: { name: string; country: string }; category: string; duration: string; price: number; originalPrice: number | null; image: string; description: string; highlights: string; included: string; featured: boolean; status: string; createdAt: string; }
interface Hotel { id: string; name: string; slug: string; destinationId: string; destination?: { name: string; country: string }; category: string; stars: number; pricePerNight: number; originalPrice: number | null; image: string; description: string; amenities: string; featured: boolean; status: string; createdAt: string; }
interface Flight { id: string; from: string; to: string; airline: string; price: number; originalPrice: number | null; type: string; image: string; description: string; featured: boolean; status: string; createdAt: string; }
interface Review { id: string; name: string; avatar: string; location: string; rating: number; title: string; text: string; category: string; verified: boolean; status: string; package?: { name: string }; destination?: { name: string }; createdAt: string; }
interface Testimonial { id: string; name: string; location: string; trip: string; rating: number; text: string; avatar: string; happyNote: string; verified: boolean; featured: boolean; status: string; createdAt: string; }
interface GalleryImage { id: string; title: string; image: string; caption: string; category: string; featured: boolean; status: string; createdAt: string; }
interface BlogPost { id: string; title: string; slug: string; excerpt: string; content: string; authorName: string; date: string; category: string; image: string; readingTime: string; tags: string; featured: boolean; status: string; createdAt: string; }
interface Video { id: string; title: string; url: string; thumbnail: string; description: string; category: string; featured: boolean; status: string; createdAt: string; }
interface Booking { id: string; name: string; email: string; phone: string; travelers: number; totalPrice: number; status: string; departureDate: string; package?: { name: string }; createdAt: string; }
interface Inquiry { id: string; name: string; email: string; phone: string | null; type: string; message: string; status: string; createdAt: string; }
interface SiteSetting { id: string; key: string; value: string; type: string; group: string; label: string; }
interface DeployLog { id: string; action: string; details: string; status: string; triggeredBy: string; createdAt: string; }

// ─── NAV CONFIG ───────────────────────────────────────────────────────────────

const NAV_ITEMS: { id: Section; label: string; icon: React.ReactNode }[] = [
  { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="size-4" /> },
  { id: 'packages', label: 'Packages', icon: <Package className="size-4" /> },
  { id: 'destinations', label: 'Destinations', icon: <Globe className="size-4" /> },
  { id: 'hotels', label: 'Hotels', icon: <Hotel className="size-4" /> },
  { id: 'flights', label: 'Flights', icon: <Plane className="size-4" /> },
  { id: 'reviews', label: 'Reviews', icon: <Star className="size-4" /> },
  { id: 'testimonials', label: 'Testimonials', icon: <MessageSquareQuote className="size-4" /> },
  { id: 'gallery', label: 'Gallery', icon: <ImageIcon className="size-4" /> },
  { id: 'blog', label: 'Blog', icon: <FileText className="size-4" /> },
  { id: 'videos', label: 'Videos', icon: <Video className="size-4" /> },
  { id: 'bookings', label: 'Bookings', icon: <CalendarDays className="size-4" /> },
  { id: 'inquiries', label: 'Inquiries', icon: <Mail className="size-4" /> },
  { id: 'settings', label: 'Settings', icon: <Settings className="size-4" /> },
  { id: 'deploy', label: 'Deploy', icon: <Rocket className="size-4" /> },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function formatCurrency(n: number) {
  return '₹' + n.toLocaleString('en-IN');
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function statusColor(status: string) {
  switch (status) {
    case 'active': case 'confirmed': case 'completed': case 'success': case 'replied': return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400';
    case 'pending': case 'new': case 'running': case 'read': return 'bg-amber-500/15 text-amber-600 dark:text-amber-400';
    case 'draft': case 'archived': return 'bg-gray-500/15 text-gray-600 dark:text-gray-400';
    case 'cancelled': case 'rejected': case 'failed': return 'bg-red-500/15 text-red-600 dark:text-red-400';
    case 'closed': return 'bg-blue-500/15 text-blue-600 dark:text-blue-400';
    default: return 'bg-gray-500/15 text-gray-600 dark:text-gray-400';
  }
}

const PKG_CATEGORIES = ['honeymoon', 'adventure', 'family', 'pilgrimage', 'wildlife', 'tourism', 'beach', 'hill-station'];
const HOTEL_CATEGORIES = ['luxury', 'budget', 'resort', 'boutique', 'homestay'];
const GALLERY_CATEGORIES = ['destination', 'hotel', 'adventure', 'beach', 'culture', 'food', 'nature', 'general'];
const BLOG_CATEGORIES = ['Destinations', 'Tips', 'Guides', 'News', 'Reviews'];
const VIDEO_CATEGORIES = ['destination', 'experience', 'testimonial', 'general'];
const REVIEW_CATEGORIES = ['Honeymoon', 'Adventure', 'Luxury', 'Family', 'Beach', 'Pilgrimage', 'Wildlife'];
const STATUSES = ['active', 'draft', 'archived'];
const BOOKING_STATUSES = ['pending', 'confirmed', 'completed', 'cancelled'];
const INQUIRY_STATUSES = ['new', 'read', 'replied', 'closed'];
const REGIONS = ['domestic', 'international'];
const FLIGHT_TYPES = ['one-way', 'round-trip'];

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState<Section>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Data state
  const [stats, setStats] = useState<StatsData | null>(null);
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [deployLogs, setDeployLogs] = useState<DeployLog[]>([]);

  // Loading state
  const [loading, setLoading] = useState<Record<Section, boolean>>({
    overview: false, packages: false, destinations: false, hotels: false, flights: false,
    reviews: false, testimonials: false, gallery: false, blog: false, videos: false,
    bookings: false, inquiries: false, settings: false, deploy: false,
  });

  // Search/filter
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Record<string, unknown> | null>(null);
  const [deletingItem, setDeletingItem] = useState<{ id: string; type: string } | null>(null);
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [saving, setSaving] = useState(false);
  const [deploying, setDeploying] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  // ─── DATA FETCHING ────────────────────────────────────────────────────────

  const fetchSection = useCallback(async (section: Section) => {
    setLoading(prev => ({ ...prev, [section]: true }));
    try {
      const base = '/api/dashboard';
      const portParam = 'XTransformPort=3002';
      let url = '';
      switch (section) {
        case 'overview': url = `${base}/stats`; break;
        case 'packages': url = `${base}/packages`; break;
        case 'destinations': url = `${base}/destinations`; break;
        case 'hotels': url = `${base}/hotels`; break;
        case 'flights': url = `${base}/flights`; break;
        case 'reviews': url = `${base}/reviews`; break;
        case 'testimonials': url = `${base}/testimonials`; break;
        case 'gallery': url = `${base}/gallery`; break;
        case 'blog': url = `${base}/blog`; break;
        case 'videos': url = `${base}/videos`; break;
        case 'bookings': url = `${base}/bookings`; break;
        case 'inquiries': url = `${base}/inquiries`; break;
        case 'settings': url = `${base}/settings`; break;
        case 'deploy': url = `${base}/deploy`; break;
      }
      if (searchTerm && section !== 'overview' && section !== 'settings' && section !== 'deploy') {
        url += `${url.includes('?') ? '&' : '?'}search=${encodeURIComponent(searchTerm)}`;
      }
      if (filterCategory !== 'all' && ['packages', 'hotels', 'gallery', 'blog', 'videos', 'reviews'].includes(section)) {
        url += `${url.includes('?') ? '&' : '?'}category=${filterCategory}`;
      }
      if (filterStatus !== 'all' && section !== 'overview' && section !== 'settings' && section !== 'deploy') {
        url += `${url.includes('?') ? '&' : '?'}status=${filterStatus}`;
      }
      // Add port param for mini-service
      url += `${url.includes('?') ? '&' : '?'}${portParam}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch');
      const rawData = await res.json();
      // Handle {success, data} wrapper format from API
      const data = rawData && rawData.success && rawData.data !== undefined ? rawData.data : rawData;
      switch (section) {
        case 'overview': setStats(data); break;
        case 'packages': setPackages(Array.isArray(data) ? data : []); break;
        case 'destinations': setDestinations(Array.isArray(data) ? data : []); break;
        case 'hotels': setHotels(Array.isArray(data) ? data : []); break;
        case 'flights': setFlights(Array.isArray(data) ? data : []); break;
        case 'reviews': setReviews(Array.isArray(data) ? data : []); break;
        case 'testimonials': setTestimonials(Array.isArray(data) ? data : []); break;
        case 'gallery': setGallery(Array.isArray(data) ? data : []); break;
        case 'blog': setBlogPosts(Array.isArray(data) ? data : []); break;
        case 'videos': setVideos(Array.isArray(data) ? data : []); break;
        case 'bookings': setBookings(Array.isArray(data) ? data : []); break;
        case 'inquiries': setInquiries(Array.isArray(data) ? data : []); break;
        case 'settings': {
          // Settings API returns grouped data: {appearance: [...], contact: [...], ...}
          if (data && typeof data === 'object' && !Array.isArray(data)) {
            const flat: SiteSetting[] = [];
            Object.values(data).forEach((group) => {
              if (Array.isArray(group)) flat.push(...(group as SiteSetting[]));
            });
            setSettings(flat);
          } else if (Array.isArray(data)) {
            setSettings(data);
          }
          break;
        }
        case 'deploy': setDeployLogs(Array.isArray(data) ? data : []); break;
      }
    } catch (err) {
      console.error(`Error fetching ${section}:`, err);
      toast.error(`Failed to load ${section}`);
    } finally {
      setLoading(prev => ({ ...prev, [section]: false }));
    }
  }, [searchTerm, filterCategory, filterStatus]);

  useEffect(() => {
    fetchSection(activeSection);
    setPage(1);
  }, [activeSection, fetchSection]);

  // Also fetch destinations for dropdowns
  const [allDestinations, setAllDestinations] = useState<Destination[]>([]);
  useEffect(() => {
    fetch('/api/dashboard/destinations?XTransformPort=3002').then(r => r.json()).then(d => {
      const data = d && d.success && d.data !== undefined ? d.data : d;
      setAllDestinations(Array.isArray(data) ? data : []);
    }).catch(() => {});
  }, []);

  // ─── CRUD HELPERS ─────────────────────────────────────────────────────────

  const handleSave = async () => {
    setSaving(true);
    try {
      const sectionMap: Record<string, string> = {
        packages: 'packages', destinations: 'destinations', hotels: 'hotels',
        flights: 'flights', reviews: 'reviews', testimonials: 'testimonials',
        gallery: 'gallery', blog: 'blog', videos: 'videos',
      };
      const endpoint = sectionMap[activeSection];
      if (!endpoint) return;

      const isEdit = !!editingItem;
      const url = isEdit
        ? `/api/dashboard/${endpoint}/${(editingItem as { id: string }).id}?XTransformPort=3002`
        : `/api/dashboard/${endpoint}?XTransformPort=3002`;
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Failed to save');
      toast.success(`${endpoint.slice(0, -1)} ${isEdit ? 'updated' : 'created'} successfully!`);
      setDialogOpen(false);
      setEditingItem(null);
      setFormData({});
      fetchSection(activeSection);
    } catch (err) {
      console.error('Error saving:', err);
      toast.error('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/dashboard/${deletingItem.type}/${deletingItem.id}?XTransformPort=3002`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      toast.success('Deleted successfully!');
      setDeleteDialogOpen(false);
      setDeletingItem(null);
      fetchSection(activeSection);
    } catch (err) {
      console.error('Error deleting:', err);
      toast.error('Failed to delete. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const openEditDialog = (item: Record<string, unknown>) => {
    setEditingItem(item);
    setFormData({ ...item });
    setDialogOpen(true);
  };

  const openAddDialog = (defaults: Record<string, unknown> = {}) => {
    setEditingItem(null);
    setFormData(defaults);
    setDialogOpen(true);
  };

  const openDeleteDialog = (id: string) => {
    const sectionMap: Record<string, string> = {
      packages: 'packages', destinations: 'destinations', hotels: 'hotels',
      flights: 'flights', reviews: 'reviews', testimonials: 'testimonials',
      gallery: 'gallery', blog: 'blog', videos: 'videos', bookings: 'bookings',
      inquiries: 'inquiries',
    };
    setDeletingItem({ id, type: sectionMap[activeSection] || activeSection });
    setDeleteDialogOpen(true);
  };

  const updateStatus = async (endpoint: string, id: string, status: string) => {
    try {
      const res = await fetch(`/api/dashboard/${endpoint}/${id}?XTransformPort=3002`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      toast.success('Status updated!');
      fetchSection(activeSection);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const toggleFeatured = async (endpoint: string, id: string, current: boolean) => {
    try {
      const res = await fetch(`/api/dashboard/${endpoint}/${id}?XTransformPort=3002`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !current }),
      });
      if (!res.ok) throw new Error('Failed to toggle featured');
      toast.success(`Featured ${!current ? 'enabled' : 'disabled'}`);
      fetchSection(activeSection);
    } catch {
      toast.error('Failed to toggle featured');
    }
  };

  // ─── SETTINGS SAVE ────────────────────────────────────────────────────────

  const saveSettings = async () => {
    setSaving(true);
    try {
      const updates = settings.map(s => ({ key: s.key, value: s.value }));
      const res = await fetch('/api/dashboard/settings?XTransformPort=3002', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error('Failed to save settings');
      toast.success('Settings saved successfully!');
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  // ─── DEPLOY ───────────────────────────────────────────────────────────────

  const handleDeploy = async () => {
    setDeploying(true);
    try {
      const res = await fetch('/api/dashboard/deploy?XTransformPort=3002', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'deploy', details: 'Manual deploy from dashboard' }),
      });
      if (!res.ok) throw new Error('Deploy failed');
      toast.success('Deploy triggered successfully!');
      fetchSection('deploy');
    } catch {
      toast.error('Deploy failed. Please try again.');
    } finally {
      setDeploying(false);
    }
  };

  // ─── FORM FIELD COMPONENT ────────────────────────────────────────────────

  const FormField = ({ label, name, type = 'text', options, placeholder, required = false }: {
    label: string; name: string; type?: 'text' | 'number' | 'textarea' | 'select' | 'switch'; options?: string[]; placeholder?: string; required?: boolean;
  }) => (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">{label} {required && <span className="text-red-500">*</span>}</Label>
      {type === 'textarea' ? (
        <Textarea
          value={String(formData[name] || '')}
          onChange={e => setFormData(prev => ({ ...prev, [name]: e.target.value }))}
          placeholder={placeholder}
          rows={3}
          className="resize-none"
        />
      ) : type === 'select' ? (
        <Select value={String(formData[name] || '')} onValueChange={v => setFormData(prev => ({ ...prev, [name]: v }))}>
          <SelectTrigger><SelectValue placeholder={placeholder || `Select ${label.toLowerCase()}`} /></SelectTrigger>
          <SelectContent>
            {options?.map(o => <SelectItem key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</SelectItem>)}
          </SelectContent>
        </Select>
      ) : type === 'switch' ? (
        <div className="flex items-center gap-2 pt-1">
          <Switch checked={Boolean(formData[name])} onCheckedChange={v => setFormData(prev => ({ ...prev, [name]: v }))} />
          <span className="text-sm text-muted-foreground">{formData[name] ? 'Yes' : 'No'}</span>
        </div>
      ) : (
        <Input
          type={type}
          value={String(formData[name] || '')}
          onChange={e => setFormData(prev => ({ ...prev, [name]: type === 'number' ? e.target.value : e.target.value }))}
          placeholder={placeholder}
        />
      )}
    </div>
  );

  // ─── PAGINATED DATA ───────────────────────────────────────────────────────

  const getPaginatedData = <T,>(data: T[]) => {
    const start = (page - 1) * PAGE_SIZE;
    return data.slice(start, start + PAGE_SIZE);
  };

  const totalPages = (total: number) => Math.max(1, Math.ceil(total / PAGE_SIZE));

  const PaginationControls = ({ total }: { total: number }) => {
    const tp = totalPages(total);
    return (
      <div className="flex items-center justify-between py-3">
        <p className="text-sm text-muted-foreground">
          Showing {Math.min((page - 1) * PAGE_SIZE + 1, total)}-{Math.min(page * PAGE_SIZE, total)} of {total}
        </p>
        <div className="flex gap-1">
          <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}>
            <ChevronLeft className="size-4" />
          </Button>
          <span className="flex items-center px-2 text-sm">{page} / {tp}</span>
          <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(tp, p + 1))} disabled={page >= tp}>
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    );
  };

  // ─── SEARCH BAR ────────────────────────────────────────────────────────────

  const SearchBar = () => (
    <div className="flex flex-wrap gap-3 mb-4">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>
      {['packages', 'hotels', 'gallery', 'blog', 'videos', 'reviews'].includes(activeSection) && (
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {activeSection === 'packages' && PKG_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            {activeSection === 'hotels' && HOTEL_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            {activeSection === 'gallery' && GALLERY_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            {activeSection === 'blog' && BLOG_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            {activeSection === 'videos' && VIDEO_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            {activeSection === 'reviews' && REVIEW_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      )}
      {activeSection !== 'overview' && activeSection !== 'settings' && activeSection !== 'deploy' && (
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {activeSection === 'bookings' && BOOKING_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            {activeSection === 'inquiries' && INQUIRY_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            {(!['bookings', 'inquiries'].includes(activeSection)) && STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      )}
      <Button variant="outline" size="icon" onClick={() => fetchSection(activeSection)} title="Refresh">
        <RefreshCw className="size-4" />
      </Button>
    </div>
  );

  // ─── LOADING SKELETON ──────────────────────────────────────────────────────

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      <div className="flex gap-4">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24 w-full rounded-lg" />)}
      </div>
      <Skeleton className="h-64 w-full rounded-lg" />
    </div>
  );

  // ─── IMAGE THUMBNAIL ───────────────────────────────────────────────────────

  const ImgThumb = ({ src, alt }: { src: string; alt: string }) => (
    <div className="size-10 rounded-md overflow-hidden bg-muted flex-shrink-0">
      {src ? (
        <img src={src} alt={alt} className="size-full object-cover" loading="lazy" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
      ) : (
        <div className="size-full flex items-center justify-center text-muted-foreground text-xs">N/A</div>
      )}
    </div>
  );

  // ─── RENDER SECTIONS ──────────────────────────────────────────────────────

  const renderOverview = () => {
    if (loading.overview) return <LoadingSkeleton />;
    if (!stats) return <div className="text-center py-12 text-muted-foreground">Failed to load stats</div>;

    return (
      <div className="space-y-6">
        {/* Welcome */}
        <div>
          <h2 className="text-2xl font-bold">Welcome to Wayfare Dashboard</h2>
          <p className="text-muted-foreground mt-1">Manage your travel business from one place.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: 'Packages', value: stats.counts.packages, icon: <Package className="size-5" />, color: 'text-teal-600' },
            { label: 'Destinations', value: stats.counts.destinations, icon: <Globe className="size-5" />, color: 'text-blue-600' },
            { label: 'Hotels', value: stats.counts.hotels, icon: <Hotel className="size-5" />, color: 'text-purple-600' },
            { label: 'Bookings', value: stats.counts.bookings, icon: <CalendarDays className="size-5" />, color: 'text-amber-600' },
            { label: 'Revenue', value: formatCurrency(stats.highlights.revenue), icon: <DollarSign className="size-5" />, color: 'text-emerald-600' },
            { label: 'Inquiries', value: stats.counts.inquiries, icon: <Mail className="size-5" />, color: 'text-rose-600' },
          ].map(stat => (
            <Card key={stat.label}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={stat.color}>{stat.icon}</div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Highlight Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Active Packages', value: stats.highlights.activePackages, icon: <TrendingUp className="size-4" /> },
            { label: 'Pending Bookings', value: stats.highlights.pendingBookings, icon: <Clock className="size-4" /> },
            { label: 'New Inquiries', value: stats.highlights.newInquiries, icon: <AlertCircle className="size-4" /> },
            { label: 'Pending Reviews', value: stats.highlights.pendingReviews, icon: <Eye className="size-4" /> },
          ].map(h => (
            <Card key={h.label}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted">{h.icon}</div>
                <div>
                  <p className="text-lg font-bold">{h.value}</p>
                  <p className="text-xs text-muted-foreground">{h.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Recent Bookings */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Recent Bookings</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Package</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.recentBookings.map(b => (
                    <TableRow key={b.id}>
                      <TableCell className="font-medium text-sm">{b.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{b.packageName}</TableCell>
                      <TableCell><Badge variant="secondary" className={statusColor(b.status)}>{b.status}</Badge></TableCell>
                    </TableRow>
                  ))}
                  {stats.recentBookings.length === 0 && (
                    <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground py-6">No bookings yet</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Recent Inquiries */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Recent Inquiries</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.recentInquiries.map(i => (
                    <TableRow key={i.id}>
                      <TableCell className="font-medium text-sm">{i.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground capitalize">{i.type}</TableCell>
                      <TableCell><Badge variant="secondary" className={statusColor(i.status)}>{i.status}</Badge></TableCell>
                    </TableRow>
                  ))}
                  {stats.recentInquiries.length === 0 && (
                    <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground py-6">No inquiries yet</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button onClick={() => { setActiveSection('packages'); setTimeout(() => openAddDialog({ status: 'draft', featured: false }), 300); }}>
              <Plus className="size-4 mr-2" /> Add Package
            </Button>
            <Button variant="outline" onClick={() => { setActiveSection('destinations'); setTimeout(() => openAddDialog({ status: 'draft', featured: false, region: 'domestic' }), 300); }}>
              <Plus className="size-4 mr-2" /> Add Destination
            </Button>
            <Button variant="outline" onClick={() => { setActiveSection('deploy'); }}>
              <Rocket className="size-4 mr-2" /> Deploy Changes
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  };

  // ─── PACKAGES SECTION ─────────────────────────────────────────────────────

  const renderPackages = () => {
    if (loading.packages) return <LoadingSkeleton />;
    const data = getPaginatedData(packages);
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Packages</h2>
          <Button onClick={() => openAddDialog({ status: 'draft', featured: false })}><Plus className="size-4 mr-2" /> Add Package</Button>
        </div>
        <SearchBar />
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Destination</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="hidden sm:table-cell">Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden sm:table-cell">Featured</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map(pkg => (
                <TableRow key={pkg.id}>
                  <TableCell><ImgThumb src={pkg.image} alt={pkg.name} /></TableCell>
                  <TableCell className="font-medium">{pkg.name}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">{pkg.destination?.name || '—'}</TableCell>
                  <TableCell className="hidden md:table-cell"><Badge variant="outline" className="capitalize text-xs">{pkg.category}</Badge></TableCell>
                  <TableCell>{formatCurrency(pkg.price)}</TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground">{pkg.duration}</TableCell>
                  <TableCell><Badge variant="secondary" className={statusColor(pkg.status)}>{pkg.status}</Badge></TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Switch checked={pkg.featured} onCheckedChange={() => toggleFeatured('packages', pkg.id, pkg.featured)} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="size-8" onClick={() => openEditDialog(pkg as unknown as Record<string, unknown>)} title="Edit"><Pencil className="size-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="size-8 text-destructive" onClick={() => openDeleteDialog(pkg.id)} title="Delete"><Trash2 className="size-3.5" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {data.length === 0 && <TableRow><TableCell colSpan={9} className="text-center py-8 text-muted-foreground">No packages found</TableCell></TableRow>}
            </TableBody>
          </Table>
        </div>
        <PaginationControls total={packages.length} />
      </div>
    );
  };

  // ─── DESTINATIONS SECTION ─────────────────────────────────────────────────

  const renderDestinations = () => {
    if (loading.destinations) return <LoadingSkeleton />;
    const data = getPaginatedData(destinations);
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Destinations</h2>
          <Button onClick={() => openAddDialog({ status: 'draft', featured: false, region: 'domestic' })}><Plus className="size-4 mr-2" /> Add Destination</Button>
        </div>
        <SearchBar />
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Country</TableHead>
                <TableHead className="hidden md:table-cell">Region</TableHead>
                <TableHead className="hidden sm:table-cell">Featured</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map(d => (
                <TableRow key={d.id}>
                  <TableCell><ImgThumb src={d.image} alt={d.name} /></TableCell>
                  <TableCell className="font-medium">{d.name}</TableCell>
                  <TableCell className="text-muted-foreground">{d.country}</TableCell>
                  <TableCell className="hidden md:table-cell"><Badge variant="outline" className="capitalize text-xs">{d.region}</Badge></TableCell>
                  <TableCell className="hidden sm:table-cell"><Switch checked={d.featured} onCheckedChange={() => toggleFeatured('destinations', d.id, d.featured)} /></TableCell>
                  <TableCell><Badge variant="secondary" className={statusColor(d.status)}>{d.status}</Badge></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="size-8" onClick={() => openEditDialog(d as unknown as Record<string, unknown>)}><Pencil className="size-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="size-8 text-destructive" onClick={() => openDeleteDialog(d.id)}><Trash2 className="size-3.5" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {data.length === 0 && <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No destinations found</TableCell></TableRow>}
            </TableBody>
          </Table>
        </div>
        <PaginationControls total={destinations.length} />
      </div>
    );
  };

  // ─── HOTELS SECTION ───────────────────────────────────────────────────────

  const renderHotels = () => {
    if (loading.hotels) return <LoadingSkeleton />;
    const data = getPaginatedData(hotels);
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Hotels</h2>
          <Button onClick={() => openAddDialog({ status: 'draft', featured: false, stars: 3, category: 'boutique' })}><Plus className="size-4 mr-2" /> Add Hotel</Button>
        </div>
        <SearchBar />
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Destination</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead>Stars</TableHead>
                <TableHead>Price/Night</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden sm:table-cell">Featured</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map(h => (
                <TableRow key={h.id}>
                  <TableCell><ImgThumb src={h.image} alt={h.name} /></TableCell>
                  <TableCell className="font-medium">{h.name}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">{h.destination?.name || '—'}</TableCell>
                  <TableCell className="hidden md:table-cell"><Badge variant="outline" className="capitalize text-xs">{h.category}</Badge></TableCell>
                  <TableCell>{'★'.repeat(h.stars)}</TableCell>
                  <TableCell>{formatCurrency(h.pricePerNight)}</TableCell>
                  <TableCell><Badge variant="secondary" className={statusColor(h.status)}>{h.status}</Badge></TableCell>
                  <TableCell className="hidden sm:table-cell"><Switch checked={h.featured} onCheckedChange={() => toggleFeatured('hotels', h.id, h.featured)} /></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="size-8" onClick={() => openEditDialog(h as unknown as Record<string, unknown>)}><Pencil className="size-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="size-8 text-destructive" onClick={() => openDeleteDialog(h.id)}><Trash2 className="size-3.5" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {data.length === 0 && <TableRow><TableCell colSpan={9} className="text-center py-8 text-muted-foreground">No hotels found</TableCell></TableRow>}
            </TableBody>
          </Table>
        </div>
        <PaginationControls total={hotels.length} />
      </div>
    );
  };

  // ─── FLIGHTS SECTION ──────────────────────────────────────────────────────

  const renderFlights = () => {
    if (loading.flights) return <LoadingSkeleton />;
    const data = getPaginatedData(flights);
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Flight Deals</h2>
          <Button onClick={() => openAddDialog({ status: 'draft', featured: false, type: 'one-way' })}><Plus className="size-4 mr-2" /> Add Flight</Button>
        </div>
        <SearchBar />
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead className="hidden md:table-cell">Airline</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="hidden sm:table-cell">Type</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map(f => (
                <TableRow key={f.id}>
                  <TableCell className="font-medium">{f.from}</TableCell>
                  <TableCell>{f.to}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">{f.airline}</TableCell>
                  <TableCell>{formatCurrency(f.price)}</TableCell>
                  <TableCell className="hidden sm:table-cell"><Badge variant="outline" className="capitalize text-xs">{f.type}</Badge></TableCell>
                  <TableCell><Switch checked={f.featured} onCheckedChange={() => toggleFeatured('flights', f.id, f.featured)} /></TableCell>
                  <TableCell><Badge variant="secondary" className={statusColor(f.status)}>{f.status}</Badge></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="size-8" onClick={() => openEditDialog(f as unknown as Record<string, unknown>)}><Pencil className="size-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="size-8 text-destructive" onClick={() => openDeleteDialog(f.id)}><Trash2 className="size-3.5" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {data.length === 0 && <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No flights found</TableCell></TableRow>}
            </TableBody>
          </Table>
        </div>
        <PaginationControls total={flights.length} />
      </div>
    );
  };

  // ─── REVIEWS SECTION ──────────────────────────────────────────────────────

  const renderReviews = () => {
    if (loading.reviews) return <LoadingSkeleton />;
    const data = getPaginatedData(reviews);
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Reviews</h2>
          <Button onClick={() => openAddDialog({ status: 'pending', rating: 5, verified: false })}><Plus className="size-4 mr-2" /> Add Review</Button>
        </div>
        <SearchBar />
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Destination</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead className="hidden sm:table-cell">Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map(r => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">{r.destination?.name || r.package?.name || '—'}</TableCell>
                  <TableCell>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</TableCell>
                  <TableCell className="hidden sm:table-cell"><Badge variant="outline" className="text-xs">{r.category || '—'}</Badge></TableCell>
                  <TableCell><Badge variant="secondary" className={statusColor(r.status)}>{r.status}</Badge></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {r.status === 'pending' && (
                        <>
                          <Button variant="ghost" size="icon" className="size-8 text-emerald-600" onClick={() => updateStatus('reviews', r.id, 'active')} title="Approve"><CheckCircle2 className="size-3.5" /></Button>
                          <Button variant="ghost" size="icon" className="size-8 text-red-600" onClick={() => updateStatus('reviews', r.id, 'rejected')} title="Reject"><XCircle className="size-3.5" /></Button>
                        </>
                      )}
                      <Button variant="ghost" size="icon" className="size-8" onClick={() => openEditDialog(r as unknown as Record<string, unknown>)}><Pencil className="size-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="size-8 text-destructive" onClick={() => openDeleteDialog(r.id)}><Trash2 className="size-3.5" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {data.length === 0 && <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No reviews found</TableCell></TableRow>}
            </TableBody>
          </Table>
        </div>
        <PaginationControls total={reviews.length} />
      </div>
    );
  };

  // ─── TESTIMONIALS SECTION ─────────────────────────────────────────────────

  const renderTestimonials = () => {
    if (loading.testimonials) return <LoadingSkeleton />;
    const data = getPaginatedData(testimonials);
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Testimonials</h2>
          <Button onClick={() => openAddDialog({ status: 'active', featured: false, verified: false, rating: 5 })}><Plus className="size-4 mr-2" /> Add Testimonial</Button>
        </div>
        <SearchBar />
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Trip</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead className="hidden sm:table-cell">Text</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map(t => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.name}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">{t.trip}</TableCell>
                  <TableCell>{'★'.repeat(t.rating)}</TableCell>
                  <TableCell className="hidden sm:table-cell max-w-[200px] truncate text-muted-foreground">{t.text}</TableCell>
                  <TableCell><Switch checked={t.featured} onCheckedChange={() => toggleFeatured('testimonials', t.id, t.featured)} /></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="size-8" onClick={() => openEditDialog(t as unknown as Record<string, unknown>)}><Pencil className="size-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="size-8 text-destructive" onClick={() => openDeleteDialog(t.id)}><Trash2 className="size-3.5" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {data.length === 0 && <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No testimonials found</TableCell></TableRow>}
            </TableBody>
          </Table>
        </div>
        <PaginationControls total={testimonials.length} />
      </div>
    );
  };

  // ─── GALLERY SECTION ──────────────────────────────────────────────────────

  const renderGallery = () => {
    if (loading.gallery) return <LoadingSkeleton />;
    const data = getPaginatedData(gallery);
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Gallery</h2>
          <Button onClick={() => openAddDialog({ status: 'active', featured: false, category: 'general' })}><Plus className="size-4 mr-2" /> Add Image</Button>
        </div>
        <SearchBar />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {data.map(img => (
            <Card key={img.id} className="group overflow-hidden">
              <div className="aspect-square relative overflow-hidden">
                {img.image ? (
                  <img src={img.image} alt={img.title} className="size-full object-cover group-hover:scale-105 transition-transform" loading="lazy" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                ) : (
                  <div className="size-full bg-muted flex items-center justify-center"><ImageIcon className="size-8 text-muted-foreground" /></div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button variant="secondary" size="icon" className="size-8" onClick={() => openEditDialog(img as unknown as Record<string, unknown>)}><Pencil className="size-3.5" /></Button>
                  <Button variant="destructive" size="icon" className="size-8" onClick={() => openDeleteDialog(img.id)}><Trash2 className="size-3.5" /></Button>
                </div>
                {img.featured && <Badge className="absolute top-2 left-2 text-[10px]">Featured</Badge>}
              </div>
              <CardContent className="p-2">
                <p className="text-sm font-medium truncate">{img.title}</p>
                <Badge variant="outline" className="text-[10px] mt-1 capitalize">{img.category}</Badge>
              </CardContent>
            </Card>
          ))}
          {data.length === 0 && <div className="col-span-full text-center py-12 text-muted-foreground">No images found</div>}
        </div>
        <PaginationControls total={gallery.length} />
      </div>
    );
  };

  // ─── BLOG SECTION ─────────────────────────────────────────────────────────

  const renderBlog = () => {
    if (loading.blog) return <LoadingSkeleton />;
    const data = getPaginatedData(blogPosts);
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Blog Posts</h2>
          <Button onClick={() => openAddDialog({ status: 'draft', featured: false, category: 'Destinations' })}><Plus className="size-4 mr-2" /> Add Post</Button>
        </div>
        <SearchBar />
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead className="hidden sm:table-cell">Date</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map(p => (
                <TableRow key={p.id}>
                  <TableCell><ImgThumb src={p.image} alt={p.title} /></TableCell>
                  <TableCell className="font-medium max-w-[200px] truncate">{p.title}</TableCell>
                  <TableCell className="hidden md:table-cell"><Badge variant="outline" className="text-xs">{p.category}</Badge></TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground">{p.date}</TableCell>
                  <TableCell><Switch checked={p.featured} onCheckedChange={() => toggleFeatured('blog', p.id, p.featured)} /></TableCell>
                  <TableCell><Badge variant="secondary" className={statusColor(p.status)}>{p.status}</Badge></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="size-8" onClick={() => openEditDialog(p as unknown as Record<string, unknown>)}><Pencil className="size-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="size-8 text-destructive" onClick={() => openDeleteDialog(p.id)}><Trash2 className="size-3.5" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {data.length === 0 && <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No blog posts found</TableCell></TableRow>}
            </TableBody>
          </Table>
        </div>
        <PaginationControls total={blogPosts.length} />
      </div>
    );
  };

  // ─── VIDEOS SECTION ───────────────────────────────────────────────────────

  const renderVideos = () => {
    if (loading.videos) return <LoadingSkeleton />;
    const data = getPaginatedData(videos);
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Videos</h2>
          <Button onClick={() => openAddDialog({ status: 'draft', featured: false, category: 'general' })}><Plus className="size-4 mr-2" /> Add Video</Button>
        </div>
        <SearchBar />
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">Thumb</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map(v => (
                <TableRow key={v.id}>
                  <TableCell><ImgThumb src={v.thumbnail} alt={v.title} /></TableCell>
                  <TableCell className="font-medium">{v.title}</TableCell>
                  <TableCell className="hidden md:table-cell"><Badge variant="outline" className="capitalize text-xs">{v.category}</Badge></TableCell>
                  <TableCell><Switch checked={v.featured} onCheckedChange={() => toggleFeatured('videos', v.id, v.featured)} /></TableCell>
                  <TableCell><Badge variant="secondary" className={statusColor(v.status)}>{v.status}</Badge></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="size-8" onClick={() => openEditDialog(v as unknown as Record<string, unknown>)}><Pencil className="size-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="size-8 text-destructive" onClick={() => openDeleteDialog(v.id)}><Trash2 className="size-3.5" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {data.length === 0 && <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No videos found</TableCell></TableRow>}
            </TableBody>
          </Table>
        </div>
        <PaginationControls total={videos.length} />
      </div>
    );
  };

  // ─── BOOKINGS SECTION ─────────────────────────────────────────────────────

  const renderBookings = () => {
    if (loading.bookings) return <LoadingSkeleton />;
    const data = getPaginatedData(bookings);
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Bookings</h2>
          <Button variant="outline" onClick={() => fetchSection('bookings')}><RefreshCw className="size-4 mr-2" /> Refresh</Button>
        </div>
        <SearchBar />
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Package</TableHead>
                <TableHead className="hidden sm:table-cell">Travelers</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map(b => (
                <TableRow key={b.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{b.name}</p>
                      <p className="text-xs text-muted-foreground">{b.email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">{b.package?.name || 'N/A'}</TableCell>
                  <TableCell className="hidden sm:table-cell">{b.travelers}</TableCell>
                  <TableCell>{formatCurrency(b.totalPrice)}</TableCell>
                  <TableCell>
                    <Select value={b.status} onValueChange={v => updateStatus('bookings', b.id, v)}>
                      <SelectTrigger className="w-[120px] h-7 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {BOOKING_STATUSES.map(s => <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">{formatDate(b.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="size-8 text-destructive" onClick={() => openDeleteDialog(b.id)}><Trash2 className="size-3.5" /></Button>
                  </TableCell>
                </TableRow>
              ))}
              {data.length === 0 && <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No bookings found</TableCell></TableRow>}
            </TableBody>
          </Table>
        </div>
        <PaginationControls total={bookings.length} />
      </div>
    );
  };

  // ─── INQUIRIES SECTION ────────────────────────────────────────────────────

  const renderInquiries = () => {
    if (loading.inquiries) return <LoadingSkeleton />;
    const data = getPaginatedData(inquiries);
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Inquiries</h2>
          <Button variant="outline" onClick={() => fetchSection('inquiries')}><RefreshCw className="size-4 mr-2" /> Refresh</Button>
        </div>
        <SearchBar />
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Type</TableHead>
                <TableHead className="hidden sm:table-cell">Message</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map(i => (
                <TableRow key={i.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{i.name}</p>
                      <p className="text-xs text-muted-foreground">{i.email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell"><Badge variant="outline" className="capitalize text-xs">{i.type}</Badge></TableCell>
                  <TableCell className="hidden sm:table-cell max-w-[200px] truncate text-muted-foreground">{i.message}</TableCell>
                  <TableCell>
                    <Select value={i.status} onValueChange={v => updateStatus('inquiries', i.id, v)}>
                      <SelectTrigger className="w-[110px] h-7 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {INQUIRY_STATUSES.map(s => <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">{formatDate(i.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="size-8 text-destructive" onClick={() => openDeleteDialog(i.id)}><Trash2 className="size-3.5" /></Button>
                  </TableCell>
                </TableRow>
              ))}
              {data.length === 0 && <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No inquiries found</TableCell></TableRow>}
            </TableBody>
          </Table>
        </div>
        <PaginationControls total={inquiries.length} />
      </div>
    );
  };

  // ─── SETTINGS SECTION ─────────────────────────────────────────────────────

  const renderSettings = () => {
    if (loading.settings) return <LoadingSkeleton />;
    const groups = [...new Set(settings.map(s => s.group))];
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Site Settings</h2>
          <Button onClick={saveSettings} disabled={saving}>{saving && <Loader2 className="size-4 mr-2 animate-spin" />} Save Settings</Button>
        </div>
        {groups.map(group => (
          <Card key={group}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base capitalize">{group}</CardTitle>
              <CardDescription>Manage {group} settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {settings.filter(s => s.group === group).map(s => (
                <div key={s.id} className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-2 items-start">
                  <Label className="text-sm font-medium pt-2">{s.label || s.key}</Label>
                  {s.type === 'boolean' ? (
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={s.value === 'true'}
                        onCheckedChange={v => setSettings(prev => prev.map(ps => ps.id === s.id ? { ...ps, value: String(v) } : ps))}
                      />
                      <span className="text-sm text-muted-foreground">{s.value === 'true' ? 'Enabled' : 'Disabled'}</span>
                    </div>
                  ) : s.type === 'json' ? (
                    <Textarea
                      value={s.value}
                      onChange={e => setSettings(prev => prev.map(ps => ps.id === s.id ? { ...ps, value: e.target.value } : ps))}
                      rows={4}
                      className="font-mono text-sm"
                    />
                  ) : (
                    <Input
                      value={s.value}
                      onChange={e => setSettings(prev => prev.map(ps => ps.id === s.id ? { ...ps, value: e.target.value } : ps))}
                      type={s.type === 'number' ? 'number' : 'text'}
                    />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  // ─── DEPLOY SECTION ───────────────────────────────────────────────────────

  const renderDeploy = () => {
    if (loading.deploy) return <LoadingSkeleton />;
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Deploy</h2>
        </div>
        <Card>
          <CardContent className="p-8 text-center space-y-4">
            <div className="inline-flex items-center justify-center size-20 rounded-full bg-teal-500/10">
              <Rocket className="size-10 text-teal-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Deploy Your Changes</h3>
              <p className="text-muted-foreground mt-1">Push all changes to the live website.</p>
            </div>
            <Button size="lg" className="px-8" onClick={handleDeploy} disabled={deploying}>
              {deploying ? <Loader2 className="size-5 mr-2 animate-spin" /> : <Rocket className="size-5 mr-2" />}
              Deploy Changes
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Deploy History</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Triggered By</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deployLogs.map(l => (
                  <TableRow key={l.id}>
                    <TableCell className="font-medium capitalize">{l.action}</TableCell>
                    <TableCell className="text-muted-foreground">{l.details || '—'}</TableCell>
                    <TableCell><Badge variant="secondary" className={statusColor(l.status)}>{l.status}</Badge></TableCell>
                    <TableCell>{l.triggeredBy}</TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(l.createdAt)}</TableCell>
                  </TableRow>
                ))}
                {deployLogs.length === 0 && <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No deploy history</TableCell></TableRow>}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  };

  // ─── FORM DIALOGS ─────────────────────────────────────────────────────────

  const renderFormDialog = () => {
    const sectionTitles: Record<string, string> = {
      packages: 'Package', destinations: 'Destination', hotels: 'Hotel',
      flights: 'Flight Deal', reviews: 'Review', testimonials: 'Testimonial',
      gallery: 'Gallery Image', blog: 'Blog Post', videos: 'Video',
    };
    const title = editingItem ? `Edit ${sectionTitles[activeSection]}` : `Add ${sectionTitles[activeSection]}`;

    const renderFormFields = () => {
      switch (activeSection) {
        case 'packages':
          return (
            <div className="grid gap-4 py-2 max-h-[60vh] overflow-y-auto pr-2">
              <FormField label="Name" name="name" required placeholder="e.g. Kerala Backwaters Tour" />
              <FormField label="Slug" name="slug" placeholder="Auto-generated from name" />
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Destination</Label>
                <Select value={String(formData.destinationId || '')} onValueChange={v => setFormData(prev => ({ ...prev, destinationId: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select destination" /></SelectTrigger>
                  <SelectContent>
                    {allDestinations.map(d => <SelectItem key={d.id} value={d.id}>{d.name} ({d.country})</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <FormField label="Category" name="category" type="select" options={PKG_CATEGORIES} />
              <FormField label="Duration" name="duration" placeholder="e.g. 5N6D" />
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Price (₹)" name="price" type="number" required />
                <FormField label="Original Price (₹)" name="originalPrice" type="number" />
              </div>
              <FormField label="Image URL" name="image" placeholder="https://..." />
              <FormField label="Description" name="description" type="textarea" />
              <FormField label="Highlights (comma separated)" name="highlights" type="textarea" placeholder="Backwater cruise, Houseboat stay..." />
              <FormField label="Included (comma separated)" name="included" type="textarea" placeholder="Accommodation, Meals, Transport..." />
              <div className="flex items-center gap-6">
                <FormField label="Featured" name="featured" type="switch" />
                <FormField label="Status" name="status" type="select" options={STATUSES} />
              </div>
            </div>
          );
        case 'destinations':
          return (
            <div className="grid gap-4 py-2 max-h-[60vh] overflow-y-auto pr-2">
              <FormField label="Name" name="name" required placeholder="e.g. Kerala" />
              <FormField label="Slug" name="slug" placeholder="Auto-generated from name" />
              <FormField label="Country" name="country" required placeholder="e.g. India" />
              <FormField label="Region" name="region" type="select" options={REGIONS} />
              <FormField label="Image URL" name="image" placeholder="https://..." />
              <FormField label="Tagline" name="tagline" placeholder="e.g. God's Own Country" />
              <FormField label="Description" name="description" type="textarea" />
              <div className="flex items-center gap-6">
                <FormField label="Featured" name="featured" type="switch" />
                <FormField label="Status" name="status" type="select" options={STATUSES} />
              </div>
            </div>
          );
        case 'hotels':
          return (
            <div className="grid gap-4 py-2 max-h-[60vh] overflow-y-auto pr-2">
              <FormField label="Name" name="name" required placeholder="e.g. Taj Malabar" />
              <FormField label="Slug" name="slug" placeholder="Auto-generated from name" />
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Destination</Label>
                <Select value={String(formData.destinationId || '')} onValueChange={v => setFormData(prev => ({ ...prev, destinationId: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select destination" /></SelectTrigger>
                  <SelectContent>
                    {allDestinations.map(d => <SelectItem key={d.id} value={d.id}>{d.name} ({d.country})</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <FormField label="Category" name="category" type="select" options={HOTEL_CATEGORIES} />
              <FormField label="Stars (1-5)" name="stars" type="number" />
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Price/Night (₹)" name="pricePerNight" type="number" required />
                <FormField label="Original Price (₹)" name="originalPrice" type="number" />
              </div>
              <FormField label="Image URL" name="image" placeholder="https://..." />
              <FormField label="Description" name="description" type="textarea" />
              <FormField label="Amenities (comma separated)" name="amenities" type="textarea" placeholder="WiFi, Pool, Spa..." />
              <div className="flex items-center gap-6">
                <FormField label="Featured" name="featured" type="switch" />
                <FormField label="Status" name="status" type="select" options={STATUSES} />
              </div>
            </div>
          );
        case 'flights':
          return (
            <div className="grid gap-4 py-2 max-h-[60vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-2 gap-4">
                <FormField label="From" name="from" required placeholder="e.g. Mumbai" />
                <FormField label="To" name="to" required placeholder="e.g. Dubai" />
              </div>
              <FormField label="Airline" name="airline" placeholder="e.g. Emirates" />
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Price (₹)" name="price" type="number" required />
                <FormField label="Original Price (₹)" name="originalPrice" type="number" />
              </div>
              <FormField label="Type" name="type" type="select" options={FLIGHT_TYPES} />
              <FormField label="Image URL" name="image" placeholder="https://..." />
              <FormField label="Description" name="description" type="textarea" />
              <div className="flex items-center gap-6">
                <FormField label="Featured" name="featured" type="switch" />
                <FormField label="Status" name="status" type="select" options={STATUSES} />
              </div>
            </div>
          );
        case 'reviews':
          return (
            <div className="grid gap-4 py-2 max-h-[60vh] overflow-y-auto pr-2">
              <FormField label="Name" name="name" required placeholder="Reviewer name" />
              <FormField label="Avatar" name="avatar" placeholder="Emoji or initials" />
              <FormField label="Location" name="location" placeholder="e.g. Mumbai, India" />
              <FormField label="Rating (1-5)" name="rating" type="number" />
              <FormField label="Title" name="title" placeholder="Review title" />
              <FormField label="Review Text" name="text" type="textarea" required />
              <FormField label="Category" name="category" type="select" options={REVIEW_CATEGORIES} />
              <div className="flex items-center gap-6">
                <FormField label="Verified" name="verified" type="switch" />
                <FormField label="Status" name="status" type="select" options={['pending', 'active', 'rejected']} />
              </div>
            </div>
          );
        case 'testimonials':
          return (
            <div className="grid gap-4 py-2 max-h-[60vh] overflow-y-auto pr-2">
              <FormField label="Name" name="name" required />
              <FormField label="Location" name="location" placeholder="e.g. Delhi, India" />
              <FormField label="Trip" name="trip" placeholder="e.g. Kerala Backwaters Tour" />
              <FormField label="Rating (1-5)" name="rating" type="number" />
              <FormField label="Testimonial Text" name="text" type="textarea" required />
              <FormField label="Avatar" name="avatar" placeholder="Emoji or initials" />
              <FormField label="Happy Note" name="happyNote" placeholder="Short happy note" />
              <div className="flex items-center gap-6">
                <FormField label="Verified" name="verified" type="switch" />
                <FormField label="Featured" name="featured" type="switch" />
                <FormField label="Status" name="status" type="select" options={STATUSES} />
              </div>
            </div>
          );
        case 'gallery':
          return (
            <div className="grid gap-4 py-2 max-h-[60vh] overflow-y-auto pr-2">
              <FormField label="Title" name="title" required placeholder="e.g. Kerala Backwaters Sunset" />
              <FormField label="Image URL" name="image" required placeholder="https://..." />
              <FormField label="Caption" name="caption" placeholder="Image caption" />
              <FormField label="Category" name="category" type="select" options={GALLERY_CATEGORIES} />
              <div className="flex items-center gap-6">
                <FormField label="Featured" name="featured" type="switch" />
                <FormField label="Status" name="status" type="select" options={STATUSES} />
              </div>
            </div>
          );
        case 'blog':
          return (
            <div className="grid gap-4 py-2 max-h-[60vh] overflow-y-auto pr-2">
              <FormField label="Title" name="title" required placeholder="Blog post title" />
              <FormField label="Slug" name="slug" placeholder="Auto-generated from title" />
              <FormField label="Excerpt" name="excerpt" type="textarea" placeholder="Brief summary..." />
              <FormField label="Content (HTML)" name="content" type="textarea" placeholder="Full article content..." />
              <FormField label="Author Name" name="authorName" placeholder="Wayfare Team" />
              <FormField label="Date" name="date" placeholder="2025-01-15" />
              <FormField label="Category" name="category" type="select" options={BLOG_CATEGORIES} />
              <FormField label="Image URL" name="image" placeholder="https://..." />
              <FormField label="Reading Time" name="readingTime" placeholder="5 min read" />
              <FormField label="Tags (comma separated)" name="tags" type="textarea" placeholder="travel, kerala, honeymoon" />
              <div className="flex items-center gap-6">
                <FormField label="Featured" name="featured" type="switch" />
                <FormField label="Status" name="status" type="select" options={STATUSES} />
              </div>
            </div>
          );
        case 'videos':
          return (
            <div className="grid gap-4 py-2 max-h-[60vh] overflow-y-auto pr-2">
              <FormField label="Title" name="title" required placeholder="Video title" />
              <FormField label="Video URL" name="url" required placeholder="YouTube/Vimeo embed URL" />
              <FormField label="Thumbnail URL" name="thumbnail" placeholder="https://..." />
              <FormField label="Description" name="description" type="textarea" />
              <FormField label="Category" name="category" type="select" options={VIDEO_CATEGORIES} />
              <div className="flex items-center gap-6">
                <FormField label="Featured" name="featured" type="switch" />
                <FormField label="Status" name="status" type="select" options={STATUSES} />
              </div>
            </div>
          );
        default:
          return <p className="text-muted-foreground py-4">No form available for this section.</p>;
      }
    };

    return (
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>Fill in the details below.</DialogDescription>
          </DialogHeader>
          {renderFormFields()}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="size-4 mr-2 animate-spin" />}
              {editingItem ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  // ─── DELETE DIALOG ────────────────────────────────────────────────────────

  const renderDeleteDialog = () => (
    <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone. This will permanently delete the item from the database.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            {saving ? <Loader2 className="size-4 mr-2 animate-spin" /> : null}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  // ─── SIDEBAR ──────────────────────────────────────────────────────────────

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b flex items-center gap-3">
        <div className="size-9 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold text-lg">W</div>
        {!sidebarCollapsed && <div><h1 className="font-bold text-sm">Wayfare</h1><p className="text-xs text-muted-foreground">Admin Dashboard</p></div>}
      </div>
      <ScrollArea className="flex-1">
        <nav className="p-2 space-y-1">
          {NAV_ITEMS.map(item => (
            <TooltipProvider key={item.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => { setActiveSection(item.id); setSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      activeSection === item.id
                        ? 'bg-teal-600 text-white'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    } ${sidebarCollapsed ? 'justify-center' : ''}`}
                  >
                    {item.icon}
                    {!sidebarCollapsed && <span>{item.label}</span>}
                  </button>
                </TooltipTrigger>
                {sidebarCollapsed && <TooltipContent side="right">{item.label}</TooltipContent>}
              </Tooltip>
            </TooltipProvider>
          ))}
        </nav>
      </ScrollArea>
      <div className="p-3 border-t">
        <Button variant="ghost" size="sm" className="w-full" asChild>
          <a href="/"><ExternalLink className="size-4 mr-2" /> View Site</a>
        </Button>
      </div>
    </div>
  );

  // ─── RENDER SECTION ───────────────────────────────────────────────────────

  const renderSection = () => {
    switch (activeSection) {
      case 'overview': return renderOverview();
      case 'packages': return renderPackages();
      case 'destinations': return renderDestinations();
      case 'hotels': return renderHotels();
      case 'flights': return renderFlights();
      case 'reviews': return renderReviews();
      case 'testimonials': return renderTestimonials();
      case 'gallery': return renderGallery();
      case 'blog': return renderBlog();
      case 'videos': return renderVideos();
      case 'bookings': return renderBookings();
      case 'inquiries': return renderInquiries();
      case 'settings': return renderSettings();
      case 'deploy': return renderDeploy();
    }
  };

  // ─── MAIN RENDER ──────────────────────────────────────────────────────────

  return (
    <div className="fixed inset-0 z-50 flex bg-background">
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col border-r bg-card transition-all duration-200 ${sidebarCollapsed ? 'w-16' : 'w-60'}`}>
        <SidebarContent />
        <div className="p-2 border-t">
          <Button
            variant="ghost"
            size="icon"
            className="w-full"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
          </Button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-60 p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden flex flex-col">
        {/* Top Bar */}
        <header className="h-14 border-b bg-card flex items-center gap-4 px-4 shrink-0">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="size-5" />
          </Button>
          <h2 className="font-semibold capitalize">{activeSection === 'overview' ? 'Dashboard Overview' : activeSection}</h2>
          <div className="ml-auto flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">Admin</Badge>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6 max-w-[1400px] mx-auto">
            {renderSection()}
          </div>
        </div>
      </main>

      {/* Dialogs */}
      {renderFormDialog()}
      {renderDeleteDialog()}
    </div>
  );
}
