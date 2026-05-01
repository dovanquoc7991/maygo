import { db, productsTable, postsTable, adminUsersTable } from "@workspace/db";
import { hashPassword } from "./auth";
import { logger } from "./logger";

export async function seedIfEmpty(): Promise<void> {
  const existingAdmins = await db.select().from(adminUsersTable).limit(1);
  if (existingAdmins.length === 0) {
    await db.insert(adminUsersTable).values({
      username: "admin",
      passwordHash: hashPassword("admin123"),
      displayName: "Quản trị viên",
    });
    logger.info("Seeded default admin user (admin / admin123)");
  }

  const existingProducts = await db.select().from(productsTable).limit(1);
  if (existingProducts.length === 0) {
    await db.insert(productsTable).values([
      {
        slug: "may-bao-cuon-4-mat-mb524",
        name: "Máy bào cuốn 4 mặt MB-524",
        shortDescription:
          "Máy bào cuốn 4 mặt công nghiệp, công suất lớn, gia công gỗ tự nhiên và gỗ ghép.",
        description:
          "Máy bào cuốn 4 mặt MB-524 là dòng máy chuyên dụng cho các xưởng sản xuất đồ gỗ nội thất, ván sàn và ván ghép thanh. Máy được trang bị 4 trục dao thép hợp kim, mô-tơ chính 7.5kW, mâm cấp phôi tự động cho phép gia công liên tục với năng suất cao.\n\nKhung máy đúc gang nguyên khối giúp giảm rung, tăng độ ổn định và độ chính xác bề mặt khi gia công.",
        price: "185000000",
        salePrice: "169000000",
        currency: "VND",
        categorySlug: "may-bao",
        categoryName: "Máy bào",
        brand: "Woodtech",
        sku: "MB524-4M",
        powerKw: "7.50",
        weightKg: "1450",
        dimensions: "2200 x 1100 x 1450 mm",
        warrantyMonths: 12,
        origin: "Đài Loan",
        coverImageUrl:
          "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=1200&q=80",
        gallery: [
          "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=1600&q=80",
          "https://images.unsplash.com/photo-1581092446327-9b52bd1570c2?w=1600&q=80",
        ],
        features: [
          "4 trục dao thép hợp kim, dễ thay thế",
          "Mâm cấp phôi tự động, tốc độ điều chỉnh vô cấp",
          "Khung máy đúc gang nguyên khối, hạn chế rung",
          "Tủ điện Schneider, an toàn vận hành",
        ],
        specs: [
          { label: "Công suất tổng", value: "12.5 kW" },
          { label: "Tốc độ trục dao", value: "6000 vòng/phút" },
          { label: "Kích thước phôi tối đa", value: "230 x 125 mm" },
          { label: "Tốc độ cấp phôi", value: "6 - 24 m/phút" },
        ],
        inStock: true,
        featured: true,
      },
      {
        slug: "may-cua-ban-truot-mc3200",
        name: "Máy cưa bàn trượt MC-3200",
        shortDescription:
          "Máy cưa bàn trượt 3200mm, cắt ván MDF, ván dăm, ván ghép thanh chính xác cao.",
        description:
          "MC-3200 là dòng cưa bàn trượt cho các xưởng mộc và nhà máy sản xuất đồ nội thất. Bàn trượt nhôm hợp kim dài 3200mm, lưỡi cưa chính 350mm, lưỡi cưa mạch nhỏ chống dăm.\n\nThích hợp cắt ván công nghiệp, ván dán, gỗ tự nhiên dày tới 100mm.",
        price: "92000000",
        salePrice: null,
        currency: "VND",
        categorySlug: "may-cua",
        categoryName: "Máy cưa",
        brand: "Woodtech",
        sku: "MC3200",
        powerKw: "5.50",
        weightKg: "780",
        dimensions: "3200 x 1800 x 1100 mm",
        warrantyMonths: 12,
        origin: "Đài Loan",
        coverImageUrl:
          "https://images.unsplash.com/photo-1572297870735-3727e7e7d653?w=1200&q=80",
        gallery: [
          "https://images.unsplash.com/photo-1572297870735-3727e7e7d653?w=1600&q=80",
        ],
        features: [
          "Bàn trượt nhôm hợp kim 3200mm",
          "Lưỡi cưa chính 350mm + lưỡi mạch chống dăm",
          "Nghiêng lưỡi 0 - 45 độ",
          "Hệ thống hút bụi đôi",
        ],
        specs: [
          { label: "Đường kính lưỡi cưa chính", value: "350 mm" },
          { label: "Chiều cao cắt tối đa", value: "100 mm" },
          { label: "Hành trình bàn trượt", value: "3200 mm" },
          { label: "Tốc độ trục", value: "4500 vòng/phút" },
        ],
        inStock: true,
        featured: true,
      },
      {
        slug: "may-cnc-router-1325",
        name: "Máy CNC Router 1325 3 trục",
        shortDescription:
          "Máy CNC khắc gỗ 1300x2500mm, đầu spindle 5.5kW, điều khiển DSP cầm tay.",
        description:
          "CNC Router 1325 là giải pháp tự động hóa cho các xưởng sản xuất cửa, vách CNC, nội thất chạm khắc. Bàn máy 1300 x 2500mm, hành trình Z 200mm, đầu spindle làm mát bằng nước 5.5kW.\n\nĐiều khiển DSP cầm tay tiếng Việt, hỗ trợ file G-code và .nc xuất từ Artcam, Type3, JDPaint.",
        price: "245000000",
        salePrice: "229000000",
        currency: "VND",
        categorySlug: "may-cnc",
        categoryName: "Máy CNC",
        brand: "WoodCNC",
        sku: "CNC-1325-55",
        powerKw: "5.50",
        weightKg: "1200",
        dimensions: "3300 x 2100 x 1900 mm",
        warrantyMonths: 18,
        origin: "Trung Quốc",
        coverImageUrl:
          "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=1200&q=80",
        gallery: [
          "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=1600&q=80",
        ],
        features: [
          "Bàn máy 1300 x 2500 mm, vacuum hút phôi",
          "Spindle làm mát nước 5.5kW",
          "Vít me bi C7, ray dẫn hướng vuông Hiwin",
          "Tay điều khiển DSP A11 tiếng Việt",
        ],
        specs: [
          { label: "Hành trình X / Y / Z", value: "2500 / 1300 / 200 mm" },
          { label: "Tốc độ chạy không tải", value: "30 m/phút" },
          { label: "Độ chính xác lặp lại", value: "± 0.03 mm" },
          { label: "Hệ thống điều khiển", value: "DSP A11" },
        ],
        inStock: true,
        featured: true,
      },
      {
        slug: "may-cha-nham-thung-3-truc",
        name: "Máy chà nhám thùng 3 trục R-RP1300",
        shortDescription:
          "Máy chà nhám thùng 1300mm 3 trục, hoàn thiện bề mặt ván ép và gỗ tự nhiên.",
        description:
          "RP-1300 là dòng chà nhám thùng 3 trục với chiều rộng làm việc 1300mm, dành cho các nhà máy sản xuất ván sàn, ván ghép, mặt bàn.\n\nKết hợp 1 trục cao su và 2 trục cứng cho phép phá thô và hoàn thiện trong một lần đi.",
        price: "320000000",
        salePrice: null,
        currency: "VND",
        categorySlug: "may-cha-nham",
        categoryName: "Máy chà nhám",
        brand: "Sander Pro",
        sku: "RP-1300-3T",
        powerKw: "22.00",
        weightKg: "2800",
        dimensions: "2400 x 2100 x 1900 mm",
        warrantyMonths: 12,
        origin: "Đài Loan",
        coverImageUrl:
          "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=1200&q=80",
        gallery: [
          "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=1600&q=80",
        ],
        features: [
          "3 trục: 1 cao su + 2 cứng",
          "Băng nhám 1320mm, dễ thay",
          "Bàn nâng hạ điện, hiển thị số",
          "Hệ thống hút bụi sẵn cổng đôi",
        ],
        specs: [
          { label: "Chiều rộng làm việc", value: "1300 mm" },
          { label: "Chiều dày phôi", value: "3 - 160 mm" },
          { label: "Tốc độ băng tải", value: "4 - 18 m/phút" },
          { label: "Công suất tổng", value: "22 kW" },
        ],
        inStock: true,
        featured: true,
      },
      {
        slug: "may-phay-truc-dung-mx5117",
        name: "Máy phay trục đứng MX-5117",
        shortDescription:
          "Máy phay mộng và soi cạnh trục đứng, tốc độ trục 8000 vòng/phút.",
        description:
          "MX-5117 là máy phay trục đứng truyền thống cho các xưởng sản xuất cửa, khung tranh, đồ gỗ mỹ nghệ. Khung máy đúc gang, trục chính nghiêng 0 - 45 độ.",
        price: "38500000",
        salePrice: null,
        currency: "VND",
        categorySlug: "may-phay",
        categoryName: "Máy phay",
        brand: "Woodtech",
        sku: "MX-5117",
        powerKw: "4.00",
        weightKg: "520",
        dimensions: "1100 x 900 x 1100 mm",
        warrantyMonths: 12,
        origin: "Việt Nam",
        coverImageUrl:
          "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=1200&q=80",
        gallery: [
          "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=1600&q=80",
        ],
        features: [
          "Khung máy đúc gang, ổn định",
          "Trục chính nghiêng 0 - 45 độ",
          "3 cấp tốc độ trục: 4000 / 6000 / 8000",
          "Bàn máy mặt phẳng phay được",
        ],
        specs: [
          { label: "Đường kính trục chính", value: "30 mm" },
          { label: "Hành trình lên xuống", value: "150 mm" },
          { label: "Kích thước bàn máy", value: "1100 x 800 mm" },
          { label: "Công suất", value: "4 kW" },
        ],
        inStock: false,
        featured: false,
      },
      {
        slug: "may-ghep-go-cao-tan-khung-h",
        name: "Máy ghép gỗ cao tần khung H 8 thanh",
        shortDescription:
          "Máy ghép thanh cao tần khung H, ép keo nhanh, sản xuất ván ghép thanh chất lượng cao.",
        description:
          "Máy ghép gỗ cao tần khung H 8 thanh sử dụng công nghệ làm khô keo bằng sóng cao tần, rút ngắn thời gian ép từ 30 phút xuống còn 3 phút. Phù hợp xưởng sản xuất ván ghép, mặt bàn gỗ tự nhiên.",
        price: "415000000",
        salePrice: "389000000",
        currency: "VND",
        categorySlug: "may-ghep-go",
        categoryName: "Máy ghép gỗ",
        brand: "HF Press",
        sku: "GH-8T-HF",
        powerKw: "18.00",
        weightKg: "2500",
        dimensions: "3500 x 1800 x 1500 mm",
        warrantyMonths: 18,
        origin: "Trung Quốc",
        coverImageUrl:
          "https://images.unsplash.com/photo-1517502166878-35c93a0072f0?w=1200&q=80",
        gallery: [
          "https://images.unsplash.com/photo-1517502166878-35c93a0072f0?w=1600&q=80",
        ],
        features: [
          "Sóng cao tần 6 kW, ép keo trong 3 phút",
          "Khung H 8 thanh ép, kẹp đồng đều",
          "Bộ đếm thời gian tự động",
          "An toàn điện theo tiêu chuẩn CE",
        ],
        specs: [
          { label: "Số thanh ép", value: "8 thanh" },
          { label: "Chiều dài ván tối đa", value: "2500 mm" },
          { label: "Chiều rộng ván tối đa", value: "1300 mm" },
          { label: "Công suất cao tần", value: "6 kW" },
        ],
        inStock: true,
        featured: true,
      },
    ] as never);
    logger.info("Seeded 6 products");
  }

  const existingPosts = await db.select().from(postsTable).limit(1);
  if (existingPosts.length === 0) {
    const now = new Date();
    await db.insert(postsTable).values([
      {
        slug: "lua-chon-may-cnc-router-cho-xuong-moc",
        title:
          "Lựa chọn máy CNC Router cho xưởng mộc: 5 tiêu chí kỹ thuật cần biết",
        excerpt:
          "Trước khi đầu tư máy CNC Router, chủ xưởng cần đánh giá kích thước phôi, công suất spindle, hệ điều khiển, độ cứng khung và dịch vụ hậu mãi.",
        content:
          "Máy CNC Router là khoản đầu tư lớn của bất kỳ xưởng mộc nào. Việc chọn sai cấu hình không chỉ làm giảm năng suất mà còn ảnh hưởng tới chất lượng sản phẩm và chi phí vận hành lâu dài.\n\n1. Kích thước bàn máy: Với xưởng làm cửa và vách CNC, bàn 1300 x 2500 mm là tiêu chuẩn. Xưởng làm tủ bếp nên cân nhắc bàn 1300 x 1800 mm để tiết kiệm diện tích.\n\n2. Công suất spindle: Spindle 3.5 kW phù hợp khắc chi tiết, 5.5 kW trở lên cho cắt ván dày và chạy tốc độ cao.\n\n3. Hệ điều khiển: DSP cầm tay phù hợp xưởng nhỏ, Mach3 hoặc Syntec phù hợp sản xuất hàng loạt.\n\n4. Khung máy và dẫn hướng: Vít me bi C7, ray vuông Hiwin là tiêu chuẩn. Khung hàn dày 8 - 10 mm giảm rung.\n\n5. Dịch vụ hậu mãi: Chọn nhà cung cấp có kho phụ tùng tại Việt Nam và đội kỹ thuật phản hồi trong 24h.",
        coverImageUrl:
          "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=1600&q=80",
        author: "Phòng kỹ thuật",
        tags: ["CNC", "Tư vấn", "Kỹ thuật"],
        published: true,
        publishedAt: now,
      },
      {
        slug: "bao-tri-may-bao-cuon-dung-cach",
        title: "Hướng dẫn bảo trì máy bào cuốn 4 mặt đúng cách",
        excerpt:
          "Bảo trì định kỳ giúp máy bào cuốn duy trì độ chính xác bề mặt và kéo dài tuổi thọ trục dao.",
        content:
          "Máy bào cuốn 4 mặt là trái tim của xưởng sản xuất ván sàn và ván ghép. Lịch bảo trì khuyến nghị:\n\n- Hàng ngày: vệ sinh dăm bào, kiểm tra dầu bôi trơn xích cấp phôi.\n\n- Hàng tuần: kiểm tra độ căng dây đai, làm sạch tủ điện.\n\n- Hàng tháng: thay dầu hộp số, kiểm tra cân bằng động trục dao, mài lại lưỡi nếu cần.\n\n- Hàng quý: kiểm tra ổ bi trục chính, thay phớt nếu có dấu hiệu rò dầu.\n\nGhi chép đầy đủ vào sổ bảo trì để dễ truy vết khi có sự cố.",
        coverImageUrl:
          "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=1600&q=80",
        author: "Phòng dịch vụ",
        tags: ["Bảo trì", "Máy bào"],
        published: true,
        publishedAt: now,
      },
      {
        slug: "xu-huong-tu-dong-hoa-trong-nganh-go-2026",
        title:
          "Xu hướng tự động hóa trong ngành chế biến gỗ Việt Nam năm 2026",
        excerpt:
          "Các doanh nghiệp gỗ Việt đang đầu tư mạnh vào máy CNC, robot bốc xếp và phần mềm quản lý sản xuất để tăng sức cạnh tranh xuất khẩu.",
        content:
          "Theo Hiệp hội Gỗ và Lâm sản Việt Nam, năm 2026 ghi nhận làn sóng đầu tư tự động hóa mạnh nhất 5 năm trở lại đây. Các nhà máy quy mô vừa đang chuyển từ máy đơn lẻ sang dây chuyền liên hoàn: cưa - bào - chà nhám - sơn UV.\n\nXu hướng nổi bật:\n\n- CNC nesting thay thế cưa bàn trượt cho cắt ván công nghiệp.\n\n- Máy chà nhám thùng đa trục thay thế chà nhám thủ công.\n\n- Phần mềm MES quản lý đơn hàng đến từng máy, giảm thời gian chết.\n\nĐây là cơ hội cho các xưởng nhỏ nâng cấp thiết bị, tham gia chuỗi cung ứng xuất khẩu.",
        coverImageUrl:
          "https://images.unsplash.com/photo-1581092446327-9b52bd1570c2?w=1600&q=80",
        author: "Ban biên tập",
        tags: ["Thị trường", "Xu hướng"],
        published: true,
        publishedAt: now,
      },
    ] as never);
    logger.info("Seeded 3 posts");
  }
}
