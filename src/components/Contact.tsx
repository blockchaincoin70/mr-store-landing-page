import { useState } from "react";
import { Phone, Mail, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description: "We'll get back to you within 24 hours.",
    });
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section className="py-20 bg-slate-900 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Get In Touch</h2>
          <p className="text-xl text-slate-300">
            Ready to start your construction project? Contact us today for expert advice and competitive quotes.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Phone className="h-5 w-5 text-orange-400" />
                  <span>Call Us</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-lg font-semibold text-orange-400">+91 86387 57425</div>
                  <p className="text-slate-300">Available 7 days a week, 8 AM - 8 PM</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Mail className="h-5 w-5 text-orange-400" />
                  <span>Email Us</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-semibold text-orange-400 mb-2">
                  mrstoreofficial24@gmail.com
                </div>
                <p className="text-slate-300">We respond to all emails within 24 hours</p>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Building className="h-5 w-5 text-orange-400" />
                  <span>Visit Our Store</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">
                  Our experienced team is ready to help you choose the right materials for your project. 
                  Visit us for personalized consultation and competitive pricing.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Card className="bg-white text-slate-900">
            <CardHeader>
              <CardTitle>Send Us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Input
                      placeholder="Your Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <Input
                      type="email"
                      placeholder="Email Address"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <Input
                  type="tel"
                  placeholder="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
                <Textarea
                  placeholder="Tell us about your project requirements..."
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  required
                />
                <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Contact;
