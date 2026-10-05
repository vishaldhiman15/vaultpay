import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { api } from '@/services/api';
import { AmlAlert, AuditLog } from '@/types';
import { formatDateTime } from '@/lib/utils';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ShieldAlert, FileSearch, Filter } from 'lucide-react';
import { Tabs } from '@/components/ui/Tabs';

export function CompliancePage() {
  const [alerts, setAlerts] = useState<AmlAlert[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const [alertsData, logsData] = await Promise.all([
        api.getAmlAlerts(),
        api.getAuditLogs()
      ]);
      setAlerts(alertsData);
      setLogs(logsData);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const alertsContent = (
    <Card className="p-0 overflow-hidden">
      <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/20">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-red-500" />
          Active AML Alerts
        </h3>
        <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
          <Filter className="h-4 w-4" /> Filter
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="text-xs text-gray-400 uppercase bg-black/40">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Rule Triggered</th>
              <th className="px-6 py-3">Severity</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Created At</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((alert) => (
              <tr key={alert.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="px-6 py-4 font-mono text-xs">{alert.id}</td>
                <td className="px-6 py-4 font-medium text-white">{alert.ruleTriggered}</td>
                <td className="px-6 py-4"><StatusBadge status={alert.severity} /></td>
                <td className="px-6 py-4"><StatusBadge status={alert.status} /></td>
                <td className="px-6 py-4 text-gray-500">{formatDateTime(alert.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );

  const logsContent = (
    <Card className="p-0 overflow-hidden">
      <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/20">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <FileSearch className="h-5 w-5 text-primary" />
          System Audit Logs
        </h3>
        <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
          <Filter className="h-4 w-4" /> Filter
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="text-xs text-gray-400 uppercase bg-black/40">
            <tr>
              <th className="px-6 py-3">Timestamp</th>
              <th className="px-6 py-3">Action</th>
              <th className="px-6 py-3">Details</th>
              <th className="px-6 py-3">IP Address</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{formatDateTime(log.timestamp)}</td>
                <td className="px-6 py-4 font-medium text-white">{log.action}</td>
                <td className="px-6 py-4">{log.details}</td>
                <td className="px-6 py-4 font-mono text-xs text-gray-500">{log.ipAddress}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold text-white tracking-tight">Compliance & Security</h1>
        <p className="text-gray-400 mt-1">Monitor system alerts, AML flags, and audit logs.</p>
      </div>

      <div className="animate-slide-up stagger-1">
        {isLoading ? (
          <div className="h-64 bg-white/5 rounded-xl animate-pulse"></div>
        ) : (
          <Tabs tabs={[
            { id: 'alerts', label: 'AML Alerts', content: alertsContent },
            { id: 'logs', label: 'Audit Logs', content: logsContent }
          ]} />
        )}
      </div>
    </div>
  );
}
