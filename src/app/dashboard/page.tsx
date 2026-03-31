"use client";
import Footer from "@/components/universal/Footer";
import { Roboto, Gelasio } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import "material-symbols";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// probably should make this user/dashboard

const roboto = Roboto({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const gelasio = Gelasio({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export default function Dashboard() {
  const [hasItems, setHasItems] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(2);
  const itemsPerPage = 6;
  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1,
  );
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // useful - item_name, price, image_url, item_id
  const [items, setItems] = useState<any[]>([
    {
      item_id: 1,
      item_name: "Earth Ovoid Vessel",
      price: 840.0,
      image_url:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuB6lpnZPenUoxA4grBp1o8XLkj_N7RHfgiyNRZd4I5sPj0AkLl1xfdBNVii-m2DA91V9kVJlNwfz9fSJFQ7u06-W3HSs_kDB60h9rB-EcSi8IMzg0laDY_H8IY9gmlCia2TsPIQAzMhstGhgzGvY3Vpsu2_ffaSaxY6ke4upPMK2GT0I-l322bnhVqXTx5Tn68BEPUwmdzmIh8t-F19cW6JSvkjAN-Gx7LO9bNlpuIfHp_MvVirq7PGUr7rtTihdmxybVmI9vp6lAAS",
    },
    {
      item_id: 2,
      item_name: "Raw Linen Throw",
      price: 320.0,
      image_url:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAWGgUilHOT-zzW0DcPVqCT53N7_4McZ84Qrwe0rRtdqoOyvhiHBVr08PtpNoq3S_TdNzDx_JPbfax0Ebl-tKEjV7kwP8jm_L1gPWLhDNrJraus5O1xIF5UkNiy5U4JObaBpnR1tyRr4BhLEMxC9nI8jFy5sIIkFCEIlRWtWz7ye4-dp_K15mCrKO7neIN4RrMe1CuzdQGk5gu6521T2CPrW1kOx2JGdknIv0YxavwN5iC-VuMlX1qZZY41xdJeom1tMPXOrmpBkvhK",
    },
    {
      item_id: 3,
      item_name: "Oblique2 Oak Chair",
      price: 1450.0,
      image_url:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBRPa6AsHFm_R12tWXZvgh9seL0IavW-y2gls_AETPGFbYsVUKImLN8YOyYU3R8evkKFU14ai2b3JjskFBcdhpeKR-Nu8jTF9vOWZvFHuXit-2lnZfpdAXhWzuA6tdGP4Ln_aRHkOpldmiLarpb6S0iOUU-cDnfyvqCjh4Aq5SSTDmWnLFsIDjo4zH3FdkeGmnYOzrEB73gZ9iYIQrMuAxkB2ZDToAQvxAueJgGyPHZEKUEaX2IPkvAGgh5DhcA-D2D1gEpaGcNeUPr",
    },
    {
      item_id: 4,
      item_name: "Oblique3 Oak Chair",
      price: 1450.0,
      image_url:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBRPa6AsHFm_R12tWXZvgh9seL0IavW-y2gls_AETPGFbYsVUKImLN8YOyYU3R8evkKFU14ai2b3JjskFBcdhpeKR-Nu8jTF9vOWZvFHuXit-2lnZfpdAXhWzuA6tdGP4Ln_aRHkOpldmiLarpb6S0iOUU-cDnfyvqCjh4Aq5SSTDmWnLFsIDjo4zH3FdkeGmnYOzrEB73gZ9iYIQrMuAxkB2ZDToAQvxAueJgGyPHZEKUEaX2IPkvAGgh5DhcA-D2D1gEpaGcNeUPr",
    },
    {
      item_id: 5,
      item_name: "Oblique4 Oak Chair",
      price: 1450.0,
      image_url:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBRPa6AsHFm_R12tWXZvgh9seL0IavW-y2gls_AETPGFbYsVUKImLN8YOyYU3R8evkKFU14ai2b3JjskFBcdhpeKR-Nu8jTF9vOWZvFHuXit-2lnZfpdAXhWzuA6tdGP4Ln_aRHkOpldmiLarpb6S0iOUU-cDnfyvqCjh4Aq5SSTDmWnLFsIDjo4zH3FdkeGmnYOzrEB73gZ9iYIQrMuAxkB2ZDToAQvxAueJgGyPHZEKUEaX2IPkvAGgh5DhcA-D2D1gEpaGcNeUPr",
    },
    {
      item_id: 6,
      item_name: "Oblique5 Oak Chair",
      price: 1450.0,
      image_url:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBRPa6AsHFm_R12tWXZvgh9seL0IavW-y2gls_AETPGFbYsVUKImLN8YOyYU3R8evkKFU14ai2b3JjskFBcdhpeKR-Nu8jTF9vOWZvFHuXit-2lnZfpdAXhWzuA6tdGP4Ln_aRHkOpldmiLarpb6S0iOUU-cDnfyvqCjh4Aq5SSTDmWnLFsIDjo4zH3FdkeGmnYOzrEB73gZ9iYIQrMuAxkB2ZDToAQvxAueJgGyPHZEKUEaX2IPkvAGgh5DhcA-D2D1gEpaGcNeUPr",
    },
    {
      item_id: 7,
      item_name: "Oblique6 Oak Chair",
      price: 1450.0,
      image_url:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBRPa6AsHFm_R12tWXZvgh9seL0IavW-y2gls_AETPGFbYsVUKImLN8YOyYU3R8evkKFU14ai2b3JjskFBcdhpeKR-Nu8jTF9vOWZvFHuXit-2lnZfpdAXhWzuA6tdGP4Ln_aRHkOpldmiLarpb6S0iOUU-cDnfyvqCjh4Aq5SSTDmWnLFsIDjo4zH3FdkeGmnYOzrEB73gZ9iYIQrMuAxkB2ZDToAQvxAueJgGyPHZEKUEaX2IPkvAGgh5DhcA-D2D1gEpaGcNeUPr",
    },
    {
      item_id: 8,
      item_name: "Oblique7 Oak Chair",
      price: 1450.0,
      image_url:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBRPa6AsHFm_R12tWXZvgh9seL0IavW-y2gls_AETPGFbYsVUKImLN8YOyYU3R8evkKFU14ai2b3JjskFBcdhpeKR-Nu8jTF9vOWZvFHuXit-2lnZfpdAXhWzuA6tdGP4Ln_aRHkOpldmiLarpb6S0iOUU-cDnfyvqCjh4Aq5SSTDmWnLFsIDjo4zH3FdkeGmnYOzrEB73gZ9iYIQrMuAxkB2ZDToAQvxAueJgGyPHZEKUEaX2IPkvAGgh5DhcA-D2D1gEpaGcNeUPr",
    },
    {
      item_id: 9,
      item_name: "Oblique8 Oak Chair",
      price: 1450.0,
      image_url:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBRPa6AsHFm_R12tWXZvgh9seL0IavW-y2gls_AETPGFbYsVUKImLN8YOyYU3R8evkKFU14ai2b3JjskFBcdhpeKR-Nu8jTF9vOWZvFHuXit-2lnZfpdAXhWzuA6tdGP4Ln_aRHkOpldmiLarpb6S0iOUU-cDnfyvqCjh4Aq5SSTDmWnLFsIDjo4zH3FdkeGmnYOzrEB73gZ9iYIQrMuAxkB2ZDToAQvxAueJgGyPHZEKUEaX2IPkvAGgh5DhcA-D2D1gEpaGcNeUPr",
    },
  ]);
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);
  const emptySlots = itemsPerPage - currentItems.length;
  const router = useRouter();

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
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
            Authorisation: `Bearer ${localStorage.getItem("accessToken")}`,
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
        const response = await fetch(
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

        if (response.status === 200) {
          const body = await response.json();
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

  return (
    <>
      <nav
        className={`flex justify-between items-center top-0 z-50 px-12 h-20 fixed bg-[#F9F8F6] dark:bg-[#1a1c1b] opacity-85 ${roboto.className} antialiased tracking-tight w-full`}
      >
        <div className="flex items-center gap-8">
          <span
            className={`text-2xl ${gelasio.className} tracking-tighter text-[#1A1C1B] dark:text-[#FAF9F7]`}
          >
            The Curated Althair
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
          <button className="flex items-center gap-2 px-5 py-2 bg-[#5F5E5E] text-[#FFFFFF] text-xs uppercase tracking-widest hover:bg-[#1A1C1B] transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-sm">
              image_arrow_up
            </span>
            <span className="hidden sm:inline">recommend with ai</span>
          </button>
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
      <main className="bg-[#F9F8F6] pt-32 pb-24 px-12 mx-auto min-h-screen">
        {hasItems ? (
          <>
            <header className="mb-20 flex flex-col md:flex-row justify-between items-end gap-8">
              <div className="max-w-2xl">
                <h1
                  className={`text-6xl md:text-7xl ${gelasio.className} tracking-tighter text-[#1a1c1b]`}
                >
                  The Althair
                  <br></br>
                  <span className="italic text-[#5f5e5e] font-normal">
                    Catalog
                  </span>
                </h1>
              </div>
              <div
                className={`${roboto.className} flex flex-wrap gap-4 font-body text-xs uppercase tracking-widest`}
              >
                <button className="px-6 py-3 bg-[#FFFFFF] border border-[#D1C5B4]/20 hover:bg-[#F4F3F1] transition-colors text-[#775A19] border-b-2 border-b-[#775A19] cursor-pointer">
                  New Arrivals
                </button>
                <button className="px-6 py-3 bg-[#FFFFFF] border border-[#D1C5B4]/20 hover:bg-[#F4F3F1] transition-colors text-[#775A19] cursor-pointer">
                  Best Sellers
                </button>
                <button className="px-6 py-3 bg-[#FFFFFF] border border-[#D1C5B4]/20 hover:bg-[#F4F3F1] transition-colors text-[#775A19] cursor-pointer">
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
            </div>
            <footer className="mt-32 pt-16 border-t border-[#D1C5B4]/10 flex justify-center items-center gap-12">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="material-symbols-outlined text-[#5F5E5E] hover:text-[#775A19] transition-colors cursor-pointer"
              >
                chevron_left
              </button>
              <div
                className={`flex gap-8 ${roboto.className} text-sm tracking-widest`}
              >
                {pageNumbers.map((number) => (
                  <button
                    key={number}
                    onClick={() => setCurrentPage(number)}
                    disabled={number === currentPage}
                    className={`${number === currentPage ? "text-[#1A1C1B] font-bold border-b border-[#1A1C1B]" : "text-[#5F5E5E] hover:text-[#1A1C1B] transition-colors cursor-pointer"}`}
                  >
                    {number >= 10 ? number : `0${number}`}
                  </button>
                ))}
              </div>
              <button
                onClick={handleNext}
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
