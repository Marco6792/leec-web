import "dotenv/config";

import { db } from "@/db";
import { researchDomains } from "@/db/schema";

const initialAreas = [
  {
    name: "Power Electronics & Energy Management",
    slug: "power-electronics",
    description:
      "Low-cost power electronics and control for solar photovoltaic energy generation, battery management, and power grid preventive maintenance.",
    icon: "Cpu",
    featuredImageUrl: "/research/water-turbine.jpg",
    tags: ["Solar PV", "Battery Management", "Power Grids"],
    sortOrder: 0,
  },
  {
    name: "Electromagnetic NDT",
    slug: "electromagnetic-ndt",
    description:
      "Non-destructive testing using magnetic needle probe, Barkhausen noise, and eddy current methods for material characterization.",
    icon: "Waves",
    featuredImageUrl: "/research/ndt-experimental-setup.jpg",
    tags: ["NDT", "Material Characterization", "Sensors"],
    sortOrder: 1,
  },
  {
    name: "Electrical Energy Harvesting",
    slug: "energy-harvesting",
    description:
      "Autonomous low-power electricity generation from water distribution systems, organic wastes, and ambient radio, TV and telephone signals.",
    icon: "Zap",
    featuredImageUrl: "/research/mfc-reactor.jpg",
    tags: ["Microbial Fuel Cells", "RF Harvesting", "Water Energy"],
    sortOrder: 2,
  },
  {
    name: "Sensors, IoT & Smart Agriculture",
    slug: "sensors-iot",
    description:
      "Sensor networks for soil classification, leak detection, and pesticide monitoring in agricultural systems.",
    icon: "Leaf",
    featuredImageUrl: "/research/soil-sensor-setup.jpg",
    tags: ["IoT", "Soil Sensors", "Water Networks"],
    sortOrder: 3,
  },
];

async function seed() {
  for (const area of initialAreas) {
    await db.insert(researchDomains).values(area).onConflictDoNothing({
      target: researchDomains.slug,
    });
  }
  console.log("Research areas seeded successfully.");
}

seed()
  .catch((err) => {
    console.error("Error seeding research areas:", err);
    process.exit(1);
  });
