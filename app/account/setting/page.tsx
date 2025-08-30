import React, { useState, useEffect, useContext, memo, FC, ReactNode } from 'react';
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
  LucideIcon
} from 'lucide-react';

/* ------------------ Type Definitions ------------------ */
interface Toast {
  id: number;
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

interface ToastContextType {
  toast: (t: Omit<Toast, 'id'>) => void;
}

interface SettingsState {
  emailNotifications: boolean;
  smsNotifications: boolean;
  orderUpdates: boolean;
  promotionalEmails: boolean;
  twoFactorAuth: boolean;
  dataSharing: boolean;
  darkMode: boolean;
}

interface CardProps {
  children: ReactNode;
  className?: string;
}

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  [key: string]: any;
}

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  id: string;
}

interface LabelProps {
  children: ReactNode;
  htmlFor?: string;
  className?: string;
}

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

/* ------------------ Toast System ------------------ */
const ToastContext = React.createContext<ToastContextType | null>(null);

const ToastProvider: FC<CardProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = ({ title, description, variant = 'default' }: Omit<Toast, 'id'>) => {
    const id = Date.now();
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

/* ------------------ Reusable UI ------------------ */
const Card = memo<FC<CardProps>>(({ children, className = '' }) => (
  <div className={`rounded-lg border bg-white dark:bg-gray-800 shadow-sm ${className}`}>
    {children}
  </div>
));

const CardHeader = memo<FC<CardProps>>(({ children, className = '' }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>{children}</div>
));

const CardTitle = memo<FC<CardProps>>(({ children, className = '' }) => (
  <h3 className={`text-xl font-semibold tracking-tight ${className}`}>{children}</h3>
));

const CardContent = memo<FC<CardProps>>(({ children, className = '' }) => (
  <div className={`p-6 pt-0 ${className}`}>{children}</div>
));

const Button = memo<FC<ButtonProps>>(({ children, onClick, variant = 'default', size = 'default', className = '', ...props }) => {
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

const Switch = memo<FC<SwitchProps>>(({ checked, onCheckedChange, id }) => (
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

const Label = memo<FC<LabelProps>>(({ children, htmlFor, className = '' }) => (
  <label htmlFor={htmlFor} className={`text-sm font-medium ${className}`}>{children}</label>
));

const Separator = memo(() => <hr className="my-4 border-gray-200 dark:border-gray-700" />);

const Badge = memo<FC<BadgeProps>>(({ children, variant = 'default' }) => {
  const variants = {
    default: 'bg-blue-600 text-white',
    secondary: 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-50',
    destructive: 'bg-red-600 text-white',
    outline: 'border border-gray-300 dark:border-gray-600'
  };
  return <span className={`px-2 py-0.5 text-xs rounded-full ${variants[variant]}`}>{children}</span>;
});

/* ------------------ Settings Component ------------------ */
const SettingsComponent: FC = () => {
  const [settings, setSettings] = useState<SettingsState>({
    emailNotifications: true,
    smsNotifications: false,
    orderUpdates: true,
    promotionalEmails: false,
    twoFactorAuth: false,
    dataSharing: false,
    darkMode: false,
  });

  const { toast } = useCustomToast();

  const updateSetting = (key: keyof SettingsState, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    toast({ title: "Setting updated", description: "Your preferences have been saved." });
  };

  useEffect(() => {
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

  interface ServiceItem {
    icon: LucideIcon;
    title: string;
    desc: string;
    badge?: string;
    action?: string;
  }

  const serviceItems: ServiceItem[] = [
    { icon: Mail, title: "Email Verification", desc: "Your email is verified", badge: "Verified" },
    { icon: Smartphone, title: "Phone Number", desc: "Add your phone number", action: "Add" },
    { icon: CreditCard, title: "Payment Methods", desc: "Manage payment options", action: "Manage" },
  ];

  return (
    <div className="p-6 md:p-12 min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center text-gray-900 dark:text-gray-50">
      <div className="w-full max-w-2xl space-y-6">
        <h1 className="text-3xl font-bold text-center mb-8">⚙️ User Settings</h1>

        {/* Theme */}
        <Card>
          <CardHeader><CardTitle><Sun className="h-5 w-5 mr-2 inline" />Theme</CardTitle></CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <Label htmlFor="dark-mode">Dark Mode</Label>
                <p className="text-sm text-gray-500">Toggle between light and dark themes</p>
              </div>
              <Switch id="dark-mode" checked={settings.darkMode} onCheckedChange={val => updateSetting("darkMode", val)} />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader><CardTitle><Bell className="h-5 w-5 mr-2 inline" />Notifications</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {[
              ["emailNotifications", "Email Notifications", "Receive updates via email"],
              ["smsNotifications", "SMS Notifications", "Get updates by SMS"],
              ["orderUpdates", "Order Updates", "Order status changes"],
              ["promotionalEmails", "Promotional Emails", "Newsletters and offers"],
            ].map(([id, label, desc]) => (
              <React.Fragment key={id}>
                <div className="flex justify-between items-center">
                  <div>
                    <Label htmlFor={id}>{label}</Label>
                    <p className="text-sm text-gray-500">{desc}</p>
                  </div>
                  <Switch id={id} checked={settings[id as keyof SettingsState]} onCheckedChange={val => updateSetting(id as keyof SettingsState, val)} />
                </div>
                {id !== "promotionalEmails" && <Separator />}
              </React.Fragment>
            ))}
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card>
          <CardHeader><CardTitle><Shield className="h-5 w-5 mr-2 inline" />Privacy & Security</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <Label htmlFor="two-factor">Two-Factor Authentication <Badge variant="secondary">Recommended</Badge></Label>
                <p className="text-sm text-gray-500">Extra security layer</p>
              </div>
              <Switch id="two-factor" checked={settings.twoFactorAuth} onCheckedChange={val => updateSetting("twoFactorAuth", val)} />
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <div>
                <Label htmlFor="data-sharing">Data Sharing</Label>
                <p className="text-sm text-gray-500">Allow anonymized data usage</p>
              </div>
              <Switch id="data-sharing" checked={settings.dataSharing} onCheckedChange={val => updateSetting("dataSharing", val)} />
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <div>
                <Label>Change Password</Label>
                <p className="text-sm text-gray-500">Update your password</p>
              </div>
              <Button variant="outline"><Lock className="h-4 w-4 mr-2" />Change</Button>
            </div>
          </CardContent>
        </Card>

        {/* Account */}
        <Card>
          <CardHeader><CardTitle><Globe className="h-5 w-5 mr-2 inline" />Account Management</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <Label>Download Data</Label>
                <p className="text-sm text-gray-500">Export order history</p>
              </div>
              <Button variant="outline" onClick={exportData}><Download className="h-4 w-4 mr-2" />Export</Button>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <div>
                <Label>Account Visibility</Label>
                <p className="text-sm text-gray-500">Control profile appearance</p>
              </div>
              <Button variant="outline"><Eye className="h-4 w-4 mr-2" />Manage</Button>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <div>
                <Label className="text-red-600">Delete Account</Label>
                <p className="text-sm text-gray-500">Permanently delete data</p>
              </div>
              <Button variant="destructive" onClick={deleteAccount}><Trash2 className="h-4 w-4 mr-2" />Delete</Button>
            </div>
          </CardContent>
        </Card>

        {/* Connected */}
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
      </div>
    </div>
  );
};

const App: FC = () => (
  <ToastProvider>
    <SettingsComponent />
  </ToastProvider>
);

export default App;
