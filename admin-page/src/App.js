import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Profile from './profile';
import { 
  Search, Bell, User, Settings, HelpCircle, LogOut,
  Grid, ShoppingCart, DollarSign, Users, BarChart2,
  Menu, ChevronDown
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './App.css';

import { fetchUserCount, fetchSalesCount, fetchRecentSales, fetchTopProducts, fetchRevenue, fetchUserCountForMonth, fetchRecentActivities } from './api';

// Header Component
const Header = ({ toggleSidebar }) => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50 h-16">
      <div className="flex items-center justify-between px-4 h-full">
        <div className="flex items-center space-x-4">
          <button onClick={toggleSidebar} className="lg:hidden p-2">
            <Menu size={24} />
          </button>
          <div className="flex items-center space-x-2">
          <span className="hidden lg:block text-4xl font-semibold text-blue-600">RentEZ</span>
          </div>
        </div>

        <div className="hidden md:flex flex-1 justify-center px-4">
          <div className="max-w-md w-full">
            <form className="flex items-center">
              <input
                type="text"
                placeholder="Search"
                className="w-full px-4 py-2 border rounded-l focus:outline-none"
              />
              <button className="p-2 bg-blue-600 text-white rounded-r">
                <Search size={20} />
              </button>
            </form>
          </div>
        </div>

        <nav className="flex items-center space-x-4">
          <NotificationButton count={4} />
          <ProfileDropdown />
        </nav>
      </div>
    </header>
  );
};

// Notification Button Component
const NotificationButton = ({ count }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const notifications = [
    { id: 1, type: 'warning', title: 'Lorem Ipsum', text: 'Quae dolorem earum veritatis oditseno', time: '30 min. ago' },
    { id: 2, type: 'error', title: 'Atque rerum nesciunt', text: 'Quae dolorem earum veritatis oditseno', time: '1 hr. ago' },
    { id: 3, type: 'success', title: 'Sit rerum fuga', text: 'Quae dolorem earum veritatis oditseno', time: '2 hrs. ago' },
  ];

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="p-2 hover:bg-gray-100 rounded-full relative"
      >
        <Bell size={20} />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {count}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg">
          <div className="p-4 border-b">
            <h6 className="text-sm font-semibold">Notifications</h6>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.map(notification => (
              <div key={notification.id} className="p-4 border-b hover:bg-gray-50">
                <div className="flex space-x-3">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    notification.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                    notification.type === 'error' ? 'bg-red-100 text-red-600' :
                    'bg-green-100 text-green-600'
                  }`}>
                    {notification.type === 'warning' && '!'}
                    {notification.type === 'error' && 'X'}
                    {notification.type === 'success' && '✓'}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">{notification.title}</h4>
                    <p className="text-sm text-gray-500">{notification.text}</p>
                    <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Message Button Component


// Profile Dropdown Component
const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-full"
      >
        <img src="profile-11.png" alt="Profile" className="w-8 h-8 rounded-full" />
        <span className="hidden md:block">K. Anderson</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg">
          <div className="p-4 border-b text-center">
            <h6 className="font-semibold">Kevin Anderson</h6>
            <p className="text-sm text-gray-500">Web Designer</p>
          </div>
          <div className="p-2">
            <a href="/profile" className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
              <User size={16} />
              <span>My Profile</span>
            </a>
            <a href="a" className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
              <Settings size={16} />
              <span>Settings</span>
            </a>
            <a href="a" className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
              <HelpCircle size={16} />
              <span>Need Help?</span>
            </a>
            <a href="a" className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
              <LogOut size={16} />
              <span>Sign Out</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

// Sidebar Component
const Sidebar = ({ isOpen, onClose }) => {
  return (
    <aside className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white shadow-sm transition-transform duration-300 z-40
      ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} w-64`}>
      <nav className="p-4 h-full overflow-y-auto">
        <ul className="space-y-2">
          <li>
            <a href="/" className="flex items-center space-x-2 p-2 bg-blue-50 rounded text-blue-700">
              <Grid size={20} />
              <span>Dashboard</span>
            </a>
          </li>
          <li>
            <a href="/profile" className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
              <User size={20} />
              <span>Profile</span>
            </a>
          </li>
          <li>
            <a href="a" className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
              <HelpCircle size={20} />
              <span>F.A.Q</span>
            </a>
          </li>
          {/* Add more sidebar items as needed */}
        </ul>
      </nav>
    </aside>
  );
};

