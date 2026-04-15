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

// probably should make this user/dashboard

const roboto = Roboto({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const gelasio = Gelasio({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

interface Item {
  item_id: string;
  item_name: string;
  price: number;
  image_url: string;
}

function DashboardContent() {
  const [hasItems, setHasItems] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [category, setCategory] = useState("new-arrival");
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [itemCategory, setItemCategory] = useState<string>("");
  const [dbCategories, setDbCategories] = useState<string[]>([]);
  const [aiItems, setAiItems] = useState<Item[]>([]);
  const [aiState, setAiState] = useState<"awaiting" | "loading" | "completed">(
    "awaiting",
  );
  const [message, setMessage] = useState("");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
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
  const [aiChoice, setAIChoice] = useState(category);
  const router = useRouter();
  const isAiSidebarOpen = searchParams.get("sidebar") === "ai";
  const openSidebar = () => router.push("?sidebar=ai");
  const closeSidebar = () => router.push("?");
  const fileInputRef = useRef<HTMLInputElement>(null);

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
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              }),
            },
          );

          if (responseRefresh.status === 200) {
            const body = await responseRefresh.json();
            localStorage.setItem("accessToken", body.accessToken);
            localStorage.setItem("refreshToken", body.refreshToken);

            const response2 = await fetch(
              "https://sassysquad-backend.vercel.app/items",
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
              },
            );

            if (response2.status === 200) {
              const data = await response.json();
              setItems(data.items);
              setTotalPages(Math.ceil(data.items.length / 6));
            } else {
              localStorage.clear();
              router.push("/login");
            }
          } else {
            // localStorage.clear();
            // router.push("/login");
          }
        } else {
          throw new Error("Critical failure");
        }

        const categoryResponse = await fetch(
          "https://sassysquad-backend.vercel.app/categories",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          },
        );

        if (categoryResponse.status === 200) {
          const data = await categoryResponse.json();
          const filteredCategories = data.categories.map((category: any) =>
            category.category_name.toUpperCase().replace(/-+/g, " "),
          );

          setDbCategories(filteredCategories);
        } else if (categoryResponse.status === 401) {
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
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              }),
            },
          );

          if (responseRefresh.status === 200) {
            const body = await responseRefresh.json();
            localStorage.setItem("accessToken", body.accessToken);
            localStorage.setItem("refreshToken", body.refreshToken);

            const categoryResponse2 = await fetch(
              "https://sassysquad-backend.vercel.app/categories",
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
              },
            );

            const data = await categoryResponse.json();
            setDbCategories(data);
          } else {
            localStorage.clear();
            router.push("/login");
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

    if (topRef.current) {
      topRef.current.scrollIntoView({
        behavior: "auto",
        block: "start",
      });
    }

    setCurrentPage(newPageNumber);
  };

  const handleGenerateAIItems = async () => {
    if (!imageBase64 || !itemCategory) {
      alert("Provide a valid picture and item category");
      return;
    }

    const formattedItemCategory = itemCategory
      .split(" ")
      .join("-")
      .toLowerCase();

    setAiState("loading");
    try {
      const itemResponse = await fetch(
        "https://sassysquad-backend.vercel.app/items/recommendations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({
            category: formattedItemCategory,
            image: imageBase64,
          }),
        },
      );

      if (itemResponse.status === 200) {
        const itemBody = await itemResponse.json();

        if (itemBody.items && itemBody.items.length !== 0) {
          setAiItems(itemBody.items);
        } else if (itemBody.message) {
          setMessage(itemBody.message);
        } else {
          throw new Error("Fatal error occured in AI return");
        }

        setAiState("completed");
      } else if (itemResponse.status === 401) {
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

          const itemResponse2 = await fetch(
            "https://sassysquad-backend.vercel.app/items/recommendations",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
              body: JSON.stringify({
                category: itemCategory,
                image: imageBase64,
              }),
            },
          );

          const itemBody2 = await itemResponse2.json();
          if (itemBody2.items && itemBody2.items.length !== 0) {
            setAiItems(itemBody2.items);
          } else if (itemBody2.message) {
            setMessage(itemBody2.message);
          } else {
            throw new Error("Fatal error occured in AI return");
          }

          setAiState("completed");
        } else {
          localStorage.clear();
          router.push("/login");
        }
      } else {
        alert(await itemResponse.json());
        setAiState("awaiting");
      }
    } catch (error) {
      console.log(error);
      alert(error);
      setAiState("awaiting");
    }
  };

  const handleFileChange = (e: any) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImageBase64(base64String);

      console.log(base64String);
    };

    reader.readAsDataURL(file);
  };

  const handleSearchSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchString =
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

  const filteredCategories = dbCategories.filter((cat: string) =>
    cat.startsWith(itemCategory),
  );

  return (
    <>
      <TopNavBar
        activeHref="/dashboard"
        onSearch={(term) => handleSearchSubmit(term)}
        onAiClick={openSidebar}
      />
      <div className="flex items-center gap-6">
        {isAiSidebarOpen && (
          <div
            onClick={() => {
              closeSidebar();
              setAiState("awaiting");
            }}
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
              onClick={() => {
                closeSidebar();
                setAiState("awaiting");
              }}
              className="material-symbols-outlined hover:text-[#775a19] transition-colors cursor-pointer"
            >
              close
            </button>
          </div>

          <div className="flex w-full">
            <button
              onClick={() => setAIChoice("category")}
              className={`flex-1 px-4 py-3 bg-[#FFFFFF] border border-[#D1C5B4]/20 hover:bg-[#F4F3F1] transition-colors cursor-pointer ${aiChoice === "category" ? "border-b-2 border-b-[#775A19]" : ""}`}
            >
              By Category
            </button>
            <button
              onClick={() => setAIChoice("past-purchases")}
              className={`flex-1 px-4 py-3 bg-[#FFFFFF] border border-[#D1C5B4]/20 hover:bg-[#F4F3F1] transition-colors cursor-pointer ${aiChoice === "past-purchases" ? "border-b-2 border-b-[#775A19]" : ""}`}
            >
              By Past Purchases
            </button>
          </div>

          <div className="p-8 flex-1 overflow-y-auto">
            {aiState === "awaiting" && (
              <>
                <div className="mb-8">
                  <p
                    className={`text-sm ${roboto.className} leading-relaxed mb-6`}
                  >
                    Discover pieces that resonate with your vision. Select a
                    category and upload an image of a space, a texture, or an
                    inspiration.
                  </p>
                  <div className="mb-6 relative">
                    <label
                      className={`block text-[0.65rem] uppercase tracking-[0.2em] text-[#a7a5a5] mb-2 ${roboto.className}`}
                    >
                      1. Select Category
                    </label>
                    <input
                      name="ai-category"
                      className={`pl-4 focus:outline-0 w-full bg-[#e9e8e6] border-none border-b border-[#d1c5b4] py-3 px-0 focus:border-[#775a19] transition-colors text-lg placeholder:italic placeholder:text-[#d1c5b4]/50 ${gelasio.className}`}
                      placeholder="E.g., Seating, Lighting, Decor..."
                      type="text"
                      value={itemCategory}
                      onChange={(e) => {
                        e.preventDefault();
                        setItemCategory(e.target.value.toUpperCase());
                        setIsCategoryOpen(true);
                      }}
                      onFocus={() => setIsCategoryOpen(true)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();

                          if (dbCategories.includes(itemCategory)) {
                            setIsCategoryOpen(false);
                          } else if (filteredCategories.length === 1) {
                            setItemCategory(filteredCategories[0]);
                            setIsCategoryOpen(false);
                          }
                        }
                      }}
                    />
                    {isCategoryOpen && (
                      <ul className="absolute z-20 w-full mt-1 bg-white border border-[#d1c5b4] shadow-lg max-h-48 overflow-y-auto">
                        {filteredCategories.length > 0 ? (
                          filteredCategories.map((cat, index) => (
                            <li
                              key={index}
                              className="px-4 py-3 text-sm text-[#5f5e5e] hover:bg-[#775a19]/5 hover:text-[#775a19] cursor-pointer transition-colors"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                setItemCategory(cat);
                                setIsCategoryOpen(false);
                              }}
                            >
                              {cat}
                            </li>
                          ))
                        ) : (
                          <></>
                        )}
                      </ul>
                    )}
                  </div>
                  <label
                    className={`block text-[0.65rem] uppercase tracking-[0.2em] text-[#a7a5a5] mb-2 ${roboto.className}`}
                  >
                    2. Upload Inspiration
                  </label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="relative border-2 border-dashed border-[#d1c5b4]/50 aspect-[4/3] flex flex-col items-center justify-center p-8 text-center group hover:border-[#775a19] transition-colors cursor-pointer bg-[#ffffff] overflow-hidden"
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/png, image/jpeg"
                      className="hidden"
                    />
                    {imageBase64 ? (
                      <>
                        <img
                          src={imageBase64}
                          alt="Preview"
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-white text-sm tracking-widest uppercase font-medium">
                            Change Image
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-4xl text-[#5f5e5e] mb-4 group-hover:scale-110 transition-transform">
                          image_arrow_up
                        </span>
                        <span
                          className={`text-sm ${roboto.className} font-medium uppercase tracking-widest mb-2 text-[#775a19]`}
                        >
                          Upload Image
                        </span>
                        <span
                          className={`text-[10px] text-[#5f5e5e]/60 uppercase tracking-tighter`}
                        >
                          JPG, PNG up to 10MB
                        </span>
                      </>
                    )}
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
                      Our AI analyzes colour palettes, textures, and form
                      factors.
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
                <div className="p-8 border-t border-[#d1c5b4]/10">
                  <button
                    onClick={handleGenerateAIItems}
                    className="w-full py-4 bg-[#1a1c1b] text-[#ffffff] text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#775a19] transition-colors cursor-pointer"
                  >
                    Start Visual Search
                  </button>
                </div>
              </>
            )}

            {aiState === "loading" && (
              <div className="grid grid-cols-2 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((skeleton) => (
                  <div key={skeleton} className="animate-pulse">
                    <div className="relative aspect-[1/1] bg-[#e9e8e6] overflow-hidden mb-4 rounded-sm"></div>
                    <div className="flex justify-between items-baseline gap-4">
                      <div className="h-4 bg-[#e9e8e6] rounded w-2/3 mb-1"></div>
                      <div className="h-4 bg-[#e9e8e6] rounded w-1/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {aiState === "completed" && (
              <>
                {aiItems.length > 0 ? (
                  <div className="grid grid-cols-2 gap-6">
                    {aiItems.map((item) => (
                      <div key={item.item_id} className="group cursor-pointer">
                        <div className="relative aspect-[1/1] bg-[#efeeec] overflow-hidden mb-4 rounded-sm">
                          <img
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                            alt="store product image"
                            src={`${item.image_url}`}
                          ></img>
                        </div>
                        <div className="flex justify-between items-baseline gap-4">
                          <div>
                            <h3
                              className={`text-sm ${gelasio.className} antialiased mb-1 truncate`}
                            >
                              {item.item_name}
                            </h3>
                          </div>
                          <div>
                            <span
                              className={`text-sm ${gelasio.className} text-[#775a19] whitespace-nowrap`}
                            >
                              ${item.price}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-8 bg-[#f9f8f6] border border-[#d1c5b4]/30 rounded-sm">
                    <span className="material-symbols-outlined text-4xl text-[#d1c5b4] mb-4">
                      search_off
                    </span>
                    <h3
                      className={`text-lg ${gelasio.className} text-[#1a1c1b] mb-2`}
                    >
                      No Exact Matches
                    </h3>
                    <p
                      className={`text-sm ${roboto.className} text-[#5f5e5e] leading-relaxed italic`}
                    >
                      {message}
                    </p>
                  </div>
                )}

                <div className="p-8 border-t border-[#d1c5b4]/10">
                  <button
                    onClick={() => {
                      setAiState("awaiting");
                      setItemCategory("");
                      setImageBase64(null);
                    }}
                    className="w-full py-4 bg-[#1a1c1b] text-[#ffffff] text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#775a19] transition-colors cursor-pointer disabled:bg-[#5f5e5e] disabled:cursor-not-allowed"
                  >
                    Start New Search
                  </button>
                </div>
              </>
            )}
          </div>
        </aside>
      </div>
      <main
        className="bg-[#F9F8F6] pb-24 px-12 mx-auto min-h-screen"
        ref={topRef}
      >
        {hasItems ? (
          <>
            <header
              className="mb-20 -mx-12 px-12 pt-32 pb-32 bg-cover bg-center flex flex-col md:flex-row justify-between items-end gap-8"
              style={{
                backgroundImage: `url('https://plus.unsplash.com/premium_photo-1709533328991-cd6191a4186c?q=80&w=3132&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
              }}
            >
              <div className="max-w-2xl">
                <h1
                  className={`text-6xl md:text-7xl ${gelasio.className} tracking-tighter text-[white]`}
                >
                  The Althaïr
                  <br></br>
                  <span className="italic text-[white] font-normal">
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
                <ItemCard key={item.item_id} item={item} />
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
