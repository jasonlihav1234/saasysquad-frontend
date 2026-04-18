"use client";

import { Roboto, Gelasio } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import "material-symbols";
import { requestToBodyStream } from "next/dist/server/body-streams";

const roboto = Roboto({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const gelasio = Gelasio({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const navLinks = [
  { href: "/dashboard", label: "Catalog" },
  { href: "/product/sell", label: "Sell Items" },
  { href: "/product/sell/agent", label: "Agent"}
];

interface TopNavBarProps {
  activeHref?: string;
  onSearch?: (term: string) => void;
  onAiClick?: () => void;
}

function TopNavBarContent({ activeHref, onSearch, onAiClick }: TopNavBarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    } else {
      router.push(`/dashboard?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const isCartSidebarOpen = searchParams.get("sidebar") === "cart";

  useEffect(() => {
    if (!isCartSidebarOpen) return;

    const fetchCart = async () => {
      setIsLoading(true);

      try {
        const response = await fetch(
          "https://sassysquad-backend.vercel.app/cart",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          },
        );

        if (response.status === 200) {
          const body = await response.json();
          setCartItems(body.items);
          setSubtotal(body.subtotal);
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

            await fetchCart();
          } else {
            localStorage.clear();
            router.push("/login");
          }
        } else {
          const body = await response.json();
          console.log(body);
          localStorage.clear();
          router.push("/login");
        }
      } catch (error) {
        console.log(error);
        alert(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, [isCartSidebarOpen]);

  const openCart = () => router.push("?sidebar=cart");
  const closeCart = () => router.push("?");

  const recalculateSubtotal = (items: any[]) => {
    const newTotal = items.reduce((sum, item) => sum + item.itemTotal, 0);
    setSubtotal(newTotal);
  };

  const handleRemoveItem = async (itemId: string) => {
    const updatedItems = cartItems.filter((item) => item.item_id !== itemId);
    setCartItems(updatedItems);
    recalculateSubtotal(updatedItems);

    try {
      const response = await fetch(
        `https://sassysquad-backend.vercel.app/cart/items/${itemId}`,
        {
          method: "DELTE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      );

      if (!response.ok) {
        console.log("Failed to remove item");
      }
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      return handleRemoveItem(itemId);
    }

    const updatedItems = cartItems.map((item) => {
      if (item.item_id === itemId) {
        const price = Number(item.price);
        return {
          ...item,
          quantity: newQuantity,
          itemTotal: price * newQuantity,
        };
      }

      return item;
    });

    setCartItems(updatedItems);
    recalculateSubtotal(updatedItems);

    try {
      const response = await fetch(
        `https://sassysquad-backend.vercel.app/items/${itemId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({ quantity: newQuantity }),
        },
      );

      if (!response.ok) {
        console.log("Failed to update item quantity");
      }
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  return (
    <>
      <nav
        className={`flex justify-between items-center top-0 z-50 px-12 h-20 fixed bg-[#F9F8F6] dark:bg-[#1a1c1b] ${roboto.className} antialiased tracking-tight w-full`}
      >
        <div className="flex items-center gap-8">
          {activeHref === "/dashboard" ? (
            <span
              className={`text-2xl ${gelasio.className} cursor-default tracking-tighter text-[#1A1C1B] dark:text-[#FAF9F7]`}
            >
              The Curated Althaïr
            </span>
          ) : (
            <Link
              href="/dashboard"
              className={`text-2xl ${gelasio.className} tracking-tighter text-[#1A1C1B] dark:text-[#FAF9F7] hover:opacity-80 transition-opacity`}
            >
              The Curated Althaïr
            </Link>
          )}
          <div className="hidden md:flex gap-6 items-center">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={
                  activeHref === href
                    ? `text-[#775A19] dark:text-[#C5A059] border-b border-[#775A19]`
                    : `text-[#5f5e5e] dark:text-[#a7a5a5] hover:text-[#775a19] transition-colors duration-300`
                }
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div className="relative hidden lg:block group">
          <form className="relative inline-block" onSubmit={handleSearchSubmit}>
            <input
              className={`bg-[#F4F3F1] focus:ring-0 sm:w-50 md:w-100 lg:w-150 py-2 px-2 text-sm ${roboto.className} outline-none border-b border-[#D1C5B4] focus:border-[#775A19] transition-all`}
              placeholder="Search catalog..."
              name="search-string"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
            onClick={onAiClick}
            className="flex items-center gap-2 px-5 py-2 bg-[#5F5E5E] text-[#FFFFFF] text-xs uppercase tracking-widest hover:bg-[#1A1C1B] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">
              image_arrow_up
            </span>
            <span className="hidden sm:inline">recommend with ai</span>
          </button>
          <button onClick={openCart}>
            <span className="material-symbols-outlined text-primary cursor-pointer hover:text-secondary transition-colors">
              shopping_cart
            </span>
          </button>
          <div className="w-8 h-8 bg-surface-container-highest flex items-center justify-center overflow-hidden">
            <Link href="/settings">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIEWWIsS24oEuhS288WfCZjz-DYqXxsIG0aCNeFSv78p1rnf6XwcNzKSw-Xn1_AUFH_ESsayZqp-A6g9FAOCencuC1ka2p90hh06vwU4RCpA5Hwuk70p6PViQLxszYYVWfaLRm4VcP-tFyWJY2Zgqmwlg37Yt-iN7qKnSfl812uX1V6D9gAzX43IGcr63yiDKlxJjky5qS3cDTR63mrstO31kxFyupT6m7F2_peMXjtNvbrgTXD5doEoG3vBr0gESyhoIGCZvtgLi7"
                alt="User Profile"
                width={32}
                height={32}
              />
            </Link>
          </div>
        </div>
      </nav>

      {isCartSidebarOpen && (
        <div
          onClick={closeCart}
          className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm transition-opacity"
          aria-hidden="true"
        ></div>
      )}

      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-[#ffffff] z-[70] shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${isCartSidebarOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-8 flex justify-between items-center border-b border-[#d1c5b4]">
          <h2
            className={`text-2xl ${gelasio.className} tracking-tight text-[#1a1c1b]`}
          >
            Your cart
          </h2>
          <button
            onClick={closeCart}
            className="material-symbols-outlined cursor-pointer text-[#5f5e5e] hover:text-[#775a19] transition-colors cursor-pointer"
          >
            close
          </button>
        </div>

        <div className="p-8 flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="w-6 h-6 border-2 border-[#d1c5b4] border-t-[#775a19] rounded-full animate-spin"></div>
            </div>
          ) : cartItems.length > 0 ? (
            <div className="flex flex-col gap-8">
              {cartItems.map((item) => (
                <div key={item.item_id} className="flex gap-4">
                  <div className="w-24 h-24 bg-[#f4f3f1] shrink-0">
                    <img
                      src={item.image_url}
                      alt={item.item_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col justify-between flex-1 py-1">
                    <div>
                      <h3
                        className={`text-sm ${gelasio.className} text-[#1a1c1b] truncate pr-4`}
                      >
                        {item.item_name}
                      </h3>

                      <div className="flex items-center gap-4 mt-3 border border-[#d1c5b4]/50 w-max px-2 py-1">
                        <button
                          onClick={() =>
                            handleUpdateQuantity(
                              item.item_id,
                              item.quantity - 1,
                            )
                          }
                          className={`text-sm ${roboto.className} text-[#a7a5a5] hover:text-[#1a1c1b] transition-colors cursor-pointer px-1`}
                        >
                          -
                        </button>
                        <span
                          className={`text-xs ${roboto.className} text-[#5f5e5e] w-4 text-center`}
                        >
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleUpdateQuantity(
                              item.item_id,
                              item.quantity + 1,
                            )
                          }
                          className={`text-sm ${roboto.className} text-[#a7a5a5] hover:text-[#1a1c1b] transition-colors cursor-pointer px-1`}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-end mt-2">
                      <span
                        className={`text-sm ${gelasio.className} text-[#775a19]`}
                      >
                        ${item.itemTotal.toFixed(2)}
                      </span>

                      <button
                        onClick={() => handleRemoveItem(item.item_id)}
                        className={`text-[10px] ${roboto.className} uppercase tracking-widest text-[#a7a5a5] hover:text-[#1a1c1b] transition-colors border-b border-transparent hover:border-[#1a1c1b] pb-0.5 cursor-pointer`}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center h-full opacity-60">
              <span className="material-symbols-outlined text-4xl mb-4 text-[#d1c5b4]">
                shopping_bag
              </span>
              <p
                className={`text-sm ${roboto.className} uppercase tracking-[0.2em] text-[#5f5e5e] mb-2`}
              >
                Your cart is empty
              </p>
            </div>
          )}
        </div>

        <div className="p-8 border-t border-[#d1c5b4]/10 bg-[#fafafa]">
          <div className="flex justify-between items-center mb-6">
            <span
              className={`text-sm ${roboto.className} uppercase tracking-widest text-[#5f5e5e]`}
            >
              Subtotal
            </span>
            <span className={`text-lg ${gelasio.className} text-[#1a1c1b]`}>
              {subtotal.toFixed(2)}
            </span>
          </div>
          <button
            disabled={cartItems.length === 0}
            onClick={() => router.push("/checkout")}
            className="w-full py-4 bg-[#1a1c1b] text-[#ffffff] text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#775a19] transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            Proceed to Checkout
          </button>
        </div>
      </aside>
    </>
  );
}

export default function TopNavBar(props: TopNavBarProps) {
  return (
    <Suspense
      fallback={
        <nav className="flex justify-between items-center top-0 z-50 px-12 h-20 fixed bg-[#F9F8F6] dark:bg-[#1a1c1b] w-full">
          <div className="text-2xl tracking-tighter text-[#1A1C1B]">
            The Curated Althaïr
          </div>
        </nav>
      }
    >
      <TopNavBarContent {...props} />
    </Suspense>
  );
}
