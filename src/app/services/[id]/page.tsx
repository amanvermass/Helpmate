"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Star,
  Clock,
  ShieldCheck,
  Check,
  X as CloseIcon,
  ChevronRight,
  ArrowLeft,
  Trash2,
  ShoppingBag,
  Search,
  Bookmark,
  Users,
  Sparkles,
  X
} from "lucide-react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { services, reviews as mockReviews } from "@/utils/mockData";
import { useStore, getItemAddonTotal } from "@/store/useStore";
import confetti from "canvas-confetti";
import { formatImageUrl } from "@/utils/image";
import { fetchCustomerCategoriesApi, fetchCustomerSubCategoriesApi, SubCategoryItem } from "@/services/categoryApi";
import {
  fetchCustomerServiceActionsApi,
  fetchCustomerPackagesApi as fetchCustomerPackagesByActionApi,
  ServiceActionItem,
  PackageItem,
} from "@/services/serviceActionApi";
import { fetchCustomerPackagesApi as fetchGlobalPackagesApi } from "@/services/packageApi";

// Stepper Interface Config for CRM manageability
export interface ServiceWizardItem {
  id: string;
  name: string;
  price: number;
  duration: number;
}

export interface ServiceWizardAction {
  id: string;
  name: string;
  items: ServiceWizardItem[];
}

export interface ServiceWizardSubcategory {
  id: string;
  name: string;
  actions: ServiceWizardAction[];
}

export interface ServiceWizardConfig {
  subcategoriesTitle: string;
  actionsTitle: string;
  subcategories: ServiceWizardSubcategory[];
}

// Dynamic CRM booking configuration generator
const getWizardConfig = (service: any): ServiceWizardConfig => {
  if (service.wizardConfig) return service.wizardConfig;

  const category = service.category || "general";

  if (category === "ac") {
    return {
      subcategoriesTitle: "Select AC System Type",
      actionsTitle: "Select Service Action",
      subcategories: [
        {
          id: "split-ac",
          name: "Split AC",
          actions: [
            {
              id: "repair",
              name: "Repair",
              items: [
                { id: "gas-refill", name: "Gas Leakage Fix & Refill", price: 1599, duration: 90 },
                { id: "pcb-fix", name: "Circuit Board (PCB) Repair", price: 1299, duration: 60 },
                { id: "fan-motor", name: "Fan Motor Replacement", price: 899, duration: 45 },
                { id: "capacitor", name: "Compressor Capacitor Fix", price: 499, duration: 30 }
              ]
            },
            {
              id: "service",
              name: "Service",
              items: [
                { id: "foam-jet", name: "Foam & Power Jet Service", price: 599, duration: 60 },
                { id: "cleaning", name: "Filter & Coil Cleaning", price: 299, duration: 30 },
                { id: "drain", name: "Drainage Pipe Flushing", price: 199, duration: 20 }
              ]
            },
            {
              id: "install",
              name: "Installation",
              items: [
                { id: "install-setup", name: "Split AC Installation Setup", price: 1199, duration: 90 },
                { id: "copper-pipe", name: "Copper Pipe Laying (per meter)", price: 299, duration: 20 },
                { id: "bracket", name: "Outdoor Unit Bracket Mounting", price: 399, duration: 30 }
              ]
            },
            {
              id: "uninstall",
              name: "Uninstallation",
              items: [
                { id: "uninstall-setup", name: "Split AC Safe Dismantling", price: 499, duration: 45 }
              ]
            }
          ]
        },
        {
          id: "window-ac",
          name: "Window AC",
          actions: [
            {
              id: "repair",
              name: "Repair",
              items: [
                { id: "gas-refill", name: "Gas Leakage Fix & Refill", price: 1299, duration: 90 },
                { id: "fan-motor", name: "Fan Motor Replacement", price: 799, duration: 45 },
                { id: "capacitor", name: "Compressor Capacitor Fix", price: 399, duration: 30 }
              ]
            },
            {
              id: "service",
              name: "Service",
              items: [
                { id: "water-jet", name: "Water Jet Service", price: 399, duration: 45 },
                { id: "filter-cleaning", name: "Filter & Grill Cleaning", price: 199, duration: 20 }
              ]
            },
            {
              id: "install",
              name: "Installation",
              items: [
                { id: "install-setup", name: "Window AC Installation Setup", price: 799, duration: 60 },
                { id: "frame", name: "AC Outer Frame Installation", price: 299, duration: 30 }
              ]
            },
            {
              id: "uninstall",
              name: "Uninstallation",
              items: [
                { id: "uninstall-setup", name: "Window AC Safe Dismantling", price: 349, duration: 30 }
              ]
            }
          ]
        }
      ]
    };
  }

  if (category === "cleaning") {
    return {
      subcategoriesTitle: "Select Residence Type",
      actionsTitle: "Select Cleaning Tier",
      subcategories: [
        {
          id: "apartment",
          name: "Apartment / Flat",
          actions: [
            {
              id: "deep-clean",
              name: "Deep Cleaning",
              items: [
                { id: "full-home", name: "Full Home Intense Deep Clean", price: service.price, duration: service.duration },
                { id: "kitchen-only", name: "Kitchen Degreasing & Scrubbing", price: Math.round(service.price * 0.45), duration: 120 },
                { id: "bathroom-only", name: "Premium Bathroom Descaling", price: Math.round(service.price * 0.25), duration: 65 }
              ]
            },
            {
              id: "regular-clean",
              name: "Regular Cleaning",
              items: [
                { id: "dust-vacuum", name: "Dusting & Machine Vacuuming", price: Math.round(service.price * 0.35), duration: 90 },
                { id: "sofa-spa", name: "Sofa & Cushion Shampooing", price: Math.round(service.price * 0.3), duration: 80 }
              ]
            }
          ]
        },
        {
          id: "villa",
          name: "Villa / Bungalow",
          actions: [
            {
              id: "deep-clean",
              name: "Deep Cleaning",
              items: [
                { id: "villa-full", name: "Villa Multi-Floor Master Clean", price: Math.round(service.price * 1.8), duration: 360 },
                { id: "villa-exterior", name: "Outdoor Patio & Balcony Wash", price: Math.round(service.price * 0.35), duration: 90 }
              ]
            }
          ]
        }
      ]
    };
  }

  const defaultSubId = `${category}-standard`;
  const defaultSubName = getCategoryDisplayName(category);

  return {
    subcategoriesTitle: "Select Type",
    actionsTitle: "Select Action Pack",
    subcategories: [
      {
        id: defaultSubId,
        name: defaultSubName,
        actions: [
          {
            id: "standard-action",
            name: "Standard Care",
            items: [
              { id: "standard-pack", name: `${service.name} Standard Pack`, price: service.price, duration: service.duration }
            ]
          }
        ]
      },
      {
        id: "luxury-tier",
        name: `${defaultSubName} Elite Signature`,
        actions: [
          {
            id: "vip-care",
            name: "VIP Care & Materials",
            items: [
              { id: "gold-care", name: "VIP 5-Star Certified Treatment", price: Math.round(service.price * 1.5), duration: Math.round(service.duration * 1.1) },
              { id: "extended-warranty", name: "Extended 90-Day Satisfaction Shield", price: 199, duration: 15 }
            ]
          }
        ]
      }
    ]
  };
};

// Helper description & image mapper for specific service items
const getItemDetails = (itemId: string, itemName: string, serviceImg: string) => {
  const detailsMap: Record<string, { description: string; image: string }> = {
    "gas-refill": {
      description: "Complete pressure testing, nitrogen leak detection, coil brazing repairs, and full eco-friendly gas recharge with warranty.",
      image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80"
    },
    "pcb-fix": {
      description: "Circuit board diagnostics, logic controller relay replacement, micro-controller troubleshooting, and full testing.",
      image: "https://images.unsplash.com/photo-1517055720413-77a62b431537?auto=format&fit=crop&w=600&q=80"
    },
    "fan-motor": {
      description: "Replacement of broken/burnt indoor blower motor or outdoor heat condenser motor with original manufacturer motor.",
      image: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=600&q=80"
    },
    "capacitor": {
      description: "Testing of starting/running capacitance and replacement of faulty capacitor to resolve compressor ignition failure.",
      image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=600&q=80"
    },
    "foam-jet": {
      description: "Deep chemical foam spray and double-pressure power jet rinse of internal filters, coils, blower wheels, and drain lines.",
      image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=600&q=80"
    },
    "cleaning": {
      description: "General manual coil cleaning, filter mesh wash, outer grill polishing, and performance review. Improves airflow.",
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80"
    },
    "drain": {
      description: "Clearing blockage from condensate drain pipes using pressure pump flushing to prevent indoor wall leakages.",
      image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80"
    },
    "install-setup": {
      description: "Drilling, bracket mounting, indoor/outdoor unit placement, standard pipe connection, copper insulation wrapping, and testing.",
      image: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=600&q=80"
    },
    "copper-pipe": {
      description: "Supplying and laying of premium 100% copper piping with insulated sleeves and drain piping for long connection paths.",
      image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80"
    },
    "bracket": {
      description: "Installation of heavy-gauge metal bracket stand for securing outdoor compressor unit on wall surface safely.",
      image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80"
    },
    "uninstall-setup": {
      description: "Pumping down refrigerant safely, unit dismounting, bracket removal, pipe capping, and clean packing.",
      image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=600&q=80"
    },
    "water-jet": {
      description: "Pressure jet washing of Window AC rear condenser coils, front evaporators, and water trays to remove scales and dirt.",
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80"
    },
    "filter-cleaning": {
      description: "General service of Window AC including filter panel dust clean, chemical spray, and grill cleaning.",
      image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=600&q=80"
    },
    "frame": {
      description: "Window frame alignment, wooden/steel frame installation, and foam sealing for vibration noise reduction.",
      image: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=600&q=80"
    }
  };

  return detailsMap[itemId] || {
    description: `${itemName}. Thorough premium quality diagnostics and execution by certified Helpmate specialists.`,
    image: serviceImg
  };
};

