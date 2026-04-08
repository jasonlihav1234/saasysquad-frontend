"use client";

import Footer from "@/components/universal/Footer";
import { Roboto, Gelasio, PT_Sans_Narrow } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import "material-symbols";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useEffect,
  useState,
  useRef,
  Suspense,
  use,
  KeyboardEvent,
} from "react";
import { getFallbackRouteParams } from "next/dist/server/request/fallback-params";

// probably should make this user/dashboard

const roboto = Roboto({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const gelasio = Gelasio({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export default function SellProducePage() {
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [category, setCategory] = useState<string>("");
  const [dbCategories, setDbCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isTagOpen, setIsTagOpen] = useState(false);
  const [toGeneratePrice, setToGeneratePrice] = useState(false);
  const [insightState, setInsightState] = useState<
    "awaiting" | "loading" | "complete"
  >("awaiting");
  const [expectedMonthlyVolume, setExpectedMonthlyVolume] = useState([]);
  const [maxExpectedRevenue, setMaxExpectedRevenue] = useState(0);
  const [optimalPrice, setOptimalPrice] = useState(0);
  const [suggestedPriceRange, setSuggestedPriceRange] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [description, setDescription] = useState("");

  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const tagDropdownRef = useRef<HTMLDivElement>(null);
  const isSubmittingRef = useRef<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://sassysquad-backend.vercel.app/categories",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          },
        );

        let body = null;

        if (response.status === 401) {
          const refreshResponse = await fetch(
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

          const refreshBody = await refreshResponse.json();
          localStorage.setItem("accessToken", refreshBody.accessToken);
          localStorage.setItem("refreshToken", refreshBody.refreshToken);

          const categoryResponse = await fetch(
            "https://sassysquad-backend.vercel.app/categories",
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            },
          );

          body = await categoryResponse.json();
        } else {
          body = await response.json();
        }

        const filteredCategories = body.categories.map((entry: any) => {
          return entry.category_name.split("-").join(" ").toUpperCase();
        });

        setDbCategories(filteredCategories);

        const tagResponse = await fetch(
          "https://sassysquad-backend.vercel.app/tags",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          },
        );
        let tagBody = null;

        if (tagResponse.status === 401) {
          const refreshResponse2 = await fetch(
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

          const refreshBody2 = await refreshResponse2.json();
          localStorage.setItem("accessToken", refreshBody2.accessToken);
          localStorage.setItem("refreshToken", refreshBody2.refreshToken);

          const tagNewResponse = await fetch(
            "https://sassysquad-backend.vercel.app/tags",
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            },
          );

          tagBody = await tagNewResponse.json();
        } else {
          tagBody = await tagResponse.json();
        }
        const filteredTags = tagBody.tags.map((tag: any) => {
          return tag.tag_name.split("-").join(" ").toUpperCase();
        });

        setTags(filteredTags);
      } catch (error) {
        alert(error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCategoryOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleTagClickOutside = (event: MouseEvent) => {
      if (
        tagDropdownRef.current &&
        !tagDropdownRef.current.contains(event.target as Node)
      ) {
        setIsTagOpen(false);
      }
    };

    document.addEventListener("mousedown", handleTagClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleTagClickOutside);
  }, []);

  const filteredCategories = dbCategories.filter((cat) =>
    cat.toLowerCase().includes(category.toLowerCase()),
  );

  const filteredTags = tags.filter(
    (tag) =>
      tag.toLowerCase().includes(tagInput.toLowerCase()) &&
      !selectedTags.includes(tag),
  );

  const handleGenerateEstimate = async () => {
    setInsightState("loading");

    // make the categories lowercase with spaces changed to -
    // join the words in each entry, spaces changed to - all lowercase
    const formattedCategory = category.toLowerCase().replace(/\s+/g, "-");
    const formattedTags = selectedTags
      .map((tag) => tag.toLowerCase().replace(/\s+/g, "-"))
      .join(",");

    console.log(formattedCategory, formattedTags);

    try {
      const response = await fetch(
        "https://sassysquad-backend.vercel.app/v1/pricing/estimate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({
            tags: formattedTags,
            category: formattedCategory,
          }),
        },
      );
      const body = await response.json();

      if (response.status === 200) {
        setExpectedMonthlyVolume(body.prediction.expected_monthly_volume);
        setMaxExpectedRevenue(body.prediction.max_expected_revenue);
        setOptimalPrice(body.prediction.optimal_price);
        setSuggestedPriceRange(body.prediction.suggested_price_range);
        console.log("here", body);
      } else if (response.status === 401) {
        // renew tokens
        // this will infinite loop if there is a serious issue, fix this later
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
          const refreshBody = await responseRefresh.json();
          localStorage.setItem("accessToken", refreshBody.accessToken);
          localStorage.setItem("refreshToken", refreshBody.refreshToken);

          await handleGenerateEstimate();
        }
      } else {
        throw new Error("Critical Error");
      }

      console.log("Exact error: ", body);
      setInsightState("complete");
    } catch (error) {
      setInsightState("awaiting");
      console.log(error);
    }
  };

  const handleImageChange = (e: any) => {
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

  const addTag = (newTag: string) => {
    // Force it to be trimmed and uppercase immediately
    const formattedTag = newTag.trim().toUpperCase();

    if (formattedTag === "") return;

    // Since everything is uppercase, a simple .includes() works perfectly again!
    if (!selectedTags.includes(formattedTag)) {
      setSelectedTags([...selectedTags, formattedTag]);
    }

    // Reset the input
    setTagInput("");
    setIsTagOpen(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevents form submission/page reload

      // Only try to add a tag if the input isn't empty
      if (tagInput.trim() !== "") {
        addTag(tagInput); // Pass the heavy lifting to your main function!
      }
    }
  };

  const removeTag = (index: number) => {
    setSelectedTags(selectedTags.filter((_, i) => i !== index));
  };

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (isSubmittingRef.current) {
      return;
    }

    isSubmittingRef.current = true;
    setIsSubmitting(true);

    if (!category || !selectedTags || selectedTags.length === 0) {
      setIsSubmitting(false);
      isSubmittingRef.current = false;

      return;
    }

    const formattedCategory = category.toLowerCase().split(" ").join("-");
    const formattedTags = selectedTags.map((tag) =>
      tag.toLowerCase().split(" ").join("-"),
    );
    const itemName = formData.get("item-name");
    const price = formData.get("listing-price");
    const quantity = formData.get("quantity");

    console.log(
      itemName,
      price,
      quantity,
      description,
      formattedCategory,
      formattedTags,
    );

    try {
      // transform the tag and category to be lowercase
      // need the item name, price, quantity, description, and image, also need tags, and category
      const submitResponse = await fetch(
        "https://sassysquad-backend.vercel.app/v2/items",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({
            itemName: itemName,
            description: description,
            price: Number(price),
            quantityAvailable: Number(quantity),
            imageUrl: imageBase64,
            categoryName: formattedCategory,
            tags: formattedTags,
          }),
        },
      );

      if (submitResponse.status === 201) {
        alert("Item successfully created");

        e.target.reset();
        setSelectedTags([]);
        setCategory("");
        setImageBase64(null);
        setInsightState("awaiting");
        setDescription("");
        categoryDropdownRef.current = null;
        tagDropdownRef.current = null;
        isSubmittingRef.current = false;
      } else if (submitResponse.status === 401) {
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
          const refreshBody = await responseRefresh.json();
          localStorage.setItem("accessToken", refreshBody.accessToken);
          localStorage.setItem("refreshToken", refreshBody.refreshToken);

          alert("Token expired, submit forum again");
        }
      } else {
        console.log(await submitResponse.json());
        alert("fatal error in submission");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
      isSubmittingRef.current = false;
    }
  };

  return (
    <div className="flex bg-[#faf9f7]">
      <aside
        className={`w-64 bg-[#F5F3EF] text-[#2D2D2D] ${roboto.className} min-h-screen flex overflow-hidden flex-col justify_between border-r border-[#D1CFC9]/50 shrink-0`}
      >
        <div className="p-8 pt-10 border-b border-[#775a19]">
          <h1
            className={`${gelasio.className} italic text-xl text-[#2D2D2D] mb-1 tracking-wide`}
          >
            Member Dashboard
          </h1>
        </div>
        <nav className="mt-8 px-4">
          <ul className="space-y-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-4 px-4 py-3 text-sm font-medium text-[#737373] hover:text-[#2D2D2D] transition-colors"
            >
              <span className="material-symbols-outlined !text-2xl text-[#5f5e5e] leading-none -translate-y-[2px]">
                shopping_bag
              </span>
              Catalog
            </Link>
            <Link
              href="/purchases"
              className="flex items-center gap-4 px-4 py-3 text-sm font-medium text-[#737373] hover:text-[#2D2D2D] transition-colors"
            >
              <span className="material-symbols-outlined !text-2xl text-[#5f5e5e] leading-none">
                sell
              </span>
              Purchases
            </Link>
            <Link
              href="/sales"
              className="flex items-center gap-4 px-4 py-3 text-sm font-medium text-[#737373] hover:text-[#2D2D2D] transition-colors"
            >
              <span className="material-symbols-outlined !text-2xl text-[#5f5e5e] leading-none">
                Orders
              </span>
              Sales
            </Link>
            <Link
              href="/messages"
              className="flex items-center gap-4 px-4 py-3 text-sm font-medium text-[#737373] hover:text-[#2D2D2D] transition-colors"
            >
              <span className="material-symbols-outlined !text-2xl text-[#5f5e5e] leading-none">
                Forum
              </span>
              Messages
            </Link>
          </ul>
        </nav>
      </aside>
      <div className="flex flex-col flex-1">
        <header
          className={`top-0 w-full z-50 glass-nav ${roboto.className} antialiased tracking-tight`}
        >
          <div className="flex gap-8 justify-between items-center px-12 py-6 w-full max-w-[1920px] mx-auto">
            <span
              className={`text-4xl ${gelasio.className} tracking-tighter text-[#1A1C1B] dark:text-[#FAF9F7]`}
            >
              The Curated Althaïr
            </span>
            <div className="w-8 h-8 bg-surface-container-highest flex items-center justify-center overflow-hidden">
              <Link href="/settings">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIEWWIsS24oEuhS288WfCZjz-DYqXxsIG0aCNeFSv78p1rnf6XwcNzKSw-Xn1_AUFH_ESsayZqp-A6g9FAOCencuC1ka2p90hh06vwU4RCpA5Hwuk70p6PViQLxszYYVWfaLRm4VcP-tFyWJY2Zgqmwlg37Yt-iN7qKnSfl812uX1V6D9gAzX43IGcr63yiDKlxJjky5qS3cDTR63mrstO31kxFyupT6m7F2_peMXjtNvbrgTXD5doEoG3vBr0gESyhoIGCZvtgLi7"
                  alt="User Profile"
                  width={32}
                  height={32}
                ></Image>
              </Link>
            </div>
          </div>
        </header>
        <main
          className={`pt-5 pb-24 px-6 md:px-12 flex-groew max-w-[1920px] mx-auto w-full`}
        >
          <div className="grid grid-cols1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-7 space-y-16">
              <header>
                <p
                  className={`${gelasio.className} text-5xl font-black tracking-tight leading-tight text-[#1a1c1b]`}
                >
                  List a New Item
                </p>
              </header>
              <form className="space-y-12" onSubmit={handleFormSubmit}>
                <label className="group relative aspect-[16/9] bg-[#efeeec] flex flex-col items-center justify-center border border-dashed border-[#d1c5b4] transition-all hover:bg-[#e9e8e6] overflow-hidden cursor-pointer">
                  <input
                    type="file"
                    accept="image/jpeg, image/png"
                    className="hidden"
                    name="item-image"
                    onChange={handleImageChange}
                  ></input>
                  {imageBase64 ? (
                    <img
                      src={imageBase64}
                      alt="Preview"
                      className="absolute inset-0 w-full h-full object-cover"
                    ></img>
                  ) : (
                    <>
                      <span className="material-symbols-outlined !text-4xl text-[#5f5e5e] mb-4">
                        add_photo_alternate
                      </span>
                      <p
                        className={`${roboto.className} text-xs uppercase- tracking-widest text-[#5f5e5e] uppercase`}
                      >
                        Upload High-Resolution Image
                      </p>
                      <p
                        className={`text-[10px] ${roboto.className} mt-2 text-[#5f5e5e]`}
                      >
                        JPG OR PNG (MAX 50MB)
                      </p>
                    </>
                  )}
                </label>
                <section className="space-y-8">
                  <div className="flex justify-between items-end">
                    <h3 className={`${gelasio.className} text-2xl`}>
                      Category
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <button
                      type="button"
                      onClick={() => setCategory("Chair")}
                      className={`py-4 border flex flex-col items-center gap-2 transition-all active:scale-95 cursor-pointer ${
                        category === "Chair"
                          ? "border-[#775a19] bg-[#775a19]/5 text-[#775a19]"
                          : "border-[#d1c5b4]/30 hover:border-[#5f5e5e] text-[#a7a5a5] hover:text-[#5f5e5e]"
                      }`}
                    >
                      <span className="material-symbols-outlined text-lg">
                        chair_alt
                      </span>
                      <span className="text-[0.7rem] uppercase tracking-widest font-medium">
                        Chair
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCategory("Sculpture")}
                      className={`py-4 border flex flex-col items-center gap-2 transition-all active:scale-95 cursor-pointer ${
                        category === "Sculpture"
                          ? "border-[#775a19] bg-[#775a19]/5 text-[#775a19]"
                          : "border-[#d1c5b4]/30 hover:border-[#5f5e5e] text-[#a7a5a5] hover:text-[#5f5e5e]"
                      }`}
                    >
                      <span className="material-symbols-outlined text-lg">
                        oral_disease
                      </span>
                      <span className="text-[0.7rem] uppercase tracking-widest font-medium">
                        Sculpture
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCategory("Sofa")}
                      className={`py-4 border flex flex-col items-center gap-2 transition-all active:scale-95 cursor-pointer ${
                        category === "Sofa"
                          ? "border-[#775a19] bg-[#775a19]/5 text-[#775a19]"
                          : "border-[#d1c5b4]/30 hover:border-[#5f5e5e] text-[#a7a5a5] hover:text-[#5f5e5e]"
                      }`}
                    >
                      <span className="material-symbols-outlined text-lg">
                        chair
                      </span>
                      <span className="text-[0.7rem] uppercase tracking-widest font-medium">
                        Sofa
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCategory("Table")}
                      className={`py-4 border flex flex-col items-center gap-2 transition-all active:scale-95 cursor-pointer ${
                        category === "Table"
                          ? "border-[#775a19] bg-[#775a19]/5 text-[#775a19]"
                          : "border-[#d1c5b4]/30 hover:border-[#5f5e5e] text-[#a7a5a5] hover:text-[#5f5e5e]"
                      }`}
                    >
                      <span className="material-symbols-outlined text-lg">
                        table_bar
                      </span>
                      <span className="text-[0.7rem] uppercase tracking-widest font-medium">
                        Table
                      </span>
                    </button>
                  </div>
                  <div
                    className={`pt-4 ${gelasio.className}`}
                    ref={categoryDropdownRef}
                  >
                    <label
                      className={`block text-[0.65rem] uppercase tracking-[0.2em] text-[#a7a5a5] mb-2 ${roboto.className}`}
                    >
                      select an existing category or specify a unique
                      classification
                    </label>
                    <input
                      list="category-suggestions"
                      name="category"
                      id="category"
                      className="pl-4 focus:outline-0 w-full bg-[#e9e8e6] border-none border-b border-[#d1c5b4] py-3 px-0 focus:border-[#775a19] transition-colors text-lg placeholder:italic placeholder:text-[#d1c5b4]/50"
                      placeholder="Specify other..."
                      type="text"
                      value={category}
                      onChange={(e) => {
                        e.preventDefault();
                        setCategory(e.target.value);
                        setIsCategoryOpen(true);
                      }}
                      onFocus={() => setIsCategoryOpen(true)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          setIsCategoryOpen(false);
                        }
                      }}
                    ></input>

                    {isCategoryOpen && (
                      <ul className="z-10 w-full mt-1 bg-white border border-[#d1c5b4] shadow-lg max-h-48 overflow-y-auto">
                        {filteredCategories.length > 0 ? (
                          filteredCategories.map((cat, index) => (
                            <li
                              key={index}
                              className="px-4 py-3 text-sm text-[#5f5e5e] hover:bg-[#775a19]/5 hover:text-[#775a19] cursor-pointer transition-colors"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                setCategory(cat);
                                setIsCategoryOpen(false);
                              }}
                            >
                              {cat}
                            </li>
                          ))
                        ) : (
                          <li className="px-4 py-3 text-sm text-[#a7a5a5] italic">
                            Create new category: "{category}"
                          </li>
                        )}
                      </ul>
                    )}
                  </div>
                </section>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="flex flex-col gap-2">
                    <label
                      className={`${roboto.className} text-[0.65rem] uppercase tracking-widest text-[#615e57]`}
                    >
                      Item Name
                    </label>
                    <input
                      className={`pl-4 bg-[#e9e8e6] border-0 border-b border-outline px-0 py-3 text-lg italic ${gelasio.className} placeholder:text-[#d1c5b4] focus:ring-0 focus:outline-0`}
                      placeholder="e.g. Mid-Century Oak Table"
                      type="text"
                      name="item-name"
                    ></input>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      className={`${roboto.className} text-[0.65rem] uppercase tracking-widest text-[#615e57]`}
                    >
                      Listing Price
                    </label>
                    <input
                      className={`pl-4 italic bg-[#e9e8e6] border-0 border-b border-outline px-0 py-3 text-lg ${gelasio.className} placeholder:text-[#d1c5b4] focus:ring-0 focus:outline-0`}
                      placeholder="0.00"
                      type="number"
                      step="0.01"
                      name="listing-price"
                    ></input>
                  </div>
                  <div className="flex flex-col gap-2" ref={tagDropdownRef}>
                    <label
                      className={`${roboto.className} text-[0.65rem] uppercase tracking-widest text-[#615e57]`}
                    >
                      Search Tags
                    </label>

                    <div className="relative flex flex-wrap items-center gap-2 bg-[#e9e8e6] border-0 border-b border-outline px-0 py-3 pb-3 pl-3">
                      {selectedTags.map((tag, index) => (
                        <span
                          key={index}
                          className="flex items-center bg-[#e8e2d9] text-[#1d1b16] text-[10px] px-2 py-1 tracking-tighter"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(index)}
                            className="ml-1 material-symbols-outlined !text-[13px] cursor-pointer hover:text-[#775a19] transition-colors"
                          >
                            close
                          </button>
                        </span>
                      ))}

                      <input
                        value={tagInput}
                        onChange={(e) => {
                          setTagInput(e.target.value);
                          setIsTagOpen(true);
                        }}
                        onFocus={() => setIsTagOpen(true)}
                        onKeyDown={handleKeyDown}
                        className={`${gelasio.className} italic pl-2 bg-transparent border-0 focus:ring-0 focus:outline-0 text-sm p-0 flex-grow pt-1.25 pb-1.25 placeholder:text-[#a7a5a5]`}
                        placeholder="Add tags..."
                        type="text"
                        name="tags"
                      />
                      {isTagOpen && (
                        <ul className="absolute top-full z-10 w-full mt-1 bg-white border border-[#d1c5b4] shadow-lg max-h-48 overflow-y-auto">
                          {filteredTags.length > 0
                            ? filteredTags.map((tag, index) => (
                                <li
                                  key={index}
                                  className="px-4 py-3 text-sm text-[#5f5e5e] hover:bg-[#775a19]/5 hover:text-[#775a19] cursor-pointer transition-colors"
                                  // prevent onMouseDown from stealing focus before onClick fires
                                  onMouseDown={(e) => e.preventDefault()}
                                  onClick={() => addTag(tag)}
                                >
                                  {tag}
                                </li>
                              ))
                            : tagInput.trim() !== "" && (
                                <li
                                  className="px-4 py-3 text-sm text-[#5f5e5e] hover:bg-[#775a19]/5 hover:text-[#775a19] cursor-pointer transition-colors"
                                  onMouseDown={(e) => e.preventDefault()}
                                  onClick={() => addTag(tagInput)}
                                >
                                  Create new tag: "{tagInput}"
                                </li>
                              )}
                        </ul>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      className={`${roboto.className} text-[0.65rem] uppercase tracking-widest text-[#615e57]`}
                    >
                      Inventory Count
                    </label>
                    <input
                      className={`italic pl-4 bg-[#e9e8e6] border-0 border-b border-outline px-0 py-3 text-lg ${gelasio.className} focus:ring-0 focus:outline-0`}
                      type="number"
                      name="quantity"
                    ></input>
                  </div>
                  <div className="flex flex-col gap-2 col-span-2">
                    <label
                      className={`${roboto.className} text-[0.65rem] uppercase tracking-widest text-[#615e57]`}
                    >
                      Description
                    </label>
                    <textarea
                      rows={4}
                      className={`pl-4 italic bg-[#e9e8e6] border-0 border-b border-[#7f7667] px-0 py-3 text-md ${gelasio.className} placeholder:text-[#d1c5b4] focus:ring-0 resize-none focus:outline-0`}
                      placeholder="Describe the materials, history, and craftmanship..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                  </div>
                </div>
                <div className="flex gap-8 pt-8">
                  <button
                    className={`flex-1 bg-[#5f5e5e] text-[#ffffff] px-12 py-5 ${roboto.className} text-xs uppercase tracking-[0.2em] hover:bg-[#1a1c1b] transition-all cursor-pointer`}
                  >
                    Create Item
                  </button>
                </div>
              </form>
            </div>
            <aside className="lg:col-span-5 pt-30.5">
              <div className="sticky top-32 space-y-8">
                {insightState === "complete" && (
                  <section className="bg-[#ffffff] p-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <span className="material-symbols-outlined !text-8xl">
                        auto_awesome
                      </span>
                    </div>
                    <div className="relative z-10 space-y-6">
                      <h3
                        className={`${gelasio.className} text-2xl font-bold tracking-tight text-[#1a1c1b]`}
                      >
                        Althaïr Insights
                      </h3>
                      <div>
                        <p
                          className={`block ${roboto.className} text-[0.65rem] uppercase tracking-[0.2em] text-[#5f5e5e] mb-4`}
                        >
                          Optimal Price
                        </p>
                        <span
                          className={`text-3xl ${gelasio.className} font-bold text-[#1a1c1b]`}
                        >
                          ${optimalPrice}
                        </span>
                      </div>
                      <p
                        className={`${roboto.className} block text-[0.65rem] uppercase tracking-[0.2em] text-[#5f5e5e] mb-4`}
                      >
                        Suggested Range
                      </p>
                      <div className="flex items-center gap-2">
                        {suggestedPriceRange &&
                          suggestedPriceRange.length >= 2 && (
                            <>
                              <span
                                className={`text-3xl ${gelasio.className} font-bold text-[#1a1c1b]`}
                              >
                                ${suggestedPriceRange[0]}
                              </span>
                              <span className="text-[#5f5e5e] font-light">
                                —
                              </span>
                              <span
                                className={`text-3xl ${gelasio.className} font-bold text-[#1a1c1b]`}
                              >
                                ${suggestedPriceRange[1]}
                              </span>
                            </>
                          )}
                      </div>
                      <div>
                        <p
                          className={`block ${roboto.className} text-[0.65rem] uppercase tracking-[0.2em] text-[#5f5e5e] mb-4`}
                        >
                          Estimated Volume
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-baseline gap-1">
                            <span
                              className={`text-4xl ${gelasio.className} font-black text-[#775a19]`}
                            >
                              {expectedMonthlyVolume &&
                                expectedMonthlyVolume.length >= 2 && (
                                  <span
                                    className={`text-4xl ${gelasio.className} font-black text-[#775a19]`}
                                  >
                                    {`${expectedMonthlyVolume[1]}-${expectedMonthlyVolume[0]}`}
                                  </span>
                                )}
                            </span>
                            <span
                              className={`text-[0.75rem] uppercase tracking-widest font-bold ${roboto.className}`}
                            >
                              Units
                            </span>
                          </div>

                          <div className="flex items-end gap-1 h-12">
                            <div className="w-1 bg-[#e3e2e0] h-4"></div>
                            <div className="w-1 bg-[#e3e2e0] h-6"></div>
                            <div className="w-1 bg-[#775a19] h-10"></div>
                            <div className="w-1 bg-[#775a19] h-8"></div>
                            <div className="w-1 bg-[#e3e2e0] h-5"></div>
                            <div className="w-1 bg-[#e3e2e0] h-3"></div>
                          </div>
                        </div>
                      </div>
                      <div className="mb-12">
                        <p
                          className={`block ${roboto.className} text-[0.65rem] uppercase tracking-[0.2em] text-[#5f5e5e] mb-4`}
                        >
                          Maximum Expected Revenue
                        </p>
                        <span
                          className={`text-3xl ${gelasio.className} font-bold text-[#1a1c1b]`}
                        >
                          ${maxExpectedRevenue}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleGenerateEstimate()}
                        className={`flex-1 bg-[#5f5e5e] text-[#ffffff] px-12 py-5 ${roboto.className} text-xs uppercase tracking-[0.2em] hover:bg-[#1a1c1b] transition-all cursor-pointer w-full`}
                      >
                        Regenerate Estimate
                      </button>
                    </div>
                  </section>
                )}

                {insightState === "loading" && (
                  <section className="bg-[#ffffff] p-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <span className="material-symbols-outlined !text-8xl animate-pulse">
                        auto_awesome
                      </span>
                    </div>
                    <div className="relative z-10 space-y-6">
                      <h3
                        className={`${gelasio.className} text-2xl font-bold tracking-tight text-[#1a1c1b]`}
                      >
                        Atelier Insights
                      </h3>

                      <div>
                        <p
                          className={`${roboto.className} block text-[0.65rem] uppercase tracking-[0.2em] text-[#5f5e5e] mb-4`}
                        >
                          Suggested Range
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="h-9 w-24 bg-[#e9e8e6] animate-pulse rounded-sm"></div>
                          <span className="text-[#5f5e5e] font-light">—</span>
                          <div className="h-9 w-24 bg-[#e9e8e6] animate-pulse rounded-sm"></div>
                        </div>
                      </div>

                      <div className="mb-12">
                        <p
                          className={`block ${roboto.className} text-[0.65rem] uppercase tracking-[0.2em] text-[#5f5e5e] mb-4`}
                        >
                          Estimated Volume
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-baseline gap-2">
                            <div className="h-10 w-16 bg-[#e9e8e6] animate-pulse rounded-sm"></div>
                            <div className="h-4 w-12 bg-[#e9e8e6] animate-pulse rounded-sm"></div>
                          </div>

                          <div className="flex items-end gap-1 h-12">
                            <div className="w-1 bg-[#e9e8e6] h-4 animate-pulse"></div>
                            <div className="w-1 bg-[#e9e8e6] h-6 animate-pulse delay-75"></div>
                            <div className="w-1 bg-[#e9e8e6] h-10 animate-pulse delay-150"></div>
                            <div className="w-1 bg-[#e9e8e6] h-8 animate-pulse delay-200"></div>
                            <div className="w-1 bg-[#e9e8e6] h-5 animate-pulse delay-[250ms]"></div>
                            <div className="w-1 bg-[#e9e8e6] h-3 animate-pulse delay-300"></div>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled
                        className={`flex-1 bg-[#f4f3f1] text-[#a7a5a5] px-12 py-5 ${roboto.className} text-xs uppercase tracking-[0.2em] transition-all cursor-not-allowed w-full flex justify-center items-center gap-2`}
                      >
                        <span className="w-3 h-3 border-2 border-[#a7a5a5] border-t-transparent rounded-full animate-spin"></span>
                        Calculating
                      </button>
                    </div>
                  </section>
                )}

                {insightState === "awaiting" && (
                  <section className="bg-[#ffffff] p-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <span className="material-symbols-outlined !text-8xl">
                        auto_awesome
                      </span>
                    </div>
                    <div className="relative z-10 space-y-6">
                      <h3
                        className={`${gelasio.className} text-2xl font-bold tracking-tight text-[#1a1c1b]`}
                      >
                        Atelier Insights
                      </h3>
                      <p
                        className={`${roboto.className} text-sm text-[#4e4639] leading-relaxed`}
                      >
                        Utilize our machine learning model to determine the
                        optimal market value based on historical sales
                      </p>
                      <div className="bg-[#f4f3f1] border border-[#d1c5b4] p-8 flex flex-col items-center text-center space-y-4">
                        <span className="material-symbols-outlined text-[#775a19] !text-4xl">
                          analytics
                        </span>
                        <p
                          className={`${roboto.className} text-xs uppercase tracking-widest text-[#5f5e5e] font-bold`}
                        >
                          Awaiting Data
                        </p>
                        <p
                          className={`text-xs text-[#615e57] mt-1 ${roboto.className}`}
                        >
                          Complete item details to generate a precise
                          estimation.
                        </p>
                        <button
                          onClick={() => handleGenerateEstimate()}
                          className={`w-full bg-[#775a19] text-[#ffffff] px-6 py-4 ${roboto.className} text-[0.7rem] uppercase tracking-[0.15em] hover:opacity-90 transition-all flex items-center justify-center gap-2 group cursor-pointer`}
                        >
                          Estimate Market Value
                          <span className="material-symbols-outlined !text-[1rem] group-hover:translate-x-1 transition-transform">
                            arrow_forward
                          </span>
                        </button>
                      </div>
                    </div>
                  </section>
                )}
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}
