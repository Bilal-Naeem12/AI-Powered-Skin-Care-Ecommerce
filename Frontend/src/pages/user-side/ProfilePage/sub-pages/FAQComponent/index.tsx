import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Container,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const faqData = [
  {
    category: "General",
    items: [
      {
        question: "What is SkinCare Pro?",
        answer:
          "SkinCare Pro is an AI-powered skincare platform that analyzes your skin through real-time face scanning and recommends personalized skincare products based on your unique needs.",
      },
      {
        question: "Is my data safe with SkinCare Pro?",
        answer:
          "Yes. We prioritize user privacy and only use your data to provide personalized recommendations. Your data is encrypted and never shared without consent.",
      },
    ],
  },
  {
    category: "Face Scan & Analysis",
    items: [
      {
        question: "How does the AI face scan work?",
        answer:
          "Our system uses MediaPipe and deep learning models to detect skin conditions like acne, dryness, and oiliness in real-time, based on camera input.",
      },
      {
        question: "What do I need to prepare before scanning?",
        answer:
          "Ensure you are in a well-lit environment and your face is centered within the camera view. Remove any makeup for the most accurate results.",
      },
    ],
  },
  {
    category: "Products & Recommendations",
    items: [
      {
        question: "Are the product suggestions personalized?",
        answer:
          "Absolutely. All product suggestions are based on your scanned skin conditions, your skin type, and previous interaction history.",
      },
      {
        question: "Can I filter products based on ingredients or preferences?",
        answer:
          "Yes, you can filter products by brand, category, skin type compatibility, price, and specific ingredients.",
      },
    ],
  },
  {
    category: "Technical Help",
    items: [
      {
        question: "The scan isn’t detecting my face. What should I do?",
        answer:
          "Make sure camera permissions are enabled, your face is inside the oval guide, and the room is well-lit. Try refreshing the page if issues persist.",
      },
      {
        question: "Can I use the scan on mobile devices?",
        answer:
          "Yes, SkinCare Pro is optimized for both desktop and mobile browsers. Make sure to allow camera access when prompted.",
      },
    ],
  },
];

const FAQComponent: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
    <div className="card shadow-lg p-5 bg-white" >      <Typography variant="h4" align="center" gutterBottom>
        Frequently Asked Questions
      </Typography>

      {faqData.map((section) => (
        <Box key={section.category} sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            {section.category}
          </Typography>
          {section.items.map((faq, index) => (
            <Accordion key={index}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{faq.question}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2">{faq.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      ))}
      </div>

    </Container>
  );
};

export default FAQComponent;
