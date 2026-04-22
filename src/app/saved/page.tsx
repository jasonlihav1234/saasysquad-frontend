"use client";

import Sidebar from "@/components/user-settings/shared-components/Sidebar";
import Footer from "@/components/universal/Footer";
import PageSectionHeading from "@/components/user-settings/shared-components/PageSectionHeading";
import SubpageHeader from "@/components/user-settings/shared-components/SubpageHeader";
import SavedItemCard, {
  SavedItemProps,
} from "@/components/user-settings/saved/SavedItemCard";
import {
  hydrateSavedIds,
  subscribe,
} from "@/lib/savedItemsStorage";
import {
  fetchItemById,
  getSavedItemIds,
  type BackendSavedItem,
} from "@/lib/api/saved";
import { useUser } from "@/components/providers/UserProvider";
import { Gelasio, Roboto } from "next/font/google";
import { useCallback, useEffect, useState } from "react";
import "material-symbols";

const roboto = Roboto({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const gelasio = Gelasio({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

function toSavedItemProps(item: BackendSavedItem): SavedItemProps {
  return {
    id: item.item_id,
    imageUrl: item.image_url ?? "",
    tag: item.itemTags?.[0] ?? "",
    name: item.item_name,
    price: Number(item.price),
  };
}

export default function SavedPage() {
  const { userId, loading: userLoading } = useUser();
  const [items, setItems] = useState<SavedItemProps[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );

  const loadSaved = useCallback(async () => {
    if (!userId) return;
    setStatus("loading");
    try {
      const ids = await getSavedItemIds(userId);
      hydrateSavedIds(ids);

      const results = await Promise.all(ids.map((id) => fetchItemById(id)));
      const hydrated = results
        .filter((r): r is BackendSavedItem => r !== null)
        .map(toSavedItemProps);

      setItems(hydrated);
      setStatus("ready");
    } catch (err) {
      console.error("Failed to load saved items:", err);
      setStatus("error");
    }
  }, [userId]);

  useEffect(() => {
    if (userLoading) return;
    if (!userId) {
      setItems([]);
      setStatus("ready");
      return;
    }
    loadSaved();
  }, [userId, userLoading, loadSaved]);

  useEffect(() => {
    const unsubscribe = subscribe(() => {
      if (userId) loadSaved();
    });
    return unsubscribe;
  }, [userId, loadSaved]);

  return (
    <main className="bg-[#F9F8F6] min-h-screen w-full flex flex-col">
      <SubpageHeader title="Saved" />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar activePage="saved" />

        <div className="flex-1 overflow-y-auto bg-[#faf9f7] flex flex-col min-h-0 text-[#1a1c1b]">
          <div className="w-full max-w-[1400px] px-8 md:px-12 lg:px-16 pt-8 md:pt-12 lg:pt-16">
            <header className="w-full flex justify-between items-end pb-10">
              <PageSectionHeading
                title="Saved Items"
                description="Your curated list of saved items."
              />
            </header>

            <section className="w-full">
              {status === "loading" ? (
                <div className="text-center py-6">
                  <p
                    className={`${roboto.className} text-[#5f5e5e] text-base`}
                  >
                    Loading saved items...
                  </p>
                </div>
              ) : status === "error" ? (
                <div className="text-center py-6">
                  <h1
                    className={`${gelasio.className} text-3xl md:text-4xl font-bold text-[#1a1c1b] mb-4 tracking-tight`}
                  >
                    Something went wrong.
                  </h1>
                  <p
                    className={`${roboto.className} text-[#5f5e5e] text-base max-w-md mx-auto leading-relaxed`}
                  >
                    We could not load your saved items. Please try again later.
                  </p>
                </div>
              ) : items.length === 0 ? (
                <div className="text-center py-6">
                  <h1
                    className={`${gelasio.className} text-3xl md:text-4xl font-bold text-[#1a1c1b] mb-4 tracking-tight`}
                  >
                    Your archive is currently empty.
                  </h1>
                  <p
                    className={`${roboto.className} text-[#5f5e5e] text-base max-w-md mx-auto leading-relaxed`}
                  >
                    Start exploring and save items you'd like to revisit!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                  {items.map((item) => (
                    <SavedItemCard key={item.id} {...item} />
                  ))}
                </div>
              )}
            </section>
          </div>

          <div className="p-8 md:p-12 lg:p-16 max-w">
            <Footer />
          </div>
        </div>
      </div>
    </main>
  );
}