// Stats Card Component
const StatsCard = ({ title, value, icon: Icon, trend, color }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-500 text-sm">{title}</h3>
        <div className="relative group">
          <button className="p-1 hover:bg-gray-100 rounded">
            <ChevronDown size={20} />
          </button>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className={`p-3 ${color} rounded-full`}>
          <Icon size={24} className="text-white" />
        </div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className={`text-sm ${trend.type === 'increase' ? 'text-green-500' : 'text-red-500'}`}>
            <span className="font-medium">{trend.value}%</span>
            {trend.type === 'increase' ? ' increase' : ' decrease'}
          </p>
        </div>
      </div>
    </div>
  );
};

// Sales Chart Component
const SalesChart = () => {
  const data = [
    { name: 'Jan', Sales: 4000, Revenue: 2400, Customers: 2400 },
    { name: 'Feb', Sales: 3000, Revenue: 1398, Customers: 2210 },
    { name: 'Mar', Sales: 2000, Revenue: 9800, Customers: 2290 },
    { name: 'Apr', Sales: 2780, Revenue: 3908, Customers: 2000 },
    { name: 'May', Sales: 1890, Revenue: 4800, Customers: 2181 },
    { name: 'Jun', Sales: 2390, Revenue: 3800, Customers: 2500 },
    { name: 'Jul', Sales: 3490, Revenue: 4300, Customers: 2100 },
    { name: 'Aug', Sales: 4000, Revenue: 2400, Customers: 2400 },
    { name: 'Sep', Sales: 3000, Revenue: 1398, Customers: 2210 },
    { name: 'Oct', Sales: 2000, Revenue: 9800, Customers: 2290 },
  ];

  return (
    <div className="bg-white p-6 w-[825px] h-[400px] rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-500 text-sm">Sales Overview</h3>
        <div className="relative group">
          <button className="p-1 hover:bg-gray-100 rounded">
            <ChevronDown size={20} />
          </button>
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="Sales" stroke="#8884d8" />
            <Line type="monotone" dataKey="Revenue" stroke="#82ca9d" />
            <Line type="monotone" dataKey="Customers" stroke="#ffc658" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
// News List


const NewsList = () => {
  const articles = [
    {
      title: "Nihil blanditiis at in nihil autem",
      description: "Sit recusandae non aspernatur laboriosam. Quia enim eligendi sed ut harum...",
      image: "category1.jpg", // Replace with actual image URL
    },
    {
      title: "Quidem autem et impedit",
      description: "Illo nemo neque maiores vitae officiis cum eum turos elan dries werona nande...",
      image: "category6.jpg", // Replace with actual image URL
    },
    {
      title: "Id quia et et ut maxime similique occaecati ut",
      description: "Fugiat voluptas vero eaque accusantium eos. Consequuntur sed ipsam et totam...",
      image: "category4.jpg", // Replace with actual image URL
    },
    {
      title: "Laborum corporis quo dara net para",
      description: "Qui enim quia optio. Eligendi aut asperiores enim repellendus vel rerum cuder...",
      image: "category5.jpg", // Replace with actual image URL
    },
    {
      title: "Et dolores corrupti quae illo quod dolor",
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia, mollitia...",
      image: "category2.jpg", // Replace with actual image URL
    },
  ];

  return (
    <div className="news-container">
      <h3 className="news-header">News & Updates | Today</h3>
      <ul className="news-list">
        {articles.map((article, index) => (
          <li key={index} className="news-item">
            <img src={article.image} alt={article.title} className="news-image" />
            <div className="news-content">
              <h3 className="news-title">{article.title}</h3>
              <p className="news-description">{article.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const RecentSales = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const itemsPerPage = 5; // Number of items per page

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const recentSales = await fetchRecentSales(); // Fetch recent sales using API function
        const sales = recentSales.map((sale) => {
          return {
            id: sale._id,
            customer: `${sale.customerName}`,
            product: sale.productId.name,
            price: `$${sale.productId.price}`,
            status: sale.status,
          };
        });

        setSalesData(sales);
      } catch (error) {
        console.error(error);
        setSalesData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, []);

  // Filter the sales data based on the search term
  const filteredSales = salesData.filter(
    (sale) =>
      sale.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.id.includes(searchTerm)
  );

  // Pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentSales = filteredSales.slice(startIndex, startIndex + itemsPerPage);

  // Check if "Next" button should be disabled
  const isNextDisabled = startIndex + itemsPerPage >= filteredSales.length;

  return (
    <div className="recent-sales-container">
      <div className="header">
        <h3>
          Recent Sales | This Month
        </h3>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-box"
        />
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <table className="sales-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {currentSales.map((sale, index) => (
                <tr key={index}>
                  <td>{sale.id}</td>
                  <td>{sale.customer}</td>
                  <td>{sale.product}</td>
                  <td>{sale.price}</td>
                  <td>
                    <span className={`status ${sale.status.toLowerCase()}`}>
                      {sale.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            <button
              className="pagination-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Previous
            </button>
            <button
              className="pagination-btn"
              disabled={isNextDisabled}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const RecentActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchRecentActivities();
        setActivities(data);
      } catch (error) {
        console.error('Failed to load recent activities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Generate a random color for each activity
  const generateColor = (index) => {
    const colors = ['green', 'red', 'blue', 'cyan', 'yellow', 'gray', 'orange', 'purple', 'pink'];
    return colors[index % colors.length]; // Cycle through the color array
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="recent-activity-container">
      <div className="header">
        <h3>Recent Activities</h3>
      </div>
      <div className="activity-list">
        {activities.map((activity, index) => (
          <div className="activity-item" key={index}>
            <div className="activity-time">{new Date(activity.time).toLocaleTimeString()}</div>
            <div className="activity-marker">
              {/* Assign a unique color to each marker */}
              <div className={`marker-circle`} style={{ backgroundColor: generateColor(index) }}></div>
              {index !== activities.length - 1 && <div className="activity-line"></div>}
            </div>
            <div className="activity-description">{activity.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TopSelling = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getTopProducts = async () => {
      try {
        const data = await fetchTopProducts();
        // Map the data to add static revenue
        const productsWithRevenue = data.map((product) => ({
          image: product.images[0] || '/placeholder.jpg',
          name: product.name,
          price: product.price,
          revenue: Math.round(product.price * 0.2), // Static revenue value
        }));

        setProducts(productsWithRevenue);
      } catch (error) {
        console.error('Error fetching top products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    getTopProducts();
  }, []);

  return (
    <div className="top-selling-container">
      <h2 className="table-header">Top Selling | This Month</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="top-selling-table">
          <thead>
            <tr>
              <th>Preview</th>
              <th>Product</th>
              <th>Price</th>
              <th>Revenue</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={index}>
                <td>
                <img
                  src={`http://localhost:5000/${product.image.replace(/\\/g, '/')}`}
                  alt={product.name}
                  className="product-image"
                />
                </td>
                <td className="productt-name">{product.name}</td>
                <td>₹{product.price.toFixed(2)}</td>
                <td>{product.revenue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const Admin = () => {
const [sidebarOpen, setSidebarOpen] = useState(false);
const [userCount, setUserCount] = useState(null);

  useEffect(() => {
    const loadUserCount = async () => {
      try {
        const count = await fetchUserCount();
        setUserCount(count);
      } catch (error) {
        console.error('Error fetching user count:', error);
      }
    };

    loadUserCount();
  }, []);

  const [salesCount, setSalesCount] = useState(0);

  useEffect(() => {
    // Fetch sales count when component mounts
    const getSalesCount = async () => {
      try {
        const count = await fetchSalesCount();
        setSalesCount(count); // Update the sales count state
      } catch (error) {
        console.error('Error fetching sales count:', error);
      }
    };

    getSalesCount();
  }, []);
  const [revenue, setRevenue] = useState(0);
  useEffect(() => {
    // Fetch sales count when component mounts
    const getRevenuedata = async () => {
      try {
        const price = await fetchRevenue();
        console.log(price);
        setRevenue(price);
      }catch(error){
        console.error('Error fetching sales count:', error);
      }
    };
    getRevenuedata();
  },[]);

  
return (
  <Router>
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="pt-16 lg:pl-64">
          <div className="p-4">
            <Routes>
              <Route
                path="/"
                element={
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <StatsCard
                        title={<span className="text-xl font-bold">Sales</span>}
                        value={salesCount}
                        icon={ShoppingCart}
                        trend={{ type: 'increase', value: 12 }}
                        color="bg-blue-500"
                      />
                      <StatsCard
                        title={<span className="text-xl font-bold">Revenue</span>}
                        value={revenue}
                        icon={DollarSign}
                        trend={{ type: 'increase', value: 8 }}
                        color="bg-green-500"
                      />
                      <StatsCard
                        title={<span className="text-xl font-bold">Customers</span>}
                        value={userCount}
                        icon={Users}
                        trend={{ type: 'decrease', value: 12 }}
                        color="bg-orange-500"
                      />
                      <StatsCard
                        title={<span className="text-xl font-bold">Reports</span>}
                        value="18"
                        icon={BarChart2}
                        trend={{ type: 'increase', value: 5 }}
                        color="bg-purple-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                      <SalesChart />
                      <RecentActivity />
                      <RecentSales />
                      <NewsList />
                      <TopSelling />
                    </div>
                  </div>
                }
              />
              <Route path="/" element={<Admin />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  </Router>
);
};

export default Admin;