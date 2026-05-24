/* ============================================
   NUTRITIVE HARMONY — INTAKE FORM
   Multi-step questionnaire with autosave and Google Sheets submission
   ============================================ */

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyRTOce1OvgWXMOZiipOEFYlaxPn_GAhHlCnnAOer_Kl3vRu5o4k_Thx0hPUe8Q4x0W/exec';

const STORAGE_KEY = 'nh_intake_progress';

const FORM_PAGES = [
  {
    title: 'About you',
    description: 'A few basics to start.',
    questions: [
      { id: 'name', type: 'text', label: 'Full name', required: true },
      { id: 'dob', type: 'date', label: 'Date of birth', required: true },
      { id: 'gender', type: 'select', label: 'Gender', required: true,
        options: ['Female', 'Male', 'Non-binary', 'Prefer not to say'] },
      { id: 'email', type: 'email', label: 'Email', required: true },
      { id: 'phone', type: 'tel', label: 'Phone (optional)' },
      { id: 'formDate', type: 'date', label: 'Today\'s date', required: true, default: 'today' }
    ]
  },
  {
    title: 'Your main health concerns',
    description: 'Please list your five main health concerns, in order of importance to you.',
    questions: [
      { id: 'concern1', type: 'text', label: '1. Most important concern' },
      { id: 'concern2', type: 'text', label: '2. Second concern' },
      { id: 'concern3', type: 'text', label: '3. Third concern' },
      { id: 'concern4', type: 'text', label: '4. Fourth concern' },
      { id: 'concern5', type: 'text', label: '5. Fifth concern' },
      { id: 'concernNotes', type: 'textarea', label: 'Anything else you want to add about your concerns?' }
    ]
  },
  {
    title: 'Part I — Diet & substances',
    description: 'For each item, tell us how often you consume or use it.',
    keyType: 'frequency',
    questions: [
      { id: 'd_alcohol', type: 'scale', label: 'Alcohol' },
      { id: 'd_cigars', type: 'scale', label: 'Cigars / pipes' },
      { id: 'd_artificialSweeteners', type: 'scale', label: 'Artificial sweeteners' },
      { id: 'd_caffeinated', type: 'scale', label: 'Caffeinated beverages' },
      { id: 'd_confectionary', type: 'scale', label: 'Confectionary or other sweets' },
      { id: 'd_fastFoods', type: 'scale', label: 'Fast foods' },
      { id: 'd_fizzyDrinks', type: 'scale', label: 'Fizzy drinks' },
      { id: 'd_friedFoods', type: 'scale', label: 'Fried foods' },
      { id: 'd_chewingTobacco', type: 'scale', label: 'Chewing tobacco' },
      { id: 'd_tinnedMeats', type: 'scale', label: 'Tinned meats / hot dogs' },
      { id: 'd_cigarettes', type: 'scale', label: 'Cigarettes' },
      { id: 'd_margarine', type: 'scale', label: 'Margarine' },
      { id: 'd_milkProducts', type: 'scale', label: 'Milk products' },
      { id: 'd_refinedFlour', type: 'scale', label: 'Refined flour / baked goods' },
      { id: 'd_vitamins', type: 'scale', label: 'Vitamins and minerals' },
      { id: 'd_waterDistilled', type: 'scale', label: 'Water — distilled' },
      { id: 'd_waterTap', type: 'scale', label: 'Water — tap' },
      { id: 'd_waterBottled', type: 'scale', label: 'Water — bottled mineral' },
      { id: 'd_dietForWeight', type: 'scale', label: 'Diet often for weight control' },
      { id: 'd_radiationExposure', type: 'yesno', label: 'Radiation exposure' }
    ]
  },
  {
    title: 'Lifestyle',
    description: 'These questions look at recent changes and habits in your life.',
    questions: [
      { id: 'l_exercise', type: 'scale', label: 'Exercise per week',
        customScale: ['2+ times/week', '1 time/week', '1-2 times/month', 'Never or less than monthly'] },
      { id: 'l_changedJobs', type: 'scale', label: 'Changed jobs',
        customScale: ['Over 12 months ago', 'Within last 12 months', 'Within last 6 months', 'Within last 2 months'] },
      { id: 'l_divorced', type: 'scale', label: 'Divorced',
        customScale: ['Never / over 2 years ago', 'Within last 2 years', 'Within last year', 'Within last 6 months'] },
      { id: 'l_overworked', type: 'scale', label: 'Work over 60 hours per week',
        customScale: ['Never', 'Occasionally', 'Usually', 'Always'] }
    ]
  },
  {
    title: 'Medications',
    description: 'Have you taken any of these currently or in the last month?',
    questions: [
      { id: 'm_antacids', type: 'yesno', label: 'Antacids' },
      { id: 'm_antianxiety', type: 'yesno', label: 'Anti-anxiety medications' },
      { id: 'm_antibiotics', type: 'yesno', label: 'Antibiotics' },
      { id: 'm_anticonvulsants', type: 'yesno', label: 'Anticonvulsants' },
      { id: 'm_antidepressants', type: 'yesno', label: 'Antidepressants' },
      { id: 'm_antifungals', type: 'yesno', label: 'Antifungals' },
      { id: 'm_painkillers', type: 'yesno', label: 'Aspirin / Ibuprofen / Paracetamol' },
      { id: 'm_asthmaInhalers', type: 'yesno', label: 'Asthma inhalers' },
      { id: 'm_betaBlockers', type: 'yesno', label: 'Beta blockers' },
      { id: 'm_birthControl', type: 'yesno', label: 'Birth control pills / implant contraceptives' },
      { id: 'm_chemotherapy', type: 'yesno', label: 'Chemotherapy' },
      { id: 'm_cholesterol', type: 'yesno', label: 'Cholesterol lowering medications' },
      { id: 'm_cortisone', type: 'yesno', label: 'Cortisone / steroids' },
      { id: 'm_diabetic', type: 'yesno', label: 'Diabetic medications / insulin' },
      { id: 'm_diuretics', type: 'yesno', label: 'Diuretics' },
      { id: 'm_estrogenRx', type: 'yesno', label: 'Oestrogen or progesterone (pharmaceutical)' },
      { id: 'm_estrogenNatural', type: 'yesno', label: 'Oestrogen or progesterone (natural)' },
      { id: 'm_heart', type: 'yesno', label: 'Heart medications' },
      { id: 'm_bloodPressure', type: 'yesno', label: 'High blood pressure medications' },
      { id: 'm_laxatives', type: 'yesno', label: 'Laxatives' },
      { id: 'm_recreational', type: 'yesno', label: 'Recreational drugs' },
      { id: 'm_relaxants', type: 'yesno', label: 'Relaxants / sleeping pills' },
      { id: 'm_testosterone', type: 'yesno', label: 'Testosterone (natural or prescription)' },
      { id: 'm_thyroid', type: 'yesno', label: 'Thyroid medication' },
      { id: 'm_acetaminophen', type: 'yesno', label: 'Acetaminophen (Tylenol)' },
      { id: 'm_ulcer', type: 'yesno', label: 'Ulcer medications' },
      { id: 'm_viagra', type: 'yesno', label: 'Sildenafil citrate (Viagra)' },
      { id: 'm_other', type: 'textarea', label: 'Any other medications or supplements?' }
    ]
  },
  {
    title: 'Section 1',
    description: 'For each symptom, rate from 0 (never) to 3 (frequently/severe).',
    section: 1,
    keyType: 'severity',
    questions: [
      { id: 's1_belching', type: 'scale', label: 'Belching or gas within one hour after eating' },
      { id: 's1_heartburn', type: 'scale', label: 'Heartburn or acid reflux' },
      { id: 's1_bloating', type: 'scale', label: 'Bloating within one hour after eating' },
      { id: 's1_vegan', type: 'yesno', label: 'Vegan diet (no dairy, meat, fish or eggs)' },
      { id: 's1_badBreath', type: 'scale', label: 'Bad breath (halitosis)' },
      { id: 's1_meatTaste', type: 'scale', label: 'Loss of taste for meat' },
      { id: 's1_sweatOdor', type: 'scale', label: 'Sweat has a strong odour' },
      { id: 's1_vitaminUpset', type: 'scale', label: 'Stomach upset by taking vitamins' },
      { id: 's1_fullness', type: 'scale', label: 'Sense of excess fullness after meals' },
      { id: 's1_skipBreakfast', type: 'scale', label: 'Feel like skipping breakfast' },
      { id: 's1_betterNotEating', type: 'scale', label: 'Feel better if you don\'t eat' },
      { id: 's1_sleepyAfterMeals', type: 'scale', label: 'Sleepy after meals' },
      { id: 's1_fingernails', type: 'scale', label: 'Fingernails chip, peel or break easily' },
      { id: 's1_anemia', type: 'scale', label: 'Anaemia unresponsive to iron' },
      { id: 's1_stomachPains', type: 'scale', label: 'Stomach pains or cramps' },
      { id: 's1_diarrheaChronic', type: 'scale', label: 'Diarrhoea, chronic' },
      { id: 's1_diarrheaAfterMeals', type: 'scale', label: 'Diarrhoea shortly after meals' },
      { id: 's1_blackStools', type: 'scale', label: 'Black or tarry coloured stools' },
      { id: 's1_undigestedFood', type: 'scale', label: 'Undigested food in stool' }
    ]
  },
  {
    title: 'Section 2',
    description: 'For each symptom, rate from 0 (never) to 3 (frequently/severe).',
    section: 2,
    keyType: 'severity',
    questions: [
      { id: 's2_painBetweenShoulders', type: 'scale', label: 'Pain between shoulder blades' },
      { id: 's2_greasyFoodUpset', type: 'scale', label: 'Stomach upset by greasy foods' },
      { id: 's2_greasyStools', type: 'scale', label: 'Greasy or shiny stools' },
      { id: 's2_nausea', type: 'scale', label: 'Nausea' },
      { id: 's2_motionSickness', type: 'scale', label: 'Sea, car, airplane or motion sickness' },
      { id: 's2_morningSickness', type: 'yesno', label: 'History of morning sickness' },
      { id: 's2_lightStools', type: 'scale', label: 'Light or clay coloured stools' },
      { id: 's2_drySkinFeet', type: 'scale', label: 'Dry skin, itchy feet or skin peels on feet' },
      { id: 's2_headacheEyes', type: 'scale', label: 'Headache over eyes' },
      { id: 's2_gallbladderAttacks', type: 'scale', label: 'Gallbladder attacks',
        customScale: ['Never', 'Years ago', 'Within last year', 'Within past 3 months'] },
      { id: 's2_gallbladderRemoved', type: 'yesno', label: 'Gallbladder removed' },
      { id: 's2_bitterMouth', type: 'scale', label: 'Bitter taste in mouth, especially after meals' },
      { id: 's2_sickFromWine', type: 'yesno', label: 'Become sick if you drink wine' },
      { id: 's2_easilyIntoxicated', type: 'yesno', label: 'Easily intoxicated if you drink wine' },
      { id: 's2_easilyHungover', type: 'yesno', label: 'Easily hung over if you drink wine' },
      { id: 's2_alcoholPerWeek', type: 'scale', label: 'Alcohol per week',
        customScale: ['Less than 3', 'Less than 7', 'Less than 14', 'More than 14'] },
      { id: 's2_recoveringAlcoholic', type: 'yesno', label: 'Recovering alcoholic' },
      { id: 's2_drugAlcoholHistory', type: 'yesno', label: 'History of drug or alcohol abuse' },
      { id: 's2_hepatitis', type: 'yesno', label: 'History of hepatitis' },
      { id: 's2_longTermDrugUse', type: 'yesno', label: 'Long term use of prescription / recreational drugs' },
      { id: 's2_chemicalSensitive', type: 'scale', label: 'Sensitive to chemicals (perfume, cleaning agents, etc.)' },
      { id: 's2_tobaccoSensitive', type: 'scale', label: 'Sensitive to tobacco smoke' },
      { id: 's2_dieselExposure', type: 'scale', label: 'Exposure to diesel fumes' },
      { id: 's2_painUnderRibcage', type: 'scale', label: 'Pain under right side of ribcage' },
      { id: 's2_hemorrhoids', type: 'scale', label: 'Haemorrhoids or varicose veins' },
      { id: 's2_aspartame', type: 'scale', label: 'Nutrasweet (aspartame) consumption' },
      { id: 's2_aspartameSensitive', type: 'scale', label: 'Sensitive to Nutrasweet (aspartame)' },
      { id: 's2_chronicFatigue', type: 'scale', label: 'Chronic fatigue or Fibromyalgia' }
    ]
  },
  {
    title: 'Section 3',
    description: 'For each symptom, rate from 0 (never) to 3 (frequently/severe).',
    section: 3,
    keyType: 'severity',
    questions: [
      { id: 's3_foodAllergies', type: 'scale', label: 'Food allergies' },
      { id: 's3_bloatingDelayed', type: 'scale', label: 'Abdominal bloating 1-2 hours after eating' },
      { id: 's3_foodsTireBloat', type: 'yesno', label: 'Specific foods make you tired or bloated' },
      { id: 's3_pulseAfterEating', type: 'scale', label: 'Pulse speeds after eating' },
      { id: 's3_airborneAllergies', type: 'scale', label: 'Airborne allergies' },
      { id: 's3_hives', type: 'scale', label: 'Experience hives' },
      { id: 's3_sinusCongestion', type: 'scale', label: 'Sinus congestion, "stuffy head"' },
      { id: 's3_craveBread', type: 'scale', label: 'Crave bread or noodles' },
      { id: 's3_alternatingBowel', type: 'scale', label: 'Alternating constipation and diarrhoea' },
      { id: 's3_crohns', type: 'scale', label: 'Crohn\'s disease',
        customScale: ['No', 'Yes in the past', 'Currently mild', 'Severe'] },
      { id: 's3_wheatGrain', type: 'scale', label: 'Wheat or grain sensitivity' },
      { id: 's3_dairySensitivity', type: 'scale', label: 'Dairy sensitivity' },
      { id: 's3_foodsCantGiveUp', type: 'yesno', label: 'Are there foods you could not give up?' },
      { id: 's3_asthmaSinusInfections', type: 'scale', label: 'Asthma, sinus infections, stuffy nose' },
      { id: 's3_vividDreams', type: 'scale', label: 'Bizarre vivid dreams, nightmares' },
      { id: 's3_painMeds', type: 'scale', label: 'Use over-the-counter pain medications' },
      { id: 's3_spaceyUnreal', type: 'scale', label: 'Feel spacey or unreal' }
    ]
  },
  {
    title: 'Section 4',
    description: 'For each symptom, rate from 0 (never) to 3 (frequently/severe).',
    section: 4,
    keyType: 'severity',
    questions: [
      { id: 's4_anusItches', type: 'scale', label: 'Anus itches' },
      { id: 's4_coatedTongue', type: 'scale', label: 'Coated tongue' },
      { id: 's4_mouldyPlaces', type: 'scale', label: 'Feel worse in mouldy or musty place' },
      { id: 's4_antibioticTime', type: 'scale', label: 'Total accumulated antibiotic use',
        customScale: ['Never', '<1 month', '<3 months', '>3 months'] },
      { id: 's4_yeastInfections', type: 'scale', label: 'Fungus or yeast infections' },
      { id: 's4_ringworm', type: 'scale', label: 'Ring worm, "jock itch", athlete\'s foot, nail fungus' },
      { id: 's4_yeastWithSugar', type: 'scale', label: 'Yeast symptoms increase with sugar, starch or alcohol' },
      { id: 's4_hardStools', type: 'scale', label: 'Stools hard or difficult to pass' },
      { id: 's4_parasitesHistory', type: 'yesno', label: 'History of parasites' },
      { id: 's4_fewBowelMovements', type: 'scale', label: 'Less than one bowel movement per day' },
      { id: 's4_stoolShape', type: 'scale', label: 'Stools have corners, edges, are flat or ribbon shaped' },
      { id: 's4_loosePoorlyFormed', type: 'scale', label: 'Stools are not well formed (loose)' },
      { id: 's4_irritableBowel', type: 'scale', label: 'Irritable bowel or mucus colitis' },
      { id: 's4_bloodInStool', type: 'scale', label: 'Blood in stool' },
      { id: 's4_mucusInStool', type: 'scale', label: 'Mucus in stool' },
      { id: 's4_foulSmellGas', type: 'scale', label: 'Excessive foul smelling lower bowel gas' },
      { id: 's4_breathBodyOdor', type: 'scale', label: 'Bad breath or strong body odours' },
      { id: 's4_thighPain', type: 'scale', label: 'Painful to press along outer sides of thighs (Iliotibial Band)' },
      { id: 's4_lowerAbdomenCramping', type: 'scale', label: 'Cramping in lower abdominal region' },
      { id: 's4_darkCirclesEyes', type: 'scale', label: 'Dark circles under eyes' }
    ]
  },
  {
    title: 'Section 5',
    description: 'For each symptom, rate from 0 (never) to 3 (frequently/severe).',
    section: 5,
    keyType: 'severity',
    questions: [
      { id: 's5_carpalTunnel', type: 'yesno', label: 'History of carpal tunnel syndrome' },
      { id: 's5_ileocecal', type: 'yesno', label: 'History of lower right abdominal pains / ileocecal valve problems' },
      { id: 's5_stressFracture', type: 'yesno', label: 'History of stress fracture' },
      { id: 's5_boneLoss', type: 'scale', label: 'Bone loss (reduced density on bone scan)' },
      { id: 's5_shorter', type: 'yesno', label: 'Are you shorter than you used to be?' },
      { id: 's5_calfCramps', type: 'scale', label: 'Calf, foot or toe cramps at rest' },
      { id: 's5_coldSores', type: 'scale', label: 'Cold sores, fever blisters or herpes lesions' },
      { id: 's5_frequentFevers', type: 'scale', label: 'Frequent fevers' },
      { id: 's5_skinRashes', type: 'scale', label: 'Frequent skin rashes and/or hives' },
      { id: 's5_herniatedDisc', type: 'yesno', label: 'Herniated disc' },
      { id: 's5_flexibleJoints', type: 'scale', label: 'Excessively flexible joints, "double jointed"' },
      { id: 's5_jointsPop', type: 'scale', label: 'Joints pop or click' },
      { id: 's5_jointPainSwelling', type: 'scale', label: 'Pain or swelling in joints' },
      { id: 's5_bursitis', type: 'scale', label: 'Bursitis or tendonitis' },
      { id: 's5_boneSpurs', type: 'yesno', label: 'History of bone spurs' },
      { id: 's5_morningStiffness', type: 'scale', label: 'Morning stiffness' },
      { id: 's5_nauseaVomiting', type: 'scale', label: 'Nausea with vomiting' },
      { id: 's5_craveChocolate', type: 'scale', label: 'Crave chocolate' },
      { id: 's5_feetOdor', type: 'scale', label: 'Feet have a strong odour' },
      { id: 's5_anemiaHistory', type: 'scale', label: 'History of anaemia' },
      { id: 's5_blueSclera', type: 'scale', label: 'Whites of eyes (sclera) blue tinted' },
      { id: 's5_hoarseness', type: 'scale', label: 'Hoarseness' },
      { id: 's5_difficultySwallowing', type: 'scale', label: 'Difficulty swallowing' },
      { id: 's5_lumpThroat', type: 'scale', label: 'Lump in throat' },
      { id: 's5_dryMouth', type: 'scale', label: 'Dry mouth, eyes and/or nose' },
      { id: 's5_gagEasily', type: 'scale', label: 'Gag easily' },
      { id: 's5_whiteSpots', type: 'scale', label: 'White spots on fingernails' },
      { id: 's5_slowHealing', type: 'scale', label: 'Cuts heal slowly and/or scar easily' },
      { id: 's5_decreasedTaste', type: 'scale', label: 'Decreased sense of taste or smell' }
    ]
  }
];

