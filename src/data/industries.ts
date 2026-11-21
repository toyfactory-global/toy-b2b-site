// Buyer-type pages. Every model ID below exists in products.json; the component
// renders price, MOQ, carton data and CBM straight from that file, so the prose
// here never has to restate a number that could drift.

export interface Industry {
  slug: string;
  nav: string;
  eyebrow: string;
  h1: string;
  lede: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  sections: { h2: string; p: string[] }[];
  faqs: { q: string; a: string }[];
  skus: string[];
  categoryHref: string;
  categoryLabel: string;
}

export const industries: Industry[] = [
  {
    slug: 'party-supplies-distributors',
    nav: 'Party & novelty',
    eyebrow: 'Buyer type 01',
    h1: 'For party and novelty distributors',
    lede:
      'Summer stock, birthday stock, Halloween stock — three seasons with different peak dates and the same problem: the cheap hero item sells out and the expensive one sits. This page is about which of our ten bubble models and fifteen water guns carry a party range without leaving dead stock behind.',
    metaTitle: 'Wholesale Bubble Machines & Water Guns for Party Distributors',
    metaDescription:
      'Party and novelty distributors: bubble machines and water guns from a Chenghai factory, MOQ from 72 pcs, real carton data and CBM for container planning.',
    keywords: 'party supplies wholesale, novelty toy distributor, wholesale bubble machines, bulk water guns, party favour toys',
    sections: [
      {
        h2: 'The three seasons, and what each one actually needs',
        p: [
          'Party stock splits by calendar, not by category. Spring and summer is outdoor water play: high unit counts, low unit price, and the cheapest thing in the box is the thing that sells. Autumn is Halloween and harvest festival, where the item is bought as a novelty rather than as a toy. Winter is birthdays and indoor parties, which is where bubble machines and light-up items earn their place.',
          'That split matters for what you order. A water gun that is right for July is dead weight in January, and a bubble machine that suits a birthday table is slow in June. Where the ranges overlap, we say so in the model table below rather than pretending every item is twelve months of demand.',
        ],
      },
      {
        h2: 'Designing a range that does not leave dead stock',
        p: [
          'The usual mistake is ordering one of everything at the minimum quantity. You end up with nine models you cannot reorder and three you cannot sell. The cheaper strategy is depth on two or three proven items and singles on the rest — the carton quantity is what decides this, because a model with 24 pieces per carton lets you test it at 24 pieces while a model with 48 does not.',
          'Every product page states pieces per carton, carton dimensions and CBM. Those three numbers are enough to work out how much of a mixed container you are committing to before you place an order, instead of after the deposit.',
        ],
      },
      {
        h2: 'What a distributor usually asks us first',
        p: [
          'Whether the minimum can be split across models rather than per model, and whether a mixed container can be loaded at the factory. The answer to the first is that minimums are set per model — they come from the carton, not from a sales policy — and the second is yes, since all four collections load from the same two ports.',
          'The second question is lead time on a reorder. Our average is twenty days from order confirmation, which is what makes a mid-season top-up possible. A supplier quoting twelve days usually means a stock item, not a production run.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Can I mix models in one order?',
        a: 'Yes. Minimums are per model because they come from the carton quantity, but nothing stops you from ordering several models at once and loading them together. Send the list and the quantities and the container is worked out from the real CBM of each carton.',
      },
      {
        q: 'Which models suit a summer party range?',
        a: 'Water guns and the higher-volume bubble machines carry most of a summer range, because the unit price stays low enough for a party favour. The table below shows the models we would start with, with their minimums and carton data.',
      },
      {
        q: 'Do you supply display cartons?',
        a: 'Packaging is quoted with the goods. If your retail customers need a display box or a shelf-ready carton, say so with the order and it is priced separately from the product — we do not pretend it is free.',
      },
      {
        q: 'How late can I reorder before a peak season?',
        a: 'Production averages twenty days from order confirmation, so the binding constraint is usually sea freight rather than the factory. Work backwards from the date you need stock on shelf, not from the date you want to order.',
      },
    ],
    skus: ['TF200892', 'TF213249', 'TF213395', 'TF211497', 'TF210969', 'TF212706'],
    categoryHref: '/category/bubble-toys',
    categoryLabel: 'Bubble toys collection',
  },
  {
    slug: 'gift-and-novelty-retailers',
    nav: 'Gift & novelty retail',
    eyebrow: 'Buyer type 02',
    h1: 'For gift shops and novelty retailers',
    lede:
      'A gift shop buys on price band and on how the item looks on a shelf, not on how many pieces fit in a container. That changes which models make sense: the ones with the lowest unit price in our catalogue are also the ones with the highest carton counts, and that trade-off is the whole decision.',
    metaTitle: 'Wholesale Novelty Toys for Gift Shops | Low Unit Price, Real Carton Data',
    metaDescription:
      'Gift shops and novelty retailers: wholesale toys from $1.58 per piece at a Chenghai factory, with packaging sizes and carton data for shelf planning.',
    keywords: 'gift shop toys wholesale, novelty toys supplier, impulse buy toys wholesale, cheap toys bulk, souvenir toys wholesale',
    sections: [
      {
        h2: 'Price bands are the real filter',
        p: [
          'A gift shop range usually needs three bands: something under two dollars that can be bought on impulse, something in the five to ten dollar range that works as a present, and one anchor item that justifies the shelf space. Our catalogue happens to cover all three, but not in the same collection.',
          'The trap is buying the cheap band only. The cheapest models carry the largest cartons, so the cash tied up in stock is often higher than a mid-price model with a smaller minimum. The model table below shows minimum, unit price and carton count side by side so you can compare cash outlay rather than unit price alone.',
        ],
      },
      {
        h2: 'Packaging size decides whether it fits the shelf',
        p: [
          'A gift shop has a fixed planogram. A box that is two centimetres too wide does not go on the shelf, it goes in a basket by the till. That is why our product pages publish the retail packaging size alongside the carton size — the first number decides whether it displays, the second decides what you pay for freight.',
          'If your fixtures are unusual, send the dimensions and we will tell you which models fit rather than letting you find out on arrival.',
        ],
      },
      {
        h2: 'Small quantities without a small-quality catalogue',
        p: [
          'Independents often assume the factory route is closed to them because of minimums. In practice the lowest minimum in our catalogue is thirty pieces, and the count of cartons is what you should actually compare: thirty pieces on that model is five cartons, while one water gun model reaches its minimum at a single carton because the carton holds sixty. Several models sit between sixty and a hundred pieces. That is a workable test order for a shop with two branches.',
          'What you cannot do at that size is customise the packaging. Packaging runs need their own minimum, so a private-label box only makes sense once the volume justifies it.',
        ],
      },
    ],
    faqs: [
      {
        q: 'What is the lowest quantity I can order?',
        a: 'Thirty pieces on the lowest-minimum model. Compare cartons rather than pieces: that particular model holds six per carton, so thirty pieces is five cartons, while one water gun model reaches its minimum at a single carton of sixty. Each product page shows the minimum next to the pieces per carton so the real commitment is visible before you order.',
      },
      {
        q: 'Can I get a mix of models for a shop test order?',
        a: 'Yes, as long as each model meets its own minimum. A six-model test order is normal for a first shipment; what is not possible is six pieces of six models, because the carton is already made.',
      },
      {
        q: 'Do you have display packaging for retail?',
        a: 'Retail cartons and display boxes are quoted with the order. Tell us the shelf dimensions you are working with and the packaging size on each product page tells you whether the item fits before you commit.',
      },
      {
        q: 'Are the toys suitable for resale as gifts?',
        a: 'The models are manufactured for retail resale, and the packaging shown in the photographs is what ships unless you order a custom box. Age marking and safety documentation are per model and per market — ask for the item number and the country.',
      },
    ],
    skus: ['TF213393', 'TF216414', 'TF212344', 'TF213143', 'TF212709', 'TF200888'],
    categoryHref: '/products',
    categoryLabel: 'Full catalogue',
  },
  {
    slug: 'online-sellers',
    nav: 'Online sellers',
    eyebrow: 'Buyer type 03',
    h1: 'For marketplace and Shopify sellers',
    lede:
      'If you sell online, the numbers that decide your margin are not the unit price. They are pieces per carton, carton weight, CBM and whether the retail box survives a parcel network. All four are published on every product page here, because guessing them is how a first order turns into a loss.',
    metaTitle: 'Wholesale Toys for Amazon & Shopify Sellers | Carton Data Published',
    metaDescription:
      'Online sellers: wholesale toys with published carton size, weight and CBM so you can calculate landed cost and FBA prep before ordering. MOQ from 30 pcs.',
    keywords: 'wholesale toys for amazon sellers, toy supplier for shopify, fba toys wholesale, bulk toys for online store',
    sections: [
      {
        h2: 'The five numbers to check before you order anything',
        p: [
          'Pieces per carton, carton dimensions, carton gross weight, CBM, and the retail packaging size. From those five you can calculate freight per unit, storage per unit and whether the item qualifies for a small-parcel rate instead of a pallet. Every product page on this site publishes all five, which is unusual — most suppliers publish the price and make you ask for the rest.',
          'If a number has not been recorded for a model, the page omits the row rather than printing a zero. That is deliberate: a zero weight is worse than no weight, because it silently produces a wrong freight quote.',
        ],
      },
      {
        h2: 'Packaging that survives a parcel network',
        p: [
          'A retail box designed for a shelf is not automatically a box designed for a courier. The failure point is usually the corner, and the fix is either a stronger board or a mailer around the retail box. Neither is free, and both are quoted separately.',
          'For marketplace sellers the practical question is whether the retail packaging can ship as-is. Ask for the packed weight and the box dimensions for the item you are considering and compare them against your carrier\u2019s limits before you commit to a container.',
        ],
      },
      {
        h2: 'Why a thirty-piece minimum matters to an online seller',
        p: [
          'Online sellers test. A model that sells on one listing may not sell on the next, and a test order that ties up five thousand dollars in one SKU is a bad test. Our lowest minimums are thirty to ninety pieces on several models, which is enough for a real listing and small enough to write off if the listing fails.',
          'Once a model proves itself, the price tiers start to matter: the per-piece price drops at higher quantities, and the discount tiers are printed on each product page rather than negotiated by email.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Can I see carton weight and CBM before ordering?',
        a: 'Yes — carton dimensions, pieces per carton, gross and net weight and CBM are published on every product page. Where a figure is missing it is omitted rather than filled with a placeholder.',
      },
      {
        q: 'Do you offer FBA prep or labelling?',
        a: 'Labelling and carton marking are quoted as part of the packaging discussion, not as a standard free service. Tell us what your marketplace requires and it is priced with the goods.',
      },
      {
        q: 'What is the smallest order for a listing test?',
        a: 'Thirty pieces on the lowest-minimum model, and several others sit between sixty and a hundred. One water gun model reaches its minimum at exactly one carton. That is enough to run a genuine listing test without committing to a container.',
      },
      {
        q: 'Can you ship small quantities by air?',
        a: 'Trade terms include FOB, CIF, EXW and CFR, and the port is Shantou or Shenzhen. For a small test order, air freight is usually arranged by the buyer\u2019s forwarder; we quote the ex-works or FOB price and you choose the route.',
      },
    ],
    skus: ['TF213415', 'TF213301', 'TF212706', 'TF169193', 'TF210951', 'TF213184'],
    categoryHref: '/products',
    categoryLabel: 'Full catalogue',
  },
  {
    slug: 'schools-and-educational-distributors',
    nav: 'Schools & education',
    eyebrow: 'Buyer type 04',
    h1: 'For schools and educational distributors',
    lede:
      'Educational buyers order against a budget and a term date, not against a trend. That makes two things matter more than price: whether the item survives a classroom, and whether the supplier can hit a delivery window that is set by a school calendar rather than by a shipping schedule.',
    metaTitle: 'Wholesale Educational Toys for Schools & Distributors',
    metaDescription:
      'Educational toys for schools, kindergartens and catalogue distributors. Seven models with published carton data, MOQ from 50 pcs, from a Chenghai factory.',
    keywords: 'educational toys wholesale, school supplies toys bulk, kindergarten toys supplier, STEM toys distributor, classroom toys wholesale',
    sections: [
      {
        h2: 'Budget cycles, not selling seasons',
        p: [
          'A school buys in a budget window and needs delivery before a term starts. A distributor selling to schools needs the same thing one step earlier. Both are badly served by a supplier whose lead time moves, which is why the twenty-day average matters more here than a low unit price.',
          'The practical consequence: order against the term date, not against your stock level. If the term starts in September, the order needs to be on the water in July, which means confirming in June.',
        ],
      },
      {
        h2: 'What actually breaks in a classroom',
        p: [
          'Small parts, thin hinges and anything that relies on a friction fit. A toy that survives a home survives a classroom; a toy that survives a classroom survives a home. Where a model has small parts, the packaging artwork states an age, and that age is a manufacturing fact rather than a recommendation.',
          'We publish the age marking only where it is printed on the supplier artwork. If a model has no age marking, the page says nothing rather than inventing one — a school buyer checking a purchase order needs the real figure.',
        ],
      },
      {
        h2: 'Buying against a catalogue, not a container',
        p: [
          'Institutional buyers work from catalogues and framework agreements, which means repeat orders on the same item number over several years. That is the opposite of the novelty market and it suits a factory: a mould that stays in production stays cheap.',
          'If you supply a catalogue, tell us which models you intend to keep in print and we will quote them as a repeating line rather than as a one-off shipment.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Do the educational models carry age markings?',
        a: 'Where the supplier artwork prints an age, it is published on the product page. Where it does not, the page omits it rather than guessing. For a school purchase order, ask for the specific item number and the destination country.',
      },
      {
        q: 'Can you supply against a term deadline?',
        a: 'Production averages twenty days from order confirmation. The binding constraint is sea freight and customs, so the order date should be worked back from the term start rather than from a stock decision.',
      },
      {
        q: 'Is there a discount for repeat annual orders?',
        a: 'Pricing is tiered by quantity and the tiers are printed on each product page. A repeating annual line is quoted as such — the advantage is continuity of the mould, not a secret price.',
      },
      {
        q: 'Do you supply sample sets for evaluation?',
        a: 'Samples are charged at the unit price and the courier is paid by the buyer. The sample fee is credited back against a first production order of five cartons or more; the courier cost is not credited.',
      },
    ],
    skus: ['TF169001', 'TF208799', 'TF211030', 'TF213184', 'TF169193', 'TF197926'],
    categoryHref: '/category/educational-toys',
    categoryLabel: 'Educational toys collection',
  },
  {
    slug: 'private-label-brands',
    nav: 'Private label',
    eyebrow: 'Buyer type 05',
    h1: 'For brands building a private label range',
    lede:
      'A private label project is not a product order with a logo on it. It is a tooling decision, a packaging decision and a documentation decision, in that order — and each one has a different minimum. This page sets out what we can do in house and what we cannot, before you spend money on artwork.',
    metaTitle: 'Private Label Toys | OEM & ODM from a Chenghai Factory',
    metaDescription:
      'Private label toy manufacturing: light customisation, sample-based builds and artwork-based ODM, with a 7-day shortest sample and in-house design on CAD.',
    keywords: 'private label toys, custom toy manufacturer, OEM toys China, white label toys, custom branded toys',
    sections: [
      {
        h2: 'Three routes, three different costs',
        p: [
          'Light customisation keeps the existing mould and changes colour, decoration or labelling. It is the cheapest route because nothing is retooled, and it is what most first private label ranges actually need. Customisation from your sample rebuilds an existing item to your version. Customisation from your artwork starts from design rather than from a physical object.',
          'The routes are quoted separately because the tooling differs. If a supplier gives you one price for "custom", ask which route it covers — usually it is the first one, and the artwork you sent assumes the third.',
        ],
      },
      {
        h2: 'Who does the design work, and whose CAD is it',
        p: [
          'Two design engineers work in house on CAD, which is what makes an artwork-based project possible without a third party in the middle. The shortest recorded time from brief to a launched product is twenty days, and part of the designed products are tested by a third party rather than by us.',
          'Ask for the tooling ownership clause in writing before the project starts. Whether you or the factory owns a mould you paid for is a commercial term, not a technical one, and it belongs in the quotation.',
        ],
      },
      {
        h2: 'The packaging is usually the long pole',
        p: [
          'Product tooling is often quicker than packaging approval. Retail cartons, display boxes, barcode data, age marking and private label artwork all have to be approved before a production run starts, and each one can send the file back for a second round.',
          'Send the artwork, the barcode data and the carton marking in one go. Projects that stall are almost always waiting on a packaging file, not on the mould.',
        ],
      },
    ],
    faqs: [
      {
        q: 'What is the minimum for a private label order?',
        a: 'It depends on the route. Light customisation follows the model\u2019s normal minimum, which runs from thirty to several hundred pieces depending on the item. A new mould is quoted separately, because tooling changes the economics entirely.',
      },
      {
        q: 'How fast is a sample for a custom project?',
        a: 'The shortest sample turnaround recorded in the factory assessment is seven days. Samples are charged at the unit price and the courier is paid by the buyer; the sample fee is credited against a first order of five cartons or more.',
      },
      {
        q: 'Can you design from artwork rather than a physical sample?',
        a: 'Yes — that is the third route, and it is done in house on CAD by the two design engineers. It is also the route that needs the most approval rounds, so allow for that in the timeline.',
      },
      {
        q: 'Do you handle certification for a private label item?',
        a: 'Testing scope varies by model and by destination market. Tell us the item and the country and you get a written answer about what exists for that combination. We do not claim a blanket certificate for a catalogue, and we advise getting the answer before the artwork is finalised.',
      },
    ],
    skus: ['TF211527', 'TF211082', 'TF208740', 'TF212336', 'TF213426', 'TF211526'],
    categoryHref: '/oem-odm',
    categoryLabel: 'OEM / ODM process',
  },
  {
    slug: 'wholesale-distributors',
    nav: 'Wholesale distributors',
    eyebrow: 'Buyer type 06',
    h1: 'For wholesalers filling mixed containers',
    lede:
      'A wholesaler\u2019s problem is not picking a product, it is filling a container without over-ordering any single line. That is arithmetic on carton CBM, and it only works if the supplier publishes real carton data instead of a rounded guess.',
    metaTitle: 'Wholesale Toy Distributors | Mixed Container Loading from Chenghai',
    metaDescription:
      'Wholesale toy distributor supply: mixed containers across four collections, published CBM per carton, tiered pricing and loading from Shantou or Shenzhen.',
    keywords: 'wholesale toy distributor, mixed container toys, bulk toy supplier China, toy importer wholesale, FCL toy supplier',
    sections: [
      {
        h2: 'Filling a container is a CBM problem',
        p: [
          'A forty-foot high cube holds roughly sixty-eight cubic metres of usable space. Divide that by the CBM of each carton and you get the number of cartons, then multiply by pieces per carton. Every product page on this site publishes the CBM, so the calculation can be done before an order exists.',
          'The mistake is to plan by unit count instead of by volume. A model with a large retail box can fill a container at half the piece count you budgeted for, and the freight per unit doubles without anyone noticing until the loading list arrives.',
        ],
      },
      {
        h2: 'Why mixed loads need a real carton count, not an average',
        p: [
          'Mixing six models means six different carton sizes. Averaging them produces a number that is wrong in both directions — over on one line, short on another. The only reliable method is to build the loading list from the actual carton dimensions of each model, which is what the calculator on this site does.',
          'It also tells you when you have crossed from a partial load into a full container, which is the point where the freight per unit changes shape.',
        ],
      },
      {
        h2: 'Tiered pricing, printed rather than negotiated',
        p: [
          'Each product page shows the quantity tiers and the price at each tier. A distributor buying across models can see immediately which lines are worth deepening and which are worth keeping at minimum.',
          'Payment can be made by L/C, T/T, PayPal, Western Union, credit card, cash or MoneyGram, on FOB, CIF, EXW or CFR terms. The combination that applies to your order is fixed on the quotation and repeated on the invoice.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Can you load a mixed container from several collections?',
        a: 'Yes. All four collections load from Shantou or Shenzhen, so a mixed container across bubble toys, water guns, track toys and educational toys is normal rather than an exception.',
      },
      {
        q: 'How do I calculate how many cartons fit?',
        a: 'Take the usable volume of the container, divide by the CBM of the carton, then multiply by the pieces per carton. The CBM for every model is published on its product page, and the container calculator on this site does the arithmetic for a mixed list.',
      },
      {
        q: 'What are the payment terms for a first order?',
        a: 'L/C, T/T, PayPal, Western Union, credit card, cash and MoneyGram are all accepted, and the split between deposit and balance is agreed on the quotation. The terms are repeated on the invoice so there is no ambiguity later.',
      },
      {
        q: 'Do you quote a discount for a full container?',
        a: 'Pricing is tiered by quantity per model, and the tiers are printed on each product page. A full container usually reaches the higher tiers on several lines at once, which is where the discount actually comes from.',
      },
    ],
    skus: ['TF211091', 'TF210951', 'TF210965', 'TF197926', 'TF214357', 'TF213303'],
    categoryHref: '/products',
    categoryLabel: 'Full catalogue',
  },
];
