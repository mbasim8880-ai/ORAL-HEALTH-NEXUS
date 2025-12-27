
import React from 'react';
import { PlanData, DentalProblem, QuizData } from './types';

export const MEDICAL_THEME = {
  primary: '#0077B6',
  secondary: '#00B4D8',
  mintWhite: '#F0F9FF',
};

export const QUIZ_BY_PLAN: Record<DentalProblem, QuizData> = {
  'General Care': {
    plan: 'General Care',
    badge: 'Hygiene Hero',
    questions: [
      { question: 'How often should you brush your teeth?', options: ['Once a day', 'Twice a day', 'Once a week', 'Only after candy'], correctIndex: 1 },
      { question: 'When is the most important time to brush?', options: ['Morning', 'After lunch', 'Before bed', 'During shower'], correctIndex: 2 }
    ]
  },
  'Tooth Pain': {
    plan: 'Tooth Pain',
    badge: 'Pain Specialist',
    questions: [
      { question: 'What is a good home remedy for swelling?', options: ['Hot pack', 'Cold compress', 'Chewing gum', 'Eating sugar'], correctIndex: 1 },
      { question: 'When should you see a dentist for tooth pain?', options: ['Only if it bleeds', 'If it lasts over 2 days', 'Never', 'Once a year'], correctIndex: 1 }
    ]
  },
  'Gum Bleeding': {
    plan: 'Gum Bleeding',
    badge: 'Gum Guardian',
    questions: [
      { question: 'What color are healthy gums?', options: ['Dark Red', 'Light Pink', 'Purple', 'White'], correctIndex: 1 },
      { question: 'Is gum bleeding normal while flossing?', options: ['Always', 'Never', 'Occasionally if not regular, but persistent bleeding needs a checkup', 'Only for kids'], correctIndex: 2 }
    ]
  },
  'Sensitivity': {
    plan: 'Sensitivity',
    badge: 'Enamel Expert',
    questions: [
      { question: 'What can help with sensitive teeth?', options: ['Hard brushing', 'Potassium Nitrate toothpaste', 'Iced water', 'Lemon juice'], correctIndex: 1 }
    ]
  },
  'Crown': {
    plan: 'Crown',
    badge: 'Crown Keeper',
    questions: [
      { question: 'How do you floss around a crown?', options: ['Snap it up', 'Slide it out sideways', 'Don\'t floss there', 'Use a toothpick'], correctIndex: 1 }
    ]
  },
  'Bridges': {
    plan: 'Bridges',
    badge: 'Bridge Builder',
    questions: [
      { question: 'What tool is best for cleaning under a bridge?', options: ['Normal floss', 'Floss threader', 'Toothbrush only', 'Matches'], correctIndex: 1 }
    ]
  },
  'Post extraction care': {
    plan: 'Post extraction care',
    badge: 'Healing Master',
    questions: [
      { question: 'What should you avoid for the first 24 hours after extraction?', options: ['Sleeping', 'Spitting and using straws', 'Drinking water', 'Watching TV'], correctIndex: 1 }
    ]
  },
  'Implant': {
    plan: 'Implant',
    badge: 'Titanium Titan',
    questions: [
      { question: 'Can implants get gum disease around them?', options: ['No, they are metal', 'Yes, it is called peri-implantitis', 'Only if gold', 'Only in kids'], correctIndex: 1 }
    ]
  },
  'Braces': {
    plan: 'Braces',
    badge: 'Ortho Ace',
    questions: [
      { question: 'What should you avoid eating with braces?', options: ['Yogurt', 'Sticky, hard, and crunchy foods', 'Mashed potatoes', 'Soup'], correctIndex: 1 }
    ]
  }
};

