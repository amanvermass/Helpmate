import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  duration: number; // in mins
}

export interface Address {
  id: string;
  tag: "Home" | "Work" | "Other";
  addressLine: string;
  city: string;
}

export interface Booking {
  id: string;
  items: CartItem[];
  address: Address;
  date: string;
  timeSlot: string;
  totalAmount: number;
  discount: number;
  finalAmount: number;
  status: "Assigned" | "In-Transit" | "Arrived" | "In-Progress" | "Completed" | "Cancelled";
  professional?: {
    name: string;
    rating: number;
    completedJobs: number;
    avatar: string;
    phone: string;
    eta?: string;
  };
  otp: string;
  timeline: { status: string; time: string; done: boolean }[];
  invoiceId: string;
  dateCreated: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "bot" | "partner";
  text: string;
  timestamp: string;
}

interface AppState {
  // Theme
  theme: "light" | "dark";
  toggleTheme: () => void;

  // Auth & Profile
  isLoggedIn: boolean;
  guestMode: boolean;
  setGuestMode: (val: boolean) => void;
  userPhone: string;
  userName: string;
  walletBalance: number;
  loyaltyPoints: number;
  addresses: Address[];
  addAddress: (address: Omit<Address, "id">) => void;
  removeAddress: (id: string) => void;
  login: (phone: string) => void;
  logout: () => void;

