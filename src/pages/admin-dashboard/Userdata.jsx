import React, { useEffect, useState, useCallback } from "react";
import { getUserData } from "utils/helperFunctions";
import moment from "moment";
import Pagination from "components/ui/Pagination";
import Icon from "../../components/AppIcon"; // Update with the correct path to your Icon component

// Lucide icons we'll be using
import { 
  Filter, 
  Search, 
  Mail, 
  Phone, 
  Calendar, 
  ChevronDown, 
  Users, 
  Eye, 
  Edit, 
  Trash2, 
  Frown,
  X
} from "lucide-react";

// Debounce hook implementation
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const UserData = () => {
  const [userdata, setUserdata] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    mobile: "",
    dateFrom: "",
    dateTo: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 15,
    totalItems: 0,  
    totalPages: 0,
  });

  // Create debounced filter values
  const debouncedName = useDebounce(filters.name, 500);
  const debouncedEmail = useDebounce(filters.email, 500);
  const debouncedMobile = useDebounce(filters.mobile, 500);

  // Fetch data when filters, pagination, or debounced values change
  useEffect(() => {
    fetchUserData();
  }, [
    pagination.currentPage,
    pagination.itemsPerPage,
    debouncedName,
    debouncedEmail,
    debouncedMobile,
    filters.dateFrom,
    filters.dateTo,
  ]);

  const fetchUserData = async() => {
    try {
      setLoading(true);

      // Prepare params with filter values and pagination info
      const params = {
        page: pagination.currentPage,
        limit: pagination.itemsPerPage,
        ...(filters.name && { name: filters.name }),
        ...(filters.email && { email: filters.email }),
        ...(filters.mobile && { mobile: filters.mobile }),
        ...(filters.dateFrom && { dateFrom: filters.dateFrom }),
        ...(filters.dateTo && { dateTo: filters.dateTo }),
      };

      const response = await getUserData(params);

      if (response.success) {
        setUserdata(response.data);

        // Update pagination info from server response
        if (response.pagination) {
          setPagination((prev) => ({
            ...prev,
            totalItems: response.pagination.totalItems,
            totalPages: response.pagination.totalPages,
          }));
        }
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Reset to first page when filters change
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      name: "",
      email: "",
      mobile: "",
      dateFrom: "",
      dateTo: "",
    });
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const handleItemsPerPageChange = (e) => {
    setPagination((prev) => ({
      ...prev,
      itemsPerPage: parseInt(e.target.value),
      currentPage: 1,
    }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex-1 container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              User Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage and view all user accounts
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center space-x-3">
            <button
              onClick={() => {setShowFilters(!showFilters);clearFilters()}}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            >
              <Filter className="w-4 h-4 mr-2" />
              <span>{showFilters ? "Hide Filters" : "Show Filters"}</span>
            </button>
          </div>
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="bg-white shadow-md rounded-xl overflow-hidden mb-6 transition-all duration-300 ease-in-out border border-gray-200">
            <div className="px-6 py-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={filters.name}
                    onChange={handleFilterChange}
                    placeholder="Search by name"
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="email"
                    value={filters.email}
                    onChange={handleFilterChange}
                    placeholder="Search by email"
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="mobile"
                    value={filters.mobile}
                    onChange={handleFilterChange}
                    placeholder="Search by mobile"
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date From
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    name="dateFrom"
                    max={new Date().toISOString().split("T")[0]}
                    value={filters.dateFrom}
                    onChange={handleFilterChange}
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date To
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    name="dateTo"
                    value={filters.dateTo}
                    max={new Date().toISOString().split("T")[0]}
                    disabled={!filters.dateFrom}
                    onChange={handleFilterChange}
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3 border-t border-gray-200">
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors flex items-center"
              >
                <X className="w-4 h-4 mr-2" />
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="rounded-lg bg-blue-100 p-3">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {pagination.totalItems}
                </h2>
                <p className="text-sm text-gray-500">Total Users</p>
              </div>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white shadow-md rounded-xl overflow-hidden mb-6 border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-medium text-gray-900">All Users</h3>
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              <span className="ml-4 text-gray-600">Loading user data...</span>
            </div>
          ) : userdata.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      User
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Contact
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Created
                    </th>
                    {/* <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th> */}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {userdata.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {user.profileImage ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover shadow-sm"
                              src={`${import.meta.env.VITE_APP_BASE_URL}/${user.profileImage}`}
                              alt={user.name}
                            />
                          ) : (
                            <div className="bg-gradient-to-r from-blue-400 to-blue-600 rounded-full h-10 w-10 flex items-center justify-center shadow-sm">
                              <span className="text-white font-medium">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                          {/* <div className="text-xs text-gray-500">
                            {user.addedBy}
                          </div> */}
                        </div>
                      </div>
                    </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {user.email}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.mobile || "N/A"}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {moment(user.createdAt).format("MMM D, YYYY")}
                      </td>
                      {/* <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button className="text-gray-600 hover:text-gray-900 p-1 rounded-full hover:bg-gray-50 transition-colors">
                            <Edit className="w-5 h-5" />
                          </button>
                          <button className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 transition-colors">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            // Empty state
            <div className="text-center py-12">
              <Frown className="mx-auto h-16 w-16 text-gray-300" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                No users found
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Try adjusting your search or filter to find what you're looking
                for.
              </p>
              <div className="mt-6">
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.totalItems > 0 && pagination.totalPages > 1 && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            itemsPerPage={pagination.itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        )}
       
      </div>
    </div>
  );
};

export default UserData;

