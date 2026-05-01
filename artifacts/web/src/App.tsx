import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { configureApi } from "@/lib/api";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { RequireAuth } from "@/components/admin/RequireAuth";
import HomePage from "@/pages/home";
import ProductsListPage from "@/pages/products-list";
import ProductDetailPage from "@/pages/product-detail";
import PostsListPage from "@/pages/posts-list";
import PostDetailPage from "@/pages/post-detail";
import AboutPage from "@/pages/about";
import ContactPage from "@/pages/contact";
import AdminLoginPage from "@/pages/admin/login";
import AdminDashboardPage from "@/pages/admin/dashboard";
import AdminProductsListPage from "@/pages/admin/products-list";
import AdminProductFormPage from "@/pages/admin/product-form";
import AdminPostsListPage from "@/pages/admin/posts-list";
import AdminPostFormPage from "@/pages/admin/post-form";
import NotFound from "@/pages/not-found";

configureApi();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, retry: 1, staleTime: 30_000 },
  },
});

function PublicRoute({ children }: { children: React.ReactNode }) {
  return <PublicLayout>{children}</PublicLayout>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <AdminLayout>{children}</AdminLayout>
    </RequireAuth>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/admin/login"><AdminLoginPage /></Route>

      <Route path="/admin"><AdminRoute><AdminDashboardPage /></AdminRoute></Route>
      <Route path="/admin/san-pham"><AdminRoute><AdminProductsListPage /></AdminRoute></Route>
      <Route path="/admin/san-pham/moi"><AdminRoute><AdminProductFormPage /></AdminRoute></Route>
      <Route path="/admin/san-pham/:id"><AdminRoute><AdminProductFormPage /></AdminRoute></Route>
      <Route path="/admin/bai-viet"><AdminRoute><AdminPostsListPage /></AdminRoute></Route>
      <Route path="/admin/bai-viet/moi"><AdminRoute><AdminPostFormPage /></AdminRoute></Route>
      <Route path="/admin/bai-viet/:id"><AdminRoute><AdminPostFormPage /></AdminRoute></Route>

      <Route path="/"><PublicRoute><HomePage /></PublicRoute></Route>
      <Route path="/san-pham"><PublicRoute><ProductsListPage /></PublicRoute></Route>
      <Route path="/san-pham/:slug"><PublicRoute><ProductDetailPage /></PublicRoute></Route>
      <Route path="/tin-tuc"><PublicRoute><PostsListPage /></PublicRoute></Route>
      <Route path="/tin-tuc/:slug"><PublicRoute><PostDetailPage /></PublicRoute></Route>
      <Route path="/gioi-thieu"><PublicRoute><AboutPage /></PublicRoute></Route>
      <Route path="/lien-he"><PublicRoute><ContactPage /></PublicRoute></Route>

      <Route><PublicRoute><NotFound /></PublicRoute></Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
