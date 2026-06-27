"use client";

import { useState } from "react";
import { UploadDropzone } from "@/lib/uploadthing";
import { updateAvatar, changePassword, updateProfile } from "@/app/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, Lock, Mail, User, Shield, GraduationCap, Briefcase } from "lucide-react";
import { useSession } from "next-auth/react";

export function ProfileClient({ user, details }: { user: any, details?: any }) {
  const { update } = useSession();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Basic Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({ name: user.name, email: user.email });
  const [profileError, setProfileError] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError("");
    setIsSavingProfile(true);

    try {
      const res = await updateProfile(profileData.name, profileData.email);
      if (res.error) {
        setProfileError(res.error);
      } else {
        setIsEditingProfile(false);
        // Force reload or optimistic update (reload is safer for session updates)
        window.location.reload();
      }
    } catch (err) {
      setProfileError("An error occurred");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess(false);

    if (passwords.new !== passwords.confirm) {
      setPasswordError("New passwords do not match");
      return;
    }

    try {
      const res = await changePassword(passwords.current, passwords.new);
      if (res.error) {
        setPasswordError(res.error);
      } else {
        setPasswordSuccess(true);
        setPasswords({ current: "", new: "", confirm: "" });
        setIsChangingPassword(false);
      }
    } catch (err) {
      setPasswordError("An error occurred");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10 h-full overflow-y-auto pb-10">
      
      {/* Left Column - Avatar & Basic Info */}
      <div className="lg:col-span-1 space-y-6">
        <div className="p-6 rounded-3xl border-[0.3px] border-white/40 dark:border-white/10 bg-card/40 backdrop-blur-xl flex flex-col items-center shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent"></div>
          
          <div className="relative mt-8 mb-4 group">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-background shadow-2xl relative bg-primary/10 flex items-center justify-center text-4xl font-bold text-primary group-hover:brightness-75 transition-all">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user.name.charAt(0)
              )}
            </div>
            
            <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <Camera className="w-8 h-8 text-white drop-shadow-md" />
            </div>

            <div className="absolute inset-0 z-20 cursor-pointer overflow-hidden opacity-0">
              <UploadDropzone
                endpoint="avatarUploader"
                onClientUploadComplete={async (res) => {
                  if (res && res[0]) {
                    await updateAvatar(res[0].url);
                    await update({ image: res[0].url });
                    window.location.reload();
                  }
                }}
                onUploadError={(error: Error) => {
                  alert(`ERROR! ${error.message}`);
                }}
                config={{ mode: "auto" }}
              />
            </div>
          </div>

          {!isEditingProfile ? (
            <div className="flex flex-col items-center w-full">
              <h2 className="text-xl font-bold text-foreground mt-2">{user.name}</h2>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                <Mail className="w-3.5 h-3.5" /> {user.email}
              </p>
              <div className="mt-4 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wider">
                {user.role}
              </div>
              <Button onClick={() => setIsEditingProfile(true)} variant="outline" size="sm" className="mt-6 rounded-xl border-white/10 w-full">
                Edit Profile
              </Button>
            </div>
          ) : (
            <form onSubmit={handleProfileSubmit} className="w-full mt-4 space-y-4 animate-in fade-in zoom-in-95 duration-200">
              {profileError && <p className="text-red-500 text-xs text-center">{profileError}</p>}
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground ml-1">Full Name</label>
                <Input 
                  required 
                  value={profileData.name} 
                  onChange={e => setProfileData({...profileData, name: e.target.value})} 
                  className="bg-background/50 border-white/10 rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground ml-1">Email Address</label>
                <Input 
                  required type="email"
                  value={profileData.email} 
                  onChange={e => setProfileData({...profileData, email: e.target.value})} 
                  className="bg-background/50 border-white/10 rounded-xl"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => setIsEditingProfile(false)} className="flex-1 rounded-xl" disabled={isSavingProfile}>Cancel</Button>
                <Button type="submit" className="flex-1 rounded-xl bg-primary text-primary-foreground" disabled={isSavingProfile}>
                  {isSavingProfile ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          )}
        </div>

      </div>

      {/* Right Column - Details & Security */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Read Only Details */}
        {details && (
          <div className="p-6 rounded-3xl border-[0.3px] border-white/40 dark:border-white/10 bg-card/40 backdrop-blur-xl shadow-xl">
            <h3 className="text-sm font-semibold mb-6 flex items-center gap-2 text-foreground">
              {user.role === 'STUDENT' ? <GraduationCap className="w-4 h-4 text-primary" /> : <Briefcase className="w-4 h-4 text-primary" />}
              Academic Profile
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(details).map(([key, value]) => {
                if (!value || typeof value === 'object') return null;
                const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                return (
                  <div key={key} className="space-y-1">
                    <label className="text-xs text-muted-foreground ml-1">{formattedKey}</label>
                    <div className="w-full rounded-xl border border-white/10 bg-background/50 px-4 py-2.5 text-sm font-medium text-foreground">
                      {String(value)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Security / Password Change */}
        <div className="p-6 rounded-3xl border-[0.3px] border-white/40 dark:border-white/10 bg-card/40 backdrop-blur-xl shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
              <Shield className="w-4 h-4 text-primary" />
              Security Settings
            </h3>
            {!isChangingPassword && (
              <Button onClick={() => setIsChangingPassword(true)} variant="outline" size="sm" className="rounded-xl border-white/10">
                <Lock className="w-3.5 h-3.5 mr-2" /> Change Password
              </Button>
            )}
          </div>

          {passwordSuccess && (
            <div className="mb-4 p-3 bg-green-500/10 text-green-500 rounded-xl text-sm border border-green-500/20">
              Password updated successfully!
            </div>
          )}

          {isChangingPassword ? (
            <form onSubmit={handlePasswordSubmit} className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
              {passwordError && <p className="text-red-500 text-sm px-2">{passwordError}</p>}
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground ml-1">Current Password</label>
                <Input 
                  required type="password" 
                  value={passwords.current} 
                  onChange={e => setPasswords({...passwords, current: e.target.value})} 
                  className="bg-background/50 border-white/10 rounded-xl"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground ml-1">New Password</label>
                  <Input 
                    required type="password" 
                    value={passwords.new} 
                    onChange={e => setPasswords({...passwords, new: e.target.value})} 
                    className="bg-background/50 border-white/10 rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground ml-1">Confirm New Password</label>
                  <Input 
                    required type="password" 
                    value={passwords.confirm} 
                    onChange={e => setPasswords({...passwords, confirm: e.target.value})} 
                    className="bg-background/50 border-white/10 rounded-xl"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => setIsChangingPassword(false)} className="rounded-xl">Cancel</Button>
                <Button type="submit" className="rounded-xl bg-primary text-primary-foreground">Save Password</Button>
              </div>
            </form>
          ) : (
            <div className="text-sm text-muted-foreground">
              Ensure your account is using a long, random password to stay secure.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
