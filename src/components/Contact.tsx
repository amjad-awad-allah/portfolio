
import { useLanguage } from "@/context/LanguageContext";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, User, Github, Linkedin, MapPin } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";
import { usePersonalInfo } from "@/hooks/use-supabase-data";
import { motion } from "framer-motion";
import { sendEmail } from "@/lib/db";
import { useStaticContent } from "@/hooks/use-static-content";

// Custom icon components for services that aren't in lucide-react
const XingIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18.188 2.675c-.23 0-.43.16-.525.4l-3.175 5.55c0 .005 0 .005 0 .01l5 8.875c.1.235.295.4.525.4h3.8c.305 0 .535-.28.425-.575L19.02 8.455l3.23-5.375c.105-.28-.13-.56-.435-.56h-3.62l-.005.005zM8 5.675c-.3 0-.53.275-.425.57l2.475 4.27-3.905 6.85c-.11.29.12.57.425.57h3.8c.235 0 .44-.165.525-.4l3.95-6.935c0-.01 0-.01 0-.016l-2.475-4.27c-.09-.24-.3-.4-.525-.4H8z" />
  </svg>
);

const IndeedIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M10 3v18M15 11.495l3 3.005-3 3" />
  </svg>
);

type Inputs = {
  name: string;
  email: string;
  message: string;
};

