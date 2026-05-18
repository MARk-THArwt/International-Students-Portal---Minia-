import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { 
  Trash2, 
  Search, 
  Filter, 
  ArrowUpDown,
  UserPlus,
  Loader2
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../store/hooks/hook";
import { 
  getAllUsers, 
  deleteUser, 
  selectAllUsers, 
  selectUsersLoading
} from "../../store/slices/authSlice";
import { ReusableTable, type ColumnConfig } from "../../component/DashbordComp/table";
import type { User } from "../../store/slices/authSlice";

// ─── Delete Button Component ──────────────────────────────────────────────────
const DeleteButton = ({ userId }: { userId: string }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectUsersLoading);

  const handleDelete = async () => {
    if (window.confirm(t("usersPage.deleteConfirm"))) {
      await dispatch(deleteUser(userId));
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isLoading}
      className="p-2 text-original-danger hover:bg-original-danger-light rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      title={t("usersPage.deleteUser")}
    >
      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
    </button>
  );
};

// ─── Users Page Component ─────────────────────────────────────────────────────
export const UsersPage = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectAllUsers);
  const isLoading = useAppSelector(selectUsersLoading);

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
      label: t("usersPage.columns.user"),
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-original-background-alt flex items-center justify-center overflow-hidden border border-original-border">
            {row.avatar ? (
              <img src={row.avatar} alt={row.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs font-bold text-original-text-muted/70">{row.name.charAt(0)}</span>
            )}
          </div>
          <span className="font-medium text-original-text-dark">{row.name}</span>
        </div>
      ),
    },
    { key: "email", label: t("usersPage.columns.email") },
    { 
      key: "role", 
      label: t("usersPage.columns.role"),
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${
          row.role === 'admin' ? 'bg-original-background-alt text-original-primary-hover' :
          row.role === 'staff' ? 'bg-original-background-alt text-original-primary text-original-primary-hover' :
          'bg-original-success-light text-original-success'
        }`}>
          {t(`usersPage.roles.${row.role}`)}
        </span>
      )
    },
    {
      key: "createdAt",
      label: t("usersPage.columns.joined"),
      render: (row) => new Date((row as any).createdAt).toLocaleDateString(document.documentElement.lang === "ar" ? "ar-EG" : "en-US")
    },
    {
      key: "actions",
      label: t("usersPage.columns.actions"),
      render: (row) => row._id ? <DeleteButton userId={row._id} /> : null
    }
  ];

  // Extra Actions (Search & Filter Bar)
  const TableActions = (
    <div className="flex flex-wrap items-center gap-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-original-text-muted/70" />
        <input
          type="text"
          placeholder={t("usersPage.searchPlaceholder")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="ps-9 pe-4 py-2 bg-original-background-alt border border-original-border rounded-xl text-sm focus:ring-2 focus:ring-original-primary/20 outline-none w-64"
        />
      </div>

      {/* Role Filter */}
      <div className="flex items-center gap-2 bg-original-background-alt border border-original-border rounded-xl px-3 py-2">
        <Filter className="w-4 h-4 text-original-text-muted/70" />
        <select 
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="bg-transparent text-sm text-original-text outline-none cursor-pointer"
        >
          <option value="all">{t("usersPage.allRoles")}</option>
          <option value="student">{t("usersPage.roles.student")}</option>
          <option value="staff">{t("usersPage.roles.staff")}</option>
          <option value="admin">{t("usersPage.roles.admin")}</option>
        </select>
      </div>

      {/* Sort Order */}
      <div className="flex items-center gap-2 bg-original-background-alt border border-original-border rounded-xl px-3 py-2">
        <ArrowUpDown className="w-4 h-4 text-original-text-muted/70" />
        <select 
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as any)}
          className="bg-transparent text-sm text-original-text outline-none cursor-pointer"
        >
          <option value="newest">{t("usersPage.sort.newest")}</option>
          <option value="oldest">{t("usersPage.sort.oldest")}</option>
        </select>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-original-text-dark">{t("usersPage.title")}</h1>
          <p className="text-original-text-muted">{t("usersPage.desc")}</p>
        </div>
        <Link 
          to="/RegisterForm"
          className="flex items-center gap-2 bg-original-primary text-white hover:bg-original-primary-hover text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg dark:shadow-black/20 hover:scale-[1.02] active:scale-[0.98]"
        >
          <UserPlus className="w-4 h-4" />
          {t("usersPage.addNewUser")}
        </Link>
      </div>

      <ReusableTable
        columns={columns}
        data={filteredData}
        isLoading={isLoading}
        title={t("usersPage.usersList")}
        subtitle={t("usersPage.usersFound", { count: filteredData.length })}
        filters={TableActions}
      />
    </div>
  );
};
