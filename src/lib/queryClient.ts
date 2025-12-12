import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { MOCK_SHIPMENTS } from "./data"; // استيراد البيانات الحقيقية

const mockFetcher = async (url: string) => {
  console.log(`[Mock API] Fetching: ${url}`);

  // محاكاة تأخير الشبكة لتبدو واقعية
  await new Promise((resolve) => setTimeout(resolve, 500));

  // إذا طلبنا الشحنات، نرجع المصفوفة الموجودة في data.ts
  if (url.includes("/shipments")) return MOCK_SHIPMENTS;

  // بيانات مستخدم وهمية
  if (url.includes("/user")) return { id: 1, name: "Admin User", role: "admin" };

  return [];
};

export async function apiRequest(method: string, url: string, data?: unknown) {
  console.log(`[Mock API] ${method} ${url}`, data);
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}

export const getQueryFn: <T>() => QueryFunction<T> = () => async ({ queryKey }) => {
  const url = queryKey.join("/");
  return await mockFetcher(url) as T;
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn(),
      retry: false,
    },
  },
});
