const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Disease = require('../models/Disease');

dotenv.config();

const diseasesData = [
  {
    name: "COVID-19",
    description: "An infectious respiratory disease caused by the SARS-CoV-2 virus, affecting the upper and lower respiratory tracts.",
    symptoms: ["fever", "dry cough", "fatigue", "shortness of breath", "loss of taste or smell", "body aches"],
    precautions: ["Isolate immediately in a well-ventilated room", "Wear an N95 respirator mask around others", "Monitor oxygen saturation with a pulse oximeter", "Stay well hydrated and rest completely"],
    preventionTips: ["Receive updated COVID-19 vaccinations and boosters", "Practice regular hand hygiene with soap or sanitizer", "Avoid crowded and poorly ventilated indoor spaces", "Maintain physical distance during outbreaks"],
    suggestedMedicines: ["Paracetamol (for fever/pain)", "Vitamin C & Zinc supplements", "Throat lozenges", "Saline nasal spray"]
  },
  {
    name: "Dengue Fever",
    description: "A mosquito-borne viral infection causing severe flu-like illness and sometimes potentially lethal complications called severe dengue.",
    symptoms: ["high fever", "severe headache", "pain behind eyes", "severe joint and muscle pain", "skin rash", "nausea and vomiting"],
    precautions: ["Get strict bed rest", "Drink plenty of oral rehydration solutions (ORS) and coconut water", "Avoid NSAIDs like ibuprofen or aspirin due to bleeding risk", "Monitor platelet counts daily"],
    preventionTips: ["Use mosquito repellents containing DEET or Picaridin", "Wear long-sleeved shirts and long pants", "Use window screens and mosquito bed nets", "Eliminate standing water where Aedes mosquitoes breed"],
    suggestedMedicines: ["Acetaminophen / Paracetamol", "Oral Rehydration Salts (ORS)", "Multivitamins"]
  },
  {
    name: "Typhoid Fever",
    description: "A systemic bacterial infection caused by Salmonella typhi, typically transmitted through contaminated food or drinking water.",
    symptoms: ["prolonged high fever", "headache", "abdominal pain", "constipation or diarrhea", "weakness and fatigue", "rose-colored spots on chest"],
    precautions: ["Drink only boiled or scientifically purified water", "Eat soft, easily digestible, and thoroughly cooked hot meals", "Wash hands strictly before eating and after toilet use", "Ensure complete bed rest during high fever"],
    preventionTips: ["Get vaccinated against Typhoid (Vi polysaccharide or conjugate vaccine)", "Avoid eating raw or street-vended food in endemic areas", "Drink sealed bottled water when traveling", "Practice proper sanitation and hygiene"],
    suggestedMedicines: ["Paracetamol", "Oral Rehydration Salts (ORS)", "Probiotic supplements"]
  },
  {
    name: "Type 2 Diabetes Mellitus",
    description: "A chronic metabolic disorder characterized by high blood glucose levels due to insulin resistance or relative insulin deficiency.",
    symptoms: ["increased thirst (polydipsia)", "frequent urination (polyuria)", "extreme hunger", "unexplained weight loss", "fatigue", "blurred vision"],
    precautions: ["Check blood glucose levels regularly using a glucometer", "Inspect feet daily for cuts, blisters, or slow-healing wounds", "Avoid refined sugar and high-glycemic index carbohydrates", "Stay well hydrated with plain water"],
    preventionTips: ["Maintain a healthy body weight and BMI", "Engage in at least 150 minutes of moderate aerobic exercise weekly", "Adopt a balanced diet rich in dietary fiber, vegetables, and lean protein", "Limit processed foods and sugary beverages"],
    suggestedMedicines: ["Sugar-free multivitamin supplements", "Omega-3 fatty acids", "Alpha-lipoic acid supplements"]
  },
  {
    name: "Tuberculosis (TB)",
    description: "An infectious disease caused by Mycobacterium tuberculosis that primarily affects the lungs but can affect other parts of the body.",
    symptoms: ["persistent cough lasting over 3 weeks", "coughing up blood or sputum", "chest pain with breathing", "unintentional weight loss", "night sweats", "fever and chills"],
    precautions: ["Cover mouth and nose with a tissue when coughing or sneezing", "Isolate in a well-ventilated room to prevent airborne spread", "Use a separate set of utensils and personal hygiene items", "Do NOT stop prescribed antibiotics prematurely"],
    preventionTips: ["Administer BCG vaccine in infants where recommended", "Ensure adequate indoor ventilation and sunlight exposure", "Avoid close, prolonged contact with individuals having active untreated TB", "Maintain a strong immune system with proper nutrition"],
    suggestedMedicines: ["Vitamin B6 (Pyridoxine) supplements", "High-protein nutritional supplements", "Multivitamins"]
  },
  {
    name: "Malaria",
    description: "A life-threatening blood disease caused by Plasmodium parasites transmitted to humans through the bites of infected female Anopheles mosquitoes.",
    symptoms: ["cyclical high fever with shaking chills", "profuse sweating as fever breaks", "severe headache", "nausea and vomiting", "muscle and joint pain", "general fatigue"],
    precautions: ["Rest in bed in a temperature-controlled room", "Consume lukewarm fluids and electrolyte solutions", "Monitor body temperature every 4 to 6 hours", "Seek immediate medical attention if confusion or dark urine occurs"],
    preventionTips: ["Sleep under insecticide-treated bed nets (ITNs)", "Apply insect repellent on exposed skin during dusk and dawn", "Wear protective clothing outdoors in mosquito-prone regions", "Take prophylactic antimalarial medication before traveling to endemic areas"],
    suggestedMedicines: ["Paracetamol", "Oral Electrolyte Solutions", "Folic Acid supplements"]
  },
  {
    name: "Hypertension (High Blood Pressure)",
    description: "A chronic medical condition in which the systemic arterial blood pressure is persistently elevated above normal limits (>= 130/80 mmHg).",
    symptoms: ["often asymptomatic (silent killer)", "severe morning headaches", "dizziness or lightheadedness", "blurred vision", "palpitations", "shortness of breath during exertion"],
    precautions: ["Measure blood pressure daily at the same time", "Strictly limit daily sodium (salt) intake to under 2,000 mg", "Avoid caffeine, energy drinks, and excessive stress", "Practice deep breathing and guided relaxation techniques"],
    preventionTips: ["Follow the DASH (Dietary Approaches to Stop Hypertension) diet", "Engage in regular brisk walking or cardiovascular exercise", "Avoid tobacco smoking and moderate alcohol consumption", "Manage stress through yoga, meditation, or adequate sleep"],
    suggestedMedicines: ["Coenzyme Q10 (CoQ10) supplements", "Magnesium supplements", "Omega-3 Fish Oil"]
  },
  {
    name: "Acute Pneumonia",
    description: "An inflammatory condition of the lung parenchyma, primarily affecting the small air sacs (alveoli), caused by bacterial, viral, or fungal infection.",
    symptoms: ["cough producing green, yellow, or rusty sputum", "high fever with shaking chills", "sharp chest pain that worsens with deep breaths or coughing", "shortness of breath", "fatigue and lethargy"],
    precautions: ["Use a cool-mist humidifier in the bedroom to ease breathing", "Rest in a propped-up position (30-45 degrees) to improve lung expansion", "Perform deep breathing and coughing exercises to clear mucus", "Monitor blood oxygen saturation continuously"],
    preventionTips: ["Receive Pneumococcal (PCV/PPSV) and annual influenza vaccinations", "Avoid exposure to second-hand smoke and air pollutants", "Wash hands frequently to prevent respiratory infections", "Maintain good oral hygiene to prevent aspiration of bacteria"],
    suggestedMedicines: ["Paracetamol", "Guaifenesin (expectorant syrup)", "Saline nasal drops", "Vitamin D3 supplements"]
  },
  {
    name: "Migraine",
    description: "A neurological disorder characterized by recurrent moderate to severe throbbing headaches, typically affecting one side of the head, often accompanied by nausea and sensory sensitivity.",
    symptoms: ["unilateral throbbing headache", "extreme sensitivity to light (photophobia)", "sensitivity to sound (phonophobia)", "nausea and vomiting", "visual disturbances (aura)", "dizziness"],
    precautions: ["Rest in a quiet, completely dark, and cool room", "Apply a cold compress or ice pack to the forehead or temples", "Avoid known migraine triggers such as flickering lights, aged cheese, or MSG", "Stay hydrated and avoid skipping meals"],
    preventionTips: ["Maintain a strict and consistent sleep-wake schedule", "Keep a detailed headache diary to identify dietary and environmental triggers", "Practice progressive muscle relaxation and biofeedback for stress reduction", "Limit excessive screen time and blue light exposure"],
    suggestedMedicines: ["Ibuprofen / Acetaminophen (OTC pain relief)", "Magnesium Glycinate supplements", "Riboflavin (Vitamin B2)", "Ginger tea or extracts"]
  },
  {
    name: "Bronchial Asthma",
    description: "A chronic inflammatory airway disease characterized by episodic reversible bronchospasm, swelling of airway mucosa, and excessive mucus production.",
    symptoms: ["wheezing during exhalation", "shortness of breath or air hunger", "chest tightness or pressure", "chronic coughing, especially at night or early morning", "difficulty talking during acute flare-ups"],
    precautions: ["Keep a rescue inhaler (short-acting beta-agonist) accessible at all times", "Sit upright during an acute asthma attack; do not lie down", "Avoid exposure to cold air by wrapping a scarf over mouth and nose", "Monitor peak flow meter readings daily"],
    preventionTips: ["Identify and avoid environmental allergens like pollen, dust mites, and pet dander", "Use hypoallergenic bedding and air purifiers with HEPA filters indoors", "Avoid outdoor strenuous exercise during high pollution or pollen days", "Never smoke and avoid smoky environments"],
    suggestedMedicines: ["Saline inhalation nebulizer solutions", "N-Acetylcysteine (NAC) supplements", "Vitamin D supplements"]
  }
];

const seedDiseases = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/medica_ai';
    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected for Disease Seeding...');

    let addedCount = 0;
    let updatedCount = 0;

    for (const doc of diseasesData) {
      const existing = await Disease.findOne({ name: doc.name });
      if (existing) {
        await Disease.findOneAndUpdate({ name: doc.name }, doc, { new: true });
        updatedCount++;
      } else {
        await Disease.create(doc);
        addedCount++;
      }
    }

    console.log(`Successfully processed 10 diseases! (Added: ${addedCount}, Updated: ${updatedCount})`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding diseases:', error);
    process.exit(1);
  }
};

seedDiseases();
