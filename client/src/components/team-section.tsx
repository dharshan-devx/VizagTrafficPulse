import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Linkedin, Github } from "lucide-react";

export default function TeamSection() {
  const teamMembers = [
    {
      name: "Dr. Sarah Johnson",
      role: "Project Lead & Data Scientist",
      color: "primary",
    },
    {
      name: "Rajesh Kumar", 
      role: "Machine Learning Engineer",
      color: "secondary",
    },
    {
      name: "Priya Sharma",
      role: "Data Analyst & Visualization",
      color: "accent",
    },
    {
      name: "Michael Chen",
      role: "Full-Stack Developer",
      color: "primary",
    },
  ];

  return (
    <section id="team" className="py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-6 text-secondary" data-testid="team-title">Our Team</h2>
            <p className="text-xl text-muted-foreground" data-testid="team-description">
              The talented individuals behind the Vizag Traffic Pulse project
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card
                key={index}
                className={`glass-card p-8 rounded-xl border border-${member.color}/20 hover:border-${member.color}/40 transition-all duration-300 transform hover:scale-105 group`}
                data-testid={`team-member-${index}`}
              >
                <CardContent className="p-0">
                  <div className="text-center">
                    <div className={`w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-${member.color}/20 to-secondary/20 flex items-center justify-center overflow-hidden`}>
                      <User className={`text-${member.color} text-4xl w-12 h-12`} />
                    </div>
                    <h3 className={`text-xl font-bold mb-2 text-${member.color}`} data-testid={`member-name-${index}`}>
                      {member.name}
                    </h3>
                    <p className="text-muted-foreground mb-4" data-testid={`member-role-${index}`}>
                      {member.role}
                    </p>
                    <div className="flex justify-center space-x-4">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className={`text-${member.color} hover:text-${member.color}/80`}
                        data-testid={`member-linkedin-${index}`}
                      >
                        <Linkedin className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className={`text-${member.color} hover:text-${member.color}/80`}
                        data-testid={`member-github-${index}`}
                      >
                        <Github className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
