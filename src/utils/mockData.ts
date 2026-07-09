export interface Service {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviewsCount: number;
  price: number;
  originalPrice: number;
  discountText: string;
  duration: number; // minutes
  description: string;
  image: string;
  features: string[];
  inclusions: string[];
  exclusions: string[];
  faqs: { question: string; answer: string }[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  serviceCount: number;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  serviceName: string;
  comment: string;
  avatar: string;
  image?: string;
  videoUrl?: string;
  date: string;
}

export interface Professional {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  rating: number;
  completedJobs: number;
  avatar: string;
  badges: string[];
  completedRate: string;
}

export const categories: Category[] = [
  { id: "cleaning", name: "Home Cleaning", icon: "Brush", serviceCount: 18 },
  { id: "ac", name: "AC Repair & Service", icon: "Wind", serviceCount: 12 },
  { id: "electrician", name: "Electrician", icon: "Zap", serviceCount: 25 },
  { id: "plumbing", name: "Plumber", icon: "Droplet", serviceCount: 22 },
  { id: "painting", name: "Wall Painting", icon: "Paintbrush", serviceCount: 8 },
  { id: "carpentry", name: "Carpenter", icon: "Hammer", serviceCount: 15 },
  { id: "salon", name: "Salon & Hair", icon: "Scissors", serviceCount: 28 },
  { id: "beauty", name: "Beauty & Spa", icon: "Flower", serviceCount: 30 },
  { id: "appliances", name: "Appliance Repair", icon: "Tv", serviceCount: 19 },
  { id: "pest", name: "Pest Control", icon: "ShieldAlert", serviceCount: 7 },
  { id: "laundry", name: "Premium Laundry", icon: "Shirt", serviceCount: 10 },
  { id: "renovation", name: "Home Renovation", icon: "Home", serviceCount: 6 },
  { id: "interior", name: "Interior Design", icon: "Layers", serviceCount: 5 },
  { id: "moving", name: "Movers & Packers", icon: "Truck", serviceCount: 9 },
];

export const services: Service[] = [
  {
    id: "deep-cleaning-lux",
    name: "Classic Deep Home Cleaning",
    category: "cleaning",
    rating: 4.92,
    reviewsCount: 1240,
    price: 1899,
    originalPrice: 2499,
    discountText: "24% OFF",
    duration: 240,
    description: "Our signature, multi-room deep cleaning service. Covers every square inch of your home including deep kitchen degreasing, bathroom descaling, machine vacuuming, and intense scrubbing.",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80",
    features: [
      "5-Star Rated Cleaners",
      "Biodegradable Luxury Solvents",
      "Heavy-duty Industrial Vacuuming",
      "Full Bathroom & Kitchen Scrubbing"
    ],
    inclusions: [
      "Machine scrubbing of floors & deep cleaning of kitchen cabinets",
      "Bathroom wall tiles cleaning, descaling of taps, shower & WC",
      "Balcony cleaning, window glass, and grill dusting",
      "Dry vacuuming of carpets, sofas & curtains"
    ],
    exclusions: [
      "Cleaning of terrace/gardens",
      "Moving of heavy furniture items (beds, cupboards)",
      "Removal of deep cement or construction stains"
    ],
    faqs: [
      { question: "What chemicals do you use?", answer: "We use premium eco-friendly solvents from Diversey which are safe for children and pets." },
      { question: "Do I need to provide cleaning equipment?", answer: "No, our professionals come equipped with advanced machinery including industrial vacuums, steamers, and floor scrubbers." },
      { question: "How many cleaners will visit?", answer: "Usually, 2 to 3 professionals will visit depending on the size of your home." }
    ]
  },
  {
    id: "ac-jet-service",
    name: "Foam & Power Jet AC Service",
    category: "ac",
    rating: 4.88,
    reviewsCount: 890,
    price: 599,
    originalPrice: 799,
    discountText: "25% OFF",
    duration: 60,
    description: "Revolutionary high-pressure foam cleaning that penetrates deep split AC coils. Removes 2x more dust and mold than normal water cleaning, improving cooling and reducing energy bills by up to 25%.",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80",
    features: [
      "High-pressure Jet Pump cleaning",
      "Coil disinfecting foam treatment",
      "Spill-proof service jacket protection",
      "Airflow and temperature reading verification"
    ],
    inclusions: [
      "Pressure wash of indoor cooling coils and filters",
      "Drain pipe flushing to prevent leakages",
      "Outdoor unit water cleaning if accessible",
      "Final temperature check and current measurement"
    ],
    exclusions: [
      "Gas charging (available as add-on)",
      "Spare parts replacement (if found faulty)",
      "Scaffolding or risky outdoor climbing"
    ],
    faqs: [
      { question: "How often should I service my AC?", answer: "We recommend a service every 3 to 4 months for optimal cooling performance and clean air." },
      { question: "What if there is gas leakage?", answer: "Our technician will inspect the pressure. If a leak is found, they will recommend a leak repair and gas refill service." }
    ]
  },
  {
    id: "premium-salon-women",
    name: "Luxury Facial & Hair Spa Combo",
    category: "beauty",
    rating: 4.96,
    reviewsCount: 2310,
    price: 2499,
    originalPrice: 3499,
    discountText: "28% OFF",
    duration: 120,
    description: "Pamper yourself with our flagship beauty combo. Includes an organic deep-glow facial massage, premium L'Oreal hair spa treatment, and shoulder massage in the comfort of your home.",
    image: "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=800&q=80",
    features: [
      "L'Oreal & O3+ Premium Products Only",
      "Disposable single-use hygiene kits",
      "Calming spa music and aromatic diffuser setup",
      "Post-session clean up guaranteed"
    ],
    inclusions: [
      "O3+ Cleansing, Scrub, Steam & Clay Mask",
      "Relaxing 20-min facial massage",
      "L'Oreal Hair Spa cream application, steam & wash",
      "15-min hand and neck massage"
    ],
    exclusions: [
      "Pedicure / Manicure (available as add-ons)",
      "Blow drying with complex styling"
    ],
    faqs: [
      { question: "Do you bring your own towels and sheets?", answer: "Yes, our beauty professionals bring 100% sanitized, disposable sheets, towels, and single-use kits." },
      { question: "Can I customize the facial?", answer: "Yes! Our professional will analyze your skin type and choose the appropriate product variant." }
    ]
  },
  {
    id: "plumbing-smart-inspection",
    name: "Smart Water Leakage Detection & Fix",
    category: "plumbing",
    rating: 4.81,
    reviewsCount: 450,
    price: 349,
    originalPrice: 499,
    discountText: "30% OFF",
    duration: 45,
    description: "Struggling with damp walls or mystery leaks? Our plumber uses specialized acoustic & thermal cameras to trace water leakage inside concrete walls without breaking anything.",
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80",
    features: [
      "Acoustic / Thermal Leak Detectors",
      "Minimal disruption repair options",
      "Verified plumbing components with warranty",
      "Post-work pressure testing"
    ],
    inclusions: [
      "Thermal sensor scanning of target bathrooms",
      "Pinpoint location of leakage spot",
      "Detailed repair estimate with transparent material prices",
      "Plaster patching of inspection holes"
    ],
    exclusions: [
      "Cost of new pipes or sanitary fittings",
      "Major wall masonry reconstruction or tiling work"
    ],
    faqs: [
      { question: "Is the repair cost included in the inspection fee?", answer: "No, the ₹349 is our diagnostic fee. The repair estimate will be shared with you post detection; work begins only after your approval." }
    ]
  },
  {
    id: "salon-men-grooming",
    name: "Premium Men's Haircut & Royal Beard Grooming",
    category: "salon",
    rating: 4.90,
    reviewsCount: 1840,
    price: 499,
    originalPrice: 699,
    discountText: "28% OFF",
    duration: 50,
    description: "Get styled by top male grooming experts. Includes personalized haircut, hot towel massage, charcoal face pack, and royal beard trim with razor finish.",
    image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80",
    features: [
      "Disposable hair sheets & neck strips",
      "Blade sterilization in front of you",
      "Hot towel relaxation treatment",
      "Sleek vacuum clean-up of hair residues"
    ],
    inclusions: [
      "Custom haircut & wash",
      "Beard shaping with hot oil treatment",
      "Charcoal blackhead peel-off mask",
      "Head and shoulder massage"
    ],
    exclusions: [
      "Hair coloring (available as add-on)"
    ],
    faqs: [
      { question: "How does clean-up work?", answer: "Our groomers carry portable sheets and a battery-powered vacuum to clean up all cut hair before leaving, leaving your room pristine." }
    ]
  },
  {
    id: "smart-home-automation",
    name: "Smart Switch & Hub Installation",
    category: "electrician",
    rating: 4.87,
    reviewsCount: 310,
    price: 799,
    originalPrice: 1099,
    discountText: "27% OFF",
    duration: 90,
    description: "Transform your home into an Apple Home or Google Home ecosystem. Our certified smart-home electrician will configure your smart switches, sensors, voice hubs, and set up automations.",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80",
    features: [
      "Certified Automation Engineers",
      "Integration with Apple, Alexa & Google",
      "Full electric load testing",
      "App setup & tutorial demo session"
    ],
    inclusions: [
      "Wiring and fitting of up to 4 smart switch modules",
      "Gateway hub setup and network bridging",
      "Voice assistant pairing (Alexa, Siri, Google)",
      "30-day post-service software support warranty"
    ],
    exclusions: [
      "Smart switch modules and devices (to be purchased separately)",
      "High speed router setup (if no existing internet connection)"
    ],
    faqs: [
      { question: "Do you supply the smart switches?", answer: "No, you can purchase any brand (Sonoff, Wipro, Philips Hue, etc.) and our technician will fit and configure them. We can also consult on which brands to buy." }
    ]
  },
    {
      id: "luxury-texture-painting",
      name: "Premium Wall Stenciling & Texture Painting",
      category: "painting",
      rating: 4.93,
      reviewsCount: 380,
      price: 1599,
      originalPrice: 1999,
      discountText: "20% OFF",
      duration: 360,
      description: "Give your living room a high-end designer focus wall. Includes royal luxury metallic textures, stenciling, masking, premium Asian Paints Royale colors, and zero-mess post-job cleanup.",
      image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=800&q=80",
      features: [
        " Asian Paints Royale certified painters",
        "Designer stencil consultation included",
        "Complete dust-proof floor masking",
        "2-year warranty against peeling"
      ],
      inclusions: [
        "Focus wall layout design & masking",
        "Putty smoothing & base primer coat",
        "Premium texture application by master stroke specialist",
        "Furniture restoration post painting"
      ],
      exclusions: [
        "Painting of entire home interior (can be custom quoted)",
        "Major wall structural dampness repairs"
      ],
      faqs: [
        { question: "How long does a focus wall take?", answer: "Usually, texture wall stenciling takes about 1 day, including base preparation and final drying." }
      ]
    },
    {
      id: "modular-carpentry-fix",
      name: "Sleek Modular Cabinet Restoration",
      category: "carpentry",
      rating: 4.85,
      reviewsCount: 220,
      price: 1199,
      originalPrice: 1599,
      discountText: "25% OFF",
      duration: 180,
      description: "Squeaky kitchen hinges or sagging drawers? Our luxury carpentry expert restores modular alignment, installs soft-close fittings, and cleans up wood residue.",
      image: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80",
      features: [
        "Hettich & Ebco branded hardware alignment",
        "Precision laser level calibration",
        "Anti-corrosive hinge treatment",
        "Post-work cleanup guarantee"
      ],
      inclusions: [
        "Soft-close hinge calibration for up to 6 cabinets",
        "Drawer slider channel lubrication & replacement",
        "Alignment check of overhead modular frames",
        "Replacement of broken cabinet knobs"
      ],
      exclusions: [
        "Cost of heavy plywood modules",
        "Full kitchen cabinetry design from scratch"
      ],
      faqs: [
        { question: "Do you supply the hinges?", answer: "Basic screws and alignments are included. If custom soft-close channels from Hettich or Ebco need replacing, we supply them at standard rate-cards." }
      ]
    },
    {
      id: "refrigerator-smart-repair",
      name: "Smart Double-Door Refrigerator Repair",
      category: "appliances",
      rating: 4.82,
      reviewsCount: 510,
      price: 899,
      originalPrice: 1299,
      discountText: "30% OFF",
      duration: 90,
      description: "Fix cooling faults, sensor issues, and compressor errors on premium Samsung, LG, or Bosch refrigerators. Verified copper components with warranty.",
      image: "https://images.unsplash.com/photo-1571175432247-fe063c762567?auto=format&fit=crop&w=800&q=80",
      features: [
        "Certified Appliance Engineers",
        "100% Genuine OEM parts",
        "Diagnostic reports shared in-app",
        "90-Day service warranty cover"
      ],
      inclusions: [
        "Full electric sensor diagnostic test",
        "Thermostat & cooling coil checking",
        "Drain tray and fan cleaning",
        "Re-gasing estimate verification"
      ],
      exclusions: [
        "Cost of new inverter compressors",
        "Replacement of major smart display logic boards"
      ],
      faqs: [
        { question: "Is the repair done on-site?", answer: "Yes, 95% of refrigerator diagnostic repairs are completed at your home. Only heavy compressor replacement might require lab checking." }
      ]
    },
    {
      id: "herbal-pest-control",
      name: "Ultra-Quiet Herbal Pest Disinfection",
      category: "pest",
      rating: 4.89,
      reviewsCount: 340,
      price: 699,
      originalPrice: 999,
      discountText: "30% OFF",
      duration: 120,
      description: "Eco-friendly, completely odorless herbal gel treatment for cockroaches and pests. Safe for infants and pets. No need to vacate the kitchen or empty cabinets.",
      image: "https://images.unsplash.com/photo-1587582423116-ec07293f0395?auto=format&fit=crop&w=800&q=80",
      features: [
        "Odorless & Kids-safe herbal gels",
        "Bayer certified solvents",
        "No cabinet emptying required",
        "3-Month single-treatment warranty"
      ],
      inclusions: [
        "Kitchen cabinet hinge gel spotting",
        "Under-appliance spray treatments",
        "Drain line gel rings for kitchen & baths",
        "Post-treatment hygiene guidelines card"
      ],
      exclusions: [
        "Termite wood boring treatments (available as custom package)",
        "Extensive bed-bug heat sterilization"
      ],
      faqs: [
        { question: "Do I need to leave my kitchen?", answer: "No! Since we use non-volatile organic gel dots, there are no harmful fumes. You can prepare meals safely right after the treatment." }
      ]
    },
    {
      id: "organic-silk-laundry",
      name: "Premium Organic Suede & Silk Dry Cleaning",
      category: "laundry",
      rating: 4.97,
      reviewsCount: 650,
      price: 499,
      originalPrice: 699,
      discountText: "28% OFF",
      duration: 20, // drop off
      description: "Eco-safe organic hydrocarbon cleaning for luxury silk sarees, designer suits, and suede jackets. Free doorstep pickup and delivery in custom garment bags.",
      image: "https://images.unsplash.com/photo-1545173168-9f1947eebd01?auto=format&fit=crop&w=800&q=80",
      features: [
        "Free white-glove doorstep delivery",
        "Hydrocarbon organic solvent (perchloroethylene-free)",
        "Premium hangers and custom dress bags",
        "Color bleeding prevention treatment"
      ],
      inclusions: [
        "Doorstep pickup & tag registration",
        "Individual fabric stain diagnostic check",
        "Hydrocarbon eco dry cleaning & steam ironing",
        "Return delivery in under 48 hours"
      ],
      exclusions: [
        "Restoration of heavily torn vintage fabrics"
      ],
      faqs: [
        { question: "How do you handle gold embroidery sarees?", answer: "We apply custom velvet sleeves over gold zari boundaries to prevent friction and maintain texture during dry cleaning." }
      ]
    },
    {
      id: "bath-renovation-lux",
      name: "Luxury Bathroom Tiling & Fitment Renovation",
      category: "renovation",
      rating: 4.91,
      reviewsCount: 150,
      price: 2999,
      originalPrice: 3999,
      discountText: "25% OFF",
      duration: 480,
      description: "Upgrade your bathroom tiles or premium fitments. In-app consultations for luxury Kohler/Jaquar fittings, anti-skid tiles, and designer wet-area partitioning.",
      image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=800&q=80",
      features: [
        "3D Layout consultation layout",
        "Anti-skid premium tile fitting",
        "Leak-proof waterproofing seal",
        "Certified sanitary plumbers"
      ],
      inclusions: [
        "Tile layout planning & catalog presentation",
        "Bathroom waterproofing membrane installation",
        "Precision tiling and luxury grout finish",
        "Installation of luxury diverter systems"
      ],
      exclusions: [
        "Cost of luxury Jaquar/Kohler diverter items (purchased separately)",
        "Demolition of main structural beams"
      ],
      faqs: [
        { question: "How long does a tiling job take?", answer: "Usually, a standard bathroom floor waterproofing and tiling job takes about 3 to 4 days." }
      ]
    },
    {
      id: "interior-moodboard-consult",
      name: "Luxury Interior Concept & Moodboard Design",
      category: "interior",
      rating: 4.96,
      reviewsCount: 110,
      price: 1999,
      originalPrice: 2799,
      discountText: "28% OFF",
      duration: 180,
      description: "Consult with gold-medalist interior architects. Receive a 3D moodboard, color palette mapping, furniture layout guides, and material procurement contacts.",
      image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80",
      features: [
        "Gold-medalist interior architects",
        "3D room layout visualizations",
        "Detailed paint & material procurement guides",
        "1-on-1 video call session"
      ],
      inclusions: [
        "Site measurement and current layout review",
        "Color palette & ambient lighting concept consultation",
        "3D layout rendering & layout options",
        "Curated purchase catalog for rugs, lamps, and tables"
      ],
      exclusions: [
        "Physical site supervision or labor execution (can be custom contracted)"
      ],
      faqs: [
        { question: "What deliverables do I get?", answer: "You will receive a high-res PDF presentation containing the 3D layout, custom moodboard theme, Asia Paint code matches, and furniture URLs." }
      ]
    },
    {
      id: "white-glove-moving",
      name: "White-Glove Bubble-Wrapped Villa Packers & Movers",
      category: "moving",
      rating: 4.88,
      reviewsCount: 290,
      price: 2499,
      originalPrice: 3499,
      discountText: "28% OFF",
      duration: 300,
      description: "White-glove packers and movers. Includes 3-layered bubble wrap, cardboard boxes, customized wooden crates for glass/paintings, and zero-scratch transit protection.",
      image: "https://images.unsplash.com/photo-1603796846097-bee99e4a60c9?auto=format&fit=crop&w=800&q=80",
      features: [
        "3-Layered bubble wrap cushioning",
        "Crated packing for television & glass items",
        "Dedicated container trucks with GPS tracking",
        "Transit insurance covers up to ₹10,000"
      ],
      inclusions: [
        "Packing of all household electronics & garments",
        "Loading onto padded logistics truck",
        "Safe transit within city zone",
        "Unpacking and furniture layout setup at new home"
      ],
      exclusions: [
        "Inter-state transit clearances (available as custom upgrade)",
        "Packing of gold, jewelry, or cash"
      ],
      faqs: [
        { question: "How do you pack luxury televisions?", answer: "We use dual-layered bubble sheets and pack the screen inside a custom wooden crate block to prevent impact cracks during transit." }
      ]
    }
  ];

export const reviews: Review[] = [
  {
    id: "rev-1",
    name: "Ananya Iyer",
    rating: 5,
    serviceName: "Classic Deep Home Cleaning",
    comment: "Absolutely outstanding. The team spent 4 hours scrubbing every single spot. The glass panels feel so premium, and the bathroom tiles look brand new. Worth every penny!",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120&q=80",
    image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=300&h=200&q=80",
    date: "2 days ago"
  },
  {
    id: "rev-2",
    name: "Vikram Malhotra",
    rating: 5,
    serviceName: "Foam & Power Jet AC Service",
    comment: "AC was blowing lukewarm air. After the Jet Spray cleaning, the room temperature went down to 18°C in minutes! Plus, the technician showed me the power reading difference. Outstanding service.",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&h=120&q=80",
    date: "1 week ago"
  },
  {
    id: "rev-3",
    name: "Priya Sharma",
    rating: 5,
    serviceName: "Luxury Facial & Hair Spa Combo",
    comment: "This was as premium as any high-end salon in Bandra, Mumbai. The therapist brought a diffuse light, soothing nature sound system, and organic oils. I fell asleep during the face massage!",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80",
    image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=300&h=200&q=80",
    date: "3 days ago"
  }
];

export const professionals: Professional[] = [
  {
    id: "prof-1",
    name: "Arjun Mehta",
    specialty: "Luxury Cleaning Expert",
    experience: "7+ Years",
    rating: 4.95,
    completedJobs: 1240,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
    badges: ["Top Rated", "Background Verified", "Super Partner"],
    completedRate: "99.2%"
  },
  {
    id: "prof-2",
    name: "Neha Patil",
    specialty: "Master Therapist & Aesthetician",
    experience: "5 Years",
    rating: 4.98,
    completedJobs: 1530,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
    badges: ["Gold Badge", "Hygiene Expert", "5-Star Rated"],
    completedRate: "99.8%"
  },
  {
    id: "prof-3",
    name: "Rahul Ranade",
    specialty: "HVAC & Electrical Automation Engineer",
    experience: "6 Years",
    rating: 4.88,
    completedJobs: 980,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
    badges: ["Smart Home Certified", "Verified", "On-Time Service"],
    completedRate: "98.5%"
  }
];

export const citiesServed = [
  { name: "Lanka & Assi Ghat", country: "Varanasi", activePros: 120, image: "/bhu-gate.png" },
  { name: "Godowlia & Dashashwamedh", country: "Varanasi", activePros: 90, image: "/godowlia-crossing.png" },
  { name: "Cantonment & Nadesar", country: "Varanasi", activePros: 150, image: "/cantt-station.png" },
  { name: "Sigra & Mahmoorganj", country: "Varanasi", activePros: 110, image: "/sigra-crossing.png" },
  { name: "Sarnath & Ashapur", country: "Varanasi", activePros: 80, image: "/sarnath-temple.jpg" },
  { name: "Pandeypur & Shivpur", country: "Varanasi", activePros: 70, image: "/pandeypur-flyover.png" }
];

export const faqs = [
  {
    question: "What is HelpMate's Minimal Luxury standard?",
    answer: "Our standards ensure that every professional arriving at your doorstep is certified, background-checked, wears a premium uniform, uses high-end sanitized tools, and guarantees a zero-mess cleanup post-service. Every service is covered under our ₹10,000 damage-protection warranty."
  },
  {
    question: "How do I cancel or reschedule a booking?",
    answer: "You can easily reschedule or cancel your service through the HelpMate Profile Dashboard up to 2 hours before the scheduled time slot without any cancellation fee. Inside 2 hours, a nominal convenience fee is charged."
  },
  {
    question: "Are there any hidden charges?",
    answer: "No, our prices are completely transparent. The price you see includes service charge and taxes. For plumbing or electrical work, any spare parts required will be quoted beforehand using our standard rate-card, and work starts only after your price approval in the app."
  },
  {
    question: "How does the HelpMate Wallet and membership work?",
    answer: "Every referral adds ₹250 to your wallet. You can use wallet credits to pay for services. Our Elite Membership (₹999/year) offers free booking convenience, 10% cashbacks on all bookings, and priority scheduling."
  }
];
