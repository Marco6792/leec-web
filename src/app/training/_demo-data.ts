export interface DemoSession {
  id: string;
  title: string;
  slug: string;
  description: string;
  level: "beginner" | "intermediate" | "advanced";
  status: "draft" | "pending_approval" | "open" | "in_progress" | "completed" | "cancelled";
  maxParticipants: number;
  enrolledCount: number;
  startDate: string;
  endDate: string;
  schedule: string;
  equipment: string[];
  curriculum: string[];
  image: string;
  tags: string[];
}

export const demoSessions: DemoSession[] = [
  {
    id: "1",
    title: "Quantum Machine Operation 101",
    slug: "quantum-machine-101",
    description:
      "Learn the fundamentals of operating the Quantum Analyzer Q-2000. Covers startup procedures, calibration routines, safety protocols, and basic measurement configurations for quantum materials characterization.",
    level: "beginner",
    status: "open",
    maxParticipants: 12,
    enrolledCount: 7,
    startDate: "2026-09-01",
    endDate: "2026-09-28",
    schedule: "Mondays & Wednesdays, 14:00–16:00",
    equipment: ["Quantum Analyzer Q-2000"],
    curriculum: [
      "Week 1: Safety protocols & startup",
      "Week 2: Calibration & measurement modes",
      "Week 3: Data acquisition & analysis",
      "Week 4: Advanced techniques & exam",
    ],
    image: "/photos/lab-interior.jpg",
    tags: ["quantum", "measurement", "beginner"],
  },
  {
    id: "2",
    title: "Advanced Electromagnetic NDT Techniques",
    slug: "advanced-ndt-techniques",
    description:
      "Deep-dive into magnetic needle probe measurements, Barkhausen noise analysis, and eddy current testing. Hands-on sessions with research-grade instrumentation for material characterization.",
    level: "advanced",
    status: "open",
    maxParticipants: 8,
    enrolledCount: 5,
    startDate: "2026-10-06",
    endDate: "2026-10-31",
    schedule: "Tuesdays & Thursdays, 10:00–13:00",
    equipment: ["Electromagnetic Testing Station", "Leica Research Microscope"],
    curriculum: [
      "Week 1: Magnetic needle probe fundamentals",
      "Week 2: Barkhausen noise analysis",
      "Week 3: Eddy current testing methods",
      "Week 4: Integrated characterization project",
    ],
    image: "/photos/research-collab.jpg",
    tags: ["ndt", "magnetic", "advanced"],
  },
  {
    id: "3",
    title: "SourceMeter Calibration & Precision Measurements",
    slug: "sourcemeter-calibration",
    description:
      "Hands-on training for precision electrical measurements using the Keithley 2400 SourceMeter. Covers calibration procedures, four-wire sensing, and automated measurement scripting.",
    level: "intermediate",
    status: "in_progress",
    maxParticipants: 6,
    enrolledCount: 6,
    startDate: "2026-08-04",
    endDate: "2026-08-29",
    schedule: "Mondays & Fridays, 14:00–17:00",
    equipment: ["Keithley 2400 SourceMeter"],
    curriculum: [
      "Week 1: Instrument overview & safety",
      "Week 2: Calibration & verification",
    ],
    image: "/photos/lab-meeting.jpg",
    tags: ["calibration", "measurement", "intermediate"],
  },
  {
    id: "4",
    title: "RF Energy Harvesting Rectenna Design",
    slug: "rf-energy-harvesting",
    description:
      "Design, simulate, and test RF rectenna circuits for ambient energy harvesting. Covers antenna design, impedance matching, rectifier circuits, and power management for IoT applications.",
    level: "intermediate",
    status: "draft",
    maxParticipants: 10,
    enrolledCount: 0,
    startDate: "2026-11-03",
    endDate: "2026-11-28",
    schedule: "Tuesdays & Thursdays, 09:00–12:00",
    equipment: ["Vectorial Network Analyzer", "Signal Analysis Equipment"],
    curriculum: [
      "Week 1: RF fundamentals & antenna theory",
      "Week 2: Rectifier circuit design",
      "Week 3: Impedance matching techniques",
      "Week 4: Integration & testing",
    ],
    image: "/photos/inauguration.jpg",
    tags: ["rf", "energy", "iot"],
  },
  {
    id: "5",
    title: "PCB Design & Prototyping Workshop",
    slug: "pcb-design-workshop",
    description:
      "From schematic to prototype. Learn KiCad-based PCB design, fabrication techniques, soldering, and debugging. Each participant builds and tests a functional power converter board.",
    level: "beginner",
    status: "open",
    maxParticipants: 15,
    enrolledCount: 11,
    startDate: "2026-09-15",
    endDate: "2026-10-10",
    schedule: "Saturdays, 09:00–17:00",
    equipment: ["Prototyping Workshop"],
    curriculum: [
      "Week 1: Schematic capture & component selection",
      "Week 2: PCB layout & design rules",
      "Week 3: Fabrication & assembly",
      "Week 4: Testing & debugging",
    ],
    image: "/photos/microscope-entrance.jpg",
    tags: ["pcb", "prototyping", "beginner"],
  },
  {
    id: "6",
    title: "IoT Sensor Networks & Embedded Systems",
    slug: "iot-sensor-networks",
    description:
      "Build end-to-end IoT sensor networks using ESP32, LoRaWAN, and cloud platforms. Covers sensor interfacing, wireless communication, data logging, and dashboard visualization.",
    level: "intermediate",
    status: "open",
    maxParticipants: 10,
    enrolledCount: 8,
    startDate: "2026-10-13",
    endDate: "2026-11-07",
    schedule: "Mondays & Wednesdays, 15:00–17:30",
    equipment: ["Signal Analysis Equipment", "Prototyping Workshop"],
    curriculum: [
      "Week 1: Sensor fundamentals & interfacing",
      "Week 2: Wireless communication protocols",
      "Week 3: Cloud data pipeline & storage",
      "Week 4: Dashboard visualization & deployment",
    ],
    image: "/photos/team-photo.jpg",
    tags: ["iot", "embedded", "wireless"],
  },
];
