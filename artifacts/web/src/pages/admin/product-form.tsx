import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useRoute } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListAdminProducts,
  useCreateProduct,
  useUpdateProduct,
  getListAdminProductsQueryKey,
  getGetAdminStatsQueryKey,
} from "@workspace/api-client-react";
// queryKey getter imported from generated module above
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { slugify } from "@/lib/format";
import { ChevronLeft, Plus, Trash2 } from "lucide-react";

type SpecRow = { label: string; value: string };

type FormState = {
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  price: string;
  salePrice: string;
  categorySlug: string;
  categoryName: string;
  brand: string;
  sku: string;
  powerKw: string;
  weightKg: string;
  dimensions: string;
  warrantyMonths: string;
  origin: string;
  coverImageUrl: string;
  galleryText: string;
  featuresText: string;
  specs: SpecRow[];
  inStock: boolean;
  featured: boolean;
};

const EMPTY: FormState = {
  slug: "",
  name: "",
  shortDescription: "",
  description: "",
  price: "",
  salePrice: "",
  categorySlug: "",
  categoryName: "",
  brand: "",
  sku: "",
  powerKw: "",
  weightKg: "",
  dimensions: "",
  warrantyMonths: "",
  origin: "",
  coverImageUrl: "",
  galleryText: "",
  featuresText: "",
  specs: [],
  inStock: true,
  featured: false,
};

