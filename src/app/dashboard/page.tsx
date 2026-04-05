"use client";

import Footer from "@/components/universal/Footer";
import TopNavBar from "@/components/universal/TopNavBar";
import { Roboto, Gelasio } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import "material-symbols";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef, Suspense } from "react";
import ItemCard from "@/components/dashboard/ItemCard";
import { testItems } from "./pageData";

// probably should make this user/dashboard

const roboto = Roboto({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const gelasio = Gelasio({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

function DashboardContent() {
  const [hasItems, setHasItems] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [category, setCategory] = useState("new-arrival");
  const topRef = useRef<HTMLElement>(null);
  const itemsPerPage = 6;
  const searchParams = useSearchParams();
  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1,
  );
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // useful - item_name, price, image_url, item_id
  const [items, setItems] = useState<any[]>();
  const router = useRouter();

  useEffect(() => {
    const fetchItems = async (isRetry: boolean = false) => {
      try {
        const response = await fetch(
          "https://sassysquad-backend.vercel.app/items",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          },
        );

        if (response.status === 200) {
          const data = await response.json();
          setItems(data.items);
          setTotalPages(Math.ceil(data.items.length / 6));
        } else if (response.status === 401) {
          if (isRetry) {
            throw new Error("Refresh token was also rejected");
          }

          const responseRefresh = await fetch(
            "https://sassysquad-backend.vercel.app/auth/refresh",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                refreshToken: localStorage.getItem("refreshToken"),
              }),
            },
          );

          if (responseRefresh.status === 200) {
            const body = await responseRefresh.json();
            localStorage.setItem("accessToken", body.accessToken);
            localStorage.setItem("refreshToken", body.refreshToken);

            await fetchItems(true);
          } else {
            // localStorage.clear();
            // router.push("/login");
          }
        } else {
          throw new Error("Critical failure");
        }
      } catch (error) {
        alert(error);
      }
    };

    fetchItems();
  }, [router]);

  const safeItems = items || [];
  const currentItems = safeItems.slice(indexOfFirstItem, indexOfLastItem);
  const emptySlots = itemsPerPage - currentItems.length;

  const handlePageChange = (newPageNumber: number) => {
    if (newPageNumber < 1 || newPageNumber > totalPages) {
      return;
    }

    setCurrentPage(newPageNumber);
    // race condition, need nextjs to finish rendering page first
    setTimeout(() => {
      if (topRef.current) {
        topRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  };

  const handleSearchSubmit = async (searchString: string) => {
    searchString = searchString.toLowerCase();

    const executeSearch = async (searchString: string) => {
      const response = await fetch(
        "https://sassysquad-backend.vercel.app/items",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      );

      if (response.status === 200) {
        const body = await response.json();
        // filter out items that don't match the string
        const filteredArray = body.items.filter((item: any) => {
          return item.item_name.trim().toLowerCase().includes(searchString);
        });

        if (filteredArray.length === 0) {
          setHasItems(false);
          setItems([]);
        } else {
          setHasItems(true);
          setItems(filteredArray);
        }
      } else if (response.status === 401) {
        const responseRefresh = await fetch(
          "https://sassysquad-backend.vercel.app/auth/refresh",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              refreshToken: localStorage.getItem("refreshToken"),
            }),
          },
        );

        if (responseRefresh.status === 200) {
          const body = await responseRefresh.json();
          localStorage.setItem("accessToken", body.accessToken);
          localStorage.setItem("refreshToken", body.refreshToken);

          await executeSearch(searchString);
        } else {
          localStorage.clear();
          router.push("/login");
        }
      } else {
        const body = await response.json();
        alert(body);
      }
    };

    try {
      await executeSearch(searchString);
    } catch (error) {
      alert(`Fatal error: ${error}`);
    }
  };

  const getPaginationItems = () => {
    if (totalPages <= 10) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 6) {
      return [1, 2, 3, 4, 5, 6, 7, 8, 9, "...", totalPages];
    }

    if (currentPage >= totalPages - 5) {
      return [
        1,
        "...",
        totalPages - 8,
        totalPages - 7,
        totalPages - 6,
        totalPages - 5,
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      "...",
      currentPage - 2,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      currentPage + 2,
      "...",
      totalPages,
    ];
  };

  const handleNewArrival = () => {
    setCategory("new-arrival");
  };

  const handleBestSeller = () => {
    setCategory("best-sellers");
  };

  const handleBrowseAll = () => {
    setCategory("browse-all");
  };

  return (
    <>
      <TopNavBar activeHref="/dashboard" onSearch={(term) => handleSearchSubmit(term)} />
      <main
        className="bg-[#F9F8F6] pb-24 px-12 mx-auto min-h-screen"
        ref={topRef}
      >
        {hasItems ? (
          <>
            <header className="mb-20 -mx-12 px-12 pt-32 pb-32 bg-[#F4F3F1] flex flex-col md:flex-row justify-between items-end gap-8">
              <div className="max-w-2xl">
                <h1
                  className={`text-6xl md:text-7xl ${gelasio.className} tracking-tighter text-[#1a1c1b]`}
                >
                  The Althaïr
                  <br></br>
                  <span className="italic text-[#5f5e5e] font-normal">
                    Catalog
                  </span>
                </h1>
              </div>
              <div
                className={`${roboto.className} flex flex-wrap gap-4 font-body text-xs uppercase tracking-widest`}
              >
                <button
                  onClick={handleNewArrival}
                  className={`px-6 py-3 bg-[#FFFFFF] border border-[#D1C5B4]/20 hover:bg-[#F4F3F1] transition-colors text-[#775A19] ${category === "new-arrival" && "border-b-2 border-b-[#775A19] cursor-pointer"}`}
                >
                  New Arrivals
                </button>
                <button
                  onClick={handleBestSeller}
                  className={`px-6 py-3 bg-[#FFFFFF] border border-[#D1C5B4]/20 hover:bg-[#F4F3F1] transition-colors text-[#775A19] cursor-pointer ${category === "best-sellers" && "border-b-2 border-b-[#775A19] cursor-pointer"}`}
                >
                  Best Sellers
                </button>
                <button
                  onClick={handleBrowseAll}
                  className={`px-6 py-3 bg-[#FFFFFF] border border-[#D1C5B4]/20 hover:bg-[#F4F3F1] transition-colors text-[#775A19] cursor-pointer ${category === "browse-all" && "border-b-2 border-b-[#775A19] cursor-pointer"}`}
                >
                  Browse All
                </button>
              </div>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {testItems.map((item) => (
                <ItemCard key={item.item_id} item={item} />
              ))}
              {currentItems.map((item) => (
                <div key={item.item_id} className="group cursor-pointer">
                  <div className="relative aspect-[1/1] bg-[#efeeec] overflow-hidden mb-6">
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transofrm duration-700 ease-out"
                      alt="store product image"
                      src={`${item.image_url}`}
                    ></img>
                  </div>
                  <div className="flex justify-between items-baseline gap-4">
                    <div>
                      <h3
                        className={`text-xl ${gelasio.className} antialiased mb-1`}
                      >{`${item.item_name}`}</h3>
                    </div>
                    <div>
                      <span
                        className={`text-md ${gelasio.className} text-[#775a19] whitespace-nowrap`}
                      >
                        {`$${item.price}`}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {Array.from({ length: emptySlots }).map((_, index) => (
                <div
                  key={`ghost-${index}`}
                  className="invisible pointer-events-none"
                  aria-hidden="true"
                >
                  <div className="aspect-[1/1] mb-6"></div>
                  <div className="h-7 mb-1"></div>
                </div>
              ))}
            </div>
            <footer
              className={`mt-32 pt-16 border-t border-[#D1C5B4]/10 flex justify-center items-center gap-12 ${category !== "browse-all" ? "invisible pointer-events-none" : ""}`}
            >
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="material-symbols-outlined text-[#5F5E5E] hover:text-[#775A19] transition-colors cursor-pointer"
              >
                chevron_left
              </button>
              <div
                className={`flex gap-8 ${roboto.className} text-sm tracking-widest`}
              >
                {getPaginationItems().map((item, index) => {
                  if (item === "...") {
                    return (
                      <span
                        key={`ellipses-${index}`}
                        className="text-[#5f5e5e] tracking-widest"
                      >
                        ...
                      </span>
                    );
                  }

                  const number = item as number;

                  return (
                    <button
                      key={`page-${number}`}
                      onClick={() => handlePageChange(number)}
                      disabled={number === currentPage}
                      className={`${number === currentPage ? "text-[#1A1C1B] font-bold border-b border-[#1A1C1B]" : "text-[#5F5E5E] hover:text-[#1A1C1B] transition-colors cursor-pointer"}`}
                    >
                      {number >= 10 ? number : `0${number}`}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="material-symbols-outlined text-[#5F5E5E] hover:text-[#775A19] transition-colors cursor-pointer"
              >
                chevron_right
              </button>
            </footer>
          </>
        ) : (
          <>
            <div className="w-full flex flex-col items-center justify-center">
              <h1
                className={`text-5xl md:text-7xl mb-8 tracking-tight text-[#1A1C1B] ${gelasio.className}`}
              >
                The Catalog is Silent
              </h1>
              <p
                className={`${roboto.className} text-lg text-[#5f5e5e] leading-relaxed`}
              >
                No items found.
              </p>
            </div>
            <section className="relative w-full h-[600px] mb-32 overflow-hidden bg-[#f4f3f1] mt-27">
              <div className="absolute inset-0 flex items-center justify-center opacity-40 mix-blend-multiply">
                <img
                  alt="Minimalist Interior"
                  className="w-full h-full object-cover grayscale"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVsxfbGX4ssS40oOqR6_-Dp_UR7HydLoV35Mh_pUlk0-R98KMzCQHVTroLIMKPEGPQ9pNLxztumaPE0yU-1pd23q1XCyaMABomllIlsiuF3Ory6NB-zH1kff8huBk-nHBNywn1vY3nkTqvQVtoS9pAkeLqWQB_opXUHjdyUFBiV5foD-k14knxjy1KVNe4nkkD0FmbLs-lVEU-N3jgRtvyTqMgqEK0DJAk_86F_aGpAJt6ATmFZ_W6gh7_m4IXJUnyvs8EzFgQYE_9"
                ></img>
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12">
                <h2
                  className={`${gelasio.className} text-3xl italic text-[#4e4639] tracking-wide`}
                >
                  Finding beauty in the absence.
                </h2>
              </div>
            </section>
          </>
        )}
        <Footer />
      </main>
    </>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
