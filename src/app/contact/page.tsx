import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MapPin, Phone, Users } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Contact — LEEC",
  description: "Contact the Laboratory of Electrical Engineering and Computing (LEEC) at the University of Buea.",
};

export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
      <Badge variant="outline" className="mb-6">
        Contact
      </Badge>
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
        Contact Us
      </h1>
      <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed mb-12">
        Interested in collaboration, research opportunities, or visiting our laboratory? Reach out to us.
      </p>

      <Separator className="mb-12" />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <MapPin className="h-8 w-8 text-primary" />
            <CardTitle>Location</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              Faculty of Engineering and Technology
              <br />
              University of Buea
              <br />
              P.O. Box 63, Buea, Cameroon
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <Mail className="h-8 w-8 text-primary" />
            <CardTitle>Email</CardTitle>
          </CardHeader>
          <CardContent>
            <Link
              href="mailto:leec01.ub@gmail.com"
              className="text-primary underline underline-offset-4 hover:text-primary/80"
            >
              leec01.ub@gmail.com
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <Phone className="h-8 w-8 text-primary" />
            <CardTitle>Phone</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">+237 235 656 456</p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <Users className="h-8 w-8 text-primary" />
            <CardTitle>Collaboration &amp; Visits</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              We welcome collaboration proposals, visiting researchers, and student exchange requests from institutions around the world. 
              Please reach out by email with a short description of your project and we will respond within two working days.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
