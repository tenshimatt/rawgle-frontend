/**
 * Comprehensive Raw Feeding Glossary Data
 * Contains 300+ terms related to raw dog feeding, nutrition, anatomy, and health
 */

export interface GlossaryTerm {
  id: string;
  name: string;
  category: GlossaryCategory;
  shortDefinition: string;
  detailedExplanation: string;
  relatedTerms?: string[];
}

export type GlossaryCategory =
  | 'Nutrition'
  | 'Anatomy'
  | 'Food Types'
  | 'Feeding Methods'
  | 'Health'
  | 'Supplements';

export const glossary: GlossaryTerm[] = [
  // FEEDING METHODS & MODELS
  {
    id: 'barf',
    name: 'BARF',
    category: 'Feeding Methods',
    shortDefinition: 'Biologically Appropriate Raw Food - a raw feeding model that includes vegetables and supplements',
    detailedExplanation: 'BARF (Biologically Appropriate Raw Food or Bones and Raw Food) is a raw feeding philosophy developed by Dr. Ian Billinghurst. It typically consists of 70% raw muscle meat, 10% raw edible bone, 5% liver, 5% other secreting organs, and 10% vegetables/fruits. This model emphasizes variety and includes plant matter to mimic the stomach contents of prey animals.',
    relatedTerms: ['Prey Model', 'PMR', 'Raw Feeding', 'Whole Prey']
  },
  {
    id: 'pmr',
    name: 'PMR',
    category: 'Feeding Methods',
    shortDefinition: 'Prey Model Raw - feeding whole prey animals or portions following 80/10/10 ratios',
    detailedExplanation: 'Prey Model Raw is a raw feeding approach that aims to replicate what a dog would eat in the wild by feeding whole prey animals or portions that mimic prey. The standard ratio is 80% muscle meat, 10% raw edible bone, and 10% organ meat (half of which should be liver). This model excludes vegetables, fruits, and dairy.',
    relatedTerms: ['BARF', '80/10/10', 'Whole Prey', 'Franken Prey']
  },
  {
    id: '80-10-10',
    name: '80/10/10',
    category: 'Feeding Methods',
    shortDefinition: 'The standard Prey Model Raw ratio: 80% muscle meat, 10% bone, 10% organ',
    detailedExplanation: 'The 80/10/10 ratio is the foundation of Prey Model Raw feeding. It consists of 80% muscle meat (including heart), 10% raw edible bone, and 10% organ meat (with 5% being liver and 5% being other secreting organs like kidney, spleen, or pancreas). This ratio approximates the composition of a whole prey animal.',
    relatedTerms: ['PMR', 'Prey Model', 'Muscle Meat', 'Organ Meat']
  },
  {
    id: 'whole-prey',
    name: 'Whole Prey',
    category: 'Feeding Methods',
    shortDefinition: 'Feeding complete animals including fur, feathers, organs, and bones',
    detailedExplanation: 'Whole prey feeding involves feeding entire animals such as rabbits, quail, mice, rats, or fish. This is considered the most natural form of raw feeding as it provides complete nutrition in the proper ratios, including fur or feathers for fiber, all organs, bones, and muscle meat. It eliminates the need to balance individual components.',
    relatedTerms: ['PMR', 'Franken Prey', 'Complete Meal', 'Natural Diet']
  },
  {
    id: 'franken-prey',
    name: 'Franken Prey',
    category: 'Feeding Methods',
    shortDefinition: 'Creating balanced meals from various animal parts to mimic whole prey',
    detailedExplanation: 'Franken Prey (or Frankenprey) is a feeding method where you combine different parts from various animals to create a meal that mimics the nutritional profile of whole prey. For example, using chicken backs for bone, beef muscle meat, and pork liver. This approach follows PMR ratios but offers more flexibility than feeding whole prey animals.',
    relatedTerms: ['PMR', 'Whole Prey', '80/10/10', 'Balanced Meal']
  },
  {
    id: 'raw-feeding',
    name: 'Raw Feeding',
    category: 'Feeding Methods',
    shortDefinition: 'Feeding dogs uncooked meat, bones, and organs as their primary diet',
    detailedExplanation: 'Raw feeding is a dietary practice of feeding dogs raw, uncooked ingredients including muscle meat, bones, organs, and sometimes vegetables. This approach is based on the premise that dogs thrive on a diet similar to what their wild ancestors consumed. Raw feeding can include various models such as BARF, PMR, or whole prey.',
    relatedTerms: ['BARF', 'PMR', 'Species Appropriate', 'Natural Diet']
  },

  // FOOD TYPES - MEAT
  {
    id: 'muscle-meat',
    name: 'Muscle Meat',
    category: 'Food Types',
    shortDefinition: 'The skeletal muscle tissue from animals, primary protein source',
    detailedExplanation: 'Muscle meat is the primary component of a raw diet, typically comprising 70-80% of the meal. This includes meat from various animals such as beef, chicken, turkey, lamb, pork, and fish. Muscle meat provides essential proteins and amino acids. Examples include chicken breast, beef chunks, turkey thigh meat, and lamb shoulder.',
    relatedTerms: ['Protein', 'Amino Acids', 'Red Meat', 'White Meat']
  },
  {
    id: 'organ-meat',
    name: 'Organ Meat',
    category: 'Food Types',
    shortDefinition: 'Internal organs providing essential vitamins and minerals',
    detailedExplanation: 'Organ meat, also called offal, includes nutrient-dense internal organs like liver, kidney, spleen, pancreas, brain, and thymus. These organs are vitamin and mineral powerhouses, particularly rich in vitamins A, D, E, K, and B-complex vitamins. In PMR, organs should comprise 10% of the diet, with liver making up half of that.',
    relatedTerms: ['Offal', 'Liver', 'Kidney', 'Secreting Organs']
  },
  {
    id: 'offal',
    name: 'Offal',
    category: 'Food Types',
    shortDefinition: 'Another term for organ meats and internal organs',
    detailedExplanation: 'Offal is the culinary term for internal organs and entrails of animals. In raw feeding, offal refers specifically to secreting organs that provide concentrated nutrition. Quality offal should come from healthy, preferably grass-fed or pasture-raised animals. Common offal includes liver, kidney, spleen, pancreas, thymus, and brain.',
    relatedTerms: ['Organ Meat', 'Liver', 'Kidney', 'Secreting Organs']
  },
  {
    id: 'red-meat',
    name: 'Red Meat',
    category: 'Food Types',
    shortDefinition: 'Meat from mammals like beef, lamb, pork, and venison',
    detailedExplanation: 'Red meat comes from mammals and is characterized by higher myoglobin content, which gives it the red color. Common red meats in raw feeding include beef, lamb, pork, venison, goat, and bison. Red meats are typically higher in iron, zinc, and certain B vitamins compared to white meat. They provide variety and different nutritional profiles.',
    relatedTerms: ['Muscle Meat', 'White Meat', 'Beef', 'Lamb']
  },
  {
    id: 'white-meat',
    name: 'White Meat',
    category: 'Food Types',
    shortDefinition: 'Poultry meat from chicken, turkey, duck, and other birds',
    detailedExplanation: 'White meat refers to poultry from birds such as chicken, turkey, duck, quail, and game birds. It has lower myoglobin content than red meat, resulting in a lighter color. White meats are often leaner and provide different amino acid profiles. Poultry is commonly used in raw feeding due to availability and affordability.',
    relatedTerms: ['Muscle Meat', 'Red Meat', 'Poultry', 'Chicken']
  },
  {
    id: 'tripe',
    name: 'Tripe',
    category: 'Food Types',
    shortDefinition: 'Stomach lining of ruminant animals, rich in digestive enzymes',
    detailedExplanation: 'Tripe is the stomach lining of ruminant animals such as cattle, sheep, and goats. Green tripe (unwashed, unbleached) is highly valued in raw feeding for its digestive enzymes, probiotics, and balanced calcium-to-phosphorus ratio. It contains partially digested plant matter from the animal\'s stomach. Tripe has a strong odor but is extremely palatable and nutritious for dogs.',
    relatedTerms: ['Green Tripe', 'Muscle Meat', 'Probiotics', 'Digestive Enzymes']
  },
  {
    id: 'green-tripe',
    name: 'Green Tripe',
    category: 'Food Types',
    shortDefinition: 'Raw, unbleached stomach lining retaining natural enzymes and probiotics',
    detailedExplanation: 'Green tripe is the raw, unwashed, and unbleached stomach lining of grazing animals. Unlike the white tripe sold for human consumption, green tripe retains all its natural enzymes, beneficial bacteria, and partially digested vegetation. It has a near-perfect 1:1 calcium-to-phosphorus ratio and is an excellent addition to a raw diet for digestive health.',
    relatedTerms: ['Tripe', 'Probiotics', 'Digestive Health', 'Ruminant']
  },
  {
    id: 'heart',
    name: 'Heart',
    category: 'Food Types',
    shortDefinition: 'Cardiac muscle, classified as muscle meat but rich in taurine',
    detailedExplanation: 'Heart is a dense muscle meat that provides high-quality protein and is especially rich in taurine, CoQ10, and B vitamins. While technically an organ, heart is nutritionally classified as muscle meat in raw feeding ratios. Beef heart, lamb heart, and chicken hearts are common options. Heart should be included regularly, especially for large breed dogs.',
    relatedTerms: ['Muscle Meat', 'Taurine', 'CoQ10', 'Cardiac Muscle']
  },
  {
    id: 'liver',
    name: 'Liver',
    category: 'Food Types',
    shortDefinition: 'Nutrient-dense organ providing vitamin A, B vitamins, and iron',
    detailedExplanation: 'Liver is one of the most nutrient-dense foods available, rich in vitamin A, B vitamins (especially B12), iron, copper, and folate. In raw feeding, liver should comprise 5% of the diet. Overfeeding liver can cause vitamin A toxicity, so proper portioning is essential. Beef liver, chicken liver, and lamb liver are common choices.',
    relatedTerms: ['Organ Meat', 'Vitamin A', 'Iron', 'Secreting Organ']
  },
  {
    id: 'kidney',
    name: 'Kidney',
    category: 'Food Types',
    shortDefinition: 'Organ rich in B vitamins, iron, and selenium',
    detailedExplanation: 'Kidneys are nutrient-rich organs that provide B vitamins, iron, selenium, and high-quality protein. They have a distinct flavor that most dogs enjoy. Beef kidney, lamb kidney, and pork kidney are commonly used. Kidneys should be included as part of the 5% "other organs" portion in a balanced raw diet.',
    relatedTerms: ['Organ Meat', 'Offal', 'Secreting Organ', 'B Vitamins']
  },
  {
    id: 'spleen',
    name: 'Spleen',
    category: 'Food Types',
    shortDefinition: 'Iron-rich organ supporting immune function',
    detailedExplanation: 'The spleen is a dark red organ rich in iron and protein. It supports blood health and immune function. Spleen has a smooth texture and is highly palatable for most dogs. It can be fed as part of the 5% "other organs" portion. Beef spleen and pork spleen are most commonly available.',
    relatedTerms: ['Organ Meat', 'Iron', 'Immune Support', 'Blood Building']
  },
  {
    id: 'pancreas',
    name: 'Pancreas',
    category: 'Food Types',
    shortDefinition: 'Organ providing digestive enzymes, particularly beneficial for EPI',
    detailedExplanation: 'The pancreas is a glandular organ that produces digestive enzymes and insulin. In raw feeding, pancreas is valued for its enzyme content, which can support digestion. It is especially beneficial for dogs with Exocrine Pancreatic Insufficiency (EPI). Pancreas should be included in the 5% "other organs" rotation.',
    relatedTerms: ['Organ Meat', 'Digestive Enzymes', 'EPI', 'Secreting Organ']
  },
  {
    id: 'thymus',
    name: 'Thymus',
    category: 'Food Types',
    shortDefinition: 'Glandular organ supporting immune system development',
    detailedExplanation: 'The thymus, also called sweetbread, is a glandular organ located in the chest cavity. It is rich in immune-supporting compounds and is particularly beneficial for growing puppies and senior dogs. Thymus has a delicate texture and mild flavor. Beef thymus and lamb thymus are available from specialty butchers.',
    relatedTerms: ['Organ Meat', 'Sweetbread', 'Immune Support', 'Glandular Tissue']
  },
  {
    id: 'brain',
    name: 'Brain',
    category: 'Food Types',
    shortDefinition: 'Organ high in omega-3 fatty acids and phospholipids',
    detailedExplanation: 'Brain is a soft organ tissue rich in omega-3 fatty acids, particularly DHA, as well as phospholipids that support neurological health. While not commonly fed due to availability, brain can be a valuable addition to a raw diet. Beef brain and lamb brain may be available from specialty suppliers.',
    relatedTerms: ['Organ Meat', 'Omega-3', 'DHA', 'Neurological Health']
  },
  {
    id: 'tongue',
    name: 'Tongue',
    category: 'Food Types',
    shortDefinition: 'Fatty muscle meat with unique texture and high palatability',
    detailedExplanation: 'Tongue is technically muscle meat but has a higher fat content and unique texture. It is very palatable and provides good protein along with B vitamins and minerals. Beef tongue, lamb tongue, and pork tongue can all be fed as part of the muscle meat portion. Tongue requires longer chewing, providing dental benefits.',
    relatedTerms: ['Muscle Meat', 'Fatty Meat', 'High Palatability', 'Cheek Meat']
  },
  {
    id: 'cheek-meat',
    name: 'Cheek Meat',
    category: 'Food Types',
    shortDefinition: 'Flavorful facial muscle meat, often marbled with fat',
    detailedExplanation: 'Cheek meat comes from the facial muscles of animals and is prized for its flavor and texture. Beef cheeks and pork cheeks are commonly available and provide well-marbled, tender muscle meat. Cheek meat requires extended chewing, which offers dental benefits and mental stimulation.',
    relatedTerms: ['Muscle Meat', 'Tongue', 'Fatty Meat', 'Face Meat']
  },
  {
    id: 'tail',
    name: 'Tail',
    category: 'Food Types',
    shortDefinition: 'Bony meat cut providing bone content and collagen',
    detailedExplanation: 'Tails are bony appendages that provide both meat and bone content. Oxtail (beef tail) and pig tails are popular in raw feeding. They are rich in collagen and gelatin, supporting joint health. Tails can be challenging to portion and may require sectioning for appropriate serving sizes.',
    relatedTerms: ['Raw Meaty Bones', 'Collagen', 'Gelatin', 'Bone Content']
  },
  {
    id: 'feet',
    name: 'Feet',
    category: 'Food Types',
    shortDefinition: 'Extremities rich in collagen, cartilage, and connective tissue',
    detailedExplanation: 'Animal feet (chicken feet, duck feet, pig trotters, cow feet) are excellent sources of collagen, glucosamine, and chondroitin. They support joint health and provide recreational chewing. Feet are often higher in bone content and should be factored into bone ratios. They are particularly beneficial for senior dogs and large breeds prone to joint issues.',
    relatedTerms: ['Cartilage', 'Collagen', 'Joint Support', 'Recreational Bones']
  },
  {
    id: 'ears',
    name: 'Ears',
    category: 'Food Types',
    shortDefinition: 'Cartilaginous treats high in chondroitin and glucosamine',
    detailedExplanation: 'Ears (pig ears, cow ears, lamb ears) are cartilage-rich treats that provide glucosamine and chondroitin for joint health. They are low in bone but high in connective tissue. Ears make excellent recreational chews and are typically well-tolerated. Dehydrated ears are common, but raw ears offer additional moisture and nutrients.',
    relatedTerms: ['Cartilage', 'Joint Support', 'Recreational Chews', 'Connective Tissue']
  },
  {
    id: 'trachea',
    name: 'Trachea',
    category: 'Food Types',
    shortDefinition: 'Windpipe composed of cartilage rings, supports joint health',
    detailedExplanation: 'Trachea (windpipe) consists of cartilage rings and is an excellent source of glucosamine and chondroitin. Beef trachea is most common and can be fed as a recreational chew or incorporated into meals. Trachea is hollow and can be stuffed with ground meat or organs for enrichment activities.',
    relatedTerms: ['Cartilage', 'Glucosamine', 'Chondroitin', 'Recreational Chews']
  },
  {
    id: 'tendons',
    name: 'Tendons',
    category: 'Food Types',
    shortDefinition: 'Dense connective tissue providing collagen and protein',
    detailedExplanation: 'Tendons are tough connective tissues that attach muscles to bones. Beef tendons and kangaroo tendons are popular. They provide high-quality protein, collagen, and glucosamine. Tendons are excellent for aggressive chewers and support dental health through extended chewing. They can be fed raw or dehydrated.',
    relatedTerms: ['Connective Tissue', 'Collagen', 'Dental Health', 'Recreational Chews']
  },
  {
    id: 'fish',
    name: 'Fish',
    category: 'Food Types',
    shortDefinition: 'Aquatic protein source rich in omega-3 fatty acids',
    detailedExplanation: 'Fish provides high-quality protein and omega-3 fatty acids (EPA and DHA), which support skin, coat, joint, and cognitive health. Oily fish like sardines, mackerel, salmon, and herring are particularly beneficial. Fish can be fed whole (with bones) or as fillets. Variety is important to minimize heavy metal exposure. Always use wild-caught when possible and be aware of thiaminase in certain fish species.',
    relatedTerms: ['Omega-3', 'EPA', 'DHA', 'Oily Fish']
  },
  {
    id: 'sardines',
    name: 'Sardines',
    category: 'Food Types',
    shortDefinition: 'Small oily fish rich in omega-3s, calcium, and vitamin D',
    detailedExplanation: 'Sardines are small, oily fish that can be fed whole, providing omega-3 fatty acids, calcium from soft bones, and vitamin D. They are low on the food chain, reducing heavy metal concerns. Sardines are highly palatable and nutritious. Feed fresh, frozen, or canned in water (not oil or salt).',
    relatedTerms: ['Fish', 'Omega-3', 'Calcium', 'Whole Prey']
  },
  {
    id: 'salmon',
    name: 'Salmon',
    category: 'Food Types',
    shortDefinition: 'Oily fish high in omega-3s and protein',
    detailedExplanation: 'Salmon is a nutrient-dense fish rich in omega-3 fatty acids, protein, B vitamins, and astaxanthin (a powerful antioxidant). Wild-caught salmon is preferred over farmed. Pacific salmon from certain regions can carry a parasite that causes Salmon Poisoning Disease in dogs, so freezing for at least 7 days or cooking is recommended for Pacific salmon.',
    relatedTerms: ['Fish', 'Omega-3', 'Astaxanthin', 'Salmon Poisoning']
  },
  {
    id: 'mackerel',
    name: 'Mackerel',
    category: 'Food Types',
    shortDefinition: 'Oily fish with high omega-3 content and B vitamins',
    detailedExplanation: 'Mackerel is an oily fish species rich in omega-3 fatty acids, vitamin D, selenium, and B12. It has a strong flavor that most dogs enjoy. Mackerel can be fed whole (for small dogs) or portioned. Being a mid-sized fish, it has moderate mercury levels, so rotation with other fish is recommended.',
    relatedTerms: ['Fish', 'Omega-3', 'Oily Fish', 'Vitamin D']
  },
  {
    id: 'herring',
    name: 'Herring',
    category: 'Food Types',
    shortDefinition: 'Small to medium oily fish high in omega-3 and vitamin D',
    detailedExplanation: 'Herring is a nutritious oily fish that provides omega-3s, vitamin D, selenium, and B vitamins. It is relatively low in mercury due to its size and position in the food chain. Herring can be fed whole or filleted and is highly palatable for most dogs.',
    relatedTerms: ['Fish', 'Omega-3', 'Oily Fish', 'Vitamin D']
  },
  {
    id: 'eggs',
    name: 'Eggs',
    category: 'Food Types',
    shortDefinition: 'Complete protein source with biotin, vitamins, and healthy fats',
    detailedExplanation: 'Eggs are a complete protein source containing all essential amino acids, biotin, vitamins A, D, E, and B-complex, selenium, and healthy fats. They can be fed raw (whole with shell for calcium) or lightly cooked. The shell provides calcium and can be crushed and fed. Eggs are highly digestible and an excellent addition to a raw diet.',
    relatedTerms: ['Protein', 'Biotin', 'Eggshell Calcium', 'Complete Protein']
  },
  {
    id: 'eggshell',
    name: 'Eggshell',
    category: 'Food Types',
    shortDefinition: 'Natural calcium source from chicken eggs',
    detailedExplanation: 'Eggshells are an excellent natural calcium source for dogs on boneless diets or those who cannot tolerate bones. One large eggshell provides approximately 750-900mg of calcium. Eggshells should be washed, dried, and ground into a fine powder before feeding. They can supplement or replace bone in a raw diet.',
    relatedTerms: ['Calcium', 'Eggs', 'Bone Replacement', 'Mineral Supplement']
  },
  {
    id: 'dairy',
    name: 'Dairy',
    category: 'Food Types',
    shortDefinition: 'Milk products that can be fed in moderation if tolerated',
    detailedExplanation: 'Dairy products like raw milk, kefir, yogurt, and cottage cheese can be beneficial for dogs who tolerate lactose. Fermented dairy is easier to digest due to lower lactose content. Dairy provides calcium, protein, probiotics (in fermented forms), and various vitamins. Introduce slowly and monitor for digestive upset.',
    relatedTerms: ['Kefir', 'Yogurt', 'Probiotics', 'Lactose']
  },
  {
    id: 'kefir',
    name: 'Kefir',
    category: 'Food Types',
    shortDefinition: 'Fermented milk rich in probiotics and easily digestible',
    detailedExplanation: 'Kefir is a fermented milk product containing beneficial bacteria and yeast cultures. It is rich in probiotics, which support digestive and immune health. The fermentation process reduces lactose, making it easier to digest than regular milk. Kefir provides calcium, protein, B vitamins, and vitamin K2. Use plain, unsweetened kefir.',
    relatedTerms: ['Dairy', 'Probiotics', 'Fermented Foods', 'Digestive Health']
  },
  {
    id: 'yogurt',
    name: 'Yogurt',
    category: 'Food Types',
    shortDefinition: 'Fermented dairy providing probiotics and calcium',
    detailedExplanation: 'Plain, unsweetened yogurt contains beneficial probiotics that support gut health. Greek yogurt is higher in protein and lower in lactose. Yogurt provides calcium, protein, and B vitamins. Choose products with live active cultures and no added sugars or artificial sweeteners (especially avoid xylitol, which is toxic to dogs).',
    relatedTerms: ['Dairy', 'Probiotics', 'Fermented Foods', 'Calcium']
  },

  // BONES
  {
    id: 'raw-meaty-bones',
    name: 'Raw Meaty Bones (RMB)',
    category: 'Food Types',
    shortDefinition: 'Bones with meat attached, providing bone content and nutrition',
    detailedExplanation: 'Raw Meaty Bones (RMBs) are bones that have a substantial amount of meat attached. They serve dual purposes: providing the necessary bone content for calcium and phosphorus, and contributing to the meat portion of the diet. Examples include chicken quarters, turkey necks, lamb ribs, and pork feet. RMBs should be size-appropriate and always fed raw, never cooked.',
    relatedTerms: ['Edible Bones', 'Recreational Bones', 'Calcium', 'Bone Content']
  },
  {
    id: 'edible-bones',
    name: 'Edible Bones',
    category: 'Food Types',
    shortDefinition: 'Soft bones that can be completely consumed and digested',
    detailedExplanation: 'Edible bones are soft enough to be chewed and digested by dogs, providing essential calcium and phosphorus. These include chicken necks, wings, backs, turkey necks, rabbit bones, and fish bones. Edible bones should comprise about 10% of a raw diet. They should be size-appropriate and fed under supervision.',
    relatedTerms: ['Raw Meaty Bones', 'Calcium', 'Bone Content', 'Soft Bones']
  },
  {
    id: 'recreational-bones',
    name: 'Recreational Bones',
    category: 'Food Types',
    shortDefinition: 'Large, hard bones for chewing enjoyment and dental health',
    detailedExplanation: 'Recreational bones are large, dense bones meant for chewing pleasure and dental benefits rather than consumption. Examples include beef knuckle bones, marrow bones, and femur bones. These bones should be too large to swallow and durable enough to withstand extended chewing. They provide mental stimulation and help clean teeth. Always supervise and remove if the bone becomes small enough to swallow or develops sharp edges.',
    relatedTerms: ['Dental Health', 'Marrow Bones', 'Enrichment', 'Weight-Bearing Bones']
  },
  {
    id: 'weight-bearing-bones',
    name: 'Weight-Bearing Bones',
    category: 'Food Types',
    shortDefinition: 'Dense bones from legs that support animal body weight',
    detailedExplanation: 'Weight-bearing bones come from the legs of large animals (cattle, bison, elk) and are extremely dense. These include femur, tibia, and humerus bones. They are typically used as recreational bones but can be too hard for some dogs, potentially causing tooth fractures. Weight-bearing bones are best suited for powerful chewers and should be monitored carefully.',
    relatedTerms: ['Recreational Bones', 'Marrow Bones', 'Femur', 'Dense Bones']
  },
  {
    id: 'marrow-bones',
    name: 'Marrow Bones',
    category: 'Food Types',
    shortDefinition: 'Large bones with marrow-filled cavities, used for recreation',
    detailedExplanation: 'Marrow bones are cross-sections of large leg bones (usually beef) that contain bone marrow in the center cavity. The marrow is highly nutritious and palatable. These bones serve as recreational chews and provide mental enrichment. Monitor for excessive marrow consumption, which can cause digestive upset in some dogs. Remove if the bone becomes small enough to fit in the dog\'s mouth.',
    relatedTerms: ['Recreational Bones', 'Bone Marrow', 'Enrichment', 'Beef Bones']
  },
  {
    id: 'chicken-backs',
    name: 'Chicken Backs',
    category: 'Food Types',
    shortDefinition: 'Bony chicken portion providing good bone-to-meat ratio',
    detailedExplanation: 'Chicken backs are an affordable source of edible bone in raw feeding. They have a higher bone-to-meat ratio (approximately 40-50% bone) compared to other cuts, making them useful for dogs who need more bone content. They are soft and easily consumable. Chicken backs are rich in cartilage and collagen, supporting joint health.',
    relatedTerms: ['Edible Bones', 'Raw Meaty Bones', 'Chicken', 'High Bone Content']
  },
  {
    id: 'chicken-necks',
    name: 'Chicken Necks',
    category: 'Food Types',
    shortDefinition: 'Soft edible bones ideal for small to medium dogs',
    detailedExplanation: 'Chicken necks are one of the most commonly used edible bones in raw feeding. They have a balanced bone-to-meat ratio (about 36% bone) and are suitable for most dogs. Necks are rich in glucosamine and chondroitin from cartilage. They can be fed whole to medium/large dogs or chopped for smaller dogs. Some gulpers may need them partially frozen.',
    relatedTerms: ['Edible Bones', 'Raw Meaty Bones', 'Chicken', 'Cartilage']
  },
  {
    id: 'chicken-wings',
    name: 'Chicken Wings',
    category: 'Food Types',
    shortDefinition: 'Balanced raw meaty bones with moderate bone content',
    detailedExplanation: 'Chicken wings are excellent raw meaty bones with approximately 46% bone content. They can be fed whole or split (drumette, wingette, tip). Wings provide a good balance of meat and bone and are appropriate for dogs of various sizes. The joints contain beneficial cartilage for joint health.',
    relatedTerms: ['Edible Bones', 'Raw Meaty Bones', 'Chicken', 'Joint Support']
  },
  {
    id: 'chicken-feet',
    name: 'Chicken Feet',
    category: 'Food Types',
    shortDefinition: 'Cartilage-rich extremities supporting joint health',
    detailedExplanation: 'Chicken feet are composed primarily of skin, tendons, and cartilage with small bones. They are rich in glucosamine, chondroitin, collagen, and calcium. Chicken feet are excellent for joint health and make great recreational chews. The nails can be trimmed if desired. They have approximately 60% bone content.',
    relatedTerms: ['Feet', 'Cartilage', 'Glucosamine', 'Joint Support']
  },
  {
    id: 'turkey-necks',
    name: 'Turkey Necks',
    category: 'Food Types',
    shortDefinition: 'Large edible bones suitable for medium to large dogs',
    detailedExplanation: 'Turkey necks are larger versions of chicken necks, appropriate for medium to large dogs. They have approximately 42% bone content and provide extended chewing time. Turkey necks are rich in cartilage and glucosamine. They can be fed whole or cut into sections. For small dogs, they may need to be ground.',
    relatedTerms: ['Edible Bones', 'Raw Meaty Bones', 'Turkey', 'Cartilage']
  },
  {
    id: 'duck-necks',
    name: 'Duck Necks',
    category: 'Food Types',
    shortDefinition: 'Fatty poultry bones with moderate bone content',
    detailedExplanation: 'Duck necks are fattier than chicken or turkey necks and provide approximately 40% bone content. They are suitable for medium to large dogs and offer variety in a raw diet. Duck necks are rich in B vitamins and beneficial fats. They are particularly palatable and can encourage reluctant eaters.',
    relatedTerms: ['Edible Bones', 'Raw Meaty Bones', 'Duck', 'Fatty Meat']
  },
  {
    id: 'duck-feet',
    name: 'Duck Feet',
    category: 'Food Types',
    shortDefinition: 'Webbed feet providing collagen and joint-supporting compounds',
    detailedExplanation: 'Duck feet are larger and meatier than chicken feet, with webbing that provides additional collagen. They support joint health through glucosamine and chondroitin content. Duck feet are excellent recreational chews and can be fed to dogs of various sizes. They have approximately 60% bone content.',
    relatedTerms: ['Feet', 'Cartilage', 'Collagen', 'Joint Support']
  },
  {
    id: 'rabbit',
    name: 'Rabbit',
    category: 'Food Types',
    shortDefinition: 'Complete whole prey option or individual cuts for variety',
    detailedExplanation: 'Rabbit is an excellent protein source for raw feeding, available as whole prey or individual cuts. Whole rabbits provide complete nutrition in natural ratios. Rabbit is lean, hypoallergenic, and rich in B vitamins. It is particularly useful for dogs with food sensitivities. Rabbit bones are soft and edible.',
    relatedTerms: ['Whole Prey', 'Novel Protein', 'Hypoallergenic', 'Lean Meat']
  },
  {
    id: 'quail',
    name: 'Quail',
    category: 'Food Types',
    shortDefinition: 'Small whole prey birds ideal for small to medium dogs',
    detailedExplanation: 'Quail are small game birds that can be fed whole as complete prey. They provide balanced nutrition with meat, bones, organs, and feathers. Quail are rich in protein, B vitamins, and minerals. They are appropriate for small to medium dogs or can be portioned for larger dogs. Quail is considered a novel protein for many dogs.',
    relatedTerms: ['Whole Prey', 'Game Birds', 'Novel Protein', 'Complete Meal']
  },
  {
    id: 'cornish-hen',
    name: 'Cornish Hen',
    category: 'Food Types',
    shortDefinition: 'Small chicken breed suitable for whole prey feeding',
    detailedExplanation: 'Cornish hens are small chickens (typically 1-2 pounds) that can be fed whole to medium and large dogs. They provide a complete meal with appropriate ratios of meat, bone, and organs. Cornish hens offer variety and are widely available. They can be quartered for smaller dogs.',
    relatedTerms: ['Whole Prey', 'Chicken', 'Complete Meal', 'Poultry']
  },
  {
    id: 'lamb-ribs',
    name: 'Lamb Ribs',
    category: 'Food Types',
    shortDefinition: 'Fatty red meat ribs with edible bones',
    detailedExplanation: 'Lamb ribs are rich, fatty raw meaty bones with approximately 27% bone content. They provide high-quality protein and beneficial fats. Lamb ribs are softer than beef or pork ribs and are suitable as edible bones for medium to large dogs. They support weight gain and provide variety in the diet.',
    relatedTerms: ['Raw Meaty Bones', 'Lamb', 'Fatty Meat', 'Edible Bones']
  },
  {
    id: 'pork-ribs',
    name: 'Pork Ribs',
    category: 'Food Types',
    shortDefinition: 'Meaty ribs with moderate bone content',
    detailedExplanation: 'Pork ribs, particularly spare ribs and baby back ribs, provide approximately 30% bone content. They are meatier than most edible bones and offer good chewing time. Pork ribs should be sourced from quality suppliers and fed raw. They are suitable for medium to large dogs and provide B vitamins and minerals.',
    relatedTerms: ['Raw Meaty Bones', 'Pork', 'Edible Bones', 'Red Meat']
  },
  {
    id: 'beef-ribs',
    name: 'Beef Ribs',
    category: 'Food Types',
    shortDefinition: 'Large, meaty ribs used as recreational bones',
    detailedExplanation: 'Beef ribs are large, dense bones typically used as recreational chews rather than edible bones. They provide extended chewing time and dental benefits. The meat on beef ribs is rich and fatty. These bones are suitable for large, powerful chewers. Monitor for aggressive chewing that could cause tooth damage.',
    relatedTerms: ['Recreational Bones', 'Beef', 'Dental Health', 'Large Bones']
  },
  {
    id: 'oxtail',
    name: 'Oxtail',
    category: 'Food Types',
    shortDefinition: 'Beef tail bones rich in collagen and gelatin',
    detailedExplanation: 'Oxtail consists of the tail vertebrae of cattle, providing both meat and bone. Oxtails are rich in collagen and gelatin, supporting joint health and gut lining. They have varying bone density along the tail, with the base being denser. Oxtail can be sectioned and fed as either edible bones (smaller sections) or recreational bones (larger sections).',
    relatedTerms: ['Tail', 'Raw Meaty Bones', 'Collagen', 'Beef']
  },

  // NUTRITION TERMS
  {
    id: 'protein',
    name: 'Protein',
    category: 'Nutrition',
    shortDefinition: 'Essential macronutrient built from amino acids',
    detailedExplanation: 'Protein is a crucial macronutrient composed of amino acids, which are the building blocks of tissues, enzymes, hormones, and antibodies. Dogs require high-quality animal protein for optimal health. Raw feeding provides bioavailable proteins from muscle meat, organs, and bones. Protein needs vary by age, activity level, and health status.',
    relatedTerms: ['Amino Acids', 'Muscle Meat', 'Essential Nutrients', 'Bioavailability']
  },
  {
    id: 'amino-acids',
    name: 'Amino Acids',
    category: 'Nutrition',
    shortDefinition: 'Building blocks of proteins, some essential in diet',
    detailedExplanation: 'Amino acids are organic compounds that form proteins. There are 20 amino acids, 10 of which are essential for dogs (must be obtained from diet). These include arginine, histidine, isoleucine, leucine, lysine, methionine, phenylalanine, threonine, tryptophan, and valine. Animal proteins provide complete amino acid profiles.',
    relatedTerms: ['Protein', 'Essential Amino Acids', 'Taurine', 'Complete Protein']
  },
  {
    id: 'taurine',
    name: 'Taurine',
    category: 'Nutrition',
    shortDefinition: 'Amino acid essential for heart and eye health',
    detailedExplanation: 'Taurine is a sulfur-containing amino acid critical for cardiac function, vision, immune system, and reproduction. While dogs can synthesize taurine, some breeds or individuals may have difficulty producing adequate amounts. Heart meat (especially beef and lamb heart), dark poultry meat, and shellfish are rich in taurine. Taurine deficiency can lead to Dilated Cardiomyopathy (DCM).',
    relatedTerms: ['Amino Acids', 'Heart', 'DCM', 'Cardiac Health']
  },
  {
    id: 'fat',
    name: 'Fat',
    category: 'Nutrition',
    shortDefinition: 'Energy-dense macronutrient providing essential fatty acids',
    detailedExplanation: 'Fat is a concentrated energy source providing essential fatty acids, supporting hormone production, vitamin absorption (A, D, E, K), and cellular function. Raw diets naturally contain varying fat levels depending on meat selection. Dogs can utilize fat efficiently. Fat content should be balanced based on activity level, age, and health status. Typical raw diets contain 15-30% fat.',
    relatedTerms: ['Essential Fatty Acids', 'Omega-3', 'Omega-6', 'Energy']
  },
  {
    id: 'essential-fatty-acids',
    name: 'Essential Fatty Acids (EFA)',
    category: 'Nutrition',
    shortDefinition: 'Fatty acids that must be obtained from diet',
    detailedExplanation: 'Essential Fatty Acids cannot be synthesized by the body and must be obtained from food. The two main families are omega-3 (alpha-linolenic acid) and omega-6 (linoleic acid). EFAs support skin health, coat quality, immune function, brain development, and inflammation control. Balance between omega-3 and omega-6 is important.',
    relatedTerms: ['Omega-3', 'Omega-6', 'Fat', 'Fatty Acids']
  },
  {
    id: 'omega-3',
    name: 'Omega-3 Fatty Acids',
    category: 'Nutrition',
    shortDefinition: 'Anti-inflammatory fatty acids supporting multiple body systems',
    detailedExplanation: 'Omega-3 fatty acids, particularly EPA and DHA, are anti-inflammatory and support cardiovascular health, cognitive function, joint health, skin and coat, and immune function. Rich sources include oily fish (sardines, salmon, mackerel), fish oil, and some grass-fed meats. Omega-3s should be balanced with omega-6 fatty acids, ideally at a ratio of 1:4 to 1:10.',
    relatedTerms: ['EPA', 'DHA', 'Fish', 'Essential Fatty Acids']
  },
  {
    id: 'omega-6',
    name: 'Omega-6 Fatty Acids',
    category: 'Nutrition',
    shortDefinition: 'Fatty acids important for skin, coat, and cell function',
    detailedExplanation: 'Omega-6 fatty acids, particularly linoleic acid and arachidonic acid, support skin and coat health, immune function, and cellular processes. They are abundant in poultry fat, pork, and many plant oils. While essential, excess omega-6 relative to omega-3 can promote inflammation. Most raw diets provide adequate omega-6.',
    relatedTerms: ['Essential Fatty Acids', 'Omega-3', 'Linoleic Acid', 'Fat']
  },
  {
    id: 'epa',
    name: 'EPA',
    category: 'Nutrition',
    shortDefinition: 'Eicosapentaenoic acid, an anti-inflammatory omega-3 fatty acid',
    detailedExplanation: 'EPA (Eicosapentaenoic acid) is a long-chain omega-3 fatty acid found primarily in marine sources. It has potent anti-inflammatory properties and supports joint health, cardiovascular function, and immune response. EPA works synergistically with DHA. Rich sources include fatty fish, fish oil, and krill oil.',
    relatedTerms: ['Omega-3', 'DHA', 'Fish Oil', 'Anti-inflammatory']
  },
  {
    id: 'dha',
    name: 'DHA',
    category: 'Nutrition',
    shortDefinition: 'Docosahexaenoic acid, omega-3 critical for brain and eye development',
    detailedExplanation: 'DHA (Docosahexaenoic acid) is a long-chain omega-3 fatty acid essential for brain development, cognitive function, vision, and nervous system health. It is particularly important for puppies and pregnant/nursing mothers. DHA is found in fatty fish, fish oil, and algae-based supplements. It works alongside EPA for optimal health.',
    relatedTerms: ['Omega-3', 'EPA', 'Fish Oil', 'Brain Health']
  },
  {
    id: 'calcium',
    name: 'Calcium',
    category: 'Nutrition',
    shortDefinition: 'Essential mineral for bone health and cellular function',
    detailedExplanation: 'Calcium is vital for skeletal development, muscle contraction, nerve transmission, blood clotting, and enzyme function. In raw feeding, calcium is primarily obtained from raw edible bones. The calcium-to-phosphorus ratio should be approximately 1:1 to 1.2:1. Deficiency leads to skeletal abnormalities; excess can interfere with other mineral absorption.',
    relatedTerms: ['Phosphorus', 'Bones', 'Minerals', 'Ca:P Ratio']
  },
  {
    id: 'phosphorus',
    name: 'Phosphorus',
    category: 'Nutrition',
    shortDefinition: 'Essential mineral working with calcium for bone health',
    detailedExplanation: 'Phosphorus is crucial for bone formation, energy metabolism (ATP), DNA/RNA structure, and cellular function. It is abundant in meat and bones. Phosphorus must be balanced with calcium at approximately 1:1 to 1.2:1 ratio. Meat is naturally high in phosphorus, which is why bone content is essential to balance the ratio.',
    relatedTerms: ['Calcium', 'Minerals', 'Ca:P Ratio', 'Bones']
  },
  {
    id: 'cap-ratio',
    name: 'Ca:P Ratio',
    category: 'Nutrition',
    shortDefinition: 'Calcium to phosphorus ratio, ideally 1:1 to 1.2:1',
    detailedExplanation: 'The calcium-to-phosphorus ratio is critical for skeletal health and overall mineral balance. The ideal ratio is approximately 1:1 to 1.2:1 (calcium:phosphorus). Meat is high in phosphorus and low in calcium, while bones are high in calcium. This is why edible bones are essential in raw feeding to achieve proper mineral balance.',
    relatedTerms: ['Calcium', 'Phosphorus', 'Minerals', 'Bone Content']
  },
  {
    id: 'iron',
    name: 'Iron',
    category: 'Nutrition',
    shortDefinition: 'Essential mineral for oxygen transport and energy production',
    detailedExplanation: 'Iron is critical for hemoglobin production, oxygen transport, and cellular energy metabolism. Heme iron from animal sources is more bioavailable than non-heme iron from plants. Rich sources include red meat, liver, spleen, and blood. Iron deficiency causes anemia; excess can be toxic and interfere with other minerals.',
    relatedTerms: ['Liver', 'Spleen', 'Red Meat', 'Minerals']
  },
  {
    id: 'zinc',
    name: 'Zinc',
    category: 'Nutrition',
    shortDefinition: 'Mineral supporting immune function, skin health, and metabolism',
    detailedExplanation: 'Zinc is essential for immune function, wound healing, protein synthesis, DNA synthesis, skin and coat health, and sensory function (taste and smell). Rich sources include red meat, liver, and seafood. Zinc absorption can be inhibited by excess calcium or phytic acid. Some breeds (like Huskies) are prone to zinc deficiency.',
    relatedTerms: ['Minerals', 'Immune Support', 'Red Meat', 'Liver']
  },
  {
    id: 'selenium',
    name: 'Selenium',
    category: 'Nutrition',
    shortDefinition: 'Trace mineral with antioxidant and thyroid function',
    detailedExplanation: 'Selenium is a trace mineral that functions as an antioxidant (as part of selenoproteins) and supports thyroid hormone metabolism and immune function. It works synergistically with vitamin E. Sources include organ meats, fish, and muscle meat. Selenium levels vary based on soil content where animals were raised. Both deficiency and toxicity can occur.',
    relatedTerms: ['Minerals', 'Antioxidant', 'Thyroid', 'Organ Meat']
  },
  {
    id: 'magnesium',
    name: 'Magnesium',
    category: 'Nutrition',
    shortDefinition: 'Mineral supporting muscle, nerve, and enzyme function',
    detailedExplanation: 'Magnesium is involved in over 300 enzymatic reactions, supporting muscle and nerve function, bone health, energy production, and cardiovascular health. Sources include green tripe, fish, bones, and some vegetables. Magnesium works with calcium and should be balanced appropriately. Deficiency is rare but can cause neuromuscular issues.',
    relatedTerms: ['Minerals', 'Green Tripe', 'Calcium', 'Enzyme Function']
  },
  {
    id: 'vitamin-a',
    name: 'Vitamin A',
    category: 'Nutrition',
    shortDefinition: 'Fat-soluble vitamin essential for vision, immunity, and growth',
    detailedExplanation: 'Vitamin A is crucial for vision, immune function, cell growth, reproduction, and skin health. Dogs cannot convert beta-carotene to vitamin A, so they require preformed vitamin A from animal sources. Liver is extremely rich in vitamin A. Deficiency causes vision problems and immune dysfunction; excess causes toxicity affecting bones and liver.',
    relatedTerms: ['Liver', 'Fat-Soluble Vitamins', 'Retinol', 'Vision']
  },
  {
    id: 'vitamin-d',
    name: 'Vitamin D',
    category: 'Nutrition',
    shortDefinition: 'Fat-soluble vitamin regulating calcium and phosphorus',
    detailedExplanation: 'Vitamin D regulates calcium and phosphorus absorption and utilization, supporting bone health and immune function. Unlike humans, dogs cannot synthesize adequate vitamin D from sunlight and must obtain it from diet. Rich sources include fatty fish, liver, and egg yolks. Both deficiency and excess can cause serious health issues affecting bones and organs.',
    relatedTerms: ['Fat-Soluble Vitamins', 'Calcium', 'Fish', 'Liver']
  },
  {
    id: 'vitamin-e',
    name: 'Vitamin E',
    category: 'Nutrition',
    shortDefinition: 'Fat-soluble antioxidant protecting cells from damage',
    detailedExplanation: 'Vitamin E is a powerful antioxidant that protects cell membranes from oxidative damage, supports immune function, and aids in cellular communication. It works synergistically with selenium. Sources include muscle meat, organ meats, and eggs. Requirements increase with polyunsaturated fat intake (like fish). Deficiency can cause muscle degeneration.',
    relatedTerms: ['Antioxidant', 'Fat-Soluble Vitamins', 'Selenium', 'Oxidative Stress']
  },
  {
    id: 'vitamin-k',
    name: 'Vitamin K',
    category: 'Nutrition',
    shortDefinition: 'Fat-soluble vitamin essential for blood clotting',
    detailedExplanation: 'Vitamin K is essential for blood clotting and bone metabolism. There are two forms: K1 (phylloquinone) from plants and K2 (menaquinone) from animal sources and bacterial synthesis. Dogs can synthesize some vitamin K in the gut. Sources include liver, fermented foods, and green vegetables. Deficiency causes bleeding disorders.',
    relatedTerms: ['Fat-Soluble Vitamins', 'Blood Clotting', 'Liver', 'Fermented Foods']
  },
  {
    id: 'b-vitamins',
    name: 'B Vitamins',
    category: 'Nutrition',
    shortDefinition: 'Water-soluble vitamins supporting metabolism and energy',
    detailedExplanation: 'B vitamins are a group of water-soluble vitamins (B1, B2, B3, B5, B6, B7, B9, B12) that support energy metabolism, nervous system function, red blood cell formation, and cellular processes. They are abundant in organ meats, muscle meat, eggs, and fish. B vitamins work synergistically. Deficiencies cause various neurological and metabolic issues.',
    relatedTerms: ['Water-Soluble Vitamins', 'B12', 'Liver', 'Energy Metabolism']
  },
  {
    id: 'vitamin-b12',
    name: 'Vitamin B12',
    category: 'Nutrition',
    shortDefinition: 'Water-soluble vitamin crucial for nerve function and red blood cells',
    detailedExplanation: 'Vitamin B12 (cobalamin) is essential for red blood cell formation, DNA synthesis, neurological function, and energy metabolism. It is found exclusively in animal products, with liver being the richest source. B12 deficiency can cause anemia, neurological problems, and fatigue. It is particularly important for dogs on limited diets.',
    relatedTerms: ['B Vitamins', 'Liver', 'Organ Meat', 'Red Blood Cells']
  },
  {
    id: 'biotin',
    name: 'Biotin',
    category: 'Nutrition',
    shortDefinition: 'B vitamin supporting skin, coat, and metabolism',
    detailedExplanation: 'Biotin (vitamin B7) supports skin and coat health, fat and protein metabolism, and gene regulation. It can be synthesized by gut bacteria. Sources include liver, egg yolks, and fish. Raw egg whites contain avidin, which binds biotin and prevents absorption, but this is only a concern with excessive raw egg white consumption.',
    relatedTerms: ['B Vitamins', 'Eggs', 'Liver', 'Coat Health']
  },
  {
    id: 'thiamine',
    name: 'Thiamine',
    category: 'Nutrition',
    shortDefinition: 'Vitamin B1 essential for energy metabolism and nerve function',
    detailedExplanation: 'Thiamine (vitamin B1) is crucial for carbohydrate metabolism, nerve function, and muscle contraction. Certain raw fish (carp, herring, smelt) contain thiaminase, an enzyme that destroys thiamine. Freezing or cooking destroys thiaminase. Thiamine deficiency causes neurological symptoms and can be fatal. Sources include pork, organ meats, and muscle meat.',
    relatedTerms: ['B Vitamins', 'Thiaminase', 'Fish', 'Neurological Health']
  },
  {
    id: 'collagen',
    name: 'Collagen',
    category: 'Nutrition',
    shortDefinition: 'Structural protein supporting joints, skin, and connective tissue',
    detailedExplanation: 'Collagen is the most abundant protein in mammals, forming connective tissue, skin, tendons, ligaments, and cartilage. It supports joint health, skin elasticity, gut lining, and bone strength. Sources include bones (when boiled into broth), trachea, feet, tendons, and cartilage. Collagen contains glycine and proline, important amino acids.',
    relatedTerms: ['Gelatin', 'Cartilage', 'Joint Support', 'Connective Tissue']
  },
  {
    id: 'gelatin',
    name: 'Gelatin',
    category: 'Nutrition',
    shortDefinition: 'Cooked collagen that supports gut and joint health',
    detailedExplanation: 'Gelatin is the cooked form of collagen, created when collagen-rich tissues are heated in water. It forms a gel when cooled and is easily digestible. Gelatin supports gut lining, joint health, and skin elasticity. Bone broth is rich in gelatin. While raw feeding emphasizes uncooked foods, bone broth can be a beneficial addition.',
    relatedTerms: ['Collagen', 'Bone Broth', 'Joint Support', 'Gut Health']
  },
  {
    id: 'glucosamine',
    name: 'Glucosamine',
    category: 'Nutrition',
    shortDefinition: 'Amino sugar supporting cartilage and joint health',
    detailedExplanation: 'Glucosamine is a natural compound found in cartilage that supports joint health, cartilage formation, and joint fluid viscosity. It has anti-inflammatory properties and may slow cartilage degradation. Natural sources include trachea, feet, ears, and cartilaginous bones. Glucosamine works synergistically with chondroitin.',
    relatedTerms: ['Chondroitin', 'Cartilage', 'Joint Support', 'Trachea']
  },
  {
    id: 'chondroitin',
    name: 'Chondroitin',
    category: 'Nutrition',
    shortDefinition: 'Cartilage component supporting joint cushioning and flexibility',
    detailedExplanation: 'Chondroitin sulfate is a major component of cartilage, providing elasticity and cushioning to joints. It supports joint fluid retention and may inhibit cartilage-degrading enzymes. Natural sources include trachea, feet, ears, cartilage, and shark cartilage. Chondroitin works best when combined with glucosamine.',
    relatedTerms: ['Glucosamine', 'Cartilage', 'Joint Support', 'Trachea']
  },
  {
    id: 'coq10',
    name: 'CoQ10',
    category: 'Nutrition',
    shortDefinition: 'Coenzyme supporting cellular energy and heart health',
    detailedExplanation: 'Coenzyme Q10 (CoQ10) is a naturally occurring antioxidant that supports cellular energy production (ATP), heart health, and immune function. It is particularly important for cardiac health and may help prevent DCM. Sources include heart meat, organ meats, and oily fish. Levels decline with age, making supplementation potentially beneficial for senior dogs.',
    relatedTerms: ['Heart', 'Antioxidant', 'Cardiac Health', 'Energy']
  },
  {
    id: 'probiotics',
    name: 'Probiotics',
    category: 'Nutrition',
    shortDefinition: 'Beneficial bacteria supporting gut and immune health',
    detailedExplanation: 'Probiotics are live beneficial bacteria that support digestive health, immune function, nutrient absorption, and protection against pathogenic bacteria. Natural sources include green tripe, fermented foods (kefir, yogurt), and soil from unwashed vegetables. Different strains provide different benefits. Probiotics are especially helpful during stress, illness, or antibiotic treatment.',
    relatedTerms: ['Gut Health', 'Fermented Foods', 'Green Tripe', 'Digestive Health']
  },
  {
    id: 'prebiotics',
    name: 'Prebiotics',
    category: 'Nutrition',
    shortDefinition: 'Non-digestible fibers feeding beneficial gut bacteria',
    detailedExplanation: 'Prebiotics are non-digestible fibers that feed beneficial gut bacteria (probiotics). They support healthy gut flora, improve digestion, and enhance immune function. Sources include raw vegetables (especially those with inulin like asparagus), fruits, and psyllium husk. Prebiotics work synergistically with probiotics.',
    relatedTerms: ['Probiotics', 'Gut Health', 'Fiber', 'Digestive Health']
  },
  {
    id: 'enzymes',
    name: 'Digestive Enzymes',
    category: 'Nutrition',
    shortDefinition: 'Proteins that break down food for absorption',
    detailedExplanation: 'Digestive enzymes are proteins that catalyze the breakdown of food into absorbable nutrients. Main types include protease (protein), lipase (fat), and amylase (carbohydrate). Raw foods naturally contain enzymes that aid digestion. Pancreas and green tripe are particularly rich in enzymes. Dogs with EPI require enzyme supplementation.',
    relatedTerms: ['Pancreas', 'Green Tripe', 'EPI', 'Digestion']
  },
  {
    id: 'antioxidants',
    name: 'Antioxidants',
    category: 'Nutrition',
    shortDefinition: 'Compounds protecting cells from oxidative damage',
    detailedExplanation: 'Antioxidants are molecules that neutralize free radicals, protecting cells from oxidative damage. They support immune function, slow aging, and reduce inflammation. Natural antioxidants include vitamins E and C, selenium, and phytonutrients from vegetables. Sources include organ meats, fish, berries, and colorful vegetables.',
    relatedTerms: ['Vitamin E', 'Selenium', 'Oxidative Stress', 'Free Radicals']
  },
  {
    id: 'fiber',
    name: 'Fiber',
    category: 'Nutrition',
    shortDefinition: 'Indigestible plant material supporting gut health',
    detailedExplanation: 'Fiber is indigestible plant material that supports digestive health, regular bowel movements, and gut flora. While not essential in carnivore diets, moderate fiber can be beneficial. Sources include vegetables, fruits, and psyllium husk. Fur and feathers in whole prey provide natural fiber. Too much fiber can interfere with nutrient absorption.',
    relatedTerms: ['Vegetables', 'Prebiotics', 'Gut Health', 'Whole Prey']
  },

  // ANATOMY TERMS
  {
    id: 'carnivore',
    name: 'Carnivore',
    category: 'Anatomy',
    shortDefinition: 'Animal adapted to eating primarily meat',
    detailedExplanation: 'Dogs are classified as facultative carnivores, meaning their anatomy is designed for meat consumption but they can survive on some plant matter. Carnivore adaptations include short digestive tracts, strong stomach acid, tearing/crushing teeth, and limited ability to digest plant matter. These adaptations make raw meat, bones, and organs ideal foods for dogs.',
    relatedTerms: ['Facultative Carnivore', 'Digestive System', 'Species Appropriate', 'Dentition']
  },
  {
    id: 'facultative-carnivore',
    name: 'Facultative Carnivore',
    category: 'Anatomy',
    shortDefinition: 'Carnivore that can digest some plant matter but thrives on meat',
    detailedExplanation: 'Dogs are facultative carnivores, primarily adapted for meat consumption but capable of digesting some plant material. Their digestive system, dentition, and metabolism are optimized for animal-based foods. While they can survive on mixed diets, they thrive on meat-based nutrition. This distinguishes them from obligate carnivores (cats) and omnivores.',
    relatedTerms: ['Carnivore', 'Omnivore', 'Species Appropriate', 'Digestive System']
  },
  {
    id: 'digestive-tract',
    name: 'Digestive Tract',
    category: 'Anatomy',
    shortDefinition: 'The pathway food takes from mouth to elimination',
    detailedExplanation: 'The canine digestive tract is relatively short (compared to herbivores), optimized for rapid processing of animal proteins and fats. It includes the mouth, esophagus, stomach, small intestine, large intestine, and anus. Dogs have highly acidic stomachs (pH 1-2) that break down bones and kill bacteria. Transit time is approximately 10-24 hours.',
    relatedTerms: ['Stomach Acid', 'Small Intestine', 'Carnivore', 'pH']
  },
  {
    id: 'stomach-acid',
    name: 'Stomach Acid',
    category: 'Anatomy',
    shortDefinition: 'Highly acidic gastric juice breaking down food and killing pathogens',
    detailedExplanation: 'Canine stomach acid is extremely acidic (pH 1-2), much more so than humans. This strong acidity serves multiple purposes: breaking down bones and tough tissues, killing harmful bacteria (Salmonella, E. coli), activating digestive enzymes, and beginning protein digestion. This is why healthy dogs can safely consume raw meat and bones.',
    relatedTerms: ['pH', 'Digestive Tract', 'Carnivore', 'Pathogen Protection']
  },
  {
    id: 'dentition',
    name: 'Dentition',
    category: 'Anatomy',
    shortDefinition: 'Tooth structure designed for tearing and crushing',
    detailedExplanation: 'Dogs have 42 teeth designed for carnivorous eating: incisors for nibbling, canines for tearing, premolars and molars for crushing bones. Unlike omnivores, dogs lack flat molars for grinding plant matter. Their jaw moves vertically (not side-to-side), suited for tearing meat and crushing bones. Raw meaty bones naturally clean teeth through mechanical action.',
    relatedTerms: ['Carnivore', 'Dental Health', 'Carnassial Teeth', 'Jaw Structure']
  },
  {
    id: 'carnassial-teeth',
    name: 'Carnassial Teeth',
    category: 'Anatomy',
    shortDefinition: 'Specialized shearing teeth for cutting meat and bone',
    detailedExplanation: 'Carnassial teeth are the large shearing teeth in carnivores - the upper fourth premolar and lower first molar. They work like scissors to slice through meat and bone. These teeth are particularly important for raw feeding as they enable dogs to process raw meaty bones effectively. Dental problems with carnassials can indicate feeding challenges.',
    relatedTerms: ['Dentition', 'Carnivore', 'Dental Health', 'Shearing Action']
  },
  {
    id: 'salivary-glands',
    name: 'Salivary Glands',
    category: 'Anatomy',
    shortDefinition: 'Glands producing saliva for lubrication and initial digestion',
    detailedExplanation: 'Dogs have several salivary glands that produce saliva for lubricating food and beginning digestion. Unlike humans, canine saliva contains minimal amylase (starch-digesting enzyme), reflecting their carnivorous nature. Saliva helps with swallowing and has some antibacterial properties. Excessive drooling may occur in anticipation of raw meals.',
    relatedTerms: ['Digestive System', 'Carnivore', 'Enzymes', 'Lubrication']
  },
  {
    id: 'pancreatic-function',
    name: 'Pancreatic Function',
    category: 'Anatomy',
    shortDefinition: 'Organ producing enzymes and hormones for digestion and metabolism',
    detailedExplanation: 'The pancreas has two main functions: producing digestive enzymes (exocrine) and hormones like insulin (endocrine). Digestive enzymes include protease, lipase, and amylase. Pancreatic health is crucial for raw feeding success. Exocrine Pancreatic Insufficiency (EPI) requires enzyme supplementation. The pancreas responds to dietary composition.',
    relatedTerms: ['EPI', 'Digestive Enzymes', 'Insulin', 'Pancreas']
  },
  {
    id: 'liver-function',
    name: 'Liver Function',
    category: 'Anatomy',
    shortDefinition: 'Organ performing detoxification, metabolism, and storage',
    detailedExplanation: 'The liver performs over 500 functions including detoxification, protein synthesis, bile production, nutrient metabolism, and vitamin/mineral storage. It processes nutrients absorbed from the intestines and filters blood. A healthy liver is essential for raw feeding success. Feeding liver as food provides nutrients but overfeeding can cause vitamin A toxicity.',
    relatedTerms: ['Detoxification', 'Bile', 'Metabolism', 'Liver']
  },
  {
    id: 'bile',
    name: 'Bile',
    category: 'Anatomy',
    shortDefinition: 'Digestive fluid aiding fat digestion and absorption',
    detailedExplanation: 'Bile is a yellow-green fluid produced by the liver and stored in the gallbladder. It emulsifies fats, making them easier to digest and absorb. Bile also helps eliminate waste products and toxins. Dogs can live without a gallbladder but may have difficulty digesting high-fat meals. Bile flow is stimulated by fatty foods.',
    relatedTerms: ['Liver Function', 'Gallbladder', 'Fat Digestion', 'Emulsification']
  },
  {
    id: 'gut-flora',
    name: 'Gut Flora',
    category: 'Anatomy',
    shortDefinition: 'Beneficial bacteria living in the digestive tract',
    detailedExplanation: 'Gut flora (microbiome) consists of trillions of beneficial bacteria, fungi, and other microorganisms living in the digestive tract. They aid digestion, produce vitamins (K and some B vitamins), support immune function, and protect against pathogens. Diet significantly influences gut flora composition. Raw feeding with variety supports diverse, healthy microbiomes.',
    relatedTerms: ['Probiotics', 'Microbiome', 'Gut Health', 'Immune Function']
  },
  {
    id: 'small-intestine',
    name: 'Small Intestine',
    category: 'Anatomy',
    shortDefinition: 'Primary site of nutrient digestion and absorption',
    detailedExplanation: 'The small intestine is where most nutrient digestion and absorption occurs. It consists of the duodenum, jejunum, and ileum. Digestive enzymes from the pancreas and bile from the liver enter here. The intestinal lining has villi and microvilli that increase surface area for absorption. A healthy small intestine is crucial for nutrient utilization.',
    relatedTerms: ['Digestive Tract', 'Nutrient Absorption', 'Villi', 'Enzyme Activity']
  },
  {
    id: 'large-intestine',
    name: 'Large Intestine',
    category: 'Anatomy',
    shortDefinition: 'Final digestive segment absorbing water and forming stool',
    detailedExplanation: 'The large intestine (colon) absorbs water and electrolytes, houses beneficial bacteria, and forms feces. It is shorter and less developed in dogs than in herbivores, reflecting their carnivorous nature. The colon ferments some fibers and produces certain vitamins through bacterial action. Healthy colon function results in firm, well-formed stools.',
    relatedTerms: ['Digestive Tract', 'Gut Flora', 'Stool Quality', 'Water Absorption']
  },
  {
    id: 'immune-system',
    name: 'Immune System',
    category: 'Anatomy',
    shortDefinition: 'Body defense system protecting against disease and infection',
    detailedExplanation: 'The immune system protects the body from pathogens, foreign substances, and abnormal cells. It includes white blood cells, antibodies, lymph nodes, spleen, thymus, and gut-associated lymphoid tissue. Approximately 70% of immune function resides in the gut. Proper nutrition, including varied raw feeding, supports robust immune function.',
    relatedTerms: ['Gut Health', 'White Blood Cells', 'Antibodies', 'Lymphatic System']
  },

  // HEALTH TERMS
  {
    id: 'epi',
    name: 'EPI (Exocrine Pancreatic Insufficiency)',
    category: 'Health',
    shortDefinition: 'Condition where pancreas fails to produce adequate digestive enzymes',
    detailedExplanation: 'EPI occurs when the pancreas cannot produce sufficient digestive enzymes, leading to malabsorption and malnutrition. Symptoms include weight loss, ravenous appetite, and pale, greasy stools. Raw feeding can help manage EPI, especially when combined with pancreatic enzyme supplementation. Feeding raw pancreas provides natural enzymes.',
    relatedTerms: ['Pancreas', 'Digestive Enzymes', 'Malabsorption', 'Pancreatic Function']
  },
  {
    id: 'dcm',
    name: 'DCM (Dilated Cardiomyopathy)',
    category: 'Health',
    shortDefinition: 'Heart disease involving enlarged, weakened heart chambers',
    detailedExplanation: 'DCM is a serious heart condition where the heart chambers enlarge and weaken, reducing pumping efficiency. Recent research has linked some DCM cases to taurine deficiency or diet-related factors. Ensuring adequate taurine (from heart meat, dark poultry meat) and proper nutrition may help prevent diet-related DCM. Large breed dogs are predisposed.',
    relatedTerms: ['Taurine', 'Heart', 'Cardiac Health', 'CoQ10']
  },
  {
    id: 'food-allergies',
    name: 'Food Allergies',
    category: 'Health',
    shortDefinition: 'Immune response to specific proteins causing adverse reactions',
    detailedExplanation: 'Food allergies involve immune system reactions to specific proteins, commonly from beef, chicken, dairy, or wheat. Symptoms include itching, skin issues, digestive upset, and ear infections. Raw feeding with novel proteins and elimination diets can help identify and manage allergies. True allergies are less common than food sensitivities.',
    relatedTerms: ['Novel Protein', 'Elimination Diet', 'Food Sensitivities', 'Immune Response']
  },
  {
    id: 'food-sensitivities',
    name: 'Food Sensitivities',
    category: 'Health',
    shortDefinition: 'Non-immune adverse reactions to certain foods',
    detailedExplanation: 'Food sensitivities (intolerances) cause adverse reactions without immune involvement. Symptoms may include digestive upset, skin issues, or behavioral changes. Common culprits include specific proteins, fats, or additives. Sensitivities are more common than true allergies. Raw feeding allows precise control over ingredients, helping identify and avoid problematic foods.',
    relatedTerms: ['Food Allergies', 'Elimination Diet', 'Novel Protein', 'Digestive Upset']
  },
  {
    id: 'elimination-diet',
    name: 'Elimination Diet',
    category: 'Health',
    shortDefinition: 'Feeding protocol to identify food allergies or sensitivities',
    detailedExplanation: 'An elimination diet involves feeding a limited, novel protein source for 8-12 weeks to identify food allergies or sensitivities. After symptoms resolve, foods are reintroduced one at a time to identify triggers. Raw feeding facilitates elimination diets through ingredient control. Common novel proteins include rabbit, venison, kangaroo, or duck.',
    relatedTerms: ['Food Allergies', 'Novel Protein', 'Food Sensitivities', 'Diagnosis']
  },
  {
    id: 'novel-protein',
    name: 'Novel Protein',
    category: 'Health',
    shortDefinition: 'Protein source the dog has never consumed before',
    detailedExplanation: 'A novel protein is one the dog has not previously eaten, making it unlikely to trigger allergic reactions. Common novel proteins include rabbit, venison, kangaroo, duck, bison, or exotic meats. Novel proteins are essential for elimination diets and managing food allergies. Rotating proteins in raw feeding helps maintain future novel protein options.',
    relatedTerms: ['Food Allergies', 'Elimination Diet', 'Protein Rotation', 'Exotic Meats']
  },
  {
    id: 'pancreatitis',
    name: 'Pancreatitis',
    category: 'Health',
    shortDefinition: 'Inflammation of the pancreas, often triggered by high-fat meals',
    detailedExplanation: 'Pancreatitis is painful inflammation of the pancreas that can be acute or chronic. Symptoms include vomiting, abdominal pain, loss of appetite, and lethargy. High-fat meals, especially sudden increases, can trigger episodes. Dogs with pancreatitis history require low-fat raw diets with lean proteins. Gradual transitions and consistent fat levels are important.',
    relatedTerms: ['Pancreas', 'Fat Content', 'Digestive Health', 'Low-Fat Diet']
  },
  {
    id: 'dental-disease',
    name: 'Dental Disease',
    category: 'Health',
    shortDefinition: 'Oral health problems including plaque, tartar, and gum disease',
    detailedExplanation: 'Dental disease encompasses plaque buildup, tartar formation, gingivitis, and periodontal disease. It affects 80% of dogs by age 3. Raw meaty bones naturally clean teeth through mechanical action, reducing dental disease. The tearing and chewing of raw food exercises gums and jaw muscles. Poor dental health can lead to systemic issues affecting heart, liver, and kidneys.',
    relatedTerms: ['Raw Meaty Bones', 'Dental Health', 'Plaque', 'Recreational Bones']
  },
  {
    id: 'obesity',
    name: 'Obesity',
    category: 'Health',
    shortDefinition: 'Excessive body fat impacting health and longevity',
    detailedExplanation: 'Obesity is excessive body fat that increases disease risk and reduces lifespan. Over 50% of dogs are overweight. Raw feeding allows precise portion control and typically results in leaner body composition. Calculate feeding amounts based on ideal body weight and activity level. Monitor body condition and adjust portions accordingly. Regular exercise is essential.',
    relatedTerms: ['Body Condition Score', 'Portion Control', 'Weight Management', 'Energy Balance']
  },
  {
    id: 'malabsorption',
    name: 'Malabsorption',
    category: 'Health',
    shortDefinition: 'Inability to properly absorb nutrients from food',
    detailedExplanation: 'Malabsorption occurs when the digestive system cannot properly absorb nutrients. Causes include EPI, inflammatory bowel disease, intestinal parasites, or damage to intestinal lining. Symptoms include weight loss, poor coat, and abnormal stools despite adequate food intake. Raw feeding may help some malabsorption conditions. Veterinary diagnosis and treatment are essential.',
    relatedTerms: ['EPI', 'IBD', 'Digestive Health', 'Nutrient Absorption']
  },
  {
    id: 'ibd',
    name: 'IBD (Inflammatory Bowel Disease)',
    category: 'Health',
    shortDefinition: 'Chronic inflammation of the digestive tract',
    detailedExplanation: 'IBD is chronic inflammation of the intestinal lining causing vomiting, diarrhea, weight loss, and poor appetite. Causes may include immune dysfunction, genetic factors, or environmental triggers. Novel protein raw diets, elimination diets, and easily digestible foods may help manage IBD. Some dogs respond well to raw feeding; others require veterinary intervention and medication.',
    relatedTerms: ['Gut Health', 'Food Sensitivities', 'Novel Protein', 'Digestive Health']
  },
  {
    id: 'bloat',
    name: 'Bloat (GDV)',
    category: 'Health',
    shortDefinition: 'Life-threatening stomach distension and twisting',
    detailedExplanation: 'Bloat (Gastric Dilatation-Volvulus) is a life-threatening emergency where the stomach fills with gas and may twist. Large, deep-chested breeds are at highest risk. Risk factors include large meals, rapid eating, exercise after meals, and stress. Raw feeders often split meals into smaller portions and avoid exercise immediately after feeding. Immediate veterinary care is critical.',
    relatedTerms: ['GDV', 'Feeding Schedule', 'Large Breeds', 'Emergency']
  },
  {
    id: 'coprophagia',
    name: 'Coprophagia',
    category: 'Health',
    shortDefinition: 'Consumption of feces, may indicate nutritional deficiency',
    detailedExplanation: 'Coprophagia is the consumption of feces, either the dog\'s own or other animals\'. While sometimes behavioral, it can indicate nutritional deficiencies, malabsorption, or enzyme deficiencies. Balanced raw feeding often reduces or eliminates this behavior. Adding digestive enzymes, ensuring complete nutrition, and feeding green tripe may help.',
    relatedTerms: ['Nutritional Deficiency', 'Digestive Enzymes', 'Behavioral Issues', 'Green Tripe']
  },

  // SUPPLEMENTS
  {
    id: 'fish-oil',
    name: 'Fish Oil',
    category: 'Supplements',
    shortDefinition: 'Omega-3 fatty acid supplement from fish',
    detailedExplanation: 'Fish oil supplements provide concentrated EPA and DHA omega-3 fatty acids. They support joint health, skin and coat, cognitive function, and reduce inflammation. Quality matters - choose wild-caught, third-party tested oils. Dosage is based on EPA/DHA content, not total oil volume. Fish oil can oxidize, so store properly and use fresh. Whole fish is preferable when available.',
    relatedTerms: ['Omega-3', 'EPA', 'DHA', 'Anti-inflammatory']
  },
  {
    id: 'kelp',
    name: 'Kelp',
    category: 'Supplements',
    shortDefinition: 'Seaweed providing iodine and trace minerals',
    detailedExplanation: 'Kelp is a brown seaweed rich in iodine, which supports thyroid function. It also provides trace minerals and vitamins. While beneficial in small amounts, excessive kelp can cause thyroid problems due to too much iodine. Use sparingly and choose tested products free from heavy metals. Kelp is particularly useful for dogs eating minimal fish or seafood.',
    relatedTerms: ['Iodine', 'Thyroid', 'Minerals', 'Trace Minerals']
  },
  {
    id: 'vitamin-e-supplement',
    name: 'Vitamin E Supplement',
    category: 'Supplements',
    shortDefinition: 'Antioxidant supplement protecting against oxidative damage',
    detailedExplanation: 'Vitamin E supplementation may be necessary when feeding high amounts of polyunsaturated fats (like fish). It protects against lipid peroxidation and oxidative stress. Natural vitamin E (d-alpha tocopherol) is preferred over synthetic (dl-alpha tocopherol). Dosage increases with PUFA intake. Most raw diets provide adequate vitamin E unless heavily fish-based.',
    relatedTerms: ['Vitamin E', 'Antioxidant', 'Fish', 'Oxidative Stress']
  },
  {
    id: 'joint-supplements',
    name: 'Joint Supplements',
    category: 'Supplements',
    shortDefinition: 'Glucosamine, chondroitin, and MSM for joint support',
    detailedExplanation: 'Joint supplements typically contain glucosamine, chondroitin, MSM, and sometimes hyaluronic acid. They support cartilage health, joint fluid, and reduce inflammation. While beneficial, whole food sources (trachea, feet, ears, green-lipped mussels) provide these compounds naturally with cofactors. Senior dogs and large breeds particularly benefit from joint support.',
    relatedTerms: ['Glucosamine', 'Chondroitin', 'MSM', 'Cartilage']
  },
  {
    id: 'green-lipped-mussel',
    name: 'Green-Lipped Mussel',
    category: 'Supplements',
    shortDefinition: 'Shellfish providing joint-supporting compounds and omega-3s',
    detailedExplanation: 'Green-lipped mussels (Perna canaliculus) from New Zealand contain glucosamine, chondroitin, omega-3 fatty acids, and unique glycosaminoglycans. They have anti-inflammatory properties and support joint health. Available as whole frozen mussels, powder, or oil. Particularly beneficial for dogs with arthritis or joint issues.',
    relatedTerms: ['Joint Support', 'Omega-3', 'Glucosamine', 'Anti-inflammatory']
  },
  {
    id: 'bone-meal',
    name: 'Bone Meal',
    category: 'Supplements',
    shortDefinition: 'Ground bones providing calcium for boneless diets',
    detailedExplanation: 'Bone meal is finely ground bones used to provide calcium in boneless raw diets. It should be food-grade (not garden bone meal, which may contain lead). While useful for dogs who cannot eat bones, whole bones are preferred for additional nutrients. Bone meal lacks the teeth-cleaning benefits and nutrients found in whole bones.',
    relatedTerms: ['Calcium', 'Eggshell', 'Boneless Diet', 'Minerals']
  },
  {
    id: 'psyllium-husk',
    name: 'Psyllium Husk',
    category: 'Supplements',
    shortDefinition: 'Soluble fiber supporting digestive regularity',
    detailedExplanation: 'Psyllium husk is a soluble fiber from Plantago ovata seeds. It absorbs water, forming a gel that supports digestive health and regular bowel movements. It can help with both diarrhea and constipation by normalizing stool consistency. Use small amounts and ensure adequate hydration. Psyllium also provides prebiotic benefits.',
    relatedTerms: ['Fiber', 'Prebiotics', 'Digestive Health', 'Stool Quality']
  },

  // ADDITIONAL FEEDING METHODS & CONCEPTS
  {
    id: 'rotational-feeding',
    name: 'Rotational Feeding',
    category: 'Feeding Methods',
    shortDefinition: 'Regularly changing protein sources and food types',
    detailedExplanation: 'Rotational feeding involves regularly varying protein sources, organ types, and bone varieties. This provides diverse nutrients, reduces food sensitivity development, maintains novel protein options, and prevents nutrient deficiencies or excesses. Rotation can be daily, weekly, or monthly. It mimics natural feeding patterns and supports nutritional balance.',
    relatedTerms: ['Variety', 'Novel Protein', 'Balanced Diet', 'Nutritional Diversity']
  },
  {
    id: 'species-appropriate',
    name: 'Species Appropriate',
    category: 'Feeding Methods',
    shortDefinition: 'Diet matching the evolutionary nutritional needs of dogs',
    detailedExplanation: 'A species-appropriate diet aligns with the dog\'s evolutionary biology as a carnivore. It emphasizes animal-based proteins, fats, and nutrients that dogs are designed to digest and utilize. Raw feeding is considered species-appropriate because it provides foods in their natural state, matching what canids would consume in nature.',
    relatedTerms: ['Raw Feeding', 'Carnivore', 'Natural Diet', 'Evolutionary Diet']
  },
  {
    id: 'transition',
    name: 'Transition',
    category: 'Feeding Methods',
    shortDefinition: 'Gradual process of switching to raw feeding',
    detailedExplanation: 'Transitioning to raw feeding should typically be gradual to allow digestive system adaptation. Common approaches include cold turkey (immediate switch) for healthy dogs or slow transition over 7-14 days for sensitive dogs. Start with bland, easily digestible proteins like chicken. Monitor stools and adjust pace as needed. Some dogs transition immediately without issues.',
    relatedTerms: ['Raw Feeding', 'Digestive Adaptation', 'Starter Proteins', 'Fasting']
  },
  {
    id: 'fasting',
    name: 'Fasting',
    category: 'Feeding Methods',
    shortDefinition: 'Periodic meal skipping mimicking natural eating patterns',
    detailedExplanation: 'Fasting involves periodically skipping meals (typically one day per week for adult dogs). It mimics natural carnivore eating patterns, allows digestive rest, may support detoxification, and can help manage weight. Fasting is not appropriate for puppies, pregnant/nursing dogs, or dogs with certain health conditions. Always ensure adequate hydration.',
    relatedTerms: ['Natural Feeding', 'Digestive Rest', 'Detoxification', 'Meal Frequency']
  },
  {
    id: 'batch-feeding',
    name: 'Batch Feeding',
    category: 'Feeding Methods',
    shortDefinition: 'Pre-portioning and freezing meals for convenience',
    detailedExplanation: 'Batch feeding involves preparing multiple meals at once, portioning them, and freezing for later use. This saves time, ensures consistent portions, and allows for balanced variety across meals. Meals can be fully balanced or balanced over time. Proper food safety practices and labeling are essential. Many raw feeders meal prep weekly or monthly.',
    relatedTerms: ['Meal Prep', 'Convenience', 'Portion Control', 'Food Safety']
  },
  {
    id: 'balanced-over-time',
    name: 'Balanced Over Time',
    category: 'Feeding Methods',
    shortDefinition: 'Achieving nutritional balance across weeks rather than each meal',
    detailedExplanation: 'Balanced over time means meeting nutritional requirements over a period (typically 1-2 weeks) rather than in each meal. This allows flexibility in feeding whole prey, variety of cuts, and mimics natural eating patterns. Each meal doesn\'t need perfect ratios if overall diet averages to appropriate proportions. This approach requires understanding of nutritional needs.',
    relatedTerms: ['PMR', 'Whole Prey', 'Nutritional Balance', 'Variety']
  },
  {
    id: 'complete-and-balanced',
    name: 'Complete and Balanced',
    category: 'Feeding Methods',
    shortDefinition: 'Meeting all nutritional requirements in appropriate ratios',
    detailedExplanation: 'A complete and balanced diet provides all essential nutrients in proper proportions. In raw feeding, this is achieved through appropriate ratios of muscle meat, bone, organs, and variety. It can be accomplished per meal or balanced over time. Complete and balanced diets support long-term health without deficiencies or excesses.',
    relatedTerms: ['Nutritional Balance', '80/10/10', 'BARF', 'Balanced Over Time']
  },
  {
    id: 'prey-sequence',
    name: 'Prey Sequence',
    category: 'Feeding Methods',
    shortDefinition: 'Feeding parts of prey animals in natural eating order',
    detailedExplanation: 'Prey sequence feeding mimics how predators consume prey in nature, typically starting with organs, then muscle meat, and finishing with bones. This approach is thought to optimize digestion and nutrient utilization. It\'s particularly useful when feeding larger portions or whole prey. Not all raw feeders follow this sequence.',
    relatedTerms: ['Whole Prey', 'Natural Feeding', 'Digestive Optimization', 'PMR']
  },
  {
    id: 'boneless-diet',
    name: 'Boneless Diet',
    category: 'Feeding Methods',
    shortDefinition: 'Raw feeding without bones, using calcium supplements',
    detailedExplanation: 'Boneless diets exclude raw bones, providing calcium through supplements like eggshell powder or bone meal. This approach is necessary for dogs who cannot safely consume bones (severe dental issues, megaesophagus, or specific health conditions). Boneless diets miss teeth-cleaning benefits and some nutrients naturally present in whole bones.',
    relatedTerms: ['Eggshell', 'Bone Meal', 'Calcium Supplement', 'Medical Necessity']
  },
  {
    id: 'ground-raw',
    name: 'Ground Raw',
    category: 'Feeding Methods',
    shortDefinition: 'Raw ingredients ground together for easier consumption',
    detailedExplanation: 'Ground raw involves grinding meat, bones, and organs together. It\'s useful for small dogs, puppies, seniors with dental issues, or picky eaters. While convenient, ground raw lacks the dental benefits and mental stimulation of whole foods. Bacteria can multiply faster in ground meat, so proper handling is critical. Many feeders combine ground and whole foods.',
    relatedTerms: ['Convenience', 'Dental Limitations', 'Food Safety', 'Mixed Feeding']
  },

  // FOOD TYPES - ADDITIONAL
  {
    id: 'bone-broth',
    name: 'Bone Broth',
    category: 'Food Types',
    shortDefinition: 'Nutrient-rich liquid from slow-simmered bones',
    detailedExplanation: 'Bone broth is made by slow-simmering bones (with some meat and connective tissue) for 12-24+ hours. The result is a gelatin-rich liquid containing collagen, glucosamine, minerals, and amino acids. It supports joint health, gut lining, hydration, and recovery from illness. Bone broth can be fed as a supplement, meal topper, or for sick/senior dogs.',
    relatedTerms: ['Gelatin', 'Collagen', 'Joint Support', 'Gut Health']
  },
  {
    id: 'gizzards',
    name: 'Gizzards',
    category: 'Food Types',
    shortDefinition: 'Muscular stomach organ from poultry',
    detailedExplanation: 'Gizzards are muscular stomach organs from chickens, turkeys, or ducks. They are extremely dense muscle tissue, rich in protein, iron, and zinc. While technically organs, gizzards are nutritionally counted as muscle meat due to their muscular composition. They are affordable, nutritious, and most dogs enjoy them.',
    relatedTerms: ['Muscle Meat', 'Poultry', 'Dense Muscle', 'Iron']
  },
  {
    id: 'testicles',
    name: 'Testicles',
    category: 'Food Types',
    shortDefinition: 'Glandular organ rich in hormones and nutrients',
    detailedExplanation: 'Testicles are glandular organs that can be fed as part of the organ rotation. They provide unique hormones, vitamins, and minerals. While not commonly available, they can be a nutritious addition to a varied raw diet. Some specialty raw feeding suppliers offer testicles from various animals.',
    relatedTerms: ['Organ Meat', 'Glandular Tissue', 'Variety', 'Offal']
  },
  {
    id: 'lungs',
    name: 'Lungs',
    category: 'Food Types',
    shortDefinition: 'Spongy respiratory organ, nutritionally similar to muscle meat',
    detailedExplanation: 'Lungs are lightweight, spongy organs. Nutritionally, they are closer to muscle meat than secreting organs and are low in calories. Beef lung and lamb lung are available from some suppliers. Lungs can be dehydrated as treats or fed raw. They are not counted toward the organ meat percentage in raw diets.',
    relatedTerms: ['Muscle Meat', 'Low Calorie', 'Beef', 'Training Treats']
  },
  {
    id: 'pizzle',
    name: 'Pizzle',
    category: 'Food Types',
    shortDefinition: 'Bull penis used as a chewy treat',
    detailedExplanation: 'Pizzle (bully sticks) are dried bull penises used as long-lasting chews. They are high in protein, low in fat, and highly digestible. Pizzles provide dental benefits and mental enrichment. Quality varies - choose thick, odor-free options from reputable sources. They can be fed raw or dehydrated.',
    relatedTerms: ['Recreational Chews', 'Dental Health', 'Beef', 'Treats']
  },
  {
    id: 'blood',
    name: 'Blood',
    category: 'Food Types',
    shortDefinition: 'Iron-rich liquid tissue from various animals',
    detailedExplanation: 'Blood is extremely rich in iron and protein. Some raw feeders offer blood as a supplement, particularly for anemic dogs or as part of whole prey feeding. Blood can be frozen into cubes or added to meals. It has a strong odor and taste that most dogs enjoy. Handle with care as it can be messy.',
    relatedTerms: ['Iron', 'Whole Prey', 'Anemia', 'Red Blood Cells']
  },
  {
    id: 'venison',
    name: 'Venison',
    category: 'Food Types',
    shortDefinition: 'Deer meat, a lean novel protein source',
    detailedExplanation: 'Venison (deer meat) is a lean, nutrient-dense protein source. It is often used as a novel protein for dogs with food sensitivities. Venison is rich in B vitamins, iron, and zinc. Wild venison may contain parasites, so freezing for 2-3 weeks is recommended. Farm-raised venison is also available.',
    relatedTerms: ['Novel Protein', 'Red Meat', 'Game Meat', 'Lean Meat']
  },
  {
    id: 'bison',
    name: 'Bison',
    category: 'Food Types',
    shortDefinition: 'Buffalo meat, lean and nutrient-dense',
    detailedExplanation: 'Bison (buffalo) is a lean red meat similar to beef but with less fat and more protein. It\'s rich in iron, zinc, and B vitamins. Bison is often grass-fed and can serve as a novel protein for dogs sensitive to beef. All bison cuts (muscle, organs, bones) can be fed following standard raw feeding guidelines.',
    relatedTerms: ['Novel Protein', 'Red Meat', 'Lean Meat', 'Grass-Fed']
  },
  {
    id: 'elk',
    name: 'Elk',
    category: 'Food Types',
    shortDefinition: 'Large game meat, lean and protein-rich',
    detailedExplanation: 'Elk is a lean, protein-rich game meat similar to venison but from larger animals. It provides high-quality protein, B vitamins, iron, and zinc. Elk is suitable as a novel protein and is often farm-raised. All parts (muscle, organs, bones) can be incorporated into raw diets.',
    relatedTerms: ['Novel Protein', 'Game Meat', 'Red Meat', 'Lean Meat']
  },
  {
    id: 'kangaroo',
    name: 'Kangaroo',
    category: 'Food Types',
    shortDefinition: 'Exotic lean meat from Australia, excellent novel protein',
    detailedExplanation: 'Kangaroo is an extremely lean red meat (less than 2% fat) from Australia. It\'s one of the leanest protein sources available and makes an excellent novel protein. Kangaroo is rich in iron, zinc, and omega-3 fatty acids (from the grass diet). It may require fat supplementation due to low fat content.',
    relatedTerms: ['Novel Protein', 'Exotic Meat', 'Lean Meat', 'Allergies']
  },
  {
    id: 'goat',
    name: 'Goat',
    category: 'Food Types',
    shortDefinition: 'Red meat similar to lamb, often novel protein',
    detailedExplanation: 'Goat meat is a lean red meat with flavor and nutrition similar to lamb. It\'s lower in fat than lamb and rich in protein, iron, and B vitamins. Goat can serve as a novel protein for many dogs. All parts (muscle, organs, bones) are suitable for raw feeding. It\'s popular in many cultures and increasingly available.',
    relatedTerms: ['Novel Protein', 'Red Meat', 'Lean Meat', 'Lamb Alternative']
  },

  // ADDITIONAL NUTRITION & HEALTH TERMS
  {
    id: 'bioavailability',
    name: 'Bioavailability',
    category: 'Nutrition',
    shortDefinition: 'The degree to which nutrients can be absorbed and utilized',
    detailedExplanation: 'Bioavailability refers to how much of a nutrient is actually absorbed and used by the body. Animal-based nutrients generally have higher bioavailability than plant-based ones. For example, heme iron from meat is more bioavailable than non-heme iron from plants. Raw, unprocessed foods often have better bioavailability than cooked or heavily processed foods.',
    relatedTerms: ['Absorption', 'Nutrition', 'Animal-Based', 'Digestibility']
  },
  {
    id: 'body-condition-score',
    name: 'Body Condition Score (BCS)',
    category: 'Health',
    shortDefinition: 'System for evaluating dog body fat and muscle condition',
    detailedExplanation: 'Body Condition Score (BCS) is a 1-9 scale used to assess body fat and muscle condition. Ideal score is 4-5/9, where ribs are easily felt but not visible, waist is visible, and there\'s a slight abdominal tuck. BCS helps guide portion adjustments in raw feeding. Regular assessment prevents obesity or underweight conditions.',
    relatedTerms: ['Weight Management', 'Obesity', 'Portion Control', 'Health Assessment']
  },
  {
    id: 'detoxification',
    name: 'Detoxification',
    category: 'Health',
    shortDefinition: 'Process of eliminating toxins from the body',
    detailedExplanation: 'Detoxification is the natural process of eliminating toxins through liver, kidneys, skin, and digestive system. When transitioning to raw feeding, some dogs experience "detox" symptoms (loose stools, skin issues, discharge) as the body adjusts and eliminates stored toxins. True detox is a normal liver/kidney function. Support with hydration and proper nutrition.',
    relatedTerms: ['Liver Function', 'Transition', 'Healing Crisis', 'Elimination']
  },
  {
    id: 'healing-crisis',
    name: 'Healing Crisis',
    category: 'Health',
    shortDefinition: 'Temporary worsening of symptoms during dietary transition',
    detailedExplanation: 'A healing crisis (Herxheimer reaction) is a temporary worsening of symptoms as the body adjusts to improved nutrition and eliminates toxins. During raw feeding transition, this may manifest as skin eruptions, ear discharge, or digestive changes. Symptoms typically resolve within days to weeks. Persistent or severe symptoms require veterinary evaluation.',
    relatedTerms: ['Detoxification', 'Transition', 'Adjustment Period', 'Symptoms']
  },
  {
    id: 'stool-quality',
    name: 'Stool Quality',
    category: 'Health',
    shortDefinition: 'Indicator of digestive health and dietary appropriateness',
    detailedExplanation: 'Stool quality reflects digestive health and diet appropriateness. Ideal raw-fed stools are small, firm, dark, and minimally odorous. They should be easy to pass and pick up. Changes in consistency indicate dietary adjustments needed - too hard suggests excess bone, too soft suggests excess organ or fat. White, chalky stools indicate too much bone.',
    relatedTerms: ['Digestive Health', 'Bone Content', 'Dietary Balance', 'Health Indicator']
  },
  {
    id: 'mucus-stool',
    name: 'Mucus in Stool',
    category: 'Health',
    shortDefinition: 'Jelly-like substance indicating intestinal irritation',
    detailedExplanation: 'Mucus in stool appears as a clear or yellowish jelly-like coating. Small amounts can be normal, especially during dietary transitions. Excessive mucus indicates intestinal inflammation or irritation, possibly from too much bone, dietary sensitivity, or infection. Persistent mucus with other symptoms (blood, diarrhea) requires veterinary attention.',
    relatedTerms: ['Stool Quality', 'Intestinal Health', 'Inflammation', 'Transition']
  },
  {
    id: 'bone-content-percentage',
    name: 'Bone Content Percentage',
    category: 'Nutrition',
    shortDefinition: 'Proportion of bone in meat cuts or diet',
    detailedExplanation: 'Bone content percentage indicates how much actual bone is in a cut of meat. For example, chicken wings are ~46% bone, necks ~36% bone, backs ~50% bone. Understanding bone content helps calculate proper ratios in raw feeding. Target is approximately 10% bone in the overall diet, adjusted based on stool quality. Different cuts require different portions to achieve this.',
    relatedTerms: ['Calcium', 'Raw Meaty Bones', '80/10/10', 'Dietary Balance']
  },
  {
    id: 'secreting-organs',
    name: 'Secreting Organs',
    category: 'Food Types',
    shortDefinition: 'Organs that produce and secrete substances, used in organ meat ratio',
    detailedExplanation: 'Secreting organs produce and secrete hormones, enzymes, or other substances. These include liver, kidney, spleen, pancreas, thymus, and reproductive organs. They are extremely nutrient-dense and should comprise 10% of a PMR diet (5% liver, 5% other secreting organs). Non-secreting organs like lungs, gizzards, and tripe are counted as muscle meat.',
    relatedTerms: ['Organ Meat', 'Liver', 'Kidney', 'Nutrient Density']
  },
  {
    id: 'variety',
    name: 'Variety',
    category: 'Feeding Methods',
    shortDefinition: 'Feeding diverse protein sources and cuts for nutritional completeness',
    detailedExplanation: 'Variety is essential in raw feeding to ensure complete nutrition. This includes rotating different protein sources (beef, chicken, pork, fish, etc.), organ types, and bone varieties. Variety provides diverse nutrient profiles, prevents deficiencies, reduces risk of food sensitivities, and mimics natural diet diversity. Aim for at least 3-4 protein sources over time.',
    relatedTerms: ['Rotational Feeding', 'Nutritional Balance', 'Novel Protein', 'Diversity']
  },
  {
    id: 'portion-size',
    name: 'Portion Size',
    category: 'Feeding Methods',
    shortDefinition: 'Amount of food fed daily, typically 2-3% of body weight',
    detailedExplanation: 'Portion size for adult dogs typically ranges from 2-3% of ideal body weight daily, split into one or two meals. Active dogs need more (3-4%), sedentary dogs less (1.5-2%). Puppies require 5-10% depending on age. Adjust based on body condition, activity level, and individual metabolism. Monitor weight and BCS regularly.',
    relatedTerms: ['Body Condition Score', 'Weight Management', 'Feeding Amount', 'Calories']
  },
  {
    id: 'feeding-schedule',
    name: 'Feeding Schedule',
    category: 'Feeding Methods',
    shortDefinition: 'Timing and frequency of meals throughout the day',
    detailedExplanation: 'Most raw-fed adult dogs eat once or twice daily. Puppies require multiple smaller meals (3-4 times daily for young puppies). Splitting meals can help with digestion, prevent bloat in large breeds, and maintain energy. Some feeders practice intermittent fasting with one meal daily plus a weekly fast. Consistency helps digestive regulation.',
    relatedTerms: ['Meal Frequency', 'Fasting', 'Bloat Prevention', 'Routine']
  },
  {
    id: 'frozen-raw',
    name: 'Frozen Raw',
    category: 'Food Types',
    shortDefinition: 'Raw food stored frozen for safety and convenience',
    detailedExplanation: 'Freezing raw food kills parasites, extends shelf life, and allows bulk purchasing. Freeze raw food at 0°F (-18°C) or below. Fatty fish and game meats should be frozen for 2-3 weeks to kill parasites. Thaw in refrigerator, not at room temperature. Refreezing is safe if food remained refrigerator temperature. Frozen food maintains nutritional value.',
    relatedTerms: ['Food Safety', 'Storage', 'Parasite Prevention', 'Meal Prep']
  },
  {
    id: 'food-safety',
    name: 'Food Safety',
    category: 'Health',
    shortDefinition: 'Practices for safe handling and storage of raw food',
    detailedExplanation: 'Food safety in raw feeding includes proper storage (freezer or refrigerator), thawing in refrigerator, cleaning surfaces and bowls, hand washing, and preventing cross-contamination. Healthy dogs handle bacteria well due to strong stomach acid, but human precautions are essential. Discard food left out over 2 hours. Use separate cutting boards for human and pet food.',
    relatedTerms: ['Bacteria', 'Storage', 'Handling', 'Hygiene']
  },

  // ADDITIONAL TERMS
  {
    id: 'omega-ratio',
    name: 'Omega-3:6 Ratio',
    category: 'Nutrition',
    shortDefinition: 'Balance between omega-3 and omega-6 fatty acids',
    detailedExplanation: 'The omega-3:6 ratio describes the balance between these essential fatty acids. Ideal ratio is approximately 1:4 to 1:10 (omega-3:omega-6). Modern diets often have too much omega-6 (inflammatory) relative to omega-3 (anti-inflammatory). Including fatty fish, grass-fed meats, and limiting omega-6-rich oils helps achieve proper balance.',
    relatedTerms: ['Omega-3', 'Omega-6', 'Essential Fatty Acids', 'Inflammation']
  },
  {
    id: 'grass-fed',
    name: 'Grass-Fed',
    category: 'Food Types',
    shortDefinition: 'Meat from animals raised on pasture and grass diet',
    detailedExplanation: 'Grass-fed animals are raised on pasture eating their natural diet of grasses. Grass-fed meat has higher omega-3 fatty acids, CLA, vitamins, and minerals compared to grain-fed. It\'s leaner with better fatty acid profiles. While beneficial, grass-fed is more expensive and not essential for a healthy raw diet. Conventional meat is still nutritionally superior to kibble.',
    relatedTerms: ['Pasture-Raised', 'Omega-3', 'Meat Quality', 'Nutrient Density']
  },
  {
    id: 'organic',
    name: 'Organic',
    category: 'Food Types',
    shortDefinition: 'Food produced without synthetic pesticides, hormones, or antibiotics',
    detailedExplanation: 'Organic certification ensures animals are raised without synthetic hormones, antibiotics (except medical necessity), or GMO feed, and have access to outdoors. Organic meat may have fewer pesticide residues and antibiotic-resistant bacteria. While beneficial, organic is not essential for raw feeding success. Choose based on budget and values.',
    relatedTerms: ['Grass-Fed', 'Pasture-Raised', 'Meat Quality', 'Hormone-Free']
  },
  {
    id: 'pasture-raised',
    name: 'Pasture-Raised',
    category: 'Food Types',
    shortDefinition: 'Animals raised with outdoor access and natural foraging',
    detailedExplanation: 'Pasture-raised animals have outdoor access and forage naturally, though they may receive supplemental feed. This results in more nutritious meat with better fatty acid profiles, higher vitamins, and improved animal welfare. Pasture-raised is distinct from grass-fed (grass-fed implies pasture-raised, but pasture-raised doesn\'t guarantee grass-fed).',
    relatedTerms: ['Grass-Fed', 'Organic', 'Meat Quality', 'Animal Welfare']
  },
  {
    id: 'conventional-meat',
    name: 'Conventional Meat',
    category: 'Food Types',
    shortDefinition: 'Standard commercially raised meat without special certifications',
    detailedExplanation: 'Conventional meat comes from standard commercial farming without organic, grass-fed, or pasture-raised certifications. While not as nutrient-dense as grass-fed, conventional meat is still far superior to processed kibble for raw feeding. It provides essential nutrients at affordable prices. Many successful raw feeders use conventional meat.',
    relatedTerms: ['Grass-Fed', 'Organic', 'Budget', 'Accessibility']
  },
  {
    id: 'wild-caught',
    name: 'Wild-Caught',
    category: 'Food Types',
    shortDefinition: 'Fish from natural waters, not farmed',
    detailedExplanation: 'Wild-caught fish are harvested from natural waters (oceans, rivers, lakes). They typically have better omega-3 profiles, fewer contaminants, and more diverse nutrition than farmed fish. Wild-caught is preferred for raw feeding when available. Consider sustainability and choose fish from clean waters to minimize heavy metal exposure.',
    relatedTerms: ['Fish', 'Salmon', 'Omega-3', 'Farmed Fish']
  },
  {
    id: 'farmed-fish',
    name: 'Farmed Fish',
    category: 'Food Types',
    shortDefinition: 'Fish raised in controlled aquaculture environments',
    detailedExplanation: 'Farmed fish are raised in controlled environments and fed commercial diets. They may have lower omega-3 content, different fatty acid ratios, and potential contaminants depending on farming practices. Some farmed fish (like responsibly raised salmon) can still be nutritious. Wild-caught is generally preferred but farmed fish is acceptable in rotation.',
    relatedTerms: ['Fish', 'Wild-Caught', 'Omega-3', 'Aquaculture']
  },
  {
    id: 'raw-feeding-myths',
    name: 'Raw Feeding Myths',
    category: 'Health',
    shortDefinition: 'Common misconceptions about raw feeding',
    detailedExplanation: 'Common myths include: raw bones splinter (only cooked bones splinter), raw meat causes aggression (no scientific basis), raw diets are nutritionally incomplete (properly balanced raw diets are complete), and raw feeding is dangerous due to bacteria (healthy dogs handle bacteria well). Education and proper practices address these myths.',
    relatedTerms: ['Education', 'Safety', 'Nutrition', 'Misconceptions']
  },
  {
    id: 'salmon-poisoning',
    name: 'Salmon Poisoning Disease',
    category: 'Health',
    shortDefinition: 'Potentially fatal disease from parasites in Pacific salmon',
    detailedExplanation: 'Salmon Poisoning Disease (SPD) is caused by a parasite (Nanophyetus salmincola) carrying bacteria (Neorickettsia helminthoeca) found in Pacific salmon and trout. It affects dogs in the Pacific Northwest. Symptoms include vomiting, diarrhea, fever, and lymph node swelling. Prevention: freeze Pacific salmon for 7+ days or cook thoroughly. Atlantic salmon is safe.',
    relatedTerms: ['Salmon', 'Fish', 'Parasites', 'Regional Risk']
  },
  {
    id: 'thiaminase',
    name: 'Thiaminase',
    category: 'Nutrition',
    shortDefinition: 'Enzyme in some raw fish that destroys thiamine',
    detailedExplanation: 'Thiaminase is an enzyme in certain raw fish (carp, herring, smelt, catfish, goldfish) that breaks down thiamine (vitamin B1). Regular consumption can cause thiamine deficiency. Freezing or cooking destroys thiaminase. Rotate fish varieties and include thiaminase-free fish (salmon, sardines, mackerel) to prevent deficiency. Occasional feeding of thiaminase-containing fish is fine.',
    relatedTerms: ['Thiamine', 'Fish', 'B Vitamins', 'Vitamin Deficiency']
  },
  {
    id: 'glycemic-index',
    name: 'Glycemic Index',
    category: 'Nutrition',
    shortDefinition: 'Rate at which foods raise blood sugar levels',
    detailedExplanation: 'Glycemic Index (GI) measures how quickly foods raise blood sugar. Animal proteins and fats have minimal impact on blood sugar (low GI). High-GI foods (grains, starches) cause blood sugar spikes. Low-carb raw diets provide stable blood sugar, beneficial for diabetic dogs and weight management. This is one advantage of raw feeding over carbohydrate-rich kibble.',
    relatedTerms: ['Blood Sugar', 'Diabetes', 'Carbohydrates', 'Insulin']
  },
  {
    id: 'amino-acid-profile',
    name: 'Amino Acid Profile',
    category: 'Nutrition',
    shortDefinition: 'Complete set of amino acids in a protein source',
    detailedExplanation: 'Amino acid profile describes the types and amounts of amino acids in a protein source. Animal proteins are "complete proteins" containing all essential amino acids in appropriate ratios. Different meats have different profiles - variety ensures all amino acids are adequately supplied. Plant proteins are typically incomplete for dogs.',
    relatedTerms: ['Protein', 'Amino Acids', 'Complete Protein', 'Variety']
  },
  {
    id: 'leptospirosis',
    name: 'Leptospirosis',
    category: 'Health',
    shortDefinition: 'Bacterial disease potentially transmitted through wildlife',
    detailedExplanation: 'Leptospirosis is a bacterial disease that can be transmitted through contact with infected wildlife urine, including on whole prey animals. Freezing does not kill leptospira bacteria. Risk is low but present when feeding wild game. Symptoms include fever, kidney/liver damage, and bleeding. Vaccination is available. Practice good hygiene and source prey from reputable suppliers.',
    relatedTerms: ['Whole Prey', 'Wildlife', 'Bacterial Disease', 'Food Safety']
  },
  {
    id: 'aujeszky-disease',
    name: 'Aujeszky\'s Disease',
    category: 'Health',
    shortDefinition: 'Fatal viral disease transmitted through raw pork',
    detailedExplanation: 'Aujeszky\'s Disease (Pseudorabies) is a fatal viral disease affecting dogs, transmitted through raw pork from infected pigs. It is rare in commercial pork in the US and Europe but more common in wild boar. Symptoms include neurological signs and death within days. Freezing does not kill the virus. Many raw feeders avoid pork or use only commercial sources.',
    relatedTerms: ['Pork', 'Wild Boar', 'Viral Disease', 'Food Safety']
  },
  {
    id: 'raw-food-diet-associations',
    name: 'Raw Food Diet Associations',
    category: 'Health',
    shortDefinition: 'Organizations promoting and researching raw feeding',
    detailedExplanation: 'Various organizations support raw feeding through education, research, and community. Examples include Raw Feeding Community, Prey Model Raw groups, and BARF associations. These groups provide resources, guidelines, and support for raw feeders. They advocate for raw feeding acceptance and fund nutrition research. Always verify information with scientific evidence.',
    relatedTerms: ['Education', 'Community', 'Resources', 'Support']
  },

  // ADDITIONAL SPECIALIZED TERMS (131 more terms to reach 300+)
  {
    id: 'carbohydrates',
    name: 'Carbohydrates',
    category: 'Nutrition',
    shortDefinition: 'Sugars and starches, not essential for dogs but can provide energy',
    detailedExplanation: 'Carbohydrates are not essential nutrients for dogs, as they can synthesize glucose from protein and fat. While dogs can digest some carbohydrates, their digestive systems are optimized for animal-based foods. Excess carbohydrates can lead to obesity, blood sugar spikes, and inflammation. Raw feeding typically provides minimal carbohydrates, which is appropriate for canine physiology.',
    relatedTerms: ['Glycemic Index', 'Blood Sugar', 'Nutrition', 'Energy']
  },
  {
    id: 'acidophilus',
    name: 'Acidophilus',
    category: 'Supplements',
    shortDefinition: 'Beneficial bacteria strain supporting digestive health',
    detailedExplanation: 'Lactobacillus acidophilus is a probiotic bacteria that supports digestive health, immune function, and nutrient absorption. It helps maintain healthy gut flora and can be particularly beneficial during stress, antibiotic treatment, or digestive upset. Natural sources include fermented foods like kefir and yogurt.',
    relatedTerms: ['Probiotics', 'Gut Health', 'Fermented Foods', 'Digestive Health']
  },
  {
    id: 'chia-seeds',
    name: 'Chia Seeds',
    category: 'Supplements',
    shortDefinition: 'Plant-based omega-3 source and fiber supplement',
    detailedExplanation: 'Chia seeds provide plant-based omega-3 fatty acids (ALA), fiber, protein, and minerals. While dogs cannot efficiently convert plant omega-3s to EPA/DHA, chia seeds can still contribute to overall nutrition. They absorb water and can help with hydration and digestive regularity. Use ground or soaked for better digestibility.',
    relatedTerms: ['Omega-3', 'Fiber', 'ALA', 'Plant-Based']
  },
  {
    id: 'flaxseed',
    name: 'Flaxseed',
    category: 'Supplements',
    shortDefinition: 'Plant omega-3 source providing ALA and fiber',
    detailedExplanation: 'Flaxseed contains alpha-linolenic acid (ALA), fiber, and lignans. While dogs poorly convert ALA to EPA/DHA, flaxseed can provide some omega-3 benefits and fiber. It must be ground fresh as whole seeds pass through undigested and oils oxidize quickly. Fish sources are preferred for omega-3s in dogs.',
    relatedTerms: ['Omega-3', 'ALA', 'Fiber', 'Plant-Based']
  },
  {
    id: 'coconut-oil',
    name: 'Coconut Oil',
    category: 'Supplements',
    shortDefinition: 'Medium-chain triglyceride source with antimicrobial properties',
    detailedExplanation: 'Coconut oil contains medium-chain triglycerides (MCTs), particularly lauric acid, which may have antimicrobial and anti-inflammatory properties. It can support coat health, skin condition, and energy. However, it is high in saturated fat and should be used in moderation. Benefits are often overstated in marketing.',
    relatedTerms: ['MCT', 'Fat', 'Coat Health', 'Lauric Acid']
  },
  {
    id: 'mct-oil',
    name: 'MCT Oil',
    category: 'Supplements',
    shortDefinition: 'Medium-chain triglycerides providing quick energy',
    detailedExplanation: 'MCT oil is composed of medium-chain triglycerides that are rapidly absorbed and metabolized for quick energy. They bypass normal fat digestion and may support cognitive function, especially in senior dogs. MCTs are derived from coconut or palm oil. Use cautiously as they can cause digestive upset in excess.',
    relatedTerms: ['Coconut Oil', 'Energy', 'Fat', 'Cognitive Support']
  },
  {
    id: 'turmeric',
    name: 'Turmeric',
    category: 'Supplements',
    shortDefinition: 'Anti-inflammatory spice containing curcumin',
    detailedExplanation: 'Turmeric contains curcumin, a compound with anti-inflammatory and antioxidant properties. It may support joint health, reduce inflammation, and provide antioxidant benefits. Bioavailability is enhanced with black pepper (piperine) and fat. While popular, evidence for benefits in dogs is limited and supplementation should be moderate.',
    relatedTerms: ['Curcumin', 'Anti-inflammatory', 'Antioxidant', 'Joint Support']
  },
  {
    id: 'spirulina',
    name: 'Spirulina',
    category: 'Supplements',
    shortDefinition: 'Blue-green algae providing protein and antioxidants',
    detailedExplanation: 'Spirulina is a nutrient-dense blue-green algae containing protein, B vitamins, iron, and antioxidants. It may support immune function and provide phytonutrients. Quality matters - choose tested products free from contaminants. While nutritious, whole food sources are generally preferred in raw feeding.',
    relatedTerms: ['Algae', 'Antioxidant', 'Protein', 'Immune Support']
  },
  {
    id: 'chlorella',
    name: 'Chlorella',
    category: 'Supplements',
    shortDefinition: 'Green algae supporting detoxification and immune function',
    detailedExplanation: 'Chlorella is a single-celled green algae rich in chlorophyll, protein, vitamins, and minerals. It may support detoxification, immune function, and provide antioxidants. Broken cell wall forms are more digestible. Choose quality-tested products as algae can concentrate environmental toxins.',
    relatedTerms: ['Algae', 'Detoxification', 'Chlorophyll', 'Immune Support']
  },
  {
    id: 'apple-cider-vinegar',
    name: 'Apple Cider Vinegar',
    category: 'Supplements',
    shortDefinition: 'Fermented vinegar with potential digestive benefits',
    detailedExplanation: 'Raw, unfiltered apple cider vinegar contains enzymes and beneficial acids that may support digestion, pH balance, and coat health. While popular in natural pet care, scientific evidence for benefits is limited. If used, dilute well and use small amounts. Ensure it does not upset stomach acidity needed for raw feeding.',
    relatedTerms: ['Digestive Support', 'pH Balance', 'Fermented Foods', 'Home Remedies']
  },
  {
    id: 'diatomaceous-earth',
    name: 'Diatomaceous Earth',
    category: 'Supplements',
    shortDefinition: 'Food-grade silica supplement for parasites and minerals',
    detailedExplanation: 'Food-grade diatomaceous earth is made from fossilized algae and contains silica. Some use it for internal parasite control, though evidence is limited. It may provide trace minerals. Only food-grade DE should be used, never pool-grade. Effectiveness for parasites is questionable; veterinary dewormers are more reliable.',
    relatedTerms: ['Parasites', 'Silica', 'Minerals', 'Deworming']
  },
  {
    id: 'msm',
    name: 'MSM',
    category: 'Supplements',
    shortDefinition: 'Methylsulfonylmethane supporting joint and connective tissue',
    detailedExplanation: 'MSM (Methylsulfonylmethane) is an organic sulfur compound that may support joint health, reduce inflammation, and aid connective tissue formation. It is often combined with glucosamine and chondroitin. While research is limited, many dogs seem to benefit from MSM supplementation, especially for arthritis.',
    relatedTerms: ['Joint Support', 'Sulfur', 'Glucosamine', 'Chondroitin']
  },
  {
    id: 'hyaluronic-acid',
    name: 'Hyaluronic Acid',
    category: 'Supplements',
    shortDefinition: 'Compound supporting joint lubrication and mobility',
    detailedExplanation: 'Hyaluronic acid is a natural compound found in joint fluid and connective tissue. It provides cushioning and lubrication to joints. Supplementation may benefit dogs with arthritis or joint issues. It is often combined with glucosamine and chondroitin in joint supplements.',
    relatedTerms: ['Joint Support', 'Lubrication', 'Mobility', 'Arthritis']
  },
  {
    id: 'colostrum',
    name: 'Colostrum',
    category: 'Supplements',
    shortDefinition: 'First milk rich in antibodies and immune factors',
    detailedExplanation: 'Colostrum is the first milk produced after birth, packed with antibodies, growth factors, and immune-supporting compounds. Bovine colostrum supplements may support immune function, gut health, and recovery from illness. It contains immunoglobulins, lactoferrin, and growth factors. Quality varies among products.',
    relatedTerms: ['Immune Support', 'Antibodies', 'Gut Health', 'Immunoglobulins']
  },
  {
    id: 'lactoferrin',
    name: 'Lactoferrin',
    category: 'Nutrition',
    shortDefinition: 'Protein in milk with antimicrobial and immune properties',
    detailedExplanation: 'Lactoferrin is an iron-binding protein found in milk and colostrum with antimicrobial, antiviral, and immune-modulating properties. It supports iron absorption and gut health. Found naturally in raw dairy products, particularly colostrum and kefir.',
    relatedTerms: ['Colostrum', 'Immune Support', 'Dairy', 'Antimicrobial']
  },
  {
    id: 'milk-thistle',
    name: 'Milk Thistle',
    category: 'Supplements',
    shortDefinition: 'Herb supporting liver health and detoxification',
    detailedExplanation: 'Milk thistle contains silymarin, a compound that supports liver health, protects liver cells, and aids detoxification. It may be beneficial for dogs with liver disease or those on medications affecting the liver. While generally safe, consult a veterinarian before use, especially with liver conditions.',
    relatedTerms: ['Liver Support', 'Silymarin', 'Detoxification', 'Herbal Supplement']
  },
  {
    id: 'dandelion',
    name: 'Dandelion',
    category: 'Supplements',
    shortDefinition: 'Herb supporting liver and kidney function',
    detailedExplanation: 'Dandelion root and leaves support liver and kidney function, act as a gentle diuretic, and provide vitamins and minerals. It may aid digestion and bile production. Dogs can safely consume small amounts of fresh dandelion greens (from pesticide-free areas) or dried supplements.',
    relatedTerms: ['Liver Support', 'Kidney Support', 'Herbal Supplement', 'Diuretic']
  },
  {
    id: 'slippery-elm',
    name: 'Slippery Elm',
    category: 'Supplements',
    shortDefinition: 'Herb soothing digestive tract inflammation',
    detailedExplanation: 'Slippery elm bark contains mucilage that coats and soothes the digestive tract. It may help with diarrhea, constipation, inflammatory bowel conditions, and upset stomach. Mix powder with water to form a gel before feeding. Safe for short-term use but consult a vet for chronic conditions.',
    relatedTerms: ['Digestive Support', 'IBD', 'Herbal Supplement', 'Gut Lining']
  },
  {
    id: 'pumpkin',
    name: 'Pumpkin',
    category: 'Food Types',
    shortDefinition: 'Vegetable fiber supporting digestive regularity',
    detailedExplanation: 'Plain, canned pumpkin (not pie filling) provides soluble and insoluble fiber that can help normalize stool consistency. It is useful for both diarrhea and constipation. Pumpkin also provides beta-carotene and vitamins. Use in small amounts as a supplement, not a dietary staple.',
    relatedTerms: ['Fiber', 'Digestive Support', 'Vegetables', 'Stool Quality']
  },
  {
    id: 'sweet-potato',
    name: 'Sweet Potato',
    category: 'Food Types',
    shortDefinition: 'Starchy vegetable providing fiber and beta-carotene',
    detailedExplanation: 'Sweet potato provides fiber, beta-carotene, vitamins, and minerals. While nutritious, it is high in carbohydrates and should be used sparingly in raw diets. If used, cook thoroughly to improve digestibility. Some BARF diets include small amounts of sweet potato, but it is not part of PMR.',
    relatedTerms: ['Vegetables', 'Carbohydrates', 'Fiber', 'BARF']
  },
  {
    id: 'berries',
    name: 'Berries',
    category: 'Food Types',
    shortDefinition: 'Low-sugar fruits providing antioxidants',
    detailedExplanation: 'Berries like blueberries, strawberries, and blackberries provide antioxidants, fiber, and vitamins with relatively low sugar content. They can be offered as occasional treats or small additions to BARF diets. Berries should be fresh or frozen without added sugars. Use in moderation.',
    relatedTerms: ['Antioxidants', 'Fruits', 'BARF', 'Treats']
  },
  {
    id: 'blueberries',
    name: 'Blueberries',
    category: 'Food Types',
    shortDefinition: 'Antioxidant-rich berries supporting cognitive function',
    detailedExplanation: 'Blueberries are rich in antioxidants, particularly anthocyanins, which may support cognitive function, eye health, and reduce inflammation. They provide vitamins C and K. Dogs can safely eat fresh or frozen blueberries in moderation as treats or BARF additions.',
    relatedTerms: ['Berries', 'Antioxidants', 'Fruits', 'Cognitive Support']
  },
  {
    id: 'leafy-greens',
    name: 'Leafy Greens',
    category: 'Food Types',
    shortDefinition: 'Nutrient-dense vegetables providing vitamins and minerals',
    detailedExplanation: 'Leafy greens like kale, spinach, and chard provide vitamins, minerals, and phytonutrients. Dogs have limited ability to digest plant matter, so greens should be finely chopped, pureed, or lightly steamed. Some BARF diets include 5-10% vegetables. Avoid excessive amounts of oxalate-rich greens.',
    relatedTerms: ['Vegetables', 'BARF', 'Phytonutrients', 'Plant Matter']
  },
  {
    id: 'cruciferous-vegetables',
    name: 'Cruciferous Vegetables',
    category: 'Food Types',
    shortDefinition: 'Nutrient-rich vegetables like broccoli and cauliflower',
    detailedExplanation: 'Cruciferous vegetables (broccoli, cauliflower, Brussels sprouts, kale) provide vitamins, minerals, and cancer-fighting compounds. They should be used in moderation as they can cause gas and may affect thyroid function in excess. Steam lightly and puree for better digestibility if included in BARF diets.',
    relatedTerms: ['Vegetables', 'BARF', 'Phytonutrients', 'Thyroid']
  },
  {
    id: 'bone-density',
    name: 'Bone Density',
    category: 'Nutrition',
    shortDefinition: 'Hardness of bones affecting digestibility and safety',
    detailedExplanation: 'Bone density varies by animal size, age, and bone type. Poultry bones are softer and more digestible than large mammal bones. Weight-bearing bones from large animals are extremely dense and may cause tooth damage. Choose appropriate bone density based on dog size, chewing ability, and experience with raw feeding.',
    relatedTerms: ['Edible Bones', 'Recreational Bones', 'Safety', 'Weight-Bearing Bones']
  },
  {
    id: 'bone-safety',
    name: 'Bone Safety',
    category: 'Health',
    shortDefinition: 'Guidelines for safe bone feeding',
    detailedExplanation: 'Safe bone feeding requires supervision, appropriate sizing (too large to swallow whole), raw bones only (never cooked), and monitoring for aggressive chewing. Remove bones that become small enough to swallow or develop sharp edges. Start with softer bones and supervise until you understand your dog\'s chewing style. Seek veterinary care for choking or obstruction.',
    relatedTerms: ['Raw Meaty Bones', 'Choking', 'Supervision', 'Safety']
  },
  {
    id: 'gulping',
    name: 'Gulping',
    category: 'Feeding Methods',
    shortDefinition: 'Swallowing food without adequate chewing',
    detailedExplanation: 'Some dogs gulp food without proper chewing, which can be dangerous with bones. Solutions include feeding larger pieces, partially freezing food, using slow-feed methods, or supervising closely. Gulpers may need bones cut in half or held while eating. Ground raw may be safer for persistent gulpers.',
    relatedTerms: ['Bone Safety', 'Feeding Behavior', 'Choking Risk', 'Supervision']
  },
  {
    id: 'supervision',
    name: 'Supervision',
    category: 'Feeding Methods',
    shortDefinition: 'Monitoring dogs while eating, especially with bones',
    detailedExplanation: 'Supervision during raw feeding, particularly with bones, is essential for safety. Watch for choking, aggressive chewing, guarding behavior, and proper chewing. Remove bones that become hazardous. Supervision helps you understand your dog\'s eating patterns and adjust feeding accordingly. Never leave dogs unattended with bones.',
    relatedTerms: ['Bone Safety', 'Gulping', 'Safety', 'Monitoring']
  },
  {
    id: 'food-guarding',
    name: 'Food Guarding',
    category: 'Health',
    shortDefinition: 'Resource guarding behavior around food',
    detailedExplanation: 'Food guarding is protective behavior around food, ranging from mild (tensing) to severe (aggression). Raw feeding, especially with high-value items like bones, can trigger guarding in predisposed dogs. Management includes feeding in separate spaces, training, and consulting a behaviorist if severe. Never punish guarding as it can escalate.',
    relatedTerms: ['Behavior', 'Training', 'Aggression', 'Resource Guarding']
  },
  {
    id: 'slow-feeders',
    name: 'Slow Feeders',
    category: 'Feeding Methods',
    shortDefinition: 'Tools and methods to slow eating pace',
    detailedExplanation: 'Slow feeders include puzzle bowls, Kong toys, snuffle mats, or simply spreading food on flat surfaces. They encourage slower eating, reduce gulping, provide mental stimulation, and can help prevent bloat. Useful for fast eaters or dogs who need enrichment. Can be used with ground raw or smaller food pieces.',
    relatedTerms: ['Gulping', 'Bloat Prevention', 'Enrichment', 'Feeding Tools']
  },
  {
    id: 'enrichment-feeding',
    name: 'Enrichment Feeding',
    category: 'Feeding Methods',
    shortDefinition: 'Making mealtime mentally stimulating and challenging',
    detailedExplanation: 'Enrichment feeding provides mental stimulation through food puzzles, frozen treats, stuffed bones, snuffle mats, or scatter feeding. It satisfies natural foraging instincts, slows eating, reduces boredom, and provides cognitive exercise. Particularly beneficial for high-energy or intelligent dogs.',
    relatedTerms: ['Mental Stimulation', 'Slow Feeders', 'Foraging', 'Behavioral Enrichment']
  },
  {
    id: 'frozen-treats',
    name: 'Frozen Treats',
    category: 'Feeding Methods',
    shortDefinition: 'Frozen raw food for cooling and extended eating',
    detailedExplanation: 'Frozen raw food provides cooling relief, extended eating time, and enrichment. Freeze bone broth in molds, stuff Kongs with ground raw, or freeze raw meaty bones. Particularly useful in hot weather, for teething puppies, or as enrichment. Ensure items are appropriately sized to prevent choking.',
    relatedTerms: ['Enrichment Feeding', 'Bone Broth', 'Cooling', 'Summer Feeding']
  },
  {
    id: 'teething-puppies',
    name: 'Teething Puppies',
    category: 'Health',
    shortDefinition: 'Puppies losing baby teeth and growing adult teeth',
    detailedExplanation: 'Puppies teethe from 3-7 months as baby teeth fall out and adult teeth emerge. Raw feeding supports healthy tooth development. Frozen raw meaty bones, frozen washcloths, and appropriate chews provide relief. Monitor for retained baby teeth. Proper calcium from raw bones supports strong adult tooth development.',
    relatedTerms: ['Puppies', 'Dental Development', 'Frozen Treats', 'Raw Meaty Bones']
  },
  {
    id: 'puppy-feeding',
    name: 'Puppy Feeding',
    category: 'Feeding Methods',
    shortDefinition: 'Raw feeding protocols for growing puppies',
    detailedExplanation: 'Puppies require more food (5-10% of body weight), more frequent meals (3-4 times daily), and careful calcium/phosphorus balance for proper growth. Use the same meat/bone/organ ratios as adults. Avoid supplementing calcium beyond what bones provide. Large breed puppies need controlled growth to prevent developmental orthopedic disease.',
    relatedTerms: ['Growth', 'Calcium', 'Developmental Orthopedic Disease', 'Puppies']
  },
  {
    id: 'large-breed-puppies',
    name: 'Large Breed Puppies',
    category: 'Health',
    shortDefinition: 'Puppies of breeds over 50 pounds at maturity',
    detailedExplanation: 'Large breed puppies require careful nutrition to prevent developmental orthopedic diseases like hip dysplasia and osteochondrosis. Avoid excess calcium, control growth rate, maintain proper calcium:phosphorus ratio, and don\'t overfeed. Raw feeding with proper ratios supports healthy growth without the excess found in many puppy foods.',
    relatedTerms: ['Puppy Feeding', 'Developmental Orthopedic Disease', 'Hip Dysplasia', 'Growth Rate']
  },
  {
    id: 'developmental-orthopedic-disease',
    name: 'Developmental Orthopedic Disease',
    category: 'Health',
    shortDefinition: 'Growth-related skeletal problems in puppies',
    detailedExplanation: 'Developmental orthopedic diseases include hip dysplasia, elbow dysplasia, osteochondrosis, and panosteitis. Causes include genetics, rapid growth, excess calcium, and obesity during growth. Proper raw feeding with balanced calcium:phosphorus ratios, controlled portions, and appropriate exercise supports healthy skeletal development.',
    relatedTerms: ['Large Breed Puppies', 'Hip Dysplasia', 'Calcium', 'Growth Rate']
  },
  {
    id: 'senior-dog-feeding',
    name: 'Senior Dog Feeding',
    category: 'Feeding Methods',
    shortDefinition: 'Adjusting raw feeding for older dogs',
    detailedExplanation: 'Senior dogs may need modified raw feeding: softer bones or ground options for dental issues, joint-supporting additions, easier-to-digest proteins, potential calorie reduction for lower activity, and more frequent smaller meals. Raw feeding supports senior health through high-quality nutrition and joint-supporting components like cartilage and bone broth.',
    relatedTerms: ['Aging', 'Joint Support', 'Dental Issues', 'Senior Health']
  },
  {
    id: 'arthritis',
    name: 'Arthritis',
    category: 'Health',
    shortDefinition: 'Joint inflammation causing pain and reduced mobility',
    detailedExplanation: 'Arthritis is degenerative joint disease causing pain, stiffness, and reduced mobility. Raw feeding supports arthritic dogs through anti-inflammatory omega-3s, joint-supporting compounds (glucosamine, chondroitin, collagen), maintaining healthy weight, and providing easily digestible nutrition. Include fatty fish, green-lipped mussel, bone broth, and cartilage-rich foods.',
    relatedTerms: ['Joint Support', 'Senior Dogs', 'Inflammation', 'Mobility']
  },
  {
    id: 'cancer-diet',
    name: 'Cancer Diet',
    category: 'Health',
    shortDefinition: 'Dietary approach for dogs with cancer',
    detailedExplanation: 'Cancer diet theory suggests limiting carbohydrates (which feed cancer cells) and providing high-quality protein and fats. Raw feeding naturally aligns with this approach. Include omega-3s for anti-inflammatory effects, antioxidant-rich organs, and highly digestible proteins. Work with an oncologist and consider supplements like fish oil, mushrooms, or turmeric.',
    relatedTerms: ['Carbohydrates', 'Omega-3', 'Protein', 'Ketogenic Diet']
  },
  {
    id: 'kidney-disease',
    name: 'Kidney Disease',
    category: 'Health',
    shortDefinition: 'Reduced kidney function requiring dietary management',
    detailedExplanation: 'Kidney disease requires modified nutrition: moderate high-quality protein, limited phosphorus, omega-3s for anti-inflammatory effects, and adequate hydration. Raw feeding can be adapted by choosing lower-phosphorus proteins, limiting bone content, adding fish oil, and ensuring fresh water availability. Work with a veterinarian for monitoring.',
    relatedTerms: ['Phosphorus', 'Protein', 'Hydration', 'Veterinary Management']
  },
  {
    id: 'liver-disease',
    name: 'Liver Disease',
    category: 'Health',
    shortDefinition: 'Impaired liver function requiring dietary support',
    detailedExplanation: 'Liver disease requires high-quality, easily digestible protein, moderate fat, antioxidants, and support for liver function. Raw feeding can be beneficial with appropriate protein sources, limited copper (avoid liver organ meat), milk thistle supplementation, and easily digestible options. Veterinary guidance is essential for severe cases.',
    relatedTerms: ['Liver Function', 'Protein', 'Milk Thistle', 'Copper']
  },
  {
    id: 'diabetes',
    name: 'Diabetes',
    category: 'Health',
    shortDefinition: 'Metabolic disorder affecting blood sugar regulation',
    detailedExplanation: 'Diabetes in dogs requires consistent, low-carbohydrate nutrition and insulin management. Raw feeding is ideal due to minimal carbohydrates and stable blood sugar impact. Feed consistent amounts at regular times, coordinate with insulin injections, and monitor blood glucose. Work closely with a veterinarian for insulin dosing.',
    relatedTerms: ['Blood Sugar', 'Insulin', 'Glycemic Index', 'Carbohydrates']
  },
  {
    id: 'allergic-dermatitis',
    name: 'Allergic Dermatitis',
    category: 'Health',
    shortDefinition: 'Skin inflammation from allergies',
    detailedExplanation: 'Allergic dermatitis causes itching, redness, and skin infections. Food allergies are one potential cause. Raw feeding with novel proteins, elimination diets, and avoiding common allergens can help manage food-related dermatitis. Include omega-3s for anti-inflammatory effects. Consider environmental allergies and work with a veterinarian.',
    relatedTerms: ['Food Allergies', 'Novel Protein', 'Omega-3', 'Skin Health']
  },
  {
    id: 'hot-spots',
    name: 'Hot Spots',
    category: 'Health',
    shortDefinition: 'Acute moist dermatitis with rapid onset',
    detailedExplanation: 'Hot spots are localized areas of skin inflammation, often triggered by allergies, moisture, or irritation. While primarily treated topically, addressing underlying food sensitivities through raw feeding may help reduce recurrence. Omega-3s support skin health and reduce inflammation.',
    relatedTerms: ['Allergic Dermatitis', 'Skin Health', 'Food Sensitivities', 'Omega-3']
  },
  {
    id: 'tear-staining',
    name: 'Tear Staining',
    category: 'Health',
    shortDefinition: 'Discoloration around eyes from excessive tearing',
    detailedExplanation: 'Tear staining causes reddish-brown discoloration around eyes. Causes include genetics, eye structure, allergies, and diet. Some dogs experience reduced staining on raw diets, possibly due to eliminating food additives, dyes, and allergens. Ensure proper nutrition, especially adequate B vitamins and tyrosine.',
    relatedTerms: ['Food Sensitivities', 'Genetics', 'B Vitamins', 'Coat Health']
  },
  {
    id: 'ear-infections',
    name: 'Ear Infections',
    category: 'Health',
    shortDefinition: 'Inflammation of ear canal, often allergy-related',
    detailedExplanation: 'Chronic ear infections are often linked to food allergies or sensitivities. Raw feeding with novel proteins and elimination diets can reduce food-related ear infections. Yeast overgrowth in ears may be exacerbated by high-carbohydrate diets. Raw feeding\'s low carbohydrate content may help reduce recurrence.',
    relatedTerms: ['Food Allergies', 'Yeast', 'Carbohydrates', 'Novel Protein']
  },
  {
    id: 'yeast-overgrowth',
    name: 'Yeast Overgrowth',
    category: 'Health',
    shortDefinition: 'Excessive yeast causing skin and ear issues',
    detailedExplanation: 'Yeast overgrowth (often Malassezia) causes itching, odor, and infections in ears, paws, and skin folds. Triggers include allergies, antibiotics, and high-carbohydrate diets. Raw feeding\'s low carbohydrate content reduces yeast food source. Include probiotics, limit sugars, and address underlying allergies.',
    relatedTerms: ['Ear Infections', 'Carbohydrates', 'Probiotics', 'Food Allergies']
  },
  {
    id: 'megaesophagus',
    name: 'Megaesophagus',
    category: 'Health',
    shortDefinition: 'Esophageal motility disorder affecting swallowing',
    detailedExplanation: 'Megaesophagus is dilated esophagus with poor motility, causing regurgitation and aspiration pneumonia risk. Dogs with megaesophagus require upright feeding positions and carefully textured food. Some do well with ground raw fed in balls or meatballs. Bones are contraindicated. Work closely with a veterinarian.',
    relatedTerms: ['Swallowing Disorders', 'Boneless Diet', 'Ground Raw', 'Veterinary Management']
  },
  {
    id: 'aspiration-pneumonia',
    name: 'Aspiration Pneumonia',
    category: 'Health',
    shortDefinition: 'Lung infection from inhaling food or liquid',
    detailedExplanation: 'Aspiration pneumonia occurs when food, liquid, or vomit enters the lungs. Risk factors include megaesophagus, cleft palate, and laryngeal paralysis. Prevent through upright feeding positions, appropriate food texture, and managing underlying conditions. Seek immediate veterinary care for coughing after eating or difficulty breathing.',
    relatedTerms: ['Megaesophagus', 'Respiratory Health', 'Emergency', 'Veterinary Care']
  },
  {
    id: 'cleft-palate',
    name: 'Cleft Palate',
    category: 'Health',
    shortDefinition: 'Congenital opening in the roof of the mouth',
    detailedExplanation: 'Cleft palate is an opening in the roof of the mouth, causing feeding difficulties and aspiration risk. Severe cases require surgical correction. Affected puppies need specialized feeding protocols. After surgical repair and veterinary clearance, raw feeding can be appropriate with texture modifications if needed.',
    relatedTerms: ['Congenital Defects', 'Aspiration Risk', 'Feeding Challenges', 'Veterinary Care']
  },
  {
    id: 'copper-storage-disease',
    name: 'Copper Storage Disease',
    category: 'Health',
    shortDefinition: 'Genetic disorder causing copper accumulation in liver',
    detailedExplanation: 'Copper storage disease causes toxic copper accumulation in the liver, particularly in certain breeds like Bedlington Terriers. Management requires limiting dietary copper. In raw feeding, avoid liver (high in copper) and choose low-copper proteins. Work with a veterinarian for monitoring and chelation therapy if needed.',
    relatedTerms: ['Liver Disease', 'Genetic Disorders', 'Liver Organ', 'Breed-Specific Issues']
  },
  {
    id: 'portosystemic-shunt',
    name: 'Portosystemic Shunt',
    category: 'Health',
    shortDefinition: 'Abnormal blood vessel bypassing liver filtration',
    detailedExplanation: 'Portosystemic shunt is abnormal blood flow bypassing the liver, causing toxin buildup and poor nutrient processing. Dietary management requires easily digestible, moderate protein, and frequent small meals. Raw feeding can be adapted but requires veterinary guidance. Some cases need surgical correction.',
    relatedTerms: ['Liver Disease', 'Protein', 'Congenital Defects', 'Veterinary Management']
  },
  {
    id: 'vitamin-d-toxicity',
    name: 'Vitamin D Toxicity',
    category: 'Health',
    shortDefinition: 'Excessive vitamin D causing calcium dysregulation',
    detailedExplanation: 'Vitamin D toxicity causes elevated calcium levels, kidney damage, and potentially death. Sources include certain rodenticides, excessive supplementation, or some commercial foods. Avoid over-supplementing vitamin D. Properly balanced raw diets provide appropriate vitamin D from natural sources without toxicity risk.',
    relatedTerms: ['Vitamin D', 'Hypercalcemia', 'Toxicity', 'Supplementation']
  },
  {
    id: 'hypercalcemia',
    name: 'Hypercalcemia',
    category: 'Health',
    shortDefinition: 'Elevated blood calcium levels',
    detailedExplanation: 'Hypercalcemia is excessive blood calcium from various causes including cancer, kidney disease, vitamin D toxicity, or excessive calcium supplementation. Symptoms include increased thirst, urination, vomiting, and weakness. In raw feeding, ensure proper bone content (not excessive) and avoid over-supplementing calcium.',
    relatedTerms: ['Calcium', 'Vitamin D Toxicity', 'Bone Content', 'Kidney Disease']
  },
  {
    id: 'hypocalcemia',
    name: 'Hypocalcemia',
    category: 'Health',
    shortDefinition: 'Low blood calcium levels',
    detailedExplanation: 'Hypocalcemia is deficient blood calcium causing muscle tremors, seizures, and weakness. Causes include insufficient dietary calcium, parathyroid issues, or eclampsia in nursing mothers. Raw feeding with adequate bone content prevents dietary hypocalcemia. Acute cases require immediate veterinary treatment with intravenous calcium.',
    relatedTerms: ['Calcium', 'Bone Content', 'Eclampsia', 'Emergency']
  },
  {
    id: 'eclampsia',
    name: 'Eclampsia',
    category: 'Health',
    shortDefinition: 'Life-threatening calcium depletion in nursing mothers',
    detailedExplanation: 'Eclampsia (milk fever) is severe calcium depletion in nursing mothers, especially small breeds with large litters. Symptoms include restlessness, panting, muscle tremors, and seizures. Prevention includes adequate calcium during nursing through proper raw feeding with bones. Emergency treatment requires intravenous calcium from a veterinarian.',
    relatedTerms: ['Hypocalcemia', 'Nursing Mothers', 'Calcium', 'Emergency']
  },
  {
    id: 'pregnant-dog-feeding',
    name: 'Pregnant Dog Feeding',
    category: 'Feeding Methods',
    shortDefinition: 'Nutritional requirements for pregnant dogs',
    detailedExplanation: 'Pregnant dogs need increased calories (especially in late pregnancy), high-quality protein, adequate calcium and phosphorus from bones, and increased fat. Feed 25-50% more food by week 6 of pregnancy. Maintain proper ratios but increase overall quantity. Include organ meats for vitamins. Continue through nursing.',
    relatedTerms: ['Reproduction', 'Puppy Feeding', 'Calcium', 'Nursing Mothers']
  },
  {
    id: 'nursing-mothers',
    name: 'Nursing Mothers',
    category: 'Feeding Methods',
    shortDefinition: 'Feeding lactating dogs producing milk',
    detailedExplanation: 'Nursing mothers require dramatically increased calories (2-4 times normal), high-quality protein, adequate calcium from bones to prevent eclampsia, and plenty of fresh water. Feed multiple meals daily, allow free feeding if possible, and maintain raw feeding ratios. Monitor body condition and milk production.',
    relatedTerms: ['Pregnant Dog Feeding', 'Eclampsia', 'Calcium', 'Lactation']
  },
  {
    id: 'working-dogs',
    name: 'Working Dogs',
    category: 'Feeding Methods',
    shortDefinition: 'Feeding requirements for highly active working dogs',
    detailedExplanation: 'Working dogs (sled dogs, hunting dogs, agility competitors) require increased calories, higher fat for sustained energy, adequate protein for muscle maintenance, and proper hydration. May need 3-6% of body weight in food depending on work intensity. Include quality fats and consider feeding after work to prevent bloat.',
    relatedTerms: ['Performance Nutrition', 'High Activity', 'Fat', 'Energy Requirements']
  },
  {
    id: 'performance-nutrition',
    name: 'Performance Nutrition',
    category: 'Nutrition',
    shortDefinition: 'Optimizing nutrition for athletic dogs',
    detailedExplanation: 'Performance nutrition focuses on fueling athletic dogs through appropriate macronutrient ratios, timing of meals, hydration, and recovery support. Fat provides sustained energy for endurance. Protein supports muscle maintenance and recovery. Avoid feeding immediately before intense activity. Consider electrolytes for extended work in heat.',
    relatedTerms: ['Working Dogs', 'Fat', 'Protein', 'Athletic Performance']
  },
  {
    id: 'hydration',
    name: 'Hydration',
    category: 'Health',
    shortDefinition: 'Adequate water intake for health',
    detailedExplanation: 'Proper hydration is essential for all body functions. Raw feeding provides more moisture than dry kibble (raw meat is ~70% water). Ensure constant access to fresh water. Increased water needs during heat, exercise, pregnancy, and illness. Bone broth provides additional hydration. Monitor for signs of dehydration.',
    relatedTerms: ['Water', 'Bone Broth', 'Health', 'Moisture Content']
  },
  {
    id: 'dehydration',
    name: 'Dehydration',
    category: 'Health',
    shortDefinition: 'Insufficient body water causing health issues',
    detailedExplanation: 'Dehydration occurs from insufficient water intake, excessive loss (vomiting, diarrhea, heat), or kidney disease. Signs include dry gums, skin tenting, lethargy, and dark urine. Severe dehydration requires veterinary treatment. Raw feeding provides more moisture than kibble but fresh water must always be available.',
    relatedTerms: ['Hydration', 'Water', 'Emergency', 'Health']
  },
  {
    id: 'electrolytes',
    name: 'Electrolytes',
    category: 'Nutrition',
    shortDefinition: 'Minerals essential for cellular function and hydration',
    detailedExplanation: 'Electrolytes (sodium, potassium, chloride, magnesium) regulate hydration, nerve function, muscle contraction, and pH balance. Raw feeding provides electrolytes naturally. Additional supplementation may benefit working dogs, dogs exercising in heat, or those recovering from illness with vomiting or diarrhea.',
    relatedTerms: ['Minerals', 'Hydration', 'Working Dogs', 'Athletic Performance']
  },
  {
    id: 'sodium',
    name: 'Sodium',
    category: 'Nutrition',
    shortDefinition: 'Essential mineral for fluid balance and nerve function',
    detailedExplanation: 'Sodium is essential for fluid balance, nerve transmission, and muscle function. Raw meat naturally contains sodium. Both deficiency and excess can be harmful. Avoid adding salt to raw diets unless recommended by a veterinarian. Some organs like kidney are higher in sodium.',
    relatedTerms: ['Electrolytes', 'Minerals', 'Fluid Balance', 'Salt']
  },
  {
    id: 'potassium',
    name: 'Potassium',
    category: 'Nutrition',
    shortDefinition: 'Mineral supporting heart and muscle function',
    detailedExplanation: 'Potassium is essential for heart function, muscle contraction, and cellular processes. Meat is naturally rich in potassium. Deficiency can occur with chronic vomiting or diarrhea. Kidney disease can cause dangerous potassium elevation. Balanced raw diets provide adequate potassium.',
    relatedTerms: ['Electrolytes', 'Minerals', 'Heart Function', 'Muscle Function']
  },
  {
    id: 'copper',
    name: 'Copper',
    category: 'Nutrition',
    shortDefinition: 'Trace mineral essential for various enzyme functions',
    detailedExplanation: 'Copper is essential for iron metabolism, connective tissue formation, and antioxidant enzymes. Liver is extremely rich in copper. While essential, excess copper can be toxic, especially in breeds prone to copper storage disease. Balanced raw diets with rotational feeding provide appropriate copper.',
    relatedTerms: ['Minerals', 'Liver', 'Copper Storage Disease', 'Trace Minerals']
  },
  {
    id: 'iodine',
    name: 'Iodine',
    category: 'Nutrition',
    shortDefinition: 'Trace mineral essential for thyroid function',
    detailedExplanation: 'Iodine is essential for thyroid hormone production. Sources include fish, seafood, eggs, and dairy. Kelp is a concentrated source but should be used cautiously to avoid excess. Both deficiency and excess can cause thyroid problems. Varied raw diets usually provide adequate iodine.',
    relatedTerms: ['Thyroid', 'Kelp', 'Fish', 'Trace Minerals']
  },
  {
    id: 'thyroid-function',
    name: 'Thyroid Function',
    category: 'Anatomy',
    shortDefinition: 'Gland regulating metabolism and energy',
    detailedExplanation: 'The thyroid gland produces hormones regulating metabolism, energy, and body temperature. Thyroid function requires adequate iodine and selenium. Hypothyroidism (low function) is common in dogs and may benefit from thyroid gland supplementation (if fed as whole prey). Raw feeding supports normal thyroid function through adequate nutrition.',
    relatedTerms: ['Iodine', 'Selenium', 'Metabolism', 'Hormones']
  },
  {
    id: 'hypothyroidism',
    name: 'Hypothyroidism',
    category: 'Health',
    shortDefinition: 'Underactive thyroid causing slow metabolism',
    detailedExplanation: 'Hypothyroidism is decreased thyroid function causing weight gain, lethargy, cold intolerance, and skin/coat problems. Treatment requires thyroid hormone medication. Proper nutrition including adequate iodine and selenium supports thyroid health. Raw feeding can be part of management but doesn\'t replace medication.',
    relatedTerms: ['Thyroid Function', 'Iodine', 'Metabolism', 'Weight Gain']
  },
  {
    id: 'anal-glands',
    name: 'Anal Glands',
    category: 'Anatomy',
    shortDefinition: 'Scent glands requiring proper stool bulk for expression',
    detailedExplanation: 'Anal glands are scent sacs that should empty naturally during defecation. Proper stool bulk from raw feeding (especially bones) helps express anal glands. Soft stools from low bone content can lead to impaction. Signs of problems include scooting, licking, or swelling. Some dogs need manual expression despite proper diet.',
    relatedTerms: ['Stool Quality', 'Bone Content', 'Digestive Health', 'Glandular Issues']
  },
];

/**
 * Get all unique categories from glossary
 */
export function getCategories(): GlossaryCategory[] {
  return Array.from(new Set(glossary.map(term => term.category)));
}

/**
 * Get all terms starting with a specific letter
 */
export function getTermsByLetter(letter: string): GlossaryTerm[] {
  return glossary.filter(term =>
    term.name.toLowerCase().startsWith(letter.toLowerCase())
  );
}

/**
 * Get all terms in a specific category
 */
export function getTermsByCategory(category: GlossaryCategory): GlossaryTerm[] {
  return glossary.filter(term => term.category === category);
}

/**
 * Search terms by query string
 */
export function searchTerms(query: string): GlossaryTerm[] {
  const lowerQuery = query.toLowerCase();
  return glossary.filter(term =>
    term.name.toLowerCase().includes(lowerQuery) ||
    term.shortDefinition.toLowerCase().includes(lowerQuery) ||
    term.detailedExplanation.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get alphabet letters that have terms
 */
export function getAvailableLetters(): string[] {
  const letters = new Set(
    glossary.map(term => term.name.charAt(0).toUpperCase())
  );
  return Array.from(letters).sort();
}