export const TIPS_BY_PLAN: Record<DentalProblem, PlanData> = {
  'General Care': {
    problem: 'General Care',
    tips: [
      { id: 'gc1', title: 'Brush Twice Daily', description: 'Brush your teeth for at least two minutes, twice a day. Brushing before bed is the most important as it removes the germs and plaque that accumulate throughout the day.' },
      { id: 'gc2', title: 'Master the Technique', description: 'The way you brush matters. Move your toothbrush in gentle, circular motions to remove plaque. Unremoved plaque can harden, leading to tartar buildup and gum disease.' },
      { id: 'gc3', title: 'Don\'t Forget Your Tongue', description: 'Plaque can also build up on your tongue. Not only can this lead to bad mouth odor, but it can lead to other oral health problems. Gently brush your tongue every time you brush your teeth.' },
      { id: 'gc4', title: 'Use Fluoride Toothpaste', description: 'Always choose a toothpaste that contains fluoride. Fluoride is a leading defense against tooth decay; it works by fighting germs that can lead to decay and providing a protective barrier for your teeth.' },
      { id: 'gc5', title: 'Flossing Priority', description: 'Flossing isn\'t just for getting little pieces of food stuck between your teeth. It is a way to stimulate the gums, reduce plaque, and help lower inflammation in the area.' },
      { id: 'gc6', title: 'Drink More Water', description: 'Water continues to be the best beverage for your overall health—including oral health. Drinking water after every meal can help wash out some of the negative effects of sticky and acidic foods and beverages.' },
      { id: 'gc7', title: 'Eat Crunchy Produce', description: 'Ready-to-eat foods are convenient, but perhaps not so much for your teeth. Eating fresh, crunchy produce contains more healthy fiber and gets your jaws working, which helps keep teeth and gums strong.' },
      { id: 'gc8', title: 'Limit Sugar & Acid', description: 'Sugar eventually turns into acid in the mouth, which can then erode the enamel of your teeth. These acids are what lead to cavities. Try to limit your intake of sodas, candies, and acidic fruits.' },
      { id: 'gc9', title: 'Renew Your Brush', description: 'You should change your toothbrush every 3 to 4 months, or sooner if the bristles are frayed. A worn toothbrush won\'t do a good job of cleaning your teeth.' },
      { id: 'gc10', title: 'Regular Dental Visits', description: 'Visit your dentist at least twice a year for professional cleanings and checkups. A dentist can spot potential issues early and provide treatments before they become painful or expensive problems.' },
    ]
  },
  'Tooth Pain': {
    problem: 'Tooth Pain',
    tips: [
      { id: 'tp1', title: 'Hypertonic Salt Rinse', description: 'Dissolve 1/2 teaspoon of sea salt in 8oz (1 cup) of lukewarm water. Swish the solution vigorously around the aching area for 30-60 seconds and spit. Repeat 3-4 times daily to draw out excess fluid and reduce pressure from inflamed tissues.' },
      { id: 'tp2', title: 'Precision Cold Compress', description: 'Wrap an ice pack in a clean, thin cloth to prevent skin irritation. Apply it to the outside of your cheek in the painful area for exactly 20 minutes, then remove for 20 minutes. This cycles blood flow and numbs pain receptor signals effectively.' },
      { id: 'tp3', title: 'Strategic Head Elevation', description: 'When resting, use 2-3 firm pillows to keep your head elevated at a 30-45 degree angle. This uses gravity to prevent blood from pooling in the sensitive tooth pulp, which is the primary cause of intense nighttime throbbing.' },
      { id: 'tp4', title: 'Clove Oil (Eugenol) Caution', description: 'Apply a tiny amount of clove oil to a cotton swab and dab ONLY the affected tooth. CAUTION: Avoid contact with your gums, tongue, or lips, as pure clove oil can cause chemical burns or intense irritation to soft oral tissues.' },
      { id: 'tp5', title: 'Hydrogen Peroxide Sanitization', description: 'Mix equal parts 3% hydrogen peroxide and plain water. Swish the mixture for 30 seconds to kill surface bacteria and break down biofilm. CRITICAL: Do not swallow the solution, and rinse your mouth thoroughly with water afterward.' },
      { id: 'tp6', title: 'Thermal Tea Bag Relief', description: 'Steep a Peppermint or Black tea bag in boiling water for 1 minute, then place it in the freezer for 5 minutes until chilled. Apply the cold bag directly to the painful tooth for 15 minutes. The tannins and menthol help shrink swelling and numb nerves.' },
      { id: 'tp7', title: 'Fresh Garlic Antimicrobial', description: 'Crush a fresh clove of garlic into a thick paste and mix with a pinch of sea salt. Apply a small amount directly to the aching tooth. Allicin, the active compound in garlic, acts as a potent natural antibiotic to fight minor localized infections.' },
      { id: 'tp8', title: 'Mechanical Occlusal Rest', description: 'Avoid chewing on the side of your mouth where the pain is located. Strictly eliminate hard, crunchy, or sticky foods (like nuts, popcorn, or crusty bread) which can put mechanical pressure on an already inflamed or potentially cracked tooth.' },
      { id: 'tp9', title: 'Temperature-Neutral Soft Diet', description: 'Switch to "mechanical soft" foods at room temperature—such as lukewarm soups, mashed potatoes, or yogurt. Extreme temperatures (hot coffee or iced drinks) and highly acidic foods like citrus can trigger severe paroxysmal pain spikes.' },
      { id: 'tp10', title: 'Emergency Triage Signals', description: 'Seek immediate emergency dental care if you experience: a fever over 101 degrees Fahrenheit (38.3 degrees Celsius), facial swelling that reaches the eye or neck, difficulty breathing/swallowing, or a constant "pumping" throb that completely prevents sleep.' },
    ]
  },
  'Gum Bleeding': {
    problem: 'Gum Bleeding',
    tips: [
      { id: 'gb1', title: 'Soft Bristle Shift', description: 'Bleeding is often a sign of trauma. Switch to "Extra Soft" bristles to clean thoroughly without tearing gum tissue.' },
      { id: 'gb2', title: 'Vitamin C Boost', description: 'Vitamin C helps the body repair connective tissue. Increase intake of bell peppers, strawberries, and kale.' },
      { id: 'gb3', title: 'The Interdental Brush', description: 'Standard floss can be harsh. Use interdental brushes (tiny bottle-style brushes) to clean gaps without causing bleeding.' },
      { id: 'gb4', title: 'Tea Tree Antiseptic', description: 'A drop of tea tree oil in water makes an antimicrobial rinse that fights the gingivitis-causing bacteria.' },
      { id: 'gb5', title: 'Consistent Motion', description: 'Gums bleed when plaque is left behind. Ensure you spend a full 30 seconds on each quadrant of your mouth.' },
      { id: 'gb6', title: 'Watch the "Red"', description: 'Healthy gums are light pink and firm. If yours are dark red or puffy, it is an early sign of gingivitis that needs attention.' },
      { id: 'gb7', title: 'Stress & Gums', description: 'High cortisol levels trigger gum inflammation. Practice 5 minutes of deep breathing to help lower your body\'s inflammatory response.' },
      { id: 'gb8', title: 'Oil Pulling', description: 'Swishing coconut oil for 10 minutes can reduce plaque buildup and draw out toxins from the gum line.' },
      { id: 'gb9', title: 'Iron Check', description: 'Chronic bleeding can sometimes be related to iron or K-vitamin deficiencies. Consult a doctor if bleeding persists despite good care.' },
      { id: 'gb10', title: 'The "Scrub" Error', description: 'Never "scrub" your gums. Use light, vibrating motions. You want to remove plaque, not the top layer of your skin.' },
    ]
  },
  'Sensitivity': {
    problem: 'Sensitivity',
    tips: [
      { id: 'se1', title: 'Desensitizing Science', description: 'Use toothpaste containing Potassium Nitrate. It works by blocking the tiny tubules in the dentin that lead to the nerves.' },
      { id: 'se2', title: 'Acidic Buffer', description: 'If you drink orange juice or soda, don\'t brush for 30 mins. Acid softens enamel; brushing too soon actually scrubs the enamel away.' },
      { id: 'se3', title: 'Straw Strategy', description: 'Use a straw for cold or sugary drinks. This bypasses your teeth and reduces contact with sensitive nerve endings.' },
      { id: 'se4', title: 'Bruxism Guard', description: 'Sensitivity is often caused by grinding (bruxism) at night. A custom night guard prevents enamel from being filed down.' },
      { id: 'se5', title: 'Fluoride Varnish', description: 'Ask your dentist for a professional fluoride varnish. It creates a temporary shield that can reduce sensitivity for months.' },
      { id: 'se6', title: 'Lukewarm Hygiene', description: 'Shocking sensitive teeth with freezing water causes pain. Use room-temperature water for both brushing and rinsing.' },
      { id: 'se7', title: 'The "Dab" Method', description: 'For extra relief, rub a small amount of sensitive toothpaste directly onto the sensitive spot before going to bed.' },
      { id: 'se8', title: 'Avoid Whitening', description: 'Many whitening strips use peroxide that opens pores in the teeth. Pause whitening treatments until sensitivity is managed.' },
      { id: 'se9', title: 'Soft Food Transition', description: 'Avoid crunchy foods like ice or hard crusts that can put mechanical stress on exposed tooth roots.' },
      { id: 'se10', title: 'Gum Recession Check', description: 'Sensitivity often occurs where gums have pulled back. Check for "yellowish" areas near the gum line—this is exposed root.' },
    ]
  },
  'Crown': {
    problem: 'Crown',
    tips: [
      { id: 'cr1', title: 'Margin Hygiene', description: 'The most vulnerable part of a crown is the margin (where it meets the natural tooth). Focus your brushing specifically along the gumline to prevent decay underneath.' },
      { id: 'cr2', title: 'Avoid Sticky Foods', description: 'Avoid extremely sticky foods like taffy or hard caramels, which can generate enough suction to dislodge even a well-cemented crown.' },
      { id: 'cr3', title: 'Bruxism Protection', description: 'Porcelain can chip. If you grind your teeth at night, a night guard is essential to protect the crown from excessive occlusal forces.' },
      { id: 'cr4', title: 'Proper Flossing Technique', description: 'When flossing around a crown, slide the floss out sideways rather than pulling it up. Pulling up can sometimes catch the edge of the crown and lift it.' },
      { id: 'cr5', title: 'Monitor Sensitivity', description: 'Some sensitivity after a new crown is normal. However, persistent pain when biting may mean the crown is "high" and needs a minor adjustment by your dentist.' },
      { id: 'cr6', title: 'Gum Health Around Crowns', description: 'Bacteria can easily hide at the junction of the crown and gum. Use an interdental brush once a day to ensure this area is perfectly clean.' },
      { id: 'cr7', title: 'Avoid Using Teeth as Tools', description: 'Never use a crowned tooth to open packages or bite nails. The sheer forces can cause internal fractures in the underlying tooth structure.' },
      { id: 'cr8', title: 'Check for Looseness', description: 'If you feel any movement or hear a clicking sound when chewing, see your dentist immediately. A loose crown can trap bacteria and cause rapid decay.' },
      { id: 'cr9', title: 'Fluoride Support', description: 'Even though a crown cannot decay, the natural tooth supporting it can. Use a fluoride mouthwash daily to keep the underlying structure strong.' },
      { id: 'cr10', title: 'Regular X-rays', description: 'X-rays are the only way to see decay underneath a crown. Ensure your dentist takes periodic checkup films to catch issues early.' }
    ]
  },
  'Bridges': {
    problem: 'Bridges',
    tips: [
      { id: 'br1', title: 'The Pontic Gap', description: 'The pontic is the fake tooth. Because it sits above the gum, food traps easily underneath. You MUST clean this gap daily.' },
      { id: 'br2', title: 'Floss Threaders', description: 'Standard floss cannot go through a bridge. Use a floss threader or "Superfloss" to pull the cleaning agent through the gap and under the pontic.' },
      { id: 'br3', title: 'Abutment Support', description: 'A bridge is only as strong as the teeth supporting it (abutments). If one abutment tooth decays, the entire bridge fails. Double your efforts on those specific teeth.' },
      { id: 'br4', title: 'Water Flosser Efficacy', description: 'A water flosser (like a Waterpik) is excellent for bridges. Use it at a medium setting to flush out debris from under the bridge frame.' },
      { id: 'br5', title: 'Gingival Stimulation', description: 'Massage the gums under the bridge with a rubber-tip stimulator to maintain blood flow and prevent gum recession under the pontic.' },
      { id: 'br6', title: 'Avoid Hard Seeds', description: 'Small seeds (like from berries or poppy seeds) get stuck under bridges easily and can cause painful localized inflammation.' },
      { id: 'br7', title: 'Speech Training', description: 'A new bridge might change your speech slightly. Practice reading aloud to help your tongue adjust to the new internal mouth geometry.' },
      { id: 'br8', title: 'Bridges & Bad Breath', description: 'If you notice a persistent smell from the bridge area, it likely means food is trapped. Increase cleaning frequency immediately.' },
      { id: 'br9', title: 'Non-Abrasive Paste', description: 'Use a non-abrasive toothpaste to avoid scratching the porcelain or metal of the bridge, which can attract more plaque.' },
      { id: 'br10', title: 'Supportive Diet', description: 'While bridges are strong, avoid biting directly into very hard items (like whole apples) with the bridge. Cut them into smaller pieces instead.' }
    ]
  },
  'Post extraction care': {
    problem: 'Post extraction care',
    tips: [
      { id: 'pe1', title: 'The 24-Hour Clot', description: 'The first 24 hours are critical. A blood clot must form in the socket. Do NOT spit, smoke, or use a straw, as the vacuum pressure will pull the clot out.' },
      { id: 'pe2', title: 'Cold for Swelling', description: 'Apply ice to the outside of the face for 20 minutes on, 20 minutes off during the first day to minimize postoperative swelling and bruising.' },
      { id: 'pe3', title: 'Salt Water Therapy', description: 'AFTER 24 hours, begin gentle warm salt water rinses (1/2 tsp salt in 1 cup water). Do this 4-5 times a day to keep the site clean and speed healing.' },
      { id: 'pe4', title: 'Soft Diet Transition', description: 'Eat only soft foods like yogurt, pudding, or lukewarm soup for the first 48 hours. Avoid spicy, hot, or crunchy foods that could irritate the socket.' },
      { id: 'pe5', title: 'Avoid Physical Strain', description: 'Keep physical activity to a minimum for 2-3 days. Increased heart rate can lead to increased bleeding at the extraction site.' },
      { id: 'pe6', title: 'Bite on Gauze', description: 'If bleeding persists, bite firmly on a clean gauze pad for 30-45 minutes. If that fails, a moistened black tea bag can help constrict blood vessels.' },
      { id: 'pe7', title: 'Head Elevation Sleep', description: 'Sleep with your head elevated on extra pillows for the first 2 nights. This reduces blood pressure in the head and minimizes throbbing.' },
      { id: 'pe8', title: 'Medication Timing', description: 'Take your first dose of pain medication BEFORE the local anesthesia wears off completely to stay ahead of the pain curve.' },
      { id: 'pe9', title: 'Hydration Caution', description: 'Drink plenty of water to stay hydrated, but again—no straws! Sip directly from a glass or use a spoon.' },
      { id: 'pe10', title: 'Danger Signs', description: 'Contact your dentist if you have: severe pain that isn\'t relieved by meds (Dry Socket), fever/chills, or foul-smelling discharge from the site.' }
    ]
  },
  'Implant': {
    problem: 'Implant',
    tips: [
      { id: 'im1', title: 'Implants Aren\'t Decay-Proof', description: 'While the implant itself is titanium, the gums and bone around it are still susceptible to disease (Peri-implantitis). Hygiene is just as critical as with natural teeth.' },
      { id: 'im2', title: 'Non-Metal Cleaners', description: 'Avoid using any metal tools to clean your implant at home. Use only nylon-coated interproximal brushes or specialized plastic picks to avoid scratching the titanium.' },
      { id: 'im3', title: 'Low-Abrasive Paste', description: 'Use a toothpaste with low RDA (Relative Dentin Abrasivity) to keep the implant crown polished and free of micro-scratches that harbor bacteria.' },
      { id: 'im4', title: 'Water Flossing Benefits', description: 'Water flossers are excellent for reaching the deep pockets around implants that traditional floss might miss.' },
      { id: 'im5', title: 'Check for "Mobility"', description: 'A dental implant should never move. If you feel even the slightest wiggle, it could mean a loose screw or bone loss. See your dentist immediately.' },
      { id: 'im6', title: 'Smoking & Implants', description: 'Smoking significantly increases the risk of implant failure by reducing blood flow to the bone. Avoiding tobacco is the best way to ensure longevity.' },
      { id: 'im7', title: 'Systemic Health Link', description: 'Manage conditions like diabetes closely. Uncontrolled blood sugar can impair the body\'s ability to maintain the bone-to-implant bond.' },
      { id: 'im8', title: 'Gum Recession Monitoring', description: 'If the metal of the implant becomes visible at the gumline, it may indicate recession or bone loss. Professional assessment is required.' },
      { id: 'im9', title: 'Avoid Extreme Force', description: 'Avoid biting into extremely hard objects like ice or hard candy. While implants are strong, they don\'t have the "shock absorber" ligament that natural teeth do.' },
      { id: 'im10', title: 'Specific Professional Cleaning', description: 'Ensure your dental hygienist uses specialized plastic or titanium scalers during your cleanings to prevent damaging the implant surface.' }
    ]
  },
  'Braces': {
    problem: 'Braces',
    tips: [
      { id: 'bc1', title: 'Post-Meal Inspection', description: 'Food sticks to braces instantly. Check your smile in a mirror after every single meal to ensure no debris is visible.' },
      { id: 'bc2', title: 'The Ortho-Brush', description: 'Use a specialized orthodontic toothbrush with a "V" shape in the bristles. This allows you to clean over the wires and brackets simultaneously.' },
      { id: 'bc3', title: 'Wax for Comfort', description: 'New braces or a poking wire can cause painful ulcers. Apply a small pea-sized amount of orthodontic wax to the irritating bracket to create a smooth barrier.' },
      { id: 'bc4', title: 'Interproximal Detailing', description: 'Use tiny "Christmas tree" brushes (proxabrushes) to clean behind the wire and between the brackets where a normal brush can\'t reach.' },
      { id: 'bc5', title: 'Floss Threader Duty', description: 'You still need to floss! Use a floss threader to pass the floss under the main archwire so you can clean the actual spaces between your teeth.' },
      { id: 'bc6', title: 'No-No Foods List', description: 'Avoid anything "Hard, Sticky, or Crunchy." This includes popcorn kernels, whole carrots, gummy bears, and nuts. These break brackets and bend wires.' },
      { id: 'bc7', title: 'Gum Tissue Overgrowth', description: 'If your gums look puffy or start covering the brackets, it means you aren\'t brushing the gumline enough. Focus on the area where the tooth meets the gum.' },
      { id: 'bc8', title: 'White Spot Warning', description: 'Failing to clean around brackets leads to "decalcification" (white spots). These are permanent scars on your enamel that appear once the braces are removed.' },
      { id: 'bc9', title: 'Mouthguard for Sports', description: 'If you play contact sports, you MUST wear a specialized orthodontic mouthguard. A hit to the mouth with braces can cause severe soft tissue lacerations.' },
      { id: 'bc10', title: 'Elastics Compliance', description: 'If your orthodontist gives you rubber bands (elastics), wear them exactly as directed. Skipping them adds months to your treatment time.' }
    ]
  }
};
