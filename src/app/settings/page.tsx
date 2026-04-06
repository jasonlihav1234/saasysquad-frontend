"use client";

import { useState } from "react";
import Sidebar from "@/components/user-settings/shared-components/Sidebar";
import AccountForm, {
  emptyAccountFormValues,
  type AccountFormValues,
} from "@/components/user-settings/settings/AccountForm";
import AestheticOptions from "@/components/user-settings/settings/AestheticOptions";
import Footer from "@/components/universal/Footer";
import SubpageHeader from "@/components/user-settings/shared-components/SubpageHeader";
import { SettingsProfileFetch } from "@/app/settings/SettingsProfileFetch";

export default function SettingsPage() {
  const [accountForm, setAccountForm] = useState<AccountFormValues>(
    emptyAccountFormValues,
  );

  return (
    <main className="bg-[#F9F8F6] min-h-screen w-full flex flex-col">
      <SettingsProfileFetch onLoaded={setAccountForm} />
      <SubpageHeader title="Account Details" />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar activePage="account" />

        <div className="flex-1 overflow-y-auto p-8 md:p-12 lg:p-16 max-w-4xl">
          <AccountForm value={accountForm} onChange={setAccountForm} />
          <AestheticOptions />

          <Footer />
        </div>
      </div>
    </main>
  );
}
