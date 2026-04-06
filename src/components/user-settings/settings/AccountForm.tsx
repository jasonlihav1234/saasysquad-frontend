"use client";

import { useState } from "react";
import PageSectionHeading from "@/components/user-settings/shared-components/PageSectionHeading";
import { Gelasio, Roboto } from "next/font/google";

const gelasio = Gelasio({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const roboto = Roboto({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export type AccountFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  biography: string;
};

export const emptyAccountFormValues: AccountFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  biography: "",
};

type AccountFormProps = {
  value: AccountFormValues;
  onChange: (next: AccountFormValues) => void;
};

const fieldShellClass = `${roboto.className} bg-[#E3E2E0] border-b border-[#C5A059] text-[#5F5E5E] p-6`;

const emptyFieldClass = "text-[#5F5E5E]/60 italic";

export default function AccountForm({ value, onChange }: AccountFormProps) {
  const [isEditingPersonalDetails, setIsEditingPersonalDetails] =
    useState(false);

  return (
    <div>
      <PageSectionHeading
        className="mb-12"
        title="Account Details"
        description="Manage your personal details within The Curated Althaïr."
      />

      <section
        id="account"
        className="mb-16 flex flex-col sm:flex-row items-start gap-8 bg-[#F1F1EF] p-8"
      >
        <div className="w-32 h-32 shrink-0 bg-[#E3E2E0] border border-[#C5A059]/30 overflow-hidden">
          <img
            src="/images/login_image.png"
            className="w-full h-full object-cover object-center opacity-60"
            alt="Portrait placeholder for curator profile"
          />
        </div>

        <div className="flex flex-col gap-4 max-w-md">
          <div>
            <h3
              className={`${gelasio.className} text-black text-xl font-medium mb-1`}
            >
              Profile Picture
            </h3>
            <p className={`${roboto.className} text-[#5F5E5E] text-sm`}>
              A visual representation of you.
            </p>
          </div>
          <div className="flex gap-4">
            <button
              type="button"
              className={`${roboto.className} cursor-pointer bg-[#474747] hover:bg-[#303030] transition duration-300 tracking-widest text-sm text-white font-bold px-6 py-3 uppercase`}
            >
              UPDATE
            </button>
            <button
              type="button"
              className={`${roboto.className} cursor-pointer bg-transparent border-b border-[#C5A059] text-[#5F5E5E] hover:text-black transition duration-300 tracking-widest text-sm px-2 py-3 uppercase`}
            >
              REMOVE
            </button>
          </div>
        </div>
      </section>

      <section className="mb-24">
        <h2
          className={`${gelasio.className} text-black text-2xl font-medium mb-8`}
        >
          Personal Details
        </h2>

        <form className="flex flex-col gap-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col">
              <label
                htmlFor={isEditingPersonalDetails ? "firstName" : undefined}
                className={`${roboto.className} text-[#5F5E5E] text-xs uppercase tracking-widest mb-3 cursor-text`}
              >
                FIRST NAME
              </label>
              {isEditingPersonalDetails ? (
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={value.firstName}
                  onChange={(e) =>
                    onChange({ ...value, firstName: e.target.value })
                  }
                  className={`focus:outline-none ${fieldShellClass}`}
                />
              ) : (
                <div className={fieldShellClass}>
                  {value.firstName.trim() ? (
                    value.firstName
                  ) : (
                    <span className={emptyFieldClass}>Not set.</span>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <label
                htmlFor={isEditingPersonalDetails ? "lastName" : undefined}
                className={`${roboto.className} text-[#5F5E5E] text-xs uppercase tracking-widest mb-3 cursor-text`}
              >
                LAST NAME
              </label>
              {isEditingPersonalDetails ? (
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={value.lastName}
                  onChange={(e) =>
                    onChange({ ...value, lastName: e.target.value })
                  }
                  className={`focus:outline-none ${fieldShellClass}`}
                />
              ) : (
                <div className={fieldShellClass}>
                  {value.lastName.trim() ? (
                    value.lastName
                  ) : (
                    <span className={emptyFieldClass}>Not set.</span>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col">
            <label
              htmlFor={isEditingPersonalDetails ? "email" : undefined}
              className={`${roboto.className} text-[#5F5E5E] text-xs uppercase tracking-widest mb-3 cursor-text`}
            >
              EMAIL ADDRESS
            </label>
            {isEditingPersonalDetails ? (
              <input
                id="email"
                name="email"
                type="email"
                value={value.email}
                onChange={(e) => onChange({ ...value, email: e.target.value })}
                className={`focus:outline-none ${fieldShellClass}`}
              />
            ) : (
              <div className={fieldShellClass}>
                {value.email.trim() ? (
                  value.email
                ) : (
                  <span className={emptyFieldClass}>Not set.</span>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <label
              htmlFor={isEditingPersonalDetails ? "bio" : undefined}
              className={`${roboto.className} text-[#5F5E5E] text-xs uppercase tracking-widest mb-3 cursor-text`}
            >
              CURATOR BIOGRAPHY
            </label>
            {isEditingPersonalDetails ? (
              <textarea
                id="bio"
                name="bio"
                rows={4}
                value={value.biography}
                onChange={(e) =>
                  onChange({ ...value, biography: e.target.value })
                }
                className={`${roboto.className} focus:outline-none bg-[#E3E2E0] border-b border-[#C5A059] text-[#5F5E5E] p-6 resize-none`}
              />
            ) : (
              <div
                className={`${roboto.className} bg-[#E3E2E0] border-b border-[#C5A059] text-[#5F5E5E] p-6 min-h-[7.5rem] whitespace-pre-wrap`}
              >
                {value.biography.trim() ? (
                  value.biography
                ) : (
                  <span className={emptyFieldClass}>
                    No biography added yet.
                  </span>
                )}
              </div>
            )}
            <p
              className={`${roboto.className} text-xs text-[#5F5E5E] mt-2 text-right`}
            >
              Leave your mark in the Althaïr curation.
            </p>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="button"
              onClick={() => setIsEditingPersonalDetails((open) => !open)}
              className={`${roboto.className} cursor-pointer bg-[#474747] hover:bg-[#303030] transition duration-300 tracking-widest text-sm text-white font-bold px-8 py-4 uppercase`}
            >
              {isEditingPersonalDetails ? "DONE" : "EDIT DETAILS"}
            </button>
          </div>
        </form>
      </section>

      <div className="w-full h-px bg-[#C5A059]/20 mb-24" />

      <section id="security" className="mb-24 bg-[#F1F1EF] p-8">
        <h2
          className={`${gelasio.className} text-black text-2xl font-medium mb-2`}
        >
          Security
        </h2>
        <p className={`${roboto.className} text-[#5F5E5E] text-sm mb-6`}>
          Protect your account
        </p>
        <div className="flex flex-col gap-2">
          <a
            href="#"
            className={`${roboto.className} flex items-center justify-between p-5 bg-[#F9F8F6] hover:bg-[#E3E2E0] transition-colors duration-200 border-l-2 border-transparent hover:border-[#C5A059]`}
          >
            <span className="text-sm font-medium text-black tracking-wide">
              Change Password
            </span>
            <span className="text-[#5F5E5E] text-lg">›</span>
          </a>
          <a
            href="#"
            className={`${roboto.className} flex items-center justify-between p-5 bg-[#F9F8F6] hover:bg-[#E3E2E0] transition-colors duration-200 border-l-2 border-transparent hover:border-[#C5A059]`}
          >
            <div>
              <span className="text-sm font-medium text-black tracking-wide block">
                Two-Factor Authentication
              </span>
              <span className="text-xs text-[#5F5E5E]">Currently disabled</span>
            </div>
            <span className="text-[#5F5E5E] text-lg">›</span>
          </a>
        </div>
      </section>
    </div>
  );
}
