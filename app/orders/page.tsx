"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowLeft, Package, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

interface OrderItem {
  slug: string;
  name: string;
  image: string;
  price: number;
  volume: string;
  quantity: number;
}

interface Order {
  orderId: string;
  items: OrderItem[];
  address: {
    fullName: string;
    city: string;
    state: string;
  };
  deliveryMethod: string;
  subtotal: number;
  total: number;
  status: string;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  preparing: "bg-orange-100 text-orange-700",
  dispatched: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function OrdersPage() {
  const router = useRouter();
  const { status } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
      return;
    }
    if (status === "authenticated") {
      fetch("/api/user/orders")
        .then((res) => res.json())
        .then((data) => {
          setOrders(data.orders || []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [status, router]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-[#fdf8f3] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-[#c8956c]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf8f3] pt-24 sm:pt-28 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => router.push("/")}
            className="text-[#5a4635] hover:text-[#2d2016] transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#c8956c]/10 flex items-center justify-center">
              <Package size={18} className="text-[#c8956c]" />
            </div>
            <h1
              className="text-2xl font-bold text-[#2d2016]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              My Orders
            </h1>
          </div>
        </div>

        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-12 border border-[#f0e6d8] shadow-sm text-center"
          >
            <Package size={48} className="text-[#c8956c]/30 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-[#2d2016] mb-2">No orders yet</h2>
            <p className="text-sm text-[#5a4635]/60 mb-6">
              Looks like you haven&apos;t placed any orders. Start exploring our menu!
            </p>
            <button
              onClick={() => router.push("/#products")}
              className="px-6 py-2.5 bg-[#2d2016] text-white font-semibold rounded-xl hover:bg-[#1a120d] transition-colors text-sm"
            >
              Browse Products
            </button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, i) => (
              <motion.div
                key={order.orderId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl p-5 sm:p-6 border border-[#f0e6d8] shadow-sm"
              >
                {/* Order Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-[#5a4635]/50 font-mono">{order.orderId}</p>
                    <p className="text-xs text-[#5a4635]/40 mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${statusColors[order.status] || "bg-gray-100 text-gray-600"}`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* Items */}
                <div className="space-y-2 mb-4">
                  {order.items.map((item, j) => (
                    <div key={j} className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#fdf8f3] border border-[#f0e6d8] shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#2d2016] truncate">{item.name}</p>
                        <p className="text-xs text-[#5a4635]/50">
                          {item.volume} × {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-[#2d2016]">₹{item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-[#f0e6d8]">
                  <p className="text-xs text-[#5a4635]/50">
                    {order.address.city}, {order.address.state}
                  </p>
                  <p className="text-base font-bold text-[#2d2016]">₹{order.total}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
