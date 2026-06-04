import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  LogOut,
  User,
  Briefcase,
  FileText,
  Star,
  Zap,
  MessageSquare,
  Mail,
  Settings,
  MessageCircle,
} from "lucide-react";
import { PageContent } from "@shared/content";
import { useToast } from "@/hooks/use-toast";
import { ICON_OPTIONS, getIcon } from "@/lib/icons";

type AdminSection =
  | "profile"
  | "services"
  | "portfolio"
  | "testimonials"
  | "skills"
  | "contact"
  | "page-content"
  | "site-settings"
  | "inquiries";

const SECTIONS: Array<{
  id: AdminSection;
  label: string;
  icon: React.ReactNode;
}> = [
  { id: "profile", label: "Profile", icon: <User size={20} /> },
  { id: "services", label: "Services", icon: <Briefcase size={20} /> },
  { id: "portfolio", label: "Portfolio", icon: <FileText size={20} /> },
  { id: "testimonials", label: "Testimonials", icon: <MessageSquare size={20} /> },
  { id: "skills", label: "Skills", icon: <Star size={20} /> },
  { id: "contact", label: "Contact Form", icon: <Mail size={20} /> },
  { id: "page-content", label: "Page Content", icon: <FileText size={20} /> },
  { id: "site-settings", label: "Site Settings", icon: <Settings size={20} /> },
  { id: "inquiries", label: "Inquiries", icon: <MessageCircle size={20} /> },
];

export default function Admin() {
  const [activeSection, setActiveSection] = useState<AdminSection>("profile");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/check");
        const data = await response.json();
        setIsAuthenticated(data.authenticated);
        if (!data.authenticated) {
          navigate("/login");
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthenticated(false);
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate]);

  // Fetch content
  const { data: content, isLoading } = useQuery<PageContent>({
    queryKey: ["content"],
    queryFn: async () => {
      const res = await fetch("/api/content");
      if (!res.ok) throw new Error("Failed to fetch content");
      return res.json();
    },
  });

  // Update section mutation
  const updateMutation = useMutation({
    mutationFn: async ({
      section,
      data,
    }: {
      section: string;
      data: any;
    }) => {
      const res = await fetch("/api/content/section", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, data }),
      });
      if (!res.ok) throw new Error("Failed to update");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content"] });
      toast({
        title: "Success!",
        description: "Content updated successfully.",
      });
    },
  });

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (isAuthenticated === null || isLoading || !content) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-xs text-gray-500 mt-1">Manage your content</p>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                activeSection === section.id
                  ? "bg-blue-100 text-blue-700 font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {section.icon}
              <span>{section.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-semibold"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-8">
          {activeSection === "profile" && (
            <ProfileSection content={content} onUpdate={updateMutation.mutate} />
          )}
          {activeSection === "services" && (
            <ServicesSection content={content} onUpdate={updateMutation.mutate} />
          )}
          {activeSection === "portfolio" && (
            <PortfolioSection content={content} onUpdate={updateMutation.mutate} />
          )}
          {activeSection === "testimonials" && (
            <TestimonialsSection content={content} onUpdate={updateMutation.mutate} />
          )}
          {activeSection === "skills" && (
            <SkillsSection content={content} onUpdate={updateMutation.mutate} />
          )}
          {activeSection === "contact" && (
            <ContactFormSection content={content} onUpdate={updateMutation.mutate} />
          )}
          {activeSection === "page-content" && (
            <PageContentSection content={content} onUpdate={updateMutation.mutate} />
          )}
          {activeSection === "site-settings" && (
            <SiteSettingsSection content={content} onUpdate={updateMutation.mutate} />
          )}
          {activeSection === "inquiries" && (
            <InquiriesSection />
          )}
        </div>
      </div>
    </div>
  );
}

