"use client";

import TopNavBar from "@/components/universal/TopNavBar";
import { projectCompilationEventsSubscribe } from "next/dist/build/swc/generated-native";
import { deleteReactDebugChannelForHtmlRequest } from "next/dist/server/dev/debug-channel";
import { Roboto, Gelasio, Fleur_De_Leah } from "next/font/google";
import { useRef, useState, useCallback, useEffect } from "react";
import { useUser } from "@/components/providers/UserProvider";

const SELLER_COMMISSION_PERCENT: Record<string, number> = {
  free: 13,
  pro: 12.5,
  enterprise: 12,
};

function commissionRate(tier: string | undefined): number {
  return SELLER_COMMISSION_PERCENT[tier ?? "free"] ?? 13;
}

const roboto = Roboto({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const gelasio = Gelasio({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

function fileToBase64(file: any): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

function statusIcon(status: any) {
  if (status === "done") return "check_circle";
  if (status === "analyzing") return "progress_activity";
  return "image";
}

function statusColour(status: any) {
  if (status === "done") return "text-emerald-600";
  if (status === "analyzing") return "text-[#775a19] animate-spin";
  return "text-[#5f5e5e]/30";
}

function statusLabel(status: any, error?: string) {
  if (status === "done") return "done";
  if (status === "analyzing") return "analyzing...";
  if (status === "error") return error || "failed";
  return "ready";
}

function formatSize(bytes: any) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

function useRevealSet(ids: string[], staggerMs = 80) {
  const [revealed, setRevealed] = useState<Set<string>>(new Set());

  useEffect(() => {
    const newIds = ids.filter((id: any) => !revealed.has(id));
    if (newIds.length === 0) return;

    const timeouts = newIds.map((id, i) =>
      setTimeout(() => {
        setRevealed((prev) => new Set(prev).add(id));
      }, i * staggerMs),
    );

    return () => timeouts.forEach(clearTimeout);
  }, [ids, revealed, staggerMs]);

  return revealed;
}

const TABS = ["All", "Pending", "Accepted", "Denied"];
const MAX_IMAGES = 50;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function AgentPage() {
  const { tier } = useUser();
  const rate = commissionRate(tier);

  const [activeTab, setActiveTab] = useState<string>("All");
  const [statuses, setStatuses] = useState<any>({});
  const [files, setFiles] = useState<any>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [agentRunning, setAgentRunning] = useState(false);
  const [drafts, setDrafts] = useState<any>([]);
  const [boardVisible, setBoardVisible] = useState(false);
  const inputRef = useRef<any>(null);

  const draftIds = drafts.map((draft: any) => draft.id);
  const revealedDrafts = useRevealSet(draftIds, 120);

  const fileIds = files.map((file: any) => file.id);
  const revealedFiles = useRevealSet(fileIds, 40);

  useEffect(() => {
    if (drafts.length > 0 && !boardVisible) {
      setBoardVisible(true);
    }
  }, [drafts.length, boardVisible]);

  const addFiles = useCallback((incoming: any) => {
    const valid = Array.from(incoming).filter((file: any) =>
      ACCEPTED_TYPES.includes(file.type),
    );

    setFiles((prev: any) => {
      const remaining = MAX_IMAGES - prev.length;
      if (remaining <= 0) return prev;

      const toAdd = valid.slice(0, remaining).map((file: any) => ({
        id: crypto.randomUUID(),
        name: file.name,
        size: file.size,
        file: file,
        status: "ready" as const,
      }));

      return [...prev, ...toAdd];
    });
  }, []);

  const removeFile = (id: any) => {
    if (agentRunning) return;
    setFiles((prev: any) => prev.filter((f: any) => f.id !== id));
  };

  const handleDrop = (event: any) => {
    event.preventDefault();
    setIsDragging(false);
    if (event.dataTransfer.files.length) {
      addFiles(event.dataTransfer.files);
    }
  };

  const handleDragOver = (event: any) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleInputChange = (event: any) => {
    if (event.target.files?.length) {
      addFiles(event.target.files);
      event.target.value = "";
    }
  };

  const processFile = async (uploadFile: any) => {
    setFiles((prev: any) =>
      prev.map((file: any) =>
        file.id === uploadFile.id ? { ...file, status: "analyzing" } : file,
      ),
    );

    try {
      const base64 = await fileToBase64(uploadFile.file);

      const res = await fetch(
        "https://sassysquad-backend-git-story-sa-a9481f-jasons-projects-ac5e4f90.vercel.app/v1/agent/process",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({ image: base64 }),
        },
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Processing Failed");
      }

      const { draft } = await res.json();

      setDrafts((prev: any) => [
        ...prev,
        {
          ...draft,
          fileId: uploadFile.id,
          status: "pending",
          priceOverride: draft.suggestedPrice?.toString() || "",
          qtyOverride: draft.quantityAvailable || 1,
        },
      ]);

      setFiles((prev: any) =>
        prev.map((file: any) =>
          file.id === uploadFile.id ? { ...file, status: "done" } : file,
        ),
      );
    } catch (error: any) {
      setFiles((prev: any) =>
        prev.map((file: any) =>
          file.id === uploadFile.id
            ? { ...file, status: "error", error: error.message }
            : file,
        ),
      );
    }
  };

  const startSession = async () => {
    if (files.length === 0 || agentRunning) return;
    setAgentRunning(true);
    const readyFiles = files.filter((file: any) => file.status === "ready");
    await Promise.allSettled(readyFiles.map((file: any) => processFile(file)));
    setAgentRunning(false);
  };

  const handleAccept = async (draftId: string) => {
    const draft = drafts.find((d: any) => d.id === draftId);
    if (!draft) return;

    setDrafts((prev: any) =>
      prev.map((d: any) => (d.id === draftId ? { ...d, status: "accepting" } : d)),
    );

    try {
      const res = await fetch(
        "https://sassysquad-backend-git-story-sa-a9481f-jasons-projects-ac5e4f90.vercel.app/v1/agent/accept",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({
            title: draft.title,
            description: draft.description,
            category: draft.category,
            tags: draft.tags,
            imageBase64: draft.imageBase64,
            suggestedPrice: draft.suggestedPrice,
            sellerPrice: draft.priceOverride ? parseFloat(draft.priceOverride) : null,
            quantityAvailable: draft.qtyOverride,
          }),
        },
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to publish");
      }

      setDrafts((prev: any) =>
        prev.map((d: any) => (d.id === draftId ? { ...d, status: "accepted" } : d)),
      );
    } catch (error: any) {
      setDrafts((prev: any) =>
        prev.map((d: any) => (d.id === draftId ? { ...d, status: "pending" } : d)),
      );
      console.log("Accept failed: ", error.message);
    }
  };

  const handleDeny = (draftId: string) => {
    setDrafts((prev: any) =>
      prev.map((d: any) => (d.id === draftId ? { ...d, status: "denied" } : d)),
    );
  };

  const doneCount: any = files.filter((file: any) => file.status === "done").length;
  const analyzingCount = files.filter((file: any) => file.status === "analyzing").length;
  const errorCount = files.filter((file: any) => file.status === "error").length;

  const allProcessed =
    files.length > 0 &&
    files.every((f: any) => f.status === "done" || f.status === "error");
  const canAddMore: any = files.length < MAX_IMAGES && !agentRunning;

  const approveAll = async () => {
    const pending = drafts.filter((d: any) => d.status === "pending");
    await Promise.allSettled(pending.map((d: any) => handleAccept(d.id)));
  };

  const updateDraftField = (
    id: string,
    field: "priceOverride" | "qtyOverride",
    value: string | number,
  ) => {
    setDrafts((prev: any) =>
      prev.map((d: any) => (d.id === id ? { ...d, [field]: value } : d)),
    );
  };

  const pendingReview = drafts.filter((d: any) => d.status === "pending").length;
  const publishedCount = drafts.filter((d: any) => d.status === "accepted").length;

  const skeletonCount = files.filter(
    (f: any) => f.status === "analyzing" && !drafts.some((d: any) => d.fileId === f.id),
  ).length;

  const filteredItems = drafts.filter((d: any) => {
    if (activeTab === "All") return true;
    if (activeTab === "Pending") return d.status === "pending";
    if (activeTab === "Accepted")
      return d.status === "accepted" || d.status === "accepting";
    if (activeTab === "Denied") return d.status === "denied";
    return true;
  });

  return (
    <div className="min-h-screen">
      <TopNavBar />
      <main className="pt-32 pb-24 max-w-[1120px] mx-auto px-12">
        <section className="grid grid-cols-4 gap-4 mb-16">
          {[
            {
              label: "Uploaded",
              val: files.length,
              sub: files.length === 0 ? "No images yet" : `${files.length} image${files.length !== 1 ? "s" : ""} in session`,
              bg: "bg-[#f4f3f1]",
            },
            {
              label: "Processed",
              val: doneCount,
              sub: analyzingCount > 0 ? `${analyzingCount} currently analyzing…`
                : errorCount > 0 ? `${errorCount} failed`
                : doneCount > 0 ? "Drafts generated"
                : "Waiting to start",
              bg: "bg-[#efeeec]",
              processing: analyzingCount > 0,
            },
            {
              label: "Pending review",
              val: pendingReview,
              sub: pendingReview > 0 ? "Requires seller approval"
                : drafts.length > 0 ? "All reviewed"
                : "No drafts yet",
              bg: "bg-[#e9e8e6]",
              accent: true,
            },
            {
              label: "Published",
              val: publishedCount,
              sub: publishedCount > 0 ? "Active live listings" : "None published yet",
              bg: "bg-[#e3e2e0]",
            },
          ].map((s, i) => (
            <div key={i} className={`${s.bg} p-8 border-b border-[#d1c5b4]/15 transition-all duration-300`}>
              <span className={`block text-[9px] uppercase tracking-[0.15em] mb-2 ${s.accent ? "text-[#775a19]" : "text-[#5f5e5e]"}`}>
                {s.label}
              </span>
              <span className={`${gelasio.className} text-4xl font-light transition-all duration-300 ${s.accent ? "text-[#775a19]" : "text-[#1a1c1b]"}`}>
                {s.val}
              </span>
              <span className={`block text-[9px] mt-1 transition-colors duration-300 ${s.processing ? "text-[#775a19] animate-pulse" : "text-[#5f5e5e]/60"}`}>
                {s.sub}
              </span>
            </div>
          ))}
        </section>

        <section className="mb-20">
          <div className="bg-[#f4f3f1] border border-[#d1c5b4] overflow-hidden">
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => canAddMore && inputRef.current?.click()}
              className={`relative py-12 px-8 flex flex-col items-center text-center transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
                files.length > 0 ? "border-b border-dashed border-[#d1c5b4]" : ""
              } ${isDragging ? "bg-[#e9e8e6] scale-[1.01]" : canAddMore ? "cursor-pointer hover:bg-[#efeeec]" : ""} ${!canAddMore ? "opacity-40 cursor-not-allowed" : ""}`}
            >
              <input
                ref={inputRef}
                type="file"
                multiple
                accept=".jpg,.jpeg,.png,.webp"
                onChange={handleInputChange}
                className="hidden"
              />
              <span className={`material-symbols-outlined text-4xl mb-3 transition-all duration-300 ${isDragging ? "text-[#775a19] scale-110" : "text-[#7f7667] scale-100"}`}>
                upload_file
              </span>
              <h3 className={`${gelasio.className} text-xl mb-1`}>Drop images here</h3>
              <p className="text-[12px] text-[#5f5e5e] max-w-xs mx-auto leading-relaxed">
                JPEG, PNG, WEBP — up to {MAX_IMAGES} items
              </p>
            </div>

            {files.length > 0 && (
              <div className="px-6 py-4">
                <div className={`transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] overflow-hidden ${agentRunning && analyzingCount > 0 ? "max-h-20 opacity-100 mb-3" : "max-h-0 opacity-0 mb-0"}`}>
                  <div className="px-3 py-2.5 bg-[#775a19]/5 border border-[#775a19]/10 flex items-center gap-3">
                    <span className="material-symbols-outlined animate-spin text-[18px] text-[#775a19]">progress_activity</span>
                    <span className="text-[12px] text-[#775a19]">
                      Processing <span className="font-medium">{analyzingCount} image{analyzingCount !== 1 ? "s" : ""}</span>
                      <span className="text-[#775a19]/50 ml-2">· {doneCount} of {files.length} complete</span>
                    </span>
                  </div>
                </div>

                <div className="max-h-[220px] overflow-y-auto space-y-0.5 pr-1">
                  {files.map((f: any) => {
                    const isRevealed = revealedFiles.has(f.id);
                    return (
                      <div key={f.id} className={`group flex items-center gap-3 py-2 px-2 rounded hover:bg-[#efeeec] transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
                        <span className={`material-symbols-outlined text-[18px] ${statusColour(f.status)} flex-shrink-0`}>
                          {statusIcon(f.status)}
                        </span>
                        <div className="flex-1 min-w-0 flex items-center gap-2">
                          <span className={`text-[12px] truncate transition-colors duration-200 ${
                            f.status === "analyzing" ? "text-[#775a19] font-medium"
                              : f.status === "error" ? "text-red-500" : ""
                          }`}>
                            {f.name}
                          </span>
                          <span className="text-[10px] text-[#5f5e5e]/30 flex-shrink-0">{formatSize(f.size)}</span>
                        </div>
                        <span className={`text-[10px] flex-shrink-0 transition-colors duration-200 ${
                          f.status === "done" ? "text-emerald-600"
                            : f.status === "analyzing" ? "text-[#775a19] animate-pulse"
                            : f.status === "error" ? "text-red-500"
                            : "text-[#5f5e5e]/40"
                        }`}>
                          {statusLabel(f.status, f.error)}
                        </span>
                        {!agentRunning && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFile(f.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-[#5f5e5e]/30 hover:text-red-500 flex-shrink-0 bg-transparent border-none cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px]">close</span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-3 pt-3 border-t border-[#d1c5b4]/20 flex items-center justify-between">
                  <span className="text-[11px] text-[#5f5e5e]/60">
                    {agentRunning
                      ? `${doneCount} of ${files.length} analyzed`
                      : allProcessed
                        ? `All ${files.length} images processed${errorCount > 0 ? ` · ${errorCount} failed` : ""}`
                        : `${files.length} image${files.length !== 1 ? "s" : ""} ready · ${MAX_IMAGES - files.length} slots remaining`}
                  </span>
                  {canAddMore && (
                    <button
                      onClick={() => inputRef.current?.click()}
                      className={`${roboto.className} text-[11px] text-[#775a19] uppercase tracking-[0.1em] font-medium hover:underline cursor-pointer bg-transparent border-none`}
                    >
                      + Add more
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={startSession}
            disabled={files.length === 0 || agentRunning || allProcessed}
            className={`${roboto.className} mt-4 w-full uppercase py-4 text-[11px] tracking-[0.15em] font-medium transition-all duration-300 border-none ${
              files.length === 0 || allProcessed
                ? "bg-[#e3e2e0] text-[#5f5e5e]/40 cursor-not-allowed"
                : agentRunning
                  ? "bg-[#775a19] text-white cursor-wait"
                  : "bg-[#5f5e5e] text-white cursor-pointer hover:bg-[#1a1c1b]"
            }`}
          >
            {agentRunning
              ? `Processing · ${doneCount} of ${files.length} complete`
              : allProcessed
                ? `Session complete${errorCount > 0 ? ` · ${errorCount} failed` : ""}`
                : files.length === 0
                  ? "Start new session"
                  : `Start new session · ${files.filter((f: any) => f.status === "ready").length} image${files.filter((f: any) => f.status === "ready").length !== 1 ? "s" : ""}`}
          </button>
        </section>

        {(drafts.length > 0 || skeletonCount > 0) && (
          <>
            <section
              className={`flex justify-between items-end mb-12 transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
                boardVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <div>
                <h2 className={`${gelasio.className} text-4xl tracking-tight mb-4`}>Review board</h2>
                <div className="flex gap-8">
                  {TABS.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`${roboto.className} transition-all duration-200 bg-transparent border-none pb-2 text-[11px] uppercase tracking-[0.15em] cursor-pointer border-b-2 ${
                        activeTab === tab
                          ? "text-[#1a1c1b] border-b-[#775a19] font-medium"
                          : "text-[#5f5e5e]/60 border-b-transparent hover:text-[#1a1c1b]"
                      }`}
                    >
                      {tab}
                      {tab === "Pending" && pendingReview > 0 && (
                        <span className="ml-1.5 text-[9px] text-[#775a19]">{pendingReview}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={approveAll}
                disabled={pendingReview === 0}
                className={`${roboto.className} border-none px-10 py-4 text-[11px] uppercase tracking-[0.15em] font-medium cursor-pointer transition-all duration-200 ${
                  pendingReview === 0
                    ? "bg-[#e3e2e0] text-[#5f5e5e]/40 cursor-not-allowed"
                    : "bg-[#775a19] text-white hover:opacity-90"
                }`}
              >
                Approve all
              </button>
            </section>

            <div className="flex flex-col gap-24">
              {filteredItems.map((draft: any) => {
                const isML = draft.pricing.source === "ml";
                const isAccepting = draft.status === "accepting";
                const isRevealed = revealedDrafts.has(draft.id);

                // Live payout calc for this draft's current price override
                const priceNum = Number(draft.priceOverride);
                const payoutPreview =
                  !isNaN(priceNum) && priceNum > 0
                    ? priceNum * (1 - rate / 100)
                    : 0;

                return (
                  <article
                    key={draft.id}
                    className={`grid grid-cols-12 gap-12 items-start transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
                      isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                    } ${
                      draft.status === "denied" ? "!opacity-30 pointer-events-none"
                        : draft.status === "accepted" ? "!opacity-50" : ""
                    }`}
                  >
                    <div className="col-span-4 relative">
                      <div className="bg-[#efeeec] aspect-[4/5] overflow-hidden">
                        <img
                          src={`${draft.imageBase64}`}
                          alt={draft.title}
                          className="w-full h-full object-contain transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:scale-105 grayscale-[20%] hover:grayscale-0"
                        />
                      </div>
                      <div className="absolute -bottom-6 -right-6 bg-white p-6 shadow-sm border border-[#d1c5b4]/10">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="material-symbols-outlined filled text-sm text-[#775a19]">auto_awesome</span>
                          <span className="text-[9px] uppercase -tracking-tight text-[#5f5e5e]/80">
                            {isML ? "ML Model" : "AI Estimate"}
                          </span>
                        </div>
                        <span className={`${gelasio.className} text-lg`}>
                          {isML && draft.pricing.confidence ? `${draft.pricing.confidence * 100}%` : "—"}{" "}
                          <span className={`${roboto.className} text-xs text-[#5f5e5e]/60 italic`}>
                            {isML ? "confidence" : "no sales history"}
                          </span>
                        </span>
                      </div>
                    </div>

                    <div className="col-span-7 pt-4">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <span className="block text-[9px] uppercase tracking-[0.2em] text-[#775a19] mb-2">
                            {draft.category}
                          </span>
                          <h3 className={`${gelasio.className} text-[28px] mb-4`}>{draft.title}</h3>
                          <div className="flex gap-2 flex-wrap">
                            {draft.tags.map((tag: any) => (
                              <span key={tag} className="bg-[#e8e2d9] text-[#1d1b16] text-[8px] px-3 py-1 uppercase tracking-[0.15em]">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0 ml-6">
                          <span className="block text-[9px] uppercase tracking-[0.15em] text-[#5f5e5e]/60 mb-1">
                            {isML ? "Optimal price" : "AI Midpoint"}
                          </span>
                          <span className={`${gelasio.className} text-2xl`}>${draft.suggestedPrice ?? "—"}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-px bg-[#d1c5b4]/15 border border-[#d1c5b4]/15 mb-10">
                        {isML ? (
                          <>
                            <div className="bg-[#faf9f7] p-6">
                              <span className="block text-[8px] uppercase tracking-[0.15em] text-[#5f5e5e]/60 mb-2">
                                Est. volume / mo
                              </span>
                              <span className="text-xl font-light text-[#1a1c1b]">
                                {draft.pricing.estVolume || "—"}{" "}
                                <span className="text-xs text-[#5f5e5e]/40">units</span>
                              </span>
                            </div>
                            <div className="bg-[#faf9f7] p-6">
                              <span className="block text-[8px] uppercase tracking-[0.15em] text-[#5f5e5e]/60 mb-2">
                                Max revenue potential
                              </span>
                              <span className={`text-xl font-light text-[#1a1c1b] ${gelasio.className}`}>
                                {draft.pricing.price_range
                                  ? `$${draft.pricing.price_range[0]} — $${draft.pricing.price_range[1]}`
                                  : draft.pricing.suggested_price_range
                                    ? `$${draft.pricing.suggested_price_range[0]} — $${draft.pricing.suggested_price_range[1]}`
                                    : "—"}
                              </span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="bg-[#faf9f7] p-6">
                              <span className="block text-[8px] uppercase tracking-[0.15em] text-[#5f5e5e]/60 mb-2">Market range</span>
                              <span className="text-xl font-light text-[#1a1c1b]">{draft.pricing.range || "—"}</span>
                            </div>
                            <div className="bg-[#faf9f7] p-6">
                              <span className="block text-[8px] uppercase tracking-[0.15em] text-[#5f5e5e]/60 mb-2">Est. volume</span>
                              <span className="text-xl font-light text-[#775a19]">
                                {Array.isArray(draft.pricing.expected_monthly_volume)
                                  ? `${draft.pricing.expected_monthly_volume[1]}—${draft.pricing.expected_monthly_volume[0]}`
                                  : draft.pricing.expected_monthly_volume || "Unknown"}
                              </span>
                            </div>
                          </>
                        )}
                      </div>

                      {draft.description && (
                        <p className="text-[12px] text-[#5f5e5e]/70 leading-relaxed mb-8 max-w-lg">
                          {draft.description}
                        </p>
                      )}

                      <div className="grid grid-cols-2 gap-8 mb-6">
                        <div>
                          <label className="block text-[9px] uppercase tracking-[0.15em] text-[#5f5e5e]/60 mb-3">
                            Price (Override Prediction)
                          </label>
                          <div className="relative group">
                            <span className="absolute left-1 bottom-[10px] text-[#5f5e5e]/40 text-sm pointer-events-none">
                              $
                            </span>
                            
                            <input
                              value={draft.priceOverride}
                              onChange={(e) =>
                                updateDraftField(draft.id, "priceOverride", e.target.value)
                              }
                              disabled={draft.status !== "pending"}
                              placeholder="0.00"
                              className={`${roboto.className} w-full bg-[#f4f3f1] border-0 border-b border-[#d1c5b4] py-2 pl-6 text-sm font-medium focus:outline-none focus:border-[#775a19] transition-colors duration-200 disabled:opacity-50`}
                            />
                          </div>
                          <div
                            className={`${roboto.className} text-[10px] mt-2 transition-all duration-200 ${
                              payoutPreview > 0 ? "text-[#775a19]" : "text-[#5f5e5e]/50"
                            }`}
                          >
                            {payoutPreview > 0 ? (
                              <>
                                You receive{" "}
                                <span className="font-bold">${payoutPreview.toFixed(2)}</span>{" "}
                                after {rate}% commission
                              </>
                            ) : (
                              <>{rate}% commission on your {tier ?? "free"} plan</>
                            )}
                          </div>
                        </div>
                        <div>
                          <label className="block text-[9px] uppercase tracking-[0.15em] text-[#5f5e5e]/60 mb-3">
                            Quantity Available
                          </label>
                          <input
                            type="number"
                            value={draft.qtyOverride}
                            onChange={(e) =>
                              updateDraftField(draft.id, "qtyOverride", parseInt(e.target.value) || 1)
                            }
                            min={1}
                            disabled={draft.status !== "pending"}
                            className={`${roboto.className} pl-2 w-full bg-[#f4f3f1] border-0 border-b border-[#d1c5b4] py-2 text-sm font-medium focus:outline-none focus:border-[#775a19] transition-colors duration-200 disabled:opacity-50`}
                          />
                        </div>
                      </div>

                      <div className="mb-10" />

                      <div className="flex gap-4">
                        {draft.status === "accepted" ? (
                          <div className="flex-1 flex items-center justify-center gap-2 py-4 bg-emerald-50 border border-emerald-200 transition-all duration-500">
                            <span className="material-symbols-outlined text-emerald-600 text-lg">check_circle</span>
                            <span className="text-[11px] uppercase tracking-[0.15em] text-emerald-700 font-medium">
                              Published
                            </span>
                          </div>
                        ) : draft.status === "denied" ? (
                          <div className="flex-1 flex items-center justify-center gap-2 py-4 bg-red-50/50 border border-red-200/50 transition-all duration-500">
                            <span className="text-[11px] uppercase tracking-[0.15em] text-red-400 font-medium">Denied</span>
                          </div>
                        ) : (
                          <>
                            <button
                              onClick={() => handleAccept(draft.id)}
                              disabled={isAccepting}
                              className={`${roboto.className} flex-1 border-none py-4 text-[11px] uppercase tracking-[0.15em] font-medium cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 ${
                                isAccepting ? "bg-[#775a19] text-white cursor-wait" : "bg-[#5f5e5e] text-white hover:bg-[#1a1c1b]"
                              }`}
                            >
                              {isAccepting && (
                                <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                              )}
                              {isAccepting ? "Publishing…" : "Accept & publish"}
                            </button>
                            <button
                              onClick={() => handleDeny(draft.id)}
                              disabled={isAccepting}
                              className={`${roboto.className} px-8 border border-[#d1c5b4] bg-transparent text-[#5f5e5e] py-4 text-[11px] uppercase tracking-[0.15em] font-medium cursor-pointer hover:bg-red-50 hover:text-red-700 hover:border-red-700 transition-all duration-200 disabled:opacity-40 disabled:pointer-events-none`}
                            >
                              Deny
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}

              {activeTab === "All" &&
                Array.from({ length: skeletonCount }).map((_, i) => (
                  <article key={`skeleton-${i}`} className="grid grid-cols-12 gap-12 items-start">
                    <div className="col-span-4 relative">
                      <div className="bg-[#efeeec] aspect-[4/5] overflow-hidden animate-pulse" />
                      <div className="absolute -bottom-6 -right-6 bg-white p-6 shadow-sm border border-[#d1c5b4]/10">
                        <div className="h-3 w-16 bg-[#efeeec] rounded animate-pulse mb-2" />
                        <div className="h-5 w-24 bg-[#efeeec] rounded animate-pulse" />
                      </div>
                    </div>
                    <div className="col-span-7 pt-4">
                      <div className="mb-6">
                        <div className="h-2.5 w-20 bg-[#efeeec] rounded animate-pulse mb-4" />
                        <div className="h-8 w-64 bg-[#efeeec] rounded animate-pulse mb-4" />
                        <div className="flex gap-2">
                          <div className="h-5 w-14 bg-[#efeeec] rounded animate-pulse" />
                          <div className="h-5 w-16 bg-[#efeeec] rounded animate-pulse" />
                          <div className="h-5 w-12 bg-[#efeeec] rounded animate-pulse" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-px bg-[#d1c5b4]/15 border border-[#d1c5b4]/15 mb-10">
                        {[0, 1].map((j) => (
                          <div key={j} className="bg-[#faf9f7] p-6">
                            <div className="h-2 w-24 bg-[#efeeec] rounded animate-pulse mb-3" />
                            <div className="h-6 w-20 bg-[#efeeec] rounded animate-pulse" />
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-8 mb-10">
                        {[0, 1].map((j) => (
                          <div key={j}>
                            <div className="h-2 w-28 bg-[#efeeec] rounded animate-pulse mb-4" />
                            <div className="h-8 w-full bg-[#efeeec] rounded animate-pulse" />
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-1 h-12 bg-[#efeeec] rounded animate-pulse" />
                        <div className="w-28 h-12 bg-[#efeeec] rounded animate-pulse" />
                      </div>
                    </div>
                  </article>
                ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}