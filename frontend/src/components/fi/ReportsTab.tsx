import React from 'react';
import { PoolReport } from '@/types/fi';
import { FileText, Download, TrendingUp, CheckCircle2, Shield, Wrench } from 'lucide-react';
import { formatIDRXFull, formatNumber } from '@/lib/yield';

interface ReportsTabProps {
  reports: PoolReport[];
}

export function ReportsTab({ reports }: ReportsTabProps) {
  if (!reports || reports.length === 0) {
    return (
      <div className="rounded-[1.75rem] border border-zinc-950/10 bg-white p-8 md:p-12 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-50 mb-4 border border-zinc-100">
          <FileText className="h-8 w-8 text-zinc-400" />
        </div>
        <h3 className="text-lg font-bold text-zinc-950">No Reports Available</h3>
        <p className="mt-2 text-sm text-zinc-500">Performance reports will appear here after the first distribution cycle.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Timeline container */}
      <div className="relative border-l-2 border-zinc-100 ml-4 pl-8 space-y-8 py-2">
        {reports.map((report) => {
          const dateObj = new Date(report.period + "-01");
          const monthYear = dateObj.toLocaleDateString("en-US", { month: "long", year: "numeric" });
          
          return (
            <div key={report.id} className="relative">
              {/* Timeline dot */}
              <div className="absolute -left-[41px] top-4 flex h-6 w-6 items-center justify-center rounded-full bg-teal-50 ring-4 ring-[#FAFAFA]">
                <div className="h-2.5 w-2.5 rounded-full bg-teal-500" />
              </div>

              <div className="rounded-[1.5rem] border border-zinc-950/10 bg-white p-6 md:p-8 shadow-sm transition hover:border-teal-500/20">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-flex items-center rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-600">
                        {monthYear}
                      </span>
                      {report.editedByOperator && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700">
                          <CheckCircle2 className="h-3 w-3" /> Operator Verified
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-zinc-950">
                      {report.operatorHeadline || `${monthYear} Performance Report`}
                    </h3>
                  </div>
                  
                  {report.downloadUrl && (
                    <a href={report.downloadUrl} className="inline-flex items-center gap-2 rounded-xl bg-zinc-50 px-4 py-2.5 text-sm font-bold text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-950 border border-zinc-200">
                      <Download className="h-4 w-4" /> Download PDF
                    </a>
                  )}
                </div>

                <div className="mb-6 rounded-2xl bg-zinc-50 p-5 border border-zinc-100">
                  <p className="text-zinc-700 leading-relaxed text-sm">
                    {report.operatorNarrative || report.autoNarrative}
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1 flex items-center gap-1"><Shield className="h-3 w-3" /> Health</span>
                    <span className="text-lg font-bold text-zinc-950">{report.avgCollectionHealth.toFixed(1)}%</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1 flex items-center gap-1"><TrendingUp className="h-3 w-3" /> Yield Paid</span>
                    <span className="text-lg font-bold text-teal-700">{formatIDRXFull(report.yieldDistributed)}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Principal</span>
                    <span className="text-lg font-bold text-zinc-950">{formatIDRXFull(report.principalReturned)}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1 flex items-center gap-1"><Wrench className="h-3 w-3" /> Maintenance</span>
                    <span className="text-lg font-bold text-zinc-950">{report.maintenanceEvents} events</span>
                  </div>
                </div>

                {report.highlights && report.highlights.length > 0 && (
                  <div className="border-t border-zinc-100 pt-5">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3">Key Highlights</h4>
                    <ul className="space-y-2">
                      {report.highlights.map((highlight, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-zinc-700">
                          <CheckCircle2 className="h-4 w-4 text-teal-500 shrink-0 mt-0.5" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
