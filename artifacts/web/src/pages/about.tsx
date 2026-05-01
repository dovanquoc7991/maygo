import { Hammer, Award, Users, Globe } from "lucide-react";

const VALUES = [
  {
    icon: Award,
    title: "Chất lượng",
    desc: "Chỉ phân phối máy đạt chuẩn nhà máy, kiểm tra trước khi giao.",
  },
  {
    icon: Users,
    title: "Đồng hành",
    desc: "Hỗ trợ kỹ thuật xuyên suốt vòng đời sử dụng của thiết bị.",
  },
  {
    icon: Globe,
    title: "Toàn quốc",
    desc: "Mạng lưới kỹ thuật và kho phụ tùng tại cả 3 miền Bắc - Trung - Nam.",
  },
  {
    icon: Hammer,
    title: "Chuyên môn",
    desc: "10+ năm phục vụ ngành chế biến gỗ Việt Nam.",
  },
];

export default function AboutPage() {
  return (
    <div>
      <section className="bg-sidebar text-sidebar-foreground">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-3xl font-bold md:text-4xl">
            Về <span className="text-sidebar-primary">Xưởng Máy Gỗ Việt</span>
          </h1>
          <p className="mt-3 max-w-2xl text-base text-sidebar-foreground/80">
            Chúng tôi là đơn vị nhập khẩu và phân phối thiết bị chế biến gỗ
            công nghiệp, đồng hành cùng hàng trăm xưởng mộc và nhà máy nội thất
            Việt Nam suốt hơn một thập kỷ.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Câu chuyện của chúng tôi
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
              <p>
                Thành lập năm 2014 tại Hà Nội, Xưởng Máy Gỗ Việt khởi đầu từ một
                xưởng cơ khí nhỏ chuyên sửa chữa máy bào, máy cưa cho các hộ
                kinh doanh đồ gỗ tại Mê Linh.
              </p>
              <p>
                Với kinh nghiệm thực tế trong vận hành và bảo trì, chúng tôi
                hiểu rõ những bài toán mà chủ xưởng phải đối mặt: từ chọn máy
                đúng nhu cầu, tối ưu chi phí, tới bảo trì để máy bền lâu.
              </p>
              <p>
                Đến nay, công ty đã trở thành đối tác phân phối ủy quyền của
                nhiều thương hiệu máy gỗ uy tín từ Đài Loan, Trung Quốc, Ý và
                Đức tại Việt Nam.
              </p>
            </div>
          </div>
          <img
            src="https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=1200&q=80"
            alt="Xưởng máy gỗ"
            className="rounded-lg shadow-md"
          />
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-foreground">Giá trị cốt lõi</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v) => (
            <div
              key={v.title}
              className="rounded-lg border border-card-border bg-card p-5"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                <v.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-3 text-base font-semibold">{v.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
