/* The systems SKY Tech licenses, for the Products page.

   Every capability listed here is one that appears in the product's own
   screenshot — a module in its sidebar, a figure on its dashboard, a state in
   one of its pipelines. Nothing describes a feature that could not be pointed
   at in the picture beside it, and nothing here claims a result: no customer
   counts, no savings, no uptime. A reader can check every line against the
   screenshot, which is the only reason to put a screenshot there at all.

   `shot` is a WebP in public/products/, built by scripts/build-product-shots.mjs
   from the supplied screenshots. Width and height are the built file's own, so
   the frame reserves its space before the image arrives and the section never
   reflows.

   Adding a product: add its screenshot to the script's SHOTS map, re-run it,
   and add an entry here. Order is the order they appear. */

export type Product = {
  /** Stable id, used in the anchor and in the demo request. */
  slug: string;
  /** Index shown beside the name. Two digits, as elsewhere on the site. */
  index: string;
  name: string;
  /** What kind of system it is, in three or four words. */
  category: string;
  /** Who it is for, so a reader can stop reading if it is not them. Named by
      the kind of business, never by a client. */
  audience: string;
  /** One sentence, said plainly. */
  summary: string;
  /** Two short paragraphs introducing it. */
  body: readonly string[];
  /** What it does. Each one visible in the screenshot. */
  capabilities: readonly string[];
  shot: string;
  shotWidth: number;
  shotHeight: number;
  /** Described for a reader who cannot see it. */
  shotAlt: string;
};