const getCategoryDisplayName = (cat: string) => {
  const mapping: Record<string, string> = {
    "ac": "AC",
    "cleaning": "Cleaning",
    "beauty": "Beauty",
    "electrician": "Electrician",
    "plumbing": "Plumbing"
  };
  return mapping[cat] || (cat.charAt(0).toUpperCase() + cat.slice(1));
};

interface PageProps {
  params: Promise<{ id: string }>;
}

function ServiceDetailPageContent({ params }: PageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resolvedParams = React.use(params);
  const serviceId = resolvedParams.id;

  const {
    addToRecentlyViewed,
    addToCart,
    clearCart,
    addNotification,
    cart,
    removeFromCart,
    cartPricing,
    bookmarkedPackageIds,
    toggleBookmark,
    fetchBookmarks,
    toggleAddonInCart,
    token
  } = useStore();

  const normalizedSlug = serviceId.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const foundService = services.find(
    (s) =>
      s.id === serviceId ||
      s.category === serviceId ||
      s.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === normalizedSlug ||
      s.category.toLowerCase().replace(/[^a-z0-9]+/g, "-") === normalizedSlug
  );

  const formattedName = serviceId
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const service = React.useMemo(() => {
    return foundService || {
      id: serviceId,
      name: formattedName,
      category: serviceId,
      price: 499,
      rating: 4.9,
      duration: 60,
      reviewsCount: 98,
      description: `Certified background-verified ${formattedName} service experts in Varanasi.`,
      image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=600&q=80",
      inclusions: [
        "Complete professional diagnostics & inspection",
        "Background verified local experts in Varanasi",
        "Helpmate post-service quality assurance checklist"
      ],
      exclusions: [
        "Spare parts and replacement hardware costs",
        "Major masonry or unlisted structural modifications"
      ],
      faqs: [
        { question: "How fast can a professional reach?", answer: "Usually within 45 to 60 minutes after booking." },
        { question: "Is service warranty provided?", answer: "Yes, 30 days Helpmate warranty included." }
      ]
    };
  }, [foundService, serviceId, formattedName]);

  const subParam = searchParams.get("sub");
  const actParam = searchParams.get("act");
  const itemParam = searchParams.get("item");

  const categoryIdParam = searchParams.get("categoryId");
  const [resolvedCategoryId, setResolvedCategoryId] = useState<string | null>(categoryIdParam);
  const [apiSubCategories, setApiSubCategories] = useState<SubCategoryItem[]>([]);
  const [apiServiceActions, setApiServiceActions] = useState<ServiceActionItem[]>([]);
  const [apiPackages, setApiPackages] = useState<PackageItem[]>([]);
  const [fetchedItemPackage, setFetchedItemPackage] = useState<any | null>(null);
  const [loadingItemPackage, setLoadingItemPackage] = useState<boolean>(!!itemParam);

  const [loadingSubCategories, setLoadingSubCategories] = useState<boolean>(true);
  const [loadingServiceActions, setLoadingServiceActions] = useState<boolean>(false);
  const [loadingPackages, setLoadingPackages] = useState<boolean>(false);

  const [selectedSub, setSelectedSub] = useState<string | null>(subParam);
  const [selectedAct, setSelectedAct] = useState<string | null>(actParam);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  useEffect(() => {
    if (token) {
      fetchBookmarks();
    }
  }, [token, fetchBookmarks]);

  // Sync state values with query parameters on load
  useEffect(() => {
    if (subParam) setSelectedSub(subParam);
    if (actParam) setSelectedAct(actParam);
  }, [subParam, actParam]);

  // Fetch individual package detail when itemParam query is present
  useEffect(() => {
    let isCancelled = false;
    async function loadItemPackage() {
      if (!itemParam) {
        setFetchedItemPackage(null);
        setLoadingItemPackage(false);
        return;
      }

      setLoadingItemPackage(true);

      // Check mock services first
      const foundMock = services.find((s) => s.id === itemParam);
      if (foundMock) {
        if (!isCancelled) {
          setFetchedItemPackage({
            id: foundMock.id,
            name: foundMock.name,
            price: foundMock.price,
            originalPrice: foundMock.originalPrice,
            duration: foundMock.duration,
            subtitle: "",
            description: foundMock.description,
            image: foundMock.image,
            addons: [],
          });
          setLoadingItemPackage(false);
        }
        return;
      }

      // Fetch from backend customer packages API
      try {
        const res = await fetchGlobalPackagesApi({ limit: 50 });
        if (res.success && res.data && !isCancelled) {
          const matched = res.data.find(
            (p: any) => String(p.package?.id) === String(itemParam) || String(p.package?._id) === String(itemParam) || String(p.package?.name) === String(itemParam)
          );
          if (matched) {
            const pkg = matched.package as any;
            setFetchedItemPackage({
              id: pkg.id || pkg._id,
              name: pkg.name || pkg.packageName,
              price: pkg.price,
              originalPrice: pkg.originalPrice,
              duration: pkg.duration || 60,
              subtitle: pkg.subtitle || "",
              description: pkg.description || pkg.subtitle || `${pkg.name || pkg.packageName} execution by certified Helpmate specialists.`,
              image: formatImageUrl(pkg.imageUrl || pkg.thumbnailUrl || ""),
              addons: matched.addons || [],
            });
            if (matched.category?.id) {
              setResolvedCategoryId(matched.category.id);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching package item detail:", err);
      } finally {
        if (!isCancelled) {
          setLoadingItemPackage(false);
        }
      }
    }

    loadItemPackage();
    return () => {
      isCancelled = true;
    };
  }, [itemParam]);

  // Fetch live subcategories from API if categoryIdParam exists or lookup category by slug
  useEffect(() => {
    let isCancelled = false;
    async function loadSubCategories() {
      setLoadingSubCategories(true);
      let targetCatId = categoryIdParam;

      if (!targetCatId) {
        const catRes = await fetchCustomerCategoriesApi();
        if (catRes.success && catRes.data && !isCancelled) {
          const matched = catRes.data.find(
            (c) =>
              c._id === serviceId ||
              c.categoryName.toLowerCase().replace(/[^a-z0-9]+/g, "-") === normalizedSlug ||
              normalizedSlug.includes(c.categoryName.toLowerCase().slice(0, 4))
          );
          if (matched) {
            targetCatId = matched._id;
          }
        }
      }

      if (targetCatId && !isCancelled) {
        setResolvedCategoryId(targetCatId);
        const res = await fetchCustomerSubCategoriesApi(targetCatId);
        if (res.success && res.data && !isCancelled) {
          setApiSubCategories(res.data);
        } else if (!isCancelled) {
          setApiSubCategories([]);
        }
      } else if (!isCancelled) {
        setApiSubCategories([]);
      }

      if (!isCancelled) {
        setLoadingSubCategories(false);
      }
    }

    loadSubCategories();
    return () => {
      isCancelled = true;
    };
  }, [categoryIdParam, serviceId, normalizedSlug]);

  // Fetch live service actions when subcategory is selected (or immediately if category has no subcategories)
  const hasSubCategories = apiSubCategories.length > 0;

  useEffect(() => {
    let isCancelled = false;
    async function loadServiceActions() {
      if (hasSubCategories && !selectedSub) {
        setApiServiceActions([]);
        setLoadingServiceActions(false);
        return;
      }

      setLoadingServiceActions(true);

      let subCatId = "";
      if (hasSubCategories && selectedSub) {
        subCatId = selectedSub;
        const foundSub = apiSubCategories.find((s) => s._id === selectedSub || s.name === selectedSub);
        if (foundSub) {
          subCatId = foundSub._id;
        }
      }

      let catId = resolvedCategoryId;
      if (!catId) {
        const catRes = await fetchCustomerCategoriesApi();
        if (catRes.success && catRes.data && catRes.data.length > 0) {
          const matched = catRes.data.find(
            (c) =>
              c._id === serviceId ||
              c.categoryName.toLowerCase().replace(/[^a-z0-9]+/g, "-") === normalizedSlug ||
              normalizedSlug.includes(c.categoryName.toLowerCase().slice(0, 4))
          );
          if (matched) {
            catId = matched._id;
          } else {
            catId = catRes.data[0]._id;
          }
        }
      }

      if (catId) {
        const res = await fetchCustomerServiceActionsApi(catId, subCatId);
        if (res.success && res.data && !isCancelled) {
          setApiServiceActions(res.data);
        } else if (!isCancelled) {
          setApiServiceActions([]);
        }
      } else if (!isCancelled) {
        setApiServiceActions([]);
      }

      if (!isCancelled) {
        setLoadingServiceActions(false);
      }
    }

    if (!loadingSubCategories) {
      loadServiceActions();
    }
    return () => {
      isCancelled = true;
    };
  }, [selectedSub, resolvedCategoryId, apiSubCategories, loadingSubCategories, hasSubCategories, serviceId, normalizedSlug]);

  // Fetch live packages when service action is selected
  useEffect(() => {
    let isCancelled = false;
    async function loadPackages() {
      if (!selectedAct) {
        setApiPackages([]);
        setLoadingPackages(false);
        return;
      }

      setLoadingPackages(true);

      let actId = selectedAct;
      const foundAct = apiServiceActions.find((a) => a._id === selectedAct || a.serviceAction === selectedAct);
      if (foundAct) {
        actId = foundAct._id;
      }

      if (actId) {
        const res = await fetchCustomerPackagesByActionApi(actId);
        if (res.success && res.data && !isCancelled) {
          setApiPackages(res.data);
        } else if (!isCancelled) {
          setApiPackages([]);
        }
      } else if (!isCancelled) {
        setApiPackages([]);
      }

      if (!isCancelled) {
        setLoadingPackages(false);
      }
    }

    loadPackages();
    return () => {
      isCancelled = true;
    };
  }, [selectedAct, apiServiceActions]);

  const relatedServices = service
    ? services
      .filter((s) => s.id !== service.id && s.category === service.category)
      .concat(services.filter((s) => s.id !== service.id && s.category !== service.category))
      .slice(0, 8)
    : [];

  const serviceIdStr = service?.id;
  useEffect(() => {
    if (serviceIdStr) {
      addToRecentlyViewed(serviceIdStr);
    }
  }, [serviceIdStr, addToRecentlyViewed]);

  if (!service) {
    return (
      <>
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center py-32 px-6 font-sans">
          <div className="glass-panel p-8 text-center max-w-sm">
            <h2 className="text-lg font-bold text-foreground">Service Not Found</h2>
            <p className="text-xs text-slate-500 mt-2">The requested luxury service has been cataloged under another code.</p>
            <Link href="/" className="mt-6 inline-block text-xs font-bold text-accent-lux hover:underline">
              Back to Homepage
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // API-based Subcategory and Service Action matching
  const matchedApiSub = apiSubCategories.find((s) => s._id === selectedSub || s.name === selectedSub);
  const currentSub = {
    id: selectedSub,
    name: matchedApiSub ? matchedApiSub.name : (selectedSub || ""),
  };

  const matchedApiAct = apiServiceActions.find((a) => a._id === selectedAct || a.serviceAction === selectedAct);
  const currentAct = {
    id: selectedAct,
    name: matchedApiAct ? matchedApiAct.serviceAction : (selectedAct || ""),
  };

  const availablePackagesList = apiPackages.map((item: any) => {
    const pkg = item.package || item;
    const pkgId = pkg.id || pkg._id || item._id || item.id;
    const pkgName = pkg.name || pkg.packageName || item.name || "Package Service";
    return {
      id: pkgId,
      name: pkgName,
      price: pkg.price ?? item.price ?? 0,
      originalPrice: pkg.originalPrice ?? item.originalPrice,
      duration: pkg.duration || item.duration || 60,
      subtitle: pkg.subtitle || item.subtitle || "",
      description: pkg.description || pkg.subtitle || item.description || `${pkgName} execution by certified Helpmate specialists.`,
      image: formatImageUrl(pkg.imageUrl || pkg.thumbnailUrl || item.imageUrl || item.thumbnailUrl || ""),
      addons: item.addons || pkg.addons || [],
    };
  });

  const selectedItem =
    availablePackagesList.find((i) => i.id === itemParam || (i as any)._id === itemParam) ||
    fetchedItemPackage ||
    (availablePackagesList.length > 0 ? availablePackagesList[0] : null);

  // Set active details based on query parameters or fall back to main service
  const activeName = selectedItem
    ? selectedItem.name
    : service.name;
  const activePrice = selectedItem ? selectedItem.price : service.price;
  const activeDuration = selectedItem ? selectedItem.duration : service.duration;

  const itemDetails = selectedItem
    ? { description: selectedItem.description, image: selectedItem.image }
    : { description: service.description, image: service.image };

  const renderBreadcrumbs = (isDetailsView: boolean) => {
    return (
      <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500 mb-6 font-sans select-none tracking-wide">
        <Link href="/" className="hover:text-accent-lux transition-colors font-semibold flex items-center gap-1">
          Home
        </Link>
        <span className="text-slate-400">/</span>

        {isDetailsView || selectedSub ? (
          <Link
            href={`/services/${service?.category}`}
            onClick={() => {
              setSelectedSub(null);
              setSelectedAct(null);
            }}
            className="hover:text-accent-lux transition-colors font-semibold"
          >
            {getCategoryDisplayName(service?.category || "")}
          </Link>
        ) : (
          <span className="text-accent-lux font-extrabold">
            {getCategoryDisplayName(service?.category || "")}
          </span>
        )}

        {selectedSub && (
          <>
            <span className="text-slate-400">/</span>
            {isDetailsView || selectedAct ? (
              <Link
                href={`/services/${service?.category}?sub=${selectedSub}`}
                onClick={() => {
                  setSelectedAct(null);
                }}
                className="hover:text-accent-lux transition-colors font-semibold"
              >
                {currentSub?.name}
              </Link>
            ) : (
              <span className="text-accent-lux font-extrabold">
                {currentSub?.name}
              </span>
            )}
          </>
        )}

        {selectedAct && (
          <>
            <span className="text-slate-400">/</span>
            {isDetailsView ? (
              <Link
                href={`/services/${service?.category}?${selectedSub ? `sub=${selectedSub}&` : ""}act=${selectedAct}`}
                className="hover:text-accent-lux transition-colors font-semibold"
              >
                {currentAct?.name}
              </Link>
            ) : (
              <span className="text-accent-lux font-extrabold">
                {currentAct?.name}
              </span>
            )}
          </>
        )}

        {isDetailsView && selectedItem && (
          <>
            <span className="text-slate-400">/</span>
            <span className="text-accent-lux font-extrabold truncate max-w-[150px] sm:max-w-[250px]">
              {selectedItem.name}
            </span>
          </>
        )}
      </div>
    );
  };

  const triggerSmallConfetti = (e: React.MouseEvent, customColors?: string[]) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    confetti({
      particleCount: 20,
      spread: 360,
      startVelocity: 12,
      ticks: 40,
      scalar: 0.6,
      colors: customColors || ['#22c55e', '#16a34a', '#15803d'],
      origin: { x, y },
      zIndex: 1000
    });
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    triggerSmallConfetti(e);
    const packageId = (selectedItem as any)?._id || selectedItem?.id || service.id;

    addToCart({
      id: packageId,
      name: activeName,
      price: activePrice,
      category: service.category,
      duration: activeDuration
    });

    addNotification(
      "Added to Cart",
      `"${activeName}" has been added to your cart.`,
      "success"
    );
  };

  const handleBookNow = (e: React.MouseEvent) => {
    const packageId = (selectedItem as any)?._id || selectedItem?.id || service.id;

    clearCart();
    addToCart({
      id: packageId,
      name: activeName,
      price: activePrice,
      category: service.category,
      duration: activeDuration
    });

    router.push("/booking");
  };

  const handleItemAddToCart = (e: React.MouseEvent, item: any) => {
    triggerSmallConfetti(e);
    const packageId = item._id || item.id;
    const pkgName = item.packageName || item.name || `${currentSub?.name} ${currentAct?.name}`;

    addToCart({
      id: packageId,
      name: pkgName,
      price: item.price,
      category: service?.category || "Service",
      duration: item.duration || 30
    });

    addNotification(
      "Added to Cart",
      `"${pkgName}" has been added to your cart.`,
      "success"
    );
  };

  const handleItemBookNow = (e: React.MouseEvent, item: any) => {
    const packageId = item._id || item.id;
    const pkgName = item.packageName || item.name || `${currentSub?.name} ${currentAct?.name}`;

    clearCart();
    addToCart({
      id: packageId,
      name: pkgName,
      price: item.price,
      category: service?.category || "Service",
      duration: item.duration || 30
    });

    router.push("/booking");
  };

  // Matched Specialist Logic (BookMyBai / Pronto Verification Feature)
  let matchedPro = {
    name: "Arjun Mehta",
    specialty: "Luxury Cleaning Expert",
    experience: "7+ Years",
    rating: 4.95,
    completedJobs: 1240,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80"
  };

  if (service.category === "beauty" || service.category === "salon") {
    matchedPro = {
      name: "Neha Patil",
      specialty: "Master Therapist & Aesthetician",
      experience: "5 Years",
      rating: 4.98,
      completedJobs: 1530,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80"
    };
  } else if (service.category === "ac" || service.category === "electrician" || service.category === "plumbing") {
    matchedPro = {
      name: "Rahul Ranade",
      specialty: "HVAC & Electrical Automation Engineer",
      experience: "6 Years",
      rating: 4.88,
      completedJobs: 980,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80"
    };
  }

  // Calculate pricing summary details
  const taxAmount = Math.round(activePrice * 0.18);
  const convenienceFee = 49;
  const grandTotal = activePrice + taxAmount + convenienceFee;

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes shimmer-sweep {
          0% { transform: translateX(-150%) skewX(-25deg); }
          100% { transform: translateX(150%) skewX(-25deg); }
        }
        .shimmer-button-glow {
          position: absolute;
          top: 0;
          height: 100%;
          width: 200%;
          background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.25) 30%,
            rgba(255, 255, 255, 0.4) 50%,
            rgba(255, 255, 255, 0.25) 70%,
            rgba(255, 255, 255, 0) 100%
          );
          animation: shimmer-sweep 2.2s infinite linear;
        }

        @keyframes arrow-slide-full {
          0% { left: -10%; transform: translateY(-50%); opacity: 0; }
          10% { opacity: 0.35; }
          50% { opacity: 0.65; }
          90% { opacity: 0.35; }
          100% { left: 110%; transform: translateY(-50%); opacity: 0; }
        }
        .arrows-bg-track {
          position: absolute;
          top: 50%;
          display: flex;
          align-items: center;
          gap: 5px;
          pointer-events: none;
          z-index: 5;
          animation: arrow-slide-full 2.2s infinite linear;
        }
      `}} />
      <Header />

      {itemParam ? (
        loadingItemPackage || !selectedItem ? (
          /* ================= DETAILS VIEW SHIMMER SKELETON ================= */
          <main className="flex-1 pt-24 pb-24 lg:pb-12 font-sans bg-slate-50/50 dark:bg-background relative">
            <div className="max-w-7xl mx-auto px-6 py-6 relative z-10">
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-48 mb-6 animate-pulse" />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Column Skeleton */}
                <div className="lg:col-span-8 space-y-8">
                  <div className="h-96 sm:h-[450px] rounded-[32px] bg-slate-200 dark:bg-slate-800 animate-pulse overflow-hidden shadow-xl" />
                  <div className="space-y-4">
                    <div className="h-8 sm:h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-3/4 animate-pulse" />
                    <div className="flex gap-4 items-center border-b border-slate-100 dark:border-slate-800 pb-6">
                      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-20 animate-pulse" />
                      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24 animate-pulse" />
                      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-28 animate-pulse" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-32 animate-pulse" />
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full animate-pulse" />
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6 animate-pulse" />
                  </div>
                  <div className="p-6 rounded-[28px] bg-slate-200/60 dark:bg-slate-800/60 animate-pulse flex flex-col sm:flex-row gap-5 items-center justify-between">
                    <div className="flex items-center gap-4 w-full">
                      <div className="w-14 h-14 rounded-full bg-slate-300 dark:bg-slate-700 shrink-0" />
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-1/3" />
                        <div className="h-3 bg-slate-300 dark:bg-slate-700 rounded w-1/2" />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="h-48 rounded-[28px] bg-slate-200/60 dark:bg-slate-800/60 animate-pulse" />
                    <div className="h-48 rounded-[28px] bg-slate-200/60 dark:bg-slate-800/60 animate-pulse" />
                  </div>
                </div>

                {/* Right Sticky Card Column Skeleton */}
                <div className="lg:col-span-4 space-y-6">
                  <div className="glass-panel p-6 border border-slate-200/10 space-y-6 text-left animate-pulse">
                    <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-28" />
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full" />
                    <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full" />
                      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full" />
                      <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-full mt-2" />
                    </div>
                    <div className="h-12 rounded-full bg-slate-300 dark:bg-slate-700 w-full" />
                    <div className="h-12 rounded-full bg-slate-300 dark:bg-slate-700 w-full" />
                  </div>
                </div>
              </div>
            </div>
          </main>
        ) : (
          /* ================= DETAILS VIEW ================= */
          <main className="flex-1 pt-24 pb-24 lg:pb-12 font-sans bg-slate-50/50 dark:bg-background relative">
            {/* Background glows */}
            <div className="absolute top-24 left-1/4 -translate-x-1/2 w-96 h-96 bg-accent-lux/5 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-48 right-1/4 translate-x-1/2 w-96 h-96 bg-accent-lux/[0.03] rounded-full blur-[140px] pointer-events-none" />

            {/* Banner Section */}
            <section className="max-w-7xl mx-auto px-6 py-6 relative z-10">
              {renderBreadcrumbs(true)}

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Left Content column */}
                <div className="lg:col-span-8 space-y-8">
                  {/* Image Frame */}
                  <div className="relative h-96 sm:h-[450px] rounded-[32px] overflow-hidden shadow-xl border border-slate-200/10">
                    <img
                      src={formatImageUrl(itemDetails.image)}
                      alt={activeName}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                    <span className="absolute bottom-6 left-6 bg-black/65 backdrop-blur-md text-white text-[10px] uppercase font-bold tracking-widest px-4 py-2 border border-white/10 shadow-lg select-none">
                      Premium Vetted Service
                    </span>
                  </div>

                  {/* Title & Metadata */}
                  <div className="space-y-4">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
                      {activeName}
                    </h1>

                    <div className="flex flex-wrap gap-4 items-center text-xs text-slate-500 border-b border-slate-100 dark:border-slate-800 pb-6">
                      <span className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-4 h-4 fill-amber-500 text-amber-500" /> {service.rating}
                      </span>
                      <span>({service.reviewsCount} reviews)</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" /> {activeDuration} Mins Duration
                      </span>
                      <span>•</span>
                      <span className="capitalize">{service.category}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-base text-foreground">Service Overview</h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      {itemDetails.description}
                    </p>
                  </div>

                  {/* Specialist Preview Card */}
                  <div className="bg-gradient-to-br from-slate-900/5 via-[#8D397E]/5 to-transparent dark:from-slate-900/60 dark:via-[#8D397E]/10 dark:to-slate-950/40 p-6 rounded-[28px] border border-accent-lux/15 flex flex-col sm:flex-row gap-5 items-center justify-between text-left shadow-sm">
                    <div className="flex items-center gap-4 text-left w-full">
                      <img src={matchedPro.avatar} alt={matchedPro.name} className="w-14 h-14 rounded-full object-cover border-2 border-accent-lux shrink-0" />
                      <div>
                        <span className="inline-block bg-accent-lux/10 text-accent-lux text-[8px] font-extrabold uppercase px-2 py-0.5 rounded tracking-wider mb-1">
                          Assigned Specialist Preview
                        </span>
                        <h4 className="font-bold text-sm text-foreground">{matchedPro.name}</h4>
                        <p className="text-[10px] text-slate-400">{matchedPro.specialty} • {matchedPro.experience} exp</p>
                        <div className="flex items-center gap-1 mt-1 text-[10px] text-amber-500 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> {matchedPro.rating} ({matchedPro.completedJobs} jobs completed)
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row sm:flex-col gap-x-4 sm:gap-x-0 gap-y-0.5 shrink-0 w-full sm:w-auto border-t sm:border-t-0 sm:border-l border-slate-100 dark:border-slate-800 pt-3 sm:pt-0 sm:pl-5 text-left text-[10px] text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1.5 font-semibold text-success-lux">
                        <Check className="w-3.5 h-3.5" /> Aadhaar Verified
                      </div>
                      <div className="flex items-center gap-1.5 font-semibold text-success-lux">
                        <Check className="w-3.5 h-3.5" /> Police Audited
                      </div>
                      <div className="flex items-center gap-1.5 font-semibold text-success-lux">
                        <Check className="w-3.5 h-3.5" /> Varanasi Resident
                      </div>
                    </div>
                  </div>

                  {/* Inclusions / Exclusions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Inclusions Card */}
                    <div className="bg-emerald-500/[0.02] dark:bg-emerald-500/[0.04] border border-emerald-500/10 rounded-[28px] p-6 shadow-sm">
                      <h4 className="font-extrabold text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-450 mb-4 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Included in Package
                      </h4>
                      <ul className="space-y-3">
                        {service.inclusions.map((item, idx) => (
                          <li key={idx} className="flex gap-2.5 items-start text-xs text-slate-655 dark:text-slate-300">
                            <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Exclusions Card */}
                    <div className="bg-red-500/[0.02] dark:bg-red-500/[0.04] border border-red-500/10 rounded-[28px] p-6 shadow-sm">
                      <h4 className="font-extrabold text-xs uppercase tracking-wider text-red-655 dark:text-red-400 mb-4 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Excluded from Package
                      </h4>
                      <ul className="space-y-3">
                        {service.exclusions.map((item, idx) => (
                          <li key={idx} className="flex gap-2.5 items-start text-xs text-slate-655 dark:text-slate-300">
                            <CloseIcon className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* FAQs */}
                  <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                    <h3 className="font-extrabold text-base text-foreground tracking-tight">Frequently Asked Questions</h3>
                    <div className="divide-y divide-slate-200/60 dark:divide-slate-800 border-t border-b border-slate-200/60 dark:border-slate-800">
                      {service.faqs.map((faq, idx) => (
                        <div key={idx} className="py-4">
                          <h4 className="font-bold text-xs sm:text-sm text-foreground">{faq.question}</h4>
                          <p className="text-[11px] sm:text-xs text-slate-550 dark:text-slate-455 mt-1.5 leading-relaxed">{faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Popular Pairing Recommendations (Package Addons) */}
                  {selectedItem?.addons && selectedItem.addons.length > 0 && (
                    <div className="space-y-5 pt-8 border-t border-slate-100 dark:border-slate-800/80 relative">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-extrabold text-base text-foreground tracking-tight">Popular Pairing Recommendations</h3>
                          <p className="text-[11px] text-slate-400 mt-0.5">Enhance your service with these verified package add-ons.</p>
                        </div>

                        {selectedItem.addons.length > 3 && (
                          <div className="flex gap-2 shrink-0">
                            <button
                              onClick={() => {
                                const container = document.getElementById("addon-scroll-track");
                                if (container) container.scrollBy({ left: -260, behavior: "smooth" });
                              }}
                              className="w-8 h-8 rounded-full border border-slate-200/60 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-accent-lux transition-colors cursor-pointer text-xs font-black"
                              aria-label="Scroll left"
                            >
                              ←
                            </button>
                            <button
                              onClick={() => {
                                const container = document.getElementById("addon-scroll-track");
                                if (container) container.scrollBy({ left: 260, behavior: "smooth" });
                              }}
                              className="w-8 h-8 rounded-full border border-slate-200/60 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-accent-lux transition-colors cursor-pointer text-xs font-black"
                              aria-label="Scroll right"
                            >
                              →
                            </button>
                          </div>
                        )}
                      </div>

                      <div
                        id="addon-scroll-track"
                        className="flex gap-5 overflow-x-auto no-scrollbar scroll-smooth pb-2 snap-x snap-mandatory"
                        style={{ scrollbarWidth: "none" }}
                      >
                        {selectedItem.addons.map((addon: any) => {
                          const addonId = addon._id || addon.id;
                          const addonName = addon.addonName || addon.title || addon.name || "Service Addon";
                          const addonPrice = addon.price || 0;
                          const addonImg = addon.imageUrl || "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=400&q=80";
                          const mainPkgId = (selectedItem as any)?._id || selectedItem?.id || service.id;
                          const cartItem = cart.find((c) => c.id === mainPkgId || c.itemId === mainPkgId);
                          const isAddonAdded = (cartItem?.selectedAddons || []).some((a) => a.addonId === addonId) || cart.some((c) => c.id === addonId);

                          return (
                            <div
                              key={addonId}
                              className="glass-panel overflow-hidden group flex flex-col justify-between border border-slate-200/10 hover:shadow-lg transition-all duration-300 p-4 h-full text-left w-[240px] sm:w-[260px] shrink-0 snap-start rounded-2xl bg-white dark:bg-slate-900/60"
                            >
                              <div className="space-y-2.5">
                                <div className="h-28 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 relative">
                                  <img
                                    src={addonImg}
                                    alt={addonName}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                  />
                                  <span className="absolute top-2 left-2 text-[8px] uppercase font-bold text-accent-lux bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-2 py-0.5 rounded-full shadow-sm">
                                    Add-on
                                  </span>
                                </div>
                                <div>
                                  <h4 className="font-bold text-xs text-foreground group-hover:text-accent-lux transition-colors truncate">
                                    {addonName}
                                  </h4>
                                  {addon.description && (
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                                      {addon.description}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 dark:border-slate-800/60">
                                <span className="text-xs font-black text-accent-lux font-sans">
                                  ₹{addonPrice}
                                </span>
                                <button
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    const action = isAddonAdded ? "remove" : "add";

                                    if (action === "add") {
                                      triggerSmallConfetti(e, ['#801C6E', '#48073d', '#A21CAF']);
                                      if (!cartItem) {
                                        await addToCart({
                                          id: mainPkgId,
                                          name: activeName,
                                          price: activePrice,
                                          category: service.category,
                                          duration: activeDuration,
                                        });
                                      }
                                    }

                                    await toggleAddonInCart(mainPkgId, addonId, action);
                                    addNotification(
                                      action === "add" ? "Add-on Added" : "Add-on Removed",
                                      action === "add" ? `"${addonName}" added to your cart.` : `"${addonName}" removed from your cart.`,
                                      "info"
                                    );
                                  }}
                                  className={`px-3 py-1.5 rounded-full font-bold text-[10px] shadow-sm transition-all cursor-pointer ${isAddonAdded
                                    ? "bg-emerald-500/10 border border-emerald-500 text-emerald-600 dark:text-emerald-450 opacity-90"
                                    : "bg-accent-lux hover:bg-accent-lux/90 text-white"
                                    }`}
                                >
                                  {isAddonAdded ? "Added ✓" : "+ Add"}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Reviews */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-base text-foreground">Recent Reviews</h3>
                    <div className="space-y-4">
                      {mockReviews.map((rev) => (
                        <div key={rev.id} className="bg-white dark:bg-slate-900/40 border border-slate-200/40 dark:border-slate-800/60 p-6 rounded-[24px] space-y-3 shadow-sm hover:border-accent-lux/30 transition-colors">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <img src={rev.avatar} alt={rev.name} className="w-10 h-10 rounded-full object-cover" />
                              <div>
                                <span className="font-bold text-xs block text-foreground">{rev.name}</span>
                                <span className="text-[9px] text-slate-400 block mt-0.5">{rev.date}</span>
                              </div>
                            </div>
                            <div className="flex gap-0.5 text-amber-500">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-3 h-3 fill-amber-500" />
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-slate-555 dark:text-slate-455 leading-relaxed italic">
                            "{rev.comment}"
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Sticky Card column - Service Summary & Action */}
                <div id="booking-wizard-card" className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
                  <div className="glass-panel p-6 border border-slate-200/10 space-y-6 text-left">
                    <span className="text-[10px] uppercase font-bold text-accent-lux bg-accent-lux/10 px-2.5 py-0.5 rounded tracking-wider">
                      ⚡ Quick Booking
                    </span>

                    <div>
                      <h3 className="font-extrabold text-sm text-foreground">Luxury Package Inclusions</h3>
                      <p className="text-[10px] text-slate-550 dark:text-slate-455 mt-1 leading-relaxed">
                        All inclusive price: equipment, transport, premium cleaning solvents &amp; expert labor. No hidden charges.
                      </p>
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-850 pt-4 space-y-3">
                      <div className="flex justify-between text-xs font-semibold text-slate-500 font-sans">
                        <span>Rate</span>
                        <span className="text-foreground font-bold">₹{activePrice}</span>
                      </div>
                      <div className="flex justify-between text-xs font-semibold text-slate-500 font-sans">
                        <span>Taxes &amp; GST (18%)</span>
                        <span className="text-foreground font-bold">₹{taxAmount}</span>
                      </div>
                      <div className="flex justify-between text-xs font-semibold text-slate-500 font-sans border-b border-slate-100 dark:border-slate-850 pb-3">
                        <span>Convenience Fee</span>
                        <span className="text-foreground font-bold">₹{convenienceFee}</span>
                      </div>
                      <div className="flex justify-between text-sm font-extrabold text-foreground pt-1">
                        <span>Grand Total</span>
                        <span className="text-lg font-black text-accent-lux font-sans">₹{grandTotal}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2.5 pt-2">
                      {(() => {
                        const mainId = (selectedItem as any)?._id || selectedItem?.id || service.id;
                        const isMainAdded = cart.some(c => c.id === mainId || c.itemId === mainId || c.id === `${service.id}-${selectedSub}-${selectedAct}-${selectedItem?.id}`);
                        return (
                          <button
                            disabled={isMainAdded}
                            onClick={(e) => {
                              if (isMainAdded) return;
                              handleAddToCart(e);
                            }}
                            className={`w-full font-extrabold text-xs py-3.5 rounded-full shadow-sm flex items-center justify-center gap-1.5 transition-colors ${isMainAdded
                              ? "bg-emerald-500/10 border border-emerald-500 text-emerald-600 dark:text-emerald-450 opacity-80 cursor-not-allowed"
                              : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-350 text-slate-850 dark:text-slate-200 cursor-pointer"
                              }`}
                          >
                            {isMainAdded ? "Added to Cart ✓" : "Add to Cart"}
                          </button>
                        );
                      })()}
                      <button
                        onClick={handleBookNow}
                        className="w-full bg-accent-lux hover:bg-accent-lux/95 text-white font-extrabold text-xs py-3.5 rounded-full shadow-md flex items-center justify-center gap-1.5 transition-all hover:scale-[1.01] cursor-pointer relative overflow-hidden"
                      >
                        <div className="arrows-bg-track opacity-25 dark:opacity-20">
                          <ChevronRight className="w-4 h-4 text-white/90 filter drop-shadow-[0_0_4px_rgba(255,255,255,0.6)]" />
                          <ChevronRight className="w-4 h-4 text-white/90 filter drop-shadow-[0_0_4px_rgba(255,255,255,0.6)]" />
                        </div>
                        <div className="shimmer-button-glow pointer-events-none" />
                        <span className="relative z-10 flex items-center justify-center gap-1.5 font-sans">
                          Book Now <ChevronRight className="w-4 h-4" />
                        </span>
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 dark:text-slate-455 border-t border-slate-100 dark:border-slate-800 pt-4">
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-success-lux" /> Vetted 5-Star Specialist
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-accent-lux" /> On-time Insourence
                      </div>
                    </div>
                  </div>

                  <div className="glass-panel p-5 border border-slate-205/60 dark:border-slate-800/80 bg-gradient-to-br from-[#8D397E]/[0.02] to-transparent rounded-[24px] space-y-3 text-left">
                    <span className="text-[9px] uppercase font-bold text-accent-lux tracking-wider block">HelpMate Service Promise</span>
                    <h4 className="text-xs font-bold text-foreground">Verified Luxury Quality</h4>
                    <p className="text-[10px] text-slate-400 dark:text-slate-455 leading-relaxed">
                      Every professional undergoes background screening, police verification, and Aadhaar checks. Varanasi's elite households trust HelpMate.
                    </p>
                  </div>
                </div>

              </div>
            </section>
          </main>
        )
      ) : (
        /* ================= CATEGORY WIZARD VIEW ================= */
        <main className="flex-1 pt-24 pb-24 lg:pb-12 font-sans bg-slate-50/50 dark:bg-background relative">
          {/* Background glows */}
          <div className="absolute top-24 left-1/4 -translate-x-1/2 w-96 h-96 bg-accent-lux/5 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute bottom-48 right-1/4 translate-x-1/2 w-96 h-96 bg-accent-lux/[0.03] rounded-full blur-[140px] pointer-events-none" />

          {/* Banner Section */}
          <section className="max-w-7xl mx-auto px-6 py-6 relative z-10">
            {renderBreadcrumbs(false)}

            {/* Service Category Page Heading */}
            <div className="mb-8 text-left">
              <span className="text-[10px] uppercase font-bold text-accent-lux bg-accent-lux/10 px-2.5 py-1 rounded tracking-widest font-sans inline-block mb-3.5">
                Service Category
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
                {getCategoryDisplayName(service.category)}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed mt-2.5 max-w-2xl">
                Varanasi's custom interactive luxury wizard. Choose your device system parameters below to see active service packages and prices.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

              {/* Left Column - Stepper Wizard */}
              <div className="lg:col-span-8 space-y-6">
                <div className="glass-panel p-6 sm:p-8 border border-slate-200/10 space-y-6 text-left">


                  {/* Progress Tracker Stepper circles */}
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                    {hasSubCategories ? (
                      <div className="flex items-center gap-1.5 w-full font-sans">
                        <div className="w-6 h-6 rounded-full bg-accent-lux text-white flex items-center justify-center text-[10px] font-bold transition-colors">
                          {selectedSub !== null ? "✓" : "1"}
                        </div>
                        <div className={`h-0.5 flex-1 transition-colors ${selectedSub !== null ? "bg-accent-lux" : "bg-slate-100 dark:bg-slate-850"}`} />
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${selectedSub !== null ? "bg-accent-lux text-white" : "bg-slate-100 dark:bg-slate-850 text-slate-400"
                          }`}>
                          {selectedAct !== null ? "✓" : "2"}
                        </div>
                        <div className={`h-0.5 flex-1 transition-colors ${selectedAct !== null ? "bg-accent-lux" : "bg-slate-100 dark:bg-slate-850"}`} />
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${selectedSub !== null && selectedAct !== null ? "bg-accent-lux text-white" : "bg-slate-100 dark:bg-slate-850 text-slate-400"
                          }`}>
                          3
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 w-full font-sans">
                        <div className="w-6 h-6 rounded-full bg-accent-lux text-white flex items-center justify-center text-[10px] font-bold transition-colors">
                          {selectedAct !== null ? "✓" : "1"}
                        </div>
                        <div className={`h-0.5 flex-1 transition-colors ${selectedAct !== null ? "bg-accent-lux" : "bg-slate-100 dark:bg-slate-850"}`} />
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${selectedAct !== null ? "bg-accent-lux text-white" : "bg-slate-100 dark:bg-slate-850 text-slate-400"
                          }`}>
                          2
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Inline Stepper Workflow Layout */}
                  <div className="space-y-6">
                    {/* Step 1: SubCategory / Service Type Selector (only shown if category has subcategories) */}
                    {hasSubCategories && (
                      <div className="space-y-3">
                        <span className="text-[10px] uppercase font-bold text-slate-455 tracking-wider block">
                          SELECT SERVICE TYPE
                        </span>
                        {loadingSubCategories ? (
                          <div className="grid grid-cols-2 gap-3">
                            {[1, 2, 3, 4].map((n) => (
                              <div key={n} className="h-12 rounded-xl bg-slate-200/70 dark:bg-slate-800/70 relative overflow-hidden animate-pulse" />
                            ))}
                          </div>
                        ) : apiSubCategories.length > 0 ? (
                          <div className="grid grid-cols-2 gap-3">
                            {apiSubCategories.map((sub) => {
                              const isActive = selectedSub === sub._id || selectedSub === sub.name;
                              return (
                                <button
                                  key={sub._id}
                                  onClick={() => {
                                    setSelectedSub(sub._id);
                                    setSelectedAct(null);
                                    setApiPackages([]);
                                  }}
                                  className={`py-3 px-4 rounded-xl text-xs font-black tracking-wide text-center transition-all cursor-pointer hover:scale-[1.01] ${isActive
                                    ? "bg-[#48073d] text-white dark:bg-accent-lux shadow-md shadow-accent-lux/10"
                                    : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 shadow-sm hover:shadow-md"
                                    }`}
                                >
                                  {sub.name}
                                </button>
                              );
                            })}
                          </div>
                        ) : null}
                      </div>
                    )}

                    {/* Step 2 (or Step 1 if no subcategories): Action Type Selector */}
                    {(!hasSubCategories || selectedSub) && (
                      <div className={`space-y-3 ${hasSubCategories ? "border-t border-slate-100 dark:border-slate-850 pt-5" : ""} animate-fadeIn`}>
                        <span className="text-[10px] uppercase font-bold text-slate-455 tracking-wider block">
                          SELECT SERVICE ACTION
                        </span>
                        {loadingServiceActions ? (
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {[1, 2, 3, 4].map((n) => (
                              <div key={n} className="h-12 rounded-xl bg-slate-200/70 dark:bg-slate-800/70 relative overflow-hidden animate-pulse" />
                            ))}
                          </div>
                        ) : apiServiceActions.length > 0 ? (
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {apiServiceActions.map((act) => {
                              const isActive = selectedAct === act._id || selectedAct === act.serviceAction;
                              return (
                                <button
                                  key={act._id}
                                  onClick={() => setSelectedAct(act._id)}
                                  className={`py-3.5 px-2 rounded-xl text-[11px] sm:text-xs font-black tracking-wide text-center transition-all cursor-pointer hover:scale-[1.01] ${isActive
                                    ? "bg-[#48073d] text-white dark:bg-accent-lux shadow-md shadow-accent-lux/10"
                                    : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 shadow-sm hover:shadow-md"
                                    }`}
                                >
                                  {act.serviceAction}
                                </button>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900/50 text-slate-400 text-xs text-center font-medium">
                            No service actions available.
                          </div>
                        )}
                      </div>
                    )}

                    {/* Step 3 (or Step 2 if no subcategories): Available Services & Rates */}
                    {selectedAct && (
                      <div className="space-y-4 border-t border-slate-100 dark:border-slate-850 pt-5 animate-fadeIn">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-bold text-slate-455 tracking-wider block">
                            AVAILABLE SERVICE PACKAGES
                          </span>
                          <div className="flex items-center gap-1.5">
                            <div className="relative">
                              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                              <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-8 pr-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] sm:text-[11px] text-slate-700 dark:text-slate-300 w-56 sm:w-100 focus:outline-none focus:ring-1 focus:ring-accent-lux/30 transition-all placeholder:text-slate-400"
                              />
                            </div>
                            <button
                              onClick={() => setShowSavedOnly(!showSavedOnly)}
                              className={`flex items-center gap-1.5 p-1.5 px-2.5 rounded-full transition-colors ${showSavedOnly
                                ? "bg-accent-lux text-white"
                                : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400"
                                }`}
                            >
                              <Bookmark className={`w-3.5 h-3.5 ${showSavedOnly ? "fill-white" : ""}`} />
                              <span className="text-[10px] font-bold uppercase tracking-wider">
                                Saved {bookmarkedPackageIds.length > 0 && `(${bookmarkedPackageIds.length})`}
                              </span>
                            </button>
                          </div>
                        </div>

                        {loadingPackages ? (
                          <div className="space-y-3">
                            {[1, 2, 3].map((n) => (
                              <div key={n} className="bg-white dark:bg-slate-900/60 p-4 rounded-2xl flex flex-col sm:flex-row gap-4 border border-slate-100 dark:border-slate-800 animate-pulse">
                                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-slate-200 dark:bg-slate-800 shrink-0" />
                                <div className="flex-1 space-y-3 py-1">
                                  <div className="flex justify-between items-start">
                                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/5" />
                                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/6" />
                                  </div>
                                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-3/5" />
                                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-4/5" />
                                  <div className="flex gap-2 pt-2">
                                    <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-16" />
                                    <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-20" />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : apiPackages.length > 0 ? (
                          <div className="space-y-3">
                            {apiPackages
                              .map((pkgItem: any) => {
                                const pkg = pkgItem.package || pkgItem;
                                const pkgId = pkg.id || pkg._id || pkgItem._id || pkgItem.id;
                                const pkgName = pkg.name || pkg.packageName || pkgItem.name || "Package Service";
                                return {
                                  id: pkgId,
                                  name: pkgName,
                                  price: pkg.price || pkgItem.price || 0,
                                  originalPrice: pkg.originalPrice || pkgItem.originalPrice,
                                  duration: pkg.duration || pkgItem.duration || 60,
                                  subtitle: pkg.subtitle || pkgItem.subtitle || "",
                                  description: pkg.description || pkg.subtitle || pkgItem.description || `${pkgName} execution by certified Helpmate specialists.`,
                                  image: formatImageUrl(pkg.imageUrl || pkg.thumbnailUrl || pkgItem.imageUrl || pkgItem.thumbnailUrl || ""),
                                  addons: pkgItem.addons || pkg.addons || [],
                                };
                              })
                              .filter((item) => {
                                if (!item || !item.name) return false;
                                const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
                                const matchesSaved = showSavedOnly ? bookmarkedPackageIds.includes(item.id) : true;
                                return matchesSearch && matchesSaved;
                              })
                              .map((item) => {
                                const pkgId = (item as any)?._id || item.id;
                                const isAdded = cart.some((c) => c.id === pkgId || c.itemId === pkgId || c.id === `${service?.id}-${selectedSub}-${selectedAct}-${item.id}`);
                                const isItemSaved = bookmarkedPackageIds.includes(pkgId);
                                return (
                                  <div
                                    key={item.id}
                                    onClick={() => {
                                      router.push(`/services/${service?.category || serviceId}?sub=${selectedSub}&act=${selectedAct}&item=${item.id}`);
                                    }}
                                    className="bg-white dark:bg-slate-900/60 p-4 rounded-2xl flex flex-col sm:flex-row gap-4 transition-all duration-300 hover:scale-[1.01] hover:shadow-md group text-left shadow-sm relative overflow-hidden cursor-pointer hover:border hover:border-accent-lux/30"
                                  >
                                    {/* Left Side: Image */}
                                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 relative group/image">
                                      <img src={formatImageUrl(item.image)} alt={item.name} referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          if (!isItemSaved) triggerSmallConfetti(e, ['#801C6E', '#48073d', '#A21CAF']);
                                          toggleBookmark(pkgId);
                                          addNotification(
                                            isItemSaved ? "Bookmark Removed" : "Bookmarked Package",
                                            isItemSaved ? `${item.name} removed from your saved list.` : `${item.name} saved for fast booking.`,
                                            "info"
                                          );
                                        }}
                                        className={`absolute top-2 right-2 p-1.5 backdrop-blur-md cursor-pointer rounded-full transition-colors shadow-sm z-10 ${isItemSaved
                                          ? "bg-accent-lux/10 text-accent-lux dark:bg-accent-lux/20"
                                          : "bg-white/90 dark:bg-slate-900/90 text-slate-500 hover:text-accent-lux hover:bg-white dark:hover:bg-slate-800"
                                          }`}
                                      >
                                        <Bookmark className={`w-3.5 h-3.5 ${isItemSaved ? "fill-accent-lux text-accent-lux" : ""}`} />
                                      </button>
                                    </div>

                                    {/* Right Side: Title, Real Data, Prices, Badges, Addons & Actions */}
                                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                                      <div>
                                        <div className="flex justify-between items-start gap-2">
                                          <h4 className="font-extrabold text-[13px] sm:text-[14px] text-foreground leading-snug group-hover:text-accent-lux transition-colors truncate">
                                            {item.name}
                                          </h4>
                                          <div className="text-right shrink-0">
                                            <span className="text-[13px] sm:text-[14px] font-black text-accent-lux font-sans">
                                              ₹{item.price}
                                            </span>
                                            {item.originalPrice && item.originalPrice > item.price && (
                                              <span className="text-[10px] sm:text-[11px] font-normal text-slate-400 line-through ml-1.5 font-sans">
                                                ₹{item.originalPrice}
                                              </span>
                                            )}
                                          </div>
                                        </div>

                                        {/* Subtitle & Real Description */}
                                        {item.subtitle && (
                                          <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                                            {item.subtitle}
                                          </p>
                                        )}
                                        <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5 line-clamp-2">
                                          {item.description}
                                        </p>

                                        {/* Duration & Badges */}
                                        <div className="flex flex-wrap gap-2 mt-2">
                                          <span className="text-[8px] font-bold text-slate-400 bg-slate-50 dark:bg-slate-950 px-2 py-0.5 rounded font-sans shrink-0">
                                            ⏱ {item.duration} mins
                                          </span>
                                          <span className="text-[8px] font-bold text-success-lux bg-success-lux/5 px-2 py-0.5 rounded font-sans shrink-0">
                                            ✓ Vetted Pro
                                          </span>
                                          <span className="text-[8px] font-bold text-accent-lux bg-accent-lux/5 px-2 py-0.5 rounded font-sans shrink-0">
                                            ★ 4.95 Rated
                                          </span>
                                        </div>

                                        {/* Addons List */}
                                        {item.addons && item.addons.length > 0 && (
                                          <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                                            <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Addons Included:</span>
                                            <div className="flex flex-wrap gap-1.5">
                                              {item.addons.map((addon: any) => (
                                                <span key={addon._id || addon.id} className="text-[9px] font-bold bg-accent-lux/10 text-accent-lux px-2 py-0.5 rounded-full">
                                                  +{addon.addonName || addon.title || addon.name} (₹{addon.price})
                                                </span>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                      </div>

                                      {/* Action Buttons */}
                                      <div className="flex justify-end items-center gap-2 mt-4 pt-2">
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            router.push(`/services/${service?.category || serviceId}?sub=${selectedSub}&act=${selectedAct}&item=${item.id}`);
                                          }}
                                          className="px-2.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[9px] sm:text-[10px] transition-colors cursor-pointer"
                                        >
                                          View Details ↗
                                        </button>
                                        <button
                                          disabled={isAdded}
                                          onClick={(e) => {
                                            if (isAdded) return;
                                            e.stopPropagation();
                                            handleItemAddToCart(e, item);
                                          }}
                                          className={`px-3 py-1.5 rounded-full font-bold text-[10px] transition-all border shadow-sm ${isAdded
                                            ? "bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-450 opacity-80 cursor-not-allowed"
                                            : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-850 dark:text-slate-200 hover:border-slate-350 cursor-pointer"
                                            }`}
                                        >
                                          {isAdded ? "Added ✓" : "Add to Cart"}
                                        </button>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleItemBookNow(e, item);
                                          }}
                                          className="px-3.5 py-1.5 rounded-full bg-accent-lux hover:bg-accent-lux/95 text-white font-bold text-[10px] shadow-md transition-colors cursor-pointer relative overflow-hidden"
                                        >
                                          <span className="relative z-10 flex items-center justify-center gap-1 font-sans">
                                            Book Now <ChevronRight className="w-3 h-3" />
                                          </span>
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        ) : (
                          <div className="p-6 rounded-2xl bg-slate-100 dark:bg-slate-900/50 text-slate-400 text-xs text-center font-medium">
                            No packages available for this service action.
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Trust/Guarantee checklist */}
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 dark:text-slate-455 border-t border-slate-100 dark:border-slate-800 pt-4">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-success-lux" /> Vetted 5-Star Specialist
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-accent-lux" /> On-time Insourence
                    </div>
                  </div>

                </div>
              </div>

              {/* Right Column - Added Services (Booking Summary Card) */}
              <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
                <div className="glass-panel p-6 border border-slate-200/10 space-y-6 text-left">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-855 pb-4">
                    <div className="flex items-center gap-1.5">
                      <ShoppingBag className="w-4.5 h-4.5 text-accent-lux" />
                      <span className="font-extrabold text-sm text-foreground">Added Services</span>
                    </div>
                    <span className="text-[9px] uppercase font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-md font-sans">
                      {cart.length} Selected
                    </span>
                  </div>

                  {cart.length > 0 ? (
                    <div className="space-y-4">
                      <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
                        {cart.map((item) => {
                          const addonTotal = (item.selectedAddons || []).reduce(
                            (sum, a) => sum + (a.totalPrice || ((a.price || 0) * (a.quantity || 1))),
                            0
                          );
                          const itemTotal = (item.price * (item.quantity || 1)) + addonTotal;

                          return (
                            <div key={item.id} className="space-y-1.5 py-2 border-b border-slate-50 dark:border-slate-855/30 last:border-b-0">
                              <div className="flex justify-between items-start gap-3 text-xs">
                                <div className="text-left w-full pr-1">
                                  <span className="font-bold text-foreground block leading-tight">{item.name}</span>
                                  <span className="text-[9px] text-slate-400 font-semibold font-sans mt-0.5 block">⏱ {item.duration} mins • Qty: {item.quantity || 1}</span>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <div className="flex flex-col items-end mr-1">
                                    <span className="font-extrabold text-accent-lux font-sans leading-none">₹{itemTotal}</span>
                                  </div>
                                  <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="text-slate-400 hover:text-red-500 transition-colors cursor-pointer p-1"
                                    aria-label="Remove item"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              {item.selectedAddons && item.selectedAddons.length > 0 && (
                                <div className="space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800/60">
                                  {item.selectedAddons.map((addon) => (
                                    <div key={addon.addonId} className="flex items-center justify-between text-[9px] text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/60 px-2 py-1 rounded-md">
                                      <span className="truncate pr-1">+ {addon.addonName} {addon.quantity > 1 ? `(x${addon.quantity})` : ""}</span>
                                      <div className="flex items-center gap-1 shrink-0">
                                        <span className="font-bold text-foreground font-sans">+₹{addon.totalPrice || ((addon.price || 0) * (addon.quantity || 1))}</span>
                                        <button
                                          onClick={() => toggleAddonInCart(item.itemId || item.id, addon.addonId, "remove")}
                                          className="text-slate-400 hover:text-rose-500 ml-0.5 cursor-pointer"
                                          title="Remove add-on"
                                        >
                                          <X className="w-2.5 h-2.5" />
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {(() => {
                        const itemsSubtotalVal = cartPricing ? cartPricing.itemsSubtotal : cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
                        const addonSubtotalVal = cartPricing ? cartPricing.addonSubtotal : cart.reduce((sum, item) => sum + getItemAddonTotal(item), 0);
                        const subtotalVal = cartPricing ? cartPricing.subtotal : (itemsSubtotalVal + addonSubtotalVal);
                        const gstRate = cartPricing?.gstRate ?? 18;
                        const gstVal = cartPricing ? cartPricing.gst : Math.round(subtotalVal * 0.18 * 100) / 100;
                        const feeVal = cartPricing ? cartPricing.convenienceFee : (subtotalVal > 0 ? 49 : 0);
                        const grandVal = cartPricing ? cartPricing.grandTotal : Math.round((subtotalVal + gstVal + feeVal) * 100) / 100;

                        return (
                          <div className="border-t border-slate-100 dark:border-slate-850 pt-4 space-y-2 text-xs text-slate-555 dark:text-slate-455 font-semibold font-sans">
                            <div className="flex justify-between">
                              <span>Services Base Subtotal</span>
                              <span className="text-foreground font-bold">₹{itemsSubtotalVal}</span>
                            </div>
                            {addonSubtotalVal > 0 && (
                              <div className="flex justify-between text-accent-lux font-bold">
                                <span className="flex items-center gap-1">
                                  <Sparkles className="w-3 h-3 text-accent-lux" /> Add-ons Subtotal
                                </span>
                                <span>+₹{addonSubtotalVal}</span>
                              </div>
                            )}
                            <div className="flex justify-between border-t border-slate-100/60 dark:border-slate-800/60 pt-1 text-slate-700 dark:text-slate-300 font-extrabold">
                              <span>Subtotal</span>
                              <span>₹{subtotalVal}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Taxes &amp; GST ({gstRate}%)</span>
                              <span className="text-foreground font-bold">₹{gstVal}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Convenience Fee</span>
                              <span className="text-foreground font-bold">{feeVal > 0 ? `₹${feeVal}` : "FREE"}</span>
                            </div>
                            <div className="flex justify-between border-t border-slate-100 dark:border-slate-850 pt-3 text-sm font-extrabold text-foreground">
                              <span>Grand Total</span>
                              <span className="text-lg font-black text-accent-lux font-sans">
                                ₹{grandVal}
                              </span>
                            </div>
                          </div>
                        );
                      })()}

                      <button
                        onClick={() => {
                          router.push("/booking");
                        }}
                        className="w-full bg-accent-lux hover:bg-accent-lux/95 text-white font-extrabold text-xs py-3.5 rounded-full shadow-md flex items-center justify-center gap-1.5 transition-all hover:scale-[1.01] cursor-pointer relative overflow-hidden"
                      >
                        <div className="arrows-bg-track opacity-25 dark:opacity-20">
                          <ChevronRight className="w-4 h-4 text-white/90 filter drop-shadow-[0_0_4px_rgba(255,255,255,0.6)]" />
                          <ChevronRight className="w-4 h-4 text-white/90 filter drop-shadow-[0_0_4px_rgba(255,255,255,0.6)]" />
                        </div>
                        <div className="shimmer-button-glow pointer-events-none" />
                        <span className="relative z-10 flex items-center justify-center gap-1.5 font-sans">
                          Proceed to Book <ChevronRight className="w-4 h-4" />
                        </span>
                      </button>
                    </div>
                  ) : (
                    <div className="py-12 text-center text-slate-400 flex flex-col items-center justify-center space-y-3">
                      <ShoppingBag className="w-10 h-10 text-slate-350 dark:text-slate-750 stroke-1" />
                      <h4 className="font-bold text-xs text-foreground mt-2">No Services Added Yet</h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-500 max-w-[200px] leading-relaxed">
                        Choose your system type and action inside the stepper, then click "Add to Cart" to start building your booking.
                      </p>
                    </div>
                  )}
                </div>

                {/* Varanasi Premium Guarantee Banner */}
                <div className="glass-panel p-5 border border-slate-205/60 dark:border-slate-800/80 bg-gradient-to-br from-[#8D397E]/[0.02] to-transparent rounded-[24px] space-y-3 text-left">
                  <span className="text-[9px] uppercase font-bold text-accent-lux tracking-wider block font-sans">HelpMate Service Promise</span>
                  <h4 className="text-xs font-bold text-foreground">Verified Luxury Quality</h4>
                  <p className="text-[10px] text-slate-400 dark:text-slate-455 leading-relaxed">
                    Every professional undergoes background screening, police verification, and Aadhaar checks. Varanasi's elite households trust HelpMate.
                  </p>
                </div>

              </div>

            </div>
          </section>
        </main>
      )}

      {/* Sticky Bottom Actions Bar (for details layout on mobile screens) */}
      {itemParam && selectedItem && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200/40 dark:border-slate-800/60 py-3.5 px-6 flex items-center justify-between shadow-[0_-8px_30px_rgb(0,0,0,0.06)] lg:hidden font-sans">
          <div className="flex flex-col text-left">
            <span className="text-[9px] uppercase font-bold text-slate-455 tracking-wider">Selected Service</span>
            <span className="text-xs font-extrabold text-foreground truncate max-w-[150px]">
              {activeName}
            </span>
            <span className="text-[10px] font-black text-accent-lux font-sans leading-none mt-0.5">₹{activePrice}</span>
          </div>

          <div className="flex gap-2.5">
            <button
              onClick={handleAddToCart}
              className="bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 text-slate-850 dark:text-slate-200 font-bold text-xs py-2.5 px-4 rounded-full flex items-center justify-center cursor-pointer transition-colors shadow-sm"
            >
              Add to Cart
            </button>
            <button
              onClick={handleBookNow}
              className="bg-accent-lux hover:bg-accent-lux/95 text-white font-bold text-xs py-2.5 px-5 rounded-full shadow-md flex items-center justify-center gap-1 cursor-pointer transition-colors relative overflow-hidden"
            >
              <div className="arrows-bg-track opacity-25 dark:opacity-20">
                <ChevronRight className="w-3.5 h-3.5 text-white/90 filter drop-shadow-[0_0_4px_rgba(255,255,255,0.6)]" />
                <ChevronRight className="w-3.5 h-3.5 text-white/90 filter drop-shadow-[0_0_4px_rgba(255,255,255,0.6)]" />
              </div>
              <div className="shimmer-button-glow pointer-events-none" />
              <span className="relative z-10 flex items-center justify-center gap-1 font-sans">
                Book Now <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Sticky Bottom Actions Bar (for wizard layout on mobile screens) */}
      {(!itemParam || !selectedItem) && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200/40 dark:border-slate-800/60 py-3.5 px-6 flex items-center justify-between shadow-[0_-8px_30px_rgb(0,0,0,0.06)] lg:hidden">
          <div className="flex flex-col text-left">
            <span className="text-[9px] uppercase font-bold text-slate-455 tracking-wider">Booking Customizer</span>
            <span className="text-xs font-extrabold text-foreground truncate max-w-[200px]">
              {hasSubCategories ? (
                <>
                  {!selectedSub && "Choose System/Type"}
                  {selectedSub && !selectedAct && `${currentSub?.name} > Action`}
                  {selectedSub && selectedAct && `${currentSub?.name} > ${currentAct?.name}`}
                </>
              ) : (
                <>
                  {!selectedAct && "Choose Service Action"}
                  {selectedAct && `${currentAct?.name}`}
                </>
              )}
            </span>
          </div>

          <div className="flex gap-2.5">
            {!selectedAct ? (
              <button
                onClick={() => {
                  const el = document.getElementById("booking-wizard-card");
                  if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
                }}
                className="bg-accent-lux hover:bg-accent-lux/95 text-white font-bold text-xs py-2.5 px-6 rounded-full shadow-md flex items-center justify-center gap-1.5 cursor-pointer transition-all animate-pulse-subtle font-sans"
              >
                Select Options
              </button>
            ) : (
              <span className="text-xs font-semibold text-accent-lux font-sans">Select below</span>
            )}
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default function ServiceDetailPage({ params }: PageProps) {
  return (
    <Suspense fallback={
      <>
        <Header />
        <main className="flex-1 flex items-center justify-center py-40 bg-slate-50/50 dark:bg-background">
          <div className="w-10 h-10 border-4 border-accent-lux border-t-transparent rounded-full animate-spin" />
        </main>
        <Footer />
      </>
    }>
      <ServiceDetailPageContent params={params} />
    </Suspense>
  );
}
