"use client";

import Footer from "@/components/universal/Footer";
import { Roboto, Gelasio } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import "material-symbols";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef, Suspense } from "react";

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
  const [searchTerm, setSearchTerm] = useState("");
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
  const isAiSidebarOpen = searchParams.get("sidebar") === "ai";
  const openSidebar = () => router.push("?sidebar=ai");
  const closeSidebar = () => router.push("?");

  useEffect(() => {
    const fetchItems = async (isRetry: boolean = false) => {
      try {
        const response = await fetch(
          "https://sassysquad-backend.vercel.app/items",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              // Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWJqZWN0X2NsYWltIjoiZTc5MDVlOTQtOGRiMS00ZTIxLTg0OGQtNDA3ZDk0Nzc4YWNjIiwiZW1haWwiOiJ0ZXN0MTIzQGdtYWlsLmNvbSIsInR5cGUiOiJhY2Nlc3MiLCJqd3RfaWQiOiJmMjM4OTY0My1iNDg2LTQyYWEtYWZhZS0yNGJkYzVkYTU0Y2YiLCJpYXQiOjE3NzUyNjIwMTksImV4cCI6MTc3NTI2MjkxOSwiaXNzIjoic2Fhc3lzcXVhZC1hdXRoIiwiYXVkIjoic2Fhc3lzcXVhZC1hcGkifQ.5zHqGyO6dK6KQoOsuyjhOCtuVdP-QhuWb4P8wxGdrlw",
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

  const handleInputChange = (e: any) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleSearchSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    let searchString =
      formData.get("search-string")?.toString().toLowerCase() || "";

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
          setSearchTerm("");
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
      <nav
        className={`flex justify-between items-center top-0 z-50 px-12 h-20 fixed bg-[#F9F8F6] dark:bg-[#1a1c1b] ${roboto.className} antialiased tracking-tight w-full`}
      >
        <div className="flex items-center gap-8">
          <span
            className={`text-2xl ${gelasio.className} tracking-tighter text-[#1A1C1B] dark:text-[#FAF9F7]`}
          >
            The Curated Althaïr
          </span>
          <div className="hidden md:flex gap-6 items-center">
            <Link
              href="/dashboard"
              className={`text-[#775A19] dark:text-[#C5A059] border-b border-[#775A19]`}
            >
              Catalog
            </Link>
            <Link
              href="/purchases"
              className={`text-[#5f5e5e] dark:text-[#a7a5a5] hover:text-[#1a1c1b] hover:text-[#775a19] transition-colors duration-300`}
            >
              Purchases
            </Link>
            <Link
              href="/sales"
              className={`text-[#5f5e5e] dark:text-[#a7a5a5] hover:text-[#1a1c1b] hover:text-[#775a19] transition-colors duration-300`}
            >
              Sales
            </Link>
            <Link
              href="/messages"
              className={`text-[#5f5e5e] dark:text-[#a7a5a5] hover:text-[#1a1c1b] hover:text-[#775a19] transition-colors duration-300`}
            >
              Messages
            </Link>
            <Link
              href="/product/sell"
              className={`text-[#5f5e5e] dark:text-[#a7a5a5] hover:text-[#1a1c1b] hover:text-[#775a19] transition-colors duration-300`}
            >
              Sell Items
            </Link>
          </div>
        </div>
        <div className="relative hidden lg:block group">
          <form className="relative inline-block" onSubmit={handleSearchSubmit}>
            <input
              className={`bg-[#F4F3F1] focus:ring-0 sm:w-50 md:w-100 lg:w-150 py-2 px-2 text-sm ${roboto.className} outline-none border-b border-[#D1C5B4] focus:border-[#775A19] transition-all`}
              placeholder="Search catalog..."
              name="search-string"
              value={searchTerm}
              onChange={handleInputChange}
            ></input>
            <button
              type="submit"
              className="material-symbols-sharp absolute right-2 top-2 text-primary opacity-50 cursor-pointer"
            >
              search
            </button>
          </form>
        </div>
        <div className="flex items-center gap-6">
          <button
            onClick={openSidebar}
            className="flex items-center gap-2 px-5 py-2 bg-[#5F5E5E] text-[#FFFFFF] text-xs uppercase tracking-widest hover:bg-[#1A1C1B] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">
              image_arrow_up
            </span>
            <span className="hidden sm:inline">recommend with ai</span>
          </button>

          {isAiSidebarOpen && (
            <div
              onClick={closeSidebar}
              className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm transition-opacity"
              aria-hidden="true"
            ></div>
          )}

          <aside
            className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${isAiSidebarOpen ? "translate-x-0" : "translate-x-full"}`}
          >
            <div className="p-8 flex justify-between items-center border-b border-[#d1c5b4]">
              <h2 className={`text-2xl ${gelasio.className} tracking-tight`}>
                AI Curator
              </h2>
              <button
                onClick={closeSidebar}
                className="material-symbols-outlined hover:text-[#775a19] transition-colors cursor-pointer"
              >
                close
              </button>
            </div>
            <div className="p-8 flex-1 overflow-y-auto">
              <div className="mb-8">
                <p
                  className={`text-sm ${roboto.className} leading-relaxed mb-6`}
                >
                  Discover pieces that resonate with your vision. Upload an
                  image of a space, a texture, or an inspiration to find
                  matching artisanal items from our collection.
                </p>
                <div className="border-2 border-dashed border-[#d1c5b4]/50 aspect-[4/3] flex flex-col items-center justify-center p-8 text-center group hover:border-[#775a19] transition-colors cursor-pointer bg-[#ffffff]">
                  <span className="material-symbols-outlined text-4xl text-[#5f5e5e] mb-4 group-hover:scale-110 transition-transform">
                    image_arrow_up
                  </span>
                  <span
                    className={`text-sm ${roboto.className} font-medium uppercase tracking-widest mb-2 text-[#775a19]]`}
                  >
                    Upload Image
                  </span>
                  <span
                    className={`text-[10px] text-[#5f5e5e]/60 uppercase tracking-tighter`}
                  >
                    JPG, PNG up to 10MB
                  </span>
                </div>
              </div>
              <div className="space-y-6">
                <h4
                  className={`text-[10px] uppercase tracking-[0.2em] font-bold text-[#775a19]`}
                >
                  How it works
                </h4>
                <div className="flex gap-4">
                  <span className={`italic ${gelasio.className} text-xs`}>
                    01
                  </span>
                  <p className="text-xs text-[#4e4639] leading-relaxed">
                    Our AI analyzes colour palettes, textures, and form factors.
                  </p>
                </div>
                <div className="flex gap-4">
                  <span className={`italic ${gelasio.className} text-xs`}>
                    02
                  </span>
                  <p className="text-xs text-[#4e4639] leading-relaxed">
                    It cross-references our entire archive of limited editions
                    and bespoke pieces.
                  </p>
                </div>
                <div className="flex gap-4">
                  <span className={`italic ${gelasio.className} text-xs`}>
                    03
                  </span>
                  <p className="text-xs text-[#4e4639] leading-relaxed">
                    The AI presents a tailoured selection curated specifically
                    for your aesthetic.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-8 border-t border-[#d1c5b4]/10">
              <button className="w-full py-4 bg-[#1a1c1b] text-[#ffffff] text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#775a19] transition-colors cursor-pointer">
                Start Visual Search
              </button>
            </div>
          </aside>
          <div className="flex items-center gap-6">
            <span className="material-symbols-outlined text-primary cursor-pointer hover:text-secondary transition-colors">
              shopping_cart
            </span>
            <div className="w-8 h-8 bg-surface-container-highest flex items-center justify-center overflow-hidden">
              <Link href="/me">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIEWWIsS24oEuhS288WfCZjz-DYqXxsIG0aCNeFSv78p1rnf6XwcNzKSw-Xn1_AUFH_ESsayZqp-A6g9FAOCencuC1ka2p90hh06vwU4RCpA5Hwuk70p6PViQLxszYYVWfaLRm4VcP-tFyWJY2Zgqmwlg37Yt-iN7qKnSfl812uX1V6D9gAzX43IGcr63yiDKlxJjky5qS3cDTR63mrstO31kxFyupT6m7F2_peMXjtNvbrgTXD5doEoG3vBr0gESyhoIGCZvtgLi7"
                  alt="User Profile"
                  width={32}
                  height={32}
                ></Image>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main
        className="bg-[#F9F8F6] pt-32 pb-24 px-12 mx-auto min-h-screen"
        ref={topRef}
      >
        {hasItems ? (
          <>
            <header className="mb-20 flex flex-col md:flex-row justify-between items-end gap-8">
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