export const PRODUCTS: readonly Product[] = [
  {
    slug: "dotpro-erp",
    index: "01",
    name: "DotPro ERP",
    category: "Business Management",
    audience:
      "For trading, distribution and manufacturing businesses running more than one branch.",
    summary: "A whole back office in one system, with every branch posting to the same ledger.",
    body: [
      "Most businesses run their money in one place, their stock in another and their people in a third, then spend the month reconciling the three. DotPro ERP puts them in one system, so a purchase order, the goods that arrive against it, the bill that follows and the payment that settles it are the same record at four stages of its life.",
      "It is built for how business is actually done here: cheques and post-dated cheques are tracked as first-class instruments, amounts are in rupees, and a group with several branches switches between them without leaving the ledger.",
    ],
    capabilities: [
      "Finance — receivables, payables, vouchers and expense accounts",
      "Cheques and post-dated cheques tracked to clearance",
      "Inventory with reorder-level alerts on every item",
      "Purchasing, from purchase order through goods receipt to bill",
      "Sales and billing against the same item and customer records",
      "Fixed assets carried at net book value",
      "HRMS and payroll",
      "Approval chains before a document takes effect",
      "Multi-branch, with head office and each location in one view",
    ],
    shot: "dotpro-erp",
    shotWidth: 1600,
    shotHeight: 756,
    shotAlt:
      "The DotPro ERP dashboard: receivables, payables, inventory value and fixed assets across the top, a sales-versus-purchases chart and an expense breakdown below, with quick actions for invoices, purchase orders and vouchers down the right.",
  },
  {
    slug: "dotpro-school",
    index: "02",
    name: "DotPro School",
    category: "Education Management",
    audience:
      "For schools, colleges and academies handling admissions, fees and results.",
    summary: "Runs a school from the first enquiry to the final result sheet.",
    body: [
      "A school's records tend to live in whoever's head or spreadsheet they started in — admissions with one person, fees with another, results with a third. DotPro School holds the whole student record in one place and lets each office work on its own part of it.",
      "The admissions pipeline is the spine: an enquiry becomes an entry test, an entry test becomes an approval and a voucher, and a paid voucher becomes an enrolled student whose fees, attendance, timetable and results all hang off that one record.",
    ],
    capabilities: [
      "Admissions pipeline — enquiry, entry test, approval, enrolment",
      "Student records, classes and sections",
      "Fee collection, with outstanding dues visible at all times",
      "Timetable, lesson plans and syllabus tracking",
      "Exams, results and online tests, with a mock exam bank",
      "Online classes and a digital book shelf",
      "Library issue and return, and lab management",
      "Staff records and daily attendance",
    ],
    shot: "dotpro-school",
    shotWidth: 1600,
    shotHeight: 758,
    shotAlt:
      "The DotPro School dashboard: active students, staff, fees collected and pending admissions across the top, fees due and attendance below, a fourteen-day fee collection chart and an admissions pipeline showing applications in review, approved, enrolled and waitlisted.",
  },
  {
    slug: "inventory",
    index: "03",
    name: "DotPro Inventory",
    category: "Warehouse & Stock Control",
    audience:
      "For warehouses and distributors whose stock is tracked by unit, not only by count.",
    summary:
      "Stock control down to the individual unit — not how many you have, but which ones, and where.",
    body: [
      "Counting stock by quantity works until the units stop being interchangeable. A sealed drum and one that has been opened are not the same thing, and a system that reports two of an item when one of them is half-used will be wrong at the worst moment.",
      "DotPro Inventory tags units individually. Each one has its own identity, its own location and its own state, so the stock figure and the shelf agree — and a reservation against an order holds a specific unit rather than a number.",
    ],
    capabilities: [
      "Several warehouses, each with named storage locations",
      "Item master with categories, tags and units of measure",
      "Unit-level tagging — each unit tracked as sealed or part-open",
      "Stock reservations that hold specific units against an order",
      "Vendors and purchase orders",
      "Goods receipt recorded against the order it fulfils",
      "Every movement in and out kept as a ledger entry",
      "Transfers between warehouses, and adjustments with a stated reason",
    ],
    shot: "inventory",
    shotWidth: 1600,
    shotHeight: 762,
    shotAlt:
      "The DotPro Inventory dashboard: warehouses and items in use across the top with sealed and part-open unit counts, a fourteen-day stock movement chart of quantities in versus out, a unit status breakdown, and in-stock quantity by warehouse.",
  },
  {
    slug: "quran-academy",
    index: "04",
    name: "Quran Academy Portal",
    category: "Online Learning Portal",
    audience:
      "For online academies teaching one to one across time zones.",
    summary: "A complete online academy — the public site, the plans and the student sign-up.",
    body: [
      "Teaching one-to-one across time zones is a scheduling problem before it is a teaching one. The portal handles the part that happens before the first class: what is taught, what it costs, who is teaching it, and how a family in another country signs up without a phone call.",
      "The public site carries the course structure — Nazra, Hifz, Tajweed and Tafseer — alongside Quran, Hadees and Kalma reference sections, so a visitor can read something useful before deciding whether to enrol.",
    ],
    capabilities: [
      "Nazra, Hifz, Tajweed and Tafseer course structures",
      "One-to-one live video classes",
      "Plans, pricing and free-trial sign-up",
      "Student and teacher accounts",
      "Quran, Hadees and Kalma reference sections",
      "Scheduling that works across family time zones",
      "Enquiry and contact routing to the academy",
    ],
    shot: "quran-academy",
    shotWidth: 1600,
    shotHeight: 763,
    shotAlt:
      "The Quran Academy portal's home page: a green and gold layout with navigation for Quran, Hadees, Kalmas and Plans, a headline about learning the Quran online with certified teachers, and calls to action for a free trial and the plans page.",
  },
  {
    slug: "restaurant-pos",
    index: "05",
    name: "DotPro POS",
    category: "Restaurant Operations",
    audience:
      "For restaurants and cafes running dine-in, takeaway and delivery together.",
    summary: "The floor, the kitchen and the stock room on one screen.",
    body: [
      "An order taken at a table has to reach the kitchen, come back as food, be paid for, and quietly reduce the flour and oil it consumed. Most restaurants do the first three in one system and the fourth at the end of the month, by counting.",
      "DotPro POS does all four as one movement. Dine-in, takeaway and delivery run through the same order book, the kitchen sees each ticket as it is raised, and raw materials draw down as orders complete — so the day's takings and the day's consumption are two views of the same evening.",
    ],
    capabilities: [
      "Point of sale for dine-in, takeaway and delivery",
      "Table plan with live table status",
      "Kitchen display, with each order tracked to completion",
      "Riders assigned to delivery orders",
      "Raw-material inventory that draws down as orders complete",
      "Suppliers, purchase orders and supplier payments",
      "Stock transfers and adjustments",
      "Takings split by dine-in, takeaway and online",
    ],
    shot: "restaurant-pos",
    shotWidth: 1600,
    shotHeight: 757,
    shotAlt:
      "The DotPro POS dashboard for the current day: tables free, orders pending and completed, riders out and income across the top, dine-in, takeaway and online order totals below, and a table of the day's orders.",
  },
];

/* Where the demo button goes. The contact form reads `type` and fills in what
   it can, so a demo request arrives already knowing which product it is for
   rather than as a message someone has to interpret. */
export const demoHref = (product: Product) =>
  `/contact?type=demo&product=${encodeURIComponent(product.name)}#contact-form`;
