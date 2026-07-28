import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MapPin, Mail, Phone } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
      <Badge variant="outline" className="mb-6">Contact</Badge>
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
        Get in Touch
      </h1>
      <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed mb-12">
        Interested in collaboration, research opportunities, or visiting our laboratory? Reach out to us.
      </p>

      <Separator className="mb-12" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-5 w-5 text-foreground" />
            </div>
            <h3 className="font-semibold mb-1">Location</h3>
            <p className="text-sm text-muted-foreground">
              Faculty of Engineering and Technology<br />
              University of Buea<br />
              Buea, Cameroon
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Mail className="h-5 w-5 text-foreground" />
            </div>
            <h3 className="font-semibold mb-1">Email</h3>
            <p className="text-sm text-muted-foreground">
              leec@ub.cm
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Phone className="h-5 w-5 text-foreground" />
            </div>
            <h3 className="font-semibold mb-1">Phone</h3>
            <p className="text-sm text-muted-foreground">
              +237 3332 2154
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
