import React, { useState } from "react";

const AdminDashboard = () => {
  // Sample data for dashboard metrics
  const metrics = [
    { title: "Total Users", value: "12,361", change: "+12%", icon: "👥" },
    { title: "Revenue", value: "$24,894", change: "+18%", icon: "💰" },
    { title: "Orders", value: "1,286", change: "-3%", icon: "🛒" },
    { title: "Conversion Rate", value: "23.8%", change: "+7%", icon: "📊" },
  ];

  // Sample recent activity data
  const recentActivities = [
    { user: "John Doe", action: "placed an order", time: "2 minutes ago" },
    {
      user: "Sarah Johnson",
      action: "updated profile",
      time: "15 minutes ago",
    },
    {
      user: "Mike Wilson",
      action: "cancelled subscription",
      time: "1 hour ago",
    },
    { user: "Emily Davis", action: "made a payment", time: "3 hours ago" },
  ];

  // Sample transactions data
  const transactions = [
    {
      id: "#45621",
      user: "John Doe",
      date: "24 Oct 2023",
      amount: "$125.99",
      status: "Completed",
    },
    {
      id: "#45622",
      user: "Sarah Johnson",
      date: "24 Oct 2023",
      amount: "$89.95",
      status: "Completed",
    },
    {
      id: "#45623",
      user: "Mike Wilson",
      date: "23 Oct 2023",
      amount: "$215.50",
      status: "Pending",
    },
    {
      id: "#45624",
      user: "Emily Davis",
      date: "23 Oct 2023",
      amount: "$49.00",
      status: "Failed",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex-1 container mx-auto px-4 py-6">
        <div className="flex text-2xl font-bold justify-center items-center">AdminPanel</div>
      </div>
    </div>
    // <div className="flex flex-col min-h-screen bg-gray-50">
    //   <div className="flex-1 container mx-auto px-4 py-6">
    //       {/* Metrics Cards */}
    //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    //         {metrics.map((metric, index) => (
    //           <div key={index} className="bg-white rounded-xl shadow-sm p-6">
    //             <div className="flex justify-between items-start">
    //               <div>
    //                 <p className="text-gray-500 text-sm">{metric.title}</p>
    //                 <h3 className="text-2xl font-bold mt-2">{metric.value}</h3>
    //                 <span className={`text-sm ${metric.change.includes('+') ? 'text-green-500' : 'text-red-500'}`}>
    //                   {metric.change} from last week
    //                 </span>
    //               </div>
    //               <div className="text-3xl">{metric.icon}</div>
    //             </div>
    //           </div>
    //         ))}
    //       </div>

    //       {/* Charts and Activity Section */}
    //       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    //         {/* Recent Activity */}
    //         <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
    //           <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
    //           <div className="space-y-4">
    //             {recentActivities.map((activity, index) => (
    //               <div key={index} className="flex items-start">
    //                 <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 mr-3">
    //                   👤
    //                 </div>
    //                 <div>
    //                   <p className="font-medium">
    //                     <span className="text-blue-600">{activity.user}</span> {activity.action}
    //                   </p>
    //                   <p className="text-gray-500 text-sm">{activity.time}</p>
    //                 </div>
    //               </div>
    //             ))}
    //           </div>
    //         </div>

    //         {/* Recent Transactions */}
    //         <div className="bg-white rounded-xl shadow-sm p-6">
    //           <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
    //           <div className="space-y-4">
    //             {transactions.map((transaction, index) => (
    //               <div key={index} className="flex justify-between items-center border-b pb-3 last:border-0 last:pb-0">
    //                 <div>
    //                   <p className="font-medium">{transaction.id}</p>
    //                   <p className="text-gray-500 text-sm">{transaction.user}</p>
    //                 </div>
    //                 <div className="text-right">
    //                   <p className="font-medium">{transaction.amount}</p>
    //                   <p className={`text-sm ${
    //                     transaction.status === 'Completed' ? 'text-green-500' :
    //                     transaction.status === 'Pending' ? 'text-yellow-500' : 'text-red-500'
    //                   }`}>
    //                     {transaction.status}
    //                   </p>
    //                 </div>
    //               </div>
    //             ))}
    //           </div>
    //         </div>
    //       </div>

    //       {/* Quick Stats */}
    //       <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
    //         <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
    //         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    //           <div className="text-center p-4 bg-blue-50 rounded-lg">
    //             <p className="text-2xl font-bold">72%</p>
    //             <p className="text-gray-600">New Customers</p>
    //           </div>
    //           <div className="text-center p-4 bg-green-50 rounded-lg">
    //             <p className="text-2xl font-bold">18.5%</p>
    //             <p className="text-gray-600">Conversion Rate</p>
    //           </div>
    //           <div className="text-center p-4 bg-yellow-50 rounded-lg">
    //             <p className="text-2xl font-bold">3:42</p>
    //             <p className="text-gray-600">Avg. Session</p>
    //           </div>
    //           <div className="text-center p-4 bg-purple-50 rounded-lg">
    //             <p className="text-2xl font-bold">$24.50</p>
    //             <p className="text-gray-600">Avg. Order Value</p>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
  );
};

export default AdminDashboard;
