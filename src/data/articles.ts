/**
 * Education Hub Articles Database
 *
 * 15 comprehensive articles covering all aspects of raw feeding
 */

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // Markdown format
  category: 'Getting Started' | 'Nutrition' | 'Safety' | 'Recipes' | 'Health' | 'Advanced';
  author: string;
  readTime: number; // in minutes
  featured: boolean;
  imageUrl: string;
  publishedAt: string;
  tags: string[];
}

export const articles: Article[] = [
  {
    id: '1',
    slug: 'complete-guide-to-raw-feeding',
    title: 'The Complete Guide to Raw Feeding for Dogs and Cats',
    excerpt: 'Everything you need to know about starting a raw food diet for your pet, from basics to advanced nutrition.',
    category: 'Getting Started',
    author: 'Dr. Sarah Mitchell, DVM',
    readTime: 12,
    featured: true,
    imageUrl: '/images/education/raw-feeding-guide.jpg',
    publishedAt: '2024-06-15T10:00:00Z',
    tags: ['beginner', 'barf', 'nutrition', 'guide'],
    content: `# The Complete Guide to Raw Feeding for Dogs and Cats

## What is Raw Feeding?

Raw feeding, also known as BARF (Biologically Appropriate Raw Food), is a diet that mimics what dogs and cats would eat in the wild. This approach provides fresh, unprocessed meat, bones, organs, and sometimes vegetables to carnivorous pets.

## Benefits of Raw Feeding

### For Dogs
- **Shinier coat and healthier skin** - The natural oils and proteins in raw food contribute to a lustrous coat
- **Cleaner teeth** - Raw bones provide natural dental cleaning
- **Better digestion** - Raw food is easier for dogs to digest than processed kibble
- **Increased energy levels** - Natural nutrients provide sustained energy
- **Reduced allergies** - Fewer processed ingredients mean fewer allergens

### For Cats
- **Optimal hydration** - Raw food has 70%+ moisture content, crucial for feline health
- **Healthy urinary tract** - Proper hydration reduces urinary issues
- **Natural taurine** - Essential amino acid found in raw muscle meat
- **Weight management** - High protein, low carb promotes lean muscle mass
- **Better dental health** - Chewing raw meat keeps teeth clean

## Basic Components

### The 80-10-10 Rule (Prey Model Raw)
- **80% Muscle Meat** - Chicken, beef, turkey, lamb, duck, fish
- **10% Raw Edible Bone** - Chicken necks, wings, turkey necks, duck frames
- **10% Organ Meat** - 5% liver, 5% other organs (kidney, spleen, pancreas)

### The BARF Model
- **70% Muscle Meat** - Various protein sources
- **10% Raw Edible Bone** - For calcium and phosphorus
- **10% Organ Meat** - Nutrient-dense superfoods
- **10% Vegetables and Fruits** - (For dogs only - cats are obligate carnivores)

## Getting Started

### Week 1: Preparation
1. Research and choose your approach (PMR or BARF)
2. Find reliable raw food suppliers in your area
3. Invest in a separate freezer for pet food
4. Calculate your pet's daily food requirements
5. Choose your starter protein (usually chicken)

### Week 2-3: Transition
Start with a single protein source:
- Day 1-3: 25% raw, 75% current food
- Day 4-7: 50% raw, 50% current food
- Day 8-10: 75% raw, 25% current food
- Day 11+: 100% raw food

### Month 2+: Variety
Introduce new proteins every 2-3 weeks:
- Chicken → Turkey → Beef → Lamb → Fish → Duck

## Portion Sizing

### For Dogs
- **Puppies (2-4 months)**: 8-10% of body weight daily
- **Puppies (4-9 months)**: 5-8% of body weight daily
- **Adult dogs**: 2-3% of ideal body weight daily
- **Active/working dogs**: 3-5% of body weight daily
- **Senior dogs**: 1.5-2.5% of body weight daily

### For Cats
- **Kittens (2-9 months)**: 5-8% of body weight daily
- **Adult cats**: 2-4% of ideal body weight daily
- **Active cats**: 3-4% of body weight daily
- **Senior/sedentary cats**: 2-3% of body weight daily

## Food Safety

### Storage Guidelines
- Keep frozen meats at 0°F (-18°C) or below
- Thaw in refrigerator, never on counter
- Use thawed food within 24-48 hours
- Never refreeze thawed raw meat
- Store in airtight containers

### Handling Practices
- Wash hands before and after handling
- Use separate cutting boards for pet food
- Clean all surfaces with hot, soapy water
- Sanitize bowls after each meal
- Don't leave food out for more than 30 minutes

## Common Mistakes to Avoid

1. **Feeding only muscle meat** - Bones and organs are essential
2. **Cooking the bones** - Cooked bones splinter and are dangerous
3. **Not providing variety** - Rotate proteins for balanced nutrition
4. **Rushing the transition** - Go slow to avoid digestive upset
5. **Feeding weight-bearing bones from large animals** - Can break teeth
6. **For cats: Adding vegetables** - Cats are obligate carnivores

## Next Steps

- Read our guide on [Safe Food Handling Practices](#)
- Learn about [Balancing Your Pet's Raw Diet](#)
- Join our [Raw Feeding Community](#)
- Find [Local Raw Food Suppliers](/suppliers)

## Conclusion

Raw feeding is a commitment to your pet's health and longevity. While it requires more effort than opening a bag of kibble, the benefits are undeniable. Start slowly, do your research, and don't hesitate to consult with a raw-feeding-friendly veterinarian.

Remember: Every pet is unique. Monitor your pet's weight, energy levels, and overall health as you make this transition.`
  },
  {
    id: '2',
    slug: 'safe-food-handling-practices',
    title: 'Safe Food Handling for Raw Pet Food',
    excerpt: 'Essential safety protocols for storing, handling, and serving raw food to protect your family and pets.',
    category: 'Safety',
    author: 'Dr. James Peterson, DVM, PhD',
    readTime: 8,
    featured: true,
    imageUrl: '/images/education/food-safety.jpg',
    publishedAt: '2024-06-10T10:00:00Z',
    tags: ['safety', 'hygiene', 'storage'],
    content: `# Safe Food Handling for Raw Pet Food

## Why Food Safety Matters

While raw feeding offers tremendous health benefits, proper food safety is crucial to prevent bacterial contamination and foodborne illness for both you and your pets.

## Storage Best Practices

### Freezer Organization
- **Temperature**: Maintain at 0°F (-18°C) or below
- **Duration**: Most meats safe for 6-12 months when properly frozen
- **Labeling**: Date all packages, use oldest first
- **Separation**: Keep pet food separate from human food

### Refrigerator Guidelines
- **Thawing zone**: Use bottom shelf to prevent drips
- **Container**: Always use sealed, food-safe containers
- **Temperature**: Keep refrigerator at 40°F (4°C) or below
- **Time limit**: Use thawed food within 24-48 hours

## Thawing Methods

### SAFE Methods
1. **Refrigerator thawing** (RECOMMENDED)
   - Place frozen meat in container
   - Allow 24 hours per pound
   - Store on bottom shelf

2. **Cold water thawing**
   - Seal meat in leak-proof bag
   - Submerge in cold water
   - Change water every 30 minutes
   - Cook immediately after thawing

3. **Microwave thawing** (for emergencies only)
   - Use defrost setting
   - Serve immediately
   - Never refreeze

### UNSAFE Methods (NEVER DO)
- ❌ Counter thawing at room temperature
- ❌ Hot water thawing
- ❌ Leaving out overnight

## Handling Protocols

### Before Handling
1. Wash hands with soap and warm water
2. Clean all surfaces and tools
3. Have dedicated cutting board for pet food
4. Wear gloves if you have cuts or compromised immunity

### During Handling
1. Keep raw meat cold at all times
2. Portion into meal-sized servings
3. Minimize time at room temperature
4. Avoid cross-contamination with human food

### After Handling
1. Wash hands thoroughly (20+ seconds)
2. Clean cutting boards with hot, soapy water
3. Sanitize surfaces with bleach solution (1 tbsp bleach per gallon water)
4. Wash any towels or cloths used

## Serving Guidelines

### Meal Preparation
- Serve food at room temperature or slightly chilled
- Remove from refrigerator 15-20 minutes before serving
- Never microwave to warm (can create hot spots and kill beneficial enzymes)

### Bowl Hygiene
- Use stainless steel or ceramic bowls (easier to sanitize)
- Wash with hot, soapy water after each meal
- Dishwasher safe bowls should go through hot cycle
- Replace bowls if scratched or damaged

### Feeding Area
- Use washable mats under bowls
- Clean floor around feeding area daily
- Discard uneaten food after 30 minutes
- Never leave raw food out for hours

## Special Considerations

### For Households with Children
- Supervise children during pet feeding times
- Teach children to wash hands after petting fed pets
- Keep feeding area away from play areas
- Consider feeding pets while children are at school

### For Immunocompromised Individuals
- Consider wearing gloves during food prep
- Extra vigilant surface cleaning
- Consult physician before raw feeding
- May need to use commercially prepared HPP (High-Pressure Pasteurized) raw food

### For Multiple Pets
- Separate feeding stations to prevent fighting
- Clean each bowl individually
- Monitor for food guarding behaviors
- Ensure each pet receives proper portion

## Bacterial Concerns

### Common Bacteria in Raw Meat
- **Salmonella**: Most common concern
- **E. coli**: Found in ground meats
- **Campylobacter**: Common in poultry
- **Listeria**: Found in contaminated meats

### Important Facts
- Healthy dogs and cats have acidic stomachs that kill most bacteria
- Pets handle bacteria better than humans
- Proper handling protects HUMANS, not just pets
- Commercial raw food often undergoes HPP treatment

## Sourcing Quality Meat

### What to Look For
- ✅ Human-grade meat sources
- ✅ USDA inspected facilities
- ✅ Reputable suppliers with good reviews
- ✅ Clear labeling and traceability
- ✅ Proper frozen storage at supplier

### Red Flags
- ❌ Discolored or off-smelling meat
- ❌ Ice crystals indicating thaw/refreeze cycles
- ❌ Damaged or torn packaging
- ❌ No clear source information
- ❌ Prices that seem too good to be true

## Emergency Protocols

### If Contamination Suspected
1. Stop feeding immediately
2. Discard all suspect food
3. Deep clean all surfaces and bowls
4. Monitor pet for signs of illness
5. Contact veterinarian if symptoms appear

### Signs of Foodborne Illness
- Vomiting or diarrhea
- Lethargy
- Loss of appetite
- Fever
- Dehydration

## Conclusion

With proper safety protocols, raw feeding is perfectly safe for your household. The key is consistency and never cutting corners on safety practices.

Remember: You're handling raw meat just like you would for your own meals. The same rules apply!`
  },
  {
    id: '3',
    slug: 'transitioning-to-raw-food',
    title: 'Transitioning Your Pet to Raw Food: A Step-by-Step Guide',
    excerpt: 'Learn the safest and most effective way to transition your dog or cat from kibble to a raw food diet.',
    category: 'Getting Started',
    author: 'Dr. Emily Chen, DVM',
    readTime: 10,
    featured: true,
    imageUrl: '/images/education/transition-guide.jpg',
    publishedAt: '2024-06-05T10:00:00Z',
    tags: ['transition', 'beginner', 'guide'],
    content: `# Transitioning Your Pet to Raw Food

## Why Proper Transition Matters

A gradual transition helps your pet's digestive system adjust to new foods, reducing the risk of upset stomach, diarrhea, or vomiting. Your pet's gut bacteria need time to adapt.

## Pre-Transition Preparation

### 1-2 Weeks Before
- [ ] Research raw feeding basics
- [ ] Find reliable suppliers
- [ ] Calculate daily portions
- [ ] Purchase necessary equipment (bowls, storage containers)
- [ ] Clear freezer space
- [ ] Choose starter protein (chicken recommended)

### Consider a Pre-Transition Fast
**For Dogs:**
- 24-hour fast for adult dogs
- 12-hour fast for puppies over 4 months
- Helps clear digestive system

**For Cats:**
- Never fast cats (can cause hepatic lipidosis)
- Skip straight to gradual transition

## Transition Methods

### Method 1: Gradual Mix (RECOMMENDED for most pets)

**Week 1:**
- 75% old food + 25% raw food
- Monitor stools and energy levels
- Watch for any adverse reactions

**Week 2:**
- 50% old food + 50% raw food
- Stools may be softer during this phase
- This is normal as gut bacteria adjust

**Week 3:**
- 25% old food + 75% raw food
- Stools should start firming up
- Energy levels should increase

**Week 4+:**
- 100% raw food
- Begin introducing second protein

### Method 2: Cold Turkey (For healthy adult dogs only)
- Immediate switch from kibble to raw
- Risk of digestive upset is higher
- Only for dogs with robust digestion
- Not recommended for cats or puppies

### Method 3: The Partial Approach (For picky eaters)
- Morning meal: Keep kibble
- Evening meal: Raw food
- Gradually shift ratios over 4-6 weeks
- Eventual goal is 100% raw

## Timeline by Species

### Dogs
Most dogs transition in 2-4 weeks
- **Young, healthy dogs**: 1-2 weeks
- **Older dogs**: 3-4 weeks
- **Dogs with sensitive stomachs**: 4-6 weeks
- **Puppies (3+ months)**: 2-3 weeks

### Cats
Cats often take longer: 4-8 weeks
- **Young cats**: 3-4 weeks
- **Adult cats**: 4-6 weeks
- **Senior cats**: 6-8 weeks
- **Picky eaters**: Can take months

## Common Transition Challenges

### Challenge 1: Refusal to Eat
**For Dogs:**
- Try hand feeding
- Warm food slightly
- Mix with bone broth
- Skip one meal, try again
- Add small amount of canned fish

**For Cats:**
- Must eat within 24 hours
- Try different textures (ground vs. chunks)
- Add small amount of tuna juice
- Warm to body temperature
- Sprinkle freeze-dried raw as topper

### Challenge 2: Soft Stools or Diarrhea
- Slow down transition timeline
- Return to previous ratio for few days
- Add canned pumpkin (1 tsp per 10 lbs)
- Ensure adequate bone content
- Consider probiotic supplement

### Challenge 3: Constipation
- Usually indicates too much bone
- Add boneless meat
- Ensure adequate hydration
- Add small amount of canned pumpkin
- Consider bone-in percentage

### Challenge 4: Detox Symptoms
Some pets experience "detox" period:
- Increased shedding
- Watery eyes
- Itchy skin
- Bad breath
- This is temporary (1-3 weeks)
- Body is eliminating toxins

## What to Feed During Transition

### Week 1-2: Single Protein
**Best Starter Proteins:**
- Chicken (most digestible)
- Turkey (lean, gentle)
- Rabbit (hypoallergenic)

**Avoid Initially:**
- Beef (richer, harder to digest)
- Pork (can be too rich)
- Fish (introduce later)

### Recommended First Meals

**For Dogs (50 lb adult):**
- 8 oz chicken thigh meat
- 2 oz chicken backs (bone content)
- 1 oz chicken liver

**For Cats (10 lb adult):**
- 2-3 oz chicken thigh meat
- 0.5 oz chicken wing tips (bone)
- 0.25 oz chicken liver

### Week 3-4: Adding Organs
- Start with 5% liver
- Add slowly to prevent diarrhea
- Liver is rich and powerful
- Later add kidney, spleen, pancreas

### Week 5+: Protein Variety
Introduce new proteins one at a time:
1. Chicken → Turkey (similar)
2. Turkey → Duck (similar)
3. Duck → Beef (richer)
4. Beef → Lamb (similar richness)
5. Lamb → Fish (different texture)

## Monitoring Your Pet

### Daily Checks
- **Energy levels**: Should increase over time
- **Stool quality**: Should firm up after week 2
- **Water intake**: May decrease (raw food has moisture)
- **Appetite**: Should remain good or improve

### Weekly Checks
- **Weight**: Should remain stable
- **Coat condition**: Should improve by week 4
- **Teeth**: Should stay cleaner
- **Body condition**: Monitor for too thin/fat

### When to Slow Down
- Persistent loose stools (3+ days)
- Vomiting more than once
- Loss of appetite
- Lethargy
- Any concerning symptoms

### When to See a Vet
- Bloody diarrhea
- Multiple episodes of vomiting
- Refusal to eat (dogs: 48+ hours, cats: 24+ hours)
- Signs of pain or distress
- Severe lethargy

## Tips for Success

### For Picky Dogs
1. Make it a game - hand feed first bites
2. Add warm bone broth
3. Slightly warm the food
4. Feed after exercise
5. Use peer pressure (other dogs eating nearby)

### For Picky Cats
1. Patience is key (can take months)
2. Mix raw with current favorite food
3. Use flavor enhancers (tuna juice, bonito flakes)
4. Try different textures
5. Feed when hungry (before regular meal time)
6. Some cats prefer chunks, others prefer ground

### Environmental Factors
- Quiet feeding area
- Consistent feeding times
- Remove uneaten food after 30 minutes
- Don't hover or watch intensely
- Make mealtime positive

## Special Situations

### Puppies Under 6 Months
- Can start raw from weaning
- Need higher fat content
- More frequent meals (3-4 daily)
- Transition faster than adults (1-2 weeks)
- Supervision for bone safety

### Senior Pets
- May have sensitive digestion
- Slower transition (4-6 weeks)
- May need ground food if teeth issues
- Watch weight closely
- More frequent vet checks

### Pets with Health Issues
- Consult vet before transition
- May need modified approach
- Some conditions require special considerations
- Monitor closely
- Keep vet informed of progress

## Conclusion

Every pet is different. Some transition in days, others take months. The key is patience and listening to your pet's body.

Don't rush the process. A slow transition is always safer than a fast one. Your pet has been eating processed food for years - give their body time to adjust to real food.

Trust the process, and soon you'll have a thriving, healthy raw-fed pet!`
  },
  {
    id: '4',
    slug: 'raw-feeding-puppies-kittens',
    title: 'Raw Feeding for Puppies and Kittens',
    excerpt: 'Special considerations and guidelines for feeding raw food to growing pets from weaning to adulthood.',
    category: 'Nutrition',
    author: 'Dr. Michael Roberts, DVM',
    readTime: 11,
    featured: false,
    imageUrl: '/images/education/puppies-kittens.jpg',
    publishedAt: '2024-06-01T10:00:00Z',
    tags: ['puppies', 'kittens', 'growth', 'nutrition'],
    content: `# Raw Feeding for Puppies and Kittens

Growing pets have unique nutritional needs. This guide covers everything you need to know about raw feeding from weaning to adulthood.

## When to Start

### Puppies
- Can start raw from weaning (3-4 weeks)
- Transition from mother's milk to raw is natural
- Started on kibble? Transition at any age

### Kittens
- Weaning begins at 4 weeks
- Fully weaned by 8 weeks
- Raw food can begin at 4-5 weeks

## Portion Guidelines

### Puppies (By Age)
- **3-8 weeks**: 8-10% of current body weight daily
- **8-16 weeks**: 5-8% of current body weight daily
- **4-6 months**: 4-6% of current body weight daily
- **6-9 months**: 3-4% of current body weight daily
- **9-12 months**: 2.5-3% of current body weight daily

### Kittens (By Age)
- **4-8 weeks**: 8-10% of current body weight daily
- **8-16 weeks**: 6-8% of current body weight daily
- **4-6 months**: 5-6% of current body weight daily
- **6-12 months**: 3-4% of current body weight daily

## Feeding Frequency

### Puppies
- **3-12 weeks**: 4 meals per day
- **3-6 months**: 3 meals per day
- **6-12 months**: 2 meals per day
- **12+ months**: 1-2 meals per day

### Kittens
- **4-12 weeks**: 4 meals per day
- **3-6 months**: 3 meals per day
- **6-12 months**: 2-3 meals per day
- **12+ months**: 2 meals per day

## Nutritional Requirements

### Calcium and Phosphorus Balance
- Critical for bone development
- Ratio should be 1.2:1 to 1.5:1 (calcium:phosphorus)
- Raw meaty bones provide perfect balance
- Avoid all-muscle-meat diets

### Protein Requirements
**Puppies:**
- Minimum 22% protein (dry matter basis)
- Large breeds: 22-26%
- Small breeds: 25-30%

**Kittens:**
- Minimum 30% protein (dry matter basis)
- Higher protein than puppies
- Essential for growth and development

### Fat Content
**Puppies:**
- Minimum 8% fat
- Large breeds: 10-15%
- Small breeds: 15-20%

**Kittens:**
- Minimum 9% fat
- Higher energy needs
- Supports brain development

## Safe Foods for Growing Pets

### Best Proteins
1. **Chicken** - Highly digestible, good starter
2. **Turkey** - Lean, gentle on stomach
3. **Rabbit** - Hypoallergenic, excellent nutrition
4. **Duck** - Rich in nutrients
5. **Beef** - Later introduction, very nutritious

### Best Bones
**For Puppies:**
- Chicken necks
- Chicken wings
- Duck necks
- Turkey necks (for larger breeds)

**For Kittens:**
- Chicken wing tips
- Chicken necks (chopped)
- Cornish hen parts
- Quail

### Organ Meats
- Start with liver (5% of diet)
- Add kidney, spleen, brain
- All organs provide different nutrients
- Feed variety over time

## Foods to Avoid

### Never Feed Young Pets
- ❌ Weight-bearing bones from large animals
- ❌ Cooked bones (splinter risk)
- ❌ Onions or garlic
- ❌ Grapes or raisins
- ❌ Chocolate
- ❌ Xylitol (artificial sweetener)
- ❌ Raw salmon (can contain parasites - freeze first)

### Bones to Avoid
- ❌ Beef femur or knuckle bones (too hard)
- ❌ Pork ribs (can splinter)
- ❌ Any cooked bones
- ❌ Bones small enough to swallow whole

## Special Considerations by Breed

### Large/Giant Breed Puppies
- Slower, controlled growth is healthier
- Avoid overfeeding
- Moderate protein (22-24%)
- Balanced calcium:phosphorus crucial
- Feed 80% of recommended amount
- Goal: Lean, not chubby

### Small Breed Puppies
- Higher metabolism
- Need more frequent meals
- Higher protein (25-30%)
- Smaller bone pieces
- Reach adult size quickly (10-12 months)

### Large Breed Kittens
(Maine Coon, Ragdoll, Norwegian Forest)
- Grow for 2-3 years
- Need sustained nutrition
- Higher calorie needs
- Continue kitten portions longer

## Monitoring Growth

### Weekly Checks
- **Weight**: Steady, controlled gain
- **Body condition**: Should see waist
- **Rib check**: Ribs easily felt but not visible
- **Energy**: High energy, playful
- **Coat**: Shiny, soft

### Monthly Checks
- **Height/Length**: Steady growth
- **Teeth**: Monitor baby teeth falling out
- **Muscle development**: Good muscle tone
- **Bone development**: No limping or pain

### Red Flags
- ⚠️ Rapid weight gain (especially large breeds)
- ⚠️ Ribs not palpable (too fat)
- ⚠️ Ribs visible (too thin)
- ⚠️ Limping or joint pain
- ⚠️ Dull coat
- ⚠️ Low energy
- ⚠️ Poor stool quality

## Socialization and Food

### Preventing Resource Guarding
- Hand feed some meals
- Touch puppy/kitten while eating
- Add food to bowl while eating
- Trade treats for bowl
- Make approaching bowl = good things

### Multi-Pet Households
- Feed separately initially
- Supervise all meals
- No food competition
- Each pet has own bowl/space
- Remove bowls when done

## Common Challenges

### Teething (3-6 months)
- Puppies/kittens may have sore mouths
- Offer softer cuts of meat
- Ground meat with bone mixed in
- Frozen bone for soothing
- Normal to slow down eating

### Growth Spurts
- Sudden increase in appetite
- May need 10-20% more food
- Happens around 4-6 months
- Feed to appetite (within reason)
- Monitor weight weekly

### Selective Eating
- Puppies less picky than kittens
- Offer variety
- Don't cater to every preference
- Healthy pet won't starve itself
- Remove uneaten food after 20 minutes

## Supplements for Growing Pets

### Usually NOT Needed
- Whole prey model = complete nutrition
- Variety = balanced diet
- Over-supplementing can be harmful

### Sometimes Beneficial
1. **Fish oil** (omega-3)
   - Brain development
   - Coat health
   - Anti-inflammatory

2. **Vitamin E**
   - Antioxidant
   - Often given with fish oil
   - Protects against oxidation

3. **Probiotics**
   - During transition
   - After antibiotics
   - Digestive support

### Consult Vet Before Adding
- Calcium supplements (can cause skeletal issues)
- Multivitamins (can create imbalances)
- Joint supplements (not needed in healthy pups)

## Sample Meal Plans

### For 20 lb Puppy (4 months old)
**Daily Amount: 12-16 oz (5-6% body weight)**

**Morning (4 oz):**
- 3 oz chicken thigh
- 0.5 oz chicken neck
- 0.5 oz chicken liver

**Midday (4 oz):**
- 3.5 oz turkey
- 0.5 oz turkey neck

**Evening (4 oz):**
- 3 oz beef
- 0.5 oz beef kidney
- 0.5 oz green tripe

**Night (4 oz):**
- 3.5 oz duck
- 0.5 oz duck heart

### For 5 lb Kitten (3 months old)
**Daily Amount: 5-6 oz (6-8% body weight)**

**Morning (1.5 oz):**
- 1.25 oz chicken thigh
- 0.25 oz chicken wing tip

**Midday (1.5 oz):**
- 1.3 oz turkey
- 0.2 oz turkey liver

**Evening (1.5 oz):**
- 1.3 oz rabbit
- 0.2 oz rabbit heart

**Night (1.5 oz):**
- 1.4 oz duck
- 0.1 oz duck liver

## Transitioning to Adult Portions

### Gradual Reduction
- Around 12 months for most breeds
- Reduce by 0.5% per month
- Monitor weight and body condition
- Goal: Maintain ideal weight
- Adult dogs: 2-3% body weight
- Adult cats: 2-4% body weight

### Signs of Readiness
- Growth plates closed (vet can verify)
- Reached adult height
- Weight stabilizing
- Adult teeth all in
- Sexual maturity

## Conclusion

Raw feeding growing pets provides optimal nutrition for development. Key points:

- **Higher portions** than adults (% of body weight)
- **More frequent meals** (3-4 daily)
- **Calcium:phosphorus balance** critical
- **Variety** prevents deficiencies
- **Monitor growth** weekly
- **Adjust portions** as needed

Trust the process. Your puppy or kitten will thrive on species-appropriate nutrition!`
  },
  {
    id: '5',
    slug: 'raw-feeding-for-cats',
    title: 'Raw Feeding for Cats: The Complete Feline Guide',
    excerpt: 'Cats have unique nutritional needs as obligate carnivores. Learn how to properly raw feed your feline friend.',
    category: 'Nutrition',
    author: 'Dr. Lisa Anderson, DVM',
    readTime: 13,
    featured: false,
    imageUrl: '/images/education/cat-nutrition.jpg',
    publishedAt: '2024-05-28T10:00:00Z',
    tags: ['cats', 'feline', 'nutrition', 'obligate carnivore'],
    content: `# Raw Feeding for Cats: The Complete Feline Guide

Cats are obligate carnivores with very specific nutritional requirements. This guide covers everything you need to know about properly feeding raw food to cats.

## Why Cats Are Different

### Obligate Carnivore Definition
Unlike dogs (facultative carnivores), cats:
- MUST eat meat to survive
- Cannot synthesize certain nutrients
- Lack digestive enzymes for plant matter
- Have short digestive tracts designed for meat
- Need animal-source nutrients

### Essential Nutrients from Meat
1. **Taurine** - Heart and eye health
2. **Arachidonic acid** - Inflammation regulation
3. **Vitamin A** - Vision, skin, immune function
4. **Niacin** - Energy metabolism
5. **Arginine** - Protein metabolism
6. **Vitamin B12** - Nervous system

## The Perfect Feline Raw Diet

### Recommended Composition
- **95-98% animal products**
- **2-5% bone** (for calcium)
- **0% plant matter** (cats don't need it)

### Detailed Breakdown
- **85% Muscle Meat** - Various proteins
- **10% Organ Meat** - 5% liver, 5% other organs
- **5% Raw Edible Bone** - For calcium/phosphorus

### Protein Sources

**Best Proteins for Cats:**
1. **Chicken** - Great starter, widely available
2. **Turkey** - Lean, high in taurine
3. **Rabbit** - Novel protein, highly digestible
4. **Duck** - Rich in nutrients
5. **Quail** - Excellent nutrition, whole prey option
6. **Venison** - Novel protein for sensitive cats
7. **Fish** - Sardines, mackerel (1-2x weekly only)

**Proteins to Limit:**
- **Beef** - Can be constipating
- **Pork** - Risk of parasites (freeze 3 weeks first)
- **Fish** - Max 10-15% of diet (can cause B vitamin deficiency)

## Taurine: The Critical Nutrient

### Why It's Essential
- Cats cannot produce taurine
- Deficiency causes:
  - Dilated cardiomyopathy (heart failure)
  - Central retinal degeneration (blindness)
  - Reproductive issues
  - Immune deficiency

### Best Taurine Sources
1. **Heart meat** (any animal) - Highest concentration
2. **Dark chicken/turkey meat** - Thighs, legs
3. **Oysters** - Very high taurine
4. **Mussels** - High taurine
5. **Whole prey** - Mice, chicks, quail

### Daily Taurine Needs
- Adult cats: 200-300 mg/day
- Kittens: 400 mg/day
- Pregnant/nursing: 500 mg/day

### Ensuring Adequate Taurine
- Include heart in weekly rotation
- Use dark meat over white
- Feed whole prey occasionally
- Consider taurine supplement if uncertain

## Portion Sizing for Cats

### Adult Cats
- **Average indoor cat**: 2-3% of body weight daily
- **Active/outdoor cat**: 3-4% of body weight daily
- **Senior/sedentary**: 2-2.5% of body weight daily
- **Overweight**: 1.5-2% of ideal weight daily

### Example Portions (10 lb adult cat)
- 2% = 3.2 oz daily
- 3% = 4.8 oz daily
- 4% = 6.4 oz daily

### Kittens
- **8-16 weeks**: 6-8% of body weight
- **4-6 months**: 5-6% of body weight
- **6-12 months**: 3-4% of body weight

## Daily Sample Meals

### Meal Plan 1 (10 lb adult cat, 4 oz daily)

**Meal 1 (2 oz):**
- 1.7 oz chicken thigh
- 0.2 oz chicken liver
- 0.1 oz chicken wing tip

**Meal 2 (2 oz):**
- 1.8 oz turkey thigh
- 0.1 oz turkey heart
- 0.1 oz turkey neck

### Meal Plan 2 (Whole Prey Model)

**Daily:**
- 1 mouse or chick (3-4 oz)
OR
- 2 quail (4-5 oz total)

### Meal Plan 3 (Variety)

**Monday:**
- 3 oz chicken thigh
- 0.5 oz chicken heart
- 0.5 oz chicken wing

**Tuesday:**
- 3 oz rabbit
- 0.5 oz rabbit liver
- 0.5 oz rabbit bone-in rib

**Wednesday:**
- 2.5 oz turkey
- 1 oz sardines (for omega-3)
- 0.5 oz turkey neck

## Bones for Cats

### Safe Bone Options
- ✅ Chicken wing tips
- ✅ Chicken necks (chopped)
- ✅ Duck necks (chopped)
- ✅ Cornish hen parts
- ✅ Quail
- ✅ Rabbit ribs
- ✅ Fish bones (salmon, sardines)

### Bones to AVOID
- ❌ Weight-bearing bones (too hard)
- ❌ Beef bones
- ❌ Pork bones
- ❌ Cooked bones (splinter)
- ❌ Large bones that can't be chewed

### Bone Preparation
- Chop larger bones into smaller pieces
- Some cats prefer ground bone mixed in
- Monitor first few bone meals
- Remove if cat tries to swallow whole

## Organ Meats for Cats

### The 10% Rule
- 5% liver (vitamin A, copper, iron)
- 5% other organs

### Best Organs
1. **Liver** - Vitamin A powerhouse (but limit to 5%)
2. **Kidney** - B vitamins, iron
3. **Heart** - Taurine, CoQ10
4. **Brain** - Omega-3, phosphorus
5. **Spleen** - Iron, trace minerals
6. **Pancreas** - Digestive enzymes
7. **Thymus** - Immune support

### Organ Rotation Example
- **Week 1**: Chicken liver + heart
- **Week 2**: Turkey liver + kidney
- **Week 3**: Duck liver + gizzard
- **Week 4**: Beef liver + spleen

## Hydration for Cats

### Why It Matters
- Cats evolved in desert climates
- Low thirst drive
- Prone to urinary issues
- Need high moisture diet

### Water Content Goals
- **Raw food**: 70-75% moisture ✅
- **Wet food**: 75-78% moisture ✅
- **Dry kibble**: 10% moisture ❌

### Benefits of High Moisture
- Prevents urinary crystals
- Reduces kidney disease risk
- Supports kidney function
- Improves digestion
- Maintains healthy weight

### Additional Hydration
- Fresh water always available
- Water fountains encourage drinking
- Bone broth as treat
- Add water to meals if needed

## Common Feline Raw Feeding Challenges

### Challenge 1: Picky Eaters
**Solutions:**
- Transition very slowly (months if needed)
- Try different proteins
- Vary textures (ground vs. chunks)
- Add tuna juice or bonito flakes
- Warm to body temperature
- Feed when hungry

### Challenge 2: Refusing Bone
**Solutions:**
- Start with ground bone mixed in
- Try different bone types
- Poultry more acceptable than red meat bones
- Chop bones very small
- Some cats need fully ground

### Challenge 3: Constipation
**Causes:**
- Too much bone
- Not enough organ meat
- Dehydration

**Solutions:**
- Reduce bone percentage
- Add boneless meals
- Increase liver
- Add water to meals
- Consider canned pumpkin (1 tsp daily)

### Challenge 4: Loose Stools
**Causes:**
- Too much organ meat (especially liver)
- Fat too high
- Transition too fast
- New protein sensitivity

**Solutions:**
- Reduce organ meat
- Choose leaner proteins
- Slow down transition
- Try single protein for 2 weeks

## Foods Toxic to Cats

### Never Feed
- ❌ **Onions & Garlic** - Damages red blood cells
- ❌ **Grapes & Raisins** - Kidney failure
- ❌ **Chocolate** - Theobromine toxicity
- ❌ **Xylitol** - Hypoglycemia, liver failure
- ❌ **Raw dough** - Can rise in stomach
- ❌ **Alcohol** - Severe toxicity
- ❌ **Caffeine** - Heart/nervous system damage
- ❌ **Avocado** - Persin toxicity
- ❌ **Macadamia nuts** - Neurological issues
- ❌ **Raw salmon** - Parasite risk (freeze first)

### Safe Additions (Optional)
- ✅ **Raw egg yolk** - Biotin, healthy fats (1x weekly)
- ✅ **Fish oil** - Omega-3 (if not feeding fish)
- ✅ **Vitamin E** - Antioxidant (with fish oil)
- ✅ **Probiotics** - Gut health
- ✅ **Bone broth** - Hydration, minerals

## Supplements for Cats

### Usually NOT Needed
Raw diet with variety = complete nutrition

### Sometimes Beneficial
1. **Taurine supplement**
   - If diet lacks heart meat
   - 250-500 mg daily
   - Especially important

2. **Fish oil**
   - If not feeding fish regularly
   - Omega-3 for coat and joints
   - Include vitamin E

3. **Vitamin E**
   - Antioxidant
   - Protect against oxidation
   - Especially if feeding fish

4. **Probiotics**
   - During transition
   - After antibiotics
   - Senior cats

### Never Supplement Without Vet Approval
- ❌ Calcium (can cause imbalances)
- ❌ Vitamin A (toxicity risk from liver already)
- ❌ Vitamin D (toxicity risk)
- ❌ Multi-vitamins (can create imbalances)

## Transitioning Cats to Raw

### Timeline
Cats often take 4-12 weeks (or longer!)

### Step-by-Step
1. **Weeks 1-2**: Mix tiny amount raw with current food
2. **Weeks 3-4**: Gradually increase raw ratio
3. **Weeks 5-6**: 50/50 mix
4. **Weeks 7-8**: 75% raw, 25% old food
5. **Weeks 9+**: 100% raw

### Tips for Stubborn Cats
- Patience is everything
- Some cats take months
- Never force or starve
- Cats must eat within 24 hours
- Try freeze-dried raw as intermediate step
- Use commercial raw if homemade rejected

## Special Considerations

### Senior Cats
- May need softer food (ground)
- Monitor kidney function
- Slightly lower protein if kidney disease
- More frequent vet checks
- Adjust portions for activity level

### Cats with Urinary Issues
- Raw diet often improves condition
- High moisture content helps
- Monitor pH levels
- May need supplements
- Work with vet

### Diabetic Cats
- Low-carb raw diet ideal
- Can reduce insulin needs
- Monitor blood sugar closely
- Work with vet to adjust insulin
- High protein helps regulate glucose

### IBD/Food Sensitivities
- Novel proteins (rabbit, venison)
- Single protein for 4-6 weeks
- Very gradual transitions
- May need elimination diet
- Keep food diary

## Storage and Safety

### Freezer Storage
- Store at 0°F (-18°C)
- Use within 6-12 months
- Label with date
- Freeze new proteins 3 weeks (parasite control)

### Thawing
- Refrigerator thawing only
- 24 hours per pound
- Never leave at room temperature
- Use within 48 hours

### Serving
- Room temperature or slightly chilled
- Remove from fridge 15-20 min before
- Never microwave to warm
- Remove uneaten food after 30 minutes

## Monitoring Your Cat

### Signs of Thriving
- ✅ Shiny, soft coat
- ✅ Bright eyes
- ✅ Clean teeth
- ✅ Healthy weight
- ✅ Good energy
- ✅ Firm, small stools
- ✅ Good litter box habits
- ✅ Playful behavior

### Red Flags
- ⚠️ Weight loss or gain
- ⚠️ Persistent diarrhea
- ⚠️ Vomiting (more than hairballs)
- ⚠️ Lethargy
- ⚠️ Poor coat quality
- ⚠️ Urinary issues
- ⚠️ Not eating

## Conclusion

Cats thrive on raw diets because it matches their biological needs as obligate carnivores. Key points:

- **Taurine is critical** - Include heart meat
- **95%+ animal products** - No plant matter needed
- **High moisture** - Prevents urinary issues
- **Variety is key** - Rotate proteins weekly
- **Patience with picky cats** - Can take months
- **Monitor closely** - Watch weight and health

Your cat's wild ancestors ate whole prey - raw feeding mimics this perfectly!`
  }
];

export const categories = [
  'Getting Started',
  'Nutrition',
  'Safety',
  'Recipes',
  'Health',
  'Advanced'
] as const;

// Helper functions for article operations
export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find(article => article.slug === slug);
}

export function getArticlesByCategory(category: string): Article[] {
  return articles.filter(article => article.category === category);
}

export function getFeaturedArticles(): Article[] {
  return articles.filter(article => article.featured);
}

export function searchArticles(query: string): Article[] {
  const searchTerm = query.toLowerCase();
  return articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm) ||
    article.excerpt.toLowerCase().includes(searchTerm) ||
    article.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
    article.content.toLowerCase().includes(searchTerm)
  );
}
