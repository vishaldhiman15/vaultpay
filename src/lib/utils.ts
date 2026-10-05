import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | string, currency = "INR"): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options,
  });
}

export function formatDateTime(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function maskAccountNumber(accountNumber: string): string {
  if (accountNumber.length <= 4) return accountNumber;
  return "•".repeat(accountNumber.length - 4) + accountNumber.slice(-4);
}

export function maskCardNumber(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\s/g, "");
  if (cleaned.length !== 16) return cardNumber;
  return `•••• •••• •••• ${cleaned.slice(-4)}`;
}

export function formatCardNumber(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\s/g, "");
  return cleaned.replace(/(.{4})/g, "$1 ").trim();
}

export function generateReferenceId(prefix = "VPY"): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

export function getStatusColor(status: string): string {
  const statusMap: Record<string, string> = {
    SUCCESS: "text-emerald-400",
    ACTIVE: "text-emerald-400",
    VERIFIED: "text-emerald-400",
    POSTED: "text-emerald-400",
    APPROVED: "text-emerald-400",
    PENDING: "text-amber-400",
    SUBMITTED: "text-amber-400",
    PROCESSING: "text-blue-400",
    INITIATED: "text-blue-400",
    CREATED: "text-blue-400",
    FAILED: "text-red-400",
    REJECTED: "text-red-400",
    REVERSED: "text-red-400",
    FROZEN: "text-sky-400",
    BLOCKED: "text-red-400",
    CLOSED: "text-gray-500",
    DORMANT: "text-gray-500",
    VOIDED: "text-gray-500",
    PAUSED: "text-amber-400",
    REVOKED: "text-red-400",
    EXPIRED: "text-gray-500",
    CANCELLED: "text-gray-500",
  };
  return statusMap[status] || "text-gray-400";
}

export function getStatusBgColor(status: string): string {
  const statusMap: Record<string, string> = {
    SUCCESS: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
    ACTIVE: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
    VERIFIED: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
    PENDING: "bg-amber-400/10 text-amber-400 border-amber-400/20",
    PROCESSING: "bg-blue-400/10 text-blue-400 border-blue-400/20",
    INITIATED: "bg-blue-400/10 text-blue-400 border-blue-400/20",
    FAILED: "bg-red-400/10 text-red-400 border-red-400/20",
    FROZEN: "bg-sky-400/10 text-sky-400 border-sky-400/20",
    BLOCKED: "bg-red-400/10 text-red-400 border-red-400/20",
  };
  return statusMap[status] || "bg-gray-400/10 text-gray-400 border-gray-400/20";
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
