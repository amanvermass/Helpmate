"use client";

import React, { useState } from "react";
import {
  MapPin,
  User,
  Users,
  HeartHandshake,
  Briefcase,
  HelpCircle,
  Home,
  Building,
  Check,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Address, AddressRecipientType, varanasiLocalities, useStore } from "@/store/useStore";

interface AddAddressFormProps {
  onSave: (address: Omit<Address, "id">) => void;
  onCancel?: () => void;
  initialData?: Partial<Address>;
  className?: string;
  compact?: boolean;
}

export const AddAddressForm: React.FC<AddAddressFormProps> = ({
  onSave,
  onCancel,
  initialData,
  className = "",
  compact = false,
}) => {
  const userName = useStore((state) => state.userName);
  const userPhone = useStore((state) => state.userPhone);
  const currentUser = {
    name: userName || "Customer",
    phone: userPhone || "",
  };

  // Form states
  const [tag, setTag] = useState<string>(initialData?.tag || "Home");
  const [recipientType, setRecipientType] = useState<AddressRecipientType>(
    initialData?.recipientType || "Self"
  );
  const [recipientName, setRecipientName] = useState<string>(
    initialData?.recipientName || (initialData?.recipientType === "Self" || !initialData?.recipientType ? currentUser.name : "")
  );
  const [recipientPhone, setRecipientPhone] = useState<string>(
    initialData?.recipientPhone || (initialData?.recipientType === "Self" || !initialData?.recipientType ? currentUser.phone : "")
  );
  const [locality, setLocality] = useState<string>(
    initialData?.locality || varanasiLocalities[0].name
  );
  const [pincode, setPincode] = useState<string>(
    initialData?.pincode || varanasiLocalities[0].pincode
  );
  const [houseNo, setHouseNo] = useState<string>(initialData?.houseNo || "");
  const [landmark, setLandmark] = useState<string>(initialData?.landmark || "");
  const [streetAddress, setStreetAddress] = useState<string>(
    initialData?.addressLine || ""
  );
  const [city, setCity] = useState<string>(initialData?.city || "Varanasi");
  const [isDefault, setIsDefault] = useState<boolean>(initialData?.isDefault || false);

  // Recipient Badge Configurations
  const recipientBadges = [
    {
      type: "Self" as AddressRecipientType,
      label: "Self",
      icon: User,
      activeBg: "bg-purple-600 text-white shadow-purple-500/30",
      inactiveBg: "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200",
    },
    {
      type: "Family Member" as AddressRecipientType,
      label: "Family",
      icon: Users,
      activeBg: "bg-blue-600 text-white shadow-blue-500/30",
      inactiveBg: "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200",
    },
    {
      type: "Friend / Neighbor" as AddressRecipientType,
      label: "Friend",
      icon: HeartHandshake,
      activeBg: "bg-emerald-600 text-white shadow-emerald-500/30",
      inactiveBg: "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200",
    },
    {
      type: "Office / Work" as AddressRecipientType,
      label: "Office",
      icon: Briefcase,
      activeBg: "bg-amber-600 text-white shadow-amber-500/30",
      inactiveBg: "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200",
    },
    {
      type: "Other" as AddressRecipientType,
      label: "Other",
      icon: HelpCircle,
      activeBg: "bg-slate-700 text-white shadow-slate-500/30",
      inactiveBg: "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200",
    },
  ];

  const quickTags = ["Home", "Work", "Parent's House", "Commercial Office", "Other"];

  const handleLocalityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setLocality(selected);
    const found = varanasiLocalities.find((l) => l.name === selected);
    if (found) {
      setPincode(found.pincode);
    }
  };

  const handleRecipientTypeSelect = (type: AddressRecipientType) => {
    setRecipientType(type);
    if (type === "Self") {
      setRecipientName(currentUser.name);
      setRecipientPhone(currentUser.phone);
    } else if (recipientName === currentUser.name) {
      setRecipientName("");
      setRecipientPhone("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Construct unified formatted address
    const fullAddress = [
      houseNo.trim(),
      streetAddress.trim(),
      landmark.trim() ? `Near ${landmark.trim().replace(/^Near\s+/i, "")}` : "",
      locality,
      `${city} - ${pincode}`,
    ]
      .filter(Boolean)
      .join(", ");

    onSave({
      tag: tag || "Home",
      recipientType,
      recipientName: recipientName || currentUser.name,
      recipientPhone: recipientPhone || currentUser.phone,
      locality,
      pincode,
      houseNo,
      landmark,
      addressLine: fullAddress || streetAddress || `${locality}, ${city}`,
      city,
      isDefault,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 md:p-6 space-y-6 shadow-xl text-left transition-all ${className}`}
    >
      {/* HEADER BADGE */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-[#782860]/10 text-[#782860] dark:bg-[#782860]/20 dark:text-purple-300">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-foreground tracking-tight flex items-center gap-2">
              Delivery Address & Recipient Specs
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Varanasi active zone service location & recipient details
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 1: RECIPIENT TYPE & ADDRESS LABEL */}
      <div className="p-4 md:p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-extrabold text-xs">
          <User className="w-4 h-4 text-[#782860]" />
          <span>1. Address Tag & Recipient Relationship</span>
        </div>

        {/* Quick Tag Selector & Custom Title */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
            Address Title Tag *
          </label>
          <div className="flex flex-wrap gap-2">
            {quickTags.map((t) => {
              const isSelected = tag === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTag(t)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    isSelected
                      ? "bg-[#782860] text-white shadow-md shadow-[#782860]/20 scale-102"
                      : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-[#782860]/40"
                  }`}
                >
                  {t === "Home" ? <Home className="w-3 h-3" /> : t === "Work" ? <Briefcase className="w-3 h-3" /> : <Building className="w-3 h-3" />}
                  {t}
                </button>
              );
            })}
          </div>
          <input
            type="text"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            placeholder="e.g. Home (Primary), Parents Flat, Office Annex..."
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3.5 py-2.5 rounded-xl text-xs text-foreground font-semibold focus:outline-none focus:ring-2 focus:ring-[#782860]/30 transition-all mt-1"
            required
          />
        </div>

        {/* Recipient Badges */}
        <div className="space-y-2 pt-1">
          <label className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 block flex items-center justify-between">
            <span>Who is this service address for?</span>
            <span className="text-[9px] uppercase font-bold text-[#782860] dark:text-purple-400">Recipient Badge</span>
          </label>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
            {recipientBadges.map((b) => {
              const Icon = b.icon;
              const isSelected = recipientType === b.type;
              return (
                <button
                  key={b.type}
                  type="button"
                  onClick={() => handleRecipientTypeSelect(b.type)}
                  className={`p-2.5 rounded-xl text-center font-bold text-[11px] transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                    isSelected
                      ? `${b.activeBg} shadow-sm ring-2 ring-offset-1 ring-purple-500/20 scale-102`
                      : b.inactiveBg
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="leading-tight text-[10px]">{b.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recipient Contact Details Input (Required if non-Self or optional) */}
        {recipientType !== "Self" && (
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/50 space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-xs font-extrabold text-amber-700 dark:text-amber-400">
              <Users className="w-3.5 h-3.5" />
              <span>Recipient Contact Details ({recipientType})</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Recipient Name *
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="e.g. Mrs. Sunita Sharma (Mother)"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-xl text-xs font-semibold focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Recipient Phone Number *
                </label>
                <input
                  type="tel"
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-xl text-xs font-semibold focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 2: VARANASI LOCALITY & STREET ADDRESS */}
      <div className="p-4 md:p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 space-y-4">
        <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-300 font-extrabold text-xs border-b border-emerald-200/80 dark:border-emerald-900/40 pb-2">
          <MapPin className="w-4 h-4 text-emerald-600" />
          <span>2. Varanasi Locality & Street Address</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Varanasi Active Zone *
            </label>
            <select
              value={locality}
              onChange={handleLocalityChange}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3.5 py-2.5 rounded-xl text-xs text-foreground font-semibold focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              {varanasiLocalities.map((loc) => (
                <option key={loc.id} value={loc.name}>
                  {loc.name} ({loc.pincode})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Pincode *
            </label>
            <input
              type="text"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold text-foreground focus:outline-none focus:border-emerald-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
              House / Flat / Building No. *
            </label>
            <input
              type="text"
              value={houseNo}
              onChange={(e) => setHouseNo(e.target.value)}
              placeholder="e.g. Flat 302, Royal Enclave / Plot 45"
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3.5 py-2.5 rounded-xl text-xs text-foreground font-semibold focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Landmark / Nearby Spot
            </label>
            <input
              type="text"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              placeholder="e.g. Near BHU Main Gate / Galaxy Hospital"
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3.5 py-2.5 rounded-xl text-xs text-foreground font-semibold focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
            Street Address & Area Details *
          </label>
          <textarea
            rows={2}
            value={streetAddress}
            onChange={(e) => setStreetAddress(e.target.value)}
            placeholder="Street name, colony name, lane number..."
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 rounded-xl text-xs text-foreground font-semibold focus:outline-none focus:border-emerald-500"
            required
          />
        </div>
      </div>

      {/* SECTION 3: DEFAULT LOCATION TOGGLE */}
      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <CheckCircle2 className={`w-4 h-4 ${isDefault ? "text-emerald-500" : "text-slate-400"}`} />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Set as Primary Default Delivery Address
          </span>
        </div>
        <input
          type="checkbox"
          checked={isDefault}
          onChange={(e) => setIsDefault(e.target.checked)}
          className="w-4 h-4 accent-[#782860] rounded cursor-pointer"
        />
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex items-center justify-end gap-3 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#782860] via-[#8c2d70] to-amber-600 hover:opacity-95 text-xs font-black text-white cursor-pointer shadow-lg shadow-[#782860]/25 transition-all flex items-center gap-1.5"
        >
          <Check className="w-4 h-4" /> Save Address
        </button>
      </div>
    </form>
  );
};
