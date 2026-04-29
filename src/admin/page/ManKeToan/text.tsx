export const STATUS_OPTIONS = [
  { value: "UNPAID", label: "Chưa thanh toán", color: "#ff4d4f", tagColor: "red" },
  { value: "INVOICE_HAS_BEEN_ISSUED", label: "Đã xuất hóa đơn", color: "#1677ff", tagColor: "blue" },
  { value: "GENERATED", label: "Đã tạo hóa đơn", color: "#52c41a", tagColor: "green" },
];

export const STATUS_COLOR: Record<string, string> = Object.fromEntries(
  STATUS_OPTIONS.map((s) => [s.value, s.color])
);

export const STATUS_LABEL: Record<string, string> = Object.fromEntries(
  STATUS_OPTIONS.map((s) => [s.value, s.label])
);

export const STATUS_TAG_COLOR: Record<string, string> = Object.fromEntries(
  STATUS_OPTIONS.map((s) => [s.value, s.tagColor])
);