export default function AdminProductFormPage() {
  const [matchEdit, paramsEdit] = useRoute("/admin/san-pham/:id");
  const [matchNew] = useRoute("/admin/san-pham/moi");
  const isEdit = matchEdit && !matchNew;
  const productId = isEdit ? parseInt(paramsEdit?.id ?? "", 10) : null;

  const [, navigate] = useLocation();
  const qc = useQueryClient();
  const { toast } = useToast();

  const { data: list } = useListAdminProducts({
    query: { queryKey: getListAdminProductsQueryKey(), enabled: isEdit },
  });
  const existing = useMemo(
    () => (productId != null ? list?.find((p) => p.id === productId) : undefined),
    [list, productId],
  );

  const [state, setState] = useState<FormState>(EMPTY);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (existing) {
      setState({
        slug: existing.slug,
        name: existing.name,
        shortDescription: existing.shortDescription,
        description: existing.description,
        price: String(existing.price),
        salePrice: existing.salePrice != null ? String(existing.salePrice) : "",
        categorySlug: existing.categorySlug,
        categoryName: existing.categoryName,
        brand: existing.brand,
        sku: existing.sku,
        powerKw: existing.powerKw != null ? String(existing.powerKw) : "",
        weightKg: existing.weightKg != null ? String(existing.weightKg) : "",
        dimensions: existing.dimensions ?? "",
        warrantyMonths:
          existing.warrantyMonths != null ? String(existing.warrantyMonths) : "",
        origin: existing.origin ?? "",
        coverImageUrl: existing.coverImageUrl,
        galleryText: (existing.gallery ?? []).join("\n"),
        featuresText: (existing.features ?? []).join("\n"),
        specs: existing.specs ?? [],
        inStock: existing.inStock,
        featured: existing.featured,
      });
    }
  }, [existing]);

  const create = useCreateProduct();
  const update = useUpdateProduct();
  const submitting = create.isPending || update.isPending;

  function update_(field: keyof FormState, value: unknown) {
    setState((s) => ({ ...s, [field]: value }));
  }

  function buildPayload() {
    return {
      slug: state.slug.trim(),
      name: state.name.trim(),
      shortDescription: state.shortDescription.trim(),
      description: state.description.trim(),
      price: Number(state.price),
      salePrice: state.salePrice ? Number(state.salePrice) : null,
      currency: "VND",
      categorySlug: state.categorySlug.trim(),
      categoryName: state.categoryName.trim(),
      brand: state.brand.trim(),
      sku: state.sku.trim(),
      powerKw: state.powerKw ? Number(state.powerKw) : null,
      weightKg: state.weightKg ? Number(state.weightKg) : null,
      dimensions: state.dimensions.trim() || null,
      warrantyMonths: state.warrantyMonths ? parseInt(state.warrantyMonths, 10) : null,
      origin: state.origin.trim() || null,
      coverImageUrl: state.coverImageUrl.trim(),
      gallery: state.galleryText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      features: state.featuresText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      specs: state.specs.filter((s) => s.label.trim() && s.value.trim()),
      inStock: state.inStock,
      featured: state.featured,
    };
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    const payload = buildPayload();
    if (Number.isNaN(payload.price) || payload.price <= 0) {
      toast({ title: "Giá không hợp lệ", variant: "destructive" });
      return;
    }
    const onSuccess = () => {
      qc.invalidateQueries({ queryKey: getListAdminProductsQueryKey() });
      qc.invalidateQueries({ queryKey: getGetAdminStatsQueryKey() });
      toast({
        title: isEdit ? "Đã cập nhật" : "Đã thêm sản phẩm",
      });
      navigate("/admin/san-pham");
    };
    const onError = () => {
      toast({
        title: "Lưu thất bại",
        description: "Kiểm tra slug có bị trùng và các trường bắt buộc.",
        variant: "destructive",
      });
    };
    if (isEdit && productId != null) {
      update.mutate({ id: productId, data: payload }, { onSuccess, onError });
    } else {
      create.mutate({ data: payload }, { onSuccess, onError });
    }
  }

  return (
    <div>
      <Link
        href="/admin/san-pham"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
      >
        <ChevronLeft className="h-4 w-4" />
        Danh sách sản phẩm
      </Link>

      <h2 className="mt-2 text-xl font-bold">
        {isEdit ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
      </h2>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Section title="Thông tin chung">
            <Field label="Tên sản phẩm *">
              <Input
                value={state.name}
                onChange={(e) => {
                  update_("name", e.target.value);
                  if (!isEdit && !touched) update_("slug", slugify(e.target.value));
                }}
                required
                data-testid="input-name"
              />
            </Field>
            <Field label="Slug (URL) *">
              <Input
                value={state.slug}
                onChange={(e) => {
                  setTouched(true);
                  update_("slug", e.target.value);
                }}
                required
                data-testid="input-slug"
              />
            </Field>
            <Field label="Mô tả ngắn *">
              <Textarea
                value={state.shortDescription}
                onChange={(e) => update_("shortDescription", e.target.value)}
                rows={2}
                required
                data-testid="input-short-desc"
              />
            </Field>
            <Field label="Mô tả chi tiết *">
              <Textarea
                value={state.description}
                onChange={(e) => update_("description", e.target.value)}
                rows={6}
                required
                data-testid="input-desc"
              />
            </Field>
          </Section>

          <Section title="Hình ảnh">
            <Field label="Ảnh bìa (URL) *">
              <Input
                value={state.coverImageUrl}
                onChange={(e) => update_("coverImageUrl", e.target.value)}
                required
                data-testid="input-cover"
              />
            </Field>
            <Field label="Ảnh phụ (mỗi URL 1 dòng)">
              <Textarea
                value={state.galleryText}
                onChange={(e) => update_("galleryText", e.target.value)}
                rows={3}
                data-testid="input-gallery"
              />
            </Field>
          </Section>

          <Section title="Tính năng & Thông số">
            <Field label="Tính năng nổi bật (mỗi dòng 1 mục)">
              <Textarea
                value={state.featuresText}
                onChange={(e) => update_("featuresText", e.target.value)}
                rows={4}
                data-testid="input-features"
              />
            </Field>
            <div>
              <Label className="mb-2 block">Bảng thông số kỹ thuật</Label>
              <div className="space-y-2">
                {state.specs.map((s, i) => (
                  <div key={i} className="flex gap-2">
                    <Input
                      value={s.label}
                      placeholder="Tên thông số"
                      onChange={(e) => {
                        const next = [...state.specs];
                        next[i] = { ...next[i], label: e.target.value };
                        update_("specs", next);
                      }}
                      data-testid={`input-spec-label-${i}`}
                    />
                    <Input
                      value={s.value}
                      placeholder="Giá trị"
                      onChange={(e) => {
                        const next = [...state.specs];
                        next[i] = { ...next[i], value: e.target.value };
                        update_("specs", next);
                      }}
                      data-testid={`input-spec-value-${i}`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        update_(
                          "specs",
                          state.specs.filter((_, j) => j !== i),
                        )
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() =>
                  update_("specs", [...state.specs, { label: "", value: "" }])
                }
                data-testid="button-add-spec"
              >
                <Plus className="mr-1 h-4 w-4" /> Thêm thông số
              </Button>
            </div>
          </Section>
        </div>

        <div className="space-y-4">
          <Section title="Phân loại & giá">
            <Field label="Danh mục slug *">
              <Input
                value={state.categorySlug}
                onChange={(e) => update_("categorySlug", e.target.value)}
                required
                data-testid="input-cat-slug"
              />
            </Field>
            <Field label="Tên danh mục *">
              <Input
                value={state.categoryName}
                onChange={(e) => update_("categoryName", e.target.value)}
                required
                data-testid="input-cat-name"
              />
            </Field>
            <Field label="Hãng *">
              <Input
                value={state.brand}
                onChange={(e) => update_("brand", e.target.value)}
                required
                data-testid="input-brand"
              />
            </Field>
            <Field label="Mã SKU *">
              <Input
                value={state.sku}
                onChange={(e) => update_("sku", e.target.value)}
                required
                data-testid="input-sku"
              />
            </Field>
            <Field label="Giá (VNĐ) *">
              <Input
                type="number"
                value={state.price}
                onChange={(e) => update_("price", e.target.value)}
                required
                data-testid="input-price"
              />
            </Field>
            <Field label="Giá khuyến mãi (VNĐ)">
              <Input
                type="number"
                value={state.salePrice}
                onChange={(e) => update_("salePrice", e.target.value)}
                data-testid="input-sale"
              />
            </Field>
          </Section>

          <Section title="Thông số kỹ thuật chính">
            <Field label="Công suất (kW)">
              <Input
                type="number"
                step="0.01"
                value={state.powerKw}
                onChange={(e) => update_("powerKw", e.target.value)}
              />
            </Field>
            <Field label="Khối lượng (kg)">
              <Input
                type="number"
                step="0.01"
                value={state.weightKg}
                onChange={(e) => update_("weightKg", e.target.value)}
              />
            </Field>
            <Field label="Kích thước">
              <Input
                value={state.dimensions}
                onChange={(e) => update_("dimensions", e.target.value)}
              />
            </Field>
            <Field label="Bảo hành (tháng)">
              <Input
                type="number"
                value={state.warrantyMonths}
                onChange={(e) => update_("warrantyMonths", e.target.value)}
              />
            </Field>
            <Field label="Xuất xứ">
              <Input
                value={state.origin}
                onChange={(e) => update_("origin", e.target.value)}
              />
            </Field>
          </Section>

          <Section title="Hiển thị">
            <div className="flex items-center justify-between">
              <Label htmlFor="inStock">Còn hàng</Label>
              <Switch
                id="inStock"
                checked={state.inStock}
                onCheckedChange={(v) => update_("inStock", v)}
                data-testid="switch-instock"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="featured">Sản phẩm nổi bật</Label>
              <Switch
                id="featured"
                checked={state.featured}
                onCheckedChange={(v) => update_("featured", v)}
                data-testid="switch-featured"
              />
            </div>
          </Section>

          <div className="flex flex-col gap-2">
            <Button type="submit" disabled={submitting} data-testid="button-save">
              {submitting ? "Đang lưu..." : isEdit ? "Cập nhật" : "Tạo sản phẩm"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/san-pham")}
            >
              Hủy
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-card-border bg-card p-5">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
