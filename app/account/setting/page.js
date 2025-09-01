"use client";

import React, { useState, useEffect, useContext, memo } from 'react';
import {
  Bell,
  Shield,
  Globe,
  Sun,
  Trash2,
  Download,
  Eye,
  Mail,
  Smartphone,
  CreditCard,
  Lock,
} from 'lucide-react';

/* ------------------ Toast System ------------------ */
const ToastContext = React.createContext(null);

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const toast = ({ title, description, variant = 'default' }) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, title, description, variant }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 w-full max-w-xs">
        {toasts.map(({ id, title, description, variant }) => (
          <div
            key={id}
            role="alert"
            className={`
              animate-slideInRight rounded-lg border p-4 shadow-lg transition-all duration-300
              ${variant === 'destructive'
                ? 'bg-red-600 text-white border-red-700'
                : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-50 border-gray-200 dark:border-gray-700'}
            `}
          >
            <div className="text-sm font-semibold">{title}</div>
            {description && (
              <div className="text-sm opacity-90">{description}</div>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const useCustomToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useCustomToast must be used within a ToastProvider');
  }
  return context;
};

/* ------------------ Reusable UI Components ------------------ */

// Card Components
const Card = memo(({ children, className = '' }) => (
  <div className={`rounded-lg border bg-white dark:bg-gray-800 shadow-sm ${className}`}>
    {children}
  </div>
));
Card.displayName = "Card";

const CardHeader = memo(({ children, className = '' }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>{children}</div>
));
CardHeader.displayName = "CardHeader";

const CardTitle = memo(({ children, className = '' }) => (
  <h3 className={`text-xl font-semibold tracking-tight ${className}`}>{children}</h3>
));
CardTitle.displayName = "CardTitle";

const CardContent = memo(({ children, className = '' }) => (
  <div className={`p-6 pt-0 ${className}`}>{children}</div>
));
CardContent.displayName = "CardContent";

const Button = memo(({ children, onClick, variant = 'default', size = 'default', className = '', ...props }) => {
  const base = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50';
  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    destructive: 'bg-red-600 text-white hover:bg-red-700',
    outline: 'border border-gray-300 dark:border-gray-600 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700',
    secondary: 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-50 hover:bg-gray-200 dark:hover:bg-gray-600',
    ghost: 'hover:bg-gray-100 dark:hover:bg-gray-700',
    link: 'text-blue-600 hover:underline'
  };
  const sizes = {
    default: 'h-9 px-4 text-sm',
    sm: 'h-8 px-3 text-xs',
    lg: 'h-10 px-6 text-base',
    icon: 'h-9 w-9'
  };

  return (
    <button
      onClick={onClick}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});
Button.displayName = "Button";

const Switch = memo(({ checked, onCheckedChange, id }) => (
  <button
    id={id}
    role="switch"
    aria-checked={checked}
    aria-label={id}
    onClick={() => onCheckedChange(!checked)}
    className={`relative inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer rounded-full transition-colors ${checked ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'}`}
  >
    <span
      className={`absolute left-0.5 top-0.5 h-5 w-5 transform rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : ''}`}
    />
  </button>
));
Switch.displayName = "Switch";

const Label = memo(({ children, htmlFor, className = '' }) => (
  <label htmlFor={htmlFor} className={`text-sm font-medium ${className}`}>{children}</label>
));
Label.displayName = "Label";

const Separator = memo(() => <hr className="my-4 border-gray-200 dark:border-gray-700" />);
Separator.displayName = "Separator";

const Badge = memo(({ children, variant = 'default' }) => {
  const variants = {
    default: 'bg-blue-600 text-white',
    secondary: 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-50',
    destructive: 'bg-red-600 text-white',
    outline: 'border border-gray-300 dark:border-gray-600'
  };
  return <span className={`px-2 py-0.5 text-xs rounded-full ${variants[variant]}`}>{children}</span>;
});
Badge.displayName = "Badge";

const SettingItem = memo(({ title, description, id, children, className = '' }) => (
  <div className={`flex justify-between items-center ${className}`}>
    <div>
      <Label htmlFor={id}>{title}</Label>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
    {children}
  </div>
));
SettingItem.displayName = "SettingItem";

/* ------------------ Settings Section Components ------------------ */

const ThemeSettings = memo(({ settings, updateSetting }) => (
  <Card>
    <CardHeader>
      <CardTitle><Sun className="h-5 w-5 mr-2 inline" />Theme</CardTitle>
    </CardHeader>
    <CardContent>
      <SettingItem title="Dark Mode" description="Toggle between light and dark themes" id="dark-mode">
        <Switch id="dark-mode" checked={settings.darkMode} onCheckedChange={val => updateSetting("darkMode", val)} />
      </SettingItem>
    </CardContent>
  </Card>
));
ThemeSettings.displayName = "ThemeSettings";

const NotificationSettings = memo(({ settings, updateSetting }) => {
  const notificationOptions = [
    { id: "emailNotifications", label: "Email Notifications", description: "Receive updates via email" },
    { id: "smsNotifications", label: "SMS Notifications", description: "Get updates by SMS" },
    { id: "orderUpdates", label: "Order Updates", description: "Order status changes" },
    { id: "promotionalEmails", label: "Promotional Emails", description: "Newsletters and offers" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle><Bell className="h-5 w-5 mr-2 inline" />Notifications</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {notificationOptions.map((item, index) => (
          <React.Fragment key={item.id}>
            <SettingItem
              title={item.label}
              description={item.description}
              id={item.id}
            >
              <Switch id={item.id} checked={settings[item.id]} onCheckedChange={val => updateSetting(item.id, val)} />
            </SettingItem>
            {index < notificationOptions.length - 1 && <Separator />}
          </React.Fragment>
        ))}
      </CardContent>
    </Card>
  );
});
NotificationSettings.displayName = "NotificationSettings";

const PrivacySecuritySettings = memo(({ settings, updateSetting }) => (
  <Card>
    <CardHeader>
      <CardTitle><Shield className="h-5 w-5 mr-2 inline" />Privacy & Security</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <SettingItem title={<>Two-Factor Authentication <Badge variant="secondary">Recommended</Badge></>} description="Extra security layer" id="two-factor">
        <Switch id="two-factor" checked={settings.twoFactorAuth} onCheckedChange={val => updateSetting("twoFactorAuth", val)} />
      </SettingItem>
      <Separator />
      <SettingItem title="Data Sharing" description="Allow anonymized data usage" id="data-sharing">
        <Switch id="data-sharing" checked={settings.dataSharing} onCheckedChange={val => updateSetting("dataSharing", val)} />
      </SettingItem>
      <Separator />
      <SettingItem title="Change Password" description="Update your password">
        <Button variant="outline"><Lock className="h-4 w-4 mr-2" />Change</Button>
      </SettingItem>
    </CardContent>
  </Card>
));
PrivacySecuritySettings.displayName = "PrivacySecuritySettings";

const AccountManagementSettings = memo(({ exportData, deleteAccount }) => (
  <Card>
    <CardHeader>
      <CardTitle><Globe className="h-5 w-5 mr-2 inline" />Account Management</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <SettingItem title="Download Data" description="Export order history">
        <Button variant="outline" onClick={exportData}><Download className="h-4 w-4 mr-2" />Export</Button>
      </SettingItem>
      <Separator />
      <SettingItem title="Account Visibility" description="Control profile appearance">
        <Button variant="outline"><Eye className="h-4 w-4 mr-2" />Manage</Button>
      </SettingItem>
      <Separator />
      <SettingItem title={<Label className="text-red-600">Delete Account</Label>} description="Permanently delete data">
        <Button variant="destructive" onClick={deleteAccount}><Trash2 className="h-4 w-4 mr-2" />Delete</Button>
      </SettingItem>
    </CardContent>
  </Card>
));
AccountManagementSettings.displayName = "AccountManagementSettings";

const ConnectedServicesSettings = memo(() => {
  const serviceItems = [
    { icon: Mail, title: "Email Verification", desc: "Your email is verified", badge: "Verified" },
    { icon: Smartphone, title: "Phone Number", desc: "Add your phone number", action: "Add" },
    { icon: CreditCard, title: "Payment Methods", desc: "Manage payment options", action: "Manage" },
  ];

  return (
    <Card>
      <CardHeader><CardTitle>Connected Services</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        {serviceItems.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center p-4 border rounded-lg dark:border-gray-700">
            <div className="flex items-center gap-3">
              <item.icon className="h-5 w-5 text-gray-400" />
              <div>
                <h4 className="font-medium">{item.title}</h4>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            </div>
            {item.badge ? (
              <Badge variant="secondary">{item.badge}</Badge>
            ) : (
              <Button variant="outline" size="sm">{item.action}</Button>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
});
ConnectedServicesSettings.displayName = "ConnectedServicesSettings";

/* ------------------ Main App Component ------------------ */

const SettingsComponent = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    orderUpdates: true,
    promotionalEmails: false,
    twoFactorAuth: false,
    dataSharing: false,
    darkMode: false,
  });

  const { toast } = useCustomToast();

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    toast({ title: "Setting updated", description: "Your preferences have been saved." });
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    settings.darkMode
      ? document.documentElement.classList.add('dark')
      : document.documentElement.classList.remove('dark');
  }, [settings.darkMode]);

  const exportData = () => toast({
    title: "Export started",
    description: "You’ll receive an email with your data export soon."
  });

  const deleteAccount = () => toast({
    title: "Account deletion requested",
    description: "Please check your email for confirmation.",
    variant: "destructive"
  });

  return (
    <div className="p-6 md:p-12 min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center text-gray-900 dark:text-gray-50">
      <div className="w-full max-w-2xl space-y-6">
        <h1 className="text-3xl font-bold text-center mb-8">⚙️ User Settings</h1>

        <ThemeSettings settings={settings} updateSetting={updateSetting} />
        <NotificationSettings settings={settings} updateSetting={updateSetting} />
        <PrivacySecuritySettings settings={settings} updateSetting={updateSetting} />
        <AccountManagementSettings exportData={exportData} deleteAccount={deleteAccount} />
        <ConnectedServicesSettings />
      </div>
    </div>
  );
};

const App = () => (
  <ToastProvider>
    <SettingsComponent />
  </ToastProvider>
);

export default App;