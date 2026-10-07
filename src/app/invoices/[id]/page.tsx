"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Printer,
  Download,
  FileText,
  MapPin,
  User,
  Phone,
  ArrowLeft,
  ChevronRight,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  RefreshCw
} from "lucide-react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { useStore } from "@/store/useStore";
import { fetchInvoiceApi, fetchInvoicePdfBlob, InvoiceData } from "@/services/invoiceApi";

export default function InvoiceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = (params?.id as string) || "";
  const { token } = useStore();

  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  useEffect(() => {
    if (bookingId) {
      loadInvoice();
    }
  }, [bookingId, token]);

  const loadInvoice = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchInvoiceApi(bookingId, token);
      if (res.success && res.data) {
        setInvoice(res.data);
      } else {
        setError(res.message || "Failed to load invoice details.");
      }
    } catch (err: any) {
      setError(err?.message || "An error occurred while fetching invoice.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!bookingId) return;
    setDownloadingPdf(true);
    try {
      const blob = await fetchInvoicePdfBlob(bookingId, token);
      if (blob) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Invoice_${invoice?.invoiceNumber || bookingId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        window.print();
      }
    } catch (err) {
      console.error("PDF download error:", err);
      window.print();
    } finally {
      setDownloadingPdf(false);
    }
  };

  return (
    <>
      <div className="print:hidden">
        <Header />
      </div>

      <main className="flex-1 pt-24 pb-16 font-sans bg-slate-50/50 dark:bg-background print:pt-0 print:pb-0 print:bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6 print:px-0 print:max-w-none">
          
          {/* Top Bar Navigation (Hidden on Print) */}
          <div className="flex items-center justify-between print:hidden">
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-extrabold shadow-sm transition-all cursor-pointer hover:border-accent-lux/40 active:scale-95"
            >
              <ArrowLeft className="w-4 h-4 text-accent-lux" />
              <span>Back</span>
            </button>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
              <Link href="/" className="hover:text-accent-lux transition-colors">Home</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href="/profile?tab=bookings" className="hover:text-accent-lux transition-colors">Bookings</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-foreground font-bold">Tax Invoice</span>
            </div>
          </div>

          {/* Action Bar (Print / PDF Download) (Hidden on Print) */}
          {invoice && (
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm print:hidden">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-accent-lux/10 text-accent-lux flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">Tax Invoice #{invoice.invoiceNumber}</h3>
                  <p className="text-[11px] text-slate-400 font-medium">Ref Booking #{invoice.bookingNumber}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-accent-lux" />
                  <span>Print</span>
                </button>
                <button
                  type="button"
                  disabled={downloadingPdf}
                  onClick={handleDownloadPdf}
                  className="px-4 py-2 rounded-xl bg-accent-lux hover:bg-accent-lux/90 text-white text-xs font-extrabold shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {downloadingPdf ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          )}

          {/* Main Invoice Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-8 print:border-none print:shadow-none print:p-4 print:rounded-none">
            {loading ? (
              <div className="py-20 text-center space-y-3">
                <RefreshCw className="w-8 h-8 text-accent-lux animate-spin mx-auto" />
                <p className="text-xs font-bold text-slate-500">Fetching official invoice...</p>
              </div>
            ) : error ? (
              <div className="py-16 px-6 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div className="max-w-md mx-auto">
                  <h4 className="text-base font-bold text-foreground">Invoice Not Found</h4>
                  <p className="text-xs text-slate-400 mt-1">{error}</p>
                </div>
                <button
                  type="button"
                  onClick={loadInvoice}
                  className="px-5 py-2.5 bg-accent-lux text-white text-xs font-bold rounded-xl shadow-md hover:bg-accent-lux/90 transition-all cursor-pointer"
                >
                  Retry Loading
                </button>
              </div>
            ) : invoice ? (
              <div className="space-y-6">
                
                {/* Header Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800 gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-black tracking-tight text-foreground">
                        Help<span className="text-accent-lux">Mate</span>
                      </span>
                      <span className="text-[9px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 uppercase tracking-wide">
                        Tax Invoice
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                      HelpMate Professional Home &amp; Vehicle Care Services
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block">Invoice Number</span>
                    <h2 className="text-xl font-black text-foreground font-mono">{invoice.invoiceNumber}</h2>
                    <div className="flex items-center sm:justify-end gap-2 mt-1">
                      <span className="text-xs text-slate-500">
                        Date: {new Date(invoice.generatedAt || Date.now()).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs font-bold text-accent-lux">
                        Booking #{invoice.bookingNumber}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Customer Details & Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800">
                  <div className="space-y-1 text-left">
                    <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">Billed To</span>
                    <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                      <User className="w-4 h-4 text-accent-lux" />
                      {invoice.customer.name}
                    </h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      +91 {invoice.customer.mobile}
                    </p>
                  </div>

                  <div className="space-y-1 text-left">
                    <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">Service Address</span>
                    <p className="text-xs font-semibold text-foreground flex items-start gap-1.5">
                      <MapPin className="w-4 h-4 text-accent-lux shrink-0 mt-0.5" />
                      <span>
                        {invoice.address.serviceAddress}
                        {invoice.address.landmark ? `, ${invoice.address.landmark}` : ""},{" "}
                        {invoice.address.localityName}, {invoice.address.pincode}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Services Table */}
                <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 uppercase text-[10px] font-extrabold tracking-wider border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="py-3.5 px-4">Service Description</th>
                        <th className="py-3.5 px-4 text-center">Qty</th>
                        <th className="py-3.5 px-4 text-right">Unit Price</th>
                        <th className="py-3.5 px-4 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                      {invoice.items.map((item, idx) => (
                        <React.Fragment key={idx}>
                          <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40">
                            <td className="py-4 px-4 space-y-0.5">
                              <span className="font-bold text-foreground text-xs block">
                                {item.packageName}
                              </span>
                              {item.serviceActionName && (
                                <span className="text-[10px] text-slate-400 block">
                                  {item.serviceActionName} {item.categoryName ? `• ${item.categoryName}` : ""}
                                </span>
                              )}
                            </td>
                            <td className="py-4 px-4 text-center font-bold text-slate-700 dark:text-slate-300">
                              {item.quantity}
                            </td>
                            <td className="py-4 px-4 text-right text-slate-600 dark:text-slate-400">
                              ₹{item.unitPrice}
                            </td>
                            <td className="py-4 px-4 text-right font-extrabold text-foreground">
                              ₹{item.totalPrice}
                            </td>
                          </tr>

                          {/* Selected Addons */}
                          {item.selectedAddons && item.selectedAddons.length > 0 && (
                            item.selectedAddons.map((addon, aIdx) => (
                              <tr key={`addon-${idx}-${aIdx}`} className="bg-amber-500/[0.03] dark:bg-amber-500/[0.05]">
                                <td className="py-2.5 px-4 pl-8 space-y-0.5">
                                  <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                                    <Sparkles className="w-3 h-3 text-amber-500" /> + Add-on: {addon.name}
                                  </span>
                                </td>
                                <td className="py-2.5 px-4 text-center text-[11px] text-slate-600 dark:text-slate-400">
                                  {addon.quantity}
                                </td>
                                <td className="py-2.5 px-4 text-right text-[11px] text-slate-600 dark:text-slate-400">
                                  ₹{addon.unitPrice}
                                </td>
                                <td className="py-2.5 px-4 text-right text-[11px] font-bold text-amber-700 dark:text-amber-400">
                                  ₹{addon.totalPrice}
                                </td>
                              </tr>
                            ))
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Billing Summary Box */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-end pt-2">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 space-y-2 text-left">
                    <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">Payment Summary</span>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Method:</span>
                      <span className="font-bold text-foreground uppercase">
                        {invoice.billing.paymentMethod?.replace(/_/g, " ") || "Pay After Service"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Status:</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        invoice.billing.paymentStatus === "paid"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                      }`}>
                        {invoice.billing.paymentStatus || "pending"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 text-right">
                    <div className="flex justify-between items-center text-xs text-slate-500">
                      <span>Subtotal / MRP:</span>
                      <span className="font-semibold text-foreground">₹{invoice.billing.mrp}</span>
                    </div>
                    {invoice.billing.discount > 0 && (
                      <div className="flex justify-between items-center text-xs text-emerald-600 dark:text-emerald-400">
                        <span>Discount Savings:</span>
                        <span className="font-bold">-₹{invoice.billing.discount}</span>
                      </div>
                    )}
                    {invoice.billing.platformFee > 0 && (
                      <div className="flex justify-between items-center text-xs text-slate-500">
                        <span>Platform / Convenience Fee:</span>
                        <span className="font-semibold text-foreground">₹{invoice.billing.platformFee}</span>
                      </div>
                    )}
                    {invoice.billing.gst > 0 && (
                      <div className="flex justify-between items-center text-xs text-slate-500">
                        <span>Taxes &amp; GST:</span>
                        <span className="font-semibold text-foreground">₹{invoice.billing.gst}</span>
                      </div>
                    )}
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
                      <span className="text-xs font-black uppercase text-foreground">Total Amount Paid</span>
                      <span className="text-2xl font-black text-accent-lux">₹{invoice.billing.totalAmount}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Note */}
                <div className="pt-6 border-t border-slate-200 dark:border-slate-800 text-center space-y-1">
                  <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>Thank you for choosing HelpMate Services!</span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    This is a computer-generated tax invoice and requires no physical signature. For support, email support@helpmate.com
                  </p>
                </div>

              </div>
            ) : null}
          </div>
        </div>
      </main>

      <div className="print:hidden">
        <Footer />
      </div>
    </>
  );
}
