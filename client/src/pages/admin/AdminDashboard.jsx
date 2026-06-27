import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Users, UserCog, Stethoscope, Activity, 
  Calendar, CheckCircle, XCircle, BrainCircuit 
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import adminService from '../../services/adminService';

// Register ChartJS components
ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, BarElement,
  Title, Tooltip, Legend, ArcElement, Filler
);

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
  <div className="bg-card border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <h3 className="text-3xl font-black mt-1">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
    {trend && (
      <div className="flex items-center gap-2">
        <span className={`text-xs font-bold ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
        <span className="text-xs text-muted-foreground">vs last month</span>
      </div>
    )}
  </div>
);

const AdminDashboard = () => {
  const { data: stats, isLoading, isError } = useQuery({
    queryKey: ['adminStats'],
    queryFn: adminService.getDashboardStats,
    refetchInterval: 60000, // Refresh every minute
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-32 bg-muted animate-pulse rounded-2xl border"></div>
        ))}
      </div>
    );
  }

  if (isError) {
    return <div className="text-red-500 bg-red-500/10 p-4 rounded-xl border border-red-500/20">Failed to load dashboard statistics.</div>;
  }

  // Dummy Chart Data for UI Demonstration
  const lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'New Patients',
        data: [65, 59, 80, 81, 56, 55, 90],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Predictions Made',
        data: [28, 48, 40, 19, 86, 27, 120],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
      }
    ]
  };

  const barChartData = {
    labels: ['Flu', 'Dengue', 'Covid-19', 'Malaria', 'Typhoid'],
    datasets: [
      {
        label: 'Top Predicted Diseases',
        data: [120, 98, 86, 54, 43],
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
        ],
        borderRadius: 8,
      }
    ]
  };

  const doughnutData = {
    labels: ['Completed', 'Pending', 'Cancelled'],
    datasets: [
      {
        data: [300, 50, 20],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderWidth: 0,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' }
    },
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
      x: { grid: { display: false } }
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-black mb-2">Dashboard Overview</h1>
        <p className="text-muted-foreground">Welcome to the Medica AI Enterprise Admin Panel.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Users" 
          value={stats?.totalUsers || 0} 
          icon={Users} 
          color="bg-blue-500/10 text-blue-500"
          trend={12} 
        />
        <StatCard 
          title="Total Patients" 
          value={stats?.totalPatients || 0} 
          icon={UserCog} 
          color="bg-emerald-500/10 text-emerald-500" 
          trend={8}
        />
        <StatCard 
          title="Verified Doctors" 
          value={stats?.totalDoctors || 0} 
          icon={Stethoscope} 
          color="bg-purple-500/10 text-purple-500"
          trend={4} 
        />
        <StatCard 
          title="Total Predictions" 
          value={stats?.totalPredictions || 0} 
          icon={Activity} 
          color="bg-pink-500/10 text-pink-500" 
          trend={24}
        />
        
        <StatCard 
          title="Total Appointments" 
          value={stats?.totalAppointments || 0} 
          icon={Calendar} 
          color="bg-indigo-500/10 text-indigo-500" 
        />
        <StatCard 
          title="Completed Appointments" 
          value={0} 
          icon={CheckCircle} 
          color="bg-teal-500/10 text-teal-500" 
        />
        <StatCard 
          title="Active AI Chats" 
          value={0} 
          icon={BrainCircuit} 
          color="bg-orange-500/10 text-orange-500" 
        />
        <StatCard 
          title="System Health" 
          value="99.9%" 
          icon={Activity} 
          color="bg-green-500/10 text-green-500" 
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border rounded-2xl p-6 shadow-sm h-[400px] flex flex-col">
          <h3 className="text-lg font-bold mb-6">Growth Analytics</h3>
          <div className="flex-1 relative">
            <Line data={lineChartData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-card border rounded-2xl p-6 shadow-sm h-[400px] flex flex-col">
          <h3 className="text-lg font-bold mb-6">Top Predicted Diseases</h3>
          <div className="flex-1 relative">
            <Bar data={barChartData} options={chartOptions} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-card border rounded-2xl p-6 shadow-sm h-[350px] flex flex-col col-span-1 lg:col-span-1">
          <h3 className="text-lg font-bold mb-6">Appointment Status</h3>
          <div className="flex-1 relative flex justify-center pb-4">
            <Doughnut data={doughnutData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
          </div>
        </div>

        <div className="bg-card border rounded-2xl p-6 shadow-sm col-span-1 lg:col-span-2 overflow-hidden flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold">Recent Predictions</h3>
            <button className="text-sm font-semibold text-primary hover:underline">View All</button>
          </div>
          <div className="flex-1 flex items-center justify-center border-2 border-dashed rounded-xl bg-muted/30">
            <p className="text-muted-foreground font-medium flex items-center gap-2">
              <Activity className="w-5 h-5"/> Live Prediction Feed will appear here
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