// Profile Section
function ProfileSection({
  content,
  onUpdate,
}: {
  content: PageContent;
  onUpdate: (data: any) => void;
}) {
  const about = content.about;
  const [formData, setFormData] = useState(about);

  const handleSave = () => {
    onUpdate({ section: "about", data: formData });
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateContentItem = (index: number, value: string) => {
    const newContent = [...formData.content];
    newContent[index] = value;
    handleChange("content", newContent);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Profile Management</h2>

      <div className="space-y-6">
        {/* Image URL */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Profile Image URL
          </label>
          <input
            type="text"
            value={formData.image || ""}
            onChange={(e) => handleChange("image", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="https://..."
          />
          {formData.image && (
            <div className="mt-4">
              <img
                src={formData.image}
                alt="Profile"
                className="w-32 h-32 rounded-lg object-cover"
              />
            </div>
          )}
        </div>

        {/* Content Paragraphs */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Bio Paragraphs
          </label>
          <div className="space-y-3">
            {formData.content.map((paragraph, idx) => (
              <textarea
                key={idx}
                value={paragraph}
                onChange={(e) => updateContentItem(idx, e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            ))}
          </div>
        </div>

        {/* Stats */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Stats
          </label>
          <div className="space-y-3">
            {formData.stats.map((stat, idx) => (
              <div key={idx} className="flex gap-4">
                <input
                  type="text"
                  value={stat.label}
                  onChange={(e) => {
                    const newStats = [...formData.stats];
                    newStats[idx].label = e.target.value;
                    handleChange("stats", newStats);
                  }}
                  placeholder="Label"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  value={stat.value}
                  onChange={(e) => {
                    const newStats = [...formData.stats];
                    newStats[idx].value = e.target.value;
                    handleChange("stats", newStats);
                  }}
                  placeholder="Value"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Skills
          </label>
          <div className="space-y-3">
            {formData.skills.map((skill, idx) => (
              <div key={idx} className="flex gap-4">
                <input
                  type="text"
                  value={skill.name}
                  onChange={(e) => {
                    const newSkills = [...formData.skills];
                    newSkills[idx].name = e.target.value;
                    handleChange("skills", newSkills);
                  }}
                  placeholder="Skill name"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg"
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={skill.level}
                  onChange={(e) => {
                    const newSkills = [...formData.skills];
                    newSkills[idx].level = parseInt(e.target.value);
                    handleChange("skills", newSkills);
                  }}
                  placeholder="0-100"
                  className="w-24 px-4 py-3 border border-gray-300 rounded-lg"
                />
                <button
                  onClick={() => {
                    const newSkills = formData.skills.filter((_, i) => i !== idx);
                    handleChange("skills", newSkills);
                  }}
                  className="px-4 py-3 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 transition-colors"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() => {
              const newSkills = [...formData.skills, { name: "", level: 50 }];
              handleChange("skills", newSkills);
            }}
            className="mt-3 px-4 py-2 bg-green-100 text-green-700 rounded-lg font-semibold hover:bg-green-200 transition-colors"
          >
            + Add Skill
          </button>
        </div>

        <button
          onClick={handleSave}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

// Services Section
function ServicesSection({
  content,
  onUpdate,
}: {
  content: PageContent;
  onUpdate: (data: any) => void;
}) {
  const [formData, setFormData] = useState(content.services);

  const handleSave = () => {
    onUpdate({ section: "services", data: formData });
  };

  const handleServiceChange = (index: number, field: string, value: any) => {
    const newServices = [...formData.services];
    (newServices[index] as any)[field] = value;
    setFormData({ ...formData, services: newServices });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Services Management</h2>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Section Heading
          </label>
          <input
            type="text"
            value={formData.heading}
            onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Section Subheading
          </label>
          <textarea
            value={formData.subheading}
            onChange={(e) => setFormData({ ...formData, subheading: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="border-t pt-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Custom Solutions Section</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Custom Solutions Text
              </label>
              <textarea
                value={formData.customSolutionsText || ""}
                onChange={(e) => setFormData({ ...formData, customSolutionsText: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                placeholder="Text shown above the 'Discuss Your Project' button"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Button Text
              </label>
              <input
                type="text"
                value={formData.customSolutionsButtonText || "Discuss Your Project"}
                onChange={(e) => setFormData({ ...formData, customSolutionsButtonText: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                placeholder="Button text"
              />
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Services</h3>
          <div className="space-y-6">
            {formData.services.map((service, idx) => (
              <div key={service.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <input
                    type="text"
                    value={service.title}
                    onChange={(e) => handleServiceChange(idx, "title", e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-semibold"
                    placeholder="Service title"
                  />
                  <button
                    onClick={() => {
                      const newServices = formData.services.filter((_, i) => i !== idx);
                      setFormData({ ...formData, services: newServices });
                    }}
                    className="ml-3 px-4 py-2 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 transition-colors"
                  >
                    Delete
                  </button>
                </div>
                <textarea
                  value={service.description}
                  onChange={(e) => handleServiceChange(idx, "description", e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3"
                  placeholder="Description"
                />
                <input
                  type="text"
                  value={service.price}
                  onChange={(e) => handleServiceChange(idx, "price", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3"
                  placeholder="Price"
                />
                <div className="mb-3">
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Icon
                  </label>
                  <select
                    value={service.icon}
                    onChange={(e) => handleServiceChange(idx, "icon", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select an icon</option>
                    {ICON_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {service.icon && (() => {
                    const IconComponent = getIcon(service.icon);
                    return IconComponent ? (
                      <div className="flex items-center gap-2 mt-2 p-2 bg-blue-50 rounded">
                        <div className="p-2 bg-blue-600 rounded">
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-sm text-gray-600">Preview</span>
                      </div>
                    ) : null;
                  })()}
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Features
                  </label>
                  <div className="space-y-2">
                    {service.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex gap-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => {
                            const newServices = [...formData.services];
                            newServices[idx].features[fIdx] = e.target.value;
                            setFormData({ ...formData, services: newServices });
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                          placeholder="Feature"
                        />
                        <button
                          onClick={() => {
                            const newServices = [...formData.services];
                            newServices[idx].features = newServices[idx].features.filter((_, i) => i !== fIdx);
                            setFormData({ ...formData, services: newServices });
                          }}
                          className="px-3 py-2 bg-red-100 text-red-700 rounded font-semibold hover:bg-red-200 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      const newServices = [...formData.services];
                      newServices[idx].features.push("");
                      setFormData({ ...formData, services: newServices });
                    }}
                    className="mt-2 px-3 py-1 bg-green-100 text-green-700 rounded text-sm font-semibold hover:bg-green-200 transition-colors"
                  >
                    + Add Feature
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => {
              const newService = {
                id: Date.now().toString(),
                title: "",
                description: "",
                features: [],
                price: "",
                icon: "zap",
              };
              setFormData({ ...formData, services: [...formData.services, newService] });
            }}
            className="mt-4 px-4 py-2 bg-green-100 text-green-700 rounded-lg font-semibold hover:bg-green-200 transition-colors"
          >
            + Add Service
          </button>
        </div>

        <button
          onClick={handleSave}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

// Portfolio Section
function PortfolioSection({
  content,
  onUpdate,
}: {
  content: PageContent;
  onUpdate: (data: any) => void;
}) {
  const [formData, setFormData] = useState(content.work);

  const handleSave = () => {
    onUpdate({ section: "work", data: formData });
  };

  const handleProjectChange = (index: number, field: string, value: any) => {
    const newProjects = [...formData.projects];
    (newProjects[index] as any)[field] = value;
    setFormData({ ...formData, projects: newProjects });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Portfolio Management</h2>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Section Heading
          </label>
          <input
            type="text"
            value={formData.heading}
            onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Section Subheading
          </label>
          <textarea
            value={formData.subheading}
            onChange={(e) => setFormData({ ...formData, subheading: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="border-t pt-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Projects</h3>
          <div className="space-y-6">
            {formData.projects.map((project, idx) => (
              <div key={project.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <input
                    type="text"
                    value={project.title}
                    onChange={(e) => handleProjectChange(idx, "title", e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-semibold"
                    placeholder="Project title"
                  />
                  <button
                    onClick={() => {
                      const newProjects = formData.projects.filter((_, i) => i !== idx);
                      setFormData({ ...formData, projects: newProjects });
                    }}
                    className="ml-3 px-4 py-2 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 transition-colors"
                  >
                    Delete
                  </button>
                </div>
                <input
                  type="text"
                  value={project.image}
                  onChange={(e) => handleProjectChange(idx, "image", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3"
                  placeholder="Image URL"
                />
                {project.image && (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-40 object-cover rounded-lg mb-3"
                  />
                )}
                <textarea
                  value={project.description}
                  onChange={(e) => handleProjectChange(idx, "description", e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3"
                  placeholder="Description"
                />
                <input
                  type="text"
                  value={(project as any).clientOrder || ""}
                  onChange={(e) => handleProjectChange(idx, "clientOrder", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3"
                  placeholder="Category (e.g., Client Work, Personal Project)"
                />
                <input
                  type="text"
                  value={project.link}
                  onChange={(e) => handleProjectChange(idx, "link", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3"
                  placeholder="Project link"
                />
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Tags
                  </label>
                  <div className="space-y-2">
                    {project.tags.map((tag, tIdx) => (
                      <div key={tIdx} className="flex gap-2">
                        <input
                          type="text"
                          value={tag}
                          onChange={(e) => {
                            const newProjects = [...formData.projects];
                            newProjects[idx].tags[tIdx] = e.target.value;
                            setFormData({ ...formData, projects: newProjects });
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                          placeholder="Tag"
                        />
                        <button
                          onClick={() => {
                            const newProjects = [...formData.projects];
                            newProjects[idx].tags = newProjects[idx].tags.filter((_, i) => i !== tIdx);
                            setFormData({ ...formData, projects: newProjects });
                          }}
                          className="px-3 py-2 bg-red-100 text-red-700 rounded font-semibold hover:bg-red-200 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      const newProjects = [...formData.projects];
                      newProjects[idx].tags.push("");
                      setFormData({ ...formData, projects: newProjects });
                    }}
                    className="mt-2 px-3 py-1 bg-green-100 text-green-700 rounded text-sm font-semibold hover:bg-green-200 transition-colors"
                  >
                    + Add Tag
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => {
              const newProject = {
                id: Date.now().toString(),
                title: "",
                description: "",
                tags: [],
                image: "",
                link: "",
                clientOrder: "",
              };
              setFormData({ ...formData, projects: [...formData.projects, newProject] });
            }}
            className="mt-4 px-4 py-2 bg-green-100 text-green-700 rounded-lg font-semibold hover:bg-green-200 transition-colors"
          >
            + Add Project
          </button>
        </div>

        <button
          onClick={handleSave}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

// Testimonials Section
function TestimonialsSection({
  content,
  onUpdate,
}: {
  content: PageContent;
  onUpdate: (data: any) => void;
}) {
  const [formData, setFormData] = useState(content.testimonials);

  const handleSave = () => {
    onUpdate({ section: "testimonials", data: formData });
  };

  const handleTestimonialChange = (index: number, field: string, value: any) => {
    const newTestimonials = [...formData.testimonials];
    (newTestimonials[index] as any)[field] = value;
    setFormData({ ...formData, testimonials: newTestimonials });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Testimonials Management</h2>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Section Heading
          </label>
          <input
            type="text"
            value={formData.heading}
            onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Section Subheading
          </label>
          <textarea
            value={formData.subheading}
            onChange={(e) => setFormData({ ...formData, subheading: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="border-t pt-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Call to Action Section</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Trust Label
              </label>
              <input
                type="text"
                value={formData.trustLabel || ""}
                onChange={(e) => setFormData({ ...formData, trustLabel: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                placeholder="e.g., ⭐ 4.9 rating from 20+ reviews"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                CTA Heading
              </label>
              <input
                type="text"
                value={formData.ctaHeading || ""}
                onChange={(e) => setFormData({ ...formData, ctaHeading: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                placeholder="e.g., Ready to join these satisfied clients?"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                CTA Text
              </label>
              <input
                type="text"
                value={formData.ctaText || ""}
                onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                placeholder="e.g., Start Your Success Story"
              />
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Testimonials</h3>
          <div className="space-y-6">
            {formData.testimonials.map((testimonial, idx) => (
              <div key={testimonial.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <input
                    type="text"
                    value={testimonial.name}
                    onChange={(e) => handleTestimonialChange(idx, "name", e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-semibold"
                    placeholder="Client name"
                  />
                  <button
                    onClick={() => {
                      const newTestimonials = formData.testimonials.filter((_, i) => i !== idx);
                      setFormData({ ...formData, testimonials: newTestimonials });
                    }}
                    className="ml-3 px-4 py-2 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 transition-colors"
                  >
                    Delete
                  </button>
                </div>
                <input
                  type="text"
                  value={testimonial.title}
                  onChange={(e) => handleTestimonialChange(idx, "title", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3"
                  placeholder="Position/Title"
                />
                <input
                  type="text"
                  value={testimonial.company}
                  onChange={(e) => handleTestimonialChange(idx, "company", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3"
                  placeholder="Company"
                />
                <input
                  type="text"
                  value={testimonial.image || ""}
                  onChange={(e) => handleTestimonialChange(idx, "image", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3"
                  placeholder="Image URL"
                />
                {testimonial.image && (
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover mb-3"
                  />
                )}
                <textarea
                  value={testimonial.content}
                  onChange={(e) => handleTestimonialChange(idx, "content", e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3"
                  placeholder="Testimonial text"
                />
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Rating (1-5)
                  </label>
                  <select
                    value={testimonial.rating}
                    onChange={(e) =>
                      handleTestimonialChange(idx, "rating", parseInt(e.target.value))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    {[1, 2, 3, 4, 5].map((r) => (
                      <option key={r} value={r}>
                        {r} Stars
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => {
              const newTestimonial = {
                id: Date.now().toString(),
                name: "",
                title: "",
                company: "",
                content: "",
                rating: 5,
                image: "",
              };
              setFormData({ ...formData, testimonials: [...formData.testimonials, newTestimonial] });
            }}
            className="mt-4 px-4 py-2 bg-green-100 text-green-700 rounded-lg font-semibold hover:bg-green-200 transition-colors"
          >
            + Add Testimonial
          </button>
        </div>

        <button
          onClick={handleSave}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

// Skills Section (simplified - managed in Profile)
function SkillsSection({
  content,
  onUpdate,
}: {
  content: PageContent;
  onUpdate: (data: any) => void;
}) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Skills Management</h2>
      <p className="text-gray-600 mb-4">Skills are managed in the Profile section.</p>
      <a
        href="#profile"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 inline-block"
      >
        Go to Profile
      </a>
    </div>
  );
}

// Contact Form Section
function ContactFormSection({
  content,
  onUpdate,
}: {
  content: PageContent;
  onUpdate: (data: any) => void;
}) {
  const [formData, setFormData] = useState(content.contact);

  const handleSave = () => {
    onUpdate({ section: "contact", data: formData });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Contact Form Management</h2>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Phone
          </label>
          <input
            type="text"
            value={formData.phone || ""}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="border-t pt-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Project Types</h3>
          <div className="space-y-3">
            {(formData.projectTypes || []).map((type, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  type="text"
                  value={type}
                  onChange={(e) => {
                    const newTypes = [...(formData.projectTypes || [])];
                    newTypes[idx] = e.target.value;
                    setFormData({ ...formData, projectTypes: newTypes });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Project type"
                />
                <button
                  onClick={() => {
                    const newTypes = (formData.projectTypes || []).filter((_, i) => i !== idx);
                    setFormData({ ...formData, projectTypes: newTypes });
                  }}
                  className="px-3 py-2 bg-red-100 text-red-700 rounded font-semibold hover:bg-red-200 transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() => {
              const newTypes = [...(formData.projectTypes || []), ""];
              setFormData({ ...formData, projectTypes: newTypes });
            }}
            className="mt-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg font-semibold hover:bg-green-200 transition-colors"
          >
            + Add Project Type
          </button>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Budget Ranges</h3>
          <div className="space-y-3">
            {(formData.budgetRanges || []).map((range, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  type="text"
                  value={range}
                  onChange={(e) => {
                    const newRanges = [...(formData.budgetRanges || [])];
                    newRanges[idx] = e.target.value;
                    setFormData({ ...formData, budgetRanges: newRanges });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Budget range (e.g., $1,000 - $5,000)"
                />
                <button
                  onClick={() => {
                    const newRanges = (formData.budgetRanges || []).filter((_, i) => i !== idx);
                    setFormData({ ...formData, budgetRanges: newRanges });
                  }}
                  className="px-3 py-2 bg-red-100 text-red-700 rounded font-semibold hover:bg-red-200 transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() => {
              const newRanges = [...(formData.budgetRanges || []), ""];
              setFormData({ ...formData, budgetRanges: newRanges });
            }}
            className="mt-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg font-semibold hover:bg-green-200 transition-colors"
          >
            + Add Budget Range
          </button>
        </div>

        <button
          onClick={handleSave}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

// Page Content Section
function PageContentSection({
  content,
  onUpdate,
}: {
  content: PageContent;
  onUpdate: (data: any) => void;
}) {
  const [formData, setFormData] = useState({
    hero: content.hero,
    cta: content.cta,
  });

  const handleSave = () => {
    onUpdate({ section: "hero", data: formData.hero });
    onUpdate({ section: "cta", data: formData.cta });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Page Content</h2>

      <div className="space-y-8">
        {/* Hero Section */}
        <div className="border-b pb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Hero Section</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Header Profile Image URL
              </label>
              <input
                type="text"
                value={formData.hero.profileImage || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hero: { ...formData.hero, profileImage: e.target.value },
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="https://..."
              />
              {formData.hero.profileImage && (
                <div className="mt-4">
                  <img
                    src={formData.hero.profileImage}
                    alt="Header Profile"
                    className="w-32 h-32 rounded-lg object-cover"
                  />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Headline
              </label>
              <input
                type="text"
                value={formData.hero.headline}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hero: { ...formData.hero, headline: e.target.value },
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Subheadline
              </label>
              <textarea
                value={formData.hero.subheadline}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hero: { ...formData.hero, subheadline: e.target.value },
                  })
                }
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Stats
              </label>
              <div className="space-y-3">
                {formData.hero.stats.map((stat, idx) => (
                  <div key={idx} className="flex gap-4">
                    <input
                      type="text"
                      value={stat.label}
                      onChange={(e) => {
                        const newStats = [...formData.hero.stats];
                        newStats[idx].label = e.target.value;
                        setFormData({
                          ...formData,
                          hero: { ...formData.hero, stats: newStats },
                        });
                      }}
                      placeholder="Label"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg"
                    />
                    <input
                      type="text"
                      value={stat.value}
                      onChange={(e) => {
                        const newStats = [...formData.hero.stats];
                        newStats[idx].value = e.target.value;
                        setFormData({
                          ...formData,
                          hero: { ...formData.hero, stats: newStats },
                        });
                      }}
                      placeholder="Value"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Primary CTA
                </label>
                <input
                  type="text"
                  value={formData.hero.primaryCta}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hero: { ...formData.hero, primaryCta: e.target.value },
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Secondary CTA
                </label>
                <input
                  type="text"
                  value={formData.hero.secondaryCta}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hero: { ...formData.hero, secondaryCta: e.target.value },
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-4">
                Trust Labels (shown under buttons)
              </label>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Rating Label
                  </label>
                  <input
                    type="text"
                    value={formData.hero.trustLabels?.rating || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hero: {
                          ...formData.hero,
                          trustLabels: {
                            ...formData.hero.trustLabels,
                            rating: e.target.value,
                          } as any,
                        },
                      })
                    }
                    placeholder="e.g., 5.0 rating"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Clients Label
                  </label>
                  <input
                    type="text"
                    value={formData.hero.trustLabels?.clients || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hero: {
                          ...formData.hero,
                          trustLabels: {
                            ...formData.hero.trustLabels,
                            clients: e.target.value,
                          } as any,
                        },
                      })
                    }
                    placeholder="e.g., 20+ happy clients"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Response Time Label
                  </label>
                  <input
                    type="text"
                    value={formData.hero.trustLabels?.response || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hero: {
                          ...formData.hero,
                          trustLabels: {
                            ...formData.hero.trustLabels,
                            response: e.target.value,
                          } as any,
                        },
                      })
                    }
                    placeholder="e.g., 24 hours response"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">CTA Section</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Heading
              </label>
              <input
                type="text"
                value={formData.cta.heading}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    cta: { ...formData.cta, heading: e.target.value },
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Subheading
              </label>
              <textarea
                value={formData.cta.subheading}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    cta: { ...formData.cta, subheading: e.target.value },
                  })
                }
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

// Site Settings Section
function SiteSettingsSection({
  content,
  onUpdate,
}: {
  content: PageContent;
  onUpdate: (data: any) => void;
}) {
  const [formData, setFormData] = useState({
    contact: content.contact,
  });

  const handleSave = () => {
    onUpdate({ section: "contact", data: formData.contact });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Site Settings</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
          <input
            type="email"
            value={formData.contact.email}
            onChange={(e) =>
              setFormData({
                ...formData,
                contact: { ...formData.contact, email: e.target.value },
              })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Phone</label>
          <input
            type="text"
            value={formData.contact.phone || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                contact: { ...formData.contact, phone: e.target.value },
              })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Contact Section Heading
          </label>
          <input
            type="text"
            value={formData.contact.heading}
            onChange={(e) =>
              setFormData({
                ...formData,
                contact: { ...formData.contact, heading: e.target.value },
              })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Contact Section Subheading
          </label>
          <textarea
            value={formData.contact.subheading}
            onChange={(e) =>
              setFormData({
                ...formData,
                contact: { ...formData.contact, subheading: e.target.value },
              })
            }
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          />
        </div>

        <button
          onClick={handleSave}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

// Inquiries Section
function InquiriesSection() {
  const { data: inquiries } = useQuery({
    queryKey: ["inquiries"],
    queryFn: async () => {
      const res = await fetch("/api/contacts");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Contact Inquiries</h2>

      {inquiries && inquiries.length > 0 ? (
        <div className="space-y-4">
          {inquiries.map((inquiry: any) => (
            <div key={inquiry.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold text-gray-900">{inquiry.name}</p>
                  <p className="text-sm text-gray-600">{inquiry.email}</p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    inquiry.read ? "bg-gray-100" : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {inquiry.read ? "Read" : "Unread"}
                </span>
              </div>
              <p className="text-gray-700">{inquiry.message}</p>
              <p className="text-xs text-gray-500 mt-2">
                {new Date(inquiry.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No inquiries yet.</p>
      )}
    </div>
  );
}
