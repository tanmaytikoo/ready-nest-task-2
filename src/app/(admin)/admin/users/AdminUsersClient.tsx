"use client";

import { useState } from "react";
import { Search, Filter, Trash2, ShieldAlert, ShieldCheck, GraduationCap, Edit, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { deleteUser, updateUser } from "./actions";

export function AdminUsersClient({ initialUsers, departments, semesters }: { initialUsers: any[], departments: any[], semesters: any[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editData, setEditData] = useState({ departmentId: "", semesterId: "" });

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  async function handleDelete(id: string) {
    if (!confirm("DANGER: Are you sure you want to delete this user? All their data (attendance, grades, assignments) will be permanently lost!")) return;
    try {
      await deleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (error: any) {
      alert("Failed to delete user: " + error.message);
    }
  }

  async function handleSaveEdit() {
    if (!editingUser) return;
    try {
      await updateUser(editingUser.id, editingUser.role, editData);
      
      // Update local state
      setUsers(prev => prev.map(u => {
        if (u.id === editingUser.id) {
          const updated = { ...u };
          if (u.role === "STUDENT") {
            updated.student = { 
              ...u.student, 
              department: departments.find(d => d.id === editData.departmentId),
              departmentId: editData.departmentId,
              semester: semesters.find(s => s.id === editData.semesterId),
              semesterId: editData.semesterId
            };
          } else if (u.role === "TEACHER") {
            updated.teacher = {
              ...u.teacher,
              department: departments.find(d => d.id === editData.departmentId),
              departmentId: editData.departmentId
            };
          }
          return updated;
        }
        return u;
      }));
      setEditingUser(null);
    } catch (error: any) {
      alert("Failed to update user: " + error.message);
    }
  }

  function openEdit(user: any) {
    setEditingUser(user);
    if (user.role === "STUDENT") {
      setEditData({ departmentId: user.student?.departmentId || "", semesterId: user.student?.semesterId || "" });
    } else if (user.role === "TEACHER") {
      setEditData({ departmentId: user.teacher?.departmentId || "", semesterId: "" });
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-card/40 backdrop-blur-xl border-[0.3px] border-white/40 dark:border-white/10 p-4 rounded-3xl">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name or email..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-background/50 border-white/10"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Filter className="w-4 h-4 text-muted-foreground hidden md:block" />
          <select 
            className="flex h-10 w-full md:w-auto rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background border-white/10"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="ALL">All Roles</option>
            <option value="STUDENT">Students</option>
            <option value="TEACHER">Teachers</option>
            <option value="ADMIN">Admins</option>
          </select>
        </div>
      </div>

      <div className="bg-card/40 backdrop-blur-xl border-[0.3px] border-white/40 dark:border-white/10 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 border-b border-white/10 text-muted-foreground">
              <tr>
                <th className="p-4 font-medium">User</th>
                <th className="p-4 font-medium">Role</th>
                <th className="p-4 font-medium">Department</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-muted-foreground">No users found.</td>
                </tr>
              ) : (
                filteredUsers.map((user: any) => (
                  <tr key={user.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold overflow-hidden border-[0.3px] border-white/20 shrink-0">
                          {user.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" /> : user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">{user.name}</div>
                          <div className="text-xs text-muted-foreground">{user.email}</div>
                          {user.student && <div className="text-[10px] font-mono text-muted-foreground mt-0.5">{user.student.enrollmentNo}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider
                        ${user.role === 'ADMIN' ? 'bg-red-500/10 text-red-500' 
                        : user.role === 'TEACHER' ? 'bg-blue-500/10 text-blue-500' 
                        : 'bg-green-500/10 text-green-500'}
                      `}>
                        {user.role === 'ADMIN' ? <ShieldAlert className="w-3 h-3" /> : user.role === 'TEACHER' ? <ShieldCheck className="w-3 h-3" /> : <GraduationCap className="w-3 h-3" />}
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {user.student ? (
                        <div>
                          <div>{user.student.department.code}</div>
                          <div className="text-[10px]">Sem {user.student.semester.number}</div>
                        </div>
                      ) : user.teacher ? (
                        <div>{user.teacher.department.name}</div>
                      ) : (
                        <span className="italic text-xs">System Wide</span>
                      )}
                    </td>
                    <td className="p-4 text-right flex justify-end gap-2">
                      <button 
                        onClick={() => openEdit(user)}
                        disabled={user.role === 'ADMIN'}
                        className="p-2 text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-muted-foreground"
                        title={user.role === 'ADMIN' ? "Cannot edit admins here" : "Edit User"}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(user.id)}
                        disabled={user.role === 'ADMIN'}
                        className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-muted-foreground"
                        title={user.role === 'ADMIN' ? "Cannot delete admins here" : "Delete User"}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-background border border-white/10 p-6 rounded-3xl w-full max-w-md shadow-2xl relative">
            <button onClick={() => setEditingUser(null)} className="absolute top-4 right-4 text-muted-foreground hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold mb-1 text-foreground">Edit {editingUser.name}</h2>
            <p className="text-sm text-muted-foreground mb-6">Update their academic placement.</p>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground ml-1">Department</label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background border-white/10 mt-1"
                  value={editData.departmentId}
                  onChange={(e) => setEditData(prev => ({ ...prev, departmentId: e.target.value }))}
                >
                  <option value="">Select Department...</option>
                  {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>

              {editingUser.role === "STUDENT" && (
                <div>
                  <label className="text-xs font-medium text-muted-foreground ml-1">Semester</label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background border-white/10 mt-1"
                    value={editData.semesterId}
                    onChange={(e) => setEditData(prev => ({ ...prev, semesterId: e.target.value }))}
                  >
                    <option value="">Select Semester...</option>
                    {semesters.map(s => <option key={s.id} value={s.id}>Semester {s.number}</option>)}
                  </select>
                </div>
              )}
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setEditingUser(null)} className="border-white/10">Cancel</Button>
              <Button onClick={handleSaveEdit} className="bg-primary text-primary-foreground">Save Changes</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
