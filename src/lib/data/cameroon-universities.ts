export interface Faculty {
  name: string
  departments: string[]
}

export interface University {
  name: string
  acronym: string
  town: string
  region: string
  type: "public" | "private"
  faculties: Faculty[]
}

export const cameroonUniversities: University[] = [
  {
    name: "University of Buea",
    acronym: "UB",
    town: "Buea",
    region: "Southwest",
    type: "public",
    faculties: [
      {
        name: "Faculty of Arts",
        departments: ["English", "French", "History", "Geography", "Sociology & Anthropology", "Philosophy", "Linguistics", "African Languages & Literature", "Women & Gender Studies"],
      },
      {
        name: "Faculty of Education",
        departments: ["Curriculum & Teaching", "Educational Psychology", "Educational Administration", "Special Education", "Adult & Continuing Education"],
      },
      {
        name: "Faculty of Health Sciences",
        departments: ["Nursing", "Public Health", "Medical Laboratory Science", "Environmental Health", "Biomedical Sciences"],
      },
      {
        name: "Faculty of Science",
        departments: ["Biochemistry", "Biology", "Chemistry", "Computer Science", "Geology", "Mathematics", "Microbiology", "Physics", "Zoology", "Plant Science"],
      },
      {
        name: "Faculty of Engineering & Technology",
        departments: ["Civil Engineering", "Electrical & Electronic Engineering", "Mechanical Engineering", "Computer Engineering", "Chemical Engineering"],
      },
      {
        name: "Faculty of Agriculture & Veterinary Medicine",
        departments: ["Agricultural Economics", "Agronomy", "Animal Science", "Food Science & Technology", "Forestry & Wildlife", "Veterinary Medicine"],
      },
      {
        name: "Faculty of Management & Information Sciences",
        departments: ["Accounting", "Banking & Finance", "Business Administration", "Economics", "Human Resources", "Management Information Systems", "Marketing", "Journalism & Mass Communication"],
      },
    ],
  },
  {
    name: "University of Yaoundé I",
    acronym: "UYI",
    town: "Yaoundé",
    region: "Centre",
    type: "public",
    faculties: [
      {
        name: "Faculty of Arts, Letters & Social Sciences",
        departments: ["English", "French", "Anthropology", "Arts & Archaeology", "Bilingual Studies", "Geography", "History", "African Languages & Linguistics", "German Studies", "Spanish Studies", "Philosophy", "Psychology", "Sociology", "Tourism"],
      },
      {
        name: "Faculty of Medicine & Biomedical Sciences",
        departments: ["Morphological Sciences", "Physiological Sciences & Biochemistry", "Microbiology & Parasitology", "Internal Medicine", "Surgery & Specialties", "Pediatrics", "Gynecology & Obstetrics", "Ophthalmology", "Public Health", "Pharmacy"],
      },
      {
        name: "Faculty of Science",
        departments: ["Biochemistry", "Animal Biology & Physiology", "Plant Biology & Physiology", "Inorganic Chemistry", "Organic Chemistry", "Computer Science", "Mathematics", "Physics", "Earth Sciences"],
      },
      {
        name: "Higher Teachers' Training College (ENS)",
        departments: ["Mathematics", "Physics", "Chemistry", "Biology", "Geography", "Education Sciences", "French", "English", "Foreign Languages", "Philosophy", "History", "Classics"],
      },
      {
        name: "National Advanced School of Engineering (ENSP)",
        departments: ["Civil Engineering", "Electrical Engineering & Telecommunications", "Mechanical & Industrial Engineering", "Computer Engineering", "Mathematics & Physical Sciences"],
      },
    ],
  },
  {
    name: "University of Yaoundé II",
    acronym: "UYII",
    town: "Soa",
    region: "Centre",
    type: "public",
    faculties: [
      {
        name: "Faculty of Economics & Management",
        departments: ["Economics", "Management", "Accounting", "Finance", "Marketing"],
      },
      {
        name: "Faculty of Law & Political Science",
        departments: ["Public Law", "Private Law", "Political Science", "International Relations"],
      },
      {
        name: "Institute of International Relations (IRIC)",
        departments: ["International Relations", "Diplomacy", "Conflict Resolution"],
      },
      {
        name: "School of Information & Communication Sciences (ESSTIC)",
        departments: ["Journalism", "Public Relations", "Communication"],
      },
    ],
  },
  {
    name: "University of Douala",
    acronym: "UDla",
    town: "Douala",
    region: "Littoral",
    type: "public",
    faculties: [
      {
        name: "Faculty of Arts & Humanities",
        departments: ["English", "French", "History", "Geography", "Philosophy", "Sociology"],
      },
      {
        name: "Faculty of Economics & Management",
        departments: ["Economics", "Management", "Accounting", "Finance", "Marketing", "Human Resources"],
      },
      {
        name: "Faculty of Law & Political Science",
        departments: ["Public Law", "Private Law", "Business Law"],
      },
      {
        name: "Faculty of Science",
        departments: ["Biochemistry", "Biology", "Chemistry", "Computer Science", "Mathematics", "Physics"],
      },
      {
        name: "Faculty of Medicine & Pharmaceutical Sciences",
        departments: ["Medicine", "Pharmacy", "Biomedical Sciences"],
      },
      {
        name: "Faculty of Industrial Engineering",
        departments: ["Mechanical Engineering", "Electrical Engineering", "Chemical Engineering", "Civil Engineering"],
      },
      {
        name: "University Institute of Technology (IUT)",
        departments: ["Business Administration", "Industrial Engineering", "Computer Science", "Electrical Engineering"],
      },
      {
        name: "Institute of Fisheries Sciences (ISH)",
        departments: ["Aquaculture", "Fisheries Management", "Oceanography"],
      },
    ],
  },
  {
    name: "University of Dschang",
    acronym: "UDS",
    town: "Dschang",
    region: "West",
    type: "public",
    faculties: [
      {
        name: "Faculty of Arts & Social Sciences",
        departments: ["English", "French", "History", "Geography", "Philosophy", "Sociology", "Anthropology"],
      },
      {
        name: "Faculty of Economics & Management",
        departments: ["Economics", "Management", "Accounting", "Finance"],
      },
      {
        name: "Faculty of Law & Political Science",
        departments: ["Public Law", "Private Law", "Political Science"],
      },
      {
        name: "Faculty of Science",
        departments: ["Biochemistry", "Biology", "Chemistry", "Computer Science", "Mathematics", "Physics", "Geology"],
      },
      {
        name: "Faculty of Agriculture & Agricultural Sciences (FASA)",
        departments: ["Agricultural Economics", "Agronomy", "Animal Science", "Rural Engineering", "Soil Science", "Crop Science"],
      },
      {
        name: "Faculty of Medicine & Pharmaceutical Sciences",
        departments: ["Medicine", "Pharmacy", "Nursing"],
      },
      {
        name: "University Institute of Technology (IUT)",
        departments: ["Business Administration", "Tourism & Hospitality", "Computer Science"],
      },
    ],
  },
  {
    name: "University of Bamenda",
    acronym: "UBa",
    town: "Bamenda",
    region: "Northwest",
    type: "public",
    faculties: [
      {
        name: "Faculty of Arts",
        departments: ["English", "French", "History", "Geography", "Sociology", "Philosophy"],
      },
      {
        name: "Faculty of Education",
        departments: ["Curriculum & Teaching", "Educational Psychology", "Science Education"],
      },
      {
        name: "Faculty of Health Sciences",
        departments: ["Nursing", "Public Health", "Medical Laboratory Science"],
      },
      {
        name: "Faculty of Science",
        departments: ["Biochemistry", "Biology", "Chemistry", "Computer Science", "Mathematics", "Physics", "Geology"],
      },
      {
        name: "Faculty of Law & Political Science",
        departments: ["Public Law", "Private Law", "Political Science"],
      },
      {
        name: "Faculty of Economics & Management",
        departments: ["Economics", "Management", "Accounting", "Finance", "Marketing"],
      },
      {
        name: "Higher Technical Teachers' Training College (HTTTC) Kumba",
        departments: ["Civil Engineering", "Electrical Engineering", "Mechanical Engineering", "Computer Science"],
      },
      {
        name: "National Higher Polytechnic Institute (NAHPI)",
        departments: ["Engineering", "Technology", "Innovation"],
      },
    ],
  },
  {
    name: "University of Ngaoundéré",
    acronym: "UN",
    town: "Ngaoundéré",
    region: "Adamawa",
    type: "public",
    faculties: [
      {
        name: "Faculty of Arts & Social Sciences",
        departments: ["English", "French", "History", "Geography", "Sociology", "Philosophy"],
      },
      {
        name: "Faculty of Economics & Management",
        departments: ["Economics", "Management", "Accounting", "Finance"],
      },
      {
        name: "Faculty of Law & Political Science",
        departments: ["Public Law", "Private Law"],
      },
      {
        name: "Faculty of Science",
        departments: ["Biochemistry", "Biology", "Chemistry", "Computer Science", "Mathematics", "Physics", "Earth Sciences"],
      },
      {
        name: "Faculty of Veterinary Medicine & Livestock",
        departments: ["Veterinary Medicine", "Animal Production", "Fisheries"],
      },
    ],
  },
  {
    name: "University of Maroua",
    acronym: "UM",
    town: "Maroua",
    region: "Far North",
    type: "public",
    faculties: [
      {
        name: "Faculty of Arts & Social Sciences",
        departments: ["English", "French", "History", "Geography", "Sociology", "Arabic Studies"],
      },
      {
        name: "Faculty of Economics & Management",
        departments: ["Economics", "Management", "Accounting"],
      },
      {
        name: "Faculty of Law & Political Science",
        departments: ["Public Law", "Private Law"],
      },
      {
        name: "Faculty of Science",
        departments: ["Biochemistry", "Biology", "Chemistry", "Computer Science", "Mathematics", "Physics", "Geology"],
      },
      {
        name: "Faculty of Mines & Petroleum",
        departments: ["Mining Engineering", "Petroleum Engineering", "Geology"],
      },
    ],
  },
  {
    name: "University of Ebolowa",
    acronym: "UE",
    town: "Ebolowa",
    region: "South",
    type: "public",
    faculties: [
      {
        name: "Faculty of Law & Political Science",
        departments: ["Public Law", "Private Law"],
      },
      {
        name: "Faculty of Economics & Management",
        departments: ["Economics", "Management"],
      },
    ],
  },
  {
    name: "University of Garoua",
    acronym: "UG",
    town: "Garoua",
    region: "North",
    type: "public",
    faculties: [
      {
        name: "Faculty of Arts & Social Sciences",
        departments: ["History", "Geography", "Sociology"],
      },
      {
        name: "Faculty of Economics & Management",
        departments: ["Economics", "Management"],
      },
    ],
  },
  {
    name: "Catholic University of Central Africa",
    acronym: "UCAC",
    town: "Yaoundé",
    region: "Centre",
    type: "private",
    faculties: [
      {
        name: "Faculty of Social Sciences & Management",
        departments: ["Economics", "Management", "Sociology", "Philosophy"],
      },
      {
        name: "Faculty of Law",
        departments: ["Private Law", "Public Law", "Business Law"],
      },
      {
        name: "Faculty of Theology",
        departments: ["Theology", "Religious Studies"],
      },
    ],
  },
  {
    name: "Catholic University Institute of Buea",
    acronym: "CUIB",
    town: "Buea",
    region: "Southwest",
    type: "private",
    faculties: [
      {
        name: "Faculty of Engineering & Technology",
        departments: ["Computer Engineering", "Software Engineering", "Electrical Engineering", "Telecommunications"],
      },
      {
        name: "Faculty of Business & Management",
        departments: ["Accounting", "Banking & Finance", "Business Administration", "Marketing", "Human Resources"],
      },
      {
        name: "Faculty of Health Sciences",
        departments: ["Nursing", "Public Health", "Medical Laboratory Science"],
      },
    ],
  },
  {
    name: "Biaka University Institute of Buea",
    acronym: "BUIB",
    town: "Buea",
    region: "Southwest",
    type: "private",
    faculties: [
      {
        name: "Faculty of Health Sciences",
        departments: ["Nursing", "Public Health", "Medical Laboratory Science", "Pharmacy"],
      },
      {
        name: "Faculty of Social & Management Sciences",
        departments: ["Accounting", "Business Administration", "Economics", "Sociology"],
      },
    ],
  },
  {
    name: "Institut Universitaire du Golfe de Guinée",
    acronym: "IUGG",
    town: "Douala",
    region: "Littoral",
    type: "private",
    faculties: [
      {
        name: "Faculty of Management & Economics",
        departments: ["Accounting", "Finance", "Management", "Marketing"],
      },
      {
        name: "Faculty of Engineering",
        departments: ["Computer Science", "Telecommunications", "Electrical Engineering"],
      },
    ],
  },
  {
    name: "Fomic Polytechnic University",
    acronym: "FPU",
    town: "Buea",
    region: "Southwest",
    type: "private",
    faculties: [
      {
        name: "Faculty of Engineering",
        departments: ["Civil Engineering", "Electrical Engineering", "Mechanical Engineering", "Computer Engineering"],
      },
      {
        name: "Faculty of Management",
        departments: ["Accounting", "Business Administration", "Human Resources"],
      },
    ],
  },
  {
    name: "St. Lawrence University",
    acronym: "SLU",
    town: "Yaoundé",
    region: "Centre",
    type: "private",
    faculties: [
      {
        name: "Faculty of Law & Political Science",
        departments: ["Public Law", "Private Law", "International Relations"],
      },
      {
        name: "Faculty of Economics & Management",
        departments: ["Economics", "Management", "Accounting", "Finance"],
      },
      {
        name: "Faculty of Science & Technology",
        departments: ["Computer Science", "Information Technology", "Telecommunications"],
      },
    ],
  },
  {
    name: "University of the Mountains",
    acronym: "UdM",
    town: "Bangangté",
    region: "West",
    type: "private",
    faculties: [
      {
        name: "Faculty of Medicine",
        departments: ["Medicine", "Pharmacy", "Biomedical Sciences"],
      },
      {
        name: "Faculty of Health Sciences",
        departments: ["Nursing", "Midwifery", "Physical Therapy"],
      },
      {
        name: "Faculty of Business",
        departments: ["Accounting", "Management", "Economics"],
      },
    ],
  },
  {
    name: "Bamenda University of Science & Technology",
    acronym: "BUST",
    town: "Bamenda",
    region: "Northwest",
    type: "private",
    faculties: [
      {
        name: "Faculty of Science & Technology",
        departments: ["Computer Science", "Information Technology", "Electrical Engineering", "Civil Engineering"],
      },
      {
        name: "Faculty of Management",
        departments: ["Business Administration", "Accounting", "Marketing"],
      },
    ],
  },
  {
    name: "Siantou University Institute",
    acronym: "IUS",
    town: "Yaoundé",
    region: "Centre",
    type: "private",
    faculties: [
      {
        name: "Faculty of Management & Economics",
        departments: ["Accounting", "Finance", "Management", "Marketing", "Economics"],
      },
      {
        name: "Faculty of Law & Political Science",
        departments: ["Private Law", "Public Law"],
      },
      {
        name: "Faculty of Science & Technology",
        departments: ["Computer Science", "Telecommunications", "Electronics"],
      },
    ],
  },
  {
    name: "Institut Supérieur de Management et de l'Entrepreneuriat",
    acronym: "ISME",
    town: "Douala",
    region: "Littoral",
    type: "private",
    faculties: [
      {
        name: "Faculty of Management",
        departments: ["Business Administration", "Accounting", "Finance", "Marketing", "Human Resources", "Logistics"],
      },
      {
        name: "Faculty of Engineering & Technology",
        departments: ["Computer Science", "Software Engineering", "Network & Telecommunications"],
      },
    ],
  },
]

export function getUniversitiesByType(type: "public" | "private" | "all"): University[] {
  if (type === "all") return cameroonUniversities
  return cameroonUniversities.filter((u) => u.type === type)
}

export function getUniversityByAcronym(acronym: string): University | undefined {
  return cameroonUniversities.find((u) => u.acronym === acronym)
}

export function getUniversityByName(name: string): University | undefined {
  return cameroonUniversities.find((u) => u.name === name)
}

export function getDepartmentsForUniversity(universityName: string): string[] {
  const uni = getUniversityByName(universityName)
  if (!uni) return []
  return uni.faculties.flatMap((f) => f.departments)
}

export function getFacultiesForUniversity(universityName: string): Faculty[] {
  const uni = getUniversityByName(universityName)
  if (!uni) return []
  return uni.faculties
}
