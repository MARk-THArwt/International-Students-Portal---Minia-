import React, { useEffect, useState, useMemo } from "react";
import { 
  Trash2, 
  Search, 
  Filter, 
  ArrowUpDown,
  UserPlus,
  Loader2,
  AlertCircle
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../store/hooks/hook";
import { 
  getAllUsers, 
  deleteUser, 
  selectAllUsers, 
  selectUsersLoading,
  selectUsersPagination
} from "../../store/slices/authSlice";
import { ReusableTable, type ColumnConfig } from "../../component/DashbordComp/table";
import type { User } from "../../store/slices/authSlice";

// ─── Delete Button Component ──────────────────────────────────────────────────
const DeleteButton = ({ userId }: { userId: string }) => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectUsersLoading);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      await dispatch(deleteUser(userId));
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isLoading}
      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      title="Delete User"
    >
      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
    </button>
  );
};

// ─── Users Page Component ─────────────────────────────────────────────────────
export const UsersPage = () => {
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectAllUsers);
  const isLoading = useAppSelector(selectUsersLoading);
  const pagination = useAppSelector(selectUsersPagination);

  // Local State for Filtering/Sorting (UI only)
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  useEffect(() => {
    dispatch(getAllUsers({ page: 1, limit: 100 })); // Fetch a large batch for client-side filtering
  }, [dispatch]);

  // Client-side Filter/Sort Logic
  const filteredData = useMemo(() => {
    let result = [...users];

    // 1. Search Filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (u) => 
          u.name.toLowerCase().includes(term) || 
          u.email.toLowerCase().includes(term)
      );
    }

    // 2. Role Filter
    if (roleFilter !== "all") {
      result = result.filter((u) => u.role === roleFilter);
    }

    // 3. Sorting
    result.sort((a, b) => {
      // Assuming users have a createdAt field (standard in Mongoose)
      const dateA = new Date((a as any).createdAt || 0).getTime();
      const dateB = new Date((b as any).createdAt || 0).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [users, searchTerm, roleFilter, sortOrder]);

  const columns: ColumnConfig<User>[] = [
    {
      key: "avatar",
      label: "User",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
            {row.avatar ? (
              <img src={row.avatar} alt={row.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs font-bold text-gray-400">{row.name.charAt(0)}</span>
            )}
          </div>
          <span className="font-medium text-gray-900">{row.name}</span>
        </div>
      ),
    },
    { key: "email", label: "Email" },
    { 
      key: "role", 
      label: "Role",
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${
          row.role === 'admin' ? 'bg-purple-100 text-purple-700' :
          row.role === 'staff' ? 'bg-blue-100 text-blue-700' :
          'bg-green-100 text-green-700'
        }`}>
          {row.role}
        </span>
      )
    },
    {
      key: "createdAt",
      label: "Joined",
      render: (row) => new Date((row as any).createdAt).toLocaleDateString()
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => <DeleteButton userId={row._id} />
    }
  ];

  // Extra Actions (Search & Filter Bar)
  const TableActions = (
    <div className="flex flex-wrap items-center gap-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none w-64"
        />
      </div>

      {/* Role Filter */}
      <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
        <Filter className="w-4 h-4 text-gray-400" />
        <select 
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="bg-transparent text-sm text-gray-700 outline-none cursor-pointer"
        >
          <option value="all">All Roles</option>
          <option value="student">Student</option>
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Sort Order */}
      <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
        <ArrowUpDown className="w-4 h-4 text-gray-400" />
        <select 
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as any)}
          className="bg-transparent text-sm text-gray-700 outline-none cursor-pointer"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500">Monitor and manage all platform accounts</p>
        </div>
      </div>

      <ReusableTable
        columns={columns}
        data={filteredData}
        isLoading={isLoading}
        title="Users List"
        subtitle={`${filteredData.length} users found`}
        filters={TableActions}
      />
    </div>
  );
};