const Contact = () => {
  const { t, language } = useLanguage();
  const { data: personalInfo } = usePersonalInfo();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const { getText } = useStaticContent('contact');
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      console.log("Sending email with data:", data);
      console.log("To recipient:", personalInfo?.email);
      
      const result = await sendEmail(data, personalInfo?.email);
      
      if (result.success) {
        setIsEmailSent(true);
        toast({
          title: language === 'en' ? "Success!" : "Erfolg!",
          description: language === 'en' ? "Your message has been sent successfully." : "Ihre Nachricht wurde erfolgreich gesendet.",
        });
        reset();
      } else {
        setSubmissionError(result.error || (language === 'en' ? 'Failed to send email.' : 'E-Mail konnte nicht gesendet werden.'));
        toast({
          title: language === 'en' ? "Error!" : "Fehler!",
          description: result.error || (language === 'en' ? "Failed to send email." : "E-Mail konnte nicht gesendet werden."),
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error("Form submission error:", error);
      setSubmissionError(error.message || (language === 'en' ? 'An unexpected error occurred.' : 'Ein unerwarteter Fehler ist aufgetreten.'));
      toast({
        title: language === 'en' ? "Error!" : "Fehler!",
        description: error.message || (language === 'en' ? "An unexpected error occurred." : "Ein unerwarteter Fehler ist aufgetreten."),
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="bg-secondary/10 dark:bg-secondary/20 relative">
      <div className="absolute inset-0 -z-10 bg-grid-pattern opacity-[0.02]"></div>
      <div className="absolute inset-0 -z-10 ai-pattern opacity-20"></div>

      <div className="section-container">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="heading-lg mb-3 text-foreground">
            {t("contact.title")}
          </h2>
          <p className="paragraph max-w-2xl mx-auto">
            {t("contact.subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <motion.div 
            className="glass-card p-6 rounded-xl shadow-sm tech-border"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="heading-sm mb-4">{t("contact.connect")}</h3>
            <p className="text-sm text-muted-foreground mb-6">
              {t("contact.openTo")}
            </p>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder={t("contact.name") || (language === 'en' ? "Your Name" : "Ihr Name")}
                    className="pl-10"
                    {...register("name", { required: getText('name_required', language === 'en' ? "Name is required" : "Name ist erforderlich") })}
                  />
                </div>
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                )}
              </div>
              <div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder={t("contact.email") || (language === 'en' ? "Your Email" : "Ihre E-Mail")}
                    className="pl-10"
                    {...register("email", {
                      required: getText('email_required', language === 'en' ? "Email is required" : "E-Mail ist erforderlich"),
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: t("contact.emailInvalid") || (language === 'en' ? "Invalid email address" : "Ungültige E-Mail-Adresse"),
                      },
                    })}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                )}
              </div>
              <div>
                <Textarea
                  placeholder={t("contact.message") || (language === 'en' ? "Your Message" : "Ihre Nachricht")}
                  className="resize-none"
                  rows={4}
                  {...register("message", { required: t("contact.messageRequired") || (language === 'en' ? "Message is required" : "Nachricht ist erforderlich") })}
                />
                {errors.message && (
                  <p className="text-sm text-red-500 mt-1">{errors.message.message}</p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (t("contact.sending") || (language === 'en' ? "Sending..." : "Senden...")) : (t("contact.send") || (language === 'en' ? "Send Message" : "Nachricht senden"))}
              </Button>
              {submissionError && (
                <p className="text-sm text-red-500 mt-2">{submissionError}</p>
              )}
              {isEmailSent && (
                <p className="text-sm text-green-500 mt-2">{language === 'en' ? "Your message has been sent successfully!" : "Ihre Nachricht wurde erfolgreich gesendet!"}</p>
              )}
            </form>
          </motion.div>

          {/* Contact Information */}
          <motion.div 
            className="glass-card p-6 rounded-xl shadow-sm tech-border flex flex-col justify-between"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div>
              <h3 className="heading-sm mb-6">{t("contact.reachOut")}</h3>
              <div className="space-y-5">
                {personalInfo?.email ? (
                  <div className="flex items-center gap-3 group">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground uppercase font-medium mb-1">
                        {t("contact.email")}
                      </div>
                      <a href={`mailto:${personalInfo.email}`} className="hover:text-primary transition-colors">
                        {personalInfo.email}
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground uppercase font-medium mb-1">
                        {t("contact.email")}
                      </div>
                      <span className="text-muted-foreground">{t("contact.emailNotProvided")}</span>
                    </div>
                  </div>
                )}
                
                {personalInfo?.phone_number ? (
                  <div className="flex items-center gap-3 group">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground uppercase font-medium mb-1">
                        {t("contact.phone")}
                      </div>
                      <a href={`tel:${personalInfo.phone_number}`} className="hover:text-primary transition-colors">
                        {personalInfo.phone_number}
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground uppercase font-medium mb-1">
                        {t("contact.phone")}
                      </div>
                      <span className="text-muted-foreground">{language === 'en' ? "Phone number not provided" : "Telefonnummer nicht angegeben"}</span>
                    </div>
                  </div>
                )}
                
                {personalInfo?.current_location && (
                  <div className="flex items-center gap-3 group">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground uppercase font-medium mb-1">
                        {t("contact.location")}
                      </div>
                      <span>{personalInfo.current_location}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Social Media Links */}
              <div className="mt-8">
                <div className="text-xs text-muted-foreground uppercase font-medium mb-3">
                  {getText('social_media', language === 'en' ? 'Connect on social media' : 'In sozialen Medien verbinden')}
                </div>
                <div className="flex gap-3">
                  {personalInfo?.linkedin_url && (
                    <a 
                      href={personalInfo.linkedin_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                      aria-label="LinkedIn Profile"
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                  )}
                  
                  {personalInfo?.github_url && (
                    <a 
                      href={personalInfo.github_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                      aria-label="GitHub Profile"
                    >
                      <Github className="h-5 w-5" />
                    </a>
                  )}
                  
                  {personalInfo?.xing_url && (
                    <a 
                      href={personalInfo.xing_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                      aria-label="Xing Profile"
                    >
                      <XingIcon className="h-5 w-5" />
                    </a>
                  )}
                  
                  {personalInfo?.indeed_url && (
                    <a 
                      href={personalInfo.indeed_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                      aria-label="Indeed Profile"
                    >
                      <IndeedIcon className="h-5 w-5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
