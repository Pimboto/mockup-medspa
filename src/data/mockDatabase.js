const { v4: uuidv4 } = require('uuid');

// Mock database - In production, this would be a real database
const mockDatabase = {
  bookings: [
    {
      id: uuidv4(),
      clientName: "Sarah Johnson",
      clientEmail: "sarah.j@email.com",
      clientPhone: "+1-555-0101",
      service: "Botox Treatment",
      serviceId: "srv_001",
      date: "2024-12-20",
      time: "10:00",
      duration: 60,
      price: 450,
      depositAmount: 90,
      depositPaid: true,
      status: "confirmed",
      notes: "First time client, referred by Dr. Smith",
      createdAt: new Date("2024-12-15T09:00:00Z").toISOString(),
      updatedAt: new Date("2024-12-15T09:00:00Z").toISOString()
    },
    {
      id: uuidv4(),
      clientName: "Michael Chen",
      clientEmail: "m.chen@email.com",
      clientPhone: "+1-555-0102",
      service: "Hydrafacial",
      serviceId: "srv_002",
      date: "2024-12-20",
      time: "14:00",
      duration: 90,
      price: 250,
      depositAmount: 50,
      depositPaid: true,
      status: "confirmed",
      notes: "Regular client, sensitive skin",
      createdAt: new Date("2024-12-14T10:00:00Z").toISOString(),
      updatedAt: new Date("2024-12-14T10:00:00Z").toISOString()
    },
    {
      id: uuidv4(),
      clientName: "Emma Wilson",
      clientEmail: "emma.w@email.com",
      clientPhone: "+1-555-0103",
      service: "Laser Hair Removal",
      serviceId: "srv_003",
      date: "2024-12-21",
      time: "11:00",
      duration: 120,
      price: 600,
      depositAmount: 120,
      depositPaid: false,
      status: "pending",
      notes: "Needs to pay deposit",
      createdAt: new Date("2024-12-16T14:00:00Z").toISOString(),
      updatedAt: new Date("2024-12-16T14:00:00Z").toISOString()
    },
    {
      id: uuidv4(),
      clientName: "David Martinez",
      clientEmail: "d.martinez@email.com",
      clientPhone: "+1-555-0104",
      service: "Chemical Peel",
      serviceId: "srv_004",
      date: "2024-12-21",
      time: "15:00",
      duration: 60,
      price: 350,
      depositAmount: 70,
      depositPaid: true,
      status: "confirmed",
      notes: "Allergic to certain chemicals - check chart",
      createdAt: new Date("2024-12-13T11:00:00Z").toISOString(),
      updatedAt: new Date("2024-12-13T11:00:00Z").toISOString()
    },
    {
      id: uuidv4(),
      clientName: "Lisa Anderson",
      clientEmail: "lisa.a@email.com",
      clientPhone: "+1-555-0105",
      service: "Microneedling",
      serviceId: "srv_005",
      date: "2024-12-22",
      time: "09:00",
      duration: 75,
      price: 400,
      depositAmount: 80,
      depositPaid: true,
      status: "confirmed",
      notes: "VIP client",
      createdAt: new Date("2024-12-10T08:00:00Z").toISOString(),
      updatedAt: new Date("2024-12-10T08:00:00Z").toISOString()
    },
    {
      id: uuidv4(),
      clientName: "Robert Taylor",
      clientEmail: "r.taylor@email.com",
      clientPhone: "+1-555-0106",
      service: "Dermal Fillers",
      serviceId: "srv_006",
      date: "2024-12-22",
      time: "13:00",
      duration: 90,
      price: 800,
      depositAmount: 160,
      depositPaid: true,
      status: "cancelled",
      notes: "Cancelled due to emergency",
      createdAt: new Date("2024-12-11T10:00:00Z").toISOString(),
      updatedAt: new Date("2024-12-17T09:00:00Z").toISOString(),
      cancelledAt: new Date("2024-12-17T09:00:00Z").toISOString()
    }
  ],
  services: [
    {
      "id": "srv_001",
      "name": "Botox Treatment",
      "category": "Injectables",
      "shortDescription": "Reduce fine lines and wrinkles with Botox.",
      "longDescription": "Neuromodulator injections to soften dynamic wrinkles such as frown lines, forehead lines, and crow's feet. Results typically appear within 3–7 days and last 3–4 months.",
      "media": {
        "coverImageUrl": "",
        "galleryIds": []
      },
      "pricing": {
        "currency": "USD",
        "pricingModel": "PER_UNIT",
        "unitLabel": "unit",
        "basePrice": null,
        "unitPrice": 13,
        "tiers": [
          { "minUnits": 20, "unitPrice": 12.5 },
          { "minUnits": 40, "unitPrice": 12 }
        ],
        "packages": [
          {
            "id": "btw_qtr_refresh",
            "name": "Quarterly Refresh",
            "appliesTo": "WHOLE_SERVICE",
            "discountType": "PERCENT",
            "discountValue": 10,
            "sessions": 3,
            "transferable": false,
            "expirationDays": 365
          }
        ],
        "membershipAdjustments": [
          { "membershipId": "mbr_glow", "type": "PERCENT", "value": 10 }
        ],
        "providerLevelAdjustments": [
          { "level": "RN", "type": "PERCENT", "value": 0 },
          { "level": "NP", "type": "PERCENT", "value": 5 },
          { "level": "MD", "type": "PERCENT", "value": 10 }
        ],
        "taxable": true
      },
      "booking": {
        "durationMinutes": 30,
        "prepBufferMinutes": 5,
        "cleanupBufferMinutes": 5,
        "leadTimeHoursMin": 2,
        "cancellationPolicyId": "can_24h",
        "deposit": {
          "required": false,
          "type": "PERCENT",
          "value": 20,
          "appliesTo": "ORDER",
          "refundableWindowHours": 24
        },
        "onlineBookable": true,
        "maxGuests": 1
      },
      "clinical": {
        "expectedDowntime": "None; mild redness or bumps for 15–60 minutes",
        "contraindications": [
          "Pregnancy or breastfeeding",
          "Active infection at injection site",
          "Neuromuscular disorders (consult provider)"
        ],
        "preCare": [
          "Avoid blood-thinning supplements 24–48 hours prior",
          "Arrive makeup-free if possible"
        ],
        "postCare": [
          "Remain upright for 4 hours",
          "Avoid rubbing the area for 24 hours",
          "No strenuous exercise for 24 hours"
        ],
        "followUpNeeded": true,
        "followUpWindowDays": 14
      },
      "availability": {
        "locations": [
          { "id": "loc_lake_worth", "enabled": true },
          { "id": "loc_west_palm", "enabled": true }
        ],
        "resources": [
          { "type": "ROOM", "id": "room_inject_1" }
        ],
        "providerLevelsAllowed": ["RN", "NP", "MD"]
      },
      "commerce": {
        "sku": "BOTOX",
        "upsells": [
          { "serviceId": "srv_006", "label": "Pair with Dermal Filler" }
        ],
        "addons": [
          { "id": "adn_numbing", "name": "Topical numbing", "price": 25, "durationMinutes": 10 }
        ],
        "giftCardEligible": true
      },
      "compliance": {
        "consentFormId": "consent_injectables",
        "hipaaSensitive": true
      },
      "status": { "available": true, "visible": true },
      "seo": { "slug": "botox", "keywords": ["botox","wrinkle relaxer","neuromodulator"] },
      "i18n": { "defaultLocale": "en-US", "supported": ["en-US","es-ES"] },
      "version": 2
    },
    {
      "id": "srv_002",
      "name": "Hydrafacial",
      "category": "Facials",
      "shortDescription": "Deep cleanse, exfoliate, and hydrate.",
      "longDescription": "A multi-step facial that uses vortex technology to cleanse, extract, and infuse skin with hydrating serums for an instant glow and smoother texture.",
      "media": {
        "coverImageUrl": "",
        "galleryIds": []
      },
      "pricing": {
        "currency": "USD",
        "pricingModel": "FLAT",
        "basePrice": 250,
        "packages": [
          {
            "id": "hf_series3",
            "name": "Series of 3",
            "appliesTo": "WHOLE_SERVICE",
            "discountType": "PERCENT",
            "discountValue": 10,
            "sessions": 3,
            "transferable": false,
            "expirationDays": 180
          }
        ],
        "membershipAdjustments": [
          { "membershipId": "mbr_glow", "type": "PERCENT", "value": 10 }
        ],
        "providerLevelAdjustments": [],
        "taxable": true
      },
      "booking": {
        "durationMinutes": 60,
        "prepBufferMinutes": 5,
        "cleanupBufferMinutes": 5,
        "leadTimeHoursMin": 2,
        "cancellationPolicyId": "can_24h",
        "deposit": {
          "required": false,
          "type": "PERCENT",
          "value": 20,
          "appliesTo": "ORDER",
          "refundableWindowHours": 24
        },
        "onlineBookable": true,
        "maxGuests": 1
      },
      "clinical": {
        "expectedDowntime": "None",
        "contraindications": [
          "Active rash or sunburn",
          "Accutane within 6 months"
        ],
        "preCare": [
          "Avoid retinoids 48 hours prior",
          "Arrive without heavy makeup"
        ],
        "postCare": [
          "Use SPF 30+ daily",
          "Avoid exfoliants for 48 hours"
        ],
        "followUpNeeded": false
      },
      "availability": {
        "locations": [
          { "id": "loc_lake_worth", "enabled": true },
          { "id": "loc_boynton_beach", "enabled": true }
        ],
        "resources": [
          { "type": "MACHINE", "id": "hydrafacial_01" },
          { "type": "ROOM", "id": "room_facial_a" }
        ],
        "providerLevelsAllowed": ["Esthetician", "RN"]
      },
      "commerce": {
        "sku": "HYDRA",
        "upsells": [
          { "serviceId": "srv_005", "label": "Add Microneedling for texture" }
        ],
        "addons": [
          { "id": "adn_booster", "name": "Booster Serum", "price": 45, "durationMinutes": 0 },
          { "id": "adn_neck", "name": "Neck Add-On", "price": 60, "durationMinutes": 10 }
        ],
        "giftCardEligible": true
      },
      "compliance": {
        "consentFormId": "consent_facial",
        "hipaaSensitive": false
      },
      "status": { "available": true, "visible": true },
      "seo": { "slug": "hydrafacial", "keywords": ["hydrafacial","deep cleanse","hydration facial"] },
      "i18n": { "defaultLocale": "en-US", "supported": ["en-US","es-ES"] },
      "version": 2
    },
    {
      "id": "srv_003",
      "name": "Laser Hair Removal",
      "category": "Laser Treatments",
      "shortDescription": "Permanent hair reduction with medical-grade laser.",
      "longDescription": "Targets hair follicles to reduce growth. Safe for most skin types with minimal downtime.",
      "media": {
        "coverImageUrl": "",
        "galleryIds": []
      },
      "pricing": {
        "currency": "USD",
        "pricingModel": "PER_AREA",
        "basePrice": null,
        "areas": [
          { "id": "area_small_upper_lip", "name": "Upper Lip", "price": 90 },
          { "id": "area_small_chin", "name": "Chin", "price": 110 },
          { "id": "area_medium_underarms", "name": "Underarms", "price": 180 },
          { "id": "area_medium_bikini", "name": "Bikini", "price": 220 },
          { "id": "area_large_legs", "name": "Full Legs", "price": 520 },
          { "id": "area_large_back", "name": "Back", "price": 600 }
        ],
        "packages": [
          {
            "id": "pkg_series6",
            "name": "Series of 6",
            "appliesTo": "AREAS",
            "discountType": "PERCENT",
            "discountValue": 15,
            "sessions": 6,
            "transferable": false,
            "expirationDays": 365
          },
          {
            "id": "pkg_series8",
            "name": "Series of 8",
            "appliesTo": "AREAS",
            "discountType": "PERCENT",
            "discountValue": 22,
            "sessions": 8,
            "transferable": false,
            "expirationDays": 540
          }
        ],
        "membershipAdjustments": [
          { "membershipId": "mbr_glow", "type": "PERCENT", "value": 10 }
        ],
        "providerLevelAdjustments": [
          { "level": "RN", "type": "PERCENT", "value": 0 },
          { "level": "NP", "type": "PERCENT", "value": 10 }
        ],
        "taxable": true
      },
      "booking": {
        "durationMinutes": 30,
        "durationPerAdditionalArea": 10,
        "prepBufferMinutes": 5,
        "cleanupBufferMinutes": 5,
        "leadTimeHoursMin": 2,
        "cancellationPolicyId": "can_24h",
        "deposit": {
          "required": false,
          "type": "PERCENT",
          "value": 20,
          "appliesTo": "ORDER",
          "refundableWindowHours": 24
        },
        "onlineBookable": true,
        "maxGuests": 1
      },
      "clinical": {
        "device": "Diode 810nm",
        "skinTypes": "Fitzpatrick I–V",
        "sessionsRecommendedMin": 6,
        "sessionsRecommendedMax": 8,
        "sessionCadenceDaysMin": 28,
        "expectedDowntime": "None to mild redness for a few hours",
        "contraindications": [
          "Recent sun exposure or tanning",
          "Active skin infection or open wounds",
          "Photosensitizing medications"
        ],
        "preCare": [
          "Shave treatment area 24 hours prior",
          "Avoid sun exposure/self-tanner for 2 weeks"
        ],
        "postCare": [
          "Apply SPF 30+ daily",
          "Avoid hot tubs/saunas for 24–48 hours"
        ],
        "followUpNeeded": false
      },
      "availability": {
        "locations": [
          { "id": "loc_lake_worth", "enabled": true },
          { "id": "loc_royal_palm", "enabled": false }
        ],
        "resources": [
          { "type": "MACHINE", "id": "laser_01" },
          { "type": "ROOM", "id": "room_laser_a" }
        ],
        "providerLevelsAllowed": ["RN", "NP"]
      },
      "commerce": {
        "sku": "LHR",
        "upsells": [
          { "serviceId": "srv_007", "label": "Add IPL for discoloration", "position": "POST_BOOK" },
          { "addonId": "adn_numbing", "label": "Topical numbing" }
        ],
        "addons": [
          { "id": "adn_numbing", "name": "Topical numbing", "price": 25, "durationMinutes": 10 },
          { "id": "adn_neck", "name": "Add Neck", "price": 95, "durationMinutes": 10 }
        ],
        "giftCardEligible": true
      },
      "compliance": {
        "consentFormId": "consent_laser",
        "hipaaSensitive": true
      },
      "status": { "available": true, "visible": true },
      "seo": { "slug": "laser-hair-removal", "keywords": ["laser hair removal","permanent hair reduction"] },
      "i18n": { "defaultLocale": "en-US", "supported": ["en-US","es-ES"] },
      "version": 2
    },
    {
      "id": "srv_004",
      "name": "Chemical Peel",
      "category": "Skin Treatments",
      "shortDescription": "Medical-grade peel to improve texture and tone.",
      "longDescription": "Customized chemical exfoliation to address dullness, fine lines, and discoloration. Options range from light to medium depth based on skin needs and downtime tolerance.",
      "media": {
        "coverImageUrl": "",
        "galleryIds": []
      },
      "pricing": {
        "currency": "USD",
        "pricingModel": "STARTING_AT",
        "basePrice": 250,
        "variants": [
          { "id": "peel_light", "name": "Light Peel", "price": 250 },
          { "id": "peel_medium", "name": "Medium Peel", "price": 350 },
          { "id": "peel_plus", "name": "Brightening Plus", "price": 425 }
        ],
        "packages": [
          {
            "id": "peel_series3",
            "name": "Series of 3",
            "appliesTo": "WHOLE_SERVICE",
            "discountType": "PERCENT",
            "discountValue": 15,
            "sessions": 3,
            "transferable": false,
            "expirationDays": 210
          }
        ],
        "membershipAdjustments": [
          { "membershipId": "mbr_glow", "type": "PERCENT", "value": 10 }
        ],
        "providerLevelAdjustments": [
          { "level": "Esthetician", "type": "PERCENT", "value": 0 },
          { "level": "RN", "type": "PERCENT", "value": 5 }
        ],
        "taxable": true
      },
      "booking": {
        "durationMinutes": 45,
        "prepBufferMinutes": 5,
        "cleanupBufferMinutes": 10,
        "leadTimeHoursMin": 2,
        "cancellationPolicyId": "can_24h",
        "deposit": {
          "required": false,
          "type": "PERCENT",
          "value": 20,
          "appliesTo": "ORDER",
          "refundableWindowHours": 24
        },
        "onlineBookable": true,
        "maxGuests": 1
      },
      "clinical": {
        "expectedDowntime": "Light flaking to moderate peeling for 2–5 days depending on depth",
        "contraindications": [
          "Accutane within 6 months",
          "Active cold sores or open lesions",
          "Recent waxing or laser in treatment area"
        ],
        "preCare": [
          "Pause retinoids/acids 5–7 days prior",
          "Avoid sun exposure for 1 week prior"
        ],
        "postCare": [
          "Do not pick/peel flaking skin",
          "Use bland moisturizer and SPF 30+",
          "Avoid heat/exercise 24–48 hours"
        ],
        "followUpNeeded": false
      },
      "availability": {
        "locations": [
          { "id": "loc_lake_worth", "enabled": true }
        ],
        "resources": [
          { "type": "ROOM", "id": "room_skin_1" }
        ],
        "providerLevelsAllowed": ["Esthetician", "RN"]
      },
      "commerce": {
        "sku": "PEEL",
        "upsells": [
          { "serviceId": "srv_007", "label": "Add IPL for pigmentation" }
        ],
        "addons": [],
        "giftCardEligible": true
      },
      "compliance": {
        "consentFormId": "consent_peel",
        "hipaaSensitive": false
      },
      "status": { "available": true, "visible": true },
      "seo": { "slug": "chemical-peel", "keywords": ["chemical peel","exfoliation","brightening"] },
      "i18n": { "defaultLocale": "en-US", "supported": ["en-US","es-ES"] },
      "version": 2
    },
    {
      "id": "srv_005",
      "name": "Microneedling",
      "category": "Skin Treatments",
      "shortDescription": "Stimulate collagen for smoother, firmer skin.",
      "longDescription": "Controlled micro-injuries promote collagen and elastin to improve texture, pores, and fine lines. Option to add PRP for enhanced results.",
      "media": {
        "coverImageUrl": "",
        "galleryIds": []
      },
      "pricing": {
        "currency": "USD",
        "pricingModel": "FLAT",
        "basePrice": 400,
        "packages": [
          {
            "id": "mn_series3",
            "name": "Series of 3",
            "appliesTo": "WHOLE_SERVICE",
            "discountType": "PERCENT",
            "discountValue": 15,
            "sessions": 3,
            "transferable": false,
            "expirationDays": 210
          }
        ],
        "membershipAdjustments": [
          { "membershipId": "mbr_glow", "type": "PERCENT", "value": 10 }
        ],
        "providerLevelAdjustments": [
          { "level": "RN", "type": "PERCENT", "value": 0 },
          { "level": "NP", "type": "PERCENT", "value": 10 }
        ],
        "taxable": true
      },
      "booking": {
        "durationMinutes": 75,
        "prepBufferMinutes": 10,
        "cleanupBufferMinutes": 10,
        "leadTimeHoursMin": 2,
        "cancellationPolicyId": "can_24h",
        "deposit": {
          "required": false,
          "type": "PERCENT",
          "value": 20,
          "appliesTo": "ORDER",
          "refundableWindowHours": 24
        },
        "onlineBookable": true,
        "maxGuests": 1
      },
      "clinical": {
        "sessionsRecommendedMin": 3,
        "sessionsRecommendedMax": 4,
        "sessionCadenceDaysMin": 28,
        "expectedDowntime": "Redness 24–48 hours; possible flaking 2–3 days",
        "contraindications": [
          "Active acne cysts or infection",
          "Keloid scarring history (consult provider)",
          "Isotretinoin within 6 months"
        ],
        "preCare": [
          "Avoid retinoids/peels 5–7 days prior",
          "Arrive with clean skin"
        ],
        "postCare": [
          "Avoid makeup for 24 hours",
          "Use gentle cleanser and SPF 30+",
          "No saunas/pools for 48 hours"
        ],
        "followUpNeeded": false
      },
      "availability": {
        "locations": [
          { "id": "loc_lake_worth", "enabled": true },
          { "id": "loc_boynton_beach", "enabled": true }
        ],
        "resources": [
          { "type": "MACHINE", "id": "pen_01" },
          { "type": "ROOM", "id": "room_skin_2" }
        ],
        "providerLevelsAllowed": ["RN", "NP"]
      },
      "commerce": {
        "sku": "MICRO",
        "upsells": [
          { "addonId": "adn_prp", "label": "Add PRP" }
        ],
        "addons": [
          { "id": "adn_prp", "name": "PRP Add-On", "price": 200, "durationMinutes": 15 }
        ],
        "giftCardEligible": true
      },
      "compliance": {
        "consentFormId": "consent_microneedling",
        "hipaaSensitive": true
      },
      "status": { "available": true, "visible": true },
      "seo": { "slug": "microneedling", "keywords": ["microneedling","collagen induction","skin texture"] },
      "i18n": { "defaultLocale": "en-US", "supported": ["en-US","es-ES"] },
      "version": 2
    },
    {
      "id": "srv_006",
      "name": "Dermal Fillers",
      "category": "Injectables",
      "shortDescription": "Restore volume and enhance contours.",
      "longDescription": "Hyaluronic acid–based fillers to add volume, smooth lines, and contour features such as cheeks, lips, and jawline. Results are immediate and can last 6–18 months depending on product and area.",
      "media": {
        "coverImageUrl": "",
        "galleryIds": []
      },
      "pricing": {
        "currency": "USD",
        "pricingModel": "PER_UNIT",
        "unitLabel": "syringe",
        "unitPrice": 800,
        "tiers": [
          { "minUnits": 2, "unitPrice": 750 },
          { "minUnits": 3, "unitPrice": 725 }
        ],
        "packages": [],
        "membershipAdjustments": [
          { "membershipId": "mbr_glow", "type": "PERCENT", "value": 10 }
        ],
        "providerLevelAdjustments": [
          { "level": "RN", "type": "PERCENT", "value": 0 },
          { "level": "NP", "type": "PERCENT", "value": 5 },
          { "level": "MD", "type": "PERCENT", "value": 10 }
        ],
        "taxable": true
      },
      "booking": {
        "durationMinutes": 60,
        "prepBufferMinutes": 10,
        "cleanupBufferMinutes": 10,
        "leadTimeHoursMin": 2,
        "cancellationPolicyId": "can_24h",
        "deposit": {
          "required": false,
          "type": "PERCENT",
          "value": 20,
          "appliesTo": "ORDER",
          "refundableWindowHours": 24
        },
        "onlineBookable": true,
        "maxGuests": 1
      },
      "clinical": {
        "expectedDowntime": "Mild swelling/bruising 2–7 days",
        "contraindications": [
          "Pregnancy or breastfeeding",
          "Active infection at injection site",
          "History of severe allergies to filler components"
        ],
        "preCare": [
          "Avoid alcohol and blood thinners 24–48 hours prior",
          "Consider arnica to minimize bruising"
        ],
        "postCare": [
          "Ice intermittently the first day",
          "Avoid pressure on treated area 24 hours",
          "Use SPF 30+"
        ],
        "followUpNeeded": true,
        "followUpWindowDays": 14
      },
      "availability": {
        "locations": [
          { "id": "loc_lake_worth", "enabled": true },
          { "id": "loc_west_palm", "enabled": true }
        ],
        "resources": [
          { "type": "ROOM", "id": "room_inject_2" }
        ],
        "providerLevelsAllowed": ["RN", "NP", "MD"]
      },
      "commerce": {
        "sku": "FILLER",
        "upsells": [
          { "serviceId": "srv_001", "label": "Combine with Botox for lines" }
        ],
        "addons": [
          { "id": "adn_numbing", "name": "Topical numbing", "price": 25, "durationMinutes": 10 }
        ],
        "giftCardEligible": true
      },
      "compliance": {
        "consentFormId": "consent_injectables",
        "hipaaSensitive": true
      },
      "status": { "available": true, "visible": true },
      "seo": { "slug": "dermal-fillers", "keywords": ["dermal filler","lip filler","cheek filler"] },
      "i18n": { "defaultLocale": "en-US", "supported": ["en-US","es-ES"] },
      "version": 2
    },
    {
      "id": "srv_007",
      "name": "IPL Photofacial",
      "category": "Laser Treatments",
      "shortDescription": "Treat sun damage, age spots, and redness.",
      "longDescription": "Broad-spectrum light targets pigment and redness to improve overall tone and clarity. Best done in a series spaced 4–6 weeks apart.",
      "media": {
        "coverImageUrl": "",
        "galleryIds": []
      },
      "pricing": {
        "currency": "USD",
        "pricingModel": "PER_AREA",
        "areas": [
          { "id": "ipl_face", "name": "Face", "price": 500 },
          { "id": "ipl_face_neck", "name": "Face + Neck", "price": 650 },
          { "id": "ipl_hands", "name": "Hands", "price": 300 },
          { "id": "ipl_chest", "name": "Chest", "price": 450 }
        ],
        "packages": [
          {
            "id": "ipl_series3",
            "name": "Series of 3",
            "appliesTo": "AREAS",
            "discountType": "PERCENT",
            "discountValue": 10,
            "sessions": 3,
            "transferable": false,
            "expirationDays": 240
          }
        ],
        "membershipAdjustments": [
          { "membershipId": "mbr_glow", "type": "PERCENT", "value": 10 }
        ],
        "providerLevelAdjustments": [
          { "level": "RN", "type": "PERCENT", "value": 0 },
          { "level": "NP", "type": "PERCENT", "value": 10 }
        ],
        "taxable": true
      },
      "booking": {
        "durationMinutes": 45,
        "durationPerAdditionalArea": 10,
        "prepBufferMinutes": 5,
        "cleanupBufferMinutes": 5,
        "leadTimeHoursMin": 2,
        "cancellationPolicyId": "can_24h",
        "deposit": {
          "required": false,
          "type": "PERCENT",
          "value": 20,
          "appliesTo": "ORDER",
          "refundableWindowHours": 24
        },
        "onlineBookable": true,
        "maxGuests": 1
      },
      "clinical": {
        "sessionsRecommendedMin": 3,
        "sessionsRecommendedMax": 5,
        "sessionCadenceDaysMin": 28,
        "expectedDowntime": "Darkening of spots and mild redness 24–72 hours; flaking up to 7 days",
        "contraindications": [
          "Recent sun exposure or tanning",
          "Photosensitizing medications",
          "Pregnancy (consult provider)"
        ],
        "preCare": [
          "Avoid sun/self-tanner for 2 weeks prior",
          "Pause retinoids 5 days prior"
        ],
        "postCare": [
          "SPF 30+ daily, avoid heat 24–48 hours",
          "Do not pick flaking pigment"
        ],
        "followUpNeeded": false
      },
      "availability": {
        "locations": [
          { "id": "loc_lake_worth", "enabled": true }
        ],
        "resources": [
          { "type": "MACHINE", "id": "ipl_01" },
          { "type": "ROOM", "id": "room_laser_b" }
        ],
        "providerLevelsAllowed": ["RN", "NP"]
      },
      "commerce": {
        "sku": "IPL",
        "upsells": [
          { "serviceId": "srv_004", "label": "Add Chemical Peel for texture" }
        ],
        "addons": [],
        "giftCardEligible": true
      },
      "compliance": {
        "consentFormId": "consent_ipl",
        "hipaaSensitive": true
      },
      "status": { "available": true, "visible": true },
      "seo": { "slug": "ipl-photofacial", "keywords": ["IPL","photofacial","sun spots","redness"] },
      "i18n": { "defaultLocale": "en-US", "supported": ["en-US","es-ES"] },
      "version": 2
    },
    {
      "id": "srv_008",
      "name": "CoolSculpting",
      "category": "Body Contouring",
      "shortDescription": "Non-invasive fat reduction with controlled cooling.",
      "longDescription": "Cryolipolysis targets and freezes fat cells in stubborn areas with no surgery or downtime. Results develop gradually over 1–3 months.",
      "media": {
        "coverImageUrl": "",
        "galleryIds": []
      },
      "pricing": {
        "currency": "USD",
        "pricingModel": "PER_UNIT",
        "unitLabel": "cycle",
        "unitPrice": 600,
        "tiers": [
          { "minUnits": 2, "unitPrice": 575 },
          { "minUnits": 4, "unitPrice": 550 }
        ],
        "packages": [
          {
            "id": "cool_bundle4",
            "name": "4-Cycle Transformation",
            "appliesTo": "WHOLE_SERVICE",
            "discountType": "FIXED",
            "discountValue": 100,
            "sessions": 1,
            "transferable": false,
            "expirationDays": 365
          }
        ],
        "membershipAdjustments": [
          { "membershipId": "mbr_glow", "type": "PERCENT", "value": 5 }
        ],
        "providerLevelAdjustments": [],
        "taxable": true
      },
      "booking": {
        "durationMinutes": 60,
        "durationPerAdditionalUnit": 45,
        "prepBufferMinutes": 10,
        "cleanupBufferMinutes": 10,
        "leadTimeHoursMin": 4,
        "cancellationPolicyId": "can_48h",
        "deposit": {
          "required": false,
          "type": "PERCENT",
          "value": 25,
          "appliesTo": "ORDER",
          "refundableWindowHours": 48
        },
        "onlineBookable": true,
        "maxGuests": 1
      },
      "clinical": {
        "expectedDowntime": "None; temporary numbness, redness, or tingling",
        "contraindications": [
          "Cryoglobulinemia",
          "Paroxysmal cold hemoglobinuria",
          "Cold agglutinin disease"
        ],
        "preCare": [
          "Maintain stable weight through the treatment plan",
          "Hydrate well"
        ],
        "postCare": [
          "Massage treated area as directed",
          "Expect gradual results over weeks"
        ],
        "followUpNeeded": true,
        "followUpWindowDays": 30
      },
      "availability": {
        "locations": [
          { "id": "loc_lake_worth", "enabled": true }
        ],
        "resources": [
          { "type": "MACHINE", "id": "cool_01" },
          { "type": "ROOM", "id": "room_body_1" }
        ],
        "providerLevelsAllowed": ["RN", "NP"]
      },
      "commerce": {
        "sku": "COOL",
        "upsells": [
          { "serviceId": "srv_002", "label": "Hydrafacial post-series for skin quality" }
        ],
        "addons": [
          { "id": "adn_skin_tightening", "name": "Add Skin Tightening (area)", "price": 150, "durationMinutes": 20 }
        ],
        "giftCardEligible": true
      },
      "compliance": {
        "consentFormId": "consent_coolsculpting",
        "hipaaSensitive": true
      },
      "status": { "available": true, "visible": true },
      "seo": { "slug": "coolsculpting", "keywords": ["coolsculpting","fat reduction","body contouring"] },
      "i18n": { "defaultLocale": "en-US", "supported": ["en-US","es-ES"] },
      "version": 2
    }
  ],
  availability: {
    // Mock availability slots
    slots: [],
    businessHours: {
      monday: { open: "09:00", close: "18:00", isOpen: true },
      tuesday: { open: "09:00", close: "18:00", isOpen: true },
      wednesday: { open: "09:00", close: "18:00", isOpen: true },
      thursday: { open: "09:00", close: "20:00", isOpen: true },
      friday: { open: "09:00", close: "18:00", isOpen: true },
      saturday: { open: "10:00", close: "16:00", isOpen: true },
      sunday: { open: "00:00", close: "00:00", isOpen: false }
    },
    holidays: [
      { date: "2024-12-25", name: "Christmas Day" },
      { date: "2024-12-31", name: "New Year's Eve" },
      { date: "2025-01-01", name: "New Year's Day" }
    ]
  },
  stats: {
    totalBookings: 0,
    confirmedBookings: 0,
    pendingBookings: 0,
    cancelledBookings: 0,
    totalRevenue: 0,
    totalDeposits: 0,
    popularServices: []
  }
};

// Update stats based on current bookings
const updateStats = () => {
  const stats = {
    totalBookings: mockDatabase.bookings.length,
    confirmedBookings: mockDatabase.bookings.filter(b => b.status === 'confirmed').length,
    pendingBookings: mockDatabase.bookings.filter(b => b.status === 'pending').length,
    cancelledBookings: mockDatabase.bookings.filter(b => b.status === 'cancelled').length,
    totalRevenue: mockDatabase.bookings
      .filter(b => b.status === 'confirmed')
      .reduce((sum, b) => sum + b.price, 0),
    totalDeposits: mockDatabase.bookings
      .filter(b => b.depositPaid)
      .reduce((sum, b) => sum + b.depositAmount, 0),
    popularServices: []
  };

  // Calculate popular services
  const serviceCounts = {};
  mockDatabase.bookings.forEach(booking => {
    if (booking.status !== 'cancelled') {
      serviceCounts[booking.service] = (serviceCounts[booking.service] || 0) + 1;
    }
  });

  stats.popularServices = Object.entries(serviceCounts)
    .map(([service, count]) => ({ service, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  mockDatabase.stats = stats;
};

// Initialize stats
updateStats();

module.exports = {
  mockDatabase,
  updateStats
};
