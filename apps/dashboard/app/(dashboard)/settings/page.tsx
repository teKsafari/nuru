import { Card, CardContent, CardHeader, CardTitle } from "@nuru/ui";
import { Settings } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="space-y-8 pb-12">
            <div>
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">General Settings</h1>
                <p className="text-lg text-slate-500 dark:text-slate-400 mt-1">Manage your account and platform preferences.</p>
            </div>

            <Card className="rounded-[2.5rem] border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
                <CardHeader className="bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800 p-8">
                    <CardTitle className="text-2xl font-bold flex items-center gap-3">
                        <Settings className="h-6 w-6 text-primary" />
                        Platform Settings
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-12 flex flex-col items-center justify-center text-center">
                    <div className="bg-primary/10 rounded-3xl p-6 mb-6">
                        <Settings className="h-12 w-12 text-primary animate-spin-slow" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Coming Soon</h3>
                    <p className="text-slate-500 dark:text-slate-400 max-w-sm mt-3 mb-8 text-lg">
                        We are currently building the settings module. Soon you will be able to manage your organization, roles, and personal preferences here.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
