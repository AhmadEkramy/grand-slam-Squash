import { collection, DocumentData, onSnapshot, QuerySnapshot } from 'firebase/firestore';
import { BarChart3, Calendar, Check, DollarSign, Edit, Filter, Home, LogOut, Megaphone, Package, Plus, Search, Trash2, Trophy, User, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { db } from '../config/firebase';
import { useLanguage } from '../contexts/LanguageContext';
import { toast } from '../hooks/use-toast';
import { useAdvertisements } from '../hooks/useAdvertisements';
import { useAuth } from '../hooks/useAuth';
import { useBookings, useTrainingCards } from '../hooks/useBookings';
import { useChampionships } from '../hooks/useChampionships';
import { useProducts } from '../hooks/useProducts';
import { Advertisement, Championship, Product, TrainingCard } from '../types';
import AddAdvertisementForm from './AddAdvertisementForm';
import AddChampionshipForm from './AddChampionshipForm';
import AddProductForm from './AddProductForm';
import EditAdvertisementForm from './EditAdvertisementForm';
import EditChampionshipForm from './EditChampionshipForm';
import EditProductForm from './EditProductForm';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface AdminDashboardProps {
  onNavigateHome: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateHome }) => {
  const { t } = useLanguage();
  const { logout } = useAuth();
  const { bookings, updateBooking, deleteBooking, loading } = useBookings();
  const { championships, deleteChampionship, loading: championshipsLoading } = useChampionships();
  const { products, deleteProduct, loading: productsLoading } = useProducts();
  const { advertisements, deleteAdvertisement, loading: advertisementsLoading } = useAdvertisements();
  const { trainingCards: firestoreTrainingCards, loading: trainingLoading, addTrainingCard, updateTrainingCard, deleteTrainingCard } = useTrainingCards();
  
  // Get today's date in YYYY-MM-DD format and default the date filter to today
  const today = new Date();
  const todayString = today.getFullYear() + '-' + 
    String(today.getMonth() + 1).padStart(2, '0') + '-' + 
    String(today.getDate()).padStart(2, '0');

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [courtFilter, setCourtFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState(todayString);
  
  // Modal states
  const [showAddChampionship, setShowAddChampionship] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddAdvertisement, setShowAddAdvertisement] = useState(false);
  
  // Edit modal states
  const [editingChampionship, setEditingChampionship] = useState<Championship | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingAdvertisement, setEditingAdvertisement] = useState<Advertisement | null>(null);
  const [showTrainingForm, setShowTrainingForm] = useState(false);
  const [editingTraining, setEditingTraining] = useState(null);
  
  // Confirmation dialog states
  const [bookingToDelete, setBookingToDelete] = useState<string | null>(null);
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);

  const handleStatusChange = async (bookingId: string, status: 'approved' | 'canceled') => {
    try {
      await updateBooking(bookingId, { status });
    } catch (error) {
      let message = 'Error changing booking status';
      if (error && typeof error === 'object' && 'message' in error && typeof (error as { message?: unknown }).message === 'string') {
        message = (error as { message?: string }).message || message;
      }
      // Show a clear message to the user/admin using app toast
      toast({
        title: 'Action failed',
        description: message,
        variant: 'destructive',
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (bookingToDelete) {
      await deleteBooking(bookingToDelete);
      setBookingToDelete(null);
    }
  };

  const handleConfirmCancel = async () => {
    if (bookingToCancel) {
      await handleStatusChange(bookingToCancel, 'canceled');
      setBookingToCancel(null);
    }
  };

  const totalIncome = bookings
    .filter(booking => booking.status === 'approved')
    .reduce((sum, booking) => sum + booking.price, 0);

  console.log('Today string:', todayString);
  console.log('All bookings:', bookings.map(b => ({ date: b.date, status: b.status, price: b.price })));

  const todayIncome = bookings
    .filter(booking => {
      console.log('Checking booking:', booking.date, 'against today:', todayString, 'status:', booking.status);
      return booking.status === 'approved' && booking.date === todayString;
    })
    .reduce((sum, booking) => sum + booking.price, 0);

  console.log('Today income:', todayIncome);

  const thisWeekIncome = bookings
    .filter(booking => {
      if (booking.status !== 'approved') return false;
      
      const bookingDate = new Date(booking.date + 'T00:00:00');
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      weekAgo.setHours(0, 0, 0, 0);
      const todayEnd = new Date(today);
      todayEnd.setHours(23, 59, 59, 999);
      
      console.log('Week check - Booking date:', booking.date, 'Booking Date obj:', bookingDate, 'Week ago:', weekAgo, 'Today end:', todayEnd);
      
      return bookingDate >= weekAgo && bookingDate <= todayEnd;
    })
    .reduce((sum, booking) => sum + booking.price, 0);

  console.log('This week income:', thisWeekIncome);

  const thisMonthIncome = bookings
    .filter(booking => {
      if (booking.status !== 'approved') return false;
      
      const bookingDate = new Date(booking.date + 'T00:00:00');
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      monthStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date(today);
      todayEnd.setHours(23, 59, 59, 999);
      
      console.log('Month check - Booking date:', booking.date, 'Booking Date obj:', bookingDate, 'Month start:', monthStart, 'Today end:', todayEnd);
      
      return bookingDate >= monthStart && bookingDate <= todayEnd;
    })
    .reduce((sum, booking) => sum + booking.price, 0);

  console.log('This month income:', thisMonthIncome);

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.phoneNumber?.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    const matchesCourt = courtFilter === 'all' || booking.court.toString() === courtFilter;
    const matchesDate = !dateFilter || booking.date === dateFilter;
    
    return matchesSearch && matchesStatus && matchesCourt && matchesDate;
  });

  // Calculate total price of filtered bookings
  const filteredBookingsTotal = filteredBookings.reduce((sum, booking) => sum + booking.price, 0);

  const handleLogout = async () => {
    try {
      await logout();
      onNavigateHome();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Controlled tab for mobile bottom navigation
  const [activeTab, setActiveTab] = useState<'reservations' | 'analytics' | 'championships' | 'products' | 'advertisements' | 'training'>('reservations');
  const [usersCount, setUsersCount] = useState<number>(0);

  // realtime users count
  useEffect(() => {
    const ref = collection(db, 'users');
    const unsub = onSnapshot(ref, (snap: QuerySnapshot<DocumentData>) => {
      setUsersCount(snap.size ?? 0);
    }, (err) => console.warn('Failed to subscribe to users collection for count:', err));
    return () => unsub();
  }, []);

  const ReservationsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Filter className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-primary">Reservation Dashboard</h3>
      </div>
      

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Date</label>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Court</label>
          <select
            value={courtFilter}
            onChange={(e) => setCourtFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">All Courts</option>
            <option value="1">Court 1</option>
            <option value="2">Court 2</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Search by Name</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Enter user name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Total Price Summary */}
      <div className="bg-white p-6 rounded-lg shadow border-l-4 border-cyan-500">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-cyan-500 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900">Total Reservations Value</h4>
              <p className="text-sm text-gray-600">
                {filteredBookings.length} reservation{filteredBookings.length !== 1 ? 's' : ''} found
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-cyan-600">{filteredBookingsTotal} EGP</p>
            <p className="text-sm text-gray-500">Based on current filters</p>
          </div>
        </div>
      </div>

      {/* Bookings Table (desktop) */}
      <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-medium">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  User Details
                </div>
              </TableHead>
              <TableHead>Court</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBookings.map(booking => (
              <TableRow key={booking.id} className="hover:bg-gray-50">
                <TableCell>
                  <div>
                    <div className="font-medium">{booking.fullName}</div>
                    <div className="text-sm text-gray-500">{booking.phoneNumber}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center w-8 h-8 bg-cyan-500 text-white rounded-full text-sm font-medium">
                    {booking.court}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{booking.date}</div>
                    <div className="text-sm text-gray-500">{booking.startTime} - {booking.endTime}</div>
                  </div>
                </TableCell>
                <TableCell>{booking.reservationType}</TableCell>
                <TableCell className="font-medium text-green-600">
                  {booking.price} {t('egp', 'EGP')}
                </TableCell>
                <TableCell>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    booking.status === 'approved' ? 'bg-green-100 text-green-700' :
                    booking.status === 'canceled' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {booking.status}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {booking.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleStatusChange(booking.id, 'approved')}
                          disabled={loading}
                          className="bg-green-500 hover:bg-green-600 text-white"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="destructive"
                              disabled={loading}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to cancel this booking? This action will change the booking status to "canceled".
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>No, Keep Booking</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleStatusChange(booking.id, 'canceled')}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Yes, Cancel Booking
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </>
                    )}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={loading}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Booking</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to permanently delete this booking? This action cannot be undone and will completely remove the booking from the system.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>No, Keep Booking</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteBooking(booking.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Yes, Delete Permanently
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Bookings Cards (mobile) */}
      <div className="md:hidden space-y-4">
        {filteredBookings.map(booking => (
          <div key={booking.id} className="rounded-2xl border border-cyan-200 bg-white p-4 shadow-[0_10px_30px_rgba(2,6,23,0.06)] hover:shadow-[0_14px_36px_rgba(2,6,23,0.12)] transition-all">
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <div className="font-semibold text-slate-700">User:</div>
              <div className="text-right text-slate-900">{booking.fullName}</div>
              <div className="font-semibold text-slate-700">Phone:</div>
              <div className="text-right text-slate-900">{booking.phoneNumber}</div>
              <div className="font-semibold text-slate-700">Court:</div>
              <div className="text-right text-slate-900">Court {booking.court}</div>
              <div className="font-semibold text-slate-700">Time:</div>
              <div className="text-right text-slate-900">{booking.startTime} - {booking.endTime}</div>
              <div className="font-semibold text-slate-700">Date:</div>
              <div className="text-right text-slate-900">{booking.date}</div>
            </div>
            <div className="mt-4 flex gap-3">
              <Button
                size="sm"
                onClick={() => handleStatusChange(booking.id, 'approved')}
                disabled={loading || booking.status !== 'pending'}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm hover:shadow-md"
                aria-label="Approve"
              >
                <Check className="w-4 h-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={loading || booking.status !== 'pending'}
                    className="flex-1"
                    aria-label="Cancel"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to cancel this booking? This action will change the booking status to "canceled".
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>No, Keep Booking</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleStatusChange(booking.id, 'canceled')}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Yes, Cancel Booking
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size="sm"
                    className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white"
                    aria-label="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Booking</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to permanently delete this booking? This action cannot be undone and will completely remove the booking from the system.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>No, Keep Booking</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => deleteBooking(booking.id)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Yes, Delete Permanently
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const AnalyticsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-primary">Income Analytics</h3>
      </div>

      {/* Income Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Today's Income</p>
              <p className="text-2xl font-bold text-green-600">{todayIncome} EGP</p>
            </div>
            <div className="text-green-500 text-2xl">💵</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">This Week</p>
              <p className="text-2xl font-bold text-blue-600">{thisWeekIncome} EGP</p>
            </div>
            <div className="text-blue-500 text-2xl">📅</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-purple-600">{thisMonthIncome} EGP</p>
            </div>
            <div className="text-purple-500 text-2xl">📈</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-orange-600">{totalIncome} EGP</p>
            </div>
            <div className="text-orange-500 text-2xl">🎯</div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h4 className="text-lg font-semibold mb-2">Total Bookings</h4>
          <p className="text-3xl font-bold text-primary">{bookings.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h4 className="text-lg font-semibold mb-2">Active Championships</h4>
          <p className="text-3xl font-bold text-purple-600">{championships.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h4 className="text-lg font-semibold mb-2">Available Products</h4>
          <p className="text-3xl font-bold text-blue-600">{products.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h4 className="text-lg font-semibold mb-2">Total Users</h4>
          <p className="text-3xl font-bold text-emerald-600">{usersCount}</p>
        </div>
      </div>
    </div>
  );

  const ChampionshipsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-primary">Championship Manager</h3>
        </div>
        <Button 
          className="bg-[#13005A] hover:bg-[#1C82AD] text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300"
          onClick={() => setShowAddChampionship(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Championship
        </Button>
      </div>

      {championships.length === 0 ? (
        <div className="bg-cyan-50 p-12 rounded-lg text-center">
          <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Championships Yet</h3>
          <p className="text-gray-600 mb-4">Create your first championship to get started!</p>
          <Button 
            className="bg-[#13005A] hover:bg-[#1C82AD] text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300"
            onClick={() => setShowAddChampionship(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Championship
          </Button>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Title</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Registration</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {championships.map(championship => (
                  <TableRow key={championship.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div>
                        <div className="font-medium">{championship.title}</div>
                        <div className="text-sm text-gray-500">{championship.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>{championship.date}</TableCell>
                    <TableCell>{championship.time}</TableCell>
                    <TableCell>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        championship.registrationEnabled 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {championship.registrationEnabled ? 'Open' : 'Closed'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setEditingChampionship(championship)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="destructive"
                              disabled={championshipsLoading}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Championship</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to permanently delete this championship? This action cannot be undone and will remove the championship and all its registrations from the system.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>No, Keep Championship</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteChampionship(championship.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Yes, Delete Permanently
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-4">
            {championships.map(championship => (
              <div key={championship.id} className="rounded-2xl border border-cyan-200 bg-white p-4 shadow-[0_10px_30px_rgba(2,6,23,0.06)] hover:shadow-[0_14px_36px_rgba(2,6,23,0.12)] transition-all">
                <div className="text-base font-bold text-slate-900 mb-2">{championship.title}</div>
                {championship.description && (
                  <div className="text-sm text-slate-600 mb-2">{championship.description}</div>
                )}
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <div className="font-semibold text-slate-700">Date:</div>
                  <div className="text-right text-slate-900">{championship.date}</div>
                  <div className="font-semibold text-slate-700">Time:</div>
                  <div className="text-right text-slate-900">{championship.time}</div>
                  <div className="font-semibold text-slate-700">Registration:</div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-[11px] font-medium ${
                      championship.registrationEnabled ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {championship.registrationEnabled ? 'Open' : 'Closed'}
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex gap-3">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => setEditingChampionship(championship)} aria-label="Edit">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="destructive" className="flex-1" aria-label="Delete" disabled={championshipsLoading}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Championship</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to permanently delete this championship? This action cannot be undone and will remove the championship and all its registrations from the system.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>No, Keep Championship</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteChampionship(championship.id)} className="bg-red-600 hover:bg-red-700">
                          Yes, Delete Permanently
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );

  const ProductsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-primary">Product Manager</h3>
        </div>
        <Button 
          className="bg-[#13005A] hover:bg-[#1C82AD] text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300"
          onClick={() => setShowAddProduct(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {products.length === 0 ? (
        <div className="bg-cyan-50 p-12 rounded-lg text-center">
          <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Products Yet</h3>
          <p className="text-gray-600 mb-4">Add your first product to get started!</p>
          <Button 
            className="bg-[#13005A] hover:bg-[#1C82AD] text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300"
            onClick={() => setShowAddProduct(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Product</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map(product => (
                  <TableRow key={product.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div className="font-medium">{product.name}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-green-600">
                      {product.price} EGP
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-500 max-w-xs truncate">
                        {product.description}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setEditingProduct(product)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="destructive"
                              disabled={productsLoading}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Product</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to permanently delete this product? This action cannot be undone and will remove the product from the shop.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>No, Keep Product</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteProduct(product.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Yes, Delete Permanently
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-4">
            {products.map(product => (
              <div key={product.id} className="rounded-2xl border border-cyan-200 bg-white p-4 shadow-[0_10px_30px_rgba(2,6,23,0.06)] hover:shadow-[0_14px_36px_rgba(2,6,23,0.12)] transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <img src={product.image} alt={product.name} className="h-14 w-14 rounded-lg object-cover" />
                  <div>
                    <div className="text-base font-bold text-slate-900">{product.name}</div>
                    <div className="text-sm font-semibold text-emerald-600">{product.price} EGP</div>
                  </div>
                </div>
                {product.description && (
                  <div className="text-sm text-slate-600 mb-3 line-clamp-2">{product.description}</div>
                )}
                <div className="mt-1 flex gap-3">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => setEditingProduct(product)} aria-label="Edit">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="destructive" className="flex-1" aria-label="Delete" disabled={productsLoading}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Product</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to permanently delete this product? This action cannot be undone and will remove the product from the shop.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>No, Keep Product</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteProduct(product.id)} className="bg-red-600 hover:bg-red-700">
                          Yes, Delete Permanently
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );

  const AdvertisementsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-primary">Advertisement Manager</h3>
        </div>
        <Button 
          className="bg-[#13005A] hover:bg-[#1C82AD] text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300"
          onClick={() => setShowAddAdvertisement(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Advertisement
        </Button>
      </div>

      {advertisements.length === 0 ? (
        <div className="bg-cyan-50 p-12 rounded-lg text-center">
          <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Megaphone className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Advertisements Yet</h3>
          <p className="text-gray-600 mb-4">Create your first advertisement to get started!</p>
          <Button 
            className="bg-[#13005A] hover:bg-[#1C82AD] text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300"
            onClick={() => setShowAddAdvertisement(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Advertisement
          </Button>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Advertisement</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Link</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {advertisements.map(advertisement => (
                  <TableRow key={advertisement.id} className="hover:bg-gray-50">
                    <TableCell>
                      <img
                        src={advertisement.image}
                        alt={advertisement.title || 'Advertisement'}
                        className="w-16 h-12 object-cover rounded-lg"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{advertisement.title || 'Untitled'}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-500 max-w-xs truncate">
                        {advertisement.description || 'No description'}
                      </div>
                    </TableCell>
                    <TableCell>
                      {advertisement.link && (
                        <a
                          href={advertisement.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm"
                        >
                          View Link
                        </a>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setEditingAdvertisement(advertisement)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="destructive"
                              disabled={advertisementsLoading}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Advertisement</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to permanently delete this advertisement? This action cannot be undone and will remove the advertisement from the system.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>No, Keep Advertisement</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteAdvertisement(advertisement.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Yes, Delete Permanently
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-4">
            {advertisements.map(ad => (
              <div key={ad.id} className="rounded-2xl border border-cyan-200 bg-white p-4 shadow-[0_10px_30px_rgba(2,6,23,0.06)] hover:shadow-[0_14px_36px_rgba(2,6,23,0.12)] transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <img src={ad.image} alt={ad.title || 'Advertisement'} className="h-14 w-20 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="text-base font-bold text-slate-900 truncate">{ad.title || 'Untitled'}</div>
                    {ad.link && (
                      <a href={ad.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline break-all">
                        {ad.link}
                      </a>
                    )}
                  </div>
                </div>
                {ad.description && (
                  <div className="text-sm text-slate-600 mb-3 line-clamp-2">{ad.description}</div>
                )}
                <div className="mt-1 flex gap-3">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => setEditingAdvertisement(ad)} aria-label="Edit">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="destructive" className="flex-1" aria-label="Delete" disabled={advertisementsLoading}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Advertisement</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to permanently delete this advertisement? This action cannot be undone and will remove the advertisement from the system.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>No, Keep Advertisement</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteAdvertisement(ad.id)} className="bg-red-600 hover:bg-red-700">
                          Yes, Delete Permanently
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );

  const TrainingTab = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 justify-between">
        <h3 className="text-lg font-semibold text-primary">Training Manager</h3>
        <Button className="bg-[#13005A] text-white" onClick={() => { setShowTrainingForm(true); setEditingTraining(null); }}>Add Training Card</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(firestoreTrainingCards || []).map(card => (
          <div key={card.id} className="card flex flex-col items-center text-center">
            <img src={card.image} alt={card.title} className="w-full h-40 object-cover rounded-lg mb-2" />
            <h4 className="text-xl font-bold mb-1">{card.title}</h4>
            <p className="text-gray-600 mb-2">{card.description}</p>
            <span className="text-lg font-bold text-green-700 mb-2">{card.price} EGP</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => { setEditingTraining(card); setShowTrainingForm(true); }}>Edit</Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="sm" variant="destructive">Delete</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Training Card</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to permanently delete this training card? This action cannot be undone and will remove the training card from the system.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>No, Keep Training Card</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => card.id && deleteTrainingCard(card.id)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Yes, Delete Permanently
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
      </div>
      {(showTrainingForm || editingTraining) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{editingTraining ? 'Edit Training Card' : 'Add Training Card'}</h2>
            <TrainingForm
              initial={editingTraining || undefined}
              onSubmit={async (card) => {
                if (editingTraining && editingTraining.id) {
                  await updateTrainingCard(editingTraining.id, card);
                  setEditingTraining(null);
                } else {
                  await addTrainingCard(card);
                }
                setShowTrainingForm(false);
              }}
              onCancel={() => { setShowTrainingForm(false); setEditingTraining(null); }}
            />
          </div>
        </div>
      )}
    </div>
  );

  

  return (
    <div className="min-h-screen relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-cyan-50 to-fuchsia-50">
      {/* Cinematic animated gradient aurora */}
      <div className="pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(60%_60%_at_50%_40%,_black,_transparent)] animate-gradient-shift bg-[length:200%_200%] bg-gradient-to-br from-cyan-300/20 via-indigo-300/10 to-fuchsia-300/20" />
      {/* Floating glow orbs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full blur-3xl bg-cyan-400/15 animate-float" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-[28rem] w-[28rem] rounded-full blur-3xl bg-fuchsia-400/15 animate-float" />
      <div className="container mx-auto px-4 py-8 pb-24 md:pb-8 relative">
        {/* Header with Navigation */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4 animate-fade-in-up">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-[0_0_20px_theme(colors.cyan.500/0.5)]">
                <BarChart3 className="w-5 h-5 text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.6)]" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 via-sky-500 to-fuchsia-600 animate-text-glow">Admin Panel</h1>
                <p className="text-slate-600">Manage your Squash court business efficiently</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                onClick={onNavigateHome}
                variant="outline"
                className="flex items-center gap-2 transition-all duration-300 hover:shadow-[0_0_24px_theme(colors.cyan.400/0.3)] hover:border-cyan-400 hover:text-cyan-700"
              >
                <Home className="w-4 h-4" />
                Back to Home
              </Button>
              <Button
                onClick={handleLogout}
                variant="destructive"
                className="flex items-center gap-2 bg-red-600 hover:bg-red-500 transition-all duration-300 hover:shadow-[0_0_24px_rgba(239,68,68,0.35)]"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>

  {/* Tabs */}
  <Tabs value={activeTab} onValueChange={(v: string) => setActiveTab(v as 'reservations' | 'analytics' | 'championships' | 'products' | 'advertisements' | 'training')} className="space-y-6">
          <TabsList className="hidden md:grid w-full grid-cols-6 bg-white/80 backdrop-blur-sm shadow-inner rounded-lg p-2 h-auto border border-slate-200">
            <TabsTrigger 
              value="reservations" 
              className="flex items-center gap-2 p-3 text-slate-700 data-[state=active]:bg-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-[0_0_24px_theme(colors.cyan.400/0.6)] transition-all duration-300 hover:bg-slate-100 rounded-md"
            >
              <Calendar className="w-4 h-4" />
              <span className="font-medium">Reservations</span>
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="flex items-center gap-2 p-3 text-slate-700 data-[state=active]:bg-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-[0_0_24px_theme(colors.cyan.400/0.6)] transition-all duration-300 hover:bg-slate-100 rounded-md"
            >
              <BarChart3 className="w-4 h-4" />
              <span className="font-medium">Analytics</span>
            </TabsTrigger>
            <TabsTrigger 
              value="championships" 
              className="flex items-center gap-2 p-3 text-slate-700 data-[state=active]:bg-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-[0_0_24px_theme(colors.cyan.400/0.6)] transition-all duration-300 hover:bg-slate-100 rounded-md"
            >
              <Trophy className="w-4 h-4" />
              <span className="font-medium">Championships</span>
            </TabsTrigger>
            <TabsTrigger 
              value="products" 
              className="flex items-center gap-2 p-3 text-slate-700 data-[state=active]:bg-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-[0_0_24px_theme(colors.cyan.400/0.6)] transition-all duration-300 hover:bg-slate-100 rounded-md"
            >
              <Package className="w-4 h-4" />
              <span className="font-medium">Products</span>
            </TabsTrigger>
            <TabsTrigger 
              value="advertisements" 
              className="flex items-center gap-2 p-3 text-slate-700 data-[state=active]:bg-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-[0_0_24px_theme(colors.cyan.400/0.6)] transition-all duration-300 hover:bg-slate-100 rounded-md"
            >
              <Megaphone className="w-4 h-4" />
              <span className="font-medium">Advertisements</span>
            </TabsTrigger>
            <TabsTrigger 
              value="training" 
              className="flex items-center gap-2 p-3 text-slate-700 data-[state=active]:bg-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-[0_0_24px_theme(colors.cyan.400/0.6)] transition-all duration-300 hover:bg-slate-100 rounded-md"
            >
              <BarChart3 className="w-4 h-4" />
              <span className="font-medium">Training</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reservations" className="animate-fade-in-up">
            <div className="[&_table]:bg-white [&_table]:backdrop-blur [&_.rounded-lg]:border [&_.rounded-lg]:border-slate-200 [&_.rounded-lg]:shadow-[0_10px_30px_rgba(2,6,23,0.06)] [&_.rounded-lg]:transition-all [&_.rounded-lg:hover]:shadow-[0_14px_36px_rgba(2,6,23,0.12)]">
              <ReservationsTab />
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="animate-fade-in-up">
            <div className="grid gap-6 [&_.rounded-lg]:bg-white [&_.rounded-lg]:backdrop-blur [&_.rounded-lg]:border [&_.rounded-lg]:border-slate-200 [&_.rounded-lg]:shadow-[0_10px_30px_rgba(2,6,23,0.06)] [&_.rounded-lg]:transition-all [&_.rounded-lg:hover]:shadow-[0_14px_36px_rgba(2,6,23,0.12)]">
              <AnalyticsTab />
            </div>
          </TabsContent>

          <TabsContent value="championships" className="animate-fade-in-up">
            <div className="[&_.bg-white]:bg-white [&_.bg-white]:backdrop-blur [&_.bg-white]:border [&_.bg-white]:border-slate-200 [&_.bg-white]:shadow-[0_10px_30px_rgba(2,6,23,0.06)] [&_.bg-white]:transition-all [&_.bg-white:hover]:shadow-[0_14px_36px_rgba(2,6,23,0.12)]">
              <ChampionshipsTab />
            </div>
          </TabsContent>

          <TabsContent value="products" className="animate-fade-in-up">
            <div className="[&_.bg-white]:bg-white [&_.bg-white]:backdrop-blur [&_.bg-white]:border [&_.bg-white]:border-slate-200 [&_.bg-white]:shadow-[0_10px_30px_rgba(2,6,23,0.06)] [&_.bg-white]:transition-all [&_.bg-white:hover]:shadow-[0_14px_36px_rgba(2,6,23,0.12)]">
              <ProductsTab />
            </div>
          </TabsContent>

          <TabsContent value="advertisements" className="animate-fade-in-up">
            <div className="[&_.bg-white]:bg-white [&_.bg-white]:backdrop-blur [&_.bg-white]:border [&_.bg-white]:border-slate-200 [&_.bg-white]:shadow-[0_10px_30px_rgba(2,6,23,0.06)] [&_.bg-white]:transition-all [&_.bg-white:hover]:shadow-[0_14px_36px_rgba(2,6,23,0.12)]">
              <AdvertisementsTab />
            </div>
          </TabsContent>

          <TabsContent value="training" className="animate-fade-in-up">
            <div className="[&_.card]:bg-white [&_.card]:backdrop-blur [&_.card]:border [&_.card]:border-slate-200 [&_.card]:shadow-[0_10px_30px_rgba(2,6,23,0.06)] [&_.card]:transition-all [&_.card:hover]:shadow-[0_14px_36px_rgba(2,6,23,0.12)]">
              <TrainingTab />
            </div>
          </TabsContent>
        </Tabs>
        {/* Mobile bottom navigation NOTE: moved out of the inner container to ensure fixed positioning works correctly */}
      </div>

      {/* Add Modal overlays */}
      {showAddChampionship && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in-up">
          <AddChampionshipForm
            onSuccess={() => setShowAddChampionship(false)}
            onCancel={() => setShowAddChampionship(false)}
          />
        </div>
      )}

      {showAddProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in-up">
          <AddProductForm
            onSuccess={() => setShowAddProduct(false)}
            onCancel={() => setShowAddProduct(false)}
          />
        </div>
      )}

      {showAddAdvertisement && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in-up">
          <AddAdvertisementForm
            onSuccess={() => setShowAddAdvertisement(false)}
            onCancel={() => setShowAddAdvertisement(false)}
          />
        </div>
      )}

      

      {/* Edit Modal overlays */}
      {editingChampionship && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in-up">
          <EditChampionshipForm
            championship={editingChampionship}
            onSuccess={() => setEditingChampionship(null)}
            onCancel={() => setEditingChampionship(null)}
          />
        </div>
      )}

      {editingProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in-up">
          <EditProductForm
            product={editingProduct}
            onSuccess={() => setEditingProduct(null)}
            onCancel={() => setEditingProduct(null)}
          />
        </div>
      )}

      {editingAdvertisement && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in-up">
          <EditAdvertisementForm
            advertisement={editingAdvertisement}
            onSuccess={() => setEditingAdvertisement(null)}
            onCancel={() => setEditingAdvertisement(null)}
          />
        </div>
      )}
      {/* Mobile bottom navigation (fixed full-width, no margins) - rendered at top-level so it's always visible */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <div className="bg-white/90 border-t border-slate-200 backdrop-blur-md shadow-[0_-10px_30px_rgba(2,6,23,0.08)] flex justify-between px-0 py-2 w-full">
          <button
            onClick={() => setActiveTab('reservations')}
            className={`flex-1 flex flex-col items-center justify-center text-sm py-2 transition-colors ${activeTab === 'reservations' ? 'text-cyan-600 font-semibold' : 'text-slate-600'}`}
            aria-label="Reservations"
          >
            <Calendar className="w-5 h-5 mb-1" />
            <span className="text-[11px]">Reservations</span>
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex-1 flex flex-col items-center justify-center text-sm py-2 transition-colors ${activeTab === 'analytics' ? 'text-cyan-600 font-semibold' : 'text-slate-600'}`}
            aria-label="Analytics"
          >
            <BarChart3 className="w-5 h-5 mb-1" />
            <span className="text-[11px]">Analytics</span>
          </button>
          <button
            onClick={() => setActiveTab('championships')}
            className={`flex-1 flex flex-col items-center justify-center text-sm py-2 transition-colors ${activeTab === 'championships' ? 'text-cyan-600 font-semibold' : 'text-slate-600'}`}
            aria-label="Championships"
          >
            <Trophy className="w-5 h-5 mb-1" />
            <span className="text-[11px]">Champs</span>
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`flex-1 flex flex-col items-center justify-center text-sm py-2 transition-colors ${activeTab === 'products' ? 'text-cyan-600 font-semibold' : 'text-slate-600'}`}
            aria-label="Products"
          >
            <Package className="w-5 h-5 mb-1" />
            <span className="text-[11px]">Products</span>
          </button>
          <button
            onClick={() => setActiveTab('advertisements')}
            className={`flex-1 flex flex-col items-center justify-center text-sm py-2 transition-colors ${activeTab === 'advertisements' ? 'text-cyan-600 font-semibold' : 'text-slate-600'}`}
            aria-label="Advertisements"
          >
            <Megaphone className="w-5 h-5 mb-1" />
            <span className="text-[11px]">Ads</span>
          </button>
          <button
            onClick={() => setActiveTab('training')}
            className={`flex-1 flex flex-col items-center justify-center text-sm py-2 transition-colors ${activeTab === 'training' ? 'text-cyan-600 font-semibold' : 'text-slate-600'}`}
            aria-label="Training"
          >
            <BarChart3 className="w-5 h-5 mb-1" />
            <span className="text-[11px]">Training</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const TrainingForm = ({ initial, onSubmit, onCancel }: { initial?: TrainingCard, onSubmit: (card: TrainingCard | Omit<TrainingCard, 'id'>) => void, onCancel: () => void }) => {
  const [form, setForm] = useState<Partial<TrainingCard>>(initial || { price: 0 });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: name === 'price' ? Number(value) : value }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.image || !form.price) return;
    onSubmit(initial ? { ...form, id: initial.id } as TrainingCard : form as Omit<TrainingCard, 'id'>);
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="title" value={form.title || ''} onChange={handleChange} placeholder="Title" className="form-control" required />
      <textarea name="description" value={form.description || ''} onChange={handleChange} placeholder="Description" className="form-control" required />
      <input name="image" value={form.image || ''} onChange={handleChange} placeholder="Image URL" className="form-control" required />
      <input name="price" type="number" value={form.price || 0} onChange={handleChange} placeholder="Price" className="form-control" required min={0} />
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" className="bg-[#13005A] text-white">{initial ? 'Save' : 'Add'}</Button>
      </div>
    </form>
  );
};

export default AdminDashboard;
