import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { Metadata } from "next";
import { ProfileClient } from "@/components/shared/ProfileClient";

export const metadata: Metadata = {
  title: "Profile | Nova Admin",
  description: "Manage your admin profile",
};

export default async function AdminProfilePage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await db.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user || user.role !== "ADMIN") return <div className="p-8 text-red-500">Profile not found or unauthorized.</div>;

  const basicUser = {
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    role: user.role
  };

  const details = {
    accessLevel: "Full System Access",
    adminSince: user.createdAt.toLocaleDateString(),
    systemRole: "Master Administrator",
  };

  return (
    <div className="flex flex-col gap-6 relative z-10 h-[calc(100vh-8rem)]">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gradient">Admin Profile</h1>
        <p className="text-muted-foreground mt-1 text-sm font-normal">Manage your administrator account settings and preferences.</p>
      </div>
      <div className="flex-1 overflow-hidden">
        <ProfileClient user={basicUser} details={details} />
      </div>
    </div>
  );
}
