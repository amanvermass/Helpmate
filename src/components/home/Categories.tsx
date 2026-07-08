import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import ServiceIllustration from "./ServiceIllustrations";

const homeServices = [
  { id: "hourly", name: "Hourly bookings" },
  { id: "bathroom", name: "Bathroom Cleaning" },
  { id: "fridge", name: "Fridge Cleaning" },
  { id: "packing", name: "Packing or Unpacking" },
  { id: "utensils", name: "Utensils" },
  { id: "prep", name: "Kitchen Prep" },
  { id: "dusting", name: "Dusting & Wiping" },
  { id: "mopping", name: "Sweeping & Mopping" },
  { id: "preparty", name: "Pre-Party Express Clean" },
  { id: "wardrobe", name: "Complete Wardrobe Cleaning" },
  { id: "afterparty", name: "After-Party Express Clean" },
  { id: "ironing", name: "Ironing & Folding" },
  { id: "mirror", name: "Mirror cleaning" },
  { id: "laundry", name: "Laundry washing" },
  { id: "sink", name: "Kitchen sink cleaning" },
  { id: "balcony", name: "Balcony cleaning" },
  { id: "fan", name: "Fan cleaning" },
  { id: "cabinet", name: "Cabinet cleaning" }
];

const serviceIdMapping: Record<string, string> = {
  hourly: "deep-cleaning-lux",
  bathroom: "deep-cleaning-lux",
  fridge: "refrigerator-smart-repair",
  packing: "white-glove-moving",
  utensils: "deep-cleaning-lux",
  prep: "deep-cleaning-lux",
  dusting: "deep-cleaning-lux",
  mopping: "deep-cleaning-lux",
  preparty: "deep-cleaning-lux",
  wardrobe: "deep-cleaning-lux",
  afterparty: "deep-cleaning-lux",
  ironing: "organic-silk-laundry",
  mirror: "deep-cleaning-lux",
  laundry: "organic-silk-laundry",
  sink: "plumbing-smart-inspection",
  balcony: "deep-cleaning-lux",
  fan: "smart-home-automation",
  cabinet: "modular-carpentry-fix",
};

export default function Categories() {
  const router = useRouter();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } },
  };

  const handleCategoryClick = (id: string) => {
    const targetId = serviceIdMapping[id];
    if (targetId) {
      router.push(`/services/${targetId}`);
    } else {
      router.push("/search");
    }
  };

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto font-sans relative">
      <div className="text-left mb-12">
        <div>
          <span className="text-[10px] uppercase font-bold text-accent-lux tracking-widest block mb-3">
            Step 2: Or Browse by Service
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-primary-lux dark:text-white">
            Explore Services
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-xs sm:text-sm">
            Browse through our verified service verticals to find exactly what you need in Varanasi.
          </p>
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {homeServices.map((cat) => (
            <motion.div
              key={cat.id}
              variants={itemVariants}
              initial="hidden"
              animate="show"
              exit="hidden"
              layout
              onClick={() => handleCategoryClick(cat.id)}
              className="bg-white dark:bg-slate-900/60 border border-slate-200/10 dark:border-slate-800 rounded-3xl p-4 flex flex-col justify-between hover:shadow-lg transition-all duration-300 group cursor-pointer h-full relative select-none"
            >
              <div>
                {/* Light gray illustration container */}
                <div className="bg-slate-50 dark:bg-slate-950/60 rounded-2xl aspect-[4/3] flex items-center justify-center p-5">
                  <div className="w-22 h-22 transition-transform duration-500 group-hover:scale-110">
                    <ServiceIllustration id={cat.id} />
                  </div>
                </div>
                
                {/* Title */}
                <h3 className="mt-4 font-bold text-xs sm:text-[13px] text-slate-800 dark:text-slate-100 leading-tight">
                  {cat.name}
                </h3>
              </div>
              
              {/* Arrow at bottom right */}
              <div className="flex justify-end mt-4">
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-accent-lux group-hover:translate-x-1 transition-all" />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* View All Services Button */}
      <div className="mt-12 flex justify-center">
        <button
          onClick={() => router.push("/search")}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-accent-lux dark:hover:border-accent-lux/60 transition-all cursor-pointer shadow-sm"
        >
          View All Services <ArrowRight className="w-4 h-4 text-accent-lux" />
        </button>
      </div>
    </section>
  );
}