,
  {
    title: 'Section 6',
    description: 'For each symptom, rate from 0 (never) to 3 (frequently/severe).',
    section: 6,
    keyType: 'severity',
    questions: [
      { id: 's6_aspirinRelief', type: 'yesno', label: 'Experience pain relief with aspirin' },
      { id: 's6_craveFatty', type: 'scale', label: 'Crave fatty or greasy foods' },
      { id: 's6_lowFatDiet', type: 'scale', label: 'Low- or reduced-fat diet',
        customScale: ['Never', 'Years ago', 'Within last year', 'Currently'] },
      { id: 's6_tensionHeadaches', type: 'scale', label: 'Tension headaches at base of skull' },
      { id: 's6_sunHeadaches', type: 'scale', label: 'Headaches when out in the hot sun' },
      { id: 's6_sunburn', type: 'scale', label: 'Sunburn easily or suffer sun poisoning' },
      { id: 's6_muscleFatigue', type: 'scale', label: 'Muscles easily fatigued' },
      { id: 's6_dryFlakySkin', type: 'scale', label: 'Dry flaky skin or dandruff' }
    ]
  },
  {
    title: 'Section 7',
    description: 'For each symptom, rate from 0 (never) to 3 (frequently/severe).',
    section: 7,
    keyType: 'severity',
    questions: [
      { id: 's7_awakenHardSleep', type: 'scale', label: 'Awaken a few hours after falling asleep, hard to get back to sleep' },
      { id: 's7_craveSweets', type: 'scale', label: 'Crave sweets' },
      { id: 's7_bingeEating', type: 'scale', label: 'Binge or uncontrolled eating' },
      { id: 's7_excessiveAppetite', type: 'scale', label: 'Excessive appetite' },
      { id: 's7_craveAfternoon', type: 'scale', label: 'Crave coffee or sugar in the afternoon' },
      { id: 's7_sleepyAfternoon', type: 'scale', label: 'Sleepy in afternoon' },
      { id: 's7_fatigueRelievedByEating', type: 'scale', label: 'Fatigue that is relieved by eating' },
      { id: 's7_headacheSkipMeals', type: 'scale', label: 'Headache if meals are skipped or delayed' },
      { id: 's7_irritableBeforeMeals', type: 'scale', label: 'Irritable before meals' },
      { id: 's7_shakyMealsDelayed', type: 'scale', label: 'Shaky if meals delayed' },
      { id: 's7_familyDiabetes', type: 'scale', label: 'Family members with diabetes',
        customScale: ['None', '1 or 2', '3 or 4', 'More than 4'] },
      { id: 's7_frequentThirst', type: 'scale', label: 'Frequent thirst' },
      { id: 's7_frequentUrination', type: 'scale', label: 'Frequent urination' }
    ]
  },
  {
    title: 'Section 8',
    description: 'For each symptom, rate from 0 (never) to 3 (frequently/severe).',
    section: 8,
    keyType: 'severity',
    questions: [
      { id: 's8_musclesFatigue', type: 'scale', label: 'Muscles become easily fatigued' },
      { id: 's8_exhaustedAfterExercise', type: 'scale', label: 'Feel exhausted or sore after moderate exercise' },
      { id: 's8_insectBites', type: 'scale', label: 'Vulnerable to insect bites' },
      { id: 's8_lossMuscleTone', type: 'scale', label: 'Loss of muscle tone, heaviness in arms/legs' },
      { id: 's8_enlargedHeart', type: 'scale', label: 'Enlarged heart or congestive heart failure' },
      { id: 's8_pulseBelow65', type: 'yesno', label: 'Pulse below 65 per minute' },
      { id: 's8_tinnitus', type: 'scale', label: 'Ringing in the ears (Tinnitus)' },
      { id: 's8_numbnessTingling', type: 'scale', label: 'Numbness, tingling or itching in hands and feet' },
      { id: 's8_depressed', type: 'scale', label: 'Depressed' },
      { id: 's8_fearImpendingDoom', type: 'scale', label: 'Fear of impending doom' },
      { id: 's8_worrierAnxious', type: 'scale', label: 'Worrier, apprehensive, anxious' },
      { id: 's8_nervousAgitated', type: 'scale', label: 'Nervous or agitated' },
      { id: 's8_insecurity', type: 'scale', label: 'Feelings of insecurity' },
      { id: 's8_heartRaces', type: 'scale', label: 'Heart races' },
      { id: 's8_hearHeartbeat', type: 'scale', label: 'Can hear heart beat on pillow at night' },
      { id: 's8_jerksFallingAsleep', type: 'scale', label: 'Whole body or limb jerk as falling asleep' },
      { id: 's8_nightSweats', type: 'scale', label: 'Night sweats' },
      { id: 's8_restlessLegs', type: 'scale', label: 'Restless leg syndrome' },
      { id: 's8_cheilosis', type: 'scale', label: 'Cracks at corner of mouth (Cheilosis)' },
      { id: 's8_fragileSkin', type: 'scale', label: 'Fragile skin, easily chaffed' },
      { id: 's8_polypsWarts', type: 'scale', label: 'Polyps or warts' },
      { id: 's8_msgSensitive', type: 'scale', label: 'MSG sensitivity' },
      { id: 's8_noDreamMemory', type: 'scale', label: 'Wake up without remembering dreams' },
      { id: 's8_bumpsArms', type: 'scale', label: 'Small bumps on back of arms' },
      { id: 's8_lightIrritates', type: 'scale', label: 'Strong light at night irritates eyes' },
      { id: 's8_noseBleedsBruise', type: 'scale', label: 'Nose bleeds and/or tend to bruise easily' },
      { id: 's8_bleedingGums', type: 'scale', label: 'Bleeding gums especially when brushing teeth' }
    ]
  },
  {
    title: 'Section 9',
    description: 'For each symptom, rate from 0 (never) to 3 (frequently/severe).',
    section: 9,
    keyType: 'severity',
    questions: [
      { id: 's9_nightPerson', type: 'scale', label: 'Tend to be a "night person"' },
      { id: 's9_difficultyFallingAsleep', type: 'scale', label: 'Difficulty falling asleep' },
      { id: 's9_slowStarter', type: 'scale', label: 'Slow starter in the morning' },
      { id: 's9_keyedUp', type: 'scale', label: 'Tend to be keyed up, trouble calming down' },
      { id: 's9_bpHigh', type: 'scale', label: 'Blood pressure above 120/80' },
      { id: 's9_headacheAfterExercise', type: 'scale', label: 'Headache after exercising' },
      { id: 's9_jitteryCoffee', type: 'scale', label: 'Feeling wired or jittery after drinking coffee' },
      { id: 's9_clenchGrindTeeth', type: 'scale', label: 'Clench or grind teeth' },
      { id: 's9_calmOutsideTroubledInside', type: 'scale', label: 'Calm on the outside, troubled on the inside' },
      { id: 's9_lowBackPain', type: 'scale', label: 'Chronic low back pain, worse with fatigue' },
      { id: 's9_dizzyStanding', type: 'scale', label: 'Become dizzy when standing up suddenly' },
      { id: 's9_difficultyManipulation', type: 'scale', label: 'Difficulty maintaining manipulative correction' },
      { id: 's9_painAfterManipulation', type: 'scale', label: 'Pain after manipulative correction (eg osteopathy)' },
      { id: 's9_arthriticTendencies', type: 'scale', label: 'Arthritic tendencies' },
      { id: 's9_craveSalty', type: 'scale', label: 'Crave salty foods' },
      { id: 's9_saltBeforeTasting', type: 'scale', label: 'Salt foods before tasting' },
      { id: 's9_perspireEasily', type: 'scale', label: 'Perspire easily' },
      { id: 's9_chronicFatigueDrowsy', type: 'scale', label: 'Chronic fatigue, or get drowsy often' },
      { id: 's9_afternoonYawning', type: 'scale', label: 'Afternoon yawning' },
      { id: 's9_afternoonHeadache', type: 'scale', label: 'Afternoon headache' },
      { id: 's9_asthmaWheezing', type: 'scale', label: 'Asthma, wheezing or difficulty breathing' },
      { id: 's9_kneePain', type: 'scale', label: 'Pain on the medial or inner side of the knee' },
      { id: 's9_sprainAnkles', type: 'scale', label: 'Tendency to sprain ankles or "shin splints"' },
      { id: 's9_needSunglasses', type: 'scale', label: 'Tendency to need sunglasses' },
      { id: 's9_allergiesHives', type: 'scale', label: 'Allergies and/or hives' },
      { id: 's9_weaknessDizziness', type: 'scale', label: 'Weakness, dizziness' }
    ]
  },
  {
    title: 'Section 10',
    description: 'For each symptom, rate from 0 (never) to 3 (frequently/severe).',
    section: 10,
    keyType: 'severity',
    questions: [
      { id: 's10_heightOver66', type: 'yesno', label: 'Height over 6\' 6"' },
      { id: 's10_earlySexualDev', type: 'yesno', label: 'Early sexual development (before age 10)' },
      { id: 's10_increasedLibido', type: 'scale', label: 'Increased libido' },
      { id: 's10_splittingHeadache', type: 'scale', label: 'Splitting type headache' },
      { id: 's10_memoryFailing', type: 'scale', label: 'Memory failing' },
      { id: 's10_tolerateSugar', type: 'yesno', label: 'Tolerate sugar, feel fine when eating sugar' },
      { id: 's10_heightUnder410', type: 'yesno', label: 'Height under 4\' 10"' },
      { id: 's10_decreasedLibido', type: 'scale', label: 'Decreased libido' },
      { id: 's10_excessiveThirst', type: 'scale', label: 'Excessive thirst' },
      { id: 's10_weightGainHipsWaist', type: 'scale', label: 'Weight gain around hips or waist' },
      { id: 's10_menstrualDisorders', type: 'scale', label: 'Menstrual disorders' },
      { id: 's10_delayedSexualDev', type: 'yesno', label: 'Delayed sexual development (after age 13)' },
      { id: 's10_ulcersColitis', type: 'scale', label: 'Tendency to ulcers or colitis' }
    ]
  },
  {
    title: 'Section 11',
    description: 'For each symptom, rate from 0 (never) to 3 (frequently/severe).',
    section: 11,
    keyType: 'severity',
    questions: [
      { id: 's11_iodineSensitive', type: 'scale', label: 'Sensitive/allergic to iodine' },
      { id: 's11_difficultyGainingWeight', type: 'scale', label: 'Difficulty gaining weight, even with large appetite' },
      { id: 's11_nervousEmotional', type: 'scale', label: 'Nervous, emotional, can\'t work under pressure' },
      { id: 's11_inwardTrembling', type: 'scale', label: 'Inward trembling' },
      { id: 's11_flushEasily', type: 'scale', label: 'Flush easily' },
      { id: 's11_fastPulseRest', type: 'scale', label: 'Fast pulse at rest' },
      { id: 's11_intoleranceHeat', type: 'scale', label: 'Intolerance to high temperatures' },
      { id: 's11_difficultyLosingWeight', type: 'scale', label: 'Difficulty losing weight' },
      { id: 's11_mentallySluggish', type: 'scale', label: 'Mentally sluggish, reduced initiative' },
      { id: 's11_fatigueSleepyDay', type: 'scale', label: 'Easily fatigued, sleepy during the day' },
      { id: 's11_coldSensitive', type: 'scale', label: 'Sensitive to cold, poor circulation (cold hands and feet)' },
      { id: 's11_constipationChronic', type: 'scale', label: 'Constipation, chronic' },
      { id: 's11_hairLoss', type: 'scale', label: 'Excessive hair loss and/or coarse hair' },
      { id: 's11_morningHeadaches', type: 'scale', label: 'Morning headaches, wear off during the day' },
      { id: 's11_lossEyebrow', type: 'scale', label: 'Loss of lateral 1/3 of eyebrow' },
      { id: 's11_seasonalSadness', type: 'scale', label: 'Seasonal sadness' }
    ]
  },
  {
    title: 'Sections 12-13 — Sex-specific',
    description: 'Only answer the section that applies to you. Skip the other.',
    section: 1213,
    keyType: 'severity',
    sexSpecific: true,
    questions: [
      { id: 's12_prostateProblems', type: 'scale', label: 'Prostate problems', genderOnly: 'Male', section: 12 },
      { id: 's12_difficultyUrination', type: 'scale', label: 'Difficulty with urination, dribbling', genderOnly: 'Male', section: 12 },
      { id: 's12_startStopUrine', type: 'scale', label: 'Difficult to start and stop urine stream', genderOnly: 'Male', section: 12 },
      { id: 's12_painBurningUrine', type: 'scale', label: 'Pain or burning with urination', genderOnly: 'Male', section: 12 },
      { id: 's12_wakingUrinate', type: 'scale', label: 'Waking to urinate at night', genderOnly: 'Male', section: 12 },
      { id: 's12_interruptionStream', type: 'scale', label: 'Interruption of stream during urination', genderOnly: 'Male', section: 12 },
      { id: 's12_painInsideLegs', type: 'scale', label: 'Pain on inside of legs or heels', genderOnly: 'Male', section: 12 },
      { id: 's12_incompleteEvacuation', type: 'scale', label: 'Feeling of incomplete bowel evacuation', genderOnly: 'Male', section: 12 },
      { id: 's12_decreasedSexualFunction', type: 'scale', label: 'Decreased sexual function', genderOnly: 'Male', section: 12 },
      { id: 's13_depressionPeriods', type: 'scale', label: 'Depression during periods', genderOnly: 'Female', section: 13 },
      { id: 's13_moodSwingsPMS', type: 'scale', label: 'Mood swings associated with periods (PMS)', genderOnly: 'Female', section: 13 },
      { id: 's13_chocolatePeriods', type: 'scale', label: 'Crave chocolate around periods', genderOnly: 'Female', section: 13 },
      { id: 's13_breastTenderness', type: 'scale', label: 'Breast tenderness associated with cycle', genderOnly: 'Female', section: 13 },
      { id: 's13_excessiveFlow', type: 'scale', label: 'Excessive menstrual flow', genderOnly: 'Female', section: 13 },
      { id: 's13_scantyFlow', type: 'scale', label: 'Scanty blood flow during periods', genderOnly: 'Female', section: 13 },
      { id: 's13_skippedPeriods', type: 'scale', label: 'Occasional skipped periods', genderOnly: 'Female', section: 13 },
      { id: 's13_cycleVariations', type: 'scale', label: 'Variations in menstrual cycles', genderOnly: 'Female', section: 13 },
      { id: 's13_endometriosis', type: 'scale', label: 'Endometriosis', genderOnly: 'Female', section: 13 },
      { id: 's13_uterineFibroids', type: 'scale', label: 'Uterine fibroids', genderOnly: 'Female', section: 13 },
      { id: 's13_breastFibroids', type: 'scale', label: 'Breast fibroids, benign masses', genderOnly: 'Female', section: 13 },
      { id: 's13_painfulIntercourse', type: 'scale', label: 'Painful intercourse (dyspareunia)', genderOnly: 'Female', section: 13 },
      { id: 's13_vaginalDischarge', type: 'scale', label: 'Vaginal discharge', genderOnly: 'Female', section: 13 },
      { id: 's13_vaginalDryness', type: 'scale', label: 'Vaginal dryness', genderOnly: 'Female', section: 13 },
      { id: 's13_vaginalItchiness', type: 'scale', label: 'Vaginal itchiness', genderOnly: 'Female', section: 13 },
      { id: 's13_weightHipsThighs', type: 'scale', label: 'Gain weight around hips, thighs and buttocks', genderOnly: 'Female', section: 13 },
      { id: 's13_facialBodyHair', type: 'scale', label: 'Excess facial or body hair', genderOnly: 'Female', section: 13 },
      { id: 's13_hotFlashes', type: 'scale', label: 'Hot flashes', genderOnly: 'Female', section: 13 },
      { id: 's13_nightSweatsMeno', type: 'scale', label: 'Night sweats (menopausal)', genderOnly: 'Female', section: 13 },
      { id: 's13_thinningSkin', type: 'scale', label: 'Thinning skin', genderOnly: 'Female', section: 13 }
    ]
  },
  {
    title: 'Sections 14-16',
    description: 'For each symptom, rate from 0 (never) to 3 (frequently/severe).',
    keyType: 'severity',
    questions: [
      { id: 's14_heavyBreathing', type: 'scale', label: 'Aware of heavy and/or irregular breathing', section: 14 },
      { id: 's14_altitudeDiscomfort', type: 'scale', label: 'Discomfort at high altitudes', section: 14 },
      { id: 's14_airHunger', type: 'scale', label: '"Air hunger" or sigh frequently', section: 14 },
      { id: 's14_openWindows', type: 'scale', label: 'Compelled to open windows in a closed room', section: 14 },
      { id: 's14_shortnessBreath', type: 'scale', label: 'Shortness of breath with moderate exertion', section: 14 },
      { id: 's14_ankleSwelling', type: 'scale', label: 'Ankles swell, especially at end of day', section: 14 },
      { id: 's14_coughAtNight', type: 'scale', label: 'Cough at night', section: 14 },
      { id: 's14_blushRedFace', type: 'scale', label: 'Blush or face turns red for no reason', section: 14 },
      { id: 's14_chestPain', type: 'scale', label: 'Dull pain or tightness in chest and/or radiate into right arm, worse with exertion', section: 14 },
      { id: 's14_muscleCramps', type: 'scale', label: 'Muscle cramps with exertion', section: 14 },
      { id: 's15_midBackPain', type: 'scale', label: 'Pain in mid-back region', section: 15 },
      { id: 's15_puffyEyes', type: 'scale', label: 'Puffy around the eyes, dark circles under eyes', section: 15 },
      { id: 's15_kidneyStones', type: 'yesno', label: 'History of kidney stones', section: 15 },
      { id: 's15_cloudyUrine', type: 'scale', label: 'Cloudy, bloody or darkened urine', section: 15 },
      { id: 's15_urineOdor', type: 'scale', label: 'Urine has a strong odour', section: 15 },
      { id: 's16_runnyNose', type: 'scale', label: 'Runny or drippy nose', section: 16 },
      { id: 's16_coldsBeginningWinter', type: 'scale', label: 'Catch colds at the beginning of winter', section: 16 },
      { id: 's16_mucusCough', type: 'scale', label: 'Mucus producing cough', section: 16 },
      { id: 's16_frequentColds', type: 'scale', label: 'Frequent colds or flu',
        customScale: ['1 or less/year', '2-3/year', '4-5/year', '6+/year'], section: 16 },
      { id: 's16_otherInfections', type: 'scale', label: 'Other infections (sinus, ear, lung, skin, bladder, kidney)',
        customScale: ['1 or less/year', '2-3/year', '4-5/year', '6+/year'], section: 16 },
      { id: 's16_neverSick', type: 'scale', label: 'Never get sick',
        customScale: ['Sick 1-2 times in 2 years', 'Not sick in 2 years', 'Not sick in 4 years', 'Not sick in 7 years'], section: 16 },
      { id: 's16_acneAdult', type: 'scale', label: 'Acne (adult)', section: 16 },
      { id: 's16_itchySkin', type: 'scale', label: 'Itchy skin (Dermatitis)', section: 16 },
      { id: 's16_cystsBoils', type: 'scale', label: 'Cysts, boils, rashes', section: 16 },
      { id: 's16_chronicViralHistory', type: 'scale', label: 'History of Epstein Barr, Mono, Herpes, Shingles, Chronic Fatigue, Hepatitis or other chronic viral condition',
        customScale: ['No', 'Yes in the past', 'Currently mild', 'Severe'], section: 16 },
      { id: 'finalNotes', type: 'textarea', label: 'Anything else you\'d like me to know before our session?' }
    ]
  }
];

