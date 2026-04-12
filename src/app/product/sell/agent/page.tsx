"use client";

import TopNavBar from "@/components/universal/TopNavBar";
import { projectCompilationEventsSubscribe } from "next/dist/build/swc/generated-native";
import { Roboto, Gelasio, Fleur_De_Leah } from "next/font/google";
import { useRef, useState, useCallback, useEffect } from "react";

const roboto = Roboto({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const gelasio = Gelasio({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const ITEMS = [
  {
    id: 1,
    category: "Furniture",
    name: "Vintage oak bookshelf",
    tags: ["oak", "vintage", "storage"],
    priceLabel: "Optimal price",
    price: 340,
    metrics: [
      { label: "Est. volume / mo", value: "16—20", suffix: "units" },
      { label: "Max revenue potential", value: "$6,120", accent: true },
    ],
    confidence: 92,
    qty: 12,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAfM2XPNjOoNKA_Ke5rcHdFEONWP3bdSPwvsl0BeDUROcQ7bXIaCXhoRB8JQrMrxB71hKcoAvmUQFT9PTrPzpseW--kjP0JQsv9ZJOO9s5Nk_xX2qQ1GSA35YweIJy4LFqW2MgV04BPqieOIvD48xY_CRJm8c6F7MVpW2RHT0_jHR8EhU7QtmgzfUdDQ5Tb26Q_0WKp1dvyEVwCGCwJJCeQVvWX6ygV3ErBjR8t-pHdhlaMKLEyz7-1Cyw_-OvI0GXGgL6aRwMkeRxo",
  },
  {
    id: 2,
    category: "Soft furnishings",
    name: "Linen throw cushion — sage",
    tags: ["linen", "sage", "handmade"],
    priceLabel: "AI Midpoint",
    price: 65,
    metrics: [
      { label: "Market Range", value: "$45 — $85" },
      { label: "Trend Velocity", value: "High", suffix: "+12%", accent: true },
    ],
    confidence: 88,
    qty: 45,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDZd1i4B2GzPbw4_2d6psUdfOp0wAQ301bKlXfzigx8EFHdqVfeiRHqxURfLwcmU2VOiVgU6LpHMYQrCofSzYXRJi13AP2taJ3UtmZA4CRkIhAKoIxeuZXVE47OOd4ZJ0o97KVJRLdz0gQJVKaZbM3qhcNg9-xzwaxwSGETtNWM6AvYNxXKlrr2KsfmqZDTt6G8iaqdws3dXW-fSZodooo3hKqKe6r8TVFTHdsrRTeIryquApxDRwAiSj59TZ7CgN83GTSUPQEXBv1u",
  },
];

function fileToBase64(file: any): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1] || result);
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

function statusLabel(status: any) {
  if (status === "done") return "done";
  if (status === "analyzing") return "analyzing...";

  return "ready";
}

// formatting bytes, kilobytes, and megabytes
function formatSize(bytes: any) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(0)} KB`;

  return `${(bytes / 1048576).toFixed(1)} MB`;
}

// need to track IDs which have been revealed
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
      if (remaining <= 0) {
        return prev;
      }

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

  const startSession = async () => {
    if (files.length === 0 || agentRunning) return;
    setAgentRunning(true);

    for (let i = 0; i < files.length; ++i) {
      const fileId = files[i].id;
      setFiles((prev: any) =>
        prev.map((f: any) =>
          f.id === fileId ? { ...f, status: "analyzing" } : f,
        ),
      );

      await new Promise((r) => setTimeout(r, 800 + Math.random() * 1200));

      setFiles((prev: any) =>
        prev.map((f: any) => (f.id === fileId ? { ...f, status: "done" } : f)),
      );
    }

    setAgentRunning(false);
  };

  const doneCount: any = files.filter(
    (file: any) => file.status === "done",
  ).length;
  const analyzingCount = files.filter(
    (file: any) => file.status === "analyzing",
  ).length;
  const analyzingFile: any = files.find(
    (file: any) => file.status === "analyzing",
  );
  const canAddMore: any = files.length < MAX_IMAGES && !agentRunning;

  const updateStatus = (id: any, s: any) =>
    setStatuses((p: any) => ({ ...p, [id]: s }));

  const approveAll = () => {
    const next: any = {};
    ITEMS.forEach((i) => (next[i.id] = "accepted"));
    setStatuses(next);
  };

  const filteredItems = ITEMS.filter((i) => {
    const s = statuses[i.id] || "pending";
    if (activeTab === "All") {
      return true;
    }

    return s === activeTab.toLowerCase();
  });

  const pendingReview = ITEMS.filter(
    (i) => !statuses[i.id] || statuses[i.id] === "pending",
  ).length;
  const publishedCount = ITEMS.filter(
    (i) => statuses[i.id] === "accepted",
  ).length;

  const counts = {
    uploaded: files.length,
    processed: doneCount,
    pending: ITEMS.filter(
      (i) => !statuses[i.id] || statuses[i.id] === "pending",
    ).length,
    published: ITEMS.filter((i) => statuses[i.id] === "accepted").length,
  };

  return (
    <div className="min-h-screen">
      <TopNavBar />
      <main className="pt-32 pb-24 max-w-[1120px] mx-auto px-12">
        <section className="grid grid-cols-4 gap-4 mb-16">
          {[
            {
              label: "Uploaded",
              val: files.length,
              sub:
                files.length === 0
                  ? "No images yet"
                  : `${files.length} image${files.length !== 1 ? "s" : ""} in session`,
              bg: "bg-[#f4f3f1]",
            },
            {
              label: "Processed",
              val: doneCount,
              sub:
                analyzingCount > 0
                  ? `${analyzingCount} currently analyzing…`
                  : doneCount > 0
                    ? "Drafts generated"
                    : "Waiting to start",
              bg: "bg-[#efeeec]",
              processing: analyzingCount > 0,
            },
            {
              label: "Pending review",
              val: pendingReview,
              sub:
                pendingReview > 0 ? "Requires seller approval" : "All reviewed",
              bg: "bg-[#e9e8e6]",
              accent: true,
            },
            {
              label: "Published",
              val: publishedCount,
              sub:
                publishedCount > 0
                  ? "Active live listings"
                  : "None published yet",
              bg: "bg-[#e3e2e0]",
            },
          ].map((s, i) => (
            <div
              key={i}
              className={`${s.bg} p-8 border-b border-[#d1c5b4]/15 transition-all duration-300`}
            >
              <span
                className={`block text-[9px] uppercase tracking-[0.15em] mb-2 ${s.accent ? "text-[#775a19]" : "text-[#5f5e5e]"}`}
              >
                {s.label}
              </span>
              <span
                className={`font-gelasio text-4xl font-light transition-all duration-300 ${s.accent ? "text-[#775a19]" : "text-[#1a1c1b]"}`}
              >
                {s.val}
              </span>
              <span
                className={`block text-[9px] mt-1 ${s.processing ? "text-[#775a19] animate-pulse-dot" : "text-[#5f5e5e]/60"}`}
              >
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
              className={`relative py-12 px-8 flex flex-col items-center text-center transition-all duration-200 ${
                files.length > 0
                  ? "border-b border-dashed border-[#d1c5b4]"
                  : ""
              } ${
                isDragging
                  ? "bg-[#e9e8e6]"
                  : canAddMore
                    ? "cursor-pointer hover:bg-[#efeeec]"
                    : ""
              } ${!canAddMore ? "opacity-40 cursor-not-allowed" : ""}`}
            >
              <input
                ref={inputRef}
                type="file"
                multiple
                accept=".jpg,.jpeg,.png,.webp"
                onChange={handleInputChange}
                className="hidden"
              />
              <span
                className={`material-symbols-outlined text-4xl mb-3 transition-transform duration-200 ${isDragging ? "text-[#775a19] scale-110" : "text-[#7f7667]"}`}
              >
                upload_file
              </span>
              <h3 className="font-gelasio text-xl mb-1">Drop images here</h3>
              <p className="text-[12px] text-[#5f5e5e] max-w-xs mx-auto leading-relaxed">
                JPEG, PNG, WEBP — up to {MAX_IMAGES} items
              </p>
            </div>

            {files.length > 0 && (
              <div className="px-6 py-4">
                {agentRunning && analyzingFile && (
                  <div className="mb-3 px-3 py-2.5 bg-[#775a19]/5 border border-[#775a19]/10 flex items-center gap-3">
                    <span className="material-symbols-outlined animate-spin text-[18px] text-[#775a19]">
                      progress_activity
                    </span>
                    <span className="text-[12px] text-[#775a19]">
                      Analyzing{" "}
                      <span className="font-medium">{analyzingFile.name}</span>
                      <span className="text-[#775a19]/50 ml-2">
                        · {doneCount + 1} of {files.length}
                      </span>
                    </span>
                  </div>
                )}

                <div className="max-h-[220px] overflow-y-auto space-y-0.5 pr-1">
                  {files.map((f: any) => (
                    <div
                      key={f.id}
                      className="animate-fade-in group flex items-center gap-3 py-2 px-2 rounded hover:bg-[#efeeec] transition-colors"
                    >
                      <span
                        className={`material-symbols-outlined text-[18px] ${statusColour(f.status)} flex-shrink-0`}
                      >
                        {statusIcon(f.status)}
                      </span>
                      <div className="flex-1 min-w-0 flex items-center gap-2">
                        <span
                          className={`text-[12px] truncate ${f.status === "analyzing" ? "text-[#775a19] font-medium" : ""}`}
                        >
                          {f.name}
                        </span>
                        <span className="text-[10px] text-[#5f5e5e]/30 flex-shrink-0">
                          {formatSize(f.size)}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] flex-shrink-0 ${
                          f.status === "done"
                            ? "text-emerald-600"
                            : f.status === "analyzing"
                              ? "text-[#775a19] animate-pulse-dot"
                              : "text-[#5f5e5e]/40"
                        }`}
                      >
                        {statusLabel(f.status)}
                      </span>
                      {!agentRunning && (
                        <button
                          onClick={() => removeFile(f.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-[#5f5e5e]/30 hover:text-red-500 flex-shrink-0 bg-transparent border-none cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            close
                          </span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-3 pt-3 border-t border-[#d1c5b4]/20 flex items-center justify-between">
                  <span className="text-[11px] text-[#5f5e5e]/60">
                    {agentRunning
                      ? `${doneCount} of ${files.length} analyzed`
                      : doneCount === files.length && doneCount > 0
                        ? `All ${files.length} images processed`
                        : `${files.length} image${files.length !== 1 ? "s" : ""} ready · ${MAX_IMAGES - files.length} slots remaining`}
                  </span>
                  {canAddMore && (
                    <button
                      onClick={() => inputRef.current?.click()}
                      className="font-roboto text-[11px] text-[#775a19] uppercase tracking-[0.1em] font-medium hover:underline cursor-pointer bg-transparent border-none"
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
            disabled={
              files.length === 0 ||
              agentRunning ||
              (doneCount === files.length && doneCount > 0)
            }
            className={`font-roboto mt-4 w-full uppercase py-4 text-[11px] tracking-[0.15em] font-medium transition-all duration-200 border-none ${
              files.length === 0 ||
              (doneCount === files.length && doneCount > 0)
                ? "bg-[#e3e2e0] text-[#5f5e5e]/40 cursor-not-allowed"
                : agentRunning
                  ? "bg-[#775a19] text-white cursor-wait"
                  : "bg-[#5f5e5e] text-white cursor-pointer hover:bg-[#1a1c1b]"
            }`}
          >
            {agentRunning
              ? `Analyzing · ${doneCount} of ${files.length} complete`
              : doneCount === files.length && doneCount > 0
                ? "Session complete"
                : files.length === 0
                  ? "Start new session"
                  : `Start new session · ${files.length} image${files.length !== 1 ? "s" : ""}`}
          </button>
        </section>

        <section className="flex justify-between items-end mb-12">
          <div>
            <h2 className={`${gelasio.className} text-4xl tracking-tight mb-4`}>
              Review board
            </h2>
            <div className="flex gap-8">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`${roboto.className} transition-all duration-200 bg-transparent border-none pb-2 text-[11px] uppercase tracking-[0.15em] cursor-pointer border-b-2 ${activeTab === tab ? "text-[#1a1c1b] border-b-[#755a10] font-medium" : "text-[#5f5e5e]/60 border-b-transparent hover:text-[#1a1c1b]"}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={approveAll}
            className={`${roboto.className} bg-[#775a19] text-white border-none px-10 py-4 text-[11px] uppercase tracking-[0.15em] font-medium cursor-pointer hover:opacity-90 transition-opacity`}
          >
            Approve all
          </button>
        </section>

        <div className="flex flex-col gap-24">
          {filteredItems.map((item) => {
            const status = statuses[item.id] || "pending";
            return (
              <article
                key={item.id}
                className={`grid grid-cols-12 gap-12 items-start ${status === "denied" ? "opacity-40" : "opacity-90"}`}
              >
                <div className="col-span-4 relative">
                  <div className="bg-[#efeeec] aspect-[4/5] overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="img-hover w-full h-full object-cover transition-all duration-700"
                    ></img>
                  </div>
                  <div className="absolute -bottom-6 -right-6 bg-white p-6 shadow-sm border border-[#d1c5b4]/10">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="material-symbols-outlined filled text-sm text-[#775a19]">
                        auto_awesome
                      </span>
                      <span className="text-[9px] uppercase -tracking-tight text-[#5f5e5e]/80">
                        ML Model
                      </span>
                    </div>
                    <span className={`${gelasio.className} text-lg`}>
                      {item.confidence}%{" "}
                      <span
                        className={`${roboto.className} text-xs text-[#5f5e5e]/60 italic`}
                      >
                        confidence
                      </span>
                    </span>
                  </div>
                </div>

                <div className="col-span-7 pt-4">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <span className="block text-[9px] uppercase tracking-[0.2em] text-[#775a19] mb-2">
                        {item.category}
                      </span>
                      <h3 className={`${gelasio.className} text-[28px] mb-4`}>
                        {item.name}
                      </h3>
                      <div className="flex gap-2">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-[#e8e2d9] text-[#1d1b16] text-[8px] px-3 py-1 uppercase tracking-[0.15em]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="block text-[9px] uppercase tracking-[0.15em] text-[#5f5e5e]/60 mb-1">
                        {item.priceLabel}
                      </span>
                      <span className={`${gelasio.className} text-2xl`}>
                        ${item.price}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-px bg-[#d1c6b4]/15 border border-[#d1c5b4]/15 mb-10">
                    {item.metrics.map((m, i) => (
                      <div key={i} className="bg-[#faf9f7] p-6">
                        <span className="block text-[8px] uppercase tracking-[0.15em] text-[#5f5e5e]/60 mb-2">
                          {m.label}
                        </span>
                        <span
                          className={`text-xl font-light ${m.accent ? "text-[#775a19]" : "text-[#1a1c1b]"}`}
                        >
                          {m.value}{" "}
                          {m.suffix && (
                            <span className="text-xs text-[#5f5e5e]/40">
                              {m.suffix}
                            </span>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-8 mb-10">
                    <div>
                      <label className="block text-[9px] uppercase tracking-[0.15em] text-[#5f5e5e]/60 mb-3">
                        Price (Override Prediction)
                      </label>
                      <div className="relative">
                        <span className="absolute left-0 bottom-2 text-[#5f5e5e]/40 text-sm">
                          $
                        </span>
                        <input
                          defaultValue={item.price}
                          className={`${roboto.className} w-full bg-[#f4f3f1] border-0 border-b border-[#d1c5b4] py-2 pl-4 text-sm font-medium`}
                        ></input>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] uppercase tracking-[0.15em] text-[#5f5e5e]/60 mb-3">
                        Quantity Availble
                      </label>
                      <input
                        type="number"
                        defaultValue={item.qty}
                        className={`${roboto.className} w-full bg-[#f4f3f1] border-0 border-b border-[#d1c5b4] py-2 text-sm font-medium`}
                      ></input>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => updateStatus(item.id, "accepted")}
                      className={`${roboto.className} flex-1 bg-[#5f5e5e] text-white border-none py-4 text-[11px] uppercase tracking-[0.15em] font-medium cursor-pointer hover:bg-[#1a1c1b] transition-colors`}
                    >
                      Accept &amp; publish
                    </button>
                    <button
                      onClick={() => updateStatus(item.id, "denied")}
                      className={`${roboto.className} px-8 border border-[#d1c5b4] bg-transparent text-[#5f5e5e] py-4 text-[11px] uppercase tracking-[0.15em] font-medium cursor-pointer hover:bg-red-50 hover:text-red-700 hover:border-red-700 transition-all`}
                    >
                      Deny
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </main>
    </div>
  );
}
