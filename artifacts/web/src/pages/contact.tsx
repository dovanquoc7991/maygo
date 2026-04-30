import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export default function ContactPage() {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      (e.target as HTMLFormElement).reset();
      toast({
        title: "Đã gửi yêu cầu",
        description: "Chúng tôi sẽ liên hệ lại trong vòng 24h.",
      });
    }, 600);
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-foreground md:text-4xl">
          Liên hệ với chúng tôi
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Để lại thông tin, kỹ thuật viên sẽ tư vấn cấu hình máy phù hợp với xưởng của bạn.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr]">
        <aside className="space-y-4">
          <div className="rounded-lg border border-card-border bg-card p-5">
            <h2 className="font-semibold text-foreground">Thông tin liên hệ</h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                <div>
                  <div className="font-medium">Trụ sở</div>
                  <div className="text-muted-foreground">
                    KCN Quang Minh, Mê Linh, Hà Nội
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                <div>
                  <div className="font-medium">Hotline</div>
                  <a
                    href="tel:0901234567"
                    className="text-muted-foreground hover:text-primary"
                  >
                    0901 234 567
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                <div>
                  <div className="font-medium">Email</div>
                  <a
                    href="mailto:contact@xuongmaygo.vn"
                    className="text-muted-foreground hover:text-primary"
                  >
                    contact@xuongmaygo.vn
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                <div>
                  <div className="font-medium">Giờ làm việc</div>
                  <div className="text-muted-foreground">
                    Thứ 2 - Thứ 7: 7h30 - 17h30
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </aside>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-lg border border-card-border bg-card p-6"
        >
          <h2 className="text-lg font-semibold">Yêu cầu báo giá</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="name">Họ và tên *</Label>
              <Input id="name" name="name" required data-testid="input-contact-name" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Số điện thoại *</Label>
              <Input id="phone" name="phone" required data-testid="input-contact-phone" />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" data-testid="input-contact-email" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="company">Đơn vị / xưởng</Label>
              <Input id="company" name="company" data-testid="input-contact-company" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="message">Nội dung yêu cầu *</Label>
            <Textarea
              id="message"
              name="message"
              required
              rows={5}
              placeholder="Mô tả nhu cầu sản xuất, dòng máy quan tâm..."
              data-testid="input-contact-message"
            />
          </div>
          <Button type="submit" disabled={submitting} data-testid="button-submit-contact">
            {submitting ? "Đang gửi..." : "Gửi yêu cầu"}
          </Button>
        </form>
      </div>
    </div>
  );
}