let currentPage = 0;
let answers = {};
let autosaveTimeout = null;

function renderPage(pageIndex) {
  const page = FORM_PAGES[pageIndex];
  const userGender = answers.gender || '';
  const total = FORM_PAGES.length;
  const percent = Math.round(((pageIndex + 1) / total) * 100);
  document.getElementById('progressLabel').textContent = `Step ${pageIndex + 1} of ${total}`;
  document.getElementById('progressPercent').textContent = `${percent}%`;
  document.getElementById('progressFill').style.width = `${percent}%`;
  document.getElementById('pageTitle').textContent = page.title;
  document.getElementById('pageDescription').textContent = page.description;
  const container = document.getElementById('questionsContainer');
  container.innerHTML = '';
  page.questions.forEach(q => {
    if (q.genderOnly && userGender && q.genderOnly !== userGender) return;
    const questionEl = renderQuestion(q);
    container.appendChild(questionEl);
  });
  document.getElementById('prevBtn').style.display = pageIndex === 0 ? 'none' : 'inline-flex';
  const nextBtn = document.getElementById('nextBtn');
  nextBtn.textContent = pageIndex === FORM_PAGES.length - 1 ? 'Submit form ✓' : 'Continue →';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderQuestion(q) {
  const wrap = document.createElement('div');
  wrap.className = 'question-block';
  const label = document.createElement('label');
  label.className = 'question-label';
  label.textContent = q.label + (q.required ? ' *' : '');
  wrap.appendChild(label);
  let input;
  if (q.type === 'text' || q.type === 'email' || q.type === 'tel') {
    input = document.createElement('input');
    input.type = q.type;
    input.className = 'question-input';
    input.value = answers[q.id] || '';
    if (q.required) input.required = true;
    input.addEventListener('input', e => { answers[q.id] = e.target.value; scheduleAutosave(); });
  } else if (q.type === 'date') {
    input = document.createElement('input');
    input.type = 'date';
    input.className = 'question-input';
    let value = answers[q.id];
    if (!value && q.default === 'today') value = new Date().toISOString().split('T')[0];
    input.value = value || '';
    input.addEventListener('change', e => { answers[q.id] = e.target.value; scheduleAutosave(); });
  } else if (q.type === 'select') {
    input = document.createElement('select');
    input.className = 'question-input';
    const blank = document.createElement('option');
    blank.value = ''; blank.textContent = '— Choose —';
    input.appendChild(blank);
    q.options.forEach(opt => {
      const o = document.createElement('option');
      o.value = opt; o.textContent = opt;
      if (answers[q.id] === opt) o.selected = true;
      input.appendChild(o);
    });
    input.addEventListener('change', e => { answers[q.id] = e.target.value; scheduleAutosave(); });
  } else if (q.type === 'textarea') {
    input = document.createElement('textarea');
    input.className = 'question-input'; input.rows = 3;
    input.value = answers[q.id] || '';
    input.addEventListener('input', e => { answers[q.id] = e.target.value; scheduleAutosave(); });
  } else if (q.type === 'scale') {
    input = renderScale(q);
  } else if (q.type === 'yesno') {
    input = renderYesNo(q);
  }
  if (input) wrap.appendChild(input);
  return wrap;
}

function renderScale(q) {
  const wrap = document.createElement('div');
  wrap.className = 'scale-group';
  const labels = q.customScale || ['0 — Never', '1 — Mild/Monthly', '2 — Moderate/Weekly', '3 — Severe/Daily'];
  for (let i = 0; i < 4; i++) {
    const opt = document.createElement('button');
    opt.type = 'button'; opt.className = 'scale-option'; opt.dataset.value = i;
    const num = document.createElement('span');
    num.className = 'scale-number'; num.textContent = i;
    opt.appendChild(num);
    const lbl = document.createElement('span');
    lbl.className = 'scale-label';
    lbl.textContent = labels[i].replace(/^\d+\s*[—-]\s*/, '');
    opt.appendChild(lbl);
    if (answers[q.id] === i) opt.classList.add('selected');
    opt.addEventListener('click', () => {
      answers[q.id] = i;
      wrap.querySelectorAll('.scale-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      scheduleAutosave();
    });
    wrap.appendChild(opt);
  }
  return wrap;
}

function renderYesNo(q) {
  const wrap = document.createElement('div');
  wrap.className = 'yesno-group';
  ['No', 'Yes'].forEach((label, idx) => {
    const opt = document.createElement('button');
    opt.type = 'button'; opt.className = 'yesno-option'; opt.textContent = label;
    if (answers[q.id] === idx) opt.classList.add('selected');
    opt.addEventListener('click', () => {
      answers[q.id] = idx;
      wrap.querySelectorAll('.yesno-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      scheduleAutosave();
    });
    wrap.appendChild(opt);
  });
  return wrap;
}

function goToPage(idx) {
  if (idx < 0 || idx >= FORM_PAGES.length) return;
  currentPage = idx;
  saveProgress();
  renderPage(idx);
}

function nextPage() {
  if (currentPage === FORM_PAGES.length - 1) submitForm();
  else goToPage(currentPage + 1);
}

function prevPage() { goToPage(currentPage - 1); }

function scheduleAutosave() {
  if (autosaveTimeout) clearTimeout(autosaveTimeout);
  autosaveTimeout = setTimeout(saveProgress, 800);
}

function saveProgress() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      currentPage, answers, savedAt: new Date().toISOString()
    }));
  } catch (e) { console.warn('Could not save progress:', e); }
}