  // Cart
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string) => void;
  updateCartQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;

  // Booking details
  selectedAddressId: string | null;
  setSelectedAddressId: (id: string | null) => void;
  selectedDate: string | null;
  setSelectedDate: (date: string | null) => void;
  selectedTimeSlot: string | null;
  setSelectedTimeSlot: (slot: string | null) => void;
  appliedCoupon: string | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;

  // Bookings list
  bookings: Booking[];
  createBooking: () => Booking | null;
  cancelBooking: (id: string) => void;
  rescheduleBooking: (id: string, date: string, slot: string) => void;
  updateBookingStatus: (id: string, status: Booking["status"]) => void;

  // Wishlist / History
  wishlist: string[];
  toggleWishlist: (id: string) => void;
  recentlyViewed: string[];
  addToRecentlyViewed: (id: string) => void;

  // Notifications
  notifications: { id: string; title: string; message: string; type: "info" | "success" | "warning"; date: string }[];
  addNotification: (title: string, message: string, type?: "info" | "success" | "warning") => void;
  clearNotifications: () => void;

  // Live Chat
  chatOpen: boolean;
  setChatOpen: (open: boolean) => void;
  chatMessages: ChatMessage[];
  sendChatMessage: (text: string, sender?: "user" | "bot" | "partner") => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Theme
      theme: "light",
      toggleTheme: () => set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),

      // Profile State
      isLoggedIn: false, // Defaulting logged out to prompt login/signup first
      guestMode: false,
      setGuestMode: (val) => set({ guestMode: val }),
      userPhone: "+91 98765 01928",
      userName: "Rohan Verma",
      walletBalance: 1250,
      loyaltyPoints: 340,
      addresses: [
        { id: "1", tag: "Home", addressLine: "B-2/30, Assi Ghat Road, Near Assi Ghat", city: "Varanasi" },
        { id: "2", tag: "Work", addressLine: "S-20/54, Nadesar, Cantonment", city: "Varanasi" },
      ],
      addAddress: (address) =>
        set((state) => ({
          addresses: [...state.addresses, { ...address, id: Math.random().toString(36).substr(2, 9) }],
        })),
      removeAddress: (id) =>
        set((state) => ({
          addresses: state.addresses.filter((addr) => addr.id !== id),
        })),
      login: (phone) => set({ isLoggedIn: true, guestMode: false, userPhone: phone, userName: "User " + phone.slice(-4) }),
      logout: () => set({ isLoggedIn: false, guestMode: true, userPhone: "", userName: "", bookings: [], cart: [] }),

      // Cart
      cart: [],
      addToCart: (item) =>
        set((state) => {
          const existing = state.cart.find((i) => i.id === item.id);
          if (existing) {
            return {
              cart: state.cart.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)),
            };
          }
          return { cart: [...state.cart, { ...item, quantity: 1 }] };
        }),
      removeFromCart: (id) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== id),
        })),
      updateCartQuantity: (id, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return { cart: state.cart.filter((item) => item.id !== id) };
          }
          return {
            cart: state.cart.map((item) => (item.id === id ? { ...item, quantity } : item)),
          };
        }),
      clearCart: () =>
        set({
          cart: [],
          selectedAddressId: null,
          selectedDate: null,
          selectedTimeSlot: null,
          appliedCoupon: null,
        }),

      // Checkout Details
      selectedAddressId: "1",
      setSelectedAddressId: (id) => set({ selectedAddressId: id }),
      selectedDate: null,
      setSelectedDate: (date) => set({ selectedDate: date }),
      selectedTimeSlot: null,
      setSelectedTimeSlot: (slot) => set({ selectedTimeSlot: slot }),
      appliedCoupon: null,
      applyCoupon: (code) => {
        const cleaned = code.trim().toUpperCase();
        if (cleaned === "LUXURY50" || cleaned === "WELCOME100" || cleaned === "SUPERDEAL") {
          set({ appliedCoupon: cleaned });
          return true;
        }
        return false;
      },
      removeCoupon: () => set({ appliedCoupon: null }),

      // Bookings
      bookings: [],
      createBooking: () => {
        const state = get();
        if (state.cart.length === 0 || !state.selectedAddressId || !state.selectedDate || !state.selectedTimeSlot) {
          return null;
        }

        const address = state.addresses.find((a) => a.id === state.selectedAddressId) || state.addresses[0];
        const subtotal = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        let discount = 0;
        if (state.appliedCoupon === "LUXURY50") discount = Math.min(500, subtotal * 0.15); // 15% off up to 500
        if (state.appliedCoupon === "WELCOME100") discount = 100;
        if (state.appliedCoupon === "SUPERDEAL") discount = Math.min(1000, subtotal * 0.25); // 25% off up to 1000

        const finalAmount = Math.max(0, subtotal - discount);

        const professionals = [
          { name: "Arjun Mehta", rating: 4.9, completedJobs: 1240, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80", phone: "+91 98765 43210", eta: "15 mins" },
          { name: "Rahul Ranade", rating: 4.85, completedJobs: 980, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80", phone: "+91 91234 56789", eta: "25 mins" },
          { name: "Neha Patil", rating: 4.95, completedJobs: 1530, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80", phone: "+91 95432 10987", eta: "8 mins" }
        ];
        const chosenProf = professionals[Math.floor(Math.random() * professionals.length)];

        const newBooking: Booking = {
          id: "BK-" + Math.floor(100000 + Math.random() * 900000).toString(),
          items: state.cart,
          address,
          date: state.selectedDate,
          timeSlot: state.selectedTimeSlot,
          totalAmount: subtotal,
          discount,
          finalAmount,
          status: "Assigned",
          professional: chosenProf,
          otp: Math.floor(1000 + Math.random() * 9000).toString(),
          dateCreated: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          invoiceId: "INV-" + Math.floor(10000000 + Math.random() * 90000000).toString(),
          timeline: [
            { status: "Booking Confirmed", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), done: true },
            { status: "Professional Assigned", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), done: true },
            { status: "In-Transit to Location", time: "Pending", done: false },
            { status: "Arrived at Address", time: "Pending", done: false },
            { status: "Service Completed", time: "Pending", done: false },
          ],
        };

        set((state) => ({
          bookings: [newBooking, ...state.bookings],
        }));

        // Send a notification
        get().addNotification(
          "Booking Confirmed!",
          `Your service booking ${newBooking.id} is confirmed. ${chosenProf.name} will arrive on ${newBooking.date} at ${newBooking.timeSlot}.`,
          "success"
        );

        // Clear cart
        get().clearCart();
        return newBooking;
      },
      cancelBooking: (id) =>
        set((state) => {
          const updated = state.bookings.map((booking) => {
            if (booking.id === id) {
              return {
                ...booking,
                status: "Cancelled" as const,
                timeline: booking.timeline.map((step) =>
                  step.status === "Service Completed" ? { ...step, status: "Cancelled", done: true } : step
                ),
              };
            }
            return booking;
          });

          get().addNotification(
            "Booking Cancelled",
            `Your booking ${id} has been cancelled successfully. Refund has been initiated.`,
            "warning"
          );

          return { bookings: updated };
        }),
      rescheduleBooking: (id, date, slot) =>
        set((state) => {
          const updated = state.bookings.map((booking) => {
            if (booking.id === id) {
              return { ...booking, date, timeSlot: slot };
            }
            return booking;
          });

          get().addNotification(
            "Booking Rescheduled",
            `Your booking ${id} has been rescheduled to ${date} at ${slot}.`,
            "info"
          );

          return { bookings: updated };
        }),
      updateBookingStatus: (id, status) =>
        set((state) => {
          const updated = state.bookings.map((booking) => {
            if (booking.id === id) {
              const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              const timeline = booking.timeline.map((step) => {
                if (step.status === "In-Transit to Location" && status === "In-Transit") return { ...step, time: nowTime, done: true };
                if (step.status === "Arrived at Address" && status === "Arrived") return { ...step, time: nowTime, done: true };
                if (step.status === "Service Completed" && status === "Completed") return { ...step, time: nowTime, done: true };
                return step;
              });

              // Adjust main status
              return { ...booking, status, timeline };
            }
            return booking;
          });

          return { bookings: updated };
        }),

      // Wishlist & History
      wishlist: [],
      toggleWishlist: (id) =>
        set((state) => {
          const exists = state.wishlist.includes(id);
          const updated = exists ? state.wishlist.filter((w) => w !== id) : [...state.wishlist, id];
          return { wishlist: updated };
        }),
      recentlyViewed: [],
      addToRecentlyViewed: (id) =>
        set((state) => {
          const filtered = state.recentlyViewed.filter((item) => item !== id);
          return { recentlyViewed: [id, ...filtered].slice(0, 5) }; // Limit to 5
        }),

      // Notifications
      notifications: [
        { id: "1", title: "Welcome to HelpMate", message: "Enjoy 15% off on your first order using code LUXURY50.", type: "info", date: "Just now" },
      ],
      addNotification: (title, message, type = "info") =>
        set((state) => ({
          notifications: [
            {
              id: Math.random().toString(),
              title,
              message,
              type,
              date: "Just now",
            },
            ...state.notifications,
          ],
        })),
      clearNotifications: () => set({ notifications: [] }),

      // Live Chat
      chatOpen: false,
      setChatOpen: (open) => set({ chatOpen: open }),
      chatMessages: [
        { id: "1", sender: "bot", text: "Hello! Welcome to HelpMate Luxury Support. How can I help you today?", timestamp: "10:00 AM" },
      ],
      sendChatMessage: (text, sender = "user") =>
        set((state) => {
          const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const userMsg: ChatMessage = { id: Math.random().toString(), sender, text, timestamp: now };
          
          let updatedMessages = [...state.chatMessages, userMsg];

          // Trigger simulated reply if user sent the message
          if (sender === "user") {
            setTimeout(() => {
              const replies = [
                "I understand your query. A dedicated customer support specialist is joining the chat to assist you.",
                "Let me look up your active booking. Could you verify your registered mobile number?",
                "Absolutely! All our professionals are 100% background checked and certified. Your safety is our absolute priority.",
                "For service customisation or large commercial tasks, you can schedule a free site inspection through our portal."
              ];
              const botReply: ChatMessage = {
                id: Math.random().toString(),
                sender: "bot",
                text: replies[Math.floor(Math.random() * replies.length)],
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              };
              useStore.setState((s) => ({ chatMessages: [...s.chatMessages, botReply] }));
            }, 1000);
          }

          return { chatMessages: updatedMessages };
        }),
    }),
    {
      name: "helpmate-store",
      partialize: (state) => ({
        theme: state.theme,
        isLoggedIn: state.isLoggedIn,
        guestMode: state.guestMode,
        userPhone: state.userPhone,
        userName: state.userName,
        walletBalance: state.walletBalance,
        loyaltyPoints: state.loyaltyPoints,
        addresses: state.addresses,
        bookings: state.bookings,
        wishlist: state.wishlist,
        recentlyViewed: state.recentlyViewed,
      }),
    }
  )
);