function loadProgress() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    return JSON.parse(saved);
  } catch (e) { return null; }
}

function clearProgress() {
  try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
}

function calculateSectionScores() {
  const sectionTotals = {};
  FORM_PAGES.forEach(page => {
    page.questions.forEach(q => {
      const section = q.section || page.section;
      if (!section) return;
      if (typeof answers[q.id] !== 'number') return;
      if (!sectionTotals[section]) sectionTotals[section] = 0;
      sectionTotals[section] += answers[q.id];
    });
  });
  return sectionTotals;
}

async function submitForm() {
  document.getElementById('formScreen').style.display = 'none';
  document.getElementById('submittingScreen').style.display = 'block';
  const sectionScores = calculateSectionScores();
  const submission = {
    submittedAt: new Date().toISOString(),
    answers: answers,
    sectionScores: sectionScores
  };
  try {
    await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(submission)
    });
    document.getElementById('submittingScreen').style.display = 'none';
    document.getElementById('successScreen').style.display = 'block';
    clearProgress();
  } catch (err) {
    console.error('Submission error:', err);
    document.getElementById('submittingScreen').style.display = 'none';
    document.getElementById('errorScreen').style.display = 'block';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const saved = loadProgress();
  if (saved && saved.answers && Object.keys(saved.answers).length > 0) {
    document.getElementById('resumeBtn').style.display = 'inline-flex';
  }
  document.getElementById('startBtn').addEventListener('click', () => {
    answers = {}; currentPage = 0; clearProgress();
    document.getElementById('welcomeScreen').style.display = 'none';
    document.getElementById('formScreen').style.display = 'block';
    renderPage(0);
  });
  document.getElementById('resumeBtn').addEventListener('click', () => {
    const saved = loadProgress();
    if (saved) {
      answers = saved.answers || {};
      currentPage = saved.currentPage || 0;
      document.getElementById('welcomeScreen').style.display = 'none';
      document.getElementById('formScreen').style.display = 'block';
      renderPage(currentPage);
    }
  });
  document.getElementById('prevBtn').addEventListener('click', prevPage);
  document.getElementById('nextBtn').addEventListener('click', nextPage);
  document.getElementById('retryBtn')?.addEventListener('click', () => {
    document.getElementById('errorScreen').style.display = 'none';
    document.getElementById('formScreen').style.display = 'block';
  });
});
